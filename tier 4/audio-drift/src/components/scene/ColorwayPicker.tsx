"use client";

import { useEffect, useState } from "react";
import { COLORWAYS } from "@/lib/specs";
import { sceneState } from "@/lib/scene-store";

/**
 * Drives the live model's colour directly (sceneState.colorOverride) and
 * reports the choice up for stills / copy. Released on unmount so the next
 * page's scroll poses own the colour again.
 */
export default function ColorwayPicker({
  value,
  onChange,
  tone = "dark",
  size = "lg",
}: {
  value: number;
  onChange: (i: number) => void;
  tone?: "dark" | "light";
  size?: "lg" | "sm";
}) {
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (touched) sceneState.colorOverride = value;
  }, [value, touched]);

  useEffect(
    () => () => {
      sceneState.colorOverride = null;
    },
    [],
  );

  const ring = tone === "dark" ? "ring-ionosphere" : "ring-signal";
  return (
    <div role="group" aria-label="Colorway" className="flex flex-wrap gap-x-6 gap-y-4">
      {COLORWAYS.map((c, i) => {
        const active = i === value;
        return (
          <button
            key={c.id}
            type="button"
            aria-pressed={active}
            onClick={() => {
              setTouched(true);
              onChange(i);
            }}
            className="group flex items-center gap-3"
          >
            <span
              className={`block rounded-full ring-offset-2 ring-offset-transparent transition-all duration-500 ${size === "lg" ? "h-9 w-9" : "h-6 w-6"} ${active ? `ring-2 ${ring} scale-110` : "ring-0 group-hover:scale-105"}`}
              style={{ background: c.swatch }}
            />
            <span className={`font-mono text-xs tracking-[0.14em] uppercase transition-opacity ${active ? "opacity-100" : "opacity-55 group-hover:opacity-90"}`}>
              {c.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}
