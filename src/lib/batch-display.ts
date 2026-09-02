import type { CollectionEntry } from 'astro:content';

type BatchData = CollectionEntry<'batches'>['data'];

/** `2026-08-01` → `2026/08/01` */
export function formatBatchDate(isoDate: string): string {
	return isoDate.replaceAll('-', '/');
}

/** 批次列表與內容頁共用的菌種顯示格式。 */
export function formatBatchCultureLabel(batch: {
	cultureSource: string;
	cultureName: string;
	cultureAmount?: string;
	cultureGeneration?: number;
}): string {
	const name = batch.cultureName.trim();
	const rawAmount = batch.cultureAmount?.replace(/\s+/g, '');
	const amount = rawAmount && rawAmount !== '未記' ? rawAmount : '';

	switch (batch.cultureSource) {
		case 'commercial-yogurt':
			return amount ? `市售優格（${name} ${amount}）` : `市售優格（${name}）`;
		case 'new-powder':
			return `菌粉（${name}）`;
		case 'mother': {
			const generation = batch.cultureGeneration ?? '未記';
			return amount
				? `傳代（${name} 傳代*${generation} ${amount}）`
				: `傳代（${name} 傳代*${generation}）`;
		}
		default:
			return amount ? `其他（${name} ${amount}）` : `其他（${name}）`;
	}
}

export function batchPageTitle(batch: BatchData): string {
	return formatBatchDate(batch.date);
}
