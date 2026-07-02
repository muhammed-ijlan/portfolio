import { ThemeProvider } from "@/components/ui/ThemeProvider";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/sections/Footer";
import { getPortfolioCached } from "@/lib/portfolio-service";

export default async function BlogLayout({ children }: { children: React.ReactNode }) {
  const { about, settings } = await getPortfolioCached();
  return (
    <ThemeProvider defaultTheme={settings.defaultTheme} accent={settings.accent}>
      <div className="bg-atmosphere" />
      <div className="bg-grid" />
      <div className="bg-noise" />

      <Nav />

      <main id="main" style={{ position: "relative", zIndex: 2, minHeight: "70vh" }}>
        {children}
      </main>

      <Footer about={about} />
    </ThemeProvider>
  );
}
