# Direction — Drift

Autonomous run (no gates). Every decision below was made without stopping for
confirmation, per the brief's instruction; rationale is recorded at each step so it can be
audited in one pass.

## Brief, restated

Premium wireless headphones product site. One job: land the selling points, drive the
click to buy. Fictional product — no Apple/Sony identity. Signature element: **The
Descent** — hero atmosphere dissipates on scroll to reveal the product, background color
tracks the colorway in focus. Tier 4. Voice: confident, minimal.

## Product

**Drift** (headphone: *Drift One*) — named for the repo and for the hero mechanic itself:
the product is discovered by drifting down through cloud layer, not presented outright.
Avoids the reference's "Orion" naming and the AirPods/Sony identity entirely.

## Database lookup (ui-ux-pro-max), and why it was rejected

`search.py "premium wireless headphones product landing page audio tech" --design-system`
returned a **Bento Grid Showcase** pattern in a **Vibrant & Block-based** style (navy +
gold, Rubik/Nunito Sans, gaming/youth-consumer positioning). This is a generic e-commerce
default that has nothing to do with the atmosphere/descent brief — treated as the
"coincidence, not validation" case the process expects, and discarded. Nothing from that
lookup appears below.

## Three directions

### A — "Ceiling" (altitude, cool, precision)
Grounded in aviation altitude, cabin glass, anodized aluminum housings.
- Palette: Zenith `#E8EDF2`, Cirrus `#B9C6D6`, Deep Ionosphere `#0E1B2E`, Anodized Copper
  `#C56A3F`, Signal White `#F7F9FB`
- Type: display **Bricolage Grotesque**, body **IBM Plex Sans**, utility **IBM Plex Mono**
- Signature reads naturally: pale cloud dissipating to reveal product is a *cool, bright*
  motion, which is what "dissipate" physically looks like

### B — "Undertow" (dusk, warm, editorial)
Grounded in analog tube-amp warmth, dusk instead of high noon, copper chassis.
- Palette: Dusk Amber `#E7A96B`, Smoke Rose `#D9C2BE`, Umber Depth `#241512`, Warm Ash `#8A7A72`
- Type: display **Clash Display**, body **Public Sans**, utility **Space Mono**
- Diverges from the cream/serif/terracotta slop pattern deliberately: no serif anywhere,
  and the base surface is a dark umber, not a light cream page

### C — "Chamber" (anechoic, dark, technical)
Grounded in the anechoic foam-wedge test chamber acoustic engineers actually use, and
copper voice-coil winding as the one warm material note.
- Palette: Chamber Black `#0A0A0C`, Foam Grey `#3A3B40`, Trace Teal `#4FB8A6`, Coil Copper `#D9835A`, Mist `#D8DCE0`
- Type: display **Familjen Grotesk**, body **Archivo**, utility **Spline Sans Mono**
- Two accents (teal + copper), not one — deliberately avoids the "near-black + single
  acid accent" registry entry

### Originality gate — all three

| Check | A | B | C |
|---|---|---|---|
| Convergence (would a generic agent land here unprompted?) | No — altitude/aviation grounding is specific | No — dusk/analog grounding is specific | No — anechoic-chamber grounding is specific |
| AI-slop registry | Clear (no serif, no single-acid-on-black, no gradient, no hairline broadsheet, no numbered eyebrows, no glass-on-mesh, no emoji) | Clear (explicitly not cream+serif+terracotta — no serif, dark base not light) | Clear (two accents, not the banned single-accent-on-black formula) |
| Clone test vs. `orion` / `sony-airpods` | Passes — different palette family, no condensed sans wordmark, different type | Passes | Passes |
| Justification (traces to real material world) | Aviation altitude, anodized aluminum | Tube-amp warmth, copper chassis | Anechoic chamber, copper voice coil |

All three pass; none needed revision.

### Winner: A — "Ceiling"

The brief's own mechanic decides it: atmosphere that "dissipates to reveal" is a bright,
cool, clearing motion — B's dusk-orange clouds and C's dark chamber both fight that
physical read. A is also the direction where the signature element, the product
photography, and the palette pull in the same direction instead of needing to be
reconciled. B and C are recorded above rather than discarded silently, per the
originality-gate requirement to show the work.

---

## Token system (binding — everything downstream derives from this)

### Palette

| Name | Hex | Role |
|---|---|---|
| `--zenith` | `#E8EDF2` | Hero atmosphere base, light surfaces |
| `--cirrus` | `#B9C6D6` | Mid-tone cloud, borders on light surfaces |
| `--ionosphere` | `#0E1B2E` | Deep sections, footer, primary text on light |
| `--copper` | `#9C4F2B` | Accent — CTA, eyebrow text, focus ring, active states on light surfaces |
| `--copper-glow` | `#DD9668` | Same accent, lightened for hover/focus text on dark surfaces |
| `--signal` | `#F7F9FB` | Text on dark surfaces |

Corrected during Stage 5 verification: the originally-planned `#C56A3F` failed WCAG AA as
text (3.24:1 on `--zenith`, 3.61:1 for button text on itself). Darkened to `#9C4F2B` (5.0:1
/ 5.6:1) for light-surface use; `--copper-glow` was added as a second, lighter tint
(7.1:1 on `--ionosphere`) because one mid-tone can't clear AA against both a near-white and
a near-black surface — this is the only token change made after the original direction
pass, everything else in this file is as originally decided.

Colorway accents (product variants only — never used as brand/UI color):

| Colorway | Hex | Material story |
|---|---|---|
| Slate | `#6B7686` | Anodized aluminum |
| Glacier | `#AFCBDD` | Ice-blue composite |
| Rosewood | `#8B5A4A` | Wood-grain accent panel |
| Graphite | `#23262B` | Matte black chassis |

### Type

- Display: **Syne** (Google Fonts, weights 600/700/800) — swapped in from Bricolage
  Grotesque per a later scope change (see Changelog). Sharper, more geometric-eccentric
  than Bricolage; still avoids Inter/Poppins/Montserrat/Playfair. Used for the hero
  wordmark, section headlines, and full-width claim bands.
- Body: **IBM Plex Sans** (Google Fonts) — technical without being cold, for all running copy.
- Utility/spec: **IBM Plex Mono** (Google Fonts) — spec sheets, prices, colorway labels,
  nav.
- Scale: base 16px / 1.6 line-height, ratio 1.25 (major third). Display sizes use
  `clamp()` rather than fixed breakpoints: hero headline `clamp(2.75rem, 6vw + 1rem, 7rem)`.

### Layout

One sentence: a single-column narrative scroll, one claim per section, alternating
text/image weighting, breaking to full-bleed only for the hero descent and the two
full-width claim bands (ANC, battery).

```
Hero (pinned, ~180vh scroll distance)
┌──────────────────────────────────────┐
│  drift            shop  sound  buy → │  ← nav, transparent→solid on scroll
│                                        │
│         [ d r i f t ]  (behind cloud) │
│        ░░░░░░░░░░░░░░░░░░░░░░░░       │  ← cloud/atmosphere layer, dissipates
│      ░░░░[ headphone product ]░░░░    │     on scroll, reveals product
│        ░░░░░░░░░░░░░░░░░░░░░░░░       │
│         hear the altitude drop.       │
└──────────────────────────────────────┘

Interior spec section (alternating)
┌───────────────┬────────────────────┐
│                │  Drivers built     │
│   [ image ]    │  for headroom.     │
│                │  40mm dynamic...   │
└───────────────┴────────────────────┘
```

### Signature

**The Descent** — a pinned hero section (GSAP ScrollTrigger, scrubbed to scroll position)
where a layered cloud/mist treatment covers the product and the wordmark; as the user
scrolls, the layers separate and fade, the product resolves into focus, and the page
background shifts from `--zenith` toward whichever colorway is dominant once the user
reaches the colorway-picker section later on the page — one continuous color system, not
two unrelated effects.

### Motion budget — 5 distinct moments, one set-piece

1. **The Descent** (hero, pinned + scrubbed) — the orchestrated set-piece.
2. Colorway picker — pinned product, background/accent color morphs per swatch focused.
3. Spec-section reveals — consistent stagger + easing, one shot per section, not per element.
4. Nav — background/opacity transition tied to scroll position.
5. Hover/focus micro-states on CTAs, swatches, and product cards.

Nothing else animates. `prefers-reduced-motion` gets a static equivalent for 1 and 2
(cloud layer starts dissipated, colorway swap is instant on click instead of scroll-linked).

## Tier

**TIER: 4** (user-declared, binding). Entry cost — GSAP + ScrollTrigger + Lenis, already
installed and wired (`src/lib/gsap.ts`, `src/components/SmoothScroll.tsx`) — is met. One
genuine scroll-driven set-piece (The Descent); everything else stays quiet, per the Tier 4
discipline note (scattered triggers are the tell of an unplanned Tier 4).

Photography is sourced per the brief (Unsplash/Pexels, no identifiable people, no literal
Apple/Sony renders) — see `ASSETS.md`. This stacks Tier 3's asset investment on top of
Tier 4's choreography, which the tier scale treats as two independent dials.

## Section order (single-page build — superseded, see Changelog)

1. Nav (sticky)
2. Hero — The Descent
3. Sound — driver/diaphragm claim, alternating image/text
4. ANC — full-width single-claim band
5. Soundstage — spatial/tuning claim, alternating image/text
6. Battery — full-width single-claim band
7. Colorway picker — pinned product + swatch rail, color-morph
8. Buy — price, CTA
9. Footer

## Changelog — scope escalation, 30-minute time-boxed pass

Multi-page restructure, replacing the section order above:

- **`/`** — Hero (The Descent, unchanged) + a condensed 3-line teaser (Sound/Silence/
  Soundstage, one sentence each, no spec grids) + a single CTA into `/product`.
- **`/product`** — new. `@react-three/fiber` + `@react-three/drei` interactive viewer
  (drag to orbit, scroll to zoom) is the page's centerpiece. Colorway switching changes
  the 3D model's material (color/metalness/roughness) directly, not a photo swap.
- **`/engineering`** — the full spec content (Sound, Silence, Soundstage, Battery)
  moved here verbatim from the old single page.
- **`/buy`** — colorway + price picker (static swatches, no 3D) and the purchase CTA.
- Nav and Footer moved from `page.tsx` into `layout.tsx` so they persist across routes;
  nav links now point at real routes instead of in-page anchors.

**3D asset — sourced, then substituted, and why:** "Low Poly Headphones" by Glitchwolf47
(CC BY 4.0, confirmed via the model's own embedded metadata — both `gltf` and `glb`
export archives exist with status `Succeeded`; 1.1k triangles; generic, no brand
resemblance) was the one Sketchfab candidate fully verified as license-clear in this
session. It could not actually be imported: Sketchfab's download API returns
`401 Authentication credentials were not provided` for anonymous requests, and the
browser extension needed to click through the web UI's download button was not
connected in this environment. Rather than block the 30-minute deadline on that, or
silently fake having the file, `HeadphoneModel.tsx` ships a procedural placeholder
(tube-geometry headband + cylinder earcups) with the PBR material, HDRI environment,
and bloom pass built exactly as specified — geometry is the only thing not real.
Swapping in an actual `.glb` (this one, once downloaded with proper credentials, or
another confirmed-clear model) is a one-component change; attribution for Glitchwolf47
is already in the footer per the CC BY requirement, ready for whichever model lands
there.

Font: display face swapped **Bricolage Grotesque → Syne** sitewide, body/utility
unchanged. No originality-gate re-run performed — this was a direct instruction, not a
direction change requiring re-justification.

Per explicit instruction, this pass skipped the full Stage 5 audit (contrast/keyboard/LCP)
in favor of a fast sanity check only — see the build report for what was and wasn't
verified this round.

## Changelog — art-direction correction: scale and restraint

Direct feedback: the previous pass read as "more motion" rather than "more premium" —
Apple/Sony's read of premium comes from scale and restraint, not density of animated
moments. Corrected, not added to:

- **Type: Syne → Clash Display.** Self-hosted via `next/font/local` (four weights,
  `src/fonts/`), not loaded from Fontshare's CDN at runtime — keeps the LCP discipline
  already established rather than trading it for a third-party font host. ITF Free
  Font License (Fontshare), free for commercial use, no attribution required. Body
  (IBM Plex Sans) and utility (IBM Plex Mono) untouched.
- **Home page teaser panels rebuilt.** The Sound/Silence/Soundstage panels previously
  paired a headline with a decorative graphic (waveform bars, stereo-field circles) in
  a two-column split — two things competing for attention in one section. Both graphics
  are gone. Each panel is now one dominant typographic moment: eyebrow, a headline set
  at `13vw`/`8.5vw` (the same register as the hero wordmark, not a body-copy heading
  wearing a bigger font size), one short supporting line. Copy itself is unchanged from
  the original claims — only the scale and the removal of competing elements changed.
- **Transitions kept, slowed, given a pause.** Same three mechanics (rise+settle,
  rotateX collapse, skew-swipe) — the request was to correct the feel, not replace the
  pinning strategy. Each pinned exit now opens with a literal no-op tween (a genuine
  scroll-distance dead zone) before the transform starts, and the overall pin distance
  grew from `+=100%` to `+=160%` with `scrub` raised from 1 to 1.4. The stillness before
  each exit is the actual fix — continuous motion was what read as busy, not the
  transform styles themselves.
- **`/product` rebuilt from a two-column split to one vertical column**: giant headline,
  then the viewer at roughly triple its previous rendered size as the page's only real
  subject, then a minimal dot-row colorway picker (name-only, no bordered cards) below.
  `/buy` got the same treatment — full-bleed image, oversized price, dot-row picker,
  copy consolidated to one sentence rather than three short competing ones.
- **`/engineering`**: no new triggers, existing `SpecSection`/`ClaimBand` reveals made
  larger and given more room — section padding roughly +40%, headlines moved from
  `text-4xl`/`text-5xl` to `text-6xl`/`text-7xl` (viewport-scaled on `ClaimBand`), image
  aspect widened from 4:3 to square.
- Hero (`The Descent`) was not touched, per instruction.
