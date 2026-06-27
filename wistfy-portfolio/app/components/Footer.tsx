'use client'

import { Heart, ArrowUp } from 'lucide-react'

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="relative border-t border-dark-3 px-6 py-12">
      <button
        onClick={scrollToTop}
        className="group absolute -top-5 left-1/2 -translate-x-1/2 flex size-10 items-center justify-center rounded-full border border-dark-3 bg-dark-2 transition-all hover:border-primary hover:glow"
        aria-label="Scroll to top"
      >
        <ArrowUp size={16} className="text-gray-text transition-colors group-hover:text-primary" />
      </button>

      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-8 md:flex-row">
        <div>
          <span className="text-2xl font-bold">
            <span className="text-gradient">Wistfy</span>
          </span>
        </div>

        <div className="flex items-center gap-6">
          <Social icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
              <path d="M9 18c-4.51 2-5-2-7-2" />
            </svg>
          } />
          <Social icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
              <rect width="4" height="12" x="2" y="9" />
              <circle cx="4" cy="4" r="2" />
            </svg>
          } />
          <Social icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
              <path d="M4 20l6.768 -6.768m2.46 -2.46L20 4" />
            </svg>
          } />
        </div>

        <div className="flex flex-col items-center gap-1 text-center md:items-end md:text-right">
          <p className="flex items-center gap-1 text-sm text-gray-text">
            Made with <Heart size={13} className="text-primary" /> by Wistfy
          </p>
          <p className="text-xs text-gray-text">
            &copy; {new Date().getFullYear()} All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

function Social({ icon }: { icon: React.ReactNode }) {
  return (
    <a
      href="#"
      className="flex size-9 items-center justify-center rounded-lg bg-dark-3 text-gray-text transition-all hover:bg-primary/20 hover:text-primary hover:glow"
    >
      {icon}
    </a>
  )
}
