"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useCart } from "@/context/CartContext";
import BagLineItem from "./BagLineItem";
import BagSummary from "./BagSummary";
import EmptyBagState from "./EmptyBagState";

/**
 * The bag as an ANGEL WIRE object, not a default UI panel — full art
 * direction is a later pass; this build establishes the real mechanism:
 * GSAP-driven slide/fade rather than a CSS class toggle, so it's already on
 * the Tier 4 motion system the rest of the site uses.
 */
export default function BagDrawer() {
  const { items, subtotal, isDrawerOpen, closeDrawer, removeItem } = useCart();
  const panelRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const panel = panelRef.current;
    const backdrop = backdropRef.current;
    if (!panel || !backdrop) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const duration = reduced ? 0 : 0.5;

    if (isDrawerOpen) {
      gsap.set(panel, { display: "flex" });
      gsap.set(backdrop, { display: "block" });
      gsap.fromTo(backdrop, { opacity: 0 }, { opacity: 1, duration, ease: "power2.out" });
      gsap.fromTo(
        panel,
        { xPercent: 100 },
        { xPercent: 0, duration, ease: reduced ? "none" : "power3.out" }
      );
    } else {
      gsap.to(backdrop, {
        opacity: 0,
        duration,
        ease: "power2.in",
        onComplete: () => gsap.set(backdrop, { display: "none" }),
      });
      gsap.to(panel, {
        xPercent: 100,
        duration,
        ease: reduced ? "none" : "power3.in",
        onComplete: () => gsap.set(panel, { display: "none" }),
      });
    }
  }, [isDrawerOpen]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") closeDrawer();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [closeDrawer]);

  return (
    <>
      <div
        ref={backdropRef}
        onClick={closeDrawer}
        aria-hidden="true"
        /* bg-chrome-white (Onyx dark, post-rebuild), not bg-grape-ink (now
           the light ink token) — a modal scrim must stay a dark overlay
           regardless of page theme. */
        className="fixed inset-0 z-40 hidden bg-chrome-white/30"
        style={{ display: "none" }}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-label="Bag"
        aria-modal="true"
        className="fixed inset-y-0 right-0 z-50 hidden w-full max-w-sm flex-col bg-chrome-white shadow-xl"
        style={{ display: "none" }}
      >
        <div className="flex items-center justify-between border-b border-grape-ink/10 px-6 py-5">
          <h2 className="font-mono text-[11px] uppercase tracking-[0.18em] text-grape-ink">
            Bag ({items.length})
          </h2>
          <button
            type="button"
            onClick={closeDrawer}
            aria-label="Close bag"
            className="font-mono text-[10px] uppercase tracking-[0.16em] text-grape-ink/50 hover:text-grape-ink"
          >
            Close
          </button>
        </div>

        {items.length === 0 ? (
          <EmptyBagState onNavigate={closeDrawer} />
        ) : (
          <>
            <ul className="flex-1 overflow-y-auto px-6">
              {items.map((product) => (
                <BagLineItem key={product.id} product={product} onRemove={removeItem} />
              ))}
            </ul>
            <BagSummary subtotal={subtotal} onCheckoutClick={closeDrawer} />
          </>
        )}
      </div>
    </>
  );
}
