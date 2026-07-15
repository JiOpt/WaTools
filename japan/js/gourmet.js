/**
 * gourmet.js — Food Filter Carousel / tag system
 * Food data stored as local JSON-ready array for future API swap.
 */
(function () {
  "use strict";

  /** @type {Array<{id:string,name:string,city:string,region:string,type:string,budget:string,price:string,desc:string,img:string,alt:string}>} */
  var FOOD_DATA = [
    {
      id: "tebasaki",
      name: "名古屋手羽先",
      city: "愛知 · 名古屋",
      region: "chubu",
      type: "grill",
      budget: "mid",
      price: "¥800〜",
      desc: "胡椒香氣濃郁的炸雞翅，夜宵與居酒屋人氣王。",
      img: "https://images.unsplash.com/photo-1527477396000-e27163b481c2?auto=format&fit=crop&w=640&q=70",
      alt: "金黃酥脆炸雞翅特寫"
    },
    {
      id: "hakata-ramen",
      name: "博多豚骨拉麵",
      city: "福岡 · 博多",
      region: "kyushu",
      type: "noodles",
      budget: "low",
      price: "¥650〜",
      desc: "濃厚白濁湯頭、細直麵，可無限加麵的平民傳奇。",
      img: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=640&q=70",
      alt: "熱氣騰騰的日式豚骨拉麵碗"
    },
    {
      id: "takoyaki",
      name: "大阪章魚燒",
      city: "大阪",
      region: "kansai",
      type: "street",
      budget: "low",
      price: "¥500〜",
      desc: "外脆內軟、醬汁與柴魚片飛舞的關西街頭標誌。",
      img: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=640&q=70",
      alt: "剛出爐的章魚燒淋上醬汁"
    },
    {
      id: "monja",
      name: "月島文字燒",
      city: "東京 · 月島",
      region: "kanto",
      type: "grill",
      budget: "mid",
      price: "¥900〜",
      desc: "鐵板邊烙邊吃的東京大眾味，適合多人分享。",
      img: "https://images.unsplash.com/photo-1617093727343-374698b1b08d?auto=format&fit=crop&w=640&q=70",
      alt: "鐵板文字燒料理過程"
    },
    {
      id: "okonomiyaki",
      name: "廣島燒／大阪燒",
      city: "廣島 · 大阪",
      region: "kansai",
      type: "grill",
      budget: "mid",
      price: "¥850〜",
      desc: "層層麵皮與高麗菜、麵線堆疊的国民級鐵板料理。",
      img: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=640&q=70",
      alt: "醬汁淋上的日式大阪燒"
    },
    {
      id: "gyutan",
      name: "仙台牛舌定食",
      city: "宮城 · 仙台",
      region: "kanto",
      type: "grill",
      budget: "high",
      price: "¥1500〜",
      desc: "厚切炭烤牛舌配麥飯與尾湯，東北必點定食。",
      img: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=640&q=70",
      alt: "炭烤牛舌定食擺盤"
    },
    {
      id: "kishimen",
      name: "名古屋膝蓋麵",
      city: "愛知 · 名古屋",
      region: "chubu",
      type: "noodles",
      budget: "low",
      price: "¥700〜",
      desc: "寬扁麵條吸飽高湯，配天婦羅或油揚的地方味。",
      img: "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?auto=format&fit=crop&w=640&q=70",
      alt: "湯麵碗與箸架"
    },
    {
      id: "motsunabe",
      name: "福岡牛腸鍋",
      city: "福岡",
      region: "kyushu",
      type: "hotpot",
      budget: "mid",
      price: "¥1200〜",
      desc: "大蒜與辣油香氣十足的暖心牛雜鍋，九州夜宵代表。",
      img: "https://images.unsplash.com/photo-1512058566634-78c16a1a6615?auto=format&fit=crop&w=640&q=70",
      alt: "熱騰騰的日式火鍋特寫"
    },
    {
      id: "taiyaki",
      name: "鯛魚燒",
      city: "關東各地",
      region: "kanto",
      type: "street",
      budget: "low",
      price: "¥200〜",
      desc: "紅豆餡或奶油 custard，散步邊走邊吃的甜點經典。",
      img: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=640&q=70",
      alt: "金黃鲷鱼形状甜点"
    }
  ];

  var REGION_LABELS = {
    all: "全部地區",
    kanto: "關東",
    kansai: "關西",
    chubu: "中部",
    kyushu: "九州"
  };

  var TYPE_LABELS = {
    all: "全部類型",
    noodles: "麵食",
    grill: "鐵板／炭烤",
    street: "街邊小吃",
    hotpot: "鍋物"
  };

  var BUDGET_LABELS = {
    all: "全部預算",
    low: "親民",
    mid: "中價",
    high: "爽吃一波"
  };

  var state = { region: "all", type: "all", budget: "all" };
  var grid = document.getElementById("food-grid");
  var countEl = document.getElementById("food-count");
  if (!grid) return;

  function matches(item) {
    if (state.region !== "all" && item.region !== state.region) return false;
    if (state.type !== "all" && item.type !== state.type) return false;
    if (state.budget !== "all" && item.budget !== state.budget) return false;
    return true;
  }

  function bindImage(media, img) {
    function done() {
      img.classList.add("is-loaded");
      media.classList.add("is-ready");
    }
    if (img.complete && img.naturalWidth) {
      done();
      return;
    }
    img.addEventListener("load", done, { once: true });
    img.addEventListener(
      "error",
      function () {
        media.classList.add("is-ready");
        img.alt = (img.alt || "美食") + "（圖片載入失敗）";
        img.style.opacity = "0.35";
        img.classList.add("is-loaded");
      },
      { once: true }
    );
  }

  function render() {
    var list = FOOD_DATA.filter(matches);
    if (countEl) {
      countEl.textContent = "顯示 " + list.length + " / " + FOOD_DATA.length + " 道 B 級美食";
    }

    grid.textContent = "";
    if (!list.length) {
      var empty = document.createElement("p");
      empty.className = "food-empty";
      empty.textContent = "目前篩選沒有符合的料理，試著放寬標籤條件。";
      grid.appendChild(empty);
      return;
    }

    var frag = document.createDocumentFragment();
    list.forEach(function (item) {
      var article = document.createElement("article");
      article.className = "food-card";
      article.setAttribute("data-id", item.id);

      var media = document.createElement("div");
      media.className = "food-card__media";
      var sk = document.createElement("div");
      sk.className = "skeleton";
      sk.setAttribute("aria-hidden", "true");
      var img = document.createElement("img");
      img.src = item.img;
      img.alt = item.alt;
      img.width = 640;
      img.height = 400;
      img.loading = "lazy";
      img.decoding = "async";
      media.appendChild(sk);
      media.appendChild(img);
      bindImage(media, img);

      var body = document.createElement("div");
      body.className = "food-card__body";

      var tags = document.createElement("div");
      tags.className = "food-card__tags";
      [REGION_LABELS[item.region], TYPE_LABELS[item.type], BUDGET_LABELS[item.budget]].forEach(function (t) {
        var s = document.createElement("span");
        s.textContent = t;
        tags.appendChild(s);
      });

      var h3 = document.createElement("h3");
      h3.textContent = item.name;
      var city = document.createElement("p");
      city.className = "food-card__city";
      city.textContent = item.city;
      var desc = document.createElement("p");
      desc.className = "food-card__desc";
      desc.textContent = item.desc;
      var price = document.createElement("p");
      price.className = "food-card__price";
      price.textContent = item.price;

      body.appendChild(tags);
      body.appendChild(h3);
      body.appendChild(city);
      body.appendChild(desc);
      body.appendChild(price);

      article.appendChild(media);
      article.appendChild(body);
      frag.appendChild(article);
    });
    grid.appendChild(frag);
  }

  function syncActive(group, value) {
    document.querySelectorAll('[data-filter-group="' + group + '"]').forEach(function (btn) {
      var on = btn.getAttribute("data-filter-value") === value;
      btn.classList.toggle("is-active", on);
      btn.setAttribute("aria-pressed", on ? "true" : "false");
    });
  }

  function onFilterClick(e) {
    var btn = e.currentTarget;
    var group = btn.getAttribute("data-filter-group");
    var value = btn.getAttribute("data-filter-value");
    if (!group || !value) return;
    state[group] = value;
    syncActive(group, value);
    render();
  }

  document.querySelectorAll("[data-filter-group]").forEach(function (btn) {
    btn.addEventListener("click", onFilterClick);
  });

  syncActive("region", state.region);
  syncActive("type", state.type);
  syncActive("budget", state.budget);
  render();

  window.addEventListener("pagehide", function cleanup() {
    document.querySelectorAll("[data-filter-group]").forEach(function (btn) {
      btn.removeEventListener("click", onFilterClick);
    });
    window.removeEventListener("pagehide", cleanup);
  });

  // Expose for future API integration
  window.JapanGourmetData = FOOD_DATA;
})();
