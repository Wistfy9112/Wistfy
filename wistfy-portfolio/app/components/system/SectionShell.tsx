'use client'

import { motion } from 'framer-motion'

export default function SectionShell({
  id,
  title,
  code,
  children,
  className = '',
}: {
  id: string
  title: string
  code: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <section
      id={id}
      className={`relative mx-auto w-full max-w-6xl px-5 py-24 md:px-8 md:py-32 ${className}`}
      aria-labelledby={`${id}-title`}
    >
      <div className="mb-10 flex items-center gap-4 md:mb-14">
        <span className="corner-tick tl" />
        <span className="mono text-[11px] tracking-[0.3em] text-cyan">{code}</span>
        <span className="h-px flex-1 bg-line" />
        <span className="mono text-[11px] tracking-[0.3em] text-ink-4">WISTFY // {code}</span>
        <span className="corner-tick tr" />
      </div>

      <motion.h2
        id={`${id}-title`}
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="display mb-2 text-3xl font-semibold tracking-tight text-ink md:text-5xl"
      >
        {title}
      </motion.h2>

      <div className="mb-10 h-0.5 w-16 bg-cyan/70 md:mb-14" />

      <div className="fade-up">{children}</div>
    </section>
  )
}
