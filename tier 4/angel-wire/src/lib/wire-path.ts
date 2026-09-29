/**
 * Geometry helpers for the ANGEL WIRE signature element — a single persistent
 * thread that winds through the page, occasionally passing behind imagery and
 * re-emerging elsewhere. See DIRECTION.md and the Stage 2.5 conversation for
 * the concept; this file only builds the path data, it knows nothing about
 * DOM, React, or GSAP.
 */

export type Pt = { x: number; y: number };

export type Anchor = { id: string; layer: "front" | "back" };

export type Run = { layer: "front" | "back"; points: Pt[] };

/**
 * Catmull-Rom → cubic Bezier conversion (uniform tension, 1/6), the standard
 * way to draw a smooth curve *through* an ordered list of points rather than
 * merely near them. Two points falls back to a straight line.
 */
export function smoothPath(points: Pt[]): string {
  if (points.length === 0) return "";
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;
  if (points.length === 2) {
    const [a, b] = points;
    return `M ${a.x} ${a.y} L ${b.x} ${b.y}`;
  }
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2.x} ${p2.y}`;
  }
  return d;
}

/**
 * Groups an ordered anchor list into runs of consecutive same-layer
 * segments. The anchor at a layer boundary is shared as the last point of
 * one run and the first point of the next, so runs join into one visually
 * continuous line even though each run is a separate SVG element — that
 * split is exactly what lets the wire switch z-index bands (behind an image,
 * then in front of the next one) mid-path without a gap or a jump.
 */
export function buildRuns(anchors: Anchor[], points: Record<string, Pt>): Run[] {
  const runs: Run[] = [];
  let i = 0;
  while (i < anchors.length - 1) {
    const layer = anchors[i].layer;
    const first = points[anchors[i].id];
    if (!first) {
      i++;
      continue;
    }
    const runPoints: Pt[] = [first];
    let j = i;
    while (j < anchors.length - 1 && anchors[j].layer === layer) {
      const next = points[anchors[j + 1].id];
      if (next) runPoints.push(next);
      j++;
    }
    if (runPoints.length >= 2) runs.push({ layer, points: runPoints });
    i = j;
  }
  return runs;
}
