import type { Metadata } from "next";
import ShopShowcase from "@/components/ShopShowcase";
import ProductGrid from "@/components/ProductGrid";
import Footer from "@/components/Footer";
import { FilterProvider } from "@/lib/filter-context";

const title = "Shop — Verde Noir";
const description =
  "The full Verde Noir collection — real houseplants, hand-picked and root-checked.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description },
  twitter: { title, description },
};

// Full shop page — relocated content, not rewritten: the same
// ShopShowcase and ProductGrid components used on the homepage preview,
// just the complete experience here (full catalogue, not curated).
export default function ShopPage() {
  return (
    <main>
      <ShopShowcase priority />
      <FilterProvider>
        <ProductGrid />
      </FilterProvider>
      <Footer />
    </main>
  );
}
