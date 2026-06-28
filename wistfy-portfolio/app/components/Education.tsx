'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { GraduationCap, Calendar, MapPin, Award } from 'lucide-react'

const education = [
  {
    degree: 'Bachelor of Science in Computer Science',
    school: 'University of Technology',
    location: 'Ho Chi Minh City, Vietnam',
    period: '2020 - 2024',
    gpa: '3.8 / 4.0',
    desc: 'Focused on computer graphics, algorithms, and software engineering. Completed a thesis on real-time rendering techniques using Vulkan and GLSL.',
    highlights: ['Computer Graphics', 'Data Structures & Algorithms', 'Software Engineering', 'Linear Algebra'],
  },
  {
    degree: 'High School Diploma',
    school: 'Le Quy Don High School',
    location: 'Da Nang, Vietnam',
    period: '2017 - 2020',
    gpa: '9.2 / 10.0',
    desc: 'Graduated with honors. Participated in national programming competitions and led the school\'s programming club.',
    highlights: ['National Olympiad in Informatics', 'Advanced Mathematics', 'Programming Club Founder'],
  },
]

function EducationItem({
  degree,
  school,
  location,
  period,
  gpa,
  desc,
  highlights,
  index,
}: {
  degree: string
  school: string
  location: string
  period: string
  gpa: string
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
        className="absolute left-0 top-1 flex size-[46px] items-center justify-center rounded-xl border border-accent/30 bg-gradient-to-br from-accent/10 to-accent-2/10"
      >
        <GraduationCap size={18} className="text-accent" />
      </motion.div>

      <div className="group relative overflow-hidden rounded-2xl border border-dark-3 bg-dark-2/50 p-6 transition-all hover:border-accent/30 hover:glow">
        <div className="absolute -top-20 -right-20 size-40 rounded-full bg-gradient-to-br from-accent/5 to-accent-2/5 blur-3xl transition-all duration-500 group-hover:scale-150" />

        <div className="relative">
          <div className="mb-3 flex flex-wrap items-center gap-3">
            <h4 className="text-lg font-semibold">{degree}</h4>
            <span className="flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
              <Calendar size={12} />
              {period}
            </span>
          </div>

          <div className="mb-3 flex flex-wrap items-center gap-4 text-sm">
            <span className="flex items-center gap-1.5 font-medium text-secondary">
              <Award size={14} />
              {school}
            </span>
            <span className="flex items-center gap-1.5 text-gray-text">
              <MapPin size={14} />
              {location}
            </span>
          </div>

          <p className="mb-3 text-xs text-gray-text">
            GPA: <span className="font-semibold text-light">{gpa}</span>
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

export default function Education() {
  return (
    <section id="education" className="section-padding relative mx-auto max-w-6xl">
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
          className="mb-4 inline-block rounded-full border border-accent/20 bg-accent/5 px-5 py-2 text-sm font-medium text-accent"
        >
          Education
        </motion.div>

        <h3 className="mb-12 text-4xl font-bold md:text-5xl">
          Academic <span className="text-gradient">Background</span>
        </h3>

        <div className="relative">
          <motion.div
            initial={{ height: 0 }}
            whileInView={{ height: '100%' }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="absolute left-[23px] top-0 w-px bg-gradient-to-b from-accent via-accent-2 to-transparent"
          />

          <div className="space-y-10">
            {education.map((item, index) => (
              <EducationItem key={item.degree} {...item} index={index} />
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  )
}
