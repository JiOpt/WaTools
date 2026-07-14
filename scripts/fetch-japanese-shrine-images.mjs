/**
 * Download Wikimedia Commons thumbs (<1MB) for japanese-shrine tool.
 * Usage: node scripts/fetch-japanese-shrine-images.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, '..', 'world', 'japanese-shrine-img');

/** slug -> Commons File: title (verified) */
const FILES = {
  'hokkaido-jingu': 'File:Hokkaido Jingu.JPG',
  'shiogama': 'File:Shiogama jinja(Shinbashi, Minato) 01.jpg', // fallback if Miyagi fails - will replace
  'meiji-jingu': 'File:Torii Gate at Meiji Jingu Shrine, Tokyo (50125273602).jpg',
  'kanda-myojin': 'File:Kanda-Myojin 501.jpg',
  'asakusa': 'File:Asakusa shrine 2012.JPG',
  'tsurugaoka': 'File:Tsurugaoka Hachimangu 001.jpg',
  'kashima': 'File:Kashima-jingu haiden-1.JPG',
  'atsuta': 'File:Atsuta Shrine.jpg',
  'suwa': 'File:Suwa taisha harumiya13bs3200.jpg',
  'ise': 'File:IseShrine.jpg',
  'fushimi-inari': 'File:Torii path with lantern at Fushimi Inari Taisha Shrine, Kyoto, Japan.jpg',
  'yasaka': 'File:Honden, Yasaka-jinja, Kyoto, 20240820 1700 5154.jpg',
  'kasuga': 'File:Kasuga Shrine.JPG',
  'sumiyoshi': 'File:Sumiyoshi taisha.jpg',
  'izumo': 'File:Izumo-taisha Shrine, Izumo City, Shimane Prefecture, October 2017 (1).jpg',
  'itsukushima': 'File:Itsukushima Gate.jpg',
  'kotohira': 'File:Kotohira-gu.jpg',
  'dazaifu': 'File:Dazaifu Tenmangu Shrine.jpg',
  'usa': 'File:Usa Shrine.JPG',
};

async function sleep(ms) {
  await new Promise((r) => setTimeout(r, ms));
}

async function fetchThumb(fileTitle, width = 720) {
  const api = new URL('https://commons.wikimedia.org/w/api.php');
  api.searchParams.set('action', 'query');
  api.searchParams.set('titles', fileTitle);
  api.searchParams.set('prop', 'imageinfo');
  api.searchParams.set('iiprop', 'url|size|mime');
  api.searchParams.set('iiurlwidth', String(width));
  api.searchParams.set('format', 'json');
  api.searchParams.set('origin', '*');

  const res = await fetch(api, {
    headers: { 'User-Agent': 'KawatoolShrineBot/1.0 (educational; contact kawatool.com)' },
  });
  const text = await res.text();
  if (text.startsWith('You are')) throw new Error('rate-limited');
  if (!res.ok) throw new Error(`API ${res.status}`);
  const json = JSON.parse(text);
  const page = Object.values(json.query.pages)[0];
  if (page.missing != null || !page?.imageinfo?.[0]) throw new Error(`missing ${fileTitle}`);
  const info = page.imageinfo[0];
  return info.thumburl || info.url;
}

async function download(slug, fileTitle) {
  const dest = path.join(outDir, `${slug}.jpg`);
  if (fs.existsSync(dest) && fs.statSync(dest).size > 8_000) {
    console.log(`skip ${slug}`);
    return true;
  }
  let url;
  try {
    url = await fetchThumb(fileTitle, 720);
  } catch (err) {
    console.warn(`fail API ${slug}: ${err.message}`);
    return false;
  }
  await sleep(400);
  const imgRes = await fetch(url, {
    headers: { 'User-Agent': 'KawatoolShrineBot/1.0 (educational; contact kawatool.com)' },
  });
  if (!imgRes.ok) {
    console.warn(`fail download ${slug}: ${imgRes.status}`);
    return false;
  }
  let buf = Buffer.from(await imgRes.arrayBuffer());
  if (buf.length > 1_000_000) {
    await sleep(600);
    const smaller = await fetchThumb(fileTitle, 480);
    const r2 = await fetch(smaller, {
      headers: { 'User-Agent': 'KawatoolShrineBot/1.0 (educational; contact kawatool.com)' },
    });
    buf = Buffer.from(await r2.arrayBuffer());
  }
  fs.writeFileSync(dest, buf);
  console.log(`ok ${slug} ${Math.round(buf.length / 1024)}KB`);
  return true;
}

fs.mkdirSync(outDir, { recursive: true });

for (const [slug, fileTitle] of Object.entries(FILES)) {
  await download(slug, fileTitle);
  await sleep(1200);
}
