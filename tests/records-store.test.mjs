// 「我的紀錄」SQLite 存取：用假的外掛測，不需要手機。
import test from 'node:test';
import assert from 'node:assert/strict';
import { createRecordStore, DB_NAME, UNAVAILABLE_MESSAGE } from '../src/lib/records/store.ts';

/** 模擬原生端：連線與資料表在「網頁重新載入」後仍然存在。 */
function fakeNative() {
	const rows = new Map();
	const native = { connections: new Set(), opened: new Set(), created: 0, retrieved: 0, failOpen: false };
	const connection = (name) => ({
		async isDBOpen() {
			return { result: native.opened.has(name) };
		},
		async open() {
			if (native.failOpen) throw new Error('disk I/O error');
			if (native.opened.has(name)) throw new Error('database already open');
			native.opened.add(name);
		},
		async execute() {},
		async query(sql, values = []) {
			const list = [...rows.values()];
			return { values: sql.includes('WHERE id') ? list.filter((r) => r.id === values[0]) : list };
		},
		async run(sql, [id, json, updatedAt]) {
			assert.match(sql, /INSERT OR REPLACE/);
			rows.set(id, { id, json, updatedAt });
		},
	});
	/** 每次網頁載入都會 new 一個 SQLiteConnection；它不知道原生端已有的連線。 */
	const pageLoad = () => {
		const known = new Set();
		return {
			async checkConnectionsConsistency() {
				return { result: native.connections.size > 0 };
			},
			async isConnection(name) {
				return { result: native.connections.has(name) || known.has(name) };
			},
			async retrieveConnection(name) {
				native.retrieved++;
				return connection(name);
			},
			async createConnection(name) {
				if (native.connections.has(name)) throw new Error(`Connection ${name} already exists`);
				native.created++;
				native.connections.add(name);
				known.add(name);
				return connection(name);
			},
		};
	};
	return { native, rows, pageLoad };
}

const storeFor = (env, available = true) =>
	createRecordStore({ available: async () => available, connect: async () => env.pageLoad() });

test('存了能讀回來，同一個 id 存兩次是覆蓋', async () => {
	const env = fakeNative();
	const store = storeFor(env);
	const rec = { id: 'a1', kind: 'powder', set: 7, note: '酸度剛好', parent: null, nested: { h: 8 } };
	await store.put(rec);
	assert.deepEqual(await store.get('a1'), rec);
	assert.deepEqual(await store.all(), [rec]);

	await store.put({ ...rec, set: 9 });
	const all = await store.all();
	assert.equal(all.length, 1);
	assert.equal(all[0].set, 9);
	assert.equal(await store.get('nope'), undefined);
});

test('換頁（網頁重新載入）沿用原生端的連線，不重開', async () => {
	const env = fakeNative();
	await storeFor(env).put({ id: 'a1' });
	assert.equal(env.native.created, 1);

	// 下一頁：新的 JS、新的 SQLiteConnection，原生端連線還開著
	const next = storeFor(env);
	assert.deepEqual(await next.all(), [{ id: 'a1' }]);
	assert.equal(env.native.created, 1, '不能再 createConnection');
	assert.equal(env.native.retrieved, 1, '要用 retrieveConnection');
	assert.equal(env.rows.size, 1);
});

test('網頁版或沒有外掛：丟出「只能在 App 使用」', async () => {
	const store = storeFor(fakeNative(), false);
	await assert.rejects(store.put({ id: 'x' }), { message: UNAVAILABLE_MESSAGE });
	await assert.rejects(store.all(), { message: UNAVAILABLE_MESSAGE });
});

test('資料庫打不開：put 要失敗（頁面據此顯示錯誤），修好後可再試', async () => {
	const env = fakeNative();
	env.native.failOpen = true;
	const store = storeFor(env);
	await assert.rejects(store.put({ id: 'x' }), /disk I\/O error/);
	assert.equal(env.rows.size, 0);

	env.native.failOpen = false;
	await store.put({ id: 'x' });
	assert.equal(env.rows.size, 1);
});

test('資料庫名稱固定（改名等於換一個空資料庫）', () => {
	assert.equal(DB_NAME, 'yogurtguide-records');
});
