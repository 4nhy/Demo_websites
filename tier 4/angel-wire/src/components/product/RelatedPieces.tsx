import type { Product } from "@/lib/types";
import ArchiveCard from "@/components/shop/ArchiveCard";

// Sold pieces are deliberately included here, badge intact — for one-of-one
// thrift, "this exact piece is already gone" reinforces scarcity rather than
// being a dead end to hide.
export default function RelatedPieces({ products }: { products: Product[] }) {
  if (products.length === 0) return null;

  return (
    <section className="mt-24 border-t border-grape-ink/10 pt-12">
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-bubblegum/70">
        Also in the Archive
      </p>
      <h2 className="mt-2 font-display text-2xl italic text-grape-ink sm:text-3xl">
        You might also take this one.
      </h2>
      <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-4">
        {products.map((product) => (
          <ArchiveCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
