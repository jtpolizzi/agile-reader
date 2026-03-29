<script lang="ts">
  import { uiStore } from '../../stores/uiStore.svelte';
  import { libraryStore } from '../../stores/libraryStore.svelte';
  import { AgileDocumentModel } from '../../core/models/AgileDocument';

  let title = $state('');
  let tags = $state('');
  let content = $state('');
  let isEditing = $state(false);
  let editId = $state<string | null>(null);
  let dates = $state({ created: 0, updated: 0, used: 0 });

  function formatDate(ts: number) {
    if (!ts) return 'N/A';
    return new Date(ts).toLocaleString();
  }

  function addTag(tag: string) {
    const currentTags = tags.split(',').map(t => t.trim()).filter(Boolean);
    if (!currentTags.includes(tag)) {
      currentTags.push(tag);
      tags = currentTags.join(', ');
    }
  }

  // Expose this so the parent can call it when opening the modal
  export async function loadDoc(doc?: AgileDocumentModel) {
    if (doc) {
      // If the document is just a shell (no content), lazy-load it
      if (!doc.rawContent) {
        const fullDoc = await libraryStore.getFullDoc(doc.id);
        if (fullDoc) {
          doc = fullDoc;
        }
      }

      isEditing = true;
      editId = doc.id;
      title = doc.title;
      tags = doc.tags.join(', ');
      content = doc.rawContent || '';
      dates = { created: doc.createdAt, updated: doc.updatedAt, used: doc.lastUsedAt };
    } else {
      isEditing = false;
      editId = null;
      title = '';
      tags = '';
      content = '';
      dates = { created: 0, updated: 0, used: 0 };
    }
  }

  $effect(() => {
    if (uiStore.activeModal) {
      const handleEsc = (e: KeyboardEvent) => {
        if (e.key === "Escape") uiStore.closeModal();
      };
      window.addEventListener("keydown", handleEsc);
      return () => window.removeEventListener("keydown", handleEsc);
    }
  });

  async function save() {
    const t = title.trim() || 'Untitled Doc';
    const tagArray = tags.split(',').map(tag => tag.trim()).filter(Boolean);
    
    if (isEditing && editId) {
      // Find the existing doc
      const existing = await libraryStore.getFullDoc(editId);
      if (existing) {
        existing.update(t, tagArray, content);
        await libraryStore.save(existing);
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
      await libraryStore.save(newDoc);
    }
    
    uiStore.closeModal();
  }
</script>

{#if uiStore.activeModal === 'editor'}
  <div 
    class="fixed inset-0 bg-slate-900/95 z-50 flex items-center justify-center p-6 pointer-events-auto"
    onclick={(e) => { if (e.target === e.currentTarget) uiStore.closeModal(); }}
    role="presentation"
  >
    <div class="bg-white w-full max-w-5xl h-[85vh] rounded-[3rem] shadow-2xl flex flex-col overflow-hidden pointer-events-auto" onclick={(e) => e.stopPropagation()} role="presentation">
      
      <div class="p-6 border-b flex justify-between items-center bg-slate-50 shrink-0">
        <div class="flex-1 flex flex-col gap-1 mr-4">
          <div class="flex gap-4">
            <input bind:value={title} type="text" placeholder="Document Title" class="flex-1 p-2 bg-white border border-slate-200 rounded text-base font-black italic outline-none focus:ring-2 focus:ring-blue-500">
            <div class="flex flex-col gap-1 relative w-64">
              <input bind:value={tags} type="text" placeholder="Tags (e.g. Grammar, Story)" class="w-full p-2 bg-white border border-slate-200 rounded text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500">
              
              <!-- Tag Suggestions -->
              {#if libraryStore.allTags.length > 0}
                <div class="flex flex-wrap gap-1 mt-1">
                  {#each libraryStore.allTags as tag}
                    {#if !tags.includes(tag)}
                      <button 
                        onclick={() => addTag(tag)}
                        class="bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full px-2 py-0.5 font-bold uppercase text-[8px] transition-colors"
                      >
                        + {tag}
                      </button>
                    {/if}
                  {/each}
                </div>
              {/if}
            </div>
          </div>
          {#if isEditing}
            <div class="flex gap-4 text-[9px] font-black uppercase text-slate-400 italic">
              <span>Created: {formatDate(dates.created)}</span>
              <span>Updated: {formatDate(dates.updated)}</span>
              <span>Last Used: {formatDate(dates.used)}</span>
            </div>
          {/if}
        </div>
        <button onclick={() => uiStore.closeModal()} class="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors">✕</button>
      </div>
      
      <div class="flex-1 p-6 overflow-hidden">
        <textarea bind:value={content} class="w-full h-full p-6 bg-slate-50 border border-slate-200 rounded-2xl font-mono text-xs outline-none focus:ring-2 focus:ring-blue-500 custom-scroll shadow-inner"></textarea>
      </div>
      
      <div class="p-8 border-t bg-white flex justify-end gap-3 shrink-0">
        <button onclick={() => uiStore.closeModal()} class="px-8 py-3 font-bold text-slate-400 uppercase text-[10px] tracking-widest hover:text-slate-600 transition-colors">Discard</button>
        <button onclick={save} class="px-14 py-4 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all">Save</button>
      </div>
      
    </div>
  </div>
{/if}
