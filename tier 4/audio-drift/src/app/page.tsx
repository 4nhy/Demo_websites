import Link from "next/link";
import Hero from "@/components/Hero";
import Chapter from "@/components/Chapter";
import SpecMarquee from "@/components/SpecMarquee";
import Still from "@/components/scene/Still";
import { COLORWAYS, COMPARISON, PRICE } from "@/lib/specs";

const TAU = Math.PI * 2;
const wrap = "mx-auto w-full max-w-[1600px] px-4 sm:px-8 lg:px-10";

// deterministic "noise" for the ANC bars (server and client agree)
const NOISE = Array.from({ length: 56 }, (_, i) => 0.25 + 0.75 * Math.abs(Math.sin(i * 1.7) * Math.cos(i * 0.43)));

const PARTS = [
  ["01", "Memory-foam cushion", "Slow-recovery, protein leather"],
  ["02", "Perforated grille", "Tuned acoustic resistance"],
  ["03", "40 mm LCP diaphragm", "Carbon-reinforced, 0.3 g"],
  ["04", "Voice coil", "Copper-clad aluminium"],
  ["05", "N52 magnet", "Dual-ring neodymium"],
  ["06", "Earcup shell", "PA12 + glass fibre, rear-vented"],
  ["07", "Machined cap", "Anodised, copper inlay"],
];

const MATERIALS = [
  ["Protein leather", "Over slow-recovery foam that takes four seconds to rebound, so it settles to your jaw instead of pushing back on it."],
  ["Anodised aluminium", "Bead-blasted 6000-series yokes, anodised twice, so keys in a bag don't mark them."],
  ["Spring steel", "A stainless headband core that holds 4.2 N of clamping force for years, not weeks."],
  ["PA12 + glass fibre", "Earcup shells stiff enough to keep their resonances out of the audible band, at 48 g a pair."],
];

export default function Home() {
  return (
    <>
      {/* 01 — The Descent (unchanged) */}
      <Hero />

      {/* 02 — Meet: orbit to show the hinge. Character: chars rise on expo, numbers tick up */}
      <Chapter
        id="meet"
        mode="pin"
        pin={180}
        className="chapter-screen"
        poses={[
          { t: -0.45, pose: { vis: 0, x: 0.42, y: -0.18, s: 0.8, rx: 0.1, ry: -1.1 } },
          { t: 0.02, pose: { vis: 1, s: 1.05, ry: -0.4 }, ease: "power3.out" },
          { t: 0.5, pose: { ry: 1.35, rx: 0.24, fold: 1, x: 0.4, y: -0.02, s: 0.92 }, ease: "expo.inOut" },
          { t: 0.72, pose: { ry: 1.6 }, ease: "none" },
          { t: 1, pose: { ry: 2.9, fold: 0, rx: 0.1, y: -0.12, s: 1 }, ease: "power2.inOut" },
        ]}
      >
        <div className={`${wrap} grid h-full content-between gap-10 pt-28 pb-12 md:grid-cols-12`}>
          <div className="md:col-span-12">
            <p className="t-eyebrow text-copper" data-anim="fade-up">Drift One</p>
            <h2 className="t-display mt-5" data-anim="chars-rise" data-at="0.02" data-dur="0.32">
              Forty-one parts.
              <br />
              One motion.
            </h2>
          </div>
          <Still src="/renders/hinge.png" alt="Drift One with both earcups swivelled flat" className="aspect-square scene-fallback md:col-span-12 md:mx-auto md:w-full md:max-w-xl" />
          <div className="md:col-span-5">
            <p className="t-lede max-w-md text-ionosphere/75" data-anim="fade-up" data-at="0.3">
              Each yoke swivels 90° on a stainless pin and the cups fold flat against your collarbone. Nothing creaks,
              because nothing is clipped together. Every joint is machined.
            </p>
            <dl className="mt-10 grid max-w-md grid-cols-3 gap-6" data-anim="stagger-up" data-at="0.42" data-dur="0.25">
              <div>
                <dt className="t-eyebrow text-ionosphere/60">Swivel</dt>
                <dd className="t-num mt-2 text-5xl"><span data-count="90" data-at="0.45" data-dur="0.3">90</span>°</dd>
              </div>
              <div>
                <dt className="t-eyebrow text-ionosphere/60">Weight</dt>
                <dd className="t-num mt-2 text-5xl"><span data-count="254" data-from="180" data-at="0.48" data-dur="0.3">254</span>g</dd>
              </div>
              <div>
                <dt className="t-eyebrow text-ionosphere/60">Clamp</dt>
                <dd className="t-num mt-2 text-5xl"><span data-count="4.2" data-decimals="1" data-at="0.51" data-dur="0.3">4.2</span>N</dd>
              </div>
            </dl>
          </div>
        </div>
      </Chapter>

      {/* 03 — ANC: expanding rings, the noise floor flattens. Character: masked lines on power4, circ collapse */}
      <Chapter
        id="anc"
        mode="pin"
        pin={200}
        bg="#0e1b2e"
        tone="light"
        className="text-signal chapter-screen"
        poses={[
          { t: 0, pose: { x: 0.44, y: 0.12, s: 0.92, rx: 0.05, ry: 4.46, fold: 0, anc: 0 }, ease: "power2.inOut" },
          { t: 0.22, pose: { anc: 1 }, ease: "power2.out" },
          { t: 0.8, pose: { ry: 4.62, s: 1 }, ease: "none" },
          { t: 1, pose: { anc: 0.25, ry: 4.9 }, ease: "power1.in" },
        ]}
      >
        <div className={`${wrap} grid h-full content-between gap-10 pt-28 pb-12 md:grid-cols-12`}>
          <div className="md:col-span-6">
            <p className="t-eyebrow text-copper-glow" data-anim="fade-up">Adaptive noise cancelling</p>
            <h2 className="t-title mt-5" data-anim="lines-mask" data-at="0.04" data-dur="0.3">
              The room,
              <br />
              subtracted.
            </h2>
            <p className="t-lede mt-8 max-w-md text-signal/70" data-anim="lines-mask" data-at="0.2" data-dur="0.25">
              Six microphones listen to the room and to the air inside each cup. A dedicated DSP builds the inverse
              waveform and re-tunes its filter every 20 ms, so the quiet holds through a braking train or a cabin door
              sealing.
            </p>
          </div>
          <Still src="/renders/anc.png" alt="Drift One in profile with noise-cancelling wavefronts" className="aspect-square scene-fallback md:col-span-12 md:mx-auto md:w-full md:max-w-xl" />
          <div className="md:col-span-12">
            <div className="mb-6 flex h-16 items-center gap-[3px] md:h-24" aria-hidden data-anim="flatten" data-at="0.3" data-dur="0.45">
              {NOISE.map((h, i) => (
                <span key={i} className="block h-full flex-1 rounded-full bg-signal/30" style={{ transform: `scaleY(${h.toFixed(3)})` }} />
              ))}
            </div>
            <div className="flex flex-wrap items-end justify-between gap-8">
              <p className="t-mega" aria-label="Minus 42 decibels">
                −<span data-count="42" data-at="0.3" data-dur="0.45" data-ease="circ.inOut">42</span>
                <span className="ml-[0.08em] text-[0.45em] tracking-tight text-copper-glow">dB</span>
              </p>
              <dl className="grid grid-cols-3 gap-8 pb-4" data-anim="stagger-up" data-at="0.6" data-dur="0.2">
                {[["Microphones", "8"], ["Re-tune", "20 ms"], ["Peak at", "200 Hz"]].map(([k, v]) => (
                  <div key={k}>
                    <dt className="t-eyebrow text-signal/55">{k}</dt>
                    <dd className="t-num mt-2 text-3xl md:text-4xl">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </Chapter>

      {/* 04 — Sound: exploded view. Character: words scatter in (back.out), callouts switch on in hard steps */}
      <Chapter
        id="sound"
        mode="pin"
        pin={220}
        className="chapter-screen"
        poses={[
          { t: 0, pose: { x: 0, y: -0.16, s: 0.68, rx: 0.2, ry: 5.78, anc: 0, explode: 0 }, ease: "power2.inOut" },
          { t: 0.18, pose: { explode: 0 }, ease: "none" },
          { t: 0.62, pose: { explode: 1, ry: 5.98 }, ease: "expo.inOut" },
          { t: 1, pose: { explode: 1, ry: 6.12 }, ease: "none" },
        ]}
      >
        <div className={`${wrap} flex h-full flex-col justify-between gap-10 pt-28 pb-10`}>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h2 className="t-title max-w-4xl" data-anim="words-scatter" data-at="0" data-dur="0.3">
              Seven layers between you and the music.
            </h2>
            <p className="max-w-sm text-ionosphere/70" data-anim="fade-up" data-at="0.2">
              Pull a cup apart and every layer has a job. The grille is an acoustic resistor, and the shell&apos;s rear
              vent is sized to the driver&apos;s 28 Hz resonance.
            </p>
          </div>
          <Still src="/renders/exploded.png" alt="Exploded view of the Drift One earcup" className="aspect-[4/3] scene-fallback md:col-span-12 md:mx-auto md:w-full md:max-w-xl" />
          <ol className="grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4 lg:grid-cols-7" data-anim="steps" data-marks="0.32,0.38,0.44,0.5,0.56,0.62,0.68">
            {PARTS.map(([n, name, note]) => (
              <li key={n} className="border-t border-ionosphere/20 pt-3">
                <span data-step-line className="mb-3 block h-[2px] w-full -translate-y-[13px] bg-copper" />
                <span className="font-mono text-xs text-copper">{n}</span>
                <p className="mt-1 font-medium leading-snug">{name}</p>
                <p className="mt-1 text-sm text-ionosphere/60">{note}</p>
              </li>
            ))}
          </ol>
        </div>
      </Chapter>

      {/* 05 — Materials: close-up on the earcup. Character: blur-to-sharp, cards skew in from the right */}
      <Chapter
        id="materials"
        mode="pin"
        pin={200}
        bg="#dde3ea"
        className="chapter-screen"
        poses={[
          { t: 0, pose: { explode: 0, x: 0.36, y: -0.02, s: 2.3, fx: 1, fy: -0.62, fz: 0, rx: 0.16, ry: 5.06 }, ease: "power3.inOut" },
          { t: 1, pose: { ry: 4.38, rx: -0.04, s: 2.5 }, ease: "sine.inOut" },
        ]}
      >
        <div className={`${wrap} grid h-full items-center gap-10 pt-28 pb-12 md:grid-cols-12`}>
          <div className="md:col-span-5">
            <p className="t-eyebrow text-copper" data-anim="fade-up">Materials &amp; build</p>
            <h2 className="t-title mt-5" data-anim="blur-in" data-at="0.02" data-dur="0.3">
              Made to be touched.
            </h2>
            <ul className="mt-10 grid gap-3" data-anim="stagger-left" data-at="0.25" data-dur="0.45">
              {MATERIALS.map(([name, copy]) => (
                <li key={name} className="rounded-2xl border border-ionosphere/10 bg-signal/60 p-5 backdrop-blur-sm">
                  <p className="font-display text-xl font-semibold">{name}</p>
                  <p className="mt-1 text-sm leading-relaxed text-ionosphere/70">{copy}</p>
                </li>
              ))}
            </ul>
          </div>
          <Still src="/renders/closeup.png" alt="Close-up of the earcup, cushion and yoke" className="aspect-square scene-fallback md:col-span-12 md:mx-auto md:w-full md:max-w-xl" />
        </div>
      </Chapter>

      {/* 06 — Battery: huge scrubbed counter. Character: scale-in from depth, bar sweeps on expo */}
      <Chapter
        id="battery"
        mode="pin"
        pin={160}
        className="chapter-screen"
        poses={[
          { t: 0, pose: { fx: 0, fy: 0, fz: 0, x: 0.5, y: 0.1, s: 0.86, rx: 0.14, ry: 5.9 }, ease: "power3.inOut" },
          { t: 1, pose: { ry: 7.3 }, ease: "none" },
        ]}
      >
        <div className={`${wrap} grid h-full content-between gap-10 pt-28 pb-12 md:grid-cols-12`}>
          <div className="md:col-span-6">
            <p className="t-eyebrow text-copper" data-anim="fade-up">Battery</p>
            <h2 className="t-title mt-5" data-anim="clip-left" data-at="0.04" data-dur="0.3">
              A week of commutes on one charge.
            </h2>
          </div>
          <Still src="/renders/glacier.png" alt="Drift One in Glacier" className="aspect-square scene-fallback md:col-span-12 md:mx-auto md:w-full md:max-w-xl" />
          <div className="md:col-span-12">
            <div className="flex flex-wrap items-end gap-x-12 gap-y-6">
              <p className="t-mega" data-anim="scale-in" data-at="0.08" data-dur="0.35">
                <span data-count="40" data-at="0.1" data-dur="0.5" data-ease="power1.out">40</span>
                <span className="text-[0.45em] text-copper">h</span>
              </p>
              <dl className="grid grid-cols-2 gap-10 pb-6">
                <div>
                  <dt className="t-eyebrow text-ionosphere/60">ANC off</dt>
                  <dd className="t-num mt-2 text-4xl"><span data-count="55" data-at="0.4" data-dur="0.3">55</span> h</dd>
                </div>
                <div>
                  <dt className="t-eyebrow text-ionosphere/60">5 min charge</dt>
                  <dd className="t-num mt-2 text-4xl"><span data-count="4" data-at="0.45" data-dur="0.3">4</span> h play</dd>
                </div>
              </dl>
            </div>
            <div className="mt-8" aria-hidden>
              <div className="relative h-3 overflow-hidden rounded-full bg-ionosphere/10">
                <div className="absolute inset-y-0 left-0 w-full rounded-full bg-gradient-to-r from-copper to-copper-glow" data-anim="bar" data-at="0.1" data-dur="0.5" />
              </div>
              <div className="mt-3 flex justify-between font-mono text-[11px] text-ionosphere/50">
                {[0, 10, 20, 30, 40].map((h) => (
                  <span key={h}>{h} h</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Chapter>

      {/* 07 — Colorway morph: the model's finish crossfades, backdrop follows. Character: odometer rolls */}
      <Chapter
        id="colorways"
        mode="pin"
        pin={260}
        bg={["#d9dee5", "#d9dee5", "#d9dee5", "#dde9f1", "#dde9f1", "#ecdcd4", "#ecdcd4", "#c9cdd3", "#c9cdd3"]}
        className="chapter-screen"
        poses={[
          { t: 0, pose: { x: 0.3, y: 0.14, s: 0.76, rx: 0.16, ry: 7.7, color: 0 }, ease: "power2.inOut" },
          { t: 0.24, pose: { ry: 8.2 }, ease: "none" },
          { t: 0.36, pose: { color: 1, ry: 8.6 }, ease: "power2.inOut" },
          { t: 0.49, pose: { ry: 8.9 }, ease: "none" },
          { t: 0.61, pose: { color: 2, ry: 9.3 }, ease: "power2.inOut" },
          { t: 0.74, pose: { ry: 9.6 }, ease: "none" },
          { t: 0.86, pose: { color: 3, ry: 10 }, ease: "power2.inOut" },
          { t: 1, pose: { ry: 10.2 }, ease: "none" },
        ]}
      >
        <div className={`${wrap} flex h-full flex-col justify-between gap-8 pt-28 pb-12`}>
          <div className="flex items-start justify-between gap-6">
            <p className="t-eyebrow text-copper" data-anim="fade-up">Four finishes</p>
            <p className="t-eyebrow text-ionosphere/60" data-anim="fade-up" data-at="0.05">Same sound in every one</p>
          </div>
          <div className="scene-fallback grid grid-cols-2 gap-3 md:grid-cols-4">
            {COLORWAYS.map((c) => (
              <Still key={c.id} src={`/renders/${c.id}.png`} alt={`Drift One in ${c.name}`} className="aspect-square" sizes="50vw" />
            ))}
          </div>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <h2 className="t-display md:hidden">Four finishes.</h2>
              <div className="t-mega hidden h-[0.95em] overflow-hidden md:block">
                <h2 className="sr-only">Four finishes: Slate, Glacier, Rosewood and Graphite</h2>
                <div data-anim="roll" data-marks="0.3,0.55,0.8" data-dur="0.1" aria-hidden>
                  {COLORWAYS.map((c) => (
                    <p key={c.id} className="h-[0.95em]">{c.name}</p>
                  ))}
                </div>
              </div>
              <div className="mt-4 hidden h-7 overflow-hidden md:block">
                <div data-anim="roll" data-marks="0.3,0.55,0.8" data-dur="0.1" data-ease="power2.inOut">
                  {COLORWAYS.map((c) => (
                    <p key={c.id} className="h-7 text-lg leading-7 text-ionosphere/70">{c.finish}</p>
                  ))}
                </div>
              </div>
            </div>
            <ul className="flex gap-3 pb-4" aria-label="Colorways">
              {COLORWAYS.map((c) => (
                <li key={c.id} className="flex flex-col items-center gap-2">
                  <span className="block h-8 w-8 rounded-full ring-1 ring-ionosphere/20" style={{ background: c.swatch }} />
                  <span className="font-mono text-[10px] tracking-[0.12em] uppercase">{c.name}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Chapter>

      {/* 08 — Spec marquee: velocity-driven rows around a small, slowly turning model */}
      <Chapter
        id="specs"
        mode="scrub"
        className="py-24 md:py-32"
        poses={[
          { t: 0, pose: { x: 0, y: -0.04, s: 0.46, rx: 0.32, ry: 10.6 }, ease: "power2.inOut" },
          { t: 1, pose: { ry: 12.2, rx: 0.2 }, ease: "none" },
        ]}
      >
        <div className={wrap}>
          <h2 className="t-title text-center" data-anim="chars-drop" data-dur="0.4">
            Every number, on the record.
          </h2>
        </div>
        <div className="mt-16">
          <SpecMarquee />
        </div>
        <div className={`${wrap} mt-14 text-center`}>
          <Link href="/engineering" className="t-eyebrow inline-flex items-center gap-3 border-b border-current pb-1 text-copper" data-magnetic>
            Full specifications →
          </Link>
        </div>
      </Chapter>

      {/* 09 — Comparison. Character: rows wipe in, paired bars race on expo */}
      <Chapter
        id="compare"
        mode="play"
        playTime={2.2}
        className="py-28 md:min-h-svh md:py-36"
        poses={[
          { t: 0, pose: { x: -0.56, y: 0.02, s: 0.74, rx: 0.12, ry: 12.5 }, ease: "power2.inOut" },
          { t: 1, pose: { ry: 13.3 }, ease: "none" },
        ]}
      >
        <div className={`${wrap} grid gap-12 md:grid-cols-12`}>
          <Still src="/renders/rosewood.png" alt="Drift One in Rosewood" className="aspect-square md:col-span-5 md:aspect-auto md:min-h-[60vh]" />
          <div className="md:col-span-7">
            <p className="t-eyebrow text-copper" data-anim="fade-up">Side by side</p>
            <h2 className="t-title mt-5" data-anim="lines-mask" data-at="0.02" data-dur="0.3">
              Against the typical over-ear.
            </h2>
            <div className="mt-12" role="table" aria-label="Drift One compared with a typical over-ear headphone">
              <div role="row" className="grid grid-cols-[1.3fr_1fr_1fr] gap-4 border-b border-ionosphere/15 pb-3 font-mono text-[11px] tracking-[0.12em] uppercase">
                <span role="columnheader" className="text-ionosphere/55">Measure</span>
                <span role="columnheader" className="text-copper">Drift One</span>
                <span role="columnheader" className="text-ionosphere/55">Typical</span>
              </div>
              {COMPARISON.map((row, i) => (
                <div key={row.label} role="row" className="grid grid-cols-[1.3fr_1fr_1fr] items-center gap-4 border-b border-ionosphere/10 py-4" data-anim="clip-left" data-at={(0.2 + i * 0.08).toFixed(2)} data-dur="0.25">
                  <span role="rowheader" className="text-sm md:text-base">{row.label}</span>
                  <span role="cell">
                    <span className="t-num block text-xl md:text-2xl">{row.drift}</span>
                    <span className="mt-2 block h-1.5 rounded-full bg-copper" style={{ width: `${row.driftBar * 100}%` }} data-anim="bar" data-at={(0.28 + i * 0.08).toFixed(2)} data-dur="0.3" />
                  </span>
                  <span role="cell">
                    <span className="t-num block text-xl text-ionosphere/60 md:text-2xl">{row.typical}</span>
                    <span className="mt-2 block h-1.5 rounded-full bg-ionosphere/25" style={{ width: `${row.typicalBar * 100}%` }} data-anim="bar" data-at={(0.32 + i * 0.08).toFixed(2)} data-dur="0.3" />
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-6 max-w-lg text-xs leading-relaxed text-ionosphere/55">
              &ldquo;Typical&rdquo; stands for a representative mid-range over-ear headphone, not any specific product.
              Drift One figures are design targets for a fictional product. For latency and weight, shorter bars are
              better.
            </p>
          </div>
        </div>
      </Chapter>

      {/* 10 — Buy: the model settles front-on. Character: chars drop from above with overshoot */}
      <Chapter
        id="buy"
        mode="pin"
        pin={110}
        className="chapter-screen"
        poses={[
          { t: 0, pose: { x: 0, y: 0.3, s: 0.74, rx: 0.16, ry: TAU * 2 - 0.42, color: 0 }, ease: "power3.inOut" },
          { t: 0.5, pose: { s: 0.78, ry: TAU * 2 - 0.3 }, ease: "back.out(1.4)" },
          { t: 1, pose: { ry: TAU * 2 - 0.22 }, ease: "none" },
        ]}
      >
        <div className={`${wrap} flex h-full flex-col justify-end gap-10 pt-28 pb-14`}>
          <Still src="/renders/slate.png" alt="Drift One in Slate" className="aspect-square scene-fallback md:col-span-12 md:mx-auto md:w-full md:max-w-xl" />
          <div className="text-center">
            <h2 className="t-display" data-anim="chars-drop" data-dur="0.35">
              Yours, for ${PRICE}.
            </h2>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4" data-anim="fade-up" data-at="0.3">
              <Link href="/buy" data-magnetic className="rounded-full bg-ionosphere px-9 py-4 font-mono text-xs tracking-[0.16em] text-signal uppercase transition-colors hover:bg-copper">
                Buy Drift One
              </Link>
              <Link href="/product" data-magnetic className="rounded-full border border-ionosphere/30 px-9 py-4 font-mono text-xs tracking-[0.16em] uppercase transition-colors hover:border-ionosphere">
                See it in 3D
              </Link>
            </div>
            <p className="mt-6 font-mono text-[11px] tracking-[0.12em] text-ionosphere/55 uppercase" data-anim="fade-up" data-at="0.4">
              Free two-day shipping · 30-day returns · 2-year warranty
            </p>
          </div>
        </div>
      </Chapter>
    </>
  );
}
