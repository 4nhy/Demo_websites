import Image from "next/image";
import Link from "next/link";

export default function Hero({
  roleCount,
  companyCount,
}: {
  roleCount: number;
  companyCount: number;
}) {
  return (
    <section
      id="hero"
      className="relative overflow-hidden border-b border-line px-6 pb-20 pt-16 md:px-12 md:pb-28 md:pt-24"
    >
      <div className="relative mx-auto grid max-w-[1440px] grid-cols-1 gap-12 lg:grid-cols-12 lg:items-end">
        <div className="relative z-20 lg:col-span-7">
          <p className="font-mono text-xs font-medium uppercase tracking-[0.08em] text-ink/60">
            The Roster — 01
          </p>
          {/*
            Sizing note (Stage 5 fix): the headline used to jump to a fixed
            112px/136px at md/lg while the two-column split also started at
            md (768px) — at exactly 768px the text column is only ~370px
            wide, well under what 112px needs, so "NO NOISE." wrapped
            mid-phrase. The split now waits for lg (1024px), and the two
            remaining steps (88px, 120px) are sized to the column width at
            the *start* of their own breakpoint, not just checked at 1440.
          */}
          <h1 className="mt-4 font-sans text-[15vw] font-black leading-[0.92] tracking-[-0.03em] text-ink sm:text-[88px] xl:text-[120px]">
            <span data-kinetic-line className="block overflow-hidden">
              <span data-kinetic-word className="inline-block">
                OPEN
              </span>
            </span>
            <span data-kinetic-line className="block overflow-hidden">
              <span data-kinetic-word className="inline-block">
                ROLES.
              </span>
            </span>
            <span data-kinetic-line className="block overflow-hidden">
              <span data-kinetic-word className="inline-block text-red">
                NO NOISE.
              </span>
            </span>
          </h1>
          <p className="mt-8 max-w-[46ch] font-sans text-lg text-ink/70 md:text-xl">
            The Roster indexes real openings at {companyCount} companies
            actually building — filtered by role, location, and level.
            No recruiter-speak, no dead listings.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-6">
            <Link
              href="/jobs"
              className="inline-flex items-center gap-2 bg-ink px-7 py-4 font-sans text-sm font-bold text-paper transition-colors hover:bg-red"
            >
              Browse {roleCount} roles →
            </Link>
            <Link
              href="/for-employers"
              className="font-mono text-xs font-medium uppercase tracking-[0.08em] text-ink transition-colors hover:text-red"
            >
              For employers
            </Link>
          </div>
        </div>

        <div className="relative z-0 aspect-[4/5] w-full overflow-hidden lg:col-span-5">
          <Image
            src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=760&q=80&auto=format&fit=crop"
            alt="A team reviewing work together at a shared desk"
            fill
            priority
            fetchPriority="high"
            unoptimized
            sizes="(min-width: 768px) 40vw, 100vw"
            className="photo-grade object-cover"
          />
        </div>
      </div>
    </section>
  );
}
