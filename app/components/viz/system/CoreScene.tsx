"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import { usePalette, type Palette } from "@/app/components/viz/system/palette";
import {
  FROZEN_T,
  STAGE,
  buildTechGrid,
  radialTexture,
  smooth,
  stageP,
} from "@/app/components/viz/system/geometry";
import { SYS_SHARED } from "@/app/components/viz/system/sharedState";

export type ScenePointer = { x: number; y: number };

type Props = {
  pointerRef: React.RefObject<ScenePointer>;
  visRef: React.RefObject<boolean>;
  reduced: boolean;
};

/* ------------------------------------------------------------------ */
/*  PREMIUM HERO — VOLUMETRIC SCULPTURE                              */
/*  Depth-rich 3D geodesic sphere + layered wireframe + orbits        */
/* ------------------------------------------------------------------ */

const HERO_SPHERE_R = 1.36;
const PLATFORM_Y_LOCAL = -1.78;

type OrbitDef = {
  radius: number;
  euler: [number, number, number];
  accent: boolean;
  opacity: number;
  width: number;
  spin: number;
};

const ORBITS: OrbitDef[] = [
  { radius: HERO_SPHERE_R * 1.215, euler: [0.34, 0.16, 0], accent: true, opacity: 0.88, width: 1.42, spin: 0.006 },
  { radius: HERO_SPHERE_R * 1.38, euler: [1.18, 0.52, 0.12], accent: false, opacity: 0.34, width: 0.72, spin: -0.0045 },
  { radius: HERO_SPHERE_R * 1.56, euler: [-0.58, -0.46, 0.08], accent: false, opacity: 0.26, width: 0.62, spin: 0.0035 },
];

type NodeDef = {
  orbit: number;
  phaseDeg: number;
  tier: "primary" | "active";
  size: number;
  speed: number;
};

const NODES: NodeDef[] = [
  { orbit: 0, phaseDeg: 38, tier: "active", size: 0.028, speed: 0.26 },
  { orbit: 0, phaseDeg: 218, tier: "primary", size: 0.034, speed: 0.26 },
  { orbit: 1, phaseDeg: 124, tier: "primary", size: 0.026, speed: -0.18 },
  { orbit: 2, phaseDeg: 292, tier: "active", size: 0.024, speed: 0.13 },
];

/* ---------- organic warp — ultra subtle, prevents flat SVG ---------- */
function organicWarp(phi: number, theta: number): number {
  // ~1.2-1.8% radial — enough to break perfect circle, not noisy
  return (
    0.014 * Math.sin(theta * 3.0 + phi * 2.1) +
    0.009 * Math.cos(phi * 4.2 - theta * 1.7) +
    0.006 * Math.sin(theta * 5.0) * Math.sin(phi * 3.0)
  );
}

/* ---------- helpers: precise + deformed ---------- */

function latCirclePoints(R: number, latDeg: number, seg = 96): Array<[number, number, number]> {
  const phi = (latDeg * Math.PI) / 180;
  const r = R * Math.cos(phi);
  const y = R * Math.sin(phi);
  const pts: Array<[number, number, number]> = [];
  for (let i = 0; i < seg; i++) {
    const a = (i / seg) * Math.PI * 2;
    pts.push([Math.cos(a) * r, y, Math.sin(a) * r]);
  }
  return pts;
}

function lonMeridianPoints(R: number, lonDeg: number, seg = 96): Array<[number, number, number]> {
  const lam = (lonDeg * Math.PI) / 180;
  const cl = Math.cos(lam);
  const sl = Math.sin(lam);
  const pts: Array<[number, number, number]> = [];
  for (let i = 0; i < seg; i++) {
    const a = (i / seg) * Math.PI * 2;
    const ca = Math.cos(a);
    const sa = Math.sin(a);
    pts.push([ca * R * cl, sa * R, ca * R * sl]);
  }
  return pts;
}

function deformLinePoints(
  pts: Array<[number, number, number]>,
  baseR: number,
  amount = 1,
): Array<[number, number, number]> {
  return pts.map(([x, y, z]) => {
    const v = new THREE.Vector3(x, y, z);
    const len = Math.sqrt(x * x + y * y + z * z) || 1;
    const dir = v.clone().divideScalar(len);
    const phi = Math.acos(THREE.MathUtils.clamp(dir.y, -1, 1));
    const theta = Math.atan2(dir.z, dir.x);
    const warp = organicWarp(phi, theta) * amount;
    const r = baseR * (1 + warp);
    const s = r / len;
    return [x * s, y * s, z * s] as [number, number, number];
  });
}

function orbitCirclePoints(radius: number, seg = 192): Array<[number, number, number]> {
  const pts: Array<[number, number, number]> = [];
  for (let i = 0; i < seg; i++) {
    const a = (i / seg) * Math.PI * 2;
    pts.push([Math.cos(a) * radius, 0, Math.sin(a) * radius]);
  }
  return pts;
}

function fibonacciSpherePoints(count: number, R: number, warpAmp = 0): Float32Array {
  const arr = new Float32Array(count * 3);
  const ga = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y0 = 1 - (i / (count - 1)) * 2;
    const r0 = Math.sqrt(Math.max(0, 1 - y0 * y0));
    const theta = ga * i;
    const x0 = Math.cos(theta) * r0;
    const z0 = Math.sin(theta) * r0;
    let x = x0 * R;
    let y = y0 * R;
    let z = z0 * R;
    if (warpAmp !== 0) {
      const dir = new THREE.Vector3(x, y, z).normalize();
      const phi = Math.acos(THREE.MathUtils.clamp(dir.y, -1, 1));
      const th = Math.atan2(dir.z, dir.x);
      const warp = organicWarp(phi, th) * warpAmp;
      const s = 1 + warp;
      x *= s;
      y *= s;
      z *= s;
    }
    arr[i * 3] = x;
    arr[i * 3 + 1] = y;
    arr[i * 3 + 2] = z;
  }
  return arr;
}

function atmosphereDust(count: number): Float32Array {
  const arr = new Float32Array(count * 3);
  let s = 0x1a2b3c4d;
  const rnd = () => {
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    return ((s >>> 0) % 10000) / 10000;
  };
  for (let i = 0; i < count; i++) {
    const u = rnd() * Math.PI * 2;
    const rr = 2.55 + rnd() * 2.8;
    const y = (rnd() - 0.5) * 2.2;
    arr[i * 3] = Math.cos(u) * rr * (0.85 + rnd() * 0.3);
    arr[i * 3 + 1] = y * 0.6;
    arr[i * 3 + 2] = Math.sin(u) * rr * (0.85 + rnd() * 0.3);
  }
  return arr;
}

function darkCheck(pal: Palette) {
  return pal.bg.startsWith("rgb(10") || pal.bg.startsWith("rgb(12") || pal.bg.startsWith("rgb(26") || pal.bg.startsWith("rgb(42");
}

/* ------------------------------------------------------------------ */
/*  Background technical field — extremely subtle                     */
/* ------------------------------------------------------------------ */

function BackgroundField({ pal, reduced, visRef }: { pal: Palette; reduced: boolean; visRef: Props["visRef"] }) {
  const gridGeo = useMemo(() => buildTechGrid(9, 18), []);
  const dustPos = useMemo(() => atmosphereDust(95), []);
  const dustGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(dustPos, 3));
    return g;
  }, [dustPos]);

  const gridMatRef = useRef<THREE.LineBasicMaterial>(null);
  const dustMatRef = useRef<THREE.PointsMaterial>(null);
  const eased = useRef(0);

  useEffect(() => {
    return () => {
      gridGeo.dispose();
      dustGeo.dispose();
    };
  }, [gridGeo, dustGeo]);

  useFrame(({ clock }) => {
    if (!visRef.current) return;
    eased.current += (stageP(reduced ? 10 : clock.elapsedTime, STAGE.shell) - eased.current) * 0.08;
    const s = smooth(eased.current);
    if (gridMatRef.current) gridMatRef.current.opacity = 0.032 * s;
    if (dustMatRef.current) dustMatRef.current.opacity = 0.09 * s;
  });

  return (
    <group position={[0, PLATFORM_Y_LOCAL - 0.02, 0]}>
      <lineSegments geometry={gridGeo}>
        <lineBasicMaterial ref={gridMatRef} color={pal.lineMid} transparent opacity={0} depthWrite={false} />
      </lineSegments>
      <points geometry={dustGeo}>
        <pointsMaterial
          ref={dustMatRef}
          color={pal.white}
          size={0.009}
          transparent
          opacity={0}
          sizeAttenuation
          depthWrite={false}
        />
      </points>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[new Float32Array([-4.2, 0, 0, 4.2, 0, 0, 0, 0, -4.2, 0, 0, 4.2]), 3]} />
        </bufferGeometry>
        <lineBasicMaterial color={pal.lineMid} transparent opacity={0.018} depthWrite={false} />
      </lineSegments>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  Energy core — volumetric depth-rich sculpture                    */
/* ------------------------------------------------------------------ */

function EnergyCore({ pal, reduced, visRef }: { pal: Palette; reduced: boolean; visRef: Props["visRef"] }) {
  const shellMat = useRef<THREE.MeshStandardMaterial>(null);
  const rimMat = useRef<THREE.MeshBasicMaterial>(null);
  const pointsMat = useRef<THREE.PointsMaterial>(null);
  const innerPtsMatRef = useRef<THREE.PointsMaterial>(null);
  const innerGlowMat = useRef<THREE.SpriteMaterial>(null);
  const outerGlowMat = useRef<THREE.SpriteMaterial>(null);
  const sculptureRef = useRef<THREE.Group>(null);
  const crystalOuter = useRef<THREE.Group>(null);
  const crystalInner = useRef<THREE.Group>(null);
  const eased = useRef({ shell: 0, grat: 0, inner: 0, points: 0 });
  const hoverV = useRef(0);

  const R = HERO_SPHERE_R;

  // --- minimal graticule — strongly reduced to avoid moiré/noise ---
  const latLines = useMemo(() => {
    const baseR = R * 0.999;
    const lats = [-34, 0, 34];
    return lats.map((lat) => deformLinePoints(latCirclePoints(baseR, lat, 128), baseR, 0.65));
  }, [R]);
  const lonLines = useMemo(() => {
    const baseR = R * 0.999;
    const lons = [0, 90, 180];
    return lons.map((lon) => deformLinePoints(lonMeridianPoints(baseR, lon, 128), baseR, 0.65));
  }, [R]);

  // single central curvature axis — reads instantly as volume
  const centralAxis = useMemo(() => {
    const baseR = R * 1.001;
    const pts = lonMeridianPoints(baseR, 22, 168);
    return deformLinePoints(pts, baseR, 0.85);
  }, [R]);

  // --- sparse point cloud — reduced density, crisper in light ---
  const spherePointPos = useMemo(() => fibonacciSpherePoints(980, R * 0.9985, 0.65), [R]);
  const spherePointsGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(spherePointPos, 3));
    return g;
  }, [spherePointPos]);

  const innerPointsPos = useMemo(() => fibonacciSpherePoints(180, R * 0.72, 0.45), [R]);
  const innerPointsGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(innerPointsPos, 3));
    return g;
  }, [innerPointsPos]);

  // --- volumetric geodesic — single clean sculpture cage, sparse ---
  const outerGeodesic = useMemo(() => {
    const rad = R * 0.994;
    const geo = new THREE.IcosahedronGeometry(rad, 1);
    const pos = geo.attributes.position as THREE.BufferAttribute;
    const v = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i);
      const dir = v.clone().normalize();
      const phi = Math.acos(THREE.MathUtils.clamp(dir.y, -1, 1));
      const theta = Math.atan2(dir.z, dir.x);
      const warp = organicWarp(phi, theta) * 0.75;
      dir.multiplyScalar(rad * (1 + warp));
      pos.setXYZ(i, dir.x, dir.y, dir.z);
    }
    pos.needsUpdate = true;
    geo.computeVertexNormals();
    // higher threshold = fewer edges, sparser, less noisy
    const edges = new THREE.EdgesGeometry(geo, 0.95);
    geo.dispose();
    return edges;
  }, [R]);

  const midGeodesic = useMemo(() => {
    const rad = R * 0.83;
    const geo = new THREE.IcosahedronGeometry(rad, 0);
    const pos = geo.attributes.position as THREE.BufferAttribute;
    const v = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i);
      const dir = v.clone().normalize();
      const phi = Math.acos(THREE.MathUtils.clamp(dir.y, -1, 1));
      const theta = Math.atan2(dir.z, dir.x);
      const warp = organicWarp(phi, theta) * 0.5;
      dir.multiplyScalar(rad * (1 + warp));
      pos.setXYZ(i, dir.x, dir.y, dir.z);
    }
    pos.needsUpdate = true;
    const edges = new THREE.EdgesGeometry(geo, 1.1);
    geo.dispose();
    return edges;
  }, [R]);

  const outerMatRef = useRef<THREE.LineBasicMaterial>(null);
  const midMatRef = useRef<THREE.LineBasicMaterial>(null);
  const gratMatsLat = useRef<Array<THREE.LineBasicMaterial | null>>([]);
  const gratMatsLon = useRef<Array<THREE.LineBasicMaterial | null>>([]);
  const centralMatRef = useRef<THREE.LineBasicMaterial>(null);

  const glowTex = useMemo(() => {
    if (typeof document === "undefined") return null;
    return radialTexture([
      [0, "rgba(255,255,255,0.95)"],
      [0.26, "rgba(88,144,255,0.42)"],
      [0.52, "rgba(77,141,255,0.14)"],
      [1, "rgba(77,141,255,0)"],
    ]);
  }, []);
  const coreGlowTex = useMemo(() => {
    if (typeof document === "undefined") return null;
    return radialTexture([
      [0, "rgba(170,195,255,0.92)"],
      [0.34, "rgba(77,141,255,0.30)"],
      [1, "rgba(77,141,255,0)"],
    ]);
  }, []);

  const crystalEdges = useMemo(() => {
    const ico = new THREE.IcosahedronGeometry(0.26, 0);
    const oct = new THREE.OctahedronGeometry(0.16, 0);
    const e1 = new THREE.EdgesGeometry(ico);
    const e2 = new THREE.EdgesGeometry(oct);
    ico.dispose();
    oct.dispose();
    return { e1, e2 };
  }, []);

  useEffect(() => {
    return () => {
      spherePointsGeo.dispose();
      innerPointsGeo.dispose();
      outerGeodesic.dispose();
      midGeodesic.dispose();
      crystalEdges.e1.dispose();
      crystalEdges.e2.dispose();
      glowTex?.dispose();
      coreGlowTex?.dispose();
    };
  }, [spherePointsGeo, innerPointsGeo, outerGeodesic, midGeodesic, crystalEdges, glowTex, coreGlowTex]);

  useFrame(({ clock }) => {
    if (!visRef.current) return;
    const t = reduced ? FROZEN_T : clock.elapsedTime;
    const es = eased.current;
    es.shell += (stageP(reduced ? 10 : clock.elapsedTime, STAGE.shell) - es.shell) * 0.09;
    es.grat += (stageP(reduced ? 10 : clock.elapsedTime, STAGE.grat) - es.grat) * 0.09;
    es.inner += (stageP(reduced ? 10 : clock.elapsedTime, STAGE.nodes) - es.inner) * 0.10;
    es.points += (stageP(reduced ? 10 : clock.elapsedTime, STAGE.w) - es.points) * 0.08;
    const sShell = smooth(es.shell);
    const sGrat = smooth(es.grat);
    const sInner = smooth(es.inner);
    const sPts = smooth(es.points);

    hoverV.current += ((SYS_SHARED.hover.on ? 1 : 0) - hoverV.current) * 0.07;
    const hv = reduced ? 0 : hoverV.current;
    const isDark = darkCheck(pal);

    if (shellMat.current) {
      shellMat.current.opacity = (isDark ? 0.052 : 0.11) * sShell * (1 + hv * 0.2);
    }
    if (rimMat.current) rimMat.current.opacity = (isDark ? 0.13 : 0.20) * sShell;
    if (pointsMat.current) pointsMat.current.opacity = (isDark ? 0.20 : 0.42) * sPts * (0.9 + hv * 0.14);
    if (innerPtsMatRef.current) innerPtsMatRef.current.opacity = (isDark ? 0.10 : 0.22) * sPts;

    // layered wireframe — high contrast in light, subtle in dark
    if (outerMatRef.current) {
      outerMatRef.current.opacity = (isDark ? 0.30 : 0.58) * sGrat * (1 + hv * 0.10);
    }
    if (midMatRef.current) {
      midMatRef.current.opacity = (isDark ? 0.11 : 0.26) * sGrat * (1 + hv * 0.07);
    }
    gratMatsLat.current.forEach((m, i) => {
      if (!m) return;
      const isEquator = i === 1;
      const base = isEquator ? 0.30 : 0.24;
      m.opacity = (isDark ? 0.32 : 0.62) * base * sGrat * (1 + hv * 0.08);
    });
    gratMatsLon.current.forEach((m) => {
      if (!m) return;
      m.opacity = (isDark ? 0.32 : 0.62) * 0.22 * sGrat * (1 + hv * 0.06);
    });
    if (centralMatRef.current) {
      centralMatRef.current.opacity = (isDark ? 0.38 : 0.62) * 0.26 * sGrat * (1 + hv * 0.12);
    }

    // sculpture tilt — strong angled perspective, not front-on
    if (sculptureRef.current && !reduced) {
      // base tilt: x ~22°, y ~ -24°, z ~3° + slow organic orbit
      sculptureRef.current.rotation.x = 0.38 + Math.sin(t * 0.11) * 0.06 + Math.sin(t * 0.07) * 0.03;
      sculptureRef.current.rotation.y = -0.42 + Math.sin(t * 0.14) * 0.14 + t * 0.055;
      sculptureRef.current.rotation.z = 0.06 + Math.sin(t * 0.09) * 0.04;
    } else if (sculptureRef.current && reduced) {
      sculptureRef.current.rotation.set(0.38, -0.42, 0.06);
    }

    if (crystalOuter.current && !reduced) {
      crystalOuter.current.rotation.y = t * 0.18 + hv * 0.28;
      crystalOuter.current.rotation.x = Math.sin(t * 0.09) * 0.12;
      crystalOuter.current.rotation.z = t * 0.03;
    }
    if (crystalInner.current && !reduced) {
      crystalInner.current.rotation.y = -t * 0.28 - hv * 0.32;
      crystalInner.current.rotation.x = Math.sin(t * 0.13 + 0.6) * 0.16;
    }

    // subtle breathing of whole sculpture
    if (sculptureRef.current) {
      const pulse = 1 + (reduced ? 0 : 0.011 * Math.sin(t * 0.85) + hv * 0.009);
      sculptureRef.current.scale.setScalar(pulse);
    }

    if (outerGlowMat.current) {
      outerGlowMat.current.opacity = (0.12 + (reduced ? 0 : 0.03 * Math.sin(t * 0.8)) + hv * 0.055) * sInner;
    }
    if (innerGlowMat.current) {
      innerGlowMat.current.opacity = (0.30 + (reduced ? 0 : 0.05 * Math.sin(t * 1.05)) + hv * 0.12) * sInner;
    }
  });

  return (
    <group>
      {/* subtle glass volume — keeps silhouette spherical but lets wireframe show depth */}
      <mesh
        onPointerOver={() => {
          SYS_SHARED.hover.on = true;
        }}
        onPointerOut={() => {
          SYS_SHARED.hover.on = false;
        }}
      >
        <sphereGeometry args={[R, 64, 48]} />
        <meshStandardMaterial
          ref={shellMat}
          color={pal.sphere}
          transparent
          opacity={0}
          roughness={0.36}
          metalness={0.07}
          depthWrite={false}
          fog={true}
        />
      </mesh>

      {/* rim — BackSide reinforces perfect circular silhouette */}
      <mesh>
        <sphereGeometry args={[R * 0.985, 48, 32]} />
        <meshBasicMaterial ref={rimMat} color={pal.sphereRim} transparent opacity={0} side={THREE.BackSide} depthWrite={false} fog={false} />
      </mesh>

      {/* volumetric outer glow — restrained electric blue haze */}
      {glowTex && (
        <sprite scale={[R * 2.68, R * 2.68, 1]}>
          <spriteMaterial
            ref={outerGlowMat}
            map={glowTex}
            color={pal.accent}
            transparent
            opacity={0}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            fog={false}
          />
        </sprite>
      )}

      {/* depth points — sparser, larger for light-mode crispness */}
      <points geometry={spherePointsGeo}>
        <pointsMaterial
          ref={pointsMat}
          color={pal.white}
          size={0.016}
          transparent
          opacity={0}
          sizeAttenuation
          depthWrite={false}
          fog={true}
        />
      </points>

      <points geometry={innerPointsGeo}>
        <pointsMaterial
          ref={innerPtsMatRef}
          color={pal.white}
          size={0.013}
          transparent
          opacity={0}
          sizeAttenuation
          depthWrite={false}
          fog={true}
        />
      </points>

      {/* --- volumetric wireframe sculpture — layered depths --- */}
      <group ref={sculptureRef}>
        {/* mid geodesic — deeper, fainter, gives internal volume */}
        <lineSegments geometry={midGeodesic}>
          <lineBasicMaterial
            ref={midMatRef}
            color={pal.graphite}
            transparent
            opacity={0}
            depthTest={true}
            depthWrite={false}
            fog={true}
          />
        </lineSegments>

        {/* outer geodesic — primary sculpture cage, strong front, faint rear via fog/occlusion */}
        <lineSegments geometry={outerGeodesic}>
          <lineBasicMaterial
            ref={outerMatRef}
            color={pal.fg}
            transparent
            opacity={0}
            depthTest={true}
            depthWrite={false}
            fog={true}
          />
        </lineSegments>

        {/* deformed lat/lon — minimal, only 3+3 to avoid clutter */}
        {latLines.map((pts, i) => (
          <Line
            key={`lat-${i}`}
            points={pts}
            color={pal.fg}
            lineWidth={i === 1 ? 1.05 : 0.82}
            transparent
            opacity={0}
            depthTest={true}
            depthWrite={false}
            fog={true}
            ref={(el) => {
              const mat = el ? (el as unknown as { material: THREE.LineBasicMaterial }).material : null;
              if (mat) {
                mat.depthTest = true;
                mat.fog = true;
              }
              gratMatsLat.current[i] = mat;
            }}
          />
        ))}
        {lonLines.map((pts, i) => (
          <Line
            key={`lon-${i}`}
            points={pts}
            color={pal.fg}
            lineWidth={0.82}
            transparent
            opacity={0}
            depthTest={true}
            depthWrite={false}
            fog={true}
            ref={(el) => {
              const mat = el ? (el as unknown as { material: THREE.LineBasicMaterial }).material : null;
              if (mat) {
                mat.depthTest = true;
                mat.fog = true;
              }
              gratMatsLon.current[i] = mat;
            }}
          />
        ))}

        {/* central curvature axis — subtle volume read */}
        <Line
          points={centralAxis}
          color={pal.fg}
          lineWidth={1.15}
          transparent
          opacity={0}
          depthTest={true}
          depthWrite={false}
          fog={true}
          ref={(el) => {
            const mat = el ? (el as unknown as { material: THREE.LineBasicMaterial }).material : null;
            if (mat) {
              mat.depthTest = true;
              mat.fog = true;
            }
            centralMatRef.current = mat;
          }}
        />

      </group>

      {/* internal crystalline core — minimal, precise */}
      <group position={[0, 0, 0]}>
        <group ref={crystalOuter}>
          <lineSegments geometry={crystalEdges.e1}>
            <lineBasicMaterial color={pal.accent} transparent opacity={0.62} depthWrite={false} fog={false} />
          </lineSegments>
        </group>
        <group ref={crystalInner}>
          <lineSegments geometry={crystalEdges.e2}>
            <lineBasicMaterial color={pal.white} transparent opacity={0.22} depthWrite={false} fog={false} />
          </lineSegments>
        </group>
        {coreGlowTex && (
          <sprite scale={[0.62, 0.62, 1]}>
            <spriteMaterial
              ref={innerGlowMat}
              map={coreGlowTex}
              color={pal.accent}
              transparent
              opacity={0}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
              fog={false}
            />
          </sprite>
        )}
        <pointLight color={pal.accent} intensity={1.15} distance={2.1} decay={2} />
        <mesh>
          <octahedronGeometry args={[0.044, 0]} />
          <meshStandardMaterial color={pal.accent} emissive={pal.accent} emissiveIntensity={0.68} transparent opacity={0.9} roughness={0.35} />
        </mesh>
      </group>

      <mesh
        onPointerOver={() => {
          SYS_SHARED.hover.on = true;
        }}
        onPointerOut={() => {
          SYS_SHARED.hover.on = false;
        }}
      >
        <sphereGeometry args={[R * 1.03, 16, 12]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} fog={false} />
      </mesh>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  Orbital field — 3 precise elliptical trajectories + nodes         */
/* ------------------------------------------------------------------ */

function OrbitalField({ pal, reduced, visRef }: { pal: Palette; reduced: boolean; visRef: Props["visRef"] }) {
  const orbitGroups = useRef<Array<THREE.Group | null>>([]);
  const lineMats = useRef<Array<THREE.LineBasicMaterial | null>>([]);
  const nodeRefs = useRef<Array<THREE.Mesh | null>>([]);
  const spriteRefs = useRef<Array<THREE.Sprite | null>>([]);
  const quats = useRef(ORBITS.map(() => new THREE.Quaternion()));
  const eulers = useRef(ORBITS.map(() => new THREE.Euler()));
  const tmp = useRef(new THREE.Vector3());
  const eased = useRef({ rings: 0, nodes: 0 });

  const orbitPts = useMemo(() => ORBITS.map((o) => orbitCirclePoints(o.radius, 192)), []);

  const nodeGlowTex = useMemo(() => {
    if (typeof document === "undefined") return null;
    return radialTexture([
      [0, "rgba(255,255,255,0.88)"],
      [0.36, "rgba(77,141,255,0.22)"],
      [1, "rgba(77,141,255,0)"],
    ]);
  }, []);
  const whiteGlowTex = useMemo(() => {
    if (typeof document === "undefined") return null;
    return radialTexture([
      [0, "rgba(255,255,255,0.92)"],
      [0.42, "rgba(255,255,255,0.14)"],
      [1, "rgba(255,255,255,0)"],
    ]);
  }, []);

  useEffect(() => () => {
    nodeGlowTex?.dispose();
    whiteGlowTex?.dispose();
  }, [nodeGlowTex, whiteGlowTex]);

  useFrame(({ clock }) => {
    if (!visRef.current) return;
    const t = reduced ? FROZEN_T : clock.elapsedTime;
    const es = eased.current;
    es.rings += (stageP(reduced ? 10 : clock.elapsedTime, STAGE.rings) - es.rings) * 0.11;
    es.nodes += (stageP(reduced ? 10 : clock.elapsedTime, STAGE.nodes) - es.nodes) * 0.11;
    const eR = smooth(es.rings);
    const eN = smooth(es.nodes);

    ORBITS.forEach((o, i) => {
      const g = orbitGroups.current[i];
      if (!g) return;
      g.rotation.set(o.euler[0], o.euler[1] + (reduced ? 0 : t * o.spin), o.euler[2]);
      const m = lineMats.current[i];
      if (m) m.opacity = o.opacity * eR;
    });

    eulers.current.forEach((e, i) => {
      e.set(ORBITS[i].euler[0], ORBITS[i].euler[1] + (reduced ? 0 : t * ORBITS[i].spin), ORBITS[i].euler[2]);
      quats.current[i].setFromEuler(e);
    });

    NODES.forEach((nd, idx) => {
      const mesh = nodeRefs.current[idx];
      if (!mesh) return;
      const o = ORBITS[nd.orbit];
      const traveling = reduced ? 0 : t * nd.speed * 60;
      const aDeg = nd.phaseDeg + traveling;
      const a = (aDeg * Math.PI) / 180;
      tmp.current.set(Math.cos(a) * o.radius, 0, Math.sin(a) * o.radius);
      tmp.current.applyQuaternion(quats.current[nd.orbit]);
      mesh.position.copy(tmp.current);
      const pulse = nd.tier === "primary" ? 1 : 1 + (reduced ? 0 : 0.07 * Math.sin(t * 1.4 + idx * 0.9));
      mesh.scale.setScalar(nd.size * (0.42 + 0.58 * eN) * pulse);
      const spr = spriteRefs.current[idx];
      if (spr) {
        const gm = spr.material as THREE.SpriteMaterial;
        const base = nd.tier === "active" ? 0.38 : 0.28;
        gm.opacity = base * eN * (1 + (reduced ? 0 : 0.12 * Math.sin(t * 1.15 + idx)));
        spr.position.copy(tmp.current);
      }
    });
  });

  return (
    <group>
      {ORBITS.map((o, i) => (
        <group key={i} ref={(el) => { orbitGroups.current[i] = el; }}>
          <Line
            points={orbitPts[i]}
            color={o.accent ? pal.accent : pal.lineStrong}
            lineWidth={o.accent ? 1.48 : o.width}
            transparent
            opacity={0}
            depthWrite={false}
            fog={true}
            ref={(el) => {
              lineMats.current[i] = el ? (el as unknown as { material: THREE.LineBasicMaterial }).material : null;
            }}
          />
        </group>
      ))}

      {NODES.map((nd, idx) => {
        const isActive = nd.tier === "active";
        const color = isActive ? pal.accent : pal.white;
        return (
          <mesh key={idx} ref={(el) => { nodeRefs.current[idx] = el; }}>
            <sphereGeometry args={[1, 14, 12]} />
            {isActive ? (
              <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.58} roughness={0.38} />
            ) : (
              <meshStandardMaterial color={color} roughness={0.28} metalness={0.42} />
            )}
          </mesh>
        );
      })}
      {NODES.map((nd, idx) => {
        const tex = nd.tier === "active" ? nodeGlowTex : whiteGlowTex;
        if (!tex) return null;
        return (
          <sprite
            key={`glow-${idx}`}
            scale={nd.tier === "active" ? [0.30, 0.30, 1] : [0.36, 0.36, 1]}
            ref={(el) => {
              spriteRefs.current[idx] = el;
            }}
          >
            <spriteMaterial
              map={tex}
              color={nd.tier === "active" ? pal.accent : pal.white}
              transparent
              opacity={0}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
              fog={false}
            />
          </sprite>
        );
      })}
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  System root — parallax rig + strong perspective                  */
/* ------------------------------------------------------------------ */

function SystemRoot(props: Props) {
  const pal = usePalette();
  const rig = useRef<THREE.Group>(null);
  const cur = useRef({ ry: 0, rx: 0, cx: 0, cy: 0 });

  useFrame(({ camera, clock }, rawDelta) => {
    if (!props.visRef.current) return;
    const dt = Math.min(rawDelta || 0.016, 0.05);
    const t = props.reduced ? FROZEN_T : clock.elapsedTime;
    const p = props.pointerRef.current ?? { x: 0, y: 0 };
    const k = 1 - Math.exp(-dt * (props.reduced ? 60 : 3.0));
    const c = cur.current;
    c.ry += ((props.reduced ? 0 : p.x * 0.055) - c.ry) * k;
    c.rx += ((props.reduced ? 0 : p.y * 0.028) - c.rx) * k;
    c.cx += ((props.reduced ? 0 : p.x * 0.16) - c.cx) * k;
    c.cy += ((props.reduced ? 0 : -p.y * 0.08) - c.cy) * k;
    if (rig.current) {
      rig.current.rotation.y = c.ry;
      rig.current.rotation.x = c.rx;
    }
    // subtle camera floating — enhances parallax depth
    const fx = props.reduced ? 0 : Math.sin(t * 0.11) * 0.03;
    const fy = props.reduced ? 0 : Math.sin(t * 0.08 + 0.9) * 0.02;
    camera.position.set(c.cx + fx, 0.88 + c.cy + fy, 9.6);
    camera.lookAt(0.42, -0.04, 0);
  });

  return (
    <group ref={rig}>
      <BackgroundField pal={pal} reduced={props.reduced} visRef={props.visRef} />
      <group position={[0.44, -0.04, 0]}>
        <EnergyCore pal={pal} reduced={props.reduced} visRef={props.visRef} />
        <OrbitalField pal={pal} reduced={props.reduced} visRef={props.visRef} />
      </group>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  Canvas entry — stronger perspective FOV + tighter fog for depth  */
/* ------------------------------------------------------------------ */

export default function CoreScene({ pointerRef, visRef, reduced }: Props) {
  const pal = usePalette();
  return (
    <Canvas
      dpr={[1, 1.9]}
      camera={{ fov: 35, near: 0.1, far: 40, position: [0, 0.88, 9.6] }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.NoToneMapping;
      }}
    >
      {/* tighter fog → strong depth cue: front crisp, rear fades */}
      <fog attach="fog" args={[pal.bg, 8.8, 15.2]} />
      <ambientLight intensity={0.72} />
      <hemisphereLight args={[pal.white, pal.sphereRim, 0.62]} />
      <directionalLight position={[-2.2, 3.4, 2.8]} intensity={0.92} />
      <directionalLight position={[2.4, -0.5, -1.4]} intensity={0.14} />
      {/* rim light to carve volume */}
      <directionalLight position={[ -1.8, -0.6, -2.2 ]} intensity={0.22} color={pal.accent} />
      <pointLight position={[0.44, -0.04, 0]} intensity={0.58} distance={3.8} decay={2} color={pal.accent} />
      <SystemRoot pointerRef={pointerRef} visRef={visRef} reduced={reduced} />
    </Canvas>
  );
}
