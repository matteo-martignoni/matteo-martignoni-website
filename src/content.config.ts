// Content collections configuration
// Defines the structure (schema) of each content collection
// Astro validates every Markdown file against these schemas at build time

import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// "competencies" collection — the 6 areas of practice in Think section
// Each file: src/content/competencies/{nn}-{slug}.{lang}.md
//
// generateId is set explicitly so dotted filenames like
// "01-international-development.en.md" generate unique IDs.
// Without this, Astro's default ID stripping may treat .en.md as a double
// extension and collide EN/IT entries with the same numerical prefix.

const competencies = defineCollection({
  loader: glob({
    pattern: '*.{en,it}.md',
    base: './src/content/competencies',
    generateId: ({ entry }) => entry.replace(/\.md$/, ''),
  }),
  schema: z.object({
    number: z.string(),           // "01" through "06"
    slug: z.string(),             // "international-development"
    title: z.string(),            // "International development"
    lang: z.enum(['en', 'it']),
    description: z.string(),      // 1-2 lines, the Layer 1 visible always
    examples: z.array(z.string()).optional(),  // bullet points for Layer 2
    order: z.number(),            // 1-6 for sorting
  }),
});

export const collections = {
  competencies,
};
