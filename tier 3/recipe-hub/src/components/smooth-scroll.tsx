"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { getGsap, prefersReducedMotion } from "@/lib/gsap";

/**
 * Lenis smooth scroll wired to GSAP's ticker so ScrollTrigger stays in sync
 * (lenis.on('scroll', ScrollTrigger.update) + gsap.ticker drives lenis.raf).
 * Fully torn down — Lenis destroyed and the ticker callback removed, not
 * just class-skipped — under prefers-reduced-motion.
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return;

    const { gsap, ScrollTrigger } = getGsap();
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    function handleChange(event: MediaQueryListEvent) {
      if (event.matches) {
        gsap.ticker.remove(tick);
        lenis.destroy();
      }
    }
    media.addEventListener("change", handleChange);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      media.removeEventListener("change", handleChange);
    };
  }, []);

  return null;
}
