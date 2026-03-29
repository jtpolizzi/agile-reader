<script lang="ts">
  import { uiStore } from "../../stores/uiStore.svelte";
  import { engineStore } from "../../stores/engineStore.svelte";

  let esVoices = $derived(engineStore.availableVoices.filter(v => v.lang.toLowerCase().startsWith("es") || v.lang.toLowerCase().startsWith("spa")));
  let enVoices = $derived(engineStore.availableVoices.filter(v => v.lang.toLowerCase().startsWith("en") || v.lang.toLowerCase().startsWith("eng")));

  let newPresetName = $state("");

  $effect(() => {
    if (uiStore.currentView === "reader" || uiStore.activeModal === "settings") {
      engineStore.manualRefresh();
    }
    if (uiStore.currentPresetName) {
      newPresetName = uiStore.currentPresetName;
    }
  });

  function handleVoiceChange() {
    engineStore.refreshVoices();
  }



  function saveNewPreset() {
    if (!newPresetName.trim()) return;
    uiStore.presets[newPresetName] = {
      seq: uiStore.sequenceMode,
      speedIdx: uiStore.speedIdx,
      pauseIdx: uiStore.pauseIdx,
      layout: uiStore.layoutMode,
      autoPause: uiStore.autoPause,
      fontSize: uiStore.fontSize,
      voiceNames: { ...uiStore.voiceNames }
    };
    uiStore.currentPresetName = newPresetName;
    newPresetName = "";
  }

  function deletePreset(name: string) {
    delete uiStore.presets[name];
    if (uiStore.currentPresetName === name) uiStore.currentPresetName = "";
  }
  $effect(() => {
    if (uiStore.activeModal) {
      const handleEsc = (e: KeyboardEvent) => {
        if (e.key === "Escape") uiStore.closeModal();
      };
      window.addEventListener("keydown", handleEsc);
      return () => window.removeEventListener("keydown", handleEsc);
    }
  });
</script>

{#if uiStore.activeModal === 'settings'}
<div 
  class="fixed inset-0 bg-slate-900/95 z-50 flex items-center justify-center p-6"
  onclick={(e) => { if (e.target === e.currentTarget) uiStore.closeModal(); }}
  role="presentation"
>
  <div class="bg-white w-full max-w-2xl rounded-[2rem] shadow-2xl overflow-hidden" onclick={(e) => e.stopPropagation()} role="presentation">
    <div class="p-6 border-b flex justify-between items-center bg-slate-50">
      <h3 class="font-black text-xl uppercase italic text-slate-800">Engine Settings</h3>
      <button onclick={() => uiStore.closeModal()} class="text-slate-400 p-2">✕</button>
    </div>
    
    <div class="p-8 grid grid-cols-1 md:grid-cols-2 gap-8 max-h-[70vh] overflow-y-auto custom-scroll">
      <div class="space-y-6">
        <h4 class="text-[10px] font-black uppercase text-blue-500 tracking-widest">Named Presets</h4>
        <div class="flex gap-2">
          <input 
            type="text" 
            bind:value={newPresetName}
            placeholder="Preset Name" 
            class="flex-1 p-2 bg-slate-50 border rounded text-xs outline-none focus:ring-2 focus:ring-blue-100"
          >
          <button onclick={saveNewPreset} class="px-4 py-2 bg-slate-900 text-white rounded text-[10px] font-black">SAVE</button>
        </div>
        
        <div class="space-y-1">
          {#each Object.keys(uiStore.presets).sort() as name}
            <div class="flex items-center justify-between p-2 bg-slate-50 rounded text-[9px] font-bold group">
              <button 
                onclick={() => uiStore.loadPreset(name)}
                class="truncate pr-2 flex-1 text-left"
              >
                {name}
              </button>
              <button onclick={() => deletePreset(name)} class="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1">✕</button>
            </div>
          {/each}
        </div>
        
        <div class="pt-4 border-t">
          <h4 class="text-[10px] font-black uppercase text-blue-500 tracking-widest mb-3">UI Density Control</h4>
          <label class="text-[9px] font-bold text-slate-400 block mb-2 uppercase">Root Scaling ({uiStore.fontSize}px)</label>
          <input 
            type="range" 
            min="10" 
            max="24" 
            step="1" 
            bind:value={uiStore.fontSize}
            class="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
          >
        </div>
      </div>
      
      <div class="space-y-6">
        <h4 class="text-[10px] font-black uppercase text-blue-500 tracking-widest">System Voices</h4>
        <div class="mb-4">
          <div class="flex items-center justify-between mb-2">
            <span class="text-[9px] font-bold text-slate-400 uppercase italic">Found: {engineStore.availableVoices.length} voices</span>
            <button 
              onclick={() => engineStore.manualRefresh()}
              class="text-[9px] bg-slate-200 hover:bg-slate-300 px-2 py-1 rounded font-bold transition-colors"
            >
              REFRESH LIST
            </button>
          </div>
          <div class="text-[8px] font-black text-blue-600 uppercase tracking-tighter bg-blue-50/50 p-1 rounded-sm text-center">
            {engineStore.status}
          </div>
        </div>
        <div>
          <label class="text-[9px] font-bold text-slate-400 block mb-1 uppercase text-[8px]">Spanish (ES)</label>
          <select 
            bind:value={uiStore.voiceNames.es}
            onchange={handleVoiceChange}
            class="w-full p-2 bg-slate-50 border rounded text-xs mb-3 outline-none focus:ring-2 focus:ring-blue-100"
          >
            {#each esVoices as v}
              <option value={v.name}>{v.name}</option>
            {/each}
          </select>
          
          <label class="text-[9px] font-bold text-slate-400 block mb-1 uppercase text-[8px]">English (EN)</label>
          <select 
            bind:value={uiStore.voiceNames.en}
            onchange={handleVoiceChange}
            class="w-full p-2 bg-slate-50 border rounded text-xs outline-none focus:ring-2 focus:ring-blue-100"
          >
            {#each enVoices as v}
              <option value={v.name}>{v.name}</option>
            {/each}
          </select>
        </div>
        
        <div class="space-y-4 pt-4 border-t">
          <h4 class="text-[10px] font-black uppercase text-blue-500 tracking-widest">Rate / Pause Values</h4>
          <div class="flex gap-2">
            <input type="number" bind:value={uiStore.speedValues[0]} step="0.1" class="w-full p-2 bg-slate-50 border rounded text-xs" title="Slow Rate">
            <input type="number" bind:value={uiStore.speedValues[1]} step="0.1" class="w-full p-2 bg-slate-50 border rounded text-xs" title="Natural Rate">
            <input type="number" bind:value={uiStore.speedValues[2]} step="0.1" class="w-full p-2 bg-slate-50 border rounded text-xs" title="Fast Rate">
          </div>
          <div class="flex gap-2">
            <input type="number" bind:value={uiStore.pauseValues[0]} class="w-full p-2 bg-slate-50 border rounded text-xs" title="Short Buffer">
            <input type="number" bind:value={uiStore.pauseValues[1]} class="w-full p-2 bg-slate-50 border rounded text-xs" title="Medium Buffer">
            <input type="number" bind:value={uiStore.pauseValues[2]} class="w-full p-2 bg-slate-50 border rounded text-xs" title="Long Buffer">
          </div>
        </div>
      </div>
    </div>
    
    <div class="p-6 border-t bg-slate-50 flex justify-end gap-3">
      <button onclick={() => uiStore.closeModal()} class="px-12 py-3 bg-blue-600 text-white rounded-xl font-black uppercase text-[10px] tracking-widest shadow-lg">Done</button>
    </div>
  </div>
</div>
{/if}