import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex-1 px-6 py-24 md:px-12 md:py-32">
      <div className="mx-auto max-w-[1440px]">
        <p className="font-mono text-xs font-medium uppercase tracking-[0.08em] text-ink/60">
          404
        </p>
        <h1 className="mt-4 max-w-[16ch] font-sans text-5xl font-black leading-[0.98] tracking-[-0.02em] text-ink md:text-7xl">
          That role&apos;s been filled. Or never existed.
        </h1>
        <p className="mt-6 max-w-[50ch] font-sans text-lg text-ink/70">
          Either way, there&apos;s nothing at this address. The rest of the
          board is still open.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-6">
          <Link
            href="/jobs"
            className="inline-flex items-center gap-2 bg-ink px-7 py-4 font-sans text-sm font-bold text-paper transition-colors hover:bg-red"
          >
            Browse open roles →
          </Link>
          <Link
            href="/"
            className="font-mono text-xs font-medium uppercase tracking-[0.08em] text-ink transition-colors hover:text-red"
          >
            Back home
          </Link>
        </div>
      </div>
    </main>
  );
}
