'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

const skillCategories = [
  {
    title: 'Languages',
    skills: [
      { name: 'C++', level: 95 },
      { name: 'C', level: 88 },
      { name: 'GLSL', level: 85 },
      { name: 'Python', level: 80 },
      { name: 'Rust', level: 70 },
    ],
  },
  {
    title: 'Graphics & APIs',
    skills: [
      { name: 'OpenGL', level: 92 },
      { name: 'Vulkan', level: 78 },
      { name: 'DirectX 11', level: 75 },
      { name: 'WebGL', level: 82 },
      { name: 'CUDA', level: 65 },
    ],
  },
  {
    title: 'Tools & Engines',
    skills: [
      { name: 'Unreal Engine', level: 80 },
      { name: 'Unity', level: 75 },
      { name: 'CMake', level: 88 },
      { name: 'Git', level: 92 },
      { name: 'RenderDoc', level: 82 },
    ],
  },
]

function SkillBar({ name, level, index }: { name: string; level: number; index: number }) {
  const [width, setWidth] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  useEffect(() => {
    if (!isInView) return
    const timeout = setTimeout(() => setWidth(level), 300 + index * 80)
    return () => clearTimeout(timeout)
  }, [isInView, level, index])

  return (
    <div ref={ref} className="group">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium text-gray-text transition-colors group-hover:text-light">
          {name}
        </span>
        <span className="text-xs font-medium text-primary">{level}%</span>
      </div>
      <div className="relative h-2 overflow-hidden rounded-full bg-dark-3">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${width}%` }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-primary to-secondary"
          style={{ boxShadow: '0 0 10px rgba(99,102,241,0.4)' }}
        />
      </div>
    </div>
  )
}

export default function Skills() {
  return (
    <section id="skills" className="section-padding relative mx-auto max-w-6xl">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-4 inline-block rounded-full border border-primary/20 bg-primary/5 px-5 py-2 text-sm font-medium text-primary"
        >
          Skills
        </motion.div>

        <h3 className="mb-12 text-4xl font-bold md:text-5xl">
          My <span className="text-gradient">Tech Stack</span>
        </h3>

        <div className="grid gap-12 md:grid-cols-3">
          {skillCategories.map((category, catIndex) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: catIndex * 0.1, duration: 0.5 }}
              className="rounded-2xl border border-dark-3 bg-dark-2/50 p-6 transition-all hover:border-primary/20"
            >
              <h4 className="mb-6 text-lg font-semibold">{category.title}</h4>
              <div className="space-y-5">
                {category.skills.map((skill, i) => (
                  <SkillBar key={skill.name} {...skill} index={i} />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
