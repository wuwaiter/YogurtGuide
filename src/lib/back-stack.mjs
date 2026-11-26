// Android 返回鍵：先關掉最上層的浮動畫面（側邊選單、引導、全螢幕看圖），都沒有才回上一頁。
// 浮動畫面打開時 pushBack(關閉函式)，關閉時呼叫它回傳的 remove。監聽返回鍵在 src/components/AppDrawer.astro。
// 堆疊放在 globalThis：不同元件的程式各自打包時，也共用同一份。

/** @returns {{ close: () => void }[]} */
function stack() {
	globalThis.__yogurtguideBackStack ??= [];
	return globalThis.__yogurtguideBackStack;
}

/** 登記一個可以用返回鍵關掉的畫面；回傳的函式用來取消登記（重複呼叫沒關係）。 */
export function pushBack(close) {
	const entry = { close };
	stack().push(entry);
	return () => {
		const list = stack();
		const index = list.indexOf(entry);
		if (index >= 0) list.splice(index, 1);
	};
}

/** 按返回鍵：關掉最上層的畫面並回傳 true；沒有畫面要關就回傳 false（交給上一頁／離開 App）。 */
export function handleBack() {
	const top = stack().pop();
	if (!top) return false;
	top.close();
	return true;
}

export function backDepth() {
	return stack().length;
}
