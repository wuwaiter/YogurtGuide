import assert from 'node:assert/strict';
import test from 'node:test';
import {
	actualHours,
	advance,
	applyEdit,
	createRecord,
	lineName,
	minutesLeft,
	nextAction,
	sortForHome,
	suggestedHours,
	suggestedTempC,
} from '../src/lib/records/model.mjs';

const t0 = new Date('2026-11-16T02:00:00+08:00');
const at = (h) => new Date(t0.getTime() + h * 3_600_000);

test('新菌粉是第 0 代，名稱半形、日期不補零', () => {
	const r = createRecord(
		{ kind: 'starter', cultureName: ' 優比特 500億 ', incubationTempC: '42', plannedHours: '6', startedOn: '2026-10-08' },
		{ now: t0 },
	);
	assert.equal(r.generation, 0);
	assert.equal(r.lineRootId, r.id);
	assert.equal(r.incubationTempC, 42);
	assert.equal(lineName(r), '優比特 500億*0 (2026/10/8)');
});

test('傳代：代數 +1、同一條線、沿用上一代實際發酵時數與溫度', () => {
	let p = createRecord({ kind: 'starter', cultureName: '川秀60菌', incubationTempC: 42, plannedHours: 8 }, { now: t0 });
	p = advance(p, t0);
	p = advance(p, at(7.5));
	assert.equal(actualHours(p), 7.5);
	const c = createRecord({ cultureName: '別的名字' }, { parent: p, now: at(30) });
	assert.equal(c.kind, 'passage');
	assert.equal(c.generation, 1);
	assert.equal(c.lineRootId, p.id);
	assert.equal(c.cultureName, '川秀60菌');
	assert.equal(c.plannedHours, 7.5);
	assert.equal(c.incubationTempC, 42);
	assert.equal(lineName(c), lineName(p).replace('*0', '*1'));
});

test('傳代沒選上一代、類型不合都擋下', () => {
	assert.throws(() => createRecord({ kind: 'passage', cultureName: 'x' }));
	const k = createRecord({ kind: 'kefir', cultureName: '菌粒' }, { now: t0 });
	assert.equal(k.plannedHours, 24);
	assert.equal(k.incubationTempC, null);
	// 有上一代時類型跟著上一代走，不看 input.kind
	assert.equal(createRecord({ kind: 'passage' }, { parent: k }).kind, 'kefir');
	assert.throws(() => createRecord({ kind: 'starter', cultureName: '  ' }), /菌名/);
});

test('階段按鈕依序記時間，剩餘時間可為負', () => {
	let r = createRecord({ kind: 'starter', cultureName: 'A', plannedHours: 8 }, { now: t0 });
	assert.equal(nextAction(r).label, '開始發酵');
	r = advance(r, t0);
	assert.equal(minutesLeft(r, at(6)), 120);
	assert.equal(minutesLeft(r, at(9)), -60);
	r = advance(advance(r, at(8)), at(20));
	assert.equal(r.phase, 'done');
	assert.equal(nextAction(r), null);
	assert.equal(advance(r), r);
});

test('修改：分數只收 1–10，上一代與代數改不到', () => {
	const r = createRecord({ kind: 'starter', cultureName: 'A' }, { now: t0 });
	const e = applyEdit(r, { set: '9', texture: 11, acidity: '', parentId: 'x', generation: 5, hidden: 1 }, at(1));
	assert.equal(e.set, 9);
	assert.equal(e.texture, null);
	assert.equal(e.acidity, null);
	assert.equal(e.parentId, null);
	assert.equal(e.generation, 0);
	assert.equal(e.hidden, true);
	assert.throws(() => applyEdit(r, { cultureName: '' }));
});

test('首頁：發酵中置頂，其餘新到舊', () => {
	const a = { phase: 'done', startedOn: '2026-11-10', createdAt: '1' };
	const b = { phase: 'fermenting', startedOn: '2026-11-01', createdAt: '2' };
	const c = { phase: 'done', startedOn: '2026-11-12', createdAt: '3' };
	assert.deepEqual(sortForHome([a, b, c]), [b, c, a]);
});

test('菌粉建議值', () => {
	assert.equal(suggestedTempC('43°C'), 43);
	assert.equal(suggestedTempC('41–43°C'), 42);
	assert.equal(suggestedTempC('常溫，約 25°C'), null);
	assert.equal(suggestedHours('6–8 小時，天冷可延到 10 小時'), 6);
	assert.equal(suggestedHours('28–32°C 約 15–22 小時；23–27°C 約 23–30 小時'), 15);
	assert.equal(suggestedHours(''), null);
});
