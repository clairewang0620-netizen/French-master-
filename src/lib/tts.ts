/**
 * Unified TTS Service - Optimized for Android & iOS Compatibility
 * Replaces SpeechSynthesis with HTML5 Audio for maximum reliability.
 * Handles character limits by internal queuing while presenting a single-stream UI.
 */

type PlaybackStatus = 'idle' | 'playing' | 'paused';

class TTSService {
  private audio: HTMLAudioElement;
  private queue: string[] = [];
  private currentIdx: number = -1;
  private status: PlaybackStatus = 'idle';
  private isUnlocked: boolean = false;
  private onStatusChange?: (status: PlaybackStatus) => void;
  private onEndCallback?: () => void;

  constructor() {
    this.audio = new Audio();
    this.setupListeners();
  }

  private setupListeners() {
    this.audio.onended = () => {
      if (this.status === 'playing') {
        this.currentIdx++;
        this.playNext();
      }
    };

    this.audio.onerror = () => {
      console.error("Audio playback error");
      this.stop();
    };
  }

  /**
   * CRITICAL: Unlock audio context for Android/iOS
   * Must be called inside a user interaction handler.
   */
  public unlock() {
    if (this.isUnlocked) return;
    
    // Play a tiny silent buffer to unlock the browser's audio state
    this.audio.src = "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAAAA== ";
    this.audio.play()
      .then(() => {
        this.audio.pause();
        this.isUnlocked = true;
        console.log("Audio unlocked successfully");
      })
      .catch(e => console.warn("Audio unlock pending gesture", e));
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
    this.audio.pause();
    this.audio.src = "";
    this.queue = [];
    this.currentIdx = -1;
    this.setStatus('idle');
  }

  public pause() {
    if (this.status === 'playing') {
      this.audio.pause();
      this.setStatus('paused');
    }
  }

  public resume() {
    if (this.status === 'paused' && this.currentIdx !== -1) {
      this.setStatus('playing');
      // If we were in the middle of a segment, just play()
      if (this.audio.src) {
        this.audio.play().catch(() => this.stop());
      } else {
        this.playNext();
      }
    }
  }

  /**
   * Splits text into safe chunks for the TTS endpoint (approx 200 chars)
   */
  private segmentText(text: string): string[] {
    // Split by punctuation to keep natural flow, then sub-split if too long
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

  private getTTSUrl(text: string): string {
    // Use the reliable Google TTS endpoint for high-quality French pronunciation
    return `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=fr&client=tw-ob`;
  }

  public async speak(text: string, onEnd?: () => void) {
    if (!text) return;
    
    this.unlock();
    this.stop();
    this.onEndCallback = onEnd;
    
    this.queue = this.segmentText(text);
    if (this.queue.length === 0) return;
    
    this.currentIdx = 0;
    this.setStatus('playing');
    this.playNext();
  }

  private playNext() {
    if (this.status !== 'playing') return;

    if (this.currentIdx >= this.queue.length) {
      this.stop();
      if (this.onEndCallback) this.onEndCallback();
      return;
    }

    const currentText = this.queue[this.currentIdx];
    this.audio.src = this.getTTSUrl(currentText);
    this.audio.play().catch((e) => {
      console.error("Playback failed, likely missing gesture", e);
      this.stop();
    });
  }
}

export const tts = new TTSService();
export const speakFrench = (text: string) => tts.speak(text);
