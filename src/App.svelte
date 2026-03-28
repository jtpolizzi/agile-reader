<script lang="ts">
  import { libraryStore } from "./stores/libraryStore.svelte";
  import { uiStore } from "./stores/uiStore.svelte";
  import { MarkdownParser } from "./core/parser/MarkdownParser";
  import type { Segment } from "./core/models/Segment";
  import LibraryView from "./components/library/LibraryView.svelte";
  import ReaderView from "./components/reader/ReaderView.svelte";
  import PlaybackHUD from "./components/hud/PlaybackHUD.svelte";
  import Header from "./components/shared/Header.svelte";
  import Sidebar from "./components/shared/Sidebar.svelte";
  import { AgileDocumentModel } from "./core/models/AgileDocument";

  let activeDoc = $state<AgileDocumentModel | null>(null);
  let segments = $state<Segment[]>([]);

  function loadDocument(doc: AgileDocumentModel) {
    activeDoc = doc;
    segments = MarkdownParser.parse(doc.rawContent);
    uiStore.currentView = "reader";
  }

  $effect(() => {
    if (libraryStore.documents.length === 0) {
      const seed = new AgileDocumentModel({
        id: "default",
        title: "Initial Foundations",
        tags: ["tutorial"],
        rawContent: "# [es] Etapa 1: Los Fundamentos | [en] Stage 1: The Foundations\n[es] Hola, ¿cómo estás? | [en] Hello, how are you?",
        createdAt: Date.now(),
        updatedAt: Date.now(),
        lastUsedAt: Date.now(),
        lastIndex: 0
      });
      libraryStore.save(seed);
    }
  });
</script>

<div class="bg-white text-slate-900 h-[100dvh] flex flex-col overflow-hidden {uiStore.sidebarOpen && uiStore.currentView === 'reader' ? 'sidebar-open' : ''}">
  <Header />

  <div class="flex flex-1 overflow-hidden relative" id="app-shell">
    {#if uiStore.currentView === "reader"}
      <Sidebar {segments} />
    {/if}

    <main id="main-content" class="flex-1 flex flex-col relative bg-white overflow-hidden">
      {#if uiStore.currentView === "library"}
        <LibraryView onSelect={loadDocument} />
      {:else if activeDoc}
        <ReaderView {segments} />
        <PlaybackHUD />
      {/if}
    </main>
  </div>
</div>
