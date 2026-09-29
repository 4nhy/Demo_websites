"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const ease = gsap.parseEase("power2.inOut");
const settle = gsap.parseEase("back.out(1.15)");
function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}
function windowT(progress: number, start: number, end: number) {
  return ease(Math.min(1, Math.max(0, (progress - start) / (end - start))));
}

/**
 * Section 8 — Finale. "The Last Tag": a single physical object, not a
 * sequence — every prior section moved several things through the frame
 * (scattered products, a curtain, a pinned row, four looks, nine frames, six
 * lines). This is the one composition on the page where nothing enters
 * after the first thing, nothing cycles, nothing scrolls past. One garment
 * swing tag — the same catalogue-tag object used since the Hero
 * ("NO. 001 · ONE OF ONE") — settles to rest in generous negative space,
 * like it was just tied on.
 *
 * Deliberately NOT pinned, unlike every earlier section. Two reasons: (1) a
 * pin/scrub set-piece for the very last thing on the page would read as
 * "another section," not an ending — the scroll-scrubbed language should
 * stop, not climax again. (2) technically, a pinned (position:sticky)
 * element's document position is only stable while "unstuck"; it shifts by
 * its own pin-range once the user has actually scrolled into it. That's
 * invisible for a mid-path wire crossing, but fatal for this section's
 * whole point — the wire's real terminus has to land exactly in the tag's
 * punched hole. A plain scroll-into-view reveal (trigger without pin) keeps
 * this section's layout in normal flow the entire time, so the hole's
 * document position is simply constant and the wire lands there for real.
 *
 * The wire's real terminus lands here, additively: `finale-knot` is the new
 * last entry in AngelWire's own anchor list, which is exactly the id its
 * existing (untouched) terminus-knot logic already uses to place the dot.
 * The anchor sits nested inside the punched hole itself, at the tag's own
 * `transform-origin` point — a rotate/scale animation can never move its
 * own origin, so the anchor stays correctly placed through the whole settle
 * even while the tag around it is animating.
 *
 * Reduced motion freezes at progress=1 — valid here, same reasoning as
 * Manifesto: there is only ever one final reading of this section.
 */
export default function FinaleTag() {
  const [cinematic, setCinematic] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const tagRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const creditsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    function applyPreference() {
      setCinematic(!reducedQuery.matches);
    }
    applyPreference();
    reducedQuery.addEventListener("change", applyPreference);
    return () => reducedQuery.removeEventListener("change", applyPreference);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const tag = tagRef.current;
    const cta = ctaRef.current;
    const credits = creditsRef.current;
    if (!section || !tag || !cta || !credits) return;

    // Pivots around its punched hole (transform-origin: top center) rather
    // than translating — a real tag on a string swings from its attachment
    // point. That also keeps the hole at a constant screen position through
    // the whole settle.
    function apply(progress: number) {
      const settleP = settle(windowT(progress, 0, 0.7));
      const rotate = lerp(-16, -2.5, settleP);
      const scale = lerp(0.88, 1, settleP);
      const opacity = windowT(progress, 0, 0.3);
      tag!.style.transform = `rotate(${rotate}deg) scale(${scale})`;
      tag!.style.opacity = String(opacity);

      const secondaryP = windowT(progress, 0.55, 1);
      cta!.style.opacity = String(secondaryP);
      cta!.style.transform = `translateY(${lerp(14, 0, secondaryP)}px)`;
      credits!.style.opacity = String(windowT(progress, 0.7, 1));
    }

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!cinematic || reduced) {
      apply(1);
      return;
    }

    apply(0);
    const st = ScrollTrigger.create({
      trigger: section,
      start: "top 80%",
      end: "top 28%",
      scrub: 0.5,
      onUpdate: (self) => apply(self.progress),
    });

    const refreshId = requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      cancelAnimationFrame(refreshId);
      st.kill();
    };
  }, [cinematic]);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-x-hidden bg-chrome-white px-6 py-24 sm:px-10"
    >
      {/* the tag rotates through its settle (-16deg to -2.5deg); a rotated
          tall box has a wider axis-aligned bounding box than its own width,
          and that leaks into the page's horizontal scroll extent even while
          this section is off-screen below the fold, unless clipped here. No
          position:sticky on this section (removed in the wire-alignment
          fix), so overflow-x-hidden carries no stacking-context risk. */}
      <p className="absolute left-6 top-8 font-mono text-[10px] uppercase tracking-[0.18em] text-grape-ink/70 sm:left-10 sm:top-10">
        Edt. 08 — Finale
        <span data-wire-anchor="finale-start" className="wire-anchor -left-2 top-0" />
      </p>

      {/* stable waypoint — never transformed. The wire approaches from
          below (back layer) before reaching the tag's punched hole. */}
      <span data-wire-anchor="finale-behind" className="wire-anchor left-1/2 top-[62%]" />

      <div ref={tagRef} className="relative z-[2] origin-top opacity-0">
        {/* soft static glow around the wire's actual terminus point — gives
            the existing small knot dot the weight of a finale without
            touching AngelWire's own rendering. Sits at the same
            transform-origin point as the hole below, so it's exempt from
            the "never inside transformed content" rule the same way the
            anchor is: a rotate/scale cannot move its own origin point. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-0 z-[1] h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,_rgba(245,246,248,0.35)_0%,_transparent_70%)]"
        />
        <div className="relative w-[78vw] max-w-[360px] border-[3px] border-[#d8d4c8] bg-chrome-white px-7 pb-8 pt-12 text-center shadow-[0_30px_60px_-20px_rgba(28,10,13,0.4)]">
          {/* punched hole + grommet — sits exactly at tagRef's
              transform-origin (origin-top = 50% 0%), which is why the
              anchor nested inside it stays correctly placed through the
              whole settle: a rotate/scale cannot move its own origin. */}
          <span className="absolute left-1/2 top-0 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-acid-lime bg-chrome-white">
            <span
              data-wire-anchor="finale-knot"
              className="wire-anchor left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            />
          </span>

          <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-grape-ink/70">Archive Vol. I</p>
          <p className="chrome-text mt-3 font-display text-[clamp(2.4rem,8vw,3.6rem)] font-black leading-[0.95]">
            ANGEL
            <br />
            WIRE
          </p>
          <p className="mt-4 font-display text-lg italic text-grape-ink/80">
            That&apos;s the whole rack. For now.
          </p>
          <div className="mx-auto mt-5 h-px w-12 bg-grape-ink/15" />
          <p className="mt-5 font-mono text-[9px] uppercase tracking-[0.16em] text-grape-ink/70">
            No. 021 · One of One
            <br />
            Never Restocked
          </p>
        </div>
      </div>

      <div ref={ctaRef} className="relative z-[2] mt-10 opacity-0">
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 border border-grape-ink bg-grape-ink px-8 py-3 text-xs font-medium uppercase tracking-[0.18em] text-chrome-white transition-colors duration-200 hover:bg-grape-ink/90"
        >
          Enter the Shop
          <span aria-hidden="true">→</span>
        </Link>
      </div>

      <div
        ref={creditsRef}
        className="absolute inset-x-6 bottom-6 z-[2] flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.14em] text-grape-ink/70 opacity-0 sm:inset-x-10 sm:bottom-10"
      >
        <span>Shot on the last roll.</span>
        <span>End of Archive Vol. I.</span>
      </div>
    </section>
  );
}
