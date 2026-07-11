/**
 * Add defer to bootstrap/aos script tags on tool pages.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
let n = 0;

for (const file of fs.readdirSync(ROOT)) {
  if (!file.endsWith('.html')) continue;
  const full = path.join(ROOT, file);
  let html = fs.readFileSync(full, 'utf8');
  const before = html;
  html = html.replace(
    /<script src="(assets\/vendor\/(?:bootstrap\/js\/bootstrap\.bundle\.min|aos\/aos)\.js[^"]*)"><\/script>/g,
    (m, src) => (m.includes(' defer') ? m : `<script src="${src}" defer></script>`),
  );
  if (html !== before) {
    fs.writeFileSync(full, html, 'utf8');
    n += 1;
  }
}

console.log(`Added defer to vendor scripts on ${n} pages.`);
