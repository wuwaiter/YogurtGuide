# Version History

## v0.3.0 — 2026-08-09

### Changes
- 將 Milk Kefir 與 Water Kefir 拆分為兩筆獨立菌種資料與頁面。
- 以現行市場常見名稱、販售形式與購買辨識為主，補充雪蓮菌俗名的混用風險。
- 新增美國、德國、中亞及中東的菌粒、starter 與瓶裝 Kefir 市場例證。

## v0.2.1 — 2026-08-09

### Changes
- 擴充 Kefir 的北高加索、中國西藏與新疆歷史、菌相及製程差異。
- 補充新疆小河古 Kefir 奶酪的東亞傳播證據，並區分天山 tibicos 水克菲爾。

## v0.2.0 — 2026-08-09

### Changes
- 新增 Kefir（克菲爾／牛奶克菲爾）菌種介紹、菌相、製作條件與傳代說明。
- 菌種詳情頁新增 kefir grains 型態標籤。

## v0.1.2 — 2026-08-08

### Changes
- 移除空目錄、建置產物，以及與本專案無關或不再使用的開發工具設定。
- 更新 i-have-adhd Skill，將舊 SQLite Seed 流程改為 Markdown Content Collections 建置流程。

## v0.1.1 — 2026-08-08

### Changes
- 移除未參與網站建置的知識庫研究筆記與舊 SQLite 占位目錄。
- 清理 Astro 與 pnpm 的本機快取，不影響網站內容與路由。

## v0.1.0 — 2026-08-08

### Changes
- 將 64 筆菌種、製法、批次、詞彙與市售優格資料遷移為獨立 Markdown Content Collections。
- 以 Astro Zod schema 驗證欄位、enum、評分範圍與跨集合 reference。
- 頁面改用 `astro:content` 查詢與原生 Markdown 渲染，維持既有 35 條靜態路由。
- 移除 SQLite、Seed、資料庫初始化流程與 `marked` 相依套件。
