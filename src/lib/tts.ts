/**
 * Unified Audio Service - Specialized for French Learning
 * Features: iOS Speech API fallback, Android HTML5 Audio, Pause/Resume Support
 */

type PlaybackStatus = 'idle' | 'playing' | 'paused';

class TTSService {
  private audio: HTMLAudioElement;
  private status: PlaybackStatus = 'idle';
  private currentText: string = '';
  private currentUrl: string = '';
  private onStatusChange?: (status: PlaybackStatus) => void;

  constructor() {
    this.audio = new Audio();
    if (typeof window !== 'undefined') {
      this.setupListeners();
    }
  }

  private setupListeners() {
    this.audio.onplay = () => {
      this.status = 'playing';
      this.notify();
    };
    this.audio.onpause = () => {
      this.status = 'paused';
      this.notify();
    };
    this.audio.onended = () => {
      this.status = 'idle';
      this.notify();
    };
    this.audio.onerror = () => {
      console.error("Audio playback error");
      this.status = 'idle';
      this.notify();
    };
  }

  private notify() {
    if (this.onStatusChange) this.onStatusChange(this.status);
  }

  public registerStatusListener(cb: (s: PlaybackStatus) => void) {
    this.onStatusChange = cb;
    // Immediate initial call
    cb(this.status);
  }

  public getStatus() { return this.status; }

  /**
   * core playAudio function
   * Handles toggle (play/pause/resume) automatically if same source is provided
   */
  public playAudio({ text, audioUrl }: { text: string; audioUrl: string }) {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAndroid = /Android/.test(navigator.userAgent);

    // Toggle logic for long audio (Readings)
    if (this.currentUrl === audioUrl && this.status !== 'idle') {
      if (this.status === 'playing') {
        this.pause();
      } else {
        this.resume();
      }
      return;
    }

    // New Audio Source
    this.stop();
    this.currentText = text;
    this.currentUrl = audioUrl;

    if (isIOS) {
      // iOS prefers Web Speech API for low latency unless we use local files with specific unlocking
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'fr-FR';
      utterance.rate = 0.9;
      utterance.onstart = () => { this.status = 'playing'; this.notify(); };
      utterance.onend = () => { this.status = 'idle'; this.notify(); };
      utterance.onerror = () => { this.status = 'idle'; this.notify(); };
      speechSynthesis.speak(utterance);
    } else {
      // Android / Desktop - HTML5 Audio for high quality MP3
      if (!(window as any).audioUnlocked) {
        // Dummy play to unlock audio context on first user interaction
        const unlockAudio = new Audio();
        unlockAudio.play().catch(() => {});
        (window as any).audioUnlocked = true;
      }

      this.audio.src = audioUrl;
      this.audio.load();
      this.audio.play()
        .then(() => {
          this.status = 'playing';
          this.notify();
        })
        .catch(err => {
          console.warn('MP3 playback failed, falling back to Web Speech:', err);
          // Fallback if MP3 is missing or blocked
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.lang = 'fr-FR';
          utterance.onstart = () => { this.status = 'playing'; this.notify(); };
          utterance.onend = () => { this.status = 'idle'; this.notify(); };
          speechSynthesis.speak(utterance);
        });
    }
  }

  public pause() {
    if (this.status === 'playing') {
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      if (isIOS) {
        speechSynthesis.pause();
      } else {
        this.audio.pause();
      }
      this.status = 'paused';
      this.notify();
    }
  }

  public resume() {
    if (this.status === 'paused') {
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      if (isIOS) {
        speechSynthesis.resume();
      } else {
        this.audio.play();
      }
      this.status = 'playing';
      this.notify();
    }
  }

  public stop() {
    speechSynthesis.cancel();
    this.audio.pause();
    this.audio.currentTime = 0;
    this.audio.src = '';
    this.status = 'idle';
    this.notify();
  }
}

export const tts = new TTSService();
export const playAudio = (params: { text: string; audioUrl: string }) => tts.playAudio(params);
