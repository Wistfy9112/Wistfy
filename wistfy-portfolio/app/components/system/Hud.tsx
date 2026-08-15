'use client'

import { useEffect, useRef, useState } from 'react'
import { useSystem, type ModuleId } from '@/app/system/SystemProvider'
import { sfx } from '@/app/utils/sound'

const MODULES: { id: ModuleId; code: string; label: string; section: string }[] = [
  { id: 'projects', code: 'SYS//01', label: 'PROJECTS', section: 'module-projects' },
  { id: 'about', code: 'SYS//02', label: 'ABOUT', section: 'module-about' },
  { id: 'skills', code: 'SYS//03', label: 'SKILLS', section: 'module-skills' },
  { id: 'contact', code: 'SYS//04', label: 'CONTACT', section: 'module-contact' },
]

function useClock() {
  const [time, setTime] = useState('--:--:--')
  const [uptime, setUptime] = useState('0.0')
  const startRef = useRef<number>(0)

  useEffect(() => {
    const tick = () => {
      if (startRef.current === 0) startRef.current = performance.now()
      setTime(
        new Date().toLocaleTimeString('en-GB', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      )
      setUptime(((performance.now() - startRef.current) / 1000).toFixed(1))
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])
  return { time, uptime }
}

export function useActiveModule() {
  const { setActiveModule } = useSystem()
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const id = entry.target.id
            const mod = MODULES.find((m) => m.section === id)
            if (mod) setActiveModule(mod.id)
          }
        }
      },
      { threshold: 0.35 }
    )
    MODULES.forEach((m) => {
      const el = document.getElementById(m.section)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [setActiveModule])
}

export function HudTop() {
  const { soundOn, toggleSound, pushLog, debugMode, enableDebug } = useSystem()
  const { time, uptime } = useClock()
  const [clicks, setClicks] = useState(0)

  const handleSysClicks = () => {
    const c = clicks + 1
    setClicks(c)
    if (c >= 5) {
      enableDebug()
      pushLog('DEBUG MODE UNLOCKED')
      if (soundOn) sfx.debug()
      setClicks(0)
    } else if (c === 3) {
      pushLog('SYSTEM: unauthorized access attempt')
    }
  }

  return (
    <header className="mono pointer-events-none fixed inset-x-0 top-0 z-40 flex items-center justify-between border-b border-line bg-abyss-1/80 px-4 py-2.5 text-[10px] tracking-[0.25em] backdrop-blur-sm md:px-6">
      <button
        onClick={handleSysClicks}
        className="pointer-events-auto flex items-center gap-2 text-ink transition-colors hover:text-cyan"
        aria-label="WISTFY system indicator"
      >
        <span className={`inline-block size-1.5 ${debugMode ? 'bg-cyan' : 'status-live bg-cyan'}`} />
        <span className="text-ink">WISTFY SYSTEM</span>
        <span className="hidden text-ink-4 sm:inline">/ {debugMode ? 'DBG-004' : 'SYS-001'}</span>
      </button>

      <div className="pointer-events-auto flex items-center gap-4 md:gap-6">
        <span className="hidden text-ink-3 sm:inline">UPTIME {uptime}s</span>
        <span className="hidden text-ink-3 md:inline">{time}</span>
        <button
          onClick={() => {
            toggleSound()
            if (!soundOn) pushLog('SOUND: ON')
            else pushLog('SOUND: OFF')
          }}
          className="text-ink-3 transition-colors hover:text-cyan"
          aria-label={`Turn sound ${soundOn ? 'off' : 'on'}`}
        >
          SOUND: {soundOn ? 'ON' : 'OFF'}
        </button>
      </div>
    </header>
  )
}

export function HudRail() {
  const { activeModule, setActiveModule, pushLog, soundOn } = useSystem()

  const go = (mod: { id: ModuleId; code: string; label: string; section: string }) => {
    if (soundOn) sfx.click()
    setActiveModule(mod.id)
    pushLog(`Module selected: ${mod.label}`)
    document.getElementById(mod.section)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav
      className="mono pointer-events-none fixed left-4 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-1 text-[10px] tracking-[0.25em] lg:flex"
      aria-label="System modules"
    >
      {MODULES.map((mod) => {
        const active = activeModule === mod.id
        return (
          <button
            key={mod.id}
            onClick={() => go(mod)}
            className={`pointer-events-auto group flex items-center gap-3 py-2 text-left transition-colors ${
              active ? 'text-cyan' : 'text-ink-4 hover:text-ink-2'
            }`}
            aria-current={active ? 'true' : undefined}
          >
            <span
              className="inline-block h-px transition-all duration-300"
              style={{
                width: active ? 28 : 16,
                background: active ? 'var(--accent)' : 'var(--color-ink-4)',
              }}
            />
            <span className="flex flex-col leading-tight">
              <span>{mod.label}</span>
              <span className="text-[8px] tracking-[0.2em] text-ink-4">{mod.code}</span>
            </span>
            <span
              className={`ml-1 inline-block size-1.5 rounded-full transition-all ${
                active ? 'bg-cyan pulse-ring' : 'bg-ink-4 group-hover:bg-ink-3'
              }`}
            />
          </button>
        )
      })}
    </nav>
  )
}