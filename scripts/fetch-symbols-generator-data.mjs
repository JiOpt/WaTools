/**
 * Parse ifreesite symbols-generator.htm into WA_SYMBOLS_GENERATOR data.
 * Run: node scripts/fetch-symbols-generator-data.mjs
 */
import fs from 'fs';
import path from 'path';
import { decodeHtmlEntities } from './html-decode.mjs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const SOURCE_URL = 'https://www.ifreesite.com/typing/symbols-generator.htm';
const OUT = path.join(ROOT, 'assets', 'js', 'symbols-generator-data.js');

function parseTitle(raw) {
  return raw
    .replace(/<br\s*\/?>/gi, '')
    .replace(/\s+/g, '')
    .trim();
}

function extractItems(cellHtml) {
  const btnRe = /value="([^"]*)"/g;
  const items = [];
  const seen = new Set();
  let b;
  while ((b = btnRe.exec(cellHtml)) !== null) {
    let sym = decodeHtmlEntities(b[1]);
    if (!sym || seen.has(sym)) continue;
    seen.add(sym);
    items.push(sym);
  }
  return items;
}

function parseHtml(html) {
  const sections = [];
  const rowRe = /<tr bgcolor="#FFFFFF">\s*<td class="sym-b">\s*([\s\S]*?)<\/td>\s*<td class="sym-c">\s*([\s\S]*?)<\/td>/gi;
  let m;
  while ((m = rowRe.exec(html)) !== null) {
    const title = parseTitle(m[1]);
    if (!title) continue;
    const items = extractItems(m[2]);
    if (!items.length) continue;
    const last = sections[sections.length - 1];
    if (last && last.title === title) {
      last.items.push(...items);
    } else {
      sections.push({ id: title, title, items });
    }
  }
  return sections;
}

async function main() {
  const res = await fetch(SOURCE_URL, {
    headers: { 'User-Agent': 'KaWaTool/1.0 (symbols-generator)' },
  });
  if (!res.ok) throw new Error(`Fetch failed ${res.status}`);
  const html = await res.text();
  const sections = parseHtml(html);
  const total = sections.reduce((n, s) => n + s.items.length, 0);
  const body = `/* Auto-generated — ifreesite symbols generator */
window.WA_SYMBOLS_GENERATOR = ${JSON.stringify({
    updated: new Date().toISOString().slice(0, 10),
    sourcePage: SOURCE_URL,
    sectionCount: sections.length,
    itemCount: total,
    sections,
  }, null, 2)};
`;
  fs.writeFileSync(OUT, body, 'utf8');
  console.log(`sections: ${sections.length}, items: ${total}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
