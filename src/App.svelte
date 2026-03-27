<script lang="ts">
  import { libraryStore } from './stores/libraryStore.svelte';
  import { MarkdownParser } from './core/parser/MarkdownParser';
  import type { Segment } from './core/models/Segment';
  import LibraryView from './components/library/LibraryView.svelte';
  import ReaderView from './components/reader/ReaderView.svelte';
  import type { AgileDocumentModel } from './core/models/AgileDocument';

  // Core application layout coordinate

  let currentView = $state<'library' | 'reader'>('library');
  let activeDoc = $state<AgileDocumentModel | null>(null);
  let segments = $state<Segment[]>([]);

  function loadDocument(doc: AgileDocumentModel) {
    activeDoc = doc;
    segments = MarkdownParser.parse(doc.rawContent);
    currentView = 'reader';
  }
</script>

<div class="h-[100dvh] flex flex-col overflow-hidden bg-white text-slate-900">
  {#if currentView === 'library'}
    <LibraryView onSelect={loadDocument} />
  {:else if activeDoc}
    <div class="flex items-center p-2 bg-slate-900 text-white">
      <button onclick={() => currentView = 'library'} class="text-[9px] font-black uppercase">← Back to Library</button>
      <h1 class="ml-4 text-xs font-black italic text-blue-400">{activeDoc.title}</h1>
    </div>
    <ReaderView {segments} />
  {/if}
</div>

