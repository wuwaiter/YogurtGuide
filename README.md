# YogurtGuide

優格製程筆記（Yogurt Process Notes）：以**菌種（culture）**與**製法（process）**為軸，記錄可對照、可重複的發酵實驗。

線上預覽（部署後）：https://wuwaiter.github.io/YogurtGuide/

| 路徑 | 用途 |
|------|------|
| `src/content.config.ts` | Content Collections 欄位、關聯與驗證規則 |
| `src/content/cultures/*.md` | 菌種資料與說明 |
| `src/content/methods/*.md` | 製法資料與步驟 |
| `src/content/batches/*.md` | 批次實驗資料與觀察 |
| `src/content/glossary/*.md`、`market-yogurts/*.md` | 詞彙與市售優格資料 |
| `src/pages/pairing/` | 優格搭配（單品／組合） |

所有網站資料都使用 Markdown；結構化欄位放在 frontmatter，正文直接使用 Markdown。Astro 在建置時驗證並產生靜態頁面，不需要 SQLite 或資料庫初始化。

## 本地開發

```sh
npm install
npm run dev
```

## GitHub Pages

1. 推送到 `main`
2. Repo → **Settings → Pages** → Source 選 **GitHub Actions**
3. 等待 workflow 成功

設定：

- `site`: `https://wuwaiter.github.io`
- `base`: `/YogurtGuide/`
