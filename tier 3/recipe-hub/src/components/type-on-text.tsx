"use client";

import { useEffect, useRef } from "react";
import { getGsap, prefersReducedMotion } from "@/lib/gsap";

/**
 * Character-by-character "type-on" reveal for the Cook's Notes margin
 * quotes — fits their handwritten-note styling better than a rise/fade.
 * Splits into character spans (robust to wrapping, unlike the classic
 * width-reveal trick) and staggers opacity with a snappy typewriter cadence,
 * plus a caret that blinks while typing and fades once done.
 */
export default function TypeOnText({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const caretRef = useRef<HTMLSpanElement>(null);
  const chars = text.split("");

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const el = ref.current;
    if (!el) return;
    const targets = el.querySelectorAll<HTMLElement>("[data-char]");
    if (!targets.length) return;

    const { gsap, ScrollTrigger } = getGsap();
    const ctx = gsap.context(() => {
      gsap.set(targets, { opacity: 0 });
      ScrollTrigger.create({
        trigger: el,
        start: "top 90%",
        once: true,
        onEnter: () => {
          const tl = gsap.timeline();
          tl.to(targets, {
            opacity: 1,
            duration: 0.02,
            ease: "none",
            stagger: 0.022,
          });
          if (caretRef.current) {
            tl.to(caretRef.current, { opacity: 0, duration: 0.3 }, "+=0.2");
          }
        },
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <p ref={ref} className={className}>
      {chars.map((ch, i) => (
        <span key={i} data-char className="type-on-char">
          {ch}
        </span>
      ))}
      <span ref={caretRef} className="type-on-caret" aria-hidden>
        |
      </span>
    </p>
  );
}
