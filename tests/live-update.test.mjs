import test from 'node:test';
import assert from 'node:assert/strict';
import { decideUpdate, hasPendingBundle, pullLabel, shouldCheckOnResume } from '../src/lib/live-update.mjs';

const latest = { bundleId: 'c2', minNativeBuild: 2 };
const base = { ownCommit: 'c1', latest, nativeBuild: '2', currentBundleId: 'c1', nextBundleId: null, downloadedIds: [] };

test('有新版：下載 → 已下載就設為下次使用 → 設好就是 ready', () => {
	assert.equal(decideUpdate(base), 'download');
	assert.equal(decideUpdate({ ...base, downloadedIds: ['c2'] }), 'set-next');
	assert.equal(decideUpdate({ ...base, downloadedIds: ['c2'], nextBundleId: 'c2' }), 'ready');
});

test('已是最新、沒網路、原生層太舊', () => {
	assert.equal(decideUpdate({ ...base, ownCommit: 'c2' }), 'latest');
	assert.equal(decideUpdate({ ...base, currentBundleId: 'c2' }), 'latest');
	assert.equal(decideUpdate({ ...base, latest: null }), 'offline');
	assert.equal(decideUpdate({ ...base, nativeBuild: '1' }), 'needs-store-update');
});

test('提示：有下載好、還沒換上的版本才顯示', () => {
	assert.equal(hasPendingBundle({ currentBundleId: 'c1', nextBundleId: 'c2' }), true);
	assert.equal(hasPendingBundle({ currentBundleId: null, nextBundleId: 'c2' }), true);
	assert.equal(hasPendingBundle({ currentBundleId: 'c2', nextBundleId: 'c2' }), false);
	assert.equal(hasPendingBundle({ currentBundleId: 'c1', nextBundleId: null }), false);
});

test('從背景回來：第一次一定檢查，之後至少隔 5 分鐘', () => {
	const now = 1_000_000_000;
	assert.equal(shouldCheckOnResume(null, now), true);
	assert.equal(shouldCheckOnResume(String(now - 60_000), now), false);
	assert.equal(shouldCheckOnResume(String(now - 5 * 60_000), now), true);
});

test('下拉提示文字', () => {
	assert.equal(pullLabel(5), null);
	assert.equal(pullLabel(40), '下拉檢查更新');
	assert.equal(pullLabel(80), '放開以檢查更新');
});
