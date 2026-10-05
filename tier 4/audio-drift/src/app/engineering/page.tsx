import type { Metadata } from "next";
import Chapter from "@/components/Chapter";
import Still from "@/components/scene/Still";
import { SPEC_GROUPS } from "@/lib/specs";

export const metadata: Metadata = {
  title: "Drift One — Engineering",
  description: "How Drift One works: the hybrid ANC loop, attenuation by frequency, codecs and latency, battery, mass, and the full specification.",
};

const wrap = "mx-auto w-full max-w-[1600px] px-4 sm:px-8 lg:px-10";

const ATTENUATION: [string, number][] = [
  ["50 Hz", 31], ["100 Hz", 38], ["200 Hz", 42], ["500 Hz", 37], ["1 kHz", 29], ["2 kHz", 24], ["4 kHz", 27], ["8 kHz", 33],
];

const CODECS: [string, number, string][] = [
  ["LDAC", 990, "Android, hi-res"],
  ["LC3", 345, "LE Audio"],
  ["SBC", 328, "Universal fallback"],
  ["AAC", 256, "iPhone"],
];

const LATENCY: [string, number][] = [
  ["Game mode · LC3", 38],
  ["LC3 standard", 90],
  ["AAC", 150],
  ["SBC", 190],
];

const MASS: [string, number, string][] = [
  ["Earcups & drivers", 96, "bg-ionosphere"],
  ["Headband & pad", 62, "bg-copper"],
  ["Cushions", 34, "bg-cw-slate"],
  ["Battery & PCB", 34, "bg-cirrus"],
  ["Yokes & sliders", 28, "bg-copper-glow"],
];

function Eyebrow({ n, children, light = false }: { n: string; children: React.ReactNode; light?: boolean }) {
  return (
    <p className={`t-eyebrow flex items-center gap-4 ${light ? "text-copper-glow" : "text-copper"}`} data-anim="fade-up">
      <span className="font-mono">{n}</span>
      <span className="h-px w-10 bg-current" />
      {children}
    </p>
  );
}

export default function EngineeringPage() {
  return (
    <>
      {/* hero — exploded model hands off to the diagrams */}
      <Chapter
        mode="pin"
        pin={100}
        entrance
        playTime={1.8}
        className="chapter-screen"
        poses={[
          { t: 0, pose: { vis: 1, x: 0.5, y: -0.3, s: 0.6, rx: 0.22, ry: 5.75, explode: 0.55, fold: 0, slide: 0, anc: 0, color: 3, fx: 0, fy: 0, fz: 0 } },
          { t: 0.7, pose: { explode: 1, ry: 6.05 }, ease: "power2.inOut" },
          { t: 1, pose: { vis: 0, ry: 6.2, y: 0.1 }, ease: "power2.in" },
        ]}
      >
        <div className={`${wrap} flex h-full flex-col justify-between gap-10 pt-28 pb-12`}>
          <div>
            <p className="t-eyebrow text-copper" data-anim="fade-up">Drift One · technical</p>
            <h1 className="mt-5 font-display text-[clamp(2.9rem,13.5vw,16rem)] leading-[0.86] font-semibold tracking-[-0.045em]" data-anim="chars-rise" data-dur="0.3">
              Engineering
            </h1>
          </div>
          <Still src="/renders/exploded.png" alt="Exploded view of the Drift One earcup" priority className="aspect-[4/3] scene-fallback md:col-span-12 md:mx-auto md:w-full md:max-w-xl" />
          <dl className="grid grid-cols-2 gap-x-8 gap-y-8 md:max-w-[50%] md:grid-cols-4">
            {[
              ["Driver", "40", "mm"],
              ["ANC", "42", "dB"],
              ["Latency", "38", "ms"],
              ["Battery", "40", "h"],
            ].map(([k, v, u], i) => (
              <div key={k} className="border-t border-ionosphere/20 pt-3">
                <dt className="t-eyebrow text-ionosphere/60">{k}</dt>
                <dd className="t-num mt-2 text-5xl">
                  <span data-count={v} data-at={(0.1 + i * 0.06).toFixed(2)} data-dur="0.4">{v}</span>
                  <span className="ml-1 text-xl text-copper">{u}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </Chapter>

      {/* ANC loop — signal flow drawn on scroll */}
      <Chapter mode="scrub" className="py-28 md:py-40">
        <div className={wrap}>
          <div className="grid gap-10 md:grid-cols-12">
            <div className="md:col-span-5">
              <Eyebrow n="01">Hybrid ANC</Eyebrow>
              <h2 className="t-title mt-5" data-anim="lines-mask" data-dur="0.25">
                Two loops, one quiet.
              </h2>
            </div>
            <p className="t-lede text-ionosphere/70 md:col-span-6 md:col-start-7 md:pt-10" data-anim="fade-up" data-at="0.1">
              Feedforward microphones on the shell hear noise before it reaches you. Feedback microphones inside the cup
              hear what actually got through. The DSP combines both, sampling at 384 kHz, and re-tunes the anti-noise
              filter every 20 ms to follow the fit and the room.
            </p>
          </div>

          <div className="mt-16 overflow-x-auto pb-2">
            <svg viewBox="0 0 1000 360" className="min-w-[720px] w-full" role="img" aria-label="Signal flow: feedforward and feedback microphones feed a 384 kHz ADC, an adaptive DSP filter, a DAC and the driver; the acoustic path inside the cup returns to the feedback microphones.">
              <g fill="none" strokeWidth="2" data-anim="draw" data-at="0.25" data-dur="0.3">
                <path data-draw d="M200 95 C 235 95, 230 180, 260 180" stroke="#0e1b2e" />
                <path data-draw d="M200 265 C 235 265, 230 180, 260 180" stroke="#0e1b2e" />
                <path data-draw d="M410 180 H 470" stroke="#0e1b2e" />
                <path data-draw d="M670 180 H 730" stroke="#0e1b2e" />
                <path data-draw d="M840 180 H 890" stroke="#0e1b2e" />
                <path data-draw d="M935 215 V 330 H 110 V 300" stroke="#9c4f2b" strokeDasharray="6 6" />
              </g>
              <g data-anim="stagger-up" data-at="0.1" data-dur="0.3" fontFamily="var(--font-mono)" fontSize="14">
                <g>
                  <rect x="20" y="60" width="180" height="70" rx="14" fill="#f7f9fb" stroke="#0e1b2e" strokeOpacity="0.2" />
                  <text x="110" y="92" textAnchor="middle" fill="#0e1b2e">Feedforward ×4</text>
                  <text x="110" y="113" textAnchor="middle" fill="#0e1b2e" fillOpacity="0.55">outer shell</text>
                </g>
                <g>
                  <rect x="20" y="230" width="180" height="70" rx="14" fill="#f7f9fb" stroke="#0e1b2e" strokeOpacity="0.2" />
                  <text x="110" y="262" textAnchor="middle" fill="#0e1b2e">Feedback ×2</text>
                  <text x="110" y="283" textAnchor="middle" fill="#0e1b2e" fillOpacity="0.55">inside the cup</text>
                </g>
                <g>
                  <rect x="260" y="145" width="150" height="70" rx="14" fill="#f7f9fb" stroke="#0e1b2e" strokeOpacity="0.2" />
                  <text x="335" y="177" textAnchor="middle" fill="#0e1b2e">ADC</text>
                  <text x="335" y="198" textAnchor="middle" fill="#0e1b2e" fillOpacity="0.55">384 kHz</text>
                </g>
                <g>
                  <rect x="470" y="125" width="200" height="110" rx="18" fill="#0e1b2e" />
                  <text x="570" y="172" textAnchor="middle" fill="#f7f9fb">Adaptive filter</text>
                  <text x="570" y="195" textAnchor="middle" fill="#dd9668">re-tune / 20 ms</text>
                </g>
                <g>
                  <rect x="730" y="145" width="110" height="70" rx="14" fill="#f7f9fb" stroke="#0e1b2e" strokeOpacity="0.2" />
                  <text x="785" y="185" textAnchor="middle" fill="#0e1b2e">DAC</text>
                </g>
                <g>
                  <rect x="890" y="145" width="90" height="70" rx="14" fill="#9c4f2b" />
                  <text x="935" y="185" textAnchor="middle" fill="#f7f9fb">Driver</text>
                </g>
                <g>
                  <text x="520" y="350" textAnchor="middle" fill="#9c4f2b">acoustic path: what reaches your ear</text>
                </g>
              </g>
            </svg>
          </div>
        </div>
      </Chapter>

      {/* attenuation by frequency */}
      <Chapter mode="play" playTime={2} bg="#0e1b2e" tone="light" className="py-28 text-signal md:py-40">
        <div className={wrap}>
          <div className="grid gap-10 md:grid-cols-12">
            <div className="md:col-span-6">
              <Eyebrow n="02" light>Attenuation</Eyebrow>
              <h2 className="t-title mt-5" data-anim="clip-left" data-dur="0.3">
                Deepest where engines live.
              </h2>
            </div>
            <p className="t-lede text-signal/70 md:col-span-5 md:col-start-8 md:pt-10" data-anim="fade-up" data-at="0.1">
              Active cancellation does its heaviest work between 100 and 500 Hz, where engines, HVAC and road rumble sit.
              Above 2 kHz the cushion seal takes over, and the curve rises again.
            </p>
          </div>
          <div className="mt-16 grid h-[46vh] min-h-[280px] grid-cols-8 items-end gap-2 border-b border-signal/25 md:gap-5" role="img" aria-label="Noise reduction by frequency, peaking at 42 dB at 200 Hz">
            {ATTENUATION.map(([f, db], i) => (
              <div key={f} className="flex h-full flex-col justify-end">
                <p className="t-num mb-2 text-center text-lg md:text-3xl">
                  <span data-count={db} data-at={(0.2 + i * 0.05).toFixed(2)} data-dur="0.4">{db}</span>
                </p>
                <div
                  className={`rounded-t-lg ${db === 42 ? "bg-copper-glow" : "bg-signal/25"}`}
                  style={{ height: `${(db / 45) * 80}%` }}
                  data-anim="bar-y"
                  data-at={(0.2 + i * 0.05).toFixed(2)}
                  data-dur="0.4"
                />
              </div>
            ))}
          </div>
          <div className="mt-3 grid grid-cols-8 gap-2 font-mono text-[10px] text-signal/55 md:gap-5 md:text-xs">
            {ATTENUATION.map(([f]) => (
              <span key={f} className="text-center">{f}</span>
            ))}
          </div>
          <p className="mt-4 font-mono text-[11px] text-signal/45">dB reduction, ANC on, measured at the ear reference point. Design target.</p>
        </div>
      </Chapter>

      {/* wireless — codecs and latency */}
      <Chapter mode="play" playTime={2} className="py-28 md:py-40">
        <div className={`${wrap} grid gap-16 md:grid-cols-2`}>
          <div>
            <Eyebrow n="03">Codecs</Eyebrow>
            <h2 className="t-title mt-5" data-anim="skew-in" data-dur="0.3">
              Bandwidth, by codec.
            </h2>
            <ul className="mt-12 grid gap-6">
              {CODECS.map(([name, kbps, note], i) => (
                <li key={name}>
                  <div className="flex items-baseline justify-between gap-4">
                    <p className="font-display text-2xl font-semibold">{name} <span className="ml-2 font-body text-sm font-normal text-ionosphere/55">{note}</span></p>
                    <p className="t-num text-xl"><span data-count={kbps} data-at={(0.2 + i * 0.08).toFixed(2)} data-dur="0.5">{kbps}</span> kbps</p>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-ionosphere/10">
                    <div className="h-full rounded-full bg-ionosphere" style={{ width: `${(kbps / 990) * 100}%` }} data-anim="bar" data-at={(0.2 + i * 0.08).toFixed(2)} data-dur="0.5" />
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <Eyebrow n="04">Latency</Eyebrow>
            <h2 className="t-title mt-5" data-anim="skew-in" data-at="0.1" data-dur="0.3">
              Lips stay in sync.
            </h2>
            <ul className="mt-12 grid gap-6">
              {LATENCY.map(([name, ms], i) => (
                <li key={name}>
                  <div className="flex items-baseline justify-between gap-4">
                    <p className="font-display text-2xl font-semibold">{name}</p>
                    <p className="t-num text-xl"><span data-count={ms} data-at={(0.3 + i * 0.08).toFixed(2)} data-dur="0.5">{ms}</span> ms</p>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-ionosphere/10">
                    <div className={`h-full rounded-full ${i === 0 ? "bg-copper" : "bg-ionosphere/35"}`} style={{ width: `${(ms / 190) * 100}%` }} data-anim="bar" data-at={(0.3 + i * 0.08).toFixed(2)} data-dur="0.5" />
                  </div>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm text-ionosphere/55">Shorter is better. Around 45 ms is where most people stop noticing a lip-sync offset.</p>
          </div>
        </div>
      </Chapter>

      {/* power — discharge curve */}
      <Chapter mode="scrub" bg="#dde3ea" className="py-28 md:py-40">
        <div className={`${wrap} grid gap-12 md:grid-cols-12`}>
          <div className="md:col-span-4">
            <Eyebrow n="05">Power</Eyebrow>
            <h2 className="t-title mt-5" data-anim="rise-tilt" data-dur="0.3">
              Flat until it isn&apos;t.
            </h2>
            <p className="t-lede mt-6 text-ionosphere/70" data-anim="fade-up" data-at="0.15">
              A 920 mAh cell and a low-power ANC path give 40 hours with cancellation on. Five minutes on USB-C PD gets you
              four hours back.
            </p>
            <dl className="mt-10 grid grid-cols-2 gap-6">
              {[["Capacity", "920", "mAh"], ["Full charge", "2.5", "h"], ["ANC off", "55", "h"], ["Cycles to 80 %", "500", ""]].map(([k, v, u], i) => (
                <div key={k} className="border-t border-ionosphere/20 pt-3">
                  <dt className="t-eyebrow text-ionosphere/60">{k}</dt>
                  <dd className="t-num mt-2 text-4xl">
                    <span data-count={v} data-decimals={v.includes(".") ? "1" : "0"} data-at={(0.3 + i * 0.06).toFixed(2)} data-dur="0.35">{v}</span>
                    <span className="ml-1 text-lg text-copper">{u}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="md:col-span-7 md:col-start-6">
            <svg viewBox="0 0 800 420" className="w-full" role="img" aria-label="Battery discharge curve: charge stays above 90 percent for the first 4 hours, falls almost linearly, and reaches empty at 40 hours with ANC on.">
              <g stroke="#0e1b2e" strokeOpacity="0.12">
                {[0, 1, 2, 3, 4].map((i) => (
                  <line key={i} x1="60" x2="780" y1={40 + i * 80} y2={40 + i * 80} />
                ))}
              </g>
              <g fontFamily="var(--font-mono)" fontSize="13" fill="#0e1b2e" fillOpacity="0.55">
                {["100%", "75%", "50%", "25%", "0%"].map((l, i) => (
                  <text key={l} x="50" y={44 + i * 80} textAnchor="end">{l}</text>
                ))}
                {[0, 10, 20, 30, 40].map((h, i) => (
                  <text key={h} x={60 + i * 180} y="400" textAnchor="middle">{h} h</text>
                ))}
              </g>
              <path d="M60 40 C 120 46, 160 60, 240 92 S 560 236, 690 300 S 760 348, 780 360 L 780 360 L 60 360 Z" fill="#9c4f2b" fillOpacity="0.08" data-anim="clip-left" data-at="0.15" data-dur="0.6" />
              <path d="M60 40 C 120 46, 160 60, 240 92 S 560 236, 690 300 S 760 348, 780 360" fill="none" stroke="#9c4f2b" strokeWidth="3" data-anim="draw" data-at="0.15" data-dur="0.6" />
              <path d="M60 40 C 140 44, 220 58, 330 92 S 600 210, 780 280" fill="none" stroke="#0e1b2e" strokeOpacity="0.4" strokeWidth="2" strokeDasharray="6 6" data-anim="draw" data-at="0.25" data-dur="0.6" />
              <g fontFamily="var(--font-mono)" fontSize="13" data-anim="fade-up" data-at="0.7">
                <text x="560" y="210" fill="#9c4f2b">ANC on · 40 h</text>
                <text x="600" y="262" fill="#0e1b2e" fillOpacity="0.6">ANC off · 55 h →</text>
              </g>
            </svg>
          </div>
        </div>
      </Chapter>

      {/* mass budget */}
      <Chapter mode="play" playTime={2} className="py-28 md:py-40">
        <div className={wrap}>
          <div className="flex flex-wrap items-end justify-between gap-8">
            <div>
              <Eyebrow n="06">Mass budget</Eyebrow>
              <h2 className="t-title mt-5" data-anim="lines-mask" data-dur="0.3">
                Where 254 grams go.
              </h2>
            </div>
            <p className="t-mega leading-none">
              <span data-count="254" data-at="0.1" data-dur="0.6" data-ease="expo.out">254</span>
              <span className="text-[0.35em] text-copper">g</span>
            </p>
          </div>
          <div className="mt-12 flex h-16 w-full overflow-hidden rounded-2xl md:h-24" role="img" aria-label="Mass breakdown: earcups and drivers 96 g, headband 62 g, cushions 34 g, battery and PCB 34 g, yokes and sliders 28 g">
            {MASS.map(([name, g, color], i) => (
              <div key={name} className={`${color} h-full`} style={{ width: `${(g / 254) * 100}%` }} data-anim="bar" data-at={(0.2 + i * 0.07).toFixed(2)} data-dur="0.3" />
            ))}
          </div>
          <ul className="mt-8 grid grid-cols-2 gap-6 md:grid-cols-5">
            {MASS.map(([name, g, color], i) => (
              <li key={name} className="flex items-start gap-3" data-anim="fade-up" data-at={(0.3 + i * 0.07).toFixed(2)}>
                <span className={`${color} mt-1.5 block h-3 w-3 shrink-0 rounded-full`} />
                <div>
                  <p className="t-num text-2xl">{g} g</p>
                  <p className="text-sm text-ionosphere/65">{name}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Chapter>

      {/* full specification */}
      <Chapter id="specs" mode="play" playTime={1.6} bg="#0e1b2e" tone="light" className="py-28 text-signal md:py-40">
        <div className={wrap}>
          <Eyebrow n="07" light>Specification</Eyebrow>
          <h2 className="t-display mt-5" data-anim="chars-rise" data-dur="0.35">
            The full sheet.
          </h2>
          <div className="mt-16 grid gap-x-16 gap-y-14 md:grid-cols-2 xl:grid-cols-3" data-anim="stagger-up" data-at="0.2" data-dur="0.6">
            {SPEC_GROUPS.map((g) => (
              <section key={g.title}>
                <h3 className="t-eyebrow text-copper-glow">{g.title}</h3>
                <dl className="mt-4">
                  {g.rows.map(([k, v]) => (
                    <div key={k} className="grid grid-cols-[9rem_1fr] gap-4 border-t border-signal/12 py-3 text-sm">
                      <dt className="text-signal/55">{k}</dt>
                      <dd>{v}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            ))}
          </div>
        </div>
      </Chapter>
    </>
  );
}
