import type { CollectionEntry } from 'astro:content';

type BatchData = CollectionEntry<'batches'>['data'];

/** `2026-08-01` → `2026/08/01` */
export function formatBatchDate(isoDate: string): string {
	return isoDate.replaceAll('-', '/');
}

/** `2026-08-01` → `2026.08.01`（field note 用） */
export function formatBatchDateDots(isoDate: string): string {
	return isoDate.replaceAll('-', '.');
}

/** field note 標題：川秀60菌 · gen1 */
export function formatBatchCultureHeadline(batch: {
	cultureName: string;
	cultureSource: string;
	cultureGeneration?: number;
}): string {
	const name = batch.cultureName.trim();
	if (batch.cultureSource === 'mother' && batch.cultureGeneration != null) {
		return `${name} · gen${batch.cultureGeneration}`;
	}
	if (batch.cultureSource === 'new-powder') return `${name} · powder`;
	if (batch.cultureSource === 'commercial-yogurt') return `${name} · starter`;
	return name;
}

/** 取出分數前段，例如 `8/10` → `8`、`4/10（…）` → `4` */
export function scoreLead(value?: string): string {
	if (!value?.trim()) return '—';
	const m = value.trim().match(/^(\d+(?:\.\d+)?)\s*\/\s*\d+/);
	return m ? m[1] : value.trim();
}

/** 溫度字串正規成 `42°C` */
export function formatTempC(value: string): string {
	const m = value.match(/^(\d+(?:\.\d+)?)(.*)$/);
	if (m && !m[2].startsWith('°')) return `${m[1]}°C${m[2]}`;
	const approx = value.match(/^(約\s*)(\d+(?:\.\d+)?)(.*)$/);
	if (approx && !approx[3].startsWith('°')) {
		return `${approx[1]}${approx[2]}°C${approx[3]}`;
	}
	return value.includes('°C') ? value : `${value}°C`;
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
