<script lang="ts">
  import { engineStore } from '../../stores/engineStore.svelte';
  import { type Segment } from '../../core/models/Segment';

  let { segments = [] }: { segments: Segment[] } = $props();
</script>

<div class="flex-1 overflow-y-auto custom-scroll scroll-smooth pb-40">
  <div id="render-target" class="max-w-6xl mx-auto py-2 layout-side-by-side">
    {#each segments as seg, idx}
      <div 
        id="seg-{idx}" 
        role="button"
        tabindex="0"
        onkeydown={(e) => { if (e.key === 'Enter') console.log('select', idx); }}
        class="border-b border-slate-50 group transition-colors cursor-pointer py-1.5 px-4 {engineStore.currentIndex === idx ? 'active-row' : 'row-hover'}"
        onclick={() => console.log('select', idx)}
      >
        <div class="seg-grid">
          {#if seg.type === 'heading'}
            <!-- Heading logic here -->
            <div class="seg-es text-base font-black uppercase italic text-slate-800">
              {seg.es}
            </div>
            <div class="seg-en text-sm font-medium text-slate-500 opacity-40">
              {seg.en}
            </div>
          {:else}
            <!-- Drill logic here -->
            <div class="seg-es text-sm font-medium leading-tight">{seg.es}</div>
            <div class="seg-en text-sm font-medium leading-tight text-slate-600">{seg.en}</div>
          {/if}
        </div>
      </div>
    {/each}
  </div>
</div>

