// Cloudflare Worker 的實作（入口是 worker/index.mjs；Workers 入口只能匯出 handler，其他函式放這裡方便測試）。
// 網站本身仍是 dist/ 的靜態檔（有對應檔案時直接回傳，不經過這裡）。
// 這裡只處理兩件事：
// 1. /weather.json：排程每 3 小時抓一次 Open-Meteo，存進 KV（WEATHER），請求時從 KV 回傳。
// 2. /app-bundle/<id>/?href=<檔案>：Live Update「只下載有變的檔案」模式。外掛用 ?href= 指定檔案，
//    靜態檔不看 ?href=，所以由這裡轉成 /app-bundle/<id>/files/<檔案>，並從清單帶上 X-Checksum 讓外掛驗證。
import { WEATHER_CITIES } from '../src/data/weather-cities.mjs';
import { openMeteoUrl, toWeatherDocument } from '../src/lib/weather.mjs';

export const WEATHER_KEY = 'weather.json';
export const MANIFEST_NAME = 'capawesome-live-update-manifest.json';

const cors = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, HEAD' };

/** 排程：抓全部城市（一次請求），整理後寫進 KV。失敗就丟錯，KV 保留上一次的資料。 */
export async function refreshWeather(env, { fetchImpl = fetch, now = new Date() } = {}) {
	const response = await fetchImpl(openMeteoUrl(WEATHER_CITIES), { headers: { 'User-Agent': 'YogurtGuide weather job' } });
	if (!response.ok) throw new Error(`Open-Meteo 回應 ${response.status}`);
	const doc = toWeatherDocument(await response.json(), WEATHER_CITIES, now);
	await env.WEATHER.put(WEATHER_KEY, JSON.stringify(doc));
	return doc;
}

async function serveWeather(env) {
	let body = await env.WEATHER.get(WEATHER_KEY);
	// 剛部署、排程還沒跑過：當場抓一次（之後都由排程更新）。
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

const manifestCache = new Map();
async function checksumFor(env, origin, bundleId, href) {
	if (href === MANIFEST_NAME) return null;
	if (!manifestCache.has(bundleId)) {
		const res = await env.ASSETS.fetch(new Request(`${origin}/app-bundle/${bundleId}/files/${MANIFEST_NAME}`));
		const items = res.ok ? await res.json() : [];
		manifestCache.set(bundleId, new Map(items.map((item) => [item.href, item.checksum])));
	}
	return manifestCache.get(bundleId).get(href) ?? null;
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
	const checksum = await checksumFor(env, url.origin, bundleId, href);
	if (checksum) headers.set('X-Checksum', checksum);
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
