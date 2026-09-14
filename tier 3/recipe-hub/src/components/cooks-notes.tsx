import TypeOnText from "./type-on-text";
import Reveal from "./reveal";

const NOTES = [
  {
    title: "On timing",
    text: "Read the whole recipe before you start. Twice. Most kitchen disasters are just bad sequencing.",
  },
  {
    title: "On substitutions",
    text: "Swap vegetables freely. Don't swap acid, fat, or salt — those are what actually hold a dish together.",
  },
  {
    title: "On leftovers",
    text: "Curries and stews are always better the next day. Cook them a day ahead on purpose, not by accident.",
  },
];

export default function CooksNotes() {
  return (
    <ul className="grid grid-cols-1 gap-6 sm:grid-cols-3">
      {NOTES.map((note, i) => (
        <Reveal as="li" key={note.title} delay={i * 100}>
          <div
            className="h-full rounded-sm border border-line bg-paper px-5 py-6 shadow-[0_10px_24px_-16px_rgba(42,33,26,0.4)]"
            style={{ transform: `rotate(${i % 2 === 0 ? -1.2 : 1.4}deg)` }}
          >
            <p className="text-[0.7rem] font-bold tracking-[0.15em] text-terracotta uppercase">
              {note.title}
            </p>
            <TypeOnText
              text={note.text}
              className="mt-2 font-display text-[1.05rem] leading-snug text-ink italic"
            />
          </div>
        </Reveal>
      ))}
    </ul>
  );
}
