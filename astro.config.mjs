// @ts-check
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

// 正式網址是 Cloudflare 自訂網域。GitHub Pages 仍放在 /YogurtGuide/ 底下，頁面 canonical 指回正式網址。
// Cloudflare Workers Builds 會注入 WORKERS_CI=1。base 結尾必須有 `/`。
const officialSite = 'https://yogurtguide.wuwaiter.com';
const onCloudflare = process.env.WORKERS_CI === '1';

export default defineConfig({
	site: officialSite,
	base: onCloudflare ? '/' : '/YogurtGuide/',
	integrations: onCloudflare ? [sitemap()] : [],
});
