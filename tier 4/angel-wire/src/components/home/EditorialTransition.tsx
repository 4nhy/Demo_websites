"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AssetImage from "@/components/product/AssetImage";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const ease = gsap.parseEase("power2.inOut");
function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}
function windowT(progress: number, start: number, end: number) {
  return ease(Math.min(1, Math.max(0, (progress - start) / (end - start))));
}

/**
 * Section 3 — Editorial Transition. Built from two specific devices found
 * by re-inspecting the references, not invented:
 *
 *  - velvet-archive's hero: a heart cut into velvet drapery, parting to
 *    reveal a model behind it. Executed here as an oxblood curtain (gold
 *    seam where the panels meet — the one gloss/metal moment) that
 *    scroll-scrubs open across the campaign image, rather than a plain fade.
 *  - rewear-thrift's "Every thrifted piece carries a story": a large candid
 *    photo paired with a smaller, differently-cropped one, beside a short
 *    editorial line. Reused as the E1/E2 pairing from ASSETS.md, with E2
 *    entering tilted, "clipped" onto the frame, after the curtain parts.
 *
 * Same pin+scrub pattern as Hero/Current Drop (one continuous scroll
 * language, not a plain section boundary), same "stable outer box" wire
 * convention — the curtain panels are children of the anchor-bearing box,
 * not a separate transformed ancestor, so there's no stacking-context risk
 * to solve here at all.
 */
export default function EditorialTransition() {
  const [cinematic, setCinematic] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const curtainLeftRef = useRef<HTMLDivElement>(null);
  const curtainRightRef = useRef<HTMLDivElement>(null);
  const secondaryRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLParagraphElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    function applyPreference() {
      setCinematic(!reducedQuery.matches);
    }
    applyPreference();
    reducedQuery.addEventListener("change", applyPreference);
    return () => reducedQuery.removeEventListener("change", applyPreference);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    const curtainL = curtainLeftRef.current;
    const curtainR = curtainRightRef.current;
    const secondary = secondaryRef.current;
    const label = labelRef.current;
    const copy = copyRef.current;
    if (!track || !curtainL || !curtainR || !secondary || !label || !copy) return;

    function apply(progress: number) {
      const curtainP = windowT(progress, 0, 0.4);
      curtainL!.style.transform = `translateX(${lerp(0, -100, curtainP)}%)`;
      curtainR!.style.transform = `translateX(${lerp(0, 100, curtainP)}%)`;

      const secP = windowT(progress, 0.38, 0.62);
      secondary!.style.opacity = String(secP);
      secondary!.style.transform = `translateY(${lerp(36, 0, secP)}px) rotate(${lerp(16, -6, secP)}deg)`;

      const labelP = windowT(progress, 0, 0.18);
      label!.style.opacity = String(labelP);

      const copyP = windowT(progress, 0.32, 0.58);
      copy!.style.opacity = String(copyP);
      copy!.style.transform = `translateY(${lerp(22, 0, copyP)}px)`;
    }

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!cinematic || reduced) {
      apply(1);
      return;
    }

    apply(0);
    const st = ScrollTrigger.create({
      trigger: track,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.5,
      onUpdate: (self) => apply(self.progress),
    });

    const refreshId = requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      cancelAnimationFrame(refreshId);
      st.kill();
    };
  }, [cinematic]);

  return (
    <section className="relative bg-chrome-white">
      <div ref={trackRef} className={cinematic ? "relative h-[150vh] sm:h-[170vh]" : "relative"}>
        <div
          className={
            cinematic
              ? "sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden px-6 py-16 sm:px-10"
              : "relative flex min-h-[80vh] flex-col justify-center px-6 py-20 sm:px-10"
          }
        >
          <p
            ref={labelRef}
            className="absolute left-6 top-8 font-mono text-[10px] uppercase tracking-[0.18em] text-grape-ink/50 sm:left-10 sm:top-10"
          >
            Edt. 03 — Campaign
          </p>

          <div className="relative mx-auto grid w-full max-w-5xl grid-cols-1 items-center gap-14 sm:grid-cols-12 sm:gap-8">
            {/* E1, behind the curtain — the wire's stable anchor box */}
            <div className="relative sm:col-span-7">
              <div
                className="relative z-[2] aspect-[4/5] overflow-hidden"
                data-wire-parallax="0.12"
              >
                <span data-wire-anchor="edt-start" className="wire-anchor left-0 top-0" />
                <span data-wire-anchor="edt-image-enter" className="wire-anchor left-0 top-1/3" />

                <AssetImage
                  image={{ id: "E1", alt: "Campaign — styled on-body, frame 1", ratio: "4:5" }}
                />

                {/* curtain — gold seam where the panels meet, the one
                    gloss/metal moment in this section */}
                <div
                  ref={curtainLeftRef}
                  className="absolute inset-y-0 left-0 w-1/2 border-r-2 border-acid-lime bg-chrome-white"
                />
                <div
                  ref={curtainRightRef}
                  className="absolute inset-y-0 right-0 w-1/2 border-l-2 border-acid-lime bg-chrome-white"
                />

                <span data-wire-anchor="edt-image-exit" className="wire-anchor right-0 bottom-1/3" />
              </div>

              {/* E2 — smaller, tilted, "clipped" onto the frame after the
                  curtain parts (rewear-thrift's second, differently-cropped
                  candid shot) */}
              <div
                ref={secondaryRef}
                className="absolute -bottom-8 right-0 z-[2] w-[42%] max-w-[220px] shadow-[0_18px_40px_-16px_rgba(28,10,13,0.45)] sm:-right-10 sm:w-[36%]"
                data-wire-parallax="0.08"
              >
                <AssetImage
                  image={{ id: "E2", alt: "Campaign — candid detail, frame 2", ratio: "4:5" }}
                />
              </div>
            </div>

            {/* editorial copy */}
            <div ref={copyRef} className="relative z-[4] sm:col-span-5">
              <p className="font-display text-[clamp(1.9rem,4.2vw,2.75rem)] italic leading-[1.08] text-grape-ink">
                Found in a bin marked &ldquo;irregular.&rdquo; It wasn&apos;t. It was just early.
              </p>
              <div className="mt-6 h-px w-16 bg-acid-lime" />
              <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.16em] text-grape-ink/50">
                No retouching. No restock. No apologies.
              </p>
              <Link
                href="/shop"
                className="group mt-8 inline-flex w-fit items-center gap-2 border-b border-grape-ink pb-1 text-xs font-medium uppercase tracking-[0.18em] text-grape-ink"
              >
                Shop the Look
                <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </div>
          </div>

          <span data-wire-anchor="edt-end" className="wire-anchor bottom-0 right-1/4" />
        </div>
      </div>
    </section>
  );
}
