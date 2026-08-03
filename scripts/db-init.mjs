import { mkdirSync, readFileSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { DatabaseSync } from 'node:sqlite';
import { batches, cultures, glossary, marketYogurts, methods } from '../data/seed-data.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const dbPath = join(root, 'data', 'yogurtguide.db');
const schemaPath = join(root, 'data', 'schema.sql');

mkdirSync(dirname(dbPath), { recursive: true });
rmSync(dbPath, { force: true });

const db = new DatabaseSync(dbPath);
db.exec('PRAGMA foreign_keys = ON;');
db.exec(readFileSync(schemaPath, 'utf8'));

const insertCulture = db.prepare(`
  INSERT INTO cultures (
    id, title, title_en, summary, species, temperature_class, form, source,
    temp_range_c, time_range_h, flavor_profile, texture_profile, reuse_hint,
    body_md, sort_order, draft
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
`);

for (const c of cultures) {
	insertCulture.run(
		c.id,
		c.title,
		c.titleEn,
		c.summary,
		c.species ?? null,
		c.temperatureClass,
		c.form ?? 'powder',
		c.source ?? null,
		c.tempRangeC ?? null,
		c.timeRangeH ?? null,
		c.flavorProfile ?? null,
		c.textureProfile ?? null,
		c.reuseHint ?? null,
		c.bodyMd,
		c.sortOrder,
	);
}

const insertMethod = db.prepare(`
  INSERT INTO methods (id, title, title_en, summary, body_md, draft)
  VALUES (?, ?, ?, ?, ?, 0)
`);
const insertMethodEquipment = db.prepare(`
  INSERT INTO method_equipment (method_id, name, sort_order) VALUES (?, ?, ?)
`);
const insertMethodCulture = db.prepare(`
  INSERT INTO method_cultures (method_id, culture_id) VALUES (?, ?)
`);

for (const m of methods) {
	insertMethod.run(m.id, m.title, m.titleEn, m.summary, m.bodyMd);
	m.equipment.forEach((name, i) => insertMethodEquipment.run(m.id, name, i));
	m.suitableCultures.forEach((cultureId) => insertMethodCulture.run(m.id, cultureId));
}

const insertBatch = db.prepare(`
  INSERT INTO batches (
    id, title, title_en, date, ambient_temp_c, peak_heat_c,
    inoculation_temp_c, incubation_temp_c, incubation_time_h,
    equipment_device, equipment_vessel, equipment_note,
    culture_source, culture_name, culture_origin, culture_amount,
    culture_generation, culture_id, method_id, result_set, result_acidity, result_texture,
    result_whey, result_flavor, result_overall, score_reproducibility,
    score_satisfaction, body_md, draft
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
`);
const insertBatchIngredient = db.prepare(`
  INSERT INTO batch_ingredients (batch_id, type, brand, amount, note, sort_order)
  VALUES (?, ?, ?, ?, ?, ?)
`);

for (const b of batches) {
	insertBatch.run(
		b.id,
		b.title,
		b.titleEn ?? null,
		b.date,
		b.ambientTempC ?? null,
		b.peakHeatC ?? null,
		b.inoculationTempC,
		b.incubationTempC,
		b.incubationTimeH,
		b.equipment?.device ?? null,
		b.equipment?.vessel ?? null,
		b.equipment?.note ?? null,
		b.cultureSource,
		b.cultureName,
		b.cultureOrigin,
		b.cultureAmount,
		b.cultureGeneration ?? null,
		b.cultureId ?? null,
		b.methodId ?? null,
		b.resultSet,
		b.resultAcidity ?? null,
		b.resultTexture ?? null,
		b.resultWhey ?? null,
		b.resultFlavor ?? null,
		b.resultOverall ?? null,
		b.scoreReproducibility ?? null,
		b.scoreSatisfaction ?? null,
		b.bodyMd,
	);
	b.ingredients.forEach((ing, i) =>
		insertBatchIngredient.run(b.id, ing.type, ing.brand, ing.amount, ing.note ?? null, i),
	);
}

const insertGlossary = db.prepare(`
  INSERT INTO glossary (id, term_zh, term_en, category, body_md)
  VALUES (?, ?, ?, ?, ?)
`);

for (const g of glossary) {
	insertGlossary.run(g.id, g.termZh, g.termEn, g.category, g.bodyMd);
}

const insertMarketYogurt = db.prepare(`
  INSERT INTO market_yogurts (
    id, brand, product_name, recommended, milk_base, milk_base_note,
    added_sugar, additives, cultures, ingredients_label, note, sort_order, draft
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
`);

for (const y of marketYogurts) {
	insertMarketYogurt.run(
		y.id,
		y.brand,
		y.productName,
		y.recommended ? 1 : 0,
		y.milkBase,
		y.milkBaseNote,
		y.addedSugar ? 1 : 0,
		y.additives,
		y.cultures,
		y.ingredientsLabel,
		y.note ?? '',
		y.sortOrder,
	);
}

db.close();

const counts = {
	cultures: cultures.length,
	methods: methods.length,
	batches: batches.length,
	glossary: glossary.length,
	marketYogurts: marketYogurts.length,
};
console.log(`SQLite ready: ${dbPath}`);
console.log(counts);
