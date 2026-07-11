/**
 * Decode HTML character references (numeric & named) to Unicode strings.
 */
const NAMED = {
  Agrave: '\u00C0', Aacute: '\u00C1', Acirc: '\u00C2', Atilde: '\u00C3', Auml: '\u00C4',
  Aring: '\u00C5', AElig: '\u00C6', Ccedil: '\u00C7', Egrave: '\u00C8', Eacute: '\u00C9',
  Ecirc: '\u00CA', Euml: '\u00CB', Igrave: '\u00CC', Iacute: '\u00CD', Icirc: '\u00CE',
  Iuml: '\u00CF', ETH: '\u00D0', Ntilde: '\u00D1', Ograve: '\u00D2', Oacute: '\u00D3',
  Ocirc: '\u00D4', Otilde: '\u00D5', Ouml: '\u00D6', Oslash: '\u00D8', Ugrave: '\u00D9',
  Uacute: '\u00DA', Ucirc: '\u00DB', Uuml: '\u00DC', Yacute: '\u00DD', THORN: '\u00DE',
  szlig: '\u00DF', agrave: '\u00E0', aacute: '\u00E1', acirc: '\u00E2', atilde: '\u00E3',
  auml: '\u00E4', aring: '\u00E5', aelig: '\u00E6', ccedil: '\u00E7', egrave: '\u00E8',
  eacute: '\u00E9', ecirc: '\u00EA', euml: '\u00EB', igrave: '\u00EC', iacute: '\u00ED',
  icirc: '\u00EE', iuml: '\u00EF', eth: '\u00F0', ntilde: '\u00F1', ograve: '\u00F2',
  oacute: '\u00F3', ocirc: '\u00F4', otilde: '\u00F5', ouml: '\u00F6', oslash: '\u00F8',
  ugrave: '\u00F9', uacute: '\u00FA', ucirc: '\u00FB', uuml: '\u00FC', yacute: '\u00FD',
  thorn: '\u00FE', yuml: '\u00FF',
  iexcl: '\u00A1', cent: '\u00A2', pound: '\u00A3', curren: '\u00A4', yen: '\u00A5',
  brvbar: '\u00A6', sect: '\u00A7', uml: '\u00A8', copy: '\u00A9', ordf: '\u00AA',
  laquo: '\u00AB', not: '\u00AC', shy: '\u00AD', reg: '\u00AE', macr: '\u00AF',
  deg: '\u00B0', plusmn: '\u00B1', sup2: '\u00B2', sup3: '\u00B3', acute: '\u00B4',
  micro: '\u00B5', para: '\u00B6', middot: '\u00B7', cedil: '\u00B8', sup1: '\u00B9',
  ordm: '\u00BA', raquo: '\u00BB', frac14: '\u00BC', frac12: '\u00BD', frac34: '\u00BE',
  iquest: '\u00BF', times: '\u00D7', divide: '\u00F7', euro: '\u20AC',
};

export function decodeHtmlEntities(str) {
  if (typeof str !== 'string' || !str.includes('&')) return str;
  return str.replace(/&(#x([0-9a-fA-F]+)|#(\d+)|([a-zA-Z][\w]*));/g, (full, _g, hex, dec, name) => {
    if (hex != null) {
      const cp = parseInt(hex, 16);
      return Number.isFinite(cp) ? String.fromCodePoint(cp) : full;
    }
    if (dec != null) {
      const cp = parseInt(dec, 10);
      return Number.isFinite(cp) ? String.fromCodePoint(cp) : full;
    }
    if (name && NAMED[name]) return NAMED[name];
    return full;
  });
}
