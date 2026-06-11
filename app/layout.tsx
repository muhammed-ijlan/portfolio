import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
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

export const metadata: Metadata = {
  metadataBase: new URL("https://ijlan.dev"),

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

    url: "https://ijlan.dev",
    siteName: "ijlan.dev",
    locale: "en_US",
    type: "website",

    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Muhammed Ijlan Portfolio",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Muhammed Ijlan | Senior Web & Web3 Developer",
    description:
      "4+ years building production-grade web applications and Web3 products.",

    images: ["/og-image.jpg"],
  },

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme="dark"
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
