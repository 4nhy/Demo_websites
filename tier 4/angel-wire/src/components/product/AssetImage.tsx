import Image from "next/image";
import type { ProductImage } from "@/lib/types";
import { getRealImage } from "@/data/asset-manifest";
import AssetPlaceholder from "./AssetPlaceholder";

const RATIO_CLASS: Record<ProductImage["ratio"], string> = {
  "4:5": "aspect-[4/5]",
  "1:1": "aspect-square",
  "3:4": "aspect-[3/4]",
};

/**
 * The one place that decides "real photo or placeholder" — every page built
 * from here on renders images through this component instead of reaching
 * for AssetPlaceholder directly. When `src` beyond `image.id` isn't given,
 * it looks the id up in the asset manifest; found → a real, properly sized
 * next/image; not found → the same AssetPlaceholder box every earlier
 * section already uses, so nothing downstream needs special-casing while
 * imagery is still incomplete.
 */
export default function AssetImage({
  image,
  className = "",
  priority = false,
  sizes,
  aspectClassName,
}: {
  image: ProductImage;
  className?: string;
  priority?: boolean;
  sizes?: string;
  /** Overrides the image's own ratio — used for editorial "featured" tiles
   *  that need a wider/taller crop than the source data specifies. object-cover
   *  handles the crop correctly either way. */
  aspectClassName?: string;
}) {
  const real = getRealImage(image.id);

  if (!real) {
    return <AssetPlaceholder image={image} className={className} aspectClassName={aspectClassName} />;
  }

  return (
    <div className={`relative overflow-hidden ${aspectClassName ?? RATIO_CLASS[image.ratio]} ${className}`}>
      <Image
        src={real.src}
        alt={image.alt}
        fill
        priority={priority}
        sizes={sizes ?? "(min-width: 768px) 50vw, 100vw"}
        className="object-cover"
      />
    </div>
  );
}
