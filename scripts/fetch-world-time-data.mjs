/**
 * Build world-time-data.js from countries DB + world-flags Chinese names.
 * Run: node scripts/fetch-world-time-data.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const FLAGS_DATA = path.join(ROOT, 'assets', 'js', 'world-flags-data.js');
const ISO_MAP = path.join(__dirname, 'iso3166-alpha.json');
const COUNTRIES_CACHE = path.join(__dirname, '_countries-tz.json');
const OUT = path.join(ROOT, 'assets', 'js', 'world-time-data.js');

const TZ_LABELS = {
  'America/New_York': '美東',
  'America/Chicago': '美中',
  'America/Denver': '美山',
  'America/Los_Angeles': '美西',
  'America/Anchorage': '阿拉斯加',
  'Pacific/Honolulu': '夏威夷',
  'Europe/Kaliningrad': '加里寧格勒',
  'Europe/Moscow': '莫斯科',
  'Asia/Yekaterinburg': '葉卡捷琳堡',
  'Asia/Omsk': '鄂木斯克',
  'Asia/Krasnoyarsk': '克拉斯諾亞爾斯克',
  'Asia/Irkutsk': '伊爾庫茨克',
  'Asia/Yakutsk': '雅庫茨克',
  'Asia/Vladivostok': '海參崴',
  'Asia/Magadan': '馬加丹',
  'Asia/Kamchatka': '堪察加',
  'Australia/Lord_Howe': '豪勳爵島',
  'Australia/Sydney': '雪梨',
  'Australia/Adelaide': '阿德萊德',
  'Australia/Perth': '伯斯',
  'Australia/Eucla': '尤克拉',
  'Pacific/Chatham': '查atham',
};

function loadFlagsData() {
  const src = fs.readFileSync(FLAGS_DATA, 'utf8');
  const sandbox = { window: {} };
  const wrapped = src.replace(/window\.WA_WORLD_FLAGS\s*=/, 'sandbox.window.WA_WORLD_FLAGS =');
  // eslint-disable-next-line no-new-func
  new Function('sandbox', wrapped)(sandbox);
  return sandbox.window.WA_WORLD_FLAGS;
}

function buildZhIndex(flagsData, isoMap) {
  const byIso3 = new Map();
  const byIso2 = new Map();
  for (const region of flagsData.regions || []) {
    for (const c of region.countries || []) {
      const iso3 = (c.code || '').toUpperCase();
      const iso2 = (isoMap[iso3] || '').toUpperCase();
      const entry = { nameZh: c.nameZh, nameEn: c.nameEn, code: c.code };
      if (iso3) byIso3.set(iso3, entry);
      if (iso2) byIso2.set(iso2, entry);
    }
  }
  return { byIso3, byIso2 };
}

function tzShortLabel(zoneName, abbrev) {
  if (TZ_LABELS[zoneName]) return TZ_LABELS[zoneName];
  const city = zoneName.split('/').pop().replace(/_/g, ' ');
  return abbrev || city;
}

async function loadCountriesJson() {
  if (fs.existsSync(COUNTRIES_CACHE)) {
    return JSON.parse(fs.readFileSync(COUNTRIES_CACHE, 'utf8'));
  }
  const res = await fetch(
    'https://raw.githubusercontent.com/dr5hn/countries-states-cities-database/master/json/countries.json'
  );
  if (!res.ok) throw new Error(`Fetch countries failed ${res.status}`);
  const data = await res.json();
  fs.writeFileSync(COUNTRIES_CACHE, JSON.stringify(data));
  return data;
}

async function main() {
  const [countries, flagsData] = await Promise.all([
    loadCountriesJson(),
    Promise.resolve(loadFlagsData()),
  ]);
  const isoMap = JSON.parse(fs.readFileSync(ISO_MAP, 'utf8'));
  const { byIso3, byIso2 } = buildZhIndex(flagsData, isoMap);

  const items = [];
  const seen = new Set();

  countries.forEach((country) => {
    const iso2 = (country.iso2 || '').toUpperCase();
    const iso3 = (country.iso3 || '').toUpperCase();
    const flag = byIso3.get(iso3) || byIso2.get(iso2);
    const countryZh = flag?.nameZh || country.native || country.name;
    const countryEn = flag?.nameEn || country.name;
    const code = flag?.code || iso3.toLowerCase();
    const capital = country.capital || '';
    const emoji = country.emoji || '';
    const region = country.region || '';

    (country.timezones || []).forEach((tz) => {
      if (!tz.zoneName) return;
      const key = `${iso2}|${tz.zoneName}`;
      if (seen.has(key)) return;
      seen.add(key);
      const multi = (country.timezones || []).length > 1;
      items.push({
        id: key.replace('|', '-').toLowerCase(),
        countryZh,
        countryEn,
        code,
        iso2,
        iso3,
        capital,
        emoji,
        region,
        tz: tz.zoneName,
        tzAbbr: tz.abbreviation || '',
        tzName: tz.tzName || '',
        tzLabel: multi ? tzShortLabel(tz.zoneName, tz.abbreviation) : '',
        utcStatic: tz.gmtOffsetName || '',
      });
    });
  });

  items.sort((a, b) => a.countryEn.localeCompare(b.countryEn, 'en'));

  const body = `/* Auto-generated — world time zones */
window.WA_WORLD_TIME = ${JSON.stringify({
    updated: new Date().toISOString().slice(0, 10),
    itemCount: items.length,
    intro: '依目前時間，由 UTC 最快（最東）到最慢（最西）排列。IANA 時區名稱供工程師對照；太陽／傍晚／月亮圖示代表當地晝夜時段。',
    items,
  }, null, 2)};
`;
  fs.writeFileSync(OUT, body, 'utf8');
  console.log(`Wrote ${items.length} timezone entries -> ${OUT}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
