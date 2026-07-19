/**
 * Parse ifreesite keyboard-symbols.htm into WA_KEYBOARD_SYMBOLS data.
 * Run: node scripts/fetch-keyboard-symbols-data.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const SOURCE_URL = 'https://www.ifreesite.com/typing/keyboard-symbols.htm';
const OUT = path.join(ROOT, 'assets', 'js', 'keyboard-symbols-data.js');
const SKIP_SECTIONS = new Set(['上標/下標', '組合：框線與表格']);

function decodeEntity(text) {
  return text
    .replace(/&cent;/g, '¢')
    .replace(/&laquo;/g, '«')
    .replace(/&raquo;/g, '»')
    .replace(/&yuml;/g, 'ÿ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCharCode(parseInt(h, 16)));
}

function cleanText(raw) {
  return decodeEntity(raw.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
}

function uniquePush(list, sym, label) {
  const s = sym.trim();
  if (!s) return;
  const key = `${s}\0${label || ''}`;
  if (list._seen?.has(key)) return;
  list._seen.add(key);
  list.push(label ? { sym: s, label } : s);
}

function extractFromList(html, list) {
  const blockRe = /<div class="if_list[^"]*">\s*([\s\S]*?)<\/div>/gi;
  let m;
  while ((m = blockRe.exec(html)) !== null) {
    const spanRe = /<span>([\s\S]*?)<\/span>/gi;
    let s;
    while ((s = spanRe.exec(m[1])) !== null) {
      uniquePush(list, cleanText(s[1]));
    }
  }
}

function extractFromTables(html, list) {
  const tableRe = /<table[^>]*class="if_tabletd[^"]*"[\s\S]*?<\/table>/gi;
  let t;
  while ((t = tableRe.exec(html)) !== null) {
    const rows = t[0].match(/<tr[\s\S]*?<\/tr>/gi) || [];
    rows.forEach((row) => {
      const cells = [...row.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)];
      cells.forEach((cell) => {
        const stara = cell[1].match(/<div class="if_table stara">([\s\S]*?)<\/div>/i);
        const tabls = cell[1].match(/<div class="if_tabls">([\s\S]*?)<\/div>/i);
        if (stara) uniquePush(list, cleanText(stara[1]), tabls ? cleanText(tabls[1]) : undefined);
      });
    });
  }
}

function extractFromTablm(html, list) {
  const re = /<div class="if_tablm"><font[^>]*>([\s\S]*?)<\/font><\/div>/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    const text = cleanText(m[1]);
    [...text].forEach((ch) => uniquePush(list, ch));
  }
}

function parseHtml(html) {
  const start = html.indexOf('<div class="tooltext">');
  const end = html.indexOf('</div>\n</div>\n  </section>', start);
  const body = start >= 0 ? html.slice(start, end > start ? end : undefined) : html;
  const parts = body.split(/<strong class="if_box[ecd]">/i).slice(1);
  const sections = [];

  parts.forEach((part) => {
    const titleEnd = part.indexOf('</strong>');
    if (titleEnd < 0) return;
    const title = cleanText(part.slice(0, titleEnd));
    if (!title || SKIP_SECTIONS.has(title)) return;
    const chunk = part.slice(titleEnd);
    const items = [];
    items._seen = new Set();
    extractFromList(chunk, items);
    extractFromTables(chunk, items);
    extractFromTablm(chunk, items);
    delete items._seen;
    if (!items.length) return;
    sections.push({
      id: title,
      title,
      items,
    });
  });

  return sections;
}

async function main() {
  const local = path.join(ROOT, '.tmp-keyboard-symbols-ifree.html');
  let html;
  if (fs.existsSync(local)) {
    html = fs.readFileSync(local, 'utf8');
  } else {
    const res = await fetch(SOURCE_URL, {
      headers: { 'User-Agent': 'KaWaTool/1.0 (keyboard-symbols)' },
    });
    if (!res.ok) throw new Error(`Fetch failed ${res.status}`);
    html = await res.text();
  }
  const sections = parseHtml(html);
  const total = sections.reduce((n, s) => n + s.items.length, 0);
  const body = `/* Auto-generated — ifreesite keyboard symbols */
window.WA_KEYBOARD_SYMBOLS = ${JSON.stringify({
    updated: new Date().toISOString().slice(0, 10),
    sourcePage: SOURCE_URL,
    intro: '特殊符號的出現，在社交網路以文字交流，簡化字節，DIY有個性的表情符號，以符號演繹文字表達心情；在網路寫日誌或發表文章，加入特定的符號，看得更加開心；也可以用來美化格式，吸引讀者在閱讀的時候，看得有趣之餘，而且內容表現出生動的效果。',
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
