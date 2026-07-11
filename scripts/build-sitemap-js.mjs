/**
 * Build assets/js/sitemap-published.js from sitemap.txt (for production — no public .txt).
 * Run: node scripts/build-sitemap-js.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const TXT = path.join(ROOT, 'sitemap.txt');
const OUT = path.join(ROOT, 'assets', 'js', 'sitemap-published.js');

function parseText(text) {
  const slugs = [];
  let updated = '';
  String(text || '').split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed) return;
    if (trimmed.startsWith('#')) {
      const m = trimmed.match(/^#\s*updated:\s*(.+)$/i);
      if (m) updated = m[1].trim();
      return;
    }
    slugs.push(trimmed);
  });
  slugs.sort((a, b) => a.localeCompare(b, 'zh-Hant'));
  return { updated, slugs };
}

function build() {
  if (!fs.existsSync(TXT)) {
    console.error('Missing sitemap.txt');
    process.exit(1);
  }
  const { updated, slugs } = parseText(fs.readFileSync(TXT, 'utf8'));
  const body = `/** Auto-generated from sitemap.txt — do not edit by hand. */
window.WA_PUBLISHED_SLUGS = ${JSON.stringify({ updated, slugs }, null, 2)};
`;
  fs.writeFileSync(OUT, body, 'utf8');
  console.log(`Wrote ${OUT} (${slugs.length} slugs)`);
}

build();
