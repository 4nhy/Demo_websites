import { gsap, ScrollTrigger, SplitText } from "@/lib/gsap";

/**
 * Three motion tiers, mutually exclusive:
 *  - full:   tablet+ with motion allowed — pins, scrubbed timelines, 3D scene
 *  - lite:   below tablet with motion allowed — no pins, play-once reveals
 *  - reduce: prefers-reduced-motion — everything static, final state
 */
export const MQ = {
  full: "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
  lite: "(max-width: 767.98px) and (prefers-reduced-motion: no-preference)",
  reduce: "(prefers-reduced-motion: reduce)",
};

export type MotionConditions = { full: boolean; lite: boolean; reduce: boolean };

export function fontsReady(): Promise<unknown> {
  if (typeof document === "undefined" || !document.fonts) return Promise.resolve();
  return document.fonts.ready;
}

let refreshQueued = false;
/** Coalesces refreshes from many chapters mounting in the same frame. */
export function scheduleRefresh() {
  if (refreshQueued) return;
  refreshQueued = true;
  requestAnimationFrame(() => {
    refreshQueued = false;
    ScrollTrigger.refresh();
  });
}

const num = (v: string | undefined, d: number) => (v === undefined || v === "" ? d : parseFloat(v));

/**
 * Reads `data-anim` / `data-count` declarations inside `root` and adds them to a
 * timeline whose total duration is normalised to 1, so `data-at` / `data-dur`
 * are fractions of the chapter. Each variant has its own transform and easing
 * character on purpose — no two sections should move the same way.
 */
export function addAnimations(tl: gsap.core.Timeline, root: HTMLElement) {
  const own = (el: Element) => el.closest("[data-chapter]") === root;

  root.querySelectorAll<HTMLElement>("[data-anim]").forEach((el) => {
    if (!own(el)) return;
    const kind = el.dataset.anim!;
    const at = num(el.dataset.at, 0);
    const dur = num(el.dataset.dur, 0.35);
    const ease = el.dataset.ease;

    switch (kind) {
      case "chars-rise": {
        const s = SplitText.create(el, { type: "lines,chars", mask: "lines", linesClass: "split-line" });
        tl.from(s.chars, {
          yPercent: 115, rotateX: -70, transformPerspective: 600, transformOrigin: "50% 100%",
          ease: ease ?? "expo.out", duration: dur * 0.55, stagger: { amount: dur * 0.45 },
        }, at);
        break;
      }
      case "chars-drop": {
        const s = SplitText.create(el, { type: "lines,chars", mask: "lines", linesClass: "split-line" });
        tl.from(s.chars, {
          yPercent: -130, ease: ease ?? "back.out(1.8)", duration: dur * 0.5,
          stagger: { amount: dur * 0.5, from: "center" },
        }, at);
        break;
      }
      case "lines-mask": {
        const s = SplitText.create(el, { type: "lines", mask: "lines", linesClass: "split-line" });
        tl.from(s.lines, {
          yPercent: 105, ease: ease ?? "power4.inOut", duration: dur * 0.7, stagger: dur * 0.3 / Math.max(1, s.lines.length - 1),
        }, at);
        break;
      }
      case "words-scatter": {
        const s = SplitText.create(el, { type: "words" });
        tl.from(s.words, {
          x: () => gsap.utils.random(-160, 160), y: () => gsap.utils.random(-90, 90),
          rotate: () => gsap.utils.random(-28, 28), opacity: 0,
          ease: ease ?? "back.out(1.6)", duration: dur * 0.6, stagger: { amount: dur * 0.4, from: "random" },
        }, at);
        break;
      }
      case "blur-in":
        tl.from(el, { filter: "blur(18px)", opacity: 0, letterSpacing: "0.14em", ease: ease ?? "sine.inOut", duration: dur }, at);
        break;
      case "clip-left":
        tl.fromTo(el, { clipPath: "inset(0% 100% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", ease: ease ?? "expo.inOut", duration: dur }, at);
        break;
      case "clip-up":
        tl.fromTo(el, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", ease: ease ?? "power3.inOut", duration: dur }, at);
        break;
      case "fade-up":
        tl.from(el, { y: 40, opacity: 0, ease: ease ?? "power2.out", duration: dur }, at);
        break;
      case "skew-in":
        tl.from(el, { x: -110, skewX: 14, opacity: 0, ease: ease ?? "power3.out", duration: dur }, at);
        break;
      case "scale-in":
        tl.from(el, { scale: 0.55, opacity: 0, transformOrigin: "50% 60%", ease: ease ?? "expo.out", duration: dur }, at);
        break;
      case "stagger-up":
        tl.from(el.children, {
          y: 60, opacity: 0, ease: ease ?? "power3.out", duration: dur * 0.6, stagger: dur * 0.4 / Math.max(1, el.children.length - 1),
        }, at);
        break;
      case "stagger-left":
        tl.from(el.children, {
          x: 90, skewX: -6, opacity: 0, ease: ease ?? "power2.out", duration: dur * 0.6, stagger: dur * 0.4 / Math.max(1, el.children.length - 1),
        }, at);
        break;
      case "steps": {
        // items switch on one at a time at listed positions (exploded-view callouts)
        const marks = (el.dataset.marks ?? "").split(",").map(Number);
        Array.from(el.children).forEach((child, i) => {
          tl.fromTo(child, { opacity: 0.18, x: 0 }, { opacity: 1, x: 0, ease: "steps(1)", duration: 0.01 }, marks[i] ?? at);
          const line = child.querySelector("[data-step-line]");
          if (line) tl.from(line, { scaleX: 0, transformOrigin: "0% 50%", ease: "expo.out", duration: 0.06 }, marks[i] ?? at);
        });
        break;
      }
      case "bar":
        tl.fromTo(el, { scaleX: 0 }, { scaleX: 1, transformOrigin: "0% 50%", ease: ease ?? "expo.inOut", duration: dur }, at);
        break;
      case "bar-y":
        tl.fromTo(el, { scaleY: 0 }, { scaleY: 1, transformOrigin: "50% 100%", ease: ease ?? "power3.out", duration: dur }, at);
        break;
      case "draw": {
        const paths = el.matches("path, line, polyline, circle") ? [el] : Array.from(el.querySelectorAll<SVGGeometryElement>("[data-draw]"));
        paths.forEach((p, i) => {
          const len = (p as unknown as SVGGeometryElement).getTotalLength();
          gsap.set(p, { strokeDasharray: len });
          tl.fromTo(p, { strokeDashoffset: len }, { strokeDashoffset: 0, ease: ease ?? "power1.inOut", duration: dur }, at + i * 0.04);
        });
        break;
      }
      case "roll": {
        // odometer: n stacked rows, one roll per listed position
        const n = el.children.length;
        const marks = (el.dataset.marks ?? "").split(",").map(Number);
        marks.forEach((m, i) => {
          tl.to(el, { yPercent: (-100 * (i + 1)) / n, ease: ease ?? "power3.inOut", duration: dur }, m);
        });
        break;
      }
      case "hscroll":
        // only meaningful while pinned; below tablet the panels stack vertically
        if (!window.matchMedia(MQ.full).matches || document.documentElement.dataset.scene !== "3d") break;
        tl.fromTo(el, { x: 0 }, {
          x: () => -(el.scrollWidth - (el.parentElement?.clientWidth ?? window.innerWidth)),
          ease: "none", duration: dur,
        }, at);
        break;
      case "rise-tilt":
        tl.from(el, { y: 160, rotateX: 35, transformPerspective: 1200, transformOrigin: "50% 100%", opacity: 0, ease: ease ?? "circ.out", duration: dur }, at);
        break;
      case "flatten":
        // noise bars collapsing to a flat line — ANC
        tl.to(el.children, {
          scaleY: 0.04, ease: ease ?? "circ.inOut", duration: dur * 0.7, stagger: { amount: dur * 0.3, from: "edges" },
        }, at);
        break;
    }

    if (el.dataset.out !== undefined) {
      tl.to(el, { opacity: 0, y: -50, ease: "power2.in", duration: 0.12 }, num(el.dataset.out, 0.9));
    }
  });

  root.querySelectorAll<HTMLElement>("[data-count]").forEach((el) => {
    if (!own(el)) return;
    const to = num(el.dataset.count, 0);
    const from = num(el.dataset.from, 0);
    const decimals = num(el.dataset.decimals, 0);
    const o = { v: from };
    const write = () => {
      el.textContent = o.v.toFixed(decimals);
    };
    tl.fromTo(o, { v: from }, {
      v: to, ease: el.dataset.ease ?? "power2.out", duration: num(el.dataset.dur, 0.4), onUpdate: write, onStart: write,
    }, num(el.dataset.at, 0));
    write();
  });
}
