# Eris Lab

**AI that understands your life.**

The website for Eris Lab, an independent AI research lab researching a future where AI understands people, not just prompts — privacy‑first AI, personal context, memory, intelligent agents and efficient AI.

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
| All copy (mission, research areas, projects, open questions, FAQ, atlas items…) | `src/data/content.js` |
| Page sections | `src/components/*.astro`, assembled in `src/pages/index.astro` |
| Scroll choreography, smooth scroll (Lenis), filters, reveals | `src/scripts/main.js` |
| WebGL scenes (planet Eris, orbit rings, halftone nebula, star chart, planetrise) | `src/scripts/stage.js` |
| Generative thumbnails for the Atlas and research covers | `src/scripts/art.js` |
| Styles and design tokens | `src/styles/global.css` |

### The scenes

Each full‑screen "chapter" sets `data-scene` (0–4). As you scroll, the shader scrubs that scene's progress and dissolves between scenes with a pixelated Bayer dither:

0. **Hero** — the dwarf planet Eris inside dotted orbit rings
1. **Vision** — Eris up close with its moon Dysnomia (analytic craters, rim shadows, lunar‑Lambert shading)
2. **The Work** — a halftone nebula drifting through a star field
3. **Context** — a cream celestial chart: a personal‑context graph drawing itself around "you"
4. **Join** — planetrise over Eris's horizon

Rendering quality adapts to the device's frame rate, and `prefers-reduced-motion` is respected.

## Content rules

- No numbers, specs, benchmarks, dates or results that can't be verified. Describe ongoing work as research.
- Atlas images are illustrative and generated from synthetic data; keep them labelled that way.
- Internal experiments, evaluations, training details and unreleased implementation details stay off the site.

## Before launch

- Confirm `hello@erislab.ai` is a monitored address (it is used for every contact link).
- `site` in `astro.config.mjs` is set to `https://erislab.vercel.app`; change it if a custom domain is added.
- The stylesheet is linked explicitly via `?url` in `src/layouts/Layout.astro`, because Astro 7.4 + Vite 8 bundled a bare CSS import without linking it.
