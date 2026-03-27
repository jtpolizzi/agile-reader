import { LocalStorageRepository } from '../core/storage/LocalStorageRepository';
import { type AgileDocumentModel } from '../core/models/AgileDocument';

export class LibraryStore {
  public documents = $state<AgileDocumentModel[]>([]);
  private repo = new LocalStorageRepository();

  constructor() {
    this.loadAll();
  }

  public async loadAll() {
    this.documents = await this.repo.getAll();
  }

  public async save(doc: AgileDocumentModel) {
    await this.repo.save(doc);
    await this.loadAll();
  }

  public async delete(id: string) {
    await this.repo.delete(id);
    await this.loadAll();
  }
}

export const libraryStore = new LibraryStore();
