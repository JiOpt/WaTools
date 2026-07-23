import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

const aliases = {
  'json-formatter': 'dev/json-editor.html',
  'cron-generator': 'dev/crontab-calc.html',
  'base64-encode-decode': 'security/base64.html',
  'regex-tester': 'dev/regex-test.html',
  'word-counter': 'editor/wordcount.html',
  'social-font-generator': 'creator/ig-font-generator.html',
  'markdown-to-html': 'creator/markdown-to-html-cleaner.html',
  'timestamp-converter': 'dev/timestamp.html',
  'random-draw': 'fun/lucky-draw.html',
  'unit-converter': 'life/unit-area.html',
};

function stub(target) {
  const clean = target.replace(/\.html$/, '');
  return `<!DOCTYPE html>
<html lang="zh-Hant">
<head>
  <meta charset="utf-8">
  <meta http-equiv="refresh" content="0;url=${target}">
  <link rel="canonical" href="https://kawatool.com/${clean}">
  <title>Redirecting…</title>
  <script>location.replace(${JSON.stringify(target)});</script>
</head>
<body><p>頁面已移至 <a href="${target}">${target}</a></p></body>
</html>`;
}

for (const [slug, target] of Object.entries(aliases)) {
  fs.writeFileSync(path.join(root, `${slug}.html`), stub(target), 'utf8');
  console.log(slug, '->', target);
}
