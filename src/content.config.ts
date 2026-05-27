import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const competencies = defineCollection({
  loader: glob({
    pattern: '*.{en,it}.md',
    base: './src/content/competencies',
    generateId: ({ entry }) => entry.replace(/\.md$/, ''),
  }),
  schema: z.object({
    number: z.string(),
    slug: z.string(),
    title: z.string(),
    lang: z.enum(['en', 'it']),
    description: z.string(),
    examples: z.array(z.string()).optional(),
    order: z.number(),
  }),
});

const projects = defineCollection({
  loader: glob({
    pattern: '*.{en,it}.md',
    base: './src/content/projects',
    generateId: ({ entry }) => entry.replace(/\.md$/, ''),
  }),
  schema: z.object({
    number: z.string(),
    slug: z.string(),
    title: z.string(),
    lang: z.enum(['en', 'it']),
    order: z.number(),
    role: z.string(),
    location: z.string(),
    years: z.string(),
    sector: z.string(),
    founded: z.boolean().optional().default(false),
    meta: z.array(z.object({
      label: z.string(),
      value: z.string(),
    })).optional(),
    videoPath: z.string().optional(),
    videoTone: z.enum(['sage', 'terracotta']).optional(),
  }),
});

const mentors = defineCollection({
  loader: glob({
    pattern: '*.{en,it}.md',
    base: './src/content/mentors',
    generateId: ({ entry }) => entry.replace(/\.md$/, ''),
  }),
  schema: z.object({
    number: z.string(),
    slug: z.string(),
    name: z.string(),
    lang: z.enum(['en', 'it']),
    order: z.number(),
    role: z.string(),
    portrait: z.string().optional(),   // ← AGGIUNTO
    projectSlug: z.string().optional(),
    projectLabel: z.string().optional(),
  }),
});

export const collections = { competencies, projects, mentors };
