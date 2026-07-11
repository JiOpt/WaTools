var SukuDofs = 12;
var KyuuseiName3 = new Array('門中太乙明，星官號貪狼，賭彩財喜旺，婚姻大吉昌。<br>出入無阻擋，參謁見賢良，此行三五里，黑衣別陰陽。',
'門前見攝提，百事必憂疑，相生猶自可，相剋禍必臨。<br>死門並相會，老婦哭悲啼，求謀並吉事，盡皆不相宜。<br>只可藏隱遁，若動傷身疾。',
'出入會軒轅，凡事必纏牽，相生全不美，相剋更憂煎。<br>遠行多不利，博彩盡輸錢，九天玄女法，句句不虛言。',
'招搖號木星，當之事莫行，相剋行人阻，陰人口舌迎。<br>夢寐多驚懼，屋響斧自鳴，陰陽消息理，萬法弗違情。',
'五鬼為天符，當門陰女謀，相剋無好事，行路阻中途。<br>走失難尋覓，道逢有尼姑，此星當門值，萬事有災除。',
'神光躍青龍，財氣喜重重，投入有酒食，賭彩最興隆。<br>更逢相生旺，休言克破凶，見貴安營寨，萬事總吉同。',
'吾將為咸池，當之盡不宜，出入多不利，相剋有災情。<br>賭彩全輸盡，求財空手回，仙人真妙語，愚人莫與知，<br>動用虛驚退，反覆逆風吹。',
'坐臨太陰星，百禍不相侵，求謀悉成就，知交有覓尋。<br>回風歸來路，恐有殃伏起，密語中記取，慎乎莫輕行。', 
'迎來天乙星，相逢百事興，運用和合慶，茶酒喜相迎。<br>求謀並嫁娶，好合有天成。禍福如神驗，吉凶甚分明。'); 
var Sukuyou3 = new Array('角星造作主榮昌，外進田財及女郎，嫁娶婚姻出貴子，文人及第見君王，惟有埋葬不可用，三年之後主瘟疫，起工修建墳基地，當前立見主人凶。<br><br>釋義：<br>角星造作則可榮昌，可置田產及早辦喜事。如果用角星來辦嫁娶則可出貴子，讀書人的功名可一帆風順。但是不可用角星行埋葬，否則三年之後有瘟疫。如果用角星起工修建墳墓或地基，則主人不利。',
'亢星造作長房當，十日之中主有殃，田地消磨官失職，接運定是虎狼傷，嫁娶婚姻用此日，兒孫新婦守空房，埋葬若還用此日，當時害禍主重傷。<br><br>釋義：<br>亢星造作則長房在十日之中有災殃，祖田不保且會失去官職，及會受小人所傷。如果用亢星行嫁娶，則兒孫新婦要守空房。如果用亢星行埋葬則有災禍、重傷。',
'氐星造作主災凶，費盡田園倉庫空，埋葬不可用此日，懸繩吊頸禍重重，若是婚姻離別散，夜招浪子入房中，行船必定遭沉沒，更生聾啞子孫窮。<br><br>釋義：<br>氐星造作會有災殃，田園財產一時空。用氐星進行埋葬，則有人會懸吊自縊、災禍接二連三。用氐星行婚禮則會離別、婦人不貞，航行又不利，更會生產聾啞的子孫，而鬧得家庭更窮。',
'房星造作田園進，錢財牛馬遍山崗，更招外處田莊宅，榮華富貴福祿康，埋葬若然用此日，高官進職拜君王，嫁娶嫦娥至月殿，三年抱子至朝堂。<br><br>釋義：<br>房星造作則財源滾滾來，享受榮華富貴、有福祿，並且身體健康。用房星行埋葬則仕途平穩，嫁娶用此，日婚姻美滿，三年得貴子。',
'心星造作大為凶，更遭刑訟獄囚中，忤逆官非宅產退，埋葬卒暴死相從，婚姻若是用此日，子死兒亡淚滿胸，三年之內連遭禍，事事教君沒始終。<br><br>釋義：<br>心星造作則大凶，有囚獄之災，忤逆長輩、惹官非，損失宅產。埋葬則大凶，用於婚姻則傷子，凶事接二連三，令人寢食難安。','尾星造作主天恩，富貴榮華福祿增，招財進寶興家宅，和合婚姻貴子孫，埋葬若能依此日，男清女正子孫興，開門放水招田宅，代代公侯遠播名。<br><br>釋義：<br>尾星造作可榮華富貴、福祿、財源滾滾而來。行婚姻則大吉利、子孫有利，有貴氣。用尾星行埋葬則子孫興旺，地理方面的開門放水則財源滾滾而來，並且有名望。',
'箕星造作主高強，歲歲年年大吉昌，埋葬修墳大吉利，田蠶牛馬遍山崗，開門放水招田宅，篋滿金銀谷滿倉，福蔭高官加祿位，六親豐榮樂安康。<br><br>釋義：<br>箕星造作可年年大吉昌，埋葬修墳也大吉利，風水方面的開門放水，則可陞官，使財源滾滾而來，六親豐足，生活過得快樂平安且身體健康，仕途平穩。',
'斗星造作主招財，文武官員位鼎台，田宅家財千萬進，墳堂修輯貴富來，開門放水招牛馬，旺蠶男女主和諧，遇此吉宿來照護，時支福慶永無災。<br><br>釋義：<br>斗星造作可招財、有利於仕途，家業欣欣向榮。修輯墳地可招富貴，開門放水則有進財，可使家庭和睦，有福而無災。','牛星造作主災危，九橫三災不可推，家宅不安人口退，田蠶不利主人衰，嫁娶婚姻皆自損，金銀財谷漸無之，若是開門並放水，牛豬羊馬亦傷悲。<br><br>釋義：<br>牛星造作有災厄，天災橫禍不能免，家庭不安而且傷人口，事業不利。如果行婚姻則不利，錢財漸退，假若開門放水則不利六畜。',
'女星造作損婆娘，兄弟相嫌似虎狼，埋葬生災逢鬼怪，顛邪疾病主瘟惶，為事遭官財失散，瀉利留連不可當，開門放水用此日，全家財散主離鄉。<br><br>釋義：<br>女星造作則不利婦女，恐會損人口。兄弟互相猜忌，感情不和睦，好比水火不能相容。如果行埋葬則容易招鬼怪，有怪病發生，作事易惹事生非而失財。要是開門放水，則家庭破散，離鄉別井。','虛星造作主災殃，男女孤眠不一雙，內亂風聲無禮節，兒孫媳婦伴人床，開門放水遭災禍，虎咬蛇傷又卒亡，三三五五連年病，家破人亡不可當。<br><br>釋義：<br>虛星造作則有災殃，男女相剋無法成雙。家庭不和睦，而且兒孫媳婦都不守節操，甚至亂了倫理。假如開門放水更有災禍，損人口，有傷亡，疾病接二連三，直至家破人亡。',
'危星不可造高樓，自遭刑吊見血光，三年孩子遭水厄，後生出外永不還，埋葬若還逢此日，週年百日取高堂，三年兩載一悲傷，開門放水到官堂。<br><br>釋義：<br>危星造作則有刑吊及血光之災，三年內孩子會遭水厄，損人口，年青出外不歸家。若行埋葬則更悲傷，週年或百日年長的有災厄，要是開門放水，則會上官堂 (打官司) 。','室星修造進田牛，兒孫代代近王侯，家貴榮華天上至，壽如彭祖八千秋，開門放水招財帛，和合婚姻生貴兒，埋葬若能依此日，門庭興旺福無休。<br><br>釋義：<br>室星修造則大吉利，富貴榮華，而且財源廣進，長壽。開門放水則可招財進寶，行婚禮則可生貴子。要是行埋葬則子孫興旺、福祿無窮。','璧星造作主增財，絲帛大熟福滔天，奴婢自來人口進，開門放水出英賢，埋葬招財官品進，家中諸事樂陶然，婚姻吉利主貴子，早播名譽著祖鞭。<br><br>釋義：<br>璧星造作可招進財、財源廣進，事業有成。開打放水則後代賢能，埋葬則可招財，並且有利於仕途，家庭生活幸福美滿。如果行婚禮則大吉利，早生貴子而有名聲。','奎星造作得禎祥，家內榮和大吉昌，若是埋葬陰卒死，當年定主兩三傷，看看軍令刑傷到，重重官事主瘟惶，開門放水遭災禍，三年兩次損兒郎。<br><br>釋義：<br>奎星造作算得了禎祥，可使家內繁榮而和睦。但是不可用來埋葬，否則一年內必有傷亡，而且有官事及怪病發生。要是開門放水則有災禍，對兒子不利。','婁星修造起門庭，財旺家和事事興，外進錢財百日進，一家兄弟播高名，婚姻進益生貴子，玉帛金銀箱滿盈，放水開門皆吉利，男榮女貴壽康寧。<br><br>釋義：<br>婁星造作則可使家業興旺，財源廣進，兄弟和睦有名望。行婚禮則早生貴子，要是開門放水則身體健康而長壽，經濟很好。','胃星造作事如何，家貴榮華喜氣多，埋葬貴臨官祿位，夫婦齊眉永保康，婚姻遇此家富貴，三災九禍不逢他，從此門前多吉慶，兒孫代代拜金階。<br><br>釋義：<br>胃星造作則榮華富貴，喜氣洋洋。行埋葬則有利於仕途，夫婦可白首偕老。行婚禮則可使家內富貴，兒孫代代有名望。','昴星造作進田牛，埋葬官災不得休，重喪二日三人死，盡賣田園不記增，開門放水招災禍，三歲孩兒白了頭，婚姻不可逢此日，死別生離是可愁。<br><br>釋義：<br>昴星造作可使家業興盛。但埋葬則常有官災，且會繼續死人，更會變賣田產。開門放水則會招災禍，孩童會得怪病，行婚禮則更悲哀，會有死別生離。',
'畢星造作主光前，買得田園有餘錢，埋葬此日添官職，田糧大熟永豐年，開門放水多吉慶，閤家人口得安然，婚姻若得逢此日，生得孩兒福壽全。<br><br>釋義：<br>畢星造作則財源廣進，行埋葬則有利於仕途，事業興旺，開門放水，則閤家歡樂，行婚禮則早生貴子而福壽雙全。','觜星造作有徒刑，三年必定主伶丁，埋葬卒死多因此，取定寅年使殺人，三喪不止皆由此，一人藥毒二人身，家門田地皆退敗，倉庫金銀化作塵。<br><br>釋義：<br>觜星造作則有刑害，會變成伶仃。假若行埋葬則容易有暴死的現象，多數應於寅年，災禍不斷，直至使田地退散而破家。','參星造作旺人家，文星照耀大光華，只因造作田財旺，埋葬招疾哭黃沙，開門放水加官職，房房子孫見田加，婚姻許遁遭刑克，男女朝開幕落花。<br><br>釋義：<br>參星造作可旺人家，文星高照，並對田產有利，但是行埋葬則大凶。開門放水則有利於仕途，與田產及子孫興旺。但是行婚禮則大凶，會遭刑克，感情無法和睦。','井星造作旺糧田，金榜題名第一光，埋葬須防驚卒死，狂顛風疾入黃泉，開門放水招財帛，牛馬豬羊旺莫言，貴人田塘來入宅，兒孫興旺有餘錢。<br><br>釋義：<br>井星造作則財源廣進，可金榜題名。埋葬則不利，容易得怪病而命歸黃泉。開門放水可招財進寶，貴人重重，兒孫興旺。','鬼星起造卒人亡，堂前不見主人郎，埋葬此日官祿至，兒孫代代近君王，開門放水須傷死，嫁娶夫妻不久長，修土建牆傷產女，手扶雙女淚汪汪。<br><br>釋義：<br>鬼星造作則大凶，有傷人口。埋葬用此日則可加冠進祿，對兒孫的仕途有利，但是開門放水則有傷人口，要是行婚禮夫修土建牆也大凶。',
'柳星造作主遭官，晝夜偷閉不暫安，埋葬瘟惶多疾病，田園退盡守冬寒，開門放水遭聾瞎，腰佗背曲似弓彎，更有捧刑宜謹慎，婦人隨客走盤桓，<br><br>釋義：<br>柳星造作則有官事，無日安寧，埋葬則多疾病，並且田產退敗。開門放水則會產生耳聾及瞎眼的毛病，甚至彎背，嚴重的話甚至遭刑打，婦人不守婦道。','星宿日好造新房，進職加官近帝王，不可埋葬並放水，凶星臨位女人亡，生離死別無心戀，要自歸休別嫁郎，孔子九曲殊難度，放水開門天命傷。<br><br>釋義：<br>星星造作則有利於仕途。但不可埋葬與放水，否則大凶，會遭生離死別之禍。','張星日好造龍軒，年年並見進莊田，埋葬不久陞官職，代代為官近帝前，開門放水招財帛，婚姻和合福綿綿，田糧人滿倉庫滿，百般順意自安然。<br><br>釋義：<br>張星造作則財源廣進，埋葬則有利於仕途。開門放水則可招財進寶，行婚禮則夫妻恩愛和合福綿綿，事事如意，安然自得。','翼星不利架高堂，三年二載見瘟惶，埋葬若還逢此日，子孫必定走他鄉，婚姻此日不宜利，歸家定是不相當，開門放水家須破，少女戀花貪外郎。<br><br>釋義：<br>翼星修造則容易得怪病，要是行埋葬則子孫遠走他鄉。行婚禮則不利，婦女不守婦道。開門放水則家破，少女會淫奔。','軫星臨水造龍宮，代代為官受皇封，富貴榮華增受祿，庫滿倉盈自昌隆，埋葬文昌來照助，宅舍安寧不見凶，更有為官沾帝寵，婚姻龍子入龍宮。<br><br>釋義：<br>軫星造作則有利於仕途，榮華富貴，增福壽，財源廣進。行埋葬則宅舍安寧。'); 
var zrxName1 = new Array('青龍<font color=#FF8C1A>(黃道日)</font>','明堂<font color=#FF8C1A>(黃道日)</font>','天刑<FONT color=#0000A0>(黑道日)</font>','朱雀<FONT color=#0000A0>(黑道日)</font>','金匱<font color=#FF8C1A>(黃道日)</font>','天德<font color=#FF8C1A>(黃道日)</font>','白虎<FONT color=#0000A0>(黑道日)</font>','玉堂<font color=#FF8C1A>(黃道日)</font>','天牢<FONT color=#0000A0>(黑道日)</font>','玄武<FONT color=#0000A0>(黑道日)</font>','司命<font color=#FF8C1A>(黃道日)</font>','勾陳<FONT color=#0000A0>(黑道日)</font>');
var zrxName2 = new Array('司命<font color=#FF8C1A>(黃道日)</font>','勾陳<FONT color=#0000A0>(黑道日)</font>','青龍<font color=#FF8C1A>(黃道日)</font>','明堂<font color=#FF8C1A>(黃道日)</font>','天刑<FONT color=#0000A0>(黑道日)</font>','朱雀<FONT color=#0000A0>(黑道日)</font>','金匱<font color=#FF8C1A>(黃道日)</font>','天德<font color=#FF8C1A>(黃道日)</font>','白虎<FONT color=#0000A0>(黑道日)</font>','玉堂<font color=#FF8C1A>(黃道日)</font>','天牢<FONT color=#0000A0>(黑道日)</font>','玄武<FONT color=#0000A0>(黑道日)</font>');
var zrxName3 = new Array('天牢<FONT color=#0000A0>(黑道日)</font>','玄武<FONT color=#0000A0>(黑道日)</font>','司命<font color=#FF8C1A>(黃道日)</font>','勾陳<FONT color=#0000A0>(黑道日)</font>','青龍<font color=#FF8C1A>(黃道日)</font>','明堂<font color=#FF8C1A>(黃道日)</font>','天刑<FONT color=#0000A0>(黑道日)</font>','朱雀<FONT color=#0000A0>(黑道日)</font>','金匱<font color=#FF8C1A>(黃道日)</font>','天德<font color=#FF8C1A>(黃道日)</font>','白虎<FONT color=#0000A0>(黑道日)</font>','玉堂<font color=#FF8C1A>(黃道日)</font>');
var zrxName4 = new Array('白虎<FONT color=#0000A0>(黑道日)</font>','玉堂<font color=#FF8C1A>(黃道日)</font>','天牢<FONT color=#0000A0>(黑道日)</font>','玄武<FONT color=#0000A0>(黑道日)</font>','司命<font color=#FF8C1A>(黃道日)</font>','勾陳<FONT color=#0000A0>(黑道日)</font>','青龍<font color=#FF8C1A>(黃道日)</font>','明堂<font color=#FF8C1A>(黃道日)</font>','天刑<FONT color=#0000A0>(黑道日)</font>','朱雀<FONT color=#0000A0>(黑道日)</font>','金匱<font color=#FF8C1A>(黃道日)</font>','天德<font color=#FF8C1A>(黃道日)</font>');
var zrxName5 = new Array('金匱<font color=#FF8C1A>(黃道日)</font>','天德<font color=#FF8C1A>(黃道日)</font>','白虎<FONT color=#0000A0>(黑道日)</font>','玉堂<font color=#FF8C1A>(黃道日)</font>','天牢<FONT color=#0000A0>(黑道日)</font>','玄武<FONT color=#0000A0>(黑道日)</font>','司命<font color=#FF8C1A>(黃道日)</font>','勾陳<FONT color=#0000A0>(黑道日)</font>','青龍<font color=#FF8C1A>(黃道日)</font>','明堂<font color=#FF8C1A>(黃道日)</font>','天刑<FONT color=#0000A0>(黑道日)</font>','朱雀<FONT color=#0000A0>(黑道日)</font>');
var zrxName6 = new Array('天刑<FONT color=#0000A0>(黑道日)</font>','朱雀<FONT color=#0000A0>(黑道日)</font>','金匱<font color=#FF8C1A>(黃道日)</font>','天德<font color=#FF8C1A>(黃道日)</font>','白虎<FONT color=#0000A0>(黑道日)</font>','玉堂<font color=#FF8C1A>(黃道日)</font>','天牢<FONT color=#0000A0>(黑道日)</font>','玄武<FONT color=#0000A0>(黑道日)</font>','司命<font color=#FF8C1A>(黃道日)</font>','勾陳<FONT color=#0000A0>(黑道日)</font>','青龍<font color=#FF8C1A>(黃道日)</font>','明堂<font color=#FF8C1A>(黃道日)</font>');
var zrxName7 = new Array('青龍<font color=#FF8C1A>(黃道日)</font>','明堂<font color=#FF8C1A>(黃道日)</font>','天刑<FONT color=#0000A0>(黑道日)</font>','朱雀<FONT color=#0000A0>(黑道日)</font>','金匱<font color=#FF8C1A>(黃道日)</font>','天德<font color=#FF8C1A>(黃道日)</font>','白虎<FONT color=#0000A0>(黑道日)</font>','玉堂<font color=#FF8C1A>(黃道日)</font>','天牢<FONT color=#0000A0>(黑道日)</font>','玄武<FONT color=#0000A0>(黑道日)</font>','司命<font color=#FF8C1A>(黃道日)</font>','勾陳<FONT color=#0000A0>(黑道日)</font>');
var zrxName8 = new Array('司命<font color=#FF8C1A>(黃道日)</font>','勾陳<FONT color=#0000A0>(黑道日)</font>','青龍<font color=#FF8C1A>(黃道日)</font>','明堂<font color=#FF8C1A>(黃道日)</font>','天刑<FONT color=#0000A0>(黑道日)</font>','朱雀<FONT color=#0000A0>(黑道日)</font>','金匱<font color=#FF8C1A>(黃道日)</font>','天德<font color=#FF8C1A>(黃道日)</font>','白虎<FONT color=#0000A0>(黑道日)</font>','玉堂<font color=#FF8C1A>(黃道日)</font>','天牢<FONT color=#0000A0>(黑道日)</font>','玄武<FONT color=#0000A0>(黑道日)</font>');
var zrxName9 = new Array('天牢<FONT color=#0000A0>(黑道日)</font>','玄武<FONT color=#0000A0>(黑道日)</font>','司命<font color=#FF8C1A>(黃道日)</font>','勾陳<FONT color=#0000A0>(黑道日)</font>','青龍<font color=#FF8C1A>(黃道日)</font>','明堂<font color=#FF8C1A>(黃道日)</font>','天刑<FONT color=#0000A0>(黑道日)</font>','朱雀<FONT color=#0000A0>(黑道日)</font>','金匱<font color=#FF8C1A>(黃道日)</font>','天德<font color=#FF8C1A>(黃道日)</font>','白虎<FONT color=#0000A0>(黑道日)</font>','玉堂<font color=#FF8C1A>(黃道日)</font>');
var zrxName10 = new Array('白虎<FONT color=#0000A0>(黑道日)</font>','玉堂<font color=#FF8C1A>(黃道日)</font>','天牢<FONT color=#0000A0>(黑道日)</font>','玄武<FONT color=#0000A0>(黑道日)</font>','司命<font color=#FF8C1A>(黃道日)</font>','勾陳<FONT color=#0000A0>(黑道日)</font>','青龍<font color=#FF8C1A>(黃道日)</font>','明堂<font color=#FF8C1A>(黃道日)</font>','天刑<FONT color=#0000A0>(黑道日)</font>','朱雀<FONT color=#0000A0>(黑道日)</font>','金匱<font color=#FF8C1A>(黃道日)</font>','天德<font color=#FF8C1A>(黃道日)</font>');
var zrxName11 = new Array('金匱<font color=#FF8C1A>(黃道日)</font>','天德<font color=#FF8C1A>(黃道日)</font>','白虎<FONT color=#0000A0>(黑道日)</font>','玉堂<font color=#FF8C1A>(黃道日)</font>','天牢<FONT color=#0000A0>(黑道日)</font>','玄武<FONT color=#0000A0>(黑道日)</font>','司命<font color=#FF8C1A>(黃道日)</font>','勾陳<FONT color=#0000A0>(黑道日)</font>','青龍<font color=#FF8C1A>(黃道日)</font>','明堂<font color=#FF8C1A>(黃道日)</font>','天刑<FONT color=#0000A0>(黑道日)</font>','朱雀<FONT color=#0000A0>(黑道日)</font>');
var zrxName12 = new Array('天刑<FONT color=#0000A0>(黑道日)</font>','朱雀<FONT color=#0000A0>(黑道日)</font>','金匱<font color=#FF8C1A>(黃道日)</font>','天德<font color=#FF8C1A>(黃道日)</font>','白虎<FONT color=#0000A0>(黑道日)</font>','玉堂<font color=#FF8C1A>(黃道日)</font>','天牢<FONT color=#0000A0>(黑道日)</font>','玄武<FONT color=#0000A0>(黑道日)</font>','司命<font color=#FF8C1A>(黃道日)</font>','勾陳<FONT color=#0000A0>(黑道日)</font>','青龍<font color=#FF8C1A>(黃道日)</font>','明堂<font color=#FF8C1A>(黃道日)</font>');

function jcr(d){
	var jcrjx;
	if(d=='建') jcrjx='<FONT color=#FF8C1A>宜：</font>出行,上任,會友,上書,見工<br><FONT color=#0000A0>忌：</font>動土,開倉,嫁娶,納采';
	if(d=='除') jcrjx='<FONT color=#FF8C1A>宜：</font>除服,療病,出行,拆卸,入宅<br><FONT color=#0000A0>忌：</font>求官,上任,開張,搬家,探病';
	if(d=='滿') jcrjx='<FONT color=#FF8C1A>宜：</font>祈福,祭祀,結親,開市,交易<br><FONT color=#0000A0>忌：</font>服藥,求醫,栽種,動土,遷移';
	if(d=='平') jcrjx='<FONT color=#FF8C1A>宜：</font>祭祀,修墳,塗泥,餘事勿取<br><FONT color=#0000A0>忌：</font>移徙.入宅.嫁娶.開市.安葬';
	if(d=='定') jcrjx='<FONT color=#FF8C1A>宜：</font>交易,立券,會友,簽約,納畜<br><FONT color=#0000A0>忌：</font>種植,置業,賣田,掘井,造船';
	if(d=='執') jcrjx='<FONT color=#FF8C1A>宜：</font>祈福,祭祀,求子,結婚,立約<br><FONT color=#0000A0>忌：</font>開市,交易,搬家,遠行';
	if(d=='破') jcrjx='<FONT color=#FF8C1A>宜：</font>求醫,赴考,祭祀,餘事勿取<br><FONT color=#0000A0>忌：</font>動土,出行,移徙,開市,修造';
	if(d=='危') jcrjx='<FONT color=#FF8C1A>宜：</font>經營,交易,求官,納畜,動土<br><FONT color=#0000A0>忌：</font>登高,行船.安床.入宅.博彩';
	if(d=='成') jcrjx='<FONT color=#FF8C1A>宜：</font>祈福,入學,開市,求醫,成服<br><FONT color=#0000A0>忌：</font>詞訟,安門,移徙';
	if(d=='收') jcrjx='<FONT color=#FF8C1A>宜：</font>祭祀,求財,簽約,嫁娶,訂盟<br><FONT color=#0000A0>忌：</font>開市.安床.安葬.入宅.破土';
	if(d=='開') jcrjx='<FONT color=#FF8C1A>宜：</font>療病,結婚,交易,入倉,求職<br><FONT color=#0000A0>忌：</font>安葬,動土,針灸';
	if(d=='閉') jcrjx='<FONT color=#FF8C1A>宜：</font>祭祀,交易,收財,安葬<br><FONT color=#0000A0>忌：</font>宴會,安床,出行,嫁娶,移徙';
	return(jcrjx);
}

function cyclical7(num,num2) {
	if (num==2)
		return(zrxName1[num2]);
	if (num==3)
		return(zrxName2[num2]);
	if (num==4)
		return(zrxName3[num2]);
	if (num==5)
		return(zrxName4[num2]);
	if (num==6)
		return(zrxName5[num2]);
	if (num==7)
		return(zrxName6[num2]);
	if (num==8)
		return(zrxName7[num2]);
	if (num==9)
		return(zrxName8[num2]);   
	if (num==10)
		return(zrxName9[num2]);
	if (num==11)   
		return(zrxName10[num2]);
	if (num==0)
		return(zrxName11[num2]);
	if (num==1)
		return(zrxName12[num2]);
}

function CalConv2(yy,mm,dd,y,d,m,dt,nm,nd) {
	var dy=d+''+dd
	if ((yy==0 && dd==6)||(yy==6 && dd==0)||(yy==1 && dd==7)||(yy==7 && dd==1)||(yy==2 && dd==8)||(yy==8 && dd==2)||(yy==3 && dd==9)||(yy==9 && dd==3)||(yy==4 && dd==10)||(yy==10 && dd==4)||(yy==5 && dd==11)||(yy==11 && dd==5)) {return '<FONT color=#0000A0>日值歲破 大事不宜</font>';}
	else if ((mm==0 && dd==6)||(mm==6 && dd==0)||(mm==1 && dd==7)||(mm==7 && dd==1)||(mm==2 && dd==8)||(mm==8 && dd==2)||(mm==3 && dd==9)||(mm==9 && dd==3)||(mm==4 && dd==10)||(mm==10 && dd==4)||(mm==5 && dd==11)||(mm==11 && dd==5)) {return '<FONT color=#0000A0><center>日值月破 大事不宜</font>';}
	else if ((y==0 && dy=='911')||(y==1 && dy=='55')||(y==2 && dy=='111')||(y==3 && dy=='75')||(y==4 && dy=='311')||(y==5 && dy=='95')||(y==6 && dy=='511')||(y==7 && dy=='15')||(y==8 && dy=='711')||(y==9 && dy=='35')) {return '<FONT color=#0000A0><center>日值上朔 大事不宜</font>';}
	else if ((m==1 && dt==13)||(m==2 && dt==11)||(m==3 && dt==9)||(m==4 && dt==7)||(m==5 && dt==5)||(m==6 && dt==3)||(m==7 && dt==1)||(m==7 && dt==29)||(m==8 && dt==27)||(m==9 && dt==25)||(m==10 && dt==23)||(m==11 && dt==21)||(m==12 && dt==19)) {return '<FONT color=#0000A0><center>日值楊公十三忌 大事不宜</font>';}
	else{return 0;}
}
function Year2Kyuusei(yy)
{
	return (9001 - yy) % 9;
}
function Year2KyuuseiNameS(yy) {
	var ans;
	ans = Year2Kyuusei(yy);
	return KyuuseiName[ans];
}
function Year2KyuuseiNameL(yy) {
	var ans;
	ans = Year2Kyuusei(yy);
	return KyuuseiName[ans] + KyuuseiName2[ans];
}
function Jd2KyuuseiNameS(JD)
{
	var ans;
	ans = Jd2Kyuusei(JD);
	if (ans >= 0) return KyuuseiName[ans];
	return '';
}
function Jd2KyuuseiNameL(JD)
{
	var ans;
	ans = Jd2Kyuusei(JD);
	if (ans >= 0) {
		return '九星：'+(KyuuseiName[ans] + KyuuseiName2[ans]);
	}
	return '';
}
function Jd2Kyuusei(JD)
{
	var flag,base;
	JD = Math.floor(JD);
	if ((JD < NKyuusei[0]) || (JD >= NKyuusei[0] + NKyuusei[1])){
		if (GetTenton(JD) < 0) return -1;
	}
	
	if (NKyuusei[2] < 0) {flag = -1;}
	else { flag = 1;}
	base = flag * NKyuusei[2] - 1 + 270;
	base += (JD - NKyuusei[0]) * flag;
	return base % 9;
}
function Jd2KyuuseiNameL2(JD)
{
	var ans;
	ans = Jd2Kyuusei(JD);
	if (ans >= 0) {
		return (KyuuseiName3[ans]);
	}
	return '';
}
function GetTenton(JD) {
	var KJD,KJDF;
	var n,ne;
	ne = KyuuseiJD.length;
	JD = Math.floor(JD);
	if (JD < KyuuseiJD[0]) return -1;
	if (JD >= KyuuseiJD[ne - 1]) return -1;

	for (n = 1 ; n < ne ; n++) {
		if (JD < KyuuseiJD[n]) break;
	}
	KJD = KyuuseiJD[n-1];
	KJDF = KyuuseiJDF[n-1];
	ne = KyuuseiJD[n];
	do {
		NKyuusei[0] = KJD;
		KJD += 180;
		if (KJD + 61 > ne) {KJD = ne;}
		if (JD >= KJD) {
			KJDF = (KJDF < 0) ? 1 : -9;
		}
	} while (JD >= KJD);
	NKyuusei[1] = KJD - NKyuusei[0];
	NKyuusei[2] = KJDF;
	return NKyuusei[0];
}

if (!document.layers&&!document.all) event="test"

function showtip2(current,e,text,tips,xing){
	if (document.all&&document.readyState=="complete"){
		var jie1,jie2,jie4,bt,pt,marquee,marx,wt,ht
		if (tips>2){
			jie1='<br>'+Jd2KyuuseiNameL2(tips);
			jie2='<br>'+GetSuku3D(tips*1);
			bt='#FDF5C4';
			pt='120';
			wt='200';
			marx=240;
			ht='200';
			text='<center><strong>是日星宿宜忌</strong></center><br>'+text
			xing='<br><br>'+xing;
		} else {
			bt='#EBEBEB';
			pt='55';
			jie1='';
			if (tips==1){jie2='<br>'+xing;wt='300';marx=120;ht='170';}
		  else if (tips==-1){jie2='<br>'+xing;wt='300';marx=120;ht='-40';}
			else if(tips==0){jie2='<br>'+month2[xing];wt='300';marx=120;ht='150';}
			else if (tips==2){jie4=tqyb[xing];if(jie4==undefined){text='<center><p>&nbsp;</p><p>對不起！暫無天氣數據</p>';ht='-140';}else{text='<table align=center style="font-size: 9pt;"><tr><td align=right><br><strong><font color=#FF8000>'+tD1+'/'+ybm1+'<br>'+tD2+'/'+ybm2+'<br>'+tD3+'/'+ybm3+'</td><td>'+jie4+'</td></tr></table>';ht='150';}jie2='';wt='400';marx=200;}
			xing='';
		}
		jie2=jie2.replace(/\n/g,"<br>");
		if (tips!=2){document.all.tip2.innerHTML='<table cellSpacing=1 cellPadding=0 bgColor=#f7f7f7 border=1><tr><td bgColor=#ffffff><table cellSpacing=1 cellPadding=0 bgColor=#e5e5e5 border=0><tr><td bgColor=#ffffff><table cellSpacing=1 cellPadding=0 bgColor=#b2b2b2 border=0><tr><td bgColor=#ffffff><table cellpadding=3 cellspacing=10 bgcolor='+bt+' width='+wt+'><tr><td style="font-size: 9pt" height='+pt+'><font color=#800080>'+text+'</font>'+jie1+'<font color=#800080>'+xing+'</font>'+jie2+'</td></tr></table></td></tr></table></td></tr></table></td></tr></table>';}
		if (tips==2) {
			document.all.tip2.innerHTML='<table cellSpacing=1 cellPadding=0 bgColor=#f7f7f7 border=1><tr><td bgColor=#ffffff><table cellSpacing=1 cellPadding=0 bgColor=#e5e5e5 border=0><tr><td bgColor=#ffffff><table cellSpacing=1 cellPadding=0 bgColor=#b2b2b2 border=0><tr><td bgColor=#ffffff><table cellpadding=3 cellspacing=10 bgcolor='+bt+' width='+wt+'><tr><td style="font-size: 9pt" height='+pt+'>'+text+'</td></tr></table></td></tr></table></td></tr></table></td></tr></table>';
		}
		var tip2x = window.event.clientX-marx;
		if (tip2x < document.body.scrollLeft){tip2x=window.event.clientX+20;}
		var tip2y = window.event.clientY-ht;
		if (tip2y < document.body.scrollTop){tip2y=window.event.clientY+20;}
		if (document.all) {
			tip2x=tip2x + window.document.body.scrollLeft;
			tip2y=tip2y + window.document.body.scrollTop;
		} else {
			tip2x=tip2x + window.pageXOffset;
			tip2y=tip2y + window.pageYOffset;
		}
		tip2.style.pixelLeft=tip2x;
		tip2.style.pixelTop=tip2y;
		document.all.tip2.style.visibility="visible"
	}
}

function hidetip2(){
	if (document.all){
		document.all.tip2.style.visibility="hidden";
	}
	else if (document.layers){
		clearInterval(currentscroll)
		document.tip2.visibility="hidden";
	}
}
