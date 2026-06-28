'use client'

import { motion } from 'framer-motion'

const skillCategories = [
  {
    title: 'Languages',
    skills: ['C++', 'C', 'GLSL', 'Python', 'Rust'],
  },
  {
    title: 'Graphics & APIs',
    skills: ['OpenGL', 'Vulkan', 'DirectX 11', 'WebGL', 'CUDA'],
  },
  {
    title: 'Tools & Engines',
    skills: ['Unreal Engine', 'Unity', 'CMake', 'Git', 'RenderDoc'],
  },
]

function SkillTag({ name, index }: { name: string; index: number }) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.85 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="inline-block rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-medium text-gray-text transition-all hover:border-primary/50 hover:text-primary hover:glow-sm"
    >
      {name}
    </motion.span>
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

        <div className="grid gap-8 md:grid-cols-3">
          {skillCategories.map((category, catIndex) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: catIndex * 0.1, duration: 0.5 }}
              className="rounded-2xl border border-dark-3 bg-dark-2/50 p-6 transition-all hover:border-primary/20"
            >
              <h4 className="mb-5 text-lg font-semibold">{category.title}</h4>
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill, i) => (
                  <SkillTag key={skill} name={skill} index={i} />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
