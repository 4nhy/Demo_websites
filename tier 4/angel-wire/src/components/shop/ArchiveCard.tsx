"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { CATEGORY_LABEL, formatPrice } from "@/lib/format";
import type { Product } from "@/lib/types";
import AssetImage from "@/components/product/AssetImage";
import CatalogueTag from "@/components/product/CatalogueTag";
import SoldBadge from "@/components/product/SoldBadge";
import AddToBagButton from "@/components/product/AddToBagButton";

/**
 * The Archive's catalogue entry — deliberately not "ProductCard again." Two
 * real mechanics from the reference research live here: the primary/detail
 * image swap on hover uses each product's own second photo (already in the
 * data, unused everywhere else), and `featured` gives roughly one piece in
 * six a larger, taller frame — a fixed, deterministic set (derived from the
 * catalogue number, not scroll/filter order) so the grid keeps the same
 * asymmetric rhythm no matter which category tab is active.
 */
export default function ArchiveCard({
  product,
  featured = false,
}: {
  product: Product;
  featured?: boolean;
}) {
  const { isSold } = useCart();
  const sold = isSold(product);
  const primary = product.images[0];
  const secondary = product.images[1];

  return (
    <article
      data-archive-num={Number(product.id.slice(-3))}
      className={`group relative flex flex-col ${featured ? "sm:col-span-2" : ""}`}
    >
      <Link
        href={`/shop/${product.slug}`}
        className="relative block overflow-hidden bg-chrome-white shadow-[0_0_0_rgba(0,0,0,0)] transition-shadow duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-grape-ink group-hover:shadow-[0_24px_44px_-18px_rgba(0,0,0,0.55)]"
      >
        {primary && (
          <div className="relative">
            {/* Was a bare scale-[1.02] — barely registered as a hover state.
                A heavier scale + a slight lift reads as the object actually
                responding, not just a subtle zoom; longer duration keeps it
                feeling weighted rather than snappy/digital. One combined
                arbitrary `transform` value, not separate translate-y/scale
                utilities — Tailwind wasn't composing those two into one
                transform under the same group-hover variant (verified: the
                className was present, :hover matched, but computed
                transform stayed "none"). */}
            <div
              className={`transition-transform duration-500 ease-out group-hover:[transform:translateY(-4px)_scale(1.06)] ${
                sold ? "opacity-60" : ""
              }`}
            >
              <AssetImage image={primary} aspectClassName={featured ? "aspect-[16/10]" : undefined} />
            </div>
            {secondary && !sold && (
              <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <AssetImage image={secondary} aspectClassName={featured ? "aspect-[16/10]" : undefined} />
              </div>
            )}
          </div>
        )}
        <CatalogueTag id={product.id} className="pointer-events-none absolute left-3 top-3" />
        {sold && <SoldBadge className="absolute right-3 top-3" />}
        {!sold && (
          <span className="pointer-events-none absolute bottom-3 left-3 font-mono text-[9px] uppercase tracking-[0.16em] text-grape-ink opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            View Piece
          </span>
        )}
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
