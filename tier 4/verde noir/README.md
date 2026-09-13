# Verde Noir

A dark-mode houseplant shop concept — real photography, root-checked plants, and care notes
that go past the tag. Direct-sale storefront (cart + checkout) with no backend: everything runs
client-side against a static product catalogue.

## Stack

- **[Next.js 16](https://nextjs.org/)** (App Router, Turbopack) + **React 19** + **TypeScript**
- **[Tailwind CSS v4](https://tailwindcss.com/)** for styling
- **[GSAP](https://gsap.com/)** (ScrollTrigger, SplitText) for the site's scroll-choreographed
  motion — a pinned/scrubbed sequence on the shop page, a per-line typewriter reveal, a growth
  animation on the care page, and several other scroll-tied effects
- **[Lenis](https://lenis.darkroom.engineering/)** for smooth scrolling
- Self-hosted fonts (Erode + Switzer, via `next/font/local`) — no external font requests
- Every animated component ships a `prefers-reduced-motion` static fallback

There's no database, auth, or payment integration — the cart lives in React state for the
session, and checkout ends in a real (if simulated) success screen with client-side validation.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) (Next.js will pick the next free port if
3000 is taken).

Other scripts:

```bash
npm run build   # production build
npm start       # serve the production build
npm run lint    # eslint
```

## Project structure

```
src/
  app/            # routes (/, /shop, /shop/[id], /care, /about) + layout + metadata
  components/      # page sections and shared UI (nav, cart drawer, checkout modal, etc.)
  components/cart/ # cart drawer + checkout modal
  components/hero/ # hero-specific pieces
  lib/             # cart context, filter context, product data, small hooks
public/
  fonts/           # self-hosted Erode + Switzer
  images/          # product photography + transparent-PNG cutouts used in the hero and shop
DIRECTION.md        # the project's design/content source of truth — palette, type, layout,
                     # motion budget, and how each signature scroll element works
```

`DIRECTION.md` is kept up to date with what's actually shipped and is worth reading before
making layout or motion changes.
