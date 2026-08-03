-- YogurtGuide SQLite schema
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS cultures (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  title_en TEXT NOT NULL,
  summary TEXT NOT NULL,
  species TEXT,
  temperature_class TEXT NOT NULL CHECK (temperature_class IN ('thermophilic', 'mesophilic')),
  form TEXT NOT NULL DEFAULT 'powder',
  source TEXT,
  temp_range_c TEXT,
  time_range_h TEXT,
  flavor_profile TEXT,
  texture_profile TEXT,
  reuse_hint TEXT,
  body_md TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 100,
  draft INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS methods (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  title_en TEXT NOT NULL,
  summary TEXT NOT NULL,
  body_md TEXT NOT NULL DEFAULT '',
  draft INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS method_equipment (
  method_id TEXT NOT NULL REFERENCES methods(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (method_id, name)
);

CREATE TABLE IF NOT EXISTS method_cultures (
  method_id TEXT NOT NULL REFERENCES methods(id) ON DELETE CASCADE,
  culture_id TEXT NOT NULL REFERENCES cultures(id) ON DELETE CASCADE,
  PRIMARY KEY (method_id, culture_id)
);

CREATE TABLE IF NOT EXISTS batches (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  title_en TEXT,
  date TEXT NOT NULL,
  ambient_temp_c TEXT,
  peak_heat_c TEXT,
  inoculation_temp_c TEXT NOT NULL,
  incubation_temp_c TEXT NOT NULL,
  incubation_time_h TEXT NOT NULL,
  equipment_device TEXT,
  equipment_vessel TEXT,
  equipment_note TEXT,
  culture_source TEXT NOT NULL CHECK (culture_source IN ('mother', 'new-powder', 'commercial-yogurt', 'other')),
  culture_name TEXT NOT NULL,
  culture_origin TEXT NOT NULL,
  culture_amount TEXT NOT NULL,
  culture_generation INTEGER,
  culture_id TEXT REFERENCES cultures(id),
  method_id TEXT REFERENCES methods(id),
  result_set TEXT NOT NULL,
  result_acidity TEXT,
  result_texture TEXT,
  result_whey TEXT,
  result_flavor TEXT,
  result_overall TEXT,
  score_reproducibility INTEGER,
  score_satisfaction INTEGER,
  body_md TEXT NOT NULL DEFAULT '',
  draft INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS batch_equipment (
  batch_id TEXT NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (batch_id, name)
);

CREATE TABLE IF NOT EXISTS batch_ingredients (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  batch_id TEXT NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('fresh-milk', 'milk-powder', 'water', 'other')),
  brand TEXT NOT NULL,
  amount TEXT NOT NULL,
  note TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS glossary (
  id TEXT PRIMARY KEY,
  term_zh TEXT NOT NULL,
  term_en TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('process', 'microbiology', 'quality', 'equipment', 'general')),
  body_md TEXT NOT NULL DEFAULT ''
);

-- 市售優格對照（成分以公開標示整理；配方可能改版）
CREATE TABLE IF NOT EXISTS market_yogurts (
  id TEXT PRIMARY KEY,
  brand TEXT NOT NULL,
  product_name TEXT NOT NULL,
  recommended INTEGER NOT NULL DEFAULT 0 CHECK (recommended IN (0, 1)),
  milk_base TEXT NOT NULL CHECK (milk_base IN ('fresh', 'powder', 'mixed', 'other')),
  milk_base_note TEXT NOT NULL DEFAULT '',
  added_sugar INTEGER NOT NULL DEFAULT 0 CHECK (added_sugar IN (0, 1)),
  additives TEXT NOT NULL DEFAULT '',
  cultures TEXT NOT NULL,
  ingredients_label TEXT NOT NULL DEFAULT '',
  note TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 100,
  draft INTEGER NOT NULL DEFAULT 0
);
