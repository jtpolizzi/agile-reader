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

    // Re-sync engine config whenever uiStore settings change
    $effect.root(() => {
      $effect(() => {
        this.updateConfig(uiStore.speedValues, uiStore.pauseValues);
      });
    });

    if (typeof window !== "undefined") {
      window.addEventListener("preset-loaded", () => {
        this.refreshVoices();
      });
    }
  }

  private initVoices() {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    const synth = window.speechSynthesis;
    
    const updateVoicesList = () => {
      const voices = synth.getVoices();
      console.log(`AudioEngine: Found ${voices.length} voices`);
      if (voices.length > 0) {
        this.availableVoices = voices;
        this.refreshVoices();
      }
    };

    // Standard official event listener
    synth.onvoiceschanged = updateVoicesList;

    // Initial check (in case voices are already loaded)
    const initialVoices = synth.getVoices();
    if (initialVoices.length > 0) {
      this.availableVoices = initialVoices;
      this.refreshVoices();
    } else {
      // Very light fallback nudge for specific mobile browsers, runs once
      setTimeout(() => {
        if (this.availableVoices.length === 0) {
          const nudge = new SpeechSynthesisUtterance("");
          nudge.volume = 0;
          synth.speak(nudge);
        }
      }, 500);
    }
  }

  public refreshVoices() {
    if (this.availableVoices.length === 0) return;

    // Search patterns: more inclusive for mobile browsers that label things oddly
    const isEs = (v: SpeechSynthesisVoice) => 
      v.lang.toLowerCase().startsWith("es") || 
      v.lang.toLowerCase().startsWith("spa") || 
      v.name.toLowerCase().includes("spanish");

    const isEn = (v: SpeechSynthesisVoice) => 
      v.lang.toLowerCase().startsWith("en") || 
      v.lang.toLowerCase().startsWith("eng") || 
      v.name.toLowerCase().includes("english");

    // Match by URI (unique) first, then Name, then Lang
    const es = this.availableVoices.find(v => v.voiceURI === uiStore.voiceURIs.es) || 
               this.availableVoices.find(v => v.name === uiStore.voiceNames.es) || 
               this.availableVoices.find(isEs) || null;

    const en = this.availableVoices.find(v => v.voiceURI === uiStore.voiceURIs.en) || 
               this.availableVoices.find(v => v.name === uiStore.voiceNames.en) || 
               this.availableVoices.find(isEn) || null;
    
    this.engine.voices = { es, en };

    // Update uiStore names & URIs if they are empty but we found a default
    if (!uiStore.voiceNames.es && es) uiStore.voiceNames.es = es.name;
    if (!uiStore.voiceURIs.es && es) uiStore.voiceURIs.es = es.voiceURI;
    if (!uiStore.voiceNames.en && en) uiStore.voiceNames.en = en.name;
    if (!uiStore.voiceURIs.en && en) uiStore.voiceURIs.en = en.voiceURI;
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
    const currentIndexLock = this.currentIndex;

    // Sequence plan based on UI store
    const plan = this.getPlan();

    for (const step of plan) {
      if (!this.isPlaying || currentLock !== this.executionId) return;

      if (step.type === "speak") {
        const lang = step.lang as "es" | "en";
        const text = s[lang as 'es' | 'en'];
        if (!text) continue;

        this.status = `${lang.toUpperCase()}: ${uiStore.sequenceMode.toUpperCase()}`;
        await this.engine.talk(text, lang, uiStore.speedIdx);
        
        // --- GHOSTING: Auto-Reveal Logic ---
        // Trigger auto-reveal after the Lead Language finishes speaking
        if (
          uiStore.ghostMode === "ACTIVE" && 
          uiStore.autoReveal && 
          lang === uiStore.leadLanguage
        ) {
          setTimeout(() => {
            const newSet = new Set(uiStore.revealedSegments);
            newSet.add(currentIndexLock);
            uiStore.revealedSegments = newSet;
          }, uiStore.revealDelay);
        }
      } else if (step.type === "wait") {
        if (uiStore.pauseIdx === 0) continue;
        
        this.status = "WAITING...";
        const basePause = uiStore.pauseValues[uiStore.pauseIdx - 1] || 2000;
        
        // Manual pause override in segment [pause:1000]
        const manualPause = (s as any).p ? (s as any).p * 1000 : null;
        
        // Dynamic pause based on word count (heuristic from legacy)
        // Wait time is based on the language we are waiting FOR (the next one)
        const targetLang = plan[plan.length - 1].lang as "es" | "en";
        const wordCount = s[targetLang as 'es' | 'en']?.split(" ").length || 0;
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

