"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/format";
import AssetImage from "@/components/product/AssetImage";
import CatalogueTag from "@/components/product/CatalogueTag";
import SoldBadge from "@/components/product/SoldBadge";

/**
 * Split out of app/checkout/confirmation/page.tsx (now a Server Component
 * so it can export `metadata`) — same reasoning as CheckoutForm.
 */
export default function OrderConfirmation() {
  const { lastOrder } = useCart();

  if (!lastOrder) {
    return (
      <main className="px-6 py-24 text-center sm:px-10">
        <p className="font-display text-2xl italic text-grape-ink/70">No recent order found.</p>
        <Link
          href="/shop"
          className="mt-6 inline-flex items-center gap-2 border border-grape-ink bg-grape-ink px-8 py-3 text-xs font-medium uppercase tracking-[0.18em] text-chrome-white transition-colors duration-200 hover:bg-grape-ink/90"
        >
          Browse the Archive
          <span aria-hidden="true">→</span>
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-lg px-6 py-20 text-center sm:px-10 sm:py-28">
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-acid-lime">Order Placed</p>
      <h1 className="mt-3 font-display text-[clamp(2rem,6vw,3.2rem)] italic leading-[0.95] text-grape-ink">
        Thank you, {lastOrder.contact.name.split(" ")[0] || "you"}.
      </h1>
      <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.12em] text-grape-ink/70">
        Order {lastOrder.id} — every piece below is now permanently sold.
      </p>

      <ul className="mt-10 text-left">
        {lastOrder.items.map((product) => (
          <li
            key={product.id}
            className="flex items-center gap-4 border-b border-grape-ink/10 py-4 first:pt-0"
          >
            {product.images[0] && (
              <div className="relative w-16 shrink-0">
                <AssetImage image={product.images[0]} />
                <CatalogueTag
                  id={product.id}
                  className="pointer-events-none absolute left-1 top-1 scale-[0.8] origin-top-left"
                />
              </div>
            )}
            <span className="flex-1 font-display text-sm italic text-grape-ink">{product.name}</span>
            <SoldBadge />
            <span className="whitespace-nowrap text-sm text-grape-ink">{formatPrice(product.price)}</span>
          </li>
        ))}
      </ul>
      <div className="mt-4 flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.1em]">
        <span className="text-grape-ink/60">Total</span>
        <span className="text-grape-ink">{formatPrice(lastOrder.subtotal)}</span>
      </div>

      <p className="mt-8 font-mono text-[9px] uppercase tracking-[0.12em] text-grape-ink/70">
        Shipping to {lastOrder.shipping.address}, {lastOrder.shipping.city} {lastOrder.shipping.pincode}
      </p>

      <Link
        href="/shop"
        className="mt-10 inline-flex items-center gap-2 border border-grape-ink bg-grape-ink px-8 py-3 text-xs font-medium uppercase tracking-[0.18em] text-chrome-white transition-colors duration-200 hover:bg-grape-ink/90"
      >
        Continue Browsing
        <span aria-hidden="true">→</span>
      </Link>
    </main>
  );
}
