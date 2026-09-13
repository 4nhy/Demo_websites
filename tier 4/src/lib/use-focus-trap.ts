import { useEffect, useRef } from "react";

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

// Traps Tab/Shift+Tab within `panelRef` while `isOpen` is true, moves
// focus into it on open, and restores focus to whatever was focused
// beforehand on close. Both the cart drawer and checkout modal keep
// their panel permanently mounted (toggling via transform/opacity, not
// conditional rendering), so this is driven by `isOpen` rather than
// mount/unmount — and re-queries focusable elements live on every
// keypress, so it stays correct even when a panel's own content swaps
// (e.g. checkout's form -> its "order placed" confirmation).
export function useFocusTrap<T extends HTMLElement>(
  panelRef: React.RefObject<T | null>,
  isOpen: boolean
) {
  const lastFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const panel = panelRef.current;
    if (!panel) return;

    lastFocused.current = document.activeElement as HTMLElement | null;

    const focusables = () =>
      Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
        (el) => el.offsetParent !== null
      );

    // A frame's delay so this runs after the open transform/opacity
    // change has applied — focusing before that can fail silently on
    // an element that's still effectively hidden (0 offsetParent).
    const raf = requestAnimationFrame(() => focusables()[0]?.focus());

    const onKeydown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const items = focusables();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    panel.addEventListener("keydown", onKeydown);

    return () => {
      cancelAnimationFrame(raf);
      panel.removeEventListener("keydown", onKeydown);
      lastFocused.current?.focus();
    };
  }, [isOpen, panelRef]);
}
