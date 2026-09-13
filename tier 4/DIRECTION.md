# DIRECTION.md — Verde Noir

Rewritten to match what's actually shipped, after several rounds of corrective passes moved
the site well past the original brief. Treat this as the current source of truth; the previous
version (Fraunces/Inter, a sans photo-overlap hero, `CategoryCircles`/`BentoGrid`/`BrandMoment`,
a light-mint shop grid) describes an earlier iteration that no longer exists in the codebase.

## Brand

Verde Noir — dark-mode premium houseplant shop. Direct sale (cart + checkout), no backend.
Audience: people who want their space to look considered. The page's one job: browsing →
placed order.

## Tokens

```css
--bg: #0B1410;        /* page background */
--panel: #131F17;     /* section/card panel */
--panel-raised: #1B2A1F; /* elevated card, modal, drawer */
--green: #7C8B6F;
--green-light: #9CAD86;
--gold: #C9A227;      /* accent, CTAs, focus */
--gold-bright: #E0BE4A; /* hover/active state of gold */
--cream: #F3EEE1;     /* primary text on dark */
--cream-dim: #B9B6AA; /* secondary text on dark — use /70 opacity or higher for small
                          (<14px) label text; /60 and below fails WCAG AA on --bg */
--danger: #C1503F;        /* invalid-field borders */
--danger-bright: #E08874; /* error text — checkout validation errors, deliberately not
                              gold, since gold is the CTA/accent/price color elsewhere */
```

The dark palette is applied consistently across every page. `--mint` (`#E7EDE2`) is still
defined in `globals.css` but is no longer referenced by any component — the one page that used
it (`/shop/[id]`) was retheme'd dark. Treat `--mint` as retired; removing the token entirely is
a fine future cleanup but isn't load-bearing.

## Type

- Display/headlines: **Erode** (serif). Self-hosted via `next/font/local` from
  `public/fonts/erode/`, weights 400–700, `next/font`'s `display: "swap"`.
- Body/UI: **Switzer** (sans). Self-hosted via `next/font/local` from
  `public/fonts/switzer/`, weights 400–900.
- Both replace an earlier Fraunces/Inter (Google Fonts) pairing sitewide — no component
  references Fraunces or Inter anymore, and there are no fallback-font instances (every
  `font-display` usage resolves to Erode, everything else inherits Switzer from `body`).
- The hero headline ("Verde Noir") uses `font-display` (Erode) — an earlier draft of this
  brief called for it to be sans/Switzer; that direction was superseded.

## Layout

Four routes, each dark (`bg-bg`) unless noted:

1. **Home (`/`)** — `Hero` → `FoliageParallax` → `ShopShowcase` → `WhyVerdeNoir` →
   `ProductPreview` → `CareTeaser` → `Newsletter` → `Footer`.
2. **Shop (`/shop`)** — `ShopShowcase` (the scroll-stepped sequence) → `ProductGrid` (one
   editorial spotlight product, reusing `ShopShowcase`'s large-image/description/stats
   pattern, then the rest of the catalogue in an asymmetric `grid-flow-dense` grid — mixed
   card sizes via `col-span-2` on every third card, collapsing to the standard 3/2/1 column
   fallback below `lg`) → `Footer`.
3. **Shop detail (`/shop/[id]`)** — single product page, dark, matches the rest of the site.
   Reached via "Know more" from either `ShopShowcase` or `ProductGrid`'s spotlight.
4. **Care (`/care`)** — a short static header (so the page has something to see before the
   pinned section starts growing in) → `CareNotes` (the pinned growth collage) → `Footer`.
5. **About (`/about`)** — brand story copy → a full-bleed photo band → a 3-pillar summary →
   `Footer`.

`Footer` renders on every route. The persistent `Nav` (fixed, dark gradient scrim) and
`SignatureVine` (desktop-only scroll-progress line) live once in the root layout and are
present everywhere.

## Signature elements

Six independent scroll-tied mechanics, each with a `prefers-reduced-motion` static fallback
(final-state render, no scrub/tilt/typewriter/push-through):

1. **Foliage push-through** (`FoliageParallax.tsx`, home only, right after the hero) — three
   copies of the same foliage photo at different scale/blur/brightness scrub past the camera
   at different rates inside a pinned `300vh` runway, with one line of italic copy fading in
   and back out mid-scroll and the whole frame scaling up at the end. This is the closest thing
   to the original brief's "foliage push-through" signature moment — an earlier version of
   this file claimed it had been dropped; it hadn't.
2. **Hero leaf** (`Hero.tsx` / `hero/HeroLeaf.tsx`) — a real transparent-PNG leaf cutout
   (background removed via `rembg`/u2net, not a threshold script) sits at ~48% opacity behind
   a headline sized with `clamp()` to read as the dominant element at any viewport. Reduced
   motion: leaf renders directly at its final 48% opacity, no fade-in.
3. **Signature vine** (`SignatureVine.tsx`) — a fixed SVG line, `lg:` and up only, whose
   `stroke-dashoffset` tracks whole-page scroll progress; five gold nodes light up as their
   fraction of the page passes. Reduced motion: fully drawn immediately.
4. **Shop Sequence stepping** (`ShopShowcase.tsx`) — a `${n}00vh` pinned wrapper steps a large
   cutout image through the catalogue's featured plants as you scroll; description + stats on
   the right fade/slide in sync with each step, with a low-opacity ghost of the product name
   behind the stats row only (not spanning into the description). Reduced motion: renders as a
   plain, unpinned static section.
5. **Magazine-spread typewriter** (`WhyVerdeNoir.tsx`) — each numbered statement's sentence
   types in one wrapped line at a time (GSAP `SplitText`, `type: "lines,chars"`), each line's
   characters revealing fast before the next line starts. Fires when a slide's own pin segment
   begins (the slide remounts via `key={active}`), not on page load. Reduced motion: all text
   renders immediately, no split applied.
6. **Care growth** (`CareNotes.tsx`) — a `220vh` pinned wrapper scrubs a collage of stems, a
   pot, and four leaf-tile photos growing in from nothing, then reveals the three care-note
   cards in the final stretch. Reduced motion: renders fully grown immediately.

## Motion budget

Easing vocabulary (per interaction type, no default ease-in-out):
- Reveals / entrances: `power3.out` / `power4.out` (product-card entrance is intentionally
  harder/snappier than a typical reveal)
- Playful/bouncy confirmations (add-to-cart, drawer/modal open): `back.out(1.6–1.7)`
- Exits/closes: `power2.in`
- Scroll-scrubbed sections use `scrub` values between 0.4–0.6, not a hard 1:1 scrollbind

Distinct animated moments, roughly in page order: hero leaf entrance + idle sway + scroll
parallax; Shop Sequence stepping + parallax; product-card scroll entrance ("woosh") +
per-character typewriter name/price reveal + continuous scroll-tied 3D tilt; magazine-spread
per-line typewriter; Care growth scrub; cart drawer / checkout modal open-close (spring
easing); global smooth-scroll via Lenis (`duration: 0.9`, `expo.out` easing, `wheelMultiplier:
1.15` — tuned for a tight, immediate feel rather than a floaty one).

## Imagery

Real photography, self-hosted under `public/images/`, not hotlinked. Product crops stay 4:5.
Hero and Shop Sequence use transparent-PNG cutouts of the same product photography
(`public/images/cutouts/`), background-removed via `rembg` (u2net segmentation model), not a
threshold/chroma-key script — that approach produced visible fringing and was replaced.

## Accessibility

- Every interactive element gets a visible focus ring via a sitewide `:focus-visible { outline:
  2px solid var(--gold); }` rule — deliberately gold, matching the token's own "accent, CTAs,
  focus" intent, rather than relying on (or fighting) the browser default.
- Cart drawer and checkout modal both trap Tab focus while open (`lib/use-focus-trap.ts`) and
  restore focus to the triggering element on close.
- Decorative text (ghost numerals/names, `SplitText`-driven typewriter spans) is marked
  `aria-hidden`, with the real copy exposed once via a `sr-only` sibling — never split into
  meaningless per-character spans for assistive tech.

## Tier

**TIER 4 — choreographed.** CSS/GSAP only: no Three.js, no page-transition library beyond
what's native. The earlier WebGL hero experiment was dropped in favor of the real-photo cutout
approach described above.
