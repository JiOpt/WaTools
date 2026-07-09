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

  const ZH_PAIRS = '臺台,愛爱,國国,學学,體体,會会,來来,對对,時时,間间,長长,開开,關关,電电,車车,東东,門门,問问,聽听,見见,說说,讀读,寫写,語语,話话,這这,還还,進进,過过,發发,經经,現现,實实,業业,產产,價价,買买,賣卖,點点,無无,為为,與与,從从,後后,裡里,當当,將将,應应,變变,動动,場场,報报,導导,環环,歷历,歲岁,難难,輕轻,歡欢,樂乐,愛爱,親亲,廣广,廠厂,藥药,醫医,護护,軍军,戰战,勝胜,負负,責责,權权,義义,議议,選选,舉举,黨党,團团,組组,織织,網网,線线,號号,碼码,錢钱,銀银,鐵铁,銅铜,飛飞,機机,廣广,視视,聯联,繫系,總总,類类,種种,質质,標标,準准,計计,認认,識识,記记,設设,計计,試试,驗验,證证,據据,擴扩,縮缩,壓压,溫温,濕湿,氣气,風风,雲云,電电,聲声,顏颜,圖图,畫画,書书,紙纸,筆笔,墨墨,畫画,藝艺,術术,創创,造造,建建,築筑,設设,計计,裝装,修修,護护,養养,護护,衛卫,員员,師师,長长,員员,隊队,組组,織织,網网,線线,號号,碼码,錢钱,銀银,鐵铁,銅铜,飛飞,機机,廣广,視视,聯联,繫系,總总,類类,種种,質质,標标,準准,計计,認认,識识,記记,設设,計计,試试,驗验,證证,據据,擴扩,縮缩,壓压,溫温,濕湿,氣气,風风,雲云,電电,聲声,顏颜,圖图,畫画,書书,紙纸,筆笔,墨墨,畫画,藝艺,術术,創创,造造,建建,築筑,設设,計计,裝装,修修,護护,養养,護护,衛卫,員员,師师,長长,員员,隊队,組组,織织,網网,線线,號号,碼码,錢钱,銀银,鐵铁,銅铜,飛飞,機机,廣广,視视,聯联,繫系,總总,類类,種种,質质,標标,準准,計计,認认,識识,記记,設设,計计,試试,驗验,證证,據据,擴扩,縮缩,壓压,溫温,濕湿,氣气,風风,雲云,電电,聲声,顏颜,圖图,畫画,書书,紙纸,筆笔,墨墨,畫画,藝艺,術术,創创,造造,建建,築筑,設设,計计,裝装,修修,護护,養养,護护,衛卫,員员,師师,長长,員员,隊队'.split(',').map((p) => [p[0], p[1]]);
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
    { key: 'S', name: '尸', shape: '尸' }, { key: 'T', name: '廿', shape: '廿' }, { key: 'U', name: '山', shape: '山' },
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
      { t: '注音輸入法', d: '以 37 個注音符號拼讀，台灣常用。', link: '/bopomofo-chart' },
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
    const prefixes = ['✨', '🌟', '💫', ''];
    const suffixes = ['', '～', '！', '♡'];
    const out = UI.output('sg-out');
    mount(app, [UI.panel('表情符號產生器', [
      UI.input('文字', 'sg-in', 'text', '輸入文字…'),
      UI.btn('產生', 'btn btn-primary', () => {
        const t = document.getElementById('sg-in').value || '你好';
        out.textContent = UI.randomChoice(prefixes) + t + UI.randomChoice(suffixes);
      }),
      UI.btnGroup([UI.copyBtn(() => out.textContent)]), out,
    ])]);
  };

  R['keyboard-symbols'] = function (app) {
    mount(app, [UI.panel('特殊符號', [
      UI.tableFrom(SYMBOLS, [{ key: 'sym', label: '符號' }, { key: 'name', label: '名稱' }]),
      UI.el('p', { className: 'text-muted small' }, '點選表格中的符號後複製使用。'),
    ])]);
  };

  R['emoji'] = function (app) {
    mount(app, [UI.panel('Emoji 分類', UI.tableFrom([{"cat":"笑臉","em":"😀 😃 😄 😁 😆"},{"cat":"手勢","em":"👍 👎 👋 ✌️ 🤞"},{"cat":"動物","em":"🐶 🐱 🐭 🐹 🐰"},{"cat":"食物","em":"🍎 🍕 🍔 🍣 🍜"},{"cat":"自然","em":"🌸 🌞 🌙 ⭐ 🌈"},{"cat":"物品","em":"💡 📱 💻 🎵 ⚽"}], [
      { key: 'cat', label: '分類' }, { key: 'em', label: '表情' },
    ]))]);
  };

  R['punctuation'] = function (app) {
    mount(app, [UI.panel('標點符號', UI.tableFrom([{"sym":"。","name":"句號"},{"sym":"，","name":"逗號"},{"sym":"、","name":"頓號"},{"sym":"；","name":"分號"},{"sym":"：","name":"冒號"},{"sym":"？","name":"問號"},{"sym":"！","name":"驚嘆號"},{"sym":"「","name":"左單引號"},{"sym":"」","name":"右單引號"},{"sym":"『","name":"左雙引號"},{"sym":"』","name":"右雙引號"},{"sym":"…","name":"刪節號"}], [
      { key: 'sym', label: '符號' }, { key: 'name', label: '名稱' },
    ]))]);
  };

  R['symbols-name'] = function (app) {
    mount(app, [UI.panel('符號名稱', UI.tableFrom([{"sym":"。","name":"句號"},{"sym":"，","name":"逗號"},{"sym":"、","name":"頓號"},{"sym":"；","name":"分號"},{"sym":"：","name":"冒號"},{"sym":"？","name":"問號"},{"sym":"！","name":"驚嘆號"},{"sym":"「","name":"左單引號"},{"sym":"」","name":"右單引號"},{"sym":"『","name":"左雙引號"},{"sym":"』","name":"右雙引號"},{"sym":"…","name":"刪節號"},{"sym":"★","name":"實心星"},{"sym":"☆","name":"空心星"},{"sym":"♥","name":"愛心"},{"sym":"♦","name":"菱形"},{"sym":"♣","name":"梅花"},{"sym":"♠","name":"黑桃"},{"sym":"→","name":"右箭頭"},{"sym":"←","name":"左箭頭"},{"sym":"↑","name":"上箭頭"},{"sym":"↓","name":"下箭頭"},{"sym":"©","name":"版權"},{"sym":"®","name":"註冊"},{"sym":"™","name":"商標"},{"sym":"℃","name":"攝氏"},{"sym":"℉","name":"華氏"},{"sym":"㎡","name":"平方公尺"}], [
      { key: 'sym', label: '符號' }, { key: 'name', label: '名稱' },
    ]))]);
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
    mount(app, [UI.panel('筆畫偏旁', UI.tableFrom([{"stroke":"一","name":"橫"},{"stroke":"丨","name":"豎"},{"stroke":"丿","name":"撇"},{"stroke":"丶","name":"點"},{"stroke":"乙","name":"折"},{"stroke":"亻","name":"单人旁"},{"stroke":"氵","name":"三点水"},{"stroke":"口","name":"口字旁"},{"stroke":"木","name":"木字旁"},{"stroke":"心","name":"心字底"}], [
      { key: 'stroke', label: '形' }, { key: 'name', label: '名稱' },
    ]))]);
  };


  // ===== LIFE =====
  R['time'] = function (app) {
    const box = UI.el('div', { id: 'time-box' });
    function tick() {
      box.replaceChildren(...[{"city":"台北","tz":"Asia/Taipei"},{"city":"東京","tz":"Asia/Tokyo"},{"city":"紐約","tz":"America/New_York"},{"city":"倫敦","tz":"Europe/London"}].map((c) => {
        const t = new Date().toLocaleString('zh-TW', { timeZone: c.tz, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
        return UI.el('div', { className: 'tool-result mb-2' }, c.city + '：' + t);
      }));
    }
    tick(); setInterval(tick, 1000);
    mount(app, [UI.panel('世界時間', [box, UI.el('p', { className: 'text-muted small' }, '台北、東京、紐約、倫敦即時時鐘。')])]);
  };

  R['calendar'] = function (app) {
    const now = new Date();
    const y = now.getFullYear(), m = now.getMonth();
    const first = new Date(y, m, 1).getDay();
    const days = new Date(y, m + 1, 0).getDate();
    let lunar = '';
    try { lunar = new Intl.DateTimeFormat('zh-u-ca-chinese', { month: 'long', day: 'numeric' }).format(now); } catch (e) { lunar = '（農曆需瀏覽器支援）'; }
    const cells = [];
    for (let i = 0; i < first; i++) cells.push('');
    for (let d = 1; d <= days; d++) cells.push(String(d));
    const rows = [];
    for (let i = 0; i < cells.length; i += 7) rows.push({ week: cells.slice(i, i + 7).join(' | ') });
    mount(app, [UI.panel('萬年曆', [
      UI.el('h4', {}, y + ' 年 ' + (m + 1) + ' 月'),
      UI.el('p', {}, '農曆：' + lunar),
      UI.tableFrom(rows, [{ key: 'week', label: '日曆' }]),
    ])]);
  };

  R['solar-terms'] = function (app) {
    mount(app, [UI.panel('二十四節氣', UI.tableFrom([{"term":"立春","date":"2/4 前後"},{"term":"雨水","date":"2/19"},{"term":"驚蟄","date":"3/6"},{"term":"春分","date":"3/21"},{"term":"清明","date":"4/5"},{"term":"穀雨","date":"4/20"},{"term":"立夏","date":"5/6"},{"term":"小滿","date":"5/21"},{"term":"芒種","date":"6/6"},{"term":"夏至","date":"6/21"},{"term":"小暑","date":"7/7"},{"term":"大暑","date":"7/23"},{"term":"立秋","date":"8/8"},{"term":"處暑","date":"8/23"},{"term":"白露","date":"9/8"},{"term":"秋分","date":"9/23"},{"term":"寒露","date":"10/8"},{"term":"霜降","date":"10/24"},{"term":"立冬","date":"11/8"},{"term":"小雪","date":"11/22"},{"term":"大雪","date":"12/7"},{"term":"冬至","date":"12/22"},{"term":"小寒","date":"1/6"},{"term":"大寒","date":"1/20"}], [
      { key: 'term', label: '節氣' }, { key: 'date', label: '約略日期' },
    ]))]);
  };

  R['currency'] = function (app) {
    mount(app, [UI.panel('全球貨幣', UI.tableFrom([{"code":"TWD","name":"新台幣","sym":"NT$"},{"code":"USD","name":"美元","sym":"$"},{"code":"EUR","name":"歐元","sym":"€"},{"code":"JPY","name":"日圓","sym":"¥"},{"code":"CNY","name":"人民幣","sym":"¥"},{"code":"GBP","name":"英鎊","sym":"£"}], [
      { key: 'code', label: '代碼' }, { key: 'name', label: '名稱' }, { key: 'sym', label: '符號' },
    ]))]);
  };

  R['postal'] = function (app) {
    mount(app, [UI.panel('國家代碼與郵編', UI.tableFrom([{"country":"台灣","code":"TW","postal":"3+2 或 5 碼"},{"country":"日本","code":"JP","postal":"000-0000"},{"country":"美國","code":"US","postal":"ZIP 5/9"},{"country":"英國","code":"GB","postal":"字母+數字"}], [
      { key: 'country', label: '國家' }, { key: 'code', label: 'ISO' }, { key: 'postal', label: '郵編格式' },
    ]))]);
  };

  R['area-code'] = function (app) {
    mount(app, [UI.panel('國際電話區碼', UI.tableFrom([{"country":"台灣","code":"+886"},{"country":"日本","code":"+81"},{"country":"美國","code":"+1"},{"country":"英國","code":"+44"},{"country":"中國","code":"+86"},{"country":"香港","code":"+852"}], [
      { key: 'country', label: '國家/地區' }, { key: 'code', label: '區碼' },
    ]))]);
  };

  R['voltage'] = function (app) {
    mount(app, [UI.panel('電壓與插頭', UI.tableFrom([{"country":"台灣","v":"110V","plug":"A/C 型"},{"country":"日本","v":"100V","plug":"A/B 型"},{"country":"美國","v":"120V","plug":"A/B 型"},{"country":"英國","v":"230V","plug":"G 型"},{"country":"歐洲","v":"230V","plug":"C/F 型"}], [
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
    mount(app, [UI.panel('汽車品牌', UI.tableFrom([{"brand":"Toyota","country":"日本"},{"brand":"Honda","country":"日本"},{"brand":"BMW","country":"德國"},{"brand":"Mercedes-Benz","country":"德國"},{"brand":"Tesla","country":"美國"},{"brand":"Ford","country":"美國"},{"brand":"Luxgen","country":"台灣"},{"brand":"Volkswagen","country":"德國"}], [
      { key: 'brand', label: '品牌' }, { key: 'country', label: '產地' },
    ]))]);
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
    const KEY = 'watools_wishes';
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
      UI.el('p', { className: 'tool-result' }, "寧采臣夜宿蘭若寺，遇聶小倩。書生心正，終得善報。——《聊齋誌異》精簡版"),
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
        out.textContent = '你是：' + UI.randomChoice(["郭靖","黃蓉","楊過","小龍女","張無忌","趙敏","令狐冲","任盈盈","段譽","虛竹"]) + '（' + n + ' 的江湖化身）';
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
  R['world-flags'] = function (app) {
    mount(app, [UI.panel('世界旗幟', UI.tableFrom([{"country":"台灣","flag":"🇹🇼"},{"country":"日本","flag":"🇯🇵"},{"country":"美國","flag":"🇺🇸"},{"country":"英國","flag":"🇬🇧"},{"country":"法國","flag":"🇫🇷"},{"country":"德國","flag":"🇩🇪"},{"country":"中國","flag":"🇨🇳"},{"country":"韓國","flag":"🇰🇷"},{"country":"加拿大","flag":"🇨🇦"}], [
      { key: 'flag', label: '旗幟' }, { key: 'country', label: '國家' },
    ]))]);
  };

  R['population'] = function (app) {
    mount(app, [UI.panel('世界人口統計', [
      UI.el('div', { className: 'tool-result' }, [
        UI.el('p', {}, '全球人口：約 80 億（2024 估計）'),
        UI.el('p', {}, '男女比例：約 50.4% : 49.6%'),
        UI.el('p', {}, '人口最多：印度、中國'),
        UI.el('p', { className: 'text-muted small' }, '靜態參考數據，非即時統計。'),
      ]),
    ])]);
  };

  R['coat-of-arms'] = function (app) {
    const data = [
      { country: '英國', name: '皇家徽章' }, { country: '西班牙', name: '西班牙國徽' },
      { country: '德國', name: '聯邦鷹' }, { country: '台灣', name: '中華民國國徽' },
    ];
    mount(app, [UI.panel('國家徽章', UI.tableFrom(data, [
      { key: 'country', label: '國家' }, { key: 'name', label: '徽章' },
    ]))]);
  };

  R['ethnic-china'] = function (app) {
    const rows = ["漢族","壯族","滿族","回族","苗族","維吾爾族","土家族","彝族","蒙古族","藏族","布依族","侗族","瑤族","朝鮮族","白族","哈尼族","哈薩克族","黎族","傣族","畲族","傈僳族","仡佬族","東鄉族","高山族","拉祜族","水族","佤族","納西族","羌族","土族","仫佬族","錫伯族","柯尔克孜族","達斡爾族","景頗族","毛南族","撒拉族","布朗族","塔吉克族","阿昌族","普米族","鄂溫克族","怒族","京族","基諾族","德昂族","保安族","俄羅斯族","裕固族","烏孜別克族","門巴族","鄂倫春族","獨龍族","塔塔爾族","赫哲族","珞巴族"].map((e, i) => ({ no: i + 1, name: e }));
    mount(app, [UI.panel('56 個民族', UI.tableFrom(rows, [
      { key: 'no', label: '#' }, { key: 'name', label: '民族' },
    ]))]);
  };

  R['national-anthem'] = function (app) {
    const data = [
      { country: '台灣', anthem: '中華民國國歌' }, { country: '美國', anthem: 'The Star-Spangled Banner' },
      { country: '日本', anthem: '君が代' }, { country: '法國', anthem: 'La Marseillaise' },
    ];
    mount(app, [UI.panel('各國國歌', UI.tableFrom(data, [
      { key: 'country', label: '國家' }, { key: 'anthem', label: '國歌' },
    ]))]);
  };

  R['ufo'] = function (app) {
    const types = [
      { type: 'Greys', desc: '灰色皮膚、大頭大眼，綁架傳說常客' },
      { type: 'Nordics', desc: '北歐型，金髮藍眼，較友善' },
      { type: 'Reptilians', desc: '爬蟲類人形，陰謀論常客' },
    ];
    mount(app, [UI.panel('外星種族', UI.tableFrom(types, [
      { key: 'type', label: '類型' }, { key: 'desc', label: '描述' },
    ]))]);
  };

  R['monster'] = function (app) {
    const monsters = [
      { name: '饕餮', desc: '貪食怪獸' }, { name: '窮奇', desc: '懲善揚惡' },
      { name: '梼杌', desc: '四凶之一' }, { name: '混沌', desc: '無面目' },
      { name: '九尾狐', desc: '青丘之獸' }, { name: '年獸', desc: '除夕驅邪' },
    ];
    mount(app, [UI.panel('妖魔鬼怪', UI.tableFrom(monsters, [
      { key: 'name', label: '名稱' }, { key: 'desc', label: '簡介' },
    ]))]);
  };

  R['capitals'] = function (app) {
    mount(app, [UI.panel('各國首都', UI.tableFrom([{"country":"台灣","capital":"台北"},{"country":"日本","capital":"東京"},{"country":"美國","capital":"華盛頓"},{"country":"英國","capital":"倫敦"},{"country":"法國","capital":"巴黎"},{"country":"德國","capital":"柏林"},{"country":"中國","capital":"北京"},{"country":"澳洲","capital":"坎培拉"}], [
      { key: 'country', label: '國家' }, { key: 'capital', label: '首都' },
    ]))]);
  };

  R['national-symbol'] = function (app) {
    mount(app, [UI.panel('各國國寶', UI.tableFrom([{"country":"美國","animal":"白頭海雕","plant":"玫瑰"},{"country":"澳洲","animal":"袋鼠","plant":"金合歡"},{"country":"中國","animal":"大熊貓","plant":"牡丹"},{"country":"日本","animal":"綠雉","plant":"櫻花"}], [
      { key: 'country', label: '國家' }, { key: 'animal', label: '動物' }, { key: 'plant', label: '植物' },
    ]))]);
  };

})();
