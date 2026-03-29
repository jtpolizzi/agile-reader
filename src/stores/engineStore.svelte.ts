import { AudioEngine } from "../core/engine/AudioEngine";
import type { Segment } from "../core/models/Segment";
import { uiStore } from "./uiStore.svelte";

export class EngineStore {
  private engine = new AudioEngine(
    { speed: [0.7, 1.0, 1.3], pause: [800, 2200, 5000] },
    { es: null, en: null }
  );

  private segments: Segment[] = [];
  private executionId = 0;

  // Reactive state controlled by Svelte 5
  public isPlaying = $state(false);
  public isHalted = $state(false);
  public currentIndex = $state(-1);
  public status = $state("Ready");
  public availableVoices = $state<SpeechSynthesisVoice[]>([]);

  constructor() {
    this.initVoices();

    // Re-sync voices when names change (e.g. from presets or settings)
    $effect.root(() => {
      $effect(() => {
        uiStore.voiceNames.es;
        uiStore.voiceNames.en;
        this.refreshVoices();
      });
    });
  }

  private initVoices() {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    const synth = window.speechSynthesis;
    
    // Some mobile browsers need a "nudge" to load voices
    const forceUpdate = () => {
      const voices = synth.getVoices();
      console.log(`AudioEngine: Found ${voices.length} voices`);
      if (voices.length > 0) {
        this.availableVoices = voices;
        this.refreshVoices();
      }
    };

    // Listen for the official event
    synth.onvoiceschanged = forceUpdate;

    // Aggressive polling for mobile (runs a few times then stops)
    let attempts = 0;
    const poll = setInterval(() => {
      forceUpdate();
      attempts++;
      
      // HACK: If voices are still empty, try "nudging" the synth engine 
      // with a silent utterance (required by some Android browsers)
      if (this.availableVoices.length === 0 && attempts % 2 === 0) {
        const nudge = new SpeechSynthesisUtterance("");
        nudge.volume = 0;
        synth.speak(nudge);
      }

      if (attempts > 20 || this.availableVoices.length > 0) clearInterval(poll);
    }, 500);

    // Initial check
    forceUpdate();
  }

  public async manualRefresh() {
    if (typeof window !== "undefined") {
      const synth = window.speechSynthesis;
      
      // HACK: On mobile, the list is often empty until the browser is nudged.
      // We try several techniques in sequence.
      
      // 1. Silent utterance to "wake up" the engine
      if (synth.getVoices().length === 0) {
        const silent = new SpeechSynthesisUtterance(" ");
        silent.volume = 0;
        synth.speak(silent);
        synth.cancel();
      }

      // 2. Wait and read voices
      this.availableVoices = synth.getVoices();
      
      // 3. Fallback: On some Samsung/Android 15+ devices, the standard event 
      // doesn't fire, but requesting the list again after a micro-task works.
      await new Promise(r => setTimeout(r, 100));
      this.availableVoices = synth.getVoices();
      
      this.refreshVoices();
    }
  }

  public refreshVoices() {
    if (this.availableVoices.length === 0) return;

    // Search patterns: 'es-' or 'spa' for Spanish, 'en-' or 'eng' for English
    const es = this.availableVoices.find(v => v.name === uiStore.voiceNames.es) || 
               this.availableVoices.find(v => v.lang.toLowerCase().startsWith("es")) ||
               this.availableVoices.find(v => v.lang.toLowerCase().startsWith("spa")) || null;

    const en = this.availableVoices.find(v => v.name === uiStore.voiceNames.en) || 
               this.availableVoices.find(v => v.lang.toLowerCase().startsWith("en")) ||
               this.availableVoices.find(v => v.lang.toLowerCase().startsWith("eng")) || null;
    
    this.engine.voices = { es, en };

    // Update uiStore names if they are empty but we found a default
    if (!uiStore.voiceNames.es && es) uiStore.voiceNames.es = es.name;
    if (!uiStore.voiceNames.en && en) uiStore.voiceNames.en = en.name;
  }


  public setSegments(segs: Segment[]) {
    this.segments = segs;
  }

  public setIndex(idx: number) {
    this.currentIndex = idx;
  }

  public async togglePlay() {
    if (this.isPlaying) {
      this.engine.pause();
      this.isPlaying = false;
      this.status = "PAUSED";
    } else {
      // Check if the browser is actually paused
      if (window.speechSynthesis.paused) {
        this.engine.resume();
        this.isPlaying = true;
        this.status = "RESUMED";
      } else {
        // If not paused, start fresh
        await this.play();
      }
    }
  }

  public async selectAndPlay(idx: number) {
    this.stop();
    this.currentIndex = idx;
    await this.play();
  }

  public stop() {
    this.executionId++;
    this.isPlaying = false;
    this.isHalted = false;
    this.engine.stop();
    this.status = "STOPPED";
  }

  public async play() {
    if (this.segments.length === 0) return;
    if (this.currentIndex === -1) this.currentIndex = 0;

    // Cancel any existing speech before starting new
    this.engine.stop(); 
    
    // Small delay to let the browser clear its queue
    await new Promise(r => setTimeout(r, 50));

    this.isPlaying = true;
    this.isHalted = false;
    await this.run();
  }

  private async run() {
    if (!this.isPlaying || this.currentIndex >= this.segments.length) {
      this.stop();
      return;
    }

    const currentLock = ++this.executionId;
    const s = this.segments[this.currentIndex];

    // Sequence plan based on UI store
    const plan = this.getPlan();

    for (const step of plan) {
      if (!this.isPlaying || currentLock !== this.executionId) return;

      if (step.type === "speak") {
        const lang = step.lang as "es" | "en";
        const text = s[lang];
        if (!text) continue;

        this.status = `${lang.toUpperCase()}: ${uiStore.sequenceMode.toUpperCase()}`;
        await this.engine.talk(text, lang, uiStore.speedIdx);
      } else if (step.type === "wait") {
        if (uiStore.pauseIdx === 0) continue;
        
        this.status = "WAITING...";
        const basePause = uiStore.pauseValues[uiStore.pauseIdx - 1] || 2000;
        
        // Manual pause override in segment [pause:1000]
        const manualPause = (s as any).p ? (s as any).p * 1000 : null;
        
        // Dynamic pause based on word count (heuristic from legacy)
        const targetLang = plan[plan.length - 1].lang as "es" | "en";
        const wordCount = s[targetLang]?.split(" ").length || 0;
        const dynamicPause = basePause + (wordCount * 250);
        
        await this.engine.wait(manualPause || dynamicPause);
      }
    }

    if (!this.isPlaying || currentLock !== this.executionId) return;

    if (uiStore.autoPause) {
      this.isPlaying = false;
      this.isHalted = true;
      this.status = "HALTED (AP)";
      return;
    }

    // // Small buffer between segments
    // if (uiStore.pauseIdx > 0) {
    //   await this.engine.wait(500);
    // }

    if (currentLock === this.executionId) {
      this.next();
    }
  }

  private getPlan() {
    switch (uiStore.sequenceMode) {
      case "es-only": return [{ type: "speak", lang: "es" }];
      case "en-only": return [{ type: "speak", lang: "en" }];
      case "en-es": return [{ type: "speak", lang: "en" }, { type: "wait" }, { type: "speak", lang: "es" }];
      case "es-en": return [{ type: "speak", lang: "es" }, { type: "wait" }, { type: "speak", lang: "en" }];
      default: return [{ type: "speak", lang: "es" }];
    }
  }

  public async next() {
    if (this.currentIndex < this.segments.length - 1) {
      this.stop(); // Stop current speech immediately
      this.currentIndex++;
      await this.play(); // Start playing the new line
    } else {
      this.stop();
    }
  }

  public async prev() {
    if (this.currentIndex > 0) {
      this.stop(); // Stop current speech immediately
      this.currentIndex--;
      await this.play(); // Start playing the new line
    }
  }

  // Update engine voices when settings change
  public updateVoices(es: SpeechSynthesisVoice | null, en: SpeechSynthesisVoice | null) {
    this.engine.voices = { es, en };
  }

  // Update engine config when settings change
  public updateConfig(speed: number[], pause: number[]) {
    this.engine.config = { speed, pause };
  }
}

export const engineStore = new EngineStore();

