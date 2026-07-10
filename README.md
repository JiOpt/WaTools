# WaTools

免安裝 挖工具，另含 **藏經閣**（國學經典閱讀）。靜態網站，部署至 [Firebase Hosting](https://firebase.google.com/docs/hosting)。

- 網站：<https://watoolio.web.app>（**v0.4**）
- Firebase 專案：`watoolio`

---

## 專案結構（精要）

| 路徑 | 用途 |
|------|------|
| `assets/img/` | 網站正式使用的 favicon、logo、Apple touch icon |
| `assets/icon/` | 圖示原始檔／備份（未直接引用於 HTML） |
| `assets/js/` | 工具目錄、藏經閣、全站腳本 |
| `assets/css/main.css` | 全站樣式（含藏經閣收折樣式） |
| `scripture/` | 藏經閣各經典頁面（由建置腳本產生） |
| `scripts/build-scriptures.mjs` | 從來源站抓取並產生經典 HTML |

> 網站 icon 慣例放在 `assets/img/`（或根目錄 `favicon.ico`），一般不用 `pic/` 這類資料夾。

---

## Firebase 部署

首次設定：

```bash
npm install -g firebase-tools
firebase login
firebase init hosting   # 選 WaTools 資料夾；public 目錄填 .
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

> `firebase.json` 已設定 `public: "."`，`scripts/` 等建置用檔案不會上傳。若更新經典內容，請先執行 `node scripts/build-scriptures.mjs` 再 deploy。更新頁面後可執行 `node scripts/generate-sitemap.mjs` 重新產生 `sitemap.xml`。

### 讓手機載入最新 JS/CSS（快取刷新）

全站靜態資源已加 **`?v=0.4`**（138 個 HTML）。手機一般重新整理即可，不必清快取。

**之後每次改 JS/CSS，請依序：**

1. 修改 `scripts/site-version.mjs` 與 `assets/js/main.js` 的 `WA_SITE_VERSION`（例如 `0.5`）
2. 執行 `node scripts/stamp-asset-version.mjs`（自動更新所有 HTML 的 `?v=`）
3. `firebase deploy --project watoolio`

頁尾顯示 `v0.4` 代表版本已更新。`main.js` 動態載入的腳本也會自動帶相同版本號。

---

## SEO

- `robots.txt`：允許爬蟲，指向 `sitemap.xml`
- `sitemap.xml`：137 個頁面（執行 `node scripts/generate-sitemap.mjs` 更新）
- 首頁、藏經閣、SEO Search：含 canonical、Open Graph、Twitter Card、Schema.org
- 經典內頁：重建時由 `scripts/seo-meta.mjs` 注入 SEO meta


## 版本更新

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
- 地藏經：**僅释文**內聯至段落；底部保留註解、譯文
- 金剛經：【解讀】【解說】內聯至章節

**地藏經修正**
- 建置腳本改為擷取整章內容（含偈頌 `scripture-verse`），释文對應更完整
- 修正收折內容空白（移除 CSS 隱藏首段落的規則）
- 收折標題統一為【释文】，避免重複經文首句
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
