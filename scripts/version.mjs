// 版本號唯一來源：md/Version.md 最上面那一筆（## vX.Y.Z）。
// 用到的地方：Android versionName（android/app/build.gradle 用同一個規則讀）、build.json 的 version（App 設定頁顯示）。
// 另一個數字 nativeBuild（src/config/platforms.ts）只在原生改動時加 1，是 Android 的 versionCode，兩者用途不同。
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

/** 從 Version.md 的文字取最新版本號（不含 v）。 */
export function parseAppVersion(text) {
	const match = String(text).match(/^## v(\d+\.\d+\.\d+)/m);
	if (!match) throw new Error('md/Version.md 找不到「## vX.Y.Z」');
	return match[1];
}

export function readAppVersion() {
	return parseAppVersion(readFileSync(join(root, 'md', 'Version.md'), 'utf8'));
}
