import type { Product, ProductImage } from "@/lib/types";

function img(id: string, alt: string, ratio: ProductImage["ratio"] = "4:5"): ProductImage {
  return { id, alt, ratio };
}

// Fictional ANGEL WIRE catalogue — 20 one-of-one pieces. All 20 now use
// real user-supplied product photography (see ASSETS.md) — names, prices,
// and provenance-voice copy are still original fiction written for this
// catalogue, not descriptions of the actual pictured items' real history.
export const products: Product[] = [
  {
    id: "aw-0001",
    slug: "chrome-mesh-halter",
    name: "Chrome Mesh Halter",
    price: 2400,
    category: "tops",
    size: "XS/S",
    condition: "excellent",
    material: "Nylon mesh, chrome-tone chain trim",
    description:
      "Metallic mesh that catches every light in the room and none of them kindly. Chain trim is original, not added later — you can tell by the solder.",
    images: [img("aw-0001-a", "Chrome Mesh Halter, front", "3:4")],
    availability: "available",
    oneOfOne: true,
    collections: ["angel-hour", "after-dark"],
  },
  {
    id: "aw-0002",
    slug: "rhinestone-angel-baby-tee",
    name: "Rhinestone 'Angel' Baby Tee",
    price: 1200,
    category: "tops",
    size: "S",
    condition: "good",
    material: "Cotton jersey, hotfix rhinestones",
    description:
      "Iron-on script gone slightly crooked in the wash, three stones missing off the wing. That's not a flaw — that's the whole point of buying it used.",
    images: [img("aw-0002-a", "Rhinestone Angel Baby Tee, front", "3:4")],
    availability: "sold",
    oneOfOne: true,
    collections: ["angel-hour"],
  },
  {
    id: "aw-0003",
    slug: "velour-zip-up-hoodie",
    name: "Velour Zip-Up Hoodie",
    price: 1800,
    category: "tops",
    size: "M",
    condition: "loved",
    material: "Cotton-poly velour",
    description:
      "The kind of soft that only happens after a hundred washes you weren't there for. Zip pull is a replacement — someone loved this enough to fix it once already.",
    images: [img("aw-0003-a", "Velour Zip-Up Hoodie, front", "3:4")],
    availability: "available",
    oneOfOne: true,
    collections: ["soft-damage"],
  },
  {
    id: "aw-0004",
    slug: "corset-back-denim-vest",
    name: "Corset-Back Denim Jacket",
    price: 2100,
    category: "tops",
    size: "S/M",
    condition: "excellent",
    material: "Cotton denim, grommet lacing",
    description:
      "Cropped, boned at the back seams, laced instead of buttoned. Whoever wore this last had strong opinions about silhouette.",
    images: [img("aw-0004-a", "Corset-Back Denim Jacket, back", "1:1")],
    availability: "available",
    oneOfOne: true,
    collections: ["after-dark", "found-objects"],
  },
  {
    id: "aw-0005",
    slug: "low-rise-pinstripe-trousers",
    name: "Low-Rise Pinstripe Trousers",
    price: 1900,
    category: "bottoms",
    size: "28",
    condition: "good",
    material: "Poly-viscose blend",
    description:
      "Sits exactly where the label promises it won't. Pinstripe's faded to grey on the left thigh where it caught the most sun on a hanger somewhere.",
    images: [img("aw-0005-a", "Low-Rise Pinstripe Trousers, front", "3:4")],
    availability: "available",
    oneOfOne: true,
    collections: ["angel-hour"],
  },
  {
    id: "aw-0006",
    slug: "cyber-cargo-pants",
    name: "Cyber Cargo Pants",
    price: 2600,
    category: "bottoms",
    size: "30",
    condition: "excellent",
    material: "Ripstop nylon, D-ring straps",
    description:
      "Six pockets, two of them still zip shut, one that never did. Straps buckle across the thigh for no reason anyone can explain, which is exactly why they're staying on.",
    images: [img("aw-0006-a", "Cyber Cargo Pants, front", "3:4")],
    availability: "available",
    oneOfOne: true,
    collections: ["after-dark", "found-objects"],
  },
  {
    id: "aw-0007",
    slug: "terry-cloth-track-shorts",
    name: "Terry Cloth Track Shorts",
    price: 900,
    category: "bottoms",
    size: "M",
    condition: "loved",
    material: "Cotton terry",
    description:
      "Toweling gone thin at the seat in the honest way, not the manufactured way. Drawstring's the original — still knots on the first try.",
    images: [img("aw-0007-a", "Terry Cloth Track Shorts, front", "3:4")],
    availability: "available",
    oneOfOne: true,
    collections: ["soft-damage"],
  },
  {
    id: "aw-0008",
    slug: "holographic-slip-dress",
    name: "Holographic Slip Dress",
    price: 3400,
    category: "dresses",
    size: "S",
    condition: "deadstock",
    material: "Iridescent polyester satin",
    description:
      "Never worn — the tag's still stitched in, just gone slightly crisp with age. Changes colour depending on where you're standing, which nobody warns you about.",
    images: [img("aw-0008-a", "Holographic Slip Dress, front", "1:1")],
    availability: "available",
    oneOfOne: true,
    collections: ["angel-hour"],
  },
  {
    id: "aw-0009",
    slug: "butterfly-wrap-mini-dress",
    name: "Butterfly Wrap Mini Dress",
    price: 2200,
    category: "dresses",
    size: "S/M",
    condition: "excellent",
    material: "Stretch mesh, plastic butterfly clasp",
    description:
      "Wraps and ties at the hip, held together at the front by a single plastic butterfly that has clearly outlived several better-made dresses.",
    images: [img("aw-0009-a", "Butterfly Wrap Mini Dress, front", "3:4")],
    availability: "available",
    oneOfOne: true,
    collections: ["angel-hour", "found-objects"],
  },
  {
    id: "aw-0010",
    slug: "fishtail-satin-slip",
    name: "Fishtail Satin Slip",
    price: 2000,
    category: "dresses",
    size: "M",
    condition: "good",
    material: "Polyester satin",
    description:
      "Bias-cut, so it moves before you do. Small pull near the hem from a shoe that wasn't hers — every slip dress has a story like that.",
    images: [img("aw-0010-a", "Fishtail Satin Slip, front", "3:4")],
    availability: "sold",
    oneOfOne: true,
    collections: ["after-dark"],
  },
  {
    id: "aw-0011",
    slug: "iridescent-pvc-trench",
    name: "Iridescent Trench",
    price: 4200,
    category: "outerwear",
    size: "M",
    condition: "excellent",
    material: "PVC, snap-front closure",
    description:
      "Heavy enough to hear yourself walk in. The shine hasn't dulled because someone clearly never wore it in the rain, which feels like a waste, honestly.",
    images: [img("aw-0011-a", "Iridescent Trench, front", "3:4")],
    availability: "available",
    oneOfOne: true,
    collections: ["after-dark"],
  },
  {
    id: "aw-0012",
    slug: "fur-trim-puffer-vest",
    name: "Fur-Trim Puffer Vest",
    price: 2800,
    category: "outerwear",
    size: "L",
    condition: "loved",
    material: "Nylon shell, faux fur collar",
    description:
      "Down's gone a little flat where the strap sat, collar's matted in a way that only brushes out halfway. Warmer than it has any right to be at this price.",
    images: [img("aw-0012-a", "Fur-Trim Puffer Vest, front", "3:4")],
    availability: "available",
    oneOfOne: true,
    collections: ["soft-damage"],
  },
  {
    id: "aw-0013",
    slug: "chainmail-shoulder-bag",
    name: "Chainmail Shoulder Bag",
    price: 1600,
    category: "bags",
    size: "One Size",
    condition: "excellent",
    material: "Metal chainmail, satin lining",
    description:
      "Heavier than it looks, louder than it should be. Lining's a replacement — someone re-sewed it by hand, not quite straight, which is how you know it mattered to them.",
    images: [img("aw-0013-a", "Chainmail Shoulder Bag, worn", "1:1")],
    availability: "available",
    oneOfOne: true,
    collections: ["angel-hour", "found-objects"],
  },
  {
    id: "aw-0014",
    slug: "pleather-baguette-bag",
    name: "Pleather Baguette Bag",
    price: 1100,
    category: "bags",
    size: "One Size",
    condition: "good",
    material: "Faux leather, gold-tone hardware",
    description:
      "Corners are soft from being carried under one arm for years, the way baguette bags are supposed to be carried and rarely are anymore.",
    images: [img("aw-0014-a", "Pleather Baguette Bag, front")],
    availability: "available",
    oneOfOne: true,
    collections: ["found-objects"],
  },
  {
    id: "aw-0015",
    slug: "mesh-drawstring-backpack",
    name: "Mesh Drawstring Backpack",
    price: 950,
    category: "bags",
    size: "One Size",
    condition: "loved",
    material: "Nylon mesh",
    description:
      "See-through by design, so whatever's inside becomes part of the outfit whether you planned that or not. Drawstring's frayed at the cord-lock, still cinches fine.",
    images: [img("aw-0015-a", "Mesh Drawstring Backpack, front", "1:1")],
    availability: "available",
    oneOfOne: true,
    collections: ["after-dark", "soft-damage"],
  },
  {
    id: "aw-0016",
    slug: "platform-mary-janes",
    name: "Platform Mary Janes",
    price: 2900,
    category: "shoes",
    size: "UK 5",
    condition: "excellent",
    material: "Patent PU, rubber platform sole",
    description:
      "Two-inch platform, one strap, buckle that still clicks shut properly. Patent finish has exactly one scuff, on the left toe, from something that happened on someone else's night out.",
    images: [img("aw-0016-a", "Platform Mary Janes, pair", "1:1")],
    availability: "available",
    oneOfOne: true,
    collections: ["angel-hour"],
  },
  {
    id: "aw-0017",
    slug: "bratz-era-platform-sandals",
    name: "Bratz-era Platform Sandals",
    price: 1700,
    category: "shoes",
    size: "UK 6",
    condition: "good",
    material: "Synthetic upper, chunky EVA sole",
    description:
      "Impossible to walk quietly in, which was clearly the intention. Strap's stretched slightly wide from a foot that wasn't quite this size — still wearable, just not silent.",
    images: [img("aw-0017-a", "Bratz-era Platform Sandals, pair", "1:1")],
    availability: "sold",
    oneOfOne: true,
    collections: ["after-dark", "found-objects"],
  },
  {
    id: "aw-0018",
    slug: "butterfly-clip-set-vintage",
    name: "Butterfly Clip Set (Vintage)",
    price: 450,
    category: "accessories",
    size: "One Size",
    condition: "good",
    material: "Acrylic, metal clips",
    description:
      "Six clips, two colours faded more than the others from a windowsill they clearly sat on for a decade. Grip's still strong on every single one.",
    images: [img("aw-0018-a", "Butterfly Clip Set, full set", "1:1")],
    availability: "available",
    oneOfOne: true,
    collections: ["found-objects"],
  },
  {
    id: "aw-0019",
    slug: "flip-phone-charm-necklace",
    name: "Flip Phone Charm Necklace",
    price: 700,
    category: "accessories",
    size: "One Size",
    condition: "excellent",
    material: "Resin charm, ball chain",
    description:
      "A tiny resin flip phone that doesn't do anything except remind you that phones used to fold. Chain's the adjustable kind — clasp still catches on the first try.",
    images: [img("aw-0019-a", "Flip Phone Charm Necklace, full", "3:4")],
    availability: "available",
    oneOfOne: true,
    collections: ["found-objects", "angel-hour"],
  },
  {
    id: "aw-0020",
    slug: "rhinestone-heart-sunglasses",
    name: "Rhinestone Heart Sunglasses",
    price: 1300,
    category: "accessories",
    size: "One Size",
    condition: "excellent",
    material: "Acetate frame, rhinestone trim, tinted lens",
    description:
      "Heart-shaped, obviously. One stone's a shade off from the rest — a replacement, done carefully, by someone who cared more about the fix than the perfect match.",
    images: [img("aw-0020-a", "Rhinestone Heart Sunglasses, front", "3:4")],
    availability: "available",
    oneOfOne: true,
    collections: ["angel-hour", "found-objects"],
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  const sameCategory = products.filter(
    (p) => p.id !== product.id && p.category === product.category
  );
  const sameCollection = products.filter(
    (p) =>
      p.id !== product.id &&
      p.category !== product.category &&
      p.collections.some((c) => product.collections.includes(c))
  );
  return [...sameCategory, ...sameCollection].slice(0, limit);
}
