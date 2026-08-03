# 01 — 優格菌種分類總覽（Culture Taxonomy）

> 整理日期：2026-07-28（章節順序調整）／2026-07-31（新增第 5 層分類）  
> 目的：先建立「怎麼分類菌種」的骨架，再往下填產品型與物種細節。

本章固定五層分類：

1. 依適溫分類  
2. 依「產品風格名稱」分類  
3. 依「能不能反復接種」分類  
4. 法規／定義上的「優格菌」核心種  
5. 依「是否含酵母／真菌」分類（SCOBY 型 vs 純乳酸菌型）  

---

## 1. 依適溫分類

幾乎所有中英文 DIY／乳品加工資料，都會先把 starter 分成兩大類：

| 類別 | 英文 | 適溫（約） | 典型時間 | 質地／風味傾向 | 設備 |
|------|------|------------|----------|----------------|------|
| **中高溫／嗜熱菌** | Thermophilic | **40–45°C**（常寫 42–43°C） | 約 4–12 h | 較濃稠、酸香較「典型優格」 | 需定溫（優格機、電鍋保溫等） |
| **常溫／中溫菌** | Mesophilic | **約 20–30°C**（DIY 常寫 21–25°C） | 約 12–48 h | 較柔、偏清爽，有時可飲用；部分有黏絲感 | 多可室溫罐靜置 |

### 筆記（從多源交叉）

- Tetra Pak *Dairy Processing Handbook*：mesophilic 最適約 **20–30°C**；thermophilic 約 **40–45°C**；接種溫度常寫 mesophilic **20–30°C**、thermophilic **42–45°C**。
- 家酪優指南（繁中）：常溫約 **25°C、12–48 h**；中高溫約 **42°C、4–12 h**。
- Startercultures.eu／Cultures for Health 類 DIY 文：thermophilic 常見 **40–45°C**；mesophilic 常見 **20–30°C** 或 **70–77°F（約 21–25°C）**。

**對 YogurtGuide 的意義：**  
批次紀錄的「保溫溫度」應先標明這批是 thermophilic 還是 mesophilic，否則無法橫向比較。

---

## 2. 依「產品風格名稱」分類

市售菌粉與教學站常用**風格名**，方便選購，但背後物種可能重疊（≠ 純微生物分類）。

### 嗜熱風格（Thermophilic styles）

| 風格名 | 英文 | 簡述 |
|--------|------|------|
| 一般／傳統優格 | Traditional / plain yogurt | 典型 S. thermophilus + L. bulgaricus 路線 |
| 保加利亞優格 | Bulgarian yogurt | 較酸、優格狀凝乳；發酵可偏長 |
| Ayran | Ayran | 土耳其優格飲基底；凝乳優格狀，常再加水／鹽 |
| Persis | Persis (Persian-style) | DIY 用名；對應伊朗 mast 優格狀；多接近嗜熱兩菌 |
| 希臘優格菌粉 | Greek yogurt starter | 常訴求較厚凝乳、較溫和；**真正 Greek 濃稠多靠瀝乳** |
| 冰島 Short Skyr | Short Skyr | 傳統嗜熱＋瀝乳；瀝前優格狀 |
| 冰島 Long Skyr（DIY） | Long Skyr | 常溫、常帶黏絲；**非**傳統製法 |
| Matsoni | Matsoni | 喬治亞原產；偏嗜熱、菌相不定；≠ 日本裏海 |
| 其他（羊奶等） | Goat milk yogurt 等 | 依供應商配方 |

### 常溫風格（Mesophilic / countertop styles）

| 風格名 | 來源區域（常見說法） | 簡述 |
|--------|----------------------|------|
| Short Viili（SV） | 芬蘭 | **無黏絲**；優格狀／布丁；≠ Long |
| Long Viili | 芬蘭 | 溫和、**黏絲（ropy）**；傳統菌相含黴菌與酵母 |
| Filmjölk | 瑞典 | 偏可飲／優格狀、酪乳感、略酸 |
| Short／Long Långfil | 瑞典 | Short＝優格狀；Long＝Filmjölk 黏絲變體 |
| Amasi | 南非 | 常溫發酵乳；可飲至優格狀（視接種量） |
| Onaka（お腹） | 瑞典商品名（日文行銷）；fil＋bifido | Filmjölk 機能加強；≠ 日本裏海 |
| Japanese Caspian Sea（日本裏海） | 日本（名義上溯源高加索） | 黏稠 custard／布丁感；優勢菌為 *Lactococcus cremoris* |
| Piimä | 北歐 | 很稀、可飲、溫和；可用鮮奶油做偏酸稀奶油 |

### 口感對照：布丁奶酪／優格狀（DIY 表常見）

不嚴格微生物分類，僅方便選購對照：

| 群 | 代表 id |
|----|---------|
| 嗜熱優格狀 | `bulgarian`、`ayran`、`persis`、`matsoni`、`skyr-short` |
| 常溫優格狀／布丁 | `viili-short`、`langfil-short`、`filmjolk`、`amasi`、`onaka`、`caspian-sea` |
| 常溫黏絲（對照用，非此群） | `viili-long`、`langfil-long`、`skyr-long` |

> **注意：Matsoni ≠ Japanese Caspian Sea；Onaka ≠ Japanese Caspian Sea；Short ≠ Long（Viili／Långfil／Skyr）。**  
> DIY 站常把 Matsoni 與裏海當同義詞並歸為常溫，文獻不支持。細節見 [02-culture-profiles.md](./02-culture-profiles.md)。

詳見 [02-culture-profiles.md](./02-culture-profiles.md)。

### 「風格名」vs「製程」——容易混淆的點

| 名稱 | 本質上比較像 |
|------|----------------|
| Bulgarian / Viili / Filmjölk | **菌種／配方風格** |
| Greek yogurt（希臘優格） | 多為**發酵後瀝乳（straining）** 的產品型態 |
| Greek-style（希臘式） | 常以增稠劑／奶粉等模擬濃稠，**不一定**瀝乳 |
| Set yogurt（凝態） | 容器內靜置凝固的型態 |
| Stirred yogurt（攪拌型） | 發酵後攪拌的型態 |

→ YogurtGuide 建議：菌種頁寫 culture；製法頁寫 straining／set／stirred。

---

## 3. 依「能不能反復接種」分類

| 類型 | 英文常見說法 | 特點 |
|------|--------------|------|
| **可延續／傳代** | Heirloom、re-culturable、mother culture | 成品可留一部份當下一劑 starter；需規律製作與衛生 |
| **一次／數次用完** | Direct-set、single-use、DVS／DVI（工業用語） | 凍乾粉直接接種；結果穩定，但通常不宜長期傳代 |
| **市售優格當 starter** | Store-bought yogurt as starter | 方便；菌相未必為傳代最佳化，常數代後變弱 |

詳見 [04-starter-formats.md](./04-starter-formats.md)。

---

## 4. 法規／定義上的「優格菌」核心種

多個來源指出：在**美國等定義**下，稱為 yogurt 常要求含：

1. *Streptococcus thermophilus*（嗜熱鏈球菌）  
2. *Lactobacillus delbrueckii* subsp. *bulgaricus*（保加利亞乳桿菌）

兩者有**共生／proto-cooperation**：

- *S. thermophilus* 較早產酸，並可提供 formate、CO₂ 等，助 *L. bulgaricus*
- *L. bulgaricus* 蛋白質水解能力較強，釋出胜肽／胺基酸回饋 *S. thermophilus*
- pH 降至酪蛋白等電點附近（約 **pH 4.6**）時凝乳

**台灣相關筆記（來源：家酪優、本地衛教文）：**  
IDFA／部分國際定義強調上述兩菌；台灣未必用同一套「必須兩菌才叫優格」的標示規範。實務上市售品常再加 A／B／C 等機能菌。

物種細節見 [03-species-glossary.md](./03-species-glossary.md)。

---

## 5. 依「是否含酵母／真菌」分類

前四層都只看乳酸菌，但同一個溫區裡混著兩種本質不同的東西。這一層是**判斷一支菌能不能無限傳代、會不會產氣**的關鍵。

| 型別 | 組成 | 代表 | 特徵 |
|------|------|------|------|
| **純乳酸菌型** | 僅 LAB（多為分離菌株組合） | 一般優格菌粉、Filmjölk、台灣 MESO | 不產氣；direct-set 多屬此類，傳代數代後易失衡 |
| **含真菌／酵母型** | LAB + 酵母／黴菌 | Viili、Kefir、部分 matsoni | 風味較複雜；可能產 CO₂；群落有自我平衡結構，較耐傳代 |
| **SCOBY（顆粒／膠團）型** | LAB + 酵母包在多醣基質中 | Kefir grains | 顆粒本身可無限延續；粉狀替代品數批後衰退 |

實務上的意義：

- **看到「可無限傳代」的宣稱，先問它是不是含真菌／SCOBY。** 純由分離菌株組成的粉，通常沒有那個平衡結構。
- **產氣是分型線索。** 罐子鼓起、有氣泡感，指向含酵母（kefir、部分 viili）；純 LAB 優格通常不該明顯產氣。
- **黏絲（ropy）與含酵母無關**，那是特定乳球菌株的 EPS 能力，見 [02](./02-culture-profiles.md) B1。

Kefir 專節見 [05-kefir-and-scoby.md](./05-kefir-and-scoby.md)。

---

## 附錄：建議的知識架構（給本站）

```
Culture（菌種檔）
  ├─ temperatureClass: thermophilic | mesophilic
  ├─ reuseMode: heirloom | direct-set | commercial-yogurt
  ├─ cultureType: lab-only | lab-with-fungi | scoby   ← 第 5 層
  ├─ styleName: bulgarian | ayran | persis | viili-short | viili-long | amasi | langfil-short | ...
  └─ species[]: 學名列表

Method（製法）
  └─ heating / inoculation / incubation / straining / post-ripening

Batch（批次）
  └─ 連到 culture + method + 實際溫度／結果
```

## 附錄：待實測／待補洞

已由文獻／商品標示補上（2026-07-31）：

- [x] 台灣常溫菌粉（MESO）與北歐 Viili／Filmjölk **不同類**：MESO 是「優格兩菌 + 乳球菌」的 direct-set 混搭配方，北歐型是純乳球菌＋真菌的 heirloom。見 [02](./02-culture-profiles.md) C。
- [x] Skyr 家用有 **Short（嗜熱傳統）** 與 **Long（常溫黏絲變體）** 兩路；傳統需瀝乳 8–12 h。見 [02](./02-culture-profiles.md) A4。
- [x] 傳代衰退代數：分離菌株型約 **3–5 代**後明顯失衡；heirloom 可長期延續。見 [04](./04-starter-formats.md) 2。
- [x] 常見商品菌株對照（MESO／730／28）：見 [02](./02-culture-profiles.md) C。

仍待你實測：

- [ ] 你自己每支菌粉的實際凝固時間 ↔ 室溫曲線（台灣夏冬差異大）
- [ ] MESO 在台灣夏季室溫（>30°C）是否會因偏離 25°C 而變酸或離水
- [ ] 母種傳代的**主觀**衰退點：文獻說 3–5 代，你的批次實際在第幾代開始變稀
- [ ] Viili 若取得，觀察 ropy 是否隨保存溫度流失（EPS 質體不穩定，見 [02](./02-culture-profiles.md) B1）
