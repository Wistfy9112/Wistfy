'use client'

import { useEffect, useRef, useState } from 'react'
import { useSystem } from '@/app/system/SystemProvider'

type CursorState = 'normal' | 'hover' | 'loading' | 'active'

export default function CustomCursor() {
  const { isTouch, reducedMotion, debugMode } = useSystem()
  const [state, setState] = useState<CursorState>('normal')
  const [pos, setPos] = useState({ x: -100, y: -100 })
  const [hoverTarget, setHoverTarget] = useState<string | null>(null)
  const [visible, setVisible] = useState(false)
  const [enabled] = useState(!isTouch)
  const coordsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!enabled) return

    const onMove = (e: MouseEvent) => {
      setVisible(true)
      setPos({ x: e.clientX, y: e.clientY })
      if (coordsRef.current) {
        coordsRef.current.textContent = `${e.clientX.toString().padStart(4, '0')} : ${e.clientY
          .toString()
          .padStart(4, '0')}`
      }
      const target = (e.target as HTMLElement).closest(
        'a, button, [role="button"], [data-cursor]'
      ) as HTMLElement | null
      if (target) {
        setState('hover')
        setHoverTarget(target.getAttribute('data-cursor') || target.getAttribute('aria-label'))
      } else {
        setState('normal')
        setHoverTarget(null)
      }
    }

    const onDown = () => {
      setState('active')
      document.body.classList.add('custom-cursor')
    }
    const onUp = () => {
      setState(hoverTarget ? 'hover' : 'normal')
    }
    const onLeave = () => setVisible(false)

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)
    document.documentElement.addEventListener('mouseleave', onLeave)

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
      document.documentElement.removeEventListener('mouseleave', onLeave)
    }
  }, [enabled, hoverTarget])

  if (!enabled || isTouch) return null

  const scale = state === 'active' ? 0.8 : state === 'hover' ? 1.6 : 1

  return (
    <>
      <div
        className="pointer-events-none fixed left-0 top-0 z-[95] hidden md:block"
        style={{
          transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`,
          opacity: visible ? 1 : 0,
          transition: reducedMotion ? 'none' : 'transform 0.05s linear',
        }}
      >
        {/* crosshair */}
        <div
          className="relative -ml-[14px] -mt-[14px]"
          style={{ width: 28, height: 28 }}
        >
          <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-cyan/70" />
          <span className="absolute top-1/2 left-0 h-px w-full -translate-y-1/2 bg-cyan/70" />
          {/* ring */}
          <span
            className="absolute left-1/2 top-1/2 rounded-full border transition-all duration-150"
            style={{
              width: 18 * scale,
              height: 18 * scale,
              transform: `translate(-50%, -50%) scale(${scale})`,
              borderColor:
                state === 'hover' ? 'rgba(62,230,255,0.9)' : 'rgba(62,230,255,0.45)',
              boxShadow:
                state === 'hover'
                  ? '0 0 12px rgba(62,230,255,0.35)'
                  : 'none',
            }}
          />
        </div>
      </div>

      {/* label following cursor on hover */}
      {state === 'hover' && hoverTarget && (
        <div
          className="mono pointer-events-none fixed left-0 top-0 z-[96] hidden translate-x-3 translate-y-3 text-[10px] tracking-[0.15em] text-cyan md:block"
          style={{ transform: `translate3d(${pos.x + 18}px, ${pos.y + 18}px, 0)` }}
        >
          [{hoverTarget}]
        </div>
      )}

      {/* coordinates readout */}
      <div className="mono pointer-events-none fixed bottom-6 left-6 z-40 hidden text-[10px] tracking-[0.2em] text-ink-4 md:block">
        <div ref={coordsRef}>0000 : 0000</div>
      </div>

      {debugMode && (
        <div className="mono pointer-events-none fixed bottom-6 right-6 z-40 hidden text-[10px] tracking-[0.2em] text-cyan/70 md:block">
          DEBUG MODE [ACTIVE]
        </div>
      )}
    </>
  )
}