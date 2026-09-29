import type { Metadata } from "next";
import { products } from "@/data/products";
import ShopArchive from "@/components/shop/ShopArchive";

export const metadata: Metadata = {
  title: "Shop — ANGEL WIRE",
};

export default function ShopPage() {
  return <ShopArchive products={products} />;
}
