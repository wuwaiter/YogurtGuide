import { readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const testsDir = join(root, 'tests');

if (!existsSync(testsDir)) {
	console.error('[❌] tests/ 不存在。commit 至少需要一個 unit test。');
	process.exit(1);
}

const files = readdirSync(testsDir).filter((name) => /\.test\.(mjs|js|cjs|ts)$/.test(name));
if (files.length === 0) {
	console.error('[❌] tests/ 沒有 *.test.mjs。commit 至少需要一個 unit test。');
	process.exit(1);
}

const result = spawnSync('npm', ['test'], {
	cwd: root,
	stdio: 'inherit',
	shell: true,
});
process.exit(result.status === 0 ? 0 : result.status ?? 1);
