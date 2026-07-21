/**
 * Live Pulse realtime boards — mount into #tool-app.
 * Exports: window.WA_MOUNT_LIVE[slug](app)
 */
(function (global) {
  'use strict';

  var LIVE_CSS_VER = 'lv-1';

  function liveCssHref() {
    if (global.WA_TOOL_URLS && typeof global.WA_TOOL_URLS.absolutePageHref === 'function') {
      return global.WA_TOOL_URLS.absolutePageHref('assets/css/live-tools.css') + '?v=' + LIVE_CSS_VER;
    }
    var path = String(location.pathname || '').replace(/\\/g, '/');
    if (/\/live(\/|$)/i.test(path)) {
      return '../assets/css/live-tools.css?v=' + LIVE_CSS_VER;
    }
    return 'assets/css/live-tools.css?v=' + LIVE_CSS_VER;
  }

  function ensureLiveCss() {
    var key = 'wa-live-css';
    var href;
    try {
      href = new URL(liveCssHref(), location.href).href;
    } catch (e) {
      href = liveCssHref();
    }
    var existing = document.querySelector('link[data-wa-key="' + key + '"]');
    if (existing) {
      if (existing.getAttribute('href') !== href) existing.href = href;
      return;
    }
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.media = 'print';
    link.setAttribute('data-wa-key', key);
    link.onload = function () { link.media = 'all'; };
    document.head.appendChild(link);
    requestAnimationFrame(function () {
      if (link.sheet) link.media = 'all';
    });
  }

  function cleanupFns(app) {
    var list = app.__waLvCleanup || [];
    list.forEach(function (fn) {
      try { fn(); } catch (e) { /* ignore */ }
    });
    app.__waLvCleanup = [];
  }

  function onCleanup(app, fn) {
    if (!app.__waLvCleanup) app.__waLvCleanup = [];
    app.__waLvCleanup.push(fn);
  }

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function fmtNum(n, digits) {
    if (n == null || Number.isNaN(Number(n))) return '—';
    var d = digits == null ? 2 : digits;
    return Number(n).toLocaleString('zh-TW', {
      maximumFractionDigits: d,
      minimumFractionDigits: d > 0 ? Math.min(2, d) : 0
    });
  }

  function fmtPct(n) {
    if (n == null || Number.isNaN(Number(n))) return '—';
    var v = Number(n);
    var sign = v > 0 ? '+' : '';
    return sign + v.toFixed(2) + '%';
  }

  function fmtTime(ts) {
    if (!ts) return '—';
    try {
      return new Date(ts).toLocaleString('zh-TW', { hour12: false });
    } catch (e) {
      return '—';
    }
  }

  function changeClass(n) {
    if (n == null || Number.isNaN(Number(n))) return '';
    var v = Number(n);
    if (v > 0) return 'is-up';
    if (v < 0) return 'is-down';
    return '';
  }

  function fetchJson(url, opts) {
    var ctrl = new AbortController();
    var timer = setTimeout(function () { ctrl.abort(); }, (opts && opts.timeout) || 12000);
    return fetch(url, {
      signal: ctrl.signal,
      credentials: 'omit',
      cache: 'no-store',
      headers: (opts && opts.headers) || {}
    }).then(function (res) {
      clearTimeout(timer);
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.json();
    }).catch(function (err) {
      clearTimeout(timer);
      throw err;
    });
  }

  function skeletonHtml() {
    return '<div class="lv-skel" aria-hidden="true"><span></span><span></span><span></span><span></span></div>';
  }

  /**
   * Shared query board shell.
   * opts: { title, lead, source, disclaimer, searchPlaceholder, filters[], autoDefault, onLoad }
   * onLoad(ctx) -> Promise; ctx has getQuery, setKpis, setBoard, setMeta, setError, setToast
   */
  function mountBoard(app, opts) {
    ensureLiveCss();
    cleanupFns(app);
    app.classList.add('wa-live');

    var state = {
      autoSec: opts.autoDefault == null ? 60 : opts.autoDefault,
      sortKey: null,
      sortDir: 1,
      rows: null,
      lastUpdated: null,
      loading: false
    };
    var timerId = null;

    var filterHtml = (opts.filters || []).map(function (f) {
      var options = (f.options || []).map(function (o) {
        return '<option value="' + esc(o.value) + '"' + (o.selected ? ' selected' : '') + '>' + esc(o.label) + '</option>';
      }).join('');
      return (
        '<div class="lv-field">' +
        '<label class="lv-label" for="lv-f-' + esc(f.id) + '">' + esc(f.label) + '</label>' +
        '<select class="lv-select" id="lv-f-' + esc(f.id) + '" data-filter="' + esc(f.id) + '">' + options + '</select>' +
        '</div>'
      );
    }).join('');

    app.innerHTML =
      '<section class="lv-card">' +
      '  <p class="lv-eyebrow">即時雷達 Live Pulse</p>' +
      '  <h2 class="lv-title">' + esc(opts.title) + '</h2>' +
      '  <p class="lv-lead">' + esc(opts.lead) + '</p>' +
      '  <div class="lv-meta">' +
      '    <span>資料來源：<strong id="lv-source">' + esc(opts.source) + '</strong></span>' +
      '    <span>更新時間：<strong id="lv-updated">—</strong></span>' +
      '  </div>' +
      '  <div class="lv-toolbar">' +
      '    <div class="lv-field lv-field--grow">' +
      '      <label class="lv-label" for="lv-q">搜尋</label>' +
      '      <input class="lv-input" id="lv-q" type="search" placeholder="' + esc(opts.searchPlaceholder || '關鍵字／代碼') + '" autocomplete="off" />' +
      '    </div>' +
      filterHtml +
      '    <div class="lv-field">' +
      '      <label class="lv-label" for="lv-auto">自動更新</label>' +
      '      <select class="lv-select" id="lv-auto">' +
      '        <option value="0">關閉</option>' +
      '        <option value="30"' + (state.autoSec === 30 ? ' selected' : '') + '>30 秒</option>' +
      '        <option value="60"' + (state.autoSec === 60 ? ' selected' : '') + '>60 秒</option>' +
      '        <option value="120"' + (state.autoSec === 120 ? ' selected' : '') + '>120 秒</option>' +
      '      </select>' +
      '    </div>' +
      '    <button type="button" class="lv-btn" id="lv-refresh">重新整理</button>' +
      '  </div>' +
      '  <div class="lv-kpis" id="lv-kpis">' +
      '    <div class="lv-kpi"><span class="lv-kpi__label">狀態</span><span class="lv-kpi__value" data-kpi="status">待命</span></div>' +
      '    <div class="lv-kpi"><span class="lv-kpi__label">筆數</span><span class="lv-kpi__value" data-kpi="count">—</span></div>' +
      '    <div class="lv-kpi"><span class="lv-kpi__label">重點</span><span class="lv-kpi__value" data-kpi="highlight">—</span></div>' +
      '    <div class="lv-kpi"><span class="lv-kpi__label">最後更新</span><span class="lv-kpi__value" data-kpi="updated">—</span></div>' +
      '  </div>' +
      '  <div class="lv-board" id="lv-board" aria-live="polite">' + skeletonHtml() + '</div>' +
      '  <p class="lv-toast" id="lv-toast"></p>' +
      '  <p class="lv-disclaimer">' + esc(opts.disclaimer || '資料僅供參考，非正式交易、警報或官方賽果系統。') + '</p>' +
      '</section>';

    var elQ = app.querySelector('#lv-q');
    var elAuto = app.querySelector('#lv-auto');
    var elBoard = app.querySelector('#lv-board');
    var elToast = app.querySelector('#lv-toast');
    var elUpdated = app.querySelector('#lv-updated');
    var elSource = app.querySelector('#lv-source');

    function getFilters() {
      var out = {};
      app.querySelectorAll('[data-filter]').forEach(function (sel) {
        out[sel.getAttribute('data-filter')] = sel.value;
      });
      return out;
    }

    function setKpis(map) {
      Object.keys(map || {}).forEach(function (k) {
        var node = app.querySelector('[data-kpi="' + k + '"]');
        if (!node) return;
        var val = map[k];
        if (val && typeof val === 'object') {
          node.textContent = val.text == null ? '—' : String(val.text);
          node.className = 'lv-kpi__value ' + (val.cls || '');
        } else {
          node.textContent = val == null ? '—' : String(val);
          node.className = 'lv-kpi__value';
        }
      });
    }

    function setMeta(updated, source) {
      if (updated != null) {
        state.lastUpdated = updated;
        elUpdated.textContent = typeof updated === 'string' ? updated : fmtTime(updated);
        setKpis({ updated: elUpdated.textContent });
      }
      if (source) elSource.textContent = source;
    }

    function setToast(msg) {
      elToast.textContent = msg || '';
    }

    function setBoard(html) {
      elBoard.innerHTML = html;
    }

    function setError(msg) {
      setKpis({ status: { text: '失敗', cls: 'is-down' } });
      setBoard(
        '<div class="lv-error">' + esc(msg || '載入失敗') +
        ' <button type="button" class="lv-btn lv-btn-ghost" id="lv-retry">重試</button></div>'
      );
      var retry = elBoard.querySelector('#lv-retry');
      if (retry) retry.addEventListener('click', refresh);
    }

    function renderTable(columns, rows, emptyMsg) {
      state.rows = rows || [];
      state.lastColumns = columns;
      if (!rows || !rows.length) {
        setBoard('<div class="lv-empty">' + esc(emptyMsg || '目前沒有資料') + '</div>');
        setKpis({ count: '0' });
        return;
      }
      var q = opts.queryMode === 'api' ? '' : (elQ.value || '').trim().toLowerCase();
      var filtered = rows;
      if (q) {
        filtered = rows.filter(function (r) {
          return columns.some(function (c) {
            var v = r[c.key];
            return v != null && String(v).toLowerCase().indexOf(q) !== -1;
          });
        });
      }
      if (state.sortKey) {
        var sk = state.sortKey;
        var dir = state.sortDir;
        filtered = filtered.slice().sort(function (a, b) {
          var av = a[sk];
          var bv = b[sk];
          if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * dir;
          return String(av == null ? '' : av).localeCompare(String(bv == null ? '' : bv), 'zh-Hant') * dir;
        });
      }
      setKpis({ count: String(filtered.length) });
      if (!filtered.length) {
        setBoard('<div class="lv-empty">沒有符合搜尋的結果</div>');
        return;
      }
      var thead = columns.map(function (c) {
        var mark = state.sortKey === c.key ? (state.sortDir > 0 ? ' ↑' : ' ↓') : '';
        return '<th data-sort="' + esc(c.key) + '">' + esc(c.label) + mark + '</th>';
      }).join('');
      var tbody = filtered.map(function (r) {
        return '<tr>' + columns.map(function (c) {
          var raw = r[c.key];
          var text = c.format ? c.format(raw, r) : (raw == null ? '—' : String(raw));
          var cls = c.className ? c.className(raw, r) : '';
          return '<td class="' + esc(cls) + '">' + esc(text) + '</td>';
        }).join('') + '</tr>';
      }).join('');
      setBoard(
        '<div class="lv-table-wrap"><table class="lv-table"><thead><tr>' + thead +
        '</tr></thead><tbody>' + tbody + '</tbody></table></div>'
      );
      elBoard.querySelectorAll('th[data-sort]').forEach(function (th) {
        th.addEventListener('click', function () {
          var key = th.getAttribute('data-sort');
          if (state.sortKey === key) state.sortDir *= -1;
          else {
            state.sortKey = key;
            state.sortDir = 1;
          }
          renderTable(columns, state.rows, emptyMsg);
        });
      });
    }

    function renderCards(items, emptyMsg) {
      var q = opts.queryMode === 'api' ? '' : (elQ.value || '').trim().toLowerCase();
      var list = items || [];
      if (q) {
        list = list.filter(function (it) {
          return String(it.title || '').toLowerCase().indexOf(q) !== -1 ||
            String(it.meta || '').toLowerCase().indexOf(q) !== -1;
        });
      }
      setKpis({ count: String(list.length) });
      if (!list.length) {
        setBoard('<div class="lv-empty">' + esc(emptyMsg || '目前沒有資料') + '</div>');
        return;
      }
      setBoard(
        '<div class="lv-cards">' + list.map(function (it) {
          return (
            '<article class="lv-topic">' +
            '<div class="lv-topic__rank">' + esc(it.rank || '') + '</div>' +
            '<h3 class="lv-topic__title">' + esc(it.title) + '</h3>' +
            '<div class="lv-topic__meta">' + esc(it.meta || '') + '</div>' +
            '</article>'
          );
        }).join('') + '</div>'
      );
    }

    var ctx = {
      getQuery: function () { return (elQ.value || '').trim(); },
      getFilters: getFilters,
      setKpis: setKpis,
      setMeta: setMeta,
      setToast: setToast,
      setBoard: setBoard,
      setError: setError,
      renderTable: renderTable,
      renderCards: renderCards,
      skeleton: function () { setBoard(skeletonHtml()); }
    };

    function clearAuto() {
      if (timerId != null) {
        clearInterval(timerId);
        timerId = null;
      }
    }

    function scheduleAuto() {
      clearAuto();
      state.autoSec = Number(elAuto.value) || 0;
      if (state.autoSec > 0) {
        timerId = setInterval(function () { refresh(); }, state.autoSec * 1000);
      }
    }

    function refresh() {
      if (state.loading) return;
      state.loading = true;
      setKpis({ status: '載入中…' });
      ctx.skeleton();
      setToast('');
      Promise.resolve()
        .then(function () { return opts.onLoad(ctx); })
        .then(function () {
          setKpis({ status: { text: '已更新', cls: 'is-up' } });
          if (!state.lastUpdated) setMeta(Date.now());
        })
        .catch(function (err) {
          var msg = (err && err.message) ? err.message : '無法取得資料';
          setError(msg + '。請稍後重試。');
          setToast('若持續失敗，可能是 API 額度或網路限制。');
        })
        .finally(function () {
          state.loading = false;
        });
    }

    app.querySelector('#lv-refresh').addEventListener('click', refresh);
    elAuto.addEventListener('change', scheduleAuto);
    elQ.addEventListener('input', function () {
      if (opts.queryMode === 'api') return;
      if (opts.onFilter && state.rows) opts.onFilter(ctx);
      else if (state.lastColumns && state.rows) renderTable(state.lastColumns, state.rows);
    });
    app.querySelectorAll('[data-filter]').forEach(function (sel) {
      sel.addEventListener('change', refresh);
    });

    onCleanup(app, clearAuto);
    onCleanup(app, function () {
      app.classList.remove('wa-live');
    });

    scheduleAuto();
    refresh();
  }

  /* ——— 1. Crypto ——— */
  function mountCrypto(app) {
    var cols = [
      { key: 'name', label: '幣種' },
      { key: 'symbol', label: '代號' },
      { key: 'price', label: 'USD 價格', format: function (v) { return '$' + fmtNum(v, 2); } },
      { key: 'change', label: '24h', format: fmtPct, className: changeClass },
      { key: 'mcap', label: '市值', format: function (v) { return '$' + fmtNum(v, 0); } }
    ];
    mountBoard(app, {
      title: '加密貨幣即時看板',
      lead: 'BTC／ETH 等熱門幣價格、24 小時漲跌與市值，可搜尋與自動更新。',
      source: 'CoinGecko public API',
      searchPlaceholder: 'BTC、Ethereum…',
      autoDefault: 60,
      disclaimer: '行情僅供參考，非正式交易報價。',
      onLoad: function (ctx) {
        var url = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,solana,ripple,cardano,dogecoin,binancecoin,toncoin,avalanche-2,chainlink&order=market_cap_desc&sparkline=false';
        return fetchJson(url).then(function (data) {
          var rows = (data || []).map(function (c) {
            return {
              name: c.name,
              symbol: String(c.symbol || '').toUpperCase(),
              price: c.current_price,
              change: c.price_change_percentage_24h,
              mcap: c.market_cap
            };
          });
          var btc = rows.find(function (r) { return r.symbol === 'BTC'; });
          ctx.setKpis({
            highlight: btc ? { text: '$' + fmtNum(btc.price, 0), cls: changeClass(btc.change) } : '—',
            count: String(rows.length)
          });
          ctx.setMeta(Date.now());
          ctx.renderTable(cols, rows);
        });
      }
    });
  }

  /* ——— 2. FX ——— */
  function mountFx(app) {
    var cols = [
      { key: 'pair', label: '貨幣對' },
      { key: 'rate', label: '匯率', format: function (v) { return fmtNum(v, 4); } },
      { key: 'converted', label: '換算結果', format: function (v) { return fmtNum(v, 2); } }
    ];
    mountBoard(app, {
      title: '匯率即時看板',
      lead: '以基準貨幣查主要貨幣對，並依輸入金額試算換算結果。',
      source: 'open.er-api.com / Frankfurter',
      searchPlaceholder: 'JPY、歐元…',
      filters: [
        {
          id: 'base',
          label: '基準',
          options: [
            { value: 'USD', label: 'USD', selected: true },
            { value: 'TWD', label: 'TWD' },
            { value: 'EUR', label: 'EUR' },
            { value: 'JPY', label: 'JPY' },
            { value: 'CNY', label: 'CNY' }
          ]
        },
        {
          id: 'amount',
          label: '金額',
          options: [
            { value: '1', label: '1', selected: true },
            { value: '100', label: '100' },
            { value: '1000', label: '1000' },
            { value: '10000', label: '10000' }
          ]
        }
      ],
      autoDefault: 120,
      disclaimer: '匯率僅供參考，請以銀行／刷卡實際匯率為準。',
      onLoad: function (ctx) {
        var f = ctx.getFilters();
        var base = f.base || 'USD';
        var amount = Number(f.amount) || 1;
        var want = ['TWD', 'USD', 'EUR', 'JPY', 'GBP', 'CNY', 'HKD', 'KRW', 'AUD', 'SGD'];

        function rowsFromRates(rates, sourceLabel, dateLabel) {
          var rows = want.filter(function (code) { return code !== base && rates[code] != null; }).map(function (code) {
            var rate = Number(rates[code]);
            return {
              pair: base + '/' + code,
              rate: rate,
              converted: rate * amount,
              _code: code
            };
          });
          var twd = rates.TWD;
          ctx.setKpis({
            highlight: twd != null ? (base + '/TWD ' + fmtNum(twd, 2)) : (rows[0] ? rows[0].pair : '—'),
            count: String(rows.length)
          });
          ctx.setMeta(dateLabel || Date.now(), sourceLabel + ' · 基準 ' + base);
          ctx.renderTable(cols, rows);
        }

        var erUrl = 'https://open.er-api.com/v6/latest/' + encodeURIComponent(base);
        return fetchJson(erUrl).then(function (data) {
          if (!data || data.result !== 'success' || !data.rates) throw new Error('er-api empty');
          rowsFromRates(data.rates, 'open.er-api.com', data.time_last_update_utc || data.date);
        }).catch(function () {
          var targets = want.filter(function (c) { return c !== base; }).join(',');
          var url = 'https://api.frankfurter.app/latest?from=' + encodeURIComponent(base) + '&to=' + encodeURIComponent(targets);
          return fetchJson(url).then(function (data) {
            rowsFromRates(data.rates || {}, 'Frankfurter / ECB', data.date);
          });
        });
      }
    });
  }

  /* ——— 3. Global earthquake ——— */
  function mountEarthquake(app) {
    var cols = [
      { key: 'mag', label: '規模', format: function (v) { return fmtNum(v, 1); } },
      { key: 'place', label: '震央' },
      { key: 'depth', label: '深度 km', format: function (v) { return fmtNum(v, 1); } },
      { key: 'time', label: '時間', format: fmtTime },
      { key: 'coords', label: '座標' }
    ];
    mountBoard(app, {
      title: '全球地震即時通報',
      lead: '近 24 小時全球地震列表：規模、震央、深度與時間，可依規模篩選。',
      source: 'USGS Earthquake API',
      searchPlaceholder: '地名、國家…',
      filters: [
        {
          id: 'minMag',
          label: '最小規模',
          options: [
            { value: '2.5', label: '2.5+', selected: true },
            { value: '4.0', label: '4.0+' },
            { value: '5.0', label: '5.0+' },
            { value: '6.0', label: '6.0+' }
          ]
        }
      ],
      autoDefault: 120,
      disclaimer: '非正式地震警報系統；緊急情況請依當地官方通報。',
      onLoad: function (ctx) {
        var minMag = Number(ctx.getFilters().minMag) || 2.5;
        var feed = minMag >= 4.5
          ? 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_day.geojson'
          : 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson';
        return fetchJson(feed).then(function (data) {
          var rows = (data.features || []).map(function (f) {
            var p = f.properties || {};
            var g = (f.geometry && f.geometry.coordinates) || [];
            return {
              mag: p.mag,
              place: p.place || '—',
              depth: g[2],
              time: p.time,
              coords: (g[1] != null && g[0] != null) ? (fmtNum(g[1], 2) + ', ' + fmtNum(g[0], 2)) : '—'
            };
          }).filter(function (r) { return r.mag == null || r.mag >= minMag; });
          var max = rows.reduce(function (m, r) { return r.mag > m ? r.mag : m; }, 0);
          ctx.setKpis({
            highlight: max ? '最大 M' + fmtNum(max, 1) : '—',
            count: String(rows.length)
          });
          ctx.setMeta(Date.now());
          ctx.renderTable(cols, rows);
        });
      }
    });
  }

  /* ——— 4. Taiwan quake ——— */
  function mountTwQuake(app) {
    var cols = [
      { key: 'mag', label: '規模', format: function (v) { return fmtNum(v, 1); } },
      { key: 'place', label: '震央' },
      { key: 'depth', label: '深度 km', format: function (v) { return fmtNum(v, 1); } },
      { key: 'time', label: '時間', format: fmtTime },
      { key: 'coords', label: '座標' }
    ];

    function loadUsgsTw() {
      var url = 'https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=' +
        encodeURIComponent(new Date(Date.now() - 14 * 864e5).toISOString().slice(0, 10)) +
        '&minlatitude=21&maxlatitude=26.5&minlongitude=119&maxlongitude=123&orderby=time&limit=50';
      return fetchJson(url).then(function (data) {
        return {
          source: 'USGS（台灣範圍備援）',
          rows: (data.features || []).map(function (f) {
            var p = f.properties || {};
            var g = (f.geometry && f.geometry.coordinates) || [];
            return {
              mag: p.mag,
              place: p.place || '—',
              depth: g[2],
              time: p.time,
              coords: (g[1] != null && g[0] != null) ? (fmtNum(g[1], 2) + ', ' + fmtNum(g[0], 2)) : '—'
            };
          })
        };
      });
    }

    function tryCwaThenUsgs() {
      // CWA open data often requires Authorization; attempt public JSON if available, else USGS.
      var cwaUrl = 'https://opendata.cwa.gov.tw/fileapi/v1/opendataapi/E-A0015-001?Authorization=rdec-key-default-open-data-format=JSON&format=JSON';
      return fetchJson(cwaUrl, { timeout: 8000 }).then(function (data) {
        var list = ((((data || {}).records || {}).Earthquake) || data.Earthquake || []);
        if (!Array.isArray(list) || !list.length) throw new Error('CWA empty');
        var rows = list.slice(0, 50).map(function (eq) {
          var info = eq.EarthquakeInfo || eq;
          var epi = info.Epicenter || {};
          var lat = Number(epi.EpicenterLatitude || epi.lat);
          var lon = Number(epi.EpicenterLongitude || epi.lon);
          return {
            mag: Number(info.EarthquakeMagnitude && info.EarthquakeMagnitude.MagnitudeValue) || Number(info.Magnitude),
            place: epi.Location || info.OriginTime || '台灣周邊',
            depth: Number(info.FocalDepth),
            time: info.OriginTime ? Date.parse(String(info.OriginTime).replace(/-/g, '/')) : null,
            coords: (!Number.isNaN(lat) && !Number.isNaN(lon)) ? (fmtNum(lat, 2) + ', ' + fmtNum(lon, 2)) : '—'
          };
        });
        return { source: '中央氣象署開放資料', rows: rows };
      }).catch(function () {
        return loadUsgsTw();
      });
    }

    mountBoard(app, {
      title: '台灣地震速報查詢',
      lead: '近期台灣周邊地震列表與規模篩選；氣象署資料失敗時自動備援 USGS。',
      source: '氣象署開放資料／USGS',
      searchPlaceholder: '地名…',
      filters: [
        {
          id: 'minMag',
          label: '最小規模',
          options: [
            { value: '0', label: '全部', selected: true },
            { value: '3.5', label: '3.5+' },
            { value: '4.5', label: '4.5+' },
            { value: '5.5', label: '5.5+' }
          ]
        }
      ],
      autoDefault: 120,
      disclaimer: '非正式速報／警報；請以中央氣象署官方資訊為準。',
      onLoad: function (ctx) {
        var minMag = Number(ctx.getFilters().minMag) || 0;
        return tryCwaThenUsgs().then(function (pack) {
          var rows = (pack.rows || []).filter(function (r) {
            return r.mag == null || r.mag >= minMag;
          });
          var max = rows.reduce(function (m, r) { return (r.mag || 0) > m ? r.mag : m; }, 0);
          ctx.setKpis({
            highlight: max ? '最大 M' + fmtNum(max, 1) : '—',
            count: String(rows.length)
          });
          ctx.setMeta(Date.now(), pack.source);
          ctx.renderTable(cols, rows, '此範圍近期無符合條件的地震');
        });
      }
    });
  }

  /* ——— 5. Weather ——— */
  function mountWeather(app) {
    var cols = [
      { key: 'city', label: '城市' },
      { key: 'temp', label: '溫度 °C', format: function (v) { return fmtNum(v, 1); } },
      { key: 'precip', label: '降雨 mm', format: function (v) { return fmtNum(v, 1); } },
      { key: 'humidity', label: '濕度 %', format: function (v) { return fmtNum(v, 0); } },
      { key: 'wind', label: '風速 km/h', format: function (v) { return fmtNum(v, 1); } },
      { key: 'code', label: '天氣碼' }
    ];
    var defaults = ['Taipei', 'Tokyo', 'Singapore', 'London', 'New York'];

    mountBoard(app, {
      title: '全球城市即時天氣',
      lead: '搜尋城市名稱，查看目前溫度、降雨、濕度與風速（Open-Meteo）。',
      source: 'Open-Meteo',
      searchPlaceholder: '輸入城市後按重新整理，空白則顯示熱門城市',
      queryMode: 'api',
      autoDefault: 0,
      disclaimer: '天氣預報僅供參考，請以當地氣象單位為準。',
      onLoad: function (ctx) {
        var q = ctx.getQuery() || defaults.join(',');
        var names = q.split(/[,，]/).map(function (s) { return s.trim(); }).filter(Boolean).slice(0, 6);
        return Promise.all(names.map(function (name) {
          var geoUrl = 'https://geocoding-api.open-meteo.com/v1/search?name=' + encodeURIComponent(name) + '&count=1&language=zh&format=json';
          return fetchJson(geoUrl).then(function (geo) {
            var hit = (geo.results || [])[0];
            if (!hit) return { city: name, temp: null, precip: null, humidity: null, wind: null, code: '找不到' };
            var wUrl = 'https://api.open-meteo.com/v1/forecast?latitude=' + hit.latitude +
              '&longitude=' + hit.longitude +
              '&current=temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m&timezone=auto';
            return fetchJson(wUrl).then(function (w) {
              var cur = w.current || {};
              return {
                city: hit.name + (hit.country_code ? ' (' + hit.country_code + ')' : ''),
                temp: cur.temperature_2m,
                precip: cur.precipitation,
                humidity: cur.relative_humidity_2m,
                wind: cur.wind_speed_10m,
                code: cur.weather_code
              };
            });
          });
        })).then(function (rows) {
          var first = rows[0];
          ctx.setKpis({
            highlight: first && first.temp != null ? (first.city + ' ' + fmtNum(first.temp, 1) + '°C') : '—',
            count: String(rows.length)
          });
          ctx.setMeta(Date.now());
          ctx.renderTable(cols, rows);
        });
      }
    });
  }

  /* ——— 6. Flight / OpenSky ——— */
  function mountFlight(app) {
    var cols = [
      { key: 'callsign', label: '呼號' },
      { key: 'origin', label: '起飛國' },
      { key: 'alt', label: '高度 m', format: function (v) { return v == null ? '—' : fmtNum(v, 0); } },
      { key: 'speed', label: '速度 m/s', format: function (v) { return v == null ? '—' : fmtNum(v, 1); } },
      { key: 'coords', label: '座標' },
      { key: 'onGround', label: '狀態' }
    ];
    var regions = {
      tw: { lamin: 21.5, lomin: 119.2, lamax: 25.5, lomax: 122.2, label: '台灣空域' },
      jp: { lamin: 30, lomin: 128, lamax: 46, lomax: 146, label: '日本空域' },
      sg: { lamin: 0.5, lomin: 103, lamax: 2, lomax: 105, label: '新加坡空域' }
    };

    mountBoard(app, {
      title: '即時航班空域速查',
      lead: '依區域查看飛行器呼號、高度與速度。OpenSky 匿名額度有限，忙碌時可能失敗。',
      source: 'OpenSky Network',
      searchPlaceholder: '呼號、起飛國…',
      filters: [
        {
          id: 'region',
          label: '區域',
          options: [
            { value: 'tw', label: '台灣', selected: true },
            { value: 'jp', label: '日本' },
            { value: 'sg', label: '新加坡' }
          ]
        }
      ],
      autoDefault: 0,
      disclaimer: '空域資料僅供參考，非正式飛航管制資訊。',
      onLoad: function (ctx) {
        var reg = regions[ctx.getFilters().region] || regions.tw;
        var url = 'https://opensky-network.org/api/states/all?lamin=' + reg.lamin +
          '&lomin=' + reg.lomin + '&lamax=' + reg.lamax + '&lomax=' + reg.lomax;
        return fetchJson(url, { timeout: 15000 }).then(function (data) {
          var rows = (data.states || []).slice(0, 80).map(function (s) {
            return {
              callsign: (s[1] || '').trim() || s[0] || '—',
              origin: s[2] || '—',
              alt: s[7],
              speed: s[9],
              coords: (s[6] != null && s[5] != null) ? (fmtNum(s[6], 2) + ', ' + fmtNum(s[5], 2)) : '—',
              onGround: s[8] ? '地面' : '空中'
            };
          });
          ctx.setKpis({
            highlight: reg.label + ' ' + rows.length + ' 架',
            count: String(rows.length)
          });
          ctx.setMeta(data.time ? data.time * 1000 : Date.now(), 'OpenSky · ' + reg.label);
          ctx.renderTable(cols, rows, '此區域目前無公開狀態，或 API 額度已用盡');
        }).catch(function (err) {
          throw new Error('OpenSky 暫時無法連線（' + ((err && err.message) || '網路／額度') + '）');
        });
      }
    });
  }

  /* ——— 7. Football ——— */
  function mountFootball(app) {
    var leagues = {
      '4328': '英超 Premier League',
      '4335': '西甲 La Liga',
      '4332': '義甲 Serie A',
      '4331': '德甲 Bundesliga'
    };
    var cols = [
      { key: 'rank', label: '#' },
      { key: 'team', label: '球隊' },
      { key: 'played', label: '場次' },
      { key: 'win', label: '勝' },
      { key: 'draw', label: '平' },
      { key: 'loss', label: '負' },
      { key: 'gd', label: '淨勝' },
      { key: 'pts', label: '積分' }
    ];

    mountBoard(app, {
      title: '足球賽事積分看板',
      lead: '熱門聯賽積分榜速查，可切換聯賽並搜尋球隊。',
      source: 'TheSportsDB',
      searchPlaceholder: '球隊名稱…',
      filters: [
        {
          id: 'league',
          label: '聯賽',
          options: Object.keys(leagues).map(function (id, i) {
            return { value: id, label: leagues[id], selected: i === 0 };
          })
        }
      ],
      autoDefault: 0,
      disclaimer: '賽事積分僅供參考，請以官方聯賽公告為準。',
      onLoad: function (ctx) {
        var leagueId = ctx.getFilters().league || '4328';
        var url = 'https://www.thesportsdb.com/api/v1/json/3/lookuptable.php?l=' + encodeURIComponent(leagueId);
        return fetchJson(url).then(function (data) {
          var table = data.table || [];
          var rows = table.map(function (t) {
            return {
              rank: Number(t.intRank) || t.intRank,
              team: t.strTeam,
              played: Number(t.intPlayed) || t.intPlayed,
              win: Number(t.intWin) || t.intWin,
              draw: Number(t.intDraw) || t.intDraw,
              loss: Number(t.intLoss) || t.intLoss,
              gd: Number(t.intGoalDifference) || t.intGoalDifference,
              pts: Number(t.intPoints) || t.intPoints
            };
          });
          ctx.setKpis({
            highlight: leagues[leagueId] || leagueId,
            count: String(rows.length)
          });
          ctx.setMeta(Date.now(), 'TheSportsDB · ' + (leagues[leagueId] || ''));
          ctx.renderTable(cols, rows, '此聯賽暫無積分資料');
        });
      }
    });
  }

  /* ——— 8. NBA ——— */
  function mountNba(app) {
    var cols = [
      { key: 'date', label: '日期' },
      { key: 'match', label: '對戰' },
      { key: 'score', label: '比分' },
      { key: 'status', label: '狀態' },
      { key: 'venue', label: '場地' }
    ];

    function dayStr(offset) {
      var d = new Date(Date.now() + offset * 864e5);
      var y = d.getUTCFullYear();
      var m = String(d.getUTCMonth() + 1).padStart(2, '0');
      var day = String(d.getUTCDate()).padStart(2, '0');
      return y + '-' + m + '-' + day;
    }

    mountBoard(app, {
      title: 'NBA 賽事速查',
      lead: '今日與前後日 NBA 賽程／比分摘要（公開賽事資料）。',
      source: 'TheSportsDB',
      searchPlaceholder: '球隊…',
      filters: [
        {
          id: 'day',
          label: '日期',
          options: [
            { value: '0', label: '今日 (UTC)', selected: true },
            { value: '-1', label: '昨日' },
            { value: '1', label: '明日' }
          ]
        }
      ],
      autoDefault: 60,
      disclaimer: '比分摘要僅供參考，非正式官方即時轉播系統。',
      onLoad: function (ctx) {
        var offset = Number(ctx.getFilters().day) || 0;
        var day = dayStr(offset);
        var url = 'https://www.thesportsdb.com/api/v1/json/3/eventsday.php?d=' + encodeURIComponent(day) + '&s=Basketball';
        return fetchJson(url).then(function (data) {
          var events = (data.events || []).filter(function (e) {
            var league = String(e.strLeague || '');
            return /NBA/i.test(league) || /National Basketball Association/i.test(league);
          });
          if (!events.length && (data.events || []).length) {
            events = (data.events || []).filter(function (e) {
              return /NBA|Lakers|Celtics|Warriors|Knicks|Bulls/i.test(
                String(e.strHomeTeam || '') + ' ' + String(e.strAwayTeam || '') + ' ' + String(e.strLeague || '')
              );
            });
          }
          var rows = events.map(function (e) {
            var hs = e.intHomeScore;
            var as = e.intAwayScore;
            var score = (hs != null && as != null) ? (hs + ' : ' + as) : '—';
            return {
              date: e.dateEvent || day,
              match: (e.strAwayTeam || '?') + ' @ ' + (e.strHomeTeam || '?'),
              score: score,
              status: e.strStatus || e.strProgress || '—',
              venue: e.strVenue || '—'
            };
          });
          ctx.setKpis({
            highlight: day + ' · ' + rows.length + ' 場',
            count: String(rows.length)
          });
          ctx.setMeta(Date.now(), 'TheSportsDB · NBA · ' + day);
          ctx.renderTable(cols, rows, '此日暫無 NBA 賽程（休賽期或時區差異）');
        });
      }
    });
  }

  /* ——— 9. Gold / metals ——— */
  function mountGold(app) {
    var cols = [
      { key: 'name', label: '標的' },
      { key: 'symbol', label: '代號' },
      { key: 'price', label: 'USD', format: function (v) { return '$' + fmtNum(v, 2); } },
      { key: 'change', label: '24h', format: fmtPct, className: changeClass }
    ];

    mountBoard(app, {
      title: '金價與貴金屬速查',
      lead: '以代幣化黃金／白銀等公開行情作為貴金屬參考價（非銀行牌告）。',
      source: 'CoinGecko（代幣化金屬）',
      searchPlaceholder: 'Gold、Silver…',
      autoDefault: 60,
      disclaimer: '參考價非正式銀行金價或期貨報價，不可作為交易依據。',
      onLoad: function (ctx) {
        var ids = 'tether-gold,pax-gold,kinesis-gold,kinesis-silver,silver';
        var url = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=' + ids + '&sparkline=false';
        return fetchJson(url).then(function (data) {
          var rows = (data || []).map(function (c) {
            return {
              name: c.name,
              symbol: String(c.symbol || '').toUpperCase(),
              price: c.current_price,
              change: c.price_change_percentage_24h
            };
          });
          var gold = rows.find(function (r) { return /GOLD|XAUT|PAXG/i.test(r.symbol + r.name); }) || rows[0];
          ctx.setKpis({
            highlight: gold ? { text: '$' + fmtNum(gold.price, 2), cls: changeClass(gold.change) } : '—',
            count: String(rows.length)
          });
          ctx.setMeta(Date.now());
          ctx.renderTable(cols, rows, '暫無貴金屬參考行情');
        });
      }
    });
  }

  /* ——— 10. Trends ——— */
  function mountTrends(app) {
    function ymd(d) {
      return {
        y: d.getUTCFullYear(),
        m: String(d.getUTCMonth() + 1).padStart(2, '0'),
        day: String(d.getUTCDate()).padStart(2, '0')
      };
    }

    mountBoard(app, {
      title: '熱門趨勢關鍵字牆',
      lead: '彙整維基百科熱門瀏覽頁面作為話題參考牆（非 Google Trends 官方）。',
      source: 'Wikimedia Pageviews / Wikipedia',
      searchPlaceholder: '關鍵字…',
      filters: [
        {
          id: 'wiki',
          label: '語系',
          options: [
            { value: 'zh.wikipedia', label: '中文維基', selected: true },
            { value: 'en.wikipedia', label: '英文維基' },
            { value: 'ja.wikipedia', label: '日文維基' }
          ]
        }
      ],
      autoDefault: 0,
      disclaimer: '非 Google 官方熱搜；頁面瀏覽量僅供話題參考。',
      onLoad: function (ctx) {
        var wiki = ctx.getFilters().wiki || 'zh.wikipedia';
        var d = new Date(Date.now() - 2 * 864e5);
        var p = ymd(d);
        var url = 'https://wikimedia.org/api/rest_v1/metrics/pageviews/top/' +
          encodeURIComponent(wiki) + '/all-access/' + p.y + '/' + p.m + '/' + p.day;
        return fetchJson(url).then(function (data) {
          var articles = ((((data || {}).items || [])[0] || {}).articles) || [];
          var skip = /^(Special:|Wikipedia:|Main_Page|Wiki|Portal:|File:|Template:)/i;
          var items = articles.filter(function (a) {
            return a.article && !skip.test(a.article);
          }).slice(0, 30).map(function (a, i) {
            return {
              rank: '#' + (a.rank || i + 1),
              title: String(a.article).replace(/_/g, ' '),
              meta: '瀏覽約 ' + Number(a.views || 0).toLocaleString('zh-TW') + ' · ' + p.y + '-' + p.m + '-' + p.day
            };
          });
          ctx.setKpis({
            highlight: wiki.split('.')[0].toUpperCase() + ' Top',
            count: String(items.length)
          });
          ctx.setMeta(p.y + '-' + p.m + '-' + p.day, 'Wikimedia · ' + wiki);
          ctx.renderCards(items, '暫無熱門頁面資料');
        });
      }
    });
  }

  var mounts = {
    'live-crypto': mountCrypto,
    'live-fx': mountFx,
    'live-earthquake': mountEarthquake,
    'live-tw-quake': mountTwQuake,
    'live-weather': mountWeather,
    'live-flight': mountFlight,
    'live-football': mountFootball,
    'live-nba': mountNba,
    'live-gold': mountGold,
    'live-trends': mountTrends
  };

  global.WA_MOUNT_LIVE = Object.assign(global.WA_MOUNT_LIVE || {}, mounts);
})(typeof window !== 'undefined' ? window : this);
