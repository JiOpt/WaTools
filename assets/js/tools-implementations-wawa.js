/**
 * Kawatool — WaWa catalog tools (editor, security, dev, utility, media, life, fun)
 */
(function () {
  'use strict';

  const UI = window.WA_TOOL_UI;
  const R = (window.WA_TOOL_REGISTRY = window.WA_TOOL_REGISTRY || {});

  function hint(text) {
    return UI.el('p', { className: 'tool-hint text-muted small mb-3' }, text);
  }

  function kvTable(rows) {
    const tbody = UI.el('tbody');
    rows.forEach(([label, value]) => {
      tbody.appendChild(UI.el('tr', {}, [
        UI.el('th', { scope: 'row' }, label),
        UI.el('td', {}, value ?? '—'),
      ]));
    });
    return UI.el('div', { className: 'table-responsive tool-kv-wrap' }, [
      UI.el('table', { className: 'table tool-kv-table mb-0' }, tbody),
    ]);
  }

  function knowledgeBlock(title, text) {
    return UI.el('section', { className: 'tool-knowledge' }, [
      UI.el('h3', { className: 'tool-knowledge-title' }, title),
      UI.el('p', { className: 'tool-knowledge-text mb-0' }, text),
    ]);
  }

  function parseUserAgent(ua) {
    let os = '—';
    if (/Windows NT 10\.0/.test(ua)) os = 'Windows 10';
    else if (/Windows NT 11\.0/.test(ua)) os = 'Windows 11';
    else if (/Windows NT 6\.3/.test(ua)) os = 'Windows 8.1';
    else if (/Windows NT 6\.1/.test(ua)) os = 'Windows 7';
    else if (/Mac OS X|Macintosh/.test(ua)) os = 'macOS';
    else if (/Android/.test(ua)) os = 'Android';
    else if (/iPhone|iPad|iPod/.test(ua)) os = 'iOS';
    else if (/Linux/.test(ua)) os = 'Linux';
    else if (/CrOS/.test(ua)) os = 'Chrome OS';

    let browser = '—';
    let version = '—';
    const edge = ua.match(/\bEdg(?:A|iOS)?\/([\d.]+)/);
    const opera = ua.match(/\bOPR\/([\d.]+)/);
    const firefox = ua.match(/\bFirefox\/([\d.]+)/);
    const chrome = ua.match(/\bChrome\/([\d.]+)/);
    const safariVer = ua.match(/\bVersion\/([\d.]+)/);

    if (edge) {
      browser = 'Edge';
      version = edge[1];
    } else if (opera) {
      browser = 'Opera';
      version = opera[1];
    } else if (firefox) {
      browser = 'Firefox';
      version = firefox[1];
    } else if (chrome && !/Chromium/.test(ua)) {
      browser = 'Chrome';
      version = chrome[1];
    } else if (/Safari\//.test(ua) && safariVer) {
      browser = 'Safari';
      version = safariVer[1];
    }

    return { ua, os, browser, version };
  }

  function mount(app, nodes) {
    app.replaceChildren();
    app.appendChild(UI.el('div', { className: 'tool-form' }, nodes));
  }

  function getVal(id) {
    return document.getElementById(id)?.value ?? '';
  }

  function setVal(id, val) {
    const el = document.getElementById(id);
    if (el) el.value = val;
  }

  function setOut(id, val) {
    const el = document.getElementById(id);
    if (!el) return;
    if (el.tagName === 'PRE' || el.tagName === 'TEXTAREA') el.textContent = val ?? '';
    else el.textContent = val ?? '';
  }

  function readOnly(id) {
    const el = document.getElementById(id);
    if (el) el.readOnly = true;
  }

  /* ── MD5 (inline) ── */
  function md5(str) {
    function cmn(q, a, b, x, s, t) {
      a = add32(add32(a, q), add32(x, t));
      return add32((a << s) | (a >>> (32 - s)), b);
    }
    function ff(a, b, c, d, x, s, t) { return cmn((b & c) | (~b & d), a, b, x, s, t); }
    function gg(a, b, c, d, x, s, t) { return cmn((b & d) | (c & ~d), a, b, x, s, t); }
    function hh(a, b, c, d, x, s, t) { return cmn(b ^ c ^ d, a, b, x, s, t); }
    function ii(a, b, c, d, x, s, t) { return cmn(c ^ (b | ~d), a, b, x, s, t); }
    function add32(a, b) { return (a + b) & 0xffffffff; }
    function md5cycle(x, k) {
      let a = x[0]; let b = x[1]; let c = x[2]; let d = x[3];
      a = ff(a, b, c, d, k[0], 7, -680876936); d = ff(d, a, b, c, k[1], 12, -389564586);
      c = ff(c, d, a, b, k[2], 17, 606105819); b = ff(b, c, d, a, k[3], 22, -1044525330);
      a = ff(a, b, c, d, k[4], 7, -176418897); d = ff(d, a, b, c, k[5], 12, 1200080426);
      c = ff(c, d, a, b, k[6], 17, -1473231341); b = ff(b, c, d, a, k[7], 22, -45705983);
      a = ff(a, b, c, d, k[8], 7, 1770035416); d = ff(d, a, b, c, k[9], 12, -1958414417);
      c = ff(c, d, a, b, k[10], 17, -42063); b = ff(b, c, d, a, k[11], 22, -1990404162);
      a = ff(a, b, c, d, k[12], 7, 1804603682); d = ff(d, a, b, c, k[13], 12, -40341101);
      c = ff(c, d, a, b, k[14], 17, -1502002290); b = ff(b, c, d, a, k[15], 22, 1236535329);
      a = gg(a, b, c, d, k[1], 5, -165796510); d = gg(d, a, b, c, k[6], 9, -1069501632);
      c = gg(c, d, a, b, k[11], 14, 643717713); b = gg(b, c, d, a, k[0], 20, -373897302);
      a = gg(a, b, c, d, k[5], 5, -701558691); d = gg(d, a, b, c, k[10], 9, 38016083);
      c = gg(c, d, a, b, k[15], 14, -660478335); b = gg(b, c, d, a, k[4], 20, -405537848);
      a = gg(a, b, c, d, k[9], 5, 568446438); d = gg(d, a, b, c, k[14], 9, -1019803690);
      c = gg(c, d, a, b, k[3], 14, -187363961); b = gg(b, c, d, a, k[8], 20, 1163531501);
      a = gg(a, b, c, d, k[13], 5, -1444681467); d = gg(d, a, b, c, k[2], 9, -51403784);
      c = gg(c, d, a, b, k[7], 14, 1735328473); b = gg(b, c, d, a, k[12], 20, -1926607734);
      a = hh(a, b, c, d, k[5], 4, -378558); d = hh(d, a, b, c, k[8], 11, -2022574463);
      c = hh(c, d, a, b, k[11], 16, 1839030562); b = hh(b, c, d, a, k[14], 23, -35309556);
      a = hh(a, b, c, d, k[1], 4, -1530992060); d = hh(d, a, b, c, k[4], 11, 1272893353);
      c = hh(c, d, a, b, k[7], 16, -155497632); b = hh(b, c, d, a, k[10], 23, -1094730640);
      a = hh(a, b, c, d, k[13], 4, 681279174); d = hh(d, a, b, c, k[0], 11, -358537222);
      c = hh(c, d, a, b, k[3], 16, -722521979); b = hh(b, c, d, a, k[6], 23, 76029189);
      a = hh(a, b, c, d, k[9], 4, -640364487); d = hh(d, a, b, c, k[12], 11, -421815835);
      c = hh(c, d, a, b, k[15], 16, 530742520); b = hh(b, c, d, a, k[2], 23, -995338651);
      a = ii(a, b, c, d, k[0], 6, -198630844); d = ii(d, a, b, c, k[7], 10, 1126891415);
      c = ii(c, d, a, b, k[14], 15, -1416354905); b = ii(b, c, d, a, k[5], 21, -57434055);
      a = ii(a, b, c, d, k[12], 6, 1700485571); d = ii(d, a, b, c, k[3], 10, -1894986606);
      c = ii(c, d, a, b, k[10], 15, -1051523); b = ii(b, c, d, a, k[1], 21, -2054922799);
      a = ii(a, b, c, d, k[8], 6, 1873313359); d = ii(d, a, b, c, k[15], 10, -30611744);
      c = ii(c, d, a, b, k[6], 15, -1560198380); b = ii(b, c, d, a, k[13], 21, 1309151649);
      a = ii(a, b, c, d, k[4], 6, -145523070); d = ii(d, a, b, c, k[11], 10, -1120210379);
      c = ii(c, d, a, b, k[2], 15, 718787259); b = ii(b, c, d, a, k[9], 21, -343485551);
      x[0] = add32(a, x[0]); x[1] = add32(b, x[1]); x[2] = add32(c, x[2]); x[3] = add32(d, x[3]);
    }
    function md5blk(s) {
      const md5blks = [];
      for (let i = 0; i < 64; i += 4) {
        md5blks[i >> 2] = s.charCodeAt(i) + (s.charCodeAt(i + 1) << 8)
          + (s.charCodeAt(i + 2) << 16) + (s.charCodeAt(i + 3) << 24);
      }
      return md5blks;
    }
    function md51(s) {
      const n = s.length;
      const state = [1732584193, -271733879, -1732584194, 271733878];
      let i;
      for (i = 64; i <= n; i += 64) md5cycle(state, md5blk(s.substring(i - 64, i)));
      s = s.substring(i - 64);
      const tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      for (i = 0; i < s.length; i++) tail[i >> 2] |= s.charCodeAt(i) << ((i % 4) << 3);
      tail[i >> 2] |= 0x80 << ((i % 4) << 3);
      if (i > 55) { md5cycle(state, tail); for (i = 0; i < 16; i++) tail[i] = 0; }
      tail[14] = n * 8;
      md5cycle(state, tail);
      return state;
    }
    function rhex(n) {
      let s = '';
      for (let j = 0; j < 4; j++) s += ('0' + ((n >> (j * 8)) & 0xff).toString(16)).slice(-2);
      return s;
    }
    const x = md51(unescape(encodeURIComponent(str)));
    return rhex(x[0]) + rhex(x[1]) + rhex(x[2]) + rhex(x[3]);
  }

  async function shaHex(algo, text) {
    const buf = await crypto.subtle.digest(algo, new TextEncoder().encode(text));
    return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
  }

  function toFullWidth(s) {
    return [...s].map((c) => {
      const code = c.charCodeAt(0);
      if (code === 0x20) return '\u3000';
      if (code >= 0x21 && code <= 0x7e) return String.fromCharCode(code + 0xfee0);
      return c;
    }).join('');
  }

  function toHalfWidth(s) {
    return [...s].map((c) => {
      const code = c.charCodeAt(0);
      if (code === 0x3000) return ' ';
      if (code >= 0xff01 && code <= 0xff5e) return String.fromCharCode(code - 0xfee0);
      return c;
    }).join('');
  }

  const FANCY_STYLES = {
    bold: { base: 0x1d400, lower: 0x1d41a },
    italic: { base: 0x1d434, lower: 0x1d44e },
    boldItalic: { base: 0x1d468, lower: 0x1d482 },
    script: { base: 0x1d49c, lower: 0x1d4b6 },
    fraktur: { base: 0x1d504, lower: 0x1d51e },
    monospace: { base: 0x1d670, lower: 0x1d68a },
    double: { base: 0x1d538, lower: 0x1d552 },
    circled: { base: 0x24b6, lower: 0x24d0 },
  };

  function fancyConvert(text, styleKey) {
    const style = FANCY_STYLES[styleKey] || FANCY_STYLES.bold;
    return [...text].map((c) => {
      const code = c.charCodeAt(0);
      if (code >= 65 && code <= 90) return String.fromCodePoint(style.base + (code - 65));
      if (code >= 97 && code <= 122) return String.fromCodePoint(style.lower + (code - 97));
      if (code >= 48 && code <= 57 && styleKey === 'circled') return String.fromCodePoint(0x2460 + (code - 49));
      return c;
    }).join('');
  }

  const MORSE_MAP = {
    A: '.-', B: '-...', C: '-.-.', D: '-..', E: '.', F: '..-.', G: '--.', H: '....',
    I: '..', J: '.---', K: '-.-', L: '.-..', M: '--', N: '-.', O: '---', P: '.--.',
    Q: '--.-', R: '.-.', S: '...', T: '-', U: '..-', V: '...-', W: '.--', X: '-..-',
    Y: '-.--', Z: '--..', 0: '-----', 1: '.----', 2: '..---', 3: '...--', 4: '....-',
    5: '.....', 6: '-....', 7: '--...', 8: '---..', 9: '----.',
  };
  const MORSE_REV = Object.fromEntries(Object.entries(MORSE_MAP).map(([k, v]) => [v, k]));

  function textToMorse(s) {
    return s.toUpperCase().split('').map((c) => {
      if (c === ' ') return '/';
      return MORSE_MAP[c] || c;
    }).join(' ');
  }

  function morseToText(s) {
    return s.trim().split(/\s*\/\s*|\s{2,}/).map((word) =>
      word.trim().split(/\s+/).map((code) => MORSE_REV[code] || '').join('')
    ).join(' ');
  }

  function splitWords(text) {
    const en = text.match(/[a-zA-Z]+(?:'[a-zA-Z]+)?/g) || [];
    const zh = text.match(/[\u4e00-\u9fff\u3400-\u4dbf]/g) || [];
    return [...en.map((w) => w.toLowerCase()), ...zh];
  }

  function wordFreq(text) {
    const freq = {};
    splitWords(text).forEach((w) => { freq[w] = (freq[w] || 0) + 1; });
    return Object.entries(freq).sort((a, b) => b[1] - a[1]);
  }

  function textSimilarity(a, b) {
    const wa = new Set(splitWords(a));
    const wb = new Set(splitWords(b));
    if (!wa.size && !wb.size) return 100;
    let inter = 0;
    wa.forEach((w) => { if (wb.has(w)) inter++; });
    const union = wa.size + wb.size - inter;
    return union ? Math.round((inter / union) * 100) : 0;
  }

  function beautifySql(sql) {
    const kw = ['SELECT', 'FROM', 'WHERE', 'JOIN', 'LEFT', 'RIGHT', 'INNER', 'OUTER', 'ON',
      'GROUP BY', 'ORDER BY', 'HAVING', 'INSERT', 'INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE',
      'CREATE', 'TABLE', 'ALTER', 'DROP', 'AND', 'OR', 'LIMIT', 'OFFSET', 'UNION', 'AS'];
    let s = sql.replace(/\s+/g, ' ').trim();
    kw.sort((a, b) => b.length - a.length).forEach((k) => {
      const re = new RegExp(`\\b${k.replace(' ', '\\s+')}\\b`, 'gi');
      s = s.replace(re, k);
    });
    ['SELECT', 'FROM', 'WHERE', 'GROUP BY', 'ORDER BY', 'HAVING', 'INSERT INTO', 'VALUES',
      'UPDATE', 'SET', 'DELETE FROM', 'JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN'].forEach((k) => {
      s = s.replace(new RegExp(`\\b${k}\\b`, 'g'), `\n${k}`);
    });
    return s.replace(/,\s*/g, ',\n  ').replace(/\n+/g, '\n').trim();
  }

  function minifySql(sql) {
    return sql.replace(/\s+/g, ' ').replace(/\s*([(),;])\s*/g, '$1').trim();
  }

  function splitIdentifier(s) {
    return s.replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/[-_\s]+/g, ' ')
      .trim()
      .split(/\s+/)
      .filter(Boolean);
  }

  function toCamel(s) {
    const parts = splitIdentifier(s);
    return parts.map((p, i) => (i ? p[0].toUpperCase() + p.slice(1).toLowerCase() : p.toLowerCase())).join('');
  }

  function toPascal(s) {
    const parts = splitIdentifier(s);
    return parts.map((p) => p[0].toUpperCase() + p.slice(1).toLowerCase()).join('');
  }

  function toSnake(s) {
    return splitIdentifier(s).map((p) => p.toLowerCase()).join('_');
  }

  function toKebab(s) {
    return splitIdentifier(s).map((p) => p.toLowerCase()).join('-');
  }

  function inferTsType(val, key) {
    if (val === null) return 'null';
    if (Array.isArray(val)) {
      if (!val.length) return 'unknown[]';
      const types = [...new Set(val.map((v) => inferTsType(v)))];
      return types.length === 1 ? `${types[0]}[]` : `(${types.join(' | ')})[]`;
    }
    if (typeof val === 'object') {
      const props = Object.entries(val).map(([k, v]) => {
        const safe = /^[a-zA-Z_$][\w$]*$/.test(k) ? k : `'${k}'`;
        return `  ${safe}: ${inferTsType(v, k)};`;
      });
      return `{\n${props.join('\n')}\n}`;
    }
    if (typeof val === 'number') return Number.isInteger(val) ? 'number' : 'number';
    if (typeof val === 'boolean') return 'boolean';
    return 'string';
  }

  function jsonToTs(json, name) {
    const data = typeof json === 'string' ? JSON.parse(json) : json;
    const iface = inferTsType(data);
    const n = name || 'Root';
    return `export interface ${n} ${iface}`;
  }

  function parseRadix(s, radix) {
    const t = s.trim();
    if (!t) return NaN;
    return parseInt(t, radix);
  }

  function cronFieldMatch(field, val, min, max) {
    if (field === '*' || field === '?') return true;
    return field.split(',').some((part) => {
      if (part.includes('/')) {
        const [base, step] = part.split('/');
        const st = parseInt(step, 10);
        const start = base === '*' ? min : parseInt(base, 10);
        return val >= start && (val - start) % st === 0;
      }
      if (part.includes('-')) {
        const [a, b] = part.split('-').map(Number);
        return val >= a && val <= b;
      }
      return parseInt(part, 10) === val;
    });
  }

  function cronNextRuns(expr, count) {
    const parts = expr.trim().split(/\s+/);
    if (parts.length < 5) throw new Error('需要 5 欄 Cron 表達式（分 時 日 月 週）');
    const [minF, hourF, dayF, monF, dowF] = parts;
    const runs = [];
    const d = new Date();
    d.setSeconds(0, 0);
    for (let i = 0; i < 525600 && runs.length < count; i++) {
      d.setMinutes(d.getMinutes() + 1);
      const mi = d.getMinutes();
      const hr = d.getHours();
      const dy = d.getDate();
      const mo = d.getMonth() + 1;
      const dw = d.getDay();
      if (cronFieldMatch(minF, mi, 0, 59)
        && cronFieldMatch(hourF, hr, 0, 23)
        && cronFieldMatch(dayF, dy, 1, 31)
        && cronFieldMatch(monF, mo, 1, 12)
        && cronFieldMatch(dowF, dw, 0, 6)) {
        runs.push(d.toLocaleString('zh-TW'));
      }
    }
    return runs;
  }

  function unitConverter(units, value, from, to) {
    const factors = {};
    units.forEach((u) => { factors[u.key] = u.factor; });
    const base = value * factors[from];
    return base / factors[to];
  }

  function makeUnitTool(slug, title, units, hintText, decimals) {
    R[slug] = function (app) {
      const opts = units.map((u) => ({ value: u.key, label: u.label }));
      mount(app, [
        hint(hintText),
        UI.input('數值', `${slug}-val`, 'number', '1'),
        UI.row2(
          UI.select('從', `${slug}-from`, opts),
          UI.select('到', `${slug}-to`, opts)
        ),
        UI.btnGroup([
          UI.btn('換算', 'btn btn-primary tool-btn', () => {
            const v = parseFloat(getVal(`${slug}-val`));
            const from = getVal(`${slug}-from`);
            const to = getVal(`${slug}-to`);
            if (Number.isNaN(v)) { UI.alert('請輸入有效數字', 'warning'); return; }
            const result = unitConverter(units, v, from, to);
            setOut(`${slug}-out`, result.toFixed(decimals ?? 6));
          }),
          UI.copyBtn(() => getVal(`${slug}-out`)),
        ]),
        UI.panel('結果', UI.output(`${slug}-out`)),
      ]);
    };
  }

  function decimalToDms(dec) {
    const neg = dec < 0;
    const abs = Math.abs(dec);
    const d = Math.floor(abs);
    const mFloat = (abs - d) * 60;
    const m = Math.floor(mFloat);
    const s = ((mFloat - m) * 60).toFixed(4);
    return `${neg ? '-' : ''}${d}°${m}'${s}"`;
  }

  function dmsToDecimal(s) {
    const m = s.trim().match(/(-?\d+(?:\.\d+)?)[°度\s]+(\d+(?:\.\d+)?)['′分\s]+(\d+(?:\.\d+)?)/);
    if (!m) throw new Error('格式如 25°2\'30" 或 25 2 30');
    const sign = m[1].startsWith('-') ? -1 : 1;
    const d = Math.abs(parseFloat(m[1]));
    const mi = parseFloat(m[2]);
    const sec = parseFloat(m[3]);
    return sign * (d + mi / 60 + sec / 3600);
  }

  function loadJsBarcode() {
    if (window.JsBarcode) return Promise.resolve();
    return new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/jsbarcode@3.11.6/dist/JsBarcode.all.min.js';
      s.onload = () => resolve();
      s.onerror = () => reject(new Error('JsBarcode 載入失敗'));
      document.head.appendChild(s);
    });
  }

  function uuidV4() {
    return crypto.randomUUID ? crypto.randomUUID()
      : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
      });
  }

  /* ═══════════════ EDITOR ═══════════════ */

  R['text-replace'] = function (app) {
    mount(app, [
      hint('批次找換，比記事本的 Ctrl+H 適合整段文字；正則選項留給進階玩家。'),
      UI.textarea('原文', 'tr-in', '要處理的文字…', 6),
      UI.row2(
        UI.input('尋找', 'tr-find', 'text', '舊文字'),
        UI.input('替換為', 'tr-rep', 'text', '新文字')
      ),
      UI.btnGroup([
        UI.btn('全部替換', 'btn btn-primary tool-btn', () => {
          const find = getVal('tr-find');
          if (!find) { UI.alert('請輸入要尋找的文字', 'warning'); return; }
          setVal('tr-out', getVal('tr-in').split(find).join(getVal('tr-rep')));
        }),
        UI.copyBtn(() => getVal('tr-out')),
      ]),
      UI.textarea('結果', 'tr-out', '', 6),
    ]);
    readOnly('tr-out');
  };

  R['text-reverse'] = function (app) {
    mount(app, [
      hint('行序反轉、字序倒寫——拿來整同事或被整都剛好。'),
      UI.textarea('輸入', 'rv-in', '第一行\n第二行\n第三行', 5),
      UI.btnGroup([
        UI.btn('行序反轉', 'btn btn-outline-primary tool-btn', () => {
          setVal('rv-out', getVal('rv-in').split('\n').reverse().join('\n'));
        }),
        UI.btn('字序倒寫', 'btn btn-outline-primary tool-btn', () => {
          setVal('rv-out', [...getVal('rv-in')].reverse().join(''));
        }),
        UI.copyBtn(() => getVal('rv-out')),
      ]),
      UI.textarea('結果', 'rv-out', '', 5),
    ]);
    readOnly('rv-out');
  };

  R['line-number'] = function (app) {
    mount(app, [
      hint('每行前自動編號，終於像一份正經清單（內容正不正經另說）。'),
      UI.input('起始序號', 'ln-start', 'number', '1'),
      UI.input('分隔符', 'ln-sep', 'text', '. '),
      UI.textarea('文字', 'ln-in', '項目一\n項目二\n項目三', 6),
      UI.btnGroup([
        UI.btn('加序號', 'btn btn-primary tool-btn', () => {
          const start = parseInt(getVal('ln-start'), 10) || 1;
          const sep = getVal('ln-sep') || '. ';
          const lines = getVal('ln-in').split('\n');
          setVal('ln-out', lines.map((l, i) => `${start + i}${sep}${l}`).join('\n'));
        }),
        UI.copyBtn(() => getVal('ln-out')),
      ]),
      UI.textarea('結果', 'ln-out', '', 6),
    ]);
    readOnly('ln-out');
  };

  R['text-to-html'] = function (app) {
    mount(app, [
      hint('純文字變 HTML：換行變 <br>、空行變段落。懶得上 Markdown 時的權宜之計。'),
      UI.textarea('純文字', 'th-in', '第一段\n\n第二段', 6),
      UI.btnGroup([
        UI.btn('轉 HTML', 'btn btn-primary tool-btn', () => {
          const paras = getVal('th-in').split(/\n\s*\n/);
          const html = paras.map((p) => {
            const inner = p.split('\n').map((l) =>
              l.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
            ).join('<br>\n');
            return `<p>${inner}</p>`;
          }).join('\n');
          setVal('th-out', html);
        }),
        UI.copyBtn(() => getVal('th-out')),
      ]),
      UI.textarea('HTML', 'th-out', '', 6),
    ]);
    readOnly('th-out');
  };

  R['word-frequency'] = function (app) {
    const outPre = UI.output('wf-out');
    mount(app, [
      hint('看哪個詞出現最勤——寫稿自我檢查，或事後檢討為何「其實」用了 47 次。'),
      UI.textarea('文字', 'wf-in', '貼上文章或演講稿…', 6),
      UI.btnGroup([
        UI.btn('統計', 'btn btn-primary tool-btn', () => {
          const rows = wordFreq(getVal('wf-in'));
          const lines = rows.slice(0, 100).map(([w, n]) => `${w}\t${n}`);
          setOut('wf-out', lines.join('\n') || '（無詞彙）');
        }),
        UI.copyBtn(() => document.getElementById('wf-out')?.textContent || ''),
      ]),
      UI.panel('詞頻（詞彙\t次數）', outPre),
    ]);
  };

  R['duplicate-check'] = function (app) {
    mount(app, [
      hint('兩段文字有多像？僅供參考，別拿去當洗稿法庭證據。'),
      UI.textarea('文字 A', 'dc-a', '', 4),
      UI.textarea('文字 B', 'dc-b', '', 4),
      UI.btnGroup([
        UI.btn('比對', 'btn btn-primary tool-btn', () => {
          const pct = textSimilarity(getVal('dc-a'), getVal('dc-b'));
          setOut('dc-out', `重複率（詞彙 Jaccard）：${pct}%`);
        }),
      ]),
      UI.panel('結果', UI.output('dc-out')),
    ]);
  };

  R['fancy-font'] = function (app) {
    mount(app, [
      hint('普通英文變 Unicode 花體，IG 限動標題瞬間高級（也可能像 spam）。'),
      UI.input('英文', 'ff-in', 'text', 'Kawatool'),
      UI.select('風格', 'ff-style', [
        { value: 'bold', label: '粗體 𝐁𝐨𝐥𝐝' },
        { value: 'italic', label: '斜體 𝐼𝑡𝑎𝑙𝑖𝑐' },
        { value: 'boldItalic', label: '粗斜體' },
        { value: 'script', label: '手寫體 Script' },
        { value: 'fraktur', label: '德文 Fraktur' },
        { value: 'monospace', label: '等寬 Monospace' },
        { value: 'double', label: '雙線 Double' },
        { value: 'circled', label: '圓圈 Circled' },
      ]),
      UI.btnGroup([
        UI.btn('轉換', 'btn btn-primary tool-btn', () => {
          setVal('ff-out', fancyConvert(getVal('ff-in'), getVal('ff-style')));
        }),
        UI.copyBtn(() => getVal('ff-out')),
      ]),
      UI.textarea('花體結果', 'ff-out', '', 3),
    ]);
    readOnly('ff-out');
  };

  R['full-half'] = function (app) {
    mount(app, [
      hint('全形半形互轉，標點對齊不再靠肉眼——排版強迫症的小確幸。'),
      UI.textarea('輸入', 'fh-in', 'ＡＢＣ，１２３。', 4),
      UI.btnGroup([
        UI.btn('轉全形', 'btn btn-outline-primary tool-btn', () => setVal('fh-out', toFullWidth(getVal('fh-in')))),
        UI.btn('轉半形', 'btn btn-outline-primary tool-btn', () => setVal('fh-out', toHalfWidth(getVal('fh-in')))),
        UI.copyBtn(() => getVal('fh-out')),
      ]),
      UI.textarea('結果', 'fh-out', '', 4),
    ]);
    readOnly('fh-out');
  };

  /* ═══════════════ SECURITY ═══════════════ */

  R['base64'] = function (app) {
    mount(app, [
      hint('Base64 編解碼，API 除錯時的字串摩斯密碼（其實不是摩斯）。'),
      UI.select('方向', 'b64-mode', [
        { value: 'enc', label: '編碼 Encode' },
        { value: 'dec', label: '解碼 Decode' },
      ]),
      UI.textarea('輸入', 'b64-in', '', 5),
      UI.btnGroup([
        UI.btn('轉換', 'btn btn-primary tool-btn', () => {
          try {
            const mode = getVal('b64-mode');
            if (mode === 'enc') {
              setVal('b64-out', btoa(unescape(encodeURIComponent(getVal('b64-in')))));
            } else {
              setVal('b64-out', decodeURIComponent(escape(atob(getVal('b64-in').trim()))));
            }
          } catch (e) {
            UI.alert('Base64 格式錯誤：' + e.message, 'danger');
          }
        }),
        UI.copyBtn(() => getVal('b64-out')),
      ]),
      UI.textarea('結果', 'b64-out', '', 5),
    ]);
    readOnly('b64-out');
  };

  R['hash-tool'] = function (app) {
    mount(app, [
      hint('MD5、SHA-1、SHA-256 一次算——校對檔案雜湊，不是拿來當密碼儲存方式。'),
      UI.textarea('文字', 'hash-in', '', 4),
      UI.btnGroup([
        UI.btn('計算雜湊', 'btn btn-primary tool-btn', async () => {
          const text = getVal('hash-in');
          try {
            const sha1 = await shaHex('SHA-1', text);
            const sha256 = await shaHex('SHA-256', text);
            setOut('hash-out', [
              `MD5:    ${md5(text)}`,
              `SHA-1:  ${sha1}`,
              `SHA-256: ${sha256}`,
            ].join('\n'));
          } catch (e) {
            UI.alert(e.message, 'danger');
          }
        }),
        UI.copyBtn(() => document.getElementById('hash-out')?.textContent || ''),
      ]),
      UI.panel('雜湊值', UI.output('hash-out')),
    ]);
  };

  R['aes-crypto'] = function (app) {
    mount(app, [
      hint('AES-GCM 加解密試玩，密鑰請自己記好——忘了就當永久刪除。'),
      UI.input('密碼 / 密鑰', 'aes-key', 'password', '請輸入密鑰'),
      UI.textarea('明文 / 密文', 'aes-in', '', 4),
      UI.btnGroup([
        UI.btn('加密', 'btn btn-primary tool-btn', async () => {
          try {
            const keyMat = await crypto.subtle.importKey(
              'raw', new TextEncoder().encode(getVal('aes-key')),
              'PBKDF2', false, ['deriveKey']
            );
            const salt = crypto.getRandomValues(new Uint8Array(16));
            const key = await crypto.subtle.deriveKey(
              { name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' },
              keyMat, { name: 'AES-GCM', length: 256 }, false, ['encrypt']
            );
            const iv = crypto.getRandomValues(new Uint8Array(12));
            const ct = await crypto.subtle.encrypt(
              { name: 'AES-GCM', iv },
              key, new TextEncoder().encode(getVal('aes-in'))
            );
            const packed = new Uint8Array(salt.length + iv.length + ct.byteLength);
            packed.set(salt, 0);
            packed.set(iv, salt.length);
            packed.set(new Uint8Array(ct), salt.length + iv.length);
            setVal('aes-out', btoa(String.fromCharCode(...packed)));
          } catch (e) {
            UI.alert('加密失敗：' + e.message, 'danger');
          }
        }),
        UI.btn('解密', 'btn btn-outline-primary tool-btn', async () => {
          try {
            const raw = Uint8Array.from(atob(getVal('aes-in').trim()), (c) => c.charCodeAt(0));
            const salt = raw.slice(0, 16);
            const iv = raw.slice(16, 28);
            const data = raw.slice(28);
            const keyMat = await crypto.subtle.importKey(
              'raw', new TextEncoder().encode(getVal('aes-key')),
              'PBKDF2', false, ['deriveKey']
            );
            const key = await crypto.subtle.deriveKey(
              { name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' },
              keyMat, { name: 'AES-GCM', length: 256 }, false, ['decrypt']
            );
            const pt = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, data);
            setVal('aes-out', new TextDecoder().decode(pt));
          } catch (e) {
            UI.alert('解密失敗，請確認密鑰與密文：' + e.message, 'danger');
          }
        }),
        UI.copyBtn(() => getVal('aes-out')),
      ]),
      UI.textarea('輸出', 'aes-out', '', 4),
    ]);
    readOnly('aes-out');
  };

  R['morse-code'] = function (app) {
    mount(app, [
      hint('文字與 ·− 互轉，業餘無線電入門儀式——滴、滴、滴。'),
      UI.select('方向', 'mc-mode', [
        { value: 'enc', label: '文字 → 摩斯' },
        { value: 'dec', label: '摩斯 → 文字' },
      ]),
      UI.textarea('輸入', 'mc-in', 'SOS', 4),
      UI.btnGroup([
        UI.btn('轉換', 'btn btn-primary tool-btn', () => {
          const mode = getVal('mc-mode');
          setVal('mc-out', mode === 'dec' ? morseToText(getVal('mc-in')) : textToMorse(getVal('mc-in')));
        }),
        UI.copyBtn(() => getVal('mc-out')),
      ]),
      UI.textarea('結果', 'mc-out', '', 4),
    ]);
    readOnly('mc-out');
  };

  /* ═══════════════ DEV ═══════════════ */

  R['json-editor'] = function (app) {
    mount(app, [
      hint('JSON 格式化、驗證、壓縮——API 回應整理，讓同事以為你很專業。'),
      UI.textarea('JSON', 'je-in', '{"name":"Kawatool"}', 8),
      UI.btnGroup([
        UI.btn('格式化', 'btn btn-primary tool-btn', () => {
          try {
            setVal('je-out', JSON.stringify(JSON.parse(getVal('je-in')), null, 2));
            UI.alert('JSON 有效', 'success');
          } catch (e) {
            UI.alert('JSON 無效：' + e.message, 'danger');
          }
        }),
        UI.btn('驗證', 'btn btn-outline-primary tool-btn', () => {
          try {
            JSON.parse(getVal('je-in'));
            UI.alert('✓ JSON 語法正確', 'success');
          } catch (e) {
            UI.alert('✗ ' + e.message, 'danger');
          }
        }),
        UI.btn('壓縮', 'btn btn-outline-primary tool-btn', () => {
          try {
            setVal('je-out', JSON.stringify(JSON.parse(getVal('je-in'))));
          } catch (e) {
            UI.alert('JSON 無效：' + e.message, 'danger');
          }
        }),
        UI.copyBtn(() => getVal('je-out')),
      ]),
      UI.textarea('輸出', 'je-out', '', 8),
    ]);
    readOnly('je-out');
  };

  R['sql-formatter'] = function (app) {
    mount(app, [
      hint('SQL 美化或壓縮，可讀性拯救計畫——DBA 看了可能點頭也可能搖頭。'),
      UI.textarea('SQL', 'sql-in', 'SELECT id,name FROM users WHERE active=1 ORDER BY name', 6),
      UI.btnGroup([
        UI.btn('美化', 'btn btn-primary tool-btn', () => setVal('sql-out', beautifySql(getVal('sql-in')))),
        UI.btn('壓縮', 'btn btn-outline-primary tool-btn', () => setVal('sql-out', minifySql(getVal('sql-in')))),
        UI.copyBtn(() => getVal('sql-out')),
      ]),
      UI.textarea('結果', 'sql-out', '', 6),
    ]);
    readOnly('sql-out');
  };

  R['regex-test'] = function (app) {
    mount(app, [
      hint('正則即時測試，寫完先驗再說——不然 production 會教你做人。'),
      UI.input('正則表達式', 'rx-pat', 'text', '[a-z]+'),
      UI.input('旗標 flags', 'rx-flags', 'text', 'gi'),
      UI.textarea('測試字串', 'rx-in', 'Hello world 123', 4),
      UI.btnGroup([
        UI.btn('測試匹配', 'btn btn-primary tool-btn', () => {
          try {
            const re = new RegExp(getVal('rx-pat'), getVal('rx-flags'));
            const text = getVal('rx-in');
            const matches = [...text.matchAll(re)];
            if (!matches.length) {
              setOut('rx-out', '（無匹配）');
              return;
            }
            const lines = matches.map((m, i) => {
              const groups = m.slice(1).map((g, j) => `  群組${j + 1}: ${g}`).join('\n');
              return `#${i + 1} "${m[0]}" @ ${m.index}${groups ? '\n' + groups : ''}`;
            });
            setOut('rx-out', `共 ${matches.length} 筆匹配\n\n${lines.join('\n\n')}`);
          } catch (e) {
            UI.alert('正則錯誤：' + e.message, 'danger');
          }
        }),
        UI.copyBtn(() => document.getElementById('rx-out')?.textContent || ''),
      ]),
      UI.panel('匹配結果', UI.output('rx-out')),
    ]);
  };

  R['crontab-calc'] = function (app) {
    mount(app, [
      hint('Cron 表達式算下次執行——排程心算器，簡化版不含秒欄。'),
      UI.input('Cron（分 時 日 月 週）', 'cron-in', 'text', '0 9 * * 1-5'),
      UI.btnGroup([
        UI.btn('計算下次 5 次', 'btn btn-primary tool-btn', () => {
          try {
            const runs = cronNextRuns(getVal('cron-in'), 5);
            setOut('cron-out', runs.map((r, i) => `${i + 1}. ${r}`).join('\n'));
          } catch (e) {
            UI.alert(e.message, 'danger');
          }
        }),
        UI.copyBtn(() => document.getElementById('cron-out')?.textContent || ''),
      ]),
      UI.panel('下次執行', UI.output('cron-out')),
    ]);
  };

  R['naming-converter'] = function (app) {
    mount(app, [
      hint('camelCase、snake_case、kebab-case、PascalCase 一鍵互轉，命名潔癖救星。'),
      UI.input('識別名稱', 'nc-in', 'text', 'myVariableName'),
      UI.btnGroup([
        UI.btn('camelCase', 'btn btn-outline-primary tool-btn', () => setVal('nc-out', toCamel(getVal('nc-in')))),
        UI.btn('PascalCase', 'btn btn-outline-primary tool-btn', () => setVal('nc-out', toPascal(getVal('nc-in')))),
        UI.btn('snake_case', 'btn btn-outline-primary tool-btn', () => setVal('nc-out', toSnake(getVal('nc-in')))),
        UI.btn('kebab-case', 'btn btn-outline-primary tool-btn', () => setVal('nc-out', toKebab(getVal('nc-in')))),
        UI.copyBtn(() => getVal('nc-out')),
      ]),
      UI.textarea('結果', 'nc-out', '', 2),
    ]);
    readOnly('nc-out');
  };

  R['json-to-typescript'] = function (app) {
    mount(app, [
      hint('JSON 自動推斷 interface，懶得寫型別時的救命稻草。'),
      UI.input('介面名稱', 'jts-name', 'text', 'Root'),
      UI.textarea('JSON', 'jts-in', '{"id":1,"name":"test"}', 6),
      UI.btnGroup([
        UI.btn('產生 TypeScript', 'btn btn-primary tool-btn', () => {
          try {
            setVal('jts-out', jsonToTs(getVal('jts-in'), getVal('jts-name') || 'Root'));
          } catch (e) {
            UI.alert('JSON 無效：' + e.message, 'danger');
          }
        }),
        UI.copyBtn(() => getVal('jts-out')),
      ]),
      UI.textarea('TypeScript', 'jts-out', '', 8),
    ]);
    readOnly('jts-out');
  };

  R['timestamp'] = function (app) {
    mount(app, [
      hint('Unix 時間戳與本地日期時間互轉，時區自己對——UTC 零點不是全世界零點。'),
      UI.input('Unix 時間戳（秒）', 'ts-unix', 'text', String(Math.floor(Date.now() / 1000))),
      UI.input('日期時間（本地）', 'ts-dt', 'datetime-local', ''),
      UI.btnGroup([
        UI.btn('時間戳 → 日期', 'btn btn-outline-primary tool-btn', () => {
          const sec = parseInt(getVal('ts-unix'), 10);
          if (Number.isNaN(sec)) { UI.alert('無效時間戳', 'warning'); return; }
          const d = new Date(sec * 1000);
          const pad = (n) => String(n).padStart(2, '0');
          setVal('ts-dt', `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`);
          setOut('ts-out', d.toLocaleString('zh-TW'));
        }),
        UI.btn('日期 → 時間戳', 'btn btn-outline-primary tool-btn', () => {
          const d = new Date(getVal('ts-dt'));
          if (Number.isNaN(d.getTime())) { UI.alert('無效日期', 'warning'); return; }
          const sec = Math.floor(d.getTime() / 1000);
          setVal('ts-unix', String(sec));
          setOut('ts-out', `Unix: ${sec}`);
        }),
        UI.btn('現在', 'btn btn-outline-secondary tool-btn', () => {
          const now = Math.floor(Date.now() / 1000);
          setVal('ts-unix', String(now));
          const d = new Date(now * 1000);
          const pad = (n) => String(n).padStart(2, '0');
          setVal('ts-dt', `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`);
        }),
      ]),
      UI.panel('結果', UI.output('ts-out')),
    ]);
    const d = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    setTimeout(() => setVal('ts-dt', `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`), 0);
  };

  R['timestamp-batch'] = function (app) {
    mount(app, [
      hint('多筆時間戳一次轉，日誌分析前處理——一行一個，秒或毫秒自動判斷。'),
      UI.textarea('時間戳（每行一個）', 'tsb-in', '1700000000\n1700000000000', 6),
      UI.btnGroup([
        UI.btn('批量轉換', 'btn btn-primary tool-btn', () => {
          const lines = getVal('tsb-in').split('\n').filter((l) => l.trim());
          const out = lines.map((l) => {
            let n = parseInt(l.trim(), 10);
            if (Number.isNaN(n)) return `${l}\t（無效）`;
            if (String(n).length >= 13) n = Math.floor(n / 1000);
            return `${l.trim()}\t${new Date(n * 1000).toLocaleString('zh-TW')}`;
          });
          setVal('tsb-out', out.join('\n'));
        }),
        UI.copyBtn(() => getVal('tsb-out')),
      ]),
      UI.textarea('結果', 'tsb-out', '', 6),
    ]);
    readOnly('tsb-out');
  };

  /* ═══════════════ UTILITY ═══════════════ */

  R['guid'] = function (app) {
    mount(app, [
      hint('UUID v4 一次多筆，測試資料不重複——假 ID 請勿拿去買房。'),
      UI.input('產生數量', 'guid-n', 'number', '5'),
      UI.btnGroup([
        UI.btn('產生 GUID', 'btn btn-primary tool-btn', () => {
          const n = Math.min(100, Math.max(1, parseInt(getVal('guid-n'), 10) || 1));
          const ids = Array.from({ length: n }, () => uuidV4());
          setVal('guid-out', ids.join('\n'));
        }),
        UI.copyBtn(() => getVal('guid-out')),
      ]),
      UI.textarea('GUID', 'guid-out', '', 6),
    ]);
    readOnly('guid-out');
  };

  R['random-number'] = function (app) {
    mount(app, [
      hint('指定範圍亂數，抽籤公平靠 RNG——運氣不好請換一顆骰子。'),
      UI.row2(
        UI.input('最小值', 'rn-min', 'number', '1'),
        UI.input('最大值', 'rn-max', 'number', '100')
      ),
      UI.input('產生數量', 'rn-n', 'number', '5'),
      UI.btnGroup([
        UI.btn('產生', 'btn btn-primary tool-btn', () => {
          const min = parseInt(getVal('rn-min') || '1', 10);
          const max = parseInt(getVal('rn-max') || '100', 10);
          const n = Math.min(100, Math.max(1, parseInt(getVal('rn-n') || '5', 10)));
          if (Number.isNaN(min) || Number.isNaN(max) || min > max) {
            UI.alert('請輸入有效範圍', 'warning');
            return;
          }
          const nums = Array.from({ length: n }, () => UI.randomInt(min, max));
          setVal('rn-out', nums.join('\n'));
        }),
        UI.copyBtn(() => getVal('rn-out')),
      ]),
      UI.textarea('結果', 'rn-out', '', 4),
    ]);
    setVal('rn-min', '1');
    setVal('rn-max', '100');
    setVal('rn-n', '5');
    readOnly('rn-out');
  };

  R['whois'] = function (app) {
    mount(app, [
      hint('查域名 RDAP 資訊，過期時間先看好——續費驚喜誰都不想要。'),
      UI.input('域名', 'whois-in', 'text', 'example.com'),
      UI.btnGroup([
        UI.btn('查詢', 'btn btn-primary tool-btn', async () => {
          const domain = getVal('whois-in').trim().replace(/^https?:\/\//, '').split('/')[0];
          setOut('whois-out', '查詢中…');
          try {
            const res = await fetch(`https://rdap.org/domain/${encodeURIComponent(domain)}`);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            const lines = [
              `域名: ${data.ldhName || domain}`,
              `Handle: ${data.handle || '—'}`,
              `狀態: ${(data.status || []).join(', ') || '—'}`,
            ];
            (data.events || []).forEach((ev) => {
              lines.push(`${ev.eventAction}: ${ev.eventDate}`);
            });
            (data.nameservers || []).forEach((ns) => {
              lines.push(`NS: ${ns.ldhName || ns}`);
            });
            setOut('whois-out', lines.join('\n'));
          } catch (e) {
            setOut('whois-out', `查詢失敗：${e.message}\n（可能受 CORS 或 RDAP 服務限制）`);
          }
        }),
        UI.copyBtn(() => document.getElementById('whois-out')?.textContent || ''),
      ]),
      UI.panel('RDAP 結果', UI.output('whois-out')),
    ]);
  };

  R['batch-open-url'] = function (app) {
    mount(app, [
      hint('多個 URL 一次開分頁，測試連結用——瀏覽器可能擋彈窗，請允許本站。'),
      UI.textarea('網址（每行一個）', 'bou-in', 'https://example.com\nhttps://www.google.com', 6),
      UI.btnGroup([
        UI.btn('批量開啟', 'btn btn-primary tool-btn', () => {
          const urls = getVal('bou-in').split('\n').map((u) => u.trim()).filter(Boolean);
          if (!urls.length) { UI.alert('請輸入至少一個網址', 'warning'); return; }
          let opened = 0;
          urls.forEach((u) => {
            const w = window.open(u.startsWith('http') ? u : `https://${u}`, '_blank');
            if (w) opened++;
          });
          setOut('bou-out', `已嘗試開啟 ${urls.length} 個，成功 ${opened} 個（其餘可能被瀏覽器阻擋）`);
        }),
      ]),
      UI.panel('狀態', UI.output('bou-out')),
    ]);
  };

  R['user-agent'] = function (app) {
    const info = parseUserAgent(navigator.userAgent);
    mount(app, [
      kvTable([
        ['User-Agent', info.ua],
        ['作業系統', info.os],
        ['瀏覽器', info.browser],
        ['瀏覽器版本', info.version],
      ]),
      UI.btnGroup([
        UI.btn('複製 User-Agent', 'btn btn-primary btn-sm tool-btn', () => {
          UI.copyText(info.ua, '已複製 User-Agent');
        }),
      ]),
      knowledgeBlock(
        '相關知識',
        'User Agent（使用者代理，簡稱 UA）是瀏覽器送給伺服器的一串識別資訊，'
          + '讓網站知道你的作業系統、瀏覽器與版本。開發除錯、相容性測試，'
          + '或確認爬蟲／廣告攔截是否改變 UA 時，可以在這裡查看目前瀏覽器送出的字串。',
      ),
    ]);
  };

  /* ═══════════════ MEDIA ═══════════════ */

  R['barcode'] = function (app) {
    const svg = UI.el('svg', { id: 'bc-svg' });
    mount(app, [
      hint('Code128 條碼產生，包裝 mockup 用——掃不掃得到看運氣。'),
      UI.input('條碼內容', 'bc-in', 'text', 'Kawatool'),
      UI.btnGroup([
        UI.btn('產生條碼', 'btn btn-primary tool-btn', async () => {
          try {
            await loadJsBarcode();
            JsBarcode('#bc-svg', getVal('bc-in') || 'TEST', { format: 'CODE128', displayValue: true, width: 2, height: 80 });
          } catch (e) {
            UI.alert(e.message, 'danger');
          }
        }),
      ]),
      UI.panel('預覽', UI.el('div', { className: 'text-center p-3' }, svg)),
    ]);
  };

  R['image-compress'] = function (app) {
    let blobUrl = null;
    const preview = UI.el('img', { id: 'ic-preview', className: 'img-fluid', style: { maxHeight: '300px' } });
    const slider = UI.el('input', {
      type: 'range', className: 'form-range', id: 'ic-quality', min: '10', max: '100', value: '80',
    });
    mount(app, [
      hint('本地壓縮 JPG/PNG，不上傳伺服器——隱私安心，畫質自己扛。'),
      UI.fileInput('image/*', (file) => {
        if (blobUrl) URL.revokeObjectURL(blobUrl);
        blobUrl = URL.createObjectURL(file);
        preview.src = blobUrl;
        document.getElementById('ic-name').textContent = file.name;
        window._icFile = file;
      }),
      UI.el('p', { id: 'ic-name', className: 'text-muted small' }, '未選擇檔案'),
      UI.el('div', { className: 'tool-field' }, [
        UI.el('label', { className: 'tool-label', for: 'ic-quality' }, '品質'),
        slider,
      ]),
      UI.btnGroup([
        UI.btn('壓縮並下載', 'btn btn-primary tool-btn', () => {
          const file = window._icFile;
          if (!file) { UI.alert('請先選擇圖片', 'warning'); return; }
          const quality = parseInt(getVal('ic-quality'), 10) / 100;
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            canvas.getContext('2d').drawImage(img, 0, 0);
            const mime = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
            canvas.toBlob((blob) => {
              if (!blob) { UI.alert('壓縮失敗', 'danger'); return; }
              const a = document.createElement('a');
              a.href = URL.createObjectURL(blob);
              a.download = `compressed_${file.name.replace(/\.\w+$/, '')}.${mime === 'image/png' ? 'png' : 'jpg'}`;
              a.click();
              setOut('ic-out', `原始 ${(file.size / 1024).toFixed(1)} KB → 壓縮後 ${(blob.size / 1024).toFixed(1)} KB（品質 ${Math.round(quality * 100)}%）`);
            }, mime, quality);
          };
          img.src = blobUrl;
        }),
      ]),
      preview,
      UI.panel('結果', UI.output('ic-out')),
    ]);
  };

  /* ═══════════════ LIFE ═══════════════ */

  R['datetime-calc'] = function (app) {
    mount(app, [
      hint('兩日期相差幾天、加減 N 天——排程心算器，週末不算加班。'),
      UI.row2(
        UI.input('日期 A', 'dc-a', 'date', ''),
        UI.input('日期 B', 'dc-b', 'date', '')
      ),
      UI.input('加減天數（可負）', 'dc-days', 'number', '7'),
      UI.btnGroup([
        UI.btn('相差天數', 'btn btn-outline-primary tool-btn', () => {
          const a = new Date(getVal('dc-a'));
          const b = new Date(getVal('dc-b'));
          if (Number.isNaN(a.getTime()) || Number.isNaN(b.getTime())) {
            UI.alert('請選擇有效日期', 'warning');
            return;
          }
          const diff = Math.round((b - a) / 86400000);
          setOut('dc-out', `相差 ${diff} 天`);
        }),
        UI.btn('A 加減天數', 'btn btn-outline-primary tool-btn', () => {
          const a = new Date(getVal('dc-a'));
          const n = parseInt(getVal('dc-days'), 10);
          if (Number.isNaN(a.getTime())) { UI.alert('請選擇日期 A', 'warning'); return; }
          a.setDate(a.getDate() + n);
          setOut('dc-out', `結果：${a.toLocaleDateString('zh-TW')}`);
        }),
      ]),
      UI.panel('結果', UI.output('dc-out')),
    ]);
  };

  R['english-date'] = function (app) {
    const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];
    mount(app, [
      hint('日期轉英文格式，寫信開頭用——July 11, 2026 比 2026/7/11 體面。'),
      UI.input('日期', 'ed-in', 'date', ''),
      UI.btnGroup([
        UI.btn('轉換', 'btn btn-primary tool-btn', () => {
          const d = new Date(getVal('ed-in'));
          if (Number.isNaN(d.getTime())) { UI.alert('請選擇日期', 'warning'); return; }
          const m = MONTHS[d.getMonth()];
          const day = d.getDate();
          const y = d.getFullYear();
          setOut('ed-out', [
            `${m} ${day}, ${y}`,
            `${day} ${m} ${y}`,
            `${m} ${day}${day % 10 === 1 && day !== 11 ? 'st' : day % 10 === 2 && day !== 12 ? 'nd' : day % 10 === 3 && day !== 13 ? 'rd' : 'th'}, ${y}`,
            d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
          ].join('\n'));
        }),
        UI.copyBtn(() => document.getElementById('ed-out')?.textContent || ''),
      ]),
      UI.panel('英文格式', UI.output('ed-out')),
    ]);
  };

  R['stopwatch'] = function (app) {
    let timer = null;
    let start = 0;
    let elapsed = 0;
    const display = UI.el('div', { id: 'sw-display', className: 'display-4 text-center my-3 font-monospace' }, '00:00:00.00');
    const lapsPre = UI.output('sw-laps');
    mount(app, [
      hint('計時、計圈，煮麵與 Pomodoro 兩用——別煮到忘記關火。'),
      display,
      UI.btnGroup([
        UI.btn('開始', 'btn btn-success tool-btn', () => {
          if (timer) return;
          start = Date.now() - elapsed;
          timer = setInterval(() => {
            elapsed = Date.now() - start;
            const ms = elapsed % 1000;
            const s = Math.floor(elapsed / 1000) % 60;
            const m = Math.floor(elapsed / 60000) % 60;
            const h = Math.floor(elapsed / 3600000);
            display.textContent = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${String(Math.floor(ms / 10)).padStart(2, '0')}`;
          }, 10);
        }),
        UI.btn('停止', 'btn btn-warning tool-btn', () => {
          clearInterval(timer);
          timer = null;
        }),
        UI.btn('歸零', 'btn btn-outline-secondary tool-btn', () => {
          clearInterval(timer);
          timer = null;
          elapsed = 0;
          display.textContent = '00:00:00.00';
          setOut('sw-laps', '');
        }),
        UI.btn('計圈', 'btn btn-outline-primary tool-btn', () => {
          const lap = display.textContent;
          const prev = document.getElementById('sw-laps')?.textContent || '';
          setOut('sw-laps', prev ? `${prev}\n${lap}` : lap);
        }),
      ]),
      UI.panel('計圈紀錄', lapsPre),
    ]);
  };

  R['expiry-date'] = function (app) {
    mount(app, [
      hint('生產日加保存天數，過期日一眼知——冰箱貼紙可以退休了。'),
      UI.input('生產日期', 'ex-prod', 'date', ''),
      UI.input('保存天數', 'ex-days', 'number', '30'),
      UI.btnGroup([
        UI.btn('計算過期日', 'btn btn-primary tool-btn', () => {
          const d = new Date(getVal('ex-prod'));
          const n = parseInt(getVal('ex-days'), 10);
          if (Number.isNaN(d.getTime()) || Number.isNaN(n)) {
            UI.alert('請輸入有效日期與天數', 'warning');
            return;
          }
          d.setDate(d.getDate() + n);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const exp = new Date(d);
          exp.setHours(0, 0, 0, 0);
          const left = Math.ceil((exp - today) / 86400000);
          setOut('ex-out', `過期日：${d.toLocaleDateString('zh-TW')}\n${left >= 0 ? `還有 ${left} 天` : `已過期 ${-left} 天`}`);
        }),
      ]),
      UI.panel('結果', UI.output('ex-out')),
    ]);
  };

  R['radix-converter'] = function (app) {
    mount(app, [
      hint('二、八、十、十六進制互轉，位元運算前必備——0xDEADBEEF 聽起來就很工程師。'),
      UI.input('輸入值', 'radix-in', 'text', '255'),
      UI.select('輸入進制', 'radix-from', [
        { value: '2', label: '二進制' },
        { value: '8', label: '八進制' },
        { value: '10', label: '十進制' },
        { value: '16', label: '十六進制' },
      ]),
      UI.btnGroup([
        UI.btn('轉換', 'btn btn-primary tool-btn', () => {
          const from = parseInt(getVal('radix-from'), 10);
          const n = parseRadix(getVal('radix-in'), from);
          if (Number.isNaN(n)) { UI.alert('無效數值', 'warning'); return; }
          setOut('radix-out', [
            `二進制: ${n.toString(2)}`,
            `八進制: ${n.toString(8)}`,
            `十進制: ${n}`,
            `十六進制: ${n.toString(16).toUpperCase()}`,
          ].join('\n'));
        }),
        UI.copyBtn(() => document.getElementById('radix-out')?.textContent || ''),
      ]),
      UI.panel('結果', UI.output('radix-out')),
    ]);
  };

  makeUnitTool('unit-length', '長度', [
    { key: 'mm', label: '毫米 mm', factor: 0.001 },
    { key: 'cm', label: '公分 cm', factor: 0.01 },
    { key: 'm', label: '公尺 m', factor: 1 },
    { key: 'km', label: '公里 km', factor: 1000 },
    { key: 'in', label: '英寸 in', factor: 0.0254 },
    { key: 'ft', label: '英尺 ft', factor: 0.3048 },
    { key: 'yd', label: '碼 yd', factor: 0.9144 },
    { key: 'mi', label: '英里 mi', factor: 1609.344 },
  ], '公尺英尺英里，出國量家具不猜。', 6);

  makeUnitTool('unit-weight', '重量', [
    { key: 'mg', label: '毫克 mg', factor: 0.000001 },
    { key: 'g', label: '公克 g', factor: 0.001 },
    { key: 'kg', label: '公斤 kg', factor: 1 },
    { key: 't', label: '公噸 t', factor: 1000 },
    { key: 'oz', label: '盎司 oz', factor: 0.0283495 },
    { key: 'lb', label: '磅 lb', factor: 0.453592 },
  ], '公斤磅盎司，食譜與健身都適用。', 6);

  makeUnitTool('unit-volume', '體積', [
    { key: 'ml', label: '毫升 mL', factor: 0.001 },
    { key: 'l', label: '公升 L', factor: 1 },
    { key: 'm3', label: '立方公尺 m³', factor: 1000 },
    { key: 'tsp', label: '茶匙 tsp', factor: 0.00492892 },
    { key: 'tbsp', label: '湯匙 tbsp', factor: 0.0147868 },
    { key: 'cup', label: '杯 cup', factor: 0.236588 },
    { key: 'gal', label: '加侖 gal (US)', factor: 3.78541 },
  ], '升加侖毫升，烘焙不再靠感覺。', 6);

  makeUnitTool('unit-area', '面積', [
    { key: 'sqm', label: '平方公尺 m²', factor: 1 },
    { key: 'sqkm', label: '平方公里 km²', factor: 1e6 },
    { key: 'ha', label: '公頃 ha', factor: 10000 },
    { key: 'sqft', label: '平方英尺 ft²', factor: 0.092903 },
    { key: 'acre', label: '英畝 acre', factor: 4046.86 },
    { key: 'ping', label: '坪', factor: 3.30579 },
  ], '平方公尺、坪、英畝，買地看房參考。', 6);

  makeUnitTool('unit-byte', '位元組', [
    { key: 'b', label: 'Bytes', factor: 1 },
    { key: 'kb', label: 'KB (1024)', factor: 1024 },
    { key: 'mb', label: 'MB', factor: 1048576 },
    { key: 'gb', label: 'GB', factor: 1073741824 },
    { key: 'tb', label: 'TB', factor: 1099511627776 },
  ], 'KB MB GB TB，硬碟容量不再被 1024 整。', 4);

  R['unit-temperature'] = function (app) {
    mount(app, [
      hint('攝氏華氏開氏，看國外天氣不懵——華氏 90 不是攝氏 90。'),
      UI.input('數值', 'ut-val', 'number', '25'),
      UI.row2(
        UI.select('從', 'ut-from', [
          { value: 'c', label: '攝氏 °C' },
          { value: 'f', label: '華氏 °F' },
          { value: 'k', label: '開氏 K' },
        ]),
        UI.select('到', 'ut-to', [
          { value: 'c', label: '攝氏 °C' },
          { value: 'f', label: '華氏 °F' },
          { value: 'k', label: '開氏 K' },
        ])
      ),
      UI.btnGroup([
        UI.btn('換算', 'btn btn-primary tool-btn', () => {
          let v = parseFloat(getVal('ut-val'));
          const from = getVal('ut-from');
          const to = getVal('ut-to');
          if (Number.isNaN(v)) { UI.alert('請輸入數字', 'warning'); return; }
          let c = v;
          if (from === 'f') c = (v - 32) * 5 / 9;
          else if (from === 'k') c = v - 273.15;
          let out = c;
          if (to === 'f') out = c * 9 / 5 + 32;
          else if (to === 'k') out = c + 273.15;
          setOut('ut-out', out.toFixed(2));
        }),
        UI.copyBtn(() => document.getElementById('ut-out')?.textContent || ''),
      ]),
      UI.panel('結果', UI.output('ut-out')),
    ]);
  };

  makeUnitTool('unit-pressure', '壓力', [
    { key: 'pa', label: '帕 Pa', factor: 1 },
    { key: 'kpa', label: '千帕 kPa', factor: 1000 },
    { key: 'bar', label: '巴 bar', factor: 100000 },
    { key: 'atm', label: '大氣壓 atm', factor: 101325 },
    { key: 'psi', label: 'psi', factor: 6894.76 },
    { key: 'mmhg', label: 'mmHg', factor: 133.322 },
  ], 'Pa、bar、psi 互轉，工程與單車胎壓。', 4);

  R['geo-coordinate'] = function (app) {
    mount(app, [
      hint('度分秒與十進制度互轉，地圖 API 座標整理用。'),
      UI.input('十進制度', 'gc-dec', 'text', '25.0330'),
      UI.input('度分秒 DMS', 'gc-dms', 'text', '25°1\'58.8"'),
      UI.btnGroup([
        UI.btn('十進制 → DMS', 'btn btn-outline-primary tool-btn', () => {
          const n = parseFloat(getVal('gc-dec'));
          if (Number.isNaN(n)) { UI.alert('無效座標', 'warning'); return; }
          setVal('gc-dms', decimalToDms(n));
        }),
        UI.btn('DMS → 十進制', 'btn btn-outline-primary tool-btn', () => {
          try {
            setVal('gc-dec', String(dmsToDecimal(getVal('gc-dms'))));
          } catch (e) {
            UI.alert(e.message, 'danger');
          }
        }),
        UI.copyBtn(() => `十進制: ${getVal('gc-dec')}\nDMS: ${getVal('gc-dms')}`),
      ]),
    ]);
  };

  R['bmi'] = function (app) {
    mount(app, [
      hint('身高體重算 BMI，健康參考而非判決——數字不好看別怪工具。'),
      UI.row2(
        UI.input('身高 (cm)', 'bmi-h', 'number', '170'),
        UI.input('體重 (kg)', 'bmi-w', 'number', '65')
      ),
      UI.btnGroup([
        UI.btn('計算 BMI', 'btn btn-primary tool-btn', () => {
          const h = parseFloat(getVal('bmi-h')) / 100;
          const w = parseFloat(getVal('bmi-w'));
          if (!h || !w || h <= 0 || w <= 0) { UI.alert('請輸入有效身高體重', 'warning'); return; }
          const bmi = w / (h * h);
          let cat = '正常';
          if (bmi < 18.5) cat = '過輕';
          else if (bmi < 24) cat = '正常';
          else if (bmi < 27) cat = '過重';
          else cat = '肥胖';
          setOut('bmi-out', `BMI: ${bmi.toFixed(1)}\n分類（亞洲標準參考）：${cat}`);
        }),
      ]),
      UI.panel('結果', UI.output('bmi-out')),
    ]);
  };

  /* ═══════════════ FUN ═══════════════ */

  R['reaction-test'] = function (app) {
    let state = 'idle';
    let greenAt = 0;
    let results = [];
    const box = UI.el('div', {
      id: 'rt-box',
      className: 'text-center p-5 rounded',
      style: { background: '#6c757d', color: '#fff', cursor: 'pointer', minHeight: '160px', userSelect: 'none' },
    }, '點擊開始');
    const outPre = UI.output('rt-out');

    function updateBox(text, color) {
      box.textContent = text;
      box.style.background = color;
    }

    box.addEventListener('click', () => {
      if (state === 'idle' || state === 'done') {
        state = 'wait';
        results = [];
        updateBox('等待變綠…', '#dc3545');
        const delay = 1000 + Math.random() * 3000;
        setTimeout(() => {
          if (state !== 'wait') return;
          state = 'ready';
          greenAt = performance.now();
          updateBox('按！！！', '#198754');
        }, delay);
        return;
      }
      if (state === 'wait') {
        state = 'idle';
        updateBox('太早了！點擊重試', '#ffc107');
        return;
      }
      if (state === 'ready') {
        const ms = Math.round(performance.now() - greenAt);
        results.push(ms);
        if (results.length >= 5) {
          const best = Math.min(...results);
          const avg = Math.round(results.reduce((a, b) => a + b, 0) / results.length);
          setOut('rt-out', `完成 5 次！\n各次：${results.join('、')} ms\n最佳：${best} ms\n平均：${avg} ms`);
          state = 'done';
          updateBox('完成！點擊再玩', '#6c757d');
        } else {
          state = 'wait';
          updateBox(`第 ${results.length} 次：${ms} ms — 等待變綠…`, '#dc3545');
          const delay = 800 + Math.random() * 2000;
          setTimeout(() => {
            if (state !== 'wait') return;
            state = 'ready';
            greenAt = performance.now();
            updateBox('按！！！', '#198754');
          }, delay);
        }
      }
    });

    mount(app, [
      hint('看到綠色就按，測毫秒反應——輸了別怪滑鼠，贏了別怪對手慢。'),
      box,
      UI.panel('成績', outPre),
    ]);
  };
})();
