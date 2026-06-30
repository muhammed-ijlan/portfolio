import type { Metadata } from "next";
import { ThemeProvider } from "@/components/ui/ThemeProvider";
import { Nav } from "@/components/layout/Nav";
import { CursorGlow } from "@/components/layout/CursorGlow";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { Intro } from "@/components/layout/Intro";
import { Maintenance } from "@/components/layout/Maintenance";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Experience } from "@/components/sections/Experience";
import { Skills } from "@/components/sections/Skills";
import { Projects } from "@/components/sections/Projects";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { getPortfolioCached } from "@/lib/portfolio-service";
import { SITE_URL, buildKeywords, buildJsonLd, jsonLdScript } from "@/lib/seo";

export const revalidate = 120;

export async function generateMetadata(): Promise<Metadata> {
  const portfolio = await getPortfolioCached();
  const { settings, about } = portfolio;
  const [firstName, ...rest] = about.name.split(" ");
  return {
    title: settings.siteTitle,
    description: settings.seoDescription,
    keywords: buildKeywords(portfolio),
    authors: [{ name: about.name, url: SITE_URL }],
    creator: about.name,
    publisher: about.name,
    category: "technology",
    alternates: { canonical: "/" },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    openGraph: {
      type: "profile",
      firstName,
      lastName: rest.join(" "),
      username: "ijlan",
      url: SITE_URL,
      siteName: about.name,
      title: settings.siteTitle,
      description: settings.seoDescription,
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: settings.siteTitle,
      description: settings.seoDescription,
    },
  };
}

export default async function Home() {
  const portfolio = await getPortfolioCached();
  const { about, projects, experience, skills, settings, contact } = portfolio;
  const { toggles } = settings;

  if (toggles.maintenance) return <Maintenance settings={settings} />;

  const ga4Id = process.env.NODE_ENV === "production" ? settings.ga4MeasurementId : "";

  return (
    <ThemeProvider defaultTheme={settings.defaultTheme} accent={settings.accent}>
      {ga4Id && <GoogleAnalytics id={ga4Id} />}
      {}
      <script
        dangerouslySetInnerHTML={{
          __html: `document.documentElement.dataset.animations=${JSON.stringify(toggles.animations ? "on" : "off")}`,
        }}
      />
      {}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(buildJsonLd(portfolio)) }}
      />
      <Intro />
      <ScrollProgress />
      {toggles.customCursor && <CursorGlow />}

      <div className="bg-atmosphere" />
      <div className="bg-grid" />
      <div className="bg-noise" />

      <a href="#about" className="skip-link">Skip to content</a>
      <Nav />

      <main id="main" style={{ position: "relative", zIndex: 2 }}>
        <Hero about={about} resumeUrl={toggles.showResume ? settings.resumeUrl : ""} />
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
