// 天氣：Worker 端（抓 Open-Meteo、整理成 weather.json）與 App 端（挑城市、算平均溫度）共用的規則。
// 不碰網路以外的環境，方便 node --test。資料授權 CC BY 4.0，畫面上顯示天氣的地方要放 WEATHER_ATTRIBUTION。
import { WEATHER_CITIES } from '../data/weather-cities.mjs';

export const WEATHER_URL = 'https://yogurtguide.wuwaiter.com/weather.json';
export const WEATHER_SCHEMA_VERSION = 1;
/** App 端快取多久才重抓（Worker 每 3 小時更新一次）。 */
export const WEATHER_MAX_AGE_MS = 60 * 60 * 1000;
/** 資料超過這麼久就不用（例如一直沒網路）。 */
export const WEATHER_STALE_MS = 24 * 60 * 60 * 1000;
export const WEATHER_ATTRIBUTION = { text: 'Weather data by Open-Meteo.com', url: 'https://open-meteo.com/' };

/** Open-Meteo 一次抓全部城市的網址：每小時氣溫、今天起 3 天、時間用 Unix 秒（UTC）。 */
export function openMeteoUrl(cities = WEATHER_CITIES) {
	const params = new URLSearchParams({
		latitude: cities.map((c) => c.lat).join(','),
		longitude: cities.map((c) => c.lon).join(','),
		hourly: 'temperature_2m',
		forecast_days: '3',
		timeformat: 'unixtime',
		timezone: 'GMT',
	});
	return `https://api.open-meteo.com/v1/forecast?${params}`;
}

/**
 * Open-Meteo 回應 → weather.json。多個地點時回應是陣列，順序和請求一樣。
 * 只留每個城市的開始時間與每小時氣溫（四捨五入到 0.1°C），檔案比較小。
 */
export function toWeatherDocument(response, cities = WEATHER_CITIES, now = new Date()) {
	const list = Array.isArray(response) ? response : [response];
	if (list.length !== cities.length) throw new Error(`Open-Meteo 回了 ${list.length} 個地點，預期 ${cities.length} 個`);
	return {
		schemaVersion: WEATHER_SCHEMA_VERSION,
		generatedAt: now.toISOString(),
		attribution: WEATHER_ATTRIBUTION,
		license: 'CC BY 4.0（https://creativecommons.org/licenses/by/4.0/），經 YogurtGuide 整理（取每小時氣溫、四捨五入）',
		cities: Object.fromEntries(
			cities.map((city, i) => {
				const hourly = list[i]?.hourly;
				if (!hourly?.time?.length) throw new Error(`${city.id} 沒有每小時資料`);
				return [
					city.id,
					{
						start: hourly.time[0],
						temps: hourly.temperature_2m.map((t) => (t == null ? null : Math.round(t * 10) / 10)),
					},
				];
			}),
		),
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
