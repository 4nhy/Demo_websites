"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/format";
import AssetImage from "@/components/product/AssetImage";
import CatalogueTag from "@/components/product/CatalogueTag";

// Focus indicator is a real outline (acid-lime, the site's one accent
// color — 18:1 against the chrome-white bg) rather than the border-opacity
// shift alone the Stage 5 audit flagged: that shift was too subtle to read
// as "focused" at a glance. `outline` (not the default `outline-none` +
// browser auto-ring) so the ring color/offset stay consistent with the
// dark palette instead of the UA's default blue.
const FIELD_CLASS =
  "border border-grape-ink/20 bg-transparent px-3 py-2.5 text-sm text-grape-ink transition-colors focus:border-acid-lime focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-acid-lime";
const LABEL_CLASS = "flex flex-col gap-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-grape-ink/60";

/**
 * Demo checkout — local state only. No payment fields exist anywhere on
 * this page or in the data it produces; "Place Order" simulates completion
 * and moves the bagged items to the session's sold ledger. Brought into the
 * shared ANGEL WIRE system (mono field labels, sharp-cornered inputs, the
 * same masthead/eyebrow pattern as every other page, real order-summary
 * imagery via AssetImage) without turning a functional form into a set
 * piece — no new motion here, this stays restrained and usable on purpose.
 * Every field now carries an explicit `id`/`name`/`autoComplete`, fixing
 * the gap the Stage 5 audit flagged.
 *
 * Split out of app/checkout/page.tsx (which is a Server Component now, so
 * it can export its own `metadata`) — this is the "use client" half that
 * actually needs state/router/cart access, same split as About/Shop.
 */
export default function CheckoutForm() {
  const router = useRouter();
  const { items, subtotal, completeCheckout } = useCart();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [pincode, setPincode] = useState("");

  if (items.length === 0) {
    return (
      <main className="px-6 py-24 text-center sm:px-10">
        <p className="font-display text-2xl italic text-grape-ink/70">Your bag is empty.</p>
        <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.14em] text-grape-ink/70">
          Nothing to check out yet.
        </p>
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

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    completeCheckout({ name, email }, { address, city, pincode });
    router.push("/checkout/confirmation");
  }

  return (
    <main className="bg-chrome-white">
      <div className="px-6 pt-14 sm:px-10 sm:pt-20">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-bubblegum/70">
          Edt. 12 — Checkout
        </p>
        <h1 className="mt-2 font-display text-[clamp(2.2rem,6vw,3.6rem)] italic leading-[0.95] text-grape-ink">
          Ship it.
        </h1>
        <p className="mt-2 max-w-md font-mono text-[10px] uppercase tracking-[0.14em] text-grape-ink/70">
          Demo flow — no payment is collected or processed.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-12 px-6 py-10 sm:grid-cols-2 sm:gap-16 sm:px-10 sm:py-14">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <fieldset className="flex flex-col gap-4">
            <legend className="font-mono text-[10px] uppercase tracking-[0.16em] text-grape-ink/50">
              Contact
            </legend>
            <label htmlFor="checkout-name" className={LABEL_CLASS}>
              Name
              <input
                id="checkout-name"
                name="name"
                autoComplete="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={FIELD_CLASS}
              />
            </label>
            <label htmlFor="checkout-email" className={LABEL_CLASS}>
              Email
              <input
                id="checkout-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={FIELD_CLASS}
              />
            </label>
          </fieldset>

          <fieldset className="flex flex-col gap-4">
            <legend className="font-mono text-[10px] uppercase tracking-[0.16em] text-grape-ink/50">
              Shipping
            </legend>
            <label htmlFor="checkout-address" className={LABEL_CLASS}>
              Address
              <input
                id="checkout-address"
                name="address"
                autoComplete="street-address"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className={FIELD_CLASS}
              />
            </label>
            <div className="flex gap-4">
              <label htmlFor="checkout-city" className={`min-w-0 flex-1 ${LABEL_CLASS}`}>
                City
                <input
                  id="checkout-city"
                  name="city"
                  autoComplete="address-level2"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className={`w-full min-w-0 ${FIELD_CLASS}`}
                />
              </label>
              <label htmlFor="checkout-pincode" className={`min-w-0 flex-1 ${LABEL_CLASS}`}>
                Pincode
                <input
                  id="checkout-pincode"
                  name="pincode"
                  autoComplete="postal-code"
                  inputMode="numeric"
                  required
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className={`w-full min-w-0 ${FIELD_CLASS}`}
                />
              </label>
            </div>
          </fieldset>

          <button
            type="submit"
            className="mt-2 w-full border border-grape-ink bg-grape-ink px-4 py-3.5 text-xs font-medium uppercase tracking-[0.18em] text-chrome-white transition-colors duration-200 hover:bg-grape-ink/90"
          >
            Place Order — {formatPrice(subtotal)}
          </button>
        </form>

        <div>
          <h2 className="font-mono text-[10px] uppercase tracking-[0.18em] text-grape-ink/50">
            Order Summary
          </h2>
          <ul className="mt-6">
            {items.map((product) => (
              <li key={product.id} className="flex gap-4 border-b border-grape-ink/10 py-5 first:pt-0">
                {product.images[0] && (
                  <div className="relative w-20 shrink-0">
                    <AssetImage image={product.images[0]} />
                    <CatalogueTag
                      id={product.id}
                      className="pointer-events-none absolute left-1 top-1 scale-[0.85] origin-top-left"
                    />
                  </div>
                )}
                <div className="flex flex-1 items-start justify-between">
                  <div>
                    <p className="font-display text-base italic text-grape-ink">{product.name}</p>
                    <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.1em] text-grape-ink/70">
                      Size {product.size}
                    </p>
                  </div>
                  <p className="whitespace-nowrap text-sm text-grape-ink">{formatPrice(product.price)}</p>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.1em]">
            <span className="text-grape-ink/60">Subtotal</span>
            <span className="text-grape-ink">{formatPrice(subtotal)}</span>
          </div>
        </div>
      </div>
    </main>
  );
}
