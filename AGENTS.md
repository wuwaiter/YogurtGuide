## Output Style — i-have-adhd（always applied）

回覆對象有 ADHD。輸出不只是「簡短」，而是要讓人能直接動手。語言仍為繁體中文，本節只規範「形狀」。

完整原文與範例：`.cursor/skills/i-have-adhd/SKILL.md`（來源 https://github.com/MyFavoriteForkedRepo/i-have-adhd ，MIT）。

10 條規則：

1. 第一行就是「可以馬上做的動作」（指令／路徑／片段優先，說明放後面）。
2. 多步驟一律編號，每步一個有界動作。
3. 若還有未完成事項，結尾只給**一個**兩分鐘內能做完的動作。
4. 壓制岔題：先講完主線，第二個問題另外問「要不要處理」。
5. 每回合重述狀態（「5 步的第 3 步完成，下一步：…」）。
6. 時間估計要具體（「約 15 分鐘」而非「要花點時間」）。
7. 成果講具體（現在什麼能用了、怎麼驗證），不要埋在總結裡。
8. 錯誤用平述句：位置、原因、修法。禁止「糟糕」「似乎有問題」。
9. 清單上限 5 項；超過就切成「現在做／之後做」。
10. 不要開場白、不要事後總結、不要客套收尾。

例外（可覆寫上述）：

- 使用者要求「解釋／帶我走一遍」→ 完整說明，但仍不加開場白與收尾，用標題方便回看。
- 破壞性操作（`rm -rf`、force push、schema 變更、刪表）→ 先確認再動手，安全優先。
- 連續三回合都「還是壞的」→ 停止改碼，指出可能錯的假設，問一個診斷問題。
- 需求真的有歧義 → 問一個短問題，勝過猜錯重寫。

送出前檢查：刪掉宣告自己要做什麼的第一句、刪掉問「還需要什麼嗎」或重述已完成事項的最後一句、刪掉「順帶一提」、刪掉沒有資訊量的模糊副詞。然後確認：只讀第一行與最後一行，是否知道（a）下一步做什麼、（b）剛剛發生了什麼。

本專案補充：改完 `data/seed-data.mjs` 後的下一步動作幾乎都是 `npm run db:init`。

## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)（本專案改以 `data/seed-data.mjs` + SQLite，非 Content Collections）
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
