import Image from "next/image";

// New content — no prior About section existed to relocate. Written in
// the same voice as the rest of the site (plant-care vocabulary, short
// declarative sentences, no SaaS/agency phrasing per the brief).
export default function About() {
  return (
    <>
      <section className="section-pad bg-bg px-6 md:px-12">
        <div className="mx-auto max-w-3xl">
          <p className="mb-4 text-xs tracking-[0.25em] text-gold uppercase">About Verde Noir</p>
          <h1 className="font-display mb-10 text-4xl leading-[1.05] text-cream md:text-6xl">
            A shop for people who read the leaf before the calendar.
          </h1>

          <div className="flex flex-col gap-6 text-base leading-relaxed text-cream-dim md:text-lg">
            <p>
              Verde Noir started from a small complaint: most plant shops sell you
              whatever survived the shipping container, not what&apos;s actually
              healthy. Root-bound, light-starved, propped up for the listing photo
              — and then it&apos;s your problem three weeks later.
            </p>
            <p>
              We buy from small growers in batches too small to hide a bad one in,
              turn every plant out of its nursery pot before it ships, and write
              care notes with actual numbers on them instead of a laminated tag
              that says &quot;bright, indirect light&quot; and nothing else.
            </p>
            <p>
              No fenestration is guaranteed. No plant is perfect. But every one
              that leaves here has been looked at by a person who knows what a
              healthy root looks like — not just what a healthy photo looks like.
            </p>
          </div>
        </div>
      </section>

      <section className="relative h-[46vh] w-full overflow-hidden md:h-[56vh]">
        <Image
          src="/images/products/monstera-deliciosa-2.jpg"
          alt="Close-up of dense, fenestrated monstera leaves"
          fill
          sizes="100vw"
          className="object-cover"
          style={{ filter: "brightness(0.55) saturate(1.08) sepia(0.05)" }}
          fetchPriority="high"
          loading="eager"
        />
      </section>

      <section className="section-pad bg-bg px-6 md:px-12">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 md:grid-cols-3">
          <div>
            <p className="font-display mb-2 text-4xl text-gold-bright">01</p>
            <h2 className="font-display mb-2 text-xl text-cream">Small Growers</h2>
            <p className="text-sm leading-relaxed text-cream-dim">
              Batches small enough that one grower&apos;s judgment, not a
              warehouse&apos;s throughput, decides what ships.
            </p>
          </div>
          <div>
            <p className="font-display mb-2 text-4xl text-gold-bright">02</p>
            <h2 className="font-display mb-2 text-xl text-cream">Root-Checked</h2>
            <p className="text-sm leading-relaxed text-cream-dim">
              Every plant turned out of its pot and inspected before it ever
              reaches a box — not after you&apos;ve already paid for it.
            </p>
          </div>
          <div>
            <p className="font-display mb-2 text-4xl text-gold-bright">03</p>
            <h2 className="font-display mb-2 text-xl text-cream">Real Care Notes</h2>
            <p className="text-sm leading-relaxed text-cream-dim">
              Specific light, water, and humidity figures on every product page
              — not a generic tag that fits every plant equally badly.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
