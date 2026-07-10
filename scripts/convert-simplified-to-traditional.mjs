/**
 * Convert Simplified Chinese to Traditional (zh-TW) across site text files.
 * Run: node scripts/convert-simplified-to-traditional.mjs
 * Preserves PRC anthem original lyrics (zh-Hans official text).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

import { Converter } from 'opencc-js';

const s2t = Converter({ from: 'cn', to: 'tw' });

const SKIP_DIRS = new Set([
  'node_modules', 'assets/vendor', 'assets/img', '.git', '.firebase',
  'world-flags-img', 'coat-of-arms-img', 'ufo-img', 'terminals',
]);
const EXT = new Set(['.html', '.js', '.mjs', '.md', '.css']);

/** Official simplified lyrics to restore after bulk convert */
const PRESERVE_BLOCKS = [];

function walk(dir, out = []) {
  for (const name of fs.readdirSync(dir)) {
    if (SKIP_DIRS.has(name)) continue;
    const full = path.join(dir, name);
    const st = fs.statSync(full);
    if (st.isDirectory()) walk(full, out);
    else if (EXT.has(path.extname(name).toLowerCase())) out.push(full);
  }
  return out;
}

function extractPreserveBlocks(content, file) {
  if (!file.endsWith('national-anthem-data.js') && !file.endsWith('national-anthem-enrich-data.mjs')) {
    return { content, blocks: [] };
  }
  const blocks = [];
  let idx = 0;
  const replaced = content.replace(/"original":\s*"((?:\\.|[^"\\])*)"/g, (match, inner, offset) => {
    const before = content.slice(Math.max(0, offset - 400), offset);
    if (!/lang":\s*"zh-Hans"|code":\s*"chn"/.test(before) && !inner.includes('起來')) {
      return match;
    }
    if (!/[\u4e00-\u9fff]/.test(inner)) return match;
    const hasSimp = /[國學會時這來過們為經發對現開說]/u.test(inner);
    if (!hasSimp && !inner.includes('起來')) return match;
    const token = `__PRESERVE_${idx}__`;
    blocks.push({ token, value: inner });
    idx += 1;
    return `"original": "${token}"`;
  });
  return { content: replaced, blocks };
}

function restorePreserveBlocks(content, blocks) {
  let out = content;
  for (const { token, value } of blocks) {
    out = out.replace(token, value.replace(/\$/g, '$$$$'));
  }
  return out;
}

function convertFile(file) {
  const rel = path.relative(ROOT, file);
  let raw = fs.readFileSync(file, 'utf8');
  if (!/[\u4e00-\u9fff]/.test(raw)) return false;

  const { content: staged, blocks } = extractPreserveBlocks(raw, file);
  let converted = s2t(staged);
  converted = restorePreserveBlocks(converted, blocks);

  if (converted === raw) return false;
  fs.writeFileSync(file, converted, 'utf8');
  console.log('converted:', rel);
  return true;
}

let count = 0;
for (const file of walk(ROOT)) {
  if (convertFile(file)) count += 1;
}
console.log(`Done. ${count} files updated.`);
