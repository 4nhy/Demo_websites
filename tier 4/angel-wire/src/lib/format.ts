import type { Category, Condition } from "@/lib/types";

const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export function formatPrice(amount: number): string {
  return inr.format(amount);
}

/** "aw-0001" -> "No. 001" — the catalogue-number label used on cards and tags. */
export function formatCatalogueNumber(id: string): string {
  const digits = id.replace(/\D/g, "").slice(-3).padStart(3, "0");
  return `No. ${digits}`;
}

export const CATEGORY_LABEL: Record<Category, string> = {
  tops: "Tops",
  bottoms: "Bottoms",
  dresses: "Dresses",
  outerwear: "Outerwear",
  bags: "Bags",
  shoes: "Shoes",
  accessories: "Accessories",
};

export const CONDITION_LABEL: Record<Condition, string> = {
  deadstock: "Deadstock",
  excellent: "Excellent",
  good: "Good",
  loved: "Loved-in",
};

export const CONDITION_NOTE: Record<Condition, string> = {
  deadstock: "Old stock, never worn.",
  excellent: "Worn, kept pristine.",
  good: "Honest, gentle wear.",
  loved: "Well-worn and characterful.",
};
