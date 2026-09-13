import Link from "next/link";

// Every link below resolves to a real page — no "#" placeholders.
// A few (Repotting Guide, Humidity 101, Pest Watch, Sourcing, Shipping,
// Contact) don't have dedicated pages of their own yet, so they point to
// the existing page that most directly covers that ground (Care or
// About) rather than to nowhere.
const columns = [
  {
    title: "Shop",
    links: [
      { label: "All Plants", href: "/shop" },
      { label: "Low Light", href: "/shop" },
      { label: "Statement", href: "/shop" },
      { label: "Pet Safe", href: "/shop" },
      { label: "Rare", href: "/shop" },
    ],
  },
  {
    title: "Care",
    links: [
      { label: "Care Notes", href: "/care" },
      { label: "Repotting Guide", href: "/care" },
      { label: "Humidity 101", href: "/care" },
      { label: "Pest Watch", href: "/care" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Sourcing", href: "/about" },
      { label: "Shipping", href: "/about" },
      { label: "Contact", href: "/about" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="section-pad border-t border-cream/10 bg-bg px-6 md:px-12">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-10 md:grid-cols-4">
        <div className="col-span-2 md:col-span-1">
          <p className="font-display text-xl text-cream">Verde Noir</p>
          <p className="mt-3 max-w-[22ch] text-sm text-cream-dim">
            Considered houseplants, root-checked and delivered.
          </p>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <p className="mb-4 text-xs tracking-[0.2em] text-gold uppercase">{col.title}</p>
            <ul className="space-y-2.5">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-cream-dim transition-colors hover:text-cream"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mx-auto mt-14 max-w-6xl border-t border-cream/10 pt-6 text-xs text-cream-dim/70">
        © {new Date().getFullYear()} Verde Noir. All plants shipped bare-root free, potted on arrival.
      </div>
    </footer>
  );
}
