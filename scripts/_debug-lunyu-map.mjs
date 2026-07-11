import { enrichScriptureContent } from './scripture-enrich.mjs';

const BASE = 'https://www.ifreesite.com/scriptures/';

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
    if (nextOpen !== -1 && nextOpen < nextClose) { depth += 1; i = nextOpen + 4; }
    else { depth -= 1; if (depth === 0) end = nextClose; i = nextClose + 6; }
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
  if (str.includes('十')) { const [a, b] = str.split('十'); return (n[a] || 0) * 10 + (b ? n[b] || 0 : 0); }
  return n[str] ?? null;
}

function chapterNumFromTitle(title) {
  const tailMatch = title.match(/第([零一二三四五六七八九十百\d]+)\s*$/);
  if (tailMatch) return chineseToNumber(tailMatch[1]);
  return null;
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
  return content.replace(/<div class="io_comment">[\s\S]*?<\/div>/gi, '').replace(/<div class="io_index">[\s\S]*?<\/div>/gi, '').trim();
}

const mainRaw = extractIoContentRaw(await (await fetch(`${BASE}analects.htm`)).text());
const indexMatch = mainRaw.match(/<div class="io_index">([\s\S]*?)<\/div>/i);
const links = [...indexMatch[1].matchAll(/href="([^"]+\.htm)"[^>]*>([\s\S]*?)<\/a>/gi)];

const map = new Map();
for (const m of links) {
  const label = stripTags(m[2]);
  const raw = extractIoContentRaw(await (await fetch(`${BASE}${m[1].replace(/^\.\//, '')}`)).text());
  const html = enrichScriptureContent(cleanSubpageContent(transformContent(raw)), 'lunyu');
  const num = chapterNumFromTitle(label);
  const h3count = (html.match(/<h3 class="scripture-chapter">/g) || []).length;
  console.log(`${label} -> num=${num}, h3=${h3count}, len=${html.length}`);
  if (h3count > 0) {
    const chunks = html.split(/<h3 class="scripture-chapter">/);
    for (let i = 1; i < chunks.length; i += 1) {
      const close = chunks[i].indexOf('</h3>');
      const title = chunks[i].slice(0, close).trim();
      const n = chapterNumFromTitle(title);
      if (n) console.log(`  h3 maps ${title} -> ${n}`);
    }
  }
  if (num) {
    const prev = map.get(num);
    if (prev) console.log(`  DUPLICATE num ${num}! was ${prev}, now ${label}`);
    map.set(num, label);
  }
}
