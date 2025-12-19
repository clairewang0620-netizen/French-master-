/**
 * Advanced TTS Service for Cross-Platform Compatibility (Android & iOS)
 * Optimized for long-text playback with Pause/Resume and natural pacing
 */

type PlaybackStatus = 'idle' | 'playing' | 'paused';

class TTSService {
  private voices: SpeechSynthesisVoice[] = [];
  private selectedVoice: SpeechSynthesisVoice | null = null;
  private queue: string[] = [];
  private currentIdx: number = -1;
  private status: PlaybackStatus = 'idle';
  private onEndCallback?: () => void;
  private onStatusChange?: (status: PlaybackStatus) => void;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.init();
    }
  }

  private init() {
    const loadVoices = () => {
      this.voices = window.speechSynthesis.getVoices();
      this.selectedVoice = 
        this.voices.find(v => v.lang === 'fr-FR' && (v.name.includes('Google') || v.name.includes('Premium'))) ||
        this.voices.find(v => v.lang === 'fr-FR') ||
        this.voices.find(v => v.lang.startsWith('fr')) ||
        null;
    };

    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }

  private setStatus(s: PlaybackStatus) {
    this.status = s;
    if (this.onStatusChange) this.onStatusChange(s);
  }

  public getStatus() {
    return this.status;
  }

  public registerStatusListener(cb: (status: PlaybackStatus) => void) {
    this.onStatusChange = cb;
  }

  public stop() {
    window.speechSynthesis.cancel();
    this.queue = [];
    this.currentIdx = -1;
    this.setStatus('idle');
  }

  public pause() {
    if (this.status === 'playing') {
      window.speechSynthesis.cancel(); 
      this.setStatus('paused');
    }
  }

  public resume() {
    if (this.status === 'paused' && this.currentIdx !== -1) {
      this.setStatus('playing');
      this.playNext();
    }
  }

  public async speak(text: string, onEnd?: () => void) {
    if (!text) return;
    
    window.speechSynthesis.cancel();
    this.onEndCallback = onEnd;
    
    // Split text into manageable segments for mobile stability and natural phrasing
    this.queue = text.split(/([.!?\n]+)/).reduce((acc: string[], cur, i) => {
      if (i % 2 === 0) {
        if (cur.trim()) acc.push(cur.trim());
      } else {
        if (acc.length > 0) acc[acc.length - 1] += cur;
      }
      return acc;
    }, []);

    if (this.queue.length === 0) return;
    
    this.currentIdx = 0;
    this.setStatus('playing');

    // Small buffer for engine reset
    setTimeout(() => this.playNext(), 50);
  }

  private playNext() {
    if (this.status !== 'playing') return;

    if (this.currentIdx >= this.queue.length) {
      this.stop();
      if (this.onEndCallback) this.onEndCallback();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(this.queue[this.currentIdx]);
    utterance.lang = 'fr-FR';
    utterance.rate = 1.0; // Optimized for natural French flow
    utterance.pitch = 1.0;
    if (this.selectedVoice) utterance.voice = this.selectedVoice;

    utterance.onend = () => {
      if (this.status === 'playing') {
        this.currentIdx++;
        // Reduced delay (50ms) for continuous reading experience
        setTimeout(() => this.playNext(), 50);
      }
    };

    utterance.onerror = (e: any) => {
      if (e.error !== 'interrupted' && e.error !== 'canceled') {
        this.stop();
      }
    };

    window.speechSynthesis.speak(utterance);
  }
}

export const tts = new TTSService();
export const speakFrench = (text: string) => tts.speak(text);
