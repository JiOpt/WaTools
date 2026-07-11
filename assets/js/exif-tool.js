/**
 * Photo EXIF reader — GPS, camera, timestamps, software (exifr)
 */
(function () {
  'use strict';

  const R = window.WA_TOOL_REGISTRY = window.WA_TOOL_REGISTRY || {};
  const U = window.WA_TOOL_UI;

  function el(tag, attrs, children) {
    if (U?.el) return U.el(tag, attrs, children);
    const node = document.createElement(tag);
    if (attrs) {
      Object.entries(attrs).forEach(([k, v]) => {
        if (v == null) return;
        if (k === 'className') node.className = v;
        else if (k === 'html') node.innerHTML = v;
        else if (k.startsWith('on') && typeof v === 'function') node.addEventListener(k.slice(2).toLowerCase(), v);
        else node.setAttribute(k, v);
      });
    }
    const list = children == null ? [] : Array.isArray(children) ? children : [children];
    list.forEach((c) => { if (c != null) node.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); });
    return node;
  }

  function panel(title, content) {
    if (U?.panel) return U.panel(title, content);
    return el('div', { className: 'tool-panel-card exif-section' }, [
      el('h3', { className: 'tool-panel-title' }, title),
      el('div', { className: 'tool-panel-body' }, content),
    ]);
  }

  function kvTable(rows) {
    const tbody = el('tbody');
    rows.forEach(([label, value]) => {
      tbody.appendChild(el('tr', {}, [
        el('th', { scope: 'row' }, label),
        el('td', {}, value == null || value === '' ? '—' : value),
      ]));
    });
    if (!rows.length) {
      return el('p', { className: 'text-muted small mb-0' }, '此區塊無可用資料。');
    }
    return el('div', { className: 'table-responsive tool-kv-wrap' }, [
      el('table', { className: 'table tool-kv-table mb-0' }, tbody),
    ]);
  }

  function pick(obj, ...keys) {
    for (const k of keys) {
      if (obj != null && obj[k] != null && obj[k] !== '') return obj[k];
    }
    return null;
  }

  function formatBytes(n) {
    if (n < 1024) return `${n} B`;
    if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
    return `${(n / (1024 * 1024)).toFixed(2)} MB`;
  }

  function formatCoord(n) {
    if (n == null || Number.isNaN(Number(n))) return null;
    return Number(n).toFixed(8);
  }

  function formatExposure(v) {
    if (v == null) return null;
    if (typeof v === 'string') return v;
    if (v >= 1) return `${Number(v).toFixed(v % 1 ? 2 : 0)} 秒`;
    const denom = Math.round(1 / v);
    return denom ? `1/${denom} 秒` : `${v} 秒`;
  }

  function formatAperture(v) {
    if (v == null) return null;
    const n = Number(v);
    return Number.isNaN(n) ? String(v) : `f/${n.toFixed(1)}`;
  }

  function formatFocal(v) {
    if (v == null) return null;
    const n = Number(v);
    return Number.isNaN(n) ? String(v) : `${n.toFixed(1)} mm`;
  }

  function formatDirection(deg, ref) {
    if (deg == null) return null;
    const n = Number(deg);
    if (Number.isNaN(n)) return String(deg);
    const dirs = ['北', '東北', '東', '東南', '南', '西南', '西', '西北'];
    const idx = Math.round(n / 45) % 8;
    const refNote = ref ? `（參考：${ref}）` : '';
    return `${n.toFixed(2)}°（約 ${dirs[idx]}）${refNote}`;
  }

  function formatDateTime(v) {
    if (v == null) return null;
    const d = v instanceof Date ? v : new Date(v);
    if (Number.isNaN(+d)) return String(v);
    return `${d.toLocaleString('zh-TW', { hour12: false })}\n（${d.toISOString()}）`;
  }

  function inferLensRole(mm35) {
    if (mm35 == null) return null;
    const n = Number(mm35);
    if (Number.isNaN(n)) return null;
    if (n < 20) return '超廣角鏡頭';
    if (n <= 50) return '主鏡頭／標準鏡頭';
    return '長焦鏡頭';
  }

  function colorSpaceLabel(v) {
    if (v == null) return null;
    if (typeof v === 'string') return v;
    const map = { 1: 'sRGB', 65535: 'Uncalibrated', 2: 'Adobe RGB' };
    return map[v] || `色域代碼 ${v}`;
  }

  function buildSections(meta, gps, file) {
    const lat = pick(gps, 'latitude') ?? pick(meta, 'latitude', 'GPSLatitude');
    const lon = pick(gps, 'longitude') ?? pick(meta, 'longitude', 'GPSLongitude');
    const alt = pick(gps, 'altitude') ?? pick(meta, 'GPSAltitude', 'altitude');
    const altRef = pick(meta, 'GPSAltitudeRef');
    const direction = pick(meta, 'GPSImgDirection', 'ImgDirection');
    const directionRef = pick(meta, 'GPSImgDirectionRef');
    const pressure = pick(meta, 'Pressure', 'AmbientPressure');

    let mapLink = null;
    if (lat != null && lon != null) {
      const latS = formatCoord(lat);
      const lonS = formatCoord(lon);
      const osm = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=18/${lat}/${lon}`;
      mapLink = el('a', { href: osm, target: '_blank', rel: 'noopener noreferrer' }, '在 OpenStreetMap 開啟位置');
    }

    const geoRows = [
      ['緯度 Latitude', lat != null ? `${formatCoord(lat)}°` : null],
      ['經度 Longitude', lon != null ? `${formatCoord(lon)}°` : null],
      ['地圖定位', mapLink],
      ['海拔高度 Altitude', alt != null ? `${Number(alt).toFixed(2)} m${altRef === 1 ? '（海平面以下）' : ''}` : null],
      ['氣壓 Pressure', pressure != null ? `${pressure} hPa` : null],
      ['拍攝方位角 Direction', formatDirection(direction, directionRef)],
      ['GPS 水平誤差', pick(meta, 'GPSHPositioningError') != null ? `${meta.GPSHPositioningError} m` : null],
    ];

    const focal35 = pick(meta, 'FocalLengthIn35mmFormat', 'FocalLengthIn35mmEquivalent');
    const cameraRows = [
      ['相機品牌 Make', pick(meta, 'Make')],
      ['相機型號 Model', pick(meta, 'Model')],
      ['鏡頭製造商 Lens Make', pick(meta, 'LensMake')],
      ['鏡頭型號 Lens Model', pick(meta, 'LensModel', 'Lens')],
      ['鏡頭資訊 Lens Info', pick(meta, 'LensInfo')],
      ['鏡頭角色（推估）', inferLensRole(focal35)],
      ['光圈 Aperture', formatAperture(pick(meta, 'FNumber', 'ApertureValue'))],
      ['快門 Shutter Speed', formatExposure(pick(meta, 'ExposureTime', 'ShutterSpeedValue'))],
      ['感光度 ISO', pick(meta, 'ISO', 'ISOSpeedRatings')],
      ['焦距 Focal Length', formatFocal(pick(meta, 'FocalLength'))],
      ['等效 35mm 焦距', focal35 != null ? `${focal35} mm` : null],
      ['測光模式 Metering Mode', pick(meta, 'MeteringMode')],
      ['白平衡 White Balance', pick(meta, 'WhiteBalance')],
      ['閃光燈 Flash', pick(meta, 'Flash')],
      ['曝光補償', pick(meta, 'ExposureCompensation') != null ? `${meta.ExposureCompensation} EV` : null],
      ['曝光模式', pick(meta, 'ExposureMode', 'ExposureProgram')],
      ['數位變焦比', pick(meta, 'DigitalZoomRatio')],
    ];

    const w = pick(meta, 'ExifImageWidth', 'ImageWidth', 'PixelXDimension');
    const h = pick(meta, 'ExifImageHeight', 'ImageHeight', 'PixelYDimension');
    const timeRows = [
      ['拍攝時間 DateTimeOriginal', formatDateTime(pick(meta, 'DateTimeOriginal'))],
      ['數位化時間 DateTimeDigitized', formatDateTime(pick(meta, 'CreateDate', 'DateTimeDigitized'))],
      ['EXIF 修改時間 ModifyDate', formatDateTime(pick(meta, 'ModifyDate'))],
      ['檔案最後修改（瀏覽器）', formatDateTime(file.lastModified)],
      ['原始解析度', w && h ? `${w} × ${h}` : null],
      ['Orientation', pick(meta, 'Orientation')],
      ['色彩空間 Color Space', colorSpaceLabel(pick(meta, 'ColorSpace'))],
      ['ICC 描述', pick(meta, 'ProfileDescription')],
      ['壓縮 Compression', pick(meta, 'Compression')],
      ['位元深度 Bits Per Sample', pick(meta, 'BitsPerSample')],
      ['MIME 類型', file.type || null],
      ['檔案大小', formatBytes(file.size)],
    ];

    const softRows = [
      ['軟體 Software', pick(meta, 'Software', 'ProcessingSoftware')],
      ['宿主電腦 HostComputer', pick(meta, 'HostComputer')],
      ['攝影師 Artist', pick(meta, 'Artist', 'Byline', 'XPAuthor')],
      ['版權 Copyright', pick(meta, 'Copyright', 'CopyrightNotice')],
      ['影像說明', pick(meta, 'ImageDescription', 'Caption')],
      ['相機序號', pick(meta, 'SerialNumber', 'CameraSerialNumber', 'BodySerialNumber')],
      ['鏡頭序號', pick(meta, 'LensSerialNumber')],
      ['Owner / 擁有者', pick(meta, 'OwnerName')],
    ];

    return [
      { title: '1. 地理與空間資訊（隱私敏感）', rows: geoRows, warn: true },
      { title: '2. 光學與相機硬體參數', rows: cameraRows },
      { title: '3. 時間與檔案屬性', rows: timeRows },
      { title: '4. 軟體後製與擁有者資訊', rows: softRows },
    ];
  }

  function renderRawDump(meta) {
    if (!meta || !Object.keys(meta).length) return null;
    const lines = Object.keys(meta).sort().map((k) => {
      const v = meta[k];
      const text = v instanceof Date ? v.toISOString() : (typeof v === 'object' ? JSON.stringify(v) : String(v));
      return `${k}: ${text}`;
    });
    return el('details', { className: 'exif-raw-dump' }, [
      el('summary', {}, `完整原始標籤（${lines.length} 項）`),
      el('pre', { className: 'tool-result exif-raw-pre' }, lines.join('\n')),
    ]);
  }

  R.exif = function (app) {
    app.classList.add('exif-app');
    const status = el('p', { className: 'exif-status text-muted small' }, '請選擇相片檔案（JPEG、PNG、HEIC、TIFF、WebP 等）');
    const sectionsHost = el('div', { className: 'exif-sections' });
    const rawHost = el('div', { className: 'exif-raw-host' });

    async function analyze(file) {
      if (!window.exifr) {
        status.textContent = 'EXIF 函式庫載入失敗，請重新整理頁面。';
        return;
      }
      status.textContent = `正在解析：${file.name}…`;
      sectionsHost.replaceChildren();
      rawHost.replaceChildren();

      try {
        const parseOpts = {
          tiff: true,
          xmp: true,
          icc: true,
          iptc: true,
          jfif: true,
          ifd0: true,
          exif: true,
          gps: true,
          mergeOutput: true,
          translateKeys: true,
          translateValues: true,
          reviveValues: true,
          sanitize: true,
        };
        const [meta, gps] = await Promise.all([
          exifr.parse(file, parseOpts),
          exifr.gps(file).catch(() => null),
        ]);

        if (!meta || !Object.keys(meta).length) {
          status.textContent = `${file.name} — 未找到 EXIF／metadata（僅顯示檔案屬性）`;
          sectionsHost.appendChild(panel('3. 時間與檔案屬性', kvTable([
            ['檔名', file.name],
            ['檔案大小', formatBytes(file.size)],
            ['MIME', file.type || '未知'],
            ['最後修改', formatDateTime(file.lastModified)],
          ])));
          return;
        }

        const sections = buildSections(meta, gps, file);
        sections.forEach((sec) => {
          const body = [kvTable(sec.rows)];
          if (sec.warn) {
            body.unshift(el('p', { className: 'exif-privacy-note' }, '⚠ GPS 與方位角可能暴露拍攝地點，分享前請考慮移除或模糊化。'));
          }
          sectionsHost.appendChild(panel(sec.title, body));
        });
        rawHost.appendChild(renderRawDump(meta));
        status.textContent = `${file.name} — 解析完成`;
      } catch (err) {
        console.error('[exif]', err);
        status.textContent = `解析失敗：${err.message || err}`;
        if (U?.alert) U.alert('無法讀取此檔案的 EXIF：' + (err.message || '未知錯誤'), 'danger');
      }
    }

    const fileWrap = U?.fileInput
      ? U.fileInput('image/*', analyze)
      : (() => {
        const input = el('input', { type: 'file', accept: 'image/*', className: 'form-control tool-file-input' });
        input.addEventListener('change', () => { const f = input.files?.[0]; if (f) analyze(f); });
        return input;
      })();

    app.appendChild(el('div', { className: 'tool-form' }, [
      el('p', { className: 'text-muted small mb-3' }, '讀取相片 EXIF／XMP／GPS——上傳後在裝置本機解析，不會傳到伺服器。'),
      U?.field ? U.field('選擇相片', fileWrap) : el('div', { className: 'tool-field' }, [el('label', { className: 'tool-label' }, '選擇相片'), fileWrap]),
      status,
      sectionsHost,
      rawHost,
    ]));
  };
})();
