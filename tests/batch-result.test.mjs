// 批次 Markdown 的 result 要和規則一致：凝乳 5 分以下（10 分制）一定是 NG。
import test from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { FAILED_SET_MAX, parseScore10 } from '../src/lib/batch-insights.mjs';

const dir = new URL('../src/content/batches/', import.meta.url);
const field = (text, name) => text.match(new RegExp(String.raw`^${name}:\s*"?([^"\r\n]*)"?`, 'm'))?.[1] ?? null;

test(`凝乳 ${FAILED_SET_MAX} 分以下的批次都寫 result: "NG"`, () => {
	const wrong = [];
	for (const name of readdirSync(dir).filter((n) => n.endsWith('.md'))) {
		const text = readFileSync(new URL(name, dir), 'utf8');
		const set = parseScore10(field(text, 'resultSet'));
		const result = field(text, 'result');
		assert.ok(result === 'OK' || result === 'NG', `${name} 沒有 result（OK 或 NG）`);
		if (set != null && set <= FAILED_SET_MAX && result !== 'NG') wrong.push(`${name}（凝乳 ${set}）`);
	}
	assert.deepEqual(wrong, [], `這些批次凝乳 ${FAILED_SET_MAX} 分以下，result 要改成 "NG"`);
});
