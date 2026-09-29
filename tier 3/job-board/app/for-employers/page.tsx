import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "For employers",
  description:
    "Post a verified role on The Roster — no self-serve form, no rotting listings.",
};

const STEPS = [
  {
    n: "01",
    title: "Tell us what's open.",
    body: "Send the role, the real requirements, and a description written by whoever's actually hiring — not a template.",
  },
  {
    n: "02",
    title: "We verify it.",
    body: "A short call to confirm the role, the range, and the timeline. Roles we can't verify don't go up.",
  },
  {
    n: "03",
    title: "It goes on the board.",
    body: "Indexed by category, location, type, and level — sitting next to roles from companies at a similar stage, not buried under a thousand recruiter reposts.",
  },
  {
    n: "04",
    title: "You take it down when it's filled.",
    body: "One line to us and the listing is gone the same day — not a month later.",
  },
];

const PLANS = [
  {
    n: "01",
    name: "Single listing",
    price: "$0",
    period: "limited beta",
    features: [
      "One verified role, 60-day listing",
      "Full category/location/type indexing",
      "Verification call included",
    ],
  },
  {
    n: "02",
    name: "Growth",
    price: "$149",
    period: "per role",
    highlight: true,
    features: [
      "Up to 5 active roles at once",
      "Priority verification, 24hr turnaround",
      "Included in the weekly candidate digest",
    ],
  },
  {
    n: "03",
    name: "Partner",
    price: "Custom",
    period: "recurring hiring",
    features: [
      "Unlimited active roles",
      "Dedicated partnerships contact",
      "Early access to new filtering features",
    ],
  },
];

const LOGOS = [
  "Almanac Systems",
  "Fieldstone",
  "Northbound Robotics",
  "Harbor Analytics",
  "Coastal Grocer",
  "Bellwether Finance",
];

const QUOTES = [
  {
    quote:
      "We used to get four hundred applicants for one role and maybe five worth a callback. The Roster sent twelve, all qualified.",
    name: "Hiring Manager",
    role: "Almanac Systems",
  },
  {
    quote:
      "The verification call took fifteen minutes and meant we never had to think about the listing again until it was filled.",
    name: "Head of Ops",
    role: "Northbound Robotics",
  },
];

export default function ForEmployersPage() {
  return (
    <main className="flex-1">
      <div className="border-b border-line px-6 py-16 md:px-12 md:py-24">
        <div className="mx-auto max-w-[1440px]">
          <p className="font-mono text-xs font-medium uppercase tracking-[0.08em] text-ink/60">
            For employers
          </p>
          <h1 className="mt-4 max-w-[18ch] font-sans text-5xl font-black leading-[0.98] tracking-[-0.02em] text-ink md:text-7xl">
            Post a role people actually read.
          </h1>
          <p className="mt-6 max-w-[60ch] font-sans text-xl leading-snug text-ink/70">
            No self-serve form that lets a listing rot for six months after
            you&apos;ve filled it. Every role on The Roster is verified before
            it goes up, and comes down the day it&apos;s filled.
          </p>
        </div>
      </div>

      <div className="border-b border-line px-6 py-16 md:px-12 md:py-24">
        <div className="mx-auto max-w-[1440px]">
          <p className="font-mono text-xs font-medium uppercase tracking-[0.08em] text-ink/60">
            01 — How it works
          </p>
          <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2">
            {STEPS.map((step) => (
              <div
                key={step.n}
                data-reveal
                className="border-t border-line pt-6"
              >
                <span className="font-mono text-xs font-medium text-red">
                  {step.n}
                </span>
                <p className="mt-3 font-sans text-2xl font-bold text-ink">
                  {step.title}
                </p>
                <p className="mt-2 max-w-[48ch] font-sans text-base text-ink/70">
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 02 — Plans */}
      <div className="border-b border-line px-6 py-16 md:px-12 md:py-24">
        <div className="mx-auto max-w-[1440px]">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <p className="font-mono text-xs font-medium uppercase tracking-[0.08em] text-ink/60">
              02 — Plans
            </p>
            <p className="font-mono text-xs font-medium uppercase tracking-[0.05em] text-ink/40">
              Illustrative pricing — demo site
            </p>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-px bg-line md:grid-cols-3">
            {PLANS.map((plan) => (
              <div
                key={plan.n}
                data-reveal
                className={`flex flex-col gap-6 px-6 py-8 md:px-8 md:py-10 ${
                  plan.highlight ? "bg-ink text-paper" : "bg-paper text-ink"
                }`}
              >
                <span
                  className={`font-mono text-xs font-medium ${
                    plan.highlight ? "text-paper/50" : "text-ink/50"
                  }`}
                >
                  {plan.n}
                </span>
                <div>
                  <p className="font-sans text-lg font-bold">{plan.name}</p>
                  <p className="mt-3 flex items-baseline gap-2 font-mono">
                    <span className="text-4xl font-medium tabular-nums">
                      {plan.price}
                    </span>
                    <span
                      className={`text-xs uppercase tracking-[0.05em] ${
                        plan.highlight ? "text-paper/60" : "text-ink/50"
                      }`}
                    >
                      {plan.period}
                    </span>
                  </p>
                </div>
                <ul
                  className={`flex flex-1 flex-col gap-3 border-t pt-6 font-sans text-sm ${
                    plan.highlight
                      ? "border-paper/20 text-paper/80"
                      : "border-line text-ink/70"
                  }`}
                >
                  {plan.features.map((f) => (
                    <li key={f} className="flex gap-2">
                      <span aria-hidden="true">—</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 03 — Who's used it */}
      <div className="border-b border-line px-6 py-16 md:px-12 md:py-24">
        <div className="mx-auto max-w-[1440px]">
          <p className="font-mono text-xs font-medium uppercase tracking-[0.08em] text-ink/60">
            03 — Employers who&apos;ve used it
          </p>
          <div
            data-reveal
            className="mt-10 grid grid-cols-2 gap-px bg-line sm:grid-cols-3 md:grid-cols-6"
          >
            {LOGOS.map((name) => (
              <div
                key={name}
                className="flex h-20 items-center justify-center bg-paper px-3 text-center"
              >
                <span className="font-sans text-sm font-bold text-ink/70">
                  {name}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-14 grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-12">
            {QUOTES.map((q) => (
              <blockquote
                key={q.name + q.role}
                data-reveal
                className="border-l-2 border-red pl-6"
              >
                <p className="font-sans text-xl font-medium leading-snug text-ink">
                  &ldquo;{q.quote}&rdquo;
                </p>
                <footer className="mt-4 font-mono text-xs font-medium uppercase tracking-[0.05em] text-ink/60">
                  {q.name} — {q.role}
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </div>

      {/* Closing CTA */}
      <div className="bg-ink px-6 py-20 text-paper md:px-12 md:py-28">
        <div
          data-reveal
          className="mx-auto flex max-w-[1440px] flex-col items-start gap-6"
        >
          <h2 className="max-w-[20ch] font-sans text-4xl font-black leading-[0.98] tracking-[-0.02em] md:text-6xl">
            Have a role open?
          </h2>
          <p className="max-w-[50ch] font-sans text-lg text-paper/70">
            Write to us with the role and we&apos;ll get back to you within a
            day to start verification. No form, no self-serve dashboard —
            just a real reply from a real person.
          </p>
          <a
            href="mailto:roles@theroster.example"
            className="inline-flex items-center gap-2 bg-red px-7 py-4 font-sans text-sm font-bold text-paper transition-colors hover:bg-paper hover:text-ink"
          >
            roles@theroster.example →
          </a>
        </div>
      </div>
    </main>
  );
}
