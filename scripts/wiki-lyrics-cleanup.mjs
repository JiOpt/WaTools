/**
 * Clean Wikipedia wikitext / wikitable markup from anthem lyrics.
 * Used by fetch-national-anthem-data.mjs and cleanup-national-anthem-data.mjs
 */
import { toTraditional } from './zh-traditional.mjs';

const ZH_HEADER = /中文|中譯|意譯|譯文|漢語|華語|朝鮮官定漢譯|中文翻譯|中文意譯|中文譯文|中譯文/i;
const NATIVE_HEADER = /阿拉伯|原文|官方語|母語|韓語|朝鮮語|蒙古語西里爾|亞美尼亞字母|印尼|馬來|爪夷|法語原文|西班牙語|英語|法羅語/i;
const SKIP_HEADER = /拉丁|羅馬|音譯|轉寫|國際音標|希伯來|西里爾|波斯|IPA|混用|表記/i;

/** Detect raw Wikipedia markup that should not be shown to users. */
export function isWikiGarbage(text) {
  if (!text || typeof text !== 'string') return false;
  const t = text.trim();
  if (t.length < 4) return false;
  return (
    /\{\|/.test(t)
    || /\|\}/.test(t)
    || /wikitable|toccolours/i.test(t)
    || /^!/m.test(t)
    || /^\|\-\s/m.test(t)
    || /valign\s*=|bgcolor\s*=|colspan\s*=|rowspan\s*=|cellpadding\s*=|rules\s*=|scope\s*=/i.test(t)
    || /^===\s*.+\s*===\s*$/m.test(t)
    || /^italic=no\|/i.test(t)
    || /\}\}\s*$/.test(t)
    || /-\{[^}]+\}-/.test(t)
    || /^style="/i.test(t)
    || /^馬科恩-賴肖爾/i.test(t)
  );
}

function cjkRatio(text) {
  const t = String(text || '').replace(/\s/g, '');
  if (!t.length) return 0;
  const cjk = (t.match(/[\u4e00-\u9fff]/g) || []).length;
  return cjk / t.length;
}

function extractPipedLyrics(text) {
  return String(text || '')
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.startsWith('|') && l.length > 2 && !/^\|[-\s]*$/.test(l))
    .map((l) => l.replace(/^\|\s*/, '').replace(/^valign\s*=\s*[^|]+\|/i, '').trim())
    .filter((l) => l && !/^第\d+段$/i.test(l) && !/^!/.test(l))
    .join('\n')
    .trim();
}

function stripWikiMarkup(s) {
  return String(s || '')
    .replace(/\{\{lang\|[^|]+\|([^}]+)\}\}/gi, '$1')
    .replace(/\{\{transliteration\|[^|]+\|([^}]+)\}\}/gi, '$1')
    .replace(/\{\{[^|{}|]*\|\s*([^}|]+)\s*\}\}/g, '$1')
    .replace(/\{\{[^}]+\}\}/g, '')
    .replace(/\[\[(?:[^|\]]+\|)?([^\]]+)\]\]/g, '$1')
    .replace(/<ref[^>]*\/>/g, '')
    .replace(/<ref[^>]*>[\s\S]*?<\/ref>/g, '')
    .replace(/'''+/g, '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<poem>/gi, '')
    .replace(/<\/poem>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/-\{([^}]*)\}-/g, '$1')
    .replace(/^\s*[:\*#;]+\s*/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function parseHeaderCells(row) {
  const headers = [];
  const parts = row.split('!!');
  for (let part of parts) {
    part = part.replace(/^\s*!\s*/, '').trim();
    part = part.replace(/^style="[^"]*"\s*\|/i, '').trim();
    part = part.replace(/^scope="[^"]*"\s*\|/i, '').trim();
    part = part.replace(/^bgcolor="[^"]*"\s*\|/i, '').trim();
    part = part.replace(/^\|\s*/, '').trim();
    if (part) headers.push(part);
  }
  return headers;
}

function parseDataCells(row) {
  const cells = [];
  const lines = row.split('\n');
  let buf = [];
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('|')) {
      if (buf.length) {
        cells.push(buf.join('\n').replace(/^\|\s*/, '').trim());
        buf = [];
      }
      buf.push(trimmed.replace(/^\|\s*/, ''));
    } else if (buf.length) {
      buf.push(line);
    }
  }
  if (buf.length) cells.push(buf.join('\n').replace(/^\|\s*/, '').trim());
  return cells.map((c) => c.replace(/^valign\s*=\s*[^|]+\|/i, '').trim());
}

function pickColumnIndex(headers, preferZh) {
  if (!headers.length) return -1;
  if (preferZh) {
    const zhIdx = headers.findIndex((h) => ZH_HEADER.test(h));
    if (zhIdx >= 0) return zhIdx;
  }
  const nativeIdx = headers.findIndex((h) => NATIVE_HEADER.test(h) && !SKIP_HEADER.test(h));
  if (nativeIdx >= 0) return nativeIdx;
  return 0;
}

function extractWikitable(text) {
  const tableMatch = text.match(/\{\|[\s\S]*?\|\}/);
  if (!tableMatch) return null;

  const table = tableMatch[0];
  const chunks = table.split(/\n\s*\|\-\s*/);
  let headers = [];
  const dataRows = [];

  for (const chunk of chunks) {
    const trimmed = chunk.replace(/^\{\|[^\n]*/m, '').trim();
    if (!trimmed) continue;
    if (/^\!/.test(trimmed) || trimmed.includes('\n!')) {
      const headerPart = trimmed.replace(/\|\}[\s\S]*$/, '');
      headers = parseHeaderCells(headerPart);
    } else if (trimmed.startsWith('|') || trimmed.includes('\n|')) {
      dataRows.push(trimmed.replace(/\|\}[\s\S]*$/, ''));
    }
  }

  if (!dataRows.length) return null;

  const zhIdx = headers.findIndex((h) => ZH_HEADER.test(h));
  const nativeIdx = pickColumnIndex(headers, false);

  const zhLines = [];
  const nativeLines = [];

  for (const row of dataRows) {
    const cells = parseDataCells(row);
    if (!cells.length) continue;
    if (/^第\d+段$/i.test(cells[0])) continue;
    if (zhIdx >= 0 && cells[zhIdx]) zhLines.push(stripWikiMarkup(cells[zhIdx]));
    else if (zhIdx >= 0 && cells.length > zhIdx) {
      const c = stripWikiMarkup(cells[zhIdx]);
      if (c) zhLines.push(c);
    }
    if (nativeIdx >= 0 && cells[nativeIdx]) {
      const n = stripWikiMarkup(cells[nativeIdx]);
      if (n && !/^第\d+段$/i.test(n)) nativeLines.push(n);
    } else if (cells[0]) {
      const n = stripWikiMarkup(cells[0]);
      if (n && !/^第\d+段$/i.test(n)) nativeLines.push(n);
    }
  }

  return {
    zh: zhLines.filter(Boolean).join('\n\n').trim(),
    original: nativeLines.filter(Boolean).join('\n\n').trim(),
  };
}

function extractChineseFromMixed(text) {
  const lines = text.split('\n');
  const zhLines = lines.filter((l) => {
    const t = l.trim().replace(/^\|\s*/, '');
    if (!t) return false;
    if (/^第\d+段$/i.test(t)) return false;
    if (isWikiGarbage(t)) return false;
    if (/^!/.test(t)) return false;
    const cjk = (t.match(/[\u4e00-\u9fff]/g) || []).length;
    return cjk >= 2 && cjk / t.replace(/\s/g, '').length > 0.35;
  }).map((l) => l.trim().replace(/^\|\s*/, ''));
  return zhLines.join('\n').trim();
}

function stripInfoboxJunk(text) {
  return String(text || '')
    .replace(/^italic=no\|/i, '')
    .replace(/\}\}\s*$/g, '')
    .trim();
}

/**
 * Clean lyrics text extracted from Wikipedia.
 * @returns {{ text: string, fromTable: boolean }}
 */
export function cleanWikiLyrics(text, { preferChinese = false } = {}) {
  if (!text) return { text: '', fromTable: false };

  let raw = String(text);
  raw = raw.replace(/^===\s*[^=]+\s*===\s*/gm, '');

  if (/\{\|/.test(raw)) {
    const table = extractWikitable(raw);
    if (table) {
      const picked = preferChinese ? (table.zh || table.original) : (table.original || table.zh);
      if (picked && !isWikiGarbage(picked)) {
        return { text: toTraditional(picked), fromTable: true, table };
      }
      if (table.zh || table.original) {
        const fallback = preferChinese
          ? (table.zh || extractChineseFromMixed(raw) || '')
          : (table.original || '');
        if (fallback) return { text: toTraditional(fallback), fromTable: true, table };
      }
    }
  }

  let cleaned = stripWikiMarkup(raw);
  cleaned = stripInfoboxJunk(cleaned);

  if (preferChinese) {
    const zhOnly = extractChineseFromMixed(cleaned);
    if (zhOnly) cleaned = zhOnly;
  }

  cleaned = cleaned
    .split('\n')
    .filter((line) => {
      const t = line.trim();
      if (!t) return true;
      if (/^\{\|/.test(t) || /^\|\}/.test(t)) return false;
      if (/^!\s/.test(t)) return false;
      if (/^;\S/.test(t)) return false;
      if (/^副歌$/i.test(t)) return false;
      return !/^style="|^bgcolor=|^colspan=|^rowspan=|^valign=/i.test(t);
    })
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  if (isWikiGarbage(cleaned)) {
    const zhOnly = extractChineseFromMixed(raw);
    if (zhOnly && !isWikiGarbage(zhOnly)) {
      return { text: toTraditional(zhOnly), fromTable: false };
    }
    return { text: '', fromTable: false };
  }

  return { text: toTraditional(cleaned), fromTable: false };
}

export function cleanLyricsPair(original, zh) {
  const origClean = cleanWikiLyrics(original, { preferChinese: false });
  const zhClean = cleanWikiLyrics(zh, { preferChinese: true });

  let newOriginal = origClean.text || stripInfoboxJunk(stripWikiMarkup(original));
  let newZh = zhClean.text;

  const pipedFromZh = extractPipedLyrics(zh);
  const pipedFromOrig = extractPipedLyrics(original);

  if (zhClean.table?.original && (!newOriginal || isWikiGarbage(newOriginal) || newOriginal.length < 20)) {
    if (!isWikiGarbage(zhClean.table.original)) newOriginal = zhClean.table.original;
  }
  if (zhClean.table?.zh && !newZh) newZh = zhClean.table.zh;

  if ((!newOriginal || newOriginal.length < 20 || isWikiGarbage(newOriginal)) && pipedFromZh) {
    const arabicOrNative = pipedFromZh.split('\n').filter((l) => cjkRatio(l) < 0.2).join('\n').trim();
    if (arabicOrNative) newOriginal = arabicOrNative;
  }
  if ((!newOriginal || newOriginal.length < 20) && pipedFromOrig) {
    newOriginal = pipedFromOrig;
  }

  if (isWikiGarbage(newOriginal)) {
    newOriginal = zhClean.table?.original && !isWikiGarbage(zhClean.table.original)
      ? zhClean.table.original
      : pipedFromZh || '';
  }
  if (isWikiGarbage(newZh) || /^!/.test(newZh.trim())) newZh = '';

  const zhMixed = extractChineseFromMixed(zh);
  if ((!newZh || cjkRatio(newZh) < 0.15) && zhMixed) newZh = zhMixed;

  if (newZh && cjkRatio(newZh) < 0.12 && cjkRatio(newOriginal) < 0.12 && newZh === newOriginal) {
    newZh = '';
  }
  if (newZh && cjkRatio(newZh) < 0.08) newZh = '';

  newZh = String(newZh || '')
    .split('\n')
    .map((l) => l.trim().replace(/^\|\s*/, ''))
    .filter((l) => l && !/^第\d+段$/i.test(l))
    .join('\n')
    .trim();

  return {
    original: newOriginal || original,
    zh: newZh || '（中文對照整理中）',
    fixed: origClean.fromTable || zhClean.fromTable || isWikiGarbage(original) || isWikiGarbage(zh),
  };
}
