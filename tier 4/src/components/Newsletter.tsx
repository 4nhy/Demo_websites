"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

// Same visual language as the care section's collage — thin gradient
// vine stems with real photo-crop leaf tiles climbing off them — but a
// lighter, one-shot reveal rather than a pinned scroll-scrub, since this
// is a much shorter section. Different photo crops than care notes so
// it doesn't feel like a repeated asset.
const leafTiles = [
  {
    src: "/images/products/marble-queen-pothos-2.jpg",
    className: "bottom-[6%] left-[6%] z-20 w-[52%] -rotate-[10deg]",
    objectPosition: "45% 35%",
  },
  {
    src: "/images/products/peperomia-hope-2.jpg",
    className: "bottom-[34%] right-[4%] z-10 w-[40%] rotate-[8deg]",
    objectPosition: "50% 30%",
  },
  {
    src: "/images/products/snake-plant-2.jpg",
    className: "top-[4%] left-[18%] z-30 w-[34%] -rotate-[6deg]",
    objectPosition: "18% 32%",
  },
];

const stemLines = [
  "left-[30%] bottom-[4%] h-[70%] -rotate-[10deg]",
  "left-[45%] bottom-[4%] h-[92%] rotate-[3deg]",
  "left-[58%] bottom-[4%] h-[55%] rotate-[16deg]",
];

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const reduced = usePrefersReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const vineRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduced) return;
    const section = sectionRef.current;
    const vine = vineRef.current;
    const content = contentRef.current;
    if (!section || !vine || !content) return;

    const stems = vine.querySelectorAll<HTMLElement>("[data-stem]");
    const leaves = vine.querySelectorAll<HTMLElement>("[data-leaf]");

    const ctx = gsap.context(() => {
      gsap.set(stems, { scaleY: 0, opacity: 0 });
      gsap.set(leaves, { opacity: 0, scale: 0.7, y: 24 });
      gsap.set(content, { opacity: 0, y: 24 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
      });

      tl.to(stems, { scaleY: 1, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power2.out" })
        .to(
          leaves,
          { opacity: 1, scale: 1, y: 0, duration: 0.7, stagger: 0.12, ease: "power3.out" },
          0.2
        )
        .to(content, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }, 0.25);
    }, section);

    return () => ctx.revert();
  }, [reduced]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;
    setSubmitted(true);
  };

  return (
    <section
      id="newsletter"
      ref={sectionRef}
      className="section-pad relative overflow-hidden bg-bg px-6 md:px-12"
    >
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-14 md:grid-cols-[0.85fr_1.15fr] md:gap-20">
        {/* Decorative vine — no card, no background shape, just the
            stems and leaf crops breathing directly against the page. */}
        <div
          ref={vineRef}
          className="relative mx-auto h-[34vh] w-full max-w-xs sm:h-[40vh] md:mx-0 md:h-[46vh] md:max-w-none"
        >
          {stemLines.map((cls, i) => (
            <span
              key={i}
              data-stem
              aria-hidden="true"
              className={`absolute z-[5] w-[3px] origin-bottom rounded-full ${cls}`}
              style={{
                background:
                  "linear-gradient(to top, var(--green) 0%, color-mix(in srgb, var(--green) 40%, transparent) 100%)",
              }}
            />
          ))}

          {leafTiles.map((tile) => (
            <div
              key={tile.src}
              data-leaf
              className={`absolute aspect-[3/4] overflow-hidden rounded-[1.5rem] shadow-lg shadow-black/30 ${tile.className}`}
              style={reduced ? undefined : { opacity: 0 }}
            >
              <Image
                src={tile.src}
                alt=""
                aria-hidden="true"
                fill
                sizes="280px"
                className="object-cover"
                style={{
                  objectPosition: tile.objectPosition,
                  filter: "brightness(0.72) saturate(1.1) sepia(0.04)",
                }}
              />
            </div>
          ))}
        </div>

        {/* Content — left-aligned, not centered; sits asymmetrically
            against the vine rather than stacked in a shared card. */}
        <div ref={contentRef} style={reduced ? undefined : { opacity: 0 }}>
          <p className="mb-2 text-xs tracking-[0.25em] text-gold uppercase">Rare drops</p>
          <h2 className="font-display mb-4 max-w-md text-3xl text-cream md:text-4xl">
            Get first pick before a rare plant hits the grid.
          </h2>
          <p className="mb-8 max-w-md text-sm leading-relaxed text-cream-dim">
            We restock unpredictably — variegated cuttings, mature specimens,
            and anything we only get one or two of a season. Subscribers get
            a 24-hour head start.
          </p>

          {submitted ? (
            <p className="text-gold-bright">You&apos;re on the list. Watch your inbox.</p>
          ) : (
            <form onSubmit={handleSubmit} className="flex max-w-sm flex-col gap-3 sm:flex-row">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                aria-label="Email address"
                className="w-full rounded-full border border-cream/15 bg-panel px-5 py-3 text-sm text-cream placeholder:text-cream-dim/60 focus:border-gold focus:outline-none"
              />
              <button
                type="submit"
                className="whitespace-nowrap rounded-full bg-gold px-6 py-3 text-sm font-medium text-bg transition-colors hover:bg-gold-bright"
              >
                Notify Me
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
