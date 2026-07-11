/**
 * Replace heavy part1+part2+part3 script tags with tool-boot.js on tool pages.
 * Run: node scripts/patch-tool-boot.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const VERSION = '0.6.17';

const BLOCK_RE = /(\s*<script src="assets\/js\/tool-ui\.js[^"]*"><\/script>)[\s\S]*?(<script src="assets\/js\/tool-runner\.js[^"]*"><\/script>)/;

const REPLACEMENT = `
  <script src="assets/js/tool-boot.js?v=${VERSION}"></script>`;

let patched = 0;
let skipped = 0;

for (const file of fs.readdirSync(ROOT)) {
  if (!file.endsWith('.html')) continue;
  if (file === 'index.html' || file === 'index_plan.html' || file === 'starter-page.html') continue;

  const full = path.join(ROOT, file);
  let html = fs.readFileSync(full, 'utf8');
  if (!html.includes('id="tool-app"')) continue;
  if (!BLOCK_RE.test(html)) {
    skipped += 1;
    continue;
  }

  html = html.replace(BLOCK_RE, REPLACEMENT);
  html = html.replace(/(<script src="assets\/js\/main\.js)\?v=[^"]+("><\/script>)/, `$1?v=${VERSION}$2`);
  html = html.replace(/(<link href="assets\/css\/main\.css)\?v=[^"]+(")/, `$1?v=${VERSION}$2`);
  fs.writeFileSync(full, html, 'utf8');
  patched += 1;
}

console.log(`Patched ${patched} tool pages, skipped ${skipped}.`);
