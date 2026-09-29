"use client";

import { useCart } from "@/context/CartContext";
import type { Product } from "@/lib/types";

export default function AddToBagButton({
  product,
  className = "",
}: {
  product: Product;
  className?: string;
}) {
  const { isSold, isInBag, addItem, removeItem } = useCart();

  if (isSold(product)) {
    return (
      <button
        type="button"
        disabled
        aria-disabled="true"
        className={`w-full cursor-not-allowed border border-grape-ink/15 bg-transparent px-4 py-3 text-xs font-medium uppercase tracking-[0.16em] text-grape-ink/70 ${className}`}
      >
        Sold
      </button>
    );
  }

  const inBag = isInBag(product.id);

  return (
    <button
      type="button"
      onClick={() => (inBag ? removeItem(product.id) : addItem(product.id))}
      aria-pressed={inBag}
      className={`w-full border border-grape-ink px-4 py-3 text-xs font-medium uppercase tracking-[0.16em] transition-colors duration-200 ${
        inBag
          ? "bg-chrome-white text-grape-ink hover:bg-grape-ink/5"
          : "bg-grape-ink text-chrome-white hover:bg-grape-ink/90"
      } ${className}`}
    >
      {inBag ? "In Bag — Remove" : "Add to Bag"}
    </button>
  );
}
