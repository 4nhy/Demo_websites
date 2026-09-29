"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import JobRow from "@/components/JobRow";
import type { Job, JobCategory, JobLevel, JobType } from "@/lib/jobs";

gsap.registerPlugin(ScrollTrigger);

type SortKey = "newest" | "oldest" | "company";

const ALL = "All" as const;

const CATEGORY_ACCENT: Record<string, string> = {
  Engineering: "text-red",
  Design: "text-blue",
  Marketing: "text-red",
  Operations: "text-blue",
  Internships: "text-red",
};

function FilterSelect({
  label,
  value,
  onChange,
  children,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  children: ReactNode;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={label}
        className="w-full appearance-none border border-line bg-paper px-3 py-2.5 pr-8 font-mono text-xs font-medium uppercase tracking-[0.05em] text-ink transition-colors hover:border-ink focus-visible:border-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
      >
        {children}
      </select>
      <svg
        aria-hidden="true"
        viewBox="0 0 12 8"
        className="pointer-events-none absolute right-3 top-1/2 h-2 w-3 -translate-y-1/2 fill-none stroke-ink"
      >
        <path d="M1 1.5 6 6.5 11 1.5" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </div>
  );
}

export default function JobsView({
  jobs,
  categories,
  locations,
  types,
  levels,
  initialCategory,
}: {
  jobs: Job[];
  categories: JobCategory[];
  locations: string[];
  types: JobType[];
  levels: JobLevel[];
  initialCategory?: string;
}) {
  const validCategory =
    initialCategory && categories.includes(initialCategory as JobCategory)
      ? (initialCategory as JobCategory)
      : ALL;

  const [category, setCategory] = useState<string>(validCategory);
  const [location, setLocation] = useState<string>(ALL);
  const [type, setType] = useState<string>(ALL);
  const [level, setLevel] = useState<string>(ALL);
  const [sort, setSort] = useState<SortKey>("newest");
  const listRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    const result = jobs.filter((job) => {
      if (category !== ALL && job.category !== category) return false;
      if (location !== ALL && job.location !== location) return false;
      if (type !== ALL && job.type !== type) return false;
      if (level !== ALL && job.level !== level) return false;
      return true;
    });
    if (sort === "company") {
      result.sort((a, b) => a.company.localeCompare(b.company));
    } else if (sort === "oldest") {
      result.sort(
        (a, b) => new Date(a.postedAt).getTime() - new Date(b.postedAt).getTime()
      );
    } else {
      result.sort(
        (a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime()
      );
    }
    return result;
  }, [jobs, category, location, type, level, sort]);

  // Alternating slide-in on the job rows, re-run whenever the filtered/
  // sorted set changes — rows already in view just settle in place
  // instantly (ScrollTrigger evaluates current scroll position on
  // creation), rows further down animate in as the user scrolls to them.
  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced || !listRef.current) return;

    const ctx = gsap.context(() => {
      const rows = gsap.utils.toArray<HTMLElement>("[data-job-row]");
      rows.forEach((row, i) => {
        gsap.fromTo(
          row,
          { x: i % 2 === 0 ? -32 : 32, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.6,
            ease: "power3.out",
            scrollTrigger: {
              trigger: row,
              start: "top 92%",
              toggleActions: "play none none none",
            },
          }
        );
      });
    }, listRef);

    return () => ctx.revert();
  }, [filtered]);

  return (
    <div>
      <div className="sticky top-[89px] z-20 border-b border-line bg-paper/95 px-6 py-5 backdrop-blur md:px-12">
        <div className="mx-auto max-w-[1440px]">
          <div
            className="flex flex-wrap gap-2 pb-4"
            role="group"
            aria-label="Quick-filter by category"
          >
            <button
              type="button"
              onClick={() => setCategory(ALL)}
              className={`border px-3.5 py-1.5 font-mono text-xs font-medium uppercase tracking-[0.05em] transition-colors ${
                category === ALL
                  ? "border-ink bg-ink text-paper"
                  : "border-line text-ink hover:border-ink"
              }`}
            >
              All
            </button>
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                className={`flex items-center gap-1.5 border px-3.5 py-1.5 font-mono text-xs font-medium uppercase tracking-[0.05em] transition-colors ${
                  category === c
                    ? "border-ink bg-ink text-paper"
                    : "border-line text-ink hover:border-ink"
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`h-1.5 w-1.5 rounded-full ${
                    category === c
                      ? "bg-paper"
                      : (CATEGORY_ACCENT[c] ?? "text-ink").replace(
                          "text-",
                          "bg-"
                        )
                  }`}
                />
                {c}
              </button>
            ))}
          </div>
        </div>
        <div className="mx-auto flex max-w-[1440px] flex-col gap-4 md:flex-row md:flex-wrap md:items-center md:gap-3">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:flex md:flex-wrap md:gap-3">
            <FilterSelect label="Filter by category" value={category} onChange={setCategory}>
              <option value={ALL}>All categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </FilterSelect>
            <FilterSelect label="Filter by location" value={location} onChange={setLocation}>
              <option value={ALL}>All locations</option>
              {locations.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </FilterSelect>
            <FilterSelect label="Filter by type" value={type} onChange={setType}>
              <option value={ALL}>All types</option>
              {types.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </FilterSelect>
            <FilterSelect label="Filter by level" value={level} onChange={setLevel}>
              <option value={ALL}>All levels</option>
              {levels.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </FilterSelect>
          </div>

          <div className="flex items-center justify-between gap-3 md:ml-auto md:justify-start">
            <div className="w-36">
              <FilterSelect
                label="Sort roles"
                value={sort}
                onChange={(v) => setSort(v as SortKey)}
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="company">Company A–Z</option>
              </FilterSelect>
            </div>
            <span className="whitespace-nowrap font-mono text-xs font-medium uppercase tracking-[0.08em] text-ink/60">
              {filtered.length} {filtered.length === 1 ? "role" : "roles"}
            </span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1440px] px-6 md:px-12">
        {filtered.length === 0 ? (
          <p className="py-24 text-center font-sans text-lg text-ink/60">
            No roles match those filters.
          </p>
        ) : (
          <div ref={listRef} className="border-t border-line">
            {filtered.map((job, i) => (
              <JobRow key={job.slug} job={job} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
