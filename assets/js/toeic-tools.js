/**
 * TOEIC theme mounts — concise guides + 60-example practice UIs.
 */
(function (global) {
  'use strict';

  var TOEIC_CSS_VER = '0.6.39';

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

  function quizBlock(items, opts) {
    const list = el('div', { className: 'toeic-quiz-list' });
    const filterBar = el('div', { className: 'toeic-filter' });
    const topics = Array.from(new Set(items.map((x) => x[opts.topicKey || 'topic'] || x.skill || x.part)));
    let active = 'all';

    function paint() {
      list.innerHTML = '';
      items
        .filter((it) => {
          if (active === 'all') return true;
          const key = it[opts.topicKey] != null ? it[opts.topicKey] : it.skill || it.part;
          return String(key) === String(active);
        })
        .forEach((it) => {
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
          list.appendChild(
            el('article', { className: 'toeic-q' }, [
              el('div', { className: 'toeic-q-meta' }, [
                el('span', {
                  className: 'toeic-chip',
                  textContent: opts.meta ? opts.meta(it) : it.topic || 'Part ' + it.part,
                }),
                el('span', { className: 'toeic-muted', textContent: '#' + it.id }),
              ]),
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
    }

    filterBar.appendChild(
      el('button', {
        type: 'button',
        className: 'toeic-chip-btn is-on',
        textContent: '全部',
        dataset: { k: 'all' },
        onclick: (e) => setFilter('all', e.currentTarget),
      })
    );
    topics.forEach((t) => {
      filterBar.appendChild(
        el('button', {
          type: 'button',
          className: 'toeic-chip-btn',
          textContent: String(t),
          dataset: { k: String(t) },
          onclick: (e) => setFilter(String(t), e.currentTarget),
        })
      );
    });

    function setFilter(k, btn) {
      active = k;
      filterBar.querySelectorAll('.toeic-chip-btn').forEach((b) => b.classList.remove('is-on'));
      btn.classList.add('is-on');
      paint();
    }

    paint();
    return [filterBar, list];
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

  function mountVocab(app) {
    const data = global.WA_TOEIC_VOCAB;
    if (!data || !data.scenarios) {
      shell(app, '單字記憶工具', '資料載入中或失敗，請重新整理。', [p('缺少 WA_TOEIC_VOCAB。')]);
      return;
    }
    const search = el('input', {
      type: 'search',
      className: 'toeic-input',
      placeholder: '搜尋英文／中文／同義詞…',
      'aria-label': '搜尋單字',
    });
    const scenarioSel = el('select', { className: 'toeic-select', 'aria-label': '商業情境' }, [
      el('option', { value: 'all', textContent: '全部 15 情境' }),
      ...data.scenarios.map((s) => el('option', { value: s.id, textContent: s.name + ' · ' + s.nameEn })),
    ]);
    const grid = el('div', { className: 'toeic-vocab-grid' });
    const meta = el('p', { className: 'toeic-muted' });

    function paint() {
      const q = (search.value || '').trim().toLowerCase();
      const sid = scenarioSel.value;
      grid.innerHTML = '';
      let n = 0;
      data.scenarios.forEach((s) => {
        if (sid !== 'all' && s.id !== sid) return;
        (s.words || []).forEach((w) => {
          const blob = [w.w, w.zh, w.syn, w.ex, w.exZh].join(' ').toLowerCase();
          if (q && blob.indexOf(q) < 0) return;
          n += 1;
          grid.appendChild(
            el('article', { className: 'toeic-vocab-card' }, [
              el('div', { className: 'toeic-vocab-head' }, [
                el('strong', { textContent: w.w }),
                el('span', { className: 'toeic-chip', textContent: w.pos || '' }),
              ]),
              el('p', { className: 'toeic-p', textContent: w.zh }),
              el('p', { className: 'toeic-syn', textContent: '同義／替換：' + (w.syn || '—') }),
              el('p', { className: 'toeic-ex', textContent: w.ex }),
              el('p', { className: 'toeic-exzh', textContent: w.exZh }),
              el('p', { className: 'toeic-muted', textContent: s.name }),
            ])
          );
        });
      });
      meta.textContent = '顯示 ' + n + ' 筆（每情境 60 字，含同義詞替換練習）';
    }

    search.addEventListener('input', paint);
    scenarioSel.addEventListener('change', paint);
    paint();

    shell(app, '單字記憶工具', '15 大商業情境×60 高頻字。多益聽讀高分關鍵：同義詞替換（題目用 A，選項／文章用 B）。', [
      card('怎麼記', [
        ul([
          '先背「情境＋同義詞」再背例句；聽力常把單字換成同義說法。',
          '每情境一天 20 字：英→中、中→英、看 syn 說出原字。',
          '錯題本只記「題目出現的替換對」，比再背整本單字書有效。',
        ]),
      ]),
      card('字庫', [el('div', { className: 'toeic-toolbar' }, [scenarioSel, search]), meta, grid]),
    ]);
  }

  function mountListening(app) {
    shell(app, '聽力答題技巧', '四大題解法＋四國口音＋圖片預讀。下列 60 則為常考陷阱速記。', [
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
      card('60 常考陷阱速記', [
        el(
          'div',
          { className: 'toeic-trap-list' },
          LISTENING_TRAPS.map((t, i) =>
            el('article', { className: 'toeic-q' }, [
              el('div', { className: 'toeic-q-meta' }, [
                el('span', { className: 'toeic-chip', textContent: t.part }),
                el('span', { className: 'toeic-muted', textContent: '#' + (i + 1) }),
              ]),
              el('p', { className: 'toeic-point', textContent: t.trap }),
              el('p', { className: 'toeic-stem', textContent: t.ex }),
              el('p', { className: 'toeic-p', textContent: '易錯：' + t.wrong }),
              el('p', { className: 'toeic-ex', textContent: '宜選／宜聽：' + t.right }),
              el('p', { className: 'toeic-tip', textContent: t.tip }),
            ])
          )
        ),
      ]),
    ]);
  }

  function mountReading(app) {
    const data = global.WA_TOEIC_READING;
    const items = (data && data.items) || [];
    shell(app, '閱讀解題策略', data && data.focus ? data.focus : 'Parts 5–7 時間與順序。', [
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
      card('60 練題（精簡）', items.length ? quizBlock(items, { topicKey: 'part', meta: (it) => 'Part ' + it.part + ' · ' + it.skill }) : [p('資料未載入')]),
    ]);
  }

  function mountGrammar(app) {
    const data = global.WA_TOEIC_GRAMMAR;
    const items = (data && data.items) || [];
    shell(app, '文法速成指南', data && data.focus ? data.focus : 'Part 5／6 常考點。', [
      card('優先順序', [
        ul([
          '詞性轉換（名／動／形／副）— 出題量最大。',
          '介系詞與連接詞（含 on／in／at、although／despite）。',
          '分詞形容詞（interested／interesting）與代名詞指涉。',
          '假設語氣、關係代名詞、分詞構句 — 見題再穩。',
        ]),
      ]),
      card('60 例題', items.length ? quizBlock(items, { topicKey: 'topic' }) : [p('資料未載入')]),
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
          '第 1 月：單字 15 情境輪完＋文法速成 60 例打底。',
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

  /** 60 listening trap flashcards */
  const LISTENING_TRAPS = [
    { part: 'Part 1', trap: '動作進行中 vs 已完成', ex: '圖：男子正在倒茶。', wrong: 'He has poured the tea.', right: 'He is pouring tea.', tip: '進行式對進行中動作。' },
    { part: 'Part 1', trap: '相似物品', ex: '圖：桌上是筆電。', wrong: 'A typewriter is on the desk.', right: 'A laptop is on the desk.', tip: '先辨物件再聽敘述。' },
    { part: 'Part 1', trap: '位置介系詞', ex: '人在櫃檯後。', wrong: 'She is standing in front of the counter.', right: 'She is behind the counter.', tip: '預讀時標位置。' },
    { part: 'Part 1', trap: '多人只描述一人', ex: '兩人交談。', wrong: 'Only one woman is speaking on the phone.', right: 'Two colleagues are talking.', tip: '數人數與互動。' },
    { part: 'Part 1', trap: '同義動詞', ex: '推車。', wrong: 'He is carrying a cart.', right: 'He is pushing a cart.', tip: 'carry≠push。' },
    { part: 'Part 1', trap: '被動狀態', ex: '門開著無人推。', wrong: 'Someone is opening the door.', right: 'The door is open.', tip: '狀態 vs 動作。' },
    { part: 'Part 1', trap: '工具誤判', ex: '戴耳機。', wrong: 'She is wearing glasses.', right: 'She is wearing a headset.', tip: '預讀標配件。' },
    { part: 'Part 1', trap: '室內外', ex: '室內會議。', wrong: 'They are sitting on a park bench.', right: 'They are in a meeting room.', tip: '背景線索。' },
    { part: 'Part 1', trap: '數量', ex: '三箱。', wrong: 'There are two boxes.', right: 'There are three boxes.', tip: '先數再聽。' },
    { part: 'Part 1', trap: '左右', ex: '花在左側。', wrong: 'Flowers are on the right.', right: 'Flowers are on the left.', tip: '聽 left/right。' },
    { part: 'Part 2', trap: '疑問詞 who', ex: 'Who will lead the tour?', wrong: 'At three o\'clock.', right: 'Ms. Chen will.', tip: 'Who→人。' },
    { part: 'Part 2', trap: 'where', ex: 'Where is the printer?', wrong: 'It prints quickly.', right: 'On the second floor.', tip: 'Where→地點。' },
    { part: 'Part 2', trap: 'when', ex: 'When does the fair open?', wrong: 'In Hall B.', right: 'Next Monday.', tip: 'When→時間。' },
    { part: 'Part 2', trap: 'why', ex: 'Why was the flight delayed?', wrong: 'Gate 12.', right: 'Due to weather.', tip: 'Why→原因。' },
    { part: 'Part 2', trap: 'how', ex: 'How do I access the file?', wrong: 'It\'s confidential.', right: 'Use the shared drive.', tip: 'How→方式。' },
    { part: 'Part 2', trap: 'yes/no 陷阱', ex: 'Did you send the invoice?', wrong: 'The invoice is high.', right: 'Not yet, I\'ll send it now.', tip: '先答是否再補充。' },
    { part: 'Part 2', trap: '相似音', ex: 'Is the meeting at noon?', wrong: 'No, it\'s a moon lamp.', right: 'Yes, at 12.', tip: '勿被諧音帶跑。' },
    { part: 'Part 2', trap: '重複原字', ex: 'Can you copy this report?', wrong: 'I like copy machines.', right: 'Sure, how many pages?', tip: '複誦原字常是誘答。' },
    { part: 'Part 2', trap: '否定', ex: 'Has the package arrived?', wrong: 'Yes, it hasn\'t.', right: 'No, not yet.', tip: '注意否語意一致。' },
    { part: 'Part 2', trap: '建議問句', ex: 'Should we hire a temp?', wrong: 'Temps are temporary.', right: 'Yes, for two weeks.', tip: '給明確建議。' },
    { part: 'Part 2', trap: '選擇問', ex: 'Tea or coffee?', wrong: 'I work in marketing.', right: 'Coffee, please.', tip: '二選一要選邊。' },
    { part: 'Part 2', trap: '間接拒絕', ex: 'Can you stay late?', wrong: 'Late means after five.', right: 'I have another appointment.', tip: '委婉拒也是正解。' },
    { part: 'Part 2', trap: '確認', ex: 'You\'re free at 3, right?', wrong: 'Three is a number.', right: 'Actually, make it 4.', tip: '可糾正前提。' },
    { part: 'Part 2', trap: 'what time', ex: 'What time is check-in?', wrong: 'At the front desk.', right: 'From 3 p.m.', tip: '時間 vs 地點。' },
    { part: 'Part 2', trap: 'how long', ex: 'How long is the warranty?', wrong: 'It\'s under the seat.', right: 'Two years.', tip: '長度／期間。' },
    { part: 'Part 3', trap: '目的', ex: '對話在改會議室。', wrong: 'They discuss a product launch only.', right: 'They need a larger room.', tip: '聽 why they called。' },
    { part: 'Part 3', trap: '身份', ex: '對方要報價。', wrong: 'A job applicant.', right: 'A supplier.', tip: '抓角色用詞。' },
    { part: 'Part 3', trap: '時間變更', ex: '原 10 點改 11 點。', wrong: '10 a.m.', right: '11 a.m.', tip: '以最後確認為準。' },
    { part: 'Part 3', trap: '請求', ex: '請寄電子檔。', wrong: 'Print 50 copies.', right: 'Email the file.', tip: '聽 request。' },
    { part: 'Part 3', trap: '地點', ex: '在倉庫取貨。', wrong: 'At the café.', right: 'At the warehouse.', tip: '專有名詞定位。' },
    { part: 'Part 3', trap: '態度', ex: '客戶不滿延誤。', wrong: 'They are celebrating.', right: 'They are frustrated.', tip: '語調＋抱怨詞。' },
    { part: 'Part 3', trap: '下一步', ex: '會後寄議程。', wrong: 'Cancel the meeting.', right: 'Send the agenda.', tip: '聽 I\'ll / we\'ll。' },
    { part: 'Part 3', trap: '同義替換', ex: 'cut costs＝reduce expenses', wrong: 'Increase the budget.', right: 'Lower spending.', tip: '選項常換字。' },
    { part: 'Part 3', trap: '數字', ex: '訂 40 張，不是 14。', wrong: '14 tickets.', right: '40 tickets.', tip: 'teen／ty 分清。' },
    { part: 'Part 3', trap: '轉折', ex: 'However, the client declined.', wrong: 'The client agreed.', right: 'The client refused.', tip: 'however 後常是答案。' },
    { part: 'Part 3', trap: '圖表題', ex: '聽哪個季度最高。', wrong: '憑常識選。', right: '對照題目問的季度。', tip: '先讀圖題再聽。' },
    { part: 'Part 3', trap: '三人對話', ex: '第三人給方案。', wrong: '只聽前兩人。', right: '注意第三個聲音。', tip: '誰提出解法。' },
    { part: 'Part 3', trap: '電話留言', ex: '回撥分機。', wrong: 'Visit the office.', right: 'Call extension…', tip: '聽聯絡方式。' },
    { part: 'Part 3', trap: '優惠條件', ex: '買二送一至月底。', wrong: 'Always free.', right: 'Until month-end.', tip: '期限常考。' },
    { part: 'Part 3', trap: '問題原因', ex: '系統當機。', wrong: 'Wrong address.', right: 'A system outage.', tip: '聽 cause。' },
    { part: 'Part 4', trap: '廣播目的', ex: '閘門變更通知。', wrong: 'Weather forecast.', right: 'Gate change.', tip: '開頭常講目的。' },
    { part: 'Part 4', trap: '導覽', ex: '下一站博物館。', wrong: 'Return to hotel now.', right: 'Visit the museum next.', tip: '聽 next stop。' },
    { part: 'Part 4', trap: '語音信箱', ex: '請按 2 轉客服。', wrong: 'Hang up.', right: 'Press 2.', tip: '聽指示數字。' },
    { part: 'Part 4', trap: '新聞', ex: '股價上漲。', wrong: 'Prices fell.', right: 'Prices rose.', tip: '升跌動詞。' },
    { part: 'Part 4', trap: '廣告', ex: '本週五折。', wrong: 'Closed this week.', right: 'Half-price this week.', tip: '優惠條件。' },
    { part: 'Part 4', trap: '會議開場', ex: '討論預算。', wrong: 'A birthday party.', right: 'Budget review.', tip: 'agenda 詞。' },
    { part: 'Part 4', trap: '交通', ex: '改道施工。', wrong: 'Free parking forever.', right: 'Detour due to construction.', tip: '施工／改道。' },
    { part: 'Part 4', trap: '天氣影響', ex: '戶外活動取消。', wrong: 'It will be sunny indoors.', right: 'The outdoor event is canceled.', tip: '取消／延期。' },
    { part: 'Part 4', trap: '課程宣傳', ex: '需線上報名。', wrong: 'Walk in only.', right: 'Register online.', tip: '報名方式。' },
    { part: 'Part 4', trap: '工廠導覽', ex: '需戴安全帽。', wrong: 'Wear sandals.', right: 'Wear a hard hat.', tip: '安全規定。' },
    { part: 'Part 4', trap: '航班', ex: '延誤兩小時。', wrong: 'On time.', right: 'Delayed two hours.', tip: 'delay 時長。' },
    { part: 'Part 4', trap: '募款', ex: '捐款用途。', wrong: 'Ignore the cause.', right: 'Funds go to…', tip: '聽 purpose of funds。' },
    { part: 'Part 4', trap: '產品發表', ex: '上市日期。', wrong: 'Already discontinued.', right: 'Available from…', tip: 'release date。' },
    { part: 'Part 4', trap: '政策變更', ex: '退貨改 30 天。', wrong: 'No returns.', right: '30-day returns.', tip: '新舊政策對照。' },
    { part: '口音', trap: '英式 schedule', ex: 'ˈʃedjuːl 與美式 ˈskedʒuːl', wrong: '當成年份。', right: '都是「行程表」。', tip: '辨義不辨腔。' },
    { part: '口音', trap: '澳式語調', ex: '句尾上揚像問句', wrong: '一定是疑問。', right: '可能是陳述。', tip: '靠內容詞判斷。' },
    { part: '口音', trap: '加式詞彙', ex: 'washroom', wrong: '洗衣店。', right: '洗手間。', tip: '同義 restroom。' },
    { part: '口音', trap: '連音', ex: 'want to→wanna', wrong: '放棄整句。', right: '抓重音實詞。', tip: '名詞動詞優先。' },
    { part: '口音', trap: '數字 ty/teen', ex: 'thirty / thirteen', wrong: '隨便猜。', right: '聽重音位置。', tip: 'teen 後重、ty 前重。' },
    { part: '綜合', trap: '預讀習慣', ex: 'Directions 發呆', wrong: '等開考再看題。', right: '先劃關鍵字。', tip: '預讀＝送分時間。' },
  ];

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
