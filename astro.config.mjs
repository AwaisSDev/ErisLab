// @ts-check
import { defineConfig } from 'astro/config';

// Static output — Vercel detects Astro automatically and serves /dist.
export default defineConfig({
  site: 'https://erislab.ai',
  build: { inlineStylesheets: 'auto' },
  compressHTML: true,
});
