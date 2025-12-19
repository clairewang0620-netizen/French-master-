/**
 * Unified TTS Service - Critical Hotfix for iOS & Android
 * iOS: Web Speech API (speechSynthesis)
 * Android: HTML5 Audio (Google TTS MP3) with Managed Queuing
 */

type PlaybackStatus = 'idle' | 'playing' | 'paused';

class TTSService {
  private audio: HTMLAudioElement;
  private queue: string[] = [];
  private currentIdx: number = -1;
  private status: PlaybackStatus = 'idle';
  private isUnlocked: boolean = false;
  private isAndroid: boolean = false;
  private onStatusChange?: (status: PlaybackStatus) => void;
  private onEndCallback?: () => void;

  constructor() {
    this.audio = new Audio();
    if (typeof window !== 'undefined') {
      this.isAndroid = /Android/i.test(navigator.userAgent);
      this.setupListeners();
    }
  }

  private setupListeners() {
    this.audio.onended = () => {
      if (this.isAndroid && this.status === 'playing') {
        this.currentIdx++;
        if (this.currentIdx < this.queue.length) {
          setTimeout(() => this.playNextAndroid(), 500); // 0.5s interval between paragraphs
        } else {
          this.stop();
          if (this.onEndCallback) this.onEndCallback();
        }
      }
    };

    this.audio.onerror = () => {
      console.error("Android Audio Error");
      this.stop();
    };
  }

  /**
   * Unlock audio context for Android. Call inside user gesture.
   */
  public unlock() {
    if (this.isUnlocked) return;
    if (this.isAndroid) {
      this.audio.src = "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAAAA== ";
      this.audio.play().then(() => {
        this.audio.pause();
        this.isUnlocked = true;
        console.log("Audio Unlocked");
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
    // Split for Google TTS char limit (approx 200)
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
      // iOS / Desktop Native TTS
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'fr-FR';
      utterance.rate = 1.0;
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
