/**
 * Rename brand display Kawatool → KaWaTool.
 * Does not change kawatool.com URLs or localStorage / event keys.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const SKIP_DIRS = new Set(['node_modules', '.git', '.firebase', 'functions']);
const EXT = new Set(['.html', '.js', '.mjs', '.css', '.md', '.txt', '.json']);

const REPLACEMENTS = [
  ['Kawatool', 'KaWaTool'],
];

function shouldSkipDir(name) {
  return SKIP_DIRS.has(name);
}

function transform(content) {
  let out = content;
  for (const [from, to] of REPLACEMENTS) {
    out = out.split(from).join(to);
  }
  return out;
}

function walk(dir, files = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ent.isDirectory()) {
      if (shouldSkipDir(ent.name)) continue;
      walk(path.join(dir, ent.name), files);
    } else {
      const ext = path.extname(ent.name);
      if (!EXT.has(ext)) continue;
      if (ent.name === 'package-lock.json') continue;
      files.push(path.join(dir, ent.name));
    }
  }
  return files;
}

let changed = 0;
for (const file of walk(root)) {
  const before = fs.readFileSync(file, 'utf8');
  const after = transform(before);
  if (after !== before) {
    fs.writeFileSync(file, after, 'utf8');
    changed += 1;
  }
}

console.log(`Renamed brand in ${changed} files.`);
