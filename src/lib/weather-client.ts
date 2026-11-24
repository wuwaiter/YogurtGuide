// App 端讀天氣：直接讀 Cloudflare 上的 weather.json（不走 Live Update），存在手機裡，超過 1 小時才重抓。
// 沒網路時用手機裡上次的資料（24 小時內）。規則在 weather.mjs（有測試）。
import { WEATHER_URL, weatherFreshness } from './weather.mjs';

const CACHE_KEY = 'yogurtguide.weather';

function readCache(): { fetchedAt: number; doc: any } | null {
	try {
		return JSON.parse(localStorage.getItem(CACHE_KEY) ?? 'null');
	} catch {
		return null;
	}
}

/** 回傳 weather.json 的內容；拿不到就回傳 null。 */
export async function getWeather(): Promise<any | null> {
	const cached = readCache();
	const state = weatherFreshness(cached);
	if (state === 'fresh') return cached!.doc;
	try {
		const res = await fetch(WEATHER_URL, { cache: 'no-store' });
		if (!res.ok) throw new Error(String(res.status));
		const doc = await res.json();
		try {
			localStorage.setItem(CACHE_KEY, JSON.stringify({ fetchedAt: Date.now(), doc }));
		} catch {
			// 存不了就下次再抓
		}
		return doc;
	} catch {
		return state === 'refresh' ? cached!.doc : null;
	}
}
