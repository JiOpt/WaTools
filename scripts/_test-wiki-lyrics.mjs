/** Test Wikipedia lyrics extraction */
async function fetchWikitext(title, lang = 'en') {
  const url = `https://${lang}.wikipedia.org/w/api.php?${new URLSearchParams({
    action: 'parse',
    page: title,
    prop: 'wikitext',
    format: 'json',
    origin: '*',
  })}`;
  const res = await fetch(url, { headers: { 'User-Agent': 'Kawatool/1.0' } });
  const data = await res.json();
  return data.parse?.wikitext?.['*'] || '';
}

function extractLyrics(wt) {
  const poems = [...wt.matchAll(/<poem>([\s\S]*?)<\/poem>/gi)].map((m) => cleanWikitext(m[1])).filter(Boolean);
  if (poems.length) return poems[0];

  const infobox = wt.match(/\{\{Infobox anthem[\s\S]*?\n\}\}/i);
  if (infobox) {
    const lyricsMatch = infobox[0].match(/\|\s*lyrics\s*=\s*([\s\S]*?)(?=\n\|)/i);
    if (lyricsMatch) return cleanWikitext(lyricsMatch[1]);
  }
  const sec = wt.match(/==\s*Lyrics\s*==([\s\S]*?)(?=\n==[^=]|$)/i);
  if (sec) return cleanWikitext(sec[1]);
  const sec2 = wt.match(/==\s*Text\s*==([\s\S]*?)(?=\n==[^=]|$)/i);
  if (sec2) return cleanWikitext(sec2[1]);
  return '';
}

function cleanWikitext(s) {
  return s
    .replace(/\{\{[^}]+\}\}/g, '')
    .replace(/\[\[(?:[^|\]]+\|)?([^\]]+)\]\]/g, '$1')
    .replace(/<ref[^>]*\/>/g, '')
    .replace(/<ref[^>]*>[\s\S]*?<\/ref>/g, '')
    .replace(/'''+/g, '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/^\s*[:\*#]+\s*/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

const wt = await fetchWikitext('Kimigayo');
console.log('--- Kimigayo poems ---');
const poems = [...wt.matchAll(/<poem>([\s\S]*?)<\/poem>/gi)].map((m) => m[1].trim());
poems.forEach((p, i) => console.log(`[${i}]`, p.slice(0, 200)));

const wtZh = await fetchWikitext('君之代', 'zh');
console.log('--- zh Kimigayo ---');
const poemsZh = [...wtZh.matchAll(/<poem>([\s\S]*?)<\/poem>/gi)].map((m) => m[1].trim());
poemsZh.forEach((p, i) => console.log(`[${i}]`, p.slice(0, 200)));
