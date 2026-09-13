# Reference Ledger — Verde Noir

Two mechanics references (Webflow templates, inspected live) + one mood/layout reference
(`.refs/photo-direction.jpeg`, a moodboard collage of plant-shop UI screenshots). Direction
itself is locked by the brief — this ledger exists to keep implementation honest about what's
borrowed structure vs. what must be reinvented.

## 1. 3D BENTO (agency template) — bento grid + dark section rhythm

| Observation | Mechanic or Identity | What we do instead |
|---|---|---|
| Oversized single-word display headline spanning full viewport width, tight tracking | Mechanic — scale-as-focal-device | Use Fraunces at large display size for hero headline, but restrained to a phrase, not one word; serif not the template's grotesk |
| Small floating glass/blur stat chips overlapping the hero image at the fold's lower third | Mechanic — floating info card off the main axis | Use for a small trust strip (plant count / care-guarantee / ships-nationwide) near hero, styled in panel `#1B2A1F` not glass-blur |
| 4-card services grid: 2 wide + 2 narrow, asymmetric CSS grid, one card per row-span | Mechanic — asymmetric bento grid structure (mixed col/row spans, not a uniform 2x2) | Reuse the exact grid mechanic for the "why us" bento (4 cards, asymmetric spans) |
| Stat row (WORKS / CLIENTS / AWARDS) as 3 big numerals with small caption beneath | Mechanic — numeral-led stat block | Could reuse for a care-notes or trust stat if needed, but not required by brief |
| Astronaut/3D-render hero image bleeding off the right edge of viewport | Identity — sci-fi/SaaS iconography | Explicitly excluded — hero uses real plant photography instead, full-bleed not object-cutout |
| Pure black background, white text, no accent hue | Identity — palette | Not carried over — Verde Noir uses the locked deep-green/gold palette |
| Pill-shaped nav CTA + circular arrow icon button | Mechanic — rounded pill affordance for primary nav CTA | Reuse pill shape for nav CTA ("Shop"), recolor to gold accent |
| Footer: 3-column link grid (MAIN / PAGES / UTILITIES) + logo + tagline | Mechanic — footer column structure | Reuse column structure, replace with Shop / Care / Company links |

## 2. Fullstack Studio (agency template) — scroll choreography + section sequencing

Per its own feature list (verified via listing, not just marketing copy): Arc Image Marquee
Hero, Scroll-Triggered Text Highlights, Parallax Hero Scene, Infinite Marquees, Scroll-Driven
Stack Reveals, Animated Pricing/FAQ components, Scroll-Triggered Number Counters, GSAP-driven
throughout.

| Observation | Mechanic or Identity | What we do instead |
|---|---|---|
| Hero → logo marquee (trust) → mission statement (big serif-adjacent line) → work grid → pricing → FAQ → footer: each section is a distinct full-viewport "beat," not a continuous scroll of small blocks | Mechanic — section-as-beat sequencing, one idea per fold | Verde Noir's 8 sections each get their own compositional identity: hero / foliage push / categories / bento / shop / care / newsletter / footer |
| Parallax hero scene: background layer moves slower than foreground content on scroll | Mechanic — differential-speed parallax | This is exactly the mechanic for our foliage push-through section, extended to 3 layers instead of 2 |
| Scroll-driven "stack reveal" cards (cards animate in as a stacked sequence tied to scroll position, not just fade) | Mechanic — scroll-position-driven stagger, not time-based | Applied to bento "why us" grid and product grid reveals |
| Scroll-triggered number counters | Mechanic — count-up tied to scroll entry | Optional use in care-notes or footer stat if it reads as useful, not decorative |
| Pricing cards with "Most Popular" ribbon, 2-column plan comparison | Identity — SaaS pricing-table convention | Explicitly excluded — nothing in Verde Noir resembles a pricing table; product cards are retail, not subscription tiers |
| Copy voice: "ship with intent," "teams that ship fast," "craft at every pixel" | Identity — SaaS/agency voice | Explicitly excluded per brief — Verde Noir copy uses plant-care vocabulary (fenestration, rhizomes, variegation, humidity, root-bound) |
| GSAP-driven throughout, ScrollTrigger-based | Mechanic — motion library choice and orchestration approach | Directly adopted: GSAP + ScrollTrigger + Lenis is the Verde Noir stack (per brief, Tier 4) |

## 3. photo-direction.jpeg — mood + category-circle layout

This reference is a moodboard collage (multiple plant-shop UI screenshots), not a single
clean photography set. Treated as evidence of mood and one specific layout pattern, not a
source to clone directly.

| Observation | Mechanic or Identity | What we do instead |
|---|---|---|
| Row of circular category icons (Indoor plants / Outdoor plants / Seeds & soil / Pots), each a photo cropped to a circle with a label beneath | Mechanic — circular category-selector row | Directly informs the "shop by light" category circles (Low Light / Statement / Pet Safe / Beginner / Rare), recropped to our own photography, with magnetic hover + rotation added (not present in reference — this is new craft) |
| Dense jungle/houseplant photography as full-bleed backdrop behind panel-style content blocks | Mechanic — photography-as-backdrop, content in raised panels on top | Directly informs the foliage push-through section and hero |
| Dark forest-green panel UI (green-on-green, cream text) in one of the collaged screens | Identity — this is literally a competitor's palette | Not sampled — Verde Noir's palette is independently specified in the brief, not picked from this image |
| Botanical illustration / vintage plate style logotype ("Plantae") in one collaged screen | Identity — illustrated botanical branding | Not carried over — Verde Noir uses real photography, no illustration, per the brief |

## Net effect

Borrowed: asymmetric bento grid mechanics, section-as-beat scroll sequencing, differential
parallax for the signature moment, scroll-position-driven stagger reveals, circular
category-selector layout, footer column structure, pill nav CTA shape.

Never borrowed: SaaS/agency copy voice, sci-fi/dev-tool iconography, pricing-table
convention, any competitor's palette or illustrated botanical branding.
