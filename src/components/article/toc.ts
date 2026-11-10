/** One entry in an article's table of contents (h2 to h4). */
export interface TocEntry {
  id: string;
  text: string;
  level: 2 | 3 | 4;
}

/** Keeps h2 to h4 headings from Astro's rendered markdown, in document order. */
export const tocEntries = (headings: readonly { depth: number; slug: string; text: string }[]): TocEntry[] =>
  headings.flatMap(({ depth, slug, text }) =>
    depth === 2 || depth === 3 || depth === 4 ? [{ id: slug, text, level: depth }] : [],
  );
