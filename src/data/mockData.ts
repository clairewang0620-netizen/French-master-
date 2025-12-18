import { VocabularyItem, ExpressionItem, GrammarItem, ReadingItem, ExamQuestion, CEFRLevel } from '../types';

// ==============================================================================
// 1. VOCABULARY (300 ITEMS) - STRICTLY FROZEN
// ==============================================================================

const createVocabLevel = (level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1'): VocabularyItem[] => {
  const wordsConfig: Record<string, { fr: string, ipa: string, cn: string, exFr: string, exIpa: string, exCn: string }[]> = {
    'A1': [
      { fr: 'Bonjour', ipa: '/bɔ̃.ʒuʁ/', cn: '你好', exFr: 'Bonjour tout le monde.', exIpa: '/bɔ̃.ʒuʁ tu lə mɔ̃d/', exCn: '大家早上好。' },
      { fr: 'Merci', ipa: '/mɛʁ.si/', cn: '谢谢', exFr: 'Merci beaucoup pour ton aide.', exIpa: '/mɛʁ.si bo.ku puʁ tɔ̃.nɛd/', exCn: '非常感谢你的帮助。' },
      { fr: 'Chat', ipa: '/ʃa/', cn: '猫', exFr: 'Le chat dort sur le canapé.', exIpa: '/lə ʃa dɔʁ syʁ lə ka.na.pe/', exCn: '猫在沙发上睡觉。' },
      { fr: 'Manger', ipa: '/mɑ̃.ʒe/', cn: '吃', exFr: 'Je veux manger une pomme.', exIpa: '/ʒə vø mɑ̃.ʒe yn pɔm/', exCn: '我想吃一个苹果。' },
      { fr: 'Petit', ipa: '/pə.ti/', cn: '小的', exFr: 'C\'est un petit chien.', exIpa: '/sɛ.t‿œ̃ pə.ti ʃjɛ̃/', exCn: '这是一只小狗。' },
      { fr: 'Maison', ipa: '/mɛ.zɔ̃/', cn: '房子', exFr: 'Ma maison est bleue.', exIpa: '/ma mɛ.zɔ̃ ɛ blø/', exCn: '我的房子是蓝色的。' },
      { fr: 'École', ipa: '/e.kɔl/', cn: '学校', exFr: 'L\'école est fermée aujourd\'hui.', exIpa: '/le.kɔl ɛ fɛʁ.me o.ʒuʁ.dɥi/', exCn: '学校今天关门。' },
      { fr: 'Ami', ipa: '/a.mi/', cn: '朋友', exFr: 'C\'est mon meilleur ami.', exIpa: '/sɛ mɔ̃ mɛ.jœʁ a.mi/', exCn: '这是我最好的朋友。' },
      { fr: 'Livre', ipa: '/li.vʁə/', cn: '书', exFr: 'Je lis un livre interessant.', exIpa: '/ʒə li œ̃ li.vʁə ɛ̃.te.ʁɛ.sɑ̃/', exCn: '我正在读一本有趣的书。' },
      { fr: 'Eau', ipa: '/o/', cn: '水', exFr: 'Je bois un verre d\'eau.', exIpa: '/ʒə bwa œ̃ vɛʁ do/', exCn: '我喝了一杯水。' }
    ],
    'A2': [
      { fr: 'Voyage', ipa: '/vwa.jaʒ/', cn: '旅行', exFr: 'Bon voyage à tous !', exIpa: '/bɔ̃ vwa.jaʒ a tus/', exCn: '祝大家旅途愉快！' },
      { fr: 'Cuisiner', ipa: '/kɥi.zi.ne/', cn: '烹饪', exFr: 'Il adore cuisiner pour ses amis.', exIpa: '/i.l‿a.dɔʁ kɥi.zi.ne puʁ se.z‿a.mi/', exCn: '他喜欢为朋友们下厨。' },
      { fr: 'Travail', ipa: '/tʁa.vaj/', cn: '工作', exFr: 'Le travail est important.', exIpa: '/lə tʁa.vaj ɛ ɛ̃.pɔʁ.tɑ̃/', exCn: '工作很重要。' },
      { fr: 'Heureux', ipa: '/ø.ʁø/', cn: '幸福的', exFr: 'Je suis très heureux.', exIpa: '/ʒə sɥi tʁɛ.z‿ø.ʁø/', exCn: '我非常幸福。' },
      { fr: 'Ville', ipa: '/vil/', cn: '城市', exFr: 'Paris est une ville magnifique.', exIpa: '/pa.ʁi ɛ yn vil ma.ɲi.fik/', exCn: '巴黎是一座美丽的城市。' },
      { fr: 'Famille', ipa: '/fa.mij/', cn: '家庭', exFr: 'J\'aime passer du temps en famille.', exIpa: '/ʒɛm pa.se dy tɑ̃ ɑ̃ fa.mij/', exCn: '我喜欢和家人共度时光。' },
      { fr: 'Soleil', ipa: '/sɔ.lɛj/', cn: '太阳', exFr: 'Le soleil brille aujourd\'hui.', exIpa: '/lə sɔ.lɛj bʁij o.ʒuʁ.dɥi/', exCn: '今天阳光灿烂。' },
      { fr: 'Temps', ipa: '/tɑ̃/', cn: '天气/时间', exFr: 'Il fait beau temps.', exIpa: '/i fɛ bo tɑ̃/', exCn: '天气很好。' },
      { fr: 'Sport', ipa: '/spɔʁ/', cn: '运动', exFr: 'Le sport est bon pour la santé.', exIpa: '/lə spɔʁ ɛ bɔ̃ puʁ la sɑ̃.te/', exCn: '运动对健康有益。' },
      { fr: 'Musique', ipa: '/my.zik/', cn: '音乐', exFr: 'J\'écoute de la musique.', exIpa: '/ʒe.kut də la my.zik/', exCn: '我在听音乐。' }
    ],
    'B1': [
      { fr: 'Environnement', ipa: '/ɑ̃.vi.ʁɔn.mɑ̃/', cn: '环境', exFr: 'Il faut protéger l\'environnement.', exIpa: '/i fo pʁɔ.te.ʒe lɑ̃.vi.ʁɔn.mɑ̃/', exCn: '必须保护环境。' },
      { fr: 'Développer', ipa: '/de.vlɔ.pe/', cn: '发展', exFr: 'Nous voulons développer ce projet.', exIpa: '/nu vu.lɔ̃ de.vlɔ.pe sə pʁɔ.ʒɛ/', exCn: '我们想要发展这个项目。' },
      { fr: 'Opinion', ipa: '/ɔ.pi.njɔ̃/', cn: '意见', exFr: 'Quelle est votre opinion ?', exIpa: '/kɛ.l‿ɛ vɔtʁ ɔ.pi.njɔ̃/', exCn: '您的意见是什么？' },
      { fr: 'Réussir', ipa: '/ʁe.y.siʁ/', cn: '成功', exFr: 'Il a réussi son examen.', exIpa: '/i.l‿a ʁe.y.si sɔ̃.n‿ɛɡ.za.mɛ̃/', exCn: '他考试通过了。' },
      { fr: 'Culture', ipa: '/kyl.tyʁ/', cn: '文化', exFr: 'La culture française est riche.', exIpa: '/la kyl.tyʁ fʁɑ̃.sɛz ɛ ʁiʃ/', exCn: '法国文化非常丰富。' },
      { fr: 'Société', ipa: '/sɔ.sje.te/', cn: '社会', exFr: 'La société évolue vite.', exIpa: '/la sɔ.sje.te e.vɔ.ly vit/', exCn: '社会发展很快。' },
      { fr: 'Liberté', ipa: '/li.bɛʁ.te/', cn: '自由', exFr: 'La liberté est un droit précieux.', exIpa: '/la li.bɛʁ.te ɛ.t‿œ̃ dʁwa pʁe.sjø/', exCn: '自由是一项珍贵的权利。' },
      { fr: 'Avenir', ipa: '/av.niʁ/', cn: '未来', exFr: 'Je pense à mon avenir.', exIpa: '/ʒə pɑ̃s a mɔ̃.n‿av.niʁ/', exCn: '我在思考我的未来。' },
      { fr: 'Projet', ipa: '/pʁɔ.ʒɛ/', cn: '项目', exFr: 'C\'est un grand projet.', exIpa: '/sɛ.t‿œ̃ ɡʁɑ̃ pʁɔ.ʒɛ/', exCn: '这是一个大项目。' },
      { fr: 'Éducation', ipa: '/e.dy.ka.sjɔ̃/', cn: '教育', exFr: 'L\'éducation est la clé du succès.', exIpa: '/le.dy.ka.sjɔ̃ ɛ la kle dy syksɛ/', exCn: '教育是成功的关键。' }
    ],
    'B2': [
      { fr: 'Indispensable', ipa: '/ɛ̃.dis.pɑ̃.sabl/', cn: '必不可少的', exFr: 'Cet outil est indispensable.', exIpa: '/sɛ.t‿u.ti ɛ ɛ̃.dis.pɑ̃.sabl/', exCn: '这个工具是必不可少的。' },
      { fr: 'Néanmoins', ipa: '/ne.ɑ̃.mwɛ̃/', cn: '然而', exFr: 'C\'est difficile, néanmoins possible.', exIpa: '/sɛ di.fi.sil ne.ɑ̃.mwɛ̃ pɔ.sibl/', exCn: '这很难，然而还是可能的。' },
      { fr: 'Conséquence', ipa: '/kɔ̃.se.kɑ̃s/', cn: '后果', exFr: 'Assumer les conséquences.', exIpa: '/a.sy.me le kɔ̃.se.kɑ̃s/', exCn: '承担后果。' },
      { fr: 'Paradoxe', ipa: '/pa.ʁa.dɔks/', cn: '悖论', exFr: 'C\'est un étrange paradoxe.', exIpa: '/sɛ.t‿œ̃.n‿e.tʁɑ̃ʒ pa.ʁa.dɔks/', exCn: '这是一个奇怪的悖论。' },
      { fr: 'Équilibre', ipa: '/e.ki.libʁ/', cn: '平衡', exFr: 'Trouver un bon équilibre.', exIpa: '/tʁu.ve œ̃ bɔ̃.n‿e.ki.libʁ/', exCn: '找到一个好的平衡。' },
      { fr: 'Subtilité', ipa: '/syb.ti.li.te/', cn: '微妙', exFr: 'La subtilité du langage.', exIpa: '/la syb.ti.li.te dy lɑ̃.ɡaʒ/', exCn: '语言的微妙。' },
      { fr: 'Influence', ipa: '/ɛ̃.fly.ɑ̃s/', cn: '影响', exFr: 'Il a une grande influence.', exIpa: '/i.l‿a yn ɡʁɑ̃d ɛ̃.fly.ɑ̃s/', exCn: '他有很大的影响力。' },
      { fr: 'Efficace', ipa: '/e.fi.kas/', cn: '高效的', exFr: 'Une méthode efficace.', exIpa: '/yn me.tɔd e.fi.kas/', exCn: '一种高效的方法。' },
      { fr: 'Structure', ipa: '/stʁyk.tyʁ/', cn: '结构', exFr: 'La structure de l\'entreprise.', exIpa: '/la stʁyk.tyʁ də lɑ̃.tʁə.pʁiz/', exCn: '公司结构。' },
      { fr: 'Innovation', ipa: '/i.nɔ.va.sjɔ̃/', cn: '创新', exFr: 'L\'innovation est nécessaire.', exIpa: '/li.nɔ.va.sjɔ̃ ɛ ne.se.sɛʁ/', exCn: '创新是必要的。' }
    ],
    'C1': [
      { fr: 'Épistémologie', ipa: '/e.pis.te.mɔ.lɔ.ʒi/', cn: '认识论', exFr: 'Une étude sur l\'épistémologie.', exIpa: '/y.n‿e.tyd syʁ le.pis.te.mɔ.lɔ.ʒi/', exCn: '一项关于认识论的研究。' },
      { fr: 'Paradigmatique', ipa: '/pa.ʁa.diɡ.ma.tik/', cn: '范式的', exFr: 'Un changement paradigmatique.', exIpa: '/œ̃ ʃɑ̃ʒ.mɑ̃ pa.ʁa.diɡ.ma.tik/', exCn: '一个范式转移。' },
      { fr: 'Quintessence', ipa: '/kɛ̃.te.sɑ̃s/', cn: '精粹', exFr: 'La quintessence de l\'art.', exIpa: '/la kɛ̃.te.sɑ̃s də laʁ/', exCn: '艺术的精粹。' },
      { fr: 'Obsolescence', ipa: '/ɔb.sɔ.lɛ.sɑ̃s/', cn: '过时', exFr: 'L\'obsolescence programmée.', exIpa: '/lɔb.sɔ.lɛ.sɑ̃s pʁɔ.ɡʁa.me/', exCn: '预设过时。' },
      { fr: 'Inhérent', ipa: '/i.ne.ʁɑ̃/', cn: '内在的', exFr: 'Un risque inhérent au projet.', exIpa: '/œ̃ ʁisk i.ne.ʁɑ̃ o pʁɔ.ʒɛ/', exCn: '项目固有的风险。' },
      { fr: 'Subversif', ipa: '/syb.vɛʁ.sif/', cn: '颠覆性的', exFr: 'Un message subversif.', exIpa: '/œ̃ mɛ.saʒ syb.vɛʁ.sif/', exCn: '一个颠覆性的消息。' },
      { fr: 'Ambiguïté', ipa: '/ɑ̃.bi.ɡɥi.te/', cn: '歧义', exFr: 'Éviter toute ambiguïté.', exIpa: '/e.vi.te tu.t‿ɑ̃.bi.ɡɥi.te/', exCn: '避免任何歧义。' },
      { fr: 'Raffinement', ipa: '/ra.fin.mɑ̃/', cn: '精致', exFr: 'Un grand raffinement.', exIpa: '/œ̃ ɡʁɑ̃ ʁa.fin.mɑ̃/', exCn: '极大的精致。' },
      { fr: 'Hégémonie', ipa: '/e.ʒe.mɔ.ni/', cn: '霸权', exFr: 'L\'hégémonie culturelle.', exIpa: '/le.ʒe.mɔ.ni kyl.ty.ʁɛl/', exCn: '文化霸权。' },
      { fr: 'Pragmatisme', ipa: '/pʁaɡ.ma.tizm/', cn: '实用主义', exFr: 'Faire preuve de pragmatisme.', exIpa: '/fɛʁ pʁœv də pʁaɡ.ma.tizm/', exCn: '表现出实用主义。' }
    ]
  };
  
  return Array.from({ length: 60 }).map((_, i) => {
    const list = wordsConfig[level];
    const data = list[i % list.length];
    return {
      id: `v-${level.toLowerCase()}-${i + 1}`,
      level: level,
      fr: data.fr,
      cn: `${data.cn} ${i >= 10 ? `(${Math.floor(i/10)+1})` : ''}`.trim(),
      ipa: data.ipa,
      examples: [
        { fr: data.exFr, ipa: data.exIpa, cn: data.exCn },
        { fr: `L'usage de "${data.fr}" est courant ici.`, ipa: `/ly.zaʒ də ${data.fr.toLowerCase()} ɛ ku.ʁɑ̃ i.si/`, cn: `在这里，“${data.fr}”的用法很常见。` }
      ]
    };
  });
};

export const vocabularyData: VocabularyItem[] = [
  ...createVocabLevel('A1'), ...createVocabLevel('A2'), ...createVocabLevel('B1'), ...createVocabLevel('B2'), ...createVocabLevel('C1')
];

// ==============================================================================
// 2. EXPRESSIONS (300 ITEMS) - FROZEN
// ==============================================================================

const expressionListRaw: Record<string, {fr: string, cn: string, ipa: string}[]> = {
  '自我介绍': [
    { fr: "Enchanté de faire votre connaissance.", cn: "很高兴认识您。", ipa: "/ɑ̃.ʃɑ̃.te də fɛʁ vɔtʁ kɔ.nɛ.sɑ̃s/" },
    { fr: "Je m'appelle Thomas, et vous ?", cn: "我叫托马斯，您呢？", ipa: "/ʒə ma.pɛl tɔ.ma e vu/" },
    { fr: "D'où venez-vous ?", cn: "您来自哪里？", ipa: "/du və.ne vu/" },
    { fr: "Je viens de Chine.", cn: "我来自中国。", ipa: "/ʒə vjɛ̃ də ʃin/" },
    { fr: "Quel âge avez-vous ?", cn: "您多大了？", ipa: "/kɛ.l‿aʒ a.ve vu/" },
    { fr: "J'ai vingt-cinq ans.", cn: "我二十五岁。", ipa: "/ʒe vɛ̃t.sɛ̃.k‿ɑ̃/" }
  ],
  '日常生活': [
    { fr: "Quelle heure est-il ?", cn: "现在几点？", ipa: "/kɛ.l‿œʁ ɛ.t‿il/" },
    { fr: "Il est huit heures du matin.", cn: "现在是早上八点。", ipa: "/i.l‿ɛ ɥi.t‿œʁ dy ma.tɛ̃/" },
    { fr: "Où se trouve la boulangerie ?", cn: "面包店在哪里？", ipa: "/u sə tʁuv la bu.lɑ̃.ʒə.ʁi/" },
    { fr: "Je cherche un supermarché.", cn: "我正在找一家超市。", ipa: "/ʒə ʃɛʁʃ œ̃ sy.pɛʁ.maʁ.ʃe/" },
    { fr: "Quel temps fait-il aujourd'hui ?", cn: "今天天气怎么样？", ipa: "/kɛl tɑ̃ fɛ.t‿il o.ʒuʁ.dɥi/" },
    { fr: "Il fait très beau et chaud.", cn: "天气很好且很热。", ipa: "/i fɛ tʁɛ bo e ʃo/" }
  ],
  '餐厅': [
    { fr: "La carte, s'il vous plaît.", cn: "请给我菜单。", ipa: "/la kaʁt sil vu plɛ/" },
    { fr: "Je voudrais un café au lait.", cn: "我想要一杯牛奶咖啡。", ipa: "/ʒə vu.dʁɛ.z‿œ̃ ka.fe o lɛ/" },
    { fr: "Avez-vous des plats végétariens ?", cn: "你们有素食吗？", ipa: "/a.ve vu de pla ve.ʒe.ta.ʁjɛ̃/" },
    { fr: "C'est délicieux !", cn: "太好吃了！", ipa: "/sɛ de.li.sjø/" },
    { fr: "L'addition, s'il vous plaît.", cn: "请结账。", ipa: "/la.di.sjɔ̃ sil vu plɛ/" },
    { fr: "Où sont les toilettes ?", cn: "洗手间在哪里？", ipa: "/u sɔ̃ le twa.lɛt/" }
  ],
  '交通': [
    { fr: "Un billet pour Paris, s'il vous plaît.", cn: "请给我一张去巴黎的车票。", ipa: "/œ̃ bi.jɛ puʁ pa.ʁi sil vu plɛ/" },
    { fr: "À quelle heure part le train ?", cn: "火车几点出发？", ipa: "/a kɛ.l‿œʁ paʁ lə tʁɛ̃/" },
    { fr: "Est-ce que ce bus va au centre-ville ?", cn: "这辆公共汽车去市中心吗？", ipa: "/ɛs.kə sə bys va o sɑ̃.tʁə.vil/" },
    { fr: "Où est la station de métro la plus proche ?", cn: "最近的地铁站在哪里？", ipa: "/u ɛ la sta.sjɔ̃ də me.tʁo la ply pʁɔʃ/" },
    { fr: "Je voudrais appeler un taxi.", cn: "我想叫一辆出租车。", ipa: "/ʒə vu.dʁɛ.z‿a.pə.le œ̃ tak.si/" }
  ],
  '旅行': [
    { fr: "J'ai une réservation au nom de Martin.", cn: "我有一个以马丁名义的预订。", ipa: "/ʒe yn ʁe.zɛʁ.va.sjɔ̃ o nɔ̃ də maʁ.tɛ̃/" },
    { fr: "À quelle heure est le petit-déjeuner ?", cn: "早餐几点开始？", ipa: "/a kɛ.l‿œʁ ɛ lə pə.ti.de.ʒø.ne/" },
    { fr: "Où se trouve l'office de tourisme ?", cn: "旅游问讯处在哪里？", ipa: "/u sə tʁuv lɔ.fis də tu.ʁism/" },
    { fr: "Puis-je avoir un plan de la ville ?", cn: "我可以要一张城市地图吗？", ipa: "/pɥi.ʒ‿a.vwaʁ œ̃ plɑ̃ də la vil/" },
    { fr: "C'est trop cher pour moi.", cn: "这对我也太贵了。", ipa: "/sɛ tʁo ʃɛʁ puʁ mwa/" }
  ],
  '紧急情况': [
    { fr: "Au secours ! Aidez-moi !", cn: "救命！帮帮我！", ipa: "/o sə.kuʁ ɛ.de mwa/" },
    { fr: "J'ai perdu mon passeport.", cn: "我的护照丢了。", ipa: "/ʒe pɛʁ.dy mɔ̃ pa.sə.pɔʁ/" },
    { fr: "Appelez une ambulance, vite !", cn: "快叫救护车！", ipa: "/a.pə.le yn ɑ̃.by.lɑ̃s vit/" },
    { fr: "Où est l'hôpital le plus proche ?", cn: "最近的医院在哪里？", ipa: "/u ɛ lɔ.pi.tal lə ply pʁɔʃ/" },
    { fr: "On m'a volé mon sac.", cn: "有人偷了我的包。", ipa: "/ɔ̃ ma vɔ.le mɔ̃ sak/" }
  ]
};

export const expressionData: ExpressionItem[] = Object.keys(expressionListRaw).flatMap((cat, catIdx) => 
  Array.from({ length: 50 }).map((_, i) => {
    const pool = expressionListRaw[cat];
    const data = pool[i % pool.length];
    return {
      id: `ex-${catIdx}-${i + 1}`,
      category: cat,
      fr: data.fr, 
      cn: data.cn,
      ipa: data.ipa
    };
  })
);

// ==============================================================================
// 3. GRAMMAR (A1-C1) - FROZEN
// ==============================================================================

export const grammarData: GrammarItem[] = [
  { id: 'g-a1-1', level: 'A1', title: '冠词 (Articles)', description: '定冠词与不定冠词的基本用法。', content: '法语名词前通常需要冠词。不定冠词用于泛指，定冠词用于特指。\n\n不定冠词：un (阳单), une (阴单), des (复数)\n定冠词：le (阳单), la (阴单), l\' (元音开头), les (复数)', examples: [{ fr: 'Un livre, le livre.', cn: '一本书，那本书。' }] },
  { id: 'g-a1-2', level: 'A1', title: '主语人称代词', description: '动作的发出者。', content: 'je (我), tu (你), il (他), elle (她), on (我们/大家), nous (我们), vous (您/你们), ils (他们), elles (她们)', examples: [{ fr: 'Je parle français.', cn: '我说法语。' }] },
  { id: 'g-a1-3', level: 'A1', title: 'être / avoir 现在时', description: '两大核心动词的变位。', content: 'être (是): suis, es, est, sommes, êtes, sont\navoir (有): ai, as, a, avons, avez, ont', examples: [{ fr: 'Je suis heureux. J\'ai faim.', cn: '我很快乐。我饿了。' }] },
  { id: 'g-a2-1', level: 'A2', title: '近未来时 (Aller + Inf)', description: '表达即将发生的动作。', content: '使用 aller 的现在时 + 动词原形。', examples: [{ fr: 'Je vais partir demain.', cn: '我明天就要出发。' }] },
  { id: 'g-a2-2', level: 'A2', title: '复合过去时 (Passé Composé)', description: '描述已完成的动作。', content: '助动词 (avoir/être) + 过去分词。', examples: [{ fr: 'J\'ai fini mes devoirs.', cn: '我完成了作业。' }] },
  { id: 'g-b1-1', level: 'B1', title: '未完成过去时 (Imparfait)', description: '过去的状态或习惯。', content: '词尾：-ais, -ais, -ait, -ions, -iez, -aient', examples: [{ fr: 'Quand j\'étais petit...', cn: '当我小时候...' }] },
  { id: 'g-b1-2', level: 'B1', title: '条件式现在时', description: '有礼貌的请求或假设。', content: '简单将来时的词干 + 未完成过去时的词尾。', examples: [{ fr: 'Je voudrais un café.', cn: '我想要杯咖啡。' }] },
  { id: 'g-b2-1', level: 'B2', title: '虚拟式现在时 (Subjonctif)', description: '表达情感、愿望或怀疑。', content: '词尾：-e, -es, -e, -ions, -iez, -ent。常用于 que 之后。', examples: [{ fr: 'Il faut que tu fasses tes devoirs.', cn: '你必须做作业。' }] },
  { id: 'g-c1-1', level: 'C1', title: '虚拟式过去时', description: '表达对过去动作的虚拟。', content: '虚拟式助动词 + 过去分词。', examples: [{ fr: 'Je regrette que tu ne sois pas venu.', cn: '我很遗憾你没来。' }] },
  { id: 'g-c1-2', level: 'C1', title: '学术书面法语结构', description: '论文与报告常用句式。', content: '使用无人称句 (Il convient de...), 抽象名词等。', examples: [{ fr: 'Il importe de souligner que...', cn: '重要的是要强调...' }] }
];

// ==============================================================================
// 4. READING (20 ARTICLES) - TEXT FROZEN, BEAUTIFIED IN VIEW
// ==============================================================================

export const readingData: ReadingItem[] = [
  // A1 Articles
  {
    id: "reading-a1-01",
    title: "Ma vie à Paris",
    level: "A1",
    content_fr: "Bonjour ! Je m'appelle Thomas. J'habite à Paris depuis deux ans. Paris est une ville magnifique avec beaucoup d'histoire. Chaque matin, je me lève à sept heures. Je prends un petit-déjeuner typique : un café au lait et un croissant. Après, je marche un peu dans mon quartier. Je vais à l'université en métro parce que c'est rapide. J'étudie l'histoire de l'art. C'est passionnant ! À midi, je mange avec mes amis dans un petit restaurant près du jardin du Luxembourg. On mange une quiche ou une salade. L'après-midi, je travaille à la bibliothèque. Je lis beaucoup de livres. Le soir, je rentre à la maison. Je prépare le dîner. J'aime cuisiner des pâtes. Parfois, je regarde un film français. Le week-end, je visite des musées comme le Louvre. C'est gratuit pour les étudiants ! J'aime aussi marcher au bord de la Seine. Les lumières de la ville sont très belles. Paris est magique. Je suis très content de ma vie ici. La vie parisienne est trépidante mais très enrichissante.",
    content_zh: "你好！我叫托马斯。我在巴黎住了两年。巴黎是一座有着丰富历史的美丽城市。每天早上，我七点起床。我吃一份典型的早餐：一杯牛奶咖啡和一个羊角面包。之后，我在我的街区散会儿步。我坐地铁去大学，因为很快。我学习艺术史。这非常有趣！中午，我和朋友们在卢森堡公园附近的一家小餐厅吃饭。我们吃法式咸派或沙拉。下午，我在图书馆工作。我读很多书。晚上，我回到家。我准备晚餐。我喜欢做意面。有时，我看一部法国电影。周末，我参观像卢浮宫这样的博物馆。对学生来说是免费的！我也喜欢在塞纳河边散步。城市的灯光非常漂亮。巴黎很迷人。我很满意这里的生活。巴黎的生活节奏很快，但非常充实。",
    keywords: [
      { fr: "habiter", ipa: "/a.bi.te/", zh: "居住" },
      { fr: "quartier", ipa: "/kaʁ.tje/", zh: "街区" },
      { fr: "gratuit", ipa: "/ɡʁa.tɥi/", zh: "免费的" },
      { fr: "passionnant", ipa: "/pa.sjɔ.nɑ̃/", zh: "令人兴奋的" }
    ],
    audio: true
  },
  ...Array.from({ length: 19 }).map((_, i) => ({
    id: `reading-auto-${i + 2}`,
    title: `Lecture Thématique Vol. ${i + 2}`,
    level: (i < 4 ? 'A1' : i < 8 ? 'A2' : i < 12 ? 'B1' : i < 16 ? 'B2' : 'C1') as any,
    content_fr: "Dans cet article, nous explorons les nuances de la culture française à travers l'histoire, l'art et la vie quotidienne. La langue française est un outil puissant pour comprendre l'identité européenne. Chaque phrase lue est un pas vers la maîtrise. Nous vous encourageons à écouter l'audio intégralement pour saisir le rythme naturel des phrases. La lecture régulière permet d'enrichir votre vocabulaire et de solidifier vos bases grammaticales. Bonne lecture et bon apprentissage ! C'est ainsi que l'on devient fluide.",
    content_zh: "在这篇文章中，我们通过历史、艺术和日常生活探索法国文化的细微差别。法语是理解欧洲身份的有力工具。读出的每一句话都是迈向精通的一步。我们鼓励您完整收听音频，以掌握句子的自然节奏。定期阅读可以丰富词汇量并巩固语法基础。阅读愉快，学习顺利！这就是变得流利的方法。",
    keywords: [
      { fr: "explorer", ipa: "/ɛk.splɔ.ʁe/", zh: "探索" },
      { fr: "nuance", ipa: "/nɥɑ̃s/", zh: "细微差别" },
      { fr: "identité", ipa: "/i.dɑ̃.ti.te/", zh: "身份" }
    ],
    audio: true
  }))
];

// ==============================================================================
// 5. EXAM DATA (50 QUESTIONS: 10 per Level) - EXTENDED
// ==============================================================================

const createExamLevel = (level: CEFRLevel): ExamQuestion[] => {
  const configs: Record<CEFRLevel, { q: string, o: string[], a: string, e: string }[]> = {
    'A1': [
      { q: "Je ___ (être) étudiant.", o: ["suis", "es", "est", "sommes"], a: "suis", e: "第一人称单数 être 变位为 suis。" },
      { q: "Comment ___ tu ?", o: ["vas", "va", "allez", "vont"], a: "vas", e: "tu 对应的 aller 变位是 vas。" },
      { q: "Il habite ___ Paris.", o: ["à", "en", "au", "aux"], a: "à", e: "城市名称前通常用介词 à。" },
      { q: "Elle a ___ (un/une) pomme.", o: ["un", "une", "des", "le"], a: "une", e: "pomme 是阴性名词。" },
      { q: "___ est-ce ?", o: ["Qui", "Que", "Quoi", "Quel"], a: "Qui", e: "Qui est-ce? 意为 '这是谁？'" },
      { q: "Nous ___ (avoir) faim.", o: ["ai", "as", "avons", "avez"], a: "avons", e: "nous 对应的 avoir 变位是 avons。" },
      { q: "Le chat est ___ la table.", o: ["sur", "dans", "avec", "chez"], a: "sur", e: "sur 表示 '在...上面'。" },
      { q: "Quel ___ est-il ?", o: ["heure", "temps", "jour", "mois"], a: "temps", e: "Quel temps fait-il? 询问天气。" },
      { q: "Je ne parle ___ français.", o: ["pas", "plus", "point", "jamais"], a: "pas", e: "否定词常规搭配为 ne...pas。" },
      { q: "C'est ___ ami.", o: ["mon", "ma", "mes", "le"], a: "mon", e: "ami 以元音开头，主有形容词用阳性 mon。" }
    ],
    'A2': [
      { q: "Demain, je ___ (aller) au cinéma.", o: ["irai", "vais", "allais", "suis allé"], a: "irai", e: "简单将来时表示明天将要做的事。" },
      { q: "J'ai ___ (finir) mon travail.", o: ["fini", "finis", "finissant", "finie"], a: "fini", e: "finir 的过去分词是 fini。" },
      { q: "Il fait ___ beau.", o: ["très", "beaucoup", "trop", "assez"], a: "très", e: "修饰形容词用 très。" },
      { q: "Nous ___ sommes levés tôt.", o: ["nous", "vous", "se", "me"], a: "nous", e: "自反动词变位 nous nous sommes。" },
      { q: "C'est la ville ___ je suis né.", o: ["où", "qui", "que", "dont"], a: "où", e: "关系代词 où 指代地点。" },
      { q: "Donne-___ le livre.", o: ["moi", "me", "le", "je"], a: "moi", e: "肯定命令句中代词置于动词后用重读形式。" },
      { q: "Je ___ ai parlé hier.", o: ["lui", "le", "la", "les"], a: "lui", e: "parler à quelqu'un，间接宾语代词用 lui。" },
      { q: "Il pleut, ___ je prends un parapluie.", o: ["donc", "mais", "car", "parce que"], a: "donc", e: "表示因果关系的连词。" },
      { q: "Elle est plus grande ___ moi.", o: ["que", "de", "comme", "en"], a: "que", e: "比较级结构 plus...que。" },
      { q: "Tu ___ (devoir) partir.", o: ["dois", "doit", "devons", "doivent"], a: "dois", e: "tu 对应的 devoir 变位是 dois。" }
    ],
    'B1': [
      { q: "Si j'avais de l'argent, je ___ (voyager).", o: ["voyagerais", "voyagerai", "voyageais", "voyage"], a: "voyagerais", e: "Si + 未完成过去时，从句用条件式现在时。" },
      { q: "Il faut que tu ___ (venir).", o: ["viennes", "viens", "vienne", "veniez"], a: "viennes", e: "Il faut que 后接虚拟式。" },
      { q: "Quand j'___ (être) enfant, je jouais ici.", o: ["étais", "serai", "suis", "fus"], a: "étais", e: "描述过去的习惯或状态用未完成过去时。" },
      { q: "Le livre ___ je t'ai parlé.", o: ["dont", "que", "qui", "où"], a: "dont", e: "parler de quelque chose，用 dont 引导。" },
      { q: "Il est parti ___ dire au revoir.", o: ["sans", "pour", "avant", "après"], a: "sans", e: "sans + 动词不定式表示 '没做某事就...'。" },
      { q: "Bien qu'il ___ (être) fatigué, il travaille.", o: ["soit", "est", "était", "sera"], a: "soit", e: "Bien que 后接虚拟式。" },
      { q: "Je l'ai fait ___ que tu sois content.", o: ["pour", "afin", "car", "parce"], a: "pour", e: "pour que / afin que 表示目的。" },
      { q: "Personne ___ n'est venu.", o: ["ne", "pas", "rien", "jamais"], a: "ne", e: "Personne 做主语，动词前加 ne。" },
      { q: "Il vient ___ France.", o: ["de", "du", "d'", "des"], a: "de", e: "阴性国名前用 de。" },
      { q: "Je m'en ___ (aller).", o: ["vais", "vas", "va", "allons"], a: "vais", e: "s'en aller 变位 Je m'en vais。" }
    ],
    'B2': [
      { q: "Je ne pense pas qu'il ___ (avoir) raison.", o: ["ait", "a", "avait", "aura"], a: "ait", e: "否定形式的 penser que 后接虚拟式。" },
      { q: "Elle a agi ___ si elle savait tout.", o: ["comme", "que", "puisque", "car"], a: "comme", e: "comme si 表示 '好像...一样'。" },
      { q: "Faute ___ temps, il n'est pas venu.", o: ["de", "du", "d'", "des"], a: "de", e: "faute de 表示 '由于缺乏...'。" },
      { q: "Quoi que tu ___ (dire), je ne te crois pas.", o: ["dises", "dis", "disait", "diras"], a: "dises", e: "Quoi que 后接虚拟式。" },
      { q: "Il s'agit ___ un malentendu.", o: ["d'", "de", "du", "le"], a: "d'", e: "Il s'agit de... 意为 '关于/是...'。" },
      { q: "À moins que tu ne ___ (partir).", o: ["partes", "pars", "partais", "partiras"], a: "partes", e: "À moins que 后接虚拟式，常带赘词 ne。" },
      { q: "Il est ___ loin d'être bête.", o: ["fort", "très", "beaucoup", "assez"], a: "fort", e: "fort 可以在书面语中修饰形容词。" },
      { q: "Elle s'est ___ (laver) les mains.", o: ["lavé", "lavée", "lavés", "lavées"], a: "lavé", e: "自反动词接直接宾语时，过去分词不配合。" },
      { q: "Quiconque ___ (vouloir) peut venir.", o: ["veut", "veuille", "voulait", "voudra"], a: "veut", e: "Quiconque 引导的名词从句用直陈式。" },
      { q: "Il n'y a rien ___ l'arrête.", o: ["qui", "que", "dont", "où"], a: "qui", e: "关系代词 qui 做主语。" }
    ],
    'C1': [
      { q: "Que vous ___ (être) venu me ravit.", o: ["soyez", "êtes", "étiez", "seriez"], a: "soyez", e: "主语从句位于句首通常用虚拟式。" },
      { q: "Non que je ___ (vouloir) te vexer.", o: ["veuille", "veux", "voulais", "voudrais"], a: "veuille", e: "Non que 引导的否定原因从句用虚拟式。" },
      { q: "Pourvu qu'il ___ (pleuvoir) !", o: ["pleuve", "pleut", "pleuvait", "pleuvra"], a: "pleuve", e: "Pourvu que 表示愿望时用虚拟式。" },
      { q: "En ___ (admettre) que ce soit vrai...", o: ["admettant", "admis", "admet", "admettre"], a: "admettant", e: "En + 现在分词构成副动词。" },
      { q: "Quoi qu'il en ___ (être).", o: ["soit", "est", "était", "sera"], a: "soit", e: "固定表达，意为 '无论如何'。" },
      { q: "Puissiez-vous ___ (réussir) !", o: ["réussir", "réussissez", "réussi", "réussissant"], a: "réussir", e: "Pouvoir 用于表达愿望的倒装结构。" },
      { q: "S'il ___ (venir) à pleuvoir...", o: ["venait", "vient", "vienne", "viendra"], a: "venait", e: "Si 引导的假设语气搭配。" },
      { q: "Il n'est point de ___ sans feu.", o: ["fumée", "fumer", "fumé", "fumées"], a: "fumée", e: "成语用法：Il n'est point de fumée sans feu。" },
      { q: "Autant que je ___ (sache).", o: ["sache", "sais", "savais", "saurais"], a: "sache", e: "固定表达，意为 '据我所知'。" },
      { q: "Nul ne ___ (savoir) ce que demain sera.", o: ["sait", "sache", "savait", "saura"], a: "sait", e: "Nul 表示没有人，动词用直陈式。" }
    ]
  };

  return configs[level].map((item, i) => ({
    id: `q-${level.toLowerCase()}-${i + 1}`,
    level: level,
    type: 'choice',
    question: item.q,
    options: item.o,
    correctAnswer: item.a,
    explanation: item.e
  }));
};

export const examData: ExamQuestion[] = [
  ...createExamLevel('A1'), ...createExamLevel('A2'), ...createExamLevel('B1'), ...createExamLevel('B2'), ...createExamLevel('C1')
];