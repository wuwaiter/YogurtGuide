# 04 — 菌種型態與使用方式（Starter Formats）

---

## 1. 三種常見取得方式

| 類型 | 英文 | 優點 | 風險／成本 |
|------|------|------|------------|
| 凍乾菌粉（一次／數次） | Direct-set、單包 starter | 穩定、適合偶爾做 | 長期成本高；不宜當無限母種 |
| 可傳代菌種 | Heirloom、mother culture | 一次購入可長期用 | 需規律製作；易污染或衰退 |
| 市售原味優格 | Commercial yogurt as starter | 取得容易 | 菌相未必適傳代；常數代後變弱 |

工業對應詞：**DVS／DVI**（Direct Vat Set／Inoculation）= 高濃縮凍乾或冷凍菌，直接接種生產槽。

---

## 2. 母種（Mother culture）實務筆記

來自 DIY 與加工手冊的交叉重點：

- 傳代要固定：接種量、溫度、時間，否則多菌株比例會飄。
- 衛生優先：容器消毒；避免交叉污染（多種 heirloom 分開放）。
- 活性維護：heirloom 通常需較規律重做（有文建議約每週等級）。
- 暫停製作：有 DIY 經驗提到可冷凍小份保存短期（非萬能，需自行驗證）。

對 YogurtGuide 批次欄位：

- `cultureSource: mother` → `cultureOrigin` 寫「來自批次 B00X」
- `cultureSource: new-powder` → `cultureOrigin` 寫購買通路

---

## 3. 用市售優格當 starter

英文／中文教學共識摘要：

- 選 **原味、無糖、成分單純**、標示 live active cultures
- 避免果粒、大量香料／安定劑干擾變因
- 新鮮開封較佳
- 預期：**可做幾代，但常逐漸變稀／變慢**

---

## 4. 與溫度類別的組合（實用矩陣）

|  | Direct-set | Heirloom | 市售優格 |
|--|------------|----------|----------|
| Thermophilic | 最常見家用菌粉 | 保加利亞等可傳代粉／母種 | 多數原味優格 |
| Mesophilic | 較少但有 | Viili／Filmjölk／Matsoni／Piimä 常見 | 視產品（台灣較少標北歐風格） |

---

## 5. 接種量（Inoculation rate）概念

- 家用菌粉：多依「每包對多少升」  
- 用優格當 starter：常見體積比約 **2–5%** 等級（來源與配方差異大，以實測為準）  
- 工業：依菌濃縮度與目標產酸曲線設計，不可直接抄家用包

批次請一定寫清：**用了多少、對多少奶**。
