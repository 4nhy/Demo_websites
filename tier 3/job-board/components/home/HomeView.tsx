"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Disc from "./Disc";
import Hero from "./Hero";
import StatStrip from "./StatStrip";
import CategoryGrid from "./CategoryGrid";
import FeaturedListings from "./FeaturedListings";
import WhySection from "./WhySection";
import Testimonials from "./Testimonials";
import CtaBand from "./CtaBand";
import type { Job, JobCategory } from "@/lib/jobs";

gsap.registerPlugin(ScrollTrigger);

interface HomeViewProps {
  jobs: Job[];
  featuredJobs: Job[];
  categories: JobCategory[];
  categoryCounts: Record<string, number>;
  companyCount: number;
  locationCount: number;
}

// Hero rest spot — DIRECTION.md "Signature". The only *hardcoded*
// waypoint: hero has no real dock element to land on (the entrance is a
// deliberate oversized/full-bleed moment, not a docking beat), so it stays
// a viewport-percentage target. Every waypoint after this one (stats,
// categories, cta) computes its target from the real [data-disc-dock]
// element's own on-screen position instead of a guessed percentage — see
// `targetFor` in buildScrubTimeline below. An earlier version used
// hardcoded percentage guesses for all four spots and computed each leg's
// timing as `element.offsetTop / total`; a scroll-trace diagnostic showed
// that fraction came out >1 for the CTA leg (it's the last section in
// `range`, so its top sits past the point `range`'s bottom reaches the
// viewport), which silently corrupted every leg's proportional share of
// the timeline and caused the disc and each dock to be visibly out of
// sync, in the wrong place, at the same time. See `dockWindow` below for
// the fix — timing is now derived from the same section geometry each
// dock's own ScrollTrigger uses.
const HERO_SPOT = { top: "8%", left: "62%", scale: 4 };

// Shared between the dock-reveal ScrollTriggers and the disc's own timing
// math (buildScrubTimeline) so the two can't drift out of sync with each
// other — that drift is exactly what caused the bug described above.
const STATS_TRIGGER = { startPct: 0.7, endPct: 0.3 };
const CATEGORIES_TRIGGER = { startPct: 0.65, endPct: 0.35 };
const CTA_TRIGGER_PCT = 0.75;

/**
 * Owns every motion moment on the homepage. One real orchestrated set-piece
 * (the traveling disc, desktop-only per the confirmed md+ breakpoint gate)
 * plus varied per-section reveals and one additional pinned/zoom beat
 * (WhySection). Reduced-motion destroys every ScrollTrigger and renders the
 * page fully static — no partial states.
 */
export default function HomeView({
  jobs,
  featuredJobs,
  categories,
  categoryCounts,
  companyCount,
  locationCount,
}: HomeViewProps) {
  const rangeRef = useRef<HTMLDivElement>(null);
  const discRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      // ---- Kinetic hero entrance ----
      const words = gsap.utils.toArray<HTMLElement>("[data-kinetic-word]");
      if (prefersReduced) {
        gsap.set(words, { yPercent: 0, opacity: 1 });
      } else {
        gsap.fromTo(
          words,
          { yPercent: 110 },
          {
            yPercent: 0,
            duration: 0.9,
            ease: "power4.out",
            stagger: 0.09,
            delay: 0.15,
          }
        );
      }

      if (prefersReduced) {
        // Static fallback: no ScrollTrigger, no disc, everything visible.
        document
          .querySelectorAll<HTMLElement>("[data-stat-value]")
          .forEach((el) => {
            el.textContent = el.dataset.statValue ?? "0";
          });
        if (discRef.current) gsap.set(discRef.current, { opacity: 0 });
        return;
      }

      // ---- Stat count-up ----
      document
        .querySelectorAll<HTMLElement>("[data-stat-value]")
        .forEach((el) => {
          const target = Number(el.dataset.statValue ?? "0");
          const counter = { val: 0 };
          gsap.to(counter, {
            val: target,
            duration: 1.4,
            ease: "power2.out",
            onUpdate: () => {
              el.textContent = String(Math.round(counter.val));
            },
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          });
        });

      // ---- Category grid: clip-path wipe, staggered ----
      gsap.fromTo(
        "[data-category-tile]",
        { clipPath: "inset(0 0 100% 0)" },
        {
          clipPath: "inset(0 0 0% 0)",
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: {
            trigger: "#categories",
            start: "top 75%",
            toggleActions: "play none none none",
          },
        }
      );

      // ---- Featured listings: alternating slide-in ----
      gsap.utils.toArray<HTMLElement>("[data-job-row]").forEach((row, i) => {
        gsap.fromTo(
          row,
          { x: i % 2 === 0 ? -40 : 40, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: {
              trigger: row,
              start: "top 90%",
              toggleActions: "play none none none",
            },
          }
        );
      });

      // ---- Testimonials: alternating left/right slide ----
      gsap.utils.toArray<HTMLElement>("[data-testimonial]").forEach((el) => {
        const dir = el.dataset.testimonialDir === "right" ? 60 : -60;
        gsap.fromTo(
          el,
          { x: dir, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      });

      // ---- Why section: the second pinned/zoom beat ----
      const whyScale = document.querySelector("[data-why-scale]");
      const whyItems = gsap.utils.toArray("[data-why-item]");
      if (whyScale) {
        gsap.set(whyItems, { opacity: 0, y: 24 });
        const whyTl = gsap.timeline({
          scrollTrigger: {
            trigger: "[data-why-pin]",
            start: "top top",
            end: "+=100%",
            scrub: 1,
            pin: true,
          },
        });
        whyTl
          .fromTo(
            whyScale,
            { scale: 0.7, opacity: 0.4 },
            { scale: 1, opacity: 1, ease: "power2.out" }
          )
          .to(
            whyItems,
            { opacity: 1, y: 0, stagger: 0.08, ease: "power2.out" },
            "-=0.2"
          );
      }

      // ---- CTA band: scale-in ----
      gsap.fromTo(
        "#cta > div",
        { scale: 0.94, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: {
            trigger: "#cta",
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );

      // ---- The traveling disc — the primary set-piece ----
      const disc = discRef.current;
      const range = rangeRef.current;
      if (disc && range) {
        const mm = gsap.matchMedia();

        // Desktop/tablet (md+, 768px): fixed-position disc, ONE continuous
        // scrub timeline for the whole journey (see the note above on why
        // this replaced per-section zones). The disc is only ever the
        // visible thing *between* waypoints — as it approaches each one it
        // fades out, and a real element already sitting in that section's
        // own layout ([data-disc-dock]) fades in to take over, so nothing
        // ever reads as a fixed circle parked on top of content. See the
        // dock-trigger block below.
        mm.add("(min-width: 768px)", () => {
          gsap.set(disc, {
            top: HERO_SPOT.top,
            left: HERO_SPOT.left,
            xPercent: -50,
            yPercent: -50,
            scale: 0,
            opacity: 1,
            zIndex: 30,
          });

          let scrubTl: gsap.core.Timeline | null = null;

          // A section's own on-scroll "arrival window", expressed in px of
          // scrollY relative to `range`'s top — the exact same geometry
          // each dock's ScrollTrigger below uses ("top P1%"/"bottom P2%"),
          // so the disc's fade schedule and the real dock's crossfade are
          // driven by the same numbers instead of two unrelated clocks.
          // (Diagnosed via a 15-point scroll trace: the previous version
          // computed leg proportions as `element.offsetTop / total`, and
          // since CTA is the last section in `range`, that fraction came
          // out >1 — which silently corrupted every leg's proportional
          // share of the timeline. Confirmed: fCta measured ~1.10, which
          // squeezed the stats->categories leg down to ~5% of the whole
          // scroll range and let the disc and the stats dock sit at full
          // opacity simultaneously, ~115px apart, for an extended window.)
          const dockWindow = (
            el: HTMLElement,
            startPct: number,
            endPct: number,
            rangeTop: number,
            vh: number
          ) => {
            const r = el.getBoundingClientRect();
            const top = r.top + window.scrollY - rangeTop;
            const bottom = r.bottom + window.scrollY - rangeTop;
            const fadeInStart = top - startPct * vh;
            const fadeOutEnd = bottom - endPct * vh;
            const span = Math.max(fadeOutEnd - fadeInStart, 1);
            return { fadeInStart, fullyIn: fadeInStart + span / 3, fadeOutEnd };
          };

          // The disc's opacity is a single shared timeline, so its own
          // schedule must stay monotonic even where two sections sit close
          // enough that their real trigger windows overlap (stats is only
          // ~245px tall) — shift a window forward rather than let it
          // collide with the previous one.
          const clampAfter = (
            win: { fadeInStart: number; fullyIn: number; fadeOutEnd: number },
            minStart: number
          ) => {
            if (win.fadeInStart >= minStart) return win;
            const shift = minStart - win.fadeInStart;
            return {
              fadeInStart: win.fadeInStart + shift,
              fullyIn: win.fullyIn + shift,
              fadeOutEnd: win.fadeOutEnd + shift,
            };
          };

          // Where the disc should visually land, in fixed-viewport px, so
          // it actually overlaps the real dock element rather than a
          // hardcoded viewport-percentage guess. `arriveAtScrollY` is the
          // real (document-absolute) scrollY at the moment the disc's
          // position tween finishes — the dock's on-screen Y at THAT
          // scroll position is what the disc needs to match.
          const targetFor = (dockEl: HTMLElement, arriveAtScrollY: number) => {
            const r = dockEl.getBoundingClientRect();
            const docY = r.top + window.scrollY + r.height / 2;
            const docX = r.left + window.scrollX + r.width / 2;
            return { top: docY - arriveAtScrollY, left: docX };
          };

          const buildScrubTimeline = () => {
            scrubTl?.scrollTrigger?.kill();
            scrubTl?.kill();

            const statsEl = document.querySelector<HTMLElement>("#stats");
            const categoriesEl =
              document.querySelector<HTMLElement>("#categories");
            const ctaEl = document.querySelector<HTMLElement>("#cta");
            const statsDockEl = document.querySelector<HTMLElement>(
              '[data-disc-dock="stats"]'
            );
            const categoryDockEl = document.querySelector<HTMLElement>(
              '[data-disc-dock="categories"]'
            );
            const ctaDockEl = document.querySelector<HTMLElement>(
              '[data-disc-dock="cta"]'
            );
            if (
              !statsEl ||
              !categoriesEl ||
              !ctaEl ||
              !statsDockEl ||
              !categoryDockEl ||
              !ctaDockEl
            )
              return;

            const vh = window.innerHeight;
            const rangeTop = range.getBoundingClientRect().top + window.scrollY;
            const total = range.offsetHeight - vh;

            const statsW = dockWindow(
              statsEl,
              STATS_TRIGGER.startPct,
              STATS_TRIGGER.endPct,
              rangeTop,
              vh
            );
            const categoriesW = clampAfter(
              dockWindow(
                categoriesEl,
                CATEGORIES_TRIGGER.startPct,
                CATEGORIES_TRIGGER.endPct,
                rangeTop,
                vh
              ),
              statsW.fadeOutEnd + 1
            );
            const ctaTop =
              ctaEl.getBoundingClientRect().top + window.scrollY - rangeTop;
            const ctaArrive = Math.max(
              ctaTop - CTA_TRIGGER_PCT * vh,
              categoriesW.fadeOutEnd + 1
            );
            const ctaFadeDur = Math.max(0.35 * vh, 1);

            const statsSpot = {
              ...targetFor(statsDockEl, rangeTop + statsW.fadeInStart),
              scale: 0.5,
            };
            const categoriesSpot = {
              ...targetFor(categoryDockEl, rangeTop + categoriesW.fadeInStart),
              scale: 0.6,
            };
            const ctaSpot = {
              ...targetFor(ctaDockEl, rangeTop + ctaArrive),
              scale: 0.45,
            };

            scrubTl = gsap.timeline({
              scrollTrigger: {
                trigger: range,
                start: "top top",
                end: "bottom bottom",
                scrub: 0.5,
              },
            });

            // Rise back above content (was dropped behind the hero
            // headline at rest) the instant it starts traveling.
            scrubTl.set(disc, { zIndex: 30, xPercent: -50, yPercent: -50 }, 0);

            // hero -> stats: travel, then crossfade out over the exact
            // same window the stats dock crossfades in — never both at
            // full opacity together.
            scrubTl.to(
              disc,
              {
                ...statsSpot,
                ease: "power1.inOut",
                duration: Math.max(statsW.fadeInStart, 1),
              },
              0
            );
            scrubTl.to(
              disc,
              {
                opacity: 0,
                ease: "none",
                duration: statsW.fullyIn - statsW.fadeInStart,
              },
              statsW.fadeInStart
            );
            // hidden through the stats dock's hold, then crossfade back in
            // over the dock's own fade-out window
            scrubTl.to(
              disc,
              {
                opacity: 1,
                ease: "none",
                duration: statsW.fadeOutEnd - statsW.fullyIn,
              },
              statsW.fullyIn
            );

            // stats -> categories: travel across whatever room exists
            // between the two dock windows (can be ~0px when sections sit
            // close together — the disc then just reappears already near
            // the next spot instead of animating a gap that doesn't exist)
            const travel1Start = statsW.fadeOutEnd;
            const travel1End = Math.max(
              categoriesW.fadeInStart,
              travel1Start + 1
            );
            scrubTl.to(
              disc,
              {
                ...categoriesSpot,
                ease: "power1.inOut",
                duration: travel1End - travel1Start,
              },
              travel1Start
            );
            scrubTl.to(
              disc,
              {
                opacity: 0,
                ease: "none",
                duration: categoriesW.fullyIn - categoriesW.fadeInStart,
              },
              categoriesW.fadeInStart
            );
            scrubTl.to(
              disc,
              {
                opacity: 1,
                ease: "none",
                duration: categoriesW.fadeOutEnd - categoriesW.fullyIn,
              },
              categoriesW.fullyIn
            );

            // categories -> cta: same idea, arriving faded out right as
            // the cta wordmark's one-shot reveal fires (see the ctaDock
            // trigger below).
            const travel2Start = categoriesW.fadeOutEnd;
            const travel2End = Math.max(ctaArrive, travel2Start + 1);
            scrubTl.to(
              disc,
              {
                ...ctaSpot,
                ease: "power1.inOut",
                duration: travel2End - travel2Start,
              },
              travel2Start
            );
            scrubTl.to(
              disc,
              { opacity: 0, ease: "power1.in", duration: ctaFadeDur },
              ctaArrive
            );

            // permanent landing — the cta dock holds it from here to the
            // end of the page
            scrubTl.to(
              disc,
              {
                opacity: 0,
                duration: Math.max(total - (ctaArrive + ctaFadeDur), 0.001),
              },
              ctaArrive + ctaFadeDur
            );

            // Live position-follow during each dock's active window.
            // `disc` is `position: fixed`, so a keyframe tween can only
            // ever match a scrolling dock's coordinates at one instant —
            // the moment the user keeps scrolling through the rest of the
            // fade window, the fixed disc drifts away from the (still
            // moving) real element. Diagnosed via a before/after scroll
            // trace: the disc arrived correctly but then froze in place
            // while the dock kept scrolling out from under it. Overriding
            // top/left every frame for the duration of each fade window
            // keeps the disc locked to the dock's real, live position
            // instead of a single pre-computed point.
            const follow = (
              win: { fadeInStart: number; fadeOutEnd: number },
              dockEl: HTMLElement
            ) => {
              const rel = window.scrollY - rangeTop;
              if (rel < win.fadeInStart || rel > win.fadeOutEnd) return false;
              const r = dockEl.getBoundingClientRect();
              gsap.set(disc, {
                top: r.top + r.height / 2,
                left: r.left + r.width / 2,
              });
              return true;
            };
            scrubTl.eventCallback("onUpdate", () => {
              if (follow(statsW, statsDockEl)) return;
              if (follow(categoriesW, categoryDockEl)) return;
              follow(
                { fadeInStart: ctaArrive, fadeOutEnd: ctaArrive + ctaFadeDur },
                ctaDockEl
              );
            });
          };

          // Build once the entrance finishes (avoids the scrub timeline's
          // initial render fighting the entrance tween over the same
          // properties), and rebuild on resize so waypoint fractions stay
          // matched to actual section positions.
          const entrance = gsap.to(disc, {
            scale: HERO_SPOT.scale,
            duration: 0.9,
            ease: "power3.out",
            delay: 0.35,
            onComplete: () => {
              // Drop behind the kinetic headline (z-20) now that it's
              // parked and oversized in the hero — it re-emerges above
              // content (z-30, set at scrubTl's start) the moment it
              // starts traveling toward the stat strip.
              gsap.set(disc, { zIndex: 10 });
              buildScrubTimeline();
            },
          });

          let resizeTimer: ReturnType<typeof setTimeout>;
          const onResize = () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(buildScrubTimeline, 200);
          };
          window.addEventListener("resize", onResize);

          // ---- Section docks: real inline/clipped elements the disc
          // "becomes" at each waypoint. Two-layer construction (a
          // permanent hairline mark + a red overlay) means only
          // scale/opacity need animating — no color interpolation — and
          // the base mark is a legitimate structural element even before
          // JS runs. Stats/categories are reversible pass-through beats
          // (scrub, tied to that section's own scroll range); the CTA
          // wordmark is the one-way permanent landing (play once, stays).
          const dockTriggers: ScrollTrigger[] = [];

          const statsDock = gsap.utils.toArray<HTMLElement>(
            '[data-disc-dock="stats"]'
          );
          if (statsDock.length) {
            gsap.set(statsDock, { scale: 0, opacity: 0 });
            const tl = gsap.timeline({
              scrollTrigger: {
                trigger: "#stats",
                start: `top ${STATS_TRIGGER.startPct * 100}%`,
                end: `bottom ${STATS_TRIGGER.endPct * 100}%`,
                scrub: 0.4,
              },
            });
            tl.to(statsDock, {
              scale: 1,
              opacity: 1,
              duration: 1,
              ease: "power1.out",
            })
              .to(statsDock, { scale: 1, opacity: 1, duration: 1 })
              .to(statsDock, {
                scale: 0,
                opacity: 0,
                duration: 1,
                ease: "power1.in",
              });
            if (tl.scrollTrigger) dockTriggers.push(tl.scrollTrigger);
          }

          const categoryDock = document.querySelector<HTMLElement>(
            '[data-disc-dock="categories"]'
          );
          if (categoryDock) {
            gsap.set(categoryDock, { scale: 0, opacity: 0 });
            const tl = gsap.timeline({
              scrollTrigger: {
                trigger: "#categories",
                start: `top ${CATEGORIES_TRIGGER.startPct * 100}%`,
                end: `bottom ${CATEGORIES_TRIGGER.endPct * 100}%`,
                scrub: 0.4,
              },
            });
            tl.to(categoryDock, {
              scale: 1,
              opacity: 1,
              duration: 1,
              ease: "power1.out",
            })
              .to(categoryDock, { scale: 1, opacity: 1, duration: 1 })
              .to(categoryDock, {
                scale: 0,
                opacity: 0,
                duration: 1,
                ease: "power1.in",
              });
            if (tl.scrollTrigger) dockTriggers.push(tl.scrollTrigger);
          }

          const ctaDock = document.querySelector<HTMLElement>(
            '[data-disc-dock="cta"]'
          );
          if (ctaDock) {
            gsap.set(ctaDock, { scale: 0, opacity: 0 });
            const tween = gsap.to(ctaDock, {
              scale: 1,
              opacity: 1,
              duration: 0.5,
              ease: "back.out(2)",
              scrollTrigger: {
                trigger: "#cta",
                start: `top ${CTA_TRIGGER_PCT * 100}%`,
                toggleActions: "play none none none",
              },
            });
            if (tween.scrollTrigger) dockTriggers.push(tween.scrollTrigger);
          }

          return () => {
            clearTimeout(resizeTimer);
            window.removeEventListener("resize", onResize);
            entrance.kill();
            scrubTl?.scrollTrigger?.kill();
            scrubTl?.kill();
            dockTriggers.forEach((t) => t.kill());
          };
        });

        // Mobile (<768px): no pin, no scrub-jacking. A small fixed badge
        // that wakes up (bigger, opaque) whenever a tracked section is in
        // view — same beats, ordinary scroll underneath it.
        mm.add("(max-width: 767px)", () => {
          gsap.set(disc, {
            top: "auto",
            left: "auto",
            bottom: "5%",
            right: "5%",
            xPercent: 0,
            yPercent: 0,
            scale: 0.35,
            opacity: 0,
            zIndex: 30,
          });
          const sections = ["#hero", "#stats", "#categories", "#cta"];
          const triggers = sections.map((sel) =>
            ScrollTrigger.create({
              trigger: sel,
              start: "top 70%",
              end: "bottom 30%",
              onEnter: () =>
                gsap.to(disc, {
                  opacity: 1,
                  scale: 0.55,
                  duration: 0.35,
                  ease: "power2.out",
                }),
              onLeave: () =>
                gsap.to(disc, {
                  opacity: 0.3,
                  scale: 0.35,
                  duration: 0.35,
                  ease: "power2.out",
                }),
              onEnterBack: () =>
                gsap.to(disc, {
                  opacity: 1,
                  scale: 0.55,
                  duration: 0.35,
                  ease: "power2.out",
                }),
              onLeaveBack: () =>
                gsap.to(disc, {
                  opacity: 0.3,
                  scale: 0.35,
                  duration: 0.35,
                  ease: "power2.out",
                }),
            })
          );
          return () => triggers.forEach((t) => t.kill());
        });
      }

      ScrollTrigger.refresh();
    }, rangeRef);

    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      ctx.revert();
    };
  }, []);

  return (
    <div ref={rangeRef} className="relative">
      <Disc ref={discRef} />
      <Hero roleCount={jobs.length} companyCount={companyCount} />
      <StatStrip
        stats={[
          { value: jobs.length, label: "Open roles" },
          { value: companyCount, label: "Companies" },
          { value: categories.length, label: "Categories" },
          { value: locationCount, label: "Locations" },
        ]}
      />
      <CategoryGrid categories={categories} counts={categoryCounts} />
      <FeaturedListings jobs={featuredJobs} />
      <WhySection />
      <Testimonials />
      <CtaBand />
    </div>
  );
}
