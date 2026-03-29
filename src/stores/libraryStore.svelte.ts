import { LocalStorageRepository } from '../core/storage/LocalStorageRepository';
import { AgileDocumentModel } from '../core/models/AgileDocument';

export class LibraryStore {
  public documents = $state<AgileDocumentModel[]>([]);
  public isLoaded = $state(false);
  private repo = new LocalStorageRepository();

  public allTags = $derived.by(() => {
    const tags = new Set<string>();
    this.documents.forEach(doc => {
      doc.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  });

  constructor() {
    this.loadAll();
  }

  public async loadAll() {
    this.documents = await this.repo.getAll();
    this.isLoaded = true;
  }

  public async save(doc: AgileDocumentModel) {
    await this.repo.save(doc);
    
    // Update local state (Index only if not lazy loaded)
    const idx = this.documents.findIndex(d => d.id === doc.id);
    if (idx !== -1) {
      const newDocs = [...this.documents];
      newDocs[idx] = new AgileDocumentModel(doc);
      this.documents = newDocs;
    } else {
      this.documents = [...this.documents, new AgileDocumentModel(doc)];
    }
    
    window.dispatchEvent(new CustomEvent('document-saved', { detail: doc }));
  }

  public async getFullDoc(id: string): Promise<AgileDocumentModel | null> {
    return await this.repo.getById(id);
  }

  public async delete(id: string) {
    await this.repo.delete(id);
    await this.loadAll();
  }
}

export const libraryStore = new LibraryStore();
