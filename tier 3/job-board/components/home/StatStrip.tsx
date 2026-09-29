import { Fragment } from "react";

interface Stat {
  value: number;
  label: string;
}

export default function StatStrip({ stats }: { stats: Stat[] }) {
  return (
    <section
      id="stats"
      className="relative border-b border-line px-6 py-14 md:px-12 md:py-20"
    >
      {/*
        md+: an explicit 7-track grid (stat, sep, stat, sep, stat, sep,
        stat) so the separator glyph is a real cell in the row, not an
        overlay — the traveling disc (HomeView) docks onto it by fading
        the [data-disc-dock="stats"] layer in/out in place. Below md the
        separators are display:none and the 2-col stat grid auto-places
        normally.
      */}
      <div className="relative mx-auto grid max-w-[1440px] grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] md:items-start md:gap-x-0 md:gap-y-0">
        {stats.map((stat, i) => (
          <Fragment key={stat.label}>
            <div>
              <p
                data-stat-value={stat.value}
                className="font-mono text-5xl font-medium tabular-nums text-ink md:text-6xl"
              >
                0
              </p>
              <p className="mt-2 font-mono text-xs font-medium uppercase tracking-[0.08em] text-ink/60">
                {stat.label}
              </p>
            </div>
            {i < stats.length - 1 && (
              <div
                aria-hidden="true"
                className="relative hidden md:flex md:w-10 md:items-center md:justify-center md:self-stretch"
              >
                {/* Permanent hairline mark — always present so the row
                    reads correctly with no JS / reduced motion. */}
                <span className="absolute h-1.5 w-1.5 rounded-full bg-line" />
                <span
                  data-disc-dock="stats"
                  className="absolute h-1.5 w-1.5 scale-0 rounded-full bg-red opacity-0"
                />
              </div>
            )}
          </Fragment>
        ))}
      </div>
    </section>
  );
}
