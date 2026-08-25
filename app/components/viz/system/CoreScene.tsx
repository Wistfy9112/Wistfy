"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { Instance, Instances, Line } from "@react-three/drei";
import { usePalette, type Palette } from "@/app/components/viz/system/palette";
import {
  FROZEN_T,
  PLATFORM_Y,
  SPHERE_R,
  STAGE,
  W_MARK,
  arcSubset,
  buildAxisGeometry,
  buildPlatformGeometry,
  diamondPoints,
  ellipseClosed,
  radialTexture,
  smooth,
  sphereWirePositions,
  stageP,
} from "@/app/components/viz/system/geometry";
import { SYS_SHARED } from "@/app/components/viz/system/sharedState";

export type ScenePointer = { x: number; y: number };

type Props = {
  pointerRef: React.RefObject<ScenePointer>;
  visRef: React.RefObject<boolean>;
  reduced: boolean;
};

/* ---------- orbit definitions ---------- */

type RingDef = {
  rx: number;
  rz: number;
  tx: number;
  tz: number;
  spin: number;
  phase: number;
  accent?: boolean;
  opacity: number;
};

const RINGS: RingDef[] = [
  /* the hero ring — electric blue, sweeping across the core */
  { rx: 2.62, rz: 2.08, tx: 1.38, tz: -0.16, spin: 0.028, phase: 0, accent: true, opacity: 0.75 },
  { rx: 3.18, rz: 1.62, tx: 1.12, tz: 0.5, spin: -0.02, phase: 1.2, opacity: 0.26 },
  { rx: 2.95, rz: 2.62, tx: 0.92, tz: -0.68, spin: 0.016, phase: 2.4, opacity: 0.2 },
  { rx: 3.72, rz: 2.24, tx: 1.44, tz: 0.14, spin: -0.012, phase: 0.7, opacity: 0.15 },
];

/* dark riders pinned to the ring paths */
type RiderDef = { ring: number; t0: number; speed: number; size: number };

const RIDERS: RiderDef[] = [
  { ring: 0, t0: 1.1, speed: 0.06, size: 0.034 },
  { ring: 0, t0: 4.4, speed: 0.05, size: 0.03 },
  { ring: 1, t0: 0.3, speed: -0.045, size: 0.042 },
  { ring: 1, t0: 2.2, speed: -0.04, size: 0.03 },
  { ring: 1, t0: 3.9, speed: -0.05, size: 0.036 },
  { ring: 1, t0: 5.4, speed: -0.036, size: 0.028 },
  { ring: 2, t0: 0.9, speed: 0.038, size: 0.04 },
  { ring: 2, t0: 2.8, speed: 0.033, size: 0.03 },
  { ring: 2, t0: 4.7, speed: 0.043, size: 0.036 },
  { ring: 3, t0: 1.7, speed: -0.026, size: 0.034 },
  { ring: 3, t0: 3.6, speed: -0.022, size: 0.03 },
];

/* blue active node on the sphere surface — CORE ACTIVE */
const NODE_LAT = (15 * Math.PI) / 180;
const NODE_LON = (38 * Math.PI) / 180;
const SURFACE_NODE: [number, number, number] = [
  SPHERE_R * 1.005 * Math.cos(NODE_LAT) * Math.cos(NODE_LON),
  SPHERE_R * 1.005 * Math.sin(NODE_LAT),
  SPHERE_R * 1.005 * Math.cos(NODE_LAT) * Math.sin(NODE_LON),
];

/* ------------------------------------------------------------------ */
/* spherical core — pearl body, fine graticule, W heart, active node  */
/* ------------------------------------------------------------------ */

function CoreSphere({
  pal,
  reduced,
  visRef,
}: {
  pal: Palette;
  reduced: boolean;
  visRef: Props["visRef"];
}) {
  const shellMat = useRef<THREE.MeshPhysicalMaterial>(null);
  const rimMat = useRef<THREE.MeshBasicMaterial>(null);
  const gratMat = useRef<THREE.LineBasicMaterial>(null);
  const nodeMesh = useRef<THREE.Mesh>(null);
  const nodeMat = useRef<THREE.MeshBasicMaterial>(null);
  const streakMat = useRef<THREE.SpriteMaterial>(null);
  const eased = useRef({ shell: 0, grat: 0, nodes: 0 });
  const hoverV = useRef(0);

  const glowTex = useMemo(
    () =>
      typeof document === "undefined"
        ? null
        : radialTexture([
            [0, "rgba(255,255,255,0.95)"],
            [0.32, "rgba(255,255,255,0.32)"],
            [1, "rgba(255,255,255,0)"],
          ]),
    [],
  );

  const gratGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute(
      "position",
      new THREE.BufferAttribute(
        sphereWirePositions(SPHERE_R * 1.001, [-67.5, -45, -22.5, 0, 22.5, 45, 67.5], 12),
        3,
      ),
    );
    return g;
  }, []);

  useEffect(() => {
    return () => {
      gratGeo.dispose();
      glowTex?.dispose();
    };
  }, [gratGeo, glowTex]);

  useFrame(({ clock }) => {
    if (!visRef.current) return;
    const et = clock.elapsedTime;
    const t = reduced ? FROZEN_T : et;
    const es = eased.current;
    es.shell += (stageP(reduced ? 10 : et, STAGE.shell) - es.shell) * 0.1;
    es.grat += (stageP(reduced ? 10 : et, STAGE.grat) - es.grat) * 0.1;
    es.nodes += (stageP(reduced ? 10 : et, STAGE.nodes) - es.nodes) * 0.1;

    hoverV.current += ((SYS_SHARED.hover.on ? 1 : 0) - hoverV.current) * 0.08;
    const hv = reduced ? 0 : hoverV.current;

    if (shellMat.current) shellMat.current.opacity = 0.94 * smooth(es.shell);
    if (rimMat.current) rimMat.current.opacity = 0.55 * smooth(es.shell);
    if (gratMat.current)
      gratMat.current.opacity = (0.07 + hv * 0.035) * smooth(es.grat);

    /* CORE ACTIVE — pulse quickens under hover */
    const pulse =
      1 + (reduced ? 0 : 0.18 * Math.sin(t * (1.9 + hv))) + hv * 0.22;

    if (nodeMesh.current)
      nodeMesh.current.scale.setScalar(pulse * (0.4 + 0.6 * smooth(es.nodes)));
    if (nodeMat.current)
      nodeMat.current.opacity = Math.min(1, smooth(es.nodes) * (0.95 + hv * 0.05));
    if (streakMat.current)
      streakMat.current.opacity =
        (0.34 + (reduced ? 0 : 0.08 * Math.sin(t * 1.6)) + hv * 0.2) *
        smooth(es.nodes);
  });

  return (
    <group>
      {/* pearl body */}
      <mesh
        onPointerOver={() => {
          SYS_SHARED.hover.on = true;
        }}
        onPointerOut={() => {
          SYS_SHARED.hover.on = false;
        }}
      >
        <sphereGeometry args={[SPHERE_R, 56, 40]} />
        <meshPhysicalMaterial
          ref={shellMat}
          color={pal.sphere}
          transparent
          opacity={0}
          roughness={0.55}
          metalness={0.02}
          clearcoat={0.25}
          clearcoatRoughness={0.5}
        />
      </mesh>
      {/* inner rim — gives the glass its thickness */}
      <mesh>
        <sphereGeometry args={[SPHERE_R * 0.985, 48, 32]} />
        <meshBasicMaterial
          ref={rimMat}
          color={pal.sphereRim}
          transparent
          opacity={0}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>

      {/* fine latitude / longitude construction lines */}
      <lineSegments geometry={gratGeo}>
        <lineBasicMaterial
          ref={gratMat}
          color={pal.fg}
          transparent
          opacity={0}
          depthWrite={false}
        />
      </lineSegments>

      {/* the W heart — barely there, the identity at the center */}
      <WHeart pal={pal} reduced={reduced} visRef={visRef} />

      {/* CORE ACTIVE — electric node on the surface */}
      <mesh ref={nodeMesh} position={SURFACE_NODE} scale={0}>
        <sphereGeometry args={[0.05, 16, 12]} />
        <meshBasicMaterial ref={nodeMat} color={pal.accent} transparent opacity={0} />
      </mesh>
      {glowTex && (
        <sprite position={SURFACE_NODE} scale={[0.5, 0.5, 1]}>
          <spriteMaterial
            map={glowTex}
            color={pal.accent}
            transparent
            opacity={0}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </sprite>
      )}
      {/* horizontal flare where the hero ring crosses the core */}
      {glowTex && (
        <sprite position={[0, SURFACE_NODE[1] * 0.6, 0.15]} scale={[3.1, 0.17, 1]}>
          <spriteMaterial
            ref={streakMat}
            map={glowTex}
            color={pal.accent}
            transparent
            opacity={0}
            rotation={-0.1}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </sprite>
      )}
      <pointLight
        color={pal.accent}
        intensity={2.2}
        distance={3.2}
        decay={2}
        position={[SURFACE_NODE[0] * 0.6, SURFACE_NODE[1], SURFACE_NODE[2] * 0.6]}
      />

      {/* invisible hover volume */}
      <mesh
        onPointerOver={() => {
          SYS_SHARED.hover.on = true;
        }}
        onPointerOut={() => {
          SYS_SHARED.hover.on = false;
        }}
      >
        <sphereGeometry args={[SPHERE_R * 1.02, 16, 12]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  );
}

/* inner W — separated so its slow counter-rotation stays independent */
function WHeart({
  pal,
  reduced,
  visRef,
}: {
  pal: Palette;
  reduced: boolean;
  visRef: Props["visRef"];
}) {
  const group = useRef<THREE.Group>(null);
  const lineRef = useRef<{ material: { opacity: number } } | null>(null);
  const dotMats = useRef<Array<THREE.MeshBasicMaterial | null>>([]);
  const eased = useRef(0);

  useFrame(({ clock }) => {
    if (!visRef.current) return;
    const et = clock.elapsedTime;
    const t = reduced ? FROZEN_T : et;
    eased.current += (stageP(reduced ? 10 : et, STAGE.w) - eased.current) * 0.1;
    const o = 0.32 * smooth(eased.current);
    if (group.current && !reduced) group.current.rotation.y = -t * 0.09;
    if (lineRef.current) lineRef.current.material.opacity = o;
    for (const m of dotMats.current) if (m) m.opacity = o * 0.88;
  });

  return (
    <group ref={group}>
      <Line
        ref={lineRef as never}
        points={W_MARK}
        color={pal.white}
        lineWidth={1.4}
        transparent
        opacity={0}
      />
      {W_MARK.map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z]}>
          <sphereGeometry args={[0.011, 8, 6]} />
          <meshBasicMaterial
            ref={(el) => {
              dotMats.current[i] = el;
            }}
            color={pal.white}
            transparent
            opacity={0}
          />
        </mesh>
      ))}
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* orbital system — thin ellipses, one electric, dark riders           */
/* ------------------------------------------------------------------ */

function Rings({
  pal,
  reduced,
  visRef,
}: {
  pal: Palette;
  reduced: boolean;
  visRef: Props["visRef"];
}) {
  const groups = useRef<Array<THREE.Group | null>>([]);
  const ringMats = useRef<Array<{ opacity: number } | null>>([]);
  const instRefs = useRef<Array<THREE.Object3D | null>>([]);
  const quats = useRef(RINGS.map(() => new THREE.Quaternion()));
  const eulers = useRef(RINGS.map(() => new THREE.Euler()));
  const tmp = useRef(new THREE.Vector3());
  const eased = useRef({ rings: 0, nodes: 0 });

  const ringPts = useMemo(() => RINGS.map((r) => ellipseClosed(r.rx, r.rz)), []);
  /* bright front pass of the hero ring */
  const brightPts = useMemo(() => arcSubset(RINGS[0].rx, RINGS[0].rz, -38, 42), []);

  useFrame(({ clock }) => {
    if (!visRef.current) return;
    const et = clock.elapsedTime;
    const t = reduced ? FROZEN_T : et;
    const es = eased.current;
    es.rings += (stageP(reduced ? 10 : et, STAGE.rings) - es.rings) * 0.12;
    es.nodes += (stageP(reduced ? 10 : et, STAGE.nodes) - es.nodes) * 0.12;
    const eR = smooth(es.rings);
    const eN = smooth(es.nodes);

    RINGS.forEach((r, i) => {
      const g = groups.current[i];
      if (!g) return;
      g.rotation.set(r.tx, r.phase + t * r.spin, r.tz);
      const m = ringMats.current[i];
      if (m) m.opacity = r.opacity * eR;
    });

    eulers.current.forEach((e, i) => {
      e.set(RINGS[i].tx, RINGS[i].phase + t * RINGS[i].spin, RINGS[i].tz);
      quats.current[i].setFromEuler(e);
    });
    RIDERS.forEach((rd, i) => {
      const o = instRefs.current[i];
      if (!o) return;
      const th = rd.t0 + t * rd.speed;
      tmp.current.set(
        Math.cos(th) * RINGS[rd.ring].rx,
        0,
        Math.sin(th) * RINGS[rd.ring].rz,
      );
      tmp.current.applyQuaternion(quats.current[rd.ring]);
      o.position.copy(tmp.current);
      o.scale.setScalar(rd.size * (0.4 + 0.6 * eN));
    });
  });

  return (
    <group>
      {RINGS.map((r, i) => (
        <group
          key={i}
          ref={(el) => {
            groups.current[i] = el;
          }}
        >
          <Line
            points={ringPts[i]}
            color={r.accent ? pal.accent : pal.lineStrong}
            lineWidth={r.accent ? 1.2 : 1}
            transparent
            opacity={0}
            ref={(el) => {
              ringMats.current[i] = el
                ? (el as unknown as { material: { opacity: number } }).material
                : null;
            }}
          />
          {i === 0 && (
            /* glowing front pass — additive so it flares over the pearl */
            <Line
              points={brightPts}
              color={pal.accent}
              lineWidth={2}
              transparent
              opacity={0.85}
              ref={(el) => {
                if (el) {
                  const mat = (el as unknown as { material: THREE.Material }).material;
                  mat.blending = THREE.AdditiveBlending;
                  mat.depthWrite = false;
                }
              }}
            />
          )}
        </group>
      ))}

      <Instances limit={RIDERS.length} range={RIDERS.length}>
        <sphereGeometry args={[1, 12, 8]} />
        <meshLambertMaterial />
        {RIDERS.map((rd, i) => (
          <Instance
            key={i}
            ref={(el) => {
              instRefs.current[i] = el as THREE.Object3D | null;
            }}
            color={pal.ink}
          />
        ))}
      </Instances>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* vertical axis with apex marker                                     */
/* ------------------------------------------------------------------ */

function AxisLine({
  pal,
  reduced,
  visRef,
}: {
  pal: Palette;
  reduced: boolean;
  visRef: Props["visRef"];
}) {
  const lineMat = useRef<THREE.LineBasicMaterial>(null);
  const diamondMat = useRef<THREE.LineBasicMaterial | null>(null);
  const apexGlow = useRef<THREE.SpriteMaterial>(null);
  const eased = useRef(0);

  const axisGeo = useMemo(
    () => buildAxisGeometry(-PLATFORM_Y - 0.35, 2.5, [-1.2, -0.4, 0.8, 1.6]),
    [],
  );
  const diamond = useMemo(() => diamondPoints(0.085), []);

  const glowTex = useMemo(
    () =>
      typeof document === "undefined"
        ? null
        : radialTexture([
            [0, "rgba(255,255,255,0.9)"],
            [0.4, "rgba(255,255,255,0.25)"],
            [1, "rgba(255,255,255,0)"],
          ]),
    [],
  );

  useEffect(() => {
    return () => {
      axisGeo.dispose();
      glowTex?.dispose();
    };
  }, [axisGeo, glowTex]);

  useFrame(({ clock }) => {
    if (!visRef.current) return;
    const et = clock.elapsedTime;
    const t = reduced ? FROZEN_T : et;
    eased.current += (stageP(reduced ? 10 : et, STAGE.energy) - eased.current) * 0.1;
    const e = smooth(eased.current);
    if (lineMat.current) lineMat.current.opacity = 0.24 * e;
    if (diamondMat.current)
      diamondMat.current.opacity =
        0.8 * e * (reduced ? 1 : 0.85 + 0.15 * Math.sin(t * 1.3));
    if (apexGlow.current)
      apexGlow.current.opacity =
        (0.5 + (reduced ? 0 : 0.12 * Math.sin(t * 1.3))) * e;
  });

  return (
    <group>
      <lineSegments geometry={axisGeo}>
        <lineBasicMaterial ref={lineMat} color={pal.lineStrong} transparent opacity={0} />
      </lineSegments>
      <group position={[0, 2.32, 0]}>
        <Line
          points={diamond}
          color={pal.accent}
          lineWidth={1.1}
          transparent
          opacity={0}
          ref={(el) => {
            diamondMat.current = el
              ? (el as unknown as { material: THREE.LineBasicMaterial }).material
              : null;
          }}
        />
        {glowTex && (
          <sprite scale={[0.34, 0.34, 1]}>
            <spriteMaterial
              ref={apexGlow}
              map={glowTex}
              color={pal.accent}
              transparent
              opacity={0}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </sprite>
        )}
      </group>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* platform                                                           */
/* ------------------------------------------------------------------ */

function Platform({
  pal,
  reduced,
  visRef,
}: {
  pal: Palette;
  reduced: boolean;
  visRef: Props["visRef"];
}) {
  const linesMat = useRef<THREE.LineBasicMaterial>(null);
  const shadowMat = useRef<THREE.MeshBasicMaterial>(null);
  const dotMat = useRef<THREE.MeshBasicMaterial>(null);
  const dotGlow = useRef<THREE.SpriteMaterial>(null);
  const spinG = useRef<THREE.Group>(null);
  const eased = useRef(0);
  const dark = pal.fg.startsWith("rgb(24");

  const shadowTex = useMemo(
    () =>
      typeof document === "undefined"
        ? null
        : radialTexture([
            [0, "rgba(0,0,0,0.82)"],
            [0.55, "rgba(0,0,0,0.24)"],
            [1, "rgba(0,0,0,0)"],
          ]),
    [],
  );
  const glowTex = useMemo(
    () =>
      typeof document === "undefined"
        ? null
        : radialTexture([
            [0, "rgba(255,255,255,0.9)"],
            [0.4, "rgba(255,255,255,0.25)"],
            [1, "rgba(255,255,255,0)"],
          ]),
    [],
  );
  const ticksGeo = useMemo(() => buildPlatformGeometry(), []);

  useEffect(() => {
    return () => {
      shadowTex?.dispose();
      glowTex?.dispose();
      ticksGeo.dispose();
    };
  }, [shadowTex, glowTex, ticksGeo]);

  useFrame(({ clock }) => {
    if (!visRef.current) return;
    const et = clock.elapsedTime;
    const t = reduced ? FROZEN_T : et;
    eased.current += (stageP(reduced ? 10 : et, STAGE.energy) - eased.current) * 0.1;
    const e = smooth(eased.current);
    if (spinG.current) spinG.current.rotation.y = -t * 0.015;
    if (linesMat.current) linesMat.current.opacity = 0.17 * e;
    if (shadowMat.current) shadowMat.current.opacity = (dark ? 0.32 : 0.13) * e;
    if (dotMat.current) dotMat.current.opacity = 0.95 * e;
    if (dotGlow.current)
      dotGlow.current.opacity =
        (0.5 + (reduced ? 0 : 0.14 * Math.sin(t * 1.5))) * e;
  });

  return (
    <group position={[0, PLATFORM_Y, 0]}>
      {shadowTex && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]}>
          <planeGeometry args={[3.6, 3.6]} />
          <meshBasicMaterial
            ref={shadowMat}
            map={shadowTex}
            transparent
            opacity={0}
            depthWrite={false}
          />
        </mesh>
      )}
      <group ref={spinG}>
        <lineSegments geometry={ticksGeo}>
          <lineBasicMaterial
            ref={linesMat}
            color={pal.lineMid}
            transparent
            opacity={0}
          />
        </lineSegments>
      </group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]}>
        <circleGeometry args={[0.034, 16]} />
        <meshBasicMaterial ref={dotMat} color={pal.accent} transparent opacity={0} />
      </mesh>
      {glowTex && (
        <sprite position={[0, 0.01, 0]} scale={[0.42, 0.42, 1]}>
          <spriteMaterial
            ref={dotGlow}
            map={glowTex}
            color={pal.accent}
            transparent
            opacity={0}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </sprite>
      )}
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* system root — parallax rig + floating camera                       */
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
    const k = 1 - Math.exp(-dt * (props.reduced ? 60 : 3.2));
    const c = cur.current;
    c.ry += ((props.reduced ? 0 : p.x * 0.08) - c.ry) * k;
    c.rx += ((props.reduced ? 0 : p.y * 0.04) - c.rx) * k;
    c.cx += ((props.reduced ? 0 : p.x * 0.2) - c.cx) * k;
    c.cy += ((props.reduced ? 0 : -p.y * 0.1) - c.cy) * k;
    if (rig.current) {
      rig.current.rotation.y = c.ry;
      rig.current.rotation.x = c.rx;
    }
    /* gentle idle float — alive even untouched */
    const fx = props.reduced ? 0 : Math.sin(t * 0.12) * 0.045;
    const fy = props.reduced ? 0 : Math.sin(t * 0.09 + 1.1) * 0.03;
    camera.position.set(c.cx + fx, 0.9 + c.cy + fy, 7.0);
    camera.lookAt(0, -0.1, 0);
  });

  return (
    <group ref={rig}>
      <CoreSphere pal={pal} reduced={props.reduced} visRef={props.visRef} />
      <Rings pal={pal} reduced={props.reduced} visRef={props.visRef} />
      <AxisLine pal={pal} reduced={props.reduced} visRef={props.visRef} />
      <Platform pal={pal} reduced={props.reduced} visRef={props.visRef} />
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* canvas entry                                                       */
/* ------------------------------------------------------------------ */

export default function CoreScene({ pointerRef, visRef, reduced }: Props) {
  const pal = usePalette();

  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ fov: 36, near: 0.1, far: 40, position: [0, 0.9, 7.0] }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.NoToneMapping;
      }}
    >
      <fog attach="fog" args={[pal.bg, 7.5, 12.5]} />
      {/* soft studio light — upper-left key like the reference */}
      <ambientLight intensity={0.4} />
      <hemisphereLight args={[pal.white, pal.sphereRim, 0.75]} />
      <directionalLight position={[-2.5, 3.5, 3.5]} intensity={0.75} />
      <directionalLight position={[3, -1, -2]} intensity={0.12} />
      <SystemRoot pointerRef={pointerRef} visRef={visRef} reduced={reduced} />
    </Canvas>
  );
}
