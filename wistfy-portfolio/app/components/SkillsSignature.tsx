'use client'

import { useEffect, useRef, useState, type MouseEvent } from 'react'
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from 'framer-motion'
import { getPassive } from '@/app/system/passive'

/* Fragment depth + hover response. active === index means the matching
   module in the content column is being hovered. */
const FRAG_BASE: Record<number, number> = { 0: 0.3, 1: 0.2, 2: 0.14 }
const FRAG_HOVER: Record<number, number> = { 0: 0.9, 1: 0.75, 2: 0.6 }

export default function SkillsSignature({ active = -1 }: { active?: number }) {
  const reduced = useReducedMotion() ?? false
  const wrapRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [z, setZ] = useState(0)

  // local cursor position relative to the signature (normalized -0.5..0.5)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const px = useSpring(mx, { stiffness: 50, damping: 16 })
  const py = useSpring(my, { stiffness: 50, damping: 16 })

  // response strength (0 idle → 1 active) + scroll activity, synced off React
  const resp = useMotionValue(0)
  const scrollK = useMotionValue(0)

  // parallax (idle-decayed) + upward scroll drift on the primary graphic
  const coreX = useTransform([px, resp], ([a, b]: number[]) => a * b)
  const coreY = useTransform([py, resp, scrollK], ([a, b, c]: number[]) => a * b + c * -5)

  // dynamic light — the cursor side of the core reads slightly brighter
  const layerAOp = useTransform([mx, resp], ([m, r]: number[]) => 0.4 * (1 + m * 0.18 * r))
  const layerCOp = useTransform([mx, resp], ([m, r]: number[]) => 0.14 * (1 - m * 0.22 * r))

  // magnetic fragments — nearest geometry is gently attracted to the cursor
  const fragAX = useTransform([mx, resp], ([m, r]: number[]) => m * 5 * r)
  const fragAY = useTransform([my, resp], ([m, r]: number[]) => m * 3 * r)
  const fragBX = useTransform([mx, resp], ([m, r]: number[]) => m * -4 * r)
  const fragBY = useTransform([my, resp], ([m, r]: number[]) => m * -2 * r)
  const fragCX = useTransform([mx, resp], ([m, r]: number[]) => m * 3 * r)
  const fragCY = useTransform([my, resp], ([m, r]: number[]) => m * -3 * r)

  // only run per-frame work while the signature is on screen
  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
      threshold: 0.15,
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (reduced || !visible) return
    let raf = 0
    const loop = () => {
      const p = getPassive()
      resp.set(1 - p.idle)
      scrollK.set(p.scrollActive)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    const id = setInterval(() => setZ((v) => (v + 1) % 10), 2200)

    return () => {
      cancelAnimationFrame(raf)
      clearInterval(id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced, visible])

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    if (reduced) return
    const r = e.currentTarget.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width - 0.5)
    my.set((e.clientY - r.top) / r.height - 0.5)
  }

  const fragOpacity = (i: number) => (active === i ? FRAG_HOVER[i] : FRAG_BASE[i])

  return (
    <div
      ref={wrapRef}
      className="sig-wrap"
      onMouseMove={onMove}
      onMouseLeave={() => {
        mx.set(0)
        my.set(0)
      }}
      aria-hidden="true"
    >
      <motion.div
        initial={reduced ? { opacity: 1 } : { opacity: 0 }}
        whileInView={reduced ? undefined : { opacity: 1 }}
        viewport={{ once: false, amount: 0.35 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <svg viewBox="0 0 360 420" className="sig-svg" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="sig-scan-grad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="rgba(62, 230, 255, 0)" />
              <stop offset="50%" stopColor="rgba(62, 230, 255, 0.55)" />
              <stop offset="100%" stopColor="rgba(62, 230, 255, 0)" />
            </linearGradient>
          </defs>

          {/* atmospheric converging plane (points toward the core) */}
          <g className="sig-atmo">
            <path d="M176 210 L20 402 M176 210 L340 402" />
            <path d="M40 368 H320 M64 348 H296 M88 332 H272 M112 318 H248" />
          </g>

          <motion.g style={{ x: coreX, y: coreY }}>
            {/* coordinate origin (bottom-left) */}
            <g className="sig-axis">
              <path d="M26 372 H98 M26 372 V300" />
              <path d="M26 358 H34 M26 344 H34 M26 330 H34 M26 316 H34" />
              <path d="M38 372 V364 M50 372 V364 M62 372 V364 M74 372 V364 M86 372 V364" />
            </g>

            {/* breathing wrapper → rendering core (slow rotation) */}
            <g className="sig-breathe">
              <g className="sig-core">
                {/* dynamic light layers — cursor side brightens subtly */}
                <motion.g style={{ opacity: layerCOp }}>
                  <path
                    className="sig-layer-c"
                    d="M118 272 L182 260 L226 302 L202 354 L134 362 L104 314 Z"
                  />
                </motion.g>
                <path
                  className="sig-layer-b"
                  d="M142 190 L198 180 L240 232 L218 290 L152 298 L124 246 Z"
                />
                <motion.g style={{ opacity: layerAOp }}>
                  <path
                    className="sig-layer-a"
                    d="M150 118 L212 106 L254 152 L232 218 L160 228 L130 176 Z"
                  />
                </motion.g>

                <g className="sig-rib">
                  <path d="M150 118 L142 190 M212 106 L198 180 M254 152 L240 232 M232 218 L218 290 M160 228 L152 298 M130 176 L124 246" />
                  <path d="M142 190 L118 272 M198 180 L182 260 M240 232 L226 302 M218 290 L202 354 M152 298 L134 362 M124 246 L104 314" />
                </g>

                {/* internal light source */}
                <circle className="sig-light-halo" cx="176" cy="210" r="11" />
                <circle className="sig-light-halo" cx="176" cy="210" r="20" opacity="0.25" />
                <circle className="sig-light-core" cx="176" cy="210" r="3.5" />
                <path className="sig-rib" d="M168 210 H184 M176 202 V218" />

                {/* occasional render scan */}
                <rect className="sig-scan" x="98" y="-24" width="168" height="12" rx="6" />
              </g>
            </g>

            {/* vertex-like points */}
            <g className="sig-vertex">
              <circle cx="212" cy="106" r="1.6" />
              <circle cx="160" cy="228" r="1.6" />
              <circle cx="198" cy="180" r="1.6" />
              <circle cx="152" cy="298" r="1.6" />
              <circle cx="182" cy="260" r="1.6" />
            </g>

            {/* connecting lines */}
            <g className="sig-connect">
              <path d="M250 82 L254 152" />
              <path d="M70 160 L142 190" />
              <path d="M300 320 L240 232" />
            </g>

            {/* secondary fragments — magnetically pulled, hover-brightened */}
            <motion.g style={{ x: fragAX, y: fragAY, opacity: fragOpacity(0) }}>
              <path className="sig-frag sig-frag-a" d="M248 56 L282 74 L266 106 L230 90 Z" />
            </motion.g>
            <motion.g style={{ x: fragBX, y: fragBY, opacity: fragOpacity(1) }}>
              <path className="sig-frag sig-frag-b" d="M52 132 L86 146 L74 174 L44 158 Z" />
            </motion.g>
            <motion.g style={{ x: fragCX, y: fragCY, opacity: fragOpacity(2) }}>
              <path className="sig-frag sig-frag-c" d="M296 296 L322 314 L308 342 L282 326 Z" />
            </motion.g>

            {/* technical markers */}
            <g className="sig-marker">
              <path d="M16 20 h-12 v12 M344 20 h12 v-12" />
              <path d="M60 40 h6 v-6 M330 88 h6 v-6" />
              <path d="M176 44 v12 M176 364 v12" />
            </g>

            {/* coordinate readout */}
            <text className="sig-label" x="200" y="32">
              SYS//03 · MODULES LOADED
            </text>
            <text className="sig-label" x="200" y="46">
              X:042 Y:118 Z:{String(z).padStart(3, '0')}
            </text>
            <rect className="sig-cursor" x="200" y="53" width="6" height="8" />
          </motion.g>
        </svg>
      </motion.div>
    </div>
  )
}
