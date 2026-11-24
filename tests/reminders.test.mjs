import test from 'node:test';
import assert from 'node:assert/strict';
import { actionTypeIdFor, notificationId, reminderPlan, snoozeAt, snoozeLabel } from '../src/lib/records/reminders.mjs';
import { cleanSnoozeHours, parseSettings, snoozeHoursFor, snoozeKinds } from '../src/lib/settings.mjs';
import { ONBOARDING_PAGES, shouldShowOnboarding } from '../src/lib/onboarding.mjs';

const now = new Date('2026-11-24T10:00:00+08:00');
const rec = {
	id: 'rabc123',
	kind: 'starter',
	cultureName: '優比特',
	generation: 0,
	lineStartedOn: '2026-11-24',
	phase: 'fermenting',
	fermentStartAt: '2026-11-24T01:00:00.000Z', // 台灣 09:00
	plannedHours: 8,
};

test('通知 id：同一筆紀錄固定、是 32 位元正整數', () => {
	assert.equal(notificationId('rabc123'), notificationId('rabc123'));
	assert.notEqual(notificationId('rabc123'), notificationId('rabc124'));
	for (const id of ['a', 'r' + 'x'.repeat(40), 'rmh2k9z1a2b3c']) {
		const n = notificationId(id);
		assert.ok(Number.isInteger(n) && n > 0 && n <= 0x7fffffff);
	}
});

test('發酵中：排在開始發酵 + 預計時數', () => {
	const plan = reminderPlan(rec, now);
	assert.equal(plan.action, 'schedule');
	assert.equal(plan.at.toISOString(), '2026-11-24T09:00:00.000Z');
	assert.equal(plan.title, '優比特*0 (2026/11/24)');
	assert.match(plan.body, /發酵 8 小時到了/);
	assert.equal(plan.actionTypeId, undefined);
	assert.deepEqual(plan.extra, { recordId: 'rabc123', kind: 'starter' });
});

test('Kefir 有「延後」按鈕組，優格沒有', () => {
	const plan = reminderPlan({ ...rec, kind: 'kefir', plannedHours: 24 }, now);
	assert.equal(plan.actionTypeId, 'snooze-kefir');
	assert.equal(plan.body, '去看看凝固程度');
	assert.equal(actionTypeIdFor('starter'), undefined);
});

test('同時多筆發酵：各自一個通知 id、各自排時間', () => {
	const yogurt = reminderPlan(rec, now);
	const kefir = reminderPlan({ ...rec, id: 'rkefir1', kind: 'kefir', plannedHours: 24 }, now);
	const yogurt2 = reminderPlan({ ...rec, id: 'ryog2', plannedHours: 10 }, now);
	const ids = new Set([yogurt.id, kefir.id, yogurt2.id]);
	assert.equal(ids.size, 3);
	assert.deepEqual([yogurt, kefir, yogurt2].map((p) => p.action), ['schedule', 'schedule', 'schedule']);
	assert.notEqual(yogurt.at.getTime(), yogurt2.at.getTime());
});

test('不在發酵中就取消；時間已過就不動（保留延後的提醒）', () => {
	for (const phase of ['planned', 'chilling', 'done']) assert.equal(reminderPlan({ ...rec, phase }, now).action, 'cancel');
	assert.equal(reminderPlan({ ...rec, plannedHours: null }, now).action, 'cancel');
	assert.equal(reminderPlan({ ...rec, plannedHours: 0.5 }, now).action, 'keep');
});

test('延後時數：預設 4、可在設定改、亂填就用預設', () => {
	assert.deepEqual(snoozeKinds().map((k) => k.kind), ['kefir']);
	assert.equal(snoozeHoursFor(parseSettings(null), 'kefir'), 4);
	assert.equal(snoozeHoursFor(parseSettings('{"snoozeHours":{"kefir":6}}'), 'kefir'), 6);
	assert.equal(snoozeHoursFor(parseSettings('{"snoozeHours":{"kefir":-1}}'), 'kefir'), 4);
	assert.equal(snoozeHoursFor(parseSettings('not json'), 'kefir'), 4);
	assert.equal(snoozeHoursFor(parseSettings(null), 'starter'), null);
	assert.equal(cleanSnoozeHours('1.3'), 1.5);
	assert.equal(cleanSnoozeHours('100'), null);
	assert.equal(snoozeAt(6, now).getTime() - now.getTime(), 6 * 3_600_000);
	assert.equal(snoozeLabel(1.5), '延後 1.5 小時');
});

test('引導：3 頁、最後一頁請求通知、看過就不再顯示', () => {
	assert.equal(ONBOARDING_PAGES.length, 3);
	assert.equal(ONBOARDING_PAGES.at(-1).asksNotification, true);
	assert.equal(shouldShowOnboarding(null), true);
	assert.equal(shouldShowOnboarding('garbage'), true);
	assert.equal(shouldShowOnboarding('1'), false);
});
