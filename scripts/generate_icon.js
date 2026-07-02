const zlib = require('zlib');
const fs = require('fs');
const path = require('path');

const W = 1024, H = 1024;

function crc32(buf) {
  let c = ~0;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let j = 0; j < 8; j++) c = (c >>> 1) ^ (0xEDB88320 & -(c & 1));
  }
  return (~c) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const typeData = Buffer.concat([Buffer.from(type), data]);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(typeData));
  return Buffer.concat([len, typeData, crc]);
}

function makePNG(pixels, w, h) {
  const sig = Buffer.from([137,80,78,71,13,10,26,10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8; ihdr[9] = 6; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;
  const raw = Buffer.alloc(w * h * 4 + h);
  let pos = 0;
  for (let y = 0; y < h; y++) {
    raw[pos++] = 0;
    for (let x = 0; x < w; x++) {
      const idx = (y * w + x) * 4;
      raw[pos++] = pixels[idx];
      raw[pos++] = pixels[idx + 1];
      raw[pos++] = pixels[idx + 2];
      raw[pos++] = pixels[idx + 3];
    }
  }
  const idat = zlib.deflateSync(raw, { level: 9 });
  return Buffer.concat([sig, chunk('IHDR', ihdr), chunk('IDAT', idat), chunk('IEND', Buffer.alloc(0))]);
}

function lerp(a, b, t) { return a + (b - a) * t; }
function lerpC(c1, c2, t) { return [lerp(c1[0],c2[0],t), lerp(c1[1],c2[1],t), lerp(c1[2],c2[2],t)]; }

function setPx(px, x, y, c, alpha = 1) {
  if (x < 0 || x >= W || y < 0 || y >= H) return;
  const idx = (y * W + x) * 4;
  px[idx] = Math.round(c[0] * alpha + px[idx] * (1 - alpha));
  px[idx+1] = Math.round(c[1] * alpha + px[idx+1] * (1 - alpha));
  px[idx+2] = Math.round(c[2] * alpha + px[idx+2] * (1 - alpha));
  px[idx+3] = 255;
}

function circle(px, cx, cy, r, color) {
  for (let y = Math.max(0, Math.floor(cy-r-2)); y < Math.min(H, Math.ceil(cy+r+2)); y++) {
    for (let x = Math.max(0, Math.floor(cx-r-2)); x < Math.min(W, Math.ceil(cx+r+2)); x++) {
      const d = Math.sqrt((x-cx)**2 + (y-cy)**2);
      if (d <= r) {
        const a = d > r - 1.5 ? Math.max(0, (r - d) / 1.5) : 1;
        setPx(px, x, y, color, a);
      }
    }
  }
}

function ring(px, cx, cy, r, thick, color) {
  for (let y = Math.max(0, Math.floor(cy-r-thick)); y < Math.min(H, Math.ceil(cy+r+thick)); y++) {
    for (let x = Math.max(0, Math.floor(cx-r-thick)); x < Math.min(W, Math.ceil(cx+r+thick)); x++) {
      const d = Math.sqrt((x-cx)**2 + (y-cy)**2);
      if (d >= r - thick && d <= r) setPx(px, x, y, color);
    }
  }
}

const BG_TOP = [30, 80, 100], BG_BOTTOM = [15, 45, 65];
const GOLD = [212, 175, 55], GOLD_LT = [230, 200, 100];
const CREAM = [250, 245, 230];
const cx = W/2, cy = H/2;

const px = Buffer.alloc(W * H * 4);
// Radial gradient bg
const maxD = Math.sqrt(cx*cx + cy*cy);
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const d = Math.sqrt((x-cx)**2 + (y-cy)**2);
    const t = Math.min(1, (d/maxD) * 1.3);
    const c = lerpC(BG_TOP, BG_BOTTOM, t);
    const idx = (y * W + x) * 4;
    px[idx] = c[0]; px[idx+1] = c[1]; px[idx+2] = c[2]; px[idx+3] = 255;
  }
}

// Decorative rings
ring(px, cx, cy, 380, 4, GOLD);
ring(px, cx, cy, 340, 2, GOLD_LT);

// Tasbih beads
const numBeads = 33, beadR = 28, beadRingR = 300;
for (let i = 0; i < numBeads; i++) {
  const angle = (i / numBeads) * 2 * Math.PI - Math.PI / 2;
  const bx = cx + beadRingR * Math.cos(angle);
  const by = cy + beadRingR * Math.sin(angle);
  const br = i % 11 === 0 ? beadR + 6 : beadR;
  const col = i % 11 === 0 ? GOLD : GOLD_LT;
  circle(px, bx, by, br, col);
  circle(px, bx - br*0.3, by - br*0.3, br * 0.4, [255, 250, 230]);
}

// Center tawaf stone
circle(px, cx, cy, 70, GOLD);
circle(px, cx, cy, 60, GOLD_LT);
circle(px, cx - 18, cy - 18, 25, [255, 250, 230]);

// Crescent moon
circle(px, cx, cy - 130, 45, CREAM);
circle(px, cx + 18, cy - 138, 38, BG_BOTTOM);

// Star
circle(px, cx, cy + 130, 8, GOLD_LT);
for (let a = 0; a < 360; a += 45) {
  const rad = a * Math.PI / 180;
  circle(px, cx + 16*Math.cos(rad), cy + 130 + 16*Math.sin(rad), 3, GOLD_LT);
}

const assetsDir = path.join(__dirname, '..', 'assets');

// Main icon
fs.writeFileSync(path.join(assetsDir, 'icon.png'), makePNG(px, W, H));
console.log('Generated icon.png');

// Favicon 128x128
const favPx = Buffer.alloc(128*128*4);
const fs_ = 128/W;
for (let y = 0; y < 128; y++)
  for (let x = 0; x < 128; x++) {
    const si = (Math.floor(y/fs_) * W + Math.floor(x/fs_)) * 4;
    const di = (y * 128 + x) * 4;
    favPx[di] = px[si]; favPx[di+1] = px[si+1]; favPx[di+2] = px[si+2]; favPx[di+3] = px[si+3];
  }
fs.writeFileSync(path.join(assetsDir, 'favicon.png'), makePNG(favPx, 128, 128));
console.log('Generated favicon.png');

// Splash icon 200x200
const spPx = Buffer.alloc(200*200*4);
const ss = 200/W;
for (let y = 0; y < 200; y++)
  for (let x = 0; x < 200; x++) {
    const si = (Math.floor(y/ss) * W + Math.floor(x/ss)) * 4;
    const di = (y * 200 + x) * 4;
    spPx[di] = px[si]; spPx[di+1] = px[si+1]; spPx[di+2] = px[si+2]; spPx[di+3] = px[si+3];
  }
fs.writeFileSync(path.join(assetsDir, 'splash-icon.png'), makePNG(spPx, 200, 200));
console.log('Generated splash-icon.png');

// Adaptive icon foreground (transparent bg, beads only)
const fgPx = Buffer.alloc(W * H * 4);
for (let i = 3; i < fgPx.length; i += 4) fgPx[i] = 0;

for (let i = 0; i < numBeads; i++) {
  const angle = (i / numBeads) * 2 * Math.PI - Math.PI / 2;
  const bx = cx + beadRingR * Math.cos(angle);
  const by = cy + beadRingR * Math.sin(angle);
  const br = i % 11 === 0 ? beadR + 6 : beadR;
  const col = i % 11 === 0 ? GOLD : GOLD_LT;
  circle(fgPx, bx, by, br, col);
  circle(fgPx, bx - br*0.3, by - br*0.3, br * 0.4, [255, 250, 230]);
}
circle(fgPx, cx, cy, 70, GOLD);
circle(fgPx, cx, cy, 60, GOLD_LT);
circle(fgPx, cx - 18, cy - 18, 25, [255, 250, 230]);
circle(fgPx, cx, cy - 130, 45, CREAM);
// Crescent cutout
for (let y = Math.max(0, Math.floor(cy-180)); y < Math.min(H, Math.ceil(cy-80)); y++)
  for (let x = Math.max(0, Math.floor(cx-50)); x < Math.min(W, Math.ceil(cx+50)); x++) {
    const d1 = Math.sqrt((x-cx)**2 + (y-(cy-130))**2);
    const d2 = Math.sqrt((x-(cx+18))**2 + (y-(cy-138))**2);
    if (d1 <= 45 && d2 <= 38) {
      const idx = (y * W + x) * 4;
      fgPx[idx] = 0; fgPx[idx+1] = 0; fgPx[idx+2] = 0; fgPx[idx+3] = 0;
    }
  }

fs.writeFileSync(path.join(assetsDir, 'android-icon-foreground.png'), makePNG(fgPx, W, H));
console.log('Generated android-icon-foreground.png');

console.log('All icons generated!');
