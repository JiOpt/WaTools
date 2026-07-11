import { enrichScriptureContent } from './scripture-enrich.mjs';
import fs from 'fs';

const BASE = 'https://www.ifreesite.com/scriptures/';

function loadCatalog() {
  const src = fs.readFileSync('assets/js/scriptures-catalog.js', 'utf8');
  const body = src.replace(/^window\.WA_SCRIPTURES_CATALOG\s*=\s*/, '').replace(/;\s*$/, '');
  return Function(`return ${body}`)();
}

function extractIoContentRaw(html) {
  const openTag = '<div id="io_content">';
  const start = html.indexOf(openTag);
  if (start === -1) return '';
  let i = start + openTag.length;
  let depth = 1;
  let end = -1;
  while (i < html.length && depth > 0) {
    const nextOpen = html.indexOf('<div', i);
    const nextClose = html.indexOf('</div>', i);
    if (nextClose === -1) break;
    if (nextOpen !== -1 && nextOpen < nextClose) {
      depth += 1;
      i = nextOpen + 4;
    } else {
      depth -= 1;
      if (depth === 0) end = nextClose;
      i = nextClose + 6;
    }
  }
  return end === -1 ? '' : html.slice(start + openTag.length, end);
}

function stripTags(str) {
  return String(str).replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
}

function chineseToNumber(str) {
  const n = { 零: 0, 一: 1, 二: 2, 三: 3, 四: 4, 五: 5, 六: 6, 七: 7, 八: 8, 九: 9 };
  str = String(str).trim();
  if (/^\d+$/.test(str)) return parseInt(str, 10);
  if (str === '十') return 10;
  if (str.length === 2 && str[1] === '十') return n[str[0]] * 10;
  if (str.startsWith('十')) return 10 + (n[str[1]] || 0);
  if (str.includes('十')) {
    const [a, b] = str.split('十');
    return (n[a] || 0) * 10 + (b ? n[b] || 0 : 0);
  }
  return n[str] ?? null;
}

function chapterNumFromTitle(title) {
  const tailMatch = title.match(/第([零一二三四五六七八九十百\d]+)\s*$/);
  if (tailMatch) return chineseToNumber(tailMatch[1]);
  return null;
}

function parseSupplementNoteBody(html) {
  const stripped = html.replace(/^<h2 class="scripture-main-title">[\s\S]*?<\/h2>\s*/i, '').trim();
  const annMatch = stripped.match(/<div class="scripture-annotation[^"]*">([\s\S]*?)<\/div>\s*$/);
  if (annMatch) return { title: '【釋文】', html: annMatch[1].trim() };
  return { title: '註釋解讀', html: stripped };
}

function parseSupplementVerseBlocks(html) {
  const blocks = [];
  const chunks = html.split(/<p class="scripture-verse">/);
  for (let i = 1; i < chunks.length; i += 1) {
    const endVerse = chunks[i].indexOf('</p>');
    if (endVerse === -1) continue;
    const verse = chunks[i].slice(0, endVerse);
    const body = chunks[i].slice(endVerse + 4).trim();
    if (body) blocks.push({ verse: stripTags(verse), ann: stripTags(body).slice(0, 50) });
  }
  return blocks;
}

function transformContent(content) {
  let out = content;
  out = out.replace(/<h2(\s[^>]*)?>/gi, '<h3 class="scripture-chapter"$1>');
  out = out.replace(/<\/h2>/gi, '</h3>');
  out = out.replace(/<h1(\s[^>]*)?>/gi, '<h2 class="scripture-main-title"$1>');
  out = out.replace(/<\/h1>/gi, '</h2>');
  out = out.replace(/class="io_color1"/g, 'class="scripture-verse"');
  out = out.replace(/class="io_sanskrit"/g, 'class="scripture-annotation"');
  out = out.replace(/class="io_description"/g, 'class="scripture-translation"');
  out = out.replace(/class="io_synopsis"/g, 'class="scripture-exegesis"');
  out = out.replace(/<p>/g, '<p class="scripture-para">');
  return out.trim();
}

function cleanSubpageContent(content) {
  return content
    .replace(/<div class="io_comment">[\s\S]*?<\/div>/gi, '')
    .replace(/<div class="io_index">[\s\S]*?<\/div>/gi, '')
    .trim();
}

const raw = extractIoContentRaw(await (await fetch(`${BASE}analects-01.htm`)).text());
const transformed = cleanSubpageContent(transformContent(raw));
const enriched = enrichScriptureContent(transformed, 'lunyu');

console.log('verse tags after transform:', (transformed.match(/scripture-verse/g) || []).length);
console.log('verse tags after enrich:', (enriched.match(/scripture-verse/g) || []).length);

const note = parseSupplementNoteBody(enriched);
const blocks = parseSupplementVerseBlocks(note.html);
console.log('blocks:', blocks.length);
blocks.slice(0, 3).forEach((b, i) => console.log(i, b.verse.slice(0, 40), '->', b.ann));

// Check h3 split path
const chunks = enriched.split(/<h3 class="scripture-chapter">/);
console.log('h3 chunks:', chunks.length);

// Simulate merge first para
const mainRaw = extractIoContentRaw(await (await fetch(`${BASE}analects.htm`)).text());
const mainContent = transformContent(mainRaw.replace(/<div class="io_index">[\s\S]*?<\/div>/gi, '').replace(/<div class="io_comment">[\s\S]*?<\/div>/gi, ''));
const chMatch = mainContent.match(/<h3 class="scripture-chapter">學而第一<\/h3>((?:\s*<p class="scripture-para">[\s\S]*?<\/p>)*)/);
const firstPara = chMatch?.[1].match(/<p class="scripture-para">([\s\S]*?)<\/p>/)?.[1];
console.log('first para:', stripTags(firstPara || '').slice(0, 50));
console.log('would attach block0 ann:', blocks[0]?.ann);
console.log('would attach block1 ann:', blocks[1]?.ann);
