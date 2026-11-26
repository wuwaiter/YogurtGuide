// 天氣：Worker 端（抓 MET Norway、整理成 weather.json）與 App 端（挑城市、算平均溫度）共用的規則。
// 不碰網路以外的環境，方便 node --test。
// 資料來源 MET Norway（挪威氣象局）Locationforecast 2.0，授權 NLOD 2.0 與 CC BY 4.0，都允許商用；
// 條件是標示出處（WEATHER_ATTRIBUTION）、附授權連結、說明有整理過。https://api.met.no/doc/License
// 使用條款：要帶能識別我們的 User-Agent；同一個地點（北歐以外）最多每 3 小時抓一次。https://api.met.no/doc/TermsOfService
import { WEATHER_CITIES } from '../data/weather-cities.mjs';

export const WEATHER_URL = 'https://yogurtguide.wuwaiter.com/weather.json';
export const WEATHER_SCHEMA_VERSION = 1;
/** App 端快取多久才重抓（Worker 每小時更新三分之一的城市，每個城市每 3 小時更新一次）。 */
export const WEATHER_MAX_AGE_MS = 60 * 60 * 1000;
/** 資料超過這麼久就不用（例如一直沒網路）。 */
export const WEATHER_STALE_MS = 24 * 60 * 60 * 1000;
export const WEATHER_ATTRIBUTION = { text: 'Data from MET Norway', url: 'https://api.met.no/' };
export const WEATHER_LICENSE =
	'NLOD 2.0（https://data.norge.no/nlod/en/2.0）與 CC BY 4.0（https://creativecommons.org/licenses/by/4.0/），經 YogurtGuide 整理（取每小時氣溫、6 小時間隔的時段用線性內插、四捨五入到 0.1°C）';
/** MET Norway 要求的識別用 User-Agent：App 名稱、版本、網站。 */
export const MET_USER_AGENT = 'YogurtGuide/1.0 https://yogurtguide.wuwaiter.com/';
/** 每個城市保留幾小時的預報。 */
export const WEATHER_HOURS = 72;
/**
 * 城市分幾組輪流抓：Worker 每小時跑一次、抓一組。
 * 一組的請求數要低於 Cloudflare Workers 免費方案每次執行 50 個對外請求的上限；每個城市每 3 小時更新一次，符合 MET 的頻率限制。
 */
export const WEATHER_GROUPS = 3;

/** 第幾組（依 UTC 的小時輪流）。 */
export function weatherGroupFor(now = new Date()) {
	return Math.floor(now.getTime() / 3_600_000) % WEATHER_GROUPS;
}

/** 這一組的城市（依清單順序取餘數分組）。 */
export function citiesForGroup(group, cities = WEATHER_CITIES) {
	return cities.filter((_, i) => i % WEATHER_GROUPS === group);
}

/** MET 的座標最多 4 位小數。 */
const coord = (n) => String(Math.round(n * 10_000) / 10_000);

/** 一個城市的 Locationforecast（compact）網址。 */
export function metNoUrl(city) {
	return `https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${coord(city.lat)}&lon=${coord(city.lon)}`;
}

/**
 * MET 回應 → { start, temps }：從第一個整點開始的每小時氣溫，共 WEATHER_HOURS 小時。
 * 前約 60 小時是每小時一筆，之後是每 6 小時一筆，中間用線性內插；超過資料範圍填 null。
 */
export function hourlyFromMetNo(json, hours = WEATHER_HOURS) {
	const points = (json?.properties?.timeseries ?? [])
		.map((p) => ({ t: Date.parse(p.time) / 1000, v: p.data?.instant?.details?.air_temperature }))
		.filter((p) => Number.isFinite(p.t) && typeof p.v === 'number')
		.sort((a, b) => a.t - b.t);
	if (!points.length) throw new Error('MET 回應沒有氣溫資料');
	const start = Math.ceil(points[0].t / 3600) * 3600;
	const temps = [];
	let j = 0;
	for (let h = 0; h < hours; h++) {
		const t = start + h * 3600;
		while (j < points.length - 1 && points[j + 1].t <= t) j++;
		const a = points[j];
		const b = points[j + 1];
		let v = null;
		if (a.t === t) v = a.v;
		else if (b && a.t < t && t < b.t) v = a.v + ((b.v - a.v) * (t - a.t)) / (b.t - a.t);
		temps.push(v == null ? null : Math.round(v * 10) / 10);
	}
	return { start, temps };
}

/**
 * 把這次抓到的城市併進上一份 weather.json（其他組的城市沿用上一次的資料）。
 * 不在城市清單裡的舊城市會被拿掉。
 */
export function mergeWeatherDocument(previous, updates, now = new Date(), cities = WEATHER_CITIES) {
	const merged = {};
	for (const city of cities) {
		const entry = updates[city.id] ?? previous?.cities?.[city.id];
		if (entry) merged[city.id] = entry;
	}
	return {
		schemaVersion: WEATHER_SCHEMA_VERSION,
		generatedAt: now.toISOString(),
		attribution: WEATHER_ATTRIBUTION,
		license: WEATHER_LICENSE,
		cities: merged,
	};
}

/** 某城市在 [from, from + hours] 這段時間的平均氣溫；資料涵蓋不到就回傳 null。 */
export function averageTemp(doc, cityId, from = new Date(), hours = 1) {
	const entry = doc?.cities?.[cityId];
	if (!entry) return null;
	const startIndex = Math.floor((from.getTime() / 1000 - entry.start) / 3600);
	const count = Math.max(1, Math.ceil(Number(hours) || 1));
	if (startIndex < 0 || startIndex >= entry.temps.length) return null;
	const slice = entry.temps.slice(startIndex, startIndex + count).filter((t) => t != null);
	if (!slice.length) return null;
	return Math.round((slice.reduce((a, b) => a + b, 0) / slice.length) * 2) / 2;
}

/** 手機裡存的天氣還能不能用、要不要重抓。 */
export function weatherFreshness(cached, now = Date.now()) {
	if (!cached?.fetchedAt || !cached.doc) return 'none';
	const age = now - cached.fetchedAt;
	if (age < WEATHER_MAX_AGE_MS) return 'fresh';
	const generated = Date.parse(cached.doc.generatedAt);
	return now - generated < WEATHER_STALE_MS ? 'refresh' : 'stale';
}

export function cityById(id) {
	return WEATHER_CITIES.find((c) => c.id === id) ?? null;
}
