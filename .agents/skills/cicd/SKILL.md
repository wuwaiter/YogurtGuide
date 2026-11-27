---
name: cicd
description: "不綁特定產品的 CI/CD：本機 commit 跑測試、push 跑 gitignore 與安全掃描；PR 跑跟部署相同的檢查但不部署；main 由部署平台自己建置部署，GitHub 只事後確認。使用者說 CI、CD、deploy、workflow、husky 時使用。"
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

`check:deploy`：gitignore、security、`test:ci`、建置。PR 與正式部署都跑這支，不要各寫一份。

遠端安裝用 `npm ci`，吃 lockfile。本機 `npm install` 只負責裝依賴與 husky。

Agent 在使用者說 commit 時，先跑 `test:ci`。不要自己 push。

## 遠端

| 事件 | Workflow | 做什麼 |
|---|---|---|
| pull request，或手動觸發 | `.github/workflows/ci.yml` | `gitleaks git`，然後 `check:deploy`、Playwright。不部署。同一個 PR 只留最新的一次 |
| push 到 `main`，或手動觸發 | `.github/workflows/deploy.yml`（Verify production） | 不建置、不部署；等正式網站的 `/build.json` 換成這次的 commit，15 分鐘沒換就失敗 |

`gitleaks git` 掃描完整 git 歷史，checkout 要設 `fetch-depth: 0`，否則只掃到最新一個 commit。下載的 gitleaks 壓縮檔用 `sha256sum -c` 核對 release 的雜湊值，升版時一起更新。不要用舊的 `gitleaks detect`。

gitleaks 只掃描、不對 PR 留言。不要用會留言的 gitleaks action：Dependabot 的 token 不能留言，留言失敗會讓整步失敗。Cloudflare 的建置不跑 gitleaks，只跑 `check:deploy`。

`main` 不跑 `ci.yml`：main 設了分支規則，必須走 PR、`check` 通過才能合併，合併前已經檢查過。部署平台（Cloudflare）建置時自己再跑一次 `check:deploy`，失敗就不上線。

各 job 設 `timeout-minutes`。正式環境相關的 `concurrency` 不要取消進行中的那次。

## 權限與 action

workflow 預設 `permissions: contents: read`。只有真的需要的 job 才加權限；目前沒有 workflow 需要額外權限。

第三方 action 釘 40 字元 commit SHA，同一行註解版號，例如 `actions/checkout@<sha> # v4`。不要用 `@v4` 這種可被改指的標籤。升級交給 Dependabot 的 `github-actions`。

部署只有 Cloudflare，憑證留在該平台：

- Cloudflare Workers：該專案的 Git 連線。Build command 用 `npm run check:deploy`，Deploy command 用 `npx wrangler deploy`。`wrangler` 寫在 `package.json`，不要每次抓最新版。API token 用 Cloudflare 自動產生的那枚，不要放進 GitHub secrets。

## 分支保護

GitHub repo → Settings → Branches → `main`：

- 用 Rulesets（ProtectMain）：必須走 PR；`check`（GitHub Actions）與 `Workers Builds: yogurtguide`（Cloudflare）都通過才能合併；分支要跟上 main。
- Bypass list 留空，擁有者也不能直接 push。改內容也是開分支、PR、合併。
- 不允許 force push，不允許刪除 `main`。

## 不要做

- 不要把 `.env`、憑證、API token 放進 repo 或 workflow 檔
- 不要在 GitHub workflow 裡部署；部署交給 Cloudflare 的 Git 連線，`deploy.yml` 只確認結果
- 不要讓沒有測試的 commit 通過
- 不要為了某一個產品改這份流程的順序（測試 → 安全 → 建置 → 部署）
- 不要用 `pull_request_target` 執行 PR 裡的程式
- `run` 不要把 PR 標題、內文或其他不可信輸入拼進 shell
