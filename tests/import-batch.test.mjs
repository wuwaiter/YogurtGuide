import assert from 'node:assert/strict';
import test from 'node:test';
import { parseBatchText, renderBatchMarkdown } from '../scripts/import-batch.mjs';

test('解析簡單鮮奶與菌粉批次', () => {
	const batch = parseBatchText(`日期：8/30
室溫：28 度
發酵溫度：42 度
牛奶：鮮奶 400ml
菌種：菌粉（川秀60菌）
發酵：02:00-15:00
冷藏：15:00-20:00
凝乳：9/10
質地：7/10
酸度：8/10
評價：第一行
第二行`, 2026);

	assert.equal(batch.date, '2026-08-30');
	assert.equal(batch.incubationTimeH, '02:00–15:00（13h）；冷藏 15:00–20:00（5h）');
	assert.deepEqual(batch.ingredients, [{ type: 'fresh-milk', amount: '400ml' }]);
	assert.equal(batch.cultureSource, 'new-powder');
	assert.equal(batch.cultureName, '川秀60菌');
	assert.equal(batch.resultOverall, '第一行 第二行');
	assert.match(batch.resultAcidity, /分數越高越酸/);
});

test('解析奶粉混合、市售優格與容量', () => {
	const batch = parseBatchText(`2026/08/31
室溫：28
發酵溫度：42
牛奶：鮮奶 400ml（義美全脂） + 奶粉 290ml（豐力富全脂奶粉 40ml + 水 250ml）
菌種：市售優格（心樸優格 120ml）
發酵：22:00-08:00
冷藏：08:00-12:30
凝乳：9/10`, 2026);

	assert.equal(batch.incubationTimeH, '22:00–08:00（10h）；冷藏 08:00–12:30（4h30m）');
	assert.deepEqual(batch.ingredients, [
		{ type: 'fresh-milk', amount: '400ml', brand: '義美全脂' },
		{ type: 'milk-powder', brand: '豐力富全脂', amount: '40ml' },
		{ type: 'water', amount: '250ml' },
	]);
	assert.equal(batch.cultureSource, 'commercial-yogurt');
	assert.equal(batch.cultureAmount, '120ml');
});

test('解析傳代並輸出合法 frontmatter 欄位', () => {
	const batch = parseBatchText(`8/31
室溫：28
發酵溫度：42
牛奶：鮮奶 400ml
菌種：傳代（川秀60菌 傳代*2 60ml）
發酵：0200-1500
冷藏：1500-2000
凝乳：9/10`, 2026);
	const markdown = renderBatchMarkdown(batch);

	assert.equal(batch.cultureGeneration, 2);
	assert.equal(batch.cultureAmount, '60ml');
	assert.match(markdown, /cultureSource: "mother"/);
	assert.match(markdown, /cultureGeneration: 2/);
	assert.match(markdown, /cultureAmount: "60ml"/);
});

test('拒絕尚未填寫的範本評價', () => {
	assert.throws(
		() => parseBatchText(`8/30
室溫：28
發酵溫度：42
牛奶：鮮奶 400ml
菌種：菌粉（川秀60菌）
發酵：02:00-15:00
冷藏：15:00-20:00
凝乳：9/10
評價：在這裡輸入成品觀察`, 2026),
		/評價仍是範本內容/,
	);
});

test('拒絕沒有填寫日期的空白範本', () => {
	assert.throws(
		() => parseBatchText('日期：\n室溫：\n發酵溫度：\n'),
		/找不到日期/,
	);
});
