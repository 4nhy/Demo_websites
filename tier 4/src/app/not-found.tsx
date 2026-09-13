import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Page not found — Verde Noir",
};

export default function NotFound() {
  return (
    <>
      <main className="section-pad flex min-h-[70svh] items-center bg-bg px-6 md:px-12">
        <div className="mx-auto max-w-xl text-center">
          <p className="mb-4 font-display text-7xl text-cream/15 md:text-9xl">404</p>
          <h1 className="font-display mb-4 text-3xl text-cream md:text-4xl">
            This one didn&apos;t root.
          </h1>
          <p className="mb-8 text-base leading-relaxed text-cream-dim">
            Whatever you were looking for isn&apos;t at this address — moved,
            never planted, or the link just got it wrong. It happens even in a
            well-tended shop.
          </p>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full bg-gold px-7 py-3 text-sm font-medium text-bg transition-colors hover:bg-gold-bright"
            >
              Back to the garden
            </Link>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 rounded-full border border-cream/25 px-7 py-3 text-sm text-cream transition-colors hover:border-gold hover:text-gold-bright"
            >
              Go to Shop
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
