# YogurtGuide

優格製程筆記（Yogurt Process Notes）：以**菌種（culture）**與**製法（process）**為軸，記錄可對照、可重複的發酵實驗。

線上預覽（部署後）：https://wuwaiter.github.io/YogurtGuide/

## 內容結構

| 路徑 | 用途 |
|------|------|
| `src/content/cultures/` | 菌種檔 |
| `src/content/methods/` | 製法檔 |
| `src/content/batches/` | 批次實驗日誌 |
| `src/content/glossary/` | 中英詞彙 |

## 本地開發

```sh
npm install
npm run dev
```

建置：

```sh
npm run build
npm run preview
```

## GitHub Pages

1. 推送到 `main`
2. 在 GitHub repo → **Settings → Pages**，Source 選 **GitHub Actions**
3. 等待 workflow `Deploy to GitHub Pages` 成功

本站 `astro.config.mjs` 已設定：

- `site`: `https://wuwaiter.github.io`
- `base`: `/YogurtGuide`
