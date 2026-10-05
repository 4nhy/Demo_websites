"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap, SplitText } from "@/lib/gsap";
import { MQ, fontsReady } from "@/lib/motion";

const COLUMNS = [
  {
    title: "Drift One",
    links: [
      { href: "/product", label: "Overview" },
      { href: "/sound", label: "Sound" },
      { href: "/engineering", label: "Engineering" },
      { href: "/buy", label: "Buy" },
    ],
  },
  {
    title: "Support",
    links: [
      { href: "/buy#faq", label: "FAQ" },
      { href: "/buy#box", label: "What's in the box" },
      { href: "/engineering#specs", label: "Full specifications" },
    ],
  },
];

export default function Footer() {
  const ref = useRef<HTMLElement>(null);
  const markRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    let mm: gsap.MatchMedia | null = null;
    let dead = false;
    fontsReady().then(() => {
      if (dead || !markRef.current) return;
      mm = gsap.matchMedia();
      mm.add(MQ.full, () => {
        const s = SplitText.create(markRef.current!, { type: "chars", mask: "chars" });
        gsap.from(s.chars, {
          yPercent: 100,
          ease: "power4.out",
          stagger: 0.05,
          scrollTrigger: { trigger: ref.current, start: "top 85%", end: "bottom bottom", scrub: 0.8 },
        });
      });
    });
    return () => {
      dead = true;
      mm?.revert();
    };
  }, []);

  return (
    <footer ref={ref} className="relative z-10 overflow-hidden bg-ionosphere text-signal">
      <div className="mx-auto grid max-w-[1600px] gap-14 px-4 pt-24 pb-10 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr] lg:px-10">
        <div>
          <p className="t-eyebrow text-copper-glow">Drift Audio</p>
          <p className="mt-5 max-w-sm text-lg leading-relaxed text-signal/75">
            A 40 mm driver, a 42 dB quiet and 40 hours between charges, in one 254 g frame.
          </p>
        </div>
        {COLUMNS.map((c) => (
          <div key={c.title}>
            <p className="t-eyebrow text-signal/55">{c.title}</p>
            <ul className="mt-5 flex flex-col gap-3 text-signal/80">
              {c.links.map((l) => (
                <li key={l.href + l.label}>
                  <Link href={l.href} className="transition-colors hover:text-copper-glow">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <p
        ref={markRef}
        aria-hidden
        className="pointer-events-none select-none px-2 text-center font-display text-[33vw] leading-[0.78] font-semibold tracking-[-0.06em] text-signal/[0.07]"
      >
        drift
      </p>

      <div className="relative mx-auto flex max-w-[1600px] flex-col gap-3 border-t border-signal/12 px-4 py-6 font-mono text-[11px] tracking-[0.06em] text-signal/55 sm:px-8 md:flex-row md:justify-between lg:px-10">
        <p>© 2026 Drift Audio. Fictional product, built as a design exercise.</p>
        <p>
          Studio lighting: &ldquo;Studio Small 09&rdquo; HDRI by{" "}
          <a className="underline hover:text-copper-glow" href="https://polyhaven.com/a/studio_small_09" target="_blank" rel="noopener noreferrer">
            Poly Haven
          </a>{" "}
          (CC0). 3D model built procedurally in-house.
        </p>
      </div>
    </footer>
  );
}
