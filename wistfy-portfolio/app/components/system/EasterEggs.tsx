'use client'

import { useEffect, useRef, useState } from 'react'
import { useSystem } from '@/app/system/SystemProvider'
import { sfx } from '@/app/utils/sound'

const SECRET_SEQUENCE = ['w', 'i', 's', 't', 'f', 'y', 'o', 's']

export default function EasterEggs() {
  const { enableDebug, pushLog, soundOn, debugMode, booted } = useSystem()
  const seqRef = useRef(0)
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [scanning, setScanning] = useState(false)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase()
      if (k === SECRET_SEQUENCE[seqRef.current]) {
        seqRef.current++
        if (seqRef.current === SECRET_SEQUENCE.length) {
          seqRef.current = 0
          enableDebug()
          pushLog('SYSTEM://DEBUG ACCESS GRANTED')
          pushLog('HIDDEN OVERLAYS ENABLED')
          if (soundOn) sfx.debug()
          console.log(
            '%cWISTFY SYSTEM',
            'color:#3ee6ff;font-weight:bold;font-size:16px;font-family:monospace'
          )
          console.log('%c> Debug mode unlocked. Hello, visitor.', 'color:#8b9bff;font-family:monospace')
          console.log('%c> Tip: click the WISTFY logo 5 times.', 'color:#7c8da3;font-family:monospace')
        }
      } else {
        seqRef.current = 0
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [enableDebug, pushLog, soundOn])

  // idle scan
  useEffect(() => {
    if (!booted || debugMode) return
    const reset = () => {
      if (idleTimer.current) clearTimeout(idleTimer.current)
      idleTimer.current = setTimeout(() => {
        setScanning(true)
        pushLog('IDLE: running environment scan...')
        pushLog('SCAN: subsystem integrity 100%')
        setTimeout(() => {
          setScanning(false)
          pushLog('SCAN: environment stable')
        }, 3000)
      }, 30000)
    }
    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll']
    events.forEach((ev) => window.addEventListener(ev, reset, { passive: true }))
    reset()
    return () => {
      events.forEach((ev) => window.removeEventListener(ev, reset))
      if (idleTimer.current) clearTimeout(idleTimer.current)
    }
  }, [booted, debugMode, pushLog])

  return scanning ? (
    <div className="pointer-events-none fixed inset-0 z-[70]" aria-hidden="true">
      <div className="absolute inset-0 bg-cyan/5" />
      <div
        className="absolute inset-x-0 h-1 bg-cyan/50"
        style={{
          animation: 'scanVertical 3s ease-in-out forwards',
        }}
      />
      <style>{`
        @keyframes scanVertical {
          0% { top: -5%; }
          100% { top: 105%; }
        }
      `}</style>
      <div className="mono absolute left-1/2 top-8 -translate-x-1/2 text-[10px] tracking-[0.4em] text-cyan">
        ENVIRONMENT SCAN IN PROGRESS
      </div>
    </div>
  ) : null
}