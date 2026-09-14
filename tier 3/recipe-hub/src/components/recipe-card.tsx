import Image from "next/image";
import Link from "next/link";
import type { Recipe } from "@/lib/types";
import { unsplashUrl } from "@/lib/recipes";
import Badge from "./badge";
import { ArrowRightIcon } from "./icons";

export default function RecipeCard({
  recipe,
  priority = false,
}: {
  recipe: Recipe;
  priority?: boolean;
}) {
  return (
    <Link
      href={`/recipes/${recipe.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-paper transition-shadow hover:shadow-[0_16px_32px_-16px_rgba(36,31,25,0.35)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-olive"
    >
      <div className="relative aspect-4/3 overflow-hidden bg-bone">
        <Image
          src={unsplashUrl(recipe.image.id, 640)}
          alt={recipe.image.alt}
          fill
          priority={priority}
          sizes="(min-width: 1024px) 320px, (min-width: 640px) 45vw, 90vw"
          className="graded-photo object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
        <span className="absolute left-3 top-3 rounded-full bg-paper/95 px-3 py-1 text-xs font-medium text-ink">
          {recipe.cuisine}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <h3 className="font-display text-md font-semibold text-ink">
          {recipe.title}
        </h3>
        <p className="line-clamp-2 text-sm text-ink/65">
          {recipe.description}
        </p>
        <div className="mt-auto flex flex-wrap items-center gap-2 pt-1">
          <Badge variant="neutral">{recipe.totalMinutes} min</Badge>
          <Badge variant="olive">{recipe.difficulty}</Badge>
          <span className="ml-auto inline-flex items-center gap-1 text-sm font-medium text-terracotta opacity-0 transition-opacity group-hover:opacity-100">
            View recipe
            <ArrowRightIcon className="size-3.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
