'use client'

import { useSystem, type ModuleId } from '@/app/system/SystemProvider'

const MODULES: { id: ModuleId; label: string; section: string }[] = [
  { id: 'home', label: 'HOME', section: 'module-hero' },
  { id: 'projects', label: 'PROJECTS', section: 'module-projects' },
  { id: 'about', label: 'ABOUT', section: 'module-about' },
  { id: 'skills', label: 'SKILLS', section: 'module-skills' },
  { id: 'contact', label: 'CONTACT', section: 'module-contact' },
]

export default function MobileNav() {
  const { activeModule, setActiveModule } = useSystem()

  return (
    <nav
      className="mono fixed inset-x-0 bottom-0 z-40 flex items-stretch justify-around border-t border-line bg-abyss-1/90 backdrop-blur-sm lg:hidden"
      aria-label="System modules"
    >
      {MODULES.map((mod) => {
        const active = activeModule === mod.id
        return (
          <button
            key={mod.id}
            onClick={() => {
              setActiveModule(mod.id)
              document.getElementById(mod.section)?.scrollIntoView({ behavior: 'smooth' })
            }}
            className={`flex flex-1 flex-col items-center gap-1 py-3 text-[9px] tracking-[0.15em] transition-colors ${
              active ? 'text-cyan' : 'text-ink-4'
            }`}
            aria-current={active ? 'true' : undefined}
          >
            <span
              className="block h-px w-6"
              style={{ background: active ? 'var(--accent)' : 'var(--color-ink-4)' }}
            />
            {mod.label}
          </button>
        )
      })}
    </nav>
  )
}