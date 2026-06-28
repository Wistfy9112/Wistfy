'use client'

import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, MeshDistortMaterial, Torus, Icosahedron } from '@react-three/drei'
import * as THREE from 'three'

const roles = [
  'Software Engineer',
  'Graphics Programmer',
  'OpenGL Developer',
  'Game Engine Builder',
]

function ThreeDRing() {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3
    }
  })

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <Torus ref={meshRef} args={[1.8, 0.06, 32, 64]}>
        <MeshDistortMaterial
          color="#6366f1"
          roughness={0.2}
          metalness={0.9}
          distort={0.1}
          speed={3}
          transparent
          opacity={0.8}
        />
      </Torus>
      <Torus args={[1.4, 0.04, 32, 64]} position={[0, 0, 0.5]}>
        <meshStandardMaterial
          color="#06b6d4"
          roughness={0.3}
          metalness={0.7}
          transparent
          opacity={0.5}
        />
      </Torus>
      <Icosahedron args={[0.3, 0]} position={[0, 0, 0]}>
        <MeshDistortMaterial
          color="#ec4899"
          roughness={0.2}
          metalness={0.8}
          distort={0.4}
          speed={2}
          transparent
          opacity={0.6}
        />
      </Icosahedron>
    </Float>
  )
}

export default function Hero() {
  const [displayText, setDisplayText] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)
  const stateRef = useRef({
    roleIndex: 0,
    charIndex: 0,
    deleting: false,
  })

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>

    const tick = () => {
      const s = stateRef.current
      const currentRole = roles[s.roleIndex]

      if (!s.deleting) {
        if (s.charIndex < currentRole.length) {
          s.charIndex++
          setDisplayText(currentRole.substring(0, s.charIndex))
          timeout = setTimeout(tick, 80)
        } else {
          s.deleting = true
          timeout = setTimeout(tick, 2000)
        }
      } else {
        if (s.charIndex > 0) {
          s.charIndex--
          setDisplayText(currentRole.substring(0, s.charIndex))
          timeout = setTimeout(tick, 40)
        } else {
          s.deleting = false
          s.roleIndex = (s.roleIndex + 1) % roles.length
          timeout = setTimeout(tick, 200)
        }
      }
    }

    timeout = setTimeout(tick, 200)
    return () => clearTimeout(timeout)
  }, [])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const handleMouse = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width - 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5
      el.style.setProperty('--rotate-x', `${y * -8}deg`)
      el.style.setProperty('--rotate-y', `${x * 8}deg`)
    }
    el.addEventListener('mousemove', handleMouse)
    return () => el.removeEventListener('mousemove', handleMouse)
  }, [])

  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-6"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-primary/8 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-secondary/8 blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-2/5 blur-[100px]" />
      </div>

      <div className="absolute inset-0 overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute h-px w-24 bg-gradient-to-r from-transparent via-primary/10 to-transparent"
            style={{
              top: `${10 + i * 11}%`,
              left: `${(i % 4) * 25 + 5}%`,
              transform: `rotate(${i * 20}deg)`,
              animation: `float ${5 + i * 0.7}s ease-in-out infinite`,
              animationDelay: `${i * 0.4}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-2">
        <motion.div
          ref={containerRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          style={{
            opacity: 0,
            transform: 'perspective(1000px) rotateX(var(--rotate-x, 0deg)) rotateY(var(--rotate-y, 0deg))',
            transition: 'transform 0.1s ease-out',
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5, type: 'spring' }}
              className="mb-8 flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-5 py-2 text-sm"
            >
              <span className="relative flex size-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-primary" />
              </span>
              Available for opportunities
            </motion.div>

            <h1 className="mb-4 text-5xl font-bold leading-tight md:text-7xl">
              Hi, I&apos;m{' '}
              <span className="text-shimmer">Võ Đình Huy</span>
            </h1>
            <p className="mb-4 text-lg text-primary md:text-xl">
              @Wistfy
            </p>

            <div className="mb-6 h-10">
              <span className="text-xl text-gray-text md:text-2xl">
                {displayText}
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
                  className="inline-block w-0.5 bg-primary"
                >
                  |
                </motion.span>
              </span>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="mb-8 max-w-xl text-base leading-relaxed text-gray-text md:text-lg"
            >
              I build high-performance graphics applications and game engines.
              From OpenGL rendering pipelines to real-time simulations —
              I turn complex algorithms into visual reality.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="flex flex-wrap items-center gap-4"
            >
              <a
                href="#projects"
                className="group relative overflow-hidden rounded-full bg-primary px-8 py-3 font-medium text-white transition-all hover:glow-lg"
              >
                <span className="absolute inset-0 -translate-x-full skew-x-12 bg-white/20 transition-transform duration-300 group-hover:translate-x-full" />
                <span className="relative">View Projects</span>
              </a>
              <a
                href="#contact"
                className="group relative overflow-hidden rounded-full border border-white/10 px-8 py-3 font-medium text-light transition-all hover:border-primary/50 hover:text-primary"
              >
                <span className="absolute inset-0 bg-primary/5 translate-y-full rounded-full transition-transform duration-300 group-hover:translate-y-0" />
                <span className="relative">Get In Touch</span>
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              className="mt-12 flex items-center gap-6"
            >
              <SocialIcon href="https://github.com/Wistfy9112" label="GitHub">
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                <path d="M9 18c-4.51 2-5-2-7-2" />
              </SocialIcon>
              <SocialIcon href="https://www.linkedin.com/in/vo-dinh-huy-bb6a45257/" label="LinkedIn">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect width="4" height="12" x="2" y="9" />
                <circle cx="4" cy="4" r="2" />
              </SocialIcon>
              <SocialIcon href="https://www.facebook.com/Wistfy" label="Facebook">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </SocialIcon>
              <SocialIcon href="https://www.instagram.com/wistfy_/" label="Instagram">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
              </SocialIcon>
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="hidden h-[400px] w-full lg:block"
          style={{ opacity: 0 }}
        >
          <Canvas
            camera={{ position: [0, 0, 5], fov: 45 }}
            gl={{ antialias: true, alpha: true }}
          >
            <ambientLight intensity={0.4} />
            <directionalLight position={[3, 3, 5]} intensity={1.2} />
            <directionalLight position={[-3, -3, -5]} intensity={0.4} color="#6366f1" />
            <ThreeDRing />
          </Canvas>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
        style={{ opacity: 0 }}
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-xs uppercase tracking-widest text-gray-text">
            Scroll
          </span>
          <div className="h-8 w-px bg-gradient-to-b from-primary to-transparent" />
        </motion.div>
      </motion.div>
    </section>
  )
}

function SocialIcon({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="group relative"
      aria-label={label}
    >
      <div className="absolute inset-0 scale-0 rounded-full bg-primary/10 transition-transform duration-300 group-hover:scale-150" />
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="relative text-gray-text transition-all duration-300 group-hover:text-primary group-hover:glow"
      >
        {children}
      </svg>
    </a>
  )
}
