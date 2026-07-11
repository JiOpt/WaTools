import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { attachNativeNames, loadEndonymIndex } from './world-flags-native.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const IMG_DIR = path.join(ROOT, 'world-flags-img');
const OUT_DATA = path.join(ROOT, 'assets', 'js', 'world-flags-data.js');

const REGION_MAP = {
  '亞洲國旗': 'asia',
  '歐洲國旗': 'europe',
  '北美洲國旗': 'north-america',
  '非洲國旗': 'africa',
  '南美洲國旗': 'south-america',
  '大洋洲國旗': 'oceania',
  '其他旗幟': 'other',
};

const REGION_LABEL = {
  asia: '亞洲',
  europe: '歐洲',
  'north-america': '北美洲',
  africa: '非洲',
  'south-america': '南美洲',
  oceania: '大洋洲',
  other: '其他旗幟',
};

const REGION_ORDER = [
  'asia',
  'europe',
  'north-america',
  'africa',
  'south-america',
  'oceania',
  'other',
];

function normalizeUrl(url) {
  if (url.startsWith('//')) return `https:${url}`;
  if (url.startsWith('http')) return url;
  return new URL(url, 'https://www.ifreesite.com/world/').href;
}

function parseCaption(html) {
  const text = html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .trim();
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);

  let nameEn = '';
  let nameZh = '';
  let code = '';
  let desc = '';

  for (const line of lines) {
    const m = line.match(/^([^：:]+)[：:]\s*(.+)$/);
    if (!m) continue;
    const key = m[1].trim();
    const val = m[2].trim();
    if (key === '英文') nameEn = val;
    else if (key === '中文' && !nameZh) nameZh = val;
    else if (key === '國家代碼') code = val.toLowerCase();
    else if (key === '說明') desc = val;
  }

  return { nameEn, nameZh, code, desc };
}

function parseNameFromAnchor(anchorHtml, titleAttr) {
  const brParts = anchorHtml
    .replace(/<img[\s\S]*?>/i, '')
    .split(/<br\s*\/?>/i)
    .map((p) => p.replace(/<[^>]+>/g, '').trim())
    .filter(Boolean);

  let nameEn = brParts[0] || '';
  let nameZh = brParts.slice(1).join(' / ') || '';

  if (titleAttr) {
    const titleMatch = titleAttr.match(/^(.+?)\s*-\s*(.+)$/);
    if (titleMatch) {
      const a = titleMatch[1].trim();
      const b = titleMatch[2].trim();
      if (/^[A-Za-z]/.test(a)) {
        nameEn = nameEn || a;
        nameZh = nameZh || b;
      } else {
        nameZh = nameZh || a;
        nameEn = nameEn || b;
      }
    }
  }

  return { nameEn, nameZh };
}

function parseCountries(html) {
  const regionMap = new Map();

  const sections = html.split(/<h1[^>]*>/i).slice(1);
  for (const section of sections) {
    const titleMatch = section.match(/^([\s\S]*?)<\/h1>/i);
    if (!titleMatch) continue;

    const title = titleMatch[1].replace(/<[^>]+>/g, '').trim();
    const regionId = REGION_MAP[title];
    if (!regionId) continue;

    if (!regionMap.has(regionId)) {
      regionMap.set(regionId, {
        id: regionId,
        label: REGION_LABEL[regionId],
        countries: [],
        seen: new Set(),
      });
    }
    const region = regionMap.get(regionId);
    const body = section.slice(titleMatch[0].length);

    const blockRegex = /<div>\s*<a[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>\s*<div class="highslide-caption">([\s\S]*?)<\/div>\s*<\/div>/gi;
    let match;
    while ((match = blockRegex.exec(body)) !== null) {
      const imgUrlRaw = match[1];
      const anchorHtml = match[2];
      const captionHtml = match[3];

      const imgMatch = anchorHtml.match(/<img[^>]+src=["']([^"']+)["'][^>]*(?:title=["']([^"']*)["'])?/i);
      if (!imgMatch) continue;

      const imgUrl = normalizeUrl(imgMatch[1] || imgUrlRaw);
      const titleAttr = imgMatch[2] || '';
      const fromAnchor = parseNameFromAnchor(anchorHtml, titleAttr);
      const fromCaption = parseCaption(captionHtml);

      const nameEn = fromCaption.nameEn || fromAnchor.nameEn;
      const nameZh = fromCaption.nameZh || fromAnchor.nameZh || nameEn;
      const code = fromCaption.code;
      const desc = fromCaption.desc;

      const dedupeKey = imgUrl.toLowerCase();
      if (region.seen.has(dedupeKey)) continue;
      region.seen.add(dedupeKey);

      region.countries.push({
        nameEn,
        nameZh,
        code,
        desc,
        imgUrl,
        _caption: captionHtml,
      });
    }
  }

  return REGION_ORDER.filter((id) => regionMap.has(id)).map((id) => {
    const { seen, ...rest } = regionMap.get(id);
    return rest;
  });
}

async function downloadImage(url, dest) {
  if (fs.existsSync(dest)) return;
  const res = await fetch(url, {
    headers: { 'User-Agent': 'WaWaTools/1.0 (world-flags fetch)' },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(dest, buf);
}

async function main() {
  const cachePath = path.join(__dirname, '_world-source.html');
  let html;

  if (process.argv.includes('--offline') && fs.existsSync(cachePath)) {
    html = fs.readFileSync(cachePath, 'utf8');
    console.log('Using cached HTML');
  } else {
    console.log('Fetching https://www.ifreesite.com/world/ ...');
    const res = await fetch('https://www.ifreesite.com/world/', {
      headers: { 'User-Agent': 'WaWaTools/1.0 (world-flags fetch)' },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    html = await res.text();
    fs.writeFileSync(cachePath, html);
  }

  const regions = parseCountries(html);
  console.log('Loading native/endonym names...');
  const endonymIndex = await loadEndonymIndex();

  for (const region of regions) {
    for (const country of region.countries) {
      attachNativeNames(country, endonymIndex, country._caption);
      delete country._caption;
    }
  }

  fs.mkdirSync(IMG_DIR, { recursive: true });

  const skipImages = process.argv.includes('--names-only');
  let downloaded = 0;
  let skipped = 0;

  if (skipImages) {
    const existing = fs.existsSync(OUT_DATA)
      ? JSON.parse(fs.readFileSync(OUT_DATA, 'utf8').replace(/^[\s\S]*?=\s*/, '').replace(/;\s*$/, ''))
      : null;
    const imageByKey = new Map();
    if (existing?.regions) {
      for (const region of existing.regions) {
        for (const country of region.countries) {
          imageByKey.set(`${country.nameEn}|${country.code}`, country.image);
        }
      }
    }
    for (const region of regions) {
      for (const country of region.countries) {
        const key = `${country.nameEn}|${country.code}`;
        country.image = imageByKey.get(key) || `world-flags-img/${country.code || 'flag'}_flag.png`;
        delete country.imgUrl;
      }
    }
    console.log('Skipped image download (--names-only).');
  } else {
    for (const region of regions) {
      for (const country of region.countries) {
        const filename = path.basename(new URL(country.imgUrl).pathname);
        country.image = `world-flags-img/${filename}`;
        const dest = path.join(ROOT, country.image);

        try {
          await downloadImage(country.imgUrl, dest);
          if (fs.existsSync(dest)) downloaded += 1;
          process.stdout.write('.');
        } catch (err) {
          console.warn(`\nSkip ${country.nameZh}: ${err.message}`);
          country.image = country.imgUrl;
          skipped += 1;
        }
        delete country.imgUrl;
      }
    }
  }
  if (!skipImages) {
    console.log(`\nImages: ${downloaded} ok, ${skipped} failed.`);
  }

  const withNatives = regions.reduce((n, r) => n + r.countries.filter((c) => c.natives?.length).length, 0);
  console.log(`Native names attached: ${withNatives} countries.`);

  const payload = {
    regions: regions.map((r) => ({
      id: r.id,
      label: r.label,
      countries: r.countries,
    })),
  };

  const js = `/* Auto-generated by scripts/fetch-world-flags.mjs — do not edit by hand */\nwindow.WA_WORLD_FLAGS = ${JSON.stringify(payload, null, 2)};\n`;
  fs.writeFileSync(OUT_DATA, js);

  const total = payload.regions.reduce((n, r) => n + r.countries.length, 0);
  console.log(`Wrote ${total} countries in ${payload.regions.length} regions -> ${OUT_DATA}`);

  if (!process.argv.includes('--skip-desc')) {
    console.log('Enriching country descriptions...');
    const { spawnSync } = await import('node:child_process');
    const r = spawnSync(process.execPath, [path.join(__dirname, 'enrich-world-flags-desc.mjs')], {
      stdio: 'inherit',
      cwd: ROOT,
    });
    if (r.status !== 0) process.exit(r.status || 1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
