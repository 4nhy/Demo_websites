import type { Metadata } from "next";
import Chapter from "@/components/Chapter";
import BuyConfigurator from "@/components/BuyConfigurator";
import { FAQ, IN_THE_BOX } from "@/lib/specs";

export const metadata: Metadata = {
  title: "Buy Drift One",
  description: "Choose a colorway: Slate, Glacier, Rosewood or Graphite. $329 with free shipping, 30-day returns and a 2-year warranty.",
};

const wrap = "mx-auto w-full max-w-[1600px] px-4 sm:px-8 lg:px-10";

export default function BuyPage() {
  return (
    <>
      <Chapter
        mode="play"
        poses={[
          { t: 0, pose: { vis: 1, x: -0.46, y: 0.02, s: 0.95, rx: 0.14, ry: -0.55, fold: 0, slide: 0, explode: 0, anc: 0, color: 0, fx: 0, fy: 0, fz: 0 } },
          { t: 1, pose: { ry: -0.3 }, ease: "none" },
        ]}
      >
        <BuyConfigurator />
      </Chapter>

      {/* the model steps aside for the reading sections */}
      <Chapter
        id="box"
        mode="play"
        className="py-28 md:py-40"
        poses={[{ t: 0, pose: { vis: 0, y: 0.3, s: 0.8 }, ease: "power2.in" }]}
      >
        <div className={`${wrap} grid gap-12 md:grid-cols-12`}>
          <div className="md:col-span-5">
            <p className="t-eyebrow text-copper" data-anim="fade-up">In the box</p>
            <h2 className="t-title mt-5" data-anim="lines-mask" data-dur="0.3">
              Everything, and nothing extra.
            </h2>
          </div>
          <ol className="md:col-span-7" data-anim="stagger-up" data-at="0.15" data-dur="0.5">
            {IN_THE_BOX.map((b, i) => (
              <li key={b.item} className="grid grid-cols-[3rem_1fr] items-baseline gap-4 border-t border-ionosphere/15 py-6">
                <span className="font-mono text-xs text-copper">{String(i + 1).padStart(2, "0")}</span>
                <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                  <p className="font-display text-2xl font-semibold md:text-3xl">{b.item}</p>
                  <p className="text-sm text-ionosphere/60">{b.note}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Chapter>

      <Chapter id="faq" mode="play" bg="#0e1b2e" tone="light" className="py-28 text-signal md:py-40">
        <div className={`${wrap} grid gap-12 md:grid-cols-12`}>
          <div className="md:col-span-5">
            <p className="t-eyebrow text-copper-glow" data-anim="fade-up">Questions</p>
            <h2 className="t-title mt-5" data-anim="blur-in" data-dur="0.3">
              Before you decide.
            </h2>
          </div>
          <div className="md:col-span-7" data-anim="stagger-up" data-at="0.1" data-dur="0.5">
            {FAQ.map((f) => (
              <details key={f.q} className="faq group border-t border-signal/15 py-6 last:border-b">
                <summary className="flex items-start justify-between gap-6">
                  <span className="font-display text-xl font-semibold md:text-2xl">{f.q}</span>
                  <span aria-hidden className="faq-icon mt-1 text-2xl leading-none text-copper-glow">+</span>
                </summary>
                <p className="mt-4 max-w-2xl leading-relaxed text-signal/70">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </Chapter>
    </>
  );
}
