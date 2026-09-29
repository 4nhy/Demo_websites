"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import AssetImage from "@/components/product/AssetImage";
import AddToBagButton from "@/components/product/AddToBagButton";
import SoldBadge from "@/components/product/SoldBadge";
import { useCart } from "@/context/CartContext";
import { formatCatalogueNumber, formatPrice, CATEGORY_LABEL } from "@/lib/format";
import { getProductById } from "@/data/products";

// Nine pieces that didn't appear in Current Drop (Section 2) — a different
// curation angle on the same catalogue, not the same five re-shown.
const ARRIVAL_IDS = [
  "aw-0002",
  "aw-0004",
  "aw-0005",
  "aw-0009",
  "aw-0010",
  "aw-0012",
  "aw-0015",
  "aw-0018",
  "aw-0020",
];

/**
 * Section 6 — New Arrivals. The device is borrowed from a detail neither
 * Collections Line nor Lookbook used: pink-y2k-shoe's "Best-sellers" row has
 * a thin scroll-position bar sitting under the cards, and rewear-thrift's
 * product rows pair a plain grid with an explicit "see more" arrow — a row
 * with a next-affordance, as a *mechanic*, not that grid's identity.
 *
 * Built into something specific to "new arrivals" rather than a generic
 * carousel: a strip of just-developed negatives. Sprocket-perforated edges,
 * chrome frame borders, "FRAME 0X" stamps, a running counter and fill-bar —
 * the roll just came back from the lab, which is exactly what "new
 * arrivals" means for a one-of-one archive that's never restocked.
 *
 * Structurally this section is unlike every one before it: there is no pin
 * and no ScrollTrigger. The strip is a native horizontally-scrolling
 * element (overflow-x-auto, scroll-snap-x) — the user's own scroll gesture,
 * on a different axis, is the interaction, not a scripted vertical-scroll
 * transform. That's the deliberate point of difference from Sections 2–5,
 * which all share the same pin-and-scrub mechanism underneath their
 * different dressing.
 */
export default function NewArrivalsFilmstrip() {
  const { isSold } = useCart();
  const [reduced, setReduced] = useState(false);
  const [active, setActive] = useState(0);
  const stripRef = useRef<HTMLDivElement>(null);
  const frameRefs = useRef<Array<HTMLDivElement | null>>([]);
  const progressRef = useRef<HTMLDivElement>(null);
  const dragState = useRef({ dragging: false, startX: 0, startScroll: 0, moved: false });

  const products = ARRIVAL_IDS.map((id) => getProductById(id)).filter((p): p is NonNullable<typeof p> => Boolean(p));

  useEffect(() => {
    const reducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    function apply() {
      setReduced(reducedQuery.matches);
    }
    apply();
    reducedQuery.addEventListener("change", apply);
    return () => reducedQuery.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    const strip = stripRef.current;
    if (!strip) return;

    function onScroll() {
      const el = strip!;
      const maxScroll = el.scrollWidth - el.clientWidth;
      const progress = maxScroll > 0 ? el.scrollLeft / maxScroll : 0;
      if (progressRef.current) {
        progressRef.current.style.width = `${Math.min(100, Math.max(0, progress * 100))}%`;
      }
      const n = products.length;
      const idx = Math.round(progress * (n - 1));
      setActive((prev) => (prev === idx ? prev : idx));
    }

    onScroll();
    strip.addEventListener("scroll", onScroll, { passive: true });
    return () => strip.removeEventListener("scroll", onScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function scrollToFrame(direction: 1 | -1) {
    const strip = stripRef.current;
    const frame = frameRefs.current[0];
    if (!strip) return;
    const step = frame ? frame.offsetWidth + 16 : strip.clientWidth * 0.8;
    strip.scrollBy({ left: step * direction, behavior: reduced ? "auto" : "smooth" });
  }

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    const strip = stripRef.current;
    if (!strip || e.pointerType === "touch") return;
    dragState.current = { dragging: true, startX: e.clientX, startScroll: strip.scrollLeft, moved: false };
    strip.setPointerCapture(e.pointerId);
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const strip = stripRef.current;
    const ds = dragState.current;
    if (!strip || !ds.dragging) return;
    const delta = e.clientX - ds.startX;
    if (Math.abs(delta) > 4) ds.moved = true;
    strip.scrollLeft = ds.startScroll - delta;
  }

  function onPointerUp(e: React.PointerEvent<HTMLDivElement>) {
    const strip = stripRef.current;
    dragState.current.dragging = false;
    if (strip) strip.releasePointerCapture(e.pointerId);
  }

  function onFrameClickCapture(e: React.MouseEvent) {
    if (dragState.current.moved) {
      e.preventDefault();
      e.stopPropagation();
      dragState.current.moved = false;
    }
  }

  return (
    // bg-chrome-white (Onyx dark, post-rebuild) not bg-grape-ink — see
    // CurrentDropScene's equivalent comment.
    <section className="relative bg-chrome-white py-16 sm:py-24">
      <div className="px-6 sm:px-10">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-bubblegum/70">
          Edt. 06 — New Arrivals
          <span data-wire-anchor="arrivals-start" className="wire-anchor -left-2 top-0" />
        </p>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-6">
          <div>
            <h2 className="font-display text-[clamp(2.2rem,7vw,4rem)] italic leading-[0.95] text-grape-ink">
              The roll&apos;s back.
            </h2>
            <p className="mt-3 max-w-sm font-mono text-[10px] uppercase tracking-[0.14em] text-grape-ink/70">
              Nine frames. Shot once, printed once, gone once someone buys it.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-bubblegum">
              Frame {String(active + 1).padStart(2, "0")} / {String(products.length).padStart(2, "0")}
            </p>
            <button
              type="button"
              onClick={() => scrollToFrame(-1)}
              aria-label="Scroll to previous arrival"
              className="flex h-8 w-8 items-center justify-center border border-grape-ink/30 text-grape-ink transition-colors hover:border-acid-lime hover:text-acid-lime"
            >
              <ArrowLeft size={14} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => scrollToFrame(1)}
              aria-label="Scroll to next arrival"
              className="flex h-8 w-8 items-center justify-center border border-grape-ink/30 text-grape-ink transition-colors hover:border-acid-lime hover:text-acid-lime"
            >
              <ArrowRight size={14} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      <div className="relative mt-10">
        {/* sprocket perforation bands — CSS only, no asset */}
        {/* hole color matches the section's own dark ground (Onyx), not the
            old cream — these read as literal punched-through holes to
            whatever's behind them */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-3 bg-[radial-gradient(circle,_#0b0b0e_2.6px,_transparent_2.6px)] bg-[length:22px_100%] opacity-40 sm:h-4" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-3 bg-[radial-gradient(circle,_#0b0b0e_2.6px,_transparent_2.6px)] bg-[length:22px_100%] opacity-40 sm:h-4" />

        <div
          ref={stripRef}
          role="region"
          aria-label="New arrivals, scroll horizontally"
          tabIndex={0}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onClickCapture={onFrameClickCapture}
          className={`no-scrollbar flex cursor-grab gap-4 overflow-x-auto px-6 py-6 [scroll-snap-type:x_mandatory] active:cursor-grabbing sm:gap-6 sm:px-10 ${
            reduced ? "" : "scroll-smooth"
          }`}
        >
          <span data-wire-anchor="arrivals-image-enter" className="wire-anchor left-0 top-1/2" />
          {products.map((product, i) => {
            const sold = isSold(product);
            const primaryImage = product.images[0];
            return (
              <div
                key={product.id}
                ref={(el) => {
                  frameRefs.current[i] = el;
                }}
                className="w-[70vw] shrink-0 [scroll-snap-align:center] sm:w-[280px]"
              >
                {/* the whole frame is mounted on one white print-mat, border
                    running all the way around photo + caption + button —
                    matches a real developed print, and (same convention as
                    Current Drop's Vessel wrapper) keeps ProductCard's
                    button/text at their default light-background styling
                    instead of overriding component-owned colors per section. */}
                <div className="relative border-[3px] border-[#d8d4c8] bg-chrome-white p-1.5 pb-4 shadow-[0_16px_36px_-14px_rgba(0,0,0,0.55)]">
                  <span className="absolute -top-2.5 left-2 z-[1] rounded-[2px] bg-grape-ink px-1.5 py-0.5 font-mono text-[8px] uppercase tracking-[0.1em] text-chrome-white">
                    Frame {String(i + 1).padStart(2, "0")}
                  </span>
                  {/* text-chrome-white (dark), not text-grape-ink — acid-lime
                      is now Mirror Flash, a near-white chip, so it needs dark
                      text, not the (now-light) ink token */}
                  <span className="absolute -right-2 -top-2.5 z-[1] rotate-[8deg] rounded-[2px] bg-acid-lime px-1.5 py-0.5 font-mono text-[8px] uppercase tracking-[0.1em] text-chrome-white shadow-[0_2px_4px_rgba(28,10,13,0.35)]">
                    New
                  </span>
                  <div className="relative">
                    <Link
                      href={`/shop/${product.slug}`}
                      className="block focus-visible:outline focus-visible:outline-2 focus-visible:outline-grape-ink"
                    >
                      {primaryImage && (
                        <AssetImage image={primaryImage} className={sold ? "opacity-60" : ""} />
                      )}
                    </Link>
                    {sold && <SoldBadge className="absolute right-3 top-3 z-[1]" />}
                  </div>

                  <div className="mt-3 px-1.5 flex items-start justify-between gap-2 font-mono text-[9px] uppercase tracking-[0.12em] text-grape-ink/50">
                    <span>{formatCatalogueNumber(product.id)}</span>
                    <span>{CATEGORY_LABEL[product.category]}</span>
                  </div>
                  <h3 className="mt-1 px-1.5 font-display text-sm italic text-grape-ink">
                    <Link href={`/shop/${product.slug}`}>{product.name}</Link>
                  </h3>
                  <p className="mt-0.5 px-1.5 text-sm text-grape-ink/70">{formatPrice(product.price)}</p>
                  <div className="mt-3 px-1.5">
                    <AddToBagButton product={product} />
                  </div>
                </div>
              </div>
            );
          })}
          <span data-wire-anchor="arrivals-image-exit" className="wire-anchor right-0 top-1/2" />
        </div>
      </div>

      <div className="relative px-6 sm:px-10">
        <div className="mt-6 h-px w-full bg-chrome-white/15">
          <div ref={progressRef} className="h-px w-0 bg-bubblegum transition-[width] duration-150" />
        </div>
        <span data-wire-anchor="arrivals-end" className="wire-anchor bottom-0 right-1/4" />
      </div>
    </section>
  );
}
