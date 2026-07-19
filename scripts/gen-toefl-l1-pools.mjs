/**
 * Generate TOEFL L1 extra vocabulary pool .mjs files.
 * Run: node scripts/gen-toefl-l1-pools.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { OTHER_POOLS } from './data/toefl-l1-raw-other.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, 'data');
const EXISTING_PATH = path.join(__dirname, '..', 'assets/js/toefl-vocab-data.js');

const BUFFER = 20;
const TARGETS = {
  biology: 220,
  history: 220,
  academic: 220,
  psychology: 200,
  astronomy: 180,
  geology: 180,
  medicine: 180,
  chemistry: 160,
  anthropology: 160,
  economics: 160,
  technology: 160,
  literature: 140,
  politics: 140,
  education: 140,
  statistics: 140,
};

/** @param {string} text */
function loadExistingByTheme(text) {
  /** @type {Record<string, Set<string>>} */
  const out = {};
  const blockRe = /id: '([^']+)'[\s\S]*?words: \[([\s\S]*?)\]\s*\n\s*\}/g;
  let m;
  while ((m = blockRe.exec(text)) !== null) {
    const id = m[1];
    const words = [...m[2].matchAll(/w: '([^']+)'/g)].map((x) => x[1].toLowerCase());
    out[id] = new Set(words);
  }
  return out;
}

/** @param {Array<[string,string,string,string]>} entries */
function dedupe(entries) {
  const seen = new Set();
  const out = [];
  for (const e of entries) {
    const key = e[0].trim().toLowerCase();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push(e);
  }
  return out;
}

/** @param {string} theme @param {Array<[string,string,string,string]>} raw @param {Set<string>} existing @param {number} minSize */
function filterPool(theme, raw, existing, minSize) {
  const seen = new Set();
  const out = [];
  for (const entry of raw) {
    const [word] = entry;
    const key = word.trim().toLowerCase();
    if (!key || existing.has(key) || seen.has(key)) continue;
    seen.add(key);
    out.push(entry);
  }
  if (out.length < minSize) {
    throw new Error(`${theme}: only ${out.length} unique words after exclusions, need ${minSize}`);
  }
  return out;
}

/** @param {string} exportName @param {Array<[string,string,string,string]>} pool */
function formatPoolFile(exportName, pool) {
  const lines = pool.map(([w, pos, zh, syn]) => {
    const esc = (s) => s.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
    return `  ['${esc(w)}', '${esc(pos)}', '${esc(zh)}', '${esc(syn)}'],`;
  });
  return `/** TOEFL L1 extra vocabulary pool (${pool.length} entries). */\nexport const ${exportName} = [\n${lines.join('\n')}\n];\n`;
}

// Curated TOEFL academic vocabulary — Traditional Chinese (Taiwan)
const RAW_POOLS = {
  biology: [
    ['anatomy', 'n.', '解剖學', 'body structure'],
    ['physiology', 'n.', '生理學', 'body function'],
    ['taxonomy', 'n.', '分類學', 'classification'],
    ['phylum', 'n.', '門（分類）', 'major group'],
    ['genus', 'n.', '屬', 'species group'],
    ['phenotype', 'n.', '表型', 'observable trait'],
    ['genotype', 'n.', '基因型', 'genetic makeup'],
    ['allele', 'n.', '等位基因', 'gene variant'],
    ['dominant', 'adj.', '顯性的', 'overriding trait'],
    ['recessive', 'adj.', '隱性的', 'masked trait'],
    ['homozygous', 'adj.', '同型合子的', 'identical alleles'],
    ['heterozygous', 'adj.', '異型合子的', 'mixed alleles'],
    ['mitosis', 'n.', '有絲分裂', 'cell division'],
    ['meiosis', 'n.', '減數分裂', 'gamete division'],
    ['cytoplasm', 'n.', '細胞質', 'cell fluid'],
    ['ribosome', 'n.', '核糖體', 'protein maker'],
    ['endoplasmic reticulum', 'n.', '內質網', 'cell network'],
    ['golgi apparatus', 'n.', '高基氏體', 'packaging organelle'],
    ['lysosome', 'n.', '溶酶體', 'digestive organelle'],
    ['vacuole', 'n.', '液泡', 'storage sac'],
    ['flagellum', 'n.', '鞭毛', 'tail structure'],
    ['cilia', 'n.', '纖毛', 'hairlike structures'],
    ['xylem', 'n.', '木質部', 'water transport'],
    ['phloem', 'n.', '韌皮部', 'sap transport'],
    ['stamen', 'n.', '雄蕊', 'male part'],
    ['pistil', 'n.', '雌蕊', 'female part'],
    ['pollen', 'n.', '花粉', 'plant gamete'],
    ['spore', 'n.', '孢子', 'reproductive cell'],
    ['fungi', 'n.', '真菌', 'fungus group'],
    ['bacteria', 'n.', '細菌', 'microbe'],
    ['virus', 'n.', '病毒', 'infectious agent'],
    ['pathogen', 'n.', '病原體', 'disease agent'],
    ['immunity', 'n.', '免疫力', 'defense'],
    ['antibody', 'n.', '抗體', 'immune protein'],
    ['antigen', 'n.', '抗原', 'immune trigger'],
    ['vaccine', 'n.', '疫苗', 'immunization'],
    ['epidemic', 'n.', '流行病', 'outbreak'],
    ['pandemic', 'n.', '大流行', 'global outbreak'],
    ['endemic', 'adj.', '地方性的', 'locally common'],
    ['biome', 'n.', '生物群系', 'major habitat'],
    ['tundra', 'n.', '苔原', 'cold plain'],
    ['savanna', 'n.', '稀樹草原', 'grassland'],
    ['rainforest', 'n.', '熱帶雨林', 'dense forest'],
    ['canopy', 'n.', '樹冠層', 'forest roof'],
    ['detritus', 'n.', '碎屑', 'dead matter'],
    ['decomposer', 'n.', '分解者', 'recycler'],
    ['scavenger', 'n.', '食腐動物', 'carrion eater'],
    ['trophic', 'adj.', '營養階的', 'feeding level'],
    ['biomass', 'n.', '生物量', 'living matter'],
    ['niche', 'n.', '生態位', 'species role'],
    ['mutualism', 'n.', '互利共生', 'both benefit'],
    ['commensalism', 'n.', '偏利共生', 'one benefits'],
    ['camouflage', 'n.', '偽裝', 'concealment'],
    ['mimicry', 'n.', '擬態', 'imitation'],
    ['nocturnal', 'adj.', '夜行的', 'active at night'],
    ['diurnal', 'adj.', '日行的', 'active by day'],
    ['terrestrial', 'adj.', '陸生的', 'land-based'],
    ['aquatic', 'adj.', '水生的', 'water-based'],
    ['plankton', 'n.', '浮游生物', 'drifting life'],
    ['zooplankton', 'n.', '動物浮游生物', 'animal plankton'],
    ['phytoplankton', 'n.', '植物浮游生物', 'plant plankton'],
    ['algae', 'n.', '藻類', 'water plants'],
    ['kelp', 'n.', '海帶', 'large seaweed'],
    ['coral', 'n.', '珊瑚', 'reef builder'],
    ['spawning', 'n.', '產卵', 'egg release'],
    ['metamorphosis', 'n.', '變態', 'form change'],
    ['larva', 'n.', '幼蟲', 'immature form'],
    ['pupa', 'n.', '蛹', 'cocoon stage'],
    ['molting', 'n.', '蛻皮', 'shedding skin'],
    ['exoskeleton', 'n.', '外骨骼', 'outer shell'],
    ['endoskeleton', 'n.', '內骨骼', 'internal skeleton'],
    ['cartilage', 'n.', '軟骨', 'flexible tissue'],
    ['tendon', 'n.', '肌腱', 'muscle connector'],
    ['ligament', 'n.', '韌帶', 'bone connector'],
    ['artery', 'n.', '動脈', 'blood vessel out'],
    ['vein', 'n.', '靜脈', 'blood vessel in'],
    ['capillary', 'n.', '微血管', 'tiny vessel'],
    ['alveoli', 'n.', '肺泡', 'air sacs'],
    ['diaphragm', 'n.', '橫膈膜', 'breathing muscle'],
    ['nephron', 'n.', '腎元', 'kidney unit'],
    ['neuron', 'n.', '神經元', 'nerve cell'],
    ['synapse', 'n.', '突觸', 'nerve junction'],
    ['dendrite', 'n.', '樹突', 'nerve branch'],
    ['axon', 'n.', '軸突', 'nerve fiber'],
    ['cerebellum', 'n.', '小腦', 'balance center'],
    ['cerebrum', 'n.', '大腦', 'thinking part'],
    ['hippocampus', 'n.', '海馬迴', 'memory region'],
    ['hormone', 'n.', '荷爾蒙', 'chemical signal'],
    ['endocrine', 'adj.', '內分泌的', 'hormone-related'],
    ['glandular', 'adj.', '腺體的', 'gland-related'],
    ['ovary', 'n.', '卵巢', 'egg organ'],
    ['testis', 'n.', '睪丸', 'sperm organ'],
    ['uterus', 'n.', '子宮', 'womb'],
    ['placenta', 'n.', '胎盤', 'nutrient link'],
    ['lactation', 'n.', '泌乳', 'milk production'],
    ['gestation', 'n.', '妊娠期', 'pregnancy period'],
    ['ovulation', 'n.', '排卵', 'egg release'],
    ['fertilization', 'n.', '受精', 'egg-sperm union'],
    ['zygote', 'n.', '合子', 'fertilized egg'],
    ['gamete', 'n.', '配子', 'sex cell'],
    ['diploid', 'adj.', '二倍體的', 'double chromosomes'],
    ['haploid', 'adj.', '單倍體的', 'single set'],
    ['karyotype', 'n.', '核型', 'chromosome map'],
    ['pedigree', 'n.', '譜系', 'family tree'],
    ['hereditary', 'adj.', '遺傳的', 'inherited'],
    ['congenital', 'adj.', '先天的', 'born with'],
    ['autoimmune', 'adj.', '自體免疫的', 'self-attack'],
    ['malignant', 'adj.', '惡性的', 'cancerous'],
    ['benign', 'adj.', '良性的', 'non-cancerous'],
    ['biopsy', 'n.', '活組織檢查', 'tissue sample'],
    ['dissection', 'n.', '解剖', 'cutting study'],
    ['microscopy', 'n.', '顯微鏡學', 'microscope use'],
    ['centrifuge', 'n.', '離心機', 'spin separator'],
    ['petri dish', 'n.', '培養皿', 'culture plate'],
    ['agar', 'n.', '瓊脂', 'culture medium'],
    ['sterile', 'adj.', '無菌的', 'germ-free'],
    ['inoculate', 'v.', '接種', 'introduce culture'],
    ['incubate', 'v.', '培養', 'grow culture'],
    ['chromatography', 'n.', '層析法', 'separation method'],
    ['electrophoresis', 'n.', '電泳', 'DNA separation'],
    ['genome', 'n.', '基因組', 'full DNA set'],
    ['transcriptome', 'n.', '轉錄組', 'RNA profile'],
    ['epigenetic', 'adj.', '表觀遺傳的', 'gene regulation'],
    ['transcription', 'n.', '轉錄', 'DNA to RNA'],
    ['translation', 'n.', '轉譯', 'RNA to protein'],
    ['codon', 'n.', '密碼子', 'triplet code'],
    ['intron', 'n.', '內含子', 'noncoding segment'],
    ['exon', 'n.', '外顯子', 'coding segment'],
    ['promoter', 'n.', '啟動子', 'gene switch'],
    ['plasmid', 'n.', '質體', 'DNA ring'],
    ['clone', 'v.', '複製', 'duplicate'],
    ['transgenic', 'adj.', '轉基因的', 'gene altered'],
    ['hybridization', 'n.', '雜交', 'cross breeding'],
    ['domestication', 'n.', '馴化', 'taming species'],
    ['feral', 'adj.', '野化的', 'returned wild'],
    ['wildtype', 'n.', '野生型', 'normal form'],
    ['mutant', 'n.', '突變体', 'altered form'],
    ['keystone species', 'n.', '關鍵物種', 'ecosystem anchor'],
    ['trophic cascade', 'n.', '營養級聯', 'food chain effect'],
    ['succession', 'n.', '演替', 'community change'],
    ['pioneer species', 'n.', '先驅物種', 'first colonizer'],
    ['lichen', 'n.', '地衣', 'fungus-algae pair'],
    ['fern', 'n.', '蕨類', 'spore plant'],
    ['conifer', 'n.', '針葉樹', 'cone tree'],
    ['angiosperm', 'n.', '被子植物', 'flowering plant'],
    ['gymnosperm', 'n.', '裸子植物', 'naked seed plant'],
    ['monocot', 'n.', '單子葉植物', 'one seed leaf'],
    ['dicot', 'n.', '雙子葉植物', 'two seed leaves'],
    ['deciduous', 'adj.', '落葉的', 'shedding leaves'],
    ['evergreen', 'adj.', '常綠的', 'year-round green'],
    ['perennial', 'adj.', '多年生的', 'long-lived plant'],
    ['annual', 'adj.', '一年生的', 'one-year plant'],
    ['rhizome', 'n.', '根莖', 'underground stem'],
    ['tuber', 'n.', '塊莖', 'storage root'],
    ['graft', 'v.', '嫁接', 'join plants'],
    ['asexual reproduction', 'n.', '無性繁殖', 'clone reproduction'],
    ['binary fission', 'n.', '二分裂', 'bacterial split'],
    ['budding', 'n.', '出芽生殖', 'bud growth'],
    ['regeneration', 'n.', '再生', 'grow back'],
    ['stem cell', 'n.', '幹細胞', 'undifferentiated cell'],
    ['apoptosis', 'n.', '細胞凋亡', 'programmed death'],
    ['homeostasis', 'n.', '恆定', 'internal balance'],
    ['osmosis', 'n.', '滲透', 'water diffusion'],
    ['diffusion', 'n.', '擴散', 'spread out'],
    ['active transport', 'n.', '主動運輸', 'energy transport'],
    ['hypertonic', 'adj.', '高滲的', 'concentrated outside'],
    ['hypotonic', 'adj.', '低滲的', 'dilute outside'],
    ['transpiration', 'n.', '蒸散作用', 'water loss'],
    ['stomata', 'n.', '氣孔', 'leaf pores'],
    ['chlorophyll', 'n.', '葉綠素', 'green pigment'],
    ['cellulose', 'n.', '纖維素', 'plant fiber'],
    ['glucose', 'n.', '葡萄糖', 'blood sugar'],
    ['amino acid', 'n.', '胺基酸', 'protein building block'],
    ['nucleotide', 'n.', '核苷酸', 'DNA unit'],
    ['ATP', 'n.', '三磷酸腺苷', 'energy molecule'],
    ['catalyst', 'n.', '催化劑', 'speed booster'],
    ['cofactor', 'n.', '輔因子', 'enzyme helper'],
    ['denature', 'v.', '變性', 'unfold protein'],
    ['glycolysis', 'n.', '糖解作用', 'sugar breakdown'],
    ['fermentation', 'n.', '發酵', 'anaerobic process'],
    ['anaerobic', 'adj.', '無氧的', 'without oxygen'],
    ['aerobic', 'adj.', '有氧的', 'with oxygen'],
    ['carbon fixation', 'n.', '碳固定', 'CO2 capture'],
    ['nitrogen fixation', 'n.', '固氮作用', 'N2 conversion'],
    ['carbon cycle', 'n.', '碳循環', 'carbon flow'],
    ['nitrogen cycle', 'n.', '氮循環', 'nitrogen flow'],
    ['eutrophication', 'n.', '優養化', 'nutrient overload'],
    ['biomagnification', 'n.', '生物放大', 'toxin buildup'],
    ['restoration ecology', 'n.', '復育生態學', 'habitat repair'],
    ['captive breeding', 'n.', '圈養繁殖', 'zoo breeding'],
    ['wildlife corridor', 'n.', '野生動物廊道', 'habitat link'],
    ['fragmentation', 'n.', '棲地破碎化', 'habitat breakup'],
    ['metapopulation', 'n.', '/meta族群', 'linked populations'],
    ['logistic growth', 'n.', '邏輯斯增長', 'limited growth'],
    ['exponential growth', 'n.', '指數增長', 'rapid increase'],
    ['limiting factor', 'n.', '限制因子', 'growth constraint'],
    ['abiotic', 'adj.', '非生物的', 'nonliving'],
    ['biotic', 'adj.', '生物的', 'living'],
    ['phenology', 'n.', '物候學', 'seasonal timing'],
    ['circadian rhythm', 'n.', '晝夜節律', 'daily cycle'],
    ['photoperiodism', 'n.', '光周期現象', 'day-length response'],
    ['phototropism', 'n.', '向光性', 'light growth'],
    ['gravitropism', 'n.', '向重力性', 'gravity growth'],
    ['instinct', 'n.', '本能', 'innate behavior'],
    ['imprinting', 'n.', '銘印', 'early learning'],
    ['territoriality', 'n.', '領域性', 'territory defense'],
    ['altruism', 'n.', '利他行為', 'selfless act'],
    ['kin selection', 'n.', '親緣選擇', 'family favoring'],
    ['eusocial', 'adj.', '真社會性的', 'highly social'],
    ['sessile', 'adj.', '固着性的', 'attached'],
    ['motile', 'adj.', '能運動的', 'mobile'],
    ['estuary', 'n.', '河口', 'river mouth'],
    ['mangrove', 'n.', '紅樹林', 'coastal forest'],
    ['intertidal', 'adj.', '潮間帶的', 'tide zone'],
    ['coral bleaching', 'n.', '珊瑚白化', 'reef stress'],
    ['ocean acidification', 'n.', '海洋酸化', 'pH drop'],
    ['upwelling', 'n.', '湧升流', 'nutrient rise'],
    ['thermocline', 'n.', '溫躍層', 'temperature layer'],
    ['marine biology', 'n.', '海洋生物學', 'sea life study'],
    ['microbiology', 'n.', '微生物學', 'microbe study'],
    ['botany', 'n.', '植物學', 'plant science'],
    ['zoology', 'n.', '動物學', 'animal science'],
    ['ecology', 'n.', '生態學', 'environment study'],
    ['ethology', 'n.', '動物行為學', 'behavior study'],
    ['morphology', 'n.', '形態學', 'form study'],
    ['histology', 'n.', '組織學', 'tissue study'],
    ['embryology', 'n.', '胚胎學', 'embryo study'],
    ['parasitology', 'n.', '寄生蟲學', 'parasite study'],
    ['immunology', 'n.', '免疫學', 'immunity study'],
    ['virology', 'n.', '病毒學', 'virus study'],
    ['mycology', 'n.', '真菌學', 'fungus study'],
    ['ornithology', 'n.', '鳥類學', 'bird study'],
    ['herpetology', 'n.', '兩棲爬蟲學', 'reptile study'],
    ['entomology', 'n.', '昆蟲學', 'insect study'],
    ['ichthyology', 'n.', '魚類學', 'fish study'],
    ['primatology', 'n.', '靈長類學', 'ape study'],
    ['paleontology', 'n.', '古生物學', 'ancient life'],
    ['biochemistry', 'n.', '生物化學', 'life chemistry'],
    ['biophysics', 'n.', '生物物理學', 'life physics'],
    ['bioinformatics', 'n.', '生物資訊學', 'data biology'],
    ['biotechnology', 'n.', '生物技術', 'life tech'],
    ['biosphere', 'n.', '生物圈', 'life zone'],
    ['autotroph', 'n.', '自營生物', 'self-feeder'],
    ['heterotroph', 'n.', '異營生物', 'other-feeder'],
    ['producer', 'n.', '生產者', 'energy maker'],
    ['consumer', 'n.', '消費者', 'energy user'],
    ['saprophyte', 'n.', '腐生生物', 'decay feeder'],
    ['symbiotic', 'adj.', '共生的', 'living together'],
    ['pathogenic', 'adj.', '致病的', 'disease-causing'],
    ['virulent', 'adj.', '劇毒的', 'highly harmful'],
    ['resistant', 'adj.', '抗性的', 'hard to kill'],
    ['tolerant', 'adj.', '耐受的', 'enduring stress'],
    ['vulnerable', 'adj.', '脆弱的', 'easily harmed'],
    ['threatened', 'adj.', '受威脅的', 'at risk'],
    ['extinction', 'n.', '滅絕', 'species loss'],
    ['reintroduction', 'n.', '再引入', 'release back'],
    ['ex situ conservation', 'n.', '移地保育', 'off-site save'],
    ['in situ conservation', 'n.', '就地保育', 'on-site save'],
    ['seed bank', 'n.', '種子庫', 'seed storage'],
    ['gene pool', 'n.', '基因庫', 'genetic stock'],
    ['genetic drift', 'n.', '遺傳漂變', 'random change'],
    ['gene flow', 'n.', '基因流', 'gene movement'],
    ['natural selection', 'n.', '天擇', 'survival filter'],
    ['sexual selection', 'n.', '性擇', 'mate choice'],
    ['speciation', 'n.', '物種形成', 'new species'],
    ['convergent evolution', 'n.', '趨同演化', 'similar traits'],
    ['divergent evolution', 'n.', '分歧演化', 'splitting traits'],
    ['coevolution', 'n.', '共同演化', 'mutual change'],
    ['vestigial', 'adj.', '退化的', 'leftover part'],
    ['analogous', 'adj.', '同功的', 'similar function'],
    ['homologous', 'adj.', '同源的', 'shared origin'],
    ['bilateral symmetry', 'n.', '左右對稱', 'mirror halves'],
    ['radial symmetry', 'n.', '輻射對稱', 'wheel shape'],
    ['segmentation', 'n.', '分節', 'body sections'],
    ['cephalization', 'n.', '頭化', 'head development'],
    ['notochord', 'n.', '脊索', 'support rod'],
    ['invertebrate', 'n.', '無脊椎動物', 'no backbone'],
    ['arthropod', 'n.', '節肢動物', 'jointed leg'],
    ['mollusk', 'n.', '軟體動物', 'shell creature'],
    ['echinoderm', 'n.', '棘皮動物', 'spiny skin'],
    ['cnidarian', 'n.', '刺胞動物', 'stinging cell'],
    ['annelid', 'n.', '環節動物', 'segmented worm'],
    ['nematode', 'n.', '線蟲', 'roundworm'],
    ['flatworm', 'n.', '扁形動物', 'flat body'],
    ['sponge', 'n.', '海綿', 'porous animal'],
    ['rodent', 'n.', '齧齒動物', 'gnawing mammal'],
    ['primate', 'n.', '靈長類', 'ape relative'],
    ['cetacean', 'n.', '鯨豚類', 'whale dolphin'],
    ['raptor', 'n.', '猛禽', 'bird of prey'],
    ['waterfowl', 'n.', '水禽', 'water bird'],
    ['pollinator', 'n.', '授粉者', 'pollen carrier'],
    ['nectar', 'n.', '花蜜', 'flower sugar'],
    ['sepal', 'n.', '萼片', 'flower cover'],
    ['petal', 'n.', '花瓣', 'flower part'],
    ['fruit', 'n.', '果實', 'seed container'],
    ['seed dispersal', 'n.', '種子散布', 'seed spread'],
    ['root system', 'n.', '根系', 'underground network'],
    ['taproot', 'n.', '主根', 'main root'],
    ['fibrous root', 'n.', '鬚根', 'branching roots'],
    ['cuticle', 'n.', '角質層', 'outer layer'],
    ['epidermis', 'n.', '表皮', 'outer tissue'],
    ['cortex', 'n.', '皮層', 'outer region'],
    ['meristem', 'n.', '分生組織', 'growth tissue'],
    ['vascular tissue', 'n.', '維管束組織', 'transport tissue'],
    ['parenchyma', 'n.', '薄壁組織', 'storage tissue'],
    ['sclerenchyma', 'n.', '厚壁組織', 'support tissue'],
    ['collenchyma', 'n.', '厚角組織', 'flexible support'],
    ['tissue', 'n.', '組織', 'cell group'],
    ['organ', 'n.', '器官', 'body part'],
    ['organ system', 'n.', '器官系統', 'organ group'],
    ['circulatory system', 'n.', '循環系統', 'blood system'],
    ['respiratory system', 'n.', '呼吸系統', 'breathing system'],
    ['digestive system', 'n.', '消化系統', 'food processing'],
    ['nervous system', 'n.', '神經系統', 'nerve network'],
    ['reproductive system', 'n.', '生殖系統', 'reproduction organs'],
    ['skeletal system', 'n.', '骨骼系統', 'bone framework'],
    ['muscular system', 'n.', '肌肉系統', 'movement system'],
    ['integumentary system', 'n.', '皮膚系統', 'skin system'],
    ['lymphatic system', 'n.', '淋巴系統', 'immune network'],
    ['endocrine system', 'n.', '內分泌系統', 'hormone system'],
    ['excretory system', 'n.', '排泄系統', 'waste removal'],
  ],
};

const ALL_RAW = { ...RAW_POOLS, ...OTHER_POOLS };

const EXPORT_NAMES = {
  biology: 'biology',
  history: 'history',
  academic: 'academic',
  psychology: 'psychology',
  astronomy: 'astronomy',
  geology: 'geology',
  medicine: 'medicine',
  chemistry: 'chemistry',
  anthropology: 'anthropology',
  economics: 'economics',
  technology: 'technology',
  literature: 'literature',
  politics: 'politics',
  education: 'education',
  statistics: 'statistics',
};

function main() {
  const existingText = fs.readFileSync(EXISTING_PATH, 'utf8');
  const existingByTheme = loadExistingByTheme(existingText);
  const imports = [];
  const poolKeys = [];

  for (const [theme, target] of Object.entries(TARGETS)) {
    const minSize = target + BUFFER;
    const raw = dedupe(ALL_RAW[theme] || []);
    if (!raw.length) throw new Error(`No raw pool for ${theme}`);
    const existing = existingByTheme[theme] || new Set();
    const pool = filterPool(theme, raw, existing, minSize);
    const exportName = EXPORT_NAMES[theme];
    const fileName = `toefl-l1-pool-${theme}.mjs`;
    const filePath = path.join(DATA_DIR, fileName);
    fs.writeFileSync(filePath, formatPoolFile(exportName, pool), 'utf8');
    imports.push(`import { ${exportName} } from './${fileName}';`);
    poolKeys.push(`  ${theme}: ${exportName},`);
    console.log(`${theme}: ${pool.length} entries (need ${minSize})`);
  }

  const indexContent = `/**
 * Curated TOEFL L1 vocabulary pools for build-toefl-l1-extra.mjs
 * Each entry: [word, pos, zh (Traditional Taiwan), synonym]
 */
${imports.join('\n')}

export const VOCAB_POOLS = {
${poolKeys.join('\n')}
};
`;
  fs.writeFileSync(path.join(DATA_DIR, 'toefl-l1-vocab-pools.mjs'), indexContent, 'utf8');
  console.log('Written toefl-l1-vocab-pools.mjs and pool files.');
}

main();
