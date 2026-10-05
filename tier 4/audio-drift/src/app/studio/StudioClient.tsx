"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import { DEFAULT_POSE, sceneState, type Pose } from "@/lib/scene-store";

const SceneCanvas = dynamic(() => import("@/components/scene/SceneCanvas"), { ssr: false });

const base = { ...DEFAULT_POSE, vis: 0, x: 0, y: -0.02, s: 1.25, rx: 0.16, ry: -0.5 };

/** poses for the static renders in /public/renders (see scripts/render-stills.mjs) */
export const SHOTS: Record<string, Partial<Pose>> = {
  slate: { color: 0 },
  glacier: { color: 1 },
  rosewood: { color: 2 },
  graphite: { color: 3 },
  hinge: { ry: 0.15, rx: 0.4, fold: 1, s: 1.2 },
  exploded: { ry: -0.42, rx: 0.2, explode: 1, s: 0.9, y: -0.06 },
  anc: { ry: 4.5, rx: 0.05, anc: 1, s: 1.0 },
  closeup: { fx: 1, fy: -0.62, s: 2.7, ry: 0.9, rx: 0.12 },
  driver: { fx: 1, fy: -0.62, s: 2.2, ry: 2.25, rx: 0.1, explode: 0.5, color: 1 },
};

export default function StudioClient({ shot }: { shot: string }) {
  useEffect(() => {
    const root = document.documentElement;
    root.dataset.studio = "1";
    sceneState.forced = { ...base, ...(SHOTS[shot] ?? {}) };
    return () => {
      delete root.dataset.studio;
      sceneState.forced = null;
    };
  }, [shot]);

  return (
    <div id="studio" className="fixed top-0 left-0 z-[60] h-[1200px] w-[1200px]">
      <SceneCanvas studio />
    </div>
  );
}
