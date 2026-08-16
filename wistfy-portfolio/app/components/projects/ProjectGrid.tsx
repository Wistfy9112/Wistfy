'use client'

import { useState } from 'react'
import { motion, AnimatePresence, MotionConfig } from 'framer-motion'
import { projects, getSectorForProject } from '@/app/data/projects'
import type { Project } from '@/app/data/projects'
import { useSystem } from '@/app/system/SystemProvider'
import { sfx } from '@/app/utils/sound'
import SectionShell from '@/app/components/system/SectionShell'

const FILTERS = [
  { id: 'all', label: 'ALL' },
  { id: 'graphics', label: 'GRAPHICS' },
  { id: 'software', label: 'SOFTWARE' },
  { id: 'web', label: 'WEB' },
  { id: 'experiments', label: 'EXPERIMENTS' },
]

const titleCase = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()

/* ------------------------------------------------------------------ */
/* Wireframe preview glyphs (deterministic, lightweight)              */
/* ------------------------------------------------------------------ */
const GLYPHS: Record<string, React.ReactNode> = {
  graphics: (
    <g transform="translate(158 53)">
      <path d="M0 0 L30 -16 L60 0 L30 16 Z" />
      <path d="M0 0 L0 32 L30 48 L30 16 Z" />
      <path d="M60 0 L60 32 L30 48" />
      <path d="M30 -16 L30 16" opacity="0.25" />
    </g>
  ),
  software: (
    <g transform="translate(178 63)">
      <rect x="0" y="0" width="44" height="44" rx="4" />
      <rect x="14" y="14" width="16" height="16" rx="2" />
      <path
        d="M2 10 h8 M2 20 h6 M2 34 h8 M34 10 h8 M38 20 h6 M34 34 h8 M10 2 v6 M22 2 v6 M10 42 v-6 M22 42 v-6 M34 2 v6 M34 42 v-6"
        opacity="0.45"
      />
    </g>
  ),
  web: (
    <g transform="translate(168 62)">
      <rect x="0" y="0" width="64" height="44" rx="4" />
      <path d="M0 12 h64" opacity="0.7" />
      <circle cx="7" cy="6" r="1.6" />
      <circle cx="14" cy="6" r="1.6" />
      <path d="M28 34 c4 -6 8 6 12 0" opacity="0.6" />
      <path d="M40 34 c4 -6 8 6 12 0" opacity="0.35" />
    </g>
  ),
  experiments: (
    <g transform="translate(190 52)">
      <path d="M0 8 h20" />
      <path d="M4 8 V18 L-8 38 c-2 4 0 10 6 10 h28 c6 0 8 -6 6 -10 L16 18 V8" />
      <path d="M-6 32 h32" opacity="0.5" />
      <path d="M8 22 h4 M16 28 h4" opacity="0.4" />
    </g>
  ),
}

function PreviewScene({
  color,
  kind,
  number,
  status,
}: {
  color: string
  kind: string
  number: string
  status: string
}) {
  return (
    <div className="card-preview">
      <svg viewBox="0 0 320 150" className="block h-auto w-full" aria-hidden="true">
        <defs>
          <pattern id={`pgrid-${number}`} width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(108,193,230,0.06)" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="320" height="150" fill={`url(#pgrid-${number})`} />
        <rect width="320" height="150" fill="rgba(5,7,10,0.5)" />

        {/* wireframe glyph */}
        <g stroke={color} fill="none" strokeWidth="1" opacity="0.55">
          {GLYPHS[kind] ?? GLYPHS.graphics}
        </g>
        {/* echo for depth */}
        <g stroke={color} fill="none" strokeWidth="1" opacity="0.12" transform="translate(0 3)">
          {GLYPHS[kind] ?? GLYPHS.graphics}
        </g>

        {/* corner ticks */}
        <path
          d="M8 0 h-8 v8 M320 8 v-8 h-8 M312 150 h8 v-8 M0 142 v8 h8"
          stroke={color}
          strokeOpacity="0.5"
          fill="none"
        />
        <path d="M306 126 h8 M312 120 v8" stroke={color} strokeOpacity="0.35" fill="none" />

        {/* metadata */}
        <text
          x="14"
          y="22"
          fontFamily="'JetBrains Mono', monospace"
          fontSize="9"
          letterSpacing="0.2em"
          fill={color}
          opacity="0.9"
        >
          {number}
        </text>
        <text
          x="306"
          y="22"
          textAnchor="end"
          fontFamily="'JetBrains Mono', monospace"
          fontSize="8"
          letterSpacing="0.18em"
          fill={status === 'COMPLETED' ? '#3ee6ff' : status === 'IN PROGRESS' ? '#8b9bff' : '#4d5c70'}
          opacity="0.85"
        >
          {status}
        </text>
      </svg>
      <span className="card-scan" aria-hidden="true" />
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Project card                                                       */
/* ------------------------------------------------------------------ */
function ProjectCard({
  project,
  color,
  number,
  onOpen,
}: {
  project: Project
  color: string
  number: string
  onOpen: (p: Project) => void
}) {
  const { soundOn } = useSystem()

  const activate = () => {
    if (soundOn) sfx.select()
    onOpen(project)
  }

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      className="project-card group"
      role="button"
      tabIndex={0}
      aria-label={`View project ${project.title}`}
      onClick={activate}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          activate()
        }
      }}
    >
      <PreviewScene
        color={color}
        kind={project.category.toLowerCase()}
        number={number}
        status={project.status}
      />

      <div className="flex flex-1 flex-col p-5 md:p-6">
        <div className="mono mb-2 flex items-center justify-between gap-3 text-[9px] tracking-[0.25em]">
          <span style={{ color }}>{number}</span>
          <span className="text-ink-4">{project.year}</span>
        </div>

        <h3 className="display text-lg font-semibold tracking-tight text-ink md:text-xl">
          {project.title}
        </h3>

        <div className="mono mt-2 text-[9px] tracking-[0.18em] text-ink-3">
          {titleCase(project.category)} / {project.technologies.slice(0, 3).join(' / ')}
        </div>

        <p className="mt-3 line-clamp-2 text-[15px] leading-relaxed text-ink-2">{project.description}</p>

        <div className="mt-4 flex items-center justify-between gap-3 border-t border-line pt-3">
          <span className="card-action">VIEW PROJECT →</span>
          <span className="mono text-[8px] tracking-[0.2em] text-ink-4">{project.status}</span>
        </div>
      </div>
    </motion.article>
  )
}

/* ------------------------------------------------------------------ */
/* Showcase                                                           */
/* ------------------------------------------------------------------ */
function ProjectGrid() {
  const { openProject, pushLog, soundOn } = useSystem()
  const [filter, setFilter] = useState('all')

  const visible = filter === 'all' ? projects : projects.filter((p) => p.category.toLowerCase() === filter)

  const setFilterTo = (id: string, label: string) => {
    if (id === filter) return
    if (soundOn) sfx.click()
    pushLog(`FILTER: ${label}`)
    setFilter(id)
  }

  const open = (p: Project) => {
    pushLog(`Opening ${p.id}`)
    openProject(p)
  }

  return (
    <SectionShell id="module-projects" title="PROJECTS" code="MODULE_01">
      <div className="mb-10 md:mb-12">
        <div className="mono text-[10px] tracking-[0.3em] text-cyan">SELECTED WORK</div>
        <p className="mt-3 max-w-xl text-base leading-relaxed text-ink-2">
          A collection of graphics, software, and interactive projects.
        </p>
      </div>

      {/* filter bar */}
      <div className="mb-8 flex flex-wrap items-center gap-2" role="group" aria-label="Filter projects by category">
        {FILTERS.map((f) => {
          const active = filter === f.id
          return (
            <button
              key={f.id}
              className={`filter-btn ${active ? 'active' : ''}`}
              style={active ? { color: '#3ee6ff', borderColor: '#3ee6ff' } : undefined}
              onClick={() => setFilterTo(f.id, f.label)}
              aria-pressed={active}
            >
              {f.label}
            </button>
          )
        })}
        <span className="mono ml-auto hidden text-[9px] tracking-[0.2em] text-ink-4 sm:block">
          SHOWING {String(visible.length).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
        </span>
      </div>

      {/* project grid */}
      <MotionConfig reducedMotion="user">
        <motion.div layout className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.map((p) => (
              <ProjectCard
                key={p.id}
                project={p}
                color={getSectorForProject(p.id)?.color || '#3ee6ff'}
                number={`PROJECT_${String(projects.findIndex((x) => x.id === p.id) + 1).padStart(2, '0')}`}
                onOpen={open}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      </MotionConfig>

      <div className="mt-10 text-center">
        <span className="mono text-[9px] tracking-[0.25em] text-ink-4">
          SELECT A PROJECT TO OPEN ITS DETAIL INTERFACE
        </span>
      </div>
    </SectionShell>
  )
}

export default ProjectGrid
