// Scarica N candidati da Openverse per una query, in temp, per sceglierli a mano.
// Uso: node tools/_faces.mjs "query" <count> <outdir> <w> <h> "<badRegex>"
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
const [query, countS, outdir, wS, hS, bad] = process.argv.slice(2);
const count = +countS, W = +wS, H = +hS;
const TOKEN = fs.existsSync('tools/_ov_token.txt') ? fs.readFileSync('tools/_ov_token.txt', 'utf8').trim() : '';
const UA = 'MoleDigitaleDemo/1.0';
fs.mkdirSync(outdir, { recursive: true });
const url = `https://api.openverse.org/v1/images/?q=${encodeURIComponent(query)}&license=cc0,pdm,by,by-sa&page_size=50&mature=false`;
const r = await fetch(url, { headers: { 'User-Agent': UA, Accept: 'application/json', Authorization: 'Bearer ' + TOKEN } });
const j = await r.json();
const badRe = bad ? new RegExp(bad, 'i') : null;
const cands = (j.results || [])
  .filter((it) => it.url && /\.(jpe?g|png)(\?|$)/i.test(it.url))
  .filter((it) => !badRe || !badRe.test((it.title || '') + ' ' + (it.tags || []).map((t) => t.name).join(' ')));
console.log(`candidati dopo filtro: ${cands.length} (su ${(j.results || []).length})`);
let n = 0;
for (const c of cands) {
  if (n >= count) break;
  try {
    const ir = await fetch(c.url, { headers: { 'User-Agent': UA }, redirect: 'follow', signal: AbortSignal.timeout(15000) });
    if (!ir.ok) continue;
    const buf = Buffer.from(await ir.arrayBuffer());
    if (buf.length < 8000 || buf.slice(0, 1).toString('hex') === '3c') continue;
    n++;
    await sharp(buf).rotate().resize(W, H, { fit: 'cover', position: 'attention' }).webp({ quality: 80 }).toFile(path.join(outdir, `c${n}.webp`));
    console.log(`c${n}  "${(c.title || '').slice(0, 46)}"  [${c.license} ${c.license_version || ''} · ${c.source}]  ${c.url}`);
  } catch (e) { console.log('  skip', e.name, e.message); }
}
console.log(`\n${n} candidati in ${outdir}`);
