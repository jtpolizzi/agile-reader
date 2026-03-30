export class UIStore {
  public currentView = $state<"catalog" | "reader">("catalog");
  public sidebarOpen = $state(false);
  public activeModal = $state<string | null>(null);
  
  // Reader specific settings
  public fontSize = $state(14);
  public layoutMode = $state<"side-by-side" | "over-under" | "plain">("side-by-side");
  public sequenceMode = $state<"es-only" | "en-only" | "en-es" | "es-en">("en-es");
  public autoPause = $state(false);
  
  // Ghosting / Recall System State
  public ghostMode = $state<"NONE" | "ACTIVE">("NONE");
  public ghostType = $state<"BLUR" | "HIDE">("BLUR");
  public autoReveal = $state(false);
  public revealDelay = $state(500); // ms
  public revealedSegments = $state<Set<number>>(new Set());

  public leadLanguage = $derived(
    this.sequenceMode === "es-en" || this.sequenceMode === "es-only" ? "es" : "en"
  );
  public speedIdx = $state(2);
  public pauseIdx = $state(2);

  public speedValues = $state([0.7, 1.0, 1.3]);
  public pauseValues = $state([400, 2500, 4500]);

  public voiceNames = $state({ es: "", en: "" });
  public voiceURIs = $state({ es: "", en: "" });

  public presets: Record<string, any> = $state({
    "Classic Shadow": { seq: "es-only", speedIdx: 2, pauseIdx: 0, layout: "side-by-side", autoPause: false, fontSize: 14, voiceNames: { es: "", en: "" }, voiceURIs: { es: "", en: "" } },
    "Deep Drill": { seq: "en-es", speedIdx: 1, pauseIdx: 2, layout: "side-by-side", autoPause: true, fontSize: 14, voiceNames: { es: "", en: "" }, voiceURIs: { es: "", en: "" } }
  });
  public currentPresetName = $state("");
  public activeDocTitle = $state("");

  constructor() {
    this.loadState();
  }

  public saveState() {
    const state = {
      currentView: this.currentView,
      sidebarOpen: this.sidebarOpen,
      fontSize: this.fontSize,
      layoutMode: this.layoutMode,
      sequenceMode: this.sequenceMode,
      autoPause: this.autoPause,
      ghostMode: this.ghostMode,
      ghostType: this.ghostType,
      autoReveal: this.autoReveal,
      revealDelay: this.revealDelay,
      speedIdx: this.speedIdx,
      pauseIdx: this.pauseIdx,
      speedValues: this.speedValues,
      pauseValues: this.pauseValues,
      voiceNames: this.voiceNames,
      voiceURIs: this.voiceURIs,
      presets: this.presets,
      currentPresetName: this.currentPresetName
    };
    localStorage.setItem("agile_reader_ui_state", JSON.stringify(state));
  }



  private loadState() {
    const saved = localStorage.getItem("agile_reader_ui_state");
    if (saved) {
      try {
        const state = JSON.parse(saved);
        // Ensure revealedSegments doesn't get overwritten with plain object from JSON
        const { revealedSegments, ...rest } = state;
        Object.assign(this, rest);
      } catch (e) {
        console.error("Failed to load UI state", e);
      }
    }
  }

  public toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  public toggleSettings() {
    if (this.activeModal === "settings") {
      this.closeModal();
    } else {
      this.openModal("settings");
    }
  }

  public cycleLayoutMode(reverse = false) {
    const modes: ("side-by-side" | "over-under" | "plain")[] = ["side-by-side", "over-under", "plain"];
    const idx = modes.indexOf(this.layoutMode);
    if (reverse) {
      this.layoutMode = modes[(idx - 1 + modes.length) % modes.length];
    } else {
      this.layoutMode = modes[(idx + 1) % modes.length];
    }
  }

  public cycleSequenceMode(reverse = false) {
    const modes: ("es-only" | "en-only" | "en-es" | "es-en")[] = ["en-es", "es-en", "es-only", "en-only"];
    const idx = modes.indexOf(this.sequenceMode);
    if (reverse) {
      this.sequenceMode = modes[(idx - 1 + modes.length) % modes.length];
    } else {
      this.sequenceMode = modes[(idx + 1) % modes.length];
    }
  }

  public cyclePause(reverse = false) {
    if (reverse) {
      this.pauseIdx = (this.pauseIdx - 1 + 4) % 4;
    } else {
      this.pauseIdx = (this.pauseIdx + 1) % 4; // 0, 1, 2, 3
    }
  }

  public cycleSpeed(reverse = false) {
    if (reverse) {
      this.speedIdx = (this.speedIdx - 1 + 3) % 3;
    } else {
      this.speedIdx = (this.speedIdx + 1) % 3; // 0, 1, 2
    }
  }

  public openModal(id: string) {
    this.activeModal = id;
  }

  public closeModal() {
    this.activeModal = null;
  }

  public loadPreset(name: string) {
    if (!name || !this.presets[name]) {
      this.currentPresetName = "";
      return;
    }
    const p = this.presets[name];
    this.currentPresetName = name;
    this.sequenceMode = p.seq;
    this.speedIdx = p.speedIdx;
    this.pauseIdx = p.pauseIdx;
    this.layoutMode = p.layout;
    this.autoPause = p.autoPause;
    this.fontSize = p.fontSize;
    if (p.ghostMode !== undefined) this.ghostMode = p.ghostMode;
    if (p.ghostType !== undefined) this.ghostType = p.ghostType;
    if (p.autoReveal !== undefined) this.autoReveal = p.autoReveal;
    if (p.revealDelay !== undefined) this.revealDelay = p.revealDelay;

    if (p.voiceNames) this.voiceNames = { ...p.voiceNames };
    if (p.voiceURIs) this.voiceURIs = { ...p.voiceURIs };
    
    // Dispatch custom event to tell the engine to update its voices
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent('preset-loaded'));
    }
  }

  public toggleGhostMode() {
    if (this.ghostMode === "ACTIVE") {
      this.ghostMode = "NONE";
    } else {
      // Activating ghost mode immediately obfuscates everything
      this.revealedSegments = new Set();
      this.ghostMode = "ACTIVE";
    }
  }

  public resetAllSettings() {
    // Clear the local storage keys for settings and last document
    localStorage.removeItem("agile_reader_ui_state");
    localStorage.removeItem("agile_reader_last_doc_id");

    // Revert to pure default state
    this.sidebarOpen = false;
    this.fontSize = 14;
    this.layoutMode = "side-by-side";
    this.sequenceMode = "en-es";
    this.autoPause = false;
    this.ghostMode = "NONE";
    this.ghostType = "BLUR";
    this.autoReveal = false;
    this.revealDelay = 500;
    this.revealedSegments = new Set();
    this.speedIdx = 2;
    this.pauseIdx = 2;
    
    this.speedValues = [0.7, 1.0, 1.3];
    this.pauseValues = [400, 2500, 4500];

    this.voiceNames = { es: "", en: "" };
    this.voiceURIs = { es: "", en: "" };

    this.presets = {
      "Classic Shadow": { seq: "es-only", speedIdx: 2, pauseIdx: 0, layout: "side-by-side", autoPause: false, fontSize: 14, voiceNames: { es: "", en: "" }, voiceURIs: { es: "", en: "" } },
      "Deep Drill": { seq: "en-es", speedIdx: 1, pauseIdx: 2, layout: "side-by-side", autoPause: true, fontSize: 14, voiceNames: { es: "", en: "" }, voiceURIs: { es: "", en: "" } }
    };
    
    this.currentPresetName = "";
    
    // We do NOT clear currentView, activeDocTitle, or activeModal 
    // to prevent the UI from harshly breaking while the modal is open.
    // The user can close the modal manually or navigate away safely.

    // Save this fresh state immediately
    this.saveState();
  }

}

export const uiStore = new UIStore();
