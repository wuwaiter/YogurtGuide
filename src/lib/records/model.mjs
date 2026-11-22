// 使用者自己的優格紀錄：資料格式與規則（不碰儲存、不碰畫面）。
// 規格見 md/AppPlan.md「第 2 階段」。寫成 .mjs 讓 `node --test` 直接測。

export const SCHEMA_VERSION = 1;

/** 發酵類型。passage 一定有上一代；mother、kefir 第一次可以沒有。 */
export const KINDS = {
	starter: { label: '菌粉／市售優格', hint: '用新開的菌粉或市售優格接種', defaultHours: 8, needsTemp: true },
	passage: { label: '菌粉／市售優格的傳代', hint: '用上面那種做出來的優格再接種', defaultHours: 8, needsTemp: true },
	mother: { label: '可傳代母菌', hint: '例如 Skyr 這類可長期傳代的菌', defaultHours: 12, needsTemp: true },
	kefir: { label: 'Kefir', hint: '菌粒發酵，放室溫', defaultHours: 24, needsTemp: false },
};

export const PHASES = {
	planned: '還沒開始',
	fermenting: '發酵中',
	chilling: '冷藏中',
	done: '完成',
};

/** 哪些類型可以當這個類型的上一代。 */
export function parentKindsFor(kind) {
	if (kind === 'passage') return ['starter', 'passage'];
	if (kind === 'mother') return ['mother'];
	if (kind === 'kefir') return ['kefir'];
	return [];
}

/** 上一代 → 這一代的類型。 */
export function childKindOf(parentKind) {
	return parentKind === 'starter' ? 'passage' : parentKind;
}

function newId(now) {
	const rand = Math.random().toString(36).slice(2, 8);
	return `r${now.getTime().toString(36)}${rand}`;
}

/** 本機日期 YYYY-MM-DD（不用 toISOString，避免台灣凌晨變成前一天）。 */
export function localDate(d) {
	const p = (n) => String(n).padStart(2, '0');
	return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

/** 分數只收 1–10 整數，其他一律當成「沒評」。 */
export function clampScore(value) {
	if (value === '' || value == null) return null;
	const n = Math.round(Number(value));
	return Number.isFinite(n) && n >= 1 && n <= 10 ? n : null;
}

function numOrNull(value) {
	if (value === '' || value == null) return null;
	const n = Number(value);
	return Number.isFinite(n) ? n : null;
}

/** 實際發酵時數（開始發酵到移入冷藏）；還沒移入冷藏回傳 null。 */
export function actualHours(record) {
	if (!record.fermentStartAt || !record.chillStartAt) return null;
	const ms = Date.parse(record.chillStartAt) - Date.parse(record.fermentStartAt);
	return ms > 0 ? Math.round((ms / 3_600_000) * 10) / 10 : null;
}

/**
 * 建立新紀錄。有 parent 時：菌名、傳代線、代數 +1、溫度與時間沿用上一代
 * （時間優先用上一代實際發酵時數）。
 */
export function createRecord(input, { parent = null, now = new Date() } = {}) {
	const kind = parent ? childKindOf(parent.kind) : input.kind;
	if (!KINDS[kind]) throw new Error(`未知的發酵類型：${input.kind}`);
	if (kind === 'passage' && !parent) throw new Error('傳代一定要選上一代');
	if (parent && !parentKindsFor(kind).includes(parent.kind)) throw new Error('上一代的類型不對');

	const cultureName = (parent?.cultureName ?? input.cultureName ?? '').trim();
	if (!cultureName) throw new Error('請填菌名');

	const id = newId(now);
	const iso = now.toISOString();
	const startedOn = input.startedOn || localDate(now);
	const base = {
		schemaVersion: SCHEMA_VERSION,
		id,
		kind,
		createdAt: iso,
		updatedAt: iso,
		cultureName,
		source: parent ? parent.source : (input.source ?? null),
		parentId: parent?.id ?? null,
		lineRootId: parent ? parent.lineRootId : id,
		lineStartedOn: parent ? parent.lineStartedOn : startedOn,
		generation: parent ? parent.generation + 1 : 0,
		startedOn,
		ingredients: (input.ingredients ?? '').trim(),
		ambientTempC: numOrNull(input.ambientTempC),
		incubationTempC: KINDS[kind].needsTemp
			? (numOrNull(input.incubationTempC) ?? parent?.incubationTempC ?? null)
			: null,
		plannedHours:
			numOrNull(input.plannedHours) ??
			(parent ? (actualHours(parent) ?? parent.plannedHours) : null) ??
			KINDS[kind].defaultHours,
		phase: 'planned',
		fermentStartAt: null,
		chillStartAt: null,
		doneAt: null,
		set: null,
		texture: null,
		acidity: null,
		note: '',
		hidden: false,
	};
	return base;
}

/** 名稱：`菌名*代數 (起始日)`，符號一律半形，日期不補零。 */
export function lineName(record) {
	const [y, m, d] = record.lineStartedOn.split('-').map(Number);
	return `${record.cultureName}*${record.generation} (${y}/${m}/${d})`;
}

/** 下一步按鈕。 */
export function nextAction(record) {
	if (record.phase === 'planned') return { phase: 'fermenting', label: '開始發酵' };
	if (record.phase === 'fermenting') return { phase: 'chilling', label: '移入冷藏' };
	if (record.phase === 'chilling') return { phase: 'done', label: '完成' };
	return null;
}

/** 推進階段，自動記時間。回傳新物件，不改原本的。 */
export function advance(record, now = new Date()) {
	const next = nextAction(record);
	if (!next) return record;
	const iso = now.toISOString();
	const stamp = { fermenting: 'fermentStartAt', chilling: 'chillStartAt', done: 'doneAt' }[next.phase];
	return { ...record, phase: next.phase, [stamp]: iso, updatedAt: iso };
}

/** 可以改的欄位；parentId、lineRootId、generation、kind 不給改（避免傳代線錯亂）。 */
const EDITABLE = [
	'cultureName',
	'startedOn',
	'ingredients',
	'ambientTempC',
	'incubationTempC',
	'plannedHours',
	'fermentStartAt',
	'chillStartAt',
	'doneAt',
	'set',
	'texture',
	'acidity',
	'note',
	'hidden',
];

export function applyEdit(record, patch, now = new Date()) {
	const out = { ...record };
	for (const key of EDITABLE) {
		if (!(key in patch)) continue;
		const v = patch[key];
		if (['set', 'texture', 'acidity'].includes(key)) out[key] = clampScore(v);
		else if (['ambientTempC', 'incubationTempC', 'plannedHours'].includes(key)) out[key] = numOrNull(v);
		else if (key === 'hidden') out[key] = Boolean(v);
		else if (key.endsWith('At')) out[key] = v ? new Date(v).toISOString() : null;
		else out[key] = String(v ?? '').trim();
	}
	if (!out.cultureName) throw new Error('菌名不能空白');
	if (out.parentId == null && out.generation === 0) out.lineStartedOn = out.startedOn;
	out.updatedAt = now.toISOString();
	return out;
}

/** 發酵中剩幾分鐘（負數＝已超過）；不在發酵中回傳 null。 */
export function minutesLeft(record, now = new Date()) {
	if (record.phase !== 'fermenting' || !record.fermentStartAt || record.plannedHours == null) return null;
	const end = Date.parse(record.fermentStartAt) + record.plannedHours * 3_600_000;
	return Math.round((end - now.getTime()) / 60_000);
}

/** 首頁排序：進行中（發酵中 > 冷藏中 > 還沒開始）置頂，其餘依日期新到舊。 */
export function sortForHome(records) {
	const rank = { fermenting: 0, chilling: 1, planned: 2, done: 3 };
	return [...records].sort(
		(a, b) =>
			rank[a.phase] - rank[b.phase] ||
			b.startedOn.localeCompare(a.startedOn) ||
			b.createdAt.localeCompare(a.createdAt),
	);
}

/** 菌粉建議溫度：`43°C`→43、`41–43°C`→42；常溫／室溫回傳 null。 */
export function suggestedTempC(text) {
	const t = String(text ?? '');
	if (/常溫|室溫/.test(t)) return null;
	const m = t.match(/(\d+(?:\.\d+)?)(?:\s*[–-]\s*(\d+(?:\.\d+)?))?\s*°C/);
	if (!m) return null;
	return m[2] ? Math.round((Number(m[1]) + Number(m[2])) / 2) : Number(m[1]);
}

/** 菌粉建議時間取第一個範圍的下限（先去看凝固），`6–8 小時`→6。 */
export function suggestedHours(text) {
	const m = String(text ?? '').match(/(\d+(?:\.\d+)?)(?:\s*[–-]\s*\d+(?:\.\d+)?)?\s*小時/);
	return m ? Number(m[1]) : null;
}
