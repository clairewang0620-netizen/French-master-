/**
 * Advanced TTS Service for Cross-Platform Compatibility (Android & iOS)
 * Android: Uses HTML5 Audio with remote MP3 TTS endpoint.
 * iOS/Desktop: Uses Web Speech API.
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
  
  // Android Specific
  private audioInstance: HTMLAudioElement | null = null;
  private isAndroid: boolean = false;
  private isUnlocked: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.isAndroid = /Android/i.test(navigator.userAgent);
      if (this.isAndroid) {
        this.audioInstance = new Audio();
      } else if ('speechSynthesis' in window) {
        this.initWebSpeech();
      }
    }
  }

  private initWebSpeech() {
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

  /**
   * Unlock audio context on first user interaction for Android
   */
  public unlock() {
    if (this.isAndroid && this.audioInstance && !this.isUnlocked) {
      // Play and immediately pause to unlock the audio context via user gesture
      this.audioInstance.play().then(() => {
        this.audioInstance?.pause();
      }).catch(() => {});
      this.isUnlocked = true;
    }
  }

  public stop() {
    if (this.isAndroid && this.audioInstance) {
      this.audioInstance.pause();
      this.audioInstance.src = '';
    } else {
      window.speechSynthesis.cancel();
    }
    this.queue = [];
    this.currentIdx = -1;
    this.setStatus('idle');
  }

  public pause() {
    if (this.status === 'playing') {
      if (this.isAndroid && this.audioInstance) {
        this.audioInstance.pause();
      } else {
        window.speechSynthesis.cancel(); 
      }
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
    
    this.unlock(); 
    this.stop();
    this.onEndCallback = onEnd;
    
    // Split text into manageable segments for natural flow and API limits
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
    setTimeout(() => this.playNext(), 50);
  }

  private playNext() {
    if (this.status !== 'playing') return;

    if (this.currentIdx >= this.queue.length) {
      this.stop();
      if (this.onEndCallback) this.onEndCallback();
      return;
    }

    const currentText = this.queue[this.currentIdx];

    if (this.isAndroid && this.audioInstance) {
      // Secure and reliable TTS endpoint for Android
      const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(currentText)}&tl=fr&client=tw-ob`;
      this.audioInstance.src = url;
      this.audioInstance.onended = () => {
        if (this.status === 'playing') {
          this.currentIdx++;
          setTimeout(() => this.playNext(), 60); // Natural breathing pause
        }
      };
      this.audioInstance.onerror = () => this.stop();
      this.audioInstance.play().catch(() => this.stop());
    } else {
      // Web Speech API with optimized parameters
      const utterance = new SpeechSynthesisUtterance(currentText);
      utterance.lang = 'fr-FR';
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      if (this.selectedVoice) utterance.voice = this.selectedVoice;

      utterance.onend = () => {
        if (this.status === 'playing') {
          this.currentIdx++;
          setTimeout(() => this.playNext(), 60);
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
}

export const tts = new TTSService();
export const speakFrench = (text: string) => tts.speak(text);