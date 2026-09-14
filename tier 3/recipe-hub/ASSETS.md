# ASSETS.md — Recipe Hub (v3, rustic/organic)

13 photographs (12 recipes + 1 hero), all sourced in Option B — Moody Dark-Wood Tablescape — the
style picked from the Stage 0 mood board. All verified live (HTTP 200) and free-licensed (Unsplash
License, no Unsplash+). 4 cuisine-collection cards reuse the first recipe photo per cuisine, per
the ledger's "reuse rather than re-shoot" mechanic.

| ID | Recipe | Match quality | Note |
|---|---|---|---|
| hero | — (sourdough loaf) | Strong | Dramatic side-light, charcoal linen — sets the whole site's mood |
| R1 | Cacio e Pepe | Strong | Bowtie pasta, dark ceramic, moody linen |
| R2 | Margherita Pizza | Strong | Oven-glow close-up, genuinely dramatic |
| R3 | Chicken Piccata | Strong | Butter-basting action shot, charred lemon in frame |
| R4 | Pad Thai with Shrimp | Strong | Exact dish, dark plate, cilantro/lime |
| R5 | Green Curry with Chicken | Strong | Exact dish, dark bowl, wood table, chopsticks |
| R6 | Som Tam | **Approximate** | No moody, free-licensed green papaya salad exists — stand-in is an Indian shredded-vegetable salad (poriyal) in a black bowl. Same silhouette (shredded veg, dark bowl), different cuisine's dish. |
| R7 | Street Corn Tacos | Approximate | Real tacos, warm bar-light rather than true dark-wood mood — pulled into the grade below |
| R8 | Carne Asada | Approximate | Raw seasoned steak on a board rather than the grilled, sliced final dish — reads as "ingredients" more than "plated" |
| R9 | Chilaquiles Verdes | Strong | Exact dish, reused from the prior direction |
| R10 | Chana Masala | Approximate | Exact dish (chana bhatura) but lit warm/bright, not dark |
| R11 | Butter Chicken | Approximate | Legitimate butter chicken, lit warm/bright, not dark |
| R12 | Palak Paneer | Approximate | Exact dish, reused from the prior direction, lit bright |

**Why the approximations:** free-tier stock photography that is simultaneously (a) the correct
specific dish and (b) shot in genuine dark-wood moody style doesn't exist for every one of these 12
recipes — Som Tam and Carne Asada in particular have no free moody match at all. Rather than pick a
worse-fitting dish just to chase the mood, or a correct dish that's badly lit, each pick prioritizes
whichever compromise is smaller, and the shared grade below does the rest.

**The unifying grade:** every image gets `contrast(1.08) saturate(0.92) brightness(0.93)` — this is
what actually makes 13 photos from different shoots read as one direction. It pulls the 5
brighter/warmer photos (tacos, carne asada, chana masala, butter chicken, palak paneer) down toward
the mood of the genuinely dark ones, rather than leaving the page as a mix of dark and bright cards.

**Fallback if a photo license changes:** swap the `image.id` field in that recipe's JSON — the
content layer and every component read the id at request time via `unsplashUrl()`, nothing else
needs to change.
