import * as THREE from "three";

/* Scene geometry builders — WISTFY CORE: smoky volumetric sphere,
   irregular parametric contours, warped data-stream orbits, internal
   crystal and technical field. Legacy helpers retained for fallback. */

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

/* ------------------------------------------------------------------ */
/* WISTFY CORE — irregular surface geometry, warped orbits, particles */
/* ------------------------------------------------------------------ */

function toRad(d: number) {
  return (d * Math.PI) / 180;
}

/** Latitude arc: incomplete contour at given latitude with micro-wobble. */
export function latArc(
  R: number,
  latDeg: number,
  lonFromDeg: number,
  lonToDeg: number,
  seg = 48,
  wobbleAmp = 0,
): Array<[number, number, number]> {
  const pts: Array<[number, number, number]> = [];
  const phi0 = toRad(latDeg);
  const dLon = toRad(lonToDeg - lonFromDeg);
  for (let i = 0; i <= seg; i++) {
    const t = i / seg;
    const lam = toRad(lonFromDeg) + dLon * t;
    const wob = wobbleAmp ? wobbleAmp * Math.sin(t * Math.PI * 2.2 + latDeg * 0.07) : 0;
    const phi = phi0 + toRad(wob);
    const r = R * Math.cos(phi);
    const y = R * Math.sin(phi);
    pts.push([Math.cos(lam) * r, y, Math.sin(lam) * r]);
  }
  return pts;
}

/** Longitude / meridian arc: vertical contour fragment. */
export function lonArc(
  R: number,
  lonDeg: number,
  latFromDeg: number,
  latToDeg: number,
  seg = 48,
  wobbleAmp = 0,
): Array<[number, number, number]> {
  const pts: Array<[number, number, number]> = [];
  const lam0 = toRad(lonDeg);
  for (let i = 0; i <= seg; i++) {
    const t = i / seg;
    const lat = latFromDeg + (latToDeg - latFromDeg) * t;
    const wob = wobbleAmp ? wobbleAmp * Math.sin(t * Math.PI * 1.8 + lonDeg * 0.05) : 0;
    const phi = toRad(lat + wob);
    const lam = lam0 + toRad(wob * 0.25);
    const r = R * Math.cos(phi);
    const y = R * Math.sin(phi);
    pts.push([Math.cos(lam) * r, y, Math.sin(lam) * r]);
  }
  return pts;
}

/** Oblique great-circle fragment between two lat/lon points with slight bulge. */
export function greatCircleArc(
  R: number,
  lat0Deg: number,
  lon0Deg: number,
  lat1Deg: number,
  lon1Deg: number,
  seg = 40,
  bulgeDeg = 0,
): Array<[number, number, number]> {
  const toVec = (lat: number, lon: number) => {
    const phi = toRad(lat);
    const lam = toRad(lon);
    const cp = Math.cos(phi);
    return new THREE.Vector3(cp * Math.cos(lam), Math.sin(phi), cp * Math.sin(lam)).multiplyScalar(R);
  };
  const a = toVec(lat0Deg, lon0Deg);
  const b = toVec(lat1Deg, lon1Deg);
  const pts: Array<[number, number, number]> = [];
  for (let i = 0; i <= seg; i++) {
    const t = i / seg;
    const v = new THREE.Vector3().lerpVectors(a, b, t);
    // bulge: push outward along normal at mid
    if (bulgeDeg) {
      const bulge = Math.sin(Math.PI * t) * toRad(bulgeDeg) * R;
      v.normalize().multiplyScalar(R + bulge);
    } else v.normalize().multiplyScalar(R);
    pts.push([v.x, v.y, v.z]);
  }
  return pts;
}

/** Extension tip — line that slightly escapes the sphere surface. */
export function outwardExtension(
  R: number,
  latDeg: number,
  lonDeg: number,
  extra: number,
  seg = 10,
): Array<[number, number, number]> {
  const phi = toRad(latDeg);
  const lam = toRad(lonDeg);
  const base: [number, number, number] = [
    Math.cos(phi) * Math.cos(lam) * R,
    Math.sin(phi) * R,
    Math.cos(phi) * Math.sin(lam) * R,
  ];
  const dir = new THREE.Vector3(base[0], base[1], base[2]).normalize();
  const pts: Array<[number, number, number]> = [base];
  for (let i = 1; i <= seg; i++) {
    const t = i / seg;
    const r = R + extra * t;
    pts.push([dir.x * r, dir.y * r, dir.z * r]);
  }
  return pts;
}

/** Warped ellipse — elliptical orbit with radial wobble + gravitational dip. */
export function warpedEllipse(
  rx: number,
  rz: number,
  seg = 128,
  warpAmp = 0.06,
  warpFreq = 2,
  dipThetaDeg: number | null = null,
  dipDepth = 0.18,
): Array<[number, number, number]> {
  const pts: Array<[number, number, number]> = [];
  for (let i = 0; i < seg; i++) {
    const a = (i / seg) * Math.PI * 2;
    let mr = 1 + warpAmp * Math.sin(a * warpFreq + 0.7) + warpAmp * 0.6 * Math.cos(a * 3.1);
    if (dipThetaDeg !== null) {
      const dipTh = toRad(dipThetaDeg);
      const da = Math.atan2(Math.sin(a - dipTh), Math.cos(a - dipTh));
      mr -= dipDepth * Math.exp(-(da * da) * 8);
    }
    pts.push([Math.cos(a) * rx * mr, 0, Math.sin(a) * rz * mr]);
  }
  return pts;
}

/** Split a closed warped ellipse into broken segments with gaps. */
export function brokenWarpedSegments(
  rx: number,
  rz: number,
  gaps: Array<[number, number]>,
  seg = 128,
  warpAmp = 0.07,
): Array<Array<[number, number, number]>> {
  const full = warpedEllipse(rx, rz, seg, warpAmp);
  const gapSet = new Set<number>();
  for (const [g0, g1] of gaps) {
    const a0 = Math.round((g0 / 360) * seg);
    const a1 = Math.round((g1 / 360) * seg);
    for (let k = a0; k < a1; k++) gapSet.add(((k % seg) + seg) % seg);
  }
  const segs: Array<Array<[number, number, number]>> = [];
  let cur: Array<[number, number, number]> = [];
  for (let i = 0; i < seg; i++) {
    if (gapSet.has(i)) {
      if (cur.length > 1) segs.push(cur);
      cur = [];
      continue;
    }
    cur.push(full[i]);
  }
  if (cur.length) segs.push(cur);
  // close segments that wrap? Already handled
  return segs.filter((s) => s.length > 4);
}

/** Faint internal particles — random points inside sphere volume. */
export function coreParticlePositions(count: number, r: number): Float32Array {
  const arr = new Float32Array(count * 3);
  // deterministic pseudo-random for stable render
  let s = 0x9e3779b1;
  const rnd = () => {
    s ^= s << 13; s ^= s >>> 17; s ^= s << 5;
    return ((s >>> 0) % 10000) / 10000;
  };
  for (let i = 0; i < count; i++) {
    // uniform inside sphere via cube root
    const u = rnd(); const v = rnd(); const w = rnd();
    const theta = 2 * Math.PI * u;
    const phi = Math.acos(2 * v - 1);
    const rad = Math.cbrt(w) * r * 0.86;
    arr[i * 3] = rad * Math.sin(phi) * Math.cos(theta);
    arr[i * 3 + 1] = rad * Math.sin(phi) * Math.sin(theta) * 0.9;
    arr[i * 3 + 2] = rad * Math.cos(phi);
  }
  return arr;
}

/** Background technical grid — large faint construction plane. */
export function buildTechGrid(size: number, divisions: number): THREE.BufferGeometry {
  const half = size / 2;
  const step = size / divisions;
  const pts: number[] = [];
  for (let i = 0; i <= divisions; i++) {
    const c = -half + i * step;
    // horizontal
    pts.push(-half, 0, c, half, 0, c);
    // vertical
    pts.push(c, 0, -half, c, 0, half);
  }
  // few extended construction axes
  pts.push(-half, 0, 0, half, 0, 0);
  pts.push(0, 0, -half, 0, 0, half);
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(pts), 3));
  return g;
}
