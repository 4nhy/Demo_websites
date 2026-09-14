"use client";

import { useEffect, useRef } from "react";
import { getGsap, prefersReducedMotion } from "@/lib/gsap";
import TravelingCard from "./traveling-card";
import DeckleEdge from "./deckle-edge";

interface Stat {
  value: number;
  suffix?: string;
  label: string;
}

interface HeroSectionProps {
  stats: Stat[];
}

export default function HeroSection({ stats }: HeroSectionProps) {
  const statRef = useRef<HTMLDivElement>(null);
  const numberRefs = useRef<(HTMLParagraphElement | null)[]>([]);

  useEffect(() => {
    const reduced = prefersReducedMotion();

    // Count-up always runs (instant-set under reduced motion) so the final
    // numbers are correct either way.
    numberRefs.current.forEach((el, i) => {
      if (!el) return;
      const stat = stats[i];
      if (reduced) {
        el.textContent = `${stat.value}${stat.suffix ?? ""}`;
      }
    });

    if (reduced) return;

    const { gsap, ScrollTrigger } = getGsap();
    const ctx = gsap.context(() => {
      if (!statRef.current) return;
      ScrollTrigger.create({
        trigger: statRef.current,
        start: "top 85%",
        once: true,
        onEnter: () => {
          numberRefs.current.forEach((el, i) => {
            if (!el) return;
            const stat = stats[i];
            const counter = { n: 0 };
            gsap.to(counter, {
              n: stat.value,
              duration: 1.2,
              ease: "power1.out",
              onUpdate: () => {
                el.textContent = `${Math.round(counter.n)}${stat.suffix ?? ""}`;
              },
              onComplete: () => {
                // Subtle scale-punch once the count-up lands.
                gsap.fromTo(
                  el,
                  { scale: 1 },
                  { scale: 1.18, duration: 0.14, ease: "power1.out", yoyo: true, repeat: 1 }
                );
              },
            });
          });
        },
      });
    });

    return () => ctx.revert();
  }, [stats]);

  return (
    <>
      <div className="flex min-h-[85vh] items-center justify-center bg-charcoal px-5 py-20 md:px-8">
        <TravelingCard />
      </div>

      <div
        ref={statRef}
        className="relative grid grid-cols-2 gap-6 border-y border-line bg-bone px-5 py-8 sm:grid-cols-4 md:px-8"
      >
        <DeckleEdge className="bg-bone" />
        {stats.map((stat, i) => (
          <div key={stat.label}>
            <p
              ref={(el) => {
                numberRefs.current[i] = el;
              }}
              className="inline-block font-display text-2xl font-semibold text-ink"
            >
              0{stat.suffix ?? ""}
            </p>
            <p className="text-xs text-muted">{stat.label}</p>
          </div>
        ))}
      </div>
    </>
  );
}
