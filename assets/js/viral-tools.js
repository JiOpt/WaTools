/**
 * Viral category tools — mount into #tool-app (WaTools shell).
 * Exports: window.WA_MOUNT_VIRAL[slug](app)
 */
(function (global) {
  'use strict';

  var VIRAL_CSS_VER = 'vr-edge-cache-1';

  function viralCssHref() {
    if (global.WA_TOOL_URLS && typeof global.WA_TOOL_URLS.absolutePageHref === 'function') {
      return global.WA_TOOL_URLS.absolutePageHref('assets/css/viral-tools.css') + '?v=' + VIRAL_CSS_VER;
    }
    var path = String(location.pathname || '').replace(/\\/g, '/');
    if (/\/viral(\/|$)/i.test(path)) {
      return '../assets/css/viral-tools.css?v=' + VIRAL_CSS_VER;
    }
    return 'assets/css/viral-tools.css?v=' + VIRAL_CSS_VER;
  }

  /** Non-blocking stylesheet: critical look lives in ensureBrightInline(). */
  function ensureViralCss() {
    var key = 'wa-viral-css';
    var href;
    try {
      href = new URL(viralCssHref(), location.href).href;
    } catch (e) {
      href = viralCssHref();
    }
    var existing = document.querySelector('link[data-wa-key="' + key + '"]');
    if (existing) {
      if (existing.getAttribute('href') !== href) existing.href = href;
      return;
    }
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.media = 'print';
    link.setAttribute('data-wa-key', key);
    link.onload = function () { link.media = 'all'; };
    document.head.appendChild(link);
    // Fallback if onload already fired / cached
    requestAnimationFrame(function () {
      if (link.sheet) link.media = 'all';
    });
  }

  function ensureBrightInline() {
    if (document.getElementById('wa-viral-inline')) return;
    var style = document.createElement('style');
    style.id = 'wa-viral-inline';
    style.textContent = [
      '.tool-app.wa-viral{color:#444;background:transparent!important;padding:0!important;border-radius:0!important}',
      '.wa-viral .vr-card{background:#fff!important;border:1px solid rgba(25,119,204,.22)!important;border-radius:12px;padding:1.15rem 1.2rem;box-shadow:0 4px 18px rgba(41,99,160,.06)}',
      '.wa-viral .vr-eyebrow{color:#1977cc!important;font-size:.72rem;letter-spacing:.14em;text-transform:uppercase;font-weight:600;margin:0 0 .35rem}',
      '.wa-viral .vr-lead,.wa-viral .vr-muted{color:#6c757d!important}',
      '.wa-viral .vr-label{color:#2c4964!important;font-weight:500}',
      '.wa-viral .vr-input,.wa-viral .vr-textarea,.wa-viral .vr-select{background:#fff!important;color:#444!important;border:1px solid rgba(25,119,204,.28)!important;border-radius:8px;padding:.6rem .85rem;width:100%}',
      '.wa-viral .vr-btn{background:#1977cc!important;color:#fff!important;border:none!important;border-radius:8px;padding:.6rem 1rem;cursor:pointer}',
      '.wa-viral .vr-btn-emerald{background:#eaf4fc!important;color:#1977cc!important;border:1px solid rgba(25,119,204,.35)!important}',
      '.wa-viral .vr-btn-rose{background:#fff5f7!important;color:#e11d48!important;border:1px solid rgba(225,29,72,.3)!important}',
      '.wa-viral .vr-drop{background:#f5f9fc!important;border:1px dashed rgba(25,119,204,.4)!important;border-radius:12px;padding:1.75rem 1rem;text-align:center;cursor:pointer;color:#2c4964!important}',
      '.wa-viral .vr-result{background:#f5f9fc!important;border:1px solid rgba(25,119,204,.22)!important;border-radius:10px;padding:.75rem .9rem}',
      '.wa-viral .vr-result-name{color:#1977cc!important}',
      '.wa-viral .vr-result-text,.wa-viral .vr-password{color:#2c4964!important}',
      '.wa-viral .vr-chip{background:#fff!important;color:#2c4964!important;border:1px solid rgba(25,119,204,.25)!important;border-radius:999px;padding:.4rem .85rem;cursor:pointer}',
      '.wa-viral .vr-chip.is-on{background:#eaf4fc!important;color:#1977cc!important;border-color:#1977cc!important;font-weight:600}',
      '.wa-viral .vr-canvas,.wa-viral .vr-preview-box{background:#f5f9fc!important;border:1px solid rgba(25,119,204,.22)!important;border-radius:12px}',
      '.wa-viral .vr-toast{color:#0d9488!important}',
      '.wa-viral #vr-md-preview{background:#f5f9fc!important;color:#444!important;border:1px solid rgba(25,119,204,.22)!important;border-radius:10px;padding:.85rem 1rem}',
      '.wa-viral #vr-md-preview a{color:#1977cc!important}'
    ].join('');
    document.head.appendChild(style);
  }

  function cleanupFns(app) {
    var list = app.__waVrCleanup || [];
    list.forEach(function (fn) {
      try { fn(); } catch (e) { /* ignore */ }
    });
    app.__waVrCleanup = [];
  }

  function onCleanup(app, fn) {
    if (!app.__waVrCleanup) app.__waVrCleanup = [];
    app.__waVrCleanup.push(fn);
  }

  function prepMount(app) {
    cleanupFns(app);
    // Local component state only — never write quiz/calc state to window.
    app.__waLocal = null;
    ensureBrightInline();
    ensureViralCss();
    app.className = 'tool-app wa-viral';
    app.replaceChildren();
    var onHide = function () {
      cleanupFns(app);
      app.__waLocal = null;
    };
    global.addEventListener('pagehide', onHide);
    onCleanup(app, function () {
      global.removeEventListener('pagehide', onHide);
      app.__waLocal = null;
    });
  }

  function wrapCanvasText(ctx, text, maxWidth) {
    var str = String(text || '');
    var lines = [];
    var line = '';
    for (var i = 0; i < str.length; i++) {
      var test = line + str.charAt(i);
      if (line && ctx.measureText(test).width > maxWidth) {
        lines.push(line);
        line = str.charAt(i);
      } else {
        line = test;
      }
    }
    if (line) lines.push(line);
    return lines;
  }

  function money(n) {
    return Math.round(n).toLocaleString('zh-TW');
  }

  function roundRect(c, x, y, w, h, r) {
    var rr = Math.min(r, w / 2, h / 2);
    c.beginPath();
    c.moveTo(x + rr, y);
    c.arcTo(x + w, y, x + w, y + h, rr);
    c.arcTo(x + w, y + h, x, y + h, rr);
    c.arcTo(x, y + h, x, y, rr);
    c.arcTo(x, y, x + w, y, rr);
    c.closePath();
  }

  function copyText(text, toastEl, okMsg) {
    return navigator.clipboard.writeText(text).then(function () {
      if (toastEl) toastEl.textContent = okMsg || '已複製到剪貼簿';
    }).catch(function () {
      if (toastEl) toastEl.textContent = '複製失敗，請手動選取';
    });
  }

  function bindRafSchedule(app, scheduleFn) {
    var raf = 0;
    function schedule() {
      if (raf) return;
      raf = requestAnimationFrame(function () {
        raf = 0;
        scheduleFn();
      });
    }
    onCleanup(app, function () {
      if (raf) cancelAnimationFrame(raf);
    });
    return schedule;
  }

  function escapeHtml(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function bindDropZone(app, dropEl, fileInput, onFile) {
    function onDragOver(e) { e.preventDefault(); dropEl.style.borderColor = '#1977cc'; }
    function onDragLeave() { dropEl.style.borderColor = ''; }
    function onDrop(e) {
      e.preventDefault();
      dropEl.style.borderColor = '';
      var f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
      if (f) onFile(f);
    }
    function onClick() { fileInput.click(); }
    function onChange() {
      if (fileInput.files && fileInput.files[0]) onFile(fileInput.files[0]);
    }
    dropEl.addEventListener('dragover', onDragOver);
    dropEl.addEventListener('dragleave', onDragLeave);
    dropEl.addEventListener('drop', onDrop);
    dropEl.addEventListener('click', onClick);
    fileInput.addEventListener('change', onChange);
    onCleanup(app, function () {
      dropEl.removeEventListener('dragover', onDragOver);
      dropEl.removeEventListener('dragleave', onDragLeave);
      dropEl.removeEventListener('drop', onDrop);
      dropEl.removeEventListener('click', onClick);
      fileInput.removeEventListener('change', onChange);
    });
  }

  function downloadCanvasPng(canvas, filename) {
    canvas.toBlob(function (blob) {
      if (!blob) return;
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      setTimeout(function () { URL.revokeObjectURL(url); }, 500);
    }, 'image/png');
  }

  function seededHash(str) {
    var h = 2166136261;
    for (var i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  function mulberry32(a) {
    return function () {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      var t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  /* ——— 1. invoice-checker ——— */
  function mountInvoiceChecker(app) {
    prepMount(app);
    var PERIODS = [
      {
        id: '11311',
        label: '113年11-12月（示範）',
        special: '12349876',
        head: ['87654321', '11223344'],
        six: ['7654321', '4433221'],
        five: ['654321', '332211'],
        four: ['54321', '22110'],
        three: ['321', '456', '789'],
        extra3: ['111', '222', '333']
      },
      {
        id: '11401',
        label: '114年1-2月（示範）',
        special: '55667788',
        head: ['88776655'],
        six: ['7766555'],
        five: ['665544'],
        four: ['55443'],
        three: ['123', '567', '890'],
        extra3: ['444', '555']
      },
      {
        id: '11403',
        label: '114年3-4月（示範）',
        special: '99887766',
        head: ['66778899', '13572468'],
        six: ['6778899'],
        five: ['778899'],
        four: ['8899'],
        three: ['246', '357', '468'],
        extra3: ['666', '777', '888']
      }
    ];

    app.innerHTML =
      '<section class="vr-card vr-stack">' +
      '  <p class="vr-eyebrow">Invoice Lottery</p>' +
      '  <p class="vr-lead">輸入發票號碼末三碼或完整八碼 · 示範資料請以財政部為準</p>' +
      '  <label class="vr-label">對獎期別' +
      '    <select id="vr-inv-period" class="vr-select"></select>' +
      '  </label>' +
      '  <label class="vr-label">發票號碼（末三碼或完整）' +
      '    <input id="vr-inv-num" class="vr-input" type="text" maxlength="8" inputmode="numeric" placeholder="例：123 或 AB12345678">' +
      '  </label>' +
      '  <button type="button" id="vr-inv-check" class="vr-btn">對獎</button>' +
      '  <div id="vr-inv-result" class="vr-stack" aria-live="polite"></div>' +
      '  <p class="vr-muted">※ 本工具僅供娛樂試用，中獎號碼請以財政部統一發票兌獎公告為準。</p>' +
      '</section>';

    var periodSel = app.querySelector('#vr-inv-period');
    PERIODS.forEach(function (p) {
      var opt = document.createElement('option');
      opt.value = p.id;
      opt.textContent = p.label;
      periodSel.appendChild(opt);
    });

    function getPeriod() {
      var id = periodSel.value;
      for (var i = 0; i < PERIODS.length; i++) {
        if (PERIODS[i].id === id) return PERIODS[i];
      }
      return PERIODS[0];
    }

    function digitsOnly(raw) {
      return String(raw || '').replace(/\D/g, '');
    }

    function check() {
      var raw = app.querySelector('#vr-inv-num').value.trim().toUpperCase();
      var digits = digitsOnly(raw);
      var resultEl = app.querySelector('#vr-inv-result');
      if (digits.length < 3) {
        resultEl.innerHTML = '<p class="vr-muted">請至少輸入末三碼數字</p>';
        return;
      }
      var num = digits.length >= 8 ? digits.slice(-8) : digits.slice(-3);
      var p = getPeriod();
      var prizes = [];

      if (digits.length >= 8) {
        if (num === p.special) prizes.push({ name: '特別獎', amount: '1,000 萬元', match: num });
        if (p.head.indexOf(num) >= 0) prizes.push({ name: '頭獎', amount: '200 萬元', match: num });
      }
      if (digits.length >= 7 || digits.length >= 8) {
        var d7 = digits.slice(-7);
        p.six.forEach(function (w) {
          if (d7 === w.slice(-7) || (digits.length >= 7 && d7 === w)) {
            prizes.push({ name: '二獎', amount: '40 萬元', match: d7 });
          }
        });
      }
      var d3 = digits.slice(-3);
      var d4 = digits.length >= 4 ? digits.slice(-4) : '';
      var d5 = digits.length >= 5 ? digits.slice(-5) : '';
      var d6 = digits.length >= 6 ? digits.slice(-6) : '';

      p.three.forEach(function (w) {
        if (d3 === w.slice(-3)) prizes.push({ name: '六獎', amount: '200 元', match: d3 });
      });
      p.extra3.forEach(function (w) {
        if (d3 === w.slice(-3)) prizes.push({ name: '增開六獎', amount: '200 元', match: d3 });
      });
      if (d4) {
        p.four.forEach(function (w) {
          if (d4 === w.slice(-4)) prizes.push({ name: '五獎', amount: '1,000 元', match: d4 });
        });
      }
      if (d5) {
        p.five.forEach(function (w) {
          if (d5 === w.slice(-5)) prizes.push({ name: '四獎', amount: '4,000 元', match: d5 });
        });
      }
      if (d6) {
        p.six.forEach(function (w) {
          if (d6 === w.slice(-6)) prizes.push({ name: '三獎', amount: '1 萬元', match: d6 });
        });
      }

      var seen = {};
      prizes = prizes.filter(function (pr) {
        var k = pr.name + pr.match;
        if (seen[k]) return false;
        seen[k] = 1;
        return true;
      });

      if (!prizes.length) {
        resultEl.innerHTML =
          '<div class="vr-result"><div><p class="vr-result-name">未中獎</p>' +
          '<p class="vr-result-text">末三碼 ' + escapeHtml(d3) + ' · ' + escapeHtml(p.label) + '</p></div></div>';
        return;
      }
      resultEl.innerHTML = prizes.map(function (pr) {
        return '<div class="vr-result"><div><p class="vr-result-name">' + escapeHtml(pr.name) +
          '</p><p class="vr-result-text">恭喜！' + escapeHtml(pr.amount) + ' · 對中 ' + escapeHtml(pr.match) + '</p></div></div>';
      }).join('');
    }

    app.querySelector('#vr-inv-check').addEventListener('click', check);
    app.querySelector('#vr-inv-num').addEventListener('keydown', function (e) {
      if (e.key === 'Enter') check();
    });
  }

  /* ——— 2. mortgage-calculator (2026 一般房貸 / 新青安) ——— */
  function mountMortgageCalculator(app) {
    prepMount(app);

    var YOUTH = [
      { untilMonth: 36, rate: 0.01775 },
      { untilMonth: 60, rate: 0.02105 },
      { untilMonth: Infinity, rate: 0.02275 }
    ];

    app.innerHTML =
      '<section class="vr-card vr-stack">' +
      '  <p class="vr-eyebrow">2026 Mortgage</p>' +
      '  <p class="vr-lead">最新房貸與新青安貸款台幣試算 · 純前端本息攤還</p>' +
      '  <div class="vr-chips" role="group" aria-label="貸款方案">' +
      '    <button type="button" class="vr-chip is-on" data-plan="general" aria-pressed="true">方案 A｜一般房貸</button>' +
      '    <button type="button" class="vr-chip" data-plan="youth" aria-pressed="false">方案 B｜新青安貸款</button>' +
      '  </div>' +
      '  <div class="vr-grid-2">' +
      '    <label class="vr-label">貸款總額（萬元）' +
      '      <input id="vr-mg-wan" class="vr-input" type="number" min="1" step="1" value="800">' +
      '    </label>' +
      '    <label class="vr-label">貸款年限' +
      '      <select id="vr-mg-years" class="vr-select">' +
      '        <option value="20">20 年</option>' +
      '        <option value="30" selected>30 年</option>' +
      '        <option value="40">40 年</option>' +
      '      </select>' +
      '    </label>' +
      '    <label class="vr-label">寬限期（年）' +
      '      <select id="vr-mg-grace" class="vr-select">' +
      '        <option value="0" selected>0 年（無寬限期）</option>' +
      '        <option value="1">1 年</option>' +
      '        <option value="2">2 年</option>' +
      '        <option value="3">3 年</option>' +
      '        <option value="4">4 年</option>' +
      '        <option value="5">5 年</option>' +
      '      </select>' +
      '    </label>' +
      '    <label class="vr-label" id="vr-mg-rate-wrap">年利率（%）' +
      '      <input id="vr-mg-rate" class="vr-input" type="number" min="0" step="0.001" value="2.2">' +
      '    </label>' +
      '  </div>' +
      '  <p id="vr-mg-plan-note" class="vr-muted"></p>' +
      '  <div id="vr-mg-cards" class="vr-pay-cards"></div>' +
      '  <div id="vr-mg-extra" class="vr-stack"></div>' +
      '  <details class="vr-details" open>' +
      '    <summary>展開前 12 個月繳款明細</summary>' +
      '    <div id="vr-mg-table-wrap"></div>' +
      '  </details>' +
      '  <p class="vr-muted">※ 試算為示意：寬限期只付利息；其後採本息平均攤還。新青安利率依「貸款起算月數」分段（前 3 年 1.775%、第 4–5 年 2.105%、第 6 年起 2.275%），利率變動時會重算月付。實際核貸條件與銀行公告為準。</p>' +
      '</section>';

    var plan = 'general';

    function annualRateForMonth(monthIndex1Based) {
      if (plan === 'general') {
        return Math.max(0, Number(app.querySelector('#vr-mg-rate').value) || 0) / 100;
      }
      for (var i = 0; i < YOUTH.length; i++) {
        if (monthIndex1Based <= YOUTH[i].untilMonth) return YOUTH[i].rate;
      }
      return YOUTH[YOUTH.length - 1].rate;
    }

    function pmt(principal, monthlyRate, months) {
      if (months <= 0) return 0;
      if (monthlyRate === 0) return principal / months;
      var f = Math.pow(1 + monthlyRate, months);
      return (principal * monthlyRate * f) / (f - 1);
    }

    function buildSchedule(principal, totalMonths, graceMonths) {
      var balance = principal;
      var rows = [];
      var amortPmt = 0;
      var lastRateKey = null;
      var gracePaySample = 0;
      var amortPaySample = 0;

      for (var m = 1; m <= totalMonths && balance > 0.005; m++) {
        var annual = annualRateForMonth(m);
        var r = annual / 12;
        var rateKey = String(annual);
        var interest = balance * r;
        var principalPay = 0;
        var payment = 0;
        var phase = m <= graceMonths ? 'grace' : 'amort';

        if (phase === 'grace') {
          payment = interest;
          principalPay = 0;
          if (m === 1 || gracePaySample === 0) gracePaySample = payment;
        } else {
          var remaining = totalMonths - m + 1;
          if (amortPmt === 0 || rateKey !== lastRateKey) {
            amortPmt = pmt(balance, r, remaining);
            lastRateKey = rateKey;
          }
          principalPay = amortPmt - interest;
          if (principalPay > balance) {
            principalPay = balance;
            payment = interest + principalPay;
          } else {
            payment = amortPmt;
          }
          balance -= principalPay;
          if (balance < 0) balance = 0;
          if (amortPaySample === 0) amortPaySample = payment;
        }

        rows.push({
          m: m,
          phase: phase,
          ratePct: annual * 100,
          payment: payment,
          principal: principalPay,
          interest: interest,
          balance: phase === 'grace' ? principal : balance
        });
      }

      var totalInterest = 0;
      var totalPay = 0;
      for (var i = 0; i < rows.length; i++) {
        totalInterest += rows[i].interest;
        totalPay += rows[i].payment;
      }

      return {
        rows: rows,
        gracePay: graceMonths > 0 ? gracePaySample : 0,
        amortPay: amortPaySample || (rows.length ? rows[rows.length - 1].payment : 0),
        totalInterest: totalInterest,
        totalPay: totalPay
      };
    }

    function syncPlanUi() {
      var rateWrap = app.querySelector('#vr-mg-rate-wrap');
      var note = app.querySelector('#vr-mg-plan-note');
      if (plan === 'youth') {
        rateWrap.style.display = 'none';
        note.textContent = '新青安：前 3 年 1.775% → 第 4–5 年 2.105% → 第 6 年起 2.275%（機動分段示意）。';
      } else {
        rateWrap.style.display = '';
        note.textContent = '一般房貸：採單一固定／機動利率（預設 2.2%，可自行調整）。';
      }
      app.querySelectorAll('[data-plan]').forEach(function (btn) {
        var on = btn.getAttribute('data-plan') === plan;
        btn.classList.toggle('is-on', on);
        btn.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
    }

    function calc() {
      var wan = Math.max(0, Number(app.querySelector('#vr-mg-wan').value) || 0);
      var years = Number(app.querySelector('#vr-mg-years').value) || 30;
      var graceYears = Math.min(5, Math.max(0, Number(app.querySelector('#vr-mg-grace').value) || 0));
      if (graceYears >= years) graceYears = Math.max(0, years - 1);

      var principal = wan * 10000;
      var totalMonths = years * 12;
      var graceMonths = graceYears * 12;
      var result = buildSchedule(principal, totalMonths, graceMonths);

      var cards = app.querySelector('#vr-mg-cards');
      if (graceMonths > 0) {
        cards.innerHTML =
          '<article class="vr-pay-card">' +
          '  <p class="vr-pay-card__label">寬限期每月需付</p>' +
          '  <p class="vr-pay-card__value">NT$ ' + money(result.gracePay) + '</p>' +
          '  <p class="vr-pay-card__hint">僅繳利息 · 共 ' + graceYears + ' 年（' + graceMonths + ' 期）</p>' +
          '</article>' +
          '<article class="vr-pay-card vr-pay-card--accent">' +
          '  <p class="vr-pay-card__label">寬限期後每月需付</p>' +
          '  <p class="vr-pay-card__value">NT$ ' + money(result.amortPay) + '</p>' +
          '  <p class="vr-pay-card__hint">本息平均攤還 · 剩餘 ' + (years - graceYears) + ' 年</p>' +
          '</article>';
      } else {
        cards.innerHTML =
          '<article class="vr-pay-card vr-pay-card--accent" style="grid-column:1/-1">' +
          '  <p class="vr-pay-card__label">每月本利和</p>' +
          '  <p class="vr-pay-card__value">NT$ ' + money(result.amortPay) + '</p>' +
          '  <p class="vr-pay-card__hint">無寬限期 · 本息平均攤還 ' + years + ' 年</p>' +
          '</article>';
      }

      app.querySelector('#vr-mg-extra').innerHTML =
        '<div class="vr-result"><div><p class="vr-result-name">貸款本金</p><p class="vr-result-text">NT$ ' + money(principal) + '（' + wan + ' 萬）</p></div></div>' +
        '<div class="vr-result"><div><p class="vr-result-name">總繳利息（全期估算）</p><p class="vr-result-text">NT$ ' + money(result.totalInterest) + '</p></div></div>' +
        '<div class="vr-result"><div><p class="vr-result-name">總繳金額（本金＋利息）</p><p class="vr-result-text">NT$ ' + money(result.totalPay) + '</p></div></div>';

      var first12 = result.rows.slice(0, 12);
      var tbl = '<div class="vr-table-scroll"><table class="vr-table"><thead><tr>' +
        '<th>期數</th><th>階段</th><th>年利率</th><th>月付</th><th>本金</th><th>利息</th><th>餘額</th>' +
        '</tr></thead><tbody>';
      first12.forEach(function (row) {
        tbl += '<tr><td>' + row.m + '</td><td>' + (row.phase === 'grace' ? '寬限期' : '攤還') +
          '</td><td>' + row.ratePct.toFixed(3) + '%</td><td>' + money(row.payment) +
          '</td><td>' + money(row.principal) + '</td><td>' + money(row.interest) +
          '</td><td>' + money(row.balance) + '</td></tr>';
      });
      tbl += '</tbody></table></div>';
      app.querySelector('#vr-mg-table-wrap').innerHTML = tbl || '<p class="vr-muted">尚無明細</p>';
    }

    function onPlanClick(e) {
      var btn = e.target.closest('[data-plan]');
      if (!btn || !app.contains(btn)) return;
      plan = btn.getAttribute('data-plan');
      syncPlanUi();
      calc();
    }

    var schedule = bindRafSchedule(app, calc);
    app.addEventListener('click', onPlanClick);
    ['#vr-mg-wan', '#vr-mg-rate'].forEach(function (sel) {
      app.querySelector(sel).addEventListener('input', schedule);
    });
    ['#vr-mg-years', '#vr-mg-grace'].forEach(function (sel) {
      app.querySelector(sel).addEventListener('change', schedule);
    });
    onCleanup(app, function () {
      app.removeEventListener('click', onPlanClick);
    });

    syncPlanUi();
    calc();
  }

  /* ——— 3. income-tax-estimator ——— */
  function mountIncomeTaxEstimator(app) {
    prepMount(app);
    var BRACKETS = [
      { up: 560000, rate: 0.05 },
      { up: 1260000, rate: 0.12 },
      { up: 2520000, rate: 0.20 },
      { up: 4420000, rate: 0.30 },
      { up: 6660000, rate: 0.40 },
      { up: Infinity, rate: 0.45 }
    ];

    app.innerHTML =
      '<section class="vr-card vr-stack">' +
      '  <p class="vr-eyebrow">Income Tax</p>' +
      '  <p class="vr-lead">綜合所得稅速算 · 僅供試算非申報</p>' +
      '  <label class="vr-label">綜合所得淨額（元）' +
      '    <input id="vr-tax-income" class="vr-input" type="number" value="1200000">' +
      '  </label>' +
      '  <div id="vr-tax-out" class="vr-stack"></div>' +
      '  <p class="vr-muted">※ 採 2024/2025 近似級距，未含各項扣除額、免稅額與特別扣除，結果僅供參考。</p>' +
      '</section>';

    function calcTax(income) {
      var prev = 0;
      var tax = 0;
      var detail = [];
      for (var i = 0; i < BRACKETS.length; i++) {
        var b = BRACKETS[i];
        var chunk = Math.min(income, b.up) - prev;
        if (chunk > 0) {
          var part = chunk * b.rate;
          tax += part;
          detail.push({ rate: b.rate, amount: chunk, tax: part });
        }
        prev = b.up;
        if (income <= b.up) break;
      }
      return { tax: tax, detail: detail };
    }

    function render() {
      var income = Math.max(0, Number(app.querySelector('#vr-tax-income').value) || 0);
      var res = calcTax(income);
      var eff = income > 0 ? (res.tax / income * 100).toFixed(2) : '0.00';
      var html = '<div class="vr-result"><div><p class="vr-result-name">估計應納稅額</p>' +
        '<p class="vr-big-num">NT$ ' + money(res.tax) + '</p>' +
        '<p class="vr-muted">有效稅率 ' + eff + '%</p></div></div>';
      html += '<table class="vr-table"><thead><tr><th>級距</th><th>課稅所得</th><th>稅額</th></tr></thead><tbody>';
      res.detail.forEach(function (d) {
        html += '<tr><td>' + (d.rate * 100) + '%</td><td>' + money(d.amount) + '</td><td>' + money(d.tax) + '</td></tr>';
      });
      html += '</tbody></table>';
      app.querySelector('#vr-tax-out').innerHTML = html;
    }

    var schedule = bindRafSchedule(app, render);
    app.querySelector('#vr-tax-income').addEventListener('input', schedule);
    render();
  }

  /* ——— 4. overtime-leave-calculator ——— */
  function mountOvertimeLeaveCalculator(app) {
    prepMount(app);
    app.innerHTML =
      '<section class="vr-card vr-stack">' +
      '  <p class="vr-eyebrow">Labor</p>' +
      '  <p class="vr-lead">加班費與特休天數試算（簡化版）</p>' +
      '  <label class="vr-label">月薪（元）<input id="vr-ot-wage" class="vr-input" type="number" value="42000"></label>' +
      '  <div class="vr-grid-3">' +
      '    <label class="vr-label">平日加班時數<input id="vr-ot-wd" class="vr-input" type="number" step="0.5" value="0"></label>' +
      '    <label class="vr-label">休息日時數<input id="vr-ot-rest" class="vr-input" type="number" step="0.5" value="0"></label>' +
      '    <label class="vr-label">國定假日時數<input id="vr-ot-hol" class="vr-input" type="number" step="0.5" value="0"></label>' +
      '  </div>' +
      '  <label class="vr-label">年資（年）<input id="vr-ot-years" class="vr-input" type="number" step="0.5" value="2"></label>' +
      '  <div id="vr-ot-out" class="vr-stack"></div>' +
      '  <p class="vr-muted">※ 加班倍率簡化：平日 1.34、休息日 1.67、國定 2.67；特休依勞基法近似表。</p>' +
      '</section>';

    function leaveDays(years) {
      if (years < 0.5) return 0;
      if (years < 1) return 3;
      if (years < 2) return 7;
      if (years < 3) return 10;
      if (years < 5) return 14;
      if (years < 10) return 15;
      if (years < 11) return 16;
      if (years < 12) return 17;
      if (years < 13) return 18;
      if (years < 14) return 19;
      if (years < 15) return 20;
      if (years < 16) return 21;
      if (years < 17) return 22;
      if (years < 18) return 23;
      if (years < 19) return 24;
      if (years < 20) return 25;
      if (years < 21) return 26;
      if (years < 22) return 27;
      if (years < 23) return 28;
      if (years < 24) return 29;
      return 30;
    }

    function render() {
      var wage = Math.max(0, Number(app.querySelector('#vr-ot-wage').value) || 0);
      var hourly = wage / 240;
      var wd = Math.max(0, Number(app.querySelector('#vr-ot-wd').value) || 0);
      var rest = Math.max(0, Number(app.querySelector('#vr-ot-rest').value) || 0);
      var hol = Math.max(0, Number(app.querySelector('#vr-ot-hol').value) || 0);
      var years = Math.max(0, Number(app.querySelector('#vr-ot-years').value) || 0);
      var otPay = wd * hourly * 1.34 + rest * hourly * 1.67 + hol * hourly * 2.67;
      var days = leaveDays(years);
      app.querySelector('#vr-ot-out').innerHTML =
        '<div class="vr-result"><div><p class="vr-result-name">估計加班費</p>' +
        '<p class="vr-big-num">NT$ ' + money(otPay) + '</p>' +
        '<p class="vr-muted">時薪約 NT$ ' + money(hourly) + '</p></div></div>' +
        '<div class="vr-result"><div><p class="vr-result-name">特休天數（近似）</p>' +
        '<p class="vr-big-num">' + days + ' 天</p></div></div>';
    }

    var schedule = bindRafSchedule(app, render);
    ['#vr-ot-wage', '#vr-ot-wd', '#vr-ot-rest', '#vr-ot-hol', '#vr-ot-years'].forEach(function (s) {
      app.querySelector(s).addEventListener('input', schedule);
    });
    render();
  }

  /* ——— 5. labor-health-insurance ——— */
  function mountLaborHealthInsurance(app) {
    prepMount(app);
    var GRADES = [
      { min: 0, max: 26400, insured: 26400 },
      { min: 26401, max: 27600, insured: 27600 },
      { min: 27601, max: 28800, insured: 28800 },
      { min: 28801, max: 30300, insured: 30300 },
      { min: 30301, max: 31800, insured: 31800 },
      { min: 31801, max: 33300, insured: 33300 },
      { min: 33301, max: 34800, insured: 34800 },
      { min: 34801, max: 36300, insured: 36300 },
      { min: 36301, max: 38200, insured: 38200 },
      { min: 38201, max: 40100, insured: 40100 },
      { min: 40101, max: 42000, insured: 42000 },
      { min: 42001, max: 43900, insured: 43900 },
      { min: 43901, max: 45800, insured: 45800 },
      { min: 45801, max: 48200, insured: 48200 },
      { min: 48201, max: 50600, insured: 50600 },
      { min: 50601, max: 53000, insured: 53000 },
      { min: 53001, max: 55400, insured: 55400 },
      { min: 55401, max: 57800, insured: 57800 },
      { min: 57801, max: 60800, insured: 60800 },
      { min: 60801, max: 9999999, insured: 60800 }
    ];

    app.innerHTML =
      '<section class="vr-card vr-stack">' +
      '  <p class="vr-eyebrow">NHI & Labor</p>' +
      '  <p class="vr-lead">勞健保投保薪資級距查詢（簡化）</p>' +
      '  <label class="vr-label">月薪（元）<input id="vr-lhi-salary" class="vr-input" type="number" value="45000"></label>' +
      '  <div id="vr-lhi-out" class="vr-stack"></div>' +
      '  <p class="vr-muted">※ 勞保自付約 20%、健保自付約 30%（含眷屬簡化），實際以投保單位與眷屬數為準。</p>' +
      '</section>';

    function lookup(salary) {
      for (var i = 0; i < GRADES.length; i++) {
        if (salary >= GRADES[i].min && salary <= GRADES[i].max) return GRADES[i];
      }
      return GRADES[GRADES.length - 1];
    }

    function render() {
      var salary = Math.max(0, Number(app.querySelector('#vr-lhi-salary').value) || 0);
      var g = lookup(salary);
      var laborEmp = g.insured * 0.115 * 0.2;
      var healthEmp = g.insured * 0.0517 * 0.3;
      app.querySelector('#vr-lhi-out').innerHTML =
        '<div class="vr-result"><div><p class="vr-result-name">投保薪資級距</p>' +
        '<p class="vr-result-text">NT$ ' + money(g.insured) + '</p></div></div>' +
        '<div class="vr-grid-2">' +
        '<div class="vr-result"><div><p class="vr-result-name">勞保（員工負擔估算）</p>' +
        '<p class="vr-result-text">NT$ ' + money(laborEmp) + ' / 月</p></div></div>' +
        '<div class="vr-result"><div><p class="vr-result-name">健保（員工負擔估算）</p>' +
        '<p class="vr-result-text">NT$ ' + money(healthEmp) + ' / 月</p></div></div></div>';
    }

    var schedule = bindRafSchedule(app, render);
    app.querySelector('#vr-lhi-salary').addEventListener('input', schedule);
    render();
  }

  /* ——— 6. ig-grid-splitter ——— */
  function mountIgGridSplitter(app) {
    prepMount(app);
    app.innerHTML =
      '<section class="vr-card vr-stack">' +
      '  <p class="vr-eyebrow">Instagram Grid</p>' +
      '  <p class="vr-lead">上傳圖片 · 切分 IG 九宮格／直向拼貼</p>' +
      '  <label id="vr-ig-drop" class="vr-drop"><span>點擊或拖放圖片</span>' +
      '    <input id="vr-ig-file" type="file" accept="image/*" hidden></label>' +
      '  <div class="vr-row" id="vr-ig-chips">' +
      '    <button type="button" class="vr-chip is-on" data-grid="1x2">1×2</button>' +
      '    <button type="button" class="vr-chip" data-grid="2x2">2×2</button>' +
      '    <button type="button" class="vr-chip" data-grid="3x3">3×3</button>' +
      '  </div>' +
      '  <canvas id="vr-ig-preview" class="vr-canvas"></canvas>' +
      '  <div id="vr-ig-dl" class="vr-row"></div>' +
      '  <p id="vr-ig-status" class="vr-muted" role="status"></p>' +
      '</section>';

    var img = new Image();
    var objectUrl = '';
    var grid = { cols: 1, rows: 2 };
    var canvas = app.querySelector('#vr-ig-preview');
    var ctx = canvas.getContext('2d');

    function setGrid(key) {
      if (key === '1x2') grid = { cols: 1, rows: 2 };
      else if (key === '2x2') grid = { cols: 2, rows: 2 };
      else grid = { cols: 3, rows: 3 };
      app.querySelectorAll('#vr-ig-chips .vr-chip').forEach(function (c) {
        c.classList.toggle('is-on', c.getAttribute('data-grid') === key);
      });
      render();
    }

    function render() {
      if (!img.src) return;
      var maxW = 640;
      var scale = Math.min(1, maxW / img.width);
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      var cw = canvas.width / grid.cols;
      var ch = canvas.height / grid.rows;
      ctx.strokeStyle = 'rgba(25,119,204,0.6)';
      ctx.lineWidth = 2;
      for (var c = 1; c < grid.cols; c++) {
        ctx.beginPath(); ctx.moveTo(c * cw, 0); ctx.lineTo(c * cw, canvas.height); ctx.stroke();
      }
      for (var r = 1; r < grid.rows; r++) {
        ctx.beginPath(); ctx.moveTo(0, r * ch); ctx.lineTo(canvas.width, r * ch); ctx.stroke();
      }
      buildDlButtons();
    }

    function buildDlButtons() {
      var wrap = app.querySelector('#vr-ig-dl');
      wrap.replaceChildren();
      var idx = 0;
      for (var r = 0; r < grid.rows; r++) {
        for (var c = 0; c < grid.cols; c++) {
          (function (col, row, n) {
            var btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'vr-btn vr-btn-emerald';
            btn.textContent = '下載 #' + n;
            btn.addEventListener('click', function () {
              var off = document.createElement('canvas');
              var sw = img.width / grid.cols;
              var sh = img.height / grid.rows;
              off.width = sw; off.height = sh;
              off.getContext('2d').drawImage(img, col * sw, row * sh, sw, sh, 0, 0, sw, sh);
              downloadCanvasPng(off, 'ig-grid-' + n + '.png');
            });
            wrap.appendChild(btn);
          })(c, r, ++idx);
        }
      }
    }

    function loadFile(file) {
      if (!file.type.startsWith('image/')) return;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
      objectUrl = URL.createObjectURL(file);
      img.onload = function () {
        app.querySelector('#vr-ig-status').textContent = file.name + ' · ' + img.width + '×' + img.height;
        render();
      };
      img.src = objectUrl;
    }

    app.querySelectorAll('#vr-ig-chips .vr-chip').forEach(function (chip) {
      chip.addEventListener('click', function () { setGrid(chip.getAttribute('data-grid')); });
    });
    bindDropZone(app, app.querySelector('#vr-ig-drop'), app.querySelector('#vr-ig-file'), loadFile);
    onCleanup(app, function () { if (objectUrl) URL.revokeObjectURL(objectUrl); });
  }

  /* ——— 7. chat-screenshot-maker ——— */
  function mountChatScreenshotMaker(app) {
    prepMount(app);
    app.innerHTML =
      '<section class="vr-card vr-stack">' +
      '  <p class="vr-eyebrow">Chat Mockup</p>' +
      '  <p class="vr-lead">LINE / iMessage 風格對話截圖</p>' +
      '  <label class="vr-label">風格<select id="vr-chat-style" class="vr-select">' +
      '    <option value="line">LINE 綠</option><option value="imessage">iMessage 藍</option></select></label>' +
      '  <div class="vr-row">' +
      '    <select id="vr-chat-who" class="vr-select" style="max-width:8rem"><option value="me">我</option><option value="other">對方</option></select>' +
      '    <input id="vr-chat-text" class="vr-input" type="text" placeholder="輸入訊息">' +
      '    <button type="button" id="vr-chat-add" class="vr-btn">加入</button>' +
      '  </div>' +
      '  <canvas id="vr-chat-canvas" class="vr-canvas" width="360" height="520"></canvas>' +
      '  <button type="button" id="vr-chat-dl" class="vr-btn">下載 PNG</button>' +
      '  <button type="button" id="vr-chat-clear" class="vr-btn vr-btn-rose">清空</button>' +
      '</section>';

    var messages = [];
    var canvas = app.querySelector('#vr-chat-canvas');
    var ctx = canvas.getContext('2d');

    function drawBubble(x, y, w, h, color, right) {
      ctx.fillStyle = color;
      roundRect(ctx, x, y, w, h, 14);
      ctx.fill();
      if (right) {
        ctx.beginPath();
        ctx.moveTo(x + w, y + h - 20);
        ctx.lineTo(x + w + 8, y + h - 12);
        ctx.lineTo(x + w, y + h - 8);
        ctx.fillStyle = color;
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.moveTo(x, y + h - 20);
        ctx.lineTo(x - 8, y + h - 12);
        ctx.lineTo(x, y + h - 8);
        ctx.fillStyle = color;
        ctx.fill();
      }
    }

    function render() {
      var style = app.querySelector('#vr-chat-style').value;
      var bg = style === 'line' ? '#8cabd8' : '#e5e5ea';
      var meColor = style === 'line' ? '#9fe870' : '#007aff';
      var otherColor = '#ffffff';
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      var y = 16;
      var pad = 12;
      var maxW = canvas.width - 80;
      ctx.font = '15px "Noto Sans TC", sans-serif';
      messages.forEach(function (m) {
        var lines = [];
        var words = m.text;
        var line = '';
        for (var i = 0; i < words.length; i++) {
          var test = line + words[i];
          if (ctx.measureText(test).width > maxW - 24) {
            lines.push(line);
            line = words[i];
          } else line = test;
        }
        if (line) lines.push(line);
        var bh = lines.length * 20 + 16;
        var bw = Math.min(maxW, Math.max.apply(null, lines.map(function (l) { return ctx.measureText(l).width; })) + 24);
        var right = m.who === 'me';
        var x = right ? canvas.width - bw - pad : pad;
        var color = right ? meColor : otherColor;
        drawBubble(x, y, bw, bh, color, right);
        ctx.fillStyle = right && style === 'imessage' ? '#fff' : '#222';
        lines.forEach(function (ln, li) {
          ctx.fillText(ln, x + 12, y + 22 + li * 20);
        });
        y += bh + 10;
      });
    }

    app.querySelector('#vr-chat-add').addEventListener('click', function () {
      var text = app.querySelector('#vr-chat-text').value.trim();
      if (!text) return;
      messages.push({ who: app.querySelector('#vr-chat-who').value, text: text });
      app.querySelector('#vr-chat-text').value = '';
      render();
    });
    app.querySelector('#vr-chat-style').addEventListener('change', render);
    app.querySelector('#vr-chat-dl').addEventListener('click', function () {
      downloadCanvasPng(canvas, 'chat-screenshot.png');
    });
    app.querySelector('#vr-chat-clear').addEventListener('click', function () {
      messages = [];
      render();
    });
    render();
  }

  /* ——— 8. avatar-safe-zone ——— */
  function mountAvatarSafeZone(app) {
    prepMount(app);
    app.innerHTML =
      '<section class="vr-card vr-stack">' +
      '  <p class="vr-eyebrow">Avatar Crop</p>' +
      '  <p class="vr-lead">圓形／方形安全區 · 社群頭像預覽</p>' +
      '  <label id="vr-av-drop" class="vr-drop"><span>上傳頭像圖片</span>' +
      '    <input id="vr-av-file" type="file" accept="image/*" hidden></label>' +
      '  <div class="vr-grid-2">' +
      '    <label class="vr-label">縮放<input id="vr-av-scale" class="vr-input" type="range" min="0.5" max="2" step="0.01" value="1"></label>' +
      '    <label class="vr-label">水平<input id="vr-av-x" class="vr-input" type="range" min="-100" max="100" value="0"></label>' +
      '    <label class="vr-label">垂直<input id="vr-av-y" class="vr-input" type="range" min="-100" max="100" value="0"></label>' +
      '    <label class="vr-label">遮罩<select id="vr-av-mask" class="vr-select"><option value="circle">圓形</option><option value="square">方形</option></select></label>' +
      '  </div>' +
      '  <canvas id="vr-av-canvas" class="vr-canvas" width="320" height="320"></canvas>' +
      '  <button type="button" id="vr-av-dl" class="vr-btn">下載裁切 PNG</button>' +
      '</section>';

    var img = new Image();
    var objectUrl = '';
    var canvas = app.querySelector('#vr-av-canvas');
    var ctx = canvas.getContext('2d');
    var size = 320;

    function render() {
      if (!img.src) {
        ctx.fillStyle = '#f5f9fc';
        ctx.fillRect(0, 0, size, size);
        ctx.fillStyle = '#6c757d';
        ctx.font = '14px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('請上傳圖片', size / 2, size / 2);
        ctx.textAlign = 'left';
        return;
      }
      var sc = Number(app.querySelector('#vr-av-scale').value);
      var ox = Number(app.querySelector('#vr-av-x').value);
      var oy = Number(app.querySelector('#vr-av-y').value);
      var mask = app.querySelector('#vr-av-mask').value;
      ctx.clearRect(0, 0, size, size);
      ctx.save();
      ctx.beginPath();
      if (mask === 'circle') ctx.arc(size / 2, size / 2, size / 2 - 2, 0, Math.PI * 2);
      else ctx.rect(2, 2, size - 4, size - 4);
      ctx.clip();
      var iw = img.width * sc;
      var ih = img.height * sc;
      var dx = (size - iw) / 2 + ox;
      var dy = (size - ih) / 2 + oy;
      ctx.drawImage(img, dx, dy, iw, ih);
      ctx.restore();
      ctx.strokeStyle = 'rgba(25,119,204,0.5)';
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 4]);
      ctx.beginPath();
      if (mask === 'circle') ctx.arc(size / 2, size / 2, size / 2 - 8, 0, Math.PI * 2);
      else ctx.rect(8, 8, size - 16, size - 16);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    function loadFile(file) {
      if (!file.type.startsWith('image/')) return;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
      objectUrl = URL.createObjectURL(file);
      img.onload = render;
      img.src = objectUrl;
    }

    var schedule = bindRafSchedule(app, render);
    ['#vr-av-scale', '#vr-av-x', '#vr-av-y', '#vr-av-mask'].forEach(function (s) {
      app.querySelector(s).addEventListener('input', schedule);
    });
    app.querySelector('#vr-av-dl').addEventListener('click', function () {
      if (!img.src) return;
      var off = document.createElement('canvas');
      off.width = size; off.height = size;
      var oc = off.getContext('2d');
      var mask = app.querySelector('#vr-av-mask').value;
      var sc = Number(app.querySelector('#vr-av-scale').value);
      var ox = Number(app.querySelector('#vr-av-x').value);
      var oy = Number(app.querySelector('#vr-av-y').value);
      oc.save();
      oc.beginPath();
      if (mask === 'circle') oc.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
      else oc.rect(0, 0, size, size);
      oc.clip();
      var iw = img.width * sc;
      var ih = img.height * sc;
      oc.drawImage(img, (size - iw) / 2 + ox, (size - ih) / 2 + oy, iw, ih);
      oc.restore();
      downloadCanvasPng(off, 'avatar-' + mask + '.png');
    });
    bindDropZone(app, app.querySelector('#vr-av-drop'), app.querySelector('#vr-av-file'), loadFile);
    onCleanup(app, function () { if (objectUrl) URL.revokeObjectURL(objectUrl); });
    render();
  }

  /* ——— 9. resume-photo-spec ——— */
  function mountResumePhotoSpec(app) {
    prepMount(app);
    app.innerHTML =
      '<section class="vr-card vr-stack">' +
      '  <p class="vr-eyebrow">Resume Photo</p>' +
      '  <p class="vr-lead">履歷／證件照比例 · 2×2 吋風格方型</p>' +
      '  <label id="vr-rp-drop" class="vr-drop"><span>上傳人像</span>' +
      '    <input id="vr-rp-file" type="file" accept="image/*" hidden></label>' +
      '  <p class="vr-label">背景色</p>' +
      '  <div class="vr-row" id="vr-rp-bg">' +
      '    <button type="button" class="vr-chip is-on" data-bg="#5B9BD5">藍底</button>' +
      '    <button type="button" class="vr-chip" data-bg="#ffffff">白底</button>' +
      '    <button type="button" class="vr-chip" data-bg="#c0392b">紅底</button>' +
      '  </div>' +
      '  <canvas id="vr-rp-canvas" class="vr-canvas" width="400" height="400"></canvas>' +
      '  <button type="button" id="vr-rp-dl" class="vr-btn">下載證件照 PNG</button>' +
      '</section>';

    var img = new Image();
    var objectUrl = '';
    var bgColor = '#5B9BD5';
    var canvas = app.querySelector('#vr-rp-canvas');
    var ctx = canvas.getContext('2d');

    function render() {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, 400, 400);
      if (!img.src) return;
      var scale = Math.max(400 / img.width, 400 / img.height);
      var w = img.width * scale;
      var h = img.height * scale;
      ctx.drawImage(img, (400 - w) / 2, (400 - h) / 2 - 20, w, h);
    }

    app.querySelectorAll('#vr-rp-bg .vr-chip').forEach(function (chip) {
      chip.addEventListener('click', function () {
        bgColor = chip.getAttribute('data-bg');
        app.querySelectorAll('#vr-rp-bg .vr-chip').forEach(function (c) {
          c.classList.toggle('is-on', c === chip);
        });
        render();
      });
    });

    function loadFile(file) {
      if (!file.type.startsWith('image/')) return;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
      objectUrl = URL.createObjectURL(file);
      img.onload = render;
      img.src = objectUrl;
    }

    app.querySelector('#vr-rp-dl').addEventListener('click', function () {
      downloadCanvasPng(canvas, 'resume-photo.png');
    });
    bindDropZone(app, app.querySelector('#vr-rp-drop'), app.querySelector('#vr-rp-file'), loadFile);
    onCleanup(app, function () { if (objectUrl) URL.revokeObjectURL(objectUrl); });
    render();
  }

  /* ——— 10. youtube-thumbnail-factory ——— */
  function mountYoutubeThumbnailFactory(app) {
    prepMount(app);
    app.innerHTML =
      '<section class="vr-card vr-stack">' +
      '  <p class="vr-eyebrow">YouTube Thumbnail</p>' +
      '  <p class="vr-lead">1280×720 縮圖 · 純前端 Canvas</p>' +
      '  <label class="vr-label">主標題<input id="vr-yt-title" class="vr-input" value="超實用工具教學"></label>' +
      '  <label class="vr-label">副標題<input id="vr-yt-sub" class="vr-input" value="3 分鐘學會"></label>' +
      '  <label class="vr-label">背景色<input id="vr-yt-bg" class="vr-input" type="color" value="#1977cc"></label>' +
      '  <label class="vr-label">背景圖（選填）<input id="vr-yt-file" class="vr-input" type="file" accept="image/*"></label>' +
      '  <canvas id="vr-yt-canvas" class="vr-canvas" width="640" height="360"></canvas>' +
      '  <button type="button" id="vr-yt-dl" class="vr-btn">下載 1280×720 PNG</button>' +
      '</section>';

    var bgImg = new Image();
    var bgUrl = '';
    var canvas = app.querySelector('#vr-yt-canvas');
    var ctx = canvas.getContext('2d');
    var W = 1280;
    var H = 720;

    function render() {
      var off = document.createElement('canvas');
      off.width = W; off.height = H;
      var c = off.getContext('2d');
      var bg = app.querySelector('#vr-yt-bg').value;
      c.fillStyle = bg;
      c.fillRect(0, 0, W, H);
      if (bgImg.src) {
        c.globalAlpha = 0.35;
        var sc = Math.max(W / bgImg.width, H / bgImg.height);
        var iw = bgImg.width * sc;
        var ih = bgImg.height * sc;
        c.drawImage(bgImg, (W - iw) / 2, (H - ih) / 2, iw, ih);
        c.globalAlpha = 1;
      }
      c.fillStyle = 'rgba(0,0,0,0.45)';
      c.fillRect(0, H * 0.55, W, H * 0.45);
      var title = app.querySelector('#vr-yt-title').value || '';
      var sub = app.querySelector('#vr-yt-sub').value || '';
      c.fillStyle = '#fff';
      c.font = 'bold 72px "Noto Sans TC", sans-serif';
      c.fillText(title.slice(0, 18), 48, H - 140);
      c.font = '36px "Noto Sans TC", sans-serif';
      c.fillStyle = '#e8f4fc';
      c.fillText(sub.slice(0, 30), 48, H - 72);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(off, 0, 0, canvas.width, canvas.height);
      canvas._full = off;
    }

    app.querySelector('#vr-yt-file').addEventListener('change', function (e) {
      var f = e.target.files && e.target.files[0];
      if (!f) return;
      if (bgUrl) URL.revokeObjectURL(bgUrl);
      bgUrl = URL.createObjectURL(f);
      bgImg.onload = render;
      bgImg.src = bgUrl;
    });

    var schedule = bindRafSchedule(app, render);
    ['#vr-yt-title', '#vr-yt-sub', '#vr-yt-bg'].forEach(function (s) {
      app.querySelector(s).addEventListener('input', schedule);
    });
    app.querySelector('#vr-yt-dl').addEventListener('click', function () {
      render();
      if (canvas._full) downloadCanvasPng(canvas._full, 'youtube-thumbnail.png');
    });
    onCleanup(app, function () { if (bgUrl) URL.revokeObjectURL(bgUrl); });
    render();
  }

  /* ——— 11. hashtag-organizer ——— */
  function mountHashtagOrganizer(app) {
    prepMount(app);
    app.innerHTML =
      '<section class="vr-card vr-stack">' +
      '  <p class="vr-eyebrow">Hashtags</p>' +
      '  <p class="vr-lead">關鍵字整理 · 熱門／長尾／品牌分組</p>' +
      '  <label class="vr-label">關鍵字（逗號或換行分隔）' +
      '    <textarea id="vr-ht-in" class="vr-textarea" rows="4" placeholder="工具, SEO"></textarea></label>' +
      '  <div id="vr-ht-out" class="vr-stack"></div>' +
      '  <p id="vr-ht-toast" class="vr-toast"></p>' +
      '</section>';

    function toTags(raw) {
      var parts = raw.split(/[\n,，、\s]+/).map(function (s) { return s.trim(); }).filter(Boolean);
      var seen = {};
      return parts.filter(function (p) {
        var k = p.toLowerCase();
        if (seen[k]) return false;
        seen[k] = 1;
        return true;
      });
    }

    function render() {
      var tags = toTags(app.querySelector('#vr-ht-in').value);
      var hot = tags.slice(0, Math.ceil(tags.length / 3));
      var long = tags.slice(Math.ceil(tags.length / 3), Math.ceil(tags.length * 2 / 3));
      var brand = tags.slice(Math.ceil(tags.length * 2 / 3));
      var groups = [
        { name: '熱門', list: hot },
        { name: '長尾', list: long },
        { name: '品牌', list: brand }
      ];
      var toast = app.querySelector('#vr-ht-toast');
      var out = app.querySelector('#vr-ht-out');
      out.replaceChildren();
      groups.forEach(function (g) {
        var hashtags = g.list.map(function (t) {
          return t.startsWith('#') ? t : '#' + t;
        });
        var row = document.createElement('div');
        row.className = 'vr-result';
        var meta = document.createElement('div');
        meta.style.flex = '1';
        var name = document.createElement('p');
        name.className = 'vr-result-name';
        name.textContent = g.name;
        var text = document.createElement('p');
        text.className = 'vr-result-text';
        text.textContent = hashtags.join(' ') || '—';
        meta.append(name, text);
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'vr-btn vr-btn-emerald';
        btn.textContent = '複製';
        btn.addEventListener('click', function () {
          copyText(hashtags.join(' '), toast, '已複製 ' + g.name);
        });
        row.append(meta, btn);
        out.appendChild(row);
      });
    }

    var schedule = bindRafSchedule(app, render);
    app.querySelector('#vr-ht-in').addEventListener('input', schedule);
    render();
  }

  /* ——— LLM API price table (edit prices here; formulas stay separate) ——— */
  /** @type {{ updated: string, note: string, models: Array<{id:string,vendor:string,name:string,inputUsdPer1M:number,outputUsdPer1M:number,performancePick?:boolean}> }} */
  var LLM_API_PRICE_TABLE_2026 = {
    updated: '2026-07',
    note: '靜態示意價（USD / 每百萬 tokens）。請依各家官網公告自行更新。',
    models: [
      {
        id: 'gpt-4o',
        vendor: 'OpenAI',
        name: 'GPT-4o',
        inputUsdPer1M: 2.5,
        outputUsdPer1M: 10,
        performancePick: false
      },
      {
        id: 'claude-3-5-sonnet',
        vendor: 'Anthropic',
        name: 'Claude 3.5 Sonnet',
        inputUsdPer1M: 3,
        outputUsdPer1M: 15,
        performancePick: true
      },
      {
        id: 'gemini-1-5-pro',
        vendor: 'Google',
        name: 'Gemini 1.5 Pro',
        inputUsdPer1M: 1.25,
        outputUsdPer1M: 5,
        performancePick: false
      }
    ]
  };

  function llmMonthlyUsd(model, requests, avgInputTokens, avgOutputTokens) {
    var inTokens = requests * avgInputTokens;
    var outTokens = requests * avgOutputTokens;
    return (inTokens / 1e6) * model.inputUsdPer1M + (outTokens / 1e6) * model.outputUsdPer1M;
  }

  function moneyUsd(n) {
    return Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  /* ——— llm-api-cost-calculator ——— */
  function mountLlmApiCostCalculator(app) {
    prepMount(app);

    var priceTable = LLM_API_PRICE_TABLE_2026;
    var models = priceTable.models || [];

    app.innerHTML =
      '<section class="vr-card vr-stack">' +
      '  <p class="vr-eyebrow">2026 LLM Pricing</p>' +
      '  <p class="vr-lead">AI 算力成本與主流 LLM API 價格換算 · 純前端試算</p>' +
      '  <div class="vr-grid-2">' +
      '    <label class="vr-label">每月總 Requests 數' +
      '      <input id="vr-llm-req" class="vr-input" type="number" min="0" step="1" value="100000">' +
      '    </label>' +
      '    <label class="vr-label">平均單次 Input Tokens' +
      '      <input id="vr-llm-in" class="vr-input" type="number" min="0" step="1" value="800">' +
      '    </label>' +
      '    <label class="vr-label">平均單次 Output Tokens' +
      '      <input id="vr-llm-out" class="vr-input" type="number" min="0" step="1" value="400">' +
      '    </label>' +
      '    <label class="vr-label">台幣匯率（USD→TWD）' +
      '      <input id="vr-llm-fx" class="vr-input" type="number" min="0.01" step="0.1" value="32.5">' +
      '    </label>' +
      '  </div>' +
      '  <div id="vr-llm-usage" class="vr-result">' +
      '    <p class="vr-result-name">用量摘要</p>' +
      '    <p id="vr-llm-usage-text" class="vr-result-text"></p>' +
      '  </div>' +
      '  <div id="vr-llm-list" class="vr-llm-list" aria-live="polite"></div>' +
      '  <details class="vr-details">' +
      '    <summary>內建價格表（可於程式碼 JSON 手動修改）</summary>' +
      '    <div id="vr-llm-price-table" class="vr-table-scroll"></div>' +
      '  </details>' +
      '  <p class="vr-muted">※ 價格資料更新於 ' + escapeHtml(priceTable.updated) + '。' +
      escapeHtml(priceTable.note || '') + ' 實際計費以各供應商帳單與區域／批次折扣為準。</p>' +
      '</section>';

    function renderPriceTable() {
      var html = '<table class="vr-table"><thead><tr>' +
        '<th>供應商</th><th>模型</th><th>Input／百萬</th><th>Output／百萬</th>' +
        '</tr></thead><tbody>';
      models.forEach(function (m) {
        html += '<tr><td>' + escapeHtml(m.vendor) + '</td><td>' + escapeHtml(m.name) +
          '</td><td>$' + moneyUsd(m.inputUsdPer1M) + '</td><td>$' + moneyUsd(m.outputUsdPer1M) + '</td></tr>';
      });
      html += '</tbody></table>';
      app.querySelector('#vr-llm-price-table').innerHTML = html;
    }

    function calc() {
      var requests = Math.max(0, Number(app.querySelector('#vr-llm-req').value) || 0);
      var avgIn = Math.max(0, Number(app.querySelector('#vr-llm-in').value) || 0);
      var avgOut = Math.max(0, Number(app.querySelector('#vr-llm-out').value) || 0);
      var fx = Math.max(0.01, Number(app.querySelector('#vr-llm-fx').value) || 32.5);

      var totalIn = requests * avgIn;
      var totalOut = requests * avgOut;
      app.querySelector('#vr-llm-usage-text').textContent =
        '每月約 ' + money(totalIn) + ' Input Tokens + ' + money(totalOut) +
        ' Output Tokens（匯率 1 USD ≈ ' + fx + ' TWD）';

      var rows = models.map(function (m) {
        var usd = llmMonthlyUsd(m, requests, avgIn, avgOut);
        return {
          model: m,
          usd: usd,
          twd: usd * fx
        };
      }).sort(function (a, b) { return a.usd - b.usd; });

      var cheapestId = rows.length ? rows[0].model.id : null;
      var list = app.querySelector('#vr-llm-list');
      if (!rows.length) {
        list.innerHTML = '<p class="vr-muted">尚無模型價格資料</p>';
        return;
      }

      list.innerHTML = rows.map(function (row, idx) {
        var m = row.model;
        var badges = [];
        if (m.id === cheapestId) badges.push('<span class="vr-llm-badge vr-llm-badge--deal">最划算</span>');
        if (m.performancePick) badges.push('<span class="vr-llm-badge vr-llm-badge--perf">效能首選</span>');
        var rank = idx + 1;
        return (
          '<article class="vr-llm-card' + (m.id === cheapestId ? ' is-best' : '') + '">' +
          '  <div class="vr-llm-card__head">' +
          '    <span class="vr-llm-rank">#' + rank + '</span>' +
          '    <div>' +
          '      <p class="vr-llm-card__vendor">' + escapeHtml(m.vendor) + '</p>' +
          '      <p class="vr-llm-card__name">' + escapeHtml(m.name) + '</p>' +
          '    </div>' +
          '    <div class="vr-llm-badges">' + badges.join('') + '</div>' +
          '  </div>' +
          '  <div class="vr-llm-card__body">' +
          '    <div><p class="vr-llm-card__label">每月美金</p><p class="vr-llm-card__usd">US$ ' + moneyUsd(row.usd) + '</p></div>' +
          '    <div><p class="vr-llm-card__label">每月台幣</p><p class="vr-llm-card__twd">NT$ ' + money(row.twd) + '</p></div>' +
          '  </div>' +
          '  <p class="vr-llm-card__meta">$' + moneyUsd(m.inputUsdPer1M) + ' / $' + moneyUsd(m.outputUsdPer1M) +
          '（每百萬 Input／Output）</p>' +
          '</article>'
        );
      }).join('');
    }

    renderPriceTable();
    var schedule = bindRafSchedule(app, calc);
    ['#vr-llm-req', '#vr-llm-in', '#vr-llm-out', '#vr-llm-fx'].forEach(function (sel) {
      app.querySelector(sel).addEventListener('input', schedule);
    });
    calc();
  }

  /* ——— 12. meeting-cost-calculator ——— */
  function mountMeetingCostCalculator(app) {
    prepMount(app);
    app.innerHTML =
      '<section class="vr-card vr-stack">' +
      '  <p class="vr-eyebrow">Meeting Cost</p>' +
      '  <p class="vr-lead">會議成本計算 · 人數 × 時薪 × 時數</p>' +
      '  <div class="vr-grid-3">' +
      '    <label class="vr-label">人數<input id="vr-mc-ppl" class="vr-input" type="number" value="8"></label>' +
      '    <label class="vr-label">時薪（元）<input id="vr-mc-rate" class="vr-input" type="number" value="800"></label>' +
      '    <label class="vr-label">時數<input id="vr-mc-hours" class="vr-input" type="number" step="0.25" value="1"></label>' +
      '  </div>' +
      '  <p id="vr-mc-total" class="vr-big-num">NT$ 0</p>' +
      '  <p id="vr-mc-share" class="vr-muted" style="text-align:center"></p>' +
      '  <canvas id="vr-mc-card" class="vr-canvas" width="480" height="200"></canvas>' +
      '  <button type="button" id="vr-mc-copy" class="vr-btn vr-btn-emerald">複製分享文字</button>' +
      '  <button type="button" id="vr-mc-dl" class="vr-btn">下載分享卡</button>' +
      '  <p id="vr-mc-toast" class="vr-toast"></p>' +
      '</section>';

    var canvas = app.querySelector('#vr-mc-card');
    var ctx = canvas.getContext('2d');

    function render() {
      var ppl = Math.max(0, Number(app.querySelector('#vr-mc-ppl').value) || 0);
      var rate = Math.max(0, Number(app.querySelector('#vr-mc-rate').value) || 0);
      var hours = Math.max(0, Number(app.querySelector('#vr-mc-hours').value) || 0);
      var total = ppl * rate * hours;
      app.querySelector('#vr-mc-total').textContent = 'NT$ ' + money(total);
      var share = '這場 ' + hours + ' 小時會議，' + ppl + ' 人參與，估計成本 NT$ ' + money(total) + '。';
      app.querySelector('#vr-mc-share').textContent = share;
      ctx.fillStyle = '#1977cc';
      roundRect(ctx, 0, 0, canvas.width, canvas.height, 16);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 22px sans-serif';
      ctx.fillText('會議成本', 24, 48);
      ctx.font = 'bold 36px sans-serif';
      ctx.fillText('NT$ ' + money(total), 24, 100);
      ctx.font = '16px sans-serif';
      ctx.fillStyle = '#e8f4fc';
      ctx.fillText(ppl + ' 人 · ' + hours + ' 小時 · 時薪 ' + money(rate), 24, 140);
      canvas._share = share;
    }

    var schedule = bindRafSchedule(app, render);
    ['#vr-mc-ppl', '#vr-mc-rate', '#vr-mc-hours'].forEach(function (s) {
      app.querySelector(s).addEventListener('input', schedule);
    });
    app.querySelector('#vr-mc-copy').addEventListener('click', function () {
      copyText(canvas._share || '', app.querySelector('#vr-mc-toast'));
    });
    app.querySelector('#vr-mc-dl').addEventListener('click', function () {
      downloadCanvasPng(canvas, 'meeting-cost.png');
    });
    render();
  }

  /* ——— 13. gpa-calculator ——— */
  function mountGpaCalculator(app) {
    prepMount(app);
    var GRADES = { 'A+': 4.3, 'A': 4.0, 'A-': 3.7, 'B+': 3.3, 'B': 3.0, 'B-': 2.7, 'C+': 2.3, 'C': 2.0, 'C-': 1.7, 'D': 1.0, 'F': 0 };

    app.innerHTML =
      '<section class="vr-card vr-stack">' +
      '  <p class="vr-eyebrow">GPA</p>' +
      '  <p class="vr-lead">加權 GPA · 4.3 制</p>' +
      '  <div id="vr-gpa-rows" class="vr-stack"></div>' +
      '  <div class="vr-row">' +
      '    <button type="button" id="vr-gpa-add" class="vr-btn vr-btn-emerald">新增科目</button>' +
      '    <button type="button" id="vr-gpa-rm" class="vr-btn vr-btn-rose">移除最後一列</button>' +
      '  </div>' +
      '  <div class="vr-result"><div><p class="vr-result-name">加權 GPA</p>' +
      '    <p id="vr-gpa-out" class="vr-big-num">0.00</p></div></div>' +
      '</section>';

    var rowsEl = app.querySelector('#vr-gpa-rows');

    function gradeOptions() {
      return Object.keys(GRADES).map(function (g) {
        return '<option value="' + g + '">' + g + '</option>';
      }).join('');
    }

    function addRow(name, credit, grade) {
      var row = document.createElement('div');
      row.className = 'vr-grid-3 vr-gpa-row';
      row.innerHTML =
        '<input class="vr-input vr-gpa-name" placeholder="科目" value="' + escapeHtml(name || '') + '">' +
        '<input class="vr-input vr-gpa-credit" type="number" min="0" step="0.5" value="' + (credit || 3) + '">' +
        '<select class="vr-select vr-gpa-grade">' + gradeOptions() + '</select>';
      if (grade) row.querySelector('.vr-gpa-grade').value = grade;
      row.querySelectorAll('input,select').forEach(function (el) {
        el.addEventListener('input', calc);
      });
      rowsEl.appendChild(row);
    }

    function calc() {
      var rows = rowsEl.querySelectorAll('.vr-gpa-row');
      var pts = 0;
      var cred = 0;
      rows.forEach(function (row) {
        var c = Number(row.querySelector('.vr-gpa-credit').value) || 0;
        var g = row.querySelector('.vr-gpa-grade').value;
        pts += c * (GRADES[g] || 0);
        cred += c;
      });
      app.querySelector('#vr-gpa-out').textContent = cred > 0 ? (pts / cred).toFixed(2) : '0.00';
    }

    addRow('微積分', 3, 'A');
    addRow('程式設計', 3, 'B+');
    calc();

    app.querySelector('#vr-gpa-add').addEventListener('click', function () { addRow('', 3, 'A'); calc(); });
    app.querySelector('#vr-gpa-rm').addEventListener('click', function () {
      var rows = rowsEl.querySelectorAll('.vr-gpa-row');
      if (rows.length > 1) rows[rows.length - 1].remove();
      calc();
    });
  }

  /* ——— 14. vehicle-loan-calculator ——— */
  function mountVehicleLoanCalculator(app) {
    prepMount(app);
    app.innerHTML =
      '<section class="vr-card vr-stack">' +
      '  <p class="vr-eyebrow">Auto Loan</p>' +
      '  <p class="vr-lead">汽機車貸款試算</p>' +
      '  <div class="vr-row" id="vr-vl-mode">' +
      '    <button type="button" class="vr-chip is-on" data-mode="car">汽車</button>' +
      '    <button type="button" class="vr-chip" data-mode="scooter">機車</button>' +
      '  </div>' +
      '  <div class="vr-grid-2">' +
      '    <label class="vr-label">車價<input id="vr-vl-price" class="vr-input" type="number" value="800000"></label>' +
      '    <label class="vr-label">頭期款<input id="vr-vl-down" class="vr-input" type="number" value="150000"></label>' +
      '    <label class="vr-label">年利率 %<input id="vr-vl-rate" class="vr-input" type="number" step="0.01" value="3.5"></label>' +
      '    <label class="vr-label">期數（月）<input id="vr-vl-months" class="vr-input" type="number" value="60"></label>' +
      '  </div>' +
      '  <div id="vr-vl-out" class="vr-stack"></div>' +
      '</section>';

    var mode = 'car';

    app.querySelectorAll('#vr-vl-mode .vr-chip').forEach(function (chip) {
      chip.addEventListener('click', function () {
        mode = chip.getAttribute('data-mode');
        app.querySelectorAll('#vr-vl-mode .vr-chip').forEach(function (c) {
          c.classList.toggle('is-on', c === chip);
        });
        if (mode === 'scooter') {
          app.querySelector('#vr-vl-price').value = '80000';
          app.querySelector('#vr-vl-down').value = '10000';
          app.querySelector('#vr-vl-months').value = '24';
        } else {
          app.querySelector('#vr-vl-price').value = '800000';
          app.querySelector('#vr-vl-down').value = '150000';
          app.querySelector('#vr-vl-months').value = '60';
        }
        calc();
      });
    });

    function calc() {
      var price = Math.max(0, Number(app.querySelector('#vr-vl-price').value) || 0);
      var down = Math.max(0, Number(app.querySelector('#vr-vl-down').value) || 0);
      var annual = Math.max(0, Number(app.querySelector('#vr-vl-rate').value) || 0) / 100;
      var n = Math.max(1, Number(app.querySelector('#vr-vl-months').value) || 1);
      var P = Math.max(0, price - down);
      var r = annual / 12;
      var monthly = r === 0 ? P / n : (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      var totalPay = monthly * n;
      var interest = totalPay - P;
      app.querySelector('#vr-vl-out').innerHTML =
        '<div class="vr-result"><div><p class="vr-result-name">每月付款</p>' +
        '<p class="vr-big-num">NT$ ' + money(monthly) + '</p></div></div>' +
        '<table class="vr-table"><tbody>' +
        '<tr><td>貸款本金</td><td>NT$ ' + money(P) + '</td></tr>' +
        '<tr><td>總利息</td><td>NT$ ' + money(interest) + '</td></tr>' +
        '<tr><td>總還款</td><td>NT$ ' + money(totalPay) + '</td></tr>' +
        '<tr><td>類型</td><td>' + (mode === 'car' ? '汽車' : '機車') + '</td></tr>' +
        '</tbody></table>';
    }

    var schedule = bindRafSchedule(app, calc);
    ['#vr-vl-price', '#vr-vl-down', '#vr-vl-rate', '#vr-vl-months'].forEach(function (s) {
      app.querySelector(s).addEventListener('input', schedule);
    });
    calc();
  }

  /* ——— 15. daily-fortune-card ——— */
  function mountDailyFortuneCard(app) {
    prepMount(app);
    var COLORS = ['珊瑚紅', '天空藍', '薄荷綠', '暖黃', '薰衣草紫', '象牙白'];
    var YI = ['簽約', '運動', '整理桌面', '聯絡老友', '學新技能', '早點睡'];
    var JI = ['衝動消費', '熬夜', '與人爭辯', '拖延', '過度滑手機', '空腹喝咖啡'];

    app.innerHTML =
      '<section class="vr-card vr-stack">' +
      '  <p class="vr-eyebrow">Daily Fortune</p>' +
      '  <p class="vr-lead">今日運勢卡 · 依姓名或生日產生</p>' +
      '  <label class="vr-label">姓名<input id="vr-fc-name" class="vr-input" placeholder=""></label>' +
      '  <label class="vr-label">生日<input id="vr-fc-date" class="vr-input" type="date"></label>' +
      '  <button type="button" id="vr-fc-go" class="vr-btn">抽今日運勢</button>' +
      '  <canvas id="vr-fc-canvas" class="vr-canvas" width="360" height="420"></canvas>' +
      '  <button type="button" id="vr-fc-dl" class="vr-btn vr-btn-emerald">下載運勢卡</button>' +
      '</section>';

    var canvas = app.querySelector('#vr-fc-canvas');
    var ctx = canvas.getContext('2d');
    var lastFortune = null;

    function pick(rng, arr) {
      return arr[Math.floor(rng() * arr.length)];
    }

    function generate() {
      var name = app.querySelector('#vr-fc-name').value.trim();
      var date = app.querySelector('#vr-fc-date').value || new Date().toISOString().slice(0, 10);
      var seed = seededHash(name + date + 'fortune');
      var rng = mulberry32(seed);
      var score = Math.floor(rng() * 5) + 1;
      lastFortune = {
        name: name || '旅人',
        date: date,
        score: score,
        color: pick(rng, COLORS),
        yi: pick(rng, YI),
        ji: pick(rng, JI),
        text: ['順流而上', '穩扎穩打', '貴人相助', '靜待時機', '小步前進'][score - 1]
      };
      drawCard();
    }

    function drawCard() {
      if (!lastFortune) return;
      var f = lastFortune;
      ctx.fillStyle = '#1977cc';
      roundRect(ctx, 0, 0, canvas.width, canvas.height, 20);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 24px sans-serif';
      ctx.fillText(f.name + ' 的今日運勢', 24, 48);
      ctx.font = '14px sans-serif';
      ctx.fillStyle = '#e8f4fc';
      ctx.fillText(f.date, 24, 72);
      ctx.font = '48px sans-serif';
      ctx.fillText('★'.repeat(f.score) + '☆'.repeat(5 - f.score), 24, 130);
      ctx.font = '18px "Noto Sans TC", sans-serif';
      ctx.fillStyle = '#fff';
      ctx.fillText('「' + f.text + '」', 24, 180);
      ctx.font = '16px sans-serif';
      ctx.fillText('宜：' + f.yi, 24, 240);
      ctx.fillText('忌：' + f.ji, 24, 275);
      ctx.fillText('幸運色：' + f.color, 24, 320);
      ctx.font = '12px sans-serif';
      ctx.fillStyle = 'rgba(255,255,255,0.7)';
      ctx.fillText('WaTools · 娛樂用途', 24, 390);
    }

    app.querySelector('#vr-fc-go').addEventListener('click', generate);
    app.querySelector('#vr-fc-dl').addEventListener('click', function () {
      if (!lastFortune) generate();
      downloadCanvasPng(canvas, 'fortune-card.png');
    });
    generate();
  }

  /* ——— 16. speech-time-estimator ——— */
  function mountSpeechTimeEstimator(app) {
    prepMount(app);
    app.innerHTML =
      '<section class="vr-card vr-stack">' +
      '  <p class="vr-eyebrow">Speech Timer</p>' +
      '  <p class="vr-lead">演講／簡報時間估算 · 中英混排</p>' +
      '  <label class="vr-label">講稿內容' +
      '    <textarea id="vr-st-text" class="vr-textarea" rows="6" placeholder="貼上講稿…"></textarea></label>' +
      '  <label class="vr-label">語速（字/分）<span id="vr-st-wpm-label">180</span>' +
      '    <input id="vr-st-wpm" class="vr-input" type="range" min="80" max="280" value="180"></label>' +
      '  <div id="vr-st-out" class="vr-stack"></div>' +
      '</section>';

    function countUnits(text) {
      var cn = (text.match(/[\u4e00-\u9fff\u3400-\u4dbf]/g) || []).length;
      var en = (text.match(/[a-zA-Z]+/g) || []).length;
      return { cn: cn, en: en, total: cn + en };
    }

    function render() {
      var text = app.querySelector('#vr-st-text').value;
      var wpm = Number(app.querySelector('#vr-st-wpm').value);
      app.querySelector('#vr-st-wpm-label').textContent = String(wpm);
      var u = countUnits(text);
      var minutes = u.total / wpm;
      var slides = Math.max(1, Math.ceil(minutes * 1.2));
      app.querySelector('#vr-st-out').innerHTML =
        '<div class="vr-result"><div><p class="vr-result-name">估計時間</p>' +
        '<p class="vr-big-num">' + minutes.toFixed(1) + ' 分鐘</p>' +
        '<p class="vr-muted">中文 ' + u.cn + ' 字 · 英文 ' + u.en + ' 詞</p></div></div>' +
        '<div class="vr-result"><div><p class="vr-result-name">建議投影片數</p>' +
        '<p class="vr-result-text">約 ' + slides + ' 張（每張 ~50 秒）</p></div></div>';
    }

    var schedule = bindRafSchedule(app, render);
    app.querySelector('#vr-st-text').addEventListener('input', schedule);
    app.querySelector('#vr-st-wpm').addEventListener('input', schedule);
    render();
  }

  /* ——— 17. video-to-gif ——— */
  function mountVideoToGif(app) {
    prepMount(app);
    app.innerHTML =
      '<section class="vr-card vr-stack">' +
      '  <p class="vr-eyebrow">Video Preview</p>' +
      '  <p class="vr-lead">短片段／動圖預覽 · Canvas 錄製 WebM 或單帧 PNG</p>' +
      '  <label class="vr-label">上傳影片<input id="vr-vg-file" class="vr-input" type="file" accept="video/*"></label>' +
      '  <video id="vr-vg-video" controls style="width:100%;max-height:200px;border-radius:8px" hidden></video>' +
      '  <div class="vr-grid-2">' +
      '    <label class="vr-label">起始（秒）<input id="vr-vg-start" class="vr-input" type="number" step="0.1" value="0"></label>' +
      '    <label class="vr-label">結束（秒）<input id="vr-vg-end" class="vr-input" type="number" step="0.1" value="3"></label>' +
      '  </div>' +
      '  <canvas id="vr-vg-canvas" class="vr-canvas"></canvas>' +
      '  <div class="vr-row">' +
      '    <button type="button" id="vr-vg-play" class="vr-btn">預覽片段</button>' +
      '    <button type="button" id="vr-vg-frame" class="vr-btn vr-btn-emerald">下載目前帧 PNG</button>' +
      '    <button type="button" id="vr-vg-rec" class="vr-btn">錄製 WebM</button>' +
      '  </div>' +
      '  <p id="vr-vg-status" class="vr-muted" role="status"></p>' +
      '</section>';

    var video = app.querySelector('#vr-vg-video');
    var canvas = app.querySelector('#vr-vg-canvas');
    var ctx = canvas.getContext('2d');
    var objectUrl = '';
    var rafId = 0;
    var recorder = null;
    var recChunks = [];

    function setStatus(msg) { app.querySelector('#vr-vg-status').textContent = msg || ''; }

    function drawFrame() {
      if (video.hidden || !video.videoWidth) return;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0);
    }

    function stopPreview() {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = 0;
      video.pause();
    }

    function previewLoop() {
      var start = Number(app.querySelector('#vr-vg-start').value) || 0;
      var end = Number(app.querySelector('#vr-vg-end').value) || 3;
      if (video.currentTime >= end) {
        video.currentTime = start;
      }
      drawFrame();
      rafId = requestAnimationFrame(previewLoop);
    }

    app.querySelector('#vr-vg-file').addEventListener('change', function (e) {
      var f = e.target.files && e.target.files[0];
      if (!f) return;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
      objectUrl = URL.createObjectURL(f);
      video.src = objectUrl;
      video.hidden = false;
      video.onloadedmetadata = function () {
        app.querySelector('#vr-vg-end').value = Math.min(3, video.duration || 3);
        setStatus('已載入 · ' + video.duration.toFixed(1) + ' 秒');
      };
    });

    app.querySelector('#vr-vg-play').addEventListener('click', function () {
      stopPreview();
      var start = Number(app.querySelector('#vr-vg-start').value) || 0;
      video.currentTime = start;
      video.play();
      previewLoop();
    });

    app.querySelector('#vr-vg-frame').addEventListener('click', function () {
      drawFrame();
      downloadCanvasPng(canvas, 'video-frame.png');
    });

    app.querySelector('#vr-vg-rec').addEventListener('click', function () {
      if (!video.videoWidth) { setStatus('請先上傳影片'); return; }
      stopPreview();
      var start = Number(app.querySelector('#vr-vg-start').value) || 0;
      var end = Number(app.querySelector('#vr-vg-end').value) || 3;
      var stream = canvas.captureStream(15);
      recChunks = [];
      try {
        recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
      } catch (err) {
        setStatus('此瀏覽器不支援 MediaRecorder');
        return;
      }
      recorder.ondataavailable = function (e) {
        if (e.data.size) recChunks.push(e.data);
      };
      recorder.onstop = function () {
        var blob = new Blob(recChunks, { type: 'video/webm' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = 'clip-preview.webm';
        a.click();
        setTimeout(function () { URL.revokeObjectURL(url); }, 500);
        setStatus('WebM 已下載（短片段預覽，非標準 GIF）');
      };
      video.currentTime = start;
      video.play();
      recorder.start();
      setStatus('錄製中…');
      var tick = function () {
        drawFrame();
        if (video.currentTime >= end) {
          video.pause();
          recorder.stop();
          if (rafId) cancelAnimationFrame(rafId);
          rafId = 0;
          return;
        }
        rafId = requestAnimationFrame(tick);
      };
      tick();
    });

    onCleanup(app, function () {
      stopPreview();
      if (recorder && recorder.state === 'recording') {
        try { recorder.stop(); } catch (_) { /* ignore */ }
      }
      if (objectUrl) URL.revokeObjectURL(objectUrl);
      video.src = '';
    });
  }

  /* ——— 18. pdf-page-reorder ——— */
  function mountPdfPageReorder(app) {
    prepMount(app);
    app.innerHTML =
      '<section class="vr-card vr-stack">' +
      '  <p class="vr-eyebrow">Page Reorder</p>' +
      '  <p class="vr-lead">請將 PDF 匯出為圖片後上傳 · 調整順序後下載</p>' +
      '  <label class="vr-label">選擇多張圖片<input id="vr-pdf-files" class="vr-input" type="file" accept="image/*" multiple></label>' +
      '  <div id="vr-pdf-list" class="vr-stack"></div>' +
      '  <div class="vr-row">' +
      '    <button type="button" id="vr-pdf-dl-seq" class="vr-btn">逐張下載 PNG</button>' +
      '    <button type="button" id="vr-pdf-dl-merge" class="vr-btn vr-btn-emerald">合併長圖下載</button>' +
      '  </div>' +
      '  <p id="vr-pdf-status" class="vr-muted"></p>' +
      '</section>';

    var pages = [];

    function renderList() {
      var list = app.querySelector('#vr-pdf-list');
      list.replaceChildren();
      pages.forEach(function (p, i) {
        var row = document.createElement('div');
        row.className = 'vr-result';
        var thumb = document.createElement('img');
        thumb.src = p.url;
        thumb.alt = '第 ' + (i + 1) + ' 頁';
        thumb.style.width = '48px';
        thumb.style.height = '48px';
        thumb.style.objectFit = 'cover';
        thumb.style.borderRadius = '6px';
        var label = document.createElement('span');
        label.textContent = '第 ' + (i + 1) + ' 頁 · ' + p.name;
        label.style.flex = '1';
        var up = document.createElement('button');
        up.type = 'button';
        up.className = 'vr-btn vr-btn-emerald';
        up.textContent = '↑';
        up.disabled = i === 0;
        up.addEventListener('click', function () {
          var tmp = pages[i - 1];
          pages[i - 1] = pages[i];
          pages[i] = tmp;
          renderList();
        });
        var down = document.createElement('button');
        down.type = 'button';
        down.className = 'vr-btn vr-btn-emerald';
        down.textContent = '↓';
        down.disabled = i === pages.length - 1;
        down.addEventListener('click', function () {
          var tmp = pages[i + 1];
          pages[i + 1] = pages[i];
          pages[i] = tmp;
          renderList();
        });
        row.append(thumb, label, up, down);
        list.appendChild(row);
      });
    }

    app.querySelector('#vr-pdf-files').addEventListener('change', function (e) {
      pages.forEach(function (p) { URL.revokeObjectURL(p.url); });
      pages = [];
      var files = e.target.files;
      if (!files) return;
      for (var i = 0; i < files.length; i++) {
        pages.push({ name: files[i].name, url: URL.createObjectURL(files[i]), file: files[i] });
      }
      renderList();
      app.querySelector('#vr-pdf-status').textContent = '已載入 ' + pages.length + ' 頁';
    });

    app.querySelector('#vr-pdf-dl-seq').addEventListener('click', function () {
      pages.forEach(function (p, i) {
        setTimeout(function () {
          var a = document.createElement('a');
          a.href = p.url;
          a.download = 'page-' + String(i + 1).padStart(2, '0') + '.png';
          a.click();
        }, i * 300);
      });
    });

    app.querySelector('#vr-pdf-dl-merge').addEventListener('click', function () {
      if (!pages.length) return;
      var imgs = pages.map(function (p) {
        var im = new Image();
        im.src = p.url;
        return im;
      });
      Promise.all(imgs.map(function (im) {
        return im.decode ? im.decode() : new Promise(function (res) { im.onload = res; });
      })).then(function () {
        var w = Math.max.apply(null, imgs.map(function (im) { return im.width; }));
        var h = imgs.reduce(function (s, im) { return s + im.height; }, 0);
        var c = document.createElement('canvas');
        c.width = w; c.height = h;
        var cx = c.getContext('2d');
        var y = 0;
        imgs.forEach(function (im) {
          cx.drawImage(im, 0, y, im.width, im.height);
          y += im.height;
        });
        downloadCanvasPng(c, 'pages-merged.png');
      });
    });

    onCleanup(app, function () {
      pages.forEach(function (p) { URL.revokeObjectURL(p.url); });
      pages = [];
    });
  }

  /* ——— 19. audio-notes-summarizer ——— */
  function mountAudioNotesSummarizer(app) {
    prepMount(app);
    app.innerHTML =
      '<section class="vr-card vr-stack">' +
      '  <p class="vr-eyebrow">Notes AI-lite</p>' +
      '  <p class="vr-lead">逐字稿重點整理 · 啟發式摘要（非雲端 AI）</p>' +
      '  <label class="vr-label">逐字稿' +
      '    <textarea id="vr-an-text" class="vr-textarea" rows="8" placeholder="貼上會議逐字稿…"></textarea></label>' +
      '  <div class="vr-row">' +
      '    <button type="button" id="vr-an-sum" class="vr-btn">整理重點</button>' +
      '    <button type="button" id="vr-an-mic" class="vr-btn vr-btn-emerald">語音輸入</button>' +
      '    <button type="button" id="vr-an-copy" class="vr-btn vr-btn-emerald">複製結果</button>' +
      '  </div>' +
      '  <div id="vr-an-out" class="vr-stack"></div>' +
      '  <p id="vr-an-status" class="vr-muted"></p>' +
      '</section>';

    var recognition = null;
    var listening = false;
    if (global.SpeechRecognition || global.webkitSpeechRecognition) {
      var SR = global.SpeechRecognition || global.webkitSpeechRecognition;
      recognition = new SR();
      recognition.lang = 'zh-TW';
      recognition.continuous = true;
      recognition.interimResults = true;
    } else {
      app.querySelector('#vr-an-mic').disabled = true;
    }

    function summarize(text) {
      var sentences = text.split(/[。！？\n.!?]+/).map(function (s) { return s.trim(); }).filter(function (s) {
        return s.length > 4;
      });
      var key = sentences.filter(function (s) {
        return /重要|決定|待辦|下次|需要|必須|截止|完成|問題|建議|目標|預算|時程/.test(s);
      });
      if (key.length < 3) key = sentences.slice(0, Math.min(5, sentences.length));
      else key = key.slice(0, 8);
      var todos = sentences.filter(function (s) {
        return /待辦|請|記得|要|需|將|負責|follow|TODO/i.test(s);
      }).slice(0, 5);
      return { key: key, todos: todos };
    }

    function renderResult(res) {
      var html = '<div class="vr-result"><div><p class="vr-result-name">重點</p><ul class="vr-muted">';
      res.key.forEach(function (k) { html += '<li>' + escapeHtml(k) + '</li>'; });
      html += '</ul></div></div>';
      html += '<div class="vr-result"><div><p class="vr-result-name">待辦</p><ul class="vr-muted">';
      if (res.todos.length) res.todos.forEach(function (t) { html += '<li>' + escapeHtml(t) + '</li>'; });
      else html += '<li>（未偵測到明確待辦，請手動補充）</li>';
      html += '</ul></div></div>';
      app.querySelector('#vr-an-out').innerHTML = html;
      app.querySelector('#vr-an-out')._export = '【重點】\n' + res.key.map(function (k) { return '• ' + k; }).join('\n') +
        '\n\n【待辦】\n' + (res.todos.length ? res.todos.map(function (t) { return '• ' + t; }).join('\n') : '• —');
    }

    app.querySelector('#vr-an-sum').addEventListener('click', function () {
      var text = app.querySelector('#vr-an-text').value.trim();
      if (!text) { app.querySelector('#vr-an-status').textContent = '請輸入逐字稿'; return; }
      renderResult(summarize(text));
      app.querySelector('#vr-an-status').textContent = '已整理';
    });

    if (recognition) {
      recognition.onresult = function (event) {
        var buf = app.querySelector('#vr-an-text').value;
        for (var i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) buf += event.results[i][0].transcript;
        }
        app.querySelector('#vr-an-text').value = buf;
      };
      recognition.onend = function () {
        listening = false;
        app.querySelector('#vr-an-mic').textContent = '語音輸入';
        app.querySelector('#vr-an-status').textContent = '語音已停止';
      };
      recognition.onerror = function () {
        listening = false;
        app.querySelector('#vr-an-mic').textContent = '語音輸入';
      };
    }

    app.querySelector('#vr-an-mic').addEventListener('click', function () {
      if (!recognition) return;
      if (listening) {
        recognition.stop();
      } else {
        try {
          recognition.start();
          listening = true;
          app.querySelector('#vr-an-mic').textContent = '停止';
          app.querySelector('#vr-an-status').textContent = '聆聽中…';
        } catch (_) { /* ignore */ }
      }
    });

    app.querySelector('#vr-an-copy').addEventListener('click', function () {
      var ex = app.querySelector('#vr-an-out')._export || '';
      copyText(ex, app.querySelector('#vr-an-status'), '已複製');
    });

    onCleanup(app, function () {
      if (recognition && listening) {
        try { recognition.stop(); } catch (_) { /* ignore */ }
      }
    });
  }

  /* ——— 20. link-preview-card ——— */
  function mountLinkPreviewCard(app) {
    prepMount(app);
    app.innerHTML =
      '<section class="vr-card vr-stack">' +
      '  <p class="vr-eyebrow">OG Preview</p>' +
      '  <p class="vr-lead">社群連結預覽卡 · 無遠端抓取</p>' +
      '  <label class="vr-label">網址<input id="vr-og-url" class="vr-input" value="https://example.com"></label>' +
      '  <label class="vr-label">標題<input id="vr-og-title" class="vr-input" value="WaTools 線上工具"></label>' +
      '  <label class="vr-label">描述<textarea id="vr-og-desc" class="vr-textarea" rows="2">免費實用工具集合</textarea></label>' +
      '  <label class="vr-label">預覽圖<input id="vr-og-img" class="vr-input" type="file" accept="image/*"></label>' +
      '  <canvas id="vr-og-canvas" class="vr-canvas" width="480" height="252"></canvas>' +
      '  <button type="button" id="vr-og-dl" class="vr-btn">下載 OG 卡 PNG</button>' +
      '</section>';

    var img = new Image();
    var imgUrl = '';
    var canvas = app.querySelector('#vr-og-canvas');
    var ctx = canvas.getContext('2d');
    var W = 1200;
    var H = 630;

    function render() {
      var off = document.createElement('canvas');
      off.width = W; off.height = H;
      var c = off.getContext('2d');
      c.fillStyle = '#f5f9fc';
      c.fillRect(0, 0, W, H);
      if (img.src) {
        var sc = Math.max(W / img.width, H * 0.55 / img.height);
        var iw = img.width * sc;
        var ih = img.height * sc;
        c.drawImage(img, (W - iw) / 2, 0, iw, Math.min(ih, H * 0.55));
      } else {
        c.fillStyle = '#1977cc';
        c.fillRect(0, 0, W, H * 0.55);
        c.fillStyle = '#fff';
        c.font = '48px sans-serif';
        c.fillText('Preview', 48, H * 0.28);
      }
      c.fillStyle = '#fff';
      c.fillRect(0, H * 0.55, W, H * 0.45);
      var title = app.querySelector('#vr-og-title').value || '';
      var desc = app.querySelector('#vr-og-desc').value || '';
      var url = app.querySelector('#vr-og-url').value || '';
      c.fillStyle = '#2c4964';
      c.font = 'bold 42px "Noto Sans TC", sans-serif';
      c.fillText(title.slice(0, 24), 40, H * 0.55 + 60);
      c.fillStyle = '#6c757d';
      c.font = '28px "Noto Sans TC", sans-serif';
      var d = desc.slice(0, 60);
      c.fillText(d, 40, H * 0.55 + 110);
      c.fillStyle = '#1977cc';
      c.font = '22px sans-serif';
      c.fillText(url.slice(0, 50), 40, H * 0.55 + 160);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(off, 0, 0, canvas.width, canvas.height);
      canvas._full = off;
    }

    app.querySelector('#vr-og-img').addEventListener('change', function (e) {
      var f = e.target.files && e.target.files[0];
      if (!f) return;
      if (imgUrl) URL.revokeObjectURL(imgUrl);
      imgUrl = URL.createObjectURL(f);
      img.onload = render;
      img.src = imgUrl;
    });

    var schedule = bindRafSchedule(app, render);
    ['#vr-og-url', '#vr-og-title', '#vr-og-desc'].forEach(function (s) {
      app.querySelector(s).addEventListener('input', schedule);
    });
    app.querySelector('#vr-og-dl').addEventListener('click', function () {
      render();
      if (canvas._full) downloadCanvasPng(canvas._full, 'og-preview.png');
    });
    onCleanup(app, function () { if (imgUrl) URL.revokeObjectURL(imgUrl); });
    render();
  }

  /* ——— threads-persona-analyzer ——— */
  function mountThreadsPersonaAnalyzer(app) {
    prepMount(app);

    var QUESTIONS = [
      {
        id: 'q1',
        text: '你在脆上看到不爽的言論會？',
        options: [
          { key: 'A', label: '直接開噴，鍵戰到天光', spice: 3, chill: 0, gold: 0 },
          { key: 'B', label: '默默封鎖，眼不見為淨', spice: 0, chill: 3, gold: 1 },
          { key: 'C', label: '截圖公審，讓大家一起評理', spice: 2, chill: 0, gold: 1 }
        ]
      },
      {
        id: 'q2',
        text: '半夜刷到「含金量」貼文時你通常？',
        options: [
          { key: 'A', label: '留言「這篇可收藏」然後轉身忘光', spice: 1, chill: 2, gold: 1 },
          { key: 'B', label: '立刻轉發並加三點職場洞察', spice: 0, chill: 0, gold: 3 },
          { key: 'C', label: '先按讚，再回一句「真的」交差', spice: 0, chill: 3, gold: 0 }
        ]
      },
      {
        id: 'q3',
        text: '有人在你貼文下抬槓，你的最終兵器是？',
        options: [
          { key: 'A', label: '長文反擊＋引用資料來源', spice: 1, chill: 0, gold: 3 },
          { key: 'B', label: '回「好喔」然後已讀不回', spice: 0, chill: 3, gold: 0 },
          { key: 'C', label: '開串戰，順便練打字速度', spice: 3, chill: 0, gold: 0 }
        ]
      }
    ];

    var PERSONAS = {
      spicy: { title: '脆辣重度成癮者', tag: 'SPICY', blurb: '鍵盤溫度偏高，回覆速度比 5G 還快。' },
      chill: { title: '躺平系邊緣脆友', tag: 'CHILL', blurb: '世界很吵，你選擇靜音與滑過去。' },
      gold: { title: '高含金量知識博主', tag: 'GOLD', blurb: '留言區像講座，收藏夾被你養得很好。' },
      hunter: { title: '公審系截圖獵人', tag: 'EVIDENCE', blurb: '證據導向，情緒與條理並存的脆場特務。' }
    };

    var ROASTS = [
      '你的 Threads 活躍度，比公司週報還規律。',
      '同事以為你在加班，其實你在精修回覆語氣。',
      '你的收藏夾叫「以後再看」，目前已堆積成數位化石。',
      '會議中點頭如搗蒜，其實腦內正在構思下一則脆文。',
      '你回覆「哈哈」的次數，足以申請社群外交官。',
      '含金量檢測中…結果顯示：你很會裝忙但也很會看熱鬧。',
      '封鎖名單長度，已接近你的年度 KPI。',
      '你不是社恐，你是「只想在脆上當主角」的選擇性外向。',
      '凌晨兩點還在滑，早上九點卻說自己睡眠品質很好。',
      '你的人設穩定：白天專業、晚上脆上有點危險。',
      '每次說「最後一則」都是謊言，演算法比你更懂你。',
      '你的讚是真心的，但你的「稍後閱讀」是儀式性安慰。'
    ];

    var local = { step: 1, handle: '', answers: {}, result: null };
    app.__waLocal = local;

    function normalizeHandle(raw) {
      return String(raw || '').trim().replace(/^@+/, '').replace(/[^a-zA-Z0-9._]/g, '').slice(0, 30);
    }

    function scoreAnswers() {
      var scores = { spice: 0, chill: 0, gold: 0 };
      QUESTIONS.forEach(function (q) {
        var opt = q.options.find(function (o) { return o.key === local.answers[q.id]; });
        if (!opt) return;
        scores.spice += opt.spice;
        scores.chill += opt.chill;
        scores.gold += opt.gold;
      });
      return scores;
    }

    function pickPersona(scores) {
      if (scores.spice >= 3 && scores.gold >= 2) return PERSONAS.hunter;
      var max = Math.max(scores.spice, scores.chill, scores.gold);
      if (scores.spice === max) return PERSONAS.spicy;
      if (scores.gold === max) return PERSONAS.gold;
      return PERSONAS.chill;
    }

    function pickRoasts(rng, n) {
      var pool = ROASTS.slice();
      var out = [];
      while (out.length < n && pool.length) {
        out.push(pool.splice(Math.floor(rng() * pool.length), 1)[0]);
      }
      return out;
    }

    function goldMeter(scores) {
      var total = (scores.spice + scores.chill + scores.gold) || 1;
      return Math.min(99, Math.max(12, Math.round((scores.gold / total) * 100 + scores.gold * 4)));
    }

    function runAnalyze() {
      var seed = seededHash(local.handle + '|' + QUESTIONS.map(function (q) { return local.answers[q.id] || ''; }).join('') + '|threads');
      var rng = mulberry32(seed);
      var scores = scoreAnswers();
      local.result = {
        handle: local.handle,
        persona: pickPersona(scores),
        scores: scores,
        gold: goldMeter(scores),
        roasts: pickRoasts(rng, 3),
        date: new Date().toISOString().slice(0, 10)
      };
      local.step = 3;
      render();
    }

    function shareText() {
      var result = local.result;
      if (!result) return '';
      var url = location.href.split('#')[0];
      return (
        '我測出 Threads 人格是「' + result.persona.title + '」！含金量 ' + result.gold + '%\n' +
        '→ @' + result.handle + '\n' +
        result.roasts.map(function (line, i) { return (i + 1) + '. ' + line; }).join('\n') + '\n' +
        '你也來測：' + url + '\n#Threads #脆友人格 #KaWaTool'
      );
    }

    /** Pure Canvas 2D export — no html2canvas / external libs. */
    function paintShareCard(result) {
      var W = 840;
      var H = 1120;
      var canvas = document.createElement('canvas');
      canvas.width = W;
      canvas.height = H;
      var ctx = canvas.getContext('2d');
      if (!ctx) return null;

      var grad = ctx.createLinearGradient(0, 0, W, H);
      grad.addColorStop(0, '#0b1220');
      grad.addColorStop(0.48, '#12304f');
      grad.addColorStop(1, '#0f766e');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      var g1 = ctx.createRadialGradient(100, 140, 20, 100, 140, 280);
      g1.addColorStop(0, 'rgba(14,165,164,0.35)');
      g1.addColorStop(1, 'rgba(14,165,164,0)');
      ctx.fillStyle = g1;
      ctx.fillRect(0, 0, W, H);

      var g2 = ctx.createRadialGradient(740, 80, 10, 740, 80, 260);
      g2.addColorStop(0, 'rgba(249,115,22,0.28)');
      g2.addColorStop(1, 'rgba(249,115,22,0)');
      ctx.fillStyle = g2;
      ctx.fillRect(0, 0, W, H);

      ctx.strokeStyle = 'rgba(94,234,212,0.55)';
      ctx.lineWidth = 4;
      roundRect(ctx, 28, 28, W - 56, H - 56, 28);
      ctx.stroke();

      var x = 64;
      var y = 88;
      ctx.fillStyle = 'rgba(255,255,255,0.72)';
      ctx.font = '600 22px "Noto Sans TC", sans-serif';
      ctx.fillText('KaWaTool · Threads 脆友鑑定', x, y);

      y += 52;
      ctx.fillStyle = '#7dd3fc';
      ctx.font = '600 34px "Noto Sans TC", sans-serif';
      ctx.fillText('@' + result.handle, x, y);

      y += 42;
      roundRect(ctx, x, y, 160, 36, 8);
      ctx.fillStyle = '#5eead4';
      ctx.fill();
      ctx.fillStyle = '#0b1220';
      ctx.font = '700 18px "Noto Sans TC", sans-serif';
      ctx.fillText(result.persona.tag, x + 16, y + 25);

      y += 78;
      ctx.fillStyle = '#fff';
      ctx.font = '800 52px "Noto Sans TC", sans-serif';
      wrapCanvasText(ctx, result.persona.title, W - 128).forEach(function (line) {
        ctx.fillText(line, x, y);
        y += 60;
      });

      y += 8;
      ctx.fillStyle = 'rgba(255,255,255,0.82)';
      ctx.font = '400 26px "Noto Sans TC", sans-serif';
      wrapCanvasText(ctx, result.persona.blurb, W - 128).forEach(function (line) {
        ctx.fillText(line, x, y);
        y += 36;
      });

      y += 28;
      roundRect(ctx, x, y, W - 128, 88, 16);
      ctx.fillStyle = 'rgba(255,255,255,0.1)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.16)';
      ctx.lineWidth = 2;
      roundRect(ctx, x, y, W - 128, 88, 16);
      ctx.stroke();
      ctx.fillStyle = 'rgba(255,255,255,0.78)';
      ctx.font = '500 24px "Noto Sans TC", sans-serif';
      ctx.fillText('含金量', x + 28, y + 54);
      ctx.fillStyle = '#fde68a';
      ctx.font = '800 40px "Noto Sans TC", sans-serif';
      var goldLabel = result.gold + '%';
      ctx.fillText(goldLabel, x + (W - 128) - 28 - ctx.measureText(goldLabel).width, y + 58);

      y += 130;
      ctx.fillStyle = 'rgba(255,255,255,0.9)';
      ctx.font = '400 24px "Noto Sans TC", sans-serif';
      result.roasts.forEach(function (roast, idx) {
        var lines = wrapCanvasText(ctx, (idx + 1) + '. ' + roast, W - 140);
        lines.forEach(function (line) {
          ctx.fillText(line, x, y);
          y += 34;
        });
        y += 14;
      });

      ctx.fillStyle = 'rgba(255,255,255,0.55)';
      ctx.font = '400 20px "Noto Sans TC", sans-serif';
      ctx.fillText(result.date + ' · 純前端娛樂結果', x, H - 64);

      return canvas;
    }

    function downloadShareCard() {
      var toast = app.querySelector('#vr-th-toast');
      var btn = app.querySelector('#vr-th-dl');
      if (!local.result) return;
      if (toast) toast.textContent = '正在產生圖卡…';
      if (btn) btn.disabled = true;

      try {
        var canvas = paintShareCard(local.result);
        if (!canvas) throw new Error('canvas');
        canvas.toBlob(function (blob) {
          if (btn) btn.disabled = false;
          if (!blob) {
            if (toast) toast.textContent = '圖卡產生失敗';
            return;
          }
          var url = URL.createObjectURL(blob);
          var a = document.createElement('a');
          a.href = url;
          a.download = 'threads-persona-' + local.result.handle + '.png';
          a.click();
          setTimeout(function () { URL.revokeObjectURL(url); }, 800);
          if (toast) toast.textContent = '已下載分享圖卡 PNG';
        }, 'image/png');
      } catch (err) {
        if (btn) btn.disabled = false;
        if (toast) toast.textContent = '圖卡產生失敗，請再試一次';
      }
    }

    function renderStep1() {
      app.innerHTML =
        '<section class="vr-card vr-stack">' +
        '  <p class="vr-eyebrow">Threads Persona</p>' +
        '  <p class="vr-lead">脆友社交人格與含金量分析器 · 純娛樂不連後端</p>' +
        '  <label class="vr-label">Threads 帳號 ID' +
        '    <input id="vr-th-id" class="vr-input" type="text" maxlength="30" placeholder="例如：kawa_tool（不用加 @）" autocomplete="username" value="' + escapeHtml(local.handle) + '">' +
        '  </label>' +
        '  <p class="vr-muted">僅用於結果卡顯示，不會查詢或上傳任何帳號資料。</p>' +
        '  <button type="button" id="vr-th-next" class="vr-btn">下一步：回答三題</button>' +
        '</section>';

      app.querySelector('#vr-th-next').addEventListener('click', function () {
        var id = normalizeHandle(app.querySelector('#vr-th-id').value);
        if (!id) {
          app.querySelector('#vr-th-id').focus();
          return;
        }
        local.handle = id;
        local.step = 2;
        render();
      });
    }

    function renderStep2() {
      var qHtml = QUESTIONS.map(function (q, qi) {
        var opts = q.options.map(function (o) {
          var checked = local.answers[q.id] === o.key ? ' checked' : '';
          return (
            '<label class="vr-th-option">' +
            '  <input type="radio" name="' + q.id + '" value="' + o.key + '"' + checked + '>' +
            '  <span><strong>' + o.key + '.</strong> ' + escapeHtml(o.label) + '</span>' +
            '</label>'
          );
        }).join('');
        return (
          '<fieldset class="vr-th-q">' +
          '  <legend>Q' + (qi + 1) + '. ' + escapeHtml(q.text) + '</legend>' +
          opts +
          '</fieldset>'
        );
      }).join('');

      app.innerHTML =
        '<section class="vr-card vr-stack">' +
        '  <p class="vr-eyebrow">Step 2 / 3 · @' + escapeHtml(local.handle) + '</p>' +
        '  <p class="vr-lead">三題幽默選擇 · 決定你的脆場人設</p>' +
        qHtml +
        '  <p id="vr-th-warn" class="vr-toast" hidden></p>' +
        '  <div class="vr-row">' +
        '    <button type="button" id="vr-th-back" class="vr-btn vr-btn-emerald">上一步</button>' +
        '    <button type="button" id="vr-th-analyze" class="vr-btn">產生分析結果</button>' +
        '  </div>' +
        '</section>';

      QUESTIONS.forEach(function (q) {
        app.querySelectorAll('input[name="' + q.id + '"]').forEach(function (inp) {
          inp.addEventListener('change', function () { local.answers[q.id] = inp.value; });
        });
      });

      app.querySelector('#vr-th-back').addEventListener('click', function () {
        local.step = 1;
        render();
      });

      app.querySelector('#vr-th-analyze').addEventListener('click', function () {
        var ok = QUESTIONS.every(function (q) { return !!local.answers[q.id]; });
        var warn = app.querySelector('#vr-th-warn');
        if (!ok) {
          warn.hidden = false;
          warn.textContent = '請先完成三題再分析。';
          return;
        }
        runAnalyze();
      });
    }

    function renderStep3() {
      var r = local.result;
      var roastLis = r.roasts.map(function (line) {
        return '<li>' + escapeHtml(line) + '</li>';
      }).join('');

      app.innerHTML =
        '<section class="vr-card vr-stack">' +
        '  <p class="vr-eyebrow">Your Threads Report</p>' +
        '  <p class="vr-lead">分析完成 · 下載圖卡去脆上炫耀</p>' +
        '  <div id="vr-th-share-card" class="vr-th-share-card">' +
        '    <div class="vr-th-share-card__inner">' +
        '      <p class="vr-th-share-card__brand">KaWaTool · Threads 脆友鑑定</p>' +
        '      <p class="vr-th-share-card__handle">@' + escapeHtml(r.handle) + '</p>' +
        '      <p class="vr-th-share-card__tag">' + escapeHtml(r.persona.tag) + '</p>' +
        '      <p class="vr-th-share-card__title">' + escapeHtml(r.persona.title) + '</p>' +
        '      <p class="vr-th-share-card__blurb">' + escapeHtml(r.persona.blurb) + '</p>' +
        '      <div class="vr-th-share-card__meter"><span>含金量</span><strong>' + r.gold + '%</strong></div>' +
        '      <ol class="vr-th-share-card__roasts">' + roastLis + '</ol>' +
        '      <p class="vr-th-share-card__foot">' + escapeHtml(r.date) + ' · 純前端娛樂結果</p>' +
        '    </div>' +
        '  </div>' +
        '  <div class="vr-row">' +
        '    <button type="button" id="vr-th-dl" class="vr-btn">下載分享圖卡</button>' +
        '    <button type="button" id="vr-th-copy" class="vr-btn vr-btn-emerald">複製成果網址</button>' +
        '  </div>' +
        '  <button type="button" id="vr-th-retry" class="vr-btn vr-btn-rose">再測一次</button>' +
        '  <p id="vr-th-toast" class="vr-toast"></p>' +
        '  <p class="vr-muted">※ 結果由選擇權重＋種子亂數產生，僅供娛樂，與真實帳號無關。圖卡以原生 Canvas 匯出。</p>' +
        '</section>';

      app.querySelector('#vr-th-dl').addEventListener('click', downloadShareCard);
      app.querySelector('#vr-th-copy').addEventListener('click', function () {
        copyText(shareText(), app.querySelector('#vr-th-toast'), '已複製！可直接貼到 Threads');
      });
      app.querySelector('#vr-th-retry').addEventListener('click', function () {
        local.answers = {};
        local.result = null;
        local.step = 1;
        render();
      });
    }

    function render() {
      if (local.step === 1) renderStep1();
      else if (local.step === 2) renderStep2();
      else renderStep3();
    }

    render();
  }

  /* ——— exports ——— */
  var mounts = {
    'invoice-checker': mountInvoiceChecker,
    'mortgage-calculator': mountMortgageCalculator,
    'income-tax-estimator': mountIncomeTaxEstimator,
    'overtime-leave-calculator': mountOvertimeLeaveCalculator,
    'labor-health-insurance': mountLaborHealthInsurance,
    'ig-grid-splitter': mountIgGridSplitter,
    'chat-screenshot-maker': mountChatScreenshotMaker,
    'avatar-safe-zone': mountAvatarSafeZone,
    'resume-photo-spec': mountResumePhotoSpec,
    'youtube-thumbnail-factory': mountYoutubeThumbnailFactory,
    'hashtag-organizer': mountHashtagOrganizer,
    'llm-api-cost-calculator': mountLlmApiCostCalculator,
    'meeting-cost-calculator': mountMeetingCostCalculator,
    'gpa-calculator': mountGpaCalculator,
    'vehicle-loan-calculator': mountVehicleLoanCalculator,
    'daily-fortune-card': mountDailyFortuneCard,
    'speech-time-estimator': mountSpeechTimeEstimator,
    'video-to-gif': mountVideoToGif,
    'pdf-page-reorder': mountPdfPageReorder,
    'audio-notes-summarizer': mountAudioNotesSummarizer,
    'threads-persona-analyzer': mountThreadsPersonaAnalyzer,
    'link-preview-card': mountLinkPreviewCard
  };
  global.WA_MOUNT_VIRAL = Object.assign(global.WA_MOUNT_VIRAL || {}, mounts);

})(typeof window !== 'undefined' ? window : this);
