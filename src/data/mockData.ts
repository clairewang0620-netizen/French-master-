import { VocabularyItem, ExpressionItem, CEFRLevel, ExamQuestion } from '../types';

const AUDIO_BASE = "/audio";

// ==============================================================================
// 1. CORE VOCABULARY (Bound to standardized /audio/words/ paths)
// ==============================================================================
export const vocabularyData: VocabularyItem[] = [
  // A1 Level
  { 
    id: 'v-a1-1', level: 'A1', fr: 'Bonjour', ipa: '/bɔ̃.ʒuʁ/', cn: '你好', 
    audio: `${AUDIO_BASE}/words/A1_1.mp3`,
    examples: [{ fr: 'Bonjour, comment ça va ?', cn: '你好，最近怎么样？', audio: `${AUDIO_BASE}/words/A1_1_ex1.mp3` }] 
  },
  { 
    id: 'v-a1-2', level: 'A1', fr: 'Merci', ipa: '/mɛʁ.si/', cn: '谢谢', 
    audio: `${AUDIO_BASE}/words/A1_2.mp3`,
    examples: [{ fr: 'Merci pour le cadeau.', cn: '谢谢你的礼物。', audio: `${AUDIO_BASE}/words/A1_2_ex1.mp3` }] 
  },
  { 
    id: 'v-a1-3', level: 'A1', fr: 'Pain', ipa: '/pɛ̃/', cn: '面包', 
    audio: `${AUDIO_BASE}/words/A1_3.mp3`,
    examples: [{ fr: 'Je mange du pain.', cn: '我正在吃面包。', audio: `${AUDIO_BASE}/words/A1_3_ex1.mp3` }] 
  },
  { 
    id: 'v-a1-4', level: 'A1', fr: 'Eau', ipa: '/o/', cn: '水', 
    audio: `${AUDIO_BASE}/words/A1_4.mp3`,
    examples: [{ fr: 'Un verre d’eau, s’il vous plaît.', cn: '请给我一杯水。', audio: `${AUDIO_BASE}/words/A1_4_ex1.mp3` }] 
  },
  { 
    id: 'v-a1-5', level: 'A1', fr: 'Ami', ipa: '/a.mi/', cn: '朋友', 
    audio: `${AUDIO_BASE}/words/A1_5.mp3`,
    examples: [{ fr: 'C’est mon meilleur ami.', cn: '这是我最好的朋友。', audio: `${AUDIO_BASE}/words/A1_5_ex1.mp3` }] 
  },
  // A2 Level
  { 
    id: 'v-a2-1', level: 'A2', fr: 'Voyage', ipa: '/vwa.jaʒ/', cn: '旅行', 
    audio: `${AUDIO_BASE}/words/A2_1.mp3`,
    examples: [{ fr: 'Bon voyage !', cn: '一路顺风！', audio: `${AUDIO_BASE}/words/A2_1_ex1.mp3` }] 
  },
  { 
    id: 'v-a2-2', level: 'A2', fr: 'Cuisiner', ipa: '/kɥi.zi.ne/', cn: '烹饪', 
    audio: `${AUDIO_BASE}/words/A2_2.mp3`,
    examples: [{ fr: 'J’aime cuisiner pour mes amis.', cn: '我喜欢为朋友们下厨。', audio: `${AUDIO_BASE}/words/A2_2_ex1.mp3` }] 
  },
  { 
    id: 'v-a2-3', level: 'A2', fr: 'Travailler', ipa: '/tʁa.va.je/', cn: '工作', 
    audio: `${AUDIO_BASE}/words/A2_3.mp3`,
    examples: [{ fr: 'Il travaille à la banque.', cn: '他在银行工作。', audio: `${AUDIO_BASE}/words/A2_3_ex1.mp3` }] 
  },
  // B1 Level
  { 
    id: 'v-b1-1', level: 'B1', fr: 'Environnement', ipa: '/ɑ̃.vi.ʁɔn.mɑ̃/', cn: '环境', 
    audio: `${AUDIO_BASE}/words/B1_1.mp3`,
    examples: [{ fr: 'Il faut protéger l’environnement.', cn: '我们必须保护环境。', audio: `${AUDIO_BASE}/words/B1_1_ex1.mp3` }] 
  },
  { 
    id: 'v-b1-2', level: 'B1', fr: 'Développement', ipa: '/de.vlɔp.mɑ̃/', cn: '发展', 
    audio: `${AUDIO_BASE}/words/B1_2.mp3`,
    examples: [{ fr: 'Le développement durable est crucial.', cn: '可持续发展至关重要。', audio: `${AUDIO_BASE}/words/B1_2_ex1.mp3` }] 
  },
];

// ==============================================================================
// 2. SCENE EXPRESSIONS (Bound to standardized /audio/scenes/ paths)
// ==============================================================================
export const expressionData: ExpressionItem[] = [
  // Scene: Self Intro
  { 
    id: 'ex-self-1', category: '自我介绍', fr: "Enchanté de faire votre connaissance.", 
    ipa: "/ɑ̃.ʃɑ̃.te də fɛʁ vɔ.tʁə kɔ.nɛ.sɑ̃s/", cn: "很高兴认识您。", 
    audio: `${AUDIO_BASE}/scenes/self_intro_1.mp3` 
  },
  { 
    id: 'ex-self-2', category: '自我介绍', fr: "Je viens de Chine.", 
    ipa: "/ʒə vjɛ̃ də ʃin/", cn: "我来自中国。", 
    audio: `${AUDIO_BASE}/scenes/self_intro_2.mp3` 
  },
  // Scene: Daily Life
  { 
    id: 'ex-daily-1', category: '日常生活', fr: "Quelle heure est-il ?", 
    ipa: "/kɛl œʁ ɛ.t‿il/", cn: "几点了？", 
    audio: `${AUDIO_BASE}/scenes/daily_life_1.mp3` 
  },
  { 
    id: 'ex-daily-2', category: '日常生活', fr: "Où sont les toilettes ?", 
    ipa: "/u sɔ̃ le twa.lɛt/", cn: "洗手间在哪里？", 
    audio: `${AUDIO_BASE}/scenes/daily_life_2.mp3` 
  },
  // Scene: Travel
  { 
    id: 'ex-travel-1', category: '旅行', fr: "Un billet pour Paris, s'il vous plaît.", 
    ipa: "/œ̃ bi.jɛ puʁ pa.ʁi/", cn: "请给我一张去巴黎的车票。", 
    audio: `${AUDIO_BASE}/scenes/travel_1.mp3` 
  },
  // Scene: Restaurant
  { 
    id: 'ex-rest-1', category: '餐厅', fr: "L'addition, s'il vous plaît.", 
    ipa: "/la.di.sjɔ̃ sil vu plɛ/", cn: "请买单。", 
    audio: `${AUDIO_BASE}/scenes/restaurant_1.mp3` 
  },
  // Scene: Transport
  { 
    id: 'ex-trans-1', category: '交通', fr: "Où se trouve la station de métro ?", 
    ipa: "/u sə tʁuv la sta.sjɔ̃ də me.tʁo/", cn: "地铁站在哪里？", 
    audio: `${AUDIO_BASE}/scenes/transport_1.mp3` 
  },
  // Scene: Emergency
  { 
    id: 'ex-emer-1', category: '紧急情况', fr: "Aidez-moi ! C'est une urgence.", 
    ipa: "/ɛ.de mwa sɛ.t‿yn yʁ.ʒɑ̃s/", cn: "救救我！这是紧急情况。", 
    audio: `${AUDIO_BASE}/scenes/emergency_1.mp3` 
  },
];

// ==============================================================================
// 3. GRAMMAR DATA (Locked content, audio paths updated)
// ==============================================================================
export const grammarData = [
  {
    id: 'g-a1-1',
    level: 'A1' as CEFRLevel,
    title: '主称代词 (Les pronoms sujets)',
    description: '法语中最基础的人称代词用法',
    content: '法语有六个人称：\n- **Je** (我)\n- **Tu** (你)\n- **Il/Elle/On** (他/她/我们)\n- **Nous** (我们)\n- **Vous** (您/你们)\n- **Ils/Elles** (他们/她们)',
    tips: 'Tu 用于朋友和家人，Vous 用于礼貌场合或复数。',
    examples: [
      { fr: 'Je suis chinois.', cn: '我是中国人。', audio: `${AUDIO_BASE}/grammar/A1_pronouns_1.mp3` },
      { fr: 'Tu parles français ?', cn: '你会说法语吗？', audio: `${AUDIO_BASE}/grammar/A1_pronouns_2.mp3` }
    ]
  },
  {
    id: 'g-a1-2',
    level: 'A1' as CEFRLevel,
    title: '冠词用法 (Les articles)',
    description: '定冠词与不定冠词的区别',
    content: '法语区分阴阳性：\n- **Un / Une** (不定冠词)\n- **Le / La / Les** (定冠词)',
    tips: '几乎所有名词前都必须有冠词。',
    examples: [
      { fr: 'Le café est chaud.', cn: '咖啡是热的。', audio: `${AUDIO_BASE}/grammar/A1_articles_1.mp3` }
    ]
  }
];

// ==============================================================================
// 4. EXAM DATA
// ==============================================================================
export const examData: ExamQuestion[] = [
  {
    id: 'q-a1-1', level: 'A1', type: 'choice',
    question: 'Comment dit-on "Hello" en français ?',
    options: ['Bonjour', 'Merci', 'Au revoir', 'S\'il vous plaît'],
    correctAnswer: 'Bonjour',
    explanation: '"Bonjour" 是法语中最通用的问候语。'
  },
  {
    id: 'q-a1-2', level: 'A1', type: 'choice',
    question: 'Choisissez la forme correcte : Je ___ français.',
    options: ['suis', 'es', 'est', 'sommes'],
    correctAnswer: 'suis',
    explanation: '动词 être 的第一人称单数变位是 "je suis"。'
  },
  {
    id: 'q-a2-1', level: 'A2', type: 'choice',
    question: 'Hier, je ___ au cinéma.',
    options: ['suis allé', 'vais', 'irai', 'suis allant'],
    correctAnswer: 'suis allé',
    explanation: '"Hier" 表示过去，需要使用复合过去时 (Passé Composé)。'
  }
];
