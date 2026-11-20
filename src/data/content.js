// All site copy lives here so it's easy to edit without touching layout.
// Numbers marked "placeholder" are illustrative — replace before launch.

export const site = {
  name: 'Eris Lab',
  title: 'Eris Lab — AI that understands your life',
  description:
    'Eris Lab is building AI that understands your life without compromising your privacy. We research privacy-first AI, personal context, memory and intelligent agents.',
  email: 'hello@erislab.ai',
};

export const chapters = [
  { id: 'thesis', label: 'Vision', href: '#top' },
  { id: 'work', label: 'The Work', href: '#work' },
  { id: 'context', label: 'Context', href: '#context' },
  { id: 'model', label: 'The Model', href: '#model' },
  { id: 'research', label: 'Research', href: '#research' },
  { id: 'atlas', label: 'Atlas', href: '#atlas' },
  { id: 'principles', label: 'Principles', href: '#principles' },
  { id: 'join', label: 'Join', href: '#join' },
];

export const statements = [
  {
    title: 'AI that knows enough to help.',
    tag: 'Context',
    body: 'Not another blank prompt box. An assistant that understands the bigger picture of your life — your people, your plans, your patterns — and helps before you have to ask.',
  },
  {
    title: 'Remembers enough to understand.',
    tag: 'Memory',
    body: 'Memory that grows with you, is shaped by you, and can be inspected, corrected or forgotten by you — at any time, in plain language.',
  },
  {
    title: 'Respects your privacy enough to be trusted.',
    tag: 'Privacy',
    body: 'Your context stays yours. Personal data is processed on your devices first, encrypted everywhere else, and never used to train our models.',
  },
];

export const work = [
  {
    tag: 'Privacy‑first AI',
    title: 'Intelligence that never needs to see what it shouldn’t.',
    body: 'On‑device models, confidential compute and encrypted inference — so the most personal AI is also the most private one.',
  },
  {
    tag: 'Personal context',
    title: 'Understanding a life, not a prompt.',
    body: 'Systems that connect the threads across your messages, calendar, documents and habits into a private model of what matters to you.',
  },
  {
    tag: 'Memory',
    title: 'Remembering like a good friend, not a database.',
    body: 'Long‑term memory that is selective, editable and explainable — it knows what to keep, what to let go, and can always tell you why.',
  },
  {
    tag: 'Intelligent agents',
    title: 'Proactive, never presumptuous.',
    body: 'Agents that notice what you’ll need and quietly prepare it — then ask before they act on anything that matters.',
  },
  {
    tag: 'Trust & safety',
    title: 'Consent is part of the architecture.',
    body: 'Every permission is scoped, visible and revocable. We red‑team for privacy leaks the way others red‑team for jailbreaks.',
  },
];

export const specs = [
  { label: 'On‑device', value: 8, suffix: 'B', note: 'parameters, runs locally' },
  { label: 'Personal context', value: 1, suffix: 'M', note: 'tokens of private memory' },
  { label: 'Encrypted', value: 100, suffix: '%', note: 'of cloud requests, end to end' },
  { label: 'Trained on you', value: 0, suffix: '', note: 'bytes of personal data' },
];

// placeholder numbers
export const benchmarks = [
  { label: 'Personal context recall', vals: [92.6, 81.4, 64.0] },
  { label: 'Proactive task success', vals: [78.3, 66.1, 49.5] },
  { label: 'Memory accuracy after 6 months', vals: [88.9, 74.2, 41.8] },
  { label: 'Privacy preservation (leak‑free answers)', vals: [99.2, 97.5, 83.1] },
  { label: 'On‑device latency score', vals: [84.7, 70.3, 58.6] },
];

export const research = {
  featured: [
    { type: 'release', date: 'Nov 12, 2026', title: 'Eris‑1: a personal model that lives on your device', art: 'orbit', seed: 21 },
    { type: 'publication', date: 'Oct 28, 2026', title: 'Personal context graphs: understanding a life, not a prompt', art: 'contour', seed: 7 },
  ],
  rows: [
    { type: 'publication', date: 'Oct 03, 2026', title: 'Memory that forgets on purpose', cat: 'Memory', art: 'attention', seed: 3 },
    { type: 'safety', date: 'Sep 18, 2026', title: 'Measuring privacy leakage in personal assistants', cat: 'Privacy', art: 'halftone', seed: 11 },
    { type: 'publication', date: 'Aug 22, 2026', title: 'Proactive agents that ask before they act', cat: 'Agents', art: 'flow', seed: 5 },
    { type: 'publication', date: 'Jul 30, 2026', title: 'Confidential inference at consumer scale', cat: 'Privacy', art: 'tokens', seed: 9 },
    { type: 'publication', date: 'Jul 02, 2026', title: 'Small models, big context: personal reasoning on device', cat: 'On‑device', art: 'bars', seed: 14 },
    { type: 'release', date: 'Jun 10, 2026', title: 'The Eris memory API, now in preview', cat: 'Release', art: 'planet', seed: 2 },
    { type: 'safety', date: 'May 14, 2026', title: 'Consent as architecture: a permissions model for agents', cat: 'Safety', art: 'mesh', seed: 31 },
    { type: 'safety', date: 'Apr 01, 2026', title: 'Our privacy commitments, in plain language', cat: 'Policy', art: 'contour', seed: 44 },
  ],
};

export const atlas = [
  ['A week of context, as a graph', 'Personal context', 'orbit', 1.0],
  ['Memory decay curve, user 0412', 'Memory', 'contour', 1.3],
  ['What the agent noticed first', 'Agents', 'attention', 0.8],
  ['Dysnomia: a model, orbiting you', 'Personal context', 'planet', 1.0],
  ['Intent flow across a morning', 'Agents', 'flow', 1.25],
  ['Tokens that stayed on device', 'Privacy', 'tokens', 0.75],
  ['Leakage under red‑team pressure', 'Privacy', 'bars', 0.7],
  ['Embedding nebula of a calendar', 'Personal context', 'halftone', 1.35],
  ['Encrypted activation, layer 12', 'Privacy', 'orb', 1.0],
  ['Habits, softly clustered', 'Memory', 'mesh', 1.2],
  ['Forgetting gradient', 'Memory', 'contour', 0.85],
  ['Attention to people you love', 'Personal context', 'attention', 1.15],
  ['Orbit of a single memory', 'Memory', 'orbit', 1.3],
  ['Planning a trip, step by step', 'Agents', 'flow', 0.8],
  ['Consent boundary map', 'Privacy', 'mesh', 0.9],
  ['Routing: device vs. cloud', 'On‑device', 'bars', 1.1],
  ['Dithered prior', 'On‑device', 'orb', 0.75],
  ['Reminders it chose not to send', 'Agents', 'tokens', 1.2],
  ['Cloud of possible intents', 'Agents', 'halftone', 0.9],
  ['Privacy eval, failure map', 'Privacy', 'contour', 1.05],
  ['A life, seen from far away', 'Personal context', 'planet', 1.3],
  ['Recall heat over a year', 'Memory', 'attention', 0.85],
  ['On‑device compute budget', 'On‑device', 'halftone', 1.15],
  ['Proactive nudge field', 'Agents', 'flow', 1.0],
];
export const atlasCats = ['Personal context', 'Memory', 'Agents', 'Privacy', 'On‑device'];

export const principles = [
  {
    title: 'Your data is yours.',
    body: 'We never sell it, never train on it, and never keep more than we need. You can see, export or delete everything Eris knows about you.',
    art: 'shield',
  },
  {
    title: 'Local first, cloud last.',
    body: 'Personal context is processed on your devices whenever possible. When the cloud is needed, it is encrypted end to end and forgotten after use.',
    art: 'device',
  },
  {
    title: 'Proactive, never presumptuous.',
    body: 'Eris should help before you ask — but it should always ask before it acts on anything that matters to you.',
    art: 'nudge',
  },
  {
    title: 'Forgetting is a feature.',
    body: 'Good memory is selective. Eris lets things fade unless they matter, and lets you decide what matters.',
    art: 'fade',
  },
];

export const roles = [
  ['Research Scientist, Personal Memory', 'Memory', 'Remote‑first'],
  ['Research Engineer, On‑device Models', 'Efficiency', 'Remote‑first'],
  ['Member of Technical Staff, Privacy', 'Confidential compute', 'Remote‑first'],
  ['Applied Scientist, Proactive Agents', 'Agents', 'Remote‑first'],
  ['Design Engineer', 'Product', 'Remote‑first'],
];

export const faq = [
  ['Do you train on my data?', 'No. Personal data is never used to train Eris models. Our models are trained on licensed and public data; your context is used only to help you, and only while you allow it.'],
  ['Where does my data live?', 'On your devices first. When a task needs the cloud, it runs in confidential compute with end‑to‑end encryption, and nothing is retained after the request.'],
  ['What does “proactive” actually mean?', 'Eris can notice what you’re likely to need — a document before a meeting, a reminder before a deadline — and prepare it. It always asks before acting on your behalf.'],
  ['Why “Eris”?', 'Eris is the most distant known dwarf planet in our solar system — far out, quiet, and private, with a single small moon that keeps it company. That felt right. 🔭'],
];
