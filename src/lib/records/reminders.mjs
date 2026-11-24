// 發酵提醒的規則（不碰外掛，方便測試）。外掛呼叫在 src/lib/records/notify.ts。
// 規格見 md/AppPlan.md「計時與提醒」：時間到提醒去看凝固；有 snoozeHours 的類型（目前 Kefir）可一鍵延後。
// 每筆紀錄各自一個通知 id，所以可以同時有很多筆在發酵（優格、Kefir，之後的泡菜、酸種），互不覆蓋。
import { KINDS, lineName } from './model.mjs';

export const SNOOZE_ACTION = 'snooze';

/** 通知按鈕組 id：每個有延後按鈕的類型一組，按鈕文字帶各自的時數。 */
export function actionTypeIdFor(kind) {
	return KINDS[kind]?.snoozeHours == null ? undefined : `snooze-${kind}`;
}

/** 紀錄 id → 通知 id（Android 要正整數，32 位元以內）。同一筆紀錄永遠同一個 id，重排就會覆蓋。 */
export function notificationId(recordId) {
	let h = 0x811c9dc5;
	for (const ch of String(recordId)) {
		h ^= ch.codePointAt(0);
		h = Math.imul(h, 0x01000193);
	}
	return (h & 0x7fffffff) || 1;
}

/** 通知內容。 */
export function reminderContent(record) {
	const snooze = KINDS[record.kind]?.snoozeHours != null;
	return {
		id: notificationId(record.id),
		title: lineName(record),
		body: snooze ? '去看看凝固程度' : `發酵 ${record.plannedHours} 小時到了，去看看凝固程度`,
		actionTypeId: actionTypeIdFor(record.kind),
		extra: { recordId: record.id, kind: record.kind },
	};
}

/**
 * 存檔後要對這筆紀錄的提醒做什麼。
 * - schedule：發酵中、預計結束時間還沒到 → 排在那個時間（改了時間就覆蓋）。
 * - keep：發酵中但時間已過 → 不動（可能已經響過，或使用者按了延後）。
 * - cancel：不在發酵中（還沒開始、已移入冷藏、完成）→ 取消。
 */
export function reminderPlan(record, now = new Date()) {
	if (record.phase !== 'fermenting') return { action: 'cancel', id: notificationId(record.id) };
	if (!record.fermentStartAt || record.plannedHours == null) return { action: 'cancel', id: notificationId(record.id) };
	const at = Date.parse(record.fermentStartAt) + Number(record.plannedHours) * 3_600_000;
	if (!(at > now.getTime())) return { action: 'keep', id: notificationId(record.id) };
	return { action: 'schedule', at: new Date(at), ...reminderContent(record) };
}

/** 按「延後 N 小時」後的新時間。 */
export function snoozeAt(hours, now = new Date()) {
	return new Date(now.getTime() + Number(hours) * 3_600_000);
}

/** 「延後 4 小時」「延後 1.5 小時」。 */
export function snoozeLabel(hours) {
	return `延後 ${hours} 小時`;
}
