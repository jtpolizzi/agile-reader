import { AudioEngine } from "../core/engine/AudioEngine";

export class EngineStore {
  private engine = new AudioEngine(
    { speed: [0.7, 1.0, 1.3], pause: [800, 2200, 5000] },
    { es: null, en: null }
  );

  // Reactive state controlled by Svelte 5
  public isPlaying = $state(false);
  public currentIndex = $state(-1);

  public togglePlay() {
    this.engine.isPlaying = !this.engine.isPlaying;
    this.isPlaying = this.engine.isPlaying;
    
    if (this.isPlaying) {
      // Logic to start playing...
    } else {
      this.engine.stop();
    }
  }
}

export const engineStore = new EngineStore();
