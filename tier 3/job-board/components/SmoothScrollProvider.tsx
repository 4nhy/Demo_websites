"use client";

import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Motion infrastructure only — DIRECTION.md raised the motion ambition to
 * Tier 4, reaching toward Tier 5-adjacent depth (GSAP + ScrollTrigger +
 * Lenis, scroll-scrubbed timelines). The detailed choreography spec is
 * still pending from the user; this wires the plumbing so it can be added
 * later without touching section markup.
 *
 * Lenis and ScrollTrigger are synced (tiers.md: they fight and everything
 * judders otherwise). Under prefers-reduced-motion the Lenis instance is
 * destroyed outright — not class-skipped — so native scroll takes over and
 * no ScrollTrigger-driven transform ever fires.
 */
export default function SmoothScrollProvider({
  children,
}: {
  children: ReactNode;
}) {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      return;
    }

    const lenis = new Lenis({
      autoRaf: false,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const onTick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(onTick);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
