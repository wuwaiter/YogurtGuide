import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const cultures = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/cultures' }),
	schema: z.object({
		title: z.string(),
		titleEn: z.string(),
		species: z.string().optional(),
		form: z.enum(['powder', 'liquid', 'commercial-yogurt', 'other']),
		source: z.string().optional(),
		tempRangeC: z.string().optional(),
		timeRangeH: z.string().optional(),
		flavorProfile: z.string().optional(),
		textureProfile: z.string().optional(),
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

const batches = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/batches' }),
	schema: z.object({
		title: z.string(),
		titleEn: z.string().optional(),
		date: z.coerce.date(),
		culture: z.string(),
		method: z.string(),
		milk: z.string(),
		inoculationRate: z.string(),
		peakHeatC: z.string().optional(),
		inoculationTempC: z.string(),
		incubationTempC: z.string(),
		incubationTimeH: z.string(),
		acidity: z.string().optional(),
		texture: z.string().optional(),
		wheySeparation: z.string().optional(),
		flavor: z.string().optional(),
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
