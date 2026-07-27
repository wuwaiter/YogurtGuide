---
# 複製此檔到 src/content/batches/，改名為 b002-....md，再填寫 frontmatter。
# 檔名建議：b002-簡短英文描述.md
# 正文（--- 下方）可寫 Observation / Next Trial。

title: 批次 B00X — 標題
titleEn: Batch B00X — Title
date: 2026-07-28

# 1. 日期及溫度（°C，字串即可）
ambientTempC: "28"          # 當日室溫（可省略）
peakHeatC: "88"             # 加熱高峰（可省略）
inoculationTempC: "42"      # 接種溫度
incubationTempC: "42"       # 保溫發酵溫度
incubationTimeH: "6"        # 發酵時數

# 2. 器材
equipment:
  - 探針溫度計
  - 厚底鍋
  - 優格機

# 3. 食材與份量（type: fresh-milk | milk-powder | water | other）
ingredients:
  - type: fresh-milk
    brand: 品牌名稱
    amount: 1000 ml
    note: 可選備註
  # - type: milk-powder
  #   brand: 品牌名稱
  #   amount: 50 g

# 4. 菌種
# cultureSource: mother | new-powder | commercial-yogurt | other
cultureSource: new-powder
cultureName: 菌粉／母種名稱
cultureOrigin: 購買通路，或母種來自哪一批次（例如 B001）
cultureAmount: 接種量（例如 1 包、2%、50 g）
# culture: bulgarian-thermophilic   # 可選，連到菌種檔
# method: pasteurized-inoculation   # 可選，連到製法檔

# 5. 成品狀況
resultSet: 凝乳是否完成、強度如何
resultAcidity: 酸度觀察
resultTexture: 質地
resultWhey: 乳清分離
resultFlavor: 風味
resultOverall: 總評（可省略）

# scoreReproducibility: 4
# scoreSatisfaction: 4
draft: false
---

## Observation（觀察）

（寫這次學到什麼）

## Next Trial（下次調整）

- （下次要改哪個變因）
