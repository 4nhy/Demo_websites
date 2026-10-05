import type { Metadata } from "next";
import localFont from "next/font/local";
import { IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import SmoothScroll from "@/components/SmoothScroll";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Cursor from "@/components/Cursor";
import SceneLayer from "@/components/scene/SceneLayer";
import "./globals.css";

const display = localFont({
  variable: "--font-display",
  src: [
    { path: "../fonts/ClashDisplay-400.woff2", weight: "400", style: "normal" },
    { path: "../fonts/ClashDisplay-500.woff2", weight: "500", style: "normal" },
    { path: "../fonts/ClashDisplay-600.woff2", weight: "600", style: "normal" },
    { path: "../fonts/ClashDisplay-700.woff2", weight: "700", style: "normal" },
  ],
  display: "swap",
});

const body = IBM_Plex_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const mono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Drift — Hear the altitude drop",
  description:
    "Drift One wireless headphones. 40 mm LCP drivers, 42 dB adaptive ANC, 40-hour battery, 254 g.",
};

// Runs before first paint so CSS can pick the right tier (live scene vs. stills)
// without a flash. SceneLayer re-checks and keeps it current afterwards.
const sceneTierScript = `(function(){try{var d=document.documentElement,ok=matchMedia('(min-width: 768px) and (prefers-reduced-motion: no-preference)').matches;if(ok){var g=document.createElement('canvas').getContext('webgl2');ok=!!g;if(g){var l=g.getExtension('WEBGL_lose_context');l&&l.loseContext()}}d.dataset.scene=ok?'3d':'static'}catch(e){document.documentElement.dataset.scene='static'}})()`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${display.variable} ${body.variable} ${mono.variable} antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: sceneTierScript }} />
      </head>
      <body className="min-h-screen">
        <SmoothScroll>
          <SceneLayer />
          <Header />
          <main id="main" className="relative z-10">
            {children}
          </main>
          <Footer />
          <Cursor />
        </SmoothScroll>
      </body>
    </html>
  );
}
