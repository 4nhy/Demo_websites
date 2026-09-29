"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const ease = gsap.parseEase("power2.inOut");
const slam = gsap.parseEase("back.out(1.6)");
function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}
function windowT(progress: number, start: number, end: number) {
  return ease(Math.min(1, Math.max(0, (progress - start) / (end - start))));
}

type From = "left" | "right" | "top";

type Line = {
  text: string;
  from: From;
  /** rest position, percent of stage box */
  top: string;
  left: string;
  restRotate: number;
  size: string;
  weight: "normal" | "black";
  italic?: boolean;
  tone: "chrome" | "bubblegum" | "lime";
  /** [start, end] of this line's own entrance window within overall progress */
  window: [number, number];
};

// Six lines, mixed lengths and voices on purpose — a collage of found
// headlines, not one clean sentence. The last one restates the wordmark
// itself, echoing rewear-thrift's inverted-footer wordmark-restatement.
const LINES: Line[] = [
  {
    text: "WE DO NOT SELL NEW.",
    from: "left",
    top: "8%",
    left: "4%",
    restRotate: -4,
    size: "text-[clamp(1.8rem,6vw,3.4rem)]",
    weight: "black",
    tone: "chrome",
    window: [0, 0.32],
  },
  {
    text: "we sell what survived.",
    from: "right",
    top: "19%",
    left: "30%",
    restRotate: 3,
    size: "text-[clamp(1.4rem,4.4vw,2.4rem)]",
    weight: "normal",
    italic: true,
    tone: "chrome",
    window: [0.1, 0.4],
  },
  {
    text: "EVERY STAIN HAS A STORY WE WON'T TELL YOU.",
    from: "top",
    top: "33%",
    left: "6%",
    restRotate: -2,
    size: "text-[clamp(1.1rem,3.2vw,1.9rem)]",
    weight: "black",
    tone: "bubblegum",
    window: [0.22, 0.5],
  },
  {
    text: "if it fits everyone, it fits no one.",
    from: "left",
    top: "47%",
    left: "18%",
    restRotate: 5,
    size: "text-[clamp(1.3rem,4vw,2.2rem)]",
    weight: "normal",
    italic: true,
    tone: "chrome",
    window: [0.36, 0.64],
  },
  {
    text: "BUY IT BEFORE SOMEONE REGRETS SELLING IT.",
    from: "right",
    top: "59%",
    left: "8%",
    restRotate: -3,
    size: "text-[clamp(1.1rem,3vw,1.7rem)]",
    weight: "black",
    tone: "lime",
    window: [0.5, 0.78],
  },
  {
    text: "ANGEL WIRE",
    from: "top",
    top: "71%",
    left: "8%",
    restRotate: 0,
    size: "text-[clamp(2.6rem,8vw,5rem)]",
    weight: "black",
    tone: "chrome",
    window: [0.7, 1],
  },
];

const OFFSTAGE = { left: -140, right: 140, top: -120 } as const;
const START_ROTATE = { left: -22, right: 24, top: 10 } as const;

/**
 * Section 7 — Manifesto. "Type Collision": six statement lines fly in from
 * alternating edges and slam to a stop at scattered, overlapping rotations —
 * headlines cut from different magazines, thrown onto a table, not one
 * centered quote. Lines accumulate; nothing exits. The device is new for
 * this page — every earlier scroll-driven section moves images through
 * space (scatter, curtain, pan, rack-focus); this one moves type, flat, no
 * depth, collage logic instead of camera logic.
 *
 * No product imagery anywhere in this section, deliberately — this is the
 * one place on the page where attitude and typography carry the whole
 * thing. The closing line restates the wordmark in a chrome/gold text-fill,
 * the same gesture as rewear-thrift's inverted-footer wordmark restatement,
 * translated into ANGEL WIRE's own metallic register instead of borrowing
 * theirs.
 *
 * Reduced motion freezes at progress=1 — valid here (unlike Collections
 * Line/Lookbook) because every line belongs to the SAME final reading; there
 * is no content that only exists mid-scroll.
 */
export default function ManifestoCollage() {
  const [cinematic, setCinematic] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const lineRefs = useRef<Array<HTMLDivElement | null>>([]);
  const glitchRef = useRef<HTMLSpanElement>(null);

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
    if (!track) return;

    function apply(progress: number) {
      LINES.forEach((line, i) => {
        const el = lineRefs.current[i];
        if (!el) return;
        const [start, end] = line.window;
        const p = windowT(progress, start, end);
        const slammed = slam(p);
        const offsetStart = OFFSTAGE[line.from];
        const rotateStart = START_ROTATE[line.from];

        const tx = line.from === "top" ? 0 : lerp(offsetStart, 0, slammed);
        const ty = line.from === "top" ? lerp(offsetStart, 0, slammed) : 0;
        const rotate = lerp(rotateStart, line.restRotate, slammed);
        const opacity = windowT(progress, start, start + (end - start) * 0.4);

        el.style.transform = `translate(${tx}px, ${ty}px) rotate(${rotate}deg)`;
        el.style.opacity = String(opacity);
      });

      if (glitchRef.current) {
        const glitchP = windowT(progress, 0.94, 1);
        glitchRef.current.style.opacity = String(glitchP);
      }
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
    // bg-chrome-white (Onyx dark, post-rebuild) not bg-grape-ink — see
    // CurrentDropScene's equivalent comment.
    <section className="relative bg-chrome-white">
      <div ref={trackRef} className={cinematic ? "relative h-[320vh] sm:h-[360vh]" : "relative"}>
        <div
          className={
            cinematic
              ? "sticky top-0 h-[100svh] overflow-hidden px-5 py-16 sm:px-10"
              : "relative min-h-[110vh] overflow-hidden px-5 py-24 sm:px-10"
          }
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-bubblegum/70">
            Edt. 07 — Manifesto
            <span data-wire-anchor="manifesto-start" className="wire-anchor -left-2 top-0" />
          </p>

          {/* stable, untransformed anchor points — the lines fly past them,
              same stable-anchor / dramatic-content split as every prior
              section. Positioned near where the chrome lines rest, so the
              wire genuinely dips behind and re-emerges in front of type. */}
          <span
            data-wire-anchor="manifesto-behind"
            className="wire-anchor left-[20%] top-[45%]"
          />
          <span
            data-wire-anchor="manifesto-front"
            className="wire-anchor left-[70%] top-[75%]"
          />

          {/* explicit height, not h-full — the non-cinematic wrapper only
              sets min-height, which is an indefinite containing block for a
              percentage height (it would collapse to auto/near-zero and
              pile every line's top:% on top of one another). */}
          <div className="relative mx-auto h-[100svh] max-w-5xl">
            {LINES.map((line, i) => (
              <div
                key={line.text}
                ref={(el) => {
                  lineRefs.current[i] = el;
                }}
                className="absolute max-w-[92vw] whitespace-normal leading-[0.95] sm:max-w-[70%]"
                style={{ top: line.top, left: line.left }}
              >
                <span
                  className={`${line.size} ${line.weight === "black" ? "font-display font-black" : "font-display"} ${
                    line.italic ? "italic" : ""
                  } ${
                    line.tone === "bubblegum"
                      ? "text-bubblegum"
                      : line.tone === "lime"
                        ? "text-acid-lime"
                        : "chrome-text"
                  }`}
                >
                  {line.text}
                </span>
                {line.text === "ANGEL WIRE" && (
                  <span
                    ref={glitchRef}
                    aria-hidden="true"
                    className={`pointer-events-none absolute inset-0 select-none text-bubblegum opacity-0 ${line.size} font-display font-black`}
                    style={{ transform: "translate(2px,-1px)", mixBlendMode: "screen" }}
                  >
                    ANGEL WIRE
                  </span>
                )}
              </div>
            ))}
          </div>

          <span data-wire-anchor="manifesto-end" className="wire-anchor bottom-4 right-[15%]" />
        </div>
      </div>
    </section>
  );
}
