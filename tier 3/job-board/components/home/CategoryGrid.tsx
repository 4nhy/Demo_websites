import Image from "next/image";
import Link from "next/link";
import type { JobCategory } from "@/lib/jobs";

const CATEGORY_PHOTOS: Record<JobCategory, string> = {
  Engineering: "1521737604893-d14cc237f11d",
  Design: "1531482615713-2afd69097998",
  Marketing: "1552664730-d307ca884978",
  Operations: "1542744173-8e7e53415bb0",
  Internships: "1522202176988-66273c2fd55f",
};

export default function CategoryGrid({
  categories,
  counts,
}: {
  categories: JobCategory[];
  counts: Record<string, number>;
}) {
  return (
    <section
      id="categories"
      className="relative border-b border-line px-6 py-20 md:px-12 md:py-28"
    >
      <div className="mx-auto max-w-[1440px]">
        <p className="font-mono text-xs font-medium uppercase tracking-[0.08em] text-ink/60">
          02 — Browse by category
        </p>
        <div className="relative mt-8 grid grid-cols-1 gap-px bg-line sm:grid-cols-2 md:grid-cols-5">
          {categories.map((category, i) => (
            <Link
              key={category}
              href={`/jobs?category=${encodeURIComponent(category)}`}
              data-category-tile
              className="group relative flex flex-col justify-end overflow-hidden bg-paper aspect-[4/5]"
            >
              <Image
                src={`https://images.unsplash.com/photo-${CATEGORY_PHOTOS[category]}?w=700&q=80&auto=format&fit=crop`}
                alt=""
                fill
                unoptimized
                sizes="(min-width: 768px) 20vw, 50vw"
                className="photo-grade object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-ink/0 transition-colors group-hover:bg-ink/20" />
              <div className="relative z-10 flex items-end justify-between gap-2 p-5">
                <span className="font-sans text-lg font-bold text-paper">
                  {category}
                </span>
                <span className="font-mono text-xs font-medium text-paper/80">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <span className="relative z-10 mb-4 ml-5 font-mono text-xs font-medium uppercase tracking-[0.08em] text-paper/70">
                {counts[category] ?? 0} open
              </span>
              {i === 0 && (
                <span
                  aria-hidden="true"
                  className="absolute -right-3 -top-3 z-20 h-9 w-9"
                >
                  {/* Corner registration mark, always present — clipped by
                      the tile's own overflow-hidden. The traveling disc
                      (HomeView) docks here by fading the red layer in. */}
                  <span className="absolute inset-0 rounded-full border-2 border-paper/50" />
                  <span
                    data-disc-dock="categories"
                    className="absolute inset-0 scale-0 rounded-full bg-red opacity-0"
                  />
                </span>
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
