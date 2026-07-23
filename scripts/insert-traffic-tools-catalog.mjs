/**
 * Insert finance + traffic tools into catalog and reorder for search traffic.
 * Run: node scripts/insert-traffic-tools-catalog.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const FILE = path.join(ROOT, 'assets/js/tools-data.js');

const ORDER = [
  'toeic', 'toefl', 'finance', 'viral', 'creator', 'live', 'cosmos',
  'life', 'utility', 'editor', 'dev', 'media', 'fun', 'japan',
  'world', 'symbols', 'culture', 'spiritual', 'security',
];

const financeCategory = {
  id: 'finance',
  name: '理財計算機 Finance Lab',
  tagline: '台股手續費、殖利率、融資維持率與複利試算：高意圖搜尋一頁搞定。',
  tools: [
    {
      slug: 'stock-fee-calc',
      title: '台股手續費與證交稅試算',
      icon: 'bi-cash-coin',
      desc: '支援券商折扣與最低手續費，秒算買進賣出與來回成本。',
      seoTitle: '台股手續費計算器｜買賣成本與券商折扣試算',
      seoDescription: '免費台股手續費與證交稅試算：輸入成交金額、券商折扣與最低手續費，立即計算買進／賣出成本與來回總費用百分比。',
      seoKeywords: '台股手續費,證交稅試算,券商折扣,當沖成本,股票手續費計算',
      seoLead: '台股買賣手續費與證交稅一頁試算，支援券商折扣，幫你先算成本再下單。',
    },
    {
      slug: 'dividend-yield',
      title: '殖利率與除權息計算',
      icon: 'bi-percent',
      desc: '股價＋股利秒算殖利率與填息目標價，存股族必備。',
      seoTitle: '殖利率計算器｜除權息與填息目標價試算',
      seoDescription: '免費殖利率與除權息計算器：輸入股價與現金股利，立即算出現金殖利率、除息參考價與填息目標價，並估算股利收入。',
      seoKeywords: '殖利率計算,除權息,填息,現金股利,存股',
      seoLead: '輸入股價與股利，秒懂殖利率與填息目標，存股評估更清楚。',
    },
    {
      slug: 'margin-trading',
      title: '融資融券維持率試算',
      icon: 'bi-graph-down-arrow',
      desc: '估算維持率與追繳緩衝，控管斷頭風險。',
      seoTitle: '融資維持率試算｜追繳與斷頭風險估算',
      seoDescription: '免費融資維持率試算工具：輸入擔保品市值與融資金額，估算目前維持率、追繳臨界市值與緩衝空間，投資風險控管必備。',
      seoKeywords: '融資維持率,融券,追繳,斷頭,保證金',
      seoLead: '融資維持率與追繳緩衝快速估算，協助你提高風險意識。',
    },
    {
      slug: 'compound-interest',
      title: '定期定額複利試算',
      icon: 'bi-piggy-bank',
      desc: '每月投入＋年化報酬，估算期末本利與複利成長。',
      seoTitle: '複利計算器｜定期定額與ETF存股試算',
      seoDescription: '免費定期定額複利投資試算：設定每月投入、年化報酬與年數，估算總投入、期末資產與複利成長，適合小資與 ETF 存股規劃。',
      seoKeywords: '複利計算,定期定額,ETF存股,投資試算,複利公式',
      seoLead: '定期定額複利試算，把時間與報酬率變成看得見的期末資產。',
    },
  ],
};

const EXTRA_TOOLS = {
  life: [
    {
      slug: 'percentage-calculator',
      title: '百分比／漲跌幅計算器',
      icon: 'bi-calculator',
      desc: '快速計算百分比、漲跌幅與相對比例。',
      seoTitle: '百分比計算器｜漲跌幅與比例快速試算',
      seoDescription: '免費百分比與漲跌幅計算器：輸入兩個數值，立即算出 A 佔 B 百分比與漲跌幅，適合比價、成績與投資估算。',
      seoKeywords: '百分比計算,漲跌幅,比例計算,折扣計算',
      seoLead: '百分比與漲跌幅一秒算完，日常比價與投資估算都適用。',
    },
  ],
  editor: [
    {
      slug: 'line-break-remover',
      title: '去換行與多餘空白',
      icon: 'bi-text-wrap',
      desc: '整理 PDF／網頁複製文字的斷行與空白。',
      seoTitle: '去換行工具｜PDF複製文字自動合併段落',
      seoDescription: '免費線上去換行工具：貼上 PDF 或網頁複製的斷行文字，一鍵合併段落並壓縮多餘空白，方便貼到文件與社群。',
      seoKeywords: '去換行,去除空白,PDF文字整理,合併段落',
      seoLead: 'PDF 複製文字斷行？一鍵去換行、壓空白，貼上就能用。',
    },
  ],
  creator: [
    {
      slug: 'image-resizer',
      title: '社群封面／證件照縮放裁切',
      icon: 'bi-crop',
      desc: 'IG、YouTube、FB、證件照預設尺寸一鍵裁切。',
      seoTitle: '圖片尺寸裁切｜IG YouTube 證件照線上工具',
      seoDescription: '免費線上圖片縮放裁切：預設 IG、YouTube、FB 封面與證件照尺寸，瀏覽器內完成置中裁切並下載，免 Photoshop。',
      seoKeywords: '圖片裁切,IG尺寸,YouTube封面,證件照尺寸,線上縮圖',
      seoLead: '社群封面與證件照尺寸，線上選預設、裁切下載即用。',
    },
    {
      slug: 'heic-to-jpg',
      title: 'HEIC 轉 JPG',
      icon: 'bi-phone',
      desc: 'iPhone HEIC 轉通用 JPG，Windows 好開好傳。',
      seoTitle: 'HEIC轉JPG｜iPhone照片線上轉換工具',
      seoDescription: '免費 HEIC 轉 JPG 線上工具：把 iPhone 照片轉成 Windows 與網站通用的 JPG，檔案只在瀏覽器處理不上傳。',
      seoKeywords: 'HEIC轉JPG,iPhone照片,HEIF轉換,Windows開HEIC',
      seoLead: 'iPhone HEIC 轉 JPG，解決 Windows 打不開的痛點。',
    },
    {
      slug: 'svg-to-png',
      title: 'SVG 轉 PNG',
      icon: 'bi-filetype-png',
      desc: 'SVG 向量圖轉高解析 PNG，簡報社群可用。',
      seoTitle: 'SVG轉PNG｜向量圖線上輸出高解析PNG',
      seoDescription: '免費 SVG 轉 PNG 工具：貼上或上傳 SVG，設定寬度輸出透明背景高解析 PNG，適合簡報、網站與社群素材。',
      seoKeywords: 'SVG轉PNG,向量轉點陣,線上轉檔,透明PNG',
      seoLead: 'SVG 轉高解析 PNG，貼上原始碼或上傳即可下載。',
    },
  ],
};

/** Enrich existing high-traffic tools SEO if thin */
const SEO_PATCH = {
  'json-editor': {
    seoTitle: 'JSON格式化工具｜美化壓縮與驗證',
    seoDescription: '免費線上 JSON 格式化與美化／壓縮工具：貼上 JSON 立即排版、驗證錯誤，工程師每日剛需，資料留在瀏覽器。',
    seoKeywords: 'JSON格式化,JSON美化,JSON壓縮,JSON驗證,線上JSON',
  },
  'crontab-calc': {
    seoTitle: 'Cron表達式產生器｜排程語法產生與說明',
    seoDescription: '免費 Cron Job 排程表達式產生器：用選單組出正確 cron 語法並說明執行時間，解決記不住排程語法的痛點。',
    seoKeywords: 'Cron產生器,crontab,排程表達式,Linux cron',
  },
  'regex-test': {
    seoTitle: 'Regex正則測試｜常用正規表達式線上工具',
    seoDescription: '免費正則表達式 Regex 測試工具：即時比對、高亮結果，並提供常用範例，開發與文字處理必備。',
    seoKeywords: 'Regex測試,正則表達式,正規表示式,線上regex',
  },
  base64: {
    seoTitle: 'Base64編碼解碼｜文字與資料線上轉換',
    seoDescription: '免費 Base64 編碼／解碼工具：支援文字互轉，開發與傳輸資料常用，純前端處理更安心。',
    seoKeywords: 'Base64,編碼,解碼,Base64轉換',
  },
  wordcount: {
    seoTitle: '字數統計｜中英字數與閱讀時間估算',
    seoDescription: '免費線上字數統計：計算中英文字數、標點與行數，並估算閱讀時間，學生小編寫作必備。',
    seoKeywords: '字數統計,字數計算,閱讀時間,中英字數',
  },
  'ig-font-generator': {
    seoTitle: 'IG特殊字體產生器｜Threads花體字轉換',
    seoDescription: '免費 IG／Threads 特殊字體轉換器：輸入文字一鍵變成花體與裝飾字，適合社群貼文吸睛擴散。',
    seoKeywords: 'IG特殊字體,Threads字體,花體字,社群字體',
  },
  'markdown-to-html-cleaner': {
    seoTitle: 'Markdown轉HTML｜即時預覽與清理',
    seoDescription: '免費 Markdown 轉 HTML 工具：即時轉換並清理輸出，方便貼到部落格、Medium 或 CMS。',
    seoKeywords: 'Markdown轉HTML,MD轉HTML,Markdown預覽',
  },
  timestamp: {
    seoTitle: 'Unix時間戳轉換｜Timestamp與日期互轉',
    seoDescription: '免費 Unix Timestamp 時間戳記轉換器：秒／毫秒與日期時間互轉，工程師與 PM 常用線上工具。',
    seoKeywords: 'Timestamp,時間戳,Unix時間,日期轉換',
  },
  'image-compressor': {
    seoTitle: '線上圖片壓縮｜JPG PNG WebP瘦身',
    seoDescription: '免費線上圖片壓縮工具：在瀏覽器壓縮 JPG／PNG／WebP，縮小檔案加快上傳，不上傳伺服器更安心。',
    seoKeywords: '圖片壓縮,線上壓縮,WebP,JPG瘦身',
  },
  'lucky-draw': {
    seoTitle: '線上抽籤｜隨機抽獎與亂數產生',
    seoDescription: '免費線上抽籤與隨機亂數工具：適合活動抽獎、選餐點與分組，一鍵公平抽出結果。',
    seoKeywords: '線上抽籤,隨機抽獎,亂數產生器,抽獎工具',
  },
};

const src = fs.readFileSync(FILE, 'utf8');
const catalog = Function(`return ${src.replace(/^window\.WA_TOOLS_CATALOG\s*=\s*/, '').replace(/;\s*$/, '')}`)();
const byId = Object.fromEntries(catalog.map((c) => [c.id, c]));

byId.finance = financeCategory;

for (const [catId, tools] of Object.entries(EXTRA_TOOLS)) {
  if (!byId[catId]) continue;
  const have = new Set(byId[catId].tools.map((t) => t.slug));
  for (const t of tools) {
    if (!have.has(t.slug)) byId[catId].tools.unshift(t);
  }
}

for (const cat of Object.values(byId)) {
  for (const tool of cat.tools || []) {
    const patch = SEO_PATCH[tool.slug];
    if (!patch) continue;
    Object.assign(tool, patch);
  }
}

const ordered = [];
const used = new Set();
for (const id of ORDER) {
  if (byId[id]) {
    ordered.push(byId[id]);
    used.add(id);
  }
}
for (const c of catalog) {
  if (!used.has(c.id) && c.id !== 'finance') ordered.push(byId[c.id] || c);
}

fs.writeFileSync(FILE, `window.WA_TOOLS_CATALOG = ${JSON.stringify(ordered, null, 2)};\n`, 'utf8');
console.log('Order:', ordered.map((c) => c.id).join(' → '));
console.log('Finance tools:', financeCategory.tools.length);
