import Link from "next/link";
import { getAllRecipes, getCuisineShowcase } from "@/lib/recipes";
import { CUISINES, DIETS } from "@/lib/types";
import HeroSection from "@/components/hero-section";
import CollectionGrid from "@/components/collection-grid";
import RecipeCard from "@/components/recipe-card";
import RecipeCarousel from "@/components/recipe-carousel";
import IngredientSpotlight from "@/components/ingredient-spotlight";
import CooksNotes from "@/components/cooks-notes";
import Reveal from "@/components/reveal";
import DeckleEdge from "@/components/deckle-edge";
import { KineticHeadline } from "@/components/kinetic-text";
import { CookIcon, FilterIcon, SearchIcon } from "@/components/icons";

const STEPS = [
  {
    icon: SearchIcon,
    title: "Search",
    body: "Start from a cuisine, or jump straight to the full grid.",
  },
  {
    icon: FilterIcon,
    title: "Filter",
    body: "Stack cuisine, diet, and time until only what you'd actually cook is left.",
  },
  {
    icon: CookIcon,
    title: "Cook",
    body: "Every recipe page is ingredients and numbered steps — nothing else to scroll past.",
  },
];

export default function HomePage() {
  const recipes = getAllRecipes();
  const showcase = getCuisineShowcase();
  const featured = recipes.slice(0, 8);
  // One from each cuisine, distinct from the carousel's leading picks.
  const seasonal = [recipes[2], recipes[5], recipes[8], recipes[11]];
  const avgTime = Math.round(
    recipes.reduce((sum, r) => sum + r.totalMinutes, 0) / recipes.length
  );

  const collectionItems = CUISINES.map((cuisine) => ({
    cuisine,
    imageId: showcase[cuisine].image.id,
    count: recipes.filter((r) => r.cuisine === cuisine).length,
    href: `/recipes?cuisine=${encodeURIComponent(cuisine)}`,
  }));

  return (
    <div>
      {/* Hero (traveling recipe-index-card, scroll-scrubbed to the whole
          page, no pin) → stat strip (count-up). */}
      <HeroSection
        stats={[
          { value: recipes.length, label: "Recipes" },
          { value: CUISINES.length, label: "Cuisines" },
          { value: DIETS.length, label: "Diets covered" },
          { value: avgTime, suffix: "m", label: "Avg. time" },
        ]}
      />

      {/* Browse by cuisine — collection grid, 3D tilt + rotate-in on scroll. */}
      <section className="relative bg-charcoal">
        <DeckleEdge className="bg-charcoal" />
        <div className="mx-auto max-w-(--breakpoint-2xl) px-5 py-16 md:px-8">
          <div className="flex items-end justify-between">
            <KineticHeadline
              as="h2"
              text="Browse by cuisine"
              from="start"
              className="font-display text-xl font-semibold text-bone sm:text-2xl"
            />
            <Link
              href="/recipes"
              className="hidden text-sm font-medium text-terracotta-bright hover:text-bone sm:inline"
            >
              View all recipes →
            </Link>
          </div>
          <div className="mt-6">
            <CollectionGrid items={collectionItems} />
          </div>
        </div>
      </section>

      {/* Seasonal picks — a second, smaller recipe grid. */}
      <section className="relative bg-bone text-ink">
        <DeckleEdge className="bg-bone" />
        <div className="mx-auto max-w-(--breakpoint-2xl) px-5 py-16 md:px-8">
          <KineticHeadline
            as="h2"
            text="Seasonal picks"
            from="center"
            className="font-display text-xl font-semibold sm:text-2xl"
          />
          <p className="mt-2 max-w-md text-sm text-muted">
            One from each cuisine, worth cooking this week.
          </p>
          <ul className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {seasonal.map((recipe, i) => (
              <Reveal as="li" key={recipe.slug} delay={i * 70}>
                <RecipeCard recipe={recipe} priority={i === 0} />
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-bone text-ink">
        <div className="mx-auto max-w-(--breakpoint-2xl) px-5 py-16 md:px-8">
          <KineticHeadline
            as="h2"
            text="How it works"
            from="end"
            className="font-display text-xl font-semibold sm:text-2xl"
          />
          <ol className="mt-9 grid grid-cols-1 gap-8 sm:grid-cols-3">
            {STEPS.map((step, i) => (
              <Reveal
                as="li"
                key={step.title}
                delay={i * 80}
                className="flex flex-col gap-3"
              >
                <div className="flex items-center gap-3">
                  <span className="flex size-11 items-center justify-center rounded-full bg-terracotta/15 text-terracotta">
                    <step.icon className="size-5" />
                  </span>
                  <span className="font-display text-sm text-muted">
                    0{i + 1}
                  </span>
                </div>
                <h3 className="font-display text-md font-semibold">
                  {step.title}
                </h3>
                <p className="text-sm text-ink/70">{step.body}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Ingredient spotlight */}
      <section className="relative bg-charcoal">
        <DeckleEdge className="bg-charcoal" />
        <div className="mx-auto max-w-(--breakpoint-2xl) px-5 py-16 md:px-8">
          <KineticHeadline
            as="h2"
            text="Ingredient spotlight"
            from="edges"
            className="font-display text-xl font-semibold text-bone sm:text-2xl"
          />
          <p className="mt-2 max-w-md text-sm text-bone/60">
            Three things worth buying good versions of.
          </p>
          <div className="mt-6">
            <IngredientSpotlight />
          </div>
        </div>
      </section>

      {/* Cook's notes — handwritten-style margin tips. */}
      <section className="relative bg-bone text-ink">
        <DeckleEdge className="bg-bone" />
        <div className="mx-auto max-w-(--breakpoint-2xl) px-5 py-16 md:px-8">
          <KineticHeadline
            as="h2"
            text="Cook's notes"
            from="center"
            className="font-display text-xl font-semibold sm:text-2xl"
          />
          <div className="mt-8">
            <CooksNotes />
          </div>
        </div>
      </section>

      {/* Featured recipes — horizontal carousel, food-app mechanic */}
      <section className="relative bg-charcoal py-16">
        <DeckleEdge className="bg-charcoal" />
        <div className="mx-auto flex max-w-(--breakpoint-2xl) items-end justify-between px-5 md:px-8">
          <KineticHeadline
            as="h2"
            text="Featured recipes"
            from="start"
            className="font-display text-xl font-semibold text-bone sm:text-2xl"
          />
          <Link
            href="/recipes"
            className="hidden text-sm font-medium text-terracotta-bright hover:text-bone sm:inline"
          >
            View all recipes →
          </Link>
        </div>
        <div className="mt-6">
          <RecipeCarousel recipes={featured} />
        </div>
      </section>
    </div>
  );
}
