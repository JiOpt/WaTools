(function () {
  'use strict';

  const STORAGE_KEY = 'watools-font-size';
  const SIZES = ['sm', 'md', 'lg'];

  function getSaved() {
    try {
      const value = localStorage.getItem(STORAGE_KEY);
      return SIZES.includes(value) ? value : 'md';
    } catch {
      return 'md';
    }
  }

  function apply(size) {
    document.documentElement.setAttribute('data-font-size', size);
  }

  function save(size) {
    try {
      localStorage.setItem(STORAGE_KEY, size);
    } catch {
      /* file:// or quota */
    }
  }

  function updateButtons(root, active) {
    root.querySelectorAll('[data-size]').forEach((btn) => {
      const on = btn.dataset.size === active;
      btn.classList.toggle('is-active', on);
      btn.setAttribute('aria-pressed', String(on));
    });
  }

  function setupFontSizeControl() {
    const container = document.querySelector('#header .branding .container');
    if (!container || document.getElementById('font-size-control')) return;

    const wrap = document.createElement('div');
    wrap.className = 'font-size-control';
    wrap.id = 'font-size-control';
    wrap.setAttribute('role', 'group');
    wrap.setAttribute('aria-label', '字體大小');
    wrap.innerHTML = `
      <span class="font-size-control-label">字級</span>
      <div class="font-size-control-btns">
        <button type="button" class="font-size-btn" data-size="sm" aria-pressed="false" title="小字">小</button>
        <button type="button" class="font-size-btn" data-size="md" aria-pressed="true" title="中字（預設）">中</button>
        <button type="button" class="font-size-btn" data-size="lg" aria-pressed="false" title="大字">大</button>
      </div>
    `;

    const historyWrap = container.querySelector('.nav-history-cta-wrap');
    const cta = container.querySelector('.cta-btn');
    const nav = container.querySelector('#navmenu');

    if (historyWrap) {
      historyWrap.before(wrap);
    } else if (cta) {
      cta.before(wrap);
    } else if (nav) {
      nav.after(wrap);
    } else {
      container.appendChild(wrap);
    }

    const current = getSaved();
    apply(current);
    updateButtons(wrap, current);

    wrap.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-size]');
      if (!btn) return;
      const size = btn.dataset.size;
      save(size);
      apply(size);
      updateButtons(wrap, size);
    });

    window.addEventListener('storage', (e) => {
      if (e.key !== STORAGE_KEY) return;
      const size = getSaved();
      apply(size);
      updateButtons(wrap, size);
    });
  }

  apply(getSaved());

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupFontSizeControl);
  } else {
    setupFontSizeControl();
  }
})();
