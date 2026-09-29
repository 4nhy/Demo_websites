"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Collection } from "@/lib/types";
import AssetImage from "@/components/product/AssetImage";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type Mood = "angel-hour" | "after-dark" | "soft-damage" | "found-objects";

const ACCENT: Record<Mood, string> = {
  "angel-hour": "text-bubblegum",
  "after-dark": "text-bubblegum",
  // Was text-cyber-lilac (Gunmetal) — after the palette rebuild Gunmetal is
  // barely lighter than the Onyx/near-black grounds it sits on, so it reads
  // as invisible at reduced opacity. Brushed Steel keeps this legible.
  "soft-damage": "text-bubblegum",
  "found-objects": "text-acid-lime",
};

// Four distinct backgrounds, one per mood, now within the confirmed
// dark/gothic register (DIRECTION.md) rather than the old light palette —
// "near-black grounds," not a Y2K pastel per chapter. Each is a genuine
// animated gradient (see globals.css's .bg-mood-* classes), not a flat
// fill — drifting slowly at its own duration/angle so the four moods read
// as distinct, breathing surfaces rather than identical motion recolored:
// Angel Hour's "glitter still on, sun coming up" → a warm dark plum,
// widest/fastest drift. After Dark → the purest Onyx, barely-there pulse
// (was "the odd one out" against a light site; now just the calmest of
// four dark tones). Soft Damage's restraint → a quiet neutral charcoal,
// slow and shallow. Found Objects' flea-market/junk-drawer framing → a
// warm dark bronze, off-diagonal drift.
const BG: Record<Mood, string> = {
  "angel-hour": "bg-mood-angel-hour",
  "after-dark": "bg-mood-after-dark",
  "soft-damage": "bg-mood-soft-damage",
  "found-objects": "bg-mood-found-objects",
};

/**
 * Scroll reveal, shared across all four moods — a real Tier 4 mechanic
 * (clip-path image wipe + staggered text fade-up), not the static server
 * component this used to be. The clip-path technique is deliberately the
 * same one AboutEditorial already uses for its hero image: one proven
 * pattern reused site-wide beats four bespoke one-offs. Scroll-scrubbed on
 * the image (so it tracks scroll position, matching the hero/About feel),
 * a one-shot staggered fade for the text block (a discrete reveal moment,
 * not something that should scrub back and forth as you scroll past it).
 */
function useChapterReveal() {
  const imageWrapRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const imageWrap = imageWrapRef.current;
    const text = textRef.current;
    if (!imageWrap && !text) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      if (imageWrap) imageWrap.style.clipPath = "inset(0 0% 0 0)";
      if (text) {
        Array.from(text.children).forEach((c) => {
          (c as HTMLElement).style.opacity = "1";
          (c as HTMLElement).style.transform = "none";
        });
      }
      return;
    }

    const ctx = gsap.context(() => {
      if (imageWrap) {
        gsap.fromTo(
          imageWrap,
          { clipPath: "inset(0 100% 0 0)" },
          {
            clipPath: "inset(0 0% 0 0)",
            ease: "power2.inOut",
            scrollTrigger: { trigger: imageWrap, start: "top 88%", end: "top 40%", scrub: 0.5 },
          }
        );
      }
      if (text) {
        gsap.from(Array.from(text.children), {
          opacity: 0,
          y: 22,
          duration: 0.7,
          ease: "power2.out",
          stagger: 0.08,
          scrollTrigger: { trigger: text, start: "top 85%" },
        });
      }
    });

    return () => ctx.revert();
  }, []);

  return { imageWrapRef, textRef };
}

/**
 * Four genuinely different compositional logics, not four recolored copies
 * of the same card — each keyed to the collection's own mood and its real
 * piece count, not decoration:
 *
 * Angel Hour (9 pieces, brightest) — full-bleed image, title overlaid
 * directly on it (pink-y2k-shoe's "object fills the frame, copy overlaid"
 * mechanic), off-center, generous negative space to one side.
 *
 * After Dark (7 pieces) — reversed palette, near-black ground, image
 * cropped tighter and moodier, title sits beside not on top.
 *
 * Soft Damage (4 pieces, the smallest) — deliberately the quietest
 * composition, small and restrained instead of stretched to match the
 * others; "soft" expressed as actual restraint, not a color swap.
 *
 * Found Objects (9 pieces) — was a scattered cluster of three small object
 * crops (matching "the small hardware of a life" rather than a single
 * studio shot), but only one real photo was ever supplied for it — the
 * other two slots were a stopgap repeating that same file, not a real
 * three-crop moment. Per explicit instruction, simplified to a single
 * hero image (After Dark's layout, its own mood/accent) rather than
 * chasing two more photos that aren't coming.
 */
export default function CollectionChapter({
  collection,
  mood,
  count,
  index,
}: {
  collection: Collection;
  mood: Mood;
  count: number;
  index: number;
}) {
  const num = String(index + 1).padStart(2, "0");
  const accent = ACCENT[mood];
  const bg = BG[mood];
  const { imageWrapRef, textRef } = useChapterReveal();

  // min-h + vertical centering on every branch below, not just matching py
  // — section padding was already identical across all four moods (96px
  // top/bottom), but natural content height ranged from ~410px (Soft
  // Damage's compact centered row) to ~640px (After Dark's full grid), so
  // the visual gap between one chapter's actual content and the next
  // varied by ~35% even though the CSS padding didn't. A shared min-height
  // with justify-center gives the shorter, denser compositions the same
  // breathing room instead of sitting compressed near the top.
  if (mood === "angel-hour") {
    return (
      <section
        id={collection.slug}
        className={`relative ${bg} flex min-h-[560px] flex-col justify-center px-6 py-16 sm:min-h-[640px] sm:px-10 sm:py-24`}
      >
        <div className="relative mx-auto w-full max-w-5xl">
          <div className="relative" ref={imageWrapRef}>
            <AssetImage
              image={{ id: `collection-${collection.slug}-hero`, alt: `${collection.name} collection`, ratio: "4:5" }}
              aspectClassName="aspect-[16/10] sm:aspect-[21/9]"
              priority={index === 0}
            />
            {/* scrim — text-on-image needs this regardless of what the
                photo turns out to be; without it, light imagery (or today's
                placeholder) makes the overlaid white text unreadable */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-2/3 bg-gradient-to-t from-chrome-white/80 via-chrome-white/25 to-transparent sm:block"
            />
          </div>
          <div ref={textRef} className="relative mt-6 sm:absolute sm:inset-x-10 sm:bottom-8 sm:mt-0">
            <p className={`font-mono text-[10px] uppercase tracking-[0.18em] ${accent}`}>
              Edt. {num} — {count} {count === 1 ? "Piece" : "Pieces"}
            </p>
            {/* grape-ink (light ink) works over both the dark mood bg
                (mobile) and the dark scrim over the image (desktop) — no
                sm: override needed now that both grounds are dark. */}
            <h2 className="mt-2 font-display text-[clamp(2.4rem,7vw,4.5rem)] italic leading-[0.95] text-grape-ink">
              {collection.name}
            </h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-grape-ink/80">
              {collection.description}
            </p>
            <Link
              href={`/collections/${collection.slug}`}
              className="group mt-5 inline-flex w-fit items-center gap-2 border-b border-grape-ink pb-1 text-xs font-medium uppercase tracking-[0.18em] text-grape-ink"
            >
              Enter {collection.name}
              <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>
        </div>
      </section>
    );
  }

  if (mood === "after-dark") {
    return (
      <section
        id={collection.slug}
        className={`relative ${bg} flex min-h-[560px] flex-col justify-center px-6 py-16 sm:min-h-[640px] sm:px-10 sm:py-24`}
      >
        <div className="mx-auto grid w-full max-w-5xl grid-cols-1 items-center gap-10 sm:grid-cols-5 sm:gap-12">
          <div ref={textRef} className="sm:col-span-2">
            <p className={`font-mono text-[10px] uppercase tracking-[0.18em] ${accent}`}>
              Edt. {num} — {count} Pieces
            </p>
            <h2 className="mt-2 font-display text-[clamp(2.2rem,6vw,3.6rem)] italic leading-[0.95] text-grape-ink">
              {collection.name}
            </h2>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-grape-ink/70">
              {collection.description}
            </p>
            <Link
              href={`/collections/${collection.slug}`}
              className="group mt-6 inline-flex w-fit items-center gap-2 border-b border-grape-ink pb-1 text-xs font-medium uppercase tracking-[0.18em] text-grape-ink"
            >
              Enter {collection.name}
              <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>
          <div className="sm:col-span-3" ref={imageWrapRef}>
            <AssetImage
              image={{ id: `collection-${collection.slug}-hero`, alt: `${collection.name} collection`, ratio: "4:5" }}
              aspectClassName="aspect-[4/3]"
              className="opacity-90"
            />
          </div>
        </div>
      </section>
    );
  }

  if (mood === "soft-damage") {
    return (
      <section
        id={collection.slug}
        className={`relative ${bg} flex min-h-[560px] flex-col justify-center px-6 py-16 sm:min-h-[640px] sm:px-10 sm:py-24`}
      >
        <div className="mx-auto flex w-full max-w-3xl flex-col items-start gap-6 sm:flex-row sm:items-center sm:gap-10">
          <div className="w-full max-w-[220px] shrink-0" ref={imageWrapRef}>
            <AssetImage
              image={{ id: `collection-${collection.slug}-hero`, alt: `${collection.name} collection`, ratio: "1:1" }}
            />
          </div>
          <div ref={textRef}>
            <p className={`font-mono text-[10px] uppercase tracking-[0.18em] ${accent}`}>
              Edt. {num} — {count} Pieces
            </p>
            <h2 className="mt-2 font-display text-[clamp(1.9rem,5vw,2.8rem)] italic leading-[0.95] text-grape-ink">
              {collection.name}
            </h2>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-grape-ink/75">
              {collection.description}
            </p>
            <Link
              href={`/collections/${collection.slug}`}
              className="group mt-5 inline-flex w-fit items-center gap-2 border-b border-grape-ink pb-1 text-xs font-medium uppercase tracking-[0.18em] text-grape-ink"
            >
              Enter {collection.name}
              <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>
        </div>
      </section>
    );
  }

  // found-objects — single hero image, same layout shape as after-dark
  // (its own mood/bg/accent) — see the doc comment above for why this is
  // no longer a three-crop scatter.
  return (
    <section
      id={collection.slug}
      className={`relative ${bg} flex min-h-[560px] flex-col justify-center px-6 py-16 sm:min-h-[640px] sm:px-10 sm:py-24`}
    >
      <div className="mx-auto grid w-full max-w-5xl grid-cols-1 items-center gap-10 sm:grid-cols-5 sm:gap-8">
        <div ref={textRef} className="sm:col-span-2">
          <p className={`font-mono text-[10px] uppercase tracking-[0.18em] ${accent}`}>
            Edt. {num} — {count} Pieces
          </p>
          <h2 className="mt-2 font-display text-[clamp(2.2rem,6vw,3.6rem)] italic leading-[0.95] text-grape-ink">
            {collection.name}
          </h2>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-grape-ink/75">
            {collection.description}
          </p>
          <Link
            href={`/collections/${collection.slug}`}
            className="group mt-6 inline-flex w-fit items-center gap-2 border-b border-grape-ink pb-1 text-xs font-medium uppercase tracking-[0.18em] text-grape-ink"
          >
            Enter {collection.name}
            <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>
        <div className="sm:col-span-3" ref={imageWrapRef}>
          <AssetImage
            image={{ id: `collection-${collection.slug}-hero`, alt: `${collection.name} collection`, ratio: "4:5" }}
            aspectClassName="aspect-[4/3]"
          />
        </div>
      </div>
    </section>
  );
}
