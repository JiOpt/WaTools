(function () {
  'use strict';

  const HISTORY_KEY = 'mytoolife-nav-history';
  const UI_STATE_KEY = 'mytoolife-sitemap-ui';
  const RECENT_MAX = 7;

  /** 分類標題圖示（對應 index 各 section） */
  const CATEGORY_ICONS = {
    utility: 'bi-tools',
    media: 'bi-collection-play',
    dev: 'bi-code-slash',
    editor: 'bi-file-richtext',
    security: 'bi-shield-lock',
    culture: 'bi-translate',
    symbols: 'bi-emoji-smile',
    life: 'bi-book',
    fun: 'bi-stars',
    spiritual: 'bi-brightness-high',
    world: 'bi-globe-asia-australia',
  };

  function sitemapIconBox(biClass, variant) {
    if (!biClass) return null;
    const cls = variant === 'cat' ? 'site-sitemap-icon-wrap site-sitemap-icon-wrap-cat' : 'site-sitemap-icon-wrap';
    return el('span', { className: cls, 'aria-hidden': 'true' }, [
      el('i', { className: `bi ${biClass}` }),
    ]);
  }

  function toolLinkLabel(tool) {
    const title = el('span', { className: 'site-sitemap-tool-title' }, tool.title);
    if (!tool.icon) return [title];
    return [sitemapIconBox(tool.icon), title];
  }

  function assetUrl(path) {
    if (typeof window.waAssetUrl === 'function') return window.waAssetUrl(path);
    return path;
  }

  function isInScriptureDir() {
    return /\/scripture\/[^/]+\.html$/i.test(location.pathname.replace(/\\/g, '/'));
  }

  function rootPrefix() {
    if (window.WA_TOOL_URLS) return window.WA_TOOL_URLS.siteRootPrefix();
    if (isInScriptureDir()) return '../';
    const segs = location.pathname.replace(/\\/g, '/').split('/').filter(Boolean);
    if (segs.length <= 1) return '';
    return '../'.repeat(segs.length - 1);
  }

  function currentHref() {
    if (window.WA_TOOL_URLS) return window.WA_TOOL_URLS.currentPageKey();
    const path = location.pathname.replace(/\\/g, '/');
    const scriptureMatch = path.match(/\/scripture\/([^/?#]+\.html)$/);
    if (scriptureMatch) return `scripture/${scriptureMatch[1]}`;
    const segs = path.split('/').filter(Boolean);
    if (segs.length >= 2) {
      return `${segs[segs.length - 2]}/${segs[segs.length - 1].split('?')[0].split('#')[0]}`;
    }
    const name = segs[0] || '';
    if (!name || name === '') return 'index.html';
    return name.split('?')[0].split('#')[0];
  }

  function toolHref(slug) {
    if (window.WA_TOOL_URLS) return window.WA_TOOL_URLS.toolHref(slug);
    for (const cat of window.WA_TOOLS_CATALOG || []) {
      for (const tool of cat.tools || []) {
        if (tool.slug === slug) {
          return `/${cat.id}/${slug}.html`;
        }
      }
    }
    return `/${slug}.html`;
  }

  function scriptureBookHref(slug) {
    return `/scripture/${slug}.html`;
  }

  function scriptReady(base) {
    if (base.includes('tools-data.js')) return Boolean(window.WA_TOOLS_CATALOG);
    if (base.includes('scriptures-catalog.js')) return Boolean(window.WA_SCRIPTURES_CATALOG);
    if (base.includes('sitemap-manifest.js')) return Boolean(window.WA_SITEMAP_MANIFEST);
    return false;
  }

  function readUiState() {
    try {
      const raw = localStorage.getItem(UI_STATE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }

  function writeUiState(state) {
    try {
      localStorage.setItem(UI_STATE_KEY, JSON.stringify(state));
    } catch {
      /* file:// or quota */
    }
  }

  function collectUiState(nav) {
    if (!nav) return readUiState();
    const sections = {};
    nav.querySelectorAll('.site-sitemap-section[data-section]').forEach((section) => {
      sections[section.dataset.section] = section.open;
    });
    const groups = {};
    nav.querySelectorAll('.site-sitemap-group[data-group]').forEach((group) => {
      groups[group.dataset.group] = group.open;
    });
    return {
      ...readUiState(),
      panelCollapsed: document.body.classList.contains('site-sitemap-collapsed'),
      sections,
      groups,
    };
  }

  function persistUiState(nav) {
    writeUiState(collectUiState(nav));
  }

  function applySectionOpenState(nav, saved) {
    if (!nav || !saved?.sections) return;
    nav.querySelectorAll('.site-sitemap-section[data-section]').forEach((section) => {
      const id = section.dataset.section;
      if (id in saved.sections) section.open = saved.sections[id];
    });
  }

  function setDesktopCollapsed(collapsed) {
    document.body.classList.toggle('site-sitemap-collapsed', collapsed);
    const btn = document.querySelector('.site-sitemap-collapse-btn');
    const tab = document.querySelector('.site-sitemap-expand-tab');
    if (btn) btn.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
    if (tab) tab.hidden = !collapsed;
    const state = readUiState();
    state.panelCollapsed = collapsed;
    writeUiState(state);
  }

  function bindGroupBulkActions(nav) {
    const toolsSection = nav?.querySelector('.site-sitemap-section[data-section="tools"]');
    if (!toolsSection) return;

    toolsSection.querySelector('[data-sitemap-expand-all]')?.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      toolsSection.querySelectorAll('.site-sitemap-group').forEach((group) => {
        group.open = true;
      });
      persistUiState(nav);
    });

    toolsSection.querySelector('[data-sitemap-collapse-all]')?.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      toolsSection.querySelectorAll('.site-sitemap-group').forEach((group) => {
        group.open = false;
      });
      persistUiState(nav);
    });
  }

  function bindSitemapTogglePersistence(aside) {
    if (!aside || aside.dataset.toggleBound === '1') {
      bindGroupBulkActions(aside?.querySelector('.site-sitemap-nav'));
      return;
    }
    aside.dataset.toggleBound = '1';

    aside.addEventListener('toggle', (e) => {
      if (!e.target.matches('.site-sitemap-section, .site-sitemap-group')) return;
      const nav = aside.querySelector('.site-sitemap-nav');
      if (nav) persistUiState(nav);
    }, true);

    bindGroupBulkActions(aside.querySelector('.site-sitemap-nav'));
  }

  function buildSectionBlock(id, label, children, options) {
    const summaryChildren = [
      el('span', { className: 'site-sitemap-section-title' }, label),
    ];
    if (options?.count != null) {
      summaryChildren.push(el('span', { className: 'site-sitemap-section-count' }, String(options.count)));
    }
    if (options?.actions?.length) {
      summaryChildren.push(el('span', { className: 'site-sitemap-section-actions' }, options.actions));
    }

    return el('details', {
      className: 'site-sitemap-section',
      dataset: { section: id },
      open: options?.open !== false,
    }, [
      el('summary', { className: 'site-sitemap-section-head' }, summaryChildren),
      el('div', { className: 'site-sitemap-section-body' }, children),
    ]);
  }

  function miniActionBtn(label, datasetKey) {
    return el('button', {
      type: 'button',
      className: 'site-sitemap-mini-btn',
      dataset: { [datasetKey]: '' },
      title: label,
    }, [label]);
  }

  function loadScriptOnce(src, timeoutMs) {
    const limit = timeoutMs || 12000;
    const base = src.split('?')[0];
    if (base.includes('sitemap-manifest.js') && window.WA_SITEMAP_MANIFEST) {
      return Promise.resolve();
    }
    const existing = document.querySelector(`script[src*="${base}"]`);

    function waitExisting() {
      return new Promise((resolve, reject) => {
        if (existing.dataset.waLoaded === '1' || scriptReady(base)) {
          existing.dataset.waLoaded = '1';
          resolve();
          return;
        }
        const finish = () => {
          existing.dataset.waLoaded = '1';
          resolve();
        };
        if (!existing.async && !existing.defer) {
          finish();
          return;
        }
        if (existing.readyState === 'complete' || existing.readyState === 'loaded') {
          finish();
          return;
        }
        existing.addEventListener('load', finish, { once: true });
        existing.addEventListener('error', () => reject(new Error(src)), { once: true });
      });
    }

    function fetchNew() {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = assetUrl(src);
        script.onload = () => {
          script.dataset.waLoaded = '1';
          resolve();
        };
        script.onerror = () => reject(new Error(src));
        document.head.appendChild(script);
      });
    }

    const load = existing ? waitExisting() : fetchNew();
    return Promise.race([
      load,
      new Promise((_, reject) => {
        window.setTimeout(() => reject(new Error(`timeout: ${src}`)), limit);
      }),
    ]);
  }

  function isPlanPage() {
    return document.body.classList.contains('plan-page')
      || /index_plan\.html$/i.test(location.pathname.replace(/\\/g, '/'));
  }

  async function loadPublishManifest() {
    if (!window.WA_SITEMAP_MANIFEST) {
      await loadScriptOnce('assets/js/sitemap-manifest.js');
    }
    if (!window.WA_SITEMAP_MANIFEST) return null;
    return window.WA_SITEMAP_MANIFEST.load();
  }

  function applyPublishFilter(catalog) {
    const list = Array.isArray(catalog) ? catalog : [];
    if (!window.WA_SITEMAP_MANIFEST) return list;
    try {
      return window.WA_SITEMAP_MANIFEST.filterCatalog(list) || [];
    } catch (err) {
      console.warn('[MyTooLife] publish filter failed:', err);
      return list;
    }
  }

  function refreshSitemapFromPublish() {
    const aside = document.getElementById('site-sitemap');
    if (!aside || !window.WA_TOOLS_CATALOG) return;

    return (async () => {
      try {
        await loadPublishManifest();
      } catch (err) {
        console.warn('[MyTooLife] publish refresh manifest:', err);
      }

      const tools = applyPublishFilter(window.WA_TOOLS_CATALOG);
      const scriptures = window.WA_SCRIPTURES_CATALOG || [];
      const scriptureSlugs = scriptureSlugSet(scriptures);
      const currentNav = aside.querySelector('.site-sitemap-nav');
      if (!currentNav) return;

      const savedUi = readUiState();
      const history = readHistory();
      const next = buildNav(tools, scriptures, history, scriptureSlugs);
      currentNav.replaceWith(next);
      hydrateNavState(next, savedUi, history, scriptureSlugs);
      bindGroupBulkActions(next);
      bindSitemapTogglePersistence(aside);
      next.querySelectorAll('a[href]').forEach((link) => {
        link.addEventListener('click', () => setMobileOpen(false));
      });

      const seqSlot = aside.querySelector('.site-sitemap-seq-slot');
      if (seqSlot) {
        const seqPager = buildToolCategoryPager(tools);
        seqSlot.replaceChildren(...(seqPager ? [seqPager] : []));
      }
    })();
  }

  window.addEventListener('mytoolife:publish-changed', () => {
    refreshSitemapFromPublish().catch((err) => {
      console.warn('[MyTooLife] publish refresh failed:', err);
    });
  });

  function waitForCatalogEvent(ms) {
    return new Promise((resolve) => {
      if (window.WA_TOOLS_CATALOG) {
        resolve();
        return;
      }
      let done = false;
      const finish = () => {
        if (done) return;
        done = true;
        resolve();
      };
      window.addEventListener('mytoolife:catalog-ready', finish, { once: true });
      window.setTimeout(finish, ms || 15000);
    });
  }

  async function waitForToolsCatalog() {
    if (window.WA_TOOLS_CATALOG) return;
    await waitForCatalogEvent();
    if (window.WA_TOOLS_CATALOG) return;
    await new Promise((resolve) => {
      let tries = 0;
      const tick = () => {
        if (window.WA_TOOLS_CATALOG || tries >= 80) {
          resolve();
          return;
        }
        tries += 1;
        window.setTimeout(tick, 50);
      };
      tick();
    });
  }

  async function loadCatalogs() {
    try {
      if (!window.WA_TOOLS_CATALOG) {
        await loadScriptOnce('assets/js/tools-data.js');
      }
    } catch (err) {
      console.warn('[MyTooLife] tools-data unavailable:', err);
    }

    if (!window.WA_TOOLS_CATALOG) {
      await waitForToolsCatalog();
    }

    try {
      if (!window.WA_TOOL_URLS) {
        await loadScriptOnce('assets/js/tool-urls.js');
      }
    } catch (err) {
      console.warn('[MyTooLife] tool-urls unavailable:', err);
    }

    try {
      if (!window.WA_SCRIPTURES_CATALOG) {
        await loadScriptOnce('assets/js/scriptures-catalog.js');
      }
    } catch (err) {
      console.warn('[MyTooLife] scriptures-catalog unavailable:', err);
    }

    return {
      tools: Array.isArray(window.WA_TOOLS_CATALOG) ? window.WA_TOOLS_CATALOG : [],
      scriptures: Array.isArray(window.WA_SCRIPTURES_CATALOG) ? window.WA_SCRIPTURES_CATALOG : [],
    };
  }

  function buildLoadingNav() {
    return el('nav', { className: 'site-sitemap-nav', 'aria-label': '網站地圖' }, [
      el('p', { className: 'site-sitemap-loading text-muted small' }, ['工具目錄載入中…']),
    ]);
  }

  function flattenNodes(items) {
    const out = [];
    const list = Array.isArray(items) ? items : (items ? [items] : []);
    list.forEach((item) => {
      if (item == null) return;
      if (Array.isArray(item)) {
        item.forEach((child) => {
          if (child != null) out.push(child);
        });
      } else {
        out.push(item);
      }
    });
    return out;
  }

  function el(tag, attrs, children) {
    const node = document.createElement(tag);
    if (attrs) {
      Object.entries(attrs).forEach(([key, val]) => {
        if (val == null) return;
        if (key === 'className') node.className = val;
        else if (key === 'text') node.textContent = val;
        else if (key === 'dataset' && val && typeof val === 'object') {
          Object.entries(val).forEach(([dk, dv]) => {
            if (dv != null) node.dataset[dk] = String(dv);
          });
        } else if (key.startsWith('on') && typeof val === 'function') {
          node.addEventListener(key.slice(2).toLowerCase(), val);
        } else node.setAttribute(key, val);
      });
    }
    flattenNodes(children).forEach((child) => {
      if (typeof child === 'string') node.appendChild(document.createTextNode(child));
      else node.appendChild(child);
    });
    return node;
  }

  function normalizeForCompare(href, scriptureSlugs) {
    return canonicalHref(href, scriptureSlugs);
  }

  function canonicalHref(href, scriptureSlugs) {
    let h = String(href || '').replace(/^\//, '').replace(/^\.\.\//, '');
    if (h.includes('/') && /\.html$/i.test(h)) return h;
    if (!h.includes('/') && h.endsWith('.html') && h !== 'index.html') {
      const slug = h.slice(0, -5);
      if (scriptureSlugs && scriptureSlugs.has(slug)) {
        return `scripture/${h}`;
      }
      if (window.WA_TOOL_URLS) {
        const catId = window.WA_TOOL_URLS.getCategoryId(slug);
        if (catId) return `${catId}/${h}`;
      }
    }
    return h;
  }

  function isActiveHref(href, scriptureSlugs) {
    const cur = currentHref();
    const target = canonicalHref(href, scriptureSlugs);
    if (target === cur) return true;
    if (target === 'index.html' && (cur === '' || cur === 'index.html')) return true;
    return false;
  }

  function resolveHref(href) {
    if (!href) return href;
    if (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('/')) return href;
    if (href.startsWith('../')) {
      const stripped = href.replace(/^\.\.\//, '');
      return stripped.startsWith('/') ? stripped : `/${stripped}`;
    }

    let canonical = href;
    if (canonical.startsWith('scripture-')) {
      canonical = `scripture/${canonical.slice('scripture-'.length)}`;
    }

    if (!canonical.includes('/') && canonical.endsWith('.html') && canonical !== 'index.html') {
      const slug = canonical.replace(/\.html$/i, '');
      if (window.WA_TOOL_URLS) return window.WA_TOOL_URLS.toolHref(slug);
      return `/${canonical}`;
    }

    return canonical.startsWith('/') ? canonical : `/${canonical}`;
  }

  function hrefFromCanon(canon) {
    if (!canon) return '/index.html';
    if (canon === 'index.html') return '/index.html';
    if (canon.startsWith('scripture/')) return `/${canon}`;
    const slug = canon.includes('/')
      ? canon.split('/').pop().replace(/\.html$/i, '')
      : canon.replace(/\.html$/i, '');
    if (window.WA_TOOL_URLS && slug) return window.WA_TOOL_URLS.toolHref(slug);
    return `/${canon}`;
  }

  function refreshSitemapLinkHrefs(nav) {
    if (!nav) return;
    nav.querySelectorAll('a[href]').forEach((link) => {
      const canon = link.dataset.canon;
      if (canon) {
        link.setAttribute('href', hrefFromCanon(canon));
        return;
      }
      if (link.classList.contains('site-sitemap-home')) {
        const label = link.textContent.trim();
        if (label === '工具首頁') link.setAttribute('href', '/index.html');
        else if (label === '藏經閣') link.setAttribute('href', toolHref('scriptures'));
      }
    });
  }

  function scriptureSlugSet(scriptures) {
    const set = new Set();
    if (!Array.isArray(scriptures)) return set;
    scriptures.forEach((cat) => {
      (cat.books || []).forEach((book) => {
        if (book?.slug) set.add(book.slug);
      });
    });
    return set;
  }

  function readHistory() {
    try {
      const raw = localStorage.getItem(HISTORY_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  function formatTime(ts) {
    const d = new Date(ts);
    const now = new Date();
    if (d.toDateString() === now.toDateString()) {
      return d.toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' });
    }
    return d.toLocaleDateString('zh-TW', { month: 'short', day: 'numeric' });
  }

  function linkClassNames(href, recentRank, scriptureSlugs) {
    const classes = [];
    if (isActiveHref(href, scriptureSlugs)) classes.push('is-active');
    else if (recentRank === 0) classes.push('is-recent', 'is-recent-latest');
    else if (recentRank >= 0) classes.push('is-recent');
    return classes.join(' ');
  }

  function currentToolSlugFromPage() {
    if (window.WA_TOOL_URLS) return window.WA_TOOL_URLS.currentToolSlug();
    const app = document.getElementById('tool-app');
    if (app?.dataset?.tool) return app.dataset.tool;
    const path = location.pathname.replace(/\\/g, '/');
    const nested = path.match(/\/([^/]+)\/([^/]+)\.html$/i);
    if (nested) return decodeURIComponent(nested[2]);
    const flat = path.match(/\/([^/]+)\.html$/i);
    return flat ? decodeURIComponent(flat[1]) : '';
  }

  function findToolCategoryContext(catalog) {
    const slug = currentToolSlugFromPage();
    if (!slug) return null;

    const api = window.WA_SITEMAP_PAGER;
    if (api) {
      return api.resolveToolPager(slug, catalog, { alreadyFiltered: true });
    }

    for (const category of catalog) {
      const tools = category.tools || [];
      const index = tools.findIndex((t) => t.slug === slug);
      if (index >= 0 && tools.length >= 2) {
        const len = tools.length;
        return {
          category,
          tools,
          index,
          prev: tools[(index - 1 + len) % len],
          next: tools[(index + 1) % len],
        };
      }
    }
    return null;
  }

  function buildToolCategoryPager(catalog) {
    const ctx = findToolCategoryContext(catalog);
    if (!ctx || ctx.tools.length < 2) return null;

    function linkBtn(tool, kind, label) {
      if (!tool) {
        return el('span', {
          className: `site-sitemap-seq-link site-sitemap-seq-${kind} is-disabled`,
          'aria-hidden': 'true',
        }, [
          el('span', { className: 'site-sitemap-seq-label' }, [label]),
          el('span', { className: 'site-sitemap-seq-title' }, ['—']),
        ]);
      }
      const icon = kind === 'prev' ? 'bi-chevron-left' : 'bi-chevron-right';
      const labelEl = el('span', { className: 'site-sitemap-seq-label' }, [
        kind === 'prev' ? el('i', { className: `bi ${icon}`, 'aria-hidden': 'true' }) : null,
        label,
        kind === 'next' ? el('i', { className: `bi ${icon}`, 'aria-hidden': 'true' }) : null,
      ]);
      return el('a', {
        href: toolHref(tool.slug),
        className: `site-sitemap-seq-link site-sitemap-seq-${kind}`,
        title: tool.title,
      }, [
        labelEl,
        el('span', { className: 'site-sitemap-seq-title' }, [tool.title]),
      ]);
    }

    return el('nav', {
      className: 'site-sitemap-seq',
      'aria-label': '同分類上一篇下一篇',
    }, [
      linkBtn(ctx.prev, 'prev', '上一篇'),
      el('span', { className: 'site-sitemap-seq-pos text-muted' }, [
        `${ctx.index + 1} / ${ctx.tools.length}`,
      ]),
      linkBtn(ctx.next, 'next', '下一篇'),
    ]);
  }

  function buildToolSections(catalog, recentRankByHref, scriptureSlugs) {
    return catalog.map((category) => el('details', {
      className: 'site-sitemap-group',
      dataset: { group: category.id },
    }, [
      el('summary', { className: 'site-sitemap-group-title' }, [
        sitemapIconBox(CATEGORY_ICONS[category.id], 'cat'),
        el('span', { className: 'site-sitemap-cat-title' }, category.name),
      ]),
      el('ul', { className: 'site-sitemap-list' }, (category.tools || []).map((tool) => {
        const href = toolHref(tool.slug);
        const canon = canonicalHref(href, scriptureSlugs);
        const rank = recentRankByHref.has(canon) ? recentRankByHref.get(canon) : -1;
        return el('li', null, [
          el('a', {
            href,
            className: linkClassNames(href, rank, scriptureSlugs),
            dataset: { label: `${tool.title} ${category.name}`, canon },
          }, [
            rank >= 0 && !isActiveHref(href, scriptureSlugs)
              ? el('span', { className: 'site-sitemap-recent-mark', title: '最近瀏覽' })
              : null,
            ...toolLinkLabel(tool),
          ]),
        ]);
      })),
    ]));
  }

  function buildScriptureSections(catalog, recentRankByHref, scriptureSlugs) {
    return catalog.map((category) => el('details', {
      className: 'site-sitemap-group',
      dataset: { group: `scripture-${category.id}` },
    }, [
      el('summary', { className: 'site-sitemap-group-title' }, [category.name]),
      el('ul', { className: 'site-sitemap-list' }, (category.books || []).map((book) => {
        const href = scriptureBookHref(book.slug);
        const canon = canonicalHref(href, scriptureSlugs);
        const rank = recentRankByHref.has(canon) ? recentRankByHref.get(canon) : -1;
        return el('li', null, [
          el('a', {
            href,
            className: linkClassNames(href, rank, scriptureSlugs),
            dataset: { label: `${book.title} ${category.name} 藏經閣`, canon },
          }, [
            rank >= 0 && !isActiveHref(href, scriptureSlugs)
              ? el('span', { className: 'site-sitemap-recent-mark', title: '最近瀏覽' })
              : null,
            book.title,
          ]),
        ]);
      })),
    ]));
  }

  function buildRecentSection(history, scriptureSlugs) {
    const items = history
      .filter((item) => !isActiveHref(item.href, scriptureSlugs))
      .slice(0, RECENT_MAX);
    if (!items.length) return null;

    return el('ul', { className: 'site-sitemap-recent-list' }, items.map((item, index) => {
      const href = resolveHref(item.href);
      return el('li', null, [
        el('a', {
          href,
          className: linkClassNames(href, index, scriptureSlugs),
          title: item.title,
        }, [
          el('span', { className: 'site-sitemap-recent-dot', 'aria-hidden': 'true' }),
          el('span', { className: 'site-sitemap-recent-title' }, [item.title]),
          el('span', { className: 'site-sitemap-recent-time' }, [index === 0 ? '剛剛' : formatTime(item.ts)]),
        ]),
      ]);
    }));
  }

  function recentRankMap(history, scriptureSlugs) {
    const map = new Map();
    let rank = 0;
    history.forEach((item) => {
      if (isActiveHref(item.href, scriptureSlugs)) return;
      if (rank >= RECENT_MAX) return;
      map.set(item.href, rank);
      rank += 1;
    });
    return map;
  }

  function applyGroupOpenState(root, recentRankByHref, saved) {
    root.querySelectorAll('.site-sitemap-group').forEach((group) => {
      const id = group.dataset.group;
      if (saved?.groups && id in saved.groups) {
        group.open = saved.groups[id];
        return;
      }
      if (group.querySelector('a.is-active')) {
        group.open = true;
        return;
      }
      const hasRecent = Array.from(group.querySelectorAll('a[data-canon]')).some((link) => {
        const rank = recentRankByHref.get(link.dataset.canon);
        return rank != null && rank >= 0;
      });
      if (hasRecent) group.open = true;
    });
  }

  function applySearch(root, query) {
    const q = query.trim().toLowerCase();
    const recentSection = root.querySelector('.site-sitemap-section[data-section="recent"]');
    if (recentSection) {
      if (!q) {
        recentSection.hidden = false;
      } else {
        let recentVisible = 0;
        recentSection.querySelectorAll('.site-sitemap-recent-list li').forEach((item) => {
          const link = item.querySelector('a');
          const label = (link?.title || link?.textContent || '').toLowerCase();
          const match = label.includes(q);
          item.hidden = !match;
          if (match) recentVisible += 1;
        });
        recentSection.hidden = recentVisible === 0;
        if (recentVisible > 0) recentSection.open = true;
      }
    }
    root.querySelectorAll('.site-sitemap-group').forEach((group) => {
      let visible = 0;
      group.querySelectorAll('.site-sitemap-list li').forEach((item) => {
        const link = item.querySelector('a');
        const label = (link?.dataset.label || link?.textContent || '').toLowerCase();
        const match = !q || label.includes(q);
        item.hidden = !match;
        if (match) visible += 1;
      });
      group.hidden = visible === 0;
      if (q && visible > 0) group.open = true;
    });
  }

  function setMobileOpen(open) {
    document.body.classList.toggle('site-sitemap-open', open);
    const panel = document.getElementById('site-sitemap');
    const fab = document.querySelector('.site-sitemap-fab');
    if (panel) panel.setAttribute('aria-hidden', open ? 'false' : 'true');
    if (fab) fab.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  function buildNav(tools, scriptures, history, scriptureSlugs) {
    const catalog = Array.isArray(tools) ? tools : [];
    const scriptureCatalog = Array.isArray(scriptures) ? scriptures : [];
    const safeHistory = Array.isArray(history) ? history : [];
    const recentRankByHref = recentRankMap(safeHistory, scriptureSlugs);
    const recentList = buildRecentSection(safeHistory, scriptureSlugs);
    const toolGroups = buildToolSections(catalog, recentRankByHref, scriptureSlugs);
    const scriptureGroups = buildScriptureSections(scriptureCatalog, recentRankByHref, scriptureSlugs);

    return el('nav', { className: 'site-sitemap-nav', 'aria-label': '網站地圖' }, [
      recentList
        ? buildSectionBlock('recent', '最近瀏覽', [recentList], { count: recentList.children.length })
        : null,
      el('div', { className: 'site-sitemap-head' }, [
        el('a', {
          href: '/index.html',
          className: isActiveHref('/index.html', scriptureSlugs) ? 'site-sitemap-home is-active' : 'site-sitemap-home',
        }, ['工具首頁']),
        el('a', {
          href: toolHref('scriptures'),
          className: isActiveHref(toolHref('scriptures'), scriptureSlugs) ? 'site-sitemap-home is-active' : 'site-sitemap-home',
        }, ['藏經閣']),
      ]),
      buildSectionBlock('tools', '工具分類', toolGroups, {
        count: catalog.length,
        actions: [
          miniActionBtn('全展開', 'sitemapExpandAll'),
          miniActionBtn('全收合', 'sitemapCollapseAll'),
        ],
      }),
      buildSectionBlock('scriptures', '藏經閣經典', scriptureGroups, {
        count: scriptureGroups.length,
      }),
    ]);
  }

  function hydrateNavState(nav, saved, history, scriptureSlugs) {
    applySectionOpenState(nav, saved);
    applyGroupOpenState(nav, recentRankMap(history, scriptureSlugs), saved);
  }

  function getSitemapNavScrollEl() {
    return document.getElementById('site-sitemap')?.querySelector('.site-sitemap-nav') || null;
  }

  function refreshSitemap(root, tools, scriptures, scriptureSlugs) {
    const aside = document.getElementById('site-sitemap');
    const q = aside?.querySelector('.site-sitemap-search')?.value || '';
    const saved = collectUiState(root);
    const history = readHistory();
    const scrollTop = getSitemapNavScrollEl()?.scrollTop ?? 0;
    const next = buildNav(tools, scriptures, history, scriptureSlugs);
    root.replaceWith(next);
    hydrateNavState(next, saved, history, scriptureSlugs);
    bindGroupBulkActions(next);
    bindSitemapTogglePersistence(document.getElementById('site-sitemap'));
    next.querySelectorAll('a[href]').forEach((link) => {
      link.addEventListener('click', () => setMobileOpen(false));
    });
    if (q) applySearch(next, q);
    refreshSitemapLinkHrefs(next);
    const restoreScroll = () => {
      const scrollEl = getSitemapNavScrollEl();
      if (scrollEl) scrollEl.scrollTop = scrollTop;
    };
    restoreScroll();
    requestAnimationFrame(restoreScroll);
    return next;
  }

  function mountNav(aside, seqSlot, nav, savedUi, visibleTools, scriptureSlugs) {
    const oldNav = aside.querySelector('.site-sitemap-nav');
    if (oldNav) oldNav.replaceWith(nav);
    else if (seqSlot?.parentNode) seqSlot.insertAdjacentElement('afterend', nav);

    if (seqSlot) {
      const seqPager = buildToolCategoryPager(visibleTools);
      seqSlot.replaceChildren(...(seqPager ? [seqPager] : []));
    }

    hydrateNavState(nav, savedUi, readHistory(), scriptureSlugs);
    bindGroupBulkActions(nav);
    nav.querySelectorAll('a[href]').forEach((link) => {
      link.addEventListener('click', () => setMobileOpen(false));
    });
    refreshSitemapLinkHrefs(nav);
  }

  async function renderSitemapNav() {
    await loadCatalogs();
    try {
      await loadPublishManifest();
    } catch (err) {
      console.warn('[MyTooLife] sitemap manifest unavailable:', err);
    }

    const scriptures = Array.isArray(window.WA_SCRIPTURES_CATALOG) ? window.WA_SCRIPTURES_CATALOG : [];
    let visibleTools = applyPublishFilter(window.WA_TOOLS_CATALOG || []);
    if (!visibleTools.length) {
      const pub = window.WA_SITEMAP_MANIFEST?.getPublished?.();
      if (pub?.size) {
        await window.WA_SITEMAP_MANIFEST.load(true);
        visibleTools = applyPublishFilter(window.WA_TOOLS_CATALOG || []);
      }
    }

    const scriptureSlugs = scriptureSlugSet(scriptures);
    const nav = buildNav(visibleTools, scriptures, readHistory(), scriptureSlugs);
    return { nav, visibleTools, scriptures, scriptureSlugs };
  }

  let initPromise = null;
  let shellReady = false;

  async function init(force) {
    if (!document.querySelector('#header .branding')) return;

    const stuckLoading = document.querySelector('.site-sitemap-loading');
    if (initPromise && !force && !stuckLoading) return initPromise;
    if (force) initPromise = null;

    initPromise = (async () => {
      let aside = document.getElementById('site-sitemap');
      let seqSlot;
      let nav;
      const savedUi = readUiState();

      if (!aside) {
        const closeBtn = el('button', {
          type: 'button',
          className: 'site-sitemap-close d-xl-none',
          'aria-label': '關閉網站地圖',
          onClick: () => setMobileOpen(false),
        }, ['×']);

        const collapseBtn = el('button', {
          type: 'button',
          className: 'site-sitemap-collapse-btn d-none d-xl-inline-flex',
          'aria-label': '收合網站地圖',
          'aria-expanded': 'true',
          title: '收合側欄',
          onClick: () => setDesktopCollapsed(!document.body.classList.contains('site-sitemap-collapsed')),
        }, [
          el('i', { className: 'bi bi-chevron-left', 'aria-hidden': 'true' }),
        ]);

        const search = el('input', {
          type: 'search',
          className: 'site-sitemap-search',
          placeholder: '搜尋工具或經典…',
          'aria-label': '搜尋網站地圖',
        });

        nav = buildLoadingNav();
        seqSlot = el('div', { className: 'site-sitemap-seq-slot' });

        aside = el('aside', {
          id: 'site-sitemap',
          className: 'site-sitemap',
          'aria-hidden': 'true',
        }, [
          el('div', { className: 'site-sitemap-top' }, [
            el('strong', { className: 'site-sitemap-title' }, ['網站地圖']),
            el('div', { className: 'site-sitemap-top-actions' }, [collapseBtn, closeBtn]),
          ]),
          search,
          seqSlot,
          nav,
        ]);

        const expandTab = el('button', {
          type: 'button',
          className: 'site-sitemap-expand-tab',
          'aria-label': '展開網站地圖',
          title: '展開側欄',
          hidden: true,
          onClick: () => setDesktopCollapsed(false),
        }, [
          el('i', { className: 'bi bi-list-nested', 'aria-hidden': 'true' }),
          el('span', { className: 'site-sitemap-expand-tab-text' }, ['地圖']),
        ]);

        const backdrop = el('button', {
          type: 'button',
          className: 'site-sitemap-backdrop',
          'aria-label': '關閉網站地圖',
          onClick: () => setMobileOpen(false),
        });

        const fab = el('button', {
          type: 'button',
          className: 'site-sitemap-fab d-xl-none',
          'aria-label': '開啟網站地圖',
          'aria-expanded': 'false',
          onClick: () => setMobileOpen(!document.body.classList.contains('site-sitemap-open')),
        }, [
          el('i', { className: 'bi bi-list-nested', 'aria-hidden': 'true' }),
          el('span', { className: 'site-sitemap-fab-text' }, ['']),
        ]);

        document.body.appendChild(aside);
        document.body.appendChild(backdrop);
        document.body.appendChild(fab);
        document.body.appendChild(expandTab);
        document.body.classList.add('has-site-sitemap');

        const mq = window.matchMedia('(min-width: 1200px)');
        function syncAria() {
          aside.setAttribute('aria-hidden', mq.matches ? 'false' : 'true');
        }
        mq.addEventListener('change', syncAria);
        syncAria();

        aside.addEventListener('input', (e) => {
          if (!e.target.matches('.site-sitemap-search')) return;
          const navEl = aside.querySelector('.site-sitemap-nav');
          if (navEl) applySearch(navEl, e.target.value);
        });

        bindSitemapTogglePersistence(aside);
        if (savedUi.panelCollapsed) setDesktopCollapsed(true);
        else setDesktopCollapsed(false);
        shellReady = true;
      } else {
        seqSlot = aside.querySelector('.site-sitemap-seq-slot');
        nav = aside.querySelector('.site-sitemap-nav');
        if (!shellReady) {
          bindSitemapTogglePersistence(aside);
          shellReady = true;
        }
      }

      let visibleTools = [];
      let scriptures = [];
      let scriptureSlugs = new Set();

      try {
        const rendered = await renderSitemapNav();
        nav = rendered.nav;
        visibleTools = rendered.visibleTools;
        scriptures = rendered.scriptures;
        scriptureSlugs = rendered.scriptureSlugs;
        mountNav(aside, seqSlot, nav, savedUi, visibleTools, scriptureSlugs);
      } catch (err) {
        console.error('[MyTooLife] site-sitemap init failed:', err);
        const loading = aside.querySelector('.site-sitemap-loading');
        if (loading) {
          loading.textContent = '無法載入工具目錄，請重新整理頁面。';
        }
        throw err;
      }

      return { visibleTools, scriptures, scriptureSlugs };
    })();

    return initPromise;
  }

  function patchSitemapAfterNav() {
    const aside = document.getElementById('site-sitemap');
    const nav = aside?.querySelector('.site-sitemap-nav');
    if (!nav || !window.WA_TOOLS_CATALOG) return;

    const tools = applyPublishFilter(window.WA_TOOLS_CATALOG);
    const scriptures = window.WA_SCRIPTURES_CATALOG || [];
    const scriptureSlugs = scriptureSlugSet(scriptures);
    const history = readHistory();
    const recentRankByHref = recentRankMap(history, scriptureSlugs);
    const saved = collectUiState(nav);

    nav.querySelectorAll('a[href]').forEach((link) => {
      const href = link.getAttribute('href');
      if (!href) return;
      const canon = link.dataset.canon || canonicalHref(href, scriptureSlugs);
      let rank = -1;
      if (recentRankByHref.has(canon)) rank = recentRankByHref.get(canon);
      else if (recentRankByHref.has(href)) rank = recentRankByHref.get(href);
      const active = isActiveHref(href, scriptureSlugs);
      link.classList.remove('is-active', 'is-recent', 'is-recent-latest');
      if (active) link.classList.add('is-active');
      else if (rank === 0) link.classList.add('is-recent', 'is-recent-latest');
      else if (rank >= 0) link.classList.add('is-recent');

      const mark = link.querySelector('.site-sitemap-recent-mark');
      if (active || rank < 0) mark?.remove();
      else if (!mark && link.closest('.site-sitemap-list')) {
        const dot = document.createElement('span');
        dot.className = 'site-sitemap-recent-mark';
        dot.title = '最近瀏覽';
        link.insertBefore(dot, link.firstChild);
      }
    });

    const recentSection = nav.querySelector('.site-sitemap-section[data-section="recent"]');
    const recentList = buildRecentSection(history, scriptureSlugs);
    if (recentList && recentSection) {
      const body = recentSection.querySelector('.site-sitemap-section-body');
      if (body) body.replaceChildren(recentList);
      const countEl = recentSection.querySelector('.site-sitemap-section-count');
      if (countEl) countEl.textContent = String(recentList.children.length);
    } else if (!recentList && recentSection) {
      recentSection.remove();
    } else if (recentList && !recentSection) {
      const section = buildSectionBlock('recent', '最近瀏覽', [recentList], {
        count: recentList.children.length,
      });
      const head = nav.querySelector('.site-sitemap-head');
      if (head) nav.insertBefore(section, head);
      else nav.prepend(section);
      bindSitemapTogglePersistence(aside);
      section.querySelectorAll('a[href]').forEach((link) => {
        link.addEventListener('click', () => setMobileOpen(false));
      });
    }

    const seqSlot = aside.querySelector('.site-sitemap-seq-slot');
    if (seqSlot) {
      const seqPager = buildToolCategoryPager(tools);
      seqSlot.replaceChildren(...(seqPager ? [seqPager] : []));
    }

    applyGroupOpenState(nav, recentRankByHref, saved);

    refreshSitemapLinkHrefs(nav);

    const q = aside.querySelector('.site-sitemap-search')?.value || '';
    if (q) applySearch(nav, q);
  }

  function refreshSitemapForCurrentPage(options) {
    if (!options?.full) {
      patchSitemapAfterNav();
      return;
    }

    const aside = document.getElementById('site-sitemap');
    const currentNav = aside?.querySelector('.site-sitemap-nav');
    if (!currentNav || !window.WA_TOOLS_CATALOG) return;

    const tools = applyPublishFilter(window.WA_TOOLS_CATALOG);
    const scriptures = window.WA_SCRIPTURES_CATALOG || [];
    const scriptureSlugs = scriptureSlugSet(scriptures);
    const seqSlot = aside.querySelector('.site-sitemap-seq-slot');
    const q = aside.querySelector('.site-sitemap-search')?.value || '';
    const next = refreshSitemap(currentNav, tools, scriptures, scriptureSlugs);
    if (q) applySearch(next, q);

    if (seqSlot) {
      const seqPager = buildToolCategoryPager(tools);
      seqSlot.replaceChildren(...(seqPager ? [seqPager] : []));
    }
  }

  window.__waRefreshSitemapNav = refreshSitemapForCurrentPage;
  window.__waPatchSitemapAfterNav = patchSitemapAfterNav;

  function scheduleInit(force) {
    const run = () => init(force).catch(() => {});
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', run, { once: true });
    } else {
      run();
    }
  }

  if (!window.__WA_SITEMAP_EVENTS_BOUND) {
    window.__WA_SITEMAP_EVENTS_BOUND = true;
    window.addEventListener('storage', (e) => {
      if (e.key !== HISTORY_KEY) return;
      const asideEl = document.getElementById('site-sitemap');
      const currentNav = asideEl?.querySelector('.site-sitemap-nav');
      if (!currentNav || !window.WA_TOOLS_CATALOG) return;
      const tools = applyPublishFilter(window.WA_TOOLS_CATALOG);
      const scriptures = window.WA_SCRIPTURES_CATALOG || [];
      const scriptureSlugs = scriptureSlugSet(scriptures);
      if (!tools.length) return;
      const q = asideEl.querySelector('.site-sitemap-search')?.value || '';
      const next = refreshSitemap(currentNav, tools, scriptures, scriptureSlugs);
      if (q) applySearch(next, q);
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') setMobileOpen(false);
    });
  }

  scheduleInit(false);
  window.addEventListener('load', () => {
    if (document.querySelector('.site-sitemap-loading')) {
      scheduleInit(true);
    }
  }, { once: true });
})();
