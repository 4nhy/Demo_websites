import type { Metadata } from "next";
import Chapter from "@/components/Chapter";
import ProductStudio from "@/components/ProductStudio";
import Still from "@/components/scene/Still";

export const metadata: Metadata = {
  title: "Drift One — Product",
  description: "Drift One in 3D: a full turn, the 90° swivel hinge, an exploded view of the earcup, and every colorway.",
};

const TAU = Math.PI * 2;
const wrap = "mx-auto w-full max-w-[1600px] px-4 sm:px-8 lg:px-10";

const LAYERS = [
  ["Cushion", "Protein leather over slow-recovery foam. Magnetic, so it swaps in seconds."],
  ["Grille", "Laser-perforated steel. The hole pattern is tuned as an acoustic resistor."],
  ["Driver", "40 mm carbon-reinforced LCP diaphragm on a CCAW voice coil."],
  ["Motor", "N52 neodymium dual-ring magnet with a steel top plate."],
  ["Shell", "PA12 with glass fibre, rear-vented and damped with wool felt."],
  ["Cap", "Machined, anodised twice, with a copper inlay ring."],
  ["Yoke", "6000-series aluminium fork on stainless swivel pins."],
];

export default function ProductPage() {
  return (
    <>
      {/* intro — the name at full width, the model rising underneath it */}
      <Chapter
        mode="pin"
        pin={110}
        entrance
        playTime={1.6}
        className="chapter-screen"
        poses={[
          { t: 0, pose: { vis: 1, x: 0.08, y: -0.36, s: 0.86, rx: 0.16, ry: -0.5, fold: 0, slide: 0, explode: 0, anc: 0, color: 0, fx: 0, fy: 0, fz: 0 } },
          { t: 1, pose: { y: -0.2, s: 0.95, ry: 0.15 }, ease: "power2.inOut" },
        ]}
      >
        <div className={`${wrap} flex h-full flex-col justify-between gap-8 pt-28 pb-10`}>
          <h1 className="t-mega" data-anim="chars-rise" data-dur="0.3">
            Drift One
          </h1>
          <Still src="/renders/slate.png" alt="Drift One in Slate, three-quarter view" priority className="aspect-square scene-fallback md:col-span-12 md:mx-auto md:w-full md:max-w-xl" />
          <div className="flex flex-wrap items-end justify-between gap-6">
            <p className="t-lede max-w-md text-ionosphere/75" data-anim="fade-up" data-at="0.15">
              Over-ear, wireless and adaptive. Four finishes, one 254 g frame. Scroll and it turns, swivels, and comes
              apart.
            </p>
            <p className="t-eyebrow text-ionosphere/55" data-anim="fade-up" data-at="0.25">Scroll ↓</p>
          </div>
        </div>
      </Chapter>

      {/* full turn — angle readout scrubbed to the rotation */}
      <Chapter
        mode="pin"
        pin={220}
        className="chapter-screen"
        poses={[
          { t: 0, pose: { x: 0.34, y: 0, s: 1, rx: 0.1, ry: 0 }, ease: "power2.inOut" },
          { t: 1, pose: { ry: TAU, rx: 0.32 }, ease: "none" },
        ]}
      >
        <div className={`${wrap} grid h-full content-between gap-8 pt-28 pb-12 md:grid-cols-12`}>
          <div className="md:col-span-6">
            <p className="t-eyebrow text-copper" data-anim="fade-up">360°</p>
            <h2 className="t-display mt-5" data-anim="skew-in" data-dur="0.25">
              No bad angle.
            </h2>
          </div>
          <Still src="/renders/graphite.png" alt="Drift One in Graphite" className="aspect-square scene-fallback md:col-span-12 md:mx-auto md:w-full md:max-w-xl" />
          <div className="md:col-span-6 md:col-start-1">
            <p className="t-mega" aria-hidden>
              <span data-count="360" data-at="0" data-dur="1" data-ease="none">360</span>
              <span className="text-copper">°</span>
            </p>
            <p className="t-lede mt-4 max-w-md text-ionosphere/70" data-anim="fade-up" data-at="0.3">
              No exposed screws and no visible seams on the shell. The only break in the surface is the copper ring, which
              also marks the touch zone.
            </p>
          </div>
        </div>
      </Chapter>

      {/* hinge — swivel flat, slider extends */}
      <Chapter
        mode="pin"
        pin={200}
        bg="#dde3ea"
        className="chapter-screen"
        poses={[
          { t: 0, pose: { x: -0.36, y: 0.04, s: 1, rx: 0.3, ry: TAU + 0.1, fold: 0, slide: 0 }, ease: "power2.inOut" },
          { t: 0.45, pose: { fold: 1 }, ease: "back.inOut(1.6)" },
          { t: 0.8, pose: { slide: 1, rx: 0.18 }, ease: "power3.inOut" },
          { t: 1, pose: { ry: TAU + 0.25 }, ease: "none" },
        ]}
      >
        <div className={`${wrap} grid h-full items-center gap-10 pt-28 pb-12 md:grid-cols-12`}>
          <Still src="/renders/hinge.png" alt="Earcups swivelled flat" className="aspect-square scene-fallback md:col-span-12 md:mx-auto md:w-full md:max-w-xl" />
          <div className="md:col-span-5 md:col-start-8">
            <p className="t-eyebrow text-copper" data-anim="fade-up">Hinge &amp; slider</p>
            <h2 className="t-title mt-5" data-anim="rise-tilt" data-dur="0.3">
              Folds flat. Fits every head.
            </h2>
            <p className="t-lede mt-6 text-ionosphere/70" data-anim="fade-up" data-at="0.2">
              The cups swivel a full 90° to lie flat in the case. Then the stainless sliders run out in eleven detents, so
              it clicks back to your size every time.
            </p>
            <dl className="mt-10 grid grid-cols-3 gap-6">
              <div>
                <dt className="t-eyebrow text-ionosphere/60">Swivel</dt>
                <dd className="t-num mt-2 text-5xl"><span data-count="90" data-at="0.1" data-dur="0.35" data-ease="back.inOut(1.6)">90</span>°</dd>
              </div>
              <div>
                <dt className="t-eyebrow text-ionosphere/60">Travel</dt>
                <dd className="t-num mt-2 text-5xl"><span data-count="22" data-at="0.5" data-dur="0.3">22</span>mm</dd>
              </div>
              <div>
                <dt className="t-eyebrow text-ionosphere/60">Detents</dt>
                <dd className="t-num mt-2 text-5xl"><span data-count="11" data-at="0.5" data-dur="0.3" data-ease="steps(11)">11</span></dd>
              </div>
            </dl>
          </div>
        </div>
      </Chapter>

      {/* exploded — numbered layers switch on as each part separates */}
      <Chapter
        mode="pin"
        pin={240}
        className="chapter-screen"
        poses={[
          { t: 0, pose: { x: -0.4, y: -0.02, s: 0.78, rx: 0.22, ry: TAU * 2 - 0.55, fold: 0, slide: 0, explode: 0 }, ease: "power2.inOut" },
          { t: 0.55, pose: { explode: 1, ry: TAU * 2 - 0.35 }, ease: "expo.inOut" },
          { t: 1, pose: { explode: 1, ry: TAU * 2 - 0.2 }, ease: "none" },
        ]}
      >
        <div className={`${wrap} grid h-full items-center gap-10 pt-28 pb-12 md:grid-cols-12`}>
          <Still src="/renders/exploded.png" alt="Exploded view of the earcup" className="aspect-[4/3] scene-fallback md:col-span-12 md:mx-auto md:w-full md:max-w-xl" />
          <div className="md:col-span-5 md:col-start-8">
            <h2 className="t-title" data-anim="words-scatter" data-dur="0.25">
              Seven layers, one job each.
            </h2>
            <ol className="mt-6 grid" data-anim="steps" data-marks="0.18,0.25,0.32,0.39,0.46,0.53,0.6">
              {LAYERS.map(([name, copy], i) => (
                <li key={name} className="grid grid-cols-[2.5rem_1fr] gap-3 border-t border-ionosphere/15 py-2">
                  <span className="font-mono text-xs text-copper">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <span data-step-line className="mb-2 block h-[2px] w-10 bg-copper" />
                    <p className="font-display text-base font-semibold">{name}</p>
                    <p className="text-xs leading-snug text-ionosphere/65 xl:text-sm">{copy}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Chapter>

      {/* studio — drag to orbit, live colorway switch */}
      <Chapter
        mode="play"
        poses={[
          { t: 0, pose: { x: 0, y: -0.16, s: 0.7, rx: 0.14, ry: TAU * 2 + 0.45, explode: 0 }, ease: "power3.inOut" },
          { t: 1, pose: { ry: TAU * 2 + 0.7 }, ease: "none" },
        ]}
      >
        <ProductStudio />
      </Chapter>
    </>
  );
}
