import type { Metadata } from "next";
import { collections } from "@/data/collections";
import { products } from "@/data/products";
import CollectionsIndex from "@/components/collections/CollectionsIndex";

export const metadata: Metadata = {
  title: "Collections — ANGEL WIRE",
};

export default function CollectionsPage() {
  return <CollectionsIndex collections={collections} products={products} />;
}
