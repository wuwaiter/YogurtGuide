# Version History

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
