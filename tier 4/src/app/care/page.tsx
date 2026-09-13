import type { Metadata } from "next";
import CareNotes from "@/components/CareNotes";
import Footer from "@/components/Footer";

const title = "Care Notes — Verde Noir";
const description = "A little vocabulary goes further than another app reminder.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description },
  twitter: { title, description },
};

// CareNotes' growth starts at zero opacity and builds as you scroll INTO
// it — correct for a section with other content above it, but as the
// very first thing on a standalone page that left the page looking
// blank on load. This short header gives first load something to see.
export default function CarePage() {
  return (
    <main>
      <section className="bg-panel px-6 pt-[calc(96px+4rem)] pb-8 md:px-12 md:pt-[calc(160px+2rem)]">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-2 text-xs tracking-[0.25em] text-gold uppercase">Care</p>
          <h1 className="font-display text-3xl text-cream md:text-5xl">
            Keeping a plant alive is mostly vocabulary.
          </h1>
        </div>
      </section>
      <CareNotes />
      <Footer />
    </main>
  );
}
