/**
 * Fix wikipedia wikitext garbage in national-anthem-data.js
 * Run: node scripts/cleanup-national-anthem-data.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { isWikiGarbage, cleanLyricsPair } from './wiki-lyrics-cleanup.mjs';
import { toTraditional } from './zh-traditional.mjs';

function cjkRatio(text) {
  const t = String(text || '').replace(/\s/g, '');
  if (!t.length) return 0;
  return (t.match(/[\u4e00-\u9fff]/g) || []).length / t.length;
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_FILE = path.join(__dirname, '..', 'assets', 'js', 'national-anthem-data.js');

const PLACEHOLDER_ZH = '（中文對照整理中）';
const PLACEHOLDER_ORIG = '（暫無公開完整歌詞資料）';

function isSectionMarker(line) {
  const t = String(line || '').trim();
  if (!t) return true;
  if (/^副歌$/i.test(t) || /^refrain$/i.test(t) || /^chorus$/i.test(t)) return true;
  if (/^[IVXLC]{1,4}$/.test(t)) return true;
  return false;
}

function normalizeLyricLines(text) {
  return String(text || '')
    .replace(/\}\}/g, '')
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && !isSectionMarker(line))
    .join('\n')
    .trim();
}

function countLines(text) {
  return normalizeLyricLines(text).split('\n').filter(Boolean).length;
}

function loadData() {
  const raw = fs.readFileSync(DATA_FILE, 'utf8');
  const marker = 'window.WA_NATIONAL_ANTHEMS = ';
  const start = raw.indexOf(marker);
  if (start < 0) throw new Error('WA_NATIONAL_ANTHEMS not found');
  const jsonText = raw.slice(start + marker.length).replace(/;\s*$/, '');
  return JSON.parse(jsonText);
}

function writeData(data) {
  const body = `/* Auto-generated — cleaned ${new Date().toISOString().slice(0, 10)} */\nwindow.WA_NATIONAL_ANTHEMS = ${JSON.stringify(data, null, 2)};\n`;
  fs.writeFileSync(DATA_FILE, body, 'utf8');
}

function fixAnthemName(text) {
  if (!text) return text;
  return toTraditional(String(text).replace(/国歌/g, '國歌'));
}

let fixed = 0;
let garbage = 0;

const data = loadData();

for (const entry of data.anthems) {
  entry.anthem = fixAnthemName(entry.anthem);
  entry.anthemOriginal = fixAnthemName(entry.anthemOriginal);

  if (!entry.verses) continue;

  for (const verse of entry.verses) {
    if (entry.source !== 'curated') {
      verse.original = normalizeLyricLines(verse.original);
      if (verse.zh && verse.zh !== PLACEHOLDER_ZH) {
        verse.zh = normalizeLyricLines(verse.zh);
      }
    }
  }

  if (entry.source === 'curated') {
    // skip wiki junk repair only
  } else {
  for (const verse of entry.verses) {
    const anthemNames = [entry.anthem, entry.anthemOriginal, entry.country]
      .map((s) => String(s || '').trim())
      .filter(Boolean);

    if (verse.zh && anthemNames.includes(String(verse.zh).trim())) {
      verse.zh = PLACEHOLDER_ZH;
    }
    if (/Category:|Bless\}\}|italic=no\|/i.test(verse.original || '') || /Category:/i.test(verse.zh || '')) {
      garbage += 1;
      const { original, zh } = cleanLyricsPair(verse.original, verse.zh);
      verse.original = isWikiGarbage(original) || original.length < 3 ? PLACEHOLDER_ORIG : original;
      verse.zh = isWikiGarbage(zh) || !zh || anthemNames.includes(zh.trim()) ? PLACEHOLDER_ZH : zh;
      fixed += 1;
      console.log(`fixed junk: ${entry.code} — ${entry.country}`);
      continue;
    }

    if (/^第一節：|^合唱：|^第二節：/.test(verse.zh || '') && countLines(verse.original) <= 1) {
      verse.original = PLACEHOLDER_ORIG;
      verse.zh = PLACEHOLDER_ZH;
      fixed += 1;
      console.log(`fixed stub: ${entry.code} — ${entry.country}`);
      continue;
    }
  }

  for (const verse of entry.verses) {
    const origBad = isWikiGarbage(verse.original) || /^!/.test(String(verse.zh || '').trim());
    const zhBad = isWikiGarbage(verse.zh) || /^!/.test(String(verse.zh || '').trim())
      || (verse.zh && cjkRatio(verse.zh) < 0.08 && cjkRatio(verse.original) < 0.08);

    if (!origBad && !zhBad && verse.zh !== verse.original) {
      if (!/^\|/.test(String(verse.zh || '').trim())) continue;
    }

    garbage += 1;
    const { original, zh } = cleanLyricsPair(verse.original, verse.zh);

    if (isWikiGarbage(original) || original.length < 3) {
      verse.original = verse.original?.startsWith('（') ? verse.original : PLACEHOLDER_ORIG;
    } else {
      verse.original = original;
    }

    if (isWikiGarbage(zh) || (zh === PLACEHOLDER_ZH && !zhBad)) {
      // keep existing placeholder
      if (zhBad) verse.zh = PLACEHOLDER_ZH;
    } else {
      verse.zh = zh;
    }

    fixed += 1;
    console.log(`fixed: ${entry.code} — ${entry.country}`);
  }
  }

  entry.verses = (entry.verses || []).filter((verse) => {
    const o = String(verse.original || '').trim();
    const z = String(verse.zh || '').trim();
    const origEmpty = !o || o === PLACEHOLDER_ORIG || /^（/.test(o) && /暫無|整理中|待補/i.test(o);
    const zhEmpty = !z || z === PLACEHOLDER_ZH || /^（/.test(z) && /整理中|待補/i.test(z);
    return !(origEmpty && zhEmpty);
  });

  if (entry.durationNote && /整理中|暫無/i.test(entry.durationNote)) {
    entry.durationNote = '';
  }
}

writeData(data);
console.log(`Done. ${garbage} garbage verse(s) found, ${fixed} cleaned.`);
