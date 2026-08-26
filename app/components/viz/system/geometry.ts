import * as THREE from "three";

/* Scene geometry builders — tuned to the SYS.FIELD reference:
   pearl sphere, fine graticule, sweeping elliptical orbits, vertical
   axis, concentric platform. */

export const SPHERE_R = 1.08;
export const PLATFORM_Y = -1.78;

/* intro timeline — staged materialization ~1.6 s */
export const STAGE = {
  shell: 0.15,
  grat: 0.3,
  rings: 0.35,
  w: 0.5,
  nodes: 0.55,
  energy: 0.95,
} as const;
export const STAGE_DUR = 0.5;

/* frozen clock so reduced-motion still lands on a composed frame */
export const FROZEN_T = 7.31;

export const smooth = (t: number) => t * t * (3 - 2 * t);

export const stageP = (t: number, start: number) =>
  Math.max(0, Math.min(1, (t - start) / STAGE_DUR));

/* ---------- sphere graticule ---------- */

export function sphereWirePositions(
  R: number,
  latsDeg: number[],
  meridians: number,
  seg = 72,
): Float32Array {
  const out: number[] = [];
  const push = (p: number[]) => out.push(p[0], p[1], p[2]);
  for (const deg of latsDeg) {
    const phi = (deg * Math.PI) / 180;
    const r = R * Math.cos(phi);
    const h = R * Math.sin(phi);
    for (let i = 0; i < seg; i++) {
      const a0 = (i / seg) * Math.PI * 2;
      const a1 = ((i + 1) / seg) * Math.PI * 2;
      push([Math.cos(a0) * r, h, Math.sin(a0) * r]);
      push([Math.cos(a1) * r, h, Math.sin(a1) * r]);
    }
  }
  for (let m = 0; m < meridians; m++) {
    const lam = (m / meridians) * Math.PI;
    for (let i = 0; i < seg; i++) {
      const a0 = (i / seg) * Math.PI * 2;
      const a1 = ((i + 1) / seg) * Math.PI * 2;
      push([
        R * Math.sin(a0) * Math.cos(lam),
        R * Math.cos(a0),
        R * Math.sin(a0) * Math.sin(lam),
      ]);
      push([
        R * Math.sin(a1) * Math.cos(lam),
        R * Math.cos(a1),
        R * Math.sin(a1) * Math.sin(lam),
      ]);
    }
  }
  return new Float32Array(out);
}

/* ---------- orbital paths ---------- */

export function ellipseClosed(
  rx: number,
  rz: number,
  seg = 128,
): Array<[number, number, number]> {
  const pts: Array<[number, number, number]> = [];
  for (let i = 0; i < seg; i++) {
    const a = (i / seg) * Math.PI * 2;
    pts.push([Math.cos(a) * rx, 0, Math.sin(a) * rz]);
  }
  return pts;
}

export function arcSubset(
  rx: number,
  rz: number,
  startDeg: number,
  endDeg: number,
  seg = 64,
): Array<[number, number, number]> {
  const pts: Array<[number, number, number]> = [];
  const a0 = (startDeg * Math.PI) / 180;
  const a1 = (endDeg * Math.PI) / 180;
  for (let i = 0; i <= seg; i++) {
    const a = a0 + ((a1 - a0) * i) / seg;
    pts.push([Math.cos(a) * rx, 0, Math.sin(a) * rz]);
  }
  return pts;
}

/* ---------- vertical axis with tick crosses ---------- */

export function buildAxisGeometry(
  bottom: number,
  top: number,
  ticks: number[],
  tickSize = 0.055,
): THREE.BufferGeometry {
  const pts: number[] = [0, bottom, 0, 0, top, 0];
  for (const y of ticks) {
    pts.push(-tickSize, y, 0, tickSize, y, 0);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(pts), 3));
  return g;
}

/* diamond marker outline in the XY plane */
export function diamondPoints(r: number): Array<[number, number, number]> {
  return [
    [0, r, 0],
    [r, 0, 0],
    [0, -r, 0],
    [-r, 0, 0],
    [0, r, 0],
  ];
}

/* ---------- platform ---------- */

export function buildPlatformGeometry(): THREE.BufferGeometry {
  const pts: number[] = [];
  const seg = 96;

  for (const r of [0.52, 0.88, 1.26, 1.68]) {
    for (let i = 0; i < seg; i++) {
      const a0 = (i / seg) * Math.PI * 2;
      const a1 = ((i + 1) / seg) * Math.PI * 2;
      pts.push(
        Math.cos(a0) * r,
        0,
        Math.sin(a0) * r,
        Math.cos(a1) * r,
        0,
        Math.sin(a1) * r,
      );
    }
  }
  for (let i = 0; i < 24; i++) {
    const a = (i / 24) * Math.PI * 2;
    const c = Math.cos(a);
    const s = Math.sin(a);
    pts.push(c * 1.68, 0, s * 1.68, c * 1.74, 0, s * 1.74);
  }
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2;
    const cx = Math.cos(a) * 1.68;
    const cz = Math.sin(a) * 1.68;
    pts.push(cx - 0.045, 0, cz, cx + 0.045, 0, cz);
    pts.push(cx, 0, cz - 0.045, cx, 0, cz + 0.045);
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(pts), 3));
  return geo;
}

/* ---------- the mark — faint W heart inside the core ---------- */

const W_PATH_2D: Array<[number, number]> = [
  [0, 0],
  [58, 264],
  [151, 110],
  [232, 264],
  [300, 10],
];

export const W_MARK: Array<[number, number, number]> = W_PATH_2D.map(([x, y]) => [
  (x - 150) * 0.0048,
  -(y - 132) * 0.0048,
  -0.15,
]);

export function radialTexture(stops: Array<[number, string]>): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  for (const [at, col] of stops) g.addColorStop(at, col);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}
