<script lang="ts">
  import { uiStore } from "../../stores/uiStore.svelte";
  import { engineStore } from "../../stores/engineStore.svelte";

  let esVoices = $derived(engineStore.availableVoices.filter(v => v.lang.toLowerCase().startsWith("es") || v.lang.toLowerCase().startsWith("spa")));
  let enVoices = $derived(engineStore.availableVoices.filter(v => v.lang.toLowerCase().startsWith("en") || v.lang.toLowerCase().startsWith("eng")));

  let newPresetName = $state("");
  let showRawVoices = $state(false);
  let aiStatus = $state("Checking...");
  let testInput = $state("Hola mundo");
  let testOutput = $state("");

  async function checkAI() {
    // @ts-ignore
    const ai = window.ai || window.translation;
    if (!ai) {
      aiStatus = "NOT SUPPORTED (Check chrome://flags)";
      return;
    }
    try {
      // @ts-ignore
      const capabilities = await (ai.translator?.capabilities?.() || ai.canTranslate?.({
        sourceLanguage: 'es',
        targetLanguage: 'en',
      }));
      
      const status = capabilities?.available || capabilities;
      if (status === 'no' || status === 'unavailable') {
        aiStatus = "SUPPORTED BUT NO MODELS";
      } else if (status === 'after-download' || status === 'readily') {
        aiStatus = "READY (" + status.toUpperCase() + ")";
      } else {
        aiStatus = "SUPPORTED (" + status + ")";
      }
    } catch (e) {
      aiStatus = "ERROR: " + (e as Error).message;
    }
  }

  async function runTranslationTest() {
    try {
      // @ts-ignore
      const ai = window.ai || window.translation;
      if (!ai) throw new Error("Translation API not found");

      testOutput = "Translating...";
      
      // Try multiple possible API signatures as this is very experimental
      // @ts-ignore
      const translator = await (ai.translator?.create?.({
        sourceLanguage: 'es',
        targetLanguage: 'en',
      }) || ai.createTranslator?.({
        sourceLanguage: 'es',
        targetLanguage: 'en',
      }));

      if (!translator) throw new Error("Failed to create translator");
      
      // @ts-ignore
      testOutput = await translator.translate(testInput);
    } catch (e) {
      testOutput = "FAILED: " + (e as Error).message;
    }
  }


  $effect(() => {
    if (uiStore.activeModal === "settings") {
      checkAI();
    }
    if (uiStore.currentView === "reader" || uiStore.activeModal === "settings") {
      engineStore.manualRefresh();
    }
    if (uiStore.currentPresetName) {
      newPresetName = uiStore.currentPresetName;
    }
  });

  function handleVoiceChange() {
    const es = engineStore.availableVoices.find(v => v.voiceURI === uiStore.voiceURIs.es);
    const en = engineStore.availableVoices.find(v => v.voiceURI === uiStore.voiceURIs.en);
    if (es) uiStore.voiceNames.es = es.name;
    if (en) uiStore.voiceNames.en = en.name;
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
      voiceNames: { ...uiStore.voiceNames },
      voiceURIs: { ...uiStore.voiceURIs }
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
          <button 
            onclick={() => showRawVoices = !showRawVoices}
            class="w-full mt-1 text-[7px] text-slate-400 underline uppercase"
          >
            {showRawVoices ? 'Hide' : 'Show'} All {engineStore.availableVoices.length} Raw Voices
          </button>
          
          {#if showRawVoices}
            <div class="mt-2 p-2 bg-slate-900 text-white text-[7px] font-mono max-h-40 overflow-y-auto rounded custom-scroll">
              {#each engineStore.availableVoices as v}
                <div class="mb-1 border-b border-white/10 pb-1 uppercase">
                  [{v.lang}] {v.name}
                </div>
              {/each}
            </div>
          {/if}
        </div>
        
        <div>
          <label class="text-[9px] font-bold text-slate-400 block mb-1 uppercase text-[8px]">Spanish (ES)</label>
          <select 
            bind:value={uiStore.voiceURIs.es}
            onchange={handleVoiceChange}
            class="w-full p-2 bg-slate-50 border rounded text-xs mb-3 outline-none focus:ring-2 focus:ring-blue-100"
          >
            {#each esVoices as v}
              <option value={v.voiceURI}>{v.name}</option>
            {/each}
          </select>
          
          <label class="text-[9px] font-bold text-slate-400 block mb-1 uppercase text-[8px]">English (EN)</label>
          <select 
            bind:value={uiStore.voiceURIs.en}
            onchange={handleVoiceChange}
            class="w-full p-2 bg-slate-50 border rounded text-xs outline-none focus:ring-2 focus:ring-blue-100"
          >
            {#each enVoices as v}
              <option value={v.voiceURI}>{v.name}</option>
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

        <div class="pt-4 border-t">
          <h4 class="text-[10px] font-black uppercase text-blue-500 tracking-widest mb-3 italic">AI Translation (Experimental)</h4>
          <div class="p-3 bg-slate-100 rounded-xl space-y-2 border border-slate-200 shadow-inner">
            <div class="flex justify-between items-center">
              <span class="text-[8px] font-black uppercase {aiStatus.startsWith('READY') ? 'text-green-600' : 'text-slate-400'}">{aiStatus}</span>
              <button 
                onclick={checkAI}
                class="text-[7px] bg-white border px-2 py-0.5 rounded font-black shadow-sm"
              >
                RE-SCAN
              </button>
            </div>
            
            <div class="flex gap-1">
              <input 
                bind:value={testInput}
                type="text" 
                class="flex-1 text-[8px] p-1.5 border rounded-md"
                placeholder="Text to translate..."
              />
              <button 
                onclick={runTranslationTest}
                class="bg-blue-600 text-white text-[8px] px-3 py-1 rounded-md font-black shadow-lg active:scale-95 transition-transform"
              >
                TEST
              </button>
            </div>
            
            {#if testOutput}
              <div class="text-[9px] font-bold p-2 bg-white rounded border border-blue-100 text-blue-800 animate-in fade-in slide-in-from-top-1 duration-300">
                {testOutput}
              </div>
            {/if}
            
            <p class="text-[7px] text-slate-400 font-medium leading-tight">
              On-device AI. Requires <code class="bg-slate-200 px-1 rounded">chrome://flags/#translation-api</code> enabled.
            </p>
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