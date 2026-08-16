'use client'

import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useSystem } from '@/app/system/SystemProvider'
import { projects } from '@/app/data/projects'
import { getPassive } from '@/app/system/passive'

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))

/* per-section atmosphere — internal state, changes are very subtle */
const SECTION_FACTOR: Record<string, number> = {
  hero: 0.85,
  about: 0.95,
  projects: 1,
  skills: 1,
  contact: 0.9,
}

/* ------------------------------------------------------------------ */
/* Grid texture                                                        */
/* ------------------------------------------------------------------ */
function makeGridTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  const size = 512
  canvas.width = canvas.height = size
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = '#030509'
  ctx.fillRect(0, 0, size, size)
  ctx.strokeStyle = 'rgba(108,193,230,0.5)'
  ctx.lineWidth = 1.5
  const cells = 16
  const cell = size / cells
  for (let i = 0; i <= cells; i++) {
    const p = Math.round(i * cell)
    ctx.beginPath()
    ctx.moveTo(p, 0)
    ctx.lineTo(p, size)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(0, p)
    ctx.lineTo(size, p)
    ctx.stroke()
  }
  const tex = new THREE.CanvasTexture(canvas)
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  tex.repeat.set(20, 20)
  tex.anisotropy = 2
  return tex
}

function GridFloor() {
  const ref = useRef<THREE.Mesh>(null!)

  useFrame((state) => {
    const p = getPassive()
    const t = state.clock.elapsedTime
    const mat = ref.current.material as THREE.MeshBasicMaterial
    const enter = Math.max(0, 1 - (performance.now() - p.sectionEnteredAt) / 700) * 0.04
    mat.opacity =
      0.07 * (1 + Math.sin(t * 0.35) * 0.2) * (1 + p.scrollActive * 0.2) + enter
    mat.map!.offset.y = (t * 0.02) % 1
  })

  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.5, -4]}>
      <planeGeometry args={[60, 80]} />
      <meshBasicMaterial
        map={makeGridTexture()}
        transparent
        opacity={0.07}
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

/* ------------------------------------------------------------------ */
/* Abstract data towers (wireframe geometry)                           */
/* ------------------------------------------------------------------ */
const TOWER_LAYOUT: {
  pos: [number, number, number]
  kind: 'octa' | 'box' | 'ico'
  scale: number
  speed: number
  projectId: string
}[] = (
  [
    { pos: [-6, 0.5, -6], kind: 'octa', scale: 1.4, speed: 0.4 },
    { pos: [7, 1, -9], kind: 'box', scale: 1.2, speed: 0.5 },
    { pos: [2.5, 0.6, -12], kind: 'ico', scale: 1.1, speed: 0.35 },
    { pos: [-3, 0.3, -10], kind: 'box', scale: 0.8, speed: 0.6 },
    { pos: [5, 0.8, -16], kind: 'octa', scale: 1.6, speed: 0.45 },
    { pos: [-8, 0.4, -14], kind: 'ico', scale: 0.9, speed: 0.55 },
    { pos: [0, 0.5, -20], kind: 'octa', scale: 2.0, speed: 0.3 },
    { pos: [-5, 0.5, -22], kind: 'box', scale: 1.1, speed: 0.5 },
    { pos: [8, 0.6, -24], kind: 'ico', scale: 1.3, speed: 0.42 },
    { pos: [2, 0.3, -28], kind: 'octa', scale: 1.0, speed: 0.6 },
  ] as { pos: [number, number, number]; kind: 'octa' | 'box' | 'ico'; scale: number; speed: number }[]
).map((t, i) => ({ ...t, projectId: projects[i]?.id ?? 'unknown' }))

function Tower({
  data,
  reduced,
  focused,
}: {
  data: (typeof TOWER_LAYOUT)[0]
  reduced: boolean
  focused: boolean
}) {
  const ref = useRef<THREE.Mesh>(null!)
  const baseScale = data.scale

  useFrame((state) => {
    const p = getPassive()
    const t = state.clock.elapsedTime

    const speedMul = 1 + p.cursorActive * 0.35
    ref.current.rotation.y = t * data.speed * speedMul
    ref.current.rotation.x = Math.sin(t * data.speed * 0.7) * 0.2
    if (!reduced) {
      ref.current.position.y = data.pos[1] + Math.sin(t * data.speed + data.pos[0]) * 0.12
    }

    // section transition pulse (brief assemble on section enter)
    const enter = Math.max(0, 1 - (performance.now() - p.sectionEnteredAt) / 700)
    const target = focused ? baseScale * 1.2 : baseScale * (1 + enter * 0.06)
    ref.current.scale.setScalar(THREE.MathUtils.lerp(ref.current.scale.x, target, 0.08))

    // dynamic light — towers on the cursor's side read slightly brighter
    const facing = (data.pos[0] * p.cursorX + data.pos[1] * p.cursorY) * p.cursorActive
    const light = clamp(1 + facing * 0.06, 0.85, 1.2)

    const mat = ref.current.material as THREE.MeshBasicMaterial
    const sectionFactor = SECTION_FACTOR[p.section ?? 'hero'] ?? 1
    const base = focused ? 0.16 : 0.09
    const targetOpacity = clamp(base * sectionFactor * light + enter * 0.05, 0.03, 0.16)
    mat.opacity = THREE.MathUtils.lerp(mat.opacity, targetOpacity, 0.08)
  })

  const geometry = useMemo(() => {
    if (data.kind === 'octa') return new THREE.OctahedronGeometry(1, 0)
    if (data.kind === 'box') return new THREE.BoxGeometry(1, 2.2, 1)
    return new THREE.IcosahedronGeometry(1, 0)
  }, [data.kind])

  const mat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: new THREE.Color('#3ee6ff'),
        wireframe: true,
        transparent: true,
        opacity: 0.09,
        depthWrite: false,
      }),
    []
  )

  return (
    <mesh
      ref={ref}
      geometry={geometry}
      material={mat}
      position={data.pos}
      scale={[baseScale, baseScale, baseScale]}
    />
  )
}

/* ------------------------------------------------------------------ */
/* Deterministic PRNG (pure, idempotent)                               */
/* ------------------------------------------------------------------ */
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

/* ------------------------------------------------------------------ */
/* Network nodes + connection lines                                    */
/* ------------------------------------------------------------------ */
const NODE_COUNT = 14

function NetworkField({ reduced }: { reduced: boolean }) {
  const lineRef = useRef<THREE.LineSegments>(null!)
  const pointsRef = useRef<THREE.Points>(null!)

  const { points, base, lineGeometry, lineColor } = useMemo(() => {
    const rand = mulberry32(0x5001)
    const pts = new Float32Array(NODE_COUNT * 3)
    for (let i = 0; i < NODE_COUNT; i++) {
      pts[i * 3] = (rand() - 0.5) * 22
      pts[i * 3 + 1] = (rand() - 0.5) * 8
      pts[i * 3 + 2] = -4 - rand() * 24
    }
    const segs: number[] = []
    for (let i = 0; i < NODE_COUNT; i++) {
      for (let j = i + 1; j < NODE_COUNT; j++) {
        const dx = pts[i * 3] - pts[j * 3]
        const dy = pts[i * 3 + 1] - pts[j * 3 + 1]
        const dz = pts[i * 3 + 2] - pts[j * 3 + 2]
        if (dx * dx + dy * dy + dz * dz < 42) {
          segs.push(
            pts[i * 3], pts[i * 3 + 1], pts[i * 3 + 2],
            pts[j * 3], pts[j * 3 + 1], pts[j * 3 + 2]
          )
        }
      }
    }
    const lineGeo = new THREE.BufferGeometry()
    lineGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(segs), 3))
    const lineColor = new THREE.Color('#8b9bff')
    return { points: pts, base: new Float32Array(pts), lineGeometry: lineGeo, lineColor }
  }, [])

  useFrame((state) => {
    if (reduced) return
    const p = getPassive()
    const t = state.clock.elapsedTime
    const attr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute
    const arr = attr.array as Float32Array
    const fx = p.cursorX * 10
    const fy = p.cursorY * 4
    const fz = -12
    const str = p.cursorActive * 1.1
    for (let i = 0; i < NODE_COUNT; i++) {
      const bx = base[i * 3]
      const by = base[i * 3 + 1]
      const bz = base[i * 3 + 2]
      let x = bx
      let y = by + Math.sin(t * 0.5 + i) * 0.4
      let z = bz
      const dx = x - fx
      const dy = y - fy
      const dz = z - fz
      const d2 = dx * dx + dy * dy + dz * dz
      if (d2 < 36 && d2 > 0.0001) {
        const d = Math.sqrt(d2)
        const f = (1 - d / 6) * str
        x += (dx / d) * f
        y += (dy / d) * f
        z += (dz / d) * f
      }
      arr[i * 3] = x
      arr[i * 3 + 1] = y
      arr[i * 3 + 2] = z
    }
    attr.needsUpdate = true
    if (lineRef.current) {
      const mat = lineRef.current.material as THREE.LineBasicMaterial
      mat.opacity = 0.07 + Math.sin(t * 0.8) * 0.02 + p.cursorActive * 0.02
    }
  })

  return (
    <group position={[0, 1, 0]}>
      <lineSegments ref={lineRef} geometry={lineGeometry}>
        <lineBasicMaterial color={lineColor} transparent opacity={0.08} depthWrite={false} />
      </lineSegments>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[points, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.12}
          color="#3ee6ff"
          transparent
          opacity={0.18}
          sizeAttenuation
          depthWrite={false}
        />
      </points>
    </group>
  )
}

/* ------------------------------------------------------------------ */
/* Particles                                                           */
/* ------------------------------------------------------------------ */
function ParticleField({ count, reduced }: { count: number; reduced: boolean }) {
  const ref = useRef<THREE.Points>(null!)

  const { positions, base } = useMemo(() => {
    const rand = mulberry32(0x51a7)
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (rand() - 0.5) * 50
      arr[i * 3 + 1] = (rand() - 0.5) * 24
      arr[i * 3 + 2] = (rand() - 0.5) * 40 - 8
    }
    return { positions: arr, base: new Float32Array(arr) }
  }, [count])

  useFrame((state) => {
    if (reduced) return
    const p = getPassive()
    const attr = ref.current.geometry.attributes.position as THREE.BufferAttribute
    const arr = attr.array as Float32Array
    const t = state.clock.elapsedTime
    const fx = p.cursorX * 10
    const fy = p.cursorY * 4
    const fz = -12
    const str = p.cursorActive * 1.6
    for (let i = 0; i < count; i++) {
      const bx = base[i * 3]
      const by = base[i * 3 + 1]
      const bz = base[i * 3 + 2]
      // deterministic drift (no per-frame accumulation)
      const y = by + Math.sin(t * 0.3 + i) * 0.5
      const z = (((bz + 28) + t * 0.9) % 50 + 50) % 50 - 28
      // cursor field — nearby particles separate subtly
      const dx = bx - fx
      const dy = y - fy
      const dz = z - fz
      const d2 = dx * dx + dy * dy + dz * dz
      if (d2 < 49 && d2 > 0.0001) {
        const d = Math.sqrt(d2)
        const f = (1 - d / 7) * str
        arr[i * 3] = bx + (dx / d) * f
        arr[i * 3 + 1] = y + (dy / d) * f
        arr[i * 3 + 2] = z + (dz / d) * f
      } else {
        arr[i * 3] = bx
        arr[i * 3 + 1] = y
        arr[i * 3 + 2] = z
      }
    }
    attr.needsUpdate = true
    ;(ref.current.material as THREE.PointsMaterial).opacity =
      0.11 + Math.sin(t) * 0.04 + p.cursorActive * 0.03
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#9fd4f5"
        transparent
        opacity={0.12}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

/* ------------------------------------------------------------------ */
/* Scene + camera parallax                                             */
/* ------------------------------------------------------------------ */
function Scene({ reduced, touch }: { reduced: boolean; touch: boolean }) {
  const { activeProject } = useSystem()
  const group = useRef<THREE.Group>(null!)
  const cameraPos = useRef({ x: 0, y: 0 })
  const focusPos = useRef<THREE.Vector3 | null>(null)

  const focusedIndex = useMemo(
    () =>
      activeProject
        ? TOWER_LAYOUT.findIndex((t) => t.projectId === activeProject.id)
        : -1,
    [activeProject]
  )

  const focusedTower = focusedIndex >= 0 ? TOWER_LAYOUT[focusedIndex] : null

  useFrame((state) => {
    const p = getPassive()
    if (reduced) return

    if (focusedTower) {
      focusPos.current = new THREE.Vector3(
        focusedTower.pos[0],
        focusedTower.pos[1] + 0.5,
        focusedTower.pos[2] + 3
      )
    } else {
      focusPos.current = null
    }

    const cx = p.cursorX
    const cy = p.cursorY
    // scroll velocity nudges depth slightly — never the content
    const scrollShift = clamp(p.scrollVel * -0.0008, -0.5, 0.5)

    const targetX = focusPos.current ? focusPos.current.x + cx * 0.5 : cx * 0.9
    const targetY = focusPos.current
      ? focusPos.current.y + cy * 0.3
      : cy * 0.5 + scrollShift
    cameraPos.current.x += (targetX - cameraPos.current.x) * 0.05
    cameraPos.current.y += (targetY - cameraPos.current.y) * 0.05
    state.camera.position.x = cameraPos.current.x
    state.camera.position.y = cameraPos.current.y
    const lookTarget = focusPos.current
      ? new THREE.Vector3(
          focusPos.current.x * 0.5,
          focusPos.current.y * 0.5,
          focusPos.current.z
        )
      : new THREE.Vector3(cameraPos.current.x * 0.5, cameraPos.current.y * 0.3, -12)
    state.camera.lookAt(lookTarget)
    if (group.current) {
      group.current.rotation.y = focusPos.current ? 0.06 : cx * 0.03
    }
  })

  return (
    <group ref={group}>
      <GridFloor />
      {TOWER_LAYOUT.map((t, i) => (
        <Tower key={i} data={t} reduced={reduced} focused={focusedIndex === i} />
      ))}
      <NetworkField reduced={reduced || touch} />
      <ParticleField count={touch ? 150 : 320} reduced={reduced} />
      <fog attach="fog" args={['#030509', 8, 40]} />
    </group>
  )
}

/* ------------------------------------------------------------------ */
/* Canvas wrapper                                                      */
/* ------------------------------------------------------------------ */
export default function VirtualWorld() {
  const { reducedMotion, isTouch, gpuMode } = useSystem()

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0"
      aria-hidden="true"
      style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 40%, #05070a, #030509 70%)' }}
    >
      {gpuMode === 'FALLBACK' ? (
        <div className="tech-grid absolute inset-0 opacity-30" />
      ) : (
        <Canvas
          camera={{ position: [0, 0, 6], fov: 55, near: 0.1, far: 80 }}
          dpr={[1, isTouch ? 1 : 1.6]}
          gl={{ antialias: !isTouch, alpha: false, powerPreference: 'high-performance' }}
          onCreated={({ gl, camera }) => {
            gl.setClearColor('#030509')
            gl.clear(true, true, true)
            camera.lookAt(0, 0, -12)
          }}
          style={{ position: 'absolute', inset: 0 }}
        >
          <Scene reduced={reducedMotion} touch={isTouch} />
        </Canvas>
      )}
    </div>
  )
}