import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Schibsted_Grotesk, Inter, JetBrains_Mono, Poppins } from "next/font/google";
import { SITE_URL } from "@/lib/seo";
import { getPublicSettings } from "@/lib/portfolio-service";
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

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: "Muhammed Ijlan",
  referrer: "origin-when-cross-origin",

  title: {
    default: "Muhammed Ijlan | Senior Web & Web3 Developer",
    template: "%s | Muhammed Ijlan",
  },

  description:
    "Muhammed Ijlan is a Senior Web & Web3 Developer based in Dubai, specializing in Next.js, React, TypeScript, Node.js, Shopify, and modern web applications.",

  keywords: [
    "Muhammed Ijlan",
    "Ijlan",
    "Frontend Developer",
    "Web Developer",
    "Web3 Developer",
    "Next.js Developer",
    "React Developer",
    "TypeScript Developer",
    "Shopify Developer",
    "Dubai Developer",
    "Full Stack Developer",
  ],

  authors: [
    {
      name: "Muhammed Ijlan",
      url: "https://ijlan.dev",
    },
  ],

  creator: "Muhammed Ijlan",
  publisher: "Muhammed Ijlan",

  alternates: {
    canonical: "/",
  },

  openGraph: {
    title: "Muhammed Ijlan | Senior Web & Web3 Developer",
    description:
      "4+ years building production-grade web applications, eCommerce platforms, SaaS products, and Web3 solutions.",

    url: SITE_URL,
    siteName: "Muhammed Ijlan",
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Muhammed Ijlan | Senior Web & Web3 Developer",
    description:
      "4+ years building production-grade web applications and Web3 products.",
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
      <body>{children}</body>
    </html>
  );
}
