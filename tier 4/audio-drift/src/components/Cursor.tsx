"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

const QUERY = "(pointer: fine) and (min-width: 768px) and (prefers-reduced-motion: no-preference)";
const INTERACTIVE = "a, button, summary, [role='button'], [data-cursor], input, label";

/**
 * Desktop-only follower ring plus magnetic pull on [data-magnetic] elements.
 * The native cursor stays visible — this is an accent, not a replacement, so
 * nothing about pointing accuracy or accessibility depends on it.
 */
export default function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const mq = window.matchMedia(QUERY);
    const apply = () => setEnabled(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    const ring = ringRef.current;
    if (!enabled || !ring) return;

    const xTo = gsap.quickTo(ring, "x", { duration: 0.45, ease: "power3.out" });
    const yTo = gsap.quickTo(ring, "y", { duration: 0.45, ease: "power3.out" });
    const magnets = new WeakMap<HTMLElement, { x: (v: number) => void; y: (v: number) => void }>();
    let magnet: HTMLElement | null = null;
    let hover = "";
    let shown = false;

    const release = (el: HTMLElement) => {
      gsap.to(el, { x: 0, y: 0, duration: 0.9, ease: "elastic.out(1, 0.35)", overwrite: true });
    };

    const onMove = (e: PointerEvent) => {
      if (!shown) {
        shown = true;
        gsap.set(ring, { x: e.clientX, y: e.clientY });
        gsap.to(ring, { opacity: 1, duration: 0.3 });
      }
      xTo(e.clientX);
      yTo(e.clientY);

      const target = e.target as Element | null;
      const m = target?.closest<HTMLElement>("[data-magnetic]") ?? null;
      if (m !== magnet) {
        if (magnet) release(magnet);
        magnet = m;
      }
      if (magnet) {
        let q = magnets.get(magnet);
        if (!q) {
          q = {
            x: gsap.quickTo(magnet, "x", { duration: 0.5, ease: "power3.out" }),
            y: gsap.quickTo(magnet, "y", { duration: 0.5, ease: "power3.out" }),
          };
          magnets.set(magnet, q);
        }
        const r = magnet.getBoundingClientRect();
        q.x((e.clientX - (r.left + r.width / 2)) * 0.35);
        q.y((e.clientY - (r.top + r.height / 2)) * 0.35);
      }

      const interactive = target?.closest<HTMLElement>(INTERACTIVE);
      const label = interactive?.dataset.cursor ?? "";
      const state = interactive ? `on:${label}` : "";
      if (state !== hover) {
        hover = state;
        if (labelRef.current) labelRef.current.textContent = label;
        gsap.to(ring, {
          scale: label ? 2.1 : interactive ? 1.55 : 1,
          backgroundColor: label ? "#ffffff" : "rgba(255,255,255,0)",
          duration: 0.4,
          ease: "back.out(2)",
        });
        if (labelRef.current) gsap.to(labelRef.current, { color: label ? "#000" : "#fff", duration: 0.2 });
      }
    };

    const onLeave = () => {
      shown = false;
      gsap.to(ring, { opacity: 0, duration: 0.3 });
      if (magnet) release(magnet);
      magnet = null;
    };
    const onDown = () => gsap.to(ring, { scale: "*=0.82", duration: 0.15 });
    const onUp = () => gsap.to(ring, { scale: hover.startsWith("on:") ? (hover.length > 3 ? 2.1 : 1.55) : 1, duration: 0.4, ease: "back.out(2)" });

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      if (magnet) gsap.set(magnet, { x: 0, y: 0 });
    };
  }, [enabled]);

  if (!enabled) return null;
  return (
    <div ref={ringRef} className="cursor-ring" aria-hidden>
      <span ref={labelRef} />
    </div>
  );
}
