'use client'

import { motion } from 'framer-motion'
import { Monitor, Cpu, Box, ArrowRight } from 'lucide-react'

const highlights = [
  {
    icon: Monitor,
    title: 'Graphics Programming',
    desc: 'Building real-time rendering pipelines with OpenGL, GLSL shaders, and modern GPU architectures.',
    color: 'from-primary/20 to-secondary/20',
    iconColor: 'text-primary',
  },
  {
    icon: Cpu,
    title: 'Systems Engineering',
    desc: 'Writing performant C++ code with deep understanding of memory management and low-level optimization.',
    color: 'from-accent/20 to-accent-2/20',
    iconColor: 'text-accent',
  },
  {
    icon: Box,
    title: 'Game Engine Dev',
    desc: 'Designing modular engine architectures with entity-component systems and physics simulation.',
    color: 'from-secondary/20 to-primary/20',
    iconColor: 'text-secondary',
  },
]

export default function About() {
  return (
    <section id="about" className="section-padding relative mx-auto max-w-6xl">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
        }}
      >
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 40 },
            visible: { opacity: 1, y: 0 },
          }}
          className="mb-4 inline-block rounded-full border border-primary/20 bg-primary/5 px-5 py-2 text-sm font-medium text-primary"
        >
          About Me
        </motion.div>

        <motion.h3
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0 },
          }}
          className="mb-8 text-4xl font-bold md:text-5xl"
        >
          Software Engineer With a<br />
          <span className="text-gradient">Passion for Graphics</span>
        </motion.h3>

        <div className="grid gap-12 md:grid-cols-5">
          <motion.div
            variants={{
              hidden: { opacity: 0, x: -30 },
              visible: { opacity: 1, x: 0 },
            }}
            className="md:col-span-3"
          >
            <p className="mb-6 text-lg leading-relaxed text-gray-text">
              I&apos;m a software engineer specializing in graphics programming
              and game engine development. My work bridges the gap between
              low-level systems programming and visual creativity — from
              writing OpenGL rendering pipelines to architecting full game
              engines.
            </p>
            <p className="mb-8 text-lg leading-relaxed text-gray-text">
              With a strong foundation in C++, GPU architecture, and
              real-time rendering techniques, I build software that pushes
              pixels and hardware to their limits. I thrive on the challenge
              of making complex algorithms run at 60+ FPS.
            </p>

            <a
              href="#contact"
              className="group inline-flex items-center gap-2 text-primary transition-all hover:gap-3"
            >
              <span className="font-medium">Let&apos;s build something</span>
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </a>
          </motion.div>

          <motion.div
            variants={{
              hidden: { opacity: 0, x: 30 },
              visible: { opacity: 1, x: 0 },
            }}
            className="flex flex-col gap-5 md:col-span-2"
          >
            {highlights.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="group relative overflow-hidden rounded-2xl border border-dark-3 bg-dark-2/50 p-6 transition-all hover:border-primary/30 hover:glow"
              >
                <div
                  className={`absolute -top-10 -right-10 size-24 rounded-full bg-gradient-to-br ${item.color} blur-2xl transition-all duration-500 group-hover:scale-150`}
                />
                <div className="relative flex items-start gap-4">
                  <div className="rounded-xl bg-dark-3 p-3">
                    <item.icon size={20} className={item.iconColor} />
                  </div>
                  <div>
                    <h4 className="mb-1 font-semibold">{item.title}</h4>
                    <p className="text-sm leading-relaxed text-gray-text">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}
