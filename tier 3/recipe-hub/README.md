# Recipe Hub

A recipe discovery site — browse, filter, and read recipes across Italian, Thai, Mexican, and
Indian cuisines. Built with Next.js (App Router), TypeScript, Tailwind CSS, and GSAP for motion.

**Design direction:** rustic/organic, moody dark-wood tablescape photography. See
[`DIRECTION.md`](./DIRECTION.md) for the palette/type rationale and [`ASSETS.md`](./ASSETS.md) for
photo sourcing/licensing notes.

## Features

- Recipe grid with filtering by cuisine, diet (vegetarian/vegan/gluten-free/dairy-free), and time
- Individual recipe pages with ingredients, steps, and an interactive ingredient checklist
- Cuisine collection pages and a featured-recipe carousel
- Scroll-triggered reveal/kinetic-text animations (GSAP), with `prefers-reduced-motion` support
- WCAG AA–compliant color contrast throughout (verified via Lighthouse — 100/100 Accessibility)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site. The page auto-updates as you
edit files under `src/app`.

Other scripts:

```bash
npm run build   # production build
npm run start   # serve the production build
npm run lint    # eslint
```

## Project Structure

```
src/
  app/            # routes (App Router): home, /recipes, /recipes/[slug]
  components/      # UI components (cards, carousel, filters, header/footer, animations)
  content/recipes/ # recipe data (one JSON file per recipe)
  lib/             # recipe data access, shared types, GSAP setup
```

## Tech Stack

- [Next.js](https://nextjs.org) 16 (App Router, Turbopack)
- [React](https://react.dev) 19 + TypeScript
- [Tailwind CSS](https://tailwindcss.com) 4
- [GSAP](https://gsap.com) + [Lenis](https://lenis.darkroom.engineering/) for scroll animation
