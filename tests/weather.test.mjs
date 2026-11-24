import test from 'node:test';
import assert from 'node:assert/strict';
import { WEATHER_CITIES } from '../src/data/weather-cities.mjs';
import { averageTemp, openMeteoUrl, toWeatherDocument, weatherFreshness } from '../src/lib/weather.mjs';
import { parseSettings } from '../src/lib/settings.mjs';
import { MANIFEST_NAME, WEATHER_KEY, handlers as worker, refreshWeather, safeHref } from '../worker/handlers.mjs';
import entry from '../worker/index.mjs';
import { MANIFEST_NAME as BUILD_MANIFEST_NAME, buildManifest, categorySummary } from '../scripts/build-app.mjs';

const start = Date.UTC(2026, 10, 24) / 1000; // 2026-11-24 00:00 UTC
const fakeResponse = (cities) =>
	cities.map((_, i) => ({ hourly: { time: Array.from({ length: 72 }, (_, h) => start + h * 3600), temperature_2m: Array.from({ length: 72 }, (_, h) => 20 + (h % 24) / 4 + i * 0.01) } }));

test('城市清單：台灣 22 縣市、美國 50 城、id 不重複、免費額度內', () => {
	assert.equal(WEATHER_CITIES.filter((c) => c.country === 'TW').length, 22);
	assert.equal(WEATHER_CITIES.filter((c) => c.country === 'US').length, 50);
	assert.equal(new Set(WEATHER_CITIES.map((c) => c.id)).size, WEATHER_CITIES.length);
	// 每 3 小時一次 = 一天 8 次，每個城市算 1 次
	assert.ok(WEATHER_CITIES.length * 8 < 10_000 * 0.5);
	for (const c of WEATHER_CITIES) assert.ok(Math.abs(c.lat) <= 90 && Math.abs(c.lon) <= 180, c.id);
});

test('Open-Meteo 網址：全部城市一次抓、每小時氣溫', () => {
	const url = new URL(openMeteoUrl());
	assert.equal(url.searchParams.get('latitude').split(',').length, WEATHER_CITIES.length);
	assert.equal(url.searchParams.get('hourly'), 'temperature_2m');
	assert.equal(url.searchParams.get('timeformat'), 'unixtime');
});

test('weather.json：每個城市一筆、帶出處；地點數對不上就丟錯', () => {
	const doc = toWeatherDocument(fakeResponse(WEATHER_CITIES), WEATHER_CITIES, new Date('2026-11-24T01:00:00Z'));
	assert.equal(Object.keys(doc.cities).length, WEATHER_CITIES.length);
	assert.equal(doc.attribution.text, 'Weather data by Open-Meteo.com');
	assert.equal(doc.cities['tw-taipei'].start, start);
	assert.throws(() => toWeatherDocument(fakeResponse([1]), WEATHER_CITIES));
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

test('Worker 排程：抓 Open-Meteo 寫進 KV；/weather.json 從 KV 回傳並允許跨網域', async () => {
	const env = fakeEnv();
	const fetchImpl = async () => new Response(JSON.stringify(fakeResponse(WEATHER_CITIES)));
	await refreshWeather(env, { fetchImpl });
	assert.ok(env.kv.get(WEATHER_KEY));
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
