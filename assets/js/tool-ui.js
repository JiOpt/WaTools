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

  function copyBtn(text) {
    const getText = typeof text === 'function' ? text : () => text;
    return btn('複製', 'btn btn-outline-secondary btn-sm tool-copy-btn', async () => {
      try {
        await navigator.clipboard.writeText(getText() || '');
        showAlert('已複製到剪貼簿', 'success');
      } catch {
        showAlert('無法複製，請手動選取文字', 'warning');
      }
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

  function showAlert(msg, type) {
    const app = document.getElementById('tool-app');
    const host = app || document.querySelector('.tool-app') || document.body;
    host.querySelectorAll('.tool-alert').forEach((node) => node.remove());
    const alertEl = el('div', {
      className: `alert alert-${type || 'info'} tool-alert`,
      role: 'alert',
    }, msg);
    host.insertBefore(alertEl, host.firstChild);
    setTimeout(() => alertEl.remove(), 4000);
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
    bindIO,
    tableFrom,
    fileInput,
    alert: showAlert,
    randomInt,
    randomChoice,
    shuffle,
  };
})();
