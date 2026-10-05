import type { Metadata } from "next";
import Link from "next/link";
import Chapter from "@/components/Chapter";
import Still from "@/components/scene/Still";

export const metadata: Metadata = {
  title: "Drift One — Sound",
  description: "The acoustic design of Drift One: a 40 mm LCP driver, a tuned rear-vented chamber, angled drivers, and a target curve, band by band.",
};

const wrap = "mx-auto w-full max-w-[1600px] px-4 sm:px-8 lg:px-10";

const BANDS = [
  {
    range: "20 – 80 Hz",
    name: "Sub-bass",
    head: "Felt more than heard.",
    copy: "The rear vent is tuned to the driver's 28 Hz resonance, so the bottom octave stays flat instead of being boosted with EQ. Kick drums arrive as pressure, not boom.",
    stat: ["+4 dB", "shelf below 100 Hz, matched to how bass is felt"],
  },
  {
    range: "80 – 250 Hz",
    name: "Bass",
    head: "Fast, then gone.",
    copy: "The stiff LCP cone stops moving the moment the signal does, so bass lines keep their pitch and don't blur into the mids. Decay to −30 dB happens in under 4 ms at 100 Hz.",
    stat: ["< 4 ms", "decay to −30 dB at 100 Hz"],
  },
  {
    range: "250 Hz – 2 kHz",
    name: "Mids",
    head: "Where voices live.",
    copy: "Held within ±1 dB of the reference. Vocals, guitars and dialogue sit where the recording put them, with no scooped mids to fake excitement.",
    stat: ["±1 dB", "deviation from target, 250 Hz – 2 kHz"],
  },
  {
    range: "2 – 6 kHz",
    name: "Presence",
    head: "Detail without the bite.",
    copy: "A gentle 2 dB dip at 3.5 kHz takes the edge off the ear canal's own resonance. Consonants stay crisp and sibilance stays polite at hour six.",
    stat: ["−2 dB", "at 3.5 kHz, ear-gain compensation"],
  },
  {
    range: "6 – 20 kHz",
    name: "Air",
    head: "Room to breathe.",
    copy: "The diaphragm's first break-up mode sits above 22 kHz, outside the audible band, so cymbals decay cleanly instead of ringing.",
    stat: ["> 22 kHz", "first diaphragm break-up mode"],
  },
];

// log-frequency x for the ruler and the curve (20 Hz → 0, 20 kHz → 1)
const fx = (hz: number) => Math.log10(hz / 20) / 3;
const RULER = [20, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000];

export default function SoundPage() {
  return (
    <>
      {/* hero — the driver, half-exposed */}
      <Chapter
        mode="pin"
        pin={100}
        entrance
        playTime={1.6}
        className="chapter-screen"
        poses={[
          { t: 0, pose: { vis: 1, x: 0.64, y: -0.4, s: 1.2, fx: 1, fy: -0.62, fz: 0, rx: 0.1, ry: 2.25, explode: 0.42, fold: 0, slide: 0, anc: 0, color: 1 } },
          { t: 0.7, pose: { ry: 1.95, explode: 0.6 }, ease: "sine.inOut" },
          { t: 1, pose: { vis: 0, s: 1.8 }, ease: "power2.in" },
        ]}
      >
        <div className={`${wrap} flex h-full flex-col justify-between gap-10 pt-28 pb-12`}>
          <div>
            <p className="t-eyebrow text-copper" data-anim="fade-up">Acoustic design</p>
            <h1 className="t-mega mt-5" data-anim="lines-mask" data-dur="0.35">
              Sound,
              <br />
              by design.
            </h1>
          </div>
          <Still src="/renders/driver.png" alt="The Drift One driver, exposed behind the cushion" priority className="aspect-square scene-fallback md:col-span-12 md:mx-auto md:w-full md:max-w-xl" />
          <p className="t-lede max-w-md text-ionosphere/75" data-anim="fade-up" data-at="0.2">
            Tuning isn&apos;t an EQ preset added at the end. It starts with the diaphragm material, the chamber volume and
            the size of one vent. Here is what each decision does to what you hear.
          </p>
        </div>
      </Chapter>

      {/* driver anatomy — cross-section drawn on scroll */}
      <Chapter mode="scrub" className="py-28 md:py-40">
        <div className={`${wrap} grid items-center gap-12 md:grid-cols-12`}>
          <div className="md:col-span-5">
            <p className="t-eyebrow text-copper" data-anim="fade-up">The driver</p>
            <h2 className="t-title mt-5" data-anim="chars-rise" data-dur="0.3">
              40 mm, 0.3 g.
            </h2>
            <p className="t-lede mt-6 text-ionosphere/70" data-anim="fade-up" data-at="0.1">
              Liquid-crystal polymer reinforced with carbon fibre is stiffer than PET and lighter than aluminium. A stiff,
              light cone moves as one piston for longer before it starts to flex, and flex is where distortion comes from.
            </p>
          </div>
          <div className="md:col-span-7">
            <svg viewBox="0 0 640 420" className="w-full" role="img" aria-label="Driver cross-section: dome and cone diaphragm, rubber surround, copper voice coil in the magnetic gap, N52 magnet and top plate, rear vent.">
              <g fill="none" strokeLinecap="round" strokeLinejoin="round" data-anim="draw" data-at="0.15" data-dur="0.45">
                {/* diaphragm: dome + cone */}
                <path data-draw d="M120 150 Q 200 150 270 120 Q 320 96 370 120 Q 440 150 520 150" stroke="#0e1b2e" strokeWidth="4" />
                {/* surround rolls */}
                <path data-draw d="M100 150 q 10 -18 20 0" stroke="#0e1b2e" strokeWidth="6" />
                <path data-draw d="M520 150 q 10 -18 20 0" stroke="#0e1b2e" strokeWidth="6" />
                {/* basket */}
                <path data-draw d="M90 160 L 210 300 H 430 L 550 160" stroke="#0e1b2e" strokeOpacity="0.35" strokeWidth="2" />
                {/* voice coil former */}
                <path data-draw d="M285 125 V 250 M 355 125 V 250" stroke="#9c4f2b" strokeWidth="5" />
                {/* magnet + plates */}
                <path data-draw d="M230 250 H 270 V 330 H 230 Z M 370 250 H 410 V 330 H 370 Z" stroke="#0e1b2e" strokeWidth="3" />
                <path data-draw d="M200 330 H 440 V 352 H 200 Z" stroke="#0e1b2e" strokeWidth="3" />
                <path data-draw d="M300 250 H 340 V 330 H 300 Z" stroke="#0e1b2e" strokeOpacity="0.5" strokeWidth="3" />
                {/* rear vent */}
                <path data-draw d="M320 352 V 400" stroke="#9c4f2b" strokeWidth="3" strokeDasharray="4 6" />
              </g>
              <g fontFamily="var(--font-mono)" fontSize="13" fill="#0e1b2e" data-anim="stagger-up" data-at="0.55" data-dur="0.3">
                <text x="320" y="80" textAnchor="middle">LCP dome + cone</text>
                <text x="40" y="135">surround</text>
                <text x="420" y="210" fill="#9c4f2b">CCAW voice coil</text>
                <text x="450" y="300">N52 magnet</text>
                <text x="460" y="348">steel plate</text>
                <text x="340" y="395" fill="#9c4f2b">rear vent · 28 Hz</text>
              </g>
            </svg>
          </div>
        </div>
      </Chapter>

      {/* frequency journey — horizontal, x-axis is literally frequency */}
      <Chapter mode="pin" pin={420} bg="#0e1b2e" tone="light" className="hscroll-chapter text-signal chapter-screen">
        <div className="flex h-full flex-col pt-28 pb-10">
          <div className={`${wrap} flex flex-wrap items-end justify-between gap-6`}>
            <h2 className="t-title" data-anim="clip-up" data-dur="0.06">
              Twenty to twenty thousand.
            </h2>
            <p className="t-eyebrow text-signal/55">Band by band, low to high</p>
          </div>

          <div className="mt-10 flex-1">
            <div className="hscroll-track flex flex-col gap-6 px-4 sm:px-8 lg:px-10" data-anim="hscroll" data-at="0.04" data-dur="0.92">
              {BANDS.map((b, i) => (
                <article
                  key={b.name}
                  className="hscroll-panel flex shrink-0 flex-col justify-between rounded-3xl border border-signal/12 bg-signal/[0.04] p-6 md:p-12"
                >
                  <div className="flex items-baseline justify-between gap-4">
                    <p className="t-eyebrow text-copper-glow">{String(i + 1).padStart(2, "0")} · {b.range}</p>
                    <p className="t-eyebrow text-signal/45">{b.name}</p>
                  </div>
                  <div className="mt-10">
                    <h3 className="font-display text-[clamp(2.2rem,5.2vw,6rem)] leading-[0.92] font-semibold tracking-[-0.03em]">{b.head}</h3>
                    <p className="t-lede mt-6 max-w-xl text-signal/70">{b.copy}</p>
                  </div>
                  <div className="mt-10 flex items-baseline gap-4 border-t border-signal/12 pt-5">
                    <p className="t-num text-4xl text-copper-glow md:text-5xl">{b.stat[0]}</p>
                    <p className="text-sm text-signal/60">{b.stat[1]}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className={`${wrap} scene-only mt-8 max-md:hidden`} aria-hidden>
            <div className="relative h-px bg-signal/25">
              <div className="absolute inset-y-0 left-0 w-full bg-copper-glow" data-anim="bar" data-at="0.04" data-dur="0.92" data-ease="none" />
            </div>
            <div className="relative mt-3 h-4 font-mono text-[11px] text-signal/55">
              {RULER.map((hz) => (
                <span key={hz} className="absolute -translate-x-1/2" style={{ left: `${fx(hz) * 100}%` }}>
                  {hz >= 1000 ? `${hz / 1000}k` : hz}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Chapter>

      {/* target curve */}
      <Chapter mode="scrub" className="py-28 md:py-40">
        <div className={wrap}>
          <div className="grid gap-10 md:grid-cols-12">
            <div className="md:col-span-6">
              <p className="t-eyebrow text-copper" data-anim="fade-up">Target curve</p>
              <h2 className="t-title mt-5" data-anim="words-scatter" data-dur="0.3">
                Tuned to a curve, not a mood.
              </h2>
            </div>
            <p className="t-lede text-ionosphere/70 md:col-span-5 md:col-start-8 md:pt-10" data-anim="fade-up" data-at="0.1">
              The reference is a diffuse-field target with a mild low-shelf, which listening panels consistently rate as
              natural. Drift One follows it within ±1.5 dB from 50 Hz to 8 kHz.
            </p>
          </div>
          <div className="mt-14 overflow-x-auto pb-2">
            <svg viewBox="0 0 1000 380" className="min-w-[640px] w-full" role="img" aria-label="Frequency response: Drift One tracks the reference target within 1.5 dB from 50 Hz to 8 kHz, with a 4 dB bass shelf and a 2 dB dip at 3.5 kHz.">
              <g stroke="#0e1b2e" strokeOpacity="0.1">
                {[60, 130, 200, 270, 340].map((y) => (
                  <line key={y} x1="40" x2="990" y1={y} y2={y} />
                ))}
                {RULER.map((hz) => (
                  <line key={hz} y1="40" y2="340" x1={40 + fx(hz) * 950} x2={40 + fx(hz) * 950} />
                ))}
              </g>
              <g fontFamily="var(--font-mono)" fontSize="12" fill="#0e1b2e" fillOpacity="0.5">
                {RULER.map((hz) => (
                  <text key={hz} x={40 + fx(hz) * 950} y="366" textAnchor="middle">{hz >= 1000 ? `${hz / 1000}k` : hz}</text>
                ))}
                {["+10", "+5", "0", "−5", "−10"].map((l, i) => (
                  <text key={l} x="30" y={64 + i * 70} textAnchor="end">{l}</text>
                ))}
              </g>
              <path d="M40 160 C 160 160, 240 168, 330 196 S 520 200, 640 196 S 740 170, 790 180 S 900 200, 990 230" fill="none" stroke="#0e1b2e" strokeOpacity="0.45" strokeWidth="2" strokeDasharray="7 7" data-anim="draw" data-at="0.1" data-dur="0.4" />
              <path d="M40 150 C 160 152, 240 166, 330 194 S 520 202, 640 198 S 720 186, 760 196 S 800 172, 840 176 S 930 214, 990 246" fill="none" stroke="#9c4f2b" strokeWidth="3.5" data-anim="draw" data-at="0.2" data-dur="0.5" />
              <g fontFamily="var(--font-mono)" fontSize="13" data-anim="stagger-up" data-at="0.65" data-dur="0.25">
                <text x="70" y="136" fill="#9c4f2b">+4 dB shelf</text>
                <text x="700" y="226" fill="#9c4f2b">−2 dB @ 3.5 kHz</text>
                <text x="420" y="176" fill="#0e1b2e" fillOpacity="0.55">reference (dashed)</text>
              </g>
            </svg>
          </div>
        </div>
      </Chapter>

      {/* soundstage — angled drivers */}
      <Chapter mode="scrub" bg="#dde3ea" className="py-28 md:py-40">
        <div className={`${wrap} grid items-center gap-12 md:grid-cols-12`}>
          <div className="md:col-span-6 md:order-2">
            <p className="t-eyebrow text-copper" data-anim="fade-up">Soundstage</p>
            <h2 className="t-title mt-5" data-anim="blur-in" data-dur="0.3">
              In front of you, not inside your head.
            </h2>
            <p className="t-lede mt-6 text-ionosphere/70" data-anim="fade-up" data-at="0.1">
              Each driver is angled 8° forward inside the cup, so sound reaches your ear the way a pair of speakers would,
              from slightly ahead. The image moves out of the middle of your skull and onto a stage in front of you.
            </p>
          </div>
          <div className="md:col-span-6 md:order-1">
            <svg viewBox="0 0 500 420" className="mx-auto w-full max-w-lg" role="img" aria-label="Top view of a head with two drivers angled 8 degrees forward, projecting sound arcs ahead of the listener.">
              <g fill="none" stroke="#9c4f2b" strokeWidth="2" data-anim="draw" data-at="0.2" data-dur="0.5">
                {[60, 110, 160, 210].map((r) => (
                  <path data-draw key={r} d={`M ${250 - r} ${200 - r * 0.55} A ${r} ${r} 0 0 1 ${250 + r} ${200 - r * 0.55}`} strokeOpacity={1 - r / 260} />
                ))}
              </g>
              <ellipse cx="250" cy="260" rx="78" ry="92" fill="#f7f9fb" stroke="#0e1b2e" strokeOpacity="0.3" strokeWidth="2" />
              <path d="M238 172 L 250 152 L 262 172" fill="none" stroke="#0e1b2e" strokeOpacity="0.5" strokeWidth="2" />
              <g data-anim="scale-in" data-at="0.1" data-dur="0.3">
                <rect x="150" y="225" width="24" height="70" rx="8" fill="#0e1b2e" transform="rotate(8 162 260)" />
                <rect x="326" y="225" width="24" height="70" rx="8" fill="#0e1b2e" transform="rotate(-8 338 260)" />
              </g>
              <g fontFamily="var(--font-mono)" fontSize="13" fill="#0e1b2e" data-anim="fade-up" data-at="0.6">
                <text x="250" y="390" textAnchor="middle" fillOpacity="0.6">top view · drivers angled 8° forward</text>
              </g>
            </svg>
          </div>
        </div>
      </Chapter>

      {/* measurements */}
      <Chapter mode="play" playTime={1.8} className="py-28 md:py-40">
        <div className={wrap}>
          <h2 className="t-display" data-anim="chars-drop" data-dur="0.35">
            Measured, not described.
          </h2>
          <dl className="mt-16 grid grid-cols-2 gap-x-8 gap-y-12 md:grid-cols-4">
            {[
              ["THD @ 94 dB", "0.08", "%", "2"],
              ["Sensitivity", "102", "dB/mW", "0"],
              ["Impedance", "32", "Ω", "0"],
              ["Bandwidth, wired", "40", "kHz", "0"],
            ].map(([k, v, u, d], i) => (
              <div key={k} className="border-t border-ionosphere/20 pt-4">
                <dt className="t-eyebrow text-ionosphere/60">{k}</dt>
                <dd className="t-num mt-3 text-5xl md:text-7xl">
                  <span data-count={v} data-decimals={d} data-at={(0.2 + i * 0.08).toFixed(2)} data-dur="0.5">{v}</span>
                  <span className="ml-1 text-lg text-copper md:text-2xl">{u}</span>
                </dd>
              </div>
            ))}
          </dl>
          <div className="mt-20 flex flex-wrap gap-4" data-anim="fade-up" data-at="0.6">
            <Link href="/engineering" data-magnetic className="rounded-full bg-ionosphere px-9 py-4 font-mono text-xs tracking-[0.16em] text-signal uppercase transition-colors hover:bg-copper">
              Full engineering sheet
            </Link>
            <Link href="/buy" data-magnetic className="rounded-full border border-ionosphere/30 px-9 py-4 font-mono text-xs tracking-[0.16em] uppercase transition-colors hover:border-ionosphere">
              Buy Drift One
            </Link>
          </div>
        </div>
      </Chapter>
    </>
  );
}
