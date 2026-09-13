"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { products, formatPrice } from "@/lib/products";
import { useCart } from "@/lib/cart-context";
import { usePrefersReducedMotion } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

const CUTOUTS = [
  { id: "monstera-deliciosa", src: "/images/cutouts/monstera-deliciosa.png" },
  { id: "marble-queen-pothos", src: "/images/cutouts/marble-queen-pothos.png" },
  { id: "peperomia-hope", src: "/images/cutouts/peperomia-hope.png" },
  { id: "calathea-medallion", src: "/images/cutouts/calathea-medallion.png" },
];

const featured = CUTOUTS.map((c) => ({
  ...c,
  product: products.find((p) => p.id === c.id),
})).filter((c): c is typeof c & { product: NonNullable<(typeof c)["product"]> } =>
  Boolean(c.product)
);

// Mirrors plant-shop-light.png's actual composition, no boxes: a large
// transparent-PNG cutout on the left, its info at the top, a plain row
// of small cutout thumbnails for the rest. Scrolling steps the enlarged
// plant through the sequence.
export default function ShopShowcase({ priority = false }: { priority?: boolean } = {}) {
  const reduced = usePrefersReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const imageWrapRef = useRef<HTMLDivElement>(null);
  const thumbRowRef = useRef<HTMLDivElement>(null);
  const descRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const { addItem } = useCart();

  // Description + stats fade/slide in step with the active plant —
  // fires on every `active` change regardless of source (scroll-driven
  // or a direct thumbnail click), same energy as the image swap rather
  // than text that just updates instantly.
  useEffect(() => {
    if (reduced) return;
    const el = descRef.current;
    if (!el) return;
    gsap.fromTo(el, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.55, ease: "power3.out" });
  }, [active, reduced]);

  useEffect(() => {
    if (reduced) return;
    const wrap = wrapRef.current;
    if (!wrap) return;

    const trigger = ScrollTrigger.create({
      trigger: wrap,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        const idx = Math.min(featured.length - 1, Math.floor(self.progress * featured.length));
        setActive(idx);
        // Two depth layers moving at different rates — the main plant
        // drifts more than the thumbnail row as you scroll the pinned
        // range, real parallax rather than a flat swap.
        if (imageWrapRef.current) gsap.set(imageWrapRef.current, { y: self.progress * -36 });
        if (thumbRowRef.current) gsap.set(thumbRowRef.current, { y: self.progress * -10 });
      },
    });

    return () => trigger.kill();
  }, [reduced]);

  const current = featured[active];

  const body = (
    <div className="mx-auto w-full max-w-6xl px-6 md:px-12">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-x-8 gap-y-4 md:mb-12">
        <div>
          <p className="mb-2 text-xs tracking-[0.25em] text-gold uppercase">Shop the sequence</p>
          <h2 className="font-display text-3xl text-cream md:text-5xl">{current.product.name}</h2>
          <p className="mt-1 text-sm italic text-cream-dim">{current.product.latin}</p>
        </div>
        <div className="flex items-center gap-5">
          <p className="text-xl text-gold-bright">{formatPrice(current.product.price)}</p>
          <button
            type="button"
            onClick={() => addItem(current.product.id)}
            className="text-sm font-medium text-cream underline decoration-cream/30 underline-offset-4 transition-colors hover:text-gold-bright hover:decoration-gold-bright"
          >
            Add to Cart
          </button>
        </div>
      </div>

      <div className="md:grid md:grid-cols-[1.15fr_1fr] md:items-center md:gap-12 lg:gap-16">
        <div>
          <div ref={imageWrapRef} className="relative h-[42vh] w-full max-w-xl sm:h-[50vh] md:h-[58vh]">
            <Image
              key={current.id}
              src={current.src}
              alt={current.product.imageAlt}
              fill
              sizes="(min-width: 768px) 44vw, 85vw"
              className="object-contain object-left"
              fetchPriority={priority ? "high" : undefined}
              loading={priority ? "eager" : undefined}
            />
          </div>

          <div ref={thumbRowRef} className="mt-5 flex items-center gap-6 md:mt-10">
            {featured.map((item, i) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Show ${item.product.name}`}
                aria-current={i === active}
                className="relative h-14 w-14 shrink-0 transition-opacity md:h-16 md:w-16"
                style={{ opacity: i === active ? 1 : 0.35 }}
              >
                <Image src={item.src} alt="" fill sizes="64px" className="object-contain" />
              </button>
            ))}
          </div>
        </div>

        {/* Right side — previously dead black space. A low-opacity
            oversized name sits behind (same ghost-text technique as the
            "Why Verde Noir" numerals), with the description + a minimal
            care list in front, vertically centered against the image. */}
        <div className="relative mt-8 md:mt-0">
          <div
            ref={descRef}
            className="relative z-10 max-w-[46ch]"
            style={reduced ? undefined : { opacity: 0 }}
          >
            <p className="line-clamp-3 text-sm leading-normal text-cream-dim md:line-clamp-none md:text-lg">
              {current.product.blurb}
            </p>

            {/* Stats get their own relative wrapper so the ghost name
                below sits fully behind just this row — not spanning up
                into the paragraph above it — with real breathing room
                between the two text layers. */}
            <div className="relative mt-6 md:mt-14">
              {/* Ghost name is a desktop flourish only — at mobile widths
                  a full product name at this scale would overflow the
                  frame rather than read as atmosphere. */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 right-0 z-0 hidden -translate-y-1/2 translate-x-[6%] select-none font-display text-[6vw] leading-none whitespace-nowrap text-cream/[0.035] md:block"
              >
                {current.product.name}
              </span>

              <dl className="relative z-10 grid grid-cols-3 gap-x-4 gap-y-4 border-t border-cream/10 pt-5 md:gap-x-10 md:pt-6">
                <div>
                  <dt className="text-[11px] tracking-[0.2em] text-cream-dim/70 uppercase">
                    Light
                  </dt>
                  <dd className="mt-1 text-sm text-cream">{current.product.care.light}</dd>
                </div>
                <div>
                  <dt className="text-[11px] tracking-[0.2em] text-cream-dim/70 uppercase">
                    Water
                  </dt>
                  <dd className="mt-1 text-sm text-cream">{current.product.care.water}</dd>
                </div>
                <div>
                  <dt className="text-[11px] tracking-[0.2em] text-cream-dim/70 uppercase">
                    Humidity
                  </dt>
                  <dd className="mt-1 text-sm text-cream">{current.product.care.humidity}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Same three nested elements in both states — only the pin-specific
  // styling (height/sticky/overflow) toggles on `reduced`. Branching to
  // two entirely different top-level structures here (as this used to)
  // means the reduced->non-reduced hydration correction replaces one
  // subtree with another, which measurably shifts everything below it
  // (confirmed via a real CLS regression: the outer wrapper's own top
  // position jumped by exactly the reduced branch's section-pad value).
  // Keeping one structure throughout means that correction only ever
  // changes classes/styles on already-positioned elements.
  return (
    <section className="relative bg-bg">
      <div
        ref={wrapRef}
        className="relative"
        style={reduced ? undefined : { height: `${featured.length * 100}svh` }}
      >
        <div
          className={
            reduced
              ? "section-pad flex w-full items-center"
              : "section-pad sticky top-0 flex h-[100svh] w-full items-start overflow-hidden md:items-center"
          }
        >
          {body}
        </div>
      </div>
    </section>
  );
}
