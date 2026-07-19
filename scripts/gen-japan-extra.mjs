/**
 * Generate japan-theme-extra.js + japan/css/extra-pack.css for 20 Japan themes.
 * Run: node scripts/gen-japan-extra.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

/** Verified Unsplash IDs only — dead IDs remapped so regen never ships 404s. */
const OK_IDS = new Set([
  'photo-1524413840807-0c3cb6fa808d',
  'photo-1493976040374-85c8e12f0c0e',
  'photo-1506905925346-21bda4d32df4',
  'photo-1464822759023-fed622ff2c3b',
  'photo-1480796927426-f609979314bd',
  'photo-1519681393784-d120267933ba',
  'photo-1522383225653-ed111181a951',
  'photo-1545569341-9eb8b30979d9',
  'photo-1551632811-561732d1e306',
  'photo-1528360983277-13d401cdc186',
  'photo-1536098561742-ca998e48cbcc',
  'photo-1507400492013-162706c8c05e',
  'photo-1441974231531-c6227db76b6e',
  'photo-1514933651103-005eec06c04b',
  'photo-1544025162-d76694265947',
  'photo-1507525428034-b723cf961d3e',
  'photo-1540555700478-4be289fbecef',
  'photo-1582719478250-c89cae4dc85b',
  'photo-1488477181946-6428a0291777',
  'photo-1563805042-7684c019e1cb',
  'photo-1441986300917-64674bd600d8',
  'photo-1474487548417-781cb71495f3',
  'photo-1515562141207-7a88fb7ce338',
  'photo-1540959733332-eab4deabeeaf',
  'photo-1569718212165-3a8278d5f624',
  'photo-1527477396000-e27163b481c2',
  // samurai-armor — thematic matches (do not rotate away)
  'photo-1688327044868-e358b414039c',
  'photo-1770501818941-f0c57d37f3e9',
  'photo-1671015522549-e7aa41ded44f',
  'photo-1514134177582-fec97bd28b7b',
  'photo-1761696154159-e11471e7a6b9',
  'photo-1668261200632-1d781ab9e0c4',
]);

const DEAD_TO_OK = {
  'photo-1490806843957-31f4c9a91c08': 'photo-1524413840807-0c3cb6fa808d',
  'photo-1578271887310-b8c4f8f4f3a2': 'photo-1506905925346-21bda4d32df4',
  'photo-1516590894069-4824b915a0ce': 'photo-1522383225653-ed111181a951',
  'photo-1528164344705-60119840c9ad': 'photo-1493976040374-85c8e12f0c0e',
  'photo-1513519245088-0e12902e35ca': 'photo-1545569341-9eb8b30979d9',
  'photo-1519915028120-7bacadd80ef4': 'photo-1488477181946-6428a0291777',
  'photo-1509365465985-25d749b87a51': 'photo-1563805042-7684c019e1cb',
  'photo-1558171813-4c0880cf7374': 'photo-1441986300917-64674bd600d8',
  'photo-1505118380757-91f785d40c37': 'photo-1507525428034-b723cf961d3e',
  'photo-1478436127897-769af28a8df0': 'photo-1545569341-9eb8b30979d9',
};

const OK_LIST = [...OK_IDS];
let okRotate = 0;

const u = (id) => {
  let resolved = DEAD_TO_OK[id] || id;
  if (!OK_IDS.has(resolved)) {
    resolved = OK_LIST[okRotate++ % OK_LIST.length];
  }
  return `https://images.unsplash.com/${resolved}?auto=format&fit=crop&w=640&q=70`;
};

/** @type {Array<object>} */
const THEMES = [
  {
    id: 'fuji-views',
    eyebrow: 'Mount Fuji',
    lead: '從河口湖到本栖湖，追尋富士山在四季與雲海中的十二種表情。',
    accent: 'linear-gradient(180deg,#e8f4fc 0%,#f7fbfe 45%,#eef6fb 100%)',
    heroTint: 'rgba(56,120,180,.18)',
    interaction: 'season',
    seasons: [
      { key: 'all', label: '全季' },
      { key: 'spring', label: '春' },
      { key: 'summer', label: '夏' },
      { key: 'autumn', label: '秋' },
      { key: 'winter', label: '冬' },
    ],
    sectionTitle: '富士眺望手帳',
    sectionIntro: '挑選季節，展開對應的經典眺望點與拍攝節奏。',
    items: [
      { season: 'spring', title: '河口湖逆富士', place: '山梨 · 河口湖', desc: '櫻花與湖面倒影同框，清晨無風時最容易遇見「逆さ富士」。建議日出前後半小時抵達湖畔。', img: u('photo-1490806843957-31f4c9a91c08', '河口湖與富士山'), alt: '河口湖畔的富士山倒影' },
      { season: 'spring', title: '三分一湧水櫻徑', place: '山梨 · 富士河口湖', desc: '清澈湧水與染井吉野並陳，適合慢走而非趕拍。週末午前人潮較多，可往支線小徑分散。', img: u('photo-1524413840807-0c3cb6fa808d', '櫻花小徑'), alt: '粉櫻花道' },
      { season: 'summer', title: '本栖湖澄清景色', place: '山梨 · 本栖湖', desc: '千円紙幣上的富士取景靈感地之一。夏季湖面澄淨，午後易起雲，早晨光線更穩定。', img: u('photo-1578271887310-b8c4f8f4f3a2', '本栖湖富士'), alt: '本栖湖與富士山' },
      { season: 'summer', title: '新倉山公園五重塔', place: '山梨 · 下吉田', desc: '櫻季最有名，夏季綠意同樣清新。需步行登山，帶好飲水；拍攝時避開欄杆中心擁擠點。', img: u('photo-1493976040374-85c8e12f0c0e', '五重塔與富士'), alt: '新倉山公園眺望' },
      { season: 'autumn', title: '紅葉台展望', place: '靜岡 · 富士宮週邊', desc: '秋色層次與富士同框，午後側光讓山體更立體。留意登山步道落葉濕滑。', img: u('photo-1506905925346-21bda4d32df4', '秋色山景'), alt: '秋天山景與遠峰' },
      { season: 'autumn', title: '精進湖晨霧', place: '山梨 · 精進湖', desc: '晨霧散去瞬間山容顯影，氣氛靜謐。住宿湖畔可爭取第一道光線。', img: u('photo-1464822759023-fed622ff2c3b', '晨霧湖泊'), alt: '晨霧中的湖泊與山' },
      { season: 'winter', title: '雪笠富士', place: '山梨 · 各眺望點', desc: '冠雪富士最具符號感。路面易結冰，行車預留時間；日落粉橘色餘暉值得久留。', img: u('photo-1480796927426-f609979314bd', '冬夜街景山影'), alt: '冬日山景氛圍' },
      { season: 'winter', title: '山中湖結冰季', place: '山梨 · 山中湖', desc: '嚴冬湖面結冰時風景遼闊，務必遵守現地安全告示，勿擅自走入冰面。', img: u('photo-1519681393784-d120267933ba', '雪山星空'), alt: '雪山與夜空' },
    ],
  },
  {
    id: 'sakura-front',
    eyebrow: 'Sakura Front',
    lead: '沿著櫻前線北上，把名所、品種與禮儀收進一本可滑動的賞櫻地圖。',
    accent: 'linear-gradient(180deg,#fff5f8 0%,#fffafb 50%,#fde8ef 100%)',
    heroTint: 'rgba(232,120,160,.2)',
    interaction: 'season',
    seasons: [
      { key: 'all', label: '全部' },
      { key: 'early', label: '早櫻' },
      { key: 'peak', label: '滿開' },
      { key: 'late', label: '晚櫻' },
    ],
    sectionTitle: '櫻名所圖鑑',
    sectionIntro: '依開花節奏瀏覽，出發前再對照當年氣象預測。',
    items: [
      { season: 'early', title: '河津櫻早春', place: '靜岡 · 河津', desc: '河津櫻色澤偏濃、花期較早，常成為關東櫻前線起點話題。沿河步道適合半日散步。', img: u('photo-1522383225653-ed111181a951', '粉櫻'), alt: '盛開的櫻花' },
      { season: 'early', title: '熱海梅園銜接', place: '靜岡 · 熱海', desc: '梅與早櫻季節交疊，溫泉街可順遊。週末列車較擠，建議提早出發。', img: u('photo-1516590894069-4824b915a0ce', '梅花'), alt: '早春梅花' },
      { season: 'peak', title: '上野公園花見', place: '東京 · 上野', desc: '都市花見經典，人潮與野餐文化並存。遵守垃圾帶回與禁酒規定，尊重場地。', img: u('photo-1493976040374-85c8e12f0c0e', '公園櫻花'), alt: '公園櫻花大道' },
      { season: 'peak', title: '哲學之道', place: '京都 · 左京', desc: '水路與染井吉野並行，晨間光線柔和。滿開週末極擠，可改走支線小路。', img: u('photo-1524413840807-0c3cb6fa808d', '哲學之道'), alt: '京都櫻花小徑' },
      { season: 'peak', title: '弘前公園城跡', place: '青森 · 弘前', desc: '東北滿開往往晚於關東，城跡內品種豐富。夜間點燈檔期值得查官方資訊。', img: u('photo-1464822759023-fed622ff2c3b', '城與櫻'), alt: '城堡與櫻花' },
      { season: 'late', title: '八重櫻餘韻', place: '各地植物園', desc: '八重櫻花瓣層疊、花期偏晚，適合想避開人潮的旅人。色調偏濃，攝影對比強。', img: u('photo-1490806843957-31f4c9a91c08', '八重櫻'), alt: '層疊的八重櫻' },
      { season: 'late', title: '造幣局通過', place: '大阪 · 造幣局', desc: '限定開放的櫻之通路聞名，需關注每年公告。體驗重在秩序與禮儀。', img: u('photo-1506905925346-21bda4d32df4', '櫻花隧道'), alt: '櫻花隧道' },
    ],
  },
  {
    id: 'momiji-trail',
    eyebrow: 'Momiji Trail',
    lead: '關東到關西的紅葉名所，白天層林與夜間點燈兩種節奏一次收齊。',
    accent: 'linear-gradient(180deg,#fff4e8 0%,#fffaf5 50%,#ffe8d6 100%)',
    heroTint: 'rgba(220,100,40,.18)',
    interaction: 'toggle',
    toggleLabels: { day: '日間層林', night: '夜間點燈' },
    sectionTitle: '紅葉巡禮卡片',
    sectionIntro: '切換日夜氛圍，想像同一場所在不同時段的情緒。',
    items: [
      { mode: 'day', title: '高尾山紅葉步道', place: '東京 · 高尾', desc: '近郊紅葉熱點，纜車與登山並用。平日午前較好走，注意步道落葉濕滑。', img: u('photo-1506905925346-21bda4d32df4', '秋山'), alt: '秋天山林' },
      { mode: 'day', title: '嵐山渡月橋', place: '京都 · 嵐山', desc: '橋面與山色同框，渡船可改視角。週末極熱門，建議早到或改走竹林後山。', img: u('photo-1493976040374-85c8e12f0c0e', '嵐山'), alt: '嵐山秋色' },
      { mode: 'day', title: '香嵐溪河谷', place: '愛知 · 豐田', desc: '河谷兩岸楓紅綿延，巴士接駁需抓時間。中午光線硬，側光時刻更有層次。', img: u('photo-1464822759023-fed622ff2c3b', '河谷紅葉'), alt: '河谷紅葉' },
      { mode: 'night', title: '永觀堂夜楓', place: '京都 · 東山', desc: '夜間點燈把紅葉染成舞台光。入場採時段制，請查當季資訊並保持安靜。', img: u('photo-1480796927426-f609979314bd', '夜景燈火'), alt: '夜間燈火與樹木' },
      { mode: 'night', title: '清水寺舞台光', place: '京都 · 清水', desc: '點燈期人潮密集，動線單向為主。以感受氛圍為先，強求完美構圖容易挫折。', img: u('photo-1524413840807-0c3cb6fa808d', '清水寺氛圍'), alt: '寺院夜色氛圍' },
      { mode: 'night', title: '河口湖楓廊', place: '山梨 · 河口湖', desc: '湖畔點燈與富士季節重疊時特別夢幻。保暖與回程交通要先規劃。', img: u('photo-1519681393784-d120267933ba', '湖夜'), alt: '夜間湖泊' },
    ],
  },
  {
    id: 'matsuri-calendar',
    eyebrow: 'Matsuri Year',
    lead: '神轎、太鼓與花火——把一年祭典收進可點選的月曆牆。',
    accent: 'linear-gradient(180deg,#fff8ef 0%,#fffdf9 50%,#ffe9d2 100%)',
    heroTint: 'rgba(200,60,40,.15)',
    interaction: 'month',
    sectionTitle: '祭典月曆',
    sectionIntro: '點月份看代表祭典；實際日程每年微調，出發前請核對官方公告。',
    items: [
      { month: 1, title: '奈良若草山燒', place: '奈良', desc: '年初以山火儀式迎接，遠望火線爬升。觀覽需遵守管制區，勿靠近危險範圍。', img: u('photo-1545569341-9eb8b30979d9', '夜火'), alt: '夜間火光儀式' },
      { month: 2, title: '札幌雪祭', place: '北海道 · 札幌', desc: '雪雕與燈光裝置的冬季盛事。保暖分層穿著，夜場人潮更大。', img: u('photo-1551632811-561732d1e306', '雪祭'), alt: '雪地燈飾' },
      { month: 4, title: '高山祭春之部', place: '岐阜 · 高山', desc: '華麗屋台與人偶機關聞名。町內巷弄窄，建議以步行節奏遊覽。', img: u('photo-1528164344705-60119840c9ad', '祭典屋台'), alt: '祭典花車' },
      { month: 5, title: '神田祭', place: '東京 · 神田', desc: '江戶三大祭之一，神轎過街氣勢滂薄。沿途店家多，記得補水與防曬。', img: u('photo-1528360983277-13d401cdc186', '神轎'), alt: '街頭神轎' },
      { month: 7, title: '祇園祭', place: '京都', desc: '七月長跑的京都象徵祭。山鉾巡行與宵山各有看點，住宿宜早訂。', img: u('photo-1493976040374-85c8e12f0c0e', '祇園'), alt: '京都祭典街道' },
      { month: 8, title: '青森睡魔祭', place: '青森', desc: '巨大人形燈籠夜間遊行，視覺衝擊極強。外圍攤販多，現金備用較安心。', img: u('photo-1536098561742-ca998e48cbcc', '燈籠祭'), alt: '巨大燈籠遊行' },
      { month: 10, title: '二木山祭', place: '大阪', desc: '秋季屋台祭，木造車輪轟隆過街。觀禮位置有限，早到佔位。', img: u('photo-1480796927426-f609979314bd', '夜祭'), alt: '夜間祭典' },
      { month: 12, title: '秩父夜祭', place: '埼玉 · 秩父', desc: '冬夜屋台與花火同場，被譽為關東冬祭代表。禦寒裝備必備。', img: u('photo-1519681393784-d120267933ba', '冬夜花火'), alt: '冬夜花火' },
    ],
  },
  {
    id: 'hanabi-guide',
    eyebrow: 'Hanabi Nights',
    lead: '大輪煙火如何選席次、何時進場、怎麼拍——把名場地變成可比較的夜空圖鑑。',
    accent: 'linear-gradient(180deg,#eef3ff 0%,#f7f9ff 50%,#e8eeff 100%)',
    heroTint: 'rgba(90,120,220,.16)',
    interaction: 'toggle',
    toggleLabels: { day: '場地資訊', night: '夜空想像' },
    sectionTitle: '花火名所',
    sectionIntro: '切換模式閱讀攻略或沉浸夜空氛圍；實際日程請查主辦單位。',
    items: [
      { mode: 'day', title: '隅田川花火', place: '東京', desc: '都市河岸經典，兩會場交替施放。早佔位置與離場動線同樣重要。', img: u('photo-1540959733332-eab4deabeeaf', '都市煙火'), alt: '城市煙火' },
      { mode: 'day', title: '長岡花火', place: '新潟 · 長岡', desc: '復興之火與三尺玉聞名全國。新幹線早訂，現場以耐心排隊為主。', img: u('photo-1519681393784-d120267933ba', '大輪煙火'), alt: '大型煙火' },
      { mode: 'day', title: '大曲全國花火', place: '秋田 · 大曲', desc: '競賽性質強，作品完成度高。住宿一票難求，可住鄰近都市接駁。', img: u('photo-1507400492013-162706c8c05e', '競賽煙火'), alt: '煙火競賽夜空' },
      { mode: 'night', title: '琵琶湖花火想像', place: '滋賀', desc: '湖面反射讓煙火多一層鏡像。風向影響煙霧，上風處觀感更清。', img: u('photo-1507525428034-b723cf961d3e', '湖上煙火'), alt: '湖面煙火' },
      { mode: 'night', title: '熱海海上花火', place: '靜岡 · 熱海', desc: '海岸線施放，溫泉旅可順遊。列车末班時間要先查。', img: u('photo-1480796927426-f609979314bd', '海上煙火'), alt: '海岸煙火' },
      { mode: 'night', title: '攝影小提醒', place: '通用', desc: '腳架禮讓走道、勿阻擋他人視線。手機夜景模式夠用，閃光燈對現場無用。', img: u('photo-1519681393784-d120267933ba', '夜空'), alt: '星空夜景' },
    ],
  },
  {
    id: 'torii-tunnel',
    eyebrow: 'Torii Tunnel',
    lead: '朱紅鳥居重疊成隧道——用捲動與聚光，走進伏見稻荷式的視覺迷宮。',
    accent: 'linear-gradient(180deg,#fff5f2 0%,#fffaf8 50%,#ffe8e0 100%)',
    heroTint: 'rgba(220,70,50,.14)',
    interaction: 'spotlight',
    sectionTitle: '鳥居與參道',
    sectionIntro: '移動游標讓聚光跟著走；觸控裝置改以輕點卡片閱讀。',
    items: [
      { title: '伏見稻荷千本鳥居', place: '京都', desc: '山坡上無數鳥居連成走廊，是日本最具辨識度的參道風景之一。早到可避開擁擠。', img: u('photo-1545569341-9eb8b30979d9', '千本鳥居'), alt: '千本鳥居隧道' },
      { title: '鳥居的顏色與木理', place: '工藝筆記', desc: '朱色不僅美觀，也與防腐塗裝傳統有關。近看木理與接合，能讀出維護痕跡。', img: u('photo-1493976040374-85c8e12f0c0e', '朱色鳥居'), alt: '朱色鳥居特寫' },
      { title: '奧社奉拜所', place: '京都 · 稻荷山', desc: '登上山腰後視野開闊，人群相對分散。帶水、穿防滑鞋，量力而止。', img: u('photo-1524413840807-0c3cb6fa808d', '神社山道'), alt: '神社山道' },
      { title: '狐狸供品與繪馬', place: '信仰細節', desc: '稻荷信仰與狐狸使者緊密相連。觀察供品與繪馬文字，能感受祈願的日常生活感。', img: u('photo-1545569341-9eb8b30979d9', '狐狸石像'), alt: '狐狸石像' },
      { title: '攝影禮儀', place: '提醒', desc: '窄道勿停太久、勿阻擋參拜動線。三腳架在高峰時段常不適合。', img: u('photo-1480796927426-f609979314bd', '參道'), alt: '夜間參道' },
      { title: '地方小社鳥居', place: '各地', desc: '小鎮單座鳥居同樣動人。少人處更能聽見風與樹葉，體驗截然不同。', img: u('photo-1524413840807-0c3cb6fa808d', '小鎮鳥居'), alt: '小鎮鳥居' },
    ],
  },
  {
    id: 'karesansui',
    eyebrow: 'Karesansui',
    lead: '白砂、苔蘚與石組——枯山水把「水」留給想像，把心靜下來。',
    accent: 'linear-gradient(180deg,#f3f6f2 0%,#fafbf9 50%,#e8eee6 100%)',
    heroTint: 'rgba(80,110,70,.12)',
    interaction: 'tags',
    tagKey: 'style',
    tags: [
      { key: 'all', label: '全部' },
      { key: 'sand', label: '砂紋' },
      { key: 'moss', label: '苔庭' },
      { key: 'stone', label: '石組' },
    ],
    sectionTitle: '庭園卡片',
    sectionIntro: '依要素篩選，讀懂枯山水的構圖語言。',
    items: [
      { style: 'sand', title: '龍安寺石庭', place: '京都', desc: '十五石的經典配置，觀者位置改變可見組合。保持靜默，是最好的參觀方式。', img: u('photo-1528164344705-60119840c9ad', '石庭'), alt: '枯山水石庭' },
      { style: 'sand', title: '砂紋如水', place: '美學筆記', desc: '耙出的紋樣暗示波浪與流動。每次整地都是修行般的重複勞動。', img: u('photo-1506905925346-21bda4d32df4', '砂紋'), alt: '白砂紋樣' },
      { style: 'moss', title: '苔寺氛圍', place: '京都 · 西芳寺意象', desc: '苔蘚需要濕度與時間。參訪常需預約，請尊重寺院規定。', img: u('photo-1464822759023-fed622ff2c3b', '苔蘚'), alt: '綠色苔蘚庭園' },
      { style: 'moss', title: '綠意層次', place: '觀察', desc: '不同苔種色澤深淺形成柔和漸層，下雨後顏色更飽滿。', img: u('photo-1441974231531-c6227db76b6e', '森林綠'), alt: '潮濕綠意' },
      { style: 'stone', title: '銀閣寺向月台', place: '京都', desc: '砂台與山林借景並置，晝夜感受不同。秋季人潮多，晨間更宜。', img: u('photo-1493976040374-85c8e12f0c0e', '銀閣寺'), alt: '庭園砂台' },
      { style: 'stone', title: '石組力量線', place: '構圖', desc: '主石、副石與留白形成張力。拍照時可試著對齊視線動線。', img: u('photo-1519681393784-d120267933ba', '岩石'), alt: '庭園岩石' },
    ],
  },
  {
    id: 'kenrokuen',
    eyebrow: 'Kenrokuen',
    lead: '兼六園之名來自「宏大・幽邃・人力・蒼古・水泉・眺望」六勝——金澤的庭園教科書。',
    accent: 'linear-gradient(180deg,#eef6f4 0%,#f7fbfa 50%,#e5f0ec 100%)',
    heroTint: 'rgba(40,120,100,.14)',
    interaction: 'season',
    seasons: [
      { key: 'all', label: '四季' },
      { key: 'spring', label: '春' },
      { key: 'summer', label: '夏' },
      { key: 'autumn', label: '秋' },
      { key: 'winter', label: '冬' },
    ],
    sectionTitle: '兼六園與城下',
    sectionIntro: '四季各有名所，雪吊是冬季最強烈的視覺記憶。',
    items: [
      { season: 'spring', title: '徽軫燈籠', place: '兼六園', desc: '園內象徵景觀之一，常與霞ヶ池同框。櫻季與新綠交接時色彩柔和。', img: u('photo-1528164344705-60119840c9ad', '日式庭園燈籠'), alt: '庭園石燈籠' },
      { season: 'spring', title: '茶屋街午後', place: '金澤 · 東茶屋', desc: '金箔甜點與格子門窗構成散步節奏。巷弄窄，適合慢走。', img: u('photo-1493976040374-85c8e12f0c0e', '茶屋街'), alt: '金澤茶屋街' },
      { season: 'summer', title: '霞ヶ池綠意', place: '兼六園', desc: '水面映樹影，蟬聲與遮陽同樣重要。中午曝曬強，走樹蔭動線。', img: u('photo-1441974231531-c6227db76b6e', '綠意池畔'), alt: '夏日池畔' },
      { season: 'autumn', title: '紅葉與唐崎松', place: '兼六園', desc: '秋色襯托老松姿態。點燈檔期請查官方，夜間氣氛完全不同。', img: u('photo-1506905925346-21bda4d32df4', '秋園'), alt: '秋天庭園' },
      { season: 'winter', title: '雪吊風景', place: '兼六園', desc: '繩索傘狀護枝的雪吊，是北陸庭園智慧。雪景日需防滑，動作放慢。', img: u('photo-1551632811-561732d1e306', '雪中庭園'), alt: '雪中庭園' },
      { season: 'winter', title: '金澤城石川門', place: '金澤城公園', desc: '與兼六園相鄰，白漆藏與石垣對照分明。可安排同日半日券動線。', img: u('photo-1545569341-9eb8b30979d9', '城堡門'), alt: '城堡城門' },
    ],
  },
  {
    id: 'otaru-canal',
    eyebrow: 'Otaru Canal',
    lead: '石造倉庫、運河燈火與玻璃工藝——小樽把時間調成慢速。',
    accent: 'linear-gradient(180deg,#e9eef5 0%,#f5f7fb 50%,#dde6f2 100%)',
    heroTint: 'rgba(60,90,140,.16)',
    interaction: 'toggle',
    toggleLabels: { day: '日間倉庫', night: '運河夜景' },
    sectionTitle: '運河散步',
    sectionIntro: '日夜切換，感受同一段運河的溫差與光色。',
    items: [
      { mode: 'day', title: '北運河倉庫群', place: '小樽', desc: '紅磚與石造倉庫並列，現多轉為餐廳與工房。午後光線適合拍立面質感。', img: u('photo-1528360983277-13d401cdc186', '倉庫街'), alt: '石造倉庫' },
      { mode: 'day', title: '玻璃工房街道', place: '小樽', desc: '透明與彩玻璃飾品琳瑯滿目。選購時注意托運與保溫包裝。', img: u('photo-1513519245088-0e12902e35ca', '玻璃'), alt: '彩色玻璃' },
      { mode: 'day', title: '堺町通散步', place: '小樽', desc: '音樂盒與甜點店聚集。坡道多，穿好走的鞋。', img: u('photo-1493976040374-85c8e12f0c0e', '小樽街'), alt: '小樽街道' },
      { mode: 'night', title: '運河瓦斯燈', place: '小樽運河', desc: '夜燈倒映水面，是北海道經典夜景之一。冬季極冷，手套帽子必備。', img: u('photo-1480796927426-f609979314bd', '運河夜燈'), alt: '運河夜景' },
      { mode: 'night', title: '啤酒廠晚餐', place: '小樽', desc: '石造建築內的餐飲體驗，把工業遺構變成聚餐場。假日建議訂位。', img: u('photo-1514933651103-005eec06c04b', '餐廳室內'), alt: '溫暖餐廳內景' },
      { mode: 'night', title: '車站前歸途', place: '小樽駅', desc: '夜遊結束後列車班次需預留緩衝。雪季路面滑，離開運河後放慢腳步。', img: u('photo-1545569341-9eb8b30979d9', '夜駅'), alt: '夜晚車站氛圍' },
    ],
  },
  {
    id: 'nagoya-castle',
    eyebrow: 'Nagoya Castle',
    lead: '金鯱閃閃發亮的名古屋城，串起城下町、復元工程與尾張物語。',
    accent: 'linear-gradient(180deg,#fff7e8 0%,#fffdf8 50%,#f5e6c8 100%)',
    heroTint: 'rgba(200,150,40,.18)',
    interaction: 'tags',
    tagKey: 'cat',
    tags: [
      { key: 'all', label: '全部' },
      { key: 'castle', label: '城郭' },
      { key: 'legend', label: '傳說' },
      { key: 'town', label: '城下' },
    ],
    sectionTitle: '金鯱與城下',
    sectionIntro: '從建築到傳說到散步動線，認識尾張的中心象徵。',
    items: [
      { cat: 'castle', title: '天守與金鯱', place: '名古屋城', desc: '金鯱是名古屋最醒目的符號。天守整備狀態請以現場公告為準，外觀拍點仍豐富。', img: u('photo-1545569341-9eb8b30979d9', '天守'), alt: '日式城堡天守' },
      { cat: 'castle', title: '本丸御殿彩繪', place: '名古屋城', desc: '復元御殿的障壁畫絢麗，參觀需遵守動線與禁止事項。', img: u('photo-1528164344705-60119840c9ad', '御殿'), alt: '御殿建築' },
      { cat: 'legend', title: '金鯱傳說', place: '物語', desc: '關於金鯱的民間故事與城主軼事流傳甚廣，讓地標多了敘事厚度。', img: u('photo-1519681393784-d120267933ba', '金光'), alt: '金色光澤意象' },
      { cat: 'legend', title: '清洲越與城下', place: '歷史', desc: '城下町遷移塑造了名古屋都市骨格。走一圈能感覺棋盤式街廓。', img: u('photo-1528360983277-13d401cdc186', '城下街'), alt: '城下町街道' },
      { cat: 'town', title: '榮與地下街', place: '名古屋', desc: '現代消費核心與城區互補。雨天可轉入地下街續走。', img: u('photo-1480796927426-f609979314bd', '都市夜'), alt: '都市夜景' },
      { cat: 'town', title: '味噌勝田尾張味', place: '美食延伸', desc: '城遊結束後以味噌豬排或鰻魚收尾，把地標旅行變成味覺記憶。', img: u('photo-1544025162-d76694265947', '定食'), alt: '日式定食' },
    ],
  },
  {
    id: 'onsen-kyo',
    eyebrow: 'Onsen Towns',
    lead: '湯煙、木造旅館與石畳坂道——依泉質與氣氛挑選下一座溫泉郷。',
    accent: 'linear-gradient(180deg,#f8efe8 0%,#fffaf7 50%,#f0e0d4 100%)',
    heroTint: 'rgba(180,90,50,.14)',
    interaction: 'tags',
    tagKey: 'type',
    tags: [
      { key: 'all', label: '全部' },
      { key: 'sulfur', label: '硫黃' },
      { key: 'alkaline', label: '鹼性' },
      { key: 'chloride', label: '氯化物' },
      { key: 'town', label: '街景' },
    ],
    sectionTitle: '溫泉郷地圖',
    sectionIntro: '標籤幫你對應泉質與旅行節奏；入浴前請讀館內指示。',
    items: [
      { type: 'sulfur', title: '草津湯畑', place: '群馬 · 草津', desc: '乳白湯煙與湯畑是符號景觀。泉質刺激感明顯，皮膚敏感者先諮詢。', img: u('photo-1545569341-9eb8b30979d9', '湯畑'), alt: '溫泉湯畑' },
      { type: 'sulfur', title: '箱根強羅', place: '神奈川 · 箱根', desc: '交通便利的近郊溫泉圈，可搭配美術館。週末易滿，住宿早訂。', img: u('photo-1528164344705-60119840c9ad', '箱根'), alt: '箱根山區' },
      { type: 'alkaline', title: '由布院金鱗湖', place: '大分 · 由布院', desc: '晨霧湖面與精品小店並存。過度商業化區可往安靜巷弄逃。', img: u('photo-1493976040374-85c8e12f0c0e', '由布院'), alt: '由布院風景' },
      { type: 'chloride', title: '熱海海邊湯', place: '靜岡 · 熱海', desc: '海風與溫泉共存，夜間散步舒適。適合不想深入山區的旅人。', img: u('photo-1507525428034-b723cf961d3e', '海岸'), alt: '海岸溫泉地' },
      { type: 'town', title: '銀山溫泉木造街', place: '山形', desc: '大正浪漫木造旅館並列，夜燈如時光旅行。冬季雪景夢幻但交通挑戰高。', img: u('photo-1480796927426-f609979314bd', '銀山溫泉'), alt: '木造溫泉街夜景' },
      { type: 'town', title: '入浴禮儀速記', place: '通用', desc: '先洗淨再入湯、毛巾不入池、安靜為上。刺青規定因館而異，出發前確認。', img: u('photo-1540555700478-4be289fbecef', '溫泉氛圍'), alt: '溫泉放鬆氛圍' },
    ],
  },
  {
    id: 'wagashi-scroll',
    eyebrow: 'Wagashi Seasons',
    lead: '練切、羊羹與水信玄餅——和菓子把季節做成可以吃的繪卷。',
    accent: 'linear-gradient(180deg,#fff9f2 0%,#fffefb 50%,#f7ebe0 100%)',
    heroTint: 'rgba(200,120,80,.12)',
    interaction: 'season',
    seasons: [
      { key: 'all', label: '四季' },
      { key: 'spring', label: '春' },
      { key: 'summer', label: '夏' },
      { key: 'autumn', label: '秋' },
      { key: 'winter', label: '冬' },
    ],
    sectionTitle: '和菓子繪卷',
    sectionIntro: '依季節欣賞主題造型與茶席搭配靈感。',
    items: [
      { season: 'spring', title: '櫻餅與道明寺', place: '春之菓子', desc: '櫻葉香氣是春的記憶開關。關東關西皮餡傳統不同，值得兩邊都嚐。', img: u('photo-1582719478250-c89cae4dc85b', '和菓子'), alt: '粉色和菓子' },
      { season: 'spring', title: '煉切花瓣', place: '茶席', desc: '練切可塑形為花朵，色彩層次細膩。拍照後再吃，是旅行 ethiquette。', img: u('photo-1519915028120-7bacadd80ef4', '精緻甜點'), alt: '精緻日式甜點' },
      { season: 'summer', title: '水信玄餅', place: '山梨意象', desc: '透明涼感象徵夏日。需盡快食用，溫度管理是關鍵。', img: u('photo-1488477181946-6428a0291777', '透明甜點'), alt: '透明果凍甜點' },
      { season: 'summer', title: '葛菓子涼點', place: '夏', desc: '葛的口感清、味道淡，適合熱天收尾。配薄茶更合拍。', img: u('photo-1563805042-7684c019e1cb', '涼點'), alt: '夏季涼點' },
      { season: 'autumn', title: '栗蒸羊羹', place: '秋', desc: '栗子與黑糖香氣穩重，是秋日伴手禮常客。切面紋理很上相。', img: u('photo-1509365465985-25d749b87a51', '羊羹'), alt: '羊羹切片' },
      { season: 'winter', title: '雪景色菓子', place: '冬', desc: '白色與銀杏黃常出現在冬之主題。溫室茶屋是最佳賞味場。', img: u('photo-1551632811-561732d1e306', '冬日甜'), alt: '冬日甜點氛圍' },
    ],
  },
  {
    id: 'aizome-kimono',
    eyebrow: 'Indigo & Kimono',
    lead: '藍染紋樣與和服場合——用色票與圖鑑讀懂穿著文化的細節。',
    accent: 'linear-gradient(180deg,#e8eef8 0%,#f5f7fc 50%,#d9e3f5 100%)',
    heroTint: 'rgba(40,70,140,.16)',
    interaction: 'tags',
    tagKey: 'tone',
    tags: [
      { key: 'all', label: '全部' },
      { key: 'indigo', label: '藍染' },
      { key: 'pattern', label: '紋樣' },
      { key: 'wear', label: '場合' },
    ],
    sectionTitle: '藍與紋',
    sectionIntro: '篩選主題，認識顏色、圖案與穿著情境。',
    items: [
      { tone: 'indigo', title: '正藍層次', place: '染色', desc: '藍染經反覆浸染形成深淺。同一塊布也能呈現漸層故事。', img: u('photo-1558171813-4c0880cf7374', '藍染布'), alt: '藍染布料' },
      { tone: 'indigo', title: '工房體驗意象', place: '職人', desc: '手作體驗需預約。染液特性與季節有關，成品色會隨時間沉著。', img: u('photo-1441986300917-64674bd600d8', '布料工房'), alt: '布料工房' },
      { tone: 'pattern', title: '青海波', place: '紋樣', desc: '波浪連續紋象徵平安與延續，常見於和服內襯與小物。', img: u('photo-1513519245088-0e12902e35ca', '波浪紋'), alt: '波浪紋樣' },
      { tone: 'pattern', title: '麻の葉', place: '紋樣', desc: '麻葉幾何充滿成長寓意，童裝與現代設計都愛用。', img: u('photo-1558171813-4c0880cf7374', '幾何紋'), alt: '幾何織紋' },
      { tone: 'wear', title: '訪問著場合', place: '禮儀', desc: '略正式場合常見選擇。腰帶與髮型會大幅改變整體印象。', img: u('photo-1528164344705-60119840c9ad', '和服'), alt: '和服穿著' },
      { tone: 'wear', title: '浴衣夏夜', place: '夏祭', desc: '浴衣輕便親民，花火與祭典的標準配備。穿著以安全行走為先。', img: u('photo-1493976040374-85c8e12f0c0e', '浴衣'), alt: '夏日浴衣' },
    ],
  },
  {
    id: 'railway-views',
    eyebrow: 'Rail Scenery',
    lead: '車窗是移動的畫框——精選名路線與車窗景色，讓旅途本身成為目的。',
    accent: 'linear-gradient(180deg,#eef3f8 0%,#f8fafc 50%,#e4ebf3 100%)',
    heroTint: 'rgba(50,90,130,.14)',
    interaction: 'tags',
    tagKey: 'line',
    tags: [
      { key: 'all', label: '全部' },
      { key: 'coast', label: '海岸' },
      { key: 'mountain', label: '山岳' },
      { key: 'urban', label: '都市' },
    ],
    sectionTitle: '車窗圖鑑',
    sectionIntro: '依風景類型挑選下一段想坐的路線。',
    items: [
      { line: 'coast', title: '伊豆急行海岸線', place: '靜岡', desc: '車窗幾乎貼海，轉彎時海平線大幅度擺動。右側座位常較受歡迎。', img: u('photo-1507525428034-b723cf961d3e', '海岸列車'), alt: '海岸線風景' },
      { line: 'coast', title: '五能線海崖', place: '青森 · 秋田', desc: '日本海斷崖與列車並行，天氣晴朗時層次極佳。風大日拍照注意安全。', img: u('photo-1464822759023-fed622ff2c3b', '海崖'), alt: '海崖鐵路' },
      { line: 'mountain', title: '阿里山不是這裡', place: '長野 · 高山線意象', desc: '登山鐵道把海拔變成風景時間軸。季節更迭明顯，秋冬座位需求高。', img: u('photo-1506905925346-21bda4d32df4', '山岳鐵道'), alt: '山岳鐵道' },
      { line: 'mountain', title: '黑部峽谷トロッコ', place: '富山', desc: '開放式車廂聽得到河聲。雨天會停駛，出發前查運行狀況。', img: u('photo-1474487548417-781cb71495f3', '峽谷列車'), alt: '峽谷中的列車' },
      { line: 'urban', title: '山手線窗景切片', place: '東京', desc: '都市密度本身是風景。夜晩窗玻璃反射形成雙重影像，很有電影感。', img: u('photo-1480796927426-f609979314bd', '都市列車'), alt: '都市夜列車' },
      { line: 'urban', title: '京都嵐電', place: '京都', desc: '路面電車穿越住宅與神社門前，速度慢、細節多。適合短程散心。', img: u('photo-1524413840807-0c3cb6fa808d', '嵐電'), alt: '路面電車' },
    ],
  },
  {
    id: 'ama-shima',
    eyebrow: 'Ama & Shima',
    lead: '海女、真珠與英虞灣——伊勢志摩把海洋生計變成可走讀的文化風景。',
    accent: 'linear-gradient(180deg,#e6f4f6 0%,#f5fbfc 50%,#d9eef1 100%)',
    heroTint: 'rgba(30,140,150,.14)',
    interaction: 'tags',
    tagKey: 'topic',
    tags: [
      { key: 'all', label: '全部' },
      { key: 'ama', label: '海女' },
      { key: 'pearl', label: '真珠' },
      { key: 'bay', label: '灣景' },
    ],
    sectionTitle: '志摩海誌',
    sectionIntro: '從人、工藝到風景，認識這片海的生活紋理。',
    items: [
      { topic: 'ama', title: '海女小屋物語', place: '鳥羽 · 志摩', desc: '海女文化是活的遺產，參觀設施可聽到口述歷史。尊重現場，勿干擾作業。', img: u('photo-1507525428034-b723cf961d3e', '海岸'), alt: '志摩海岸' },
      { topic: 'ama', title: '潮間帶節奏', place: '生計', desc: '潮汐決定工作窗口。旅行者也能用潮汐表安排看海時間。', img: u('photo-1505118380757-91f785d40c37', '潮汐'), alt: '潮間帶' },
      { topic: 'pearl', title: '御木本真珠島', place: '鳥羽', desc: '現代養殖真珠發源故事在此被展示。工藝演示讓「光澤」變得可理解。', img: u('photo-1515562141207-7a88fb7ce338', '珍珠'), alt: '珍珠飾品' },
      { topic: 'pearl', title: '光澤與層次', place: '鑑賞', desc: '真珠價值來自層厚、光澤與瑕疵控制。親手比較能建立眼力。', img: u('photo-1513519245088-0e12902e35ca', '珠光'), alt: '珠光細節' },
      { topic: 'bay', title: '英虞灣展望', place: '志摩', desc: 'リアス式海岸曲線優美，夕刻顏色變化快。展望台常有多層平台。', img: u('photo-1464822759023-fed622ff2c3b', '海灣'), alt: '曲折海灣' },
      { topic: 'bay', title: '伊勢神宮延伸', place: '伊勢', desc: '參拜與海遊可組一日線。神宮森林與海風形成情緒對比。', img: u('photo-1528164344705-60119840c9ad', '神社森林'), alt: '神社森林' },
    ],
  },
  {
    id: 'ghost-stations',
    eyebrow: 'Ghost Stations',
    lead: '霧中月台與廢線故事——秘境駅的浪漫，建立在安全與倫理之上。',
    accent: 'linear-gradient(180deg,#dfe3e8 0%,#f0f2f4 50%,#cfd5dc 100%)',
    heroTint: 'rgba(70,80,90,.18)',
    interaction: 'tags',
    tagKey: 'mood',
    tags: [
      { key: 'all', label: '全部' },
      { key: 'mist', label: '霧駅' },
      { key: 'coast', label: '海岸' },
      { key: 'ethics', label: '倫理' },
    ],
    sectionTitle: '秘境駅手帳',
    sectionIntro: '欣賞氛圍，同時把安全與對地方的尊重放在第一位。',
    items: [
      { mood: 'mist', title: '霧氣月台意象', place: '山間線', desc: '晨霧讓月台像舞台。實際秘境駅班次少，誤車代價高，時刻表要印下來。', img: u('photo-1474487548417-781cb71495f3', '霧中月台'), alt: '霧中鐵路月台' },
      { mood: 'mist', title: '無人駅的聲音', place: '觀察', desc: '風聲、蟲鳴與遠方列車預告，是都市沒有的時間感。', img: u('photo-1464822759023-fed622ff2c3b', '空駅'), alt: '安靜的空曠車站' },
      { mood: 'coast', title: '海岸臨時駅故事', place: '各地', desc: '有些駅因觀光季節增停。確認當季運行，勿假設全年皆同。', img: u('photo-1507525428034-b723cf961d3e', '海岸駅'), alt: '海岸旁的車站' },
      { mood: 'coast', title: '風化木造站房', place: '建築', desc: '老站房木理與油漆剝落很上相，但私有區域勿擅入。', img: u('photo-1528360983277-13d401cdc186', '木造站'), alt: '木造車站' },
      { mood: 'ethics', title: '攝影倫理', place: '提醒', desc: '不阻擋列車、不進入軌道、不干擾居民生活。美照不值得冒險。', img: u('photo-1519681393784-d120267933ba', '軌道遠景'), alt: '遠望軌道' },
      { mood: 'ethics', title: '資訊核實', place: '提醒', desc: '網路傳說常過時。以鐵路公司最新資訊為準，遇到可疑狀況立即離開。', img: u('photo-1480796927426-f609979314bd', '夜駅'), alt: '夜晚車站' },
    ],
  },
  {
    id: 'inari-fox',
    eyebrow: 'Inari Fox',
    lead: '狐狸使者、稻荷社與朱色信仰——把可愛石像讀成一套圖像語言。',
    accent: 'linear-gradient(180deg,#fff1eb 0%,#fffaf8 50%,#ffe4d6 100%)',
    heroTint: 'rgba(220,80,40,.14)',
    interaction: 'tags',
    tagKey: 'form',
    tags: [
      { key: 'all', label: '全部' },
      { key: 'statue', label: '石像' },
      { key: 'shrine', label: '社殿' },
      { key: 'symbol', label: '象徵' },
    ],
    sectionTitle: '狐狸圖鑑',
    sectionIntro: '造型差異背後，是地方信仰與工匠手感。',
    items: [
      { form: 'statue', title: '持鍵狐狸', place: '常見造型', desc: '口銜鑰匙象徵倉庫與財富守護。細節越看越有個性。', img: u('photo-1545569341-9eb8b30979d9', '狐狸石像'), alt: '狐狸石像' },
      { form: 'statue', title: '親子狐', place: '社境', desc: '成對配置常見，姿態左右呼應。拍照時可對齊對稱軸。', img: u('photo-1528164344705-60119840c9ad', '成對狐狸'), alt: '成對狐狸像' },
      { form: 'shrine', title: '稻荷社本殿', place: '各地', desc: '朱色與白壁對比鮮明。參拜仍遵循二禮二拍手一禮基本禮。', img: u('photo-1493976040374-85c8e12f0c0e', '稻荷社'), alt: '稻荷神社' },
      { form: 'shrine', title: '末社群集', place: '山坡', desc: '小山坡上密集小社，形成獨特視覺密度。走路看路，勿踩踏祭品。', img: u('photo-1478436127897-769af28a8df0', '鳥居群'), alt: '鳥居與社群' },
      { form: 'symbol', title: '油揚與供品', place: '民俗', desc: '油揚與狐狸的聯想深入飲食文化。閱讀供品能理解生活化信仰。', img: u('photo-1509042239860-f550ce710b93', '供品意象'), alt: '傳統供品意象' },
      { form: 'symbol', title: '商業神與願', place: '現代', desc: '許多商店仍奉稻荷。城市裡的小小神棚，是另一種日本風景。', img: u('photo-1480796927426-f609979314bd', '街角神社'), alt: '街角神社' },
    ],
  },
  {
    id: 'samurai-armor',
    eyebrow: 'Samurai Armor',
    lead: '甲冑、刀裝與家紋——用熱點式圖鑑拆解武士裝備的華麗與功能。',
    accent: 'linear-gradient(180deg,#f4efe6 0%,#fbf8f2 50%,#ebe2d3 100%)',
    heroTint: 'rgba(120,80,40,.14)',
    interaction: 'tags',
    tagKey: 'part',
    tags: [
      { key: 'all', label: '全部' },
      { key: 'armor', label: '甲冑' },
      { key: 'blade', label: '刀裝' },
      { key: 'crest', label: '家紋' },
    ],
    sectionTitle: '甲冑拆解',
    sectionIntro: '分類瀏覽，把博物館展櫃變成可理解的結構。',
    items: [
      { part: 'armor', title: '胴丸與板甲', place: '防護', desc: '甲冑要在防護與活動間取得平衡。漆與編織繩同時是結構也是裝飾。', img: u('photo-1688327044868-e358b414039c'), alt: '完整武士甲冑展示' },
      { part: 'armor', title: '盔與前立', place: '視覺', desc: '前立決定戰場辨識度，也是家族美學宣言。博物館燈光下特別戲劇。', img: u('photo-1770501818941-f0c57d37f3e9'), alt: '武士頭盔與前立' },
      { part: 'blade', title: '打刀姿態', place: '刀劍', desc: '刀身曲線與刃文是鑑賞核心。展場多為刀裝完整呈現。', img: u('photo-1671015522549-e7aa41ded44f'), alt: '日本刀刀身展示' },
      { part: 'blade', title: '鍔與柄卷', place: '刀裝', desc: '小零件藏大工藝。金屬鍔的鏤空常是微型風景畫。', img: u('photo-1514134177582-fec97bd28b7b'), alt: '刀鍔與柄卷細節' },
      { part: 'crest', title: '家紋識別', place: '符號', desc: '前立、奇異盔飾與家紋都是戰場辨識符號。學會看紋與飾，等於多懂一層身分敘事。', img: u('photo-1761696154159-e11471e7a6b9'), alt: '奇異前立頭盔飾' },
      { part: 'crest', title: '展示倫理', place: '參觀', desc: '武器展區勿觸摸、勿用閃光。解說牌讀完再拍照，體驗更完整。', img: u('photo-1668261200632-1d781ab9e0c4'), alt: '博物館甲冑展櫃' },
    ],
  },
  {
    id: 'ukiyo-e-now',
    eyebrow: 'Ukiyo-e ↔ Now',
    lead: '把浮世繪名所與今日街景疊在一起——拖動滑桿，看見時間的層次。',
    accent: 'linear-gradient(180deg,#f7f1e8 0%,#fcf9f4 50%,#efe6d8 100%)',
    heroTint: 'rgba(160,100,50,.12)',
    interaction: 'compare',
    sectionTitle: '古今對照手帳',
    sectionIntro: '先用滑桿感受技法與現實的落差，再讀卡片理解作品背景。',
    items: [
      { title: '神奈川沖浪裏意象', place: '葛飾北齋', desc: '巨浪構圖影響全球視覺文化。今日海岸線雖變，動力感依舊可在現場想像。', img: u('photo-1505118380757-91f785d40c37', '海浪'), alt: '洶湧海浪' },
      { title: '東海道驛站遺韻', place: '広重系譜', desc: '驛站旅情是浮世繪常見主題。現代國道旁仍找得到地名連續性。', img: u('photo-1528360983277-13d401cdc186', '驛站街'), alt: '舊街道' },
      { title: '江戶橋邊人群', place: '都市', desc: '畫中擁擠橋面對應今日人流。比較的是密度與服裝，而非建築複製。', img: u('photo-1480796927426-f609979314bd', '橋與人'), alt: '橋上人群' },
      { title: '名所繪的旅行功能', place: '文化', desc: '浮世繪曾是旅行媒體。今天我們用相機與地圖，欲望卻相似。', img: u('photo-1493976040374-85c8e12f0c0e', '名所'), alt: '名所風景' },
      { title: '顏料與印刷', place: '工藝', desc: '多版套色成就漸層天空。美術館常展示版木與流程，值得細看。', img: u('photo-1513519245088-0e12902e35ca', '版畫'), alt: '版畫工藝' },
      { title: '現代致敬景點', place: '打卡', desc: '許多城市設置對照解說牌。找到角度後，古今會在取景器裡重疊。', img: u('photo-1524413840807-0c3cb6fa808d', '對照街景'), alt: '現代街景' },
    ],
  },
  {
    id: 'kabukicho-neon',
    eyebrow: 'Neon Shinjuku',
    lead: '歌舞伎町的霓虹縱谷——把夜色、安全提醒與鄰近對照寫進可切換的夜遊導覽。',
    accent: 'linear-gradient(180deg,#f7f0ff 0%,#fcf8ff 50%,#efe6ff 100%)',
    heroTint: 'rgba(150,80,200,.14)',
    interaction: 'toggle',
    toggleLabels: { day: '街區導讀', night: '霓虹沉浸' },
    sectionTitle: '新宿夜誌',
    sectionIntro: '欣賞霓虹之美，同時把人身安全與消費清醒放在前面。',
    items: [
      { mode: 'day', title: '歌舞伎町一番街', place: '新宿', desc: '入口拱門是符號。白天較平靜，適合先認路與規劃夜間底線。', img: u('photo-1540959733332-eab4deabeeaf', '新宿街'), alt: '新宿街道' },
      { mode: 'day', title: '鄰近對照：三丁目', place: '新宿', desc: '時尚與書店氣質不同，夜遊可安排情緒轉換路線。', img: u('photo-1528360983277-13d401cdc186', '時尚街'), alt: '時尚街區' },
      { mode: 'day', title: '安全底線', place: '提醒', desc: '拒絕拉客、不跟陌生人進店、同行相伴。娛樂預算預先設上限。', img: u('photo-1480796927426-f609979314bd', '夜街警示'), alt: '夜間街道' },
      { mode: 'night', title: '霓虹層疊', place: '視覺', desc: '招牌重疊形成峽谷光。仰拍注意周邊行人，勿停在車道。', img: u('photo-1540959733332-eab4deabeeaf', '霓虹'), alt: '霓虹燈海' },
      { mode: 'night', title: '東口人群潮', place: '新宿駅', desc: '車站口人潮本身是風景。走固定動線較不易迷失。', img: u('photo-1536098561742-ca998e48cbcc', '車站人群'), alt: '車站夜人潮' },
      { mode: 'night', title: '深夜拉麵作收', place: '胃袋', desc: '以一碗拉麵結束夜遊是經典劇本。選明亮、評價穩定的店較安心。', img: u('photo-1569718212165-3a8278d5f624', '拉麵'), alt: '深夜拉麵' },
    ],
  },
];

function esc(s) {
  return String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n');
}

function itemsToJs(items) {
  return items
    .map((it) => {
      const keys = Object.keys(it)
        .map((k) => `${k}: '${esc(it[k])}'`)
        .join(', ');
      return `{ ${keys} }`;
    })
    .join(',\n      ');
}

function themeToJs(t) {
  const seasons = t.seasons
    ? `seasons: [${t.seasons.map((s) => `{ key: '${s.key}', label: '${esc(s.label)}' }`).join(', ')}],`
    : '';
  const tags = t.tags
    ? `tags: [${t.tags.map((s) => `{ key: '${s.key}', label: '${esc(s.label)}' }`).join(', ')}], tagKey: '${t.tagKey}',`
    : '';
  const toggle = t.toggleLabels
    ? `toggleLabels: { day: '${esc(t.toggleLabels.day)}', night: '${esc(t.toggleLabels.night)}' },`
    : '';
  return `{
    id: '${t.id}',
    eyebrow: '${esc(t.eyebrow)}',
    lead: '${esc(t.lead)}',
    interaction: '${t.interaction}',
    dark: ${t.dark ? 'true' : 'false'},
    ${seasons}
    ${tags}
    ${toggle}
    sectionTitle: '${esc(t.sectionTitle)}',
    sectionIntro: '${esc(t.sectionIntro)}',
    items: [
      ${itemsToJs(t.items)}
    ]
  }`;
}

const js = `/**
 * Extra Japan immersive themes — merges into window.WA_MOUNT_JAPAN_THEME.
 * Auto-generated by scripts/gen-japan-extra.mjs — prefer editing that script.
 */
(function (global) {
  'use strict';

  function assetUrl(rel) {
    try { return new URL(rel, global.location.href).href; } catch (e) { return rel; }
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
  function loadExtraCss() {
    ensureCss('./css/shared.css');
    ensureCss('./css/extra-pack.css');
  }
  function cleanupFns(app) {
    var list = app.__waJpCleanup || [];
    list.forEach(function (fn) { try { fn(); } catch (e) {} });
    app.__waJpCleanup = [];
  }
  function onCleanup(app, fn) {
    if (!app.__waJpCleanup) app.__waJpCleanup = [];
    app.__waJpCleanup.push(fn);
  }
  function escHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  var THEMES = [
${THEMES.map(themeToJs).join(',\n')}
  ];

  function cardHtml(item) {
    return '<article class="jp-x-card">' +
      '<div class="jp-x-card__media"><div class="jp-x-skel" aria-hidden="true"></div>' +
      '<img src="' + escHtml(item.img) + '" alt="' + escHtml(item.alt || item.title) + '" width="640" height="400" loading="lazy" decoding="async"></div>' +
      '<div class="jp-x-card__body"><p class="jp-x-place">' + escHtml(item.place || '') + '</p>' +
      '<h3>' + escHtml(item.title) + '</h3><p>' + escHtml(item.desc) + '</p></div></article>';
  }

  function mountTheme(cfg) {
    return function (app) {
      cleanupFns(app);
      loadExtraCss();
      app.className = 'tool-app theme-' + cfg.id + ' wa-jp-theme' + (cfg.dark ? ' jp-x-dark' : '');

      var controls = '';
      if (cfg.interaction === 'season' && cfg.seasons) {
        controls = '<div class="jp-x-filters" role="group" aria-label="季節篩選" id="jp-x-filters"></div>';
      } else if (cfg.interaction === 'tags' && cfg.tags) {
        controls = '<div class="jp-x-filters" role="group" aria-label="分類篩選" id="jp-x-filters"></div>';
      } else if (cfg.interaction === 'month') {
        controls = '<div class="jp-x-filters jp-x-months" role="group" aria-label="月份" id="jp-x-filters"></div>';
      } else if (cfg.interaction === 'toggle') {
        controls = '<div class="jp-x-toggle-wrap"><button type="button" class="jp-x-toggle" id="jp-x-toggle" aria-pressed="false">' +
          escHtml((cfg.toggleLabels && cfg.toggleLabels.day) || '模式 A') + '</button>' +
          '<span class="jp-x-status" id="jp-x-status" aria-live="polite"></span></div>';
      } else if (cfg.interaction === 'compare') {
        controls = '<div class="jp-x-compare" id="jp-x-compare" style="--cmp:50%" role="img" aria-label="古今對照">' +
          '<div class="jp-x-compare__a" aria-hidden="true"></div><div class="jp-x-compare__b" aria-hidden="true"></div>' +
          '<div class="jp-x-compare__line" aria-hidden="true"></div></div>' +
          '<label class="jp-x-slider-label">對照滑桿 <input type="range" id="jp-x-slider" min="0" max="100" value="50"></label>';
      } else if (cfg.interaction === 'spotlight') {
        controls = '<p class="jp-x-status" id="jp-x-status">移動游標探索鳥居隧道光暈</p>';
      }

      app.innerHTML =
        '<section class="jp-hero"><p class="jp-hero__eyebrow">' + escHtml(cfg.eyebrow) + '</p>' +
        '<p class="jp-hero__lead">' + escHtml(cfg.lead) + '</p></section>' +
        '<section class="jp-section" aria-labelledby="jp-x-h2">' +
        '<h2 id="jp-x-h2">' + escHtml(cfg.sectionTitle) + '</h2>' +
        '<p class="jp-section__intro">' + escHtml(cfg.sectionIntro) + '</p>' +
        controls +
        '<div class="jp-x-grid" id="jp-x-grid"></div></section>';

      var grid = app.querySelector('#jp-x-grid');
      var state = { filter: 'all', night: false, month: 0 };

      function filtered() {
        return cfg.items.filter(function (it) {
          if (cfg.interaction === 'season') {
            return state.filter === 'all' || it.season === state.filter;
          }
          if (cfg.interaction === 'tags') {
            var k = cfg.tagKey;
            return state.filter === 'all' || it[k] === state.filter;
          }
          if (cfg.interaction === 'month') {
            return !state.month || Number(it.month) === state.month;
          }
          if (cfg.interaction === 'toggle') {
            var mode = state.night ? 'night' : 'day';
            return !it.mode || it.mode === mode;
          }
          return true;
        });
      }

      function renderGrid() {
        var list = filtered();
        grid.innerHTML = list.map(cardHtml).join('');
        grid.querySelectorAll('img').forEach(function (img) {
          function done() {
            img.classList.add('is-loaded');
            var m = img.closest('.jp-x-card__media');
            if (m) m.classList.add('is-ready');
          }
          if (img.complete && img.naturalWidth) done();
          else {
            img.addEventListener('load', done, { once: true });
            img.addEventListener('error', done, { once: true });
          }
        });
      }

      if (cfg.interaction === 'season' || cfg.interaction === 'tags') {
        var box = app.querySelector('#jp-x-filters');
        var opts = cfg.interaction === 'season' ? cfg.seasons : cfg.tags;
        opts.forEach(function (o) {
          var b = document.createElement('button');
          b.type = 'button';
          b.className = 'jp-x-chip' + (o.key === 'all' ? ' is-on' : '');
          b.setAttribute('data-v', o.key);
          b.setAttribute('aria-pressed', o.key === 'all' ? 'true' : 'false');
          b.textContent = o.label;
          box.appendChild(b);
        });
        function onChip(e) {
          var b = e.target.closest('.jp-x-chip');
          if (!b || !app.contains(b)) return;
          state.filter = b.getAttribute('data-v');
          box.querySelectorAll('.jp-x-chip').forEach(function (c) {
            var on = c === b;
            c.classList.toggle('is-on', on);
            c.setAttribute('aria-pressed', on ? 'true' : 'false');
          });
          renderGrid();
        }
        box.addEventListener('click', onChip);
        onCleanup(app, function () { box.removeEventListener('click', onChip); });
      }

      if (cfg.interaction === 'month') {
        var mbox = app.querySelector('#jp-x-filters');
        var allBtn = document.createElement('button');
        allBtn.type = 'button';
        allBtn.className = 'jp-x-chip is-on';
        allBtn.setAttribute('data-m', '0');
        allBtn.textContent = '全年';
        mbox.appendChild(allBtn);
        for (var m = 1; m <= 12; m++) {
          var mb = document.createElement('button');
          mb.type = 'button';
          mb.className = 'jp-x-chip';
          mb.setAttribute('data-m', String(m));
          mb.textContent = m + '月';
          mbox.appendChild(mb);
        }
        function onMonth(e) {
          var b = e.target.closest('.jp-x-chip');
          if (!b || !app.contains(b)) return;
          state.month = Number(b.getAttribute('data-m')) || 0;
          mbox.querySelectorAll('.jp-x-chip').forEach(function (c) {
            var on = c === b;
            c.classList.toggle('is-on', on);
          });
          renderGrid();
        }
        mbox.addEventListener('click', onMonth);
        onCleanup(app, function () { mbox.removeEventListener('click', onMonth); });
      }

      if (cfg.interaction === 'toggle') {
        var tbtn = app.querySelector('#jp-x-toggle');
        var status = app.querySelector('#jp-x-status');
        function syncToggle() {
          tbtn.setAttribute('aria-pressed', state.night ? 'true' : 'false');
          tbtn.textContent = state.night
            ? (cfg.toggleLabels && cfg.toggleLabels.night) || '模式 B'
            : (cfg.toggleLabels && cfg.toggleLabels.day) || '模式 A';
          if (status) status.textContent = state.night ? '目前：夜間／模式 B' : '目前：日間／模式 A';
          app.classList.toggle('is-night', state.night);
          renderGrid();
        }
        function onToggle() {
          state.night = !state.night;
          syncToggle();
        }
        tbtn.addEventListener('click', onToggle);
        onCleanup(app, function () { tbtn.removeEventListener('click', onToggle); });
        syncToggle();
        return;
      }

      if (cfg.interaction === 'compare') {
        var cmp = app.querySelector('#jp-x-compare');
        var slider = app.querySelector('#jp-x-slider');
        function onSlide() {
          cmp.style.setProperty('--cmp', slider.value + '%');
        }
        slider.addEventListener('input', onSlide);
        onCleanup(app, function () { slider.removeEventListener('input', onSlide); });
      }

      if (cfg.interaction === 'spotlight') {
        function onMove(e) {
          var r = app.getBoundingClientRect();
          var x = ((e.clientX - r.left) / r.width) * 100;
          var y = ((e.clientY - r.top) / r.height) * 100;
          app.style.setProperty('--spot-x', x + '%');
          app.style.setProperty('--spot-y', y + '%');
        }
        app.addEventListener('pointermove', onMove);
        onCleanup(app, function () { app.removeEventListener('pointermove', onMove); });
      }

      renderGrid();
    };
  }

  var mounts = {};
  THEMES.forEach(function (cfg) {
    mounts[cfg.id] = mountTheme(cfg);
  });
  Object.assign(global.WA_MOUNT_JAPAN_THEME || (global.WA_MOUNT_JAPAN_THEME = {}), mounts);
})(typeof window !== 'undefined' ? window : this);
`;

const cssParts = THEMES.map((t) => {
  const color = t.dark ? 'color:#f2f4f8;' : '';
  return `.tool-app.theme-${t.id}{background:${t.accent};${color}border-radius:12px;padding:1rem 1.1rem 1.5rem}
.theme-${t.id} .jp-hero{background:linear-gradient(135deg,${t.heroTint},transparent 55%)}`;
}).join('\n');

const css = `/* Shared pack for extra Japan themes */
.wa-jp-theme .jp-x-filters{display:flex;flex-wrap:wrap;gap:.45rem;margin:0 0 1.1rem}
.wa-jp-theme .jp-x-chip{border:1px solid rgba(0,0,0,.14);background:rgba(255,255,255,.75);border-radius:999px;padding:.35rem .85rem;font-size:.86rem;cursor:pointer;color:inherit}
.wa-jp-theme .jp-x-chip.is-on{background:#1977cc;border-color:#1977cc;color:#fff;font-weight:600}
.wa-jp-theme.jp-x-dark .jp-x-chip{background:rgba(255,255,255,.08);border-color:rgba(255,255,255,.2);color:#f2f4f8}
.wa-jp-theme.jp-x-dark .jp-x-chip.is-on{background:#7aa7ff;border-color:#7aa7ff;color:#0b1220}
.wa-jp-theme .jp-x-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:1rem}
.wa-jp-theme .jp-x-card{background:rgba(255,255,255,.88);border:1px solid rgba(0,0,0,.08);border-radius:12px;overflow:hidden;box-shadow:0 8px 24px rgba(20,40,80,.06)}
.wa-jp-theme.jp-x-dark .jp-x-card{background:rgba(20,24,36,.72);border-color:rgba(255,255,255,.1)}
.wa-jp-theme .jp-x-card__media{position:relative;aspect-ratio:16/10;background:rgba(0,0,0,.06);overflow:hidden}
.wa-jp-theme .jp-x-skel{position:absolute;inset:0;background:linear-gradient(90deg,transparent,rgba(255,255,255,.35),transparent);animation:jpXSk 1.2s infinite}
@keyframes jpXSk{0%{transform:translateX(-40%)}100%{transform:translateX(40%)}}
.wa-jp-theme .jp-x-card__media img{width:100%;height:100%;object-fit:cover;opacity:0;transition:opacity .35s ease}
.wa-jp-theme .jp-x-card__media img.is-loaded{opacity:1}
.wa-jp-theme .jp-x-card__media.is-ready .jp-x-skel{display:none}
.wa-jp-theme .jp-x-card__body{padding:.85rem 1rem 1.05rem}
.wa-jp-theme .jp-x-place{margin:0 0 .25rem;font-size:.78rem;letter-spacing:.04em;opacity:.65}
.wa-jp-theme .jp-x-card__body h3{margin:0 0 .35rem;font-size:1.05rem;font-family:var(--jp-font-serif)}
.wa-jp-theme .jp-x-card__body p{margin:0;font-size:.92rem;opacity:.88}
.wa-jp-theme .jp-x-toggle-wrap{display:flex;flex-wrap:wrap;align-items:center;gap:.75rem;margin:0 0 1rem}
.wa-jp-theme .jp-x-toggle{border:0;border-radius:999px;background:#1977cc;color:#fff;padding:.55rem 1rem;cursor:pointer;font-weight:600}
.wa-jp-theme .jp-x-status{font-size:.9rem;opacity:.8}
.wa-jp-theme .jp-x-compare{position:relative;height:min(42vw,280px);border-radius:12px;overflow:hidden;margin:0 0 .75rem;border:1px solid rgba(0,0,0,.1)}
.wa-jp-theme .jp-x-compare__a,.wa-jp-theme .jp-x-compare__b{position:absolute;inset:0;background-size:cover;background-position:center}
.wa-jp-theme .jp-x-compare__a{background-image:url('https://images.unsplash.com/photo-1528164344705-60119840c9ad?auto=format&fit=crop&w=1200&q=70')}
.wa-jp-theme .jp-x-compare__b{background-image:url('https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=70');clip-path:inset(0 0 0 var(--cmp,50%))}
.wa-jp-theme .jp-x-compare__line{position:absolute;top:0;bottom:0;left:var(--cmp,50%);width:3px;background:#fff;box-shadow:0 0 0 1px rgba(0,0,0,.25);transform:translateX(-50%)}
.wa-jp-theme .jp-x-slider-label{display:flex;gap:.75rem;align-items:center;margin:0 0 1.25rem;font-size:.9rem}
.wa-jp-theme .jp-x-slider-label input{flex:1}
.tool-app.theme-torii-tunnel{--spot-x:50%;--spot-y:40%}
.theme-torii-tunnel .jp-x-grid{mask-image:radial-gradient(circle at var(--spot-x) var(--spot-y),#000 18%,rgba(0,0,0,.35) 42%,rgba(0,0,0,.12) 70%);-webkit-mask-image:radial-gradient(circle at var(--spot-x) var(--spot-y),#000 18%,rgba(0,0,0,.35) 42%,rgba(0,0,0,.12) 70%)}
.wa-jp-theme.jp-x-dark .jp-hero__lead,.wa-jp-theme.jp-x-dark .jp-section__intro,.wa-jp-theme.jp-x-dark .jp-section h2{color:#f2f4f8}
${cssParts}
`;

fs.writeFileSync(path.join(ROOT, 'assets/js/japan-theme-extra.js'), js, 'utf8');
fs.writeFileSync(path.join(ROOT, 'japan/css/extra-pack.css'), css, 'utf8');
console.log('Wrote japan-theme-extra.js + extra-pack.css for', THEMES.length, 'themes');
console.log(THEMES.map((t) => t.id).join(', '));
