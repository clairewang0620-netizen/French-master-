
import { VocabularyItem, ExpressionItem, CEFRLevel } from '../types';

const CDN_BASE = "https://your-domain.com/audio";

// ==============================================================================
// 1. 核心词汇模块 (A1 示例片段)
// ==============================================================================
export const vocabularyData: VocabularyItem[] = [
  { 
    id: 'v-a1-1', 
    level: 'A1', 
    fr: 'Bonjour', 
    ipa: '/bɔ̃.ʒuʁ/', 
    cn: '你好', 
    audio: `${CDN_BASE}/A1_01_bonjour.mp3`,
    examples: [
      { fr: 'Bonjour, comment allez-vous ?', cn: '你好，您身体好吗？', audio: `${CDN_BASE}/A1_01_bonjour_1.mp3` },
      { fr: 'Je dis bonjour à mes amis.', cn: '我向我的朋友们打招呼。', audio: `${CDN_BASE}/A1_01_bonjour_2.mp3` }
    ] 
  },
  { 
    id: 'v-a1-2', 
    level: 'A1', 
    fr: 'Merci', 
    ipa: '/mɛʁ.si/', 
    cn: '谢谢', 
    audio: `${CDN_BASE}/A1_02_merci.mp3`,
    examples: [
      { fr: 'Merci beaucoup pour votre aide.', cn: '非常感谢您的帮助。', audio: `${CDN_BASE}/A1_02_merci_1.mp3` }
    ] 
  },
  // 更多 A1-C1 单词以此类推... (遵循 {level}_{index}_{word}.mp3)
];

// ==============================================================================
// 2. 场景对话模块 (自我介绍 50 句片段)
// ==============================================================================
export const expressionData: ExpressionItem[] = [
  { 
    id: 'ex-intro-1', 
    category: '自我介绍', 
    fr: "Je m'appelle Claire.", 
    ipa: "/ʒə ma.pɛl klɛʁ/", 
    cn: "我叫 Claire。", 
    audio: `${CDN_BASE}/scene_intro_01.mp3` 
  },
  { 
    id: 'ex-intro-2', 
    category: '自我介绍', 
    fr: "Je suis étudiant en France.", 
    ipa: "/ʒə sɥi e.ty.djɑ̃ ɑ̃ fʁɑ̃s/", 
    cn: "我是在法国的留学生。", 
    audio: `${CDN_BASE}/scene_intro_02.mp3` 
  },
  // 更多场景句子... (遵循 scene_{sceneName}_{index}.mp3)
];

export const grammarData = []; // 锁定内容
export const examData = [];    // 锁定内容
