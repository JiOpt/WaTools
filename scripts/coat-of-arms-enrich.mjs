/**
 * Build coat-of-arms descriptions from curated data, culture index, and flag captions.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { COAT_ENRICH } from './coat-of-arms-enrich-data.mjs';
import { CULTURE } from './world-flags-culture-data.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CAPTION_CACHE = path.join(__dirname, '_world-source.html');

const ISO3_OVERRIDES = {
  uar: 'ARE',
  xks: 'XKX',
  twn: 'TWN',
  mac: 'MAC',
  hkg: 'HKG',
};

const ISO2_OVERRIDES = {
  uar: 'ae',
  xks: 'xk',
};

function normalizeIso3(code) {
  const c = (code || '').toLowerCase();
  return (ISO3_OVERRIDES[c] || c.toUpperCase());
}

function extractEmblemFromDesc(desc) {
  if (!desc) return '';
  const m = desc.match(/國徽[／/]象徵[：:]\s*([^\n【]+)/);
  if (m) return m[1].trim();
  const m2 = desc.match(/國徽方面[，,]([^。]+。)/);
  if (m2) return m2[1].trim();
  return '';
}

function stripHtml(text) {
  return String(text || '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function sanitizeText(text) {
  let t = stripHtml(text);
  const cutMarkers = ['</div>', 'ifreesite.com', 'highslide', 'data-cf-modified', '<div', '【概況】'];
  for (const marker of cutMarkers) {
    const idx = t.indexOf(marker);
    if (idx >= 0) t = t.slice(0, idx).trim();
  }
  if (t.length > 600) t = `${t.slice(0, 597).trim()}…`;
  return t;
}

function isPollutedText(text) {
  if (!text) return true;
  return /ifreesite|<div|highslide|data-cf-modified|onclick=/i.test(text);
}

function extractEmblemFromCaption(captionText) {
  const text = stripHtml(captionText);

  const explicit = text.match(/國徽中的([^。]+(?:。|$))/);
  if (explicit) return sanitizeText(`國徽中的${explicit[1]}`);

  const aspect = text.match(/國徽方面[，,]([^。]+。)/);
  if (aspect) return sanitizeText(aspect[1]);

  const idx = text.indexOf('國徽');
  if (idx < 0) return '';

  let segment = text.slice(idx);
  segment = segment.replace(/^國徽[。．]\s*/, '');
  segment = segment.replace(/^中間為國徽[。．]\s*/, '');
  segment = segment.replace(/^[^。]*中間為國徽[。．]\s*/, '');

  if (!segment || segment.length < 12) return '';

  const flagOnlyRe = /^(藍|白|紅|紅|黃|黃|綠|綠|天藍|比例|由.*橫旗|由.*豎旗)/;
  const coatSignals = /鷹|獅|獅|盾|王冠|持|卷軸|圖騰|樹|塔|帽盔|皇冠|權杖|王球|柱|鷹|徽章|紋章|白塔|設計源自|齒輪|柴刀|軍艦鳥|獅子|金獅|雙頭/;
  if (flagOnlyRe.test(segment) && !coatSignals.test(segment)) return '';

  const sentences = segment.split(/[。！？]/).map((s) => s.trim()).filter(Boolean);
  if (!sentences.length) return '';
  const picked = [];
  for (const sentence of sentences) {
    picked.push(sentence);
    if (picked.length >= 4) break;
  }
  const emblem = `${picked.join('。')}。`;
  return sanitizeText(emblem);
}

function parseCaptionEmblems(html) {
  const map = new Map();
  if (!html) return map;
  const blockRe = /國家代碼[：:]\s*([A-Za-z0-9]+)[\s\S]*?說明[：:]([\s\S]*?)<\/div>/gi;
  let match;
  while ((match = blockRe.exec(html)) !== null) {
    const code = match[1].toLowerCase();
    const emblem = extractEmblemFromCaption(match[2]);
    if (emblem && !map.has(code)) map.set(code, emblem);
  }
  return map;
}

const GENERIC_SYMBOLS_RE = /承載.+的主權與國家認同/;
const GENERIC_HISTORY_RE = /徽章隨國家獨立、政體更迭/;
const GENERIC_COMPOSITION_RE = /^(採用歐洲紋章學結構|採用圓形國徽構圖|國家徽章通常以盾徽)/;

export function isGenericCoatField(field, text) {
  if (!text) return true;
  if (field === 'symbols') return GENERIC_SYMBOLS_RE.test(text);
  if (field === 'history') return GENERIC_HISTORY_RE.test(text);
  if (field === 'composition') return GENERIC_COMPOSITION_RE.test(text);
  return false;
}

function pickMeaningful(field, text) {
  const cleaned = sanitizeText(text);
  return isGenericCoatField(field, cleaned) ? '' : cleaned;
}

export function enrichCountry(country, captionMap) {
  const code = (country.code || '').toLowerCase();
  const curated = COAT_ENRICH[code];
  const culture = CULTURE[code] || CULTURE[ISO3_OVERRIDES[code]?.toLowerCase()];
  const captionHint = captionMap.get(code) || captionMap.get(normalizeIso3(code).toLowerCase()) || '';

  const name = curated?.name || `${country.nameZh}國徽`;
  const type = curated?.type || '國徽／紋章';

  let symbols = curated?.symbols || '';
  if (!symbols && culture?.emblem) symbols = culture.emblem;
  if (!symbols && captionHint && !isPollutedText(captionHint)) {
    symbols = captionHint
      .replace(/^國徽[。．]\s*/, '')
      .replace(/^國徽方面[，,]?/, '國徽：');
  }
  if (!symbols) {
    const fromDesc = extractEmblemFromDesc(country.desc);
    if (fromDesc) symbols = fromDesc;
  }

  symbols = pickMeaningful('symbols', symbols);
  const history = pickMeaningful('history', curated?.history || '');
  const composition = pickMeaningful('composition', curated?.composition || '');

  const descParts = [];
  if (symbols) descParts.push(`【核心象徵】${symbols}`);
  if (history) descParts.push(`【歷史演變】${history}`);
  if (composition) descParts.push(`【構圖元素】${composition}`);
  const desc = descParts.join('\n');

  return {
    ...country,
    coatName: name,
    coatType: type,
    symbols,
    history,
    composition,
    desc,
  };
}

export function enrichAll(regions) {
  const captionHtml = fs.existsSync(CAPTION_CACHE)
    ? fs.readFileSync(CAPTION_CACHE, 'utf8')
    : '';
  const captionMap = parseCaptionEmblems(captionHtml);

  return regions.map((region) => ({
    ...region,
    countries: region.countries.map((c) => enrichCountry(c, captionMap)),
  }));
}

export { ISO3_OVERRIDES, ISO2_OVERRIDES, normalizeIso3 };
