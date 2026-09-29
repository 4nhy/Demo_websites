import { ImageResponse } from "next/og";

export const alt = "The Roster — open roles at companies building real things";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "#0a0a0a",
          padding: "80px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: "#cc2a14",
              display: "flex",
            }}
          />
          <div
            style={{
              fontSize: 96,
              fontWeight: 900,
              color: "#ffffff",
              letterSpacing: "-0.02em",
              display: "flex",
            }}
          >
            The Roster
          </div>
        </div>
        <div
          style={{
            marginTop: 32,
            fontSize: 32,
            color: "rgba(255,255,255,0.7)",
            display: "flex",
          }}
        >
          Open roles, no noise.
        </div>
      </div>
    ),
    { ...size }
  );
}
