// 第一次開啟 App 的引導（規格見 md/AppPlan.md「第一次開啟的引導」）。畫面在 src/components/AppOnboarding.astro。

/** 看過的標記存在 WebView 的 localStorage：移除 App 或清除資料才會再出現。 */
export const ONBOARDING_KEY = 'yogurtguide.onboardingSeen';
/** 引導內容改了、想讓所有人再看一次時，把版本加 1。 */
export const ONBOARDING_VERSION = 1;

export const ONBOARDING_PAGES = [
	{
		title: '這是什麼',
		body: [
			'記下自己做的每一杯優格：用什麼菌、幾度、發酵多久、成品如何。',
			'也可以查菌粉、市售優格和站主的批次實驗。',
		],
	},
	{
		title: '怎麼記',
		body: [
			'到「我的紀錄」新增一筆，選發酵類型、填菌和溫度。',
			'按「開始發酵」開始計時，時間到會提醒你去看凝固。',
			'看好了按「移入冷藏」，最後幫成品評分。',
		],
	},
	{
		title: '資料在哪',
		body: [
			'紀錄只存在這支手機，不會上傳。移除 App 或清除資料就會消失。',
			'要發酵時間到的提醒，請允許通知。',
		],
		asksNotification: true,
	},
];

/** 還沒看過（或內容版本更新了）就顯示。 */
export function shouldShowOnboarding(stored) {
	return !(Number(stored) >= ONBOARDING_VERSION);
}
