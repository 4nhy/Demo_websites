import type { MetadataRoute } from "next";

/**
 * Next's `app/manifest.ts` file convention — auto-served at
 * /manifest.webmanifest with the <link rel="manifest"> tag injected
 * automatically, same pattern as favicon.ico/apple-icon.png needing no
 * manual <head> wiring. theme-color/background-color both match
 * chrome-white, the dark ground the whole palette is built on, so browser
 * chrome (mobile address bar, PWA splash) doesn't flash a mismatched white
 * before the page paints.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ANGEL WIRE",
    short_name: "Angel Wire",
    description: "One-of-one thrift and vintage.",
    start_url: "/",
    display: "standalone",
    background_color: "#0b0b0e",
    theme_color: "#0b0b0e",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "16x16 32x32",
        type: "image/x-icon",
      },
      {
        src: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
