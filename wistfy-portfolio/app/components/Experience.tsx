'use client'

import { useEffect } from 'react'
import { useSystem } from '@/app/system/SystemProvider'
import VirtualWorld from '@/app/components/world/VirtualWorld'
import BootSequence from '@/app/components/system/BootSequence'
import CustomCursor from '@/app/components/system/CustomCursor'
import SystemLog from '@/app/components/system/SystemLog'
import { HudTop, HudRail, useActiveModule } from '@/app/components/system/Hud'
import PassiveMotionInit from '@/app/components/system/PassiveMotionInit'
import MobileNav from '@/app/components/system/MobileNav'
import Scanlines from '@/app/components/system/Scanlines'
import EasterEggs from '@/app/components/system/EasterEggs'
import Hero from '@/app/components/Hero'
import HeroGeometry from '@/app/components/geometry/HeroGeometry'
import ProjectGrid from '@/app/components/projects/ProjectGrid'
import ProjectDetail from '@/app/components/projects/ProjectDetail'
import About from '@/app/components/About'
import WorkExperience from '@/app/components/WorkExperience'
import Skills from '@/app/components/Skills'
import Education from '@/app/components/Education'
import Achievements from '@/app/components/Achievements'
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
      <PassiveMotionInit />

      {!booted && <BootSequence />}

      <VirtualWorld />
      <HeroGeometry />
      <HudTop />
      <HudRail />
      <MobileNav />
      <SystemLog />

      <main className="content-scrim relative z-10">
        <Hero />
        <ProjectGrid />
        <About />
        <WorkExperience />
        <Skills />
        <Education />
        <Achievements />
        <Contact />
        <Footer />
      </main>

      <ProjectDetail />
    </>
  )
}