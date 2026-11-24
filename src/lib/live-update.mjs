// App Live Update 的判斷規則（不碰外掛，方便測試）。畫面與外掛呼叫在 src/components/AppLiveUpdate.astro。

/** 從背景回到 App 時，距離上次檢查至少隔這麼久才再檢查。下拉檢查不受限制。 */
export const RESUME_CHECK_INTERVAL_MS = 5 * 60 * 1000;

/**
 * 決定這次檢查要做什麼。
 * - offline：讀不到 latest.json（沒網路等），不打擾使用者。
 * - latest：正在用的就是最新版。
 * - needs-store-update：新網頁包需要更新的原生層，要到商店更新 App。
 * - ready：已下載並設為下次使用，只差使用者點提示或重開 App。
 * - set-next：已下載但還沒設為下次使用。
 * - download：要下載。
 */
export function decideUpdate({ ownCommit, latest, nativeBuild, currentBundleId, nextBundleId, downloadedIds = [] }) {
	if (!latest?.bundleId) return 'offline';
	if (latest.bundleId === ownCommit || latest.bundleId === currentBundleId) return 'latest';
	if (Number(nativeBuild) < Number(latest.minNativeBuild)) return 'needs-store-update';
	if (nextBundleId === latest.bundleId) return 'ready';
	if (downloadedIds.includes(latest.bundleId)) return 'set-next';
	return 'download';
}

/** 已經有下載好、還沒換上的版本時，每一頁都要顯示「有新內容」提示。 */
export function hasPendingBundle({ currentBundleId, nextBundleId }) {
	return Boolean(nextBundleId) && nextBundleId !== currentBundleId;
}

/** 從背景回來要不要檢查。 */
export function shouldCheckOnResume(lastCheckedAt, now, interval = RESUME_CHECK_INTERVAL_MS) {
	return !lastCheckedAt || now - Number(lastCheckedAt) >= interval;
}

/** 首頁下拉的距離（px）對應的提示文字；null 表示不顯示。 */
export const PULL_THRESHOLD_PX = 70;
export function pullLabel(distance, threshold = PULL_THRESHOLD_PX) {
	if (distance <= 10) return null;
	return distance >= threshold ? '放開以檢查更新' : '下拉檢查更新';
}
