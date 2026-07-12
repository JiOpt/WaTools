# Toolpian

免安裝 **toolpian** 線上工具，另含 **藏經閣**（國學經典閱讀）。靜態網站，部署至 [Firebase Hosting](https://firebase.google.com/docs/hosting)。

- 網站：<https://toolpian.com>（**v0.6.39**）
- 自訂網域：`toolpian.com`（GoDaddy 註冊，於 Firebase Hosting 綁定 DNS）
- Firebase 專案 ID：`watoolio`（Google 後台專案名；對外網域為 `toolpian.com`）

---

## 專案結構（精要）

| 路徑 | 用途 |
|------|------|
| `assets/img/` | 網站正式使用的 favicon、logo、Apple touch icon |
| `assets/icon/` | 圖示原始檔／備份（未直接引用於 HTML） |
| `assets/js/` | 工具目錄、藏經閣、全站腳本 |
| `assets/js/user-preferences.js` | 設定（主題、字體、繁簡等） |
| `assets/js/zh-variant.js` | 全站繁簡轉換（瀏覽器本地 OpenCC） |
| `assets/js/vendor/opencc-t2cn.js` | OpenCC 繁→簡字典（約 101 KB，選簡體時才載入） |
| `utility/settings.html` | 設定頁 |
| `assets/css/main.css` | 全站樣式（含藏經閣收折樣式） |
| `scripture/` | 藏經閣各經典頁面（由建置腳本產生） |
| `scripts/build-scriptures.mjs` | 從來源站抓取並產生經典 HTML |
| `sitemap.txt` | **本機**發布清單（一行一個 slug；註解以 `#` 開頭） |
| `assets/js/sitemap-published.js` | **正式站**讀取的發布清單（由建置腳本產生） |
| `index_plan.html` | 內部「工具發布計畫」頁（不對外部署） |
| `scripts/plan-dev-server.mjs` | 本機 plan 伺服器（讀寫 `sitemap.txt`） |
| `scripts/build-sitemap-js.mjs` | `sitemap.txt` → `sitemap-published.js` |

> 網站 icon 慣例放在 `assets/img/`（或根目錄 `favicon.ico`），一般不用 `pic/` 這類資料夾。

---

## 工具發布計畫（開放／隱藏）

以 **`sitemap.txt`** 為單一真相來源：檔案內的 **slug** 會出現在 **首頁工具目錄** 與 **左側網站地圖**。工具標題、圖示、分類仍來自 `assets/js/tools-data.js`；`sitemap.txt` 只決定「哪些工具要顯示」。

### 架構

```
index_plan.html 切換開放／隱藏
    ↓ 自動寫入（plan 伺服器或連結本機檔案）
sitemap.txt（本機編輯、Git 追蹤）
    ↓ npm run sitemap:build（plan 伺服器儲存時會自動執行）
assets/js/sitemap-published.js
    ↓ 正式站載入
首頁 index.html、左側網站地圖（訪客只看已開放工具）
```

| 環境 | 讀取來源 | 說明 |
|------|----------|------|
| **本機 plan 伺服器** | `sitemap.txt` | 切換後自動寫入並重建 `sitemap-published.js` |
| **本機 localhost** | `sitemap.txt` | 首頁與左側地圖依清單過濾；每 2 秒輪詢異動 |
| **正式站** | `sitemap-published.js` | 不部署 `sitemap.txt`、`index_plan.html` |

未開放的工具**不會**出現在首頁與左側地圖，但仍可直接開啟 `{slug}.html` 網址（方便本機開發）。

### 本機操作（推薦）

在專案根目錄：

```bash
npm run plan:serve
```

瀏覽器開啟 **http://127.0.0.1:3000/index_plan.html**

- 切換工具的「開放／隱藏」→ 約 0.3 秒後自動寫入 `sitemap.txt` 並重建 `sitemap-published.js`
- **已開放清單**、**不顯示清單**、左側網站地圖即時同步
- 在 VS Code 手改 `sitemap.txt` 也會在 plan 頁反映（約 2 秒輪詢）

預覽正式站效果：**http://127.0.0.1:3000/index.html**（同樣依 `sitemap.txt` 過濾）。

### 以 file:// 開啟 plan 頁

1. 開啟 `index_plan.html`（`file://`）
2. 第一次請按 **「連結 sitemap.txt」**，選專案根目錄的檔案並允許讀寫
3. 之後切換會自動寫入；亦可監聽 VS Code 的檔案異動

若出現「自動儲存失敗」，代表尚未連結檔案或未使用 plan 伺服器，請改用 `npm run plan:serve` 或手動「儲存 sitemap.txt」。

### 手動建置發布 JS

```bash
npm run sitemap:build
```

將目前 `sitemap.txt` 編譯為 `assets/js/sitemap-published.js`（deploy 前必做，除非剛用 plan 伺服器儲存過）。

### sitemap.txt 格式

```text
# Toolpian 發布清單
# updated: 2026-07-11T02:18:48.631Z

scriptures
world-flags
calculatortool
```

- 以 `#` 開頭為註解；空行略過
- 一行一個 slug（對應 `{slug}.html`）

### 部署注意

`firebase.json` 已忽略 `index_plan.html`、`sitemap.txt`，訪客無法存取 plan 頁與原始清單。

**deploy 前建議：**

1. 確認 `sitemap.txt` 內容正確
2. `npm run sitemap:build`（若未用 plan 伺服器自動建置）
3. 照常 `firebase deploy --project watoolio`

### 相關腳本與模組

| 檔案 | 用途 |
|------|------|
| `assets/js/plan-catalog.js` | plan 頁 UI、清單、自動儲存 |
| `assets/js/sitemap-file-sync.js` | 讀寫／輪詢 `sitemap.txt`（API、fetch、File System Access） |
| `assets/js/sitemap-manifest.js` | 載入清單、過濾目錄、本機輪詢 |
| `assets/js/catalog-render.js` | 首頁 `#tools-catalog` 渲染（僅顯示已開放工具） |
| `assets/js/site-sitemap.js` | 左側網站地圖（依發布清單過濾） |

---

## 設定與繁簡切換

路徑：**`/utility/settings.html`**（頁首「設定」）

偏好儲存在瀏覽器 `localStorage`（鍵名 `mytoolife-user-prefs`），套用至全站所有頁面，無需帳號。

| 項目 | 說明 |
|------|------|
| 深色模式 | 淺色／深色／跟隨系統 |
| 字體大小 | 小／中／大 |
| **繁簡中文** | 繁體（預設）或簡體；選簡體時以 OpenCC 在本地轉換頁面文字 |
| 行距、護眼色溫、縮放、無障礙 | 見設定頁各區塊 |

**繁簡切換運作方式**

- 網站原文為繁體；切換後**立即生效**，無需重新整理
- `prefs-boot.js` 在 `<head>` 提早套用 `data-zh-variant`，減少閃爍
- `main.js` 載入 `zh-variant.js`；動態插入的工具內容也會自動轉換
- 切回繁體會還原原文（`originalString` 快取於 DOM 節點）

相關模組：`user-preferences.js`、`zh-variant.js`、`prefs-boot.js`

---

## Firebase 部署

首次設定：

```bash
npm install -g firebase-tools
firebase login
firebase init hosting   # 選 Toolpian 資料夾；public 目錄填 .
firebase deploy --project watoolio
```

之後更新網站，在專案根目錄執行：

```bash
firebase deploy --project watoolio
```

僅部署 Hosting：

```bash
firebase deploy --only hosting --project watoolio
```

暫停對外服務（關閉 Hosting）：

```bash
firebase hosting:disable --project watoolio
```

### 自訂網域（toolpian.com）

1. [Firebase Console](https://console.firebase.google.com/) → 專案 `watoolio` → **Hosting** → **Add custom domain**
2. 輸入 `toolpian.com`（建議一併加入 `www.toolpian.com`）
3. 至 GoDaddy DNS 依 Firebase 指示設定 **TXT**（驗證）、**A**（根網域）、**CNAME**（`www` → `toolpian.com`）
4. 等待 Firebase 顯示 Connected 並完成 SSL 憑證

> Firebase 專案 ID 為 `watoolio`，與對外品牌網域 `toolpian.com` 不同，部署時請用 `--project watoolio`。

> `firebase.json` 已設定 `public: "."`，`scripts/`、`index_plan.html`、`sitemap.txt` 等不會上傳。若更新經典內容，請先執行 `node scripts/build-scriptures.mjs` 再 deploy。更新頁面後可執行 `node scripts/generate-sitemap.mjs` 重新產生 `sitemap.xml`（SEO 用，與工具發布清單 `sitemap.txt` 不同）。**deploy 前請確認已執行 `npm run sitemap:build`**（或透過 `npm run plan:serve` 儲存時自動建置）。

### 讓手機載入最新 JS/CSS（快取刷新）

全站靜態資源以 **`?v=版本號`** 標記（138 個 HTML）。手機一般重新整理即可。

**版本號規則**

| 階段 | 格式 | 範例 |
|------|------|------|
| 上市前 | `0.6.x`，只改**第三位** | 0.6.1 → 0.6.2 → 0.6.3 |
| 正式上線 | `1.0` | — |

**唯一來源：** `scripts/site-version.mjs` 的 `WA_SITE_VERSION`（請自行指定下一版，勿自動跳號）。

**發佈前依序：**

1. 修改 `scripts/site-version.mjs` 的版本（例如 `0.6.2`）
2. 執行 `node scripts/stamp-asset-version.mjs`（同步 HTML 的 `?v=` 與 `main.js`）
3. `firebase deploy --project watoolio`

頁尾顯示 `v0.6.x` 代表已更新。`main.js` 動態載入的腳本會帶相同版本號。

---

## SEO

- `robots.txt`：允許爬蟲，指向 `sitemap.xml`
- `sitemap.xml`：137 個頁面（執行 `node scripts/generate-sitemap.mjs` 更新）
- 首頁、藏經閣、SEO Search：含 canonical、Open Graph、Twitter Card、Schema.org
- 經典內頁：重建時由 `scripts/seo-meta.mjs` 注入 SEO meta


## 版本更新

### v0.6.38（2026-07-11）

**個人化與繁簡**
- 設定頁新增「繁簡中文」：繁體／簡體即時切換，偏好存於 `localStorage`
- 新增 `zh-variant.js` + `vendor/opencc-t2cn.js`（OpenCC 本地轉換，選簡體時才載入）
- `prefs-boot.js`、`user-preferences.js`、`main.js` 串接 `data-zh-variant`

**首頁與頁尾**
- 首頁移除 hero 區塊，直接顯示工具目錄
- 全站頁尾標語改為「讓工具，簡化每一天。」

### v0.6.28–0.6.33（2026-07-11）

**工具發布計畫**
- 新增 `index_plan.html`：切換工具開放／隱藏，同步 **已開放／不顯示清單** 與左側網站地圖
- 以 `sitemap.txt` 為本機發布清單；`npm run plan:serve` 自動讀寫並重建 `sitemap-published.js`
- `file://` 模式可「連結 sitemap.txt」直接寫入本機檔案；支援 VS Code 手改後輪詢同步
- 正式站只讀 `sitemap-published.js`；`firebase.json` 不部署 plan 頁與 `sitemap.txt`

**首頁與導覽**
- 本機 localhost 與正式站：首頁、左側地圖依發布清單過濾（不再本機顯示全部工具）
- 首頁工具卡片精簡：移除分類副標題與卡片描述，只保留圖示＋名稱
- 修正左側地圖載入：`main.js` 不重複注入腳本、`Array.flat` 相容性、manifest 重複初始化

**npm scripts**
- `plan:serve` — 本機靜態站 + plan API（`PUT/GET /api/sitemap`）
- `sitemap:build` — `sitemap.txt` → `sitemap-published.js`

### v0.6.1（2026-07-10）

**全站**
- 左側網站地圖（電腦固定側欄；手機「目錄」抽屜）
- 版本改為 `0.6.x` 第三位遞增；唯一來源 `scripts/site-version.mjs`

### v0.4（2026-07-10）

**全站**
- JS/CSS 加 `?v=0.4` 快取刷新；HTML 不快取（`firebase.json`）
- 全站嵌入 GA4 Analytics（`scripts/site-analytics.mjs`）
- 工具／藏經卡片版面調整

**世界旗幟**
- 239 國旗幟、區域篩選、底部詳情、結構化國家說明
- 首都 `中文(English)`、貨幣中文＋美金匯率、代碼併入中文名稱

**建置腳本**
- `stamp-asset-version.mjs`、`stamp-analytics.mjs`
- `fetch-world-flags.mjs`、`enrich-world-flags-desc.mjs`

### v0.3（2026-07-10）

**全站**
- 頁尾顯示版本號 `v0.3`（`assets/js/main.js` 的 `WA_SITE_VERSION`）
- 更新 favicon、logo、Apple touch icon（`assets/img/`）

**藏經閣**
- 17 部經典上線（諸子百家、國學啟蒙、佛經），Firebase Hosting 部署
- 全站「智慧藏經閣」更名為「藏經閣」
- 移除經文內「上一段／下一段」導覽

**內聯註解（正文收折）**
- 三字經、弟子規、千字文、孫子兵法、道德經、三十六計、金剛經、心經等：頁尾註解改為正文旁收折
- 地藏經：**僅釋文**內聯至段落；底部保留註解、譯文
- 金剛經：【解讀】【解說】內聯至章節

**地藏經修正**
- 建置腳本改為擷取整章內容（含偈頌 `scripture-verse`），釋文對應更完整
- 修正收折內容空白（移除 CSS 隱藏首段落的規則）
- 收折標題統一為【釋文】，避免重複經文首句
- 底部「解讀補充」去除與標題重複的 `<h2>`

**佛咒語**
- 移除無效的本地音檔連結（`music/heart-of-shurangama-mantra.mp3`）

**建置腳本**
- `scripts/build-scriptures.mjs`：支援多種內聯合併模式（`dizang-multi`、`jingang` 等）
- 自動略過來源站無效的 `music/` 連結
- 經典頁面頁尾帶 `v0.3` 標示

**SEO**
- 新增 `robots.txt`、`sitemap.xml`（137 頁）
- 首頁、藏經閣：Open Graph、Schema.org
- SEO Search 工具：收錄／反鏈查詢連結、robots / sitemap 檢測
