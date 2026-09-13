import { useSyncExternalStore } from "react";

// Shared motion vocabulary — per DIRECTION.md, no default ease-in-out anywhere.
export const EASE = {
  reveal: "power3.out",
  bounce: "back.out(1.7)",
  choreo: "expo.inOut",
  exit: "power2.in",
} as const;

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// React-safe (no effect+setState cascade) subscription to the reduced-
// motion preference, for components that need to pick a render branch
// (e.g. mount a WebGL canvas or not) rather than just skip a tween.
// Server/first-paint snapshot is `true` (reduced) — the conservative,
// no-canvas render — so a reduced-motion user never mounts the canvas
// even for a frame; useSyncExternalStore auto-corrects with one
// post-hydration re-render if the real client value differs.
function subscribe(callback: () => void) {
  const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => true
  );
}
