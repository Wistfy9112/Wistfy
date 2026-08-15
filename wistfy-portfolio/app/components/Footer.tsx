'use client'

import { useSystem } from '@/app/system/SystemProvider'

export default function Footer() {
  const { debugMode } = useSystem()

  return (
    <footer className="relative border-t border-line px-5 py-10 md:px-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 text-center">
        <div className="mono text-[11px] tracking-[0.3em] text-ink-2">WISTFY SYSTEM</div>
        <div className="mono text-[9px] tracking-[0.25em] text-ink-4">
          GRAPHICS • SOFTWARE • EXPERIMENTS
        </div>
        <div className="mono flex items-center gap-2 text-[10px] tracking-[0.25em]">
          <span className="status-live inline-block size-1.5 rounded-full bg-cyan" />
          <span className="text-ink-3">
            SYSTEM STATUS: {debugMode ? 'DEBUG' : 'ONLINE'}
          </span>
        </div>
        <div className="mono mt-2 text-[10px] tracking-[0.2em] text-ink-4">
          © 2026 WISTFY · BUILT AS A VIRTUAL SYSTEM
        </div>
      </div>
    </footer>
  )
}