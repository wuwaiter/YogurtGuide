// @ts-check
import { defineConfig } from 'astro/config';

// base 結尾必須有 `/`，否則 `${base}cultures/` 會變成 `/YogurtGuidecultures/`
export default defineConfig({
	site: 'https://wuwaiter.github.io',
	base: '/YogurtGuide/',
});
