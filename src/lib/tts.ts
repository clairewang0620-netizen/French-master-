
/**
 * TTS Service (Text-to-Speech)
 * Handles browser differences, voice loading, and iOS quirks.
 */

let voices: SpeechSynthesisVoice[] = [];
let frenchVoice: SpeechSynthesisVoice | null = null;

const loadVoices = (): Promise<void> => {
  return new Promise((resolve) => {
    const existing = window.speechSynthesis.getVoices();
    if (existing.length > 0) {
      voices = existing;
      selectFrenchVoice();
      resolve();
      return;
    }

    window.speechSynthesis.onvoiceschanged = () => {
      voices = window.speechSynthesis.getVoices();
      selectFrenchVoice();
      resolve();
    };
  });
};

const selectFrenchVoice = () => {
  frenchVoice = 
    voices.find(v => v.name === 'Google français' && v.lang === 'fr-FR') ||
    voices.find(v => v.name === 'Thomas' && v.lang.startsWith('fr')) ||
    voices.find(v => v.name === 'Amelie' && v.lang.startsWith('fr')) ||
    voices.find(v => v.lang === 'fr-FR') ||
    voices.find(v => v.lang.startsWith('fr')) ||
    null;
};

export const speakFrench = async (text: string) => {
  if (!('speechSynthesis' in window)) return;

  if (!frenchVoice) {
    await loadVoices();
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  
  if (frenchVoice) {
    utterance.voice = frenchVoice;
  }
  
  utterance.lang = 'fr-FR'; 
  utterance.rate = 0.85; 
  utterance.pitch = 1.0; // 校准为 1.0
  utterance.volume = 1.0;
  
  window.speechSynthesis.speak(utterance);
};

if (typeof window !== 'undefined') {
  loadVoices();
}
