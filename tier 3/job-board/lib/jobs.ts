import "server-only";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

export type JobCategory =
  | "Engineering"
  | "Design"
  | "Marketing"
  | "Operations"
  | "Internships";

export type JobType = "Full-time" | "Part-time" | "Contract" | "Internship";

export type JobLevel = "Internship" | "Junior" | "Mid" | "Senior";

/**
 * References one image in the A7 curated stock pool (see ASSETS.md) —
 * frames get assigned at Stage 4, this just pins which pool slot a listing
 * uses so no two adjacent listings in a category repeat the same frame.
 */
export type PhotoPoolId =
  | "eng-01"
  | "eng-02"
  | "eng-03"
  | "design-01"
  | "design-02"
  | "mktg-01"
  | "ops-01"
  | "intern-01"
  | "intern-02"
  | "general-01";

export interface Job {
  slug: string;
  title: string;
  company: string;
  category: JobCategory;
  location: string;
  remote: boolean;
  type: JobType;
  level: JobLevel;
  postedAt: string; // ISO date
  dek: string; // one or two sentence standfirst
  description: string[]; // body paragraphs
  requirements: string[];
  photoId: PhotoPoolId;
}

const CONTENT_DIR = path.join(process.cwd(), "content", "jobs");

let cache: Job[] | null = null;

export function getAllJobs(): Job[] {
  if (cache) return cache;

  const files = readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".json"));
  const jobs = files.map((file) => {
    const raw = readFileSync(path.join(CONTENT_DIR, file), "utf-8");
    const job = JSON.parse(raw) as Job;
    if (job.slug !== file.replace(/\.json$/, "")) {
      throw new Error(
        `Job slug "${job.slug}" does not match filename "${file}" — content/jobs/* filenames must equal the job's slug.`
      );
    }
    return job;
  });

  jobs.sort(
    (a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime()
  );

  cache = jobs;
  return jobs;
}

export function getJobBySlug(slug: string): Job | undefined {
  return getAllJobs().find((job) => job.slug === slug);
}

export function getRelatedJobs(job: Job, limit = 3): Job[] {
  return getAllJobs()
    .filter((j) => j.slug !== job.slug && j.category === job.category)
    .slice(0, limit);
}

export function getCategories(): JobCategory[] {
  return [
    "Engineering",
    "Design",
    "Marketing",
    "Operations",
    "Internships",
  ];
}

export function getLocations(): string[] {
  return Array.from(new Set(getAllJobs().map((j) => j.location))).sort();
}

export function getTypes(): JobType[] {
  return Array.from(new Set(getAllJobs().map((j) => j.type)));
}

export function getLevels(): JobLevel[] {
  const order: JobLevel[] = ["Internship", "Junior", "Mid", "Senior"];
  const present = new Set(getAllJobs().map((j) => j.level));
  return order.filter((l) => present.has(l));
}
