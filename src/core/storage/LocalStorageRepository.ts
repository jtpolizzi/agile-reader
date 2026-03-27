import { type AgileDocumentModel } from '../models/AgileDocument';
import { type IDocumentRepository } from './IDocumentRepository';

const STORAGE_KEY = 'agile_reader_docs';

export class LocalStorageRepository implements IDocumentRepository {
  async getAll(): Promise<AgileDocumentModel[]> {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    
    const data = JSON.parse(raw) as any[];
    return data.map((d: any) => new AgileDocumentModel(d));
  }

  async getById(id: string): Promise<AgileDocumentModel | null> {
    const all = await this.getAll();
    return all.find(d => d.id === id) || null;
  }

  async save(doc: AgileDocumentModel): Promise<void> {
    const all = await this.getAll();
    const index = all.findIndex(d => d.id === doc.id);
    
    if (index !== -1) {
      all[index] = doc;
    } else {
      all.push(doc);
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  }

  async delete(id: string): Promise<void> {
    const all = await this.getAll();
    const filtered = all.filter(d => d.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  }
}

