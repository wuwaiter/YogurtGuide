# YogurtGuide 知識庫（Knowledge Base）

本目錄存放從公開中英文資料整理而來的**參考知識**，供後續撰寫網站內容、菌種檔與批次對照使用。  
內容為綜合整理與筆記，**非正式學術引用稿**；細節請回原出處核對。

## 文件索引

| 檔案 | 內容 |
|------|------|
| [01-culture-taxonomy.md](./01-culture-taxonomy.md) | 菌種分類總覽（適溫 → 風格 → 反復接種 → 核心種 → 是否含酵母） |
| [02-culture-profiles.md](./02-culture-profiles.md) | 常見「產品型菌種」說明（Bulgarian、Greek、Skyr、Viili…）與台灣商品菌株對照 |
| [03-species-glossary.md](./03-species-glossary.md) | 常見乳酸菌物種中英對照與角色，含真菌／酵母 |
| [04-starter-formats.md](./04-starter-formats.md) | 菌種型態：母種／direct-set／市售優格；傳代衰退與保存 |
| [05-kefir-and-scoby.md](./05-kefir-and-scoby.md) | 克菲爾與 SCOBY 型發酵乳（與常溫優格的差異） |
| [06-market-yogurts.md](./06-market-yogurts.md) | 市售優格對照（★ 推薦條件、乳源／添加物／菌種） |
| [07-homemade-vs-commercial-cfu.md](./07-homemade-vs-commercial-cfu.md) | 自製 vs 市售活菌數（CFU）比較摘要 |
| [SOURCES.md](./SOURCES.md) | 來源清單與取用日期 |

## 網站對應

| 知識庫 | 網站路徑 | 資料來源 |
|--------|----------|----------|
| 01 分類總覽 + 02 風格檔 | `/cultures/` 與 `/cultures/<slug>/` | `src/content/cultures/*.md` |
| 03 物種 | `/cultures/species/` | 頁面內容（靜態） |
| 04 接種型態 | `/cultures/starters/` | 頁面內容（靜態） |
| 05 克菲爾 | 尚未上架（分類總覽 §5 已摘要） | — |
| 06 市售優格 | `/market/` | `src/content/market-yogurts/*.md` |
| 07 自製 vs 市售 CFU | 尚未上架（知識庫筆記） | — |
| SOURCES 製法補充 | `/methods/` | `src/content/methods/*.md` |

## 更新紀錄

- 2026-07-28：初版彙整；01 章節改為 適溫→風格→反復接種→核心種；同步上架網站菌種區。
- 2026-07-29：內容改由 SQLite／seed 驅動；移除 `src/content/`。
- 2026-07-31：第二輪查證。**修正 Matsoni 與 Caspian Sea Yogurt 的混用**（前者偏嗜熱、菌相不定，後者為常溫 *L. cremoris* 主導）；更新學名 *Lactococcus cremoris*（2021 升種）；補 Viili 真菌組成與 viilian、Skyr 實作參數、傳代衰退代數（3–5 代 vs heirloom）、台灣 MESO／730／28 菌株標示；01 新增第 5 層分類（是否含酵母／SCOBY）；新增 05 克菲爾章節。
- 2026-07-31（網站同步）：`seed-data.mjs` 拆成 `matsoni`（嗜熱）與 `caspian-sea`（常溫）；更新 Skyr／Viili／Filmjölk；`species`／`starters`／`cultures` 索引頁對齊知識庫。
- 2026-07-31：新增市售優格大類（`/market/`、`market_yogurts`、知識庫 06）；★ = 僅鮮乳或奶粉＋水＋菌種。
- 2026-08-01：新增常溫菌種 **Onaka**（fil＋bifido；≠ Japanese Caspian Sea）；來源 Arla／DIY starter。
- 2026-08-02：新增 [07-homemade-vs-commercial-cfu.md](./07-homemade-vs-commercial-cfu.md)；批次 B002（市售優格當母種、微波爐輔助發酵）。
- 2026-08-03：Skyr 拆成 Short（嗜熱傳統）／Long（常溫黏絲）；菌種總覽除風格外改橫式條列。
- 2026-08-03：布丁／優格狀對照補齊：新增 Amasi、Ayran、Persis；Viili／Långfil 拆 Short／Long；01／02／SOURCES 同步。
- 2026-08-04：製法新增瀝乳、常溫室溫發酵、凝態／攪拌、無優格機保溫變通；SOURCES 製法補充。
- 2026-08-04：製法新增野生水果引子馴化、跨界混搭商業引子（皆附安全鐵律）。
- 2026-08-08：網站資料由 SQLite／seed 遷移至全 Markdown Content Collections；既有路由不變。
