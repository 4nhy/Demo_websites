"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ProductCard from "./ProductCard";
import { products } from "@/lib/products";
import { usePrefersReducedMotion } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

// Homepage preview — reverted to the larger CSS 3D hover-tilt card style
// (ProductCard, unmodified, at full width across the section rather than
// squeezed into a narrow column beside a featured plant), dark bg to
// match the rest of the site, and only a curated 4-5 rather than the
// full catalogue — that lives on /shop, linked below.
const CURATED_IDS = [
  "monstera-deliciosa",
  "fiddle-leaf-fig",
  "calathea-orbifolia",
  "string-of-pearls",
  "snake-plant",
];

const curated = CURATED_IDS.map((id) => products.find((p) => p.id === id)).filter(
  (p): p is NonNullable<typeof p> => Boolean(p)
);

export default function ProductPreview() {
  const reduced = usePrefersReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduced) return;
    const section = sectionRef.current;
    const heading = headingRef.current;
    const grid = gridRef.current;
    if (!section || !heading || !grid) return;

    const ctx = gsap.context(() => {
      // Heading drifts slower than the grid as the section scrolls
      // through — background/foreground depth on an otherwise static
      // grid layout, not just a uniform slide-up.
      gsap.fromTo(
        heading,
        { y: 40 },
        {
          y: -20,
          ease: "none",
          scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: 0.4 },
        }
      );

      const cards = grid.querySelectorAll<HTMLElement>(":scope > *");
      gsap.fromTo(
        cards,
        { opacity: 0, y: 48 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.08,
          scrollTrigger: { trigger: grid, start: "top 85%" },
        }
      );
    }, section);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section ref={sectionRef} className="section-pad overflow-hidden bg-bg px-6 md:px-12">
      <div className="mx-auto max-w-6xl">
        <div ref={headingRef} className="mb-12 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-xs tracking-[0.25em] text-gold uppercase">The collection</p>
            <h2 className="font-display text-3xl text-cream md:text-4xl">
              A few worth starting with.
            </h2>
          </div>
          <Link
            href="/shop"
            className="text-sm font-medium text-cream underline decoration-cream/30 underline-offset-4 transition-colors hover:text-gold-bright hover:decoration-gold-bright"
          >
            View All Plants →
          </Link>
        </div>

        <div ref={gridRef} className="grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {curated.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
