let supported: boolean | null = null

export function webglSupported(): boolean {
  if (typeof window === 'undefined') return false
  if (supported === null) {
    try {
      const canvas = document.createElement('canvas')
      supported = !!(canvas.getContext('webgl2') || canvas.getContext('webgl'))
    } catch {
      supported = false
    }
  }
  return supported
}

let webgl2: boolean | null = null

export function isWebGL2Supported(): boolean {
  if (typeof window === 'undefined') return false
  if (webgl2 === null) {
    try {
      webgl2 = !!document.createElement('canvas').getContext('webgl2')
    } catch {
      webgl2 = false
    }
  }
  return webgl2
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
