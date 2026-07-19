/* eslint-disable */
/** Generates scripts/data/toefl-l2-vocab-seeds.mjs from curated lists + expansions. */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, 'data/toefl-l2-vocab-seeds.mjs');

function e(w, p, z, s) { return [w, p, z, s]; }

function parseBlock(text) {
  return text.trim().split('\n').filter(Boolean).map((line) => {
    const [w, p, z, s] = line.split('|');
    if (!w || !p || !z || !s) throw new Error(`Bad line: ${line}`);
    return e(w.trim(), p.trim(), z.trim(), s.trim());
  });
}

function expand(modifiers, nouns, pos = 'n.') {
  const out = [];
  for (const mod of modifiers) {
    for (const [n, nz, ns] of nouns) {
      out.push(e(`${mod.en} ${n}`, pos, `${mod.zh}${nz}`, `${mod.en} ${ns}`));
    }
  }
  return out;
}

function dedupe(pool) {
  const seen = new Set();
  const out = [];
  for (const row of pool) {
    const key = row[0].toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(row);
  }
  return out;
}

const awlCore = parseBlock(`
analyze|v.|分析|examine
approach|n.|方法；途徑|method
assessment|n.|評估|evaluation
assume|v.|假設|presume
authority|n.|權威；主管機關|jurisdiction
available|adj.|可取得的|accessible
benefit|n.|利益|advantage
concept|n.|概念|notion
consistent|adj.|一致的|coherent
constitutional|adj.|憲法的|charter-based
context|n.|脈絡|setting
contract|n.|合約|agreement
create|v.|建立|establish
data|n.|資料|information
define|v.|定義|specify
derive|v.|衍生|obtain
distribute|v.|分配|spread
economy|n.|經濟|economic system
environment|n.|環境|surroundings
establish|v.|確立|found
estimate|v.|估計|approximate
evident|adj.|明顯的|apparent
factor|n.|因素|element
finance|n.|金融|funding
formula|n.|公式|equation
function|n.|功能|role
identify|v.|識別|recognize
income|n.|收入|revenue
indicate|v.|指出|show
individual|n.|個人|person
interpret|v.|詮釋|explain
involve|v.|涉及|include
issue|n.|議題|matter
labour|n.|勞動|workforce
legal|adj.|法律的|lawful
legislate|v.|立法|enact laws
major|adj.|主要的|primary
method|n.|方法|technique
occur|v.|發生|happen
percent|n.|百分比|percentage
period|n.|期間|interval
policy|n.|政策|regulation
principle|n.|原則|tenet
proceed|v.|進行|advance
process|n.|過程|procedure
require|v.|需要|demand
research|n.|研究|investigation
respond|v.|回應|reply
role|n.|角色|function
section|n.|部分|segment
sector|n.|部門|industry
significant|adj.|顯著的|notable
similar|adj.|相似的|comparable
source|n.|來源|origin
specific|adj.|特定的|particular
structure|n.|結構|framework
theory|n.|理論|hypothesis
vary|v.|變化|differ
variable|n.|變項|factor
consist|v.|由…組成|comprise
constitute|v.|構成|form
abstract|adj.|抽象的|conceptual
academic|adj.|學術的|scholarly
accept|v.|接受|acknowledge
access|n.|取得；途徑|entry
accompany|v.|伴隨|go with
accurate|adj.|準確的|precise
achieve|v.|達成|accomplish
acquire|v.|取得|obtain
adapt|v.|適應|adjust
adequate|adj.|足夠的|sufficient
adjacent|adj.|鄰近的|neighboring
adjust|v.|調整|modify
administration|n.|管理|governance
advocate|v.|倡議|support
affect|v.|影響|influence
aggregate|n.|總計|total
aid|n.|援助|assistance
alternative|n.|替代方案|option
ambiguous|adj.|模稜兩可的|unclear
amend|v.|修正|revise
analogy|n.|類比|comparison
annual|adj.|年度的|yearly
anticipate|v.|預期|expect
apparent|adj.|明顯的|obvious
append|v.|附加|attach
appreciate|v.|理解|value
appropriate|adj.|適當的|suitable
approximate|adj.|近似的|rough
arbitrary|adj.|任意的|random
aspect|n.|面向|facet
assemble|v.|組裝|gather
assert|v.|斷言|claim
assess|v.|評估|evaluate
assign|v.|分配|allocate
assist|v.|協助|help
assure|v.|保證|guarantee
attach|v.|附加|connect
attain|v.|達到|reach
attribute|n.|屬性|characteristic
automate|v.|自動化|mechanize
behalf|n.|代表|representation
bias|n.|偏見|prejudice
bond|n.|連結|link
brief|adj.|簡短的|concise
bulk|n.|大量|mass
capable|adj.|有能力的|able
capacity|n.|容量|capability
category|n.|類別|class
cease|v.|停止|stop
challenge|n.|挑戰|difficulty
channel|n.|管道|pathway
chapter|n.|章節|section
chart|n.|圖表|graph
circumstance|n.|情況|condition
cite|v.|引用|reference
clarify|v.|澄清|explain
classic|adj.|經典的|traditional
clause|n.|條款|provision
code|n.|法規|regulation
coherent|adj.|連貫的|logical
coincide|v.|一致|correspond
collapse|v.|崩潰|fail
colleague|n.|同事|coworker
commence|v.|開始|begin
comment|n.|評論|remark
commission|n.|委員會|committee
commit|v.|承諾|pledge
commodity|n.|商品|goods
communicate|v.|溝通|convey
community|n.|社群|group
compatible|adj.|相容的|consistent
compensate|v.|補償|reimburse
compile|v.|編纂|assemble
complement|v.|補充|supplement
complex|adj.|複雜的|intricate
component|n.|組成部分|element
compound|n.|化合物|mixture
comprehensive|adj.|全面的|thorough
comprise|v.|包含|consist of
compute|v.|計算|calculate
conceive|v.|構想|imagine
concentrate|v.|集中|focus
conceptual|adj.|概念上的|theoretical
conclude|v.|推論|infer
concurrent|adj.|同時的|simultaneous
conduct|v.|進行|carry out
confer|v.|授予|grant
confine|v.|限制|restrict
confirm|v.|確認|verify
conflict|n.|衝突|clash
conform|v.|符合|comply
consent|n.|同意|agreement
consequent|adj.|隨之而來的|resulting
considerable|adj.|相當大的|substantial
constant|adj.|恆定的|steady
constraint|n.|限制|restriction
construct|v.|建構|build
consult|v.|諮詢|advise
consume|v.|消耗|use up
contact|n.|聯繫|communication
contemporary|adj.|當代的|modern
contextual|adj.|脈絡的|situational
contradict|v.|矛盾|oppose
contrary|adj.|相反的|opposite
contrast|n.|對比|difference
contribute|v.|貢獻|donate
controversy|n.|爭議|debate
convene|v.|召集|assemble
convert|v.|轉換|transform
convince|v.|說服|persuade
cooperate|v.|合作|collaborate
coordinate|v.|協調|organize
core|n.|核心|center
corporate|adj.|企業的|organizational
correspond|v.|對應|match
couple|n.|一對|pair
criterion|n.|標準|standard
crucial|adj.|關鍵的|critical
culture|n.|文化|civilization
currency|n.|貨幣|money
cycle|n.|循環|rotation
debate|n.|辯論|discussion
decade|n.|十年|ten years
decline|v.|下降|decrease
deduce|v.|推論|infer
definite|adj.|明確的|clear
demonstrate|v.|證明|show
denote|v.|表示|indicate
deny|v.|否認|refute
depict|v.|描繪|portray
depress|v.|壓抑|lower
design|n.|設計|plan
despite|prep.|儘管|in spite of
detect|v.|偵測|discover
deviate|v.|偏離|diverge
device|n.|裝置|apparatus
devote|v.|致力|dedicate
differentiate|v.|區分|distinguish
dimension|n.|維度|aspect
diminish|v.|減少|reduce
discrete|adj.|離散的|separate
discriminate|v.|區別|distinguish
displace|v.|取代|replace
display|v.|展示|exhibit
dispose|v.|處置|discard
distinct|adj.|獨特的|unique
distort|v.|扭曲|warp
diverse|adj.|多樣的|varied
document|n.|文件|record
domain|n.|領域|field
domestic|adj.|國內的|internal
dominate|v.|主導|control
draft|n.|草稿|outline
dramatic|adj.|劇烈的|striking
duration|n.|持續時間|period
dynamic|adj.|動態的|changing
economical|adj.|節約的|efficient
edit|v.|編輯|revise
element|n.|元素|component
eliminate|v.|消除|remove
emerge|v.|浮現|appear
emphasis|n.|強調|stress
empirical|adj.|實證的|observational
enable|v.|使能夠|allow
encounter|v.|遭遇|meet
energy|n.|能量|power
enforce|v.|執行|implement
enhance|v.|強化|improve
enormous|adj.|巨大的|immense
ensure|v.|確保|guarantee
entity|n.|實體|unit
environmental|adj.|環境的|ecological
equate|v.|等同|equalize
equivalent|adj.|等價的|comparable
error|n.|誤差|mistake
estate|n.|財產|property
ethic|n.|倫理|morality
evaluate|v.|評價|assess
eventually|adv.|最終|finally
evolve|v.|演進|develop
exceed|v.|超過|surpass
exclude|v.|排除|omit
exhibit|v.|展示|display
expand|v.|擴展|enlarge
expert|n.|專家|specialist
explicit|adj.|明確的|clear
exploit|v.|利用|utilize
expose|v.|暴露|reveal
external|adj.|外部的|outside
extract|v.|提取|remove
facilitate|v.|促進|enable
feature|n.|特徵|attribute
federal|adj.|聯邦的|national
fee|n.|費用|charge
file|n.|檔案|document
final|adj.|最終的|ultimate
finite|adj.|有限的|limited
flexible|adj.|彈性的|adaptable
fluctuate|v.|波動|vary
focus|v.|聚焦|concentrate
format|n.|格式|layout
forthcoming|adj.|即將到來的|upcoming
foundation|n.|基礎|basis
framework|n.|框架|structure
fund|n.|資金|capital
fundamental|adj.|基本的|basic
furthermore|adv.|此外|moreover
gender|n.|性別|sex
generate|v.|產生|produce
generation|n.|世代|cohort
globe|n.|全球|world
goal|n.|目標|objective
grade|n.|等級|level
grant|v.|授予|award
guarantee|v.|保證|ensure
guideline|n.|指引|directive
hence|adv.|因此|thus
hierarchy|n.|階層|ranking
highlight|v.|強調|emphasize
hypothesis|n.|假說|theory
identical|adj.|相同的|same
ideology|n.|意識形態|doctrine
ignorance|n.|無知|unawareness
illustrate|v.|說明|demonstrate
image|n.|影像|picture
immigrate|v.|移民|relocate
impact|n.|影響|effect
implement|v.|實施|execute
implicate|v.|牽連|involve
implicit|adj.|隱含的|implied
imply|v.|暗示|suggest
impose|v.|強加|enforce
incentive|n.|誘因|motivation
incidence|n.|發生率|frequency
incline|v.|傾向|tend
incorporate|v.|納入|integrate
index|n.|指數|indicator
induce|v.|誘導|cause
inevitable|adj.|不可避免的|unavoidable
infer|v.|推論|deduce
infrastructure|n.|基礎建設|framework
inherent|adj.|固有的|intrinsic
inhibit|v.|抑制|restrain
initial|adj.|初始的|primary
initiate|v.|發起|begin
innovate|v.|創新|invent
input|n.|輸入|contribution
insert|v.|插入|embed
insight|n.|洞見|understanding
inspect|v.|檢查|examine
instance|n.|實例|example
institute|n.|機構|organization
instruct|v.|指導|teach
integral|adj.|不可或缺的|essential
integrate|v.|整合|combine
integrity|n.|誠信|honesty
intelligence|n.|智力|intellect
intense|adj.|強烈的|extreme
interact|v.|互動|engage
intermediate|adj.|中間的|mid-level
internal|adj.|內部的|inner
interval|n.|間隔|gap
intervene|v.|介入|intercede
intrinsic|adj.|內在的|inherent
invest|v.|投資|fund
investigate|v.|調查|examine
invoke|v.|援引|call upon
isolate|v.|隔離|separate
item|n.|項目|element
journal|n.|期刊|periodical
justify|v.|正當化|validate
label|n.|標籤|tag
layer|n.|層|stratum
lecture|n.|講座|talk
levy|v.|徵收|impose
liberal|adj.|自由的|progressive
license|n.|執照|permit
likewise|adv.|同樣地|similarly
link|v.|連結|connect
locate|v.|定位|situate
logic|n.|邏輯|reasoning
maintain|v.|維持|preserve
manifest|v.|顯現|show
manual|adj.|手動的|hand-operated
margin|n.|邊際|edge
mature|adj.|成熟的|developed
maximize|v.|最大化|optimize
mechanism|n.|機制|process
mediate|v.|調解|arbitrate
medium|n.|媒介|channel
mental|adj.|心理的|cognitive
methodology|n.|方法論|approach
migrate|v.|遷移|relocate
minimal|adj.|最小的|least
minimize|v.|最小化|reduce
minimum|n.|最小值|floor
ministry|n.|部會|department
minor|adj.|次要的|secondary
mode|n.|模式|manner
modify|v.|修改|alter
monitor|v.|監控|track
motive|n.|動機|incentive
mutual|adj.|相互的|reciprocal
negate|v.|否定|deny
network|n.|網絡|system
neutral|adj.|中立的|impartial
nevertheless|adv.|儘管如此|nonetheless
nonetheless|adv.|儘管如此|however
norm|n.|規範|standard
normal|adj.|正常的|typical
notion|n.|觀念|idea
notwithstanding|prep.|儘管|despite
nuclear|adj.|核子的|atomic
objective|n.|目標|aim
oblige|v.|迫使|compel
obtain|v.|取得|acquire
obvious|adj.|明顯的|clear
occupy|v.|佔據|inhabit
offset|v.|抵消|counterbalance
ongoing|adj.|持續的|continuing
option|n.|選項|choice
orient|v.|導向|align
outcome|n.|結果|result
output|n.|產出|product
overall|adj.|整體的|total
overlap|v.|重疊|coincide
overseas|adj.|海外的|foreign
panel|n.|小組|committee
paradigm|n.|典範|model
paragraph|n.|段落|section
parallel|adj.|平行的|analogous
parameter|n.|參數|variable
participate|v.|參與|engage
partner|n.|夥伴|associate
passive|adj.|被動的|inactive
peak|n.|高峰|summit
perceive|v.|感知|notice
persist|v.|持續|continue
perspective|n.|觀點|viewpoint
phase|n.|階段|stage
phenomenon|n.|現象|occurrence
philosophy|n.|哲學|worldview
physical|adj.|物理的|material
plus|prep.|加上|in addition to
portion|n.|部分|share
pose|v.|造成|present
positive|adj.|正面的|affirmative
potential|n.|潛力|capability
practitioner|n.|從業人員|professional
precede|v.|先於|come before
precise|adj.|精確的|exact
predict|v.|預測|forecast
predominant|adj.|占主導的|dominant
preliminary|adj.|初步的|initial
presume|v.|推定|assume
prevail|v.|盛行|dominate
primary|adj.|主要的|chief
prime|adj.|首要的|principal
principal|adj.|主要的|main
prior|adj.|先前的|earlier
priority|n.|優先順序|precedence
prohibit|v.|禁止|forbid
project|n.|專案|undertaking
promote|v.|促進|advance
proportion|n.|比例|ratio
propose|v.|提議|suggest
prospect|n.|前景|outlook
protocol|n.|協定|procedure
psychology|n.|心理學|mind science
publication|n.|出版物|release
publish|v.|出版|issue
purchase|v.|購買|buy
pursue|v.|追求|follow
qualify|v.|使具資格|certify
qualitative|adj.|質性的|descriptive
quantify|v.|量化|measure
quantitative|adj.|量化的|numerical
quote|v.|引用|cite
radical|adj.|根本的|fundamental
random|adj.|隨機的|arbitrary
range|n.|範圍|scope
ratio|n.|比率|proportion
rational|adj.|理性的|logical
react|v.|反應|respond
recover|v.|恢復|regain
refine|v.|精煉|improve
reflect|v.|反映|mirror
reform|n.|改革|revision
regime|n.|制度|system
region|n.|區域|area
register|v.|登記|record
regulate|v.|規範|control
reinforce|v.|強化|strengthen
reject|v.|拒絕|decline
relate|v.|關聯|connect
relax|v.|緩和|ease
release|v.|釋放|publish
relevant|adj.|相關的|pertinent
reliable|adj.|可靠的|dependable
reluctance|n.|不情願|hesitation
rely|v.|依賴|depend
remain|v.|保持|stay
remark|n.|評論|comment
removal|n.|移除|elimination
render|v.|使成為|make
replace|v.|取代|substitute
report|v.|報告|document
represent|v.|代表|symbolize
reputation|n.|聲譽|standing
resolve|v.|解決|settle
resource|n.|資源|asset
restore|v.|恢復|renew
restrain|v.|限制|restrict
restrict|v.|限制|limit
retain|v.|保留|keep
reveal|v.|揭示|disclose
revenue|n.|營收|income
reverse|v.|反轉|invert
revise|v.|修訂|amend
revolution|n.|革命|upheaval
rigid|adj.|僵硬的|inflexible
route|n.|路線|path
scenario|n.|情境|situation
schedule|n.|時程|timetable
scheme|n.|方案|plan
scope|n.|範圍|extent
secure|v.|確保|obtain
seek|v.|尋求|pursue
select|v.|選擇|choose
sequence|n.|序列|order
series|n.|系列|set
shift|v.|轉移|move
simulate|v.|模擬|model
site|n.|地點|location
so-called|adj.|所謂的|alleged
sole|adj.|唯一的|only
somewhat|adv.|有點|rather
specify|v.|明確指出|state
sphere|n.|領域|domain
stable|adj.|穩定的|steady
statistic|n.|統計數據|figure
status|n.|地位|standing
straightforward|adj.|直接的|simple
strategy|n.|策略|plan
stress|v.|強調|emphasize
style|n.|風格|manner
submit|v.|提交|present
subsequent|adj.|隨後的|following
subsidy|n.|補貼|grant
substitute|n.|替代品|replacement
successor|n.|繼任者|heir
sufficient|adj.|足夠的|adequate
sum|n.|總和|total
summary|n.|摘要|abstract
supplement|v.|補充|add to
survey|n.|調查|poll
survive|v.|存活|endure
suspend|v.|暫停|halt
sustain|v.|維持|maintain
symbol|n.|符號|sign
symposium|n.|研討會|conference
synthesis|n.|綜合|integration
systematic|adj.|系統性的|methodical
target|n.|目標|objective
task|n.|任務|assignment
team|n.|團隊|group
technical|adj.|技術的|specialized
technique|n.|技巧|method
technology|n.|科技|tech
temporary|adj.|暫時的|transient
terminate|v.|終止|end
text|n.|文本|passage
theme|n.|主題|topic
theoretical|adj.|理論的|conceptual
thereby|adv.|因此|thus
thesis|n.|論文|dissertation
topic|n.|主題|subject
trace|v.|追溯|track
tradition|n.|傳統|custom
transfer|v.|轉移|move
transform|v.|轉化|convert
transit|n.|運輸|passage
transmit|v.|傳輸|send
transport|v.|運輸|carry
trend|n.|趨勢|pattern
trigger|v.|觸發|activate
ultimate|adj.|終極的|final
undergo|v.|經歷|experience
underlie|v.|構成基礎|form basis
undertake|v.|承擔|take on
uniform|adj.|一致的|consistent
unify|v.|統一|integrate
unique|adj.|獨特的|distinct
utilize|v.|利用|use
valid|adj.|有效的|sound
validity|n.|效度|soundness
vehicle|n.|載具|conveyance
version|n.|版本|edition
via|prep.|經由|through
violate|v.|違反|breach
virtual|adj.|虛擬的|digital
visible|adj.|可見的|apparent
vision|n.|願景|sight
visual|adj.|視覺的|optical
volume|n.|體積|amount
voluntary|adj.|自願的|optional
welfare|n.|福利|well-being
whereas|conj.|然而|while
whereby|adv.|藉此|by which
widespread|adj.|廣泛的|extensive
withdraw|v.|撤回|retract
witness|v.|見證|observe
workshop|n.|工作坊|seminar
anthropology|n.|人類學|human study
archaeology|n.|考古學|excavation study
astronomy|n.|天文學|celestial science
biochemistry|n.|生物化學|molecular biology
biodiversity|n.|生物多樣性|species diversity
demography|n.|人口統計學|population study
ecology|n.|生態學|environmental science
econometrics|n.|計量經濟學|statistical economics
epidemiology|n.|流行病學|disease study
ethnography|n.|民族誌|cultural study
geography|n.|地理學|spatial study
geology|n.|地質學|earth science
historiography|n.|史學方法|history writing
linguistics|n.|語言學|language study
macroeconomics|n.|總體經濟學|aggregate economics
microeconomics|n.|個體經濟學|individual economics
neuroscience|n.|神經科學|brain science
paleontology|n.|古生物學|fossil study
pathology|n.|病理學|disease mechanism
pharmacology|n.|藥理學|drug science
physiology|n.|生理學|body function study
political economy|n.|政治經濟學|politico-economic study
psychometrics|n.|心理計量學|measurement psychology
semiotics|n.|符號學|sign study
sociolinguistics|n.|社會語言學|language in society
sociology|n.|社會學|social study
taxonomy|n.|分類學|classification science
virology|n.|病毒學|virus study
zoology|n.|動物學|animal study
`);

const awlMods = [
  { en: 'academic', zh: '學術' },
  { en: 'empirical', zh: '實證' },
  { en: 'theoretical', zh: '理論' },
  { en: 'conceptual', zh: '概念' },
  { en: 'systematic', zh: '系統性' },
  { en: 'rigorous', zh: '嚴謹' },
  { en: 'comprehensive', zh: '全面' },
  { en: 'interdisciplinary', zh: '跨學科' },
  { en: 'comparative', zh: '比較' },
  { en: 'critical', zh: '批判' },
  { en: 'analytical', zh: '分析' },
  { en: 'evidence-based', zh: '循證' },
  { en: 'contextual', zh: '脈絡' },
  { en: 'institutional', zh: '制度' },
  { en: 'policy-oriented', zh: '政策導向' },
  { en: 'normative', zh: '規範' },
  { en: 'descriptive', zh: '描述' },
  { en: 'explanatory', zh: '解釋' },
  { en: 'predictive', zh: '預測' },
  { en: 'causal', zh: '因果' },
];

const awlNouns = [
  ['framework', '框架', 'framework'],
  ['approach', '方法', 'approach'],
  ['methodology', '方法論', 'methodology'],
  ['inquiry', '探究', 'inquiry'],
  ['investigation', '調查', 'investigation'],
  ['study', '研究', 'study'],
  ['review', '回顧', 'review'],
  ['synthesis', '綜合', 'synthesis'],
  ['paradigm', '典範', 'paradigm'],
  ['perspective', '觀點', 'perspective'],
  ['model', '模型', 'model'],
  ['construct', '構念', 'construct'],
  ['variable', '變項', 'variable'],
  ['finding', '發現', 'finding'],
  ['conclusion', '結論', 'conclusion'],
  ['implication', '意涵', 'implication'],
  ['assumption', '假設', 'assumption'],
  ['premise', '前提', 'premise'],
  ['argument', '論證', 'argument'],
  ['debate', '辯論', 'debate'],
  ['discourse', '論述', 'discourse'],
  ['literature', '文獻', 'literature'],
  ['evidence', '證據', 'evidence'],
  ['data', '資料', 'data'],
  ['sample', '樣本', 'sample'],
  ['population', '母體', 'population'],
  ['hypothesis', '假說', 'hypothesis'],
  ['theory', '理論', 'theory'],
  ['principle', '原則', 'principle'],
  ['concept', '概念', 'concept'],
  ['context', '脈絡', 'context'],
  ['factor', '因素', 'factor'],
  ['relationship', '關係', 'relationship'],
  ['correlation', '相關', 'correlation'],
  ['validity', '效度', 'validity'],
  ['reliability', '信度', 'reliability'],
  ['significance', '顯著性', 'significance'],
  ['generalization', '推廣', 'generalization'],
  ['limitation', '限制', 'limitation'],
  ['analysis', '分析', 'analysis'],
  ['reasoning', '推理', 'reasoning'],
  ['interpretation', '詮釋', 'interpretation'],
  ['evaluation', '評估', 'evaluation'],
  ['assessment', '評量', 'assessment'],
  ['criterion', '標準', 'criterion'],
  ['indicator', '指標', 'indicator'],
  ['measure', '測量', 'measure'],
  ['metric', '度量', 'metric'],
  ['dimension', '維度', 'dimension'],
  ['category', '類別', 'category'],
  ['classification', '分類', 'classification'],
  ['taxonomy', '分類法', 'taxonomy'],
  ['terminology', '術語', 'terminology'],
  ['convention', '慣例', 'convention'],
  ['standard', '標準', 'standard'],
  ['protocol', '協定', 'protocol'],
  ['procedure', '程序', 'procedure'],
  ['process', '過程', 'process'],
  ['mechanism', '機制', 'mechanism'],
  ['structure', '結構', 'structure'],
  ['function', '功能', 'function'],
  ['role', '角色', 'role'],
  ['impact', '影響', 'impact'],
  ['outcome', '結果', 'outcome'],
  ['output', '產出', 'output'],
  ['input', '輸入', 'input'],
  ['resource', '資源', 'resource'],
  ['capacity', '能力', 'capacity'],
  ['constraint', '限制', 'constraint'],
  ['challenge', '挑戰', 'challenge'],
  ['opportunity', '機會', 'opportunity'],
  ['trend', '趨勢', 'trend'],
  ['pattern', '模式', 'pattern'],
  ['phenomenon', '現象', 'phenomenon'],
  ['issue', '議題', 'issue'],
  ['problem', '問題', 'problem'],
  ['question', '問題', 'question'],
  ['agenda', '議程', 'agenda'],
  ['priority', '優先', 'priority'],
  ['objective', '目標', 'objective'],
  ['goal', '目標', 'goal'],
  ['strategy', '策略', 'strategy'],
  ['policy', '政策', 'policy'],
  ['reform', '改革', 'reform'],
  ['innovation', '創新', 'innovation'],
  ['development', '發展', 'development'],
  ['progress', '進展', 'progress'],
  ['advance', '進展', 'advance'],
  ['change', '變化', 'change'],
  ['transformation', '轉型', 'transformation'],
  ['transition', '轉換', 'transition'],
  ['adaptation', '適應', 'adaptation'],
  ['integration', '整合', 'integration'],
  ['differentiation', '分化', 'differentiation'],
  ['specialization', '專門化', 'specialization'],
  ['diversification', '多元化', 'diversification'],
  ['consolidation', '整合', 'consolidation'],
  ['expansion', '擴張', 'expansion'],
  ['reduction', '減少', 'reduction'],
  ['increase', '增加', 'increase'],
  ['decrease', '減少', 'decrease'],
  ['growth', '成長', 'growth'],
  ['decline', '衰退', 'decline'],
  ['stability', '穩定', 'stability'],
  ['volatility', '波動', 'volatility'],
  ['uncertainty', '不確定', 'uncertainty'],
  ['risk', '風險', 'risk'],
  ['benefit', '利益', 'benefit'],
  ['cost', '成本', 'cost'],
  ['trade-off', '權衡', 'trade-off'],
  ['balance', '平衡', 'balance'],
  ['equilibrium', '均衡', 'equilibrium'],
  ['efficiency', '效率', 'efficiency'],
  ['effectiveness', '有效性', 'effectiveness'],
  ['productivity', '生產力', 'productivity'],
  ['performance', '績效', 'performance'],
  ['quality', '品質', 'quality'],
  ['quantity', '數量', 'quantity'],
  ['proportion', '比例', 'proportion'],
  ['ratio', '比率', 'ratio'],
  ['rate', '比率', 'rate'],
  ['level', '水準', 'level'],
  ['degree', '程度', 'degree'],
  ['extent', '程度', 'extent'],
  ['scope', '範圍', 'scope'],
  ['range', '範圍', 'range'],
  ['scale', '規模', 'scale'],
  ['magnitude', '幅度', 'magnitude'],
  ['frequency', '頻率', 'frequency'],
  ['duration', '持續', 'duration'],
  ['interval', '間隔', 'interval'],
  ['sequence', '序列', 'sequence'],
  ['cycle', '循環', 'cycle'],
  ['phase', '階段', 'phase'],
  ['stage', '階段', 'stage'],
  ['step', '步驟', 'step'],
  ['component', '組成', 'component'],
  ['element', '元素', 'element'],
  ['unit', '單位', 'unit'],
  ['entity', '實體', 'entity'],
  ['system', '系統', 'system'],
  ['network', '網絡', 'network'],
  ['sector', '部門', 'sector'],
  ['domain', '領域', 'domain'],
  ['field', '領域', 'field'],
  ['discipline', '學科', 'discipline'],
  ['tradition', '傳統', 'tradition'],
  ['heritage', '遺產', 'heritage'],
  ['legacy', '遺留', 'legacy'],
  ['foundation', '基礎', 'foundation'],
  ['basis', '基礎', 'basis'],
  ['ground', '根據', 'ground'],
  ['source', '來源', 'source'],
  ['origin', '起源', 'origin'],
  ['cause', '原因', 'cause'],
  ['effect', '效果', 'effect'],
  ['consequence', '後果', 'consequence'],
  ['result', '結果', 'result'],
];

const researchCore = parseBlock(`
hypothesis|n.|假說|theory
variable|n.|變項|factor
longitudinal|adj.|縱向的|over time
control group|n.|對照組|comparison group
peer review|n.|同儕審查|referee process
citation|n.|引用|reference
abstract|n.|摘要|summary
correlation|n.|相關|association
causation|n.|因果關係|cause-effect
sampling|n.|抽樣|sample selection
validity|n.|效度|soundness
reliability|n.|信度|consistency
ethnography|n.|民族誌|field study
meta-analysis|n.|後設分析|systematic review
randomization|n.|隨機化|random assignment
blinding|n.|盲法|masking
placebo|n.|安慰劑|sham treatment
confounder|n.|混淆因子|confounding variable
operationalization|n.|操作化|measurement definition
triangulation|n.|三角驗證|multi-method validation
purposive sampling|n.|立意抽樣|targeted sampling
snowball sampling|n.|滾雪球抽樣|chain referral
stratified sampling|n.|分層抽樣|layered sampling
cluster sampling|n.|叢集抽樣|group sampling
systematic sampling|n.|系統抽樣|interval sampling
convenience sampling|n.|便利抽樣|availability sampling
probability sampling|n.|機率抽樣|random sampling
nonprobability sampling|n.|非機率抽樣|non-random sampling
representative sample|n.|代表性樣本|typical sample
sample size|n.|樣本數|n count
statistical power|n.|統計檢定力|power analysis
effect size|n.|效果量|magnitude of effect
p-value|n.|p 值|significance probability
confidence interval|n.|信賴區間|CI
standard deviation|n.|標準差|SD
standard error|n.|標準誤|SE
variance|n.|變異數|spread
mean|n.|平均數|average
median|n.|中位數|middle value
mode|n.|眾數|most frequent
regression|n.|迴歸|linear model
multivariate analysis|n.|多變量分析|multivariable analysis
factor analysis|n.|因子分析|dimension reduction
principal component analysis|n.|主成分分析|PCA
structural equation modeling|n.|結構方程模型|SEM
ANOVA|n.|變異數分析|analysis of variance
ANCOVA|n.|共變數分析|analysis of covariance
MANOVA|n.|多變量變異數分析|multivariate ANOVA
chi-square test|n.|卡方檢定|goodness of fit
t-test|n.|t 檢定|mean comparison
Mann-Whitney test|n.|曼惠特尼檢定|nonparametric test
Wilcoxon test|n.|威爾科克森檢定|signed-rank test
Kruskal-Wallis test|n.|克魯斯卡爾－瓦利斯檢定|nonparametric ANOVA
logistic regression|n.|邏輯迴歸|binary outcome model
Cox regression|n.|Cox 迴歸|survival analysis
survival analysis|n.|存活分析|time-to-event analysis
hazard ratio|n.|風險比|HR
odds ratio|n.|勝算比|OR
relative risk|n.|相對風險|RR
incidence rate|n.|發生率|new case rate
prevalence rate|n.|盛行率|existing case rate
longitudinal cohort|n.|縱向世代|prospective cohort
retrospective study|n.|回溯研究|backward-looking study
prospective study|n.|前瞻研究|forward-looking study
cross-sectional study|n.|橫斷面研究|snapshot study
case-control study|n.|病例對照研究|case comparison
cohort study|n.|世代研究|follow-up study
randomized controlled trial|n.|隨機對照試驗|RCT
quasi-experiment|n.|準實驗|non-random experiment
natural experiment|n.|自然實驗|exogenous variation
field experiment|n.|田野實驗|real-world trial
laboratory experiment|n.|實驗室實驗|controlled lab study
within-subjects design|n.|受試者內設計|repeated measures
between-subjects design|n.|受試者間設計|independent groups
mixed design|n.|混合設計|combined design
counterbalanced design|n.|平衡設計|order control
factorial design|n.|因子設計|multi-factor design
repeated measures|n.|重複測量|within-subject
independent variable|n.|自變項|predictor
dependent variable|n.|依變項|outcome
moderator variable|n.|調節變項|interaction variable
mediator variable|n.|中介變項|intervening variable
latent variable|n.|潛在變項|unobserved construct
manifest variable|n.|顯在變項|observed variable
dummy variable|n.|虛擬變項|indicator variable
covariate|n.|共變項|control variable
extraneous variable|n.|外來變項|nuisance variable
internal validity|n.|內部效度|causal validity
external validity|n.|外部效度|generalizability
construct validity|n.|構念效度|measure validity
face validity|n.|表面效度|apparent validity
content validity|n.|內容效度|coverage validity
criterion validity|n.|效標效度|predictive validity
convergent validity|n.|聚合效度|converging evidence
discriminant validity|n.|區辨效度|distinctiveness
test-retest reliability|n.|再測信度|stability
inter-rater reliability|n.|評分者信度|agreement
Cronbach alpha|n.|Cronbach α|internal consistency
measurement error|n.|測量誤差|observation error
sampling error|n.|抽樣誤差|selection error
response bias|n.|反應偏誤|answering bias
selection bias|n.|選擇偏誤|non-random selection
publication bias|n.|發表偏誤|reporting bias
confirmation bias|n.|確認偏誤|seeking support
recall bias|n.|回憶偏誤|memory distortion
observer bias|n.|觀察者偏誤|expectancy effect
Hawthorne effect|n.|霍桑效應|behavior change
placebo effect|n.|安慰劑效應|expectancy effect
demand characteristic|n.|需求特徵|cues to hypothesis
experimenter bias|n.|實驗者偏誤|researcher effect
social desirability bias|n.|社會期許偏誤|impression management
ceiling effect|n.|天花板效應|upper bound
floor effect|n.|地板效應|lower bound
regression to the mean|n.|迴歸均值|statistical artifact
Type I error|n.|第一型錯誤|false positive
Type II error|n.|第二型錯誤|false negative
null hypothesis|n.|虛無假說|H0
alternative hypothesis|n.|對立假說|H1
significance level|n.|顯著水準|alpha
Bonferroni correction|n.|Bonferroni 校正|multiple comparison
false discovery rate|n.|偽發現率|FDR
multiple comparison|n.|多重比較|post-hoc test
post-hoc test|n.|事後檢定|follow-up test
Tukey test|n.|Tukey 檢定|HSD test
Scheffe test|n.|Scheffe 檢定|omnibus follow-up
literature review|n.|文獻回顧|scholarly review
systematic review|n.|系統性回顧|evidence synthesis
scoping review|n.|範疇評述|mapping review
narrative review|n.|敘述性回顧|qualitative review
PRISMA guideline|n.|PRISMA 指引|reporting standard
Cochrane review|n.|Cochrane 回顧|evidence review
research question|n.|研究問題|RQ
research objective|n.|研究目標|study aim
research design|n.|研究設計|study plan
research protocol|n.|研究方案|study protocol
research ethics|n.|研究倫理|ethical conduct
informed consent|n.|知情同意|voluntary agreement
institutional review board|n.|機構審查委員會|IRB
debriefing|n.|事後說明|post-study explanation
anonymization|n.|匿名化|identity removal
confidentiality|n.|保密|privacy protection
data management plan|n.|資料管理計畫|DMP
reproducibility|n.|可重現性|replication
replicability|n.|可複製性|repeatability
open science|n.|開放科學|transparent research
pre-registration|n.|預先登錄|study registration
data repository|n.|資料庫|archive
codebook|n.|編碼手冊|variable guide
coding scheme|n.|編碼方案|classification system
interview guide|n.|訪談指引|question protocol
focus group|n.|焦點團體|group interview
semi-structured interview|n.|半結構式訪談|guided interview
structured interview|n.|結構式訪談|fixed questions
unstructured interview|n.|非結構式訪談|open conversation
participant observation|n.|參與觀察|field immersion
grounded theory|n.|紮根理論|inductive theory
phenomenology|n.|現象學|lived experience study
case study method|n.|個案研究法|in-depth case
action research|n.|行動研究|participatory inquiry
mixed methods|n.|混合方法|qual-quant integration
convergent design|n.|聚合設計|parallel mixed methods
explanatory sequential design|n.|解釋性序列設計|quant then qual
exploratory sequential design|n.|探索性序列設計|qual then quant
embedded design|n.|嵌入設計|nested methods
transformative framework|n.|轉化框架|advocacy lens
deductive coding|n.|演繹式編碼|theory-driven coding
inductive coding|n.|歸納式編碼|emergent coding
thematic analysis|n.|主題分析|theme identification
content analysis|n.|內容分析|text coding
discourse analysis|n.|論述分析|language study
narrative analysis|n.|敘事分析|story analysis
conversation analysis|n.|會話分析|talk-in-interaction
critical discourse analysis|n.|批判論述分析|CDA
corpus linguistics|n.|語料庫語言學|text corpus study
computer-assisted qualitative analysis|n.|電腦輔助質性分析|CAQDAS
memo writing|n.|備忘錄撰寫|analytic memo
saturation|n.|飽和|thematic saturation
thick description|n.|厚描|rich account
member checking|n.|成員檢核|participant validation
audit trail|n.|稽核軌跡|decision record
reflexivity|n.|反身性|researcher awareness
positionality|n.|位置性|standpoint
epistemology|n.|認識論|theory of knowledge
ontology|n.|存在論|nature of reality
positivism|n.|實證主義|objectivist paradigm
interpretivism|n.|詮釋主義|subjectivist paradigm
critical realism|n.|批判實在論|realist ontology
pragmatism|n.|實用主義|problem-driven philosophy
research paradigm|n.|研究典範|worldview
methodological triangulation|n.|方法三角驗證|multi-method
data triangulation|n.|資料三角驗證|multi-source
investigator triangulation|n.|研究者三角驗證|multi-researcher
theoretical triangulation|n.|理論三角驗證|multi-theory
member validation|n.|成員驗證|participant feedback
transferability|n.|可轉移性|applicability
dependability|n.|可信賴性|consistency audit
confirmability|n.|可確認性|neutrality check
credibility|n.|可信度|trustworthiness
authenticity|n.|真實性|genuine representation
peer debriefing|n.|同儕反饋|colleague review
negative case analysis|n.|反例分析|deviant case
constant comparison|n.|持續比較|iterative coding
axial coding|n.|主軸編碼|category linking
selective coding|n.|選擇性編碼|core category
open coding|n.|開放編碼|initial coding
memoing|n.|備忘|analytic writing
visualization|n.|視覺化|graphical display
descriptive statistics|n.|描述統計|summary stats
inferential statistics|n.|推論統計|hypothesis testing
bivariate analysis|n.|雙變量分析|two-variable
multicollinearity|n.|多重共線性|correlated predictors
heteroskedasticity|n.|異質變異|unequal variance
autocorrelation|n.|自我相關|serial correlation
outlier|n.|離群值|extreme value
missing data|n.|缺失資料|incomplete cases
imputation|n.|插補|missing value fill
listwise deletion|n.|列刪除|complete case
pairwise deletion|n.|成對刪除|available case
sensitivity analysis|n.|敏感度分析|robustness check
robustness check|n.|穩健性檢驗|alternative spec
specification|n.|模型設定|model form
model fit|n.|模型配適|goodness of fit
goodness of fit|n.|配適度|model adequacy
Akaike information criterion|n.|Akaike 資訊準則|AIC
Bayesian information criterion|n.|Bayesian 資訊準則|BIC
cross-validation|n.|交叉驗證|holdout validation
bootstrapping|n.|Bootstrap 法|resampling
Monte Carlo simulation|n.|蒙地卡羅模擬|random simulation
Bayesian inference|n.|貝氏推論|posterior updating
prior distribution|n.|先驗分布|prior belief
posterior distribution|n.|後驗分布|updated belief
likelihood|n.|概似|probability function
maximum likelihood estimation|n.|最大概似估計|MLE
ordinary least squares|n.|普通最小平方法|OLS
generalized linear model|n.|廣義線性模型|GLM
generalized estimating equations|n.|廣義估計方程|GEE
mixed-effects model|n.|混合效果模型|hierarchical model
hierarchical linear modeling|n.|階層線性模型|HLM
multilevel modeling|n.|多層次模型|nested data model
time series analysis|n.|時間序列分析|temporal analysis
panel data analysis|n.|面板資料分析|longitudinal data
instrumental variable|n.|工具變項|IV
propensity score matching|n.|傾向分數配對|PSM
difference-in-differences|n.|差異中的差異|DiD
regression discontinuity|n.|迴歸不連續|RDD
natural language processing|n.|自然語言處理|NLP
machine learning pipeline|n.|機器學習流程|ML workflow
feature engineering|n.|特徵工程|variable creation
training set|n.|訓練集|model training data
validation set|n.|驗證集|tuning data
test set|n.|測試集|evaluation data
overfitting|n.|過度配適|model complexity
underfitting|n.|配適不足|oversimplified model
bias-variance tradeoff|n.|偏差變異權衡|model error tradeoff
classification accuracy|n.|分類準確率|correct rate
precision|n.|精確率|positive predictive value
recall|n.|召回率|sensitivity
F1 score|n.|F1 分數|harmonic mean
ROC curve|n.|ROC 曲線|receiver operating characteristic
AUC|n.|曲線下面積|area under curve
confusion matrix|n.|混淆矩陣|error table
k-fold cross-validation|n.|k 折交叉驗證|k-fold CV
hyperparameter tuning|n.|超參數調整|model tuning
random forest|n.|隨機森林|ensemble trees
gradient boosting|n.|梯度提升|boosted trees
support vector machine|n.|支持向量機|SVM
neural network|n.|神經網路|deep learning model
cluster analysis|n.|叢集分析|grouping method
k-means clustering|n.|k 均值叢集|partition clustering
hierarchical clustering|n.|階層叢集|tree clustering
dimensionality reduction|n.|降維|feature reduction
data visualization|n.|資料視覺化|graphical analysis
box plot|n.|箱型圖|box-and-whisker
scatter plot|n.|散佈圖|XY plot
histogram|n.|直方圖|frequency chart
heatmap|n.|熱圖|color matrix
forest plot|n.|森林圖|effect size plot
funnel plot|n.|漏斗圖|publication bias plot
research instrument|n.|研究工具|measure tool
Likert scale|n.|李克特量表|rating scale
semantic differential|n.|語意差異法|bipolar scale
questionnaire design|n.|問卷設計|survey design
survey instrument|n.|調查工具|questionnaire
pilot study|n.|試驗研究|preliminary study
feasibility study|n.|可行性研究|viability assessment
manipulation check|n.|操弄檢核|treatment verification
attention check|n.|注意力檢核|quality filter
inclusion criterion|n.|納入標準|eligibility rule
exclusion criterion|n.|排除標準|disqualifier
recruitment strategy|n.|招募策略|participant sourcing
retention strategy|n.|留樣策略|follow-up plan
attrition|n.|流失|dropout
mortality bias|n.|流失偏誤|dropout bias
generalizability|n.|可推廣性|external validity
ecological validity|n.|生態效度|real-world relevance
statistical conclusion validity|n.|統計結論效度|inference validity
manipulation validity|n.|操弄效度|treatment validity
history threat|n.|歷史威脅|external event
maturation threat|n.|成熟威脅|natural change
testing threat|n.|測驗威脅|practice effect
instrumentation threat|n.|工具威脅|measure change
regression threat|n.|迴歸威脅|mean reversion
selection threat|n.|選取威脅|group difference
mortality threat|n.|流失威脅|differential dropout
interaction threat|n.|交互作用威脅|combined threats
counterfactual|n.|反事實|what-if scenario
naturalistic observation|n.|自然觀察|unobtrusive watch
structured observation|n.|結構觀察|coded observation
coding manual|n.|編碼手冊|observer guide
intercoder reliability|n.|編碼者信度|agreement rate
Kappa coefficient|n.|Kappa 係數|agreement index
document analysis|n.|文件分析|record review
archival research|n.|檔案研究|historical records
bibliometric analysis|n.|書目計量分析|citation analysis
citation network|n.|引用網絡|reference graph
h-index|n.|h 指數|research impact index
impact factor|n.|影響因子|journal metric
open access|n.|開放取用|free publication
preprint|n.|預印本|early manuscript
postprint|n.|後印本|accepted manuscript
retraction|n.|撤稿|paper withdrawal
research integrity|n.|研究誠信|scholarly honesty
plagiarism|n.|抄襲|intellectual theft
data fabrication|n.|資料造假|falsification
data falsification|n.|資料篡改|data manipulation
authorship criteria|n.|作者資格|contributor standard
corresponding author|n.|通訊作者|contact author
co-authorship|n.|共同作者|shared authorship
acknowledgment section|n.|致謝部分|credit section
conflict of interest|n.|利益衝突|competing interest
funding disclosure|n.|經費揭露|grant statement
replication study|n.|複製研究|repeat experiment
direct replication|n.|直接複製|exact repeat
conceptual replication|n.|概念複製|theory test repeat
registered report|n.|預登錄報告|stage-one acceptance
data sharing policy|n.|資料分享政策|open data rule
FAIR principles|n.|FAIR 原則|findable accessible data
metadata standard|n.|詮釋資料標準|data description
DOI|n.|數位物件識別碼|digital identifier
ORCID|n.|ORCID 識別碼|researcher ID
grant proposal|n.|計畫書|funding application
research grant|n.|研究補助|funding award
literature gap|n.|文獻缺口|research gap
theoretical contribution|n.|理論貢獻|conceptual advance
practical implication|n.|實務意涵|applied relevance
policy implication|n.|政策意涵|policy relevance
limitation section|n.|限制章節|study limits
future research|n.|未來研究|next steps
discussion section|n.|討論章節|interpretation section
methods section|n.|方法章節|procedure section
results section|n.|結果章節|findings section
introduction section|n.|緒論章節|background section
`);

const researchMods = [
  { en: 'qualitative', zh: '質性' },
  { en: 'quantitative', zh: '量化' },
  { en: 'experimental', zh: '實驗' },
  { en: 'observational', zh: '觀察' },
  { en: 'comparative', zh: '比較' },
  { en: 'longitudinal', zh: '縱向' },
  { en: 'cross-sectional', zh: '橫斷面' },
  { en: 'mixed-method', zh: '混合方法' },
  { en: 'systematic', zh: '系統性' },
  { en: 'rigorous', zh: '嚴謹' },
  { en: 'exploratory', zh: '探索性' },
  { en: 'confirmatory', zh: '驗證性' },
  { en: 'descriptive', zh: '描述性' },
  { en: 'inferential', zh: '推論' },
  { en: 'causal', zh: '因果' },
];

const researchNouns = [
  ['design', '設計', 'design'],
  ['framework', '框架', 'framework'],
  ['method', '方法', 'method'],
  ['approach', '取向', 'approach'],
  ['protocol', '方案', 'protocol'],
  ['procedure', '程序', 'procedure'],
  ['analysis', '分析', 'analysis'],
  ['inference', '推論', 'inference'],
  ['sampling strategy', '抽樣策略', 'sampling plan'],
  ['data collection', '資料蒐集', 'data gathering'],
  ['measurement model', '測量模型', 'measurement framework'],
  ['research report', '研究報告', 'study report'],
  ['evidence synthesis', '證據綜整', 'evidence review'],
  ['literature search', '文獻搜尋', 'database search'],
  ['coding process', '編碼流程', 'coding workflow'],
  ['validation strategy', '驗證策略', 'validation plan'],
  ['ethical review', '倫理審查', 'ethics review'],
  ['statistical model', '統計模型', 'stat model'],
  ['hypothesis test', '假說檢定', 'significance test'],
  ['effect estimation', '效果估計', 'effect estimate'],
  ['sensitivity test', '敏感度檢驗', 'robustness test'],
  ['replication plan', '複製計畫', 'replication design'],
  ['publication strategy', '發表策略', 'dissemination plan'],
  ['research agenda', '研究議程', 'research roadmap'],
  ['knowledge claim', '知識主張', 'epistemic claim'],
  ['finding interpretation', '發現詮釋', 'result reading'],
  ['variable definition', '變項定義', 'operational definition'],
  ['survey design', '調查設計', 'questionnaire plan'],
  ['interview protocol', '訪談方案', 'interview plan'],
  ['observation schedule', '觀察表', 'observation plan'],
  ['case selection', '個案選取', 'case sampling'],
  ['theoretical model', '理論模型', 'conceptual model'],
  ['research question', '研究問題', 'study question'],
  ['study limitation', '研究限制', 'design limitation'],
  ['data quality check', '資料品質檢核', 'data audit'],
  ['peer review process', '同儕審查流程', 'referee process'],
  ['meta-analytic review', '後設分析回顧', 'meta review'],
  ['causal inference', '因果推論', 'cause inference'],
  ['generalization claim', '推廣主張', 'generalization'],
  ['research collaboration', '研究合作', 'team science'],
  ['funding strategy', '經費策略', 'grant strategy'],
];

const biologyCore = parseBlock(`
homeostasis|n.|恆定狀態|steady state
mitosis|n.|有絲分裂|cell division
meiosis|n.|減數分裂|gamete formation
allele|n.|對偶基因|gene variant
phenotype|n.|表型|observable trait
genotype|n.|基因型|genetic makeup
trophic level|n.|營養階層|feeding level
carrying capacity|n.|環境容載量|K limit
keystone species|n.|關鍵物種|ecosystem anchor
ecosystem|n.|生態系|biotic community
biome|n.|生物群系|major habitat
biodiversity hotspot|n.|生物多樣性熱點|species-rich region
niche partitioning|n.|生態位分割|resource division
competitive exclusion|n.|競爭排除|Gause principle
symbiosis|n.|共生|mutual relationship
mutualism|n.|互利共生|beneficial symbiosis
parasitism|n.|寄生|host exploitation
commensalism|n.|偏利共生|one-sided benefit
predation|n.|捕食|consumer-prey
herbivory|n.|草食|plant consumption
decomposition|n.|分解|organic breakdown
nutrient cycling|n.|營養循環|biogeochemical cycle
carbon cycle|n.|碳循環|C cycle
nitrogen cycle|n.|氮循環|N cycle
phosphorus cycle|n.|磷循環|P cycle
primary productivity|n.|初級生產力|autotrophic output
secondary productivity|n.|次級生產力|consumer biomass
gross primary productivity|n.|總初級生產力|GPP
net primary productivity|n.|淨初級生產力|NPP
food web|n.|食物網|feeding network
food chain|n.|食物鏈|linear feeding
energy pyramid|n.|能量金字塔|trophic pyramid
biomagnification|n.|生物放大|toxin accumulation
bioaccumulation|n.|生物累積|substance buildup
ecological succession|n.|生態演替|community change
primary succession|n.|初演替|bare substrate
secondary succession|n.|次演替|disturbed habitat
climax community|n.|極相群落|stable endpoint
pioneer species|n.|先驅物種|early colonizer
invasive species|n.|入侵物種|non-native spread
endemic species|n.|特有種|local native
extinction rate|n.|滅絕率|species loss rate
conservation biology|n.|保育生物學|biodiversity science
habitat fragmentation|n.|棲地破碎化|habitat loss
edge effect|n.|邊緣效應|boundary impact
corridor ecology|n.|廊道生態|wildlife corridor
metapopulation|n.|嵌套族群|patch network
founder effect|n.|創始者效應|genetic drift
bottleneck effect|n.|瓶頸效應|population shrink
genetic drift|n.|遺傳漂變|random allele change
gene flow|n.|基因流|migration of alleles
natural selection|n.|天擇|differential survival
sexual selection|n.|性擇|mate choice pressure
directional selection|n.|方向性選擇|trait shift
stabilizing selection|n.|穩定化選擇|trait maintenance
disruptive selection|n.|分裂性選擇|trait divergence
adaptation|n.|適應|evolutionary fit
fitness|n.|適存度|reproductive success
speciation|n.|物種形成|new species origin
allopatric speciation|n.|異域物種形成|geographic isolation
sympatric speciation|n.|同域物種形成|same-area divergence
reproductive isolation|n.|生殖隔離|breeding barrier
hybrid zone|n.|雜交帶|interbreeding area
phylogeny|n.|系統發生|evolutionary tree
cladistics|n.|支序分類|branch analysis
molecular clock|n.|分子鐘|mutation rate dating
convergent evolution|n.|趨同演化|similar trait evolution
coevolution|n.|共同演化|reciprocal adaptation
endosymbiosis|n.|內共生|organelle origin
horizontal gene transfer|n.|水平基因轉移|lateral transfer
CRISPR|n.|CRISPR 基因編輯|genome editing
genome|n.|基因組|full DNA set
chromosome|n.|染色體|DNA package
chromatin|n.|染色質|DNA-protein complex
nucleosome|n.|核小體|DNA wrap unit
histone|n.|組蛋白|chromatin protein
DNA replication|n.|DNA 複製|genome duplication
transcription|n.|轉錄|RNA synthesis
translation|n.|轉譯|protein synthesis
messenger RNA|n.|信使 RNA|mRNA
transfer RNA|n.|轉運 RNA|tRNA
ribosome|n.|核糖體|protein factory
codon|n.|密碼子|triplet code
mutation|n.|突變|genetic change
point mutation|n.|點突變|single base change
frameshift mutation|n.|移碼突變|reading frame shift
insertion mutation|n.|插入突變|added sequence
deletion mutation|n.|缺失突變|lost sequence
silent mutation|n.|同義突變|noncoding change
missense mutation|n.|錯義突變|amino acid change
nonsense mutation|n.|無義突變|stop codon
dominant allele|n.|顯性對偶基因|dominant trait
recessive allele|n.|隱性對偶基因|recessive trait
homozygous|adj.|同型合子|same alleles
heterozygous|adj.|異型合子|different alleles
linkage|n.|連鎖|gene association
crossing over|n.|交換|recombination
recombination|n.|重組|genetic shuffle
epistasis|n.|上位性|gene interaction
pleiotropy|n.|多效性|multi-trait effect
polygenic inheritance|n.|多基因遺傳|many-gene trait
quantitative trait locus|n.|數量性狀基因座|QTL
genetic marker|n.|遺傳標記|DNA marker
SNP|n.|單核苷酸多型|single nucleotide polymorphism
PCR|n.|聚合酶連鎖反應|DNA amplification
gel electrophoresis|n.|膠電泳|DNA separation
Western blot|n.|西方墨點法|protein detection
Northern blot|n.|北方墨點法|RNA detection
Southern blot|n.|南方墨點法|DNA detection
DNA sequencing|n.|DNA 定序|base reading
next-generation sequencing|n.|次世代定序|NGS
bioinformatics|n.|生物資訊|computational biology
proteomics|n.|蛋白質體學|protein study
metabolomics|n.|代謝體學|metabolite study
transcriptomics|n.|轉錄體學|RNA profile study
genomics|n.|基因體學|genome study
epigenetics|n.|表觀遺傳|gene regulation
DNA methylation|n.|DNA 甲基化|gene silencing
histone modification|n.|組蛋白修飾|chromatin change
gene expression|n.|基因表現|protein production
regulatory sequence|n.|調控序列|control region
promoter region|n.|啟動子區|transcription start
enhancer region|n.|增強子區|expression boost
operator region|n.|操作子區|regulatory site
operon|n.|操縱子|gene cluster
lac operon|n.|乳糖操縱子|lactose genes
repressor protein|n.|阻抑蛋白|gene blocker
activator protein|n.|活化蛋白|gene enhancer
signal transduction|n.|訊號傳導|cell signaling
receptor protein|n.|受體蛋白|signal receiver
ligand|n.|配體|binding molecule
second messenger|n.|第二信使|intracellular signal
kinase cascade|n.|激酶級聯|phosphorylation chain
phosphorylation|n.|磷酸化|protein activation
ATP synthase|n.|ATP 合成酶|energy enzyme
cellular respiration|n.|細胞呼吸|energy release
glycolysis|n.|糖解作用|glucose breakdown
Krebs cycle|n.|克雷布斯循環|citric acid cycle
electron transport chain|n.|電子傳遞鏈|ETC
oxidative phosphorylation|n.|氧化磷酸化|ATP generation
photosynthesis|n.|光合作用|light energy capture
Calvin cycle|n.|卡爾文循環|carbon fixation
light reaction|n.|光反應|photochemical stage
chloroplast|n.|葉綠體|photosynthetic organelle
mitochondrion|n.|粒線體|energy organelle
endoplasmic reticulum|n.|內質網|protein transport
Golgi apparatus|n.|高基氏體|protein packaging
lysosome|n.|溶酶體|digestive organelle
peroxisome|n.|過氧化物酶體|detox organelle
cytoskeleton|n.|細胞骨架|cell structure
microtubule|n.|微管|tubulin filament
microfilament|n.|微絲|actin filament
cell membrane|n.|細胞膜|plasma membrane
phospholipid bilayer|n.|磷脂雙層|membrane layer
osmosis|n.|滲透|water diffusion
diffusion|n.|擴散|passive spread
active transport|n.|主動運輸|energy-driven transport
facilitated diffusion|n.|促進性擴散|carrier transport
endocytosis|n.|胞吞|cell ingestion
exocytosis|n.|胞吐|cell secretion
membrane potential|n.|膜電位|voltage gradient
action potential|n.|動作電位|nerve impulse
synapse|n.|突觸|nerve junction
neurotransmitter|n.|神經傳導物質|signal chemical
hormone|n.|激素|endocrine signal
endocrine gland|n.|內分泌腺|hormone gland
feedback inhibition|n.|回饋抑制|regulatory loop
negative feedback|n.|負回饋|stabilizing control
positive feedback|n.|正回饋|amplifying control
immune response|n.|免疫反應|defense reaction
antibody|n.|抗體|immunoglobulin
antigen|n.|抗原|immune trigger
T cell|n.|T 細胞|cell-mediated immunity
B cell|n.|B 細胞|antibody producer
macrophage|n.|巨噬細胞|phagocyte
inflammation|n.|發炎|immune response
vaccination|n.|疫苗接種|immunization
pathogen|n.|病原體|disease agent
virulence|n.|毒力|pathogenic strength
host-pathogen interaction|n.|宿主病原互作|infection dynamics
zoonosis|n.|人畜共通传染病|animal-to-human disease
epidemic|n.|流行病|outbreak
pandemic|n.|全球大流行|worldwide outbreak
population ecology|n.|族群生態|demography ecology
population density|n.|族群密度|individuals per area
population growth rate|n.|族群成長率|growth metric
logistic growth|n.|邏輯斯谛生長|S-curve growth
exponential growth|n.|指數生長|J-curve growth
r-selected species|n.|r 選擇物種|fast reproducer
K-selected species|n.|K 選擇物種|slow reproducer
life history strategy|n.|生活史策略|reproductive strategy
age structure|n.|年齡結構|population pyramid
survivorship curve|n.|存活曲線|mortality pattern
fecundity|n.|生育力|reproductive output
mortality rate|n.|死亡率|death rate
immigration rate|n.|移入率|inflow rate
emigration rate|n.|移出率|outflow rate
demographic transition|n.|人口轉型|population shift
Allee effect|n.|Allee 效應|group threshold
density-dependent factor|n.|密度依存因子|crowding effect
density-independent factor|n.|密度獨立因子|environment shock
limiting factor|n.|限制因子|growth constraint
Liebig law of the minimum|n.|最低律|limiting nutrient
ecological footprint|n.|生態足跡|resource demand
sustainability|n.|永續性|long-term balance
restoration ecology|n.|復育生態|habitat repair
rewilding|n.|再野化|ecosystem restoration
climate change ecology|n.|氣候變遷生態|warming impact
phenological shift|n.|物候位移|timing change
range shift|n.|分布位移|habitat migration
ocean acidification|n.|海洋酸化|pH decline
coral bleaching|n.|珊瑚白化|symbiont loss
eutrophication|n.|優養化|nutrient overload
hypoxia zone|n.|缺氧區|dead zone
deforestation|n.|森林砍伐|forest loss
desertification|n.|沙漠化|land degradation
`);

const biologyMods = [
  { en: 'cellular', zh: '細胞' },
  { en: 'molecular', zh: '分子' },
  { en: 'genetic', zh: '遺傳' },
  { en: 'evolutionary', zh: '演化' },
  { en: 'ecological', zh: '生態' },
  { en: 'physiological', zh: '生理' },
  { en: 'microbial', zh: '微生物' },
  { en: 'developmental', zh: '發育' },
  { en: 'behavioral', zh: '行為' },
  { en: 'marine', zh: '海洋' },
  { en: 'terrestrial', zh: '陸域' },
  { en: 'aquatic', zh: '水域' },
];

const biologyNouns = [
  ['mechanism', '機制', 'mechanism'],
  ['pathway', '途徑', 'pathway'],
  ['regulation', '調控', 'regulation'],
  ['adaptation', '適應', 'adaptation'],
  ['interaction', '互作', 'interaction'],
  ['dynamics', '動態', 'dynamics'],
  ['structure', '結構', 'structure'],
  ['function', '功能', 'function'],
  ['process', '過程', 'process'],
  ['cycle', '循環', 'cycle'],
  ['network', '網絡', 'network'],
  ['system', '系統', 'system'],
  ['response', '反應', 'response'],
  ['stress', '壓力', 'stress'],
  ['tolerance', '耐受', 'tolerance'],
  ['diversity', '多樣性', 'diversity'],
  ['distribution', '分布', 'distribution'],
  ['productivity', '生產力', 'productivity'],
  ['stability', '穩定', 'stability'],
  ['resilience', '韌性', 'resilience'],
  ['succession', '演替', 'succession'],
  ['competition', '競爭', 'competition'],
  ['symbiosis', '共生', 'symbiosis'],
  ['selection pressure', '選擇壓力', 'selection force'],
  ['genetic variation', '遺傳變異', 'allele diversity'],
  ['expression pattern', '表現模式', 'expression profile'],
  ['signaling cascade', '訊號級聯', 'signal chain'],
  ['metabolic flux', '代謝流', 'metabolite flow'],
  ['homeostatic control', '恆定調控', 'steady control'],
  ['developmental stage', '發育階段', 'life stage'],
  ['reproductive strategy', '繁殖策略', 'breeding plan'],
  ['community structure', '群落結構', 'community pattern'],
  ['trophic interaction', '營養互作', 'feeding link'],
  ['habitat preference', '棲地偏好', 'site choice'],
  ['conservation strategy', '保育策略', 'protection plan'],
  ['climate response', '氣候反應', 'warming response'],
  ['disease ecology', '疾病生態', 'infection ecology'],
  ['immune defense', '免疫防禦', 'immune protection'],
  ['energy budget', '能量預算', 'energy balance'],
  ['nutrient limitation', '營養限制', 'nutrient constraint'],
];

const awlSeeds = dedupe([...awlCore, ...expand(awlMods, awlNouns)]);
const researchSeeds = dedupe([...researchCore, ...expand(researchMods, researchNouns)]);
const biologySeeds = dedupe([...biologyCore, ...expand(biologyMods, biologyNouns)]);

if (awlSeeds.length < 700) throw new Error(`AWL seeds only ${awlSeeds.length}`);
if (researchSeeds.length < 500) throw new Error(`Research seeds only ${researchSeeds.length}`);
if (biologySeeds.length < 450) throw new Error(`Biology seeds only ${biologySeeds.length}`);

const body = `/** Auto-generated TOEFL L2 vocabulary seeds — do not edit by hand; run generate-toefl-l2-seeds.mjs */
function e(w,p,z,s){return [w,p,z,s];}

export const awlSeeds = ${JSON.stringify(awlSeeds, null, 2)};

export const researchSeeds = ${JSON.stringify(researchSeeds, null, 2)};

export const biologySeeds = ${JSON.stringify(biologySeeds, null, 2)};
`;

fs.writeFileSync(OUT, body, 'utf8');
console.log(`Written ${OUT}`);
console.log(`  awlSeeds: ${awlSeeds.length}`);
console.log(`  researchSeeds: ${researchSeeds.length}`);
console.log(`  biologySeeds: ${biologySeeds.length}`);
