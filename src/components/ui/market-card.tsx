"use client";

// Market Card by Louis Studios (21st.dev)
// Interactive scrubbable curve card with dynamic bicubic glow field, odometer digits & delta chip.

import * as React from "react";

export interface MarketCardProps {
  data?: number[];
  value?: string;
  format?: (value: number) => string;
  label?: string;
  deltaLabel?: string;
  deltaMode?: "previous" | "first";
  index?: number;
  defaultIndex?: number;
  onIndexChange?: (index: number) => void;
  accent?: string;
  cardColor?: string;
  textColor?: string;
  lineColor?: string;
  downColor?: string;
  upColor?: string;
  background?: string;
  grid?: boolean;
  fill?: number;
  interactive?: boolean;
  revealed?: boolean;
  menu?: boolean;
  onMenu?: () => void;
  font?: string;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const CW = 499;
const CH = 203;
const RADIUS = 27;
const FILL_TALL = 0.86;
const DEFAULT_FONT =
  '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", "Segoe UI", Roboto, Arial, sans-serif';
const DEFAULT_DATA = [
  1680, 1740, 1810, 1890, 1940, 2020, 2110, 2190, 2260, 2340, 2410, 2490, 2560, 2640,
];

const X0F = 0.455411;
const X1F = 1.014863;
const YTOPF = 0.444408;
const YBOTF = 0.898283;
const TENSION = 1.2;
const LINE_W = 6.4;
const RING_R = 7;
const RING_W = 4;

const BASE = 0.8555;
const PAD_X = 26.5;
const LABEL_SIZE = 18.4;
const LABEL_BASE = 33;
const FIG_SIZE = 74;
const FIG_BASE = 132;
const FIG_TRACK = -0.0217;
const FIG_CURRENCY_KERN = 0.027;
const ONE_FOOT = { left: 0.0435, width: 0.467, height: 0.087, extra: 0.114 };
const CAP_SIZE = 12.1;
const CAP_LH = 13.4;
const CAP_BASE = 170.5;
const CHIP_SIZE = 11;
const CHIP_H = 23;
const CHIP_GAP = 27.5;

const GX = 18;
const GY = 8;
const GLOW_T = [
  0.2, -0.052, -0.017, -0.038, 0.07, 0.249, 0.487, 0.647, 0.886, 1.019, 0.998, 1.008, 1.005, 1.004,
  1.001, 1.002, 0.999, 0.999, 0.012, 0.096, 0.12, 0.171, 0.243, 0.31, 0.573, 0.7, 0.85, 0.933,
  0.948, 0.95, 0.957, 0.966, 0.979, 0.99, 0.996, 0.999, 0.133, 0.126, 0.154, 0.171, 0.234, 0.261,
  0.415, 0.619, 0.699, 0.772, 0.793, 0.81, 0.83, 0.865, 0.913, 0.949, 0.981, 0.997, 0.072, 0.103,
  0.128, 0.162, 0.212, 0.27, 0.357, 0.487, 0.576, 0.61, 0.619, 0.637, 0.672, 0.718, 0.79, 0.89,
  0.947, 0.978, 0.088, 0.089, 0.108, 0.136, 0.175, 0.218, 0.278, 0.35, 0.413, 0.461, 0.456, 0.495,
  0.547, 0.612, 0.694, 0.815, 0.914, 0.98, 0.098, 0.087, 0.097, 0.111, 0.133, 0.159, 0.188, 0.22,
  0.254, 0.29, 0.325, 0.386, 0.498, 0.544, 0.668, 0.722, 0.787, 1.016, 0.042, 0.076, 0.073, 0.075,
  0.078, 0.086, 0.101, 0.149, 0.186, 0.23, 0.27, 0.439, 0.517, 0.567, 0.667, 0.726, 0.861, 1.032,
  0.12, -0.029, 0.017, -0.004, 0.004, 0, -0.008, -0.017, -0.013, 0.046, 0.121, 0.369, 0.442, 0.595,
  0.659, 0.736, 0.809, 0.931,
];

const RAMP = [
  [-18.9, 1.328, 1.248],
  [-13.8, 1.357, 1.165],
  [-6.9, 1.315, 1.15],
  [-2.4, 1.27, 1.08],
  [0, 1.08, 0.98],
  [1.5, 0.93, 0.9],
  [3.5, 0.86, 0.8],
  [4, 0.751, 0.657],
  [5.3, 0.731, 0.478],
  [4.6, 0.624, 0.362],
  [8.6, 0.434, 0.279],
];

const RIM_GAIN = 0.3;
const RIM_W = 9;
const SHEEN_PAST = 0.45;
const SHEEN_TOP = 0.1075;
const SHEEN_TOP_W = 31;
const SHEEN_BOT = 0.061;
const SHEEN_BOT_W = 12;
const SHEEN_RIGHT = 0.034;
const SHEEN_RIGHT_W = 16;
const UNDER_FROM = 0.735;
const UNDER_MAX = 0.8;

const T_END = 2.05;
const BREATH_PERIOD = 5.4;
const HALO_PERIOD = 2.7;

type RGB = [number, number, number];

function parseColor(input: string, fallback: RGB): RGB {
  const s = (input || "").trim().toLowerCase();
  let m = /^#([0-9a-f]{3,8})$/.exec(s);
  if (m) {
    let h = m[1];
    if (h.length === 3 || h.length === 4) h = h.split("").map((c) => c + c).join("");
    return [
      parseInt(h.slice(0, 2), 16),
      parseInt(h.slice(2, 4), 16),
      parseInt(h.slice(4, 6), 16),
    ];
  }
  m = /^rgba?\(([^)]+)\)$/.exec(s);
  if (m) {
    const p = m[1]
      .split(/[\s,/]+/)
      .filter(Boolean)
      .map((v) => (v.endsWith("%") ? parseFloat(v) * 2.55 : parseFloat(v)));
    if (p.length >= 3 && p.slice(0, 3).every((v) => isFinite(v))) return [p[0], p[1], p[2]];
  }
  m = /^hsla?\(([^)]+)\)$/.exec(s);
  if (m) {
    const p = m[1]
      .split(/[\s,/]+/)
      .filter(Boolean)
      .map((v) => parseFloat(v));
    if (p.length >= 3 && p.slice(0, 3).every((v) => isFinite(v)))
      return hslToRgb(p[0], p[1] / 100, p[2] / 100);
  }
  return fallback;
}

function rgbToHsl([r, g, b]: RGB): [number, number, number] {
  const R = r / 255;
  const G = g / 255;
  const B = b / 255;
  const mx = Math.max(R, G, B);
  const mn = Math.min(R, G, B);
  const l = (mx + mn) / 2;
  if (mx === mn) return [0, 0, l];
  const d = mx - mn;
  const s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn);
  const h =
    mx === R ? (G - B) / d + (G < B ? 6 : 0) : mx === G ? (B - R) / d + 2 : (R - G) / d + 4;
  return [h * 60, s, l];
}

function hslToRgb(h: number, s: number, l: number): RGB {
  h = ((h % 360) + 360) % 360;
  s = Math.min(1, Math.max(0, s));
  l = Math.min(1, Math.max(0, l));
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  const [r, g, b] =
    h < 60
      ? [c, x, 0]
      : h < 120
      ? [x, c, 0]
      : h < 180
      ? [0, c, x]
      : h < 240
      ? [0, x, c]
      : h < 300
      ? [x, 0, c]
      : [c, 0, x];
  return [(r + m) * 255, (g + m) * 255, (b + m) * 255];
}

const mixRgb = (a: RGB, b: RGB, t: number): RGB => [
  a[0] + (b[0] - a[0]) * t,
  a[1] + (b[1] - a[1]) * t,
  a[2] + (b[2] - a[2]) * t,
];
const css = (c: RGB, a = 1) =>
  `rgba(${Math.round(c[0])}, ${Math.round(c[1])}, ${Math.round(c[2])}, ${+a.toFixed(4)})`;
const clamp = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v);
const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const smooth = (a: number, b: number, v: number) => {
  const t = clamp01((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);
const backOut = (t: number) => {
  const c1 = 1.5;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};
const seg = (t: number, a: number, b: number) => clamp01((t - a) / (b - a));

interface Curve {
  pts: { x: number; y: number }[];
  bez: { x1: number; y1: number; x2: number; y2: number }[];
  lens: number[];
  total: number;
  lo: number;
  hi: number;
}

function bezAt(
  px: number,
  py: number,
  b: { x1: number; y1: number; x2: number; y2: number },
  qx: number,
  qy: number,
  t: number
): [number, number] {
  const u = 1 - t;
  const a = u * u * u;
  const c = 3 * u * u * t;
  const d = 3 * u * t * t;
  const e = t * t * t;
  return [a * px + c * b.x1 + d * b.x2 + e * qx, a * py + c * b.y1 + d * b.y2 + e * qy];
}

function buildCurve(data: number[]): Curve {
  const n = data.length;
  const inner = n > 3 ? data.slice(1, -1) : data;
  let mn = Math.min(...inner);
  let mx = Math.max(...inner);
  if (!(mx > mn)) {
    mn -= 1;
    mx += 1;
  }
  const x0 = X0F * CW;
  const x1 = X1F * CW;
  const yt = YTOPF * CH;
  const yb = YBOTF * CH;
  const pts = data.map((v, i) => ({
    x: n > 1 ? x0 + ((x1 - x0) * i) / (n - 1) : (x0 + x1) / 2,
    y: yb - ((v - mn) / (mx - mn)) * (yb - yt),
  }));
  const tan = pts.map((p, i) => {
    const a = pts[Math.max(0, i - 1)];
    const b = pts[Math.min(n - 1, i + 1)];
    const k = i === 0 || i === n - 1 ? TENSION : TENSION / 2;
    return { x: (b.x - a.x) * k, y: (b.y - a.y) * k };
  });
  const bez: Curve["bez"] = [];
  const lens = [0];
  for (let i = 0; i < n - 1; i++) {
    const p = pts[i];
    const q = pts[i + 1];
    const b = {
      x1: p.x + tan[i].x / 3,
      y1: p.y + tan[i].y / 3,
      x2: q.x - tan[i + 1].x / 3,
      y2: q.y - tan[i + 1].y / 3,
    };
    bez.push(b);
    let L = 0;
    let px = p.x;
    let py = p.y;
    for (let s = 1; s <= 24; s++) {
      const [x, y] = bezAt(p.x, p.y, b, q.x, q.y, s / 24);
      L += Math.hypot(x - px, y - py);
      px = x;
      py = y;
    }
    lens.push(lens[i] + L);
  }
  const margin = RING_R + RING_W / 2 + 2;
  let lo = 0;
  let hi = n - 1;
  const inside = (p: { x: number; y: number }) =>
    p.x >= margin && p.x <= CW - margin && p.y >= margin && p.y <= CH - margin;
  while (lo < n - 1 && !inside(pts[lo])) lo++;
  while (hi > lo && !inside(pts[hi])) hi--;
  return { pts, bez, lens, total: lens[n - 1] || 0, lo, hi };
}

function curveAt(c: Curve, f: number): [number, number] {
  const n = c.pts.length;
  if (n === 1) return [c.pts[0].x, c.pts[0].y];
  const i = clamp(Math.floor(f), 0, n - 2);
  const t = clamp(f - i, 0, 1);
  const p = c.pts[i];
  const q = c.pts[i + 1];
  return bezAt(p.x, p.y, c.bez[i], q.x, q.y, t);
}

function arcAt(c: Curve, f: number): number {
  const n = c.pts.length;
  if (n < 2) return 0;
  const i = clamp(Math.floor(f), 0, n - 2);
  const t = clamp(f - i, 0, 1);
  return c.lens[i] + (c.lens[i + 1] - c.lens[i]) * t;
}

function tracePath(ctx: CanvasRenderingContext2D, c: Curve) {
  const p = c.pts;
  ctx.beginPath();
  ctx.moveTo(p[0].x, p[0].y);
  for (let i = 0; i < p.length - 1; i++) {
    ctx.bezierCurveTo(
      c.bez[i].x1,
      c.bez[i].y1,
      c.bez[i].x2,
      c.bez[i].y2,
      p[i + 1].x,
      p[i + 1].y
    );
  }
}

function crWeights(t: number, out: Float32Array, o: number) {
  const t2 = t * t;
  const t3 = t2 * t;
  out[o] = -0.5 * t3 + t2 - 0.5 * t;
  out[o + 1] = 1.5 * t3 - 2.5 * t2 + 1;
  out[o + 2] = -1.5 * t3 + 2 * t2 + 0.5 * t;
  out[o + 3] = 0.5 * t3 - 0.5 * t2;
}

class Field {
  w = 0;
  h = 0;
  img: ImageData | null = null;
  tmap = new Float32Array(0);
  mxCached = -1;
  lut = new Float32Array(0);
  surf = new Float32Array(0);
  rimAdd: RGB = [0, 0, 0];
  sheen = new Float32Array(0);
  colRight = new Float32Array(0);
  colRim = new Float32Array(0);
  key = "";

  resize(w: number, h: number) {
    if (w === this.w && h === this.h) return;
    this.w = w;
    this.h = h;
    this.img = new ImageData(w, h);
    this.tmap = new Float32Array(w * h);
    this.mxCached = -1;
    this.key = "";
  }

  palette(accent: RGB, card: RGB) {
    const key = accent.join(",") + "|" + card.join(",") + "|" + this.h;
    if (key === this.key) return;
    this.key = key;
    const [h, s, l] = rgbToHsl(accent);
    const stops = RAMP.map(([dh, ks, kl]) => hslToRgb(h + dh, s * ks, l * kl));
    const N = 512;
    this.lut = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      const f = (i / (N - 1)) * (stops.length - 1);
      const j = Math.min(stops.length - 2, Math.floor(f));
      const c = mixRgb(stops[j], stops[j + 1], f - j);
      this.lut[i * 3] = c[0];
      this.lut[i * 3 + 1] = c[1];
      this.lut[i * 3 + 2] = c[2];
    }
    this.surf = new Float32Array(this.h * 3);
    for (let y = 0; y < this.h; y++) {
      const cy = ((y + 0.5) / this.h) * CH;
      const a =
        SHEEN_TOP * Math.exp(-cy / SHEEN_TOP_W) + SHEEN_BOT * Math.exp(-(CH - cy) / SHEEN_BOT_W);
      for (let k = 0; k < 3; k++) this.surf[y * 3 + k] = card[k] + (255 - card[k]) * a;
    }
    const rim = stops[0];
    this.rimAdd = [rim[0] * RIM_GAIN, rim[1] * RIM_GAIN, rim[2] * RIM_GAIN];
    this.sheen = new Float32Array(this.h);
    for (let y = 0; y < this.h; y++) {
      const cy = ((y + 0.5) / this.h) * CH;
      this.sheen[y] = SHEEN_PAST * SHEEN_TOP * Math.exp(-cy / SHEEN_TOP_W);
    }
    this.mxCached = -1;
  }

  layout(mx: number) {
    if (Math.abs(mx - this.mxCached) < 0.02) return;
    this.mxCached = mx;
    const { w, h, tmap } = this;
    const wx = new Float32Array(w * 4);
    const ix = new Int32Array(w);
    for (let x = 0; x < w; x++) {
      const cx = ((x + 0.5) / w) * CW;
      const gx = clamp(cx / Math.max(mx, 1), 0, 1) * (GX - 1);
      const i = Math.min(GX - 2, Math.floor(gx));
      ix[x] = i;
      crWeights(gx - i, wx, x * 4);
    }
    const wy = new Float32Array(4);
    for (let y = 0; y < h; y++) {
      const gy = ((y + 0.5) / h) * (GY - 1);
      const j = Math.min(GY - 2, Math.floor(gy));
      crWeights(gy - j, wy, 0);
      const rows = [Math.max(0, j - 1), j, j + 1, Math.min(GY - 1, j + 2)];
      for (let x = 0; x < w; x++) {
        const i = ix[x];
        const c0 = Math.max(0, i - 1);
        const c1 = i;
        const c2 = i + 1;
        const c3 = Math.min(GX - 1, i + 2);
        const o = x * 4;
        let t = 0;
        for (let b = 0; b < 4; b++) {
          const r = rows[b] * GX;
          t +=
            wy[b] *
            (wx[o] * GLOW_T[r + c0] +
              wx[o + 1] * GLOW_T[r + c1] +
              wx[o + 2] * GLOW_T[r + c2] +
              wx[o + 3] * GLOW_T[r + c3]);
        }
        tmap[y * w + x] = t;
      }
    }
  }

  paint(mx: number, glow: number, breath: number, seedFrame: number) {
    const { w, h, tmap, lut, surf, img } = this;
    if (!img) return;
    const d = img.data;
    const rim = this.rimAdd;
    const lift = (1 - glow) * 1.15;
    const tb = 1 + breath;
    let seed = (seedFrame * 2654435761) >>> 0;
    if (this.colRight.length !== w) {
      this.colRight = new Float32Array(w);
      this.colRim = new Float32Array(w);
      for (let x = 0; x < w; x++) {
        const cx = ((x + 0.5) / w) * CW;
        this.colRight[x] = SHEEN_RIGHT * Math.exp(-(CW - cx) / SHEEN_RIGHT_W);
        this.colRim[x] = Math.exp(-cx / RIM_W);
      }
    }
    const colRight = this.colRight;
    const colRim = this.colRim;
    for (let y = 0; y < h; y++) {
      const sr = surf[y * 3];
      const sg = surf[y * 3 + 1];
      const sb = surf[y * 3 + 2];
      const sh = this.sheen[y];
      for (let x = 0; x < w; x++) {
        const right = colRight[x];
        const s0 = sr + (255 - sr) * right;
        const s1 = sg + (255 - sg) * right;
        const s2 = sb + (255 - sb) * right;
        const px0 = (x / w) * CW;
        const px1 = ((x + 1) / w) * CW;
        const cov = clamp01((mx - px0) / (px1 - px0));
        let r = s0;
        let g = s1;
        let b = s2;
        if (cov > 0) {
          let t = tmap[y * w + x] * tb + lift;
          t = t < 0 ? 0 : t > 1 ? 1 : t;
          let pr: number;
          let pg: number;
          let pb: number;
          if (t < 0.9) {
            const k = Math.round((t / 0.9) * 511) * 3;
            pr = lut[k];
            pg = lut[k + 1];
            pb = lut[k + 2];
            pr += (255 - pr) * sh;
            pg += (255 - pg) * sh;
            pb += (255 - pb) * sh;
          } else {
            const f = (t - 0.9) / 0.1;
            const k = 511 * 3;
            const sf = sh * (1 - f);
            pr = lut[k] + (255 - lut[k]) * sf;
            pg = lut[k + 1] + (255 - lut[k + 1]) * sf;
            pb = lut[k + 2] + (255 - lut[k + 2]) * sf;
            pr += (s0 - pr) * f;
            pg += (s1 - pg) * f;
            pb += (s2 - pb) * f;
          }
          const e = colRim[x] * glow;
          pr += rim[0] * e;
          pg += rim[1] * e;
          pb += rim[2] * e;
          r = s0 + (pr - s0) * cov;
          g = s1 + (pg - s1) * cov;
          b = s2 + (pb - s2) * cov;
        }
        seed = (seed * 1664525 + 1013904223) >>> 0;
        const n = (seed / 4294967296 - 0.5) * 1.2;
        const o = (y * w + x) * 4;
        d[o] = r + n;
        d[o + 1] = g + n;
        d[o + 2] = b + n;
        d[o + 3] = 255;
      }
    }
  }
}

interface Col {
  el: HTMLSpanElement;
  stack: HTMLSpanElement | null;
  cells: HTMLSpanElement[];
  ch: string;
  digit: number;
  p: number;
  v: number;
  w: number;
  mode: number;
  t: number;
  base: number;
  slotW: number;
  next: string | null;
  kNext: string | null | undefined;
  kOff: number;
  lo: number;
  fade: number;
  grow: number;
  lift: number;
  a0: number;
  g0: number;
  l0: number;
  key: string;
}

const ROLL_IO = 0.42;
const rowAlpha = (d: number) => 1 - smooth(0.4, 0.64, Math.abs(d));

function placeKeys(chars: string[]): string[] {
  const keys: string[] = new Array(chars.length);
  const isD = (c: string | undefined) => c !== undefined && c >= "0" && c <= "9";
  let run = 0;
  for (let i = 0; i < chars.length; ) {
    if (!isD(chars[i])) {
      keys[i] = run + ":" + chars[i];
      i++;
      continue;
    }
    let j = i;
    while (
      j < chars.length &&
      (isD(chars[j]) || ((chars[j] === "." || chars[j] === ",") && isD(chars[j + 1])))
    ) {
      j++;
    }
    const dots: number[] = [];
    for (let k = i; k < j; k++) if (chars[k] === ".") dots.push(k);
    const point = dots.length === 1 ? dots[0] : j;
    let place = 0;
    for (let k = Math.min(point, j) - 1; k >= i; k--) {
      if (isD(chars[k])) keys[k] = run + "i" + place++;
      else keys[k] = run + "g" + place;
    }
    let frac = 0;
    for (let k = point; k < j; k++) {
      keys[k] = k === point ? run + "." : isD(chars[k]) ? run + "f" + ++frac : run + "h" + frac;
    }
    run++;
    i = j;
  }
  return keys;
}

class Roller {
  root: HTMLElement;
  cols: Col[] = [];
  text = "";
  font = "";
  size = 0;
  track = 0;
  widths: Record<string, number> = {};
  measure: CanvasRenderingContext2D | null = null;
  currencyKern: number;
  footed = false;
  kerns: Record<string, number> = {};

  constructor(root: HTMLElement, currencyKern = 0) {
    this.root = root;
    this.currencyKern = currencyKern;
  }

  private adv(text: string) {
    if (this.widths[text] === undefined) {
      if (!this.measure) this.measure = document.createElement("canvas").getContext("2d");
      const m = this.measure;
      if (m) {
        m.font = this.font;
        try {
          (m as CanvasRenderingContext2D & { fontKerning?: string }).fontKerning = "normal";
        } catch {
          /* ignore */
        }
        this.widths[text] = m.measureText(text).width;
      } else {
        this.widths[text] = this.size * 0.6 * text.length;
      }
    }
    return this.widths[text];
  }

  private slot(ch: string, next: string | null) {
    let w = this.adv(ch) + this.track + (this.footed && ch === "1" ? ONE_FOOT.extra * this.size : 0);
    if (next !== null) {
      const key = ch + next;
      if (this.kerns[key] === undefined) {
        this.kerns[key] = this.adv(key) - this.adv(ch) - this.adv(next);
      }
      w += this.kerns[key];
      if (/[$£€¥₹#]/.test(ch) && next >= "0" && next <= "9") w += this.currencyKern * this.size;
    }
    return w;
  }

  private rollW(lo: number, fr: number, next: string | null) {
    const a = this.slot(String(lo % 10), next);
    return fr > 0 ? a + (this.slot(String((lo + 1) % 10), next) - a) * fr : a;
  }

  setFoot(on: boolean) {
    if (on === this.footed) return;
    this.footed = on;
    this.root.querySelectorAll<HTMLElement>("[data-foot]").forEach((f) => {
      f.style.display = on ? "block" : "none";
    });
    this.widths = {};
    this.layout(true);
  }

  setFont(font: string, size: number, track: number) {
    if (font === this.font && size === this.size && track === this.track) return;
    this.font = font;
    this.size = size;
    this.track = track;
    this.widths = {};
    this.kerns = {};
    this.layout(true);
  }

  private layout(snap: boolean) {
    const kept = this.cols.filter((c) => c.mode !== -1);
    kept.forEach((c, i) => {
      c.next = i + 1 < kept.length ? kept[i + 1].ch : null;
    });
    for (const c of this.cols) {
      if (c.mode === -1) c.next = null;
      c.base = this.slot(c.ch, c.next);
      if (snap) {
        c.slotW = c.base;
        c.kNext = c.next;
        c.kOff = 0;
        const w = c.slotW * (c.mode === 1 ? 0 : 1);
        c.w = w;
        c.el.style.width = w + "px";
      }
    }
  }

  private makeCol(ch: string, p: number): Col {
    const el = document.createElement("span");
    el.style.display = "inline-block";
    el.style.position = "relative";
    el.style.height = "1em";
    el.style.lineHeight = "1em";
    el.style.verticalAlign = "top";
    el.style.whiteSpace = "pre";
    el.setAttribute("aria-hidden", "true");
    const isDigit = ch >= "0" && ch <= "9";
    let stack: HTMLSpanElement | null = null;
    const cells: HTMLSpanElement[] = [];
    if (isDigit) {
      const win = document.createElement("span");
      win.style.position = "absolute";
      win.style.left = "-0.3em";
      win.style.right = "-0.3em";
      win.style.top = "-0.2em";
      win.style.height = "1.35em";
      win.style.lineHeight = "1em";
      win.style.overflow = "hidden";
      win.style.display = "block";
      const mask = "linear-gradient(180deg, transparent 0%, #000 24%, #000 81%, transparent 98%)";
      win.style.maskImage = mask;
      win.style.setProperty("-webkit-mask-image", mask);
      win.style.maskRepeat = "no-repeat";
      win.style.setProperty("-webkit-mask-repeat", "no-repeat");
      el.appendChild(win);
      stack = document.createElement("span");
      stack.style.position = "absolute";
      stack.style.left = "0.3em";
      stack.style.top = "0.2em";
      stack.style.display = "block";
      stack.style.lineHeight = "1em";
      stack.style.willChange = "transform";
      for (let k = 0; k <= 10; k++) {
        const d = document.createElement("span");
        d.style.display = "block";
        d.style.height = "1em";
        d.style.lineHeight = "1em";
        d.style.opacity = "0";
        if (k % 10 === 1) {
          const anchor = document.createElement("span");
          anchor.style.display = "inline-block";
          anchor.style.position = "relative";
          anchor.style.width = "0";
          anchor.style.height = "0";
          anchor.style.verticalAlign = "baseline";
          const foot = document.createElement("span");
          foot.dataset.foot = "1";
          foot.style.position = "absolute";
          foot.style.left = `${ONE_FOOT.left}em`;
          foot.style.bottom = "0";
          foot.style.width = `${ONE_FOOT.width}em`;
          foot.style.height = `${ONE_FOOT.height}em`;
          foot.style.background = "currentColor";
          foot.style.display = this.footed ? "block" : "none";
          anchor.appendChild(foot);
          d.appendChild(anchor);
        }
        d.appendChild(document.createTextNode(String(k % 10)));
        cells.push(d);
        stack.appendChild(d);
      }
      win.appendChild(stack);
    } else {
      el.textContent = ch;
    }
    return {
      el,
      stack,
      cells,
      ch,
      digit: isDigit ? +ch : -1,
      p,
      v: 0,
      w: 0,
      mode: 0,
      t: 1,
      base: 0,
      slotW: 0,
      next: null,
      kNext: undefined,
      kOff: 0,
      lo: -1,
      fade: 1,
      grow: 1,
      lift: 0,
      a0: 1,
      g0: 1,
      l0: 0,
      key: ch,
    };
  }

  set(text: string, instant: boolean) {
    if (text === this.text) return;
    this.text = text;
    const chars = Array.from(text);
    const keys = placeKeys(chars);
    if (instant || !this.cols.some((c) => c.mode !== -1)) {
      this.root.textContent = "";
      this.cols = chars.map((ch, i) => {
        const c = this.makeCol(ch, ch >= "0" && ch <= "9" ? +ch : -1);
        c.key = keys[i];
        this.root.appendChild(c.el);
        return c;
      });
      this.layout(true);
      return;
    }
    const live = this.cols.filter((c) => c.mode !== -1);
    const n = live.length;
    const m = chars.length;
    const L: number[][] = [];
    for (let i = 0; i <= n; i++) L.push(new Array(m + 1).fill(0));
    for (let i = n - 1; i >= 0; i--) {
      for (let k = m - 1; k >= 0; k--) {
        L[i][k] =
          live[i].key === keys[k] ? L[i + 1][k + 1] + 1 : Math.max(L[i + 1][k], L[i][k + 1]);
      }
    }
    const pairOf = new Map<number, Col>();
    const kept = new Set<Col>();
    for (let i = 0, k = 0; i < n && k < m; ) {
      if (live[i].key === keys[k]) {
        pairOf.set(k, live[i]);
        kept.add(live[i]);
        i++;
        k++;
      } else if (L[i + 1][k] >= L[i][k + 1]) {
        i++;
      } else {
        k++;
      }
    }
    for (const c of live) {
      if (kept.has(c)) continue;
      c.a0 = c.fade;
      c.g0 = c.grow;
      c.l0 = c.lift;
      c.mode = -1;
      c.t = 0;
    }
    const entering: Col[] = [];
    for (let k = m - 1, anchor: HTMLElement | null = null; k >= 0; k--) {
      const ch = chars[k];
      const old = pairOf.get(k);
      if (old) {
        old.ch = ch;
        if (old.digit >= 0) old.digit = +ch;
        anchor = old.el;
        continue;
      }
      const c = this.makeCol(ch, ch >= "0" && ch <= "9" ? +ch : -1);
      c.key = keys[k];
      c.mode = 1;
      c.t = 0;
      c.fade = 0;
      c.grow = 0;
      c.el.style.width = "0px";
      c.el.style.opacity = "0";
      this.root.insertBefore(c.el, anchor);
      anchor = c.el;
      entering.push(c);
    }
    const byEl = new Map<Element, Col>();
    for (const c of [...this.cols, ...entering]) byEl.set(c.el, c);
    this.cols = Array.from(this.root.children)
      .map((e) => byEl.get(e))
      .filter((c): c is Col => !!c);
    this.layout(false);
    for (const c of entering) {
      c.slotW = c.base;
      c.kNext = c.next;
    }
  }

  step(dt: number, intro: number, instant: boolean) {
    const kept = this.cols.filter((c) => c.mode !== -1);
    const digits = kept.filter((c) => c.digit >= 0).length;
    let di = 0;
    const done: Col[] = [];
    const settle = instant ? 1 : 1 - Math.exp(-dt * 9);
    for (const c of this.cols) {
      if (c.mode !== 0) {
        c.t = instant ? 1 : Math.min(1, c.t + dt / ROLL_IO);
        if (c.mode === 1) {
          const u = easeOut(clamp01((c.t - 0.4) / 0.6));
          c.grow = easeInOut(clamp01(c.t / 0.55));
          c.fade = u;
          c.lift = 0.3 * (1 - u);
          if (c.t >= 1) {
            c.mode = 0;
            c.grow = 1;
            c.fade = 1;
            c.lift = 0;
          }
        } else {
          const u = easeOut(clamp01(c.t / 0.45));
          c.fade = c.a0 * (1 - u);
          c.grow = c.g0 * (1 - easeInOut(clamp01((c.t - 0.3) / 0.7)));
          c.lift = c.l0 + (-0.3 - c.l0) * u;
          if (c.t >= 1) done.push(c);
        }
        c.el.style.transform = `translate3d(0, ${c.lift.toFixed(4)}em, 0)`;
      } else if (c.el.style.transform) {
        c.el.style.transform = "";
      }
      let alpha: number;
      let full: number;
      if (c.digit < 0) {
        c.slotW = c.slotW + (c.base - c.slotW) * settle;
        if (Math.abs(c.slotW - c.base) < 0.01) c.slotW = c.base;
        full = c.slotW;
        alpha = clamp01(intro * 1.6 - 0.1);
        const w = full * c.grow;
        const indent = (w - full) / 2;
        const ind = Math.abs(indent) < 0.01 ? "" : indent.toFixed(2) + "px";
        if (c.el.style.textIndent !== ind) c.el.style.textIndent = ind;
      } else {
        if (c.mode !== -1) {
          const goal = c.digit + Math.round((c.p - c.digit) / 10) * 10;
          if (instant) {
            c.p = goal;
            c.v = 0;
          } else {
            const k = 160;
            const damp = 2 * Math.sqrt(k);
            const n = Math.max(1, Math.ceil(dt / 0.0175));
            const h = dt / n;
            for (let q = 0; q < n; q++) {
              c.v += (-(c.p - goal) * k - c.v * damp) * h;
              c.p += c.v * h;
            }
            if (Math.abs(c.p - goal) < 1e-4 && Math.abs(c.v) < 1e-3) {
              c.p = goal;
              c.v = 0;
            }
          }
        }
        const stag = digits > 1 ? (Math.min(di, digits - 1) / (digits - 1)) * 0.22 : 0;
        const local = clamp01((intro - stag) / (1 - 0.22));
        const shown = c.p - (1 - easeOutQuart(local)) * 12;
        let pm = ((shown % 10) + 10) % 10;
        if (pm > 9.99995) pm = 0;
        let lo = Math.floor(pm);
        let fr = pm - lo;
        if (fr > 0.99995) {
          lo = (lo + 1) % 10;
          fr = 0;
          pm = lo;
        }
        const raw = this.rollW(lo, fr, c.next);
        if (c.next !== c.kNext) {
          if (c.kNext !== undefined && !instant) c.kOff += this.rollW(lo, fr, c.kNext) - raw;
          c.kNext = c.next;
        }
        c.kOff = instant ? 0 : c.kOff * (1 - settle);
        if (Math.abs(c.kOff) < 0.01) c.kOff = 0;
        full = raw + c.kOff;
        const colW = full * c.grow;
        if (c.stack) {
          c.stack.style.transform = `translate3d(0, ${(-pm).toFixed(4)}em, 0)`;
          if (c.lo !== lo) {
            if (c.lo >= 0) {
              c.cells[c.lo].style.opacity = "0";
              c.cells[c.lo + 1].style.opacity = "0";
            }
            c.lo = lo;
          }
          for (let k = lo; k <= lo + 1; k++) {
            const d = k - pm;
            const cell = c.cells[k];
            const x = (colW - this.slot(String(k % 10), c.next)) / 2;
            const a = rowAlpha(d);
            cell.style.opacity = a > 0.002 ? a.toFixed(3) : "0";
            cell.style.transform =
              Math.abs(x) < 0.01 ? "" : `translate3d(${x.toFixed(2)}px, 0, 0)`;
          }
        }
        alpha = clamp01(local * 2.2);
        if (c.mode !== -1) di++;
      }
      const w = full * c.grow;
      if (Math.abs(w - c.w) > 0.01) {
        c.w = w;
        c.el.style.width = w + "px";
      }
      c.el.style.opacity = String(alpha * c.fade);
    }
    if (done.length) {
      for (const c of done) c.el.remove();
      this.cols = this.cols.filter((c) => !done.includes(c));
    }
  }
}

function usePrefersReducedMotion() {
  const [r, setR] = React.useState(false);
  React.useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const q = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setR(q.matches);
    on();
    q.addEventListener?.("change", on);
    return () => q.removeEventListener?.("change", on);
  }, []);
  return r;
}

function deltaOf(data: number[], i: number, mode: "previous" | "first") {
  const ref = mode === "first" ? data[0] : data[Math.max(0, i - 1)];
  const v = data[i];
  if (!isFinite(ref) || ref === 0 || !isFinite(v)) return 0;
  return ((v - ref) / Math.abs(ref)) * 100;
}

function fmtDelta(d: number) {
  const r = Math.round(d * 10) / 10;
  if (r === 0) return "0.0%";
  return (r < 0 ? "-" : "+") + Math.abs(r).toFixed(1) + "%";
}

export function MarketCard({
  data = DEFAULT_DATA,
  value = "AED 2.5k",
  format,
  label = "Dubai Prime / sq ft",
  deltaLabel,
  deltaMode = "previous",
  index,
  defaultIndex,
  onIndexChange,
  accent = "#4358e2",
  cardColor = "#0c1420",
  textColor = "#ffffff",
  lineColor = "#ffffff",
  downColor = "#e65a3a",
  upColor = "#3ecf8e",
  background = "transparent",
  grid = false,
  fill = 0.96,
  interactive = true,
  revealed = true,
  menu = true,
  onMenu,
  font = DEFAULT_FONT,
  children,
  className,
  style,
}: MarketCardProps) {
  const reduced = usePrefersReducedMotion();
  const series = React.useMemo(
    () =>
      Array.isArray(data) && data.length >= 2
        ? data.map((v) => (isFinite(v) ? v : 0))
        : DEFAULT_DATA,
    [data]
  );
  const curve = React.useMemo(() => buildCurve(series), [series]);
  const restDefault = defaultIndex ?? Math.round((series.length - 1) * 0.72);
  const [selfIndex, setSelfIndex] = React.useState(() =>
    clamp(Math.round(restDefault), curve.lo, curve.hi)
  );
  const selected = clamp(Math.round(index ?? selfIndex), curve.lo, curve.hi);
  const [shown, setShown] = React.useState(selected);
  const [size, setSize] = React.useState({ w: 0, h: 0 });
  const [focusVisible, setFocusVisible] = React.useState(false);

  const rootRef = React.useRef<HTMLDivElement>(null);
  const fieldRef = React.useRef<HTMLCanvasElement>(null);
  const mainRef = React.useRef<HTMLCanvasElement>(null);
  const figRef = React.useRef<HTMLDivElement>(null);
  const chipRef = React.useRef<HTMLDivElement>(null);
  const chipTextRef = React.useRef<HTMLSpanElement>(null);
  const labelRef = React.useRef<HTMLDivElement>(null);
  const capRef = React.useRef<HTMLDivElement>(null);
  const kickRef = React.useRef<() => void>(() => {});
  const shownRef = React.useRef(shown);

  const accentRgb = React.useMemo(() => parseColor(accent, [67, 88, 226]), [accent]);
  const cardRgb = React.useMemo(() => parseColor(cardColor, [12, 20, 32]), [cardColor]);
  const textRgb = React.useMemo(() => parseColor(textColor, [255, 255, 255]), [textColor]);
  const lineRgb = React.useMemo(() => parseColor(lineColor, [255, 255, 255]), [lineColor]);
  const downRgb = React.useMemo(() => parseColor(downColor, [230, 90, 58]), [downColor]);
  const upRgb = React.useMemo(() => parseColor(upColor, [62, 207, 142]), [upColor]);

  const delta = deltaOf(series, shown, deltaMode);
  const deltaText = fmtDelta(delta);
  const negative = Math.round(delta * 10) < 0;
  const deltaRgb = negative ? downRgb : upRgb;
  const figure = format ? format(series[shown]) : value;
  const tail =
    deltaLabel ?? (deltaMode === "first" ? "since cycle start." : "from the previous quarter.");
  const word = Math.round(delta * 10) === 0 ? "no change" : negative ? "decrease" : "increase";

  const live = React.useRef({
    curve,
    series,
    selected,
    hover: null as number | null,
    reduced,
    revealed,
    interactive,
    accentRgb,
    cardRgb,
    textRgb,
    lineRgb,
    deltaRgb,
    figure,
    deltaText,
    focusVisible,
    size,
    font,
    menu,
    fill,
  });

  React.useEffect(() => {
    shownRef.current = shown;
    live.current = {
      ...live.current,
      curve,
      series,
      selected,
      reduced,
      revealed,
      interactive,
      accentRgb,
      cardRgb,
      textRgb,
      lineRgb,
      deltaRgb,
      figure,
      deltaText,
      focusVisible,
      size,
      font,
      menu,
      fill,
    };
    kickRef.current();
  }, [
    shown,
    curve,
    series,
    selected,
    reduced,
    revealed,
    interactive,
    accentRgb,
    cardRgb,
    textRgb,
    lineRgb,
    deltaRgb,
    figure,
    deltaText,
    focusVisible,
    size,
    font,
    menu,
    fill,
  ]);

  React.useLayoutEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const read = () => {
      const r = el.getBoundingClientRect();
      setSize((prev) =>
        Math.abs(prev.w - r.width) < 0.5 && Math.abs(prev.h - r.height) < 0.5
          ? prev
          : { w: r.width, h: r.height }
      );
    };
    read();
    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", read);
      return () => window.removeEventListener("resize", read);
    }
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const f = clamp(fill, 0.3, 1);
  const availW = Math.max(0, size.w - 16);
  const cw = Math.max(
    0,
    Math.min(size.w * f, availW, size.h * Math.min(f, FILL_TALL) * (CW / CH))
  );
  const ch = (cw * CH) / CW;
  const s = cw / CW;
  const left = (size.w - cw) / 2;
  const top = (size.h - ch) / 2;
  const labelPx = Math.max(11, LABEL_SIZE * s);
  const figPx = FIG_SIZE * s;
  const capPx = Math.max(11, CAP_SIZE * s);
  const capLh = capPx * (CAP_LH / CAP_SIZE);
  const chipPx = Math.max(11, CHIP_SIZE * s);

  React.useEffect(() => {
    const root = rootRef.current;
    const fieldCv = fieldRef.current;
    const mainCv = mainRef.current;
    const figEl = figRef.current;
    const chipEl = chipRef.current;
    const chipTxt = chipTextRef.current;
    if (!root || !fieldCv || !mainCv || !figEl || !chipEl || !chipTxt) return;
    const fctx = fieldCv.getContext("2d");
    const ctx = mainCv.getContext("2d");
    if (!fctx || !ctx) return;
    const field = new Field();
    const fig = new Roller(figEl, FIG_CURRENCY_KERN);
    const chipRoll = new Roller(chipTxt);
    const st = {
      idx: live.current.selected,
      vel: 0,
      rt: live.current.reduced ? T_END : 0,
      last: -1,
      start: performance.now(),
      raf: 0,
      visible: true,
      frame: 0,
      lastShown: shownRef.current,
    };

    const frame = () => {
      st.raf = 0;
      const L = live.current;
      const now = performance.now();
      const dt = st.last < 0 ? 0 : clamp((now - st.last) / 1000, 0, 0.05);
      st.last = now;
      st.frame++;
      const isReduced = L.reduced;
      const time = (now - st.start) / 1000;

      if (isReduced) st.rt = L.revealed ? T_END : 0;
      else if (L.revealed) st.rt = Math.min(T_END, st.rt + dt);
      else st.rt = Math.max(0, st.rt - dt * 1.7);
      const rt = st.rt;

      const c = L.curve;
      const target = clamp(L.hover ?? L.selected, c.lo, c.hi);
      if (isReduced) {
        st.idx = target;
        st.vel = 0;
      } else {
        const k = 90;
        const damp = 2 * Math.sqrt(k) * 1.02;
        st.vel += (-(st.idx - target) * k - st.vel * damp) * dt;
        st.idx += st.vel * dt;
        if (Math.abs(st.idx - target) < 1e-4 && Math.abs(st.vel) < 1e-3) {
          st.idx = target;
          st.vel = 0;
        }
      }
      st.idx = clamp(st.idx, c.lo, c.hi);
      const di = clamp(Math.round(st.idx), c.lo, c.hi);
      if (di !== st.lastShown) {
        st.lastShown = di;
        setShown(di);
      }

      const { w: W, h: H } = L.size;
      const f2 = clamp(L.fill, 0.3, 1);
      const cwNow = Math.max(
        0,
        Math.min(W * f2, Math.max(0, W - 16), H * Math.min(f2, FILL_TALL) * (CW / CH))
      );
      if (cwNow < 10) return;
      const sc = cwNow / CW;
      const dpr = Math.min(2, Math.max(1, window.devicePixelRatio || 1));
      const pw = Math.round(cwNow * dpr);
      const ph = Math.round(((cwNow * CH) / CW) * dpr);
      if (mainCv.width !== pw || mainCv.height !== ph) {
        mainCv.width = pw;
        mainCv.height = ph;
      }
      const fw = clamp(Math.round(cwNow / 2), 100, 320);
      const fh = Math.max(8, Math.round((fw * CH) / CW));
      if (fieldCv.width !== fw || fieldCv.height !== fh) {
        fieldCv.width = fw;
        fieldCv.height = fh;
      }
      field.resize(fw, fh);
      field.palette(L.accentRgb, L.cardRgb);

      const glow = easeInOut(seg(rt, 0.12, 1.75));
      const draw = easeInOut(seg(rt, 0.22, 1.62));
      const [mxu, myu] = curveAt(c, st.idx);
      const markerArc = arcAt(c, st.idx) / (c.total || 1);
      const drawArc = draw;
      const ringIn = isReduced
        ? 1
        : backOut(seg(rt, 0.22 + 1.4 * markerArc * 0.92, 0.22 + 1.4 * markerArc * 0.92 + 0.4));
      const chipIn = isReduced ? 1 : seg(rt, 1.42, 1.92);
      const guideIn = isReduced ? 1 : easeOut(seg(rt, 1.3, 1.9));
      const textIn = seg(rt, 0.05, 0.75);
      const capIn = seg(rt, 0.75, 1.4);
      const figIn = seg(rt, 0.15, 1.75);
      const breath = isReduced ? 0 : 0.028 * Math.sin((time / BREATH_PERIOD) * Math.PI * 2) * glow;

      field.layout(mxu);
      field.paint(mxu, glow, breath, isReduced ? 1 : st.frame);
      if (field.img) fctx.putImageData(field.img, 0, 0);

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, pw, ph);
      ctx.setTransform(dpr * sc, 0, 0, dpr * sc, 0, 0);
      const total = c.total;
      const shownLen = total * drawArc;
      const pastLen = Math.min(shownLen, arcAt(c, st.idx));
      const tx = L.textRgb;

      if (shownLen > 0.5) {
        const pastClip = () => {
          ctx.beginPath();
          ctx.rect(-50, -50, mxu + 50, CH + 100);
          ctx.clip();
        };
        const futureClip = () => {
          ctx.beginPath();
          ctx.rect(mxu, -50, CW + 100, CH + 100);
          ctx.clip();
        };

        const ux0 = UNDER_FROM * mxu;
        const dark = mixRgb([0, 0, 0], L.accentRgb, 0.06);
        if (glow > 0.001) {
          ctx.save();
          pastClip();
          ctx.beginPath();
          ctx.rect(-10, -10, Math.min(mxu, 1e4) + 10, CH + 20);
          ctx.clip();
          tracePath(ctx, c);
          const last = c.pts[c.pts.length - 1];
          ctx.lineTo(last.x, CH + 40);
          ctx.lineTo(c.pts[0].x, CH + 40);
          ctx.closePath();
          const g = ctx.createLinearGradient(ux0, 0, mxu, 0);
          for (let i = 0; i <= 8; i++) {
            const t = i / 8;
            g.addColorStop(
              t,
              css(dark, UNDER_MAX * t * t * (3 - 2 * t) * glow * clamp01(draw * 1.4 - 0.2))
            );
          }
          ctx.fillStyle = g;
          ctx.fill();
          ctx.restore();
        }

        ctx.save();
        futureClip();
        tracePath(ctx, c);
        ctx.lineWidth = LINE_W;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.setLineDash([shownLen, total + 10]);
        ctx.strokeStyle = css(tx, 0.14);
        ctx.stroke();
        ctx.restore();

        if (pastLen > 0.5) {
          ctx.save();
          pastClip();
          tracePath(ctx, c);
          ctx.lineWidth = LINE_W;
          ctx.lineCap = "round";
          ctx.lineJoin = "round";
          ctx.setLineDash([pastLen, total + 10]);
          ctx.shadowColor = css(mixRgb([0, 0, 0], L.accentRgb, 0.1), 0.95);
          ctx.shadowBlur = 8 * sc * dpr;
          ctx.shadowOffsetY = 6 * sc * dpr;
          ctx.strokeStyle = css(L.lineRgb, 1);
          ctx.stroke();
          ctx.shadowColor = "rgba(0, 0, 0, 0)";
          ctx.stroke();
          ctx.restore();
        }
      }

      if (guideIn > 0.001 && ringIn > 0.01) {
        const y0 = myu + RING_R + RING_W / 2 + 3.4;
        const y1 = y0 + (CH - y0) * guideIn;
        if (y1 > y0) {
          ctx.save();
          const g = ctx.createLinearGradient(0, y0, 0, CH);
          g.addColorStop(0, css(tx, 0.22));
          g.addColorStop(1, css(tx, 0.32));
          ctx.strokeStyle = g;
          ctx.lineWidth = 1.5;
          ctx.setLineDash([5.6, 3.1]);
          ctx.beginPath();
          ctx.moveTo(mxu, y0);
          ctx.lineTo(mxu, y1);
          ctx.stroke();
          ctx.restore();
        }
      }

      if (ringIn > 0.001) {
        const dc = L.deltaRgb;
        const scRing = Math.max(0, ringIn);
        if (!isReduced && rt >= T_END - 0.01) {
          const ph = (((time % HALO_PERIOD) + HALO_PERIOD) % HALO_PERIOD) / HALO_PERIOD;
          const a = ph < 0.62 ? Math.sin((ph / 0.62) * Math.PI) : 0;
          if (a > 0.001) {
            const rr = RING_R + 2 + easeOut(ph / 0.62) * 11;
            const g = ctx.createRadialGradient(mxu, myu, RING_R, mxu, myu, rr + 4);
            g.addColorStop(0, css(dc, 0));
            g.addColorStop(0.7, css(dc, 0.22 * a));
            g.addColorStop(1, css(dc, 0));
            ctx.fillStyle = g;
            ctx.beginPath();
            ctx.arc(mxu, myu, rr + 4, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        ctx.save();
        ctx.translate(mxu, myu);
        ctx.scale(scRing, scRing);
        ctx.beginPath();
        ctx.arc(0, 0, RING_R + RING_W / 2 + 0.6, 0, Math.PI * 2);
        ctx.fillStyle = css(mixRgb([0, 0, 0], dc, 0.22), 0.85);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(0, 0, RING_R, 0, Math.PI * 2);
        ctx.fillStyle = css(mixRgb(L.cardRgb, dc, 0.06), 1);
        ctx.fill();
        ctx.lineWidth = RING_W;
        ctx.strokeStyle = css(dc, 1);
        ctx.stroke();
        if (L.focusVisible) {
          ctx.beginPath();
          ctx.arc(0, 0, RING_R + RING_W / 2 + 4.5, 0, Math.PI * 2);
          ctx.lineWidth = 1.6;
          ctx.strokeStyle = css(mixRgb(L.accentRgb, [255, 255, 255], 0.45), 0.95);
          ctx.stroke();
        }
        ctx.restore();
      }

      {
        const chipW = chipEl.offsetWidth;
        const chipH = chipEl.offsetHeight;
        const avoid: { l: number; t: number; r: number; b: number }[] = [];
        const cardBox = mainCv.getBoundingClientRect();
        const figBox = figEl.getBoundingClientRect();
        if (figBox.width > 0) {
          avoid.push({
            l: figBox.left - cardBox.left - 4,
            t: figBox.top - cardBox.top,
            r: figBox.right - cardBox.left + 6,
            b: figBox.bottom - cardBox.top,
          });
        }
        if (L.menu) {
          avoid.push({ l: (470.5 - 10) * sc, t: 12 * sc, r: (470.5 + 10) * sc, b: 50 * sc });
        }
        const hits = (x: number, y: number) =>
          avoid.some((a) => x < a.r && x + chipW > a.l && y < a.b && y + chipH > a.t);
        const cxFor = (dx: number) => clamp(mxu * sc - chipW / 2 + dx, 6, cwNow - chipW - 6);
        const reach = Math.max(0, chipW / 2 - 9);
        let cx = cxFor(0);
        let cy = (myu - CHIP_GAP) * sc - chipH;
        let below = cy < 4;
        if (!below && hits(cx, cy)) {
          let found = false;
          for (let k = 1; k <= 8 && !found; k++) {
            for (const sg of [1, -1]) {
              const x = cxFor((sg * k * reach) / 8);
              if (Math.abs(x + chipW / 2 - mxu * sc) <= reach + 0.5 && !hits(x, cy)) {
                cx = x;
                found = true;
                break;
              }
            }
          }
          if (!found) below = true;
        }
        if (below) {
          cy = (myu + CHIP_GAP) * sc;
          cx = cxFor(0);
        }
        const pop = isReduced ? 1 : backOut(chipIn);
        chipEl.style.transform = `translate3d(${cx.toFixed(2)}px, ${cy.toFixed(2)}px, 0) scale(${(0.6 + 0.4 * pop).toFixed(4)})`;
        chipEl.style.transformOrigin = `${(mxu * sc - cx).toFixed(1)}px ${below ? 0 : chipH}px`;
        chipEl.style.opacity = String(clamp01(chipIn * 1.8));
        const tailEl = chipEl.querySelector("svg");
        if (tailEl) {
          const th = tailEl.getBoundingClientRect().height / Math.max(0.001, 0.6 + 0.4 * pop);
          tailEl.style.bottom = below ? "auto" : `${(-th + 1.5).toFixed(2)}px`;
          tailEl.style.top = below ? `${(-th + 1.5).toFixed(2)}px` : "auto";
          tailEl.style.transform = below ? "translateX(-50%) rotate(180deg)" : "translateX(-50%)";
          const tx2 = clamp(mxu * sc - cx, 8, chipW - 8);
          tailEl.style.left = `${tx2.toFixed(2)}px`;
        }
      }

      const lab = labelRef.current;
      const cap = capRef.current;
      if (lab) {
        lab.style.opacity = String(easeOut(textIn));
        lab.style.transform = `translate3d(0, ${((1 - easeOut(textIn)) * 6 * sc).toFixed(2)}px, 0)`;
      }
      if (cap) {
        cap.style.opacity = String(easeOut(capIn));
        cap.style.transform = `translate3d(0, ${((1 - easeOut(capIn)) * 6 * sc).toFixed(2)}px, 0)`;
      }
      const figFont = `500 ${(FIG_SIZE * sc).toFixed(3)}px ${L.font}`;
      fig.setFoot(L.font === DEFAULT_FONT);
      fig.setFont(figFont, FIG_SIZE * sc, FIG_TRACK * FIG_SIZE * sc);
      fig.set(L.figure, isReduced);
      fig.step(dt, isReduced ? 1 : figIn, isReduced);
      const chipPx2 = Math.max(11, CHIP_SIZE * sc);
      chipRoll.setFont(`500 ${chipPx2.toFixed(3)}px ${L.font}`, chipPx2, 0);
      chipRoll.set(L.deltaText, isReduced);
      chipRoll.step(dt, 1, isReduced);

      if (st.visible && !document.hidden) st.raf = requestAnimationFrame(frame);
    };

    const kick = () => {
      if (!st.raf && st.visible && !document.hidden) {
        st.last = -1;
        st.raf = requestAnimationFrame(frame);
      }
    };
    kickRef.current = kick;
    let io: IntersectionObserver | null = null;
    if (typeof IntersectionObserver !== "undefined") {
      io = new IntersectionObserver((es) => {
        st.visible = es.some((e) => e.isIntersecting);
        if (st.visible) kick();
      });
      io.observe(root);
    }
    const onVis = () => {
      if (!document.hidden) kick();
    };
    document.addEventListener("visibilitychange", onVis);
    kick();
    return () => {
      if (st.raf) cancelAnimationFrame(st.raf);
      io?.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      kickRef.current = () => {};
    };
  }, []);

  const select = React.useCallback(
    (i: number) => {
      const c = live.current.curve;
      const j = clamp(Math.round(i), c.lo, c.hi);
      if (index === undefined) setSelfIndex(j);
      onIndexChange?.(j);
    },
    [index, onIndexChange]
  );

  const hitLeft = (curve.pts[curve.lo].x - 16) * s;

  const pointerToIndex = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const card = s > 0 ? (e.clientX - r.left + hitLeft) / s : 0;
    const c = live.current.curve;
    const n = c.pts.length;
    const x0 = c.pts[0].x;
    const x1 = c.pts[n - 1].x;
    const fVal = n > 1 ? ((card - x0) / (x1 - x0)) * (n - 1) : 0;
    const base = Math.round(fVal);
    const d = fVal - base;
    const snapped = base + (Math.sign(d) * Math.pow(Math.abs(d) * 2, 2.2)) / 2;
    return clamp(snapped, c.lo, c.hi);
  };

  const dragging = React.useRef(false);
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!interactive) return;
    if (e.pointerType === "mouse" || dragging.current) {
      live.current.hover = pointerToIndex(e);
      kickRef.current();
    }
  };
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!interactive) return;
    dragging.current = true;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
    live.current.hover = pointerToIndex(e);
    kickRef.current();
  };
  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!interactive) return;
    if (dragging.current) {
      dragging.current = false;
      select(pointerToIndex(e));
      if (e.pointerType !== "mouse") live.current.hover = null;
    }
    kickRef.current();
  };
  const onPointerLeave = () => {
    if (dragging.current) return;
    live.current.hover = null;
    kickRef.current();
  };
  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!interactive) return;
    const c = live.current.curve;
    let j = selected;
    if (e.key === "ArrowLeft" || e.key === "ArrowDown") j = selected - 1;
    else if (e.key === "ArrowRight" || e.key === "ArrowUp") j = selected + 1;
    else if (e.key === "PageDown") j = selected - 3;
    else if (e.key === "PageUp") j = selected + 3;
    else if (e.key === "Home") j = c.lo;
    else if (e.key === "End") j = c.hi;
    else return;
    e.preventDefault();
    live.current.hover = null;
    select(j);
  };

  const tx = textRgb;
  const chipBg = mixRgb([0, 0, 0], deltaRgb, 0.19);
  const cell = Math.min(size.w, size.h) * 0.0761;
  const m = Math.min(size.w, size.h);
  const labelTop = LABEL_BASE * s - BASE * labelPx;
  const figTop = FIG_BASE * s - BASE * figPx;
  const capTop = CAP_BASE * s - capLh / 2 - 0.3555 * capPx;
  const valueText = `${label} ${figure}, ${deltaText} ${word} ${tail}`;

  return (
    <div
      ref={rootRef}
      className={className}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        minHeight: 250,
        overflow: "hidden",
        background,
        fontFamily: font,
        ...style,
      }}
    >
      {grid && size.w > 0 ? (
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            backgroundImage:
              "linear-gradient(90deg, rgba(255, 255, 255, 0.06) 1px, rgba(255, 255, 255, 0) 1px), linear-gradient(180deg, rgba(255, 255, 255, 0.06) 1px, rgba(255, 255, 255, 0) 1px)",
            backgroundSize: `${cell}px ${cell}px`,
            maskImage: `radial-gradient(${m * 0.42}px ${m * 0.3}px at 100% 0%, #000, rgba(0, 0, 0, 0.35) 45%, transparent 100%)`,
            WebkitMaskImage: `radial-gradient(${m * 0.42}px ${m * 0.3}px at 100% 0%, #000, rgba(0, 0, 0, 0.35) 45%, transparent 100%)`,
          }}
        />
      ) : null}

      <div
        style={{
          position: "absolute",
          left,
          top,
          width: cw,
          height: ch,
          borderRadius: RADIUS * s,
          overflow: "hidden",
          background: cardColor,
          boxShadow: `0 0 0 1px rgba(255, 255, 255, 0.14), 0 ${18 * s}px ${48 * s}px rgba(0, 0, 0, 0.45)`,
          isolation: "isolate",
          visibility: cw > 0 ? "visible" : "hidden",
        }}
      >
        <canvas
          ref={fieldRef}
          aria-hidden
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }}
        />
        <canvas
          ref={mainRef}
          aria-hidden
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }}
        />

        <div
          ref={labelRef}
          style={{
            position: "absolute",
            left: PAD_X * s,
            top: labelTop,
            fontSize: labelPx,
            lineHeight: "1em",
            fontWeight: 400,
            letterSpacing: "-0.012em",
            color: css(tx, 0.72),
            whiteSpace: "nowrap",
            pointerEvents: "none",
          }}
        >
          {label}
        </div>

        <div
          aria-hidden
          style={{
            position: "absolute",
            left: PAD_X * s - 0.04 * figPx,
            top: figTop,
            fontSize: figPx,
            lineHeight: "1em",
            fontWeight: 500,
            color: css(tx, 1),
            whiteSpace: "nowrap",
            pointerEvents: "none",
            display: "flex",
            fontFeatureSettings: '"kern" 0',
          }}
        >
          <div ref={figRef} style={{ position: "relative", display: "flex", height: "1em" }} />
        </div>

        <div
          ref={capRef}
          style={{
            position: "absolute",
            left: PAD_X * s,
            top: capTop,
            width: Math.max(150 * s, Math.min(capPx * 14, (235 - PAD_X) * s)),
            fontSize: capPx,
            lineHeight: `${capLh}px`,
            letterSpacing: "-0.025em",
            color: css(tx, 0.6),
            pointerEvents: "none",
          }}
        >
          <span style={{ color: css(tx, 1), fontWeight: 500 }}>
            {deltaText} {word}
          </span>{" "}
          {tail}
        </div>

        {menu ? (
          onMenu ? (
            <button
              type="button"
              aria-label="More options"
              onClick={onMenu}
              style={{
                position: "absolute",
                left: (470.5 - 12) * s,
                top: (31.3 - 18) * s,
                width: 24 * s,
                height: 36 * s,
                padding: 0,
                border: 0,
                background: "transparent",
                cursor: "pointer",
                borderRadius: 8 * s,
              }}
            >
              <Dots s={s} color={css(tx, 1)} offsetX={12} offsetY={18} />
            </button>
          ) : (
            <div
              aria-hidden
              style={{
                position: "absolute",
                left: (470.5 - 12) * s,
                top: (31.3 - 18) * s,
                width: 24 * s,
                height: 36 * s,
                pointerEvents: "none",
              }}
            >
              <Dots s={s} color={css(tx, 1)} offsetX={12} offsetY={18} />
            </div>
          )
        ) : null}

        <div
          ref={chipRef}
          aria-hidden
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            height: Math.max(CHIP_H * s, chipPx * 1.95),
            padding: `0 ${Math.max(5.2 * s, chipPx * 0.5)}px`,
            display: "flex",
            alignItems: "center",
            borderRadius: 4.5 * s,
            background: css(chipBg, 1),
            boxShadow: `inset 0 0 0 1px ${css(mixRgb(deltaRgb, [255, 255, 255], 0.55), 0.25)}`,
            color: css(deltaRgb, 1),
            fontSize: chipPx,
            fontWeight: 500,
            letterSpacing: "0",
            pointerEvents: "none",
            opacity: 0,
            willChange: "transform",
          }}
        >
          <span
            ref={chipTextRef}
            style={{ position: "relative", display: "flex", height: "1em", lineHeight: "1em" }}
          />
          <ChipTail
            s={s}
            bg={css(chipBg, 1)}
            edge={css(mixRgb(deltaRgb, [255, 255, 255], 0.55), 0.25)}
          />
        </div>

        <div
          role="slider"
          tabIndex={interactive ? 0 : -1}
          aria-label={`${label} interactive chart`}
          aria-valuemin={curve.lo}
          aria-valuemax={curve.hi}
          aria-valuenow={selected}
          aria-valuetext={valueText}
          aria-disabled={interactive ? undefined : true}
          onPointerMove={onPointerMove}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerLeave}
          onPointerLeave={onPointerLeave}
          onKeyDown={onKeyDown}
          onFocus={(e) => {
            let v = true;
            try {
              v = e.currentTarget.matches(":focus-visible");
            } catch {
              /* ignore */
            }
            setFocusVisible(v);
          }}
          onBlur={() => setFocusVisible(false)}
          style={{
            position: "absolute",
            left: hitLeft,
            top: 0,
            right: 0,
            bottom: 0,
            outline: "none",
            cursor: interactive ? "crosshair" : "default",
            touchAction: "pan-y",
            WebkitTapHighlightColor: "transparent",
          }}
        />

        <span
          style={{
            position: "absolute",
            width: 1,
            height: 1,
            overflow: "hidden",
            clip: "rect(0 0 0 0)",
            whiteSpace: "nowrap",
          }}
        >
          {figure}
        </span>

        {children ? (
          <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
            <div style={{ position: "absolute", inset: 0, pointerEvents: "auto" }}>{children}</div>
          </div>
        ) : null}

        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "inherit",
            boxShadow: `inset 0 0 0 ${Math.max(1, 1.2 * s)}px rgba(132, 134, 142, 0.33)`,
            pointerEvents: "none",
          }}
        />
      </div>
    </div>
  );
}

function Dots({
  s,
  color,
  offsetX,
  offsetY,
}: {
  s: number;
  color: string;
  offsetX: number;
  offsetY: number;
}) {
  const r = 2.3 * s;
  return (
    <svg width={24 * s} height={36 * s} viewBox={`0 0 ${24 * s} ${36 * s}`} style={{ display: "block" }} aria-hidden>
      {[22.8, 31.3, 39.9].map((y) => (
        <circle key={y} cx={offsetX * s} cy={(y - 31.3 + offsetY) * s} r={r} fill={color} />
      ))}
    </svg>
  );
}

function ChipTail({ s, bg, edge }: { s: number; bg: string; edge: string }) {
  const w = 7 * s;
  const h = 3.6 * s;
  return (
    <svg
      width={w}
      height={h + 1}
      viewBox={`0 0 ${w} ${h + 1}`}
      aria-hidden
      style={{
        position: "absolute",
        left: "50%",
        bottom: -h + 0.5,
        transform: "translateX(-50%)",
        overflow: "visible",
      }}
    >
      <path d={`M0 0 L${w / 2} ${h} L${w} 0 Z`} fill={bg} />
      <path d={`M0 0 L${w / 2} ${h} L${w} 0`} fill="none" stroke={edge} strokeWidth={1} />
    </svg>
  );
}

export default MarketCard;
