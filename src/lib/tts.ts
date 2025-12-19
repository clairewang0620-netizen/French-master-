/**
 * Standardized French Pronunciation Service
 * Exclusively uses Web Speech API for zero-dependency high-compatibility audio.
 */

type PlaybackStatus = 'idle' | 'playing' | 'paused';

class TTSService {
  private status: PlaybackStatus = 'idle';
  private onStatusChange?: (status: PlaybackStatus) => void;
  private currentUtterance: SpeechSynthesisUtterance | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      // Clear any potential hanging states on initialization
      window.speechSynthesis.cancel();
    }
  }

  public registerStatusListener(cb: (s: PlaybackStatus) => void) {
    this.onStatusChange = cb;
    cb(this.status);
  }

  public getStatus() {
    return this.status;
  }

  /**
   * Main French Speech Function
   */
  public speakFrench(text: string) {
    if (!('speechSynthesis' in window)) {
      console.warn('SpeechSynthesis is not supported in this browser.');
      return;
    }

    if (!text || text.trim() === '') {
      return;
    }

    // Cancel any ongoing speech before starting a new one
    // This triggers an 'error' event with code 'interrupted' or 'canceled' on the previous utterance
    window.speechSynthesis.cancel();

    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'fr-FR';
    utter.rate = 0.9;  // Slightly slower for better comprehension
    utter.pitch = 1;
    utter.volume = 1;

    utter.onstart = () => {
      this.status = 'playing';
      this.notify();
    };

    utter.onend = () => {
      this.status = 'idle';
      this.notify();
      this.currentUtterance = null;
    };

    utter.onerror = (event: SpeechSynthesisErrorEvent) => {
      // 'interrupted' and 'canceled' are common when the user triggers a new sound or navigates away.
      // We only log critical errors to the console.
      if (event.error !== 'interrupted' && event.error !== 'canceled') {
        console.error('SpeechSynthesis Critical Error:', event.error, event);
      }
      this.status = 'idle';
      this.notify();
      this.currentUtterance = null;
    };

    this.currentUtterance = utter;
    
    // Some browsers (like Chrome) need a small delay after cancel() to reliably start the next utterance
    setTimeout(() => {
      window.speechSynthesis.speak(utter);
    }, 10);
  }

  public stop() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      this.status = 'idle';
      this.notify();
      this.currentUtterance = null;
    }
  }

  private notify() {
    if (this.onStatusChange) {
      this.onStatusChange(this.status);
    }
  }
}

export const tts = new TTSService();
export const speakFrench = (text: string) => tts.speakFrench(text);
