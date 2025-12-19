
/**
 * Advanced TTS Service for Cross-Platform Compatibility (Android & iOS)
 */

class TTSService {
  private voices: SpeechSynthesisVoice[] = [];
  private selectedVoice: SpeechSynthesisVoice | null = null;
  private isInitialized: boolean = false;
  private queue: string[] = [];
  private currentIdx: number = -1;
  private onEndCallback?: () => void;
  private activeUtterance: SpeechSynthesisUtterance | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.init();
    }
  }

  private init() {
    const loadVoices = () => {
      this.voices = window.speechSynthesis.getVoices();
      // Prioritize French voices, especially Google ones which are stable on Android
      this.selectedVoice = 
        this.voices.find(v => v.lang === 'fr-FR' && (v.name.includes('Google') || v.name.includes('Premium'))) ||
        this.voices.find(v => v.lang === 'fr-FR') ||
        this.voices.find(v => v.lang.startsWith('fr')) ||
        null;
      
      if (this.voices.length > 0) {
        this.isInitialized = true;
      }
    };

    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }

  public async stop() {
    window.speechSynthesis.cancel();
    this.queue = [];
    this.currentIdx = -1;
    this.activeUtterance = null;
  }

  public async speak(text: string, onEnd?: () => void) {
    if (!text) return;
    
    // Always stop and clear before starting new speech
    window.speechSynthesis.cancel();
    this.onEndCallback = onEnd;
    this.currentIdx = -1;
    this.activeUtterance = null;

    // Split text for sequential playback (Android requirement for long strings)
    // Mobile browsers often fail on strings > 200 characters
    this.queue = text.split(/([.!?\n]+)/).reduce((acc: string[], cur, i) => {
      if (i % 2 === 0) {
        if (cur.trim()) acc.push(cur.trim());
      } else {
        if (acc.length > 0) acc[acc.length - 1] += cur;
      }
      return acc;
    }, []);

    if (this.queue.length === 0) return;
    
    // Small delay after cancel() to ensure engine state is reset before starting speak()
    // This is a critical fix for Android Chrome
    setTimeout(() => {
      this.currentIdx = 0;
      this.playNext();
    }, 100);
  }

  private playNext() {
    if (this.currentIdx < 0 || this.currentIdx >= this.queue.length) {
      if (this.onEndCallback) this.onEndCallback();
      this.activeUtterance = null;
      return;
    }

    const textToSpeak = this.queue[this.currentIdx];
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = 'fr-FR';
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    
    if (this.selectedVoice) {
      utterance.voice = this.selectedVoice;
    }

    utterance.onend = () => {
      // Small delay for mobile stability and natural phrasing
      setTimeout(() => {
        // Guard check to ensure we haven't stopped in the meantime
        if (this.currentIdx !== -1) {
          this.currentIdx++;
          this.playNext();
        }
      }, 100);
    };

    utterance.onerror = (e: any) => {
      // 'interrupted' or 'canceled' are common and often non-fatal state errors
      if (e.error !== 'interrupted' && e.error !== 'canceled') {
        console.error('TTS Error:', e.error || e);
      }
      // If it's a genuine error, clean up
      if (e.error !== 'interrupted') {
        this.stop();
      }
    };

    this.activeUtterance = utterance;
    window.speechSynthesis.speak(utterance);
  }
}

export const tts = new TTSService();

export const speakFrench = (text: string) => tts.speak(text);
