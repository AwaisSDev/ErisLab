// Derived data shared by the lab pages: slugs, links and lookups.
import { site, work, projects, research } from './content.js';
import { questionDocs, projectDocs, areaDocs, areaSlugs, coverKinds, safeArt } from './articles.js';

export const areaKeys = ['privacy', 'context', 'memory', 'agents', 'efficient'];
export const areaLabel = Object.fromEntries(research.areas.map(a => [a.key, a.label]));

export const areas = areaKeys.map((key, i) => ({
  key,
  slug: areaSlugs[key],
  href: `/areas/${areaSlugs[key]}`,
  label: areaLabel[key],
  ...work[i],
  ...areaDocs[key],
}));
export const areaByKey = Object.fromEntries(areas.map(a => [a.key, a]));

// Titles in content.js use typographic characters (non-breaking hyphens, curly quotes); match loosely.
const norm = (s) => s.replace(/[‐‑‒–]/g, '-').replace(/[‘’]/g, "'").trim();
const docsByTitle = Object.fromEntries(Object.entries(questionDocs).map(([t, d]) => [norm(t), d]));

export const questions = [
  ...research.featured.map(f => ({ ...f, featured: true })),
  ...research.rows,
].map(q => {
  const doc = docsByTitle[norm(q.title)];
  if (!doc) throw new Error(`Missing article for question: ${q.title}`);
  return { ...q, ...doc, art: safeArt(q.art), href: `/questions/${doc.slug}`, area: areaByKey[q.type] };
});

export const projectList = projects.map(p => {
  const doc = projectDocs[p.name];
  if (!doc) throw new Error(`Missing article for project: ${p.name}`);
  return { ...p, ...doc, art: safeArt(p.art), href: `/projects/${doc.slug}` };
});

export const mail = (subject) => `mailto:${site.email}?subject=${encodeURIComponent(subject)}`;
export const pad = (n) => String(n).padStart(2, '0');

// Three cards for an area: its open questions first, then research directions as cards.
export function areaCards(key, count = 3) {
  const a = areaByKey[key];
  const ai = areaKeys.indexOf(key);
  const qs = questions.filter(q => q.type === key).map(q => ({ title: q.title, meta: 'Open question', art: q.art, seed: q.seed, href: q.href }));
  const used = new Set(qs.map(q => q.art));
  const free = coverKinds.filter(k => !used.has(k));
  const pts = a.points.map((p, j) => ({ title: p, meta: 'Research direction', art: free[(ai * 2 + j) % free.length], seed: 50 + ai * 10 + j, href: a.href }));
  return [...qs, ...pts].slice(0, count);
}
