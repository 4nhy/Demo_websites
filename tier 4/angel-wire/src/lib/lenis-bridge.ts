/**
 * The one integration point between SmoothScroll's Lenis instance and
 * anything else that wants the page's real, physically-smoothed scroll
 * position — currently just AngelWire. A plain window CustomEvent rather
 * than React context: both consumers are effects reaching outside React's
 * tree anyway (DOM measurement, GSAP), and a shared event contract avoids
 * either one holding a ref to the other or duplicating magic strings.
 */
export const LENIS_SCROLL_EVENT = "lenis-scroll";

export type LenisScrollDetail = {
  /** Current smoothed scroll position, in pixels. */
  scroll: number;
  /** Maximum scrollable distance, in pixels. */
  limit: number;
  /** scroll / limit, clamped 0–1 by Lenis itself. */
  progress: number;
};
