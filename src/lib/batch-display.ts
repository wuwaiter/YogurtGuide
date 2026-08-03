import type { BatchRow } from './db';

/** `2026-08-01` → `2026/08/01` */
export function formatBatchDate(isoDate: string): string {
	return isoDate.replaceAll('-', '/');
}

/** 列表／頁首副標：菌種名或市售優格；有傳代則加上次數 */
export function formatBatchCultureLabel(batch: {
	culture_name: string;
	culture_generation: number | null;
}): string {
	const name = batch.culture_name;
	if (batch.culture_generation != null) {
		return `${name} · 傳代第 ${batch.culture_generation} 次`;
	}
	return name;
}

export function batchPageTitle(batch: BatchRow): string {
	return formatBatchDate(batch.date);
}
