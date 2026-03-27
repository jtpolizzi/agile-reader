import { AgileDocumentModel } from '../models/AgileDocument';

export interface IDocumentRepository {
  getAll(): Promise<AgileDocumentModel[]>;
  getById(id: string): Promise<AgileDocumentModel | null>;
  save(doc: AgileDocumentModel): Promise<void>;
  delete(id: string): Promise<void>;
}
