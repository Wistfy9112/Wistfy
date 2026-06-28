'use client'

import { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { motion } from 'framer-motion'
import * as THREE from 'three'

const SECTIONS = ['hero', 'about', 'stats', 'skills', 'projects', 'experience', 'contact']
interface Style { grid: string; accent: string; sky: string }
const SECTOR: Record<string, Style> = {
  hero: { grid: '#a78bfa', accent: '#fbbf24', sky: '#3b0764' },
  about: { grid: '#2dd4bf', accent: '#6ee7b7', sky: '#064e3b' },
  stats: { grid: '#38bdf8', accent: '#7dd3fc', sky: '#0c4a6e' },
  skills: { grid: '#facc15', accent: '#fde047', sky: '#713f12' },
  projects: { grid: '#67e8f9', accent: '#a5f3fc', sky: '#164e63' },
  experience: { grid: '#fb923c', accent: '#fdba74', sky: '#7c2d12' },
  contact: { grid: '#e879f9', accent: '#f0abfc', sky: '#581c87' },
}
function getStyle(i: number) { return SECTOR[SECTIONS[i]] }



// =================== GRID ===================
function makeGridTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  const size = 512
  canvas.width = canvas.height = size
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = '#000'
  ctx.fillRect(0, 0, size, size)

  ctx.strokeStyle = 'rgba(255,255,255,0.45)'
  ctx.lineWidth = 1.5
  const cells = 8
  const cell = size / cells

  for (let i = 0; i <= cells; i++) {
    const p = Math.round(i * cell)
    ctx.beginPath(); ctx.moveTo(p, 0); ctx.lineTo(p, size); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(0, p); ctx.lineTo(size, p); ctx.stroke()
  }

  const tex = new THREE.CanvasTexture(canvas)
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  tex.repeat.set(4, 6)
  tex.anisotropy = 4
  return tex
}

function GridFloor({ activeIndex }: { activeIndex: number }) {
  const ref = useRef<THREE.Mesh>(null!)
  const pulse = useRef(0)

  useEffect(() => {
    const mat = ref.current.material as THREE.MeshBasicMaterial
    mat.map = makeGridTexture()
    mat.color = new THREE.Color(getStyle(activeIndex).grid)
    mat.needsUpdate = true
  }, [activeIndex])

  useFrame((_, delta) => {
    pulse.current += delta
    const mat = ref.current.material as THREE.MeshBasicMaterial
    mat.color = new THREE.Color(getStyle(activeIndex).grid)
    mat.opacity = 0.4 + Math.sin(pulse.current * 0.2) * 0.04
  })

  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, -3, -8]}>
      <planeGeometry args={[40, 90]} />
      <meshBasicMaterial transparent opacity={0.4} depthWrite={false} />
    </mesh>
  )
}

// =================== SKY GRADIENT ===================
function makeSkyTexture(hex: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 1
  canvas.height = 256
  const ctx = canvas.getContext('2d')!
  const c = new THREE.Color(hex)
  const R = Math.round(c.r * 255), G = Math.round(c.g * 255), B = Math.round(c.b * 255)
  const grad = ctx.createLinearGradient(0, 0, 0, 256)
  grad.addColorStop(0, `rgba(${R},${G},${B},1)`)
  grad.addColorStop(0.4, `rgba(${R},${G},${B},0.6)`)
  grad.addColorStop(1, `rgba(${R},${G},${B},0)`)
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, 1, 256)
  const tex = new THREE.CanvasTexture(canvas)
  tex.minFilter = THREE.LinearFilter
  return tex
}

function SkyDome({ activeIndex }: { activeIndex: number }) {
  const ref = useRef<THREE.Mesh>(null!)

  useEffect(() => {
    const mat = ref.current.material as THREE.MeshBasicMaterial
    mat.map = makeSkyTexture(getStyle(activeIndex).sky)
    mat.needsUpdate = true
  }, [activeIndex])

  return (
    <mesh ref={ref} position={[0, 5, -50]}>
      <planeGeometry args={[200, 200]} />
      <meshBasicMaterial transparent opacity={0.7} depthWrite={false} side={THREE.DoubleSide} />
    </mesh>
  )
}

// =================== SCANNER DOME ===================
function ScannerDome({ activeIndex }: { activeIndex: number }) {
  const arcRef = useRef<THREE.LineSegments>(null!)
  const scanRef = useRef<THREE.LineSegments>(null!)
  const color = useRef(new THREE.Color())

  useEffect(() => {
    const verts: number[] = []
    const rings = 6
    for (let r = 1; r <= rings; r++) {
      const radius = r * 2
      const segments = 32
      for (let i = 0; i <= segments; i++) {
        const theta = (i / segments) * Math.PI
        const x = Math.sin(theta) * radius
        const y = Math.cos(theta) * radius
        verts.push(x, y, 0)
      }
    }
    for (let i = 0; i <= 16; i++) {
      const theta = (i / 16) * Math.PI
      const x = Math.sin(theta) * 12
      const y = Math.cos(theta) * 12
      verts.push(x, y, -4, x, y, 4)
    }
    arcRef.current.geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(verts), 3))

    const scanVerts = new Float32Array([
      0, 12, 0, 0, -4, 0,
      0, 10, 4, 0, -2, 4,
      0, 10, -4, 0, -2, -4,
    ])
    scanRef.current.geometry.setAttribute('position', new THREE.BufferAttribute(scanVerts, 3))
  }, [])

  useFrame(() => {
    color.current.set(getStyle(activeIndex).accent)
    if (arcRef.current) {
      (arcRef.current.material as THREE.LineBasicMaterial).color = color.current
    }
    if (scanRef.current) {
      scanRef.current.position.x = Math.sin(Date.now() / 2000) * 10
      scanRef.current.position.z = Math.cos(Date.now() / 2500) * 10
      ;(scanRef.current.material as THREE.LineBasicMaterial).color = color.current
    }
  })

  return (
    <group position={[0, 5, -20]}>
      <lineSegments ref={arcRef}>
        <bufferGeometry />
        <lineBasicMaterial color="#a78bfa" transparent opacity={0.25} depthWrite={false} />
      </lineSegments>
      <lineSegments ref={scanRef}>
        <bufferGeometry />
        <lineBasicMaterial color="#a78bfa" transparent opacity={0.4} depthWrite={false} />
      </lineSegments>
    </group>
  )
}

// =================== PARTICLES ===================
const PCOUNT = 500

function Particles({ activeIndex }: { activeIndex: number }) {
  const ref = useRef<THREE.Points>(null!)

  useEffect(() => {
    const pos = new Float32Array(PCOUNT * 3)
    const vel = new Float32Array(PCOUNT * 3)
    const col = new Float32Array(PCOUNT * 3)
    for (let i = 0; i < PCOUNT; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 24
      pos[i * 3 + 1] = Math.random() * 8 - 2
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20 - 10
      vel[i * 3] = (Math.random() - 0.5) * 0.003
      vel[i * 3 + 1] = Math.random() * 0.002
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.003
      col[i * 3] = col[i * 3 + 1] = col[i * 3 + 2] = 0.5
    }
    ref.current.geometry.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    ref.current.geometry.setAttribute('color', new THREE.BufferAttribute(col, 3))
  }, [])

  useFrame((state) => {
    const geo = ref.current.geometry
    if (!geo.attributes.position) return
    const c = new THREE.Color(getStyle(activeIndex).accent)
    const pos = geo.attributes.position.array as Float32Array
    const col = geo.attributes.color.array as Float32Array

    for (let i = 0; i < PCOUNT; i++) {
      const i3 = i * 3
      pos[i3] += (Math.random() - 0.5) * 0.002
      pos[i3 + 1] += Math.sin(state.clock.elapsedTime * 0.1 + i) * 0.0003
      pos[i3 + 2] += (Math.random() - 0.5) * 0.002

      if (pos[i3] > 12) pos[i3] = -12
      if (pos[i3] < -12) pos[i3] = 12
      if (pos[i3 + 1] > 6) pos[i3 + 1] = -3
      if (pos[i3 + 1] < -3) pos[i3 + 1] = 6
      if (pos[i3 + 2] > -3) pos[i3 + 2] = -25
      if (pos[i3 + 2] < -25) pos[i3 + 2] = -3

      const bright = 0.2 + Math.sin(state.clock.elapsedTime * 0.5 + i * 0.3) * 0.15 + 0.4
      col[i3] = c.r * bright
      col[i3 + 1] = c.g * bright
      col[i3 + 2] = c.b * bright
    }
    geo.attributes.position.needsUpdate = true
    geo.attributes.color.needsUpdate = true
  })

  return (
    <points ref={ref}>
      <bufferGeometry />
      <pointsMaterial size={0.06} vertexColors transparent opacity={0.5}
        sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  )
}

// =================== DETECTOR ===================
function SectionDetector({ onChange }: { onChange: (i: number) => void }) {
  useEffect(() => {
    const handler = () => {
      const y = window.scrollY + window.innerHeight / 3
      for (let i = SECTIONS.length - 1; i >= 0; i--) {
        const el = document.getElementById(SECTIONS[i])
        if (el && el.offsetTop <= y) { onChange(i); break }
      }
    }
    window.addEventListener('scroll', handler, { passive: true })
    handler()
    return () => window.removeEventListener('scroll', handler)
  }, [onChange])
  return null
}

// =================== SCENE ===================
function LyokoScene({ activeIndex }: { activeIndex: number }) {
  return (
    <>
      <ambientLight intensity={0.15} />
      <SkyDome activeIndex={activeIndex} />
      <ScannerDome activeIndex={activeIndex} />
      <GridFloor activeIndex={activeIndex} />
      <Particles activeIndex={activeIndex} />
    </>
  )
}

// =================== EXPORT ===================
export default function ThreeBackground() {
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
      className="pointer-events-none fixed inset-0 z-0"
      style={{ backgroundColor: '#000', opacity: 0 }}
    >
      <SectionDetector onChange={setActiveIndex} />
      <Canvas
        camera={{ position: [0, 3.5, 7], fov: 60, near: 0.1, far: 150 }}
        onCreated={({ camera, gl }) => { 
          gl.setClearColor('#000000')
          gl.clear(true, true, true)
          ;(camera as THREE.PerspectiveCamera).lookAt(0, -1, -30) 
        }}
        gl={{ antialias: true, alpha: false }}
        style={{ background: '#000' }}
      >
        <LyokoScene activeIndex={activeIndex} />
      </Canvas>
    </motion.div>
  )
}
