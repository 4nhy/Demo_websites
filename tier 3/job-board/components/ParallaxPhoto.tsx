"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Scroll parallax on photography — DIRECTION.md's Motion spec item 5
 * ("parallax/scale-on-scroll on team/office shots in /about and job-detail
 * heroes"), first implemented here. The inner image is oversized and
 * bleeds 10% past the frame on every side so the vertical translate never
 * reveals an edge; the outer frame (`overflow-hidden`) clips it.
 */
export default function ParallaxPhoto({
  src,
  alt,
  sizes,
  className = "",
}: {
  src: string;
  alt: string;
  sizes?: string;
  className?: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced || !wrapRef.current || !innerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        innerRef.current,
        { yPercent: -7 },
        {
          yPercent: 7,
          ease: "none",
          scrollTrigger: {
            trigger: wrapRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );
    }, wrapRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={wrapRef} className={`relative overflow-hidden ${className}`}>
      <div ref={innerRef} className="absolute inset-[-10%]">
        <Image
          src={src}
          alt={alt}
          fill
          unoptimized
          sizes={sizes}
          className="photo-grade object-cover"
        />
      </div>
    </div>
  );
}
