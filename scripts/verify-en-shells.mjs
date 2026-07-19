/**
 * Spot-check EN shells: title/h1/og/twitter/json-ld must not contain CJK,
 * and must match en-catalog titles.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { EN_TOOLS } from './en-catalog.mjs';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const CJK = /[\u3400-\u9FFF]/;
const samples = [
  'creator/ig-font-generator',
  'japan/samurai-armor',
  'viral/mortgage-calculator',
  'culture/abc',
  'fun/ama-shima', // may not exist
  'japan/ama-shima',
  'spiritual/hawkins',
  'utility/scriptures',
  'utility/torch',
];

let fails = 0;
for (const key of samples) {
  const file = path.join(ROOT, 'en', `${key}.html`);
  if (!fs.existsSync(file)) {
    console.log('skip missing', key);
    continue;
  }
  const html = fs.readFileSync(file, 'utf8');
  const slug = key.split('/')[1];
  const expected = EN_TOOLS[slug]?.title;
  const title = (html.match(/<title>([^<]*)<\/title>/) || [])[1] || '';
  const h1 = (html.match(/<h1[^>]*>([^<]*)<\/h1>/) || [])[1] || '';
  const og = (html.match(/og:title" content="([^"]*)"/) || [])[1] || '';
  const desc = (html.match(/name="description" content="([^"]*)"/) || [])[1] || '';
  const inLang = (html.match(/"inLanguage":\s*"([^"]*)"/) || [])[1] || '';
  const decode = (s) =>
    String(s)
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>');
  const titleD = decode(title);
  const h1D = decode(h1);
  const ogD = decode(og);
  const descD = decode(desc);
  const checks = [
    ['title has EN name', expected && titleD.includes(expected)],
    ['h1 matches', h1D === expected],
    ['og English', expected && ogD.includes(expected)],
    ['no CJK title', !CJK.test(titleD)],
    ['no CJK h1', !CJK.test(h1D)],
    ['no CJK og', !CJK.test(ogD)],
    ['no CJK desc', !CJK.test(descD)],
    ['inLanguage en', inLang === 'en'],
    ['lang=en', /lang="en"/.test(html)],
    ['Settings', />Settings</.test(html)],
  ];
  const bad = checks.filter(([, ok]) => !ok);
  if (bad.length) {
    fails += 1;
    console.log('FAIL', key, bad.map(([n]) => n).join(', '));
    console.log('  title:', title);
    console.log('  h1:', h1);
  } else {
    console.log('OK', key, '→', h1);
  }
}

// Scan all en/**/*.html chrome for leftover CJK in title/h1/meta (not body tool-app)
const enRoot = path.join(ROOT, 'en');
let cjkMeta = 0;
function walk(dir) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    if (fs.statSync(p).isDirectory()) walk(p);
    else if (name.endsWith('.html')) {
      const html = fs.readFileSync(p, 'utf8');
      const head = html.slice(0, html.indexOf('</head>') + 7);
      const h1m = html.match(/<h1[^>]*>[^<]*<\/h1>/);
      if (CJK.test(head) || (h1m && CJK.test(h1m[0]))) {
        cjkMeta += 1;
        if (cjkMeta <= 15) console.log('CJK in meta/h1', path.relative(ROOT, p));
      }
    }
  }
}
walk(enRoot);
console.log('pages with CJK in head/h1:', cjkMeta);
console.log(fails ? `sample fails: ${fails}` : 'all samples OK');
process.exit(fails ? 1 : 0);
