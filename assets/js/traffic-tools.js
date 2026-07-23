/**
 * High-traffic utility tools: percentage, line-break, image resizer/HEIC/SVG.
 * Exports: window.WA_MOUNT_TRAFFIC[slug](app)
 */
(function (global) {
  'use strict';

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function panel(title, lead, body, seo) {
    return (
      '<section class="vr-card" style="background:#fff;border:1px solid rgba(25,119,204,.22);border-radius:12px;padding:1.15rem 1.2rem;color:#444">' +
      '<p style="margin:0 0 .35rem;font-size:.72rem;letter-spacing:.14em;text-transform:uppercase;color:#1977cc;font-weight:600">KaWaTool</p>' +
      '<h2 style="margin:0 0 .5rem;font-size:1.3rem;color:#2c4964">' + esc(title) + '</h2>' +
      '<p style="margin:0 0 1rem;color:#6c757d;font-size:.92rem">' + esc(lead) + '</p>' +
      body +
      (seo || '') +
      '</section>'
    );
  }

  function seo(html) {
    return '<div style="margin-top:1.2rem;padding-top:1rem;border-top:1px dashed rgba(25,119,204,.25)">' + html + '</div>';
  }

  function faq(q, a) {
    return '<details style="border:1px solid rgba(25,119,204,.2);border-radius:8px;padding:.5rem .75rem;margin:.4rem 0"><summary style="cursor:pointer;font-weight:600;color:#2c4964">' +
      esc(q) + '</summary><p style="margin:.4rem 0 0;color:#6c757d;font-size:.9rem;line-height:1.65">' + esc(a) + '</p></details>';
  }

  function field(label, id, attrs) {
    return '<label style="display:block;margin:.5rem 0;font-size:.88rem;color:#2c4964">' + esc(label) +
      '<input id="' + id + '" ' + (attrs || 'class="vr-input" type="number"') +
      ' style="display:block;width:100%;margin-top:.3rem;padding:.55rem .8rem;border:1px solid rgba(25,119,204,.28);border-radius:8px"></label>';
  }

  function mountPercentage(app) {
    app.innerHTML = panel(
      '百分比／漲跌幅快速計算器',
      '算「A 是 B 的百分之幾」、漲跌幅、折扣後價格，日常比價與投資估算都好用。',
      field('數值 A', 'tf-a', 'type="number" value="120"') +
      field('數值 B（基準）', 'tf-b', 'type="number" value="100"') +
      '<button type="button" id="tf-go" style="background:#1977cc;color:#fff;border:0;border-radius:8px;padding:.55rem 1rem;font-weight:600;cursor:pointer">計算</button>' +
      '<div id="tf-out" style="margin-top:1rem;display:grid;gap:.5rem"></div>',
      seo(
        '<h2 style="font-size:1.05rem;color:#2c4964">使用教學與公式</h2>' +
        '<p style="color:#6c757d;font-size:.9rem;line-height:1.7">漲跌幅 = (新值 − 舊值) ÷ 舊值 × 100%。A 佔 B 百分比 = A ÷ B × 100%。</p>' +
        '<h3 style="font-size:.95rem;color:#2c4964">FAQ</h3>' +
        faq('股價從 100 漲到 120 漲幅多少？', '（120−100）÷100 = 20%。') +
        faq('打 8 折等於降多少％？', '打 8 折是付原價 80%，相當於減價 20%。')
      )
    );
    function run() {
      var a = Number(app.querySelector('#tf-a').value) || 0;
      var b = Number(app.querySelector('#tf-b').value) || 0;
      var pctOf = b !== 0 ? (a / b) * 100 : NaN;
      var change = b !== 0 ? ((a - b) / b) * 100 : NaN;
      app.querySelector('#tf-out').innerHTML =
        '<div style="background:#f5f9fc;border:1px solid rgba(25,119,204,.2);border-radius:8px;padding:.7rem">A 是 B 的 <strong>' +
        (Number.isFinite(pctOf) ? pctOf.toFixed(2) + '%' : '—') + '</strong></div>' +
        '<div style="background:#f5f9fc;border:1px solid rgba(25,119,204,.2);border-radius:8px;padding:.7rem">相對 B 的漲跌幅 <strong>' +
        (Number.isFinite(change) ? change.toFixed(2) + '%' : '—') + '</strong></div>';
    }
    app.querySelector('#tf-go').addEventListener('click', run);
    run();
  }

  function mountLineBreak(app) {
    app.innerHTML = panel(
      '文章自動去換行與多餘空白',
      '整理從 PDF、網頁或簡報複製出來的斷行文字，一鍵合併段落並壓縮空白。',
      '<textarea id="tf-in" rows="8" style="width:100%;padding:.7rem;border:1px solid rgba(25,119,204,.28);border-radius:8px;font-size:.92rem" placeholder="貼上要整理的文字…"></textarea>' +
      '<div style="display:flex;flex-wrap:wrap;gap:.5rem;margin:.7rem 0">' +
      '<button type="button" id="tf-go" style="background:#1977cc;color:#fff;border:0;border-radius:8px;padding:.55rem 1rem;font-weight:600">去換行</button>' +
      '<button type="button" id="tf-copy" style="background:#eaf4fc;color:#1977cc;border:1px solid rgba(25,119,204,.35);border-radius:8px;padding:.55rem 1rem">複製結果</button>' +
      '</div>' +
      '<textarea id="tf-out" rows="8" readonly style="width:100%;padding:.7rem;border:1px solid rgba(25,119,204,.28);border-radius:8px;background:#f5f9fc"></textarea>',
      seo(
        '<h2 style="font-size:1.05rem;color:#2c4964">使用教學</h2>' +
        '<p style="color:#6c757d;font-size:.9rem;line-height:1.7">貼上文字後按「去換行」：會把單一換行併成空白，並保留空行作為段落分隔，同時壓縮連續空白。</p>' +
        faq('為什麼 PDF 複製會一大堆斷行？', 'PDF 常依視覺行寬斷行，不是依語意段落；合併後比較好貼到文件或社群。')
      )
    );
    app.querySelector('#tf-go').addEventListener('click', function () {
      var t = app.querySelector('#tf-in').value || '';
      var out = t
        .replace(/\r\n/g, '\n')
        .replace(/[ \t]+\n/g, '\n')
        .replace(/\n{3,}/g, '\n\n')
        .split(/\n\n/)
        .map(function (p) { return p.replace(/\n+/g, ' ').replace(/[ \t]{2,}/g, ' ').trim(); })
        .filter(Boolean)
        .join('\n\n');
      app.querySelector('#tf-out').value = out;
    });
    app.querySelector('#tf-copy').addEventListener('click', function () {
      var v = app.querySelector('#tf-out').value || '';
      if (navigator.clipboard) navigator.clipboard.writeText(v);
    });
  }

  function readFileAsDataURL(file) {
    return new Promise(function (resolve, reject) {
      var fr = new FileReader();
      fr.onload = function () { resolve(fr.result); };
      fr.onerror = reject;
      fr.readAsDataURL(file);
    });
  }

  function mountResizer(app) {
    var presets = [
      { id: 'ig-sq', label: 'IG 正方形 1080×1080', w: 1080, h: 1080 },
      { id: 'ig-port', label: 'IG 直式 1080×1350', w: 1080, h: 1350 },
      { id: 'yt', label: 'YouTube 封面 1280×720', w: 1280, h: 720 },
      { id: 'fb', label: 'FB 封面 820×312', w: 820, h: 312 },
      { id: 'id2', label: '證件照 2 吋約 413×531', w: 413, h: 531 }
    ];
    app.innerHTML = panel(
      '證件照／社群封面尺寸快速裁切',
      '上傳圖片後選擇 IG、YouTube、FB 或證件照預設尺寸，瀏覽器內完成縮放裁切並下載。',
      '<input type="file" id="tf-file" accept="image/*" style="margin:.5rem 0">' +
      '<label style="display:block;margin:.5rem 0;font-size:.88rem;color:#2c4964">預設尺寸' +
      '<select id="tf-pre" style="display:block;width:100%;margin-top:.3rem;padding:.55rem;border-radius:8px;border:1px solid rgba(25,119,204,.28)">' +
      presets.map(function (p) { return '<option value="' + p.id + '">' + esc(p.label) + '</option>'; }).join('') +
      '</select></label>' +
      '<button type="button" id="tf-go" style="background:#1977cc;color:#fff;border:0;border-radius:8px;padding:.55rem 1rem;font-weight:600">產生並下載</button>' +
      '<p id="tf-msg" style="color:#6c757d;font-size:.85rem;margin-top:.6rem"></p>' +
      '<canvas id="tf-cv" style="display:none"></canvas>',
      seo(
        '<h2 style="font-size:1.05rem;color:#2c4964">使用教學</h2>' +
        '<p style="color:#6c757d;font-size:.9rem;line-height:1.7">圖片只在你的瀏覽器處理，不會上傳伺服器。採「覆蓋裁切」置中裁出目標比例。</p>' +
        faq('會不會壓縮畫質？', '輸出為 JPEG 約 0.92 品質；若要更小檔可再用圖片壓縮工具。')
      )
    );
    var fileInput = app.querySelector('#tf-file');
    app.querySelector('#tf-go').addEventListener('click', function () {
      var file = fileInput.files && fileInput.files[0];
      var msg = app.querySelector('#tf-msg');
      if (!file) { msg.textContent = '請先選擇圖片'; return; }
      var pre = presets.find(function (p) { return p.id === app.querySelector('#tf-pre').value; }) || presets[0];
      var img = new Image();
      img.onload = function () {
        var cv = app.querySelector('#tf-cv');
        cv.width = pre.w; cv.height = pre.h;
        var ctx = cv.getContext('2d');
        var scale = Math.max(pre.w / img.width, pre.h / img.height);
        var sw = pre.w / scale, sh = pre.h / scale;
        var sx = (img.width - sw) / 2, sy = (img.height - sh) / 2;
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, pre.w, pre.h);
        ctx.drawImage(img, sx, sy, sw, sh, 0, 0, pre.w, pre.h);
        cv.toBlob(function (blob) {
          if (!blob) { msg.textContent = '輸出失敗'; return; }
          var a = document.createElement('a');
          a.href = URL.createObjectURL(blob);
          a.download = 'resize-' + pre.w + 'x' + pre.h + '.jpg';
          a.click();
          URL.revokeObjectURL(a.href);
          msg.textContent = '已下載 ' + pre.w + '×' + pre.h;
        }, 'image/jpeg', 0.92);
      };
      img.onerror = function () { msg.textContent = '圖片讀取失敗'; };
      readFileAsDataURL(file).then(function (url) { img.src = url; });
    });
  }

  function mountHeic(app) {
    app.innerHTML = panel(
      'iPhone HEIC 轉 JPG 工具',
      '在 Windows 等不支援 HEIC 的環境，把 iPhone 照片轉成通用 JPG（純前端轉換）。',
      '<input type="file" id="tf-file" accept="image/*,.heic,.heif" style="margin:.5rem 0">' +
      '<button type="button" id="tf-go" style="background:#1977cc;color:#fff;border:0;border-radius:8px;padding:.55rem 1rem;font-weight:600">轉換並下載 JPG</button>' +
      '<p id="tf-msg" style="color:#6c757d;font-size:.85rem;margin-top:.6rem">若瀏覽器無法直接解碼 HEIC，請改用系統轉檔或線下工具；本頁會優先嘗試以 Canvas 匯出。</p>',
      seo(
        '<h2 style="font-size:1.05rem;color:#2c4964">為什麼需要 HEIC 轉 JPG？</h2>' +
        '<p style="color:#6c757d;font-size:.9rem;line-height:1.7">iPhone 預設 HEIC 較省空間，但部分 Windows／網站不支援。轉 JPG 後相容性最好。</p>' +
        faq('轉換會上傳圖片嗎？', '不會。檔案只在本機瀏覽器處理。')
      )
    );
    app.querySelector('#tf-go').addEventListener('click', function () {
      var file = app.querySelector('#tf-file').files && app.querySelector('#tf-file').files[0];
      var msg = app.querySelector('#tf-msg');
      if (!file) { msg.textContent = '請先選擇 HEIC／圖片檔'; return; }
      var img = new Image();
      img.onload = function () {
        var cv = document.createElement('canvas');
        cv.width = img.naturalWidth; cv.height = img.naturalHeight;
        cv.getContext('2d').drawImage(img, 0, 0);
        cv.toBlob(function (blob) {
          if (!blob) { msg.textContent = '此瀏覽器可能無法解碼 HEIC，請換 Chrome／Edge 最新版或先用系統轉檔'; return; }
          var a = document.createElement('a');
          a.href = URL.createObjectURL(blob);
          a.download = (file.name.replace(/\.[^.]+$/, '') || 'photo') + '.jpg';
          a.click();
          URL.revokeObjectURL(a.href);
          msg.textContent = '已下載 JPG';
        }, 'image/jpeg', 0.92);
      };
      img.onerror = function () {
        msg.textContent = '無法解碼此 HEIC。建議：iPhone 設定改「最相容」、或使用支援 HEIC 的桌面轉檔後再上傳。';
      };
      readFileAsDataURL(file).then(function (url) { img.src = url; });
    });
  }

  function mountSvgPng(app) {
    app.innerHTML = panel(
      'SVG 向量圖轉高解析 PNG',
      '貼上 SVG 原始碼或上傳 .svg，輸出透明背景 PNG，適合簡報與社群素材。',
      '<textarea id="tf-svg" rows="7" style="width:100%;padding:.7rem;border:1px solid rgba(25,119,204,.28);border-radius:8px;font-family:ui-monospace,monospace;font-size:.85rem" placeholder="<svg ...>...</svg>"></textarea>' +
      '<input type="file" id="tf-file" accept=".svg,image/svg+xml" style="margin:.5rem 0;display:block">' +
      field('輸出寬度（px）', 'tf-w', 'type="number" min="16" value="1024"') +
      '<button type="button" id="tf-go" style="background:#1977cc;color:#fff;border:0;border-radius:8px;padding:.55rem 1rem;font-weight:600">轉成 PNG 下載</button>' +
      '<p id="tf-msg" style="color:#6c757d;font-size:.85rem;margin-top:.6rem"></p>',
      seo(
        '<h2 style="font-size:1.05rem;color:#2c4964">使用教學</h2>' +
        '<p style="color:#6c757d;font-size:.9rem;line-height:1.7">貼上完整 SVG（含 viewBox 較佳），設定寬度後下載 PNG。高度依比例自動計算。</p>' +
        faq('為什麼有些 SVG 轉出是空白？', '可能含外部字型／連結資源被瀏覽器安全政策擋下，請改用內嵌路徑的 SVG。')
      )
    );
    app.querySelector('#tf-file').addEventListener('change', function (e) {
      var f = e.target.files && e.target.files[0];
      if (!f) return;
      f.text().then(function (t) { app.querySelector('#tf-svg').value = t; });
    });
    app.querySelector('#tf-go').addEventListener('click', function () {
      var svgText = (app.querySelector('#tf-svg').value || '').trim();
      var msg = app.querySelector('#tf-msg');
      if (!svgText) { msg.textContent = '請貼上 SVG'; return; }
      var w = Math.max(16, Number(app.querySelector('#tf-w').value) || 1024);
      var blob = new Blob([svgText], { type: 'image/svg+xml;charset=utf-8' });
      var url = URL.createObjectURL(blob);
      var img = new Image();
      img.onload = function () {
        var h = Math.max(1, Math.round(w * (img.naturalHeight / img.naturalWidth)));
        var cv = document.createElement('canvas');
        cv.width = w; cv.height = h;
        cv.getContext('2d').drawImage(img, 0, 0, w, h);
        cv.toBlob(function (out) {
          URL.revokeObjectURL(url);
          if (!out) { msg.textContent = '轉換失敗'; return; }
          var a = document.createElement('a');
          a.href = URL.createObjectURL(out);
          a.download = 'svg-export.png';
          a.click();
          URL.revokeObjectURL(a.href);
          msg.textContent = '已下載 PNG（' + w + '×' + h + '）';
        });
      };
      img.onerror = function () { URL.revokeObjectURL(url); msg.textContent = 'SVG 無法繪製'; };
      img.src = url;
    });
  }

  global.WA_MOUNT_TRAFFIC = Object.assign(global.WA_MOUNT_TRAFFIC || {}, {
    'percentage-calculator': mountPercentage,
    'line-break-remover': mountLineBreak,
    'image-resizer': mountResizer,
    'heic-to-jpg': mountHeic,
    'svg-to-png': mountSvgPng
  });
})(typeof window !== 'undefined' ? window : this);
