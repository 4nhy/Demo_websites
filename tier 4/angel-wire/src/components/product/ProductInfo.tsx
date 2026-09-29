"use client";

import { useCart } from "@/context/CartContext";
import { CATEGORY_LABEL, CONDITION_LABEL, CONDITION_NOTE, formatPrice } from "@/lib/format";
import type { Product } from "@/lib/types";
import AddToBagButton from "./AddToBagButton";
import CatalogueTag from "./CatalogueTag";
import SoldBadge from "./SoldBadge";

export default function ProductInfo({ product }: { product: Product }) {
  const { isSold } = useCart();
  const sold = isSold(product);

  return (
    <div>
      <div className="flex items-center gap-3">
        <CatalogueTag id={product.id} />
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-grape-ink/50">
          {CATEGORY_LABEL[product.category]}
        </p>
      </div>

      <h1 className="mt-4 font-display text-[clamp(2rem,5vw,3.2rem)] italic leading-[0.98] text-grape-ink">
        {product.name}
      </h1>

      <div className="mt-4 flex items-center gap-3">
        <p className="text-lg text-grape-ink">{formatPrice(product.price)}</p>
        {sold && <SoldBadge />}
        {product.oneOfOne && !sold && (
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-bubblegum">
            One of one
          </span>
        )}
      </div>

      <p className="mt-6 max-w-prose text-sm leading-relaxed text-grape-ink/80">
        {product.description}
      </p>

      {/* the garment label — a real sewn-in tag's information hierarchy,
          mono type on a bordered block, not a plain definition list */}
      <dl className="mt-8 grid grid-cols-3 gap-x-4 gap-y-4 border border-grape-ink/15 p-5 font-mono text-[10px] uppercase tracking-[0.1em] sm:gap-x-6">
        <div>
          <dt className="text-grape-ink/70">Size</dt>
          <dd className="mt-1 text-grape-ink">{product.size}</dd>
        </div>
        <div>
          <dt className="text-grape-ink/70">Condition</dt>
          <dd className="mt-1 text-grape-ink" title={CONDITION_NOTE[product.condition]}>
            {CONDITION_LABEL[product.condition]}
          </dd>
        </div>
        <div>
          <dt className="text-grape-ink/70">Material</dt>
          <dd className="mt-1 text-grape-ink">{product.material}</dd>
        </div>
      </dl>

      <div className="mt-8 max-w-xs">
        <AddToBagButton product={product} />
      </div>
    </div>
  );
}
