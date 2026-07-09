import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = fs.readFileSync(path.join(root, 'assets/js/scriptures-catalog.js'), 'utf8');
const catalog = Function(`return ${src.replace(/^window\.WA_SCRIPTURES_CATALOG\s*=\s*/, '').replace(/;\s*$/, '')}`)();
const BASE = 'https://www.ifreesite.com/scriptures/';

for (const cat of catalog) {
  for (const book of cat.books) {
    const html = await (await fetch(BASE + book.source)).text();
    const m = html.match(/<div class="io_index">([\s\S]*?)<\/div>/);
    const links = m ? [...m[1].matchAll(/href="([^"]+\.htm)"/g)].map((x) => x[1]) : [];
    console.log(`${book.title}\t${links.length}\t${links.slice(0, 2).join(', ')}`);
  }
}
