/**
 * Regenerate 注音 from 拼音 in scripture/baijiaxing.html cards.
 * Source zhuyin from ifreesite used corrupted custom glyphs (十/兀/万 etc.).
 * Run: node scripts/fix-baijiaxing-zhuyin.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { isSuspiciousZhuyin, pinyinToZhuyin } from './baijiaxing-zhuyin.mjs';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const TARGET = path.join(ROOT, 'scripture', 'baijiaxing.html');

let html = fs.readFileSync(TARGET, 'utf8');
let fixed = 0;
const failed = [];

html = html.replace(
  /（([a-zA-ZüÜǖǘǚǜāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜê\s]+)）（([^）]+)）/g,
  (full, pinyin, zhuyin) => {
    const py = String(pinyin || '').trim();
    const oldZy = String(zhuyin || '').trim();
    if (!py || !oldZy) return full;
    const next = pinyinToZhuyin(py);
    if (!next || next === oldZy) return full;
    fixed += 1;
    return `（${py}）（${next}）`;
  }
);

html = html.replace(
  /(<div class="baijiaxing-pinyin">)([^<]*)(<\/div>\s*<div class="baijiaxing-zhuyin">)([^<]*)(<\/div>)/g,
  (full, p1, pinyin, p3, zhuyin, p5) => {
    const py = pinyin.trim();
    const zy = zhuyin.trim();
    const next = pinyinToZhuyin(py);
    if (!next) {
      failed.push({ py, zy });
      return full;
    }
    if (next !== zy || isSuspiciousZhuyin(zy)) {
      fixed += 1;
      return `${p1}${py}${p3}${next}${p5}`;
    }
    return full;
  }
);

if (failed.length) {
  console.warn('Could not convert:', failed.slice(0, 20));
  if (failed.length > 20) console.warn(`... and ${failed.length - 20} more`);
}

fs.writeFileSync(TARGET, html, 'utf8');
console.log(`Updated ${fixed} zhuyin entries in ${TARGET}`);
