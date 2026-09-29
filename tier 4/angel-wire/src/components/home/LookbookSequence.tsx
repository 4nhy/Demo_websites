"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AssetImage from "@/components/product/AssetImage";
import { getProductById } from "@/data/products";

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

type Look = {
  id: string;
  title: string;
  caption: string;
  collectionSlug: string;
  productIds: string[];
};

// Four looks, one per editorial collection — real products, real prices, no
// invented data. Deliberately not mapped 1:1 to Collections Line's cards:
// this is styling advice ("wear these together"), that was inventory.
const LOOKS: Look[] = [
  {
    id: "angel-hour",
    title: "Angel Hour",
    caption: "Dressed for a party that hasn't started arguing about the music yet.",
    collectionSlug: "angel-hour",
    productIds: ["aw-0008", "aw-0016", "aw-0013"],
  },
  {
    id: "after-dark",
    title: "After Dark",
    caption: "Built to survive a night you won't fully remember in the morning.",
    collectionSlug: "after-dark",
    productIds: ["aw-0001", "aw-0006", "aw-0011"],
  },
  {
    id: "soft-damage",
    title: "Soft Damage",
    caption: "Comfortable enough to cry in. Cute enough that you won't need to.",
    collectionSlug: "soft-damage",
    productIds: ["aw-0003", "aw-0007", "aw-0012"],
  },
  {
    id: "found-objects",
    title: "Found Objects",
    caption: "Nothing here started as a set. It just refused to leave without the others.",
    collectionSlug: "found-objects",
    productIds: ["aw-0004", "aw-0014", "aw-0020"],
  },
];

/**
 * Section 5 — Lookbook. The device is borrowed specifically from
 * rewear-thrift's "winter collection" row — the one place in either
 * reference that presents fashion as a *sequence of looks* rather than a
 * product grid, each paired with an itemized breakdown card — combined with
 * pink-y2k-shoe's compositing habit of setting the caption directly beside
 * the glossy hero object instead of stacking copy above a separate image
 * block.
 *
 * The interaction is new for this page: a scroll-scrubbed rack-focus depth
 * sequence. Four looks sit stacked on the Z-axis inside one pinned stage.
 * Each arrives small and transparent (far away), sharpens to full scale for
 * a readable "hold" beat — caption and edit list overlay the frame here —
 * then keeps scaling up past 1x while fading out, as if passing close by
 * camera in front of the next look arriving behind it. Z-order is driven
 * directly off each look's live scale value, so whichever look is visually
 * larger (closer) always renders on top — the two looks in a transition
 * genuinely cross through each other rather than hard-cutting.
 *
 * This is a Z-axis/scale device, deliberately distinct from Current Drop's
 * scatter-to-vitrine, Editorial Transition's curtain wipe, and Collections
 * Line's horizontal pan — each section keeps its own camera move.
 *
 * Reduced motion gets the same genuinely separate treatment as Collections
 * Line: this is a sequential reveal (different content legible at different
 * progress values), so "freeze at the resolved end state" would leave three
 * of four looks unreachable. Instead it renders a compact static stack, all
 * four looks visible in normal document flow.
 */
export default function LookbookSequence() {
  const [cinematic, setCinematic] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLParagraphElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const counterRef = useRef<HTMLParagraphElement>(null);
  const layerRefs = useRef<Array<HTMLDivElement | null>>([]);
  const captionRefs = useRef<Array<HTMLDivElement | null>>([]);

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
      const labelP = windowT(progress, 0, 0.4);
      label!.style.opacity = String(labelP);
      const headP = windowT(progress, 0.1, 0.55);
      heading!.style.opacity = String(headP);
      heading!.style.transform = `translateY(${lerp(20, 0, headP)}px)`;
    }

    applyIntro(1);

    if (!cinematic) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    // The header resolves quickly on its own short trigger, independent of
    // the much longer sequence trigger below.
    const st = ScrollTrigger.create({
      trigger: label.closest("section"),
      start: "top 85%",
      end: "top 35%",
      scrub: 0.4,
      onUpdate: (self) => applyIntro(self.progress),
    });
    applyIntro(0);
    return () => st.kill();
  }, [cinematic]);

  useEffect(() => {
    const track = trackRef.current;
    const counter = counterRef.current;
    if (!track || !cinematic) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const n = LOOKS.length;

    function apply(progress: number) {
      LOOKS.forEach((_, i) => {
        const el = layerRefs.current[i];
        const cap = captionRefs.current[i];
        if (!el) return;

        const center = (i + 0.5) / n;
        const width = 0.62 / n;
        // Clamped to >= 0: for i === 0, center - width lands slightly
        // negative, which meant `apply(0)` on mount computed a fractional
        // ~15-18% starting opacity for Look 1 instead of a true 0 — not a
        // Lighthouse sampling artifact, an actual non-zero initial render
        // state every page load hit. Clamping makes progress 0 map to a
        // real, static, fully-hidden opacity for every look, Look 1 included.
        const appearStart = Math.max(0, center - width);
        const appearHoldStart = center - width * 0.35;
        const holdEnd = center + width * 0.35;
        const disappearEnd = center + width;

        let scale: number;
        let opacity: number;
        if (progress <= appearStart) {
          scale = 0.55;
          opacity = 0;
        } else if (progress <= appearHoldStart) {
          const p = windowT(progress, appearStart, appearHoldStart);
          scale = lerp(0.55, 1, p);
          opacity = p;
        } else if (progress <= holdEnd) {
          scale = 1;
          opacity = 1;
        } else if (progress <= disappearEnd) {
          const p = windowT(progress, holdEnd, disappearEnd);
          scale = lerp(1, 1.6, p);
          opacity = p < 0.4 ? 1 : lerp(1, 0, (p - 0.4) / 0.6);
        } else {
          scale = 1.6;
          opacity = 0;
        }

        el.style.transform = `scale(${scale})`;
        el.style.opacity = String(opacity);
        el.style.zIndex = String(Math.round(scale * 1000));

        if (cap) {
          const fadeIn = windowT(progress, appearHoldStart, lerp(appearHoldStart, holdEnd, 0.5));
          const fadeOut = windowT(progress, holdEnd, lerp(holdEnd, disappearEnd, 0.35));
          const capOpacity = Math.max(0, Math.min(1, fadeIn - fadeOut));
          cap.style.opacity = String(capOpacity);
          cap.style.transform = `translateY(${lerp(18, 0, fadeIn)}px)`;
        }
      });

      if (counter) {
        const active = Math.min(n - 1, Math.floor(progress * n));
        counter.textContent = `LOOK ${String(active + 1).padStart(2, "0")} / ${String(n).padStart(2, "0")}`;
      }
    }

    apply(0);
    const st = ScrollTrigger.create({
      trigger: track,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.6,
      onUpdate: (self) => apply(self.progress),
    });

    const refreshId = requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      cancelAnimationFrame(refreshId);
      st.kill();
    };
  }, [cinematic]);

  return (
    <section className="relative bg-chrome-white">
      <div className="relative px-6 pb-4 pt-16 sm:px-10 sm:pt-24">
        <p
          ref={labelRef}
          className="font-mono text-[10px] uppercase tracking-[0.18em] text-bubblegum/70"
        >
          Edt. 05 — Lookbook
        </p>
        <h2
          ref={headingRef}
          className="mt-2 font-display text-[clamp(2.2rem,7vw,4rem)] italic leading-[0.95] text-grape-ink"
        >
          Four looks. One wire.
        </h2>
        <p className="mt-4 max-w-sm font-mono text-[10px] uppercase tracking-[0.14em] text-grape-ink/70">
          Not sold as a set. Worn as one anyway.
        </p>
      </div>

      {/* wire anchors — static, never transformed, spread from the top of
          the section to the bottom regardless of which branch below is
          active, so the wire threads through this section the same way in
          cinematic or reduced-motion mode. */}
      <div className="pointer-events-none absolute inset-0 z-[2]">
        <span data-wire-anchor="look-start" className="wire-anchor left-6 top-10 sm:left-10" />
        <span data-wire-anchor="look-image-enter" className="wire-anchor left-10 top-1/2 sm:left-16" />
        <span data-wire-anchor="look-image-exit" className="wire-anchor right-10 top-[62%] sm:right-16" />
        <span data-wire-anchor="look-end" className="wire-anchor right-6 bottom-10 sm:right-10" />
      </div>

      {cinematic ? (
        <div ref={trackRef} className="relative h-[400vh] sm:h-[440vh]">
          <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
            <p
              ref={counterRef}
              className="pointer-events-none absolute bottom-6 left-6 z-20 font-mono text-[10px] uppercase tracking-[0.14em] text-bubblegum sm:bottom-10 sm:left-10"
            >
              LOOK 01 / 04
            </p>
            {LOOKS.map((look, i) => (
              <LookLayer
                key={look.id}
                look={look}
                index={i}
                align={i % 2 === 0 ? "left" : "right"}
                layerRef={(el) => {
                  layerRefs.current[i] = el;
                }}
                captionRef={(el) => {
                  captionRefs.current[i] = el;
                }}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="relative flex flex-col gap-14 px-6 py-10 sm:px-10 sm:py-14">
          {LOOKS.map((look, i) => (
            <StaticLook key={look.id} look={look} index={i} align={i % 2 === 0 ? "left" : "right"} />
          ))}
        </div>
      )}
    </section>
  );
}

function EditList({ look }: { look: Look }) {
  return (
    <ul className="mt-4 space-y-1">
      {look.productIds.map((id) => {
        const product = getProductById(id);
        if (!product) return null;
        return (
          <li
            key={id}
            className="flex items-baseline justify-between gap-3 font-mono text-[9px] uppercase tracking-[0.08em] text-grape-ink/55 sm:text-[10px] sm:tracking-[0.1em]"
          >
            <span className="min-w-0">{product.name}</span>
            <span className="shrink-0">₹{product.price.toLocaleString("en-IN")}</span>
          </li>
        );
      })}
    </ul>
  );
}

function LookLayer({
  look,
  index,
  align,
  layerRef,
  captionRef,
}: {
  look: Look;
  index: number;
  align: "left" | "right";
  layerRef: (el: HTMLDivElement | null) => void;
  captionRef: (el: HTMLDivElement | null) => void;
}) {
  return (
    <div ref={layerRef} className="absolute inset-0 flex items-center justify-center opacity-0">
      <div
        className={`flex w-full max-w-4xl items-center gap-4 px-6 sm:gap-14 sm:px-10 ${
          align === "left" ? "flex-row" : "flex-row-reverse"
        }`}
      >
        <div className="relative w-[36vw] max-w-[160px] shrink-0 sm:w-[30vw] sm:max-w-[380px]">
          <span className="absolute -left-2 -top-3 z-[1] rounded-[2px] bg-acid-lime px-1.5 py-1 font-mono text-[8px] uppercase tracking-[0.1em] text-chrome-white shadow-[0_2px_4px_rgba(28,10,13,0.35)] sm:-left-3 sm:px-2 sm:text-[9px]">
            Look {String(index + 1).padStart(2, "0")}
          </span>
          <AssetImage image={{ id: `L-${look.id}`, alt: `${look.title} look, styled full length`, ratio: "3:4" }} />
        </div>
        <div ref={captionRef} className="min-w-0 flex-1 opacity-0">
          <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-bubblegum sm:text-[10px] sm:tracking-[0.16em]">
            The {look.title} Edit
          </p>
          <p className="mt-2 max-w-sm font-display text-lg italic leading-tight text-grape-ink sm:text-3xl">
            {look.caption}
          </p>
          <EditList look={look} />
          <Link
            href={`/collections/${look.collectionSlug}`}
            className="group mt-5 inline-flex w-fit items-center gap-2 border-b border-grape-ink pb-1 text-xs font-medium uppercase tracking-[0.16em] text-grape-ink"
          >
            Shop the Look
            <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}

function StaticLook({ look, index, align }: { look: Look; index: number; align: "left" | "right" }) {
  return (
    <div
      className={`flex flex-col items-start gap-6 sm:items-center sm:gap-10 ${
        align === "left" ? "sm:flex-row" : "sm:flex-row-reverse"
      }`}
    >
      <div className="relative w-full max-w-[260px] shrink-0">
        <span className="absolute -left-3 -top-3 z-[1] rounded-[2px] bg-acid-lime px-2 py-1 font-mono text-[9px] uppercase tracking-[0.1em] text-chrome-white shadow-[0_2px_4px_rgba(28,10,13,0.35)]">
          Look {String(index + 1).padStart(2, "0")}
        </span>
        <AssetImage image={{ id: `L-${look.id}`, alt: `${look.title} look, styled full length`, ratio: "3:4" }} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-bubblegum">The {look.title} Edit</p>
        <p className="mt-2 max-w-sm font-display text-2xl italic leading-tight text-grape-ink">{look.caption}</p>
        <EditList look={look} />
        <Link
          href={`/collections/${look.collectionSlug}`}
          className="group mt-5 inline-flex w-fit items-center gap-2 border-b border-grape-ink pb-1 text-xs font-medium uppercase tracking-[0.16em] text-grape-ink"
        >
          Shop the Look
          <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </Link>
      </div>
    </div>
  );
}
