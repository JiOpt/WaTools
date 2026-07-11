/**
 * Parse ifreesite typing/symbols-name.htm into WA_SYMBOLS_NAME data.
 * Run: node scripts/fetch-symbols-name-data.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const SOURCE_URL = 'https://www.ifreesite.com/typing/symbols-name.htm';
const OUT = path.join(ROOT, 'assets', 'js', 'symbols-name-data.js');

function decodeHtml(raw) {
  return raw
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(+d))
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&apos;/g, "'");
}

function cellText(raw) {
  let text = decodeHtml(
    raw
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<[^>]+>/g, '')
      .replace(/\r\n/g, '\n')
  );
  text = text
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n[ \t]+/g, '\n')
    .replace(/\n{2,}/g, '\n')
    .trim();
  return text;
}

function lineText(raw) {
  return decodeHtml(
    raw
      .replace(/<br\s*\/?>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
  );
}

function pushItem(list, item) {
  const sym = (item.sym || '').trim();
  if (!sym) return;
  const key = `${sym}\0${item.zh || ''}`;
  if (list._seen.has(key)) return;
  list._seen.add(key);
  list.push({
    sym,
    zh: (item.zh || '').trim(),
    en: (item.en || '').trim(),
  });
}

function parseThreeCol(chunk, list) {
  const re = /<td[^>]*>\s*<div class="if_tabl(?:e|m)[^"]* centerme starh[^"]*">([\s\S]*?)<\/div>\s*<\/td>\s*<td[^>]*>\s*<div class="if_tabls starg">([\s\S]*?)<\/div>\s*<\/td>\s*<td[^>]*>\s*<div class="if_tabls stari">([\s\S]*?)<\/div>\s*<\/td>/gi;
  let m;
  while ((m = re.exec(chunk)) !== null) {
    pushItem(list, {
      sym: cellText(m[1]),
      en: lineText(m[2]),
      zh: lineText(m[3]),
    });
  }
}

function parsePairCol(chunk, list) {
  const re = /<div class="if_tablm centerme starh">([\s\S]*?)<\/div>\s*<\/td>\s*<td[^>]*>\s*<div class="if_tabls stari">([\s\S]*?)<\/div>/gi;
  let m;
  while ((m = re.exec(chunk)) !== null) {
    pushItem(list, {
      sym: cellText(m[1]),
      zh: lineText(m[2]),
      en: '',
    });
  }
}

function parseNumberCol(chunk, list) {
  const re = /<td[^>]*>\s*<div class="if_tabl(?:e|m)[^"]* starh[^"]*">([\s\S]*?)<\/div>\s*<\/td>\s*<td[^>]*>\s*<div class="if_tabls starg">([\s\S]*?)<\/div>\s*<\/td>\s*<td[^>]*>\s*<div class="if_tabls stare">([\s\S]*?)<\/div>\s*<\/td>\s*<td[^>]*>\s*<div class="if_tabls stari">([\s\S]*?)<\/div>\s*<\/td>/gi;
  let m;
  while ((m = re.exec(chunk)) !== null) {
    const roman = cellText(m[1]);
    const en = lineText(m[2]);
    const arabic = lineText(m[3]);
    const zh = lineText(m[4]);
    const sym = roman === '--' || roman === '—' ? arabic : roman;
    pushItem(list, { sym, en, zh });
  }
}

function parseSection(title, chunk) {
  const items = [];
  items._seen = new Set();
  if (title === '文本標點符號') {
    parsePairCol(chunk, items);
  } else if (title === '數字符號') {
    parseNumberCol(chunk, items);
  } else {
    parseThreeCol(chunk, items);
  }
  delete items._seen;
  return items;
}

function parseHtml(html) {
  const intro = [];
  const introMatch = html.match(/<p class="tbi">([\s\S]*?)<\/p>/i);
  if (introMatch) intro.push(lineText(introMatch[1]));

  const sections = [];
  const parts = html.split(/<strong class="if_boxf">/i).slice(1);
  parts.forEach((part) => {
    const titleEnd = part.indexOf('</strong>');
    if (titleEnd < 0) return;
    const title = lineText(part.slice(0, titleEnd));
    const chunk = part.slice(titleEnd);
    const items = parseSection(title, chunk);
    if (!title || !items.length) return;
    sections.push({ id: title, title, items });
  });

  return { intro, sections };
}

async function main() {
  const local = path.join(ROOT, '.tmp-symbols-name-ifree.html');
  let html;
  if (fs.existsSync(local)) {
    html = fs.readFileSync(local, 'utf8');
  } else {
    const res = await fetch(SOURCE_URL, {
      headers: { 'User-Agent': 'WaWaTools/1.0 (symbols-name)' },
    });
    if (!res.ok) throw new Error(`Fetch failed ${res.status}`);
    html = await res.text();
  }

  const { intro, sections } = parseHtml(html);
  const total = sections.reduce((n, s) => n + s.items.length, 0);
  const body = `/* Auto-generated — ifreesite symbols-name */
window.WA_SYMBOLS_NAME = ${JSON.stringify({
    updated: new Date().toISOString().slice(0, 10),
    sourcePage: SOURCE_URL,
    intro,
    sectionCount: sections.length,
    itemCount: total,
    sections,
  }, null, 2)};
`;
  fs.writeFileSync(OUT, body, 'utf8');
  console.log(`sections: ${sections.length}, items: ${total}`);
  sections.forEach((s) => console.log(`  ${s.title}: ${s.items.length}`));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
