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

## 新增批次實驗

Windows 可直接雙擊專案根目錄的 `新增批次.bat`：

1. 工具會開啟 `batch-input.txt` 範本。
2. 填寫資料，按 `Ctrl+S` 儲存並關閉記事本。
3. 回到批次視窗按任意鍵，工具會建立下一個 `src/content/batches/bNNN-YYYYMMDD.md`，並執行 `npm run build`。

也可以在終端機執行 `npm run batch:import`。若資料無法辨識，輸入內容會保留在 `batch-input.txt`，修正後再次執行即可。菌種格式支援：`市售優格（心樸優格 120ml）`、`菌粉（川秀60菌）`、`傳代（川秀60菌 傳代*2 60ml）`。

## GitHub Pages

1. 推送到 `main`
2. Repo → **Settings → Pages** → Source 選 **GitHub Actions**
3. 等待 workflow 成功

設定：

- `site`: `https://wuwaiter.github.io`
- `base`: `/YogurtGuide/`
