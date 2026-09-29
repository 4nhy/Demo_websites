"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { buildRuns, smoothPath, type Anchor, type Pt } from "@/lib/wire-path";
import { LENIS_SCROLL_EVENT, type LenisScrollDetail } from "@/lib/lenis-bridge";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * The ANGEL WIRE signature element.
 *
 * One logical path winds through the homepage: it starts at the hero
 * wordmark, passes *behind* the hero image, and re-emerges to trail toward
 * whatever section comes next. It is authored as a single ordered anchor
 * list — see DESKTOP_ANCHORS below — and split into "front" and "back" runs
 * at the points where it should change z-index band.
 *
 * Built incrementally, section by section: this list currently covers the
 * Hero, Current Drop, Editorial Transition, Collections Line, Lookbook, New
 * Arrivals, Manifesto, and Finale (all eight Stage 4 sections — Finale is
 * the wire's true terminus; its last anchor, finale-knot, is the id the
 * terminus-knot logic below uses to place the dot). Each later section adds its own anchors here and
 * matching `data-wire-anchor` spans in its markup — the path simply grows
 * down the real page as it's built, same mechanism throughout, never
 * rewritten.
 *
 * Anchor positions are measured live from real DOM elements carrying
 * `data-wire-anchor="<id>"`, so the path always matches actual layout
 * instead of guessed coordinates. On mobile a shorter anchor list is used —
 * a genuinely simpler path, not a scaled-down copy of the desktop one.
 */

const DESKTOP_ANCHORS: Anchor[] = [
  { id: "hero-start", layer: "front" },
  { id: "hero-pre-image", layer: "front" },
  { id: "hero-image-enter", layer: "back" },
  { id: "hero-image-exit", layer: "front" },
  { id: "hero-end", layer: "front" },
  { id: "drop-start", layer: "front" },
  { id: "drop-pre-image", layer: "front" },
  { id: "drop-image-enter", layer: "back" },
  { id: "drop-image-exit", layer: "front" },
  { id: "drop-end", layer: "front" },
  { id: "edt-start", layer: "front" },
  { id: "edt-image-enter", layer: "back" },
  { id: "edt-image-exit", layer: "front" },
  { id: "edt-end", layer: "front" },
  { id: "line-start", layer: "front" },
  { id: "line-image-enter", layer: "back" },
  { id: "line-image-exit", layer: "front" },
  { id: "line-end", layer: "front" },
  { id: "look-start", layer: "front" },
  { id: "look-image-enter", layer: "back" },
  { id: "look-image-exit", layer: "front" },
  { id: "look-end", layer: "front" },
  { id: "arrivals-start", layer: "front" },
  { id: "arrivals-image-enter", layer: "back" },
  { id: "arrivals-image-exit", layer: "front" },
  { id: "arrivals-end", layer: "front" },
  { id: "manifesto-start", layer: "front" },
  { id: "manifesto-behind", layer: "back" },
  { id: "manifesto-front", layer: "front" },
  { id: "manifesto-end", layer: "front" },
  { id: "finale-start", layer: "front" },
  { id: "finale-behind", layer: "back" },
  { id: "finale-knot", layer: "front" },
];

const MOBILE_ANCHORS: Anchor[] = [
  { id: "hero-start", layer: "front" },
  { id: "hero-image-enter", layer: "back" },
  { id: "hero-image-exit", layer: "front" },
  { id: "hero-end", layer: "front" },
  { id: "drop-start", layer: "front" },
  { id: "drop-image-enter", layer: "back" },
  { id: "drop-image-exit", layer: "front" },
  { id: "drop-end", layer: "front" },
  { id: "edt-start", layer: "front" },
  { id: "edt-image-enter", layer: "back" },
  { id: "edt-image-exit", layer: "front" },
  { id: "edt-end", layer: "front" },
  { id: "line-start", layer: "front" },
  { id: "line-image-enter", layer: "back" },
  { id: "line-image-exit", layer: "front" },
  { id: "line-end", layer: "front" },
  { id: "look-start", layer: "front" },
  { id: "look-image-enter", layer: "back" },
  { id: "look-image-exit", layer: "front" },
  { id: "look-end", layer: "front" },
  { id: "arrivals-start", layer: "front" },
  { id: "arrivals-image-enter", layer: "back" },
  { id: "arrivals-image-exit", layer: "front" },
  { id: "arrivals-end", layer: "front" },
  { id: "manifesto-start", layer: "front" },
  { id: "manifesto-behind", layer: "back" },
  { id: "manifesto-front", layer: "front" },
  { id: "manifesto-end", layer: "front" },
  { id: "finale-start", layer: "front" },
  { id: "finale-behind", layer: "back" },
  { id: "finale-knot", layer: "front" },
];

// DRAW-PROGRESS HISTORY (2026-09-12 → 2026-09-13), kept short deliberately:
// v1 drove the wire off one ScrollTrigger spanning the whole page — simple,
// but arc-length-drawn-per-scroll-pixel varied by section (a section's
// authored pin height has no necessary relationship to its actual on-screen
// wire length — Manifesto's 320–360vh pin against a short anchor-to-anchor
// span was the worst case), which read as stalling then leaping. v2 tried
// per-section progress trackers composited by arc-length share, blended
// with scroll-consumption share, plus a global fallback for gaps between
// sections, plus its own exponential smoothing layer on top — each added
// signal fixed what it targeted numerically, but stacking four correction
// signals on raw scroll pixels never actually felt physical when watched
// live, and made the whole thing hard to reason about.
//
// v3 (current): drop the composite entirely. Lenis already solves "smooth,
// physically-trailing scroll" — that's its whole purpose — so the wire
// reads its progress straight off Lenis's own smoothed scroll/limit
// (broadcast by SmoothScroll.tsx, see lib/lenis-bridge.ts) instead of
// recomputing a scroll-derived value of its own. This is the same *shape*
// as v1 (progress = scroll / limit, no per-section weighting) — so the
// per-section rate mismatch v1 had is a known, accepted trade-off here,
// not a regression that slipped back in — but the physical feel no longer
// depends on any smoothing logic living in this file. If a section's rate
// mismatch is bad enough to actually see, the honest fix is that section's
// own pin height, not another layer here.
type RunState = { layer: "front" | "back"; d: string };

export default function AngelWire({
  containerRef,
}: {
  containerRef: RefObject<HTMLDivElement | null>;
}) {
  const [runs, setRuns] = useState<RunState[]>([]);
  const [terminus, setTerminus] = useState<Pt | null>(null);
  const [mobile, setMobile] = useState(false);
  const backRefs = useRef<Array<SVGPathElement | null>>([]);
  const frontRefs = useRef<Array<SVGPathElement | null>>([]);
  const knotRef = useRef<SVGCircleElement | null>(null);
  // Signature of the last geometry actually applied via setRuns/setTerminus —
  // see the bug note in the effect below for why this exists.
  const lastSignatureRef = useRef<string>("");

  // Pass 1 — measure anchor positions on mount, on resize, and whenever the
  // mobile breakpoint is crossed. Writes `runs`/`terminus`, which triggers a
  // render of the actual <path> elements with real `d` strings.
  //
  // BUG FIX (diagnosed 2026-09-12): measure() legitimately runs up to five
  // times in the first ~800ms of page life (mount, +150ms, +800ms,
  // fonts.ready, any resize) to catch late layout settling. Every call used
  // to end in `setRuns(built.map(...))` — a fresh array of fresh objects
  // every time, even when the measured pixel positions hadn't moved at all.
  // React can't bail out on that by reference equality, so Pass 2 below (its
  // effect depends on `runs`) re-ran on every single measure() call: it
  // killed the live ScrollTrigger and every parallax tween and created brand
  // new ones from scratch, up to 5 times per load. If the user was already
  // scrolling in that window — easy to do, the hero invites it immediately —
  // each rebuild threw away the old trigger's in-flight scrub state and
  // started a fresh one at whatever the *current* scroll position implied,
  // which is a visible snap/jump in the wire, not a smooth continuation.
  // That's the reported jitter. Fix: only call setRuns/setTerminus when the
  // measured geometry actually differs from what's already applied, so the
  // common case (nothing moved) touches neither state nor Pass 2 at all.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const mobileQuery = window.matchMedia("(max-width: 640px)");

    function measure() {
      const isMobile = mobileQuery.matches;
      setMobile(isMobile);
      const anchorDefs = isMobile ? MOBILE_ANCHORS : DESKTOP_ANCHORS;
      const rect = container!.getBoundingClientRect();
      const points: Record<string, Pt> = {};
      anchorDefs.forEach((a) => {
        const el = container!.querySelector<HTMLElement>(`[data-wire-anchor="${a.id}"]`);
        if (el) {
          const r = el.getBoundingClientRect();
          points[a.id] = {
            x: r.left - rect.left + r.width / 2,
            y: r.top - rect.top + r.height / 2,
          };
        }
      });
      const built = buildRuns(anchorDefs, points);
      const nextRuns = built.map((r) => ({ layer: r.layer, d: smoothPath(r.points) }));
      const lastId = anchorDefs[anchorDefs.length - 1].id;
      const nextTerminus = points[lastId] ?? null;

      // Round to whole pixels before comparing — sub-pixel getBoundingClientRect
      // jitter between measurements shouldn't count as "real" movement either.
      const signature = JSON.stringify({
        runs: nextRuns.map((r) => `${r.layer}:${r.d}`),
        terminus: nextTerminus ? [Math.round(nextTerminus.x), Math.round(nextTerminus.y)] : null,
      });
      if (signature === lastSignatureRef.current) return;
      lastSignatureRef.current = signature;

      setRuns(nextRuns);
      setTerminus(nextTerminus);
    }

    measure();
    // fonts / late layout shifts can move anchors slightly after first paint.
    // A single 150ms timer isn't always enough on this page: eight sections
    // each flip their own `cinematic` state one tick after mount, so total
    // page height can keep settling in staggered steps past 150ms — normally
    // harmless (an anchor a few px off mid-path doesn't show), but Finale's
    // wire terminus is built to land exactly in a physical hole, so it needs
    // the real final measurement. Two more triggers, same `measure` fn.
    const settleTimer = window.setTimeout(measure, 150);
    const lateSettleTimer = window.setTimeout(measure, 800);
    document.fonts?.ready?.then(() => measure());

    let resizeTimer: number | undefined;
    function onResize() {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(measure, 150);
    }
    window.addEventListener("resize", onResize);
    mobileQuery.addEventListener("change", measure);
    const ro = new ResizeObserver(onResize);
    ro.observe(container);

    return () => {
      window.clearTimeout(settleTimer);
      window.clearTimeout(lateSettleTimer);
      window.clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
      mobileQuery.removeEventListener("change", measure);
      ro.disconnect();
    };
  }, [containerRef]);

  // Pass 2 — once the runs are in the DOM with real geometry, measure each
  // path's true length and bind (or rebind) the scroll choreography.
  useEffect(() => {
    const container = containerRef.current;
    if (!container || runs.length === 0) return;

    const allEls: SVGPathElement[] = [];
    let bi = 0;
    let fi = 0;
    runs.forEach((r) => {
      const el = r.layer === "back" ? backRefs.current[bi++] : frontRefs.current[fi++];
      if (el) allEls.push(el);
    });
    if (allEls.length === 0) return;

    const lengths = allEls.map((el) => el.getTotalLength());
    const cum: number[] = [];
    let acc = 0;
    lengths.forEach((l) => {
      cum.push(acc);
      acc += l;
    });
    const total = acc || 1;

    allEls.forEach((el, i) => {
      el.style.strokeDasharray = `${lengths[i]}`;
    });

    // Read once, from the already-rendered circle, instead of closing over
    // the `mobile` state value — keeps this effect's dependency array
    // accurate without re-running the (expensive) path setup on every
    // breakpoint crossing, which already re-triggers Pass 1 → new `runs`.
    const baseKnotR = parseFloat(knotRef.current?.getAttribute("r") || "6");

    function applyProgress(progress: number) {
      // `progress` is Lenis's own scroll/limit fraction (or 1 under
      // reduced motion) — applied directly, no easing curve of its own.
      const drawn = progress * total;
      allEls.forEach((el, i) => {
        const start = cum[i];
        const len = lengths[i];
        const end = start + len;
        const off = drawn <= start ? len : drawn >= end ? 0 : len - (drawn - start);
        el.style.strokeDashoffset = `${off}`;
      });
      if (knotRef.current) {
        const knotP = gsap.utils.clamp(0, 1, (progress - 0.92) / 0.08);
        // Animate the circle's own radius rather than a CSS scale transform.
        // GSAP's SVG transformOrigin math (needed for a plain scale) breaks
        // down at this element's very large cy (thousands of px, growing
        // with every section added) — it was always somewhat imprecise, but
        // only became visibly wrong once a section needed the knot to land
        // exactly on a target (Finale). Setting r directly has no origin to
        // get wrong and reads identically (grows in while fading in).
        knotRef.current.setAttribute("r", String(baseKnotR * (0.6 + knotP * 0.4)));
        knotRef.current.style.opacity = String(knotP);
      }
    }

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      // Complete wire, statically — no ScrollTrigger, no parallax.
      applyProgress(1);
      return;
    }

    applyProgress(0);

    // Drive the wire directly off Lenis's own smoothed scroll — see the
    // DRAW-PROGRESS HISTORY comment at the top of this file. No
    // per-section weighting, no blending, no separate smoothing layer:
    // whatever "physical" means for Lenis's own scroll is what this reads.
    function onLenisScroll(e: Event) {
      const { progress } = (e as CustomEvent<LenisScrollDetail>).detail;
      applyProgress(progress);
    }
    window.addEventListener(LENIS_SCROLL_EVENT, onLenisScroll);

    // Seed from the current native scroll position immediately, rather than
    // waiting for the first Lenis 'scroll' event — Lenis keeps native
    // scroll in sync with its own position, so this is accurate even for a
    // deep-linked mid-page load, and the wire shouldn't animate in from
    // zero in that case.
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    applyProgress(gsap.utils.clamp(0, 1, window.scrollY / maxScroll));

    const refreshId = requestAnimationFrame(() => ScrollTrigger.refresh());

    const parallaxTweens: gsap.core.Tween[] = [];
    container.querySelectorAll<HTMLElement>("[data-wire-parallax]").forEach((el) => {
      const speed = parseFloat(el.dataset.wireParallax || "0.15");
      parallaxTweens.push(
        gsap.to(el, {
          yPercent: -30 * speed,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 0.6 },
        })
      );
    });

    return () => {
      cancelAnimationFrame(refreshId);
      window.removeEventListener(LENIS_SCROLL_EVENT, onLenisScroll);
      parallaxTweens.forEach((t) => t.scrollTrigger?.kill());
      parallaxTweens.forEach((t) => t.kill());
    };
  }, [runs, containerRef]);

  return (
    <>
      <svg className="wire-layer wire-back" aria-hidden="true" focusable="false">
        {runs
          .filter((r) => r.layer === "back")
          .map((r, idx) => (
            <path
              key={`back-${idx}`}
              ref={(el) => {
                backRefs.current[idx] = el;
              }}
              d={r.d}
              className="wire-path"
            />
          ))}
      </svg>
      <svg className="wire-layer wire-front" aria-hidden="true" focusable="false">
        {runs
          .filter((r) => r.layer === "front")
          .map((r, idx) => (
            <path
              key={`front-${idx}`}
              ref={(el) => {
                frontRefs.current[idx] = el;
              }}
              d={r.d}
              className="wire-path"
            />
          ))}
        {terminus && (
          <circle
            ref={knotRef}
            cx={terminus.x}
            cy={terminus.y}
            r={mobile ? 4 : 6}
            className="wire-knot"
            opacity={0}
          />
        )}
      </svg>
    </>
  );
}
