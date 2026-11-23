// 建置後檢查（check:deploy 在 app:publish 之後跑）：
// 1. latest.json 的 minNativeBuild = platforms.ts 的 nativeBuild，舊版 App 才不會下載需要新外掛的網頁包。
// 2. SQLite 外掛只能在延遲載入的分檔，網站頁面不能直接載入它。
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readNativeBuild } from './build-app.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const errors = [];

const latestPath = join(dist, 'app-bundle', 'latest.json');
if (!existsSync(latestPath)) {
	errors.push('找不到 dist/app-bundle/latest.json，請先跑 npm run build && npm run app:publish。');
} else {
	const { minNativeBuild } = JSON.parse(readFileSync(latestPath, 'utf8'));
	if (minNativeBuild !== readNativeBuild()) {
		errors.push(`latest.json 的 minNativeBuild 是 ${minNativeBuild}，platforms.ts 的 nativeBuild 是 ${readNativeBuild()}。`);
	}
}

const listFiles = (dir) =>
	readdirSync(dir).flatMap((name) => {
		const path = join(dir, name);
		return statSync(path).isDirectory() ? listFiles(path) : [path];
	});

const astroDir = join(dist, '_astro');
const sqliteChunks = existsSync(astroDir)
	? readdirSync(astroDir).filter((name) => name.endsWith('.js') && readFileSync(join(astroDir, name), 'utf8').includes('jeep-sqlite'))
	: [];
for (const html of listFiles(dist).filter((path) => path.endsWith('.html'))) {
	const text = readFileSync(html, 'utf8');
	const entries = [...text.matchAll(/_astro\/([^"'\s>]+\.js)/g)].map((m) => m[1]);
	for (const chunk of sqliteChunks) {
		if (entries.includes(chunk)) errors.push(`${html.slice(root.length + 1)} 直接載入 SQLite 外掛（${chunk}），應改成動態 import()。`);
		for (const entry of entries) {
			const code = existsSync(join(astroDir, entry)) ? readFileSync(join(astroDir, entry), 'utf8') : '';
			const staticImport = new RegExp(String.raw`(from|import)\s*["']\./` + chunk.replace(/\./g, '\\.') + `["']`);
			if (staticImport.test(code)) {
				errors.push(`${entry} 靜態 import SQLite 外掛（${chunk}），應改成動態 import()。`);
			}
		}
	}
}

if (errors.length) {
	for (const e of errors) console.error(`[❌] ${e}`);
	process.exit(1);
}
console.log(`[✅] minNativeBuild 一致；SQLite 外掛只在延遲載入的分檔（${sqliteChunks.length} 個）。`);
