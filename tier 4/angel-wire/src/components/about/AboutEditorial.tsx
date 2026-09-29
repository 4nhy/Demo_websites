"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AssetImage from "@/components/product/AssetImage";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// House rules, not brand story — ANGEL WIRE has no founder to introduce and
// no history to romanticize (we deliberately never invented one). What it
// does have is a small, real set of operating principles, already voiced
// piecemeal elsewhere on the site (Shop's "nothing here is restocked",
// Finale's "that's the whole rack, for now") — collected and stated
// plainly here instead of dressed up as a brand narrative.
const RULES = [
  { n: "01", text: "Nothing is restocked. When a piece is gone, it's gone for good." },
  { n: "02", text: "Sold is sold — no back-order, no waitlist, no “email us.”" },
  { n: "03", text: "Wear is not a defect. The fade, the thin patch — that's the piece working." },
  { n: "04", text: "One of one means exactly that. We don't keep a second in the back." },
];

/**
 * About, rebuilt from a two-line placeholder into an actual composition —
 * an oversized headline that physically overlaps the image below it, a
 * two-column sourcing note paired with a full-bleed rack image, a dark
 * numbered "Rules" band, and a closing chrome-text line.
 *
 * Motion (revised — previously one moment, then static): the hero image's
 * scrubbed clip-path wipe is unchanged, but it's no longer the only thing
 * on the page that moves. The sourcing image gets the same wipe technique
 * (one proven pattern reused, not a new one invented); the sourcing text,
 * each Rule, and the closing line all get a real scroll-triggered
 * stagger/fade — the same power2.out entrance language Shop and Collections
 * now use, so About matches the rest of the site's interactivity standard
 * instead of sitting as the one page that goes quiet after its opening
 * beat. Reduced-motion renders every section in its final state statically,
 * consistent with how the hero wipe already degrades.
 */
export default function AboutEditorial() {
  const [cinematic, setCinematic] = useState(false);
  const heroImgRef = useRef<HTMLDivElement>(null);
  const rackImgRef = useRef<HTMLDivElement>(null);
  const sourcingTextRef = useRef<HTMLDivElement>(null);
  const rulesRef = useRef<HTMLDivElement>(null);
  const closingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    function applyPreference() {
      setCinematic(!reducedQuery.matches);
    }
    applyPreference();
    reducedQuery.addEventListener("change", applyPreference);
    return () => reducedQuery.removeEventListener("change", applyPreference);
  }, []);

  // Hero wipe — unchanged mechanism.
  useEffect(() => {
    const el = heroImgRef.current;
    if (!el) return;

    function apply(progress: number) {
      const pct = 100 - gsap.utils.clamp(0, 100, progress * 100);
      el!.style.clipPath = `inset(0 ${pct}% 0 0)`;
    }

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!cinematic || reduced) {
      apply(1);
      return;
    }

    apply(0);
    const st = ScrollTrigger.create({
      trigger: el,
      start: "top 85%",
      end: "top 35%",
      scrub: 0.4,
      onUpdate: (self) => apply(self.progress),
    });

    const refreshId = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => {
      cancelAnimationFrame(refreshId);
      st.kill();
    };
  }, [cinematic]);

  // Everything past the hero — previously static, now a real reveal pass.
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const rackImg = rackImgRef.current;
    const sourcingText = sourcingTextRef.current;
    const rules = rulesRef.current;
    const closing = closingRef.current;

    if (reduced || !cinematic) {
      if (rackImg) rackImg.style.clipPath = "inset(0 0% 0 0)";
      [sourcingText, closing].forEach((el) => {
        if (!el) return;
        el.style.opacity = "1";
        el.style.transform = "none";
      });
      if (rules) {
        Array.from(rules.children).forEach((c) => {
          (c as HTMLElement).style.opacity = "1";
          (c as HTMLElement).style.transform = "none";
        });
      }
      return;
    }

    const ctx = gsap.context(() => {
      if (rackImg) {
        gsap.fromTo(
          rackImg,
          { clipPath: "inset(0 100% 0 0)" },
          {
            clipPath: "inset(0 0% 0 0)",
            ease: "power2.inOut",
            scrollTrigger: { trigger: rackImg, start: "top 88%", end: "top 45%", scrub: 0.5 },
          }
        );
      }
      if (sourcingText) {
        gsap.from(Array.from(sourcingText.children), {
          opacity: 0,
          y: 22,
          duration: 0.7,
          ease: "power2.out",
          stagger: 0.08,
          scrollTrigger: { trigger: sourcingText, start: "top 85%" },
        });
      }
      if (rules) {
        gsap.from(Array.from(rules.children), {
          opacity: 0,
          y: 18,
          duration: 0.6,
          ease: "power2.out",
          stagger: 0.1,
          scrollTrigger: { trigger: rules, start: "top 80%" },
        });
      }
      if (closing) {
        gsap.from(closing, {
          opacity: 0,
          y: 20,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: { trigger: closing, start: "top 85%" },
        });
      }
    });

    return () => ctx.revert();
  }, [cinematic]);

  return (
    <main className="bg-chrome-white">
      <section className="relative px-6 pt-14 sm:px-10 sm:pt-20">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-bubblegum/70">
          Edt. 11 — About
        </p>
        <h1 className="relative z-10 -mb-8 mt-3 font-display text-[clamp(2.8rem,10vw,7rem)] italic leading-[0.88] text-grape-ink sm:-mb-14">
          Nothing here
          <br />
          is new.
        </h1>
      </section>

      <section className="relative mx-6 sm:mx-10">
        <div
          ref={heroImgRef}
          style={{ clipPath: "inset(0 100% 0 0)" }}
          className="relative"
        >
          <AssetImage
            image={{ id: "about-hero", alt: "A rack of one-of-one secondhand pieces", ratio: "4:5" }}
            aspectClassName="aspect-[4/3] sm:aspect-[21/9]"
            priority
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-chrome-white/80 via-chrome-white/20 to-transparent"
          />
          <p className="absolute bottom-6 right-6 max-w-xs text-right font-display text-2xl italic leading-tight text-grape-ink sm:bottom-10 sm:right-10 sm:text-4xl">
            Everything here is real.
          </p>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-10 px-6 py-16 sm:grid-cols-5 sm:gap-16 sm:px-10 sm:py-24">
        <div ref={sourcingTextRef} className="sm:col-span-2">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-bubblegum">
            The Sourcing
          </p>
          <p className="mt-4 font-display text-3xl italic leading-tight text-grape-ink sm:text-4xl">
            We don&apos;t manufacture. We recognize.
          </p>
        </div>
        <div className="sm:col-span-3">
          <p className="max-w-prose text-sm leading-relaxed text-grape-ink/80 sm:text-base">
            Every piece here was pulled, not produced — estate sales, closing racks, the back of
            somebody&apos;s closet, the last size left before a shop shuts its doors. We don&apos;t
            design a collection and print it twenty times. We find the one thing worth keeping,
            put a number on it, and let it go once.
          </p>
          <div className="mt-8" ref={rackImgRef} style={{ clipPath: "inset(0 100% 0 0)" }}>
            <AssetImage
              image={{ id: "about-rack", alt: "A rack of secondhand clothing", ratio: "4:5" }}
              aspectClassName="aspect-[16/10]"
            />
          </div>
        </div>
      </section>

      {/* Gunmetal panel, not Onyx — the rest of the page is already Onyx
          after the palette rebuild, so matching it here would make "The
          Rules" invisible as a distinct beat. Gunmetal is a genuinely
          different dark tone (still fully within the confirmed palette),
          keeping this a deliberately darker, separate band. */}
      <section className="border-t border-grape-ink/10 bg-cyber-lilac px-6 py-16 sm:px-10 sm:py-24">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-acid-lime">
          The Rules
        </p>
        <div ref={rulesRef} className="mt-8 divide-y divide-grape-ink/10">
          {RULES.map((rule) => (
            <div key={rule.n} className="flex items-start gap-6 py-6 sm:gap-10 sm:py-8">
              <span className="font-mono text-sm text-grape-ink/70 sm:text-base">{rule.n}</span>
              <p className="font-display text-xl italic leading-snug text-grape-ink sm:text-2xl">
                {rule.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section ref={closingRef} className="flex flex-col items-center gap-6 px-6 py-20 text-center sm:py-28">
        <p className="chrome-text max-w-2xl font-display text-3xl font-black italic leading-tight sm:text-5xl">
          Archive Vol. I is open. For now.
        </p>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 border border-grape-ink bg-grape-ink px-8 py-3 text-xs font-medium uppercase tracking-[0.18em] text-chrome-white transition-colors duration-200 hover:bg-grape-ink/90"
        >
          Enter the Shop
          <span aria-hidden="true">→</span>
        </Link>
      </section>
    </main>
  );
}
