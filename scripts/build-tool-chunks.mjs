/**
 * Build slug -> implementation chunk map from part1/2/3 + per-page data scripts.
 * Run: node scripts/build-tool-chunks.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'assets', 'js', 'tool-chunks.js');

const PARTS = [
  { id: 1, file: 'tools-implementations-part1.js' },
  { id: 2, file: 'tools-implementations-part2.js' },
  { id: 3, file: 'tools-implementations-part3.js' },
];

const SKIP_JS = new Set([
  'tool-ui.js',
  'tool-runner.js',
  'tool-boot.js',
  'tool-chunks.js',
  'main.js',
  'prefs-boot.js',
  'tools-implementations-part1.js',
  'tools-implementations-part2.js',
  'tools-implementations-part3.js',
]);

function slugFromPart(content, partId) {
  const map = {};
  for (const m of content.matchAll(/R\['([^']+)'\]\s*=/g)) {
    map[m[1]] = partId;
  }
  return map;
}

function extrasFromHtml(html) {
  const extras = [];
  for (const m of html.matchAll(/assets\/js\/([^"?]+\.js)/g)) {
    const base = m[1].split('/').pop();
    if (SKIP_JS.has(base)) continue;
    if (!extras.includes(base)) extras.push(base);
  }
  return extras;
}

const slugPart = {};
for (const { id, file } of PARTS) {
  const text = fs.readFileSync(path.join(ROOT, 'assets', 'js', file), 'utf8');
  Object.assign(slugPart, slugFromPart(text, id));
}

const htmlFiles = fs.readdirSync(ROOT).filter((f) => f.endsWith('.html') && f !== 'index.html' && f !== 'index_plan.html');
const chunks = {};

for (const file of htmlFiles) {
  const slug = file.replace(/\.html$/, '');
  const html = fs.readFileSync(path.join(ROOT, file), 'utf8');
  if (!html.includes('id="tool-app"')) continue;

  const part = slugPart[slug];
  if (!part) continue;

  const extra = extrasFromHtml(html);
  chunks[slug] = extra.length ? { part, extra } : { part };
}

const body = `/* Auto-generated — node scripts/build-tool-chunks.mjs */
window.WA_TOOL_CHUNKS = ${JSON.stringify(chunks, null, 2)};
`;
fs.writeFileSync(OUT, body, 'utf8');
console.log(`Wrote ${Object.keys(chunks).length} tool chunks -> ${OUT}`);
