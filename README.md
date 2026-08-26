# YogurtGuide

優格製程筆記（Yogurt Process Notes）：以**菌種（culture）**與**製法（process）**為軸，記錄可對照、可重複的發酵實驗。

線上預覽（部署後）：https://wuwaiter.github.io/YogurtGuide/

| 路徑 | 用途 |
|------|------|
| `src/content.config.ts` | Content Collections 欄位、關聯與驗證規則 |
| `src/content/cultures/*.md` | 優格／發酵文化種類與說明 |
| `src/content/methods/*.md` | 製法資料與步驟 |
| `src/content/batches/*.md` | 批次實驗資料與觀察 |
| `src/content/glossary/*.md`、`src/content/market-yogurts/*.md` | 詞彙與市售優格資料 |
| `src/content/additives/*.md` | 添加物詳細資料 |
| `src/data/numbered-strains.ts` | 可追溯的編號菌株資料與來源 |
| `src/pages/pairing/index.astro` | 優格搭配的單品／組合資料與頁面 |

主要內容使用 Markdown；結構化欄位放在 frontmatter，正文直接使用 Markdown。編號菌株與搭配清單目前分別使用 TypeScript 與 Astro 內嵌資料。Astro 在建置時驗證 Content Collections 並產生靜態頁面，不需要 SQLite 或資料庫初始化。

## 本地開發

```sh
npm install
npx astro dev --background
```

背景伺服器可用 `npx astro dev status`、`npx astro dev logs`、`npx astro dev stop` 管理。網站路徑為 `http://localhost:4321/YogurtGuide/`，`YogurtGuide` 大小寫需一致。

## GitHub Pages

1. 推送到 `main`
2. Repo → **Settings → Pages** → Source 選 **GitHub Actions**
3. 等待 workflow 成功

設定：

- `site`: `https://wuwaiter.github.io`
- `base`: `/YogurtGuide/`
