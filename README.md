# YogurtGuide

優格製程筆記（Yogurt Process Notes）：以**菌種（culture）**與**製法（process）**為軸，記錄可對照、可重複的發酵實驗。

線上預覽（部署後）：https://wuwaiter.github.io/YogurtGuide/

## 資料存放（SQLite）

網站在 **建置時** 讀取 SQLite，再輸出靜態頁（適合 GitHub Pages）。

| 路徑 | 用途 |
|------|------|
| `data/schema.sql` | 資料表結構 |
| `data/seed-data.mjs` | **資料來源**（編輯這個來新增／修改） |
| `data/yogurtguide.db` | 由 `npm run db:init` 產生的資料庫 |
| `scripts/db-init.mjs` | 重建資料庫 |

```sh
npm run db:init   # 依 seed 重建 yogurtguide.db
```

`npm run dev` / `npm run build` 會自動先執行 `db:init`。

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
