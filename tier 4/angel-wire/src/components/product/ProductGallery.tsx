"use client";

import { useState } from "react";
import type { ProductImage } from "@/lib/types";
import AssetImage from "./AssetImage";

export default function ProductGallery({ images }: { images: ProductImage[] }) {
  const [active, setActive] = useState(0);
  const current = images[active] ?? images[0];

  if (!current) return null;

  return (
    <div className="flex flex-col-reverse gap-4 sm:flex-row">
      {images.length > 1 && (
        <div className="no-scrollbar flex gap-2 overflow-x-auto sm:flex-col sm:overflow-visible">
          {images.map((image, i) => (
            <button
              key={image.id}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show image: ${image.alt}`}
              aria-pressed={i === active}
              className={`h-16 w-16 shrink-0 overflow-hidden border transition-colors ${
                i === active ? "border-grape-ink" : "border-grape-ink/15 hover:border-grape-ink/40"
              }`}
            >
              <AssetImage image={image} />
            </button>
          ))}
        </div>
      )}
      <div key={current.id} className="animate-fade-in flex-1">
        <AssetImage image={current} priority />
      </div>
    </div>
  );
}
