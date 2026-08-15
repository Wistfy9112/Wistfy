'use client'

import { useEffect } from 'react'

export default function Scanlines() {
  useEffect(() => {
    let raf: number
    const update = () => {
      const pos = (performance.now() / 9000) % 100
      document.documentElement.style.setProperty('--scan-pos', `${pos * 1.2}%`)
      raf = requestAnimationFrame(update)
    }
    raf = requestAnimationFrame(update)
    return () => cancelAnimationFrame(raf)
  }, [])

  return <div className="scanlines scan-sweep pointer-events-none fixed inset-0 z-[90]" aria-hidden="true" />
}