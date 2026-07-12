(function () {
  'use strict';

  let published = new Set();
  let dirty = false;
  let saveTimer = null;
  let saving = false;
  let applyingExternal = false;

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function previewUrl(slug) {
    const href = window.WA_TOOL_URLS?.toolHref
      ? window.WA_TOOL_URLS.toolHref(slug)
      : `${slug}.html`;
    return escapeHtml(href);
  }

  function setStatus(text, kind) {
    const el = document.getElementById('plan-status');
    if (!el) return;
    el.textContent = text;
    el.className = `plan-status${kind ? ` plan-status-${kind}` : ''}`;
  }

  function setsEqual(a, b) {
    if (!a || !b || a.size !== b.size) return false;
    for (const slug of a) {
      if (!b.has(slug)) return false;
    }
    return true;
  }

  function syncPublishPreview() {
    const M = window.WA_SITEMAP_MANIFEST;
    if (!M?.setPublishedPreview) return;
    M.setPublishedPreview(published);
    window.dispatchEvent(new CustomEvent('mytoolife:publish-changed'));
  }

  function applyExternalSitemap(text, source) {
    if (applyingExternal || saving) return;
    const M = window.WA_SITEMAP_MANIFEST;
    if (!M) return;

    const next = M.parseText(text);
    if (setsEqual(next, published)) return;

    applyingExternal = true;
    published = next;
    dirty = false;
    syncPublishPreview();
    renderCatalog();
    updateStats();
    applyingExternal = false;

    if (source === 'watch') {
      setStatus('已同步 sitemap.txt 的異動', 'ok');
    } else if (source === 'reload') {
      const updated = M.getUpdated();
      setStatus(updated ? `已重新載入 sitemap.txt（${updated}）` : '已重新載入 sitemap.txt', 'ok');
    }
  }

  async function loadSyncScript() {
    if (window.WA_SITEMAP_FILE_SYNC) return;
    await new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = (window.waAssetUrl || ((p) => p))('assets/js/sitemap-file-sync.js');
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  async function persistManifest() {
    if (saving) return;
    const M = window.WA_SITEMAP_MANIFEST;
    const sync = window.WA_SITEMAP_FILE_SYNC;
    if (!M) return;

    const text = M.serialize(published);
    saving = true;

    try {
      if (sync) {
        const how = await sync.write(text);
        dirty = false;
        syncPublishPreview();
        updateStats();
        if (how === 'api') {
          setStatus('已自動更新 sitemap.txt 與 sitemap-published.js', 'ok');
        } else {
          setStatus('已自動更新 sitemap.txt', 'ok');
        }
        return;
      }

      setStatus('無法寫入 sitemap.txt — 請連結檔案或執行 npm run plan:serve', 'warn');
    } catch (err) {
      console.error('[Kawatool] auto-save failed:', err);
      setStatus('自動儲存失敗 — 請按「連結 sitemap.txt」或「儲存 sitemap.txt」', 'err');
    } finally {
      saving = false;
      const saveBtn = document.getElementById('plan-save');
      if (saveBtn) saveBtn.disabled = !dirty;
    }
  }

  function schedulePersist() {
    if (applyingExternal) return;
    dirty = true;
    const saveBtn = document.getElementById('plan-save');
    if (saveBtn) saveBtn.disabled = false;
    clearTimeout(saveTimer);
    saveTimer = window.setTimeout(() => persistManifest(), 350);
  }

  function applyToggle(slug, turnOn) {
    if (turnOn) published.add(slug);
    else published.delete(slug);
    renderCatalog();
    updateStats();
    syncPublishPreview();
    schedulePersist();
  }

  function collectByPublishState() {
    const catalog = window.WA_TOOLS_CATALOG || [];
    const hidden = [];
    const shown = [];
    catalog.forEach((category) => {
      category.tools.forEach((tool) => {
        const row = {
          slug: tool.slug,
          title: tool.title,
          categoryId: category.id,
          categoryName: category.name,
        };
        if (published.has(tool.slug)) shown.push(row);
        else hidden.push(row);
      });
    });
    return { hidden, shown };
  }

  function renderListTable(container, items, emptyText) {
    if (!container) return;
    if (!items.length) {
      container.innerHTML = `<p class="plan-list-empty text-muted small mb-0">${escapeHtml(emptyText)}</p>`;
      return;
    }

    const isHiddenList = container.id === 'plan-hidden-list';

    container.innerHTML = `
      <div class="table-responsive">
        <table class="plan-list-table">
          <thead>
            <tr>
              <th scope="col">工具</th>
              <th scope="col">分類</th>
              <th scope="col">slug</th>
              <th scope="col" class="plan-list-actions-col">操作</th>
            </tr>
          </thead>
          <tbody>
            ${items.map((item) => `
              <tr data-slug="${escapeHtml(item.slug)}">
                <td class="plan-list-title">
                  <a href="${previewUrl(item.slug)}" target="_blank" rel="noopener noreferrer">${escapeHtml(item.title)}</a>
                </td>
                <td class="plan-list-cat">
                  <a href="#cat-${escapeHtml(item.categoryId)}" class="plan-list-cat-link">${escapeHtml(item.categoryName)}</a>
                </td>
                <td class="plan-list-slug">
                  <a href="${previewUrl(item.slug)}" target="_blank" rel="noopener noreferrer" class="plan-slug-link"><code>${escapeHtml(item.slug)}</code></a>
                </td>
                <td class="plan-list-actions">
                  <button type="button" class="btn btn-sm btn-outline-primary plan-list-toggle" data-slug="${escapeHtml(item.slug)}" data-on="${isHiddenList ? '1' : '0'}">
                    ${isHiddenList ? '改為開放' : '改為隱藏'}
                  </button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>`;

    container.querySelectorAll('.plan-list-toggle').forEach((btn) => {
      btn.addEventListener('click', () => {
        applyToggle(btn.dataset.slug, btn.dataset.on === '1');
      });
    });
  }

  function renderLists() {
    const { hidden, shown } = collectByPublishState();
    const hiddenCount = document.getElementById('plan-hidden-count');
    const publishedCount = document.getElementById('plan-published-count');
    if (hiddenCount) hiddenCount.textContent = String(hidden.length);
    if (publishedCount) publishedCount.textContent = String(shown.length);

    renderListTable(
      document.getElementById('plan-hidden-list'),
      hidden,
      '全部工具皆已開放，沒有不顯示項目。',
    );
    renderListTable(
      document.getElementById('plan-published-list'),
      shown,
      '尚未開放任何工具。',
    );
  }

  async function copySlugList(kind) {
    const { hidden, shown } = collectByPublishState();
    const list = kind === 'hidden' ? hidden : shown;
    const text = list.map((item) => item.slug).sort((a, b) => a.localeCompare(b, 'zh-Hant')).join('\n');
    if (!text) {
      setStatus(kind === 'hidden' ? '沒有不顯示項目可複製' : '沒有已開放項目可複製', 'warn');
      return;
    }
    try {
      await navigator.clipboard.writeText(`${text}\n`);
      setStatus(`已複製 ${list.length} 個 slug`, 'ok');
    } catch {
      setStatus('無法寫入剪貼簿', 'warn');
    }
  }

  function updateStats() {
    const catalog = window.WA_TOOLS_CATALOG || [];
    const total = catalog.reduce((n, c) => n + c.tools.length, 0);
    const on = published.size;
    const stats = document.getElementById('plan-stats');
    if (stats) {
      stats.innerHTML = `<span><i class="bi bi-toggle-on me-1"></i>已開放 <strong>${on}</strong></span>
        <span><i class="bi bi-toggle-off me-1"></i>隱藏 <strong>${total - on}</strong></span>
        <span><i class="bi bi-grid me-1"></i>共 <strong>${total}</strong> 項</span>`;
    }
    const saveBtn = document.getElementById('plan-save');
    if (saveBtn && !saving) saveBtn.disabled = !dirty;
    renderLists();
  }

  function renderCatalog() {
    const catalog = window.WA_TOOLS_CATALOG;
    const container = document.getElementById('tools-catalog');
    if (!catalog || !container) return;

    container.innerHTML = catalog.map((category) => {
      const catOn = category.tools.filter((t) => published.has(t.slug)).length;
      return `
      <section class="tools-category section plan-category" id="cat-${category.id}" data-category="${category.id}">
        <div class="container section-title" data-aos="fade-up">
          <div class="plan-category-head">
            <div>
              <h2>${escapeHtml(category.name)}</h2>
              <p>${escapeHtml(category.tagline)}</p>
            </div>
            <div class="plan-category-actions">
              <span class="plan-category-count">${catOn}/${category.tools.length} 開放</span>
              <button type="button" class="btn btn-sm btn-outline-secondary plan-cat-all" data-cat="${category.id}" data-on="1">全開</button>
              <button type="button" class="btn btn-sm btn-outline-secondary plan-cat-all" data-cat="${category.id}" data-on="0">全關</button>
            </div>
          </div>
        </div>
        <div class="container" data-aos="fade-up" data-aos-delay="100">
          <div class="row gy-4">
            ${category.tools.map((tool) => {
              const on = published.has(tool.slug);
              return `
              <div class="col-xl-2 col-lg-3 col-md-4 col-sm-6">
                <article class="plan-tool-card ${on ? 'is-published' : 'is-hidden'}">
                  <label class="plan-toggle" title="${on ? '已開放 — 出現在 sitemap' : '隱藏 — 不在 sitemap'}">
                    <input type="checkbox" class="plan-toggle-input" data-slug="${escapeHtml(tool.slug)}" ${on ? 'checked' : ''}>
                    <span class="plan-toggle-ui" aria-hidden="true"></span>
                    <span class="visually-hidden">${on ? '開放' : '隱藏'} ${escapeHtml(tool.title)}</span>
                  </label>
                  <a href="${previewUrl(tool.slug)}" target="_blank" rel="noopener noreferrer" class="tool-card ${on ? 'tool-card-ready' : 'tool-card-draft'}">
                    <div class="tool-card-icon"><i class="bi ${escapeHtml(tool.icon)}"></i></div>
                    <div class="tool-card-body">
                      <h3>${escapeHtml(tool.title)}</h3>
                      <p>${escapeHtml(tool.desc)}</p>
                    </div>
                    <span class="tool-badge">${on ? '已開放' : '未完成'}</span>
                  </a>
                  <a href="${previewUrl(tool.slug)}" target="_blank" rel="noopener noreferrer" class="plan-slug plan-slug-link"><code>${escapeHtml(tool.slug)}</code></a>
                </article>
              </div>`;
            }).join('')}
          </div>
        </div>
      </section>`;
    }).join('');

    container.querySelectorAll('.plan-toggle-input').forEach((input) => {
      input.addEventListener('change', () => {
        applyToggle(input.dataset.slug, input.checked);
      });
    });

    container.querySelectorAll('.plan-cat-all').forEach((btn) => {
      btn.addEventListener('click', () => {
        const catId = btn.dataset.cat;
        const turnOn = btn.dataset.on === '1';
        const category = catalog.find((c) => c.id === catId);
        if (!category) return;
        category.tools.forEach((t) => {
          if (turnOn) published.add(t.slug);
          else published.delete(t.slug);
        });
        renderCatalog();
        updateStats();
        syncPublishPreview();
        schedulePersist();
      });
    });
  }

  async function saveManifest() {
    clearTimeout(saveTimer);
    await persistManifest();
    if (dirty) {
      const M = window.WA_SITEMAP_MANIFEST;
      if (!M) return;
      const text = M.serialize(published);
      const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'sitemap.txt';
      a.click();
      URL.revokeObjectURL(url);
      dirty = false;
      updateStats();
      setStatus('已下載 sitemap.txt — 請覆蓋專案根目錄', 'ok');
    }
  }

  async function copyManifest() {
    const text = window.WA_SITEMAP_MANIFEST.serialize(published);
    try {
      await navigator.clipboard.writeText(text);
      setStatus('已複製 sitemap.txt 內容到剪貼簿', 'ok');
    } catch {
      setStatus('無法寫入剪貼簿，請改用下載', 'warn');
    }
  }

  async function reloadManifest() {
    const sync = window.WA_SITEMAP_FILE_SYNC;
    if (!sync) return;
    try {
      const text = await sync.read();
      applyExternalSitemap(text, 'reload');
      await sync.refreshSnapshot();
    } catch (err) {
      setStatus('重新載入失敗 — 請確認 sitemap.txt 已連結', 'err');
    }
  }

  async function linkSitemapFile() {
    const sync = window.WA_SITEMAP_FILE_SYNC;
    if (!sync?.linkLocalFile) return;
    try {
      await sync.linkLocalFile();
      const text = await sync.refreshSnapshot();
      if (text) applyExternalSitemap(text, 'reload');
      sync.startPolling((t) => applyExternalSitemap(t, 'watch'));
      setStatus('已連結 sitemap.txt — 切換會自動寫入，並監聽檔案異動', 'ok');
    } catch (err) {
      if (err?.name === 'AbortError') return;
      setStatus('連結失敗 — 請選擇專案根目錄的 sitemap.txt', 'err');
    }
  }

  async function loadFromFile(file) {
    const text = await file.text();
    applyExternalSitemap(text, 'reload');
    schedulePersist();
    setStatus(`已從 ${file.name} 載入`, 'ok');
  }

  function statusForMode(mode) {
    if (mode === 'api') return ['就緒 — 切換會自動寫入 sitemap.txt（plan 伺服器）', 'ok'];
    if (mode === 'handle') return ['就緒 — 已連結 sitemap.txt，切換會自動寫入並即時同步', 'ok'];
    if (mode === 'fetch') return ['就緒 — 可讀取 sitemap.txt；寫入請按「連結 sitemap.txt」', ''];
    if (window.WA_SITEMAP_FILE_SYNC?.isFileProtocol?.()) {
      return ['file:// 模式 — 請按「連結 sitemap.txt」以啟用讀寫與即時同步', 'warn'];
    }
    return ['就緒 — 請執行 npm run plan:serve', ''];
  }

  async function init() {
    if (!window.WA_SITEMAP_MANIFEST) {
      await new Promise((resolve, reject) => {
        const s = document.createElement('script');
        s.src = (window.waAssetUrl || ((p) => p))('assets/js/sitemap-manifest.js');
        s.onload = resolve;
        s.onerror = reject;
        document.head.appendChild(s);
      });
    }

    await loadSyncScript();
    const sync = window.WA_SITEMAP_FILE_SYNC;
    const M = window.WA_SITEMAP_MANIFEST;
    const mode = await sync.init();

    let text = null;
    try {
      text = await sync.refreshSnapshot();
    } catch {
      text = null;
    }

    if (text) {
      published = M.parseText(text);
    } else {
      await M.load(true);
      published = M.getPublished() || new Set();
    }

    syncPublishPreview();
    renderCatalog();
    updateStats();

    sync.startPolling((t) => applyExternalSitemap(t, 'watch'));

    const [msg, kind] = statusForMode(mode);
    setStatus(msg, kind);

    document.getElementById('plan-save')?.addEventListener('click', saveManifest);
    document.getElementById('plan-copy')?.addEventListener('click', copyManifest);
    document.getElementById('plan-reload')?.addEventListener('click', reloadManifest);
    document.getElementById('plan-link-file')?.addEventListener('click', linkSitemapFile);
    document.getElementById('plan-copy-hidden')?.addEventListener('click', () => copySlugList('hidden'));
    document.getElementById('plan-copy-published')?.addEventListener('click', () => copySlugList('published'));
    document.getElementById('plan-file')?.addEventListener('change', (e) => {
      const file = e.target.files?.[0];
      if (file) loadFromFile(file);
      e.target.value = '';
    });

    window.addEventListener('beforeunload', (e) => {
      if (!dirty) return;
      e.preventDefault();
      e.returnValue = '';
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    init().catch(() => setStatus('載入失敗 — 請連結 sitemap.txt 或執行 npm run plan:serve', 'err'));
  });
})();
