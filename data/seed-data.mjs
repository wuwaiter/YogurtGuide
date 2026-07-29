/** @typedef {'thermophilic' | 'mesophilic'} TemperatureClass */
/** @typedef {'powder' | 'liquid' | 'commercial-yogurt' | 'other'} CultureForm */
/** @typedef {'mother' | 'new-powder' | 'commercial-yogurt' | 'other'} CultureSource */
/** @typedef {'fresh-milk' | 'milk-powder' | 'water' | 'other'} IngredientType */

/** @type {Array<{
 *  id: string,
 *  title: string,
 *  titleEn: string,
 *  summary: string,
 *  species?: string,
 *  temperatureClass: TemperatureClass,
 *  form?: CultureForm,
 *  tempRangeC?: string,
 *  timeRangeH?: string,
 *  flavorProfile?: string,
 *  textureProfile?: string,
 *  reuseHint?: string,
 *  sortOrder: number,
 *  bodyMd: string
 * }>} */
export const cultures = [
	{
		id: 'traditional',
		title: '傳統／標準優格菌',
		titleEn: 'Traditional Yogurt Culture',
		summary: '典型嗜熱兩菌路線，接近多數市售原味優格的風味與質地。',
		species: 'Streptococcus thermophilus + Lactobacillus delbrueckii subsp. bulgaricus',
		temperatureClass: 'thermophilic',
		tempRangeC: '40–45',
		timeRangeH: '4–8',
		flavorProfile: '典型優格酸香',
		textureProfile: '可做成凝態；厚度中等，可再瀝乳',
		reuseHint: '常見為 direct-set；亦可以成品傳代（活性會隨代遞減）',
		sortOrder: 10,
		bodyMd: `## 概述（Overview）

以嗜熱鏈球菌（*S. thermophilus*）與保加利亞乳桿菌（*L. bulgaricus*）為核心的標準嗜熱配方。適溫約 40–45°C（常 42–43°C），發酵約 4–8 小時（依酸度目標調整）。

## 使用筆記（Usage Notes）

- 適合作為批次實驗的對照組（baseline）。
- 同名物種下，不同廠商菌株（strain）仍可能造成酸度與香氣差異。
- 若要希臘濃稠口感，完成後可再做瀝乳（straining），不必先換成「希臘菌粉」。`,
	},
	{
		id: 'bulgarian',
		title: '保加利亞優格',
		titleEn: 'Bulgarian Yogurt',
		summary: '嗜熱兩菌共生；常強調較明顯的酸香與較長發酵終點。',
		species: 'Lactobacillus delbrueckii subsp. bulgaricus + Streptococcus thermophilus',
		temperatureClass: 'thermophilic',
		tempRangeC: '42–43',
		timeRangeH: '8–12',
		flavorProfile: '酸感較明顯，乙醛等優格香氣較突出',
		textureProfile: '可偏稠；實際厚度仍受加熱與保溫穩定度影響',
		reuseHint: '市售有 heirloom 與 direct-set；傳統產品定義常強調僅此兩菌',
		sortOrder: 20,
		bodyMd: `## 概述（Overview）

保加利亞優格在文獻與產品定義上，常要求 starter 為 *L. bulgaricus* 與 *S. thermophilus* 的共生組合。DIY 說明常建議約 42–43°C，發酵 8–12 小時可更酸更稠。

## 使用筆記（Usage Notes）

- 與「傳統優格菌」同屬嗜熱兩菌路線；差異常在**菌株組合與發酵終點**。
- 接種溫度避免過高燙死菌體；保溫穩定度比單純延長時間更關鍵。`,
	},
	{
		id: 'greek-starter',
		title: '希臘優格菌粉',
		titleEn: 'Greek Yogurt Starter',
		summary: '嗜熱菌粉常訴求較厚、較溫和凝乳；真正希臘濃稠多靠瀝乳製程。',
		temperatureClass: 'thermophilic',
		tempRangeC: '42–43',
		timeRangeH: '4–8',
		flavorProfile: '常偏溫和',
		textureProfile: '凝乳可較厚；成品「希臘」濃度仍高度依賴 straining',
		reuseHint: '多為 direct-set 或商品配方；瀝乳屬製法而非菌種本身',
		sortOrder: 30,
		bodyMd: `## 概述（Overview）

「希臘優格菌粉」是選購用的風格名。產品意義上的希臘優格多指發酵後**瀝去乳清（straining）** 的結果。

## 重要澄清

| 名稱 | 本質 |
|------|------|
| Greek yogurt | 多為製程（瀝乳） |
| Greek-style（希臘式） | 常以增稠劑／奶粉模擬濃稠 |
| Greek yogurt starter | 菌粉風格；不保證成品已是希臘優格 |`,
	},
	{
		id: 'skyr',
		title: 'Skyr（冰島）',
		titleEn: 'Skyr',
		summary: '濃稠發酵乳傳統；現代常搭配嗜熱菌與濃縮／瀝乳。',
		temperatureClass: 'thermophilic',
		tempRangeC: '40–45',
		timeRangeH: '5–12',
		flavorProfile: '偏溫和至微酸，依配方而異',
		textureProfile: '濃稠；傳統偏脫脂乳路線',
		reuseHint: 'DIY 菌粉常標 heirloom／需保溫',
		sortOrder: 40,
		bodyMd: `## 概述（Overview）

Skyr 文化上接近濃縮發酵乳／鮮乳起司光譜。現代家用 starter 多仍走嗜熱保溫，並常搭配瀝乳或濃縮。`,
	},
	{
		id: 'viili',
		title: 'Viili（芬蘭）',
		titleEn: 'Viili',
		summary: '常溫 heirloom；溫和風味，常有黏絲／蜂蜜般黏稠。',
		temperatureClass: 'mesophilic',
		tempRangeC: '21–25',
		timeRangeH: '12–24',
		flavorProfile: '偏淡、偏甜潤',
		textureProfile: '常有 ropy／黏絲感（胞外多醣 EPS）',
		reuseHint: '典型可傳代（heirloom）',
		sortOrder: 50,
		bodyMd: `## 概述（Overview）

Viili 為芬蘭常溫風格，適溫約 21–25°C。質地以溫和、黏絲著稱。`,
	},
	{
		id: 'filmjolk',
		title: 'Filmjölk（瑞典）',
		titleEn: 'Filmjölk',
		summary: '常溫風格；偏可飲、酪乳感，略酸。',
		temperatureClass: 'mesophilic',
		tempRangeC: '20–25',
		timeRangeH: '18–30',
		flavorProfile: '略酸，有時帶輕乳酪感',
		textureProfile: '偏可飲、custard／酪乳感',
		reuseHint: '常為 heirloom',
		sortOrder: 60,
		bodyMd: `## 概述（Overview）

Filmjölk 為瑞典常溫發酵乳風格，成品偏可飲、帶酪乳感。`,
	},
	{
		id: 'matsoni',
		title: 'Matsoni（喬治亞）',
		titleEn: 'Matsoni (Caspian Sea Yogurt)',
		summary: '常溫風格；薄 custard，常帶蜂蜜樣香氣。',
		temperatureClass: 'mesophilic',
		tempRangeC: '20–25',
		timeRangeH: '12–24',
		flavorProfile: '蜂蜜樣香氣；相對「比較像優格」',
		textureProfile: '偏薄 custard',
		reuseHint: '英文站常歸 mesophilic heirloom',
		sortOrder: 70,
		bodyMd: `## 概述（Overview）

Matsoni（亦稱 Caspian Sea Yogurt）來自喬治亞一帶的常溫風格。`,
	},
	{
		id: 'piima',
		title: 'Piimä（北歐）',
		titleEn: 'Piimä',
		summary: '常溫風格；很稀、可飲、風味溫和。',
		temperatureClass: 'mesophilic',
		tempRangeC: '20–25',
		timeRangeH: '12–24',
		flavorProfile: '溫和',
		textureProfile: '很稀、可飲',
		reuseHint: '常為 heirloom；亦有人以鮮奶油培養成偏酸稀奶油',
		sortOrder: 80,
		bodyMd: `## 概述（Overview）

Piimä 為北歐常溫可飲風格，質地偏稀、風味溫和。`,
	},
];

/** @type {Array<{
 *  id: string,
 *  title: string,
 *  titleEn: string,
 *  summary: string,
 *  equipment: string[],
 *  suitableCultures: string[],
 *  bodyMd: string
 * }>} */
export const methods = [
	{
		id: 'pasteurized-inoculation',
		title: '高溫巴氏後接種法',
		titleEn: 'Pasteurized Milk Inoculation Process',
		summary: '將鮮乳加熱至巴氏條件後冷卻接種，再於穩定保溫下完成發酵與後熟。',
		equipment: ['厚底鍋或雙重鍋', '探針溫度計（probe thermometer）', '保溫容器或優格機'],
		suitableCultures: ['bulgarian', 'traditional', 'greek-starter'],
		bodyMd: `## 目的（Purpose）

透過加熱（heat treatment）降低競爭微生物、改變乳蛋白結構，使後續接種（inoculation）後的凝乳更穩定、可重複。

## 流程（Process Steps）

1. **加熱（Heating）**：鮮乳升溫至約 85–90°C，維持 5–10 分鐘。
2. **冷卻（Cooling）**：快速降至接種溫度（通常 40–43°C）。
3. **接種（Inoculation）**：依菌種建議比例均勻混入 starter。
4. **保溫發酵（Incubation）**：維持目標溫度至凝乳形成。
5. **冷卻與後熟（Cooling & Post-ripening）**：冷藏 4–12 小時以上。

## 關鍵控制點（Critical Control Points）

| 控制點 | 建議 | 失敗常見結果 |
|--------|------|----------------|
| 加熱高峰 | 記錄實際峰值與持溫時間 | 質地偏稀或風味平淡 |
| 接種溫度 | 不可過高燙菌 | 發酵緩慢或不凝 |
| 保溫穩定度 | ±1–2°C 波動為佳 | 凝乳不均、乳清增多 |
| 接種量 | 依菌種與奶量計算 | 過酸或發酵不足 |`,
	},
];

/** @type {Array<{
 *  id: string,
 *  title: string,
 *  titleEn?: string,
 *  date: string,
 *  ambientTempC?: string,
 *  peakHeatC?: string,
 *  inoculationTempC: string,
 *  incubationTempC: string,
 *  incubationTimeH: string,
 *  equipment: string[],
 *  ingredients: Array<{ type: IngredientType, brand: string, amount: string, note?: string }>,
 *  cultureSource: CultureSource,
 *  cultureName: string,
 *  cultureOrigin: string,
 *  cultureAmount: string,
 *  cultureId?: string,
 *  methodId?: string,
 *  resultSet: string,
 *  resultAcidity?: string,
 *  resultTexture?: string,
 *  resultWhey?: string,
 *  resultFlavor?: string,
 *  resultOverall?: string,
 *  scoreReproducibility?: number,
 *  scoreSatisfaction?: number,
 *  bodyMd: string
 * }>} */
export const batches = [
	{
		id: 'b001-baseline',
		title: '批次 B001 — 基準線試驗',
		titleEn: 'Batch B001 — Baseline Trial',
		date: '2026-07-20',
		ambientTempC: '28',
		peakHeatC: '88',
		inoculationTempC: '42',
		incubationTempC: '42',
		incubationTimeH: '6',
		equipment: ['探針溫度計', '厚底鍋', '玻璃發酵罐', '優格機（定溫）'],
		ingredients: [
			{ type: 'fresh-milk', brand: '光泉全脂鮮乳（示意）', amount: '1000 ml', note: '非 UHT' },
		],
		cultureSource: 'new-powder',
		cultureName: '保加利亞嗜熱菌粉（示意）',
		cultureOrigin: '示意來源／請改為實際購買通路',
		cultureAmount: '1 包（約對 1 L）',
		cultureId: 'bulgarian',
		methodId: 'pasteurized-inoculation',
		resultSet: '凝乳完整，輕搖表面整體移動',
		resultAcidity: '中高，乳酸感清楚',
		resultTexture: '勺起可斷面，偏細緻',
		resultWhey: '表面少量乳清',
		resultFlavor: '典型優格酸香，略帶乳脂',
		resultOverall: '可作為後續對照的基準線批次',
		scoreReproducibility: 4,
		scoreSatisfaction: 4,
		bodyMd: `## Observation（觀察）

本次作為基準線（baseline）：固定奶源與製法，建立後續菌種／參數比較的對照組。

## Next Trial（下次調整）

- 維持製法不變，僅更換菌種，比較酸度上升速率與質地。
- 或改用留存母種（mother culture），對照新菌粉的表現差異。`,
	},
];

/** @type {Array<{ id: string, termZh: string, termEn: string, category: string, bodyMd: string }>} */
export const glossary = [
	{
		id: 'fermentation',
		termZh: '發酵',
		termEn: 'Fermentation',
		category: 'process',
		bodyMd: '乳酸菌利用乳糖產生乳酸（lactic acid）等代謝物，使 pH 下降並促成凝乳與風味形成。',
	},
	{
		id: 'inoculation',
		termZh: '接種',
		termEn: 'Inoculation',
		category: 'process',
		bodyMd: '將 starter／菌種導入乳基質的步驟。接種量（inoculation rate）與接種溫度會直接影響發酵動力學。',
	},
	{
		id: 'coagulation',
		termZh: '凝乳',
		termEn: 'Coagulation',
		category: 'quality',
		bodyMd: '酪蛋白（casein）在酸性條件下形成網狀結構，使液態乳轉為可塑的凝膠體。',
	},
	{
		id: 'incubation',
		termZh: '保溫發酵',
		termEn: 'Incubation',
		category: 'process',
		bodyMd: '接種後維持目標溫度以利菌種代謝的階段。溫度穩定度通常比單純延長時間更關鍵。',
	},
	{
		id: 'post-ripening',
		termZh: '後熟',
		termEn: 'Post-ripening',
		category: 'process',
		bodyMd: '發酵結束後於冷藏條件下繼續進行的緩慢代謝與結構重組。',
	},
	{
		id: 'whey-separation',
		termZh: '乳清分離',
		termEn: 'Whey Separation / Syneresis',
		category: 'quality',
		bodyMd: '凝乳網狀結構收縮時釋出的清澈液相。適量可見；過多常暗示溫度波動或過度攪拌。',
	},
];
