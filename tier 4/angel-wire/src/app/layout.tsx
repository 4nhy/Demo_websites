import type { Metadata, Viewport } from "next";
import { Fraunces, Hanken_Grotesk, Fragment_Mono } from "next/font/google";
import SmoothScroll from "@/components/SmoothScroll";
import { CartProvider } from "@/context/CartContext";
import SiteHeader from "@/components/layout/SiteHeader";
import BagDrawer from "@/components/bag/BagDrawer";
import "./globals.css";

// Display face: re-derived from the actual references (not "Y2K" as a vibe).
// pink-y2k-shoe and velvet-archive both use an elegant romantic serif;
// rewear-thrift uses a bold, high-contrast vintage-poster serif. None of the
// three use a rounded bubble sans — Fredoka (the previous choice) had no
// basis in the references at all. Fraunces is a real, distinctive variable
// serif (opsz/SOFT/WONK/wght axes) that legitimately spans both registers —
// restrained italic at low weight, characterful and slightly wonky at heavy
// weight/large size — in one family. Hanken Grotesk (body) and Fragment Mono
// (utility) are unchanged; the complaint was about the display face.
const display = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "600", "900"],
  style: ["normal", "italic"],
});

const body = Hanken_Grotesk({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const mono = Fragment_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "ANGEL WIRE",
  description: "One-of-one thrift and vintage.",
};

// Matches manifest.ts's theme_color — chrome-white, the dark ground the
// palette is built on — so mobile browser chrome (address bar) doesn't
// default to white against a black page.
export const viewport: Viewport = {
  themeColor: "#0b0b0e",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <CartProvider>
          <SmoothScroll>
            <SiteHeader />
            {children}
            <BagDrawer />
          </SmoothScroll>
        </CartProvider>
      </body>
    </html>
  );
}
