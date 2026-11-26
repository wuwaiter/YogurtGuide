## Output Style（always applied）

每次回覆前先讀 `.agents/skills/i-have-adhd/SKILL.md` 並照做。

## 版本管理

功能變更、規則變更、架構調整後，commit 前更新 `md/Version.md`。最新一筆放在 `# Version History` 下面的最上方。

```markdown
## vX.Y.Z — YYYY-MM-DD

### Changes
- 做了什麼、為什麼。
```

Patch 用於文件與小修正。Minor 用於新功能或結構調整。Major 用於破壞性變更。

## 網站

正式網址在 Cloudflare : `https://yogurtguide.wuwaiter.com/`。
本機與 GitHub Pages 的 `base` 是 `/YogurtGuide/`。
Cloudflare 建置設了 `WORKERS_CI=1` 時，`base` 是 `/`。
本機預覽是 `http://localhost:4321/YogurtGuide/`。

不要把 Cloudflare API token 放進 GitHub secrets。

## 內容 

頁面讀 `src/content/**/*.md`。改這些檔之後執行 `npm run build`。

批次來源是 `src/content/batches/*.md`。每筆要寫 `result: "OK"` 或 `"NG"`（成功／失敗）；凝乳 5 分以下（10 分制）一定寫 NG，測試會檢查。NG 不算進平均。`npm run batch:sqlite` 只從 Markdown 重建 `data/*.sqlite`（不進版控，要用時自己重建）。頁面不讀 SQLite。

菌粉頁不放店名與連結。沒有評價寫「沒有評價資訊」，沒有菌種寫「沒有菌種資訊」。價格只留金額、幣別、單位、日期。

隔夜燕麥的份量不明時 `amount`、`unit` 都不寫；寫了 `amount` 就要有 `unit`，範圍用 `amountMax`。單位只能是 `g`、`ml`、`顆`、`湯匙`。寫錯 `npm run build` 會失敗。

App 第 2 階段要讀的清單資料是建置產出的 `app-content/v1/*.json`（目前有 `batches.json`，規格見 `md/AppPlan.md`）。改內容仍改 Markdown，不要手改 `dist/`。

這一期是網站與 Android。Android 用 Capacitor 包網站：`npm run app:sync` 建置 App 版並同步到 `android/`，`npm run app:debug` 出 debug APK，`npm run app:bundle` 出上架用 AAB。建置需要 JDK 21（本機在 `C:\Users\wuwai\jdk-21`，執行前設 `JAVA_HOME`）。`android/local.properties` 的 `sdk.dir` 用正斜線。
App 版建置設 `CAP_BUILD=1`，`base` 是 `/`，輸出到 `dist-app/`，站內連結改寫成 `.../index.html`。
內容更新靠 Live Update，不必重新上架：`check:deploy` 最後跑 `npm run app:publish`，把 App 版壓成 `dist/app-bundle/<commit>.zip` 並寫 `latest.json`；App 在冷啟動、從背景回來（隔 5 分鐘以上）、首頁下拉時檢查，下載完顯示「有新內容，點這裡更新」，點了立刻生效，沒點就下次開 App 生效。規則在 `src/lib/live-update.mjs`，畫面在 `src/components/AppLiveUpdate.astro`。
網站部署是一個 Cloudflare Worker：靜態檔（`dist/`）直接回傳，`worker/index.mjs`（實作在 `worker/handlers.mjs`）只處理 `/weather.json`（KV，排程每小時抓一組城市的 MET Norway 預報，每個城市每 3 小時一次）與 Live Update 的 `/app-bundle/<id>/?href=`（只下載有變的檔案，帶 X-Checksum／X-Signature）。Worker 入口只能匯出 handler。天氣來源是 MET Norway（NLOD 2.0／CC BY 4.0，可商用）：要帶識別用 User-Agent，同一城市最多每 3 小時抓一次。天氣城市清單在 `src/data/weather-cities.mjs`，不要改舊 id；城市數 ÷ 3 要低於 50（Workers 免費方案每次執行的對外請求上限）。顯示天氣的地方要放「Data from MET Norway」連結。
Live Update 網頁包有簽章：App 內建公鑰（`capacitor.config.json` 的 `LiveUpdate.publicKey`），只收用對應私鑰簽過的包。私鑰只在建置時從環境變數讀（Cloudflare 建置變數 `LIVE_UPDATE_PRIVATE_KEY_B64`，或本機 `LIVE_UPDATE_PRIVATE_KEY_FILE`），不進 repo、不放 GitHub secrets；Cloudflare 建置缺私鑰會失敗。換鑰匙＝改公鑰＝原生改動。
本機建置的 `build.json` 在有未 commit 改動時是 `<commit>-dirty`。
網頁畫面測試用 Playwright（`e2e/*.pw.mjs`，`npm run test:e2e`，要先跑過 `check:deploy`），CI 會跑。
新增 Capacitor 外掛、改權限或圖示這類原生改動，要把 `src/config/platforms.ts` 的 `nativeBuild` 與 `android/app/build.gradle` 的 `versionCode` 一起加 1 並重新上架。
「我的紀錄」只改 `src/lib/records/store.ts`：只用 SQLite 外掛（網站版顯示請用 App）；移除 App 或清除資料就會消失。新增 Capacitor 外掛要同時補授權頁、跑 `app:sync` 並 commit `android/` 的外掛清單，CI 會檢查。
發酵提醒規則在 `src/lib/records/reminders.mjs`（紀錄存檔時自動排／取消）；第一次開啟的引導在 `src/components/AppOnboarding.astro`，文字在 `src/lib/onboarding.mjs`。
keystore（`*.jks`、`*.keystore`）與 `android/key.properties` 不進版控。iOS 不要執行 `cap add ios`。

