import Link from "next/link";
import JobRow from "@/components/JobRow";
import type { Job } from "@/lib/jobs";

export default function FeaturedListings({ jobs }: { jobs: Job[] }) {
  return (
    <section
      id="featured"
      className="border-b border-line px-6 py-20 md:px-12 md:py-28"
    >
      <div className="mx-auto max-w-[1440px]">
        <div className="flex items-end justify-between gap-4">
          <p className="font-mono text-xs font-medium uppercase tracking-[0.08em] text-ink/60">
            03 — Recently posted
          </p>
          <Link
            href="/jobs"
            className="font-mono text-xs font-medium uppercase tracking-[0.08em] text-ink transition-colors hover:text-red"
          >
            View all →
          </Link>
        </div>
        <div className="mt-8 border-t border-line">
          {jobs.map((job, i) => (
            <JobRow key={job.slug} job={job} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
