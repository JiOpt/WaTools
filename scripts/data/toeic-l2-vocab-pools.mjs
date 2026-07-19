/**
 * Curated TOEIC L2 vocabulary pools for build-toeic-l2-extra-json.mjs
 * Each entry: [word, pos, zh (Traditional Taiwan), synonym]
 */
import { ma } from './l2-pool-ma.mjs';
import { governance } from './l2-pool-governance.mjs';
import { realEstate } from './l2-pool-real-estate.mjs';
import { rnd } from './l2-pool-rnd.mjs';
import { insuranceBenefits } from './l2-pool-insurance-benefits.mjs';
import { esg } from './l2-pool-esg.mjs';
import { banking } from './l2-pool-banking.mjs';
import { hospitality } from './l2-pool-hospitality.mjs';

export const VOCAB_POOLS = {
  ma,
  governance,
  'real-estate': realEstate,
  rnd,
  'insurance-benefits': insuranceBenefits,
  esg,
  banking,
  hospitality,
};
