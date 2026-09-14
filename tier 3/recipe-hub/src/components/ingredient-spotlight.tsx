import Image from "next/image";
import { unsplashUrl } from "@/lib/recipes";
import { KineticBody } from "./kinetic-text";
import Reveal from "./reveal";

interface Ingredient {
  name: string;
  imageId: string;
  note: string;
}

const INGREDIENTS: Ingredient[] = [
  {
    name: "Olive Oil",
    imageId: "1760445528824-7b6fa5f85f1a",
    note: "Finish with it, don't just cook with it — a good pour at the end is half the flavor.",
  },
  {
    name: "Fresh Herbs",
    imageId: "1784043291796-e38b434c8b88",
    note: "Added last, torn not chopped. Dried herbs go in early; fresh ones go in right before serving.",
  },
  {
    name: "Flaky Salt",
    imageId: "1763974463967-647601c65961",
    note: "Season in layers while you cook, then finish with a pinch of something flaky for texture.",
  },
];

export default function IngredientSpotlight() {
  return (
    <ul className="grid grid-cols-1 gap-5 sm:grid-cols-3">
      {INGREDIENTS.map((item, i) => (
        <Reveal as="li" key={item.name} delay={i * 90}>
          <div className="relative aspect-3/4 overflow-hidden rounded-2xl">
            <Image
              src={unsplashUrl(item.imageId, 640)}
              alt={item.name}
              fill
              sizes="(min-width: 640px) 30vw, 90vw"
              className="graded-photo object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5">
              <h3 className="font-display text-lg font-semibold text-bone">
                {item.name}
              </h3>
              <KineticBody className="mt-1.5 text-sm text-bone/80">
                {item.note}
              </KineticBody>
            </div>
          </div>
        </Reveal>
      ))}
    </ul>
  );
}
