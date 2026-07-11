(function () {
  'use strict';

  function el(tag, attrs, children) {
    const node = document.createElement(tag);
    if (attrs && typeof attrs === 'object') {
      Object.entries(attrs).forEach(([key, val]) => {
        if (val == null) return;
        if (key === 'className') {
          node.className = val;
        } else if (key === 'dataset' && typeof val === 'object') {
          Object.assign(node.dataset, val);
        } else if (key === 'style' && typeof val === 'object') {
          Object.assign(node.style, val);
        } else if (key === 'html') {
          node.innerHTML = val;
        } else if (key.startsWith('on') && typeof val === 'function') {
          node.addEventListener(key.slice(2).toLowerCase(), val);
        } else if (typeof val === 'boolean') {
          if (val) node.setAttribute(key, '');
        } else {
          node.setAttribute(key, val);
        }
      });
    }
    const list = children == null ? [] : Array.isArray(children) ? children : [children];
    list.forEach((child) => {
      if (child == null || child === false) return;
      if (typeof child === 'string' || typeof child === 'number') {
        node.appendChild(document.createTextNode(String(child)));
      } else {
        node.appendChild(child);
      }
    });
    return node;
  }

  function panel(title, content) {
    const parts = [];
    if (title) {
      parts.push(el('h3', { className: 'tool-panel-title' }, title));
    }
    const bodyChildren = Array.isArray(content) ? content : [content];
    parts.push(el('div', { className: 'tool-panel-body' }, bodyChildren));
    return el('div', { className: 'tool-panel-card' }, parts);
  }

  function row2(left, right) {
    return el('div', { className: 'tool-row2' }, [
      el('div', { className: 'tool-row2-col' }, left),
      el('div', { className: 'tool-row2-col' }, right),
    ]);
  }

  function fieldWrap(labelText, control) {
    return el('div', { className: 'tool-field' }, [
      labelText ? el('label', { className: 'tool-label' }, labelText) : null,
      control,
    ]);
  }

  function textarea(label, id, placeholder, rows) {
    return fieldWrap(
      label,
      el('textarea', {
        className: 'form-control tool-textarea',
        id,
        placeholder: placeholder || '',
        rows: rows || 5,
      })
    );
  }

  function input(label, id, type, placeholder) {
    return fieldWrap(
      label,
      el('input', {
        className: 'form-control tool-input',
        type: type || 'text',
        id,
        placeholder: placeholder || '',
      })
    );
  }

  function select(label, id, options) {
    const opts = (options || []).map((o) => {
      if (typeof o === 'string') return el('option', { value: o }, o);
      const attrs = { value: o.value };
      if (o.selected) attrs.selected = true;
      return el('option', attrs, o.label ?? o.text ?? o.value);
    });
    return fieldWrap(
      label,
      el('select', { className: 'form-select tool-select', id }, opts)
    );
  }

  function btn(text, className, onClick) {
    const button = el('button', {
      type: 'button',
      className: className || 'btn btn-primary tool-btn',
    }, text);
    if (onClick) button.addEventListener('click', onClick);
    return button;
  }

  function btnGroup(buttons) {
    return el('div', { className: 'tool-btn-row' }, buttons || []);
  }

  function output(id) {
    const attrs = { className: 'tool-result' };
    if (id) attrs.id = id;
    return el('pre', attrs);
  }

  function copyText(text, successMsg) {
    const val = text == null ? '' : String(text);
    const notify = (msg, type) => showAlert(msg, type || 'success');
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(val).then(
        () => { notify(successMsg || '已複製到剪貼簿'); return true; },
        () => fallbackCopy(val, successMsg),
      );
    }
    return Promise.resolve(fallbackCopy(val, successMsg));
  }

  function fallbackCopy(text, successMsg) {
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.left = '-9999px';
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand('copy');
      ta.remove();
      if (ok) {
        showAlert(successMsg || '已複製到剪貼簿', 'success');
        return true;
      }
    } catch {
      /* ignore */
    }
    showAlert('無法複製，請手動選取文字', 'warning');
    return false;
  }

  function copyBtn(text) {
    const getText = typeof text === 'function' ? text : () => text;
    return btn('複製', 'btn btn-outline-secondary btn-sm tool-copy-btn', () => {
      copyText(getText() || '', '已複製到剪貼簿');
    });
  }

  function bindIO({ input: inputRef, output: outputRef, transform, btnText }) {
    const inputEl = typeof inputRef === 'string' ? document.getElementById(inputRef) : inputRef;
    const outputEl = typeof outputRef === 'string' ? document.getElementById(outputRef) : outputRef;

    return btn(btnText || '執行', 'btn btn-primary tool-btn', () => {
      try {
        const raw = inputEl?.value ?? '';
        const result = transform ? transform(raw, inputEl) : raw;
        if (!outputEl) return;
        if (outputEl.tagName === 'PRE' || outputEl.tagName === 'TEXTAREA') {
          outputEl.textContent = result ?? '';
        } else {
          outputEl.textContent = result ?? '';
        }
      } catch (err) {
        showAlert(err.message || String(err), 'danger');
      }
    });
  }

  function tableFrom(data, columns) {
    const wrapper = el('div', { className: 'tool-table-wrap' });
    const searchInput = el('input', {
      type: 'search',
      className: 'form-control tool-table-search',
      placeholder: '搜尋…',
    });
    wrapper.appendChild(
      el('div', { className: 'tool-field tool-table-filter' }, searchInput)
    );

    const cols = (columns || []).map((c) =>
      typeof c === 'string' ? { key: c, label: c } : c
    );
    const table = el('table', { className: 'table table-hover tool-table' });
    const headerRow = el('tr');
    cols.forEach((c) => headerRow.appendChild(el('th', {}, c.label)));
    table.appendChild(el('thead', {}, headerRow));

    const tbody = el('tbody');
    table.appendChild(tbody);
    wrapper.appendChild(el('div', { className: 'table-responsive' }, table));

    function renderRows(filter) {
      tbody.replaceChildren();
      const q = (filter || '').trim().toLowerCase();
      (data || [])
        .filter((row) => {
          if (!q) return true;
          return cols.some((c) =>
            String(row[c.key] ?? '').toLowerCase().includes(q)
          );
        })
        .forEach((row) => {
          const tr = el('tr');
          cols.forEach((c) => {
            const val = c.render ? c.render(row[c.key], row) : row[c.key];
            tr.appendChild(el('td', {}, val ?? ''));
          });
          tbody.appendChild(tr);
        });
    }

    searchInput.addEventListener('input', () => renderRows(searchInput.value));
    renderRows('');
    return wrapper;
  }

  function fileInput(accept, onFile) {
    const input = el('input', {
      type: 'file',
      className: 'tool-file-input',
      accept: accept || '',
    });
    input.style.display = 'none';

    const nameSpan = el('span', { className: 'tool-file-name' }, '未選擇檔案');
    input.addEventListener('change', () => {
      const file = input.files?.[0];
      nameSpan.textContent = file?.name || '未選擇檔案';
      if (file && onFile) onFile(file, input);
    });

    const pickBtn = btn('選擇檔案', 'btn btn-outline-primary tool-file-btn', () => input.click());
    return el('div', { className: 'tool-file-wrap' }, [pickBtn, nameSpan, input]);
  }

  function getToastHost() {
    let host = document.getElementById('tool-toast-host');
    if (!host) {
      host = el('div', {
        id: 'tool-toast-host',
        className: 'tool-toast-host',
        'aria-live': 'polite',
        'aria-relevant': 'additions',
      });
      document.body.appendChild(host);
    }
    return host;
  }

  function showAlert(msg, type) {
    const host = getToastHost();
    host.querySelectorAll('.tool-toast').forEach((node) => node.remove());

    const alertEl = el('div', {
      className: `alert alert-${type || 'info'} tool-toast`,
      role: 'alert',
    }, msg);
    host.appendChild(alertEl);

    requestAnimationFrame(() => alertEl.classList.add('is-visible'));

    const dismiss = () => {
      alertEl.classList.remove('is-visible');
      alertEl.classList.add('is-leaving');
      window.setTimeout(() => alertEl.remove(), 280);
    };
    window.setTimeout(dismiss, 4000);
  }

  function randomInt(min, max) {
    const lo = Math.ceil(min);
    const hi = Math.floor(max);
    return Math.floor(Math.random() * (hi - lo + 1)) + lo;
  }

  function randomChoice(arr) {
    if (!arr?.length) return undefined;
    return arr[randomInt(0, arr.length - 1)];
  }

  function shuffle(arr) {
    const copy = arr.slice();
    for (let i = copy.length - 1; i > 0; i--) {
      const j = randomInt(0, i);
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  const imageLightbox = (function createImageLightbox() {
    let overlay = null;
    let prevFocus = null;

    function onKey(e) {
      if (e.key === 'Escape') close();
    }

    function close() {
      if (!overlay) return;
      overlay.hidden = true;
      document.body.classList.remove('image-lightbox-open');
      document.removeEventListener('keydown', onKey);
      if (prevFocus && typeof prevFocus.focus === 'function') prevFocus.focus();
      prevFocus = null;
    }

    function ensure() {
      if (overlay) return overlay;
      overlay = el('div', {
        className: 'image-lightbox',
        hidden: true,
        role: 'dialog',
        'aria-modal': 'true',
        'aria-label': '放大圖片',
        onClick: (e) => {
          if (e.target === overlay) close();
        },
      }, [
        el('div', { className: 'image-lightbox-panel', onClick: (e) => e.stopPropagation() }, [
          el('button', {
            type: 'button',
            className: 'image-lightbox-close',
            'aria-label': '關閉',
            onClick: close,
          }, '×'),
          el('img', { className: 'image-lightbox-img', alt: '' }),
          el('p', { className: 'image-lightbox-caption' }),
        ]),
      ]);
      document.body.appendChild(overlay);
      return overlay;
    }

    function open({ src, alt, caption }) {
      if (!src) return;
      prevFocus = document.activeElement;
      const box = ensure();
      const img = box.querySelector('.image-lightbox-img');
      const cap = box.querySelector('.image-lightbox-caption');
      img.src = src;
      img.alt = alt || '';
      if (caption) {
        cap.textContent = caption;
        cap.hidden = false;
      } else {
        cap.hidden = true;
      }
      box.hidden = false;
      document.body.classList.add('image-lightbox-open');
      document.addEventListener('keydown', onKey);
      box.querySelector('.image-lightbox-close').focus();
    }

    return { open, close };
  }());

  function bindImageZoom(img, meta) {
    if (!img || img.tagName !== 'IMG' || !img.getAttribute('src')) return img;
    img.classList.add('image-zoomable');
    img.tabIndex = 0;
    img.setAttribute('role', 'button');
    img.title = (meta && meta.title) || '點擊放大';
    const open = () => imageLightbox.open({
      src: img.src,
      alt: img.alt,
      caption: (meta && meta.caption) || img.alt,
    });
    img.addEventListener('click', (e) => {
      e.stopPropagation();
      open();
    });
    img.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        e.stopPropagation();
        open();
      }
    });
    return img;
  }

  function decodeHtmlEntities(str) {
    if (typeof str !== 'string' || !/&(?:#\d+|#x[\da-f]+|\w+);/i.test(str)) return str;
    const ta = document.createElement('textarea');
    ta.innerHTML = str;
    return ta.value;
  }

  window.WA_TOOL_UI = {
    el,
    panel,
    row2,
    textarea,
    input,
    select,
    btn,
    btnGroup,
    output,
    copyBtn,
    copyText,
    bindIO,
    tableFrom,
    fileInput,
    alert: showAlert,
    randomInt,
    randomChoice,
    shuffle,
    bindImageZoom,
    imageLightbox,
    decodeHtmlEntities,
  };
})();
