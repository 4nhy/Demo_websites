"use client";

import { useCart } from "@/lib/cart-context";

// The one and only place add-to-cart is wired for this page — a plain
// button with its own onClick, not a parent card intercepting clicks
// meant for a link elsewhere on the page.
export default function ProductDetailActions({ productId }: { productId: string }) {
  const { addItem } = useCart();

  return (
    <button
      type="button"
      onClick={() => addItem(productId)}
      className="mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-gold px-7 py-3 text-sm font-medium text-bg transition-colors hover:bg-gold-bright"
    >
      Add to Cart
    </button>
  );
}
