<script lang="ts">
  import { type Segment } from '../../core/models/Segment';
  
  let { segments = [] }: { segments: Segment[] } = $props();

  // Extract only headings for the Course Tree
  let headings = $derived(segments.filter(s => s.type === 'heading'));
</script>

<aside id="sidebar" class="custom-scroll">
  <div class="p-4">
    <h2 class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4 border-b border-slate-200 pb-2 italic">Course Tree</h2>
    <nav id="toc-nav" class="space-y-0.5">
      {#each headings as t}
        <button 
          onclick={() => console.log('Jump to line', t.lineIdx)}
          class="w-full text-left px-3 py-1 rounded text-[9px] font-black hover:bg-white transition-all 
                 {t.level === 1 ? 'text-slate-900 border-t mt-2 pt-2' : t.level === 2 ? 'text-slate-500' : 'text-slate-400 pl-4'}">
          {t.es.toUpperCase()}
        </button>
      {/each}
    </nav>
  </div>
</aside>
