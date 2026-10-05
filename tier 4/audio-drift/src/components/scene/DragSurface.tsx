"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { sceneState } from "@/lib/scene-store";

/**
 * Transparent pointer surface over the stage. The canvas itself never takes
 * pointer events (it sits behind the page), so dragging here writes orbit
 * offsets the scene adds on top of the scroll pose. Arrow keys do the same.
 */
export default function DragSurface({ className = "", label = "Rotate Drift One" }: { className?: string; label?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const drag = sceneState.drag;
    let down = false;
    let lastX = 0;
    let lastY = 0;
    let vx = 0;

    const clampY = (v: number) => gsap.utils.clamp(-0.45, 0.55, v);

    const onDown = (e: PointerEvent) => {
      down = true;
      lastX = e.clientX;
      lastY = e.clientY;
      vx = 0;
      gsap.killTweensOf(drag);
      el.setPointerCapture(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (!down) return;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;
      vx = dx * 0.009;
      drag.x += vx;
      drag.y = clampY(drag.y + dy * 0.005);
    };
    const onUp = () => {
      if (!down) return;
      down = false;
      // throw: carry the release velocity, then settle
      gsap.to(drag, { x: drag.x + vx * 18, duration: 1.4, ease: "power3.out" });
    };
    const onKey = (e: KeyboardEvent) => {
      const step = { ArrowLeft: [-0.35, 0], ArrowRight: [0.35, 0], ArrowUp: [0, -0.15], ArrowDown: [0, 0.15] }[e.key];
      if (!step) return;
      e.preventDefault();
      gsap.to(drag, { x: drag.x + step[0], y: clampY(drag.y + step[1]), duration: 0.6, ease: "power2.out" });
    };

    // hand the pose back to scroll once the surface leaves the viewport
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) gsap.to(drag, { x: 0, y: 0, duration: 1.2, ease: "power2.inOut" });
    });
    io.observe(el);

    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);
    el.addEventListener("keydown", onKey);
    return () => {
      io.disconnect();
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
      el.removeEventListener("keydown", onKey);
      gsap.killTweensOf(drag);
      drag.x = 0;
      drag.y = 0;
    };
  }, []);

  return (
    <div
      ref={ref}
      role="application"
      tabIndex={0}
      aria-label={`${label}. Drag, or use the arrow keys.`}
      data-cursor="drag"
      className={`scene-only touch-pan-y cursor-grab select-none active:cursor-grabbing ${className}`}
    />
  );
}
