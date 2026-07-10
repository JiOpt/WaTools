(function () {
  'use strict';

  var STORAGE_KEY = 'watools-user-prefs';
  var LEGACY_FONT_KEY = 'watools-font-size';

  var DEFAULTS = {
    theme: 'light',
    fontSize: 'md',
    lineHeight: 'normal',
    eyeSaver: 'off',
    reducedMotion: false,
    focusVisible: false,
    highContrast: false,
    pageZoom: 100,
  };

  function readRaw() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return {};
      var parsed = JSON.parse(raw);
      return parsed && typeof parsed === 'object' ? parsed : {};
    } catch (e) {
      return {};
    }
  }

  function load() {
    var prefs = Object.assign({}, DEFAULTS, readRaw());
    if (!readRaw().fontSize) {
      try {
        var legacy = localStorage.getItem(LEGACY_FONT_KEY);
        if (legacy === 'sm' || legacy === 'lg') prefs.fontSize = legacy;
      } catch (err) {
        /* ignore */
      }
    }
    return prefs;
  }

  function save(prefs) {
    var next = Object.assign({}, DEFAULTS, prefs);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      localStorage.setItem(LEGACY_FONT_KEY, next.fontSize);
    } catch (e) {
      /* file:// or quota */
    }
    apply(next);
    window.dispatchEvent(new CustomEvent('watools:prefs-changed', { detail: next }));
    return next;
  }

  function resolveTheme(theme) {
    if (theme === 'auto') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return theme === 'dark' ? 'dark' : 'light';
  }

  function apply(prefs) {
    var root = document.documentElement;
    var theme = resolveTheme(prefs.theme);
    root.setAttribute('data-theme', theme);
    root.setAttribute('data-theme-mode', prefs.theme);
    root.setAttribute('data-font-size', prefs.fontSize);
    root.setAttribute('data-line-height', prefs.lineHeight);
    root.setAttribute('data-eye-saver', prefs.eyeSaver);
    root.setAttribute('data-reduced-motion', prefs.reducedMotion ? 'true' : 'false');
    root.setAttribute('data-focus-visible', prefs.focusVisible ? 'true' : 'false');
    root.setAttribute('data-high-contrast', prefs.highContrast ? 'true' : 'false');
    root.setAttribute('data-page-zoom', String(prefs.pageZoom));
    root.style.zoom = prefs.pageZoom === 100 ? '' : String(prefs.pageZoom / 100);
  }

  function reset() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      /* ignore */
    }
    var defaults = Object.assign({}, DEFAULTS);
    apply(defaults);
    window.dispatchEvent(new CustomEvent('watools:prefs-changed', { detail: defaults }));
    return defaults;
  }

  window.WA_USER_PREFS = {
    DEFAULTS: DEFAULTS,
    load: load,
    save: save,
    apply: apply,
    reset: reset,
  };

  apply(load());

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function () {
    var prefs = load();
    if (prefs.theme === 'auto') apply(prefs);
  });

  window.addEventListener('storage', function (e) {
    if (e.key === STORAGE_KEY || e.key === LEGACY_FONT_KEY) apply(load());
  });

  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (key) {
        var val = attrs[key];
        if (val == null) return;
        if (key === 'className') node.className = val;
        else if (key === 'text') node.textContent = val;
        else if (key === 'html') node.innerHTML = val;
        else if (key.startsWith('on') && typeof val === 'function') {
          node.addEventListener(key.slice(2).toLowerCase(), val);
        } else node.setAttribute(key, val);
      });
    }
    (children || []).forEach(function (child) {
      if (child == null) return;
      node.appendChild(typeof child === 'string' ? document.createTextNode(child) : child);
    });
    return node;
  }

  function optionRow(name, value, label, desc, type, checked) {
    var id = 'pref-' + name + '-' + value;
    var input = el('input', {
      type: type || 'radio',
      id: id,
      name: name,
      value: value,
      checked: checked ? 'checked' : null,
    });
    return el('label', { className: 'prefs-option', htmlFor: id }, [
      input,
      el('span', { className: 'prefs-option-body' }, [
        el('span', { className: 'prefs-option-label', text: label }),
        desc ? el('span', { className: 'prefs-option-desc', text: desc }) : null,
      ]),
    ]);
  }

  function toggleRow(name, label, desc, checked) {
    var id = 'pref-' + name;
    return el('label', { className: 'prefs-toggle', htmlFor: id }, [
      el('span', { className: 'prefs-toggle-text' }, [
        el('span', { className: 'prefs-option-label', text: label }),
        desc ? el('span', { className: 'prefs-option-desc', text: desc }) : null,
      ]),
      el('input', {
        type: 'checkbox',
        id: id,
        name: name,
        checked: checked ? 'checked' : null,
      }),
    ]);
  }

  function section(title, desc, bodyChildren) {
    return el('section', { className: 'prefs-section' }, [
      el('h2', { className: 'prefs-section-title', text: title }),
      desc ? el('p', { className: 'prefs-section-desc', text: desc }) : null,
      el('div', { className: 'prefs-section-body' }, bodyChildren),
    ]);
  }

  function renderSettingsPage() {
    var app = document.getElementById('settings-app');
    if (!app) return;

    var prefs = load();

    function collectForm() {
      var form = app.querySelector('.prefs-form');
      var data = Object.assign({}, prefs);
      var theme = form.querySelector('input[name="theme"]:checked');
      var fontSize = form.querySelector('input[name="fontSize"]:checked');
      var lineHeight = form.querySelector('input[name="lineHeight"]:checked');
      var eyeSaver = form.querySelector('input[name="eyeSaver"]:checked');
      var zoom = form.querySelector('#pref-pageZoom');
      data.theme = theme ? theme.value : prefs.theme;
      data.fontSize = fontSize ? fontSize.value : prefs.fontSize;
      data.lineHeight = lineHeight ? lineHeight.value : prefs.lineHeight;
      data.eyeSaver = eyeSaver ? eyeSaver.value : prefs.eyeSaver;
      data.reducedMotion = Boolean(form.querySelector('#pref-reducedMotion')?.checked);
      data.focusVisible = Boolean(form.querySelector('#pref-focusVisible')?.checked);
      data.highContrast = Boolean(form.querySelector('#pref-highContrast')?.checked);
      data.pageZoom = Number(zoom?.value || prefs.pageZoom);
      return data;
    }

    function commit() {
      prefs = save(collectForm());
      updateZoomLabel();
    }

    function updateZoomLabel() {
      var zoom = app.querySelector('#pref-pageZoom');
      var label = app.querySelector('#pref-pageZoom-value');
      if (zoom && label) label.textContent = zoom.value + '%';
    }

    var form = el('form', {
      className: 'prefs-form',
      onsubmit: function (e) { e.preventDefault(); commit(); },
    }, [
      section('深色模式', '減輕夜間瀏覽負擔，或跟隨系統設定自動切換。', [
        el('div', { className: 'prefs-option-group', role: 'radiogroup', 'aria-label': '深色模式' }, [
          optionRow('theme', 'light', '淺色', '預設明亮版面，日間閱讀最清晰。', 'radio', prefs.theme === 'light'),
          optionRow('theme', 'dark', '深色', '深色背景搭配較柔和的文字，適合夜間使用。', 'radio', prefs.theme === 'dark'),
          optionRow('theme', 'auto', '跟隨系統', '依裝置的深／淺色模式自動切換。', 'radio', prefs.theme === 'auto'),
        ]),
      ]),
      section('字體大小', '調整整站文字大小，影響工具頁、藏經閣與首頁。', [
        el('div', { className: 'prefs-option-group', role: 'radiogroup', 'aria-label': '字體大小' }, [
          optionRow('fontSize', 'sm', '小', '適合資訊密集、需一屏顯示更多內容。', 'radio', prefs.fontSize === 'sm'),
          optionRow('fontSize', 'md', '中（預設）', '一般閱讀的預設大小。', 'radio', prefs.fontSize === 'md'),
          optionRow('fontSize', 'lg', '大', '放大文字，減輕長文閱讀時的視覺負擔。', 'radio', prefs.fontSize === 'lg'),
        ]),
      ]),
      section('行距', '調整段落與列表的行距，提升長文閱讀舒適度。', [
        el('div', { className: 'prefs-option-group', role: 'radiogroup', 'aria-label': '行距' }, [
          optionRow('lineHeight', 'normal', '標準', '預設行距，版面較緊湊。', 'radio', prefs.lineHeight === 'normal'),
          optionRow('lineHeight', 'relaxed', '寬鬆', '行距加寬，適合長篇閱讀。', 'radio', prefs.lineHeight === 'relaxed'),
          optionRow('lineHeight', 'loose', '更寬', '最大行距，閱讀最輕鬆。', 'radio', prefs.lineHeight === 'loose'),
        ]),
      ]),
      section('護眼色溫', '過濾部分藍光、調暖色溫，減輕長時間注視螢幕的疲勞。', [
        el('div', { className: 'prefs-option-group', role: 'radiogroup', 'aria-label': '護眼色溫' }, [
          optionRow('eyeSaver', 'off', '關閉', '顯示原始色彩。', 'radio', prefs.eyeSaver === 'off'),
          optionRow('eyeSaver', 'mild', '柔和', '輕微暖色調，日常長時間使用。', 'radio', prefs.eyeSaver === 'mild'),
          optionRow('eyeSaver', 'strong', '強化', '明顯暖色與去藍光，夜間閱讀更舒適。', 'radio', prefs.eyeSaver === 'strong'),
        ]),
      ]),
      section('全頁縮放', '記住此網站的放大比例，下次開啟無需重新調整。', [
        el('div', { className: 'prefs-range-wrap' }, [
          el('label', { className: 'prefs-range-label', htmlFor: 'pref-pageZoom' }, [
            el('span', { text: '縮放比例' }),
            el('strong', { id: 'pref-pageZoom-value', text: String(prefs.pageZoom) + '%' }),
          ]),
          el('input', {
            type: 'range',
            id: 'pref-pageZoom',
            name: 'pageZoom',
            min: '90',
            max: '150',
            step: '5',
            value: String(prefs.pageZoom),
          }),
          el('div', { className: 'prefs-range-ticks' }, [
            el('span', { text: '90%' }),
            el('span', { text: '100%' }),
            el('span', { text: '125%' }),
            el('span', { text: '150%' }),
          ]),
        ]),
      ]),
      section('無障礙與操作', '改善鍵盤操作、動態敏感與對比度需求。', [
        toggleRow('reducedMotion', '減低動態效果', '關閉捲動動畫、懸停特效等，降低視覺幹擾與暈動症不適。', prefs.reducedMotion),
        toggleRow('focusVisible', '強化鍵盤焦點', 'Tab 鍵操作時顯示更醒目的焦點外框，方便鍵盤導航。', prefs.focusVisible),
        toggleRow('highContrast', '高對比模式', '強化文字與背景對比，協助視力較弱或辨識困難的讀者。', prefs.highContrast),
      ]),
      el('div', { className: 'prefs-actions' }, [
        el('button', { type: 'submit', className: 'btn btn-primary prefs-save-btn' }, ['儲存設定']),
        el('button', {
          type: 'button',
          className: 'btn btn-outline-secondary prefs-reset-btn',
          onclick: function () {
            prefs = reset();
            renderSettingsPage();
          },
        }, ['恢復預設']),
      ]),
      el('p', { className: 'prefs-note text-muted', text: '設定會儲存在此瀏覽器，套用至 WaTools 全站所有頁面。' }),
    ]);

    form.addEventListener('change', function (e) {
      if (e.target.matches('input[type="radio"], input[type="checkbox"]')) commit();
    });
    form.addEventListener('input', function (e) {
      if (e.target.id === 'pref-pageZoom') {
        updateZoomLabel();
        commit();
      }
    });

    app.replaceChildren(form);
    updateZoomLabel();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderSettingsPage);
  } else {
    renderSettingsPage();
  }
})();
