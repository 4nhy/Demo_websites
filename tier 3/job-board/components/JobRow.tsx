import Link from "next/link";
import type { Job } from "@/lib/jobs";

const CATEGORY_COLOR: Record<string, string> = {
  Engineering: "text-red",
  Design: "text-blue",
  Marketing: "text-red",
  Operations: "text-blue",
  Internships: "text-red",
};

function daysSince(iso: string): number {
  return Math.max(
    0,
    Math.round((Date.now() - new Date(iso).getTime()) / 86_400_000)
  );
}

function timeAgo(iso: string): string {
  const days = daysSince(iso);
  if (days === 0) return "Today";
  if (days === 1) return "1 day ago";
  if (days < 30) return `${days} days ago`;
  const months = Math.round(days / 30);
  return `${months} mo ago`;
}

// Deterministic (not random per-render) so a given job always reads as
// "featured" or not, regardless of how it's sorted/filtered — a stable
// hash of the slug rather than a stored field, purely for list variety.
function isFeatured(slug: string): boolean {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    hash = (hash * 31 + slug.charCodeAt(i)) % 997;
  }
  return hash % 5 === 0;
}

export default function JobRow({ job, index }: { job: Job; index: number }) {
  const initials = job.company
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const featured = isFeatured(job.slug);
  const urgent = daysSince(job.postedAt) <= 1;

  return (
    <Link
      href={`/jobs/${job.slug}`}
      data-job-row
      className={`group grid grid-cols-1 items-center gap-3 border-b border-l-2 py-6 pl-4 transition-colors hover:bg-surface lg:grid-cols-[3rem_3rem_1fr_auto_auto] lg:gap-6 lg:-mx-2 lg:px-2 lg:pl-6 ${
        featured
          ? "border-l-red border-b-line bg-surface/60"
          : "border-l-transparent border-b-line"
      }`}
    >
      <span className="hidden font-mono text-xs font-medium text-ink/60 lg:block">
        {String(index + 1).padStart(2, "0")}
      </span>
      <span
        aria-hidden="true"
        className={`flex h-10 w-10 items-center justify-center font-mono text-xs font-medium text-paper ${
          featured ? "bg-red" : "bg-ink"
        }`}
      >
        {initials}
      </span>
      <span>
        <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="font-sans text-lg font-bold text-ink group-hover:text-red">
            {job.title}
          </span>
          {featured && (
            <span className="font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-red">
              ● Featured
            </span>
          )}
          {!featured && urgent && (
            <span className="font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-blue">
              ● New
            </span>
          )}
        </span>
        <span className="block font-mono text-xs font-medium uppercase tracking-[0.05em] text-ink/60">
          {job.company} · {job.remote ? "Remote" : job.location}
        </span>
      </span>
      <span className="flex flex-wrap gap-x-3 gap-y-1 font-mono text-xs font-medium uppercase tracking-[0.05em]">
        <span className={CATEGORY_COLOR[job.category] ?? "text-ink"}>
          {job.category}
        </span>
        <span className="text-ink/60">{job.type}</span>
        <span className="text-ink/60">{job.level}</span>
      </span>
      <span className="font-mono text-xs font-medium text-ink/60">
        {timeAgo(job.postedAt)}
      </span>
    </Link>
  );
}
