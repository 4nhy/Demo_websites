import { formatPrice } from "@/lib/format";
import type { Product } from "@/lib/types";
import AssetImage from "@/components/product/AssetImage";
import CatalogueTag from "@/components/product/CatalogueTag";

export default function BagLineItem({
  product,
  onRemove,
}: {
  product: Product;
  onRemove: (id: string) => void;
}) {
  const image = product.images[0];
  return (
    <li className="flex gap-4 border-b border-grape-ink/10 py-5 first:pt-0">
      {image && (
        <div className="relative w-20 shrink-0">
          <AssetImage image={image} />
          <CatalogueTag id={product.id} className="pointer-events-none absolute left-1 top-1 scale-[0.85] origin-top-left" />
        </div>
      )}
      <div className="flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <p className="font-display text-base italic leading-tight text-grape-ink">{product.name}</p>
          <p className="whitespace-nowrap text-sm text-grape-ink">{formatPrice(product.price)}</p>
        </div>
        <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.12em] text-grape-ink/70">
          Size {product.size} · One of one
        </p>
        <button
          type="button"
          onClick={() => onRemove(product.id)}
          className="mt-2 self-start font-mono text-[10px] uppercase tracking-[0.14em] text-grape-ink/50 underline decoration-grape-ink/30 underline-offset-2 hover:text-grape-ink"
        >
          Remove
        </button>
      </div>
    </li>
  );
}
