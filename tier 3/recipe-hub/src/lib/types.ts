export type Cuisine = "Italian" | "Thai" | "Mexican" | "Indian";

export type Diet = "vegetarian" | "vegan" | "gluten-free" | "dairy-free";

export type Difficulty = "Easy" | "Medium" | "Hard";

export interface RecipeImage {
  /** Unsplash photo id, e.g. "1562281556-0f8c259a9f3a" */
  id: string;
  alt: string;
  credit: {
    name: string;
    url: string;
  };
}

export interface Recipe {
  slug: string;
  title: string;
  cuisine: Cuisine;
  diets: Diet[];
  prepMinutes: number;
  cookMinutes: number;
  totalMinutes: number;
  servings: number;
  difficulty: Difficulty;
  description: string;
  image: RecipeImage;
  ingredients: string[];
  steps: string[];
  note?: string;
}

export const CUISINES: Cuisine[] = ["Italian", "Thai", "Mexican", "Indian"];

export const DIETS: Diet[] = [
  "vegetarian",
  "vegan",
  "gluten-free",
  "dairy-free",
];

export const TIME_BUCKETS = [
  { id: "under-30", label: "Under 30 min", min: 0, max: 30 },
  { id: "30-60", label: "30–60 min", min: 30, max: 60 },
  { id: "over-60", label: "Over 60 min", min: 60, max: Infinity },
] as const;

export type TimeBucketId = (typeof TIME_BUCKETS)[number]["id"];
