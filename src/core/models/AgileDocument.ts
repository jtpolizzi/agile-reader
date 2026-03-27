export interface AgileDocument {
  id: string;
  title: string;
  tags: string[];
  rawContent: string;
  createdAt: number;
  updatedAt: number;
  lastUsedAt: number;
  lastIndex: number;
}

export class AgileDocumentModel implements AgileDocument {
  public id: string;
  public title: string;
  public tags: string[];
  public rawContent: string;
  public createdAt: number;
  public updatedAt: number;
  public lastUsedAt: number;
  public lastIndex: number;

  constructor(data: AgileDocument) {
    this.id = data.id;
    this.title = data.title;
    this.tags = data.tags;
    this.rawContent = data.rawContent;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.lastUsedAt = data.lastUsedAt;
    this.lastIndex = data.lastIndex;
  }

  update(title: string, tags: string[], content: string) {
    this.title = title;
    this.tags = tags;
    this.rawContent = content;
    this.updatedAt = Date.now();
  }

  markAccessed() {
    this.lastUsedAt = Date.now();
  }
}
