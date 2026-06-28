// Auditor overflow responsive via CDP. Uso: node tools/_diag.mjs <port> <baseUrl> <w1,w2,...> <path1> <path2> ...
const DBG = +process.argv[2], BASE = process.argv[3];
const WIDTHS = process.argv[4].split(',').map(Number);
const PATHS = process.argv.slice(5);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
function cdp(ws){ let id=0; const p=new Map(),s=[]; ws.addEventListener('message',(e)=>{const m=JSON.parse(e.data); if(m.id&&p.has(m.id)){p.get(m.id)(m.result||m.error);p.delete(m.id);} else if(m.method) s.forEach(f=>f(m));}); return {send:(method,params={})=>new Promise(r=>{const i=++id;p.set(i,r);ws.send(JSON.stringify({id:i,method,params}));}),on:f=>s.push(f)}; }

const AUDIT = [
  '(function(){var cw=document.documentElement.clientWidth,sw=document.documentElement.scrollWidth;var off=[];',
  'if(sw>cw+1){var all=document.querySelectorAll("*");for(var i=0;i<all.length;i++){var r=all[i].getBoundingClientRect();',
  'if(r.right>cw+1&&r.width>0&&r.width<=sw){off.push((all[i].tagName.toLowerCase())+(all[i].className&&typeof all[i].className==="string"?"."+all[i].className.trim().split(/\\s+/).slice(0,2).join("."):"")+" right="+Math.round(r.right));}}}',
  'var hox=getComputedStyle(document.documentElement).overflowX,box=getComputedStyle(document.body).overflowX;',
  'var canScroll=document.documentElement.scrollLeft;document.documentElement.scrollLeft=9999;var did=document.documentElement.scrollLeft>0;document.documentElement.scrollLeft=canScroll;',
  'return JSON.stringify({cw:cw,sw:sw,over:sw-cw,hox:hox,box:box,scrollable:did,off:off.slice(0,4)});})()'
].join('');

for (const path of PATHS) {
  const url = BASE + path;
  const t = await (await fetch(`http://127.0.0.1:${DBG}/json/new?${encodeURIComponent(url)}`,{method:'PUT'})).json();
  const ws = new WebSocket(t.webSocketDebuggerUrl);
  await new Promise(r=>ws.addEventListener('open',r));
  const c = cdp(ws);
  await c.send('Page.enable'); await c.send('Runtime.enable');
  const errs=[]; c.on(m=>{ if(m.method==='Runtime.exceptionThrown') errs.push('EXC:'+(m.params.exceptionDetails.exception?.description||m.params.exceptionDetails.text||'').slice(0,80)); });
  let line = path.padEnd(22);
  for (const w of WIDTHS) {
    await c.send('Emulation.setDeviceMetricsOverride',{width:w,height:880,deviceScaleFactor:1,mobile:w<600});
    if (w===WIDTHS[0]) { await c.send('Page.navigate',{url}); await sleep(1800); } else { await sleep(500); }
    const res = await c.send('Runtime.evaluate',{expression:AUDIT,returnByValue:true});
    let o; try { o=JSON.parse(res.result.value); } catch { o={cw:'?',sw:'?',over:'?',off:[]}; }
    const flag = o.scrollable ? `SCROLL+${o.over}` : (o.over>1 ? `hidden(${o.over})` : 'ok');
    line += ` | ${w}:${flag}`;
    if (o.scrollable && o.off.length) line += ` [${o.off[0]}]`;
  }
  console.log(line + (errs.length?`  ⚠ ${errs[0]}`:''));
  ws.close(); await fetch(`http://127.0.0.1:${DBG}/json/close/${t.id}`).catch(()=>{});
}
process.exit(0);
