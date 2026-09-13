"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

// Evenly spaced along the vine's own length — a true per-page mapping to
// real section boundaries isn't possible here (this lives once in the
// root layout, above every route's differently-sized content), so this
// is a progress indicator in spirit: nodes fill in as growth passes
// them, roughly where a page's major beats tend to land.
const NODE_FRACTIONS = [0.08, 0.28, 0.5, 0.72, 0.92];

// One continuous vine, mounted once in the root layout — not rebuilt per
// section or per route. stroke-dashoffset is set directly from scroll
// progress (ScrollTrigger scrub: true, no numeric lag) each tick; no
// separate eased tween sits between scroll position and the drawn
// length.
export default function SignatureVine() {
  const reduced = usePrefersReducedMotion();
  const pathRef = useRef<SVGPathElement>(null);
  const nodeRefs = useRef<(SVGCircleElement | null)[]>([]);
  const pathname = usePathname();

  useEffect(() => {
    if (reduced) return;
    const path = pathRef.current;
    if (!path) return;

    const length = path.getTotalLength();
    gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
    nodeRefs.current.forEach((node) => node?.setAttribute("fill", "transparent"));

    const trigger = ScrollTrigger.create({
      start: 0,
      end: "max",
      scrub: true,
      onUpdate: (self) => {
        path.style.strokeDashoffset = String(length * (1 - self.progress));
        nodeRefs.current.forEach((node, i) => {
          if (!node) return;
          node.setAttribute("fill", self.progress >= NODE_FRACTIONS[i] ? "var(--gold)" : "transparent");
        });
      },
    });

    return () => trigger.kill();
    // This component lives in the root layout and never remounts on
    // client-side navigation — re-run whenever the route changes so the
    // trigger measures the new page's content height instead of the
    // first page it happened to mount on.
  }, [reduced, pathname]);

  const vinePath =
    "M20,0 C30,60 10,120 20,180 C30,240 10,300 20,360 C30,420 10,480 20,540 C30,600 10,660 20,720 C30,780 10,840 20,900 C30,950 10,980 20,1000";

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-4 z-30 hidden h-screen w-8 lg:block"
    >
      <svg viewBox="0 0 40 1000" preserveAspectRatio="none" className="h-full w-full">
        {/* Dim track — always fully visible, reads as the vine's full
            eventual length even before growth reaches it. */}
        <path d={vinePath} fill="none" stroke="var(--cream)" strokeOpacity={0.12} strokeWidth={2} />
        {/* Growth — drawn length reflects scroll progress. Fully drawn
            immediately under reduced motion (no dasharray set there). */}
        <path
          ref={pathRef}
          d={vinePath}
          fill="none"
          stroke="var(--green-light)"
          strokeWidth={2}
          strokeLinecap="round"
        />
        {NODE_FRACTIONS.map((f, i) => (
          <circle
            key={f}
            ref={(el) => {
              nodeRefs.current[i] = el;
            }}
            cx={20}
            cy={f * 1000}
            r={4}
            stroke="var(--gold)"
            strokeWidth={1.5}
            fill={reduced ? "var(--gold)" : "transparent"}
          />
        ))}
      </svg>
    </div>
  );
}
