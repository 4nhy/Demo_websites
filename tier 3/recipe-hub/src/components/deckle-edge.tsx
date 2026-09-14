function buildTornClipPath(teeth: number) {
  const points: string[] = [];
  for (let i = 0; i <= teeth; i++) {
    const x = (i / teeth) * 100;
    const y = i % 2 === 0 ? 0 : 62;
    points.push(`${x}% ${y}%`);
  }
  points.push("100% 100%", "0% 100%");
  return `polygon(${points.join(",")})`;
}

const TORN_CLIP_PATH = buildTornClipPath(48);

interface DeckleEdgeProps {
  /** Tailwind background class of the section this edge belongs to. */
  className?: string;
}

/**
 * A torn/deckle paper edge along the top of a section, so each section
 * reads as "the next page" turned over rather than a flat div boundary.
 */
export default function DeckleEdge({ className = "bg-bone" }: DeckleEdgeProps) {
  return (
    <div
      aria-hidden
      className={`absolute inset-x-0 -top-3.5 h-4 ${className}`}
      style={{ clipPath: TORN_CLIP_PATH }}
    />
  );
}
