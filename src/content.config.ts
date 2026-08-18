import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    // anteprima social dedicata: senza, ogni articolo condiviso mostra la stessa immagine
    og: z.string().optional(),
  }),
});

export const collections = { blog };
