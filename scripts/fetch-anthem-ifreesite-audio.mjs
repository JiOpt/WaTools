/**
 * Map MyTooLife anthem codes to ifreesite MP4 URLs.
 * Source: https://www.ifreesite.com/world/national-anthem.htm
 * Run: node scripts/fetch-anthem-ifreesite-audio.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const SOURCE_URL = 'https://www.ifreesite.com/world/national-anthem.htm';
const CDN = 'https://00.ifreesite.com/world-v/';
const ANTHEM_DATA = path.join(ROOT, 'assets', 'js', 'national-anthem-data.js');
const OUT = path.join(ROOT, 'assets', 'js', 'national-anthem-audio.js');

const EN_CODE = {
  china: 'chn',
  japan: 'jpn',
  'south korea': 'kor',
  'north korea': 'prk',
  mongolia: 'mng',
  thailand: 'tha',
  philippines: 'phl',
  indonesia: 'idn',
  vietnam: 'vnm',
  brunei: 'brn',
  singapore: 'sgp',
  malaysia: 'mys',
  laos: 'lao',
  cambodia: 'khm',
  'east timor': 'tls',
  myanmar: 'mmr',
  india: 'ind',
  pakistan: 'pak',
  'sri lanka': 'lka',
  nepal: 'npl',
  maldives: 'mdv',
  bhutan: 'btn',
  bangladesh: 'bgd',
  uzbekistan: 'uzb',
  kyrgyzstan: 'kgz',
  kazakhstan: 'kaz',
  tajikistan: 'tjk',
  turkmenistan: 'tkm',
  turkey: 'tur',
  jordan: 'jor',
  israel: 'isr',
  kuwait: 'kwt',
  qatar: 'qat',
  'united arab emirates': 'are',
  syrian: 'syr',
  syria: 'syr',
  iran: 'irn',
  'saudi arabia': 'sau',
  'northern cyprus': 'cyp',
  yemen: 'yem',
  armenia: 'arm',
  'south ossetia': 'geo',
  azerbaijan: 'aze',
  artsakh: 'arm',
  abkhazia: 'geo',
  oman: 'omn',
  lebanon: 'lbn',
  'baḥrayn': 'bhr',
  bahrain: 'bhr',
  afghanistan: 'afg',
  georgia: 'geo',
  palestine: 'pse',
  cyprus: 'cyp',
  iraq: 'irq',
  france: 'fra',
  'united kingdom': 'gbr',
  nederland: 'nld',
  netherlands: 'nld',
  belgium: 'bel',
  monaco: 'mco',
  ireland: 'irl',
  luxembourg: 'lux',
  denmark: 'dnk',
  norway: 'nor',
  sweden: 'swe',
  iceland: 'isl',
  finland: 'fin',
  switzerland: 'che',
  poland: 'pol',
  'czech republic': 'cze',
  austria: 'aut',
  germany: 'deu',
  liechtenstein: 'lie',
  hungary: 'hun',
  slovakia: 'svk',
  latvia: 'lva',
  moldova: 'mda',
  estonia: 'est',
  ukraine: 'ukr',
  russia: 'rus',
  transnistria: 'mda',
  lithuania: 'ltu',
  belarus: 'blr',
  'sovereign military order of malta': 'mlt',
  portugal: 'prt',
  'vatican city': 'vat',
  italy: 'ita',
  malta: 'mlt',
  greece: 'grc',
  spain: 'esp',
  romania: 'rou',
  bulgaria: 'bgr',
  croatia: 'hrv',
  slovenia: 'svn',
  albania: 'alb',
  'north macedonia': 'mkd',
  andorra: 'and',
  'federation of bosnia and herzegovina': 'bih',
  montenegro: 'mne',
  kosovo: 'xkx',
  serbia: 'srb',
  'san marino': 'smr',
  'united states of america': 'usa',
  canada: 'can',
  mexico: 'mex',
  panama: 'pan',
  nicaragua: 'nic',
  honduras: 'hnd',
  guatemala: 'gtm',
  belize: 'blz',
  'costa rica': 'cri',
  'dominican republic': 'dom',
  cuba: 'cub',
  jamaica: 'jam',
  'trinidad and tobago': 'tto',
  barbados: 'brb',
  'antigua and barbuda': 'atg',
  bahamas: 'bhs',
  grenada: 'grd',
  'saint kitts and nevis': 'kna',
  'saint vincent and the grenadines': 'vct',
  haiti: 'hti',
  'el salvador': 'slv',
  dominica: 'dma',
  'saint lucia': 'lca',
  chile: 'chl',
  uruguay: 'ury',
  peru: 'per',
  bolivia: 'bol',
  colombia: 'col',
  argentina: 'arg',
  guyana: 'guy',
  suriname: 'sur',
  brazil: 'bra',
  venezuela: 'ven',
  ecuador: 'ecu',
  paraguay: 'pry',
  morocco: 'mar',
  algeria: 'dza',
  sudan: 'sdn',
  'sahrawi arab democratic republic': 'esh',
  egypt: 'egy',
  tunisia: 'tun',
  'south sudan': 'ssd',
  libya: 'lby',
  somalia: 'som',
  uganda: 'uga',
  kenya: 'ken',
  tanzania: 'tza',
  djibouti: 'dji',
  burundi: 'bdi',
  eritrea: 'eri',
  seychelles: 'syc',
  somaliland: 'som',
  rwanda: 'rwa',
  ethiopia: 'eth',
  liberia: 'lbr',
  guinea: 'gin',
  mauritania: 'mrt',
  chad: 'tcd',
  niger: 'ner',
  'ivory coast': 'civ',
  togo: 'tgo',
  senegal: 'sen',
  nigeria: 'nga',
  mali: 'mli',
  'sierra leone': 'sle',
  gambia: 'gmb',
  ghana: 'gha',
  'guinea-bissau': 'gnb',
  'burkina faso': 'bfa',
  benin: 'ben',
  'cape verde': 'cpv',
  'central african republic': 'caf',
  gabon: 'gab',
  cameroon: 'cmr',
  'são tomé and príncipe': 'stp',
  'equatorial guinea': 'gnq',
  'republic of the congo': 'cog',
  'democratic republic of the congo': 'cod',
  madagascar: 'mdg',
  botswana: 'bwa',
  eswatini: 'swz',
  mauritius: 'mus',
  angola: 'ago',
  zimbabwe: 'zwe',
  mozambique: 'moz',
  namibia: 'nam',
  'south africa': 'zaf',
  zambia: 'zmb',
  comoros: 'com',
  lesotho: 'lso',
  malawi: 'mwi',
  tonga: 'ton',
  'new zealand': 'nzl',
  australia: 'aus',
  samoa: 'wsm',
  nauru: 'nru',
  fiji: 'fji',
  'papua new guinea': 'png',
  niue: 'niu',
  'solomon islands': 'slb',
  'marshall islands': 'mhl',
  kiribati: 'kir',
  'cook islands': 'cok',
  'federated states of micronesia': 'fsm',
  vanuatu: 'vut',
  palau: 'plw',
  tuvalu: 'tuv',
};

function normEn(s) {
  return (s || '').trim().toLowerCase().replace(/\s+/g, ' ');
}

function normZh(s) {
  return (s || '')
    .replace(/\s+/g, '')
    .replace(/\(.*?\)/g, '')
    .replace(/\/.*$/, '')
    .trim();
}

function loadAnthems() {
  const src = fs.readFileSync(ANTHEM_DATA, 'utf8');
  const sandbox = { window: {} };
  const wrapped = src.replace(/window\.WA_NATIONAL_ANTHEMS\s*=/, 'sandbox.window.WA_NATIONAL_ANTHEMS =');
  // eslint-disable-next-line no-new-func
  new Function('sandbox', wrapped)(sandbox);
  return sandbox.window.WA_NATIONAL_ANTHEMS?.anthems || [];
}

function parseIfreesite(html) {
  const re = /class="if_tabls stara">([^<]+)\s*<span class="pipe">\|<\/span>\s*<a href="\/\/00\.ifreesite\.com\/world-v\/([^"]+)" title="([^"]*)">/g;
  const rows = [];
  let m;
  while ((m = re.exec(html)) !== null) {
    const tail = html.slice(m.index, m.index + 400);
    const zhMatch = tail.match(/<br\s*\/?>([^<]+)<\/div>/i);
    rows.push({
      countryEn: m[1].trim(),
      slug: m[2].replace(/\.mp4$/i, ''),
      title: m[3].trim(),
      countryZh: zhMatch ? zhMatch[1].trim() : '',
    });
  }
  return rows;
}

async function main() {
  const res = await fetch(SOURCE_URL, {
    headers: { 'User-Agent': 'MyTooLife/1.0 (anthem-audio map)' },
  });
  if (!res.ok) throw new Error(`Fetch failed ${res.status}`);
  const html = await res.text();
  const rows = parseIfreesite(html);
  const anthems = loadAnthems();

  const zhToCode = new Map();
  const enToCode = new Map();
  for (const a of anthems) {
    if (a.countryEn) enToCode.set(normEn(a.countryEn), a.code);
    if (a.country) zhToCode.set(normZh(a.country), a.code);
  }

  const byCode = {};
  const unmatched = [];

  for (const row of rows) {
    const url = `${CDN}${row.slug}.mp4`;
    let code = EN_CODE[normEn(row.countryEn)] || enToCode.get(normEn(row.countryEn));
    if (!code && row.countryZh) {
      const zhKey = normZh(row.countryZh.split(/[/／]/)[0]);
      code = zhToCode.get(zhKey);
      if (!code) {
        for (const [zh, c] of zhToCode) {
          if (zhKey.includes(zh) || zh.includes(zhKey)) {
            code = c;
            break;
          }
        }
      }
    }
    if (!code) {
      unmatched.push(row);
      continue;
    }
    if (!byCode[code] || byCode[code].slug !== row.slug) {
      byCode[code] = {
        slug: row.slug,
        url,
        title: row.title,
        ifreesiteEn: row.countryEn,
        ifreesiteZh: row.countryZh,
      };
    }
  }

  const out = `/* Auto-generated — ifreesite anthem audio map */
window.WA_NATIONAL_ANTHEM_AUDIO = ${JSON.stringify({
    updated: new Date().toISOString().slice(0, 10),
    sourcePage: SOURCE_URL,
    cdnBase: CDN,
    matched: Object.keys(byCode).length,
    totalIfreesite: rows.length,
    byCode,
  }, null, 2)};
`;

  fs.writeFileSync(OUT, out, 'utf8');
  console.log(`ifreesite rows: ${rows.length}`);
  console.log(`matched codes: ${Object.keys(byCode).length}`);
  if (unmatched.length) {
    console.log('unmatched sample:', unmatched.slice(0, 8).map((r) => r.countryEn).join(', '));
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
