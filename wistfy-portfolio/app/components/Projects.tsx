'use client'

import { useRef } from 'react'
import { motion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'

const projects = [
  {
    title: 'Vulkan Engine',
    desc: 'A custom game engine built from scratch with Vulkan API featuring PBR rendering, shadow mapping, and a component-based entity system.',
    tags: ['C++', 'Vulkan', 'GLSL', 'CMake'],
    color: 'from-primary to-secondary',
    github: '#',
    live: '#',
  },
  {
    title: 'OpenGL Renderer',
    desc: 'Real-time 3D renderer implementing forward+ rendering, SSAO, bloom post-processing, and GPU particles with compute shaders.',
    tags: ['C++', 'OpenGL', 'GLSL', 'Compute Shaders'],
    color: 'from-accent to-accent-2',
    github: '#',
    live: '#',
  },
  {
    title: 'Ray Tracer',
    desc: 'Monte Carlo path tracer supporting global illumination, volumetrics, subsurface scattering, and BVH-accelerated scene traversal.',
    tags: ['C++', 'CUDA', 'OptiX', 'SIMD'],
    color: 'from-secondary to-primary',
    github: '#',
    live: '#',
  },
  {
    title: 'WebGL Particle Sim',
    desc: 'Browser-based particle physics simulation with 100K+ particles, SPH fluid dynamics, and interactive force fields rendered via WebGL.',
    tags: ['WebGL', 'GLSL', 'TypeScript', 'Three.js'],
    color: 'from-accent-2 to-accent',
    github: '#',
    live: '#',
  },
]

function TiltCard({ project, index }: { project: typeof projects[0]; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent) => {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    const rotateX = (y - 0.5) * -12
    const rotateY = (x - 0.5) * 12
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`
  }

  const handleMouseLeave = () => {
    const card = cardRef.current
    if (!card) return
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="group relative rounded-2xl border border-dark-3 bg-dark-2/50 p-6 transition-all duration-200 hover:border-transparent hover:glow-lg"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div
          className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${project.color} opacity-0 transition-opacity duration-300 group-hover:opacity-5`}
        />
        <div
          className="absolute -inset-px rounded-2xl bg-gradient-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: `linear-gradient(135deg, transparent 40%, ${project.color.includes('primary') ? '#6366f1' : project.color.includes('accent') ? '#f59e0b' : '#06b6d4'} 50%, transparent 60%)`,
            mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            maskComposite: 'exclude',
            WebkitMaskComposite: 'xor',
            padding: '1px',
          }}
        />

        <div className="relative" style={{ transform: 'translateZ(30px)' }}>
          <div className="mb-4 flex items-center justify-between">
            <div
              className={`flex size-12 items-center justify-center rounded-xl bg-gradient-to-br ${project.color}`}
            >
              <span className="text-lg font-bold text-white">
                {project.title[0]}
              </span>
            </div>
            <div className="flex gap-2">
              <a
                href={project.github}
                className="flex size-9 items-center justify-center rounded-lg bg-dark-3 text-gray-text transition-all hover:bg-primary/20 hover:text-primary"
                aria-label={`${project.title} GitHub`}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                  <path d="M9 18c-4.51 2-5-2-7-2" />
                </svg>
              </a>
              <a
                href={project.live}
                className="flex size-9 items-center justify-center rounded-lg bg-dark-3 text-gray-text transition-all hover:bg-primary/20 hover:text-primary"
                aria-label={`${project.title} Live`}
              >
                <ExternalLink size={16} />
              </a>
            </div>
          </div>

          <h4 className="mb-2 text-xl font-semibold transition-colors group-hover:text-primary">
            {project.title}
          </h4>
          <p className="mb-5 text-sm leading-relaxed text-gray-text">
            {project.desc}
          </p>

          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-dark-3 px-3 py-1 text-xs font-medium text-gray-text transition-colors group-hover:bg-primary/10 group-hover:text-primary"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function Projects() {
  return (
    <section id="projects" className="section-padding mx-auto max-w-6xl">
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
          Projects
        </motion.div>

        <h3 className="mb-12 text-4xl font-bold md:text-5xl">
          Graphics <span className="text-gradient">Engineering</span>
        </h3>

        <div className="grid gap-8 md:grid-cols-2">
          {projects.map((project, index) => (
            <TiltCard key={project.title} project={project} index={index} />
          ))}
        </div>
      </motion.div>
    </section>
  )
}
