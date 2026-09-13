import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import SmoothScroll from "@/components/SmoothScroll";
import Nav from "@/components/Nav";
import SignatureVine from "@/components/SignatureVine";
import CartDrawer from "@/components/cart/CartDrawer";
import CheckoutModal from "@/components/cart/CheckoutModal";

// Self-hosted (downloaded once from Fontshare's free-for-commercial-use
// API, served from public/fonts/ — not re-fetched from a CDN on every
// load). Replaces Fraunces/Inter sitewide: Erode reads distinctive next
// to Fraunces' now-ubiquitous "AI default" pairing.
const erode = localFont({
  src: [
    { path: "../../public/fonts/erode/Erode-Regular.woff2", weight: "400", style: "normal" },
    { path: "../../public/fonts/erode/Erode-Medium.woff2", weight: "500", style: "normal" },
    { path: "../../public/fonts/erode/Erode-SemiBold.woff2", weight: "600", style: "normal" },
    { path: "../../public/fonts/erode/Erode-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-erode",
  display: "optional",
});

const switzer = localFont({
  src: [
    { path: "../../public/fonts/switzer/Switzer-Regular.woff2", weight: "400", style: "normal" },
    { path: "../../public/fonts/switzer/Switzer-Medium.woff2", weight: "500", style: "normal" },
    { path: "../../public/fonts/switzer/Switzer-SemiBold.woff2", weight: "600", style: "normal" },
    { path: "../../public/fonts/switzer/Switzer-Bold.woff2", weight: "700", style: "normal" },
    { path: "../../public/fonts/switzer/Switzer-ExtraBold.woff2", weight: "800", style: "normal" },
    { path: "../../public/fonts/switzer/Switzer-Black.woff2", weight: "900", style: "normal" },
  ],
  variable: "--font-switzer",
  display: "optional",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Verde Noir — Considered Houseplants, Delivered",
    template: "%s",
  },
  description:
    "A dark-mode houseplant shop. Real photography, root-checked plants, and care notes that go past the tag.",
  openGraph: {
    title: "Verde Noir — Considered Houseplants, Delivered",
    description:
      "A dark-mode houseplant shop. Real photography, root-checked plants, and care notes that go past the tag.",
    siteName: "Verde Noir",
    images: [{ url: "/images/og-default.jpg", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Verde Noir — Considered Houseplants, Delivered",
    description:
      "A dark-mode houseplant shop. Real photography, root-checked plants, and care notes that go past the tag.",
    images: ["/images/og-default.jpg"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${erode.variable} ${switzer.variable} h-full`}
      data-theme="dark"
    >
      <body className="min-h-full bg-bg text-cream antialiased">
        <CartProvider>
          <SmoothScroll>
            <Nav />
            <SignatureVine />
            {children}
            <CartDrawer />
            <CheckoutModal />
          </SmoothScroll>
        </CartProvider>
      </body>
    </html>
  );
}
