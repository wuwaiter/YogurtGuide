// 原生設定一致性：版本號唯一來源（Version.md、nativeBuild）、授權頁要列出每個 Capacitor 外掛。
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { readNativeBuild } from '../scripts/build-app.mjs';
import { parseAppVersion, readAppVersion } from '../scripts/version.mjs';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('版本號唯一來源：build.gradle 的 versionName 讀 Version.md、versionCode 讀 platforms.ts 的 nativeBuild', () => {
	const gradle = read('android/app/build.gradle');
	assert.match(gradle, /versionCode appVersionCode/);
	assert.match(gradle, /versionName appVersionName/);
	// gradle 讀的是同一個檔案、同樣的格式（Groovy 規則見 build.gradle，JS 規則見 scripts/version.mjs）
	assert.match(gradle, /new File\(repoRoot, 'md\/Version\.md'\)/);
	assert.match(gradle, /new File\(repoRoot, 'src\/config\/platforms\.ts'\)/);
	assert.match(readAppVersion(), /^\d+\.\d+\.\d+$/);
	assert.ok(readNativeBuild() > 0);
	// package.json 不另外放版本號
	assert.equal(JSON.parse(read('package.json')).version, undefined);
	assert.equal(parseAppVersion(['# Version History', '', '## v1.2.3 — 2026-01-01', '## v1.2.2'].join('\n')), '1.2.3');
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
