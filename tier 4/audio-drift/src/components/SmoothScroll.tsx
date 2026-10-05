"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { MQ, scheduleRefresh } from "@/lib/motion";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const reduce = window.matchMedia(MQ.reduce);

    const onTick = (time: number) => {
      lenisRef.current?.raf(time * 1000);
    };

    const start = () => {
      if (lenisRef.current) return;
      const lenis = new Lenis({ lerp: 0.1 });
      lenis.on("scroll", ScrollTrigger.update);
      lenisRef.current = lenis;
    };

    // reduced motion: tear Lenis down completely (listeners, html classes, raf)
    // so native scrolling is untouched — not merely paused
    const stop = () => {
      lenisRef.current?.destroy();
      lenisRef.current = null;
    };

    const apply = () => {
      if (reduce.matches) stop();
      else start();
      scheduleRefresh();
    };

    apply();
    reduce.addEventListener("change", apply);
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      reduce.removeEventListener("change", apply);
      gsap.ticker.remove(onTick);
      gsap.ticker.lagSmoothing(500, 33);
      stop();
    };
  }, []);

  // route change: land at the top without Lenis easing back to the old offset
  useEffect(() => {
    lenisRef.current?.scrollTo(0, { immediate: true, force: true });
    scheduleRefresh();
  }, [pathname]);

  return <>{children}</>;
}
