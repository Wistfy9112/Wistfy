'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { PROFILE } from '@/app/data/system'
import { useSystem } from '@/app/system/SystemProvider'
import { sfx } from '@/app/utils/sound'

const ROLES = ['GRAPHICS PROGRAMMER', 'SOFTWARE ENGINEER', 'CREATIVE TECHNOLOGIST']

export default function Hero() {
  const { soundOn, pushLog, debugMode, reducedMotion } = useSystem()
  const [typed, setTyped] = useState(reducedMotion ? ROLES[0] : '')
  const [roleIndex, setRoleIndex] = useState(0)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (reducedMotion) return
    let timeout: ReturnType<typeof setTimeout>
    const current = ROLES[roleIndex]

    if (!deleting) {
      if (typed.length < current.length) {
        timeout = setTimeout(() => setTyped(current.slice(0, typed.length + 1)), 55)
      } else {
        timeout = setTimeout(() => setDeleting(true), 1800)
      }
    } else {
      if (typed.length > 0) {
        timeout = setTimeout(() => setTyped(current.slice(0, typed.length - 1)), 28)
      } else {
        timeout = setTimeout(() => {
          setDeleting(false)
          setRoleIndex((i) => (i + 1) % ROLES.length)
        }, 200)
      }
    }
    return () => clearTimeout(timeout)
  }, [typed, deleting, roleIndex, reducedMotion])

  const scrollToProjects = () => {
    if (soundOn) sfx.select()
    pushLog('Opening PROJECT DATABASE...')
    document.getElementById('module-projects')?.scrollIntoView({ behavior: 'smooth' })
  }

  const scrollToAbout = () => {
    if (soundOn) sfx.click()
    document.getElementById('module-about')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      id="module-hero"
      className="relative flex min-h-screen items-center overflow-hidden px-5 md:px-8"
      aria-label="WISTFY system welcome"
    >
      <div className="tech-grid-fade pointer-events-none absolute inset-0" />

      <div className="relative z-10 mx-auto w-full max-w-6xl">
        <div className="mb-6 flex items-center gap-3">
          <span className="status-live inline-block size-2 bg-cyan" />
          <span className="mono text-[11px] tracking-[0.3em] text-ink-3">
            SYSTEM STATUS: {debugMode ? 'DEBUG' : 'ONLINE'} / ACCESS GRANTED
          </span>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <h1
            className="display text-[17vw] font-bold leading-none tracking-tight text-ink md:text-[9rem] lg:text-[10rem]"
            style={{ textShadow: '0 0 40px rgba(62,230,255,0.15)' }}
          >
            WISTFY
            <span className="ml-4 inline-block size-[0.08em] rounded-sm bg-cyan align-middle" />
          </h1>
        </motion.div>

        <div className="mt-8 space-y-1">
          {ROLES.map((role, i) => (
            <div key={role} className="flex items-center gap-4">
              <span className="mono text-[10px] tracking-[0.2em] text-ink-4">
                ROL_{String(i + 1).padStart(2, '0')}
              </span>
              <span
                className={`display text-xl font-medium tracking-wide md:text-2xl ${
                  i === 0 ? 'text-cyan' : 'text-ink-2'
                }`}
              >
                {role}
              </span>
            </div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mt-8 max-w-xl text-base leading-relaxed text-ink-2 md:text-lg"
        >
          {PROFILE.statement}
        </motion.p>

        <div className="mono mt-6 flex items-center gap-2 text-[11px] tracking-[0.2em] text-ink-4">
          <span className="text-cyan">&gt;</span>
          <span className="text-ink-2">INIT:</span> {typed}
          <span className="cursor-blink text-cyan">▌</span>
        </div>

        <div className="mt-12 flex flex-wrap items-center gap-4">
          <button onClick={scrollToProjects} className="btn-hud" aria-label="Enter project database">
            <span className="inline-block size-2 bg-cyan" />
            ENTER PROJECT DATABASE
          </button>
          <button onClick={scrollToAbout} className="btn-hud btn-ghost">
            SYSTEM PROFILE
          </button>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-12 left-1/2 -translate-x-1/2">
        <motion.div
          animate={reducedMotion ? undefined : { y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-2"
        >
          <span className="mono text-[10px] tracking-[0.3em] text-ink-4">SCROLL ▾</span>
        </motion.div>
      </div>
    </section>
  )
}