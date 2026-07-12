/**
 * Kawatool — Editor, Dev & Security tool implementations (part 1)
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
    const meta = [
      { label: '極弱', desc: '易被猜中或暴力破解，請勿用於任何重要帳號。' },
      { label: '偏弱', desc: '仍不足以保護重要服務，建議加長並增加字元種類。' },
      { label: '中等', desc: '一般低風險網站勉強可用，銀行或 Email 建議再加強。' },
      { label: '強', desc: '符合多數網站建議，適合大多數日常使用。' },
      { label: '極強', desc: '長度與複雜度俱佳，記得每個帳號使用不同密碼。' },
    ];
    if (!p) {
      return { score: -1, label: '—', desc: '輸入或產生密碼後，將即時顯示強度評估。', tips: [] };
    }
    let raw = 0;
    const tips = [];
    if (p.length >= 8) raw++;
    else tips.push('至少 8 個字元（建議 12 字元以上）');
    if (p.length >= 12) raw++;
    else if (p.length >= 8) tips.push('加長至 12 字元以上可大幅提升安全性');
    if (/[a-z]/.test(p) && /[A-Z]/.test(p)) raw++;
    else tips.push('混合大小寫英文字母');
    if (/\d/.test(p)) raw++;
    else tips.push('加入數字');
    if (/[^a-zA-Z0-9]/.test(p)) raw++;
    else tips.push('加入符號（如 ! @ # $）');
    if (/^(123456|password|qwerty|admin|letmein)/i.test(p)) {
      raw = 0;
      tips.unshift('避免使用常見弱密碼（如 123456、password）');
    }
    if (/(.)\1{2,}/.test(p)) tips.push('減少連續重複字元');
    if (p.length < 4) raw = 0;
    const score = Math.min(raw, 4);
    return {
      score,
      label: meta[score].label,
      desc: meta[score].desc,
      tips: [...new Set(tips)].slice(0, 4),
    };
  }

  function genPassword(len, opts) {
    const pools = [];
    if (opts.lower) pools.push('abcdefghijklmnopqrstuvwxyz');
    if (opts.upper) pools.push('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
    if (opts.num) pools.push('0123456789');
    if (opts.sym) pools.push('!@#$%^&*-_+=');
    let chars = pools.join('');
    if (!chars) chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const required = pools.map((pool) => pool[UI.randomInt(0, pool.length - 1)]);
    const out = required.slice();
    while (out.length < len) {
      out.push(chars[UI.randomInt(0, chars.length - 1)]);
    }
    for (let i = out.length - 1; i > 0; i--) {
      const j = UI.randomInt(0, i);
      [out[i], out[j]] = [out[j], out[i]];
    }
    return out.join('');
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
    { big5: 'A443', unicode: 'U+4E07', char: '萬' },
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

  R['chn-upper'] = function (app) {
    mount(app, [
      hint('票據填寫須做到「資訊齊全、字跡清晰、防範塗改」，金額大寫須使用法定正楷或行書，並嚴格遵循結尾與間隔規範。大寫金額請用正楷（如：壹、貳），須緊接幣別填寫不可留空，金額至元為止請加「整」字，且全張票據嚴禁塗改。'),
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
      UI.input('文字', 'cf-text', 'text', 'Kawatool 漸層彩字'),
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
      UI.textarea('輸入', 'uc-in', '你好 Kawatool', 4),
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
      UI.textarea('HTML', 'rc-html', '<h1>Hello</h1><p>Kawatool</p>', 4),
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
      UI.input('Unicode 域名', 'pn-uni', 'text', '例子.臺灣'),
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
      hint('Big5 大五碼：臺灣繁體中文的復古編碼，完整表請查官方對照，這裡只有精選。'),
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
      UI.input('網站網址或域名', 'seo-domain', 'text', 'kawatool.com'),
      UI.btnGroup([
        UI.btn('產生查詢連結', 'btn btn-primary tool-btn', () => renderLinks(getVal('seo-domain'))),
        UI.btn('檢測基礎檔案', 'btn btn-outline-primary tool-btn', async () => {
          out.textContent = '檢測中…';
          out.textContent = await checkBasics(getVal('seo-domain'));
        }),
        UI.btn('Kawatool 預設', 'btn btn-outline-secondary tool-btn', () => {
          setVal('seo-domain', 'kawatool.com');
          renderLinks('kawatool.com');
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

    renderLinks('kawatool.com');
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
    app.className = 'tool-app pwd-app';

    const strengthBar = UI.el(
      'div',
      { className: 'pwd-strength', id: 'pw-bar', 'data-level': '-1' },
      Array.from({ length: 5 }, () => UI.el('span', { className: 'pwd-strength-seg' }))
    );
    const strengthLabel = UI.el('strong', { id: 'pw-label', className: 'pwd-strength-label' }, '—');
    const strengthDesc = UI.el('p', { id: 'pw-desc', className: 'pwd-strength-desc text-muted small mb-0' }, '輸入或產生密碼後，將即時顯示強度評估。');
    const tipsList = UI.el('ul', { id: 'pw-tips', className: 'pwd-tips list-unstyled mb-0' });

    const pwInput = UI.el('input', {
      type: 'password',
      id: 'pw-out',
      className: 'form-control pwd-output',
      autocomplete: 'off',
      spellcheck: 'false',
      placeholder: '在此產生或貼上欲檢測的密碼',
    });

    let visible = false;
    const toggleVisBtn = UI.btn('顯示', 'btn btn-outline-secondary btn-sm pwd-toggle-btn', () => {
      visible = !visible;
      pwInput.type = visible ? 'text' : 'password';
      toggleVisBtn.textContent = visible ? '隱藏' : '顯示';
    });

    const lenRange = UI.el('input', {
      type: 'range',
      id: 'pw-len-range',
      className: 'form-range pwd-range',
      min: '8',
      max: '64',
      value: '16',
    });
    const lenNum = UI.el('input', {
      type: 'number',
      id: 'pw-len',
      className: 'form-control pwd-len-input',
      min: '8',
      max: '128',
      value: '16',
    });

    function makeOpt(id, label, checked) {
      return UI.el('label', { className: 'pwd-option' }, [
        UI.el('input', { type: 'checkbox', id, checked: !!checked }),
        UI.el('span', {}, label),
      ]);
    }

    function getOpts() {
      return {
            lower: document.getElementById('pw-lo').checked,
            upper: document.getElementById('pw-up').checked,
            num: document.getElementById('pw-nu').checked,
            sym: document.getElementById('pw-sy').checked,
      };
    }

    function getLen() {
      return Math.max(8, Math.min(128, +getVal('pw-len') || 16));
    }

    function syncLen() {
      const clamped = getLen();
      lenNum.value = String(clamped);
      lenRange.value = String(Math.min(64, clamped));
    }

    function updateStrength(p) {
      const { score, label, desc, tips } = passwordStrength(p);
      strengthBar.dataset.level = String(score);
      strengthLabel.textContent = p ? label : '—';
      strengthDesc.textContent = desc;
      tipsList.replaceChildren();
      if (tips.length) {
        tips.forEach((tip) => {
          tipsList.appendChild(UI.el('li', {}, [
            UI.el('i', { className: 'bi bi-lightbulb pwd-tip-icon' }),
            tip,
          ]));
        });
      }
    }

    function doGenerate() {
      syncLen();
      const len = getLen();
      const p = genPassword(len, getOpts());
          setVal('pw-out', p);
          updateStrength(p);
    }

    mount(app, [
      UI.el('div', { className: 'pwd-intro tool-panel-card' }, [
        UI.el('p', { className: 'pwd-lead mb-2' }, '密碼是保護 Email、社群、銀行與工作帳號的第一道防線。本工具可在瀏覽器本地產生隨機強密碼，並即時評估你輸入的密碼強度——資料不會上傳至伺服器。'),
        UI.el('p', { className: 'text-muted small mb-0' }, '用途：① 快速產生高熵隨機密碼　② 檢查現有密碼是否過短或過於單調　③ 了解長度、字元種類對安全性的影響。'),
      ]),
      UI.panel('產生強密碼', [
        UI.el('div', { className: 'tool-field' }, [
          UI.el('label', { className: 'tool-label', for: 'pw-len-range' }, '密碼長度'),
          UI.el('div', { className: 'pwd-len-row' }, [
            lenRange,
            UI.el('div', { className: 'pwd-len-num-wrap' }, [
              lenNum,
              UI.el('span', { className: 'pwd-len-unit' }, '字元'),
            ]),
          ]),
          UI.el('p', { className: 'tool-hint text-muted small mb-0' }, '建議重要帳號至少 12～16 字元；長度每增加一位，暴力破解難度呈指數成長。'),
        ]),
        UI.el('div', { className: 'tool-field' }, [
          UI.el('span', { className: 'tool-label d-block' }, '字元種類'),
          UI.el('div', { className: 'pwd-options' }, [
            makeOpt('pw-lo', '小寫 a–z', true),
            makeOpt('pw-up', '大寫 A–Z', true),
            makeOpt('pw-nu', '數字 0–9', true),
            makeOpt('pw-sy', '符號 !@#…', true),
          ]),
        ]),
        UI.btnGroup([
          UI.btn('產生新密碼', 'btn btn-primary tool-btn', doGenerate),
        UI.copyBtn(() => getVal('pw-out')),
      ]),
      ]),
      UI.panel('密碼強度檢測', [
        UI.el('div', { className: 'tool-field mb-0' }, [
          UI.el('label', { className: 'tool-label', for: 'pw-out' }, '密碼內容'),
          UI.el('div', { className: 'pwd-output-wrap' }, [pwInput, toggleVisBtn]),
        ]),
        UI.el('div', { className: 'pwd-strength-block' }, [
      strengthBar,
          UI.el('div', { className: 'pwd-strength-meta' }, [
            UI.el('span', { className: 'text-muted small' }, '強度：'),
      strengthLabel,
          ]),
          strengthDesc,
          tipsList,
        ]),
      ]),
      UI.panel('為什麼需要強密碼？', [
        UI.el('ul', { className: 'tool-checklist text-muted' }, [
          UI.el('li', {}, '帳號被盜常因弱密碼、重複使用同一組密碼，或資料外洩後被「撞庫」攻擊。'),
          UI.el('li', {}, '強密碼 = 足夠長 + 混合多種字元 + 每個服務各用一組，可大幅拉高破解成本。'),
          UI.el('li', {}, '本工具評估項目：長度（8／12 字元門檻）、大小寫、數字、符號，以及常見弱密碼模式。'),
        ]),
      ]),
      UI.panel('安全使用建議', [
        UI.el('div', { className: 'pwd-tip-grid' }, [
          UI.el('div', { className: 'pwd-tip-card' }, [
            UI.el('h4', {}, [UI.el('i', { className: 'bi bi-key pwd-tip-card-icon' }), ' 唯一性']),
            UI.el('p', { className: 'text-muted small mb-0' }, '不同網站使用不同密碼。一處外洩時，其他帳號才不會連鎖失守。'),
          ]),
          UI.el('div', { className: 'pwd-tip-card' }, [
            UI.el('h4', {}, [UI.el('i', { className: 'bi bi-shield-check pwd-tip-card-icon' }), ' 密碼管理器']),
            UI.el('p', { className: 'text-muted small mb-0' }, '用 1Password、Bitwarden 等工具保存長密碼，不必靠記憶或便條紙。'),
          ]),
          UI.el('div', { className: 'pwd-tip-card' }, [
            UI.el('h4', {}, [UI.el('i', { className: 'bi bi-phone pwd-tip-card-icon' }), ' 雙因素驗證']),
            UI.el('p', { className: 'text-muted small mb-0' }, 'Email、銀行、雲端等重要帳號請開啟 2FA，即使密碼外洩仍多一層保護。'),
          ]),
          UI.el('div', { className: 'pwd-tip-card' }, [
            UI.el('h4', {}, [UI.el('i', { className: 'bi bi-incognito pwd-tip-card-icon' }), ' 本地運算']),
            UI.el('p', { className: 'text-muted small mb-0' }, '產生與檢測皆在你的裝置上完成，Kawatool 不會收集或儲存你輸入的密碼。'),
          ]),
        ]),
      ]),
    ]);

    lenRange.addEventListener('input', () => {
      lenNum.value = lenRange.value;
    });
    lenNum.addEventListener('input', () => syncLen());
    pwInput.addEventListener('input', (e) => updateStrength(e.target.value));

    doGenerate();
  };

  R['email-icon'] = function (app) {
    app.className = 'tool-app emicon-app';

    const canvas = UI.el('canvas', { id: 'em-canvas', className: 'emicon-canvas' });
    const previewMeta = UI.el('p', { id: 'em-preview-meta', className: 'emicon-preview-meta text-muted small mb-0' }, '—');
    const obfOut = UI.el('textarea', {
      id: 'em-obf',
      className: 'form-control emicon-code',
      rows: 2,
      readOnly: true,
      placeholder: '混淆文字將顯示於此',
    });
    const htmlOut = UI.el('textarea', {
      id: 'em-html',
      className: 'form-control emicon-code',
      rows: 3,
      readOnly: true,
      placeholder: 'HTML 嵌入碼將顯示於此',
    });

    const themes = {
      light: { bg: '#ffffff', fg: '#2c3840', border: '#d8dee4', label: '淺色背景' },
      dark: { bg: '#1a2228', fg: '#e8eef2', border: '#3a4650', label: '深色背景' },
      transparent: { bg: null, fg: '#2c3840', border: '#d8dee4', label: '透明背景' },
    };
    let currentTheme = 'light';

    function getEmail() {
      return getVal('em-addr').trim();
    }

    function obfuscate(email, mode) {
      if (!email) return '';
      switch (mode) {
        case 'bracket':
          return email.replace('@', ' [at] ').replace(/\./g, ' [dot] ');
        case 'paren':
          return email.replace('@', '(at)').replace(/\./g, '(dot)');
        case 'entity':
          return email.replace(/@/g, '&#64;').replace(/\./g, '&#46;');
        case 'space':
          return email.replace('@', ' AT ').replace(/\./g, ' DOT ');
        default:
          return email.replace('@', ' [at] ').replace(/\./g, ' [dot] ');
      }
    }

    function drawCanvas(email) {
      const theme = themes[currentTheme];
      const ctx = canvas.getContext('2d');
      const fontSize = 16;
      const padX = 16;
      const padY = 12;
      const font = `600 ${fontSize}px "Noto Sans TC", ui-sans-serif, system-ui, sans-serif`;
      ctx.font = font;
      const textW = ctx.measureText(email || ' ').width;
      const cssW = Math.max(Math.ceil(textW + padX * 2), 120);
      const cssH = Math.ceil(fontSize + padY * 2);
      const dpr = window.devicePixelRatio || 1;

      canvas.width = cssW * dpr;
      canvas.height = cssH * dpr;
      canvas.style.width = `${cssW}px`;
      canvas.style.height = `${cssH}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (theme.bg) {
        ctx.fillStyle = theme.bg;
        ctx.fillRect(0, 0, cssW, cssH);
      } else {
        ctx.clearRect(0, 0, cssW, cssH);
      }

      ctx.strokeStyle = theme.border;
      ctx.lineWidth = 1;
      ctx.strokeRect(0.5, 0.5, cssW - 1, cssH - 1);

      ctx.fillStyle = theme.fg;
      ctx.font = font;
      ctx.textBaseline = 'middle';
      ctx.fillText(email, padX, cssH / 2);

      previewMeta.textContent = `尺寸 ${cssW} × ${cssH} px · ${theme.label}`;
      const wrap = document.getElementById('em-canvas-wrap');
      if (wrap) wrap.classList.toggle('emicon-canvas-wrap--checker', currentTheme === 'transparent');
      return { cssW, cssH };
    }

    function getHtmlSnippet(email, w, h) {
      const dataUrl = canvas.toDataURL('image/png');
      return (
        `<!-- 將下方 src 換成你上傳後的圖片網址，或使用 data URL -->\n` +
        `<img src="${dataUrl}" width="${w}" height="${h}" alt="聯絡信箱 ${email.replace(/"/g, '&quot;')}" loading="lazy">`
      );
    }

    function renderAll() {
      const email = getEmail();
      if (!email) {
        canvas.width = 0;
        canvas.height = 0;
        canvas.style.width = '';
        canvas.style.height = '';
        previewMeta.textContent = '請輸入有效的 Email 地址';
        obfOut.value = '';
        htmlOut.value = '';
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        previewMeta.textContent = 'Email 格式似乎不正確，仍可預覽但請確認內容';
      }
      const { cssW, cssH } = drawCanvas(email);
      const mode = document.getElementById('em-obf-mode')?.value || 'bracket';
      obfOut.value = obfuscate(email, mode);
      htmlOut.value = getHtmlSnippet(email, cssW, cssH);
    }

    function makeThemeBtn(key) {
      const btn = UI.btn(themes[key].label, `btn btn-sm emicon-theme-btn${currentTheme === key ? ' active' : ''}`, () => {
        currentTheme = key;
        app.querySelectorAll('.emicon-theme-btn').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        renderAll();
      });
      btn.dataset.theme = key;
      return btn;
    }

    mount(app, [
      UI.el('div', { className: 'emicon-intro tool-panel-card' }, [
        UI.el('p', { className: 'emicon-lead mb-2' }, '在個人網站、部落格或作品集公開聯絡方式時，若直接寫出 Email 文字，容易被自動化爬蟲收集並用於垃圾郵件。本工具提供兩種常見防護方式：'),
        UI.el('ul', { className: 'tool-checklist text-muted small mb-2' }, [
          UI.el('li', {}, '將 Email 轉成圖片：人眼可讀，多數簡單爬蟲無法直接擷取文字。'),
          UI.el('li', {}, '文字混淆：以 [at]、[dot] 或 HTML 實體等方式改寫，降低被批次比對的機率。'),
        ]),
        UI.el('p', { className: 'text-muted small mb-0' }, '用途：聯絡頁、About 頁、GitHub README、論壇簽名檔。注意：無法完全阻擋 OCR 或人工抄寫，重要帳號仍建議使用聯絡表單。'),
      ]),
      UI.panel('輸入 Email', [
        UI.input('電子郵件地址', 'em-addr', 'email', 'hello@example.com'),
        UI.el('p', { className: 'tool-hint text-muted small mb-0' }, '輸入後會即時更新預覽。建議使用對外聯絡用的信箱，而非主要私人帳號。'),
      ]),
      UI.panel('圖片預覽', [
        UI.el('div', { className: 'tool-field' }, [
          UI.el('span', { className: 'tool-label d-block' }, '預覽樣式'),
          UI.el('div', { className: 'emicon-theme-row' }, [
            makeThemeBtn('light'),
            makeThemeBtn('dark'),
            makeThemeBtn('transparent'),
          ]),
        ]),
        UI.el('div', { className: `emicon-canvas-wrap${currentTheme === 'transparent' ? ' emicon-canvas-wrap--checker' : ''}`, id: 'em-canvas-wrap' }, canvas),
        previewMeta,
      UI.btnGroup([
          UI.btn('重新整理預覽', 'btn btn-primary tool-btn', renderAll),
          UI.btn('下載 PNG', 'btn btn-success tool-btn', () => {
            const email = getEmail();
            if (!email) { UI.alert('請先輸入 Email', 'warning'); return; }
            canvas.toBlob((blob) => {
              if (!blob) { UI.alert('無法產生圖片', 'danger'); return; }
            const a = document.createElement('a');
              a.href = URL.createObjectURL(blob);
              a.download = `email-${email.replace(/[@.]/g, '-')}.png`;
            a.click();
              URL.revokeObjectURL(a.href);
            }, 'image/png');
          }),
          UI.copyBtn(() => htmlOut.value),
        ]),
      ]),
      UI.panel('HTML 嵌入碼', [
        UI.el('p', { className: 'text-muted small mb-3' }, '複製下方程式碼貼到網頁。若檔案較大，可先「下載 PNG」上傳至自己的空間，再將 src 改為圖片網址。'),
        htmlOut,
      ]),
      UI.panel('文字混淆', [
        UI.select('混淆方式', 'em-obf-mode', [
          { value: 'bracket', label: '方括號：name [at] example [dot] com', selected: true },
          { value: 'paren', label: '括號：name(at)example(dot)com' },
          { value: 'entity', label: 'HTML 實體：name&#64;example&#46;com' },
          { value: 'space', label: '空格：name AT example DOT com' },
        ]),
        obfOut,
        UI.btnGroup([
          UI.copyBtn(() => obfOut.value),
        ]),
        UI.el('p', { className: 'tool-hint text-muted small mb-0' }, 'HTML 實體可直接貼入網頁原始碼，瀏覽器會正常顯示為 Email 外觀，但原始碼中不含 @ 與 . 字元。'),
      ]),
      UI.panel('使用說明與限制', [
        UI.el('div', { className: 'emicon-tip-grid' }, [
          UI.el('div', { className: 'emicon-tip-card' }, [
            UI.el('h4', {}, [UI.el('i', { className: 'bi bi-image emicon-tip-icon' }), ' 何時用圖片']),
            UI.el('p', { className: 'text-muted small mb-0' }, '適合靜態展示頁。訪客需手動輸入或 OCR，無法直接點擊 mailto 連結。'),
          ]),
          UI.el('div', { className: 'emicon-tip-card' }, [
            UI.el('h4', {}, [UI.el('i', { className: 'bi bi-type emicon-tip-icon' }), ' 何時用文字混淆']),
            UI.el('p', { className: 'text-muted small mb-0' }, '適合純文字環境（Markdown、純文字簽名檔）。讀者需自行替換 [at]、[dot]。'),
          ]),
          UI.el('div', { className: 'emicon-tip-card' }, [
            UI.el('h4', {}, [UI.el('i', { className: 'bi bi-shield-exclamation emicon-tip-icon' }), ' 防護程度']),
            UI.el('p', { className: 'text-muted small mb-0' }, '可擋過簡單爬蟲，無法阻擋 OCR、進階機器人或人工。請勿視為加密或絕對安全。'),
          ]),
          UI.el('div', { className: 'emicon-tip-card' }, [
            UI.el('h4', {}, [UI.el('i', { className: 'bi bi-envelope-check emicon-tip-icon' }), ' 更好的替代方案']),
            UI.el('p', { className: 'text-muted small mb-0' }, '重要網站建議使用聯絡表單、reCAPTCHA 或後端轉寄，比公開 Email 更安全。'),
          ]),
        ]),
      ]),
    ]);

    document.getElementById('em-addr').addEventListener('input', renderAll);
    document.getElementById('em-obf-mode').addEventListener('change', renderAll);

    renderAll();
  };

  R.textencrypt = function (app) {
    app.className = 'tool-app txenc-app';

    const passInput = UI.el('input', {
      type: 'password',
      id: 'te-pass',
      className: 'form-control txenc-pass-input',
      autocomplete: 'off',
      placeholder: '設定加密與解密用的密碼',
    });

    let passVisible = false;
    const togglePassBtn = UI.btn('顯示', 'btn btn-outline-secondary btn-sm txenc-toggle-btn', () => {
      passVisible = !passVisible;
      passInput.type = passVisible ? 'text' : 'password';
      togglePassBtn.textContent = passVisible ? '隱藏' : '顯示';
    });

    const statusEl = UI.el('p', { id: 'te-status', className: 'txenc-status text-muted small mb-0' }, '');

    function setStatus(msg, type) {
      statusEl.textContent = msg;
      statusEl.className = `txenc-status small mb-0${type ? ` txenc-status--${type}` : ''}`;
    }

    function doEncrypt() {
          const pass = getVal('te-pass');
      const plain = getVal('te-plain');
      if (!pass) { UI.alert('請輸入加密密碼', 'warning'); return; }
      if (!plain) { UI.alert('請輸入要加密的明文', 'warning'); return; }
      setVal('te-cipher', xorEncrypt(plain, pass));
      setStatus(`已加密 ${plain.length} 個字元，密文已產生。請妥善保存密碼，遺失將無法還原。`, 'success');
    }

    function doDecrypt() {
          const pass = getVal('te-pass');
      const cipher = getVal('te-cipher').trim();
      if (!pass) { UI.alert('請輸入加密密碼', 'warning'); return; }
      if (!cipher) { UI.alert('請貼上要解密的密文', 'warning'); return; }
          try {
        const plain = xorDecrypt(cipher, pass);
        setVal('te-plain', plain);
        setStatus(`解密成功，還原 ${plain.length} 個字元。`, 'success');
          } catch {
        setStatus('解密失敗：密碼錯誤或密文格式不正確。', 'danger');
        UI.alert('解密失敗，請確認密碼與 Base64 密文是否正確', 'danger');
      }
    }

    function doClear() {
      setVal('te-pass', '');
      setVal('te-plain', '');
      setVal('te-cipher', '');
      passInput.type = 'password';
      passVisible = false;
      togglePassBtn.textContent = '顯示';
      setStatus('');
    }

    mount(app, [
      UI.el('div', { className: 'txenc-intro tool-panel-card' }, [
        UI.el('p', { className: 'txenc-lead mb-2' }, '文字加密可將可讀內容轉成難以直接閱讀的密文，只有知道密碼的人才能還原。本工具使用「密碼 XOR 混淆 + Base64 編碼」，在瀏覽器本地完成，適合臨時遮掩訊息、朋友間傳遞短文字。'),
        UI.el('p', { className: 'text-muted small mb-0' }, '用途：① 將備忘文字加密後存檔或傳送　② 理解對稱加密的基本概念　③ 快速做輕量級文字混淆。請勿用於銀行、證件、商業機密等需要真正密碼學保護的資料。'),
      ]),
      UI.el('div', { className: 'txenc-warning tool-panel-card', role: 'note' }, [
        UI.el('p', { className: 'txenc-warning-title mb-2' }, [
          UI.el('i', { className: 'bi bi-exclamation-triangle-fill' }),
          ' 安全提醒',
        ]),
        UI.el('p', { className: 'text-muted small mb-0' }, '此為教學／示範級加密，並非 AES 等工業標準。具備技術能力者仍可能破解。處理真正敏感資料請使用 Bitwarden Send、GPG、或作業系統內建加密工具。'),
      ]),
      UI.panel('加密密碼', [
        UI.el('div', { className: 'tool-field mb-0' }, [
          UI.el('label', { className: 'tool-label', for: 'te-pass' }, '密碼（金鑰）'),
          UI.el('div', { className: 'txenc-pass-wrap' }, [passInput, togglePassBtn]),
          UI.el('p', { className: 'tool-hint text-muted small mb-0' }, '加密與解密必須使用相同密碼。密碼越長、越隨機，越難被猜中。Kawatool 不會儲存或上傳你的密碼與文字。'),
        ]),
      ]),
      UI.panel('加密／解密', [
        UI.el('div', { className: 'txenc-cols' }, [
          UI.el('div', { className: 'txenc-col' }, [
            UI.el('label', { className: 'tool-label', for: 'te-plain' }, '明文（原始文字）'),
            UI.textarea('', 'te-plain', '輸入要加密的文字…', 6),
            UI.el('div', { className: 'txenc-col-actions' }, [
              UI.copyBtn(() => getVal('te-plain')),
            ]),
          ]),
          UI.el('div', { className: 'txenc-col' }, [
            UI.el('label', { className: 'tool-label', for: 'te-cipher' }, '密文（Base64）'),
            UI.textarea('', 'te-cipher', '加密結果或貼上待解密密文…', 6),
            UI.el('div', { className: 'txenc-col-actions' }, [
              UI.copyBtn(() => getVal('te-cipher')),
            ]),
          ]),
        ]),
        UI.btnGroup([
          UI.btn('加密 →', 'btn btn-primary tool-btn', doEncrypt),
          UI.btn('← 解密', 'btn btn-outline-primary tool-btn', doDecrypt),
          UI.btn('清除全部', 'btn btn-outline-secondary tool-btn', doClear),
        ]),
        statusEl,
      ]),
      UI.panel('運作原理', [
        UI.el('ol', { className: 'txenc-flow tool-checklist text-muted' }, [
          UI.el('li', {}, '你輸入明文與密碼。'),
          UI.el('li', {}, '程式以密碼字元對明文逐字做 XOR（位元互斥或）運算，產生不可讀的二進位結果。'),
          UI.el('li', {}, '再將結果以 Base64 編碼，得到可複製貼上的 ASCII 密文字串。'),
          UI.el('li', {}, '解密時以相同密碼反向 XOR，即可還原明文。'),
        ]),
        UI.el('p', { className: 'tool-hint text-muted small mb-0' }, 'XOR 是對稱加密：加密與解密使用同一把「密碼」金鑰。這與 HTTPS 使用的非對稱加密（公鑰／私鑰）不同，但足以說明「有金鑰才能還原」的概念。'),
      ]),
      UI.panel('用途與限制', [
        UI.el('div', { className: 'txenc-tip-grid' }, [
          UI.el('div', { className: 'txenc-tip-card' }, [
            UI.el('h4', {}, [UI.el('i', { className: 'bi bi-check-circle txenc-tip-icon' }), ' 適合用途']),
            UI.el('p', { className: 'text-muted small mb-0' }, '朋友間傳短訊、論壇 spoiler 遮掩、個人備忘錄簡易加鎖、學習加密流程。'),
          ]),
          UI.el('div', { className: 'txenc-tip-card' }, [
            UI.el('h4', {}, [UI.el('i', { className: 'bi bi-x-circle txenc-tip-icon' }), ' 不適合用途']),
            UI.el('p', { className: 'text-muted small mb-0' }, '金融資料、身分證字號、合約、商業機密、任何需長期保密或合規要求的內容。'),
          ]),
          UI.el('div', { className: 'txenc-tip-card' }, [
            UI.el('h4', {}, [UI.el('i', { className: 'bi bi-incognito txenc-tip-icon' }), ' 本地運算']),
            UI.el('p', { className: 'text-muted small mb-0' }, '加解密全在瀏覽器完成，文字不會送到 Kawatool 伺服器。關閉分頁後內容即消失。'),
          ]),
          UI.el('div', { className: 'txenc-tip-card' }, [
            UI.el('h4', {}, [UI.el('i', { className: 'bi bi-shield-lock txenc-tip-icon' }), ' 更安全的選擇']),
            UI.el('p', { className: 'text-muted small mb-0' }, '真正機密請用 AES-256（如 7-Zip 加密、VeraCrypt）或端到端加密通訊（Signal、GPG）。'),
          ]),
        ]),
      ]),
    ]);

    const cipherEl = document.getElementById('te-cipher');
    if (cipherEl) cipherEl.classList.add('txenc-code');
  };

  R.longurl = function (app) {
    app.className = 'tool-app longurl-app';

    const SHORTENERS = [
      { name: 'bit.ly', region: '國際', note: 'Bitly，社群行銷常用' },
      { name: 't.co', region: '國際', note: 'X（Twitter）自動縮址' },
      { name: 'goo.gl', region: '國際', note: 'Google 舊服務，連結仍可能有效' },
      { name: 'is.gd', region: '國際', note: '免註冊、介面簡潔' },
      { name: 'tinyurl.com', region: '國際', note: '歷史悠久的縮址服務' },
      { name: 'adf.ly', region: '國際', note: '部分連結含廣告跳轉' },
      { name: 't.cn', region: '中國', note: '微博等平台常用' },
      { name: 'dwz.cn', region: '中國', note: '百度系短網址' },
      { name: '0rz.tw', region: '台灣', note: 'PTT、論壇常見' },
      { name: '4fun.tw', region: '台灣', note: '台灣本地縮址' },
      { name: 'qita.in', region: '其他', note: '多種變體域名' },
    ];

    const EXAMPLES = [
      {
        short: 'https://bit.ly/3example',
        long: 'https://www.example.com/articles/how-url-shorteners-work?utm_source=bitly',
        note: 'bit.ly 典型格式',
      },
      {
        short: 'https://t.co/Ab1Cd2Ef3',
        long: 'https://x.com/username/status/1234567890123456789',
        note: 'X（Twitter）貼文連結',
      },
      {
        short: 'https://is.gd/xyz99',
        long: 'https://docs.example.org/guide/installation#step-3',
        note: 'is.gd 短碼',
      },
      {
        short: 'https://0rz.tw/abc12',
        long: 'https://example.tw/news/2024/local-story-title-here',
        note: '台灣論壇常見 0rz.tw',
      },
    ];

    const resultUrl = UI.el('a', {
      id: 'lu-result-url',
      className: 'longurl-result-link longurl-result-link--empty',
      href: '#',
      target: '_blank',
      rel: 'noopener noreferrer',
    }, '—');
    const resultMeta = UI.el('p', { id: 'lu-result-meta', className: 'longurl-result-meta text-muted small mb-0' }, '貼上短網址後按「解析還原」');
    const out = UI.output('lu-out');
    out.classList.add('longurl-output');

    let lastResolved = '';

    function setInput(url) {
      setVal('lu-in', url);
      document.getElementById('lu-in')?.focus();
    }

    function showResult({ ok, finalUrl, status, redirected, message, tips }) {
      lastResolved = finalUrl || '';
      if (ok && finalUrl) {
        resultUrl.textContent = finalUrl;
        resultUrl.href = finalUrl;
        resultUrl.classList.remove('longurl-result-link--empty');
        resultMeta.textContent = `HTTP ${status}${redirected ? ' · 已跟隨重新導向' : ''}`;
        out.textContent = message || `最終 URL：${finalUrl}\n狀態碼：${status}`;
      } else {
        resultUrl.textContent = '—';
        resultUrl.href = '#';
        resultUrl.classList.add('longurl-result-link--empty');
        resultMeta.textContent = '無法直接解析';
        out.textContent = [message || '解析失敗', '', ...(tips || [])].join('\n');
      }
    }

    async function doResolve() {
      const raw = getVal('lu-in').trim();
      if (!raw) {
        UI.alert('請貼上短網址', 'warning');
        return;
      }
      let url = raw;
      if (!/^https?:\/\//i.test(url)) url = 'https://' + url;

      showResult({ ok: false, message: '解析中…', tips: [] });
      resultMeta.textContent = '正在跟隨重新導向…';
      out.textContent = '解析中，請稍候…';

      const attempts = [
        () => fetch(url, { method: 'HEAD', redirect: 'follow', mode: 'cors' }),
        () => fetch(url, { method: 'GET', redirect: 'follow', mode: 'cors' }),
      ];

      for (const tryFetch of attempts) {
        try {
          const res = await tryFetch();
          const finalUrl = res.url || url;
          const changed = finalUrl.replace(/\/$/, '') !== url.replace(/\/$/, '');
          showResult({
            ok: true,
            finalUrl,
            status: res.status,
            redirected: res.redirected || changed,
            message:
              `✅ 解析成功\n\n` +
              `輸入：${url}\n` +
              `最終 URL：${finalUrl}\n` +
              `HTTP 狀態：${res.status}\n` +
              (res.redirected || changed ? '已跟隨伺服器重新導向（redirect）。\n' : '未偵測到跳轉，可能已是完整網址。\n') +
              `\n⚠️ 開啟前請確認網域是否可信，避免釣魚連結。`,
          });
          return;
        } catch {
          /* try next method */
        }
      }

      showResult({
        ok: false,
        message: '無法在瀏覽器內直接解析（CORS 跨域限制）。',
        tips: [
          '替代方法：',
          `1. 直接在瀏覽器開啟：${url}，查看網址列跳轉後的完整 URL`,
          `2. 終端機執行：curl -I -L "${url}"`,
          '3. 使用可信任的重定向檢查服務（如 VirusTotal URL scanner）',
          '4. 若為 Email／訊息中的連結，先確認寄件者身份再點擊',
        ],
      });
    }

    mount(app, [
      UI.el('div', { className: 'longurl-intro tool-panel-card' }, [
        UI.el('p', { className: 'longurl-lead mb-2' }, '短網址服務將冗長的 URL 壓成易讀、易分享的短連結。你可以用本工具在點擊前先「還原」真實目的地，讓隱藏的長網址無所遁形——尤其適合檢查來路不明的連結是否指向釣魚站、廣告頁或不相關的網域。'),
        UI.el('p', { className: 'text-muted small mb-0' }, '用途：① 查看短連結背後的真實網址　② 確認跳轉是否符合預期　③ 在分享或收信時做基本安全檢查。全球有 bit.ly、t.co、is.gd、0rz.tw、t.cn、dwz.cn 等數百種服務，原理皆為 HTTP 重新導向。'),
      ]),
      UI.panel('解析短網址', [
        UI.input('短網址', 'lu-in', 'url', 'https://bit.ly/example'),
        UI.el('p', { className: 'tool-hint text-muted small mb-2' }, '支援 http:// 或 https:// 開頭；若省略協定會自動補上 https://。'),
        UI.el('div', { className: 'longurl-example-chips' }, [
          UI.el('span', { className: 'longurl-chips-label text-muted small' }, '快速填入範例：'),
          ...EXAMPLES.map((ex) =>
            UI.btn(ex.note, 'btn btn-sm btn-outline-secondary longurl-chip', () => setInput(ex.short))
          ),
        ]),
        UI.btnGroup([
          UI.btn('解析還原', 'btn btn-primary tool-btn', doResolve),
          UI.copyBtn(() => lastResolved || getVal('lu-in')),
        ]),
      ]),
      UI.panel('解析結果', [
        UI.el('div', { className: 'longurl-result-box' }, [
          UI.el('span', { className: 'longurl-result-label text-muted small' }, '真實連結'),
          resultUrl,
          resultMeta,
        ]),
        out,
      ]),
      UI.panel('短網址 vs 長網址（範例）', [
        UI.el('p', { className: 'text-muted small mb-3' }, '以下為格式示意，實際短碼與目的地依各服務而異。點「填入」可將短網址帶入上方輸入框試用。'),
        UI.el('div', { className: 'longurl-example-list' },
          EXAMPLES.map((ex) =>
            UI.el('div', { className: 'longurl-example-item' }, [
              UI.el('div', { className: 'longurl-example-row' }, [
                UI.el('span', { className: 'longurl-example-tag' }, '短'),
                UI.el('code', { className: 'longurl-example-code' }, ex.short),
              ]),
              UI.el('div', { className: 'longurl-example-row' }, [
                UI.el('span', { className: 'longurl-example-tag longurl-example-tag--long' }, '長'),
                UI.el('code', { className: 'longurl-example-code' }, ex.long),
              ]),
              UI.el('div', { className: 'longurl-example-foot' }, [
                UI.el('span', { className: 'text-muted small' }, ex.note),
                UI.btn('填入', 'btn btn-sm btn-outline-primary longurl-fill-btn', () => setInput(ex.short)),
              ]),
            ])
          )
        ),
      ]),
      UI.panel('常見短網址服務', [
        UI.el('p', { className: 'text-muted small mb-3' }, '網路上有數百種縮址服務，以下列舉部分常見平台（含已停更但舊連結仍可能存在者）：'),
        UI.el('div', { className: 'longurl-service-table-wrap' },
          UI.el('table', { className: 'table table-hover longurl-service-table' }, [
            UI.el('thead', {}, UI.el('tr', {}, [
              UI.el('th', {}, '服務'),
              UI.el('th', {}, '地區'),
              UI.el('th', {}, '說明'),
            ])),
            UI.el('tbody', {},
              SHORTENERS.map((s) =>
                UI.el('tr', {}, [
                  UI.el('td', {}, UI.el('code', {}, s.name)),
                  UI.el('td', {}, s.region),
                  UI.el('td', { className: 'text-muted' }, s.note),
                ])
              )
            ),
          ])
        ),
      ]),
      UI.panel('使用提醒', [
        UI.el('div', { className: 'longurl-tip-grid' }, [
          UI.el('div', { className: 'longurl-tip-card' }, [
            UI.el('h4', {}, [UI.el('i', { className: 'bi bi-shield-exclamation longurl-tip-icon' }), ' 釣魚風險']),
            UI.el('p', { className: 'text-muted small mb-0' }, '短網址可隱藏真實目的地。還原後請核對網域（如 google.com 而非 goog1e.com）。'),
          ]),
          UI.el('div', { className: 'longurl-tip-card' }, [
            UI.el('h4', {}, [UI.el('i', { className: 'bi bi-arrow-repeat longurl-tip-icon' }), ' 重新導向']),
            UI.el('p', { className: 'text-muted small mb-0' }, '部分服務會多次跳轉（短址 → 追蹤 → 最終頁）。本工具跟隨瀏覽器可存取的 redirect 鏈。'),
          ]),
          UI.el('div', { className: 'longurl-tip-card' }, [
            UI.el('h4', {}, [UI.el('i', { className: 'bi bi-globe longurl-tip-icon' }), ' CORS 限制']),
            UI.el('p', { className: 'text-muted small mb-0' }, '若解析失敗，代表該服務不允許跨域查詢。請改用手動開啟或 curl -I -L 指令。'),
          ]),
          UI.el('div', { className: 'longurl-tip-card' }, [
            UI.el('h4', {}, [UI.el('i', { className: 'bi bi-link-45deg longurl-tip-icon' }), ' 合法用途']),
            UI.el('p', { className: 'text-muted small mb-0' }, '短網址也常用於 QR Code、簡訊、社群貼文字數限制，本身並非惡意技術。'),
          ]),
        ]),
      ]),
    ]);

    document.getElementById('lu-in')?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') doResolve();
    });
  };

  function ucrRegStr(str) {
    return str.replace(/\s|　|\n|\r|\t|\v/g, '');
  }

  function ucrStr2asc(chr) {
    return chr.charCodeAt(0).toString(16).toUpperCase();
  }

  function ucrAsc2str(code) {
    return String.fromCharCode(code);
  }

  function ucrUrlEncodeAsp(str) {
    let ret = '';
    const strSpecial = "!\"#$%&'.()*+,/:;<=>?[]^`{|}~%";
    for (let i = 0; i < str.length; i++) {
      const chr = str.charAt(i);
      const c = ucrStr2asc(chr);
      if (parseInt('0x' + c, 16) > 0x7f) {
        ret += '%' + c.slice(0, 2) + '%' + c.slice(-2);
      } else if (chr === ' ') {
        ret += '+';
      } else if (strSpecial.indexOf(chr) !== -1) {
        ret += '%' + c.toString(16);
      } else {
        ret += chr;
      }
    }
    return ret;
  }

  function ucrUrlDecodeAsp(str) {
    let s = str;
    const rr = s.match(/%u[0-9a-f]{4}/gi);
    if (rr) {
      for (let j = 0; j < rr.length; j++) {
        s = s.replace(rr[j], unescape(rr[j]));
      }
    }
    let ret = '';
    for (let i = 0; i < s.length; i++) {
      const chr = s.charAt(i);
      if (chr === '+') {
        ret += ' ';
      } else if (chr === '%') {
        const asc = s.substring(i + 1, i + 3);
        if (parseInt('0x' + asc, 16) > 0x7f) {
          ret += ucrAsc2str(parseInt('0x' + asc + s.substring(i + 4, i + 6), 16));
          i += 5;
        } else {
          ret += ucrAsc2str(parseInt('0x' + asc, 16));
          i += 2;
        }
      } else {
        ret += chr;
      }
    }
    return ret;
  }

  function ucrCheckUrl(url) {
    const reg = /^\b(((https?|ftp):\/\/)?[-a-z0-9]+(\.[-a-z0-9]+)*\.(?:com|edu|gov|int|mil|net|org|biz|info|name|museum|coop|asia|aero|[a-z][a-z]|((25[0-5])|(2[0-4]\d)|(1\d\d)|([1-9]\d)|\d))\b(\/[-a-z0-9_:\@&?=+,.!\/~%\$\W]*)?)$/i;
    return reg.test(url) && !/%/.test(url);
  }

  function ucrEncodeUrl(raw) {
    let u = ucrRegStr(raw);
    const w = u;
    let r = u;
    const v = u;
    if (!u) return { ok: false, error: '請輸入網址' };
    if (!ucrCheckUrl(u)) {
      return { ok: false, error: '需要加密的網址格式不正確（不可已含 % 編碼，且需為有效域名格式）' };
    }

    const reg1 = /^(https?|ftp):\/\//i;
    const reg2 = /[\/=\?&]|[\u4e00-\u9fa5]/;
    const reg3 = /[\u4e00-\u9fa5]/g;

    const v1 = u.replace(reg1, '');
    let v2 = v1 + '/';
    v2 = v2.substring(0, v2.indexOf('/'));
    let v3 = '';
    for (let k = 0; k < v2.length; k++) {
      v3 += '%' + v2.charCodeAt(k).toString(16);
    }
    u = u.replace(v2, v3);
    const m = u.match(reg3);
    if (m) {
      for (let n = 0; n < m.length; n++) {
        u = u.replace(m[n], escape(m[n]));
        r = r.replace(m[n], escape(m[n]));
      }
    }
    const hex2 = u;

    let o = '';
    const t = v1.split('');
    for (let i = 0; i < t.length; i++) {
      o += (!reg2.test(t[i])) ? '%' + v1.charCodeAt(i).toString(16) : t[i];
    }
    if (reg3.test(o)) {
      const l = o.match(reg3);
      for (let j = 0; j < l.length; j++) {
        o = o.replace(l[j], ucrUrlEncodeAsp(l[j]));
      }
    }
    const hex1 = reg1.test(v) ? v.replace(v1, o) : 'http://' + o;

    return {
      ok: true,
      results: [
        { key: 'hex1', label: 'URL 16進制加密 (1)', badge: 'visit', value: hex1 },
        { key: 'hex2', label: 'URL 16進制加密 (2)', badge: 'visit', value: hex2 },
        { key: 'encodeURI', label: 'Js encodeURI 加密', badge: 'visit', value: encodeURI(w) },
        { key: 'encodeURIComponent', label: 'Js encodeURIComponent 加密', badge: 'param', value: encodeURIComponent(w) },
        { key: 'escape1', label: 'Js escape 加密 (1)', badge: 'param', value: escape(w) },
        { key: 'escape2', label: 'Js escape 加密 (2)', badge: 'visit', value: r },
        { key: 'aspEncode', label: 'Asp URLEncode 加密', badge: 'param', value: ucrUrlEncodeAsp(w) },
      ],
    };
  }

  function ucrDecodeUrl(raw) {
    const w = ucrRegStr(raw);
    if (!w) return { ok: false, error: '請輸入要解密的網址或密文' };

    const safe = (fn, fallback) => {
      try { return fn(w); } catch { return fallback; }
    };

    const asp = safe(() => ucrUrlDecodeAsp(w), '（解密失敗）');

    return {
      ok: true,
      results: [
        { key: 'hexDec1', label: 'URL 16進制解密 (1)', badge: 'decode', value: asp },
        { key: 'hexDec2', label: 'URL 16進制解密 (2)', badge: 'decode', value: asp },
        { key: 'decodeURI', label: 'Js decodeURI 解密', badge: 'decode', value: safe(() => decodeURI(w), '（解密失敗）') },
        { key: 'decodeURIComponent', label: 'Js decodeURIComponent 解密', badge: 'decode', value: safe(() => decodeURIComponent(w), '（解密失敗）') },
        { key: 'unescape1', label: 'Js unescape 解密 (1)', badge: 'decode', value: safe(() => unescape(w), '（解密失敗）') },
        { key: 'unescape2', label: 'Js unescape 解密 (2)', badge: 'decode', value: safe(() => unescape(w), '（解密失敗）') },
        { key: 'aspDecode', label: 'Asp URLDecode 解密', badge: 'decode', value: asp },
      ],
    };
  }

  R['url-crypto'] = function (app) {
    app.className = 'tool-app ucr-app';

    let mode = 'enc';
    const encPanel = UI.el('div', { id: 'ucr-enc-panel', className: 'ucr-results' });
    const decPanel = UI.el('div', { id: 'ucr-dec-panel', className: 'ucr-results', style: { display: 'none' } });
    const statusEl = UI.el('p', { id: 'ucr-status', className: 'ucr-status text-muted small mb-0' }, '');

    const badgeText = {
      visit: '可直接訪問',
      param: '僅作參數傳遞',
      decode: '解密結果',
    };

    function makeResultRow(item) {
      const ta = UI.el('textarea', {
        className: 'form-control ucr-result-code',
        rows: 2,
        readOnly: true,
        id: `ucr-out-${item.key}`,
      }, item.value || '');
      return UI.el('div', { className: 'ucr-result-item' }, [
        UI.el('div', { className: 'ucr-result-head' }, [
          UI.el('strong', { className: 'ucr-result-title' }, item.label),
          UI.el('span', { className: `ucr-badge ucr-badge--${item.badge}` }, badgeText[item.badge] || ''),
          UI.copyBtn(() => ta.value),
        ]),
        ta,
      ]);
    }

    function renderResults(panel, results) {
      panel.replaceChildren(...results.map(makeResultRow));
    }

    function setMode(next) {
      mode = next;
      encPanel.style.display = mode === 'enc' ? '' : 'none';
      decPanel.style.display = mode === 'dec' ? '' : 'none';
      app.querySelectorAll('.ucr-mode-btn').forEach((btn) => {
        btn.classList.toggle('active', btn.dataset.mode === mode);
      });
      statusEl.textContent = mode === 'enc'
        ? '輸入完整網址後按「網址加密」，將產生多種編碼結果。'
        : '貼上已加密網址後按「連結解密」，將嘗試多種解碼方式。';
    }

    function doEncrypt() {
      const res = ucrEncodeUrl(getVal('ucr-in'));
      if (!res.ok) {
        statusEl.textContent = res.error;
        statusEl.className = 'ucr-status ucr-status--danger small mb-0';
        encPanel.replaceChildren();
        return;
      }
      renderResults(encPanel, res.results);
      statusEl.textContent = `已產生 ${res.results.length} 種加密結果。標示「可直接訪問」者可在瀏覽器網址列開啟。`;
      statusEl.className = 'ucr-status ucr-status--success small mb-0';
      setMode('enc');
    }

    function doDecrypt() {
      const res = ucrDecodeUrl(getVal('ucr-in'));
      if (!res.ok) {
        statusEl.textContent = res.error;
        statusEl.className = 'ucr-status ucr-status--danger small mb-0';
        decPanel.replaceChildren();
        return;
      }
      renderResults(decPanel, res.results);
      statusEl.textContent = `已嘗試 ${res.results.length} 種解密方式，請比對最合理的還原結果。`;
      statusEl.className = 'ucr-status ucr-status--success small mb-0';
      setMode('dec');
    }

    const encModeBtn = UI.btn('網址加密 ►', 'btn btn-primary tool-btn ucr-mode-btn active', doEncrypt);
    encModeBtn.dataset.mode = 'enc';
    const decModeBtn = UI.btn('連結解密 ▲', 'btn btn-outline-primary tool-btn ucr-mode-btn', doDecrypt);
    decModeBtn.dataset.mode = 'dec';

    mount(app, [
      UI.el('div', { className: 'ucr-intro tool-panel-card' }, [
        UI.el('p', { className: 'ucr-lead mb-2' }, '網址加密（又稱 URL 加密／連結加密）可將完整連結轉成難以一眼辨識的格式，方便隱藏發佈、私下分享，或降低 URL 在頁面原始碼中直接曝光。加密後的連結通常仍可在瀏覽器網址列開啟，也可放入 HTML 的 <a> 或 <img> 標籤供訪客點擊。'),
        UI.el('p', { className: 'text-muted small mb-0' }, '本工具演算法參考 ifreesite 網址加密工具，提供 URL 16 進制加密、JavaScript encodeURI／encodeURIComponent、escape，以及 ASP 風格 URLEncode／URLDecode。此為混淆而非真正資安加密，請勿用於機敏資料。'),
      ]),
      UI.panel('輸入網址', [
        UI.el('div', { className: 'tool-field mb-0' }, [
          UI.el('label', { className: 'tool-label', for: 'ucr-in' }, '請輸入加密／解密的網址（連結／URL）'),
          UI.el('textarea', {
            id: 'ucr-in',
            className: 'form-control tool-textarea ucr-input',
            rows: 6,
            placeholder: 'https://www.example.com/path/to/page?name=值',
          }),
        ]),
        UI.el('p', { className: 'tool-hint text-muted small mb-3' }, '加密時請輸入未編碼的完整 URL（不可含 %）。解密時請貼上已加密的字串。'),
        UI.btnGroup([encModeBtn, decModeBtn]),
        statusEl,
      ]),
      UI.panel('加密結果', encPanel),
      UI.panel('解密結果', decPanel),
      UI.panel('加密方式說明', [
        UI.el('div', { className: 'ucr-tip-grid' }, [
          UI.el('div', { className: 'ucr-tip-card' }, [
            UI.el('h4', {}, [UI.el('i', { className: 'bi bi-123 ucr-tip-icon' }), ' URL 16 進制 (1)(2)']),
            UI.el('p', { className: 'text-muted small mb-0' }, '將域名或字元轉為 %xx 十六進制。兩種演算法對中文與路徑處理略有不同，皆可嘗試在網址列開啟。'),
          ]),
          UI.el('div', { className: 'ucr-tip-card' }, [
            UI.el('h4', {}, [UI.el('i', { className: 'bi bi-link-45deg ucr-tip-icon' }), ' encodeURI / decodeURI']),
            UI.el('p', { className: 'text-muted small mb-0' }, '保留 : / ? # 等 URL 結構字元，適合加密整條網址；decodeURI 為其反向操作。'),
          ]),
          UI.el('div', { className: 'ucr-tip-card' }, [
            UI.el('h4', {}, [UI.el('i', { className: 'bi bi-braces ucr-tip-icon' }), ' encodeURIComponent']),
            UI.el('p', { className: 'text-muted small mb-0' }, '編碼更多保留字元，適合放在 ?key= 後的查詢參數值，不建議直接當完整網址列使用。'),
          ]),
          UI.el('div', { className: 'ucr-tip-card' }, [
            UI.el('h4', {}, [UI.el('i', { className: 'bi bi-code-slash ucr-tip-icon' }), ' escape / unescape']),
            UI.el('p', { className: 'text-muted small mb-0' }, '舊版 JavaScript 跳脫函式，部分論壇或舊系統仍見；unescape 可嘗試還原此格式。'),
          ]),
        ]),
      ]),
      UI.panel('範例', [
        UI.el('div', { className: 'ucr-example-list' }, [
          UI.el('div', { className: 'ucr-example-item' }, [
            UI.el('span', { className: 'ucr-example-label' }, '原始'),
            UI.el('code', { className: 'ucr-example-code' }, 'https://www.example.com/news?id=123'),
            UI.btn('填入', 'btn btn-sm btn-outline-primary ucr-fill-btn', () => setVal('ucr-in', 'https://www.example.com/news?id=123')),
          ]),
          UI.el('div', { className: 'ucr-example-item' }, [
            UI.el('span', { className: 'ucr-example-label' }, '16進制(1) 示意'),
            UI.el('code', { className: 'ucr-example-code' }, 'http://%77%77%77.%65%78%61%6d%70%6c%65.%63%6f%6d/news?id=123'),
            UI.el('span', { className: 'text-muted small' }, '域名逐字 %xx，路徑保留 / ? ='),
          ]),
          UI.el('div', { className: 'ucr-example-item' }, [
            UI.el('span', { className: 'ucr-example-label' }, 'encodeURIComponent 示意'),
            UI.el('code', { className: 'ucr-example-code' }, 'https%3A%2F%2Fwww.example.com%2Fnews%3Fid%3D123'),
            UI.el('span', { className: 'text-muted small' }, '整條 URL 編碼，適合作為參數值'),
          ]),
        ]),
      ]),
    ]);

    setMode('enc');
  };
})();
