/**
 * TOEIC theme mounts — concise guides + 60-example practice UIs.
 */
(function (global) {
  'use strict';

  var TOEIC_CSS_VER = '0.6.48';

  function toeicCssHref() {
    if (global.WA_TOOL_URLS && typeof global.WA_TOOL_URLS.absolutePageHref === 'function') {
      return global.WA_TOOL_URLS.absolutePageHref('assets/css/toeic-tools.css') + '?v=' + TOEIC_CSS_VER;
    }
    var path = String(location.pathname || '').replace(/\\/g, '/');
    if (/\/(en\/)?toeic(\/|$)/i.test(path)) {
      return (path.indexOf('/en/') >= 0 ? '../../' : '../') + 'assets/css/toeic-tools.css?v=' + TOEIC_CSS_VER;
    }
    return 'assets/css/toeic-tools.css?v=' + TOEIC_CSS_VER;
  }

  function ensureToeicCss() {
    var key = 'wa-toeic-css';
    var href;
    try {
      href = new URL(toeicCssHref(), location.href).href;
    } catch (e) {
      href = toeicCssHref();
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
        else if (k === 'innerHTML') node.innerHTML = v;
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
    ensureToeicCss();
    clear(app);
    app.classList.add('wa-toeic');
    app.appendChild(
      el('div', { className: 'toeic-wrap' }, [
        el('header', { className: 'toeic-hero' }, [
          el('p', { className: 'toeic-eyebrow', textContent: 'TOEIC · 多益' }),
          el('h2', { className: 'toeic-title', textContent: title }),
          lead ? el('p', { className: 'toeic-lead', textContent: lead }) : null,
        ]),
        el('div', { className: 'toeic-body' }, bodyKids),
      ])
    );
  }

  function card(title, kids, tip) {
    return el('section', { className: 'toeic-card' }, [
      title ? el('h3', { className: 'toeic-h3', textContent: title }) : null,
      tip ? el('p', { className: 'toeic-tip', textContent: tip }) : null,
      ...(kids || []),
    ]);
  }

  function ul(items) {
    return el(
      'ul',
      { className: 'toeic-ul' },
      items.map((t) => el('li', null, [typeof t === 'string' ? t : t]))
    );
  }

  function p(text) {
    return el('p', { className: 'toeic-p', textContent: text });
  }

  function linkRow(items) {
    return el(
      'ul',
      { className: 'toeic-links' },
      items.map((it) =>
        el('li', null, [
          el('a', {
            href: it.href,
            target: '_blank',
            rel: 'noopener noreferrer',
            textContent: it.label,
          }),
          it.note ? el('span', { className: 'toeic-muted', textContent: ' — ' + it.note }) : null,
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
    const prefix = cls || 'toeic';

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
    return { load, save, get, cycle, count, makeSel, makeBtn, metaText, FAM_LABEL };
  }

  function makeSkillLevelBar(onChange, initial) {
    let level = initial === 2 ? 2 : 1;
    const bar = el('div', { className: 'toeic-level-bar', role: 'tablist', 'aria-label': '練習等級' });
    const btnL1 = el('button', {
      type: 'button',
      className: 'toeic-level-btn' + (level === 1 ? ' is-on' : ''),
      role: 'tab',
      'aria-selected': level === 1 ? 'true' : 'false',
      textContent: 'Level 1｜基礎高頻（550–750）',
    });
    const btnL2 = el('button', {
      type: 'button',
      className: 'toeic-level-btn' + (level === 2 ? ' is-on' : ''),
      role: 'tab',
      'aria-selected': level === 2 ? 'true' : 'false',
      textContent: 'Level 2｜金色證書特攻（860+）',
    });
    function setLevel(next) {
      level = next;
      btnL1.classList.toggle('is-on', level === 1);
      btnL2.classList.toggle('is-on', level === 2);
      btnL1.setAttribute('aria-selected', level === 1 ? 'true' : 'false');
      btnL2.setAttribute('aria-selected', level === 2 ? 'true' : 'false');
      if (typeof onChange === 'function') onChange(level);
    }
    btnL1.addEventListener('click', () => setLevel(1));
    btnL2.addEventListener('click', () => setLevel(2));
    bar.appendChild(btnL1);
    bar.appendChild(btnL2);
    return { bar, getLevel: () => level, setLevel };
  }

  function itemSkillLevel(it) {
    const n = Number(it && it.level);
    return n === 2 ? 2 : 1;
  }

  function quizBlock(items, opts) {
    const list = el('div', { className: 'toeic-quiz-list' });
    const filterBar = el('div', { className: 'toeic-filter' });
    const toolbar = el('div', { className: 'toeic-toolbar' });
    const meta = el('p', { className: 'toeic-muted' });
    const levelHint = el('p', { className: 'toeic-muted' });
    const fam = opts.famKey ? createFamApi(opts.famKey, 'toeic') : null;
    const famSel = fam ? fam.makeSel() : null;
    let active = 'all';
    let famFilter = 'all';
    let famMap = fam ? fam.load() : {};
    let skillLevel = 1;

    function itemId(it) {
      return opts.idOf ? opts.idOf(it) : String(it.id);
    }

    function pool() {
      return (items || []).filter((it) => itemSkillLevel(it) === skillLevel);
    }

    function topicKeyOf(it) {
      return it[opts.topicKey] != null ? it[opts.topicKey] : it.skill || it.part;
    }

    function rebuildTopics() {
      filterBar.innerHTML = '';
      active = 'all';
      filterBar.appendChild(
        el('button', {
          type: 'button',
          className: 'toeic-chip-btn is-on',
          textContent: '題型：全部',
          onclick: (e) => setTopic('all', e.currentTarget),
        })
      );
      Array.from(new Set(pool().map(topicKeyOf))).forEach((t) => {
        filterBar.appendChild(
          el('button', {
            type: 'button',
            className: 'toeic-chip-btn',
            textContent: String(t),
            onclick: (e) => setTopic(String(t), e.currentTarget),
          })
        );
      });
    }

    function paint() {
      if (fam) famMap = fam.load();
      list.innerHTML = '';
      let n = 0;
      const cur = pool();
      levelHint.textContent =
        (skillLevel === 2 ? 'Level 2｜金色證書（860+）' : 'Level 1｜基礎高頻（550–750）') +
        '｜本級 ' +
        cur.length +
        ' 題';
      cur
        .filter((it) => {
          if (active !== 'all' && String(topicKeyOf(it)) !== String(active)) return false;
          if (fam && famFilter !== 'all') {
            if (fam.get(famMap, itemId(it)) !== famFilter) return false;
          }
          return true;
        })
        .forEach((it) => {
          n += 1;
          const id = itemId(it);
          const famLv = fam ? fam.get(famMap, id) : '';
          const ans = el('div', { className: 'toeic-ans', hidden: true }, [
            el('strong', { textContent: '答案 ' + it.ans + '　' }),
            document.createTextNode(it.why || ''),
          ]);
          const choices = el(
            'ul',
            { className: 'toeic-choices' },
            (it.choices || []).map((c, i) => {
              const raw = String(c || '').replace(/^[A-D][.)]\s*/i, '').trim();
              return el('li', { textContent: String.fromCharCode(65 + i) + '. ' + raw });
            })
          );
          const metaRow = [
            el('span', {
              className: 'toeic-chip',
              textContent: opts.meta ? opts.meta(it) : it.topic || 'Part ' + it.part,
            }),
            el('span', { className: 'toeic-chip', textContent: 'L' + itemSkillLevel(it) }),
            el('span', { className: 'toeic-muted', textContent: '#' + it.id }),
          ];
          if (fam) {
            metaRow.push(
              fam.makeBtn(famLv, () => {
                fam.cycle(famMap, id);
                paint();
              })
            );
          }
          list.appendChild(
            el('article', { className: 'toeic-q' + (famLv ? ' fam-' + famLv : '') }, [
              el('div', { className: 'toeic-q-meta' }, metaRow),
              it.point ? el('p', { className: 'toeic-point', textContent: it.point }) : null,
              el('p', { className: 'toeic-stem', textContent: it.q }),
              choices,
              el('button', {
                type: 'button',
                className: 'toeic-btn',
                textContent: '顯示答案',
                onclick: () => {
                  ans.hidden = !ans.hidden;
                },
              }),
              ans,
            ])
          );
        });
      if (fam) meta.textContent = fam.metaText(n, famMap);
      else meta.textContent = '顯示 ' + n + ' 筆';
    }

    function setTopic(k, btn) {
      active = k;
      filterBar.querySelectorAll('.toeic-chip-btn').forEach((b) => b.classList.remove('is-on'));
      btn.classList.add('is-on');
      paint();
    }

    const levelUi = makeSkillLevelBar((lv) => {
      skillLevel = lv;
      rebuildTopics();
      paint();
    }, 1);

    if (famSel) {
      famSel.addEventListener('change', () => {
        famFilter = famSel.value;
        paint();
      });
      toolbar.appendChild(famSel);
    }
    rebuildTopics();
    paint();
    return fam
      ? [levelUi.bar, levelHint, toolbar, filterBar, meta, list]
      : [levelUi.bar, levelHint, filterBar, list];
  }

  function trapListWithFam(traps, famKey) {
    const fam = createFamApi(famKey, 'toeic');
    const famSel = fam.makeSel();
    const partSel = el('select', { className: 'toeic-select', 'aria-label': '題型' });
    const list = el('div', { className: 'toeic-trap-list' });
    const meta = el('p', { className: 'toeic-muted' });
    const levelHint = el('p', { className: 'toeic-muted' });
    let famMap = fam.load();
    let skillLevel = 1;

    function pool() {
      return (traps || []).filter((t) => itemSkillLevel(t) === skillLevel);
    }

    function rebuildParts() {
      const cur = partSel.value || 'all';
      partSel.innerHTML = '';
      partSel.appendChild(el('option', { value: 'all', textContent: '題型：全部' }));
      Array.from(new Set(pool().map((t) => t.part))).forEach((p) => {
        partSel.appendChild(el('option', { value: p, textContent: p }));
      });
      const ok = Array.from(partSel.options).some((o) => o.value === cur);
      partSel.value = ok ? cur : 'all';
    }

    function paint() {
      famMap = fam.load();
      const part = partSel.value;
      const famFilter = famSel.value;
      const cur = pool();
      levelHint.textContent =
        (skillLevel === 2 ? 'Level 2｜金色證書（860+）' : 'Level 1｜基礎高頻（550–750）') +
        '｜本級 ' +
        cur.length +
        ' 則';
      list.innerHTML = '';
      let n = 0;
      cur.forEach((t) => {
        const id = 'trap-' + (t.id != null ? t.id : n + 1);
        const famLv = fam.get(famMap, id);
        if (part !== 'all' && t.part !== part) return;
        if (famFilter !== 'all' && famLv !== famFilter) return;
        n += 1;
        list.appendChild(
          el('article', { className: 'toeic-q' + (famLv ? ' fam-' + famLv : '') }, [
            el('div', { className: 'toeic-q-meta' }, [
              el('span', { className: 'toeic-chip', textContent: t.part }),
              el('span', { className: 'toeic-chip', textContent: 'L' + itemSkillLevel(t) }),
              el('span', { className: 'toeic-muted', textContent: '#' + (t.id != null ? t.id : n) }),
              fam.makeBtn(famLv, () => {
                fam.cycle(famMap, id);
                paint();
              }),
            ]),
            el('p', { className: 'toeic-point', textContent: t.trap }),
            el('p', { className: 'toeic-stem', textContent: t.ex }),
            el('p', { className: 'toeic-p', textContent: '易錯：' + t.wrong }),
            el('div', { className: 'toeic-correct-row' }, [
              el('p', { className: 'toeic-ex', textContent: '宜選／宜聽：' + t.right }),
              el('button', {
                type: 'button',
                className: 'toeic-speak-btn toeic-speak-btn-sm',
                title: '朗讀正確句子',
                'aria-label': '朗讀正確句子',
                textContent: '朗讀正確句',
                onclick: () => speakEn(t.right),
              }),
            ]),
            el('p', { className: 'toeic-tip', textContent: t.tip }),
          ])
        );
      });
      meta.textContent = fam.metaText(n, famMap);
    }

    const levelUi = makeSkillLevelBar((lv) => {
      skillLevel = lv;
      rebuildParts();
      paint();
    }, 1);

    partSel.addEventListener('change', paint);
    famSel.addEventListener('change', paint);
    rebuildParts();
    paint();
    return [levelUi.bar, levelHint, el('div', { className: 'toeic-toolbar' }, [partSel, famSel]), meta, list];
  }

  /* ——— pages ——— */

  function mountIntro(app) {
    shell(app, '多益測驗介紹', '先建立全貌：時間、題型、計分。細節再往各主題頁深入。', [
      card('考試時間', [
        p('Listening & Reading 合計約 2.5 小時（含說明）。聽力約 45 分鐘、閱讀約 75 分鐘，兩科連續作答、中間不休息。'),
      ]),
      card('聽力四大題（約 100 題）', [
        ul([
          'Part 1 照片描述：看圖選最符合的敘述；善用播音前預讀時間。',
          'Part 2 應答問題：聽問句選最適回應；注意疑問詞與否定陷阱。',
          'Part 3 簡短對話：多題一組；先讀題幹再聽。',
          'Part 4 簡短獨白：廣播／留言／導覽；抓目的、時間、地點、下一步。',
        ]),
      ]),
      card('閱讀三大題（約 100 題）', [
        ul([
          'Part 5 句子填空：詞性、介系詞、連接詞、時態為主。',
          'Part 6 段落填空：文意連貫＋文法；看前後句。',
          'Part 7 單篇／多篇閱讀：信件、公告、廣告、雙篇對照；先題後文或掃讀定位。',
        ]),
      ]),
      card('計分方式（精簡）', [
        p('聽力、閱讀各約 5–495，總分 10–990。原始答對題數經等化轉為量表分數；目標多用 600／750／860 當門檻參考。'),
        p('官方不公布「錯幾題扣多少」公式，刷題請搭配正式模擬看落點。'),
      ]),
      card('下一步：多益單字', [
        p('字彙是聽力同義替換與 Part 5／7 的基礎。可先用本站多益單字記憶工具，依 Level 與商業情境分頁背誦。'),
        linkRow([{ href: 'toeic-vocab.html', label: '多益單字記憶（約7000字）', note: 'Level1／Level2・金色證書情境' }]),
      ]),
    ]);
  }

  function mountMock(app) {
    shell(app, '免費模擬測驗', '用正式題感測時間與弱點；以下為常見公開資源入口（請以官網最新為準）。', [
      card('建議用法', [
        ul([
          '整套限時：聽力一次聽完、閱讀 75 分鐘內完成。',
          '隔天只檢討錯題：標「文法／字彙／聽不懂／看漏」。',
          '同一套勿連續刷到背答案；換套題才有參考價值。',
        ]),
      ]),
      card('資源連結', [
        linkRow([
          { href: 'https://www.ets.org/toeic', label: 'ETS TOEIC 官方', note: '介紹與樣題入口' },
          { href: 'https://www.toeic.com.tw/', label: '台灣區官方（ETS 授權）', note: '報名、簡章、最新消息' },
          { href: 'https://www.ets.org/toeic/test-takers/about/listening-reading.html', label: 'L&R 測驗說明', note: '題型官方說明' },
        ]),
        p('另可搭配書店「官方題庫／模擬試題」紙本做整回計時；線上免費題品質落差大，優先選有聽力音檔、計分解說的來源。'),
      ]),
    ]);
  }

  function mountScore(app) {
    shell(app, '程度落點分析', '用常見門檻對照能力與下一步，不必糾結個位數分數。', [
      card('分數區間速覽', [
        ul([
          '約 600：基礎職場溝通；單字與 Part 5 正確率需穩定，聽力抓關鍵字。',
          '約 750：多數企業門檻附近；Part 3／4 細節與 Part 7 速度是分水嶺。',
          '約 860+：進階門檻；同義詞替換、推論題、雙篇對照要穩，粗心要壓到最低。',
          '900+：容錯極低；維持錯題本與定期整回模考即可。',
        ]),
      ]),
      card('如何訂目標', [
        p('先看求職／學校門檻，再加 30–50 分當緩衝。若模考總分差目標超過 100，先補最弱一大塊（聽或讀），不要平均撒時間。'),
      ]),
    ]);
  }

  function loadScriptOnce(src) {
    return new Promise((resolve, reject) => {
      const existing = document.querySelector('script[data-wa-src="' + src + '"]');
      if (existing) {
        if (existing.dataset.ready === '1') resolve();
        else existing.addEventListener('load', () => resolve(), { once: true });
        return;
      }
      const s = document.createElement('script');
      s.src = src;
      s.defer = true;
      s.dataset.waSrc = src;
      s.onload = () => {
        s.dataset.ready = '1';
        resolve();
      };
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  function toeicVocabL2Href() {
    if (global.WA_TOOL_URLS && typeof global.WA_TOOL_URLS.absolutePageHref === 'function') {
      return global.WA_TOOL_URLS.absolutePageHref('assets/js/toeic-vocab-l2-data.js') + '?v=0.6.42';
    }
    var path = String(location.pathname || '').replace(/\\/g, '/');
    if (/\/(en\/)?toeic(\/|$)/i.test(path)) {
      return (path.indexOf('/en/') >= 0 ? '../../' : '../') + 'assets/js/toeic-vocab-l2-data.js?v=0.6.42';
    }
    return 'assets/js/toeic-vocab-l2-data.js?v=0.6.42';
  }

  function mountVocab(app) {
    const l1 = global.WA_TOEIC_VOCAB;
    if (!l1 || !l1.scenarios) {
      shell(app, '單字記憶工具', '資料載入中或失敗，請重新整理。', [p('缺少 WA_TOEIC_VOCAB。')]);
      return;
    }

    const PAGE_SIZE = 24;
    const FAM_KEY = 'wa-toeic-vocab-fam';
    const SEEN_KEY = 'wa-toeic-vocab-seen';
    const FAM_ORDER = ['', 'fuzzy', 'mid', 'known'];
    const FAM_LABEL = { '': '＋', fuzzy: '模糊', mid: '中等', known: '很熟' };
    const FAM_FILTER_LABEL = { all: '全部', known: '很熟', mid: '中等', fuzzy: '模糊' };

    function loadFam() {
      try {
        const raw = JSON.parse(localStorage.getItem(FAM_KEY) || '{}');
        return raw && typeof raw === 'object' ? raw : {};
      } catch (e) {
        return {};
      }
    }
    function saveFam(map) {
      try {
        localStorage.setItem(FAM_KEY, JSON.stringify(map));
      } catch (e) {
        /* ignore */
      }
    }
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
    function getFam(map, scenarioId, word) {
      return map[wordKey(scenarioId, word)] || '';
    }
    function cycleFam(map, scenarioId, word) {
      const k = wordKey(scenarioId, word);
      const cur = map[k] || '';
      const next = FAM_ORDER[(FAM_ORDER.indexOf(cur) + 1) % FAM_ORDER.length];
      if (!next) delete map[k];
      else map[k] = next;
      saveFam(map);
      return next;
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
      famMap = loadFam();
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

    const DEFAULT_SCENARIO = { 1: 'office', 2: 'ma' };

    let level = 1;
    let activeScenarioId = DEFAULT_SCENARIO[1];
    let page = 1;
    let famMap = loadFam();
    let l2Ready = Boolean(global.WA_TOEIC_VOCAB_L2 && global.WA_TOEIC_VOCAB_L2.scenarios);
    let l2Loading = false;

    const levelBar = el('div', { className: 'toeic-level-bar', role: 'tablist', 'aria-label': '單字等級' });
    const btnL1 = el('button', {
      type: 'button',
      className: 'toeic-level-btn is-on',
      role: 'tab',
      'aria-selected': 'true',
      textContent: 'Level 1｜基礎高頻（550–750）',
    });
    const btnL2 = el('button', {
      type: 'button',
      className: 'toeic-level-btn',
      role: 'tab',
      'aria-selected': 'false',
      textContent: 'Level 2｜金色證書特攻（860+）',
    });
    levelBar.appendChild(btnL1);
    levelBar.appendChild(btnL2);

    const levelHint = el('p', {
      className: 'toeic-muted',
      textContent: l1.label || 'Level 1｜基礎高頻字（550–750）',
    });
    const scenarioBar = el('div', { className: 'toeic-scenario-bar', 'aria-label': '商業情境' });
    const famSel = el('select', { className: 'toeic-select', 'aria-label': '熟悉度' }, [
      el('option', { value: 'all', textContent: '熟悉度：全部' }),
      el('option', { value: 'known', textContent: '熟悉度：很熟' }),
      el('option', { value: 'mid', textContent: '熟悉度：中等' }),
      el('option', { value: 'fuzzy', textContent: '熟悉度：模糊' }),
    ]);
    const search = el('input', {
      type: 'search',
      className: 'toeic-input',
      placeholder: '搜尋目前情境內的英文／中文／同義詞…',
      'aria-label': '搜尋單字',
    });
    const grid = el('div', { className: 'toeic-vocab-grid' });
    const meta = el('p', { className: 'toeic-muted toeic-vocab-anchor', id: 'toeic-vocab-top' });
    const pager = el('div', { className: 'toeic-pager' });
    const empty = el('p', {
      className: 'toeic-tip',
      textContent: '請先點選上方一個商業情境，才會載入該分類單字（分頁顯示，較不卡頓）。',
    });
    const bankCard = card('字庫', [
      el('div', { className: 'toeic-toolbar' }, [famSel, search]),
      meta,
      empty,
      grid,
      pager,
    ]);
    bankCard.id = 'toeic-vocab-bank';
    bankCard.classList.add('toeic-vocab-bank');

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
      if (level === 2) return global.WA_TOEIC_VOCAB_L2 || null;
      return l1;
    }

    function scenariosOf() {
      const pack = currentPack();
      return (pack && pack.scenarios) || [];
    }

    function activeScenario() {
      return scenariosOf().find((s) => s.id === activeScenarioId) || null;
    }

    function rebuildScenarioBar() {
      scenarioBar.innerHTML = '';
      const list = scenariosOf();
      list.forEach((s) => {
        const prog = scenarioProgress(s);
        const btn = el('button', {
          type: 'button',
          className: 'toeic-scenario-chip' + (s.id === activeScenarioId ? ' is-on' : ''),
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
        btn.appendChild(el('span', { className: 'toeic-scenario-chip-name', textContent: s.name }));
        btn.appendChild(
          el('span', {
            className: 'toeic-scenario-chip-meta',
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
      famMap = loadFam();
      return scenario.words.filter((w) => {
        const fam = getFam(famMap, scenario.id, w.w);
        if (famFilter !== 'all' && fam !== famFilter) return false;
        if (!q) return true;
        const blob = [w.w, w.zh, w.syn, w.ex, w.exZh].join(' ').toLowerCase();
        return blob.indexOf(q) >= 0;
      });
    }

    function paintPager(total) {
      pager.innerHTML = '';
      const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
      if (page > pages) page = pages;
      const prev = el('button', {
        type: 'button',
        className: 'toeic-btn toeic-btn-ghost',
        textContent: '上一頁',
        onclick: () => {
          if (page > 1) goToPage(page - 1, pages, true);
        },
      });
      const next = el('button', {
        type: 'button',
        className: 'toeic-btn toeic-btn-ghost',
        textContent: '下一頁',
        onclick: () => {
          if (page < pages) goToPage(page + 1, pages, true);
        },
      });
      const jumpInput = el('input', {
        type: 'number',
        className: 'toeic-page-input',
        min: '1',
        max: String(pages),
        value: String(page),
        'aria-label': '跳至頁碼',
        title: '輸入頁碼後按 Enter 或點跳轉',
      });
      const jumpBtn = el('button', {
        type: 'button',
        className: 'toeic-btn toeic-btn-ghost',
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
      pager.appendChild(el('span', { className: 'toeic-muted', textContent: '第' }));
      pager.appendChild(jumpInput);
      pager.appendChild(
        el('span', {
          className: 'toeic-muted',
          textContent: '／' + pages + ' 頁（每頁 ' + PAGE_SIZE + ' 字）',
        })
      );
      pager.appendChild(jumpBtn);
      pager.appendChild(next);
    }

    function paint() {
      famMap = loadFam();
      grid.innerHTML = '';
      empty.hidden = true;
      pager.hidden = false;

      if (level === 2 && l2Loading) {
        meta.textContent = '正在載入 Level 2 金色證書字庫…';
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
          ' 個情境 — 請點選分類後再顯示單字';
        empty.hidden = false;
        empty.textContent = '請先點選上方一個商業情境，才會載入該分類單字（分頁顯示，較不卡頓）。';
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
      let marked = { known: 0, mid: 0, fuzzy: 0 };
      Object.keys(famMap).forEach((k) => {
        if (marked[famMap[k]] != null) marked[famMap[k]] += 1;
      });

      slice.forEach((w) => {
        const famLevel = getFam(famMap, scenario.id, w.w);
        const famBtn = el('button', {
          type: 'button',
          className: 'toeic-fam-btn' + (famLevel ? ' is-' + famLevel : ''),
          textContent: FAM_LABEL[famLevel] || '＋',
          title: '點擊切換熟悉度（＋→模糊→中等→很熟）',
          'aria-label': '熟悉度 ' + (FAM_FILTER_LABEL[famLevel] || '未標記'),
          onclick: () => {
            cycleFam(famMap, scenario.id, w.w);
            paint();
          },
        });
        const speakBtn = el('button', {
          type: 'button',
          className: 'toeic-speak-btn',
          title: '朗讀單字',
          'aria-label': '朗讀 ' + w.w,
          textContent: '🔊',
          onclick: () => speakEn(w.w),
        });
        const speakExBtn = el('button', {
          type: 'button',
          className: 'toeic-speak-btn toeic-speak-btn-sm',
          title: '朗讀例句',
          textContent: '朗讀例句',
          onclick: () => speakEn(w.ex),
        });
        grid.appendChild(
          el('article', { className: 'toeic-vocab-card' + (famLevel ? ' fam-' + famLevel : '') }, [
            el('div', { className: 'toeic-vocab-head' }, [
              el('div', { className: 'toeic-vocab-word' }, [
                el('strong', { textContent: w.w }),
                el('div', { className: 'toeic-vocab-meta' }, [
                  speakBtn,
                  el('span', { className: 'toeic-chip', textContent: w.pos || '' }),
                  el('span', {
                    className: 'toeic-chip toeic-chip-level',
                    textContent: 'L' + (w.level || level),
                  }),
                ]),
              ]),
              famBtn,
            ]),
            el('p', { className: 'toeic-p', textContent: w.zh }),
            el('p', { className: 'toeic-syn', textContent: '同義／替換：' + (w.syn || '—') }),
            el('p', { className: 'toeic-ex', textContent: w.ex }),
            el('div', { className: 'toeic-vocab-actions' }, [speakExBtn]),
            el('p', { className: 'toeic-exzh', textContent: w.exZh }),
            el('p', { className: 'toeic-muted', textContent: scenario.name + ' · ' + (scenario.tag || '') }),
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
        '）｜本情境標記 ' +
        prog.marked +
        '｜全庫 模糊 ' +
        marked.fuzzy +
        '／中等 ' +
        marked.mid +
        '／很熟 ' +
        marked.known;
      paintPager(total);
      if (!total) {
        empty.hidden = false;
        empty.textContent = '此情境目前沒有符合篩選的單字。';
      }
    }

    function pickDefaultScenario() {
      const preferred = DEFAULT_SCENARIO[level];
      const list = scenariosOf();
      if (preferred && list.some((s) => s.id === preferred)) return preferred;
      return (list[0] && list[0].id) || '';
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
        levelHint.textContent = '載入 Level 2 金色證書字庫…';
        rebuildScenarioBar();
        paint();
        try {
          await loadScriptOnce(toeicVocabL2Href());
          l2Ready = Boolean(global.WA_TOEIC_VOCAB_L2 && global.WA_TOEIC_VOCAB_L2.scenarios);
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

    shell(app, '單字記憶工具', 'Level 1 基礎高頻打底；Level 2 金色證書專業情境（含銀行／旅宿）。點情境分頁顯示，約 7000 字。', [
      card('等級與情境', [levelBar, levelHint, scenarioBar]),
      card('怎麼用', [
        ul([
          '先選 Level，再點一個商業情境（不會一次渲染全部單字）。',
          '情境顯示「已瀏覽 %」與「標記 n」：翻頁會累計瀏覽覆蓋率；＋ 標記熟悉度才算收藏複習。',
          '每頁 ' + PAGE_SIZE + ' 字；可用熟悉度與搜尋縮小範圍；翻頁會回到字庫頂部，也可輸入頁碼跳轉。',
          '🔊 朗讀；＋ 標記模糊／中等／很熟（本機保存）。',
        ]),
      ]),
      bankCard,
    ]);
  }

  function mountListening(app) {
    const data = global.WA_TOEIC_LISTENING;
    const traps = (data && data.items) || [];
    shell(app, '聽力答題技巧', '四大題解法＋四國口音＋圖片預讀。Level 1／2 分級陷阱速記，可朗讀正確句、標記熟悉度。', [
      card('四國口音', [
        p('美、加、英、澳都會出現。重點不是「聽出哪國」，而是適應母音、r 音與語速差異；平時混聽四國播客／官方音檔。'),
        ul([
          '美／加：r 音明顯，語速中等，教材最常見。',
          '英：部分母音不同（如 schedule、bath）；子音較乾脆。',
          '澳：部分母音偏前、語調上揚；專有名詞仍按拼讀。',
        ]),
      ]),
      card('圖片預讀（Part 1）', [
        p('Directions 期間掃圖：人物動作、位置、物件狀態。先默念可能動詞（holding／typing／walking），聽到同義描述再選，勿死等原字。'),
      ]),
      card('Parts 2–4 重點', [
        ul([
          'Part 2：疑問詞優先；相似音、重複原字、否定反義是三大陷阱。',
          'Part 3／4：先讀題目與選項關鍵字；聽「目的、時間、要求、下一步」。',
          '數字、專有名詞、轉折（however／actually）常出題。',
        ]),
      ]),
      card(
        '常考陷阱速記（分級）',
        traps.length ? trapListWithFam(traps, 'wa-toeic-listening-fam') : [p('資料未載入')]
      ),
    ]);
  }

  function mountReading(app) {
    const data = global.WA_TOEIC_READING;
    const items = (data && data.items) || [];
    shell(app, '閱讀解題策略', data && data.focus ? data.focus : 'Parts 5–7 時間與順序。Level 1／2 分級練題。', [
      card('時間分配（75 分鐘）', [
        ul([
          'Part 5：約 10–12 分鐘（一題勿超過 30 秒）。',
          'Part 6：約 8–10 分鐘。',
          'Part 7：其餘時間；單篇先快掃，雙篇留足 15–20 分鐘。',
          '不會的先猜標記，最後回頭；空白比糾結划算。',
        ]),
      ]),
      card('作答順序建議', [
        p('習慣「5 → 6 → 7 單篇易→難 → 雙／多篇」。Part 7 先讀題幹問什麼（細節／推論／同義），再回文定位。'),
      ]),
      card(
        '練題（Level 分級）',
        items.length
          ? quizBlock(items, {
              topicKey: 'part',
              meta: (it) => 'Part ' + it.part + ' · ' + it.skill,
              famKey: 'wa-toeic-reading-fam',
            })
          : [p('資料未載入')]
      ),
    ]);
  }

  function mountGrammar(app) {
    const data = global.WA_TOEIC_GRAMMAR;
    const items = (data && data.items) || [];
    shell(app, '文法速成指南', data && data.focus ? data.focus : 'Part 5／6 常考點。Level 1／2 分級例題。', [
      card('優先順序', [
        ul([
          '詞性轉換（名／動／形／副）— 出題量最大。',
          '介系詞與連接詞（含 on／in／at、although／despite）。',
          '分詞形容詞（interested／interesting）與代名詞指涉。',
          '假設語氣、關係代名詞、分詞構句 — 見題再穩。',
        ]),
      ]),
      card(
        '例題（Level 分級）',
        items.length
          ? quizBlock(items, { topicKey: 'topic', famKey: 'wa-toeic-grammar-fam' })
          : [p('資料未載入')]
      ),
    ]);
  }

  function mountPlan(app) {
    shell(app, '備試時間規劃表', '依準備期選一條主線；每天固定聽＋讀，比週末一次爆肝有效。', [
      card('1 個月衝刺（已有約目標±100）', [
        ul([
          '每日：單字 30 分（1 情境）＋聽力 1 Part＋閱讀 Part 5 一回。',
          '週三／日：半套或整回模考；隔日只檢討錯題。',
          '最後一週：停學新文法，只維持手感與睡眠。',
        ]),
      ]),
      card('3 個月扎實', [
        ul([
          '第 1 月：單字 15 情境輪完＋文法速成分級例題打底。',
          '第 2 月：聽力 Parts 1–4 技巧＋閱讀時間配速。',
          '第 3 月：每週至少 1 整回模考＋錯題本複習。',
          '平日 60–90 分；假日加長聽力或 Part 7。',
        ]),
      ]),
      card('每日最小單位（忙人版）', [
        p('20 字同義詞＋Part 2 十題＋Part 5 十題。連續 21 天比偶爾唸三小時更接近加分。'),
      ]),
    ]);
  }

  function mountReview(app) {
    const key = 'wa-toeic-error-log';
    let rows = [];
    try {
      rows = JSON.parse(localStorage.getItem(key) || '[]');
      if (!Array.isArray(rows)) rows = [];
    } catch (e) {
      rows = [];
    }

    const typeSel = el('select', { className: 'toeic-select' }, [
      el('option', { value: 'vocab', textContent: '字彙／同義詞' }),
      el('option', { value: 'grammar', textContent: '文法' }),
      el('option', { value: 'listen', textContent: '聽力聽不懂' }),
      el('option', { value: 'read', textContent: '閱讀看漏／速度' }),
      el('option', { value: 'careless', textContent: '粗心／劃錯' }),
    ]);
    const note = el('textarea', {
      className: 'toeic-textarea',
      rows: 3,
      placeholder: '題號或錯因（例：postpone 聽成 cancel）',
    });
    const list = el('ul', { className: 'toeic-ul toeic-error-list' });

    function save() {
      localStorage.setItem(key, JSON.stringify(rows.slice(0, 200)));
      paint();
    }
    function paint() {
      list.innerHTML = '';
      if (!rows.length) {
        list.appendChild(el('li', { textContent: '尚無紀錄。每回模考後花 15 分鐘寫 3–5 筆即可。' }));
        return;
      }
      rows.forEach((r, idx) => {
        list.appendChild(
          el('li', null, [
            el('strong', { textContent: r.type + ' · ' }),
            document.createTextNode(r.note + ' '),
            el('button', {
              type: 'button',
              className: 'toeic-btn toeic-btn-ghost',
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

    shell(app, '刷題與檢討工具', '刷題量不如錯題品質。把錯誤分成可複習的類型。', [
      card('常見誤區', [
        ul([
          '只對答案不寫原因 → 同一陷阱反覆錯。',
          '聽力只重聽一遍就過 → 要對稿找出是語音、字彙還是題目沒讀。',
          'Part 7 超時就放棄檢討 → 標記「定位失敗」或「推論過度」。',
        ]),
      ]),
      card('本地錯題紀錄（僅此瀏覽器）', [
        el('div', { className: 'toeic-toolbar' }, [typeSel]),
        note,
        el('button', {
          type: 'button',
          className: 'toeic-btn',
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
    shell(app, '推薦學習資源', '精選入口；購買前請自行確認版本是否含聽力音檔與最新題型。', [
      card('書籍', [
        ul([
          '官方／模擬題庫：練整回與時間感（優先）。',
          '千題文法／字彙：當錯題補充，勿當唯一教材。',
        ]),
      ]),
      card('線上與 APP', [
        linkRow([
          { href: 'https://www.toeic.com.tw/', label: '台灣區 TOEIC 官方', note: '簡章與消息' },
          { href: 'https://www.ets.org/toeic', label: 'ETS TOEIC', note: '國際官方' },
        ]),
        p('APP 選有「離線聽力＋錯題本」者較實用；避免只有單字閃卡卻無例句／同義詞。'),
      ]),
      card('YouTube／Podcast', [
        p('搜尋關鍵字：TOEIC Listening practice、British accent news（混口音）。固定頻道比廣看不練有效。'),
      ]),
    ]);
  }

  function mountRegistration(app) {
    shell(app, '報名與考場須知', '流程以台灣區官方最新簡章為準；以下為常見步驟與當日實戰提醒。', [
      card('線上報名（概要）', [
        ul([
          '至台灣區官方網站註冊帳號並登入。',
          '選擇場次／考場，填寫身分資料（需與證件一致）。',
          '上傳證件照：通常需最近三個月內、白／淺底、正面免冠；檔案大小與像素依簡章。',
          '繳費後保存准考證／報名成功通知；考前再確認場地與時間。',
        ]),
        linkRow([{ href: 'https://www.toeic.com.tw/', label: '多益台灣區官方報名入口', note: '帳號、簡章、相片規格' }]),
      ]),
      card('考試當天', [
        ul([
          '攜帶：身分證件正本、准考證（若要求）、黑色原子筆／2B（依簡章）。',
          '提早到場；電子產品依監試規定關機交管。',
          '劃卡：塗滿、對題號；聽力結束後勿再回頭改聽力卡（依現場規定）。',
          '配速：閱讀預留 Part 7；不會先猜，避免空白。',
        ]),
      ]),
    ]);
  }

  function mountSW(app) {
    shell(app, '說寫測驗簡介', '台灣多數考 Listening & Reading；外商求職／升遷才較常需要 Speaking & Writing。', [
      card('何時需要 S&W', [
        p('JD 或內部升遷明訂 TOEIC S&W、或面試會測口說時再準備。多數企業只要 L&R 總分。'),
      ]),
      card('Speaking（概要）', [
        ul([
          '朗讀、看圖描述、回應問題、提解方等任務；評流暢度、發音、詞彙與內容完整度。',
          '練習：計時說完、錄音重聽；模板句＋真實細節。',
        ]),
      ]),
      card('Writing（概要）', [
        ul([
          '看圖寫句、回信、意見陳述等；評文法、組織與任務完成度。',
          '練習：商務信函起承轉合；避免只寫超短句。',
        ]),
      ]),
      card('報名', [
        p('S&W 與 L&R 分開報名／計分。詳見官方簡章時程與費用。'),
        linkRow([{ href: 'https://www.toeic.com.tw/', label: '台灣區官方', note: 'S&W 說明與場次' }]),
      ]),
    ]);
  }

  function mountMindset(app) {
    shell(app, '心態與撞牆突破', '分數停在同一區通常是「方法重複」不是「不夠努力」。', [
      card('成績停滯時', [
        ul([
          '檢查模考是否限時、是否已背題；換新套題才算數。',
          '統計錯題類型：若 70% 是同義詞，就停更文法書，改練替換。',
          '聽力停滯：對稿＋跟讀兩週，比再刷十回無效練習有用。',
          '閱讀停滯：練 Part 7「先題後文」與掃讀數字／人名。',
        ]),
      ]),
      card('考試焦慮', [
        ul([
          '考前兩天只做熟悉題量，維持作息；勿熬夜背新字。',
          '進場默念流程：聽力預讀→標記→閱讀配速。',
          '單題不會是常態；目標是整卷容錯內，不是全對。',
        ]),
      ]),
    ]);
  }

  const mounts = {
    'toeic-intro': mountIntro,
    'toeic-mock-tests': mountMock,
    'toeic-score-levels': mountScore,
    'toeic-vocab': mountVocab,
    'toeic-listening': mountListening,
    'toeic-reading': mountReading,
    'toeic-grammar': mountGrammar,
    'toeic-study-plan': mountPlan,
    'toeic-error-review': mountReview,
    'toeic-resources': mountResources,
    'toeic-registration': mountRegistration,
    'toeic-speaking-writing': mountSW,
    'toeic-mindset': mountMindset,
  };

  global.WA_MOUNT_TOEIC = mounts;
})(typeof window !== 'undefined' ? window : globalThis);
