"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";

const links = [
  { label: "Shop", href: "/shop" },
  { label: "Care", href: "/care" },
  { label: "About", href: "/about" },
];

export default function Nav() {
  const { count, openDrawer } = useCart();

  return (
    <header className="fixed inset-x-0 top-0 z-40 flex items-center justify-between px-6 py-5 md:px-12">
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(180deg, rgba(11,20,16,0.85) 0%, rgba(11,20,16,0.55) 70%, rgba(11,20,16,0) 100%)",
        }}
      />
      <Link
        href="/"
        className="font-display text-lg tracking-[0.08em] text-cream"
      >
        Verde Noir
      </Link>

      <nav className="hidden items-center gap-8 md:flex">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="text-sm text-cream-dim transition-colors hover:text-cream"
          >
            {l.label}
          </Link>
        ))}
      </nav>

      <button
        type="button"
        onClick={openDrawer}
        aria-label={`Open cart, ${count} item${count === 1 ? "" : "s"}`}
        className="flex items-center gap-2 rounded-full border border-cream/15 bg-panel/70 px-4 py-2 text-sm text-cream backdrop-blur-sm transition-colors hover:border-gold/50"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M6 6h15l-1.5 9h-12L6 3H3"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="9.5" cy="20" r="1.3" fill="currentColor" />
          <circle cx="17.5" cy="20" r="1.3" fill="currentColor" />
        </svg>
        Cart
        {count > 0 && (
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-gold px-1 text-xs font-medium text-bg">
            {count}
          </span>
        )}
      </button>
    </header>
  );
}
