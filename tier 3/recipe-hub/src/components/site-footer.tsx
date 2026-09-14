import Link from "next/link";
import { CUISINES } from "@/lib/types";
import DeckleEdge from "./deckle-edge";
import NewsletterForm from "./newsletter-form";

export default function SiteFooter() {
  return (
    <footer>
      <div className="bg-charcoal text-bone">
        <div className="mx-auto flex max-w-(--breakpoint-2xl) flex-col items-start gap-6 px-5 py-16 md:flex-row md:items-center md:justify-between md:px-8">
          <div className="max-w-md">
            <p className="font-display text-2xl font-semibold text-balance sm:text-3xl">
              Never run out of ideas for dinner.
            </p>
            <p className="mt-2 text-sm text-bone/60">
              One email a week. No spam, unsubscribe anytime.
            </p>
          </div>
          <NewsletterForm />
        </div>
      </div>

      <div className="relative bg-bone">
        <DeckleEdge className="bg-bone" />
        <div className="mx-auto grid max-w-(--breakpoint-2xl) grid-cols-2 gap-10 px-5 py-14 md:grid-cols-4 md:px-8">
          <div className="col-span-2 md:col-span-1">
            <p className="font-display text-lg font-semibold text-ink">
              Recipe Hub
            </p>
            <p className="mt-2 max-w-[26ch] text-sm text-muted">
              A dynamic recipe platform for home cooks — filter fast, cook
              from a page built to actually follow.
            </p>
          </div>

          <div>
            <p className="text-xs font-bold tracking-[0.1em] text-terracotta uppercase">
              Recipes
            </p>
            <ul className="mt-3 flex flex-col gap-2 text-sm text-ink/70">
              {CUISINES.map((cuisine) => (
                <li key={cuisine}>
                  <Link
                    href={`/recipes?cuisine=${encodeURIComponent(cuisine)}`}
                    className="hover:text-ink hover:underline"
                  >
                    {cuisine}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-bold tracking-[0.1em] text-terracotta uppercase">
              About
            </p>
            <ul className="mt-3 flex flex-col gap-2 text-sm text-ink/70">
              <li>
                <Link href="/recipes" className="hover:text-ink hover:underline">
                  All recipes
                </Link>
              </li>
              <li>
                <span>New recipes, tested weekly</span>
              </li>
              <li>
                <span>Written by home cooks</span>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-bold tracking-[0.1em] text-terracotta uppercase">
              Contact
            </p>
            <ul className="mt-3 flex flex-col gap-2 text-sm text-ink/70">
              <li>
                <span>hello@recipehub.example</span>
              </li>
              <li>
                <span>@recipehub</span>
              </li>
              <li>
                <span>No account required</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-line">
          <div className="mx-auto max-w-(--breakpoint-2xl) px-5 py-5 text-xs text-muted md:px-8">
            © {new Date().getFullYear()} Recipe Hub. Recipes for cooking, not
            for scrolling past.
          </div>
        </div>
      </div>
    </footer>
  );
}
