# ANGEL WIRE — Ecommerce Architecture Proposal

Status: **built.** Everything described in this document — full DISCOVER → VIEW
PIECE → ADD TO BAG → CHECKOUT journey, all listed routes and components,
`CartContext`, the sold-ledger merge in `availability.ts` — exists in the
codebase as of this pass (2026-09-11), matching this proposal closely. A few
names differ slightly from what's actually in `src/`: there's no
`CharmCard.tsx` (the homepage's product-card variant is folded into the
section components themselves) and no standalone `Footer.tsx` (the finale/
footer beat lives in `FinaleTag.tsx`). The three "open questions" at the
bottom were resolved during the build — see the note under §4.

---

## 1. Component architecture

```
src/
  app/
    layout.tsx                 — CartProvider + SmoothScroll + SiteHeader + BagDrawer (global)
    page.tsx                   — homepage (not built yet — see §4)
    shop/
      page.tsx                 — SHOP: full catalogue, ProductGrid
      [slug]/
        page.tsx                — PRODUCT DETAIL
    collections/
      page.tsx                 — COLLECTIONS index
      [collection]/
        page.tsx                — one collection's filtered ProductGrid
    about/
      page.tsx                 — ABOUT (editorial, no commerce)
    checkout/
      page.tsx                 — CHECKOUT (local-state stepper: contact → shipping → review)
      confirmation/
        page.tsx                — order placed, items marked sold, bag cleared

  components/
    layout/
      SiteHeader.tsx            — SHOP / COLLECTIONS / ABOUT / BAG(count) — the "dock nav"
      Footer.tsx
    product/
      ProductCard.tsx           — catalogue-grid card (image, name, category, price, availability, Add to Bag)
      CharmCard.tsx              — homepage charm-rail variant of ProductCard (same data, tighter frame)
      ProductGrid.tsx            — catalogue layout wrapper (mixed-span, not a uniform grid — see ledger)
      ProductGallery.tsx         — detail-page image set with transition
      ProductInfo.tsx            — price / size / condition / material / description block
      AddToBagButton.tsx         — shared control; renders Add to Bag / In Bag / Sold
      SoldBadge.tsx
      RelatedPieces.tsx          — same-category pieces, sold pieces included (see §2 note)
    bag/
      BagDrawer.tsx              — the animated overlay panel
      BagLineItem.tsx
      BagSummary.tsx             — subtotal + checkout CTA
      EmptyBagState.tsx
    checkout/
      CheckoutStepper.tsx        — local-state step machine (no route changes per step)
      ContactStep.tsx / ShippingStep.tsx / ReviewStep.tsx
      OrderSummary.tsx
    AngelWire.tsx                — existing, unchanged mechanism — reattached to real anchors (§4)
    SmoothScroll.tsx             — existing, unchanged

  context/
    CartContext.tsx              — cart state, drawer open/close, checkout, sold ledger (see §2)

  data/
    products.ts                  — static fictional catalogue (source of truth)
    collections.ts                — collection metadata + membership

  lib/
    types.ts                     — Product, CartItem, Order, Collection
    format.ts                    — INR formatter, condition/category label maps
    availability.ts               — getAvailability(product, soldIds) — single source of truth for SOLD
    wire-path.ts                  — existing, unchanged
```

**Why a Context instead of a route-level cart:** App Router keeps `layout.tsx` mounted
across navigations within it, so a `CartProvider` placed there already satisfies
"persistent while navigating" with zero extra work. I'll additionally mirror cart
state to `localStorage` (survives a hard refresh) — cheap, and the honest answer to
what happens if someone reloads mid-shop.

**Why availability is computed, not stored per-render:** `product.availability` in
the static data is the *seed* state (some pieces ship pre-marked SOLD, to prove the
state exists without requiring a live checkout first). Anything sold *during* the
session lives in `CartContext`'s `soldIds`. `getAvailability()` merges both, so
there is exactly one place that decides SOLD — no component re-derives it
independently, which is how "no longer allow Add to Bag" stays true everywhere at
once (grid, detail page, related pieces, bag itself if something goes stale).

---

## 2. Product data structure

```ts
// lib/types.ts

export type Category =
  | "outerwear" | "tops" | "bottoms" | "dresses" | "accessories" | "footwear" | "bags";

export type Condition = "deadstock" | "excellent" | "good" | "loved";
// deadstock — old stock, never worn · excellent — worn, pristine
// good — honest gentle wear · loved — well-worn, characterful (brand voice, not a downgrade)

export type Availability = "available" | "sold";

export type ProductImage = {
  src: string;        // path once generated; placeholder graphic until then (per ASSETS.md fallback)
  alt: string;
  ratio: "4:5" | "1:1" | "3:4";
};

export interface Product {
  id: string;                 // stable id, e.g. "aw-0001"
  slug: string;                // URL segment, e.g. "chrome-heart-pendant"
  name: string;
  price: number;                // INR, whole rupees — ₹4,200 stored as 4200
  category: Category;
  size: string;                  // free text — vintage sizing doesn't fit a clean enum ("UK 8", "One Size")
  condition: Condition;
  material: string;
  description: string;           // provenance-voice copy, one piece = one story
  images: ProductImage[];
  availability: Availability;     // seed state — see §1 on how this merges with soldIds
  oneOfOne: boolean;               // true for the whole catalogue; modeled as a field, not assumed
  collection?: string;              // optional — ties into /collections/[collection]
}
```

```ts
// context/CartContext.tsx (shape only)

export type CartItem = { productId: string; addedAt: number }; // qty always 1 — no quantity field

export type Order = {
  id: string;
  items: Product[];
  subtotal: number;
  placedAt: number;
  contact: { name: string; email: string };
  shipping: { address: string; city: string; pincode: string };
};

type CartState = {
  itemIds: string[];
  soldIds: string[];       // populated on checkout completion — the session's sold ledger
  isDrawerOpen: boolean;
  lastOrder: Order | null;
};
```

**Add-to-bag rule (one-of-one specific):** a product id can be in `itemIds` at most
once — `AddToBagButton` reads three states off `getAvailability()` + `itemIds`:
`available` → "Add to Bag", already in `itemIds` → "In Bag" (acts as remove), `sold`
→ "SOLD" (disabled, no click handler at all — not just visually disabled).

**Related pieces deliberately include sold ones**, badge intact. For one-of-one
thrift, "this exact piece is gone" is part of the pitch, not a dead end — showing
the sold neighbor reinforces scarcity instead of hiding it.

---

## 3. User flow

```
DISCOVER
  Home (charm rail / mood grid / campaign spread)
  Shop (full catalogue, ProductGrid)
  Collections (curated subsets)
        │
        ▼  click a piece
VIEW PIECE
  /shop/[slug] — gallery, price, size, condition, material, description,
  related pieces
        │
        ├─ availability = sold ──────────────► SOLD badge, Add to Bag disabled,
        │                                        related pieces still browsable
        ▼  availability = available
ADD TO BAG
  AddToBagButton → CartContext.addItem(id)
  → BagDrawer opens automatically (GSAP slide-in)
  → SiteHeader's BAG count updates immediately (same context, no refetch)
  → user can keep shopping (drawer closes, count persists) or proceed
        │
        ▼  "Checkout" CTA in BagSummary
CHECKOUT
  /checkout — local-state stepper: Contact → Shipping → Review
  (no payment fields collected anywhere — explicitly out of scope)
        │
        ▼  "Place Order"
CONFIRMATION
  /checkout/confirmation
  → itemIds moved into soldIds (permanently SOLD for the session)
  → cart cleared, lastOrder stored
  → order summary shown (order id, pieces, subtotal, shipping info)
        │
        ▼
  Back to DISCOVER — the pieces just bought now show SOLD everywhere
  (grid, related-pieces, anywhere else they're referenced)
```

Edge cases the architecture accounts for: removing an item from the bag before
checkout (returns to `available`, button flips back to "Add to Bag"); visiting a
product detail page for something already sold directly via a shared link (renders
the sold state correctly on first paint, no flash of an "Add to Bag" button); an
empty bag (`EmptyBagState` inside `BagDrawer`, with a "browse the shop" link rather
than a dead panel).

---

## 4. Homepage section structure — as built

This section's original nine-item plan (including a literal "Charm rail" and
"Vitrine spotlight" beat) did not survive the build unchanged. **`DIRECTION.md`
is now the authoritative record of the actual eight-section structure and the
wire's real behavior** (it pivoted from a draggable charm rail to a single
scroll-scrubbed line threading behind/in front of every section) — this
document's job is the commerce layer below, which did land close to plan:

- Nav is a real top header (`SiteHeader.tsx`): SHOP / COLLECTIONS / ABOUT
  routes, BAG as a drawer-toggle with live count, not a 4th route — as
  planned.
- Every homepage section pulls real data (`products.ts`, `collections.ts`),
  not placeholder strings — as planned.
- The wire mechanism's anchor-id contract (`data-wire-anchor`,
  `data-wire-parallax`) is exactly as described — just serving a different
  path shape than originally sketched. See `DIRECTION.md`'s Signature
  section for the current behavior.
- Product hover treatment, gallery crossfade, and the bag drawer's slide-in
  are the Tier 4 micro-interactions layered on top, as planned — the hero
  scroll-scrub and the page-spanning wire are the orchestrated set-pieces.

---

## Resolved (were "open questions before I build")

1. **Checkout shape** — built as a single-route, local-state stepper
   (Contact → Shipping → Review) at `/checkout`, per the originally-proposed
   default. No per-step routes.
2. **Seed catalogue size** — 20 products shipped (`aw-0001`–`aw-0020`),
   matching the top of the proposed 16–20 range, each with two procedurally
   generated images (front + detail).
3. **Collections** — built as curated editorial groupings, explicitly *not*
   1:1 with `Category` (see the comment in `data/collections.ts`): Angel
   Hour, After Dark, Soft Damage, Found Objects — a dress, a bag, and a pair
   of shoes can share a collection by mood rather than type.
