import { Converter } from 'opencc-js';

const s2t = Converter({ from: 'cn', to: 'tw' });

/** Convert simplified Chinese text to Traditional (zh-TW). */
export function toTraditional(text) {
  if (!text || typeof text !== 'string') return text;
  return s2t(text);
}

/** Convert display fields on an anthem entry; keep zh-Hans original lyrics. */
export function traditionalizeAnthemEntry(entry) {
  if (!entry) return entry;
  const out = { ...entry };
  for (const key of ['country', 'anthem', 'anthemOriginal', 'durationNote']) {
    if (out[key]) out[key] = toTraditional(out[key]);
  }
  if (Array.isArray(out.verses)) {
    out.verses = out.verses.map((v) => {
      const verse = { ...v, label: toTraditional(v.label), zh: toTraditional(v.zh) };
      if (entry.lang === 'zh-Hans' && v.official && v.original?.includes('起來')) {
        verse.original = v.original;
      } else if (v.original && entry.lang !== 'zh-Hans') {
        verse.original = v.original;
      }
      return verse;
    });
  }
  return out;
}
