'use client'

let ctx: AudioContext | null = null

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (!ctx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    if (!AC) return null
    ctx = new AC()
  }
  return ctx
}

function tone(
  freq: number,
  duration: number,
  type: OscillatorType = 'sine',
  gain = 0.04,
  when = 0
) {
  const c = getCtx()
  if (!c) return
  if (c.state === 'suspended') c.resume()
  const t = c.currentTime + when
  const osc = c.createOscillator()
  const g = c.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, t)
  g.gain.setValueAtTime(0, t)
  g.gain.linearRampToValueAtTime(gain, t + 0.005)
  g.gain.exponentialRampToValueAtTime(0.0001, t + duration)
  osc.connect(g)
  g.connect(c.destination)
  osc.start(t)
  osc.stop(t + duration + 0.02)
}

export const sfx = {
  click() {
    tone(760, 0.06, 'square', 0.03)
  },
  hover() {
    tone(520, 0.04, 'sine', 0.02)
  },
  boot() {
    tone(220, 0.35, 'sawtooth', 0.03)
    tone(330, 0.3, 'sawtooth', 0.03, 0.25)
    tone(440, 0.4, 'sawtooth', 0.03, 0.5)
    tone(880, 0.5, 'sine', 0.03, 0.8)
  },
  select() {
    tone(440, 0.08, 'triangle', 0.035)
    tone(660, 0.09, 'triangle', 0.035, 0.07)
    tone(880, 0.12, 'triangle', 0.03, 0.15)
  },
  open() {
    tone(300, 0.08, 'sine', 0.035)
    tone(450, 0.1, 'sine', 0.035, 0.06)
  },
  close() {
    tone(450, 0.07, 'sine', 0.03)
    tone(300, 0.1, 'sine', 0.03, 0.05)
  },
  debug() {
    tone(1046, 0.1, 'square', 0.025)
    tone(1318, 0.1, 'square', 0.025, 0.1)
    tone(1568, 0.18, 'square', 0.025, 0.2)
  },
}
