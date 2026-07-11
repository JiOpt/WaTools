/**
 * WaWaTools implementations — utility & media (part 2)
 * Registers on window.WA_TOOL_REGISTRY[slug](appElement)
 */
(function () {
  'use strict';

  window.WA_TOOL_REGISTRY = window.WA_TOOL_REGISTRY || {};
  const R = window.WA_TOOL_REGISTRY;

  const U = window.WA_TOOL_UI || (function fallbackUI() {
    function el(tag, attrs, children) {
      const node = document.createElement(tag);
      if (attrs) {
        Object.entries(attrs).forEach(([k, v]) => {
          if (v == null) return;
          if (k === 'className') node.className = v;
          else if (k === 'html') node.innerHTML = v;
          else if (k.startsWith('on') && typeof v === 'function') node.addEventListener(k.slice(2).toLowerCase(), v);
          else if (typeof v === 'boolean' && v) node.setAttribute(k, '');
          else node.setAttribute(k, v);
        });
      }
      const list = children == null ? [] : Array.isArray(children) ? children : [children];
      list.forEach((c) => {
        if (c == null) return;
        node.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
      });
      return node;
    }
    function field(label, control) {
      return el('div', { className: 'tool-field' }, [label ? el('label', { className: 'tool-label' }, label) : null, control]);
    }
    return {
      el,
      panel: (title, content) => el('div', { className: 'tool-panel-card' }, [title ? el('h3', { className: 'tool-panel-title' }, title) : null, el('div', { className: 'tool-panel-body' }, content)]),
      row2: (l, r) => el('div', { className: 'tool-row2' }, [el('div', { className: 'tool-row2-col' }, l), el('div', { className: 'tool-row2-col' }, r)]),
      textarea: (label, id, ph, rows) => field(label, el('textarea', { className: 'form-control tool-textarea', id, placeholder: ph || '', rows: rows || 5 })),
      input: (label, id, type, ph) => field(label, el('input', { className: 'form-control tool-input', type: type || 'text', id, placeholder: ph || '' })),
      select: (label, id, options) => field(label, el('select', { className: 'form-select tool-select', id }, (options || []).map((o) => el('option', { value: o.value ?? o }, o.label ?? o)))),
      btn: (text, cls, onClick) => { const b = el('button', { type: 'button', className: cls || 'btn btn-primary tool-btn' }, text); if (onClick) b.addEventListener('click', onClick); return b; },
      btnGroup: (buttons) => el('div', { className: 'tool-btn-row' }, buttons),
      output: (id) => el('pre', { className: 'tool-result', id }),
      copyBtn: (text) => {
        const get = typeof text === 'function' ? text : () => text;
        return el('button', { type: 'button', className: 'btn btn-outline-secondary btn-sm tool-copy-btn', onclick: () => navigator.clipboard?.writeText(get() || '') }, '複製');
      },
      fileInput: (accept, onFile) => {
        const input = el('input', { type: 'file', accept: accept || '', style: 'display:none' });
        const name = el('span', { className: 'tool-file-name' }, '未選擇檔案');
        input.addEventListener('change', () => { const f = input.files?.[0]; name.textContent = f?.name || '未選擇檔案'; if (f && onFile) onFile(f); });
        const pick = el('button', { type: 'button', className: 'btn btn-outline-primary tool-file-btn', onclick: () => input.click() }, '選擇檔案');
        return el('div', { className: 'tool-file-wrap' }, [pick, name, input]);
      },
      alert: (msg, type) => { const a = el('div', { className: `alert alert-${type || 'info'} tool-alert` }, msg); (document.getElementById('tool-app') || document.body).prepend(a); setTimeout(() => a.remove(), 4000); },
      randomInt: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,
      randomChoice: (arr) => arr[Math.floor(Math.random() * arr.length)],
      shuffle: (arr) => { const c = arr.slice(); for (let i = c.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [c[i], c[j]] = [c[j], c[i]]; } return c; },
    };
  })();

  function hint(text) {
    return U.el('p', { className: 'text-muted small mb-3' }, text);
  }

  function loadScript(src, globalName) {
    return new Promise((resolve, reject) => {
      if (globalName && window[globalName]) {
        resolve(window[globalName]);
        return;
      }
      const existing = document.querySelector(`script[src="${src}"]`);
      if (existing) {
        existing.addEventListener('load', () => resolve(globalName ? window[globalName] : undefined));
        existing.addEventListener('error', reject);
        if (globalName && window[globalName]) resolve(window[globalName]);
        return;
      }
      const s = document.createElement('script');
      s.src = src;
      s.async = true;
      s.onload = () => resolve(globalName ? window[globalName] : undefined);
      s.onerror = () => reject(new Error('無法載入外部腳本：' + src));
      document.head.appendChild(s);
    });
  }

  function formatBytes(n) {
    if (n < 1024) return n + ' B';
    if (n < 1024 * 1024) return (n / 1024).toFixed(1) + ' KB';
    return (n / (1024 * 1024)).toFixed(2) + ' MB';
  }

  /* ── UTILITY ── */

  const TAO_CH1 = `道可道，非常道。名可名，非常名。
無，名天地之始；有，名萬物之母。
故常無，欲以觀其妙；常有，欲以觀其徼。
此兩者，同出而異名，同謂之玄。玄之又玄，眾妙之門。`;

  const TAO_QUOTES = [
    '上善若水，水善利萬物而不爭。',
    '知人者智，自知者明。',
    '大巧若拙，大辯若訥。',
    '合抱之木，生於毫末；九層之臺，起於累土。',
    '天下莫柔弱於水，而攻堅強者莫之能勝。',
    '禍兮福之所倚，福兮禍之所伏。',
    '千里之行，始於足下。',
    '信言不美，美言不信。',
    '為學日益，為道日損。',
    '天網恢恢，疏而不失。',
    '持而盈之，不如其已。揣而銳之，不可長保。',
    '寵辱若驚，貴大患若身。',
  ];

  R.scriptures = function (app) {
    const quoteBox = U.el('blockquote', { className: 'tool-result border-start border-3 ps-3 mb-0', style: 'white-space:pre-wrap;font-size:1.05rem' }, TAO_CH1);
    app.appendChild(U.el('div', { className: 'tool-form' }, [
      hint('第一章先讀完，再亂數抽一句——有時候答案就在下一行，有時候在冰箱裡。'),
      U.panel('道德經 · 第一章', quoteBox),
      U.btnGroup([
        U.btn('隨機金句', 'btn btn-primary tool-btn', () => {
          quoteBox.textContent = U.randomChoice(TAO_QUOTES);
        }),
        U.btn('回到第一章', 'btn btn-outline-secondary tool-btn', () => {
          quoteBox.textContent = TAO_CH1;
        }),
      ]),
    ]));
  };

  R.calculatortool = function (app) {
    const tabId = 'calc-tabs-' + Math.random().toString(36).slice(2, 8);
    const calcOut = U.output('calc-result');
    const ageOut = U.output('age-result');
    const tempOut = U.output('temp-result');

    function safeEval(expr) {
      const s = expr.replace(/\s/g, '');
      if (!/^[\d+\-*/().]+$/.test(s)) throw new Error('算式只能含數字與 + - * / ( )');
      // eslint-disable-next-line no-new-func
      return Function('"use strict";return (' + s + ')')();
    }

    app.appendChild(U.el('div', { className: 'tool-form' }, [
      hint('三合一計算機：算帳、算年齡、算溫度——人生三大未解之謎。'),
      U.el('ul', { className: 'nav nav-tabs tool-tabs', role: 'tablist' }, [
        U.el('li', { className: 'nav-item' }, U.el('button', { className: 'nav-link active', 'data-bs-toggle': 'tab', 'data-bs-target': `#${tabId}-basic`, type: 'button' }, '基本計算')),
        U.el('li', { className: 'nav-item' }, U.el('button', { className: 'nav-link', 'data-bs-toggle': 'tab', 'data-bs-target': `#${tabId}-age`, type: 'button' }, '年齡計算')),
        U.el('li', { className: 'nav-item' }, U.el('button', { className: 'nav-link', 'data-bs-toggle': 'tab', 'data-bs-target': `#${tabId}-temp`, type: 'button' }, '溫度換算')),
      ]),
      U.el('div', { className: 'tab-content mt-3' }, [
        U.el('div', { className: 'tab-pane fade show active', id: `${tabId}-basic` }, [
          U.input('算式', 'calc-expr', 'text', '例如：(12+8)*3/2'),
          U.btnGroup([U.btn('計算', 'btn btn-primary tool-btn', () => {
            try {
              calcOut.textContent = String(safeEval(document.getElementById('calc-expr').value));
            } catch (e) {
              U.alert(e.message, 'danger');
            }
          })]),
          calcOut,
        ]),
        U.el('div', { className: 'tab-pane fade', id: `${tabId}-age` }, [
          U.input('生日', 'calc-birthday', 'date'),
          U.btnGroup([U.btn('算年齡', 'btn btn-primary tool-btn', () => {
            const v = document.getElementById('calc-birthday').value;
            if (!v) { U.alert('請選生日，除非你想證明自己是永恆少年。', 'warning'); return; }
            const birth = new Date(v + 'T00:00:00');
            const now = new Date();
            let years = now.getFullYear() - birth.getFullYear();
            let months = now.getMonth() - birth.getMonth();
            let days = now.getDate() - birth.getDate();
            if (days < 0) { months -= 1; days += new Date(now.getFullYear(), now.getMonth(), 0).getDate(); }
            if (months < 0) { years -= 1; months += 12; }
            const totalDays = Math.floor((now - birth) / 86400000);
            ageOut.textContent = `你已經 ${years} 歲 ${months} 個月 ${days} 天（共 ${totalDays.toLocaleString()} 天）\n再撐一下，退休還很遠。`;
          })]),
          ageOut,
        ]),
        U.el('div', { className: 'tab-pane fade', id: `${tabId}-temp` }, [
          U.row2(
            U.input('攝氏 °C', 'calc-c', 'number', '25'),
            U.input('華氏 °F', 'calc-f', 'number', '77')
          ),
          U.btnGroup([
            U.btn('°C → °F', 'btn btn-primary tool-btn', () => {
              const c = parseFloat(document.getElementById('calc-c').value);
              if (Number.isNaN(c)) { U.alert('請輸入有效數字', 'warning'); return; }
              const f = c * 9 / 5 + 32;
              document.getElementById('calc-f').value = f.toFixed(2);
              tempOut.textContent = `${c}°C = ${f.toFixed(2)}°F`;
            }),
            U.btn('°F → °C', 'btn btn-outline-primary tool-btn', () => {
              const f = parseFloat(document.getElementById('calc-f').value);
              if (Number.isNaN(f)) { U.alert('請輸入有效數字', 'warning'); return; }
              const c = (f - 32) * 5 / 9;
              document.getElementById('calc-c').value = c.toFixed(2);
              tempOut.textContent = `${f}°F = ${c.toFixed(2)}°C`;
            }),
          ]),
          tempOut,
        ]),
      ]),
    ]));
  };

  const TW_ID_LETTERS = 'ABCDEFGHJKLMNPQRSTUVWXYZ'.replace(/[IO]/g, '').split('');
  const TW_ID_MAP = { A: 10, B: 11, C: 12, D: 13, E: 14, F: 15, G: 16, H: 17, I: 34, J: 18, K: 19, L: 20, M: 21, N: 22, O: 35, P: 23, Q: 24, R: 25, S: 26, T: 27, U: 28, V: 29, W: 32, X: 30, Y: 31, Z: 33 };

  function twIdCheckDigit(prefix9) {
    const letter = prefix9[0];
    const code = TW_ID_MAP[letter];
    const digits = String(code).split('').concat(prefix9.slice(1).split('')).map(Number);
    const weights = [1, 9, 8, 7, 6, 5, 4, 3, 2, 1];
    const sum = digits.reduce((a, d, i) => a + d * weights[i], 0);
    return (10 - sum % 10) % 10;
  }

  function genTwId() {
    const letter = U.randomChoice(TW_ID_LETTERS);
    const gender = U.randomChoice([1, 2]);
    let nums = letter + gender;
    for (let i = 0; i < 7; i++) nums += U.randomInt(0, 9);
    return nums + twIdCheckDigit(nums);
  }

  function luhnCheckDigit(digitsWithoutCheck) {
    let sum = 0;
    let alt = true;
    for (let i = digitsWithoutCheck.length - 1; i >= 0; i--) {
      let n = parseInt(digitsWithoutCheck[i], 10);
      if (alt) { n *= 2; if (n > 9) n -= 9; }
      sum += n;
      alt = !alt;
    }
    return (10 - sum % 10) % 10;
  }

  function genCreditCard() {
    const brands = [
      { name: 'Visa 測試', prefix: '4', len: 16 },
      { name: 'Mastercard 測試', prefix: '5' + U.randomInt(1, 5), len: 16 },
    ];
    const brand = U.randomChoice(brands);
    let num = brand.prefix;
    while (num.length < brand.len - 1) num += U.randomInt(0, 9);
    num += luhnCheckDigit(num);
    const formatted = num.replace(/(\d{4})(?=\d)/g, '$1 ');
    return { brand: brand.name, number: formatted, raw: num };
  }

  R['id-generator'] = function (app) {
    const out = U.output('id-gen-out');
    app.appendChild(U.el('div', { className: 'tool-form' }, [
      U.el('div', { className: 'alert alert-warning tool-alert-static' }, [
        U.el('strong', {}, '⚠ 免責聲明：'),
        ' 本工具產生的身分證字號與信用卡號僅供開發測試、表單 UI 驗證使用。',
        ' 請勿用於詐欺、冒用身份或任何違法行為。生成結果不具任何法律效力。',
      ]),
      hint('測試環境神隊友，真實填它警察局。'),
      U.btnGroup([
        U.btn('產生身分證字號', 'btn btn-primary tool-btn', () => {
          out.textContent = '身分證：' + genTwId();
        }),
        U.btn('產生信用卡測試號', 'btn btn-outline-primary tool-btn', () => {
          const card = genCreditCard();
          out.textContent = `${card.brand}\n卡號：${card.number}\nLuhn 校驗：通過\n`;
        }),
        U.btn('一次產生各一組', 'btn btn-secondary tool-btn', () => {
          const card = genCreditCard();
          out.textContent = `身分證：${genTwId()}\n\n${card.brand}\n卡號：${card.number}`;
        }),
        U.copyBtn(() => out.textContent),
      ]),
      out,
    ]));
  };

  const TW_LANDLINE = [
    { area: '02', name: '臺北' },
    { area: '03', name: '桃園/新竹' },
    { area: '04', name: '臺中' },
    { area: '06', name: '臺南' },
    { area: '07', name: '高雄' },
    { area: '08', name: '屏東' },
  ];

  function genTwMobile() {
    let n = '09';
    for (let i = 0; i < 8; i++) n += U.randomInt(0, 9);
    return `${n.slice(0, 4)}-${n.slice(4, 7)}-${n.slice(7)}`;
  }

  function genTwLandline() {
    const loc = U.randomChoice(TW_LANDLINE);
    let rest = '';
    const len = loc.area === '02' ? 8 : 7;
    for (let i = 0; i < len; i++) rest += U.randomInt(0, 9);
    const formatted = loc.area === '02'
      ? `${loc.area}-${rest.slice(0, 4)}-${rest.slice(4)}`
      : `0${loc.area}-${rest.slice(0, 3)}-${rest.slice(3)}`;
    return `${formatted} (${loc.name})`;
  }

  R.phone = function (app) {
    const out = U.output('phone-out');
    app.appendChild(U.el('div', { className: 'tool-form' }, [
      hint('隨機臺灣電話——適合填表單，不適合真的打過去問「你記得我嗎」。'),
      U.btnGroup([
        U.btn('手機號碼', 'btn btn-primary tool-btn', () => { out.textContent = genTwMobile(); }),
        U.btn('市話', 'btn btn-outline-primary tool-btn', () => { out.textContent = genTwLandline(); }),
        U.btn('各來一組', 'btn btn-secondary tool-btn', () => {
          out.textContent = `手機：${genTwMobile()}\n市話：${genTwLandline()}`;
        }),
        U.copyBtn(() => out.textContent),
      ]),
      out,
    ]));
  };

  R['color-blindness'] = function (app) {
    const plates = [
      { answer: 12, options: [12, 21, 18], fg: '#2ecc71', bg: '#e74c3c' },
      { answer: 8, options: [3, 8, 6], fg: '#3498db', bg: '#f39c12' },
      { answer: 5, options: [2, 5, 9], fg: '#9b59b6', bg: '#1abc9c' },
      { answer: 74, options: [71, 74, 21], fg: '#e67e22', bg: '#27ae60' },
    ];

    let idx = 0;
    let score = 0;
    const canvas = U.el('canvas', { width: 280, height: 280, className: 'border rounded mx-auto d-block', style: 'max-width:100%' });
    const status = U.el('p', { className: 'text-center fw-semibold' }, '第 1 / 4 題');
    const optsWrap = U.el('div', { className: 'tool-btn-row justify-content-center' });

    function drawPlate(plate) {
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#fafafa';
      ctx.fillRect(0, 0, 280, 280);
      for (let i = 0; i < 900; i++) {
        const x = U.randomInt(10, 270);
        const y = U.randomInt(10, 270);
        const r = U.randomInt(4, 14);
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fillStyle = U.randomChoice([plate.bg, plate.bg + 'cc', plate.bg + '99']);
        ctx.fill();
      }
      const text = String(plate.answer);
      ctx.font = 'bold 72px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      for (let i = 0; i < 120; i++) {
        const x = 140 + U.randomInt(-55, 55);
        const y = 140 + U.randomInt(-35, 35);
        ctx.fillStyle = plate.fg;
        ctx.globalAlpha = 0.15 + Math.random() * 0.35;
        ctx.fillText(text, x + U.randomInt(-8, 8), y + U.randomInt(-8, 8));
      }
      ctx.globalAlpha = 1;
    }

    function showQuestion() {
      optsWrap.replaceChildren();
      const plate = plates[idx];
      drawPlate(plate);
      status.textContent = `第 ${idx + 1} / ${plates.length} 題 — 你看到的是？`;
      U.shuffle(plate.options).forEach((opt) => {
        optsWrap.appendChild(U.btn(String(opt), 'btn btn-outline-primary tool-btn', () => {
          if (opt === plate.answer) score += 1;
          idx += 1;
          if (idx >= plates.length) {
            status.textContent = `測驗完成：${score} / ${plates.length} 題正確`;
            optsWrap.replaceChildren(
              U.el('p', { className: 'text-muted small text-center w-100' }, score === plates.length
                ? '全對！色彩感知正常（或你螢幕剛擦過）'
                : '部分答錯可能是色覺異常，也可能是螢幕色偏——本測驗僅供娛樂參考，不能取代醫療診斷。'),
              U.btn('再測一次', 'btn btn-primary tool-btn', () => { idx = 0; score = 0; showQuestion(); })
            );
          } else {
            showQuestion();
          }
        }));
      });
    }

    app.appendChild(U.el('div', { className: 'tool-form text-center' }, [
      hint('簡化版色盲測驗——若全看錯，先擦螢幕，再懷疑基因。'),
      U.el('div', { className: 'tool-canvas-wrap mb-3' }, canvas),
      status,
      optsWrap,
    ]));
    showQuestion();
  };

  R['screen-test'] = function (app) {
    const colors = [
      { name: '黑', value: '#000000' },
      { name: '白', value: '#ffffff' },
      { name: '紅', value: '#ff0000' },
      { name: '綠', value: '#00ff00' },
      { name: '藍', value: '#0000ff' },
    ];
    let overlay = null;

    function showColor(hex) {
      if (overlay) overlay.remove();
      overlay = U.el('div', {
        style: 'position:fixed;inset:0;z-index:10000;background:' + hex + ';cursor:pointer',
        onclick: () => { overlay.remove(); overlay = null; },
        title: '點一下退出全螢幕',
      });
      document.body.appendChild(overlay);
    }

    app.appendChild(U.el('div', { className: 'tool-form' }, [
      hint('全螢幕純色測試——找壞點、找藉口換新螢幕。點色塊進入全螢幕，再點一次退出。'),
      U.btnGroup(colors.map((c) => U.btn(c.name, 'btn btn-outline-dark tool-btn', () => showColor(c.value)))),
      U.el('p', { className: 'text-muted small' }, '建議在暗室使用，鄰居會以為你在搞行為藝術。'),
    ]));
  };

  R['screen-detect'] = function (app) {
    const out = U.output('screen-detect-out');

    function refresh() {
      const lines = [
        ['User Agent', navigator.userAgent],
        ['平臺', navigator.platform || '—'],
        ['語言', navigator.language],
        ['螢幕解析度', `${screen.width} × ${screen.height}`],
        ['可用區域', `${screen.availWidth} × ${screen.availHeight}`],
        ['視窗大小', `${window.innerWidth} × ${window.innerHeight}`],
        ['Device Pixel Ratio', String(window.devicePixelRatio || 1)],
        ['色彩深度', `${screen.colorDepth} bit`],
        ['像素深度', `${screen.pixelDepth} bit`],
        ['觸控點', String(navigator.maxTouchPoints ?? 0)],
        ['線上狀態', navigator.onLine ? '在線' : '離線'],
      ];
      out.textContent = lines.map(([k, v]) => `${k}：${v}`).join('\n');
    }

    app.appendChild(U.el('div', { className: 'tool-form' }, [
      hint('瀏覽器與螢幕體檢報告——數字不會騙人，但 User Agent 會。'),
      U.btnGroup([
        U.btn('重新偵測', 'btn btn-primary tool-btn', refresh),
        U.copyBtn(() => out.textContent),
      ]),
      out,
    ]));
    refresh();
  };

  R.ip = function (app) {
    const out = U.output('ip-out');
    out.textContent = '查詢中…（若 VPN 開著，結果可能正在度假）';

    async function lookup() {
      out.textContent = '查詢中…';
      try {
        const res = await fetch('https://ipapi.co/json/');
        if (!res.ok) throw new Error('ipapi 回應異常');
        const data = await res.json();
        out.textContent = [
          `IP：${data.ip || '—'}`,
          `城市：${data.city || '—'}`,
          `地區：${data.region || '—'}`,
          `國家：${data.country_name || '—'} (${data.country || ''})`,
          `ISP：${data.org || '—'}`,
          `經緯度：${data.latitude ?? '—'}, ${data.longitude ?? '—'}`,
          `時區：${data.timezone || '—'}`,
        ].join('\n');
      } catch {
        try {
          const res = await fetch('https://api.ipify.org?format=json');
          const data = await res.json();
          out.textContent = `IP：${data.ip}\n（詳細地理資訊查詢失敗，至少知道 IP 了）`;
        } catch (e) {
          out.textContent = '查詢失敗：' + (e.message || '網路或 API 無回應');
        }
      }
    }

    app.appendChild(U.el('div', { className: 'tool-form' }, [
      hint('查 IP 位置——確認 VPN 有沒有在摸魚的最佳時刻。'),
      U.btnGroup([
        U.btn('查詢 IP', 'btn btn-primary tool-btn', lookup),
        U.copyBtn(() => out.textContent),
      ]),
      out,
    ]));
    lookup();
  };

  R.qrcode = function (app) {
    const canvas = U.el('canvas', { className: 'mx-auto d-block border rounded p-2 bg-white' });
    const status = U.el('p', { className: 'text-muted small text-center' }, '載入 QR 函式庫中…');

    app.appendChild(U.el('div', { className: 'tool-form' }, [
      hint('把文字變方塊——掃不掃得到，看相機心情。'),
      U.textarea('內容', 'qr-text', '輸入網址或文字…', 3),
      U.btnGroup([
        U.btn('產生 QR Code', 'btn btn-primary tool-btn', async () => {
          const text = document.getElementById('qr-text').value.trim();
          if (!text) { U.alert('請輸入內容', 'warning'); return; }
          try {
            await loadScript('https://cdn.jsdelivr.net/npm/qrcode@1.5.3/build/qrcode.min.js', 'QRCode');
            await window.QRCode.toCanvas(canvas, text, { width: 256, margin: 2 });
            status.textContent = '產生成功！拿手機試試看（記得開燈）。';
          } catch (e) {
            status.textContent = '產生失敗：' + e.message;
          }
        }),
      ]),
      U.el('div', { className: 'text-center my-3' }, canvas),
      status,
    ]));

    loadScript('https://cdn.jsdelivr.net/npm/qrcode@1.5.3/build/qrcode.min.js', 'QRCode')
      .then(() => { status.textContent = 'QR 函式庫已就緒。'; })
      .catch(() => { status.textContent = 'QR 函式庫載入失敗，請檢查網路。'; });
  };

  R['qrcode-scan'] = function (app) {
    const readerHost = U.el('div', { id: 'qr-reader', className: 'mb-3' });
    const manualOut = U.output('qr-manual-out');
    let scanner = null;

    async function startCamera() {
      try {
        await loadScript('https://unpkg.com/html5-qrcode@2.3.8/html5-qrcode.min.js', 'Html5Qrcode');
        const Html5Qrcode = window.Html5Qrcode;
        if (!Html5Qrcode) throw new Error('掃描函式庫未載入');
        if (scanner) await scanner.stop().catch(() => {});
        scanner = new Html5Qrcode('qr-reader');
        await scanner.start(
          { facingMode: 'environment' },
          { fps: 10, qrbox: { width: 250, height: 250 } },
          (decoded) => {
            manualOut.textContent = '掃描結果：\n' + decoded;
            U.alert('掃到了！', 'success');
          },
          () => {}
        );
      } catch (e) {
        manualOut.textContent = '相機掃描不可用：' + e.message + '\n\n請改用下方手動輸入。';
      }
    }

    app.appendChild(U.el('div', { className: 'tool-form' }, [
      hint('對準 QR Code 掃描——或手動貼上，尊嚴自己選。'),
      readerHost,
      U.btnGroup([
        U.btn('啟動相機掃描', 'btn btn-primary tool-btn', startCamera),
        U.btn('停止掃描', 'btn btn-outline-secondary tool-btn', async () => {
          if (scanner) {
            await scanner.stop().catch(() => {});
            scanner.clear();
            scanner = null;
          }
        }),
      ]),
      U.panel('手動輸入 / 解碼備援', [
        U.textarea('QR 內容', 'qr-manual-in', '貼上掃描結果或文字…', 3),
        U.btn('顯示內容', 'btn btn-outline-primary tool-btn mt-2', () => {
          manualOut.textContent = document.getElementById('qr-manual-in').value || '（空的，像還沒寫的新年願望）';
        }),
      ]),
      manualOut,
    ]));
  };

  /* ── MEDIA ── */

  const sessionFiles = [];

  R.upload = function (app) {
    const list = U.el('ul', { className: 'list-group tool-file-list' });

    function renderList() {
      list.replaceChildren();
      if (!sessionFiles.length) {
        list.appendChild(U.el('li', { className: 'list-group-item text-muted' }, '尚無檔案——這是專屬此分頁的暫存區，刷新就消失。'));
        return;
      }
      sessionFiles.forEach((item, i) => {
        list.appendChild(U.el('li', { className: 'list-group-item d-flex justify-content-between align-items-center' }, [
          U.el('span', {}, [
            U.el('strong', {}, item.name),
            ` — ${formatBytes(item.size)} (${item.type || '未知類型'})`,
          ]),
          U.btn('移除', 'btn btn-sm btn-outline-danger', () => {
            sessionFiles.splice(i, 1);
            renderList();
          }),
        ]));
      });
    }

    const fileWrap = U.fileInput('*/*', (file) => {
      const reader = new FileReader();
      reader.onload = () => {
        sessionFiles.push({
          name: file.name,
          size: file.size,
          type: file.type,
          lastModified: file.lastModified,
          dataUrl: reader.result,
        });
        renderList();
      };
      reader.readAsDataURL(file);
    });

    app.appendChild(U.el('div', { className: 'tool-form' }, [
      hint('本頁暫存上傳——不會上傳到伺服器，關掉分頁就當沒發生過。'),
      fileWrap,
      list,
    ]));
    renderList();
  };

  R.meitu = function (app) {
    const canvas = U.el('canvas', { className: 'border rounded w-100', style: 'max-height:400px' });
    let img = null;
    let source = null;

    function draw() {
      if (!source) return;
      const ctx = canvas.getContext('2d');
      canvas.width = source.width;
      canvas.height = source.height;
      ctx.filter = `brightness(${document.getElementById('meitu-bright').value}%) contrast(${document.getElementById('meitu-contrast').value}%)${document.getElementById('meitu-gray').checked ? ' grayscale(100%)' : ''}`;
      ctx.drawImage(source, 0, 0);
      ctx.filter = 'none';
    }

    app.appendChild(U.el('div', { className: 'tool-form' }, [
      hint('網頁版美圖——P 到連自己都認不出，但至少不用安裝 App。'),
      U.fileInput('image/*', (file) => {
        const reader = new FileReader();
        reader.onload = () => {
          img = new Image();
          img.onload = () => { source = img; draw(); };
          img.src = reader.result;
        };
        reader.readAsDataURL(file);
      }),
      U.el('div', { className: 'tool-field' }, [
        U.el('label', { className: 'tool-label' }, '亮度'),
        U.el('input', { type: 'range', className: 'form-range', id: 'meitu-bright', min: 50, max: 150, value: 100, oninput: draw }),
      ]),
      U.el('div', { className: 'tool-field' }, [
        U.el('label', { className: 'tool-label' }, '對比'),
        U.el('input', { type: 'range', className: 'form-range', id: 'meitu-contrast', min: 50, max: 150, value: 100, oninput: draw }),
      ]),
      U.el('div', { className: 'form-check mb-3' }, [
        U.el('input', { type: 'checkbox', className: 'form-check-input', id: 'meitu-gray', onchange: draw }),
        U.el('label', { className: 'form-check-label', for: 'meitu-gray' }, '黑白濾鏡（復古或沒睡醒）'),
      ]),
      U.el('div', { className: 'tool-canvas-wrap' }, canvas),
    ]));
  };

  R.photo = function (app) {
    const canvas = U.el('canvas', { className: 'border rounded w-100 bg-dark', style: 'max-height:400px' });
    let img = null;
    let rotation = 0;

    function render() {
      if (!img) return;
      const ctx = canvas.getContext('2d');
      const rad = (rotation % 360) * Math.PI / 180;
      const swap = rotation % 180 !== 0;
      canvas.width = swap ? img.height : img.width;
      canvas.height = swap ? img.width : img.height;
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(rad);
      ctx.drawImage(img, -img.width / 2, -img.height / 2);
      ctx.restore();
    }

    app.appendChild(U.el('div', { className: 'tool-form' }, [
      hint('簡易裁切旋轉——專業度 30%，交差夠用 100%。'),
      U.fileInput('image/*', (file) => {
        const reader = new FileReader();
        reader.onload = () => {
          img = new Image();
          img.onload = () => { rotation = 0; render(); };
          img.src = reader.result;
        };
        reader.readAsDataURL(file);
      }),
      U.btnGroup([
        U.btn('左旋 90°', 'btn btn-outline-primary tool-btn', () => { rotation -= 90; render(); }),
        U.btn('右旋 90°', 'btn btn-outline-primary tool-btn', () => { rotation += 90; render(); }),
        U.btn('下載 PNG', 'btn btn-primary tool-btn', () => {
          if (!img) { U.alert('請先上傳圖片', 'warning'); return; }
          const a = document.createElement('a');
          a.download = 'watools-photo.png';
          a.href = canvas.toDataURL('image/png');
          a.click();
        }),
      ]),
      U.el('div', { className: 'tool-canvas-wrap' }, canvas),
    ]));
  };

  R.exif = function (app) {
    const out = U.output('exif-out');
    app.appendChild(U.el('div', { className: 'tool-form' }, [
      hint('讀取基本檔案資訊——進階 EXIF GPS 不在此列，隱私鬆了一口氣。'),
      U.fileInput('image/*', (file) => {
        out.textContent = [
          `檔名：${file.name}`,
          `大小：${formatBytes(file.size)}`,
          `MIME：${file.type || '未知'}`,
          `最後修改：${new Date(file.lastModified).toLocaleString('zh-TW')}`,
          `最後修改 (ISO)：${new Date(file.lastModified).toISOString()}`,
        ].join('\n');
      }),
      out,
    ]));
  };

  R['image-coordinate'] = function (app) {
    const canvas = U.el('canvas', { className: 'border rounded w-100 cursor-crosshair', style: 'max-height:450px' });
    const coord = U.output('img-coord-out');
    coord.textContent = '上傳圖片後，滑鼠移動顯示座標';

    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = Math.round((e.clientX - rect.left) * (canvas.width / rect.width));
      const y = Math.round((e.clientY - rect.top) * (canvas.height / rect.height));
      coord.textContent = `X: ${x},  Y: ${y}`;
    });

    app.appendChild(U.el('div', { className: 'tool-form' }, [
      hint('滑鼠指哪，像素座標就到哪——設計師的 GPS。'),
      U.fileInput('image/*', (file) => {
        const reader = new FileReader();
        reader.onload = () => {
          const img = new Image();
          img.onload = () => {
            const maxW = 700;
            const scale = img.width > maxW ? maxW / img.width : 1;
            canvas.width = img.width * scale;
            canvas.height = img.height * scale;
            canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
          };
          img.src = reader.result;
        };
        reader.readAsDataURL(file);
      }),
      U.el('div', { className: 'tool-canvas-wrap' }, canvas),
      coord,
    ]));
  };

  R['music-player'] = function (app) {
    const audio = U.el('audio', { controls: true, className: 'w-100 mb-3' });
    const playlist = U.el('ul', { className: 'list-group' });
    const tracks = [];
    let current = -1;

    function playIndex(i) {
      if (i < 0 || i >= tracks.length) return;
      current = i;
      audio.src = tracks[i].url;
      audio.play().catch(() => U.alert('無法播放，檔案可能不支援', 'warning'));
      renderPlaylist();
    }

    function renderPlaylist() {
      playlist.replaceChildren();
      tracks.forEach((t, i) => {
        playlist.appendChild(U.el('li', {
          className: 'list-group-item list-group-item-action' + (i === current ? ' active' : ''),
          onclick: () => playIndex(i),
        }, t.name));
      });
    }

    audio.addEventListener('ended', () => playIndex(current + 1));

    const input = U.el('input', { type: 'file', accept: 'audio/*', multiple: true, className: 'form-control tool-file-input' });
    input.addEventListener('change', () => {
      Array.from(input.files || []).forEach((file) => {
        tracks.push({ name: file.name, url: URL.createObjectURL(file) });
      });
      renderPlaylist();
      if (current < 0 && tracks.length) playIndex(0);
    });

    app.appendChild(U.el('div', { className: 'tool-form' }, [
      hint('本地音樂播放器——版權自己扛，音量鄰居扛。'),
      U.el('div', { className: 'tool-field' }, [U.el('label', { className: 'tool-label' }, '加入音樂檔'), input]),
      audio,
      U.btnGroup([
        U.btn('上一首', 'btn btn-outline-secondary tool-btn', () => playIndex(current - 1)),
        U.btn('下一首', 'btn btn-outline-secondary tool-btn', () => playIndex(current + 1)),
      ]),
      playlist,
    ]));
  };

  R['media-player'] = function (app) {
    const video = U.el('video', { controls: true, className: 'w-100 rounded border bg-dark', style: 'max-height:480px' });
    app.appendChild(U.el('div', { className: 'tool-form' }, [
      hint('拖入影片就能播——省得找 VLC，但字幕得自己腦補。'),
      U.fileInput('video/*', (file) => {
        video.src = URL.createObjectURL(file);
        video.play().catch(() => {});
      }),
      video,
    ]));
  };

  R.drawing = function (app) {
    const canvas = U.el('canvas', { width: 640, height: 400, className: 'border rounded w-100 bg-white touch-none' });
    const ctx = canvas.getContext('2d');
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    let drawing = false;

    function pos(e) {
      const rect = canvas.getBoundingClientRect();
      const touch = e.touches?.[0];
      const cx = touch ? touch.clientX : e.clientX;
      const cy = touch ? touch.clientY : e.clientY;
      return {
        x: (cx - rect.left) * (canvas.width / rect.width),
        y: (cy - rect.top) * (canvas.height / rect.height),
      };
    }

    function start(e) {
      e.preventDefault();
      drawing = true;
      const p = pos(e);
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
    }

    function move(e) {
      if (!drawing) return;
      e.preventDefault();
      const p = pos(e);
      ctx.strokeStyle = document.getElementById('draw-color').value;
      ctx.lineWidth = document.getElementById('draw-size').value;
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
    }

    function end() { drawing = false; }

    canvas.addEventListener('mousedown', start);
    canvas.addEventListener('mousemove', move);
    canvas.addEventListener('mouseup', end);
    canvas.addEventListener('mouseleave', end);
    canvas.addEventListener('touchstart', start, { passive: false });
    canvas.addEventListener('touchmove', move, { passive: false });
    canvas.addEventListener('touchend', end);

    app.appendChild(U.el('div', { className: 'tool-form' }, [
      hint('塗鴉板——藝術天賦 optional，把滑鼠畫到報銷 mandatory。'),
      U.row2(
        U.el('div', { className: 'tool-field' }, [
          U.el('label', { className: 'tool-label' }, '顏色'),
          U.el('input', { type: 'color', className: 'form-control form-control-color', id: 'draw-color', value: '#1977cc' }),
        ]),
        U.el('div', { className: 'tool-field' }, [
          U.el('label', { className: 'tool-label' }, '筆刷大小'),
          U.el('input', { type: 'range', className: 'form-range', id: 'draw-size', min: 1, max: 40, value: 4 }),
        ])
      ),
      U.btnGroup([
        U.btn('清除畫布', 'btn btn-outline-danger tool-btn', () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }),
        U.btn('下載 PNG', 'btn btn-primary tool-btn', () => {
          const a = document.createElement('a');
          a.download = 'watools-doodle.png';
          a.href = canvas.toDataURL('image/png');
          a.click();
        }),
      ]),
      U.el('div', { className: 'tool-canvas-wrap' }, canvas),
    ]));
  };
})();
