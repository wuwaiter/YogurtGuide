// App 版建置：base 改成 `/`、輸出到 dist-app，再把站內「資料夾式」連結改成明確的 index.html。
// Capacitor 的本機伺服器不會把 `/powders/` 對到 `/powders/index.html`（預設會全部導回首頁），所以要改寫。
//
// 參數（可同時給）：
//   --sync     同步到 android/
//   --debug    同步後出 debug APK
//   --bundle   同步後出上架用 AAB（要先有 android/key.properties）
//   --publish  把 dist-app 壓成 Live Update 網頁包，放進網站的 dist/app-bundle/（要先跑過網站的 npm run build）
import { createHash, createPrivateKey, createPublicKey, sign, verify } from 'node:crypto';
import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { join, dirname, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { zipSync } from 'fflate';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const appDir = join(root, 'dist-app');
const siteDir = join(root, 'dist');
const androidDir = join(root, 'android');
const officialOrigin = 'https://yogurtguide.wuwaiter.com';
/** Live Update「只下載有變的檔案」的清單檔名，外掛寫死這個名字。也放進 APK 內建版本，第一次更新就能比對。 */
export const MANIFEST_NAME = 'capawesome-live-update-manifest.json';
/** 每個檔案的簽章（href → base64），放在 app-bundle/<id>/ 底下、不在 files/ 裡，Worker 用它回 X-Signature。 */
export const SIGNATURES_NAME = 'signatures.json';

/**
 * Live Update 簽章：外掛用 capacitor.config.json 的 publicKey 驗證每個下載的檔案（SHA256withRSA）。
 * 私鑰只在建置時從環境變數讀：LIVE_UPDATE_PRIVATE_KEY_B64（PEM 再轉 base64，方便貼進 Cloudflare 的建置變數）
 * 或 LIVE_UPDATE_PRIVATE_KEY_FILE（本機檔案路徑）。私鑰不進 repo、不放 GitHub secrets。
 */
export function loadSigningKey(env = process.env) {
	if (env.LIVE_UPDATE_PRIVATE_KEY_B64) return createPrivateKey(Buffer.from(env.LIVE_UPDATE_PRIVATE_KEY_B64, 'base64').toString('utf8'));
	if (env.LIVE_UPDATE_PRIVATE_KEY_FILE) return createPrivateKey(readFileSync(env.LIVE_UPDATE_PRIVATE_KEY_FILE, 'utf8'));
	return null;
}

/** 檔案內容的簽章（外掛端是 Signature.getInstance("SHA256withRSA")）。 */
export function signBytes(bytes, privateKey) {
	return sign('sha256', bytes, privateKey).toString('base64');
}

export function verifyBytes(bytes, signature, publicKey) {
	return verify('sha256', bytes, createPublicKey(publicKey), Buffer.from(signature, 'base64'));
}

/** App 內建的公鑰（capacitor.config.json）。 */
export function readPublicKey() {
	return JSON.parse(readFileSync(join(root, 'capacitor.config.json'), 'utf8')).plugins?.LiveUpdate?.publicKey ?? null;
}

function run(command, { cwd = root, env = {} } = {}) {
	const result = spawnSync(command, {
		cwd,
		stdio: 'inherit',
		shell: true,
		env: { ...process.env, ...env },
	});
	if (result.status !== 0) process.exit(result.status ?? 1);
}

/** 只改站內絕對路徑：href="/xxx/" 或 href="/xxx/#id" → href="/xxx/index.html"（保留 #id）。 */
export function rewriteDirectoryLinks(html) {
	return html.replace(/(href|src)="(\/[^"#?]*\/)((?:[?#][^"]*)?)"/g, (_, attr, path, rest) => {
		if (path.startsWith('//')) return `${attr}="${path}${rest}"`;
		return `${attr}="${path}index.html${rest}"`;
	});
}

function listFiles(dir) {
	return readdirSync(dir).flatMap((name) => {
		const path = join(dir, name);
		return statSync(path).isDirectory() ? listFiles(path) : [path];
	});
}

/**
 * 產生檔案清單：每個檔案的路徑、SHA-256、大小。外掛用 SHA-256 比對，沒變的檔案從手機裡複製，只下載有變的。
 * @param {Record<string, Uint8Array>} files  相對路徑（/ 分隔）→ 內容
 */
export function buildManifest(files) {
	return Object.keys(files)
		.filter((href) => href !== MANIFEST_NAME)
		.sort()
		.map((href) => ({
			href,
			checksum: createHash('sha256').update(files[href]).digest('hex'),
			sizeInBytes: files[href].length,
		}));
}

/** 依第一層資料夾分類（powders、market、batches、brand…；根目錄的頁面算「pages」），方便看每類多大。 */
export function categorySummary(manifest) {
	const out = {};
	for (const item of manifest) {
		const category = item.href.includes('/') ? item.href.split('/')[0] : 'pages';
		out[category] ??= { files: 0, bytes: 0 };
		out[category].files++;
		out[category].bytes += item.sizeInBytes;
	}
	return out;
}

/** 讀 dist-app 全部檔案（路徑用 / 分隔）。 */
function readAppFiles() {
	const files = {};
	for (const file of listFiles(appDir)) files[relative(appDir, file).split(sep).join('/')] = readFileSync(file);
	return files;
}

/** 從 src/config/platforms.ts 讀 nativeBuild，避免兩邊各寫一份。 */
export function readNativeBuild() {
	const text = readFileSync(join(root, 'src', 'config', 'platforms.ts'), 'utf8');
	const match = text.match(/nativeBuild:\s*(\d+)/);
	if (!match) throw new Error('platforms.ts 找不到 nativeBuild');
	return Number(match[1]);
}

function buildAppSite() {
	run('npx astro build', { env: { CAP_BUILD: '1' } });
	let changed = 0;
	for (const file of listFiles(appDir).filter((path) => path.endsWith('.html'))) {
		const before = readFileSync(file, 'utf8');
		const after = rewriteDirectoryLinks(before);
		if (after !== before) {
			writeFileSync(file, after);
			changed++;
		}
	}
	console.log(`[app] 改寫 ${changed} 個 HTML 的站內連結`);
	const manifest = buildManifest(readAppFiles());
	writeFileSync(join(appDir, MANIFEST_NAME), JSON.stringify(manifest));
	console.log(`[app] 檔案清單：${manifest.length} 個檔案`);
}

/**
 * 發佈到 dist/app-bundle/：
 * - <id>.zip：整包（舊版 App 用）。
 * - <id>/files/…：每個檔案各自一份，照原本的分類資料夾放（powders/、market/、batches/…），
 *   新版 App 用「只下載有變的檔案」模式經 Worker（worker/index.mjs）一個一個抓。
 * - latest.json：兩種都寫，舊版 App 只看 url/checksum。
 */
function publishBundle() {
	if (!existsSync(siteDir)) {
		console.error('[app] 找不到 dist/，請先跑網站的 npm run build。');
		process.exit(1);
	}
	const commit = process.env.WORKERS_CI_COMMIT_SHA ?? process.env.GITHUB_SHA ?? '';
	const bundleId = commit || `local-${Date.now()}`;
	const privateKey = loadSigningKey();
	// Cloudflare 建置出來的就是正式網頁包：App 有公鑰、只收有簽章的包，沒有私鑰就不要發佈。
	if (!privateKey && process.env.WORKERS_CI === '1') {
		console.error('[app] 缺 LIVE_UPDATE_PRIVATE_KEY_B64：Cloudflare 建置要設這個變數，App 才收得到更新。');
		process.exit(1);
	}

	const entries = readAppFiles();
	const zip = zipSync(entries, { level: 9 });
	const checksum = createHash('sha256').update(zip).digest('hex');

	const outDir = join(siteDir, 'app-bundle');
	rmSync(outDir, { recursive: true, force: true });
	mkdirSync(outDir, { recursive: true });
	const zipName = `${bundleId}.zip`;
	writeFileSync(join(outDir, zipName), zip);
	const filesDir = join(outDir, bundleId, 'files');
	for (const href of Object.keys(entries)) {
		const target = join(filesDir, ...href.split('/'));
		mkdirSync(dirname(target), { recursive: true });
		copyFileSync(join(appDir, ...href.split('/')), target);
	}
	// 簽章：整包 zip 一個，「只下載有變的檔案」模式每個檔案（含清單檔）各一個。
	let signature;
	if (privateKey) {
		signature = signBytes(zip, privateKey);
		const signatures = Object.fromEntries(Object.entries(entries).map(([href, bytes]) => [href, signBytes(bytes, privateKey)]));
		writeFileSync(join(outDir, bundleId, SIGNATURES_NAME), JSON.stringify(signatures));
		console.log(`[app] 已簽章：zip 與 ${Object.keys(signatures).length} 個檔案`);
	} else {
		console.log('[app] 沒有私鑰：網頁包沒有簽章（只能本機或 CI 檢查用，App 不會接受）。');
	}
	writeFileSync(
		join(outDir, 'latest.json'),
		JSON.stringify({
			bundleId,
			url: `${officialOrigin}/app-bundle/${zipName}`,
			checksum,
			...(signature ? { signature } : {}),
			manifestUrl: `${officialOrigin}/app-bundle/${bundleId}/`,
			minNativeBuild: readNativeBuild(),
		}),
	);
	console.log(`[app] 網頁包 ${zipName}：${(zip.length / 1024 / 1024).toFixed(1)} MB`);
	const manifest = JSON.parse(entries[MANIFEST_NAME] ? Buffer.from(entries[MANIFEST_NAME]).toString('utf8') : '[]');
	for (const [category, { files, bytes }] of Object.entries(categorySummary(manifest))) {
		console.log(`[app]   ${category.padEnd(12)} ${String(files).padStart(4)} 個檔案 ${(bytes / 1024).toFixed(0).padStart(7)} KB`);
	}
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
	const flags = new Set(process.argv.slice(2));
	buildAppSite();

	if (flags.has('--publish')) publishBundle();

	if (flags.has('--sync') || flags.has('--debug') || flags.has('--bundle')) {
		run('npx cap sync android');
		// Windows 不一定會從目前資料夾找執行檔，所以用完整路徑呼叫 gradlew。
		const gradlew = `"${join(androidDir, process.platform === 'win32' ? 'gradlew.bat' : 'gradlew')}"`;
		if (flags.has('--debug')) run(`${gradlew} assembleDebug`, { cwd: androidDir });
		if (flags.has('--bundle')) {
			if (!existsSync(join(androidDir, 'key.properties'))) {
				console.error('[app] 缺 android/key.properties，AAB 無法簽章。範本見 android/key.properties.example。');
				process.exit(1);
			}
			run(`${gradlew} bundleRelease`, { cwd: androidDir });
		}
	}
}
