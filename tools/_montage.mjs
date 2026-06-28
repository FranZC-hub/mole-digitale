// Crea un montaggio a griglia di immagini per valutarle in un colpo solo.
// Uso: node tools/_montage.mjs out.png <cols> img1 img2 ...
import sharp from 'sharp';
const [out, colsS, ...imgs] = process.argv.slice(2);
const cols = +colsS, TW = 260, TH = 320, GAP = 6, PAD = 6;
const rows = Math.ceil(imgs.length / cols);
const W = PAD * 2 + cols * TW + (cols - 1) * GAP;
const H = PAD * 2 + rows * TH + (rows - 1) * GAP;
const base = sharp({ create: { width: W, height: H, channels: 3, background: '#222' } });
const comps = [];
for (let i = 0; i < imgs.length; i++) {
  const c = i % cols, r = Math.floor(i / cols);
  const left = PAD + c * (TW + GAP), top = PAD + r * (TH + GAP);
  try {
    const buf = await sharp(imgs[i]).resize(TW, TH, { fit: 'cover' }).png().toBuffer();
    comps.push({ input: buf, left, top });
    // etichetta col nome file
    const name = imgs[i].split(/[\\/]/).pop();
    const lbl = Buffer.from(`<svg width="${TW}" height="22"><rect width="${TW}" height="22" fill="black" opacity="0.6"/><text x="6" y="15" fill="white" font-family="sans-serif" font-size="13">${i + 1}. ${name}</text></svg>`);
    comps.push({ input: lbl, left, top: top + TH - 22 });
  } catch (e) { console.log('skip', imgs[i], e.message); }
}
await base.composite(comps).png().toFile(out);
console.log('montaggio:', out, `${W}x${H}`);
