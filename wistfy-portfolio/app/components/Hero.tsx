'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { PROFILE } from '@/app/data/system'
import { useSystem } from '@/app/system/SystemProvider'
import { sfx } from '@/app/utils/sound'

const CLASSIFICATION = [
  { code: 'ROLE_01', label: 'GRAPHICS PROGRAMMER' },
  { code: 'ROLE_02', label: 'SOFTWARE ENGINEER' },
  { code: 'ROLE_03', label: 'CREATIVE TECHNOLOGIST' },
]

const READY_STATES = [
  'CONNECTING TO VIRTUAL ENVIRONMENT',
  'GPU SUBSYSTEM: ONLINE',
  'PROJECT DATABASE: MOUNTED',
  'VIRTUAL ENVIRONMENT READY',
]

function useReadyTerminal() {
  const { reducedMotion } = useSystem()
  const [stateIndex, setStateIndex] = useState(() =>
    reducedMotion ? READY_STATES.length - 1 : 0
  )
  const [typed, setTyped] = useState(() =>
    reducedMotion ? READY_STATES[READY_STATES.length - 1] : ''
  )

  useEffect(() => {
    if (reducedMotion) return
    let timeout: ReturnType<typeof setTimeout>
    const current = READY_STATES[stateIndex]

    if (typed.length < current.length) {
      timeout = setTimeout(() => setTyped(current.slice(0, typed.length + 1)), 34)
    } else if (stateIndex < READY_STATES.length - 1) {
      timeout = setTimeout(() => {
        setStateIndex((i) => i + 1)
        setTyped('')
      }, 420)
    }
    return () => clearTimeout(timeout)
  }, [typed, stateIndex, reducedMotion])

  return { stateIndex, typed }
}

export default function Hero() {
  const { soundOn, pushLog, debugMode, gpuMode, reducedMotion } = useSystem()
  const { stateIndex, typed } = useReadyTerminal()

  const scrollToProjects = () => {
    if (soundOn) sfx.select()
    pushLog('ACCESSING PROJECT DATABASE...')
    document.getElementById('module-projects')?.scrollIntoView({ behavior: 'smooth' })
  }

  const scrollToAbout = () => {
    if (soundOn) sfx.click()
    pushLog('Opening system profile...')
    document.getElementById('module-about')?.scrollIntoView({ behavior: 'smooth' })
  }

  const isReady = stateIndex === READY_STATES.length - 1 && typed === READY_STATES[READY_STATES.length - 1]

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
          <div className="flex items-center gap-4">
            <span className="mono text-[10px] tracking-[0.2em] text-cyan">IDENTITY /</span>
            <span className="display text-xl font-medium tracking-wide text-ink md:text-2xl">
              WISTFY
            </span>
          </div>
          {CLASSIFICATION.map((c) => (
            <div key={c.code} className="flex items-center gap-4">
              <span className="mono text-[10px] tracking-[0.2em] text-ink-4">{c.code}</span>
              <span className="display text-xl font-medium tracking-wide text-ink-2 md:text-2xl">
                {c.label}
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
          <span className={isReady ? 'text-cyan' : 'text-ink-2'}>{typed}</span>
          <span className="cursor-blink text-cyan">▌</span>
        </div>
        <div className="mono mt-1 text-[9px] tracking-[0.25em] text-ink-4">
          {gpuMode === 'FALLBACK' ? 'GRAPHICS MODE: FALLBACK' : 'RENDER: WEBGL / REAL-TIME'}
        </div>

        <div className="mt-12 flex flex-wrap items-center gap-4">
          <button onClick={scrollToProjects} className="btn-hud" aria-label="Enter project database">
            <span className="inline-block size-2 bg-cyan" />
            [ ACCESS DATABASE ]
          </button>
          <button onClick={scrollToAbout} className="btn-hud btn-ghost">
            [ SYSTEM PROFILE ]
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
