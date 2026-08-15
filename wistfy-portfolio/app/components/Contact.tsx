'use client'

import { useState } from 'react'
import { PROFILE } from '@/app/data/system'
import { useSystem } from '@/app/system/SystemProvider'
import { sfx } from '@/app/utils/sound'
import SectionShell from '@/app/components/system/SectionShell'

const CHANNELS = [
  { id: 'GITHUB', label: 'github.com/Wistfy9112', href: PROFILE.contact.github, sig: 'CODE / SOURCE' },
  { id: 'LINKEDIN', label: 'in/vo-dinh-huy', href: PROFILE.contact.linkedin, sig: 'PROFESSIONAL' },
  { id: 'EMAIL', label: PROFILE.contact.email, href: `mailto:${PROFILE.contact.email}`, sig: 'DIRECT LINK' },
  { id: 'FACEBOOK', label: '/Wistfy', href: PROFILE.contact.facebook, sig: 'SOCIAL' },
]

export default function Contact() {
  const { soundOn, pushLog } = useSystem()
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', message: '' })

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (soundOn) sfx.select()
    pushLog('Transmitting message...')
    pushLog('Encrypting payload...')
    setSent(true)
  }

  return (
    <SectionShell id="module-contact" title="Communication Module" code="MODULE_04">
      <div className="grid gap-8 lg:grid-cols-2">
        {/* left: connect */}
        <div className="hud-frame hud-corners relative flex flex-col justify-between p-6 md:p-8">
          <span className="corner-tick tl" />
          <span className="corner-tick tr" />
          <span className="corner-tick bl" />
          <span className="corner-tick br" />

          <div>
            <div className="mono mb-3 flex items-center gap-2 text-[10px] tracking-[0.3em] text-cyan">
              <span className="status-live inline-block size-1.5 rounded-full bg-cyan" />
              SYSTEM READY
            </div>
            <h3 className="display mb-3 text-2xl font-semibold tracking-tight text-ink md:text-3xl">
              The comms channel is open.
            </h3>
            <p className="max-w-md text-sm leading-relaxed text-ink-2 md:text-base">
              Pick a channel and send a signal. Rendering, systems, or anything that runs fast and
              looks good — I usually respond within a few days.
            </p>
          </div>

          <div className="mt-8 space-y-2">
            {CHANNELS.map((ch, i) => (
              <a
                key={ch.id}
                href={ch.href}
                target={ch.href.startsWith('http') ? '_blank' : undefined}
                rel={ch.href.startsWith('http') ? 'noreferrer' : undefined}
                onClick={() => {
                  if (soundOn) sfx.open()
                  pushLog(`Opening channel: ${ch.id}`)
                }}
                className="group flex items-center gap-4 border border-line px-4 py-3 transition-colors hover:border-cyan"
              >
                <span className="mono text-[10px] tracking-[0.2em] text-ink-4">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="mono text-xs tracking-[0.2em] text-ink-2 group-hover:text-cyan">
                  {ch.id}
                </span>
                <span className="ml-auto flex-1 truncate text-right text-[11px] text-ink-4 group-hover:text-ink-2">
                  {ch.label}
                </span>
                <span className="mono hidden text-[9px] tracking-[0.15em] text-ink-4 sm:inline">
                  {ch.sig}
                </span>
                <span className="text-ink-4 transition-transform group-hover:translate-x-1 group-hover:text-cyan">
                  ▸
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* right: transmit */}
        <div className="hud-frame hud-corners relative p-6 md:p-8">
          <span className="corner-tick tl" />
          <span className="corner-tick tr" />
          <span className="corner-tick bl" />
          <span className="corner-tick br" />

          {sent ? (
            <div className="flex h-full flex-col items-center justify-center py-16 text-center">
              <div className="mono mb-4 text-[11px] tracking-[0.3em] text-cyan">TRANSMISSION SENT</div>
              <p className="mb-6 max-w-sm text-sm leading-relaxed text-ink-2">
                Your message has been queued. I usually respond within a few days.
              </p>
              <button
                onClick={() => {
                  setSent(false)
                  setForm({ name: '', email: '', message: '' })
                }}
                className="btn-hud"
              >
                NEW TRANSMISSION
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <div>
                <label htmlFor="c-name" className="mono mb-1.5 block text-[10px] tracking-[0.25em] text-ink-3">
                  IDENTIFIER
                </label>
                <input
                  id="c-name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  placeholder="Your name / handle"
                  className="w-full border border-line bg-abyss-0 px-4 py-3 text-sm text-ink placeholder:text-ink-4 focus:border-cyan focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="c-email" className="mono mb-1.5 block text-[10px] tracking-[0.25em] text-ink-3">
                  RETURN ADDRESS
                </label>
                <input
                  id="c-email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  placeholder="you@example.com"
                  className="w-full border border-line bg-abyss-0 px-4 py-3 text-sm text-ink placeholder:text-ink-4 focus:border-cyan focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="c-msg" className="mono mb-1.5 block text-[10px] tracking-[0.25em] text-ink-3">
                  PAYLOAD
                </label>
                <textarea
                  id="c-msg"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  required
                  rows={5}
                  placeholder="What would you like to build?"
                  className="w-full resize-none border border-line bg-abyss-0 px-4 py-3 text-sm text-ink placeholder:text-ink-4 focus:border-cyan focus:outline-none"
                />
              </div>
              <button type="submit" className="btn-hud w-full justify-center">
                <span className="inline-block size-2 bg-cyan" />
                TRANSMIT CONNECTION
              </button>
            </form>
          )}
        </div>
      </div>
    </SectionShell>
  )
}