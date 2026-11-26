// 很小的靜態檔伺服器，給 Playwright 測 App 版（dist-app/）。用法：node scripts/serve-static.mjs <資料夾> <port>
// 和 Capacitor 一樣：路徑對到檔案就回傳，資料夾不會自動補 index.html（App 版的連結都已改寫成 .../index.html）。
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize, resolve } from 'node:path';

const [dir = 'dist-app', port = '4330'] = process.argv.slice(2);
const root = resolve(dir);
const types = {
	'.html': 'text/html; charset=utf-8',
	'.js': 'text/javascript',
	'.css': 'text/css',
	'.json': 'application/json',
	'.svg': 'image/svg+xml',
	'.png': 'image/png',
	'.jpg': 'image/jpeg',
	'.jpeg': 'image/jpeg',
	'.webp': 'image/webp',
	'.woff2': 'font/woff2',
	'.txt': 'text/plain; charset=utf-8',
};

createServer(async (req, res) => {
	let path = decodeURIComponent(new URL(req.url, 'http://x').pathname);
	if (path === '/') path = '/index.html';
	const file = normalize(join(root, path));
	if (!file.startsWith(root)) return res.writeHead(403).end();
	try {
		const body = await readFile(file);
		res.writeHead(200, { 'Content-Type': types[extname(file)] ?? 'application/octet-stream' }).end(body);
	} catch {
		res.writeHead(404).end('not found');
	}
}).listen(Number(port), () => console.log(`serving ${root} on http://localhost:${port}`));
