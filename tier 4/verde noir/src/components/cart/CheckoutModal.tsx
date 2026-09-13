"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/products";
import { prefersReducedMotion } from "@/lib/motion";
import { useFocusTrap } from "@/lib/use-focus-trap";

type Errors = Partial<Record<"name" | "email" | "card" | "expiry" | "cvc", string>>;

// Invalid fields get a danger-tinted border, not just a gold caption
// beneath them — gold reads as CTA/accent elsewhere on the page, so it
// doesn't read as "wrong" on its own; this gives the error its own
// dual-channel (border + text) signal instead of borrowing the accent.
function fieldClass(hasError: boolean) {
  return `w-full rounded-lg border bg-panel px-3.5 py-2.5 text-sm text-cream placeholder:text-cream-dim/50 focus:border-gold ${
    hasError ? "border-danger" : "border-cream/15"
  }`;
}

function validateExpiry(value: string): boolean {
  const match = /^(0[1-9]|1[0-2])\/(\d{2})$/.exec(value);
  if (!match) return false;
  const month = Number(match[1]);
  const year = 2000 + Number(match[2]);
  const now = new Date();
  const expiryDate = new Date(year, month); // first day of month *after* expiry
  return expiryDate.getTime() > now.getTime();
}

export default function CheckoutModal() {
  const { isCheckoutOpen, closeCheckout, items, subtotal, clearCart } = useCart();
  const panelRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [card, setCard] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [placed, setPlaced] = useState(false);

  useFocusTrap(panelRef, isCheckoutOpen);

  useEffect(() => {
    if (!panelRef.current || !backdropRef.current) return;
    const reduced = prefersReducedMotion();

    if (isCheckoutOpen) {
      gsap.set([panelRef.current, backdropRef.current], { pointerEvents: "auto" });
      if (reduced) {
        gsap.set(panelRef.current, { opacity: 1, scale: 1 });
        gsap.set(backdropRef.current, { opacity: 1 });
      } else {
        gsap.to(backdropRef.current, { opacity: 1, duration: 0.3, ease: "power3.out" });
        gsap.fromTo(
          panelRef.current,
          { opacity: 0, scale: 0.92, y: 16 },
          { opacity: 1, scale: 1, y: 0, duration: 0.55, ease: "back.out(1.6)" }
        );
      }
    } else {
      if (reduced) {
        gsap.set(panelRef.current, { opacity: 0 });
        gsap.set(backdropRef.current, { opacity: 0 });
        gsap.set([panelRef.current, backdropRef.current], { pointerEvents: "none" });
      } else {
        gsap.to(panelRef.current, { opacity: 0, scale: 0.94, y: 12, duration: 0.35, ease: "power2.in" });
        gsap.to(backdropRef.current, {
          opacity: 0,
          duration: 0.35,
          ease: "power2.in",
          onComplete: () => {
            gsap.set([panelRef.current, backdropRef.current], { pointerEvents: "none" });
          },
        });
      }
    }
  }, [isCheckoutOpen]);

  const handleClose = useCallback(() => {
    closeCheckout();
    setTimeout(() => {
      setPlaced(false);
      setName("");
      setEmail("");
      setCard("");
      setExpiry("");
      setCvc("");
      setErrors({});
    }, 400);
  }, [closeCheckout]);

  useEffect(() => {
    if (!isCheckoutOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isCheckoutOpen, handleClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const digitsOnly = card.replace(/\s+/g, "");
    const nextErrors: Errors = {};

    if (name.trim().length < 2) nextErrors.name = "Enter the name on the card.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) nextErrors.email = "Enter a valid email address.";
    if (!/^\d{13,19}$/.test(digitsOnly)) nextErrors.card = "Card number should be 13–19 digits.";
    if (!validateExpiry(expiry)) nextErrors.expiry = "Use MM/YY, and it can't be expired.";
    if (!/^\d{3}$/.test(cvc)) nextErrors.cvc = "CVC is 3 digits.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setPlaced(true);
    clearCart();
  };

  return (
    <>
      <div
        ref={backdropRef}
        onClick={handleClose}
        aria-hidden="true"
        className="fixed inset-0 z-50 bg-bg/80 opacity-0"
        style={{ pointerEvents: "none" }}
      />
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ pointerEvents: "none" }}
      >
        <div
          ref={panelRef}
          role="dialog"
          aria-label="Checkout"
          aria-modal="true"
          className="w-full max-w-md rounded-2xl border border-cream/10 bg-panel-raised p-7 opacity-0"
          style={{ pointerEvents: isCheckoutOpen ? "auto" : "none" }}
        >
          {placed ? (
            <div className="py-6 text-center">
              <p className="font-display mb-2 text-2xl text-cream">Order placed.</p>
              <p className="mb-6 text-sm text-cream-dim">
                Confirmation sent to {email}. Your plants ship within 48 hours.
              </p>
              <button
                type="button"
                onClick={handleClose}
                className="rounded-full bg-gold px-6 py-2.5 text-sm font-medium text-bg hover:bg-gold-bright"
              >
                Done
              </button>
            </div>
          ) : (
            <>
              <div className="mb-5 flex items-center justify-between">
                <h2 className="font-display text-xl text-cream">Checkout</h2>
                <button
                  type="button"
                  onClick={handleClose}
                  aria-label="Close checkout"
                  className="text-cream-dim hover:text-cream"
                >
                  ✕
                </button>
              </div>

              <p className="mb-5 flex items-center justify-between text-sm">
                <span className="text-cream-dim">{items.length} item{items.length === 1 ? "" : "s"}</span>
                <span className="text-cream">{formatPrice(subtotal)}</span>
              </p>

              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                <div>
                  <label className="mb-1 block text-xs text-cream-dim" htmlFor="co-name">
                    Name on card
                  </label>
                  <input
                    id="co-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    aria-invalid={!!errors.name}
                    className={fieldClass(!!errors.name)}
                  />
                  {errors.name && <p className="mt-1 text-xs text-danger-bright">{errors.name}</p>}
                </div>

                <div>
                  <label className="mb-1 block text-xs text-cream-dim" htmlFor="co-email">
                    Email
                  </label>
                  <input
                    id="co-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    aria-invalid={!!errors.email}
                    className={fieldClass(!!errors.email)}
                  />
                  {errors.email && <p className="mt-1 text-xs text-danger-bright">{errors.email}</p>}
                </div>

                <div>
                  <label className="mb-1 block text-xs text-cream-dim" htmlFor="co-card">
                    Card number
                  </label>
                  <input
                    id="co-card"
                    inputMode="numeric"
                    value={card}
                    onChange={(e) => setCard(e.target.value)}
                    placeholder="4242 4242 4242 4242"
                    aria-invalid={!!errors.card}
                    className={fieldClass(!!errors.card)}
                  />
                  {errors.card && <p className="mt-1 text-xs text-danger-bright">{errors.card}</p>}
                </div>

                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="mb-1 block text-xs text-cream-dim" htmlFor="co-expiry">
                      Expiry (MM/YY)
                    </label>
                    <input
                      id="co-expiry"
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                      placeholder="MM/YY"
                      aria-invalid={!!errors.expiry}
                      className={fieldClass(!!errors.expiry)}
                    />
                    {errors.expiry && <p className="mt-1 text-xs text-danger-bright">{errors.expiry}</p>}
                  </div>
                  <div className="flex-1">
                    <label className="mb-1 block text-xs text-cream-dim" htmlFor="co-cvc">
                      CVC
                    </label>
                    <input
                      id="co-cvc"
                      inputMode="numeric"
                      value={cvc}
                      onChange={(e) => setCvc(e.target.value)}
                      placeholder="123"
                      aria-invalid={!!errors.cvc}
                      className={fieldClass(!!errors.cvc)}
                    />
                    {errors.cvc && <p className="mt-1 text-xs text-danger-bright">{errors.cvc}</p>}
                  </div>
                </div>

                <button
                  type="submit"
                  className="mt-2 w-full rounded-full bg-gold py-3 text-sm font-medium text-bg transition-colors hover:bg-gold-bright"
                >
                  Place Order — {formatPrice(subtotal)}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </>
  );
}
