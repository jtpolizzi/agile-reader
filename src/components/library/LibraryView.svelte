<script lang="ts">
  import { libraryStore } from "../../stores/libraryStore.svelte";
  import { uiStore } from "../../stores/uiStore.svelte";
  import type { AgileDocumentModel } from "../../core/models/AgileDocument";

  let { onSelect, onEdit, onNew }: { 
    onSelect: (doc: AgileDocumentModel) => void,
    onEdit: (doc: AgileDocumentModel) => void,
    onNew: () => void
  } = $props();

  let searchQuery = $state("");
  let selectedTag = $state("");
  let sortColumn = $state<"title" | "createdAt" | "updatedAt" | "lastUsedAt">("lastUsedAt");
  let sortDirection = $state<1 | -1>(-1);

  // Derived filtered and sorted list
  let filteredDocuments = $derived.by(() => {
    let list = libraryStore.documents;

    // Filter by tag
    if (selectedTag) {
      list = list.filter(doc => doc.tags.includes(selectedTag));
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(doc => 
        doc.title.toLowerCase().includes(q) || 
        doc.tags.some(tag => tag.toLowerCase().includes(q))
      );
    }

    // Sort
    return [...list].sort((a, b) => {
      const valA = a[sortColumn];
      const valB = b[sortColumn];
      if (valA < valB) return -1 * sortDirection;
      if (valA > valB) return 1 * sortDirection;
      return 0;
    });
  });

  function toggleSort(col: typeof sortColumn) {
    if (sortColumn === col) {
      sortDirection *= -1;
    } else {
      sortColumn = col;
      sortDirection = -1; // Default to newest first
    }
  }

  function formatDate(ts: number) {
    return new Date(ts).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  }

  function handleNew() {
    onNew();
  }

  function handleEdit(doc: AgileDocumentModel) {
    onEdit(doc);
  }

  function handleDelete(id: string, title: string) {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      libraryStore.delete(id);
    }
  }
</script>

<div class="flex-1 flex flex-col bg-slate-50 overflow-hidden relative">
  <div class="p-6 border-b bg-white flex justify-between items-center shrink-0 shadow-sm gap-4">
    <div class="flex items-center gap-4 flex-1">
      <h2 class="text-xl font-black italic uppercase tracking-tight text-slate-800">Catalogue</h2>
      
      <!-- Search Input -->
      <div class="relative flex-1 max-w-sm">
        <input 
          bind:value={searchQuery}
          type="text" 
          placeholder="Search documents or tags..." 
          class="w-full pl-9 pr-4 py-2 bg-slate-100 border-none rounded-lg text-xs font-bold outline-none focus:ring-2 focus:ring-blue-100"
        >
        <svg class="w-4 h-4 absolute left-3 top-2.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
      </div>

      <!-- Tag Filter -->
      <select 
        bind:value={selectedTag}
        class="bg-slate-100 border-none rounded-lg px-4 py-2 text-[9px] font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-blue-100"
      >
        <option value="">ALL TAGS</option>
        {#each libraryStore.allTags as tag}
          <option value={tag}>{tag}</option>
        {/each}
      </select>
    </div>

    <button onclick={handleNew} class="px-6 py-2 bg-blue-600 text-white rounded-lg font-black text-[10px] uppercase shadow-lg shadow-blue-200 active:scale-95 transition-all shrink-0">
      New Document
    </button>
  </div>

  <div class="flex-1 overflow-y-auto custom-scroll p-6">
    <table class="w-full text-left border-collapse bg-white rounded-xl shadow-sm overflow-hidden">
      <thead class="bg-slate-50 text-[9px] font-black uppercase text-slate-400 border-b">
        <tr>
          <th class="px-4 py-3 cursor-pointer hover:text-blue-600" onclick={() => toggleSort('title')}>
            Doc Name {sortColumn === 'title' ? (sortDirection === 1 ? '↑' : '↓') : ''}
          </th>
          <th class="px-4 py-3">Tags</th>
          <th class="px-4 py-3 hidden md:table-cell cursor-pointer hover:text-blue-600" onclick={() => toggleSort('createdAt')}>
            Created {sortColumn === 'createdAt' ? (sortDirection === 1 ? '↑' : '↓') : ''}
          </th>
          <th class="px-4 py-3 hidden lg:table-cell cursor-pointer hover:text-blue-600" onclick={() => toggleSort('updatedAt')}>
            Last Edited {sortColumn === 'updatedAt' ? (sortDirection === 1 ? '↑' : '↓') : ''}
          </th>
          <th class="px-4 py-3 cursor-pointer hover:text-blue-600" onclick={() => toggleSort('lastUsedAt')}>
            Last Used {sortColumn === 'lastUsedAt' ? (sortDirection === 1 ? '↑' : '↓') : ''}
          </th>
          <th class="px-4 py-3 text-right">Management</th>
        </tr>
      </thead>
      <tbody class="text-[11px] font-medium text-slate-600">
        {#each filteredDocuments as doc}
          <tr class="border-b border-slate-100 hover:bg-slate-50 transition-colors">
            <td 
                class="px-4 py-4 font-bold text-slate-800 italic text-xs cursor-pointer hover:text-blue-600" 
                onclick={() => onSelect(doc)}
            >{doc.title}</td>
            <td class="px-4 py-4">
              <div class="flex flex-wrap gap-1">
                {#each doc.tags as tag}
                  <button 
                    onclick={() => selectedTag = tag}
                    class="bg-slate-100 hover:bg-blue-100 hover:text-blue-600 text-slate-600 rounded-full px-2 py-0.5 font-bold uppercase text-[9px] transition-colors"
                  >{tag}</button>
                {/each}
              </div>
            </td>
            <td class="px-4 py-4 text-[9px] uppercase text-slate-400 font-black hidden md:table-cell">{formatDate(doc.createdAt)}</td>
            <td class="px-4 py-4 text-[9px] uppercase text-slate-400 font-black hidden lg:table-cell">{formatDate(doc.updatedAt)}</td>
            <td class="px-4 py-4 text-[9px] uppercase text-slate-400 font-black">{formatDate(doc.lastUsedAt)}</td>
            <td class="px-4 py-4 text-right">
              <button onclick={() => handleEdit(doc)} class="text-blue-600 font-black hover:underline mr-2">EDIT</button>
              <button class="text-red-500 font-black hover:underline" onclick={() => handleDelete(doc.id, doc.title)}>DEL</button>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>
