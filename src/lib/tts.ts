/**
 * TTS Service (Text-to-Speech)
 * Handles browser differences, voice loading, and iOS quirks.
 */

let voices: SpeechSynthesisVoice[] = [];
let frenchVoice: SpeechSynthesisVoice | null = null;

const loadVoices = (): Promise<void> => {
  return new Promise((resolve) => {
    // If voices are already loaded
    const existing = window.speechSynthesis.getVoices();
    if (existing.length > 0) {
      voices = existing;
      selectFrenchVoice();
      resolve();
      return;
    }

    // Chrome/Android loads asynchronously
    window.speechSynthesis.onvoiceschanged = () => {
      voices = window.speechSynthesis.getVoices();
      selectFrenchVoice();
      resolve();
    };
  });
};

const selectFrenchVoice = () => {
  // Priority: 
  // 1. Google Français (High quality on Android/Chrome)
  // 2. Thomas (iOS High quality)
  // 3. Amelie (Mac High quality)
  // 4. Any strict fr-FR
  frenchVoice = 
    voices.find(v => v.name === 'Google français' && v.lang === 'fr-FR') ||
    voices.find(v => v.name === 'Thomas' && v.lang.startsWith('fr')) ||
    voices.find(v => v.name === 'Amelie' && v.lang.startsWith('fr')) ||
    voices.find(v => v.lang === 'fr-FR') ||
    voices.find(v => v.lang.startsWith('fr')) ||
    null;
    
  if (!frenchVoice) {
    console.warn("Lumière French: No specific French voice found. System will try default fallback.");
  }
};

export const speakFrench = async (text: string) => {
  if (!('speechSynthesis' in window)) {
    console.error("Browser does not support Web Speech API");
    return;
  }

  // Ensure voices are loaded (crucial for first run on some browsers)
  if (!frenchVoice) {
    await loadVoices();
  }

  // Cancel any ongoing speech to prevent queue pile-up
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  
  if (frenchVoice) {
    utterance.voice = frenchVoice;
  }
  
  // Specific settings for gentle, educational playback as requested
  utterance.lang = 'fr-FR'; 
  utterance.rate = 0.85;  // Slower for better learning
  utterance.pitch = 1.05; // Gentle tone (Adjusted to 1.05 per user request)
  utterance.volume = 1.0;
  
  // iOS/Safari fix: Ensure audio context is unlocked by user interaction
  window.speechSynthesis.speak(utterance);
};

// Initialize on load
if (typeof window !== 'undefined') {
  loadVoices();
}