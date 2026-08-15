'use client'

import { useEffect } from 'react'
import { startPassiveMotion, setPassiveSection, SECTION_BY_MODULE } from '@/app/system/passive'

export default function PassiveMotionInit() {
  useEffect(() => {
    startPassiveMotion()

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const hit = SECTION_BY_MODULE.find((s) => s.id === entry.target.id)
            if (hit) setPassiveSection(hit.section)
          }
        }
      },
      { threshold: 0.35 }
    )

    for (const s of SECTION_BY_MODULE) {
      const el = document.getElementById(s.id)
      if (el) observer.observe(el)
    }

    return () => observer.disconnect()
  }, [])

  return null
}
