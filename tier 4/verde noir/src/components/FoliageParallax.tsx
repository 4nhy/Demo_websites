"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/motion";
import foliageImage from "../../public/images/foliage/foliage-full.jpg";

gsap.registerPlugin(ScrollTrigger);

export default function FoliageParallax() {
  const rootRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLDivElement>(null);
  const midRef = useRef<HTMLDivElement>(null);
  const frontRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!rootRef.current || !stickyRef.current) return;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion()) {
        // Static fallback: collapse the scroll-driven 300vh runway down to
        // one viewport — layers rest at base scale, copy is simply visible.
        gsap.set(rootRef.current, { height: "100svh" });
        gsap.set([backRef.current, midRef.current, frontRef.current], {
          yPercent: 0,
        });
        gsap.set(copyRef.current, { opacity: 1, y: 0 });
        return;
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.8,
        },
      });

      // Three depth layers pushing past the camera at different rates —
      // this is the signature moment, so every layer carries its own
      // speed, scale, and focus falloff rather than a single flat scroll.
      tl.fromTo(
        backRef.current,
        { yPercent: 0, scale: 1.05 },
        { yPercent: -8, scale: 1.15, ease: "none" },
        0
      )
        .fromTo(
          midRef.current,
          { yPercent: 0, scale: 1.15 },
          { yPercent: -22, scale: 1.4, ease: "none" },
          0
        )
        .fromTo(
          frontRef.current,
          { yPercent: 0, scale: 1.3, opacity: 0.9 },
          { yPercent: -45, scale: 2.1, opacity: 0, ease: "none" },
          0
        )
        .fromTo(
          copyRef.current,
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, ease: "power3.out", duration: 0.3 },
          0.15
        )
        .to(copyRef.current, { opacity: 0, y: -24, ease: "power2.in", duration: 0.2 }, 0.6)
        .to(stickyRef.current, { scale: 1.5, ease: "expo.inOut" }, 0.55);
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="relative h-[300svh] w-full">
      <div
        ref={stickyRef}
        className="sticky top-0 h-[100svh] w-full overflow-hidden bg-bg"
        style={{ transformOrigin: "center center" }}
      >
        <div ref={backRef} className="absolute inset-0">
          <Image
            src={foliageImage}
            alt="Dense fan-palm foliage lit from behind, deep green and jungle-dark"
            fill
            sizes="100vw"
            className="object-cover"
            style={{ filter: "brightness(0.5) saturate(1) sepia(0.04) blur(1px)" }}
          />
        </div>
        <div ref={midRef} className="absolute inset-0">
          <Image
            src={foliageImage}
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
            style={{ filter: "brightness(0.62) saturate(1.12) sepia(0.08)" }}
          />
        </div>
        <div ref={frontRef} className="absolute inset-0">
          <Image
            src={foliageImage}
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
            style={{ filter: "brightness(0.75) saturate(1.2) sepia(0.1)" }}
          />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-bg/20 via-transparent to-bg" />
        <div
          ref={copyRef}
          className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0"
        >
          <p
            className="font-display max-w-lg px-6 text-center text-3xl italic text-cream md:text-5xl"
            style={{ textShadow: "0 2px 24px rgba(11,20,16,0.9), 0 1px 3px rgba(11,20,16,0.9)" }}
          >
            Grown in shade. Shipped in silence.
          </p>
        </div>
      </div>
    </div>
  );
}
