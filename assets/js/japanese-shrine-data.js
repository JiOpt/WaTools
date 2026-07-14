/**
 * 日本神社 — 依地區分類；卡片顯示主祭神／專屬強項，點開看詳情。
 * 圖片置於 world/japanese-shrine-img/（各檔 <1MB）。
 */
window.WA_JAPANESE_SHRINES = {
  intro:
    '造訪日本神社，最需要先了解該神社主祭神（供奉對象）、專屬強項（如結緣、求財、學業），以及正確的參拜禮儀（二禮二拍手一禮）。這不僅能避免拜錯神，更能讓祈願精準傳達，深入體驗日本神道教的文化底蘊。以下依日本地區整理代表性神社：卡片上直接標示主祭神與專屬強項，點擊卡片可閱讀歷史背景與參拜重點。',

  etiquette: {
    title: '參拜與文化要點',
    intro:
      '探索日本神社文化，通常要掌握：祭祀對象與特色、專屬保佑項目，以及正確的參拜流程。神明各有專精——祈求戀愛可往「結緣神社」（如出雲大社），祈求財運可造訪稻荷系神社；學業則多找天滿宮。',
    items: [
      {
        id: 'torii',
        title: '鳥居',
        image: 'japanese-shrine-img/etiquette-torii.jpg',
        summary: '神界與人界的結界，進入前輕輕鞠躬。',
        detail:
          '鳥居象徵神域入口。通過前宜稍停、微微鞠躬，心態從日常切換為虔誠。勿在鳥居下停留拍照過久而擋路；大型社有多座鳥居，每過一重都可視為更深一層的淨化。',
      },
      {
        id: 'temizuya',
        title: '手水舍',
        image: 'japanese-shrine-img/etiquette-temizuya.jpg',
        summary: '參拜前洗手、漱口，淨化身心。',
        detail:
          '流程：右手柄舀水→洗左手→換左手洗右手→再舀水至左手輕漱（勿對柄口直喝）→直立柄洗柄→歸柄。清水象徵「祓」，能淨身才能見神。',
      },
      {
        id: 'worship',
        title: '賽錢與二禮二拍手一禮',
        image: 'japanese-shrine-img/etiquette-worship.jpg',
        summary: '投香油錢後：兩鞠躬、拍手兩下、默禱、一鞠躬。',
        detail:
          '站在拜殿前：輕輕搖鈴（若有）、投入賽錢。接著「二禮二拍手一禮」——深深鞠躬兩次、拍手兩下、雙手合十默禱許願、再一鞠躬。出雲大社等社有時為「二禮四拍手一禮」，以社內標示為準。',
      },
      {
        id: 'omamori',
        title: '御神籤・御守・繪馬',
        image: 'japanese-shrine-img/etiquette-omamori.jpg',
        summary: '運勢、守護與願望的物質寄託。',
        detail:
          '御神籤：大吉可珍藏；凶籤多綁於神社指定處，寓意「逢凶化吉」。御守（健康、學業、交通安全等）效力多以一年為期，舊守宜送回原社焚納。繪馬：將願望寫在木牌懸掛祈願。',
      },
    ],
  },

  regions: [
    {
      id: 'hokkaido',
      title: '北海道',
      intro: '開拓與北國氣象交織的信仰地景。',
      shrines: [
        {
          id: 'hokkaido-jingu',
          name: '北海道神宮',
          nameJa: '北海道神宮',
          location: '北海道札幌市',
          kami: '開拓三神・明治天皇',
          blessings: ['開運', '開拓安居', '家運'],
          image: 'japanese-shrine-img/hokkaido-jingu.jpg',
          detail:
            '明治時代為開拓蝦夷地而創建，供奉開拓三神與後合祀之明治天皇。園內四季楓紅與雪景並稱，是札幌人氣最高的神社之一。求職、安居、新事業開張常見參拜主題。',
          tips: '新年參拜人潮極大；平日可悠閒走園內步道。',
        },
      ],
    },
    {
      id: 'tohoku',
      title: '東北',
      intro: '海運、漁撈與山岳信仰深厚的東北諸社。',
      shrines: [
        {
          id: 'shiogama',
          name: '鹽竈神社',
          nameJa: '鹽竈神社',
          location: '宮城縣鹽竈市',
          kami: '鹽土老翁神・武甕槌神・経津主神',
          blessings: ['航海安全', '安產', '鹽業商運'],
          image: 'japanese-shrine-img/shiogama.jpg',
          detail:
            '東北屈指可數的古社，與陸奥國的鹽業、航海史緊密相關。主祭鹽土老翁神，傳說為神武東征指路；亦鎮護漁業與安產。從社殿可眺望松島灣一帶海景。',
          tips: '可順遊松島；市區近車站，一日遊方便。',
        },
      ],
    },
    {
      id: 'kanto',
      title: '関東',
      intro: '從東京都會到鎌倉古都，結緣、商業與武運並存。',
      shrines: [
        {
          id: 'meiji-jingu',
          name: '明治神宮',
          nameJa: '明治神宮',
          location: '東京都澀谷區',
          kami: '明治天皇・昭憲皇太后',
          blessings: ['結緣', '事業', '結婚'],
          image: 'japanese-shrine-img/meiji-jingu.jpg',
          detail:
            '供奉明治天皇與昭憲皇太后，人造神宮森林圍護，都市中的綠色聖域。結婚祈願、事業開運極受歡迎；元旦參拜為日本規模最大之一。',
          tips: '原宿步行可達；週末常有神前結婚式，請保持肅靜。',
        },
        {
          id: 'kanda-myojin',
          name: '神田明神',
          nameJa: '神田明神',
          location: '東京都千代田區',
          kami: '大己貴命・少彦名命・平將門命',
          blessings: ['商業繁盛', '開運', 'IT／創業'],
          image: 'japanese-shrine-img/kanda-myojin.jpg',
          detail:
            '江户總鎮守之一，近秋葉原。主祭大己貴命（大國主神）與少彦名命，後合祀平將門。商人、創業者與近年IT相關祈願熱門；神田祭為江戶三大祭之一。',
          tips: '可搭配秋葉原電器街一日遊。',
        },
        {
          id: 'asakusa',
          name: '淺草神社',
          nameJa: '淺草神社',
          location: '東京都台東區',
          kami: '檜前浜成命・竹成命・土師眞中知命',
          blessings: ['緣結', '開運', '藝術'],
          image: 'japanese-shrine-img/asakusa.jpg',
          detail:
            '位於淺草寺旁，供奉傳說發現觀音像的兄弟與相關人士，故與結緣、藝能相關祈願連結深。三社祭為東京最熱鬧祭典之一。',
          tips: '與淺草寺、仲見世通一起參訪；分清寺（佛教）與社（神道）再參拜。',
        },
        {
          id: 'tsurugaoka',
          name: '鶴岡八幡宮',
          nameJa: '鶴岡八幡宮',
          location: '神奈川縣鎌倉市',
          kami: '應神天皇（八幡神）・比売神・神功皇后',
          blessings: ['勝運', '武運', '安產'],
          image: 'japanese-shrine-img/tsurugaoka.jpg',
          detail:
            '源氏守護神之地，是鎌倉的精神象徵。八幡信仰代表勝利與守護；階梯與舞殿景色經典。考試、競賽、求職「勝運」參拜者眾多。',
          tips: '若宮大路步行至社；櫻花季與新年極擠。',
        },
        {
          id: 'kashima',
          name: '鹿島神宮',
          nameJa: '鹿島神宮',
          location: '茨城縣鹿嶋市',
          kami: '武甕槌大神',
          blessings: ['武運', '開運', '勝負'],
          image: 'japanese-shrine-img/kashima.jpg',
          detail:
            '與香取神宮並稱関東兩大軍神社。主祭武甕槌大神，《古事記》中平定葦原中國的神。古杉參道與要石傳說著名，武術、競技、求職皆有信眾。',
          tips: '可搭配鹿島神宮與香取兩社巡禮。',
        },
      ],
    },
    {
      id: 'chubu',
      title: '中部',
      intro: '三種神器、山岳與勝負之神所在。',
      shrines: [
        {
          id: 'atsuta',
          name: '熱田神宮',
          nameJa: '熱田神宮',
          location: '愛知縣名古屋市',
          kami: '熱田大神（天叢雲劍等）',
          blessings: ['厄除', '開運', '安產'],
          image: 'japanese-shrine-img/atsuta.jpg',
          detail:
            '供奉三種神器之一「草薙劍」（天叢雲劍）相關神格，與伊勢神宮並尊。名古屋的守護神社，厄除、安產與開運參拜極盛。境內古木森森，氣氛莊嚴。',
          tips: '地鐵名城線直達；寶物館可看文物（劍本身不公開）。',
        },
        {
          id: 'suwa',
          name: '諏訪大社',
          nameJa: '諏訪大社',
          location: '長野縣諏訪地方',
          kami: '建御名方神・八坂刀売神',
          blessings: ['勝運', '武運', '農耕'],
          image: 'japanese-shrine-img/suwa.jpg',
          detail:
            '日本最古神社之一，上社／下社四座本宮分布諏訪湖周圍。主祭建御名方神（出雲系），與御柱祭聞名全國。祈求勝利、事業戰運者眾多。',
          tips: '四社分開，建議挑一本宮深遊，或安排兩日巡禮。',
        },
      ],
    },
    {
      id: 'kinki',
      title: '近畿',
      intro: '皇室、稻荷、八阪與住吉——關西信仰核心圈。',
      shrines: [
        {
          id: 'ise',
          name: '伊勢神宮',
          nameJa: '伊勢神宮',
          location: '三重縣伊勢市',
          kami: '天照大御神（內宮）・豊受大御神（外宮）',
          blessings: ['萬願', '國家安泰', '豐收'],
          image: 'japanese-shrine-img/ise.jpg',
          detail:
            '日本神社的「總本家」意象。內宮供奉天照大御神，外宮供奉豊受大御神。每二十年「式年遷宮」重建社殿傳統舉世聞名。許願宜簡潔虔誠，不強求特定「強項」——象徵萬願總攬。',
          tips: '先外宮後內宮為傳統；內宮最深處攝影多受限，請遵守標示。',
        },
        {
          id: 'fushimi-inari',
          name: '伏見稻荷大社',
          nameJa: '伏見稲荷大社',
          location: '京都府京都市',
          kami: '宇迦之御魂大神',
          blessings: ['商売繁盛', '五穀豐登', '財運'],
          image: 'japanese-shrine-img/fushimi-inari.jpg',
          detail:
            '全國稻荷神社總本宮，千本鳥居聞名世界。主祭宇迦之御魂大神，為食物、農業與生意之神。狐狸為神使，紅鳥居山道是經典造訪體驗。',
          tips: '全線爬山約2–3小時；只走下段鳥居隧道亦足夠打卡。',
        },
        {
          id: 'yasaka',
          name: '八坂神社',
          nameJa: '八坂神社',
          location: '京都府京都市',
          kami: '素戔嗚尊・櫛稲田姫命・八柱御子神',
          blessings: ['厄除', '開運', '防疫'],
          image: 'japanese-shrine-img/yasaka.jpg',
          detail:
            '祇園之社，主祭素戔嗚尊。祇園祭即起源於此，與疫病祓除、開運厄除傳統深厚。夜色燈籠下的樓門極具京都風情。',
          tips: '鄰近祇園、清水寺；夜間拍攝燈籠氛圍佳。',
        },
        {
          id: 'kasuga',
          name: '春日大社',
          nameJa: '春日大社',
          location: '奈良縣奈良市',
          kami: '武甕槌命・経津主命・天児屋根命・比売神',
          blessings: ['文運', '開運', '學業'],
          image: 'japanese-shrine-img/kasuga.jpg',
          detail:
            '藤原氏氏神，世界遺產。春日燈籠與春日造社殿獨特；神鹿傳說與奈良公園連成一體。文運、學業與考試祈願傳統綿長。',
          tips: '可走萬燈籠參道；部分內院需購票。',
        },
        {
          id: 'sumiyoshi',
          name: '住吉大社',
          nameJa: '住吉大社',
          location: '大阪府大阪市',
          kami: '住吉三神（底筒男命等）',
          blessings: ['航海安全', '商業', '和歌'],
          image: 'japanese-shrine-img/sumiyoshi.jpg',
          detail:
            '住吉造建築代表社，主祭航海守護神。古代遣唐使航海祈願核心；亦與商業、文藝相關。反橋（太鼓橋）景色著名。',
          tips: '南海本線住吉大社駅近；與堺町屋氛圍一併遊覽。',
        },
      ],
    },
    {
      id: 'chugoku',
      title: '中国',
      intro: '結緣總本社與海上嚴島的中國地方。',
      shrines: [
        {
          id: 'izumo',
          name: '出雲大社',
          nameJa: '出雲大社',
          location: '島根縣出雲市',
          kami: '大國主大神',
          blessings: ['緣結', '和好', '開運'],
          image: 'japanese-shrine-img/izumo.jpg',
          detail:
            '日本結緣信仰的象徵總社。主祭大國主大神，掌管「緣」（人際、姻緣、事業緣）。參拜多為「二禮四拍手一禮」。巨注連繩（注連繩）與神樂殿氣勢恢宏。',
          tips: '務必確認拍手次數標示；10月神在月相關活動特別多。',
        },
        {
          id: 'itsukushima',
          name: '嚴島神社',
          nameJa: '嚴島神社',
          location: '廣島縣廿日市市（宮島）',
          kami: '市杵島姫命・田心姫命・湍津姫命',
          blessings: ['海上安穩', '藝能', '開運'],
          image: 'japanese-shrine-img/itsukushima.jpg',
          detail:
            '世界遺產。海上鳥居與社殿隨潮起潮落景色不同，主祭宗像三女神。與平家、藝能、航海息息相關。滿潮拍鳥居、乾潮可走近脚邊，皆爲經典體驗。',
          tips: '查潮汐表；鹿在街上，勿餵食過多。',
        },
      ],
    },
    {
      id: 'shikoku',
      title: '四国',
      intro: '金刀比羅——海運與長階參道的信仰。',
      shrines: [
        {
          id: 'kotohira',
          name: '金刀比羅宮',
          nameJa: '金刀比羅宮',
          location: '香川縣仲多度郡琴平町',
          kami: '大物主神・崇德天皇',
          blessings: ['航海安全', '商業', '交通'],
          image: 'japanese-shrine-img/kotohira.jpg',
          detail:
            '通稱「金毗羅さん」，海運守護信仰深厚。從山下至本宮超過七百階石段，朝拜本身即是修行。商人、船員、交通相關祈願常見。',
          tips: '穿好步行鞋；中途可休息，不必硬上全段。',
        },
      ],
    },
    {
      id: 'kyushu',
      title: '九州・沖繩',
      intro: '學業天神與八幡總本宮所在。',
      shrines: [
        {
          id: 'dazaifu',
          name: '太宰府天滿宮',
          nameJa: '太宰府天滿宮',
          location: '福岡縣太宰府市',
          kami: '菅原道真公',
          blessings: ['學業', '考試', '文運'],
          image: 'japanese-shrine-img/dazaifu.jpg',
          detail:
            '日本天神・學問之神信仰的兩大中心之一（與北野天滿宮並稱）。主祭菅原道真。合格祈願、受験生御守與飛梅傳說極為有名。',
          tips: '考試季極擠；梅花季節景色最美。',
        },
        {
          id: 'usa',
          name: '宇佐神宮',
          nameJa: '宇佐神宮',
          location: '大分縣宇佐市',
          kami: '八幡大神・比売大神・神功皇后',
          blessings: ['武運', '國家安泰', '開運'],
          image: 'japanese-shrine-img/usa.jpg',
          detail:
            '全國八幡神社的總本宮。八幡信仰由九州傳向全國，影響鎌倉鶴岡等地。建築與綠地開闊，氛圍莊重。',
          tips: '相對遊客較少，適合安靜參拜；可搭配中津、別府行程。',
        },
      ],
    },
  ],
};
