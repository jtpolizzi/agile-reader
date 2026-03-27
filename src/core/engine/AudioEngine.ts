import { type Segment } from "../models/Segment";

export interface AudioEngineConfig {
  speed: number[];
  pause: number[];
}

export class AudioEngine {
  public isPlaying = false;
  public isHalted = false;
  public currentIndex = -1;
  
  private synth = window.speechSynthesis;
  private audioTimer: number | null = null;
  private executionId = 0;

  constructor(
    private config: AudioEngineConfig,
    private voices: { es: SpeechSynthesisVoice | null; en: SpeechSynthesisVoice | null }
  ) {}

  public stop(): void {
    this.executionId++;
    this.isPlaying = false;
    this.isHalted = false;
    this.synth.cancel();
    if (this.audioTimer) clearTimeout(this.audioTimer);
  }

  public async talk(text: string, lang: "es" | "en", speedIdx: number): Promise<void> {
    return new Promise((resolve) => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = this.voices[lang];
      utterance.rate = this.config.speed[speedIdx - 1] || 1.0;
      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();
      this.synth.speak(utterance);
    });
  }

  public async wait(ms: number): Promise<void> {
    const lockId = this.executionId;
    return new Promise((resolve) => {
      this.audioTimer = setTimeout(() => {
        if (lockId === this.executionId) resolve();
      }, ms);
    });
  }
}
