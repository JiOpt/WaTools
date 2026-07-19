/* Merge L1/L2 extras into toeic-vocab-data.js and toeic-vocab-l2-data.js */
import fs from 'fs';
import path from 'path';
import vm from 'vm';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

function loadWindowJs(rel) {
  const code = fs.readFileSync(path.join(root, rel), 'utf8');
  const ctx = { window: {} };
  vm.runInNewContext(code, ctx);
  return ctx.window;
}

function esc(s) {
  return String(s ?? '')
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'");
}

function makeEx(w, pos, zh) {
  const p = String(pos || 'n.').toLowerCase();
  if (p.startsWith('v')) {
    return {
      ex: `We need to ${w} before the deadline.`,
      exZh: `我們須在期限前完成${zh}。`,
    };
  }
  if (p.startsWith('adj')) {
    return {
      ex: `This is a ${w} requirement for the project.`,
      exZh: `這是專案的${zh}要求。`,
    };
  }
  if (p.startsWith('adv')) {
    return {
      ex: `Please proceed ${w} with the plan.`,
      exZh: `請${zh}執行此計畫。`,
    };
  }
  return {
    ex: `Please review the ${w} carefully.`,
    exZh: `請仔細檢視${zh}。`,
  };
}

function rowToWord(row, level, tag) {
  const [w, pos, zh, syn] = row;
  const { ex, exZh } = makeEx(w, pos, zh);
  const o = { w, pos, zh, syn, ex, exZh };
  if (level === 2) {
    o.level = 2;
    o.tag = tag || 'advanced';
  }
  return o;
}

function fmtWord(o, withLevel) {
  const base = `{ w: '${esc(o.w)}', pos: '${esc(o.pos)}', zh: '${esc(o.zh)}', syn: '${esc(o.syn)}', ex: '${esc(o.ex)}', exZh: '${esc(o.exZh)}'`;
  if (withLevel) return base + `, level: ${o.level || 2}, tag: '${esc(o.tag || 'advanced')}' }`;
  return base + ' }';
}

function uniqAppend(existing, extras, level, tag) {
  const seen = new Set(existing.map((x) => String(x.w).toLowerCase()));
  const out = existing.slice();
  for (const row of extras) {
    const key = String(row[0]).toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(rowToWord(row, level, tag));
  }
  return out;
}

const L1_META = {
  office: { name: '辦公室日常', nameEn: 'Office & Daily Work', tip: '同義詞常出現在聽力與 Part 5／7。' },
  hr: { name: '人事招募', nameEn: 'HR & Recruitment', tip: '同義詞常出現在聽力與 Part 5／7。' },
  finance: { name: '財務會計', nameEn: 'Finance & Accounting', tip: '同義詞常出現在聽力與 Part 5／7。' },
  sales: { name: '業務銷售', nameEn: 'Sales & Marketing', tip: '同義詞常出現在聽力與 Part 5／7。' },
  travel: { name: '差旅交通', nameEn: 'Travel & Transport', tip: '同義詞常出現在聽力與 Part 5／7。' },
  dining: { name: '餐飲招待', nameEn: 'Dining & Hospitality', tip: '同義詞常出現在聽力與 Part 5／7。' },
  purchasing: { name: '採購訂貨', nameEn: 'Purchasing & Orders', tip: '同義詞常出現在聽力與 Part 5／7。' },
  logistics: { name: '物流出貨', nameEn: 'Shipping & Logistics', tip: '同義詞常出現在聽力與 Part 5／7。' },
  it: { name: '資訊系統', nameEn: 'IT & Systems', tip: '同義詞常出現在聽力與 Part 5／7。' },
  meetings: { name: '會議簡報', nameEn: 'Meetings & Presentations', tip: '同義詞常出現在聽力與 Part 5／7。' },
  housing: { name: '住宿租屋', nameEn: 'Housing & Facilities', tip: '同義詞常出現在聽力與 Part 5／7。' },
  insurance: { name: '保險理賠', nameEn: 'Insurance & Claims', tip: '同義詞常出現在聽力與 Part 5／7。' },
  media: { name: '媒體廣告', nameEn: 'Media & Advertising', tip: '同義詞常出現在聽力與 Part 5／7。' },
  training: { name: '訓練發展', nameEn: 'Training & Development', tip: '同義詞常出現在聽力與 Part 5／7。' },
  retail: { name: '零售服務', nameEn: 'Retail & Customer Service', tip: '同義詞常出現在聽力與 Part 5／7。' },
};

const L2_NEW = [
  {
    id: 'banking',
    name: '銀行與金融市場進階',
    nameEn: 'Banking & Financial Markets',
    tip: '信用、匯兌、證券與合規用語常見於閱讀長文。',
  },
  {
    id: 'hospitality',
    name: '航空／飯店／旅宿服務進階',
    nameEn: 'Aviation & Hospitality',
    tip: '航空與飯店服務情境在聽力極常見。',
  },
];

const win = loadWindowJs('assets/js/toeic-vocab-data.js');
const win2 = loadWindowJs('assets/js/toeic-vocab-l2-data.js');
const l1Extra = JSON.parse(fs.readFileSync(path.join(root, 'scripts/data/toeic-l1-extra.json'), 'utf8'));
const l2a = JSON.parse(fs.readFileSync(path.join(root, 'scripts/data/toeic-l2-extra-a.json'), 'utf8'));
const l2b = JSON.parse(fs.readFileSync(path.join(root, 'scripts/data/toeic-l2-extra-b.json'), 'utf8'));
const l2c = JSON.parse(fs.readFileSync(path.join(root, 'scripts/data/toeic-l2-extra-c.json'), 'utf8'));
const l2new = JSON.parse(fs.readFileSync(path.join(root, 'scripts/data/toeic-l2-new-themes.json'), 'utf8'));
const l2Extra = { ...l2a, ...l2b, ...l2c };

/* —— L1 —— */
const l1 = win.WA_TOEIC_VOCAB;
const l1Scenes = l1.scenarios.map((s) => {
  const extras = l1Extra[s.id] || [];
  const words = uniqAppend(s.words, extras, 1, 'basic');
  return {
    id: s.id,
    name: s.name || (L1_META[s.id] && L1_META[s.id].name) || s.id,
    nameEn: s.nameEn || (L1_META[s.id] && L1_META[s.id].nameEn) || '',
    tip: s.tip || (L1_META[s.id] && L1_META[s.id].tip) || '',
    level: 1,
    tag: 'basic',
    words,
  };
});

const l1Lines = [
  '/* TOEIC vocab Level 1 — basic high-frequency (550–750), weighted ~1680 */',
  'window.WA_TOEIC_VOCAB = {',
  '  level: 1,',
  "  tag: 'basic',",
  "  label: 'Level 1｜基礎高頻字（550–750）',",
  '  scenarios: [',
];
l1Scenes.forEach((s, si) => {
  l1Lines.push('    {');
  l1Lines.push(`      id: '${esc(s.id)}',`);
  l1Lines.push(`      name: '${esc(s.name)}',`);
  l1Lines.push(`      nameEn: '${esc(s.nameEn)}',`);
  l1Lines.push(`      tip: '${esc(s.tip)}',`);
  l1Lines.push('      level: 1,');
  l1Lines.push("      tag: 'basic',");
  l1Lines.push('      words: [');
  s.words.forEach((w, wi) => {
    l1Lines.push('      ' + fmtWord(w, false) + (wi < s.words.length - 1 ? ',' : ''));
  });
  l1Lines.push('      ]');
  l1Lines.push('    }' + (si < l1Scenes.length - 1 ? ',' : ''));
});
l1Lines.push('  ]');
l1Lines.push('};');
l1Lines.push('');
fs.writeFileSync(path.join(root, 'assets/js/toeic-vocab-data.js'), l1Lines.join('\n'), 'utf8');

/* —— L2 —— */
const l2 = win2.WA_TOEIC_VOCAB_L2;
const l2Scenes = l2.scenarios.map((s) => {
  const extras = l2Extra[s.id] || [];
  return {
    ...s,
    level: 2,
    tag: 'advanced',
    words: uniqAppend(s.words, extras, 2, 'advanced'),
  };
});

for (const meta of L2_NEW) {
  const rows = l2new[meta.id] || [];
  l2Scenes.push({
    id: meta.id,
    name: meta.name,
    nameEn: meta.nameEn,
    tip: meta.tip,
    level: 2,
    tag: 'advanced',
    words: uniqAppend([], rows, 2, 'advanced'),
  });
}

const l2Lines = [
  '/* TOEIC vocab Level 2 — gold certificate (860+), weighted ~5500 incl. banking/hospitality */',
  'window.WA_TOEIC_VOCAB_L2 = {',
  '  level: 2,',
  "  tag: 'advanced',",
  "  label: 'Level 2｜金色證書特攻（860+）',",
  '  scenarios: [',
];
l2Scenes.forEach((s, si) => {
  l2Lines.push('    {');
  l2Lines.push(`      id: '${esc(s.id)}',`);
  l2Lines.push(`      name: '${esc(s.name)}',`);
  l2Lines.push(`      nameEn: '${esc(s.nameEn)}',`);
  l2Lines.push(`      tip: '${esc(s.tip)}',`);
  l2Lines.push('      level: 2,');
  l2Lines.push("      tag: 'advanced',");
  l2Lines.push('      words: [');
  s.words.forEach((w, wi) => {
    l2Lines.push('      ' + fmtWord(w, true) + (wi < s.words.length - 1 ? ',' : ''));
  });
  l2Lines.push('      ]');
  l2Lines.push('    }' + (si < l2Scenes.length - 1 ? ',' : ''));
});
l2Lines.push('  ]');
l2Lines.push('};');
l2Lines.push('');
fs.writeFileSync(path.join(root, 'assets/js/toeic-vocab-l2-data.js'), l2Lines.join('\n'), 'utf8');

function summarize(scenes, label) {
  const parts = scenes.map((s) => `${s.id}:${s.words.length}`);
  const total = scenes.reduce((n, s) => n + s.words.length, 0);
  console.log(label, parts.join(' | '));
  console.log(label + ' TOTAL', total, 'themes', scenes.length);
  return total;
}

const t1 = summarize(l1Scenes, 'L1');
const t2 = summarize(l2Scenes, 'L2');
console.log('GRAND TOTAL', t1 + t2);
