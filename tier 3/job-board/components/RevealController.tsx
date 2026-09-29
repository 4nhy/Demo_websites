"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Lightweight scroll-reveal for pages outside the homepage's orchestrated
 * set-piece — DIRECTION.md calls /for-employers "simpler, lighter on
 * animation," and /about and /jobs don't need their own bespoke GSAP rig.
 * Any element marked `data-reveal` anywhere in the tree gets a single
 * fade-up on scroll. Respects prefers-reduced-motion (renders instantly,
 * no ScrollTrigger created at all).
 */
export default function RevealController() {
  const pathname = usePathname();

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ctx = gsap.context(() => {
      const els = gsap.utils.toArray<HTMLElement>("[data-reveal]");
      if (prefersReduced) {
        gsap.set(els, { opacity: 1, y: 0 });
        return;
      }
      els.forEach((el, i) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power3.out",
            delay: (i % 4) * 0.06,
            scrollTrigger: {
              trigger: el,
              start: "top 90%",
              toggleActions: "play none none none",
            },
          }
        );
      });
    });

    return () => ctx.revert();
  }, [pathname]);

  return null;
}
