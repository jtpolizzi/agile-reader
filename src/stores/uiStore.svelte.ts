export class UIStore {
  public currentView = $state<"library" | "reader">("library");
  public sidebarOpen = $state(true);
  public activeModal = $state<string | null>(null);
  
  // Reader specific settings
  public fontSize = $state(14);
  public layoutMode = $state<"side-by-side" | "over-under" | "plain">("side-by-side");
  public sequenceMode = $state<"es-only" | "en-only" | "en-es" | "es-en">("en-es");
  public autoPause = $state(false);
  public speedIdx = $state(2);
  public pauseIdx = $state(2);

  public speedValues = $state([0.7, 1.0, 1.3]);
  public pauseValues = $state([800, 2200, 5000]);

  public voiceNames = $state({ es: "", en: "" });

  public presets: Record<string, any> = $state({
    "Classic Shadow": { seq: "es-only", speedIdx: 2, pauseIdx: 0, layout: "side-by-side", autoPause: false, fontSize: 14, voiceNames: { es: "", en: "" } },
    "Deep Drill": { seq: "en-es", speedIdx: 1, pauseIdx: 2, layout: "side-by-side", autoPause: true, fontSize: 14, voiceNames: { es: "", en: "" } }
  });
  public currentPresetName = $state("");

  constructor() {
    this.loadState();
    
    // Auto-save state on changes
    $effect.root(() => {
      $effect(() => {
        this.saveState();
      });
    });
  }

  private saveState() {
    const state = {
      currentView: this.currentView,
      sidebarOpen: this.sidebarOpen,
      fontSize: this.fontSize,
      layoutMode: this.layoutMode,
      sequenceMode: this.sequenceMode,
      autoPause: this.autoPause,
      speedIdx: this.speedIdx,
      pauseIdx: this.pauseIdx,
      speedValues: this.speedValues,
      pauseValues: this.pauseValues,
      voiceNames: this.voiceNames,
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
        Object.assign(this, state);
      } catch (e) {
        console.error("Failed to load UI state", e);
      }
    }
  }

  public toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
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
  }
}

export const uiStore = new UIStore();
