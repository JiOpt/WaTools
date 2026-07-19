/* Merge TOEFL L1 extras + L2 parts into vocab data files */
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
      ex: `Researchers ${w} the data carefully.`,
      exZh: `研究人員仔細${zh}資料。`,
    };
  }
  if (p.startsWith('adj')) {
    return {
      ex: `This is a ${w} concept in the lecture.`,
      exZh: `這是課堂中的${zh}概念。`,
    };
  }
  if (p.startsWith('adv')) {
    return {
      ex: `The results were ${w} consistent.`,
      exZh: `結果${zh}一致。`,
    };
  }
  return {
    ex: `The lecture explains this ${w} in detail.`,
    exZh: `講座詳細說明此${zh}。`,
  };
}

function rowToWord(row, level, tag) {
  const [w, pos, zh, syn] = row;
  const { ex, exZh } = makeEx(w, pos, zh);
  const o = { w, pos, zh, syn, ex, exZh };
  if (level === 2) {
    o.level = 2;
    o.tag = tag || 'advanced';
  } else {
    o.level = 1;
    o.tag = tag || 'basic';
  }
  return o;
}

function fmtWord(o, withMeta) {
  let s = `{ w: '${esc(o.w)}', pos: '${esc(o.pos)}', zh: '${esc(o.zh)}', syn: '${esc(o.syn)}', ex: '${esc(o.ex)}', exZh: '${esc(o.exZh)}'`;
  if (withMeta) s += `, level: ${o.level || 1}, tag: '${esc(o.tag || 'basic')}'`;
  return s + ' }';
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

const L2_META = {
  awl: {
    name: 'AWL 學術核心字',
    nameEn: 'Academic Word List',
    tip: 'AWL 高頻字貫穿閱讀改述與聽力演講；滿分必備。',
  },
  research: {
    name: '研究設計與方法論',
    nameEn: 'Research Methods',
    tip: '假設、變項、信效度常見於社科與自然科學演講。',
  },
  'biology-adv': {
    name: '生物與生態進階',
    nameEn: 'Biology Advanced',
    tip: '細胞、遺傳與生態系進階用語常見於閱讀長文。',
  },
  'astronomy-adv': {
    name: '天文與物理進階',
    nameEn: 'Astronomy & Physics Advanced',
    tip: '宇宙、能量與物質概念常出現在自然科學講座。',
  },
  'history-adv': {
    name: '歷史與考古進階',
    nameEn: 'History & Archaeology Advanced',
    tip: '年代、文物與史料批判常見於人文閱讀。',
  },
  'psychology-adv': {
    name: '心理與社會進階',
    nameEn: 'Psychology & Sociology Advanced',
    tip: '認知、行為與社會影響常見於社科演講。',
  },
  'earth-adv': {
    name: '地球與環境進階',
    nameEn: 'Earth & Environment Advanced',
    tip: '板塊、氣候與環境變遷是常考自然科學主題。',
  },
  'chemistry-adv': {
    name: '化學與材料進階',
    nameEn: 'Chemistry & Materials Advanced',
    tip: '反應、分子與材料性質常見於實驗描述。',
  },
  'medicine-adv': {
    name: '醫學與健康進階',
    nameEn: 'Medicine & Health Advanced',
    tip: '疾病、治療與公共衛生常見於生命科學篇章。',
  },
  'anthropology-adv': {
    name: '人類與文化進階',
    nameEn: 'Anthropology Advanced',
    tip: '文化、親屬與田野調查常見於社科閱讀。',
  },
  'economics-adv': {
    name: '經濟與商學進階',
    nameEn: 'Economics Advanced',
    tip: '供需、市場與政策分析常見於社科講座。',
  },
  'technology-adv': {
    name: '科技與工程進階',
    nameEn: 'Technology & Engineering Advanced',
    tip: '創新、系統與工程應用常見於科技類文章。',
  },
  'literature-adv': {
    name: '文學與藝術進階',
    nameEn: 'Literature & Arts Advanced',
    tip: '文類、修辭與藝術運動常見於人文篇章。',
  },
  'politics-adv': {
    name: '政治與政府進階',
    nameEn: 'Politics & Government Advanced',
    tip: '制度、權利與公共政策常見於社科閱讀。',
  },
  philosophy: {
    name: '哲學與倫理',
    nameEn: 'Philosophy & Ethics',
    tip: '認識論、倫理理論偶發於人文演講與閱讀。',
  },
  linguistics: {
    name: '語言學',
    nameEn: 'Linguistics',
    tip: '語音、構詞與語用常見於語言相關講座。',
  },
};

const win = loadWindowJs('assets/js/toefl-vocab-data.js');
const l1Extra = JSON.parse(fs.readFileSync(path.join(root, 'scripts/data/toefl-l1-extra.json'), 'utf8'));
const l2a = JSON.parse(fs.readFileSync(path.join(root, 'scripts/data/toefl-l2-part-a.json'), 'utf8'));
const l2b = JSON.parse(fs.readFileSync(path.join(root, 'scripts/data/toefl-l2-part-b.json'), 'utf8'));
const l2c = JSON.parse(fs.readFileSync(path.join(root, 'scripts/data/toefl-l2-part-c.json'), 'utf8'));
const l2All = { ...l2a, ...l2b, ...l2c };

const l1 = win.WA_TOEFL_VOCAB;
const l1Scenes = l1.scenarios.map((s) => ({
  id: s.id,
  name: s.name,
  nameEn: s.nameEn,
  tip: s.tip,
  level: 1,
  tag: 'basic',
  words: uniqAppend(
    (s.words || []).map((w) => ({ ...w, level: 1, tag: 'basic' })),
    l1Extra[s.id] || [],
    1,
    'basic'
  ),
}));

const l1Lines = [
  '/* TOEFL vocab Level 1 — academic foundation (~80–100), weighted ~3500 */',
  'window.WA_TOEFL_VOCAB = {',
  '  level: 1,',
  "  tag: 'basic',",
  "  label: 'Level 1｜學術基礎高頻（約 80–100）',",
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
    l1Lines.push('      ' + fmtWord(w, true) + (wi < s.words.length - 1 ? ',' : ''));
  });
  l1Lines.push('      ]');
  l1Lines.push('    }' + (si < l1Scenes.length - 1 ? ',' : ''));
});
l1Lines.push('  ]');
l1Lines.push('};');
l1Lines.push('');
fs.writeFileSync(path.join(root, 'assets/js/toefl-vocab-data.js'), l1Lines.join('\n'), 'utf8');

const l2Order = Object.keys(L2_META);
const l2Scenes = l2Order.map((id) => {
  const meta = L2_META[id];
  const rows = l2All[id] || [];
  return {
    id,
    name: meta.name,
    nameEn: meta.nameEn,
    tip: meta.tip,
    level: 2,
    tag: 'advanced',
    words: uniqAppend([], rows, 2, 'advanced'),
  };
});

const l2Lines = [
  '/* TOEFL vocab Level 2 — AWL + advanced subjects (~110–120), ~6320 */',
  'window.WA_TOEFL_VOCAB_L2 = {',
  '  level: 2,',
  "  tag: 'advanced',",
  "  label: 'Level 2｜AWL＋學科進階（衝 110–120）',",
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
fs.writeFileSync(path.join(root, 'assets/js/toefl-vocab-l2-data.js'), l2Lines.join('\n'), 'utf8');

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
