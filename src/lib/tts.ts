/**
 * Unified TTS Service - Premium Hotfix for iOS & Android
 * iOS: Web Speech API (speechSynthesis) - Natural & Reliable
 * Android: HTML5 Audio (Google TTS) - Guaranteed Compatibility
 */

type PlaybackStatus = 'idle' | 'playing' | 'paused';

class TTSService {
  private audio: HTMLAudioElement;
  private queue: string[] = [];
  private currentIdx: number = -1;
  private status: PlaybackStatus = 'idle';
  private isUnlocked: boolean = false;
  private isAndroid: boolean = false;
  private isIOS: boolean = false;
  private onStatusChange?: (status: PlaybackStatus) => void;
  private onEndCallback?: () => void;

  constructor() {
    this.audio = new Audio();
    if (typeof window !== 'undefined') {
      const ua = navigator.userAgent;
      this.isAndroid = /Android/i.test(ua);
      this.isIOS = /iPad|iPhone|iPod/.test(ua);
      this.setupListeners();
    }
  }

  private setupListeners() {
    // For Android (HTML5 Audio)
    this.audio.onended = () => {
      if (this.isAndroid && this.status === 'playing') {
        this.currentIdx++;
        if (this.currentIdx < this.queue.length) {
          // 0.5s interval between paragraphs as requested
          setTimeout(() => this.playNextAndroid(), 500);
        } else {
          this.stop();
          if (this.onEndCallback) this.onEndCallback();
        }
      }
    };

    this.audio.onerror = () => {
      console.error("Audio playback error");
      this.stop();
    };
  }

  /**
   * CRITICAL: Unlock audio on Android. Must be called inside user gesture.
   */
  public unlock() {
    if (this.isUnlocked) return;
    
    // Global flag for general use
    (window as any).audioUnlocked = true;
    
    if (this.isAndroid) {
      // Play 0.1s silent audio to unlock the media stack
      this.audio.src = "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAAAA== ";
      this.audio.play().then(() => {
        this.audio.pause();
        this.isUnlocked = true;
      }).catch(() => {});
    } else {
      this.isUnlocked = true;
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
    if (this.isAndroid) {
      this.audio.pause();
      this.audio.src = "";
    } else {
      window.speechSynthesis.cancel();
    }
    this.queue = [];
    this.currentIdx = -1;
    this.setStatus('idle');
  }

  public pause() {
    if (this.status === 'playing') {
      if (this.isAndroid) {
        this.audio.pause();
      } else {
        window.speechSynthesis.pause();
      }
      this.setStatus('paused');
    }
  }

  public resume() {
    if (this.status === 'paused') {
      if (this.isAndroid) {
        if (this.audio.src) {
          this.audio.play().catch(() => this.stop());
          this.setStatus('playing');
        } else {
          this.playNextAndroid();
        }
      } else {
        window.speechSynthesis.resume();
        this.setStatus('playing');
      }
    }
  }

  private segmentText(text: string): string[] {
    // Split for Google TTS character limits (approx 200 chars)
    // Helps creating natural gaps in articles
    return text.split(/([.!?\n]+)/).reduce((acc: string[], cur, i) => {
      if (i % 2 === 0) {
        if (cur.trim()) acc.push(cur.trim());
      } else {
        if (acc.length > 0) acc[acc.length - 1] += cur;
      }
      return acc;
    }, []).filter(s => s.length > 0);
  }

  public async speak(text: string, onEnd?: () => void) {
    if (!text) return;
    this.unlock();
    this.stop();
    this.onEndCallback = onEnd;

    if (this.isAndroid) {
      this.queue = this.segmentText(text);
      this.currentIdx = 0;
      this.setStatus('playing');
      this.playNextAndroid();
    } else {
      // iOS / Desktop (speechSynthesis)
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'fr-FR';
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      
      utterance.onend = () => {
        this.setStatus('idle');
        if (this.onEndCallback) this.onEndCallback();
      };
      utterance.onerror = () => this.stop();
      
      this.setStatus('playing');
      window.speechSynthesis.speak(utterance);
    }
  }

  private playNextAndroid() {
    if (this.status !== 'playing' || !this.isAndroid) return;
    const currentText = this.queue[this.currentIdx];
    if (!currentText) { this.stop(); return; }
    
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(currentText)}&tl=fr&client=tw-ob`;
    this.audio.src = url;
    this.audio.play().catch(() => this.stop());
  }
}

export const tts = new TTSService();
export const speakFrench = (text: string) => tts.speak(text);
