import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// "competencies" — 6 areas of practice (Think section)
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

// "projects" — 10 project cards (Make section)
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
  }),
});

// "mentors" — 4 maestri (Circle section)
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
    projectSlug: z.string().optional(),
    projectLabel: z.string().optional(),
  }),
});

export const collections = { competencies, projects, mentors };
