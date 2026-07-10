import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, 'world-flags-capitals-zh.json');

const SPARQL = `
SELECT ?capitalLabelEn ?capitalLabelZh WHERE {
  ?country wdt:P31/wdt:P279* wd:Q3624078.
  ?country wdt:P36 ?capital.
  ?capital rdfs:label ?capitalLabelEn. FILTER(LANG(?capitalLabelEn) = "en")
  OPTIONAL { ?capital rdfs:label ?capitalLabelZh. FILTER(LANG(?capitalLabelZh) = "zh") }
}
`.trim();

const MANUAL = {
  'beijing': '北京',
  'taipei': '臺北',
  'hong kong': '香港',
  'macau': '澳門',
  'seoul': '首爾',
  'pyongyang': '平壤',
  'washington, d.c.': '華盛頓',
  'washington, d.c': '華盛頓',
  'washington d.c.': '華盛頓',
  'washington': '華盛頓',
  'london': '倫敦',
  'paris': '巴黎',
  'berlin': '柏林',
  'moscow': '莫斯科',
  'tokyo': '東京',
  'ulaanbaatar': '烏蘭巴託',
  'ulan bator': '烏蘭巴託',
  'new delhi': '新德里',
  'mumbai': '孟買',
  'bombay': '孟買',
  'alofi': '阿洛菲',
  'funafuti': '富納富提',
  'wellington': '威靈頓',
  'canberra': '坎培拉',
  'ottawa': '渥太華',
  'brussels': '布魯塞爾',
  'vatican city': '梵蒂岡城',
  'the hague': '海牙',
  'sri jayawardenepura kotte': '斯里賈亞瓦德納普拉科特',
  'port of spain': '西班牙港',
  'saint john\'s': '聖約翰',
  'st. john\'s': '聖約翰',
  'são tomé': '聖多美',
  'sao tome': '聖多美',
  'nuku\'alofa': '努庫阿洛法',
  'nukualofa': '努庫阿洛法',
};

async function main() {
  const url = `https://query.wikidata.org/sparql?format=json&query=${encodeURIComponent(SPARQL)}`;
  const res = await fetch(url, { headers: { 'User-Agent': 'WaTools/1.0 (world-flags capitals)' } });
  if (!res.ok) throw new Error(`Wikidata HTTP ${res.status}`);
  const data = await res.json();
  const map = { ...MANUAL };
  for (const row of data.results.bindings) {
    const en = row.capitalLabelEn?.value?.trim();
    const zh = row.capitalLabelZh?.value?.trim();
    if (!en || !zh) continue;
    map[en.toLowerCase()] = zh;
  }
  fs.writeFileSync(OUT, JSON.stringify(map, null, 2), 'utf8');
  console.log(`Saved ${Object.keys(map).length} capital translations -> ${OUT}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
