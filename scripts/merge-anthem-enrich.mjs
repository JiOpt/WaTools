/** Apply curated ANTHEM_ENRICH patches onto national-anthem-data.js */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { ANTHEM_ENRICH } from './national-anthem-enrich-data.mjs';
import { traditionalizeAnthemEntry } from './zh-traditional.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_FILE = path.join(__dirname, '..', 'assets', 'js', 'national-anthem-data.js');

const marker = 'window.WA_NATIONAL_ANTHEMS = ';
const raw = fs.readFileSync(DATA_FILE, 'utf8');
const data = JSON.parse(raw.slice(raw.indexOf(marker) + marker.length).replace(/;\s*$/, ''));

let count = 0;
for (const entry of data.anthems) {
  const enrich = ANTHEM_ENRICH[entry.code];
  if (!enrich) continue;
  const idx = data.anthems.indexOf(entry);
  data.anthems[idx] = traditionalizeAnthemEntry({
    ...entry,
    anthem: enrich.anthem || entry.anthem,
    anthemOriginal: enrich.anthemOriginal || entry.anthemOriginal,
    lang: enrich.lang || entry.lang,
    durationSec: enrich.durationSec ?? entry.durationSec,
    durationNote: enrich.durationNote || entry.durationNote,
    verses: enrich.verses,
    source: 'curated',
  });
  count += 1;
}

data.curatedCount = data.anthems.filter((a) => a.source === 'curated').length;
const out = `/* Auto-generated — enrich merge ${new Date().toISOString().slice(0, 10)} */\nwindow.WA_NATIONAL_ANTHEMS = ${JSON.stringify(data, null, 2)};\n`;
fs.writeFileSync(DATA_FILE, out, 'utf8');
console.log(`Merged ${count} curated anthem entries.`);
