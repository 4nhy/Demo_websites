"use client";

import { useEffect, useRef, type ElementType } from "react";
import { getGsap, prefersReducedMotion } from "@/lib/gsap";

type StaggerFrom = "start" | "center" | "end" | "edges";

interface KineticHeadlineProps {
  text: string;
  as?: ElementType;
  className?: string;
  from?: StaggerFrom;
}

/**
 * Section headline: split into words, each masked in an overflow-hidden
 * span. On first scroll-into-view, staggers a rise+fade from the CSS-hidden
 * default state (see .kinetic-word in globals.css). Stagger origin varies
 * per call site so sections don't all animate identically.
 */
export function KineticHeadline({
  text,
  as: Tag = "h2",
  className,
  from = "start",
}: KineticHeadlineProps) {
  const ref = useRef<HTMLElement>(null);
  const words = text.split(" ");

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const el = ref.current;
    if (!el) return;
    const targets = el.querySelectorAll<HTMLElement>("[data-word]");
    if (!targets.length) return;

    const { gsap, ScrollTrigger } = getGsap();
    const ctx = gsap.context(() => {
      // Explicitly hand GSAP the starting transform rather than trusting it
      // to parse the CSS class's percentage translateY — letting GSAP infer
      // yPercent from an externally-set transform left it stuck near the
      // start value (opacity reached 1, position never did).
      gsap.set(targets, { y: 28, opacity: 0 });
      ScrollTrigger.create({
        trigger: el,
        start: "top 88%",
        once: true,
        onEnter: () => {
          gsap.to(targets, {
            y: 0,
            opacity: 1,
            duration: 0.7,
            ease: "power3.out",
            stagger: { each: 0.045, from },
          });
        },
      });
    });
    return () => ctx.revert();
  }, [from]);

  return (
    <Tag ref={ref} className={className}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.1em] align-bottom">
          <span data-word className="kinetic-word inline-block">
            {word}
            {i < words.length - 1 ? " " : ""}
          </span>
        </span>
      ))}
    </Tag>
  );
}

interface KineticBodyProps {
  children: string;
  as?: ElementType;
  className?: string;
}

/** Body copy: a single clip-path wipe reveal — lighter than the headline treatment. */
export function KineticBody({ children, as: Tag = "p", className }: KineticBodyProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const el = ref.current;
    if (!el) return;

    const { gsap, ScrollTrigger } = getGsap();
    const ctx = gsap.context(() => {
      gsap.set(el, { clipPath: "inset(0% 100% 0% 0%)" });
      ScrollTrigger.create({
        trigger: el,
        start: "top 90%",
        once: true,
        onEnter: () => {
          gsap.to(el, {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 0.9,
            ease: "power2.out",
          });
        },
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <Tag ref={ref} className={`kinetic-body ${className ?? ""}`}>
      {children}
    </Tag>
  );
}
