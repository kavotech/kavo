import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Insights articles live in src/content/insights/*.md.
 * Add a new Markdown file with this frontmatter to publish an article.
 */
const insights = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/insights' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    category: z.string(),
    /** Colour of the article's cover panel */
    cover: z.string().default('#d8ff3e'),
    coverInk: z.string().default('#0d0d0f'),
    featured: z.boolean().default(false),
  }),
});

export const collections = { insights };
