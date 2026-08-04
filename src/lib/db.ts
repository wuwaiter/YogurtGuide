import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { DatabaseSync } from 'node:sqlite';

const dbPath = join(process.cwd(), 'data', 'yogurtguide.db');

let db: DatabaseSync | null = null;

export function getDb() {
	if (!db) {
		db = new DatabaseSync(dbPath, { readOnly: true });
	}
	return db;
}

export type CultureRow = {
	id: string;
	title: string;
	title_en: string;
	summary: string;
	species: string | null;
	temperature_class: 'thermophilic' | 'mesophilic';
	form: string;
	source: string | null;
	temp_range_c: string | null;
	time_range_h: string | null;
	flavor_profile: string | null;
	texture_profile: string | null;
	reuse_hint: string | null;
	body_md: string;
	sort_order: number;
};

export type MethodRow = {
	id: string;
	title: string;
	title_en: string;
	summary: string;
	body_md: string;
};

export type BatchRow = {
	id: string;
	title: string;
	title_en: string | null;
	date: string;
	ambient_temp_c: string | null;
	peak_heat_c: string | null;
	inoculation_temp_c: string;
	incubation_temp_c: string;
	incubation_time_h: string;
	equipment_device: string | null;
	equipment_vessel: string | null;
	equipment_note: string | null;
	culture_source: string;
	culture_name: string;
	culture_origin: string;
	culture_amount: string;
	culture_generation: number | null;
	culture_id: string | null;
	method_id: string | null;
	result_set: string;
	result_acidity: string | null;
	result_texture: string | null;
	result_whey: string | null;
	result_flavor: string | null;
	result_overall: string | null;
	score_reproducibility: number | null;
	score_satisfaction: number | null;
	photo_album_url: string | null;
	photos_json: string;
	body_md: string;
};

export type IngredientRow = {
	type: string;
	brand: string;
	amount: string;
	note: string | null;
};

export type GlossaryRow = {
	id: string;
	term_zh: string;
	term_en: string;
	category: string;
	body_md: string;
};

export function listCultures(): CultureRow[] {
	return getDb()
		.prepare(
			`SELECT * FROM cultures WHERE draft = 0 ORDER BY sort_order ASC, title ASC`,
		)
		.all() as CultureRow[];
}

export function getCulture(id: string): CultureRow | undefined {
	return getDb().prepare(`SELECT * FROM cultures WHERE id = ? AND draft = 0`).get(id) as
		| CultureRow
		| undefined;
}

export function listMethods(): MethodRow[] {
	return getDb()
		.prepare(`SELECT * FROM methods WHERE draft = 0 ORDER BY title ASC`)
		.all() as MethodRow[];
}

export function getMethod(id: string): MethodRow | undefined {
	return getDb().prepare(`SELECT * FROM methods WHERE id = ? AND draft = 0`).get(id) as
		| MethodRow
		| undefined;
}

export function getMethodEquipment(methodId: string): string[] {
	return (
		getDb()
			.prepare(
				`SELECT name FROM method_equipment WHERE method_id = ? ORDER BY sort_order ASC`,
			)
			.all(methodId) as Array<{ name: string }>
	).map((r) => r.name);
}

export function getMethodCultureIds(methodId: string): string[] {
	return (
		getDb()
			.prepare(`SELECT culture_id FROM method_cultures WHERE method_id = ?`)
			.all(methodId) as Array<{ culture_id: string }>
	).map((r) => r.culture_id);
}

export function listBatches(): BatchRow[] {
	return getDb()
		.prepare(`SELECT * FROM batches WHERE draft = 0 ORDER BY date DESC, id DESC`)
		.all() as BatchRow[];
}

export function getBatch(id: string): BatchRow | undefined {
	return getDb().prepare(`SELECT * FROM batches WHERE id = ? AND draft = 0`).get(id) as
		| BatchRow
		| undefined;
}

export function getBatchIngredients(batchId: string): IngredientRow[] {
	return getDb()
		.prepare(
			`SELECT type, brand, amount, note FROM batch_ingredients
       WHERE batch_id = ? ORDER BY sort_order ASC`,
		)
		.all(batchId) as IngredientRow[];
}

export function listGlossary(): GlossaryRow[] {
	return getDb()
		.prepare(`SELECT * FROM glossary ORDER BY term_zh COLLATE NOCASE ASC`)
		.all() as GlossaryRow[];
}

export type MarketYogurtRow = {
	id: string;
	brand: string;
	product_name: string;
	recommended: number;
	milk_base: 'fresh' | 'powder' | 'mixed' | 'other';
	milk_base_note: string;
	added_sugar: number;
	additives: string;
	cultures: string;
	ingredients_label: string;
	note: string;
	sort_order: number;
};

export function listMarketYogurts(): MarketYogurtRow[] {
	return getDb()
		.prepare(
			`SELECT * FROM market_yogurts WHERE draft = 0 ORDER BY recommended DESC, sort_order ASC`,
		)
		.all() as MarketYogurtRow[];
}

/** Ensure DB exists when Astro starts (dev/build). */
export function assertDbExists() {
	try {
		readFileSync(dbPath);
	} catch {
		throw new Error(
			`找不到 ${dbPath}。請先執行：npm run db:init`,
		);
	}
}
