import { gsap } from "@/lib/gsap";

/**
 * Shared, render-free state between the DOM chapters and the persistent 3D
 * scene. Chapters register pose keyframes against their own ScrollTrigger;
 * the scene samples the pose for the current scroll position every frame.
 * Nothing here triggers React renders — the canvas reads it in useFrame.
 *
 * Units: x/y are fractions of the viewport half-width/half-height, s is a
 * multiple of "fills ~60% of the viewport height", rotations are radians,
 * fx/fy/fz is the point on the model (model space) pinned to (x, y).
 */
export type Pose = {
  x: number;
  y: number;
  s: number;
  rx: number;
  ry: number;
  rz: number;
  fx: number;
  fy: number;
  fz: number;
  explode: number;
  fold: number;
  slide: number;
  anc: number;
  color: number;
  vis: number;
};

export const POSE_KEYS = [
  "x", "y", "s", "rx", "ry", "rz", "fx", "fy", "fz",
  "explode", "fold", "slide", "anc", "color", "vis",
] as const;

export const DEFAULT_POSE: Pose = {
  x: 0, y: 0, s: 1, rx: 0.12, ry: -0.5, rz: 0, fx: 0, fy: 0, fz: 0,
  explode: 0, fold: 0, slide: 0, anc: 0, color: 0, vis: 0,
};

export type PoseKey = { t: number; pose: Partial<Pose>; ease?: string };

type Registered = { st: ScrollTrigger; keys: PoseKey[] };

const chapters = new Set<Registered>();

export const sceneState = {
  /** current page backdrop colour, mirrored into the canvas clear colour */
  backdrop: "#e8edf2",
  /** colorway index forced by a picker (buy / product studio); null = follow scroll */
  colorOverride: null as number | null,
  /** drag-to-orbit offsets, written by DragSurface while it is in view */
  drag: { x: 0, y: 0 },
  /** a fixed pose, used by the /studio still renderer */
  forced: null as Pose | null,
};

export function registerChapter(st: ScrollTrigger, keys: PoseKey[]) {
  const entry = { st, keys };
  chapters.add(entry);
  return () => {
    chapters.delete(entry);
  };
}

export type Tone = "dark" | "light";
export type BackdropEntry = { el: HTMLElement; st: ScrollTrigger; bg: string[]; tone: Tone | Tone[] };

/** page background colour + header tone, owned by whichever chapter holds the viewport centre */
export const backdrops = new Set<BackdropEntry>();

export function registerBackdrop(entry: BackdropEntry) {
  backdrops.add(entry);
  return () => {
    backdrops.delete(entry);
  };
}

type AbsKey ={ at: number; pose: Pose; ease: (p: number) => number };

const easeCache = new Map<string, (p: number) => number>();
function easeFn(name = "power2.inOut") {
  let fn = easeCache.get(name);
  if (!fn) {
    fn = gsap.parseEase(name) as (p: number) => number;
    easeCache.set(name, fn);
  }
  return fn;
}

export function samplePose(scrollY: number, out: Pose): Pose {
  if (sceneState.forced) return Object.assign(out, sceneState.forced);

  const sorted = [...chapters].sort((a, b) => a.st.start - b.st.start);
  const abs: AbsKey[] = [];
  let prev: Pose = { ...DEFAULT_POSE };
  for (const ch of sorted) {
    const { start, end } = ch.st;
    for (const k of ch.keys) {
      prev = { ...prev, ...k.pose };
      abs.push({ at: start + k.t * (end - start), pose: prev, ease: easeFn(k.ease) });
    }
  }

  if (abs.length === 0) return Object.assign(out, DEFAULT_POSE);
  if (scrollY <= abs[0].at) return Object.assign(out, abs[0].pose);
  const last = abs[abs.length - 1];
  if (scrollY >= last.at) return Object.assign(out, last.pose);

  let i = 1;
  while (i < abs.length && abs[i].at < scrollY) i++;
  const a = abs[i - 1];
  const b = abs[i];
  const span = b.at - a.at;
  const p = span <= 0 ? 1 : b.ease((scrollY - a.at) / span);
  for (const k of POSE_KEYS) out[k] = a.pose[k] + (b.pose[k] - a.pose[k]) * p;
  return out;
}
