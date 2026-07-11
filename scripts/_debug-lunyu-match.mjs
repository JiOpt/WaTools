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
  if (end === -1) return '';
  return html.slice(start + openTag.length, end);
}

function stripTags(str) {
  return String(str).replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
}

function parseSupplementVerseBlocks(html) {
  const blocks = [];
  const chunks = html.split(/<p class="scripture-verse">/);
  for (let i = 1; i < chunks.length; i += 1) {
    const endVerse = chunks[i].indexOf('</p>');
    if (endVerse === -1) continue;
    const verse = chunks[i].slice(0, endVerse);
    const body = chunks[i].slice(endVerse + 4).trim();
    if (body) blocks.push({ verse: stripTags(verse), html: body });
  }
  return blocks;
}

function transformContent(content) {
  let out = content;
  out = out.replace(/class="io_color1"/g, 'class="scripture-verse"');
  out = out.replace(/class="io_sanskrit"/g, 'class="scripture-annotation"');
  out = out.replace(/class="io_description"/g, 'class="scripture-translation"');
  out = out.replace(/class="io_synopsis"/g, 'class="scripture-exegesis"');
  return out.trim();
}

const res = await fetch(`${BASE}analects.htm`);
const mainRaw = extractIoContentRaw(await res.text());
const indexMatch = mainRaw.match(/<div class="io_index">([\s\S]*?)<\/div>/i);
const links = [...(indexMatch?.[1].matchAll(/href="([^"]+\.htm)"[^>]*>([\s\S]*?)<\/a>/gi) || [])];
const url = `${BASE}${links[0][1].replace(/^\.\//, '')}`;
const raw = extractIoContentRaw(await (await fetch(url)).text());
const transformed = transformContent(raw);
const enriched = enrichScriptureContent(transformed, 'lunyu');
console.log('h3 chapters in supplement:', (enriched.match(/<h3 class="scripture-chapter">/g) || []).length);

function parseSupplementNoteBody(html) {
  const stripped = html.replace(/^<h2 class="scripture-main-title">[\s\S]*?<\/h2>\s*/i, '').trim();
  const annMatch = stripped.match(/<div class="scripture-annotation[^"]*">([\s\S]*?)<\/div>\s*$/);
  if (annMatch) {
    console.log('WARNING: parseSupplementNoteBody matched trailing annotation only!');
    return { title: '【釋文】', html: annMatch[1].trim() };
  }
  return { title: '註釋解讀', html: stripped };
}

const note = parseSupplementNoteBody(enriched);
console.log('Note html length:', note.html.length);
console.log('Note html starts:', stripTags(note.html).slice(0, 80));
const blocks2 = parseSupplementVerseBlocks(note.html);
console.log('Blocks from chapterMap path:', blocks2.length);
if (blocks2[0]) {
  console.log('Block0 ann:', stripTags(blocks2[0].html).slice(0, 60));
}

// Main content chapter 1 paras (minimal transform like build script)
let mainContent = mainRaw.replace(/<div class="io_index">[\s\S]*?<\/div>/gi, '').replace(/<div class="io_comment">[\s\S]*?<\/div>/gi, '');
mainContent = mainContent.replace(/<h2(\s[^>]*)?>/gi, '<h3 class="scripture-chapter"$1>').replace(/<\/h2>/gi, '</h3>');
mainContent = mainContent.replace(/<p>/g, '<p class="scripture-para">');

const ch1 = mainContent.match(/<h3 class="scripture-chapter">[\s\S]*?學而第一[\s\S]*?<\/h3>((?:\s*<p class="scripture-para">[\s\S]*?<\/p>)*)/);
if (ch1) {
  const paras = [...ch1[1].matchAll(/<p class="scripture-para">([\s\S]*?)<\/p>/g)].slice(0, 5);
  console.log(`Main paras (${paras.length} shown):`);
  paras.forEach((p, i) => console.log(`  Para ${i}: ${stripTags(p[1]).slice(0, 55)}`));
} else {
  console.log('Chapter 1 not found in main');
  console.log(mainContent.slice(0, 500));
}
