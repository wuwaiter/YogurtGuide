// 紀錄只存在這支手機的 SQLite 資料庫檔（App 私有資料夾），不上傳、不同步。
// 只有 App（nativeBuild ≥ 2，有 @capacitor-community/sqlite）能存；網站版與打不開時直接丟錯，
// 頁面要顯示錯誤，不能讓使用者以為存好了。
// 注意：移除 App 或在系統設定按「清除資料」，資料庫檔會一起消失；真正的保險是之後的 Google Drive 備份
// （資料都在同一個 .db 檔，備份時上傳這個檔即可）。
// 頁面只用 recordStore.all/get/put，換存法只改這個檔。測試見 tests/records-store.test.mjs。

export interface StoredRecord {
	id: string;
	[key: string]: unknown;
}

export const DB_NAME = 'yogurtguide-records';
export const UNAVAILABLE_MESSAGE = '「我的紀錄」只能在 Android App 裡使用，網頁版不能存紀錄。';

/** 只列出這裡用到的外掛功能，測試時可以換成假的。 */
interface DbConnection {
	isDBOpen(): Promise<{ result?: boolean }>;
	open(): Promise<void>;
	execute(statements: string): Promise<unknown>;
	query(statement: string, values?: unknown[]): Promise<{ values?: unknown[] }>;
	run(statement: string, values?: unknown[]): Promise<unknown>;
}
interface SqliteConnection {
	checkConnectionsConsistency(): Promise<{ result?: boolean }>;
	isConnection(database: string, readonly: boolean): Promise<{ result?: boolean }>;
	retrieveConnection(database: string, readonly: boolean): Promise<DbConnection>;
	createConnection(
		database: string,
		encrypted: boolean,
		mode: string,
		version: number,
		readonly: boolean,
	): Promise<DbConnection>;
}
export interface StoreDeps {
	/** 是不是 App，而且原生端有 SQLite 外掛。 */
	available(): Promise<boolean>;
	/** 建立外掛的 SQLiteConnection。 */
	connect(): Promise<SqliteConnection>;
}

async function openDb(sqlite: SqliteConnection): Promise<DbConnection> {
	// App 換頁時網頁重新載入，但原生端的連線還開著：先對齊，有就沿用，不重開（重開會出錯）。
	const consistent = (await sqlite.checkConnectionsConsistency()).result;
	const exists = (await sqlite.isConnection(DB_NAME, false)).result;
	const db =
		consistent && exists
			? await sqlite.retrieveConnection(DB_NAME, false)
			: await sqlite.createConnection(DB_NAME, false, 'no-encryption', 1, false);
	if (!(await db.isDBOpen()).result) await db.open();
	await db.execute(
		'CREATE TABLE IF NOT EXISTS records (id TEXT PRIMARY KEY NOT NULL, json TEXT NOT NULL, updatedAt TEXT NOT NULL);',
	);
	return db;
}

export function createRecordStore(deps: StoreDeps) {
	let dbPromise: Promise<DbConnection> | null = null;
	const db = () =>
		(dbPromise ??= (async () => {
			if (!(await deps.available())) throw new Error(UNAVAILABLE_MESSAGE);
			return openDb(await deps.connect());
		})().catch((error) => {
			dbPromise = null; // 下次再試，不要一直卡在失敗
			throw error;
		}));
	const parse = (rows: unknown[] | undefined) =>
		((rows ?? []) as { json: string }[]).map((row) => JSON.parse(row.json) as StoredRecord);

	return {
		all: async () => parse((await (await db()).query('SELECT json FROM records;')).values),
		get: async (id: string) =>
			parse((await (await db()).query('SELECT json FROM records WHERE id = ?;', [id])).values)[0],
		put: async (record: StoredRecord) => {
			await (await db()).run('INSERT OR REPLACE INTO records (id, json, updatedAt) VALUES (?, ?, ?);', [
				record.id,
				JSON.stringify(record),
				new Date().toISOString(),
			]);
			return record;
		},
	};
}

// 動態載入：網站版不會把 SQLite 外掛打包進主程式。
export const recordStore = createRecordStore({
	async available() {
		const { Capacitor } = await import('@capacitor/core');
		return Capacitor.isNativePlatform() && Capacitor.isPluginAvailable('CapacitorSQLite');
	},
	async connect() {
		const { CapacitorSQLite, SQLiteConnection } = await import('@capacitor-community/sqlite');
		return new SQLiteConnection(CapacitorSQLite) as unknown as SqliteConnection;
	},
});
