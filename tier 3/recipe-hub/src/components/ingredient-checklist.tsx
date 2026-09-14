"use client";

import { useState } from "react";

/** Tappable ingredient list — check items off while you cook. Local-only,
 * resets on reload; no account, no backend, per the brief's constraints. */
export default function IngredientChecklist({
  ingredients,
}: {
  ingredients: string[];
}) {
  const [checked, setChecked] = useState<boolean[]>(
    () => new Array(ingredients.length).fill(false)
  );

  function toggle(i: number) {
    setChecked((prev) => prev.map((v, idx) => (idx === i ? !v : v)));
  }

  return (
    <ul className="flex flex-col divide-y divide-line">
      {ingredients.map((ingredient, i) => (
        <li key={ingredient}>
          <button
            type="button"
            onClick={() => toggle(i)}
            aria-pressed={checked[i]}
            className="flex w-full items-start gap-3 py-2.5 text-left"
          >
            <span
              aria-hidden
              className={`mt-0.5 flex size-4.5 shrink-0 items-center justify-center rounded-full border ${
                checked[i]
                  ? "border-terracotta bg-terracotta"
                  : "border-line bg-paper"
              }`}
            >
              {checked[i] && (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--terracotta-ink)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="size-3"
                >
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              )}
            </span>
            <span
              className={`text-sm ${
                checked[i] ? "text-muted line-through" : "text-ink"
              }`}
            >
              {ingredient}
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}
