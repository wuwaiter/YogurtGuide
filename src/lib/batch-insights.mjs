// 把批次紀錄的文字欄位轉成數字，並依菌種彙整。
// 網站的批次頁、App 的 batches.json 與第 3 步的發酵建議都用這裡的結果。
// 寫成 .mjs 讓 `node --test` 可以直接測。

/** 發酵溫度：`42` → 42、`約 32（…）` → 32；寫「微波爐保溫」這類沒有數字的回傳 null。 */
export function parseTempC(value) {
	const m = String(value ?? '').trim().match(/^(?:約\s*)?(\d+(?:\.\d+)?)/);
	return m ? Number(m[1]) : null;
}

/**
 * 發酵時數：取第一個「（9h30m）」；舊格式「11h」「6h（其後…）」取開頭。
 * 冷藏的時數在後面，不會被取到。
 */
export function parseIncubationHours(value) {
	const text = String(value ?? '').trim();
	const paren = text.match(/（(\d+(?:\.\d+)?)h(?:(\d+)m)?）/);
	const lead = text.match(/^(\d+(?:\.\d+)?)h(?:(\d+)m)?/);
	const m = paren ?? lead;
	if (!m) return null;
	return Number(m[1]) + (m[2] ? Number(m[2]) / 60 : 0);
}

/** 評分換成 10 分制：`8/10` → 8、`3/5` → 6；文字描述回傳 null。 */
export function parseScore10(value) {
	const m = String(value ?? '').trim().match(/^(\d+(?:\.\d+)?)\s*\/\s*(\d+)/);
	if (!m || Number(m[2]) === 0) return null;
	return Math.round((Number(m[1]) / Number(m[2])) * 100) / 10;
}

/** 菌種分組用的名稱：只去掉空白，不猜同義字。 */
export function cultureKey(name) {
	return String(name ?? '').replace(/\s+/g, '');
}

/** 凝乳 ≤3 視為失敗，不列入平均。 */
export const FAILED_SET_MAX = 3;

/** 一筆批次（content collection 的 data）→ 數字化紀錄。 */
export function batchMetrics(id, data) {
	const set = parseScore10(data.resultSet);
	return {
		id,
		date: data.date,
		cultureName: data.cultureName.trim(),
		cultureKey: cultureKey(data.cultureName),
		cultureSource: data.cultureSource,
		cultureGeneration: data.cultureGeneration ?? null,
		ambientTempC: parseTempC(data.ambientTempC),
		incubationTempC: parseTempC(data.incubationTempC),
		incubationHours: parseIncubationHours(data.incubationTimeH),
		set,
		texture: parseScore10(data.resultTexture),
		acidity: parseScore10(data.resultAcidity),
		failed: set != null && set <= FAILED_SET_MAX,
	};
}

function avg(values) {
	const nums = values.filter((v) => typeof v === 'number');
	if (!nums.length) return null;
	return Math.round((nums.reduce((a, b) => a + b, 0) / nums.length) * 10) / 10;
}

function range(values) {
	const nums = values.filter((v) => typeof v === 'number');
	if (!nums.length) return null;
	return { min: Math.min(...nums), max: Math.max(...nums) };
}

/**
 * 依菌種彙整。最佳批次＝凝乳＋質地最高；同分取酸度較低，再同分取較新。
 * 失敗批次另外計數，不進平均與最佳。
 */
export function summarizeByCulture(metrics) {
	const groups = new Map();
	for (const m of metrics) {
		if (!groups.has(m.cultureKey)) groups.set(m.cultureKey, []);
		groups.get(m.cultureKey).push(m);
	}
	return [...groups.values()]
		.map((items) => {
			const sorted = [...items].sort((a, b) => a.date.localeCompare(b.date));
			const ok = sorted.filter((m) => !m.failed && m.set != null);
			const best = [...ok].sort(
				(a, b) =>
					(b.set ?? 0) + (b.texture ?? 0) - ((a.set ?? 0) + (a.texture ?? 0)) ||
					(a.acidity ?? 10) - (b.acidity ?? 10) ||
					b.date.localeCompare(a.date),
			)[0];
			return {
				cultureKey: sorted[0].cultureKey,
				cultureName: sorted.at(-1).cultureName,
				batchCount: sorted.length,
				failedCount: sorted.filter((m) => m.failed).length,
				motherCount: sorted.filter((m) => m.cultureSource === 'mother').length,
				lastDate: sorted.at(-1).date,
				tempC: range(ok.map((m) => m.incubationTempC)),
				hours: range(ok.map((m) => m.incubationHours)),
				avgHours: avg(ok.map((m) => m.incubationHours)),
				avgSet: avg(ok.map((m) => m.set)),
				avgTexture: avg(ok.map((m) => m.texture)),
				avgAcidity: avg(ok.map((m) => m.acidity)),
				bestBatchId: best?.id ?? null,
				best: best
					? {
							date: best.date,
							incubationTempC: best.incubationTempC,
							incubationHours: best.incubationHours,
							set: best.set,
							texture: best.texture,
							acidity: best.acidity,
						}
					: null,
			};
		})
		.sort((a, b) => b.batchCount - a.batchCount || b.lastDate.localeCompare(a.lastDate));
}

/**
 * 42°C 附近（40–43）成功批次，依發酵時數分三段看平均酸度與凝乳。
 * 給「時間越久越酸」這類結論一個可查的數字。
 */
export function hoursBands(metrics) {
	const pool = metrics.filter(
		(m) => !m.failed && m.incubationHours != null && m.incubationTempC != null && m.incubationTempC >= 40 && m.incubationTempC <= 43,
	);
	const bands = [
		{ label: '8 小時以內', test: (h) => h <= 8 },
		{ label: '8–11 小時', test: (h) => h > 8 && h <= 11 },
		{ label: '超過 11 小時', test: (h) => h > 11 },
	];
	return bands.map(({ label, test }) => {
		const items = pool.filter((m) => test(m.incubationHours));
		return {
			label,
			count: items.length,
			avgSet: avg(items.map((m) => m.set)),
			avgTexture: avg(items.map((m) => m.texture)),
			avgAcidity: avg(items.map((m) => m.acidity)),
		};
	});
}

/** 1.5 → `1h30m`、8 → `8h` */
export function formatHours(h) {
	if (h == null) return '—';
	const whole = Math.floor(h);
	const mins = Math.round((h - whole) * 60);
	return mins ? `${whole}h${mins}m` : `${whole}h`;
}
