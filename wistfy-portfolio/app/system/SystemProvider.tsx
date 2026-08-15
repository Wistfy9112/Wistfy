'use client'

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import type { Project } from '@/app/data/projects'

export type ModuleId = 'projects' | 'about' | 'skills' | 'contact'

export interface LogEntry {
  id: number
  time: string
  message: string
}

interface SystemState {
  booted: boolean
  enterSystem: () => void
  bootSkipped: boolean
  skipBoot: () => void
  soundOn: boolean
  toggleSound: () => void
  log: LogEntry[]
  pushLog: (message: string) => void
  activeModule: ModuleId
  setActiveModule: (m: ModuleId) => void
  activeProject: Project | null
  openProject: (p: Project) => void
  closeProject: () => void
  debugMode: boolean
  enableDebug: () => void
  reducedMotion: boolean
  isTouch: boolean
}

const SystemContext = createContext<SystemState | null>(null)

function now() {
  return new Date().toLocaleTimeString('en-GB', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function prefersTouch(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(hover: none), (pointer: coarse)').matches
}

export function SystemProvider({ children }: { children: React.ReactNode }) {
  const [booted, setBooted] = useState(false)
  const [bootSkipped, setBootSkipped] = useState(false)
  const [soundOn, setSoundOn] = useState(false)
  const [log, setLog] = useState<LogEntry[]>([])
  const [activeModule, setActiveModule] = useState<ModuleId>('projects')
  const [activeProject, setActiveProject] = useState<Project | null>(null)
  const [debugMode, setDebugMode] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(prefersReducedMotion)
  const [isTouch, setIsTouch] = useState(prefersTouch)
  const idRef = useRef(0)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onMq = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mq.addEventListener('change', onMq)
    return () => mq.removeEventListener('change', onMq)
  }, [])

  useEffect(() => {
    const touch = window.matchMedia('(hover: none), (pointer: coarse)')
    const onTouch = (e: MediaQueryListEvent) => setIsTouch(e.matches)
    touch.addEventListener('change', onTouch)
    return () => touch.removeEventListener('change', onTouch)
  }, [])

  function pushLog(message: string) {
    setLog((prev) => {
      const next = [...prev, { id: ++idRef.current, time: now(), message }]
      return next.length > 40 ? next.slice(next.length - 40) : next
    })
  }

  useEffect(() => {
    if (!booted) return
    pushLog('User connected')
    pushLog('Virtual environment initialized')
    pushLog('Project database loaded')
    pushLog('Graphics subsystem ready')
  }, [booted])

  function enterSystem() {
    setBooted(true)
  }

  function skipBoot() {
    setBootSkipped(true)
    setBooted(true)
  }

  function toggleSound() {
    setSoundOn((s) => !s)
  }

  function openProject(p: Project) {
    setActiveProject(p)
  }

  function closeProject() {
    setActiveProject(null)
  }

  function enableDebug() {
    setDebugMode(true)
  }

  const value: SystemState = {
    booted,
    enterSystem,
    bootSkipped,
    skipBoot,
    soundOn,
    toggleSound,
    log,
    pushLog,
    activeModule,
    setActiveModule,
    activeProject,
    openProject,
    closeProject,
    debugMode,
    enableDebug,
    reducedMotion,
    isTouch,
  }

  return <SystemContext.Provider value={value}>{children}</SystemContext.Provider>
}

export function useSystem() {
  const ctx = useContext(SystemContext)
  if (!ctx) throw new Error('useSystem must be used within SystemProvider')
  return ctx
}