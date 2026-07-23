/**
 * Finance calculators for traffic SEO.
 * Exports: window.WA_MOUNT_FINANCE[slug](app)
 */
(function (global) {
  'use strict';

  function cssHref() {
    if (global.WA_TOOL_URLS && typeof global.WA_TOOL_URLS.absolutePageHref === 'function') {
      return global.WA_TOOL_URLS.absolutePageHref('assets/css/finance-tools.css') + '?v=fn-1';
    }
    var path = String(location.pathname || '').replace(/\\/g, '/');
    if (/\/finance(\/|$)/i.test(path)) return '../assets/css/finance-tools.css?v=fn-1';
    return 'assets/css/finance-tools.css?v=fn-1';
  }

  function ensureCss() {
    var key = 'wa-fin-css';
    if (document.querySelector('link[data-wa-key="' + key + '"]')) return;
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = cssHref();
    link.setAttribute('data-wa-key', key);
    document.head.appendChild(link);
  }

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function money(n, digits) {
    if (n == null || !Number.isFinite(Number(n))) return '—';
    return Number(n).toLocaleString('zh-TW', {
      maximumFractionDigits: digits == null ? 0 : digits,
      minimumFractionDigits: digits == null ? 0 : Math.min(2, digits)
    });
  }

  function seoBlock(html) {
    return '<div class="fn-seo">' + html + '</div>';
  }

  function faqItem(q, a) {
    return '<details class="fn-faq"><summary>' + esc(q) + '</summary><p>' + esc(a) + '</p></details>';
  }

  function mountFee(app) {
    ensureCss();
    app.classList.add('wa-fin');
    app.innerHTML =
      '<section class="fn-card">' +
      '<p class="fn-eyebrow">台股成本試算</p>' +
      '<h2 class="fn-title">台股買賣手續費與證交稅試算</h2>' +
      '<p class="fn-lead">輸入成交金額與券商折扣，一秒算出買進／賣出成本與來回總費用。適合當沖與波段交易前先算清楚。</p>' +
      '<div class="fn-grid">' +
      '<label class="fn-label">成交金額（元）<input class="fn-input" id="fn-amt" type="number" min="1" value="100000"></label>' +
      '<label class="fn-label">手續費率（‰）<input class="fn-input" id="fn-fee" type="number" min="0" step="0.01" value="1.425"></label>' +
      '<label class="fn-label">券商折扣（折）<input class="fn-input" id="fn-disc" type="number" min="0.1" max="10" step="0.1" value="2.8"></label>' +
      '<label class="fn-label">最低手續費（元）<input class="fn-input" id="fn-min" type="number" min="0" value="20"></label>' +
      '<label class="fn-label">證交稅率（‰，賣出）<input class="fn-input" id="fn-tax" type="number" min="0" step="0.1" value="3"></label>' +
      '<label class="fn-label">交易方向<select class="fn-select" id="fn-side"><option value="round">來回（買+賣）</option><option value="buy">只算買進</option><option value="sell">只算賣出</option></select></label>' +
      '</div>' +
      '<button type="button" class="fn-btn" id="fn-go">立即試算</button>' +
      '<div class="fn-results" id="fn-out"></div>' +
      '<p class="fn-note">※ 一般股票手續費牌告約 0.1425%，可自行改折扣；證交稅現行為賣出成交價 0.3%（興櫃／ETF 等可能不同）。實際以券商與財政部規定為準。</p>' +
      seoBlock(
        '<h2>使用教學</h2>' +
        '<p>先填「成交金額」（股數×成交價），再輸入你的券商折扣（例如 2.8 折）。系統會依最低手續費門檻計算買進手續費、賣出手續費與證交稅，並加總來回成本與佔成交金額百分比，方便你評估當沖是否划算。</p>' +
        '<h3>計算公式說明</h3>' +
        '<ul><li>手續費 = max(成交金額 × 費率 × 折扣, 最低手續費)</li><li>證交稅（賣出）= 成交金額 × 稅率</li><li>來回成本 = 買進手續費 + 賣出手續費 + 證交稅</li></ul>' +
        '<h3>常見問題 FAQ</h3>' +
        faqItem('台股手續費怎麼算？', '牌告費率多為成交金額的 0.1425%（1.425‰），再乘上券商折扣；多數券商設有最低手續費（常見 20 元）。') +
        faqItem('證交稅是買進還是賣出收？', '一般上市櫃股票的證券交易稅在「賣出」時課徵，現行稅率多為 0.3%。買進通常不課證交稅。') +
        faqItem('為什麼當沖要特別算成本？', '當沖當日來回，手續費發生兩次且還有證交稅；若價差很小，成本可能吃掉獲利。')
      ) +
      '</section>';

    function calc() {
      var amt = Math.max(0, Number(app.querySelector('#fn-amt').value) || 0);
      var rate = (Number(app.querySelector('#fn-fee').value) || 0) / 1000;
      var disc = (Number(app.querySelector('#fn-disc').value) || 10) / 10;
      var minFee = Math.max(0, Number(app.querySelector('#fn-min').value) || 0);
      var taxRate = (Number(app.querySelector('#fn-tax').value) || 0) / 1000;
      var side = app.querySelector('#fn-side').value;
      function fee(a) { return Math.max(a * rate * disc, a > 0 ? minFee : 0); }
      var buyFee = (side === 'sell') ? 0 : fee(amt);
      var sellFee = (side === 'buy') ? 0 : fee(amt);
      var tax = (side === 'buy') ? 0 : amt * taxRate;
      var total = buyFee + sellFee + tax;
      var pct = amt > 0 ? (total / amt) * 100 : 0;
      app.querySelector('#fn-out').innerHTML =
        '<div class="fn-kpi"><span>買進手續費</span><strong>' + money(buyFee, 0) + ' 元</strong></div>' +
        '<div class="fn-kpi"><span>賣出手續費</span><strong>' + money(sellFee, 0) + ' 元</strong></div>' +
        '<div class="fn-kpi"><span>證交稅</span><strong>' + money(tax, 0) + ' 元</strong></div>' +
        '<div class="fn-kpi"><span>總成本</span><strong>' + money(total, 0) + ' 元（' + pct.toFixed(3) + '%）</strong></div>';
    }
    app.querySelector('#fn-go').addEventListener('click', calc);
    calc();
  }

  function mountDividend(app) {
    ensureCss();
    app.classList.add('wa-fin');
    app.innerHTML =
      '<section class="fn-card">' +
      '<p class="fn-eyebrow">存股與除權息</p>' +
      '<h2 class="fn-title">殖利率與除權息／填息目標價計算</h2>' +
      '<p class="fn-lead">輸入股價與現金股利（或預估股利），立即算出現金殖利率與除息後填息目標價，幫助存股族評估進場點。</p>' +
      '<div class="fn-grid">' +
      '<label class="fn-label">目前股價（元）<input class="fn-input" id="fn-price" type="number" min="0.01" step="0.01" value="100"></label>' +
      '<label class="fn-label">現金股利（元／股）<input class="fn-input" id="fn-div" type="number" min="0" step="0.01" value="5"></label>' +
      '<label class="fn-label">股票股利（元／股，可 0）<input class="fn-input" id="fn-sdiv" type="number" min="0" step="0.01" value="0"></label>' +
      '<label class="fn-label">持股股數<input class="fn-input" id="fn-shares" type="number" min="0" step="1" value="1000"></label>' +
      '</div>' +
      '<button type="button" class="fn-btn" id="fn-go">立即試算</button>' +
      '<div class="fn-results" id="fn-out"></div>' +
      '<p class="fn-note">※ 殖利率為簡化現金殖利率；除息參考價採「股價 − 現金股利」示意（實務另有股票股利調整）。實際除權息參考價以交易所公告為準。</p>' +
      seoBlock(
        '<h2>使用教學</h2>' +
        '<p>把你關注標的的股價與預計／已公告現金股利填入，即可看到現金殖利率百分比、除息後理論股價，以及若要「填息」需回到的目標價。再搭配持股股數，估算可領現金股利總額。</p>' +
        '<h3>計算公式說明</h3>' +
        '<ul><li>現金殖利率 = 現金股利 ÷ 股價 × 100%</li><li>除息參考價 ≈ 股價 − 現金股利（示意）</li><li>填息目標價 = 除息前股價（回到除息前水準）</li><li>預估現金股利收入 = 現金股利 × 股數</li></ul>' +
        '<h3>常見問題 FAQ</h3>' +
        faqItem('什麼是填息？', '除息後股價若漲回接近除息前水準，稱為填息；存股族常以此評估除權息季節的參與價值。') +
        faqItem('殖利率越高越好嗎？', '不一定。過高殖利率可能反映股價大跌或股利不可持續，需搭配公司獲利與配息穩定度。') +
        faqItem('股票股利怎麼影響？', '股票股利會增加股數、攤薄股價；本工具以現金殖利率為主，股票股利僅供備註參考。')
      ) +
      '</section>';

    function calc() {
      var price = Math.max(0.0001, Number(app.querySelector('#fn-price').value) || 0);
      var cash = Math.max(0, Number(app.querySelector('#fn-div').value) || 0);
      var shares = Math.max(0, Number(app.querySelector('#fn-shares').value) || 0);
      var yieldPct = (cash / price) * 100;
      var ex = Math.max(0, price - cash);
      var income = cash * shares;
      app.querySelector('#fn-out').innerHTML =
        '<div class="fn-kpi"><span>現金殖利率</span><strong>' + yieldPct.toFixed(2) + '%</strong></div>' +
        '<div class="fn-kpi"><span>除息參考價</span><strong>' + money(ex, 2) + ' 元</strong></div>' +
        '<div class="fn-kpi"><span>填息目標價</span><strong>' + money(price, 2) + ' 元</strong></div>' +
        '<div class="fn-kpi"><span>預估股利收入</span><strong>' + money(income, 0) + ' 元</strong></div>';
    }
    app.querySelector('#fn-go').addEventListener('click', calc);
    calc();
  }

  function mountMargin(app) {
    ensureCss();
    app.classList.add('wa-fin');
    app.innerHTML =
      '<section class="fn-card">' +
      '<p class="fn-eyebrow">融資風險控管</p>' +
      '<h2 class="fn-title">融資融券維持率試算</h2>' +
      '<p class="fn-lead">輸入融資金額、擔保品市值與維持率門檻，估算目前維持率與距追繳／斷頭的緩衝空間。投資人最怕的風險一頁算清楚。</p>' +
      '<div class="fn-grid">' +
      '<label class="fn-label">擔保品市值（元）<input class="fn-input" id="fn-coll" type="number" min="0" value="1300000"></label>' +
      '<label class="fn-label">融資負債（元）<input class="fn-input" id="fn-loan" type="number" min="0" value="1000000"></label>' +
      '<label class="fn-label">追繳維持率（%）<input class="fn-input" id="fn-call" type="number" min="0" step="0.1" value="130"></label>' +
      '<label class="fn-label">處分／警戒維持率（%）<input class="fn-input" id="fn-cut" type="number" min="0" step="0.1" value="120"></label>' +
      '</div>' +
      '<button type="button" class="fn-btn" id="fn-go">立即試算</button>' +
      '<div class="fn-results" id="fn-out"></div>' +
      '<p class="fn-note">※ 維持率 = 擔保品市值 ÷ 融資金額 × 100%。券商追繳與處分門檻可能不同，且融券另有計算方式；本工具為簡化示意，非正式券商風控系統。</p>' +
      seoBlock(
        '<h2>使用教學</h2>' +
        '<p>把目前持股市值填入「擔保品市值」，把融資餘額填入「融資負債」，即可看到維持率。若低於你設定的追繳門檻，代表可能被要求補繳保證金；低於處分門檻則風險極高。</p>' +
        '<h3>計算公式說明</h3>' +
        '<ul><li>維持率 = 擔保品市值 ÷ 融資負債 × 100%</li><li>追繳臨界市值 = 融資負債 × 追繳維持率</li><li>可再下跌空間（至追繳）= 目前市值 − 追繳臨界市值</li></ul>' +
        '<h3>常見問題 FAQ</h3>' +
        faqItem('維持率多少會被追繳？', '常見整戶維持率低於約 130% 可能追繳，低於約 120% 可能處分，實際以各券商契約為準。') +
        faqItem('為什麼維持率會突然下降？', '股價下跌會讓擔保品市值縮小，維持率同步下降；槓桿越高，對股價越敏感。') +
        faqItem('這個工具可以取代券商 App 嗎？', '不行。它只做快速估算與風險意識提醒，正式數字請以券商帳戶為準。')
      ) +
      '</section>';

    function calc() {
      var coll = Math.max(0, Number(app.querySelector('#fn-coll').value) || 0);
      var loan = Math.max(0.0001, Number(app.querySelector('#fn-loan').value) || 0);
      var callPct = Math.max(0, Number(app.querySelector('#fn-call').value) || 0) / 100;
      var cutPct = Math.max(0, Number(app.querySelector('#fn-cut').value) || 0) / 100;
      var mr = (coll / loan) * 100;
      var callVal = loan * callPct;
      var cutVal = loan * cutPct;
      var buf = coll - callVal;
      var status = mr >= callPct * 100 ? '相對安全' : (mr >= cutPct * 100 ? '可能追繳' : '高風險');
      app.querySelector('#fn-out').innerHTML =
        '<div class="fn-kpi"><span>目前維持率</span><strong>' + mr.toFixed(2) + '%</strong></div>' +
        '<div class="fn-kpi"><span>狀態</span><strong>' + esc(status) + '</strong></div>' +
        '<div class="fn-kpi"><span>追繳臨界市值</span><strong>' + money(callVal, 0) + ' 元</strong></div>' +
        '<div class="fn-kpi"><span>距追繳緩衝</span><strong>' + money(buf, 0) + ' 元</strong></div>' +
        '<div class="fn-kpi"><span>處分臨界市值</span><strong>' + money(cutVal, 0) + ' 元</strong></div>';
    }
    app.querySelector('#fn-go').addEventListener('click', calc);
    calc();
  }

  function mountCompound(app) {
    ensureCss();
    app.classList.add('wa-fin');
    app.innerHTML =
      '<section class="fn-card">' +
      '<p class="fn-eyebrow">定期定額與複利</p>' +
      '<h2 class="fn-title">定期定額複利投資試算</h2>' +
      '<p class="fn-lead">輸入每月投入、年化報酬與年數，估算期末本利和與總投入，適合 ETF 存股與小資族長期規劃。</p>' +
      '<div class="fn-grid">' +
      '<label class="fn-label">每月投入（元）<input class="fn-input" id="fn-m" type="number" min="0" value="5000"></label>' +
      '<label class="fn-label">初始本金（元）<input class="fn-input" id="fn-p0" type="number" min="0" value="0"></label>' +
      '<label class="fn-label">年化報酬率（%）<input class="fn-input" id="fn-r" type="number" step="0.1" value="8"></label>' +
      '<label class="fn-label">投資年數<input class="fn-input" id="fn-y" type="number" min="1" max="60" value="15"></label>' +
      '</div>' +
      '<button type="button" class="fn-btn" id="fn-go">立即試算</button>' +
      '<div class="fn-results" id="fn-out"></div>' +
      '<p class="fn-note">※ 採每月期末投入、月複利近似；未含手續費、稅負與報酬波動。結果僅供財務規劃參考，非正式投資建議。</p>' +
      seoBlock(
        '<h2>使用教學</h2>' +
        '<p>設定你每月能穩定投入的金額、預期年化報酬（可參考長期股市歷史區間自行保守估計），以及打算投資多少年。系統會顯示總投入、預估期末資產與複利成長差額，幫助你感受「時間」的力量。</p>' +
        '<h3>計算公式說明</h3>' +
        '<ul><li>月利率 r = 年化報酬率 ÷ 12</li><li>期末 ≈ 初始本金×(1+r)^n + 每月投入 × [((1+r)^n − 1) ÷ r]</li><li>n = 年數 × 12</li></ul>' +
        '<h3>常見問題 FAQ</h3>' +
        faqItem('定期定額一定賺錢嗎？', '不一定。工具假設穩定年化報酬，真實市場有漲跌；長期分散與紀律較重要。') +
        faqItem('報酬率要填多少？', '可先用 5%～10% 做情境分析；越樂觀越要同時看「報酬較低」的壓力測試。') +
        faqItem('適合存 ETF 嗎？', '很多存股族用此概念規劃 0050／債券等配置，但仍需考量費用、匯率與個人風險承受度。')
      ) +
      '</section>';

    function calc() {
      var m = Math.max(0, Number(app.querySelector('#fn-m').value) || 0);
      var p0 = Math.max(0, Number(app.querySelector('#fn-p0').value) || 0);
      var annual = (Number(app.querySelector('#fn-r').value) || 0) / 100;
      var years = Math.max(1, Number(app.querySelector('#fn-y').value) || 1);
      var n = years * 12;
      var r = annual / 12;
      var fv0 = p0 * Math.pow(1 + r, n);
      var fvM = r === 0 ? m * n : m * ((Math.pow(1 + r, n) - 1) / r);
      var fv = fv0 + fvM;
      var invested = p0 + m * n;
      var gain = fv - invested;
      app.querySelector('#fn-out').innerHTML =
        '<div class="fn-kpi"><span>總投入</span><strong>' + money(invested, 0) + ' 元</strong></div>' +
        '<div class="fn-kpi"><span>預估期末資產</span><strong>' + money(fv, 0) + ' 元</strong></div>' +
        '<div class="fn-kpi"><span>複利成長</span><strong>' + money(gain, 0) + ' 元</strong></div>' +
        '<div class="fn-kpi"><span>報酬倍數</span><strong>' + (invested > 0 ? (fv / invested).toFixed(2) + '×' : '—') + '</strong></div>';
    }
    app.querySelector('#fn-go').addEventListener('click', calc);
    calc();
  }

  global.WA_MOUNT_FINANCE = Object.assign(global.WA_MOUNT_FINANCE || {}, {
    'stock-fee-calc': mountFee,
    'dividend-yield': mountDividend,
    'margin-trading': mountMargin,
    'compound-interest': mountCompound
  });
})(typeof window !== 'undefined' ? window : this);
