/**
 * Curated TOEFL L1 vocabulary pools for build-toefl-l1-extra.mjs
 * Each entry: [word, pos, zh (Traditional Taiwan), synonym]
 */
import { biology } from './toefl-l1-pool-biology.mjs';
import { history } from './toefl-l1-pool-history.mjs';
import { academic } from './toefl-l1-pool-academic.mjs';
import { psychology } from './toefl-l1-pool-psychology.mjs';
import { astronomy } from './toefl-l1-pool-astronomy.mjs';
import { geology } from './toefl-l1-pool-geology.mjs';
import { medicine } from './toefl-l1-pool-medicine.mjs';
import { chemistry } from './toefl-l1-pool-chemistry.mjs';
import { anthropology } from './toefl-l1-pool-anthropology.mjs';
import { economics } from './toefl-l1-pool-economics.mjs';
import { technology } from './toefl-l1-pool-technology.mjs';
import { literature } from './toefl-l1-pool-literature.mjs';
import { politics } from './toefl-l1-pool-politics.mjs';
import { education } from './toefl-l1-pool-education.mjs';
import { statistics } from './toefl-l1-pool-statistics.mjs';

export const VOCAB_POOLS = {
  biology: biology,
  history: history,
  academic: academic,
  psychology: psychology,
  astronomy: astronomy,
  geology: geology,
  medicine: medicine,
  chemistry: chemistry,
  anthropology: anthropology,
  economics: economics,
  technology: technology,
  literature: literature,
  politics: politics,
  education: education,
  statistics: statistics,
};
