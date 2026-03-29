export type SegmentType = 'heading' | 'text';

export interface BaseSegment {
  type: SegmentType;
  es: string;
  en: string;
}

export class HeadingSegment implements BaseSegment {
  public readonly type = 'heading';
  constructor(
    public es: string,
    public en: string,
    public level: 1 | 2 | 3,
    public lineIdx: number
  ) {}
}

export class TextSegment implements BaseSegment {
  public readonly type = 'text';
  constructor(
    public es: string,
    public en: string,
    public pause: number | null,
    public headingIdx: number
  ) {}
}

export type Segment = HeadingSegment | TextSegment;
