import { LocalStorageRepository } from '../core/storage/LocalStorageRepository';
import { type AgileDocumentModel } from '../core/models/AgileDocument';

export class LibraryStore {
  public documents = $state<AgileDocumentModel[]>([]);
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
  }

  public async save(doc: AgileDocumentModel) {
    await this.repo.save(doc);
    await this.loadAll();
    
    // Dispatch event to inform other components that a document was saved
    window.dispatchEvent(new CustomEvent('document-saved', { detail: doc }));
  }

  public async delete(id: string) {
    await this.repo.delete(id);
    await this.loadAll();
  }
}

export const libraryStore = new LibraryStore();
