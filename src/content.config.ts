import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const cultures = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/cultures' }),
	schema: z.object({
		title: z.string(),
		titleEn: z.string(),
		summary: z.string(),
		species: z.string().optional(),
		temperatureClass: z.enum(['thermophilic', 'mesophilic']),
		form: z.enum(['powder', 'liquid', 'commercial-yogurt', 'other']).default('powder'),
		source: z.string().optional(),
		tempRangeC: z.string().optional(),
		timeRangeH: z.string().optional(),
		flavorProfile: z.string().optional(),
		textureProfile: z.string().optional(),
		reuseHint: z.string().optional(),
		sortOrder: z.number().default(100),
		draft: z.boolean().default(false),
	}),
});

const methods = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/methods' }),
	schema: z.object({
		title: z.string(),
		titleEn: z.string(),
		summary: z.string(),
		equipment: z.array(z.string()).default([]),
		suitableCultures: z.array(z.string()).default([]),
		draft: z.boolean().default(false),
	}),
});

const ingredient = z.object({
	/** 鮮奶 / 奶粉 / 水 / 其他 */
	type: z.enum(['fresh-milk', 'milk-powder', 'water', 'other']),
	/** 品牌（必填） */
	brand: z.string(),
	/** 份量，例如 1000 ml、80 g */
	amount: z.string(),
	note: z.string().optional(),
});

const batches = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/batches' }),
	schema: z.object({
		title: z.string(),
		titleEn: z.string().optional(),

		/** 1. 日期及溫度 */
		date: z.coerce.date(),
		ambientTempC: z.string().optional(),
		peakHeatC: z.string().optional(),
		inoculationTempC: z.string(),
		incubationTempC: z.string(),
		incubationTimeH: z.string(),

		/** 2. 器材 */
		equipment: z.array(z.string()).min(1),

		/** 3. 食材與份量（含品牌） */
		ingredients: z.array(ingredient).min(1),

		/** 4. 菌種 */
		/** mother = 留存母種；new-powder = 新菌粉；commercial-yogurt = 市售優格當 starter */
		cultureSource: z.enum(['mother', 'new-powder', 'commercial-yogurt', 'other']),
		cultureName: z.string(),
		/** 購得處，或母種來自哪一批次 */
		cultureOrigin: z.string(),
		cultureAmount: z.string(),
		/** 可選：連到菌種檔 slug */
		culture: z.string().optional(),
		method: z.string().optional(),

		/** 5. 成品狀況 */
		resultSet: z.string(),
		resultAcidity: z.string().optional(),
		resultTexture: z.string().optional(),
		resultWhey: z.string().optional(),
		resultFlavor: z.string().optional(),
		resultOverall: z.string().optional(),

		scoreReproducibility: z.number().min(1).max(5).optional(),
		scoreSatisfaction: z.number().min(1).max(5).optional(),
		draft: z.boolean().default(false),
	}),
});

const glossary = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/glossary' }),
	schema: z.object({
		termZh: z.string(),
		termEn: z.string(),
		category: z.enum(['process', 'microbiology', 'quality', 'equipment', 'general']),
	}),
});

export const collections = { cultures, methods, batches, glossary };
