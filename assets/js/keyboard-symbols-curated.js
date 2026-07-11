/**
 * 錯對／愛心等分類的策展補充（簡短對照 + 彩色 emoji）。
 */
window.WA_KEYBOARD_SYMBOLS_CURATED = {
  錯對符號: {
    intro: '純文字相容高；彩色 emoji 適合 Markdown／Issue。',
    pairs: [
      { role: '打勾', plain: '✓', emoji: '✅' },
      { role: '打勾', plain: '✔', emoji: '✔️' },
      { role: '打勾', plain: '☑', emoji: '☑️' },
      { role: '打X', plain: '✗', emoji: '❌' },
      { role: '打X', plain: '✘', emoji: '❌' },
      { role: '打X', plain: '☒', emoji: '❎' },
      { role: '打X', plain: '✖', emoji: '✖️' },
    ],
    groups: [
      {
        title: '純文字',
        rows: [
          { label: '打勾', items: ['✓', '✔', '☑', '√'] },
          { label: '打X', items: ['✗', '✘', '☒', '✕', '✖', '×'] },
        ],
      },
      {
        title: '彩色 emoji',
        rows: [
          { label: '打勾', items: ['✅', '✔️', '☑️'] },
          { label: '打X', items: ['❌', '✖️', '❎'] },
          { label: '狀態', items: ['🟢', '🟡', '🔴', '⚠️'] },
        ],
      },
    ],
  },

  愛心符號: {
    pairs: [
      { role: '愛心', plain: '♥', emoji: '❤️' },
      { role: '愛心', plain: '♡', emoji: '💕' },
      { role: '愛心', plain: '❤', emoji: '❤️' },
    ],
    groups: [
      {
        title: '純文字',
        rows: [{ label: '愛心', items: ['♥', '♡', '❤', '❣', '❥'] }],
      },
      {
        title: '彩色 emoji',
        rows: [{ label: '愛心', items: ['❤️', '💕', '💖', '💗', '💘', '💝', '💞', '💔'] }],
      },
    ],
  },

  星星符號: {
    pairs: [
      { role: '星星', plain: '★', emoji: '⭐' },
      { role: '星星', plain: '☆', emoji: '🌟' },
    ],
    groups: [
      {
        title: '純文字',
        rows: [{ label: '星星', items: ['★', '☆', '✦', '✧', '✪', '✯'] }],
      },
      {
        title: '彩色 emoji',
        rows: [{ label: '星星', items: ['⭐', '🌟', '✨', '💫', '🌠'] }],
      },
    ],
  },

  箭頭符號: {
    pairs: [
      { role: '右', plain: '→', emoji: '➡️' },
      { role: '左', plain: '←', emoji: '⬅️' },
      { role: '上', plain: '↑', emoji: '⬆️' },
      { role: '下', plain: '↓', emoji: '⬇️' },
    ],
    groups: [
      {
        title: '純文字',
        rows: [{ label: '方向', items: ['→', '←', '↑', '↓', '↔', '↕', '⇒', '⇐'] }],
      },
      {
        title: '彩色 emoji',
        rows: [{ label: '方向', items: ['➡️', '⬅️', '⬆️', '⬇️', '↩️', '🔙', '🔜', '🔃'] }],
      },
    ],
  },

  '天氣符號（占星）': {
    pairs: [
      { role: '晴', plain: '☀', emoji: '☀️' },
      { role: '雲', plain: '☁', emoji: '☁️' },
      { role: '雨', plain: '☂', emoji: '🌧️' },
      { role: '雪', plain: '❄', emoji: '❄️' },
      { role: '月', plain: '☽', emoji: '🌙' },
    ],
    groups: [
      {
        title: '純文字',
        rows: [{ label: '天氣', items: ['☀', '☁', '☂', '☃', '❄', '☽', '☾', '☈'] }],
      },
      {
        title: '彩色 emoji',
        rows: [{ label: '天氣', items: ['☀️', '⛅', '☁️', '🌧️', '⛈️', '❄️', '🌈', '🌙', '🌩️'] }],
      },
    ],
  },

  表情符號: {
    pairs: [
      { role: '笑', plain: '☺', emoji: '😊' },
      { role: '哭', plain: '☹', emoji: '😢' },
      { role: '顏文字', plain: 'ツ', emoji: '🤔' },
    ],
    groups: [
      {
        title: '純文字',
        rows: [{ label: '臉', items: ['☺', '☻', '☹', 'ツ', 'ヅ'] }],
      },
      {
        title: '彩色 emoji',
        rows: [{ label: '臉', items: ['😊', '😂', '😢', '🤔', '😀', '🤣', '😭', '😡', '😴'] }],
      },
    ],
  },

  手勢符號: {
    pairs: [
      { role: '指右', plain: '☞', emoji: '👉' },
      { role: '指左', plain: '☜', emoji: '👈' },
      { role: '耶', plain: '✌', emoji: '✌️' },
    ],
    groups: [
      {
        title: '純文字',
        rows: [{ label: '手', items: ['☞', '☜', '☝', '✌', '✊', '✋', '✍'] }],
      },
      {
        title: '彩色 emoji',
        rows: [{ label: '手', items: ['👉', '👈', '👍', '👎', '✌️', '👋', '🤝', '🙏'] }],
      },
    ],
  },

  環保符號: {
    groups: [
      {
        title: '純文字',
        rows: [{ label: '環保', items: ['♲', '♻'] }],
      },
      {
        title: '彩色 emoji',
        rows: [{ label: '環保', items: ['♻️', '🌍', '🌱', '🌿'] }],
      },
    ],
  },
};
