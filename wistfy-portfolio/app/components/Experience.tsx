'use client'

import { useEffect } from 'react'
import { useSystem } from '@/app/system/SystemProvider'
import VirtualWorld from '@/app/components/world/VirtualWorld'
import BootSequence from '@/app/components/system/BootSequence'
import CustomCursor from '@/app/components/system/CustomCursor'
import SystemLog from '@/app/components/system/SystemLog'
import { HudTop, HudRail, useActiveModule } from '@/app/components/system/Hud'
import MobileNav from '@/app/components/system/MobileNav'
import Scanlines from '@/app/components/system/Scanlines'
import EasterEggs from '@/app/components/system/EasterEggs'
import Hero from '@/app/components/Hero'
import ProjectGrid from '@/app/components/projects/ProjectGrid'
import ProjectDetail from '@/app/components/projects/ProjectDetail'
import About from '@/app/components/About'
import Skills from '@/app/components/Skills'
import Contact from '@/app/components/Contact'
import Footer from '@/app/components/Footer'

export default function Experience() {
  const { booted } = useSystem()
  useActiveModule()

  useEffect(() => {
    if (booted) {
      document.body.classList.add('custom-cursor')
    }
  }, [booted])

  return (
    <>
      <Scanlines />
      <CustomCursor />
      <EasterEggs />

      {!booted && <BootSequence />}

      <VirtualWorld />
      <HudTop />
      <HudRail />
      <MobileNav />
      <SystemLog />

      <main className="relative z-10">
        <Hero />
        <ProjectGrid />
        <About />
        <Skills />
        <Contact />
        <Footer />
      </main>

      <ProjectDetail />
    </>
  )
}