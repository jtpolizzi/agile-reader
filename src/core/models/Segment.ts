export type SegmentType = 'heading' | 'drill';

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

export class DrillSegment implements BaseSegment {
  public readonly type = 'drill';
  constructor(
    public es: string,
    public en: string,
    public pauseOverrideMs: number | null,
    public headingIdx: number
  ) {}
}

export type Segment = HeadingSegment | DrillSegment;
