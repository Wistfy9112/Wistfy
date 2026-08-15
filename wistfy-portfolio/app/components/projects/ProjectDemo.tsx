'use client'

import { useEffect, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { Project } from '@/app/data/projects'
import { useSystem } from '@/app/system/SystemProvider'

function SpinningScene({
  wireframe,
  lighting,
  particles,
}: {
  wireframe: boolean
  lighting: boolean
  particles: boolean
}) {
  const mainRef = useRef<THREE.Mesh>(null!)
  const innerRef = useRef<THREE.Mesh>(null!)
  const partsRef = useRef<THREE.Points>(null!)

  const positions = useRef<Float32Array | null>(null)

  useEffect(() => {
    const count = 500
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 6
      arr[i * 3 + 1] = (Math.random() - 0.5) * 6
      arr[i * 3 + 2] = (Math.random() - 0.5) * 6
    }
    positions.current = arr
    if (partsRef.current) {
      partsRef.current.geometry.setAttribute(
        'position',
        new THREE.BufferAttribute(arr, 3)
      )
    }
  }, [])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (mainRef.current) {
      mainRef.current.rotation.x = t * 0.4
      mainRef.current.rotation.y = t * 0.5
    }
    if (innerRef.current) {
      innerRef.current.rotation.x = -t * 0.7
      innerRef.current.rotation.y = t * 0.3
    }
    if (particles && partsRef.current && positions.current) {
      partsRef.current.rotation.y = t * 0.15
      partsRef.current.rotation.x = Math.sin(t * 0.1) * 0.2
    }
  })

  return (
    <>
      {lighting && <ambientLight intensity={0.6} />}
      {lighting && <directionalLight position={[3, 3, 5]} intensity={1.4} color="#9fd4f5" />}
      {lighting && <directionalLight position={[-3, -2, -4]} intensity={0.6} color="#8b9bff" />}

      <mesh ref={mainRef}>
        <torusKnotGeometry args={[1, 0.32, wireframe ? 48 : 160, wireframe ? 12 : 24]} />
        {lighting ? (
          <meshStandardMaterial
            color="#3ee6ff"
            wireframe={wireframe}
            roughness={0.25}
            metalness={0.7}
            transparent
            opacity={wireframe ? 0.9 : 0.95}
          />
        ) : (
          <meshBasicMaterial
            color="#3ee6ff"
            wireframe={wireframe}
            transparent
            opacity={wireframe ? 0.9 : 0.8}
          />
        )}
      </mesh>

      <mesh ref={innerRef}>
        <icosahedronGeometry args={[0.7, wireframe ? 1 : 2]} />
        <meshStandardMaterial color="#8b9bff" wireframe transparent opacity={0.55} roughness={0.4} metalness={0.5} />
      </mesh>

      {particles && (
        <points ref={partsRef}>
          <bufferGeometry />
          <pointsMaterial
            size={0.06}
            color="#9fd4f5"
            transparent
            opacity={0.8}
            sizeAttenuation
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </points>
      )}
    </>
  )
}

export default function ProjectDemo({ project }: { project: Project }) {
  const { reducedMotion, isTouch } = useSystem()
  const [wireframe, setWireframe] = useState(false)
  const [lighting, setLighting] = useState(true)
  const [particles, setParticles] = useState(true)
  const [fps, setFps] = useState(60)
  const frames = useRef(0)
  const lastTime = useRef(0)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase()
      if (k === 'w') setWireframe((v) => !v)
      if (k === 'l') setLighting((v) => !v)
      if (k === 'p') setParticles((v) => !v)
      if (k === 'r') {
        setWireframe(false)
        setLighting(true)
        setParticles(true)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    let raf: number
    const loop = (t: number) => {
      frames.current++
      if (t - lastTime.current >= 1000) {
        setFps(frames.current)
        frames.current = 0
        lastTime.current = t
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  const keys = [
    { k: 'W', label: 'WIREFRAME', active: wireframe, on: () => setWireframe((v) => !v) },
    { k: 'L', label: 'LIGHTING', active: lighting, on: () => setLighting((v) => !v) },
    { k: 'P', label: 'PARTICLES', active: particles, on: () => setParticles((v) => !v) },
    { k: 'R', label: 'RESET', active: false, on: () => { setWireframe(false); setLighting(true); setParticles(true) } },
  ]

  return (
    <div className="hud-frame relative mb-6 overflow-hidden border-line/60">
      <div className="mono flex items-center justify-between border-b border-line/60 px-4 py-2 text-[9px] tracking-[0.2em] text-ink-3">
        <span>LIVE PREVIEW // {project.id.toUpperCase()}</span>
        <span className="text-cyan">FPS {fps}</span>
      </div>

      <div className="relative h-56 md:h-64" style={{ background: '#04060a' }}>
        <Canvas
          camera={{ position: [0, 0, 5], fov: 55 }}
          dpr={[1, isTouch ? 1 : 1.5]}
          gl={{ antialias: !isTouch, alpha: false, powerPreference: 'high-performance' }}
        >
          <color attach="background" args={['#04060a']} />
          <SpinningScene wireframe={wireframe} lighting={lighting} particles={particles && !reducedMotion} />
        </Canvas>

        {/* HUD overlays */}
        <div className="mono pointer-events-none absolute left-3 top-3 space-y-1 text-[9px] leading-relaxed text-ink-3/80">
          <div>RENDERER: WEBGL2</div>
          <div>GEOMETRY: TORUS_KNOT</div>
          <div>SHADER: {wireframe ? 'WIREFRAME' : 'PBR'}</div>
        </div>
        <div className="mono pointer-events-none absolute right-3 top-3 space-y-1 text-right text-[9px] leading-relaxed text-ink-3/80">
          <div>VSYNC: ON</div>
          <div>MODE: {lighting ? 'LIT' : 'UNLIT'}</div>
          <div>PRIMITIVES: {particles ? '2K' : '1K'}</div>
        </div>

        {/* controls */}
        <div className="mono absolute bottom-3 left-3 flex flex-wrap gap-2">
          {keys.map((item) => (
            <button
              key={item.k}
              onClick={item.on}
              className="border px-2 py-1 text-[9px] tracking-[0.15em] transition-colors"
              style={{
                borderColor: item.active ? 'var(--accent)' : 'var(--line)',
                color: item.active ? 'var(--accent)' : 'var(--color-ink-3)',
              }}
              aria-pressed={item.active}
            >
              [{item.k}] {item.label}
            </button>
          ))}
        </div>
        <div className="mono pointer-events-none absolute bottom-3 right-3 hidden text-[9px] tracking-[0.2em] text-ink-4 sm:block">
          DRAG TO ROTATE
        </div>
      </div>
    </div>
  )
}