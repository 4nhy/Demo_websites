"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

const notes = [
  {
    title: "Root-Bound Isn't a Failure",
    body: "Roots circling the drainage hole, or water running straight through without slowing down, mean it's time to size up — not a sign you've done something wrong. Most plants want a new pot every 12–18 months.",
  },
  {
    title: "Humidity Is Not Optional",
    body: "Crisping leaf edges on a calathea or fern almost always mean dry air, not underwatering. A pebble tray, a grouped cluster of pots, or a small humidifier will do more than another watering.",
  },
  {
    title: "Read the Leaf Before the Calendar",
    body: "Don't water on a fixed schedule. Yellowing, soft leaves usually mean overwatering; crisping, curling ones mean underwatering or low humidity; pale, leggy growth means the plant is stretching for light it isn't getting.",
  },
];

// The collage: a dark pot at the base with a spray of leaves branching
// up from it, arranged from real photo crops (not a single illustration
// asset) — mirrors plant-shop-scroll.png's composition.
const leafTiles = [
  {
    src: "/images/products/monstera-deliciosa-2.jpg",
    className: "bottom-[20%] left-1/2 z-10 w-[68%] -translate-x-[56%] -rotate-6",
    objectPosition: "40% 60%",
  },
  {
    src: "/images/products/zz-plant-1.jpg",
    className: "bottom-[28%] left-[4%] z-20 w-[40%] -rotate-[14deg]",
    objectPosition: "30% 40%",
  },
  {
    src: "/images/products/fiddle-leaf-fig-1.jpg",
    className: "right-[2%] bottom-[46%] z-20 w-[38%] rotate-[9deg]",
    objectPosition: "50% 30%",
  },
  {
    src: "/images/products/calathea-orbifolia-1.jpg",
    className: "bottom-[66%] left-[28%] z-30 w-[26%] rotate-[7deg]",
    objectPosition: "50% 40%",
  },
];

const stemLines = [
  "left-[49%] bottom-[15%] h-[16%] -rotate-[4deg]",
  "left-[45%] bottom-[14%] h-[30%] -rotate-[22deg]",
  "left-[54%] bottom-[14%] h-[34%] rotate-[19deg]",
  "left-[50%] bottom-[14%] h-[50%] rotate-[1deg]",
];

export default function CareNotes() {
  const reduced = usePrefersReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const collageRef = useRef<HTMLDivElement>(null);
  const tipsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduced) return;
    const wrap = wrapRef.current;
    const collage = collageRef.current;
    const tips = tipsRef.current;
    if (!wrap || !collage || !tips) return;

    const stems = collage.querySelectorAll<HTMLElement>("[data-stem]");
    const pot = collage.querySelector<HTMLElement>("[data-pot]");
    const leaves = collage.querySelectorAll<HTMLElement>("[data-leaf]");

    const ctx = gsap.context(() => {
      gsap.set([stems, pot, leaves], { opacity: 0 });
      gsap.set(stems, { scaleY: 0 });
      gsap.set([pot, leaves], { scale: 0.55, y: 30 });
      gsap.set(tips, { opacity: 0, y: 20 });

      // One timeline, scrubbed to scroll progress through the whole
      // section — not a one-shot trigger, so it reverses cleanly on
      // scroll-up. Tips only reveal in the final stretch, after growth
      // completes.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrap,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.4,
        },
      });

      tl.to(stems, { opacity: 1, scaleY: 1, duration: 0.4, stagger: 0.06, ease: "none" }, 0)
        .to(pot, { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: "none" }, 0)
        .to(leaves, { opacity: 1, scale: 1, y: 0, duration: 0.5, stagger: 0.12, ease: "none" }, 0.15)
        .to(tips, { opacity: 1, y: 0, duration: 0.25, ease: "none" }, 0.78);
    }, wrap);

    return () => ctx.revert();
  }, [reduced]);

  const collage = (
    <div
      ref={collageRef}
      className="relative h-[46vh] w-full sm:h-[52vh] md:h-full md:min-h-[560px]"
    >
      {stemLines.map((cls, i) => (
        <span
          key={i}
          data-stem
          aria-hidden="true"
          className={`absolute z-[5] w-[3px] origin-bottom rounded-full ${cls}`}
          style={{
            background:
              "linear-gradient(to top, var(--green) 0%, color-mix(in srgb, var(--green) 40%, transparent) 100%)",
          }}
        />
      ))}

      <div
        data-pot
        className="absolute bottom-0 left-1/2 z-40 aspect-[4/3] w-[42%] -translate-x-1/2 overflow-hidden rounded-3xl shadow-xl shadow-black/40"
      >
        <Image
          src="/images/products/string-of-pearls-1.jpg"
          alt=""
          aria-hidden="true"
          fill
          sizes="240px"
          className="object-cover"
          style={{
            objectPosition: "36% 38%",
            transform: "scale(1.6)",
            transformOrigin: "36% 38%",
            filter: "brightness(0.5) saturate(1.05)",
          }}
        />
      </div>

      {leafTiles.map((tile) => (
        <div
          key={tile.src}
          data-leaf
          className={`absolute aspect-[3/4] overflow-hidden rounded-[1.75rem] shadow-lg shadow-black/30 ${tile.className}`}
        >
          <Image
            src={tile.src}
            alt=""
            aria-hidden="true"
            fill
            sizes="320px"
            className="object-cover"
            style={{ objectPosition: tile.objectPosition, filter: "brightness(0.72) saturate(1.1) sepia(0.04)" }}
          />
        </div>
      ))}
    </div>
  );

  const tips = (
    <div ref={tipsRef}>
      <p className="mb-2 text-xs tracking-[0.25em] text-gold uppercase">Care notes</p>
      <h2 className="font-display mb-10 max-w-xl text-3xl text-cream md:text-4xl">
        A little vocabulary goes further than another app reminder.
      </h2>

      <div className="flex flex-col divide-y divide-cream/10">
        {notes.map((note) => (
          <div key={note.title} className="py-5 first:pt-0">
            <h3 className="font-display mb-2 text-lg text-cream md:text-xl">{note.title}</h3>
            <p className="text-sm leading-relaxed text-cream-dim">{note.body}</p>
          </div>
        ))}
      </div>
    </div>
  );

  // Same three nested elements in both states — only the pin-specific
  // styling (height/sticky/overflow) toggles on `reduced`. See the
  // identical fix and its explanation in ShopShowcase.tsx: branching to
  // two entirely different top-level structures here used to mean the
  // reduced->non-reduced hydration correction replaced one subtree with
  // another, which measurably shifted everything below it.
  return (
    <section id="care" className="relative bg-panel">
      <div ref={wrapRef} className="relative" style={reduced ? undefined : { height: "220svh" }}>
        <div
          className={
            reduced
              ? "section-pad flex w-full items-center px-6 md:px-12"
              : "section-pad sticky top-0 flex h-[100svh] w-full items-center overflow-hidden px-6 md:px-12"
          }
        >
          <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 md:grid-cols-[1fr_1.1fr] md:gap-16">
            {collage}
            {tips}
          </div>
        </div>
      </div>
    </section>
  );
}
