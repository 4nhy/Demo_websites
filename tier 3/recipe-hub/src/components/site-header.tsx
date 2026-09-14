import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bone/90 backdrop-blur">
      <div className="mx-auto flex max-w-(--breakpoint-2xl) items-center justify-between px-5 py-4 md:px-8">
        <Link
          href="/"
          className="font-display text-xl font-semibold tracking-tight text-ink"
        >
          Recipe Hub
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium">
          <Link
            href="/"
            className="hidden text-ink/70 transition-colors hover:text-ink sm:inline"
          >
            Home
          </Link>
          <Link
            href="/recipes"
            className="rounded-full bg-terracotta px-4 py-2 text-sm font-semibold text-terracotta-ink transition-transform hover:-translate-y-0.5"
          >
            All recipes
          </Link>
        </nav>
      </div>
    </header>
  );
}
