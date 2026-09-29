import Link from "next/link";
import type { Collection, Product } from "@/lib/types";
import AssetImage from "@/components/product/AssetImage";
import AddToBagButton from "@/components/product/AddToBagButton";
import CatalogueTag from "@/components/product/CatalogueTag";
import ArchiveCard from "@/components/shop/ArchiveCard";
import { CATEGORY_LABEL, formatPrice } from "@/lib/format";

const MOODS = ["angel-hour", "after-dark", "soft-damage", "found-objects"] as const;
type Mood = (typeof MOODS)[number];

const ACCENT: Record<Mood, string> = {
  "angel-hour": "text-bubblegum",
  "after-dark": "text-bubblegum",
  // See CollectionChapter's ACCENT comment — Gunmetal (cyber-lilac) is too
  // close in value to the Onyx ground to read as label text after the
  // palette rebuild.
  "soft-damage": "text-bubblegum",
  "found-objects": "text-acid-lime",
};

// Same per-mood backgrounds as the chapter teaser (CollectionChapter) — the
// detail page should land you in the same visual world you clicked "Enter"
// from. Dark/gothic register per DIRECTION.md, not the old light palette —
// see CollectionChapter's BG comment for the per-mood reasoning.
const BG: Record<Mood, string> = {
  "angel-hour": "bg-mood-angel-hour",
  "after-dark": "bg-mood-after-dark",
  "soft-damage": "bg-mood-soft-damage",
  "found-objects": "bg-mood-found-objects",
};

/**
 * The detail page continues the exact mood its index chapter (see
 * CollectionChapter) opened with, at full page scale, instead of resetting
 * into a generic "title / description / grid" template — clicking "Enter
 * Angel Hour" should land you inside the same visual world, not a different
 * page type. Same asset-manifest ids as the chapter teaser (hero + 3 object
 * crops for Found Objects) so real imagery, once sourced, appears in both
 * places automatically.
 *
 * Two mechanics beyond the shared mood hero: a "lead piece" spotlight —
 * the first available piece gets an oversized two-column treatment, framed
 * as the piece that opens the chapter, before the rest of the collection
 * settles into a curated (not uniform) grid — and a "continue" footer that
 * chains into the next collection rather than dead-ending, wrapping back to
 * Angel Hour after Found Objects.
 */
export default function CollectionDetail({
  collection,
  products,
  allCollections,
}: {
  collection: Collection;
  products: Product[];
  allCollections: Collection[];
}) {
  const index = Math.max(
    0,
    allCollections.findIndex((c) => c.slug === collection.slug)
  );
  const mood = MOODS[index % MOODS.length];
  const accent = ACCENT[mood];
  const num = String(index + 1).padStart(2, "0");

  const lead = products.find((p) => p.availability !== "sold") ?? products[0];
  const rest = lead ? products.filter((p) => p.id !== lead.id) : products;

  const nextIndex = (index + 1) % allCollections.length;
  const next = allCollections[nextIndex];

  return (
    <main className="bg-chrome-white">
      <div className="px-6 pt-8 sm:px-10 sm:pt-10">
        <Link
          href="/collections"
          className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-grape-ink/50 hover:text-grape-ink"
        >
          <span aria-hidden="true">←</span> Back to Collections
        </Link>
      </div>

      <Hero collection={collection} mood={mood} accent={accent} num={num} count={products.length} />

      <div className="mx-auto max-w-2xl px-6 py-12 text-center sm:px-10 sm:py-16">
        <p className={`font-mono text-[10px] uppercase tracking-[0.18em] ${accent}`}>
          Edt. {num} — {products.length} {products.length === 1 ? "Piece" : "Pieces"}
        </p>
        <p className="mt-4 font-display text-2xl italic leading-snug text-grape-ink sm:text-3xl">
          {collection.description}
        </p>
      </div>

      {lead && (
        <div className="border-y border-grape-ink/10 px-6 py-14 sm:px-10 sm:py-20">
          <p className="mx-auto max-w-5xl font-mono text-[10px] uppercase tracking-[0.16em] text-grape-ink/70">
            Opens the chapter
          </p>
          <div className="mx-auto mt-6 grid max-w-5xl grid-cols-1 items-center gap-10 sm:grid-cols-2 sm:gap-16">
            <div className="relative">
              {lead.images[0] && <AssetImage image={lead.images[0]} aspectClassName="aspect-[4/5]" />}
              <CatalogueTag id={lead.id} className="pointer-events-none absolute left-3 top-3" />
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-grape-ink/50">
                {CATEGORY_LABEL[lead.category]}
              </p>
              <h2 className="mt-3 font-display text-[clamp(2rem,5vw,3.2rem)] italic leading-[0.98] text-grape-ink">
                <Link href={`/shop/${lead.slug}`}>{lead.name}</Link>
              </h2>
              <p className="mt-4 max-w-prose text-sm leading-relaxed text-grape-ink/80">{lead.description}</p>
              <p className="mt-4 text-lg text-grape-ink">{formatPrice(lead.price)}</p>
              <div className="mt-6 max-w-xs">
                <AddToBagButton product={lead} />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="px-6 py-14 sm:px-10 sm:py-20">
        {rest.length === 0 ? (
          <p className="text-center font-mono text-[10px] uppercase tracking-[0.16em] text-grape-ink/50">
            That&apos;s the whole chapter.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-x-6 gap-y-14 sm:grid-cols-3 lg:grid-cols-4">
            {rest.map((product, i) => (
              <ArchiveCard key={product.id} product={product} featured={i % 5 === 0} />
            ))}
          </div>
        )}
      </div>

      <Link
        href={`/collections/${next.slug}`}
        className="group flex items-center justify-between border-t border-grape-ink/10 px-6 py-10 transition-colors hover:bg-grape-ink/[0.03] sm:px-10 sm:py-14"
      >
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-grape-ink/70">
            {nextIndex === 0 ? "Back to the start" : "Next chapter"}
          </p>
          <p className="mt-2 font-display text-2xl italic text-grape-ink sm:text-3xl">{next.name}</p>
        </div>
        <span
          aria-hidden="true"
          className="text-2xl text-grape-ink transition-transform duration-300 group-hover:translate-x-2"
        >
          →
        </span>
      </Link>
    </main>
  );
}

function Hero({
  collection,
  mood,
  accent,
  num,
  count,
}: {
  collection: Collection;
  mood: Mood;
  accent: string;
  num: string;
  count: number;
}) {
  const eyebrow = (
    <p className={`font-mono text-[10px] uppercase tracking-[0.18em] ${accent}`}>
      Edt. {num} — {count} {count === 1 ? "Piece" : "Pieces"}
    </p>
  );

  if (mood === "angel-hour") {
    return (
      <section className={`relative ${BG[mood]}`}>
        <AssetImage
          image={{ id: `collection-${collection.slug}-hero`, alt: `${collection.name} collection`, ratio: "4:5" }}
          aspectClassName="aspect-[4/3] sm:aspect-[21/9]"
          priority
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-chrome-white/85 via-chrome-white/30 to-transparent"
        />
        <div className="absolute inset-x-6 bottom-8 sm:inset-x-10 sm:bottom-12">
          {eyebrow}
          <h1 className="mt-2 font-display text-[clamp(3rem,10vw,6.5rem)] italic leading-[0.9] text-grape-ink">
            {collection.name}
          </h1>
        </div>
      </section>
    );
  }

  if (mood === "after-dark") {
    return (
      <section className={`${BG[mood]} px-6 py-16 sm:px-10 sm:py-24`}>
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 sm:grid-cols-5 sm:gap-14">
          <div className="sm:col-span-2">
            {eyebrow}
            <h1 className="mt-3 font-display text-[clamp(2.8rem,8vw,5rem)] italic leading-[0.92] text-grape-ink">
              {collection.name}
            </h1>
          </div>
          <div className="sm:col-span-3">
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
      <section className={`${BG[mood]} px-6 py-16 sm:px-10 sm:py-24`}>
        <div className="mx-auto flex max-w-4xl flex-col items-start gap-8 sm:flex-row sm:items-center sm:gap-14">
          <div className="w-full max-w-[280px] shrink-0">
            <AssetImage
              image={{ id: `collection-${collection.slug}-hero`, alt: `${collection.name} collection`, ratio: "1:1" }}
            />
          </div>
          <div>
            {eyebrow}
            <h1 className="mt-3 font-display text-[clamp(2.4rem,6vw,4rem)] italic leading-[0.95] text-grape-ink">
              {collection.name}
            </h1>
          </div>
        </div>
      </section>
    );
  }

  // found-objects — single hero image, matching CollectionChapter's own
  // simplification (was a three-crop scatter; only one real photo exists
  // for this collection, so the other two slots aren't faked anymore).
  return (
    <section className={`${BG["found-objects"]} px-6 py-16 sm:px-10 sm:py-24`}>
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 sm:grid-cols-5 sm:gap-10">
        <div className="sm:col-span-2">
          {eyebrow}
          <h1 className="mt-3 font-display text-[clamp(2.8rem,8vw,5rem)] italic leading-[0.92] text-grape-ink">
            {collection.name}
          </h1>
        </div>
        <div className="sm:col-span-3">
          <AssetImage
            image={{ id: `collection-${collection.slug}-hero`, alt: `${collection.name} collection`, ratio: "4:5" }}
            aspectClassName="aspect-[4/3]"
          />
        </div>
      </div>
    </section>
  );
}
