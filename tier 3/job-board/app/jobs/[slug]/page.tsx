import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import JobRow from "@/components/JobRow";
import { getAllJobs, getJobBySlug, getRelatedJobs } from "@/lib/jobs";
import { photoUrl } from "@/lib/photos";

export function generateStaticParams() {
  return getAllJobs().map((job) => ({ slug: job.slug }));
}

// Dynamic per-listing metadata (text only — a bespoke OG image per job
// would need its own ImageResponse route; the site-default at
// app/opengraph-image.tsx covers sharing in the meantime).
export async function generateMetadata(
  props: PageProps<"/jobs/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const job = getJobBySlug(slug);
  if (!job) return { title: "Role not found" };

  const title = `${job.title} at ${job.company}`;
  return {
    title,
    description: job.dek,
    openGraph: { title, description: job.dek, type: "article" },
    twitter: { title, description: job.dek },
  };
}

export default async function JobDetailPage(props: PageProps<"/jobs/[slug]">) {
  const { slug } = await props.params;
  const job = getJobBySlug(slug);

  if (!job) {
    notFound();
  }

  const related = getRelatedJobs(job, 3);

  return (
    <main className="flex-1">
      <div className="border-b border-line px-6 pb-10 pt-8 md:px-12">
        <div className="mx-auto max-w-[1440px]">
          <Link
            href="/jobs"
            className="font-mono text-xs font-medium uppercase tracking-[0.08em] text-ink transition-colors hover:text-red"
          >
            ← All roles
          </Link>
        </div>
      </div>

      <div className="border-b border-line px-6 py-12 md:px-12 md:py-16">
        <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-10 md:grid-cols-12">
          <div className="md:col-span-7">
            <p className="font-mono text-xs font-medium uppercase tracking-[0.08em] text-ink/60">
              {job.category}
            </p>
            <h1 className="mt-3 font-sans text-4xl font-black leading-[0.98] tracking-[-0.02em] text-ink md:text-6xl">
              {job.title}
            </h1>
            <p className="mt-4 font-sans text-lg text-ink/70">
              {job.company} · {job.remote ? "Remote" : job.location} ·{" "}
              {job.type} · {job.level}
            </p>
            <p className="mt-8 max-w-[65ch] font-sans text-xl leading-snug text-ink">
              {job.dek}
            </p>

            <div className="mt-10 max-w-[68ch] space-y-5 font-sans text-base leading-relaxed text-ink/80">
              {job.description.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>

            <h2 className="mt-12 font-sans text-xl font-bold text-ink">
              What you&apos;ll need
            </h2>
            <ul className="mt-4 max-w-[68ch] list-none space-y-3 border-t border-line pt-4 font-sans text-base text-ink/80">
              {job.requirements.map((req, i) => (
                <li key={i} className="border-b border-line pb-3">
                  {req}
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-5">
            <div className="sticky top-24">
              <div className="relative aspect-[4/5] w-full overflow-hidden">
                <Image
                  src={photoUrl(job.photoId)}
                  alt=""
                  fill
                  unoptimized
                  sizes="(min-width: 768px) 35vw, 100vw"
                  className="photo-grade object-cover"
                />
              </div>
              <a
                href={`mailto:hello@theroster.example?subject=${encodeURIComponent(
                  `Application: ${job.title} at ${job.company}`
                )}`}
                className="mt-6 flex w-full items-center justify-center gap-2 bg-red px-7 py-4 font-sans text-sm font-bold text-paper transition-colors hover:bg-ink"
              >
                Apply for this role →
              </a>
              <p className="mt-3 font-mono text-xs uppercase tracking-[0.05em] text-ink/60">
                Posted {new Date(job.postedAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div className="px-6 py-16 md:px-12 md:py-20">
          <div className="mx-auto max-w-[1440px]">
            <p className="font-mono text-xs font-medium uppercase tracking-[0.08em] text-ink/60">
              More in {job.category}
            </p>
            <div className="mt-8 border-t border-line">
              {related.map((r, i) => (
                <JobRow key={r.slug} job={r} index={i} />
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
