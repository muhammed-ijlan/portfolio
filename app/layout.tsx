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
  title: "Muhammed Ijlan — Senior Web & Web3 Developer",
  description:
    "Muhammed Ijlan — Senior Web Developer (Full Stack & Web3) in Dubai. 4+ years building production-grade, high-performance web & Web3 applications.",
  keywords: ["React", "Next.js", "TypeScript", "Web3", "Full Stack", "Dubai"],
  authors: [{ name: "Muhammed Ijlan" }],
  openGraph: {
    title: "Muhammed Ijlan — Senior Web & Web3 Developer",
    description: "4+ years building production-grade web & Web3 apps.",
    type: "website",
  },
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
