'use client'

import { useEffect, useRef, useState } from 'react'
import { useSystem } from '@/app/system/SystemProvider'

export default function SystemLog() {
  const { log } = useSystem()
  const [expanded, setExpanded] = useState(false)
  const bodyRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight
    }
  }, [log])

  return (
    <div className="mono fixed bottom-6 left-1/2 z-40 hidden w-[min(560px,80vw)] -translate-x-1/2 md:block">
      <div className="hud-frame hud-corners overflow-hidden">
        <button
          onClick={() => setExpanded((e) => !e)}
          className="flex w-full items-center justify-between gap-3 border-b border-line px-4 py-2 text-[10px] tracking-[0.25em] text-ink-3 transition-colors hover:text-ink"
          aria-expanded={expanded}
          aria-label="Toggle system log"
        >
          <span className="flex items-center gap-2">
            <span className="status-live inline-block size-1.5 rounded-full bg-cyan" />
            SYSTEM LOG
          </span>
          <span>{expanded ? '▾' : '▸'}</span>
        </button>
        <div
          ref={bodyRef}
          className="hud-frame overflow-y-auto px-4 py-3 text-[11px] leading-[1.8] transition-[max-height,opacity] duration-300"
          style={{
            maxHeight: expanded ? 260 : 92,
            opacity: expanded ? 1 : 0.85,
            background: 'rgba(3,5,9,0.7)',
          }}
          aria-live="polite"
        >
          {log.map((entry) => (
            <div key={entry.id} className="whitespace-nowrap">
              <span className="text-ink-4">[{entry.time}]</span>{' '}
              <span className="text-ink-2">{entry.message}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}