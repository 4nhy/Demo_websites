"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "@/lib/gsap";

export default function Hero() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const wordmarkRef = useRef<HTMLHeadingElement>(null);
  const productRef = useRef<HTMLDivElement>(null);
  const cloudBackRef = useRef<HTMLDivElement>(null);
  const cloudFrontRef = useRef<HTMLDivElement>(null);
  const cloudMistRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add(
      { reduced: "(prefers-reduced-motion: reduce)", full: "(prefers-reduced-motion: no-preference)" },
      (context) => {
        const { reduced } = context.conditions as { reduced: boolean };

        if (reduced) {
          gsap.set(cloudBackRef.current, { opacity: 0.15, y: -30 });
          gsap.set(cloudFrontRef.current, { opacity: 0, y: -60 });
          gsap.set(cloudMistRef.current, { opacity: 0.1 });
          gsap.set(wordmarkRef.current, { opacity: 0.25, filter: "blur(2px)" });
          gsap.set(productRef.current, { opacity: 1, scale: 1, y: 0 });
          gsap.set(taglineRef.current, { opacity: 1, y: 0 });
          return;
        }

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: wrapRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.6,
          },
        });

        tl.fromTo(
          cloudFrontRef.current,
          { opacity: 1, y: 0, scale: 1 },
          { opacity: 0, y: -140, scale: 1.2, ease: "none" },
          0
        )
          .fromTo(
            cloudBackRef.current,
            { opacity: 1, y: 0, scale: 1 },
            { opacity: 0.05, y: -70, scale: 1.1, ease: "none" },
            0
          )
          .fromTo(
            cloudMistRef.current,
            { opacity: 0.9 },
            { opacity: 0, ease: "none" },
            0.15
          )
          .fromTo(
            wordmarkRef.current,
            { opacity: 0.85, filter: "blur(1px)" },
            { opacity: 0, filter: "blur(6px)", ease: "none" },
            0
          )
          .fromTo(
            productRef.current,
            { opacity: 0, y: 60, scale: 0.88 },
            { opacity: 1, y: 0, scale: 1, ease: "none" },
            0.1
          )
          .fromTo(
            taglineRef.current,
            { opacity: 0, y: 24 },
            { opacity: 1, y: 0, ease: "none" },
            0.55
          )
          .to(
            wrapRef.current,
            { "--hero-bg": "#B9C6D6", ease: "none" } as gsap.TweenVars,
            0
          );
      }
    );

    return () => mm.revert();
  }, []);

  return (
    <section
      id="top"
      ref={wrapRef}
      className="relative h-[220vh]"
      style={{ "--hero-bg": "#E8EDF2" } as React.CSSProperties}
    >
      <div
        ref={stickyRef}
        className="sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden"
        style={{ background: "var(--hero-bg)" }}
      >
        {/* atmosphere layers */}
        <div
          ref={cloudBackRef}
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(60% 45% at 50% 78%, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.55) 45%, rgba(255,255,255,0) 75%)",
          }}
        />
        <div
          ref={cloudMistRef}
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(14,27,46,0.18) 0%, rgba(14,27,46,0) 35%)",
          }}
        />

        <h1
          ref={wordmarkRef}
          className="pointer-events-none absolute select-none font-display text-[22vw] font-medium leading-none tracking-tight text-ionosphere/90 sm:text-[16vw]"
        >
          drift
        </h1>

        <div
          ref={productRef}
          className="relative z-10 w-[70vw] max-w-[560px] sm:w-[45vw]"
        >
          <Image
            src="/images/hero-product.jpg"
            alt="Drift One wireless headphones"
            width={1600}
            height={1067}
            priority
            sizes="(max-width: 640px) 70vw, 45vw"
            className="h-auto w-full rounded-[2rem] object-contain drop-shadow-[0_40px_60px_rgba(14,27,46,0.25)]"
          />
        </div>

        <div
          ref={cloudFrontRef}
          aria-hidden
          className="pointer-events-none absolute inset-0 z-20"
          style={{
            background:
              "radial-gradient(80% 50% at 50% 95%, rgba(255,255,255,1) 0%, rgba(255,255,255,0.9) 40%, rgba(255,255,255,0) 78%)",
          }}
        />

        <div
          ref={taglineRef}
          className="relative z-30 mt-10 flex flex-col items-center gap-6 px-6 text-center"
        >
          <p className="max-w-md font-body text-lg text-ionosphere/80 sm:text-xl">
            hear the altitude drop.
          </p>
          <Link
            href="/buy"
            className="rounded-full bg-ionosphere px-7 py-3 font-mono text-xs tracking-[0.14em] text-signal uppercase transition-colors hover:bg-copper focus-visible:bg-copper"
          >
            reserve yours — $329
          </Link>
        </div>

        <div
          aria-hidden
          className="absolute bottom-8 z-30 h-10 w-px animate-pulse bg-ionosphere/30"
        />
      </div>
    </section>
  );
}
