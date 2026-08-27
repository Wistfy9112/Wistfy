"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import { usePalette, type Palette } from "@/app/components/viz/system/palette";
import {
  FROZEN_T,
  PLATFORM_Y,
  SPHERE_R,
  STAGE,
  brokenWarpedSegments,
  buildTechGrid,
  coreParticlePositions,
  greatCircleArc,
  latArc,
  lonArc,
  outwardExtension,
  radialTexture,
  smooth,
  stageP,
  warpedEllipse,
} from "@/app/components/viz/system/geometry";
import { SYS_SHARED } from "@/app/components/viz/system/sharedState";

export type ScenePointer = { x: number; y: number };

type Props = {
  pointerRef: React.RefObject<ScenePointer>;
  visRef: React.RefObject<boolean>;
  reduced: boolean;
};

/* ------------------------------------------------------------------ */
/*  WISTFY CORE — orbital definitions: warped data streams             */
/* ------------------------------------------------------------------ */

type OrbitDef = {
  rx: number;
  rz: number;
  tx: number;
  tz: number;
  ty: number;
  spin: number;
  phase: number;
  warp: number;
  dipDeg: number | null;
  broken?: Array<[number, number]>;
  accent?: boolean;
  opacity: number;
};

const ORBITS: OrbitDef[] = [
  // hero — precise electric-blue, gently warped, shallow tilt
  { rx: 2.32, rz: 1.46, tx: 0.24, tz: -0.11, ty: 0.06, spin: 0.014, phase: 0, warp: 0.045, dipDeg: 38, opacity: 0.92, accent: true },
  // steep graphite — near-vertical, tight to core
  { rx: 1.62, rz: 2.36, tx: 1.18, tz: 0.44, ty: -0.08, spin: -0.012, phase: 1.22, warp: 0.07, dipDeg: null, opacity: 0.22 },
  // outer broken — largest but fragmented, perspective bend inward
  { rx: 2.52, rz: 1.68, tx: 0.31, tz: 0.14, ty: 0.04, spin: -0.0075, phase: 0.62, warp: 0.10, dipDeg: 118, broken: [[18, 46],[138,168],[262,292]], opacity: 0.18 },
  // counter-tilt broken — intersects hero
  { rx: 2.02, rz: 1.86, tx: 0.38, tz: -0.58, ty: -0.06, spin: 0.01, phase: 2.42, warp: 0.08, dipDeg: 212, broken: [[72,112],[228,268]], opacity: 0.20 },
  // escaping graphite — dips toward core (gravitational pull)
  { rx: 2.78, rz: 1.34, tx: 0.18, tz: 0.32, ty: 0.11, spin: -0.0055, phase: 3.04, warp: 0.12, dipDeg: 302, opacity: 0.14 },
  // inner faint graphite — passes through volume
  { rx: 1.92, rz: 1.52, tx: 0.52, tz: 0.02, ty: 0.02, spin: 0.009, phase: 1.78, warp: 0.06, dipDeg: null, opacity: 0.16 },
];

/* Node hierarchy — intentional asymmetry, not even spacing */
type NodeTier = "primary" | "secondary" | "active";
type NodeDef = { orbit: number; tDeg: number; tier: NodeTier; size: number };

const NODES: NodeDef[] = [
  // primary — small white metallic with soft glow (2)
  { orbit: 0, tDeg: 324, tier: "primary", size: 0.042 },
  { orbit: 3, tDeg: 38, tier: "primary", size: 0.038 },
  { orbit: 1, tDeg: 208, tier: "primary", size: 0.036 },
  // active — restrained electric blue (3)
  { orbit: 0, tDeg: 72, tier: "active", size: 0.032 },
  { orbit: 2, tDeg: 192, tier: "active", size: 0.028 },
  { orbit: 5, tDeg: 118, tier: "active", size: 0.030 },
  // secondary — tiny graphite almost invisible (5)
  { orbit: 1, tDeg: 82, tier: "secondary", size: 0.016 },
  { orbit: 2, tDeg: 306, tier: "secondary", size: 0.014 },
  { orbit: 3, tDeg: 162, tier: "secondary", size: 0.015 },
  { orbit: 4, tDeg: 247, tier: "secondary", size: 0.013 },
  { orbit: 5, tDeg: 284, tier: "secondary", size: 0.015 },
];

/* ------------------------------------------------------------------ */
/*  Background technical field — layer 1 faint grid + construction     */
/* ------------------------------------------------------------------ */

function BackgroundField({ pal, reduced, visRef }: { pal: Palette; reduced: boolean; visRef: Props["visRef"] }) {
  const gridGeo = useMemo(() => buildTechGrid(9, 18), []);
  const matRef = useRef<THREE.LineBasicMaterial>(null);
  const eased = useRef(0);
  useEffect(() => () => { gridGeo.dispose(); }, [gridGeo]);
  useFrame(({ clock }) => {
    if (!visRef.current) return;
    eased.current += (stageP(reduced ? 10 : clock.elapsedTime, STAGE.shell) - eased.current) * 0.08;
    if (matRef.current) matRef.current.opacity = 0.035 * smooth(eased.current);
  });
  return (
    <group position={[0, PLATFORM_Y - 0.02, 0]}>
      <lineSegments geometry={gridGeo}>
        <lineBasicMaterial ref={matRef} color={pal.lineMid} transparent opacity={0} depthWrite={false} />
      </lineSegments>
      {/* subtle cross — construction center mark */}
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[new Float32Array([-4.5,0,0, 4.5,0,0, 0,0,-4.5, 0,0,4.5]), 3]} />
        </bufferGeometry>
        <lineBasicMaterial color={pal.lineMid} transparent opacity={0.025} depthWrite={false} />
      </lineSegments>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  WISTFY CORE — smoky volumetric sphere + irregular contours       */
/*              + inner structural cage + particles + crystal         */
/* ------------------------------------------------------------------ */

function WistfyCore({ pal, reduced, visRef }: { pal: Palette; reduced: boolean; visRef: Props["visRef"] }) {
  const shellMat = useRef<THREE.MeshPhysicalMaterial>(null);
  const innerShellMat = useRef<THREE.MeshStandardMaterial>(null);
  const rimMat = useRef<THREE.MeshBasicMaterial>(null);
  const particleMat = useRef<THREE.PointsMaterial>(null);
  const innerRef = useRef<THREE.Group>(null);
  const crystalOuter = useRef<THREE.Group>(null);
  const crystalInner = useRef<THREE.Group>(null);
  const outerGlowMat = useRef<THREE.SpriteMaterial>(null);
  const innerGlowMat = useRef<THREE.SpriteMaterial>(null);
  const eased = useRef({ shell: 0, grat: 0, inner: 0, particles: 0 });
  const hoverV = useRef(0);

  // build irregular contour point sets — useMemo stable
  const contours = useMemo(() => {
    const R = SPHERE_R * 1.0015;
    return {
      // outer surface — incomplete arcs, asymmetric, micro-wobble
      outer: [
        { pts: latArc(R, 52, -42, 108, 44, 3.2), w: 0.9, op: 1 },
        { pts: latArc(R, 28, 18, 168, 52, 2.4), w: 0.85, op: 0.95 },
        { pts: latArc(R, 12, -128, 42, 46, 2.8), w: 0.85, op: 0.9 },
        { pts: latArc(R, -14, 22, 142, 40, 1.8), w: 0.8, op: 0.92 },
        { pts: latArc(R, -38, -96, 68, 38, 2.6), w: 0.75, op: 0.85 },
        { pts: latArc(R, -56, 12, 118, 32, 2.0), w: 0.7, op: 0.7 },
        { pts: lonArc(R, 18, -62, 64, 48, 2.2), w: 0.85, op: 0.9 },
        { pts: lonArc(R, -42, -48, 58, 40, 2.5), w: 0.8, op: 0.88 },
        { pts: lonArc(R, 72, -52, 44, 36, 1.6), w: 0.75, op: 0.82 },
        { pts: lonArc(R, 128, -38, 72, 44, 2.0), w: 0.8, op: 0.85 },
        { pts: greatCircleArc(R, 42, -28, -32, 48, 42, 1.4), w: 0.9, op: 0.96 },
        { pts: greatCircleArc(R, 28, 108, -44, 162, 36, -1.0), w: 0.8, op: 0.88 },
        // two extending tips that escape slightly
        { pts: outwardExtension(R, 18, -38, 0.08, 6), w: 0.65, op: 0.75 },
        { pts: outwardExtension(R, -22, 132, 0.06, 5), w: 0.6, op: 0.7 },
      ] as Array<{ pts: Array<[number, number, number]>; w: number; op: number }>,
      // inner cage — smaller sphere, fainter, gives hidden depth
      inner: [
        { pts: latArc(SPHERE_R * 0.78, 38, -18, 98, 28, 1.2), op: 0.42 },
        { pts: latArc(SPHERE_R * 0.78, -18, 22, 132, 30, 1.0), op: 0.38 },
        { pts: latArc(SPHERE_R * 0.78, 62, 42, 128, 22, 0.8), op: 0.32 },
        { pts: lonArc(SPHERE_R * 0.78, 24, -42, 52, 28, 1.0), op: 0.40 },
        { pts: lonArc(SPHERE_R * 0.78, -58, -28, 48, 26, 0.9), op: 0.36 },
        { pts: greatCircleArc(SPHERE_R * 0.72, 22, -42, -28, 38, 28, 0.6), op: 0.34 },
      ] as Array<{ pts: Array<[number, number, number]>; op: number }>,
    };
  }, []);

  const particlePos = useMemo(() => coreParticlePositions(84, SPHERE_R * 0.92), []);
  const particleGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(particlePos, 3));
    return g;
  }, [particlePos]);

  const glowTex = useMemo(() => {
    if (typeof document === "undefined") return null;
    return radialTexture([
      [0, "rgba(255,255,255,0.95)"],
      [0.28, "rgba(110,160,255,0.55)"],
      [0.52, "rgba(91,140,255,0.18)"],
      [1, "rgba(91,140,255,0)"],
    ]);
  }, []);
  const coreGlowTex = useMemo(() => {
    if (typeof document === "undefined") return null;
    return radialTexture([
      [0, "rgba(160,190,255,0.9)"],
      [0.35, "rgba(91,140,255,0.32)"],
      [1, "rgba(91,140,255,0)"],
    ]);
  }, []);

  // crystal edge geometries
  const crystalEdges = useMemo(() => {
    const ico = new THREE.IcosahedronGeometry(0.145, 0);
    const oct = new THREE.OctahedronGeometry(0.088, 0);
    const e1 = new THREE.EdgesGeometry(ico);
    const e2 = new THREE.EdgesGeometry(oct);
    ico.dispose(); oct.dispose();
    return { e1, e2 };
  }, []);
  useEffect(() => () => { crystalEdges.e1.dispose(); crystalEdges.e2.dispose(); }, [crystalEdges]);

  // contour material refs
  const outerMats = useRef<Array<THREE.LineBasicMaterial | null>>([]);
  const innerMats = useRef<Array<THREE.LineBasicMaterial | null>>([]);

  useEffect(() => {
    return () => {
      particleGeo.dispose();
      glowTex?.dispose();
      coreGlowTex?.dispose();
    };
  }, [particleGeo, glowTex, coreGlowTex]);

  useFrame(({ clock }) => {
    if (!visRef.current) return;
    const t = reduced ? FROZEN_T : clock.elapsedTime;
    const es = eased.current;
    es.shell += (stageP(reduced ? 10 : clock.elapsedTime, STAGE.shell) - es.shell) * 0.09;
    es.grat += (stageP(reduced ? 10 : clock.elapsedTime, STAGE.grat) - es.grat) * 0.09;
    es.inner += (stageP(reduced ? 10 : clock.elapsedTime, STAGE.nodes) - es.inner) * 0.10;
    es.particles += (stageP(reduced ? 10 : clock.elapsedTime, STAGE.w) - es.particles) * 0.07;
    const sShell = smooth(es.shell);
    const sGrat = smooth(es.grat);
    const sInner = smooth(es.inner);
    const sPart = smooth(es.particles);

    hoverV.current += ((SYS_SHARED.hover.on ? 1 : 0) - hoverV.current) * 0.07;
    const hv = reduced ? 0 : hoverV.current;

    if (shellMat.current) {
      // smoky glass — very restrained, not opaque
      shellMat.current.opacity = (darkCheck(pal) ? 0.13 : 0.09) * sShell * (1 + hv * 0.18);
    }
    if (innerShellMat.current) innerShellMat.current.opacity = 0.045 * sShell;
    if (rimMat.current) rimMat.current.opacity = (darkCheck(pal) ? 0.22 : 0.14) * sShell;
    if (particleMat.current) particleMat.current.opacity = 0.22 * sPart * (0.85 + hv * 0.22);

    // outer contours — foreground vs distant opacity dance
    outerMats.current.forEach((m, i) => {
      if (!m) return;
      const base = contours.outer[i]?.op ?? 1;
      const wav = reduced ? 0 : 0.06 * Math.sin(t * 0.42 + i * 1.3);
      m.opacity = (darkCheck(pal) ? 0.58 : 0.62) * base * sGrat * (1 + wav + hv * 0.12);
    });
    innerMats.current.forEach((m, i) => {
      if (!m) return;
      const base = contours.inner[i]?.op ?? 0.36;
      m.opacity = base * 0.38 * sGrat * (darkCheck(pal) ? 1 : 0.9);
    });

    // crystal slow counter-rotations + hover quicken
    if (crystalOuter.current && !reduced) {
      crystalOuter.current.rotation.y = t * 0.22 + hv * 0.3;
      crystalOuter.current.rotation.x = Math.sin(t * 0.11) * 0.18;
      crystalOuter.current.rotation.z = t * 0.04;
    }
    if (crystalInner.current && !reduced) {
      crystalInner.current.rotation.y = -t * 0.38 - hv * 0.4;
      crystalInner.current.rotation.x = Math.sin(t * 0.15 + 0.8) * 0.22;
    }
    if (innerRef.current && !reduced) {
      innerRef.current.rotation.y = -t * 0.03;
    }
    // subtle breathing scale
    const pulse = 1 + (reduced ? 0 : 0.015 * Math.sin(t * 0.9) + hv * 0.012);
    if (innerRef.current) innerRef.current.scale.setScalar(pulse);

    if (outerGlowMat.current) {
      outerGlowMat.current.opacity = (0.14 + (reduced ? 0 : 0.04 * Math.sin(t * 0.9)) + hv * 0.08) * sInner;
    }
    if (innerGlowMat.current) {
      innerGlowMat.current.opacity = (0.32 + (reduced ? 0 : 0.06 * Math.sin(t * 1.1)) + hv * 0.14) * sInner;
    }
  });

  return (
    <group>
      {/* outer smoky glass volume — MeshPhysical with transmission */}
      <mesh
        onPointerOver={() => { SYS_SHARED.hover.on = true; }}
        onPointerOut={() => { SYS_SHARED.hover.on = false; }}
      >
        <sphereGeometry args={[SPHERE_R, 56, 40]} />
        <meshPhysicalMaterial
          ref={shellMat}
          color={pal.sphere}
          transparent
          opacity={0}
          roughness={0.22}
          metalness={0.06}
          transmission={0.88}
          thickness={0.9}
          clearcoat={0.45}
          clearcoatRoughness={0.28}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* inner depth shell — gives volume thickness */}
      <mesh>
        <sphereGeometry args={[SPHERE_R * 0.985, 40, 28]} />
        <meshStandardMaterial ref={innerShellMat} color={pal.sphereRim} transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* rim / fresnel thickness — BackSide */}
      <mesh>
        <sphereGeometry args={[SPHERE_R * 0.975, 32, 24]} />
        <meshBasicMaterial ref={rimMat} color={pal.sphereRim} transparent opacity={0} side={THREE.BackSide} depthWrite={false} />
      </mesh>

      {/* volumetric outer glow — very restrained electric blue haze around volume */}
      {glowTex && (
        <sprite scale={[SPHERE_R * 2.9, SPHERE_R * 2.9, 1]}>
          <spriteMaterial ref={outerGlowMat} map={glowTex} color={pal.accent} transparent opacity={0} blending={THREE.AdditiveBlending} depthWrite={false} />
        </sprite>
      )}

      {/* faint internal particles */}
      <points geometry={particleGeo}>
        <pointsMaterial ref={particleMat} color={pal.white} size={0.012} transparent opacity={0} sizeAttenuation depthWrite={false} />
      </points>

      {/* outer irregular wireframe contours — the intelligent system lines */}
      <group ref={innerRef}>
        {contours.outer.map((c, i) => (
          <Line
            key={`oc-${i}`}
            points={c.pts}
            color={pal.fg}
            lineWidth={c.w}
            transparent
            opacity={0}
            depthWrite={false}
            ref={(el) => {
              outerMats.current[i] = el ? (el as unknown as { material: THREE.LineBasicMaterial }).material : null;
            }}
          />
        ))}
        {/* inner hidden structural cage */}
        {contours.inner.map((c, i) => (
          <Line
            key={`ic-${i}`}
            points={c.pts}
            color={pal.graphite}
            lineWidth={0.65}
            transparent
            opacity={0}
            depthWrite={false}
            ref={(el) => {
              innerMats.current[i] = el ? (el as unknown as { material: THREE.LineBasicMaterial }).material : null;
            }}
          />
        ))}
      </group>

      {/* internal crystal — tiny wireframe polyhedron energy core */}
      <group position={[0.06, 0.04, 0.08]}>
        <group ref={crystalOuter}>
          <lineSegments geometry={crystalEdges.e1}>
            <lineBasicMaterial color={pal.accent} transparent opacity={0.72} depthWrite={false} />
          </lineSegments>
        </group>
        <group ref={crystalInner}>
          <lineSegments geometry={crystalEdges.e2}>
            <lineBasicMaterial color={pal.white} transparent opacity={0.28} depthWrite={false} />
          </lineSegments>
        </group>
        {/* restrained central glow */}
        {coreGlowTex && (
          <sprite scale={[0.52, 0.52, 1]}>
            <spriteMaterial ref={innerGlowMat} map={coreGlowTex} color={pal.accent} transparent opacity={0} blending={THREE.AdditiveBlending} depthWrite={false} />
          </sprite>
        )}
        <pointLight color={pal.accent} intensity={1.02} distance={1.9} decay={2} />
        {/* compact luminous geometric core — tiny faceted center, subtle restrained glow */}
        <mesh>
          <octahedronGeometry args={[0.036, 0]} />
          <meshStandardMaterial color={pal.accent} emissive={pal.accent} emissiveIntensity={0.72} transparent opacity={0.88} roughness={0.35} />
        </mesh>
      </group>

      {/* invisible hover volume */}
      <mesh
        onPointerOver={() => { SYS_SHARED.hover.on = true; }}
        onPointerOut={() => { SYS_SHARED.hover.on = false; }}
      >
        <sphereGeometry args={[SPHERE_R * 1.03, 16, 12]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  );
}

function darkCheck(pal: Palette) {
  return pal.bg.startsWith("rgb(10") || pal.bg.startsWith("rgb(12") || pal.bg.startsWith("rgb(26") || pal.bg.startsWith("rgb(42");
}

/* ------------------------------------------------------------------ */
/*  Orbital field — warped, broken, intersecting data streams        */
/* ------------------------------------------------------------------ */

function OrbitalField({ pal, reduced, visRef }: { pal: Palette; reduced: boolean; visRef: Props["visRef"] }) {
  const groups = useRef<Array<THREE.Group | null>>([]);
  const lineMats = useRef<Array<THREE.LineBasicMaterial | null>>([]);
  const segMats = useRef<Array<Array<THREE.LineBasicMaterial | null>>>([]);
  const nodeRefs = useRef<Array<THREE.Mesh | null>>([]);
  const spriteRefs = useRef<Array<THREE.Sprite | null>>([]);
  const quats = useRef(ORBITS.map(() => new THREE.Quaternion()));
  const eulers = useRef(ORBITS.map(() => new THREE.Euler()));
  const tmp = useRef(new THREE.Vector3());
  const eased = useRef({ rings: 0, nodes: 0 });

  // precompute point sets per orbit (closed or broken segments)
  const orbitPts = useMemo(() => ORBITS.map((o) => {
    if (o.broken) {
      const segs = brokenWarpedSegments(o.rx, o.rz, o.broken, 144, o.warp);
      return { kind: "broken" as const, segs };
    }
    return { kind: "closed" as const, pts: warpedEllipse(o.rx, o.rz, 144, o.warp, 2, o.dipDeg, o.dipDeg ? 0.16 : 0) };
  }), []);

  // glows for nodes
  const nodeGlowTex = useMemo(() => {
    if (typeof document === "undefined") return null;
    return radialTexture([
      [0, "rgba(255,255,255,0.85)"],
      [0.36, "rgba(91,140,255,0.22)"],
      [1, "rgba(91,140,255,0)"],
    ]);
  }, []);
  const whiteGlowTex = useMemo(() => {
    if (typeof document === "undefined") return null;
    return radialTexture([
      [0, "rgba(255,255,255,0.9)"],
      [0.42, "rgba(255,255,255,0.14)"],
      [1, "rgba(255,255,255,0)"],
    ]);
  }, []);
  useEffect(() => () => { nodeGlowTex?.dispose(); whiteGlowTex?.dispose(); }, [nodeGlowTex, whiteGlowTex]);

  useEffect(() => {
    if (segMats.current.length !== ORBITS.length) segMats.current = ORBITS.map(() => []);
  }, []);

  useFrame(({ clock }) => {
    if (!visRef.current) return;
    const t = reduced ? FROZEN_T : clock.elapsedTime;
    const es = eased.current;
    es.rings += (stageP(reduced ? 10 : clock.elapsedTime, STAGE.rings) - es.rings) * 0.11;
    es.nodes += (stageP(reduced ? 10 : clock.elapsedTime, STAGE.nodes) - es.nodes) * 0.11;
    const eR = smooth(es.rings);
    const eN = smooth(es.nodes);

    ORBITS.forEach((o, i) => {
      const g = groups.current[i];
      if (!g) return;
      g.rotation.set(o.tx, o.phase + t * o.spin, o.tz);
      // tilt Y wobble for perspective distortion
      g.rotation.y += reduced ? 0 : Math.sin(t * 0.07 + i) * 0.02;
      const m = lineMats.current[i];
      if (m) m.opacity = o.opacity * eR;
      (segMats.current[i] || []).forEach((sm) => {
        if (sm) sm.opacity = o.opacity * eR;
      });
    });

    // precompute quaternions for nodes
    eulers.current.forEach((e, i) => {
      e.set(ORBITS[i].tx, ORBITS[i].phase + t * ORBITS[i].spin, ORBITS[i].tz);
      quats.current[i].setFromEuler(e);
    });

    NODES.forEach((nd, idx) => {
      const mesh = nodeRefs.current[idx];
      if (!mesh) return;
      const o = ORBITS[nd.orbit];
      const a = (nd.tDeg * Math.PI) / 180;
      // warp modulation to place correctly on warped radius
      const warp = 1 + o.warp * Math.sin(a * 2 + 0.7) + o.warp * 0.6 * Math.cos(a * 3.1);
      let mr = warp;
      if (o.dipDeg !== null) {
        const dipTh = (o.dipDeg * Math.PI) / 180;
        const da = Math.atan2(Math.sin(a - dipTh), Math.cos(a - dipTh));
        mr -= 0.16 * Math.exp(-(da * da) * 8);
      }
      tmp.current.set(Math.cos(a) * o.rx * mr, 0, Math.sin(a) * o.rz * mr);
      tmp.current.applyQuaternion(quats.current[nd.orbit]);
      mesh.position.copy(tmp.current);
      // subtle breathing per tier
      const scalePulse = nd.tier === "secondary" ? 1 : 1 + (reduced ? 0 : 0.07 * Math.sin(t * 1.4 + idx * 0.9));
      mesh.scale.setScalar(nd.size * (0.4 + 0.6 * eN) * scalePulse);
      const spr = spriteRefs.current[idx];
      if (spr) {
        const gm = spr.material as THREE.SpriteMaterial;
        const base = nd.tier === "active" ? 0.36 : nd.tier === "primary" ? 0.28 : 0;
        gm.opacity = base * eN * (1 + (reduced ? 0 : 0.12 * Math.sin(t * 1.2 + idx)));
        spr.position.copy(tmp.current);
      }
    });
  });

  return (
    <group>
      {ORBITS.map((o, i) => {
        const pts = orbitPts[i];
        return (
          <group key={i} ref={(el) => { groups.current[i] = el; }}>
            {pts.kind === "closed" ? (
              <Line
                points={pts.pts}
                color={o.accent ? pal.accent : pal.lineStrong}
                lineWidth={o.accent ? 1.35 : o.opacity > 0.18 ? 0.95 : 0.75}
                transparent
                opacity={0}
                depthWrite={false}
                ref={(el) => {
                  lineMats.current[i] = el ? (el as unknown as { material: THREE.LineBasicMaterial }).material : null;
                  if (el && o.accent) {
                    const mat = (el as unknown as { material: THREE.LineBasicMaterial }).material;
                    mat.depthWrite = false;
                  }
                }}
              />
            ) : (
              pts.segs.map((seg, sIdx) => (
                <Line
                  key={sIdx}
                  points={seg}
                  color={o.accent ? pal.accent : pal.lineStrong}
                  lineWidth={o.accent ? 1.35 : 0.85}
                  transparent
                  opacity={0}
                  depthWrite={false}
                  ref={(el) => {
                    if (!segMats.current[i]) segMats.current[i] = [];
                    segMats.current[i][sIdx] = el ? (el as unknown as { material: THREE.LineBasicMaterial }).material : null;
                  }}
                />
              ))
            )}
          </group>
        );
      })}

      {/* nodes — hierarchy: primary white metallic, active blue, secondary graphite */}
      {NODES.map((nd, idx) => {
        const isPrimary = nd.tier === "primary";
        const isActive = nd.tier === "active";
        const color = isActive ? pal.accent : isPrimary ? pal.white : pal.graphite;
        return (
          <mesh key={idx} ref={(el) => { nodeRefs.current[idx] = el; }}>
            <sphereGeometry args={[1, 12, 10]} />
            {isPrimary ? (
              <meshStandardMaterial color={color} roughness={0.28} metalness={0.42} />
            ) : isActive ? (
              <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.55} roughness={0.4} />
            ) : (
              <meshBasicMaterial color={color} transparent opacity={0.95} />
            )}
          </mesh>
        );
      })}
      {/* glow sprites — primary/additive, synced to node positions in frame loop */}
      {NODES.map((nd, idx) => {
        if (nd.tier === "secondary") return null;
        const tex = nd.tier === "active" ? nodeGlowTex : whiteGlowTex;
        if (!tex) return null;
        return (
          <sprite
            key={`glow-${idx}`}
            scale={nd.tier === "primary" ? [0.34, 0.34, 1] : [0.28, 0.28, 1]}
            ref={(el) => { spriteRefs.current[idx] = el; }}
          >
            <spriteMaterial map={tex} color={nd.tier === "active" ? pal.accent : pal.white} transparent opacity={0} blending={THREE.AdditiveBlending} depthWrite={false} />
          </sprite>
        );
      })}
    </group>
  );
}

/* glow sync now handled directly in OrbitalField useFrame via spriteRefs */

/* ------------------------------------------------------------------ */
/*  System root — parallax rig + floating camera                       */
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
    c.ry += ((props.reduced ? 0 : p.x * 0.075) - c.ry) * k;
    c.rx += ((props.reduced ? 0 : p.y * 0.035) - c.rx) * k;
    c.cx += ((props.reduced ? 0 : p.x * 0.18) - c.cx) * k;
    c.cy += ((props.reduced ? 0 : -p.y * 0.09) - c.cy) * k;
    if (rig.current) {
      rig.current.rotation.y = c.ry;
      rig.current.rotation.x = c.rx;
    }
    const fx = props.reduced ? 0 : Math.sin(t * 0.11) * 0.04;
    const fy = props.reduced ? 0 : Math.sin(t * 0.08 + 0.9) * 0.028;
    camera.position.set(c.cx + fx, 0.9 + c.cy + fy, 10.6);
    camera.lookAt(0, -0.06, 0);
  });

  return (
    <group ref={rig}>
      <BackgroundField pal={pal} reduced={props.reduced} visRef={props.visRef} />
      <OrbitalField pal={pal} reduced={props.reduced} visRef={props.visRef} />
      <WistfyCore pal={pal} reduced={props.reduced} visRef={props.visRef} />
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  Canvas entry                                                       */
/* ------------------------------------------------------------------ */

export default function CoreScene({ pointerRef, visRef, reduced }: Props) {
  const pal = usePalette();
  return (
    <Canvas
      dpr={[1, 1.85]}
      camera={{ fov: 30, near: 0.1, far: 40, position: [0, 0.9, 10.6] }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.NoToneMapping;
      }}
    >
      <fog attach="fog" args={[pal.bg, 11.0, 18.5]} />
      <ambientLight intensity={0.84} />
      <hemisphereLight args={[pal.white, pal.sphereRim, 0.72]} />
      <directionalLight position={[-2.4, 3.6, 3.0]} intensity={0.95} />
      <directionalLight position={[2.6, -0.6, -1.6]} intensity={0.14} />
      <pointLight position={[0, 0, 0]} intensity={0.6} distance={4} decay={2} color={pal.accent} />
      <SystemRoot pointerRef={pointerRef} visRef={visRef} reduced={reduced} />
    </Canvas>
  );
}
