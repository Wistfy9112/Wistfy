export function webglSupported(): boolean {
  if (typeof window === 'undefined') return false
  try {
    const canvas = document.createElement('canvas')
    return !!(canvas.getContext('webgl2') || canvas.getContext('webgl'))
  } catch {
    return false
  }
}

type GpuMode = 'ONLINE' | 'FALLBACK'

let cached: GpuMode | null = null

const listeners = new Set<() => void>()

function compute(): GpuMode {
  return webglSupported() ? 'ONLINE' : 'FALLBACK'
}

export function subscribeGpuMode(cb: () => void) {
  listeners.add(cb)
  return () => {
    listeners.delete(cb)
  }
}

export function getGpuMode(): GpuMode {
  if (typeof window === 'undefined') return 'ONLINE'
  if (cached === null) {
    cached = compute()
  }
  return cached
}

export function refreshGpuMode() {
  const next = compute()
  if (next !== cached) {
    cached = next
    listeners.forEach((cb) => cb())
  }
}
