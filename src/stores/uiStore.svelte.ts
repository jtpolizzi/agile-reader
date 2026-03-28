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

  public presets: Record<string, any> = {
    "Classic Shadow": { seq: "es-only", speedIdx: 2, pauseIdx: 0, layout: "side-by-side", autoPause: false, fontSize: 14 },
    "Deep Drill": { seq: "en-es", speedIdx: 1, pauseIdx: 2, layout: "side-by-side", autoPause: true, fontSize: 14 }
  };
  public currentPresetName = $state("");

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
