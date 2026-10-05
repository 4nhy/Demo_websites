"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { MQ, addAnimations, fontsReady, scheduleRefresh, type MotionConditions } from "@/lib/motion";
import { registerBackdrop, registerChapter, type PoseKey, type Tone } from "@/lib/scene-store";

type Props = {
  id?: string;
  className?: string;
  children: React.ReactNode;
  /**
   * pin   — pinned for `pin`% of extra scroll, timeline scrubbed (tablet+ only;
   *         below tablet it degrades to `play`)
   * scrub — not pinned, timeline scrubbed while the section crosses the viewport
   * play  — timeline plays once when the section enters
   */
  mode?: "pin" | "scrub" | "play";
  pin?: number;
  scrub?: number;
  playTime?: number;
  /** pose keyframes for the persistent 3D scene, t is 0..1 of this chapter */
  poses?: PoseKey[];
  /** backdrop colour; an array is interpolated across the chapter's progress */
  bg?: string | string[];
  tone?: Tone | Tone[];
  /** first-screen chapters: keep the pin, but play the timeline on load instead of scrubbing it */
  entrance?: boolean;
};

export default function Chapter({
  id,
  className = "",
  children,
  mode = "play",
  pin = 150,
  scrub = 0.9,
  playTime = 1.5,
  poses,
  bg = "#e8edf2",
  tone = "dark",
  entrance = false,
}: Props) {
  const ref = useRef<HTMLElement>(null);
  // props are static per page; capture once so the effect doesn't rebuild
  const config = useRef({ mode, pin, scrub, playTime, poses, bg, tone, entrance });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const { mode, pin, scrub, playTime, poses, bg, tone, entrance } = config.current;
    let mm: gsap.MatchMedia | null = null;
    let dead = false;

    fontsReady().then(() => {
      if (dead) return;
      mm = gsap.matchMedia();
      mm.add(MQ, (ctx) => {
        const c = ctx.conditions as MotionConditions;
        // pins choreograph the live scene; without it (no WebGL2) chapters flow normally
        const pinned = mode === "pin" && c.full && document.documentElement.dataset.scene === "3d";
        const scrubbed = !c.reduce && !entrance && (pinned || (mode === "scrub" && c.full));

        const tl = gsap.timeline({ paused: true });
        tl.to({}, { duration: 1 }, 0);
        if (!c.reduce) addAnimations(tl, el);

        const st = ScrollTrigger.create({
          trigger: el,
          start: pinned ? "top top" : "top 80%",
          end: pinned ? `+=${pin}%` : "bottom 20%",
          pin: pinned,
          anticipatePin: pinned ? 1 : 0,
          scrub: scrubbed ? scrub : false,
          ...(c.reduce || entrance ? {} : { animation: tl }),
          // ScrollTrigger splits this string, so omit the key rather than pass undefined
          ...(scrubbed || entrance || c.reduce ? {} : { toggleActions: "play none none none" }),
        });
        if (entrance && !c.reduce) tl.play(0);
        if (!scrubbed && !c.reduce) tl.timeScale(1 / playTime);
        if (c.reduce) tl.progress(1);

        const offPose = poses?.length ? registerChapter(st, poses) : undefined;
        const offBg = registerBackdrop({
          el,
          st,
          bg: Array.isArray(bg) ? bg : [bg],
          tone,
        });
        scheduleRefresh();

        return () => {
          offPose?.();
          offBg();
        };
      });
    });

    return () => {
      dead = true;
      mm?.revert();
    };
  }, []);

  return (
    <section id={id} ref={ref} data-chapter="" className={`relative ${className}`}>
      {children}
    </section>
  );
}
