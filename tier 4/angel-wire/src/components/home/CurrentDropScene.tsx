"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ProductCard from "@/components/product/ProductCard";
import { getProductBySlug } from "@/data/products";
import type { Product } from "@/lib/types";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Current Drop — the vitrine set-piece from DIRECTION.md, executed: one
 * held object (Chrome Mesh Halter) stays centered and stable — that's what
 * the ANGEL WIRE anchors attach to — while four more travel through the
 * frame around it on a pinned, scroll-scrubbed timeline. Camera-push via
 * scale, depth via translateZ/perspective, entrance/exit via position +
 * opacity. No WebGL — plain CSS 3D transforms driven by one ScrollTrigger's
 * progress, per tiers.md's Tier 4 spec.
 *
 * Every product sits inside its own glossy, accent-tinted "vessel" capsule
 * rather than directly on the dark stage: ProductCard's text is styled for
 * a light background everywhere else it's used (shop, collections, related
 * pieces), so on this section's dark ground it would be illegible sitting
 * bare. Forking ProductCard's colors for one section risked exactly the
 * "change the underlying commerce component" the brief rules out — a light
 * capsule sidesteps that entirely, and reads as the Y2K "translucent
 * vessel / glossy surface" material language more literally anyway.
 *
 * Wire-critical elements (the "specimen tag" the wire enters/exits behind)
 * are deliberately kept OUTSIDE the pinned/sticky stage, in plain normal
 * flow with no transform of their own — sticky positioning creates its own
 * stacking context, and nesting the wire's z-[2]/z-[4] convention inside it
 * would risk exactly the kind of stacking bug the hero build already hit
 * once. Keeping the mechanical occlusion on a static element sidesteps it
 * entirely; the moving products get their own independent depth system.
 */

const ANCHOR_SLUG = "chrome-mesh-halter";

type Beat = {
  slug: string;
  vessel: string; // capsule accent treatment
  start: number; // when this object begins entering (0–1 of the pin's progress)
  end: number; // when it reaches "peak" — full presence, dramatic pose
  from: { x: number; y: number; rotate: number; scale: number };
  peak: { x: number; y: number; rotate: number; scale: number; z: number };
  settle: { x: number; y: number; rotate: number; scale: number }; // final resting slot
  /** Mobile gets its own settle geometry, not the desktop fan scaled down —
   *  at 390px the desktop settle spacing leaves one card's Add to Bag
   *  button sitting on top of another's, which is a real functional bug,
   *  not just a visual one. Verified by measuring bounding boxes, not
   *  eyeballed. */
  mobileSettle: { x: number; y: number; rotate: number; scale: number };
};

const VESSEL = {
  lilac: "bg-cyber-lilac/25 ring-cyber-lilac/60",
  bubblegum: "bg-bubblegum/20 ring-bubblegum/60",
  lime: "bg-acid-lime/20 ring-acid-lime/70",
  chrome: "bg-chrome-white ring-chrome-white/80",
};

const BEATS: Beat[] = [
  {
    slug: "holographic-slip-dress",
    vessel: VESSEL.lilac,
    start: 0.0,
    end: 0.3,
    from: { x: 46, y: 22, rotate: 14, scale: 0.5 },
    peak: { x: -16, y: -6, rotate: -4, scale: 1.15, z: 220 },
    settle: { x: -30, y: -22, rotate: -6, scale: 0.62 },
    mobileSettle: { x: -40, y: -9, rotate: -6, scale: 0.36 },
  },
  {
    slug: "iridescent-pvc-trench",
    vessel: VESSEL.bubblegum,
    start: 0.2,
    end: 0.5,
    from: { x: -50, y: 30, rotate: -16, scale: 0.5 },
    peak: { x: 18, y: 8, rotate: 6, scale: 1.2, z: 260 },
    settle: { x: 32, y: -18, rotate: 5, scale: 0.6 },
    mobileSettle: { x: 40, y: -9, rotate: 5, scale: 0.36 },
  },
  {
    slug: "platform-mary-janes",
    vessel: VESSEL.lime,
    start: 0.42,
    end: 0.7,
    from: { x: 40, y: -34, rotate: 18, scale: 0.5 },
    peak: { x: -14, y: 10, rotate: -8, scale: 1.1, z: 200 },
    settle: { x: -30, y: 22, rotate: -4, scale: 0.58 },
    mobileSettle: { x: -40, y: 27, rotate: -4, scale: 0.36 },
  },
  {
    slug: "chainmail-shoulder-bag",
    vessel: VESSEL.chrome,
    start: 0.62,
    end: 0.9,
    from: { x: -44, y: -26, rotate: -14, scale: 0.5 },
    peak: { x: 16, y: -8, rotate: 7, scale: 1.1, z: 200 },
    settle: { x: 30, y: 20, rotate: 5, scale: 0.58 },
    mobileSettle: { x: 40, y: 27, rotate: 5, scale: 0.36 },
  },
];

const SETTLE_START = 0.82;

const ease = gsap.parseEase("power2.inOut");

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function poseAt(beat: Beat, progress: number, narrow: boolean) {
  if (progress <= beat.start) return { ...beat.from, z: 0, opacity: 0 };
  const local = Math.min(1, (Math.min(progress, beat.end) - beat.start) / (beat.end - beat.start));
  const p = ease(local);
  const traveling = {
    x: lerp(beat.from.x, beat.peak.x, p),
    y: lerp(beat.from.y, beat.peak.y, p),
    rotate: lerp(beat.from.rotate, beat.peak.rotate, p),
    scale: lerp(beat.from.scale, beat.peak.scale, p),
    z: lerp(0, beat.peak.z, p),
    opacity: Math.min(1, local / 0.25),
  };
  if (progress < SETTLE_START) return traveling;
  const settle = narrow ? beat.mobileSettle : beat.settle;
  const settleT = ease(Math.min(1, (progress - SETTLE_START) / (1 - SETTLE_START)));
  return {
    x: lerp(traveling.x, settle.x, settleT),
    y: lerp(traveling.y, settle.y, settleT),
    rotate: lerp(traveling.rotate, settle.rotate, settleT),
    scale: lerp(traveling.scale, settle.scale, settleT),
    z: lerp(traveling.z, 40, settleT),
    opacity: 1,
  };
}

function Vessel({ tone, children }: { tone: string; children: React.ReactNode }) {
  return (
    <div className={`relative rounded-[2px] p-2.5 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.6)] ring-1 ${tone}`}>
      {/* glossy top highlight — the "translucent plastic" cue */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1/2 rounded-t-[2px] bg-gradient-to-b from-white/50 to-transparent" />
      <div className="relative">{children}</div>
    </div>
  );
}

export default function CurrentDropScene() {
  const [cinematic, setCinematic] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const objectRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const anchor = getProductBySlug(ANCHOR_SLUG);
  const travelers = BEATS.map((b) => ({ beat: b, product: getProductBySlug(b.slug) })).filter(
    (t): t is { beat: Beat; product: Product } => Boolean(t.product)
  );

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
    if (!cinematic) return;
    const track = trackRef.current;
    if (!track) return;

    function apply(progress: number) {
      const narrow = window.innerWidth < 640;
      travelers.forEach(({ beat }) => {
        const el = objectRefs.current[beat.slug];
        if (!el) return;
        const pose = poseAt(beat, progress, narrow);
        el.style.transform = `translate3d(${pose.x}vw, ${pose.y}vh, ${pose.z}px) scale(${pose.scale}) rotate(${pose.rotate}deg)`;
        el.style.opacity = String(pose.opacity);
        el.style.zIndex = String(Math.round(pose.z));
      });
    }

    apply(0);

    const st = ScrollTrigger.create({
      trigger: track,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.6,
      onUpdate: (self) => apply(self.progress),
    });

    // The track's height only exists once cinematic mode mounts (0 in the
    // static fallback) — the page's overall scroll length changed after
    // AngelWire's own trigger was created, so both need a recalculation.
    const refreshId = requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      cancelAnimationFrame(refreshId);
      st.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cinematic]);

  if (!anchor) return null;

  return (
    // bg-chrome-white, not bg-grape-ink — chrome-white is the dark Onyx
    // token post-rebuild; grape-ink is now the LIGHT ink token, so a
    // deliberately-dark "vitrine" section needs the token that actually
    // means dark now. Every chrome-white/grape-ink pairing below is swapped
    // the same way, to keep this section reading exactly as dark+light-text
    // as it always has.
    <section className="relative bg-chrome-white py-16 sm:py-24">
      {/* intro / HUD label — plain flow, no transform: this is what the wire
          actually travels behind, not any of the moving product objects */}
      <div className="relative px-6 sm:px-10">
        <span data-wire-anchor="drop-start" className="wire-anchor left-0 top-0" />
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-bubblegum/80">
              Current Drop — {travelers.length + 1} Pieces
            </p>
            <h2 className="mt-2 font-display text-[clamp(2.4rem,8vw,4.5rem)] font-semibold leading-[0.9] text-grape-ink">
              Still here. For now.
            </h2>
          </div>
          <Link
            href="/shop"
            className="group inline-flex w-fit items-center gap-2 border-b border-grape-ink/40 pb-1 font-mono text-[11px] uppercase tracking-[0.16em] text-grape-ink"
          >
            View Full Archive
            <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>

        {/* specimen tag — static, chrome-text, this is the wire's real anchor point */}
        <div className="relative mt-10 inline-flex items-center gap-2 border border-grape-ink/20 bg-chrome-white px-3 py-1.5">
          <span
            data-wire-anchor="drop-pre-image"
            className="wire-anchor left-1/2 -top-10 hidden sm:block"
          />
          <span data-wire-anchor="drop-image-enter" className="wire-anchor -left-4 top-1/2" />
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-acid-lime" />
          <span className="bg-[linear-gradient(100deg,#4A4E57_0%,#B8BEC7_25%,#F5F6F8_50%,#B8BEC7_75%,#4A4E57_100%)] bg-clip-text font-mono text-[10px] uppercase tracking-[0.18em] text-transparent">
            Vitrine — Live Feed
          </span>
          <span data-wire-anchor="drop-image-exit" className="wire-anchor -right-4 top-1/2" />
        </div>
      </div>

      {cinematic ? (
        <div ref={trackRef} className="relative mt-12 h-[420vh]">
          <div
            ref={stageRef}
            className="sticky top-0 flex h-screen items-center justify-center overflow-hidden px-6 [perspective:1400px] sm:px-10"
          >
            {/* stable anchor object — the vitrine's held piece; barely moves,
                the wire attaches near its resting position via the specimen
                tag above, not to the object itself */}
            <div className="relative z-[30] w-[58vw] max-w-[280px] sm:w-[26vw]">
              <Vessel tone={VESSEL.chrome}>
                <ProductCard product={anchor} />
              </Vessel>
            </div>

            {travelers.map(({ beat, product }) => (
              <div
                key={beat.slug}
                ref={(el) => {
                  objectRefs.current[beat.slug] = el;
                }}
                className="pointer-events-auto absolute left-1/2 top-1/2 w-[46vw] max-w-[220px] -translate-x-1/2 -translate-y-1/2 sm:w-[18vw]"
                style={{ opacity: 0, willChange: "transform, opacity" }}
              >
                <Vessel tone={beat.vessel}>
                  <ProductCard product={product} />
                </Vessel>
              </div>
            ))}

            <p className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.3em] text-grape-ink/70">
              Scroll to move through the drop
            </p>
          </div>
        </div>
      ) : (
        <div className="relative mt-12 grid grid-cols-2 gap-x-5 gap-y-10 px-6 sm:grid-cols-5 sm:gap-x-6 sm:px-10">
          <div className="col-span-2 sm:col-span-1">
            <Vessel tone={VESSEL.chrome}>
              <ProductCard product={anchor} />
            </Vessel>
          </div>
          {travelers.map(({ beat, product }) => (
            <div key={beat.slug} className="col-span-1">
              <Vessel tone={beat.vessel}>
                <ProductCard product={product} />
              </Vessel>
            </div>
          ))}
        </div>
      )}

      <span data-wire-anchor="drop-end" className="wire-anchor bottom-0 right-1/4" />
    </section>
  );
}
