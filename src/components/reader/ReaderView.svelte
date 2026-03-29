<script lang="ts">
  import { engineStore } from "../../stores/engineStore.svelte";
  import { uiStore } from "../../stores/uiStore.svelte";
  import { type Segment } from "../../core/models/Segment";

  let { segments = [] }: { segments: Segment[] } = $props();

  function getHeadingClass(level: number) {
    if (level === 1) return "reader-h1";
    if (level === 2) return "reader-h2";
    return "reader-h3";
  }

  $effect(() => {
    if (engineStore.currentIndex !== -1) {
      const el = document.getElementById(`seg-${engineStore.currentIndex}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  });
</script>

<div class="bg-slate-50 border-b border-slate-200 px-4 py-1 flex items-center justify-between gap-4 shrink-0 overflow-x-auto no-scrollbar">
  <div class="flex items-center gap-2">
    <div class="flex items-center bg-white border border-slate-200 rounded p-0.5 shadow-sm">
      <select bind:value={uiStore.sequenceMode} class="bg-transparent text-[9px] font-bold outline-none px-2 py-0.5 cursor-pointer uppercase">
        <option value="es-only">ES ONLY</option>
        <option value="en-only">EN ONLY</option>
        <option value="en-es">EN ➔ ES</option>
        <option value="es-en">ES ➔ EN</option>
      </select>
    </div>
    <button onclick={() => uiStore.autoPause = !uiStore.autoPause} class="ap-indicator px-3 py-1 border rounded text-[9px] font-black transition-all bg-white border-slate-200 {uiStore.autoPause ? 'active' : ''}" title="Auto-Pause (Q)">AP</button>
  </div>

  <div class="flex items-center gap-4">
    <div class="flex items-center gap-1 bg-white border border-slate-200 rounded p-0.5 shadow-sm">
      <button onclick={() => uiStore.speedIdx = 1} class="w-7 h-5 text-[9px] font-bold rounded {uiStore.speedIdx === 1 ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-400'}">S</button>
      <button onclick={() => uiStore.speedIdx = 2} class="w-7 h-5 text-[9px] font-bold rounded {uiStore.speedIdx === 2 ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-400'}">N</button>
      <button onclick={() => uiStore.speedIdx = 3} class="w-7 h-5 text-[9px] font-bold rounded {uiStore.speedIdx === 3 ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-400'}">F</button>
    </div>
    <div class="flex items-center gap-1 bg-white border border-slate-200 rounded p-0.5 shadow-sm">
      <button onclick={() => uiStore.pauseIdx = 0} class="w-7 h-5 text-[9px] font-bold rounded {uiStore.pauseIdx === 0 ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-400'}">0</button>
      <button onclick={() => uiStore.pauseIdx = 1} class="w-7 h-5 text-[9px] font-bold rounded {uiStore.pauseIdx === 1 ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-400'}">S</button>
      <button onclick={() => uiStore.pauseIdx = 2} class="w-7 h-5 text-[9px] font-bold rounded {uiStore.pauseIdx === 2 ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-400'}">M</button>
      <button onclick={() => uiStore.pauseIdx = 3} class="w-7 h-5 text-[9px] font-bold rounded {uiStore.pauseIdx === 3 ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-400'}">L</button>
    </div>
  </div>
</div>

<div class="flex-1 overflow-y-auto custom-scroll scroll-smooth pb-40">
  <div class="max-w-6xl mx-auto py-2 reader-container layout-{uiStore.layoutMode}">
    {#each segments as seg, idx}
      {#if seg.type === 'heading'}
        <div 
          id="seg-{idx}"
          role="button"
          tabindex="0"
          onkeydown={(e) => { if (e.key === 'Enter') console.log('select heading', idx); }}
          class="seg-grid px-4 py-1 cursor-pointer transition-all hover:bg-slate-50 rounded group {engineStore.currentIndex === idx ? 'marked-heading' : ''}"
          onclick={() => {
            engineStore.selectAndPlay(idx);
          }}
        >
          <div class="seg-es heading-content-wrap {getHeadingClass(seg.level)}">
            <span>{seg.es}</span>
          </div>
          <div class="seg-en {getHeadingClass(seg.level)} opacity-40">{seg.en}</div>
        </div>
      {:else}
        <div 
          id="seg-{idx}" 
          role="button"
          tabindex="0"
          onkeydown={(e) => { if (e.key === 'Enter') { engineStore.selectAndPlay(idx); } }}
          class="row-hover border-b border-slate-50 group transition-colors cursor-pointer py-1.5 px-4 {engineStore.currentIndex === idx ? 'active-row' : ''}"
          onclick={() => {
            engineStore.selectAndPlay(idx);
          }}
        >
          <div class="seg-grid">
            <div class="seg-es">{seg.es}</div>
            <div class="seg-en">{seg.en}</div>
          </div>
        </div>
      {/if}
    {/each}
  </div>
</div>
