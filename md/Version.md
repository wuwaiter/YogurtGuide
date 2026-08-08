# Version History

## v0.1.0 — 2026-08-08

### Changes
- 將 64 筆菌種、製法、批次、詞彙與市售優格資料遷移為獨立 Markdown Content Collections。
- 以 Astro Zod schema 驗證欄位、enum、評分範圍與跨集合 reference。
- 頁面改用 `astro:content` 查詢與原生 Markdown 渲染，維持既有 35 條靜態路由。
- 移除 SQLite、Seed、資料庫初始化流程與 `marked` 相依套件。
