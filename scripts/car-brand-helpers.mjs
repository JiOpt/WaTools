/**
 * Build five-section brand description from compact fields.
 */
export function buildBrandDesc(brand, regionLabel) {
  if (brand.desc) return brand.desc;

  const groupLine = brand.group ? `隸屬 ${brand.group}。` : '';
  const positioning = brand.positioning
    || `${brand.nameZh}（${brand.nameEn}）${groupLine}為${regionLabel}體系下的${brand.tier || '乘用車'}品牌。`;
  const models = brand.models
    || '主力車款涵蓋房車、休旅或電動系列，依各市場調整產品陣容。';
  const reliability = brand.reliability
    || '妥善率與保修成本因車系、年式與市場而異；購車前建議確認當地原廠與零件供應狀況。';
  const driving = brand.driving
    || '駕駛調性依品牌定位而異，從舒適通勤、運動操控到越野性能皆有覆蓋。';
  const powertrain = brand.powertrain
    || '動力型式涵蓋汽油、油電、插電混合或純電，電動化比例持續提升。';

  return [
    `【品牌定位與國籍】${positioning}`,
    `【核心／招牌車款】${models}`,
    `【妥善率與維護成本】${reliability}`,
    `【駕駛調性與動力特色】${driving}`,
    `【動力型式】${powertrain}`,
  ].join('\n');
}

/** @param {object} fields */
export function brand(fields) {
  return fields;
}
