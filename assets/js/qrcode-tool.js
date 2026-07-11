/**
 * QR Code generator — text (Nayuki qrcodegen) + URL (qrcodejs), matching ifreesite.com/qrcode/
 */
(function () {
  'use strict';

  const R = window.WA_TOOL_REGISTRY = window.WA_TOOL_REGISTRY || {};
  const U = window.WA_TOOL_UI;

  function assetUrl(path) {
    return typeof window.waAssetUrl === 'function' ? window.waAssetUrl(path) : path;
  }

  function el(tag, attrs, children) {
    if (U?.el) return U.el(tag, attrs, children);
    const node = document.createElement(tag);
    if (attrs) {
      Object.entries(attrs).forEach(([k, v]) => {
        if (v == null) return;
        if (k === 'className') node.className = v;
        else if (k.startsWith('on') && typeof v === 'function') node.addEventListener(k.slice(2).toLowerCase(), v);
        else node.setAttribute(k, v);
      });
    }
    const list = children == null ? [] : Array.isArray(children) ? children : [children];
    list.forEach((c) => { if (c != null) node.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); });
    return node;
  }

  function field(label, control) {
    return el('div', { className: 'tool-field' }, [label ? el('label', { className: 'tool-label' }, label) : null, control]);
  }

  function numInput(id, value, min, max, step) {
    return el('input', {
      type: 'number', id, className: 'form-control tool-input qrcode-num',
      value: String(value), min: String(min), max: String(max), step: String(step || 1),
    });
  }

  function textInput(id, value, cls) {
    return el('input', { type: 'text', id, className: cls || 'form-control tool-input', value });
  }

  function colorInput(id, value) {
    return el('input', { type: 'color', id, className: 'qrcode-color', value });
  }

  function radioRow(name, items, checkedId) {
    return el('div', { className: 'qrcode-radio-row' }, items.map((item) =>
      el('label', { className: 'qrcode-radio' }, [
        el('input', { type: 'radio', name, id: item.id, checked: item.id === checkedId ? true : null }),
        ' ',
        item.label,
      ])
    ));
  }

  function getById(id) {
    const node = document.getElementById(id);
    if (!node) throw new Error('Missing element: ' + id);
    return node;
  }

  function getInput(id) {
    const node = getById(id);
    if (!(node instanceof HTMLInputElement)) throw new Error('Missing input: ' + id);
    return node;
  }

  function drawCanvas(qr, scale, border, lightColor, darkColor, canvas) {
    const width = (qr.size + border * 2) * scale;
    canvas.width = width;
    canvas.height = width;
    const ctx = canvas.getContext('2d');
    for (let y = -border; y < qr.size + border; y++) {
      for (let x = -border; x < qr.size + border; x++) {
        ctx.fillStyle = qr.getModule(x, y) ? darkColor : lightColor;
        ctx.fillRect((x + border) * scale, (y + border) * scale, scale, scale);
      }
    }
  }

  function toSvgString(qr, border, lightColor, darkColor) {
    const parts = [];
    for (let y = 0; y < qr.size; y++) {
      for (let x = 0; x < qr.size; x++) {
        if (qr.getModule(x, y)) parts.push(`M${x + border},${y + border}h1v1h-1z`);
      }
    }
    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 ${qr.size + border * 2} ${qr.size + border * 2}" stroke="none">
  <rect width="100%" height="100%" fill="${lightColor}"/>
  <path d="${parts.join(' ')}" fill="${darkColor}"/>
</svg>`;
  }

  function describeSegments(segs) {
    if (!segs.length) return 'none';
    if (segs.length !== 1) return 'multiple';
    const mode = segs[0].mode;
    const Mode = qrcodegen.QrSegment.Mode;
    if (mode === Mode.NUMERIC) return 'numeric';
    if (mode === Mode.ALPHANUMERIC) return 'alphanumeric';
    if (mode === Mode.BYTE) return 'byte';
    if (mode === Mode.KANJI) return 'kanji';
    return 'unknown';
  }

  function countUnicodeChars(str) {
    let result = 0;
    for (const ch of str) {
      const cc = ch.codePointAt(0);
      if (cc >= 0xD800 && cc < 0xE000) throw new RangeError('Invalid UTF-16 string');
      result++;
    }
    return result;
  }

  R.qrcode = function (app) {
    app.classList.add('qrcode-app');
    const tabId = 'qr-tab-' + Math.random().toString(36).slice(2, 8);

    const textCanvas = el('canvas', { id: 'qr-text-canvas', className: 'qrcode-preview-canvas', style: 'display:none' });
    const textSvg = el('svg', {
      id: 'qr-text-svg', className: 'qrcode-preview-svg', xmlns: 'http://www.w3.org/2000/svg', stroke: 'none', style: 'display:none',
    }, [
      el('rect', { width: '100%', height: '100%', fill: '#FFFFFF' }),
      el('path', { d: '', fill: '#000000' }),
    ]);
    const textDownload = el('a', {
      id: 'qr-text-download', className: 'btn btn-primary tool-btn qrcode-download', download: 'qr-code.png',
    }, '下載圖片');
    const statsOut = el('pre', { id: 'qr-stats', className: 'qrcode-stats tool-result' });

    const urlHost = el('div', { id: 'qr-url-host', className: 'qrcode-url-host' });
    const urlDownload = el('a', {
      id: 'qr-url-download', className: 'btn btn-primary tool-btn qrcode-download', href: '#', download: 'qrcode.png',
    }, '下載圖片');

    function redrawTextQr() {
      if (!window.qrcodegen) return;
      const bitmapOutput = getInput('qr-out-bitmap').checked;
      const scaleRow = document.getElementById('qr-scale-row');
      if (bitmapOutput) {
        scaleRow.style.removeProperty('display');
        textDownload.download = 'qr-code.png';
      } else {
        scaleRow.style.display = 'none';
        textDownload.download = 'qr-code.svg';
      }
      textDownload.removeAttribute('href');
      textCanvas.style.display = 'none';
      textSvg.style.display = 'none';

      let ecl = qrcodegen.QrCode.Ecc.LOW;
      if (getInput('qr-ecc-medium').checked) ecl = qrcodegen.QrCode.Ecc.MEDIUM;
      else if (getInput('qr-ecc-quartile').checked) ecl = qrcodegen.QrCode.Ecc.QUARTILE;
      else if (getInput('qr-ecc-high').checked) ecl = qrcodegen.QrCode.Ecc.HIGH;

      const text = getById('qr-text-input').value;
      const segs = qrcodegen.QrSegment.makeSegments(text);
      const minVer = parseInt(getInput('qr-ver-min').value, 10);
      const maxVer = parseInt(getInput('qr-ver-max').value, 10);
      const mask = parseInt(getInput('qr-mask').value, 10);
      const boostEcc = getInput('qr-boost-ecc').checked;

      let qr;
      try {
        qr = qrcodegen.QrCode.encodeSegments(segs, ecl, minVer, maxVer, mask, boostEcc);
      } catch (e) {
        statsOut.textContent = '產生失敗：' + (e.message || String(e));
        return;
      }

      const border = parseInt(getInput('qr-border').value, 10);
      const lightColor = getInput('qr-light-color').value;
      const darkColor = getInput('qr-dark-color').value;
      if (border < 0 || border > 100) return;

      if (bitmapOutput) {
        const scale = parseInt(getInput('qr-scale').value, 10);
        if (scale <= 0 || scale > 30) return;
        drawCanvas(qr, scale, border, lightColor, darkColor, textCanvas);
        textCanvas.style.removeProperty('display');
        textDownload.href = textCanvas.toDataURL('image/png');
      } else {
        const code = toSvgString(qr, border, lightColor, darkColor);
        const viewBox = / viewBox="([^"]*)"/.exec(code)[1];
        const pathD = / d="([^"]*)"/.exec(code)[1];
        textSvg.setAttribute('viewBox', viewBox);
        textSvg.querySelector('rect').setAttribute('fill', lightColor);
        textSvg.querySelector('path').setAttribute('d', pathD);
        textSvg.querySelector('path').setAttribute('fill', darkColor);
        textSvg.style.removeProperty('display');
        textDownload.href = 'data:application/svg+xml,' + encodeURIComponent(code);
      }

      statsOut.textContent =
        `QR Code version = ${qr.version}, ` +
        `mask pattern = ${qr.mask}, ` +
        `character count = ${countUnicodeChars(text)},\n` +
        `encoding mode = ${describeSegments(segs)}, ` +
        `error correction = level ${'LMQH'.charAt(qr.errorCorrectionLevel.ordinal)}, ` +
        `data bits = ${qrcodegen.QrSegment.getTotalBits(segs, qr.version)}.`;
    }

    function handleVersionMinMax(which) {
      const minElem = getInput('qr-ver-min');
      const maxElem = getInput('qr-ver-max');
      let minVal = parseInt(minElem.value, 10);
      let maxVal = parseInt(maxElem.value, 10);
      minVal = Math.max(Math.min(minVal, qrcodegen.QrCode.MAX_VERSION), qrcodegen.QrCode.MIN_VERSION);
      maxVal = Math.max(Math.min(maxVal, qrcodegen.QrCode.MAX_VERSION), qrcodegen.QrCode.MIN_VERSION);
      if (which === 'min' && minVal > maxVal) maxVal = minVal;
      else if (which === 'max' && maxVal < minVal) minVal = maxVal;
      minElem.value = String(minVal);
      maxElem.value = String(maxVal);
      redrawTextQr();
    }

    function bindTextInputs() {
      document.querySelectorAll('.qrcode-app input[type=number], .qrcode-app #qr-text-input, .qrcode-app #qr-dark-color, .qrcode-app #qr-light-color')
        .forEach((node) => {
          if (node.id.indexOf('qr-ver-') !== 0) node.addEventListener('input', redrawTextQr);
        });
      document.querySelectorAll('.qrcode-app input[type=radio], .qrcode-app #qr-boost-ecc')
        .forEach((node) => node.addEventListener('change', redrawTextQr));
      getInput('qr-ver-min').addEventListener('input', () => handleVersionMinMax('min'));
      getInput('qr-ver-max').addEventListener('input', () => handleVersionMinMax('max'));
    }

    function generateUrlQr() {
      if (!window.QRCode) return;
      urlHost.replaceChildren();
      const qrcode = new window.QRCode(urlHost, {
        text: getInput('qr-url-input').value,
        width: parseInt(getInput('qr-url-width').value, 10) || 128,
        height: parseInt(getInput('qr-url-height').value, 10) || 128,
        colorDark: getInput('qr-url-dark').value,
        colorLight: getInput('qr-url-light').value,
        correctLevel: parseInt(getInput('qr-url-ecc').value, 10),
      });
      void qrcode;
      const canvas = urlHost.querySelector('canvas');
      if (canvas) {
        urlDownload.href = canvas.toDataURL('image/png');
      }
    }

    const textPane = el('div', { className: 'tab-pane fade show active', id: `${tabId}-text` }, [
      field('輸入文字', el('textarea', {
        id: 'qr-text-input', className: 'form-control tool-textarea', rows: '5',
        placeholder: 'I♥You！',
      }, 'I♥You！')),
      el('div', { className: 'qrcode-options-grid' }, [
        el('div', { className: 'qrcode-option' }, [el('strong', {}, '邊界：'), numInput('qr-border', 4, 0, 100, 1)]),
        el('div', { className: 'qrcode-option', id: 'qr-scale-row' }, [el('strong', {}, '尺寸：'), numInput('qr-scale', 8, 1, 30, 1)]),
      ]),
      field('校正', radioRow('qr-ecc', [
        { id: 'qr-ecc-low', label: 'Low' },
        { id: 'qr-ecc-medium', label: 'Medium' },
        { id: 'qr-ecc-quartile', label: 'Quartile' },
        { id: 'qr-ecc-high', label: 'High' },
      ], 'qr-ecc-low')),
      field('輸出格式', radioRow('qr-out', [
        { id: 'qr-out-bitmap', label: 'Bitmap' },
        { id: 'qr-out-vector', label: 'Vector' },
      ], 'qr-out-bitmap')),
      el('div', { className: 'qrcode-options-grid' }, [
        el('div', { className: 'qrcode-option' }, [el('strong', {}, '前景顏色：'), textInput('qr-dark-color', '#000000', 'form-control tool-input qrcode-hex')]),
        el('div', { className: 'qrcode-option' }, [el('strong', {}, '背景顏色：'), textInput('qr-light-color', '#FFFFFF', 'form-control tool-input qrcode-hex')]),
      ]),
      el('div', { className: 'qrcode-options-grid' }, [
        el('div', { className: 'qrcode-option' }, [
          el('strong', {}, '色碼版本範圍：'),
          ' 最小 = ', numInput('qr-ver-min', 1, 1, 40, 1),
          ' 最大 = ', numInput('qr-ver-max', 40, 1, 40, 1),
        ]),
        el('div', { className: 'qrcode-option' }, [
          el('strong', {}, '圖案樣式：'),
          numInput('qr-mask', -1, -1, 7, 1),
          el('span', { className: 'text-muted small' }, '（−1 預設，0 至 7 手動範圍）'),
        ]),
      ]),
      el('label', { className: 'qrcode-check' }, [
        el('input', { type: 'checkbox', id: 'qr-boost-ecc', checked: true }),
        ' 增強 ECC level',
      ]),
      statsOut,
      el('div', { className: 'qrcode-preview-wrap' }, [textCanvas, textSvg, textDownload]),
    ]);

    const urlPane = el('div', { className: 'tab-pane fade', id: `${tabId}-url` }, [
      field('網站地址', textInput('qr-url-input', 'https://', 'form-control tool-input')),
      el('div', { className: 'qrcode-options-grid' }, [
        el('div', { className: 'qrcode-option' }, [el('strong', {}, '寬度：'), numInput('qr-url-width', 128, 32, 1024, 1)]),
        el('div', { className: 'qrcode-option' }, [el('strong', {}, '高度：'), numInput('qr-url-height', 128, 32, 1024, 1)]),
      ]),
      field('容錯等級', el('select', { id: 'qr-url-ecc', className: 'form-select tool-select' }, [
        el('option', { value: '1' }, 'L'),
        el('option', { value: '0' }, 'M'),
        el('option', { value: '3' }, 'Q'),
        el('option', { value: '2' }, 'H'),
      ])),
      el('div', { className: 'qrcode-options-grid' }, [
        el('div', { className: 'qrcode-option' }, [el('strong', {}, '前景顏色：'), colorInput('qr-url-dark', '#000000')]),
        el('div', { className: 'qrcode-option' }, [el('strong', {}, '背景顏色：'), colorInput('qr-url-light', '#ffffff')]),
      ]),
      el('div', { className: 'tool-btn-row' }, [
        el('button', { type: 'button', className: 'btn btn-primary tool-btn', onclick: generateUrlQr }, '產生'),
      ]),
      el('div', { className: 'qrcode-preview-wrap' }, [urlHost, urlDownload]),
    ]);

    app.appendChild(el('div', { className: 'tool-form' }, [
      el('div', { className: 'qrcode-intro tool-panel-card' }, [
        el('p', { className: 'qrcode-lead' },
          'QR Code 是二維條碼的一種，1994 年由日本 Denso-Wave 公司發明。QR 來自 Quick Response（快速反應），表示內容可被快速解碼。'),
      ]),
      el('ul', { className: 'nav nav-tabs tool-tabs', role: 'tablist' }, [
        el('li', { className: 'nav-item' }, el('button', {
          className: 'nav-link active', 'data-bs-toggle': 'tab', 'data-bs-target': `#${tabId}-text`, type: 'button',
        }, '文字')),
        el('li', { className: 'nav-item' }, el('button', {
          className: 'nav-link', 'data-bs-toggle': 'tab', 'data-bs-target': `#${tabId}-url`, type: 'button',
        }, '網址')),
      ]),
      el('div', { className: 'tab-content mt-3' }, [textPane, urlPane]),
    ]));

    bindTextInputs();
    if (window.qrcodegen) redrawTextQr();
    if (window.QRCode) generateUrlQr();
  };
})();
