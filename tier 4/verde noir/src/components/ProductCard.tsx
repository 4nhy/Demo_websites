"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Product } from "@/lib/products";
import { formatPrice } from "@/lib/products";
import { useCart } from "@/lib/cart-context";
import { usePrefersReducedMotion } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

// Splits a string into per-character spans so GSAP can stagger their
// opacity for a typewriter reveal. Real text stays in a visually-hidden
// sr-only node for screen readers — the character spans are aria-hidden
// so nothing gets read out letter by letter.
function TypewriterText({
  text,
  hidden,
  charRef,
  className,
}: {
  text: string;
  hidden: boolean;
  charRef: React.RefObject<HTMLSpanElement | null>;
  className?: string;
}) {
  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      <span ref={charRef} aria-hidden="true">
        {text.split("").map((char, i) => (
          <span key={i} data-char style={hidden ? { opacity: 0 } : undefined}>
            {char}
          </span>
        ))}
      </span>
    </span>
  );
}

export default function ProductCard({
  product,
  animated = false,
  index = 0,
}: {
  product: Product;
  // Opt-in: the shop grid turns this on for its scroll-driven woosh +
  // typewriter + parallax. Left off (default) preserves the exact
  // existing behavior for the homepage preview grid, which already
  // handles its own fade-in at the parent level.
  animated?: boolean;
  index?: number;
}) {
  const reduced = usePrefersReducedMotion();
  const showFx = animated && !reduced;

  const parallaxRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const imgWrapRef = useRef<HTMLDivElement>(null);
  const secondImgRef = useRef<HTMLDivElement>(null);
  const nameCharsRef = useRef<HTMLSpanElement>(null);
  const priceCharsRef = useRef<HTMLSpanElement>(null);
  const { addItem } = useCart();

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduced || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    gsap.to(imgWrapRef.current, {
      rotateY: px * 14,
      rotateX: -py * 14,
      duration: 0.5,
      ease: "power3.out",
      transformPerspective: 800,
    });
  };

  const handleLeave = () => {
    gsap.to(imgWrapRef.current, {
      rotateY: 0,
      rotateX: 0,
      duration: 0.6,
      ease: "back.out(1.7)",
    });
    if (secondImgRef.current) {
      gsap.to(secondImgRef.current, { opacity: 0, duration: 0.4, ease: "power2.in" });
    }
  };

  const handleEnter = () => {
    if (secondImgRef.current && !reduced) {
      gsap.to(secondImgRef.current, { opacity: 1, duration: 0.5, ease: "power3.out" });
    }
  };

  // Entrance woosh + typewriter reveal — a fast, hard-decelerating tween
  // (power4.out, not linear) staggered per card via `index`, followed by
  // the name/price characters typing in.
  useEffect(() => {
    if (!showFx) return;
    const card = cardRef.current;
    if (!card) return;
    const nameChars = nameCharsRef.current?.querySelectorAll("[data-char]");
    const priceChars = priceCharsRef.current?.querySelectorAll("[data-char]");

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: card, start: "top 88%" },
        delay: (index % 3) * 0.08,
      });

      tl.fromTo(
        card,
        { opacity: 0, y: 56, scale: 0.94 },
        { opacity: 1, y: 0, scale: 1, duration: 0.85, ease: "power4.out" }
      );

      if (nameChars?.length) {
        tl.to(
          nameChars,
          { opacity: 1, duration: 0.01, stagger: 0.026, ease: "none" },
          "-=0.35"
        );
      }
      if (priceChars?.length) {
        tl.to(
          priceChars,
          { opacity: 1, duration: 0.01, stagger: 0.02, ease: "none" },
          "<+0.08"
        );
      }
    }, card);

    return () => ctx.revert();
  }, [showFx, index]);

  // Continuous scroll-tied depth — a separate outer layer so it never
  // fights the entrance tween above (which owns the card's own
  // opacity/y/scale) or the cursor hover-tilt (which owns imgWrapRef).
  // Per-column variance via `index` so the grid reads as having real
  // depth rather than every card moving in lockstep.
  useEffect(() => {
    if (!showFx) return;
    const parallaxEl = parallaxRef.current;
    if (!parallaxEl) return;

    const col = index % 3;
    const yRange = [28, -34, 20][col];
    const rotRange = [2.4, -3, 1.6][col];

    const trigger = ScrollTrigger.create({
      trigger: parallaxEl,
      start: "top bottom",
      end: "bottom top",
      scrub: 0.6,
      onUpdate: (self) => {
        const p = self.progress - 0.5; // -0.5 -> 0.5 across the scroll range
        gsap.set(parallaxEl, {
          y: p * yRange,
          rotateX: p * -rotRange,
          transformPerspective: 1000,
        });
      },
    });

    return () => trigger.kill();
  }, [showFx, index]);

  const card = (
    <div
      ref={cardRef}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      onMouseEnter={handleEnter}
      className="group flex flex-col"
      style={{
        perspective: "800px",
        ...(showFx ? { opacity: 0, transform: "translateY(56px) scale(0.94)" } : {}),
      }}
    >
      <div
        ref={imgWrapRef}
        className="relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-panel"
        style={{ transformStyle: "preserve-3d" }}
      >
        <Image
          src={product.image}
          alt={product.imageAlt}
          fill
          sizes="(min-width: 768px) 25vw, 50vw"
          loading="lazy"
          className="object-cover"
          style={{ filter: "brightness(0.78) saturate(1.08) sepia(0.05)" }}
        />
        {product.image2 && (
          <div ref={secondImgRef} className="absolute inset-0 opacity-0">
            <Image
              src={product.image2}
              alt=""
              fill
              sizes="(min-width: 768px) 25vw, 50vw"
              loading="lazy"
              className="object-cover"
              style={{ filter: "brightness(0.78) saturate(1.08) sepia(0.05)" }}
            />
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg/50 via-transparent to-transparent" />
      </div>

      <div className="mt-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-lg text-cream">
            <TypewriterText
              text={product.name}
              hidden={showFx}
              charRef={nameCharsRef}
            />
          </h3>
          <p className="text-xs italic text-cream-dim">{product.latin}</p>
        </div>
        <p className="whitespace-nowrap text-sm text-gold-bright">
          <TypewriterText
            text={formatPrice(product.price)}
            hidden={showFx}
            charRef={priceCharsRef}
          />
        </p>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-cream-dim">{product.blurb}</p>

      <dl className="mt-3 grid grid-cols-3 gap-2 text-[11px] text-cream-dim">
        <div>
          <dt className="text-cream-dim/70">Light</dt>
          <dd className="text-cream">{product.care.light}</dd>
        </div>
        <div>
          <dt className="text-cream-dim/70">Water</dt>
          <dd className="text-cream">{product.care.water}</dd>
        </div>
        <div>
          <dt className="text-cream-dim/70">Humidity</dt>
          <dd className="text-cream">{product.care.humidity}</dd>
        </div>
      </dl>

      <button
        type="button"
        onClick={() => addItem(product.id)}
        className="mt-4 w-full rounded-full border border-cream/15 py-2.5 text-sm text-cream transition-colors hover:border-gold hover:text-gold-bright"
      >
        Add to Cart
      </button>
    </div>
  );

  if (!animated) return card;

  return (
    <div ref={parallaxRef} style={showFx ? { opacity: 1 } : undefined}>
      {card}
    </div>
  );
}
