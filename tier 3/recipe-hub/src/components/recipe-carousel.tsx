"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Recipe } from "@/lib/types";
import { unsplashUrl } from "@/lib/recipes";
import { prefersReducedMotion } from "@/lib/gsap";
import { ChevronDownIcon } from "./icons";

/**
 * The food-app carousel mechanic: a horizontally scrollable row of
 * photo-forward cards with minimal text overlay, plus prev/next arrows and
 * pointer-drag with momentum — without the dark backdrop or video-player
 * chrome of the reference.
 */
export default function RecipeCarousel({ recipes }: { recipes: Recipe[] }) {
  const trackRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const reduced = prefersReducedMotion();

    let dragging = false;
    let startX = 0;
    let startScroll = 0;
    let lastX = 0;
    let lastT = 0;
    let velocity = 0;
    let momentumFrame = 0;

    function stopMomentum() {
      if (momentumFrame) cancelAnimationFrame(momentumFrame);
      momentumFrame = 0;
    }

    function glide() {
      if (!track) return;
      velocity *= 0.94; // friction
      track.scrollLeft -= velocity;
      if (Math.abs(velocity) > 0.5) {
        momentumFrame = requestAnimationFrame(glide);
      } else {
        momentumFrame = 0;
      }
    }

    function onPointerDown(e: PointerEvent) {
      if (!track) return;
      dragging = true;
      stopMomentum();
      startX = e.clientX;
      startScroll = track.scrollLeft;
      lastX = e.clientX;
      lastT = performance.now();
      velocity = 0;
      track.setPointerCapture(e.pointerId);
      track.style.scrollSnapType = "none";
      track.style.cursor = "grabbing";
    }

    function onPointerMove(e: PointerEvent) {
      if (!dragging || !track) return;
      const dx = e.clientX - startX;
      track.scrollLeft = startScroll - dx;

      const now = performance.now();
      const dt = now - lastT;
      if (dt > 0) {
        velocity = ((e.clientX - lastX) / dt) * 16; // px per frame (~60fps)
      }
      lastX = e.clientX;
      lastT = now;
    }

    function endDrag(e: PointerEvent) {
      if (!dragging || !track) return;
      dragging = false;
      track.releasePointerCapture(e.pointerId);
      track.style.scrollSnapType = "x proximity";
      track.style.cursor = "grab";
      if (!reduced && Math.abs(velocity) > 0.5) {
        glide();
      }
    }

    track.addEventListener("pointerdown", onPointerDown);
    track.addEventListener("pointermove", onPointerMove);
    track.addEventListener("pointerup", endDrag);
    track.addEventListener("pointercancel", endDrag);

    return () => {
      stopMomentum();
      track.removeEventListener("pointerdown", onPointerDown);
      track.removeEventListener("pointermove", onPointerMove);
      track.removeEventListener("pointerup", endDrag);
      track.removeEventListener("pointercancel", endDrag);
    };
  }, []);

  function scrollByCard(direction: 1 | -1) {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector("li");
    const distance = (card?.clientWidth ?? 320) + 20;
    track.scrollBy({ left: distance * direction, behavior: "smooth" });
  }

  return (
    <div className="relative">
      <ul
        ref={trackRef}
        className="carousel-track flex cursor-grab gap-5 overflow-x-auto scroll-pl-5 pb-2 pl-5 select-none md:pl-8"
      >
        {recipes.map((recipe) => (
          <li
            key={recipe.slug}
            className="carousel-item w-[78vw] shrink-0 sm:w-[360px]"
          >
            <Link
              href={`/recipes/${recipe.slug}`}
              draggable={false}
              className="group relative block aspect-4/5 overflow-hidden rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-olive"
            >
              <Image
                src={unsplashUrl(recipe.image.id, 640)}
                alt={recipe.image.alt}
                fill
                draggable={false}
                sizes="(min-width: 640px) 360px, 78vw"
                className="graded-photo pointer-events-none object-cover transition-transform duration-500 group-hover:scale-[1.05]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/85 via-charcoal/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-5">
                <div>
                  <p className="text-xs font-medium text-bone/75 uppercase tracking-wide">
                    {recipe.cuisine}
                  </p>
                  <p className="font-display text-lg font-semibold text-bone">
                    {recipe.title}
                  </p>
                </div>
                <span className="badge badge--terracotta shrink-0">
                  {recipe.totalMinutes} min
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
      <div className="mt-5 hidden justify-end gap-2 px-5 md:flex md:px-8">
        <button
          type="button"
          onClick={() => scrollByCard(-1)}
          aria-label="Previous recipes"
          className="flex size-11 items-center justify-center rounded-full border border-line bg-paper text-ink transition-colors hover:border-terracotta hover:text-terracotta"
        >
          <ChevronDownIcon className="size-4 rotate-90" />
        </button>
        <button
          type="button"
          onClick={() => scrollByCard(1)}
          aria-label="Next recipes"
          className="flex size-11 items-center justify-center rounded-full border border-line bg-paper text-ink transition-colors hover:border-terracotta hover:text-terracotta"
        >
          <ChevronDownIcon className="size-4 -rotate-90" />
        </button>
      </div>
    </div>
  );
}
