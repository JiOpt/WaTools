/**
 * Download verified cosmos images locally and rewrite theme data to use ./img/*.
 * Run: node scripts/fix-cosmos-images.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { COSMOS_THEMES } from './data/cosmos-themes.mjs';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = path.join(ROOT, 'cosmos', 'img');

/** Large (>=50KB @ w=900) verified Unsplash IDs */
const POOL = [
  'photo-1419242902214-272b3f66ee7a',
  'photo-1446776811953-b23d57bd21aa',
  'photo-1451187580459-43490279c0fa',
  'photo-1462331940025-496dfbfc7564',
  'photo-1444703686981-a3abbc4d4fe3',
  'photo-1516339901601-2e1b62dc0c45',
  'photo-1543722530-d2c3201371e7',
  'photo-1517976487492-5750f3195933',
  'photo-1614728263952-84ea256f9679',
  'photo-1545156521-77bd85671d30',
  'photo-1465101046530-73398c7f28ca',
  'photo-1465146633011-14f8e0781093',
  'photo-1506703719100-a0f3a48c0f86',
  'photo-1464802686167-b939a6910659',
  'photo-1457369804613-52c61a468e7d',
  'photo-1447433819943-74a20887a81e',
  'photo-1501862700950-18382cd41497',
  'photo-1528722828814-77b9b83aafb2',
  'photo-1534796636912-3b95b3ab5986',
  'photo-1506905925346-21bda4d32df4',
  'photo-1464822759023-fed622ff2c3b',
  'photo-1519681393784-d120267933ba',
  'photo-1441974231531-c6227db76b6e',
  'photo-1507525428034-b723cf961d3e',
];

fs.mkdirSync(OUT_DIR, { recursive: true });

async function download(id, file) {
  const dest = path.join(OUT_DIR, file);
  if (fs.existsSync(dest) && fs.statSync(dest).size > 40000) {
    console.log('skip', file);
    return true;
  }
  const url = `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1000&q=80`;
  const r = await fetch(url, { redirect: 'follow' });
  if (!r.ok) {
    console.log('FAIL', r.status, id);
    return false;
  }
  const buf = Buffer.from(await r.arrayBuffer());
  if (buf.length < 40000) {
    console.log('SMALL', buf.length, id);
    return false;
  }
  fs.writeFileSync(dest, buf);
  console.log('ok', file, buf.length);
  return true;
}

const localFiles = [];
for (let i = 0; i < POOL.length; i++) {
  const file = `cx-${String(i + 1).padStart(2, '0')}.jpg`;
  const ok = await download(POOL[i], file);
  if (ok) localFiles.push(file);
}

if (localFiles.length < 8) {
  console.error('Not enough local images', localFiles.length);
  process.exit(1);
}

/** Per-theme 4 local files, rotating with offset for variety */
const map = {};
COSMOS_THEMES.forEach((t, ti) => {
  map[t.id] = [0, 1, 2, 3].map((j) => localFiles[(ti * 3 + j) % localFiles.length]);
});

const mapPath = path.join(ROOT, 'scripts', 'data', 'cosmos-img-map.json');
fs.writeFileSync(mapPath, JSON.stringify({ files: localFiles, byTheme: map }, null, 2));
console.log('Wrote', mapPath, 'themes', Object.keys(map).length, 'files', localFiles.length);
