
export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1';

export interface VocabularyItem {
  id: string;
  fr: string;
  cn: string;
  ipa: string;
  level: CEFRLevel;
  audio: string; // 单词发音路径: {level}_{index}_{word}.mp3
  examples: {
    fr: string;
    cn: string;
    ipa?: string;
    audio: string; // 例句发音路径: {level}_{index}_{word}_{sIdx}.mp3
  }[];
}

export interface ExpressionItem {
  id: string;
  category: string;
  fr: string;
  cn: string;
  ipa: string;
  audio: string; // 场景发音路径: scene_{sceneName}_{index}.mp3
}

export interface ReadingItem {
  id: string;
  title: string;
  level: CEFRLevel;
  content_fr: string;
  content_zh: string;
  keywords: { fr: string; ipa: string; zh: string }[];
  audioUrl: string; // 文章全文发音路径: reading_{index}.mp3
}

export interface UserProgress {
  favorites: string[];
  dictationErrors: string[];
  examErrors: string[];
  completedReadings: string[];
  examScores: Record<string, number>;
}
