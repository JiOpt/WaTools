/**
 * Generate sitemap.txt from tools-data.js (all slugs published by default).
 * Run: node scripts/init-sitemap-txt.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'sitemap.txt');

const dataSrc = fs.readFileSync(path.join(ROOT, 'assets', 'js', 'tools-data.js'), 'utf8');
const slugs = [...dataSrc.matchAll(/slug:\s*'([^']+)'/g)].map((m) => m[1]);
const unique = [...new Set(slugs)].sort((a, b) => a.localeCompare(b, 'zh-Hant'));

const body = [
  '# Toolpian 發布清單',
  '# 在此檔案中的 slug 會出現在左側網站地圖與首頁工具目錄。',
  '# 以 # 開頭為註解；空行略過。一行一個 slug。',
  `# updated: ${new Date().toISOString()}`,
  '',
  ...unique,
  '',
].join('\n');

fs.writeFileSync(OUT, body, 'utf8');
console.log(`Wrote ${unique.length} slugs -> ${OUT}`);
