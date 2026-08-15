'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { BOOT_LINES, BOOT_END_LINE } from '@/app/data/system'
import { useSystem } from '@/app/system/SystemProvider'
import { sfx } from '@/app/utils/sound'

const SESSION_KEY = 'wistfy-booted-v2'

interface Line {
  text: string
  delay: number
}

export default function BootSequence() {
  const { enterSystem, skipBoot, soundOn, reducedMotion } = useSystem()
  const [visibleCount, setVisibleCount] = useState(0)
  const [showEnter, setShowEnter] = useState(false)
  const [skipping, setSkipping] = useState(false)
  const doneRef = useRef(false)

  const finish = useCallback(() => {
    if (doneRef.current) return
    doneRef.current = true
    try {
      sessionStorage.setItem(SESSION_KEY, '1')
    } catch {
      /* private mode */
    }
    if (soundOn) sfx.boot()
    enterSystem()
  }, [enterSystem, soundOn])

  useEffect(() => {
    // returning visitor: skip animation entirely
    let alreadyBooted = false
    try {
      alreadyBooted = sessionStorage.getItem(SESSION_KEY) === '1'
    } catch {
      alreadyBooted = false
    }
    if (alreadyBooted) {
      finish()
      return
    }

    let cancelled = false
    const timers: ReturnType<typeof setTimeout>[] = []

    const speed = reducedMotion ? 4 : 1

    let elapsed = 0
    BOOT_LINES.forEach((line: Line) => {
      timers.push(
        setTimeout(() => {
          if (!cancelled) {
            setVisibleCount((c) => c + 1)
            if (soundOn) sfx.hover()
          }
        }, (elapsed / speed) * 0.75)
      )
      elapsed += line.delay
    })

    const enterTimer = setTimeout(
      () => {
        if (!cancelled) setShowEnter(true)
      },
      (elapsed / speed) * 0.75 + (reducedMotion ? 200 : 260)
    )
    timers.push(enterTimer)

    return () => {
      cancelled = true
      timers.forEach(clearTimeout)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion])

  const handleEnter = useCallback(() => {
    if (skipping) return
    setSkipping(true)
    if (soundOn) sfx.open()
    finish()
  }, [finish, skipping, soundOn])

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        handleEnter()
      }
    },
    [handleEnter]
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [handleKey])

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col justify-center px-6 md:px-16"
      style={{ background: '#030509' }}
      role="dialog"
      aria-label="System boot sequence"
    >
      <div className="tech-grid-fade pointer-events-none absolute inset-0" />
      <div className="relative mx-auto w-full max-w-2xl">
        <div className="mono mb-6 text-xs tracking-[0.3em] text-ink-4">
          WISTFY / SYSTEM BOOT
        </div>
        <div className="mono min-h-[320px] text-[13px] leading-[1.9] md:text-sm">
          {BOOT_LINES.slice(0, visibleCount).map((line, i) =>
            line.text ? (
              <div key={i} className="text-ink-2">
                {line.text.includes('ONLINE') || line.text.includes('COMPLETE') ? (
                  <span>
                    <span className="text-ink-4">{line.text.split('      ')[0]}</span>
                    <span className="text-ink-4">{line.text.split('      ')[1] || ''}</span>{' '}
                    <span className="text-cyan">{line.text.includes('COMPLETE') ? 'COMPLETE' : 'ONLINE'}</span>
                  </span>
                ) : (
                  <span className={line.text.startsWith('>') ? 'text-cyan' : 'text-ink-2'}>{line.text}</span>
                )}
              </div>
            ) : (
              <div key={i}>&nbsp;</div>
            )
          )}
          {showEnter && (
            <div className="mt-6">
              <div className="mb-6 flex items-center gap-2 text-cyan">
                <span className="cursor-blink">▌</span>
                <span>{BOOT_END_LINE}</span>
              </div>
              <button
                onClick={handleEnter}
                className="btn-hud"
                aria-label="Enter virtual environment"
                autoFocus
              >
                <span className="inline-block size-2 bg-cyan pulse-ring" />
                ENTER VIRTUAL ENVIRONMENT
              </button>
            </div>
          )}
        </div>
      </div>
      <button
        onClick={() => {
          if (soundOn) sfx.click()
          skipBoot()
        }}
        className="mono fixed bottom-6 right-6 z-10 border border-line px-4 py-2 text-[11px] tracking-[0.2em] text-ink-3 transition-colors hover:border-ink-3 hover:text-ink"
        aria-label="Skip boot sequence"
      >
        SKIP ▸
      </button>
    </div>
  )
}
