import type { Recipe } from "./types";

// Statically import every recipe JSON so getAllRecipes/getRecipeBySlug are
// plain sync functions the App Router can call from Server Components —
// no filesystem globbing, no CMS, no network.
import cacioEPepe from "@/content/recipes/cacio-e-pepe.json";
import margheritaPizza from "@/content/recipes/margherita-pizza.json";
import chickenPiccata from "@/content/recipes/chicken-piccata.json";
import padThaiShrimp from "@/content/recipes/pad-thai-shrimp.json";
import greenCurryChicken from "@/content/recipes/green-curry-chicken.json";
import somTam from "@/content/recipes/som-tam.json";
import streetCornTacos from "@/content/recipes/street-corn-tacos.json";
import carneAsada from "@/content/recipes/carne-asada.json";
import chilaquilesVerdes from "@/content/recipes/chilaquiles-verdes.json";
import chanaMasala from "@/content/recipes/chana-masala.json";
import butterChicken from "@/content/recipes/butter-chicken.json";
import palakPaneer from "@/content/recipes/palak-paneer.json";

const recipes = [
  cacioEPepe,
  margheritaPizza,
  chickenPiccata,
  padThaiShrimp,
  greenCurryChicken,
  somTam,
  streetCornTacos,
  carneAsada,
  chilaquilesVerdes,
  chanaMasala,
  butterChicken,
  palakPaneer,
] as Recipe[];

export function getAllRecipes(): Recipe[] {
  return recipes;
}

export function getRecipeBySlug(slug: string): Recipe | undefined {
  return recipes.find((recipe) => recipe.slug === slug);
}

export function getRecipesByCuisine(cuisine: Recipe["cuisine"]): Recipe[] {
  return recipes.filter((recipe) => recipe.cuisine === cuisine);
}

/** One representative recipe per cuisine, used for the homepage collection grid. */
export function getCuisineShowcase(): Record<Recipe["cuisine"], Recipe> {
  const showcase = {} as Record<Recipe["cuisine"], Recipe>;
  for (const recipe of recipes) {
    if (!showcase[recipe.cuisine]) {
      showcase[recipe.cuisine] = recipe;
    }
  }
  return showcase;
}

export function unsplashUrl(id: string, width: number, quality = 80): string {
  const base = id.startsWith("premium_")
    ? `https://plus.unsplash.com/${id}`
    : `https://images.unsplash.com/photo-${id}`;
  return `${base}?q=${quality}&w=${width}&auto=format&fit=crop`;
}
