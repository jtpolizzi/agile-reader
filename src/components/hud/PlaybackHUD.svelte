<script lang="ts">
  import { engineStore } from '../../stores/engineStore.svelte';
</script>

<div class="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-sm px-4">
  <div class="bg-slate-900 rounded-full shadow-2xl p-2.5 flex items-center gap-3 border border-white/10 backdrop-blur-md">
    <button onclick={() => engineStore.prev()} class="w-10 h-10 rounded-full text-white/50 hover:text-white flex items-center justify-center transition-colors">
      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>
    </button>
    
    <button onclick={() => engineStore.togglePlay()} class="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-xl hover:bg-blue-500 active:scale-95 transition-all">
      {#if engineStore.isPlaying}
        <svg class="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
      {:else}
        <svg class="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
      {/if}
    </button>
    
    <button onclick={() => engineStore.next()} class="w-10 h-10 rounded-full text-white/50 hover:text-white flex items-center justify-center transition-colors">
      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>
    </button>

    <div class="flex-1 pr-4 border-l border-white/10 ml-2">
      <div class="flex justify-between items-center mb-1">
        <span class="text-[8px] font-black uppercase text-blue-400 tracking-widest">{engineStore.status}</span>
      </div>
      <div class="h-1 w-full bg-white/10 rounded-full overflow-hidden">
        <div 
          class="h-full bg-blue-500 transition-all" 
          style="width: {((engineStore.currentIndex + 1) / (engineStore['segments'].length || 1)) * 100}%"
        ></div>
      </div>
    </div>
  </div>
</div>
