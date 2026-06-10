import type { Metadata } from "next";
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
import { getPortfolioCached } from "@/lib/portfolio-service";

// Incrementally re-render the page so published CMS edits appear without a
// redeploy, while keeping public reads cheap. getPortfolioCached dedupes the DB
// round-trip shared by generateMetadata + the page within one request.
export const revalidate = 120;

export async function generateMetadata(): Promise<Metadata> {
  const { settings, about } = await getPortfolioCached();
  return {
    title: settings.siteTitle,
    description: settings.seoDescription,
    authors: [{ name: about.name }],
    openGraph: {
      title: settings.siteTitle,
      description: settings.seoDescription,
      type: "website",
    },
  };
}

export default async function Home() {
  const { about, projects, experience, skills, settings, contact } = await getPortfolioCached();

  return (
    <ThemeProvider defaultTheme={settings.defaultTheme} accent={settings.accent}>
      <Intro />
      <ScrollProgress />
      <CursorGlow />

      <div className="bg-atmosphere" />
      <div className="bg-grid" />
      <div className="bg-noise" />

      <a href="#about" className="skip-link">Skip to content</a>
      <Nav />

      <main id="main" style={{ position: "relative", zIndex: 2 }}>
        <Hero about={about} />
        <About about={about} />
        <Experience items={experience} />
        <Skills groups={skills} />
        <Projects items={projects} />
        <Contact contact={contact} />
      </main>

      <Footer about={about} />
    </ThemeProvider>
  );
}
