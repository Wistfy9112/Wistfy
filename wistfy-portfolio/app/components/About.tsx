'use client'

import { PROFILE } from '@/app/data/system'
import { useSystem } from '@/app/system/SystemProvider'
import SectionShell from '@/app/components/system/SectionShell'

function Row({ label, value, children }: { label: string; value?: string; children?: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1 border-b border-line/60 py-3 sm:flex-row sm:items-baseline sm:gap-8">
      <span className="mono w-36 shrink-0 text-[10px] tracking-[0.25em] text-ink-4">{label}</span>
      {value ? <span className="text-[15px] text-ink-2">{value}</span> : children}
    </div>
  )
}

export default function About() {
  const { debugMode } = useSystem()

  return (
    <SectionShell id="module-about" title="System Profile" code="MODULE_02">
      <div className="hud-frame hud-corners relative overflow-hidden p-5 md:p-8">
        <span className="corner-tick tl" />
        <span className="corner-tick tr" />
        <span className="corner-tick bl" />
        <span className="corner-tick br" />

        <div className="mb-6 flex items-center justify-between">
          <span className="mono text-[10px] tracking-[0.3em] text-ink-3">USER.DAT // PROFILE</span>
          <span className="mono flex items-center gap-2 text-[10px] tracking-[0.2em] text-cyan">
            <span className="status-live inline-block size-1.5 rounded-full bg-cyan" />
            {debugMode ? 'ROOT ACCESS' : 'VERIFIED USER'}
          </span>
        </div>

        <div className="mb-10 space-y-4 text-base leading-relaxed text-ink-2 md:text-lg">
          <p>
            I&apos;m a graphics programmer focused on real-time rendering, graphics systems and
            interactive visual experiences — I build the systems that turn geometry into images.
          </p>
          <p className="text-ink-3">
            That range shows up everywhere here: rendering pipelines, GPU work, engineering
            experiments, and this very site — a portfolio designed as a virtual computer system.
            Keep scrolling; the project map below is where the work actually lives.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-[1fr_1.4fr]">
          <div>
            <Row label="USER" value={PROFILE.name} />
            <Row label="ROLE">
              <div className="space-y-1">
                {PROFILE.roles.map((r) => (
                  <div key={r} className="text-[15px] text-ink-2">▸ {r}</div>
                ))}
              </div>
            </Row>
            <Row label="LOCATION" value={PROFILE.location} />
            <Row label="INTERESTS">
              <div className="flex flex-wrap gap-2 pt-1">
                {PROFILE.interests.map((i) => (
                  <span key={i} className="mono border border-line px-2 py-1 text-[10px] tracking-[0.15em] text-ink-2">
                    {i}
                  </span>
                ))}
              </div>
            </Row>
          </div>

          <div>
            <div className="mb-4 flex items-center gap-3">
              <span className="corner-tick tl" />
              <span className="mono text-[10px] tracking-[0.3em] text-cyan">PERSONAL NOTE</span>
              <span className="corner-tick tr" />
            </div>
            <div className="space-y-4 text-[15px] leading-relaxed text-ink-2 md:text-base">
              {PROFILE.bio.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
            <div className="mono mt-6 flex items-center gap-2 text-[11px] tracking-[0.2em] text-ink-4">
              <span className="text-cyan">&gt;</span>
              <span>
                {PROFILE.tagline}
                <span className="cursor-blink text-cyan">_</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </SectionShell>
  )
}