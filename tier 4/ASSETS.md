# ASSETS.md — Verde Noir

Every image/motion asset the page needs, derived from the brief + DIRECTION.md. All
photography sourced from Unsplash (free commercial license), downloaded and graded locally.
Sketch/greybox step skipped: section order, per-section motion, and exact asset list were
already pinned in the brief, so a greybox would restate DIRECTION.md rather than surface new
decisions — going straight to sourcing + build instead.

Post-rebuild (mirroring `.refs/`), the hero and brand-moment sections no longer use
dedicated photography — they reuse existing `products/` images (see Notes). `hero-wide.jpg`
and `foliage-full.jpg` are gone; nothing references them.

| ID | Section | Ratio | Source | Cost | Fallback if it never arrives |
|---|---|---|---|---|---|
| product-monstera-deliciosa | Hero (leaf overlap) + Shop grid (featured) | 4:5 | Unsplash | download + grade | Panel-color placeholder card with plant name, still purchasable |
| product-zz-plant | Shop grid | 4:5 | Unsplash | download + grade | same pattern |
| product-marble-queen-pothos | Shop grid | 4:5 | Unsplash | download + grade | same pattern |
| product-calathea-orbifolia | Shop grid | 4:5 | Unsplash | download + grade | same pattern |
| product-snake-plant | Shop grid | 4:5 | Unsplash | download + grade | same pattern |
| product-fiddle-leaf-fig | Shop grid | 4:5 | Unsplash | download + grade | same pattern |
| product-peperomia-hope | Shop grid | 4:5 | Unsplash | download + grade | same pattern |
| product-calathea-medallion | Shop grid | 4:5 | Unsplash | download + grade | same pattern |
| product-string-of-pearls | Shop grid | 4:5 | Unsplash | download + grade | same pattern |

## Sourced files (downloaded, graded at render time via CSS filter)

All from images.unsplash.com (standard Unsplash License, free for commercial use — Unsplash+
`plus.unsplash.com` results were explicitly avoided/replaced since those require a paid
license). Visually verified per-file for correct subject and absence of watermark.

- `products/monstera-deliciosa-{1,2}.jpg` — green-plant-on-white-ceramic-pot-bwsTJMnhcwE, green-monstera-leaves-on-white-70l1tDAI6rM (`-2`, a tight diagonal leaf close-up, doubles as the hero's overlap photo — masked + multiply-tinted in `Hero.tsx` so the studio-white background reads as shadow, not a hard box, against `--bg`)
- `products/zz-plant-{1,2}.jpg` — green-plant-on-white-ceramic-pot-R6JrgqnlgRE, white-pot-with-green-plant-vHkj3fX9wCk (`-1` also used, circle-cropped, as the brand-moment's small botanical photo — chosen over `calathea-medallion-1` for that spot specifically because it has no hand/person in frame)
- `products/marble-queen-pothos-{1,2}.jpg` — white-and-green-leaf-plant-YZPh3-B4iZk, green-and-white-leaf-plant-X4TF6LFEr0w
- `products/calathea-orbifolia-1.jpg` — a-green-plant-in-a-white-pot-on-a-table-rNjEk8d2vmQ (no second angle — see fallback note below)
- `products/snake-plant-{1,2}.jpg` — green-and-yellow-snake-plant-CV_fZy0fUww, green-plant-on-white-ceramic-pot-gzu-etcMXKw
- `products/fiddle-leaf-fig-{1,2}.jpg` — green-plant-on-white-ceramic-pot-TNTZ9XRisjQ, green-leafed-plant-in-white-pot-EbLX7oRo4vI
- `products/peperomia-hope-{1,2}.jpg` — green-plant-on-white-ceramic-pot-Gl1BxFdbOBM, a-close-up-of-a-plant-with-green-leaves-xrE6j-Uw69s
- `products/calathea-medallion-{1,2}.jpg` — green-plant-on-white-ceramic-pot-rGdSwVibhiQ, green-leaves-in-tilt-shift-lens-IQaMIFWD_ug
- `products/string-of-pearls-{1,2}.jpg` — two windowsill string-of-pearls shots (ids 1648070024741, 1648070024548), confirmed genuine on visual review

## Notes

- Product hover-crossfade to "a second angle if available": Unsplash rarely has a true second
  angle of the *same* plant specimen from the same shoot. Treated per-product — where a
  second suitable Unsplash photo of the same species exists, use it; where it doesn't, the
  crossfade target is a tighter detail crop (leaf/texture) of the same primary photo instead
  of forcing a mismatched second photo that would break the "one shoot" grade consistency.
- Grading approach: CSS `filter` (brightness/contrast/saturate + a warm-tinted `mix-blend-mode`
  overlay at low opacity) applied uniformly at render time, not baked per-file — keeps all
  photos adjustable from one place and guarantees consistency without re-exporting images.
- All images self-hosted under `public/images/` (downloaded, not hotlinked) and served via
  `next/image` with explicit width/height for CLS safety and priority/lazy split for LCP.
- `--mint` (`#E7EDE2`, a pale tint of `--green-light`) was added to the token system for the
  shop-grid section's light background — a second light tone distinct from `--cream`, not an
  ad hoc one-off hex, since both light sections needed to read as clearly different panels.
- Category circles now overlay their label directly on the photo (bottom, white text over a
  dark gradient scrim) rather than captioning below the frame, per `monstera-dark.png`'s
  circle treatment — the magnetic-hover rotation stays confined to the photo layer only, so
  the label never spins with it.
