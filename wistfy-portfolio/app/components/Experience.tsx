'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Briefcase, Building2, Calendar } from 'lucide-react'

const experiences = [
  {
    role: 'Senior Graphics Engineer',
    company: 'GameStudio Pro',
    period: '2024 - Present',
    desc: 'Lead rendering team developing a proprietary Vulkan-based engine. Architected the PBR pipeline and optimized draw-call batching for AAA-quality visuals.',
    highlights: ['Vulkan pipeline architecture', 'PBR rendering system', 'Team lead of 4 engineers'],
  },
  {
    role: 'Software Engineer, Graphics',
    company: 'RenderTech',
    period: '2022 - 2024',
    desc: 'Developed cross-platform rendering middleware used by 20+ game studios. Implemented GLSL shader compiler optimizations and GPU profiling tools.',
    highlights: ['Shader compiler optimization', 'GPU profiling tools', '20+ client studios'],
  },
  {
    role: 'Graphics Programmer',
    company: 'IndieDev',
    period: '2021 - 2022',
    desc: 'Built a lightweight OpenGL game engine with ECS architecture, real-time shadow mapping, and post-processing effects pipeline.',
    highlights: ['ECS engine architecture', 'Shadow mapping', 'Post-processing'],
  },
  {
    role: 'Junior C++ Developer',
    company: 'CodeLab',
    period: '2020 - 2021',
    desc: 'Contributed to simulation software using OpenGL for scientific visualization. Optimized mesh processing algorithms reducing load times by 60%.',
    highlights: ['Scientific visualization', '60% faster mesh loading', 'OpenGL 4.6'],
  },
]

export default function Experience() {
  return (
    <section id="experience" className="section-padding relative mx-auto max-w-6xl">
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
          Experience
        </motion.div>

        <h3 className="mb-12 text-4xl font-bold md:text-5xl">
          Graphics <span className="text-gradient">Career Path</span>
        </h3>

        <div className="relative">
          <motion.div
            initial={{ height: 0 }}
            whileInView={{ height: '100%' }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="absolute left-[23px] top-0 w-px bg-gradient-to-b from-primary via-secondary to-transparent"
          />

          <div className="space-y-10">
            {experiences.map((exp, index) => (
              <ExperienceItem key={exp.role} {...exp} index={index} />
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  )
}

function ExperienceItem({
  role,
  company,
  period,
  desc,
  highlights,
  index,
}: {
  role: string
  company: string
  period: string
  desc: string
  highlights: string[]
  index: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -30 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="relative pl-16"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={isInView ? { scale: 1 } : {}}
        transition={{ delay: index * 0.1 + 0.2, duration: 0.3, type: 'spring' }}
        className="absolute left-0 top-1 flex size-[46px] items-center justify-center rounded-xl border border-primary/30 bg-gradient-to-br from-primary/10 to-secondary/10"
      >
        <Briefcase size={18} className="text-primary" />
      </motion.div>

      <div className="group relative overflow-hidden rounded-2xl border border-dark-3 bg-dark-2/50 p-6 transition-all hover:border-primary/30 hover:glow">
        <div className="absolute -top-20 -right-20 size-40 rounded-full bg-gradient-to-br from-primary/5 to-secondary/5 blur-3xl transition-all duration-500 group-hover:scale-150" />

        <div className="relative">
          <div className="mb-3 flex flex-wrap items-center gap-3">
            <h4 className="text-lg font-semibold">{role}</h4>
            <span className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <Calendar size={12} />
              {period}
            </span>
          </div>

          <p className="mb-3 flex items-center gap-1.5 text-sm font-medium text-secondary">
            <Building2 size={14} />
            {company}
          </p>

          <p className="mb-4 text-sm leading-relaxed text-gray-text">
            {desc}
          </p>

          <div className="flex flex-wrap gap-2">
            {highlights.map((h) => (
              <span
                key={h}
                className="rounded-full bg-dark-3 px-3 py-1 text-xs text-gray-text"
              >
                {h}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
