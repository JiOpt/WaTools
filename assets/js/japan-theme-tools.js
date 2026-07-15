/**
 * Japan theme tools — mount into #tool-app (WaTools shell).
 * Loaded as tool-chunks extra for: retro, yokai, yokocho, gourmet, stay.
 */
(function (global) {
  'use strict';

  function assetUrl(rel) {
    try {
      return new URL(rel, global.location.href).href;
    } catch (e) {
      return rel;
    }
  }

  function ensureCss(href) {
    var key = 'wa-jp-css:' + href;
    if (document.querySelector('link[data-wa-key="' + key + '"]')) return;
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = assetUrl(href);
    link.setAttribute('data-wa-key', key);
    document.head.appendChild(link);
  }

  function loadThemeCss(theme) {
    ensureCss('./css/shared.css');
    ensureCss('./css/' + theme + '.css');
  }

  function cleanupFns(app) {
    var list = app.__waJpCleanup || [];
    list.forEach(function (fn) {
      try { fn(); } catch (e) { /* ignore */ }
    });
    app.__waJpCleanup = [];
  }

  function onCleanup(app, fn) {
    if (!app.__waJpCleanup) app.__waJpCleanup = [];
    app.__waJpCleanup.push(fn);
  }

  /* ——— retro ——— */
  function mountRetro(app) {
    cleanupFns(app);
    loadThemeCss('retro');
    app.className = 'tool-app theme-retro wa-jp-theme';
    app.innerHTML =
      '<div class="retro-grain" aria-hidden="true"></div>' +
      '<section class="jp-hero" aria-labelledby="jp-retro-lead">' +
      '  <p class="jp-hero__eyebrow">Showa &amp; Taisho</p>' +
      '  <p class="jp-hero__lead" id="jp-retro-lead">暖橘木質色調與膠片顆粒——拖動時光滑桿，見證現代東京緩緩還原為昭和街景。</p>' +
      '  <div class="retro-era-strip" aria-hidden="true">' +
      '    <span class="retro-era-chip">大正浪漫</span><span class="retro-era-chip">昭和黃金</span><span class="retro-era-chip">純喫茶</span>' +
      '  </div>' +
      '</section>' +
      '<section class="jp-section" aria-labelledby="morph-title">' +
      '  <h2 id="morph-title">時光對照：現代 ↔ 昭和</h2>' +
      '  <p class="jp-section__intro">以 CSS clip-path 即時裁切兩層畫面。向右拖曳，昭和風景逐漸覆蓋現代東京。</p>' +
      '  <div class="time-morph" id="time-morph" style="--morph-pct:50%" role="img" aria-label="現代東京與昭和風景對比">' +
      '    <div class="time-morph__layer time-morph__modern" aria-hidden="true"></div>' +
      '    <div class="time-morph__layer time-morph__showa" aria-hidden="true"></div>' +
      '    <div class="time-morph__divider" aria-hidden="true"></div>' +
      '    <div class="time-morph__labels" aria-hidden="true"><span>現代東京</span><span>昭和風景</span></div>' +
      '  </div>' +
      '  <div class="time-slider-panel">' +
      '    <label for="time-slider"><span>時光滑桿</span><output id="time-slider-value" for="time-slider">過渡中 · 50%</output></label>' +
      '    <input type="range" id="time-slider" class="time-slider" min="0" max="100" value="50" step="1">' +
      '  </div>' +
      '</section>' +
      '<section class="jp-section" aria-labelledby="spots-title">' +
      '  <h2 id="spots-title">懷舊街角手帳</h2>' +
      '  <div class="retro-grid">' +
      '    <article class="retro-card"><img src="https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?auto=format&amp;fit=crop&amp;w=640&amp;q=70" alt="京都古老木造町屋街道" width="640" height="400" loading="lazy" decoding="async"><div class="retro-card__body"><h3>純喫茶午后</h3><p>厚切吐司與水果聖代，把時間調慢一小時。</p></div></article>' +
      '    <article class="retro-card"><img src="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&amp;fit=crop&amp;w=640&amp;q=70" alt="日式傳統商店街燈籠" width="640" height="400" loading="lazy" decoding="async"><div class="retro-card__body"><h3>商店街午後光</h3><p>拱廊陰影與手寫看板的昭和買物日常。</p></div></article>' +
      '    <article class="retro-card"><img src="https://images.unsplash.com/photo-1480796927426-f609979314bd?auto=format&amp;fit=crop&amp;w=640&amp;q=70" alt="夜晚霓虹街景" width="640" height="400" loading="lazy" decoding="async"><div class="retro-card__body"><h3>霓虹與留聲機</h3><p>紅黃招牌與爵士唱片的大眾娛樂遺存。</p></div></article>' +
      '  </div>' +
      '</section>';

    var slider = app.querySelector('#time-slider');
    var morph = app.querySelector('#time-morph');
    var output = app.querySelector('#time-slider-value');
    var raf = 0;
    function apply(pct) {
      var v = Math.max(0, Math.min(100, Number(pct) || 0));
      morph.style.setProperty('--morph-pct', v + '%');
      if (!output) return;
      if (v <= 15) output.textContent = '現代東京';
      else if (v >= 85) output.textContent = '昭和風景';
      else output.textContent = '過渡中 · ' + Math.round(v) + '%';
    }
    function onInput() {
      var val = slider.value;
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(function () { raf = 0; apply(val); });
    }
    apply(slider.value);
    slider.addEventListener('input', onInput);
    onCleanup(app, function () {
      slider.removeEventListener('input', onInput);
      if (raf) cancelAnimationFrame(raf);
    });
  }

  /* ——— yokai ——— */
  function mountYokai(app) {
    cleanupFns(app);
    loadThemeCss('yokai');
    app.className = 'tool-app theme-yokai wa-jp-theme';
    app.innerHTML =
      '<div class="yokai-cursor" id="yokai-cursor" aria-hidden="true"></div>' +
      '<section class="jp-hero"><p class="jp-hero__eyebrow">Yokai Night Parade</p>' +
      '<p class="jp-hero__lead">移動游標如手電筒，照亮潛藏於陰影中的妖怪圖形。</p></section>' +
      '<section class="jp-section" aria-labelledby="spot-title">' +
      '  <h2 id="spot-title">聚光搜尋 Spotlight Search</h2>' +
      '  <p class="jp-section__intro">將游標移入下方區域揭示隱藏靈體。觸控裝置自動啟用完整顯示模式。</p>' +
      '  <div class="spotlight-stage" id="spotlight-stage" role="application" aria-label="妖怪手電筒探索區" style="--spot-x:50%;--spot-y:50%">' +
      '    <div class="spotlight-stage__dark" aria-hidden="true"></div>' +
      '    <div class="spotlight-stage__fog" aria-hidden="true"></div>' +
      '    <span class="yokai-hidden yokai-glyph yokai-glyph--tengu" style="left:12%;top:18%" aria-hidden="true"></span>' +
      '    <span class="yokai-hidden yokai-glyph yokai-glyph--kitsune" style="left:68%;top:22%" aria-hidden="true"></span>' +
      '    <span class="yokai-hidden yokai-glyph yokai-glyph--oni" style="left:42%;top:48%" aria-hidden="true"></span>' +
      '    <span class="yokai-hidden yokai-glyph yokai-glyph--neko" style="left:18%;top:62%" aria-hidden="true"></span>' +
      '    <span class="yokai-hidden yokai-glyph yokai-glyph--chochin" style="left:72%;top:58%" aria-hidden="true"></span>' +
      '    <span class="yokai-hidden yokai-glyph yokai-glyph--bone" style="left:52%;top:28%" aria-hidden="true"></span>' +
      '    <div class="spotlight-beam" id="spotlight-beam" aria-hidden="true"></div>' +
      '    <div class="spotlight-veil" aria-hidden="true"></div>' +
      '    <p class="spotlight-hint">移動游標 · 照亮百鬼</p>' +
      '    <p class="yokai-fallback">目前裝置啟用完整顯示模式，妖怪已現身。</p>' +
      '  </div>' +
      '</section>' +
      '<section class="jp-section" aria-labelledby="legends-title">' +
      '  <h2 id="legends-title">都市傳說速寫</h2>' +
      '  <div class="yokai-legend">' +
      '    <article><h3>裂口女</h3><p>夜路口罩後的提問，提醒旅人勿在未知巷弄逗留過久。</p></article>' +
      '    <article><h3>人形峠</h3><p>山林與廢村傳聞交織，靜謐中帶著不安的腳步回聲。</p></article>' +
      '    <article><h3>百物語</h3><p>點亮百支蠟燭輪流說怪談——最後一燭熄滅時，彼岸與現世交界。</p></article>' +
      '  </div>' +
      '</section>';

    var stage = app.querySelector('#spotlight-stage');
    var beam = app.querySelector('#spotlight-beam');
    var cursor = app.querySelector('#yokai-cursor');
    var spirits = stage.querySelectorAll('.yokai-hidden');
    var reduceMotion = global.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var coarse = global.matchMedia('(pointer: coarse)').matches;
    if (reduceMotion || coarse || !global.requestAnimationFrame) {
      stage.classList.add('is-fallback');
      spirits.forEach(function (el) { el.classList.add('is-revealed'); });
      return;
    }
    var raf = 0, lastX = 0, lastY = 0, active = false, revealR = 100;
    function revealNear(x, y) {
      var rect = stage.getBoundingClientRect();
      spirits.forEach(function (el) {
        var r = el.getBoundingClientRect();
        var cx = r.left + r.width / 2 - rect.left;
        var cy = r.top + r.height / 2 - rect.top;
        var dx = cx - x, dy = cy - y;
        el.classList.toggle('is-revealed', dx * dx + dy * dy < revealR * revealR);
      });
    }
    function paint() {
      raf = 0;
      stage.style.setProperty('--spot-x', lastX + 'px');
      stage.style.setProperty('--spot-y', lastY + 'px');
      if (beam) { beam.style.left = lastX + 'px'; beam.style.top = lastY + 'px'; }
      revealNear(lastX, lastY);
    }
    function onMove(e) {
      var rect = stage.getBoundingClientRect();
      var cx = e.clientX, cy = e.clientY;
      lastX = cx - rect.left;
      lastY = cy - rect.top;
      if (cursor) { cursor.style.left = cx + 'px'; cursor.style.top = cy + 'px'; }
      if (!raf) raf = requestAnimationFrame(paint);
    }
    function onEnter() {
      active = true;
      if (beam) beam.classList.add('is-on');
      if (cursor) cursor.classList.add('is-on');
    }
    function onLeave() {
      active = false;
      if (beam) beam.classList.remove('is-on');
      if (cursor) cursor.classList.remove('is-on');
      spirits.forEach(function (el) { el.classList.remove('is-revealed'); });
    }
    stage.addEventListener('pointerenter', onEnter);
    stage.addEventListener('pointerleave', onLeave);
    stage.addEventListener('pointermove', onMove, { passive: true });
    onCleanup(app, function () {
      stage.removeEventListener('pointerenter', onEnter);
      stage.removeEventListener('pointerleave', onLeave);
      stage.removeEventListener('pointermove', onMove);
      if (raf) cancelAnimationFrame(raf);
      if (cursor) cursor.classList.remove('is-on');
    });
  }

  /* ——— yokocho ——— */
  function mountYokocho(app) {
    cleanupFns(app);
    loadThemeCss('yokocho');
    app.className = 'tool-app theme-yokocho wa-jp-theme';
    app.innerHTML =
      '<section class="jp-hero"><p class="jp-hero__eyebrow">Midnight Alley</p>' +
      '<p class="jp-hero__lead">燈籠搖曳與窄巷暖流。打開環境音，讓雨與鐵板滋滋伴隨這晚小酌。</p>' +
      '<div class="lantern-row" aria-hidden="true"><span class="lantern"></span><span class="lantern"></span><span class="lantern"></span></div></section>' +
      '<section class="jp-section" aria-labelledby="sound-title">' +
      '  <h2 id="sound-title">環境音音板</h2>' +
      '  <p class="jp-section__intro">點擊切換雨聲、鐵板燒烤與遠處杯盞。音訊失敗時自動改用本機合成。</p>' +
      '  <div class="soundboard" role="group" aria-label="環境音切換">' +
      '    <button type="button" class="sound-btn" data-sound="rain" aria-pressed="false"><span class="sound-btn__pulse" aria-hidden="true"></span><span class="sound-btn__label">雨巷 Rain</span><span class="sound-btn__hint">屋簷滴答</span></button>' +
      '    <button type="button" class="sound-btn" data-sound="grill" aria-pressed="false"><span class="sound-btn__pulse" aria-hidden="true"></span><span class="sound-btn__label">鐵板 Grill</span><span class="sound-btn__hint">滋滋烤肉</span></button>' +
      '    <button type="button" class="sound-btn" data-sound="glasses" aria-pressed="false"><span class="sound-btn__pulse" aria-hidden="true"></span><span class="sound-btn__label">杯盞 Glasses</span><span class="sound-btn__hint">遠處乾杯</span></button>' +
      '  </div>' +
      '  <p class="soundboard-status" id="soundboard-status" role="status" aria-live="polite"></p>' +
      '  <audio id="audio-rain" preload="none"></audio><audio id="audio-grill" preload="none"></audio><audio id="audio-glasses" preload="none"></audio>' +
      '</section>' +
      '<section class="jp-section" aria-labelledby="menu-title"><h2 id="menu-title">手繪風格菜單</h2>' +
      '<div class="menu-board"><h3>◆ 今晚のおすすめ ◆</h3><ul>' +
      '<li><span>烤雞皮串</span><span>¥280</span></li><li><span>布丁玉子燒</span><span>¥420</span></li>' +
      '<li><span>高湯關東煮盛合</span><span>¥680</span></li><li><span>生啤酒</span><span>¥450</span></li></ul></div></section>';

    var buttons = app.querySelectorAll('[data-sound]');
    var statusEl = app.querySelector('#soundboard-status');
    var ctx = null, nodes = {};
    function setStatus(msg, isError) {
      if (!statusEl) return;
      statusEl.textContent = msg || '';
      statusEl.classList.toggle('is-error', !!isError);
    }
    function ensureCtx() {
      if (ctx) return ctx;
      var AC = global.AudioContext || global.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
      return ctx;
    }
    function makeNoise(ac, sec) {
      var len = ac.sampleRate * sec;
      var buf = ac.createBuffer(1, len, ac.sampleRate);
      var data = buf.getChannelData(0);
      for (var i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
      return buf;
    }
    function stopProcedural(id) {
      var n = nodes[id];
      if (!n) return;
      try {
        if (n.interval) clearInterval(n.interval);
        if (n.src.stop) n.src.stop();
        if (n.src.disconnect) n.src.disconnect();
        if (n.gain) n.gain.disconnect();
      } catch (e) { /* ignore */ }
      delete nodes[id];
    }
    function startProcedural(id) {
      var ac = ensureCtx();
      if (!ac) { setStatus('此瀏覽器不支援音訊播放。', true); return false; }
      if (ac.state === 'suspended') ac.resume().catch(function () {});
      stopProcedural(id);
      if (id === 'rain') {
        var src = ac.createBufferSource();
        src.buffer = makeNoise(ac, 2); src.loop = true;
        var filter = ac.createBiquadFilter(); filter.type = 'lowpass'; filter.frequency.value = 900;
        var gain = ac.createGain(); gain.gain.value = 0.12;
        src.connect(filter); filter.connect(gain); gain.connect(ac.destination); src.start();
        nodes[id] = { src: src, gain: gain };
      } else if (id === 'grill') {
        var src2 = ac.createBufferSource();
        src2.buffer = makeNoise(ac, 1); src2.loop = true;
        var bp = ac.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 1800;
        var g2 = ac.createGain(); g2.gain.value = 0.08;
        src2.connect(bp); bp.connect(g2); g2.connect(ac.destination); src2.start();
        nodes[id] = { src: src2, gain: g2 };
      } else {
        var osc = ac.createOscillator(); osc.type = 'sine'; osc.frequency.value = 2200;
        var g3 = ac.createGain(); g3.gain.value = 0;
        osc.connect(g3); g3.connect(ac.destination); osc.start();
        var tick = function () {
          if (!nodes[id]) return;
          var t = ac.currentTime;
          g3.gain.cancelScheduledValues(t);
          g3.gain.setValueAtTime(0, t);
          g3.gain.linearRampToValueAtTime(0.06, t + 0.01);
          g3.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
          osc.frequency.setValueAtTime(1800 + Math.random() * 800, t);
        };
        tick();
        nodes[id] = { src: osc, gain: g3, interval: setInterval(tick, 3000) };
      }
      return true;
    }
    function play(id, btn) {
      if (startProcedural(id)) {
        btn.classList.add('is-on');
        btn.setAttribute('aria-pressed', 'true');
        setStatus('環境音開啟：' + (btn.querySelector('.sound-btn__label') || {}).textContent);
      }
    }
    function stop(id, btn) {
      stopProcedural(id);
      btn.classList.remove('is-on');
      btn.setAttribute('aria-pressed', 'false');
      setStatus('已關閉：' + (btn.querySelector('.sound-btn__label') || {}).textContent);
    }
    function onClick(e) {
      var btn = e.currentTarget;
      var id = btn.getAttribute('data-sound');
      if (btn.classList.contains('is-on')) stop(id, btn);
      else play(id, btn);
    }
    buttons.forEach(function (btn) { btn.addEventListener('click', onClick); });
    onCleanup(app, function () {
      buttons.forEach(function (btn) {
        var id = btn.getAttribute('data-sound');
        if (id && btn.classList.contains('is-on')) stop(id, btn);
        btn.removeEventListener('click', onClick);
      });
      if (ctx && ctx.close) ctx.close().catch(function () {});
    });
  }

  /* ——— gourmet ——— */
  var FOOD_DATA = [
    { id: 'tebasaki', name: '名古屋手羽先', city: '愛知 · 名古屋', region: 'chubu', type: 'grill', budget: 'mid', price: '¥800〜', desc: '胡椒香氣濃郁的炸雞翅，夜宵與居酒屋人氣王。', img: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?auto=format&fit=crop&w=640&q=70', alt: '金黃酥脆炸雞翅特寫' },
    { id: 'hakata-ramen', name: '博多豚骨拉麵', city: '福岡 · 博多', region: 'kyushu', type: 'noodles', budget: 'low', price: '¥650〜', desc: '濃厚白濁湯頭、細直麵，可無限加麵的平民傳奇。', img: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=640&q=70', alt: '熱氣騰騰的日式豚骨拉麵碗' },
    { id: 'takoyaki', name: '大阪章魚燒', city: '大阪', region: 'kansai', type: 'street', budget: 'low', price: '¥500〜', desc: '外脆內軟、醬汁與柴魚片飛舞的關西街頭標誌。', img: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=640&q=70', alt: '剛出爐的章魚燒' },
    { id: 'monja', name: '月島文字燒', city: '東京 · 月島', region: 'kanto', type: 'grill', budget: 'mid', price: '¥900〜', desc: '鐵板邊烙邊吃的東京大眾味。', img: 'https://images.unsplash.com/photo-1617093727343-374698b1b08d?auto=format&fit=crop&w=640&q=70', alt: '鐵板文字燒' },
    { id: 'okonomiyaki', name: '廣島燒／大阪燒', city: '廣島 · 大阪', region: 'kansai', type: 'grill', budget: 'mid', price: '¥850〜', desc: '層層麵皮與高麗菜堆疊的国民鐵板料理。', img: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=640&q=70', alt: '大阪燒' },
    { id: 'gyutan', name: '仙台牛舌定食', city: '宮城 · 仙台', region: 'kanto', type: 'grill', budget: 'high', price: '¥1500〜', desc: '厚切炭烤牛舌配麥飯與尾湯。', img: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=640&q=70', alt: '牛舌定食' },
    { id: 'kishimen', name: '名古屋膝蓋麵', city: '愛知 · 名古屋', region: 'chubu', type: 'noodles', budget: 'low', price: '¥700〜', desc: '寬扁麵條吸飽高湯的地方味。', img: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?auto=format&fit=crop&w=640&q=70', alt: '湯麵碗' },
    { id: 'motsunabe', name: '福岡牛腸鍋', city: '福岡', region: 'kyushu', type: 'hotpot', budget: 'mid', price: '¥1200〜', desc: '大蒜與辣油香氣十足的暖心牛雜鍋。', img: 'https://images.unsplash.com/photo-1512058566634-78c16a1a6615?auto=format&fit=crop&w=640&q=70', alt: '日式火鍋' },
    { id: 'taiyaki', name: '鯛魚燒', city: '關東各地', region: 'kanto', type: 'street', budget: 'low', price: '¥200〜', desc: '紅豆餡散步甜點經典。', img: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=640&q=70', alt: '鲷鱼烧甜点' }
  ];
  var REGION_LABELS = { all: '全部', kanto: '關東', kansai: '關西', chubu: '中部', kyushu: '九州' };
  var TYPE_LABELS = { all: '全部', noodles: '麵食', grill: '鐵板／炭烤', street: '街邊小吃', hotpot: '鍋物' };
  var BUDGET_LABELS = { all: '全部', low: '親民', mid: '中價', high: '爽吃一波' };

  function mountGourmet(app) {
    cleanupFns(app);
    loadThemeCss('gourmet');
    app.className = 'tool-app theme-gourmet wa-jp-theme';
    app.innerHTML =
      '<section class="jp-hero"><p class="jp-hero__eyebrow">B-kyu Gurume</p>' +
      '<p class="jp-hero__lead">依地區與預算篩選，找到下一口傳奇庶民味。</p></section>' +
      '<section class="jp-section" aria-labelledby="filter-title">' +
      '  <h2 id="filter-title">美食篩選</h2>' +
      '  <div class="filter-bar" role="search">' +
      '    <div class="filter-row"><span class="filter-row__label">地區</span><div class="filter-tags" id="fg-region"></div></div>' +
      '    <div class="filter-row"><span class="filter-row__label">類型</span><div class="filter-tags" id="fg-type"></div></div>' +
      '    <div class="filter-row"><span class="filter-row__label">預算</span><div class="filter-tags" id="fg-budget"></div></div>' +
      '  </div>' +
      '  <p class="food-meta" id="food-count" aria-live="polite"></p>' +
      '  <div class="food-grid" id="food-grid"></div>' +
      '</section>';

    var state = { region: 'all', type: 'all', budget: 'all' };
    var grid = app.querySelector('#food-grid');
    var countEl = app.querySelector('#food-count');

    function fillTags(el, group, map) {
      el.textContent = '';
      Object.keys(map).forEach(function (key) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'filter-tag' + (state[group] === key ? ' is-active' : '');
        btn.setAttribute('data-filter-group', group);
        btn.setAttribute('data-filter-value', key);
        btn.setAttribute('aria-pressed', state[group] === key ? 'true' : 'false');
        btn.textContent = map[key];
        el.appendChild(btn);
      });
    }
    fillTags(app.querySelector('#fg-region'), 'region', REGION_LABELS);
    fillTags(app.querySelector('#fg-type'), 'type', TYPE_LABELS);
    fillTags(app.querySelector('#fg-budget'), 'budget', BUDGET_LABELS);

    function matches(item) {
      return (state.region === 'all' || item.region === state.region) &&
        (state.type === 'all' || item.type === state.type) &&
        (state.budget === 'all' || item.budget === state.budget);
    }
    function render() {
      var list = FOOD_DATA.filter(matches);
      countEl.textContent = '顯示 ' + list.length + ' / ' + FOOD_DATA.length + ' 道 B 級美食';
      grid.textContent = '';
      if (!list.length) {
        var empty = document.createElement('p');
        empty.className = 'food-empty';
        empty.textContent = '目前篩選沒有符合的料理，試著放寬標籤。';
        grid.appendChild(empty);
        return;
      }
      list.forEach(function (item) {
        var article = document.createElement('article');
        article.className = 'food-card';
        var media = document.createElement('div');
        media.className = 'food-card__media';
        var sk = document.createElement('div');
        sk.className = 'skeleton';
        sk.setAttribute('aria-hidden', 'true');
        var img = document.createElement('img');
        img.src = item.img; img.alt = item.alt; img.width = 640; img.height = 400;
        img.loading = 'lazy'; img.decoding = 'async';
        function done() { img.classList.add('is-loaded'); media.classList.add('is-ready'); }
        if (img.complete && img.naturalWidth) done();
        else {
          img.addEventListener('load', done, { once: true });
          img.addEventListener('error', function () { media.classList.add('is-ready'); img.classList.add('is-loaded'); img.style.opacity = '0.35'; }, { once: true });
        }
        media.appendChild(sk); media.appendChild(img);
        var body = document.createElement('div');
        body.className = 'food-card__body';
        body.innerHTML = '<div class="food-card__tags"><span>' + REGION_LABELS[item.region] + '</span><span>' + TYPE_LABELS[item.type] + '</span><span>' + BUDGET_LABELS[item.budget] + '</span></div>' +
          '<h3>' + item.name + '</h3><p class="food-card__city">' + item.city + '</p><p class="food-card__desc">' + item.desc + '</p><p class="food-card__price">' + item.price + '</p>';
        article.appendChild(media); article.appendChild(body);
        grid.appendChild(article);
      });
    }
    function onFilterClick(e) {
      var btn = e.target.closest('[data-filter-group]');
      if (!btn || !app.contains(btn)) return;
      var group = btn.getAttribute('data-filter-group');
      var value = btn.getAttribute('data-filter-value');
      state[group] = value;
      app.querySelectorAll('[data-filter-group="' + group + '"]').forEach(function (b) {
        var on = b.getAttribute('data-filter-value') === value;
        b.classList.toggle('is-active', on);
        b.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
      render();
    }
    app.addEventListener('click', onFilterClick);
    render();
    onCleanup(app, function () { app.removeEventListener('click', onFilterClick); });
  }

  /* ——— stay ——— */
  function stayCard(meta, title, loc, desc, daySrc, dayAlt, nightSrc, nightAlt) {
    return '<article class="stay-card">' +
      '<div class="stay-card__visual">' +
      '<img class="stay-card__img stay-card__img--day" src="' + daySrc + '" alt="' + dayAlt + '" width="720" height="540" loading="lazy" decoding="async">' +
      '<img class="stay-card__img stay-card__img--night" src="' + nightSrc + '" alt="' + nightAlt + '" width="720" height="540" loading="lazy" decoding="async">' +
      '<div class="stay-card__glow" aria-hidden="true"></div></div>' +
      '<div class="stay-card__body"><p class="stay-card__meta">' + meta + '</p><h3>' + title + '</h3>' +
      '<p class="stay-card__loc">' + loc + '</p><p class="stay-card__desc">' + desc + '</p>' +
      '<p class="stay-card__live" aria-live="polite">目前：日間氛圍</p>' +
      '<button type="button" class="stay-toggle" aria-pressed="false">切換夜間視角</button></div></article>';
  }

  function mountStay(app) {
    cleanupFns(app);
    loadThemeCss('stay');
    app.className = 'tool-app theme-stay wa-jp-theme';
    app.innerHTML =
      '<section class="jp-hero"><p class="jp-hero__eyebrow">Hidden Gems &amp; Machiya</p>' +
      '<p class="jp-hero__lead">侘寂質感導覽町家、旅館與木屋。切換日夜視角，感受同一處所的兩種呼吸。</p></section>' +
      '<nav class="cat-nav" aria-label="旅宿分類"><a href="#cat-ryokan">旅館</a><a href="#cat-machiya">町家</a><a href="#cat-nature">自然棲居</a></nav>' +
      '<section class="jp-section stay-category" id="cat-ryokan"><h2>歷史旅館 Ryokan</h2><div class="stay-grid">' +
      stayCard('Ryokan', '山澗秘湯館', '東北 · 藏王週邊（示意）', '露天風呂面對檜木與霧氣。',
        'https://images.unsplash.com/photo-1578469550956-0e2b2ed8b89d?auto=format&fit=crop&w=720&q=70', '日間日式庭園',
        'https://images.unsplash.com/photo-1528164344705-47542687000d?auto=format&fit=crop&w=720&q=70', '夜間燈籠庭園') +
      stayCard('Ryokan', '百年廊下宿', '北陸 · 溫泉街（示意）', '木走廊足音與懷石節奏。',
        'https://images.unsplash.com/photo-1480796927426-f609979314bd?auto=format&fit=crop&w=720&q=70', '日間傳統建築',
        'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=720&q=70', '夜間街道燈光') +
      '</div></section>' +
      '<section class="jp-section stay-category" id="cat-machiya"><h2>京都町家 Machiya</h2><div class="stay-grid">' +
      stayCard('Machiya', '格窗静町', '京都 · 西陣周邊（示意）', '窄長屋進深，障子透出暖光。',
        'https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?auto=format&fit=crop&w=720&q=70', '日間町屋',
        'https://images.unsplash.com/photo-1478436127897-768ebb58f56a?auto=format&fit=crop&w=720&q=70', '夜間巷弄') +
      stayCard('Machiya', '坪庭茶宿', '京都 · 東山近郊（示意）', '一席茶、一坪綠。',
        'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&w=720&q=70', '日間榻榻米',
        'https://images.unsplash.com/photo-1590073844006-3335f5f693d9?auto=format&fit=crop&w=720&q=70', '夜間室內燈光') +
      '</div></section>' +
      '<section class="jp-section stay-category" id="cat-nature"><h2>自然棲居 Nature</h2><div class="stay-grid">' +
      stayCard('Nature', '樹冠木屋', '信州 · 森林邊緣（示意）', '白天葉隙光斑，夜間萬籟。',
        'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=720&q=70', '日間森林',
        'https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=720&q=70', '夜間森林') +
      stayCard('Nature', '湖霧小居', '北海道 · 湖畔（示意）', '晨霧與暮色交接。',
        'https://images.unsplash.com/photo-1501785888041-af3ba85f932b?auto=format&fit=crop&w=720&q=70', '日間湖畔',
        'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=720&q=70', '黃昏山景') +
      '</div></section>';

    function setMode(card, night) {
      card.classList.toggle('is-night', night);
      var btn = card.querySelector('.stay-toggle');
      if (btn) {
        btn.setAttribute('aria-pressed', night ? 'true' : 'false');
        btn.textContent = night ? '切換日間視角' : '切換夜間視角';
      }
      var live = card.querySelector('.stay-card__live');
      if (live) live.textContent = night ? '目前：夜間氛圍' : '目前：日間氛圍';
    }
    function onToggle(e) {
      var btn = e.target.closest('.stay-toggle');
      if (!btn || !app.contains(btn)) return;
      var card = btn.closest('.stay-card');
      if (card) setMode(card, !card.classList.contains('is-night'));
    }
    app.addEventListener('click', onToggle);
    onCleanup(app, function () { app.removeEventListener('click', onToggle); });
  }

  var MOUNTS = {
    retro: mountRetro,
    yokai: mountYokai,
    yokocho: mountYokocho,
    gourmet: mountGourmet,
    stay: mountStay
  };

  global.WA_MOUNT_JAPAN_THEME = MOUNTS;
})(typeof window !== 'undefined' ? window : this);
