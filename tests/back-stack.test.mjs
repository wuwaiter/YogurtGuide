import test from 'node:test';
import assert from 'node:assert/strict';
import { backDepth, handleBack, pushBack } from '../src/lib/back-stack.mjs';

test('返回鍵：先關最上層，關完才交給上一頁', () => {
	const closed = [];
	const removeDrawer = pushBack(() => closed.push('drawer'));
	pushBack(() => closed.push('photo'));
	assert.equal(backDepth(), 2);
	assert.equal(handleBack(), true);
	assert.deepEqual(closed, ['photo']);
	// 使用者自己點掉選單：取消登記，返回鍵不會再關一次
	removeDrawer();
	removeDrawer();
	assert.equal(backDepth(), 0);
	assert.equal(handleBack(), false);
	assert.deepEqual(closed, ['photo']);
});
