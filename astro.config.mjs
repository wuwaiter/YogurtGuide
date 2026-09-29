// @ts-check
import { defineConfig } from 'astro/config';

// Cloudflare Workers Builds 會注入 WORKERS_CI=1，網站放在網域根目錄；GitHub Pages 放在 /YogurtGuide/ 底下。
// base 結尾必須有 `/`，否則 `${base}cultures/` 會變成 `/YogurtGuidecultures/`
const onCloudflare = process.env.WORKERS_CI === '1';

export default defineConfig({
	site: 'https://wuwaiter.github.io',
	base: onCloudflare ? '/' : '/YogurtGuide/',
});
