"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { gsap } from "@/lib/gsap";
import { MQ } from "@/lib/motion";
import { PRICE } from "@/lib/specs";

const LINKS = [
  { href: "/product", label: "Product" },
  { href: "/sound", label: "Sound" },
  { href: "/engineering", label: "Engineering" },
  { href: "/buy", label: "Buy" },
];

export default function Header() {
  const headerRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const onScroll = () => {
      el.dataset.solid = window.scrollY > 48 ? "true" : "false";
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // close the menu on navigation (derived during render, no effect needed)
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel || !open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    if (!window.matchMedia(MQ.reduce).matches) {
      gsap.fromTo(panel, { clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.7, ease: "expo.inOut" });
      gsap.from(panel.querySelectorAll("li"), { yPercent: 120, opacity: 0, duration: 0.8, stagger: 0.06, ease: "expo.out", delay: 0.2 });
    }
    panel.querySelector<HTMLElement>("a")?.focus();
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <a
        href="#main"
        className="sr-only z-[70] rounded bg-ionosphere px-4 py-2 text-signal focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Skip to content
      </a>
      <header
        ref={headerRef}
        data-solid="false"
        className="site-header fixed inset-x-0 top-0 z-50 border-b border-transparent"
        style={open ? ({ "--ink": "#f7f9fb", "--ink-soft": "rgb(247 249 251 / 0.7)", "--backdrop": "#0e1b2e" } as React.CSSProperties) : undefined}
      >
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-4 py-4 sm:px-8 lg:px-10">
          <Link href="/" className="font-display text-2xl font-semibold tracking-tight" aria-label="Drift, home">
            drift
          </Link>
          <nav aria-label="Primary" className="hidden md:block">
            <ul className="flex items-center gap-9 font-mono text-[11px] tracking-[0.16em] uppercase">
              {LINKS.map((l) => {
                const active = pathname === l.href;
                return (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      aria-current={active ? "page" : undefined}
                      className="group relative py-2 text-[var(--ink-soft)] transition-colors hover:text-[var(--ink)] aria-[current=page]:text-[var(--ink)]"
                    >
                      {l.label}
                      <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-current transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100 group-aria-[current=page]:scale-x-100" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          <div className="flex items-center gap-3">
            <Link
              href="/buy"
              data-magnetic
              className="rounded-full bg-[var(--ink)] px-5 py-2.5 font-mono text-[11px] tracking-[0.14em] text-[var(--backdrop)] uppercase transition-[filter] hover:brightness-125"
            >
              Buy — ${PRICE}
            </Link>
            <button
              type="button"
              className="grid h-10 w-10 place-items-center rounded-full border border-current/25 md:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((o) => !o)}
            >
              <span className="relative block h-3 w-4" aria-hidden>
                <span className={`absolute left-0 h-px w-4 bg-current transition-transform duration-300 ${open ? "top-1.5 rotate-45" : "top-0"}`} />
                <span className={`absolute left-0 h-px w-4 bg-current transition-transform duration-300 ${open ? "top-1.5 -rotate-45" : "top-3"}`} />
              </span>
            </button>
          </div>
        </div>
      </header>

      {open && (
        <div
          id="mobile-menu"
          ref={panelRef}
          className="fixed inset-0 z-40 flex flex-col justify-end bg-ionosphere px-4 pt-24 pb-10 text-signal md:hidden"
        >
          <ul className="flex flex-col gap-1">
            {[{ href: "/", label: "Home" }, ...LINKS].map((l) => (
              <li key={l.href} className="overflow-hidden">
                <Link href={l.href} className="block font-display text-[15vw] leading-[1.02] font-semibold tracking-tight">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-10 font-mono text-[11px] tracking-[0.16em] text-signal/60 uppercase">
            Drift One · 40 h · 42 dB ANC · ${PRICE}
          </p>
        </div>
      )}
    </>
  );
}
