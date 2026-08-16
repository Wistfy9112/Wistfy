'use client'

import { experiences } from '@/app/data/experience'
import SectionShell from '@/app/components/system/SectionShell'

export default function WorkExperience() {
  return (
    <SectionShell id="module-experience" title="Experience" code="MODULE_05">
      <div className="space-y-4">
        {experiences.map((exp) => (
          <div key={exp.id} className="hud-frame hud-corners relative p-5 md:p-8">
            <span className="corner-tick tl" />
            <span className="corner-tick tr" />
            <span className="corner-tick bl" />
            <span className="corner-tick br" />

            <div className="flex flex-col gap-2 md:flex-row md:items-baseline md:justify-between">
              <div>
                <div className="display text-xl font-semibold tracking-tight text-ink md:text-2xl">
                  {exp.role}
                </div>
                <div className="mono mt-1 text-[11px] tracking-[0.2em] text-cyan">
                  {exp.company.toUpperCase()}
                </div>
              </div>
              <span className="mono text-[10px] tracking-[0.2em] text-ink-4">{exp.period}</span>
            </div>

            <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-ink-2 md:text-base">
              {exp.description}
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              {exp.tags.map((t) => (
                <span
                  key={t}
                  className="mono border border-line px-2 py-1 text-[10px] tracking-[0.15em] text-ink-2"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </SectionShell>
  )
}