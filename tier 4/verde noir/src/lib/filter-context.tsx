"use client";

import { createContext, useContext, useState } from "react";
import type { Category } from "./products";

type FilterContextValue = {
  active: Category | null;
  toggle: (c: Category) => void;
  clear: () => void;
};

const FilterContext = createContext<FilterContextValue | null>(null);

export function FilterProvider({ children }: { children: React.ReactNode }) {
  const [active, setActive] = useState<Category | null>(null);

  const value: FilterContextValue = {
    active,
    toggle: (c) => setActive((prev) => (prev === c ? null : c)),
    clear: () => setActive(null),
  };

  return <FilterContext.Provider value={value}>{children}</FilterContext.Provider>;
}

export function useFilter() {
  const ctx = useContext(FilterContext);
  if (!ctx) throw new Error("useFilter must be used within FilterProvider");
  return ctx;
}
