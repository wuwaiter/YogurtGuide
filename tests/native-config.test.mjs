// 原生設定一致性：AGENTS.md「新增外掛 nativeBuild 與 versionCode 一起加 1」、授權頁要列出每個 Capacitor 外掛。
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { readNativeBuild } from '../scripts/build-app.mjs';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('platforms.ts 的 nativeBuild = build.gradle 的 versionCode（latest.json 的 minNativeBuild 也取自它）', () => {
	const versionCode = Number(read('android/app/build.gradle').match(/versionCode\s+(\d+)/)?.[1]);
	assert.ok(versionCode > 0, 'build.gradle 找不到 versionCode');
	assert.equal(readNativeBuild(), versionCode);
});

test('package.json 的每個 Capacitor 外掛都列在授權頁，版本一致', () => {
	const { dependencies } = JSON.parse(read('package.json'));
	const licenses = read('src/pages/licenses.astro');
	const plugins = Object.entries(dependencies).filter(([name]) => /capacitor/.test(name));
	assert.ok(plugins.length > 0);
	for (const [name, range] of plugins) {
		const at = licenses.indexOf(name);
		assert.ok(at >= 0, `授權頁 src/pages/licenses.astro 沒有 ${name}`);
		const version = range.replace(/^[\^~]/, '');
		const listed = licenses.slice(at).match(/version:\s*'([^']+)'/)?.[1];
		assert.equal(listed, version, `${name} 授權頁寫 ${listed}，package.json 是 ${version}`);
	}
});
