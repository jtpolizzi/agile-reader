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
  import SettingsModal from "./components/shared/SettingsModal.svelte";
  import HelpModal from "./components/shared/HelpModal.svelte";
  import EditorModal from "./components/shared/EditorModal.svelte";
  import { AgileDocumentModel } from "./core/models/AgileDocument";
  import { onMount } from "svelte";

  import { engineStore } from "./stores/engineStore.svelte";

  let activeDoc = $state<AgileDocumentModel | null>(null);
  let segments = $state<Segment[]>([]);
  let editorModal: any = $state();

  onMount(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if in input/textarea
      const target = e.target as HTMLElement;
      if (target?.tagName === "TEXTAREA" || target?.tagName === "INPUT") return;
      
      const key = e.key.toLowerCase();
      const code = e.code;
      const shift = e.shiftKey;

      if (uiStore.currentView !== "reader") return;

      if (key === "w" || code === "Space") {
        e.preventDefault();
        engineStore.togglePlay();
      }
      if (key === "q") {
        e.preventDefault();
        uiStore.autoPause = !uiStore.autoPause;
      }
      if (key === "t") {
        e.preventDefault();
        uiStore.toggleSidebar();
      }
      if (key === "s" || code === "ArrowDown") {
        e.preventDefault();
        if (engineStore.currentIndex !== -1) {
          engineStore.stop();
          engineStore.play();
        }
      }
      if (key === "d" || code === "ArrowRight") {
        e.preventDefault();
        if (shift) {
          const nextHeadingIdx = segments.findIndex((s, i) => i > engineStore.currentIndex && s.type === "heading");
          if (nextHeadingIdx !== -1) engineStore.setIndex(nextHeadingIdx);
        } else {
          engineStore.next();
        }
      }
      if (key === "a" || code === "ArrowLeft") {
        e.preventDefault();
        if (shift) {
          const prevSlice = segments.slice(0, engineStore.currentIndex);
          for (let i = prevSlice.length - 1; i >= 0; i--) {
            if (prevSlice[i].type === "heading") {
              engineStore.setIndex(i);
              break;
            }
          }
        } else {
          engineStore.prev();
        }
      }
      if (key === "1") uiStore.speedIdx = 1;
      if (key === "2") uiStore.speedIdx = 2;
      if (key === "3") uiStore.speedIdx = 3;
      if (key === "?") uiStore.openModal("help");
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("open-editor", openEditor);

    const handleSaved = (e: CustomEvent) => {
      const savedDoc = e.detail as AgileDocumentModel;
      // If the currently active doc was the one saved, re-parse it
      if (activeDoc && activeDoc.id === savedDoc.id) {
        segments = MarkdownParser.parse(savedDoc.rawContent);
        engineStore.setSegments(segments);
        // Note: engineStore.currentIndex is reactive, so it stays the same
      }
    };
    window.addEventListener("document-saved" as any, handleSaved);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("open-editor", openEditor);
      window.removeEventListener("document-saved" as any, handleSaved);
    };
  });

  function loadDocument(doc: AgileDocumentModel) {
    activeDoc = doc;
    localStorage.setItem("agile_reader_last_doc_id", doc.id);
    segments = MarkdownParser.parse(doc.rawContent);
    engineStore.setSegments(segments);
    engineStore.setIndex(doc.lastIndex || 0);
    uiStore.currentView = "reader";
  }

  function openEditor() {
    if (activeDoc) {
      editorModal.loadDoc(activeDoc);
    } else {
      editorModal.loadDoc();
    }
    uiStore.openModal("editor");
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
    } else {
      // Restore last active document if we are in reader view
      const lastDocId = localStorage.getItem("agile_reader_last_doc_id");
      if (uiStore.currentView === "reader" && !activeDoc && lastDocId) {
        const doc = libraryStore.documents.find(d => d.id === lastDocId);
        if (doc) loadDocument(doc);
      }
    }
  });

  // Auto-save document index when it changes
  $effect(() => {
    if (activeDoc && engineStore.currentIndex !== -1) {
      activeDoc.lastIndex = engineStore.currentIndex;
      libraryStore.save(activeDoc);
    }
  });
</script>

<div class="bg-white text-slate-900 h-[100dvh] flex flex-col overflow-hidden {uiStore.sidebarOpen && uiStore.currentView === 'reader' ? 'sidebar-open' : ''}">
  <Header />

  <div class="flex flex-1 overflow-hidden relative" id="app-shell">
    {#if uiStore.currentView === "reader"}
      <Sidebar {segments} />
    {/if}

    <main 
      id="main-content" 
      class="flex-1 flex flex-col relative bg-white overflow-hidden" 
      style="--reader-font-size: {uiStore.fontSize}px"
    >
      {#if uiStore.currentView === "library"}
        <LibraryView 
          onSelect={loadDocument} 
          onEdit={(doc) => {
            editorModal.loadDoc(doc);
            uiStore.openModal("editor");
          }}
          onNew={() => {
            editorModal.loadDoc();
            uiStore.openModal("editor");
          }}
        />
      {:else if activeDoc}
        <ReaderView {segments} />
        <PlaybackHUD />
      {/if}
    </main>
  </div>

  <SettingsModal />
  <HelpModal />
  <EditorModal bind:this={editorModal} />
</div>
