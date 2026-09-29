"use client";

import { useEffect, useRef, useState } from "react";
import type { Collection, Product } from "@/lib/types";
import CollectionChapter from "./CollectionChapter";

const MOODS = ["angel-hour", "after-dark", "soft-damage", "found-objects"] as const;

/**
 * The collections index as a sequence of chapters, not a card grid — each
 * with its own composition (see CollectionChapter). The one interaction
 * mechanic here: a slim sticky "contents" rail that highlights whichever
 * chapter is actually in view, via IntersectionObserver — the same
 * technique Shop's index counter uses, applied differently (which chapter,
 * not which catalogue range), so the two pages share a real mechanic
 * without literally repeating the same UI.
 */
export default function CollectionsIndex({
  collections,
  products,
}: {
  collections: Collection[];
  products: Product[];
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeSlug, setActiveSlug] = useState<string>(collections[0]?.slug ?? "");

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const chapters = Array.from(container.querySelectorAll<HTMLElement>("section[id]"));
    if (chapters.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSlug(entry.target.id);
          }
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );

    chapters.forEach((c) => io.observe(c));
    return () => io.disconnect();
  }, []);

  return (
    <main className="relative bg-chrome-white">
      <div className="px-6 pb-8 pt-14 sm:px-10 sm:pt-20">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-bubblegum/70">
          Edt. 10 — The Collections
        </p>
        <h1 className="mt-2 font-display text-[clamp(2.6rem,8vw,5rem)] italic leading-[0.95] text-grape-ink">
          Four ways in.
        </h1>
        <p className="mt-3 max-w-md font-mono text-[10px] uppercase tracking-[0.14em] text-grape-ink/70">
          Curated groupings, not categories. A dress, a bag, and a pair of shoes can all belong
          together.
        </p>
      </div>

      {/* contents rail — sticky, updates as chapters scroll past */}
      {/* top offset matches SiteHeader's real rendered height (45px mobile /
          57px desktop, measured — not guessed) so this bar sits flush under
          the header with no unmasked gap for scrolled content to show
          through. Re-check both numbers if SiteHeader's own padding/type
          scale ever changes. */}
      <div className="no-scrollbar sticky top-[45px] z-20 overflow-x-auto border-y border-grape-ink/10 bg-chrome-white/95 px-6 backdrop-blur sm:top-[57px] sm:px-10">
        <div className="flex w-max items-center gap-5 py-3 font-mono text-[10px] uppercase tracking-[0.14em] sm:gap-7 sm:text-[11px]">
          {collections.map((c) => (
            <a
              key={c.slug}
              href={`#${c.slug}`}
              className={`whitespace-nowrap border-b pb-1 transition-colors ${
                activeSlug === c.slug
                  ? "border-acid-lime text-grape-ink"
                  : "border-transparent text-grape-ink/50 hover:text-grape-ink"
              }`}
            >
              {c.name}
            </a>
          ))}
        </div>
      </div>

      <div ref={containerRef}>
        {collections.map((collection, i) => {
          const count = products.filter((p) => p.collections.includes(collection.slug)).length;
          return (
            <CollectionChapter
              key={collection.slug}
              collection={collection}
              mood={MOODS[i % MOODS.length]}
              count={count}
              index={i}
            />
          );
        })}
      </div>
    </main>
  );
}
