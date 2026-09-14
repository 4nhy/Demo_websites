import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllRecipes, getRecipeBySlug, unsplashUrl } from "@/lib/recipes";
import Badge from "@/components/badge";
import IngredientChecklist from "@/components/ingredient-checklist";
import { ArrowRightIcon } from "@/components/icons";

export function generateStaticParams() {
  return getAllRecipes().map((recipe) => ({ slug: recipe.slug }));
}

export async function generateMetadata(
  props: PageProps<"/recipes/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const recipe = getRecipeBySlug(slug);
  if (!recipe) return {};
  return {
    title: recipe.title,
    description: recipe.description,
    openGraph: {
      title: `${recipe.title} · Recipe Hub`,
      description: recipe.description,
      type: "article",
    },
    twitter: {
      title: `${recipe.title} · Recipe Hub`,
      description: recipe.description,
    },
  };
}

export default async function RecipeDetailPage(
  props: PageProps<"/recipes/[slug]">
) {
  const { slug } = await props.params;
  const recipe = getRecipeBySlug(slug);
  if (!recipe) notFound();

  return (
    <article className="mx-auto max-w-(--breakpoint-lg) px-5 py-10 md:px-8 md:py-14">
      <Link
        href="/recipes"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-olive hover:underline"
      >
        ← Back to all recipes
      </Link>

      <header className="mt-5">
        <p className="text-sm font-medium text-olive">{recipe.cuisine}</p>
        <h1 className="mt-2 text-3xl font-semibold text-balance text-ink sm:text-4xl">
          {recipe.title}
        </h1>
        <p className="mt-3 max-w-2xl text-md text-ink/70">
          {recipe.description}
        </p>
      </header>

      <div className="relative mt-7 aspect-16/10 overflow-hidden rounded-2xl">
        <Image
          src={unsplashUrl(recipe.image.id, 1200)}
          alt={recipe.image.alt}
          fill
          priority
          sizes="(min-width: 1024px) 900px, 100vw"
          className="graded-photo object-cover"
        />
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <Badge variant="terracotta">{recipe.totalMinutes} min total</Badge>
        <Badge variant="neutral">Prep {recipe.prepMinutes} min</Badge>
        <Badge variant="neutral">Cook {recipe.cookMinutes} min</Badge>
        <Badge variant="neutral">Serves {recipe.servings}</Badge>
        <Badge variant="neutral">{recipe.difficulty}</Badge>
        {recipe.diets.map((diet) => (
          <Badge key={diet} variant="olive">
            {diet.replace("-", " ")}
          </Badge>
        ))}
      </div>

      <div className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-5">
        <section className="md:col-span-2">
          <h2 className="font-display text-lg font-semibold text-ink">
            Ingredients
          </h2>
          <div className="mt-3">
            <IngredientChecklist ingredients={recipe.ingredients} />
          </div>
        </section>
        <section className="md:col-span-3">
          <h2 className="font-display text-lg font-semibold text-ink">
            Method
          </h2>
          <ol className="mt-3 flex flex-col gap-5">
            {recipe.steps.map((step, i) => (
              <li key={i} className="flex gap-4">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-olive/15 font-display text-xs font-semibold text-olive">
                  {i + 1}
                </span>
                <p className="text-sm leading-relaxed text-ink/85">{step}</p>
              </li>
            ))}
          </ol>
          {recipe.note && (
            <div className="mt-7 rounded-2xl border border-line bg-paper p-4">
              <p className="text-xs font-semibold tracking-wide text-terracotta uppercase">
                Cook&apos;s note
              </p>
              <p className="mt-1.5 text-sm text-ink/80">{recipe.note}</p>
            </div>
          )}
        </section>
      </div>

      <footer className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-line pt-6 sm:flex-row sm:items-center">
        <p className="text-xs text-muted">
          Photo:{" "}
          <a
            href={recipe.image.credit.url}
            target="_blank"
            rel="noreferrer noopener"
            className="underline hover:text-ink/70"
          >
            {recipe.image.credit.name}
          </a>{" "}
          via Unsplash
        </p>
        <Link
          href="/recipes"
          className="inline-flex items-center gap-2 text-sm font-medium text-ink hover:text-terracotta"
        >
          More {recipe.cuisine} recipes
          <ArrowRightIcon className="size-4" />
        </Link>
      </footer>
    </article>
  );
}
