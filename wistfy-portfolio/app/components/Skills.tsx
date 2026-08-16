'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SKILL_MODULES } from '@/app/data/system'
import { useSystem } from '@/app/system/SystemProvider'
import { sfx } from '@/app/utils/sound'
import SectionShell from '@/app/components/system/SectionShell'
import SkillsSignature from '@/app/components/SkillsSignature'

export default function Skills() {
  const { soundOn, pushLog } = useSystem()
  const [open, setOpen] = useState<string[]>(['graphics'])
  const [hovered, setHovered] = useState(-1)

  const toggle = (id: string) => {
    if (soundOn) sfx.click()
    const next = open.includes(id) ? open.filter((x) => x !== id) : [...open, id]
    pushLog(next.includes(id) ? `Module expanded: ${id.toUpperCase()}` : `Module collapsed: ${id.toUpperCase()}`)
    setOpen(next)
  }

  return (
    <SectionShell id="module-skills" title="System Modules" code="MODULE_03">
      <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-10">
        {/* left — primary reading area */}
        <div className="lg:col-span-7">
          <div className="mb-10 md:mb-12">
            <p className="max-w-xl text-[15px] leading-relaxed text-ink-2 md:text-base">
              Skills represented as loaded system modules. Expand a module to inspect its registered
              capabilities.
            </p>
          </div>

          <div className="space-y-3">
            {SKILL_MODULES.map((mod, idx) => {
              const isOpen = open.includes(mod.id)
              return (
                <div
                  key={mod.id}
                  className={`hud-frame hud-corners relative overflow-hidden transition-colors ${
                    isOpen ? 'border-line-strong' : ''
                  }`}
                  onMouseEnter={() => setHovered(idx)}
                  onMouseLeave={() => setHovered(-1)}
                >
              <span className="corner-tick tl" />
              <span className="corner-tick tr" />

              <button
                onClick={() => toggle(mod.id)}
                className="flex w-full items-center gap-4 px-5 py-4 text-left md:px-7"
                aria-expanded={isOpen}
              >
                <span className="mono text-[10px] tracking-[0.25em] text-ink-4">
                  MOD_{String(idx + 1).padStart(2, '0')}
                </span>
                <span className="flex-1">
                  <span className="display block text-lg font-semibold tracking-wide text-ink md:text-xl">
                    {mod.name}
                  </span>
                  <span className="mono mt-0.5 block text-[10px] tracking-[0.15em] text-ink-3">
                    {mod.description}
                  </span>
                </span>
                <span
                  className={`mono text-[10px] tracking-[0.2em] transition-all duration-300 ${
                    isOpen ? 'text-cyan' : 'text-ink-4'
                  }`}
                >
                  {isOpen ? '[ − ]' : '[ + ]'}
                </span>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <div className="grid gap-x-8 gap-y-3 border-t border-line px-5 py-5 md:grid-cols-2 md:px-7 md:py-6">
                      {mod.items.map((item, i) => (
                        <div key={item} className="flex items-center gap-3">
                          <span className="mono text-[10px] tracking-[0.2em] text-ink-4">
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          <span
                            className="h-px w-6"
                            style={{ background: 'var(--line-strong)' }}
                          />
                          <span className="text-sm text-ink-2">{item}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
        </div>
        </div>

        {/* right — visual signature */}
        <div className="lg:col-span-5">
          <SkillsSignature active={hovered} />
        </div>
      </div>
    </SectionShell>
  )
}