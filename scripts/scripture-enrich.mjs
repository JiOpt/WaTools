/**
 * Fill empty 【註釋】無 / 【譯文】無 / 【解讀】無 with conservative, objective content.
 */

const VERSE_BLOCK_RE =
  /<p class="scripture-verse">([\s\S]*?)<\/p>\s*(?:<div class="scripture-annotation">([\s\S]*?)<\/div>\s*)?(?:<div class="scripture-translation">([\s\S]*?)<\/div>\s*)?(?:<div class="scripture-exegesis">([\s\S]*?)<\/div>\s*)?/g;

const EMPTY = {
  annotation: /^【註釋】\s*無\s*$/u,
  translation: /^【譯文】\s*無\s*$/u,
  exegesis: /^【解讀】\s*無\s*$/u,
};

const TERM_GLOSSARY = [
  ['先行其言', '先實踐後言說，即「敏於事而慎於言」之意。'],
  ['周而不比', '「周」指普遍、博愛；「比」指偏私、黨同。'],
  ['比而不周', '「比」指偏私結黨；「周」指普遍團結。'],
  ['學而時習', '「時習」指按時溫習、反覆研習。'],
  ['溫故知新', '溫習舊學而有所得，可推知新義。'],
  ['三省吾身', '「三省」指反覆省察自身言行。'],
  ['慎終追遠', '「慎終」指喪葬之禮謹慎；「追遠」指追念祖先。'],
  ['文質彬彬', '「文」指文采、禮文；「質」指質樸、本質。'],
  ['知之為知之', '「知」通「智」，指真實明辨。'],
  ['知之為知之', '「知」通「智」，指真實明辨。'],
  ['朝聞道', '「道」指儒家所重之真理、仁義之道。'],
  ['德不孤', '「德」指仁德；有德者自能感召同道。'],
  ['父母之年', '記念父母年齡，含喜壽與憂老雙情。'],
  ['君子不器', '「器」指專一用途之器皿，喻人不宜限於一技。'],
  ['敏而好學', '「敏」指勤勉；「好學」指勤於求學。'],
  ['不恥下問', '不以向地位或學識不如己者請教為恥。'],
  ['不恥下問', '不以向學識或地位不如己者請教為恥。'],
  ['過則勿憚改', '「憚」指顧忌；有過錯應勇於改正。'],
  ['過，則勿憚改', '「憚」指顧忌；有過錯應勇於改正。'],
  ['主忠信', '以忠誠、信實為立身之本。'],
  ['毋友不如己者', '不與不如己者為友，意在勸人交益者。'],
  ['三軍可奪師', '「三軍」指軍隊；「奪師」指更換統帥。'],
  ['匹夫不可奪志', '「匹夫」指平民；志節不可強奪。'],
  ['知之者', '「知」通「智」，指知道、瞭解。'],
  ['好之者', '「好」指喜好、愛好。'],
  ['樂之者', '「樂」指以之為樂，樂在其中。'],
  ['質勝文', '「質」指質樸；「文」指文采、禮文。'],
  ['文勝質', '「文」指文采；「質」指質樸。'],
  ['巧言令色', '「令色」指討好的面色；花言巧語。'],
  ['鮮矣仁', '「鮮」指少；缺乏仁德。'],
  ['三年無改', '「三年」泛指多年；不改父道，指繼承父志。'],
  ['父之道', '指父親所行之道、所立之志。'],
  ['性與天道', '「性」指人性；「天道」指天命、天理。'],
  ['未之能行', '尚未能實行所聞之道。'],
  ['唯恐有聞', '恐再添新知而未行舊聞。'],
  ['發憤忘食', '發奮忘記飲食，形容專志。'],
  ['樂以忘憂', '以道得樂而忘憂患。'],
  ['四教', '指文、行、忠、信四項教導。'],
  ['溫良恭儉讓', '儒家所重之待人接物五德。'],
  ['君子儒', '指以修德為本之儒者。'],
  ['小人儒', '指重技藝、輕德行之儒者。'],
  ['道千乘之國', '「千乘」指大國；治理國家。'],
  ['入則孝', '在家孝順父母。'],
  ['出則弟', '「弟」同「悌」，在外敬愛兄長。'],
  ['慎終', '喪葬之禮謹慎。'],
  ['追遠', '追念祖先。'],
  ['攻乎異端', '專研異端邪說。'],
  ['學而不思', '「罔」指迷惑。'],
  ['思而不學', '「殆」指危殆、空疏。'],
  ['見賢思齊', '見賢人則思與之齊。'],
  ['見不賢而內自省', '見不賢者則反省自身。'],
  ['父母在', '父母在世。'],
  ['不遠遊', '不遠行，以免不能侍奉。'],
  ['遊必有方', '出遊必告知去處。'],
  ['視其所以', '觀察其所為及所由。'],
  ['觀其所由', '觀察其行事之由。'],
  ['察其所安', '觀察其安於何者。'],
  ['君子喻義', '「喻」指明白；君子明於義。'],
  ['小人喻利', '小人明於利。'],
  ['放於利而行', '依利而行。'],
  ['多聞闕疑', '多聞而保留疑義。'],
  ['慎言其餘', '謹慎言說其餘。'],
  ['敬事而信', '「敬事」指敬慎政事；「信」指信實。'],
  ['節用而愛人', '節約財用，愛民如子。'],
  ['使民以時', '役使百姓不誤農時。'],
  ['弟子', '指年輕學者或門人。'],
  ['夫子', '對老師、孔子之尊稱。'],
  ['有子曰', '「有子」指孔子弟子有若。'],
  ['曾子曰', '「曾子」指孔子弟子曾參。'],
  ['子貢', '孔子弟子端木賜，字子貢。'],
  ['子路', '孔子弟子仲由，字子路。'],
  ['顏淵', '孔子弟子顏回，字子淵。'],
  ['顏回', '孔子弟子，以德行著稱。'],
  ['子夏', '孔子弟子卜商，字子夏。'],
  ['子張', '孔子弟子顓孫師，字子張。'],
  ['子游', '孔子弟子言偃，字子游。'],
  ['冉雍', '孔子弟子，字仲弓。'],
  ['仲弓', '即冉雍，孔子弟子。'],
  ['孔文子', '衛國大夫孔圉，諡「文」。'],
  ['葉公', '楚國葉縣令尹，名沈諸梁。'],
  ['君子', '德行高尚、依禮自守者。'],
  ['小人', '與君子相對，多指重利輕義者。'],
  ['仁', '儒家核心德行，含愛人、克己復禮等義。'],
  ['孝', '事親之孝道。'],
  ['弟', '同「悌」，敬愛兄長。'],
  ['悌', '敬愛兄長，與孝並稱。'],
  ['禮', '典章制度與行為規範。'],
  ['義', '宜也，合宜、正當。'],
  ['義', '宜也，合宜、正當。'],
  ['信', '誠實不欺。'],
  ['忠', '盡心竭力。'],
  ['德', '道德、德行。'],
  ['政', '政事、為政。'],
  ['賢', '才德出眾者。'],
  ['聖', '指聖人，最高理想人格。'],
  ['器', '器皿，喻專才。'],
  ['罔', '迷惑。'],
  ['殆', '危殆、空疏。'],
  ['周', '普遍、博愛。'],
  ['比', '偏私、黨同。'],
  ['恕', '推己及人，「己所不欲，勿施於人」。'],
  ['諂', '討好、阿諛。'],
  ['簡', '簡約、不煩瑣。'],
  ['敬', '恭敬、嚴肅。'],
  ['讓', '謙讓。'],
  ['溫', '和顏。'],
  ['良', '善良。'],
  ['恭', '恭敬。'],
  ['儉', '節儉。'],
];

const THEME_HINTS = [
  [/孝|悌|弟|父母|父在|父沒/, '孝悌'],
  [/君子|小人/, '君子小人之辨'],
  [/仁|義|義|德/, '修德立仁'],
  [/學|習|知|思|問/, '為學求知'],
  [/政|國|民|君|臣|禮/, '為政守禮'],
  [/信|忠|恕/, '忠信恕道'],
  [/樂|詩|文|藝/, '文藝修養'],
];

function stripTags(str) {
  return String(str)
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&#8211;|&#8217;|&mdash;|&ndash;/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeVerseKey(text) {
  return stripTags(text)
    .replace(/^【[^】]+】\s*/u, '')
    .replace(/[（(]\d+\.\d+[）)]/g, '')
    .replace(/[\(（]\d+[）\)]/g, '')
    .replace(/[\u201c\u201d\u2018\u2019「」『』""'']/g, '')
    .replace(/[ \s·．。，、；：？！！]/g, '')
    .replace(/毋/g, '無')
    .trim();
}

function extractCoreQuote(text) {
  const plain = stripTags(text).replace(/^【[^】]+】\s*/u, '');
  const m = plain.match(/[「『"\u201c]([^」』"\u201d]+)[」』"\u201d]/u);
  const quoted = m ? m[1] : plain.replace(/^.*子曰[：:]\s*/u, '');
  return normalizeVerseKey(quoted);
}

function isEmpty(field, type) {
  if (!field) return true;
  const plain = stripTags(field).replace(/\s+/g, '');
  if (type === 'translation' && plain === '【譯文】') return true;
  return EMPTY[type].test(stripTags(field));
}

function extractFieldContent(field, prefix) {
  const plain = stripTags(field).replace(new RegExp(`^${prefix}\\s*`), '').trim();
  return plain;
}

function findMatchingEntry(key, coreKey, index) {
  const candidates = [key, coreKey].filter(Boolean);
  const pickBest = (entries) =>
    entries
      .filter((entry) => entry?.translation || entry?.exegesis)
      .sort((a, b) => (b.translation?.length || 0) - (a.translation?.length || 0))[0] || null;

  const exactMatches = candidates.filter((candidate) => index.has(candidate)).map((candidate) => index.get(candidate));
  const bestExact = pickBest(exactMatches);
  if (bestExact?.translation) return bestExact;

  const fuzzyMatches = [];
  for (const candidate of candidates) {
    for (const [storedKey, entry] of index) {
      if (!entry.translation && !entry.exegesis) continue;
      if (storedKey.includes(candidate) || candidate.includes(storedKey)) {
        if (Math.min(storedKey.length, candidate.length) >= 8) fuzzyMatches.push(entry);
      }
    }
  }
  return pickBest(fuzzyMatches);
}

function buildVerseIndex(blocks) {
  const index = new Map();

  const store = (mapKey, entry) => {
    if (!mapKey) return;
    const prev = index.get(mapKey);
    if (!prev || entry.translation.length > (prev.translation?.length || 0)) {
      index.set(mapKey, entry);
    }
  };

  for (const block of blocks) {
    const key = normalizeVerseKey(block.verse);
    const coreKey = extractCoreQuote(block.verse);
    const entry = {
      annotation: isEmpty(block.annotation, 'annotation')
        ? ''
        : extractFieldContent(block.annotation, '【註釋】'),
      translation: isEmpty(block.translation, 'translation')
        ? ''
        : extractFieldContent(block.translation, '【譯文】'),
      exegesis: isEmpty(block.exegesis, 'exegesis')
        ? ''
        : extractFieldContent(block.exegesis, '【解讀】'),
    };
    if (!entry.translation && !entry.exegesis) continue;
    store(key, entry);
    store(coreKey, entry);
  }
  return index;
}

function generateAnnotation(versePlain, translationPlain) {
  const notes = [];
  let idx = 1;
  const used = new Set();

  for (const [term, note] of TERM_GLOSSARY) {
    if (!versePlain.includes(term) || used.has(term)) continue;
    used.add(term);
    notes.push(`(${idx})${term}：${note}`);
    idx += 1;
    if (notes.length >= 5) break;
  }

  if (notes.length === 0 && translationPlain) {
    const short = translationPlain.slice(0, 40);
    return `【註釋】本章字義較明（大意：${short}${translationPlain.length > 40 ? '…' : ''}），宜參照【譯文】及前後章句，並可對照通行注本以明其義。`;
  }

  if (notes.length === 0) {
    return '【註釋】本章字義較明，宜參照【譯文】及前後章句，並可對照通行注本（如朱熹《論語集註》）以明其義。';
  }

  return `【註釋】${notes.join('')}`;
}

function detectThemes(versePlain, translationPlain) {
  const text = `${versePlain} ${translationPlain}`;
  return THEME_HINTS.filter(([re]) => re.test(text)).map(([, theme]) => theme);
}

function summarizeTranslation(text) {
  const cleaned = text.replace(/^【譯文】\s*/, '').trim();
  if (cleaned.length <= 72) return cleaned.replace(/[。.…]+$/u, '');
  const slice = cleaned.slice(0, 70);
  const punct = Math.max(slice.lastIndexOf('。'), slice.lastIndexOf('，'), slice.lastIndexOf('；'));
  if (punct > 24) return cleaned.slice(0, punct);
  return `${slice}…`.replace(/[。.…]+$/u, '');
}

function summarizeExegesis(text) {
  const cleaned = text.replace(/^【解讀】\s*/, '').trim();
  const first = cleaned.split(/\n|<br\s*\/?>/i)[0].trim();
  if (first.length <= 120) return first;
  return `${first.slice(0, 118)}…`;
}

function generateExegesis(versePlain, translationPlain, annotationPlain) {
  if (/見於|重出|此處略|系重出/.test(annotationPlain)) {
    return '【解讀】本章與他篇重出，義理相同，宜對讀前文所載【譯文】【解讀】，通篇體會，不宜離章過度引申。';
  }

  const trans = translationPlain.trim();
  const themes = detectThemes(versePlain, trans);
  let body = '';

  if (/^孔子說|^孔子說|^子曰|^孔子/.test(trans) || versePlain.includes('子曰')) {
    const gist = summarizeTranslation(trans.replace(/^.*?[：:]\s*/u, ''));
    body = `本章記孔子之言，大意為${gist}`;
  } else if (/^(子貢|子路|曾子|有子|子夏|子張|子游|子遊|顏淵|冉雍|仲弓|子貢|葉公)/.test(trans)) {
    body = `本章記弟子言行或師弟問答，${summarizeTranslation(trans)}`;
  } else {
    body = summarizeTranslation(trans);
  }

  if (themes.length) {
    body += `。歷代注家多從「${themes.join('」「')}」等義理闡述，宜就字義與上下文通篇體會，謹守經文本旨。`;
  } else {
    body += '。歷代注家多就字義與語境闡發，宜就字義與上下文通篇體會，謹守經文本旨。';
  }

  return `【解讀】${body}`;
}

function generateTranslationFromIndex(entry, annotationPlain) {
  if (!entry?.translation) return '';
  if (/見於|重出|此處略/.test(annotationPlain)) {
    return `【譯文】（重出）${entry.translation}`;
  }
  return `【譯文】${entry.translation}`;
}

function enrichBlock(block, index) {
  const versePlain = stripTags(block.verse);
  const key = normalizeVerseKey(block.verse);
  const coreKey = extractCoreQuote(block.verse);
  const matched = findMatchingEntry(key, coreKey, index);
  const isCrossRef = /見於|重出|此處略|系重出/.test(
    isEmpty(block.annotation, 'annotation') ? '' : extractFieldContent(block.annotation, '【註釋】')
  );

  let annotationPlain = isEmpty(block.annotation, 'annotation')
    ? ''
    : extractFieldContent(block.annotation, '【註釋】');
  let translationPlain = isEmpty(block.translation, 'translation')
    ? ''
    : extractFieldContent(block.translation, '【譯文】');
  let exegesisPlain = isEmpty(block.exegesis, 'exegesis')
    ? ''
    : extractFieldContent(block.exegesis, '【解讀】');

  let annotation = block.annotation || '<div class="scripture-annotation">【註釋】無</div>';
  let translation = block.translation || '<div class="scripture-translation">【譯文】無</div>';
  let exegesis = block.exegesis || '<div class="scripture-exegesis">【解讀】無</div>';

  if (isEmpty(block.translation, 'translation') && matched?.translation) {
    translation = `<div class="scripture-translation">${generateTranslationFromIndex(matched, annotationPlain)}</div>`;
    translationPlain = extractFieldContent(translation, '【譯文】');
  }

  if (isEmpty(block.exegesis, 'exegesis')) {
    if (matched?.exegesis) {
      if (isCrossRef) {
        exegesis = `<div class="scripture-exegesis">【解讀】本章與他篇重出，義理相同。${summarizeExegesis(matched.exegesis)}</div>`;
      } else {
        exegesis = `<div class="scripture-exegesis">【解讀】${matched.exegesis}</div>`;
      }
    } else if (translationPlain) {
      exegesis = `<div class="scripture-exegesis">${generateExegesis(versePlain, translationPlain, annotationPlain)}</div>`;
    }
  }

  if (isEmpty(block.annotation, 'annotation')) {
    annotation = `<div class="scripture-annotation">${generateAnnotation(versePlain, translationPlain)}</div>`;
  }

  return { ...block, annotation, translation, exegesis };
}

function cleanGeneratedAnnotations(html) {
  const noise = [
    /\(\d+\)子曰：「子」指孔子。/g,
    /\(\d+\)知：同「智」，明辨。/g,
    /\(\d+\)學：學習、求學。/g,
    /\(\d+\)思：思考、省察。/g,
    /\(\d+\)道：指道理、仁義之道。/g,
  ];

  return html.replace(
    /<div class="scripture-annotation">([\s\S]*?)<\/div>/g,
    (full, inner) => {
      if (!/^【註釋】/.test(stripTags(inner))) return full;
      let notes = stripTags(inner).replace(/^【註釋】\s*/, '');
      for (const pattern of noise) {
        notes = notes.replace(pattern, '');
      }
      let idx = 1;
      notes = notes.replace(/\(\d+\)/g, () => `(${idx++})`);
      notes = notes.trim();
      if (!notes) {
        notes = '本章字義較明，宜參照【譯文】及前後章句，並可對照通行注本以明其義。';
      }
      return `<div class="scripture-annotation">【註釋】${notes}</div>`;
    }
  );
}

function parseBlocks(html) {
  const blocks = [];
  let lastIndex = 0;
  let match;

  VERSE_BLOCK_RE.lastIndex = 0;
  while ((match = VERSE_BLOCK_RE.exec(html)) !== null) {
    blocks.push({
      start: match.index,
      end: VERSE_BLOCK_RE.lastIndex,
      before: html.slice(lastIndex, match.index),
      verse: match[1],
      annotation: match[2] ? `<div class="scripture-annotation">${match[2]}</div>` : '',
      translation: match[3] ? `<div class="scripture-translation">${match[3]}</div>` : '',
      exegesis: match[4] ? `<div class="scripture-exegesis">${match[4]}</div>` : '',
    });
    lastIndex = VERSE_BLOCK_RE.lastIndex;
  }

  return { blocks, tail: html.slice(lastIndex) };
}

function serializeBlocks(blocks, tail) {
  return blocks.map((b) => `${b.before}<p class="scripture-verse">${b.verse}</p>\n${b.annotation}\n${b.translation}\n${b.exegesis}\n`).join('') + tail;
}

export function enrichScriptureContent(html, slug = '') {
  if (slug && slug !== 'lunyu') return html;

  const { blocks, tail } = parseBlocks(html);
  if (!blocks.length) return html;

  const index = buildVerseIndex(blocks);
  const enriched = blocks.map((block) => enrichBlock(block, index));

  return cleanGeneratedAnnotations(serializeBlocks(enriched, tail));
}
