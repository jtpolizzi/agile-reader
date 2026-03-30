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
  private heartbeat: any = null;
  private safetyTimeout: any = null;

  constructor(
    public config: AudioEngineConfig,
    public voices: { es: SpeechSynthesisVoice | null; en: SpeechSynthesisVoice | null }
  ) {}

  /**
   * Stops all current speech and clears the execution queue.
   * Uses a robust sequence to ensure the browser's speech engine is fully reset.
   */
  public stop(): void {
    this.executionId++;
    this.isPlaying = false;
    this.isHalted = false;
    
    if (this.heartbeat) clearInterval(this.heartbeat);
    if (this.safetyTimeout) clearTimeout(this.safetyTimeout);
    
    // HACK: If the engine is paused, cancel() often fails to clear the queue.
    // We resume first to ensure the cancel command is processed.
    if (this.synth.paused) this.synth.resume();
    this.synth.cancel();
    
    if (this.audioTimer) clearTimeout(this.audioTimer);
  }

  /**
   * Pauses the current speech utterance.
   */
  public pause(): void {
    this.synth.pause();
    if (this.heartbeat) clearInterval(this.heartbeat);
    if (this.safetyTimeout) clearTimeout(this.safetyTimeout);

    // HACK: Some browsers (like Chrome on certain OSs) require a tiny delay 
    // and a second pause call to actually stop the audio buffer immediately.
    if (this.synth.speaking && !this.synth.paused) {
      setTimeout(() => { if (!this.isPlaying) this.synth.pause(); }, 10);
    }
  }

  /**
   * Resumes speech from a paused state.
   */
  public resume(): void {
    this.synth.resume();
  }

  /**
   * Converts text to speech using the Web Speech API.
   * Includes several workarounds for common browser bugs.
   */
  public async talk(text: string, lang: "es" | "en", speedIdx: number): Promise<void> {
    return new Promise((resolve) => {
      // Ensure we start with a clean slate
      if (this.synth.speaking) {
        this.synth.cancel();
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang === "es" ? "es-ES" : "en-US"; 
      utterance.voice = this.voices[lang];
      utterance.rate = this.config.speed[speedIdx] || 1.0;
      
      let resolved = false;
      const finish = () => {
        if (!resolved) {
          resolved = true;
          if (this.heartbeat) clearInterval(this.heartbeat);
          if (this.safetyTimeout) clearTimeout(this.safetyTimeout);
          resolve();
        }
      };

      utterance.onend = finish;
      utterance.onerror = finish;
      
      // HACK: "The 15-second bug". Chrome's speech engine often times out 
      // and stops firing events after 15s. Periodically pausing and 
      // resuming keeps the connection alive.
      if (this.heartbeat) clearInterval(this.heartbeat);
      this.heartbeat = setInterval(() => {
        if (this.synth.speaking && !this.synth.paused) {
          this.synth.pause();
          this.synth.resume();
        }
      }, 10000);

      // HACK: Safety timeout. If the browser fails to fire 'onend' or 'onerror'
      // (a frequent occurrence), this ensures the app doesn't hang forever.
      const wordCount = text.split(' ').length;
      const timeoutDuration = Math.max(10000, wordCount * 2000); 
      if (this.safetyTimeout) clearTimeout(this.safetyTimeout);
      this.safetyTimeout = setTimeout(() => {
        // Only trigger if we aren't paused
        if (!this.synth.paused) {
          finish();
        }
      }, timeoutDuration);

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
