import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const FROM = [
  'width="160" height="40"',
  'width="224" height="56"',
];
const TO = 'width="808" height="336"';

function walk(dir) {
  let n = 0;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ent.name.startsWith('.')) continue;
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      if (['node_modules', '.git', '.firebase'].includes(ent.name)) continue;
      n += walk(full);
      continue;
    }
    if (!ent.name.endsWith('.html')) continue;
    let text = fs.readFileSync(full, 'utf8');
    let next = text;
    for (const from of FROM) {
      next = next.split(from).join(TO);
    }
    if (next !== text) {
      fs.writeFileSync(full, next, 'utf8');
      n += 1;
    }
  }
  return n;
}

console.log(`Fixed logo dimensions in ${walk(ROOT)} files.`);
