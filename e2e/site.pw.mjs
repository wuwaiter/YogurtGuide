// 網站（dist/，base /YogurtGuide/）的畫面檢查：手機尺寸（Pixel 7）。
import { expect, test } from '@playwright/test';

const SITE = 'http://localhost:4321/YogurtGuide/';
const PAGES = ['', 'batches/', 'cultures/species/', 'cultures/', 'powders/', 'market/', 'pairing/', 'methods/', 'glossary/', 'about/', 'privacy/', 'licenses/'];

/** 收集頁面上的 JS 錯誤與 console.error（瀏覽器自動要的 /favicon.ico 不算）。 */
function watchErrors(page) {
	const errors = [];
	page.on('pageerror', (err) => errors.push(err.message));
	page.on('console', (msg) => {
		if (msg.type() === 'error' && !/favicon\.ico/.test(msg.location().url ?? '')) errors.push(msg.text());
	});
	page.on('response', (res) => {
		if (res.status() >= 400 && !res.url().endsWith('/favicon.ico')) errors.push(`${res.status()} ${res.url()}`);
	});
	return errors;
}

for (const path of PAGES) {
	test(`網站 /${path}：打得開、沒有錯誤、手機上不用左右捲`, async ({ page }) => {
		const errors = watchErrors(page);
		const res = await page.goto(SITE + path);
		expect(res.status()).toBe(200);
		await page.waitForLoadState('networkidle');
		expect(errors).toEqual([]);
		const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
		expect(overflow).toBeLessThanOrEqual(1);
	});
}

test('批次實驗：手機上表格每格的欄名對得上表頭、OK／NG 標籤都在', async ({ page }) => {
	await page.goto(SITE + 'batches/');
	const table = page.locator('table.stack-table').first();
	const heads = await table.locator('thead th').allTextContents();
	const labels = await table.locator('tbody tr').first().locator('td').evaluateAll((tds) => tds.map((td) => td.dataset.label));
	expect(labels).toEqual(heads.map((h) => h.trim()));
	// 欄名顯示在內容上方，不疊在一起
	const cell = table.locator('tbody tr').first().locator('td').nth(1);
	expect(await cell.evaluate((td) => getComputedStyle(td, '::before').display)).toBe('block');
	const badges = await page.locator('#logs .result-badge').count();
	expect(badges).toBe(await page.locator('#logs li').count());
});

test('市售優格：包裝圖可以換張、點開全螢幕放大', async ({ page }) => {
	const errors = watchErrors(page);
	await page.goto(SITE + 'market/');
	const pack = page.locator('[data-pack]').filter({ has: page.locator('[data-pack-next]') }).first();
	await pack.scrollIntoViewIfNeeded();
	await expect(pack.locator('[data-pack-count]')).toHaveText(/^1 \/ \d+$/);
	await pack.locator('[data-pack-next]').click();
	await expect(pack.locator('[data-pack-count]')).toHaveText(/^2 \/ \d+$/);
	// 等滑動動畫停下來再點（照片還在移動時點，PhotoSwipe 關閉動畫會對不到縮圖位置）
	await page.waitForTimeout(600);
	await pack.locator('.pack-slide.is-active').click();
	await expect(page.locator('.pswp--open')).toBeVisible();
	await page.waitForTimeout(500); // 等放大動畫播完（播放中按關閉會被忽略）
	await page.locator('.pswp__button--close').click();
	await expect(page.locator('.pswp')).toHaveCount(0, { timeout: 10_000 });
	expect(errors).toEqual([]);
});
