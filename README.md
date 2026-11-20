# Eris Lab

**AI that understands your life — without compromising your privacy.**

The website for Eris Lab, a research lab working on privacy‑first AI, personal context systems, memory and intelligent agents.

Built with [Astro](https://astro.build) as a fully static site. The cinematic, scroll‑driven backgrounds are a single WebGL fragment shader (no video, no images), so the whole page ships as a few small files.

## Develop

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # outputs to ./dist
npm run preview
```

Requires Node ≥ 22.23.4 (Astro 7).

## Deploy to Vercel

1. Import this repository at <https://vercel.com/new>.
2. Vercel detects **Astro** automatically — build command `npm run build`, output directory `dist`. No adapter or config is needed for the static site.
3. Vercel's default Node.js version (26.x) satisfies the `engines` field.

## Where things live

| What | Where |
| --- | --- |
| All copy (mission, research list, roles, FAQ, atlas items…) | `src/data/content.js` |
| Page sections | `src/components/*.astro`, assembled in `src/pages/index.astro` |
| Scroll choreography, smooth scroll (Lenis), filters, reveals | `src/scripts/main.js` |
| WebGL scenes (planet Eris, orbit rings, halftone nebula, star chart, planetrise) | `src/scripts/stage.js` |
| Generative thumbnails for the Atlas and research covers | `src/scripts/art.js` |
| Styles and design tokens | `src/styles/global.css` |

### The scenes

Each full‑screen "chapter" sets `data-scene` (0–4). As you scroll, the shader scrubs that scene's progress and dissolves between scenes with a pixelated Bayer dither:

0. **Hero** — the dwarf planet Eris inside dotted orbit rings
1. **Vision** — Eris up close with its moon Dysnomia
2. **The Work** — a halftone nebula drifting through a star field
3. **Context** — a cream celestial chart: a personal‑context graph drawing itself around "you"
4. **Join** — planetrise over Eris's horizon

Rendering quality adapts to the device's frame rate, and `prefers-reduced-motion` is respected.

## Before launch

- Benchmark numbers, specs and research entries in `src/data/content.js` are **placeholders**.
- Replace `#` links and `hello@erislab.ai` with real destinations.
- Update `site` in `astro.config.mjs` to the production domain.
