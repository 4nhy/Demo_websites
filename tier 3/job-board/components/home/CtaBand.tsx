import Link from "next/link";

export default function CtaBand() {
  return (
    <section
      id="cta"
      className="relative border-b border-line px-6 py-24 md:px-12 md:py-32"
    >
      <div className="mx-auto flex max-w-[1440px] flex-col items-start gap-8">
        <h2 className="font-sans text-4xl font-black tracking-[-0.02em] text-ink md:text-6xl">
          The Roster{" "}
          <span className="relative inline-flex h-[0.5em] w-[0.5em] translate-y-[0.03em] items-center justify-center align-middle">
            {/* Open ring, always present, sized/positioned as a character
                in the word. The traveling disc (HomeView) lands here
                permanently — this is its final position on the page. */}
            <span className="absolute inset-0 rounded-full border-2 border-ink/25" />
            <span
              data-disc-dock="cta"
              className="absolute inset-0 scale-0 rounded-full bg-red opacity-0"
            />
          </span>
        </h2>
        <p className="max-w-[42ch] font-sans text-lg text-ink/70">
          Every open role, indexed. No account wall, no recruiter-speak, no
          ghost postings.
        </p>
        <div className="flex flex-wrap items-center gap-6">
          <Link
            href="/jobs"
            className="inline-flex items-center gap-2 bg-red px-7 py-4 font-sans text-sm font-bold text-paper transition-colors hover:bg-ink"
          >
            Browse all roles →
          </Link>
          <Link
            href="/for-employers"
            className="font-mono text-xs font-medium uppercase tracking-[0.08em] text-ink transition-colors hover:text-red"
          >
            Post a role
          </Link>
        </div>
      </div>
    </section>
  );
}
