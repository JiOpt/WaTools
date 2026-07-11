/**
 * Parse ifreesite typing/punctuation/ into WA_PUNCTUATION data.
 * Run: node scripts/fetch-punctuation-data.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const SOURCE_URL = 'https://www.ifreesite.com/typing/punctuation/';
const OUT = path.join(ROOT, 'assets', 'js', 'punctuation-data.js');

function decodeValue(raw) {
  return raw
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\r\n/g, '\n')
    .trim();
}

function cleanText(raw) {
  return raw.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function uniquePush(list, sym) {
  const s = sym.trim();
  if (!s || list._seen.has(s)) return;
  list._seen.add(s);
  list.push(s);
}

function extractClipboardValues(chunk, list) {
  const re = /<clipboard-copy[^>]*\svalue=(?:"([\s\S]*?)"|'([^']*?)')/gi;
  let m;
  while ((m = re.exec(chunk)) !== null) {
    uniquePush(list, decodeValue(m[1] ?? m[2] ?? ''));
  }
}

function extractCubeBlocks(chunk, list) {
  const re = /<div id="cy-textx\d+"[^>]*>([\s\S]*?)<\/div>/gi;
  let m;
  while ((m = re.exec(chunk)) !== null) {
    const text = m[1]
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<[^>]+>/g, '')
      .trim();
    uniquePush(list, text);
  }
}

function parseHtml(html) {
  const intro = [];
  const introBlock = html.match(/<div class="io_special">([\s\S]*?)<table/i);
  if (introBlock) {
    const pRe = /<p>([\s\S]*?)<\/p>/gi;
    let p;
    while ((p = pRe.exec(introBlock[1])) !== null) {
      const t = cleanText(p[1]);
      if (t && !t.startsWith('💡')) intro.push(t);
    }
    const tip = introBlock[1].match(/<p><strong>💡提示：<\/strong>([\s\S]*?)<\/p>/i);
    if (tip) intro.push(`提示：${cleanText(tip[1])}`);
  }

  const sections = [];
  const parts = html.split(/<span class="starp">/i).slice(1);
  parts.forEach((part) => {
    const titleEnd = part.indexOf('</span>');
    if (titleEnd < 0) return;
    const title = cleanText(part.slice(0, titleEnd));
    const chunk = part.slice(titleEnd);
    const items = [];
    items._seen = new Set();
    extractClipboardValues(chunk, items);
    extractCubeBlocks(chunk, items);
    delete items._seen;
    if (!title || !items.length) return;
    sections.push({ id: title, title, items });
  });

  return { intro, sections };
}

async function main() {
  const local = path.join(ROOT, '.tmp-punctuation-ifree.html');
  let html;
  if (fs.existsSync(local)) {
    html = fs.readFileSync(local, 'utf8');
  } else {
    const res = await fetch(SOURCE_URL, {
      headers: { 'User-Agent': 'WaWaTools/1.0 (punctuation)' },
    });
    if (!res.ok) throw new Error(`Fetch failed ${res.status}`);
    html = await res.text();
  }

  const { intro, sections } = parseHtml(html);
  const total = sections.reduce((n, s) => n + s.items.length, 0);
  const body = `/* Auto-generated — ifreesite punctuation */
window.WA_PUNCTUATION = ${JSON.stringify({
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
