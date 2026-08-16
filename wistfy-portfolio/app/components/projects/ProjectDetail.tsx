'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getSectorForProject } from '@/app/data/projects'
import type { Project } from '@/app/data/projects'
import { useSystem } from '@/app/system/SystemProvider'
import { sfx } from '@/app/utils/sound'
import ProjectDemo from '@/app/components/projects/ProjectDemo'

function InfoRow({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="flex justify-between gap-6 border-b border-line/60 py-2">
      <span className="text-ink-4">{label}</span>
      <span style={{ color: color || 'var(--color-ink-2)' }}>{value}</span>
    </div>
  )
}

function TerminalBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <div className="mono mb-2 flex items-center gap-2 text-[10px] tracking-[0.3em] text-cyan">
        <span>▸</span> {title}
      </div>
      <div className="space-y-1 text-[15px] leading-relaxed text-ink-2">{children}</div>
    </div>
  )
}

export default function ProjectDetail() {
  const { activeProject, closeProject, pushLog, soundOn, debugMode } = useSystem()
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activeProject) {
        if (soundOn) sfx.close()
        closeProject()
        pushLog(`PROJECT closed: ${activeProject.id}`)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [activeProject, closeProject, pushLog, soundOn])

  useEffect(() => {
    dialogRef.current?.focus()
  }, [activeProject])

  const sector = activeProject ? getSectorForProject(activeProject.id) : null

  return (
    <AnimatePresence>
      {activeProject && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[80] flex items-start justify-center overflow-y-auto bg-abyss-0/80 px-4 py-10 backdrop-blur-sm md:items-center md:py-16"
          onClick={() => {
            if (soundOn) sfx.close()
            closeProject()
          }}
          role="dialog"
          aria-modal="true"
          aria-label={`Project: ${activeProject.title}`}
        >
          <motion.div
            ref={dialogRef}
            tabIndex={-1}
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="hud-frame hud-corners relative w-full max-w-3xl outline-none"
            style={{ background: 'rgba(5,7,10,0.96)' }}
          >
            <span className="corner-tick tl" />
            <span className="corner-tick tr" />
            <span className="corner-tick bl" />
            <span className="corner-tick br" />

            {/* header */}
            <div className="flex items-center justify-between border-b border-line px-5 py-3 md:px-7">
              <div className="mono text-[10px] tracking-[0.25em] text-ink-3">
                WISTFY SYSTEM / PROJECT DATABASE / {activeProject.id.toUpperCase()}
              </div>
              <button
                onClick={() => {
                  if (soundOn) sfx.close()
                  closeProject()
                  pushLog(`PROJECT closed: ${activeProject.id}`)
                }}
                className="mono border border-line px-3 py-1 text-[10px] tracking-[0.2em] text-ink-3 transition-colors hover:border-cyan hover:text-cyan"
                aria-label="Close project"
              >
                ESC ▸ CLOSE
              </button>
            </div>

            <ProjectBody
              key={activeProject.id}
              project={activeProject}
              sectorColor={sector?.color || '#3ee6ff'}
              sectorCode={sector ? `${sector.code} // ${sector.name}` : 'UNKNOWN SECTOR'}
              soundOn={soundOn}
              pushLog={pushLog}
              debugMode={debugMode}
              onClose={() => closeProject()}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function ProjectBody({
  project,
  sectorColor,
  sectorCode,
  soundOn,
  pushLog,
  debugMode,
  onClose,
}: {
  project: Project
  sectorColor: string
  sectorCode: string
  soundOn: boolean
  pushLog: (m: string) => void
  debugMode: boolean
  onClose: () => void
}) {
  const [tab, setTab] = useState<'overview' | 'architecture' | 'log'>('overview')
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(id)
          return 100
        }
        return p + Math.random() * 14
      })
    }, 90)
    return () => clearInterval(id)
  }, [])

  return (
    <div>
      {/* loading bar */}
      <div className="h-0.5 w-full bg-abyss-4">
        <div
          className="h-full bg-cyan transition-[width] duration-150"
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>

      <div className="max-h-[70vh] overflow-y-auto p-5 md:p-7">
        {/* title */}
        <h3 className="display mb-1 text-2xl font-semibold tracking-tight text-ink md:text-3xl">
          {project.title}
        </h3>
        <div className="mono mb-6 text-[10px] tracking-[0.2em]" style={{ color: sectorColor }}>
          {sectorCode}
          {debugMode && <span className="ml-3 text-cyan">ID: {project.id}</span>}
        </div>

        {/* metadata */}
        <div className="mb-7 grid grid-cols-2 gap-x-6 md:grid-cols-3">
          <InfoRow label="STATUS" value={project.status} color={project.status === 'COMPLETED' ? '#3ee6ff' : '#8b9bff'} />
          <InfoRow label="CATEGORY" value={project.category} />
          <InfoRow label="YEAR" value={project.year} />
          <InfoRow label="LANGUAGE" value={project.language} />
          <InfoRow label="API" value={project.api} />
          {project.shaders && <InfoRow label="SHADERS" value={project.shaders} />}
        </div>

        {/* demo (webgl projects) */}
        {project.demoType === 'webgl' && <ProjectDemo project={project} />}

        {/* tabs */}
        <div className="mb-6 flex gap-1 border-b border-line" role="tablist" aria-label="Project information">
          {(
            [
              ['overview', 'OVERVIEW'],
              ['architecture', 'ARCHITECTURE'],
              ['log', 'SYSTEM LOG'],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              role="tab"
              id={`tab-${id}`}
              aria-controls={`panel-${id}`}
              aria-selected={tab === id}
              tabIndex={tab === id ? 0 : -1}
              onClick={() => {
                setTab(id)
                if (soundOn) sfx.click()
                pushLog(`Viewing ${label.toLowerCase()} data for ${project.id}`)
              }}
              className={`mono border-b-2 px-4 py-2 text-[10px] tracking-[0.2em] transition-colors ${
                tab === id
                  ? 'border-cyan text-cyan'
                  : 'border-transparent text-ink-4 hover:text-ink-2'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* tab content */}
        <div
          className="min-h-[120px]"
          role="tabpanel"
          id={`panel-${tab}`}
          aria-labelledby={`tab-${tab}`}
        >
          {tab === 'overview' && (
            <>
              <TerminalBlock title="DESCRIPTION">
                <p>{project.description}</p>
              </TerminalBlock>
              <TerminalBlock title="TECHNOLOGIES">
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((t) => (
                    <span key={t} className="mono border border-line px-2 py-1 text-[10px] tracking-[0.15em] text-ink-2">
                      {t}
                    </span>
                  ))}
                </div>
              </TerminalBlock>
            </>
          )}

          {tab === 'architecture' && (
            <>
              <TerminalBlock title="ARCHITECTURE">
                <ul className="space-y-1">
                  {project.architecture.map((a, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-cyan">-</span> {a}
                    </li>
                  ))}
                </ul>
              </TerminalBlock>
              <TerminalBlock title="CHALLENGES">
                <ul className="space-y-1">
                  {project.challenges.map((c, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-ink-4">!</span> {c}
                    </li>
                  ))}
                </ul>
              </TerminalBlock>
              <TerminalBlock title="SOLUTIONS">
                <ul className="space-y-1">
                  {project.solutions.map((s, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-cyan">✓</span> {s}
                    </li>
                  ))}
                </ul>
              </TerminalBlock>
            </>
          )}

          {tab === 'log' && (
            <div className="mono space-y-1 text-[11px] leading-relaxed">
              <div className="text-ink-4">[{project.year}] PROJECT REGISTERED</div>
              <div className="text-ink-4">[status] {project.status}</div>
              <div className="text-ink-4">[api] {project.api}</div>
              <div className="text-ink-4">[sector] {sectorCode}</div>
              <div className="text-cyan">[event] USER_QUERY: PROJECT_{project.id.toUpperCase()}</div>
              <div className="text-ink-4">[render] geometry loaded · shader compiled</div>
              <div className="text-ink-4">[render] frame buffers allocated</div>
              {debugMode && <div className="text-cyan">[debug] memory map dumped to /tmp</div>}
            </div>
          )}
        </div>

        {/* actions */}
        <div className="mt-7 flex flex-wrap gap-3 border-t border-line pt-5">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noreferrer"
              onClick={() => pushLog(`Opening source for ${project.id}`)}
              className="btn-hud"
            >
              SOURCE
            </a>
          )}
          {project.demo && (
            <a
              href={project.demo}
              target="_blank"
              rel="noreferrer"
              onClick={() => pushLog(`Opening demo for ${project.id}`)}
              className="btn-hud btn-ghost"
            >
              LIVE DEMO
            </a>
          )}
          <button
            onClick={() => {
              if (soundOn) sfx.close()
              onClose()
              pushLog(`Returning to main system`)
            }}
            className="btn-hud btn-ghost ml-auto"
          >
            RETURN TO SYSTEM
          </button>
        </div>
      </div>
    </div>
  )
}