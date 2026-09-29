import type { Availability, Product } from "@/lib/types";

/**
 * The single place that decides SOLD. A product is sold if it was seeded
 * that way, or if this session's checkout ledger says so. Every component
 * that needs to know — grid, detail page, related pieces, the bag itself —
 * goes through this rather than reading `product.availability` directly, so
 * the state can never drift between two places that show the same product.
 */
export function getAvailability(product: Product, soldIds: string[]): Availability {
  if (product.availability === "sold") return "sold";
  if (soldIds.includes(product.id)) return "sold";
  return "available";
}

export function isSold(product: Product, soldIds: string[]): boolean {
  return getAvailability(product, soldIds) === "sold";
}
