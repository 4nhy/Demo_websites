import type { Metadata } from "next";
import { Inter_Tight, IBM_Plex_Mono } from "next/font/google";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RevealController from "@/components/RevealController";
import "./globals.css";

// Sole display+body face — DIRECTION.md: Inter Tight carries the entire
// hierarchy through weight/size alone (Helvetica-class, self-hostable
// substitute for Helvetica Now).
const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
  weight: ["400", "500", "700", "800", "900"],
  display: "swap",
});

// Utility/index face — reserved strictly for index numbers, stat digits,
// tag/metadata labels. Never headlines or body copy.
const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["500"],
  display: "swap",
});

const SITE_URL = "https://theroster.example";
const SITE_DESCRIPTION =
  "The Roster — open roles at companies building real things, indexed and filtered, not buried in recruiter-speak.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "The Roster",
    template: "%s — The Roster",
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    type: "website",
    siteName: "The Roster",
    title: "The Roster",
    description: SITE_DESCRIPTION,
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: "The Roster",
    description: SITE_DESCRIPTION,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${interTight.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-paper text-ink font-sans">
        <SmoothScrollProvider>
          <Header />
          {children}
          <Footer />
          <RevealController />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
