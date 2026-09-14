# DIRECTION.md — Recipe Hub (v3, rustic/organic reroll)

Supersedes every prior direction ("Prep Station", the Cuisina/food-app palette match). Chosen via a
dedicated Stage 0/2 pass: 3 real-photo style options shown on a mood board, client picked **Option
B — Moody Dark-Wood Tablescape**; palette and type were then proposed against that pick and
approved. Full history lives in the mood-board artifact from that pass.

## Brief

Rustic/organic: earthy, handmade, natural textures — farmhouse kitchen, wooden boards, hand-thrown
ceramics, dried herbs. Photography direction is dramatic rather than bright: low, warm, directional
light against near-black grounds. Not polished studio food photography.

## Palette

| Token | Hex | Use |
|---|---|---|
| `--bone` (Oatmeal) | `#F3EBDD` | page background — grid, filters, recipe pages, anything being *read* |
| `--paper` | `#FFFDF8` | card surfaces |
| `--ink` (warm charcoal) | `#2A211A` | body text, headings |
| `--charcoal` (Espresso) | `#1A120C` | dark ground — hero, featured carousel, how-it-works band |
| `--terracotta` (fired clay) | `#B2542C` | primary accent — CTAs, active filter state |
| `--olive` (deep olive) | `#414D2E` | secondary accent — diet badges, links |
| `--line` | `#E2D4BA` | hairlines, card borders on oatmeal |

No steel gray, no cool grays anywhere — every neutral, including the dark ground, is warmed toward
the terracotta/olive accents. The split between oatmeal and espresso is deliberate: Option B's
photography is dark-dominant and would wash out on an all-cream site, so reading surfaces (filters,
ingredients, method) stay light and legible while the photo-forward hero/carousel/how-it-works
sections take the dark ground the photography actually lives on.

## Type

- **Display — Fraunces** (Google Fonts): soft-contrast serif with a variable "wonk" axis, giving
  headlines a slightly hand-set irregularity rather than a clean geometric serif. Weights 500/600.
- **Body — Nunito Sans** (Google Fonts): humanist grotesque, rounded terminals, warm and legible at
  recipe-reading sizes. Weights 400/500/600/700.
- No monospace anywhere.
- Scale: 1.25 ratio, base 17px: 17 / 20 / 25 / 31 / 39 / 49 / 61px.

## Layout

Unchanged in skeleton from the prior pass — hero → stat strip → collection grid → how-it-works →
featured carousel → email signup band → footer — only the ground color and photography change:
hero, how-it-works, and the signup band sit on `--charcoal` (espresso); collection grid and recipe
grid/detail stay on `--bone` (oatmeal).

## Motion (unchanged)

Lenis + GSAP/ScrollTrigger, wired together, from the prior batched-fixes pass: hero parallax +
scale-in, hero→stat pinned crossfade (md+ only), stat count-up on scroll, collection-card 3D
tilt-on-hover + staggered rotate-in, carousel pointer-drag with momentum. None of this changes with
the visual reroll — it's orthogonal to palette/photography and all of it already respects
`prefers-reduced-motion`.

## Photography

12 recipe photos + 1 hero, resourced entirely in Option B's style — verified live, free-licensed
(Unsplash License, no Unsplash+). See `ASSETS.md` for the full table including the handful of
honest compromises (exact-dish moody stock doesn't exist for every recipe on the free tier).
A stronger unified grade (`contrast(1.08) saturate(0.92) brightness(0.93)`) pulls the handful of
brighter source photos toward the same mood as the genuinely dark ones, so the set reads as one
shoot rather than scattered stock.

## What did not change

Content layer (`getAllRecipes`/`getRecipeBySlug`, 12 recipe JSONs), the cuisine/diet/time filter
logic on `/recipes`, and the `/recipes/[slug]` page structure are unchanged — this is a visual
reroll only.
