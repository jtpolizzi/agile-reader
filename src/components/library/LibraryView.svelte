<script lang="ts">
  import { libraryStore } from "../../stores/libraryStore.svelte";
  import { uiStore } from "../../stores/uiStore.svelte";
  import type { AgileDocumentModel } from "../../core/models/AgileDocument";
  import EditorModal from "../shared/EditorModal.svelte";

  let { onSelect }: { onSelect: (doc: AgileDocumentModel) => void } = $props();
  let editorModal: ReturnType<typeof EditorModal>;

  function formatDate(ts: number) {
    return new Date(ts).toLocaleDateString();
  }

  function handleNew() {
    editorModal.loadDoc();
    uiStore.openModal("editor");
  }

  function handleEdit(doc: AgileDocumentModel) {
    editorModal.loadDoc(doc);
    uiStore.openModal("editor");
  }
</script>

<div class="flex-1 flex flex-col bg-slate-50 overflow-hidden relative">
  <div class="p-6 border-b bg-white flex justify-between items-center shrink-0 shadow-sm">
    <h2 class="text-xl font-black italic uppercase tracking-tight text-slate-800">Catalogue</h2>
    <button onclick={handleNew} class="px-6 py-2 bg-blue-600 text-white rounded-lg font-black text-[10px] uppercase shadow-lg shadow-blue-200 active:scale-95 transition-all">
      New Document
    </button>
  </div>

  <div class="flex-1 overflow-y-auto custom-scroll p-6">
    <table class="w-full text-left border-collapse bg-white rounded-xl shadow-sm overflow-hidden">
      <thead class="bg-slate-50 text-[9px] font-black uppercase text-slate-400 border-b">
        <tr>
          <th class="px-4 py-3">Doc Name</th>
          <th class="px-4 py-3">Tags</th>
          <th class="px-4 py-3">Last Used</th>
          <th class="px-4 py-3 text-right">Management</th>
        </tr>
      </thead>
      <tbody class="text-[11px] font-medium text-slate-600">
        {#each libraryStore.documents as doc}
          <tr class="border-b border-slate-100 hover:bg-slate-50 transition-colors">
            <td 
                class="px-4 py-4 font-bold text-slate-800 italic text-xs cursor-pointer hover:text-blue-600" 
                onclick={() => onSelect(doc)}
            >{doc.title}</td>
            <td class="px-4 py-4">
              <div class="flex flex-wrap gap-1">
                {#each doc.tags as tag}
                  <span class="bg-slate-100 text-slate-600 rounded-full px-2 py-0.5 font-bold uppercase text-[9px]">{tag}</span>
                {/each}
              </div>
            </td>
            <td class="px-4 py-4 text-[9px] uppercase text-slate-400 font-black">{formatDate(doc.lastUsedAt)}</td>
            <td class="px-4 py-4 text-right">
              <button onclick={() => handleEdit(doc)} class="text-blue-600 font-black hover:underline mr-2">EDIT</button>
              <button class="text-red-500 font-black hover:underline" onclick={() => libraryStore.delete(doc.id)}>DEL</button>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
  
  <EditorModal bind:this={editorModal} />
</div>
