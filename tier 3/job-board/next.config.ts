import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Stock photography source for The Roster's curated + graded photo set
    // (see ASSETS.md — 16 licensed stock images, sourced at Stage 4).
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
