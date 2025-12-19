/**
 * Unified TTS Service - Premium Hotfix for iOS & Android
 * iOS: Web Speech API (speechSynthesis) - Higher quality, native integration.
 * Android: HTML5 Audio (Google TTS MP3) - Maximum compatibility for Android browsers/WebViews.
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
        this.playNext();
      }
    };

    this.audio.onerror = () => {
      console.error("Audio playback error on Android mode");
      this.stop();
    };

    // For iOS, speechSynthesis handles its own events, but we sync them here
    if (!this.isAndroid && 'speechSynthesis' in window) {
      // Periodic check to sync state if native events fail
      setInterval(() => {
        if (this.status === 'playing' && !window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
          this.setStatus('idle');
        }
      }, 500);
    }
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
      }).catch(() => {});
    } else {
      // iOS speechSynthesis doesn't need "silent audio" unlock but needs gesture
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
          this.playNext();
        }
      } else {
        window.speechSynthesis.resume();
        this.setStatus('playing');
      }
    }
  }

  private segmentText(text: string): string[] {
    // Split for Google TTS 200 char limit
    const sentences = text.match(/[^.!?\n]+[.!?\n]*/g) || [text];
    const chunks: string[] = [];
    let currentChunk = "";

    for (const sentence of sentences) {
      if ((currentChunk + sentence).length < 180) {
        currentChunk += sentence;
      } else {
        if (currentChunk) chunks.push(currentChunk.trim());
        currentChunk = sentence;
      }
    }
    if (currentChunk) chunks.push(currentChunk.trim());
    return chunks;
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
      this.playNext();
    } else {
      // iOS Native TTS
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

  private playNext() {
    if (this.status !== 'playing' || !this.isAndroid) return;

    if (this.currentIdx >= this.queue.length) {
      this.stop();
      if (this.onEndCallback) this.onEndCallback();
      return;
    }

    const currentText = this.queue[this.currentIdx];
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(currentText)}&tl=fr&client=tw-ob`;
    this.audio.src = url;
    this.audio.play().catch(() => this.stop());
  }
}

export const tts = new TTSService();
export const speakFrench = (text: string) => tts.speak(text);
