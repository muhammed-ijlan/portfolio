import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Muhammed Ijlan — Senior Web & Web3 Developer",
    short_name: "ijlan.dev",
    description:
      "Portfolio of Muhammed Ijlan, a Senior Web & Web3 Developer in Dubai building production-grade web applications.",
    start_url: "/",
    display: "standalone",
    background_color: "#06070A",
    theme_color: "#06070A",
    categories: ["portfolio", "technology", "development"],
    icons: [
      { src: "/icon", sizes: "512x512", type: "image/png" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
