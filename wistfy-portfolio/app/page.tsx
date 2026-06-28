import ThreeBackground from './components/ThreeBackground'
import ContentShell from './components/ContentShell'
import Header from './components/Header'
import Hero from './components/Hero'
import About from './components/About'
import Stats from './components/Stats'
import Skills from './components/Skills'
import Education from './components/Education'
import Projects from './components/Projects'
import Experience from './components/Experience'
import Activity from './components/Activity'
import Contact from './components/Contact'
import Footer from './components/Footer'

export default function Home() {
  return (
    <>
      <ThreeBackground />
      <ContentShell>
        <Header />
        <main>
          <Hero />
          <About />
          <Stats />
          <Skills />
          <Education />
          <Projects />
          <Experience />
          <Activity />
          <Contact />
        </main>
        <Footer />
      </ContentShell>
    </>
  )
}
