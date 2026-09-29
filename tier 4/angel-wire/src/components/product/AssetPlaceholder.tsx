import type { ProductImage } from "@/lib/types";

const RATIO_CLASS: Record<ProductImage["ratio"], string> = {
  "4:5": "aspect-[4/5]",
  "1:1": "aspect-square",
  "3:4": "aspect-[3/4]",
};

/**
 * Stands in for every product photo until real generated assets land (see
 * ASSETS.md's documented fallback). Deliberately opaque, not a translucent
 * tint — a translucent placeholder let the ANGEL WIRE signature element's
 * "hidden behind an image" effect bleed through during the earlier proof;
 * opaque is also simply more honest about what a real photo will do.
 */
export default function AssetPlaceholder({
  image,
  className = "",
  aspectClassName,
}: {
  image: ProductImage;
  className?: string;
  /** Overrides the image's own ratio — used for editorial "featured" tiles
   *  that need a wider/taller crop than the source data specifies. */
  aspectClassName?: string;
}) {
  return (
    <div
      className={`relative flex items-center justify-center bg-[#1a1a1d] ${aspectClassName ?? RATIO_CLASS[image.ratio]} ${className}`}
    >
      <span className="px-6 text-center text-[11px] uppercase tracking-[0.18em] text-grape-ink/70">
        {image.alt}
      </span>
    </div>
  );
}
