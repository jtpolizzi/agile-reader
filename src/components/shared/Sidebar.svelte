<script lang="ts">
  import type { Segment } from '../../core/models/Segment';
  import { engineStore } from '../../stores/engineStore.svelte';
  
  let { segments = [] }: { segments: Segment[] } = $props();

  // Extract only headings for the Course Tree
  let headings = $derived(segments.filter(s => s.type === 'heading'));

  // Find the current active heading
  let activeHeadingIdx = $derived.by(() => {
    if (engineStore.currentIndex === -1) return -1;
    // Look backwards from current index for the first heading
    for (let i = engineStore.currentIndex; i >= 0; i--) {
      if (segments[i].type === 'heading') return segments[i].lineIdx;
    }
    return -1;
  });

  function jumpToHeading(lineIdx: number) {
    const idx = segments.findIndex(s => s.lineIdx === lineIdx);
    if (idx !== -1) {
      engineStore.setIndex(idx);
      const el = document.getElementById(`seg-${idx}`);
      el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
</script>

<aside id="sidebar" class="custom-scroll">
  <div class="p-4">
    <h2 class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4 border-b border-slate-200 pb-2 italic">Course Tree</h2>
    <nav id="toc-nav" class="space-y-0.5">
      {#each headings as t}
        <button 
          onclick={() => jumpToHeading(t.lineIdx)}
          class="w-full text-left px-3 py-1 rounded text-[9px] font-black hover:bg-white transition-all 
                 {t.level === 1 ? 'text-slate-900 border-t mt-2 pt-2' : t.level === 2 ? 'text-slate-500' : 'text-slate-400 pl-4'}
                 {activeHeadingIdx === t.lineIdx ? 'bg-blue-50 text-blue-600 border-l-2 border-blue-600 !pl-2 shadow-sm' : ''}">
          {t.es.toUpperCase()}
        </button>
      {/each}
    </nav>
  </div>
</aside>
