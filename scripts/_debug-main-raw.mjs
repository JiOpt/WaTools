const BASE = 'https://www.ifreesite.com/scriptures/';

function extractIoContentRaw(html) {
  const openTag = '<div id="io_content">';
  const start = html.indexOf(openTag);
  if (start === -1) return '';
  let i = start + openTag.length;
  let depth = 1;
  let end = -1;
  while (i < html.length && depth > 0) {
    const nextOpen = html.indexOf('<div', i);
    const nextClose = html.indexOf('</div>', i);
    if (nextClose === -1) break;
    if (nextOpen !== -1 && nextOpen < nextClose) { depth += 1; i = nextOpen + 4; }
    else { depth -= 1; if (depth === 0) end = nextClose; i = nextClose + 6; }
  }
  return end === -1 ? '' : html.slice(start + openTag.length, end);
}

const raw = extractIoContentRaw(await (await fetch(`${BASE}analects.htm`)).text());
const idx = raw.indexOf('學而第一');
console.log(raw.slice(idx - 200, idx + 1200));
