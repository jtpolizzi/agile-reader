<script lang="ts">
  import { uiStore } from "../../stores/uiStore.svelte";
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

{#if uiStore.activeModal === 'help'}
<div 
  class="fixed inset-0 bg-slate-900/95 z-50 flex items-center justify-center p-6 pointer-events-auto"
  onclick={(e) => { if (e.target === e.currentTarget) uiStore.closeModal(); }}
  role="presentation"
>
  <div class="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl p-8 md:p-10 text-center relative max-h-[90vh] overflow-y-auto custom-scroll" onclick={(e) => e.stopPropagation()} role="presentation">
    <button onclick={() => uiStore.closeModal()} class="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors p-2">✕</button>
    <h3 class="font-black text-2xl mb-6 uppercase italic text-slate-800 tracking-tight">Agile Reader Help</h3>
    
    <div class="space-y-6 text-left">
      <!-- UI Legend Section -->
      <div>
        <h4 class="text-[10px] font-black uppercase text-blue-500 tracking-widest mb-3 border-b pb-1">Primary Toolbar (Top)</h4>
        <div class="space-y-3 text-[11px] font-bold text-slate-600">
          
          <div class="flex items-start gap-3">
            <div class="p-1.5 bg-slate-900 text-white rounded shrink-0"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"/></svg></div>
            <div>
              <div class="flex items-center gap-2"><span class="text-slate-900">TOC Toggle</span> <kbd class="px-1.5 py-0.5 bg-slate-100 border rounded text-[9px]">T</kbd></div>
              <p class="text-[9px] font-normal text-slate-500 mt-0.5 leading-snug">Opens the table of contents sidebar to jump between headings.</p>
            </div>
          </div>

          <div class="flex items-start gap-3">
            <div class="p-1.5 bg-slate-900 text-white rounded shrink-0"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"/></svg></div>
            <div>
              <div class="flex items-center gap-2"><span class="text-slate-900">Catalog</span> <kbd class="px-1.5 py-0.5 bg-slate-100 border rounded text-[9px]">C</kbd></div>
              <p class="text-[9px] font-normal text-slate-500 mt-0.5 leading-snug">Return to the document catalog.</p>
            </div>
          </div>

          <div class="flex items-start gap-3">
            <div class="p-1.5 bg-slate-100 text-slate-600 border rounded shrink-0 font-black text-[10px] w-7 text-center">⚙️</div>
            <div>
              <div class="flex items-center gap-2"><span class="text-slate-900">Presets Dropdown</span></div>
              <p class="text-[9px] font-normal text-slate-500 mt-0.5 leading-snug">Quickly load saved configurations for speed, pauses, and layout.</p>
            </div>
          </div>

          <div class="flex items-start gap-3">
            <div class="p-1.5 bg-slate-900 text-white rounded shrink-0"><svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M3 5h8v14H3V5zm10 0h8v14h-8V5z"/></svg></div>
            <div>
              <div class="flex items-center gap-2"><span class="text-slate-900">Layout Modes</span> <kbd class="px-1.5 py-0.5 bg-slate-100 border rounded text-[9px]">L</kbd></div>
              <p class="text-[9px] font-normal text-slate-500 mt-0.5 leading-snug">Toggle between Side-by-Side, Stacked, or Single Column view.</p>
            </div>
          </div>

          <div class="flex items-start gap-3">
            <div class="p-1.5 bg-slate-900 text-white rounded shrink-0"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg></div>
            <div>
              <div class="flex items-center gap-2"><span class="text-slate-900">Settings</span> <kbd class="px-1.5 py-0.5 bg-slate-100 border rounded text-[9px]">,</kbd></div>
              <p class="text-[9px] font-normal text-slate-500 mt-0.5 leading-snug">Adjust engine speeds, pauses, voices, UI scale, and presets.</p>
            </div>
          </div>

          <div class="flex items-start gap-3">
            <div class="p-1.5 bg-slate-900 text-white rounded shrink-0"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg></div>
            <div>
              <div class="flex items-center gap-2"><span class="text-slate-900">Edit Content</span></div>
              <p class="text-[9px] font-normal text-slate-500 mt-0.5 leading-snug">Open the Markdown editor to modify the current document.</p>
            </div>
          </div>
          
          <div class="flex items-start gap-3">
            <div class="p-1.5 bg-blue-600 text-white rounded shrink-0"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg></div>
            <div>
              <div class="flex items-center gap-2"><span class="text-slate-900">Help Modal</span> <kbd class="px-1.5 py-0.5 bg-slate-100 border rounded text-[9px]">?</kbd></div>
              <p class="text-[9px] font-normal text-slate-500 mt-0.5 leading-snug">You are here! View UI legend and keyboard shortcuts.</p>
            </div>
          </div>

        </div>
      </div>

      <!-- Secondary Toolbar Section -->
      <div>
        <h4 class="text-[10px] font-black uppercase text-blue-500 tracking-widest mb-3 border-b pb-1">Secondary Toolbar (Document Top)</h4>
        <div class="space-y-3 text-[11px] font-bold text-slate-600">
          
          <div class="flex items-start gap-3">
            <div class="p-1.5 bg-slate-100 text-slate-600 border rounded shrink-0 font-black text-[10px] w-12 text-center">EN ➔ ES</div>
            <div>
              <div class="flex items-center gap-2"><span class="text-slate-900">Reading Mode</span> <kbd class="px-1.5 py-0.5 bg-slate-100 border rounded text-[9px]">R</kbd></div>
              <p class="text-[9px] font-normal text-slate-500 mt-0.5 leading-snug">Determines the reading order of the engine (e.g. English then Spanish).</p>
            </div>
          </div>

          <div class="flex items-start gap-3">
            <div class="p-1.5 bg-slate-100 text-slate-600 border rounded shrink-0 font-black text-[10px] w-7 text-center">AP</div>
            <div>
              <div class="flex items-center gap-2"><span class="text-slate-900">Auto-Pause</span> <kbd class="px-1.5 py-0.5 bg-slate-100 border rounded text-[9px]">Q</kbd></div>
              <p class="text-[9px] font-normal text-slate-500 mt-0.5 leading-snug">When green, playback halts automatically after finishing the current segment.</p>
            </div>
          </div>

          <div class="flex items-start gap-3">
            <div class="p-1.5 bg-slate-900 text-white border border-slate-900 rounded shrink-0 font-black text-[10px] w-7 text-center">N</div>
            <div>
              <div class="flex items-center gap-2"><span class="text-slate-900">Reading Speed</span> <kbd class="px-1.5 py-0.5 bg-slate-100 border rounded text-[9px]">V</kbd></div>
              <p class="text-[9px] font-normal text-slate-500 mt-0.5 leading-snug">Toggle TTS speed between S (Slow), N (Normal), and F (Fast).</p>
            </div>
          </div>

          <div class="flex items-start gap-3">
            <div class="p-1.5 bg-slate-900 text-white border border-slate-900 rounded shrink-0 font-black text-[10px] w-7 text-center">0</div>
            <div>
              <div class="flex items-center gap-2"><span class="text-slate-900">Pause Values</span> <kbd class="px-1.5 py-0.5 bg-slate-100 border rounded text-[9px]">P</kbd></div>
              <p class="text-[9px] font-normal text-slate-500 mt-0.5 leading-snug">Buffer wait time between sentences: 0 (None), S (Short), M (Medium), L (Long).</p>
            </div>
          </div>

        </div>
      </div>

      <!-- Keyboard Shortcuts Section -->
      <div>
        <h4 class="text-[10px] font-black uppercase text-blue-500 tracking-widest mb-3 border-b pb-1">Navigation Shortcuts</h4>
        <div class="space-y-2 text-[11px] font-bold text-slate-600">
          <div class="flex justify-between items-center"><span class="font-normal">Play / Advance</span> <kbd class="px-2 py-1 bg-slate-100 border rounded text-slate-900 font-black shadow-sm">W / Space</kbd></div>
          <div class="flex justify-between items-center"><span class="font-normal">Repeat Line</span> <kbd class="px-2 py-1 bg-slate-100 border rounded text-slate-900 font-black shadow-sm">S / ↓</kbd></div>
          <div class="flex justify-between items-center"><span class="font-normal">Next / Prev Line</span> <kbd class="px-2 py-1 bg-slate-100 border rounded text-slate-900 font-black shadow-sm">D / A / → / ←</kbd></div>
          <div class="flex justify-between items-center"><span class="font-normal">Next / Prev Heading</span> <kbd class="px-2 py-1 bg-slate-100 border rounded text-slate-900 font-black shadow-sm">Shift + Arrows</kbd></div>
        </div>
      </div>
    </div>
    
    <button onclick={() => uiStore.closeModal()} class="w-full mt-8 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] transition-colors shadow-lg">Dismiss</button>
  </div>
</div>
{/if}