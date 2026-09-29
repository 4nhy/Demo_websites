import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug, getRelatedProducts } from "@/data/products";
import ProductGallery from "@/components/product/ProductGallery";
import ProductInfo from "@/components/product/ProductInfo";
import RelatedPieces from "@/components/product/RelatedPieces";

export async function generateMetadata(
  props: PageProps<"/shop/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const product = getProductBySlug(slug);
  return { title: product ? `${product.name} — ANGEL WIRE` : "ANGEL WIRE" };
}

export default async function ProductPage(props: PageProps<"/shop/[slug]">) {
  const { slug } = await props.params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const related = getRelatedProducts(product);

  return (
    <main className="bg-chrome-white px-6 py-12 sm:px-10 sm:py-16">
      <Link
        href="/shop"
        className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-grape-ink/50 hover:text-grape-ink"
      >
        <span aria-hidden="true">←</span> Back to the Archive
      </Link>

      <div className="mt-8 grid grid-cols-1 gap-10 sm:grid-cols-2 sm:gap-16">
        <ProductGallery images={product.images} />
        <ProductInfo product={product} />
      </div>
      <RelatedPieces products={related} />
    </main>
  );
}
