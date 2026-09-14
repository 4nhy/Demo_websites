"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  /** Stagger delay in ms, applied via inline style. */
  delay?: number;
  className?: string;
  as?: "div" | "li";
}

/**
 * Scroll-reveal wrapper: fade + 12px rise, staggered, single reusable
 * trigger type per the Tier 2 motion budget. `prefers-reduced-motion` is
 * handled entirely in CSS (globals.css neutralizes [data-reveal] under the
 * media query), so this component never needs to branch on it itself.
 */
export default function Reveal({
  children,
  delay = 0,
  className,
  as = "div",
}: RevealProps) {
  const ref = useRef<HTMLDivElement | HTMLLIElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const Tag = as;

  return (
    <Tag
      ref={ref as never}
      className={className}
      data-reveal=""
      data-revealed={revealed}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}
