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

## CI/CD（自動檢查與部署）

本機 `npm install` 一次後會裝好 Git hook：

1. `git commit` 會跑 `npm run test:ci`（至少一個 unit test，失敗就不能 commit）。
2. `git push` 會跑 gitignore 與安全掃描（失敗就不能 push）。
3. 推到 `main` 後，GitHub Actions 會再跑同一套檢查、建置，並部署到 **GitHub Pages** 與 **Cloudflare Pages**。兩邊路徑都是 `/YogurtGuide/`。

跳過本機 hook 可用 `git commit --no-verify` / `git push --no-verify`，但 GitHub 上的 Actions 仍會擋部署。

### 看結果

Repo → **Actions**。綠勾 = 通過。約 2–4 分鐘。

- GitHub：https://wuwaiter.github.io/YogurtGuide/
- Cloudflare：`https://yogurtguide.pages.dev/YogurtGuide/`（專案名是 `yogurtguide`；開根目錄會 404，要帶 `/YogurtGuide/`）

### 一次性設定（約 25 分鐘）

1. GitHub → **Settings → Pages** → Source 選 **GitHub Actions**。
2. Cloudflare Dashboard → **Workers & Pages** → 建立 Pages 專案，名稱 `yogurtguide`。**關掉 Git 自動建置**（由 GitHub Actions 上傳 `dist`，不要讓 Cloudflare 再 build 一次）。
3. Cloudflare → 建立 API Token（Account → Cloudflare Pages → Edit）與複製 Account ID。
4. GitHub repo → **Settings → Secrets and variables → Actions** 新增：
   - `CLOUDFLARE_API_TOKEN`
   - `CLOUDFLARE_ACCOUNT_ID`
5. 推到 `main`（或 Actions 裡手動跑 **Deploy**）。

`astro.config.mjs`：`site` 為 `https://wuwaiter.github.io`，`base` 為 `/YogurtGuide/`。不要為 Cloudflare 改掉 `base`。
