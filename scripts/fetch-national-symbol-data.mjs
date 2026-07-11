/**
 * Parse ifreesite world/symbolic-roles.htm and download symbol photos.
 * Run: node scripts/fetch-national-symbol-data.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const SOURCE_URL = 'https://www.ifreesite.com/world/symbolic-roles.htm';
const IMG_DIR = path.join(ROOT, 'national-symbol-img');
const OUT = path.join(ROOT, 'assets', 'js', 'national-symbol-data.js');
const MAX_BYTES = 1024 * 1024;

function normalizeUrl(url) {
  if (url.startsWith('//')) return `https:${url}`;
  if (url.startsWith('http')) return url;
  return new URL(url, 'https://www.ifreesite.com/world/').href;
}

function cleanText(raw) {
  return raw.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function parseCountry(raw) {
  const text = cleanText(raw);
  const m = text.match(/^(.+?)\s+([A-Za-z][\w\s().'-]*)$/);
  if (m) return { countryZh: m[1].trim(), countryEn: m[2].trim(), countryLabel: text };
  return { countryZh: text, countryEn: '', countryLabel: text };
}

function parseMetaCell(raw) {
  const text = cleanText(raw);
  const m = text.match(/^([^：:]+)[：:]\s*(.+)$/);
  if (!m) return null;
  return { key: m[1].trim(), value: m[2].trim() };
}

function parseWiki(raw) {
  const m = raw.match(/href=["']([^"']+)["']/i);
  if (!m) return '';
  return normalizeUrl(m[1].replace(/^\/\//, 'https://'));
}

function slugFromUrl(url) {
  return path.basename(new URL(url).pathname).replace(/\.[^.]+$/, '');
}

function parseBlocks(html) {
  const introMatch = html.match(/<p class="tbi">([\s\S]*?)<\/p>/i);
  const intro = introMatch ? cleanText(introMatch[1]) : '';
  const disclaimerMatch = html.match(/<div class="info">([\s\S]*?)<\/div>/i);
  const disclaimer = disclaimerMatch ? cleanText(disclaimerMatch[1]) : '';

  const tableMatch = html.match(/<table width="100%" border="0" cellspacing="1" cellpadding="1">([\s\S]*?)<\/table>/i);
  if (!tableMatch) throw new Error('Table not found');
  const inner = tableMatch[1];

  const blocks = inner.split(/<tr bgcolor="#(?:F2D6D5|EDFBFC)"/i).slice(1);
  const items = [];

  blocks.forEach((block) => {
    const headerEnd = block.indexOf('</tr>');
    if (headerEnd < 0) return;
    const headerCells = [...block.slice(0, headerEnd).matchAll(/<td class="if_table">([\s\S]*?)<\/td>/gi)];
    const countries = headerCells.map((c) => parseCountry(c[1]));
    const body = block.slice(headerEnd);

    const imageRow = body.match(/<tr bgcolor="#FFFFFF" align="center">([\s\S]*?)<\/tr>/i);
    if (!imageRow) return;
    const imageCells = [...imageRow[1].matchAll(/<td class="if_tabls">([\s\S]*?)<\/td>/gi)];

    const metaRows = [...body.matchAll(/<tr bgcolor="#FFFFFF">([\s\S]*?)<\/tr>/gi)];
    const metaByCol = countries.map(() => ({}));
    metaRows.forEach((row) => {
      const cells = [...row[1].matchAll(/<td class="if_tabls">([\s\S]*?)<\/td>/gi)];
      cells.forEach((cell, idx) => {
        const meta = parseMetaCell(cell[1]);
        if (!meta) {
          if (cell[1].includes('專頁')) metaByCol[idx].wiki = parseWiki(cell[1]);
          return;
        }
        if (meta.key === '中文') metaByCol[idx].nameZh = meta.value;
        else if (meta.key === '英文') metaByCol[idx].nameEn = meta.value;
        else if (meta.key === '學名') metaByCol[idx].scientific = meta.value;
        else if (meta.key === '又稱') metaByCol[idx].alias = meta.value;
        else if (meta.key === '專頁') metaByCol[idx].wiki = parseWiki(cell[1]);
      });
    });

    imageCells.forEach((cell, idx) => {
      const imgM = cell[1].match(/<img src="([^"]+)" title="([^"]+)"/i);
      if (!imgM) return;
      const roleM = cell[1].match(/<br\s*\/?>\s*([^<\n]+)/i);
      const country = countries[idx] || { countryZh: '', countryEn: '', countryLabel: '' };
      const meta = metaByCol[idx] || {};
      const imgUrl = normalizeUrl(imgM[1]);
      const slug = slugFromUrl(imgUrl);
      items.push({
        id: slug,
        ...country,
        role: roleM ? cleanText(roleM[1]) : '',
        nameShort: imgM[2],
        nameZh: meta.nameZh || imgM[2],
        nameEn: meta.nameEn || '',
        scientific: meta.scientific || '',
        alias: meta.alias || '',
        wiki: meta.wiki || '',
        image: `national-symbol-img/${path.basename(new URL(imgUrl).pathname)}`,
        _imgUrl: imgUrl,
      });
    });
  });

  return { intro, disclaimer, items };
}

async function downloadImage(url, dest) {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'MyTooLife/1.0 (national-symbol fetch)' },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length > MAX_BYTES) {
    throw new Error(`Image exceeds ${MAX_BYTES} bytes (${buf.length})`);
  }
  fs.writeFileSync(dest, buf);
  return buf.length;
}

async function main() {
  const local = path.join(ROOT, '.tmp-symbolic-roles-ifree.html');
  let html;
  if (fs.existsSync(local)) {
    html = fs.readFileSync(local, 'utf8');
  } else {
    const res = await fetch(SOURCE_URL, {
      headers: { 'User-Agent': 'MyTooLife/1.0 (national-symbol fetch)' },
    });
    if (!res.ok) throw new Error(`Fetch failed ${res.status}`);
    html = await res.text();
    fs.writeFileSync(local, html);
  }

  const { intro, disclaimer, items } = parseBlocks(html);
  fs.mkdirSync(IMG_DIR, { recursive: true });

  let downloaded = 0;
  let skipped = 0;
  for (const item of items) {
    const dest = path.join(ROOT, item.image);
    try {
      if (fs.existsSync(dest)) {
        const size = fs.statSync(dest).size;
        if (size <= MAX_BYTES) {
          skipped += 1;
          delete item._imgUrl;
          continue;
        }
      }
      const size = await downloadImage(item._imgUrl, dest);
      downloaded += 1;
      process.stdout.write('.');
      if (size > MAX_BYTES) console.warn(`\nWarn: ${item.image} is ${size} bytes`);
    } catch (err) {
      console.warn(`\nSkip ${item.id}: ${err.message}`);
      item.image = item._imgUrl;
    }
    delete item._imgUrl;
  }
  console.log(`\nImages: ${downloaded} downloaded, ${skipped} cached.`);

  const body = `/* Auto-generated — ifreesite symbolic-roles */
window.WA_NATIONAL_SYMBOLS = ${JSON.stringify({
    updated: new Date().toISOString().slice(0, 10),
    sourcePage: SOURCE_URL,
    intro,
    disclaimer,
    itemCount: items.length,
    items,
  }, null, 2)};
`;
  fs.writeFileSync(OUT, body, 'utf8');
  console.log(`Wrote ${items.length} items -> ${OUT}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
