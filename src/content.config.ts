import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    // data di pubblicazione: resta fissa. Sul sito non si vede (le guide non invecchiano),
    // la usano solo i dati strutturati e il feed RSS.
    date: z.coerce.date(),
    // da mettere SOLO quando la guida cambia davvero (non per ritocchi): Google considera
    // scorretto ringiovanire le date di pagine appena toccate.
    updated: z.coerce.date().optional(),
    // anteprima social dedicata: senza, ogni articolo condiviso mostra la stessa immagine
    og: z.string().optional(),
  }),
});

export const collections = { blog };
