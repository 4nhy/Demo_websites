"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { MQ } from "@/lib/motion";
import { backdrops, sceneState, type BackdropEntry, type Tone } from "@/lib/scene-store";

// The canvas, three.js and postprocessing only load when the full 3D tier is
// actually going to be used — phones, reduced-motion and no-WebGL2 never fetch them.
const SceneCanvas = dynamic(() => import("./SceneCanvas"), { ssr: false });

const DEFAULT_BG = "#e8edf2";

function hasWebGL2() {
  try {
    const c = document.createElement("canvas");
    const gl = c.getContext("webgl2");
    gl?.getExtension("WEBGL_lose_context")?.loseContext();
    return !!gl;
  } catch {
    return false;
  }
}

export default function SceneLayer() {
  const [use3d, setUse3d] = useState(false);
  const [mounted, setMounted] = useState(false);
  const backdropRef = useRef<HTMLDivElement>(null);

  // --- tier detection: tablet+, motion allowed, WebGL2 available ---
  useEffect(() => {
    const full = window.matchMedia(MQ.full);
    // the <head> script already probed WebGL2 if it chose the 3D tier
    let webgl2: boolean | null = document.documentElement.dataset.scene === "3d" ? true : null;
    const decide = () => {
      if (full.matches && webgl2 === null) webgl2 = hasWebGL2();
      const ok = full.matches && !!webgl2;
      document.documentElement.dataset.scene = ok ? "3d" : "static";
      setUse3d(ok);
    };
    decide();
    full.addEventListener("change", decide);
    const onFail = () => {
      webgl2 = false;
      decide();
    };
    window.addEventListener("drift:scene-failed", onFail);
    return () => {
      full.removeEventListener("change", decide);
      window.removeEventListener("drift:scene-failed", onFail);
    };
  }, []);

  // --- lazy mount: wait for the page to settle before paying for WebGL ---
  useEffect(() => {
    if (!use3d) return;
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number; cancelIdleCallback?: (id: number) => void };
    if (w.requestIdleCallback) {
      const id = w.requestIdleCallback(() => setMounted(true), { timeout: 1200 });
      return () => w.cancelIdleCallback?.(id);
    }
    const id = window.setTimeout(() => setMounted(true), 300);
    return () => window.clearTimeout(id);
  }, [use3d]);

  // --- backdrop + header tone: owned by the chapter holding the viewport centre ---
  useEffect(() => {
    const root = document.documentElement;
    const reduce = window.matchMedia(MQ.reduce);
    const proxy = { c: DEFAULT_BG };
    let target = DEFAULT_BG;
    let tone: Tone = "dark";
    let lastY = -1;
    let lastCount = -1;

    const write = () => {
      sceneState.backdrop = proxy.c;
      root.style.setProperty("--backdrop", proxy.c);
    };
    write();

    const pickAt = (list: string[], p: number) => {
      if (list.length === 1) return list[0];
      const f = p * (list.length - 1);
      const i = Math.min(list.length - 2, Math.floor(f));
      return gsap.utils.interpolate(list[i], list[i + 1], f - i) as string;
    };

    const tick = () => {
      const y = window.scrollY;
      if (y === lastY && backdrops.size === lastCount) return;
      lastY = y;
      lastCount = backdrops.size;

      const mid = window.innerHeight / 2;
      let found: BackdropEntry | null = null;
      for (const b of backdrops) {
        const r = b.el.getBoundingClientRect();
        if (r.top <= mid && r.bottom >= mid) {
          found = b;
          break;
        }
      }

      const p = found ? found.st.progress : 0;
      const nextBg = found ? pickAt(found.bg, p) : DEFAULT_BG;
      const tones = found ? (Array.isArray(found.tone) ? found.tone : [found.tone]) : ["dark" as Tone];
      const nextTone = tones[Math.min(tones.length - 1, Math.round(p * (tones.length - 1)))];

      if (nextTone !== tone) {
        tone = nextTone;
        root.dataset.tone = tone;
      }
      if (nextBg === target) return;
      target = nextBg;
      // gradients inside one chapter track scroll directly; chapter changes ease
      if (found && found.bg.length > 1 && gsap.isTweening(proxy) === false) {
        proxy.c = nextBg;
        write();
      } else {
        gsap.to(proxy, {
          c: nextBg,
          duration: reduce.matches ? 0 : 0.9,
          ease: "power2.inOut",
          overwrite: true,
          onUpdate: write,
        });
      }
    };

    root.dataset.tone = tone;
    gsap.ticker.add(tick);
    return () => {
      gsap.ticker.remove(tick);
    };
  }, []);

  return (
    <>
      <div
        ref={backdropRef}
        aria-hidden
        className="scene-backdrop pointer-events-none fixed inset-0 z-0"
        style={{ background: "var(--backdrop, #e8edf2)" }}
      />
      {use3d && mounted && <SceneCanvas />}
    </>
  );
}
