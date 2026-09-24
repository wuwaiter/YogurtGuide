import { readFileSync } from 'node:fs';
import { extname } from 'node:path';
import { spawnSync } from 'node:child_process';

const ls = spawnSync('git', ['ls-files'], { encoding: 'utf8' });
if (ls.status !== 0) {
	console.error('[❌] 無法執行 git ls-files');
	process.exit(1);
}

const files = ls.stdout.split(/\r?\n/).filter(Boolean);
const forbiddenName = /(^|\/)\.env(\.|$)|(^|\/)cert\/|\.(pem|key)$/i;
const trackedForbidden = files.filter((file) => {
	if (file === '.env.example' || file.endsWith('/.env.example')) return false;
	return forbiddenName.test(file);
});

if (trackedForbidden.length) {
	console.error('[❌] 禁止進版控的檔案：');
	for (const file of trackedForbidden) console.error(`  - ${file}`);
	process.exit(1);
}

const skipExt = new Set([
	'.png',
	'.jpg',
	'.jpeg',
	'.gif',
	'.webp',
	'.ico',
	'.woff',
	'.woff2',
	'.ttf',
	'.eot',
	'.pdf',
	'.zip',
]);
const skipThis = 'scripts/ci-check-security.mjs';

const ghp = new RegExp(`ghp_${'[A-Za-z0-9]'}{20,}`);
const aws = new RegExp(`AKIA${'[0-9A-Z]'}{16}`);
const pem = /BEGIN [A-Z ]*PRIVATE KEY/;
const apiKeyAssign = /api[_-]?key\s*=\s*['"][^'"]{8,}['"]/i;

const hits = [];
for (const file of files) {
	if (file === skipThis) continue;
	if (skipExt.has(extname(file).toLowerCase())) continue;
	let content = '';
	try {
		content = readFileSync(file, 'utf8');
	} catch {
		continue;
	}
	if (content.length > 1_000_000) continue;
	if (ghp.test(content) || aws.test(content) || pem.test(content) || apiKeyAssign.test(content)) {
		hits.push(file);
	}
}

if (hits.length) {
	console.error('[❌] 內容像密鑰（ghp_ / AKIA / private key / api_key=）：');
	for (const file of hits) console.error(`  - ${file}`);
	process.exit(1);
}

console.log('[✅] 安全檢查通過');
