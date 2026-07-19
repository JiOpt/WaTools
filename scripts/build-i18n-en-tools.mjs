/**
 * Sync accurate EN tool titles (+ optional descs) from en-catalog.mjs into i18n-en.js.
 * Run: node scripts/build-i18n-en-tools.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { EN_CATEGORIES, EN_TOOLS } from './en-catalog.mjs';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const I18N = path.join(ROOT, 'assets/js/i18n-en.js');

function loadCatalogSlugs() {
  const src = fs.readFileSync(path.join(ROOT, 'assets/js/tools-data.js'), 'utf8');
  const fn = new Function(`${src.replace('window.WA_TOOLS_CATALOG', 'var WA_TOOLS_CATALOG')}; return WA_TOOLS_CATALOG;`);
  const catalog = fn();
  const slugs = [];
  for (const cat of catalog) {
    for (const t of cat.tools || []) slugs.push(t.slug);
  }
  return slugs;
}

function esc(s) {
  return String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

function main() {
  const slugs = loadCatalogSlugs();
  const missing = slugs.filter((s) => !EN_TOOLS[s]);
  if (missing.length) {
    console.error('Missing EN translations:', missing.join(', '));
    process.exit(1);
  }

  const toolsBlock = slugs
    .slice()
    .sort()
    .map((slug) => `    '${slug}': '${esc(EN_TOOLS[slug].title)}',`)
    .join('\n');

  const descsBlock = slugs
    .slice()
    .sort()
    .map((slug) => `    '${slug}': '${esc(EN_TOOLS[slug].desc)}',`)
    .join('\n');

  const catsBlock = Object.entries(EN_CATEGORIES)
    .map(([id, name]) => `    ${id}: '${esc(name)}',`)
    .join('\n');

  let src = fs.readFileSync(I18N, 'utf8');

  src = src.replace(/categories:\s*\{[\s\S]*?\n\s*\},/, `categories: {\n${catsBlock}\n  },`);

  if (/tools:\s*\{[\s\S]*?\n\s*\},/.test(src)) {
    src = src.replace(/tools:\s*\{[\s\S]*?\n\s*\},/, `tools: {\n${toolsBlock}\n  },`);
  } else {
    throw new Error('tools block not found in i18n-en.js');
  }

  if (/toolDescs:\s*\{[\s\S]*?\n\s*\},?/.test(src)) {
    src = src.replace(/toolDescs:\s*\{[\s\S]*?\n\s*\},?/, `toolDescs: {\n${descsBlock}\n  },`);
  } else {
    src = src.replace(
      /(tools:\s*\{[\s\S]*?\n\s*\},)/,
      `$1\n  toolDescs: {\n${descsBlock}\n  },`
    );
  }

  fs.writeFileSync(I18N, src, 'utf8');
  console.log('Updated i18n-en.js tools:', slugs.length);
}

main();
