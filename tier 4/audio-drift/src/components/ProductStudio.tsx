"use client";

import { useState } from "react";
import Link from "next/link";
import ColorwayPicker from "@/components/scene/ColorwayPicker";
import DragSurface from "@/components/scene/DragSurface";
import Still from "@/components/scene/Still";
import { COLORWAYS, PRICE } from "@/lib/specs";

export default function ProductStudio() {
  const [color, setColor] = useState(0);
  const c = COLORWAYS[color];
  return (
    <div className="relative mx-auto flex min-h-svh w-full max-w-[1600px] flex-col justify-between gap-8 px-4 pt-28 pb-12 sm:px-8 lg:px-10">
      <div className="relative z-10 flex flex-wrap items-end justify-between gap-6">
        <h2 className="t-title" data-anim="lines-mask" data-dur="0.3">
          Turn it over yourself.
        </h2>
        <p className="scene-only t-eyebrow text-ionosphere/60">Drag the headphones · arrow keys work too</p>
      </div>

      <DragSurface className="absolute inset-x-0 top-48 bottom-56 z-0" />
      <Still src={`/renders/${c.id}.png`} alt={`Drift One in ${c.name}`} className="aspect-square md:mx-auto md:h-[52vh]" />

      <div className="relative z-10 flex flex-wrap items-end justify-between gap-8">
        <div>
          <p className="t-eyebrow text-ionosphere/60">Finish</p>
          <p className="mt-2 font-display text-3xl font-semibold">{c.name}</p>
          <p className="mt-1 max-w-xs text-sm text-ionosphere/65">{c.finish}</p>
          <div className="mt-6">
            <ColorwayPicker value={color} onChange={setColor} size="sm" />
          </div>
        </div>
        <Link
          href="/buy"
          data-magnetic
          className="rounded-full bg-ionosphere px-9 py-4 font-mono text-xs tracking-[0.16em] text-signal uppercase transition-colors hover:bg-copper"
        >
          Buy in {c.name} — ${PRICE}
        </Link>
      </div>
    </div>
  );
}
