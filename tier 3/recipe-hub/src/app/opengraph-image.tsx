import { ImageResponse } from "next/og";

export const alt = "Recipe Hub — cook what the season gives you";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#1A120C",
          color: "#F3EBDD",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 28,
            fontWeight: 600,
            letterSpacing: 2,
            color: "#C9591F",
            textTransform: "uppercase",
          }}
        >
          12 Recipes · 4 Cuisines
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 88,
            fontWeight: 700,
            lineHeight: 1.1,
            marginTop: 24,
            maxWidth: 900,
          }}
        >
          Cook what the season gives you.
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 30,
            color: "#F3EBDDaa",
            marginTop: 32,
          }}
        >
          Filter by cuisine, diet, and time — recipehub
        </div>
      </div>
    ),
    { ...size }
  );
}
