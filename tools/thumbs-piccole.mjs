// Versione stretta (640 px) delle anteprime delle demo in public/img/thumbs/, salvata in
// public/img/thumbs/640/. Le pagine le offrono con srcset: un telefono o una colonna da 370 px
// scarica quella, non l'originale da 760 px (circa metà del peso).
// Da rilanciare quando aggiungi o rifai un'anteprima:  node tools/thumbs-piccole.mjs
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const DIR = 'public/img/thumbs';
const OUT = path.join(DIR, '640');
fs.mkdirSync(OUT, { recursive: true });

for (const f of fs.readdirSync(DIR).filter((n) => n.endsWith('.webp'))) {
  const dst = path.join(OUT, f);
  await sharp(path.join(DIR, f)).resize({ width: 640 }).webp({ quality: 78, effort: 6 }).toFile(dst);
  console.log(`${f}: ${Math.round(fs.statSync(path.join(DIR, f)).size / 1024)} KB → ${Math.round(fs.statSync(dst).size / 1024)} KB`);
}
