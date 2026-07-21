import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Schibsted_Grotesk, Inter, JetBrains_Mono, Poppins } from "next/font/google";
import { SITE_URL, buildKeywords } from "@/lib/seo";
import { getPublicSettings, getPortfolioCached } from "@/lib/portfolio-service";
import { WebAnalytics } from "@/components/analytics/WebAnalytics";
import "./globals.css";

/** Server-render the admin's default theme so Light mode isn't a post-hydration flash. */
async function resolveBoot(): Promise<{ theme: "dark" | "light"; animations: boolean }> {
  try {
    const s = await getPublicSettings();
    return {
      theme: s.defaultTheme === "light" ? "light" : "dark",
      animations: s.toggles.animations,
    };
  } catch {
    return { theme: "dark", animations: true };
  }
}

/**
 * Runs before first paint, from the document head so it applies to every route
 * (the homepage and the blog alike) rather than only where it is rendered:
 * a returning visitor's saved theme wins over the server default without a
 * flash, the admin's animation toggle is honoured, and an already-played intro
 * never replays.
 */
function bootScript(animations: boolean) {
  return `document.documentElement.dataset.animations=${JSON.stringify(animations ? "on" : "off")};try{var t=localStorage.getItem("mi-theme");if(t==="dark"||t==="light")document.documentElement.setAttribute("data-theme",t)}catch(e){}try{if(sessionStorage.getItem("mi-intro-seen")==="1")document.documentElement.dataset.intro="seen"}catch(e){}`;
}

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const schibstedGrotesk = Schibsted_Grotesk({
  variable: "--font-schibsted",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["500"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0D0F1A" },
    { media: "(prefers-color-scheme: light)", color: "#F4F5F8" },
  ],
};

/**
 * Sitewide defaults come from the CMS so "Site title" and "SEO description" in
 * the admin govern every route — including the blog and its `%s | name`
 * title template — rather than only the homepage.
 */
export async function generateMetadata(): Promise<Metadata> {
  const portfolio = await getPortfolioCached();
  const { settings, about } = portfolio;

  return {
    metadataBase: new URL(SITE_URL),
    applicationName: about.name,
    referrer: "origin-when-cross-origin",

    title: {
      default: settings.siteTitle,
      template: `%s | ${about.name}`,
    },

    description: settings.seoDescription,
    keywords: buildKeywords(portfolio),

    authors: [{ name: about.name, url: SITE_URL }],
    creator: about.name,
    publisher: about.name,

    alternates: { canonical: "/" },

    openGraph: {
      title: settings.siteTitle,
      description: settings.seoDescription,
      url: SITE_URL,
      siteName: about.name,
      locale: "en_US",
      type: "website",
    },

    twitter: {
      card: "summary_large_image",
      title: settings.siteTitle,
      description: settings.seoDescription,
    },

    ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
      ? { verification: { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION } }
      : {}),

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },

    category: "technology",
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const boot = await resolveBoot();
  return (
    <html
      lang="en"
      data-theme={boot.theme}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${spaceGrotesk.variable} ${schibstedGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} ${poppins.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript(boot.animations) }} />
      </head>
      <body>
        {children}
        <WebAnalytics />
      </body>
    </html>
  );
}
