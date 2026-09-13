"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { products, formatPrice, type Product } from "@/lib/products";
import { useFilter } from "@/lib/filter-context";
import { useCart } from "@/lib/cart-context";
import { usePrefersReducedMotion } from "@/lib/motion";
import ProductCard from "./ProductCard";

gsap.registerPlugin(ScrollTrigger);

// Full recomposition off the old flat mint-background catalogue grid:
// dark page bg to match the rest of the site, one product treated as an
// editorial spotlight (same large-image + ghost-name + description +
// stats pattern ShopShowcase already established), then the remaining
// plants in an asymmetric grid — mixed card sizes via a dense grid
// rather than a uniform repeat — using the existing hover-tilt
// ProductCard and its scroll-triggered entrance, unmodified.
function Spotlight({ product }: { product: Product }) {
  const reduced = usePrefersReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { addItem } = useCart();

  useEffect(() => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 80%" },
        }
      );
    }, el);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <div
      ref={ref}
      style={reduced ? undefined : { opacity: 0 }}
      className="md:grid md:grid-cols-[1.1fr_1fr] md:items-center md:gap-14 lg:gap-20"
    >
      <div className="relative h-[42vh] w-full max-w-xl overflow-hidden rounded-2xl bg-panel sm:h-[50vh] md:h-[58vh]">
        {/* No fetchPriority here deliberately — this sits well below
            ShopShowcase's full pinned sequence, so it's never the
            above-the-fold LCP candidate on /shop; giving it high
            priority would only compete with ShopShowcase's image for
            the browser's priority fetch slot. */}
        <Image
          src={product.image}
          alt={product.imageAlt}
          fill
          sizes="(min-width: 768px) 44vw, 90vw"
          className="object-cover"
          style={{ filter: "brightness(0.78) saturate(1.08) sepia(0.05)" }}
        />
      </div>

      {/* Right side — the same ghost-text-behind-description-and-stats
          composition as ShopShowcase, just without the scroll-step
          thumbnails since this is a single static spotlight. */}
      <div className="relative mt-10 md:mt-0">
        <div className="relative z-10 max-w-[46ch]">
          <p className="mb-2 text-xs tracking-[0.25em] text-gold uppercase">Spotlight</p>
          <h3 className="font-display text-3xl text-cream md:text-5xl">{product.name}</h3>
          <p className="mt-1 text-sm italic text-cream-dim">{product.latin}</p>

          <p className="mt-6 text-base leading-normal text-cream-dim md:text-lg">
            {product.blurb}
          </p>

          {/* Stats get their own relative wrapper so the ghost name sits
              fully behind just this row, not spanning up into the
              paragraph above it, with real breathing room between the
              two text layers. */}
          <div className="relative mt-10 md:mt-14">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 right-0 z-0 hidden -translate-y-1/2 translate-x-[6%] select-none font-display text-[6vw] leading-none whitespace-nowrap text-cream/[0.035] md:block"
            >
              {product.name}
            </span>

            <dl className="relative z-10 grid grid-cols-3 gap-x-6 gap-y-4 border-t border-cream/10 pt-6">
              <div>
                <dt className="text-[11px] tracking-[0.2em] text-cream-dim/70 uppercase">
                  Light
                </dt>
                <dd className="mt-1 text-sm text-cream">{product.care.light}</dd>
              </div>
              <div>
                <dt className="text-[11px] tracking-[0.2em] text-cream-dim/70 uppercase">
                  Water
                </dt>
                <dd className="mt-1 text-sm text-cream">{product.care.water}</dd>
              </div>
              <div>
                <dt className="text-[11px] tracking-[0.2em] text-cream-dim/70 uppercase">
                  Humidity
                </dt>
                <dd className="mt-1 text-sm text-cream">{product.care.humidity}</dd>
              </div>
            </dl>
          </div>

          {/* Same independent-controls split as before: "Know more"
              genuinely navigates on its own, "Add to Cart" is a
              separate button — neither intercepts the other's click. */}
          <div className="mt-8 flex items-center gap-6">
            <p className="text-xl text-gold-bright">{formatPrice(product.price)}</p>
            <Link
              href={`/shop/${product.id}`}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-cream underline decoration-cream/30 underline-offset-4 transition-colors hover:text-gold-bright hover:decoration-gold-bright"
            >
              Know more <span aria-hidden="true">→</span>
            </Link>
            <button
              type="button"
              onClick={() => addItem(product.id)}
              className="text-sm font-medium text-cream underline decoration-cream/30 underline-offset-4 transition-colors hover:text-gold-bright hover:decoration-gold-bright"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductGrid() {
  const { active, clear } = useFilter();

  const visible = active ? products.filter((p) => p.categories.includes(active)) : products;
  const spotlight =
    visible.find((p) => p.id === "fiddle-leaf-fig") ?? visible[0] ?? products[0];
  const rest = visible.filter((p) => p.id !== spotlight?.id);

  return (
    <section id="shop" className="section-pad bg-bg px-6 md:px-12">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="mb-2 text-xs tracking-[0.25em] text-gold uppercase">Go green.</p>
            <h2 className="font-display text-5xl leading-[0.95] text-cream md:text-6xl">
              The World
              <br />
              of Plants
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-cream-dim md:pt-2 md:text-right">
            Discover everything you need to know about your plants — treat
            them with a little intention and they take care of the rest.
          </p>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-cream/10 pt-6">
          <p className="text-xs tracking-[0.2em] text-cream-dim/70 uppercase">
            {active ? `${active} plants` : "This week's top picks"}
          </p>
          {active && (
            <button
              type="button"
              onClick={clear}
              className="text-sm text-cream-dim underline decoration-cream/30 underline-offset-4 hover:text-cream"
            >
              Clear filter
            </button>
          )}
        </div>

        {spotlight && (
          <div className="mt-12 md:mt-16">
            <Spotlight product={spotlight} />
          </div>
        )}

        {/* Asymmetric grid — dense auto-flow lets the wide (col-span-2)
            cards pull smaller ones up to fill the gaps beside them,
            instead of every card repeating at one uniform size. Base
            grid is still 1/2/3 columns, so it still collapses exactly
            like before on tablet and mobile — the spans just add
            variety at the sizes wide enough to show it. ProductCard
            itself (hover-tilt image, scroll-triggered entrance) is
            unmodified. */}
        <div className="mt-14 grid grid-cols-1 gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-flow-dense lg:grid-cols-3 md:mt-20">
          {rest.map((product, i) => (
            <div
              key={product.id}
              className={`rounded-2xl bg-panel p-4 ${i % 3 === 0 ? "lg:col-span-2" : ""}`}
            >
              <ProductCard product={product} animated index={i} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
