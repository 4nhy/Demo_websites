import { forwardRef } from "react";

/**
 * The traveling disc — DIRECTION.md "Signature". A solid red registration
 * mark, not a decorative blob. `position: fixed` — HomeView drives it
 * through one continuous scrub timeline across the whole page, visible only
 * while it's mid-transit between sections: as it approaches each waypoint
 * (stat strip, category grid, CTA wordmark) it fades out and a real
 * `[data-disc-dock]` element already sitting in that section's own layout
 * fades in to take over, so it never reads as a fixed shape parked on top
 * of content. z-index starts at 30 (above ordinary content, below the
 * sticky header's z-40) but HomeView drops it to 10 while parked in the
 * hero — behind the kinetic headline's z-20 — and restores it to 30 the
 * moment it starts traveling again.
 */
const Disc = forwardRef<HTMLDivElement>(function Disc(_props, ref) {
  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed h-24 w-24 rounded-full bg-red opacity-0 will-change-transform"
    />
  );
});

export default Disc;
