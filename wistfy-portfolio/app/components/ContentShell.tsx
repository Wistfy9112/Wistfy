'use client'

import { useEffect, useState } from 'react'

export default function ContentShell({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    requestAnimationFrame(() => setMounted(true))
  }, [])

  if (!mounted) return null

  return <>{children}</>
}
