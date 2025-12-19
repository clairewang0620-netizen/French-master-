/**
 * Unified TTS Service - Premium Hotfix for iOS & Android
 * Handles both short phrases (Vocab/Expressions) and long articles (Reading)
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
    this.audio.onended = () => {
      if (this.isAndroid && this.status === 'playing') {
        this.currentIdx++;
        if (this.currentIdx < this.queue.length) {
          // 0.5s interval between paragraphs for natural flow
          setTimeout(() => this.playNextAndroid(), 500);
        } else {
          this.stop();
          if (this.onEndCallback) this.onEndCallback();
        }
      }
    };

    this.audio.onerror = (e) => {
      console.error("Audio playback error", e);
      this.stop();
    };
  }

  /**
   * CRITICAL: Unlock audio for mobile browsers. Must be called inside user gesture.
   */
  public unlock() {
    if (this.isUnlocked) return;
    (window as any).audioUnlocked = true;
    
    if (this.isAndroid) {
      this.audio.src = "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAAAA==";
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
    return text.split(/([.!?\n]+)/).reduce((acc: string[], cur, i) => {
      if (i % 2 === 0) {
        if (cur.trim()) acc.push(cur.trim());
      } else {
        if (acc.length > 0) acc[acc.length - 1] += cur;
      }
      return acc;
    }, []).filter(s => s.length > 0);
  }

  /**
   * Main entry point for playing French audio
   */
  public async playAudio({ text, audioUrl }: { text: string; audioUrl?: string }) {
    if (!text) return;
    this.unlock();
    this.stop();

    if (this.isIOS) {
      // iOS specific: Web Speech API
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'fr-FR';
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      utterance.onend = () => this.setStatus('idle');
      this.setStatus('playing');
      window.speechSynthesis.speak(utterance);
    } else if (this.isAndroid) {
      // Android specific: HTML5 Audio
      // If a specific URL isn't provided, use dynamic Google TTS as fallback
      const finalUrl = audioUrl || `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=fr&client=tw-ob`;
      
      this.queue = this.segmentText(text);
      this.currentIdx = 0;
      this.setStatus('playing');
      this.playNextAndroid(finalUrl);
    } else {
      // Desktop Fallback
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'fr-FR';
      utterance.rate = 0.9;
      utterance.onend = () => this.setStatus('idle');
      this.setStatus('playing');
      window.speechSynthesis.speak(utterance);
    }
  }

  private playNextAndroid(manualUrl?: string) {
    if (this.status !== 'playing' || !this.isAndroid) return;
    
    // If we have a queue of text, we generate URLs for segments
    // If it's a short text with a specific audioUrl, we play that once
    if (this.queue.length > 1) {
      const currentText = this.queue[this.currentIdx];
      if (!currentText) { this.stop(); return; }
      this.audio.src = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(currentText)}&tl=fr&client=tw-ob`;
    } else {
      this.audio.src = manualUrl || `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(this.queue[0] || '')}&tl=fr&client=tw-ob`;
      // After one play, stop if not queueing
      this.audio.onended = () => {
        if (this.queue.length <= 1) this.stop();
        else this.setupListeners(); // Restore multi-segment listener
      };
    }
    
    this.audio.play().catch(() => this.stop());
  }
}

export const tts = new TTSService();
export const playAudio = (params: { text: string; audioUrl?: string }) => tts.playAudio(params);
