/**
 * Fetch 24 solar terms from ifreesite, download images, emit solar-terms-data.js.
 * Run: node scripts/fetch-solar-terms-data.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const INDEX_URL = 'https://www.ifreesite.com/24-solar-terms/';
const BASE = 'https://www.ifreesite.com/24-solar-terms/';
const IMG_DIR = path.join(ROOT, 'solar-terms-img');
const OUT = path.join(ROOT, 'assets', 'js', 'solar-terms-data.js');
const MAX_BYTES = 512 * 1024;
const UA = 'Kawatool/1.0 (solar-terms fetch)';

/** Kawatool 智慧補充：現代生活小提示 */
const WAWA_TIPS = {
  立春: '春捂秋凍從這天起算——薄外套先別收，早晚溫差仍大。',
  雨水: '雨量漸增，檢查家裡排水與雨具；也是調整作息、多補水分的好時機。',
  驚蟄: '萬物甦醒，過敏季開跑：除蟎、通風，戶外活動選空氣較好的時段。',
  春分: '晝夜均分，適合整理房間、重設運動計畫，讓生活節奏跟著「平衡」走。',
  清明: '掃墓踏青之外，也是檢視防火與行車安全的高風險時節。',
  穀雨: '春茶、春播尾聲；飲食可少酸多甘，幫身體順應濕氣漸重。',
  立夏: '正式進入夏令，冷氣濾網、電扇該保養了；午後小睡十分鐘勝過硬撐。',
  小滿: '小得盈滿——工作排程別塞太滿，留一點緩衝給自己。',
  芒種: '忙種忙收，適合清點待辦、完成半成品；高溫下戶外活動記得補水。',
  夏至: '日最長，防曬與熱傷害優先；晚餐可提早，睡眠品質會更好。',
  小暑: '暑氣初盛，少冰多溫；冷氣溫度別低於 26°C，省電也護身。',
  大暑: '一年最熱，重質不重量地運動；綠豆、冬瓜等清暑食材可常備。',
  立秋: '秋老虎還在，別急著換厚被；早晚涼了再調整衣櫥。',
  處暑: '「出暑」前後，適合把夏季積累的疲勞用散步、伸展慢慢卸掉。',
  白露: '夜涼日暖，蓋被要分層；秋燥起，潤喉茶比手搖飲更實用。',
  秋分: '晝夜再平衡，適合檢視年度目標完成度，該收尾的收尾。',
  寒露: '露凝而寒，腳踝與腹部保暖；登山賞葉記得看天氣與路況。',
  霜降: '秋末冬初，進補宜溫而不燥；葉黃時節也是整理照片、回顧的好時刻。',
  立冬: '冬藏開始，熱湯與規律睡眠比狂吃補品更重要。',
  小雪: '初雪時節，檢查車輛與居家保暖；室內記得適度通風防乾燥。',
  大雪: '嚴寒將至，戶外運動縮短時間、加強熱身；年終前適合靜心規劃。',
  冬至: '日最短，團圓湯圓之外，也是調整情緒、早點睡的一個自然節點。',
  小寒: '三九前後，手腳冰冷者可泡腳再睡；年終報告別熬夜硬撐。',
  大寒: '寒極將轉暖，春節前最後衝刺——把該寄的、該還的、該說的逐一完成。',
};

const TERM_CATEGORY = {
  立春: '八位', 春分: '八位', 立夏: '八位', 夏至: '八位',
  立秋: '八位', 秋分: '八位', 立冬: '八位', 冬至: '八位',
  小暑: '氣溫', 大暑: '氣溫', 處暑: '氣溫', 小寒: '氣溫', 大寒: '氣溫',
  雨水: '降水', 穀雨: '降水', 白露: '降水', 寒露: '降水', 霜降: '降水', 小雪: '降水', 大雪: '降水',
  驚蟄: '物候', 清明: '物候', 小滿: '物候', 芒種: '物候',
};

const HUANGJING = {
  立春: 315, 雨水: 330, 驚蟄: 345, 春分: 0, 清明: 15, 穀雨: 30,
  立夏: 45, 小滿: 60, 芒種: 75, 夏至: 90, 小暑: 105, 大暑: 120,
  立秋: 135, 處暑: 150, 白露: 165, 秋分: 180, 寒露: 195, 霜降: 210,
  立冬: 225, 小雪: 240, 大雪: 255, 冬至: 270, 小寒: 285, 大寒: 300,
};

function cleanText(raw) {
  return raw
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&[a-z]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function cleanBlock(raw) {
  return raw
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<font[^>]*>/gi, '')
    .replace(/<\/font>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .split('\n')
    .map((l) => l.replace(/\s+/g, ' ').trim())
    .filter(Boolean)
    .join('\n');
}

function normalizeUrl(url) {
  if (url.startsWith('//')) return `https:${url}`;
  if (url.startsWith('http')) return url;
  if (url.startsWith('/')) return `https://www.ifreesite.com${url}`;
  return new URL(url, BASE).href;
}

function parseIndex(html) {
  const introMatch = html.match(/<p class="tbi">([\s\S]*?)<\/p>/i);
  const intro = introMatch ? cleanText(introMatch[1]) : '';
  const items = [];
  const re = /<a href="([^"]+\.htm)" class="taggll[opqx]">\s*<div>\s*<img src="([^"]+)"[^>]*>\s*<\/div>\s*<strong>([^<]+)<\/strong>\s*<br\s*\/?>\s*<span>([^<]*)<\/span>\s*<sup class="star[^"]*">([^<]+)<\/sup>/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    const [, href, thumb, title, dateSpan, season] = m;
    const titleParts = title.trim().match(/^(.+?)\s+(.+)$/);
    items.push({
      page: path.basename(href),
      thumbSrc: thumb,
      nameZh: titleParts ? titleParts[1].trim() : title.trim(),
      nameEn: titleParts ? titleParts[2].trim() : '',
      dateApprox: cleanText(dateSpan.replace(/^公曆:\s*/, '')),
      season: season.trim(),
    });
  }
  if (items.length !== 24) {
    throw new Error(`Expected 24 terms, got ${items.length}`);
  }
  return { intro, items };
}

function parseDetail(html) {
  const introMatch = html.match(/<p class="tbi">([\s\S]*?)<\/p>/i);
  const intro = introMatch ? cleanText(introMatch[1]) : '';

  const tooltext = html.match(/<div class="tooltext">([\s\S]*?)<\/div>\s*<\/div>\s*<\/section>/i);
  const body = tooltext ? tooltext[1] : html;

  const imgMatch = body.match(/<img src="(image\/[^"]+\.jpg)"[^>]*title="([^"]+)"/i);
  const imageFile = imgMatch ? path.basename(imgMatch[1]) : '';
  const imageTitle = imgMatch ? imgMatch[2] : '';

  const paras = [...body.matchAll(/<p>([\s\S]*?)<\/p>/gi)]
    .map((p) => cleanBlock(p[1]))
    .filter((t) => t.length > 20 && !t.startsWith('Copyright'));

  const summary = paras[0] || intro;

  const sections = {};
  const sectionRe = /<span class="if_boxe">([^<]+)<\/span>[\s\S]*?<hr[^>]*>\s*<p>([\s\S]*?)<\/p>/gi;
  let sm;
  while ((sm = sectionRe.exec(body)) !== null) {
    const key = sm[1].trim();
    sections[key] = cleanBlock(sm[2]);
  }

  const proverbs = sections['諺語']
    ? sections['諺語'].split('\n').map((line) => {
      const idx = line.indexOf('：');
      if (idx > 0 && idx < 12) {
        return { saying: line.slice(0, idx).trim(), meaning: line.slice(idx + 1).trim() };
      }
      return { saying: line, meaning: '' };
    })
    : [];

  return {
    intro,
    summary: summary.slice(0, 600),
    imageFile,
    imageTitle,
    meaning: sections['節氣'] || '',
    customs: sections['習俗'] || '',
    health: sections['養生'] || '',
    proverbs,
  };
}

async function fetchText(url) {
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`HTTP ${res.status} ${url}`);
  return res.text();
}

async function downloadImage(url, dest) {
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length > MAX_BYTES) throw new Error(`Image too large (${buf.length})`);
  fs.writeFileSync(dest, buf);
  return buf.length;
}

async function main() {
  const localIndex = path.join(ROOT, 'scripts', '_solar-terms-ifree.html');
  const indexHtml = fs.existsSync(localIndex)
    ? fs.readFileSync(localIndex, 'utf8')
    : await fetchText(INDEX_URL);

  const { intro, items } = parseIndex(indexHtml);
  fs.mkdirSync(IMG_DIR, { recursive: true });

  const overviewUrl = normalizeUrl('image/the-24-solar-terms.png');
  const overviewDest = path.join(IMG_DIR, 'the-24-solar-terms.png');
  if (!fs.existsSync(overviewDest)) {
    await downloadImage(overviewUrl, overviewDest);
    console.log('Downloaded overview diagram');
  }

  let downloaded = 0;
  let cached = 0;

  for (const item of items) {
    const slug = path.basename(item.page, '.htm');
    item.id = slug;
    item.category = TERM_CATEGORY[item.nameZh] || '';
    item.huangjing = HUANGJING[item.nameZh] ?? null;
    item.wawaTip = WAWA_TIPS[item.nameZh] || '';

    const pageUrl = normalizeUrl(item.page);
    process.stdout.write(`\n${item.nameZh}… `);
    const detailHtml = await fetchText(pageUrl);
    const detail = parseDetail(detailHtml);
    Object.assign(item, detail);

    const files = [
      { src: item.thumbSrc, name: path.basename(item.thumbSrc) },
      { src: `image/${item.imageFile}`, name: item.imageFile },
    ].filter((f) => f.name);

    for (const f of files) {
      const dest = path.join(IMG_DIR, f.name);
      item[f.name.includes('_s.') ? 'thumb' : 'image'] = `solar-terms-img/${f.name}`;
      if (fs.existsSync(dest)) {
        cached += 1;
        continue;
      }
      try {
        await downloadImage(normalizeUrl(f.src), dest);
        downloaded += 1;
        process.stdout.write('.');
      } catch (err) {
        console.warn(` skip ${f.name}: ${err.message}`);
        item[f.name.includes('_s.') ? 'thumb' : 'image'] = normalizeUrl(f.src);
      }
    }
    delete item.thumbSrc;
    delete item.imageFile;
    await new Promise((r) => setTimeout(r, 200));
  }

  const glossary = {
    poem: '春雨驚春清穀天，夏滿芒夏暑相連；秋處露秋寒霜降，冬雪雪冬小大寒。',
    poemNote: '每句六字對應六個節氣；「六廿一、八廿三」指公曆日期多在 6/21 或 8/23 前後。',
    about: '二十四節氣依太陽在黃道上的位置，每 15° 一節，把一年分成 24 等份。它既是農事曆法，也是華人生活節奏的時間座標。',
    categories: [
      { label: '八位', desc: '立春、春分、立夏、夏至、立秋、秋分、立冬、冬至——標記季節轉折。' },
      { label: '氣溫', desc: '小暑、大暑、處暑、小寒、大寒——反映冷熱起伏。' },
      { label: '降水', desc: '雨水、穀雨、白露、寒露、霜降、小雪、大雪——與雨霧雪霜相關。' },
      { label: '物候', desc: '驚蟄、清明、小滿、芒種——記錄生物與農事節奏。' },
    ],
    seasons: [
      { id: '春', months: '立春～穀雨', note: '古代以立春為歲首，萬物始生。' },
      { id: '夏', months: '立夏～大暑', note: '日長雨熱，農忙高峰。' },
      { id: '秋', months: '立秋～霜降', note: '暑退涼生，收穫與倉廩之時。' },
      { id: '冬', months: '立冬～大寒', note: '日短藏養，靜候陽氣再升。' },
    ],
  };

  const body = `/* Auto-generated — ifreesite 24-solar-terms + Kawatool tips */
window.WA_SOLAR_TERMS = ${JSON.stringify({
    updated: new Date().toISOString().slice(0, 10),
    sourcePage: INDEX_URL,
    overviewImage: 'solar-terms-img/the-24-solar-terms.png',
    intro,
    glossary,
    termCount: items.length,
    terms: items,
  }, null, 2)};
`;
  fs.writeFileSync(OUT, body, 'utf8');
  console.log(`\nImages: ${downloaded} downloaded, ${cached} cached.`);
  console.log(`Wrote ${items.length} terms -> ${OUT}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
