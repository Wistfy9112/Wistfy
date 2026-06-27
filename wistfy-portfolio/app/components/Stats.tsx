'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { Code2, TestTube, GitBranch, Cpu } from 'lucide-react'

const stats = [
  { icon: Code2, to: 80, suffix: 'K+', label: 'Lines of C++' },
  { icon: TestTube, to: 15, suffix: '+', label: 'Graphics Projects' },
  { icon: GitBranch, to: 500, suffix: '+', label: 'Git Commits' },
  { icon: Cpu, to: 5, suffix: '+', label: 'Years Coding' },
]

function AnimatedCounter({ to, suffix, label, icon: Icon }: { to: number; suffix: string; label: string; icon: React.ComponentType<{ size?: number; className?: string }> }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const started = useRef(false)

  useEffect(() => {
    if (!isInView || started.current) return
    started.current = true

    const duration = 2000
    const steps = 60
    const increment = to / steps
    let current = 0
    const interval = setInterval(() => {
      current += increment
      if (current >= to) {
        setCount(to)
        clearInterval(interval)
      } else {
        setCount(Math.floor(current))
      }
    }, duration / steps)

    return () => clearInterval(interval)
  }, [isInView, to])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="group relative rounded-2xl border border-dark-3 bg-dark-2/50 p-8 text-center transition-all hover:border-primary/30 hover:glow-lg"
    >
      <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 transition-all duration-300 group-hover:from-primary/20 group-hover:to-secondary/20">
        <Icon size={28} className="text-primary" />
      </div>
      <div className="mb-1 text-4xl font-bold">
        <span className="text-gradient">{count}</span>
        <span className="text-gradient">{suffix}</span>
      </div>
      <p className="text-sm text-gray-text">{label}</p>
    </motion.div>
  )
}

export default function Stats() {
  return (
    <section id="stats" className="section-padding mx-auto max-w-6xl">
      <div className="grid gap-6 md:grid-cols-4">
        {stats.map((stat) => (
          <AnimatedCounter key={stat.label} {...stat} />
        ))}
      </div>
    </section>
  )
}
