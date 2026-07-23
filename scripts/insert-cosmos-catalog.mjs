/**
 * Insert Cosmic Atlas category and reorder by search heat.
 * Run: node scripts/insert-cosmos-catalog.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { COSMOS_THEMES, COSMOS_CATALOG } from './data/cosmos-themes.mjs';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const FILE = path.join(ROOT, 'assets/js/tools-data.js');

const ORDER = [
  'toeic',
  'toefl',
  'cosmos',
  'live',
  'viral',
  'life',
  'utility',
  'creator',
  'japan',
  'fun',
  'media',
  'editor',
  'world',
  'symbols',
  'culture',
  'spiritual',
  'security',
  'dev',
];

/** Keep seoTitle roughly brand-friendly length */
const SHORT_SEO = {
  'cosmos-black-hole': '黑洞與事件視界｜奇點吸積盤宇宙圖鑑',
  'cosmos-jwst': '詹姆斯韋伯望遠鏡｜早期星系宇宙圖鑑',
  'cosmos-exoplanet': '繫外行星與外星生命｜宜居帶圖鑑',
  'cosmos-mars': '火星移民與星艦｜太空殖民宇宙圖鑑',
  'cosmos-artemis': '阿提米絲登月｜月球基地宇宙圖鑑',
  'cosmos-dark-matter': '暗物質與暗能量｜隱形宇宙圖鑑',
  'cosmos-big-bang': '大霹靂與宇宙膨脹｜起源宇宙圖鑑',
  'cosmos-neutron-star': '中子星脈衝星磁星｜極端天體圖鑑',
  'cosmos-supernova': '超新星與星塵｜元素誕生宇宙圖鑑',
  'cosmos-asteroid': '小行星與行星防禦｜DART任務圖鑑',
  'cosmos-gravitational-wave': '引力波天文書｜時空漣漪宇宙圖鑑',
  'cosmos-solar-storm': '太陽風暴與極光｜太空天氣圖鑑',
  'cosmos-andromeda': '銀河仙女座碰撞｜星系合併圖鑑',
  'cosmos-multiverse': '平行宇宙假說｜多重宇宙圖鑑',
  'cosmos-wormhole': '蟲洞與時空捷徑｜相對論圖鑑',
  'cosmos-frb': '快速射電暴 FRB｜毫秒閃光圖鑑',
  'cosmos-fate': '宇宙終極命運｜大凍結撕裂圖鑑',
  'cosmos-interstellar': '星際天體訪客｜奧陌陌宇宙圖鑑',
  'cosmos-mining': '太空採礦資源｜月球水冰圖鑑',
  'cosmos-dyson': '戴森球與文明等級｜卡爾達肖夫圖鑑',
};

const tools = COSMOS_THEMES.map((t) => ({
  slug: t.id,
  title: t.title,
  icon: t.icon || 'bi-stars',
  desc: t.desc,
  seoTitle: SHORT_SEO[t.id] || t.seoTitle,
  seoDescription: t.seoDescription,
  seoKeywords: t.seoKeywords,
  seoLead: t.seoLead,
}));

const cosmosCategory = {
  id: 'cosmos',
  name: COSMOS_CATALOG.name,
  tagline: COSMOS_CATALOG.tagline,
  tools,
};

const src = fs.readFileSync(FILE, 'utf8');
const catalog = Function(`return ${src.replace(/^window\.WA_TOOLS_CATALOG\s*=\s*/, '').replace(/;\s*$/, '')}`)();
const byId = Object.fromEntries(catalog.map((c) => [c.id, c]));
byId.cosmos = cosmosCategory;

const ordered = [];
const used = new Set();
for (const id of ORDER) {
  if (byId[id]) {
    ordered.push(byId[id]);
    used.add(id);
  }
}
for (const c of catalog) {
  if (!used.has(c.id) && c.id !== 'cosmos') ordered.push(c);
}

fs.writeFileSync(FILE, `window.WA_TOOLS_CATALOG = ${JSON.stringify(ordered, null, 2)};\n`, 'utf8');
console.log('Order:', ordered.map((c) => c.id).join(' → '));
console.log('Cosmos tools:', tools.length);
