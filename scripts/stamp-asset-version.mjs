/**
 * Sync site version for cache busting.
 *
 * Usage:
 *   node scripts/stamp-asset-version.mjs          # JS-only (default): main.js only
 *   node scripts/stamp-asset-version.mjs --html     # also stamp CSS/vendor ?v= in all HTML
 *   node scripts/stamp-asset-version.mjs --all      # same as --html
 *
 * JS/CSS 小改動請用預設模式，不必動 180+ HTML。
 * 只有改 bootstrap、main.css 等靜態引用時才加 --html。
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { WA_SITE_VERSION } from './site-version.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const args = new Set(process.argv.slice(2));
const stampHtml = args.has('--html') || args.has('--all');

const ASSET_ATTR_RE = /((?:href|src)=["'])((?:\.\.\/)?assets\/[^"?#]+)(?:\?v=[^"#]*)?(["'])/g;
const ENTRY_SCRIPT_RE = /((?:href|src)=["'])((?:\.\.\/)?assets\/js\/(?:main|prefs-boot)\.js)(?:\?v=[^"#]*)?(["'])/g;

/** CSS / vendor / images — keep ?v= for immutable cache busting. */
const STAMPED_ASSET_RE = /((?:href|src)=["'])((?:\.\.\/)?assets\/(?!(?:js\/(?:main|prefs-boot)\.js))[^"?#]+)(?:\?v=[^"#]*)?(["'])/g;

function stripEntryScriptVersions(content) {
  return content.replace(ENTRY_SCRIPT_RE, '$1$2$3');
}

function stampStaticAssets(content) {
  return content.replace(STAMPED_ASSET_RE, (_, prefix, assetPath, suffix) => {
    return `${prefix}${assetPath}?v=${WA_SITE_VERSION}${suffix}`;
  });
}

function collectHtmlFiles(dir) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== 'node_modules') {
      files.push(...collectHtmlFiles(full));
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      files.push(full);
    }
  }
  return files;
}

const skipDirs = new Set(['node_modules', 'scripts', 'forms', 'assets']);
const htmlFiles = collectHtmlFiles(root).filter((file) => {
  const rel = path.relative(root, file);
  const top = rel.split(path.sep)[0];
  return !skipDirs.has(top);
});

function syncMainJs() {
  const mainPath = path.join(root, 'assets', 'js', 'main.js');
  if (!fs.existsSync(mainPath)) return false;
  const mainSrc = fs.readFileSync(mainPath, 'utf8');
  const synced = mainSrc.replace(
    /const WA_SITE_VERSION = '[^']+';/,
    `const WA_SITE_VERSION = '${WA_SITE_VERSION}';`,
  );
  if (synced === mainSrc) return false;
  fs.writeFileSync(mainPath, synced, 'utf8');
  return true;
}

let entryStripped = 0;
let htmlStamped = 0;

if (stampHtml) {
  for (const file of htmlFiles) {
    const original = fs.readFileSync(file, 'utf8');
    let next = stripEntryScriptVersions(original);
    next = stampStaticAssets(next);
    if (next !== original) {
      fs.writeFileSync(file, next, 'utf8');
      htmlStamped += 1;
    }
  }
} else {
  for (const file of htmlFiles) {
    const original = fs.readFileSync(file, 'utf8');
    const next = stripEntryScriptVersions(original);
    if (next !== original) {
      fs.writeFileSync(file, next, 'utf8');
      entryStripped += 1;
    }
  }
}

const mainSynced = syncMainJs();

if (stampHtml) {
  console.log(`Stamped CSS/vendor ?v=${WA_SITE_VERSION} on ${htmlStamped} HTML file(s) (${htmlFiles.length} scanned).`);
} else {
  console.log(`JS-only: synced main.js -> v${WA_SITE_VERSION}${mainSynced ? '' : ' (unchanged)'}.`);
  if (entryStripped) {
    console.log(`Removed ?v= from main.js/prefs-boot.js in ${entryStripped} HTML file(s).`);
  }
  console.log('Tip: use --html only when CSS or vendor assets change.');
}
