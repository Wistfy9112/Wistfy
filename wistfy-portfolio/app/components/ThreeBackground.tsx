'use client'

import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function GridFloor() {
  return (
    <gridHelper
      args={[30, 20, '#1e1e3f', '#1e1e3f']}
      position={[0, -6, 0]}
    />
  )
}

function WireframeIcosahedron() {
  const ref = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (ref.current) {
      const mx = (state.pointer.x * 0.15)
      const my = (state.pointer.y * 0.1)
      ref.current.rotation.x = state.clock.elapsedTime * 0.06 + my
      ref.current.rotation.y = state.clock.elapsedTime * 0.08 + mx
    }
  })

  return (
    <mesh ref={ref} position={[20, 2, -12]} scale={1.8}>
      <icosahedronGeometry args={[1, 0]} />
      <meshBasicMaterial
        color="#818cf8"
        wireframe
        transparent
        opacity={0.3}
      />
    </mesh>
  )
}

function WireframeTorus() {
  const ref = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (ref.current) {
      const mx = (state.pointer.x * 0.15)
      const my = (state.pointer.y * 0.1)
      ref.current.rotation.x = state.clock.elapsedTime * 0.05 + my
      ref.current.rotation.z = state.clock.elapsedTime * 0.07 + mx * 0.5
    }
  })

  return (
    <mesh ref={ref} position={[-20, 2.5, -12]} scale={1.4}>
      <torusGeometry args={[1, 0.3, 12, 24]} />
      <meshBasicMaterial
        color="#22d3ee"
        wireframe
        transparent
        opacity={0.28}
      />
    </mesh>
  )
}

function WireframeBox() {
  const ref = useRef<THREE.LineSegments>(null)

  useFrame((state) => {
    if (ref.current) {
      const mx = (state.pointer.x * 0.12)
      const my = (state.pointer.y * 0.08)
      ref.current.rotation.x = state.clock.elapsedTime * 0.04 + my
      ref.current.rotation.y = state.clock.elapsedTime * 0.1 + mx
    }
  })

  return (
    <lineSegments ref={ref} position={[-20, -1.5, -12]}>
      <edgesGeometry args={[new THREE.BoxGeometry(1.8, 1.8, 1.8)]} />
      <lineBasicMaterial color="#f472b6" transparent opacity={0.22} />
    </lineSegments>
  )
}

export default function ThreeBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0">
      <Canvas
        camera={{ position: [0, 1, 10], fov: 55 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <GridFloor />
        <WireframeIcosahedron />
        <WireframeTorus />
        <WireframeBox />
      </Canvas>
    </div>
  )
}
