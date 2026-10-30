import * as THREE from "three";
import { rng } from "./shared";

/**
 * Procedural textures, generated once in the browser (no image files, no licensing).
 * Each getter caches its result. Maps are colour; bump maps carry the carved/chipped detail.
 */
export type TexPair = { map: THREE.CanvasTexture; bump: THREE.CanvasTexture };

const cache = new Map<string, unknown>();
const once = <T,>(key: string, make: () => T): T => {
  if (!cache.has(key)) cache.set(key, make());
  return cache.get(key) as T;
};

const mk = (w: number, h: number) => {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  return c;
};

function tex(c: HTMLCanvasElement, rx = 1, ry = 1, srgb = true) {
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(rx, ry);
  t.anisotropy = 4;
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/** Cheap repeat variant: shares the source image, so no canvas is redrawn. */
function rep(t: THREE.CanvasTexture, rx: number, ry: number) {
  const c = t.clone();
  c.repeat.set(rx, ry);
  c.needsUpdate = true;
  return c;
}

/** Per-pixel grain so flat colour reads as stone. */
function grain(c: HTMLCanvasElement, amount: number, seed: number) {
  const ctx = c.getContext("2d")!;
  const img = ctx.getImageData(0, 0, c.width, c.height);
  const r = rng(seed);
  for (let i = 0; i < img.data.length; i += 4) {
    const n = (r() - 0.5) * amount;
    img.data[i] += n;
    img.data[i + 1] += n;
    img.data[i + 2] += n;
  }
  ctx.putImageData(img, 0, 0);
}

type RGB = [number, number, number];

function stoneCanvases(size: number, rows: number, base: RGB, seed: number) {
  const r = rng(seed);
  const col = mk(size, size);
  const bmp = mk(size, size);
  const c = col.getContext("2d")!;
  const b = bmp.getContext("2d")!;
  c.fillStyle = `rgb(${base})`;
  c.fillRect(0, 0, size, size);
  b.fillStyle = "#808080";
  b.fillRect(0, 0, size, size);
  const rh = size / rows;
  for (let y = 0; y < rows; y++) {
    let x = -r() * (size / 3);
    while (x < size) {
      const w = (size / 3) * (0.6 + r() * 0.8);
      const v = (r() - 0.5) * 30;
      c.fillStyle = `rgb(${base[0] + v},${base[1] + v * 0.9},${base[2] + v * 0.75})`;
      c.fillRect(x, y * rh, w, rh);
      const g = 128 + (r() - 0.5) * 36;
      b.fillStyle = `rgb(${g},${g},${g})`;
      b.fillRect(x, y * rh, w, rh);
      // joints
      c.fillStyle = "rgba(60,38,18,0.6)";
      c.fillRect(x, y * rh, 2.5, rh);
      c.fillRect(x, y * rh, w, 2.5);
      b.fillStyle = "#101010";
      b.fillRect(x, y * rh, 3.5, rh);
      b.fillRect(x, y * rh, w, 3.5);
      // chips and pits
      for (let k = 0; k < 6; k++) {
        const px = x + r() * w, py = y * rh + r() * rh, pr = 1 + r() * 4;
        c.fillStyle = "rgba(70,45,22,0.25)";
        c.beginPath();
        c.arc(px, py, pr, 0, 6.3);
        c.fill();
        b.fillStyle = "rgba(20,20,20,0.7)";
        b.beginPath();
        b.arc(px, py, pr, 0, 6.3);
        b.fill();
      }
      x += w;
    }
  }
  // weathering streaks running down the wall
  for (let i = 0; i < 40; i++) {
    const x = r() * size;
    const g = c.createLinearGradient(0, 0, 0, size);
    g.addColorStop(0, "rgba(80,52,26,0)");
    g.addColorStop(0.5, `rgba(80,52,26,${0.05 + r() * 0.1})`);
    g.addColorStop(1, "rgba(80,52,26,0)");
    c.fillStyle = g;
    c.fillRect(x, 0, 2 + r() * 8, size);
  }
  grain(col, 22, seed + 1);
  grain(bmp, 30, seed + 2);
  return { col, bmp };
}

/** Coursed sandstone / limestone blocks. */
export function stoneTex(kind: "sandstone" | "limestone" = "sandstone", rx = 1, ry = 1): TexPair {
  const base = once(`stone-base-${kind}`, () => {
    const rgb: RGB = kind === "limestone" ? [226, 206, 162] : [212, 178, 124];
    const { col, bmp } = stoneCanvases(512, kind === "limestone" ? 10 : 7, rgb, kind === "limestone" ? 4 : 9);
    return { map: tex(col), bump: tex(bmp, 1, 1, false) };
  });
  return once(`stone-${kind}-${rx}-${ry}`, () => ({ map: rep(base.map, rx, ry), bump: rep(base.bump, rx, ry) }));
}

/** Wind-ripple sand for dunes. */
export function sandTex(rx = 40, ry = 120): TexPair {
  const base = once("sand-base", () => {
    const r = rng(21);
    const col = mk(512, 512);
    const bmp = mk(512, 512);
    const c = col.getContext("2d")!;
    const b = bmp.getContext("2d")!;
    c.fillStyle = "rgb(226,196,142)";
    c.fillRect(0, 0, 512, 512);
    b.fillStyle = "#808080";
    b.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 90; i++) {
      const y0 = r() * 512;
      const amp = 2 + r() * 6, f = 0.01 + r() * 0.02, ph = r() * 6.3;
      for (const [ctx, st, lw] of [
        [c, "rgba(255,236,190,0.28)", 1.6],
        [c, "rgba(120,80,40,0.18)", 1.2],
        [b, "rgba(230,230,230,0.5)", 2],
        [b, "rgba(30,30,30,0.5)", 1.5],
      ] as [CanvasRenderingContext2D, string, number][]) {
        ctx.strokeStyle = st;
        ctx.lineWidth = lw;
        ctx.beginPath();
        for (let x = 0; x <= 512; x += 8) {
          const y = y0 + Math.sin(x * f * 6.28 + ph) * amp + (st.includes("120") || st.includes("30,30") ? 2.5 : 0);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
    }
    grain(col, 26, 22);
    return { map: tex(col), bump: tex(bmp, 1, 1, false) };
  });
  return once(`sand-${rx}-${ry}`, () => ({ map: rep(base.map, rx, ry), bump: rep(base.bump, rx, ry) }));
}

type Glyph = (c: CanvasRenderingContext2D, s: number) => void;

/** Hieroglyph-style marks. Decorative, they do not spell words. */
const GLYPHS: Glyph[] = [
  (c, s) => { // eye
    c.beginPath(); c.ellipse(0, 0, s * 0.38, s * 0.17, 0, 0, 6.3); c.stroke();
    c.beginPath(); c.arc(0, 0, s * 0.09, 0, 6.3); c.fill();
    c.beginPath(); c.moveTo(0, s * 0.17); c.lineTo(-s * 0.1, s * 0.36); c.stroke();
  },
  (c, s) => { // ankh
    c.beginPath(); c.ellipse(0, -s * 0.2, s * 0.14, s * 0.19, 0, 0, 6.3); c.stroke();
    c.beginPath(); c.moveTo(0, -s * 0.01); c.lineTo(0, s * 0.4); c.moveTo(-s * 0.24, s * 0.08); c.lineTo(s * 0.24, s * 0.08); c.stroke();
  },
  (c, s) => { // bird
    c.beginPath(); c.ellipse(0, s * 0.05, s * 0.28, s * 0.14, -0.2, 0, 6.3); c.stroke();
    c.beginPath(); c.arc(s * 0.26, -s * 0.12, s * 0.08, 0, 6.3); c.fill();
    c.beginPath(); c.moveTo(s * 0.33, -s * 0.12); c.lineTo(s * 0.42, -s * 0.08); c.moveTo(-s * 0.05, s * 0.18); c.lineTo(-s * 0.08, s * 0.38); c.moveTo(s * 0.08, s * 0.18); c.lineTo(s * 0.1, s * 0.38); c.stroke();
  },
  (c, s) => { // reeds
    for (const dx of [-0.14, 0, 0.14]) { c.beginPath(); c.moveTo(dx * s, s * 0.38); c.quadraticCurveTo(dx * s * 1.6, 0, dx * s * 2, -s * 0.38); c.stroke(); }
  },
  (c, s) => { // water
    for (const y of [-0.2, 0, 0.2]) { c.beginPath(); c.moveTo(-s * 0.36, y * s); c.lineTo(-s * 0.18, (y - 0.08) * s); c.lineTo(0, y * s); c.lineTo(s * 0.18, (y - 0.08) * s); c.lineTo(s * 0.36, y * s); c.stroke(); }
  },
  (c, s) => { // sun disc
    c.beginPath(); c.arc(0, 0, s * 0.3, 0, 6.3); c.stroke();
    c.beginPath(); c.arc(0, 0, s * 0.07, 0, 6.3); c.fill();
  },
  (c, s) => { // scarab
    c.beginPath(); c.ellipse(0, 0, s * 0.2, s * 0.28, 0, 0, 6.3); c.stroke();
    c.beginPath(); c.moveTo(0, -s * 0.28); c.lineTo(0, s * 0.28); c.moveTo(-s * 0.2, 0); c.lineTo(s * 0.2, 0); c.moveTo(-s * 0.2, -s * 0.12); c.lineTo(-s * 0.36, -s * 0.2); c.moveTo(s * 0.2, -s * 0.12); c.lineTo(s * 0.36, -s * 0.2); c.stroke();
  },
  (c, s) => { // cartouche
    c.beginPath(); c.roundRect(-s * 0.18, -s * 0.38, s * 0.36, s * 0.76, s * 0.18); c.stroke();
    c.beginPath(); c.moveTo(-s * 0.1, -s * 0.15); c.lineTo(-s * 0.1, s * 0.15); c.moveTo(s * 0.1, -s * 0.15); c.lineTo(s * 0.1, s * 0.15); c.stroke();
  },
  (c, s) => { // snake
    c.beginPath(); for (let i = 0; i <= 20; i++) { const x = -s * 0.38 + i * s * 0.038; const y = Math.sin(i * 0.7) * s * 0.12; if (i) c.lineTo(x, y); else c.moveTo(x, y); } c.stroke();
  },
  (c, s) => { // seated figure
    c.beginPath(); c.arc(0, -s * 0.28, s * 0.09, 0, 6.3); c.fill();
    c.beginPath(); c.rect(-s * 0.1, -s * 0.18, s * 0.2, s * 0.38); c.stroke();
    c.beginPath(); c.moveTo(-s * 0.1, s * 0.2); c.lineTo(s * 0.26, s * 0.2); c.moveTo(s * 0.1, -s * 0.05); c.lineTo(s * 0.28, -s * 0.12); c.stroke();
  },
  (c, s) => { // feather
    c.beginPath(); c.ellipse(0, 0, s * 0.11, s * 0.36, 0, 0, 6.3); c.stroke();
    c.beginPath(); c.moveTo(0, -s * 0.36); c.lineTo(0, s * 0.4); c.stroke();
  },
  (c, s) => { // arm
    c.beginPath(); c.moveTo(-s * 0.34, s * 0.1); c.lineTo(s * 0.1, s * 0.1); c.lineTo(s * 0.34, -s * 0.1); c.stroke();
    c.beginPath(); c.rect(s * 0.1, -s * 0.2, s * 0.24, s * 0.1); c.stroke();
  },
];

function drawGlyph(ctx: CanvasRenderingContext2D, idx: number, x: number, y: number, s: number, dark: string, light: string | null) {
  ctx.save();
  ctx.translate(x, y);
  ctx.lineWidth = Math.max(1.5, s * 0.055);
  ctx.lineCap = ctx.lineJoin = "round";
  if (light) {
    ctx.strokeStyle = ctx.fillStyle = light;
    ctx.save();
    ctx.translate(s * 0.03, s * 0.03);
    GLYPHS[idx % GLYPHS.length](ctx, s);
    ctx.restore();
  }
  ctx.strokeStyle = ctx.fillStyle = dark;
  GLYPHS[idx % GLYPHS.length](ctx, s);
  ctx.restore();
}

/** Tall panel of carved hieroglyph-style columns (obelisk faces, column shafts, wall bands). */
export function reliefTex(rx = 1, ry = 1, cols = 2, rows = 14): TexPair {
  const base = once(`relief-base-${cols}-${rows}`, () => {
    const W = 128 * cols;
    const H = Math.round((W / cols) * rows);
    const cell = W / cols;
    const col = mk(W, H);
    const bmp = mk(W, H);
    const c = col.getContext("2d")!;
    const b = bmp.getContext("2d")!;
    const base = stoneCanvases(Math.max(W, 256), 6, [214, 182, 130], 31);
    c.drawImage(base.col, 0, 0, W, H);
    b.fillStyle = "#909090";
    b.fillRect(0, 0, W, H);
    const r = rng(77);
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const gi = Math.floor(r() * GLYPHS.length);
        const x = i * cell + cell / 2, y = j * cell + cell / 2;
        drawGlyph(c, gi, x, y, cell * 0.78, "rgba(72,46,22,0.85)", "rgba(255,238,200,0.35)");
        drawGlyph(b, gi, x, y, cell * 0.78, "rgb(20,20,20)", "rgba(220,220,220,0.5)");
      }
      // column dividers
      c.fillStyle = "rgba(72,46,22,0.5)";
      c.fillRect(i * cell, 0, 2, H);
      b.fillStyle = "#202020";
      b.fillRect(i * cell, 0, 3, H);
    }
    return { map: tex(col), bump: tex(bmp, 1, 1, false) };
  });
  return once(`relief-${rx}-${ry}-${cols}-${rows}`, () => ({ map: rep(base.map, rx, ry), bump: rep(base.bump, rx, ry) }));
}

/** Painted tomb-wall frieze: glyph band, procession of figures in profile, colour bands. Original drawing, no real artwork copied. */
export function paintedWallTex(): THREE.CanvasTexture {
  return once("painted-wall", () => {
    const W = 2048, H = 512;
    const cv = mk(W, H);
    const c = cv.getContext("2d")!;
    const r = rng(5);
    const bg = c.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, "#c98f43");
    bg.addColorStop(1, "#b97c35");
    c.fillStyle = bg;
    c.fillRect(0, 0, W, H);

    // top glyph band
    c.fillStyle = "rgba(40,24,10,0.9)";
    c.fillRect(0, 54, W, 4);
    c.fillRect(0, 132, W, 4);
    for (let i = 0; i < 36; i++) drawGlyph(c, i * 5 + (r() * 3 | 0), 30 + i * 56, 94, 62, "rgba(35,20,8,0.9)", null);

    // procession
    const palette = ["#1e3a8a", "#b2432d", "#2a9d96", "#e8d5b0"];
    for (let i = 0; i < 9; i++) {
      const x = 80 + i * 222, y = 160;
      const skin = i % 3 === 1 ? "#d6a15e" : "#a4502f";
      // legs
      c.fillStyle = skin;
      c.fillRect(x + 36, y + 190, 16, 120);
      c.fillRect(x + 58, y + 190, 16, 120);
      // kilt
      c.fillStyle = "#f2e8d2";
      c.beginPath(); c.moveTo(x + 24, y + 150); c.lineTo(x + 92, y + 150); c.lineTo(x + 100, y + 220); c.lineTo(x + 22, y + 220); c.fill();
      // torso
      c.fillStyle = skin;
      c.beginPath(); c.moveTo(x + 28, y + 60); c.lineTo(x + 88, y + 60); c.lineTo(x + 80, y + 150); c.lineTo(x + 34, y + 150); c.fill();
      // collar
      c.fillStyle = palette[i % 4];
      c.beginPath(); c.arc(x + 58, y + 62, 30, 0, Math.PI); c.fill();
      c.fillStyle = "#e2b24a";
      c.beginPath(); c.arc(x + 58, y + 62, 22, 0, Math.PI); c.fill();
      // arm holding offering or staff
      c.strokeStyle = skin; c.lineWidth = 12;
      c.beginPath(); c.moveTo(x + 40, y + 78); c.lineTo(x + 8, y + 128); c.stroke();
      if (i % 2) { c.strokeStyle = "#3a2410"; c.lineWidth = 6; c.beginPath(); c.moveTo(x + 4, y - 10); c.lineTo(x + 6, y + 320); c.stroke(); }
      else { c.fillStyle = palette[(i + 1) % 4]; c.fillRect(x - 12, y + 112, 36, 24); }
      // head in profile with wig
      c.fillStyle = skin;
      c.beginPath(); c.ellipse(x + 62, y + 30, 20, 26, 0, 0, 6.3); c.fill();
      c.fillStyle = "#1a120c";
      c.beginPath(); c.moveTo(x + 36, y + 24); c.quadraticCurveTo(x + 58, y - 14, x + 84, y + 24); c.lineTo(x + 78, y + 70); c.lineTo(x + 42, y + 56); c.fill();
      // eye
      c.fillStyle = "#f4ecd8"; c.beginPath(); c.ellipse(x + 72, y + 28, 6, 3.5, 0, 0, 6.3); c.fill();
      c.fillStyle = "#111"; c.beginPath(); c.arc(x + 73, y + 28, 1.8, 0, 6.3); c.fill();
      // outline
      c.strokeStyle = "rgba(25,14,6,0.9)"; c.lineWidth = 3;
      c.strokeRect(x + 24, y + 60, 64, 90);
    }
    // ground stripes
    const bands = ["#1e3a8a", "#e8d5b0", "#b2432d", "#e2b24a", "#2a9d96"];
    bands.forEach((col, i) => { c.fillStyle = col; c.fillRect(0, 470 + i * 8, W, 8); });
    c.fillStyle = "rgba(35,20,8,0.9)";
    c.fillRect(0, 466, W, 4);
    // worn paint
    const img = c.getImageData(0, 0, W, H);
    for (let i = 0; i < img.data.length; i += 4) {
      const n = (r() - 0.5) * 24;
      img.data[i] += n; img.data[i + 1] += n; img.data[i + 2] += n;
    }
    c.putImageData(img, 0, 0);
    for (let i = 0; i < 60; i++) {
      c.fillStyle = `rgba(60,40,20,${0.04 + r() * 0.08})`;
      c.fillRect(r() * W, r() * H, 20 + r() * 120, 3 + r() * 30);
    }
    return tex(cv, 1, 1);
  });
}
