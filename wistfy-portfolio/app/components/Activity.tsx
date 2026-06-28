'use client'

import { motion } from 'framer-motion'
import { Users, Trophy, Lightbulb, Globe, Terminal, Palette } from 'lucide-react'

const activities = [
  {
    icon: Trophy,
    title: 'ACM ICPC Competitor',
    org: 'International Collegiate Programming Contest',
    period: '2021 - 2024',
    desc: 'Competed in regional programming contests, solving complex algorithmic problems under time pressure using C++ and Python.',
    color: 'from-accent/20 to-primary/20',
    iconColor: 'text-accent',
  },
  {
    icon: Lightbulb,
    title: 'Open Source Contributor',
    org: 'GitHub Community',
    period: '2022 - Present',
    desc: 'Contributed to open-source graphics libraries and game engine repositories. Authored rendering documentation and bug fixes.',
    color: 'from-primary/20 to-secondary/20',
    iconColor: 'text-primary',
  },
  {
    icon: Terminal,
    title: 'Game Jam Participant',
    org: 'Ludum Dare & Global Game Jam',
    period: '2021 - Present',
    desc: 'Built complete games in 48-hour sprints, focusing on rapid prototyping and creative problem-solving under tight deadlines.',
    color: 'from-secondary/20 to-accent/20',
    iconColor: 'text-secondary',
  },
  {
    icon: Globe,
    title: 'Tech Speaker',
    org: 'University Tech Club',
    period: '2022 - 2024',
    desc: 'Organized workshops on graphics programming and modern C++. Presented talks on GPU architecture and rendering pipelines to 50+ attendees.',
    color: 'from-accent-2/20 to-primary/20',
    iconColor: 'text-accent-2',
  },
  {
    icon: Palette,
    title: 'Creative Coding Artist',
    org: 'Personal Projects',
    period: '2020 - Present',
    desc: 'Experiment with generative art, shader art, and procedural animation. Published several interactive pieces on Shadertoy and ArtStation.',
    color: 'from-secondary/20 to-accent-2/20',
    iconColor: 'text-secondary',
  },
  {
    icon: Users,
    title: 'Mentor & Tutor',
    org: 'Computer Science Department',
    period: '2022 - 2024',
    desc: 'Mentored junior students in data structures and algorithms. Tutored introductory programming courses for 100+ students.',
    color: 'from-primary/20 to-accent-2/20',
    iconColor: 'text-primary',
  },
]

export default function Activity() {
  return (
    <section id="activity" className="section-padding relative mx-auto max-w-6xl">
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
          className="mb-4 inline-block rounded-full border border-secondary/20 bg-secondary/5 px-5 py-2 text-sm font-medium text-secondary"
        >
          Activities
        </motion.div>

        <h3 className="mb-12 text-4xl font-bold md:text-5xl">
          Beyond <span className="text-gradient">the Code</span>
        </h3>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {activities.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="group relative overflow-hidden rounded-2xl border border-dark-3 bg-dark-2/50 p-6 transition-all hover:border-secondary/30 hover:glow"
            >
              <div
                className={`absolute -top-10 -right-10 size-24 rounded-full bg-gradient-to-br ${item.color} blur-2xl transition-all duration-500 group-hover:scale-150`}
              />

              <div className="relative">
                <div className="mb-4 flex items-start justify-between">
                  <div className="rounded-xl bg-dark-3 p-3">
                    <item.icon size={20} className={item.iconColor} />
                  </div>
                  <span className="text-xs text-gray-text">{item.period}</span>
                </div>

                <h4 className="mb-1 font-semibold">{item.title}</h4>
                <p className="mb-3 text-xs font-medium text-secondary">{item.org}</p>
                <p className="text-sm leading-relaxed text-gray-text">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
