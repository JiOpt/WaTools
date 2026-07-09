import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = fs.readFileSync(path.join(root, 'assets/js/tools-data.js'), 'utf8');
const catalog = Function(`return ${src.replace(/^window\.WA_TOOLS_CATALOG\s*=\s*/, '').replace(/;\s*$/, '')}`)();
const all = catalog.flatMap((c) => c.tools.map((t) => t.slug));

const slugs = new Set();
for (const part of ['part1', 'part2', 'part3']) {
  const code = fs.readFileSync(path.join(root, `assets/js/tools-implementations-${part}.js`), 'utf8');
  for (const m of code.matchAll(/R\.([\w-]+)\s*=\s*function/g)) slugs.add(m[1]);
  for (const m of code.matchAll(/R\[['"]([\w-]+)['"]\]\s*=/g)) slugs.add(m[1]);
}

const missing = all.filter((s) => !slugs.has(s) && s !== 'torch');
console.log(`Catalog: ${all.length}, Registered: ${slugs.size}, Missing: ${missing.length}`);
if (missing.length) console.log(missing.join(', '));
