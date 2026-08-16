'use client'

import { motion } from 'framer-motion'
import { achievements, type AchievementRecord } from '@/app/data/achievements'
import { useSystem } from '@/app/system/SystemProvider'

const EASE = [0.16, 1, 0.3, 1] as const
const clean = (s: string) => s.replace(/\[|\]/g, '').trim()

/* ------------------------------------------------------------------ */
/* Milestone — one moment on the rail.                                */
/* ------------------------------------------------------------------ */
function Milestone({
  a,
  index,
  primary,
  reduced,
}: {
  a: AchievementRecord
  index: number
  primary?: boolean
  reduced: boolean
}) {
  const enter = {
    initial: reduced ? false : { opacity: 0, y: 16 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-60px' },
    transition: { duration: 0.55, delay: 0.08 + index * 0.1, ease: EASE },
  }
  return (
    <motion.article
      {...enter}
      className={`arc-milestone relative pb-10 last:pb-0 lg:pb-12 ${primary ? 'arc-milestone-primary' : ''}`}
    >
      <motion.span
        aria-hidden="true"
        className={`arc-node ${primary ? 'arc-node-primary' : ''}`}
        initial={reduced ? false : { scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.4, delay: enter.transition.delay + 0.1, ease: EASE }}
      />
      <div className="arc-meta mono">
        {a.year} — {a.category}
      </div>
      <h3 className="arc-milestone-title">{clean(a.title)}</h3>
      <p className="arc-milestone-desc">{a.description}</p>
      {a.result && <div className="arc-milestone-result mono">{clean(a.result)}</div>}
    </motion.article>
  )
}

/* ------------------------------------------------------------------ */
/* Section                                                             */
/* ------------------------------------------------------------------ */
export default function Achievements() {
  const { reducedMotion } = useSystem()
  const reduced = reducedMotion
  const items = [...achievements].sort((x, y) => y.year.localeCompare(x.year))

  return (
    <section
      id="module-achievements"
      className="arc-section relative overflow-hidden px-5 py-16 md:px-8 lg:py-20"
      aria-labelledby="achievements-title"
    >
      <div className="arc-vignette pointer-events-none absolute inset-0" />

      <div className="relative mx-auto w-full max-w-[1240px]">
        {/* compact editorial header */}
        <motion.header
          initial={reduced ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5, ease: EASE }}
          className="max-w-2xl"
        >
          <div className="flex items-center gap-3">
            <span className="h-px w-8" style={{ background: 'rgba(148, 168, 184, 0.45)' }} />
            <span className="mono text-[10px] tracking-[0.32em] text-ink-3">TROPHY ARCHIVE</span>
          </div>
          <h2
            id="achievements-title"
            className="arc-title display mt-4 font-semibold tracking-tight text-mist"
          >
            Achievements
          </h2>
          <p className="arc-sub">Selected trophies — the milestones that prove the work.</p>
        </motion.header>

        {/* vertical timeline */}
        <div className="arc-timeline relative mt-12 max-w-2xl lg:mt-16">
          {items.map((a, i) => (
            <Milestone key={a.id} a={a} index={i} primary={a.primary} reduced={reduced} />
          ))}
        </div>
      </div>
    </section>
  )
}
