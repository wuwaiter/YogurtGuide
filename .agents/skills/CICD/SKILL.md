---
name: cicd
description: "不綁特定產品的 CI/CD：本機 commit 跑測試、push 跑 gitignore 與安全掃描；PR 與非 main 只跑 CI；main 才建置並部署。使用者說 CI、CD、deploy、workflow、husky 時使用。"
---

# CI/CD

三道關卡。指令名稱以 npm script 為準；沒有這些 script 的專案，換成該專案同等的測試、gitignore、秘密掃描，順序不要改。

## 本機

`npm install` 會裝 husky（`prepare`）。

| 時機 | Hook | 做什麼 | 失敗 |
|---|---|---|---|
| `git commit` | `.husky/pre-commit` | `npm run test:ci` | commit 不成立 |
| `git push` | `.husky/pre-push` | `npm run check:gitignore` 然後 `npm run check:security` | 不上傳 |

`test:ci`：`tests/` 至少要有一個測試檔，然後跑測試。沒有測試不能 commit。

`check:gitignore`：`.gitignore` 必須排除 `.env`、依賴目錄、建置產物、編輯器私有目錄。

`check:security`：已追蹤檔不能是 `.env`、憑證、私鑰；內容不能像 token、雲端 access key、private key。

Agent 在使用者說 commit 時，先跑 `test:ci`。不要自己 push。

## 遠端

| 事件 | Workflow | 做什麼 |
|---|---|---|
| pull request，或 push 到 main 以外的分支 | `.github/workflows/ci.yml` | 安裝依賴、`test:ci`。不部署 |
| push 到 `main`，或手動觸發 | `.github/workflows/deploy.yml` | 再跑 gitignore、security、秘密掃描、`test:ci`、建置，通過才部署 |

`main` 不跑 `ci.yml`（`branches-ignore: [main]`）。部署前的檢查在 `deploy.yml` 再做一次。

部署 job 依序：建置產物 → 上傳 → 各目標部署。靜態網站可同時走 GitHub Pages 與 Cloudflare Pages。Cloudflare 用 repo secrets：`CLOUDFLARE_API_TOKEN`、`CLOUDFLARE_ACCOUNT_ID`。專案名稱寫在該 repo 的 deploy 指令，不要寫死在這份 skill。

同一時間只保留一條正式部署（`concurrency`，不要取消進行中的那次）。

## 不要做

- 不要把 `.env`、憑證、API token 放進 repo 或 workflow 檔
- 不要在 `main` 的 CI workflow 裡部署；部署只放 `deploy.yml`
- 不要讓沒有測試的 commit 通過
- 不要為了某一個產品改這份流程的順序（測試 → 安全 → 建置 → 部署）
