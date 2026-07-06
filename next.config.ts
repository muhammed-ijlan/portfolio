import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
  },
  async redirects() {
    return [
      // Serve one canonical host: www duplicates the site and shows up in
      // Search Console as "Alternate page with proper canonical tag".
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.ijlan.dev" }],
        destination: "https://ijlan.dev/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
