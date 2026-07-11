/**
 * Curated national anthem lyrics (full text, zh translation, official ceremony verse).
 * Keys match world-flags country codes (lowercase).
 */
export const ANTHEM_ENRICH = {
  twn: {
    anthem: '中華民國國歌',
    anthemOriginal: 'National Anthem of the Republic of China',
    lang: 'zh-Hant',
    durationSec: 52,
    durationNote: '外交與國際場合僅奏唱第一段，約 52 秒；完整三段落約 1 分 30 秒。',
    verses: [
      {
        label: '第一段（國際標準）',
        official: true,
        original: '三民主義，吾黨所宗，以建民國，以進大同。\n諮爾多士，為民前鋒，夙夜匪懈，主義是從。',
        zh: '三民主義是我們的信仰，為建立民國、實現大同而奮鬥。\n諸君應做人民先鋒，日夜不懈，遵循主義。',
      },
      {
        label: '第二段',
        official: false,
        original: '矢勤矢勇，必信必忠，一心一德，貫徹始終。',
        zh: '勤奮勇敢，必信必忠，團結一心，貫徹到底。',
      },
      {
        label: '第三段',
        official: false,
        original: '諮爾多士，為民前鋒，夙夜匪懈，主義是從。',
        zh: '（與第一段呼應，完整版重複強調為民前鋒、遵循主義。）',
      },
    ],
  },
  usa: {
    anthem: 'The Star-Spangled Banner',
    anthemOriginal: '星條旗之歌',
    lang: 'en',
    durationSec: 75,
    durationNote: '奧運與外交場合僅演奏第一段，約 60–90 秒；全曲共四段，極少完整演唱。',
    verses: [
      {
        label: '第一段（國際標準）',
        official: true,
        original: 'O say can you see, by the dawn\'s early light,\nWhat so proudly we hailed at the twilight\'s last gleaming,\nWhose broad stripes and bright stars through the perilous fight,\nO\'er the ramparts we watched, were so gallantly streaming?\nAnd the rocket\'s red glare, the bombs bursting in air,\nGave proof through the night that our flag was still there;\nO say does that star-spangled banner yet wave\nO\'er the land of the free and the home of the brave?',
        zh: '你可看見，在黎明前那道曙光，\n我們曾在暮色中驕傲迎向的，\n那面在危險戰鬥中、條紋寬闊、星光明亮、\n在堡壘上我們注視、英勇飄揚的旗？\n火箭的紅光、空中綻放的炮火，\n徹夜證明我們的旗幟仍在；\n那面星條旗是否仍在迎風飄揚，\n在那自由者的土地、勇敢者的家鄉？',
      },
      {
        label: '第二段',
        official: false,
        original: 'On the shore dimly seen through the mists of the deep,\nWhere the foe\'s haughty host in dread silence reposes,\nWhat is that which the breeze, o\'er the towering steep,\nAs it fitfully blows, half conceals, half discloses?\nNow it catches the gleam of the morning\'s first beam,\nIn full glory reflected now shines in the stream:\n\'Tis the star-spangled banner, O long may it wave\nO\'er the land of the free and the home of the brave!',
        zh: '在深海的霧中隱約可見的海岸，\n敵軍傲慢的陣營靜默駐紮；\n那陣風吹過高聳的崖壁，\n時隱時現的是什麼？\n如今它迎向晨光的第一道閃爍，\n在溪流中映出全然的榮光：\n那是星條旗，願它長久飄揚，\n在那自由者的土地、勇敢者的家鄉！',
      },
      {
        label: '第三段',
        official: false,
        original: 'And where is that band who so vauntingly swore\nThat the havoc of war and the battle\'s confusion,\nA home and a country should leave us no more!\nTheir blood has washed out their foul footsteps\' pollution.\nNo refuge could save the hireling and slave\nFrom the terror of flight, or the gloom of the grave:\nAnd the star-spangled banner in triumph doth wave,\nO\'er the land of the free and the home of the brave!',
        zh: '那支曾誇口說\n戰爭與混亂\n將奪走我們家園與祖國的隊伍在哪裡！\n他們的血洗淨了汙穢的足跡。\n傭兵與奴隸無從逃脫，\n無論是驚恐的逃亡或墳墓的陰暗：\n星條旗在凱旋中飄揚，\n在那自由者的土地、勇敢者的家鄉！',
      },
      {
        label: '第四段',
        official: false,
        original: 'O thus be it ever, when freemen shall stand\nBetween their loved home and the war\'s desolation!\nBlest with vict\'ry and peace, may the heav\'n-rescued land\nPraise the Power that hath made and preserved us a nation.\nThen conquer we must, when our cause it is just,\nAnd this be our motto: "In God is our trust."\nAnd the star-spangled banner in triumph shall wave\nO\'er the land of the free and the home of the brave!',
        zh: '願自由人永遠如此，\n守護摯愛的家園免於戰禍！\n蒙勝利與和平之佑，願這受上天拯救的土地\n讚美創造並保全我們國家的力量。\n正義之時我們必勝，\n我們的格言是：「我們信靠上帝。」\n星條旗將在凱旋中飄揚，\n在那自由者的土地、勇敢者的家鄉！',
      },
    ],
  },
  jpn: {
    anthem: '君が代',
    anthemOriginal: 'Kimigayo',
    lang: 'ja',
    durationSec: 45,
    durationNote: '僅一節歌詞，國際場合通常完整演奏，約 45 秒。',
    verses: [
      {
        label: '全文（國際標準）',
        official: true,
        original: '君が代は\n千代に八千代に\nさざれ石の\n巌となりて\n苔のむすまで',
        zh: '天皇御世\n千代八千代\n直到細石\n長成巖山\n長滿青苔',
      },
    ],
  },
  kor: {
    anthem: '애국가',
    anthemOriginal: '愛國歌',
    lang: 'ko',
    durationSec: 60,
    durationNote: '國際場合通常僅演奏第一段（含副歌前段），約 60 秒；全曲四段。',
    verses: [
      {
        label: '第一段（國際標準）',
        official: true,
        original: '동해 물과 백두산이 마르고 닳도록\n하느님이 보우하사 우리나라 만세',
        zh: '直到東海之水與白頭山乾涸磨損，\n上天保佑我們國家萬歲。',
      },
      {
        label: '第二段',
        official: false,
        original: '남산 위에 저 소나무 철갑을 두른 듯\n바람 서리 불변함은 우리 기상일세',
        zh: '南山上那松樹如披鐵甲，\n風霜不變正是我們氣象。',
      },
      {
        label: '第三段',
        official: false,
        original: '가을 하늘 공활한데 높고 구름 없이\n밝은 달은 우리 가슴 일편단심일세',
        zh: '秋日晴空高遠無雲，\n明月照我們一片丹心。',
      },
      {
        label: '第四段',
        official: false,
        original: '이 기상과 이 맘으로 충성을 다하여\n괴로우나 즐거우나 나라 사랑하세',
        zh: '以此氣象與此心意盡忠，\n無論苦樂都愛國家。',
      },
    ],
  },
  gbr: {
    anthem: 'God Save the King',
    anthemOriginal: '天佑國王',
    lang: 'en',
    durationSec: 60,
    durationNote: '通常僅演唱第一段，約 45–60 秒；全曲共三或四段。',
    verses: [
      {
        label: '第一段（國際標準）',
        official: true,
        original: 'God save our gracious King,\nLong live our noble King,\nGod save the King!\nSend him victorious,\nHappy and glorious,\nLong to reign over us,\nGod save the King!',
        zh: '天佑我們仁慈的國王，\n願尊貴的國王萬歲，\n天佑國王！\n賜他勝利，\n快樂而光榮，\n長久統治我們，\n天佑國王！',
      },
      {
        label: '第二段',
        official: false,
        original: 'Thy choicest gifts in store\nOn him be pleased to pour;\nLong may he reign!\nMay he defend our laws,\nAnd ever give us cause\nTo sing with heart and voice\nGod save the King!',
        zh: '願你將最豐厚的恩賜\n傾注於他；\n願他長久統治！\n願他保衛我們的法律，\n並永遠給我們理由\n以心與聲高唱：\n天佑國王！',
      },
    ],
  },
  fra: {
    anthem: 'La Marseillaise',
    anthemOriginal: '馬賽曲',
    lang: 'fr',
    durationSec: 80,
    durationNote: '國際場合通常僅第一段加副歌，約 60–90 秒；全曲共七段。',
    verses: [
      {
        label: '第一段＋副歌（國際標準）',
        official: true,
        original: 'Allons enfants de la Patrie,\nLe jour de gloire est arrivé!\nContre nous de la tyrannie\nL\'étendard sanglant est levé,\nEntendez-vous dans les campagnes\nMugir ces féroces soldats?\nIls viennent jusque dans vos bras\nÉgorger vos fils, vos compagnes!\n\nAux armes, citoyens,\nFormez vos bataillons,\nMarchons, marchons!\nQu\'un sang impur\nAbreuve nos sillons!',
        zh: '來吧，祖國的兒女，\n榮耀之日已來臨！\n對抗暴政的染血旗幟\n已經升起，\n你們可聽見鄉間\n那些兇猛士兵的咆哮？\n他們來到你們懷中\n屠殺你們的兒子與伴侶！\n\n拿起武器，公民們，\n組成你們的隊伍，\n前進，前進！\n讓不純之血\n浸染我們的溝壢！',
      },
    ],
  },
  deu: {
    anthem: 'Deutschlandlied',
    anthemOriginal: '德意志之歌',
    lang: 'de',
    durationSec: 70,
    durationNote: '1991 年起國際場合僅演唱第三段，約 60–75 秒；第一、二段因歷史因素不再官方使用。',
    verses: [
      {
        label: '第三段（國際標準）',
        official: true,
        original: 'Einigkeit und Recht und Freiheit\nFür das deutsche Vaterland!\nDanach lasst uns alle streben\nBrüderlich mit Herz und Hand!\nEinigkeit und Recht und Freiheit\nSind des Glückes Unterpfand;\nBlüh\' im Glanze dieses Glückes,\nBlühe, deutsches Vaterland!',
        zh: '統一、正義與自由，\n為了德意志祖國！\n讓我們齊心為此奮鬥，\n兄弟般心手相連！\n統一、正義與自由，\n是幸福的保障；\n在這幸福的榮光中綻放，\n綻放吧，德意志祖國！',
      },
      {
        label: '第一段（歷史用語，非現行官方）',
        official: false,
        original: 'Deutschland, Deutschland über alles,\nÜber alles in der Welt,\nWenn es stets zu Schutz und Trutze\nBrüderlich zusammenhält...',
        zh: '（現行官方典禮不使用。）',
      },
    ],
  },
  chn: {
    anthem: '義勇軍進行曲',
    anthemOriginal: '義勇軍進行曲',
    lang: 'zh-Hans',
    durationSec: 46,
    durationNote: '僅一段歌詞，國際場合通常完整演奏，約 46 秒。',
    verses: [
      {
        label: '全文（國際標準）',
        official: true,
        original: '起來！不願做奴隸的人們！\n把我們的血肉，築成我們新的長城！\n中華民族到了最危險的時候，\n每個人被迫著發出最後的吼聲。\n起來！起來！起來！\n我們萬眾一心，\n冒著敵人的炮火，前進！\n冒著敵人的炮火，前進！\n前進！前進！進！',
        zh: '起來！不願做奴隸的人們！\n把我們的血肉，築成我們新的長城！\n中華民族到了最危險的時候，\n每個人被迫著發出最後的吼聲。\n起來！起來！起來！\n我們萬眾一心，\n冒著敵人的炮火，前進！\n冒著敵人的炮火，前進！\n前進！前進！進！',
      },
    ],
  },
  rus: {
    anthem: 'Государственный гимн России',
    anthemOriginal: '俄羅斯聯邦國歌',
    lang: 'ru',
    durationSec: 90,
    durationNote: '國際場合通常僅第一段，約 60–90 秒；全曲共四段。',
    verses: [
      {
        label: '第一段（國際標準）',
        official: true,
        original: 'Россия — священная наша держава,\nРоссия — любимая наша страна.\nМогучая воля, великая слава —\nТвоё достоянье на все времена!',
        zh: '俄羅斯——我們神聖的強國，\n俄羅斯——我們摯愛的祖國。\n強大的意志、偉大的榮光——\n你的尊嚴永世長存！',
      },
      {
        label: '第二段',
        official: false,
        original: 'Славься, Отечество наше свободное,\nБратских народов союз вековой,\nПредками данная мудрость народная!\nСлавься, страна! Мы гордимся тобой!',
        zh: '榮耀吧，我們自由的祖國，\n兄弟民族永恆的聯盟，\n祖先賜予的人民智慧！\n榮耀吧，祖國！我們以你為傲！',
      },
    ],
  },
  aus: {
    anthem: 'Advance Australia Fair',
    anthemOriginal: '前進，美麗的澳洲',
    lang: 'en',
    durationSec: 75,
    durationNote: '國際場合通常僅第一段，約 60–75 秒；全曲共四段。',
    verses: [
      {
        label: '第一段（國際標準）',
        official: true,
        original: 'Australians all let us rejoice,\nFor we are young and free;\nWe\'ve golden soil and wealth for toil;\nOur home is girt by sea;\nOur land abounds in nature\'s gifts\nOf beauty rich and rare;\nIn history\'s page, let every stage\nAdvance Australia Fair.',
        zh: '澳洲人讓我們一起歡慶，\n因為我們年輕而自由；\n我們有金色土地、勞動財富；\n家園四面環海；\n土地豐饒自然饋贈，\n美麗而珍稀；\n在歷史每一頁，讓每個階段\n都推進美麗的澳洲。',
      },
    ],
  },
  can: {
    anthem: 'O Canada',
    anthemOriginal: '啊，加拿大',
    lang: 'fr-en',
    durationSec: 60,
    durationNote: '國際場合通常僅第一段（英法各一版），約 55–65 秒。',
    verses: [
      {
        label: '第一段（英語，國際標準）',
        official: true,
        original: 'O Canada! Our home and native land!\nTrue patriot love in all of us command.\nWith glowing hearts we see thee rise,\nThe True North strong and free!',
        zh: '啊，加拿大！我們的家園與故土！\n真正的愛國之心指引我們眾人。\n我們熱血沸騰看見你崛起，\n真實的北方強大且自由！',
      },
      {
        label: '第一段（法語）',
        official: false,
        original: 'Ô Canada! Terre de nos aïeux,\nTon front est ceint de fleurons glorieux!\nCar ton bras sait porter l\'épée,\nIl sait porter la croix!',
        zh: '啊，加拿大！祖先的土地，\n你的額上環繞光榮的花環！\n因為你的臂膀能持劍，\n也能持十字架！',
      },
    ],
  },
  sgp: {
    anthem: 'Majulah Singapura',
    anthemOriginal: '前進吧，新加坡',
    lang: 'ms',
    durationSec: 55,
    durationNote: '僅一段歌詞，國際場合完整演奏，約 55 秒。',
    verses: [
      {
        label: '全文（國際標準）',
        official: true,
        original: 'Mari kita rakyat Singapura\nSama-sama menuju bahagia\nCita-cita kita yang mulia\nBerjaya Singapura\nMarilah kita bersatu\nDengan semangat yang baru\nSemua kita berseru\nMajulah Singapura\nMajulah Singapura\nMajulah Singapura',
        zh: '來吧，新加坡人民，\n一起邁向幸福；\n我們高貴的理想，\n新加坡成功。\n讓我們團結，\n以新的精神，\n眾人齊聲高呼：\n前進吧，新加坡！\n前進吧，新加坡！\n前進吧，新加坡！',
      },
    ],
  },
  tha: {
    anthem: 'Phleng Chat',
    anthemOriginal: '泰國國歌',
    lang: 'th',
    durationSec: 65,
    durationNote: '通常僅第一段，約 60–70 秒；全曲共六段。',
    verses: [
      {
        label: '第一段（國際標準）',
        official: true,
        original: 'ประเทศไทยเป็นประเทศไทย\nทุกส่วนในประเทศไทย\nรวมกันเป็นประเทศไทย\nไทยเป็นหนึ่งเดียว',
        zh: '泰國就是泰國，\n泰國的每一部分，\n合起來就是泰國，\n泰國團結如一。',
      },
    ],
  },
  vnm: {
    anthem: 'Tiến Quân Ca',
    anthemOriginal: '進軍歌',
    lang: 'vi',
    durationSec: 55,
    durationNote: '僅兩段，國際場合通常僅第一段，約 50–60 秒。',
    verses: [
      {
        label: '第一段（國際標準）',
        official: true,
        original: 'Đoàn quân Việt Nam đi\nChung lòng đấu tranh\nPhá tan cơn vũ tuyết\nNhà thù xâm lược\nĐồng lòng cùng đi hy sinh\nTiếc gì thân sống\nThân vì đại nghĩa\nQuê hương nguy biến\nCòn lớn hơn nữa\nQuyết cùng đương đầu\nLàm tan cường quyền',
        zh: '越南軍隊前進，\n同心戰鬥，\n擊破暴風雪，\n侵略的敵人。\n同心赴死\n無惜身軀，\n為大義\n與危難的祖國，\n還有更大的理想，\n決心對抗\n擊潰強權。',
      },
      {
        label: '第二段',
        official: false,
        original: 'Đoàn quân Việt Nam đi\nSao vàng cộng hòa\nCùng chung sứ quyết\nĐem gươm bau ra\nĐoàn quân tiến lên\nSúng nòng sáng loa\nCùng vì nhân dân\nKhông có gì khó\nThân vì đại nghĩa\nQuyết chí hy sinh\nQuyết thay non sông\nLao sơn nước chảy',
        zh: '越南軍隊前進，\n金星共和國，\n齊心決意\n拔劍出鞘，\n軍隊向前，\n槍炮轟鳴，\n為人民\n沒有什麼困難，\n為大義\n決心犧牲，\n願以山河\n換山河長流。',
      },
    ],
  },
  phl: {
    anthem: 'Lupang Hinirang',
    anthemOriginal: '選擇的土地',
    lang: 'fil',
    durationSec: 60,
    durationNote: '國際場合通常僅第一段（西班牙語原詞或他加祿語版），約 55–65 秒。',
    verses: [
      {
        label: '第一段（國際標準）',
        official: true,
        original: 'Perla ng silanganan,\nAlab ng pag-ibig,\nSa dibdib mo\'y buhay\nLupang hinirang.',
        zh: '東方之珠，\n愛之火焰，\n在你胸中活著，\n選擇的土地。',
      },
    ],
  },
  ind: {
    anthem: 'Jana Gana Mana',
    anthemOriginal: '人民的意志',
    lang: 'bn',
    durationSec: 52,
    durationNote: '僅一段，國際場合完整演奏，約 52 秒。',
    verses: [
      {
        label: '全文（國際標準）',
        official: true,
        original: 'Jana-gana-mana-adhinayaka jaya he\nBharata-bhagya-vidhata\nPanjaba-Sindhu-Gujarata-Maratha\nDravida-Utkala-Banga\nVindhya-Himachala-Yamuna-Ganga\nUchchala-Jaladhi-taranga\nTava shubha name jage,\nTava shubha asisa mage,\nGahe tava jaya-gatha,\nJana-gana-mangala-dayaka jaya he\nBharata-bhagya-vidhata\nJaya he, jaya he, jaya he,\nJaya jaya jaya, jaya he!',
        zh: '你是印度億萬人民的統治者，勝利啊，\n命運的賜予者。\n旁遮普、信德、古吉拉特、馬拉塔，\n德拉維達、奧裡薩、孟加拉，\n溫迪亞、喜馬拉雅、亞穆納、恆河，\n洶湧的海洋波浪，\n你的美名喚醒，\n你的祝福祈求，\n高唱你的勝利之歌，\n你是印度億萬人民的賜福者，勝利啊，\n命運的賜予者。\n勝利啊，勝利啊，勝利啊，\n勝利勝利勝利，勝利啊！',
      },
    ],
  },
  bra: {
    anthem: 'Hino Nacional Brasileiro',
    anthemOriginal: '巴西國歌',
    lang: 'pt',
    durationSec: 90,
    durationNote: '國際場合通常僅第一段加副歌，約 60–90 秒；全曲共兩段。',
    verses: [
      {
        label: '第一段＋副歌（國際標準）',
        official: true,
        original: 'Ouviram do Ipiranga as margens plácidas\nDe um povo heroico o brado retumbante,\nE o sol da liberdade, em raios fúlgidos,\nBrilhou no céu da Pátria nesse instante.\n\nSe o penhor dessa igualdade\nConseguimos conquistar com braço forte,\nEm teu seio, ó liberdade,\nDesafia o nosso peito a própria morte!',
        zh: '聽見伊匹蘭加河畔平靜的岸邊，\n英雄人民響亮的吶喊，\n自由之陽以燦爛光芒\n在那一刻照耀祖國天空。\n\n若我們以強健臂膀\n贏得這平等的保證，\n在你懷中，啊自由，\n縱使死亡也無法使我們退縮！',
      },
    ],
  },
  esp: {
    anthem: 'La Marcha Real',
    anthemOriginal: '皇家進行曲',
    lang: '—',
    durationSec: 52,
    durationNote: '國際場合通常僅演奏無詞版，約 45–60 秒；2018 年後有官方歌詞但奧運等仍多為純器樂。',
    verses: [
      {
        label: '國際標準（器樂）',
        official: true,
        original: '（無固定歌詞；國際場合為純器樂演奏。）',
        zh: '西班牙國歌在奧運、外交等場合通常不唱詞，僅演奏旋律約 52 秒。',
      },
    ],
  },
  lbn: {
    anthem: 'Kulluna lil-watan',
    anthemOriginal: 'كلنا للوطن',
    lang: 'ar',
    durationSec: 60,
    durationNote: '國際場合通常僅演奏第一段，約 45–90 秒。',
    verses: [
      {
        label: '第一段（國際標準）',
        official: true,
        original: 'كلنا للوطن للعلى للعلم\nملء عين الزّمن سيفنا والقلم\nسهلنا والجبل منبت للرجال\nقولنا والعمل في سبيل الكمال',
        zh: '我們全都為了國家、為了榮耀、為了國旗，\n歲月的眼睛裡充滿了我們的寶劍與文藝，\n我們的平原與高山都生長著男子漢，\n我們的語言與行動都是為了邁向完美。',
      },
    ],
  },
  prk: {
    anthem: '愛國歌',
    anthemOriginal: '애국가',
    lang: 'ko',
    durationSec: 60,
    durationNote: '國際場合通常僅演奏第一段，約 45–90 秒。',
    verses: [
      {
        label: '第一段（國際標準）',
        official: true,
        original: '아침은 빛나라 이 강산\n은금에 자원도 가득한\n이 세상 아름다운 내 조국\n반만년 오랜 력사에\n찬란한 문화로 자라난\n슬기론 인민의 이 영광\n몸과 맘 다 바쳐 이 조선\n길이 받드세',
        zh: '朝日鮮明的此江山，\n金銀寶藏多麼豐富，\n這世上錦繡河山我祖國，\n有五千年悠久歷史。\n燦爛的文化薰陶\n智慧的人民光榮無上，\n讓我們獻出身心永遠\n保衛我朝鮮。',
      },
    ],
  },
};
