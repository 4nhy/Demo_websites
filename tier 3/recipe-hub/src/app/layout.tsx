import type { Metadata } from "next";
import { Fraunces, Nunito_Sans } from "next/font/google";
import SmoothScroll from "@/components/smooth-scroll";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  axes: ["opsz", "SOFT"],
});

const nunitoSans = Nunito_Sans({
  variable: "--font-nunito",
  subsets: ["latin"],
  display: "swap",
});

const description =
  "Browse recipes by cuisine, diet, and time — then cook from a clear, properly written recipe page.";

export const metadata: Metadata = {
  metadataBase: new URL("https://recipehub.example"),
  title: {
    default: "Recipe Hub",
    template: "%s · Recipe Hub",
  },
  description,
  openGraph: {
    siteName: "Recipe Hub",
    title: "Recipe Hub",
    description,
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Recipe Hub",
    description,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${nunitoSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bone text-ink">
        <SmoothScroll />
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
