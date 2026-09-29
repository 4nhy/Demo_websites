const QUOTES = [
  {
    quote:
      "I found the Harbor Analytics role on a Tuesday and had a real conversation with the hiring manager by Thursday. No recruiter in between.",
    name: "Priya N.",
    role: "Hired as Senior Backend Engineer",
  },
  {
    quote:
      "We stopped getting applicants who clearly hadn't read the listing. The description we wrote is the description candidates saw — nothing rewritten by a template.",
    name: "Hiring Manager",
    role: "Fieldstone",
  },
  {
    quote:
      "I searched Design, Remote, Internship and got three roles, not three hundred. That's the whole pitch, and it held up.",
    name: "Malik O.",
    role: "Hired as Design Intern",
  },
];

export default function Testimonials() {
  return (
    <section
      id="testimonials"
      className="border-b border-line px-6 py-20 md:px-12 md:py-28"
    >
      <div className="mx-auto max-w-[1440px]">
        <p className="font-mono text-xs font-medium uppercase tracking-[0.08em] text-ink/60">
          05 — From people who used it
        </p>
        <div className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8">
          {QUOTES.map((q, i) => (
            <blockquote
              key={q.name}
              data-testimonial
              data-testimonial-dir={i % 2 === 0 ? "left" : "right"}
              className="border-l-2 border-red pl-6"
            >
              <p className="font-sans text-xl font-medium leading-snug text-ink">
                &ldquo;{q.quote}&rdquo;
              </p>
              <footer className="mt-4 font-mono text-xs font-medium uppercase tracking-[0.05em] text-ink/60">
                {q.name} — {q.role}
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
