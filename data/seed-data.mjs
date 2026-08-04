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
		summary: '嗜熱兩菌共生；常強調較明顯的酸香與較長發酵終點。口感偏優格狀／布丁凝乳。',
		species: 'Lactobacillus delbrueckii subsp. bulgaricus + Streptococcus thermophilus',
		temperatureClass: 'thermophilic',
		tempRangeC: '42–43',
		timeRangeH: '8–12',
		flavorProfile: '酸感較明顯，乙醛等優格香氣較突出',
		textureProfile: '優格狀凝乳（布丁奶酪口感對照常見）；厚度受加熱與保溫影響',
		reuseHint: '市售有 heirloom 與 direct-set；傳統產品定義常強調僅此兩菌',
		sortOrder: 20,
		bodyMd: `## 概述（Overview）

保加利亞優格在文獻與產品定義上，常要求 starter 為 *L. bulgaricus* 與 *S. thermophilus* 的共生組合。DIY 說明常建議約 42–43°C，發酵 8–12 小時可更酸更稠。

## 使用筆記（Usage Notes）

- 與「傳統優格菌」同屬嗜熱兩菌路線；差異常在**菌株組合與發酵終點**。
- 接種溫度避免過高燙死菌體；保溫穩定度比單純延長時間更關鍵。`,
	},
	{
		id: 'ayran',
		title: 'Ayran（土耳其優格飲基底）',
		titleEn: 'Ayran',
		summary: '嗜熱優格路線；凝乳可呈優格狀，常再加水／鹽做成鹹飲。',
		species: 'Streptococcus thermophilus（DIY starter 常強調；完整配方依供應商）',
		temperatureClass: 'thermophilic',
		tempRangeC: '40–45',
		timeRangeH: '4–8',
		flavorProfile: '偏酸；飲用時常加鹽',
		textureProfile: '凝乳為優格狀／布丁感；稀釋後可飲',
		reuseHint: 'DIY 多為 thermophilic 凍乾／heirloom；需定溫',
		sortOrder: 22,
		bodyMd: `## 概述（Overview）

**Ayran** 是土耳其（及中亞／巴爾幹）經典**鹹味優格飲**：先做出優格狀凝乳，再加水與鹽稀釋冰鎮。

DIY starter（如 Startercultures.eu）多標 **嗜熱 40–45°C**，並強調 *S. thermophilus* 對滑順質地的貢獻。

## 口感分類

未稀釋凝乳常被歸在「布丁奶酪／優格狀」族群；成品飲料則偏可飲。`,
	},
	{
		id: 'persis',
		title: 'Persis（波斯／伊朗優格風格）',
		titleEn: 'Persis (Persian-style)',
		summary: 'DIY／對照表用名；對應伊朗 mast 優格狀凝乳。多接近嗜熱兩菌，非獨立標準菌相。',
		species: 'S. thermophilus + L. bulgaricus（推定／依供應商；傳統多以成品傳代）',
		temperatureClass: 'thermophilic',
		tempRangeC: '40–45',
		timeRangeH: '4–8',
		flavorProfile: '溫和至微酸；日常優格感',
		textureProfile: '優格狀／布丁凝乳',
		reuseHint: '傳統以成品當母種；市售「Persis」請以包裝適溫為準',
		sortOrder: 25,
		bodyMd: `## 概述（Overview）

**Persis** 多見於 DIY 口感對照表，指涉**波斯／伊朗優格（mast，ماست）**：可勺食的優格狀凝乳，可再做成 mast-o-khiar、doogh 等。

公開文獻較少把「Persis」當正式菌種學名；實務多接近**嗜熱兩菌優格**。

## 注意

- 包裝若寫常溫，以包裝為準（可能是商家自訂配方）。
- 與 [Ayran](../ayran/) 同屬西亞優格文化圈，但 Ayran 更常以稀釋鹹飲為終點。`,
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
		id: 'skyr-short',
		title: 'Short Skyr（短版／傳統嗜熱）',
		titleEn: 'Short Skyr (Thermophilic)',
		summary: '傳統冰島路線：嗜熱發酵後瀝乳。DIY 店所稱 Short Skyr＝正統 Skyr。瀝前可歸優格狀／布丁對照。',
		species: 'Streptococcus thermophilus + Lactobacillus delbrueckii subsp. bulgaricus（常宣稱含冰島特有菌株）',
		temperatureClass: 'thermophilic',
		tempRangeC: '42–43',
		timeRangeH: '6–12',
		flavorProfile: '偏溫和至微酸；乾粉第一批常較弱',
		textureProfile: '發酵後優格狀凝乳、常有乳清分離；瀝乳 8–12 h 後才濃稠；傳統不強調黏絲',
		reuseHint: '家用多為 heirloom；每公升留約 1 大匙，建議至少每週回接',
		sortOrder: 40,
		bodyMd: `## 概述（Overview）

**Short Skyr**＝DIY 菌種商對**傳統嗜熱 Skyr**的稱呼（相對常溫「Long Skyr」）。技術上屬**新鮮起司（fresh cheese）**，只是被當優格吃。

家用 starter：約 **42–43°C／6–12 h**（常見說明 42°C、約 10 h）。

## 與 Long Skyr 的差別

| | Short Skyr | [Long Skyr](../skyr-long/) |
|--|------------|----------------------------|
| 適溫 | 嗜熱（需定溫） | 常溫（mesophilic） |
| 質地 | 瀝乳後濃稠；**傳統不 sticky／ropy** | 常帶**黏絲（ropey）** |
| 定位 | 接近傳統冰島製法 | DIY 變體／混菌偶然產物，非傳統 Skyr |

## 瀝乳是必要步驟

冷藏瀝乳約 **8–12 h**，越久越厚。濃稠來自瀝乳，而非菌種本身。發酵中出現乳清分離是正常現象。

## 使用筆記（Usage Notes）

- 傳統用**脫脂乳**；全脂較濃郁但不傳統。
- 傳統做法可加**一滴凝乳酶（rennet）** 幫助結構。
- 凍乾乾粉的**第一批常表現不足**；用第一批的一匙做第二批，才是該菌真實水準。第 1 代不宜當基準線。`,
	},
	{
		id: 'skyr-long',
		title: 'Long Skyr（長版／常溫黏絲）',
		titleEn: 'Long Skyr (Mesophilic / Ropey)',
		summary: '常溫、可帶黏絲的 Skyr 風格變體；非傳統冰島製法。≠ Short Skyr。',
		species: '常溫 LAB 為主；商用描述常暗示混入產黏菌株（實際菌相依供應商）',
		temperatureClass: 'mesophilic',
		tempRangeC: '20–25',
		timeRangeH: '12–24',
		flavorProfile: '溫和微酸，可帶一點甜潤',
		textureProfile: '偏厚 cream；常有 subtle ropey／黏絲',
		reuseHint: 'DIY 店多作 mesophilic heirloom；勿當成傳統嗜熱 Skyr 的替代說明書',
		sortOrder: 55,
		bodyMd: `## 概述（Overview）

**Long Skyr** 是西方 DIY 菌種商（如 Positively Probiotic）販售的**常溫 Skyr 風格變體**：室溫發酵，成品常帶**黏絲（ropey）**。

商用說法多推測：可能原為傳統 Skyr 菌，後來混入產黏菌株；**不是**冰島傳統「加熱＋嗜熱＋瀝乳」流程的標準答案。

## 重要澄清：≠ Short Skyr

| | Long Skyr | [Short Skyr](../skyr-short/) |
|--|-----------|------------------------------|
| 溫度 | 常溫 | 嗜熱 42–43°C |
| 黏絲 | 常見特色 | 傳統 Skyr 通常沒有 |
| 瀝乳 | 可選（看喜歡的厚度） | **標誌步驟**（8–12 h） |
| 名稱 | DIY 商品名 | DIY 對「傳統版」的稱呼 |

→ 要做**傳統口感 Skyr**請選 Short／一般標 thermophilic 的 Skyr starter，不要用 Long 的說明書去對照文獻裡的冰島製法。`,
	},
	{
		id: 'matsoni',
		title: 'Matsoni（喬治亞原產）',
		titleEn: 'Matsoni',
		summary: '原產菌相不定、偏嗜熱；常含真菌。口感對照常列優格狀。與 Japanese Caspian Sea 不是同一件事。',
		species: 'S. thermophilus + L. delbrueckii（常見）；菌相隨產地而異，可含真菌',
		temperatureClass: 'thermophilic',
		tempRangeC: '40–45',
		timeRangeH: '依配方／產地',
		flavorProfile: '依產地菌相差異大；文獻描述不一',
		textureProfile: '常為優格狀凝乳；不宜假設為常溫 custard',
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
		id: 'viili-short',
		title: 'Short Viili（短版／無黏絲）',
		titleEn: 'Short Viili (SV)',
		summary: '常溫；奶油香但無傳統黏絲。口感接近優格狀／布丁。≠ Long Viili。',
		species: 'Lactococcus／Leuconostoc 等常溫 LAB；通常無強產黏 L. cremoris，亦常無 G. candidum',
		temperatureClass: 'mesophilic',
		tempRangeC: '20–25',
		timeRangeH: '12–24',
		flavorProfile: '溫和、偏甜潤奶油香（類似 Viili 風味）',
		textureProfile: '優格狀／布丁凝乳；平滑可勺，不 ropey',
		reuseHint: 'mesophilic heirloom；Long Viili 過度發酵也可能「變成」短版且難回復',
		sortOrder: 48,
		bodyMd: `## 概述（Overview）

**Short Viili（SV）**＝失去（或不含）產黏能力的 Viili：風味仍偏芬蘭常溫乳，但質地像一般優格／布丁，**沒有**長版的黏絲玩具感。

DIY 店常單獨販售；也可因 Long Viili 過度發酵、質體質體丟失而「變成」短版。

## 與 Long Viili

| | Short | [Long](../viili-long/) |
|--|-------|------------------------|
| 黏絲 | 無 | 有（viilian／EPS） |
| 口感 | 優格狀／布丁 | 黏、可拉絲 |
| 適溫 | 常溫 | 常溫 |

→ 口感對照表裡的「布丁奶酪（優格狀）」常列的是 **Short**，不是 Long。`,
	},
	{
		id: 'viili-long',
		title: 'Long Viili（長版／黏絲）',
		titleEn: 'Long Viili',
		summary: '常溫 heirloom；黏絲來自產 EPS 的乳球菌；傳統菌相含黴菌與酵母。',
		species: 'Lactococcus cremoris（產黏）+ L. lactis + Leuconostoc；傳統另含 Geotrichum candidum 與酵母',
		temperatureClass: 'mesophilic',
		tempRangeC: '20–25',
		timeRangeH: '12–24',
		flavorProfile: '偏淡、偏甜潤，帶奶油香',
		textureProfile: 'ropy／黏絲（胞外多醣 viilian）；不黏可能已變成短版',
		reuseHint: '典型 heirloom；EPS 基因常在質體上，保存溫度偏高易失黏',
		sortOrder: 50,
		bodyMd: `## 概述（Overview）

芬蘭常溫風格的**長版（傳統黏絲）**。工業製程常寫冷卻至約 20°C 接種、熟成約 20 h。

若要優格狀／布丁、不要黏絲，請改看 [Short Viili](../viili-short/)。

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
- 某批不黏，**可能是菌株變異而非操作失誤**（變成 Short）。批次建議記「本批是否 ropy」。
- 若菌種含 *G. candidum*，均勻白絲絨表面是正常成熟；純 LAB 菌粉長毛則視為污染。`,
	},
	{
		id: 'amasi',
		title: 'Amasi（南非）',
		titleEn: 'Amasi',
		summary: '常溫發酵乳；傳統偏可飲／凝乳，加倍接種可更稠。商業多用乳球菌。',
		species: 'Lactococcus lactis + Lactococcus cremoris（商業常見）；傳統為自然發酵菌相',
		temperatureClass: 'mesophilic',
		tempRangeC: '20–30',
		timeRangeH: '16–48',
		flavorProfile: '偏酸、風味可較強烈',
		textureProfile: '傳統偏液態優格／酪乳；加倍 starter 可接近優格狀',
		reuseHint: 'DIY 多為 mesophilic heirloom；室溫 20–25°C 常見',
		sortOrder: 52,
		bodyMd: `## 概述（Overview）

**Amasi**（亦見 Amasai）是南非等地傳統發酵乳：傳統用生乳在葫蘆等容器自然發酵；商業製程約 **30°C／16–24 h**，常用 *Lactococcus lactis* 與 *L. cremoris*。

DIY 店多標 **常溫 heirloom**；質地可像可飲優格／克菲爾，加倍接種量可更稠、接近優格狀。

## 口感分類

口感對照表常把它放在「布丁／優格狀」旁；實際成品厚度變化大，請以你的接種量與發酵終點為準。`,
	},
	{
		id: 'langfil-short',
		title: 'Short Långfil（短版）',
		titleEn: 'Short Långfil',
		summary: '常溫；Långfil 失去黏絲後的優格狀版本。接近 Filmjölk／布丁凝乳。',
		species: 'fil／Långfil 系 Lactococcus／Leuconostoc；弱或無產黏能力',
		temperatureClass: 'mesophilic',
		tempRangeC: '20–25',
		timeRangeH: '12–24',
		flavorProfile: '溫和、可帶奶油香（fil 系）',
		textureProfile: '優格狀／布丁；不拉絲',
		reuseHint: 'mesophilic；可由 Long Långfil 失黏而來，或商家短版配方',
		sortOrder: 57,
		bodyMd: `## 概述（Overview）

**Short Långfil**＝不帶（或已失去）彈性黏絲的 Långfil：風味仍偏瑞典 fil，質地像優格／布丁。

傳統 **Långfil** 以長絲著名；短版才是口感對照表裡「優格狀」那一格。見 [Long Långfil](../langfil-long/)。`,
	},
	{
		id: 'langfil-long',
		title: 'Long Långfil（長版／黏絲）',
		titleEn: 'Långfil (Long)',
		summary: '瑞典常溫；Filmjölk 的黏絲變體，彈性拉絲、奶油香。',
		species: '產 EPS 的 Lactococcus（常與 L. cremoris／ropy 菌株相關）＋ fil 系伴隨菌',
		temperatureClass: 'mesophilic',
		tempRangeC: '20–25',
		timeRangeH: '12–24',
		flavorProfile: '溫和奶油香、微酸',
		textureProfile: '長彈性黏絲（ropey）；攪拌後可變滑順',
		reuseHint: 'mesophilic heirloom；過度發酵可能失黏變成短版',
		sortOrder: 58,
		bodyMd: `## 概述（Overview）

**Långfil**＝瑞典「長絲 fil」：常溫發酵，質地可拉成長絲，風味偏奶油。可視為 [Filmjölk](../filmjolk/) 的**黏絲變體**。

若要優格狀、不要黏絲：用 [Short Långfil](../langfil-short/) 或 Filmjölk。`,
	},
	{
		id: 'filmjolk',
		title: 'Filmjölk（瑞典）',
		titleEn: 'Filmjölk',
		summary: '常溫風格；偏可飲／優格狀。菌相為乳球菌＋明串珠菌，通常不含黴菌。',
		species: 'Lactococcus lactis subsp. lactis + Lactococcus cremoris + biovar diacetylactis + Leuconostoc mesenteroides',
		temperatureClass: 'mesophilic',
		tempRangeC: '20–21',
		timeRangeH: '18–20',
		flavorProfile: '略酸，帶奶油香',
		textureProfile: '偏可飲至優格狀；比牛奶稠、比稠優格薄；不以 ropy 為主',
		reuseHint: '常為 heirloom；商業配方可另加機能菌',
		sortOrder: 60,
		bodyMd: `## 概述（Overview）

瑞典常溫發酵乳。商業菌種商製程建議約 **20–21°C／18–20 h**。口感對照表常歸「布丁／優格狀」旁。

## 與 Viili／Långfil 的差別

- Filmjölk **通常不含黴菌**，不以產黏菌株為主，因此一般不 ropy。
- 要黏絲用 [Long Långfil](../langfil-long/)；要優格狀短版用 [Short Långfil](../langfil-short/)。
- 現代商業配方有時另加 *L. acidophilus*、*B. animalis* subsp. *lactis* 做機能訴求。
- 瑞典 Arla 的 [Onaka](../onaka/) 即是「fil 基底＋雙歧桿菌」路線的知名商品名。`,
	},
	{
		id: 'onaka',
		title: 'Onaka（お腹／fil＋bifido）',
		titleEn: 'Onaka',
		summary: '常溫 fil 型＋雙歧桿菌；源自瑞典 Arla。口感對照常列優格狀。≠ Japanese Caspian Sea。',
		species:
			'fil 系 Lactococcus／Leuconostoc；另加 Bifidobacterium lactis（商品常見 BB-12）、常另含 L. acidophilus、L. casei',
		temperatureClass: 'mesophilic',
		tempRangeC: '20–25',
		timeRangeH: '12–24',
		flavorProfile: '溫和清爽、酸度偏低；偏「純乳」感',
		textureProfile: 'fil／優格狀；偏滑順，可略稠於一般 filmjölk；不以 Caspian 式強黏絲為主',
		reuseHint: 'DIY 店多作 mesophilic heirloom；市售 Onaka filmjölk 亦可當 starter（傳代穩定性視菌相）',
		sortOrder: 65,
		bodyMd: `## 概述（Overview）

**Onaka（お腹）**＝日文「肚子」。1990 年前後瑞典 **Arla** 推出的 filmjölk 變體：在 fil 菌基底上加入來自日本合作（森永）的雙歧桿菌，打腸道健康概念。

現售 **Arla Cultura Onaka** 常見標示：乳＋filkultur＋*Bifidobacterium lactis* BB-12®、*Lactobacillus acidophilus* LA-5®、*Lactobacillus casei* F-19®。

西方 DIY 店（如 Positively Probiotic）販售的 Onaka starter 多描述為 **fil-style＋*B. lactis***，常溫發酵、風味清爽。

## 重要澄清

| | Onaka | [Japanese Caspian Sea](../caspian-sea/) | [Filmjölk](../filmjolk/) |
|--|-------|-------------------------------------------|---------------------------|
| 本質 | fil＋bifido（機能強化） | 單一產 EPS 的 *L. cremoris* 主導 | 傳統／商業 fil 四菌 |
| 地名故事 | 日本「お腹」行銷名 | 名義溯源裏海／高加索 | 瑞典 |
| 黏絲 | 通常不如 Caspian／Viili 強 | 強（EPS） | 一般不強調 ropy |

→ **Onaka ≠ 日本裏海優格。** 較接近 Filmjölk 的機能加強版。`,
	},
	{
		id: 'caspian-sea',
		title: 'Japanese Caspian Sea (日本裏海)',
		titleEn: 'Japanese Caspian Sea',
		summary: '常溫、可傳代；優勢菌為產 EPS 的 Lactococcus cremoris。口感對照常列布丁／優格狀。≠ Matsoni；≠ Onaka。',
		species: 'Lactococcus cremoris（優勢；舊名 L. lactis subsp. cremoris）',
		temperatureClass: 'mesophilic',
		tempRangeC: '20–25',
		timeRangeH: '12–24',
		flavorProfile: '溫和；相對「比較像優格」',
		textureProfile: '黏稠 custard／布丁感；黏性來自優勢菌的 EPS',
		reuseHint: 'mesophilic heirloom；名義溯源高加索，菌相已與原產 matsoni 分道',
		sortOrder: 70,
		bodyMd: `## 概述（Overview）

日本流通的「カスピ海ヨーグルト」。調查顯示樣本優勢菌一致為產 EPS 的 ***Lactococcus cremoris***（約 10⁸–10⁹ CFU/g），黏稠來自該菌胞外多醣。

## 重要澄清：≠ Matsoni；≠ Onaka

名義上溯源高加索，但與喬治亞原產 [Matsoni](../matsoni/) **不是同一件事**：

- 本品：常溫、單一乳球菌主導、可傳代。
- Matsoni：偏嗜熱、菌相不定、常含真菌。

亦勿與 [Onaka](../onaka/) 混淆：Onaka 是瑞典 fil＋雙歧桿菌路線，不是裏海式 *L. cremoris* 單菌主導。

英文 DIY 站販售的「matsoni starter」多半其實是本類型（Caspian／乳球菌型）。`,
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
	{
		id: 'straining',
		title: '瀝乳法',
		titleEn: 'Straining (Greek / Concentrated)',
		summary: '發酵完成後瀝去乳清以濃縮蛋白與質地。希臘優格與 Skyr 的「厚」多半來自這步，而非菌種本身。',
		equipment: ['細篩或瀝水籃', '濾布／紗布／咖啡濾紙', '承接乳清的碗', '冰箱空間'],
		suitableCultures: ['greek-starter', 'skyr-short', 'bulgarian', 'traditional'],
		bodyMd: `## 目的（Purpose）

在**已完成發酵**的優格上，以重力瀝去部分乳清（whey），提高固形物與稠度。成品可從偏稠優格做到接近 labneh 的可抹質地。

## 流程（Process Steps）

1. **先完成發酵並冷藏**：結構穩定後再瀝；剛出保溫箱過軟、易破。
2. **架設**：篩網／濾籃鋪濾布，下方放碗接乳清。
3. **倒入優格**：輕輕舀入，勿大力攪散凝乳。
4. **冷藏瀝乳**：約 **1–2 h** → 偏稠希臘式；**2–4 h** → 明顯濃稠；**4–8 h** → 很厚；更久可近 labneh。
5. **收成**：倒入密封容器冷藏；乳清可另作料理（勿浪費亦可）。

## 關鍵控制點（Critical Control Points）

| 控制點 | 建議 | 失敗常見結果 |
|--------|------|----------------|
| 瀝乳時機 | 發酵完成並冷藏後再瀝 | 破乳、乳清混濁、質地粉 |
| 瀝乳時間 | 依目標厚度分段檢查 | 過幹、產量過低 |
| 濾材孔徑 | 過粗會漏凝乳；過細過慢 | 損失或耗時過長 |
| 與「希臘式」市售 | 市售常靠奶粉／膠體，≠ 瀝乳 | 對照批次時混淆變因 |

## 備註

- Short Skyr 傳統上瀝乳常比一般希臘優格更久（常見說明 8–12 h）。
- 本製法可接在 [高溫巴氏後接種法](../pasteurized-inoculation/) 之後。`,
	},
	{
		id: 'mesophilic-countertop',
		title: '常溫室溫發酵法',
		titleEn: 'Mesophilic Countertop Fermentation',
		summary: '中溫菌在約 20–30°C（DIY 常 21–25°C）室溫靜置發酵；通常不需優格機定溫。',
		equipment: ['清潔玻璃／食品容器', '湯匙', '可選：溫度計（確認室溫）'],
		suitableCultures: [
			'viili-short',
			'viili-long',
			'filmjolk',
			'onaka',
			'caspian-sea',
			'amasi',
			'langfil-short',
			'langfil-long',
			'piima',
			'skyr-long',
		],
		bodyMd: `## 目的（Purpose）

使用 **mesophilic（中溫／常溫）** starter，在室溫附近完成酸化與凝乳。適合少設備、夏季台灣多數室內溫度；冬季若低於約 20°C 可能需延長時間或輕微保溫。

## 流程（Process Steps）

1. **乳的準備（可選加熱）**：可用已巴氏／UHT 乳直接接種；若用鮮乳，可先短暫加熱殺競爭菌後**冷卻至室溫**再接種（常溫菌不要用 42°C 保溫）。
2. **接種**：依包裝或母種比例均勻混入。
3. **室溫靜置**：約 **20–30°C**（常見目標 21–25°C），**12–48 h**，至傾斜罐壁凝乳可整體移動。
4. **冷藏後熟**：移入冰箱至少數小時，質地通常會再變實。
5. **傳代（heirloom）**：留一小部分當下一劑母種；規律製作較穩。

## 關鍵控制點（Critical Control Points）

| 控制點 | 建議 | 失敗常見結果 |
|--------|------|----------------|
| 適溫類別 | 勿把常溫菌當嗜熱 42°C 做 | 菌相失衡、失黏、失敗 |
| 室溫範圍 | 記錄實際室溫與時長 | 過慢或不凝；過熱過酸 |
| 勿搖晃 | 發酵中少開蓋、少攪 | 凝乳破碎、乳清增多 |
| 與嗜熱製法 | 變因分開記批次 | 無法橫向比較 |

## 備註

- Viili／Långfil 的黏絲（ropy）來自 EPS，與「有沒有酵母」無關；失黏可能是菌株變異。
- 細節見各菌種頁；總覽見 [菌種分類](../../cultures/)。`,
	},
	{
		id: 'set-vs-stirred',
		title: '凝態與攪拌型',
		titleEn: 'Set vs Stirred Yogurt',
		summary: '依發酵位置與後處理區分：杯內靜置凝固（set）vs 槽內發酵後攪勻（stirred）。影響質地與操作，不是菌種名。',
		equipment: ['定溫設備或保溫容器', '發酵罐／杯（set）', '可選：篩網或溫和攪拌工具（stirred）'],
		suitableCultures: ['traditional', 'bulgarian', 'greek-starter', 'skyr-short'],
		bodyMd: `## 目的（Purpose）

釐清兩種**產品型態／製程路線**，避免把「質地差異」全怪到菌種上。

| | 凝態（Set） | 攪拌型（Stirred） |
|--|-------------|-------------------|
| 發酵位置 | 最終容器／杯內 | 發酵槽或大罐 |
| 質地傾向 | 較完整凝膠、可勺斷面 | 較滑順均勻，可再調稠 |
| 家用對應 | 接種後分裝靜置到凝 | 大罐發酵後輕攪再冷藏 |
| 工業（Tetra Pak 等） | 包裝後進保溫室約 40–42°C | 槽內約 42–43°C 至目標酸度後冷卻並溫和處理 |

## 流程概念（Process）

### 凝態（Set）

1. 乳預處理與接種（常接 [高溫巴氏後接種法](../pasteurized-inoculation/)）。
2. 分裝至杯／罐後**靜置保溫**至凝乳。
3. 整杯冷卻後熟；避免劇烈搖晃。

### 攪拌型（Stirred）

1. 大容器內發酵至目標酸度／凝乳。
2. **溫和**攪散凝膠（工業常再經平滑處理）；過猛會變稀、乳清分離。
3. 冷卻、分裝、冷藏。

## 關鍵控制點（Critical Control Points）

| 控制點 | 建議 | 失敗常見結果 |
|--------|------|----------------|
| 機械處理強度 | stirred 只溫和攪 | 變稀、乳清層 |
| 發酵終點 | 凝乳／酸度達標再攪或冷卻 | 過酸或結構弱 |
| 紀錄方式 | 批次註明 set 或 stirred | 同菌種無法對照質地 |

## 備註

- 「希臘」濃度仍多靠 [瀝乳](../straining/) 或濃縮，與 set／stirred 正交。
- 可飲優格屬另一條後稀釋／調配路線，本頁不展開。`,
	},
	{
		id: 'improvised-incubation',
		title: '無優格機保溫變通',
		titleEn: 'Improvised Thermophilic Incubation',
		summary: '嗜熱路線在無定溫機時，用保溫瓶、烤箱燈、冰桶＋熱水、微波爐＋熱水碗等維持約 40–45°C（或你記錄的實際溫度）。',
		equipment: ['探針溫度計', '保溫瓶或厚壁容器', '可選：烤箱（僅燈）、冰桶、熱水袋／熱水碗、毛巾'],
		suitableCultures: ['traditional', 'bulgarian', 'greek-starter', 'skyr-short', 'ayran', 'persis', 'matsoni'],
		bodyMd: `## 目的（Purpose）

嗜熱菌需要相對穩定的保溫。沒有優格機時，用生活器材逼近目標溫區，並**把實際溫度寫進批次**（變通法波動通常大於機器）。

## 常見做法（Options）

| 做法 | 做法摘要 | 注意 |
|------|----------|------|
| 保溫瓶／悶燒罐 | 接種後乳倒入預熱瓶，蓋緊靜置 | 蓄熱差的瓶中後段會掉溫 |
| 烤箱燈 | 關加熱、只開燈（傳統燈泡較有效；LED 往往不夠熱） | 先測溫；勿誤開烘烤 |
| 冰桶＋熱水 | 容器旁放熱水瓶／熱水袋，蓋上毛巾 | 需換水；測容器內乳溫 |
| 電鍋 | **保溫**或外鍋溫水輔助；勿長按煮飯鍵 | 煮飯鍵溫度常過高、燙菌 |
| 微波爐＋熱水碗 | 關微波加熱，僅用腔體＋蒸汽／餘溫輔助 | 波動大；本站 B001 曾用約 32°C 長發酵 |

## 建議流程（Process Steps）

1. **乳與接種**：仍建議先完成加熱／冷卻接種（見 [高溫巴氏後接種法](../pasteurized-inoculation/)），再進入變通保溫。
2. **預熱容器**：熱水燙罐／瓶，減少初期掉溫。
3. **放入保溫環境**：目標常為 **40–45°C**（常見 42–43°C）；若只能到較低溫，延長時間並記實測。
4. **少開蓋**：每開一次都掉溫、擾動凝乳。
5. **達凝乳後冷藏**：後熟使質地更穩。

## 關鍵控制點（Critical Control Points）

| 控制點 | 建議 | 失敗常見結果 |
|--------|------|----------------|
| 實測溫度 | 發酵前後各記一次乳溫 | 「以為有保溫」其實已涼 |
| 穩定度 | 能換熱水就換；避免忽高忽低 | 凝不全或過酸、乳清 |
| 上限 | 接種／保溫勿長期 >45–50°C | 菌失活、不凝 |
| 與常溫菌 | 常溫菌請改用 [常溫室溫發酵法](../mesophilic-countertop/) | 溫區用錯 |

## 備註

- 變通法適合「先做出可吃的凝乳」；要做可重複對照實驗，優先改回定溫設備。
- 發酵過久會更酸、乳清增多——凝乳達標就收，不要為了「湊滿時數」硬撐。`,
	},
	{
		id: 'wild-fruit-starter',
		title: '野生水果引子馴化法',
		titleEn: 'Wild Fruit Starter Domestication',
		summary:
			'用有機水果表皮的天然乳酸菌與野生酵母做發酵液，再馴化進牛奶，追求果香／微酸等獨特風味。實驗性製法，雜菌風險高。',
		equipment: ['消毒玻璃罐', '濾網／濾布', '湯匙', '溫度計', '可定溫或溫暖處（約 25–40°C）'],
		suitableCultures: [],
		bodyMd: `## 目的（Purpose）

市售優格 starter 常只有少數菌株，風味接近。本製法以**野生發酵（wild fermentation）**捕捉水果表皮天然菌群，再逐步馴化成可做優格的母種。風味可能帶微酸、果香甚至偏起司感——結果**不可預測**，批次間差異大。

> **安全備註（必讀）：** 本製法屬實驗性野生發酵，雜菌污染風險明顯高於市售菌粉／優格。請務必遵守文末「安全鐵律」；任何外觀或氣味異常的成品**整批丟棄、不可試吃**。孕婦、免疫低下者不建議操作或食用此類實驗批次。

## 流程（Process Steps）

### 1. 製作發酵液（活化天然菌）

1. 玻璃罐徹底消毒（沸水燙過）。
2. 放入切塊**有機水果**（如蘋果、葡萄、草莓）；**不要洗得過乾淨**，保留表皮天然菌。
3. 加 **1 湯匙蜂蜜**，再倒入蓋過水果的過濾水。
4. 蓋緊，室溫 **3–5 天**；每天開蓋放氣一次。
5. 就緒訊號：大量細緻氣泡、聞起來有**微酸酒香**（非腐臭）。

### 2. 第一次接種（馴化進乳）

1. 濾出發酵液。
2. 取 **10–20 ml** 發酵液，加入 **200 ml** 全脂牛奶。
3. 於約 **25–30°C** 溫暖處發酵 **24–48 h**。
4. 就緒訊號：牛奶凝固、清香酸味 → 此為「初代風味菌種」。

### 3. 續種（穩定風味）

1. 取 **1 湯匙** 初代優格，接入新的 **500 ml** 牛奶。
2. 於約 **40°C** 發酵 **8–12 h**（需定溫或可靠保溫）。
3. 重複傳代約 **2–3 次**，菌相較適應乳環境後，風味通常較穩定，可當專屬母種使用。

## 關鍵控制點（Critical Control Points）

| 控制點 | 建議 | 失敗常見結果 |
|--------|------|----------------|
| 水果與器具衛生 | 有機果＋沸水消毒罐匙 | 雜菌主導、腐敗 |
| 發酵液氣味 | 只要微酸酒香；腐臭／指甲油味即丟 | 誤食風險 |
| 馴化溫區 | 初代偏常溫；續種再拉到嗜熱區間 | 不凝或菌相失控 |
| 傳代次數 | 至少 2–3 代再當「穩定母種」 | 風味亂跳、易敗 |

## 安全鐵律（Safety — 必守）

野生發酵迷人，但**感官不合格＝整批報廢**：

| 檢查 | 可接受 | 立刻倒掉 |
|------|--------|----------|
| **外觀** | 純白或微乳黃 | 粉紅、綠、黑，或毛茸茸黴菌 |
| **氣味** | 舒適酸香、果香、乳香 | 腐臭、腳臭、強烈指甲油／丙酮味 |
| **容器** | 接觸乳與水果的罐、匙皆沸水燙過 | 未消毒就接種 |

**備註：** 即使氣味「還好」，若表面有任何可見黴斑，仍整批丟棄，勿刮掉上層繼續吃。實驗批次請在日誌標明 \`wild-fruit\`，勿與一般基準線批次混比。`,
	},
	{
		id: 'cross-culture-blend',
		title: '跨界混搭商業引子',
		titleEn: 'Cross-Culture Starter Blending',
		summary:
			'以市售優格粉為底，混入生起司碎屑或康普茶原液等引子，追求可控的複合風味。成功率高於純野生發酵，仍須遵守安全鐵律。',
		equipment: ['優格機或可穩在約 40°C 的保溫設備', '消毒容器與湯匙', '溫度計'],
		suitableCultures: ['traditional', 'bulgarian', 'greek-starter'],
		bodyMd: `## 目的（Purpose）

不依賴完全野生捕捉，而是以**已知的商業優格菌粉**為主幹，再少量混入其他發酵食物引子，調出市面少見的複合香氣。相對方法一，變因較可控、成功率較高，但仍屬實驗配方。

> **安全備註（必讀）：** 混入起司或康普茶會引入額外微生物（含酵母、醋酸菌、甚至起司伴隨黴菌）。請只用**可安全生食／飲用**的來源；任何異常外觀或氣味一律丟棄。詳見文末「安全鐵律」。

## 風味配方（Examples）

### 配方 A — 濃郁起司風

- 市售優格粉（依包裝奶量）
- **＋ 一小塊生起司碎屑**（如熟成切達或藍紋起司）
- 起司中常見副乾酪乳桿菌等，可能帶來堅果／起司香；藍紋會更強烈，首次建議極少量。

### 配方 B — 清爽微氣泡風

- 市售優格粉
- **＋ 約 1 湯匙康普茶（kombucha）原液**（未調味、活菌款為佳）
- 醋酸菌與酵母可能帶來果酸與輕微氣感；成品罐可能比純優格更容易產氣，開蓋小心。

## 流程（Process Steps）

1. 器具沸水消毒。
2. 全脂牛奶依你慣用製法準備（建議仍走加熱冷卻後接種，見 [高溫巴氏後接種法](../pasteurized-inoculation/)）。
3. 將優格粉與選定引子（起司碎或康普茶）一併混入奶中，攪勻。
4. **約 40°C** 定溫發酵 **8–10 h**（至凝乳）。
5. 冷藏後熟；感官檢查通過後再食用。
6. 若要傳代：只留**通過安全檢查**的成品當母種，並在批次註明混搭配方與代數。

## 關鍵控制點（Critical Control Points）

| 控制點 | 建議 | 失敗常見結果 |
|--------|------|----------------|
| 引子劑量 | 首次寧少勿多 | 過酸、產氣劇烈、異味 |
| 定溫 | 穩在約 40°C | 不凝或雜味放大 |
| 產氣 | 配方 B 預留頭隙、輕開蓋 | 罐脹、噴濺 |
| 紀錄 | 寫清「粉品牌＋引子種類／量」 | 無法重現風味 |

## 安全鐵律（Safety — 必守）

與野生法相同標準；混搭商業引子**不代表零風險**：

| 檢查 | 可接受 | 立刻倒掉 |
|------|--------|----------|
| **外觀** | 純白或微乳黃 | 粉紅、綠、黑，或毛茸茸黴菌 |
| **氣味** | 舒適酸香、果香、乳香／淡起司香 | 腐臭、腳臭、強烈指甲油／丙酮味 |
| **容器** | 罐、匙沸水消毒 | 未消毒就接種 |
| **引子來源** | 可生食的起司；活菌康普茶原液 | 發霉食物殘渣、來源不明液 |

**備註：** 藍紋／白黴起司本身含黴菌；若優格表面長出**非預期**的新黴層或顏色，仍整批丟棄。不建議給幼兒、孕婦、免疫低下者食用實驗混搭批次。`,
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
 *  equipment: { device?: string, vessel?: string, note?: string },
 *  ingredients: Array<{ type: IngredientType, brand: string, amount: string, note?: string }>,
 *  cultureSource: CultureSource,
 *  cultureName: string,
 *  cultureOrigin: string,
 *  cultureAmount: string,
 *  cultureGeneration?: number,
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
 *  photoAlbumUrl?: string,
 *  photos?: string[],
 *  bodyMd: string
 * }>} */
export const batches = [
	{
		id: 'b001-baseline',
		title: '2026/07/30',
		titleEn: '2026-07-30',
		date: '2026-07-30',
		inoculationTempC: '32',
		incubationTempC: '32',
		incubationTimeH: '11h',
		equipment: {
			device: '微波爐 + 一碗熱水',
			vessel: '304 金屬制容器',
			note: '',
		},
		ingredients: [
			{ type: 'fresh-milk', brand: '義美全脂鮮奶', amount: '700 ml' },
		],
		cultureSource: 'commercial-yogurt',
		cultureName: '心樸優格',
		cultureOrigin: '市售優格當 starter',
		cultureAmount: '120 ml',
		resultSet: '凝乳完整但略為過頭，已有乳清析出',
		resultAcidity: '中，乳酸感清楚但可接受',
		resultTexture: '勺起可斷面，偏細緻，但表面不夠光滑',
		resultWhey: '表面少量乳清',
		resultFlavor: '典型優格酸香，略帶乳脂',
		resultOverall: '可作為後續對照的基準線批次',
		scoreReproducibility: 3,
		scoreSatisfaction: 3,
		photoAlbumUrl: 'https://photos.app.goo.gl/JuT2GeDxGeWpdomt5',
		photos: ['batches/b001/01.jpg'],
		bodyMd: `## Observation（觀察）

凝乳完整但略過頭，已有乳清析出；酸度中等可接受。微波爐＋熱水碗保溫約 32°C、發酵 11 h。

## Next Trial（下次調整）

製法不變，但需要縮短發酵時間。`,
	},
	{
		id: 'b002-fulo-microwave',
		title: '2026/08/01',
		titleEn: '2026-08-01',
		date: '2026-08-01',
		ambientTempC: '32',
		inoculationTempC: '約 32',
		incubationTempC: '約 32（微波爐＋熱水碗蒸汽輔助）',
		incubationTimeH: '6h（其後移入冰箱冷藏）',
		equipment: {
			device: '微波爐',
			vessel: '發酵容器',
			note: '熱水碗（蒸汽加溫）',
		},
		ingredients: [
			{ type: 'fresh-milk', brand: '戀職人鮮奶', amount: '500 ml' },
		],
		cultureSource: 'commercial-yogurt',
		cultureName: '福樂 好優牛奶優格',
		cultureOrigin: '市售優格當 starter',
		cultureAmount: '未記',
		resultSet: '成型略不足：約下半（≤1/2）僅黏稠、未接近固態',
		resultTexture: '下層偏黏稠液態／半凝；上層相對較成',
		resultOverall: '嗜熱路線用室溫＋微波爐蒸汽，保溫偏不穩；下次改穩定 40–43°C 定溫再對照',
		scoreSatisfaction: 2,
		bodyMd: `## Observation（觀察）

- 室溫 32°C；發酵 6 h 後改冷藏。
- 發酵期間放微波爐，另放一碗熱水以蒸汽加溫，但**未達穩定嗜熱保溫**。
- 成品凝乳不足：約一半以下只到黏稠、沒有接近固態。

## 可能原因（假說）

1. **保溫不足／波動大**：市售優格當母種多為嗜熱兩菌路線，適溫常在 40–45°C；32°C＋間歇蒸汽可能產酸與凝乳偏慢。
2. **接種量未記錄**：無法判斷是否接種偏少。
3. **未做加熱乳／冷卻接種紀錄**：蛋白結構與競爭菌控制不明。

## Next Trial（下次調整）

1. 改用優格機或定溫設備，目標 **42°C ±1–2°C**，同樣 6 h（或延長至凝乳完整）。
2. 記錄母種接種量（例如每 500 ml 用 X g／湯匙）。
3. 可選：鮮乳先加熱至約 85°C 持溫後冷卻再接種，與本批對照。`,
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
	{
		id: 'straining',
		termZh: '瀝乳',
		termEn: 'Straining',
		category: 'process',
		bodyMd: '發酵完成後以濾布／篩網瀝去部分乳清，使成品濃稠。希臘優格與 Skyr 的厚度多半來自這步，而非菌種本身。',
	},
	{
		id: 'mother-culture',
		termZh: '母種',
		termEn: 'Mother Culture',
		category: 'microbiology',
		bodyMd: '前一批發酵成品留取的一小部分，作為下一劑 starter。需固定接種量、溫度與時間，並注意衛生與活性維護。',
	},
	{
		id: 'propagation',
		termZh: '傳代',
		termEn: 'Serial Propagation / Backslopping',
		category: 'microbiology',
		bodyMd: '用上一批成品再接種下一批，延續同一套菌相。Direct-set 約 3–5 代後易失衡；heirloom／SCOBY 較耐長期傳代。',
	},
	{
		id: 'direct-set',
		termZh: '一次接種菌粉',
		termEn: 'Direct-set',
		category: 'microbiology',
		bodyMd: '凍乾或高濃縮菌粉直接接種，每包對固定奶量。結果較穩定，但通常不宜當無限母種；長期傳代比例易漂移。',
	},
	{
		id: 'heirloom',
		termZh: '可傳代菌種',
		termEn: 'Heirloom',
		category: 'microbiology',
		bodyMd: '可長期以成品回接的傳統型 starter；菌相較複雜、具自我平衡。北歐常溫 fil 與部分保加利亞／Skyr 屬此類，與 direct-set 分離菌株不同。',
	},
	{
		id: 'thermophilic',
		termZh: '嗜熱菌',
		termEn: 'Thermophilic',
		category: 'microbiology',
		bodyMd: '最適約 40–45°C（常 42–43°C）的中高溫發酵菌。典型優格兩菌路線需定溫保溫，發酵約 4–12 小時。',
	},
	{
		id: 'mesophilic',
		termZh: '中溫菌',
		termEn: 'Mesophilic',
		category: 'microbiology',
		bodyMd: '最適約 20–30°C 的常溫發酵菌。北歐 fil、Viili、Caspian Sea 等，多可室溫靜置，發酵約 12–48 小時。',
	},
	{
		id: 'ropy',
		termZh: '黏絲',
		termEn: 'Ropy',
		category: 'quality',
		bodyMd: '勺起或拉伸時出現長絲、彈性黏稠感。多來自產 EPS 的乳球菌株，與含酵母無關；過度發酵或保存不當可能消失。',
	},
	{
		id: 'greek-style',
		termZh: '希臘式',
		termEn: 'Greek-style',
		category: 'quality',
		bodyMd: '品名標「希臘式」但靠奶粉、乳清蛋白或膠體增稠的產品型態。與發酵後瀝乳得到的希臘優格（Greek yogurt）不同。',
	},
	{
		id: 'pasteurization',
		termZh: '巴氏殺菌',
		termEn: 'Pasteurization',
		category: 'process',
		bodyMd: '將鮮乳加熱至約 85–90°C 並持溫，降低競爭微生物並改變乳蛋白結構；為接種前常見熱處理。',
	},
	{
		id: 'lab',
		termZh: '乳酸菌',
		termEn: 'Lactic Acid Bacteria (LAB)',
		category: 'microbiology',
		bodyMd: '將乳糖發酵成乳酸的細菌總稱。優格主發酵靠核心兩菌；常溫 fil 與附加機能菌亦屬 LAB，有別於酵母／SCOBY 型。',
	},
	{
		id: 'scoby',
		termZh: 'SCOBY（共生菌膜／顆粒）',
		termEn: 'SCOBY',
		category: 'microbiology',
		bodyMd: '細菌與酵母包在多醣基質中的共生結構（如 kefir grains）。顆粒本身可長期回收再用，有別於純 LAB 優格粉。',
	},
	{
		id: 'eps',
		termZh: '胞外多醣',
		termEn: 'Exopolysaccharide (EPS)',
		category: 'microbiology',
		bodyMd: '部分乳球菌分泌的黏多醣，使優格呈黏稠或黏絲質地。合成基因常在質體上，傳代或偏高溫可能流失。',
	},
	{
		id: 'rennet',
		termZh: '凝乳酶',
		termEn: 'Rennet',
		category: 'process',
		bodyMd: '動物或微生物來源的蛋白酶；傳統 Skyr 等偶加一滴以強化凝乳結構。一般家用優格通常不用。',
	},
	{
		id: 'dvs',
		termZh: 'DVS／DVI',
		termEn: 'Direct Vat Set / Inoculation',
		category: 'microbiology',
		bodyMd: '工業用高濃縮凍乾或冷凍菌，直接投入生產槽接種。家用 direct-set 菌粉的概念來源。',
	},
	{
		id: 'cfu',
		termZh: 'CFU',
		termEn: 'Colony-Forming Units',
		category: 'microbiology',
		bodyMd: '每公克（或毫升）成品中可形成菌落的活菌數估算單位。文獻常寫 10⁸–10⁹ CFU/g；家用無法實測。',
	},
	{
		id: 'uht-milk',
		termZh: 'UHT 乳',
		termEn: 'UHT Milk',
		category: 'process',
		bodyMd: '超高溫瞬時殺菌乳；蛋白結構與鮮乳不同，部分人反映較難凝或質地不同。批次宜註明是否 UHT。',
	},
	{
		id: 'live-cultures',
		termZh: '活菌標示',
		termEn: 'Live Active Cultures',
		category: 'general',
		bodyMd: '市售優格包裝上表示仍含存活發酵菌的標示。作 starter 時宜選原味無糖、成分單純者。',
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
			'保加利亞乳桿菌、嗜熱鏈球菌、嗜酸乳桿菌、比菲德氏菌（雷特氏B菌）、鼠李糖乳桿菌（公開整理約 5 菌；以包裝為準）',
		ingredientsLabel: '生乳/鮮乳、乳酸菌（以杯身最新標示為準）',
		note: '美廉社/心樸市集通路；菌種清單請以當批包裝覆核。',
		sortOrder: 2,
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
		sortOrder: 1,
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
