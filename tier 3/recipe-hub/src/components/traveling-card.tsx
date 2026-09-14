"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { getGsap, prefersReducedMotion } from "@/lib/gsap";

interface TravelingCardProps {
  /** "dock" settles into a small persistent corner card; "fade" dissolves it. */
  endState?: "dock" | "fade";
}

const INGREDIENTS = [
  "Browse by Cuisine",
  "How It Works",
  "Featured Recipes",
  "Get Recipes (newsletter)",
];

const METHOD = [
  "Start with what's in season — scroll on.",
  "Pick a cuisine, or skip straight to the grid.",
  "Filter by diet and time until one recipe's left.",
  "Read the card. Cook. Done.",
];

/**
 * The hero's signature element: an oversized recipe index card that travels
 * continuously with scroll across the *entire* page — not pinned. One GSAP
 * timeline, scrubbed to total document scroll distance (trigger:
 * document.documentElement), so it never pauses or snaps between beats.
 * Each leg eases with power2.inOut for arc quality; the scrub's own lag
 * (0.6) is what keeps it feeling scroll-connected rather than autoplaying.
 *
 * Static in normal flow by default (mobile, reduced-motion, no-JS); only
 * promoted to a scroll-driven `position: fixed` overlay on md+ viewports
 * when motion is allowed.
 */
export default function TravelingCard({ endState = "dock" }: TravelingCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    if (prefersReducedMotion()) return; // static in its natural hero spot.

    const { gsap } = getGsap();
    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      gsap.set(card, {
        position: "fixed",
        top: "48%",
        left: "50%",
        xPercent: -50,
        yPercent: -50,
        rotation: -2,
        scale: 1,
        opacity: 1,
      });

      const ease = "power2.inOut";
      const tl = gsap.timeline({
        scrollTrigger: {
          // No trigger element — document.documentElement/body are
          // unreliable as ScrollTrigger triggers (degenerate offset math).
          // Explicit numeric bounds scrub the timeline to the whole page's
          // actual scrollable range instead.
          start: 0,
          end: () =>
            document.documentElement.scrollHeight - window.innerHeight,
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      });

      // Hero → stat strip: quick shrink, slides right, tilts.
      tl.to(card, { left: "74%", top: "42%", scale: 0.58, rotation: 5, ease })
        // → Browse by cuisine: tucks smaller toward the corner.
        .to(card, { left: "88%", top: "24%", scale: 0.3, rotation: -5, ease })
        // → Seasonal picks: quick small dart down-right, low profile.
        .to(card, { left: "82%", top: "55%", scale: 0.2, rotation: 10, ease, duration: 0.7 })
        // → How it works, beat 1: zoom-in, centers, flattens rotation.
        .to(card, { left: "50%", top: "45%", scale: 0.9, rotation: 0, ease })
        // → How it works, beat 2: settles tucked upper-left.
        .to(card, { left: "14%", top: "20%", scale: 0.35, rotation: -8, ease })
        // → Ingredient Spotlight: slow drift across the bottom, small, faded.
        .to(card, {
          left: "70%",
          top: "82%",
          scale: 0.2,
          rotation: 6,
          opacity: 0.5,
          ease,
          duration: 1.3,
        })
        // → Cook's Notes: quick snap-rotation nod, stays roughly in place.
        .to(card, { rotation: -6, opacity: 0.6, ease, duration: 0.5 })
        // → Featured carousel: left-to-right sweep, small, subtle tilt.
        .to(card, { left: "88%", top: "60%", scale: 0.25, rotation: 4, opacity: 0.7, ease })
        // → Signup band: zoom-return beat, centered, rotation resets.
        .to(card, { left: "50%", top: "50%", scale: 0.6, rotation: 0, opacity: 1, ease, duration: 0.8 })
        // → Footer: final settle or fade.
        .to(
          card,
          endState === "fade"
            ? { left: "50%", top: "50%", scale: 0.15, rotation: 0, opacity: 0.2, ease, duration: 0.8 }
            : { left: "90%", top: "85%", scale: 0.15, rotation: 3, opacity: 1, ease, duration: 0.8 }
        );

      return () => {
        tl.scrollTrigger?.kill();
        tl.kill();
        gsap.set(card, { clearProps: "all" });
      };
    });

    return () => mm.revert();
  }, [endState]);

  return (
    <div
      ref={cardRef}
      className="relative z-30 mx-auto w-[min(88vw,26rem)] rounded-sm bg-paper px-7 py-8 text-ink shadow-[0_24px_60px_-16px_rgba(0,0,0,0.55)]"
      style={{
        clipPath:
          "polygon(0% 1%,3% 0%,7% 1.5%,11% 0%,15% 1%,19% 0%,23% 1.2%,27% 0%,31% 1%,35% 0%,39% 1.3%,43% 0%,47% 1%,51% 0%,55% 1.2%,59% 0%,63% 1%,67% 0%,71% 1.3%,75% 0%,79% 1%,83% 0%,87% 1.2%,91% 0%,95% 1%,100% 0%,100% 100%,0% 100%)",
      }}
    >
      <p className="text-[0.7rem] font-bold tracking-[0.15em] text-muted">
        No. 001
      </p>
      <h1 className="mt-2 font-display text-2xl font-semibold text-balance sm:text-3xl">
        Cook what the season gives you.
      </h1>
      <p className="mt-1.5 text-xs text-muted">
        Serves: everyone hungry &middot; Prep: about 30 seconds of scrolling
      </p>

      <div className="mt-5 border-t border-dashed border-line pt-4">
        <p className="text-[0.7rem] font-bold tracking-[0.12em] text-terracotta uppercase">
          Ingredients
        </p>
        <ul className="mt-2 flex flex-col gap-1.5">
          {INGREDIENTS.map((item) => (
            <li key={item} className="flex items-center gap-2.5 text-sm">
              <span
                aria-hidden
                className="inline-block size-3 shrink-0 rounded-[2px] border border-ink/35"
              />
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-5 border-t border-dashed border-line pt-4">
        <p className="text-[0.7rem] font-bold tracking-[0.12em] text-terracotta uppercase">
          Method
        </p>
        <ol className="mt-2 flex flex-col gap-1.5">
          {METHOD.map((step, i) => (
            <li key={step} className="flex gap-2.5 text-sm text-ink/80">
              <span className="font-display text-muted">0{i + 1}.</span>
              {step}
            </li>
          ))}
        </ol>
      </div>

      <Link
        href="/recipes"
        className="mt-6 inline-block text-sm font-semibold text-terracotta hover:underline"
      >
        Or just start filtering →
      </Link>
    </div>
  );
}
