/**
 * Chinese calendar helpers for local "now" panel (農曆、干支、時辰、節氣).
 */
(function () {
  'use strict';

  const STEMS = '甲乙丙丁戊己庚辛壬癸';
  const BRANCHES = '子丑寅卯辰巳午未申酉戌亥';
  const ZODIAC = '鼠牛虎兔龍蛇馬羊猴雞狗豬';
  const SHICHEN = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

  /** 21 世紀節氣 C 值（日），順序：小寒…冬至 */
  const TERM_META = [
    ['小寒', 1, 5.4055], ['大寒', 1, 20.12], ['立春', 2, 3.87], ['雨水', 2, 18.73],
    ['驚蟄', 3, 5.63], ['春分', 3, 20.646], ['清明', 4, 4.81], ['穀雨', 4, 20.1],
    ['立夏', 5, 5.52], ['小滿', 5, 21.04], ['芒種', 6, 5.678], ['夏至', 6, 21.37],
    ['小暑', 7, 7.108], ['大暑', 7, 22.83], ['立秋', 8, 7.5], ['處暑', 8, 23.13],
    ['白露', 9, 7.646], ['秋分', 9, 23.042], ['寒露', 10, 8.318], ['霜降', 10, 23.438],
    ['立冬', 11, 7.438], ['小雪', 11, 22.36], ['大雪', 12, 7.18], ['冬至', 12, 21.94],
  ];

  const DIGIT = ['', '一', '二', '三', '四', '五', '六', '七', '八', '九'];

  function pad2(n) {
    return String(n).padStart(2, '0');
  }

  function lunarDayHan(n) {
    const day = Number(n);
    if (!Number.isFinite(day) || day < 1 || day > 30) return String(n);
    if (day <= 10) return day === 10 ? '初十' : `初${DIGIT[day]}`;
    if (day < 20) return `十${DIGIT[day - 10]}`;
    if (day === 20) return '二十';
    if (day < 30) return `廿${DIGIT[day - 20]}`;
    return '三十';
  }

  function termDay(year, c) {
    const y = year - 2000;
    return Math.floor(0.2422 * y + c - Math.floor(y / 4));
  }

  function buildTermDates(year) {
    return TERM_META.map(([name, month, c]) => ({
      name,
      at: new Date(year, month - 1, termDay(year, c), 12, 0, 0, 0),
    }));
  }

  function solarTermLabel(date) {
    const y = date.getFullYear();
    const list = [
      ...buildTermDates(y - 1).slice(-2),
      ...buildTermDates(y),
      ...buildTermDates(y + 1).slice(0, 2),
    ].sort((a, b) => a.at - b.at);

    let last = null;
    const now = date.getTime();
    for (const item of list) {
      if (item.at.getTime() <= now) last = item;
      else break;
    }
    if (!last) return '—';
    const sameDay = last.at.getFullYear() === date.getFullYear()
      && last.at.getMonth() === date.getMonth()
      && last.at.getDate() === date.getDate();
    return sameDay ? last.name : `${last.name}後`;
  }

  function shichenLabel(hour) {
    const h = Number(hour);
    if (!Number.isFinite(h)) return '—';
    const idx = Math.floor(((h + 1) % 24) / 2);
    return `${SHICHEN[idx]}時`;
  }

  function chineseCalendarParts(date) {
    const parts = new Intl.DateTimeFormat('zh-Hant-u-ca-chinese', {
      relatedYear: 'numeric',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).formatToParts(date);

    const pick = (type) => parts.find((p) => p.type === type)?.value || '';
    const long = new Intl.DateTimeFormat('zh-Hant-u-ca-chinese', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);

    const ganzhiMatch = long.match(/[（(]([甲乙丙丁戊己庚辛壬癸][子丑寅卯辰巳午未申酉戌亥])[）)]/);
    const ganzhi = ganzhiMatch ? ganzhiMatch[1] : '';
    const branch = ganzhi ? ganzhi[1] : '';
    const zodiacIdx = branch ? BRANCHES.indexOf(branch) : -1;

    const relatedYear = pick('relatedYear') || pick('year');
    const monthLabel = pick('month');
    const dayNum = pick('day');

    const monthNumMatch = monthLabel.match(/(?:闰)?(?:正|一|二|三|四|五|六|七|八|九|十|十一|十二|腊)/);
    let monthNum = '';
    if (monthLabel.includes('正')) monthNum = '1';
    else if (monthLabel.includes('腊')) monthNum = '12';
    else {
      const m = monthLabel.match(/([一二三四五六七八九十]+)月/);
      if (m) {
        const map = { 一: 1, 二: 2, 三: 3, 四: 4, 五: 5, 六: 6, 七: 7, 八: 8, 九: 9, 十: 10, 十一: 11, 十二: 12 };
        monthNum = String(map[m[1]] || '');
      }
    }

    return {
      relatedYear,
      monthLabel,
      monthNum,
      dayNum,
      dayHan: lunarDayHan(dayNum),
      ganzhi,
      zodiac: zodiacIdx >= 0 ? `${ZODIAC[zodiacIdx]}年` : '—',
    };
  }

  function formatNowInfo(date) {
    const d = date instanceof Date ? date : new Date(date);
    const cc = chineseCalendarParts(d);

    const time = `${d.getHours()}時 : ${pad2(d.getMinutes())}分 : ${pad2(d.getSeconds())}秒`;
    const gregorian = `${d.getFullYear()}年${pad2(d.getMonth() + 1)}月${pad2(d.getDate())}日`;
    const weekday = new Intl.DateTimeFormat('zh-Hant', { weekday: 'long' }).format(d);
    const lunar = `${cc.relatedYear}年${cc.monthLabel}${cc.dayHan}`;
    const yearLine = cc.ganzhi
      ? `${cc.ganzhi}年${cc.monthNum || ''}月${cc.dayNum}日`.replace(/年月/, '年')
      : `${cc.relatedYear}年${cc.monthNum}月${cc.dayNum}日`;

    return {
      time,
      gregorian,
      weekday,
      lunar,
      yearLine,
      zodiac: cc.zodiac,
      shichen: shichenLabel(d.getHours()),
      solarTerm: solarTermLabel(d),
    };
  }

  window.WA_CHINESE_CALENDAR = {
    formatNowInfo,
    lunarDayHan,
    shichenLabel,
    solarTermLabel,
    chineseCalendarParts,
    buildTermDates,
    termDay,
  };
})();
