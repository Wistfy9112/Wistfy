import Navbar from "@/app/components/layout/Navbar";
import Footer from "@/app/components/layout/Footer";
import GridBackdrop from "@/app/components/layout/GridBackdrop";
import ScrollProgress from "@/app/components/layout/ScrollProgress";
import CursorRing from "@/app/components/layout/CursorRing";
import Hero from "@/app/components/sections/Hero";
import About from "@/app/components/sections/About";
import Work from "@/app/components/sections/Work";
import Stack from "@/app/components/sections/Stack";
import Experience from "@/app/components/sections/Experience";
import Achievements from "@/app/components/sections/Achievements";
import Lab from "@/app/components/sections/Lab";
import Contact from "@/app/components/sections/Contact";

export default function Home() {
  return (
    <>
      <GridBackdrop />
      <ScrollProgress />
      <CursorRing />
      <Navbar />
      <main id="main-content" className="relative z-10">
        <Hero />
        <About />
        <Work />
        <Stack />
        <Experience />
        <Achievements />
        <Lab />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
