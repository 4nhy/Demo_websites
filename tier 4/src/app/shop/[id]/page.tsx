import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { products, formatPrice } from "@/lib/products";
import ProductDetailActions from "@/components/ProductDetailActions";
import Footer from "@/components/Footer";

export function generateStaticParams() {
  return products.map((p) => ({ id: p.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = products.find((p) => p.id === id);
  if (!product) return { title: "Plant not found — Verde Noir" };
  const title = `${product.name} — Verde Noir`;
  return {
    title,
    description: product.blurb,
    openGraph: {
      title,
      description: product.blurb,
      images: [{ url: product.image, width: 1400, height: 1750 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: product.blurb,
      images: [product.image],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = products.find((p) => p.id === id);
  if (!product) notFound();

  return (
    <>
      <main className="section-pad bg-bg px-6 md:px-12">
        <div className="mx-auto max-w-5xl">
          <Link
            href="/shop"
            className="mb-10 inline-flex items-center gap-1.5 text-sm text-cream-dim underline decoration-cream/30 underline-offset-4 hover:text-cream"
          >
            <span aria-hidden="true">←</span> Back to shop
          </Link>

          <div className="grid grid-cols-1 gap-10 md:grid-cols-[1fr_1fr] md:gap-16">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-panel">
              <Image
                src={product.image}
                alt={product.imageAlt}
                fill
                sizes="(min-width: 768px) 45vw, 90vw"
                className="object-cover"
                style={{ filter: "brightness(0.78) saturate(1.08) sepia(0.05)" }}
                fetchPriority="high"
                loading="eager"
              />
            </div>

            <div>
              <h1 className="font-display text-4xl text-cream md:text-5xl">{product.name}</h1>
              <p className="mt-1 text-base italic text-cream-dim">{product.latin}</p>
              <p className="mt-5 text-2xl text-gold-bright">{formatPrice(product.price)}</p>
              <p className="mt-5 max-w-prose text-base leading-relaxed text-cream-dim">
                {product.blurb}
              </p>

              <dl className="mt-8 grid grid-cols-3 gap-4 border-t border-cream/10 pt-6 text-sm">
                <div>
                  <dt className="text-cream-dim/70">Light</dt>
                  <dd className="mt-1 text-cream">{product.care.light}</dd>
                </div>
                <div>
                  <dt className="text-cream-dim/70">Water</dt>
                  <dd className="mt-1 text-cream">{product.care.water}</dd>
                </div>
                <div>
                  <dt className="text-cream-dim/70">Humidity</dt>
                  <dd className="mt-1 text-cream">{product.care.humidity}</dd>
                </div>
              </dl>

              <ProductDetailActions productId={product.id} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
