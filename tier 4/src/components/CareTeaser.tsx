import Link from "next/link";

// Homepage's short preview of /care — the full pinned growth sequence
// and all three tip cards now live on the dedicated page; this is just
// the hook.
export default function CareTeaser() {
  return (
    <section className="section-pad bg-panel px-6 md:px-12">
      <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-2 text-xs tracking-[0.25em] text-gold uppercase">Care notes</p>
          <h2 className="font-display max-w-xl text-3xl text-cream md:text-4xl">
            A little vocabulary goes further than another app reminder.
          </h2>
        </div>
        <Link
          href="/care"
          className="inline-flex w-fit items-center gap-2 rounded-full border border-cream/25 px-7 py-3 text-sm text-cream transition-colors hover:border-gold hover:text-gold-bright"
        >
          Read the Care Notes
        </Link>
      </div>
    </section>
  );
}
