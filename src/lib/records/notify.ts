// 發酵提醒：呼叫 @capacitor/local-notifications。規則在 reminders.mjs（有測試）。
// 只在 App 有作用；網站版每個函式都直接略過。外掛用動態 import()，網站頁面不會載入它。
import { Capacitor } from '@capacitor/core';
import { SNOOZE_ACTION, actionTypeIdFor, reminderPlan, snoozeAt, snoozeLabel } from './reminders.mjs';
import { loadSettings, snoozeHoursFor, snoozeKinds } from '../settings.mjs';

type Rec = Record<string, any>;

const native = () => Capacitor.isNativePlatform() && Capacitor.isPluginAvailable('LocalNotifications');
const plugin = async () => (await import('@capacitor/local-notifications')).LocalNotifications;

/** 目前的通知權限：granted / denied / prompt；網站版回傳 unavailable。 */
export async function notifyPermission(): Promise<string> {
	if (!native()) return 'unavailable';
	return (await (await plugin()).checkPermissions()).display;
}

/** 請求通知權限（Android 13 以上會跳系統視窗；之前拒絕過就不會再跳）。 */
export async function requestNotifyPermission(): Promise<string> {
	if (!native()) return 'unavailable';
	return (await (await plugin()).requestPermissions()).display;
}

/** 依紀錄目前的階段排、改、取消提醒。沒有通知權限就不排（不擋存檔）。 */
export async function syncReminder(record: Rec, { ask = false } = {}): Promise<void> {
	if (!native()) return;
	const ln = await plugin();
	const plan = reminderPlan(record) as any;
	if (plan.action === 'keep') return;
	if (plan.action === 'cancel') {
		await ln.cancel({ notifications: [{ id: plan.id }] });
		return;
	}
	let state = (await ln.checkPermissions()).display;
	if (state.startsWith('prompt') && ask) state = (await ln.requestPermissions()).display;
	if (state !== 'granted') return;
	await ln.schedule({
		notifications: [
			{
				id: plan.id,
				title: plan.title,
				body: plan.body,
				actionTypeId: plan.actionTypeId,
				extra: plan.extra,
				schedule: { at: plan.at, allowWhileIdle: true },
			},
		],
	});
}

/** 註冊各類型的「延後 N 小時」按鈕（N 取設定值）。設定頁存檔後要再呼叫一次。 */
export async function registerReminderActions(): Promise<void> {
	if (!native()) return;
	const settings = loadSettings();
	await (await plugin()).registerActionTypes({
		types: snoozeKinds().map(({ kind }) => ({
			id: actionTypeIdFor(kind)!,
			actions: [{ id: SNOOZE_ACTION, title: snoozeLabel(snoozeHoursFor(settings, kind)) }],
		})),
	});
}

/** App 啟動時呼叫一次：註冊「延後」按鈕、點通知打開那筆紀錄。 */
export async function setupNotificationHandlers(openRecord: (recordId: string) => void): Promise<void> {
	if (!native()) return;
	const ln = await plugin();
	await registerReminderActions();
	await ln.addListener('localNotificationActionPerformed', async ({ actionId, notification }) => {
		const recordId = notification.extra?.recordId as string | undefined;
		if (actionId === SNOOZE_ACTION) {
			const hours = snoozeHoursFor(loadSettings(), notification.extra?.kind) ?? 4;
			await ln.schedule({
				notifications: [
					{
						id: notification.id,
						title: notification.title,
						body: notification.body,
						actionTypeId: notification.actionTypeId,
						extra: notification.extra,
						schedule: { at: snoozeAt(hours), allowWhileIdle: true },
					},
				],
			});
			return;
		}
		if (recordId) openRecord(recordId);
	});
}
