"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (prefersReducedMotion()) {
      // Native scroll only — ScrollTrigger still needs to exist for components
      // that read scroll progress, but Lenis smoothing is skipped entirely.
      ScrollTrigger.refresh();
      return;
    }

    // Retuned for a tighter, less floaty feel: shorter duration settles
    // faster once input stops, expo.out gives the motion an immediate
    // snap at the start instead of easing in gradually (a soft cubic
    // reads as laggy right when you touch the wheel), and a slightly
    // raised wheelMultiplier maps each tick to more real distance so
    // input feels closer to 1:1 rather than heavily dampened.
    const lenis = new Lenis({
      duration: 0.9,
      easing: (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
      wheelMultiplier: 1.15,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const update = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(update);
    };
  }, []);

  return <>{children}</>;
}
