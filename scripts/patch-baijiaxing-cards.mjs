/**
 * Patch existing scripture/baijiaxing.html — surname table → compact cards.
 * Run: node scripts/patch-baijiaxing-cards.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = path.join(ROOT, 'scripture', 'baijiaxing.html');

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function isBaijiaxingSurnameCell(inner) {
  if (!/<strong>[^<]+<\/strong>/i.test(inner)) return false;
  return (inner.match(/<br\s*\/?>/gi) || []).length >= 2;
}

function tdInnerToBaijiaxingCard(inner) {
  if (!isBaijiaxingSurnameCell(inner)) return '';
  const charMatch = inner.match(/<strong>([^<]+)<\/strong>/i);
  if (!charMatch) return '';
  const char = charMatch[1].trim();
  const segments = inner
    .split(/<br\s*\/?>/i)
    .map((part) => part.replace(/<[^>]+>/g, '').trim())
    .filter(Boolean);
  const pinyin = segments[1] || '';
  const zhuyin = segments[2] || '';
  const linkMatch = inner.match(/<a\s+href="([^"]+)"[^>]*>([^<]*)<\/a>/i);
  const wiki = linkMatch
    ? `<a class="baijiaxing-wiki" href="${linkMatch[1]}" target="_blank" rel="noopener noreferrer">${escapeHtml((linkMatch[2] || '查»').trim())}</a>`
    : '';

  return `<article class="baijiaxing-card" role="listitem" aria-label="${escapeHtml(char)}姓">
  <div class="baijiaxing-char">${escapeHtml(char)}</div>
  ${pinyin ? `<div class="baijiaxing-pinyin">${escapeHtml(pinyin)}</div>` : ''}
  ${zhuyin ? `<div class="baijiaxing-zhuyin">${escapeHtml(zhuyin)}</div>` : ''}
  ${wiki}
</article>`;
}

function transformBaijiaxingMainGrid(html) {
  const marker = '<h4 class="scripture-subhead">百家姓</h4>';
  const start = html.indexOf(marker);
  if (start < 0) throw new Error('marker not found');

  const after = start + marker.length;
  const tail = html.slice(after);
  const endMatch = tail.match(/<\/table>\s*<\/td>\s*<\/tr>\s*<\/table>/i);
  if (!endMatch) throw new Error('table end not found');

  const tableEnd = after + endMatch.index + endMatch[0].length;
  const block = html.slice(after, tableEnd);
  const cards = [];
  const tdRe = /<td([^>]*)>([\s\S]*?)<\/td>/gi;
  let match;
  while ((match = tdRe.exec(block)) !== null) {
    if (/colspan/i.test(match[1])) continue;
    const card = tdInnerToBaijiaxingCard(match[2]);
    if (card) cards.push(card);
  }
  if (!cards.length) throw new Error('no surname cards parsed');

  const grid = `\n<div class="baijiaxing-grid" role="list">\n${cards.join('\n')}\n</div>\n`;
  return html.slice(0, after) + grid + html.slice(tableEnd);
}

let html = fs.readFileSync(TARGET, 'utf8');
if (html.includes('baijiaxing-grid')) {
  console.log('baijiaxing.html already has card grid — skipped');
  process.exit(0);
}

html = transformBaijiaxingMainGrid(html);
html = html.replace(
  '<article class="scripture-article">',
  '<article class="scripture-article baijiaxing-article">'
);

fs.writeFileSync(TARGET, html, 'utf8');
const count = (html.match(/baijiaxing-card/g) || []).length;
console.log(`Patched ${TARGET} — ${count} surname cards`);
