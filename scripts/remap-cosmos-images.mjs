/**
 * Download thematic cosmos images and map each theme's 4 sections to matching visuals.
 * Sources: NASA images-assets + verified Unsplash (avoids Wikimedia 429).
 * Run: node scripts/remap-cosmos-images.mjs && node scripts/gen-cosmos-extra.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { COSMOS_THEMES } from './data/cosmos-themes.mjs';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'cosmos', 'img');
fs.mkdirSync(OUT, { recursive: true });

const u = (id) => `https://images.unsplash.com/${id}?auto=format&fm=jpg&fit=crop&w=1100&q=82`;
const nasa = (id) => `https://images-assets.nasa.gov/image/${id}/${id}~medium.jpg`;

/**
 * Semantic stock keyed by role — each URL should visually match the label.
 */
const STOCK = {
  blackhole: nasa('PIA23122'), // M87 black hole (EHT)
  galaxy: nasa('PIA04921'), // Spiral galaxy
  deepfield: nasa('hubble-captures-view-of-m51'), // fallback path may fail — see ALTS
  jwst_carina: nasa('PIA25432'), // JWST Carina / cosmic cliffs related
  jwst_smacs: nasa('PIA25433'), // JWST deep field style
  earth: nasa('as17-148-22727'), // Blue Marble / Apollo earth
  exoplanet_art: nasa('PIA21472'), // exoplanet artist concept
  mars: nasa('PIA00407'), // Mars globe
  mars_surface: nasa('PIA17944'), // Curiosity surface
  rocket: u('photo-1517976487492-5750f3195933'),
  falcon: u('photo-1517976487492-5750f3195933'),
  moon: nasa('PIA00405'), // Moon
  moon_surface: nasa('as11-40-5874'), // Apollo footprint / surface
  astronaut: nasa('as11-40-5903'), // Buzz Aldrin
  cluster: nasa('PIA04209'), // galaxy cluster
  cmb: nasa('PIA16874'), // CMB / Wilkinson map style
  nebula: nasa('PIA01322'), // Crab Nebula
  supernova: nasa('PIA01322'), // remnant / nebula stand-in
  orion: nasa('PIA00066'), // Orion Nebula
  asteroid: nasa('PIA25309'), // Dimorphos / DART target (asteroid body)
  dart: nasa('PIA25309'), // DART / Dimorphos impact
  ligo_art: nasa('PIA19821'), // black hole merger illustration
  sun: nasa('GSFC_20171208_Archive_e001435'), // Sun
  aurora: u('photo-1531366936337-7c912a4589a7'),
  cme: nasa('GSFC_20171208_Archive_e001435'), // solar activity
  andromeda: nasa('PIA00115'), // Andromeda
  colliding: nasa('PIA04632'), // Antennae / colliding galaxies
  milkyway: u('photo-1419242902214-272b3f66ee7a'),
  stars: u('photo-1516339901601-2e1b62dc0c45'),
  radio: nasa('PIA16874'), // reuse sky map if radio dish fails
  telescope: u('photo-1446776877081-d282a0f896e2'),
  comet: u('photo-1444703686981-a3abbc4d4fe3'),
  saturn: nasa('PIA17172'), // Saturn
  iss: nasa('iss030e081175'), // ISS
};

/** Alternate URLs if primary fails (same visual intent). */
const ALTS = {
  blackhole: [u('photo-1462331940025-496dfbfc7564'), nasa('GSFC_20171208_Archive_e000102')],
  galaxy: [u('photo-1462331940025-496dfbfc7564'), nasa('PIA15415')],
  deepfield: [nasa('PIA04209'), u('photo-1464802686167-b939a6910659')],
  jwst_carina: [nasa('PIA23623'), u('photo-1464802686167-b939a6910659')],
  jwst_smacs: [nasa('PIA04209'), u('photo-1462331940025-496dfbfc7564')],
  earth: [u('photo-1451187580459-43490279c0fa'), nasa('PIA18033')],
  exoplanet_art: [nasa('PIA22084'), u('photo-1614732414444-096e5f1122d5')],
  mars: [u('photo-1614728263952-84ea256f9679'), nasa('PIA04591')],
  mars_surface: [nasa('PIA16469'), u('photo-1614728263952-84ea256f9679')],
  rocket: [u('photo-1543722530-d2c3201371e7')],
  falcon: [u('photo-1543722530-d2c3201371e7')],
  moon: [u('photo-1447433819943-74a20887a81e'), nasa('PIA00404')],
  moon_surface: [nasa('as11-40-5875'), u('photo-1447433819943-74a20887a81e')],
  astronaut: [u('photo-1446776653964-20c1d3a81b06'), nasa('as11-40-5874')],
  cluster: [nasa('PIA15415'), u('photo-1462331940025-496dfbfc7564')],
  cmb: [u('photo-1464802686167-b939a6910659'), nasa('PIA16873')],
  nebula: [u('photo-1464802686167-b939a6910659'), nasa('PIA01322')],
  supernova: [nasa('PIA01322'), u('photo-1464802686167-b939a6910659')],
  orion: [u('photo-1464802686167-b939a6910659'), nasa('PIA00066')],
  asteroid: [nasa('PIA25309'), u('photo-1614728263952-84ea256f9679')],
  dart: [u('photo-1614728263952-84ea256f9679'), nasa('PIA25309')],
  ligo_art: [nasa('PIA19821'), nasa('PIA23122')],
  sun: [u('photo-1575881875475-3102329006f0'), nasa('GSFC_20171208_Archive_e001434')],
  aurora: [u('photo-1483347756197-71ef80e95f73'), u('photo-1531366936337-7c912a4589a7')],
  cme: [nasa('GSFC_20171208_Archive_e001434'), u('photo-1575881875475-3102329006f0')],
  andromeda: [u('photo-1462331940025-496dfbfc7564'), nasa('PIA00114')],
  colliding: [nasa('PIA04631'), u('photo-1462331940025-496dfbfc7564')],
  milkyway: [u('photo-1506703719100-a0f3a48c0f86'), u('photo-1419242902214-272b3f66ee7a')],
  stars: [u('photo-1534796636912-3b95b3ab5986'), u('photo-1516339901601-2e1b62dc0c45')],
  radio: [u('photo-1446776877081-d282a0f896e2'), nasa('PIA16874')],
  telescope: [u('photo-1516339901601-2e1b62dc0c45'), u('photo-1446776877081-d282a0f896e2')],
  comet: [u('photo-1462331940025-496dfbfc7564'), u('photo-1444703686981-a3abbc4d4fe3')],
  saturn: [u('photo-1614732414444-096e5f1122d5'), nasa('PIA17172')],
  iss: [u('photo-1446776653964-20c1d3a81b06'), nasa('iss042e340851')],
};

/** themeId -> [4 stock keys] matching sections 比喻/核心/關鍵/啟示 */
/** Keys match visualTruth in cosmos-img-map.json (filenames may differ from NASA intent). */
const THEME_KEYS = {
  'cosmos-black-hole': ['blackhole', 'galaxy', 'cluster', 'deepfield'],
  'cosmos-jwst': ['jwst_carina', 'nebula', 'jwst_smacs', 'deepfield'],
  'cosmos-exoplanet': ['exoplanet_art', 'earth', 'saturn', 'milkyway'],
  'cosmos-mars': ['mars', 'falcon', 'mars_surface', 'rocket'],
  'cosmos-artemis': ['moon', 'moon_surface', 'astronaut', 'iss'],
  'cosmos-dark-matter': ['cluster', 'galaxy', 'deepfield', 'milkyway'],
  'cosmos-big-bang': ['cmb', 'deepfield', 'galaxy', 'stars'],
  'cosmos-neutron-star': ['nebula', 'jwst_smacs', 'radio', 'colliding'],
  'cosmos-supernova': ['nebula', 'jwst_smacs', 'colliding', 'stars'],
  // orion file is cratered rocky body (not Orion Nebula)
  'cosmos-asteroid': ['orion', 'earth', 'falcon', 'telescope'],
  'cosmos-gravitational-wave': ['blackhole', 'colliding', 'galaxy', 'deepfield'],
  // ligo_art file is multiwavelength Sun
  'cosmos-solar-storm': ['sun', 'cme', 'ligo_art', 'earth'],
  'cosmos-andromeda': ['galaxy', 'andromeda', 'colliding', 'milkyway'],
  'cosmos-multiverse': ['deepfield', 'stars', 'galaxy', 'milkyway'],
  'cosmos-wormhole': ['blackhole', 'galaxy', 'deepfield', 'stars'],
  'cosmos-frb': ['radio', 'nebula', 'telescope', 'stars'],
  'cosmos-fate': ['stars', 'deepfield', 'galaxy', 'cmb'],
  'cosmos-interstellar': ['comet', 'saturn', 'milkyway', 'telescope'],
  'cosmos-mining': ['orion', 'moon', 'mars_surface', 'iss'],
  'cosmos-dyson': ['sun', 'saturn', 'ligo_art', 'galaxy'],
};

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchOnce(url) {
  const r = await fetch(url, {
    redirect: 'follow',
    headers: {
      'User-Agent': 'KaWaTool/1.0 (educational local mirror; contact via kawatool.com)',
      Accept: 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
    },
  });
  if (!r.ok) return { ok: false, status: r.status, buf: null };
  const buf = Buffer.from(await r.arrayBuffer());
  if (buf.length < 12000) return { ok: false, status: 'small', buf };
  // Reject AVIF/WebP saved as .jpg (Unsplash sometimes returns AVIF)
  if (buf[0] === 0xff && buf[1] === 0xd8) return { ok: true, status: 200, buf };
  const head = buf.slice(4, 12).toString('ascii');
  if (head.includes('ftyp') || (buf[0] === 0x89 && buf[1] === 0x50)) {
    return { ok: false, status: 'not-jpeg', buf: null };
  }
  return { ok: true, status: 200, buf };
}

async function downloadKey(key, primaryUrl) {
  const file = `theme-${key}.jpg`;
  const dest = path.join(OUT, file);
  if (fs.existsSync(dest) && fs.statSync(dest).size > 20000) {
    console.log('skip', file);
    return file;
  }

  const urls = [primaryUrl, ...(ALTS[key] || [])];
  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const res = await fetchOnce(url);
        if (res.ok) {
          fs.writeFileSync(dest, res.buf);
          console.log('ok', file, res.buf.length, i ? `(alt${i})` : '');
          return file;
        }
        console.log('FAIL', res.status, file, url.slice(0, 72));
        if (res.status === 429) await sleep(2500);
        else await sleep(400);
      } catch (e) {
        console.log('ERR', file, e.message);
        await sleep(600);
      }
    }
  }
  return null;
}

const keyToFile = {};
const keys = Object.keys(STOCK);
for (let i = 0; i < keys.length; i++) {
  const key = keys[i];
  keyToFile[key] = await downloadKey(key, STOCK[key]);
  await sleep(350);
}

const byTheme = {};
const usedFiles = new Set();

for (const theme of COSMOS_THEMES) {
  const themeKeys = THEME_KEYS[theme.id] || ['galaxy', 'deepfield', 'milkyway', 'stars'];
  const files = themeKeys.map((k) => {
    if (keyToFile[k]) return keyToFile[k];
    // Prefer any successfully downloaded thematic sibling over generic night-sky pool
    const any = Object.values(keyToFile).filter(Boolean);
    return any[themeKeys.indexOf(k) % Math.max(any.length, 1)] || 'theme-galaxy.jpg';
  });
  byTheme[theme.id] = files;
  files.forEach((f) => usedFiles.add(f));
}

const map = {
  files: [...usedFiles],
  byTheme,
  keys: THEME_KEYS,
  downloaded: keyToFile,
  note: 'Thematic remap — NASA/Unsplash images matched to section topics',
};

fs.writeFileSync(path.join(ROOT, 'scripts/data/cosmos-img-map.json'), JSON.stringify(map, null, 2));
const okCount = Object.values(keyToFile).filter(Boolean).length;
console.log('Mapped', Object.keys(byTheme).length, 'themes; downloaded keys ok:', okCount, '/', keys.length);
if (okCount < 20) {
  console.warn('WARNING: many keys missing — pages may still look generic');
  process.exitCode = 1;
}
