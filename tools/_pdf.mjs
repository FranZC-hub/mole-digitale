// Genera un PDF da una pagina via CDP (Edge headless). Uso: node tools/_pdf.mjs <port> <url> <outfile>
import fs from 'node:fs';
const DBG = +process.argv[2], URL_ = process.argv[3], OUT = process.argv[4];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
function cdp(ws){ let id=0; const p=new Map(),s=[]; ws.addEventListener('message',(e)=>{const m=JSON.parse(e.data); if(m.id&&p.has(m.id)){p.get(m.id)(m.result||m.error);p.delete(m.id);} else if(m.method) s.forEach(f=>f(m));}); return {send:(method,params={})=>new Promise(r=>{const i=++id;p.set(i,r);ws.send(JSON.stringify({id:i,method,params}));}),on:f=>s.push(f)}; }
const t = await (await fetch(`http://127.0.0.1:${DBG}/json/new?${encodeURIComponent(URL_)}`, { method: 'PUT' })).json();
const ws = new WebSocket(t.webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener('open', r));
const c = cdp(ws);
let loaded = false; c.on((m) => { if (m.method === 'Page.loadEventFired') loaded = true; });
await c.send('Page.enable');
await c.send('Page.navigate', { url: URL_ });
for (let i = 0; i < 100 && !loaded; i++) await sleep(100);
await sleep(2200); // attende il caricamento del QR remoto
const r = await c.send('Page.printToPDF', { printBackground: true, preferCSSPageSize: true, marginTop: 0, marginBottom: 0, marginLeft: 0, marginRight: 0 });
fs.writeFileSync(OUT, Buffer.from(r.data, 'base64'));
console.log('PDF', OUT, fs.statSync(OUT).size + ' bytes');
ws.close();
await fetch(`http://127.0.0.1:${DBG}/json/close/${t.id}`).catch(() => {});
process.exit(0);
