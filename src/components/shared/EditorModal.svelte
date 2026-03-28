<script lang="ts">
  import { uiStore } from '../../stores/uiStore.svelte';
  import { libraryStore } from '../../stores/libraryStore.svelte';
  import { AgileDocumentModel } from '../../core/models/AgileDocument';

  let title = $state('');
  let tags = $state('');
  let content = $state('');
  let isEditing = $state(false);
  let editId = $state<string | null>(null);

  // Expose this so the parent can call it when opening the modal
  export function loadDoc(doc?: AgileDocumentModel) {
    if (doc) {
      isEditing = true;
      editId = doc.id;
      title = doc.title;
      tags = doc.tags.join(', ');
      content = doc.rawContent;
    } else {
      isEditing = false;
      editId = null;
      title = '';
      tags = '';
      content = '';
    }
  }

  function save() {
    const t = title.trim() || 'Untitled Doc';
    const tagArray = tags.split(',').map(tag => tag.trim()).filter(Boolean);
    
    if (isEditing && editId) {
      // Find the existing doc
      const existing = libraryStore.documents.find(d => d.id === editId);
      if (existing) {
        existing.update(t, tagArray, content);
        libraryStore.save(existing);
      }
    } else {
      // Create new doc
      const newDoc = new AgileDocumentModel({
        id: 'd' + Date.now(),
        title: t,
        tags: tagArray,
        rawContent: content,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        lastUsedAt: Date.now(),
        lastIndex: 0
      });
      libraryStore.save(newDoc);
    }
    
    uiStore.closeModal();
  }
</script>

{#if uiStore.activeModal === 'editor'}
  <div class="modal-overlay">
    <div class="bg-white w-full max-w-5xl h-[85vh] rounded-[3rem] shadow-2xl flex flex-col overflow-hidden pointer-events-auto">
      
      <div class="p-6 border-b flex justify-between items-center bg-slate-50 shrink-0">
        <div class="flex-1 flex gap-4 mr-4">
          <input bind:value={title} type="text" placeholder="Document Title" class="flex-1 p-2 bg-white border border-slate-200 rounded text-base font-black italic outline-none focus:ring-2 focus:ring-blue-500">
          <input bind:value={tags} type="text" placeholder="Tags (e.g. Grammar, Story)" class="w-64 p-2 bg-white border border-slate-200 rounded text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500">
        </div>
        <button onclick={() => uiStore.closeModal()} class="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors">✕</button>
      </div>
      
      <div class="flex-1 p-6 overflow-hidden">
        <textarea bind:value={content} class="w-full h-full p-6 bg-slate-50 border border-slate-200 rounded-2xl font-mono text-xs outline-none focus:ring-2 focus:ring-blue-500 custom-scroll shadow-inner"></textarea>
      </div>
      
      <div class="p-8 border-t bg-white flex justify-end gap-3 shrink-0">
        <button onclick={() => uiStore.closeModal()} class="px-8 py-3 font-bold text-slate-400 uppercase text-[10px] tracking-widest hover:text-slate-600 transition-colors">Discard</button>
        <button onclick={save} class="px-14 py-4 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all">Persist Document</button>
      </div>
      
    </div>
  </div>
{/if}
