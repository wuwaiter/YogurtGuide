// 網頁畫面的自動測試（npm run test:e2e）。測的是已建置好的 dist/（網站）與 dist-app/（App 版），
// 所以要先跑 npm run check:deploy（CI 也是這個順序）。測試檔在 e2e/*.pw.mjs（不用 .spec/.test，避免被 node --test 撿到）。
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
	testDir: 'e2e',
	testMatch: '**/*.pw.mjs',
	fullyParallel: true,
	retries: process.env.CI ? 1 : 0,
	reporter: process.env.CI ? [['list'], ['github']] : 'list',
	use: { ...devices['Pixel 7'], browserName: 'chromium' },
	webServer: [
		{ command: 'npx astro preview --port 4321', url: 'http://localhost:4321/YogurtGuide/', reuseExistingServer: !process.env.CI },
		{ command: 'node scripts/serve-static.mjs dist-app 4330', url: 'http://localhost:4330/index.html', reuseExistingServer: !process.env.CI },
	],
});
