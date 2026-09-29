import type { Metadata } from "next";
import Link from "next/link";
import { photoUrl } from "@/lib/photos";
import ParallaxPhoto from "@/components/ParallaxPhoto";
import StatsBand from "@/components/about/StatsBand";

export const metadata: Metadata = {
  title: "About",
  description:
    "The Roster started as a shared spreadsheet of verified job openings. Here's who's behind it and what we hold ourselves to.",
};

const TEAM = [
  {
    name: "Dana Okafor",
    role: "Co-founder",
    bio: "Spent six years in recruiting ops before deciding the tooling was the actual problem.",
    photo: "eng-01" as const,
  },
  {
    name: "Marcus Lindqvist",
    role: "Co-founder",
    bio: "Builds the verification pipeline that checks a listing is still real before it goes live.",
    photo: "design-01" as const,
  },
  {
    name: "Priya Chandran",
    role: "Head of Partnerships",
    bio: "Talks to every hiring manager directly — no account managers in between.",
    photo: "ops-01" as const,
  },
  {
    name: "Theo Ansah",
    role: "Engineering",
    bio: "Keeps the filters fast and the listing index honest.",
    photo: "intern-02" as const,
  },
];

const VALUES = [
  {
    title: "Verify, then list.",
    body: "Every role is confirmed with the hiring manager before it goes on the board — not scraped from a company's careers page and left to rot.",
  },
  {
    title: "Delist on day one.",
    body: "A filled role comes down the day it's filled, not whenever someone gets around to it.",
  },
  {
    title: "No side deals.",
    body: "We don't take payment to rank a listing higher. Order is category, then recency. That's it.",
  },
  {
    title: "Write it straight.",
    body: "Descriptions come from whoever's actually hiring, not a template that says \"fast-paced environment.\"",
  },
];

const MILESTONES = [
  {
    date: "Jan 2024",
    title: "The spreadsheet",
    body: "Three of us, job-hunting at the same time, start tracking roles we've personally called and confirmed are still open.",
  },
  {
    date: "Jun 2024",
    title: "Friends of friends",
    body: "The sheet gets shared past our own circle. It crosses 200 rows and starts breaking in Google Sheets.",
  },
  {
    date: "Nov 2024",
    title: "The Roster, v1",
    body: "A real site replaces the spreadsheet — same verification rule, now with actual category and location filtering.",
  },
  {
    date: "Mar 2025",
    title: "The verification pipeline",
    body: "Every listing gets a confirmation call before it goes live, and comes down automatically the day a company tells us it's filled.",
  },
  {
    date: "2026",
    title: "Today",
    body: "Dozens of companies, hundreds of roles verified since launch, and still zero recruiter reposts.",
  },
];

const STATS = [
  { value: 6, label: "Team members" },
  { value: 340, label: "Roles verified", suffix: "+" },
  { value: 62, label: "Companies partnered" },
  { value: 2, label: "Years running" },
];

export default function AboutPage() {
  return (
    <main className="flex-1">
      {/* Hero */}
      <div className="border-b border-line px-6 py-16 md:px-12 md:py-24">
        <div className="mx-auto max-w-[1440px]">
          <p className="font-mono text-xs font-medium uppercase tracking-[0.08em] text-ink/60">
            About
          </p>
          <div className="mt-4 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-end lg:gap-12">
            <div className="lg:col-span-7">
              <h1 className="max-w-[16ch] font-sans text-5xl font-black leading-[0.98] tracking-[-0.02em] text-ink md:text-7xl">
                Built by people tired of bad job boards.
              </h1>
              <p className="mt-8 max-w-[65ch] font-sans text-xl leading-snug text-ink/80">
                Three of us were job-hunting at the same time in 2024,
                comparing notes on how much of every board was noise —
                reposted listings, roles that had been filled for weeks,
                descriptions written by someone who&apos;d never spoken to
                the hiring manager.
              </p>
              <p className="mt-6 max-w-[65ch] font-sans text-base leading-relaxed text-ink/70">
                We started keeping a shared spreadsheet of roles we&apos;d
                actually called and confirmed were open. Friends asked to
                see it. Then friends of friends. The Roster is that
                spreadsheet, grown up — still built on the same rule:
                nothing goes on the board until someone here has confirmed
                it&apos;s real.
              </p>
            </div>
            <div className="lg:col-span-5">
              <ParallaxPhoto
                src={photoUrl("eng-03", 800)}
                alt="Two people reviewing listings together at a desk"
                sizes="(min-width: 1024px) 35vw, 90vw"
                className="aspect-[4/5] w-full"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 01 — Values */}
      <div className="border-b border-line px-6 py-16 md:px-12 md:py-24">
        <div className="mx-auto max-w-[1440px]">
          <p className="font-mono text-xs font-medium uppercase tracking-[0.08em] text-ink/60">
            01 — What we hold ourselves to
          </p>
          <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-4">
            {VALUES.map((v) => (
              <div key={v.title} data-reveal>
                <p className="font-sans text-lg font-bold text-ink">
                  {v.title}
                </p>
                <p className="mt-2 max-w-[32ch] font-sans text-sm text-ink/60">
                  {v.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 02 — Milestones */}
      <div className="border-b border-line px-6 py-16 md:px-12 md:py-24">
        <div className="mx-auto max-w-[1440px]">
          <p className="font-mono text-xs font-medium uppercase tracking-[0.08em] text-ink/60">
            02 — How we got here
          </p>
          <div className="mt-10 border-t border-line">
            {MILESTONES.map((m) => (
              <div
                key={m.date}
                data-reveal
                className="grid grid-cols-1 gap-2 border-b border-line py-8 md:grid-cols-12 md:gap-8 md:py-10"
              >
                <p className="font-mono text-xs font-medium uppercase tracking-[0.08em] text-red md:col-span-2">
                  {m.date}
                </p>
                <div className="md:col-span-7">
                  <p className="font-sans text-xl font-bold text-ink md:text-2xl">
                    {m.title}
                  </p>
                  <p className="mt-2 max-w-[55ch] font-sans text-base text-ink/70">
                    {m.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 03 — By the numbers */}
      <div className="border-b border-line px-6 py-16 md:px-12 md:py-24">
        <div className="mx-auto max-w-[1440px]">
          <p className="font-mono text-xs font-medium uppercase tracking-[0.08em] text-ink/60">
            03 — By the numbers
          </p>
          <div className="mt-10">
            <StatsBand stats={STATS} />
          </div>
        </div>
      </div>

      {/* 04 — Team */}
      <div className="border-b border-line px-6 py-16 md:px-12 md:py-24">
        <div className="mx-auto max-w-[1440px]">
          <p className="font-mono text-xs font-medium uppercase tracking-[0.08em] text-ink/60">
            04 — The team
          </p>
          <div className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-8">
            <div data-reveal className="md:col-span-7">
              <ParallaxPhoto
                src={photoUrl(TEAM[0].photo, 800)}
                alt=""
                sizes="(min-width: 768px) 55vw, 90vw"
                className="aspect-[16/11] w-full"
              />
              <p className="mt-4 font-sans text-base font-bold text-ink">
                {TEAM[0].name}
              </p>
              <p className="font-mono text-xs font-medium uppercase tracking-[0.05em] text-ink/60">
                {TEAM[0].role}
              </p>
              <p className="mt-2 max-w-[42ch] font-sans text-sm text-ink/60">
                {TEAM[0].bio}
              </p>
            </div>

            <div data-reveal className="md:col-span-5 md:mt-20">
              <ParallaxPhoto
                src={photoUrl(TEAM[1].photo, 700)}
                alt=""
                sizes="(min-width: 768px) 35vw, 90vw"
                className="aspect-[4/5] w-full"
              />
              <p className="mt-4 font-sans text-base font-bold text-ink">
                {TEAM[1].name}
              </p>
              <p className="font-mono text-xs font-medium uppercase tracking-[0.05em] text-ink/60">
                {TEAM[1].role}
              </p>
              <p className="mt-2 max-w-[36ch] font-sans text-sm text-ink/60">
                {TEAM[1].bio}
              </p>
            </div>

            <div data-reveal className="md:col-span-4">
              <ParallaxPhoto
                src={photoUrl(TEAM[2].photo, 600)}
                alt=""
                sizes="(min-width: 768px) 28vw, 45vw"
                className="aspect-[4/5] w-full"
              />
              <p className="mt-4 font-sans text-base font-bold text-ink">
                {TEAM[2].name}
              </p>
              <p className="font-mono text-xs font-medium uppercase tracking-[0.05em] text-ink/60">
                {TEAM[2].role}
              </p>
              <p className="mt-2 max-w-[32ch] font-sans text-sm text-ink/60">
                {TEAM[2].bio}
              </p>
            </div>

            <div data-reveal aria-hidden="true" className="md:col-span-4 md:mt-12">
              <ParallaxPhoto
                src={photoUrl("mktg-01", 600)}
                alt=""
                sizes="(min-width: 768px) 28vw, 45vw"
                className="aspect-[4/5] w-full"
              />
            </div>

            <div data-reveal className="md:col-span-4">
              <ParallaxPhoto
                src={photoUrl(TEAM[3].photo, 600)}
                alt=""
                sizes="(min-width: 768px) 28vw, 45vw"
                className="aspect-[4/5] w-full"
              />
              <p className="mt-4 font-sans text-base font-bold text-ink">
                {TEAM[3].name}
              </p>
              <p className="font-mono text-xs font-medium uppercase tracking-[0.05em] text-ink/60">
                {TEAM[3].role}
              </p>
              <p className="mt-2 max-w-[32ch] font-sans text-sm text-ink/60">
                {TEAM[3].bio}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Closing CTA */}
      <div className="bg-ink px-6 py-20 text-paper md:px-12 md:py-28">
        <div className="mx-auto flex max-w-[1440px] flex-col items-start gap-6" data-reveal>
          <h2 className="max-w-[18ch] font-sans text-4xl font-black leading-[0.98] tracking-[-0.02em] md:text-6xl">
            Think you&apos;d be a good fit?
          </h2>
          <p className="max-w-[50ch] font-sans text-lg text-paper/70">
            We&apos;re small and we hire rarely, but every open role we have
            is on the board — same as everyone else&apos;s.
          </p>
          <div className="flex flex-wrap items-center gap-6">
            <Link
              href="/jobs"
              className="inline-flex items-center gap-2 bg-red px-7 py-4 font-sans text-sm font-bold text-paper transition-colors hover:bg-paper hover:text-ink"
            >
              Browse open roles →
            </Link>
            <Link
              href="/for-employers"
              className="font-mono text-xs font-medium uppercase tracking-[0.08em] text-paper transition-colors hover:text-red"
            >
              Hiring? Post a role
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
