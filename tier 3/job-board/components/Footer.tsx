import Link from "next/link";

const COLUMNS = [
  {
    heading: "Browse",
    links: [
      { href: "/jobs", label: "All roles" },
      { href: "/jobs?category=Engineering", label: "Engineering" },
      { href: "/jobs?category=Design", label: "Design" },
      { href: "/jobs?category=Internships", label: "Internships" },
    ],
  },
  {
    heading: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/for-employers", label: "For employers" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-line bg-paper">
      <div className="mx-auto max-w-[1440px] px-6 py-16 md:px-12">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
          <div className="md:col-span-6">
            <p className="font-sans text-2xl font-extrabold tracking-[-0.02em] text-ink">
              The Roster
            </p>
            <p className="mt-4 max-w-[38ch] font-sans text-sm text-ink/60">
              Open roles at companies building real things. Indexed, filtered,
              no recruiter-speak.
            </p>
          </div>
          {COLUMNS.map((col) => (
            <div key={col.heading} className="md:col-span-3">
              <p className="font-mono text-xs font-medium uppercase tracking-[0.08em] text-ink/60">
                {col.heading}
              </p>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="font-sans text-sm text-ink transition-colors hover:text-red"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-16 flex flex-col gap-3 border-t border-line pt-6 font-mono text-xs uppercase tracking-[0.08em] text-ink/60 md:flex-row md:items-center md:justify-between">
          <span>&copy; 2026 The Roster</span>
          <span>Updated daily</span>
        </div>
      </div>
    </footer>
  );
}
