"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { LENIS_SCROLL_EVENT, type LenisScrollDetail } from "@/lib/lenis-bridge";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Global smooth-scroll provider. Wires Lenis's scroll event to
 * ScrollTrigger.update per Tier 4 discipline — without this the two fight
 * and every scrub judders. Also rebroadcasts Lenis's own smoothed
 * scroll/limit/progress as a plain window event (see lib/lenis-bridge.ts) —
 * AngelWire drives its draw-in directly off this instead of computing its
 * own scroll-derived progress, so "does the wire feel physical" reduces to
 * "does Lenis's own scroll feel physical," one signal instead of several.
 * Destroys the Lenis instance under prefers-reduced-motion rather than
 * merely skipping a class, and rebuilds it live if the preference changes
 * mid-session.
 */
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const reducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let lenis: Lenis | null = null;

    function onTick(time: number) {
      lenis?.raf(time * 1000);
    }

    function broadcast(l: Lenis) {
      const detail: LenisScrollDetail = { scroll: l.scroll, limit: l.limit, progress: l.progress };
      window.dispatchEvent(new CustomEvent<LenisScrollDetail>(LENIS_SCROLL_EVENT, { detail }));
    }

    function create() {
      lenis = new Lenis({ autoRaf: false, respectReducedMotion: true });
      lenis.on("scroll", (l: Lenis) => {
        ScrollTrigger.update();
        broadcast(l);
      });
      gsap.ticker.add(onTick);
      gsap.ticker.lagSmoothing(0);
      // Seed one broadcast immediately — a deep-linked mid-page load
      // shouldn't wait for the first scroll event to tell listeners where
      // the page actually is.
      broadcast(lenis);
    }

    function destroy() {
      gsap.ticker.remove(onTick);
      lenis?.destroy();
      lenis = null;
    }

    if (!reducedQuery.matches) create();

    function onChange(e: MediaQueryListEvent) {
      if (e.matches) destroy();
      else create();
      ScrollTrigger.refresh();
    }
    reducedQuery.addEventListener("change", onChange);

    return () => {
      reducedQuery.removeEventListener("change", onChange);
      destroy();
    };
  }, []);

  return <>{children}</>;
}
