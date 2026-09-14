"use client";

import { useMemo, useState } from "react";
import type { Cuisine, Diet, Recipe, TimeBucketId } from "@/lib/types";
import { CUISINES, DIETS, TIME_BUCKETS } from "@/lib/types";
import RecipeCard from "./recipe-card";
import Reveal from "./reveal";
import { CloseIcon } from "./icons";

interface RecipeExplorerProps {
  recipes: Recipe[];
  initialCuisine?: Cuisine;
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium capitalize transition-colors ${
        active
          ? "border-terracotta bg-terracotta text-terracotta-ink"
          : "border-line bg-paper text-ink/75 hover:border-olive hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}

function toggle<T>(set: Set<T>, value: T): Set<T> {
  const next = new Set(set);
  if (next.has(value)) next.delete(value);
  else next.add(value);
  return next;
}

export default function RecipeExplorer({
  recipes,
  initialCuisine,
}: RecipeExplorerProps) {
  const [cuisines, setCuisines] = useState<Set<Cuisine>>(
    new Set(initialCuisine ? [initialCuisine] : [])
  );
  const [diets, setDiets] = useState<Set<Diet>>(new Set());
  const [time, setTime] = useState<Set<TimeBucketId>>(new Set());

  const filtered = useMemo(() => {
    return recipes.filter((recipe) => {
      const cuisineOk = cuisines.size === 0 || cuisines.has(recipe.cuisine);
      const dietOk =
        diets.size === 0 || recipe.diets.some((d) => diets.has(d));
      const timeOk =
        time.size === 0 ||
        TIME_BUCKETS.some(
          (bucket) =>
            time.has(bucket.id) &&
            recipe.totalMinutes > bucket.min &&
            recipe.totalMinutes <= bucket.max
        );
      return cuisineOk && dietOk && timeOk;
    });
  }, [recipes, cuisines, diets, time]);

  const activeCount = cuisines.size + diets.size + time.size;

  function clearAll() {
    setCuisines(new Set());
    setDiets(new Set());
    setTime(new Set());
  }

  return (
    <div>
      <div className="flex flex-col gap-4">
        <FilterRow label="Cuisine">
          {CUISINES.map((c) => (
            <Chip
              key={c}
              active={cuisines.has(c)}
              onClick={() => setCuisines((s) => toggle(s, c))}
            >
              {c}
            </Chip>
          ))}
        </FilterRow>
        <FilterRow label="Diet">
          {DIETS.map((d) => (
            <Chip
              key={d}
              active={diets.has(d)}
              onClick={() => setDiets((s) => toggle(s, d))}
            >
              {d.replace("-", " ")}
            </Chip>
          ))}
        </FilterRow>
        <FilterRow label="Time">
          {TIME_BUCKETS.map((b) => (
            <Chip
              key={b.id}
              active={time.has(b.id)}
              onClick={() => setTime((s) => toggle(s, b.id))}
            >
              {b.label}
            </Chip>
          ))}
        </FilterRow>
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-line pt-4">
        <p className="text-sm text-muted">
          {filtered.length} {filtered.length === 1 ? "recipe" : "recipes"}
        </p>
        {activeCount > 0 && (
          <button
            type="button"
            onClick={clearAll}
            className="inline-flex items-center gap-1 text-sm font-medium text-olive hover:underline"
          >
            <CloseIcon className="size-3.5" />
            Clear filters
          </button>
        )}
      </div>

      {filtered.length > 0 ? (
        <ul className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((recipe, i) => (
            <Reveal as="li" key={recipe.slug} delay={(i % 6) * 60}>
              <RecipeCard recipe={recipe} />
            </Reveal>
          ))}
        </ul>
      ) : (
        <div className="mt-6 rounded-2xl border border-dashed border-line bg-paper px-6 py-16 text-center">
          <p className="font-display text-lg font-semibold text-ink">
            No recipes match those filters.
          </p>
          <p className="mt-1 text-sm text-muted">
            Try clearing a filter — 12 recipes are waiting.
          </p>
          <button
            type="button"
            onClick={clearAll}
            className="mt-4 rounded-full border border-ink px-4 py-2 text-sm font-medium text-ink hover:bg-ink hover:text-bone"
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* Sticky bottom bar on mobile — the food-app carousel's "always-visible
          bottom dock" mechanic, repurposed as a live filter-status readout
          instead of a persona/chat icon row. */}
      {activeCount > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-paper/95 px-5 py-3 backdrop-blur md:hidden">
          <div className="flex items-center justify-between">
            <p className="text-sm text-ink/70">
              {filtered.length} match{filtered.length === 1 ? "" : "es"} ·{" "}
              {activeCount} filter{activeCount === 1 ? "" : "s"}
            </p>
            <button
              type="button"
              onClick={clearAll}
              className="text-sm font-semibold text-terracotta"
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function FilterRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <span className="w-16 shrink-0 text-xs font-semibold tracking-wide text-olive uppercase">
        {label}
      </span>
      <div className="flex gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible">
        {children}
      </div>
    </div>
  );
}
