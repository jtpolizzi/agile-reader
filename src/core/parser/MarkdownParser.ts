import { HeadingSegment, DrillSegment, type Segment } from '../models/Segment';

export class MarkdownParser {
  /**
   * Transforms raw markdown into a typed Segment array.
   * Maintains the logic from the stable legacy system.
   */
  static parse(md: string): Segment[] {
    const lines = md.split('\n');
    const segments: Segment[] = [];
    let lastHeadingIdx = -1;

    lines.forEach((line, idx) => {
      const trimmed = line.trim();
      if (!trimmed) return;

      // Handle Headings (1-3 levels)
      const headingMatch = trimmed.match(/^(#{1,3})\s+(.*)/);
      if (headingMatch) {
        const level = headingMatch[1].length as 1 | 2 | 3;
        const rawContent = headingMatch[2].trim();
        const [es, en] = rawContent.split('|').map(s => this.clean(s));
        
        const heading = new HeadingSegment(es, en || '', level, idx);
        segments.push(heading);
        lastHeadingIdx = idx;
        return;
      }

      // Handle Drill Segments (Rows containing '|')
      if (trimmed.includes('|')) {
        const [esRaw, enRaw] = trimmed.split('|').map(s => this.clean(s));
        
        // Handle Pause Metadata: [pause:123]
        const pauseMatch = enRaw.match(/(.*)\[pause:(\d+)\]/i);
        const es = esRaw;
        const en = pauseMatch ? pauseMatch[1].trim() : enRaw;
        const pause = pauseMatch ? parseInt(pauseMatch[2], 10) : null;

        segments.push(new DrillSegment(es, en, pause, lastHeadingIdx));
      }
    });

    return segments;
  }

  private static clean(str: string): string {
    return str.replace(/\[es\]|\[en\]/gi, '').trim();
  }
}
