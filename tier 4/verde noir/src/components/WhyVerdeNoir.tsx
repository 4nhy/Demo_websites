"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { usePrefersReducedMotion } from "@/lib/motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

type Slide =
  | {
      type: "statement";
      numeral: string;
      sentence: string;
      photo: string;
      photoAlt: string;
      photoSide: "left" | "right";
    }
  | { type: "quote"; text: string };

// Scrapped the bento grid entirely for an editorial magazine-spread:
// full-width statements stepping through on scroll (pinned), a huge
// serif numeral paired with one editorial sentence, a real photo
// alternating sides, and one pull-quote breaking the rhythm between
// statements 2 and 3. No cards, no grid, no gradients.
const slides: Slide[] = [
  {
    type: "statement",
    numeral: "01",
    sentence: "Nothing ships until we've turned it out of its pot and checked the roots ourselves.",
    photo: "/images/products/monstera-deliciosa-1.jpg",
    photoAlt: "Monstera deliciosa in a white pot, held up by two hands",
    photoSide: "left",
  },
  {
    type: "statement",
    numeral: "02",
    sentence: "Small growers, not container farms — batches too small for anyone to hide a bad one in.",
    photo: "/images/products/fiddle-leaf-fig-1.jpg",
    photoAlt: "Fiddle leaf fig with large glossy violin-shaped leaves",
    photoSide: "right",
  },
  { type: "quote", text: "A houseplant is not decor. It's a small, living argument that your room can change." },
  {
    type: "statement",
    numeral: "03",
    sentence: "Two days, greenhouse to your door — long enough to arrive settled, short enough to arrive alive.",
    photo: "/images/products/calathea-medallion-1.jpg",
    photoAlt: "Calathea Medallion with round patterned leaves",
    photoSide: "left",
  },
  {
    type: "statement",
    numeral: "04",
    sentence: "Thirty days, one photo, a real replacement. No forms. No runaround.",
    photo: "/images/products/marble-queen-pothos-1.jpg",
    photoAlt: "Marble Queen pothos with heavily variegated leaves",
    photoSide: "right",
  },
];

function Photo({ slide }: { slide: Extract<Slide, { type: "statement" }> }) {
  return (
    <div data-parallax-photo className="relative h-[32vh] w-full scale-110 md:h-full">
      <Image
        src={slide.photo}
        alt={slide.photoAlt}
        fill
        sizes="(min-width: 768px) 50vw, 100vw"
        className="object-cover"
        style={{ filter: "brightness(0.75) saturate(1.08) sepia(0.05)" }}
      />
    </div>
  );
}

// Each line types in — chars within a line reveal fast and in
// sequence, then the next line starts — rather than the whole sentence
// appearing character-by-character across every wrapped line at once,
// or the block just fading in as a unit. Fires when the sentence mounts,
// which (given the parent is remounted via `key={active}` whenever the
// slide changes) is exactly when that slide's scroll-pin segment
// begins, not on page load. Reduced motion skips the split entirely —
// the sentence just renders as plain, fully-visible text.
function AnimatedSentence({ text, reduced }: { text: string; reduced: boolean }) {
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;

    // aria: "none" — SplitText's default ("auto") stamps an aria-label
    // onto the split element itself, which axe flags as invalid on a
    // role-less <p> (aria-prohibited-attr). The real text instead lives
    // in an untouched sr-only sibling below, and this element is marked
    // aria-hidden, so screen readers get the sentence once, cleanly,
    // never the per-character span soup.
    const split = SplitText.create(el, {
      type: "lines,chars",
      charsClass: "char",
      autoSplit: true,
      aria: "none",
      onSplit: (self) => {
        const tl = gsap.timeline();
        self.lines.forEach((line) => {
          const chars = line.querySelectorAll<HTMLElement>(".char");
          tl.fromTo(chars, { opacity: 0 }, { opacity: 1, duration: 0.01, stagger: 0.018, ease: "none" });
        });
        return tl;
      },
    });

    return () => split.revert();
  }, [reduced]);

  return (
    <>
      <span className="sr-only">{text}</span>
      <p
        ref={ref}
        aria-hidden="true"
        className="font-display mt-4 max-w-xl text-2xl leading-[1.15] text-cream md:text-4xl"
      >
        {text}
      </p>
    </>
  );
}

function StatementSlide({
  slide,
  reduced,
}: {
  slide: Extract<Slide, { type: "statement" }>;
  reduced: boolean;
}) {
  const text = (
    <div
      data-parallax-text
      className="flex flex-1 flex-col justify-center px-6 py-10 md:px-16"
    >
      <span aria-hidden="true" className="font-display text-[22vw] leading-none text-cream/15 md:text-[9vw]">
        {slide.numeral}
      </span>
      <AnimatedSentence text={slide.sentence} reduced={reduced} />
    </div>
  );
  const photo = (
    <div className="flex-1 overflow-hidden">
      <Photo slide={slide} />
    </div>
  );

  return (
    <div className="flex h-full w-full flex-col md:flex-row md:items-stretch">
      {slide.photoSide === "left" ? (
        <>
          {photo}
          {text}
        </>
      ) : (
        <>
          {text}
          {photo}
        </>
      )}
    </div>
  );
}

function QuoteSlide({ slide }: { slide: Extract<Slide, { type: "quote" }> }) {
  return (
    <div className="flex h-full w-full items-center justify-center px-6 md:px-16">
      <p className="font-display max-w-5xl text-center text-3xl leading-[1.2] text-cream italic md:text-6xl">
        {slide.text}
      </p>
    </div>
  );
}

export default function WhyVerdeNoir() {
  const reduced = usePrefersReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (reduced) return;
    const wrap = wrapRef.current;
    if (!wrap) return;

    const trigger = ScrollTrigger.create({
      trigger: wrap,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        const idx = Math.min(slides.length - 1, Math.floor(self.progress * slides.length));
        setActive(idx);

        // Two depth layers within the held frame: the photo drifts more
        // than the text as you scroll through each step's own range, so
        // even a "static" slide reads as depth, not a flat swap.
        const sub = (self.progress * slides.length) % 1;
        const photoEl = document.querySelector<HTMLElement>("[data-parallax-photo]");
        const textEl = document.querySelector<HTMLElement>("[data-parallax-text]");
        if (photoEl) gsap.set(photoEl, { y: (sub - 0.5) * -48 });
        if (textEl) gsap.set(textEl, { y: (sub - 0.5) * -16 });
      },
    });

    return () => trigger.kill();
  }, [reduced]);

  const slide = slides[active];

  // Same outer two elements in both states — only content and
  // pin-specific styling toggle on `reduced`. Branching to two entirely
  // different top-level structures here used to mean the reduced->
  // non-reduced hydration correction replaced one subtree with another,
  // which measurably shifted everything below it (see the identical fix
  // and its explanation in ShopShowcase.tsx).
  return (
    <section className="relative bg-bg">
      <div
        ref={wrapRef}
        className="relative"
        style={reduced ? undefined : { height: `${slides.length * 100}svh` }}
      >
        <div
          className={reduced ? "section-pad" : "sticky top-0 h-[100svh] w-full overflow-hidden"}
        >
          {reduced ? (
            <>
              <p className="mx-auto mb-2 max-w-6xl px-6 text-xs tracking-[0.25em] text-gold uppercase md:px-12">
                Why Verde Noir
              </p>
              <div className="flex flex-col">
                {slides.map((s, i) =>
                  s.type === "quote" ? (
                    <QuoteSlide key={i} slide={s} />
                  ) : (
                    <div key={i} className="min-h-[70vh]">
                      <StatementSlide slide={s} reduced={reduced} />
                    </div>
                  )
                )}
              </div>
            </>
          ) : slide.type === "quote" ? (
            <QuoteSlide key={active} slide={slide} />
          ) : (
            <StatementSlide key={active} slide={slide} reduced={reduced} />
          )}
        </div>
      </div>
    </section>
  );
}
