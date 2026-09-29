import type { Metadata } from "next";
import JobsView from "@/components/jobs/JobsView";
import {
  getAllJobs,
  getCategories,
  getLocations,
  getTypes,
  getLevels,
} from "@/lib/jobs";

export const metadata: Metadata = {
  title: "All open roles",
  description:
    "Every open role on The Roster, filterable by category, location, type, and level.",
};

export default async function JobsPage({
  searchParams,
}: PageProps<"/jobs">) {
  const params = await searchParams;
  const categoryParam =
    typeof params.category === "string" ? params.category : undefined;

  const jobs = getAllJobs();
  const categories = getCategories();
  const companyCount = new Set(jobs.map((j) => j.company)).size;

  return (
    <main className="flex-1 pb-24">
      <div className="border-b border-line px-6 py-16 md:px-12 md:py-24">
        <div className="mx-auto max-w-[1440px]">
          <p className="font-mono text-xs font-medium uppercase tracking-[0.08em] text-ink/60">
            The Roster
          </p>
          <h1 className="mt-4 max-w-[20ch] font-sans text-5xl font-black leading-[0.98] tracking-[-0.02em] text-ink md:text-7xl">
            All open roles.
          </h1>
          <div className="mt-6 flex flex-wrap items-end justify-between gap-6">
            <p className="max-w-[54ch] font-sans text-lg leading-snug text-ink/70 md:text-xl">
              Every verified opening on the board, filterable by category,
              location, type, and level — no dead listings, no recruiter
              reposts.
            </p>
            <p className="font-mono text-xs font-medium uppercase tracking-[0.08em] text-ink/60">
              <span className="text-2xl font-medium tabular-nums text-ink">
                {jobs.length}
              </span>{" "}
              roles · {categories.length} categories · {companyCount}{" "}
              companies
            </p>
          </div>
        </div>
      </div>
      <JobsView
        jobs={jobs}
        categories={categories}
        locations={getLocations()}
        types={getTypes()}
        levels={getLevels()}
        initialCategory={categoryParam}
      />
    </main>
  );
}
