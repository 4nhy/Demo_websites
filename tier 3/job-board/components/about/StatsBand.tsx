"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface Stat {
  value: number;
  label: string;
  suffix?: string;
}

/**
 * Count-up stat band — reuses the homepage StatStrip's pattern (mono
 * tabular digits, count from 0 on scroll-in) as a standalone effect since
 * this page has no HomeView-style orchestrator of its own.
 */
export default function StatsBand({ stats }: { stats: Stat[] }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const els = ref.current.querySelectorAll<HTMLElement>(
      "[data-about-stat]"
    );

    if (prefersReduced) {
      els.forEach((el) => {
        el.textContent = el.dataset.aboutStat ?? "0";
      });
      return;
    }

    const ctx = gsap.context(() => {
      els.forEach((el) => {
        const target = Number(el.dataset.aboutStat ?? "0");
        const counter = { val: 0 };
        gsap.to(counter, {
          val: target,
          duration: 1.4,
          ease: "power2.out",
          onUpdate: () => {
            el.textContent = String(Math.round(counter.val));
          },
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        });
      });
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={ref}
      className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4"
    >
      {stats.map((stat) => (
        <div key={stat.label}>
          <p className="font-mono text-5xl font-medium tabular-nums text-ink md:text-6xl">
            <span data-about-stat={stat.value}>0</span>
            {stat.suffix}
          </p>
          <p className="mt-2 font-mono text-xs font-medium uppercase tracking-[0.08em] text-ink/60">
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  );
}
