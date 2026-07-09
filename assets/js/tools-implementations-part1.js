/**
 * WaTools — Editor, Dev & Security tool implementations (part 1)
 */
(function () {
  'use strict';

  const UI = window.WA_TOOL_UI;
  const R = (window.WA_TOOL_REGISTRY = window.WA_TOOL_REGISTRY || {});

  function hint(text) {
    return UI.el('p', { className: 'tool-hint text-muted small mb-3' }, text);
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

  function countWords(text) {
    const en = text.match(/[a-zA-Z]+(?:'[a-zA-Z]+)?/g) || [];
    const zh = text.match(/[\u4e00-\u9fff\u3400-\u4dbf]/g) || [];
    return en.length + zh.length;
  }

  function countParagraphs(text) {
    const parts = text.split(/\n\s*\n/).filter((p) => p.trim());
    return parts.length || (text.trim() ? 1 : 0);
  }

  function toTitleCase(s) {
    return s.toLowerCase().replace(/(?:^|\s|[-/])[a-z]/g, (m) => m.toUpperCase());
  }

  function toSentenceCase(s) {
    const t = s.toLowerCase();
    return t.charAt(0).toUpperCase() + t.slice(1);
  }

  function rmbUpper(n) {
    const digits = ['零', '壹', '貳', '參', '肆', '伍', '陸', '柒', '捌', '玖'];
    const units = ['', '拾', '佰', '仟'];
    const big = ['', '萬', '億', '兆'];
    if (Number.isNaN(n) || n < 0) return '請輸入有效非負數字';
    if (n === 0) return '零元整';
    const [intPart, decPart = ''] = n.toFixed(2).split('.');
    let intStr = '';
    const intNum = intPart.replace(/^0+/, '') || '0';
    const groups = intNum.padStart(Math.ceil(intNum.length / 4) * 4, '0').match(/\d{4}/g) || [];
    groups.forEach((g, gi) => {
      let seg = '';
      let zero = false;
      for (let i = 0; i < 4; i++) {
        const d = +g[i];
        if (d === 0) {
          zero = true;
        } else {
          if (zero && seg) seg += '零';
          zero = false;
          seg += digits[d] + units[3 - i];
        }
      }
      if (seg) intStr += seg + big[groups.length - 1 - gi];
    });
    intStr = intStr.replace(/零+/g, '零').replace(/零$/g, '') || '零';
    let decStr = '';
    const j = +decPart[0];
    const f = +decPart[1];
    if (j) decStr += digits[j] + '角';
    if (f) decStr += digits[f] + '分';
    if (!decStr) return intStr + '元整';
    return intStr + '元' + decStr;
  }

  function bbcodeToHtml(s) {
    return s
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\[b\]([\s\S]*?)\[\/b\]/gi, '<strong>$1</strong>')
      .replace(/\[i\]([\s\S]*?)\[\/i\]/gi, '<em>$1</em>')
      .replace(/\[u\]([\s\S]*?)\[\/u\]/gi, '<u>$1</u>')
      .replace(/\[url=(.*?)\]([\s\S]*?)\[\/url\]/gi, '<a href="$1">$2</a>')
      .replace(/\[url\]([\s\S]*?)\[\/url\]/gi, '<a href="$1">$1</a>')
      .replace(/\[img\]([\s\S]*?)\[\/img\]/gi, '<img src="$1" alt="">')
      .replace(/\[color=(.*?)\]([\s\S]*?)\[\/color\]/gi, '<span style="color:$1">$2</span>')
      .replace(/\[quote\]([\s\S]*?)\[\/quote\]/gi, '<blockquote>$1</blockquote>')
      .replace(/\n/g, '<br>');
  }

  function htmlToBbcode(s) {
    const div = document.createElement('div');
    div.innerHTML = s;
    let out = div.innerHTML;
    out = out
      .replace(/<strong>([\s\S]*?)<\/strong>/gi, '[b]$1[/b]')
      .replace(/<b>([\s\S]*?)<\/b>/gi, '[b]$1[/b]')
      .replace(/<em>([\s\S]*?)<\/em>/gi, '[i]$1[/i]')
      .replace(/<i>([\s\S]*?)<\/i>/gi, '[i]$1[/i]')
      .replace(/<u>([\s\S]*?)<\/u>/gi, '[u]$1[/u]')
      .replace(/<a href="(.*?)">([\s\S]*?)<\/a>/gi, '[url=$1]$2[/url]')
      .replace(/<img src="(.*?)"[^>]*>/gi, '[img]$1[/img]')
      .replace(/<blockquote>([\s\S]*?)<\/blockquote>/gi, '[quote]$1[/quote]')
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<[^>]+>/g, '');
    return out;
  }

  function textToUnicode(s) {
    return [...s].map((c) => {
      const cp = c.codePointAt(0);
      return cp > 0xffff ? `\\u{${cp.toString(16).toUpperCase()}}` : `\\u${cp.toString(16).toUpperCase().padStart(4, '0')}`;
    }).join('');
  }

  function unicodeToText(s) {
    return s.replace(/\\u\{([0-9A-Fa-f]+)\}|\\u([0-9A-Fa-f]{4})/g, (_, braced, four) => {
      const cp = parseInt(braced || four, 16);
      return String.fromCodePoint(cp);
    });
  }

  function utf8ToUnicodeEscapes(s) {
    return [...s].map((c) => `\\u${c.codePointAt(0).toString(16).toUpperCase().padStart(4, '0')}`).join('');
  }

  function hexToRgb(hex) {
    const m = hex.replace('#', '').match(/^([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
    if (!m) return null;
    return { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) };
  }

  function rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0; let s = 0;
    const l = (max + min) / 2;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        default: h = ((r - g) / d + 4) / 6;
      }
    }
    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
  }

  function hashStr(s) {
    let h = 0;
    for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
    return Math.abs(h).toString(36);
  }

  function beautifyCss(css) {
    let out = '';
    let indent = 0;
    const clean = css.replace(/\s+/g, ' ').replace(/\s*\{\s*/g, '{').replace(/\s*\}\s*/g, '}').replace(/\s*;\s*/g, ';').replace(/\s*:\s*/g, ':');
    for (let i = 0; i < clean.length; i++) {
      const ch = clean[i];
      if (ch === '{') { out += ' {\n' + '  '.repeat(++indent); }
      else if (ch === '}') { out += '\n' + '  '.repeat(--indent) + '}\n' + '  '.repeat(indent); }
      else if (ch === ';') { out += ';\n' + '  '.repeat(indent); }
      else out += ch;
    }
    return out.trim();
  }

  function minifyCss(css) {
    return css.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\s+/g, ' ').replace(/\s*([{}:;,])\s*/g, '$1').trim();
  }

  function beautifyHtmlJs(code) {
    let out = '';
    let indent = 0;
    const tokens = code.split(/(\<\/?[^>]+\>|\{|\}|\;)/).filter(Boolean);
    tokens.forEach((tok) => {
      if (/^<\//.test(tok)) { indent = Math.max(0, indent - 1); out += '\n' + '  '.repeat(indent); }
      else if (tok === '{') { out += ' {\n' + '  '.repeat(++indent); return; }
      else if (tok === '}') { out += '\n' + '  '.repeat(--indent) + '}'; return; }
      else if (tok === ';') { out += ';\n' + '  '.repeat(indent); return; }
      if (/^<[a-z!/]/i.test(tok) && !/\/>$/.test(tok) && !/^<(br|hr|img|input|meta|link)/i.test(tok)) {
        out += tok;
        if (!/\/>$/.test(tok) && !/^<\//.test(tok)) indent++;
        out += '\n' + '  '.repeat(indent);
      } else out += tok;
    });
    return out.trim();
  }

  function minifyHtmlJs(code) {
    return code.replace(/<!--[\s\S]*?-->/g, '').replace(/\s+/g, ' ').replace(/>\s+</g, '><').trim();
  }

  function escapeHtml(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function unescapeHtml(s) {
    const t = document.createElement('textarea');
    t.innerHTML = s;
    return t.value;
  }

  function xorEncrypt(text, pass) {
    let out = '';
    for (let i = 0; i < text.length; i++) {
      out += String.fromCharCode(text.charCodeAt(i) ^ pass.charCodeAt(i % pass.length));
    }
    return btoa(unescape(encodeURIComponent(out)));
  }

  function xorDecrypt(b64, pass) {
    const raw = decodeURIComponent(escape(atob(b64)));
    let out = '';
    for (let i = 0; i < raw.length; i++) {
      out += String.fromCharCode(raw.charCodeAt(i) ^ pass.charCodeAt(i % pass.length));
    }
    return out;
  }

  function passwordStrength(p) {
    let score = 0;
    if (p.length >= 8) score++;
    if (p.length >= 12) score++;
    if (/[a-z]/.test(p) && /[A-Z]/.test(p)) score++;
    if (/\d/.test(p)) score++;
    if (/[^a-zA-Z0-9]/.test(p)) score++;
    const labels = ['弱到像 123456', '還行，別太驕傲', '不錯，駭客會皺眉', '強！可以出書了', '核武級密碼'];
    return { score, label: labels[Math.min(score, labels.length - 1)] };
  }

  function genPassword(len, opts) {
    let chars = '';
    if (opts.lower) chars += 'abcdefghijklmnopqrstuvwxyz';
    if (opts.upper) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (opts.num) chars += '0123456789';
    if (opts.sym) chars += '!@#$%^&*-_+=';
    if (!chars) chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let p = '';
    for (let i = 0; i < len; i++) p += chars[UI.randomInt(0, chars.length - 1)];
    return p;
  }

  const HTTP_STATUS = [
    { code: 200, name: 'OK', desc: '成功，伺服器有正常回應。' },
    { code: 201, name: 'Created', desc: '資源已建立。' },
    { code: 204, name: 'No Content', desc: '成功但沒有內容 body。' },
    { code: 301, name: 'Moved Permanently', desc: '永久轉址，SEO 會跟著走。' },
    { code: 302, name: 'Found', desc: '暫時轉址，瀏覽器會跳走。' },
    { code: 304, name: 'Not Modified', desc: '快取還能用，省流量。' },
    { code: 400, name: 'Bad Request', desc: '請求格式有問題，先檢查參數。' },
    { code: 401, name: 'Unauthorized', desc: '未授權，請先登入。' },
    { code: 403, name: 'Forbidden', desc: '禁止存取，有身分但沒權限。' },
    { code: 404, name: 'Not Found', desc: '找不到頁面，心也碎了一半。' },
    { code: 405, name: 'Method Not Allowed', desc: 'HTTP 方法不對，換個動詞試試。' },
    { code: 408, name: 'Request Timeout', desc: '等太久，伺服器放你鴿子。' },
    { code: 429, name: 'Too Many Requests', desc: '請求太頻繁，先喝杯茶。' },
    { code: 500, name: 'Internal Server Error', desc: '伺服器內部錯誤，工程師該醒了。' },
    { code: 502, name: 'Bad Gateway', desc: '閘道錯誤，上游掛了。' },
    { code: 503, name: 'Service Unavailable', desc: '服務暫停，可能在維護。' },
    { code: 504, name: 'Gateway Timeout', desc: '閘道逾時，等不到回應。' },
  ];

  const HTML_ENTITIES = [
    { char: '<', name: 'less than', entity: '&lt;' },
    { char: '>', name: 'greater than', entity: '&gt;' },
    { char: '&', name: 'ampersand', entity: '&amp;' },
    { char: '"', name: 'quotation', entity: '&quot;' },
    { char: "'", name: 'apostrophe', entity: '&#39;' },
    { char: ' ', name: 'non-breaking space', entity: '&nbsp;' },
    { char: '©', name: 'copyright', entity: '&copy;' },
    { char: '®', name: 'registered', entity: '&reg;' },
    { char: '™', name: 'trademark', entity: '&trade;' },
    { char: '€', name: 'euro', entity: '&euro;' },
    { char: '¥', name: 'yen', entity: '&yen;' },
    { char: '£', name: 'pound', entity: '&pound;' },
    { char: '°', name: 'degree', entity: '&deg;' },
    { char: '±', name: 'plus-minus', entity: '&plusmn;' },
    { char: '×', name: 'times', entity: '&times;' },
    { char: '÷', name: 'divide', entity: '&divide;' },
    { char: '→', name: 'arrow right', entity: '&rarr;' },
    { char: '←', name: 'arrow left', entity: '&larr;' },
    { char: '♥', name: 'heart', entity: '&hearts;' },
    { char: '…', name: 'ellipsis', entity: '&hellip;' },
  ];

  const BIG5_SAMPLES = [
    { big5: 'A440', unicode: 'U+4E00', char: '一' },
    { big5: 'A441', unicode: 'U+4E01', char: '丁' },
    { big5: 'A442', unicode: 'U+4E03', char: '七' },
    { big5: 'A443', unicode: 'U+4E07', char: '万' },
    { big5: 'A444', unicode: 'U+4E08', char: '丈' },
    { big5: 'B0A1', unicode: 'U+4E2D', char: '中' },
    { big5: 'B0A2', unicode: 'U+4E38', char: '丸' },
    { big5: 'C2C3', unicode: 'U+570B', char: '國' },
    { big5: 'C2C4', unicode: 'U+5712', char: '園' },
  ];

  /* ── EDITOR ── */

  R.wordcount = function (app) {
    const ta = UI.textarea('貼上或輸入文字', 'wc-in', '交稿前數一數，編輯不會幫你數…', 8);
    const stats = UI.el('div', { className: 'tool-result tool-stats-grid', id: 'wc-stats' });
    const update = () => {
      const t = getVal('wc-in');
      stats.textContent =
        `字元（含空白）：${t.length}\n` +
        `字元（不含空白）：${t.replace(/\s/g, '').length}\n` +
        `字數（中英混合）：${countWords(t)}\n` +
        `行數：${t ? t.split('\n').length : 0}\n` +
        `段落：${countParagraphs(t)}`;
    };
    ta.querySelector('textarea').addEventListener('input', update);
    mount(app, [
      hint('中英都算字，空白不算「字」但算「字元」——語文老師與工程師的永恆戰爭。'),
      ta,
      UI.panel('統計結果', stats),
    ]);
    update();
  };

  R.dedupe = function (app) {
    mount(app, [
      hint('重複行會被無情刪除，保留第一次出現的那一行。'),
      UI.textarea('原始文字（每行一筆）', 'dd-in', '貼上名單、網址或任何一行一筆的資料…', 8),
      UI.btnGroup([
        UI.bindIO({
          input: 'dd-in',
          output: 'dd-out',
          btnText: '清除重複',
          transform: (raw) => {
            const seen = new Set();
            return raw.split('\n').filter((line) => {
              const k = line.trim();
              if (!k || seen.has(k)) return !k ? true : false;
              seen.add(k);
              return true;
            }).join('\n');
          },
        }),
        UI.btn('清空', 'btn btn-outline-secondary tool-btn', () => { setVal('dd-in', ''); setVal('dd-out', ''); }),
      ]),
      UI.textarea('結果', 'dd-out', '', 8),
    ]);
    document.getElementById('dd-out').readOnly = true;
  };

  R['case-converter'] = function (app) {
    mount(app, [
      hint('一鍵切換大小寫，Title Case 會讓每個字看起來都很重要。'),
      UI.textarea('英文文字', 'cc-in', 'Paste your English text here…', 6),
      UI.btnGroup([
        UI.btn('全大寫 UPPER', 'btn btn-outline-primary tool-btn', () => setVal('cc-out', getVal('cc-in').toUpperCase())),
        UI.btn('全小寫 lower', 'btn btn-outline-primary tool-btn', () => setVal('cc-out', getVal('cc-in').toLowerCase())),
        UI.btn('標題 Title', 'btn btn-outline-primary tool-btn', () => setVal('cc-out', toTitleCase(getVal('cc-in')))),
        UI.btn('句首 Sentence', 'btn btn-outline-primary tool-btn', () => setVal('cc-out', toSentenceCase(getVal('cc-in')))),
      ]),
      UI.textarea('結果', 'cc-out', '', 6),
    ]);
    document.getElementById('cc-out').readOnly = true;
  };

  R['rmb-upper'] = function (app) {
    mount(app, [
      hint('支票金額大寫，寫錯了銀行窗口會用眼神殺死你。'),
      UI.input('金額（數字）', 'rmb-in', 'number', '1234.56'),
      UI.btnGroup([
        UI.btn('轉換', 'btn btn-primary tool-btn', () => {
          const n = parseFloat(getVal('rmb-in'));
          document.getElementById('rmb-out').textContent = rmbUpper(n);
        }),
        UI.copyBtn(() => document.getElementById('rmb-out')?.textContent || ''),
      ]),
      UI.panel('中文大寫金額', UI.output('rmb-out')),
    ]);
  };

  R.colorfont = function (app) {
    const preview = UI.el('div', {
      id: 'cf-preview',
      className: 'tool-gradient-preview',
      style: { fontSize: '2rem', fontWeight: '700', padding: '1rem', textAlign: 'center' },
    }, '漸層彩字預覽');
    const update = () => {
      const text = getVal('cf-text') || '漸層彩字';
      const c1 = getVal('cf-c1') || '#ff6b6b';
      const c2 = getVal('cf-c2') || '#4ecdc4';
      preview.textContent = text;
      preview.style.background = `linear-gradient(90deg, ${c1}, ${c2})`;
      preview.style.webkitBackgroundClip = 'text';
      preview.style.backgroundClip = 'text';
      preview.style.color = 'transparent';
      const css = `.gradient-text {\n  background: linear-gradient(90deg, ${c1}, ${c2});\n  -webkit-background-clip: text;\n  background-clip: text;\n  color: transparent;\n}`;
      document.getElementById('cf-css').textContent = css;
    };
    mount(app, [
      hint('CSS 漸層文字，讓標題像彩虹糖一樣吸睛（也可能像廉價廣告）。'),
      UI.input('文字', 'cf-text', 'text', 'WaTools 漸層彩字'),
      UI.row2(
        UI.input('起始色', 'cf-c1', 'color', '#ff6b6b'),
        UI.input('結束色', 'cf-c2', 'color', '#4ecdc4')
      ),
      preview,
      UI.panel('CSS 程式碼', UI.output('cf-css')),
      UI.copyBtn(() => document.getElementById('cf-css')?.textContent || ''),
    ]);
    ['cf-text', 'cf-c1', 'cf-c2'].forEach((id) => {
      document.getElementById(id).addEventListener('input', update);
    });
    update();
  };

  R.bbcode = function (app) {
    mount(app, [
      hint('論壇時代的眼淚，BBCode 與 HTML 互轉，懷舊用。'),
      UI.select('方向', 'bb-mode', [
        { value: 'toHtml', label: 'BBCode → HTML' },
        { value: 'toBb', label: 'HTML → BBCode' },
      ]),
      UI.textarea('輸入', 'bb-in', '[b]粗體[/b] [url=https://example.com]連結[/url]', 6),
      UI.btnGroup([
        UI.bindIO({
          input: 'bb-in',
          output: 'bb-out',
          btnText: '轉換',
          transform: (raw) => {
            const mode = getVal('bb-mode');
            return mode === 'toBb' ? htmlToBbcode(raw) : bbcodeToHtml(raw);
          },
        }),
        UI.copyBtn(() => getVal('bb-out')),
      ]),
      UI.textarea('結果', 'bb-out', '', 6),
    ]);
    document.getElementById('bb-out').readOnly = true;
  };

  R['unicode-converter'] = function (app) {
    mount(app, [
      hint('字元與 \\uXXXX 互轉，除錯編碼問題時的好夥伴。'),
      UI.select('方向', 'uc-mode', [
        { value: 'toU', label: '字元 → \\uXXXX' },
        { value: 'fromU', label: '\\uXXXX → 字元' },
      ]),
      UI.textarea('輸入', 'uc-in', '你好 WaTools', 4),
      UI.btnGroup([
        UI.bindIO({
          input: 'uc-in',
          output: 'uc-out',
          btnText: '轉換',
          transform: (raw) => (getVal('uc-mode') === 'fromU' ? unicodeToText(raw) : textToUnicode(raw)),
        }),
        UI.copyBtn(() => getVal('uc-out')),
      ]),
      UI.textarea('結果', 'uc-out', '', 4),
    ]);
    document.getElementById('uc-out').readOnly = true;
  };

  R.editor = function (app) {
    const modeSel = UI.select('編輯模式', 'ed-mode', [
      { value: 'textarea', label: '純文字（textarea）' },
      { value: 'rich', label: '簡易富文本（contenteditable）' },
    ]);
    const area = UI.el('textarea', {
      id: 'ed-area',
      className: 'form-control tool-textarea',
      rows: 12,
      placeholder: '開始寫作… Ctrl+B 在富文本模式可粗體（瀏覽器原生）',
    });
    const rich = UI.el('div', {
      id: 'ed-rich',
      className: 'form-control tool-editable',
      contenteditable: 'true',
      style: { minHeight: '240px', display: 'none' },
    });
    const wc = UI.el('div', { className: 'tool-result', id: 'ed-wc' });
    const toolbar = UI.btnGroup([
      UI.btn('粗體', 'btn btn-sm btn-outline-secondary tool-btn', () => document.execCommand('bold')),
      UI.btn('斜體', 'btn btn-sm btn-outline-secondary tool-btn', () => document.execCommand('italic')),
      UI.btn('底線', 'btn btn-sm btn-outline-secondary tool-btn', () => document.execCommand('underline')),
      UI.btn('清空', 'btn btn-sm btn-outline-danger tool-btn', () => {
        if (getVal('ed-mode') === 'rich') rich.innerHTML = '';
        else setVal('ed-area', '');
        updateWc();
      }),
    ]);
    toolbar.style.display = 'none';
    function getText() {
      return getVal('ed-mode') === 'rich' ? rich.innerText : getVal('ed-area');
    }
    function updateWc() {
      const t = getText();
      wc.textContent = `字元：${t.length}｜字數：${countWords(t)}｜行數：${t ? t.split('\n').length : 0}`;
    }
    function switchMode() {
      const richMode = getVal('ed-mode') === 'rich';
      area.style.display = richMode ? 'none' : '';
      rich.style.display = richMode ? '' : 'none';
      toolbar.style.display = richMode ? '' : 'none';
      if (richMode) rich.innerText = getVal('ed-area');
      else setVal('ed-area', rich.innerText);
      updateWc();
    }
    mount(app, [
      hint('輕量線上編輯器，不是 Google Docs，但夠你寫完一篇部落格。'),
      modeSel,
      toolbar,
      area,
      rich,
      UI.panel('字數統計', wc),
    ]);
    document.getElementById('ed-mode').addEventListener('change', switchMode);
    area.addEventListener('input', updateWc);
    rich.addEventListener('input', updateWc);
    updateWc();
  };

  /* ── DEV ── */

  R.color = function (app) {
    const swatch = UI.el('div', {
      id: 'col-swatch',
      style: { width: '100%', height: '80px', borderRadius: '8px', border: '1px solid #ddd' },
    });
    const out = UI.output('col-out');
    function sync(hex) {
      const rgb = hexToRgb(hex);
      if (!rgb) return;
      const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
      swatch.style.background = hex;
      out.textContent = `HEX: ${hex.toUpperCase()}\nRGB: rgb(${rgb.r}, ${rgb.g}, ${rgb.b})\nHSL: hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
      setVal('col-hex', hex);
      setVal('col-r', rgb.r);
      setVal('col-g', rgb.g);
      setVal('col-b', rgb.b);
    }
    mount(app, [
      hint('挑顏色、轉色碼，設計師點頭，工程師複製。'),
      UI.input('色票選擇', 'col-pick', 'color', '#3fbbc0'),
      swatch,
      UI.row2(UI.input('HEX', 'col-hex', 'text', '#3fbbc0'), UI.btn('套用 HEX', 'btn btn-primary tool-btn', () => sync(getVal('col-hex')))),
      UI.row2(
        UI.el('div', { className: 'tool-rgb-row' }, [
          UI.input('R', 'col-r', 'number', '63'),
          UI.input('G', 'col-g', 'number', '187'),
          UI.input('B', 'col-b', 'number', '192'),
        ]),
        UI.btn('套用 RGB', 'btn btn-primary tool-btn', () => {
          const r = +getVal('col-r'); const g = +getVal('col-g'); const b = +getVal('col-b');
          sync('#' + [r, g, b].map((x) => Math.max(0, Math.min(255, x)).toString(16).padStart(2, '0')).join(''));
        })
      ),
      UI.panel('色碼結果', out),
      UI.copyBtn(() => out.textContent),
    ]);
    document.getElementById('col-pick').addEventListener('input', (e) => sync(e.target.value));
    sync('#3fbbc0');
  };

  R.favicon = function (app) {
    const canvas = UI.el('canvas', { id: 'fv-canvas', width: 64, height: 64, className: 'tool-canvas-border' });
    const preview = UI.el('div', { className: 'tool-canvas-wrap' }, canvas);
    function draw() {
      const ctx = canvas.getContext('2d');
      const text = getVal('fv-text') || 'W';
      const bg = getVal('fv-bg') || '#3fbbc0';
      const fg = getVal('fv-fg') || '#ffffff';
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, 64, 64);
      ctx.fillStyle = fg;
      ctx.font = 'bold 36px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text.slice(0, 2), 32, 36);
    }
    mount(app, [
      hint('文字或 emoji 變 favicon，64×64 的小圖也能有大志氣。'),
      UI.input('文字 / Emoji', 'fv-text', 'text', '🔧'),
      UI.row2(UI.input('背景色', 'fv-bg', 'color', '#3fbbc0'), UI.input('文字色', 'fv-fg', 'color', '#ffffff')),
      preview,
      UI.btnGroup([
        UI.btn('預覽', 'btn btn-primary tool-btn', draw),
        UI.btn('下載 PNG', 'btn btn-success tool-btn', () => {
          draw();
          canvas.toBlob((blob) => {
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = 'favicon.png';
            a.click();
          });
        }),
      ]),
    ]);
    ['fv-text', 'fv-bg', 'fv-fg'].forEach((id) => document.getElementById(id).addEventListener('input', draw));
    draw();
  };

  R.shorturl = function (app) {
    const outLink = UI.el('a', { id: 'su-link', href: '#', target: '_blank', className: 'tool-result d-block' });
    mount(app, [
      hint('⚠️ 本機示範：用 hash 產生短碼，只在這個網域有效，不是真正的 bit.ly。'),
      UI.input('原始網址', 'su-in', 'url', 'https://example.com/very/long/path'),
      UI.btn('產生短連結（本機）', 'btn btn-primary tool-btn', () => {
        const url = getVal('su-in').trim();
        if (!url) { UI.alert('請輸入網址', 'warning'); return; }
        const code = hashStr(url).slice(0, 8);
        const short = `${location.origin}${location.pathname}#s=${code}`;
        sessionStorage.setItem('wa_short_' + code, url);
        outLink.href = short;
        outLink.textContent = short;
        document.getElementById('su-origin').textContent = url;
      }),
      UI.panel('短網址', outLink),
      UI.panel('對應原始網址', UI.output('su-origin')),
      UI.copyBtn(() => outLink.textContent),
    ]);
    const m = location.hash.match(/^#s=([a-z0-9]+)/i);
    if (m) {
      const orig = sessionStorage.getItem('wa_short_' + m[1]);
      if (orig) document.getElementById('su-origin').textContent = '從 hash 還原：' + orig;
    }
  };

  R['url-encoder'] = function (app) {
    mount(app, [
      hint('encodeURIComponent 與 decodeURIComponent，%E4%BD%A0 其實是「你」。'),
      UI.select('模式', 'ue-mode', [
        { value: 'enc', label: '編碼 encode' },
        { value: 'dec', label: '解碼 decode' },
      ]),
      UI.textarea('輸入', 'ue-in', '你好 world?a=1&b=2', 4),
      UI.btnGroup([
        UI.bindIO({
          input: 'ue-in',
          output: 'ue-out',
          btnText: '轉換',
          transform: (raw) => {
            try {
              return getVal('ue-mode') === 'dec' ? decodeURIComponent(raw) : encodeURIComponent(raw);
            } catch (e) {
              throw new Error('解碼失敗：' + e.message);
            }
          },
        }),
        UI.copyBtn(() => getVal('ue-out')),
      ]),
      UI.textarea('結果', 'ue-out', '', 4),
    ]);
    document.getElementById('ue-out').readOnly = true;
  };

  R['css-formatter'] = function (app) {
    mount(app, [
      hint('CSS 美化或壓縮，讓同事以為你的程式碼本來就這麼整齊。'),
      UI.textarea('CSS', 'css-in', 'body{color:red;margin:0}', 8),
      UI.btnGroup([
        UI.btn('美化', 'btn btn-primary tool-btn', () => setVal('css-out', beautifyCss(getVal('css-in')))),
        UI.btn('壓縮', 'btn btn-outline-primary tool-btn', () => setVal('css-out', minifyCss(getVal('css-in')))),
        UI.copyBtn(() => getVal('css-out')),
      ]),
      UI.textarea('結果', 'css-out', '', 8),
    ]);
    document.getElementById('css-out').readOnly = true;
  };

  R['html-js-formatter'] = function (app) {
    mount(app, [
      hint('HTML/JS 基本縮排或壓縮，複雜專案請用 Prettier，這裡夠交差。'),
      UI.textarea('HTML / JS', 'hj-in', '<div><p>Hello</p></div>', 8),
      UI.btnGroup([
        UI.btn('美化縮排', 'btn btn-primary tool-btn', () => setVal('hj-out', beautifyHtmlJs(getVal('hj-in')))),
        UI.btn('壓縮', 'btn btn-outline-primary tool-btn', () => setVal('hj-out', minifyHtmlJs(getVal('hj-in')))),
        UI.copyBtn(() => getVal('hj-out')),
      ]),
      UI.textarea('結果', 'hj-out', '', 8),
    ]);
    document.getElementById('hj-out').readOnly = true;
  };

  R.viewsource = function (app) {
    mount(app, [
      hint('跨域網址無法直接 fetch 原始碼（CORS 會擋），請改用「檢視原始碼」複製貼上。'),
      UI.input('網址（可能因 CORS 失敗）', 'vs-url', 'url', 'https://example.com'),
      UI.btn('嘗試取得（可能失敗）', 'btn btn-outline-primary tool-btn', async () => {
        const url = getVal('vs-url').trim();
        try {
          const res = await fetch(url, { mode: 'cors' });
          setVal('vs-out', await res.text());
          UI.alert('成功取得！（運氣不錯）', 'success');
        } catch {
          UI.alert('被 CORS 擋下來了，請手動複製原始碼貼到下方。', 'warning');
        }
      }),
      UI.textarea('HTML 原始碼（貼上或取得）', 'vs-out', '<!DOCTYPE html>…', 12),
    ]);
  };

  R['html-converter'] = function (app) {
    mount(app, [
      hint('HTML 實體轉義/還原，讓 <tag> 安全地顯示在網頁上。'),
      UI.select('模式', 'hc-mode', [
        { value: 'esc', label: '轉義（顯示用）' },
        { value: 'unesc', label: '還原' },
      ]),
      UI.textarea('輸入', 'hc-in', '<div class="test">Hello & "World"</div>', 6),
      UI.btnGroup([
        UI.bindIO({
          input: 'hc-in',
          output: 'hc-out',
          btnText: '轉換',
          transform: (raw) => (getVal('hc-mode') === 'unesc' ? unescapeHtml(raw) : escapeHtml(raw)),
        }),
        UI.copyBtn(() => getVal('hc-out')),
      ]),
      UI.textarea('結果', 'hc-out', '', 6),
    ]);
    document.getElementById('hc-out').readOnly = true;
  };

  R.runcode = function (app) {
    const frame = UI.el('iframe', {
      id: 'rc-frame',
      className: 'tool-run-frame',
      sandbox: 'allow-scripts',
      title: '程式碼預覽',
      style: { width: '100%', minHeight: '200px', border: '1px solid #ddd', borderRadius: '8px' },
    });
    mount(app, [
      UI.alert('⚠️ 僅執行您自己輸入的程式碼。請勿貼上來路不明的 script！', 'warning'),
      hint('沙箱 iframe 預覽 HTML/CSS/JS，炸了再改，工程師日常。'),
      UI.textarea('HTML', 'rc-html', '<h1>Hello</h1><p>WaTools</p>', 4),
      UI.textarea('CSS', 'rc-css', 'body{font-family:sans-serif;padding:1rem}', 3),
      UI.textarea('JavaScript', 'rc-js', "document.body.insertAdjacentHTML('beforeend','<p>JS 已執行</p>');", 3),
      UI.btn('▶ 執行', 'btn btn-success tool-btn', () => {
        const html = getVal('rc-html');
        const css = getVal('rc-css');
        const js = getVal('rc-js');
        const srcdoc = `<!DOCTYPE html><html><head><style>${css}</style></head><body>${html}<script>${js}<\/script></body></html>`;
        frame.srcdoc = srcdoc;
      }),
      UI.panel('預覽', frame),
    ]);
  };

  R.unicode = function (app) {
    mount(app, [
      hint('UTF-8 文字轉 \\u 跳脫序列，除錯 JSON 時常用。'),
      UI.textarea('UTF-8 文字', 'uni-in', '你好 ABC', 4),
      UI.btnGroup([
        UI.bindIO({
          input: 'uni-in',
          output: 'uni-out',
          btnText: '轉 Unicode 跳脫',
          transform: utf8ToUnicodeEscapes,
        }),
        UI.copyBtn(() => getVal('uni-out')),
      ]),
      UI.textarea('結果', 'uni-out', '', 4),
    ]);
    document.getElementById('uni-out').readOnly = true;
  };

  R.punycode = function (app) {
    mount(app, [
      hint('中文網域與 Punycode（xn--）互轉，靠瀏覽器 URL API，信它一回。'),
      UI.input('Unicode 域名', 'pn-uni', 'text', '例子.台灣'),
      UI.input('Punycode', 'pn-ace', 'text', 'xn--'),
      UI.btnGroup([
        UI.btn('→ Punycode', 'btn btn-primary tool-btn', () => {
          try {
            const domain = getVal('pn-uni').trim();
            const puny = new URL('http://' + domain).hostname;
            setVal('pn-ace', puny);
          } catch (e) {
            UI.alert('轉換失敗：' + e.message, 'danger');
          }
        }),
        UI.btn('← Unicode', 'btn btn-outline-primary tool-btn', () => {
          try {
            const ace = getVal('pn-ace').trim();
            const a = document.createElement('a');
            a.href = 'http://' + ace;
            setVal('pn-uni', a.hostname);
          } catch (e) {
            UI.alert('還原失敗：' + e.message, 'danger');
          }
        }),
      ]),
      UI.el('p', { className: 'tool-hint text-muted small' }, '提示：也可將中文域名貼到瀏覽器網址列，再從網址列複製 Punycode。'),
    ]);
  };

  R['http-status'] = function (app) {
    mount(app, [
      hint('200 開心、404 心碎、500 先睡——HTTP 狀態碼速查。'),
      UI.panel('常見狀態碼', UI.tableFrom(HTTP_STATUS, [
        { key: 'code', label: '代碼' },
        { key: 'name', label: '名稱' },
        { key: 'desc', label: '說明' },
      ])),
    ]);
  };

  R['html-entities'] = function (app) {
    const table = UI.tableFrom(HTML_ENTITIES, [
      { key: 'char', label: '字元' },
      { key: 'name', label: '名稱' },
      { key: 'entity', label: '實體' },
      {
        key: 'entity',
        label: '複製',
        render: (val) => {
          const b = UI.btn('複製', 'btn btn-sm btn-outline-secondary', async () => {
            try {
              await navigator.clipboard.writeText(val);
              UI.alert('已複製 ' + val, 'success');
            } catch { UI.alert('複製失敗', 'warning'); }
          });
          return b;
        },
      },
    ]);
    mount(app, [
      hint('&nbsp; &copy; &reg; — 特殊字元實體對照，抄起來比記憶快。'),
      UI.panel('HTML 特殊字元', table),
    ]);
  };

  R.keycode = function (app) {
    const box = UI.el('div', {
      id: 'kc-box',
      className: 'tool-key-box',
      tabindex: '0',
      style: { padding: '2rem', border: '2px dashed #3fbbc0', borderRadius: '8px', textAlign: 'center', outline: 'none' },
    }, '點此後按下任意鍵…');
    const out = UI.output('kc-out');
    box.addEventListener('keydown', (e) => {
      e.preventDefault();
      out.textContent =
        `鍵名 key: ${e.key}\n` +
        `代碼 code: ${e.code}\n` +
        `keyCode: ${e.keyCode}\n` +
        `which: ${e.which}\n` +
        `修飾鍵: ${[e.ctrlKey && 'Ctrl', e.shiftKey && 'Shift', e.altKey && 'Alt', e.metaKey && 'Meta'].filter(Boolean).join('+') || '無'}`;
    });
    mount(app, [
      hint('按下鍵盤，立刻知道 key / code / keyCode — 寫 hotkey 必備。'),
      box,
      UI.panel('鍵盤事件', out),
    ]);
  };

  R['unicode-table'] = function (app) {
    const out = UI.output('ut-out');
    mount(app, [
      hint('輸入 Unicode 碼點（如 4E2D 或 U+4E2D），查字像查字典。'),
      UI.input('碼點（16 進位）', 'ut-code', 'text', '4E2D'),
      UI.btn('查詢', 'btn btn-primary tool-btn', () => {
        const raw = getVal('ut-code').replace(/^U\+/i, '').trim();
        const cp = parseInt(raw, 16);
        if (Number.isNaN(cp) || cp < 0 || cp > 0x10FFFF) {
          UI.alert('無效的碼點', 'warning');
          return;
        }
        const ch = String.fromCodePoint(cp);
        out.textContent = `碼點: U+${cp.toString(16).toUpperCase().padStart(4, '0')}\n字元: ${ch}\nUTF-16: ${cp > 0xffff ? 'surrogate pair' : '\\u' + cp.toString(16).toUpperCase().padStart(4, '0')}`;
      }),
      UI.panel('結果', out),
      UI.btn('瀏覽附近字元', 'btn btn-outline-secondary tool-btn', () => {
        const raw = getVal('ut-code').replace(/^U\+/i, '').trim();
        const cp = parseInt(raw, 16) || 0x4E00;
        const chars = [];
        for (let i = Math.max(0, cp - 5); i <= cp + 5; i++) {
          try { chars.push(`${String.fromCodePoint(i)} (U+${i.toString(16).toUpperCase()})`); } catch { /* skip */ }
        }
        out.textContent = chars.join('\n');
      }),
    ]);
  };

  R.big5 = function (app) {
    mount(app, [
      hint('Big5 大五碼：台灣繁體中文的復古編碼，完整表請查官方對照，這裡只有精選。'),
      UI.alert('完整 Big5 對照表龐大，本工具僅示範常見字元。', 'info'),
      UI.panel('Big5 範例對照', UI.tableFrom(BIG5_SAMPLES, [
        { key: 'big5', label: 'Big5 碼' },
        { key: 'unicode', label: 'Unicode' },
        { key: 'char', label: '字元' },
      ])),
      UI.input('查 Unicode 字元', 'b5-char', 'text', '中'),
      UI.btn('查詢（範圍內）', 'btn btn-primary tool-btn', () => {
        const ch = getVal('b5-char').trim();
        const found = BIG5_SAMPLES.find((r) => r.char === ch);
        document.getElementById('b5-out').textContent = found
          ? `Big5: ${found.big5} → ${found.unicode} → ${found.char}`
          : '不在示範範圍內，請查完整 Big5 對照表。';
      }),
      UI.panel('查詢結果', UI.output('b5-out')),
    ]);
  };

  R['keyboard-mouse'] = function (app) {
    const pad = UI.el('div', {
      id: 'km-pad',
      className: 'tool-km-pad',
      style: { height: '200px', background: '#f8f9fa', border: '1px solid #dee2e6', borderRadius: '8px', position: 'relative', cursor: 'crosshair' },
    });
    const dot = UI.el('div', { style: { position: 'absolute', width: '8px', height: '8px', background: '#3fbbc0', borderRadius: '50%', transform: 'translate(-50%,-50%)', display: 'none' } });
    pad.appendChild(dot);
    const out = UI.output('km-out');
    let lastMouse = '滑鼠：移入灰色區域…';
    let lastKey = '鍵盤：點擊區域後按鍵…';
    pad.addEventListener('mousemove', (e) => {
      const rect = pad.getBoundingClientRect();
      const x = Math.round(e.clientX - rect.left);
      const y = Math.round(e.clientY - rect.top);
      dot.style.display = '';
      dot.style.left = x + 'px';
      dot.style.top = y + 'px';
      lastMouse = `滑鼠：(${x}, ${y})`;
      out.textContent = lastKey + '\n' + lastMouse;
    });
    pad.addEventListener('click', () => pad.focus());
    pad.tabIndex = 0;
    pad.addEventListener('keydown', (e) => {
      lastKey = `鍵盤：key=${e.key} | code=${e.code}`;
      out.textContent = lastKey + '\n' + lastMouse;
    });
    mount(app, [
      hint('滑鼠座標 + 鍵盤事件，確認是硬體問題還是手殘。'),
      pad,
      UI.panel('事件資訊', out),
    ]);
  };

  R['seo-search'] = function (app) {
    const linksOut = UI.el('div', { className: 'tool-seo-links' });
    const out = UI.output('seo-out');

    function normalizeDomain(input) {
      let s = input.trim();
      if (!s) return '';
      if (!/^https?:\/\//i.test(s)) s = `https://${s}`;
      try {
        return new URL(s).hostname.replace(/^www\./i, '');
      } catch {
        return s.replace(/^https?:\/\//i, '').replace(/\/.*$/, '').replace(/^www\./i, '');
      }
    }

    function searchLinks(domain) {
      const d = normalizeDomain(domain);
      if (!d) return [];
      const q = encodeURIComponent(d);
      return [
        { label: 'Google 收錄 (site:)', url: `https://www.google.com/search?q=site:${q}` },
        { label: 'Google 反鏈 (link:)', url: `https://www.google.com/search?q=link:${q}` },
        { label: 'Google 相關 (related:)', url: `https://www.google.com/search?q=related:${q}` },
        { label: 'Bing 收錄 (site:)', url: `https://www.bing.com/search?q=site:${q}` },
        { label: 'Bing 反鏈 (link:)', url: `https://www.bing.com/search?q=link:${q}` },
        { label: 'robots.txt', url: `https://${d}/robots.txt` },
        { label: 'sitemap.xml', url: `https://${d}/sitemap.xml` },
        { label: 'Google Search Console', url: 'https://search.google.com/search-console' },
        { label: 'PageSpeed Insights', url: `https://pagespeed.web.dev/analysis?url=https://${d}/` },
      ];
    }

    function renderLinks(domain) {
      linksOut.replaceChildren();
      const links = searchLinks(domain);
      if (!links.length) {
        linksOut.appendChild(UI.el('p', { className: 'text-muted small mb-0' }, '請輸入有效的網址或域名。'));
        return;
      }
      links.forEach(({ label, url }) => {
        linksOut.appendChild(
          UI.el('a', {
            href: url,
            target: '_blank',
            rel: 'noopener noreferrer',
            className: 'tool-seo-link',
          }, `${label} ↗`)
        );
      });
    }

    async function checkBasics(domain) {
      const d = normalizeDomain(domain);
      if (!d) return '請輸入有效的網址或域名。';

      const lines = [`檢測域名：${d}`, ''];
      const currentHost = location.hostname.replace(/^www\./i, '');
      const canFetch = currentHost === d;

      for (const [name, path] of [['robots.txt', '/robots.txt'], ['sitemap.xml', '/sitemap.xml']]) {
        if (canFetch) {
          try {
            const res = await fetch(path, { method: 'GET', cache: 'no-store' });
            const text = res.ok ? (await res.text()).slice(0, 280) : '';
            lines.push(`${res.ok ? '✅' : '❌'} ${name}：HTTP ${res.status}`);
            if (text) lines.push(text.replace(/\s+/g, ' ').trim(), '');
          } catch (err) {
            lines.push(`⚠️ ${name}：讀取失敗（${err.message}）`);
          }
        } else {
          lines.push(`🔗 ${name}：請用上方連結手動開啟（跨域無法自動讀取）`);
        }
      }

      if (location.protocol === 'file:') {
        lines.push('', '💡 以 file:// 開啟時無法自動檢測，請部署後再試，或直接用上方連結。');
      }

      return lines.join('\n');
    }

    const checklist = [
      '網站是否有 sitemap.xml',
      'robots.txt 是否允許爬蟲',
      '每頁是否有唯一 title 與 meta description',
      '是否有 canonical 與 Open Graph 標籤',
      '使用語意化 HTML（h1-h6 結構）',
      '圖片是否有 alt 屬性',
      '行動版是否 RWD 友善',
      'HTTPS 是否啟用',
      '頁面載入速度（Core Web Vitals）',
      '內部連結結構是否合理',
      '是否有結構化資料 Schema.org',
    ];

    mount(app, [
      hint('輸入網址或域名，產生搜尋引擎「收錄／反鏈」查詢連結，並檢測 robots.txt、sitemap.xml。'),
      UI.input('網站網址或域名', 'seo-domain', 'text', 'watoolio.web.app'),
      UI.btnGroup([
        UI.btn('產生查詢連結', 'btn btn-primary tool-btn', () => renderLinks(getVal('seo-domain'))),
        UI.btn('檢測基礎檔案', 'btn btn-outline-primary tool-btn', async () => {
          out.textContent = '檢測中…';
          out.textContent = await checkBasics(getVal('seo-domain'));
        }),
        UI.btn('WaTools 預設', 'btn btn-outline-secondary tool-btn', () => {
          setVal('seo-domain', 'watoolio.web.app');
          renderLinks('watoolio.web.app');
        }),
      ]),
      UI.panel('搜尋引擎查詢', linksOut),
      UI.panel('檢測結果', out),
      UI.panel(
        'SEO 自查清單',
        [
          UI.el(
            'ul',
            { className: 'tool-checklist' },
            checklist.map((item) => UI.el('li', {}, item))
          ),
          UI.el('p', { className: 'text-muted small mb-0' }, '進階工具：Google Search Console、Ahrefs、Semrush 等。'),
        ]
      ),
    ]);

    renderLinks('watoolio.web.app');
  };

  R.sitemap = function (app) {
    mount(app, [
      hint('每行一個 URL，自動產生 XML sitemap，爬蟲不迷路。'),
      UI.textarea('網址列表（每行一個）', 'sm-in', 'https://example.com/\nhttps://example.com/about', 8),
      UI.input('changefreq', 'sm-freq', 'text', 'weekly'),
      UI.input('priority', 'sm-pri', 'text', '0.8'),
      UI.btnGroup([
        UI.btn('產生 Sitemap', 'btn btn-primary tool-btn', () => {
          const urls = getVal('sm-in').split('\n').map((u) => u.trim()).filter(Boolean);
          const freq = getVal('sm-freq') || 'weekly';
          const pri = getVal('sm-pri') || '0.8';
          const today = new Date().toISOString().slice(0, 10);
          const xml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
            urls.map((u) => `  <url>\n    <loc>${escapeHtml(u)}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${freq}</changefreq>\n    <priority>${pri}</priority>\n  </url>`).join('\n') +
            '\n</urlset>';
          setVal('sm-out', xml);
        }),
        UI.copyBtn(() => getVal('sm-out')),
        UI.btn('下載 XML', 'btn btn-success tool-btn', () => {
          const blob = new Blob([getVal('sm-out')], { type: 'application/xml' });
          const a = document.createElement('a');
          a.href = URL.createObjectURL(blob);
          a.download = 'sitemap.xml';
          a.click();
        }),
      ]),
      UI.textarea('XML Sitemap', 'sm-out', '', 10),
    ]);
    document.getElementById('sm-out').readOnly = true;
  };

  R['seo-keyword'] = function (app) {
    const out = UI.output('sk-out');
    mount(app, [
      hint('關鍵字密度分析，堆太多關鍵字 Google 會嫌你煩。'),
      UI.input('目標關鍵字', 'sk-kw', 'text', 'SEO'),
      UI.textarea('文章內容', 'sk-text', '貼上文章…', 8),
      UI.btn('分析密度', 'btn btn-primary tool-btn', () => {
        const kw = getVal('sk-kw').trim().toLowerCase();
        const text = getVal('sk-text');
        if (!kw || !text) { UI.alert('請輸入關鍵字與內容', 'warning'); return; }
        const words = countWords(text);
        const matches = (text.toLowerCase().match(new RegExp(kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
        const density = words ? ((matches / words) * 100).toFixed(2) : 0;
        out.textContent =
          `總字數：${words}\n` +
          `關鍵字「${kw}」出現：${matches} 次\n` +
          `密度：${density}%\n` +
          (density > 3 ? '⚠️ 密度偏高，可能被視為堆砌' : density < 0.5 ? '💡 密度偏低，可自然增加提及' : '✅ 密度適中');
      }),
    ]);
  };

  /* ── SECURITY ── */

  R.password = function (app) {
    const strengthBar = UI.el('div', { className: 'tool-strength-bar', id: 'pw-bar', style: { height: '8px', background: '#eee', borderRadius: '4px', overflow: 'hidden' } },
      UI.el('div', { id: 'pw-fill', style: { height: '100%', width: '0%', background: '#dc3545', transition: 'width .3s' } })
    );
    const strengthLabel = UI.el('span', { id: 'pw-label', className: 'small text-muted' }, '');
    mount(app, [
      hint('強密碼產生器 + 強度檢測，123456 請退場。'),
      UI.input('長度', 'pw-len', 'number', '16'),
      UI.el('div', { className: 'tool-field' }, [
        UI.el('label', { className: 'tool-label' }, '選項'),
        UI.el('div', { className: 'tool-check-row' }, [
          UI.el('label', {}, [UI.el('input', { type: 'checkbox', id: 'pw-lo', checked: true }), ' 小寫']),
          UI.el('label', {}, [UI.el('input', { type: 'checkbox', id: 'pw-up', checked: true }), ' 大寫']),
          UI.el('label', {}, [UI.el('input', { type: 'checkbox', id: 'pw-nu', checked: true }), ' 數字']),
          UI.el('label', {}, [UI.el('input', { type: 'checkbox', id: 'pw-sy', checked: true }), ' 符號']),
        ]),
      ]),
      UI.btnGroup([
        UI.btn('產生密碼', 'btn btn-primary tool-btn', () => {
          const len = Math.max(4, Math.min(128, +getVal('pw-len') || 16));
          const p = genPassword(len, {
            lower: document.getElementById('pw-lo').checked,
            upper: document.getElementById('pw-up').checked,
            num: document.getElementById('pw-nu').checked,
            sym: document.getElementById('pw-sy').checked,
          });
          setVal('pw-out', p);
          updateStrength(p);
        }),
        UI.copyBtn(() => getVal('pw-out')),
      ]),
      UI.input('密碼', 'pw-out', 'text', ''),
      strengthBar,
      strengthLabel,
    ]);
    function updateStrength(p) {
      const { score, label } = passwordStrength(p);
      const colors = ['#dc3545', '#fd7e14', '#ffc107', '#20c997', '#198754'];
      document.getElementById('pw-fill').style.width = ((score + 1) / 5 * 100) + '%';
      document.getElementById('pw-fill').style.background = colors[Math.min(score, 4)];
      document.getElementById('pw-label').textContent = '強度：' + label;
    }
    document.getElementById('pw-out').addEventListener('input', (e) => updateStrength(e.target.value));
  };

  R['email-icon'] = function (app) {
    const canvas = UI.el('canvas', { id: 'em-canvas', width: 200, height: 40, className: 'tool-canvas-border' });
    mount(app, [
      hint('Email 轉圖片或混淆文字，防機器人 scraping（但擋不住決心）。'),
      UI.input('Email', 'em-addr', 'email', 'hello@example.com'),
      UI.btnGroup([
        UI.btn('產生圖片', 'btn btn-primary tool-btn', () => {
          const ctx = canvas.getContext('2d');
          const email = getVal('em-addr');
          ctx.fillStyle = '#fff';
          ctx.fillRect(0, 0, 200, 40);
          ctx.fillStyle = '#333';
          ctx.font = '16px sans-serif';
          ctx.fillText(email, 8, 26);
        }),
        UI.btn('混淆文字', 'btn btn-outline-primary tool-btn', () => {
          const e = getVal('em-addr');
          const obf = e.replace('@', ' [at] ').replace(/\./g, ' [dot] ');
          setVal('em-obf', obf);
        }),
        UI.btn('下載圖片', 'btn btn-success tool-btn', () => {
          canvas.toBlob((b) => {
            const a = document.createElement('a');
            a.href = URL.createObjectURL(b);
            a.download = 'email.png';
            a.click();
          });
        }),
      ]),
      UI.el('div', { className: 'tool-canvas-wrap' }, canvas),
      UI.textarea('混淆文字', 'em-obf', '', 2),
    ]);
  };

  R.textencrypt = function (app) {
    mount(app, [
      UI.alert('⚠️ 示範用 XOR + Base64，非真正 AES，請勿加密國家機密！', 'warning'),
      hint('密碼 XOR 加密演示，八卦也要有保障（但請用正規加密工具處理正經事）。'),
      UI.input('密碼', 'te-pass', 'password', ''),
      UI.textarea('明文', 'te-plain', '要加密的文字…', 4),
      UI.textarea('密文（Base64）', 'te-cipher', '', 4),
      UI.btnGroup([
        UI.btn('加密 →', 'btn btn-primary tool-btn', () => {
          const pass = getVal('te-pass');
          if (!pass) { UI.alert('請輸入密碼', 'warning'); return; }
          setVal('te-cipher', xorEncrypt(getVal('te-plain'), pass));
        }),
        UI.btn('← 解密', 'btn btn-outline-primary tool-btn', () => {
          const pass = getVal('te-pass');
          if (!pass) { UI.alert('請輸入密碼', 'warning'); return; }
          try {
            setVal('te-plain', xorDecrypt(getVal('te-cipher'), pass));
          } catch {
            UI.alert('解密失敗，密碼或密文錯誤', 'danger');
          }
        }),
      ]),
    ]);
  };

  R.longurl = function (app) {
    mount(app, [
      hint('貼短網址試著還原，多數服務因 CORS 無法直接 HEAD，這裡教你怎么查。'),
      UI.input('短網址', 'lu-in', 'url', 'https://bit.ly/example'),
      UI.btn('嘗試解析', 'btn btn-primary tool-btn', async () => {
        const url = getVal('lu-in').trim();
        const out = document.getElementById('lu-out');
        out.textContent = '解析中…';
        try {
          const res = await fetch(url, { method: 'HEAD', redirect: 'follow', mode: 'cors' });
          out.textContent = `最終 URL: ${res.url}\n狀態: ${res.status}`;
        } catch {
          out.textContent =
            '無法直接解析（CORS / 跨域限制）。\n\n替代方法：\n' +
            '1. 瀏覽器開啟短網址，看網址列跳轉結果\n' +
            '2. 使用 curl -I "' + url + '"\n' +
            '3. 線上 unshorten 服務（如 unshorten.me）';
        }
      }),
      UI.panel('結果 / 提示', UI.output('lu-out')),
    ]);
  };

  R['url-crypto'] = function (app) {
    mount(app, [
      hint('URL Base64 編碼/解碼，分享連結多一層「看起來很專業」。'),
      UI.select('模式', 'ucr-mode', [
        { value: 'enc', label: '編碼' },
        { value: 'dec', label: '解碼' },
      ]),
      UI.textarea('URL', 'ucr-in', 'https://example.com/secret?page=1', 3),
      UI.btnGroup([
        UI.bindIO({
          input: 'ucr-in',
          output: 'ucr-out',
          btnText: '轉換',
          transform: (raw) => {
            try {
              return getVal('ucr-mode') === 'dec'
                ? decodeURIComponent(escape(atob(raw.trim())))
                : btoa(unescape(encodeURIComponent(raw.trim())));
            } catch {
              throw new Error('Base64 格式錯誤');
            }
          },
        }),
        UI.copyBtn(() => getVal('ucr-out')),
      ]),
      UI.textarea('結果', 'ucr-out', '', 3),
    ]);
    document.getElementById('ucr-out').readOnly = true;
  };
})();
