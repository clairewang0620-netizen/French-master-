
export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1';

export interface VocabularyItem {
  id: string;
  fr: string;
  cn: string;
  ipa: string;
  level: CEFRLevel;
  examples: {
    fr: string;
    cn: string;
    ipa?: string; // Standard IPA for the example sentence
  }[];
}

export interface ExpressionItem {
  id: string;
  category: string;
  fr: string;
  cn: string;
  ipa: string;
}

export interface GrammarItem {
  id: string;
  level: CEFRLevel;
  title: string;
  description: string;
  content: string;
  examples: { fr: string; cn: string; ipa?: string }[];
  tips?: string;
}

export interface ReadingItem {
  id: string;
  title: string;
  level: CEFRLevel;
  content_fr: string; // Full French text
  content_zh: string; // Full Chinese translation
  keywords: { fr: string; ipa: string; zh: string }[];
  audio: boolean;
}

export interface ExamQuestion {
  id: string;
  level: CEFRLevel;
  type: 'choice' | 'boolean' | 'fill';
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
}

export interface UserProgress {
  favorites: string[];
  dictationErrors: string[];
  examErrors: string[];
  completedReadings: string[];
  examScores: Record<string, number>;
}
