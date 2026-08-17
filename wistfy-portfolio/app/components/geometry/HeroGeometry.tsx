'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useSystem } from '@/app/system/SystemProvider'
import { getPassive } from '@/app/system/passive'

/* ================================================================== */
/* GRAPHICS LAB — a single restrained 3D render artifact               */
/* (three.js + GLSL, one transparent fixed canvas)                     */
/*                                                                     */
/* A Code Lyoko way-tower read as WISTFY's own materialization         */
/* column, rendered in real 3D:                                       */
/*                                                                     */
/*   TOWER    faceted cylinder whose panels are rebuilt cell by cell   */
/*            (missing cells fade in/out over time)                    */
/*   RING     two tilted brace rings orbiting the column in 3D, each   */
/*            carrying a travelling charge                             */
/*   BEAM     a faint materialization shaft leaving the tower top      */
/*   STREAM   ascending digitized render-points (transfer effect)      */
/*   LIGHT    restrained key + rim from the real surface normals       */
/*                                                                     */
/* Motion is extremely slow; the cursor adds gentle camera parallax    */
/* and a slight tower rotation. Reduced motion freezes. Fixed to the   */
/* viewport; fades + simplifies on scroll.                             */
/* ================================================================== */

const TOWER_HEIGHT = 3.4
const TOWER_TOP = TOWER_HEIGHT / 2
const TOWER_BOT = -TOWER_HEIGHT / 2

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}

/* raw scroll ratio + hero fade, computed from the shared passive state */
function scrollState() {
  const p = getPassive()
  const span = Math.max(1, (document.documentElement.scrollHeight || 1) - window.innerHeight)
  const ratio = span > 0 ? Math.min(1, p.scrollY / span) : 0
  return { ratio, fade: 1 - smooth(0, 0.22, ratio) }
}

/* ------------------------------------------------------------------ */
/* Tower body — faceted cylinder with panel-reconstruction shader      */
/* ------------------------------------------------------------------ */
const TOWER_VERT = `
varying vec3 vPos;
varying vec3 vNormal;
varying vec3 vWorld;
void main() {
  vPos = position;
  vNormal = normalize(normalMatrix * normal);
  vec4 wp = modelMatrix * vec4(position, 1.0);
  vWorld = wp.xyz;
  gl_Position = projectionMatrix * viewMatrix * wp;
}
`

const TOWER_FRAG = `
precision highp float;

uniform float uTime;
uniform float uReduced;
uniform float uScroll;
uniform float uMobile;
uniform float uHeight;

varying vec3 vPos;
varying vec3 vNormal;
varying vec3 vWorld;

float hash21(vec2 p) {
  p = fract(p * vec2(234.34, 435.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

void main() {
  float t = uReduced > 0.5 ? 0.0 : uTime;
  float simp = 1.0 - uScroll * 0.5;
  float halfH = uHeight * 0.5;

  float ang = atan(vPos.z, vPos.x);
  float yy = vPos.y;

  /* procedural topology — quantized surface panels */
  float uCells = 16.0;
  float vCells = 8.0;
  float ud = 6.2831853 / uCells;
  float vd = uHeight / vCells;

  vec2 cellId = vec2(floor(ang / ud), floor((yy + halfH) / vd));
  float ch = hash21(cellId * vec2(1.9, 3.3));
  float alive = smoothstep(0.42, 0.78, ch + 0.5 * sin(t * 0.05 + ch * 6.283));

  /* restrained light — key + rim on real surface normals */
  vec3 n = normalize(vNormal);
  vec3 viewDir = normalize(cameraPosition - vWorld);
  vec3 L = normalize(vec3(0.6, 0.8, 0.9));
  float diff = max(dot(n, L), 0.0);
  vec3 H = normalize(L + viewDir);
  float spec = pow(max(dot(n, H), 0.0), 40.0);
  float rim = pow(1.0 - max(dot(n, viewDir), 0.0), 3.0);

  vec3 nearBlack = vec3(0.03, 0.045, 0.07);
  vec3 base      = vec3(0.10, 0.20, 0.26);
  vec3 cyan      = vec3(0.30, 0.85, 0.95);
  vec3 ice       = vec3(0.65, 0.85, 0.95);
  vec3 white     = vec3(0.82, 0.95, 1.0);

  vec3 col = nearBlack;
  col += base * diff * 0.5;
  col += ice * rim * 0.55 * alive;
  col += white * spec * 0.25 * alive;

  /* wireframe — meridians + rings, sparse */
  float dU = min(fract(ang / ud), 1.0 - fract(ang / ud));
  float dV = min(fract((yy + halfH) / vd), 1.0 - fract((yy + halfH) / vd));
  float edge = max(1.0 - smoothstep(0.0, 0.018, dU), 1.0 - smoothstep(0.0, 0.018, dV));
  float sel = 0.5 + 0.5 * sin(ang * 3.0 + yy * 2.0 + t * 0.1);
  float selM = smoothstep(0.12, 0.62, sel);
  col += cyan * edge * selM * alive * 0.6 * simp;

  /* sparse vertex dots on mesh nodes */
  float onU = 1.0 - smoothstep(0.0, 0.035, dU);
  float onV = 1.0 - smoothstep(0.0, 0.035, dV);
  float vtx = onU * onV;
  float tw = 0.5 + 0.5 * sin(t * 1.0 + ang * 7.0 + yy * 5.0);
  col += cyan * vtx * alive * 0.5 * tw;

  /* reconstruction front — band sweeping up the column */
  float sweep = fract(t * 0.02) * uHeight - halfH;
  float dS = abs(yy - sweep);
  float front = (1.0 - smoothstep(0.0, 0.03, dS)) * 0.6
              + (1.0 - smoothstep(0.0, 0.09, dS)) * 0.3;
  col += cyan * front * alive * 0.5;

  float alpha = alive * (0.55 + diff * 0.3);
  alpha *= 1.0 - uMobile * 0.15;
  alpha *= simp;

  gl_FragColor = vec4(col, alpha);
}
`

/* deterministic PRNG (pure, idempotent) */
function mulberry32(seed: number) {
  let a = seed >>> 0
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function TowerBody({ reduced, mobile }: { reduced: boolean; mobile: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null!)

  const geometry = useMemo(() => {
    const geo = new THREE.CylinderGeometry(0.72, 0.95, TOWER_HEIGHT, 28, 18, true).toNonIndexed()
    geo.computeVertexNormals()
    return geo
  }, [])

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: TOWER_VERT,
        fragmentShader: TOWER_FRAG,
        transparent: true,
        depthWrite: false,
        side: THREE.FrontSide,
        uniforms: {
          uTime: { value: 0 },
          uReduced: { value: reduced ? 1 : 0 },
          uScroll: { value: 0 },
          uMobile: { value: mobile ? 1 : 0 },
          uHeight: { value: TOWER_HEIGHT },
        },
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  useFrame((state) => {
    const mat = meshRef.current.material as THREE.ShaderMaterial
    const { ratio } = scrollState()
    const u = mat.uniforms
    u.uTime.value = reduced ? 0 : state.clock.elapsedTime
    u.uScroll.value = ratio
    u.uReduced.value = reduced ? 1 : 0
    u.uMobile.value = mobile ? 1 : 0
  })

  return <mesh ref={meshRef} geometry={geometry} material={material} />
}

/* ------------------------------------------------------------------ */
/* Tilted brace rings — orbit the column in real 3D, charge inside     */
/* ------------------------------------------------------------------ */
function BraceRing({
  y,
  radius,
  tilt,
  speed,
  offset,
  reduced,
  mobile,
}: {
  y: number
  radius: number
  tilt: number
  speed: number
  offset: number
  reduced: boolean
  mobile: boolean
}) {
  const group = useRef<THREE.Group>(null!)
  const charge = useRef<THREE.Mesh>(null!)
  const ringMat = useRef<THREE.MeshBasicMaterial>(null!)
  const chargeMat = useRef<THREE.MeshBasicMaterial>(null!)

  useFrame((state) => {
    const { fade } = scrollState()
    const p = getPassive()
    const t = state.clock.elapsedTime
    const g = group.current
    if (!g) return
    if (!reduced) {
      g.rotation.y += 0.008 * speed * (1 + p.cursorActive * 0.25)
      g.rotation.z = 0.1 * Math.sin(t * 0.25 + offset)
    }
    if (charge.current && !reduced) {
      const ang = t * 0.5 * speed + offset
      charge.current.position.set(Math.cos(ang) * radius, 0, Math.sin(ang) * radius)
    }
    if (ringMat.current) ringMat.current.opacity = (mobile ? 0.3 : 0.5) * fade
    if (chargeMat.current) chargeMat.current.opacity = 0.9 * fade
  })

  return (
    <group ref={group} position={[0, y, 0]} rotation={[tilt, 0, 0]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius, 0.04, 8, 72]} />
        <meshBasicMaterial
          ref={ringMat}
          color="#3ee6ff"
          transparent
          opacity={mobile ? 0.3 : 0.5}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <mesh ref={charge}>
        <sphereGeometry args={[0.07, 12, 12]} />
        <meshBasicMaterial
          ref={chargeMat}
          color="#dfffff"
          transparent
          opacity={0.9}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  )
}

/* ------------------------------------------------------------------ */
/* Materialization beam — light shaft leaving the tower top            */
/* ------------------------------------------------------------------ */
function Beam({ reduced, mobile }: { reduced: boolean; mobile: boolean }) {
  const outer = useRef<THREE.Mesh>(null!)
  const outerMat = useRef<THREE.MeshBasicMaterial>(null!)
  const innerMat = useRef<THREE.MeshBasicMaterial>(null!)
  const coreMat = useRef<THREE.MeshBasicMaterial>(null!)

  useFrame((state) => {
    const { fade } = scrollState()
    const t = reduced ? 0 : state.clock.elapsedTime
    const breath = 0.75 + 0.25 * Math.sin(t * 0.6)
    if (outerMat.current) outerMat.current.opacity = 0.16 * breath * fade
    if (innerMat.current) innerMat.current.opacity = 0.3 * breath * fade
    if (coreMat.current) coreMat.current.opacity = 0.9 * (0.6 + 0.4 * breath) * fade
    if (outer.current) outer.current.scale.y = 1 + Math.sin(t * 0.4) * 0.04
  })

  if (mobile) return null

  return (
    <group>
      <mesh ref={outer} position={[0, TOWER_TOP + 0.9, 0]}>
        <coneGeometry args={[0.42, 2.3, 28, 1, true]} />
        <meshBasicMaterial
          ref={outerMat}
          color="#3ee6ff"
          transparent
          opacity={0.16}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh position={[0, TOWER_TOP + 0.7, 0]}>
        <cylinderGeometry args={[0.16, 0.05, 1.7, 16, 1, true]} />
        <meshBasicMaterial
          ref={innerMat}
          color="#aef0ff"
          transparent
          opacity={0.3}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh position={[0, TOWER_TOP, 0]}>
        <sphereGeometry args={[0.14, 16, 16]} />
        <meshBasicMaterial
          ref={coreMat}
          color="#eaffff"
          transparent
          opacity={0.9}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  )
}

/* ------------------------------------------------------------------ */
/* Ascending render-points — the digitized transfer stream             */
/* ------------------------------------------------------------------ */
function Stream({ reduced, mobile }: { reduced: boolean; mobile: boolean }) {
  const ref = useRef<THREE.Points>(null!)
  const mat = useRef<THREE.PointsMaterial>(null!)

  const { positions, base } = useMemo(() => {
    const count = mobile ? 46 : 120
    const rand = mulberry32(0x5177)
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const ang = rand() * Math.PI * 2
      const rad = 0.55 + rand() * 0.5
      arr[i * 3] = Math.cos(ang) * rad
      arr[i * 3 + 1] = TOWER_BOT - 0.4 + rand() * (TOWER_HEIGHT + 2.2)
      arr[i * 3 + 2] = Math.sin(ang) * rad
    }
    return { positions: arr, base: new Float32Array(arr) }
  }, [mobile])

  useFrame((state) => {
    const { fade } = scrollState()
    if (reduced) {
      if (mat.current) mat.current.opacity = 0.35 * fade
      return
    }
    const t = state.clock.elapsedTime
    const attr = ref.current.geometry.attributes.position as THREE.BufferAttribute
    const arr = attr.array as Float32Array
    const count = arr.length / 3
    for (let i = 0; i < count; i++) {
      const life = ((t * 0.11 + i * 0.037) % 1 + 1) % 1
      arr[i * 3 + 1] = THREE.MathUtils.lerp(TOWER_BOT - 0.4, TOWER_TOP + 1.8, life)
      arr[i * 3] = base[i * 3] + Math.sin(t * 0.5 + i) * 0.03
      arr[i * 3 + 2] = base[i * 3 + 2] + Math.cos(t * 0.45 + i) * 0.03
    }
    attr.needsUpdate = true
    if (mat.current) mat.current.opacity = 0.5 * fade
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        ref={mat}
        size={0.05}
        color="#9fd4f5"
        transparent
        opacity={0.5}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

/* ------------------------------------------------------------------ */
/* Base platform — grounds the column                                  */
/* ------------------------------------------------------------------ */
function Base({ mobile }: { mobile: boolean }) {
  const mat = useRef<THREE.MeshBasicMaterial>(null!)
  const baseOpacity = mobile ? 0.05 : 0.1

  useFrame(() => {
    const { fade } = scrollState()
    if (mat.current) mat.current.opacity = baseOpacity * fade
  })

  return (
    <group>
      <mesh position={[0, TOWER_BOT - 0.1, 0]}>
        <cylinderGeometry args={[1.35, 1.5, 0.06, 40]} />
        <meshBasicMaterial
          ref={mat}
          color="#3ee6ff"
          transparent
          opacity={baseOpacity}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <mesh position={[0, TOWER_BOT - 0.24, 0]}>
        <ringGeometry args={[0.9, 1.55, 48]} />
        <meshBasicMaterial
          color="#6aa7c8"
          transparent
          opacity={0.05}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  )
}

/* ------------------------------------------------------------------ */
/* Tower assembly + camera parallax                                    */
/* ------------------------------------------------------------------ */
function HeroScene({ reduced, mobile }: { reduced: boolean; mobile: boolean }) {
  const tower = useRef<THREE.Group>(null!)

  useFrame((state) => {
    const p = getPassive()
    const g = tower.current
    if (!g) return

    /* park the tower near the right edge, whatever the aspect ratio */
    const vp = state.viewport
    g.position.x = vp.width / 2 - (mobile ? 0.5 : 0.8)
    g.position.y = 0
    if (Math.random() < 0.02) {
      console.log('DBG vp', vp.width, vp.height, 'towerX', g.position.x, 'cam', state.camera.position.toArray().join(','))
    }

    if (!reduced) {
      const t = state.clock.elapsedTime
      g.rotation.y = p.cursorX * 0.12 + Math.sin(t * 0.03) * 0.04
      state.camera.position.x = THREE.MathUtils.lerp(
        state.camera.position.x,
        p.cursorX * 0.35,
        0.05
      )
      state.camera.position.y = THREE.MathUtils.lerp(
        state.camera.position.y,
        -p.cursorY * 0.25,
        0.05
      )
      state.camera.lookAt(0, 0, 0)
    } else {
      g.rotation.y = 0.15
      state.camera.position.set(0, 0, 6)
      state.camera.lookAt(0, 0, 0)
    }
  })

  const scale = mobile ? 0.72 : 1

  return (
    <>
      <group ref={tower} scale={scale}>
        <TowerBody reduced={reduced} mobile={mobile} />
        <BraceRing y={-0.4} radius={1.06} tilt={1.05} speed={1} offset={0} reduced={reduced} mobile={mobile} />
        <BraceRing y={0.55} radius={1.0} tilt={-1.0} speed={-0.8} offset={2.4} reduced={reduced} mobile={mobile} />
        <Beam reduced={reduced} mobile={mobile} />
        <Stream reduced={reduced} mobile={mobile} />
        <Base mobile={mobile} />
      </group>
    </>
  )
}

/* ------------------------------------------------------------------ */
/* Canvas wrapper — pauses off-screen, CSS fallback when no WebGL      */
/* ------------------------------------------------------------------ */
function StaticFallback() {
  return (
    <div className="hg-fallback pointer-events-none absolute inset-0" aria-hidden="true">
      <div className="hg-fb-form" />
      <div className="hg-fb-dots" />
      <div className="hg-fb-path" />
    </div>
  )
}

export default function HeroGeometry() {
  const { reducedMotion, isTouch, gpuMode } = useSystem()
  const wrapRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    if (gpuMode === 'ONLINE') el.classList.add('hg-live')
    else el.classList.remove('hg-live')
  }, [gpuMode])

  useEffect(() => {
    const el = wrapRef.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(
      (entries) => setVisible(entries.some((e) => e.isIntersecting)),
      { threshold: 0 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div
      ref={wrapRef}
      className="hg-root pointer-events-none fixed inset-0 z-[5]"
      aria-hidden="true"
    >
      {gpuMode === 'ONLINE' && (
        <Canvas
          frameloop={visible ? 'always' : 'never'}
          dpr={[1, isTouch ? 1 : 1.6]}
          gl={{
            alpha: true,
            premultipliedAlpha: false,
            antialias: !isTouch,
            powerPreference: 'high-performance',
          }}
          camera={{ position: [0, 0, 6], fov: 55, near: 0.1, far: 60 }}
          style={{ position: 'absolute', inset: 0 }}
        >
          <HeroScene reduced={reducedMotion} mobile={isTouch} />
        </Canvas>
      )}
      <StaticFallback />
    </div>
  )
}