"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AssetImage from "@/components/product/AssetImage";
import { collections } from "@/data/collections";
import { products } from "@/data/products";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const ease = gsap.parseEase("power2.inOut");
function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}
function windowT(progress: number, start: number, end: number) {
  return ease(Math.min(1, Math.max(0, (progress - start) / (end - start))));
}

// Base tilt per card — index-matched to `collections`. A real clothesline
// doesn't hang perfectly level.
const TILTS = [-6, 4, -3, 7];

/**
 * Section 4 — Shop the Collection. Built from a specific device found by
 * re-inspecting velvet-archive: its "Shop Collections" row — four tilted
 * polaroids, each wax-sealed, on a slate backdrop. Combined with
 * rewear-thrift's literal binder clip pinning a photo, and the fact that
 * this brand is *named* after a wire: the four real collections become
 * polaroids clipped to a physical line, gold binder-clips standing in for
 * the wax seals (same material world — metal, not wax, but the same
 * "something real is holding this photo" idea).
 *
 * The camera move is horizontal this time — a pinned pan across a row wider
 * than the viewport — deliberately different from Hero/Current Drop's depth
 * pushes and Editorial Transition's reveal, so this reads as a new scene,
 * not a repeated trick. Row width is measured live (`row.scrollWidth`), not
 * guessed per breakpoint, so the pan is correct at any viewport without
 * separate mobile tuning.
 *
 * Reduced motion gets a genuinely separate static layout (grid, not a
 * frozen mid-pan strip) — every prior section's "freeze the cinematic DOM
 * at its resolved position" trick doesn't work for a *pan*: freezing at the
 * end position would leave card 1 permanently scrolled out of view with no
 * way to reach it, since the scrub that would normally reveal it is off.
 * That's an accessibility bug, not just a visual one.
 *
 * Wire anchors live on two static "clothesline post" markers that never
 * move — the cards pan past them, same solved pattern as every prior
 * section's stable-anchor / dramatic-content split.
 */
export default function CollectionsLine() {
  const [cinematic, setCinematic] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLParagraphElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

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
    const label = labelRef.current;
    const heading = headingRef.current;
    if (!label || !heading) return;

    function applyIntro(progress: number) {
      const labelP = windowT(progress, 0, 0.15);
      label!.style.opacity = String(labelP);

      const headP = windowT(progress, 0.05, 0.28);
      heading!.style.opacity = String(headP);
      heading!.style.transform = `translateY(${lerp(20, 0, headP)}px)`;
    }

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!cinematic || reduced) {
      applyIntro(1);
      return;
    }

    const track = trackRef.current;
    const row = rowRef.current;
    if (!track || !row) return;

    function applyPan(progress: number) {
      const rowW = row!.scrollWidth;
      const viewW = window.innerWidth;
      const maxShift = Math.max(0, rowW - viewW + 64);
      const startX = Math.min(viewW * 0.22, 280);
      const x = lerp(startX, -maxShift, ease(progress));
      row!.style.transform = `translateX(${x}px)`;

      const cards = row!.querySelectorAll<HTMLElement>("[data-line-card]");
      cards.forEach((card, i) => {
        const base = TILTS[i % TILTS.length];
        const sway = Math.sin(progress * Math.PI * 1.5 + i) * 2.5;
        card.style.transform = `rotate(${base + sway}deg)`;
      });
    }

    applyIntro(0);
    applyPan(0);
    const st = ScrollTrigger.create({
      trigger: track,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.5,
      onUpdate: (self) => {
        applyIntro(self.progress);
        applyPan(self.progress);
      },
    });

    const refreshId = requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      cancelAnimationFrame(refreshId);
      st.kill();
    };
  }, [cinematic]);

  return (
    // bg-chrome-white (Onyx dark, post-rebuild) not bg-grape-ink (now the
    // LIGHT ink token) — see CurrentDropScene's equivalent comment.
    <section className="relative bg-chrome-white">
      <div ref={trackRef} className={cinematic ? "relative h-[210vh] sm:h-[230vh]" : "relative"}>
        <div
          className={
            cinematic
              ? "sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden py-16"
              : "relative flex min-h-[90vh] flex-col justify-center py-20"
          }
        >
          <div className="px-6 sm:px-10">
            <p
              ref={labelRef}
              className="font-mono text-[10px] uppercase tracking-[0.18em] text-bubblegum/70"
            >
              Edt. 04 — Collections
            </p>
            <h2
              ref={headingRef}
              className="mt-2 font-display text-[clamp(2.2rem,7vw,4rem)] italic leading-[0.95] text-grape-ink"
            >
              Hang with us.
            </h2>
            <p className="mt-2 max-w-sm font-mono text-[10px] uppercase tracking-[0.14em] text-grape-ink/70">
              Four ways in. Pick your line.
            </p>
          </div>

          <div className="relative mt-12 sm:mt-16">
            {/* static clothesline posts — the wire's real anchor points,
                never transformed, the cards just pan past them (or, in the
                static layout, just sit near them). Always rendered at both
                breakpoints (never `hidden`) — a hidden anchor measures as
                (0,0) and would break the path, not just look different. */}
            <div className="pointer-events-none absolute left-[6%] top-1/2 z-[2] h-28 w-px -translate-y-1/2 bg-acid-lime/70 sm:h-40">
              <span data-wire-anchor="line-start" className="wire-anchor left-0 top-0" />
              <span data-wire-anchor="line-image-enter" className="wire-anchor left-0 top-1/2" />
            </div>
            <div className="pointer-events-none absolute right-[6%] top-1/2 z-[2] h-28 w-px -translate-y-1/2 bg-acid-lime/70 sm:h-40">
              <span data-wire-anchor="line-image-exit" className="wire-anchor left-0 top-1/2" />
            </div>

            {cinematic ? (
              <div
                ref={rowRef}
                className="flex w-max items-end gap-[6vw] px-[10vw] will-change-transform"
              >
                {collections.map((c) => (
                  <CollectionPolaroid key={c.slug} slug={c.slug} name={c.name} dataCard />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-6 px-6 sm:grid-cols-4 sm:gap-8 sm:px-10">
                {collections.map((c, i) => (
                  <div key={c.slug} style={{ transform: `rotate(${TILTS[i % TILTS.length]}deg)` }}>
                    <CollectionPolaroid slug={c.slug} name={c.name} />
                  </div>
                ))}
              </div>
            )}
          </div>

          <span data-wire-anchor="line-end" className="wire-anchor bottom-6 right-1/4" />
        </div>
      </div>
    </section>
  );
}

function CollectionPolaroid({
  slug,
  name,
  dataCard,
}: {
  slug: string;
  name: string;
  dataCard?: boolean;
}) {
  const count = products.filter((p) => p.collections.includes(slug)).length;
  return (
    <Link
      href={`/collections/${slug}`}
      {...(dataCard ? { "data-line-card": true } : {})}
      className={
        dataCard
          ? "block w-[64vw] max-w-[300px] shrink-0 bg-chrome-white p-3 pb-6 shadow-[0_20px_44px_-18px_rgba(28,10,13,0.55)] sm:w-[24vw]"
          : "block bg-chrome-white p-3 pb-6 shadow-[0_20px_44px_-18px_rgba(28,10,13,0.55)]"
      }
    >
      <div className="relative">
        {/* was a gold binder-clip gradient; silver/gunmetal per the
            dark/gothic sterling-silver palette */}
        <span className="absolute -top-4 left-1/2 z-[1] h-6 w-9 -translate-x-1/2 rounded-[2px] bg-[linear-gradient(155deg,#F5F6F8_0%,#B8BEC7_45%,#4A4E57_100%)] shadow-[0_2px_4px_rgba(28,10,13,0.4)]" />
        <AssetImage image={{ id: `COL-${slug}`, alt: `${name} collection`, ratio: "1:1" }} />
      </div>
      <p className="mt-4 font-display text-xl italic text-grape-ink">{name}</p>
      <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.12em] text-grape-ink/50">
        {count} {count === 1 ? "piece" : "pieces"}
      </p>
    </Link>
  );
}
