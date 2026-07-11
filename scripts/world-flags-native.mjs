const RTL_LANGS = new Set(['ara', 'ar', 'heb', 'he', 'fas', 'fa', 'urd', 'ur', 'yid', 'yi', 'pus', 'ps']);

const LANG_LABELS = {
  jpn: '日本語', zho: '中文', kor: '한국어', deu: 'Deutsch', fra: 'Français', spa: 'Español',
  por: 'Português', ita: 'Italiano', nld: 'Nederlands', rus: 'Русский', ara: 'العربية',
  hin: 'हिन्दी', tha: 'ไทย', vie: 'Tiếng Việt', pol: 'Polski', tur: 'Türkçe', ell: 'Ελληνικά',
  heb: 'עברית', swe: 'Svenska', nor: 'Norsk', dan: 'Dansk', fin: 'Suomi', ces: 'Čeština',
  hun: 'Magyar', ron: 'Română', bul: 'Български', ukr: 'Українська', kaz: 'Қазақ',
  mon: 'Монгол', hye: 'Հայերեն', kat: 'ქართული', amh: 'አማርኛ', swa: 'Kiswahili',
  mlt: 'Malti', isl: 'Íslenska', gle: 'Gaeilge', cym: 'Cymraeg', glg: 'Galego', cat: 'Català',
  sqi: 'Shqip', mkd: 'Македонски', srp: 'Српски', hrv: 'Hrvatski', bos: 'Bosanski',
  slk: 'Slovenčina', slv: 'Slovenščina', lit: 'Lietuvių', lav: 'Latviešu', est: 'Eesti',
  fas: 'فارسی', urd: 'اردو', ben: 'বাংলা', tam: 'தமிழ்', tel: 'తెలుగు', mar: 'मराठी',
  guj: 'ગુજરાતી', kan: 'ಕನ್ನಡ', mal: 'മലയാളം', sin: 'සිංහල', mya: 'မြန်မာ', khm: 'ខ្មែរ',
  lao: 'ລາວ', ind: 'Bahasa Indonesia', msa: 'Bahasa Melayu', fil: 'Filipino', tgl: 'Tagalog',
  smo: 'Gagana Samoa', ton: 'lea fakatonga', fij: 'Na Vosa Vakaviti', haw: 'ʻŌlelo Hawaiʻi',
  grn: 'Avañe\'ẽ', que: 'Runa Simi', aym: 'Aymar aru', glv: 'Gaelg', cor: 'Kernewek',
  bre: 'Brezhoneg', cos: 'Corsu', srd: 'Sardu', roh: 'Rumantsch', div: 'ދިވެހި',
  kir: 'Кыргызча', tgk: 'Тоҷикӣ', tuk: 'Türkmen', uzb: 'Oʻzbek', aze: 'Azərbaycan',
  bel: 'Беларуская', kaz: 'Қазақша', sin: 'සිංහල',
};

const CODE_ALIASES = {
  uar: 'are',
};

const CAPTION_LANG_MAP = {
  葡萄牙語: { lang: 'pt', label: 'Português' },
  荷蘭語: { lang: 'nl', label: 'Nederlands' },
  西班牙語: { lang: 'es', label: 'Español' },
  威爾斯語: { lang: 'cy', label: 'Cymru' },
  蘇格蘭蓋爾語: { lang: 'gd', label: 'Gàidhlig' },
  愛爾蘭語: { lang: 'ga', label: 'Gaeilge' },
  低地蘇格蘭語: { lang: 'sco', label: 'Scots' },
  瑞典語: { lang: 'sv', label: 'Svenska' },
  芬蘭語: { lang: 'fi', label: 'Suomi' },
};

const CAPTION_LANG_KEYS = /^(?:[^\s：:]+語|[^\s：:]+語)$/;

function normalizeName(value) {
  return String(value || '')
    .normalize('NFKC')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

function isRtl(lang) {
  return RTL_LANGS.has(String(lang || '').toLowerCase());
}

function langTag(langKey) {
  const key = String(langKey || '').toLowerCase();
  if (key.length === 2) return key;
  const map = {
    jpn: 'ja', zho: 'zh', kor: 'ko', deu: 'de', fra: 'fr', spa: 'es', por: 'pt', ita: 'it',
    nld: 'nl', rus: 'ru', ara: 'ar', hin: 'hi', tha: 'th', vie: 'vi', pol: 'pl', tur: 'tr',
    ell: 'el', heb: 'he', swe: 'sv', nor: 'no', dan: 'da', fin: 'fi', ces: 'cs', hun: 'hu',
    ron: 'ro', bul: 'bg', ukr: 'uk', kaz: 'kk', mon: 'mn', hye: 'hy', kat: 'ka', amh: 'am',
    swa: 'sw', mlt: 'mt', isl: 'is', gle: 'ga', cym: 'cy', glg: 'gl', cat: 'ca', sqi: 'sq',
    mkd: 'mk', srp: 'sr', hrv: 'hr', bos: 'bs', slk: 'sk', slv: 'sl', lit: 'lt', lav: 'lv',
    est: 'et', fas: 'fa', urd: 'ur', ben: 'bn', tam: 'ta', tel: 'te', mar: 'mr', guj: 'gu',
    kan: 'kn', mal: 'ml', sin: 'si', mya: 'my', khm: 'km', lao: 'lo', ind: 'id', msa: 'ms',
    fil: 'fil', tgl: 'tl', smo: 'sm', ton: 'to', fij: 'fj', kir: 'ky', tgk: 'tg', tuk: 'tk',
    uzb: 'uz', aze: 'az', bel: 'be', div: 'dv', grn: 'gn', que: 'qu', aym: 'ay',
  };
  return map[key] || key.slice(0, 2);
}

function parseCaptionNatives(html) {
  const text = html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .trim();
  const natives = [];

  for (const line of text.split('\n')) {
    const m = line.trim().match(/^([^：:]+)[：:]\s*(.+)$/);
    if (!m) continue;
    const key = m[1].trim();
    const val = m[2].trim();
    if (['英文', '中文', '縮寫', '國家代碼', '說明', '簡稱'].includes(key)) continue;
    if (!CAPTION_LANG_KEYS.test(key) && !key.endsWith('語')) continue;
    if (!val || val.length > 48 || /^[\d./\s]+$/.test(val)) continue;
    const mapped = CAPTION_LANG_MAP[key];
    natives.push({
      name: val,
      lang: mapped?.lang || 'und',
      label: mapped?.label || key.replace(/語$/, '語'),
    });
  }
  return natives;
}

function pickFromCountryRecord(record) {
  if (!record?.name?.native) return [];
  const languages = record.languages || {};
  const out = [];

  for (const [langKey, vals] of Object.entries(record.name.native)) {
    const name = vals.common || vals.official;
    if (!name || name.length > 48) continue;
    out.push({
      name,
      lang: langTag(langKey),
      label: LANG_LABELS[langKey] || languages[langKey] || langKey,
    });
  }
  return out;
}

function dedupeNatives(list, nameEn, nameZh) {
  const seen = new Set();
  const enNorm = normalizeName(nameEn);
  const zhNorm = normalizeName(nameZh);
  const result = [];

  for (const item of list) {
    const norm = normalizeName(item.name);
    if (!norm || seen.has(norm)) continue;
    if (norm === enNorm) continue;
    if (norm === zhNorm) continue;
    seen.add(norm);
    result.push({
      name: item.name,
      lang: item.lang || 'und',
      label: item.label || '',
      rtl: isRtl(item.lang),
    });
  }
  return result;
}

export function buildEndonymIndex(countriesJson) {
  const index = new Map();
  for (const row of countriesJson) {
    if (row?.cca3) index.set(row.cca3.toLowerCase(), row);
  }
  return index;
}

export function attachNativeNames(country, endonymIndex, captionHtml) {
  const codeKey = CODE_ALIASES[country.code] || country.code;
  const record = codeKey ? endonymIndex.get(codeKey) : null;
  const fromRecord = pickFromCountryRecord(record);
  const fromCaption = captionHtml ? parseCaptionNatives(captionHtml) : [];
  country.natives = dedupeNatives(
    [...fromCaption, ...fromRecord],
    country.nameEn,
    country.nameZh,
  );
  return country;
}

export async function loadEndonymIndex() {
  const res = await fetch('https://raw.githubusercontent.com/mledoze/countries/master/countries.json', {
    headers: { 'User-Agent': 'WaWaTools/1.0 (world-flags fetch)' },
  });
  if (!res.ok) throw new Error(`Endonyms HTTP ${res.status}`);
  return buildEndonymIndex(await res.json());
}
