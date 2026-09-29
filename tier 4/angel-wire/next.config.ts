import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // All product/hero imagery is real JPG/PNG under public/images — not
    // user-uploaded content — served through next/image's optimizer.
    // AVIF first, WebP as the fallback for browsers that don't support it;
    // Next negotiates via Accept headers automatically.
    formats: ["image/avif", "image/webp"],
    dangerouslyAllowSVG: true,
    contentDispositionType: "inline",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
