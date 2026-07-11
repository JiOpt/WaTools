/**
 * Car brand metadata — groups, brands, intro.
 * Brand list: scripts/car-brand-catalog.mjs
 */
import { CAR_BRAND_GROUPS } from './car-brand-catalog.mjs';
import { buildBrandDesc } from './car-brand-helpers.mjs';

export const CAR_BRAND_REGIONS = CAR_BRAND_GROUPS.map((region) => ({
  id: region.id,
  label: region.label,
  brands: region.brands.map((b) => ({
    ...b,
    group: b.group || region.label,
    desc: buildBrandDesc({ ...b, group: b.group || region.label }, region.label),
  })),
}));

export const CAR_BRAND_INTRO = {
  summary: '全球百餘汽車品牌圖鑑——依跨國汽車集團分類，點選車標即可查看品牌定位、招牌車款、妥善率、駕駛調性與動力型式。',
  guide: [
    '集團體系：多數品牌隸屬福斯、豐田、Stellantis、通用、現代等少數跨國集團，共享平台與技術。',
    '品牌定位與國籍：了解產地血統、價格階級（國民車、豪華、超跑）與核心價值。',
    '核心／招牌車款：如 Toyota Corolla／RAV4、Ford F-150、VW Golf 等銷售支柱。',
    '妥善率與維護成本：耐用度、零件取得與保養花費，可參考 J.D. Power、消費者報告。',
    '駕駛調性與動力特色：舒適、操控、越野或智能輔駕；動力涵蓋 ICE、HEV、PHEV、EV。',
  ],
  disclaimer: '內容供選車參考與路上認車使用，集團持股與品牌歸屬可能變動；實際規格、價格與妥善率因市場、年式而異，購車前請以原廠資訊為準。',
};
