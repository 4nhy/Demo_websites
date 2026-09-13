"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

// Resting transform the entrance settles into, and reduced-motion renders
// directly — kept as one constant so both paths agree.
const REST = { rotate: -4 };
// Translucent atmosphere behind the type, not a fully opaque photo
// competing with it — tuned by eye in the 40-55% range asked for.
const LEAF_OPACITY = 0.48;

// Three independent motion layers, split across two nested elements so
// GSAP's transform tracking doesn't fight itself:
// - outer (parallaxRef): scroll-tied, driven by ScrollTrigger scrub —
//   real depth as you scroll past the hero, not eased independently.
// - inner (swayRef): the one-time entrance, then a slow continuous idle
//   sway — both local, not scroll-tied.
export default function HeroLeaf({
  className,
  sectionRef,
}: {
  className?: string;
  sectionRef: React.RefObject<HTMLElement | null>;
}) {
  const reduced = usePrefersReducedMotion();
  const parallaxRef = useRef<HTMLDivElement>(null);
  const swayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduced) return;
    const swayEl = swayRef.current;
    const parallaxEl = parallaxRef.current;
    const section = sectionRef.current;
    if (!swayEl || !parallaxEl || !section) return;

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to(swayEl, {
          rotate: REST.rotate + 3,
          y: -10,
          duration: 4.5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      },
    });
    // Chrome's LCP tracking waits for an animating element's paint to
    // settle before recording it — this image is the page's LCP element,
    // so a slower entrance directly costs LCP score. 0.6s still reads as
    // a real entrance, not an instant snap.
    tl.fromTo(
      swayEl,
      { opacity: 0, scale: 0.82, y: 28, rotate: REST.rotate - 6 },
      {
        opacity: LEAF_OPACITY,
        scale: 1,
        y: 0,
        rotate: REST.rotate,
        duration: 0.6,
        ease: "power3.out",
      }
    );

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "bottom top",
      scrub: 0.5,
      onUpdate: (self) => {
        gsap.set(parallaxEl, {
          y: self.progress * -120,
          scale: 1 - self.progress * 0.12,
        });
      },
    });

    return () => {
      tl.kill();
      trigger.kill();
      gsap.killTweensOf(swayEl);
    };
  }, [reduced, sectionRef]);

  return (
    <div ref={parallaxRef} className={className}>
      <div
        ref={swayRef}
        className="relative h-full w-full"
        style={
          reduced
            ? { opacity: LEAF_OPACITY, transform: `rotate(${REST.rotate}deg)` }
            : { opacity: 0 }
        }
      >
        <Image
          src="/images/cutouts/monstera-leaf.png"
          alt=""
          aria-hidden="true"
          fill
          fetchPriority="high"
          loading="eager"
          sizes="(min-width: 768px) 55vw, 90vw"
          className="object-contain"
        />
      </div>
    </div>
  );
}
