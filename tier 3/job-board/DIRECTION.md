# DIRECTION — The Roster (v2, restart)

Proposed 2026-09-15. Single-direction proposal per user instruction (3-way gate skipped this
round) — pending Gate 2 approval before Stage 2.5/3/4 begin. Supersedes the discarded "Desk
Diary" editorial direction (preserved at git commit `93182cf` if needed).

**Site name: The Roster** (kept from the original brief).

## Brief recap
Job & internship board for a well-funded modern company, not a cute editorial blog. Bold,
confident, Swiss/International Typographic Style. Multi-page site, heavy GSAP choreography —
explicitly confirmed by the user, motion ambition raised above Tier 3's default.

## Direction — Swiss Signal
Black-and-white base, one dominant accent (signal red), a strict grid, one typeface family
carrying the entire hierarchy through weight and size. Precision-instrument graphic marks
(registration dots, crosshairs, index numbers) stand in for illustration. Photography is
desaturated to high-contrast grayscale — color lives in the graphic system, never in the photo
grade.

### Palette
Warmed 2026-09-29 per user request — a temperature adjustment, not a direction change. Pure
white/near-black read as too stark; base neutrals shifted warm while red/blue accents and the
grid/type system stayed untouched. Swatch comparison approved before site-wide application.

| Token | Hex | Role |
|---|---|---|
| `--color-paper` | `#FAF7F2` | Page background — warm off-white, not stark white |
| `--color-ink` | `#1A1614` | Primary text, display headlines — warm charcoal, not cold black |
| `--color-surface` | `#F0EBE1` | Card/section-alternation background |
| `--color-red` | `#CC2A14` | Primary accent — CTAs, the traveling disc, active/hover states, tag fills. Darkened from the original `#E3341A` at Stage 5 verify: that value was ~4.4:1 against white, just under WCAG AA's 4.5:1 for normal-weight text/button labels; this is ~5.4:1. Kept as-is against the warm paper — already orange-leaning, not a cold crimson, no adjustment needed. |
| `--color-blue` | `#0047FF` | Secondary accent, used sparingly — category color-coding only (map-legend mechanic, M8-adjacent), never paired with red at full saturation in the same element |
| `--color-line` | `#DDD4C4` | Hairline grid rules, dividers, borders |

No gradients. No photo color-grading — grayscale/high-contrast duotone only, per M5. Red is
the interactive/primary-system color; blue is reserved for category-tag legend coding so
listings stay scannable by type at a glance.

### Type
Single family carries the whole page — **Inter Tight** (weights 400/500/700/800/900),
self-hosted via `next/font/google`. This is the practical modern substitute for Helvetica
Now (not freely licensable to self-host) named in the brief — a close, confident geometric
grotesk at any scale. No second text family.

- **Display**: Inter Tight 800/900, huge and confident — hero headline clamps roughly
  96px→160px, section headers 40–64px. Tight tracking (-0.02em) at display sizes, per Swiss
  grotesk convention.
- **Body**: Inter Tight 400/500, 17–19px, generous line-height (1.5–1.6) for descriptions and
  requirements.
- **Utility/index**: **IBM Plex Mono** (weight 500) — reserved strictly for index numbers
  ("01 / 08"), stat digits, tag/metadata labels, grid-coordinate marks. This is the one
  deliberate second face, used the way Swiss design uses a monospace for technical/production
  marks — never for headlines or body copy.

### Layout
12-column grid with visible hairline rules (`--color-line`) marking column boundaries at
section edges. Every major section is numbered in the margin (mono, e.g. "03") — orientation
device, not decoration (M1, M8). Flush-left, ragged-right text; no centered body copy.
Content measure capped at 65–70ch for prose; grid sections run full-width within the 12-col
system, not an arbitrary max-width container.

### Pages
- **`/` (home)** — kinetic hero, stat strip, category grid, featured/recent listings, "why
  The Roster" section, testimonial quotes, CTA band, footer. (M6 anatomy.)
- **`/jobs`** — full filterable grid: category, location, type, level; sort control; live
  result count. Same row/index system as the homepage featured list, not a redesign.
- **`/jobs/[slug]`** — full detail page: title/company/meta, photo, dek, description,
  requirements, apply CTA.
- **`/about`** — company story, team section (real photography grid), values/culture section.
- **`/for-employers`** — secondary page explaining how posting works for companies. (Chose
  this over "how-it-works" — a job board's second audience is the employer posting roles, so
  this is the more concrete, on-brief page; flagging the call since the brief offered either.)
  Simpler layout, lighter motion per the brief.

### Signature — the traveling disc
A solid **red disc** (registration-mark scale, not a decorative blob) is the one orchestrated
set-piece (M7), built as a single pinned ScrollTrigger timeline spanning hero → stat strip →
category grid → featured listings on the homepage:

1. **Hero**: enters full-bleed and oversized, sitting behind/behind-crossing the kinetic
   headline as it types/staggers in.
2. **Stat strip**: scales down hard and travels to sit as the separator glyph between stat
   figures ("14 ● roles open").
3. **Category grid**: continues traveling, becomes the active/hover-state indicator dot next
   to whichever category tile is focused.
4. **Featured listings → CTA band**: shrinks to final rest size and lands permanently as the
   dot in the wordmark lockup ("The Roster ●") pinned in the CTA band — the payoff position it
   holds for the rest of the page.

One real pinned/scrubbed timeline, not twelve scattered triggers — this **is** the Tier
4/5-adjacent set-piece the brief asked for.

**Breakpoint gating (confirmed 2026-09-15):** the pin/scrub is desktop-only, gated with
`gsap.matchMedia()` at `(min-width: 768px)` — this project's existing `md:` breakpoint. Below
768px there is no `pin`/`scrub`; the disc still appears and transforms at each section (scale,
position, color-state) via ordinary scroll-triggered enter/leave tweens, same visual beats,
no scroll-jacking. (There was no prior pinned-ScrollTrigger code in this repo to match — the
first pipeline attempt never got past scaffolding, motion was deferred — so this is the
standard defensible version of that pattern, not a copy of unseen code.)

### Motion (Tier raised above 3 default, user-confirmed)
Stack: `gsap` + `ScrollTrigger` (already installed) + `lenis` (already installed, synced via
`lenis.on('scroll', ScrollTrigger.update)` — existing `SmoothScrollProvider` plumbing carries
over as-is). Default to CSS 3D transforms; reach for `three` only if a specific beat genuinely
needs real-time 3D CSS can't fake.

Required moments (floor, per brief):
1. **Kinetic hero entrance** — word/character stagger, sharp easing (`power4.out` or a custom
   cubic-bezier with real snap, not soft ease-in-out).
2. **The traveling disc** — the one pinned set-piece, described above.
3. **Varied scroll reveals per section** — no repeated fade-up. Stat strip: digits count up.
   Category grid: clip-path wipe per tile, staggered. Featured listings: alternating
   slide-in. Testimonials: alternating left/right slide. CTA band: scale-in from the disc's
   arrival.
4. **One pinned/zoom beat** beyond the disc — the "why The Roster" section pins and scales up
   as it's reached, for emphasis.
5. **Photography** — parallax/scale-on-scroll on team/office shots in `/about` and job-detail
   heroes.

Reduced motion: `prefers-reduced-motion` destroys the Lenis/ScrollTrigger instances outright
(already the pattern in `components/SmoothScrollProvider.tsx`) — every section renders static
and fully readable, no exceptions, no partial-disabled states.

### Photography direction
Tier 3 — real, curated stock, team/office/workplace subjects, multiple people, candid framing.
Desaturated to high-contrast grayscale sitewide (M5) so color stays exclusively in the graphic
system (red disc, blue tags, rules). No warm color grade this time — that was the discarded
direction's move.

### What this rules out
No editorial serif/slab type, no soft pastel accents, no illustration or painterly hero
imagery (Stripe-style), no product-screenshot hero (Linear-style — The Roster has no product
UI to show), no more than one accent at full saturation in the same element, no centered body
copy, no decorative animation that doesn't clarify hierarchy or state.

(The original "no warm paper palette" line here was superseded 2026-09-29 — see Palette above.
That referred to a warm *color grade*/editorial direction, not the base-neutral temperature
adjustment applied now; the photography grade is still strict grayscale, per M5.)

## Tier record
- **Asset/photography budget:** Tier 3 — real curated stock, consistently graded (grayscale
  high-contrast instead of warm color this round).
- **Motion/choreography budget:** raised above Tier 3 default, reaching Tier 4/5-adjacent —
  full GSAP choreography explicitly confirmed by the user. One real orchestrated set-piece
  (the traveling disc), varied reveals elsewhere, one additional pinned/zoom beat.
