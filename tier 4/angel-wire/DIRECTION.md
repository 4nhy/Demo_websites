# ANGEL WIRE — Direction

**Status:** Gate 2 winner ("Direction 2 — The Charm Rail"), carried forward
from Stage 2 without an explicit user confirmation message at the time. Stage
3 build work then went through two full palette pivots — glossy Y2K
pink/lilac (the original gate pick) → warm vintage/thrift oxblood-and-cream →
a further-explored dreamy pastel holographic pass on the hero pendant — before
landing here. **The palette below (dark/gothic sterling silver) is confirmed
final as of 2026-09-11: explicitly not another in-progress pivot, not open
for re-litigation at the next design pass.** Everything else in this file
(thesis, signature mechanism, tier) is unaffected by this change. The
direction's *name* ("The Charm Rail") has now survived three unrelated
palette registers — the next design pass should seriously consider retiring
it in favor of something that doesn't imply a Y2K charm-bracelet read.

**Chosen direction:** Direction 2 (name retained for now) — territory is dark
and gothic: near-black/charcoal grounds, cool sterling-silver metallics,
dramatic high-contrast lighting. No pink, no lilac, no Y2K vocabulary of any
kind. This is a full register change from every prior pass, not a
continuation of the vintage/thrift or pastel-holographic work — see Palette
below.

**Code status vs. this file:** not yet rebuilt to match. `globals.css` still
carries the interim oxblood/cream token values, and the hero pendant SVG
(`scripts/generate-hero-heart.mjs`) still renders the pastel pearlescent
pass from the previous session. Both are now off-direction and awaiting real
reference photography the user is supplying directly (via
`public/images/_incoming/`) before rebuild — this file describes the
confirmed target, not the current render.

**Tier:** 4 — Choreographed (user-declared). `gsap` + `lenis` installed and
wired: `lenis.on('scroll', ScrollTrigger.update)`, confirmed in
`SmoothScroll.tsx`.

## Thesis

ANGEL WIRE pieces are treated like charms on a bracelet — small, collectible,
precious objects you browse by touching, not scrolling past in a grid.
(Unchanged — the thesis outlived the literal charm-rail mechanic that used to
carry it; see Signature below for what carries it now.)

## Token system — as actually implemented

**Palette — CONFIRMED FINAL: dark/gothic sterling silver**

Every prior palette pass (glossy Y2K pink/lilac, then warm vintage-thrift
oxblood/cream, then a dreamy pastel-holographic exploration on the hero
pendant alone) is superseded. This is a full inversion, not an accent swap:
the site's *ground* goes from light to near-black, and ink/accent roles
invert with it. Token *names* stay the same (still rewiring every consuming
component is the bigger risk than the naming mismatch); the hex values and
their meaning change completely. Not yet written into `src/app/globals.css`
— recorded here as the confirmed target, pending the user's own reference
photography:

| Token | Target | Name | Role |
|---|---|---|---|
| `chrome-white` | `#0B0B0E` | Onyx Ground | primary background — was light (cream, then violet-white); now near-black charcoal |
| `grape-ink` | `#E7E7ED` | Sterling Ink | primary text/ink — was dark-on-light; now a cool off-white/silver, light-on-dark |
| `bubblegum` | `#B8BEC7` | Brushed Steel | primary accent — cool mid-grey metallic, replacing every pink this token has ever held |
| `cyber-lilac` | `#4A4E57` | Gunmetal | secondary accent — deep charcoal-blue-grey |
| `acid-lime` | `#F5F6F8` | Mirror Flash | spark accent — a near-white hard specular highlight, tiny doses only (a reflection hit, one hover state) — same restrained-use discipline as every prior pass of this token, just a different value |

**Retired, not reassigned:** `sticker-teal` (`#1F8A7A`) and `sticker-yellow`
(`#F0B429`) existed only to carry pink-y2k-shoe's rainbow-butterfly-clip
graphic-sticker moment ("Never Restocked"). That moment doesn't have a home
in a dark-gothic register — it was a Y2K bubblegum beat specifically, not a
generic "one loud graphic" beat that just needs recoloring. Drop it, or
replace it with a register-appropriate signature graphic moment (an etched
or foil-stamped mark reads closer to this direction than a sticker) — this
needs a real decision at the next design pass, not a silent hex swap.

**Rendering quality, not just hex values:** "dramatic high-contrast
lighting" is part of the brief, not a color story alone — hard specular
falloff, deep shadow, sharp small highlights rather than soft/broad ones.
This directly affects how the hero pendant and any product photography
should be lit/graded, not just which colors get used. The wire signature
element's own rendering (`.wire-path` stroke, `.wire-knot` fill) will
inherit these tokens automatically once `globals.css` is rebuilt — expect it
to read as a fine silver line on black rather than the current dark line on
cream.

**Type**
- Display: **Fraunces** (variable — opsz/SOFT/WONK/wght axes), not Ohno
  Blazeface. An intermediate choice (Fredoka, a rounded bubble sans) was
  also tried and rejected as having no basis in the references before
  landing on Fraunces. Used at low weight/restrained italic in body
  contexts, and at heavy weight with `SOFT 40 / WONK 1` variation settings
  (the `.font-wonk` utility) at hero scale only — the "controlled chaos"
  beat stays rare by design.
- Body: **Hanken Grotesk**, not General Sans.
- Utility/mono: **Fragment Mono** — unchanged, matches the original gate pick.
- Scale: not yet formally re-documented as a perfect-fifth system; hero H1
  uses `clamp(3.4rem, 16vw, 9.5rem)` fluid sizing rather than a fixed
  88px step. Treat the original "perfect-fifth / 88px H1" numbers as
  superseded, not authoritative.

**Layout**
- **Top navbar exists** (`SiteHeader.tsx`) — a conventional sticky-top bar
  with wordmark + SHOP / COLLECTIONS / ABOUT text links + a Bag(count)
  drawer toggle, current-route marked with a thin gold underline. This
  directly contradicts the original "no top navbar, floating bottom-center
  icon dock" spec — the dock was never built; a standard header was, and
  it's the one shipping today.
- Hero: centered "product-as-jewel" survives — a sterling silver cross
  pendant (real user-supplied photo, not procedural — see ASSETS.md; every
  earlier SVG pass of this asset, including a from-scratch fleur-de-lis
  build that deliberately echoed Chrome Hearts' silhouette without using
  their photo, is retired) as the hero object, catalogue metadata bar,
  floating catalogue tag, one graphic badge moment ("Never Restocked",
  currently styled as a Y2K sticker — see the Palette section's note on
  retiring this, it needs a register-appropriate replacement, not a
  recolor). Delivered as a ~200vh pinned, scroll-scrubbed opening sequence
  (object starts huge/rotated in 3D, wordmark starts split off-screen, a
  specular band crosses the object, everything settles into the resting
  composition) — the band is monochrome now (Gunmetal → Mirror Flash →
  Brushed Steel), matching the confirmed dark/gothic silver palette; the
  earlier rainbow/hue-shifting version is retired.

**Signature — pivoted from "Charm Rail" to "The Wire"**

The original spec called for a horizontal-drag rail of hanging pieces on
individual pendulum physics. **That was not built.** What exists instead,
self-documented in `AngelWire.tsx` as *"The ANGEL WIRE signature element,"*
is a different mechanic entirely:

A single continuous SVG line threads down the whole homepage — starting at
the hero wordmark, passing *behind* the hero image, re-emerging toward the
next section, and repeating that behind/in-front weave through all eight
homepage sections (Hero → Current Drop → Editorial Transition → Collections
Line → Lookbook → New Arrivals → Manifesto → Finale) before terminating in a
knot at the Finale section. It is:
- **Anchor-driven, not authored as fixed coordinates** — each section marks
  DOM points with `data-wire-anchor="<id>"`; the component measures their
  real screen position live (on mount, resize, breakpoint change, and after
  web fonts settle) and draws a smoothed path through them, so the line
  always matches actual layout instead of a guessed curve.
- **Scroll-scrubbed**, not freely draggable — the path draws in via
  `stroke-dashoffset` tied to scroll progress through an eased (not linear)
  curve, with a terminus knot that grows/fades in only in the final 8% of
  scroll.
- **Z-band aware** — each anchor declares `front` or `back`, so the line can
  duck behind a hero image and re-emerge in front of the next, which is
  what "the wire" name in the product/domain name (`AngelWire.tsx`) actually
  refers to.
- **Degrades deliberately**, not accidentally: `prefers-reduced-motion`
  renders the complete static line with no scroll-binding; mobile uses a
  shorter, genuinely simpler anchor list (not a scaled copy) plus a reduced
  stroke width/opacity token pair.

This is the real signature element the thesis ("browse by touching, not
scrolling past") now rests on: the line is the charm-bracelet's physical
wire made literal and structural, rather than a draggable rail of charms.
Reconsider the "Charm Rail" name at the next design pass if it's worth
renaming the direction to match what's actually shipping (candidate: "The
Wire").

## Section structure (homepage) — as built

Eight sections after the hero, not the original nine — some renamed, the
literal charm rail and separate ticker/mood-grid/footer sections did not
survive as named beats:

1. Nav (`SiteHeader`, top, persistent — not the floating dock)
2. Jewel hero (scroll-scrubbed opening sequence)
3. `CurrentDropScene`
4. `EditorialTransition`
5. `CollectionsLine`
6. `LookbookSequence`
7. `NewArrivalsFilmstrip`
8. `ManifestoCollage`
9. `FinaleTag`

The wire (see Signature) runs through all of 2–9 as one continuous element,
which is the closest analog to the original spec's separate "vitrine
spotlight" set-piece — there isn't a second isolated orchestrated moment
beyond the hero scrub and the wire itself.

## Motion budget

Largely as originally declared: the hero scroll-scrub is the one large
orchestrated set-piece; the wire is a second, page-spanning orchestrated
element (arguably now *the* signature set-piece, given it touches every
section). Reduced-motion handling is implemented consistently (hero,
wire, and per-section reveals all check `prefers-reduced-motion`).
Spring/elastic easing beyond the hero's `back.out` sticker pop and gold
sweep has not been separately audited section-by-section — treat "bouncy
overshoot / jelly squash throughout" from the original spec as unverified
rather than confirmed present everywhere.

## What this borrows from the image references / what it rejects

Unchanged from the original gate log — see `.refs/ledger.md` and
`.refs/brief-decisions.md` for the full reasoning. The palette pivot above
is a *correction toward* the references (grounded in their actual colors)
rather than a departure from them.

Full three-direction gate log: see prior conversation / re-run Stage 2 if
this needs to be revisited from scratch.
