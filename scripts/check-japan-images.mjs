/**
 * Verify Japan section image URLs / local files.
 * Run: node scripts/check-japan-images.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

function collectUnsplash(file) {
  const s = fs.readFileSync(path.join(ROOT, file), 'utf8');
  return [...s.matchAll(/photo-([a-zA-Z0-9-]+)/g)].map((m) => m[1]);
}

function localMissing(dirRel, refs) {
  const dir = path.join(ROOT, dirRel);
  const files = new Set(fs.existsSync(dir) ? fs.readdirSync(dir) : []);
  return refs.filter((f) => !files.has(f));
}

const unsplashFiles = [
  'assets/js/japan-theme-tools.js',
  'assets/js/japan-theme-extra.js',
  'japan/js/gourmet.js',
];

const ids = new Set();
for (const f of unsplashFiles) {
  for (const id of collectUnsplash(f)) ids.add(id);
}

const bad = [];
for (const id of ids) {
  const url = `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=64&q=10`;
  try {
    const r = await fetch(url, { method: 'HEAD', redirect: 'follow' });
    if (!r.ok) bad.push({ id, status: r.status });
  } catch (e) {
    bad.push({ id, err: String(e.message || e) });
  }
}

const stayRefs = [
  ...fs.readFileSync(path.join(ROOT, 'assets/js/japan-theme-tools.js'), 'utf8')
    .matchAll(/['"]([a-z0-9-]+\.(?:jpg|jpeg|png))['"]/gi),
]
  .map((m) => m[1])
  .filter((f) => /ryokan|corridor|machiya|tea-|forest|lake/.test(f));

const shrineRefs = [
  ...fs.readFileSync(path.join(ROOT, 'assets/js/japanese-shrine-data.js'), 'utf8')
    .matchAll(/japanese-shrine-img\/([^'"]+)/g),
].map((m) => m[1]);

const animeRefs = [
  ...fs.readFileSync(path.join(ROOT, 'assets/js/anime-hometown-data.js'), 'utf8')
    .matchAll(/anime-hometown-img\/([^'"]+)/g),
].map((m) => m[1]);

console.log(JSON.stringify({
  unsplash: { checked: ids.size, bad },
  stayMissing: localMissing('japan/stay-img', stayRefs),
  shrineMissing: localMissing('japan/japanese-shrine-img', shrineRefs),
  animeMissing: localMissing('japan/anime-hometown-img', animeRefs),
}, null, 2));
