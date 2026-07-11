/**
 * Parse ifreesite /emoji/ into WA_EMOJI data.
 * Run: node scripts/fetch-emoji-data.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const SOURCE_URL = 'https://www.ifreesite.com/emoji/';
const OUT = path.join(ROOT, 'assets', 'js', 'emoji-data.js');

function cleanText(raw) {
  return raw.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function splitTokens(text) {
  const raw = text.replace(/\s+/g, ' ').trim();
  if (!raw) return [];
  if (typeof Intl !== 'undefined' && Intl.Segmenter) {
    const seg = new Intl.Segmenter(undefined, { granularity: 'grapheme' });
    const parts = [];
    let buf = '';
    for (const { segment } of seg.segment(raw)) {
      if (/^\s+$/.test(segment)) {
        if (buf) {
          parts.push(buf);
          buf = '';
        }
      } else {
        buf += segment;
      }
    }
    if (buf) parts.push(buf);
    return parts;
  }
  return raw.split(/\s+/).filter(Boolean);
}

function uniqueItems(items) {
  const seen = new Set();
  const out = [];
  items.forEach((item) => {
    if (!item || seen.has(item)) return;
    seen.add(item);
    out.push(item);
  });
  return out;
}

function parseHtml(html) {
  const intro = [];
  const introRe = /<p class="tbi">([\s\S]*?)<\/p>/gi;
  let ip;
  while ((ip = introRe.exec(html)) !== null) {
    const t = cleanText(ip[1]);
    if (t) intro.push(t);
  }

  const tags = [];
  const tagRe = /<a href="[^"]*" rel="bookmark" class="[^"]*">([\s\S]*?)<\/a>/gi;
  let tg;
  while ((tg = tagRe.exec(html)) !== null) {
    const t = cleanText(tg[1]);
    if (t) tags.push(t);
  }

  const sections = [];
  const secRe = /<div class="boxtitlh">([\s\S]*?)<\/div>\s*<p class="if_is">\s*([\s\S]*?)<\/p>/gi;
  let m;
  while ((m = secRe.exec(html)) !== null) {
    const title = cleanText(m[1]);
    const items = uniqueItems(splitTokens(cleanText(m[2])));
    if (!title || !items.length) continue;
    sections.push({ id: title, title, items });
  }

  return { intro, tags, sections };
}

async function main() {
  const local = path.join(ROOT, '.tmp-emoji-ifree.html');
  let html;
  if (fs.existsSync(local)) {
    html = fs.readFileSync(local, 'utf8');
  } else {
    const res = await fetch(SOURCE_URL, {
      headers: { 'User-Agent': 'WaWaTools/1.0 (emoji)' },
    });
    if (!res.ok) throw new Error(`Fetch failed ${res.status}`);
    html = await res.text();
  }

  const { intro, tags, sections } = parseHtml(html);
  const total = sections.reduce((n, s) => n + s.items.length, 0);
  const body = `/* Auto-generated — ifreesite emoji */
window.WA_EMOJI = ${JSON.stringify({
    updated: new Date().toISOString().slice(0, 10),
    sourcePage: SOURCE_URL,
    intro,
    tags,
    sectionCount: sections.length,
    itemCount: total,
    sections,
  }, null, 2)};
`;
  fs.writeFileSync(OUT, body, 'utf8');
  console.log(`sections: ${sections.length}, items: ${total}, tags: ${tags.length}`);
  sections.forEach((s) => console.log(`  ${s.title}: ${s.items.length}`));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
