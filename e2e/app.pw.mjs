// App 版（dist-app/，base /）的畫面檢查：在一般瀏覽器裡跑，所以原生功能（SQLite、通知、Live Update）不會動，
// 只測版面：首頁轉到「我的紀錄」、三條線選單、第一次開啟的引導。
import { expect, test } from '@playwright/test';

const APP = 'http://localhost:4330';

test('App 首頁轉到「我的紀錄」，三條線打開側邊選單（含設定）', async ({ page }) => {
	await page.goto(`${APP}/index.html`);
	await expect(page).toHaveURL(/\/records\/index\.html$/);
	const drawer = page.locator('#app-drawer');
	await expect(drawer).toBeHidden();
	await page.locator('#menu-btn').click();
	await expect(drawer).toBeVisible();
	await expect(drawer.getByRole('link', { name: '設定' })).toBeVisible();
	await expect(drawer.getByRole('link', { name: '批次實驗' })).toBeVisible();
	await drawer.locator('.drawer__backdrop').click({ position: { x: 380, y: 400 } });
	await expect(drawer).toBeHidden();
});

test('App 側邊選單的連結都打得開', async ({ page }) => {
	await page.goto(`${APP}/records/index.html`);
	const hrefs = await page.locator('#app-drawer a.drawer__link[href$=".html"]').evaluateAll((as) => as.map((a) => a.getAttribute('href')));
	expect(hrefs.length).toBeGreaterThan(5);
	for (const href of hrefs) {
		const res = await page.request.get(APP + href);
		expect(res.status(), href).toBe(200);
	}
});

test('網站版的頁首沒有三條線（只有 App 有）', async ({ page }) => {
	await page.goto('http://localhost:4321/YogurtGuide/');
	await expect(page.locator('#menu-btn')).toHaveCount(0);
	await expect(page.locator('nav.nav')).toBeVisible();
});

test('返回鍵：選單、全螢幕看圖打開時會登記，返回鍵先關它們', async ({ page }) => {
	await page.goto(`${APP}/records/index.html`);
	const depth = () => page.evaluate(() => (globalThis.__yogurtguideBackStack ?? []).length);
	const back = () => page.evaluate(() => globalThis.__yogurtguideBackStack.pop().close());
	await page.locator('#menu-btn').click();
	expect(await depth()).toBe(1);
	await back();
	await expect(page.locator('#app-drawer')).toBeHidden();
	// 點背景關掉也要取消登記
	await page.locator('#menu-btn').click();
	await page.locator('.drawer__backdrop').click({ position: { x: 380, y: 400 } });
	expect(await depth()).toBe(0);

	await page.goto(`${APP}/market/index.html`);
	const pack = page.locator('[data-pack]').first();
	await pack.scrollIntoViewIfNeeded();
	await pack.locator('.pack-slide.is-active').click();
	await expect(page.locator('.pswp--open')).toBeVisible();
	expect(await depth()).toBe(1);
	await page.waitForTimeout(500);
	await back();
	await expect(page.locator('.pswp')).toHaveCount(0, { timeout: 10_000 });
	expect(await depth()).toBe(0);
});
