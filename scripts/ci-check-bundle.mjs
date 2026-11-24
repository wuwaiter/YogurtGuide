// 建置後檢查（check:deploy 在 app:publish 之後跑）：
// 1. latest.json 的 minNativeBuild = platforms.ts 的 nativeBuild，舊版 App 才不會下載需要新外掛的網頁包。
// 2. SQLite 外掛只能在延遲載入的分檔，網站頁面不能直接載入它。
// 3. 「只下載有變的檔案」：latest.json 有 manifestUrl，清單裡每個檔案都發佈到 <id>/files/，大小一致。
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
	const { minNativeBuild, bundleId, manifestUrl } = JSON.parse(readFileSync(latestPath, 'utf8'));
	const filesDir = join(dist, 'app-bundle', bundleId ?? '', 'files');
	const manifestPath = join(filesDir, 'capawesome-live-update-manifest.json');
	if (!manifestUrl?.endsWith(`/app-bundle/${bundleId}/`)) errors.push(`latest.json 的 manifestUrl 不對：${manifestUrl}`);
	if (!existsSync(manifestPath)) {
		errors.push(`找不到 ${manifestPath.slice(root.length + 1)}`);
	} else {
		for (const item of JSON.parse(readFileSync(manifestPath, 'utf8'))) {
			const file = join(filesDir, ...item.href.split('/'));
			if (!existsSync(file)) errors.push(`清單裡的 ${item.href} 沒有發佈`);
			else if (statSync(file).size !== item.sizeInBytes) errors.push(`${item.href} 大小和清單不一致`);
		}
	}
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
console.log(`[✅] 檔案清單與發佈檔案一致；minNativeBuild 一致；SQLite 外掛只在延遲載入的分檔（${sqliteChunks.length} 個）。`);
