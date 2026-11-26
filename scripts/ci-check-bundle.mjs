// 建置後檢查（check:deploy 在 app:publish 之後跑）：
// 1. latest.json 的 minNativeBuild = platforms.ts 的 nativeBuild，舊版 App 才不會下載需要新外掛的網頁包。
// 2. SQLite 外掛只能在延遲載入的分檔，網站頁面不能直接載入它。
// 3. 「只下載有變的檔案」：latest.json 有 manifestUrl，清單裡每個檔案都發佈到 <id>/files/，大小一致。
// 4. 有簽章時（Cloudflare 建置）：zip 與每個檔案的簽章都能用 App 內建的公鑰驗過。
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SIGNATURES_NAME, readNativeBuild, readPublicKey, verifyBytes } from './build-app.mjs';

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

let signedNote = '網頁包沒有簽章（沒有私鑰的建置）';
if (existsSync(latestPath)) {
	const latest = JSON.parse(readFileSync(latestPath, 'utf8'));
	const sigPath = join(dist, 'app-bundle', latest.bundleId, SIGNATURES_NAME);
	if (latest.signature || existsSync(sigPath)) {
		const publicKey = readPublicKey();
		if (!publicKey) errors.push('capacitor.config.json 沒有 LiveUpdate.publicKey。');
		else {
			const zip = readFileSync(join(dist, 'app-bundle', `${latest.bundleId}.zip`));
			if (!latest.signature || !verifyBytes(zip, latest.signature, publicKey)) errors.push('zip 的簽章驗不過（私鑰和 App 的公鑰不是一對？）。');
			const signatures = existsSync(sigPath) ? JSON.parse(readFileSync(sigPath, 'utf8')) : {};
			const filesDir = join(dist, 'app-bundle', latest.bundleId, 'files');
			let bad = 0;
			for (const [href, sig] of Object.entries(signatures)) {
				if (!verifyBytes(readFileSync(join(filesDir, ...href.split('/'))), sig, publicKey)) bad++;
			}
			if (bad) errors.push(`${bad} 個檔案的簽章驗不過。`);
			signedNote = `簽章驗證通過（zip＋${Object.keys(signatures).length} 個檔案）`;
		}
	}
}

if (errors.length) {
	for (const e of errors) console.error(`[❌] ${e}`);
	process.exit(1);
}
console.log(`[✅] ${signedNote}；檔案清單與發佈檔案一致；minNativeBuild 一致；SQLite 外掛只在延遲載入的分檔（${sqliteChunks.length} 個）。`);
