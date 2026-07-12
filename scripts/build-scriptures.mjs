import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { enrichScriptureContent } from './scripture-enrich.mjs';
import {
  buildPageDescription,
  buildScripturePageTitle,
  renderArticleSchema,
  renderSeoMeta,
} from './seo-meta.mjs';
import {
  escapeHtml,
  renderBodyScripts,
  renderFooterShell,
  renderHeadCore,
  renderHeadOpen,
  renderHeader,
  renderPageChrome,
  stampAssetUrl,
  pathPrefix,
} from './layout-shell.mjs';
import { pinyinToZhuyin } from './baijiaxing-zhuyin.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const BASE = 'https://www.ifreesite.com/scriptures/';
const FETCH_POOL = 6;

function loadCatalog() {
  const src = fs.readFileSync(path.join(root, 'assets/js/scriptures-catalog.js'), 'utf8');
  const body = src.replace(/^window\.WA_SCRIPTURES_CATALOG\s*=\s*/, '').replace(/;\s*$/, '');
  return Function(`return ${body}`)();
}

const catalog = loadCatalog();
const SCRIPTURE_DIR = 'scripture';
const ROOT_PREFIX = '../';

function scripturePageHref(slug) {
  return `${slug}.html`;
}

function rootPageHref(page) {
  return `${ROOT_PREFIX}${page}`;
}

function rootAssetHref(relativePath) {
  return stampAssetUrl(rootPageHref(relativePath));
}
const INLINE_MERGE_MODES = {
  daode: 'h4-single',
  lunyu: 'h3-verse',
  sunzi: 'h3-section',
  sanzijing: 'para-explanation',
  dizigui: 'para-explanation',
  qianziwen: 'half-line-explanation',
  xinjing: 'xinjing-multi',
  jingang: 'h3-dual-notes',
  dizang: 'dizang-multi',
};

const SKIP_SEGMENT_NAV = new Set(['daode']);
const SKIP_SUPPLEMENTS = new Set(['qianjiashi']);

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
  const zhangMatch = title.match(/章第([零一二三四五六七八九十百\d]+)\s*$/);
  if (zhangMatch) return chineseToNumber(zhangMatch[1]);

  const chapterMatch = title.match(/第([零一二三四五六七八九十百\d]+)章/);
  if (chapterMatch) return chineseToNumber(chapterMatch[1]);

  const tailMatch = title.match(/第([零一二三四五六七八九十百\d]+)\s*$/);
  if (tailMatch) return chineseToNumber(tailMatch[1]);

  const parenMatch = title.match(/[（(]([零一二三四五六七八九十百\d]+)[）)]/);
  if (parenMatch) return chineseToNumber(parenMatch[1]);

  const loose = title.match(/第([零一二三四五六七八九十百\d]+)/);
  return loose ? chineseToNumber(loose[1]) : null;
}

function parseSupplementNoteBody(html) {
  const stripped = stripSupplementHeader(html);
  if (/<p class="scripture-verse">/.test(stripped)) {
    return { title: '註釋解讀', html: stripped };
  }
  const annMatch = stripped.match(/<div class="scripture-annotation[^"]*">([\s\S]*?)<\/div>\s*$/);
  if (annMatch && !/<div class="scripture-(?:translation|exegesis)/.test(stripped)) {
    return { title: '【釋文】', html: annMatch[1].trim() };
  }
  return { title: '註釋解讀', html: stripped };
}

function parseJingangChapterNotes(html) {
  const stripped = html
    .replace(/^<h[12] class="scripture-main-title">[\s\S]*?<\/h[12]>\s*/i, '')
    .replace(/(?:<p class="scripture-para">[\s\S]*?<\/p>\s*)+/g, '')
    .trim();
  const notes = [];
  const annMatch = stripped.match(/<div class="scripture-annotation[^"]*">([\s\S]*?)<\/div>/);
  if (annMatch) {
    const body = annMatch[1].trim().replace(/^【解讀】\s*/, '');
    if (body) notes.push({ title: '【解讀】', html: body });
  }
  const transMatch = stripped.match(/<div class="scripture-translation[^"]*">([\s\S]*?)<\/div>/);
  if (transMatch) {
    const body = transMatch[1].trim().replace(/^【解說】\s*/, '');
    if (body) notes.push({ title: '【解說】', html: body });
  }
  return notes;
}

function parseDizangChapterSupplements(supplements) {
  const map = new Map();
  for (const sup of supplements) {
    const num = chapterNumFromTitle(sup.label);
    if (!num) continue;
    if (!map.has(num)) map.set(num, {});
    const entry = map.get(num);
    const body = stripSupplementHeader(sup.html);
    if (sup.label.includes('註解') && body) {
      entry.zhujie = { title: '【註解】', html: body };
    } else if (sup.label.includes('釋文') && body) {
      entry.shiwen = body;
    } else if (sup.label.includes('譯文') && body) {
      entry.yiwen = { title: '【譯文】', html: body };
    }
  }
  return map;
}

function assignDizangShiwenToParas(paraContents, shiwenHtml) {
  const { versesHtml } = extractSupplementIntro(shiwenHtml);
  const source = versesHtml || shiwenHtml;
  const sections = parseSupplementVerseSections(source).filter((s) => s.html?.trim());
  const buckets = Array.from({ length: paraContents.length }, () => []);
  const unmatched = [];

  for (const sec of sections) {
    const vk = normalizeForMatch(sec.verseTitle);
    if (!vk || vk.length < 3) {
      unmatched.push(sec.html);
      continue;
    }

    let bestPi = -1;
    let bestScore = 0;
    for (let i = 0; i < paraContents.length; i += 1) {
      const pk = normalizeForMatch(paraContents[i]);
      if (!pk) continue;
      for (let len = Math.min(vk.length, 48); len >= 3; len -= 1) {
        const probe = vk.slice(0, len);
        if (pk.includes(probe) && len > bestScore) {
          bestScore = len;
          bestPi = i;
          break;
        }
      }
    }

    if (bestPi >= 0) buckets[bestPi].push(sec.html);
    else unmatched.push(sec.html);
  }

  return { buckets, unmatchedHtml: unmatched.filter(Boolean).join('\n') };
}

function mergeDizangInlineNotes(mainContent, chapterSupMap) {
  return mainContent.replace(
    /<h3 class="scripture-chapter">([^<]+)<\/h3>([\s\S]*?)(?=<h3 class="scripture-chapter">|<section class="scripture-supplements">|$)/g,
    (block, chapterTitle, bodySection) => {
      const num = chapterNumFromTitle(chapterTitle);
      const entry = chapterSupMap.get(num);
      if (!entry) return block;

      const paraContents = [];
      const paraRe = /<p class="scripture-(?:para|verse)">([\s\S]*?)<\/p>/g;
      let paraMatch;
      while ((paraMatch = paraRe.exec(bodySection)) !== null) {
        paraContents.push(paraMatch[1]);
      }

      let shiwenAssign = null;
      if (entry.shiwen && paraContents.length) {
        shiwenAssign = assignDizangShiwenToParas(paraContents, entry.shiwen);
      }

      let pi = 0;
      const mergedBody = bodySection.replace(
        /<p class="scripture-(?:para|verse)">([\s\S]*?)<\/p>/g,
        (fullPara, paraContent) => {
          const notes = [];
          const shiwenBody = shiwenAssign?.buckets[pi]?.filter(Boolean).join('\n');
          if (shiwenBody?.trim()) {
            notes.push(
              renderInlineNote({
                title: '【釋文】',
                html: shiwenBody,
                verseLevel: true,
              })
            );
          }
          pi += 1;
          return `${fullPara}${notes.join('')}`;
        }
      );

      const tailFolds = [];
      if (shiwenAssign?.unmatchedHtml?.trim()) {
        tailFolds.push(renderInlineNote({ title: '【釋文】', html: shiwenAssign.unmatchedHtml }));
      }

      return `<h3 class="scripture-chapter">${chapterTitle}</h3>${mergedBody}${tailFolds.join('')}`;
    }
  );
}

function parseSupplementChapterMap(supplements, slug = '') {
  const map = new Map();
  for (const sup of supplements) {
    if (slug === 'jingang') {
      const num = chapterNumFromTitle(sup.label);
      if (!num) continue;
      const notes = parseJingangChapterNotes(sup.html);
      if (notes.length) map.set(num, { notes });
      continue;
    }

    const chunks = sup.html.split(/<h3 class="scripture-chapter">/);
    if (chunks.length > 1) {
      for (let i = 1; i < chunks.length; i += 1) {
        const close = chunks[i].indexOf('</h3>');
        if (close === -1) continue;
        const title = chunks[i].slice(0, close).trim();
        const body = chunks[i].slice(close + 5).trim();
        const num = chapterNumFromTitle(title);
        if (num && body) {
          map.set(num, { title, html: body });
        }
      }
      continue;
    }

    const num = chapterNumFromTitle(sup.label);
    if (!num) continue;
    const note = parseSupplementNoteBody(sup.html);
    if (note.html) {
      map.set(num, note);
    }
  }
  return map;
}

function renderInlineNote(chapter) {
  const noteTitle = chapter.title || '註釋解讀';
  const extraClass = chapter.verseLevel ? ' scripture-inline-note-verse' : '';
  return `
<details class="scripture-inline-note${extraClass}">
  <summary class="scripture-inline-note-title">${escapeHtml(noteTitle)}</summary>
  <div class="scripture-inline-note-body">${chapter.html}</div>
</details>`;
}

function paraSummary(paraContent) {
  const plain = stripTags(paraContent)
    .replace(/^\d+\.\s*/, '')
    .replace(/\(\d+\.\d+\)\s*$/, '')
    .trim();
  const quoteMatch = plain.match(/[「『"\u201c]([^」』"\u201d]+)[」』"\u201d]/u);
  if (quoteMatch) {
    const clause = quoteMatch[1].split(/[？！。]/)[0].trim();
    return clause.length > 28 ? `${clause.slice(0, 26)}…` : clause;
  }
  const first = plain.split(/[？！。]/)[0].trim();
  return first.length > 28 ? `${first.slice(0, 26)}…` : first;
}

function parseSupplementVerseBlocks(html) {
  const blocks = [];
  const chunks = html.split(/<p class="scripture-verse">/);
  const prefix = chunks[0]?.trim() || '';
  if (prefix && /<div class="scripture-(?:annotation|translation|exegesis)/.test(prefix)) {
    blocks.push({ html: prefix });
  }
  for (let i = 1; i < chunks.length; i += 1) {
    const endVerse = chunks[i].indexOf('</p>');
    if (endVerse === -1) continue;
    const body = chunks[i].slice(endVerse + 4).trim();
    if (body) blocks.push({ html: body });
  }
  return blocks;
}

function mergeInlineVerseNotes(mainContent, chapterMap) {
  return mainContent.replace(
    /<h3 class="scripture-chapter">([^<]+)<\/h3>((?:\s*<p class="scripture-para">[\s\S]*?<\/p>)*)/g,
    (block, chapterTitle, parasSection) => {
      const num = chapterNumFromTitle(chapterTitle);
      const chapter = chapterMap.get(num);
      if (!chapter) return block;

      const paraContents = [];
      parasSection.replace(/<p class="scripture-para">([\s\S]*?)<\/p>/g, (_, content) => {
        paraContents.push(content);
        return '';
      });

      const { buckets } = groupVerseSectionsByPara(paraContents, chapter.html);
      let pi = 0;
      const newParas = parasSection.replace(
        /<p class="scripture-para">([\s\S]*?)<\/p>/g,
        (paraMatch, paraContent) => {
          const noteHtml = buckets[pi]?.filter(Boolean).join('\n');
          pi += 1;
          if (!noteHtml?.trim()) return paraMatch;
          return `${paraMatch}${renderInlineNote({
            title: paraSummary(paraContent),
            html: noteHtml,
            verseLevel: true,
          })}`;
        }
      );
      return `<h3 class="scripture-chapter">${chapterTitle}</h3>${newParas}`;
    }
  );
}

export function splitLunyuSectionNotes(html) {
  return html.replace(
    /<h3 class="scripture-chapter">([^<]+)<\/h3>((?:\s*<p class="scripture-para">[\s\S]*?<\/p>)*)\s*<details class="scripture-inline-note">\s*<summary class="scripture-inline-note-title">[\s\S]*?<\/summary>\s*<div class="scripture-inline-note-body">([\s\S]*?)<\/div>\s*<\/details>/g,
    (block, chapterTitle, parasSection, noteBody) => {
      const verseBlocks = parseSupplementVerseBlocks(noteBody);
      let vi = 0;
      const newParas = parasSection.replace(
        /<p class="scripture-para">([\s\S]*?)<\/p>/g,
        (paraMatch, paraContent) => {
          const note = verseBlocks[vi];
          vi += 1;
          if (!note) return paraMatch;
          return `${paraMatch}${renderInlineNote({
            title: paraSummary(paraContent),
            html: note.html,
            verseLevel: true,
          })}`;
        }
      );
      return `<h3 class="scripture-chapter">${chapterTitle}</h3>${newParas}`;
    }
  );
}

function mergeInlineChapterNotes(mainContent, chapterMap) {
  return mainContent.replace(
    /<h4 class="scripture-subhead">(第[^<]+章)<\/h4>\s*(<p class="scripture-para">[\s\S]*?<\/p>)/g,
    (block, chapterLabel) => {
      const numMatch = chapterLabel.match(/第([零一二三四五六七八九十百\d]+)章/);
      if (!numMatch) return block;
      const num = chineseToNumber(numMatch[1]);
      const chapter = chapterMap.get(num);
      if (!chapter) return block;
      return `${block}${renderInlineNote({ ...chapter, html: stripLeadingVerse(chapter.html) })}`;
    }
  );
}

function mergeInlineSectionNotes(mainContent, chapterMap) {
  return mainContent.replace(
    /<h3 class="scripture-chapter">([^<]+)<\/h3>((?:\s*(?:<div class="scripture-author">[\s\S]*?<\/div>|<p class="scripture-para">[\s\S]*?<\/p>))*)/g,
    (block, chapterTitle, bodySection) => {
      const num = chapterNumFromTitle(chapterTitle);
      const chapter = chapterMap.get(num);
      if (!chapter) return block;
      return `<h3 class="scripture-chapter">${chapterTitle}</h3>${bodySection}${renderInlineNote(chapter)}`;
    }
  );
}

function mergeJingangInlineNotes(mainContent, chapterMap) {
  return mainContent.replace(
    /<h3 class="scripture-chapter">([^<]+)<\/h3>((?:\s*<p class="scripture-para">[\s\S]*?<\/p>)*)/g,
    (block, chapterTitle, bodySection) => {
      const num = chapterNumFromTitle(chapterTitle);
      const chapter = chapterMap.get(num);
      if (!chapter?.notes?.length) return block;
      const folds = chapter.notes.map((note) => renderInlineNote(note)).join('');
      return `<h3 class="scripture-chapter">${chapterTitle}</h3>${bodySection}${folds}`;
    }
  );
}

function normalizeVerseKey(str) {
  return stripTags(str)
    .replace(/\s+/g, '')
    .replace(/[^\u4e00-\u9fff]/g, '')
    .replace(/為/g, '為')
    .replace(/為/g, '為')
    .replace(/雲/g, '雲')
    .replace(/並/g, '並')
    .replace(/潔/g, '潔')
    .replace(/絜/g, '潔')
    .replace(/昆/g, '崑')
    .replace(/鉅/g, '巨')
    .replace(/嶽/g, '嶽');
}

function normalizeSanzijingVerse(str) {
  return normalizeVerseKey(str);
}

function splitScriptureSentences(text) {
  const plain = stripTags(text).trim();
  const parts = plain.match(/[^。！？]+[。！？]/g);
  return parts?.map((part) => part.trim()).filter(Boolean) || [plain];
}

function findVerseNote(noteMap, verseText) {
  const key = normalizeVerseKey(verseText);
  if (noteMap.has(key)) return noteMap.get(key);
  for (const [noteKey, note] of noteMap) {
    if (noteKey.length >= 6 && (key.includes(noteKey) || noteKey.includes(key))) {
      return note;
    }
  }
  return null;
}

function parseParaExplanationNotes(html, { defaultTitle = '【釋文】' } = {}) {
  const cleaned = stripSupplementHeader(html);
  const notes = new Map();
  const blockRe =
    /<div class="(io_explanation|scripture-annotation(?: scripture-annotation-block)?)">([\s\S]*?)<\/div>/g;
  let pendingKeys = [];
  let match;
  while ((match = blockRe.exec(cleaned)) !== null) {
    const [, kind, inner] = match;
    if (kind === 'io_explanation') {
      for (const line of inner.split(/<br\s*\/?>/i)) {
        const key = normalizeVerseKey(line);
        if (key) pendingKeys.push(key);
      }
      continue;
    }
    const plain = stripTags(inner);
    const titleMatch = plain.match(/^【([^】]+)】/);
    const body = titleMatch
      ? inner.trim().replace(/^【[^】]+】\s*/, '').trim()
      : inner.trim();
    const anchor = pendingKeys[pendingKeys.length - 1];
    if (anchor && body) {
      notes.set(anchor, { title: defaultTitle, html: body });
    }
    pendingKeys = [];
  }
  return notes;
}

function mergeParaExplanationInlineNotes(mainContent, supplementHtml, options = {}) {
  const noteMap = parseParaExplanationNotes(supplementHtml, options);
  return mainContent.replace(
    /<p class="scripture-para">([\s\S]*?)<\/p>/g,
    (paraMatch, paraContent) => {
      const note = findVerseNote(noteMap, paraContent);
      if (!note) return paraMatch;
      return `${paraMatch}${renderInlineNote({ title: note.title, html: note.html, verseLevel: true })}`;
    }
  );
}

function mergeQianziwenInlineNotes(mainContent, supplementHtml) {
  const noteMap = parseParaExplanationNotes(supplementHtml, { defaultTitle: '【註解】' });
  return mainContent.replace(
    /<p class="scripture-para">([\s\S]*?)<\/p>/g,
    (paraMatch, paraContent) => {
      const sentences = splitScriptureSentences(paraContent);
      if (sentences.length <= 1) {
        const note = findVerseNote(noteMap, paraContent);
        if (!note) return paraMatch;
        return `${paraMatch}${renderInlineNote({ title: note.title, html: note.html, verseLevel: true })}`;
      }
      return sentences
        .map((sentence) => {
          const line = `<p class="scripture-para">${sentence}</p>`;
          const note = findVerseNote(noteMap, sentence);
          return note
            ? `${line}${renderInlineNote({ title: note.title, html: note.html, verseLevel: true })}`
            : line;
        })
        .join('');
    }
  );
}

function parseSanzijingSupplementNotes(html) {
  return parseParaExplanationNotes(html);
}

function mergeSanzijingInlineNotes(mainContent, supplementHtml) {
  return mergeParaExplanationInlineNotes(mainContent, supplementHtml);
}

function normalizeForMatch(str) {
  return stripTags(str)
    .replace(/[^\u4e00-\u9fff]/g, '')
    .replace(/觀世音/g, '觀自在')
    .replace(/五陰/g, '五蘊')
    .replace(/薩綞/g, '薩埵')
    .replace(/罣/g, '掛')
    .replace(/皆/g, '');
}

function findBestParaIndex(paraContents, hintText) {
  const key = normalizeForMatch(hintText);
  if (!key || key.length < 4) return -1;

  for (let len = Math.min(key.length, 24); len >= 4; len -= 1) {
    const probe = key.slice(0, len);
    for (let i = paraContents.length - 1; i >= 0; i -= 1) {
      const pk = normalizeForMatch(paraContents[i]);
      if (pk.includes(probe)) return i;
    }
  }

  return -1;
}

function parseSupplementParaBodies(html) {
  const bodies = [];
  const re = /<p(?:\s+class="scripture-para")?\s*>([\s\S]*?)<\/p>/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    const body = m[1].trim();
    if (body && !/^<img\b/i.test(body)) bodies.push(body);
  }
  return bodies;
}

function stripSupplementHeader(html) {
  return html
    .replace(/^<h[12] class="scripture-main-title">[\s\S]*?<\/h[12]>\s*/i, '')
    .replace(/^<h3 class="scripture-chapter"[^>]*>[\s\S]*?<\/h3>\s*/i, '')
    .replace(/^<h1>[\s\S]*?<\/h1>\s*/i, '')
    .replace(/^<img[^>]*>\s*/i, '')
    .replace(/<div class="io_comment">[\s\S]*$/i, '')
    .trim();
}

function extractSupplementIntro(html) {
  const cleaned = stripSupplementHeader(html);
  const idx = cleaned.search(/<p class="scripture-verse">/);
  if (idx < 0) return { intro: cleaned, versesHtml: '' };
  if (idx === 0) return { intro: '', versesHtml: cleaned };
  return {
    intro: cleaned.slice(0, idx).trim(),
    versesHtml: cleaned.slice(idx),
  };
}

function parseSupplementVerseSections(html) {
  const sections = [];
  const chunks = html.split(/<p class="scripture-verse">/);
  for (let i = 1; i < chunks.length; i += 1) {
    const endVerse = chunks[i].indexOf('</p>');
    if (endVerse === -1) continue;
    const verseTitle = stripTags(chunks[i].slice(0, endVerse)).replace(/^【|】$/g, '').trim();
    const body = chunks[i].slice(endVerse + 4).trim();
    if (body) sections.push({ verseTitle, html: body });
  }
  return sections;
}

function groupVerseSectionsByPara(paraContents, supplementHtml) {
  const cleaned = stripSupplementHeader(supplementHtml);
  const { intro, versesHtml } = extractSupplementIntro(cleaned);
  const source = versesHtml || cleaned;
  const buckets = Array.from({ length: paraContents.length }, () => []);
  for (const sec of parseSupplementVerseSections(source)) {
    const pi = findBestParaIndex(paraContents, sec.verseTitle);
    if (pi >= 0) buckets[pi].push(sec.html);
  }
  return { introHtml: intro, buckets };
}

function mergeXinjingDualNotes(sectionHtml, nanHtml, qieHtml, modernHtml) {
  const paraContents = [];
  const paraRe = /<p class="scripture-para">([\s\S]*?)<\/p>/g;
  let match;
  while ((match = paraRe.exec(sectionHtml)) !== null) {
    paraContents.push(match[1]);
  }
  if (!paraContents.length) return sectionHtml;

  const nan = groupVerseSectionsByPara(paraContents, nanHtml);
  const qie = groupVerseSectionsByPara(paraContents, qieHtml);

  let paraIndex = 0;
  let merged = sectionHtml.replace(
    /<p class="scripture-para">[\s\S]*?<\/p>/g,
    (paraMatch) => {
      const notes = [];
      const nanBody = nan.buckets[paraIndex]?.filter(Boolean).join('\n');
      if (nanBody?.trim()) {
        notes.push(renderInlineNote({ title: '【南懷瑾】', html: nanBody, verseLevel: true }));
      }
      let qieBody = qie.buckets[paraIndex]?.filter(Boolean).join('\n') || '';
      if (paraIndex === 0 && qie.introHtml) {
        qieBody = `${qie.introHtml}\n${qieBody}`.trim();
      }
      if (qieBody.trim()) {
        notes.push(renderInlineNote({ title: '【鳩摩羅什】', html: qieBody, verseLevel: true }));
      }
      paraIndex += 1;
      return paraMatch + notes.join('');
    }
  );

  if (modernHtml?.trim()) {
    const cleaned = stripSupplementHeader(modernHtml);
    const bodies = parseSupplementParaBodies(cleaned);
    const modernBody = bodies.length
      ? bodies.map((b) => `<p class="scripture-para">${b}</p>`).join('\n')
      : cleaned;
    const modernFold = renderInlineNote({ title: '【現代註釋】', html: modernBody });
    const tailRe =
      /(\s*(?:<blockquote class="scripture-quote">|<nav class="scripture-segment-nav"|<h3 class="scripture-chapter"|<h4 class="scripture-subhead"|<div class="scripture-related">))/;
    merged = tailRe.test(merged) ? merged.replace(tailRe, `${modernFold}$1`) : merged + modernFold;
  }

  return merged;
}

function mergeXinjingInline(mainContent, supplements) {
  const supMap = Object.fromEntries(supplements.map((s) => [s.label, s]));
  const nanHtml = supMap['南懷瑾解讀']?.html;
  const qieHtml = supMap['鳩摩羅什註釋']?.html;
  const modernHtml = supMap['現代譯文']?.html;

  const parts = mainContent.split(/(<h3 class="scripture-chapter">[\s\S]*?<\/h3>)/);
  let out = parts[0] || '';

  for (let i = 1; i < parts.length; i += 2) {
    const heading = parts[i];
    const body = parts[i + 1] || '';
    const sectionIdx = (i - 1) / 2;
    if (sectionIdx === 0 && nanHtml && qieHtml) {
      out += heading + mergeXinjingDualNotes(body, nanHtml, qieHtml, modernHtml);
    } else {
      out += heading + body;
    }
  }

  return out;
}

function applyInlineMerge(slug, mainContent, chapterMap, supplements) {
  if (slug === 'xinjing') return mergeXinjingInline(mainContent, supplements);
  if (slug === 'jingang') return mergeJingangInlineNotes(mainContent, chapterMap);
  if (slug === 'dizang') return mergeDizangInlineNotes(mainContent, chapterMap);
  if (slug === 'qianziwen') {
    const supHtml = supplements[0]?.html;
    return supHtml ? mergeQianziwenInlineNotes(mainContent, supHtml) : mainContent;
  }
  if (slug === 'sanzijing' || slug === 'dizigui') {
    const supHtml = supplements[0]?.html;
    return supHtml ? mergeParaExplanationInlineNotes(mainContent, supHtml) : mainContent;
  }
  const mode = INLINE_MERGE_MODES[slug];
  if (mode === 'h3-verse') return mergeInlineVerseNotes(mainContent, chapterMap);
  if (mode === 'h3-section') return mergeInlineSectionNotes(mainContent, chapterMap);
  return mergeInlineChapterNotes(mainContent, chapterMap);
}

function stripLeadingVerse(html) {
  return html.replace(/^<p class="scripture-para">[\s\S]*?<\/p>\s*/i, '');
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function stripTags(str) {
  return String(str).replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
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
  if (end === -1) return '';
  return html.slice(start + openTag.length, end);
}

function parseSupplementLinks(rawContent) {
  const indexMatch = rawContent.match(/<div class="io_index">([\s\S]*?)<\/div>/i);
  if (indexMatch) {
    return [...indexMatch[1].matchAll(/href="([^"]+\.htm)"[^>]*>([\s\S]*?)<\/a>/gi)].map((m) => ({
      source: m[1].replace(/^\.\//, ''),
      label: stripTags(m[2]),
    }));
  }

  const commentMatch = rawContent.match(/<div class="io_comment">([\s\S]*?)<\/div>/i);
  if (!commentMatch) return [];

  const skipLabels = ['相關', '網站', '下載', '原文'];
  const links = [];
  const sections = commentMatch[1].split(/<hr\s*\/?>/i);

  for (const section of sections) {
    if (skipLabels.some((label) => new RegExp(`<strong>\\s*${label}`).test(section))) continue;
    for (const m of section.matchAll(/href="([^"]+\.htm)"[^>]*>([\s\S]*?)<\/a>/gi)) {
      links.push({
        source: m[1].replace(/^\.\//, ''),
        label: stripTags(m[2]),
      });
    }
  }

  return links;
}

function cleanSubpageContent(content) {
  return content
    .replace(/<div class="io_comment">[\s\S]*?<\/div>/gi, '')
    .replace(/<div class="io_index">[\s\S]*?<\/div>/gi, '')
    .replace(/<span class="btn1">[\s\S]*?<\/span>/gi, '')
    .replace(/<span class="btn2">[\s\S]*?<\/span>/gi, '')
    .replace(/<div class="io_bankhome">[\s\S]*?<\/div>/gi, '')
    .trim();
}

function parseRelatedLinks(rawContent) {
  const commentMatch = rawContent.match(/<div class="io_comment">([\s\S]*?)<\/div>/i);
  if (!commentMatch) return [];

  const relatedPart = commentMatch[1].split(/<strong>\s*相關/i)[1];
  if (!relatedPart) return [];

  return [...relatedPart.split(/<strong>\s*網站/i)[0].matchAll(/href="([^"]+\.htm)"[^>]*>([\s\S]*?)<\/a>/gi)]
    .map((m) => ({
      source: m[1].replace(/^\.\//, ''),
      label: stripTags(m[2]),
    }))
    .filter((l) => l.label);
}

function findBookBySource(sourceName) {
  const name = sourceName.replace(/^\.\//, '').replace(/\.htm$/, '');
  for (const cat of catalog) {
    for (const book of cat.books) {
      if (book.source.replace(/\.htm$/, '') === name) return book;
    }
  }
  const alias = {
    fozhou: 'fozhou',
    'lotus-sutra': 'fahua',
    analects: 'lunyu',
    'three-character-classic': 'sanzijing',
    'standards-for-students': 'dizigui',
    'hundred-family-surnames': 'baijiaxing',
    'thousand-character-classic': 'qianziwen',
    'qian-jia-shi': 'qianjiashi',
    dabeichan: 'dabei',
    36: '36ji',
  };
  const slug = alias[name];
  if (!slug) return null;
  for (const cat of catalog) {
    for (const book of cat.books) {
      if (book.slug === slug) return book;
    }
  }
  return null;
}

function transformContent(content) {
  let out = content;

  out = out.replace(/孫子/g, '孫子');
  out = out.replace(/<script[\s\S]*?<\/script>/gi, '');
  out = out.replace(/<a[^>]*class="io_togohome"[^>]*>[\s\S]*?<\/a>/gi, '');
  out = out.replace(/<img[^>]*>/gi, '');
  out = out.replace(/href="\.\/"/g, `href="${rootPageHref('scriptures.html')}"`);
  out = out.replace(/<a\s+href="(?:\.\/)?music\/[^"]*"[^>]*>[\s\S]*?<\/a>/gi, '');
  out = out.replace(/(<div class="scripture-annotation[^"]*">)\s*🎧\s*(?:｜\s*)*\s*(<\/div>)/gi, '');
  out = out.replace(/<div class="scripture-annotation[^"]*">\s*<\/div>/gi, '');
  out = out.replace(/href="([^"]+\.htm)"/g, (_, href) => {
    const name = href.replace(/^\.\//, '').replace(/\.htm$/, '');
    const book = findBookBySource(name);
    return book ? `href="${scripturePageHref(book.slug)}"` : `href="${href}"`;
  });

  out = out.replace(/<h3(\s[^>]*)?>/gi, '<h4 class="scripture-subhead"$1>');
  out = out.replace(/<\/h3>/gi, '</h4>');
  out = out.replace(/<h2(?![^>]*class="scripture-main-title")(\s[^>]*)?>/gi, '<h3 class="scripture-chapter"$1>');
  out = out.replace(/<\/h2>/gi, '</h3>');
  out = out.replace(/<h1(\s[^>]*)?>/gi, '<h1 class="scripture-main-title"$1>');

  out = out.replace(/class="io_summary"/g, 'class="scripture-intro"');
  out = out.replace(/class="io_auther"/g, 'class="scripture-author"');
  out = out.replace(/class="io_color3"/g, 'class="scripture-note"');
  out = out.replace(/class="io_color1"/g, 'class="scripture-verse"');
  out = out.replace(/class="io_color2"/g, 'class="scripture-highlight"');
  out = out.replace(/class="io_color5"/g, 'class="scripture-highlight-soft"');
  out = out.replace(/class="io_center"/g, 'class="scripture-annotation scripture-annotation-block"');
  out = out.replace(/class="io_sanskrit"/g, 'class="scripture-annotation"');
  out = out.replace(/class="io_description"/g, 'class="scripture-translation"');
  out = out.replace(/class="io_synopsis"/g, 'class="scripture-exegesis"');

  out = out.replace(/<p>/g, '<p class="scripture-para">');
  out = out.replace(/<blockquote>/g, '<blockquote class="scripture-quote">');
  out = out.replace(/<hr\s*\/?>/gi, '<hr class="scripture-divider">');
  out = out.replace(/---+/g, '');
  out = out.replace(/\n{3,}/g, '\n\n');

  return out.trim();
}

function extractMainContent(rawContent) {
  let content = rawContent
    .replace(/<div class="io_index">[\s\S]*?<\/div>/gi, '')
    .replace(/<div class="io_comment">[\s\S]*?<\/div>/gi, '');

  return transformContent(content);
}

function renderRelatedSection(links) {
  const internal = links
    .map((l) => findBookBySource(l.source.replace(/\.htm$/, '')))
    .filter(Boolean);

  if (!internal.length) return '';

  const items = internal.map((book) =>
    `<a href="${scripturePageHref(book.slug)}">${escapeHtml(book.title)}</a>`
  ).join('');

  return `<div class="scripture-related"><strong>相關經典：</strong>${items}</div>`;
}

function renderSupplements(subs) {
  if (!subs.length) return '';

  const items = subs.map((s) => `
    <details class="scripture-supplement">
      <summary class="scripture-supplement-title">${escapeHtml(s.label)}</summary>
      <div class="scripture-supplement-body">${stripSupplementHeader(s.html)}</div>
    </details>
  `).join('');

  return `
    <section class="scripture-supplements">
      <h3 class="scripture-supplements-heading"><i class="bi bi-journal-text me-2"></i>解讀補充</h3>
      <p class="scripture-supplements-hint">以下內容摘自各章解讀，點擊標題展開閱讀。</p>
      <div class="scripture-supplements-list">${items}</div>
    </section>`;
}

function getCategoryForBook(slug) {
  for (const cat of catalog) {
    if (cat.books.some((b) => b.slug === slug)) return cat;
  }
  return null;
}

function renderPagerLink(href, kind, title) {
  const label = kind === 'prev' ? '上一篇' : '下一篇';
  const chevronPrev = '<i class="bi bi-chevron-left scripture-pager-chevron" aria-hidden="true"></i>';
  const chevronNext = '<i class="bi bi-chevron-right scripture-pager-chevron" aria-hidden="true"></i>';
  const row = kind === 'prev'
    ? `<span class="scripture-pager-row">${chevronPrev}<span class="scripture-pager-title">${escapeHtml(title)}</span></span>`
    : `<span class="scripture-pager-row"><span class="scripture-pager-title">${escapeHtml(title)}</span>${chevronNext}</span>`;
  const aria = kind === 'prev' ? `上一篇：${title}` : `下一篇：${title}`;
  return `<a href="${href}" class="scripture-pager-link scripture-pager-${kind}" aria-label="${escapeHtml(aria)}">
    <span class="scripture-pager-label">${label}</span>
    ${row}
  </a>`;
}

function renderPager(book, position = 'bottom') {
  const category = getCategoryForBook(book.slug);
  if (!category) return '';

  const books = category.books;
  const idx = books.findIndex((b) => b.slug === book.slug);
  const prev = books[(idx - 1 + books.length) % books.length];
  const next = books[(idx + 1) % books.length];
  const posClass = position === 'top' ? ' scripture-pager-top' : ' scripture-pager-bottom';

  return `
    <nav class="scripture-pager${posClass}" aria-label="篇章導覽">
      ${renderPagerLink(scripturePageHref(prev.slug), 'prev', prev.title)}
      <a href="${rootPageHref(`scriptures.html#scriptures-${category.id}`)}" class="btn btn-outline-secondary scripture-pager-home">
        <i class="bi bi-grid me-1" aria-hidden="true"></i>返回分類
      </a>
      ${renderPagerLink(scripturePageHref(next.slug), 'next', next.title)}
    </nav>`;
}

function wrapDivAsInlineNote(html, divClass) {
  return html.replace(
    new RegExp(`<div class="${divClass}">([\\s\\S]*?)<\\/div>`, 'g'),
    (_, inner) => {
      const trimmed = inner.trim();
      const titleMatch = trimmed.match(/^【([^】]+)】/);
      const title = titleMatch ? `【${titleMatch[1]}】` : '註釋';
      const body = trimmed.replace(/^【[^】]+】\s*/, '');
      return renderInlineNote({ title, html: body });
    }
  );
}

function applyScripturePostProcess(html, slug) {
  if (slug === 'baijiaxing') {
    return transformBaijiaxingContent(html);
  }
  if (slug === '36ji') {
    let out = wrapDivAsInlineNote(html, 'scripture-exegesis');
    out = wrapDivAsInlineNote(out, 'scripture-translation');
    return out;
  }
  if (slug === 'qianjiashi') {
    return addQianjiashiSectionIds(formatQianjiashiPoems(html));
  }
  return html;
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
  const zhuyin = pinyinToZhuyin(pinyin) || segments[2] || '';
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
  if (start < 0) return html;

  const after = start + marker.length;
  const tail = html.slice(after);
  const endMatch = tail.match(/<\/table>\s*<\/td>\s*<\/tr>\s*<\/table>/i);
  if (!endMatch) return html;

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
  if (!cards.length) return html;

  const grid = `\n<div class="baijiaxing-grid" role="list">\n${cards.join('\n')}\n</div>\n`;
  return html.slice(0, after) + grid + html.slice(tableEnd);
}

function transformBaijiaxingContent(html) {
  return transformBaijiaxingMainGrid(html);
}

const QIANJIASHI_SECTIONS = [
  { title: '五言絕句', id: 'qianjiashi-wuyan-jueju' },
  { title: '五言律詩', id: 'qianjiashi-wuyan-lvshi' },
  { title: '七言絕句', id: 'qianjiashi-qiyan-jueju' },
  { title: '七言律詩', id: 'qianjiashi-qiyan-lvshi' },
];

function renderQianjiashiSectionHeading(title) {
  const current = QIANJIASHI_SECTIONS.find((s) => s.title === title.trim());
  if (!current) return null;
  const links = QIANJIASHI_SECTIONS.filter((s) => s.title !== current.title)
    .map(
      (s) =>
        `<a href="#${s.id}" class="scripture-poem-section-link" title="跳至${s.title}"><i class="bi bi-signpost-2" aria-hidden="true"></i>${escapeHtml(s.title)}</a>`
    )
    .join('');
  return `<div class="scripture-poem-section" id="${current.id}">
  <p class="scripture-highlight">${escapeHtml(current.title)}</p>
  <nav class="scripture-poem-section-nav" aria-label="跳至其他體裁">${links}</nav>
</div>`;
}

function addQianjiashiSectionIds(html) {
  return html.replace(
    /<p class="scripture-highlight"(?: id="[^"]+")?>([^<]+)<\/p>/g,
    (match, title) => renderQianjiashiSectionHeading(title) || match
  );
}

function formatPoemLines(text) {
  const plain = text.trim();
  const sentences = plain.match(/[^。！？]+[。！？]/g);
  if (!sentences?.length) return `<p class="scripture-poem-line">${plain}</p>`;
  return sentences.map((s) => `<p class="scripture-poem-line">${s.trim()}</p>`).join('\n');
}

function formatPoemBody(body) {
  const parts = body.trim().split(/<br\s*\/?>/i).map((s) => s.trim()).filter(Boolean);
  if (parts.length <= 1) {
    return `<div class="scripture-poem-text">${formatPoemLines(parts[0] || body)}</div>`;
  }
  return parts
    .map((part) => `<div class="scripture-poem-stanza">${formatPoemLines(part)}</div>`)
    .join('\n');
}

function formatQianjiashiPoems(html) {
  return html.replace(
    /<p class="scripture-para"><strong>([\s\S]*?)<\/strong><\/p>\s*<div class="io_explanation">\s*([\s\S]*?)<\/div>/g,
    (_match, title, body) => `<article class="scripture-poem">
  <h5 class="scripture-poem-title">${title.trim()}</h5>
  <div class="scripture-poem-body">${formatPoemBody(body)}</div>
</article>`
  );
}

function segmentAnchorId(bookSlug, index) {
  return `${bookSlug}-seg-${index}`;
}

function sectionHeadingPattern(bookSlug) {
  if (bookSlug === 'daode') {
    return /(<h4 class="scripture-subhead">[\s\S]*?<\/h4>)/gi;
  }
  return /(<h3 class="scripture-chapter">[\s\S]*?<\/h3>)/gi;
}

function injectSectionNavigation(html, bookSlug) {
  if (SKIP_SEGMENT_NAV.has(bookSlug)) return html;

  const re = sectionHeadingPattern(bookSlug);
  const parts = html.split(re);
  if (parts.length < 3) return html;

  let out = parts[0];
  let index = 0;
  for (let i = 1; i < parts.length; i += 2) {
    out += parts[i].replace(/^(<h[34])/, `$1 id="${segmentAnchorId(bookSlug, index)}"`);
    out += parts[i + 1] || '';
    index += 1;
  }

  return out;
}

const SCRIPTURE_DEPTH = 1;

function renderScripturePage(book, mainContent, supplementsHtml, relatedHtml) {
  const category = getCategoryForBook(book.slug);
  const categoryName = category ? category.name : '藏經閣';
  const pagePath = `scripture/${book.slug}.html`;
  const pageTitle = buildScripturePageTitle(book.title);
  const description = buildPageDescription(book.desc, [`${book.title}線上閱讀，${categoryName}。`]);

  return `${renderHeadOpen()}
${renderHeadCore({ depth: SCRIPTURE_DEPTH, includePrefsBoot: false, includeFontSizeBoot: true })}
  <title>${escapeHtml(pageTitle)}</title>
${renderSeoMeta({
    title: pageTitle,
    description,
    path: pagePath,
    type: 'article',
    keywords: `${book.title},藏經閣,國學,佛經,Kawatool`,
  })}
${renderArticleSchema({ headline: book.title, description, url: pagePath })}
${renderHeadCore({ depth: SCRIPTURE_DEPTH, includePrefsBoot: false, includeFontSizeBoot: false })}
</head>
<body class="tool-page scripture-page${book.slug === 'qianjiashi' ? ' qianjiashi-page' : ''}">
${renderHeader({
    depth: SCRIPTURE_DEPTH,
    navItems: [
      { href: '/', label: '工具首頁' },
      { href: rootPageHref('scriptures.html'), label: '藏經閣', active: true, ariaCurrent: true },
    ],
  })}
  <main class="main">
    <section class="scripture-section section light-background" aria-label="${escapeHtml(book.title)}">
      <div class="container" data-aos="fade-up">
        ${renderPager(book, 'top')}
        <article class="scripture-article${book.slug === 'baijiaxing' ? ' baijiaxing-article' : ''}">
          ${mainContent}
          ${relatedHtml}
          ${supplementsHtml}
        </article>
        ${renderPager(book, 'bottom')}
        <footer class="scripture-footer-meta">
          <span class="scripture-category-label">${escapeHtml(categoryName)}</span>
        </footer>
      </div>
    </section>
  </main>
${renderFooterShell()}
${renderPageChrome()}
${renderBodyScripts({
    depth: SCRIPTURE_DEPTH,
    extraScripts: [
      'assets/js/tools-data.js',
      'assets/js/scriptures-catalog.js',
      ...(book.slug === 'qianjiashi' ? ['assets/js/qianjiashi-browse.js'] : []),
    ],
    deferMain: true,
  })}
</body>
</html>`;
}

async function fetchScripture(source) {
  const url = `${BASE}${source}`;
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Kawatool-Builder/1.0',
      Accept: 'text/html',
    },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  return buf.toString('utf8');
}

async function mapPool(items, fn, limit = FETCH_POOL) {
  const results = new Array(items.length);
  let cursor = 0;

  async function worker() {
    while (cursor < items.length) {
      const idx = cursor;
      cursor += 1;
      results[idx] = await fn(items[idx], idx);
    }
  }

  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
}

async function fetchSupplements(links) {
  if (!links.length) return [];

  return mapPool(links, async (link) => {
    const html = await fetchScripture(link.source);
    const raw = extractIoContentRaw(html);
    return {
      label: link.label,
      html: cleanSubpageContent(transformContent(raw)),
    };
  });
}

async function main() {
  const results = [];
  const onlySlug = process.argv[2] || '';

  for (const category of catalog) {
    for (const book of category.books) {
      if (onlySlug && book.slug !== onlySlug) continue;
      process.stdout.write(`Building ${book.title} (${book.source})... `);
      try {
        const html = await fetchScripture(book.source);
        const raw = extractIoContentRaw(html);
        const interpretLinks = parseSupplementLinks(raw);
        const relatedLinks = parseRelatedLinks(raw);
        const mainContent = extractMainContent(raw);

        if (!mainContent || mainContent.length < 100) {
          throw new Error('main content too short');
        }

        let supplements = [];
        if (interpretLinks.length && !SKIP_SUPPLEMENTS.has(book.slug)) {
          process.stdout.write(`[${interpretLinks.length} 解讀] `);
          supplements = await fetchSupplements(interpretLinks);
          supplements = supplements.map((s) => ({
            ...s,
            html: enrichScriptureContent(s.html, book.slug),
          }));
        }

        let finalMain = mainContent;
        let supplementsHtml = '';

        if (INLINE_MERGE_MODES[book.slug] && supplements.length) {
          if (book.slug === 'xinjing' || book.slug === 'sanzijing' || book.slug === 'dizigui' || book.slug === 'qianziwen') {
            finalMain = applyInlineMerge(book.slug, mainContent, null, supplements);
            process.stdout.write('[inline 解讀] ');
          } else if (book.slug === 'dizang') {
            const chapterSupMap = parseDizangChapterSupplements(supplements);
            finalMain = applyInlineMerge(book.slug, mainContent, chapterSupMap, supplements);
            supplementsHtml = renderSupplements(
              supplements.filter((s) => s.label.includes('註解') || s.label.includes('譯文'))
            );
            process.stdout.write(`[inline 釋文 ${chapterSupMap.size} 章] `);
          } else {
            const chapterMap = parseSupplementChapterMap(supplements, book.slug);
            finalMain = applyInlineMerge(book.slug, mainContent, chapterMap, supplements);
            process.stdout.write(`[inline ${chapterMap.size} 章] `);
          }
        } else {
          supplementsHtml = renderSupplements(supplements);
        }

        finalMain = enrichScriptureContent(finalMain, book.slug);
        finalMain = applyScripturePostProcess(finalMain, book.slug);
        finalMain = injectSectionNavigation(finalMain, book.slug);

        const relatedHtml = renderRelatedSection(relatedLinks);
        const page = renderScripturePage(book, finalMain, supplementsHtml, relatedHtml);
        const outDir = path.join(root, SCRIPTURE_DIR);
        fs.mkdirSync(outDir, { recursive: true });
        const outPath = path.join(outDir, `${book.slug}.html`);
        fs.writeFileSync(outPath, page, 'utf8');

        const totalSize = mainContent.length + supplements.reduce((n, s) => n + s.html.length, 0);
        results.push({ book: book.title, ok: true, supplements: supplements.length, size: totalSize });
        console.log(`OK (${totalSize} chars, ${supplements.length} sections)`);
      } catch (err) {
        results.push({ book: book.title, ok: false, error: err.message });
        console.log(`FAIL: ${err.message}`);
      }
    }
  }

  const failed = results.filter((r) => !r.ok);
  console.log(`\nDone: ${results.length - failed.length}/${results.length} pages generated.`);
  if (failed.length) {
    console.error('Failed:', failed);
    process.exit(1);
  }
}

const isDirectRun = process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);
if (isDirectRun) main();
