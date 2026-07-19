(function () {
  'use strict';

  var STORAGE_KEY = 'mytoolife-user-prefs';
  var LEGACY_FONT_KEY = 'mytoolife-font-size';
  var OLD_STORAGE_KEY = 'mytoolife-user-prefs';
  var OLD_FONT_KEY = 'mytoolife-font-size';

  function migrateLegacyStorage() {
    try {
      if (!localStorage.getItem(STORAGE_KEY) && localStorage.getItem(OLD_STORAGE_KEY)) {
        localStorage.setItem(STORAGE_KEY, localStorage.getItem(OLD_STORAGE_KEY));
        localStorage.removeItem(OLD_STORAGE_KEY);
      }
      if (!localStorage.getItem(LEGACY_FONT_KEY) && localStorage.getItem(OLD_FONT_KEY)) {
        localStorage.setItem(LEGACY_FONT_KEY, localStorage.getItem(OLD_FONT_KEY));
        localStorage.removeItem(OLD_FONT_KEY);
      }
    } catch (e) {
      /* ignore */
    }
  }

  var DEFAULTS = {
    theme: 'light',
    fontSize: 'md',
    lineHeight: 'normal',
    eyeSaver: 'off',
    reducedMotion: false,
    focusVisible: false,
    highContrast: false,
    pageZoom: 100,
    zhVariant: 'trad',
    locale: 'zh',
  };

  function readRaw() {
    migrateLegacyStorage();
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
        var legacy = localStorage.getItem(LEGACY_FONT_KEY) || localStorage.getItem(OLD_FONT_KEY);
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
    window.dispatchEvent(new CustomEvent('mytoolife:prefs-changed', { detail: next }));
    if (window.WA_ZH_VARIANT?.apply) {
      window.WA_ZH_VARIANT.apply(next.zhVariant === 'simp' ? 'simp' : 'trad');
    }
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
    root.setAttribute('data-zh-variant', prefs.zhVariant === 'simp' ? 'simp' : 'trad');
    var pathLocale = window.WA_LOCALE?.current ? window.WA_LOCALE.current() : (/^\/en(\/|$)/i.test(location.pathname) ? 'en' : 'zh');
    root.setAttribute('data-locale', pathLocale);
  }

  function reset() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      /* ignore */
    }
    var defaults = Object.assign({}, DEFAULTS);
    apply(defaults);
    window.dispatchEvent(new CustomEvent('mytoolife:prefs-changed', { detail: defaults }));
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

  function renderSettingsPage(targetApp) {
    var app = targetApp
      || document.getElementById('tool-app')
      || document.getElementById('settings-app');
    if (!app) return;

    var prefs = load();
    var pathLocale = window.WA_LOCALE?.current ? window.WA_LOCALE.current() : 'zh';
    if (prefs.locale !== pathLocale) {
      prefs = Object.assign({}, prefs, { locale: pathLocale });
    }
    var en = pathLocale === 'en';
    var languageNow = en ? 'en' : (prefs.zhVariant === 'simp' ? 'simp' : 'trad');
    function L(key, zh) {
      if (!en || !window.WA_LOCALE?.t) return zh;
      return window.WA_LOCALE.t('settings.' + key, zh);
    }

    function collectForm() {
      var form = app.querySelector('.prefs-form');
      var data = Object.assign({}, prefs);
      var theme = form.querySelector('input[name="theme"]:checked');
      var fontSize = form.querySelector('input[name="fontSize"]:checked');
      var lineHeight = form.querySelector('input[name="lineHeight"]:checked');
      var eyeSaver = form.querySelector('input[name="eyeSaver"]:checked');
      var language = form.querySelector('input[name="language"]:checked');
      var zoom = form.querySelector('#pref-pageZoom');
      data.theme = theme ? theme.value : prefs.theme;
      data.fontSize = fontSize ? fontSize.value : prefs.fontSize;
      data.lineHeight = lineHeight ? lineHeight.value : prefs.lineHeight;
      data.eyeSaver = eyeSaver ? eyeSaver.value : prefs.eyeSaver;
      var lang = language ? language.value : languageNow;
      if (lang === 'en') {
        data.locale = 'en';
        data.zhVariant = 'trad';
      } else if (lang === 'simp') {
        data.locale = 'zh';
        data.zhVariant = 'simp';
      } else {
        data.locale = 'zh';
        data.zhVariant = 'trad';
      }
      data.reducedMotion = Boolean(form.querySelector('#pref-reducedMotion')?.checked);
      data.focusVisible = Boolean(form.querySelector('#pref-focusVisible')?.checked);
      data.highContrast = Boolean(form.querySelector('#pref-highContrast')?.checked);
      data.pageZoom = Number(zoom?.value || prefs.pageZoom);
      return data;
    }

    function commit() {
      var next = collectForm();
      var localeChanged = next.locale !== pathLocale;
      var variantChanged = next.zhVariant !== prefs.zhVariant && next.locale === 'zh';
      prefs = save(next);
      updateZoomLabel();
      if (localeChanged && window.WA_LOCALE?.switchUrl) {
        location.assign(window.WA_LOCALE.switchUrl(next.locale));
        return;
      }
      if (variantChanged && !localeChanged) {
        /* zhVariant applied via prefs-changed → WA_ZH_VARIANT */
      }
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
      section(L('themeTitle', '深色模式'), L('themeDesc', '減輕夜間瀏覽負擔，或跟隨系統設定自動切換。'), [
        el('div', { className: 'prefs-option-group', role: 'radiogroup', 'aria-label': L('themeTitle', '深色模式') }, [
          optionRow('theme', 'light', L('themeLight', '淺色'), L('themeLightDesc', '預設明亮版面，日間閱讀最清晰。'), 'radio', prefs.theme === 'light'),
          optionRow('theme', 'dark', L('themeDark', '深色'), L('themeDarkDesc', '深色背景搭配較柔和的文字，適合夜間使用。'), 'radio', prefs.theme === 'dark'),
          optionRow('theme', 'auto', L('themeAuto', '跟隨系統'), L('themeAutoDesc', '依裝置的深／淺色模式自動切換。'), 'radio', prefs.theme === 'auto'),
        ]),
      ]),
      section(L('localeTitle', '語系'), L('localeDesc', '選擇繁體中文、簡體中文或英文。英文版使用 /en/ 網址前綴。'), [
        el('div', { className: 'prefs-option-group', role: 'radiogroup', 'aria-label': L('localeTitle', '語系') }, [
          optionRow('language', 'trad', L('localeTrad', '繁體中文'), L('localeTradDesc', '預設繁體中文站點。'), 'radio', languageNow === 'trad'),
          optionRow('language', 'simp', L('localeSimp', '简体中文'), L('localeSimpDesc', '在瀏覽器本地將介面轉為簡體顯示。'), 'radio', languageNow === 'simp'),
          optionRow('language', 'en', L('localeEn', 'English'), L('localeEnDesc', '英文介面、目錄與 /en/ 分頁。'), 'radio', languageNow === 'en'),
        ]),
      ]),
      section(L('fontTitle', '字體大小'), L('fontDesc', '調整整站文字大小，影響工具頁、藏經閣與首頁。'), [
        el('div', { className: 'prefs-option-group', role: 'radiogroup', 'aria-label': L('fontTitle', '字體大小') }, [
          optionRow('fontSize', 'sm', L('fontSm', '小'), L('fontSmDesc', '適合資訊密集、需一屏顯示更多內容。'), 'radio', prefs.fontSize === 'sm'),
          optionRow('fontSize', 'md', L('fontMd', '中（預設）'), L('fontMdDesc', '一般閱讀的預設大小。'), 'radio', prefs.fontSize === 'md'),
          optionRow('fontSize', 'lg', L('fontLg', '大'), L('fontLgDesc', '放大文字，減輕長文閱讀時的視覺負擔。'), 'radio', prefs.fontSize === 'lg'),
        ]),
      ]),
      section(L('lineTitle', '行距'), L('lineDesc', '調整段落與列表的行距，提升長文閱讀舒適度。'), [
        el('div', { className: 'prefs-option-group', role: 'radiogroup', 'aria-label': L('lineTitle', '行距') }, [
          optionRow('lineHeight', 'normal', L('lineNormal', '標準'), L('lineNormalDesc', '預設行距，版面較緊湊。'), 'radio', prefs.lineHeight === 'normal'),
          optionRow('lineHeight', 'relaxed', L('lineRelaxed', '寬鬆'), L('lineRelaxedDesc', '行距加寬，適合長篇閱讀。'), 'radio', prefs.lineHeight === 'relaxed'),
          optionRow('lineHeight', 'loose', L('lineLoose', '更寬'), L('lineLooseDesc', '最大行距，閱讀最輕鬆。'), 'radio', prefs.lineHeight === 'loose'),
        ]),
      ]),
      section(L('eyeTitle', '護眼色溫'), L('eyeDesc', '過濾部分藍光、調暖色溫，減輕長時間注視螢幕的疲勞。'), [
        el('div', { className: 'prefs-option-group', role: 'radiogroup', 'aria-label': L('eyeTitle', '護眼色溫') }, [
          optionRow('eyeSaver', 'off', L('eyeOff', '關閉'), L('eyeOffDesc', '顯示原始色彩。'), 'radio', prefs.eyeSaver === 'off'),
          optionRow('eyeSaver', 'mild', L('eyeMild', '柔和'), L('eyeMildDesc', '輕微暖色調，日常長時間使用。'), 'radio', prefs.eyeSaver === 'mild'),
          optionRow('eyeSaver', 'strong', L('eyeStrong', '強化'), L('eyeStrongDesc', '明顯暖色與去藍光，夜間閱讀更舒適。'), 'radio', prefs.eyeSaver === 'strong'),
        ]),
      ]),
      section(L('zoomTitle', '全頁縮放'), L('zoomDesc', '記住此網站的放大比例，下次開啟無需重新調整。'), [
        el('div', { className: 'prefs-range-wrap' }, [
          el('label', { className: 'prefs-range-label', htmlFor: 'pref-pageZoom' }, [
            el('span', { text: L('zoomLabel', '縮放比例') }),
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
      section(L('a11yTitle', '無障礙與操作'), L('a11yDesc', '改善鍵盤操作、動態敏感與對比度需求。'), [
        toggleRow('reducedMotion', L('reducedMotion', '減低動態效果'), L('reducedMotionDesc', '關閉捲動動畫、懸停特效等，降低視覺幹擾與暈動症不適。'), prefs.reducedMotion),
        toggleRow('focusVisible', L('focusVisible', '強化鍵盤焦點'), L('focusVisibleDesc', 'Tab 鍵操作時顯示更醒目的焦點外框，方便鍵盤導航。'), prefs.focusVisible),
        toggleRow('highContrast', L('highContrast', '高對比模式'), L('highContrastDesc', '強化文字與背景對比，協助視力較弱或辨識困難的讀者。'), prefs.highContrast),
      ]),
      el('div', { className: 'prefs-actions' }, [
        el('button', { type: 'submit', className: 'btn btn-primary prefs-save-btn' }, [L('save', '儲存設定')]),
        el('button', {
          type: 'button',
          className: 'btn btn-outline-secondary prefs-reset-btn',
          onclick: function () {
            prefs = reset();
            renderSettingsPage();
          },
        }, [L('reset', '恢復預設')]),
      ]),
      el('p', { className: 'prefs-note text-muted', text: L('note', '設定會儲存在此瀏覽器，套用至 KaWaTool 全站所有頁面。') }),
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

  window.WA_USER_PREFS.renderSettingsPage = renderSettingsPage;

  if (document.getElementById('settings-app') && !document.getElementById('tool-app')) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function () { renderSettingsPage(); });
    } else {
      renderSettingsPage();
    }
  }
})();
