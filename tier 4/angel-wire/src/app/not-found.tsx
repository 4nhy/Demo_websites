import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Not Found — ANGEL WIRE",
};

/**
 * Real 404, in-voice — replaces Next's stock "This page could not be
 * found." default. Reuses the exact empty-state pattern already proven on
 * the empty-bag and no-recent-order states (mono eyebrow, italic Fraunces
 * line, one CTA back into Shop) rather than inventing a new layout for a
 * page almost nobody stays on. The copy leans on the same "one of one, gone
 * for good" logic the rest of the site already uses for sold-out pieces —
 * a missing URL reads as just another thing that isn't here anymore.
 */
export default function NotFound() {
  return (
    <main className="flex min-h-[70svh] flex-col items-center justify-center px-6 py-24 text-center sm:px-10">
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-bubblegum/70">
        Edt. 404 — Not Found
      </p>
      <h1 className="mt-3 font-display text-[clamp(2.2rem,7vw,3.6rem)] italic leading-[0.95] text-grape-ink">
        This one&apos;s already gone.
      </h1>
      <p className="mt-3 max-w-sm font-mono text-[10px] uppercase tracking-[0.14em] text-grape-ink/70">
        No. 404 · One of One
        <br />
        Never Restocked
      </p>
      <Link
        href="/shop"
        className="mt-8 inline-flex items-center gap-2 border border-grape-ink bg-grape-ink px-8 py-3 text-xs font-medium uppercase tracking-[0.18em] text-chrome-white transition-colors duration-200 hover:bg-grape-ink/90"
      >
        Browse the Archive
        <span aria-hidden="true">→</span>
      </Link>
    </main>
  );
}
