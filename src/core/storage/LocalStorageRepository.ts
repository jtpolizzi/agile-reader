import { AgileDocumentModel, type AgileDocument } from '../models/AgileDocument';
import { type IDocumentRepository } from './IDocumentRepository';

const INDEX_KEY = 'agile_reader_index';
const DOC_PREFIX = 'agile_reader_doc_';

export class LocalStorageRepository implements IDocumentRepository {
  async getAll(): Promise<AgileDocumentModel[]> {
    const rawIndex = localStorage.getItem(INDEX_KEY);
    
    // Migration: If new index doesn't exist, check old combined storage
    if (!rawIndex) {
      const oldDocs = localStorage.getItem('agile_reader_docs');
      if (oldDocs) {
        try {
          const docs = JSON.parse(oldDocs) as AgileDocument[];
          const indexData: Omit<AgileDocument, 'rawContent'>[] = [];
          
          for (const doc of docs) {
            const model = new AgileDocumentModel(doc);
            // Save content separately
            localStorage.setItem(`${DOC_PREFIX}${model.id}`, model.rawContent);
            indexData.push(model.toIndex());
          }
          
          // Save the new index
          localStorage.setItem(INDEX_KEY, JSON.stringify(indexData));
          // Remove old combined storage
          localStorage.removeItem('agile_reader_docs');
          
          return docs.map(d => new AgileDocumentModel(d));
        } catch (e) {
          console.error("Migration failed", e);
          return [];
        }
      }
      return [];
    }
    
    try {
      const indexData = JSON.parse(rawIndex) as Omit<AgileDocument, 'rawContent'>[];
      return indexData.map(d => new AgileDocumentModel(d as AgileDocument));
    } catch (e) {
      console.error("Failed to parse index", e);
      return [];
    }
  }

  async getById(id: string): Promise<AgileDocumentModel | null> {
    const all = await this.getAll();
    const meta = all.find(d => d.id === id);
    if (!meta) return null;

    const rawContent = localStorage.getItem(`${DOC_PREFIX}${id}`);
    meta.rawContent = rawContent !== null ? rawContent : '';
    return meta;
  }

  async save(doc: AgileDocumentModel): Promise<void> {
    // 1. Save Content separately
    if (doc.rawContent !== undefined) {
      localStorage.setItem(`${DOC_PREFIX}${doc.id}`, doc.rawContent);
    }

    // 2. Update Index (Read directly from LS to avoid any potential getAll recursion)
    const rawIndex = localStorage.getItem(INDEX_KEY);
    let all: Omit<AgileDocument, 'rawContent'>[] = rawIndex ? JSON.parse(rawIndex) : [];
    
    const meta = doc.toIndex();
    const index = all.findIndex(d => d.id === doc.id);
    
    if (index !== -1) {
      all[index] = meta;
    } else {
      all.push(meta);
    }
    
    localStorage.setItem(INDEX_KEY, JSON.stringify(all));
  }

  async delete(id: string): Promise<void> {
    // 1. Delete Content
    localStorage.removeItem(`${DOC_PREFIX}${id}`);

    // 2. Update Index
    const all = await this.getAll();
    const filtered = all.filter(d => d.id !== id);
    localStorage.setItem(INDEX_KEY, JSON.stringify(filtered.map(d => d.toIndex())));
  }
}

