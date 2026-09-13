export type Category = "Low Light" | "Statement" | "Pet Safe" | "Beginner" | "Rare";

export type Product = {
  id: string;
  name: string;
  latin: string;
  price: number;
  categories: Category[];
  blurb: string;
  care: { light: string; water: string; humidity: string };
  image: string;
  imageAlt: string;
  image2?: string;
};

export const products: Product[] = [
  {
    id: "monstera-deliciosa",
    name: "Monstera Deliciosa",
    latin: "Monstera deliciosa",
    price: 68,
    categories: ["Statement", "Beginner"],
    blurb:
      "Deep fenestrations split wider with every new leaf — give it a moss pole and get out of the way.",
    care: {
      light: "Bright, indirect",
      water: "When top 2in dries",
      humidity: "40%+",
    },
    image: "/images/products/monstera-deliciosa-1.jpg",
    image2: "/images/products/monstera-deliciosa-2.jpg",
    imageAlt: "Monstera deliciosa with split, fenestrated leaves in a white pot",
  },
  {
    id: "zz-plant",
    name: "ZZ Plant",
    latin: "Zamioculcas zamiifolia",
    price: 42,
    categories: ["Low Light", "Beginner"],
    blurb:
      "Waxy, glossy leaflets grow from thick potato-like rhizomes built to survive weeks of neglect.",
    care: {
      light: "Low to bright",
      water: "Every 2–3 weeks",
      humidity: "Any",
    },
    image: "/images/products/zz-plant-1.jpg",
    image2: "/images/products/zz-plant-2.jpg",
    imageAlt: "Glossy ZZ plant leaves against a white sheet backdrop",
  },
  {
    id: "marble-queen-pothos",
    name: "Marble Queen Pothos",
    latin: "Epipremnum aureum 'Marble Queen'",
    price: 32,
    categories: ["Low Light", "Beginner"],
    blurb:
      "Heavy variegation on every trailing vine — more light means more white, less green.",
    care: {
      light: "Low to medium",
      water: "When soil is dry",
      humidity: "Any",
    },
    image: "/images/products/marble-queen-pothos-1.jpg",
    image2: "/images/products/marble-queen-pothos-2.jpg",
    imageAlt: "Marble Queen pothos with heavily variegated white and green leaves",
  },
  {
    id: "calathea-orbifolia",
    name: "Calathea Orbifolia",
    latin: "Goeppertia orbifolia",
    price: 58,
    categories: ["Statement", "Pet Safe"],
    blurb:
      "Silver-striped leaves fold up at night and unfurl by morning, tracking light like a compass.",
    care: {
      light: "Bright, indirect",
      water: "Evenly moist",
      humidity: "50%+",
    },
    image: "/images/products/calathea-orbifolia-1.jpg",
    imageAlt: "Calathea orbifolia with large round silver-striped leaves in a white pot",
  },
  {
    id: "snake-plant",
    name: "Snake Plant",
    latin: "Dracaena trifasciata",
    price: 38,
    categories: ["Low Light", "Beginner"],
    blurb:
      "Stiff, sword-shaped leaves store water in their tissue, so this one thrives on benign neglect.",
    care: {
      light: "Low to bright",
      water: "Every 3–4 weeks",
      humidity: "Any",
    },
    image: "/images/products/snake-plant-1.jpg",
    image2: "/images/products/snake-plant-2.jpg",
    imageAlt: "Snake plant with variegated sword-shaped leaves",
  },
  {
    id: "fiddle-leaf-fig",
    name: "Fiddle Leaf Fig",
    latin: "Ficus lyrata",
    price: 98,
    categories: ["Statement", "Rare"],
    blurb:
      "Violin-shaped leaves the size of dinner plates on a single dramatic stem — dislikes being moved once settled.",
    care: {
      light: "Bright, indirect",
      water: "Weekly, consistent",
      humidity: "40%+",
    },
    image: "/images/products/fiddle-leaf-fig-1.jpg",
    image2: "/images/products/fiddle-leaf-fig-2.jpg",
    imageAlt: "Fiddle leaf fig with large glossy violin-shaped leaves",
  },
  {
    id: "peperomia-hope",
    name: "Peperomia Hope",
    latin: "Peperomia tetraphylla 'Hope'",
    price: 26,
    categories: ["Beginner", "Pet Safe"],
    blurb:
      "Round, succulent-thick leaves trail from a compact rosette — genuinely non-toxic if curious pets get close.",
    care: {
      light: "Medium, indirect",
      water: "When soil is dry",
      humidity: "Any",
    },
    image: "/images/products/peperomia-hope-1.jpg",
    image2: "/images/products/peperomia-hope-2.jpg",
    imageAlt: "Peperomia Hope with round succulent trailing leaves",
  },
  {
    id: "calathea-medallion",
    name: "Calathea Medallion",
    latin: "Goeppertia veitchiana 'Medallion'",
    price: 44,
    categories: ["Statement", "Pet Safe"],
    blurb:
      "Round leaves patterned like a hand-painted medallion, with a deep plum underside.",
    care: {
      light: "Bright, indirect",
      water: "Evenly moist",
      humidity: "50%+",
    },
    image: "/images/products/calathea-medallion-1.jpg",
    image2: "/images/products/calathea-medallion-2.jpg",
    imageAlt: "Calathea Medallion with round patterned leaves held above a white pot",
  },
  {
    id: "string-of-pearls",
    name: "String of Pearls",
    latin: "Curio rowleyanus",
    price: 34,
    categories: ["Rare", "Statement"],
    blurb:
      "Bead-like leaves trail a foot or more from a hanging pot, each pearl storing water like a tiny succulent.",
    care: {
      light: "Bright, direct-adjacent",
      water: "Let dry fully",
      humidity: "Low",
    },
    image: "/images/products/string-of-pearls-1.jpg",
    image2: "/images/products/string-of-pearls-2.jpg",
    imageAlt: "String of Pearls trailing bead-like leaves over a dark pot on a windowsill",
  },
];

export const categories: Category[] = [
  "Low Light",
  "Statement",
  "Pet Safe",
  "Beginner",
  "Rare",
];

export function formatPrice(cents: number): string {
  return `$${cents.toFixed(0)}`;
}
