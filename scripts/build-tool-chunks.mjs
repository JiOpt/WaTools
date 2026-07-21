/**
 * Build slug -> implementation chunk map from part1/2/3/wawa + per-page data scripts.
 * Run: node scripts/build-tool-chunks.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'assets', 'js', 'tool-chunks.js');

const PARTS = [
  { id: 1, file: 'tools-implementations-part1.js' },
  { id: 2, file: 'tools-implementations-part2.js' },
  { id: 3, file: 'tools-implementations-part3.js' },
  { id: 4, file: 'tools-implementations-wawa.js' },
];

const SKIP_JS = new Set([
  'tool-ui.js',
  'tool-runner.js',
  'tool-boot.js',
  'tool-chunks.js',
  'main.js',
  'prefs-boot.js',
  'tools-implementations-part1.js',
  'tools-implementations-part2.js',
  'tools-implementations-part3.js',
  'tools-implementations-wawa.js',
]);

const CATEGORY_DIRS = [
  'utility', 'dev', 'editor', 'security', 'media', 'life', 'fun',
  'culture', 'symbols', 'spiritual', 'creator', 'viral', 'live', 'world', 'japan', 'scripture',
  'toeic', 'toefl',
];

/** Per-slug data / boot scripts not present in generated tool HTML. */
const SLUG_EXTRAS = {
  settings: ['user-preferences.js'],
  qrcode: ['vendor/qrcodegen.js', 'vendor/qrcodejs.min.js', 'qrcode-tool.js'],
  population: ['population-data.js'],
  'world-flags': ['world-flags-data.js'],
  'coat-of-arms': ['coat-of-arms-data.js'],
  'national-anthem': ['national-anthem-data.js', 'national-anthem-audio.js'],
  'national-symbol': ['national-symbol-data.js'],
  monster: ['monster-data.js'],
  ufo: ['ufo-data.js'],
  'symbols-generator': ['symbols-generator-data.js'],
  'keyboard-symbols': ['keyboard-symbols-data.js', 'keyboard-symbols-curated.js'],
  emoji: ['emoji-data.js'],
  exif: ['vendor/exifr.full.umd.js', 'exif-tool.js'],
  punctuation: ['punctuation-data.js'],
  'symbols-name': ['symbols-name-data.js'],
  'world-time': ['world-time-data.js'],
  'solar-terms': ['solar-terms-data.js'],
  currency: ['currency-data.js'],
  calendar: ['calendar-engine.js', 'calendar-holidays.js', 'calendar-glossary.js', 'chinese-calendar.js'],
  'japanese-shrine': ['japanese-shrine-data.js'],
  'anime-hometown': ['anime-hometown-data.js'],
  retro: ['japan-theme-tools.js'],
  yokai: ['japan-theme-tools.js'],
  yokocho: ['japan-theme-tools.js'],
  gourmet: ['japan-theme-tools.js'],
  stay: ['japan-theme-tools.js'],
  'fuji-views': ['japan-theme-extra.js'],
  'sakura-front': ['japan-theme-extra.js'],
  'momiji-trail': ['japan-theme-extra.js'],
  'matsuri-calendar': ['japan-theme-extra.js'],
  'hanabi-guide': ['japan-theme-extra.js'],
  'torii-tunnel': ['japan-theme-extra.js'],
  karesansui: ['japan-theme-extra.js'],
  kenrokuen: ['japan-theme-extra.js'],
  'otaru-canal': ['japan-theme-extra.js'],
  'nagoya-castle': ['japan-theme-extra.js'],
  'onsen-kyo': ['japan-theme-extra.js'],
  'wagashi-scroll': ['japan-theme-extra.js'],
  'aizome-kimono': ['japan-theme-extra.js'],
  'railway-views': ['japan-theme-extra.js'],
  'ama-shima': ['japan-theme-extra.js'],
  'ghost-stations': ['japan-theme-extra.js'],
  'inari-fox': ['japan-theme-extra.js'],
  'samurai-armor': ['japan-theme-extra.js'],
  'ukiyo-e-now': ['japan-theme-extra.js'],
  'kabukicho-neon': ['japan-theme-extra.js'],
  'ig-font-generator': ['creator-tools.js'],
  'image-compressor': ['creator-tools.js'],
  'labor-retirement-calculator': ['creator-tools.js'],
  'instagram-caption-formatter': ['creator-tools.js'],
  'meme-caption-generator': ['creator-tools.js'],
  'line-image-preview-cropper': ['creator-tools.js'],
  'markdown-to-html-cleaner': ['creator-tools.js'],
  'password-generator-pro': ['creator-tools.js'],
  'speech-to-text-notebook': ['creator-tools.js'],
  'qr-code-beautifier': ['creator-tools.js'],
  'invoice-checker': ['viral-tools.js'],
  'mortgage-calculator': ['viral-tools.js'],
  'income-tax-estimator': ['viral-tools.js'],
  'overtime-leave-calculator': ['viral-tools.js'],
  'labor-health-insurance': ['viral-tools.js'],
  'ig-grid-splitter': ['viral-tools.js'],
  'chat-screenshot-maker': ['viral-tools.js'],
  'avatar-safe-zone': ['viral-tools.js'],
  'resume-photo-spec': ['viral-tools.js'],
  'youtube-thumbnail-factory': ['viral-tools.js'],
  'hashtag-organizer': ['viral-tools.js'],
  'llm-api-cost-calculator': ['viral-tools.js'],
  'meeting-cost-calculator': ['viral-tools.js'],
  'gpa-calculator': ['viral-tools.js'],
  'vehicle-loan-calculator': ['viral-tools.js'],
  'daily-fortune-card': ['viral-tools.js'],
  'speech-time-estimator': ['viral-tools.js'],
  'video-to-gif': ['viral-tools.js'],
  'pdf-page-reorder': ['viral-tools.js'],
  'audio-notes-summarizer': ['viral-tools.js'],
  'threads-persona-analyzer': ['viral-tools.js'],
  'link-preview-card': ['viral-tools.js'],
  'live-crypto': ['live-tools.js'],
  'live-fx': ['live-tools.js'],
  'live-earthquake': ['live-tools.js'],
  'live-tw-quake': ['live-tools.js'],
  'live-weather': ['live-tools.js'],
  'live-flight': ['live-tools.js'],
  'live-football': ['live-tools.js'],
  'live-nba': ['live-tools.js'],
  'live-gold': ['live-tools.js'],
  'live-trends': ['live-tools.js'],
  'toeic-intro': ['toeic-tools.js'],
  'toeic-mock-tests': ['toeic-tools.js'],
  'toeic-score-levels': ['toeic-tools.js'],
  'toeic-vocab': ['toeic-vocab-data.js', 'toeic-tools.js'],
  'toeic-listening': ['toeic-listening-data.js', 'toeic-tools.js'],
  'toeic-reading': ['toeic-reading-data.js', 'toeic-tools.js'],
  'toeic-grammar': ['toeic-grammar-data.js', 'toeic-tools.js'],
  'toeic-study-plan': ['toeic-tools.js'],
  'toeic-error-review': ['toeic-tools.js'],
  'toeic-resources': ['toeic-tools.js'],
  'toeic-registration': ['toeic-tools.js'],
  'toeic-speaking-writing': ['toeic-tools.js'],
  'toeic-mindset': ['toeic-tools.js'],
  'toefl-intro': ['toefl-tools.js'],
  'toefl-mock-tests': ['toefl-tools.js'],
  'toefl-score-levels': ['toefl-tools.js'],
  'toefl-vocab': ['toefl-vocab-data.js', 'toefl-tools.js'],
  'toefl-listening': ['toefl-listening-data.js', 'toefl-tools.js'],
  'toefl-reading': ['toefl-reading-data.js', 'toefl-tools.js'],
  'toefl-grammar': ['toefl-grammar-data.js', 'toefl-tools.js'],
  'toefl-speaking': ['toefl-speaking-data.js', 'toefl-tools.js'],
  'toefl-writing': ['toefl-writing-data.js', 'toefl-tools.js'],
  'toefl-study-plan': ['toefl-tools.js'],
  'toefl-error-review': ['toefl-tools.js'],
  'toefl-resources': ['toefl-tools.js'],
  'toefl-registration': ['toefl-tools.js'],
  'toefl-mindset': ['toefl-tools.js'],
};

const SLUG_PART_OVERRIDES = {
  settings: 2,
};

function slugFromPart(content, partId) {
  const map = {};
  for (const m of content.matchAll(/R\['([^']+)'\]\s*=/g)) map[m[1]] = partId;
  for (const m of content.matchAll(/R\.([a-zA-Z][\w-]*)\s*=\s*function/g)) map[m[1]] = partId;
  for (const m of content.matchAll(/makeUnitTool\(\s*['"]([^'"]+)['"]/g)) map[m[1]] = partId;
  return map;
}

function extrasFromHtml(html) {
  const extras = [];
  for (const m of html.matchAll(/assets\/js\/([^"?]+\.js)/g)) {
    const base = m[1].split('/').pop();
    if (SKIP_JS.has(base)) continue;
    if (!extras.includes(base)) extras.push(base);
  }
  return extras;
}

function collectToolHtmlFiles() {
  const files = [];
  const rootHtml = fs.readdirSync(ROOT).filter((f) => f.endsWith('.html') && f !== 'index.html' && f !== 'index_plan.html');
  rootHtml.forEach((f) => files.push({ file: f, dir: ROOT }));

  for (const cat of CATEGORY_DIRS) {
    const dir = path.join(ROOT, cat);
    if (!fs.existsSync(dir)) continue;
    fs.readdirSync(dir)
      .filter((f) => f.endsWith('.html'))
      .forEach((f) => files.push({ file: f, dir }));
  }
  return files;
}

const slugPart = {};
for (const { id, file } of PARTS) {
  const filePath = path.join(ROOT, 'assets', 'js', file);
  if (!fs.existsSync(filePath)) continue;
  const text = fs.readFileSync(filePath, 'utf8');
  Object.assign(slugPart, slugFromPart(text, id));
}

const chunks = {};

for (const { file, dir } of collectToolHtmlFiles()) {
  const slug = file.replace(/\.html$/, '');
  const html = fs.readFileSync(path.join(dir, file), 'utf8');
  if (!html.includes('id="tool-app"')) continue;

  const part = SLUG_PART_OVERRIDES[slug] || slugPart[slug];
  if (!part) continue;

  const extra = [...extrasFromHtml(html)];
  for (const file of SLUG_EXTRAS[slug] || []) {
    if (!extra.includes(file)) extra.push(file);
  }
  chunks[slug] = extra.length ? { part, extra } : { part };
}

const body = `/* Auto-generated — node scripts/build-tool-chunks.mjs */
window.WA_TOOL_CHUNKS = ${JSON.stringify(chunks, null, 2)};
`;
fs.writeFileSync(OUT, body, 'utf8');
console.log(`Wrote ${Object.keys(chunks).length} tool chunks -> ${OUT}`);
