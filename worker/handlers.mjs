// Cloudflare Worker 的實作（入口是 worker/index.mjs；Workers 入口只能匯出 handler，其他函式放這裡方便測試）。
// 網站本身仍是 dist/ 的靜態檔（有對應檔案時直接回傳，不經過這裡）。
// 這裡只處理兩件事：
// 1. /weather.json：排程每小時抓一組城市的 MET Norway 預報（每個城市每 3 小時一次），併進 KV（WEATHER），請求時從 KV 回傳。
// 2. /app-bundle/<id>/?href=<檔案>：Live Update「只下載有變的檔案」模式。外掛用 ?href= 指定檔案，
//    靜態檔不看 ?href=，所以由這裡轉成 /app-bundle/<id>/files/<檔案>，並帶上 X-Checksum（清單）與
//    X-Signature（app-bundle/<id>/signatures.json，建置時用私鑰簽的）讓外掛驗證。
import { WEATHER_CITIES } from '../src/data/weather-cities.mjs';
import { MET_USER_AGENT, citiesForGroup, hourlyFromMetNo, mergeWeatherDocument, metNoUrl, weatherGroupFor } from '../src/lib/weather.mjs';

export const WEATHER_KEY = 'weather.json';
export const MANIFEST_NAME = 'capawesome-live-update-manifest.json';
export const SIGNATURES_NAME = 'signatures.json';

const cors = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, HEAD' };

/**
 * 排程：抓這一組城市（一個城市一個請求），併進 KV 裡上一份 weather.json。
 * 個別城市失敗就沿用它上一次的資料；整組都失敗才丟錯（KV 不動）。
 */
export async function refreshWeather(env, { fetchImpl = fetch, now = new Date(), group = weatherGroupFor(now) } = {}) {
	const cities = citiesForGroup(group, WEATHER_CITIES);
	const results = await Promise.all(
		cities.map(async (city) => {
			try {
				const res = await fetchImpl(metNoUrl(city), {
					headers: { 'User-Agent': MET_USER_AGENT, Accept: 'application/json', 'Accept-Encoding': 'gzip, deflate' },
				});
				if (!res.ok) throw new Error(`MET 回應 ${res.status}`);
				return [city.id, hourlyFromMetNo(await res.json())];
			} catch (error) {
				console.error(`天氣 ${city.id} 更新失敗：${error.message}`);
				return null;
			}
		}),
	);
	const updates = Object.fromEntries(results.filter(Boolean));
	if (!Object.keys(updates).length) throw new Error(`第 ${group} 組城市全部更新失敗`);
	const previous = await env.WEATHER.get(WEATHER_KEY).then((t) => (t ? JSON.parse(t) : null)).catch(() => null);
	const doc = mergeWeatherDocument(previous, updates, now, WEATHER_CITIES);
	await env.WEATHER.put(WEATHER_KEY, JSON.stringify(doc));
	return doc;
}

async function serveWeather(env) {
	let body = await env.WEATHER.get(WEATHER_KEY);
	// 剛部署、排程還沒跑過：當場抓這一小時的那組城市（其他城市等之後的排程補上）。
	if (!body) body = await refreshWeather(env).then((doc) => JSON.stringify(doc)).catch(() => null);
	if (!body) return new Response('{"error":"weather not ready"}', { status: 503, headers: { ...cors, 'Content-Type': 'application/json' } });
	return new Response(body, {
		headers: { ...cors, 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'public, max-age=600' },
	});
}

/** href 只能是 bundle 裡的相對路徑。 */
export function safeHref(href) {
	if (!href || href.startsWith('/') || href.includes('\\')) return null;
	const parts = href.split('/');
	if (parts.some((p) => p === '' || p === '.' || p === '..')) return null;
	return href;
}

/** 每個網頁包的檢查碼與簽章（同一個 Worker 執行個體內快取）。 */
const bundleCache = new Map();
async function bundleInfo(env, origin, bundleId) {
	if (!bundleCache.has(bundleId)) {
		const read = async (path, fallback) => {
			const res = await env.ASSETS.fetch(new Request(`${origin}/app-bundle/${bundleId}/${path}`));
			return res.ok ? res.json() : fallback;
		};
		const [items, signatures] = await Promise.all([read(`files/${MANIFEST_NAME}`, []), read(SIGNATURES_NAME, {})]);
		bundleCache.set(bundleId, { checksums: new Map(items.map((item) => [item.href, item.checksum])), signatures });
	}
	return bundleCache.get(bundleId);
}

/** 靜態檔可能把 .../index.html 轉址到 .../，這裡跟著轉一次，讓外掛拿到檔案本身。 */
async function fetchAsset(env, url) {
	let res = await env.ASSETS.fetch(new Request(url));
	if (res.status >= 300 && res.status < 400 && res.headers.get('Location')) {
		res = await env.ASSETS.fetch(new Request(new URL(res.headers.get('Location'), url)));
	}
	return res;
}

async function serveBundleFile(request, env, bundleId) {
	const url = new URL(request.url);
	const href = safeHref(url.searchParams.get('href'));
	if (!href || !/^[\w.-]+$/.test(bundleId)) return new Response('bad request', { status: 400 });
	const asset = await fetchAsset(env, `${url.origin}/app-bundle/${bundleId}/files/${href}`);
	if (!asset.ok) return new Response('not found', { status: 404 });
	const headers = new Headers(asset.headers);
	headers.set('Cache-Control', 'public, max-age=31536000, immutable');
	const { checksums, signatures } = await bundleInfo(env, url.origin, bundleId);
	const checksum = href === MANIFEST_NAME ? null : checksums.get(href);
	if (checksum) headers.set('X-Checksum', checksum);
	if (signatures[href]) headers.set('X-Signature', signatures[href]);
	return new Response(asset.body, { status: 200, headers });
}

export const handlers = {
	async fetch(request, env) {
		const url = new URL(request.url);
		if (url.pathname === '/weather.json') return serveWeather(env);
		const bundle = url.pathname.match(/^\/app-bundle\/([^/]+)\/?$/);
		if (bundle && url.searchParams.has('href')) return serveBundleFile(request, env, bundle[1]);
		return env.ASSETS.fetch(request);
	},
	async scheduled(_controller, env, ctx) {
		ctx.waitUntil(refreshWeather(env));
	},
};
