window.WA_TOOLS_CATALOG = [
  {
    id: 'utility',
    name: '實用工具',
    tagline: '日常救急，不用下載 App 也能假裝有準備。',
    tools: [
      { slug: 'scriptures', title: '藏經閣', icon: 'bi-yin-yang', desc: '諸子百家、國學啟蒙、佛經，線上誦讀。', ready: true },
      { slug: 'settings', title: '個人化設定', icon: 'bi-sliders', desc: '深色模式、字體大小、行距、護眼色溫、縮放與無障礙偏好。', ready: true },
      { slug: 'calculatortool', title: '線上計算工具', icon: 'bi-calculator', desc: '算年齡、換溫度，比口算體面一點。' },
      { slug: 'id-generator', title: '身份證 & 信用卡', icon: 'bi-credit-card', desc: '測試用假資料，請勿拿去買房。' },
      { slug: 'phone', title: '電話 & 手機號碼', icon: 'bi-telephone', desc: '隨機號碼產生器，適合填表單時假裝有在認真填。' },
      { slug: 'color-blindness', title: '色弱測試', icon: 'bi-palette', desc: '看看你是色弱，還是隻是螢幕太髒。' },
      { slug: 'screen-test', title: '螢幕測試', icon: 'bi-display', desc: '找亮點、找壞點，順便找藉口換螢幕。' },
      { slug: 'screen-detect', title: '瀏覽器 & 螢幕檢測', icon: 'bi-window', desc: '你的瀏覽器還活著嗎？讓數據說話。' },
      { slug: 'torch', title: '手電筒', icon: 'bi-lightbulb-fill', desc: '閃光燈或螢幕照明，黑掉的地方先救再說。', ready: true },
      { slug: 'ip', title: '地理位置查詢', icon: 'bi-geo-alt', desc: '查 IP 在哪，順便確認 VPN 有沒有在摸魚。' },
      { slug: 'qrcode-scan', title: '掃碼器', icon: 'bi-upc-scan', desc: '對準 QR Code，比手動輸入有尊嚴。' },
      { slug: 'qrcode', title: 'QR Code 產生器', icon: 'bi-qr-code', desc: '把連結變方塊，掃描率看運氣。' }
    ]
  },
  {
    id: 'media',
    name: '媒體應用',
    tagline: '圖片、音樂、影片，瀏覽器裡假裝是創意工作者。',
    tools: [
      { slug: 'upload', title: '免費上傳空間', icon: 'bi-cloud-upload', desc: '暫存檔案，別當永久備份。' },
      { slug: 'meitu', title: '美圖秀秀網頁版', icon: 'bi-magic', desc: '一鍵變美，P 到連媽媽都認不出。' },
      { slug: 'photo', title: '照片編輯器', icon: 'bi-image', desc: '裁切、調色，不用開 Photoshop 也能交差。' },
      { slug: 'exif', title: '相片 Exif 資訊', icon: 'bi-camera', desc: '照片藏了什麼 metadata，偵探模式 ON。' },
      { slug: 'image-coordinate', title: '圖片座標', icon: 'bi-crosshair', desc: '滑鼠指哪，像素座標就到哪。' },
      { slug: 'music-player', title: '網頁音樂播放器', icon: 'bi-music-note-beamed', desc: '本地音樂瀏覽器播放，版權自己負責。' },
      { slug: 'media-player', title: 'Web 影片播放器', icon: 'bi-film', desc: '拖進來就能播，省得找播放器。' },
      { slug: 'drawing', title: '塗鴉板', icon: 'bi-brush', desc: '藝術家天賦 optional，塗鴉 mandatory。' }
    ]
  },
  {
    id: 'dev',
    name: '網站開發',
    tagline: '給工程師的瑞士刀，雖然可能只有刀柄。',
    tools: [
      { slug: 'color', title: '網頁色碼表', icon: 'bi-paint-bucket', desc: '挑顏色、轉色碼，設計師看了點頭。' },
      { slug: 'favicon', title: 'Favicon 產生器', icon: 'bi-app', desc: '小圖示也能有大大存在感。' },
      { slug: 'shorturl', title: '縮短網址', icon: 'bi-link-45deg', desc: '長網址變短，分享時比較像有在整理。' },
      { slug: 'url-encoder', title: 'URL 編碼 / 解碼', icon: 'bi-code-slash', desc: '%E4%BD%A0%E5%A5%BD 這種字，交給工具解讀。' },
      { slug: 'css-formatter', title: 'CSS 工具', icon: 'bi-filetype-css', desc: '美化或壓縮 CSS，讓同事以為你很整潔。' },
      { slug: 'html-js-formatter', title: 'Html & JS 工具', icon: 'bi-filetype-html', desc: '格式化程式碼，indent 戰爭暫時休兵。' },
      { slug: 'viewsource', title: '檢視網頁原始碼', icon: 'bi-file-earmark-code', desc: 'F12 的優雅替代方案。' },
      { slug: 'html-converter', title: 'Html 代碼轉換器', icon: 'bi-arrow-left-right', desc: 'HTML、PHP、JS 編碼互轉，防抄家寶。' },
      { slug: 'runcode', title: '線上代碼測試', icon: 'bi-terminal', desc: '寫完就跑，炸了再改。' },
      { slug: 'unicode', title: 'UTF-8 轉 Unicode', icon: 'bi-translate', desc: '字元轉來轉去，編碼不再霧裡看花。' },
      { slug: 'punycode', title: '中文域名', icon: 'bi-globe2', desc: '中文網域與 PunyCode 互轉，xn-- 開頭那種。' },
      { slug: 'http-status', title: 'HTTP 狀態碼', icon: 'bi-123', desc: '200 開心，404 心碎，500 先睡。' },
      { slug: 'html-entities', title: 'HTML 特殊字符', icon: 'bi-ampersand', desc: '&nbsp; &copy; 對照表，抄起來快。' },
      { slug: 'keycode', title: '鍵碼 KeyCode', icon: 'bi-keyboard', desc: '按哪顆鍵，數字馬上報到。' },
      { slug: 'unicode-table', title: 'Unicode 字碼表', icon: 'bi-table', desc: '萬國碼字元集，查字像查字典。' },
      { slug: 'big5', title: 'Big5 內碼表', icon: 'bi-journal-text', desc: '大五碼對照，復古工程師的最愛。' },
      { slug: 'keyboard-mouse', title: '鍵盤與滑鼠', icon: 'bi-mouse', desc: '測試輸入裝置，確認不是手殘是硬體。' },
      { slug: 'seo-search', title: 'SEO Search', icon: 'bi-search', desc: '收錄、反鏈查詢連結，robots / sitemap 檢測。' },
      { slug: 'sitemap', title: 'SiteMap 產生器', icon: 'bi-diagram-3', desc: 'XML / HTML 網站地圖，爬蟲不迷路。' },
      { slug: 'seo-keyword', title: 'SEO Keyword', icon: 'bi-tags', desc: '關鍵字排名，看看誰在搜你。' }
    ]
  },
  {
    id: 'editor',
    name: '線上編輯',
    tagline: '文字處理小工具，寫作人的懶人包。',
    tools: [
      { slug: 'editor', title: '線上編輯器', icon: 'bi-file-richtext', desc: 'HTML 文字編輯，協作平臺 lite 版。' },
      { slug: 'dedupe', title: '清除重複行', icon: 'bi-filter', desc: '去重複網址、姓名、文字，整理強迫症福音。' },
      { slug: 'case-converter', title: '英文大小寫轉換', icon: 'bi-type-bold', desc: 'UPPER lower Title Case，一鍵切換。' },
      { slug: 'rmb-upper', title: '數字轉中文大寫', icon: 'bi-cash-stack', desc: '壹貳參肆，支票金額寫法不出錯。' },
      { slug: 'wordcount', title: '字數計算器', icon: 'bi-text-paragraph', desc: '字數、行數、段落，交稿前最後檢查。' },
      { slug: 'colorfont', title: '漸變彩字', icon: 'bi-palette2', desc: '多彩漸層文字，標題吸睛用。' },
      { slug: 'bbcode', title: 'BBCode 轉換', icon: 'bi-code', desc: 'HTML 與 BBCode 互轉，論壇時代遺產。' },
      { slug: 'unicode-converter', title: 'Unicode 編碼轉換', icon: 'bi-binary', desc: 'Unicode 與字元互轉，編碼不再猜。' }
    ]
  },
  {
    id: 'security',
    name: '網絡安全',
    tagline: '密碼、加密、還原網址，隱私自己顧。',
    tools: [
      { slug: 'password', title: '密碼安全', icon: 'bi-shield-lock', desc: '產生隨機強密碼、即時檢測強度，並了解帳號安全最佳實務。' },
      { slug: 'email-icon', title: '電子郵件圖示', icon: 'bi-envelope-at', desc: 'Email 轉 PNG 圖片或文字混淆，降低公開網頁被爬蟲收集的風險。' },
      { slug: 'textencrypt', title: '文字加密', icon: 'bi-lock', desc: '本地 XOR 加密文字並輸出 Base64 密文，了解對稱加密概念（非工業級安全）。' },
      { slug: 'longurl', title: '短網址還原', icon: 'bi-link', desc: '還原 bit.ly、t.co、0rz.tw 等短網址的真實 URL，點擊前先確認目的地。' },
      { slug: 'url-crypto', title: '網址加密', icon: 'bi-key', desc: 'URL 16 進制加密／解密，支援 encodeURI、escape、ASP URLDecode 等格式。' }
    ]
  },
  {
    id: 'culture',
    name: '中華文化',
    tagline: '繁簡轉換、注音拼音，文化輸出靠這頁。',
    tools: [
      { slug: 'typing-teach', title: '中文輸入法教學', icon: 'bi-book', desc: '倉頡、拼音、注音、五筆，入門不專精。' },
      { slug: 'typing-practice', title: '打字教室', icon: 'bi-keyboard-fill', desc: '指法練習，別再用一指禪。' },
      { slug: 'dictionary', title: '漢語辭典', icon: 'bi-journal-bookmark', desc: '查字查音，裝作很有學問。' },
      { slug: 'cangjie-dict', title: '倉頡字典', icon: 'bi-grid-3x3', desc: '朱邦復倉頡拆碼，拆到懷疑人生。' },
      { slug: 'zh-converter', title: '繁簡轉換', icon: 'bi-arrow-repeat', desc: '繁體簡體互轉，兩岸交流必備。' },
      { slug: 'zh-table', title: '繁簡字對應表', icon: 'bi-list-columns', desc: '一字對一字，對照表比記憶可靠。' },
      { slug: 'text-garbled', title: '文字亂碼轉換', icon: 'bi-emoji-dizzy', desc: '亂碼翻譯，拯救複製貼上的悲劇。' },
      { slug: 'pinyin', title: '中文轉拼音', icon: 'bi-alphabet', desc: '漢字變拼音，教老外發音用。' },
      { slug: 'pinyin-to-zh', title: '拼音轉中文', icon: 'bi-alphabet-uppercase', desc: '拼音反查漢字，打錯音調自己扛。' },
      { slug: 'pinyin-chart', title: '漢語拼音表', icon: 'bi-grid', desc: '普通話拼音一覽，背起來比唱 rap 難。' },
      { slug: 'pinyin-syllable', title: '拼音音節查詢', icon: 'bi-menu-button', desc: '音節 menu，查起來像點餐。' },
      { slug: 'pinyin-phonics', title: '拼音拼讀表', icon: 'bi-volume-up', desc: '學拼讀，發音靠練不靠猜。' },
      { slug: 'cangjie-chart', title: '倉頡字母表', icon: 'bi-layout-text-window', desc: '字母與輔助字形，倉頡新手地圖。' },
      { slug: 'cangjie-practice', title: '速成倉頡練習', icon: 'bi-speedometer', desc: '線上練倉頡，速度靠肌肉記憶。' },
      { slug: 'bopomofo', title: '國語注音符號', icon: 'bi-type', desc: '注音拼音互轉，ㄅㄆㄇㄈ 開場。' },
      { slug: 'bopomofo-chart', title: '注音符號表', icon: 'bi-list-ol', desc: '37 個注音，背完可去選總統。' },
      { slug: 'bopomofo-phonics', title: '注音拼讀表', icon: 'bi-mic', desc: '拼讀練習，念錯了沒人笑（大概）。' },
      { slug: 'bopomofo-index', title: '注音音節查詢', icon: 'bi-search-heart', desc: '音節 index，快速定位。' },
      { slug: 'bopomofo-table', title: '注音與拼音對照', icon: 'bi-table', desc: '兩套系統對照，跨界溝通橋梁。' },
      { slug: 'abc', title: '英文字母表', icon: 'bi-type', desc: '26 字母發音，從 A 開始重新來。' }
    ]
  },
  {
    id: 'symbols',
    name: '符號學',
    tagline: '表情、標點、特殊字元，聊天比別人有料。',
    tools: [
      { slug: 'symbols-generator', title: '表情符號產生器', icon: 'bi-emoji-smile', desc: '點選符號按鈕組合顏文字，插入游標位置。' },
      { slug: 'keyboard-symbols', title: '特殊符號大全', icon: 'bi-asterisk', desc: '點一下複製符號，累積至符號框。' },
      { slug: 'emoji', title: 'Emoji 顏文字', icon: 'bi-emoji-heart-eyes', desc: '點一下複製 Emoji，累積至 Emoji 框。' },
      { slug: 'punctuation', title: '標點符號大全', icon: 'bi-quote', desc: '全形半形標點、數學符號、線框等 852 個符號，點一下複製並累積。' },
      { slug: 'symbols-name', title: '標點符號名稱', icon: 'bi-info-circle', desc: '239 個符號中英文唸法，點一下複製並累積至符號框。' },
      { slug: 'boshiamy', title: '嘸蝦米符號', icon: 'bi-input-cursor', desc: '嘸蝦米拆碼表，輸入法的密碼本。' },
      { slug: 'wubi', title: '五筆特殊符號', icon: 'bi-grid', desc: '五筆符號鍵碼，老派輸入法遺產。' },
      { slug: 'emoticon', title: 'Emoticon 表情', icon: 'bi-emoji-laughing', desc: '經典文字表情，復古但有效。' },
      { slug: 'ubcode', title: 'U+B 字符集', icon: 'bi-braces', desc: 'Unicode / Big5 打出特殊符號。' },
      { slug: 'alt-code', title: 'Alt 特殊字元', icon: 'bi-option', desc: 'Alt 數字鍵，打出隱藏符號。' },
      { slug: 'roman-numeral', title: '羅馬數字', icon: 'bi-123', desc: 'I V X L C D M，古羅馬數學課。' },
      { slug: 'suzhou-numeral', title: '蘇州碼子', icon: 'bi-hash', desc: '花碼轉換，老帳本裡的秘密。' },
      { slug: 'strokes', title: '筆畫偏旁部首', icon: 'bi-pencil', desc: '筆畫、偏旁、部首、筆順，寫字像寫程式。' }
    ]
  },
  {
    id: 'life',
    name: '生活百科',
    tagline: '時間、曆法、親戚稱呼，生活疑難雜症百科。',
    tools: [
      { slug: 'time', title: '世界時間', icon: 'bi-clock', desc: '432 個時區 UTC 最快→最慢，IANA 對照與晝夜圖示。' },
      { slug: 'calendar', title: '萬年曆', icon: 'bi-calendar-event', desc: '陽農曆、黃曆宜忌、干支五行與節氣物候。' },
      { slug: 'solar-terms', title: '二十四節氣', icon: 'bi-sun', desc: '立春驚蟄，節氣比天氣 App 有文化。' },
      { slug: 'currency', title: '全球貨幣', icon: 'bi-currency-exchange', desc: '218 筆貨幣：國旗卡片、符號、ISO 代碼與即時匯率。' },
      { slug: 'postal', title: '國家代碼 & 郵編', icon: 'bi-mailbox', desc: '國碼郵編查詢，填地址不亂填。' },
      { slug: 'area-code', title: '各國電話區碼', icon: 'bi-telephone-plus', desc: '國際區號，打越洋電話前先看。' },
      { slug: 'voltage', title: '電壓 & 插頭', icon: 'bi-plug', desc: '出國帶錯插頭，充電變修行。' },
      { slug: 'kinship', title: '親戚計算機', icon: 'bi-people', desc: '三姑六婆怎麼叫？機器比人親。' },
      { slug: 'parenting', title: '育兒工具', icon: 'bi-heart-pulse', desc: '婦幼資訊、親屬表，新手爸媽救星。' },
      { slug: 'car-brand', title: '汽車品牌', icon: 'bi-car-front', desc: '各國車標圖鑑，路上認車用。' },
      { slug: 'world-cup', title: '世界盃足球賽', icon: 'bi-trophy', desc: 'FIFA 專題，四年一次的集體狂歡。' }
    ]
  },
  {
    id: 'fun',
    name: '娛樂玩咖',
    tagline: '許願、占卜、測人品，認真你就輸了。',
    tools: [
      { slug: 'wishing-tree', title: '許願樹', icon: 'bi-tree', desc: '許個願，信則靈，不信也無妨。' },
      { slug: 'mind-reader', title: '讀心術', icon: 'bi-eye', desc: '猜心術，邏輯漏洞也是樂趣。' },
      { slug: 'zodiac', title: '生肖 & 星座', icon: 'bi-stars', desc: '今日運勢，看了當參考就好。' },
      { slug: 'ghost-story', title: '倩女幽魂', icon: 'bi-moon-stars', desc: '經典故事專題，膽小者慎入。' },
      { slug: 'fortune-stick', title: '線上抽籤', icon: 'bi-shuffle', desc: '15/16 抽籤，上上籤自己解。' },
      { slug: 'rp-test', title: '人品測試', icon: 'bi-person-check', desc: '姓名測人品，結果娛樂為主。' },
      { slug: 'jinyong', title: '金庸人物卜', icon: 'bi-book-half', desc: '你是哪個武俠角色？江湖等你。' },
      { slug: 'lucky-number', title: '幸運號碼', icon: 'bi-dice-5', desc: '下一顆球幾號？彩券夢想製造機。' },
      { slug: 'alchemist', title: '人體鍊成陣', icon: 'bi-circle-square', desc: '人體成分分析，FA 迷的儀式感。' },
      { slug: 'lucky-draw', title: '幸運大抽獎', icon: 'bi-gift', desc: '線上抽獎機，公平性由 RNG 保證。' }
    ]
  },
  {
    id: 'spiritual',
    name: '靈性覺醒',
    tagline: '生命靈數、脈輪、能量場，探索內在小宇宙。',
    tools: [
      { slug: 'numerology', title: '生命靈數', icon: 'bi-7-circle', desc: '生日藏著生命密碼，數字會說話。' },
      { slug: 'enneagram', title: '九型人格', icon: 'bi-pentagon', desc: '性格測驗，認識自己或認識別人。' },
      { slug: 'chakra', title: '七大脈輪', icon: 'bi-brightness-high', desc: '7 脈輪測驗，能量是否對齊。' },
      { slug: 'hawkins', title: '霍金斯意識能量', icon: 'bi-activity', desc: '意識能量層級，科學與靈性交界。' }
    ]
  },
  {
    id: 'world',
    name: '大千世界',
    tagline: '旗幟、人口、國歌，環遊世界不用買機票。',
    tools: [
      { slug: 'world-flags', title: '世界旗幟', icon: 'bi-flag', desc: '各國國旗一覽，附首都、地理、語言、貨幣與旗幟寓意；依洲別瀏覽，點旗即看詳情。' },
      { slug: 'population', title: '世界人口統計', icon: 'bi-people-fill', desc: '各國人口排行與成長率、結構、城市化、壽命等指標。' },
      { slug: 'coat-of-arms', title: '國家徽章', icon: 'bi-award', desc: '各國國徽紋章、象徵意義與歷史演變。' },
      { slug: 'ethnic-china', title: '中華民族', icon: 'bi-universal-access', desc: '56 個民族，多元文化大熔爐。' },
      { slug: 'national-anthem', title: '各國國歌', icon: 'bi-music-player', desc: '原文歌詞、中文翻譯，標示國際場合標準段落。' },
      { slug: 'ufo', title: '外星種族', icon: 'bi-rocket-takeoff', desc: 'UFO 圖鑑：種族、母星、文明等級與接觸傳說。' },
      { slug: 'monster', title: '妖魔鬼怪', icon: 'bi-bug', desc: '中式恐怖圖鑑：分類、異獸、弱點、文化寓意與《返校》《咒》等連結。' },
      { slug: 'national-symbol', title: '各國國寶', icon: 'bi-flower1', desc: '66 國國獸、國鳥、國魚圖鑑，附照片、中英文學名與維基連結。' }
    ]
  }
];
