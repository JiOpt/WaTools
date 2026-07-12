/**
 * Build national-anthem-data.js from world-flags + Wikidata + Wikipedia + curated enrich.
 * Run: node scripts/fetch-national-anthem-data.mjs
 * Options: --no-wiki  (skip Wikipedia lyrics fetch, names only)
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { ANTHEM_ENRICH } from './national-anthem-enrich-data.mjs';
import { ISO2_OVERRIDES, normalizeIso3 } from './coat-of-arms-enrich.mjs';
import { toTraditional, traditionalizeAnthemEntry } from './zh-traditional.mjs';
import { cleanWikiLyrics, isWikiGarbage } from './wiki-lyrics-cleanup.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const FLAGS_DATA = path.join(ROOT, 'assets', 'js', 'world-flags-data.js');
const ISO_MAP = path.join(__dirname, 'iso3166-alpha.json');
const OUT_DATA = path.join(ROOT, 'assets', 'js', 'national-anthem-data.js');
const WIKI_CACHE = path.join(__dirname, '_national-anthem-wiki-cache.json');

const UA = 'Kawatool/1.0 (national-anthem fetch; contact: local)';
const BATCH = 15;
const WIKI_DELAY_MS = 120;
const SPARQL_RETRIES = 3;

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function loadFlagsData() {
  const src = fs.readFileSync(FLAGS_DATA, 'utf8');
  const sandbox = { window: {} };
  const wrapped = src.replace(/window\.WA_WORLD_FLAGS\s*=/, 'sandbox.window.WA_WORLD_FLAGS =');
  // eslint-disable-next-line no-new-func
  new Function('sandbox', wrapped)(sandbox);
  return sandbox.window.WA_WORLD_FLAGS;
}

function iso2ForCode(code, isoMap) {
  const key = (code || '').toLowerCase();
  if (ISO2_OVERRIDES[key]) return ISO2_OVERRIDES[key].toUpperCase();
  const iso3 = normalizeIso3(key);
  return (isoMap[iso3] || '').toUpperCase();
}

async function fetchSparql(query, attempt = 0) {
  const url = `https://query.wikidata.org/sparql?format=json&query=${encodeURIComponent(query)}`;
  const res = await fetch(url, {
    headers: { Accept: 'application/sparql-results+json', 'User-Agent': UA },
  });
  if (!res.ok) {
    if (attempt < SPARQL_RETRIES && (res.status === 429 || res.status >= 500)) {
      await sleep(1500 * (attempt + 1));
      return fetchSparql(query, attempt + 1);
    }
    throw new Error(`Wikidata ${res.status}`);
  }
  return res.json();
}

async function fetchWikidataAnthems(iso2List) {
  const map = new Map();
  for (let i = 0; i < iso2List.length; i += BATCH) {
    const batch = iso2List.slice(i, i + BATCH);
    const values = batch.map((c) => `"${c}"`).join(' ');
    const query = `
SELECT ?iso2 ?anthemLabel ?anthemLabelEn ?anthemLabelZh WHERE {
  VALUES ?iso2 { ${values} }
  ?country wdt:P297 ?iso2 .
  OPTIONAL { ?country wdt:P85 ?anthem . }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "zh,en". }
}`;
    const data = await fetchSparql(query);
    for (const b of data.results?.bindings || []) {
      const iso2 = b.iso2?.value;
      if (!iso2) continue;
      map.set(iso2, {
        anthemLabelEn: b.anthemLabelEn?.value || b.anthemLabel?.value || '',
        anthemLabelZh: b.anthemLabelZh?.value || b.anthemLabel?.value || '',
        enTitle: '',
        zhTitle: '',
      });
    }
    process.stdout.write('.');
    await sleep(500);
  }
  console.log('\nFetching Wikipedia titles…');
  for (let i = 0; i < iso2List.length; i += BATCH) {
    const batch = iso2List.slice(i, i + BATCH);
    const values = batch.map((c) => `"${c}"`).join(' ');
    const query = `
SELECT ?iso2 ?enTitle ?zhTitle WHERE {
  VALUES ?iso2 { ${values} }
  ?country wdt:P297 ?iso2 .
  ?country wdt:P85 ?anthem .
  OPTIONAL {
    ?enArticle schema:about ?anthem ;
      schema:isPartOf <https://en.wikipedia.org/> ;
      schema:name ?enTitle .
  }
  OPTIONAL {
    ?zhArticle schema:about ?anthem ;
      schema:isPartOf <https://zh.wikipedia.org/> ;
      schema:name ?zhTitle .
  }
}`;
    try {
      const data = await fetchSparql(query);
      for (const b of data.results?.bindings || []) {
        const iso2 = b.iso2?.value;
        if (!iso2 || !map.has(iso2)) continue;
        const row = map.get(iso2);
        if (b.enTitle?.value) row.enTitle = b.enTitle.value;
        if (b.zhTitle?.value) row.zhTitle = b.zhTitle.value;
      }
    } catch {
      process.stdout.write('x');
    }
    process.stdout.write('.');
    await sleep(500);
  }
  console.log('');
  return map;
}

function loadWikiCache() {
  if (fs.existsSync(WIKI_CACHE)) {
    try {
      return JSON.parse(fs.readFileSync(WIKI_CACHE, 'utf8'));
    } catch {
      return {};
    }
  }
  return {};
}

function saveWikiCache(cache) {
  fs.writeFileSync(WIKI_CACHE, JSON.stringify(cache, null, 2), 'utf8');
}

async function fetchWikitext(title, lang = 'en') {
  if (!title) return '';
  const url = `https://${lang}.wikipedia.org/w/api.php?${new URLSearchParams({
    action: 'parse',
    page: title,
    prop: 'wikitext',
    format: 'json',
    origin: '*',
  })}`;
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) return '';
  const data = await res.json();
  if (data.error) return '';
  return data.parse?.wikitext?.['*'] || '';
}

function stripWikiMarkup(s) {
  const { text } = cleanWikiLyrics(s);
  if (text) return text;
  return String(s || '')
    .replace(/\{\{lang\|[^|]+\|([^}]+)\}\}/gi, '$1')
    .replace(/\{\{transliteration\|[^|]+\|([^}]+)\}\}/gi, '$1')
    .replace(/\{\{[^|{}|]*\|\s*([^}|]+)\s*\}\}/g, '$1')
    .replace(/\{\{[^}]+\}\}/g, '')
    .replace(/\[\[(?:[^|\]]+\|)?([^\]]+)\]\]/g, '$1')
    .replace(/<ref[^>]*\/>/g, '')
    .replace(/<ref[^>]*>[\s\S]*?<\/ref>/g, '')
    .replace(/'''+/g, '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<poem>/gi, '')
    .replace(/<\/poem>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/^\s*[:\*#]+\s*/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function extractLangBlocks(wt) {
  const blocks = [];
  const re = /\{\{lang\|([^|]+)\|([\s\S]*?)\}\}/gi;
  let m;
  while ((m = re.exec(wt)) !== null) {
    blocks.push({ lang: m[1].toLowerCase(), text: stripWikiMarkup(m[2]) });
  }
  return blocks;
}

function extractPoems(wt) {
  return [...wt.matchAll(/<poem>([\s\S]*?)<\/poem>/gi)]
    .map((m) => stripWikiMarkup(m[1]))
    .filter((t) => t.length > 8 && !/^[\s|{]+$/.test(t));
}

function extractSection(wt, titles) {
  for (const title of titles) {
    const re = new RegExp(`==\\s*${title}\\s*==([\\s\\S]*?)(?=\\n==[^=]|$)`, 'i');
    const m = wt.match(re);
    if (m) return stripWikiMarkup(m[1]);
  }
  return '';
}

function pickOriginalLyrics(enWt) {
  const langBlocks = extractLangBlocks(enWt);
  const skipLangs = new Set(['en', 'eng', 'english']);
  const native = langBlocks.find((b) => !skipLangs.has(b.lang.split('-')[0]));
  if (native?.text) return { text: native.text, lang: native.lang };

  const poems = extractPoems(enWt);
  if (poems.length) {
    const first = poems.find((p) => !/^May your reign|^Thousands of years/i.test(p)) || poems[0];
    return { text: first, lang: '' };
  }

  const sec = extractSection(enWt, ['Lyrics', 'Text', 'Original', 'Official lyrics']);
  if (sec && sec.length > 20) return { text: sec, lang: '' };

  const infobox = enWt.match(/\{\{Infobox anthem[\s\S]*?\n\}\}/i);
  if (infobox) {
    const lyricsMatch = infobox[0].match(/\|\s*lyrics\s*=\s*([\s\S]*?)(?=\n\|)/i);
    if (lyricsMatch) return { text: stripWikiMarkup(lyricsMatch[1]), lang: '' };
  }
  return { text: '', lang: '' };
}

function pickChineseLyrics(zhWt, enWt) {
  const zhSec = extractSection(zhWt, ['歌詞', '歌詞', '歌詞內容', '歌詞原文', '原文']);
  if (zhSec && zhSec.length > 10) return zhSec;

  const langBlocks = extractLangBlocks(zhWt);
  const zhBlock = langBlocks.find((b) => b.lang.startsWith('zh'));
  if (zhBlock?.text) return zhBlock.text;

  const poems = extractPoems(zhWt);
  if (poems.length) return poems[0];

  const transSec = extractSection(zhWt, ['中文翻譯', '中文譯文', '譯文', '譯文']);
  if (transSec) return transSec;

  const enPoems = extractPoems(enWt);
  const enTrans = enPoems.find((p) => /[\u4e00-\u9fff]/.test(p));
  if (enTrans) return enTrans;

  return '';
}

function splitStanzas(text) {
  if (!text) return [];
  const parts = text.split(/\n\s*\n/).map((s) => s.trim()).filter(Boolean);
  if (parts.length > 1) return parts;
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
  if (lines.length <= 6) return [text.trim()];
  const stanzas = [];
  let buf = [];
  for (const line of lines) {
    buf.push(line);
    if (buf.length >= 4) {
      stanzas.push(buf.join('\n'));
      buf = [];
    }
  }
  if (buf.length) stanzas.push(buf.join('\n'));
  return stanzas.filter(Boolean);
}

function buildVersesFromText(original, zhFull, lang) {
  const stanzas = splitStanzas(original);
  const zhStanzas = splitStanzas(zhFull);
  if (!stanzas.length) {
    return [{
      label: '歌詞',
      official: true,
      original: '（暫無公開完整歌詞資料）',
      zh: zhFull || '（中文對照整理中）',
    }];
  }
  return stanzas.map((stanza, i) => ({
    label: i === 0 ? '第一段（國際標準）' : `第${['一', '二', '三', '四', '五', '六', '七', '八'][i] || i + 1}段`,
    official: i === 0,
    original: stanza,
    zh: zhStanzas[i] || zhStanzas[0] || (i === 0 ? (zhFull || '（中文對照整理中）') : '（此段中文對照整理中）'),
  }));
}

async function fetchWikiLyrics(enTitle, zhTitle, cache) {
  const key = `${enTitle || ''}|${zhTitle || ''}`;
  if (cache[key]) return cache[key];

  const enWt = enTitle ? await fetchWikitext(enTitle, 'en') : '';
  await sleep(WIKI_DELAY_MS);
  const zhWt = zhTitle ? await fetchWikitext(zhTitle, 'zh') : '';
  await sleep(WIKI_DELAY_MS);

  const { text: original, lang } = pickOriginalLyrics(enWt);
  const zhRaw = pickChineseLyrics(zhWt, enWt);
  const zhClean = cleanWikiLyrics(zhRaw, { preferChinese: true });
  const origClean = cleanWikiLyrics(original, { preferChinese: false });

  let finalOriginal = origClean.text || original;
  let finalZh = zhClean.text || zhRaw;

  if (zhClean.table?.original && (!finalOriginal || isWikiGarbage(finalOriginal) || finalOriginal.length < 15)) {
    finalOriginal = zhClean.table.original;
  }
  if (zhClean.table?.zh) finalZh = zhClean.table.zh || finalZh;

  if (isWikiGarbage(finalOriginal)) finalOriginal = '';
  if (isWikiGarbage(finalZh)) finalZh = '';

  const result = { original: finalOriginal, zh: finalZh, lang };
  cache[key] = result;
  return result;
}

function mergeEntry(country, regionId, wd, enrich, wiki) {
  const code = country.code;
  if (enrich) {
    return traditionalizeAnthemEntry({
      code,
      country: country.nameZh,
      countryEn: country.nameEn,
      regionId,
      anthem: enrich.anthem || wd?.anthemLabelEn || wd?.anthemLabelZh || '—',
      anthemOriginal: enrich.anthemOriginal || wd?.anthemLabelZh || wd?.anthemLabelEn || '',
      lang: enrich.lang || wiki?.lang || '',
      durationSec: enrich.durationSec ?? 60,
      durationNote: enrich.durationNote || '國際場合通常僅演奏第一段或精簡版，約 45–90 秒。',
      verses: enrich.verses,
      source: 'curated',
    });
  }

  const anthemEn = wd?.anthemLabelEn || wd?.anthemLabelZh || '—';
  const anthemZh = toTraditional(wd?.anthemLabelZh || wd?.anthemLabelEn || anthemEn);
  const original = wiki?.original || '';
  const zhFull = toTraditional(wiki?.zh || anthemZh);

  return traditionalizeAnthemEntry({
    code,
    country: country.nameZh,
    countryEn: country.nameEn,
    regionId,
    anthem: anthemEn,
    anthemOriginal: anthemZh,
    lang: wiki?.lang || '',
    durationSec: 60,
    durationNote: original
      ? '國際場合通常僅演奏第一段，約 45–90 秒；以下為完整歌詞分段對照。'
      : '國歌名稱來自 Wikidata；完整歌詞資料整理中。',
    verses: buildVersesFromText(original, zhFull, wiki?.lang),
    source: original ? 'wikipedia' : 'wikidata',
  });
}

async function main() {
  const skipWiki = process.argv.includes('--no-wiki');
  const flagsData = loadFlagsData();
  const isoMap = JSON.parse(fs.readFileSync(ISO_MAP, 'utf8'));

  const countries = [];
  for (const region of flagsData.regions) {
    for (const c of region.countries) {
      countries.push({ ...c, regionId: region.id, regionLabel: region.label });
    }
  }

  const iso2List = [...new Set(countries.map((c) => iso2ForCode(c.code, isoMap)).filter(Boolean))];
  console.log(`Fetching Wikidata for ${iso2List.length} ISO codes…`);
  const wdMap = await fetchWikidataAnthems(iso2List);

  const wikiCache = loadWikiCache();
  let wikiFetched = 0;
  let withLyrics = 0;
  let curated = 0;

  const anthems = [];
  for (const country of countries) {
    const iso2 = iso2ForCode(country.code, isoMap);
    const wd = iso2 ? wdMap.get(iso2) : null;
    const enrich = ANTHEM_ENRICH[country.code];

    let wiki = null;
    if (!enrich && !skipWiki && wd) {
      const enTitle = wd.enTitle || wd.anthemLabelEn || '';
      const zhTitle = wd.zhTitle || wd.anthemLabelZh || '';
      if (enTitle || zhTitle) {
        wiki = await fetchWikiLyrics(enTitle, zhTitle, wikiCache);
        wikiFetched += 1;
        if (wikiFetched % 20 === 0) {
          saveWikiCache(wikiCache);
          process.stdout.write(`\n  wiki ${wikiFetched}…`);
        }
      }
    }

    const entry = mergeEntry(country, country.regionId, wd, enrich, wiki);
    if (enrich) curated += 1;
    anthems.push(entry);
  }

  saveWikiCache(wikiCache);

  const withFullLyrics = anthems.filter((a) =>
    a.verses?.some((v) => v.original && !v.original.startsWith('（暫無'))
  ).length;

  const payload = {
    updated: new Date().toISOString().slice(0, 7),
    countryCount: anthems.length,
    curatedCount: curated,
    lyricsCount: withFullLyrics,
    regions: flagsData.regions.map((r) => ({ id: r.id, label: r.label })),
    anthems,
  };

  const out = `/* Auto-generated by scripts/fetch-national-anthem-data.mjs — do not edit */\nwindow.WA_NATIONAL_ANTHEMS = ${JSON.stringify(payload, null, 2)};\n`;
  fs.writeFileSync(OUT_DATA, out, 'utf8');

  console.log(`Wrote ${anthems.length} anthems (${curated} curated, ${withFullLyrics} with lyrics) → ${path.relative(ROOT, OUT_DATA)}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
