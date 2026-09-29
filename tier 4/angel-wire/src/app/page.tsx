"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AngelWire from "@/components/AngelWire";
import AssetImage from "@/components/product/AssetImage";
import CurrentDropScene from "@/components/home/CurrentDropScene";
import EditorialTransition from "@/components/home/EditorialTransition";
import CollectionsLine from "@/components/home/CollectionsLine";
import LookbookSequence from "@/components/home/LookbookSequence";
import NewArrivalsFilmstrip from "@/components/home/NewArrivalsFilmstrip";
import ManifestoCollage from "@/components/home/ManifestoCollage";
import FinaleTag from "@/components/home/FinaleTag";

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
 * Stage 4 — homepage, sections 1–2 of 9 (Hero, Current Drop).
 *
 * Hero: structure is approved and unchanged (metadata bar, ANGEL/WIRE
 * wordmark interlocking with the hero object, catalogue tag, statement+CTA)
 * — what changed is the journey to reach it. It's now a ~210vh pinned,
 * scroll-scrubbed opening sequence: the object starts huge/rotated in 3D,
 * the wordmark starts split apart off-screen, a holographic band crosses
 * the object, a sticker badge pops in, and everything settles into the
 * exact approved resting composition by the end of the scrub.
 *
 * The wire-critical image wrapper uses the same "stable outer box, dramatic
 * inner wrapper" split that solved Current Drop's wire-tracking problem:
 * AngelWire measures anchor position once, so the box the anchors live on
 * must not itself travel — the object INSIDE it can do whatever it wants.
 */
export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroTrackRef = useRef<HTMLDivElement>(null);
  const objectInnerRef = useRef<HTMLDivElement>(null);
  const sweepBarRef = useRef<HTMLDivElement>(null);
  const angelRef = useRef<HTMLSpanElement>(null);
  const wireRef = useRef<HTMLSpanElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);
  const tagRef = useRef<HTMLSpanElement>(null);
  const stickerRef = useRef<HTMLSpanElement>(null);
  const ctaRowRef = useRef<HTMLDivElement>(null);

  const [cinematicHero, setCinematicHero] = useState(false);

  useEffect(() => {
    const reducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    function applyPreference() {
      setCinematicHero(!reducedQuery.matches);
    }
    applyPreference();
    reducedQuery.addEventListener("change", applyPreference);
    return () => reducedQuery.removeEventListener("change", applyPreference);
  }, []);

  useEffect(() => {
    const track = heroTrackRef.current;
    const objectInner = objectInnerRef.current;
    const sweepBar = sweepBarRef.current;
    const angel = angelRef.current;
    const wire = wireRef.current;
    const meta = metaRef.current;
    const tag = tagRef.current;
    const sticker = stickerRef.current;
    const ctaRow = ctaRowRef.current;
    if (!track || !objectInner || !angel || !wire || !meta || !tag || !sticker || !ctaRow || !sweepBar) {
      return;
    }

    function apply(progress: number) {
      const narrow = window.innerWidth < 640;
      const xScale = narrow ? 0.55 : 1;

      // object: opens huge, rotated in 3D, "in your face" — settles to rest
      const objP = windowT(progress, 0, 0.7);
      const scale = lerp(narrow ? 1.7 : 2.3, 1, objP);
      const rotY = lerp(narrow ? 22 : 34, 0, objP);
      const rotX = lerp(narrow ? -10 : -16, 0, objP);
      const z = lerp(narrow ? 120 : 240, 0, objP);
      objectInner!.style.transform = `translateZ(${z}px) rotateY(${rotY}deg) rotateX(${rotX}deg) scale(${scale})`;

      // holographic band — computed independently each frame from progress
      // AND the object's current rotY (above), never baked into the
      // pendant image. This is the actual fix for the old "flat sticker
      // tumbling" problem: a real chrome/holographic reflection slides
      // across a surface as it turns because it's answering to a light
      // source that isn't rotating with the object — so this band's screen
      // position is its own function of the same inputs driving the tumble,
      // not a transform inherited from the object's own rotation. rotDrift
      // ties it to the object's current tilt on top of the progress sweep,
      // so it visibly responds to how "turned" the pendant currently is.
      // Traced to 3dbento-agency's astronaut hero (.refs/3dbento-agency) —
      // that reference is true pointer-reactive WebGL dispersion; this is
      // the SVG/CSS version of the same principle (independently computed,
      // not baked), not a shader. The real WebGL pass waits for Tier 5 on
      // Shop/Collections/About so the hero can reuse that infrastructure
      // instead of duplicating it.
      const sweepP = windowT(progress, 0.22, 0.64);
      const rotDrift = (rotY / (narrow ? 22 : 34)) * 16;
      sweepBar!.style.opacity = progress > 0.18 && progress < 0.68 ? "1" : "0";
      sweepBar!.style.transform = `translateX(${lerp(-160, 240, sweepP) + rotDrift}%) skewX(-18deg)`;

      // wordmark — splits apart at rest, converges as the sequence resolves
      const angelP = windowT(progress, 0, 0.45);
      angel!.style.transform = `translateX(${lerp(-42 * xScale, 0, angelP)}vw) rotate(${lerp(-13, 0, angelP)}deg)`;
      angel!.style.opacity = String(Math.min(1, windowT(progress, 0, 0.3)));

      const wireP = windowT(progress, 0.08, 0.5);
      wire!.style.transform = `translateX(${lerp(42 * xScale, 0, wireP)}vw) rotate(${lerp(11, 0, wireP)}deg)`;
      wire!.style.opacity = String(Math.min(1, windowT(progress, 0.08, 0.38)));

      // metadata bar
      const metaP = windowT(progress, 0.45, 0.65);
      meta!.style.opacity = String(metaP);
      meta!.style.transform = `translateY(${lerp(-16, 0, metaP)}px)`;

      // catalogue tag — small pop
      const tagP = windowT(progress, 0.55, 0.72);
      tag!.style.opacity = String(tagP);
      tag!.style.transform = `scale(${lerp(0.4, 1, tagP)}) rotate(8deg)`;

      // sticker badge — spins in with a little overshoot, the one Y2K
      // graphic-sticker moment (traced to pink-y2k-shoe's butterfly clips)
      const stickerRaw = Math.min(1, Math.max(0, (progress - 0.6) / 0.18));
      const stickerP = gsap.parseEase("back.out(2.4)")(stickerRaw);
      sticker!.style.opacity = stickerRaw > 0 ? "1" : "0";
      sticker!.style.transform = `scale(${lerp(0.3, 1, stickerP)}) rotate(${lerp(-40, -8, stickerP)}deg)`;

      // statement + CTA
      const ctaP = windowT(progress, 0.68, 0.9);
      ctaRow!.style.opacity = String(ctaP);
      ctaRow!.style.transform = `translateY(${lerp(20, 0, ctaP)}px)`;
    }

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!cinematicHero || reduced) {
      apply(1); // resting composition — exactly the approved layout, statically
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
  }, [cinematicHero]);

  return (
    <main ref={containerRef} className="relative bg-chrome-white">
      <AngelWire containerRef={containerRef} />

      <section className="relative bg-chrome-white">
        <div
          ref={heroTrackRef}
          className={cinematicHero ? "relative h-[190vh] sm:h-[220vh]" : "relative"}
        >
          <div
            className={
              cinematicHero
                ? "sticky top-0 flex h-[100svh] flex-col justify-between overflow-hidden px-6 pb-14 pt-8 sm:px-10 sm:pt-10"
                : "relative flex min-h-[100svh] flex-col justify-between px-6 pb-14 pt-8 sm:px-10 sm:pt-10"
            }
          >
            {/* catalogue metadata */}
            <div
              ref={metaRef}
              className="relative flex flex-col gap-1 border-b border-grape-ink/15 pb-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-0"
            >
              <span data-wire-anchor="hero-start" className="wire-anchor left-0 top-0" />
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-grape-ink/55 sm:text-[11px]">
                Archive Vol. I — Nos. 001–020
              </p>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-grape-ink/55 sm:text-[11px]">
                One-of-one, always
              </p>
            </div>

            {/* wordmark + hero object */}
            <div className="relative flex-1 mt-8 sm:mt-16">
              <h1 className="font-wonk relative z-[4] font-display font-black leading-[0.85] text-grape-ink">
                <span ref={angelRef} className="block text-[clamp(3.4rem,16vw,9.5rem)]">
                  ANGEL
                </span>
                <span
                  ref={wireRef}
                  className="mt-3 block text-right text-[clamp(3.4rem,16vw,9.5rem)] sm:mt-[-1.25rem] sm:pl-[42%] sm:text-left"
                >
                  WIRE
                </span>
              </h1>

              <div className="relative mt-6 flex justify-end sm:absolute sm:inset-x-0 sm:top-[36%] sm:mt-0 sm:justify-center sm:pointer-events-none">
                <div className="relative w-[62%] max-w-[240px] sm:w-[30%] sm:max-w-xs sm:pointer-events-auto">
                  {/* stable outer box — this is what the wire measures; the
                      dramatic object transform lives entirely INSIDE it */}
                  <div className="relative z-[2] [perspective:1200px]" data-wire-parallax="0.2">
                    <span
                      data-wire-anchor="hero-pre-image"
                      className="wire-anchor left-1/2 -top-10 hidden sm:block"
                    />
                    <span data-wire-anchor="hero-image-enter" className="wire-anchor left-0 top-10" />

                    <div ref={objectInnerRef} className="relative">
                      <AssetImage
                        image={{
                          id: "P1",
                          alt: "Signature hero object — sterling silver cross pendant",
                          ratio: "4:5",
                        }}
                        priority
                      />
                      {/* specular sweep — outer wrapper clips and never
                          moves; only the bar inside it (sweepBarRef) does.
                          Monochrome only (Gunmetal → Mirror Flash → Brushed
                          Steel, DIRECTION.md's dark/gothic sterling-silver
                          tokens) — the earlier rainbow/hue-shifting version
                          is retired per direction. Position is still
                          computed independently of the object's own
                          rotation each frame, see the apply() comment
                          above; that mechanism is unchanged, only the color
                          is not. No mix-blend-mode, kept off on general
                          principle after an earlier asset in this project
                          hung the screenshot/compositor pipeline when a
                          blend mode was combined with a blur filter. */}
                      <div className="pointer-events-none absolute inset-0 overflow-hidden">
                        <div
                          ref={sweepBarRef}
                          className="absolute inset-y-0 w-1/2 bg-[linear-gradient(100deg,transparent_0%,rgba(74,78,87,0.55)_25%,rgba(245,246,248,0.9)_50%,rgba(184,190,199,0.55)_75%,transparent_100%)]"
                        />
                      </div>
                    </div>

                    <span data-wire-anchor="hero-image-exit" className="wire-anchor bottom-10 right-0" />
                  </div>

                  <span
                    ref={tagRef}
                    className="pointer-events-auto absolute -top-3 -right-3 z-[4] border border-grape-ink/25 bg-chrome-white px-2 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-grape-ink/70"
                  >
                    No. 001 · one of one
                  </span>

                  {/* Y2K sticker-badge graphic moment */}
                  <span
                    ref={stickerRef}
                    className="pointer-events-none absolute -bottom-4 -left-5 z-[4] flex h-14 w-14 rotate-[-8deg] items-center justify-center rounded-full border-2 border-grape-ink bg-sticker-yellow text-center font-mono text-[8px] font-bold uppercase leading-tight text-grape-ink"
                  >
                    Never
                    <br />
                    Restocked
                  </span>
                </div>
              </div>
            </div>

            {/* statement + CTA */}
            <div
              ref={ctaRowRef}
              className="relative z-[4] mt-10 flex flex-col gap-6 sm:mt-14 sm:flex-row sm:items-end sm:justify-between"
            >
              <p className="max-w-xs text-base leading-snug text-grape-ink/80 sm:text-lg">
                Every piece here exists exactly once. We&apos;re not sorry when it sells.
              </p>
              <Link
                href="/shop"
                className="group inline-flex w-fit items-center gap-2 border-b border-grape-ink pb-1 text-xs font-medium uppercase tracking-[0.18em] text-grape-ink"
              >
                Shop the Drop
                <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Link>
              <span data-wire-anchor="hero-end" className="wire-anchor right-1/3 bottom-0" />
            </div>
          </div>
        </div>
      </section>

      <CurrentDropScene />
      <EditorialTransition />
      <CollectionsLine />
      <LookbookSequence />
      <NewArrivalsFilmstrip />
      <ManifestoCollage />
      <FinaleTag />
    </main>
  );
}
