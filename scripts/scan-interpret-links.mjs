import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = fs.readFileSync(path.join(root, 'assets/js/scriptures-catalog.js'), 'utf8');
const catalog = Function(`return ${src.replace(/^window\.WA_SCRIPTURES_CATALOG\s*=\s*/, '').replace(/;\s*$/, '')}`)();
const BASE = 'https://www.ifreesite.com/scriptures/';

function extractLinks(html, className) {
  const re = new RegExp(`<div class="${className}">([\\s\\S]*?)<\\/div>`);
  const m = html.match(re);
  if (!m) return [];
  return [...m[1].matchAll(/href="([^"]+\.htm)"[^>]*>([\s\S]*?)<\/a>/g)].map((x) => ({
    href: x[1].replace(/^\.\//, ''),
    label: x[2].replace(/<[^>]+>/g, '').trim(),
  }));
}

for (const cat of catalog) {
  for (const book of cat.books) {
    const html = await (await fetch(BASE + book.source)).text();
    const indexLinks = extractLinks(html, 'io_index');
    const commentLinks = extractLinks(html, 'io_comment').filter((l) =>
      html.includes('解讀') && html.indexOf(l.href) < html.indexOf('相關')
    );
    const commentSection = html.match(/<div class="io_comment">([\s\S]*?)<\/div>/);
    let interpretLinks = [];
    if (commentSection) {
      const part = commentSection[1].split(/<strong>相關/i)[0];
      interpretLinks = [...part.matchAll(/href="([^"]+\.htm)"[^>]*>([\s\S]*?)<\/a>/g)].map((x) => ({
        href: x[1].replace(/^\.\//, ''),
        label: x[2].replace(/<[^>]+>/g, '').trim(),
      }));
    }
    const all = indexLinks.length ? indexLinks : interpretLinks;
    console.log(`${book.title}\tindex:${indexLinks.length}\tinterpret:${interpretLinks.length}\t${all.slice(0,2).map((l) => l.label).join('|')}`);
  }
}
