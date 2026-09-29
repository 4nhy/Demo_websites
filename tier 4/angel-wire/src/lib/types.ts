// ANGEL WIRE — shared domain types.
// See ARCHITECTURE.md for the full proposal these were approved from.

export type Category =
  | "tops"
  | "bottoms"
  | "dresses"
  | "outerwear"
  | "bags"
  | "shoes"
  | "accessories";

export type Condition = "deadstock" | "excellent" | "good" | "loved";
// deadstock — old stock, never worn · excellent — worn, pristine
// good — honest gentle wear · loved — well-worn, characterful (brand voice, not a downgrade)

export type Availability = "available" | "sold";

export type ProductImage = {
  /** Not a real file yet — every image is a placeholder until generation lands
   *  (see ASSETS.md). `id` is stable so a real asset can be swapped in later
   *  without touching product data shape. */
  id: string;
  alt: string;
  ratio: "4:5" | "1:1" | "3:4";
};

export interface Product {
  id: string;
  slug: string;
  name: string;
  /** INR, whole rupees. ₹2,400 is stored as 2400. */
  price: number;
  category: Category;
  size: string;
  condition: Condition;
  material: string;
  description: string;
  images: ProductImage[];
  /** Seed state — merges with the session's sold ledger at render time.
   *  Never read directly; always go through getAvailability(). */
  availability: Availability;
  oneOfOne: boolean;
  /** Editorial groupings, not category filters — a product can sit in several. */
  collections: string[];
}

export interface Collection {
  slug: string;
  name: string;
  description: string;
}

export type CartItem = {
  productId: string;
  addedAt: number;
};

export type OrderContact = { name: string; email: string };
export type OrderShipping = { address: string; city: string; pincode: string };

export type Order = {
  id: string;
  items: Product[];
  subtotal: number;
  placedAt: number;
  contact: OrderContact;
  shipping: OrderShipping;
};
