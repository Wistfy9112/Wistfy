'use client'

import { useEffect, useRef, useState, type MouseEvent } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { education } from '@/app/data/education'
import { useSystem } from '@/app/system/SystemProvider'
import { getPassive } from '@/app/system/passive'

const EASE = [0.16, 1, 0.3, 1] as const

const PLATES = [
  { y: 410, x1: 140, x2: 260 },
  { y: 360, x1: 152, x2: 248 },
  { y: 310, x1: 164, x2: 236 },
  { y: 260, x1: 176, x2: 224 },
  { y: 210, x1: 186, x2: 214 },
  { y: 160, x1: 194, x2: 206 },
]

/* ONE architectural structure: a foundation slab in perspective,
   a central core, floor plates and diagonals converging to an apex. */
function FoundationGraphic({ reduced }: { reduced: boolean }) {
  return (
    <svg
      viewBox="0 0 400 520"
      className="edu-fnd"
      role="img"
      aria-label="Abstract architectural structure rising from a foundation slab to an apex"
    >
      {/* foundation slab — perspective */}
      <motion.path
        d="M 40 470 H 360"
        className="edu-fnd-base"
        initial={reduced ? false : { pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6, delay: 0.35, ease: 'easeInOut' }}
      />
      <motion.g
        initial={reduced ? false : { opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.5, delay: 0.6, ease: EASE }}
      >
        <path d="M 40 470 L 150 340 M 360 470 L 250 340 M 150 340 H 250" className="edu-fnd-edge" />
        <path d="M 78 425 H 322" className="edu-fnd-grid" />
        <path d="M 120 470 L 178 340 M 280 470 L 222 340" className="edu-fnd-grid" />
      </motion.g>

      <g className="edu-fnd-tick" aria-hidden="true">
        <path d="M 100 474 V 480 M 160 474 V 480 M 220 474 V 480 M 280 474 V 480" />
      </g>

      {/* central core — rises from the foundation */}
      <motion.path
        d="M 200 470 V 110"
        className="edu-fnd-core"
        initial={reduced ? false : { pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.7, delay: 0.75, ease: EASE }}
      />

      {/* floor plates — layers narrowing in perspective */}
      {PLATES.map((p, i) => (
        <motion.path
          key={p.y}
          d={`M ${p.x1} ${p.y} H ${p.x2}`}
          className="edu-fnd-plate"
          initial={reduced ? false : { pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.35, delay: 0.85 + i * 0.07, ease: 'easeInOut' }}
        />
      ))}

      {/* diagonal framework — converging toward the apex */}
      <motion.path
        d="M 40 470 L 200 110 M 360 470 L 200 110"
        className="edu-fnd-brace"
        initial={reduced ? false : { pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.8, delay: 1.0, ease: 'easeInOut' }}
      />

      {/* apex — the single point everything builds toward */}
      <motion.g
        initial={reduced ? false : { opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.5, delay: 1.18, ease: EASE }}
      >
        <circle cx="200" cy="110" r="9" className="edu-fnd-halo" />
        <rect x="198" y="108" width="4" height="4" className="edu-fnd-apex" />
      </motion.g>

      <motion.text
        x="40"
        y="62"
        className="edu-fnd-note mono"
        initial={reduced ? false : { opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.5, delay: 1.05 }}
      >
        FOUNDATION
      </motion.text>
    </svg>
  )
}

export default function Education() {
  const { reducedMotion } = useSystem()
  const sectionRef = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)

  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const px = useSpring(mx, { stiffness: 50, damping: 16 })
  const py = useSpring(my, { stiffness: 50, damping: 16 })
  const resp = useMotionValue(0)

  /* quiet response — the graphic drifts 1–3px, text stays still */
  const gx = useTransform([px, resp], ([a, b]: number[]) => a * 3 * b)
  const gy = useTransform([py, resp], ([a, b]: number[]) => a * 2 * b)
  const glow = useTransform([resp], ([b]: number[]) => 0.88 + b * 0.12)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
      threshold: 0.1,
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (reducedMotion || !visible) return
    let raf = 0
    const loop = () => {
      resp.set(1 - getPassive().idle)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion, visible])

  const onMove = (e: MouseEvent<HTMLElement>) => {
    if (reducedMotion) return
    const r = e.currentTarget.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width - 0.5)
    my.set((e.clientY - r.top) / r.height - 0.5)
  }

  const reduced = reducedMotion

  return (
    <section
      ref={sectionRef}
      id="module-education"
      className="edu-section relative overflow-hidden px-5 py-28 md:px-8 md:py-40"
      aria-labelledby="education-title"
      onMouseMove={onMove}
      onMouseLeave={() => {
        mx.set(0)
        my.set(0)
      }}
    >
      <div className="edu-vignette pointer-events-none absolute inset-0" />

      <div className="relative mx-auto w-full max-w-6xl">
        {/* small editorial label */}
        <motion.div
          initial={reduced ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.4, ease: EASE }}
          className="flex items-center gap-3"
        >
          <span className="h-px w-8" style={{ background: 'rgba(148, 168, 184, 0.45)' }} />
          <h2 id="education-title" className="edu-label mono">
            EDUCATION
          </h2>
        </motion.div>

        {/* the years — the visual signature */}
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
          className="edu-years"
        >
          {education.period}
        </motion.div>

        <div className="mt-14 lg:mt-16 lg:grid lg:grid-cols-[1.15fr_1fr] lg:items-start lg:gap-20">
          {/* left — supporting information */}
          <div>
            <motion.div
              initial={reduced ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5, delay: 0.3, ease: EASE }}
              className="edu-cs"
            >
              {education.degree}
            </motion.div>

            {/* thin foundation line — separates identity from support */}
            <motion.div
              initial={reduced ? false : { scaleX: 0, opacity: 0 }}
              whileInView={{ scaleX: 1, opacity: 1 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.7, delay: 0.45, ease: EASE }}
              style={{ transformOrigin: 'left' }}
              className="edu-divider"
            />

            <motion.div
              initial={reduced ? false : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.4, delay: 0.58, ease: EASE }}
              className="edu-institution"
            >
              {education.institution}
            </motion.div>

            <motion.p
              initial={reduced ? false : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5, delay: 0.65, ease: EASE }}
              className="edu-desc"
            >
              {education.description}
            </motion.p>

            <motion.div
              initial={reduced ? false : { opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5, delay: 0.75, ease: EASE }}
              className="mt-14"
            >
              <div className="edu-focus-label mono">FOCUS</div>
              <ul className="edu-focus-list">
                {education.focus.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>

              {education.gpa && (
                <div className="mt-8">
                  <div className="edu-focus-label mono">GPA</div>
                  <p className="edu-desc">{education.gpa}</p>
                </div>
              )}

              {education.honors && education.honors.length > 0 && (
                <div className="mt-8">
                  <div className="edu-focus-label mono">HONORS</div>
                  <ul className="edu-focus-list">
                    {education.honors.map((h) => (
                      <li key={h}>{h}</li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          </div>

          {/* right — the foundation structure */}
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.9, delay: 0.4, ease: EASE }}
            className="mt-20 w-full max-w-[300px] sm:max-w-[340px] lg:mt-2 lg:max-w-[400px] lg:justify-self-end"
          >
            <motion.div style={reduced ? undefined : { x: gx, y: gy, opacity: glow }}>
              <FoundationGraphic reduced={reduced} />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
