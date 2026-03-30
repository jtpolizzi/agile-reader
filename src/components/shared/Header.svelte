<script lang="ts">
  import { uiStore } from "../../stores/uiStore.svelte";
</script>

<header class="bg-slate-900 text-white px-2 sm:px-4 py-2 flex items-center justify-between z-40 border-b border-white/10 shadow-md shrink-0">
  <div class="flex items-center gap-2 sm:gap-4 overflow-hidden">
    {#if uiStore.currentView === "reader"}
      <button onclick={(e) => { e.preventDefault(); uiStore.toggleSidebar(); }} class="p-2 sm:p-2.5 hover:bg-white/10 rounded-lg transition-colors" title="TOC Toggle ( T )">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"/></svg>
      </button>
    {/if}
    <button onclick={(e) => { e.preventDefault(); uiStore.currentView = "library"; }} class="p-2 sm:p-2.5 hover:bg-white/10 rounded-lg transition-colors" title="Back to Catalog ( C )">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"/></svg>
    </button>
    
    {#if uiStore.currentView !== "reader"}
      <h1 class="font-black text-[11px] tracking-widest leading-none uppercase italic text-blue-400 hidden sm:block">
        Agile Reader <span class="text-white/20 ml-1">v3.0</span>
    </h1>
    {/if}
  </div>

  <div class="flex items-center gap-2 sm:gap-3">
    {#if uiStore.currentView === "reader"}
      <div class="flex items-center bg-white/5 rounded-lg p-1 border border-white/10" title="Presets">
        <select 
          bind:value={uiStore.currentPresetName} 
          onchange={(e) => { e.preventDefault(); uiStore.loadPreset(e.currentTarget.value); }} 
          class="bg-transparent text-[11px] font-black outline-none px-2 py-1 cursor-pointer text-blue-300 appearance-none text-center"
        >
          <option value="">⚙️ PRESETS</option>
          {#each Object.keys(uiStore.presets).sort() as name}
            <option value={name}>{name}</option>
          {/each}
        </select>
      </div>

      <div class="flex bg-white/5 rounded-lg p-1 border border-white/10" title="Layout Mode ( L )">
        <button onclick={(e) => { e.preventDefault(); uiStore.layoutMode = "side-by-side"; }} title="Side by Side ( L )" class="p-1.5 sm:p-2 rounded-md {uiStore.layoutMode === "side-by-side" ? "bg-white/20" : "hover:bg-white/10"}"><svg class="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M3 5h8v14H3V5zm10 0h8v14h-8V5z"/></svg></button>
        <button onclick={(e) => { e.preventDefault(); uiStore.layoutMode = "over-under"; }} title="Stacked ( L )" class="p-1.5 sm:p-2 rounded-md {uiStore.layoutMode === "over-under" ? "bg-white/20" : "hover:bg-white/10"}"><svg class="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M3 5h18v6H3V5zm0 8h18v6H3v-6z"/></svg></button>
        <button onclick={(e) => { e.preventDefault(); uiStore.layoutMode = "plain"; }} title="Single ( L )" class="p-1.5 sm:p-2 rounded-md {uiStore.layoutMode === "plain" ? "bg-white/20" : "hover:bg-white/10"}"><svg class="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M3 5h18v2H3V5zm0 4h18v2H3V9zm0 4h18v2H3v-2zm0 4h18v2H3v-2z"/></svg></button>
      </div>
      
      <button onclick={(e) => { e.preventDefault(); uiStore.openModal("settings"); }} class="p-2 sm:p-2.5 hover:bg-white/10 rounded-lg transition-colors" title="Settings ( , )"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg></button>
      <button onclick={(e) => { e.preventDefault(); window.dispatchEvent(new CustomEvent('open-editor')); }} class="p-2 sm:p-2.5 hover:bg-white/10 rounded-lg transition-colors" title="Edit Content"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg></button>
    {/if}
    <button onclick={(e) => { e.preventDefault(); uiStore.openModal("help"); }} class="p-2 sm:p-2.5 hover:bg-blue-600 rounded-lg transition-colors" title="Help ( ? )"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg></button>
  </div>
</header>
