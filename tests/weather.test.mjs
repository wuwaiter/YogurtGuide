import test from 'node:test';
import assert from 'node:assert/strict';
import { WEATHER_CITIES } from '../src/data/weather-cities.mjs';
import {
	WEATHER_GROUPS,
	averageTemp,
	citiesForGroup,
	hourlyFromMetNo,
	mergeWeatherDocument,
	metNoUrl,
	weatherFreshness,
	weatherGroupFor,
} from '../src/lib/weather.mjs';
import { parseSettings } from '../src/lib/settings.mjs';
import { MANIFEST_NAME, WEATHER_KEY, handlers as worker, refreshWeather, safeHref } from '../worker/handlers.mjs';
import entry from '../worker/index.mjs';
import { MANIFEST_NAME as BUILD_MANIFEST_NAME, buildManifest, categorySummary } from '../scripts/build-app.mjs';

const start = Date.UTC(2026, 10, 24) / 1000; // 2026-11-24 00:00 UTC
const iso = (sec) => new Date(sec * 1000).toISOString().replace('.000', '');
/** MET Locationforecast compact 的樣子：前 60 小時每小時一筆，之後每 6 小時一筆。 */
const fakeMet = (base = 20) => ({
	properties: {
		timeseries: [
			...Array.from({ length: 60 }, (_, h) => ({ time: iso(start + h * 3600), data: { instant: { details: { air_temperature: base + h * 0.1 } } } })),
			{ time: iso(start + 66 * 3600), data: { instant: { details: { air_temperature: base + 12 } } } },
			{ time: iso(start + 72 * 3600), data: { instant: { details: { air_temperature: base + 6 } } } },
		],
	},
});

test('城市清單：台灣 22 縣市、美國 50 城、id 不重複、免費額度內', () => {
	assert.equal(WEATHER_CITIES.filter((c) => c.country === 'TW').length, 22);
	assert.equal(WEATHER_CITIES.filter((c) => c.country === 'US').length, 50);
	assert.equal(new Set(WEATHER_CITIES.map((c) => c.id)).size, WEATHER_CITIES.length);
	// 分 3 組，每組的請求數要低於 Workers 免費方案每次執行 50 個對外請求的上限
	for (let g = 0; g < WEATHER_GROUPS; g++) assert.ok(citiesForGroup(g).length < 50);
	assert.equal([0, 1, 2].flatMap((g) => citiesForGroup(g)).length, WEATHER_CITIES.length);
	for (const c of WEATHER_CITIES) assert.ok(Math.abs(c.lat) <= 90 && Math.abs(c.lon) <= 180, c.id);
});

test('MET 網址：座標最多 4 位小數、每小時輪一組', () => {
	const url = new URL(metNoUrl({ lat: 25.0412345, lon: 121.5654321 }));
	assert.equal(url.hostname, 'api.met.no');
	assert.equal(url.searchParams.get('lat'), '25.0412');
	assert.equal(url.searchParams.get('lon'), '121.5654');
	assert.equal(weatherGroupFor(new Date('2026-11-24T00:00:00Z')), (Date.UTC(2026, 10, 24) / 3_600_000) % 3);
	assert.notEqual(weatherGroupFor(new Date('2026-11-24T00:00:00Z')), weatherGroupFor(new Date('2026-11-24T01:00:00Z')));
});

test('MET 回應 → 每小時氣溫：6 小時間隔的時段內插、超出範圍是 null', () => {
	const { start: s0, temps } = hourlyFromMetNo(fakeMet(20), 74);
	assert.equal(s0, start);
	assert.equal(temps[0], 20);
	assert.equal(temps[59], 25.9);
	assert.equal(temps[63], 29.4); // 59 小時 25.9 → 66 小時 32，內插 4/7
	assert.equal(temps[66], 32);
	assert.equal(temps[69], 29); // 66 小時 32 → 72 小時 26
	assert.equal(temps[73], null);
	assert.throws(() => hourlyFromMetNo({ properties: { timeseries: [] } }));
});

test('weather.json：這組的城市換新、其他城市沿用上一次；帶 MET 出處', () => {
	const now = new Date('2026-11-24T01:00:00Z');
	const old = { cities: { 'tw-taipei': { start: 1, temps: [1] }, 'tw-new-taipei': { start: 1, temps: [2] }, gone: { start: 1, temps: [3] } } };
	const doc = mergeWeatherDocument(old, { 'tw-taipei': { start, temps: [9] } }, now);
	assert.deepEqual(doc.cities['tw-taipei'], { start, temps: [9] });
	assert.deepEqual(doc.cities['tw-new-taipei'], { start: 1, temps: [2] });
	assert.equal(doc.cities.gone, undefined);
	assert.equal(doc.attribution.text, 'Data from MET Norway');
	assert.equal(doc.generatedAt, now.toISOString());
});

test('平均氣溫：取預計發酵這段時間；超出資料範圍回傳 null', () => {
	const doc = { cities: { x: { start, temps: [10, 20, 30, 40] } } };
	assert.equal(averageTemp(doc, 'x', new Date(start * 1000), 2), 15);
	assert.equal(averageTemp(doc, 'x', new Date(start * 1000 + 3600_000 * 1.5), 2), 25);
	assert.equal(averageTemp(doc, 'x', new Date(start * 1000), 10), 25); // 只算到資料結尾
	assert.equal(averageTemp(doc, 'x', new Date(start * 1000 - 3600_000), 2), null);
	assert.equal(averageTemp(doc, 'nope', new Date(start * 1000), 2), null);
});

test('手機快取：1 小時內不重抓，24 小時內沒網路還能用', () => {
	const now = Date.parse('2026-11-24T12:00:00Z');
	const doc = { generatedAt: '2026-11-24T09:00:00Z' };
	assert.equal(weatherFreshness(null, now), 'none');
	assert.equal(weatherFreshness({ fetchedAt: now - 10 * 60_000, doc }, now), 'fresh');
	assert.equal(weatherFreshness({ fetchedAt: now - 2 * 3600_000, doc }, now), 'refresh');
	assert.equal(weatherFreshness({ fetchedAt: now - 2 * 3600_000, doc: { generatedAt: '2026-11-22T00:00:00Z' } }, now), 'stale');
});

test('設定：城市只收清單裡的 id', () => {
	assert.equal(parseSettings('{"cityId":"tw-taipei"}').cityId, 'tw-taipei');
	assert.equal(parseSettings('{"cityId":"mars"}').cityId, null);
	assert.equal(parseSettings(null).cityId, null);
});

function fakeEnv(assets = {}) {
	const kv = new Map();
	return {
		kv,
		WEATHER: { get: async (k) => kv.get(k) ?? null, put: async (k, v) => void kv.set(k, v) },
		ASSETS: {
			fetch: async (req) => {
				const path = new URL(req.url).pathname;
				if (path.endsWith('/index.html') && assets[path.replace(/index\.html$/, '')] != null) {
					return new Response(null, { status: 307, headers: { Location: path.replace(/index\.html$/, '') } });
				}
				return assets[path] != null ? new Response(assets[path]) : new Response('nf', { status: 404 });
			},
		},
	};
}

test('Worker 排程：每個城市帶識別用 User-Agent 抓 MET，輪完 3 組全部城市都有；/weather.json 允許跨網域', async () => {
	const env = fakeEnv();
	const agents = new Set();
	const fetchImpl = async (url, init) => {
		agents.add(init.headers['User-Agent']);
		assert.match(url, /^https:\/\/api\.met\.no\/weatherapi\/locationforecast\/2\.0\/compact\?/);
		return new Response(JSON.stringify(fakeMet()));
	};
	for (let group = 0; group < 3; group++) await refreshWeather(env, { fetchImpl, group });
	assert.deepEqual([...agents], ['YogurtGuide/1.0 https://yogurtguide.wuwaiter.com/']);
	// 一組全部失敗：丟錯、KV 不動（模擬的失敗訊息不印出來，免得看起來像真的出錯）
	const before = env.kv.get(WEATHER_KEY);
	const logged = [];
	const originalError = console.error;
	console.error = (msg) => logged.push(msg);
	try {
		await assert.rejects(refreshWeather(env, { fetchImpl: async () => new Response('x', { status: 500 }), group: 0 }));
	} finally {
		console.error = originalError;
	}
	assert.ok(logged.length > 0 && logged.every((m) => /更新失敗：MET 回應 500/.test(m)));
	assert.equal(env.kv.get(WEATHER_KEY), before);
	const res = await worker.fetch(new Request('https://yogurtguide.wuwaiter.com/weather.json'), env);
	assert.equal(res.status, 200);
	assert.equal(res.headers.get('Access-Control-Allow-Origin'), '*');
	assert.equal(Object.keys((await res.json()).cities).length, WEATHER_CITIES.length);
});

test('Worker Live Update：?href= 轉成 files/ 底下的檔案，帶 X-Checksum；index.html 轉址也跟著拿到內容', async () => {
	const manifest = [
		{ href: 'index.html', checksum: 'aaa', sizeInBytes: 4 },
		{ href: 'powders/a.jpg', checksum: 'bbb', sizeInBytes: 3 },
	];
	const env = fakeEnv({
		'/app-bundle/c1/files/': 'home',
		'/app-bundle/c1/files/powders/a.jpg': 'jpg',
		[`/app-bundle/c1/files/${MANIFEST_NAME}`]: JSON.stringify(manifest),
	});
	const get = (href) => worker.fetch(new Request(`https://yogurtguide.wuwaiter.com/app-bundle/c1/?href=${encodeURIComponent(href)}`), env);

	const img = await get('powders/a.jpg');
	assert.equal(await img.text(), 'jpg');
	assert.equal(img.headers.get('X-Checksum'), 'bbb');

	const home = await get('index.html');
	assert.equal(await home.text(), 'home');
	assert.equal(home.headers.get('X-Checksum'), 'aaa');

	const list = await get(MANIFEST_NAME);
	assert.equal(list.status, 200);
	assert.equal(list.headers.get('X-Checksum'), null);

	assert.equal((await get('../secret')).status, 400);
	assert.equal((await get('nope.png')).status, 404);
});

test('Worker 入口只匯出 handler（Workers 不接受其他匯出）', () => {
	assert.equal(typeof entry.fetch, 'function');
	assert.equal(typeof entry.scheduled, 'function');
});

test('safeHref 擋掉跳出資料夾的路徑', () => {
	assert.equal(safeHref('batches/b022/01.png'), 'batches/b022/01.png');
	for (const bad of ['', '/etc/passwd', '../x', 'a/../b', 'a//b', 'a\\b']) assert.equal(safeHref(bad), null, bad);
});

test('檔案清單：每個檔案的 SHA-256 與大小、不含清單本身；依分類資料夾統計', () => {
	const enc = (s) => new TextEncoder().encode(s);
	const manifest = buildManifest({
		'index.html': enc('home'),
		'powders/a.jpg': enc('jpg'),
		'powders/b.jpg': enc('jpg2'),
		'batches/b022/01.png': enc('png'),
		[BUILD_MANIFEST_NAME]: enc('[]'),
	});
	assert.deepEqual(manifest.map((m) => m.href), ['batches/b022/01.png', 'index.html', 'powders/a.jpg', 'powders/b.jpg']);
	assert.equal(manifest[1].checksum, '4ea140588150773ce3aace786aeef7f4049ce100fa649c94fbbddb960f1da942');
	assert.equal(manifest[2].sizeInBytes, 3);
	assert.deepEqual(categorySummary(manifest), {
		batches: { files: 1, bytes: 3 },
		pages: { files: 1, bytes: 4 },
		powders: { files: 2, bytes: 7 },
	});
	assert.equal(BUILD_MANIFEST_NAME, MANIFEST_NAME);
});

test('Live Update 簽章：Worker 依 signatures.json 帶 X-Signature（清單檔也要有），簽章能用公鑰驗過', async () => {
	const { generateKeyPairSync } = await import('node:crypto');
	const { signBytes, verifyBytes } = await import('../scripts/build-app.mjs');
	const { publicKey, privateKey } = generateKeyPairSync('rsa', { modulusLength: 2048 });
	const pub = publicKey.export({ type: 'spki', format: 'pem' });
	const manifestText = JSON.stringify([{ href: 'index.html', checksum: 'aaa', sizeInBytes: 4 }]);
	const signatures = { 'index.html': signBytes(Buffer.from('home'), privateKey), [MANIFEST_NAME]: signBytes(Buffer.from(manifestText), privateKey) };
	const env = fakeEnv({
		'/app-bundle/s1/files/': 'home',
		[`/app-bundle/s1/files/${MANIFEST_NAME}`]: manifestText,
		'/app-bundle/s1/signatures.json': JSON.stringify(signatures),
	});
	const get = (href) => worker.fetch(new Request(`https://yogurtguide.wuwaiter.com/app-bundle/s1/?href=${encodeURIComponent(href)}`), env);
	const home = await get('index.html');
	assert.equal(home.headers.get('X-Signature'), signatures['index.html']);
	assert.ok(verifyBytes(Buffer.from(await home.text()), home.headers.get('X-Signature'), pub));
	const manifest = await get(MANIFEST_NAME);
	assert.equal(manifest.headers.get('X-Checksum'), null);
	assert.ok(verifyBytes(Buffer.from(await manifest.text()), manifest.headers.get('X-Signature'), pub));
	assert.equal(verifyBytes(Buffer.from('tampered'), signatures['index.html'], pub), false);
});
