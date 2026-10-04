import assert from 'node:assert/strict';
import test from 'node:test';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { importBatches, openTableDatabase, readBatchFiles, tableNames } from '../scripts/import-batches-sqlite.mjs';

const batchesDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'content', 'batches');

function openMemoryDatabases() {
	return Object.fromEntries(tableNames.map((tableName) => [tableName, openTableDatabase(':memory:', tableName)]));
}

test('Markdown 批次可寫進三個 SQLite 檔，b018 欄位對得上', () => {
	const batches = readBatchFiles(batchesDir);

	const databases = openMemoryDatabases();
	importBatches(databases, batches);

	assert.equal(databases.batches.prepare('SELECT COUNT(*) AS n FROM batches').get().n, batches.length);
	const batch = databases.batches.prepare('SELECT * FROM batches WHERE id = ?').get('b018-20260927');
	assert.equal(batch.date, '2026-09-27');
	assert.equal(batch.culture_name, '優比特50菌');
	assert.equal(batch.culture_source, 'new-powder');
	assert.equal(batch.result_set, '8/10');
	assert.equal(batch.result_texture, '8/10');
	assert.match(batch.result_acidity, /^3\/10/);
	assert.equal(batch.draft, 0);

	const ingredients = databases.batch_ingredients.prepare(
		'SELECT type, brand, amount FROM batch_ingredients WHERE batch_id = ? ORDER BY position',
	).all('b018-20260927');
	assert.deepEqual(ingredients.map((row) => ({ ...row })), [
		{ type: 'fresh-milk', brand: '義美全脂', amount: '400ml' },
		{ type: 'milk-powder', brand: 'Synlait脫脂', amount: '40ml' },
		{ type: 'water', brand: null, amount: '260ml' },
	]);
	for (const db of Object.values(databases)) db.close();
});

test('最新批次 b020 的傳代與評分寫得進 SQLite', () => {
	const batches = readBatchFiles(batchesDir);
	const databases = openMemoryDatabases();
	importBatches(databases, batches);

	const batch = databases.batches.prepare('SELECT * FROM batches WHERE id = ?').get('b020-20261002');
	assert.equal(batch.date, '2026-10-02');
	assert.equal(batch.culture_name, 'Long Skyr');
	assert.equal(batch.culture_source, 'mother');
	assert.equal(batch.culture_generation, 2);
	assert.equal(batch.result_set, '8/10');
	assert.equal(batch.result_texture, '8/10');
	assert.match(batch.result_acidity, /^4\/10/);
	for (const db of Object.values(databases)) db.close();
});

test('每個檔只有一張表，表名與檔名相同', () => {
	const databases = openMemoryDatabases();
	for (const tableName of tableNames) {
		const tables = databases[tableName].prepare("SELECT name FROM sqlite_master WHERE type = 'table'").all();
		assert.deepEqual(tables.map((row) => row.name), [tableName]);
		databases[tableName].close();
	}
});
