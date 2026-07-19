/**
 * Reorder WA_TOOLS_CATALOG for brand-first homepage: unique tech tools up front.
 * Run: node scripts/reorder-catalog-brand.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const FILE = path.join(ROOT, 'assets/js/tools-data.js');

const ORDER = [
  'viral',
  'creator',
  'fun',
  'life',
  'utility',
  'media',
  'editor',
  'security',
  'dev',
  'japan',
  'world',
  'symbols',
  'culture',
  'spiritual',
];

const FUN_PRIORITY = [
  'rp-test',
  'fortune-stick',
  'reaction-test',
  'lucky-draw',
  'mind-reader',
  'zodiac',
  'lucky-number',
  'wishing-tree',
  'jinyong',
  'alchemist',
  'ghost-story',
];

const VIRAL_PRIORITY = [
  'threads-persona-analyzer',
  'mortgage-calculator',
  'llm-api-cost-calculator',
  'invoice-checker',
  'income-tax-estimator',
  'meeting-cost-calculator',
  'daily-fortune-card',
  'chat-screenshot-maker',
  'ig-grid-splitter',
  'youtube-thumbnail-factory',
];

function prioritize(tools, priority) {
  const map = new Map(tools.map((t) => [t.slug, t]));
  const front = priority.map((s) => map.get(s)).filter(Boolean);
  const back = tools.filter((t) => !priority.includes(t.slug));
  return [...front, ...back];
}

const src = fs.readFileSync(FILE, 'utf8');
const body = src.replace(/^window\.WA_TOOLS_CATALOG\s*=\s*/, '').replace(/;\s*$/, '');
const catalog = Function(`return (${body})`)();

const byId = new Map(catalog.map((c) => [c.id, c]));
const ordered = [];
for (const id of ORDER) {
  if (byId.has(id)) ordered.push(byId.get(id));
}
for (const c of catalog) {
  if (!ORDER.includes(c.id)) ordered.push(c);
}

const util = ordered.find((c) => c.id === 'utility');
if (util) {
  const scriptures = util.tools.filter((t) => t.slug === 'scriptures');
  const rest = util.tools.filter((t) => t.slug !== 'scriptures');
  util.tools = [...rest, ...scriptures];
}

const fun = ordered.find((c) => c.id === 'fun');
if (fun) fun.tools = prioritize(fun.tools, FUN_PRIORITY);

const viral = ordered.find((c) => c.id === 'viral');
if (viral) viral.tools = prioritize(viral.tools, VIRAL_PRIORITY);

// Keep original quoting style roughly: double-quoted JSON is valid JS
const out = `window.WA_TOOLS_CATALOG = ${JSON.stringify(ordered, null, 2)};\n`;
fs.writeFileSync(FILE, out, 'utf8');

console.log('Category order:', ordered.map((c) => `${c.id}(${c.name})`).join(' → '));
console.log('utility last tool:', util?.tools.at(-1)?.slug);
console.log('fun first tools:', fun?.tools.slice(0, 5).map((t) => t.slug).join(', '));
console.log('viral first tools:', viral?.tools.slice(0, 5).map((t) => t.slug).join(', '));
