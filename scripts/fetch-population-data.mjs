/**
 * Fetch country population indicators from World Bank Open Data.
 * Run: node scripts/fetch-population-data.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const FLAGS_DATA = path.join(ROOT, 'assets', 'js', 'world-flags-data.js');
const OUT_DATA = path.join(ROOT, 'assets', 'js', 'population-data.js');

const INDICATORS = {
  pop: 'SP.POP.TOTL',
  growth: 'SP.POP.GROW',
  birthRate: 'SP.DYN.CBRT.IN',
  deathRate: 'SP.DYN.CDRT.IN',
  fertility: 'SP.DYN.TFRT.IN',
  age0_14: 'SP.POP.0014.TO.ZS',
  age15_64: 'SP.POP.1564.TO.ZS',
  age65up: 'SP.POP.65UP.TO.ZS',
  depTotal: 'SP.POP.DPND',
  depYouth: 'SP.POP.DPND.YG',
  depOld: 'SP.POP.DPND.OL',
  malePct: 'SP.POP.TOTL.MA.ZS',
  femalePct: 'SP.POP.TOTL.FE.ZS',
  urbanPct: 'SP.URB.TOTL.IN.ZS',
  netMigration: 'SM.POP.NETM',
  lifeExp: 'SP.DYN.LE00.IN',
  healthyLife: 'SH.DYN.MHEL',
  density: 'EN.POP.DNST',
  literacy: 'SE.ADT.LITR.ZS',
};

const REGION_LABEL = {
  asia: '亞洲',
  europe: '歐洲',
  'north-america': '北美洲',
  africa: '非洲',
  'south-america': '南美洲',
  oceania: '大洋洲',
  other: '其他',
};

function loadFlagsIndex() {
  const src = fs.readFileSync(FLAGS_DATA, 'utf8');
  const sandbox = { window: {} };
  const wrapped = src.replace(/window\.WA_WORLD_FLAGS\s*=/, 'sandbox.window.WA_WORLD_FLAGS =');
  // eslint-disable-next-line no-new-func
  new Function('sandbox', wrapped)(sandbox);
  const data = sandbox.window.WA_WORLD_FLAGS;
  if (!data?.regions) throw new Error('Failed to parse world-flags-data.js');
  const byIso3 = new Map();
  for (const region of data.regions || []) {
    for (const c of region.countries || []) {
      if (!c.code) continue;
      byIso3.set(c.code.toUpperCase(), {
        nameZh: c.nameZh,
        nameEn: c.nameEn,
        regionId: region.id,
        regionLabel: region.label || REGION_LABEL[region.id] || region.id,
        flagImage: c.image || null,
      });
    }
  }
  return byIso3;
}

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} ${url}`);
  const data = await res.json();
  if (data?.message) {
    throw new Error(JSON.stringify(data.message));
  }
  return data;
}

async function fetchCountryMeta() {
  const url = 'https://api.worldbank.org/v2/country?format=json&per_page=400';
  const [, rows] = await fetchJson(url);
  return (rows || []).filter(
    (c) => c.region?.value !== 'Aggregates' && c.incomeLevel?.value !== 'Aggregates'
  );
}

async function fetchIndicator(key, indicatorId) {
  const url = `https://api.worldbank.org/v2/country/all/indicator/${indicatorId}?format=json&mrv=1&per_page=500`;
  process.stdout.write(`  ${key} (${indicatorId})… `);
  const [, rows] = await fetchJson(url);
  const map = new Map();
  for (const row of rows || []) {
    const iso3 = row.countryiso3code;
    if (!iso3 || iso3.length !== 3) continue;
    if (row.value == null) continue;
    map.set(iso3, { value: row.value, year: row.date });
  }
  console.log(map.size);
  return map;
}

function round(val, digits = 2) {
  if (val == null || Number.isNaN(val)) return null;
  const f = 10 ** digits;
  return Math.round(val * f) / f;
}

async function main() {
  console.log('Loading flag name index…');
  const flagsIndex = loadFlagsIndex();

  console.log('Fetching World Bank country list…');
  const countries = await fetchCountryMeta();
  const byIso3 = new Map();

  for (const c of countries) {
    const iso3 = c.id;
    const flag = flagsIndex.get(iso3);
    byIso3.set(iso3, {
      iso3,
      nameEn: flag?.nameEn || c.name,
      nameZh: flag?.nameZh || c.name,
      regionId: flag?.regionId || 'other',
      regionLabel: flag?.regionLabel || c.region?.value?.trim() || '其他',
      flagImage: flag?.flagImage || null,
    });
  }

  console.log('Fetching indicators…');
  const indicatorMaps = {};
  for (const [key, id] of Object.entries(INDICATORS)) {
    indicatorMaps[key] = await fetchIndicator(key, id);
  }

  const records = [];
  for (const [iso3, base] of byIso3) {
    const row = { ...base };
    let maxYear = 0;
    for (const [key] of Object.entries(INDICATORS)) {
      const hit = indicatorMaps[key].get(iso3);
      row[key] = hit ? hit.value : null;
      if (hit?.year) maxYear = Math.max(maxYear, Number(hit.year));
    }
    if (row.pop == null) continue;

    row.netMigrationRate =
      row.netMigration != null && row.pop
        ? round((row.netMigration / row.pop) * 1000, 2)
        : null;

    row.dataYear = maxYear || null;
    records.push(row);
  }

  records.sort((a, b) => (b.pop || 0) - (a.pop || 0));

  const worldPop = records.reduce((s, r) => s + (r.pop || 0), 0);
  const avg = (key) => {
    const vals = records.map((r) => r[key]).filter((v) => v != null);
    if (!vals.length) return null;
    return round(vals.reduce((s, v) => s + v, 0) / vals.length, 2);
  };

  const payload = {
    source: 'World Bank Open Data',
    sourceUrl: 'https://data.worldbank.org/',
    fetchedAt: new Date().toISOString().slice(0, 10),
    countryCount: records.length,
    world: {
      pop: worldPop,
      growth: avg('growth'),
      birthRate: avg('birthRate'),
      deathRate: avg('deathRate'),
      fertility: avg('fertility'),
      lifeExp: avg('lifeExp'),
      urbanPct: avg('urbanPct'),
      density: avg('density'),
    },
    regions: Object.entries(REGION_LABEL).map(([id, label]) => ({
      id,
      label,
      count: records.filter((r) => r.regionId === id).length,
    })).filter((r) => r.count > 0),
    countries: records,
  };

  const out = `/* Auto-generated by scripts/fetch-population-data.mjs — do not edit */\nwindow.WA_POPULATION = ${JSON.stringify(payload, null, 2)};\n`;
  fs.writeFileSync(OUT_DATA, out, 'utf8');
  console.log(`\nWrote ${records.length} countries → ${path.relative(ROOT, OUT_DATA)}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
