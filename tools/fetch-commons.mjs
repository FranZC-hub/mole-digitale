// Dev tool: scarica immagini reali (licenze libere) da Wikimedia Commons,
// le converte in WebP self-hosted e le salva in /public. NON usato a runtime.
// Uso: node tools/fetch-commons.mjs tools/<manifest>.json
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const UA = 'MoleDigitaleDemo/1.0 (https://www.moledigitale.it; info@moledigitale.it)';
const manifest = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
// Esclude grafica non-foto E foto d'archivio/museo (look "da catalogo archeologico")
const BAD = /(map|chart|diagram|logo|icon|graph|seal|coat of arms|svg|location|findid|\bfind\b|archaeolog|ancient|minoan|mycenae|\broman\b|etruscan|egyptian|bronze age|iron age|\bbce\b|\bbc\b|\d{3,4}\s?ad|century|hoard|intaglio|museum|excavat|\bruler\b|scale bar|\bcms?\b|\btomb\b|antiquit|medieval|relic|artifact|artefact|drawing|illustration|engraving|\bprint\b|sketch|painting|woodcut|etching|lithograph|portrait|stamp|banknote|rolex|omega|replica|\bfake\b|\bcopy\b|illegal|counterfeit|novelty|cartoon|disney|character|campbell|soup|toy)/i;

async function searchFile(query) {
  const url = `https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query + ' filetype:bitmap')}&srnamespace=6&srlimit=15&format=json`;
  const r = await fetch(url, { headers: { 'User-Agent': UA } });
  const j = await r.json();
  const hits = (j.query?.search || []).map((s) => s.title.replace(/^File:/, ''));
  return hits.filter((t) => /\.(jpe?g|png)$/i.test(t) && !BAD.test(t));
}
async function download(file, width) {
  const url = `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=${width}`;
  const r = await fetch(url, { headers: { 'User-Agent': UA }, redirect: 'follow' });
  if (!r.ok) throw new Error('HTTP ' + r.status);
  const buf = Buffer.from(await r.arrayBuffer());
  if (buf.slice(0, 1).toString('hex') === '3c') throw new Error('got HTML not image'); // '<'
  return buf;
}

const credits = [];
for (const it of manifest.images) {
  try {
    const candidates = it.file ? [it.file] : await searchFile(it.query);
    let done = false;
    for (const file of candidates.slice(0, 5)) {
      try {
        const buf = await download(file, Math.max((it.w || 1200) * 1.4, 1400));
        let img = sharp(buf).rotate();
        if (it.w && it.h) img = img.resize(it.w, it.h, { fit: 'cover', position: it.pos || 'attention' });
        else if (it.w) img = img.resize(it.w);
        const outPath = path.join('public', it.out);
        fs.mkdirSync(path.dirname(outPath), { recursive: true });
        await img.webp({ quality: 78 }).toFile(outPath);
        const kb = Math.round(fs.statSync(outPath).size / 1024);
        console.log(`OK   ${it.out}  <= "${file}"  (${kb}KB)`);
        credits.push(`${it.out}: ${file} — Wikimedia Commons`);
        done = true; break;
      } catch (e) { /* prova il prossimo candidato */ }
    }
    if (!done) console.log(`FAIL ${it.out}  (query: ${it.query})`);
  } catch (e) { console.log(`FAIL ${it.out}  ${e.message}`); }
}
fs.writeFileSync('tools/_credits.txt', credits.join('\n') + '\n');
console.log('\n--- crediti salvati in tools/_credits.txt ---');
