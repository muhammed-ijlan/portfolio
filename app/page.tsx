import { ThemeProvider } from "@/components/ui/ThemeProvider";
import { Nav } from "@/components/layout/Nav";
import { CursorGlow } from "@/components/layout/CursorGlow";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { Intro } from "@/components/layout/Intro";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Experience } from "@/components/sections/Experience";
import { Skills } from "@/components/sections/Skills";
import { Projects } from "@/components/sections/Projects";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <ThemeProvider>
      <Intro />
      <ScrollProgress />
      <CursorGlow />

      <div className="bg-atmosphere" />
      <div className="bg-grid" />
      <div className="bg-noise" />

      <a href="#about" className="skip-link">Skip to content</a>
      <Nav />

      <main id="main" style={{ position: "relative", zIndex: 2 }}>
        <Hero />
        <About />
        <Experience />
        <Skills />
        <Projects />
        <Contact />
      </main>

      <Footer />
    </ThemeProvider>
  );
}
