const POINTS = [
  {
    title: "Every listing is real.",
    body: "Roles are verified within 48 hours of posting and delisted the day they're filled — no ghost postings padding the count.",
  },
  {
    title: "Filter by what matters.",
    body: "Category, location, type, level. No keyword soup, no \"relevance\" black box.",
  },
  {
    title: "No recruiter-speak.",
    body: "Descriptions come from the hiring manager, not a template — you'll know what the job actually is before you apply.",
  },
  {
    title: "Direct, every time.",
    body: "Apply straight to the company. No account wall, no résumé black hole.",
  },
];

export default function WhySection() {
  return (
    <section
      id="why"
      data-why-pin
      className="relative overflow-hidden border-b border-line bg-ink px-6 py-24 text-paper md:px-12 md:py-32"
    >
      <div className="mx-auto max-w-[1440px]">
        <p className="font-mono text-xs font-medium uppercase tracking-[0.08em] text-paper/50">
          04 — Why The Roster
        </p>
        <h2
          data-why-scale
          className="mt-6 max-w-[18ch] font-sans text-4xl font-black leading-[0.98] tracking-[-0.02em] md:text-6xl lg:text-7xl"
        >
          Not a job aggregator.
        </h2>
        <div className="mt-16 grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-4">
          {POINTS.map((point) => (
            <div key={point.title} data-why-item>
              <p className="font-sans text-lg font-bold text-paper">
                {point.title}
              </p>
              <p className="mt-2 max-w-[32ch] font-sans text-sm text-paper/60">
                {point.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
