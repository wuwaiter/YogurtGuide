// 「幾點去看」用本機時間，固定成台灣時間，CI 在 UTC 也算得一樣。
process.env.TZ = 'Asia/Taipei';
import assert from 'node:assert/strict';
import test from 'node:test';
import { adjustFromResult, fermentAdvice, sameCulture } from '../src/lib/records/advice.mjs';

const site = {
	items: [
		{ id: 'x', failed: true, incubationHours: 14.5 },
		{ id: 'y', failed: false, incubationHours: 8 },
	],
	cultures: [
		{ cultureName: '優比特500億', batchCount: 2, best: { incubationTempC: 42, incubationHours: 8, set: 9, acidity: 4 } },
	],
	hoursBands: [
		{ label: '8 小時以內', count: 6, avgAcidity: 4.2 },
		{ label: '8–11 小時', count: 9, avgAcidity: 5.6 },
		{ label: '超過 11 小時', count: 7, avgAcidity: 5.3 },
	],
};
const noon = new Date('2026-11-16T12:00:00+08:00');
const done = (over) => ({
	id: 'm1',
	phase: 'done',
	kind: 'starter',
	cultureName: '優比特 500億',
	startedOn: '2026-11-10',
	fermentStartAt: '2026-11-10T00:00:00Z',
	chillStartAt: '2026-11-10T07:00:00Z',
	set: 9,
	texture: 8,
	acidity: 4,
	...over,
});

test('菌名比對', () => {
	assert.ok(sameCulture('優比特 500億', '優比特500億'));
	assert.ok(sameCulture('川秀60菌', '川秀 60菌 優格粉'));
	assert.ok(!sameCulture('優比特50菌', '優比特500億'));
	assert.ok(!sameCulture('A', 'AB'));
});

test('依成品微調', () => {
	assert.equal(adjustFromResult(8, { acidity: 7, set: 9 }).hours, 7);
	assert.equal(adjustFromResult(8, { acidity: 3, set: 4 }).hours, 9);
	assert.equal(adjustFromResult(8, { acidity: 4, set: 8 }).hours, 8);
});

test('優先用自己的紀錄，太酸就少 1 小時', () => {
	const a = fermentAdvice(
		{ kind: 'starter', cultureName: '優比特500億', incubationTempC: 42 },
		{ records: [done({ acidity: 7 })], site, now: noon },
	);
	assert.equal(a.confidence, 'mine');
	assert.equal(a.hours, 6);
	assert.ok(a.basis.some((b) => b.source === 'site'));
});

test('沒有自己的紀錄就用站主資料，再沒有用包裝，再沒有用預設', () => {
	const s = fermentAdvice({ kind: 'starter', cultureName: '優比特 500億', incubationTempC: 42 }, { site, now: noon });
	assert.equal(s.confidence, 'site');
	assert.equal(s.hours, 8);
	const p = fermentAdvice(
		{ kind: 'starter', cultureName: '新菌粉', incubationTempC: 42 },
		{ site, pkg: { hours: 6, text: '6–8 小時' }, now: noon },
	);
	assert.equal(p.confidence, 'package');
	assert.equal(p.hours, 6);
	const d = fermentAdvice({ kind: 'kefir', cultureName: '菌粒' }, { now: noon });
	assert.equal(d.confidence, 'default');
	assert.equal(d.hours, 24);
});

test('傳代用上一代時間；溫度不夠多 2 小時並警告', () => {
	const parent = done({ id: 'p', cultureName: '某菌', acidity: 3, set: 8, incubationTempC: 36 });
	const a = fermentAdvice({ kind: 'passage' }, { parent, now: noon });
	assert.equal(a.confidence, 'parent');
	assert.equal(a.hours, 9);
	assert.ok(a.tips.some((t) => t.level === 'warn' && t.text.includes('40–43')));
});

test('Kefir 天冷拉長、天熱縮短', () => {
	assert.equal(fermentAdvice({ kind: 'kefir', cultureName: 'k', ambientTempC: 16 }, { now: noon }).hours, 31);
	assert.equal(fermentAdvice({ kind: 'kefir', cultureName: 'k', ambientTempC: 30 }, { now: noon }).hours, 19);
});

test('超過 8 小時提示酸度；接近失敗時數警告；半夜到時間建議開始時間', () => {
	const late = new Date('2026-11-16T20:00:00+08:00');
	const a = fermentAdvice(
		{ kind: 'starter', cultureName: '新菌', incubationTempC: 42, ingredients: '鮮奶' },
		{ site, pkg: { hours: 14, text: '14 小時' }, now: late },
	);
	assert.equal(a.hours, 14);
	assert.ok(a.tips.some((t) => t.text.includes('平均酸度 4.2')));
	assert.ok(a.tips.some((t) => t.text.includes('14.5 小時失敗')));
	assert.ok(a.tips.some((t) => t.text.includes('脫脂奶粉')));
	const night = fermentAdvice({ kind: 'starter', cultureName: '新菌', incubationTempC: 42 }, { pkg: { hours: 8, text: '' }, now: late });
	assert.ok(night.tips.some((t) => t.text.includes('23:00 開始')));
	assert.ok(night.timing.text.includes('明天 04:00'));
});
