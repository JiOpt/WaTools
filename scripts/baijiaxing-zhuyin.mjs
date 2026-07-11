import { p2z } from 'pinyin-to-zhuyin';

const PINYIN_FIXES = {
  wè: 'wèi',
  wé: 'wéi',
  wē: 'wēi',
  wě: 'wěi',
  lüè: 'lüè',
  lue: 'lüè',
  nüè: 'nüè',
  nue: 'nüè',
};

export function normalizeBaijiaxingPinyin(raw) {
  const py = String(raw || '').trim().toLowerCase();
  return PINYIN_FIXES[py] || py;
}

export function pinyinToZhuyin(raw) {
  const py = normalizeBaijiaxingPinyin(raw);
  if (!py) return '';
  try {
    const out = p2z(py, { toneStyle: 'marks', spacing: '' });
    if (!out || /[a-z]/i.test(out)) return '';
    return out.replace(/\s+/g, '').trim();
  } catch {
    return '';
  }
}

export function isSuspiciousZhuyin(zy) {
  if (!zy) return true;
  if (/[十兀万]/.test(zy)) return true;
  if (/[a-z]/i.test(zy)) return true;
  if (!/^[ㄅ-ㄩˊˇˋ˙ㄦ]+$/.test(zy)) return true;
  return false;
}
