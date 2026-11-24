// App 設定（只存在這支手機的 localStorage）。畫面在 src/pages/settings.astro。
import { KINDS } from './records/model.mjs';

export const SETTINGS_KEY = 'yogurtguide.settings';
export const SNOOZE_MIN_HOURS = 0.5;
export const SNOOZE_MAX_HOURS = 48;

/** 有「延後」按鈕的發酵類型，和它們的預設延後時數。 */
export function snoozeKinds() {
	return Object.entries(KINDS)
		.filter(([, k]) => k.snoozeHours != null)
		.map(([kind, k]) => ({ kind, label: k.label, defaultHours: k.snoozeHours }));
}

/** 延後時數只收 0.5–48、以 0.5 為單位；其他值回傳 null（用預設）。 */
export function cleanSnoozeHours(value) {
	if (value === '' || value == null) return null;
	const n = Math.round(Number(value) * 2) / 2;
	return Number.isFinite(n) && n >= SNOOZE_MIN_HOURS && n <= SNOOZE_MAX_HOURS ? n : null;
}

/** 讀設定（壞掉的 JSON、未知欄位一律忽略）。 */
export function parseSettings(raw) {
	let data = {};
	try {
		data = JSON.parse(raw ?? '{}') ?? {};
	} catch {
		data = {};
	}
	const snoozeHours = {};
	for (const { kind, defaultHours } of snoozeKinds()) {
		snoozeHours[kind] = cleanSnoozeHours(data.snoozeHours?.[kind]) ?? defaultHours;
	}
	return { snoozeHours };
}

/** 某類型的延後時數；沒有延後按鈕的類型回傳 null。 */
export function snoozeHoursFor(settings, kind) {
	return KINDS[kind]?.snoozeHours == null ? null : (settings.snoozeHours?.[kind] ?? KINDS[kind].snoozeHours);
}

export function loadSettings() {
	try {
		return parseSettings(globalThis.localStorage?.getItem(SETTINGS_KEY));
	} catch {
		return parseSettings(null);
	}
}

export function saveSettings(settings) {
	globalThis.localStorage?.setItem(SETTINGS_KEY, JSON.stringify(settings));
}
