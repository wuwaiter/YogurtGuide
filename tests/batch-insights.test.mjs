import assert from 'node:assert/strict';
import test from 'node:test';
import {
	batchMetrics,
	formatHours,
	hoursBands,
	parseIncubationHours,
	parseScore10,
	parseTempC,
	summarizeByCulture,
} from '../src/lib/batch-insights.mjs';

test('發酵時數取發酵段，不取冷藏段', () => {
	assert.equal(parseIncubationHours('02:00–12:30（10h30m）；冷藏 12:30–22:00（9h30m）'), 10.5);
	assert.equal(parseIncubationHours('11h'), 11);
	assert.equal(parseIncubationHours('6h（其後移入冰箱冷藏）'), 6);
	assert.equal(parseIncubationHours('一整晚'), null);
});

test('溫度與分數', () => {
	assert.equal(parseTempC('42'), 42);
	assert.equal(parseTempC('約 32（微波爐＋熱水碗蒸汽輔助）'), 32);
	assert.equal(parseTempC('微波爐保溫（未另加熱）'), null);
	assert.equal(parseScore10('8/10'), 8);
	assert.equal(parseScore10('3/5'), 6);
	assert.equal(parseScore10('4/10（分數越高越酸）'), 4);
	assert.equal(parseScore10('凝乳完整但略為過頭'), null);
	assert.equal(formatHours(9.5), '9h30m');
	assert.equal(formatHours(8), '8h');
});

const base = { incubationTempC: '42', cultureSource: 'new-powder', resultTexture: '8/10' };
const make = (id, date, name, hours, set, acidity) =>
	batchMetrics(id, {
		...base,
		date,
		cultureName: name,
		incubationTimeH: `${hours}h`,
		resultSet: `${set}/10`,
		resultAcidity: `${acidity}/10`,
	});

test('菌種整理：失敗不進平均，最佳同分取酸度低', () => {
	const items = [
		make('a', '2026-01-01', '菌 A', 8, 9, 6),
		make('b', '2026-01-03', '菌 A', 7, 9, 3),
		make('c', '2026-01-05', '菌A', 14, 0, 6),
		make('d', '2026-01-02', '菌 B', 10, 7, 4),
	];
	const [a, b] = summarizeByCulture(items);
	assert.equal(a.cultureKey, '菌A');
	assert.equal(a.batchCount, 3);
	assert.equal(a.failedCount, 1);
	assert.equal(a.avgHours, 7.5);
	assert.equal(a.bestBatchId, 'b');
	assert.equal(b.cultureKey, '菌B');

	const bands = hoursBands(items);
	assert.deepEqual(
		bands.map((x) => x.count),
		[2, 1, 0],
	);
});
