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
        const [esRaw, enRaw] = rawContent.split('|');
        const es = this.clean(esRaw || '');
        const en = this.clean(enRaw || '');
        
        const heading = new HeadingSegment(es, en, level, idx);
        segments.push(heading);
        lastHeadingIdx = idx;
        return;
      }

      // Handle Drill Segments (Rows containing '|')
      if (trimmed.includes('|')) {
        const [esRaw, enRaw] = trimmed.split('|');
        const es = this.clean(esRaw || '');
        const en_with_pause = this.clean(enRaw || '');
        
        // Handle Pause Metadata: [pause:123]
        const pauseMatch = en_with_pause.match(/(.*)\[pause:(\d+)\]/i);
        const en = pauseMatch ? pauseMatch[1].trim() : en_with_pause;
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
