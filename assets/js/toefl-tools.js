/**
 * TOEFL iBT theme mounts — concise guides + 60-example practice UIs.
 */
(function (global) {
  'use strict';

  var TOEFL_CSS_VER = '0.6.48';
  var TOEFL_L2_VER = '0.6.42';

  function toeflCssHref() {
    if (global.WA_TOOL_URLS && typeof global.WA_TOOL_URLS.absolutePageHref === 'function') {
      return global.WA_TOOL_URLS.absolutePageHref('assets/css/toefl-tools.css') + '?v=' + TOEFL_CSS_VER;
    }
    var path = String(location.pathname || '').replace(/\\/g, '/');
    if (/\/(en\/)?toefl(\/|$)/i.test(path)) {
      return (path.indexOf('/en/') >= 0 ? '../../' : '../') + 'assets/css/toefl-tools.css?v=' + TOEFL_CSS_VER;
    }
    return 'assets/css/toefl-tools.css?v=' + TOEFL_CSS_VER;
  }

  function ensureCss() {
    var key = 'wa-toefl-css';
    var href;
    try {
      href = new URL(toeflCssHref(), location.href).href;
    } catch (e) {
      href = toeflCssHref();
    }
    if (document.querySelector('link[data-wa-key="' + key + '"]')) return;
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.setAttribute('data-wa-key', key);
    document.head.appendChild(link);
  }

  function el(tag, attrs, kids) {
    const node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach((k) => {
        const v = attrs[k];
        if (v == null || v === false) return;
        if (k === 'className') node.className = v;
        else if (k === 'textContent') node.textContent = v;
        else if (k === 'dataset') Object.assign(node.dataset, v);
        else if (k.startsWith('on') && typeof v === 'function') node.addEventListener(k.slice(2).toLowerCase(), v);
        else node.setAttribute(k, v === true ? '' : String(v));
      });
    }
    (kids || []).forEach((c) => {
      if (c == null || c === false) return;
      node.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    });
    return node;
  }

  function clear(app) {
    while (app.firstChild) app.removeChild(app.firstChild);
  }

  function shell(app, title, lead, bodyKids) {
    ensureCss();
    clear(app);
    app.classList.add('wa-toefl');
    app.appendChild(
      el('div', { className: 'toefl-wrap' }, [
        el('header', { className: 'toefl-hero' }, [
          el('p', { className: 'toefl-eyebrow', textContent: 'TOEFL iBT · 托福' }),
          el('h2', { className: 'toefl-title', textContent: title }),
          lead ? el('p', { className: 'toefl-lead', textContent: lead }) : null,
        ]),
        el('div', { className: 'toefl-body' }, bodyKids),
      ])
    );
  }

  function card(title, kids, tip) {
    return el('section', { className: 'toefl-card' }, [
      title ? el('h3', { className: 'toefl-h3', textContent: title }) : null,
      tip ? el('p', { className: 'toefl-tip', textContent: tip }) : null,
      ...(kids || []),
    ]);
  }

  function ul(items) {
    return el(
      'ul',
      { className: 'toefl-ul' },
      items.map((t) => el('li', null, [typeof t === 'string' ? t : t]))
    );
  }

  function p(text) {
    return el('p', { className: 'toefl-p', textContent: text });
  }

  function linkRow(items) {
    return el(
      'ul',
      { className: 'toefl-links' },
      items.map((it) =>
        el('li', null, [
          el('a', {
            href: it.href,
            target: '_blank',
            rel: 'noopener noreferrer',
            textContent: it.label,
          }),
          it.note ? el('span', { className: 'toefl-muted', textContent: ' — ' + it.note }) : null,
        ])
      )
    );
  }

  function speakEn(text) {
    const t = String(text || '').trim();
    if (!t || !global.speechSynthesis) return;
    try {
      global.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(t);
      u.lang = 'en-US';
      u.rate = 0.92;
      global.speechSynthesis.speak(u);
    } catch (e) {
      /* ignore */
    }
  }

  function createFamApi(storageKey, cls) {
    const FAM_ORDER = ['', 'fuzzy', 'mid', 'known'];
    const FAM_LABEL = { '': '＋', fuzzy: '模糊', mid: '中等', known: '很熟' };
    const prefix = cls || 'toefl';

    function load() {
      try {
        const raw = JSON.parse(localStorage.getItem(storageKey) || '{}');
        return raw && typeof raw === 'object' ? raw : {};
      } catch (e) {
        return {};
      }
    }
    function save(map) {
      try {
        localStorage.setItem(storageKey, JSON.stringify(map));
      } catch (e) {
        /* ignore */
      }
    }
    function get(map, id) {
      return map[String(id)] || '';
    }
    function cycle(map, id) {
      const k = String(id);
      const cur = map[k] || '';
      const next = FAM_ORDER[(FAM_ORDER.indexOf(cur) + 1) % FAM_ORDER.length];
      if (!next) delete map[k];
      else map[k] = next;
      save(map);
      return next;
    }
    function count(map) {
      const out = { known: 0, mid: 0, fuzzy: 0 };
      Object.keys(map).forEach((k) => {
        if (out[map[k]] != null) out[map[k]] += 1;
      });
      return out;
    }
    function makeSel() {
      return el('select', { className: prefix + '-select', 'aria-label': '熟悉度' }, [
        el('option', { value: 'all', textContent: '熟悉度：全部' }),
        el('option', { value: 'known', textContent: '熟悉度：很熟' }),
        el('option', { value: 'mid', textContent: '熟悉度：中等' }),
        el('option', { value: 'fuzzy', textContent: '熟悉度：模糊' }),
      ]);
    }
    function makeBtn(level, onClick) {
      return el('button', {
        type: 'button',
        className: prefix + '-fam-btn' + (level ? ' is-' + level : ''),
        textContent: FAM_LABEL[level] || '＋',
        title: '點擊切換熟悉度（＋→模糊→中等→很熟）',
        'aria-label': '熟悉度',
        onclick: onClick,
      });
    }
    function metaText(n, map) {
      const c = count(map);
      return (
        '顯示 ' +
        n +
        ' 筆｜本機標記：模糊 ' +
        c.fuzzy +
        '、中等 ' +
        c.mid +
        '、很熟 ' +
        c.known +
        '（僅此瀏覽器）'
      );
    }
    return { load, get, cycle, makeSel, makeBtn, metaText };
  }

  function quizBlock(items, opts) {
    const list = el('div', { className: 'toefl-quiz-list' });
    const filterBar = el('div', { className: 'toefl-filter' });
    const toolbar = el('div', { className: 'toefl-toolbar' });
    const meta = el('p', { className: 'toefl-muted' });
    const topics = Array.from(new Set(items.map((x) => x[opts.topicKey || 'topic'] || x.skill || x.type || x.task)));
    const fam = opts.famKey ? createFamApi(opts.famKey, 'toefl') : null;
    const famSel = fam ? fam.makeSel() : null;
    let active = 'all';
    let famFilter = 'all';
    let famMap = fam ? fam.load() : {};

    function itemId(it) {
      return opts.idOf ? opts.idOf(it) : String(it.id);
    }

    function paint() {
      if (fam) famMap = fam.load();
      list.innerHTML = '';
      let n = 0;
      items
        .filter((it) => {
          if (active !== 'all') {
            const key = it[opts.topicKey] != null ? it[opts.topicKey] : it.skill || it.type || it.task;
            if (String(key) !== String(active)) return false;
          }
          if (fam && famFilter !== 'all' && fam.get(famMap, itemId(it)) !== famFilter) return false;
          return true;
        })
        .forEach((it) => {
          n += 1;
          const id = itemId(it);
          const level = fam ? fam.get(famMap, id) : '';
          const ans = el('div', { className: 'toefl-ans', hidden: true }, [
            el('strong', { textContent: '答案 ' + it.ans + '　' }),
            document.createTextNode(it.why || ''),
          ]);
          const choices = el(
            'ul',
            { className: 'toefl-choices' },
            (it.choices || []).map((c, i) => {
              const raw = String(c || '').replace(/^[A-D][.)]\s*/i, '').trim();
              return el('li', { textContent: String.fromCharCode(65 + i) + '. ' + raw });
            })
          );
          const metaRow = [
            el('span', {
              className: 'toefl-chip',
              textContent: opts.meta ? opts.meta(it) : it.topic || it.skill || String(it.task || ''),
            }),
            el('span', { className: 'toefl-muted', textContent: '#' + it.id }),
          ];
          if (fam) {
            metaRow.push(
              fam.makeBtn(level, () => {
                fam.cycle(famMap, id);
                paint();
              })
            );
          }
          list.appendChild(
            el('article', { className: 'toefl-q' + (level ? ' fam-' + level : '') }, [
              el('div', { className: 'toefl-q-meta' }, metaRow),
              it.point ? el('p', { className: 'toefl-point', textContent: it.point }) : null,
              el('p', { className: 'toefl-stem', textContent: it.q }),
              choices,
              el('button', {
                type: 'button',
                className: 'toefl-btn',
                textContent: '顯示答案',
                onclick: () => {
                  ans.hidden = !ans.hidden;
                },
              }),
              ans,
            ])
          );
        });
      meta.textContent = fam ? fam.metaText(n, famMap) : '顯示 ' + n + ' 筆';
    }

    filterBar.appendChild(
      el('button', {
        type: 'button',
        className: 'toefl-chip-btn is-on',
        textContent: '題型：全部',
        onclick: (e) => setTopic('all', e.currentTarget),
      })
    );
    topics.forEach((t) => {
      filterBar.appendChild(
        el('button', {
          type: 'button',
          className: 'toefl-chip-btn',
          textContent: String(t),
          onclick: (e) => setTopic(String(t), e.currentTarget),
        })
      );
    });

    function setTopic(k, btn) {
      active = k;
      filterBar.querySelectorAll('.toefl-chip-btn').forEach((b) => b.classList.remove('is-on'));
      btn.classList.add('is-on');
      paint();
    }

    if (famSel) {
      famSel.addEventListener('change', () => {
        famFilter = famSel.value;
        paint();
      });
      toolbar.appendChild(famSel);
    }
    paint();
    return fam ? [toolbar, filterBar, meta, list] : [filterBar, list];
  }

  function tipList(items, opts) {
    const list = el('div', { className: 'toefl-quiz-list' });
    const filterBar = el('div', { className: 'toefl-filter' });
    const toolbar = el('div', { className: 'toefl-toolbar' });
    const meta = el('p', { className: 'toefl-muted' });
    const keyName = opts.topicKey || 'type';
    const topics = Array.from(new Set(items.map((x) => x[keyName])));
    const fam = opts.famKey ? createFamApi(opts.famKey, 'toefl') : null;
    const famSel = fam ? fam.makeSel() : null;
    let active = 'all';
    let famFilter = 'all';
    let famMap = fam ? fam.load() : {};

    function speakRow(label, text) {
      return el('div', { className: 'toefl-correct-row' }, [
        el('p', { className: 'toefl-ex', textContent: (label ? label + '：' : '') + text }),
        el('button', {
          type: 'button',
          className: 'toefl-speak-btn toefl-speak-btn-sm',
          title: '朗讀正確句子',
          'aria-label': '朗讀正確句子',
          textContent: '朗讀正確句',
          onclick: () => speakEn(text),
        }),
      ]);
    }

    function paint() {
      if (fam) famMap = fam.load();
      list.innerHTML = '';
      let n = 0;
      items
        .filter((it) => {
          if (active !== 'all' && String(it[keyName]) !== active) return false;
          if (fam && famFilter !== 'all' && fam.get(famMap, String(it.id)) !== famFilter) return false;
          return true;
        })
        .forEach((it) => {
          n += 1;
          const level = fam ? fam.get(famMap, String(it.id)) : '';
          const kids = [
            el('div', { className: 'toefl-q-meta' }, [
              el('span', {
                className: 'toefl-chip',
                textContent: opts.meta ? opts.meta(it) : String(it[keyName]),
              }),
              el('span', { className: 'toefl-muted', textContent: '#' + it.id }),
              fam
                ? fam.makeBtn(level, () => {
                    fam.cycle(famMap, String(it.id));
                    paint();
                  })
                : null,
            ]),
          ];
          if (it.topic) kids.push(el('p', { className: 'toefl-point', textContent: it.topic }));
          if (it.point) kids.push(el('p', { className: 'toefl-point', textContent: it.point }));
          if (it.prompt) kids.push(el('p', { className: 'toefl-stem', textContent: it.prompt }));
          if (it.q) kids.push(el('p', { className: 'toefl-stem', textContent: it.q }));
          if (it.ex) kids.push(speakRow('宜聽／正確句', it.ex));
          if (it.skill) kids.push(el('p', { className: 'toefl-syn', textContent: '技能：' + it.skill }));
          if (Array.isArray(it.outline)) {
            kids.push(el('ul', { className: 'toefl-ul' }, it.outline.map((o) => el('li', { textContent: o }))));
          }
          if (it.sample) kids.push(speakRow('範例', it.sample));
          if (it.tip) kids.push(el('p', { className: 'toefl-tip', textContent: it.tip }));
          list.appendChild(el('article', { className: 'toefl-q' + (level ? ' fam-' + level : '') }, kids));
        });
      meta.textContent = fam ? fam.metaText(n, famMap) : '顯示 ' + n + ' 筆';
    }

    filterBar.appendChild(
      el('button', {
        type: 'button',
        className: 'toefl-chip-btn is-on',
        textContent: '題型：全部',
        onclick: (e) => setTopic('all', e.currentTarget),
      })
    );
    topics.forEach((t) => {
      filterBar.appendChild(
        el('button', {
          type: 'button',
          className: 'toefl-chip-btn',
          textContent: String(t),
          onclick: (e) => setTopic(String(t), e.currentTarget),
        })
      );
    });

    function setTopic(k, btn) {
      active = k;
      filterBar.querySelectorAll('.toefl-chip-btn').forEach((b) => b.classList.remove('is-on'));
      btn.classList.add('is-on');
      paint();
    }

    if (famSel) {
      famSel.addEventListener('change', () => {
        famFilter = famSel.value;
        paint();
      });
      toolbar.appendChild(famSel);
    }
    paint();
    return fam ? [toolbar, filterBar, meta, list] : [filterBar, list];
  }

  function mountIntro(app) {
    shell(app, '托福測驗介紹', '先掌握 iBT 四科結構與計分，再往各技巧頁深入。', [
      card('考試時間（約）', [
        p('Reading、Listening、Speaking、Writing 合計約 2 小時（題數與時間以 ETS 最新版為準）。全程上機，中間休息規定依場次而定。'),
      ]),
      card('四科速覽', [
        ul([
          'Reading：學術長文；細節、推論、詞義、修辭目的、插入句等。',
          'Listening：校園對話＋課堂演講；主旨、細節、態度、組織。',
          'Speaking：Independent／Integrated；限時準備與作答。',
          'Writing：Integrated 摘要＋Academic Discussion 討論帖。',
        ]),
      ]),
      card('計分', [
        p('各科約 0–30，總分 0–120。大學／研究所常見門檻約 80、90、100；研究所或高競爭科系常看 100+。'),
      ]),
      card('下一步：托福單字', [
        p('學術單字與 AWL 是閱讀詞義題與聽力演講的關鍵。可先用本站托福單字記憶工具，依 Level 與學科主題分頁背誦。'),
        linkRow([{ href: 'toefl-vocab.html', label: '托福單字記憶（約萬字）', note: 'Level1／Level2・AWL與學科進階' }]),
      ]),
    ]);
  }

  function mountMock(app) {
    shell(app, '免費模擬測驗', '用官方樣題建立手感；時間與介面最接近實戰。', [
      card('建議用法', [
        ul([
          '整回限時：四科連續或至少讀聽各一回完整段。',
          '口說務必錄音回放；寫作對照範文結構而非只對字數。',
          '錯題標「詞彙／定位／推論／聽漏／模板卡住」。',
        ]),
      ]),
      card('資源入口', [
        linkRow([
          { href: 'https://www.ets.org/toefl', label: 'ETS TOEFL 官方', note: '介紹與樣題' },
          { href: 'https://www.ets.org/toefl/test-takers.html', label: 'Test takers', note: '報名與準備' },
          { href: 'https://www.toefl.com.tw/', label: '台灣區資訊（若適用）', note: '以官網最新為準' },
        ]),
      ]),
    ]);
  }

  function mountScore(app) {
    shell(app, '程度落點分析', '用常見總分門檻對照能力與下一步。', [
      card('分數區間', [
        ul([
          '約 60–70：基礎學術英語；先補高頻學術字與聽力主旨。',
          '約 80：多數大學申請門檻附近；閱讀速度與口說完整度是關鍵。',
          '約 90–100：競爭較強；Integrated 寫作與演講細節要穩。',
          '110+：容錯低；維持模考與錯題複習即可。',
        ]),
      ]),
      card('訂目標', [
        p('先查目標校系最低／平均分，再加 3–5 分緩衝。弱科優先（差 5 分以上的那一科），不要四科平均撒時間。'),
      ]),
    ]);
  }

  function loadScriptOnce(src) {
    return new Promise(function (resolve, reject) {
      var existing = document.querySelector('script[data-wa-src="' + src + '"]');
      if (existing) {
        if (existing.dataset.ready === '1') resolve();
        else existing.addEventListener('load', function () { resolve(); });
        existing.addEventListener('error', reject);
        return;
      }
      var s = document.createElement('script');
      s.src = src;
      s.defer = true;
      s.dataset.waSrc = src;
      s.onload = function () {
        s.dataset.ready = '1';
        resolve();
      };
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  function toeflVocabL2Href() {
    if (global.WA_TOOL_URLS && typeof global.WA_TOOL_URLS.absolutePageHref === 'function') {
      return global.WA_TOOL_URLS.absolutePageHref('assets/js/toefl-vocab-l2-data.js') + '?v=' + TOEFL_L2_VER;
    }
    var path = String(location.pathname || '').replace(/\\/g, '/');
    if (/\/(en\/)?toefl(\/|$)/i.test(path)) {
      return (path.indexOf('/en/') >= 0 ? '../../' : '../') + 'assets/js/toefl-vocab-l2-data.js?v=' + TOEFL_L2_VER;
    }
    return 'assets/js/toefl-vocab-l2-data.js?v=' + TOEFL_L2_VER;
  }

  function mountVocab(app) {
    const l1 = global.WA_TOEFL_VOCAB;
    if (!l1 || !l1.scenarios) {
      shell(app, '學術單字工具', '資料載入失敗，請重新整理。', [p('缺少 WA_TOEFL_VOCAB。')]);
      return;
    }

    const PAGE_SIZE = 24;
    const fam = createFamApi('wa-toefl-vocab-fam', 'toefl');
    const SEEN_KEY = 'wa-toefl-vocab-seen';
    const FAM_FILTER_LABEL = { all: '全部', known: '很熟', mid: '中等', fuzzy: '模糊' };
    const DEFAULT_SCENARIO = { 1: 'biology', 2: 'awl' };

    let level = 1;
    let activeScenarioId = DEFAULT_SCENARIO[1];
    let page = 1;
    let famMap = fam.load();
    let l2Ready = Boolean(global.WA_TOEFL_VOCAB_L2 && global.WA_TOEFL_VOCAB_L2.scenarios);
    let l2Loading = false;

    function loadSeen() {
      try {
        const raw = JSON.parse(localStorage.getItem(SEEN_KEY) || '{}');
        return raw && typeof raw === 'object' ? raw : {};
      } catch (e) {
        return {};
      }
    }
    function saveSeen(map) {
      try {
        localStorage.setItem(SEEN_KEY, JSON.stringify(map));
      } catch (e) {
        /* ignore */
      }
    }
    function wordKey(scenarioId, word) {
      return scenarioId + ':' + String(word || '').toLowerCase();
    }
    function markSeen(scenarioId, words) {
      if (!scenarioId || !words || !words.length) return;
      const seen = loadSeen();
      let changed = false;
      words.forEach((w) => {
        const k = wordKey(scenarioId, w.w);
        if (!seen[k]) {
          seen[k] = 1;
          changed = true;
        }
      });
      if (changed) saveSeen(seen);
    }
    function scenarioProgress(scenario) {
      const total = (scenario && scenario.words && scenario.words.length) || 0;
      if (!total) return { total: 0, seen: 0, pct: 0, marked: 0 };
      const seenMap = loadSeen();
      famMap = fam.load();
      let seen = 0;
      let marked = 0;
      (scenario.words || []).forEach((w) => {
        const k = wordKey(scenario.id, w.w);
        if (seenMap[k]) seen += 1;
        if (famMap[k]) marked += 1;
      });
      return {
        total: total,
        seen: seen,
        pct: Math.round((seen / total) * 100),
        marked: marked,
      };
    }

    const levelBar = el('div', { className: 'toefl-level-bar', role: 'tablist', 'aria-label': '單字等級' });
    const btnL1 = el('button', {
      type: 'button',
      className: 'toefl-level-btn is-on',
      role: 'tab',
      'aria-selected': 'true',
      textContent: 'Level 1｜學術基礎（約 80–100）',
    });
    const btnL2 = el('button', {
      type: 'button',
      className: 'toefl-level-btn',
      role: 'tab',
      'aria-selected': 'false',
      textContent: 'Level 2｜AWL＋學科進階（110–120）',
    });
    levelBar.appendChild(btnL1);
    levelBar.appendChild(btnL2);

    const levelHint = el('p', {
      className: 'toefl-muted',
      textContent: l1.label || 'Level 1｜學術基礎高頻（約 80–100）',
    });
    const scenarioBar = el('div', { className: 'toefl-scenario-bar', 'aria-label': '學術主題' });
    const famSel = fam.makeSel();
    const search = el('input', {
      type: 'search',
      className: 'toefl-input',
      placeholder: '搜尋目前主題內的英文／中文／同義詞…',
      'aria-label': '搜尋單字',
    });
    const grid = el('div', { className: 'toefl-vocab-grid' });
    const meta = el('p', { className: 'toefl-muted toefl-vocab-anchor', id: 'toefl-vocab-top' });
    const pager = el('div', { className: 'toefl-pager' });
    const empty = el('p', {
      className: 'toefl-tip',
      textContent: '請點選上方學術主題，才會載入該分類單字（分頁顯示）。',
    });
    const bankCard = card('字庫', [
      el('div', { className: 'toefl-toolbar' }, [famSel, search]),
      meta,
      empty,
      grid,
      pager,
    ]);
    bankCard.id = 'toefl-vocab-bank';
    bankCard.classList.add('toefl-vocab-bank');

    function scrollToVocabTop() {
      const target = bankCard || meta;
      if (!target) return;
      try {
        if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
      } catch (e) {
        /* ignore */
      }
      const run = () => {
        const header = document.getElementById('header');
        const offset = (header ? header.getBoundingClientRect().height : 72) + 12;
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        try {
          window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
        } catch (e) {
          window.scrollTo(0, Math.max(0, top));
        }
      };
      requestAnimationFrame(() => requestAnimationFrame(run));
    }

    function goToPage(nextPage, pages, doScroll) {
      const n = Math.max(1, Math.min(pages, parseInt(nextPage, 10) || 1));
      if (n !== page) {
        page = n;
        paint();
      }
      if (doScroll !== false) scrollToVocabTop();
    }

    function currentPack() {
      if (level === 2) return global.WA_TOEFL_VOCAB_L2 || null;
      return l1;
    }

    function scenariosOf() {
      const pack = currentPack();
      return (pack && pack.scenarios) || [];
    }

    function activeScenario() {
      return scenariosOf().find((s) => s.id === activeScenarioId) || null;
    }

    function pickDefaultScenario() {
      const preferred = DEFAULT_SCENARIO[level];
      const list = scenariosOf();
      if (preferred && list.some((s) => s.id === preferred)) return preferred;
      return (list[0] && list[0].id) || '';
    }

    function rebuildScenarioBar() {
      scenarioBar.innerHTML = '';
      scenariosOf().forEach((s) => {
        const prog = scenarioProgress(s);
        const btn = el('button', {
          type: 'button',
          className: 'toefl-scenario-chip' + (s.id === activeScenarioId ? ' is-on' : ''),
          title:
            (s.nameEn || s.name) +
            '｜已瀏覽 ' +
            prog.pct +
            '%（' +
            prog.seen +
            '/' +
            prog.total +
            '）｜標記 ' +
            prog.marked +
            ' 字',
          onclick: () => {
            activeScenarioId = s.id;
            page = 1;
            rebuildScenarioBar();
            paint();
          },
        });
        btn.appendChild(el('span', { className: 'toefl-scenario-chip-name', textContent: s.name }));
        btn.appendChild(
          el('span', {
            className: 'toefl-scenario-chip-meta',
            textContent: '已瀏覽 ' + prog.pct + '% · 標記 ' + prog.marked,
          })
        );
        scenarioBar.appendChild(btn);
      });
    }

    function filteredWords(scenario) {
      if (!scenario || !scenario.words) return [];
      const q = (search.value || '').trim().toLowerCase();
      const famFilter = famSel.value;
      famMap = fam.load();
      return scenario.words.filter((w) => {
        const f = fam.get(famMap, wordKey(scenario.id, w.w));
        if (famFilter !== 'all' && f !== famFilter) return false;
        if (!q) return true;
        return [w.w, w.zh, w.syn, w.ex, w.exZh].join(' ').toLowerCase().indexOf(q) >= 0;
      });
    }

    function paintPager(total) {
      pager.innerHTML = '';
      const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
      if (page > pages) page = pages;
      const prev = el('button', {
        type: 'button',
        className: 'toefl-chip-btn',
        textContent: '上一頁',
        onclick: () => {
          if (page > 1) goToPage(page - 1, pages, true);
        },
      });
      const next = el('button', {
        type: 'button',
        className: 'toefl-chip-btn',
        textContent: '下一頁',
        onclick: () => {
          if (page < pages) goToPage(page + 1, pages, true);
        },
      });
      const jumpInput = el('input', {
        type: 'number',
        className: 'toefl-page-input',
        min: '1',
        max: String(pages),
        value: String(page),
        'aria-label': '跳至頁碼',
        title: '輸入頁碼後按 Enter 或點跳轉',
      });
      const jumpBtn = el('button', {
        type: 'button',
        className: 'toefl-chip-btn',
        textContent: '跳轉',
        onclick: () => goToPage(jumpInput.value, pages, true),
      });
      jumpInput.addEventListener('keydown', (ev) => {
        if (ev.key === 'Enter') {
          ev.preventDefault();
          goToPage(jumpInput.value, pages, true);
        }
      });
      if (page <= 1) prev.setAttribute('disabled', 'disabled');
      else prev.removeAttribute('disabled');
      if (page >= pages) next.setAttribute('disabled', 'disabled');
      else next.removeAttribute('disabled');
      pager.appendChild(prev);
      pager.appendChild(el('span', { className: 'toefl-muted', textContent: '第' }));
      pager.appendChild(jumpInput);
      pager.appendChild(
        el('span', {
          className: 'toefl-muted',
          textContent: '／' + pages + ' 頁（每頁 ' + PAGE_SIZE + ' 字）',
        })
      );
      pager.appendChild(jumpBtn);
      pager.appendChild(next);
    }

    function paint() {
      famMap = fam.load();
      grid.innerHTML = '';
      empty.hidden = true;
      pager.hidden = false;

      if (level === 2 && l2Loading) {
        meta.textContent = '正在載入 Level 2 AWL／學科進階字庫…';
        empty.hidden = false;
        empty.textContent = '載入進階字庫中，請稍候。';
        pager.hidden = true;
        return;
      }

      const scenario = activeScenario();
      if (!scenario) {
        meta.textContent =
          (currentPack() && currentPack().label ? currentPack().label + '｜' : '') +
          '共 ' +
          scenariosOf().length +
          ' 個主題 — 請點選分類後再顯示單字';
        empty.hidden = false;
        empty.textContent = '請點選上方學術主題，才會載入該分類單字（分頁顯示）。';
        pager.hidden = true;
        return;
      }

      const words = filteredWords(scenario);
      const total = words.length;
      const start = (page - 1) * PAGE_SIZE;
      const slice = words.slice(start, start + PAGE_SIZE);
      markSeen(scenario.id, slice);
      rebuildScenarioBar();
      const prog = scenarioProgress(scenario);

      slice.forEach((w) => {
        const id = wordKey(scenario.id, w.w);
        const famLevel = fam.get(famMap, id);
        grid.appendChild(
          el('article', { className: 'toefl-vocab-card' + (famLevel ? ' fam-' + famLevel : '') }, [
            el('div', { className: 'toefl-vocab-head' }, [
              el('div', { className: 'toefl-vocab-word' }, [
                el('strong', { textContent: w.w }),
                el('div', { className: 'toefl-vocab-meta' }, [
                  el('button', {
                    type: 'button',
                    className: 'toefl-speak-btn',
                    title: '朗讀單字',
                    'aria-label': '朗讀 ' + w.w,
                    textContent: '🔊',
                    onclick: () => speakEn(w.w),
                  }),
                  el('span', { className: 'toefl-chip', textContent: w.pos || '' }),
                  el('span', {
                    className: 'toefl-chip toefl-chip-level',
                    textContent: 'L' + (w.level || level),
                  }),
                ]),
              ]),
              fam.makeBtn(famLevel, () => {
                fam.cycle(famMap, id);
                paint();
              }),
            ]),
            el('p', { className: 'toefl-p', textContent: w.zh }),
            el('p', { className: 'toefl-syn', textContent: '同義／替換：' + (w.syn || '—') }),
            el('p', { className: 'toefl-ex', textContent: w.ex }),
            el('div', { className: 'toefl-vocab-actions' }, [
              el('button', {
                type: 'button',
                className: 'toefl-speak-btn toefl-speak-btn-sm',
                title: '朗讀例句',
                textContent: '朗讀例句',
                onclick: () => speakEn(w.ex),
              }),
            ]),
            el('p', { className: 'toefl-exzh', textContent: w.exZh }),
            el('p', {
              className: 'toefl-muted',
              textContent: scenario.name + ' · ' + (scenario.tag || ''),
            }),
          ])
        );
      });

      meta.textContent =
        scenario.name +
        '｜符合 ' +
        total +
        ' 字｜本頁 ' +
        slice.length +
        '｜已瀏覽 ' +
        prog.pct +
        '%（' +
        prog.seen +
        '/' +
        prog.total +
        '）｜本主題標記 ' +
        prog.marked +
        '｜' +
        fam.metaText(0, famMap).replace(/^顯示 0 筆｜/, '');
      paintPager(total);
      if (!total) {
        empty.hidden = false;
        empty.textContent =
          '此主題目前沒有符合篩選的單字（熟悉度：' +
          (FAM_FILTER_LABEL[famSel.value] || famSel.value) +
          '）。';
      }
    }

    async function setLevel(next) {
      level = next;
      page = 1;
      btnL1.classList.toggle('is-on', level === 1);
      btnL2.classList.toggle('is-on', level === 2);
      btnL1.setAttribute('aria-selected', level === 1 ? 'true' : 'false');
      btnL2.setAttribute('aria-selected', level === 2 ? 'true' : 'false');

      if (level === 2 && !l2Ready) {
        activeScenarioId = DEFAULT_SCENARIO[2];
        l2Loading = true;
        levelHint.textContent = '載入 Level 2 AWL／學科進階字庫…';
        rebuildScenarioBar();
        paint();
        try {
          await loadScriptOnce(toeflVocabL2Href());
          l2Ready = Boolean(global.WA_TOEFL_VOCAB_L2 && global.WA_TOEFL_VOCAB_L2.scenarios);
        } catch (e) {
          levelHint.textContent = 'Level 2 字庫載入失敗，請重新整理再試。';
          l2Loading = false;
          paint();
          return;
        }
        l2Loading = false;
      }

      activeScenarioId = pickDefaultScenario();
      const pack = currentPack();
      levelHint.textContent = (pack && pack.label) || (level === 1 ? 'Level 1' : 'Level 2');
      rebuildScenarioBar();
      paint();
    }

    btnL1.addEventListener('click', () => setLevel(1));
    btnL2.addEventListener('click', () => setLevel(2));
    famSel.addEventListener('change', () => {
      page = 1;
      paint();
    });
    search.addEventListener('input', () => {
      page = 1;
      paint();
    });

    rebuildScenarioBar();
    paint();

    shell(app, '學術單字工具', 'Level 1 學術基礎打底；Level 2 為 AWL＋學科進階（衝 110–120）。約萬字級，點主題分頁載入。', [
      card('等級與主題', [levelBar, levelHint, scenarioBar]),
      card('怎麼用', [
        ul([
          '先選 Level，再開啟一個學術主題（不會一次渲染全部單字）。',
          '主題顯示「已瀏覽 %」與「標記 n」：翻頁累計覆蓋率；＋ 標記熟悉度才算收藏複習。',
          '每頁 ' + PAGE_SIZE + ' 字；可用熟悉度與搜尋縮小範圍；翻頁會回到字庫頂部，也可輸入頁碼跳轉。',
          'Level 2 含 AWL 核心、研究方法與生物／天文／歷史等進階學科字。',
          '🔊 朗讀；＋ 標記模糊／中等／很熟（本機保存）。',
        ]),
      ]),
      bankCard,
    ]);
  }

  function mountListening(app) {
    const data = global.WA_TOEFL_LISTENING;
    const items = (data && data.items) || [];
    shell(app, '聽力答題技巧', (data && data.focus ? data.focus + ' ' : '') + '可朗讀正確句、標記熟悉度複習。', [
      card('解題重點', [
        ul([
          '先抓目的／主旨，再記例子與轉折（however、actually）。',
          '教授態度題聽語調與評價形容詞。',
          '組織題注意 first／then／as a result 訊號。',
          '可在草稿紙用縮寫記人名、數字、對比兩端。',
        ]),
      ]),
      card(
        '60 情境速記',
        items.length
          ? tipList(items, {
              topicKey: 'type',
              meta: (it) => it.type + ' · ' + it.skill,
              famKey: 'wa-toefl-listening-fam',
            })
          : [p('資料未載入')]
      ),
    ]);
  }

  function mountReading(app) {
    const data = global.WA_TOEFL_READING;
    const items = (data && data.items) || [];
    shell(app, '閱讀解題策略', data && data.focus ? data.focus : '學術長文題型。', [
      card('時間與順序', [
        ul([
          '先題幹問什麼，再回文定位（專有名詞／數字／段落首句）。',
          '詞義題看上下文邏輯，勿只背單字字面。',
          '插入句看代名詞與連接詞指涉。',
          '大意題排除過窄或過偏選項。',
        ]),
      ]),
      card(
        '60 練題',
        items.length
          ? quizBlock(items, { topicKey: 'skill', famKey: 'wa-toefl-reading-fam' })
          : [p('資料未載入')]
      ),
    ]);
  }

  function mountGrammar(app) {
    const data = global.WA_TOEFL_GRAMMAR;
    const items = (data && data.items) || [];
    shell(app, '文法速成指南', data && data.focus ? data.focus : '閱讀與寫作高頻文法。', [
      card('優先順序', [
        ul([
          '主詞動詞一致、關係／名詞子句 — 閱讀長句必考。',
          '分詞構句與平行結構 — 寫作與改錯感。',
          '虛擬、倒裝 — 見題再穩，不必先窮背。',
        ]),
      ]),
      card(
        '60 例題',
        items.length
          ? quizBlock(items, { topicKey: 'topic', famKey: 'wa-toefl-grammar-fam' })
          : [p('資料未載入')]
      ),
    ]);
  }

  function mountSpeaking(app) {
    const data = global.WA_TOEFL_SPEAKING;
    const items = (data && data.items) || [];
    shell(app, '口說備考指南', data && data.focus ? data.focus : 'Independent／Integrated 模板與示範。', [
      card('實戰提醒', [
        ul([
          '準備時間只列 3 點大綱，勿寫全文。',
          'Integrated：先講閱讀立場，再講聽力如何支持／反駁。',
          '語速穩、例子具體勝過於複雜單字。',
        ]),
      ]),
      card('60 題示範', items.length ? tipList(items, { topicKey: 'task', meta: (it) => 'Task ' + it.task }) : [p('資料未載入')]),
    ]);
  }

  function mountWriting(app) {
    const data = global.WA_TOEFL_WRITING;
    const items = (data && data.items) || [];
    shell(app, '寫作備考指南', data && data.focus ? data.focus : 'Integrated 與討論帖結構。', [
      card('結構提醒', [
        ul([
          'Integrated：閱讀主張 → 聽力三點如何挑戰／支持，勿掺私貨。',
          'Discussion：先表態，兩理由＋例子，結尾呼應他人觀點一句。',
          '轉折詞：however、in contrast、for instance 適量即可。',
        ]),
      ]),
      card('60 題示範', items.length ? tipList(items, { topicKey: 'task', meta: (it) => String(it.task) }) : [p('資料未載入')]),
    ]);
  }

  function mountPlan(app) {
    shell(app, '備試時間規劃表', '依準備期選主線；每天固定讀聽，週末練說寫。', [
      card('1 個月衝刺（已接近目標±10）', [
        ul([
          '每日：學術字 30 分＋閱讀 1 篇或聽力 1 段。',
          '隔日口說 2 題錄音；週三／日寫作各 1。',
          '最後一週只維持手感與睡眠，停學新文法書。',
        ]),
      ]),
      card('3 個月扎實', [
        ul([
          '第 1 月：15 主題單字輪完＋文法 60 例。',
          '第 2 月：讀聽技巧＋口說模板定型。',
          '第 3 月：每週至少半套／整回模考＋錯題本。',
        ]),
      ]),
    ]);
  }

  function mountReview(app) {
    const key = 'wa-toefl-error-log';
    let rows = [];
    try {
      rows = JSON.parse(localStorage.getItem(key) || '[]');
      if (!Array.isArray(rows)) rows = [];
    } catch (e) {
      rows = [];
    }
    const typeSel = el('select', { className: 'toefl-select' }, [
      el('option', { value: 'vocab', textContent: '字彙／改寫' }),
      el('option', { value: 'read', textContent: '閱讀定位／推論' }),
      el('option', { value: 'listen', textContent: '聽力聽漏' }),
      el('option', { value: 'speak', textContent: '口說超時／結構' }),
      el('option', { value: 'write', textContent: '寫作偏題／文法' }),
      el('option', { value: 'careless', textContent: '粗心' }),
    ]);
    const note = el('textarea', {
      className: 'toefl-textarea',
      rows: 3,
      placeholder: '錯因（例：修辭目的看成細節）',
    });
    const list = el('ul', { className: 'toefl-ul toefl-error-list' });

    function save() {
      localStorage.setItem(key, JSON.stringify(rows.slice(0, 200)));
      paint();
    }
    function paint() {
      list.innerHTML = '';
      if (!rows.length) {
        list.appendChild(el('li', { textContent: '尚無紀錄。每回練習後寫 3–5 筆即可。' }));
        return;
      }
      rows.forEach((r, idx) => {
        list.appendChild(
          el('li', null, [
            el('strong', { textContent: r.type + ' · ' }),
            document.createTextNode(r.note + ' '),
            el('button', {
              type: 'button',
              className: 'toefl-btn toefl-btn-ghost',
              textContent: '刪',
              onclick: () => {
                rows.splice(idx, 1);
                save();
              },
            }),
          ])
        );
      });
    }
    paint();

    shell(app, '刷題與檢討工具', '錯題分類比刷題量更重要。', [
      card('常見誤區', [
        ul([
          '只對答案不寫原因 → 同一題型反覆錯。',
          '口說不回放 → 不知道哪裡超時或空白。',
          '寫作只數單字 → 忽略任務完成度。',
        ]),
      ]),
      card('本地錯題紀錄', [
        el('div', { className: 'toefl-toolbar' }, [typeSel]),
        note,
        el('button', {
          type: 'button',
          className: 'toefl-btn',
          textContent: '新增一筆',
          onclick: () => {
            const t = (note.value || '').trim();
            if (!t) return;
            rows.unshift({ type: typeSel.value, note: t, at: Date.now() });
            note.value = '';
            save();
          },
        }),
        list,
      ]),
    ]);
  }

  function mountResources(app) {
    shell(app, '推薦學習資源', '優先官方樣題與可信模考；購買前確認含聽力音檔。', [
      card('書籍與課程', [
        ul([
          '官方指南／樣題：建立真實題感。',
          '學術字彙書：當錯題補充，勿當唯一教材。',
        ]),
      ]),
      card('線上', [
        linkRow([
          { href: 'https://www.ets.org/toefl', label: 'ETS TOEFL', note: '官方' },
          { href: 'https://www.ets.org/toefl/test-takers/ibt/prepare.html', label: 'Prepare', note: '備考資源' },
        ]),
      ]),
    ]);
  }

  function mountRegistration(app) {
    shell(app, '報名與考場須知', '流程以 ETS 帳號與考場簡章為準。', [
      card('報名概要', [
        ul([
          '建立 ETS 帳號，選擇 TOEFL iBT 場次／居家考（若開放）。',
          '上傳符合規格的證件照與身分資料。',
          '繳費後保存確認信；考前核對時間與設備要求。',
        ]),
        linkRow([{ href: 'https://www.ets.org/toefl/test-takers.html', label: 'ETS 報名入口', note: '官方' }]),
      ]),
      card('考試當天', [
        ul([
          '攜帶有效護照／身分證件（依考場規定）。',
          '電子產品依監試交管；居家考檢查房間與攝影機。',
          '四科連續作答，注意螢幕剩餘時間。',
        ]),
      ]),
    ]);
  }

  function mountMindset(app) {
    shell(app, '心態與撞牆突破', '分數停滯通常是方法重複，不是不夠努力。', [
      card('停滯時', [
        ul([
          '統計錯題：若詞義／改寫佔多，停更文法書改練同義詞。',
          '聽力停滯：對稿＋跟讀兩週。',
          '口說停滯：固定模板＋計時錄音，請人只評「完整度」。',
        ]),
      ]),
      card('考試焦慮', [
        ul([
          '考前兩天維持熟悉題量與作息。',
          '單題不會是常態；目標是整卷達標，不是全對。',
        ]),
      ]),
    ]);
  }

  global.WA_MOUNT_TOEFL = {
    'toefl-intro': mountIntro,
    'toefl-mock-tests': mountMock,
    'toefl-score-levels': mountScore,
    'toefl-vocab': mountVocab,
    'toefl-listening': mountListening,
    'toefl-reading': mountReading,
    'toefl-grammar': mountGrammar,
    'toefl-speaking': mountSpeaking,
    'toefl-writing': mountWriting,
    'toefl-study-plan': mountPlan,
    'toefl-error-review': mountReview,
    'toefl-resources': mountResources,
    'toefl-registration': mountRegistration,
    'toefl-mindset': mountMindset,
  };
})(typeof window !== 'undefined' ? window : globalThis);
