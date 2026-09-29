"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Category, Product } from "@/lib/types";
import { CATEGORY_LABEL } from "@/lib/format";
import ArchiveCard from "./ArchiveCard";
import AssetImage from "@/components/product/AssetImage";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const CATEGORIES: Category[] = [
  "tops",
  "bottoms",
  "dresses",
  "outerwear",
  "bags",
  "shoes",
  "accessories",
];

/** A fixed, deterministic set of "featured" tiles, keyed to the catalogue
 *  number itself — not scroll or filter order — so the same pieces stay
 *  large regardless of which category tab is active. */
function isFeatured(product: Product) {
  return Number(product.id.slice(-3)) % 6 === 1;
}

/**
 * Section device — "The Archive Index." Built from the reference research,
 * not a default ecommerce grid: an oversized masthead (rewear-thrift's
 * off-grid scale habit), an index-tab category nav (mono dividers, not
 * pills), a fixed asymmetric rhythm (3dbento's mixed-span grid, applied to
 * real catalogue numbers instead of decoration), and one editorial band
 * breaking the grid — a genuine "interruption," not another card.
 *
 * The live index counter ("NOS. 00X–00Y") tracking which catalogue range is
 * actually in the viewport, via IntersectionObserver, is unchanged.
 *
 * Grid entrance (new): a single ScrollTrigger.batch reveal — cards fade+lift
 * in as they cross into view, staggered, once, eased with the same
 * power2.out this build already uses for entrance moments (Collections'
 * chapter reveal, About's hero wipe). This is the Tier 4 set-piece for this
 * page; the hover-crossfade, category filter, and live counter are
 * micro-interactions layered on top, not scattered additional triggers.
 * Deliberately *not* scrubbed — a grid of catalogue cards settling in once
 * as you arrive reads right; having them scrub back and forth as you
 * scroll past would fight the "index," not support it.
 */
export default function ShopArchive({ products }: { products: Product[] }) {
  const [active, setActive] = useState<"all" | Category>("all");
  const filtered = useMemo(
    () => (active === "all" ? products : products.filter((p) => p.category === active)),
    [products, active]
  );

  const gridRef = useRef<HTMLDivElement>(null);
  const [range, setRange] = useState<{ min: number; max: number } | null>(null);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const cards = Array.from(grid.querySelectorAll<HTMLElement>("[data-archive-num]"));
    if (cards.length === 0) {
      setRange(null);
      return;
    }

    const visible = new Set<number>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const num = Number(entry.target.getAttribute("data-archive-num"));
          if (entry.isIntersecting) visible.add(num);
          else visible.delete(num);
        });
        if (visible.size === 0) return;
        const nums = Array.from(visible);
        setRange({ min: Math.min(...nums), max: Math.max(...nums) });
      },
      { rootMargin: "-35% 0px -35% 0px", threshold: 0 }
    );

    cards.forEach((c) => io.observe(c));
    return () => io.disconnect();
  }, [active]);

  // Entrance reveal — see the component doc comment above. Rebuilt
  // (2026-09-13) with real physical weight: a fade+lift alone didn't
  // register as "animated" against the rest of the site's Tier 4 language
  // (the hero scrub, the wire, the clip-path wipes elsewhere all have mass
  // and overshoot). Cards now rise from further below, arrive slightly
  // undersized and faintly rotated (like a print being set down, not
  // pasted in), and settle with `back.out` — the same overshoot signature
  // the hero's sticker pop already uses, so this reads as the grid's own
  // version of an established move rather than a new one-off.
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const cards = Array.from(grid.querySelectorAll<HTMLElement>("[data-archive-num]"));
    if (cards.length === 0) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      cards.forEach((c) => {
        c.style.opacity = "1";
        c.style.transform = "none";
      });
      return;
    }

    // Alternating tilt direction per card (even/odd) rather than uniform —
    // a row of cards all rotating the same way reads as one mechanical
    // sweep; alternating reads as several individual objects settling.
    const fromVars = (i: number) => ({
      opacity: 0,
      y: 64,
      scale: 0.88,
      rotate: i % 2 === 0 ? -3 : 3,
    });

    const ctx = gsap.context(() => {
      cards.forEach((c, i) => gsap.set(c, fromVars(i)));

      ScrollTrigger.batch(cards, {
        start: "top 90%",
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            scale: 1,
            rotate: 0,
            duration: 0.9,
            ease: "back.out(1.5)",
            stagger: 0.09,
            overwrite: true,
          }),
      });

      // Cards already inside the viewport the instant this effect runs
      // (e.g. right after switching a filter tab, with no scroll event to
      // trigger onEnter) would otherwise sit stuck invisible — reveal
      // those immediately instead.
      ScrollTrigger.refresh();
      cards.forEach((c) => {
        const r = c.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) {
          gsap.to(c, {
            opacity: 1,
            y: 0,
            scale: 1,
            rotate: 0,
            duration: 0.6,
            ease: "back.out(1.5)",
            overwrite: true,
          });
        }
      });
    }, grid);

    return () => ctx.revert();
  }, [active]);

  const featuredCount = useMemo(() => filtered.filter(isFeatured).length, [filtered]);
  const pad3 = (n: number) => String(n).padStart(3, "0");

  return (
    <main className="relative bg-chrome-white">
      <div className="px-6 pb-8 pt-14 sm:px-10 sm:pt-20">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-bubblegum/70">
          Edt. 09 — The Archive
        </p>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-6">
          <h1 className="font-display text-[clamp(2.6rem,8vw,5rem)] italic leading-[0.95] text-grape-ink">
            Archive Vol. I.
          </h1>
          {range && (
            <p className="shrink-0 font-mono text-[10px] uppercase tracking-[0.16em] text-bubblegum">
              Nos. {pad3(range.min)}–{pad3(range.max)}
            </p>
          )}
        </div>
        <p className="mt-3 max-w-md font-mono text-[10px] uppercase tracking-[0.14em] text-grape-ink/70">
          The full catalogue. Everything here exists once — when a piece is gone, it&apos;s gone.
        </p>
      </div>

      {/* index / category nav — mono tab dividers, not pills */}
      {/* top offset matches SiteHeader's real rendered height (45px mobile /
          57px desktop, measured — not guessed) so this bar sits flush under
          the header with no unmasked gap for scrolled content to show
          through. Re-check both numbers if SiteHeader's own padding/type
          scale ever changes. */}
      <div className="no-scrollbar sticky top-[45px] z-20 overflow-x-auto border-y border-grape-ink/10 bg-chrome-white/95 px-6 backdrop-blur sm:top-[57px] sm:px-10">
        <div className="flex w-max items-center gap-5 py-3 font-mono text-[10px] uppercase tracking-[0.14em] sm:gap-7 sm:text-[11px]">
          <button
            type="button"
            onClick={() => setActive("all")}
            className={`border-b pb-1 transition-colors ${
              active === "all"
                ? "border-acid-lime text-grape-ink"
                : "border-transparent text-grape-ink/50 hover:text-grape-ink"
            }`}
          >
            All ({products.length})
          </button>
          {CATEGORIES.map((cat) => {
            const count = products.filter((p) => p.category === cat).length;
            if (count === 0) return null;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActive(cat)}
                className={`whitespace-nowrap border-b pb-1 transition-colors ${
                  active === cat
                    ? "border-acid-lime text-grape-ink"
                    : "border-transparent text-grape-ink/50 hover:text-grape-ink"
                }`}
              >
                {CATEGORY_LABEL[cat]} ({count})
              </button>
            );
          })}
        </div>
      </div>

      <div ref={gridRef} className="px-6 py-10 sm:px-10">
        {filtered.length === 0 ? (
          <p className="py-16 text-center font-mono text-[10px] uppercase tracking-[0.16em] text-grape-ink/50">
            Nothing filed under this heading.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-x-6 gap-y-14 sm:grid-cols-3 lg:grid-cols-4">
            {filtered.slice(0, 8).map((product) => (
              <ArchiveCard key={product.id} product={product} featured={isFeatured(product)} />
            ))}

            {filtered.length > 8 && featuredCount > 0 && (
              <div className="col-span-2 sm:col-span-3 lg:col-span-4">
                <EditorialBand />
              </div>
            )}

            {filtered.slice(8).map((product) => (
              <ArchiveCard key={product.id} product={product} featured={isFeatured(product)} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

function EditorialBand() {
  return (
    <div className="grid grid-cols-1 items-center gap-8 border-y border-grape-ink/10 py-10 sm:grid-cols-5 sm:gap-10">
      <div className="sm:col-span-2">
        <AssetImage
          image={{ id: "shop-editorial-band", alt: "Archive, mid-catalogue", ratio: "4:5" }}
          aspectClassName="aspect-[16/9] sm:aspect-[4/5]"
        />
      </div>
      <div className="sm:col-span-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-grape-ink/70">
          A note, mid-catalogue
        </p>
        <p className="mt-3 max-w-md font-display text-2xl italic leading-tight text-grape-ink sm:text-3xl">
          Nothing here is restocked. What&apos;s left is what&apos;s left.
        </p>
      </div>
    </div>
  );
}
