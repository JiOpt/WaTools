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
    const body = chunks[i].slice(endVerse + 4).trim();
    if (body) blocks.push(body);
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
  return content.replace(/<div class="io_comment">[\s\S]*?<\/div>/gi, '').replace(/<div class="io_index">[\s\S]*?<\/div>/gi, '').trim();
}

function parseSupplementChapterMap(supplements) {
  const map = new Map();
  for (const sup of supplements) {
    const chunks = sup.html.split(/<h3 class="scripture-chapter">/);
    if (chunks.length > 1) {
      for (let i = 1; i < chunks.length; i += 1) {
        const close = chunks[i].indexOf('</h3>');
        if (close === -1) continue;
        const title = chunks[i].slice(0, close).trim();
        const body = chunks[i].slice(close + 5).trim();
        const num = chapterNumFromTitle(title);
        if (num && body) map.set(num, { title, html: body });
      }
      continue;
    }
    const num = chapterNumFromTitle(sup.label);
    if (!num) continue;
    const note = parseSupplementNoteBody(sup.html);
    if (note.html) map.set(num, note);
  }
  return map;
}

function paraSummary(paraContent) {
  const plain = stripTags(paraContent).replace(/^\d+\.\s*/, '').replace(/\(\d+\.\d+\)\s*$/, '').trim();
  const quoteMatch = plain.match(/[「『"\u201c]([^」』"\u201d]+)[」』"\u201d]/u);
  if (quoteMatch) {
    const clause = quoteMatch[1].split(/[？！。]/)[0].trim();
    return clause.length > 28 ? `${clause.slice(0, 26)}…` : clause;
  }
  const first = plain.split(/[？！。]/)[0].trim();
  return first.length > 28 ? `${first.slice(0, 26)}…` : first;
}

function renderInlineNote(chapter) {
  return `<details class="scripture-inline-note scripture-inline-note-verse"><summary class="scripture-inline-note-title">${chapter.title}</summary><div class="scripture-inline-note-body">${chapter.html}</div></details>`;
}

function mergeInlineVerseNotes(mainContent, chapterMap) {
  return mainContent.replace(
    /<h3 class="scripture-chapter">([^<]+)<\/h3>((?:\s*<p class="scripture-para">[\s\S]*?<\/p>)*)/g,
    (block, chapterTitle, parasSection) => {
      const num = chapterNumFromTitle(chapterTitle);
      const chapter = chapterMap.get(num);
      if (!chapter) return block;
      const verseBlocks = parseSupplementVerseBlocks(chapter.html);
      let vi = 0;
      const newParas = parasSection.replace(/<p class="scripture-para">([\s\S]*?)<\/p>/g, (paraMatch, paraContent) => {
        const note = verseBlocks[vi];
        vi += 1;
        if (!note) return paraMatch;
        return `${paraMatch}${renderInlineNote({ title: paraSummary(paraContent), html: note })}`;
      });
      return `<h3 class="scripture-chapter">${chapterTitle}</h3>${newParas}`;
    }
  );
}

const mainRaw = extractIoContentRaw(await (await fetch(`${BASE}analects.htm`)).text());
const indexMatch = mainRaw.match(/<div class="io_index">([\s\S]*?)<\/div>/i);
const links = [...indexMatch[1].matchAll(/href="([^"]+\.htm)"[^>]*>([\s\S]*?)<\/a>/gi)];

const supplements = [];
for (const m of links) {
  const raw = extractIoContentRaw(await (await fetch(`${BASE}${m[1].replace(/^\.\//, '')}`)).text());
  supplements.push({
    label: stripTags(m[2]),
    html: enrichScriptureContent(cleanSubpageContent(transformContent(raw)), 'lunyu'),
  });
}

const chapterMap = parseSupplementChapterMap(supplements);
const ch1 = chapterMap.get(1);
console.log('Chapter 1 map blocks:', parseSupplementVerseBlocks(ch1.html).length);
console.log('Block0 starts:', stripTags(parseSupplementVerseBlocks(ch1.html)[0]).slice(0, 60));

const mainContent = transformContent(mainRaw.replace(/<div class="io_index">[\s\S]*?<\/div>/gi, '').replace(/<div class="io_comment">[\s\S]*?<\/div>/gi, ''));
const ch1match = mainContent.match(/<h3 class="scripture-chapter">學而第一<\/h3>((?:\s*<p class="scripture-para">[\s\S]*?<\/p>)*)/);
console.log('Main ch1 para count:', [...(ch1match?.[1].matchAll(/<p class="scripture-para">/g) || [])].length);

const merged = mergeInlineVerseNotes(mainContent, chapterMap);
const firstNote = merged.match(/學而第一[\s\S]*?<div class="scripture-inline-note-body">([\s\S]*?)<\/div>\s*<\/details>/);
console.log('Merged first note ann:', stripTags(firstNote?.[1] || '').slice(0, 60));
