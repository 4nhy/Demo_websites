"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { CATEGORY_LABEL, formatPrice } from "@/lib/format";
import type { Product } from "@/lib/types";
import AssetImage from "./AssetImage";
import CatalogueTag from "./CatalogueTag";
import SoldBadge from "./SoldBadge";
import AddToBagButton from "./AddToBagButton";

/**
 * Catalogue card — image, name, price, category, availability, Add to Bag,
 * sold state. Same functional component used everywhere a product appears
 * (shop grid, collections, related pieces, and now the homepage) so
 * availability/cart behavior can never drift between contexts. Styling
 * brought onto the Stage 4 token system; no props, behavior, or DOM
 * semantics changed from the ecommerce-foundation version.
 */
export default function ProductCard({ product }: { product: Product }) {
  const { isSold } = useCart();
  const sold = isSold(product);
  const primaryImage = product.images[0];

  return (
    <article className="group relative flex flex-col">
      <Link
        href={`/shop/${product.slug}`}
        className="relative block overflow-hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-grape-ink"
      >
        {primaryImage && (
          <div className="overflow-hidden">
            <div className="transition-transform duration-500 ease-out group-hover:scale-[1.03]">
              <AssetImage image={primaryImage} className={sold ? "opacity-60" : ""} />
            </div>
          </div>
        )}
        <CatalogueTag id={product.id} className="pointer-events-none absolute left-3 top-3" />
        {sold && <SoldBadge className="absolute right-3 top-3" />}
        <span className="pointer-events-none absolute bottom-3 left-3 font-mono text-[10px] uppercase tracking-[0.18em] text-grape-ink opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          View Piece
        </span>
      </Link>

      <div className="mt-3 flex items-start justify-between gap-3 border-t border-grape-ink/10 pt-3">
        <div>
          <h3 className="font-display text-base italic text-grape-ink">
            <Link href={`/shop/${product.slug}`}>{product.name}</Link>
          </h3>
          <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-grape-ink/50">
            {CATEGORY_LABEL[product.category]}
          </p>
        </div>
        <p className="whitespace-nowrap text-sm text-grape-ink">{formatPrice(product.price)}</p>
      </div>

      <div className="mt-3">
        <AddToBagButton product={product} />
      </div>
    </article>
  );
}
