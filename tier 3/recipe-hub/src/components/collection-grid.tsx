"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { unsplashUrl } from "@/lib/recipes";
import { getGsap, prefersReducedMotion } from "@/lib/gsap";

interface CollectionItem {
  cuisine: string;
  imageId: string;
  count: number;
  href: string;
}

export default function CollectionGrid({ items }: { items: CollectionItem[] }) {
  const gridRef = useRef<HTMLUListElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const reduced = prefersReducedMotion();
    const cards = cardRefs.current.filter((c): c is HTMLDivElement => !!c);

    if (reduced) return;

    const { gsap } = getGsap();
    const ctx = gsap.context(() => {
      // Stagger rotate-in as the grid scrolls into view.
      gsap.fromTo(
        cards,
        { opacity: 0, y: 40, rotateX: -18, transformPerspective: 800 },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 0.7,
          ease: "power2.out",
          stagger: 0.08,
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 85%",
            once: true,
          },
        }
      );
    });

    // 3D tilt-on-hover, cursor-following.
    const cleanups = cards.map((card) => {
      const inner = card.querySelector<HTMLElement>(".tilt-card__inner");
      if (!inner) return () => {};
      const quickX = gsap.quickTo(inner, "rotateY", {
        duration: 0.4,
        ease: "power3.out",
      });
      const quickY = gsap.quickTo(inner, "rotateX", {
        duration: 0.4,
        ease: "power3.out",
      });
      const quickLift = gsap.quickTo(inner, "y", {
        duration: 0.4,
        ease: "power3.out",
      });

      function handleMove(e: PointerEvent) {
        const rect = card.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        quickX(px * 14);
        quickY(py * -14);
        quickLift(-6);
      }
      function handleLeave() {
        quickX(0);
        quickY(0);
        quickLift(0);
      }

      card.addEventListener("pointermove", handleMove);
      card.addEventListener("pointerleave", handleLeave);
      return () => {
        card.removeEventListener("pointermove", handleMove);
        card.removeEventListener("pointerleave", handleLeave);
      };
    });

    return () => {
      ctx.revert();
      cleanups.forEach((fn) => fn());
    };
  }, [items]);

  return (
    <ul ref={gridRef} className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {items.map((item, i) => (
        <li key={item.cuisine} className="tilt-card">
          <div
            ref={(el) => {
              cardRefs.current[i] = el;
            }}
          >
            <Link
              href={item.href}
              className="tilt-card__inner group relative block aspect-4/3 overflow-hidden rounded-2xl shadow-[0_1px_2px_rgba(22,19,15,0.08)]"
            >
              <Image
                src={unsplashUrl(item.imageId, 480)}
                alt=""
                fill
                sizes="(min-width: 1024px) 22vw, 45vw"
                className="graded-photo object-cover transition-transform duration-500 group-hover:scale-[1.05]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/0 to-charcoal/0" />
              <div className="absolute inset-x-0 bottom-0 p-4">
                <p className="font-display font-semibold text-bone">
                  {item.cuisine}
                </p>
                <p className="text-xs text-bone/80">
                  {item.count} recipe{item.count === 1 ? "" : "s"}
                </p>
              </div>
            </Link>
          </div>
        </li>
      ))}
    </ul>
  );
}
