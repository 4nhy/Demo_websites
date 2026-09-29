import Link from "next/link";

const NAV = [
  { href: "/jobs", label: "Jobs" },
  { href: "/about", label: "About" },
  { href: "/for-employers", label: "For employers" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/95 backdrop-blur">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-5 md:px-12">
        <Link
          href="/"
          className="font-sans text-lg font-extrabold tracking-[-0.02em] text-ink"
        >
          The Roster
        </Link>
        <nav className="flex items-center gap-8">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="font-mono text-xs font-medium uppercase tracking-[0.08em] text-ink transition-colors hover:text-red"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
