import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Muhammed Ijlan — Senior Web & Web3 Developer",
    short_name: "ijlan.dev",
    description:
      "Portfolio of Muhammed Ijlan, a Senior Web & Web3 Developer in Dubai building production-grade web applications.",
    start_url: "/",
    display: "standalone",
    background_color: "#0D0F1A",
    theme_color: "#0D0F1A",
    categories: ["portfolio", "technology", "development"],
    icons: [
      { src: "/logo-mark.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
