
/**
 * 统一发音服务 - 深度适配移动端浏览器
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
    this.audio.onended = () => {
      this.status = 'idle';
      this.notify();
    };
  }

  private notify() {
    if (this.onStatusChange) this.onStatusChange(this.status);
  }

  public registerStatusListener(cb: (s: PlaybackStatus) => void) {
    this.onStatusChange = cb;
  }

  public getStatus() { return this.status; }

  /**
   * 核心 playAudio 函数
   * @param text 法语原文 (用于 iOS Web Speech)
   * @param audioUrl 音频文件地址 (用于 Android/Desktop MP3)
   */
  public playAudio({ text, audioUrl }: { text: string; audioUrl: string }) {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAndroid = /Android/.test(navigator.userAgent);

    // 如果是同一个音频在播放，则执行 播放/暂停 切换逻辑
    if (this.currentUrl === audioUrl && this.status !== 'idle') {
      if (this.status === 'playing') {
        this.pause();
      } else {
        this.resume();
      }
      return;
    }

    this.stop();
    this.currentText = text;
    this.currentUrl = audioUrl;

    if (isIOS) {
      // iOS 使用 Web Speech API
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'fr-FR';
      utterance.rate = 0.9; // 温柔语速
      utterance.pitch = 1.0;
      utterance.onstart = () => { this.status = 'playing'; this.notify(); };
      utterance.onend = () => { this.status = 'idle'; this.notify(); };
      speechSynthesis.speak(utterance);
    } else if (isAndroid) {
      // 安卓浏览器解锁策略
      if (!(window as any).audioUnlocked) {
        const unlockAudio = new Audio();
        unlockAudio.play().catch(() => {});
        (window as any).audioUnlocked = true;
      }

      this.audio.src = audioUrl;
      this.audio.play()
        .then(() => { this.status = 'playing'; this.notify(); })
        .catch(err => console.error('Audio播放错误:', err));
    } else {
      // 桌面端 Fallback
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'fr-FR';
      utterance.onstart = () => { this.status = 'playing'; this.notify(); };
      utterance.onend = () => { this.status = 'idle'; this.notify(); };
      speechSynthesis.speak(utterance);
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
    this.status = 'idle';
    this.notify();
  }
}

export const tts = new TTSService();
export const playAudio = (params: { text: string; audioUrl: string }) => tts.playAudio(params);
