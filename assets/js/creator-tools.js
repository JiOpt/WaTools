/**
 * Creator category tools — mount into #tool-app (WaTools shell).
 * Exports: window.WA_MOUNT_CREATOR[slug](app)
 */
(function (global) {
  'use strict';

  /* ——— shared helpers ——— */

  var CREATOR_CSS_VER = 'cr-bright-2';

  function creatorCssHref() {
    // Prefer site URL helper (works for cleanUrls and nested paths)
    if (global.WA_TOOL_URLS && typeof global.WA_TOOL_URLS.absolutePageHref === 'function') {
      return global.WA_TOOL_URLS.absolutePageHref('assets/css/creator-tools.css') + '?v=' + CREATOR_CSS_VER;
    }
    var path = String(location.pathname || '').replace(/\\/g, '/');
    // /creator/slug or /creator/slug.html → one level up
    if (/\/creator(\/|$)/i.test(path)) {
      return '../assets/css/creator-tools.css?v=' + CREATOR_CSS_VER;
    }
    return 'assets/css/creator-tools.css?v=' + CREATOR_CSS_VER;
  }

  function ensureCreatorCss() {
    var key = 'wa-creator-css';
    var href;
    try {
      href = new URL(creatorCssHref(), location.href).href;
    } catch (e) {
      href = creatorCssHref();
    }
    var existing = document.querySelector('link[data-wa-key="' + key + '"]');
    if (existing) {
      // Force refresh if path/version changed (cleanUrl depth bug / theme update)
      if (existing.getAttribute('href') !== href) existing.href = href;
      return;
    }
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.setAttribute('data-wa-key', key);
    document.head.appendChild(link);
  }

  /** Immediate bright fallback so UI never stays dark if CSS 404s */
  function ensureBrightInline() {
    if (document.getElementById('wa-creator-inline')) return;
    var style = document.createElement('style');
    style.id = 'wa-creator-inline';
    style.textContent = [
      '.tool-app.wa-creator{color:#444;background:transparent!important;padding:0!important;border-radius:0!important}',
      '.wa-creator .cr-card{background:#fff!important;border:1px solid rgba(25,119,204,.22)!important;border-radius:12px;padding:1.15rem 1.2rem;box-shadow:0 4px 18px rgba(41,99,160,.06)}',
      '.wa-creator .cr-eyebrow{color:#1977cc!important;font-size:.72rem;letter-spacing:.14em;text-transform:uppercase;font-weight:600;margin:0 0 .35rem}',
      '.wa-creator .cr-lead,.wa-creator .cr-muted{color:#6c757d!important}',
      '.wa-creator .cr-label{color:#2c4964!important;font-weight:500}',
      '.wa-creator .cr-input,.wa-creator .cr-textarea,.wa-creator .cr-select{background:#fff!important;color:#444!important;border:1px solid rgba(25,119,204,.28)!important;border-radius:8px;padding:.6rem .85rem;width:100%}',
      '.wa-creator .cr-btn{background:#1977cc!important;color:#fff!important;border:none!important;border-radius:8px;padding:.6rem 1rem;cursor:pointer}',
      '.wa-creator .cr-btn-emerald{background:#eaf4fc!important;color:#1977cc!important;border:1px solid rgba(25,119,204,.35)!important}',
      '.wa-creator .cr-btn-rose{background:#fff5f7!important;color:#e11d48!important;border:1px solid rgba(225,29,72,.3)!important}',
      '.wa-creator .cr-drop{background:#f5f9fc!important;border:1px dashed rgba(25,119,204,.4)!important;border-radius:12px;padding:1.75rem 1rem;text-align:center;cursor:pointer;color:#2c4964!important}',
      '.wa-creator .cr-result{background:#f5f9fc!important;border:1px solid rgba(25,119,204,.22)!important;border-radius:10px;padding:.75rem .9rem}',
      '.wa-creator .cr-result-name{color:#1977cc!important}',
      '.wa-creator .cr-result-text,.wa-creator .cr-password{color:#2c4964!important}',
      '.wa-creator .cr-chip{background:#fff!important;color:#2c4964!important;border:1px solid rgba(25,119,204,.25)!important;border-radius:999px;padding:.4rem .85rem;cursor:pointer}',
      '.wa-creator .cr-chip.is-on{background:#eaf4fc!important;color:#1977cc!important;border-color:#1977cc!important;font-weight:600}',
      '.wa-creator .cr-canvas,.wa-creator .cr-preview-box{background:#f5f9fc!important;border:1px solid rgba(25,119,204,.22)!important;border-radius:12px}',
      '.wa-creator .cr-toast{color:#0d9488!important}',
      '.wa-creator #cr-md-preview{background:#f5f9fc!important;color:#444!important;border:1px solid rgba(25,119,204,.22)!important;border-radius:10px;padding:.85rem 1rem}',
      '.wa-creator #cr-md-preview a{color:#1977cc!important}'
    ].join('');
    document.head.appendChild(style);
  }

  function cleanupFns(app) {
    var list = app.__waCrCleanup || [];
    list.forEach(function (fn) {
      try { fn(); } catch (e) { /* ignore */ }
    });
    app.__waCrCleanup = [];
  }

  function onCleanup(app, fn) {
    if (!app.__waCrCleanup) app.__waCrCleanup = [];
    app.__waCrCleanup.push(fn);
  }

  function prepMount(app) {
    cleanupFns(app);
    ensureBrightInline();
    ensureCreatorCss();
    app.className = 'tool-app wa-creator';
    app.replaceChildren();
    // Revoke URLs / stop timers when leaving the page
    var onHide = function () { cleanupFns(app); };
    global.addEventListener('pagehide', onHide);
    onCleanup(app, function () {
      global.removeEventListener('pagehide', onHide);
    });
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

  /* ——— QR encoder (byte mode, ECC M, v1–10) ——— */
  var QR = (function () {
    var ECC_M = [
      [1, 16, 10, 0, 0], [1, 28, 16, 0, 0], [1, 44, 26, 0, 0],
      [2, 32, 18, 0, 0], [2, 43, 24, 0, 0], [4, 27, 16, 0, 0],
      [4, 31, 18, 0, 0], [2, 38, 22, 2, 39], [3, 36, 22, 2, 37],
      [4, 43, 26, 2, 44]
    ];
    var ALIGN_POS = [
      null, null, [6, 18], [6, 22], [6, 26], [6, 30], [6, 34],
      [6, 22, 38], [6, 24, 42], [6, 26, 46], [6, 28, 50]
    ];
    var EXP = new Uint8Array(512);
    var LOG = new Uint8Array(256);
    (function initGF() {
      var x = 1;
      for (var i = 0; i < 255; i++) {
        EXP[i] = x;
        LOG[x] = i;
        x <<= 1;
        if (x & 0x100) x ^= 0x11d;
      }
      for (var j = 255; j < 512; j++) EXP[j] = EXP[j - 255];
    })();

    function gfMul(a, b) {
      if (a === 0 || b === 0) return 0;
      return EXP[LOG[a] + LOG[b]];
    }

    function rsGenerator(ecLen) {
      var poly = [1];
      for (var i = 0; i < ecLen; i++) {
        var next = new Array(poly.length + 1).fill(0);
        for (var j = 0; j < poly.length; j++) {
          next[j] ^= poly[j];
          next[j + 1] ^= gfMul(poly[j], EXP[i]);
        }
        poly = next;
      }
      return poly;
    }

    function rsEncode(data, ecLen) {
      var gen = rsGenerator(ecLen);
      var res = data.concat(new Array(ecLen).fill(0));
      for (var i = 0; i < data.length; i++) {
        var coef = res[i];
        if (!coef) continue;
        for (var j = 0; j < gen.length; j++) res[i + j] ^= gfMul(gen[j], coef);
      }
      return res.slice(data.length);
    }

    function dataCapacity(version) {
      var row = ECC_M[version - 1];
      var totalData = row[0] * row[1] + row[3] * row[4];
      var countBits = version <= 9 ? 8 : 16;
      return Math.floor((totalData * 8 - 4 - countBits) / 8);
    }

    function chooseVersion(byteLen) {
      for (var v = 1; v <= 10; v++) {
        if (dataCapacity(v) >= byteLen) return v;
      }
      return 0;
    }

    function encodeData(bytes, version) {
      var row = ECC_M[version - 1];
      var totalData = row[0] * row[1] + row[3] * row[4];
      var bits = [];
      function put(val, len) {
        for (var i = len - 1; i >= 0; i--) bits.push((val >>> i) & 1);
      }
      put(0b0100, 4);
      put(bytes.length, version <= 9 ? 8 : 16);
      for (var b = 0; b < bytes.length; b++) put(bytes[b], 8);
      var maxBits = totalData * 8;
      put(0, Math.min(4, maxBits - bits.length));
      while (bits.length % 8 !== 0) bits.push(0);
      var data = [];
      for (var i = 0; i < bits.length; i += 8) {
        var byte = 0;
        for (var j = 0; j < 8; j++) byte = (byte << 1) | (bits[i + j] || 0);
        data.push(byte);
      }
      var pads = [0xec, 0x11];
      var p = 0;
      while (data.length < totalData) data.push(pads[p++ % 2]);
      return data;
    }

    function interleave(data, version) {
      var row = ECC_M[version - 1];
      var g1 = row[0], d1 = row[1], e = row[2], g2 = row[3], d2 = row[4];
      var blocks = [];
      var off = 0;
      for (var i = 0; i < g1; i++) {
        var chunk = data.slice(off, off + d1);
        off += d1;
        blocks.push({ d: chunk, e: rsEncode(chunk, e) });
      }
      for (var k = 0; k < g2; k++) {
        var chunk2 = data.slice(off, off + d2);
        off += d2;
        blocks.push({ d: chunk2, e: rsEncode(chunk2, e) });
      }
      var out = [];
      var maxD = Math.max(d1, d2 || 0);
      for (var m = 0; m < maxD; m++) {
        for (var b = 0; b < blocks.length; b++) {
          if (m < blocks[b].d.length) out.push(blocks[b].d[m]);
        }
      }
      for (var ei = 0; ei < e; ei++) {
        for (var bi = 0; bi < blocks.length; bi++) out.push(blocks[bi].e[ei]);
      }
      return out;
    }

    function moduleCount(version) {
      return 21 + (version - 1) * 4;
    }

    function buildMatrix(version, codewords) {
      var size = moduleCount(version);
      var mat = Array.from({ length: size }, function () { return Array(size).fill(null); });
      var reserved = Array.from({ length: size }, function () { return Array(size).fill(false); });

      function mark(x, y, v) {
        mat[y][x] = v;
        reserved[y][x] = true;
      }

      function finder(ox, oy) {
        for (var y = 0; y < 7; y++) {
          for (var x = 0; x < 7; x++) {
            var edge = x === 0 || x === 6 || y === 0 || y === 6;
            var center = x >= 2 && x <= 4 && y >= 2 && y <= 4;
            mark(ox + x, oy + y, edge || center ? 1 : 0);
          }
        }
        for (var i = -1; i <= 7; i++) {
          for (var j = -1; j <= 7; j++) {
            var px = ox + j;
            var py = oy + i;
            if (px < 0 || py < 0 || px >= size || py >= size) continue;
            if (mat[py][px] === null) mark(px, py, 0);
          }
        }
      }

      finder(0, 0);
      finder(size - 7, 0);
      finder(0, size - 7);

      for (var ti = 8; ti < size - 8; ti++) {
        mark(ti, 6, ti % 2 === 0 ? 1 : 0);
        mark(6, ti, ti % 2 === 0 ? 1 : 0);
      }
      mark(8, size - 8, 1);

      var ap = ALIGN_POS[version];
      if (ap) {
        for (var ai = 0; ai < ap.length; ai++) {
          for (var aj = 0; aj < ap.length; aj++) {
            var cx = ap[aj];
            var cy = ap[ai];
            if ((cx <= 8 && cy <= 8) || (cx >= size - 9 && cy <= 8) || (cx <= 8 && cy >= size - 9)) continue;
            for (var dy = -2; dy <= 2; dy++) {
              for (var dx = -2; dx <= 2; dx++) {
                var mm = Math.max(Math.abs(dx), Math.abs(dy));
                mark(cx + dx, cy + dy, mm === 2 || mm === 0 ? 1 : 0);
              }
            }
          }
        }
      }

      for (var ri = 0; ri < 9; ri++) {
        if (ri !== 6) {
          if (!reserved[8][ri]) reserved[8][ri] = true;
          if (!reserved[ri][8]) reserved[ri][8] = true;
        }
      }
      for (var fi = 0; fi < 8; fi++) {
        reserved[8][size - 1 - fi] = true;
        reserved[size - 1 - fi][8] = true;
      }

      var bits = [];
      for (var ci = 0; ci < codewords.length; ci++) {
        for (var cb = 7; cb >= 0; cb--) bits.push((codewords[ci] >> cb) & 1);
      }
      var remBits = [0, 7, 7, 7, 7, 7, 0, 0, 0, 0][version - 1];
      for (var rb = 0; rb < remBits; rb++) bits.push(0);

      var bi = 0;
      var upward = true;
      for (var col = size - 1; col > 0; col -= 2) {
        if (col === 6) col--;
        for (var row = 0; row < size; row++) {
          var yy = upward ? size - 1 - row : row;
          for (var kk = 0; kk < 2; kk++) {
            var xx = col - kk;
            if (reserved[yy][xx] || mat[yy][xx] !== null) continue;
            var v = bits[bi++] || 0;
            if (((yy + xx) % 2) === 0) v ^= 1;
            mat[yy][xx] = v;
          }
        }
        upward = !upward;
      }

      var format = 0b000;
      var fmt = format << 10;
      for (var hi = 14; hi >= 10; hi--) {
        if ((fmt >> hi) & 1) fmt ^= 0x537 << (hi - 10);
      }
      fmt = ((format << 10) | fmt) ^ 0x5412;

      var horiz = [[0, 8], [1, 8], [2, 8], [3, 8], [4, 8], [5, 8], [7, 8], [8, 8], [8, 7], [8, 5], [8, 4], [8, 3], [8, 2], [8, 1], [8, 0]];
      var other = [
        [size - 1, 8], [size - 2, 8], [size - 3, 8], [size - 4, 8], [size - 5, 8], [size - 6, 8], [size - 7, 8],
        [8, size - 8], [8, size - 7], [8, size - 6], [8, size - 5], [8, size - 4], [8, size - 3], [8, size - 2], [8, size - 1]
      ];
      for (var pi = 0; pi < 15; pi++) {
        var bit = (fmt >> (14 - pi)) & 1;
        mat[horiz[pi][1]][horiz[pi][0]] = bit;
        mat[other[pi][1]][other[pi][0]] = bit;
      }

      for (var y = 0; y < size; y++) {
        for (var x = 0; x < size; x++) {
          if (mat[y][x] === null) mat[y][x] = 0;
        }
      }
      return mat;
    }

    function encode(text) {
      var bytes = Array.from(new TextEncoder().encode(text));
      var version = chooseVersion(bytes.length);
      if (!version) throw new Error('內容過長（請縮短文字）');
      var data = encodeData(bytes, version);
      var codewords = interleave(data, version);
      return buildMatrix(version, codewords);
    }

    return { encode: encode };
  })();

  /* ——— markdown converter ——— */
  function escapeHtml(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function mdToHtml(src) {
    var lines = src.replace(/\r\n/g, '\n').split('\n');
    var html = [];
    var inUl = false;
    var inOl = false;
    var inCode = false;
    var codeBuf = [];

    function closeLists() {
      if (inUl) { html.push('</ul>'); inUl = false; }
      if (inOl) { html.push('</ol>'); inOl = false; }
    }

    function inlineFormat(text) {
      var t = escapeHtml(text);
      t = t.replace(/`([^`]+)`/g, '<code>$1</code>');
      t = t.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
      t = t.replace(/\*([^*]+)\*/g, '<em>$1</em>');
      t = t.replace(/\[([^\]]+)\]\((https?:[^)\s]+)\)/g, '<a href="$2" rel="noopener noreferrer">$1</a>');
      return t;
    }

    for (var i = 0; i < lines.length; i++) {
      var line = lines[i];

      if (line.startsWith('```')) {
        if (inCode) {
          html.push('<pre><code>' + escapeHtml(codeBuf.join('\n')) + '</code></pre>');
          codeBuf = [];
          inCode = false;
        } else {
          closeLists();
          inCode = true;
        }
        continue;
      }
      if (inCode) { codeBuf.push(line); continue; }

      var h = line.match(/^(#{1,3})\s+(.+)$/);
      if (h) {
        closeLists();
        var level = h[1].length;
        html.push('<h' + level + '>' + inlineFormat(h[2]) + '</h' + level + '>');
        continue;
      }

      if (/^>\s?/.test(line)) {
        closeLists();
        html.push('<blockquote><p>' + inlineFormat(line.replace(/^>\s?/, '')) + '</p></blockquote>');
        continue;
      }

      if (/^[-*]\s+/.test(line)) {
        if (inOl) { html.push('</ol>'); inOl = false; }
        if (!inUl) { html.push('<ul>'); inUl = true; }
        html.push('<li>' + inlineFormat(line.replace(/^[-*]\s+/, '')) + '</li>');
        continue;
      }

      if (/^\d+\.\s+/.test(line)) {
        if (inUl) { html.push('</ul>'); inUl = false; }
        if (!inOl) { html.push('<ol>'); inOl = true; }
        html.push('<li>' + inlineFormat(line.replace(/^\d+\.\s+/, '')) + '</li>');
        continue;
      }

      if (line.trim() === '') {
        closeLists();
        continue;
      }

      closeLists();
      html.push('<p>' + inlineFormat(line) + '</p>');
    }
    closeLists();
    if (inCode) html.push('<pre><code>' + escapeHtml(codeBuf.join('\n')) + '</code></pre>');
    return html.join('\n');
  }

  /* ——— 1. ig-font-generator ——— */
  function mountIgFontGenerator(app) {
    prepMount(app);
    app.innerHTML =
      '<section class="cr-card cr-stack">' +
      '  <p class="cr-eyebrow">Instagram Tools</p>' +
      '  <p class="cr-lead">純前端 Unicode 映射 · 一秒轉換 · 一鍵複製</p>' +
      '  <label class="cr-label">輸入英文／數字文字' +
      '    <textarea id="cr-ig-input" class="cr-textarea" rows="3" maxlength="280" placeholder="Type something cool..."></textarea>' +
      '  </label>' +
      '  <div id="cr-ig-results" class="cr-stack" aria-live="polite"></div>' +
      '  <p id="cr-ig-toast" class="cr-toast" role="status"></p>' +
      '</section>';

    var STYLES = [
      { name: '粗體', map: buildFontMap('𝗔𝗕𝗖𝗗𝗘𝗙𝗚𝗛𝗜𝗝𝗞𝗟𝗠𝗡𝗢𝗣𝗤𝗥𝗦𝗧𝗨𝗩𝗪𝗫𝗬𝗭', '𝗮𝗯𝗰𝗱𝗲𝗳𝗴𝗵𝗶𝗷𝗸𝗹𝗺𝗻𝗼𝗽𝗾𝗿𝘀𝘁𝘂𝘃𝘄𝘅𝘆𝘇', '𝟬𝟭𝟮𝟯𝟰𝟱𝟲𝟳𝟴𝟵') },
      { name: '斜體', map: buildFontMap('𝘈𝘉𝘊𝘋𝘌𝘍𝘎𝘏𝘐𝘑𝘒𝘓𝘔𝘕𝘖𝘗𝘘𝘙𝘚𝘛𝘜𝘝𝘞𝘟𝘠𝘡', '𝘢𝘣𝘤𝘥𝘦𝘧𝘨𝘩𝘪𝘫𝘬𝘭𝘮𝘯𝘰𝘱𝘲𝘳𝘴𝘵𝘶𝘷𝘸𝘹𝘺𝘻', null) },
      { name: '粗斜體', map: buildFontMap('𝘼𝘽𝘾𝘿𝙀𝙁𝙂𝙃𝙄𝙅𝙆𝙇𝙈𝙉𝙊𝙋𝙌𝙍𝙎𝙏𝙐𝙑𝙒𝙓𝙔𝙕', '𝙖𝙗𝙘𝙙𝙚𝙛𝙜𝙝𝙞𝙟𝙠𝙡𝙢𝙣𝙤𝙥𝙦𝙧𝙨𝙩𝙪𝙫𝙬𝙭𝙮𝙯', null) },
      { name: '空心', map: buildFontMap('𝔸𝔹ℂ𝔻𝔼𝔽𝔾ℍ𝕀𝕁𝕂𝕃𝕄ℕ𝕆ℙℚℝ𝕊𝕋𝕌𝕍𝕎𝕏𝕐ℤ', '𝕒𝕓𝕔𝕕𝕖𝕗𝕘𝕙𝕚𝕛𝕜𝕝𝕞𝕟𝕠𝕡𝕢𝕣𝕤𝕥𝕦𝕧𝕨𝕩𝕪𝕫', '𝟘𝟙𝟚𝟛𝟜𝟝𝟞𝟟𝟠𝟡') },
      { name: '手寫', map: buildFontMap('𝒜𝐵𝒞𝒟𝐸𝐹𝒢𝐻𝐼𝒥𝒦𝐿𝑀𝒩𝒪𝒫𝒬𝑅𝒮𝒯𝒰𝒱𝒲𝒳𝒴𝒵', '𝒶𝒷𝒸𝒹𝑒𝒻𝑔𝒽𝒾𝒿𝓀𝓁𝓂𝓃𝑜𝓅𝓆𝓇𝓈𝓉𝓊𝓋𝓌𝓍𝓎𝓏', null) },
      { name: '等寬', map: buildFontMap('𝙰𝙱𝙲𝙳𝙴𝙵𝙶𝙷𝙸𝙹𝙺𝙻𝙼𝙽𝙾𝙿𝚀𝚁𝚂𝚃𝚄𝚅𝚆𝚇𝚈𝚉', '𝚊𝚋𝚌𝚍𝚎𝚏𝚐𝚑𝚒𝚓𝚔𝚕𝚖𝚗𝚘𝚙𝚚𝚛𝚜𝚝𝚞𝚟𝚠𝚡𝚢𝚣', '𝟶𝟷𝟸𝟹𝟺𝟻𝟼𝟽𝟾𝟿') },
      { name: '小型大寫', map: buildFontMap('ᴀʙᴄᴅᴇꜰɢʜɪᴊᴋʟᴍɴᴏᴘǫʀꜱᴛᴜᴠᴡxʏᴢ', 'ᴀʙᴄᴅᴇꜰɢʜɪᴊᴋʟᴍɴᴏᴘǫʀꜱᴛᴜᴠᴡxʏᴢ', null) },
      { name: '全形', map: null }
    ];

    function buildFontMap(upper, lower, digits) {
      var m = Object.create(null);
      var U = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      var L = 'abcdefghijklmnopqrstuvwxyz';
      var D = '0123456789';
      for (var i = 0; i < 26; i++) {
        m[U[i]] = [...upper][i] || U[i];
        m[L[i]] = [...lower][i] || L[i];
      }
      if (digits) {
        var dig = [...digits];
        for (var j = 0; j < 10; j++) m[D[j]] = dig[j] || D[j];
      }
      return m;
    }

    function convert(text, style) {
      if (style.name === '全形') {
        return [...text].map(function (ch) {
          var c = ch.charCodeAt(0);
          if (c === 32) return '\u3000';
          if (c >= 33 && c <= 126) return String.fromCharCode(c + 0xFEE0);
          return ch;
        }).join('');
      }
      var map = style.map;
      return [...text].map(function (ch) { return map[ch] || ch; }).join('');
    }

    var input = app.querySelector('#cr-ig-input');
    var results = app.querySelector('#cr-ig-results');
    var toast = app.querySelector('#cr-ig-toast');
    var toastTimer = 0;

    function render() {
      var raw = input.value;
      var frag = document.createDocumentFragment();
      STYLES.forEach(function (style) {
        var out = convert(raw || 'Preview', style);
        var row = document.createElement('div');
        row.className = 'cr-result';
        var meta = document.createElement('div');
        meta.style.flex = '1';
        meta.style.minWidth = '0';
        var name = document.createElement('p');
        name.className = 'cr-result-name';
        name.textContent = style.name;
        var text = document.createElement('p');
        text.className = 'cr-result-text';
        text.textContent = out;
        meta.append(name, text);
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'cr-btn';
        btn.textContent = '複製';
        btn.addEventListener('click', function () {
          copyText(out, toast, '已複製到剪貼簿').then(function () {
            btn.textContent = '已複製';
            btn.classList.add('cr-btn-emerald');
            clearTimeout(toastTimer);
            toastTimer = setTimeout(function () {
              btn.textContent = '複製';
              btn.classList.remove('cr-btn-emerald');
            }, 1200);
          });
        });
        row.append(meta, btn);
        frag.appendChild(row);
      });
      results.replaceChildren(frag);
    }

    var schedule = bindRafSchedule(app, render);
    input.addEventListener('input', schedule);
    onCleanup(app, function () {
      input.removeEventListener('input', schedule);
      clearTimeout(toastTimer);
    });
    render();
  }

  /* ——— 2. image-compressor ——— */
  function mountImageCompressor(app) {
    prepMount(app);
    app.innerHTML =
      '<section class="cr-card cr-stack">' +
      '  <p class="cr-eyebrow">Local Canvas</p>' +
      '  <p class="cr-lead">完全在瀏覽器處理 · 不佔伺服器頻寬</p>' +
      '  <label id="cr-ic-drop" class="cr-drop">' +
      '    <span>點擊或拖放圖片到此處</span>' +
      '    <span class="cr-muted">支援 JPEG / PNG / WebP</span>' +
      '    <input id="cr-ic-file" type="file" accept="image/*" hidden>' +
      '  </label>' +
      '  <div class="cr-grid-2">' +
      '    <label class="cr-label">品質 <span id="cr-ic-qlabel">0.80</span>' +
      '      <input id="cr-ic-quality" class="cr-input" type="range" min="0.1" max="1" step="0.05" value="0.8">' +
      '    </label>' +
      '    <label class="cr-label">最長邊 (px)' +
      '      <input id="cr-ic-maxside" class="cr-input" type="number" min="200" max="4000" value="1600">' +
      '    </label>' +
      '  </div>' +
      '  <label class="cr-label">輸出格式' +
      '    <select id="cr-ic-format" class="cr-select">' +
      '      <option value="image/jpeg">JPEG</option>' +
      '      <option value="image/webp">WebP</option>' +
      '    </select>' +
      '  </label>' +
      '  <div id="cr-ic-preview-wrap" class="cr-stack" hidden>' +
      '    <canvas id="cr-ic-canvas" class="cr-canvas"></canvas>' +
      '    <p id="cr-ic-stats" class="cr-muted" style="text-align:center"></p>' +
      '    <a id="cr-ic-download" class="cr-btn cr-btn-emerald" download="compressed.jpg">下載壓縮圖</a>' +
      '  </div>' +
      '  <p id="cr-ic-status" class="cr-muted" style="text-align:center" role="status"></p>' +
      '</section>';

    var fileInput = app.querySelector('#cr-ic-file');
    var drop = app.querySelector('#cr-ic-drop');
    var quality = app.querySelector('#cr-ic-quality');
    var qLabel = app.querySelector('#cr-ic-qlabel');
    var maxSide = app.querySelector('#cr-ic-maxside');
    var format = app.querySelector('#cr-ic-format');
    var canvas = app.querySelector('#cr-ic-canvas');
    var ctx = canvas.getContext('2d', { alpha: false });
    var previewWrap = app.querySelector('#cr-ic-preview-wrap');
    var stats = app.querySelector('#cr-ic-stats');
    var download = app.querySelector('#cr-ic-download');
    var status = app.querySelector('#cr-ic-status');

    var sourceBitmap = null;
    var sourceBytes = 0;
    var objectUrl = '';
    var debounce = 0;
    var runId = 0;

    function fmtKB(n) { return (n / 1024).toFixed(1) + ' KB'; }
    function revoke() {
      if (objectUrl) { URL.revokeObjectURL(objectUrl); objectUrl = ''; }
    }
    function setStatus(msg) { status.textContent = msg || ''; }

    function scheduleCompress() {
      clearTimeout(debounce);
      debounce = setTimeout(function () { compress(); }, 120);
    }

    async function loadFile(file) {
      if (!file.type.startsWith('image/')) { setStatus('請選擇圖片檔案'); return; }
      setStatus('讀取中…');
      sourceBytes = file.size;
      if (sourceBitmap && sourceBitmap.close) sourceBitmap.close();
      sourceBitmap = null;
      try {
        sourceBitmap = await createImageBitmap(file);
        previewWrap.hidden = false;
        await compress();
      } catch (err) {
        setStatus('無法讀取圖片');
      }
    }

    async function compress() {
      if (!sourceBitmap) return;
      var id = ++runId;
      setStatus('壓縮中…');
      var max = Math.max(200, Number(maxSide.value) || 1600);
      var q = Number(quality.value) || 0.8;
      var mime = format.value;
      var w = sourceBitmap.width;
      var h = sourceBitmap.height;
      var scale = Math.min(1, max / Math.max(w, h));
      w = Math.max(1, Math.round(w * scale));
      h = Math.max(1, Math.round(h * scale));
      await new Promise(function (r) { requestAnimationFrame(r); });
      if (id !== runId) return;
      canvas.width = w;
      canvas.height = h;
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(0, 0, w, h);
      ctx.drawImage(sourceBitmap, 0, 0, w, h);
      var blob = await new Promise(function (resolve) { canvas.toBlob(resolve, mime, q); });
      if (id !== runId || !blob) return;
      revoke();
      objectUrl = URL.createObjectURL(blob);
      download.href = objectUrl;
      download.download = mime === 'image/webp' ? 'compressed.webp' : 'compressed.jpg';
      var ratio = sourceBytes ? Math.round((1 - blob.size / sourceBytes) * 100) : 0;
      stats.textContent = '原始 ' + fmtKB(sourceBytes) + ' → 壓縮後 ' + fmtKB(blob.size) +
        (ratio > 0 ? '（約省 ' + ratio + '%）' : '') + ' · ' + w + '×' + h;
      setStatus('完成');
    }

    function onDragOver(e) { e.preventDefault(); drop.classList.add('is-drag'); }
    function onDragLeave() { drop.classList.remove('is-drag'); }
    function onDrop(e) {
      e.preventDefault();
      drop.classList.remove('is-drag');
      var f = e.dataTransfer.files && e.dataTransfer.files[0];
      if (f) loadFile(f);
    }
    function onFileChange() {
      var f = fileInput.files && fileInput.files[0];
      if (f) loadFile(f);
    }
    function onQualityInput() {
      qLabel.textContent = Number(quality.value).toFixed(2);
      scheduleCompress();
    }

    drop.addEventListener('dragover', onDragOver);
    drop.addEventListener('dragleave', onDragLeave);
    drop.addEventListener('drop', onDrop);
    fileInput.addEventListener('change', onFileChange);
    quality.addEventListener('input', onQualityInput);
    maxSide.addEventListener('change', scheduleCompress);
    format.addEventListener('change', scheduleCompress);

    onCleanup(app, function () {
      clearTimeout(debounce);
      revoke();
      if (sourceBitmap && sourceBitmap.close) sourceBitmap.close();
      drop.removeEventListener('dragover', onDragOver);
      drop.removeEventListener('dragleave', onDragLeave);
      drop.removeEventListener('drop', onDrop);
      fileInput.removeEventListener('change', onFileChange);
      quality.removeEventListener('input', onQualityInput);
      maxSide.removeEventListener('change', scheduleCompress);
      format.removeEventListener('change', scheduleCompress);
    });
  }

  /* ——— 3. labor-retirement-calculator ——— */
  function mountLaborRetirementCalculator(app) {
    prepMount(app);
    app.innerHTML =
      '<section class="cr-card cr-stack">' +
      '  <p class="cr-eyebrow">Taiwan Labor</p>' +
      '  <p class="cr-lead">示意試算 · 非官方精算 · 純前端圖表</p>' +
      '  <div class="cr-grid-2">' +
      '    <label class="cr-label">月投保薪資（元）<input id="cr-lr-salary" class="cr-input" type="number" min="0" step="1000" value="45800"></label>' +
      '    <label class="cr-label">工作年資（年）<input id="cr-lr-years" class="cr-input" type="number" min="1" max="50" value="25"></label>' +
      '    <label class="cr-label">勞退提繳比例（%）<input id="cr-lr-rate" class="cr-input" type="number" min="6" max="15" step="0.5" value="6"></label>' +
      '    <label class="cr-label">預估年報酬率（%）<input id="cr-lr-return" class="cr-input" type="number" min="0" max="12" step="0.1" value="3"></label>' +
      '  </div>' +
      '  <canvas id="cr-lr-chart" class="cr-canvas" width="640" height="280"></canvas>' +
      '  <div id="cr-lr-summary" class="cr-grid-2"></div>' +
      '  <p class="cr-muted">說明：勞退以每月提繳本息複利累積估算；勞保老年一次金採簡化公式「平均薪資 × 年資 × 1.55 個月」僅供示意。</p>' +
      '</section>';

    var salaryEl = app.querySelector('#cr-lr-salary');
    var yearsEl = app.querySelector('#cr-lr-years');
    var rateEl = app.querySelector('#cr-lr-rate');
    var returnEl = app.querySelector('#cr-lr-return');
    var canvas = app.querySelector('#cr-lr-chart');
    var ctx = canvas.getContext('2d');
    var summary = app.querySelector('#cr-lr-summary');

    function laborPension(salary, years, ratePct, annualReturnPct) {
      var monthly = salary * (ratePct / 100);
      var r = annualReturnPct / 100 / 12;
      var n = years * 12;
      if (r === 0) return monthly * n;
      return monthly * ((Math.pow(1 + r, n) - 1) / r);
    }

    function laborInsurance(salary, years) {
      return salary * years * 1.55;
    }

    function drawBars(pension, insurance) {
      var dpr = Math.min(global.devicePixelRatio || 1, 2);
      var cssW = canvas.clientWidth || 640;
      var cssH = 280;
      canvas.width = Math.round(cssW * dpr);
      canvas.height = Math.round(cssH * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, cssW, cssH);
      ctx.fillStyle = '#f5f9fc';
      ctx.fillRect(0, 0, cssW, cssH);
      var max = Math.max(pension, insurance, 1);
      var barW = cssW * 0.28;
      var baseY = cssH - 40;
      var maxH = cssH - 80;
      var items = [
        { label: '勞退累積', value: pension, color: '#1977cc' },
        { label: '勞保示意', value: insurance, color: '#0d9488' }
      ];
      items.forEach(function (item, i) {
        var x = cssW * (0.22 + i * 0.4);
        var h = (item.value / max) * maxH;
        var y = baseY - h;
        var grad = ctx.createLinearGradient(x, y, x, baseY);
        grad.addColorStop(0, item.color);
        grad.addColorStop(1, 'rgba(25,119,204,0.12)');
        ctx.fillStyle = grad;
        roundRect(ctx, x - barW / 2, y, barW, h, 12);
        ctx.fill();
        ctx.fillStyle = '#6c757d';
        ctx.font = '13px "Noto Sans TC",system-ui,sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(item.label, x, baseY + 22);
        ctx.fillStyle = '#2c4964';
        ctx.fillText('$' + money(item.value), x, y - 10);
      });
    }

    function render() {
      var salary = Math.max(0, Number(salaryEl.value) || 0);
      var years = Math.max(1, Number(yearsEl.value) || 1);
      var rate = Math.max(0, Number(rateEl.value) || 0);
      var ret = Math.max(0, Number(returnEl.value) || 0);
      var pension = laborPension(salary, years, rate, ret);
      var insurance = laborInsurance(salary, years);
      drawBars(pension, insurance);
      summary.innerHTML =
        '<div class="cr-result" style="flex-direction:column"><p class="cr-result-name">預估勞退專戶累積</p>' +
        '<p class="cr-result-text">NT$ ' + money(pension) + '</p></div>' +
        '<div class="cr-result" style="flex-direction:column"><p class="cr-result-name">勞保老年給付（示意）</p>' +
        '<p class="cr-result-text">NT$ ' + money(insurance) + '</p></div>';
    }

    var schedule = bindRafSchedule(app, render);
    function onResize() { schedule(); }
    [salaryEl, yearsEl, rateEl, returnEl].forEach(function (el) {
      el.addEventListener('input', schedule);
    });
    global.addEventListener('resize', onResize);
    onCleanup(app, function () {
      [salaryEl, yearsEl, rateEl, returnEl].forEach(function (el) {
        el.removeEventListener('input', schedule);
      });
      global.removeEventListener('resize', onResize);
    });
    render();
  }

  /* ——— 4. instagram-caption-formatter ——— */
  function mountInstagramCaptionFormatter(app) {
    prepMount(app);
    app.innerHTML =
      '<section class="cr-card cr-stack">' +
      '  <p class="cr-eyebrow">Caption Fix</p>' +
      '  <p class="cr-lead">換行不消失 · IG／Threads 友善</p>' +
      '  <label class="cr-label">貼文原文（含換行）' +
      '    <textarea id="cr-cap-input" class="cr-textarea" rows="8" placeholder="第一行&#10;&#10;第二段"></textarea>' +
      '  </label>' +
      '  <fieldset class="cr-stack" style="border:none;padding:0;margin:0">' +
      '    <legend class="cr-label">空白策略</legend>' +
      '    <label class="cr-muted"><input type="radio" name="cr-cap-mode" value="braille" checked> 點字空白（最常用）</label>' +
      '    <label class="cr-muted"><input type="radio" name="cr-cap-mode" value="nbsp"> 不換行空白 + 點字混用</label>' +
      '    <label class="cr-muted"><input type="radio" name="cr-cap-mode" value="em"> 全形空白段落</label>' +
      '  </fieldset>' +
      '  <label class="cr-label">轉換結果' +
      '    <textarea id="cr-cap-output" class="cr-textarea" rows="8" readonly></textarea>' +
      '  </label>' +
      '  <button id="cr-cap-copy" type="button" class="cr-btn">一鍵複製排版文字</button>' +
      '  <p id="cr-cap-toast" class="cr-toast" role="status"></p>' +
      '</section>';

    var BRAILLE = '\u2800';
    var NBSP = '\u00A0';
    var EM = '\u3000';
    var input = app.querySelector('#cr-cap-input');
    var output = app.querySelector('#cr-cap-output');
    var copyBtn = app.querySelector('#cr-cap-copy');
    var toast = app.querySelector('#cr-cap-toast');
    var modeInputs = app.querySelectorAll('input[name="cr-cap-mode"]');

    function getMode() {
      var el = app.querySelector('input[name="cr-cap-mode"]:checked');
      return el ? el.value : 'braille';
    }

    function formatCaption(text, mode) {
      var lines = text.replace(/\r\n/g, '\n').split('\n');
      if (mode === 'em') {
        return lines.map(function (line) { return line.trim() === '' ? EM : line; }).join('\n');
      }
      if (mode === 'nbsp') {
        return lines.map(function (line) {
          if (line.trim() === '') return BRAILLE;
          return line.replace(/ /g, NBSP);
        }).join('\n' + BRAILLE + '\n');
      }
      return lines.map(function (line) { return line === '' ? BRAILLE : line; }).join('\n');
    }

    function render() {
      output.value = formatCaption(input.value, getMode());
    }

    var schedule = bindRafSchedule(app, render);
    function onCopy() {
      copyText(output.value, toast, '已複製，可貼到 IG／Threads').catch(function () {
        output.select();
      });
    }

    input.addEventListener('input', schedule);
    modeInputs.forEach(function (el) { el.addEventListener('change', schedule); });
    copyBtn.addEventListener('click', onCopy);
    onCleanup(app, function () {
      input.removeEventListener('input', schedule);
      modeInputs.forEach(function (el) { el.removeEventListener('change', schedule); });
      copyBtn.removeEventListener('click', onCopy);
    });
    render();
  }

  /* ——— 5. meme-caption-generator ——— */
  function mountMemeCaptionGenerator(app) {
    prepMount(app);
    app.innerHTML =
      '<section class="cr-card cr-stack">' +
      '  <p class="cr-eyebrow">Meme Studio</p>' +
      '  <p class="cr-lead">3 款經典底圖 · Canvas 即時渲染</p>' +
      '  <div><p class="cr-label">選擇底圖</p><div id="cr-meme-templates" class="cr-row"></div></div>' +
      '  <label class="cr-label">上方文字<input id="cr-meme-top" class="cr-input" type="text" value="WHEN CODE WORKS"></label>' +
      '  <label class="cr-label">下方文字<input id="cr-meme-bottom" class="cr-input" type="text" value="BUT YOU DON\'T KNOW WHY"></label>' +
      '  <canvas id="cr-meme-canvas" class="cr-canvas" width="800" height="600"></canvas>' +
      '  <a id="cr-meme-download" class="cr-btn cr-btn-rose" download="meme.png">下載梗圖 PNG</a>' +
      '</section>';

    var SIZE = 800;
    var canvas = app.querySelector('#cr-meme-canvas');
    var ctx = canvas.getContext('2d');
    var topText = app.querySelector('#cr-meme-top');
    var bottomText = app.querySelector('#cr-meme-bottom');
    var templatesEl = app.querySelector('#cr-meme-templates');
    var download = app.querySelector('#cr-meme-download');
    var active = 0;
    var objectUrl = '';

    var TEMPLATES = [
      {
        name: '對比板',
        draw: function (c, w, h) {
          c.fillStyle = '#1e293b';
          c.fillRect(0, 0, w, h / 2);
          c.fillStyle = '#0f172a';
          c.fillRect(0, h / 2, w, h / 2);
          c.strokeStyle = '#64748b';
          c.lineWidth = 4;
          c.beginPath();
          c.moveTo(0, h / 2);
          c.lineTo(w, h / 2);
          c.stroke();
          c.fillStyle = '#94a3b8';
          c.font = 'bold 28px system-ui';
          c.textAlign = 'center';
          c.fillText('EXPECTATION', w / 2, h * 0.28);
          c.fillText('REALITY', w / 2, h * 0.78);
        }
      },
      {
        name: '三格反應',
        draw: function (c, w, h) {
          var cols = 3;
          var cw = w / cols;
          var colors = ['#312e81', '#1e3a5f', '#4c0519'];
          for (var i = 0; i < cols; i++) {
            c.fillStyle = colors[i];
            c.fillRect(i * cw, 0, cw, h);
            c.strokeStyle = 'rgba(255,255,255,0.15)';
            c.strokeRect(i * cw, 0, cw, h);
            c.fillStyle = '#e2e8f0';
            c.font = 'bold 22px system-ui';
            c.textAlign = 'center';
            c.fillText(['😐', '🤔', '💥'][i], i * cw + cw / 2, h * 0.5);
          }
        }
      },
      {
        name: '經典黑框',
        draw: function (c, w, h) {
          var g = c.createLinearGradient(0, 0, w, h);
          g.addColorStop(0, '#334155');
          g.addColorStop(1, '#0f172a');
          c.fillStyle = g;
          c.fillRect(0, 0, w, h);
          c.fillStyle = 'rgba(255,255,255,0.06)';
          for (var i = 0; i < 12; i++) {
            c.beginPath();
            c.arc(Math.random() * w, Math.random() * h, 20 + Math.random() * 60, 0, Math.PI * 2);
            c.fill();
          }
        }
      }
    ];

    function drawText(text, y) {
      if (!text) return;
      var fontSize = Math.max(28, Math.min(64, Math.floor(SIZE / (text.length * 0.55))));
      ctx.font = 'bold ' + fontSize + 'px Impact, Haettenschweiler, Arial Black, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.lineWidth = Math.max(4, fontSize / 10);
      ctx.strokeStyle = '#000';
      ctx.fillStyle = '#fff';
      var x = SIZE / 2;
      var maxW = SIZE * 0.92;
      var words = text.toUpperCase().split(/\s+/);
      var lines = [];
      var line = '';
      words.forEach(function (word) {
        var test = line ? line + ' ' + word : word;
        if (ctx.measureText(test).width > maxW && line) {
          lines.push(line);
          line = word;
        } else line = test;
      });
      if (line) lines.push(line);
      var lineH = fontSize * 1.1;
      var startY = y - ((lines.length - 1) * lineH) / 2;
      lines.forEach(function (ln, i) {
        var yy = startY + i * lineH;
        ctx.strokeText(ln, x, yy);
        ctx.fillText(ln, x, yy);
      });
    }

    function render() {
      canvas.width = SIZE;
      canvas.height = SIZE * 0.75;
      var w = canvas.width;
      var h = canvas.height;
      TEMPLATES[active].draw(ctx, w, h);
      drawText(topText.value.trim(), h * 0.12);
      drawText(bottomText.value.trim(), h * 0.88);
      canvas.toBlob(function (blob) {
        if (!blob) return;
        if (objectUrl) URL.revokeObjectURL(objectUrl);
        objectUrl = URL.createObjectURL(blob);
        download.href = objectUrl;
      }, 'image/png');
    }

    var schedule = bindRafSchedule(app, render);
    var templateBtns = [];

    TEMPLATES.forEach(function (t, i) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'cr-chip' + (i === 0 ? ' is-on' : '');
      btn.textContent = t.name;
      btn.addEventListener('click', function () {
        active = i;
        templateBtns.forEach(function (el, idx) {
          el.classList.toggle('is-on', idx === i);
        });
        schedule();
      });
      templatesEl.appendChild(btn);
      templateBtns.push(btn);
    });

    topText.addEventListener('input', schedule);
    bottomText.addEventListener('input', schedule);
    onCleanup(app, function () {
      topText.removeEventListener('input', schedule);
      bottomText.removeEventListener('input', schedule);
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    });
    render();
  }

  /* ——— 6. line-image-preview-cropper ——— */
  function mountLineImagePreviewCropper(app) {
    prepMount(app);
    app.innerHTML =
      '<section class="cr-card cr-stack">' +
      '  <p class="cr-eyebrow">LINE Safe Crop</p>' +
      '  <p class="cr-lead">模擬聊天室預覽框 · 輸出安全比例圖</p>' +
      '  <label class="cr-drop">' +
      '    <span>選擇圖片</span>' +
      '    <input id="cr-line-file" type="file" accept="image/*" hidden>' +
      '  </label>' +
      '  <div class="cr-row">' +
      '    <button type="button" data-ratio="1" class="cr-chip is-on">1:1 安全</button>' +
      '    <button type="button" data-ratio="1.25" class="cr-chip">5:4</button>' +
      '    <button type="button" data-ratio="0.8" class="cr-chip">4:5</button>' +
      '  </div>' +
      '  <div class="cr-grid-2">' +
      '    <div><p class="cr-muted">LINE 預覽模擬（可能被裁）</p><div class="cr-preview-box"><canvas id="cr-line-preview"></canvas></div></div>' +
      '    <div><p class="cr-muted">安全輸出預覽</p><canvas id="cr-line-safe" class="cr-canvas"></canvas></div>' +
      '  </div>' +
      '  <a id="cr-line-download" class="cr-btn cr-btn-emerald" download="line-safe.png" hidden>下載防裁切圖</a>' +
      '  <p id="cr-line-status" class="cr-muted" style="text-align:center" role="status"></p>' +
      '</section>';

    var fileInput = app.querySelector('#cr-line-file');
    var preview = app.querySelector('#cr-line-preview');
    var safe = app.querySelector('#cr-line-safe');
    var pctx = preview.getContext('2d');
    var sctx = safe.getContext('2d');
    var download = app.querySelector('#cr-line-download');
    var status = app.querySelector('#cr-line-status');
    var ratioBtns = app.querySelectorAll('[data-ratio]');

    var bitmap = null;
    var ratio = 1;
    var objectUrl = '';

    function coverDraw(ctx, bmp, tw, th) {
      var br = bmp.width / bmp.height;
      var tr = tw / th;
      var dw, dh, dx, dy;
      if (br > tr) {
        dh = th;
        dw = th * br;
        dx = (tw - dw) / 2;
        dy = 0;
      } else {
        dw = tw;
        dh = tw / br;
        dx = 0;
        dy = (th - dh) / 2;
      }
      ctx.clearRect(0, 0, tw, th);
      ctx.drawImage(bmp, dx, dy, dw, dh);
    }

    function containCrop(bmp, outW, outH) {
      var targetRatio = outW / outH;
      var sw = bmp.width;
      var sh = bmp.height;
      var sr = sw / sh;
      var cw, ch, cx, cy;
      if (sr > targetRatio) {
        ch = sh;
        cw = sh * targetRatio;
        cx = (sw - cw) / 2;
        cy = 0;
      } else {
        cw = sw;
        ch = sw / targetRatio;
        cx = 0;
        cy = (sh - ch) / 2;
      }
      return { cx: cx, cy: cy, cw: cw, ch: ch };
    }

    function render() {
      if (!bitmap) return;
      var side = 384;
      preview.width = side;
      preview.height = side;
      coverDraw(pctx, bitmap, side, side);
      var out = 900;
      var ow, oh;
      if (ratio >= 1) {
        ow = out;
        oh = Math.round(out / ratio);
      } else {
        oh = out;
        ow = Math.round(out * ratio);
      }
      safe.width = ow;
      safe.height = oh;
      var crop = containCrop(bitmap, ow, oh);
      sctx.fillStyle = '#f5f9fc';
      sctx.fillRect(0, 0, ow, oh);
      sctx.drawImage(bitmap, crop.cx, crop.cy, crop.cw, crop.ch, 0, 0, ow, oh);
      safe.toBlob(function (blob) {
        if (!blob) return;
        if (objectUrl) URL.revokeObjectURL(objectUrl);
        objectUrl = URL.createObjectURL(blob);
        download.href = objectUrl;
      }, 'image/png');
    }

    var schedule = bindRafSchedule(app, render);

    function onRatioClick(e) {
      var btn = e.target.closest('[data-ratio]');
      if (!btn) return;
      ratio = Number(btn.dataset.ratio) || 1;
      ratioBtns.forEach(function (b) {
        b.classList.toggle('is-on', b === btn);
      });
      schedule();
    }

    async function onFileChange() {
      var f = fileInput.files && fileInput.files[0];
      if (!f) return;
      if (bitmap && bitmap.close) bitmap.close();
      try {
        bitmap = await createImageBitmap(f);
        download.hidden = false;
        schedule();
        status.textContent = '已載入，可下載安全比例圖';
      } catch (err) {
        status.textContent = '無法讀取圖片';
      }
    }

    app.addEventListener('click', onRatioClick);
    fileInput.addEventListener('change', onFileChange);
    onCleanup(app, function () {
      app.removeEventListener('click', onRatioClick);
      fileInput.removeEventListener('change', onFileChange);
      if (objectUrl) URL.revokeObjectURL(objectUrl);
      if (bitmap && bitmap.close) bitmap.close();
    });
  }

  /* ——— 7. markdown-to-html-cleaner ——— */
  function mountMarkdownToHtmlCleaner(app) {
    prepMount(app);
    app.innerHTML =
      '<section class="cr-card cr-stack">' +
      '  <p class="cr-eyebrow">Clean Markup</p>' +
      '  <p class="cr-lead">無 inline CSS · 語意標籤 · 方便貼網誌</p>' +
      '  <label class="cr-label">Markdown 輸入' +
      '    <textarea id="cr-md-input" class="cr-textarea" rows="10"># 標題範例\n\n這是一段 **粗體** 與 *斜體* 文字。\n\n- 項目一\n- 項目二\n\n> 引用區塊\n\n`inline code` 與連結：[吉吉](https://kawatool.com)</textarea>' +
      '  </label>' +
      '  <div class="cr-grid-2">' +
      '    <label class="cr-label">HTML 輸出<textarea id="cr-md-output" class="cr-textarea" rows="12" readonly style="font-family:monospace;font-size:0.8rem"></textarea></label>' +
      '    <div><p class="cr-label">預覽</p><div id="cr-md-preview" class="cr-result" style="min-height:12rem;display:block"></div></div>' +
      '  </div>' +
      '  <button id="cr-md-copy" type="button" class="cr-btn">複製乾淨 HTML</button>' +
      '  <p id="cr-md-toast" class="cr-toast" role="status"></p>' +
      '</section>';

    var input = app.querySelector('#cr-md-input');
    var output = app.querySelector('#cr-md-output');
    var preview = app.querySelector('#cr-md-preview');
    var copyBtn = app.querySelector('#cr-md-copy');
    var toast = app.querySelector('#cr-md-toast');

    function render() {
      var html = mdToHtml(input.value);
      output.value = html;
      preview.innerHTML = html;
    }

    var schedule = bindRafSchedule(app, render);
    function onCopy() {
      copyText(output.value, toast, '已複製 HTML').catch(function () { output.select(); });
    }

    input.addEventListener('input', schedule);
    copyBtn.addEventListener('click', onCopy);
    onCleanup(app, function () {
      input.removeEventListener('input', schedule);
      copyBtn.removeEventListener('click', onCopy);
    });
    render();
  }

  /* ——— 8. password-generator-pro ——— */
  function mountPasswordGeneratorPro(app) {
    prepMount(app);
    app.innerHTML =
      '<section class="cr-card cr-stack">' +
      '  <p class="cr-eyebrow">Crypto Random</p>' +
      '  <p class="cr-lead">getRandomValues · 不上傳 · 本地產生</p>' +
      '  <div class="cr-result" style="justify-content:center"><p id="cr-pwd-value" class="cr-password">••••••••</p></div>' +
      '  <label class="cr-label">長度：<span id="cr-pwd-lenlabel">16</span>' +
      '    <input id="cr-pwd-length" class="cr-input" type="range" min="8" max="64" value="16">' +
      '  </label>' +
      '  <div class="cr-grid-2 cr-muted">' +
      '    <label><input id="cr-pwd-upper" type="checkbox" checked> 大寫 A-Z</label>' +
      '    <label><input id="cr-pwd-lower" type="checkbox" checked> 小寫 a-z</label>' +
      '    <label><input id="cr-pwd-digits" type="checkbox" checked> 數字 0-9</label>' +
      '    <label><input id="cr-pwd-symbols" type="checkbox" checked> 符號</label>' +
      '  </div>' +
      '  <div class="cr-row">' +
      '    <button id="cr-pwd-generate" type="button" class="cr-btn cr-btn-emerald" style="flex:1">重新產生</button>' +
      '    <button id="cr-pwd-copy" type="button" class="cr-btn" style="flex:1">複製</button>' +
      '  </div>' +
      '  <p id="cr-pwd-strength" class="cr-muted" style="text-align:center"></p>' +
      '  <p id="cr-pwd-toast" class="cr-toast" role="status"></p>' +
      '</section>';

    var UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var LOWER = 'abcdefghijklmnopqrstuvwxyz';
    var DIGITS = '0123456789';
    var SYMBOLS = '!@#$%^&*()-_=+[]{};:,.<>?';

    var lengthEl = app.querySelector('#cr-pwd-length');
    var lenLabel = app.querySelector('#cr-pwd-lenlabel');
    var passwordEl = app.querySelector('#cr-pwd-value');
    var strengthEl = app.querySelector('#cr-pwd-strength');
    var toast = app.querySelector('#cr-pwd-toast');

    function charset() {
      var s = '';
      if (app.querySelector('#cr-pwd-upper').checked) s += UPPER;
      if (app.querySelector('#cr-pwd-lower').checked) s += LOWER;
      if (app.querySelector('#cr-pwd-digits').checked) s += DIGITS;
      if (app.querySelector('#cr-pwd-symbols').checked) s += SYMBOLS;
      return s;
    }

    function randomIndex(max) {
      var limit = Math.floor(256 / max) * max;
      var buf = new Uint8Array(1);
      var x;
      do {
        crypto.getRandomValues(buf);
        x = buf[0];
      } while (x >= limit);
      return x % max;
    }

    function generate() {
      var set = charset();
      if (!set) {
        passwordEl.textContent = '請至少選一種字元';
        strengthEl.textContent = '';
        return;
      }
      if (!global.crypto || !crypto.getRandomValues) {
        passwordEl.textContent = '此瀏覽器不支援安全隨機';
        return;
      }
      var len = Number(lengthEl.value) || 16;
      var out = '';
      for (var i = 0; i < len; i++) out += set[randomIndex(set.length)];
      passwordEl.textContent = out;
      var bits = Math.floor(len * Math.log2(set.length));
      var label = '偏弱';
      var color = '#e11d48';
      if (bits >= 80) { label = '很強'; color = '#0d9488'; }
      else if (bits >= 60) { label = '良好'; color = '#1977cc'; }
      else if (bits >= 40) { label = '普通'; color = '#ca8a04'; }
      strengthEl.textContent = '預估熵約 ' + bits + ' bits · ' + label;
      strengthEl.style.color = color;
    }

    function onLengthInput() {
      lenLabel.textContent = lengthEl.value;
      generate();
    }
    function onCopy() {
      copyText(passwordEl.textContent, toast, '已複製密碼');
    }

    lengthEl.addEventListener('input', onLengthInput);
    ['cr-pwd-upper', 'cr-pwd-lower', 'cr-pwd-digits', 'cr-pwd-symbols'].forEach(function (id) {
      app.querySelector('#' + id).addEventListener('change', generate);
    });
    app.querySelector('#cr-pwd-generate').addEventListener('click', generate);
    app.querySelector('#cr-pwd-copy').addEventListener('click', onCopy);
    onCleanup(app, function () {
      lengthEl.removeEventListener('input', onLengthInput);
    });
    generate();
  }

  /* ——— 9. speech-to-text-notebook ——— */
  function mountSpeechToTextNotebook(app) {
    prepMount(app);
    app.innerHTML =
      '<section class="cr-card cr-stack">' +
      '  <p class="cr-eyebrow">Web Speech</p>' +
      '  <p class="cr-lead">一鍵錄音靈感 · 本地轉錄 · 可匯出</p>' +
      '  <div class="cr-row">' +
      '    <button id="cr-st-toggle" type="button" class="cr-btn cr-btn-rose">開始聆聽</button>' +
      '    <button id="cr-st-copy" type="button" class="cr-btn">複製全文</button>' +
      '    <button id="cr-st-export" type="button" class="cr-btn cr-btn-emerald">匯出 .txt</button>' +
      '    <button id="cr-st-clear" type="button" class="cr-btn">清空</button>' +
      '  </div>' +
      '  <p id="cr-st-status" class="cr-muted" role="status">狀態：待命</p>' +
      '  <label class="cr-label">筆記本<textarea id="cr-st-notes" class="cr-textarea" rows="14" placeholder="語音內容會出現在這裡…"></textarea></label>' +
      '  <p class="cr-muted">需瀏覽器支援 Web Speech API（建議 Chrome／Edge），並允許麥克風權限。</p>' +
      '</section>';

    var SpeechRecognition = global.SpeechRecognition || global.webkitSpeechRecognition;
    var toggleBtn = app.querySelector('#cr-st-toggle');
    var notes = app.querySelector('#cr-st-notes');
    var status = app.querySelector('#cr-st-status');
    var recognition = null;
    var listening = false;
    var exportUrl = '';
    var finalBuffer = '';

    function setStatus(msg) { status.textContent = '狀態：' + msg; }

    if (!SpeechRecognition) {
      setStatus('此瀏覽器不支援語音辨識');
      toggleBtn.disabled = true;
    } else {
      recognition = new SpeechRecognition();
      recognition.lang = 'zh-TW';
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onstart = function () {
        listening = true;
        toggleBtn.textContent = '停止聆聽';
        setStatus('聆聽中…');
      };
      recognition.onend = function () {
        listening = false;
        toggleBtn.textContent = '開始聆聽';
        if (finalBuffer) {
          notes.value = (notes.value ? notes.value + '\n' : '') + finalBuffer.trim();
          finalBuffer = '';
        }
        setStatus('已停止');
      };
      recognition.onerror = function (e) {
        setStatus('錯誤：' + (e.error || 'unknown'));
        listening = false;
        toggleBtn.textContent = '開始聆聽';
      };
      recognition.onresult = function (event) {
        var interim = '';
        for (var i = event.resultIndex; i < event.results.length; i++) {
          var transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalBuffer += transcript + ' ';
            var base = notes.dataset.committed || notes.value;
            notes.value = (base ? base + (base.endsWith('\n') || !base ? '' : '\n') : '') + finalBuffer.trim();
            notes.dataset.committed = notes.value;
            finalBuffer = '';
          } else {
            interim += transcript;
          }
        }
        if (interim) setStatus('聆聽中… ' + interim.slice(0, 40));
      };
    }

    function onToggle() {
      if (!recognition) return;
      if (listening) {
        recognition.stop();
      } else {
        notes.dataset.committed = notes.value;
        try { recognition.start(); } catch (err) { setStatus('無法啟動麥克風'); }
      }
    }
    function onCopy() {
      copyText(notes.value, null, '').then(function () { setStatus('已複製全文'); }).catch(function () {
        notes.select();
        setStatus('請手動複製');
      });
    }
    function onClear() {
      notes.value = '';
      notes.dataset.committed = '';
      setStatus('已清空');
    }
    function onExport() {
      var blob = new Blob([notes.value || ''], { type: 'text/plain;charset=utf-8' });
      if (exportUrl) URL.revokeObjectURL(exportUrl);
      exportUrl = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = exportUrl;
      a.download = 'speech-notes.txt';
      a.click();
      setStatus('已匯出');
    }

    toggleBtn.addEventListener('click', onToggle);
    app.querySelector('#cr-st-copy').addEventListener('click', onCopy);
    app.querySelector('#cr-st-clear').addEventListener('click', onClear);
    app.querySelector('#cr-st-export').addEventListener('click', onExport);
    onCleanup(app, function () {
      if (recognition && listening) {
        try { recognition.stop(); } catch (_) { /* ignore */ }
      }
      if (exportUrl) URL.revokeObjectURL(exportUrl);
    });
  }

  /* ——— 10. qr-code-beautifier ——— */
  function mountQrCodeBeautifier(app) {
    prepMount(app);
    app.innerHTML =
      '<section class="cr-card cr-stack">' +
      '  <p class="cr-eyebrow">Pure Canvas QR</p>' +
      '  <p class="cr-lead">免外鏈套件 · 漸層色 · 圓角模組</p>' +
      '  <label class="cr-label">內容（網址或文字）' +
      '    <input id="cr-qr-text" class="cr-input" type="text" value="https://kawatool.com">' +
      '  </label>' +
      '  <div class="cr-grid-2">' +
      '    <label class="cr-label">漸層起色<input id="cr-qr-c1" class="cr-input" type="color" value="#1977cc"></label>' +
      '    <label class="cr-label">漸層迄色<input id="cr-qr-c2" class="cr-input" type="color" value="#0d9488"></label>' +
      '  </div>' +
      '  <canvas id="cr-qr-canvas" class="cr-canvas" width="512" height="512"></canvas>' +
      '  <a id="cr-qr-download" class="cr-btn" download="qr-beauty.png">下載 PNG</a>' +
      '  <p id="cr-qr-status" class="cr-muted" style="text-align:center" role="status"></p>' +
      '</section>';

    var textEl = app.querySelector('#cr-qr-text');
    var c1 = app.querySelector('#cr-qr-c1');
    var c2 = app.querySelector('#cr-qr-c2');
    var canvas = app.querySelector('#cr-qr-canvas');
    var ctx = canvas.getContext('2d');
    var download = app.querySelector('#cr-qr-download');
    var statusEl = app.querySelector('#cr-qr-status');
    var objectUrl = '';

    function render() {
      var text = (textEl.value || '').trim() || 'https://kawatool.com';
      try {
        var mat = QR.encode(text);
        var n = mat.length;
        var size = 512;
        var pad = 28;
        canvas.width = size;
        canvas.height = size;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, size, size);
        var cell = (size - pad * 2) / n;
        var grad = ctx.createLinearGradient(pad, pad, size - pad, size - pad);
        grad.addColorStop(0, c1.value);
        grad.addColorStop(1, c2.value);
        for (var y = 0; y < n; y++) {
          for (var x = 0; x < n; x++) {
            if (!mat[y][x]) continue;
            var px = pad + x * cell;
            var py = pad + y * cell;
            ctx.fillStyle = grad;
            roundRect(ctx, px + cell * 0.1, py + cell * 0.1, cell * 0.8, cell * 0.8, cell * 0.3);
            ctx.fill();
          }
        }
        canvas.toBlob(function (blob) {
          if (!blob) return;
          if (objectUrl) URL.revokeObjectURL(objectUrl);
          objectUrl = URL.createObjectURL(blob);
          download.href = objectUrl;
        }, 'image/png');
        statusEl.textContent = '已產生 · ' + n + '×' + n + ' 模組';
      } catch (err) {
        statusEl.textContent = err.message || '產生失敗';
      }
    }

    var schedule = bindRafSchedule(app, render);
    textEl.addEventListener('input', schedule);
    c1.addEventListener('input', schedule);
    c2.addEventListener('input', schedule);
    onCleanup(app, function () {
      textEl.removeEventListener('input', schedule);
      c1.removeEventListener('input', schedule);
      c2.removeEventListener('input', schedule);
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    });
    render();
  }

  /* ——— exports ——— */
  global.WA_MOUNT_CREATOR = {
    'ig-font-generator': mountIgFontGenerator,
    'image-compressor': mountImageCompressor,
    'labor-retirement-calculator': mountLaborRetirementCalculator,
    'instagram-caption-formatter': mountInstagramCaptionFormatter,
    'meme-caption-generator': mountMemeCaptionGenerator,
    'line-image-preview-cropper': mountLineImagePreviewCropper,
    'markdown-to-html-cleaner': mountMarkdownToHtmlCleaner,
    'password-generator-pro': mountPasswordGeneratorPro,
    'speech-to-text-notebook': mountSpeechToTextNotebook,
    'qr-code-beautifier': mountQrCodeBeautifier
  };
})(typeof window !== 'undefined' ? window : this);
