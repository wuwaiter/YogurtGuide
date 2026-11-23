// 發酵建議：依「自己的紀錄 → 上一代 → 站主批次 → 菌粉包裝 → 類型預設」的順序推出這次的發酵時數，
// 再依溫度、室溫、時間點給環境提示。全部在手機上算，不上傳。每條建議都附依據，讓使用者知道為什麼。
// 站主資料來自 app-content/v1/batches.json（src/lib/batch-insights.mjs 產生）。

import { KINDS, actualHours, localDate } from './model.mjs';

const key = (s) => String(s ?? '').replace(/\s+/g, '');
const round05 = (h) => Math.round(h * 2) / 2;
const clamp = (h, lo, hi) => Math.min(hi, Math.max(lo, h));
const HOURS_LIMIT = { starter: [4, 14], passage: [4, 14], mother: [4, 24], kefir: [12, 48] };

/** 菌名是否指同一種：去空白後相等，或一方包含另一方（至少 3 個字）。 */
export function sameCulture(a, b) {
	const x = key(a);
	const y = key(b);
	if (!x || !y) return false;
	if (x === y) return true;
	const [short, long] = x.length <= y.length ? [x, y] : [y, x];
	return short.length >= 3 && long.includes(short);
}

/**
 * 依一次已完成的成品微調時數：太酸少 1 小時、凝乳太軟多 1 小時。
 * 回傳 { hours, why }。
 */
export function adjustFromResult(hours, r) {
	if (r.acidity != null && r.acidity >= 6) return { hours: hours - 1, why: `酸度 ${r.acidity} 偏酸，少 1 小時` };
	if (r.set != null && r.set <= 5) return { hours: hours + 1, why: `凝乳 ${r.set} 偏軟，多 1 小時` };
	return { hours, why: '成品不錯，照這個時間' };
}

/** 一筆紀錄的分數：凝乳＋質地，酸度超過 5 每多 1 扣 1。沒評分回傳 null。 */
function resultScore(r) {
	if (r.set == null) return null;
	return r.set + (r.texture ?? r.set) - Math.max(0, (r.acidity ?? 0) - 5);
}

function fmtDate(iso) {
	const [, m, d] = String(iso).split('-').map(Number);
	return `${m}/${d}`;
}

/**
 * @param {object} draft  這次的條件：kind、cultureName、incubationTempC、ambientTempC、ingredients
 * @param {object} ctx
 *   records   使用者全部紀錄
 *   parent    上一代（傳代時）
 *   site      batches.json 的內容（items、cultures、hoursBands）
 *   pkg       菌粉包裝建議 { hours, text }
 *   now       現在時間（算幾點去看）
 *   excludeId 單筆畫面看自己時，不拿自己當依據
 */
export function fermentAdvice(draft, ctx = {}) {
	const { records = [], parent = null, site = null, pkg = null, now = new Date(), excludeId = null } = ctx;
	const kind = draft.kind in KINDS ? draft.kind : 'starter';
	const name = parent?.cultureName ?? draft.cultureName ?? '';
	const basis = [];
	let hours = null;

	// 1. 自己做過的同一種菌：挑結果最好的一次
	const mine = records
		.filter((r) => r.id !== excludeId && r.phase === 'done' && sameCulture(r.cultureName, name) && actualHours(r) != null)
		.map((r) => ({ r, score: resultScore(r) }))
		.filter((x) => x.score != null)
		.sort((a, b) => b.score - a.score || b.r.startedOn.localeCompare(a.r.startedOn));
	if (mine.length) {
		const best = mine[0].r;
		const adj = adjustFromResult(actualHours(best), best);
		hours = adj.hours;
		basis.push({ source: 'mine', text: `你 ${fmtDate(best.startedOn)} 做同一種菌發酵 ${actualHours(best)} 小時（凝乳 ${best.set}、酸度 ${best.acidity ?? '—'}）：${adj.why}` });
		if (mine.length > 1) basis.push({ source: 'mine', text: `共比較了你 ${mine.length} 次同菌紀錄，取結果最好的一次` });
	}

	// 2. 上一代
	if (hours == null && parent) {
		const h = actualHours(parent) ?? parent.plannedHours;
		if (h != null) {
			const adj = parent.phase === 'done' ? adjustFromResult(h, parent) : { hours: h, why: '上一代還沒評分，先照它的時間' };
			hours = adj.hours;
			basis.push({ source: 'parent', text: `上一代發酵 ${h} 小時：${adj.why}` });
		}
	}

	// 3. 站主批次
	const siteCulture = site?.cultures?.find((c) => sameCulture(c.cultureName, name));
	if (siteCulture?.best?.incubationHours != null) {
		const b = siteCulture.best;
		const text = `站主做 ${siteCulture.cultureName} ${siteCulture.batchCount} 次，最好的一次是 ${b.incubationTempC ?? '—'}°C、${b.incubationHours} 小時（凝乳 ${b.set}、酸度 ${b.acidity ?? '—'}）`;
		if (hours == null) {
			hours = b.incubationHours;
			basis.push({ source: 'site', text });
		} else basis.push({ source: 'site', text: `參考：${text}` });
	}

	// 4. 包裝
	if (pkg?.hours != null) {
		if (hours == null) {
			hours = pkg.hours;
			basis.push({ source: 'package', text: `包裝寫「${pkg.text}」，先用下限 ${pkg.hours} 小時去看凝固` });
		} else if (pkg.text) basis.push({ source: 'package', text: `參考：包裝寫「${pkg.text}」` });
	}

	// 5. 類型預設
	if (hours == null) {
		hours = KINDS[kind].defaultHours;
		basis.push({ source: 'default', text: `沒有這種菌的資料，先用${KINDS[kind].label}的一般時間 ${hours} 小時` });
	}

	// 環境修正與提示
	const tips = [];
	const temp = KINDS[kind].needsTemp ? draft.incubationTempC ?? parent?.incubationTempC ?? null : null;
	const ambient = draft.ambientTempC ?? null;
	const thermo = kind === 'starter' || kind === 'passage';

	if (thermo && temp != null) {
		if (temp < 38) {
			hours += 2;
			basis.push({ source: 'env', text: `發酵溫度 ${temp}°C 低於 38°C，多 2 小時` });
			tips.push({ level: 'warn', text: '一般優格菌適合 40–43°C。溫度不夠容易凝不起來，建議用優格機或保溫箱。' });
		} else if (temp > 45) {
			tips.push({ level: 'warn', text: `${temp}°C 太高，菌可能被燙死，建議 40–43°C。` });
		}
	}
	if (thermo && temp == null) tips.push({ level: 'info', text: '填上發酵溫度，建議會更準。一般優格菌用 40–43°C。' });

	if (!KINDS[kind].needsTemp || kind === 'mother') {
		// 室溫發酵：天冷慢、天熱快
		if (ambient != null && (kind === 'kefir' || temp == null)) {
			if (ambient < 20) {
				hours *= 1.3;
				basis.push({ source: 'env', text: `室溫 ${ambient}°C 偏冷，時間拉長約 3 成` });
			} else if (ambient >= 28) {
				hours *= 0.8;
				basis.push({ source: 'env', text: `室溫 ${ambient}°C 偏熱，時間縮短約 2 成` });
			}
		}
	}
	if (ambient != null && ambient >= 30) {
		tips.push({ level: 'info', text: `室溫 ${ambient}°C，時間到馬上冷藏，放在外面會繼續變酸。` });
	}
	if (ambient != null && ambient < 18 && thermo) {
		tips.push({ level: 'info', text: '天冷時冰牛奶先回溫，或接種前把牛奶加熱到 40°C 左右，比較快凝。' });
	}

	const [lo, hi] = HOURS_LIMIT[kind];
	hours = round05(clamp(hours, lo, hi));

	// 站主資料的時間結論
	const bands = site?.hoursBands ?? [];
	const short = bands.find((b) => b.label.includes('以內'));
	const longer = bands.filter((b) => !b.label.includes('以內') && b.count > 0);
	if (thermo && hours > 8 && short?.count && longer.length) {
		const longAcid = Math.max(...longer.map((b) => b.avgAcidity ?? 0));
		tips.push({
			level: 'info',
			text: `站主 ${site.items?.length ?? ''} 次紀錄：40–43°C 發酵 8 小時內平均酸度 ${short.avgAcidity}，超過 8 小時約 ${longAcid}。怕酸就早點看。`,
		});
	}
	const failed = (site?.items ?? []).filter((m) => m.failed && m.incubationHours != null);
	if (thermo && failed.length && hours >= Math.min(...failed.map((m) => m.incubationHours)) - 1) {
		tips.push({ level: 'warn', text: `站主曾在 ${failed[0].incubationHours} 小時失敗過（凝乳太差），時間太長不一定比較好。` });
	}
	if (thermo && draft.ingredients !== undefined && !/奶粉/.test(draft.ingredients ?? '')) {
		tips.push({ level: 'info', text: '想要更濃稠，可以加 1–2 湯匙脫脂奶粉。' });
	}

	// 幾點去看：小資上班族多半睡前或出門前開始
	const checkAt = new Date(now.getTime() + hours * 3_600_000);
	const hh = checkAt.getHours();
	const clock = `${String(hh).padStart(2, '0')}:${String(checkAt.getMinutes()).padStart(2, '0')}`;
	const sameDay = localDate(checkAt) === localDate(now);
	const timing = { checkAt: checkAt.toISOString(), text: `現在開始的話，${sameDay ? '今天' : '明天'} ${clock} 去看凝固` };
	if (hh >= 0 && hh < 6) {
		const start = new Date(now);
		start.setDate(start.getDate() + (start.getHours() >= 7 ? 1 : 0));
		start.setHours(7, 0, 0, 0);
		const back = new Date(start.getTime() - hours * 3_600_000);
		const startClock = `${String(back.getHours()).padStart(2, '0')}:${String(back.getMinutes()).padStart(2, '0')}`;
		tips.push({ level: 'info', text: `會在半夜到時間。想早上 7 點起床看，可以 ${startClock} 開始。` });
	}

	return { hours, basis, tips, timing, confidence: basis[0]?.source ?? 'default' };
}
