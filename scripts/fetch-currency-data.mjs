/**
 * Parse ifreesite currency.htm + world-flags images + currency zh names.
 * Run: node scripts/fetch-currency-data.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { CURRENCY_ZH } from './world-flags-currencies-zh.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const SOURCE_URL = 'https://www.ifreesite.com/currency.htm';
const CACHE_HTML = path.join(__dirname, '_currency-ifree.html');
const FLAGS_DATA = path.join(ROOT, 'assets', 'js', 'world-flags-data.js');
const ISO_MAP = path.join(__dirname, 'iso3166-alpha.json');
const COUNTRIES_CACHE = path.join(__dirname, '_countries-tz.json');
const OUT = path.join(ROOT, 'assets', 'js', 'currency-data.js');

const REGION_IDS = {
  亞洲: 'asia',
  歐洲: 'europe',
  美洲: 'americas',
  大洋洲: 'oceania',
  非洲: 'africa',
};

/** ifreesite 標籤 → ISO3（小寫，對應 world-flags） */
const LABEL_ISO3 = {
  中國: 'chn',
  香港: 'hkg',
  澳門: 'mac',
  臺灣: 'twn',
  台湾: 'twn',
  日本: 'jpn',
  韓國: 'kor',
  南韓: 'kor',
  朝鮮: 'prk',
  北韓: 'prk',
  蒙古國: 'mng',
  蒙古: 'mng',
  越南: 'vnm',
  柬埔寨: 'khm',
  寮國: 'lao',
  老撾: 'lao',
  緬甸: 'mmr',
  泰國: 'tha',
  馬來西亞: 'mys',
  新加坡: 'sgp',
  汶萊: 'brn',
  印尼: 'idn',
  印度尼西亞: 'idn',
  東帝汶: 'tls',
  菲律賓: 'phl',
  印度: 'ind',
  尼泊爾: 'npl',
  不丹: 'btn',
  孟加拉: 'bgd',
  斯里蘭卡: 'lka',
  巴基斯坦: 'pak',
  馬爾地夫: 'mdv',
  馬爾代夫: 'mdv',
  阿富汗: 'afg',
  哈薩克: 'kaz',
  烏茲別克: 'uzb',
  土庫曼: 'tkm',
  吉爾吉斯: 'kgz',
  塔吉克: 'tjk',
  喬治亞: 'geo',
  格魯吉亞: 'geo',
  亞美尼亞: 'arm',
  亞塞拜然: 'aze',
  阿塞拜疆: 'aze',
  伊朗: 'irn',
  伊拉克: 'irq',
  科威特: 'kwt',
  沙烏地阿拉伯: 'sau',
  沙特阿拉伯: 'sau',
  巴林: 'bhr',
  卡達: 'qat',
  阿拉伯聯合大公國: 'are',
  阿拉伯聯合酋長國: 'are',
  阿曼: 'omn',
  葉門: 'yem',
  也門: 'yem',
  以色列: 'isr',
  巴勒斯坦: 'pse',
  敘利亞: 'syr',
  黎巴嫩: 'lbn',
  約旦: 'jor',
  英國: 'gbr',
  愛爾蘭: 'irl',
  法國: 'fra',
  荷蘭: 'nld',
  比利時: 'bel',
  西班牙: 'esp',
  葡萄牙: 'prt',
  安道爾: 'and',
  摩納哥: 'mco',
  德國: 'deu',
  盧森堡: 'lux',
  瑞士: 'che',
  列支敦士登: 'lie',
  列支敦斯登: 'lie',
  奧地利: 'aut',
  波蘭: 'pol',
  捷克: 'cze',
  斯洛伐克: 'svk',
  匈牙利: 'hun',
  義大利: 'ita',
  意大利: 'ita',
  梵蒂岡: 'vat',
  聖馬利諾: 'smr',
  馬爾他: 'mlt',
  賽普勒斯: 'cyp',
  塞浦路斯: 'cyp',
  希臘: 'grc',
  斯洛維尼亞: 'svn',
  斯洛文尼亞: 'svn',
  克羅埃西亞: 'hrv',
  克羅地亞: 'hrv',
  阿爾巴尼亞: 'alb',
  波士尼亞與赫塞哥維納: 'bih',
  波黑: 'bih',
  塞爾維亞: 'srb',
  蒙特內哥羅: 'mne',
  黑山: 'mne',
  北馬其頓: 'mkd',
  土耳其: 'tur',
  丹麥: 'dnk',
  芬蘭: 'fin',
  瑞典: 'swe',
  挪威: 'nor',
  冰島: 'isl',
  愛沙尼亞: 'est',
  拉脫維亞: 'lva',
  立陶宛: 'ltu',
  白俄羅斯: 'blr',
  烏克蘭: 'ukr',
  摩爾多瓦: 'mda',
  羅馬尼亞: 'rou',
  保加利亞: 'bgr',
  俄羅斯: 'rus',
  美國: 'usa',
  加拿大: 'can',
  墨西哥: 'mex',
  貝里斯: 'blz',
  伯利兹: 'blz',
  瓜地馬拉: 'gtm',
  危地馬拉: 'gtm',
  宏都拉斯: 'hnd',
  洪都拉斯: 'hnd',
  薩爾瓦多: 'slv',
  尼加拉瓜: 'nic',
  哥斯大黎加: 'cri',
  哥斯達黎加: 'cri',
  巴拿馬: 'pan',
  百慕達: 'bmu',
  巴哈馬: 'bhs',
  古巴: 'cub',
  牙買加: 'jam',
  海地: 'hti',
  多明尼加: 'dom',
  多米尼加: 'dom',
  開曼群島: 'cym',
  千里達及托巴哥: 'tto',
  千里達及多巴哥: 'tto',
  巴貝多: 'brb',
  巴巴多斯: 'brb',
  哥倫比亞: 'col',
  委內瑞拉: 'ven',
  蓋亞納: 'guy',
  蘇利南: 'sur',
  厄瓜多: 'ecu',
  厄瓜多爾: 'ecu',
  巴西: 'bra',
  巴拉圭: 'pry',
  秘魯: 'per',
  玻利維亞: 'bol',
  烏拉圭: 'ury',
  智利: 'chl',
  阿根廷: 'arg',
  澳洲: 'aus',
  澳大利亚: 'aus',
  紐西蘭: 'nzl',
  新西蘭: 'nzl',
  東加: 'ton',
  湯加: 'ton',
  薩摩亞: 'wsm',
  吐瓦魯: 'tuv',
  圖瓦盧: 'tuv',
  庫克群島: 'cok',
  帛琉: 'plw',
  帕勞: 'plw',
  馬紹爾群島: 'mhl',
  諾魯: 'nru',
  瑙魯: 'nru',
  密克羅尼西亞: 'fsm',
  吉里巴斯: 'kir',
  基里巴斯: 'kir',
  斐濟: 'fji',
  萬那杜: 'vut',
  瓦努阿圖: 'vut',
  所羅門群島: 'slb',
  索羅門群島: 'slb',
  巴布亞新幾內亞: 'png',
  巴布亞新畿內亞: 'png',
  埃及: 'egy',
  蘇丹: 'sdn',
  利比亞: 'lby',
  突尼西亞: 'tun',
  突尼斯: 'tun',
  阿爾及利亞: 'dza',
  摩洛哥: 'mar',
  厄利垂亞: 'eri',
  厄立特里亞: 'eri',
  吉布提: 'dji',
  吉布地: 'dji',
  衣索比亞: 'eth',
  埃塞俄比亚: 'eth',
  索馬利亞: 'som',
  索馬里: 'som',
  肯亞: 'ken',
  肯雅: 'ken',
  肯亞: 'ken',
  烏干達: 'uga',
  盧安達: 'rwa',
  盧旺達: 'rwa',
  蒲隆地: 'bdi',
  布隆迪: 'bdi',
  坦尚尼亞: 'tza',
  坦桑尼亞: 'tza',
  馬拉威: 'mwi',
  馬拉維: 'mwi',
  莫三比克: 'moz',
  莫桑比克: 'moz',
  葛摩: 'com',
  科摩羅: 'com',
  馬達加斯加: 'mdg',
  塞席爾: 'syc',
  塞舌爾: 'syc',
  模里西斯: 'mus',
  毛里裘斯: 'mus',
  毛里求斯: 'mus',
  佛德角: 'cpv',
  維德角: 'cpv',
  塞內加爾: 'sen',
  甘比亞: 'gmb',
  岡比亞: 'gmb',
  幾內亞比索: 'gnb',
  畿內亞比紹: 'gnb',
  幾內亞: 'gin',
  畿內亞: 'gin',
  獅子山: 'sle',
  塞拉利昂: 'sle',
  賴比瑞亞: 'lbr',
  利比里亞: 'lbr',
  茅利塔尼亞: 'mrt',
  毛里塔尼亞: 'mrt',
  馬利: 'mli',
  马里: 'mli',
  象牙海岸: 'civ',
  科特迪瓦: 'civ',
  布吉納法索: 'bfa',
  布基納法索: 'bfa',
  迦納: 'gha',
  加納: 'gha',
  多哥: 'tgo',
  貝南: 'ben',
  貝寧: 'ben',
  尼日: 'ner',
  尼日爾: 'ner',
  奈及利亞: 'nga',
  尼日利亞: 'nga',
  安哥拉: 'ago',
  辛巴威: 'zwe',
  津巴布韋: 'zwe',
  納米比亞: 'nam',
  波札那: 'bwa',
  博茨瓦納: 'bwa',
  賴索托: 'lso',
  萊索托: 'lso',
  史瓦濟蘭: 'swz',
  斯威士蘭: 'swz',
  南非: 'zaf',
  南非共和國: 'zaf',
  查德: 'tcd',
  乍得: 'tcd',
  喀麥隆: 'cmr',
  中非共和國: 'caf',
  赤道幾內亞: 'gnq',
  赤道畿內亞: 'gnq',
  加彭: 'gab',
  加蓬: 'gab',
  剛果共和國: 'cog',
  剛果民主共和國: 'cod',
  尚比亞: 'zmb',
  贊比亞: 'zmb',
};

function cleanText(raw) {
  return raw.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function cellText(raw) {
  return raw
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/\r/g, '')
    .trim();
}

function primaryCountryLabel(label) {
  const m = label.match(/^(.+?)\s*[（(]/);
  return (m ? m[1] : label).trim();
}

function splitCurrencyName(raw) {
  const parts = raw.split('\n').map((s) => s.trim()).filter(Boolean);
  return { nameZh: parts[0] || raw, nameEn: parts[1] || '' };
}

function loadFlagsData() {
  const src = fs.readFileSync(FLAGS_DATA, 'utf8');
  const sandbox = { window: {} };
  const wrapped = src.replace(/window\.WA_WORLD_FLAGS\s*=/, 'sandbox.window.WA_WORLD_FLAGS =');
  // eslint-disable-next-line no-new-func
  new Function('sandbox', wrapped)(sandbox);
  return sandbox.window.WA_WORLD_FLAGS;
}

function buildFlagIndex(flagsData) {
  const byIso3 = new Map();
  const byZh = new Map();
  for (const region of flagsData.regions || []) {
    for (const c of region.countries || []) {
      const iso3 = (c.code || '').toLowerCase();
      if (iso3) byIso3.set(iso3, c);
      if (c.nameZh) {
        byZh.set(c.nameZh, c);
        const short = c.nameZh.replace(/國$/, '');
        if (short !== c.nameZh) byZh.set(short, c);
      }
    }
  }
  return { byIso3, byZh };
}

function buildCountryIndex() {
  const isoMap = JSON.parse(fs.readFileSync(ISO_MAP, 'utf8'));
  const iso2To3 = {};
  Object.entries(isoMap).forEach(([iso3, iso2]) => {
    iso2To3[iso2.toLowerCase()] = iso3.toLowerCase();
  });
  const countries = JSON.parse(fs.readFileSync(COUNTRIES_CACHE, 'utf8'));
  const byZh = new Map();
  const byCurrency = new Map();
  countries.forEach((c) => {
    const iso3 = (c.iso3 || '').toLowerCase();
    const zh = c.translations?.['zh-CN'] || '';
    if (zh) byZh.set(zh, { iso3, iso2: (c.iso2 || '').toLowerCase() });
    const short = zh.replace(/国$/, '');
    if (short && short !== zh) byZh.set(short, { iso3, iso2: (c.iso2 || '').toLowerCase() });
    const cur = (c.currency || '').toUpperCase();
    if (cur && iso3 && !byCurrency.has(cur)) byCurrency.set(cur, iso3);
  });
  return { byZh, iso2To3, byCurrency };
}

function resolveFlag(countryLabel, code, flagIndex, countryIndex) {
  const primary = primaryCountryLabel(countryLabel);
  const keys = [primary, countryLabel.trim()];
  for (const key of keys) {
    if (LABEL_ISO3[key]) {
      const c = flagIndex.byIso3.get(LABEL_ISO3[key]);
      if (c) return { iso3: LABEL_ISO3[key], image: c.image, nameEn: c.nameEn };
    }
    const fc = flagIndex.byZh.get(key);
    if (fc) return { iso3: fc.code, image: fc.image, nameEn: fc.nameEn };
    const cc = countryIndex.byZh.get(key);
    if (cc) {
      const c = flagIndex.byIso3.get(cc.iso3);
      if (c) return { iso3: cc.iso3, image: c.image, nameEn: c.nameEn };
    }
  }
  // fallback: match currency code to a country in DB
  return { iso3: '', image: '', nameEn: '' };
}

function parseHtml(html) {
  const introMatch = html.match(/<p class="tbi">([\s\S]*?)<\/p>/i);
  const intro = introMatch ? cleanText(introMatch[1]) : '';

  const regions = [];
  const regionRe = /<div class="if_titlename">([\s\S]*?)<\/div>\s*<table[\s\S]*?class="if_tabletd">([\s\S]*?)<\/table>/gi;
  let rm;
  while ((rm = regionRe.exec(html)) !== null) {
    const label = cleanText(rm[1]);
    const id = REGION_IDS[label];
    if (!id) continue;
    const tableHtml = rm[2];
    const items = [];
    const rowRe = /<tr bgcolor="#(?:FFFFFF|F4F8FD)">([\s\S]*?)<\/tr>/gi;
    let row;
    while ((row = rowRe.exec(tableHtml)) !== null) {
      const cells = [...row[1].matchAll(/<div class="if_tabls[^"]*">\s*([\s\S]*?)\s*<\/div>/gi)];
      if (cells.length < 5) continue;
      const countryLabel = cellText(cells[0][1]);
      if (countryLabel === '國家地區' || !countryLabel) continue;
      const { nameZh, nameEn } = splitCurrencyName(cellText(cells[1][1]));
      const symbol = cellText(cells[2][1]);
      const code = cellText(cells[3][1]).toUpperCase();
      const subunit = cellText(cells[4][1]);
      if (!code || code.length !== 3) continue;
      items.push({
        countryLabel,
        countryShort: primaryCountryLabel(countryLabel),
        currencyZh: CURRENCY_ZH[code] || nameZh,
        currencyEn: nameEn,
        symbol: symbol || '',
        code,
        subunit: subunit || '',
      });
    }
    if (items.length) regions.push({ id, label, items });
  }
  return { intro, regions };
}

async function loadHtml() {
  if (fs.existsSync(CACHE_HTML)) {
    const age = Date.now() - fs.statSync(CACHE_HTML).mtimeMs;
    if (age < 7 * 86400000) return fs.readFileSync(CACHE_HTML, 'utf8');
  }
  const res = await fetch(SOURCE_URL);
  if (!res.ok) throw new Error(`Fetch failed ${res.status}`);
  const html = await res.text();
  fs.writeFileSync(CACHE_HTML, html);
  return html;
}

async function main() {
  const html = await loadHtml();
  const parsed = parseHtml(html);
  const flagIndex = buildFlagIndex(loadFlagsData());
  const countryIndex = buildCountryIndex();

  let withFlag = 0;
  parsed.regions.forEach((region) => {
    region.items.forEach((item) => {
      const flag = resolveFlag(item.countryLabel, item.code, flagIndex, countryIndex);
      item.iso3 = flag.iso3;
      item.flag = flag.image || '';
      item.countryEn = flag.nameEn || '';
      if (!item.flag && countryIndex.byCurrency.has(item.code)) {
        const iso3 = countryIndex.byCurrency.get(item.code);
        const c = flagIndex.byIso3.get(iso3);
        if (c) {
          item.iso3 = iso3;
          item.flag = c.image;
          if (!item.countryEn) item.countryEn = c.nameEn;
        }
      }
      if (item.flag) withFlag += 1;
    });
  });

  const total = parsed.regions.reduce((n, r) => n + r.items.length, 0);
  const codes = new Set();
  parsed.regions.forEach((r) => r.items.forEach((i) => codes.add(i.code)));

  const payload = {
    source: SOURCE_URL,
    updated: new Date().toISOString().slice(0, 10),
    intro: parsed.intro,
    baseSuggestions: ['TWD', 'USD', 'EUR', 'JPY', 'CNY', 'HKD'],
    stats: { entries: total, currencies: codes.size, withFlag },
    regions: parsed.regions,
  };

  const out = `/* Auto-generated by scripts/fetch-currency-data.mjs */\nwindow.WA_CURRENCY = ${JSON.stringify(payload, null, 2)};\n`;
  fs.writeFileSync(OUT, out, 'utf8');
  console.log(`Wrote ${OUT}`);
  console.log(`  entries=${total} currencies=${codes.size} withFlag=${withFlag}/${total}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
