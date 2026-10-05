"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { MQ } from "@/lib/motion";

const ROWS = [
  ["40 mm LCP driver", "42 dB adaptive ANC", "40 h battery", "38 ms latency", "LDAC", "LC3", "Bluetooth 5.4"],
  ["254 g", "4.2 N clamp", "8 microphones", "102 dB SPL/mW", "32 Ω", "4 Hz – 40 kHz", "USB-C 24/96"],
];

/**
 * Two counter-running rows whose speed and skew follow scroll velocity — the
 * page's one free-running loop. Under reduced motion it is a static two-line list.
 */
export default function SpecMarquee() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add({ full: MQ.full, lite: MQ.lite }, () => {
      const tracks = Array.from(el.querySelectorAll<HTMLElement>("[data-track]"));
      const pos = tracks.map(() => 0);
      let boost = 0;
      let visible = false;

      const st = ScrollTrigger.create({
        trigger: el,
        start: "top bottom",
        end: "bottom top",
        onToggle: (self) => (visible = self.isActive),
        onUpdate: (self) => {
          boost = gsap.utils.clamp(-14, 14, self.getVelocity() / 220);
        },
      });

      const skews = tracks.map((t) => gsap.quickTo(t, "skewX", { duration: 0.6, ease: "power3.out" }));

      const tick = (_: number, dt: number) => {
        if (!visible) return;
        boost *= 0.92;
        tracks.forEach((t, i) => {
          const dir = i % 2 ? 1 : -1;
          const half = t.scrollWidth / 2;
          pos[i] += dir * (0.045 * dt + Math.abs(boost) * dt * 0.06) * (boost < 0 ? -1 : 1);
          pos[i] = gsap.utils.wrap(-half, 0, pos[i]);
          gsap.set(t, { x: pos[i] });
          skews[i](-boost * 0.9 * dir);
        });
      };
      gsap.ticker.add(tick);
      return () => {
        gsap.ticker.remove(tick);
        st.kill();
      };
    });
    return () => mm.revert();
  }, []);

  return (
    <div ref={ref} className="flex flex-col gap-[22vh] overflow-hidden md:gap-[34vh]" aria-label="Key specifications">
      {ROWS.map((row, r) => (
        <div key={r} className="overflow-hidden whitespace-nowrap">
          <div data-track className="marquee-track">
            {[0, 1].map((copy) => (
              <ul key={copy} aria-hidden={copy === 1} className="flex shrink-0 items-center">
                {row.map((item, i) => (
                  <li
                    key={item}
                    className={`t-title flex items-center px-[2.5vw] ${
                      (i + r) % 2 ? "text-transparent [-webkit-text-stroke:1.5px_var(--ionosphere)]" : "text-ionosphere"
                    }`}
                  >
                    {item}
                    <span aria-hidden className="ml-[5vw] inline-block h-3 w-3 rounded-full bg-copper" />
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
