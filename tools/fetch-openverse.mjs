// Dev tool: scarica immagini CC da Openverse (api.openverse.org, no key), le converte
// in WebP self-hosted in /public. NON usato a runtime. Uso: node tools/fetch-openverse.mjs tools/<manifest>.json
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const UA = 'MoleDigitaleDemo/1.0 (https://www.moledigitale.it; info@moledigitale.it)';
const manifest = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const TOKEN = fs.existsSync('tools/_ov_token.txt') ? fs.readFileSync('tools/_ov_token.txt', 'utf8').trim() : '';

async function search(query, bad) {
  // solo licenze che permettono uso commerciale E modifiche (resize/crop): no ND, no NC
  const url = `https://api.openverse.org/v1/images/?q=${encodeURIComponent(query)}&license=cc0,pdm,by,by-sa&page_size=40&mature=false`;
  const r = await fetch(url, { headers: { 'User-Agent': UA, Accept: 'application/json', ...(TOKEN ? { Authorization: 'Bearer ' + TOKEN } : {}) } });
  if (!r.ok) throw new Error('search HTTP ' + r.status);
  const j = await r.json();
  const badRe = bad ? new RegExp(bad, 'i') : null;
  return (j.results || [])
    .filter((it) => it.url && /\.(jpe?g|png)(\?|$)/i.test(it.url))
    .filter((it) => !badRe || !badRe.test((it.title || '') + ' ' + (it.tags || []).map((t) => t.name).join(' ')))
    .map((it) => ({ url: it.url, title: it.title, lic: `${it.license} ${it.license_version || ''}`.trim(), src: it.source }));
}

async function download(u) {
  const r = await fetch(u, { headers: { 'User-Agent': UA }, redirect: 'follow', signal: AbortSignal.timeout(20000) });
  if (!r.ok) throw new Error('HTTP ' + r.status);
  const buf = Buffer.from(await r.arrayBuffer());
  if (buf.slice(0, 1).toString('hex') === '3c') throw new Error('HTML non img');
  if (buf.length < 6000) throw new Error('troppo piccola');
  return buf;
}

const credits = [];
for (const it of manifest.images) {
  let done = false;
  try {
    const cands = await search(it.query, it.bad);
    for (const c of cands.slice(0, 12)) {
      try {
        const buf = await download(c.url);
        let img = sharp(buf).rotate();
        if (it.w && it.h) img = img.resize(it.w, it.h, { fit: 'cover', position: it.pos || 'attention' });
        else if (it.w) img = img.resize(it.w);
        const outPath = path.join('public', it.out);
        fs.mkdirSync(path.dirname(outPath), { recursive: true });
        await img.webp({ quality: 80 }).toFile(outPath);
        const kb = Math.round(fs.statSync(outPath).size / 1024);
        console.log(`OK   ${it.out}  <= "${(c.title || '').slice(0, 50)}" [${c.lic} · ${c.src}] (${kb}KB)`);
        credits.push(`${it.out}: "${c.title}" — ${c.lic} via ${c.src} (Openverse) — ${c.url}`);
        done = true;
        break;
      } catch (e) { /* prova il prossimo */ }
    }
  } catch (e) { console.log(`ERR  ${it.out}  ${e.message}`); }
  if (!done) console.log(`FAIL ${it.out}  (query: ${it.query})`);
}
fs.writeFileSync('tools/_credits-openverse.txt', credits.join('\n') + '\n');
console.log('\n--- crediti in tools/_credits-openverse.txt ---');
