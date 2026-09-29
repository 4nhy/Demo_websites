import type { Collection } from "@/lib/types";

// Editorial groupings — deliberately NOT a 1:1 map onto categories. A dress,
// a bag, and a pair of shoes can all belong to "Angel Hour" together.
export const collections: Collection[] = [
  {
    slug: "angel-hour",
    name: "Angel Hour",
    description:
      "That very specific hour — glitter still on from the night before, sun coming up anyway. The going-out pieces built to survive it.",
  },
  {
    slug: "after-dark",
    name: "After Dark",
    description:
      "Not going-out clothes. Late-shift clothes — the ones built to move, damage-proof, made for a floor that's sticky by 1am.",
  },
  {
    slug: "soft-damage",
    name: "Soft Damage",
    description:
      "Worn exactly enough. Pieces that already did the work of breaking themselves in — the good fade, the honest thin patch.",
  },
  {
    slug: "found-objects",
    name: "Found Objects",
    description:
      "Not clothing, really — the small hardware of a life. What ends up in the bottom of a bag.",
  },
];
