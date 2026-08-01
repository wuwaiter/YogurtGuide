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
		summary: '技術上屬新鮮起司；嗜熱發酵後需瀝乳才有標誌濃稠度。',
		species: 'Streptococcus thermophilus + Lactobacillus delbrueckii subsp. bulgaricus（常宣稱含冰島特有菌株）',
		temperatureClass: 'thermophilic',
		tempRangeC: '42–43',
		timeRangeH: '6–12',
		flavorProfile: '偏溫和至微酸；乾粉第一批常較弱',
		textureProfile: '發酵後常有乳清分離；瀝乳 8–12 h 後才濃稠',
		reuseHint: '家用多為 heirloom；每公升留約 1 大匙，建議至少每週回接',
		sortOrder: 40,
		bodyMd: `## 概述（Overview）

Skyr 技術上屬**新鮮起司（fresh cheese）**，只是被當優格吃。家用 starter 幾乎都是嗜熱型：約 **42–43°C／6–12 h**（供應商說明常見 42°C、約 10 h）。

## 瀝乳是必要步驟

冷藏瀝乳約 **8–12 h**，越久越厚。濃稠來自瀝乳，而非菌種本身。發酵中出現乳清分離是正常現象。

## 使用筆記（Usage Notes）

- 傳統用**脫脂乳**——少數「脫脂才正宗」的發酵；全脂較濃郁但不傳統。
- 傳統做法可加**一滴凝乳酶（rennet）** 幫助結構。
- 凍乾乾粉的**第一批常表現不足**；用第一批的一匙做第二批，才是該菌真實水準。第 1 代不宜當基準線。`,
	},
	{
		id: 'matsoni',
		title: 'Matsoni（喬治亞原產）',
		titleEn: 'Matsoni',
		summary: '原產菌相不定、偏嗜熱；常含真菌。與 Japanese Caspian Sea（日本裏海）不是同一件事。',
		species: 'S. thermophilus + L. delbrueckii（常見）；菌相隨產地而異，可含真菌',
		temperatureClass: 'thermophilic',
		tempRangeC: '40–45',
		timeRangeH: '依配方／產地',
		flavorProfile: '依產地菌相差異大；文獻描述不一',
		textureProfile: '依配方；不宜假設為常溫 custard',
		reuseHint: '傳統家傳型；市售「matsoni starter」多半其實是 Japanese Caspian Sea 常溫乳球菌型',
		sortOrder: 45,
		bodyMd: `## 概述（Overview）

喬治亞原產 matsoni **不宜歸常溫**。多篇研究以嗜熱的 *S. thermophilus* 與 *L. delbrueckii*（bulgaricus／lactis）為主，並常伴隨 *Geotrichum candidum*、*Kluyveromyces marxianus*、*Candida* 等真菌。菌相**隨產地而異、各地區內相對穩定**。

## 重要澄清：≠ Japanese Caspian Sea

| | Matsoni（原產） | Japanese Caspian Sea (日本裏海) |
|--|-----------------|----------------------------------|
| 溫度 | 偏嗜熱 | 常溫 |
| 優勢菌 | 嗜熱兩菌＋多樣伴隨菌 | 單一 *Lactococcus cremoris* 主導 |
| 真菌 | 常有 | 通常無（少數樣本見醋酸菌） |

英文 DIY 站常把兩者當同義詞。本站分開登錄：常溫乳球菌型見 [Japanese Caspian Sea](../caspian-sea/)。`,
	},
	{
		id: 'viili',
		title: 'Viili（芬蘭）',
		titleEn: 'Viili',
		summary: '常溫 heirloom；黏絲來自產 EPS 的乳球菌；傳統菌相含黴菌與酵母。',
		species: 'Lactococcus cremoris（產黏）+ L. lactis + Leuconostoc；傳統另含 Geotrichum candidum 與酵母',
		temperatureClass: 'mesophilic',
		tempRangeC: '20–25',
		timeRangeH: '12–24',
		flavorProfile: '偏淡、偏甜潤，帶奶油香',
		textureProfile: 'ropy／黏絲（胞外多醣 viilian）；不黏可能是菌株變異',
		reuseHint: '典型 heirloom；EPS 基因常在質體上，保存溫度偏高易失黏',
		sortOrder: 50,
		bodyMd: `## 概述（Overview）

芬蘭常溫風格。工業製程常寫冷卻至約 20°C 接種、熟成約 20 h。質地以溫和、**黏絲（ropy）** 著稱。

## 菌相（不只乳酸菌）

傳統 viili 是 LAB + 黴菌 + 酵母：

| 成員 | 角色 |
|------|------|
| *Lactococcus cremoris*（舊 *L. lactis* subsp. *cremoris*） | 產 EPS（viilian），黏絲來源 |
| *L. lactis* subsp. *lactis* | 主要酸化 |
| biovar *diacetylactis*、*Leuconostoc mesenteroides* | 雙乙醯奶油香 |
| *Geotrichum candidum* | 表面絨毛層；消耗乳酸、貢獻風味 |
| *Kluyveromyces marxianus* 等酵母 | 酵母香；可發酵乳糖 |

## 使用筆記（Usage Notes）

- 黏絲物質叫 **viilian**（含磷雜多醣）。EPS 合成基因常在**質體**上；培養／保存偏高溫可能丟失黏性。
- 某批不黏，**可能是菌株變異而非操作失誤**。批次建議記「本批是否 ropy」。
- 若菌種含 *G. candidum*，均勻白絲絨表面是正常成熟；純 LAB 菌粉長毛則視為污染。`,
	},
	{
		id: 'filmjolk',
		title: 'Filmjölk（瑞典）',
		titleEn: 'Filmjölk',
		summary: '常溫風格；偏可飲、酪乳感。菌相為乳球菌＋明串珠菌，通常不含黴菌。',
		species: 'Lactococcus lactis subsp. lactis + Lactococcus cremoris + biovar diacetylactis + Leuconostoc mesenteroides',
		temperatureClass: 'mesophilic',
		tempRangeC: '20–21',
		timeRangeH: '18–20',
		flavorProfile: '略酸，帶奶油香',
		textureProfile: '偏可飲、比牛奶稠但比優格薄；不以 ropy 為主',
		reuseHint: '常為 heirloom；商業配方可另加機能菌',
		sortOrder: 60,
		bodyMd: `## 概述（Overview）

瑞典常溫發酵乳。商業菌種商製程建議約 **20–21°C／18–20 h**。

## 與 Viili 的差別

- Filmjölk **通常不含黴菌**，不以產黏菌株為主，因此一般不 ropy。
- 現代商業配方有時另加 *L. acidophilus*、*B. animalis* subsp. *lactis* 做機能訴求。`,
	},
	{
		id: 'caspian-sea',
		title: 'Japanese Caspian Sea (日本裏海)',
		titleEn: 'Japanese Caspian Sea',
		summary: '常溫、可傳代；優勢菌為產 EPS 的 Lactococcus cremoris。≠ 喬治亞原產 Matsoni。',
		species: 'Lactococcus cremoris（優勢；舊名 L. lactis subsp. cremoris）',
		temperatureClass: 'mesophilic',
		tempRangeC: '20–25',
		timeRangeH: '12–24',
		flavorProfile: '溫和；相對「比較像優格」',
		textureProfile: '黏稠 custard；黏性來自優勢菌的 EPS',
		reuseHint: 'mesophilic heirloom；名義溯源高加索，菌相已與原產 matsoni 分道',
		sortOrder: 70,
		bodyMd: `## 概述（Overview）

日本流通的「カスピ海ヨーグルト」。調查顯示樣本優勢菌一致為產 EPS 的 ***Lactococcus cremoris***（約 10⁸–10⁹ CFU/g），黏稠來自該菌胞外多醣。

## 重要澄清：≠ Matsoni

名義上溯源高加索，但與喬治亞原產 [Matsoni](../matsoni/) **不是同一件事**：

- 本品：常溫、單一乳球菌主導、可傳代。
- Matsoni：偏嗜熱、菌相不定、常含真菌。

英文 DIY 站販售的「matsoni starter」多半其實是本類型。`,
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

/**
 * 市售優格對照。
 * recommended：僅允許 鮮乳/生乳 或 奶粉＋水 ＋ 菌種（含凍乾菌粉常見載體）。
 * 標示整理自公開商品頁/比較文（約 2026）；配方改版時請覆核。
 *
 * @type {Array<{
 *  id: string,
 *  brand: string,
 *  productName: string,
 *  recommended: boolean,
 *  milkBase: 'fresh' | 'powder' | 'mixed' | 'other',
 *  milkBaseNote: string,
 *  addedSugar: boolean,
 *  additives: string,
 *  cultures: string,
 *  ingredientsLabel: string,
 *  note?: string,
 *  sortOrder: number
 * }>}
 */
export const marketYogurts = [
	{
		id: 'ceabys-no-sugar',
		brand: '雪比',
		productName: '無加糖生優格',
		recommended: true,
		milkBase: 'fresh',
		milkBaseNote: '生乳',
		addedSugar: false,
		additives: '無（標示僅生乳＋乳酸菌）',
		cultures:
			'長雙歧桿菌、嗜酸乳桿菌、嬰兒雙歧桿菌、乾酪乳桿菌、植物乳桿菌、保加利亞乳桿菌、嗜熱鏈球菌',
		ingredientsLabel: '生乳、乳酸菌（長雙歧桿菌、嗜酸乳桿菌、嬰兒雙歧桿菌、乾酪乳桿菌、植物乳酸桿菌、保加利亞乳酸桿菌、嗜熱鏈球菌）',
		note: '無凝固劑；搖晃易變稀或析乳清屬正常。',
		sortOrder: 10,
	},
	{
		id: 'fulo-premium-fresh',
		brand: '福樂',
		productName: '頂級鮮奶優酪',
		recommended: true,
		milkBase: 'fresh',
		milkBaseNote: '鮮奶(一番鮮)',
		addedSugar: false,
		additives: '無（標示僅鮮乳＋菌種）',
		cultures: '嗜熱鏈球菌、德氏乳桿菌、鼠李糖乳桿菌、胚芽乳桿菌（植物乳桿菌）',
		ingredientsLabel:
			'100% 鮮乳、嗜熱鏈球菌、德氏乳桿菌、鼠李糖乳桿菌、胚芽乳桿菌',
		sortOrder: 20,
	},
	{
		id: 'kuangchuan-premium-fresh',
		brand: '光泉',
		productName: '頂級鮮奶優酪',
		recommended: true,
		milkBase: 'fresh',
		milkBaseNote: '鮮奶/生乳',
		addedSugar: false,
		additives: '無（標示僅生乳＋活性乳酸菌；宣稱無奶粉/香料/加糖）',
		cultures:
			'嗜酸乳桿菌、比菲德氏菌（B. lactis）、嗜熱鏈球菌、德氏乳桿菌乳酸亞種、保加利亞乳桿菌',
		ingredientsLabel:
			'100% 生乳、活性乳酸菌（嗜酸乳桿菌、比菲德氏菌、嗜熱鏈球菌、德氏乳桿菌乳酸亞種、保加利亞乳桿菌）',
		sortOrder: 30,
	},
	{
		id: 'bettermilk-true',
		brand: '鮮乳坊',
		productName: '真優格',
		recommended: true,
		milkBase: 'fresh',
		milkBaseNote: '生乳 (豐樂牧場)',
		addedSugar: false,
		additives: '無（宣稱無膠體、奶粉、糖）',
		cultures:
			'嗜熱鏈球菌、保加利亞乳桿菌、嗜酸乳桿菌、鼠李糖乳桿菌、乳雙歧桿菌、植物乳桿菌、乾酪乳桿菌',
		ingredientsLabel: '鮮乳、乳酸菌（上述 7 菌）',
		note: '主婦聯盟等通路亦見「吃吃鮮乳優格」等同系標示。',
		sortOrder: 40,
	},
	{
		id: 'snowfactory-no6',
		brand: '雪坊',
		productName: '6 號精品優格',
		recommended: true,
		milkBase: 'fresh',
		milkBaseNote: '鮮奶',
		addedSugar: false,
		additives: '無（標示僅鮮乳＋活性乳酸菌）',
		cultures:
			'保加利亞乳桿菌、嗜熱鏈球菌、植物乳桿菌、副乾酪乳桿菌、鼠李糖乳桿菌、雷特氏 B 菌（B. animalis）',
		ingredientsLabel:
			'鮮乳、活性乳酸菌（保加利亞乳桿菌、嗜熱鏈球菌、植物乳桿菌、副乾酪乳桿菌、鼠李糖乳桿菌、雷特氏 B 菌）',
		note: '同系列 5 號亦為純鮮乳路線，菌種組合不同。',
		sortOrder: 50,
	},
	{
		id: 'matthew-plain',
		brand: '馬修嚴選',
		productName: '原味優格（分享號）',
		recommended: true,
		milkBase: 'fresh',
		milkBaseNote: '台灣 鮮奶/生乳',
		addedSugar: false,
		additives: '無（宣稱無加糖、無添加膠體）',
		cultures: '嗜熱鏈球菌、嗜酸乳桿菌、鼠李糖乳桿菌、長雙歧桿菌（經典四株；G+/K+ 系列菌數不同）',
		ingredientsLabel: '鮮乳/生乳、乳酸菌（系列而異）',
		note: 'G+、K+ 等同品牌系列配方不同，請以當批包裝為準。',
		sortOrder: 60,
	},
	{
		id: 'lioujia-plain',
		brand: '六甲田莊',
		productName: '原味優格',
		recommended: true,
		milkBase: 'fresh',
		milkBaseNote: '生乳',
		addedSugar: false,
		additives: '無產品級增稠/調味；標示含菌粉載體（果寡醣粉、乳糖）',
		cultures:
			'嗜熱鏈球菌、長雙歧桿菌、鼠李糖乳桿菌、嗜酸乳桿菌、醱酵乳桿菌、副乾酪乳桿菌、瑞士乳桿菌',
		ingredientsLabel:
			'100% 生乳、活性乳酸菌【果寡醣粉（非基改玉米澱粉、果寡醣）、嗜熱鏈球菌、長雙歧桿菌、鼠李糖乳桿菌、嗜酸乳桿菌、醱酵乳桿菌、副乾酪乳桿菌、瑞士乳桿菌】、乳糖',
		note: '依本站規則：菌粉載體仍算「菌種」側，故給 ★；若你要求標示字面零載體，則需自行排除。',
		sortOrder: 70,
	},
	{
		id: 'xinpu-fresh',
		brand: '心樸',
		productName: '100%鮮乳優格',
		recommended: true,
		milkBase: 'fresh',
		milkBaseNote: '鮮奶/生乳',
		addedSugar: false,
		additives: '無（公開介紹與消費者回報：無糖、無香料、無膠體、無奶粉）',
		cultures:
			'保加利亞乳桿菌、嗜熱鏈球菌、嗜酸乳桿菌、比菲德氏菌（雷特氏 B 菌）、鼠李糖乳桿菌（公開整理約 5 菌；以包裝為準）',
		ingredientsLabel: '生乳/鮮乳、乳酸菌（以杯身最新標示為準）',
		note: '美廉社/心樸市集通路；菌種清單請以當批包裝覆核。',
		sortOrder: 75,
	},
	{
		id: 'kirkland-nonfat-greek',
		brand: '科克蘭',
		productName: '零脂希臘式優格',
		recommended: true,
		milkBase: 'fresh',
		milkBaseNote: '鮮奶 (巴氏殺菌脫脂牛奶)',
		addedSugar: false,
		additives: '無（標示僅脫脂牛奶＋乳酸菌；無增稠劑/香料/加糖）',
		cultures:
			'保加利亞乳桿菌、嗜熱鏈球菌、嗜酸乳桿菌、乳雙歧桿菌（B. lactis）、乾酪乳桿菌',
		ingredientsLabel:
			'巴氏殺菌發酵脫脂牛奶（巴氏殺菌脫脂牛奶、乳酸菌）、乳酸菌（L. bulgaricus、S. thermophilus、L. acidophilus、B. lactis、L. casei）',
		note: '好市多賣場常見（#599369）。品名寫「希臘式」，成分卻是脫脂乳＋菌，濃稠多來自瀝乳，非膠體/乳粉增稠款。',
		sortOrder: 78,
	},
	{
		id: 'linfengying-thick',
		brand: '林鳳營',
		productName: '特濃重乳優格（無加糖）',
		recommended: false,
		milkBase: 'mixed',
		milkBaseNote: '生乳/奶粉 — 水＋全脂乳粉為主，另含生乳',
		addedSugar: false,
		additives: '乳清蛋白、濃縮牛奶蛋白；乳酸菌欄含蔗糖、麥芽糊精',
		cultures: '嗜熱鏈球菌、保加利亞乳桿菌',
		ingredientsLabel:
			'水、全脂乳粉、乳清蛋白、濃縮牛奶蛋白、生乳、乳酸菌（乳酸菌、蔗糖、麥芽糊精）',
		note: '無加糖訴求，但有蛋白濃縮與還原乳，不符 ★ 條件。',
		sortOrder: 80,
	},
	{
		id: 'linfengying-greek-style',
		brand: '林鳳營',
		productName: '希臘式優格（無加糖）',
		recommended: false,
		milkBase: 'mixed',
		milkBaseNote: '水＋生乳＋乳粉',
		addedSugar: false,
		additives: '濃縮牛奶蛋白（部分標示另見玉米澱粉作為菌劑載體）',
		cultures:
			'嗜熱鏈球菌、保加利亞乳桿菌、乳雙歧桿菌、嗜酸乳桿菌（標示版本可能另列乳酸乳球菌等，以包裝為準）',
		ingredientsLabel: '水、生乳、乳粉、濃縮牛奶蛋白、乳酸菌…',
		note: '「希臘式」靠乳粉/蛋白濃縮增稠，非瀝乳希臘優格。',
		sortOrder: 90,
	},
	{
		id: 'zhili-greek-style',
		brand: '質立',
		productName: '希臘式優格（無加糖）',
		recommended: false,
		milkBase: 'powder',
		milkBaseNote: '水+奶粉',
		addedSugar: false,
		additives: '異麥芽寡醣、柑橘果膠（含蔗糖、洋菜）、洋菜粉',
		cultures: '保加利亞乳桿菌、嗜熱鏈球菌',
		ingredientsLabel:
			'水、奶粉、異麥芽寡醣、生乳、柑橘果膠（蔗糖、柑橘果膠、洋菜）、洋菜粉、乳酸菌（L. bulgaricus、S. thermophilus）',
		note: '標榜無加糖，但果膠預混含蔗糖且糖量偏高；屬增稠「希臘式」。',
		sortOrder: 100,
	},
	{
		id: 'fulo-greek-style',
		brand: '福樂',
		productName: '頂級無加糖希臘式優酪',
		recommended: false,
		milkBase: 'mixed',
		milkBaseNote: '水＋乳粉＋鮮乳',
		addedSugar: false,
		additives: '乳脂、乳清蛋白、牛奶蛋白；乳酸菌欄含玉米澱粉',
		cultures:
			'嗜熱鏈球菌 Streptococcus thermophilus、保加利亞乳桿菌 Lactobacillus delbrueckii subsp. bulgaricus、鼠李糖乳桿菌 Lactobacillus rhamnosus、胚芽乳桿菌 Lactobacillus plantarum',
		ingredientsLabel:
			'水、乳粉、鮮乳、乳脂、乳清蛋白、牛奶蛋白、乳酸菌（乳酸菌、玉米澱粉）',
		note: '含乳脂/乳清蛋白/牛奶蛋白增稠，不符 ★；同品牌「頂級鮮奶優酪」為 ★，勿混為一談。',
		sortOrder: 110,
	},
	{
		id: 'ceabys-classic',
		brand: '雪比',
		productName: '經典優格',
		recommended: false,
		milkBase: 'fresh',
		milkBaseNote: '生乳',
		addedSugar: false,
		additives: '異麥芽寡醣、大豆纖維（公開介紹）',
		cultures:
			'長雙歧桿菌、嗜酸乳桿菌、嬰兒雙歧桿菌、乾酪乳桿菌、植物乳桿菌、保加利亞乳桿菌、嗜熱鏈球菌',
		ingredientsLabel: '生乳、乳酸菌…＋異麥芽寡醣、大豆纖維（以包裝為準）',
		note: '與「無加糖生優格」不同款；有額外纖維/寡糖則不給 ★。',
		sortOrder: 120,
	},
];
