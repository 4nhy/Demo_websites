"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";

const NAV_LINKS = [
  { href: "/shop", label: "Shop" },
  { href: "/collections", label: "Collections" },
  { href: "/about", label: "About" },
] as const;

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * Functional nav — SHOP / COLLECTIONS / ABOUT as real routes, BAG as a
 * drawer toggle with a live count, not a page. Now with a real current-route
 * mark (a thin gold underline, the same acid-lime token used for chrome/gold
 * accents everywhere else) instead of no active state at all — restrained on
 * purpose, this is a shared utility bar, not another homepage set-piece.
 */
export default function SiteHeader() {
  const { count, toggleDrawer } = useCart();
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-grape-ink/10 bg-chrome-white px-4 py-3 sm:gap-0 sm:px-10 sm:py-4">
      <Link
        href="/"
        className="group whitespace-nowrap font-display text-sm font-medium tracking-tight text-grape-ink sm:text-base"
      >
        ANGEL WIRE
        <span
          aria-hidden="true"
          className="ml-1 inline-block h-1 w-1 rounded-full bg-acid-lime align-middle opacity-70 transition-opacity group-hover:opacity-100"
        />
      </Link>
      <nav className="flex items-center gap-3 whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.1em] text-grape-ink sm:gap-6 sm:text-[11px] sm:tracking-[0.16em]">
        {NAV_LINKS.map((link) => {
          const active = isActive(pathname, link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={active ? "page" : undefined}
              className={`border-b pb-0.5 transition-colors ${
                active
                  ? "border-acid-lime text-grape-ink"
                  : "border-transparent text-grape-ink hover:text-grape-ink/60"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
        <button
          type="button"
          onClick={toggleDrawer}
          aria-haspopup="dialog"
          className="border-b border-transparent pb-0.5 text-grape-ink transition-colors hover:text-grape-ink/60"
        >
          Bag ({count})
        </button>
      </nav>
    </header>
  );
}
