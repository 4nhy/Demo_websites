"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/products";
import { prefersReducedMotion } from "@/lib/motion";
import { useFocusTrap } from "@/lib/use-focus-trap";

export default function CartDrawer() {
  const { isDrawerOpen, closeDrawer, items, subtotal, setQty, removeItem, openCheckout, count } =
    useCart();
  const panelRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  useFocusTrap(panelRef, isDrawerOpen);

  useEffect(() => {
    if (!panelRef.current || !backdropRef.current) return;
    const reduced = prefersReducedMotion();

    if (isDrawerOpen) {
      gsap.set([panelRef.current, backdropRef.current], { pointerEvents: "auto" });
      if (reduced) {
        gsap.set(panelRef.current, { x: 0 });
        gsap.set(backdropRef.current, { opacity: 1 });
      } else {
        gsap.to(backdropRef.current, { opacity: 1, duration: 0.3, ease: "power3.out" });
        gsap.to(panelRef.current, { x: 0, duration: 0.6, ease: "back.out(1.7)" });
      }
    } else {
      if (reduced) {
        gsap.set(panelRef.current, { x: "100%" });
        gsap.set(backdropRef.current, { opacity: 0 });
        gsap.set([panelRef.current, backdropRef.current], { pointerEvents: "none" });
      } else {
        gsap.to(panelRef.current, { x: "100%", duration: 0.4, ease: "power2.in" });
        gsap.to(backdropRef.current, {
          opacity: 0,
          duration: 0.4,
          ease: "power2.in",
          onComplete: () => {
            gsap.set([panelRef.current, backdropRef.current], { pointerEvents: "none" });
          },
        });
      }
    }
  }, [isDrawerOpen]);

  useEffect(() => {
    if (!isDrawerOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeDrawer();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isDrawerOpen, closeDrawer]);

  return (
    <>
      <div
        ref={backdropRef}
        onClick={closeDrawer}
        aria-hidden="true"
        className="fixed inset-0 z-50 bg-bg/70 opacity-0"
        style={{ pointerEvents: "none" }}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-label="Shopping cart"
        aria-modal="true"
        className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-panel-raised"
        style={{ transform: "translateX(100%)", pointerEvents: "none" }}
      >
        <div className="flex items-center justify-between border-b border-cream/10 px-6 py-5">
          <h2 className="font-display text-lg text-cream">
            Cart {count > 0 && <span className="text-cream-dim">({count})</span>}
          </h2>
          <button
            type="button"
            onClick={closeDrawer}
            aria-label="Close cart"
            className="text-cream-dim hover:text-cream"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <p className="mt-10 text-center text-sm text-cream-dim">
              Your cart is empty. The jungle awaits.
            </p>
          ) : (
            <ul className="space-y-5">
              {items.map(({ product, qty, lineTotal }) => (
                <li key={product.id} className="flex gap-4">
                  <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-lg bg-panel">
                    <Image
                      src={product.image}
                      alt=""
                      fill
                      sizes="64px"
                      className="object-cover"
                      style={{ filter: "brightness(0.78) saturate(1.08) sepia(0.05)" }}
                    />
                  </div>
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm text-cream">{product.name}</p>
                      <p className="whitespace-nowrap text-sm text-gold-bright">
                        {formatPrice(lineTotal)}
                      </p>
                    </div>
                    <div className="mt-auto flex items-center gap-3">
                      <div className="flex items-center rounded-full border border-cream/15">
                        <button
                          type="button"
                          onClick={() => setQty(product.id, qty - 1)}
                          aria-label={`Decrease quantity of ${product.name}`}
                          className="px-2.5 py-1 text-cream-dim hover:text-cream"
                        >
                          −
                        </button>
                        <span className="min-w-6 text-center text-sm text-cream">{qty}</span>
                        <button
                          type="button"
                          onClick={() => setQty(product.id, qty + 1)}
                          aria-label={`Increase quantity of ${product.name}`}
                          className="px-2.5 py-1 text-cream-dim hover:text-cream"
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(product.id)}
                        className="text-xs text-cream-dim underline decoration-cream-dim/40 underline-offset-2 hover:text-gold-bright"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="border-t border-cream/10 px-6 py-5">
          <div className="mb-4 flex items-center justify-between text-sm">
            <span className="text-cream-dim">Subtotal</span>
            <span className="text-cream">{formatPrice(subtotal)}</span>
          </div>
          <button
            type="button"
            disabled={items.length === 0}
            onClick={() => {
              closeDrawer();
              openCheckout();
            }}
            className="w-full rounded-full bg-gold py-3 text-sm font-medium text-bg transition-colors hover:bg-gold-bright disabled:cursor-not-allowed disabled:opacity-40"
          >
            Checkout
          </button>
        </div>
      </div>
    </>
  );
}
