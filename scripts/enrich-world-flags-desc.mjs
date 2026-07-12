import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { CULTURE } from './world-flags-culture-data.mjs';
import { CURRENCY_ZH } from './world-flags-currencies-zh.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const OUT_DATA = path.join(ROOT, 'assets', 'js', 'world-flags-data.js');
const CAPTION_CACHE = path.join(__dirname, '_world-source.html');

const CODE_ALIASES = {
  uar: 'are',
  mk: 'mkd',
  'mk/mkd': 'mkd',
};

const SUBREGION_ALIASES = {
  'North America': 'Northern America',
};

const REGION_ZH = {
  Asia: '亞洲',
  Europe: '歐洲',
  Africa: '非洲',
  Americas: '美洲',
  Oceania: '大洋洲',
  Antarctic: '南極洲',
};

const SUBREGION_ZH = {
  'Eastern Asia': '東亞',
  'South-Eastern Asia': '東南亞',
  'Southern Asia': '南亞',
  'Central Asia': '中亞',
  'Western Asia': '西亞',
  'Northern Europe': '北歐',
  'Western Europe': '西歐',
  'Eastern Europe': '東歐',
  'Southern Europe': '南歐',
  'Northern Africa': '北非',
  'Eastern Africa': '東非',
  'Middle Africa': '中非',
  'Southern Africa': '南非',
  'Western Africa': '西非',
  'Northern America': '北美',
  'Central America': '中美',
  'Caribbean': '加勒比海',
  'South America': '南美',
  'Australia and New Zealand': '澳紐',
  'Melanesia': '美拉尼西亞',
  'Micronesia': '密克羅尼西亞',
  'Polynesia': '玻里尼西亞',
};

const SUBREGION_CLIMATE = {
  'Eastern Asia': '溫帶至亞熱帶季風氣候為主',
  'South-Eastern Asia': '熱帶、季風氣候',
  'Southern Asia': '熱帶季風至乾燥氣候',
  'Central Asia': '大陸性乾燥、溫帶氣候',
  'Western Asia': '乾燥至地中海型氣候',
  'Northern Europe': '溫帶海洋性氣候',
  'Western Europe': '溫帶海洋性、地中海氣候',
  'Eastern Europe': '溫帶大陸性氣候',
  'Southern Europe': '地中海型氣候',
  'Northern Africa': '地中海、沙漠氣候',
  'Eastern Africa': '熱帶草原、高原氣候',
  'Middle Africa': '熱帶雨林、草原氣候',
  'Southern Africa': '亞熱帶至熱帶氣候',
  'Western Africa': '熱帶草原、雨林氣候',
  'Northern America': '溫帶、副熱帶至寒帶多樣',
  'Central America': '熱帶、季風氣候',
  Caribbean: '熱帶海洋性氣候',
  'South America': '熱帶雨林至溫帶多樣',
  'Australia and New Zealand': '乾燥至溫帶海洋性',
  Melanesia: '熱帶海洋性氣候',
  Micronesia: '熱帶海洋性氣候',
  Polynesia: '熱帶海洋性氣候',
};

const SUBREGION_INDUSTRY = {
  'Eastern Asia': '製造、出口、科技與服務業',
  'South-Eastern Asia': '製造、農業、觀光',
  'Southern Asia': '農業、IT服務、紡織',
  'Central Asia': '能源、礦產、畜牧',
  'Western Asia': '能源、石化、貿易',
  'Northern Europe': '科技、航運、能源',
  'Western Europe': '金融、製造、觀光',
  'Eastern Europe': '製造、農業、能源',
  'Southern Europe': '觀光、農業、製造',
  'Northern Africa': '能源、磷礦、觀光',
  'Eastern Africa': '農業、觀光、礦產',
  'Middle Africa': '礦產、林業、農業',
  'Southern Africa': '礦業、觀光、農業',
  'Western Africa': '可可、石油、農業',
  'Northern America': '金融、科技、能源、製造',
  'Central America': '農業、觀光、輕工業',
  Caribbean: '觀光、金融、農業',
  'South America': '農礦出口、能源、觀光',
  'Australia and New Zealand': '礦產、農牧、教育、觀光',
  Melanesia: '農漁、礦產、觀光',
  Micronesia: '漁業、觀光、外援',
  Polynesia: '漁業、觀光',
};

const SUBREGION_CULTURE = {
  'Eastern Asia': { religion: '儒家、佛教、民間信仰影響深', food: '米食與茶文化為常見飲食型態' },
  'South-Eastern Asia': { religion: '佛教、伊斯蘭、天主教等多元', food: '香料、椰漿、米食料理常見' },
  'Southern Asia': { religion: '印度教、伊斯蘭、佛教等並存', food: '咖喱、烤餅、米飯料理為代表' },
  'Central Asia': { religion: '伊斯蘭教為主', food: '麵食、羊肉料理常見' },
  'Western Asia': { religion: '伊斯蘭教為主，部分基督教社群', food: '烤肉、薄餅、堅果甜點常見' },
  'Northern Europe': { religion: '基督教傳統，世俗化程度高', food: '海鮮、黑麵包、乳製品' },
  'Western Europe': { religion: '天主教或新教文化底蘊', food: '葡萄酒、起司、烘焙點心' },
  'Eastern Europe': { religion: '東正教、天主教影響深', food: '黑麥、馬鈴薯、燉煮料理' },
  'Southern Europe': { religion: '天主教文化為主', food: '橄欖油、海鮮、地中海飲食' },
  'Northern Africa': { religion: '伊斯蘭教為主', food: '庫斯庫斯、塔吉鍋等北非料理' },
  'Eastern Africa': { religion: '基督教、伊斯蘭與傳統信仰並存', food: '玉米、豆類、燉菜常見' },
  'Middle Africa': { religion: '基督教、伊斯蘭、傳統信仰並存', food: '木薯、香蕉、燉煮料理' },
  'Southern Africa': { religion: '基督教為主，傳統信仰並存', food: '玉米粉、烤肉文化' },
  'Western Africa': { religion: '伊斯蘭、基督教、傳統信仰並存', food: '木薯、花生、燉飯' },
  'Northern America': { religion: '基督教比例高，多元世俗社會', food: '烤肉、快餐與移民菜系' },
  'Central America': { religion: '天主教為主', food: '玉米、豆類、塔可類料理' },
  Caribbean: { religion: '天主教、基督教與多元信仰', food: '海鮮、香料、熱帶水果' },
  'South America': { religion: '天主教為主', food: '玉米、豆類、烤肉與在地作物' },
  'Australia and New Zealand': { religion: '世俗多元社會', food: '肉類、海鮮、乳製品' },
  Melanesia: { religion: '基督教為主，傳統信仰並存', food: '芋類、海鮮' },
  Micronesia: { religion: '基督教為主', food: '海鮮、芋類、椰子' },
  Polynesia: { religion: '基督教為主', food: '海鮮、熱帶水果、窯烤' },
};

const DISPUTED_NOTES = {
  abkhazia: '高加索黑海沿岸爭議政治實體；俄語、阿布哈茲語並用；農業、觀光與外援為主。',
  south_ossetia: '高加索內陸爭議地區；多山氣候；畜牧與援助經濟為主。',
  nagorno_karabakh: '南高加索爭議地區；山地氣候；農業為主。',
  transnistria: '摩爾多瓦東部未普遍承認政體，蒂拉斯波爾為行政中心；俄語廣泛使用。',
  donetsk_peoples_republic: '烏克蘭東部未普遍承認政體；工業與礦業曾是區域基礎。',
  lugansk_peoples_republic: '烏克蘭東部未普遍承認政體；重工業與能源聯繫密切。',
  republika_srpska: '波士尼亞境內塞族實體；塞爾維亞語為官方語言之一。',
  republic_of_karelia: '俄羅斯聯邦共和國，彼得羅扎沃茨克為首府；林業、湖泊觀光重要。',
  emblem_of_crimea: '克里米亞半島；塞瓦斯托波爾、辛菲羅波爾為重要城市；黑海港口與觀光聞名。',
  tatarstan: '俄羅斯韃靼斯坦共和國，喀山為首府；韃靼語與俄語並用。',
  north_ossetia_alania: '俄羅斯北高加索共和國，弗拉季高加索為首府；多山氣候。',
  democratic_kampuchea: '歷史政權（1975–79），今柬埔寨國旗已不同。',
  red_cross: '國際紅十字與紅新月象徵，中立救護，非國家實體。',
};

const ENTITY_FALLBACK = {
  tuv: { note: '吐瓦魯為大洋洲島國，富納富提為首都；漁業與外援為經濟支柱。' },
  eng: { note: '英國構成國之一，倫敦為英國首都；溫帶海洋性氣候；英語；體育與歷史文化深厚。' },
  wls: { note: '英國構成國，加的夫為行政中心；威爾斯語與英語；紅龍旗為地方象徵。' },
  sct: { note: '英國構成國，愛丁堡為首府；蓋爾語與英語；威士忌、高地文化聞名。' },
  nir: { note: '英國構成國，貝爾法斯特為最大城市；與愛爾蘭文化淵源深。' },
  un: { note: '國際組織，總部紐約；促進和平、安全與合作，非主權國家。' },
  eu: { note: '歐洲區域政治經濟聯盟，總部布魯塞爾；非主權國家實體。' },
  xkx: { note: '巴爾幹半島內陸，普里什蒂納為首都；阿爾巴尼亞語、塞爾維亞語並用。' },
  icrc: { note: '國際人道組織象徵，以中立、保護傷病者為使命；非國家實體。' },
};

function loadCaptionMap() {
  if (!fs.existsSync(CAPTION_CACHE)) return new Map();
  const html = fs.readFileSync(CAPTION_CACHE, 'utf8');
  const map = new Map();
  const re = /國家代碼[：:]\s*([A-Za-z0-9]+)[\s\S]*?說明[：:]\s*([\s\S]*?)<\/div>/gi;
  let match;
  while ((match = re.exec(html)) !== null) {
    const code = match[1].toLowerCase();
    const text = match[2]
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<[^>]+>/g, '')
      .replace(/\n+/g, '')
      .trim();
    if (text) map.set(code, text);
  }
  return map;
}

function parseFlagDescription(raw) {
  if (!raw) return null;
  let text = raw.trim();
  const ratioMatch = text.match(/比例\s*([\d:：/]+)/);
  const ratio = ratioMatch ? ratioMatch[1] : '';
  text = text.replace(/^比例\s*[\d:：/]+[。.]?\s*/, '');

  const sentences = text.split(/[。！？]/).map((s) => s.trim()).filter(Boolean);
  if (!sentences.length) return { ratio, composition: '', symbolism: '', history: '' };

  const composition = sentences[0] || '';
  const rest = sentences.slice(1).join('。');
  const historyPattern = /(\d{3,4}\s*年|獨立|立國|採用|制定|改為|確立|成為|沿用|正式|建立|宣佈)/;
  const restParts = rest ? rest.split(/。/).map((s) => s.trim()).filter(Boolean) : [];
  const symbolismParts = [];
  const historyParts = [];

  for (const part of restParts) {
    if (historyPattern.test(part)) historyParts.push(part);
    else symbolismParts.push(part);
  }

  return {
    ratio,
    composition,
    symbolism: symbolismParts.join('。'),
    history: historyParts.join('。'),
  };
}

function lookupCaptionCode(country) {
  let code = (country.code || '').toLowerCase();
  if (CODE_ALIASES[code]) code = CODE_ALIASES[code];
  if (code) return code;
  return lookupKey(country);
}

function buildFlagLines(country, culture, captionMap, oldDesc) {
  const code = lookupCaptionCode(country);
  const rawCaption = captionMap.get(code);
  const parsed = parseFlagDescription(rawCaption);
  const lines = [];

  if (parsed && (parsed.ratio || parsed.composition || parsed.symbolism || parsed.history)) {
    const layoutParts = [];
    if (parsed.ratio) layoutParts.push(`比例 ${parsed.ratio}`);
    if (parsed.composition) layoutParts.push(parsed.composition);
    if (layoutParts.length) {
      lines.push(`【旗幟・構圖】${layoutParts.join('；')}。`);
    }
    if (parsed.symbolism) {
      lines.push(`【旗幟・色彩象徵】${parsed.symbolism}。`);
    }
    if (parsed.history) {
      lines.push(`【旗幟・歷史】${parsed.history}。`);
    }
  }

  if (!lines.length) {
    const brief = culture.flagBrief
      || extractFlagFromStructured(oldDesc)
      || legacyFlagDesc(oldDesc);
    if (brief) {
      lines.push(`【旗幟・概說】${brief.replace(/。+$/, '')}。`);
    }
  }

  return lines;
}

function legacyFlagDesc(oldDesc) {
  if (!oldDesc || oldDesc.includes('【概況】')) return '';
  return oldDesc;
}

function extractFlagFromStructured(oldDesc) {
  const m = String(oldDesc || '').match(/【旗幟】([^【\n]+)/);
  if (!m) return '';
  const text = m[1].trim().replace(/。+$/, '');
  if (!text || text.includes('【概況】')) return '';
  return text;
}

function resolveFlagBrief(culture, oldDesc) {
  return culture.flagBrief
    || extractFlagFromStructured(oldDesc)
    || shortenFlagDesc(legacyFlagDesc(oldDesc));
}

function stripRatio(text) {
  return String(text || '')
    .replace(/比例[\s沒有為]*[\d:：/]*[\d]*[。.]?/gi, '')
    .replace(/寬長比例[\d:：/]+[。.]?/gi, '')
    .replace(/[^。！？]*比例[^。！？]*[。]?/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function shortenFlagDesc(raw) {
  const t = stripRatio(raw);
  if (!t || /比例/.test(t)) return '';
  const parts = t.split(/[。！？]/).map((s) => s.trim()).filter(Boolean);
  const brief = parts.slice(0, 2).join('。');
  if (!brief || brief.length < 4) return '';
  return brief.length > 100 ? `${brief.slice(0, 97)}…` : brief;
}

function lookupKey(country) {
  let code = (country.code || '').toLowerCase();
  if (CODE_ALIASES[code]) code = CODE_ALIASES[code];
  if (code) return code;
  const file = path.basename(country.image || '', '.png');
  const FILE_CODE = {
    tuvalu_flag: 'tuv',
    united_nations_flag: 'un',
    european_union_flag: 'eu',
    england_flag: 'eng',
    wales_flag: 'wls',
    scotland_flag: 'sct',
    northern_ireland_flag: 'nir',
    flag_aland_islands: 'ala',
    flag_antarctica: 'ata',
    flag_aruba: 'abw',
    red_cross_flag: 'icrc',
    democratic_kampuchea_flag: 'khm',
    easter_island_flag: 'chl',
    christmas_island_flag: 'cxr',
  };
  if (FILE_CODE[file]) return FILE_CODE[file];
  const slug = file.replace(/_flag$/, '').replace(/^flag_/, '');
  if (FILE_CODE[`${slug}_flag`]) return FILE_CODE[`${slug}_flag`];
  return slug;
}

function zhName(record, fallback) {
  return record?.translations?.zho?.common
    || record?.translations?.zho?.official
    || fallback;
}

function formatLanguages(languages) {
  if (!languages) return '';
  return Object.values(languages).join('、');
}

const CAPitals_CACHE = path.join(__dirname, 'world-flags-capitals-zh.json');

const CAPITAL_MANUAL = {
  beijing: '北京',
  taipei: '臺北',
  'hong kong': '香港',
  macau: '澳門',
  seoul: '首爾',
  pyongyang: '平壤',
  'washington, d.c.': '華盛頓',
  'washington, d.c': '華盛頓',
  'washington d.c.': '華盛頓',
  washington: '華盛頓',
  london: '倫敦',
  paris: '巴黎',
  berlin: '柏林',
  moscow: '莫斯科',
  tokyo: '東京',
  ulaanbaatar: '烏蘭巴託',
  'ulan bator': '烏蘭巴託',
  mumbai: '孟買',
  'new delhi': '新德里',
  'new taipei': '新北',
  alofi: '阿洛菲',
  funafuti: '富納富提',
  wellington: '威靈頓',
  canberra: '坎培拉',
  ottawa: '渥太華',
  brussels: '布魯塞爾',
  'vatican city': '梵蒂岡城',
  'the hague': '海牙',
  "saint john's": '聖約翰',
  "st. john's": '聖約翰',
  "nuku'alofa": '努庫阿洛法',
};

function normCityKey(name) {
  return String(name || '').trim().toLowerCase();
}

function loadCapitalZhMap() {
  const map = { ...CAPITAL_MANUAL };
  if (fs.existsSync(CAPitals_CACHE)) {
    try {
      Object.assign(map, JSON.parse(fs.readFileSync(CAPitals_CACHE, 'utf8')));
    } catch {
      /* ignore */
    }
  }
  return map;
}

function cityZhName(enName, capitalMap) {
  if (!enName) return '';
  const key = normCityKey(enName);
  return capitalMap[key] || '';
}

function formatCity(enName, zhName) {
  if (!enName && zhName) return displayZhCity(zhName);
  if (!enName) return '';
  const zh = displayZhCity(zhName || '');
  if (!zh || zh === enName) return enName;
  return `${zh}(${enName})`;
}

function findCityEn(zhName, capitalMap) {
  const target = displayZhCity(zhName);
  for (const [en, zh] of Object.entries(capitalMap)) {
    if (displayZhCity(zh) === target) {
      const label = en.replace(/\b\w/g, (c) => c.toUpperCase());
      return label.replace(/, D\.c\./i, ', D.C.');
    }
  }
  return '';
}

function formatLargestCity(largestRaw, capitalMap) {
  const text = String(largestRaw).trim();
  const primary = text.split(/（/)[0].trim();
  const en = findCityEn(primary, capitalMap);
  const formatted = en ? formatCity(en, primary) : primary;
  const suffix = text.slice(primary.length);
  return `${formatted}${suffix}`;
}

function isSameCity(a, b) {
  if (!a || !b) return false;
  const na = normCityKey(a);
  const nb = normCityKey(b);
  if (na === nb) return true;
  if (a.includes(b) || b.includes(a)) return true;
  return false;
}

function displayZhCity(zh) {
  if (!zh) return '';
  return zh.replace(/(特別行政區|特別行政區)$/, '').replace(/(市|都)$/, '') || zh;
}

function citiesEquivalent(a, b) {
  if (!a || !b) return false;
  if (isSameCity(a, b)) return true;
  return displayZhCity(a) === displayZhCity(b);
}

function largestDiffersFromCapital(capitalEn, capitalZh, largestRaw) {
  if (!largestRaw) return false;
  const text = String(largestRaw).trim();
  const primary = text.split(/（/)[0].trim();
  if (/為首都|首府/.test(text) && primary !== capitalZh && !citiesEquivalent(primary, capitalZh)) {
    return true;
  }
  if (/為首都|首府/.test(text) && citiesEquivalent(primary, capitalZh)) return false;
  if (capitalZh && citiesEquivalent(primary, capitalZh)) return false;
  if (capitalEn && isSameCity(primary, capitalEn)) return false;
  if (capitalZh && primary === capitalZh) return false;
  if (primary === text && capitalZh && primary !== displayZhCity(capitalZh)) return true;
  return primary !== text || Boolean(primary && capitalZh && !citiesEquivalent(primary, capitalZh));
}

function formatOverview(capitalEn, record, culture, capitalMap) {
  const capZh = cityZhName(capitalEn, capitalMap);
  const capLabel = formatCity(capitalEn, capZh);
  const largestRaw = culture.largestCity;

  if (!capLabel && !largestRaw) return '';

  if (!largestDiffersFromCapital(capitalEn, capZh, largestRaw)) {
    if (capLabel) return `【概況】首都${capLabel}（通常亦為主要都會）`;
    return `【概況】主要都會${formatLargestCity(largestRaw, capitalMap)}`;
  }

  const parts = [];
  if (capLabel) parts.push(`首都${capLabel}`);
  if (largestRaw) parts.push(`最大城市${formatLargestCity(largestRaw, capitalMap)}`);
  return `【概況】${parts.join('；')}`;
}

function formatRate(rate) {
  if (rate == null || !Number.isFinite(rate)) return '';
  if (rate >= 100) return rate.toFixed(2).replace(/\.?0+$/, '');
  if (rate >= 10) return rate.toFixed(2).replace(/\.?0+$/, '');
  if (rate >= 1) return rate.toFixed(3).replace(/\.?0+$/, '');
  return rate.toFixed(4).replace(/\.?0+$/, '');
}

function formatCurrency(currencies, usdRates) {
  if (!currencies) return '';
  return Object.entries(currencies)
    .map(([code, info]) => {
      const enName = info.name || code;
      const zhName = CURRENCY_ZH[code] || '';
      const label = zhName
        ? `${zhName} ${enName}（${code}）`
        : `${enName}（${code}）`;
      if (code === 'USD') return label;
      const rate = usdRates?.[code];
      if (rate == null) return label;
      return `${label}，對美金匯率 ${formatRate(rate)}:1`;
    })
    .join('、');
}

function formatBorders(borders, index) {
  if (!borders?.length) return '';
  const names = borders
    .map((c) => index.get(c.toLowerCase()))
    .filter(Boolean)
    .slice(0, 6);
  return names.length ? names.join('、') : '';
}

function buildLines(country, record, index, oldDesc, capitalMap, usdRates, captionMap) {
  const key = lookupKey(country);
  const culture = CULTURE[key] || CULTURE[country.code] || CULTURE[CODE_ALIASES[country.code]] || {};
  const entity = ENTITY_FALLBACK[key];
  const slug = path.basename(country.image || '', '.png').replace(/_flag$/, '');
  const disputed = DISPUTED_NOTES[slug];
  const lines = [];

  if (disputed) {
    lines.push(`【概況】${disputed}`);
    lines.push(...buildFlagLines(country, culture, captionMap, oldDesc));
    return lines.join('\n');
  }

  if (entity?.note) {
    lines.push(`【概況】${entity.note}`);
    lines.push(...buildFlagLines(country, culture, captionMap, oldDesc));
    return lines.join('\n');
  }

  const capital = record?.capital?.[0];
  const overview = formatOverview(capital, record, culture, capitalMap);
  if (overview) lines.push(overview);

  const region = REGION_ZH[record?.region] || '';
  const subKey = SUBREGION_ALIASES[record?.subregion] || record?.subregion;
  const sub = SUBREGION_ZH[subKey] || '';
  const locParts = [];
  if (region || sub) locParts.push(`位於${region}${sub}`);
  const borders = formatBorders(record?.borders, index);
  if (borders) locParts.push(`陸鄰${borders}`);
  if (record?.landlocked) locParts.push('內陸國');
  const climate = culture.climate || SUBREGION_CLIMATE[subKey] || '';
  if (climate) locParts.push(climate);
  if (locParts.length) lines.push(`【地理】${locParts.join('；')}。`);

  const langs = formatLanguages(record?.languages);
  if (langs) lines.push(`【語言】${langs}。`);

  const curr = formatCurrency(record?.currencies, usdRates);
  if (curr) lines.push(`【貨幣】${curr}。`);

  const industry = culture.industry || SUBREGION_INDUSTRY[subKey] || '';
  if (industry) lines.push(`【經濟】${industry}。`);

  const subCulture = SUBREGION_CULTURE[subKey] || {};
  const cultureBits = [];
  if (culture.emblem) cultureBits.push(`國徽／象徵：${culture.emblem}`);
  if (culture.flower) cultureBits.push(`代表花卉：${culture.flower}`);
  if (culture.food || subCulture.food) cultureBits.push(`代表飲食：${culture.food || subCulture.food}`);
  if (culture.landmarks) cultureBits.push(`著名景點：${culture.landmarks}`);
  if (culture.religion || subCulture.religion) cultureBits.push(`宗教文化：${culture.religion || subCulture.religion}`);
  if (cultureBits.length) lines.push(`【文化】${cultureBits.join('；')}。`);

  lines.push(...buildFlagLines(country, culture, captionMap, oldDesc));

  if (!lines.length) {
    lines.push(`【概況】${country.nameZh || country.nameEn}。`);
    lines.push(...buildFlagLines(country, culture, captionMap, oldDesc));
  }

  return lines.join('\n');
}

async function loadCountries() {
  const res = await fetch('https://raw.githubusercontent.com/mledoze/countries/master/countries.json', {
    headers: { 'User-Agent': 'Kawatool/1.0 (world-flags desc)' },
  });
  if (!res.ok) throw new Error(`countries.json HTTP ${res.status}`);
  return res.json();
}

async function loadUsdRates() {
  try {
    const res = await fetch('https://api.frankfurter.app/latest?from=USD', {
      headers: { 'User-Agent': 'Kawatool/1.0 (world-flags desc)' },
    });
    if (!res.ok) throw new Error(`Frankfurter HTTP ${res.status}`);
    const data = await res.json();
    return data.rates || {};
  } catch (err) {
    console.warn('Exchange rates unavailable:', err.message);
    return {};
  }
}

async function main() {
  const raw = fs.readFileSync(OUT_DATA, 'utf8');
  const data = JSON.parse(raw.replace(/^[\s\S]*?=\s*/, '').replace(/;\s*$/, ''));
  const [countriesJson, usdRates] = await Promise.all([loadCountries(), loadUsdRates()]);
  const capitalMap = loadCapitalZhMap();
  const captionMap = loadCaptionMap();
  console.log(`Caption map: ${captionMap.size} entries`);

  const index = new Map();
  const zhIndex = new Map();
  for (const row of countriesJson) {
    if (!row.cca3) continue;
    index.set(row.cca3.toLowerCase(), row);
    zhIndex.set(row.cca3.toLowerCase(), zhName(row, row.name?.common));
  }

  let updated = 0;
  for (const region of data.regions) {
    for (const country of region.countries) {
      const key = lookupKey(country);
      let code = (country.code || '').toLowerCase();
      if (CODE_ALIASES[code]) code = CODE_ALIASES[code];
      const record = index.get(code) || index.get(key) || index.get(String(key).slice(0, 3));
      country.desc = buildLines(country, record, zhIndex, country.desc, capitalMap, usdRates, captionMap);
      if (country.desc) updated += 1;
    }
  }

  const js = `/* Auto-generated by scripts/fetch-world-flags.mjs + enrich-world-flags-desc.mjs */\nwindow.WA_WORLD_FLAGS = ${JSON.stringify(data, null, 2)};\n`;
  fs.writeFileSync(OUT_DATA, js);
  console.log(`Updated descriptions for ${updated} entries -> ${OUT_DATA}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
