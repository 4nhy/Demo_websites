"use client";

import { useState } from "react";
import ColorwayPicker from "@/components/scene/ColorwayPicker";
import DragSurface from "@/components/scene/DragSurface";
import Still from "@/components/scene/Still";
import { COLORWAYS, PRICE } from "@/lib/specs";

export default function BuyConfigurator() {
  const [color, setColor] = useState(0);
  const [added, setAdded] = useState(false);
  const c = COLORWAYS[color];

  return (
    <div className="mx-auto grid min-h-svh w-full max-w-[1600px] items-center gap-10 px-4 pt-28 pb-16 sm:px-8 md:grid-cols-12 lg:px-10">
      <div className="relative md:col-span-6 md:h-[70vh]">
        <DragSurface className="absolute inset-0" label={`Rotate Drift One in ${c.name}`} />
        <Still src={`/renders/${c.id}.png`} alt={`Drift One in ${c.name}`} priority className="aspect-square md:aspect-auto md:h-full" />
      </div>

      <div className="md:col-span-5 md:col-start-8">
        <p className="t-eyebrow text-copper" data-anim="fade-up">Drift One</p>
        <h1 className="t-display mt-4" data-anim="chars-rise" data-dur="0.4">
          ${PRICE}
        </h1>
        <p className="t-lede mt-6 text-ionosphere/75" data-anim="fade-up" data-at="0.2">
          Wireless over-ear headphones with 42 dB adaptive ANC, a 40 mm LCP driver and 40 hours on a charge.
        </p>

        <div className="mt-10 border-t border-ionosphere/15 pt-8" data-anim="fade-up" data-at="0.3">
          <div className="flex items-baseline justify-between gap-4">
            <p className="t-eyebrow text-ionosphere/60">Colorway</p>
            <p className="font-mono text-xs text-ionosphere/60">{c.finish}</p>
          </div>
          <div className="mt-5">
            <ColorwayPicker value={color} onChange={(i) => { setColor(i); setAdded(false); }} />
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4" data-anim="fade-up" data-at="0.4">
          <button
            type="button"
            data-magnetic
            onClick={() => setAdded(true)}
            className="rounded-full bg-ionosphere px-9 py-5 font-mono text-xs tracking-[0.16em] text-signal uppercase transition-colors hover:bg-copper"
          >
            Add Drift One in {c.name} to bag — ${PRICE}
          </button>
          <p role="status" aria-live="polite" className="min-h-5 text-sm text-ionosphere/70">
            {added ? `Added in ${c.name}. This is a demo store, so no order is placed.` : ""}
          </p>
          <ul className="grid grid-cols-3 gap-4 border-t border-ionosphere/15 pt-6 font-mono text-[11px] leading-relaxed tracking-[0.06em] text-ionosphere/65 uppercase">
            <li>Free 2-day shipping</li>
            <li>30-day returns</li>
            <li>2-year warranty</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
