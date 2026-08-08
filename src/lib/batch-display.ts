import type { CollectionEntry } from 'astro:content';

type BatchData = CollectionEntry<'batches'>['data'];

/** `2026-08-01` → `2026/08/01` */
export function formatBatchDate(isoDate: string): string {
	return isoDate.replaceAll('-', '/');
}

/** 列表／頁首副標：菌種名或市售優格；有傳代則加上次數 */
export function formatBatchCultureLabel(batch: {
	cultureName: string;
	cultureGeneration?: number;
}): string {
	const name = batch.cultureName;
	if (batch.cultureGeneration != null) {
		return `${name} · 傳代第 ${batch.cultureGeneration} 次`;
	}
	return name;
}

export function batchPageTitle(batch: BatchData): string {
	return formatBatchDate(batch.date);
}
