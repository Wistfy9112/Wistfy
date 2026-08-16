/* ------------------------------------------------------------------ */
/* Passive interaction engine                                          */
/* ------------------------------------------------------------------ */
/* A single shared rAF loop that tracks cursor / scroll / idle state  */
/* as a plain mutable object (outside React) so per-frame reads never */
/* trigger re-renders. Components read getPassive() inside their own  */
/* loops and apply subtle, damped motion.                             */

export type PassiveSection =
  | 'hero'
  | 'about'
  | 'projects'
  | 'skills'
  | 'education'
  | 'achievements'
  | 'contact'
  | null

export const SECTION_BY_MODULE: { id: string; section: Exclude<PassiveSection, null> }[] = [
  { id: 'module-hero', section: 'hero' },
  { id: 'module-about', section: 'about' },
  { id: 'module-projects', section: 'projects' },
  { id: 'module-skills', section: 'skills' },
  { id: 'module-education', section: 'education' },
  { id: 'module-achievements', section: 'achievements' },
  { id: 'module-contact', section: 'contact' },
]

export interface PassiveState {
  cursorX: number // smoothed, normalized -1..1
  cursorY: number
  velX: number // px/s, smoothed + clamped
  velY: number
  cursorActive: number // 0..1 — how strongly the user is interacting (idle decay)
  scrollY: number
  scrollVel: number // px/s, smoothed + clamped
  scrollActive: number // 0..1 — based on scroll velocity
  idle: number // 0..1 — 1 when the cursor has been still
  section: PassiveSection // section currently in viewport
  sectionEnteredAt: number // performance.now() of last section change
  disabled: boolean // prefers-reduced-motion
}

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))

const damp = (v: number, target: number, rate: number, dt: number) =>
  v + (target - v) * (1 - Math.exp(-rate * dt))

const passive: PassiveState = {
  cursorX: 0,
  cursorY: 0,
  velX: 0,
  velY: 0,
  cursorActive: 0,
  scrollY: 0,
  scrollVel: 0,
  scrollActive: 0,
  idle: 1,
  section: null,
  sectionEnteredAt: 0,
  disabled: false,
}

let started = false
let lastTime = 0
let tX = 0
let tY = 0
let lastSX = 0
let lastSY = 0
let lastMoveAt = -Infinity
let smoothVelX = 0
let smoothVelY = 0
let lastScrollY = 0
let smoothScrollVel = 0

const IDLE_AFTER_MS = 1600

function onPointerMove(e: PointerEvent) {
  tX = (e.clientX / window.innerWidth) * 2 - 1
  tY = (e.clientY / window.innerHeight) * 2 - 1
  lastMoveAt = performance.now()
}

function onScroll() {
  passive.scrollY = window.scrollY || document.documentElement.scrollTop || 0
}

function tick(now: number) {
  requestAnimationFrame(tick)
  if (lastTime === 0) {
    lastTime = now
    return
  }
  const dt = Math.min(64, now - lastTime) / 1000
  lastTime = now

  if (passive.disabled) {
    passive.cursorX = 0
    passive.cursorY = 0
    passive.velX = 0
    passive.velY = 0
    passive.cursorActive = 0
    passive.scrollVel = 0
    passive.scrollActive = 0
    passive.idle = 1
    return
  }

  // smooth cursor toward target (exponential decay)
  passive.cursorX = damp(passive.cursorX, tX, 8, dt)
  passive.cursorY = damp(passive.cursorY, tY, 8, dt)

  // cursor velocity in px/s, smoothed + clamped
  const vx = ((passive.cursorX - lastSX) * window.innerWidth) / Math.max(dt, 0.001)
  const vy = ((passive.cursorY - lastSY) * window.innerHeight) / Math.max(dt, 0.001)
  lastSX = passive.cursorX
  lastSY = passive.cursorY
  smoothVelX = damp(smoothVelX, clamp(vx, -600, 600), 9, dt)
  smoothVelY = damp(smoothVelY, clamp(vy, -600, 600), 9, dt)
  passive.velX = smoothVelX
  passive.velY = smoothVelY

  // idle — response decays after the cursor stops
  const idleTarget = performance.now() - lastMoveAt > IDLE_AFTER_MS ? 1 : 0
  passive.idle = damp(passive.idle, idleTarget, idleTarget > passive.idle ? 3 : 5, dt)
  passive.cursorActive = 1 - passive.idle

  // scroll velocity in px/s, smoothed + clamped
  const sv = (passive.scrollY - lastScrollY) / Math.max(dt, 0.001)
  lastScrollY = passive.scrollY
  smoothScrollVel = damp(smoothScrollVel, clamp(sv, -6000, 6000), 5, dt)
  passive.scrollVel = smoothScrollVel
  passive.scrollActive = clamp(Math.abs(smoothScrollVel) / 1800, 0, 1)
}

export function startPassiveMotion() {
  if (started || typeof window === 'undefined') return
  started = true
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
  passive.disabled = mq.matches
  try {
    mq.addEventListener('change', (e) => {
      passive.disabled = e.matches
    })
  } catch {
    mq.addListener?.((e) => {
      passive.disabled = e.matches
    })
  }
  window.addEventListener('pointermove', onPointerMove, { passive: true })
  window.addEventListener('scroll', onScroll, { passive: true })
  passive.scrollY = window.scrollY || 0
  lastScrollY = passive.scrollY
  requestAnimationFrame(tick)
}

export function setPassiveSection(section: Exclude<PassiveSection, null>) {
  if (passive.section === section) return
  passive.section = section
  passive.sectionEnteredAt = performance.now()
}

export function getPassive(): PassiveState {
  return passive
}
