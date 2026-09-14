import { ImageResponse } from "next/og";
import { getAllRecipes, getRecipeBySlug, unsplashUrl } from "@/lib/recipes";

export const alt = "Recipe Hub recipe photo";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return getAllRecipes().map((recipe) => ({ slug: recipe.slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const recipe = getRecipeBySlug(slug);

  if (!recipe) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#1A120C",
            color: "#F3EBDD",
            fontSize: 56,
          }}
        >
          Recipe Hub
        </div>
      ),
      { ...size }
    );
  }

  const photo = await fetch(unsplashUrl(recipe.image.id, 1200)).then((res) =>
    res.arrayBuffer()
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: "#1A120C",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photo as unknown as string}
          alt=""
          width={1200}
          height={630}
          style={{ objectFit: "cover", filter: "contrast(1.08) saturate(0.9) brightness(0.75)" }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            padding: "64px",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 26,
              fontWeight: 600,
              letterSpacing: 2,
              textTransform: "uppercase",
              color: "#C9591F",
            }}
          >
            {recipe.cuisine} · {recipe.totalMinutes} min
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 72,
              fontWeight: 700,
              color: "#F3EBDD",
              marginTop: 16,
              maxWidth: 1000,
            }}
          >
            {recipe.title}
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
