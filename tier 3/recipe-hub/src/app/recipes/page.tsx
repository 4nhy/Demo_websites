import type { Metadata } from "next";
import { getAllRecipes } from "@/lib/recipes";
import { CUISINES, type Cuisine } from "@/lib/types";
import RecipeExplorer from "@/components/recipe-explorer";

const description =
  "Filter every Recipe Hub recipe by cuisine, diet, and time to cook.";

export const metadata: Metadata = {
  title: "All Recipes",
  description,
  openGraph: {
    title: "All Recipes · Recipe Hub",
    description,
  },
  twitter: {
    title: "All Recipes · Recipe Hub",
    description,
  },
};

function isCuisine(value: string | undefined): value is Cuisine {
  return !!value && (CUISINES as string[]).includes(value);
}

export default async function RecipesPage(
  props: PageProps<"/recipes">
) {
  const params = await props.searchParams;
  const cuisineParam = Array.isArray(params.cuisine)
    ? params.cuisine[0]
    : params.cuisine;
  const initialCuisine = isCuisine(cuisineParam) ? cuisineParam : undefined;

  return (
    <div className="mx-auto max-w-(--breakpoint-2xl) px-5 py-12 pb-28 md:px-8 md:pb-12">
      <header className="max-w-2xl">
        <p className="text-sm font-medium text-olive">Recipe grid</p>
        <h1 className="mt-2 text-2xl font-semibold text-ink sm:text-3xl">
          All recipes
        </h1>
        <p className="mt-3 text-md text-ink/70">
          Stack filters across cuisine, diet, and time — everything updates
          instantly, no reload.
        </p>
      </header>
      <div className="mt-8">
        <RecipeExplorer recipes={getAllRecipes()} initialCuisine={initialCuisine} />
      </div>
    </div>
  );
}
