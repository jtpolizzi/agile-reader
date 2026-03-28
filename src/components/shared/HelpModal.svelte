<script lang="ts">
  import { uiStore } from "../../stores/uiStore.svelte";
</script>

{#if uiStore.activeModal === 'help'}
<div class="fixed inset-0 bg-slate-900/95 z-50 flex items-center justify-center p-6">
  <div class="bg-white w-full max-w-sm rounded-[2.5rem] shadow-2xl p-10 text-center relative">
    <button onclick={() => uiStore.closeModal()} class="absolute top-6 right-6 text-slate-400 p-2">✕</button>
    <h3 class="font-black text-2xl mb-8 uppercase italic text-slate-800 tracking-tight">Shortcuts</h3>
    
    <div class="space-y-3 text-left text-[11px] font-bold text-slate-600">
      <div class="flex justify-between"><span>Play / Advance</span> <kbd class="px-2 py-0.5 bg-slate-100 border rounded text-slate-900 font-black">W / Space</kbd></div>
      <div class="flex justify-between"><span>Repeat Line</span> <kbd class="px-2 py-0.5 bg-slate-100 border rounded text-slate-900 font-black">S / ↓</kbd></div>
      <div class="flex justify-between"><span>Next / Prev Line</span> <kbd class="px-2 py-0.5 bg-slate-100 border rounded text-slate-900 font-black">D / A</kbd></div>
      <div class="flex justify-between"><span>Next / Prev Heading</span> <kbd class="px-2 py-0.5 bg-slate-100 border rounded text-slate-900 font-black uppercase">Shift + D/A</kbd></div>
      <div class="flex justify-between"><span>Sidebar Toggle</span> <kbd class="px-2 py-0.5 bg-slate-100 border rounded text-slate-900 font-black uppercase">T</kbd></div>
      <div class="flex justify-between"><span>Auto-Pause (AP)</span> <kbd class="px-2 py-0.5 bg-slate-100 border rounded text-slate-900 font-black uppercase">Q</kbd></div>
      <div class="flex justify-between"><span>Show Help</span> <kbd class="px-2 py-0.5 bg-slate-100 border rounded text-slate-900 font-black uppercase">?</kbd></div>
    </div>
    
    <button onclick={() => uiStore.closeModal()} class="w-full mt-10 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-[10px]">Dismiss</button>
  </div>
</div>
{/if}