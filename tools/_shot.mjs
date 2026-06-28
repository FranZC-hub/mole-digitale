// Dev tool: screenshot affidabili via CDP (Edge remote-debugging). Uso:
//   node tools/_shot.mjs <port> "url|outfile" "url|outfile" ...
import fs from 'node:fs';

const DBG = +process.argv[2];
const jobs = process.argv.slice(3).map((s) => { const i = s.indexOf('|'); return [s.slice(0, i), s.slice(i + 1)]; });
const W = +process.env.SW || 1280, H = +process.env.SH || 900;
const MOBILE = process.env.SW && +process.env.SW < 600;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function cdp(ws) {
  let id = 0; const pend = new Map(); const subs = [];
  ws.addEventListener('message', (ev) => {
    const m = JSON.parse(ev.data);
    if (m.id && pend.has(m.id)) { pend.get(m.id)(m.result); pend.delete(m.id); }
    else if (m.method) subs.forEach((f) => f(m));
  });
  return {
    send: (method, params = {}) => new Promise((res) => { const i = ++id; pend.set(i, res); ws.send(JSON.stringify({ id: i, method, params })); }),
    on: (f) => subs.push(f),
  };
}

async function shot(url, out) {
  const t = await (await fetch(`http://127.0.0.1:${DBG}/json/new?${encodeURIComponent(url)}`, { method: 'PUT' })).json();
  const ws = new WebSocket(t.webSocketDebuggerUrl);
  await new Promise((r) => ws.addEventListener('open', r));
  const c = cdp(ws);
  let loaded = false; c.on((m) => { if (m.method === 'Page.loadEventFired') loaded = true; });
  await c.send('Page.enable');
  const VH = Math.min(H, 900); // viewport reale (per non gonfiare 100vh); il clip può essere più alto
  await c.send('Emulation.setDeviceMetricsOverride', { width: W, height: VH, deviceScaleFactor: 1, mobile: MOBILE });
  await c.send('Page.navigate', { url });
  for (let i = 0; i < 80 && !loaded; i++) await sleep(100);
  await sleep(1600); // reveal/animations settle
  const r = await c.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true, clip: { x: 0, y: 0, width: W, height: H, scale: 1 } });
  fs.writeFileSync(out, Buffer.from(r.data, 'base64'));
  console.log('OK', out, fs.statSync(out).size + 'B');
  ws.close();
  await fetch(`http://127.0.0.1:${DBG}/json/close/${t.id}`).catch(() => {});
}

for (const [url, out] of jobs) { try { await shot(url, out); } catch (e) { console.log('FAIL', out, e.message); } }
process.exit(0);
