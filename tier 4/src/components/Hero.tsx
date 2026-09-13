"use client";

import { useRef } from "react";
import Link from "next/link";
import HeroLeaf from "./hero/HeroLeaf";

// Rebuilt to match monstera-dark.png's actual proportions: the leaf
// dominates roughly the right half-to-two-thirds of the viewport height
// (not a modest overlay), and the headline is genuinely massive (250px+)
// with the leaf sitting ABOVE it in z-order — since it's a real
// transparent-PNG cutout, that alone gives "partially in front, partially
// behind" for free: leaf pixels cover the type where they overlap, the
// type reads clearly through the leaf's own negative space everywhere
// else. Headline/subtext/CTAs stay centered, per the corrective brief.
export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section
      id="top"
      ref={sectionRef}
      className="relative flex min-h-[100svh] w-full items-center justify-center overflow-hidden bg-bg"
    >
      <div className="section-pad relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center px-6">
        <div className="relative flex w-full items-center justify-center h-[58vh] sm:h-[62vh] md:h-[66vh]">
          <HeroLeaf
            sectionRef={sectionRef}
            className="pointer-events-none absolute right-0 top-1/2 z-20 h-[92%] w-[70%] -translate-y-1/2 sm:w-[62%] md:right-[2%] md:w-[52%]"
          />
          <h1 className="font-display relative z-10 whitespace-nowrap text-center text-cream leading-none text-[clamp(3.5rem,19vw,20rem)]">
            Verde Noir
          </h1>
          {/* Description now lives inside the leaf/headline zone itself —
              right side, offset below the headline's cap-height band so
              it doesn't collide with the giant glyphs, layered above the
              (now translucent) leaf so it stays legible over it. */}
          <p className="absolute right-0 top-[74%] z-30 max-w-[13rem] -translate-y-1/2 text-left text-sm leading-relaxed text-cream-dim sm:max-w-[15rem] sm:text-base md:right-[3%] md:max-w-[17rem]">
            Real houseplants, hand-picked and root-checked before they ship.
            No filler, no yellowing leaves hiding in the back row.
          </p>
        </div>

        <div className="relative z-10 mt-10 flex w-full flex-col items-center gap-3 sm:flex-row sm:justify-start">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 rounded-full bg-gold px-7 py-3 text-sm font-medium text-bg transition-colors hover:bg-gold-bright"
          >
            Shop the Collection
          </Link>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 rounded-full border border-cream/25 px-7 py-3 text-sm text-cream transition-colors hover:border-gold hover:text-gold-bright"
          >
            Go to Store
          </Link>
        </div>
      </div>
    </section>
  );
}
