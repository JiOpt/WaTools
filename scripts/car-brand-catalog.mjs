import { brand } from './car-brand-helpers.mjs';

/**
 * Global automotive groups and brands.
 * Each region = one major group / alliance; brand.group = parent group label for UI.
 */
export const CAR_BRAND_GROUPS = [
  {
    id: 'vw-group',
    label: '福斯集團 Volkswagen Group',
    brands: [
      brand({ id: 'volkswagen', nameZh: '福斯', nameEn: 'Volkswagen', tier: '一般平價', group: '福斯集團', simpleIconSlug: 'volkswagen', logoFile: 'Volkswagen_logo_2019.svg', models: 'Golf、Passat、Tiguan、ID.3／ID.4 電動系列。', positioning: '德國國民車品牌，「人民的汽車」，歐系質感與扎實底盤。', driving: '底盤紮實、高速穩定，歐系路感。', powertrain: '汽油、柴油、PHEV、純電 ID. 系列並進。' }),
      brand({ id: 'audi', nameZh: '奧迪', nameEn: 'Audi', tier: '豪華品牌', group: '福斯集團', simpleIconSlug: 'audi', logoFile: 'Audi_logo_2016.svg', models: 'A4、A6、Q5、Q7、RS 性能系列。', positioning: '四環標誌象徵四家公司合併，定位科技豪華與 Quattro 四驅。', driving: 'Quattro 四驅、Virtual Cockpit 數位儀表。', powertrain: '汽油、TDI、e-tron 純電與 TFSI e 插電。' }),
      brand({ id: 'porsche', nameZh: '保時捷', nameEn: 'Porsche', tier: '層峰超跑', group: '福斯集團', simpleIconSlug: 'porsche', logoFile: 'Porsche_wordmark.svg', models: '911、Cayenne、Macan、Taycan。', positioning: 'Stuttgart 超跑與豪華運動品牌，911 是品牌靈魂。', driving: '極精準操控，PDK 變速箱反應迅捷。', powertrain: '水平對臥六缸、V8 與 Taycan 純電。' }),
      brand({ id: 'lamborghini', nameZh: '藍寶堅尼', nameEn: 'Lamborghini', tier: '層峰超跑', group: '福斯集團', simpleIconSlug: 'lamborghini', logoFile: 'Lamborghini_Logo.svg', models: 'Huracán、Urus、Revuelto。', positioning: '義大利超豪華超跑，牛角徽飾，極致性能與張狂設計。', driving: '高轉 V10／V12 聲浪，極限操控。', powertrain: '大排量汽油，Revuelto 為 V12 油電。' }),
      brand({ id: 'bentley', nameZh: '賓利', nameEn: 'Bentley', tier: '頂級豪華', group: '福斯集團', simpleIconSlug: 'bentley', models: 'Continental GT、Flying Spur、Bentayga。', positioning: '英國頂級豪華，手工奢華與大排量動力。', driving: '極致舒適與厚重感，長途巡航王者。', powertrain: 'W12、V8 汽油與插電混合。' }),
      brand({ id: 'skoda', nameZh: '斯柯達', nameEn: 'Škoda', tier: '一般平價', group: '福斯集團', simpleIconSlug: 'skoda', models: 'Octavia、Superb、Kodiaq。', positioning: '捷克品牌，高 CP 值歐系，共享福斯集團平台。', driving: '實用空間導向，歐洲家庭市場主力。', powertrain: '汽油、柴油與插電混合。' }),
      brand({ id: 'seat', nameZh: '西雅特', nameEn: 'SEAT', tier: '一般平價', group: '福斯集團', simpleIconSlug: 'seat', models: 'Ibiza、Leon、Ateca。', positioning: '西班牙品牌，年輕運動風格，主攻歐洲市場。', driving: '靈活操控，價格親民。', powertrain: '汽油與插電混合。' }),
      brand({ id: 'cupra', nameZh: '庫普拉', nameEn: 'CUPRA', tier: '運動品牌', group: '福斯集團', simpleIconSlug: 'cupra', models: 'Formentor、Born 電動。', positioning: '從 SEAT 分拆的性能子品牌，設計更前衛。', driving: '運動化懸吊與外觀。', powertrain: '汽油性能版與純電 Born。' }),
      brand({ id: 'bugatti', nameZh: '布加迪', nameEn: 'Bugatti', tier: '層峰超跑', group: '福斯集團', simpleIconSlug: 'bugatti', models: 'Chiron、Mistral。', positioning: '法國頂級超跑，千匹馬力與極致工藝。', driving: '極速傳奇，限量收藏。', powertrain: 'W16 四渦輪汽油。' }),
      brand({ id: 'man', nameZh: 'MAN', nameEn: 'MAN', tier: '商用車', group: '福斯集團', models: '卡車、巴士與商用車。', positioning: '德國商用車品牌，物流與客運領域。', driving: '重載、長途運輸取向。', powertrain: '柴油商用動力。' }),
      brand({ id: 'scania', nameZh: '斯堪尼亞', nameEn: 'Scania', tier: '商用車', group: '福斯集團', simpleIconSlug: 'scania', models: '重型卡車與巴士。', positioning: '瑞典商用車，北歐重載運輸標竿。', driving: '長途物流與燃油效率。', powertrain: '柴油與生質燃料。' }),
    ],
  },
  {
    id: 'bmw-group',
    label: 'BMW 集團',
    brands: [
      brand({ id: 'bmw', nameZh: 'BMW', nameEn: 'BMW', tier: '豪華品牌', group: 'BMW 集團', simpleIconSlug: 'bmw', logoFile: 'BMW.svg', models: '3 Series、5 Series、X3、X5、M 系列。', positioning: '德國豪華運動，「終極駕駛機器」。', driving: '後驅／xDrive，操控精準。', powertrain: '汽油、柴油、油電與 i 純電系列。' }),
      brand({ id: 'mini', nameZh: '迷你', nameEn: 'MINI', tier: '個性小車', group: 'BMW 集團', simpleIconSlug: 'mini', models: 'Cooper、Countryman、純電 MINI。', positioning: '英國經典小車基因，BMW 旗下個性品牌。', driving: '靈活小巧，都會通勤趣味。', powertrain: '汽油與純電。' }),
      brand({ id: 'rolls-royce', nameZh: '勞斯萊斯', nameEn: 'Rolls-Royce', tier: '頂級豪華', group: 'BMW 集團', simpleIconSlug: 'rollsroyce', models: 'Phantom、Ghost、Cullinan。', positioning: '英國頂級奢華，手工訂製與極致靜謐。', driving: '後座尊榮，行駛如雲。', powertrain: 'V12 汽油，電動化規劃中。' }),
    ],
  },
  {
    id: 'mercedes-group',
    label: 'Mercedes-Benz 集團',
    brands: [
      brand({ id: 'mercedes-benz', nameZh: '賓士', nameEn: 'Mercedes-Benz', tier: '豪華品牌', group: 'Mercedes-Benz 集團', simpleIconSlug: 'mercedes', logoFile: 'Mercedes-Benz_logo.svg', models: 'C-Class、E-Class、S-Class、GLC、GLE。', positioning: '德國豪華鼻祖，三芒星象徵，舒適與科技並重。', driving: '舒適平穩，MBUX 車機。', powertrain: '汽油、48V 輕油電、PHEV、EQ 純電。' }),
      brand({ id: 'mercedes-amg', nameZh: 'AMG', nameEn: 'Mercedes-AMG', tier: '高性能', group: 'Mercedes-Benz 集團', simpleIconSlug: 'mercedes', models: 'AMG GT、C 63、G 63。', positioning: '賓士高性能子品牌，One Man, One Engine 精神。', driving: '大馬力、運動化底盤。', powertrain: 'V8 雙渦輪與插電混合。' }),
      brand({ id: 'smart', nameZh: 'Smart', nameEn: 'smart', tier: '都會小車', group: 'Mercedes-Benz 集團', simpleIconSlug: 'smart', models: '#1、#3 純電都會車。', positioning: '都會微型車品牌，現聚焦純電小車。', driving: '小巧靈活，停車便利。', powertrain: '純電為主。' }),
    ],
  },
  {
    id: 'toyota-group',
    label: '豐田集團 Toyota Motor',
    brands: [
      brand({ id: 'toyota', nameZh: '豐田', nameEn: 'Toyota', tier: '一般平價', group: '豐田集團', simpleIconSlug: 'toyota', logoFile: 'Toyota_logo_(Red).svg', models: 'Corolla、RAV4、Camry、Hilux；台灣 Altis、Corolla Cross。', positioning: '日本國民車，全球銷量長年第一，可靠耐用。', driving: '舒適平穩，TSS 輔助駕駛普及。', powertrain: '汽油、HEV 油電、bZ 純電。' }),
      brand({ id: 'lexus', nameZh: '凌志', nameEn: 'Lexus', tier: '豪華品牌', group: '豐田集團', simpleIconSlug: 'lexus', logoFile: 'Lexus.svg', models: 'ES、RX、NX、LX。', positioning: '豐田旗下豪華品牌，日式細膩服務。', driving: '極致舒適與靜謐。', powertrain: 'HEV 為招牌，純電 RZ。' }),
      brand({ id: 'daihatsu', nameZh: '大發', nameEn: 'Daihatsu', tier: '輕型車', group: '豐田集團', models: 'K-Car 輕自動車、小型車。', positioning: '日本 K-Car 專家，主攻日本與東南亞。', driving: '都會通勤、省油小巧。', powertrain: '小排量汽油與油電。' }),
      brand({ id: 'hino', nameZh: '日野', nameEn: 'Hino', tier: '商用車', group: '豐田集團', models: '卡車、巴士。', positioning: '日本商用車品牌，亞洲物流常見。', driving: '重載耐用。', powertrain: '柴油與油電商用。' }),
    ],
  },
  {
    id: 'renault-nissan',
    label: 'Renault–Nissan–Mitsubishi 聯盟',
    brands: [
      brand({ id: 'nissan', nameZh: '日產', nameEn: 'Nissan', tier: '一般平價', group: 'Nissan 聯盟', simpleIconSlug: 'nissan', logoFile: 'Nissan_logo.svg', models: 'Altima、X-Trail、Kicks、GT-R。', positioning: '日本三大車廠，Leaf 曾領先電動量產。', driving: '舒適取向，ProPILOT 輔駕。', powertrain: '汽油、e-POWER、純電 Leaf。' }),
      brand({ id: 'mitsubishi', nameZh: '三菱', nameEn: 'Mitsubishi', tier: '一般平價', group: 'Nissan 聯盟', simpleIconSlug: 'mitsubishi', models: 'Outlander、Pajero、Eclipse Cross。', positioning: '日本品牌，越野與四驅傳統。', driving: 'Super Select 四驅。', powertrain: '汽油、PHEV Outlander。' }),
      brand({ id: 'infiniti', nameZh: '英菲尼迪', nameEn: 'Infiniti', tier: '豪華品牌', group: 'Nissan 聯盟', simpleIconSlug: 'infiniti', models: 'Q50、QX50、QX60。', positioning: '日產旗下豪華品牌，主攻北美與中東。', driving: '舒適豪華，VC-Turbo 可變壓縮比。', powertrain: '汽油渦輪與油電。' }),
      brand({ id: 'renault', nameZh: '雷諾', nameEn: 'Renault', tier: '一般平價', group: 'Renault 聯盟', simpleIconSlug: 'renault', models: 'Clio、Megane、Captur、Zoe 電動。', positioning: '法國國民車，歐洲電動化積極。', driving: '都會靈活，歐洲小型車強項。', powertrain: '汽油、柴油與純電 Zoe。' }),
      brand({ id: 'dacia', nameZh: '達契亞', nameEn: 'Dacia', tier: '入門平價', group: 'Renault 聯盟', simpleIconSlug: 'dacia', models: 'Sandero、Duster。', positioning: '雷諾旗下高 CP 值品牌，東歐與新興市場。', driving: '實用耐用、價格親民。', powertrain: '汽油與 LPG。' }),
      brand({ id: 'alpine', nameZh: 'Alpine', nameEn: 'Alpine', tier: '跑車品牌', group: 'Renault 聯盟', simpleIconSlug: 'alpine', models: 'A110 中置跑車。', positioning: '法國輕量跑車品牌，雷諾性能象徵。', driving: '輕量操控，彎道樂趣。', powertrain: '渦輪汽油。' }),
    ],
  },
  {
    id: 'honda-group',
    label: '本田集團 Honda Motor',
    brands: [
      brand({ id: 'honda', nameZh: '本田', nameEn: 'Honda', tier: '一般平價', group: '本田集團', simpleIconSlug: 'honda', logoFile: 'Honda.svg', models: 'Civic、CR-V、Fit；台灣 CR-V、HR-V。', positioning: '引擎技術與空間運用著稱，VTEC 招牌。', driving: '路感稍銳利，操控樂趣。', powertrain: '汽油、e:HEV 油電。' }),
      brand({ id: 'acura', nameZh: '讴歌', nameEn: 'Acura', tier: '豪華品牌', group: '本田集團', simpleIconSlug: 'acura', models: 'MDX、RDX、Integra。', positioning: '本田北美豪華品牌。', driving: 'SH-AWD 四驅，運動豪華。', powertrain: '汽油 V6 與油電。' }),
    ],
  },
  {
    id: 'japan-other',
    label: '日本其他車廠',
    brands: [
      brand({ id: 'mazda', nameZh: '馬自達', nameEn: 'Mazda', tier: '一般平價', group: '獨立車廠', simpleIconSlug: 'mazda', logoFile: 'Mazda_logo.svg', models: 'Mazda3、CX-5、MX-5。', positioning: '魂動設計與人馬一體哲學。', driving: '同級操控標竿，G-Vectoring。', powertrain: 'Skyactiv 汽油與輕油電。' }),
      brand({ id: 'subaru', nameZh: '速霸陸', nameEn: 'Subaru', tier: '一般平價', group: '獨立車廠', simpleIconSlug: 'subaru', logoFile: 'Subaru_logo.svg', models: 'Forester、Outback、WRX。', positioning: '水平對臥引擎與全時四驅。', driving: 'EyeSight 輔駕，全天候抓地。', powertrain: '水平對臥汽油與 e-Boxer。' }),
      brand({ id: 'suzuki', nameZh: '鈴木', nameEn: 'Suzuki', tier: '一般平價', group: '獨立車廠', simpleIconSlug: 'suzuki', models: 'Swift、Jimny、Vitara。', positioning: '日本小型車與 K-Car 專家，印度市場強勢。', driving: '輕巧省油，越野 Jimny 經典。', powertrain: '小排量汽油與油電。' }),
      brand({ id: 'isuzu', nameZh: '五十鈴', nameEn: 'Isuzu', tier: '商用車', group: '獨立車廠', simpleIconSlug: 'isuzu', models: 'D-Max 皮卡、N 系列卡車。', positioning: '柴油引擎與皮卡、商用車專家。', driving: '越野皮卡與物流。', powertrain: '柴油為主。' }),
    ],
  },
  {
    id: 'ford-group',
    label: '福特集團 Ford Motor',
    brands: [
      brand({ id: 'ford', nameZh: '福特', nameEn: 'Ford', tier: '一般平價', group: '福特集團', simpleIconSlug: 'ford', logoFile: 'Ford_logo_flat.svg', models: 'F-150、Mustang、Focus、Kuga。', positioning: '美國老牌，量產線革命創始者。', driving: '皮卡文化與美式大馬力。', powertrain: '汽油 V6／V8、F-150 Lightning 純電。' }),
      brand({ id: 'lincoln', nameZh: '林肯', nameEn: 'Lincoln', tier: '豪華品牌', group: '福特集團', simpleIconSlug: 'lincoln', models: 'Navigator、Aviator、Corsair。', positioning: '福特旗下美系豪華，大器舒適。', driving: '美式豪華巡航。', powertrain: '汽油 V6 與插電。' }),
    ],
  },
  {
    id: 'gm-group',
    label: '通用汽車 General Motors',
    brands: [
      brand({ id: 'chevrolet', nameZh: '雪佛蘭', nameEn: 'Chevrolet', tier: '一般平價', group: '通用汽車', simpleIconSlug: 'chevrolet', models: 'Silverado、Camaro、Equinox、Bolt EV。', positioning: '美系國民品牌，全球多市場佈局。', driving: '實用與性能並存。', powertrain: '汽油 V8 與純電 Bolt。' }),
      brand({ id: 'cadillac', nameZh: '凱迪拉克', nameEn: 'Cadillac', tier: '豪華品牌', group: '通用汽車', simpleIconSlug: 'cadillac', models: 'Escalade、CT5、Lyriq 純電。', positioning: '美系豪華代表，美式大器。', driving: '舒適巡航與科技座艙。', powertrain: '汽油 V6／V8 與 Ultium 純電。' }),
      brand({ id: 'gmc', nameZh: 'GMC', nameEn: 'GMC', tier: '皮卡休旅', group: '通用汽車', simpleIconSlug: 'gmc', models: 'Sierra 皮卡、Yukon 休旅。', positioning: '通用旗下皮卡與商用休旅品牌。', driving: '重載與越野。', powertrain: '汽油 V8 與純電 Sierra EV。' }),
      brand({ id: 'buick', nameZh: '別克', nameEn: 'Buick', tier: '豪華入門', group: '通用汽車', simpleIconSlug: 'buick', models: 'Enclave、Encore 休旅。', positioning: '美系舒適品牌，中國市場重要。', driving: '靜謐舒適。', powertrain: '汽油與油電。' }),
    ],
  },
  {
    id: 'stellantis',
    label: 'Stellantis 集團',
    brands: [
      brand({ id: 'peugeot', nameZh: '寶獅', nameEn: 'Peugeot', tier: '一般平價', group: 'Stellantis', simpleIconSlug: 'peugeot', models: '208、308、3008、508。', positioning: '法國設計導向，獅子徽飾。', driving: '歐洲小型車與休旅。', powertrain: '汽油、柴油與純電 e-208。' }),
      brand({ id: 'citroen', nameZh: '雪鐵龍', nameEn: 'Citroën', tier: '一般平價', group: 'Stellantis', simpleIconSlug: 'citroen', models: 'C3、C4、C5 Aircross。', positioning: '法國品牌，舒適懸吊與獨特設計。', driving: '柔軟舒適，都會通勤。', powertrain: '汽油與電動。' }),
      brand({ id: 'ds', nameZh: 'DS', nameEn: 'DS Automobiles', tier: '豪華品牌', group: 'Stellantis', simpleIconSlug: 'dsautomobiles', models: 'DS 3、DS 7、DS 9。', positioning: '雪铁龙高端子品牌，法式奢華。', driving: '設計前衛、內裝精緻。', powertrain: '插電混合與純電。' }),
      brand({ id: 'opel', nameZh: '歐寶', nameEn: 'Opel', tier: '一般平價', group: 'Stellantis', simpleIconSlug: 'opel', models: 'Corsa、Astra、Mokka。', positioning: '德國品牌，歐洲國民車。', driving: '實用歐系。', powertrain: '汽油與電動。' }),
      brand({ id: 'fiat', nameZh: '飛雅特', nameEn: 'Fiat', tier: '一般平價', group: 'Stellantis', simpleIconSlug: 'fiat', models: '500、Panda、Tipo。', positioning: '義大利國民小車，500 是經典象徵。', driving: '都會靈活小巧。', powertrain: '汽油與 500e 純電。' }),
      brand({ id: 'abarth', nameZh: 'Abarth', nameEn: 'Abarth', tier: '性能小車', group: 'Stellantis', simpleIconSlug: 'abarth', models: '595、124 Spider。', positioning: 'Fiat 性能子品牌，蠍子徽飾。', driving: '熱血小鋼炮。', powertrain: '渦輪汽油。' }),
      brand({ id: 'lancia', nameZh: '藍吉亞', nameEn: 'Lancia', tier: '經典品牌', group: 'Stellantis', simpleIconSlug: 'lancia', models: 'Ypsilon、復興經典車系。', positioning: '義大利經典品牌，WRC 傳奇。', driving: '義式風格。', powertrain: '汽油與油電。' }),
      brand({ id: 'chrysler', nameZh: '克萊斯勒', nameEn: 'Chrysler', tier: '美系品牌', group: 'Stellantis', simpleIconSlug: 'chrysler', models: 'Pacifica MPV、300 房車。', positioning: '美系家庭 MPV 與房車。', driving: '美式舒適。', powertrain: '汽油 V6 與插電 Pacifica。' }),
      brand({ id: 'jeep', nameZh: '吉普', nameEn: 'Jeep', tier: '越野休旅', group: 'Stellantis', simpleIconSlug: 'jeep', models: 'Wrangler、Grand Cherokee、Compass。', positioning: '美式越野圖騰，七孔格柵。', driving: '越野與全地形。', powertrain: '汽油、插電 4xe。' }),
      brand({ id: 'dodge', nameZh: '道奇', nameEn: 'Dodge', tier: '美式性能', group: 'Stellantis', simpleIconSlug: 'dodge', models: 'Charger、Challenger、Durango。', positioning: '美系肌肉車文化，Hemi V8。', driving: '直線加速與聲浪。', powertrain: '大排量 V8 汽油。' }),
      brand({ id: 'ram', nameZh: 'Ram', nameEn: 'Ram', tier: '皮卡', group: 'Stellantis', simpleIconSlug: 'ram', models: '1500、2500 皮卡。', positioning: '北美重型皮卡品牌。', driving: '拖曳與重載。', powertrain: '汽油 V8 與柴油。' }),
      brand({ id: 'alfa-romeo', nameZh: '愛快羅密歐', nameEn: 'Alfa Romeo', tier: '運動豪華', group: 'Stellantis', simpleIconSlug: 'alfaromeo', models: 'Giulia、Stelvio、Tonale。', positioning: '義大利運動豪華，蛇與十字架徽飾。', driving: '熱血操控，義式情懷。', powertrain: '汽油渦輪與插電。' }),
      brand({ id: 'maserati', nameZh: '瑪莎拉蒂', nameEn: 'Maserati', tier: '豪華運動', group: 'Stellantis', simpleIconSlug: 'maserati', models: 'Ghibli、Levante、Grecale、MC20。', positioning: '義大利海神三叉戟，聲浪與奢華。', driving: 'GT 巡航與運動。', powertrain: 'V6 雙渦輪與純電 GranTurismo Folgore。' }),
    ],
  },
  {
    id: 'hyundai-group',
    label: '現代汽車集團 Hyundai Motor Group',
    brands: [
      brand({ id: 'hyundai', nameZh: '現代', nameEn: 'Hyundai', tier: '一般平價', group: '現代汽車集團', simpleIconSlug: 'hyundai', logoFile: 'Hyundai_Motor_Company_logo.svg', models: 'Tucson、Santa Fe、Ioniq 系列。', positioning: '韓國最大車廠，設計與 CP 值提升。', driving: 'SmartSense 輔駕普及。', powertrain: '汽油、油電、Ioniq 純電。' }),
      brand({ id: 'kia', nameZh: '起亞', nameEn: 'Kia', tier: '一般平價', group: '現代汽車集團', simpleIconSlug: 'kia', models: 'Sportage、EV6、Carnival。', positioning: '年輕設計導向，與現代共享平台。', driving: 'EV6 操控獲獎。', powertrain: '汽油、EV6／EV9 純電。' }),
      brand({ id: 'genesis', nameZh: '捷尼賽思', nameEn: 'Genesis', tier: '豪華品牌', group: '現代汽車集團', simpleIconSlug: 'genesis', models: 'G80、GV70、GV80。', positioning: '韓系豪華，亞洲設計大獎常客。', driving: '舒適與質感兼具。', powertrain: '汽油渦輪與純電 GV60。' }),
    ],
  },
  {
    id: 'jlr-tata',
    label: 'Tata／JLR 英國豪華',
    brands: [
      brand({ id: 'jaguar', nameZh: '捷豹', nameEn: 'Jaguar', tier: '豪華運動', group: 'JLR', simpleIconSlug: 'jaguar', models: 'F-Pace、F-Type、I-Pace 純電。', positioning: '英國豪華運動，優雅與性能。', driving: '跑車化調校。', powertrain: '汽油渦輪與純電 I-Pace。' }),
      brand({ id: 'land-rover', nameZh: '荒原路華', nameEn: 'Land Rover', tier: '豪華越野', group: 'JLR', simpleIconSlug: 'landrover', logoFile: 'Land_Rover_logo.svg', models: 'Range Rover、Defender、Discovery。', positioning: '全地形越野豪華。', driving: 'Terrain Response 越野。', powertrain: '汽油、柴油、PHEV。' }),
      brand({ id: 'tata', nameZh: '塔塔', nameEn: 'Tata Motors', tier: '多元集團', group: 'Tata 集團', simpleIconSlug: 'tata', models: 'Nexon、Harrier、商用車。', positioning: '印度最大車廠，擁有 JLR。', driving: '新興市場實用。', powertrain: '汽油、柴油與電動 Nexon EV。' }),
    ],
  },
  {
    id: 'geely-volvo',
    label: '吉利／Volvo 集團',
    brands: [
      brand({ id: 'volvo', nameZh: '富豪', nameEn: 'Volvo', tier: '豪華品牌', group: '吉利控股', simpleIconSlug: 'volvo', logoFile: 'Volvo_logo.svg', models: 'XC60、XC90、EX30 純電。', positioning: '瑞典安全標竿，三點式安全帶發明者。', driving: 'Pilot Assist 輔駕。', powertrain: '48V、T8 插電、純電 EX 系列。' }),
      brand({ id: 'polestar', nameZh: '極星', nameEn: 'Polestar', tier: '電動豪華', group: '吉利／Volvo', simpleIconSlug: 'polestar', models: 'Polestar 2、3、4。', positioning: '北歐電動性能品牌。', driving: '簡約設計與電動操控。', powertrain: '純電為主。' }),
      brand({ id: 'lotus', nameZh: '蓮花', nameEn: 'Lotus', tier: '跑車品牌', group: '吉利控股', simpleIconSlug: 'lotus', models: 'Emira、Eletre 電動休旅。', positioning: '英國輕量跑車，現在電動化。', driving: '極致操控與輕量化。', powertrain: '渦輪汽油與純電 Eletre。' }),
      brand({ id: 'geely', nameZh: '吉利', nameEn: 'Geely', tier: '一般平價', group: '吉利控股', simpleIconSlug: 'geely', models: 'Coolray、Monjaro、銀河系列。', positioning: '中國民營車廠龍頭，多品牌佈局。', driving: '高 CP 值與快速迭代。', powertrain: '汽油與插電、純電。' }),
    ],
  },
  {
    id: 'independent-luxury',
    label: '獨立豪華／超跑',
    brands: [
      brand({ id: 'ferrari', nameZh: '法拉利', nameEn: 'Ferrari', tier: '層峰超跑', group: '獨立', simpleIconSlug: 'ferrari', logoFile: 'Scuderia_Ferrari_Logo.svg', models: '296 GTB、SF90、Purosangue。', positioning: '義大利躍馬，F1 紅色傳奇。', driving: '極致性能與收藏價值。', powertrain: 'V8／V12 與油電 SF90。' }),
      brand({ id: 'aston-martin', nameZh: '阿斯頓馬丁', nameEn: 'Aston Martin', tier: '層峰超跑', group: '獨立', simpleIconSlug: 'astonmartin', models: 'DB12、Vantage、DBX。', positioning: '英國 GT 超跑，007 座駕。', driving: '優雅與大馬力。', powertrain: 'V8 雙渦輪汽油。' }),
      brand({ id: 'mclaren', nameZh: '麥拉倫', nameEn: 'McLaren', tier: '層峰超跑', group: '獨立', simpleIconSlug: 'mclaren', models: '720S、Artura、GT。', positioning: 'F1 科技超跑，碳纖維單體殼。', driving: '賽道級操控。', powertrain: 'V8 雙渦輪與 Artura 油電。' }),
      brand({ id: 'koenigsegg', nameZh: '柯尼賽格', nameEn: 'Koenigsegg', tier: '層峰超跑', group: '獨立', simpleIconSlug: 'koenigsegg', models: 'Jesko、Gemera。', positioning: '瑞典極致超跑，極速紀錄製造者。', driving: '限量頂級性能。', powertrain: 'V8 與 Gemera 三缸油電。' }),
      brand({ id: 'pagani', nameZh: '帕加尼', nameEn: 'Pagani', tier: '層峰超跑', group: '獨立', simpleIconSlug: 'pagani', models: 'Huayra、Utopia。', positioning: '義大利手工超跑，藝術品級工藝。', driving: 'AMG V12 聲浪。', powertrain: 'V12 汽油。' }),
      brand({ id: 'rimac', nameZh: '瑞馬克', nameEn: 'Rimac', tier: '電動超跑', group: '獨立', simpleIconSlug: 'rimac', models: 'Nevera 純電超跑。', positioning: '克羅埃西亞電動超跑，技術供應 Bugatti-Rimac。', driving: '千匹純電加速。', powertrain: '純電四馬達。' }),
    ],
  },
  {
    id: 'usa-ev',
    label: '美國電動新創',
    brands: [
      brand({ id: 'tesla', nameZh: '特斯拉', nameEn: 'Tesla', tier: '電動領導', group: '獨立', simpleIconSlug: 'tesla', logoFile: 'Tesla_Motors.svg', models: 'Model 3、Y、S、X、Cybertruck。', positioning: '電動車先驅，軟體定義汽車。', driving: '瞬間扭力、OTA 更新。', powertrain: '純電 BEV。' }),
      brand({ id: 'rivian', nameZh: 'Rivian', nameEn: 'Rivian', tier: '電動皮卡', group: '獨立', simpleIconSlug: 'rivian', models: 'R1T 皮卡、R1S 休旅。', positioning: '美國電動越野皮卡新創。', driving: '四馬達越野。', powertrain: '純電。' }),
      brand({ id: 'lucid', nameZh: 'Lucid', nameEn: 'Lucid', tier: '電動豪華', group: '獨立', simpleIconSlug: 'lucid', models: 'Air 房車、Gravity 休旅。', positioning: '美國電動豪華，續航里程標竿。', driving: '極致續航與加速。', powertrain: '純電。' }),
      brand({ id: 'fisker', nameZh: 'Fisker', nameEn: 'Fisker', tier: '電動新創', group: '獨立', simpleIconSlug: 'fisker', models: 'Ocean 電動休旅。', positioning: '設計導向電動品牌。', driving: '永續材質內裝。', powertrain: '純電。' }),
    ],
  },
  {
    id: 'china-ev',
    label: '中國新能源',
    brands: [
      brand({ id: 'byd', nameZh: '比亞迪', nameEn: 'BYD', tier: '電動龍頭', group: '獨立', simpleIconSlug: 'byd', models: 'Han、Seal、Atto 3、Tang。', positioning: '中國 EV 銷量冠軍，刀片電池。', driving: '高性價比電動化。', powertrain: 'BEV 與 DM-i 插電。' }),
      brand({ id: 'nio', nameZh: '蔚來', nameEn: 'NIO', tier: '電動豪華', group: '獨立', simpleIconSlug: 'nio', models: 'ET5、ET7、ES6、ES8。', positioning: '換電模式與高端服務。', driving: '智能座艙與換電。', powertrain: '純電 BEV。' }),
      brand({ id: 'xpeng', nameZh: '小鵬', nameEn: 'XPeng', tier: '智能電動', group: '獨立', simpleIconSlug: 'xpeng', models: 'P7、G6、X9。', positioning: '智能駕駛與年輕科技。', driving: 'XNGP 輔駕。', powertrain: '純電。' }),
      brand({ id: 'li-auto', nameZh: '理想', nameEn: 'Li Auto', tier: '增程電動', group: '獨立', simpleIconSlug: 'liauto', models: 'L7、L8、L9、MEGA。', positioning: '增程式大型休旅，家庭市場。', driving: '六座休旅、智能座艙。', powertrain: '增程 EREV 與純電。' }),
      brand({ id: 'zeekr', nameZh: '極氪', nameEn: 'Zeekr', tier: '電動豪華', group: '吉利系', simpleIconSlug: 'zeekr', models: '001、007、X。', positioning: '吉利高端純電品牌。', driving: '性能電動與獵裝造型。', powertrain: '純電 800V。' }),
      brand({ id: 'aito', nameZh: '問界', nameEn: 'AITO', tier: '智能電動', group: '華為智選', simpleIconSlug: 'aito', models: 'M5、M7、M9。', positioning: '華為鴻蒙智行合作品牌。', driving: '智能座艙與輔駕。', powertrain: '增程與純電。' }),
      brand({ id: 'xiaomi-auto', nameZh: '小米汽車', nameEn: 'Xiaomi Auto', tier: '智能電動', group: '小米', simpleIconSlug: 'xiaomi', models: 'SU7 房車。', positioning: '小米生態電動車，話題性高。', driving: '智能互聯。', powertrain: '純電。' }),
      brand({ id: 'leapmotor', nameZh: '零跑', nameEn: 'Leapmotor', tier: '電動新創', group: '獨立', simpleIconSlug: 'leapmotor', models: 'C11、C01、T03。', positioning: '高 CP 值中國電動。', driving: '自研三電。', powertrain: '純電與增程。' }),
      brand({ id: 'voyah', nameZh: '嵐圖', nameEn: 'Voyah', tier: '電動豪華', group: '東風', simpleIconSlug: 'voyah', models: 'Free、Dream、Passion。', positioning: '東風高端新能源。', driving: '舒適電動休旅。', powertrain: '純電與插電。' }),
    ],
  },
  {
    id: 'china-traditional',
    label: '中國傳統車廠',
    brands: [
      brand({ id: 'chery', nameZh: '奇瑞', nameEn: 'Chery', tier: '一般平價', group: '獨立', simpleIconSlug: 'chery', models: 'Tiggo 休旅、艾瑞澤房車。', positioning: '中國出口量領先，多品牌（星途、捷途）。', driving: '新興市場 CP 值。', powertrain: '汽油與電動。' }),
      brand({ id: 'haval', nameZh: '哈弗', nameEn: 'Haval', tier: '休旅專家', group: '長城', simpleIconSlug: 'haval', models: 'H6、大狗、梟龍。', positioning: '長城旗下 SUV 品牌。', driving: '越野與都會休旅。', powertrain: '汽油與油電。' }),
      brand({ id: 'great-wall', nameZh: '長城', nameEn: 'Great Wall', tier: '皮卡休旅', group: '長城', simpleIconSlug: 'greatwall', models: '炮皮卡、坦克 300 越野。', positioning: '皮卡與越野 SUV 強項。', driving: '越野改裝文化。', powertrain: '汽油、柴油與油電。' }),
      brand({ id: 'changan', nameZh: '長安', nameEn: 'Changan', tier: '國營大廠', group: '獨立', simpleIconSlug: 'changan', models: 'CS 休旅系列、UNI 系列。', positioning: '中國四大國營車廠之一。', driving: '主流家用市場。', powertrain: '汽油與藍鯨動力。' }),
      brand({ id: 'saic', nameZh: '上汽', nameEn: 'SAIC', tier: '國營大廠', group: '獨立', models: '荣威、大通、五菱（合資）。', positioning: '中國最大車企之一，與 VW、GM 合資。', driving: '多元品牌矩陣。', powertrain: '全動力型式。' }),
      brand({ id: 'mg', nameZh: '名爵', nameEn: 'MG', tier: '運動品牌', group: '上汽', simpleIconSlug: 'mg', models: 'MG4 電動、ZS、HS。', positioning: '英國經典品牌，現由上汽運營，出口歐洲。', driving: '年輕運動。', powertrain: '汽油與純電 MG4。' }),
      brand({ id: 'hongqi', nameZh: '紅旗', nameEn: 'Hongqi', tier: '豪華品牌', group: '一汽', simpleIconSlug: 'hongqi', models: 'H9、E-HS9、LS7。', positioning: '中國豪華國車象徵。', driving: '莊重大器。', powertrain: '汽油 V6 與純電。' }),
      brand({ id: 'wuling', nameZh: '五菱', nameEn: 'Wuling', tier: '國民車', group: '上汽五菱', simpleIconSlug: 'wuling', models: '宏光 MINI EV、繽果。', positioning: '微型電動國民車，銷量現象級。', driving: '都會代步。', powertrain: '純電為主。' }),
      brand({ id: 'baic', nameZh: '北汽', nameEn: 'BAIC', tier: '國營大廠', group: '獨立', models: '北京越野、EU 電動。', positioning: '北京汽車集團，越野 BJ 系列。', driving: '硬派越野。', powertrain: '汽油與純電。' }),
      brand({ id: 'gac', nameZh: '廣汽', nameEn: 'GAC', tier: '國營大廠', group: '獨立', models: '傳祺、埃安 Aion 電動。', positioning: '廣汽集團，與 Toyota、Honda 合資。', driving: 'Aion 純電銷量领先。', powertrain: '汽油與純電。' }),
    ],
  },
  {
    id: 'taiwan',
    label: '臺灣',
    brands: [
      brand({ id: 'luxgen', nameZh: '納智捷', nameEn: 'Luxgen', tier: '自主品牌', group: '裕隆', logoFile: 'Luxgen.svg', models: 'U6、n7 純電、M7 MPV。', positioning: '台灣自主品牌，本土研發。', driving: '本土路況調校。', powertrain: '汽油與純電 n7。' }),
      brand({ id: 'cmc', nameZh: '中華汽車', nameEn: 'CMC', tier: '商用／代工', group: '裕隆', models: '堅兵皮卡、Veryca 廂車。', positioning: '台灣商用車與三菱代工。', driving: '物流與商用。', powertrain: '汽油與柴油。' }),
    ],
  },
  {
    id: 'asia-other',
    label: '亞洲其他',
    brands: [
      brand({ id: 'vinfast', nameZh: 'VinFast', nameEn: 'VinFast', tier: '電動新創', group: 'Vingroup', simpleIconSlug: 'vinfast', models: 'VF 8、VF 9 電動休旅。', positioning: '越南國家電動品牌，進軍歐美。', driving: '新興市場電動化。', powertrain: '純電。' }),
      brand({ id: 'mahindra', nameZh: '馬辛德拉', nameEn: 'Mahindra', tier: '皮卡休旅', group: '獨立', simpleIconSlug: 'mahindra', models: 'Thar 越野、XUV 休旅。', positioning: '印度 SUV 與皮卡強者。', driving: '越野與商用。', powertrain: '柴油與汽油。' }),
      brand({ id: 'perodua', nameZh: 'Perodua', nameEn: 'Perodua', tier: '國民小車', group: '獨立', models: 'Myvi、Bezza。', positioning: '馬來西亞國民小車，Toyota 合資。', driving: '都會通勤。', powertrain: '汽油。' }),
      brand({ id: 'proton', nameZh: '寶騰', nameEn: 'Proton', tier: '國民品牌', group: '吉利', simpleIconSlug: 'proton', models: 'X50、X70 休旅。', positioning: '馬來西亞國牌，吉利技術支援。', driving: '東南亞 CP 值。', powertrain: '汽油渦輪。' }),
      brand({ id: 'ssangyong', nameZh: '雙龍', nameEn: 'SsangYong', tier: '休旅', group: 'KG Mobility', models: 'Torres、Rexton。', positioning: '韓國 SUV 品牌，越野傳統。', driving: '四驅休旅。', powertrain: '柴油與汽油。' }),
    ],
  },
  {
    id: 'europe-other',
    label: '歐洲其他',
    brands: [
      brand({ id: 'saab', nameZh: '紳寶', nameEn: 'Saab', tier: '經典品牌', group: '已停產', models: '9-3、9-5（經典）。', positioning: '瑞典飛機血統品牌，已停產但車迷仍多。', driving: '獨特環保艙、渦輪增壓先驅。', powertrain: '汽油渦輪（歷史車款）。' }),
      brand({ id: 'vauxhall', nameZh: '沃克斯豪爾', nameEn: 'Vauxhall', tier: '一般平價', group: 'Stellantis', simpleIconSlug: 'vauxhall', models: 'Corsa、Astra（英國版 Opel）。', positioning: '英國市場 Opel 孿生品牌。', driving: '歐系實用。', powertrain: '汽油與電動。' }),
    ],
  },
];
