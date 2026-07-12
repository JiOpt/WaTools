(function () {
  'use strict';
  const UI = window.WA_TOOL_UI;
  if (!UI) return;
  const R = window.WA_TOOL_REGISTRY = window.WA_TOOL_REGISTRY || {};

  function mount(app, nodes) {
    app.className = 'tool-app tool-form';
    app.replaceChildren(UI.el('div', { className: 'tool-form-inner' }, nodes));
  }

  const DICT = [
    { char: '愛', pinyin: 'ài', meaning: 'love' }, { char: '人', pinyin: 'rén', meaning: 'person' },
    { char: '大', pinyin: 'dà', meaning: 'big' }, { char: '小', pinyin: 'xiǎo', meaning: 'small' },
    { char: '中', pinyin: 'zhōng', meaning: 'middle' }, { char: '國', pinyin: 'guó', meaning: 'country' },
    { char: '水', pinyin: 'shuǐ', meaning: 'water' }, { char: '火', pinyin: 'huǒ', meaning: 'fire' },
    { char: '木', pinyin: 'mù', meaning: 'wood' }, { char: '金', pinyin: 'jīn', meaning: 'gold' },
    { char: '土', pinyin: 'tǔ', meaning: 'earth' }, { char: '日', pinyin: 'rì', meaning: 'sun' },
    { char: '月', pinyin: 'yuè', meaning: 'moon' }, { char: '山', pinyin: 'shān', meaning: 'mountain' },
    { char: '川', pinyin: 'chuān', meaning: 'river' }, { char: '天', pinyin: 'tiān', meaning: 'sky' },
    { char: '地', pinyin: 'dì', meaning: 'earth' }, { char: '心', pinyin: 'xīn', meaning: 'heart' },
    { char: '手', pinyin: 'shǒu', meaning: 'hand' }, { char: '口', pinyin: 'kǒu', meaning: 'mouth' },
    { char: '眼', pinyin: 'yǎn', meaning: 'eye' }, { char: '耳', pinyin: 'ěr', meaning: 'ear' },
    { char: '足', pinyin: 'zú', meaning: 'foot' }, { char: '文', pinyin: 'wén', meaning: 'culture' },
    { char: '字', pinyin: 'zì', meaning: 'character' }, { char: '學', pinyin: 'xué', meaning: 'study' },
    { char: '生', pinyin: 'shēng', meaning: 'life' }, { char: '好', pinyin: 'hǎo', meaning: 'good' },
    { char: '美', pinyin: 'měi', meaning: 'beautiful' }, { char: '家', pinyin: 'jiā', meaning: 'home' },
  ];

  const CANGJIE = [
    { char: '人', code: 'o' }, { char: '大', code: 'k' }, { char: '小', code: 'ni' }, { char: '中', code: 'l' },
    { char: '口', code: 'r' }, { char: '日', code: 'a' }, { char: '月', code: 'b' }, { char: '木', code: 'd' },
    { char: '水', code: 'e' }, { char: '火', code: 'f' }, { char: '土', code: 'g' }, { char: '手', code: 'q' },
    { char: '心', code: 'p' }, { char: '目', code: 'bu' }, { char: '山', code: 'u' }, { char: '女', code: 'v' },
    { char: '子', code: 'nd' }, { char: '王', code: 'm' }, { char: '石', code: 'mr' }, { char: '金', code: 'c' },
  ];

  const ZH_PAIRS = '臺臺,愛愛,國國,學學,體體,會會,來來,對對,時時,間間,長長,開開,關關,電電,車車,東東,門門,問問,聽聽,見見,說說,讀讀,寫寫,語語,話話,這這,還還,進進,過過,發發,經經,現現,實實,業業,產產,價價,買買,賣賣,點點,無無,為為,與與,從從,後後,裡裡,當當,將將,應應,變變,動動,場場,報報,導導,環環,歷歷,歲歲,難難,輕輕,歡歡,樂樂,愛愛,親親,廣廣,廠廠,藥藥,醫醫,護護,軍軍,戰戰,勝勝,負負,責責,權權,義義,議議,選選,舉舉,黨黨,團團,組組,織織,網網,線線,號號,碼碼,錢錢,銀銀,鐵鐵,銅銅,飛飛,機機,廣廣,視視,聯聯,繫系,總總,類類,種種,質質,標標,準準,計計,認認,識識,記記,設設,計計,試試,驗驗,證證,據據,擴擴,縮縮,壓壓,溫溫,濕溼,氣氣,風風,雲雲,電電,聲聲,顏顏,圖圖,畫畫,書書,紙紙,筆筆,墨墨,畫畫,藝藝,術術,創創,造造,建建,築築,設設,計計,裝裝,修修,護護,養養,護護,衛衛,員員,師師,長長,員員,隊隊,組組,織織,網網,線線,號號,碼碼,錢錢,銀銀,鐵鐵,銅銅,飛飛,機機,廣廣,視視,聯聯,繫系,總總,類類,種種,質質,標標,準準,計計,認認,識識,記記,設設,計計,試試,驗驗,證證,據據,擴擴,縮縮,壓壓,溫溫,濕溼,氣氣,風風,雲雲,電電,聲聲,顏顏,圖圖,畫畫,書書,紙紙,筆筆,墨墨,畫畫,藝藝,術術,創創,造造,建建,築築,設設,計計,裝裝,修修,護護,養養,護護,衛衛,員員,師師,長長,員員,隊隊,組組,織織,網網,線線,號號,碼碼,錢錢,銀銀,鐵鐵,銅銅,飛飛,機機,廣廣,視視,聯聯,繫系,總總,類類,種種,質質,標標,準準,計計,認認,識識,記記,設設,計計,試試,驗驗,證證,據據,擴擴,縮縮,壓壓,溫溫,濕溼,氣氣,風風,雲雲,電電,聲聲,顏顏,圖圖,畫畫,書書,紙紙,筆筆,墨墨,畫畫,藝藝,術術,創創,造造,建建,築築,設設,計計,裝裝,修修,護護,養養,護護,衛衛,員員,師師,長長,員員,隊隊'.split(',').map((p) => [p[0], p[1]]);
  const TRAD_TO_SIMP = Object.fromEntries(ZH_PAIRS);
  const SIMP_TO_TRAD = Object.fromEntries(ZH_PAIRS.map(([t, s]) => [s, t]));

  const PINYIN_MAP = Object.fromEntries(DICT.map((d) => [d.char, d.pinyin]));
  const PINYIN_TO_ZH = {};
  DICT.forEach((d) => {
    const key = d.pinyin.replace(/[1-4]/g, '').toLowerCase();
    if (!PINYIN_TO_ZH[key]) PINYIN_TO_ZH[key] = [];
    PINYIN_TO_ZH[key].push(d.char);
  });

  const PINYIN_INITIALS = ['b', 'p', 'm', 'f', 'd', 't', 'n', 'l', 'g', 'k', 'h', 'j', 'q', 'x', 'zh', 'ch', 'sh', 'r', 'z', 'c', 's', 'y', 'w'];
  const PINYIN_FINALS = ['a', 'o', 'e', 'i', 'u', 'ü', 'ai', 'ei', 'ao', 'ou', 'an', 'en', 'ang', 'eng', 'ong', 'ia', 'ie', 'iao', 'iu', 'ian', 'in', 'iang', 'ing', 'iong', 'ua', 'uo', 'uai', 'ui', 'uan', 'un', 'uang', 'ueng', 'üe', 'üan', 'ün'];

  const CANGJIE_RADICALS = [
    { key: 'A', name: '日', shape: '日' }, { key: 'B', name: '月', shape: '月' }, { key: 'C', name: '金', shape: '金' },
    { key: 'D', name: '木', shape: '木' }, { key: 'E', name: '水', shape: '水' }, { key: 'F', name: '火', shape: '火' },
    { key: 'G', name: '土', shape: '土' }, { key: 'H', name: '竹', shape: '竹' }, { key: 'I', name: '戈', shape: '戈' },
    { key: 'J', name: '十', shape: '十' }, { key: 'K', name: '大', shape: '大' }, { key: 'L', name: '中', shape: '中' },
    { key: 'M', name: '一', shape: '一' }, { key: 'N', name: '弓', shape: '弓' }, { key: 'O', name: '人', shape: '人' },
    { key: 'P', name: '心', shape: '心' }, { key: 'Q', name: '手', shape: '手' }, { key: 'R', name: '口', shape: '口' },
    { key: 'S', name: '屍', shape: '屍' }, { key: 'T', name: '廿', shape: '廿' }, { key: 'U', name: '山', shape: '山' },
    { key: 'V', name: '女', shape: '女' }, { key: 'W', name: '田', shape: '田' }, { key: 'Y', name: '卜', shape: '卜' },
  ];

  const BOPOMOFO = [
    { zhuyin: 'ㄅ', pinyin: 'b' }, { zhuyin: 'ㄆ', pinyin: 'p' }, { zhuyin: 'ㄇ', pinyin: 'm' }, { zhuyin: 'ㄈ', pinyin: 'f' },
    { zhuyin: 'ㄉ', pinyin: 'd' }, { zhuyin: 'ㄊ', pinyin: 't' }, { zhuyin: 'ㄋ', pinyin: 'n' }, { zhuyin: 'ㄌ', pinyin: 'l' },
    { zhuyin: 'ㄍ', pinyin: 'g' }, { zhuyin: 'ㄎ', pinyin: 'k' }, { zhuyin: 'ㄏ', pinyin: 'h' }, { zhuyin: 'ㄐ', pinyin: 'j' },
    { zhuyin: 'ㄑ', pinyin: 'q' }, { zhuyin: 'ㄒ', pinyin: 'x' }, { zhuyin: 'ㄓ', pinyin: 'zh' }, { zhuyin: 'ㄔ', pinyin: 'ch' },
    { zhuyin: 'ㄕ', pinyin: 'sh' }, { zhuyin: 'ㄖ', pinyin: 'r' }, { zhuyin: 'ㄗ', pinyin: 'z' }, { zhuyin: 'ㄘ', pinyin: 'c' },
    { zhuyin: 'ㄙ', pinyin: 's' }, { zhuyin: 'ㄚ', pinyin: 'a' }, { zhuyin: 'ㄛ', pinyin: 'o' }, { zhuyin: 'ㄜ', pinyin: 'e' },
    { zhuyin: 'ㄧ', pinyin: 'i' }, { zhuyin: 'ㄨ', pinyin: 'u' }, { zhuyin: 'ㄩ', pinyin: 'ü' },
  ];

  const BOPOMOFO_SYLLABLES = ['ㄅㄚ', 'ㄅㄛ', 'ㄅㄞ', 'ㄅㄟ', 'ㄅㄢ', 'ㄅㄣ', 'ㄅㄤ', 'ㄅㄥ', 'ㄆㄚ', 'ㄇㄚ', 'ㄈㄚ', 'ㄉㄚ', 'ㄊㄚ', 'ㄋㄚ', 'ㄌㄚ', 'ㄍㄚ', 'ㄎㄚ', 'ㄏㄚ', 'ㄐㄧ', 'ㄑㄧ', 'ㄒㄧ', 'ㄓㄚ', 'ㄔㄚ', 'ㄕㄚ', 'ㄖㄜ', 'ㄗㄚ', 'ㄘㄚ', 'ㄙㄚ'];

  const TYPING_WORDS = ['中文', '打字', '練習', '倉頡', '注音', '拼音', '五筆', '輸入', '速度', '準確', '鍵盤', '手指', '肌肉', '記憶', '測驗', '世界', '時間', '生活', '工具', '網頁'];

  function convertZh(text, map) {
    return [...text].map((c) => map[c] || c).join('');
  }

  function recoverGarbled(text) {
    const out = [];
    const bytes = new Uint8Array([...text].map((c) => c.charCodeAt(0) & 0xff));
    try { out.push(['Latin1→UTF-8', new TextDecoder('utf-8', { fatal: false }).decode(bytes)]); } catch (e) { /* skip */ }
    try {
      const enc = new TextEncoder();
      const utf8 = enc.encode(text);
      out.push(['UTF-8→Latin1 顯示', [...utf8].map((b) => String.fromCharCode(b)).join('')]);
    } catch (e) { /* skip */ }
    try { out.push(['Big5 嘗試', new TextDecoder('big5', { fatal: false }).decode(bytes)]); } catch (e) { /* skip */ }
    return out;
  }

  function lifePathNumber(dateStr) {
    const digits = dateStr.replace(/\D/g, '');
    if (!digits) return null;
    let sum = [...digits].reduce((a, b) => a + +b, 0);
    while (sum > 9 && sum !== 11 && sum !== 22) {
      sum = [...String(sum)].reduce((a, b) => a + +b, 0);
    }
    return sum;
  }

  function hashName(name) {
    let h = 0;
    for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
    return h;
  }


  // ===== CULTURE =====
  R['typing-teach'] = function (app) {
    const cards = [
      { t: '倉頡輸入法', d: '形碼輸入，依字形拆字。適合繁體中文。', link: '/cangjie-chart' },
      { t: '注音輸入法', d: '以 37 個注音符號拼讀，臺灣常用。', link: '/bopomofo-chart' },
      { t: '漢語拼音', d: '以拉丁字母標音，大陸與國際常用。', link: '/pinyin-chart' },
      { t: '五筆字型', d: '依字根鍵位輸入，重碼率低。', link: '/wubi' },
      { t: '嘸蝦米', d: '繁體形碼輸入法，拆碼直覺。', link: '/boshiamy' },
    ];
    mount(app, [
      UI.panel('中文輸入法入門', UI.el('p', { className: 'text-muted' }, '選一種開始，別貪多——精通一種比略懂五種實用。')),
      ...cards.map((c) => UI.panel(c.t, [
        UI.el('p', {}, c.d),
        UI.el('a', { href: c.link, className: 'btn btn-sm btn-outline-primary' }, '前往工具'),
      ])),
    ]);
  };

  R['typing-practice'] = function (app) {
    let target = UI.randomChoice(TYPING_WORDS);
    let start = null;
    const wordEl = UI.el('div', { className: 'tool-result fs-4 text-center' }, target);
    const statEl = UI.output('tp-stat');
    const input = UI.input('開始打字', 'tp-input', 'text', '輸入上方詞語…');
    input.querySelector('input').addEventListener('focus', () => { if (!start) start = Date.now(); });
    input.querySelector('input').addEventListener('input', (e) => {
      const v = e.target.value;
      if (v === target) {
        const sec = (Date.now() - start) / 1000;
        const wpm = Math.round((target.length / 5) / (sec / 60));
        statEl.textContent = '完成！用時 ' + sec.toFixed(1) + ' 秒，約 ' + wpm + ' WPM';
        target = UI.randomChoice(TYPING_WORDS);
        wordEl.textContent = target;
        e.target.value = '';
        start = null;
      }
    });
    mount(app, [UI.panel('打字測驗', [wordEl, input, UI.btnGroup([UI.btn('換一組詞', 'btn btn-outline-secondary', () => {
      target = UI.randomChoice(TYPING_WORDS); wordEl.textContent = target; start = null; statEl.textContent = '';
    })]), statEl])]);
  };

  R['dictionary'] = function (app) {
    const out = UI.output('dict-out');
    const inp = UI.input('查詢漢字', 'dict-in', 'text', '輸入一個字…');
    mount(app, [UI.panel('漢語辭典（精簡版）', [
      inp, UI.btnGroup([UI.bindIO({ input: 'dict-in', output: out, btnText: '查詢', transform: (q) => {
        const hit = DICT.find((d) => d.char === q.trim());
        if (!hit) return '找不到「' + q + '」。本辭典僅收錄約 30 個常用字。';
        return hit.char + '　' + hit.pinyin + '　' + hit.meaning;
      } })]), out,
    ])]);
  };

  R['cangjie-dict'] = function (app) {
    mount(app, [UI.panel('倉頡字典（精簡）', UI.tableFrom(CANGJIE, [
      { key: 'char', label: '字' }, { key: 'code', label: '倉頡碼' },
    ]))]);
  };

  R['zh-converter'] = function (app) {
    const out = UI.output('zc-out');
    const ta = UI.textarea('輸入文字', 'zc-in', '貼上要轉換的文字…', 4);
    mount(app, [UI.panel('繁簡轉換', [
      UI.el('p', { className: 'text-muted small' }, '內建約 200 字對照；完整轉換請用專業辭典或 OpenCC。'),
      ta, UI.btnGroup([
        UI.btn('轉簡體', 'btn btn-primary', () => { out.textContent = convertZh(document.getElementById('zc-in').value, TRAD_TO_SIMP); }),
        UI.btn('轉繁體', 'btn btn-outline-primary', () => { out.textContent = convertZh(document.getElementById('zc-in').value, SIMP_TO_TRAD); }),
        UI.copyBtn(() => out.textContent),
      ]), out,
    ])]);
  };

  R['zh-table'] = function (app) {
    const data = ZH_PAIRS.map(([trad, simp]) => ({ trad, simp }));
    mount(app, [UI.panel('繁簡字對照表', UI.tableFrom(data, [
      { key: 'trad', label: '繁體' }, { key: 'simp', label: '簡體' },
    ]))]);
  };

  R['text-garbled'] = function (app) {
    const out = UI.output('tg-out');
    mount(app, [UI.panel('亂碼修復嘗試', [
      UI.textarea('亂碼文字', 'tg-in', '貼上亂碼…', 4),
      UI.btn('嘗試修復', 'btn btn-primary', () => {
        const text = document.getElementById('tg-in').value;
        const rows = recoverGarbled(text);
        out.textContent = rows.length ? rows.map(([k, v]) => k + ': ' + v).join('\n\n') : '無法解析，可能編碼已完全錯位。';
      }),
      UI.el('p', { className: 'text-muted small' }, '以 UTF-8 / Latin-1 / Big5 等 TextDecoder 組合嘗試，不保證成功。'),
      out,
    ])]);
  };


  R['pinyin'] = function (app) {
    const out = UI.output('py-out');
    mount(app, [UI.panel('中文轉拼音', [
      UI.input('輸入漢字', 'py-in', 'text', '輸入一或多字…'),
      UI.btnGroup([UI.bindIO({ input: 'py-in', output: out, btnText: '轉換', transform: (t) =>
        [...t.trim()].map((c) => PINYIN_MAP[c] || c + '(?)').join(' ')
      })]), out,
    ])]);
  };

  R['pinyin-to-zh'] = function (app) {
    const out = UI.output('ptz-out');
    mount(app, [UI.panel('拼音反查', [
      UI.input('拼音音節', 'ptz-in', 'text', '如 ren、ai…'),
      UI.btnGroup([UI.bindIO({ input: 'ptz-in', output: out, btnText: '查詢', transform: (q) => {
        const key = q.trim().toLowerCase().replace(/[1-4]/g, '');
        const chars = PINYIN_TO_ZH[key];
        return chars ? chars.join(' ') : '找不到對應漢字（精簡字庫）。';
      } })]), out,
    ])]);
  };

  R['pinyin-chart'] = function (app) {
    const rows = PINYIN_INITIALS.flatMap((i) => PINYIN_FINALS.slice(0, 8).map((f) => ({ initial: i, final: f, combo: i + f })));
    mount(app, [UI.panel('漢語拼音表', UI.tableFrom(rows, [
      { key: 'initial', label: '聲母' }, { key: 'final', label: '韻母' }, { key: 'combo', label: '組合' },
    ]))]);
  };

  R['pinyin-syllable'] = function (app) {
    const syllables = Object.keys(PINYIN_TO_ZH).map((s) => ({ syllable: s, chars: PINYIN_TO_ZH[s].join('') }));
    mount(app, [UI.panel('拼音音節查詢', UI.tableFrom(syllables, [
      { key: 'syllable', label: '音節' }, { key: 'chars', label: '例字' },
    ]))]);
  };

  R['pinyin-phonics'] = function (app) {
    const combos = PINYIN_INITIALS.slice(0, 12).map((i) => ({ sheng: i, yun: 'a', example: i + 'a' }));
    mount(app, [UI.panel('拼音拼讀表', [
      UI.el('p', { className: 'text-muted' }, '聲母 + 韻母組合示例（精簡）。'),
      UI.tableFrom(combos, [{ key: 'sheng', label: '聲母' }, { key: 'yun', label: '韻母' }, { key: 'example', label: '拼讀' }]),
    ])]);
  };

  R['cangjie-chart'] = function (app) {
    mount(app, [UI.panel('倉頡字母表', UI.tableFrom(CANGJIE_RADICALS, [
      { key: 'key', label: '鍵' }, { key: 'name', label: '字根' }, { key: 'shape', label: '形' },
    ]))]);
  };

  R['cangjie-practice'] = function (app) {
    let current = UI.randomChoice(CANGJIE);
    const qEl = UI.el('div', { className: 'tool-result fs-3 text-center' }, current.char);
    const out = UI.output('cj-out');
    const inp = UI.input('輸入倉頡碼', 'cj-in', 'text', '輸入拆碼…');
    mount(app, [UI.panel('倉頡練習', [
      UI.el('p', {}, '看字輸碼，答對自動下一題。'),
      qEl, inp,
      UI.btnGroup([UI.btn('確認', 'btn btn-primary', () => {
        const v = document.getElementById('cj-in').value.trim().toLowerCase();
        if (v === current.code) { out.textContent = '正確！'; current = UI.randomChoice(CANGJIE); qEl.textContent = current.char; document.getElementById('cj-in').value = ''; }
        else out.textContent = '再想想，正確答案是：' + current.code;
      }), UI.btn('下一題', 'btn btn-outline-secondary', () => { current = UI.randomChoice(CANGJIE); qEl.textContent = current.char; out.textContent = ''; })]),
      out,
    ])]);
  };

  R['bopomofo'] = function (app) {
    mount(app, [UI.panel('注音符號', [
      UI.el('div', { className: 'tool-result fs-4 text-center', html: BOPOMOFO.map((b) => b.zhuyin).join(' ') }),
      UI.tableFrom(BOPOMOFO, [{ key: 'zhuyin', label: '注音' }, { key: 'pinyin', label: '拼音' }]),
    ])]);
  };

  R['bopomofo-chart'] = function (app) {
    mount(app, [UI.panel('37 個注音', UI.tableFrom(BOPOMOFO, [
      { key: 'zhuyin', label: '注音' }, { key: 'pinyin', label: '對應拼音' },
    ]))]);
  };

  R['bopomofo-phonics'] = function (app) {
    const rows = BOPOMOFO.slice(0, 12).map((b) => ({ zhuyin: b.zhuyin, combo: b.zhuyin + 'ㄚ', pinyin: b.pinyin + 'a' }));
    mount(app, [UI.panel('注音拼讀', UI.tableFrom(rows, [
      { key: 'zhuyin', label: '聲母' }, { key: 'combo', label: '拼讀' }, { key: 'pinyin', label: '拼音' },
    ]))]);
  };

  R['bopomofo-index'] = function (app) {
    const rows = BOPOMOFO_SYLLABLES.map((s) => ({ syllable: s }));
    mount(app, [UI.panel('注音音節索引', UI.tableFrom(rows, [{ key: 'syllable', label: '音節' }]))]);
  };

  R['bopomofo-table'] = function (app) {
    mount(app, [UI.panel('注音拼音對照', UI.tableFrom(BOPOMOFO, [
      { key: 'zhuyin', label: '注音' }, { key: 'pinyin', label: '拼音' },
    ]))]);
  };

  R['abc'] = function (app) {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((l) => ({
      letter: l, word: ({ A: 'Apple', B: 'Book', C: 'Cat', D: 'Dog', E: 'Egg', F: 'Fish', G: 'Game', H: 'House', I: 'Ice', J: 'Jump', K: 'King', L: 'Love', M: 'Moon', N: 'Night', O: 'Orange', P: 'Pen', Q: 'Queen', R: 'Rain', S: 'Sun', T: 'Tree', U: 'Umbrella', V: 'Voice', W: 'Water', X: 'X-ray', Y: 'Yellow', Z: 'Zoo' })[l],
    }));
    mount(app, [UI.panel('英文字母表', UI.tableFrom(letters, [
      { key: 'letter', label: '字母' }, { key: 'word', label: '例詞' },
    ]))]);
  };


  // ===== SYMBOLS =====
  R['symbols-generator'] = function (app) {
    const DATA = window.WA_SYMBOLS_GENERATOR;
    const sections = DATA?.sections || [];
    app.className = 'tool-app sg-app';

    function insertAtCursor(textarea, str) {
      textarea.focus();
      if (typeof textarea.selectionStart === 'number' && typeof textarea.selectionEnd === 'number') {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const before = textarea.value.slice(0, start);
        const after = textarea.value.slice(end);
        textarea.value = before + str + after;
        const pos = start + str.length;
        textarea.selectionStart = textarea.selectionEnd = pos;
      } else {
        textarea.value += str;
      }
    }

    function moveEnd(textarea) {
      textarea.focus();
      const len = textarea.value.length;
      textarea.selectionStart = textarea.selectionEnd = len;
    }

    async function copyText(text, msg) {
      try {
        await navigator.clipboard.writeText(text || '');
        UI.alert(msg || '已複製到剪貼簿', 'success');
      } catch {
        UI.alert('無法複製，請手動選取文字', 'warning');
      }
    }

    const compose = UI.el('textarea', {
      id: 'sg-text',
      className: 'form-control sg-compose',
      rows: 4,
      placeholder: '點選下方符號按鈕，內容會插入游標位置；可連續點選組合顏文字…',
    });

    const composeToolbar = UI.el('div', { className: 'sg-compose-toolbar tool-btn-row' }, [
      UI.btn('移到末尾', 'btn btn-outline-secondary btn-sm sg-toolbar-btn', () => moveEnd(compose)),
      UI.btn('清除', 'btn btn-outline-secondary btn-sm sg-toolbar-btn', () => {
        compose.value = '';
        compose.focus();
      }),
      UI.btn('全選', 'btn btn-outline-secondary btn-sm sg-toolbar-btn', () => {
        compose.focus();
        compose.select();
      }),
      UI.copyBtn(() => compose.value),
    ]);

    const composeSticky = UI.el('div', { className: 'sg-compose-sticky tool-panel-card' }, [
      UI.el('div', { className: 'sg-compose-head' }, [
        UI.el('span', { className: 'tool-label' }, '符號框'),
        UI.el('span', { className: 'text-muted small' }, '連續點選符號可組合；按鈕文字即將插入的內容'),
      ]),
      compose,
      composeToolbar,
    ]);

    const searchInput = UI.el('input', {
      type: 'search',
      className: 'form-control sg-search',
      placeholder: '搜尋符號或分類…',
    });

    const nav = UI.el('nav', { className: 'sg-nav', 'aria-label': '符號分類' });
    const sectionsWrap = UI.el('div', { className: 'sg-sections' });

    function symText(raw) {
      return UI.decodeHtmlEntities ? UI.decodeHtmlEntities(raw) : raw;
    }

    function makeSymChip(raw) {
      const sym = symText(raw);
      const symBtn = UI.btn(sym, 'sg-sym-btn', () => insertAtCursor(compose, sym));
      symBtn.type = 'button';
      symBtn.title = `插入「${sym}」`;
      const copyIcon = UI.el('button', {
        type: 'button',
        className: 'sg-copy-btn',
        title: `複製「${sym}」`,
        'aria-label': `複製 ${sym}`,
      }, UI.el('i', { className: 'bi bi-clipboard' }));
      copyIcon.addEventListener('click', (e) => {
        e.stopPropagation();
        copyText(sym, `已複製「${sym.length > 12 ? sym.slice(0, 12) + '…' : sym}」`);
      });
      return UI.el('div', { className: 'sg-chip', 'data-sym': sym }, [symBtn, copyIcon]);
    }

    function renderSections(filter) {
      const q = (filter || '').trim().toLowerCase();
      sectionsWrap.replaceChildren();
      nav.replaceChildren();

      sections.forEach((sec, idx) => {
        const secId = `sg-sec-${idx}`;
        const matchTitle = !q || sec.title.toLowerCase().includes(q);
        const matchedItems = (sec.items || []).filter((raw) => {
          const sym = symText(raw);
          return !q || sym.toLowerCase().includes(q) || raw.toLowerCase().includes(q) || matchTitle;
        });
        if (q && !matchedItems.length) return;

        nav.appendChild(UI.el('a', {
          href: `#${secId}`,
          className: 'sg-nav-link',
        }, sec.title));

        const grid = UI.el('div', { className: 'sg-grid' });
        matchedItems.forEach((sym) => grid.appendChild(makeSymChip(sym)));

        sectionsWrap.appendChild(UI.el('section', {
          id: secId,
          className: 'sg-section tool-panel-card',
        }, [
          UI.el('div', { className: 'sg-section-head' }, [
            UI.el('h3', { className: 'sg-section-title' }, sec.title),
            UI.el('span', { className: 'sg-section-count text-muted small' }, `${matchedItems.length} 個`),
          ]),
          grid,
        ]));
      });

      if (!sectionsWrap.children.length) {
        sectionsWrap.appendChild(UI.el('p', {
          className: 'text-muted small sg-empty',
        }, '找不到符合的符號，請換個關鍵字試試。'));
      }
    }

    searchInput.addEventListener('input', () => renderSections(searchInput.value));

    mount(app, [
      UI.el('div', { className: 'sg-intro tool-panel-card' }, [
        UI.el('p', { className: 'sg-lead mb-2' }, '表情符號是以文字與符號傳達心情的寫法。它原本是一種網路次文化，隨著即時通訊與論壇普及，已為社會廣泛接受。英文將 Emotion 與 icon 合併為 Emoticon；日語則以「顏文字」稱呼——用臉龐與符號組成圖案，表達撰寫者的心情。'),
        UI.el('ul', { className: 'tool-checklist text-muted small mb-2' }, [
          UI.el('li', {}, '點選符號按鈕：插入至上方符號框的游標位置，可連續點選組合。'),
          UI.el('li', {}, '按鈕上的文字即將插入的內容；旁邊小圖示可單獨複製該符號。'),
          UI.el('li', {}, '符號框提供清除、全選、複製，以及將游標移到末尾。'),
        ]),
        UI.el('p', { className: 'text-muted small mb-0' }, DATA?.itemCount
          ? `收錄 ${DATA.sectionCount} 個分類、共 ${DATA.itemCount} 個符號，供論壇、聊天與社群貼文使用。`
          : '符號資料載入中…'),
      ]),
      composeSticky,
      UI.el('div', { className: 'sg-filter tool-field' }, searchInput),
      nav,
      sectionsWrap,
    ]);

    renderSections('');
    app.className = 'tool-app tool-form sg-app';
  };

  R['keyboard-symbols'] = function (app) {
    const DATA = window.WA_KEYBOARD_SYMBOLS;
    const CURATED = window.WA_KEYBOARD_SYMBOLS_CURATED || {};
    const CURATED_NAV_ORDER = [
      '錯對符號',
      '愛心符號',
      '星星符號',
      '箭頭符號',
      '天氣符號（占星）',
      '表情符號',
      '手勢符號',
      '環保符號',
    ];

    function curatedLabel(id) {
      return id === '天氣符號（占星）' ? '天氣符號' : id;
    }

    function mergeCurated(sec) {
      const extra = CURATED[sec.id] || CURATED[sec.title];
      return extra ? { ...sec, ...extra } : sec;
    }

    const sections = (DATA?.sections || []).map(mergeCurated);

    function normItem(item) {
      return typeof item === 'string' ? { sym: item, label: '' } : item;
    }

    function itemHaystack(item) {
      const { sym, label } = normItem(item);
      return `${sym} ${label}`.toLowerCase();
    }

    function sectionHaystack(sec) {
      const chunks = [sec.title, sec.intro || ''];
      (sec.items || []).forEach((item) => chunks.push(itemHaystack(item)));
      (sec.groups || []).forEach((group) => {
        chunks.push(group.title, group.hint || '');
        (group.rows || []).forEach((row) => {
          chunks.push(row.label || '');
          (row.items || []).forEach((item) => chunks.push(itemHaystack(item)));
        });
      });
      (sec.pairs || []).forEach((pair) => {
        chunks.push(pair.role, pair.plain, pair.emoji, pair.note || '');
      });
      return chunks.join(' ').toLowerCase();
    }

    function flattenSectionItems(sec) {
      const list = [...(sec.items || []).map(normItem)];
      (sec.groups || []).forEach((group) => {
        (group.rows || []).forEach((row) => {
          (row.items || []).forEach((item) => list.push(normItem(item)));
        });
      });
      return list;
    }

    function appendSymbol(textarea, str) {
      textarea.focus();
      textarea.value += str;
      const len = textarea.value.length;
      textarea.selectionStart = textarea.selectionEnd = len;
    }

    async function copyText(text) {
      try {
        await navigator.clipboard.writeText(text || '');
        return true;
      } catch {
        UI.alert('無法複製，請手動選取文字', 'warning');
        return false;
      }
    }

    function pickSymbol(sym, btn) {
      appendSymbol(compose, sym);
      copyText(sym);
      if (btn) {
        btn.classList.add('kbs-picked');
        setTimeout(() => btn.classList.remove('kbs-picked'), 280);
      }
    }

    const compose = UI.el('textarea', {
      id: 'kbs-text',
      className: 'form-control sg-compose kbs-compose',
      rows: 4,
      placeholder: '點選下方符號，會複製並累積於此…',
    });

    const composeSticky = UI.el('div', { className: 'sg-compose-sticky tool-panel-card' }, [
      UI.el('div', { className: 'sg-compose-head' }, [
        UI.el('span', { className: 'tool-label' }, '符號框'),
        UI.el('span', { className: 'text-muted small' }, '點一下符號即複製，並累積至框中'),
      ]),
      compose,
      UI.el('div', { className: 'sg-compose-toolbar tool-btn-row' }, [
        UI.btn('清除', 'btn btn-outline-secondary btn-sm', () => {
          compose.value = '';
          compose.focus();
        }),
        UI.btn('全選', 'btn btn-outline-secondary btn-sm', () => {
          compose.focus();
          compose.select();
        }),
        UI.copyBtn(() => compose.value),
      ]),
    ]);

    const searchInput = UI.el('input', {
      type: 'search',
      className: 'form-control sg-search',
      placeholder: '搜尋符號或分類…',
    });
    const nav = UI.el('nav', { className: 'sg-nav', 'aria-label': '符號分類' });
    const sectionsWrap = UI.el('div', { className: 'sg-sections' });

    function makeSymBtn(item) {
      const { sym, label } = normItem(item);
      const btn = UI.btn(sym, 'sg-sym-btn kbs-sym-btn', () => pickSymbol(sym, btn));
      btn.type = 'button';
      if (label) {
        btn.title = label;
        btn.setAttribute('aria-label', `${sym} ${label}`);
      } else {
        btn.title = `複製 ${sym}`;
      }
      return label
        ? UI.el('div', { className: 'kbs-chip-labeled' }, [
          btn,
          UI.el('span', { className: 'kbs-chip-label text-muted' }, label),
        ])
        : btn;
    }

    function makePairCell(sym, kind) {
      if (!sym) {
        return UI.el('span', { className: 'kbs-pair-empty text-muted' }, '—');
      }
      const btn = UI.btn(sym, `sg-sym-btn kbs-sym-btn kbs-pair-btn kbs-pair-btn-${kind}`, () => pickSymbol(sym, btn));
      btn.type = 'button';
      btn.title = `複製 ${sym}`;
      return btn;
    }

    function renderPairTable(pairs) {
      const hasNotes = pairs.some((pair) => pair.note);
      const tbody = UI.el('tbody', {}, pairs.map((pair) => {
        const cells = [
          UI.el('td', { className: 'kbs-pair-role' }, pair.role || ''),
          UI.el('td', { className: 'kbs-pair-cell kbs-pair-plain' }, makePairCell(pair.plain, 'plain')),
          UI.el('td', { className: 'kbs-pair-cell kbs-pair-emoji' }, makePairCell(pair.emoji, 'emoji')),
        ];
        if (hasNotes) cells.push(UI.el('td', { className: 'kbs-pair-note text-muted' }, pair.note || ''));
        return UI.el('tr', {}, cells);
      }));

      const headCells = [
        UI.el('th', { scope: 'col' }, '用途'),
        UI.el('th', { scope: 'col' }, '純文字'),
        UI.el('th', { scope: 'col' }, '彩色'),
      ];
      if (hasNotes) headCells.push(UI.el('th', { scope: 'col' }, '說明'));

      return UI.el('div', { className: 'kbs-pair-table-wrap' }, [
        UI.el('table', { className: 'kbs-pair-table' }, [
          UI.el('thead', {}, UI.el('tr', {}, headCells)),
          tbody,
        ]),
      ]);
    }

    function renderGroupBlock(group, q) {
      const rows = (group.rows || []).map((row) => {
        const items = (row.items || []).filter((item) => {
          if (!q) return true;
          return itemHaystack(item).includes(q) || (row.label || '').toLowerCase().includes(q);
        });
        if (q && !items.length) return null;

        const grid = UI.el('div', { className: 'sg-grid kbs-grid kbs-row-grid' });
        items.forEach((item) => grid.appendChild(makeSymBtn(item)));

        return UI.el('div', { className: 'kbs-row' }, [
          UI.el('div', { className: 'kbs-row-label' }, row.label || ''),
          grid,
        ]);
      }).filter(Boolean);

      if (!rows.length) return null;

      return UI.el('div', { className: 'kbs-group' }, [
        UI.el('div', { className: 'kbs-group-head' }, [
          UI.el('h4', { className: 'kbs-group-title' }, group.title),
          group.hint ? UI.el('p', { className: 'kbs-group-hint text-muted small' }, group.hint) : null,
        ]),
        ...rows,
      ]);
    }

    function renderSectionBody(sec, q) {
      const body = [];

      if (sec.intro && !q) {
        body.push(UI.el('p', { className: 'kbs-section-intro text-muted small' }, sec.intro));
      }

      if (sec.pairs?.length && (!q || sec.pairs.some((pair) => `${pair.role} ${pair.plain} ${pair.emoji} ${pair.note}`.toLowerCase().includes(q)))) {
        const visiblePairs = q
          ? sec.pairs.filter((pair) => `${pair.role} ${pair.plain} ${pair.emoji} ${pair.note}`.toLowerCase().includes(q))
          : sec.pairs;
        if (visiblePairs.length) body.push(renderPairTable(visiblePairs));
      }

      if (sec.groups?.length) {
        sec.groups.forEach((group) => {
          const block = renderGroupBlock(group, q);
          if (block) body.push(block);
        });
      } else {
        const matchedItems = flattenSectionItems(sec).filter((item) => !q || itemHaystack(item).includes(q) || sec.title.toLowerCase().includes(q));
        const grid = UI.el('div', { className: 'sg-grid kbs-grid' });
        matchedItems.forEach((item) => grid.appendChild(makeSymBtn(item)));
        body.push(grid);
      }

      return body;
    }

    function sampleItemsFromGroups(groups, groupIndex, limit) {
      const group = groups?.[groupIndex];
      if (!group?.rows?.length) return [];
      const merged = group.rows.flatMap((row) => row.items || []);
      return merged.slice(0, limit || merged.length);
    }

    function renderInlineSymRow(items) {
      const row = UI.el('div', { className: 'kbs-inline-syms' });
      items.forEach((item) => row.appendChild(makeSymBtn(item)));
      return row;
    }

    function renderCuratedOverview(q) {
      if (q) return null;

      const rows = CURATED_NAV_ORDER.map((catId) => {
        const curated = CURATED[catId];
        if (!curated?.groups?.length) return null;

        const secIdx = sections.findIndex((sec) => sec.id === catId);
        const anchor = secIdx >= 0 ? `kbs-sec-${secIdx}` : null;
        const plainItems = sampleItemsFromGroups(curated.groups, 0, 8);
        const emojiItems = sampleItemsFromGroups(curated.groups, 1, 8);
        if (!plainItems.length && !emojiItems.length) return null;

        const label = curatedLabel(catId);
        const labelNode = anchor
          ? UI.el('a', { href: `#${anchor}`, className: 'kbs-curated-cat-link' }, label)
          : label;

        return UI.el('tr', {}, [
          UI.el('td', { className: 'kbs-curated-cat' }, labelNode),
          UI.el('td', { className: 'kbs-curated-plain' }, renderInlineSymRow(plainItems)),
          UI.el('td', { className: 'kbs-curated-emoji' }, renderInlineSymRow(emojiItems)),
        ]);
      }).filter(Boolean);

      if (!rows.length) return null;

      return UI.el('section', {
        id: 'kbs-curated-overview',
        className: 'sg-section tool-panel-card kbs-curated-overview',
      }, [
        UI.el('div', { className: 'sg-section-head' }, [
          UI.el('h3', { className: 'sg-section-title' }, '純文字 ↔ 彩色 emoji 對照'),
          UI.el('span', { className: 'sg-section-count text-muted small' }, `${rows.length} 個分類`),
        ]),
        UI.el('p', { className: 'kbs-section-intro text-muted small mb-2' }, '點分類名稱可跳至下方完整分類（#kbs-sec-1 起）。'),
        UI.el('div', { className: 'kbs-pair-table-wrap' }, [
          UI.el('table', { className: 'kbs-pair-table kbs-curated-table' }, [
            UI.el('thead', {}, UI.el('tr', {}, [
              UI.el('th', { scope: 'col' }, '分類'),
              UI.el('th', { scope: 'col' }, '純文字範例'),
              UI.el('th', { scope: 'col' }, '彩色 emoji 範例'),
            ])),
            UI.el('tbody', {}, rows),
          ]),
        ]),
      ]);
    }

    function sectionItemCount(sec) {
      if (sec.groups?.length) {
        return sec.groups.reduce((n, group) => n + (group.rows || []).reduce((m, row) => m + (row.items || []).length, 0), 0);
      }
      return flattenSectionItems(sec).length;
    }

    function renderSections(filter) {
      const q = (filter || '').trim().toLowerCase();
      sectionsWrap.replaceChildren();
      nav.replaceChildren();

      const overview = renderCuratedOverview(q);
      if (overview) {
        nav.appendChild(UI.el('a', {
          href: '#kbs-curated-overview',
          className: 'sg-nav-link sg-nav-link-curated',
        }, '彩色對照'));
        sectionsWrap.appendChild(overview);
      }

      sections.forEach((sec, idx) => {
        const secId = `kbs-sec-${idx}`;
        const matchTitle = !q || sec.title.toLowerCase().includes(q);
        const matchSection = !q || matchTitle || sectionHaystack(sec).includes(q);
        if (q && !matchSection) return;

        nav.appendChild(UI.el('a', { href: `#${secId}`, className: 'sg-nav-link' }, sec.title));

        const body = renderSectionBody(sec, q);
        if (!body.length) return;

        sectionsWrap.appendChild(UI.el('section', {
          id: secId,
          className: 'sg-section tool-panel-card',
        }, [
          UI.el('div', { className: 'sg-section-head' }, [
            UI.el('h3', { className: 'sg-section-title' }, sec.title),
            UI.el('span', { className: 'sg-section-count text-muted small' }, `${sectionItemCount(sec)} 個`),
          ]),
          ...body,
        ]));
      });

      if (!sectionsWrap.children.length) {
        sectionsWrap.appendChild(UI.el('p', {
          className: 'text-muted small sg-empty',
        }, '找不到符合的符號，請換個關鍵字試試。'));
      }
    }

    searchInput.addEventListener('input', () => renderSections(searchInput.value));

    mount(app, [
      UI.el('div', { className: 'sg-intro tool-panel-card kbs-intro' }, [
        UI.el('p', { className: 'sg-lead mb-2' }, DATA?.intro || '收錄 Word、網頁、社群貼文常用的特殊符號，點一下即可複製使用。'),
        UI.el('ul', { className: 'tool-checklist text-muted small mb-2' }, [
          UI.el('li', {}, '點一下符號：立即複製到剪貼簿，並累積至上方符號框。'),
          UI.el('li', {}, '可連續點選多個符號，組合後再一次性複製貼到 Word 或聊天室。'),
          UI.el('li', {}, '符號框提供清除、全選、複製，方便整理已選內容。'),
        ]),
        UI.el('p', { className: 'text-muted small mb-0' }, DATA?.itemCount
          ? `收錄 ${DATA.sectionCount} 個分類、共 ${DATA.itemCount} 個符號。`
          : '符號資料載入中…'),
      ]),
      composeSticky,
      UI.el('div', { className: 'sg-filter tool-field' }, searchInput),
      nav,
      sectionsWrap,
    ]);

    renderSections('');
    app.className = 'tool-app tool-form sg-app kbs-app';
  };

  R['emoji'] = function (app) {
    const DATA = window.WA_EMOJI;
    const sections = DATA?.sections || [];

    function appendEmoji(textarea, str) {
      textarea.focus();
      textarea.value += str;
      const len = textarea.value.length;
      textarea.selectionStart = textarea.selectionEnd = len;
    }

    async function copyText(text) {
      try {
        await navigator.clipboard.writeText(text || '');
        return true;
      } catch {
        UI.alert('無法複製，請手動選取文字', 'warning');
        return false;
      }
    }

    function pickEmoji(emoji, btn) {
      appendEmoji(compose, emoji);
      copyText(emoji);
      if (btn) {
        btn.classList.add('emo-picked');
        setTimeout(() => btn.classList.remove('emo-picked'), 280);
      }
    }

    const compose = UI.el('textarea', {
      id: 'emo-text',
      className: 'form-control sg-compose emo-compose',
      rows: 4,
      placeholder: '點選下方 Emoji，會複製並累積於此…',
    });

    const composeSticky = UI.el('div', { className: 'sg-compose-sticky tool-panel-card' }, [
      UI.el('div', { className: 'sg-compose-head' }, [
        UI.el('span', { className: 'tool-label' }, 'Emoji 框'),
        UI.el('span', { className: 'text-muted small' }, '點一下即複製單個 Emoji，並累積至框中'),
      ]),
      compose,
      UI.el('div', { className: 'sg-compose-toolbar tool-btn-row' }, [
        UI.btn('清除', 'btn btn-outline-secondary btn-sm', () => {
          compose.value = '';
          compose.focus();
        }),
        UI.btn('全選', 'btn btn-outline-secondary btn-sm', () => {
          compose.focus();
          compose.select();
        }),
        UI.copyBtn(() => compose.value),
      ]),
    ]);

    const searchInput = UI.el('input', {
      type: 'search',
      className: 'form-control sg-search',
      placeholder: '搜尋 Emoji 或分類…',
    });
    const nav = UI.el('nav', { className: 'sg-nav', 'aria-label': 'Emoji 分類' });
    const sectionsWrap = UI.el('div', { className: 'sg-sections' });

    function makeEmojiBtn(emoji) {
      const btn = UI.btn(emoji, 'emo-btn', () => pickEmoji(emoji, btn));
      btn.type = 'button';
      btn.title = `複製 ${emoji}`;
      btn.setAttribute('aria-label', `複製 ${emoji}`);
      return btn;
    }

    function renderSections(filter) {
      const q = (filter || '').trim().toLowerCase();
      sectionsWrap.replaceChildren();
      nav.replaceChildren();

      sections.forEach((sec, idx) => {
        const secId = `emo-sec-${idx}`;
        const matchTitle = !q || sec.title.toLowerCase().includes(q);
        const matchedItems = (sec.items || []).filter((emoji) =>
          !q || matchTitle || emoji.includes(q)
        );
        if (q && !matchedItems.length) return;

        nav.appendChild(UI.el('a', { href: `#${secId}`, className: 'sg-nav-link' }, sec.title));

        const grid = UI.el('div', { className: 'sg-grid emo-grid' });
        matchedItems.forEach((emoji) => grid.appendChild(makeEmojiBtn(emoji)));

        sectionsWrap.appendChild(UI.el('section', {
          id: secId,
          className: 'sg-section tool-panel-card',
        }, [
          UI.el('div', { className: 'sg-section-head' }, [
            UI.el('h3', { className: 'sg-section-title' }, sec.title),
            UI.el('span', { className: 'sg-section-count text-muted small' }, `${matchedItems.length} 個`),
          ]),
          grid,
        ]));
      });

      if (!sectionsWrap.children.length) {
        sectionsWrap.appendChild(UI.el('p', {
          className: 'text-muted small sg-empty',
        }, '找不到符合的 Emoji，請換個關鍵字試試。'));
      }
    }

    searchInput.addEventListener('input', () => renderSections(searchInput.value));

    const introParas = (DATA?.intro || []).slice(0, 3);
    mount(app, [
      UI.el('div', { className: 'sg-intro tool-panel-card emo-intro' }, [
        ...introParas.map((p, i) => UI.el('p', {
          className: i === 0 ? 'sg-lead mb-2' : 'text-muted small mb-2',
        }, p)),
        UI.el('ul', { className: 'tool-checklist text-muted small mb-2' }, [
          UI.el('li', {}, '點一下 Emoji：立即複製到剪貼簿，並累積至上方 Emoji 框。'),
          UI.el('li', {}, '可連續點選組合訊息，再用「複製」一次貼到聊天或貼文。'),
          UI.el('li', {}, 'Emoji 框提供清除、全選、複製。各系統顯示圖案可能略有不同。'),
        ]),
        UI.el('p', { className: 'text-muted small mb-0' }, DATA?.itemCount
          ? `收錄 ${DATA.sectionCount} 個分類、共 ${DATA.itemCount} 個 Emoji。`
          : 'Emoji 資料載入中…'),
      ]),
      composeSticky,
      UI.el('div', { className: 'sg-filter tool-field' }, searchInput),
      nav,
      sectionsWrap,
    ]);

    renderSections('');
    app.className = 'tool-app tool-form sg-app emo-app';
  };

  R['punctuation'] = function (app) {
    const DATA = window.WA_PUNCTUATION;
    const sections = DATA?.sections || [];

    function appendSymbol(textarea, str) {
      textarea.focus();
      textarea.value += str;
      const len = textarea.value.length;
      textarea.selectionStart = textarea.selectionEnd = len;
    }

    async function copyText(text) {
      try {
        await navigator.clipboard.writeText(text || '');
        return true;
      } catch {
        UI.alert('無法複製，請手動選取文字', 'warning');
        return false;
      }
    }

    function pickSymbol(sym, btn) {
      appendSymbol(compose, sym);
      copyText(sym);
      if (btn) {
        btn.classList.add('punc-picked');
        setTimeout(() => btn.classList.remove('punc-picked'), 280);
      }
    }

    function isMultiline(sym) {
      return sym.includes('\n');
    }

    function symSearchText(sym) {
      return sym.replace(/\n/g, ' ').toLowerCase();
    }

    const compose = UI.el('textarea', {
      id: 'punc-text',
      className: 'form-control sg-compose punc-compose',
      rows: 4,
      placeholder: '點選下方標點或符號，會複製並累積於此…',
    });

    const composeSticky = UI.el('div', { className: 'sg-compose-sticky tool-panel-card' }, [
      UI.el('div', { className: 'sg-compose-head' }, [
        UI.el('span', { className: 'tool-label' }, '標點框'),
        UI.el('span', { className: 'text-muted small' }, '點一下即複製，並累積至框中'),
      ]),
      compose,
      UI.el('div', { className: 'sg-compose-toolbar tool-btn-row' }, [
        UI.btn('清除', 'btn btn-outline-secondary btn-sm', () => {
          compose.value = '';
          compose.focus();
        }),
        UI.btn('全選', 'btn btn-outline-secondary btn-sm', () => {
          compose.focus();
          compose.select();
        }),
        UI.copyBtn(() => compose.value),
      ]),
    ]);

    const searchInput = UI.el('input', {
      type: 'search',
      className: 'form-control sg-search',
      placeholder: '搜尋標點、符號或分類…',
    });
    const nav = UI.el('nav', { className: 'sg-nav', 'aria-label': '標點分類' });
    const sectionsWrap = UI.el('div', { className: 'sg-sections' });

    function makeSymBtn(sym) {
      const multi = isMultiline(sym);
      const cls = multi ? 'sg-sym-btn punc-sym-btn punc-sym-btn-multi' : 'sg-sym-btn punc-sym-btn';
      const btn = UI.btn(sym, cls, () => pickSymbol(sym, btn));
      btn.type = 'button';
      const label = sym.replace(/\n/g, ' / ');
      btn.title = `複製 ${label}`;
      btn.setAttribute('aria-label', `複製 ${label}`);
      return btn;
    }

    function renderSections(filter) {
      const q = (filter || '').trim().toLowerCase();
      sectionsWrap.replaceChildren();
      nav.replaceChildren();

      sections.forEach((sec, idx) => {
        const secId = `punc-sec-${idx}`;
        const matchTitle = !q || sec.title.toLowerCase().includes(q);
        const matchedItems = (sec.items || []).filter((sym) =>
          !q || matchTitle || symSearchText(sym).includes(q)
        );
        if (q && !matchedItems.length) return;

        nav.appendChild(UI.el('a', { href: `#${secId}`, className: 'sg-nav-link' }, sec.title));

        const grid = UI.el('div', { className: 'sg-grid punc-grid' });
        matchedItems.forEach((sym) => grid.appendChild(makeSymBtn(sym)));

        sectionsWrap.appendChild(UI.el('section', {
          id: secId,
          className: 'sg-section tool-panel-card',
        }, [
          UI.el('div', { className: 'sg-section-head' }, [
            UI.el('h3', { className: 'sg-section-title' }, sec.title),
            UI.el('span', { className: 'sg-section-count text-muted small' }, `${matchedItems.length} 個`),
          ]),
          grid,
        ]));
      });

      if (!sectionsWrap.children.length) {
        sectionsWrap.appendChild(UI.el('p', {
          className: 'text-muted small sg-empty',
        }, '找不到符合的符號，請換個關鍵字試試。'));
      }
    }

    searchInput.addEventListener('input', () => renderSections(searchInput.value));

    const introParas = (DATA?.intro || []).slice(0, 3);
    mount(app, [
      UI.el('div', { className: 'sg-intro tool-panel-card punc-intro' }, [
        ...introParas.map((p, i) => UI.el('p', {
          className: i === 0 ? 'sg-lead mb-2' : 'text-muted small mb-2',
        }, p)),
        UI.el('ul', { className: 'tool-checklist text-muted small mb-2' }, [
          UI.el('li', {}, '點一下符號：立即複製到剪貼簿，並累積至上方標點框。'),
          UI.el('li', {}, '可連續點選多個符號，組合後再一次性複製貼到 Word 或聊天室。'),
          UI.el('li', {}, '標點框提供清除、全選、複製，方便整理已選內容。'),
        ]),
        UI.el('p', { className: 'text-muted small mb-0' }, DATA?.itemCount
          ? `收錄 ${DATA.sectionCount} 個分類、共 ${DATA.itemCount} 個標點與符號。`
          : '標點資料載入中…'),
      ]),
      composeSticky,
      UI.el('div', { className: 'sg-filter tool-field' }, searchInput),
      nav,
      sectionsWrap,
    ]);

    renderSections('');
    app.className = 'tool-app tool-form sg-app punc-app';
  };

  R['symbols-name'] = function (app) {
    const DATA = window.WA_SYMBOLS_NAME;
    const sections = DATA?.sections || [];

    function normItem(item) {
      if (typeof item === 'string') return { sym: item, zh: '', en: '' };
      return item;
    }

    function appendSymbol(textarea, str) {
      textarea.focus();
      textarea.value += str;
      const len = textarea.value.length;
      textarea.selectionStart = textarea.selectionEnd = len;
    }

    async function copyText(text) {
      try {
        await navigator.clipboard.writeText(text || '');
        return true;
      } catch {
        UI.alert('無法複製，請手動選取文字', 'warning');
        return false;
      }
    }

    function pickSymbol(sym, btn) {
      appendSymbol(compose, sym);
      copyText(sym);
      if (btn) {
        btn.classList.add('symn-picked');
        setTimeout(() => btn.classList.remove('symn-picked'), 280);
      }
    }

    function itemLabel(item) {
      const { zh, en } = normItem(item);
      return zh || en || '';
    }

    function itemTitle(item) {
      const { sym, zh, en } = normItem(item);
      const parts = [sym];
      if (zh) parts.push(zh);
      if (en) parts.push(en);
      return parts.join(' · ');
    }

    function isMultiline(sym) {
      return sym.includes('\n');
    }

    const compose = UI.el('textarea', {
      id: 'symn-text',
      className: 'form-control sg-compose symn-compose',
      rows: 4,
      placeholder: '點選下方符號，會複製並累積於此…',
    });

    const composeSticky = UI.el('div', { className: 'sg-compose-sticky tool-panel-card' }, [
      UI.el('div', { className: 'sg-compose-head' }, [
        UI.el('span', { className: 'tool-label' }, '符號框'),
        UI.el('span', { className: 'text-muted small' }, '點一下即複製單一符號，並累積至框中'),
      ]),
      compose,
      UI.el('div', { className: 'sg-compose-toolbar tool-btn-row' }, [
        UI.btn('清除', 'btn btn-outline-secondary btn-sm', () => {
          compose.value = '';
          compose.focus();
        }),
        UI.btn('全選', 'btn btn-outline-secondary btn-sm', () => {
          compose.focus();
          compose.select();
        }),
        UI.copyBtn(() => compose.value),
      ]),
    ]);

    const searchInput = UI.el('input', {
      type: 'search',
      className: 'form-control sg-search',
      placeholder: '搜尋符號、名稱或分類…',
    });
    const nav = UI.el('nav', { className: 'sg-nav', 'aria-label': '符號分類' });
    const sectionsWrap = UI.el('div', { className: 'sg-sections' });
    let viewMode = 'table';

    const viewToggle = UI.el('div', { className: 'symn-view-toggle tool-btn-row mb-2' }, [
      UI.btn('表格', 'btn btn-primary btn-sm symn-view-btn symn-view-btn-active', () => setView('table')),
      UI.btn('卡片', 'btn btn-outline-secondary btn-sm symn-view-btn', () => setView('cards')),
    ]);
    const viewBtns = viewToggle.querySelectorAll('.symn-view-btn');

    function setView(mode) {
      viewMode = mode;
      viewBtns.forEach((btn) => {
        const isTable = btn.textContent === '表格';
        const active = (mode === 'table' && isTable) || (mode === 'cards' && !isTable);
        btn.classList.toggle('symn-view-btn-active', active);
        btn.classList.toggle('btn-primary', active);
        btn.classList.toggle('btn-outline-secondary', !active);
      });
      renderSections(searchInput.value);
    }

    function symDisplay(sym) {
      return sym;
    }

    function makeSymBtn(item) {
      const { sym, zh, en } = normItem(item);
      const label = itemLabel(item);
      const multi = isMultiline(sym);
      const cls = multi ? 'sg-sym-btn symn-sym-btn symn-sym-btn-multi' : 'sg-sym-btn symn-sym-btn';
      const btn = UI.btn(symDisplay(sym), cls, () => pickSymbol(sym, btn));
      btn.type = 'button';
      btn.title = itemTitle(item);
      btn.setAttribute('aria-label', `複製 ${itemTitle(item)}`);
      if (!label) return btn;
      return UI.el('div', { className: 'kbs-chip-labeled symn-chip' }, [
        btn,
        UI.el('span', { className: 'kbs-chip-label text-muted', title: en || '' }, label),
      ]);
    }

    function makeSectionTable(sec, items) {
      const hasEn = sec.title !== '文本標點符號';
      const isNumber = sec.title === '數字符號';
      const thead = UI.el('thead', {}, UI.el('tr', {}, [
        UI.el('th', { scope: 'col' }, isNumber ? '羅馬數字' : '符號'),
        ...(hasEn ? [UI.el('th', { scope: 'col' }, '英文')] : []),
        UI.el('th', { scope: 'col' }, isNumber ? '中文數字' : '中文'),
      ]));
      const tbody = UI.el('tbody');
      items.forEach((item) => {
        const { sym, zh, en } = normItem(item);
        const symCell = UI.el('td', {
          className: 'symn-sym-cell' + (isMultiline(sym) ? ' symn-sym-cell-multi' : ''),
          title: '點一下複製符號',
        }, symDisplay(sym));
        symCell.addEventListener('click', () => pickSymbol(sym, symCell));
        const cells = [symCell];
        if (hasEn) cells.push(UI.el('td', { className: 'symn-en-cell text-muted' }, en || '—'));
        cells.push(UI.el('td', { className: 'symn-zh-cell' }, zh || '—'));
        tbody.appendChild(UI.el('tr', { className: 'symn-row' }, cells));
      });
      return UI.el('div', { className: 'table-responsive symn-table-wrap' }, [
        UI.el('table', { className: 'table table-sm table-hover symn-table' }, [thead, tbody]),
      ]);
    }

    function itemMatches(item, q, matchTitle) {
      const { sym, zh, en } = normItem(item);
      if (!q) return true;
      if (matchTitle) return true;
      const hay = `${sym} ${zh} ${en}`.replace(/\n/g, ' ').toLowerCase();
      return hay.includes(q);
    }

    function renderSections(filter) {
      const q = (filter || '').trim().toLowerCase();
      sectionsWrap.replaceChildren();
      nav.replaceChildren();

      sections.forEach((sec, idx) => {
        const secId = `symn-sec-${idx}`;
        const matchTitle = !q || sec.title.toLowerCase().includes(q);
        const matchedItems = (sec.items || []).filter((item) => itemMatches(item, q, matchTitle));
        if (q && !matchedItems.length) return;

        nav.appendChild(UI.el('a', { href: `#${secId}`, className: 'sg-nav-link' }, sec.title));

        const body = viewMode === 'table'
          ? makeSectionTable(sec, matchedItems)
          : (() => {
            const grid = UI.el('div', { className: 'sg-grid kbs-grid symn-grid' });
            matchedItems.forEach((item) => grid.appendChild(makeSymBtn(item)));
            return grid;
          })();

        sectionsWrap.appendChild(UI.el('section', {
          id: secId,
          className: 'sg-section tool-panel-card',
        }, [
          UI.el('div', { className: 'sg-section-head' }, [
            UI.el('h3', { className: 'sg-section-title' }, sec.title),
            UI.el('span', { className: 'sg-section-count text-muted small' }, `${matchedItems.length} 個`),
          ]),
          body,
        ]));
      });

      if (!sectionsWrap.children.length) {
        sectionsWrap.appendChild(UI.el('p', {
          className: 'text-muted small sg-empty',
        }, '找不到符合的符號，請換個關鍵字試試。'));
      }
    }

    searchInput.addEventListener('input', () => renderSections(searchInput.value));

    const introParas = (DATA?.intro || []).slice(0, 2);
    mount(app, [
      UI.el('div', { className: 'sg-intro tool-panel-card symn-intro' }, [
        ...introParas.map((p, i) => UI.el('p', {
          className: i === 0 ? 'sg-lead mb-2' : 'text-muted small mb-2',
        }, p)),
        UI.el('ul', { className: 'tool-checklist text-muted small mb-2' }, [
          UI.el('li', {}, '點一下符號：立即複製到剪貼簿，並累積至上方符號框。'),
          UI.el('li', {}, '表格模式顯示符號、英文、中文對照（資料來源：ifreesite）。'),
          UI.el('li', {}, '可連續點選組合字串；符號框提供清除、全選、複製。'),
        ]),
        UI.el('p', { className: 'text-muted small mb-0' }, DATA?.itemCount
          ? `收錄 ${DATA.sectionCount} 個分類、共 ${DATA.itemCount} 個符號及名稱。`
          : '符號資料載入中…'),
      ]),
      composeSticky,
      UI.el('div', { className: 'sg-filter tool-field' }, searchInput),
      viewToggle,
      nav,
      sectionsWrap,
    ]);

    renderSections('');
    app.className = 'tool-app tool-form sg-app symn-app';
  };

  R['boshiamy'] = function (app) {
    mount(app, [UI.panel('嘸蝦米符號', UI.tableFrom([{"sym":"，","code":"mc"},{"sym":"。","code":"md"},{"sym":"？","code":"mf"},{"sym":"！","code":"mg"},{"sym":"：","code":"mh"},{"sym":"；","code":"mi"},{"sym":"、","code":"mj"}], [
      { key: 'sym', label: '符號' }, { key: 'code', label: '拆碼' },
    ]))]);
  };

  R['wubi'] = function (app) {
    mount(app, [UI.panel('五筆符號鍵', UI.tableFrom([{"sym":"，","key":"g"},{"sym":"。","key":"y"},{"sym":"？","key":"y"},{"sym":"！","key":"y"}], [
      { key: 'sym', label: '符號' }, { key: 'key', label: '鍵位' },
    ]))]);
  };

  R['emoticon'] = function (app) {
    const rows = ["^_^","T_T","Orz","QAQ",">.<","O_O","-_-","(´･ω･`)","(╯°□°）╯","( ͡° ͜ʖ ͡°)"].map((e) => ({ emoticon: e }));
    const out = UI.output('emo-out');
    mount(app, [UI.panel('Emoticon', [
      UI.tableFrom(rows, [{ key: 'emoticon', label: '表情' }]),
      UI.btnGroup([UI.btn('隨機一個', 'btn btn-primary', () => { out.textContent = UI.randomChoice(rows).emoticon; }), UI.copyBtn(() => out.textContent)]),
      out,
    ])]);
  };

  R['ubcode'] = function (app) {
    const out = UI.output('ub-out');
    mount(app, [UI.panel('Unicode 輸入', [
      UI.input('Unicode 碼點 (十六進位)', 'ub-in', 'text', '如 2764 或 U+2764'),
      UI.btnGroup([UI.bindIO({ input: 'ub-in', output: out, btnText: '轉字元', transform: (q) => {
        const hex = q.replace(/U\+/i, '').trim();
        const cp = parseInt(hex, 16);
        return isNaN(cp) ? '無效碼點' : String.fromCodePoint(cp);
      } })]), out,
      UI.el('p', { className: 'text-muted small' }, 'Windows: Alt+數字鍵；Mac: 可貼上字元。'),
    ])]);
  };

  R['alt-code'] = function (app) {
    mount(app, [UI.panel('Alt 數字鍵', UI.tableFrom([{"code":"0169","char":"©"},{"code":"0174","char":"®"},{"code":"0153","char":"™"},{"code":"0177","char":"±"},{"code":"0176","char":"°"},{"code":"0188","char":"¼"},{"code":"0189","char":"½"},{"code":"0190","char":"¾"}], [
      { key: 'code', label: 'Alt+數字' }, { key: 'char', label: '字元' },
    ]))]);
  };

  R['roman-numeral'] = function (app) {
    const map = [[1000,'M'],[900,'CM'],[500,'D'],[400,'CD'],[100,'C'],[90,'XC'],[50,'L'],[40,'XL'],[10,'X'],[9,'IX'],[5,'V'],[4,'IV'],[1,'I']];
    function toRoman(n) {
      n = +n; if (n < 1 || n > 3999) return '超出範圍 (1-3999)';
      let s = ''; map.forEach(([v, r]) => { while (n >= v) { s += r; n -= v; } }); return s;
    }
    function fromRoman(s) {
      const vals = { I:1,V:5,X:10,L:50,C:100,D:500,M:1000 };
      let t = 0, p = 0;
      for (let i = s.length - 1; i >= 0; i--) { const v = vals[s[i]] || 0; t += v < p ? -v : v; p = v; }
      return t || '無效';
    }
    const out = UI.output('rn-out');
    mount(app, [UI.panel('羅馬數字', [
      UI.input('阿拉伯數字', 'rn-num', 'number', '2024'),
      UI.input('羅馬數字', 'rn-rom', 'text', 'MMXXIV'),
      UI.btnGroup([
        UI.btn('數字→羅馬', 'btn btn-primary', () => { out.textContent = toRoman(document.getElementById('rn-num').value); }),
        UI.btn('羅馬→數字', 'btn btn-outline-primary', () => { out.textContent = String(fromRoman(document.getElementById('rn-rom').value.toUpperCase())); }),
      ]), out,
    ])]);
  };

  R['suzhou-numeral'] = function (app) {
    const sz = ['〡','〢','〣','〤','〥','〦','〧','〨','〩','〸'];
    const out = UI.output('sz-out');
    mount(app, [UI.panel('蘇州碼子', [
      UI.el('p', {}, '花碼（蘇州碼）是舊式帳簿用數字，精簡版 0-9 對照。'),
      UI.input('阿拉伯數字', 'sz-in', 'text', '12345'),
      UI.btn('轉換', 'btn btn-primary', () => {
        const n = document.getElementById('sz-in').value.replace(/\D/g, '');
        out.textContent = [...n].map((d) => sz[+d] || d).join('');
      }), out,
    ])]);
  };

  R['strokes'] = function (app) {
    mount(app, [UI.panel('筆畫偏旁', UI.tableFrom([{"stroke":"一","name":"橫"},{"stroke":"丨","name":"豎"},{"stroke":"丿","name":"撇"},{"stroke":"丶","name":"點"},{"stroke":"乙","name":"折"},{"stroke":"亻","name":"單人旁"},{"stroke":"氵","name":"三點水"},{"stroke":"口","name":"口字旁"},{"stroke":"木","name":"木字旁"},{"stroke":"心","name":"心字底"}], [
      { key: 'stroke', label: '形' }, { key: 'name', label: '名稱' },
    ]))]);
  };


  // ===== LIFE =====
  R['time'] = function (app) {
    const DATA = window.WA_WORLD_TIME;
    const items = DATA?.items || [];
    if (!items.length) {
      mount(app, [UI.panel('世界時間', UI.el('p', { className: 'text-muted' }, '時區資料載入失敗，請重新整理。'))]);
      return;
    }

    function tzParts(date, tz) {
      const dtf = new Intl.DateTimeFormat('en-GB', {
        timeZone: tz,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      });
      const map = {};
      dtf.formatToParts(date).forEach((p) => {
        if (p.type !== 'literal') map[p.type] = p.value;
      });
      return {
        hour: +map.hour,
        minute: +map.minute,
        second: +map.second,
        y: +map.year,
        mo: +map.month,
        d: +map.day,
      };
    }

    function offsetMinutes(date, tz) {
      const p = tzParts(date, tz);
      const asUTC = Date.UTC(p.y, p.mo - 1, p.d, p.hour, p.minute, p.second);
      return Math.round((asUTC - date.getTime()) / 60000);
    }

    function formatOffset(mins) {
      const sign = mins >= 0 ? '+' : '-';
      const abs = Math.abs(mins);
      const h = Math.floor(abs / 60);
      const m = abs % 60;
      return `UTC${sign}${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    }

    function dayPeriod(hour) {
      if (hour >= 6 && hour < 18) return { icon: '☀️', label: '白天', cls: 'wtime-period-day' };
      if (hour >= 18 && hour < 21) return { icon: '🌆', label: '傍晚', cls: 'wtime-period-dusk' };
      return { icon: '🌙', label: '夜晚', cls: 'wtime-period-night' };
    }

    function countryLabel(item) {
      const base = item.countryZh || item.countryEn;
      return item.tzLabel ? `${base}（${item.tzLabel}）` : base;
    }

    function itemHaystack(item) {
      return [
        item.countryZh,
        item.countryEn,
        item.capital,
        item.tz,
        item.tzAbbr,
        item.tzName,
        item.tzLabel,
        item.iso2,
        item.iso3,
        item.region,
      ].join(' ').toLowerCase();
    }

    const localClock = UI.el('div', { className: 'wtime-clock wtime-clock-local' });
    const utcClock = UI.el('div', { className: 'wtime-clock wtime-clock-utc' });
    const nowPanel = UI.el('dl', { className: 'wtime-now-grid' });
    const countEl = UI.el('p', { className: 'text-muted small wtime-count' }, '');
    const tbody = UI.el('tbody');
    const tableWrap = UI.el('div', { className: 'table-responsive wtime-table-wrap' }, [
      UI.el('table', { className: 'table table-sm table-hover wtime-table' }, [
        UI.el('thead', {}, UI.el('tr', {}, [
          UI.el('th', { scope: 'col', className: 'wtime-col-rank' }, '#'),
          UI.el('th', { scope: 'col', className: 'wtime-col-period' }, '晝夜'),
          UI.el('th', { scope: 'col' }, '國家／地區'),
          UI.el('th', { scope: 'col', className: 'wtime-col-iana' }, 'IANA 時區'),
          UI.el('th', { scope: 'col', className: 'wtime-col-utc' }, 'UTC 偏移'),
          UI.el('th', { scope: 'col', className: 'wtime-col-time' }, '當地時間'),
          UI.el('th', { scope: 'col', className: 'wtime-col-date' }, '日期'),
        ])),
        tbody,
      ]),
    ]);

    const searchInput = UI.el('input', {
      type: 'search',
      className: 'form-control wtime-search',
      placeholder: '搜尋國家、城市、IANA 時區或 UTC…',
    });

    let filter = '';
    let rowEls = [];
    let nowCells = {};

    function buildNowPanel() {
      const rows = [
        ['time', '時間'],
        ['gregorian', '新曆'],
        ['weekday', '今天'],
        ['lunar', '農曆'],
        ['yearLine', '今年'],
        ['zodiac', '生肖'],
        ['shichen', '時辰'],
        ['solarTerm', '節氣'],
      ];
      nowPanel.replaceChildren(...rows.map(([key, label]) => {
        const dd = UI.el('dd', { className: 'wtime-now-value' }, '—');
        nowCells[key] = dd;
        return UI.el('div', { className: 'wtime-now-row' }, [
          UI.el('dt', { className: 'wtime-now-label' }, `${label}：`),
          dd,
        ]);
      }));
    }

    function updateNowPanel(date) {
      const cal = window.WA_CHINESE_CALENDAR;
      if (!cal?.formatNowInfo) {
        Object.values(nowCells).forEach((el) => { el.textContent = '—'; });
        return;
      }
      const info = cal.formatNowInfo(date);
      Object.entries(nowCells).forEach(([key, el]) => {
        el.textContent = info[key] || '—';
        el.classList.toggle('wtime-now-time', key === 'time');
      });
    }

    function buildRows() {
      const q = filter.trim().toLowerCase();
      const list = q ? items.filter((item) => itemHaystack(item).includes(q)) : items;
      tbody.replaceChildren();
      rowEls = list.map((item) => {
        const tr = UI.el('tr', { className: 'wtime-row', 'data-tz': item.tz });
        tr._item = item;
        tr.appendChild(UI.el('td', { className: 'wtime-rank text-muted' }, '—'));
        tr.appendChild(UI.el('td', { className: 'wtime-period' }, ''));
        tr.appendChild(UI.el('td', { className: 'wtime-country' }, ''));
        tr.appendChild(UI.el('td', { className: 'wtime-iana' }, ''));
        tr.appendChild(UI.el('td', { className: 'wtime-utc' }, ''));
        tr.appendChild(UI.el('td', { className: 'wtime-time' }, ''));
        tr.appendChild(UI.el('td', { className: 'wtime-date text-muted' }, ''));
        tbody.appendChild(tr);
        return tr;
      });
      countEl.textContent = q
        ? `顯示 ${list.length} / ${items.length} 個時區`
        : `共 ${items.length} 個國家／地區時區（含多時區國家）`;
    }

    function tick() {
      const now = new Date();
      updateNowPanel(now);
      const localTz = Intl.DateTimeFormat().resolvedOptions().timeZone || '本地';
      localClock.replaceChildren(
        UI.el('span', { className: 'wtime-clock-label' }, `您的位置 · ${localTz}`),
        UI.el('strong', { className: 'wtime-clock-value' }, now.toLocaleTimeString('zh-TW', { hour12: false })),
        UI.el('span', { className: 'wtime-clock-date text-muted' }, now.toLocaleDateString('zh-TW', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }))
      );
      utcClock.replaceChildren(
        UI.el('span', { className: 'wtime-clock-label' }, '協調世界時 UTC'),
        UI.el('strong', { className: 'wtime-clock-value' }, now.toLocaleTimeString('zh-TW', { timeZone: 'UTC', hour12: false })),
        UI.el('span', { className: 'wtime-clock-date text-muted' }, now.toLocaleDateString('zh-TW', { timeZone: 'UTC', weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }))
      );

      const computed = rowEls.map((tr) => {
        const item = tr._item;
        const p = tzParts(now, item.tz);
        const off = offsetMinutes(now, item.tz);
        const period = dayPeriod(p.hour);
        const timeStr = now.toLocaleTimeString('zh-TW', {
          timeZone: item.tz,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        });
        const dateStr = now.toLocaleDateString('zh-TW', {
          timeZone: item.tz,
          month: 'short',
          day: 'numeric',
          weekday: 'short',
        });
        return { tr, off, period, timeStr, dateStr, item };
      });

      computed.sort((a, b) => b.off - a.off || a.item.countryZh.localeCompare(b.item.countryZh, 'zh-Hant'));

      let lastOff = null;
      computed.forEach(({ tr, off, period, timeStr, dateStr, item }, idx) => {
        tr.querySelector('.wtime-rank').textContent = String(idx + 1);
        const periodCell = tr.querySelector('.wtime-period');
        periodCell.className = `wtime-period ${period.cls}`;
        periodCell.title = period.label;
        periodCell.textContent = period.icon;
        const countryCell = tr.querySelector('.wtime-country');
        const countryKids = [];
        if (item.emoji) countryKids.push(UI.el('span', { className: 'wtime-flag', 'aria-hidden': 'true' }, item.emoji));
        countryKids.push(UI.el('span', { className: 'wtime-country-name' }, countryLabel(item)));
        if (item.capital) {
          countryKids.push(UI.el('span', { className: 'wtime-capital text-muted' }, item.capital));
        }
        countryCell.replaceChildren(...countryKids);
        tr.querySelector('.wtime-iana').textContent = item.tz;
        const utcCell = tr.querySelector('.wtime-utc');
        const offStr = formatOffset(off);
        utcCell.textContent = offStr;
        utcCell.title = item.tzAbbr ? `${item.tzAbbr} · ${item.tzName || ''}` : (item.tzName || '');
        tr.querySelector('.wtime-time').textContent = timeStr;
        tr.querySelector('.wtime-date').textContent = dateStr;
        tr.dataset.offset = String(off);
        if (lastOff !== null && off !== lastOff) tr.classList.add('wtime-row-band');
        else tr.classList.remove('wtime-row-band');
        lastOff = off;
      });
      computed.forEach(({ tr }) => tbody.appendChild(tr));
    }

    searchInput.addEventListener('input', () => {
      filter = searchInput.value;
      buildRows();
      tick();
    });

    buildNowPanel();
    buildRows();
    tick();
    const timer = setInterval(tick, 1000);
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => clearInterval(timer), { once: true });
    }

    app.className = 'tool-app wtime-app';
    app.replaceChildren(UI.el('div', { className: 'tool-form-inner wtime-inner' }, [
      UI.el('p', { className: 'text-muted wtime-intro' }, DATA.intro),
      UI.el('ul', { className: 'tool-checklist text-muted small wtime-checklist' }, [
        UI.el('li', {}, '排序：UTC 偏移由大到小（最快 → 最慢），即從 UTC+14 到 UTC−12。'),
        UI.el('li', {}, '☀️ 白天 06:00–17:59 · 🌆 傍晚 18:00–20:59 · 🌙 夜晚 21:00–05:59（依當地時間）。'),
        UI.el('li', {}, 'IANA 欄位供工程師對照 API／資料庫時區名稱；夏令時間自動反映。'),
      ]),
      UI.el('div', { className: 'wtime-now-panel tool-panel-card' }, [
        UI.el('h3', { className: 'wtime-now-title' }, '本地完整曆法'),
        nowPanel,
      ]),
      UI.el('div', { className: 'wtime-clocks tool-panel-card' }, [localClock, utcClock]),
      countEl,
      UI.el('div', { className: 'tool-field wtime-filter' }, searchInput),
      tableWrap,
    ]));
  };

  R['calendar'] = function (app) {
    const ENGINE = window.WA_CALENDAR_ENGINE;
    const HOLIDAYS = window.WA_CALENDAR_HOLIDAYS || {};
    const GLOSSARY = window.WA_CALENDAR_GLOSSARY;
    const TIPS = window.WA_CALENDAR_TIPS || {};
    const CHINESE = window.WA_CHINESE_CALENDAR;

    if (!ENGINE?.buildMonth) {
      mount(app, [UI.panel('萬年曆', UI.el('p', { className: 'text-muted' }, '曆法引擎載入失敗，請重新整理。'))]);
      return;
    }

    const now = new Date();
    let viewYear = now.getFullYear();
    let viewMonth = now.getMonth() + 1;
    let selectedDay = now.getDate();
    let region = 'tw';

    const intro = UI.el('div', { className: 'cal-intro' }, ENGINE.INTRO.map((p) => UI.el('p', { className: 'text-muted' }, p)));
    const clockPanel = UI.el('div', { className: 'cal-clock-panel' });
    const monthTitle = UI.el('h3', { className: 'cal-month-title' }, '');
    const grid = UI.el('div', { className: 'cal-grid', role: 'grid' });
    const detail = UI.el('div', { className: 'cal-detail tool-panel-card' });
    const glossaryWrap = UI.el('div', { className: 'cal-glossary' });

    const yearInput = UI.el('input', {
      type: 'number',
      className: 'form-control cal-year-input',
      min: 1900,
      max: 2099,
      value: String(viewYear),
    });
    const monthSelect = UI.el('select', { className: 'form-select cal-month-select' });
    for (let m = 1; m <= 12; m++) {
      monthSelect.appendChild(UI.el('option', { value: String(m) }, `${m} 月`));
    }
    monthSelect.value = String(viewMonth);

    const regionSelect = UI.el('select', { className: 'form-select cal-region-select' });
    Object.entries(HOLIDAYS).forEach(([id, r]) => {
      regionSelect.appendChild(UI.el('option', { value: id }, r.name));
    });
    regionSelect.value = region;

    function pad2(n) { return String(n).padStart(2, '0'); }

    function regionHoliday(y, m, d) {
      const key = `${pad2(m)}-${pad2(d)}`;
      return HOLIDAYS[region]?.fixed?.[key] || '';
    }

    function dayInfo() {
      return ENGINE.getDay(viewYear, viewMonth, selectedDay);
    }

    function updateClock() {
      if (!CHINESE?.formatNowInfo) {
        clockPanel.replaceChildren(UI.el('p', { className: 'text-muted small' }, '時鐘模組未載入'));
        return;
      }
      const info = CHINESE.formatNowInfo(new Date());
      clockPanel.replaceChildren(
        UI.el('div', { className: 'cal-clock-time' }, info.time),
        UI.el('dl', { className: 'cal-clock-grid' }, [
          ['gregorian', '新曆'], ['weekday', '今天'], ['lunar', '農曆'],
          ['yearLine', '今年'], ['zodiac', '生肖'], ['shichen', '時辰'], ['solarTerm', '節氣'],
        ].flatMap(([key, label]) => [
          UI.el('dt', {}, `${label}`),
          UI.el('dd', {}, info[key] || '—'),
        ])),
      );
    }

    function renderGlossary() {
      if (!GLOSSARY?.sections?.length) {
        glossaryWrap.replaceChildren();
        return;
      }
      glossaryWrap.replaceChildren(
        UI.el('h3', { className: 'cal-section-title' }, '曆法小辭典'),
        ...GLOSSARY.sections.map((sec) => UI.el('details', { className: 'cal-gloss-group' }, [
          UI.el('summary', { className: 'cal-gloss-title' }, sec.title),
          UI.el('ul', { className: 'cal-gloss-list' }, sec.items.map((item) =>
            UI.el('li', {}, [
              UI.el('strong', {}, `${item.k}：`),
              document.createTextNode(item.v),
            ]))),
        ])),
      );
    }

    function renderDetail() {
      const d = dayInfo();
      if (!d) {
        detail.replaceChildren(UI.el('p', { className: 'text-muted' }, '請選擇日期'));
        return;
      }
      const hol = regionHoliday(d.solarYear, d.solarMonth, d.solarDay);
      const tip = TIPS[d.jianchu] || '順應天時，亦需順應己心；宜忌僅供文化參考。';
      const lunarLine = `${d.isLeap ? '閏' : ''}${d.lunarMonthLabel}月${d.lunarDayLabel}${d.monthSize ? `（${d.monthSize}）` : ''}`;

      function row(label, value, cls) {
        if (!value) return null;
        return UI.el('div', { className: `cal-detail-row ${cls || ''}` }, [
          UI.el('span', { className: 'cal-detail-label' }, label),
          UI.el('span', { className: 'cal-detail-value' }, value),
        ]);
      }

      detail.replaceChildren(
        UI.el('div', { className: 'cal-detail-head' }, [
          UI.el('p', { className: 'cal-detail-solar' }, [
            UI.el('span', { className: 'cal-detail-daynum' }, String(d.solarDay)),
            UI.el('span', { className: 'cal-detail-ym' }, `${d.solarYear} 年 ${d.solarMonth} 月 · 星期${d.weekday}`),
          ]),
          UI.el('p', { className: 'cal-detail-lunar' }, `農曆 ${d.ganzhiYear}年 ${lunarLine}`),
          d.festival || hol
            ? UI.el('p', { className: 'cal-detail-festival' }, [d.festival, hol].filter(Boolean).join(' · '))
            : null,
        ]),
        UI.el('blockquote', { className: 'cal-tip' }, tip),
        UI.el('div', { className: 'cal-detail-body' }, [
          row('干支', `${d.ganzhiYear}年 ${d.ganzhiMonth}月 ${d.ganzhiDay}日`),
          row('建除', d.jianchu),
          row('值日', d.zhiri),
          row('宜', d.yi, 'cal-yi'),
          row('忌', d.ji, 'cal-ji'),
          row('彭祖百忌', d.pengzu),
          row('沖煞', d.chong),
          row('五行', `${d.wuxing}${d.wuxingShort ? `（${d.wuxingShort}）` : ''}`),
          row('吉凶神', d.jixiong),
          row('物候', d.wuhou),
          row('神位', d.gods),
          row('命祿', d.minglu),
          row('時辰', d.shichen),
          row('月相', d.moonPhase),
          row('六曜', d.rokuyou),
        ].filter(Boolean)),
        UI.el('p', { className: 'cal-disclaimer text-muted small' }, '黃曆宜忌源自傳統曆法，僅供文化與趣味參考，不作為唯一決策依據。'),
      );
    }

    function renderGrid() {
      const monthData = ENGINE.buildMonth(viewYear, viewMonth);
      monthTitle.textContent = `${viewYear} 年 ${viewMonth} 月`;
      yearInput.value = String(viewYear);
      monthSelect.value = String(viewMonth);

      const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
      grid.replaceChildren(
        ...weekdays.map((w, idx) => UI.el('div', {
          className: `cal-dow ${idx === 0 || idx === 6 ? 'is-weekend' : ''}`,
          role: 'columnheader',
        }, w)),
      );

      for (let i = 0; i < monthData.firstWeekday; i++) {
        grid.appendChild(UI.el('div', { className: 'cal-cell cal-cell-empty', 'aria-hidden': 'true' }));
      }

      monthData.days.forEach((d) => {
        const hol = regionHoliday(d.solarYear, d.solarMonth, d.solarDay);
        const badge = d.festival || hol;
        const isSelected = d.solarDay === selectedDay;
        const isToday = d.isToday;
        const btn = UI.el('button', {
          type: 'button',
          className: [
            'cal-cell',
            'cal-cell-day',
            isSelected ? 'is-selected' : '',
            isToday ? 'is-today' : '',
            d.solarTerm ? 'has-term' : '',
            badge ? 'has-festival' : '',
          ].filter(Boolean).join(' '),
          'aria-label': `${d.solarMonth}月${d.solarDay}日 農曆${d.lunarDayLabel}`,
          onClick: () => {
            selectedDay = d.solarDay;
            renderGrid();
            renderDetail();
          },
        }, [
          UI.el('span', { className: 'cal-solar' }, String(d.solarDay)),
          UI.el('span', { className: 'cal-lunar' }, d.lunarDay === 1
            ? `${d.isLeap ? '閏' : ''}${d.lunarMonthLabel}月`
            : d.lunarDayLabel),
          badge ? UI.el('span', { className: 'cal-badge', title: badge }, '節') : null,
          d.solarTerm ? UI.el('span', { className: 'cal-term-dot', title: d.solarTerm }) : null,
        ]);
        grid.appendChild(btn);
      });

      renderDetail();
    }

    function goToday() {
      const t = new Date();
      viewYear = t.getFullYear();
      viewMonth = t.getMonth() + 1;
      selectedDay = t.getDate();
      renderGrid();
    }

    function shiftMonth(delta) {
      viewMonth += delta;
      if (viewMonth < 1) { viewMonth = 12; viewYear -= 1; }
      if (viewMonth > 12) { viewMonth = 1; viewYear += 1; }
      selectedDay = 1;
      renderGrid();
    }

    yearInput.addEventListener('change', () => {
      viewYear = Math.min(2099, Math.max(1900, Number(yearInput.value) || viewYear));
      renderGrid();
    });
    monthSelect.addEventListener('change', () => {
      viewMonth = Number(monthSelect.value) || viewMonth;
      selectedDay = 1;
      renderGrid();
    });
    regionSelect.addEventListener('change', () => {
      region = regionSelect.value;
      renderGrid();
    });

    const toolbar = UI.el('div', { className: 'cal-toolbar tool-panel-card' }, [
      UI.el('div', { className: 'row g-2 align-items-end' }, [
        UI.el('div', { className: 'col-6 col-md-2' }, [
          UI.el('label', { className: 'form-label tool-label' }, '年份'),
          yearInput,
        ]),
        UI.el('div', { className: 'col-6 col-md-2' }, [
          UI.el('label', { className: 'form-label tool-label' }, '月份'),
          monthSelect,
        ]),
        UI.el('div', { className: 'col-12 col-md-3' }, [
          UI.el('label', { className: 'form-label tool-label' }, '參考假日'),
          regionSelect,
        ]),
        UI.el('div', { className: 'col-12 col-md-5' }, [
          UI.el('div', { className: 'cal-nav-btns tool-btn-row' }, [
            UI.btn('◀ 上月', 'btn btn-outline-secondary btn-sm', () => shiftMonth(-1)),
            UI.btn('今天', 'btn btn-primary btn-sm', goToday),
            UI.btn('下月 ▶', 'btn btn-outline-secondary btn-sm', () => shiftMonth(1)),
          ]),
        ]),
      ]),
    ]);

    renderGlossary();
    updateClock();
    renderGrid();
    const timer = setInterval(updateClock, 1000);
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => clearInterval(timer), { once: true });
    }

    app.className = 'tool-app cal-app';
    app.replaceChildren(UI.el('div', { className: 'cal-app-inner' }, [
      intro,
      UI.el('div', { className: 'cal-clock tool-panel-card' }, [
        UI.el('h3', { className: 'cal-section-title' }, '此刻'),
        clockPanel,
      ]),
      toolbar,
      UI.el('div', { className: 'cal-main' }, [
        UI.el('div', { className: 'cal-month tool-panel-card' }, [
          monthTitle,
          grid,
        ]),
        detail,
      ]),
      glossaryWrap,
    ]));
  };

  R['solar-terms'] = function (app) {
    const DATA = window.WA_SOLAR_TERMS;
    const CC = window.WA_CHINESE_CALENDAR;
    const terms = DATA?.terms || [];
    if (!terms.length) {
      mount(app, [UI.panel('二十四節氣', UI.el('p', { className: 'text-muted' }, '資料載入失敗，請重新整理。'))]);
      return;
    }

    const SEASON_CLASS = { 春: 'spring', 夏: 'summer', 秋: 'autumn', 冬: 'winter' };
    const now = new Date();
    const year = now.getFullYear();
    const termDates = CC?.buildTermDates ? CC.buildTermDates(year) : [];
    const dateByName = Object.fromEntries(termDates.map((t) => [t.name, t.at]));

    function formatTermDate(name) {
      const d = dateByName[name];
      if (!d) return '';
      return `${d.getMonth() + 1}月${d.getDate()}日`;
    }

    function currentTermName() {
      const label = CC?.solarTermLabel ? CC.solarTermLabel(now) : '';
      return label.replace(/後$/, '');
    }

    const activeName = currentTermName();
    let seasonFilter = '全部';
    let search = '';
    let expandedId = terms.find((t) => t.nameZh === activeName)?.id || terms[0].id;

    const nowBanner = UI.el('div', { className: 'sterm-now tool-panel-card' });
    const grid = UI.el('div', { className: 'sterm-grid' });
    const countEl = UI.el('p', { className: 'text-muted small sterm-count' }, '');
    const detailHost = UI.el('div', { className: 'sterm-detail-host' });
    const nav = UI.el('nav', { className: 'sterm-nav', 'aria-label': '節氣季節' });

    const searchInput = UI.el('input', {
      type: 'search',
      className: 'form-control sterm-search',
      placeholder: '搜尋節氣、習俗、諺語…',
    });

    function sectionBlock(title, text) {
      if (!text) return null;
      return UI.el('div', { className: 'sterm-section' }, [
        UI.el('h5', { className: 'sterm-section-title' }, title),
        UI.el('p', { className: 'sterm-section-text' }, text),
      ]);
    }

    function proverbList(items) {
      if (!items?.length) return null;
      return UI.el('div', { className: 'sterm-section' }, [
        UI.el('h5', { className: 'sterm-section-title' }, '諺語'),
        UI.el('ul', { className: 'sterm-proverb-list' }, items.map((p) => {
          const line = p.meaning ? `${p.saying}：${p.meaning}` : p.saying;
          return UI.el('li', {}, line);
        })),
      ]);
    }

    function renderDetail(term) {
      if (!term) {
        detailHost.replaceChildren();
        return;
      }
      detailHost.replaceChildren(UI.el('article', {
        className: `sterm-detail tool-panel-card sterm-season-${SEASON_CLASS[term.season] || ''}`,
        id: `sterm-${term.id}`,
      }, [
        UI.el('div', { className: 'sterm-detail-hero' }, [
          UI.el('img', {
            className: 'sterm-detail-img',
            src: term.image || term.thumb,
            alt: term.imageTitle || term.nameZh,
            loading: 'lazy',
          }),
          UI.el('div', { className: 'sterm-detail-head' }, [
            UI.el('div', { className: 'sterm-detail-badges' }, [
              UI.el('span', { className: `sterm-season-badge sterm-season-${SEASON_CLASS[term.season]}` }, term.season),
              term.category ? UI.el('span', { className: 'sterm-cat-badge' }, term.category) : null,
              term.huangjing != null ? UI.el('span', { className: 'sterm-hj-badge' }, `黃經 ${term.huangjing}°`) : null,
            ]),
            UI.el('h3', { className: 'sterm-detail-title' }, [
              term.nameZh,
              UI.el('span', { className: 'sterm-detail-en' }, term.nameEn),
            ]),
            UI.el('p', { className: 'sterm-detail-date' }, [
              `約 ${term.dateApprox}`,
              formatTermDate(term.nameZh) ? ` · ${year} 年約 ${formatTermDate(term.nameZh)}` : '',
            ]),
            UI.el('p', { className: 'sterm-detail-intro' }, term.intro || term.summary),
          ]),
        ]),
        term.wawaTip ? UI.el('blockquote', { className: 'sterm-tip' }, [
          UI.el('strong', {}, 'WaWa 小提示'),
          UI.el('span', {}, term.wawaTip),
        ]) : null,
        UI.el('div', { className: 'sterm-detail-body' }, [
          sectionBlock('節氣解說', term.meaning || term.summary),
          sectionBlock('民俗習慣', term.customs),
          sectionBlock('養生保健', term.health),
          proverbList(term.proverbs),
        ].filter(Boolean)),
      ]));
    }

    function termHaystack(t) {
      return [
        t.nameZh, t.nameEn, t.season, t.category, t.intro, t.summary,
        t.meaning, t.customs, t.health, t.wawaTip,
        ...(t.proverbs || []).flatMap((p) => [p.saying, p.meaning]),
      ].join(' ').toLowerCase();
    }

    function renderNow() {
      const active = terms.find((t) => t.nameZh === activeName);
      const nextIdx = terms.findIndex((t) => t.nameZh === activeName);
      const next = nextIdx >= 0 ? terms[(nextIdx + 1) % terms.length] : null;
      nowBanner.replaceChildren([
        UI.el('div', { className: 'sterm-now-text' }, [
          UI.el('p', { className: 'sterm-now-label' }, '今日節氣'),
          UI.el('p', { className: 'sterm-now-value' }, active
            ? `${active.nameZh}${CC?.solarTermLabel && CC.solarTermLabel(now).endsWith('後') ? '後' : ''}`
            : (CC?.solarTermLabel ? CC.solarTermLabel(now) : '—')),
          UI.el('p', { className: 'text-muted small sterm-now-sub' }, active
            ? `${year} 年 ${formatTermDate(active.nameZh) || active.dateApprox}${next ? ` · 下一節氣 ${next.nameZh}` : ''}`
            : ''),
        ]),
        active?.thumb ? UI.el('img', {
          className: 'sterm-now-thumb',
          src: active.thumb,
          alt: active.nameZh,
          loading: 'lazy',
        }) : null,
      ]);
    }

    function renderGrid() {
      const q = search.trim().toLowerCase();
      const filtered = terms.filter((t) => {
        if (seasonFilter !== '全部' && t.season !== seasonFilter) return false;
        if (q && !termHaystack(t).includes(q)) return false;
        return true;
      });

      countEl.textContent = q || seasonFilter !== '全部'
        ? `顯示 ${filtered.length} / ${terms.length} 個節氣`
        : `共 ${terms.length} 個節氣 · 資料更新 ${DATA.updated || ''}`;

      grid.replaceChildren(...filtered.map((t) => {
        const isActive = t.nameZh === activeName;
        const isOpen = t.id === expandedId;
        return UI.el('button', {
          type: 'button',
          className: [
            'sterm-card',
            `sterm-season-${SEASON_CLASS[t.season]}`,
            isActive ? 'is-current' : '',
            isOpen ? 'is-open' : '',
          ].filter(Boolean).join(' '),
          onClick: () => {
            expandedId = t.id;
            renderGrid();
            renderDetail(t);
            const el = document.getElementById(`sterm-${t.id}`);
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          },
        }, [
          UI.el('img', {
            className: 'sterm-card-thumb',
            src: t.thumb || t.image,
            alt: t.nameZh,
            loading: 'lazy',
          }),
          UI.el('span', { className: 'sterm-card-name' }, t.nameZh),
          UI.el('span', { className: 'sterm-card-en' }, t.nameEn),
          UI.el('span', { className: 'sterm-card-date' }, formatTermDate(t.nameZh) || t.dateApprox.replace(/^(\d)/, '約 $1')),
          isActive ? UI.el('span', { className: 'sterm-card-now' }, '現在') : null,
        ]);
      }));

      if (!filtered.length) {
        grid.appendChild(UI.el('p', { className: 'text-muted small sterm-empty' }, '找不到符合的節氣，請換個關鍵字或季節。'));
      }

      const openTerm = filtered.find((t) => t.id === expandedId) || filtered[0];
      if (openTerm && expandedId !== openTerm.id) expandedId = openTerm.id;
      renderDetail(openTerm);
    }

    ['全部', '春', '夏', '秋', '冬'].forEach((label) => {
      const btn = UI.el('button', {
        type: 'button',
        className: `sterm-nav-link${seasonFilter === label ? ' is-active' : ''}`,
        onClick: () => {
          seasonFilter = label;
          nav.querySelectorAll('.sterm-nav-link').forEach((el) => {
            el.classList.toggle('is-active', el.textContent === label);
          });
          renderGrid();
        },
      }, label);
      nav.appendChild(btn);
    });

    searchInput.addEventListener('input', () => {
      search = searchInput.value;
      renderGrid();
    });

    const glossary = DATA.glossary || {};
    const catList = UI.el('div', { className: 'sterm-categories' }, (glossary.categories || []).map((c) => (
      UI.el('div', { className: 'sterm-cat-item' }, [
        UI.el('strong', {}, c.label),
        UI.el('span', {}, c.desc),
      ])
    )));

    renderNow();
    renderGrid();

    app.className = 'tool-app sterm-app';
    app.replaceChildren(UI.el('div', { className: 'tool-form-inner sterm-app-inner' }, [
      UI.el('p', { className: 'text-muted sterm-intro' }, DATA.intro),
      UI.el('div', { className: 'sterm-overview tool-panel-card' }, [
        UI.el('img', {
          className: 'sterm-overview-img',
          src: DATA.overviewImage,
          alt: '二十四節氣概覽',
          loading: 'lazy',
        }),
        UI.el('div', { className: 'sterm-overview-text' }, [
          UI.el('p', { className: 'sterm-poem' }, glossary.poem),
          UI.el('p', { className: 'text-muted small' }, glossary.poemNote),
          UI.el('p', {}, glossary.about),
        ]),
      ]),
      nowBanner,
      UI.el('div', { className: 'tool-field sterm-filter' }, searchInput),
      nav,
      countEl,
      grid,
      detailHost,
      UI.el('div', { className: 'sterm-glossary tool-panel-card' }, [
        UI.el('h4', { className: 'sterm-glossary-title' }, '節氣分類'),
        catList,
        UI.el('h4', { className: 'sterm-glossary-title' }, '四季劃分'),
        UI.el('div', { className: 'sterm-season-notes' }, (glossary.seasons || []).map((s) => (
          UI.el('p', { className: 'sterm-season-note' }, [
            UI.el('strong', {}, `${s.id}（${s.months}）`),
            ` ${s.note}`,
          ])
        ))),
      ]),
      UI.el('p', { className: 'text-muted small sterm-source' }, '節氣圖文參考 ifreesite 二十四節氣，並加入 Kawatool 生活化整理；精確交節時刻請以天文曆法為準。'),
    ]));
  };

  R['currency'] = function (app) {
    const DATA = window.WA_CURRENCY;
    const regions = DATA?.regions || [];
    if (!regions.length) {
      mount(app, [UI.panel('全球貨幣', UI.el('p', { className: 'text-muted' }, '資料載入失敗，請重新整理。'))]);
      return;
    }

    const allItems = regions.flatMap((r) => r.items.map((item) => ({ ...item, regionId: r.id, regionLabel: r.label })));
    const currencyCodes = [...new Set(allItems.map((i) => i.code))].sort();
    const CURRENCY_ZH_LOCAL = {};
    allItems.forEach((i) => { CURRENCY_ZH_LOCAL[i.code] = i.currencyZh; });

    // Obsolete ISO codes still shown in source data; API uses successor codes.
    // ratio = obsolete units per 1 successor unit (e.g. 10 MRO = 1 MRU).
    const OBSOLETE_CURRENCY = {
      MRO: { api: 'MRU', ratio: 10 },
      STD: { api: 'STN', ratio: 1000 },
      ZMK: { api: 'ZMW', ratio: 1000 },
      BYR: { api: 'BYN', ratio: 10000 },
    };

    function apiCode(code) {
      return OBSOLETE_CURRENCY[code]?.api || code;
    }

    function rateBetween(base, target, rateTable) {
      if (base === target) return 1;
      const targetApi = apiCode(target);
      const targetRatio = OBSOLETE_CURRENCY[target]?.ratio || 1;
      const baseRatio = OBSOLETE_CURRENCY[base]?.ratio || 1;
      const raw = rateTable[targetApi];
      if (raw == null || !Number.isFinite(raw)) return null;
      return (raw / baseRatio) * targetRatio;
    }

    let baseCode = 'TWD';
    if (!currencyCodes.includes(baseCode)) baseCode = 'USD';
    let rates = {};
    let rateDate = '';
    let rateError = '';
    let rateLoading = false;

    const rateStatus = UI.el('p', { className: 'curr-rate-status text-muted small' }, '匯率載入中…');
    const countEl = UI.el('p', { className: 'curr-count text-muted small' }, '');
    const gridWrap = UI.el('div', { className: 'curr-sections' });
    const nav = UI.el('nav', { className: 'curr-nav', 'aria-label': '貨幣大洲' });

    const baseSelect = UI.el('select', { className: 'form-select curr-base-select', id: 'curr-base' });
    currencyCodes.forEach((code) => {
      const opt = UI.el('option', { value: code }, `${CURRENCY_ZH_LOCAL[code] || code} (${code})`);
      baseSelect.appendChild(opt);
    });
    DATA.baseSuggestions.forEach((code) => {
      const opt = baseSelect.querySelector(`option[value="${code}"]`);
      if (opt) opt.textContent = `${CURRENCY_ZH_LOCAL[code] || code} (${code}) ★`;
    });
    baseSelect.value = baseCode;

    const searchInput = UI.el('input', {
      type: 'search',
      className: 'form-control curr-search',
      placeholder: '搜尋國家、貨幣名稱、代碼或符號…',
    });

    function formatRate(num) {
      if (num == null || !Number.isFinite(num)) return '—';
      if (num >= 100) return num.toFixed(2);
      if (num >= 1) return num.toFixed(4);
      if (num >= 0.01) return num.toFixed(4);
      return num.toPrecision(4);
    }

    function rateLabel(item) {
      if (item.code === baseCode) return '基準貨幣';
      const r = rateBetween(baseCode, item.code, rates);
      if (r == null) return '無匯率資料';
      return `1 ${baseCode} = ${formatRate(r)} ${item.code}`;
    }

    function itemHaystack(item) {
      return [
        item.countryLabel,
        item.countryShort,
        item.countryEn,
        item.currencyZh,
        item.currencyEn,
        item.symbol,
        item.code,
        item.subunit,
        item.regionLabel,
      ].join(' ').toLowerCase();
    }

    function makeCard(item) {
      const flag = item.flag
        ? UI.el('img', {
          className: 'curr-card-flag',
          src: siteMediaUrl(item.flag),
          alt: `${item.countryShort} 國旗`,
          loading: 'lazy',
        })
        : UI.el('div', { className: 'curr-card-flag curr-card-flag-fallback', 'aria-hidden': 'true' }, item.code.slice(0, 2));

      const symEl = item.symbol
        ? UI.el('span', { className: 'curr-card-symbol', title: '貨幣符號' }, item.symbol)
        : null;

      return UI.el('article', {
        className: 'curr-card',
        dataset: { code: item.code, region: item.regionId },
      }, [
        UI.el('div', { className: 'curr-card-top' }, [flag, symEl]),
        UI.el('div', { className: 'curr-card-body' }, [
          UI.el('h4', { className: 'curr-card-country' }, item.countryShort),
          item.countryLabel !== item.countryShort
            ? UI.el('p', { className: 'curr-card-country-sub text-muted small' }, item.countryLabel)
            : null,
          UI.el('p', { className: 'curr-card-currency' }, [
            UI.el('strong', {}, item.currencyZh),
            item.currencyEn ? UI.el('span', { className: 'curr-card-currency-en' }, item.currencyEn) : null,
          ]),
          UI.el('div', { className: 'curr-card-meta' }, [
            UI.el('span', { className: 'curr-meta-code' }, item.code),
            item.subunit ? UI.el('span', { className: 'curr-meta-sub' }, `輔幣：${item.subunit}`) : null,
          ]),
          UI.el('p', { className: 'curr-card-rate', dataset: { code: item.code } }, rateLabel(item)),
        ]),
      ]);
    }

    function renderSections(query) {
      const q = query.trim().toLowerCase();
      gridWrap.replaceChildren();
      let shown = 0;

      regions.forEach((region) => {
        const items = region.items.filter((item) => !q || itemHaystack({ ...item, regionLabel: region.label }).includes(q));
        if (!items.length) return;
        shown += items.length;

        const section = UI.el('section', {
          className: 'curr-region',
          id: `curr-${region.id}`,
        }, [
          UI.el('h3', { className: 'curr-region-title' }, [
            region.label,
            UI.el('span', { className: 'curr-region-count' }, `${items.length}`),
          ]),
          UI.el('div', { className: 'curr-grid' }, items.map((item) => makeCard({ ...item, regionId: region.id, regionLabel: region.label }))),
        ]);
        gridWrap.appendChild(section);
      });

      countEl.textContent = q
        ? `顯示 ${shown} / ${allItems.length} 筆`
        : `共 ${allItems.length} 筆 · ${DATA.stats?.currencies || currencyCodes.length} 種貨幣代碼`;
    }

    function updateRateCells() {
      gridWrap.querySelectorAll('.curr-card-rate').forEach((el) => {
        const code = el.dataset.code;
        const item = { code };
        el.textContent = rateLabel(item);
        el.classList.toggle('is-base', code === baseCode);
        el.classList.toggle('is-unavailable', code !== baseCode && rateBetween(baseCode, code, rates) == null);
      });
    }

    async function fetchOpenErApi(code) {
      const res = await fetch(`https://open.er-api.com/v6/latest/${encodeURIComponent(code)}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (json.result !== 'success' || !json.rates) throw new Error(json['error-type'] || 'bad response');
      return {
        rates: json.rates,
        date: (json.time_last_update_utc || '').slice(0, 10),
        source: 'open.er-api.com',
      };
    }

    async function fetchFrankfurter(code) {
      const res = await fetch(`https://api.frankfurter.app/latest?from=${encodeURIComponent(code)}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (!json.rates || json.message) throw new Error(json.message || 'bad response');
      return {
        rates: { ...json.rates, [code]: 1 },
        date: json.date || '',
        source: 'frankfurter.app',
      };
    }

    async function fetchRates() {
      rateLoading = true;
      rateError = '';
      rateStatus.textContent = '匯率更新中…';
      const fetchBase = apiCode(baseCode);
      const aliasNote = fetchBase !== baseCode ? `（${baseCode} 以 ${fetchBase} 報價換算）` : '';
      try {
        let payload;
        try {
          payload = await fetchOpenErApi(fetchBase);
        } catch (primaryErr) {
          payload = await fetchFrankfurter(fetchBase);
          payload.fallback = String(primaryErr.message || primaryErr);
        }
        rates = payload.rates;
        rateDate = payload.date;
        const fallbackNote = payload.fallback ? ' · 備援來源' : '';
        rateStatus.textContent = rateDate
          ? `匯率基準：${baseCode}${aliasNote} · 更新 ${rateDate}（${payload.source}，僅供參考${fallbackNote}）`
          : `匯率基準：${baseCode}${aliasNote}（${payload.source}，僅供參考${fallbackNote}）`;
      } catch (err) {
        rateError = String(err.message || err);
        rates = {};
        rateStatus.textContent = `無法取得即時匯率（${rateError}），仍可查詢貨幣名稱與符號。`;
      } finally {
        rateLoading = false;
        updateRateCells();
      }
    }

    regions.forEach((region) => {
      nav.appendChild(UI.el('a', {
        href: `#curr-${region.id}`,
        className: 'curr-nav-link',
      }, region.label));
    });

    baseSelect.addEventListener('change', () => {
      baseCode = baseSelect.value;
      fetchRates();
    });

    searchInput.addEventListener('input', () => renderSections(searchInput.value));

    renderSections('');
    fetchRates();

    mount(app, [
      UI.el('div', { className: 'curr-app-inner' }, [
        DATA.intro ? UI.el('p', { className: 'curr-intro text-muted' }, DATA.intro) : null,
        UI.el('div', { className: 'curr-toolbar tool-panel-card' }, [
          UI.el('div', { className: 'row g-3 align-items-end' }, [
            UI.el('div', { className: 'col-md-4' }, [
              UI.el('label', { className: 'form-label tool-label', for: 'curr-base' }, '匯率基準貨幣'),
              baseSelect,
            ]),
            UI.el('div', { className: 'col-md-5' }, [
              UI.el('label', { className: 'form-label tool-label' }, '搜尋'),
              searchInput,
            ]),
            UI.el('div', { className: 'col-md-3' }, [
              UI.btn('更新匯率', 'btn btn-outline-primary w-100', () => fetchRates()),
            ]),
          ]),
          rateStatus,
          countEl,
        ]),
        nav,
        gridWrap,
        UI.el('p', { className: 'curr-disclaimer text-muted small' }, [
          '資料來源：',
          UI.el('a', { href: DATA.source, target: '_blank', rel: 'noopener noreferrer' }, 'ifreesite 世界貨幣'),
          ' · 匯率僅供參考，非所有貨幣皆有即時報價。',
        ]),
      ]),
    ]);
    app.className = 'tool-app curr-app';
  };

  R['postal'] = function (app) {
    mount(app, [UI.panel('國家代碼與郵編', UI.tableFrom([{"country":"臺灣","code":"TW","postal":"3+2 或 5 碼"},{"country":"日本","code":"JP","postal":"000-0000"},{"country":"美國","code":"US","postal":"ZIP 5/9"},{"country":"英國","code":"GB","postal":"字母+數字"}], [
      { key: 'country', label: '國家' }, { key: 'code', label: 'ISO' }, { key: 'postal', label: '郵編格式' },
    ]))]);
  };

  R['area-code'] = function (app) {
    mount(app, [UI.panel('國際電話區碼', UI.tableFrom([{"country":"臺灣","code":"+886"},{"country":"日本","code":"+81"},{"country":"美國","code":"+1"},{"country":"英國","code":"+44"},{"country":"中國","code":"+86"},{"country":"香港","code":"+852"}], [
      { key: 'country', label: '國家/地區' }, { key: 'code', label: '區碼' },
    ]))]);
  };

  R['voltage'] = function (app) {
    mount(app, [UI.panel('電壓與插頭', UI.tableFrom([{"country":"臺灣","v":"110V","plug":"A/C 型"},{"country":"日本","v":"100V","plug":"A/B 型"},{"country":"美國","v":"120V","plug":"A/B 型"},{"country":"英國","v":"230V","plug":"G 型"},{"country":"歐洲","v":"230V","plug":"C/F 型"}], [
      { key: 'country', label: '國家' }, { key: 'v', label: '電壓' }, { key: 'plug', label: '插頭' },
    ]))]);
  };

  R['kinship'] = function (app) {
    const rels = ['父', '母', '兄', '弟', '姊', '妹', '夫', '妻', '子', '女'];
    const chain = [];
    const out = UI.output('kin-out');
    const sel = UI.select('加入關係', 'kin-sel', rels);
    mount(app, [UI.panel('親戚計算機', [
      UI.el('p', {}, '依序選擇關係鏈，例如：父→兄→妻'),
      sel,
      UI.btnGroup([
        UI.btn('加入', 'btn btn-primary', () => { chain.push(document.getElementById('kin-sel').value); out.textContent = '稱謂鏈：' + chain.join(' → '); }),
        UI.btn('清除', 'btn btn-outline-secondary', () => { chain.length = 0; out.textContent = ''; }),
      ]),
      out,
      UI.el('p', { className: 'text-muted small' }, '精簡版僅顯示關係鏈；完整稱謂需複雜規則表。'),
    ])]);
  };

  R['parenting'] = function (app) {
    const out = UI.output('par-out');
    mount(app, [UI.panel('寶寶年齡', [
      UI.input('出生日期', 'par-bd', 'date', ''),
      UI.btn('計算', 'btn btn-primary', () => {
        const bd = new Date(document.getElementById('par-bd').value);
        if (isNaN(bd)) { out.textContent = '請選擇有效日期'; return; }
        const now = new Date();
        let months = (now.getFullYear() - bd.getFullYear()) * 12 + now.getMonth() - bd.getMonth();
        if (now.getDate() < bd.getDate()) months--;
        const years = Math.floor(months / 12);
        const rem = months % 12;
        const days = Math.floor((now - bd) / 86400000);
        out.textContent = '已 ' + days + ' 天 · 約 ' + years + ' 歲 ' + rem + ' 個月';
      }), out,
    ])]);
  };

  R['car-brand'] = function (app) {
    const data = window.WA_CAR_BRANDS;
    if (!data || !data.regions || !data.regions.length) {
      mount(app, [UI.panel('汽車品牌', UI.el('p', { className: 'text-muted' }, '品牌資料載入失敗，請重新整理頁面。'))]);
      return;
    }

    let selectedCard = null;

    function parseDescSections(desc) {
      if (!desc) return [];
      const sections = [];
      const re = /【([^】]+)】([^【]*)/g;
      let match;
      while ((match = re.exec(desc)) !== null) {
        const title = match[1].trim();
        const text = match[2].trim();
        if (text) sections.push({ title, text });
      }
      if (!sections.length && desc.trim()) {
        sections.push({ title: '說明', text: desc.trim() });
      }
      return sections;
    }

    function sectionBlock(title, text) {
      if (!text) return null;
      return UI.el('div', { className: 'wf-dock-section' }, [
        UI.el('h5', { className: 'wf-dock-section-title' }, title),
        UI.el('p', { className: 'world-flags-dock-desc' }, text),
      ]);
    }

    const detail = UI.el('div', { className: 'world-flags-dock', id: 'cb-detail', hidden: true }, [
      UI.el('p', { className: 'text-muted mb-0 world-flags-dock-hint' }, '點選車標可查看品牌介紹。'),
    ]);

    function setDockOpen(open) {
      detail.hidden = !open;
      detail.classList.toggle('is-visible', open);
      app.classList.toggle('world-flags-has-dock', open);
    }

    function renderTitle(brand) {
      const titleParts = [brand.nameZh];
      if (brand.tier) {
        titleParts.push(UI.el('span', { className: 'car-brand-tier-inline' }, brand.tier));
      }
      return UI.el('h4', { className: 'world-flags-dock-title' }, titleParts);
    }

    function renderNameLine(brand) {
      const parts = [];
      if (brand.nameEn && brand.nameEn !== brand.nameZh) {
        parts.push(UI.el('span', { className: 'world-flags-dock-en' }, brand.nameEn));
      }
      if (brand.group) {
        if (parts.length) parts.push(UI.el('span', { className: 'world-flags-dock-sep', 'aria-hidden': 'true' }, '·'));
        parts.push(UI.el('span', { className: 'world-flags-dock-native car-brand-dock-group' }, brand.group));
      }
      if (!parts.length) return null;
      return UI.el('p', { className: 'world-flags-dock-names' }, parts);
    }

    function showDetail(brand, cardEl) {
      if (selectedCard) selectedCard.classList.remove('is-selected');
      selectedCard = cardEl || null;
      if (selectedCard) selectedCard.classList.add('is-selected');

      detail.replaceChildren(
        UI.el('div', { className: 'world-flags-dock-inner' }, [
          UI.el('div', { className: 'world-flags-dock-head' }, [
            UI.bindImageZoom(UI.el('img', {
              className: 'world-flags-dock-img car-brand-dock-img',
              src: siteMediaUrl(brand.image),
              alt: brand.nameZh,
              loading: 'lazy',
            }), { caption: brand.nameZh }),
            UI.el('div', { className: 'world-flags-dock-head-text' }, [
              renderTitle(brand),
              renderNameLine(brand),
            ]),
            UI.el('button', {
              type: 'button',
              className: 'world-flags-dock-close',
              title: '收合',
              'aria-label': '收合詳情',
              onClick: () => {
                if (selectedCard) selectedCard.classList.remove('is-selected');
                selectedCard = null;
                setDockOpen(false);
              },
            }, '×'),
          ]),
          brand.desc
            ? UI.el('div', { className: 'world-flags-dock-body wf-dock-body' },
              parseDescSections(brand.desc).map((section) => sectionBlock(section.title, section.text))
            )
            : null,
        ])
      );
      const body = detail.querySelector('.world-flags-dock-body');
      if (body) body.scrollTop = 0;
      setDockOpen(true);
    }

    function makeCard(brand) {
      return UI.el('button', {
        type: 'button',
        className: 'world-flags-card car-brand-card',
        title: brand.nameZh,
        dataset: {
          nameZh: brand.nameZh,
          nameEn: brand.nameEn || '',
          tier: brand.tier || '',
          group: brand.group || '',
        },
        onClick: (e) => showDetail(brand, e.currentTarget),
      }, [
        UI.el('img', {
          className: 'world-flags-img car-brand-img',
          src: siteMediaUrl(brand.image),
          alt: brand.nameZh,
          loading: 'lazy',
          width: '72',
          height: '48',
        }),
        UI.el('span', { className: 'world-flags-name' }, brand.nameZh),
        brand.nameEn && brand.nameEn !== brand.nameZh
          ? UI.el('span', { className: 'world-flags-name-en' }, brand.nameEn)
          : null,
        brand.tier
          ? UI.el('span', { className: 'car-brand-tier' }, brand.tier)
          : null,
      ]);
    }

    const REGION_NAV_LABELS = {
      'vw-group': '福斯集團',
      'bmw-group': 'BMW 集團',
      'mercedes-group': '賓士集團',
      'toyota-group': '豐田集團',
      'renault-nissan': '日產聯盟',
      'honda-group': '本田集團',
      'japan-other': '日本其他',
      'ford-group': '福特集團',
      'gm-group': '通用汽車',
      stellantis: 'Stellantis',
      'hyundai-group': '現代集團',
      'jlr-tata': 'JLR／Tata',
      'geely-volvo': '吉利／Volvo',
      'independent-luxury': '獨立超跑',
      'usa-ev': '美國電動',
      'china-ev': '中國電動',
      'china-traditional': '中國傳統',
      taiwan: '臺灣',
      'asia-other': '亞洲其他',
      'europe-other': '歐洲其他',
    };

    function regionNavLabel(region) {
      const name = REGION_NAV_LABELS[region.id] || region.label;
      return `${name} (${region.brands.length})`;
    }

    function regionSectionId(regionId) {
      return `cb-region-${regionId}`;
    }

    function makeRegionSection(region) {
      const grid = UI.el('div', {
        className: 'world-flags-grid car-brand-grid car-brand-region-body',
        id: `cb-region-grid-${region.id}`,
        dataset: { regionId: region.id },
      }, region.brands.map(makeCard));

      const toggle = UI.el('button', {
        type: 'button',
        className: 'car-brand-region-toggle',
        'aria-expanded': 'true',
        'aria-controls': `cb-region-grid-${region.id}`,
      }, [
        UI.el('span', { className: 'car-brand-region-label' }, REGION_NAV_LABELS[region.id] || region.label),
        UI.el('span', { className: 'world-flags-region-count' }, `${region.brands.length}`),
        UI.el('i', { className: 'bi bi-chevron-down car-brand-region-chevron', 'aria-hidden': 'true' }),
      ]);

      toggle.addEventListener('click', () => {
        const collapsed = grid.classList.toggle('is-collapsed');
        toggle.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
      });

      return UI.el('section', {
        className: 'world-flags-region car-brand-region',
        id: regionSectionId(region.id),
        dataset: { regionId: region.id },
      }, [toggle, grid]);
    }

    const search = UI.el('input', {
      type: 'search',
      className: 'form-control tool-input world-flags-search',
      id: 'cb-search',
      placeholder: '搜尋品牌、集團名稱（中文或英文）…',
      autocomplete: 'off',
    });

    const nav = UI.el('div', { className: 'world-flags-nav car-brand-group-nav' }, data.regions.map((region) =>
      UI.el('a', {
        className: 'world-flags-nav-link',
        href: `#${regionSectionId(region.id)}`,
        'data-region-id': region.id,
      }, regionNavLabel(region))
    ));

    const searchMeta = UI.el('p', {
      className: 'text-muted world-flags-search-meta',
      id: 'cb-meta',
      hidden: true,
    }, '');

    const regionToggle = UI.el('button', {
      type: 'button',
      className: 'world-flags-region-toggle',
      id: 'cb-region-toggle',
      title: '選擇汽車集團',
      'aria-expanded': 'true',
      'aria-controls': 'cb-nav',
    }, '集團');

    const searchRow = UI.el('div', { className: 'world-flags-toolbar-row' }, [search, regionToggle]);

    const navWrap = UI.el('div', { className: 'world-flags-nav-wrap', id: 'cb-nav' }, [nav]);
    const toolbar = UI.el('div', {
      className: 'world-flags-toolbar car-brand-toolbar is-nav-open',
      id: 'cb-toolbar',
    }, [
      searchRow,
      searchMeta,
      navWrap,
    ]);

    function setNavOpen(open) {
      toolbar.classList.toggle('is-nav-open', open);
      regionToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    }

    regionToggle.addEventListener('click', () => {
      setNavOpen(!toolbar.classList.contains('is-nav-open'));
    });

    function expandRegion(section, open) {
      if (!section) return;
      const grid = section.querySelector('.car-brand-region-body');
      const toggle = section.querySelector('.car-brand-region-toggle');
      if (!grid || !toggle) return;
      grid.classList.toggle('is-collapsed', !open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    }

    function scrollToRegion(section) {
      if (!section) return;
      const headerOff = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-offset')) || 72;
      const toolbarH = toolbar.offsetHeight || 0;
      const top = section.getBoundingClientRect().top + window.scrollY - headerOff - toolbarH - 12;
      window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
    }

    function setActiveNav(regionId) {
      nav.querySelectorAll('a').forEach((link) => {
        link.classList.toggle('is-active', link.getAttribute('data-region-id') === regionId);
      });
    }

    function jumpToRegion(regionId) {
      const section = document.getElementById(regionSectionId(regionId));
      if (!section) return;
      expandRegion(section, true);
      setActiveNav(regionId);
      scrollToRegion(section);
    }

    const regionsWrap = UI.el('div', { className: 'world-flags-regions', id: 'cb-regions' },
      data.regions.map(makeRegionSection)
    );

    navWrap.addEventListener('click', (e) => {
      const link = e.target.closest('a[data-region-id]');
      if (!link) return;
      e.preventDefault();
      setNavOpen(false);
      jumpToRegion(link.getAttribute('data-region-id'));
    });

    function filterBrands() {
      const q = search.value.trim().toLowerCase();
      let visible = 0;
      regionsWrap.querySelectorAll('.world-flags-region').forEach((section) => {
        const regionId = section.dataset.regionId || '';
        const regionLabel = (REGION_NAV_LABELS[regionId] || section.querySelector('.car-brand-region-label')?.textContent || '').toLowerCase();
        const fullLabel = (data.regions.find((r) => r.id === regionId)?.label || '').toLowerCase();
        let regionVisible = 0;
        section.querySelectorAll('.world-flags-card').forEach((card) => {
          const zh = (card.dataset.nameZh || '').toLowerCase();
          const en = (card.dataset.nameEn || '').toLowerCase();
          const tier = (card.dataset.tier || '').toLowerCase();
          const group = (card.dataset.group || '').toLowerCase();
          const show = !q || zh.includes(q) || en.includes(q) || tier.includes(q) || group.includes(q) || regionLabel.includes(q) || fullLabel.includes(q);
          card.hidden = !show;
          if (show) regionVisible++;
        });
        section.hidden = regionVisible === 0;
        if (q && regionVisible > 0) expandRegion(section, true);
        visible += regionVisible;
      });
      navWrap.hidden = !!q;
      regionToggle.hidden = !!q;
      if (q) setNavOpen(false);
      searchMeta.hidden = !q;
      searchMeta.textContent = q ? `找到 ${visible} 個品牌` : '';
    }

    search.addEventListener('input', filterBrands);

    const firstBrand = data.regions[0]?.brands[0];
    const firstCard = regionsWrap.querySelector('.world-flags-card');

    const scrollSentinel = UI.el('div', {
      className: 'world-flags-scroll-sentinel',
      'aria-hidden': 'true',
    });

    mount(app, [
      scrollSentinel,
      toolbar,
      regionsWrap,
      detail,
    ]);

    app.classList.add('world-flags-app', 'car-brand-app');

    const stickyTop = () => {
      const root = getComputedStyle(document.documentElement);
      return root.getPropertyValue('--header-offset').trim()
        || getComputedStyle(app).getPropertyValue('--wf-sticky-top').trim()
        || '72px';
    };

    const onStickyCompactChange = ([entry]) => {
      const compact = !entry.isIntersecting;
      toolbar.classList.toggle('is-compact', compact);
      if (compact) {
        setNavOpen(false);
      } else {
        setNavOpen(true);
      }
    };

    const makeStickyObserver = () => new IntersectionObserver(onStickyCompactChange, {
      root: null,
      threshold: 0,
      rootMargin: `-${stickyTop()} 0px 0px 0px`,
    });

    let scrollObserver = makeStickyObserver();
    scrollObserver.observe(scrollSentinel);

    const refreshStickyObserver = () => {
      scrollObserver.disconnect();
      scrollObserver = makeStickyObserver();
      scrollObserver.observe(scrollSentinel);
    };

    window.addEventListener('resize', refreshStickyObserver);
    window.addEventListener('mytoolife:header-offset', refreshStickyObserver);

    const regionObserver = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible?.target?.dataset?.regionId) {
        setActiveNav(visible.target.dataset.regionId);
      }
    }, {
      root: null,
      rootMargin: '-40% 0px -45% 0px',
      threshold: [0, 0.15, 0.35],
    });

    regionsWrap.querySelectorAll('.car-brand-region').forEach((section) => {
      regionObserver.observe(section);
    });

    if (location.hash.startsWith('#cb-region-')) {
      const regionId = location.hash.slice('#cb-region-'.length);
      requestAnimationFrame(() => {
        setNavOpen(false);
        jumpToRegion(regionId);
      });
    } else if (data.regions[0]) {
      setActiveNav(data.regions[0].id);
    }

    if (firstBrand && firstCard) showDetail(firstBrand, firstCard);
  };

  R['world-cup'] = function (app) {
    mount(app, [UI.panel('世界盃足球賽', [
      UI.el('p', {}, 'FIFA 世界盃每四年舉辦一次，是全球最受關注的足球賽事。'),
      UI.el('ul', {}, [
        UI.el('li', {}, '首屆：1930 年烏拉圭'),
        UI.el('li', {}, '最多冠軍：巴西（5 次）'),
        UI.el('li', {}, '最近：2022 卡達 — 阿根廷奪冠'),
        UI.el('li', {}, '下一屆：2026 美加墨聯合主辦'),
      ]),
    ])]);
  };


  // ===== FUN =====
  R['wishing-tree'] = function (app) {
    const KEY = 'mytoolife_wishes';
    const load = () => JSON.parse(localStorage.getItem(KEY) || '[]');
    const save = (arr) => localStorage.setItem(KEY, JSON.stringify(arr));
    const listEl = UI.el('div', { id: 'wish-list' });
    function render() {
      const wishes = load();
      listEl.replaceChildren(...wishes.map((w, i) => UI.el('div', { className: 'tool-result mb-2' }, (i + 1) + '. ' + w)));
    }
    render();
    mount(app, [UI.panel('許願樹', [
      UI.input('許個願', 'wish-in', 'text', '寫下你的心願…'),
      UI.btn('掛上樹', 'btn btn-primary', () => {
        const v = document.getElementById('wish-in').value.trim();
        if (!v) return;
        const w = load(); w.push(v); save(w); document.getElementById('wish-in').value = ''; render();
      }),
      listEl,
      UI.el('p', { className: 'text-muted small' }, '願望存在本機瀏覽器，換電腦就看不到囉。'),
    ])]);
  };

  R['mind-reader'] = function (app) {
    mount(app, [UI.panel('讀心術', [
      UI.el('ol', {}, [
        UI.el('li', {}, '想一個 10-99 的兩位數'),
        UI.el('li', {}, '把十位與個位相加'),
        UI.el('li', {}, '用原數減去那個和'),
        UI.el('li', {}, '查表：結果若是 9 的倍數，心裡想的是 🌟'),
      ]),
      UI.el('p', { className: 'tool-result' }, '答案永遠是 9 的倍數對應同一符號——經典數學戲法。'),
    ])]);
  };

  R['zodiac'] = function (app) {
    const animals = ['鼠','牛','虎','兔','龍','蛇','馬','羊','猴','雞','狗','豬'];
    const signs = ['魔羯','水瓶','雙魚','牡羊','金牛','雙子','巨蟹','獅子','處女','天秤','天蠍','射手'];
    const out = UI.output('zo-out');
    mount(app, [UI.panel('生肖與星座', [
      UI.input('生日', 'zo-bd', 'date', ''),
      UI.btn('查詢', 'btn btn-primary', () => {
        const d = new Date(document.getElementById('zo-bd').value);
        if (isNaN(d)) { out.textContent = '請選日期'; return; }
        const cn = animals[(d.getFullYear() - 4) % 12];
        const m = d.getMonth() + 1, day = d.getDate();
        const ws = [[1,20,0],[2,19,1],[3,21,2],[4,20,3],[5,21,4],[6,22,5],[7,23,6],[8,23,7],[9,23,8],[10,24,9],[11,23,10],[12,22,11]];
        let si = 11; for (const [mm, dd, idx] of ws) { if (m < mm || (m === mm && day < dd)) { si = idx; break; } }
        out.textContent = '生肖：' + cn + '　星座：' + signs[si];
      }), out,
    ])]);
  };

  R['ghost-story'] = function (app) {
    mount(app, [UI.panel('倩女幽魂', [
      UI.el('p', { className: 'tool-result' }, "寧採臣夜宿蘭若寺，遇聶小倩。書生心正，終得善報。——《聊齋誌異》精簡版"),
      UI.el('p', { className: 'text-muted' }, '經典志怪，膽小者請開燈閱讀。'),
    ])]);
  };

  R['fortune-stick'] = function (app) {
    const out = UI.output('fs-out');
    mount(app, [UI.panel('線上抽籤', [
      UI.btn('搖籤', 'btn btn-primary btn-lg', () => { out.textContent = UI.randomChoice(["上上籤：萬事如意","上籤：貴人相助","中籤：平穩前行","下籤：稍安勿躁","下下籤：韜光養晦"]); }),
      out,
    ])]);
  };

  R['rp-test'] = function (app) {
    const out = UI.output('rp-out');
    mount(app, [UI.panel('人品測試', [
      UI.input('姓名', 'rp-name', 'text', '輸入姓名…'),
      UI.btn('測試', 'btn btn-primary', () => {
        const n = document.getElementById('rp-name').value.trim();
        if (!n) return;
        const score = hashName(n) % 101;
        out.textContent = n + ' 的人品指數：' + score + ' / 100（娛樂用途）';
      }), out,
    ])]);
  };

  R['jinyong'] = function (app) {
    const out = UI.output('jy-out');
    mount(app, [UI.panel('金庸人物卜', [
      UI.input('姓名', 'jy-name', 'text', '你的名字…'),
      UI.btn('占卜', 'btn btn-primary', () => {
        const n = document.getElementById('jy-name').value.trim() || '俠客';
        out.textContent = '你是：' + UI.randomChoice(["郭靖","黃蓉","楊過","小龍女","張無忌","趙敏","令狐沖","任盈盈","段譽","虛竹"]) + '（' + n + ' 的江湖化身）';
      }), out,
    ])]);
  };

  R['lucky-number'] = function (app) {
    const out = UI.output('ln-out');
    mount(app, [UI.panel('幸運號碼', [
      UI.input('幾個號碼', 'ln-count', 'number', '6'),
      UI.input('最大值', 'ln-max', 'number', '49'),
      UI.btn('產生', 'btn btn-primary', () => {
        const n = Math.min(20, +document.getElementById('ln-count').value || 6);
        const max = +document.getElementById('ln-max').value || 49;
        const nums = new Set();
        while (nums.size < n) nums.add(UI.randomInt(1, max));
        out.textContent = [...nums].sort((a, b) => a - b).join(', ');
      }), out,
    ])]);
  };

  R['alchemist'] = function (app) {
    const out = UI.output('al-out');
    mount(app, [UI.panel('人體鍊成陣', [
      UI.input('身高 cm', 'al-h', 'number', '170'),
      UI.input('體重 kg', 'al-w', 'number', '65'),
      UI.btn('分析', 'btn btn-primary', () => {
        const h = +document.getElementById('al-h').value, w = +document.getElementById('al-w').value;
        const bmi = w / ((h / 100) ** 2);
        out.textContent = '水 ' + (55 + (bmi % 10)).toFixed(0) + '% · 火 ' + (15 + (w % 8)).toFixed(0) + '% · 土 ' + (20 + (h % 5)).toFixed(0) + '%（FA 迷玩笑用）';
      }), out,
    ])]);
  };

  R['lucky-draw'] = function (app) {
    const out = UI.output('ld-out');
    mount(app, [UI.panel('幸運大抽獎', [
      UI.textarea('名單（每行一個）', 'ld-list', 'Alice\nBob\nCarol', 5),
      UI.btn('抽獎', 'btn btn-primary btn-lg', () => {
        const names = document.getElementById('ld-list').value.split(/\n+/).map((s) => s.trim()).filter(Boolean);
        if (!names.length) { out.textContent = '請輸入名單'; return; }
        out.textContent = '🎉 恭喜：' + UI.randomChoice(names);
      }), out,
    ])]);
  };


  // ===== SPIRITUAL =====
  R['numerology'] = function (app) {
    const out = UI.output('num-out');
    mount(app, [UI.panel('生命靈數', [
      UI.input('生日', 'num-bd', 'date', ''),
      UI.btn('計算', 'btn btn-primary', () => {
        const n = lifePathNumber(document.getElementById('num-bd').value);
        out.textContent = n ? '生命靈數：' + n : '請輸入生日';
      }),
      UI.el('p', { className: 'text-muted small' }, '將生日數字相加至個位數（11、22 保留）。'),
      out,
    ])]);
  };

  R['enneagram'] = function (app) {
    const scores = Array(9).fill(0);
    let step = 0;
    const qEl = UI.el('p', { className: 'tool-result' }, '');
    const out = UI.output('enne-out');
    function showQ() {
      if (step >= 9) {
        const max = Math.max(...scores);
        const type = scores.indexOf(max) + 1;
        out.textContent = '你的傾向型號：' + type + ' 號（精簡測驗，僅供參考）';
        return;
      }
      qEl.textContent = 'Q' + (step + 1) + '：' + ["我較常討好他人","我追求完美","我重視成就","我情緒起伏大","我喜歡獨處思考","我重視安全","我樂觀愛玩","我習慣掌控","我避免衝突"][step];
    }
    showQ();
    mount(app, [UI.panel('九型人格', [
      qEl,
      UI.btnGroup([
        UI.btn('是', 'btn btn-primary', () => { scores[step]++; step++; showQ(); }),
        UI.btn('否', 'btn btn-outline-secondary', () => { step++; showQ(); }),
      ]),
      out,
    ])]);
  };

  R['chakra'] = function (app) {
    const chakras = ['海底輪','臍輪','太陽神經叢','心輪','喉輪','眉心輪','頂輪'];
    const scores = Array(7).fill(0);
    let step = 0;
    const qEl = UI.el('p', { className: 'tool-result' }, '');
    const out = UI.output('ch-out');
    function showQ() {
      if (step >= 7) {
        const weak = scores.indexOf(Math.min(...scores));
        out.textContent = '可能需關注：' + chakras[weak] + '（娛樂測驗）';
        return;
      }
      qEl.textContent = 'Q' + (step + 1) + '：' + ["我常感到紮根不穩","我難以表達情感","我缺乏自信","我難以給予/接受愛","我難以說真話","我常頭痛或思緒過多","我與靈性連結薄弱"][step];
    }
    showQ();
    mount(app, [UI.panel('七大脈輪', [
      qEl,
      UI.btnGroup([
        UI.btn('常如此', 'btn btn-primary', () => { scores[step]++; step++; showQ(); }),
        UI.btn('偶爾', 'btn btn-outline-secondary', () => { step++; showQ(); }),
      ]),
      out,
    ])]);
  };

  R['hawkins'] = function (app) {
    const levels = [
      { lv: 20, name: '羞恥' }, { lv: 100, name: '恐懼' }, { lv: 200, name: '勇氣' },
      { lv: 350, name: '接受' }, { lv: 500, name: '愛' }, { lv: 700, name: '開悟' },
    ];
    const slider = UI.el('input', { type: 'range', min: '20', max: '700', value: '200', className: 'form-range', id: 'hw-sl' });
    const out = UI.output('hw-out');
    slider.addEventListener('input', () => {
      const v = +slider.value;
      const near = levels.reduce((a, b) => Math.abs(b.lv - v) < Math.abs(a.lv - v) ? b : a);
      out.textContent = '意識層級約 ' + v + '：接近「' + near.name + '」';
    });
    mount(app, [UI.panel('霍金斯意識能量', [
      UI.el('p', {}, '大衛·霍金斯意識層級表（簡化）。'),
      slider, out,
    ])]);
  };

  // ===== WORLD =====
  const WORLD_MEDIA_DIRS = new Set([
    'world-flags-img',
    'coat-of-arms-img',
    'national-symbol-img',
    'monster-img',
  ]);

  function siteMediaUrl(relativePath) {
    if (!relativePath) return relativePath;
    if (/^(https?:|data:|\/)/i.test(relativePath)) return relativePath;
    let clean = String(relativePath).replace(/^\/+/, '');
    const top = clean.split('/')[0];
    if (WORLD_MEDIA_DIRS.has(top) && !clean.startsWith('world/')) {
      clean = `world/${clean}`;
    }
    if (window.WA_TOOL_URLS?.absolutePageHref) {
      return window.WA_TOOL_URLS.absolutePageHref(clean);
    }
    if (typeof window.waAssetUrl === 'function') {
      return window.waAssetUrl(clean);
    }
    return `/${clean}`;
  }

  R['world-flags'] = function (app) {
    const data = window.WA_WORLD_FLAGS;
    if (!data || !data.regions || !data.regions.length) {
      mount(app, [UI.panel('世界旗幟', UI.el('p', { className: 'text-muted' }, '旗幟資料載入失敗，請重新整理頁面。'))]);
      return;
    }

    const total = data.regions.reduce((n, r) => n + r.countries.length, 0);
    let selectedCard = null;

    const detail = UI.el('div', { className: 'world-flags-dock', id: 'wf-detail', hidden: true }, [
      UI.el('p', { className: 'text-muted mb-0 world-flags-dock-hint' }, '點選國旗可查看說明。'),
    ]);

    function setDockOpen(open) {
      detail.hidden = !open;
      detail.classList.toggle('is-visible', open);
      app.classList.toggle('world-flags-has-dock', open);
    }

    function renderTitle(country) {
      const titleParts = [country.nameZh];
      if (country.code) {
        titleParts.push(UI.el('span', { className: 'world-flags-code-inline' }, country.code.toUpperCase()));
      }
      return UI.el('h4', { className: 'world-flags-dock-title' }, titleParts);
    }

    function renderNameLine(country) {
      const parts = [];
      if (country.nameEn && country.nameEn !== country.nameZh) {
        parts.push(UI.el('span', { className: 'world-flags-dock-en' }, country.nameEn));
      }
      (country.natives || []).forEach((native) => {
        if (parts.length) {
          parts.push(UI.el('span', { className: 'world-flags-dock-sep', 'aria-hidden': 'true' }, '·'));
        }
        parts.push(UI.el('span', {
          className: 'world-flags-dock-native',
          lang: native.lang,
          dir: native.rtl ? 'rtl' : undefined,
          title: native.label || undefined,
        }, native.name));
      });
      if (!parts.length) return null;
      return UI.el('p', { className: 'world-flags-dock-names' }, parts);
    }

    function parseDescSections(desc) {
      if (!desc) return [];
      const sections = [];
      const re = /【([^】]+)】([^【]*)/g;
      let match;
      while ((match = re.exec(desc)) !== null) {
        const title = match[1].trim();
        const text = match[2].trim();
        if (text) sections.push({ title, text });
      }
      if (!sections.length && desc.trim()) {
        sections.push({ title: '說明', text: desc.trim() });
      }
      return sections;
    }

    function sectionBlock(title, text) {
      if (!text) return null;
      return UI.el('div', { className: 'wf-dock-section' }, [
        UI.el('h5', { className: 'wf-dock-section-title' }, title),
        UI.el('p', { className: 'world-flags-dock-desc' }, text),
      ]);
    }

    function showDetail(country, cardEl) {
      if (selectedCard) selectedCard.classList.remove('is-selected');
      selectedCard = cardEl || null;
      if (selectedCard) selectedCard.classList.add('is-selected');

      detail.replaceChildren(
        UI.el('div', { className: 'world-flags-dock-inner' }, [
          UI.el('div', { className: 'world-flags-dock-head' }, [
            UI.bindImageZoom(UI.el('img', {
              className: 'world-flags-dock-img',
              src: siteMediaUrl(country.image),
              alt: country.nameZh,
              loading: 'lazy',
            }), { caption: country.nameZh }),
            UI.el('div', { className: 'world-flags-dock-head-text' }, [
              renderTitle(country),
              renderNameLine(country),
            ]),
            UI.el('button', {
              type: 'button',
              className: 'world-flags-dock-close',
              title: '收合',
              'aria-label': '收合詳情',
              onClick: () => {
                if (selectedCard) selectedCard.classList.remove('is-selected');
                selectedCard = null;
                setDockOpen(false);
              },
            }, '×'),
          ]),
          country.desc
            ? UI.el('div', { className: 'world-flags-dock-body wf-dock-body' },
              parseDescSections(country.desc).map((section) => sectionBlock(section.title, section.text))
            )
            : null,
        ])
      );
      const body = detail.querySelector('.world-flags-dock-body');
      if (body) body.scrollTop = 0;
      setDockOpen(true);
    }

    function makeCard(country) {
      return UI.el('button', {
        type: 'button',
        className: 'world-flags-card',
        title: country.nameZh,
        dataset: {
          nameZh: country.nameZh,
          nameEn: country.nameEn || '',
          code: country.code || '',
        },
        onClick: (e) => showDetail(country, e.currentTarget),
      }, [
        UI.el('img', {
          className: 'world-flags-img',
          src: siteMediaUrl(country.image),
          alt: country.nameZh,
          loading: 'lazy',
          width: '81',
          height: '53',
        }),
        UI.el('span', { className: 'world-flags-name' }, [
          country.nameZh,
          country.code
            ? UI.el('span', { className: 'world-flags-code-inline' }, country.code.toUpperCase())
            : null,
        ]),
        country.nameEn && country.nameEn !== country.nameZh
          ? UI.el('span', { className: 'world-flags-name-en' }, country.nameEn)
          : null,
      ]);
    }

    function makeRegionSection(region) {
      const grid = UI.el('div', {
        className: 'world-flags-grid',
        id: `wf-region-${region.id}`,
        dataset: { region: region.id },
      }, region.countries.map(makeCard));

      return UI.el('section', { className: 'world-flags-region' }, [
        UI.el('h3', { className: 'world-flags-region-title' }, [
          region.label,
          UI.el('span', { className: 'world-flags-region-count' }, `${region.countries.length}`),
        ]),
        grid,
      ]);
    }

    const search = UI.el('input', {
      type: 'search',
      className: 'form-control tool-input world-flags-search',
      id: 'wf-search',
      placeholder: '搜尋國家名稱（中文或英文）…',
      autocomplete: 'off',
    });

    const nav = UI.el('div', { className: 'world-flags-nav' }, data.regions.map((region) =>
      UI.el('a', {
        className: 'world-flags-nav-link',
        href: `#wf-region-${region.id}`,
      }, `${region.label} (${region.countries.length})`)
    ));

    const introGuide = UI.el('details', { className: 'world-flags-guide' }, [
      UI.el('summary', {}, '這頁可以怎麼用？'),
      UI.el('div', { className: 'world-flags-guide-body' }, [
        UI.el('p', {}, '依洲別瀏覽各國國旗，可用中文、英文或 ISO 代碼搜尋。'),
        UI.el('p', {}, '點選國旗後，下方面板會顯示首都、地理、語言、貨幣、經濟與文化摘要，以及旗幟的構圖、色彩象徵與歷史背景。'),
        UI.el('p', { className: 'mb-0' }, '適合地理課複習、出國前快速查國情，或純粹認旗練習。'),
      ]),
    ]);

    const introMeta = UI.el('p', {
      className: 'text-muted world-flags-intro-meta',
      id: 'wf-intro-meta',
    }, `共 ${total} 個國家與地區 · 點選國旗查看詳情`);

    const searchMeta = UI.el('p', {
      className: 'text-muted world-flags-search-meta',
      id: 'wf-meta',
      hidden: true,
    }, '');

    const regionToggle = UI.el('button', {
      type: 'button',
      className: 'world-flags-region-toggle',
      id: 'wf-region-toggle',
      title: '選擇洲別',
      'aria-expanded': 'false',
      'aria-controls': 'wf-nav',
    }, '洲');

    const searchRow = UI.el('div', { className: 'world-flags-toolbar-row' }, [search, regionToggle]);

    const navWrap = UI.el('div', { className: 'world-flags-nav-wrap', id: 'wf-nav' }, [nav]);

    const toolbar = UI.el('div', { className: 'world-flags-toolbar', id: 'wf-toolbar' }, [
      introMeta,
      introGuide,
      searchRow,
      searchMeta,
      navWrap,
    ]);

    regionToggle.addEventListener('click', () => {
      const open = toolbar.classList.toggle('is-nav-open');
      regionToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        toolbar.classList.remove('is-nav-open');
        regionToggle.setAttribute('aria-expanded', 'false');
      });
    });

    const scrollSentinel = UI.el('div', {
      className: 'world-flags-scroll-sentinel',
      'aria-hidden': 'true',
    });

    const regionsWrap = UI.el('div', { className: 'world-flags-regions', id: 'wf-regions' },
      data.regions.map(makeRegionSection)
    );

    function filterFlags() {
      const q = search.value.trim().toLowerCase();
      let visible = 0;
      regionsWrap.querySelectorAll('.world-flags-region').forEach((section) => {
        let regionVisible = 0;
        section.querySelectorAll('.world-flags-card').forEach((card) => {
          const zh = (card.dataset.nameZh || '').toLowerCase();
          const en = (card.dataset.nameEn || '').toLowerCase();
          const code = (card.dataset.code || '').toLowerCase();
          const match = !q || zh.includes(q) || en.includes(q) || code.includes(q);
          card.hidden = !match;
          if (match) regionVisible += 1;
        });
        section.hidden = regionVisible === 0;
        const countEl = section.querySelector('.world-flags-region-count');
        if (countEl) countEl.textContent = String(regionVisible);
        visible += regionVisible;
      });
      navWrap.hidden = !!q;
      regionToggle.hidden = !!q;
      if (searchMeta) {
        if (q) {
          searchMeta.hidden = false;
          searchMeta.textContent = `找到 ${visible} 個符合「${search.value.trim()}」的結果`;
        } else {
          searchMeta.hidden = true;
        }
      }
    }

    search.addEventListener('input', filterFlags);

    mount(app, [
      UI.panel('世界旗幟', [
        scrollSentinel,
        toolbar,
        regionsWrap,
      ]),
      detail,
    ]);
    app.classList.add('world-flags-app');

    const stickyTop = () => {
      const root = getComputedStyle(document.documentElement);
      return root.getPropertyValue('--header-offset').trim()
        || getComputedStyle(app).getPropertyValue('--wf-sticky-top').trim()
        || '72px';
    };

    const onStickyCompactChange = ([entry]) => {
      const compact = !entry.isIntersecting;
      toolbar.classList.toggle('is-compact', compact);
      if (!compact) {
        toolbar.classList.remove('is-nav-open');
        regionToggle.setAttribute('aria-expanded', 'false');
      }
    };

    const makeStickyObserver = () => new IntersectionObserver(onStickyCompactChange, {
      root: null,
      threshold: 0,
      rootMargin: `-${stickyTop()} 0px 0px 0px`,
    });

    let scrollObserver = makeStickyObserver();
    scrollObserver.observe(scrollSentinel);

    const refreshStickyObserver = () => {
      scrollObserver.disconnect();
      scrollObserver = makeStickyObserver();
      scrollObserver.observe(scrollSentinel);
    };

    window.addEventListener('resize', refreshStickyObserver);
    window.addEventListener('mytoolife:header-offset', refreshStickyObserver);
  };

  R['population'] = function (app) {
    const data = window.WA_POPULATION;
    if (!data || !data.countries || !data.countries.length) {
      mount(app, [UI.panel('世界人口統計', UI.el('p', { className: 'text-muted' }, '人口資料載入失敗，請重新整理頁面。'))]);
      return;
    }

    const countries = data.countries.slice();
    const worldPop = data.world?.pop;
    countries.forEach((c) => {
      c.worldShare = worldPop && c.pop != null ? (c.pop / worldPop) * 100 : null;
      c.sexRatioMF = c.malePct != null && c.femalePct ? c.malePct / c.femalePct : null;
    });

    let sortKey = 'pop';
    let sortDir = 'desc';
    let regionFilter = 'all';
    let searchQuery = '';
    let selectedRow = null;

    function fmtPop(n) {
      if (n == null || Number.isNaN(n)) return '—';
      const abs = Math.abs(n);
      if (abs >= 1e9) return `${(n / 1e9).toFixed(2)} 億`;
      if (abs >= 1e6) return `${(n / 1e6).toFixed(2)} 百萬`;
      if (abs >= 1e4) return `${Math.round(n).toLocaleString('zh-Hant')}`;
      return Math.round(n).toLocaleString('zh-Hant');
    }

    function fmtNum(n, digits) {
      if (n == null || Number.isNaN(n)) return '—';
      return Number(n).toLocaleString('zh-Hant', {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits,
      });
    }

    function fmtPct(n) {
      if (n == null || Number.isNaN(n)) return '—';
      return `${fmtNum(n, 2)}%`;
    }

    function fmtPerThousand(n) {
      if (n == null || Number.isNaN(n)) return '—';
      return `${fmtNum(n, 2)} / 千人`;
    }

    function fmtYears(n) {
      if (n == null || Number.isNaN(n)) return '—';
      return `${fmtNum(n, 1)} 歲`;
    }

    function fmtSexRatio(malePct, femalePct) {
      if (malePct == null || femalePct == null) return '—';
      const ratio = malePct / femalePct;
      return `${fmtNum(ratio * 100, 1)} 男 : 100 女`;
    }

    function fmtSexRatioMF(malePct, femalePct) {
      if (malePct == null || femalePct == null || femalePct === 0) return '—';
      return `${fmtNum(malePct / femalePct, 2)} : 1`;
    }

    function fmtWorldShare(pop) {
      const worldPop = data.world?.pop;
      if (worldPop == null || pop == null || Number.isNaN(pop)) return '—';
      return fmtPct((pop / worldPop) * 100);
    }

    function fmtDensity(v) {
      if (v == null || Number.isNaN(v)) return '—';
      return `${fmtNum(v, 1)} 人/km²`;
    }

    const SORT_OPTIONS = [
      { key: 'pop', label: '人口總數', group: 'resources', format: fmtPop },
      { key: 'worldShare', label: '全球人口佔比', group: 'resources', format: fmtPct },
      { key: 'growth', label: '人口成長率', group: 'dynamics', format: fmtPct },
      { key: 'birthRate', label: '出生率', group: 'dynamics', format: fmtPerThousand },
      { key: 'deathRate', label: '死亡率', group: 'dynamics', format: fmtPerThousand },
      { key: 'fertility', label: '總生育率', group: 'dynamics', format: (v) => (v == null ? '—' : `${fmtNum(v, 2)} 人/婦`) },
      { key: 'age0_14', label: '0–14 歲佔比', group: 'structure', format: fmtPct },
      { key: 'age15_64', label: '15–64 歲佔比', group: 'structure', format: fmtPct },
      { key: 'age65up', label: '65+ 歲佔比', group: 'structure', format: fmtPct },
      { key: 'depYouth', label: '扶幼比', group: 'structure', format: fmtPct },
      { key: 'depOld', label: '扶老比', group: 'structure', format: fmtPct },
      { key: 'depTotal', label: '總扶養比', group: 'structure', format: fmtPct },
      { key: 'malePct', label: '男性佔比', group: 'structure', format: fmtPct },
      { key: 'sexRatioMF', label: '男女比例', group: 'structure', format: (v) => (v == null ? '—' : `${fmtNum(v, 2)} : 1`) },
      { key: 'urbanPct', label: '城市化程度', group: 'migration', format: fmtPct },
      { key: 'netMigrationRate', label: '淨遷移率', group: 'migration', format: fmtPerThousand },
      { key: 'lifeExp', label: '平均餘命', group: 'health', format: fmtYears },
      { key: 'healthyLife', label: '健康平均餘命', group: 'health', format: fmtYears },
      { key: 'density', label: '人口密度', group: 'resources', format: (v) => (v == null ? '—' : `${fmtNum(v, 1)} 人/km²`) },
      { key: 'literacy', label: '識字率', group: 'resources', format: fmtPct },
    ];

    const sortOptionMap = Object.fromEntries(SORT_OPTIONS.map((o) => [o.key, o]));

    const CATEGORY_INFO = [
      {
        id: 'dynamics',
        title: '1. 人口動態與成長率',
        text: '人口成長率反映增加或減少速度；出生率、死亡率（每千人）評估自然增加；總生育率觀察少子化或人口爆炸趨勢。',
      },
      {
        id: 'structure',
        title: '2. 人口結構分析',
        text: '依幼年、青壯年、老年佔比分析扶幼比、扶老比與總扶養比，評估勞動力與長照壓力；性別比例反映人口結構。',
      },
      {
        id: 'migration',
        title: '3. 遷徙與城市化',
        text: '城市化程度反映都市與鄉村人口分佈；淨遷移率（每千人）反映國際移入移出與人口吸引力。',
      },
      {
        id: 'health',
        title: '4. 壽命與健康指標',
        text: '平均餘命反映醫療與生活品質；健康平均餘命為扣除疾病失能後的健康存活年數（部分國家無公開資料）。',
      },
      {
        id: 'resources',
        title: '5. 資源與分佈',
        text: '人口密度評估土地承載壓力；識字率反映教育普及與人力資源品質。',
      },
    ];

    const detail = UI.el('div', { className: 'population-dock', id: 'pop-detail', hidden: true }, [
      UI.el('p', { className: 'text-muted mb-0 population-dock-hint' }, '點選列表中的國家可查看完整指標。'),
    ]);

    function setDockOpen(open) {
      detail.hidden = !open;
      detail.classList.toggle('is-visible', open);
      app.classList.toggle('population-has-dock', open);
    }

    function metricRow(label, value, hint) {
      return UI.el('div', { className: 'population-metric-row' }, [
        UI.el('span', { className: 'population-metric-label' }, label),
        UI.el('span', { className: 'population-metric-value' }, value),
        hint ? UI.el('span', { className: 'population-metric-hint' }, hint) : null,
      ]);
    }

    function metricSection(title, rows) {
      return UI.el('section', { className: 'population-metric-section' }, [
        UI.el('h5', { className: 'population-metric-section-title' }, title),
        UI.el('div', { className: 'population-metric-grid' }, rows),
      ]);
    }

    function showDetail(c) {
      if (selectedRow) selectedRow.classList.remove('is-selected');
      selectedRow = document.querySelector(`.population-row[data-iso3="${c.iso3}"]`);
      if (selectedRow) selectedRow.classList.add('is-selected');

      const headParts = [
        c.flagImage
          ? UI.bindImageZoom(UI.el('img', {
            className: 'population-dock-flag',
            src: c.flagImage,
            alt: c.nameZh,
            loading: 'lazy',
          }), { caption: c.nameZh })
          : UI.el('span', { className: 'population-dock-flag population-dock-flag-fallback' }, c.iso3),
        UI.el('div', { className: 'population-dock-head-text' }, [
          UI.el('h4', { className: 'population-dock-title' }, [
            c.nameZh,
            UI.el('span', { className: 'population-code-inline' }, c.iso3),
          ]),
          c.nameEn && c.nameEn !== c.nameZh
            ? UI.el('p', { className: 'population-dock-en' }, c.nameEn)
            : null,
          UI.el('p', { className: 'population-dock-meta' }, [
            c.regionLabel,
            c.dataYear ? ` · 資料年份 ${c.dataYear}` : '',
          ]),
        ]),
        UI.el('button', {
          type: 'button',
          className: 'population-dock-close',
          'aria-label': '關閉',
          onClick: () => setDockOpen(false),
        }, '×'),
      ];

      detail.replaceChildren(
        UI.el('div', { className: 'population-dock-inner' }, [
          UI.el('div', { className: 'population-dock-head' }, headParts),
          UI.el('div', { className: 'population-dock-body' }, [
            metricSection('人口動態與成長率', [
              metricRow('人口總數', fmtPop(c.pop)),
              metricRow('人口成長率', fmtPct(c.growth), '年增減百分比'),
              metricRow('出生率', fmtPerThousand(c.birthRate)),
              metricRow('死亡率', fmtPerThousand(c.deathRate)),
              metricRow('總生育率', c.fertility == null ? '—' : `${fmtNum(c.fertility, 2)} 人/婦`),
            ]),
            metricSection('人口結構分析', [
              metricRow('0–14 歲', fmtPct(c.age0_14)),
              metricRow('15–64 歲', fmtPct(c.age15_64)),
              metricRow('65 歲以上', fmtPct(c.age65up)),
              metricRow('扶幼比', fmtPct(c.depYouth)),
              metricRow('扶老比', fmtPct(c.depOld)),
              metricRow('總扶養比', fmtPct(c.depTotal)),
              metricRow('男性佔比', fmtPct(c.malePct)),
              metricRow('女性佔比', fmtPct(c.femalePct)),
              metricRow('性別比例', fmtSexRatio(c.malePct, c.femalePct)),
            ]),
            metricSection('遷徙與城市化', [
              metricRow('城市化程度', fmtPct(c.urbanPct)),
              metricRow('淨遷移（人）', c.netMigration == null ? '—' : fmtPop(c.netMigration)),
              metricRow('淨遷移率', fmtPerThousand(c.netMigrationRate), '每千人'),
            ]),
            metricSection('壽命與健康', [
              metricRow('平均餘命', fmtYears(c.lifeExp)),
              metricRow('健康平均餘命', fmtYears(c.healthyLife), c.healthyLife == null ? '資料未提供' : null),
            ]),
            metricSection('資源與分佈', [
              metricRow('人口密度', c.density == null ? '—' : `${fmtNum(c.density, 1)} 人/km²`),
              metricRow('識字率', fmtPct(c.literacy)),
            ]),
          ]),
        ])
      );
      setDockOpen(true);
    }

    function filteredSorted() {
      const q = searchQuery.trim().toLowerCase();
      let list = countries.filter((c) => {
        if (regionFilter !== 'all' && c.regionId !== regionFilter) return false;
        if (!q) return true;
        const hay = `${c.nameZh} ${c.nameEn} ${c.iso3}`.toLowerCase();
        return hay.includes(q);
      });
      const opt = sortOptionMap[sortKey];
      list.sort((a, b) => {
        const av = a[sortKey];
        const bv = b[sortKey];
        if (av == null && bv == null) return a.nameZh.localeCompare(b.nameZh, 'zh-Hant');
        if (av == null) return 1;
        if (bv == null) return -1;
        if (av === bv) return a.nameZh.localeCompare(b.nameZh, 'zh-Hant');
        return sortDir === 'desc' ? bv - av : av - bv;
      });
      return list;
    }

    const summaryEl = UI.el('div', { className: 'population-summary' });
    const metaEl = UI.el('p', { className: 'text-muted population-intro-meta' });
    const searchMeta = UI.el('p', { className: 'text-muted population-search-meta', hidden: true });
    const tbody = UI.el('tbody');

    function renderSummary() {
      const w = data.world || {};
      summaryEl.replaceChildren(
        UI.el('div', { className: 'population-summary-card' }, [
          UI.el('span', { className: 'population-summary-label' }, '全球人口'),
          UI.el('strong', { className: 'population-summary-value' }, fmtPop(w.pop)),
        ]),
        UI.el('div', { className: 'population-summary-card' }, [
          UI.el('span', { className: 'population-summary-label' }, '涵蓋國家'),
          UI.el('strong', { className: 'population-summary-value' }, `${data.countryCount}`),
        ]),
        UI.el('div', { className: 'population-summary-card' }, [
          UI.el('span', { className: 'population-summary-label' }, '全球成長率'),
          UI.el('strong', { className: 'population-summary-value' }, fmtPct(w.growth)),
        ]),
        UI.el('div', { className: 'population-summary-card' }, [
          UI.el('span', { className: 'population-summary-label' }, '平均餘命'),
          UI.el('strong', { className: 'population-summary-value' }, fmtYears(w.lifeExp)),
        ])
      );
      metaEl.textContent = `資料來源：${data.source}（${data.fetchedAt} 更新）。點欄位標題或下拉選單可切換排行依據。`;
    }

    function renderTable() {
      const list = filteredSorted();
      tbody.replaceChildren();
      list.forEach((c, idx) => {
        const tr = UI.el('tr', {
          className: 'population-row',
          dataset: { iso3: c.iso3 },
          tabIndex: 0,
          role: 'button',
          onClick: () => showDetail(c),
          onKeydown: (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              showDetail(c);
            }
          },
        }, [
          UI.el('td', { className: 'population-rank' }, String(idx + 1)),
          UI.el('td', { className: 'population-country' }, [
            c.flagImage
              ? UI.el('img', { className: 'population-flag', src: c.flagImage, alt: '', loading: 'lazy' })
              : UI.el('span', { className: 'population-flag-fallback' }, c.iso3.slice(0, 2)),
            UI.el('span', { className: 'population-country-name' }, [
              UI.el('strong', {}, c.nameZh),
              c.nameEn && c.nameEn !== c.nameZh
                ? UI.el('small', { className: 'population-country-en' }, c.nameEn)
                : null,
            ]),
          ]),
          UI.el('td', {
            className: `population-primary${sortKey === 'pop' ? ' is-sorted-col' : ''}`,
          }, fmtPop(c.pop)),
          UI.el('td', {
            className: `population-metric${sortKey === 'worldShare' ? ' is-sorted-col' : ''}`,
          }, fmtWorldShare(c.pop)),
          UI.el('td', {
            className: `population-metric${sortKey === 'density' ? ' is-sorted-col' : ''}`,
          }, fmtDensity(c.density)),
          UI.el('td', {
            className: `population-metric${sortKey === 'sexRatioMF' ? ' is-sorted-col' : ''}`,
          }, fmtSexRatioMF(c.malePct, c.femalePct)),
        ]);
        tbody.appendChild(tr);
      });
      searchMeta.hidden = !searchQuery.trim();
      searchMeta.textContent = searchQuery.trim()
        ? `搜尋「${searchQuery.trim()}」：${list.length} 筆`
        : '';
    }

    const search = UI.el('input', {
      type: 'search',
      className: 'form-control tool-input population-search',
      placeholder: '搜尋國家名稱或代碼…',
      onInput: (e) => {
        searchQuery = e.target.value;
        renderTable();
      },
    });

    const regionSelect = UI.el('select', {
      className: 'form-select tool-select population-region',
      onChange: (e) => {
        regionFilter = e.target.value;
        renderTable();
      },
    }, [
      UI.el('option', { value: 'all' }, '全部地區'),
      ...(data.regions || []).map((r) => UI.el('option', { value: r.id }, `${r.label}（${r.count}）`)),
    ]);

    const sortSelect = UI.el('select', {
      className: 'form-select tool-select population-sort',
      onChange: (e) => {
        sortKey = e.target.value;
        renderTable();
        updateHeader();
      },
    }, SORT_OPTIONS.map((o) => UI.el('option', { value: o.key, selected: o.key === sortKey }, o.label)));

    const sortDirBtn = UI.el('button', {
      type: 'button',
      className: 'population-sort-dir',
      title: '切換排序方向',
      onClick: () => {
        sortDir = sortDir === 'desc' ? 'asc' : 'desc';
        sortDirBtn.textContent = sortDir === 'desc' ? '↓ 高到低' : '↑ 低到高';
        sortDirBtn.setAttribute('aria-label', sortDir === 'desc' ? '由高到低排序' : '由低到高排序');
        renderTable();
      },
    }, '↓ 高到低');

    const popTh = UI.el('th', {
      className: 'population-th-sortable',
      tabIndex: 0,
    }, '人口總數');
    const worldShareTh = UI.el('th', {
      className: 'population-th-sortable',
      tabIndex: 0,
    }, '全球人口佔比 (%)');
    const densityTh = UI.el('th', {
      className: 'population-th-sortable',
      tabIndex: 0,
    }, '人口密度 (人/km²)');
    const sexRatioTh = UI.el('th', {
      className: 'population-th-sortable',
      tabIndex: 0,
    }, '男女比例 (Male/Female)');

    function setSortDirUi() {
      sortDirBtn.textContent = sortDir === 'desc' ? '↓ 高到低' : '↑ 低到高';
      sortDirBtn.setAttribute('aria-label', sortDir === 'desc' ? '由高到低排序' : '由低到高排序');
    }

    function updateHeader() {
      popTh.classList.toggle('is-sorted', sortKey === 'pop');
      worldShareTh.classList.toggle('is-sorted', sortKey === 'worldShare');
      densityTh.classList.toggle('is-sorted', sortKey === 'density');
      sexRatioTh.classList.toggle('is-sorted', sortKey === 'sexRatioMF');
      sortSelect.value = sortKey;
    }

    function applySort(key) {
      if (sortKey === key) sortDir = sortDir === 'desc' ? 'asc' : 'desc';
      else sortKey = key;
      setSortDirUi();
      updateHeader();
      renderTable();
    }

    function bindSortHeader(th, key) {
      th.addEventListener('click', () => applySort(key));
      th.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          applySort(key);
        }
      });
    }

    bindSortHeader(popTh, 'pop');
    bindSortHeader(worldShareTh, 'worldShare');
    bindSortHeader(densityTh, 'density');
    bindSortHeader(sexRatioTh, 'sexRatioMF');

    const table = UI.el('table', { className: 'table table-hover population-table' }, [
      UI.el('thead', {}, UI.el('tr', {}, [
        UI.el('th', { className: 'population-rank' }, '#'),
        UI.el('th', {}, '國家'),
        popTh,
        worldShareTh,
        densityTh,
        sexRatioTh,
      ])),
      tbody,
    ]);

    const categoryGuide = UI.el('details', { className: 'population-guide' }, [
      UI.el('summary', {}, '指標說明（五大類）'),
      UI.el('div', { className: 'population-guide-body' },
        CATEGORY_INFO.map((cat) => UI.el('div', { className: 'population-guide-item' }, [
          UI.el('strong', {}, cat.title),
          UI.el('p', {}, cat.text),
        ]))
      ),
    ]);

    const toolbar = UI.el('div', { className: 'population-toolbar' }, [
      UI.el('div', { className: 'population-toolbar-row' }, [search, regionSelect]),
      UI.el('div', { className: 'population-toolbar-row population-toolbar-row-sort' }, [
        UI.el('label', { className: 'population-sort-label' }, '排行依據'),
        sortSelect,
        sortDirBtn,
      ]),
    ]);

    app.classList.add('population-app');
    app.replaceChildren(UI.el('div', { className: 'tool-form-inner population-layout' }, [
      summaryEl,
      metaEl,
      categoryGuide,
      toolbar,
      searchMeta,
      UI.el('div', { className: 'population-table-wrap table-responsive' }, table),
      UI.el('p', { className: 'text-muted small population-footnote' }, [
        '淨遷移率依人口估算（每千人）；識字率、健康平均餘命等指標部分國家無最新公開資料，列表中以 — 表示。',
        ' ',
        UI.el('a', { href: data.sourceUrl, target: '_blank', rel: 'noopener' }, 'World Bank Open Data'),
      ]),
      detail,
    ]));

    renderSummary();
    updateHeader();
    renderTable();
  };

  R['coat-of-arms'] = function (app) {
    const data = window.WA_COAT_OF_ARMS;
    if (!data || !data.regions || !data.regions.length) {
      mount(app, [UI.panel('國家徽章', UI.el('p', { className: 'text-muted' }, '徽章資料載入失敗，請重新整理頁面。'))]);
      return;
    }

    const total = data.regions.reduce((n, r) => n + r.countries.length, 0);
    let selectedCard = null;

    const detail = UI.el('div', { className: 'world-flags-dock', id: 'coa-detail', hidden: true }, [
      UI.el('p', { className: 'text-muted mb-0 world-flags-dock-hint' }, '點選徽章可查看說明。'),
    ]);

    function setDockOpen(open) {
      detail.hidden = !open;
      detail.classList.toggle('is-visible', open);
      app.classList.toggle('world-flags-has-dock', open);
    }

    function renderTitle(country) {
      const titleParts = [country.nameZh];
      if (country.code) {
        titleParts.push(UI.el('span', { className: 'world-flags-code-inline' }, country.code.toUpperCase()));
      }
      return UI.el('h4', { className: 'world-flags-dock-title' }, titleParts);
    }

    function renderNameLine(country) {
      const parts = [];
      if (country.coatName) {
        parts.push(UI.el('span', { className: 'world-flags-dock-en' }, country.coatName));
      } else if (country.nameEn && country.nameEn !== country.nameZh) {
        parts.push(UI.el('span', { className: 'world-flags-dock-en' }, country.nameEn));
      }
      if (country.coatType) {
        if (parts.length) parts.push(UI.el('span', { className: 'world-flags-dock-sep', 'aria-hidden': 'true' }, '·'));
        parts.push(UI.el('span', { className: 'world-flags-dock-native' }, country.coatType));
      }
      if (!parts.length) return null;
      return UI.el('p', { className: 'world-flags-dock-names' }, parts);
    }

    function isGenericCoatField(field, text) {
      if (!text) return true;
      if (field === 'symbols') return /承載.+的主權與國家認同/.test(text);
      if (field === 'history') return /徽章隨國家獨立、政體更迭/.test(text);
      if (field === 'composition') return /^(採用歐洲紋章學結構|採用圓形國徽構圖|國家徽章通常以盾徽)/.test(text);
      return false;
    }

    function buildCoaSections(country) {
      const candidates = [
        { title: '核心象徵與意義', field: 'symbols', text: country.symbols },
        { title: '歷史由來與演變', field: 'history', text: country.history },
        { title: '設計構圖與元素', field: 'composition', text: country.composition },
      ];
      return candidates.filter((item) => item.text && !isGenericCoatField(item.field, item.text));
    }

    function sectionBlock(title, text) {
      if (!text) return null;
      return UI.el('div', { className: 'coa-dock-section' }, [
        UI.el('h5', { className: 'coa-dock-section-title' }, title),
        UI.el('p', { className: 'world-flags-dock-desc' }, text),
      ]);
    }

    function showDetail(country, cardEl) {
      if (selectedCard) selectedCard.classList.remove('is-selected');
      selectedCard = cardEl || null;
      if (selectedCard) selectedCard.classList.add('is-selected');

      const imgNode = country.image
        ? UI.bindImageZoom(UI.el('img', {
          className: 'world-flags-dock-img coa-dock-img',
          src: siteMediaUrl(country.image),
          alt: country.coatName || country.nameZh,
          loading: 'lazy',
        }), { caption: country.coatName || country.nameZh })
        : UI.el('div', { className: 'world-flags-dock-img coa-dock-img coa-dock-img-fallback' }, country.code?.toUpperCase() || '?');

      detail.replaceChildren(
        UI.el('div', { className: 'world-flags-dock-inner' }, [
          UI.el('div', { className: 'world-flags-dock-head' }, [
            imgNode,
            UI.el('div', { className: 'world-flags-dock-head-text' }, [
              renderTitle(country),
              renderNameLine(country),
            ]),
            UI.el('button', {
              type: 'button',
              className: 'world-flags-dock-close',
              title: '收合',
              'aria-label': '收合詳情',
              onClick: () => {
                if (selectedCard) selectedCard.classList.remove('is-selected');
                selectedCard = null;
                setDockOpen(false);
              },
            }, '×'),
          ]),
          UI.el('div', { className: 'world-flags-dock-body coa-dock-body' }, (() => {
            const sections = buildCoaSections(country);
            if (!sections.length) {
              return [UI.el('p', { className: 'world-flags-dock-desc coa-dock-empty' },
                '暫無詳細國徽說明。圖示供視覺辨識；若需深度背景，建議查閱該國政府或外交機關公開資料。')];
            }
            return sections.map((section, index) => sectionBlock(
              sections.length > 1 ? `${index + 1}. ${section.title}` : section.title,
              section.text
            ));
          })()),
        ])
      );
      const body = detail.querySelector('.world-flags-dock-body');
      if (body) body.scrollTop = 0;
      setDockOpen(true);
    }

    function makeCard(country) {
      const imgChild = country.image
        ? UI.el('img', {
          className: 'world-flags-img coa-card-img',
          src: siteMediaUrl(country.image),
          alt: country.nameZh,
          loading: 'lazy',
        })
        : UI.el('span', { className: 'coa-card-img-fallback' }, country.code?.toUpperCase() || '—');

      return UI.el('button', {
        type: 'button',
        className: 'world-flags-card coa-card',
        title: country.coatName || country.nameZh,
        dataset: {
          nameZh: country.nameZh,
          nameEn: country.nameEn || '',
          code: country.code || '',
          coatName: country.coatName || '',
        },
        onClick: (e) => showDetail(country, e.currentTarget),
      }, [
        imgChild,
        UI.el('span', { className: 'world-flags-name' }, [
          country.nameZh,
          country.code
            ? UI.el('span', { className: 'world-flags-code-inline' }, country.code.toUpperCase())
            : null,
        ]),
        country.coatName
          ? UI.el('span', { className: 'world-flags-name-en' }, country.coatName)
          : (country.nameEn && country.nameEn !== country.nameZh
            ? UI.el('span', { className: 'world-flags-name-en' }, country.nameEn)
            : null),
      ]);
    }

    function makeRegionSection(region) {
      const grid = UI.el('div', {
        className: 'world-flags-grid',
        id: `coa-region-${region.id}`,
        dataset: { region: region.id },
      }, region.countries.map(makeCard));

      return UI.el('section', { className: 'world-flags-region' }, [
        UI.el('h3', { className: 'world-flags-region-title' }, [
          region.label,
          UI.el('span', { className: 'world-flags-region-count' }, `${region.countries.length}`),
        ]),
        grid,
      ]);
    }

    const search = UI.el('input', {
      type: 'search',
      className: 'form-control tool-input world-flags-search',
      id: 'coa-search',
      placeholder: '搜尋國家或徽章名稱…',
      autocomplete: 'off',
    });

    const nav = UI.el('div', { className: 'world-flags-nav' }, data.regions.map((region) =>
      UI.el('a', {
        className: 'world-flags-nav-link',
        href: `#coa-region-${region.id}`,
      }, `${region.label} (${region.countries.length})`)
    ));

    const introMeta = UI.el('p', {
      className: 'text-muted world-flags-intro-meta',
      id: 'coa-intro-meta',
    }, `共 ${total} 個國家與地區 · ${data.imageCount || 0} 枚徽章圖`);

    const searchMeta = UI.el('p', {
      className: 'text-muted world-flags-search-meta',
      id: 'coa-meta',
      hidden: true,
    }, '');

    const regionToggle = UI.el('button', {
      type: 'button',
      className: 'world-flags-region-toggle',
      id: 'coa-region-toggle',
      title: '選擇洲別',
      'aria-expanded': 'false',
      'aria-controls': 'coa-nav',
    }, '洲');

    const searchRow = UI.el('div', { className: 'world-flags-toolbar-row' }, [search, regionToggle]);
    const navWrap = UI.el('div', { className: 'world-flags-nav-wrap', id: 'coa-nav' }, [nav]);

    const toolbar = UI.el('div', { className: 'world-flags-toolbar', id: 'coa-toolbar' }, [
      introMeta,
      searchRow,
      searchMeta,
      navWrap,
    ]);

    regionToggle.addEventListener('click', () => {
      const open = toolbar.classList.toggle('is-nav-open');
      regionToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        toolbar.classList.remove('is-nav-open');
        regionToggle.setAttribute('aria-expanded', 'false');
      });
    });

    const scrollSentinel = UI.el('div', {
      className: 'world-flags-scroll-sentinel',
      'aria-hidden': 'true',
    });

    const regionsWrap = UI.el('div', { className: 'world-flags-regions', id: 'coa-regions' },
      data.regions.map(makeRegionSection)
    );

    function filterItems() {
      const q = search.value.trim().toLowerCase();
      let visible = 0;
      regionsWrap.querySelectorAll('.world-flags-region').forEach((section) => {
        let regionVisible = 0;
        section.querySelectorAll('.world-flags-card').forEach((card) => {
          const zh = (card.dataset.nameZh || '').toLowerCase();
          const en = (card.dataset.nameEn || '').toLowerCase();
          const code = (card.dataset.code || '').toLowerCase();
          const coat = (card.dataset.coatName || '').toLowerCase();
          const match = !q || zh.includes(q) || en.includes(q) || code.includes(q) || coat.includes(q);
          card.hidden = !match;
          if (match) regionVisible += 1;
        });
        section.hidden = regionVisible === 0;
        const countEl = section.querySelector('.world-flags-region-count');
        if (countEl) countEl.textContent = String(regionVisible);
        visible += regionVisible;
      });
      navWrap.hidden = !!q;
      regionToggle.hidden = !!q;
      if (searchMeta) {
        if (q) {
          searchMeta.hidden = false;
          searchMeta.textContent = `找到 ${visible} 個符合「${search.value.trim()}」的結果`;
        } else {
          searchMeta.hidden = true;
        }
      }
    }

    search.addEventListener('input', filterItems);

    mount(app, [
      UI.panel('國家徽章', [
        scrollSentinel,
        toolbar,
        regionsWrap,
      ]),
      detail,
    ]);
    app.classList.add('world-flags-app', 'coat-of-arms-app');

    const stickyTop = () => {
      const root = getComputedStyle(document.documentElement);
      return root.getPropertyValue('--header-offset').trim()
        || getComputedStyle(app).getPropertyValue('--wf-sticky-top').trim()
        || '72px';
    };

    const onStickyCompactChange = ([entry]) => {
      const compact = !entry.isIntersecting;
      toolbar.classList.toggle('is-compact', compact);
      if (!compact) {
        toolbar.classList.remove('is-nav-open');
        regionToggle.setAttribute('aria-expanded', 'false');
      }
    };

    const makeStickyObserver = () => new IntersectionObserver(onStickyCompactChange, {
      root: null,
      threshold: 0,
      rootMargin: `-${stickyTop()} 0px 0px 0px`,
    });

    let scrollObserver = makeStickyObserver();
    scrollObserver.observe(scrollSentinel);

    const refreshStickyObserver = () => {
      scrollObserver.disconnect();
      scrollObserver = makeStickyObserver();
      scrollObserver.observe(scrollSentinel);
    };

    window.addEventListener('resize', refreshStickyObserver);
    window.addEventListener('mytoolife:header-offset', refreshStickyObserver);
  };

  R['ethnic-china'] = function (app) {
    const rows = ["漢族","壯族","滿族","回族","苗族","維吾爾族","土家族","彝族","蒙古族","藏族","布依族","侗族","瑤族","朝鮮族","白族","哈尼族","哈薩克族","黎族","傣族","畲族","傈僳族","仡佬族","東鄉族","高山族","拉祜族","水族","佤族","納西族","羌族","土族","仫佬族","錫伯族","柯爾克孜族","達斡爾族","景頗族","毛南族","撒拉族","布朗族","塔吉克族","阿昌族","普米族","鄂溫克族","怒族","京族","基諾族","德昂族","保安族","俄羅斯族","裕固族","烏孜別克族","門巴族","鄂倫春族","獨龍族","塔塔爾族","赫哲族","珞巴族"].map((e, i) => ({ no: i + 1, name: e }));
    mount(app, [UI.panel('56 個民族', UI.tableFrom(rows, [
      { key: 'no', label: '#' }, { key: 'name', label: '民族' },
    ]))]);
  };

  R['national-anthem'] = function (app) {
    const data = window.WA_NATIONAL_ANTHEMS;
    const audioData = window.WA_NATIONAL_ANTHEM_AUDIO;
    const audioByCode = audioData?.byCode || {};
    let activePlayer = null;
    if (!data || !data.anthems || !data.anthems.length) {
      mount(app, [UI.panel('各國國歌', UI.el('p', { className: 'text-muted' }, '國歌資料載入失敗，請重新整理頁面。'))]);
      return;
    }

    const anthems = data.anthems.slice();
    const anthemMap = new Map(anthems.map((a) => [a.code, a]));
    const regions = data.regions || [];
    let selectedCard = null;

    const detail = UI.el('div', { className: 'world-flags-dock anthem-dock', id: 'anthem-detail', hidden: true }, [
      UI.el('p', { className: 'text-muted mb-0 world-flags-dock-hint' }, '點選國家可查看完整歌詞。'),
    ]);

    function setDockOpen(open) {
      detail.hidden = !open;
      detail.classList.toggle('is-visible', open);
      app.classList.toggle('world-flags-has-dock', open);
    }

    function cjkRatio(text) {
      const t = String(text || '').replace(/\s/g, '');
      if (!t.length) return 0;
      return (t.match(/[\u4e00-\u9fff]/g) || []).length / t.length;
    }

    function isSectionMarker(line) {
      const t = (line || '').trim();
      if (!t) return true;
      if (/^副歌$/i.test(t) || /^refrain$/i.test(t) || /^chorus$/i.test(t)) return true;
      if (/^[IVXLC]{1,4}$/.test(t)) return true;
      return false;
    }

    function sanitizeLine(line) {
      if (!line) return '';
      const t = line.trim();
      if (!t) return '';
      if (isSectionMarker(t)) return '';
      if (/^\{\||wikitable|toccolours|valign\s*=|bgcolor\s*=|colspan\s*=|rowspan\s*=|^\!\s|italic=no\|/i.test(t)) {
        return '';
      }
      if (/^===\s*.+\s*===$/.test(t)) return '';
      if (/^\|/.test(t) && cjkRatio(t) < 0.2) return '';
      if (/^第\d+段$/i.test(t)) return '';
      return line;
    }

    function normAnthemName(value) {
      return (value || '').trim().replace(/\s+/g, ' ');
    }

    function isPlaceholderLyric(line, entry) {
      const t = normAnthemName(line);
      if (!t) return true;
      if (/^（/.test(t) && /暫無|整理中|待補|公開完整|Wikidata/i.test(t)) return true;
      if (t === '（中文對照整理中）') return true;
      const names = [entry.anthem, entry.anthemOriginal, entry.country, entry.countryEn]
        .map(normAnthemName)
        .filter(Boolean);
      return names.includes(t);
    }

    function lyricLines(text, entry) {
      return (text || '')
        .split('\n')
        .map((line) => sanitizeLine(line.trim().replace(/\}\}/g, '')))
        .filter((line) => line && !isPlaceholderLyric(line, entry));
    }

    function verseHasContent(verse, entry) {
      return lyricLines(verse.original, entry).length > 0 || lyricLines(verse.zh, entry).length > 0;
    }

    function buildDockNameNodes(entry) {
      const zhName = normAnthemName(entry.anthem);
      const nativeName = normAnthemName(entry.anthemOriginal || entry.countryEn);
      if (zhName && nativeName && zhName === nativeName) {
        return [
          UI.el('span', {
            className: 'world-flags-dock-native',
            lang: entry.lang || undefined,
          }, nativeName),
        ];
      }
      const nodes = [];
      if (entry.anthem) nodes.push(UI.el('span', { className: 'world-flags-dock-en' }, entry.anthem));
      if (entry.anthem && nativeName) {
        nodes.push(UI.el('span', { className: 'world-flags-dock-sep', 'aria-hidden': 'true' }, '·'));
      }
      if (nativeName) {
        nodes.push(UI.el('span', {
          className: 'world-flags-dock-native',
          lang: entry.lang || undefined,
        }, entry.anthemOriginal || entry.countryEn));
      }
      return nodes;
    }

    function renderPairedLines(original, zh, official, entry) {
      const origLines = lyricLines(original, entry);
      const zhLines = lyricLines(zh, entry);
      const lineClass = official ? 'anthem-line anthem-line-official' : 'anthem-line';
      const zhClass = official ? 'anthem-line anthem-line-zh anthem-line-official' : 'anthem-line anthem-line-zh';

      if (!origLines.length && !zhLines.length) return [];

      const count = Math.max(origLines.length, zhLines.length);
      return Array.from({ length: count }, (_, i) => {
        const oLine = origLines[i];
        const zLine = zhLines[i];
        const parts = [];
        if (oLine) parts.push(UI.el('p', { className: lineClass, lang: entry.lang || undefined }, oLine));
        if (zLine) parts.push(UI.el('p', { className: zhClass }, zLine));
        if (!parts.length) return null;
        return UI.el('div', { className: 'anthem-line-pair' }, parts);
      }).filter(Boolean);
    }

    function renderVerse(verse, entry) {
      const pairs = renderPairedLines(verse.original, verse.zh, verse.official, entry);
      if (!pairs.length) return null;
      return UI.el('div', {
        className: verse.official ? 'anthem-verse anthem-verse-official' : 'anthem-verse',
      }, [
        UI.el('h5', { className: 'anthem-verse-label' }, verse.label),
        UI.el('div', { className: 'anthem-verse-pairs', lang: entry.lang || undefined }, pairs),
      ]);
    }

    function buildPlayerBlock(entry) {
      const meta = audioByCode[entry.code];
      if (!meta?.url) return null;
      const video = UI.el('video', {
        className: 'anthem-player',
        controls: true,
        preload: 'none',
        playsInline: true,
        title: meta.title || entry.anthem,
      });
      video.appendChild(UI.el('source', { src: meta.url, type: 'video/mp4' }));
      activePlayer = video;
      return UI.el('div', { className: 'anthem-player-block' }, [video]);
    }

    function showDetail(entry, cardEl) {
      if (activePlayer) {
        activePlayer.pause();
        activePlayer = null;
      }
      if (selectedCard) selectedCard.classList.remove('is-selected');
      selectedCard = cardEl || null;
      if (selectedCard) selectedCard.classList.add('is-selected');

      detail.replaceChildren(
        UI.el('div', { className: 'world-flags-dock-inner' }, [
          UI.el('div', { className: 'world-flags-dock-head anthem-dock-head' }, [
            UI.el('div', { className: 'anthem-dock-icon', 'aria-hidden': 'true' }, '♪'),
            UI.el('div', { className: 'world-flags-dock-head-text' }, [
              UI.el('h4', { className: 'world-flags-dock-title' }, [
                entry.country,
                entry.code ? UI.el('span', { className: 'world-flags-code-inline' }, entry.code.toUpperCase()) : null,
              ]),
              UI.el('p', { className: 'world-flags-dock-names' }, buildDockNameNodes(entry)),
            ]),
            UI.el('button', {
              type: 'button',
              className: 'world-flags-dock-close',
              title: '收合',
              'aria-label': '收合詳情',
              onClick: () => {
                if (selectedCard) selectedCard.classList.remove('is-selected');
                selectedCard = null;
                setDockOpen(false);
              },
            }, '×'),
          ]),
          UI.el('div', { className: 'world-flags-dock-body anthem-dock-body' }, [
            buildPlayerBlock(entry),
            ...(entry.verses || []).map((verse) => renderVerse(verse, entry)).filter(Boolean),
          ].filter(Boolean)),
        ])
      );
      const body = detail.querySelector('.world-flags-dock-body');
      if (body) body.scrollTop = 0;
      setDockOpen(true);
    }

    function makeCard(entry) {
      const officialVerse = (entry.verses || []).find((v) => v.official);
      const hasLyrics = (entry.verses || []).some((v) => verseHasContent(v, entry));
      const officialLabel = officialVerse && hasLyrics
        ? officialVerse.label.replace(/（國際標準）/, '').trim()
        : '';
      return UI.el('button', {
        type: 'button',
        className: 'anthem-card',
        title: entry.anthem,
        dataset: {
          country: entry.country,
          code: entry.code || '',
          anthem: entry.anthem,
          region: entry.regionId || '',
        },
        onClick: (e) => showDetail(entry, e.currentTarget),
      }, [
        UI.el('span', { className: 'anthem-card-code' }, entry.code?.toUpperCase() || '—'),
        UI.el('span', { className: 'anthem-card-country' }, entry.country),
        UI.el('span', { className: 'anthem-card-name' }, entry.anthem),
        officialLabel && officialLabel !== '歌詞'
          ? UI.el('span', { className: 'anthem-card-official' }, officialLabel)
          : null,
        audioByCode[entry.code]
          ? UI.el('span', { className: 'anthem-card-audio' }, '♪ 可播放')
          : null,
      ]);
    }

    function makeRegionSection(region) {
      const regionAnthems = anthems.filter((a) => a.regionId === region.id);
      const grid = UI.el('div', {
        className: 'anthem-grid',
        id: `anthem-region-${region.id}`,
        dataset: { region: region.id },
      }, regionAnthems.map(makeCard));

      return UI.el('section', { className: 'world-flags-region anthem-region' }, [
        UI.el('h3', { className: 'world-flags-region-title' }, [
          region.label,
          UI.el('span', { className: 'world-flags-region-count' }, `${regionAnthems.length}`),
        ]),
        grid,
      ]);
    }

    const search = UI.el('input', {
      type: 'search',
      className: 'form-control tool-input anthem-search world-flags-search',
      id: 'anthem-search',
      placeholder: '搜尋國家、國歌名稱…',
      autocomplete: 'off',
    });

    const searchMeta = UI.el('p', {
      className: 'text-muted anthem-search-meta world-flags-search-meta',
      id: 'anthem-meta',
      hidden: true,
    }, '');

    const nav = UI.el('div', { className: 'world-flags-nav' }, regions.map((region) => {
      const count = anthems.filter((a) => a.regionId === region.id).length;
      return UI.el('a', {
        className: 'world-flags-nav-link',
        href: `#anthem-region-${region.id}`,
      }, `${region.label} (${count})`);
    }));

    const regionToggle = UI.el('button', {
      type: 'button',
      className: 'world-flags-region-toggle',
      id: 'anthem-region-toggle',
      title: '選擇洲別',
      'aria-expanded': 'false',
      'aria-controls': 'anthem-nav',
    }, '洲');

    const navWrap = UI.el('div', { className: 'world-flags-nav-wrap', id: 'anthem-nav' }, [nav]);

    const toolbar = UI.el('div', {
      className: 'world-flags-toolbar anthem-toolbar is-compact',
      id: 'anthem-toolbar',
    }, [
      UI.el('div', { className: 'world-flags-toolbar-row' }, [search, regionToggle]),
      searchMeta,
      navWrap,
    ]);

    regionToggle.addEventListener('click', () => {
      const open = toolbar.classList.toggle('is-nav-open');
      regionToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        toolbar.classList.remove('is-nav-open');
        regionToggle.setAttribute('aria-expanded', 'false');
      });
    });

    const regionsWrap = UI.el('div', { className: 'world-flags-regions anthem-regions', id: 'anthem-regions' },
      regions.map(makeRegionSection)
    );

    function filterItems() {
      const q = search.value.trim().toLowerCase();
      let visible = 0;
      regionsWrap.querySelectorAll('.anthem-region').forEach((section) => {
        let regionVisible = 0;
        section.querySelectorAll('.anthem-card').forEach((card) => {
          const entry = anthemMap.get(card.dataset.code);
          if (!entry) return;
          const hay = [
            entry.country, entry.countryEn, entry.anthem, entry.anthemOriginal, entry.code,
          ].join(' ').toLowerCase();
          const match = !q || hay.includes(q);
          card.hidden = !match;
          if (match) regionVisible += 1;
        });
        section.hidden = regionVisible === 0;
        const countEl = section.querySelector('.world-flags-region-count');
        if (countEl) countEl.textContent = String(regionVisible);
        visible += regionVisible;
      });
      navWrap.hidden = !!q;
      regionToggle.hidden = !!q;
      if (searchMeta) {
        if (q) {
          searchMeta.hidden = false;
          searchMeta.textContent = `找到 ${visible} 首符合「${search.value.trim()}」的國歌`;
        } else {
          searchMeta.hidden = true;
          searchMeta.textContent = '';
        }
      }
    }

    search.addEventListener('input', filterItems);

    app.className = 'tool-app anthem-app world-flags-app';
    app.replaceChildren(UI.el('div', { className: 'tool-form-inner anthem-app-inner' }, [
      UI.el('div', { className: 'anthem-intro tool-panel-card' }, [
        UI.el('p', { className: 'anthem-intro-lead mb-0' }, '點選國家可查看歌詞；有音源的國家可在詳情面板直接試聽。'),
      ]),
      toolbar,
      regionsWrap,
      detail,
    ]));
  };

  R['ufo'] = function (app) {
    const data = window.WA_UFO;
    if (!data || !data.sections || !data.sections.length) {
      mount(app, [UI.panel('外星種族', UI.el('p', { className: 'text-muted' }, '資料載入失敗，請重新整理頁面。'))]);
      return;
    }

    function makeTag(text) {
      return UI.el('span', { className: 'ufo-tag' }, text);
    }

    function makeCard(item) {
      const img = item.image
        ? UI.bindImageZoom(UI.el('img', {
          className: 'ufo-card-img',
          src: siteMediaUrl(item.image),
          alt: item.title,
          loading: 'lazy',
        }), { caption: item.title, title: '點擊放大' })
        : null;

      return UI.el('article', { className: 'ufo-card' }, [
        img,
        UI.el('div', { className: 'ufo-card-body' }, [
          UI.el('h4', { className: 'ufo-card-title' }, item.title),
          item.subtitle
            ? UI.el('p', { className: 'ufo-card-sub' }, item.subtitle)
            : null,
          UI.el('p', { className: 'ufo-card-desc' }, item.desc),
          item.tags && item.tags.length
            ? UI.el('div', { className: 'ufo-card-tags' }, item.tags.map(makeTag))
            : null,
        ]),
      ]);
    }

    function makeSection(section) {
      return UI.el('section', {
        className: 'ufo-section',
        id: `ufo-${section.id}`,
      }, [
        UI.el('h3', { className: 'ufo-section-title' }, section.title),
        section.intro
          ? UI.el('p', { className: 'ufo-section-intro' }, section.intro)
          : null,
        UI.el('div', { className: 'ufo-grid' }, section.items.map(makeCard)),
      ]);
    }

    const nav = UI.el('nav', { className: 'ufo-nav', 'aria-label': '主題導覽' },
      data.sections.map((section) => UI.el('a', {
        className: 'ufo-nav-link',
        href: `#ufo-${section.id}`,
      }, section.title))
    );

    app.className = 'tool-app ufo-app';
    app.replaceChildren(UI.el('div', { className: 'tool-form-inner ufo-app-inner' }, [
      UI.el('p', { className: 'text-muted ufo-intro' }, data.intro),
      nav,
      ...data.sections.map(makeSection),
      UI.el('p', { className: 'text-muted ufo-disclaimer' }, '以上內容整理自 ufology 社群、科幻設定與公開報導，不代表 Kawatool 立場，亦不等同科學共識。'),
    ]));
  };

  R['monster'] = function (app) {
    const data = window.WA_MONSTERS;
    if (!data || !data.sections || !data.sections.length) {
      mount(app, [UI.panel('妖魔鬼怪', UI.el('p', { className: 'text-muted' }, '資料載入失敗，請重新整理頁面。'))]);
      return;
    }

    function makeTag(text) {
      return UI.el('span', { className: 'monster-tag' }, text);
    }

    function makeCard(item) {
      const img = item.image
        ? UI.bindImageZoom(UI.el('img', {
          className: 'monster-card-img',
          src: siteMediaUrl(item.image),
          alt: item.title,
          loading: 'lazy',
        }), { caption: item.title, title: '點擊放大' })
        : null;

      return UI.el('article', { className: 'monster-card' }, [
        img,
        UI.el('div', { className: 'monster-card-body' }, [
          UI.el('h4', { className: 'monster-card-title' }, item.title),
          item.subtitle
            ? UI.el('p', { className: 'monster-card-sub' }, item.subtitle)
            : null,
          UI.el('p', { className: 'monster-card-desc' }, item.desc),
          item.tags && item.tags.length
            ? UI.el('div', { className: 'monster-card-tags' }, item.tags.map(makeTag))
            : null,
        ]),
      ]);
    }

    function makeSection(section) {
      return UI.el('section', {
        className: 'monster-section',
        id: `monster-${section.id}`,
      }, [
        UI.el('h3', { className: 'monster-section-title' }, section.title),
        section.intro
          ? UI.el('p', { className: 'monster-section-intro' }, section.intro)
          : null,
        UI.el('div', { className: 'monster-grid' }, section.items.map(makeCard)),
      ]);
    }

    const nav = UI.el('nav', { className: 'monster-nav', 'aria-label': '主題導覽' },
      data.sections.map((section) => UI.el('a', {
        className: 'monster-nav-link',
        href: `#monster-${section.id}`,
      }, section.title))
    );

    app.className = 'tool-app monster-app';
    app.replaceChildren(UI.el('div', { className: 'tool-form-inner monster-app-inner' }, [
      UI.el('p', { className: 'text-muted monster-intro' }, data.intro),
      nav,
      ...data.sections.map(makeSection),
      UI.el('p', { className: 'text-muted monster-disclaimer' }, '以上內容整理自古籍志怪、民間傳說與影視作品，僅供文化閱讀與娛樂，不代表 Kawatool 立場，亦請勿以之替代專業或安全指引。'),
    ]));
  };

  R['national-symbol'] = function (app) {
    const data = window.WA_NATIONAL_SYMBOLS;
    const items = data?.items || [];
    if (!items.length) {
      mount(app, [UI.panel('各國國寶', UI.el('p', { className: 'text-muted' }, '資料載入失敗，請重新整理頁面。'))]);
      return;
    }

    function makeRoleTag(role) {
      return UI.el('span', { className: 'nsym-role-tag' }, role || '象徵');
    }

    function makeCard(item) {
      const title = `${item.countryLabel || item.countryZh} · ${item.nameShort || item.nameZh}`;
      const img = item.image
        ? UI.bindImageZoom(UI.el('img', {
          className: 'nsym-card-img',
          src: siteMediaUrl(item.image),
          alt: title,
          loading: 'lazy',
        }), { caption: title, title: '點擊放大' })
        : null;

      const metaLines = [];
      if (item.nameZh) metaLines.push(UI.el('p', { className: 'nsym-meta-line' }, [
        UI.el('span', { className: 'nsym-meta-key' }, '中文'),
        document.createTextNode(` ${item.nameZh}`),
      ]));
      if (item.nameEn) metaLines.push(UI.el('p', { className: 'nsym-meta-line' }, [
        UI.el('span', { className: 'nsym-meta-key' }, '英文'),
        document.createTextNode(` ${item.nameEn}`),
      ]));
      if (item.scientific) metaLines.push(UI.el('p', { className: 'nsym-meta-line nsym-meta-sci' }, [
        UI.el('span', { className: 'nsym-meta-key' }, '學名'),
        UI.el('em', {}, item.scientific),
      ]));
      if (item.alias) metaLines.push(UI.el('p', { className: 'nsym-meta-line text-muted small' }, [
        UI.el('span', { className: 'nsym-meta-key' }, '又稱'),
        document.createTextNode(` ${item.alias}`),
      ]));

      const wikiLink = item.wiki
        ? UI.el('a', {
          className: 'nsym-wiki-link small',
          href: item.wiki,
          target: '_blank',
          rel: 'noopener noreferrer',
        }, '維基百科 ↗')
        : null;

      return UI.el('article', { className: 'nsym-card' }, [
        img,
        UI.el('div', { className: 'nsym-card-body' }, [
          UI.el('div', { className: 'nsym-card-head' }, [
            UI.el('h4', { className: 'nsym-card-title' }, item.countryLabel || item.countryZh),
            makeRoleTag(item.role),
          ]),
          UI.el('p', { className: 'nsym-card-sub' }, item.nameShort || item.nameZh),
          UI.el('div', { className: 'nsym-meta' }, metaLines),
          wikiLink,
        ]),
      ]);
    }

    function itemHaystack(item) {
      return [
        item.countryZh,
        item.countryEn,
        item.countryLabel,
        item.role,
        item.nameShort,
        item.nameZh,
        item.nameEn,
        item.scientific,
        item.alias,
      ].join(' ').toLowerCase();
    }

    const searchInput = UI.el('input', {
      type: 'search',
      className: 'form-control nsym-search',
      placeholder: '搜尋國家、國獸、國鳥或物種名稱…',
    });
    const grid = UI.el('div', { className: 'nsym-grid' });
    const countEl = UI.el('p', { className: 'text-muted small nsym-count' }, '');

    function render(filter) {
      const q = (filter || '').trim().toLowerCase();
      const matched = q ? items.filter((item) => itemHaystack(item).includes(q)) : items;
      grid.replaceChildren(...matched.map(makeCard));
      countEl.textContent = q
        ? `找到 ${matched.length} / ${items.length} 筆`
        : `共 ${items.length} 筆國家象徵`;
      if (!matched.length) {
        grid.appendChild(UI.el('p', { className: 'text-muted small nsym-empty' }, '找不到符合的項目，請換個關鍵字。'));
      }
    }

    searchInput.addEventListener('input', () => render(searchInput.value));

    app.className = 'tool-app nsym-app';
    app.replaceChildren(UI.el('div', { className: 'tool-form-inner nsym-app-inner' }, [
      UI.el('p', { className: 'text-muted nsym-intro' }, data.intro),
      UI.el('ul', { className: 'tool-checklist text-muted small nsym-checklist' }, [
        UI.el('li', {}, '收錄各國國獸、國鳥、國魚等法定或慣用象徵物種。'),
        UI.el('li', {}, '點擊照片可放大；附中文、英文、學名與維基百科連結。'),
        UI.el('li', {}, '資料整理自 ifreesite，圖片來源同頁面（均已小於 1MB）。'),
      ]),
      countEl,
      UI.el('div', { className: 'tool-field nsym-filter' }, searchInput),
      grid,
      data.disclaimer
        ? UI.el('p', { className: 'text-muted small nsym-disclaimer' }, data.disclaimer)
        : null,
    ]));

    render('');
  };

})();
