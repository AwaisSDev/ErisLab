// All site copy lives here so it's easy to edit without touching layout.
// Rule for this file: no numbers, dates, specs or results that can't be verified.
// Ongoing work is described as research, exploration or development.

export const site = {
  name: 'Eris Lab',
  title: 'Eris Lab — AI that understands your life',
  description:
    'Eris Lab is an independent AI research lab researching a future where AI understands people, not just prompts — through work on privacy‑first AI, personal context, memory, intelligent agents and efficient models.',
  email: 'hello@erislab.ai',
};

export const mission =
  'Building AI that understands context beyond individual prompts, remembers what matters, connects information across your digital life, and helps proactively without compromising privacy or user control.';

export const philosophy =
  'AI that knows enough to help, remembers enough to understand, and respects your privacy enough to be trusted.';

export const chapters = [
  { id: 'thesis', label: 'Vision', href: '#top' },
  { id: 'work', label: 'Research areas', href: '#work' },
  { id: 'context', label: 'Context', href: '#context' },
  { id: 'projects', label: 'Projects', href: '#projects' },
  { id: 'research', label: 'Open questions', href: '#research' },
  { id: 'atlas', label: 'Atlas', href: '#atlas' },
  { id: 'principles', label: 'Principles', href: '#principles' },
  { id: 'join', label: 'Collaborate', href: '#join' },
];

export const statements = [
  {
    title: 'AI that knows enough to help.',
    tag: 'Context',
    body: 'Not another blank prompt box. We’re researching AI that understands the bigger picture — the people, plans and information in a person’s life — and can help before being asked.',
  },
  {
    title: 'Remembers enough to understand.',
    tag: 'Memory',
    body: 'Memory that keeps what matters, lets go of what doesn’t, and can be inspected, corrected or deleted by the person it belongs to.',
  },
  {
    title: 'Respects your privacy enough to be trusted.',
    tag: 'Privacy',
    body: 'Local‑first where practical, careful about what leaves the device, and transparent about how personal context is used. Privacy is a design constraint, not a feature.',
  },
];

export const work = [
  {
    tag: 'Privacy‑first AI',
    title: 'Intelligence that sees only what it needs to.',
    body: 'How personal AI can be genuinely useful while exposing as little as possible — and keeping the person in control of what it sees.',
    points: [
      'Local‑first context processing',
      'Privacy‑aware information routing',
      'Sensitive information protection',
      'User control and consent',
      'Minimizing unnecessary external data exposure',
    ],
  },
  {
    tag: 'Personal context intelligence',
    title: 'Understanding a life, not a prompt.',
    body: 'Connecting people, events, plans and information across conversations, documents and digital experiences — and following them over time.',
    points: [
      'Understanding information across sources',
      'Connecting people, events and plans over time',
      'Useful representations of personal context',
      'Knowing what matters — and what to ignore',
    ],
  },
  {
    tag: 'Memory systems',
    title: 'Remembering like a good friend, not a database.',
    body: 'Memory that is selective, consistent and accountable to the person it belongs to.',
    points: [
      'Persistent and temporary memory',
      'Retrieval and relevance',
      'Contradiction detection and resolution',
      'Selective retention',
      'Memory correction and user control',
    ],
  },
  {
    tag: 'Intelligent agents',
    title: 'Proactive, never presumptuous.',
    body: 'Agents that understand what is already in motion, prepare what will be needed, and ask before doing anything consequential.',
    points: [
      'Proactive personal assistance',
      'Context‑aware task preparation',
      'Understanding ongoing activities',
      'Permission‑based execution of consequential actions',
    ],
  },
  {
    tag: 'Efficient AI',
    title: 'Personal intelligence at a personal scale.',
    body: 'Small models that are efficient enough to stay close to the person — and know when to work alongside frontier models.',
    points: [
      'Small language models',
      'Efficient inference for personal intelligence',
      'Model adaptation and evaluation',
      'Combining local intelligence with frontier models',
    ],
  },
];

export const projects = [
  {
    name: 'Photon',
    kind: 'Context‑aware model',
    body: 'Research into a model that understands the context around a request — not just the request itself.',
    art: 'orb',
    seed: 17,
  },
  {
    name: 'Comet',
    kind: 'Router',
    body: 'Research into routing: deciding which model should handle a request, and what information it actually needs.',
    art: 'flow',
    seed: 26,
  },
  {
    name: 'Nebula',
    kind: 'Local agentic model',
    body: 'A local agentic model, with a focus on mathematical, coding and medical reasoning.',
    art: 'halftone',
    seed: 8,
  },
  {
    name: 'Horizon',
    kind: 'Frontier model',
    body: 'A longer‑term frontier initiative focused on mathematical intelligence.',
    art: 'contour',
    seed: 35,
  },
];

export const direction = [
  'Local context extraction',
  'Privacy‑aware information routing',
  'Persistent memory and retrieval',
  'Separating temporary information from long‑term context',
  'Sensitive‑data protection',
  'Personal context representations',
  'Small‑model research',
  'Integrating local intelligence with frontier models',
];

export const standing = [
  ['Not everything runs on‑device.', 'Local‑first processing is a principle and a research direction. Today, some work relies on external models.'],
  ['Not every workflow is end‑to‑end encrypted.', 'We won’t describe protections we haven’t built and verified.'],
  ['Not every direction is implemented.', 'The areas on this page are research. Some are in development; others are early exploration.'],
];

// Research directions framed as open questions — no dates, no implied publications.
export const research = {
  areas: [
    { key: 'privacy', label: 'Privacy' },
    { key: 'context', label: 'Context' },
    { key: 'memory', label: 'Memory' },
    { key: 'agents', label: 'Agents' },
    { key: 'efficient', label: 'Efficient AI' },
  ],
  featured: [
    { type: 'privacy', area: 'Privacy‑first AI', title: 'Which personal context should never leave the device — and how should a system decide?', art: 'orbit', seed: 21 },
    { type: 'memory', area: 'Memory systems', title: 'Memory a person can inspect, correct and delete.', art: 'contour', seed: 7 },
  ],
  rows: [
    { type: 'privacy', title: 'Routing information by sensitivity, not convenience', art: 'mesh', seed: 11 },
    { type: 'context', title: 'Representing a person’s context across conversations, documents and time', art: 'attention', seed: 3 },
    { type: 'context', title: 'Knowing what matters — and what should be ignored', art: 'halftone', seed: 5 },
    { type: 'memory', title: 'Separating temporary information from long‑term context', art: 'flow', seed: 9 },
    { type: 'memory', title: 'Detecting and resolving contradictions in what an assistant remembers', art: 'tokens', seed: 14 },
    { type: 'agents', title: 'Preparing tasks before they’re asked for — and acting only with permission', art: 'orbit', seed: 2 },
    { type: 'efficient', title: 'How much personal intelligence fits in a small model?', art: 'orb', seed: 31 },
    { type: 'efficient', title: 'When local intelligence should hand off to frontier models', art: 'planet', seed: 44 },
  ],
};

// Conceptual visualisations only. Every item is generated from synthetic data.
export const atlas = [
  ['A week of context, drawn as a graph', 'Personal context', 'orbit', 1.0],
  ['How a memory might fade', 'Memory', 'contour', 1.3],
  ['What an agent could notice first', 'Agents', 'attention', 0.8],
  ['Dysnomia: a model, orbiting you', 'Personal context', 'planet', 1.0],
  ['Intent flow across a morning', 'Agents', 'flow', 1.25],
  ['Context that stays local', 'Privacy', 'tokens', 0.75],
  ['Sensitivity, as a spectrum', 'Privacy', 'bars', 0.7],
  ['A calendar, as a nebula', 'Personal context', 'halftone', 1.35],
  ['A private prior', 'Privacy', 'orb', 1.0],
  ['Habits, softly clustered', 'Memory', 'mesh', 1.2],
  ['Forgetting gradient', 'Memory', 'contour', 0.85],
  ['Attention to the people who matter', 'Personal context', 'attention', 1.15],
  ['Orbit of a single memory', 'Memory', 'orbit', 1.3],
  ['Planning a trip, step by step', 'Agents', 'flow', 0.8],
  ['Consent boundaries, sketched', 'Privacy', 'mesh', 0.9],
  ['Routing: local or frontier?', 'Efficient AI', 'bars', 1.1],
  ['A small model, dithered', 'Efficient AI', 'orb', 0.75],
  ['Reminders it chose not to send', 'Agents', 'tokens', 1.2],
  ['A cloud of possible intents', 'Agents', 'halftone', 0.9],
  ['Contradiction, mapped', 'Memory', 'contour', 1.05],
  ['A life, seen from far away', 'Personal context', 'planet', 1.3],
  ['Recall, as heat', 'Memory', 'attention', 0.85],
  ['A compute budget, imagined', 'Efficient AI', 'halftone', 1.15],
  ['Proactive nudge field', 'Agents', 'flow', 1.0],
];
export const atlasCats = ['Personal context', 'Memory', 'Agents', 'Privacy', 'Efficient AI'];

export const principles = [
  { title: 'Privacy by design.', body: 'Privacy is a constraint we design around from the start, not a setting added at the end.', art: 'shield' },
  { title: 'Your context is yours.', body: 'People should own and control their personal context — what is collected, what is kept and what is shared.', art: 'key' },
  { title: 'Local first, where practical.', body: 'Process personal context close to the person whenever it is practical, and minimize what has to leave the device.', art: 'device' },
  { title: 'Transparent about data.', body: 'Say plainly what data is used, where it goes and why — in language people can actually read.', art: 'eye' },
  { title: 'Proactive, with permission.', body: 'AI should help before it’s asked — and ask before it acts on anything that matters.', art: 'nudge' },
  { title: 'Memory you can see and change.', body: 'Anything an assistant remembers should be inspectable, correctable and deletable by the person it’s about.', art: 'fade' },
  { title: 'Honest about progress.', body: 'We report research as research. No invented numbers, no claims ahead of the evidence.', art: 'scale' },
];

export const collaborate = [
  ['Research collaboration', 'Privacy, memory, context or agents', 'Research collaboration'],
  ['Conversations with researchers and engineers', 'People who care about this work', 'Hello from a researcher'],
  ['Feedback on our principles', 'Tell us where we fall short', 'Feedback on principles'],
];

export const faq = [
  ['Is Eris a product I can use today?', 'Eris Lab is a research lab. The projects on this site are research and development work, not launched commercial products. We’ll say so clearly when that changes.'],
  ['Does everything run on‑device?', 'No — not today. Local‑first processing is a design principle and an active research direction. We process locally where it’s practical, and we’re studying how local intelligence and frontier models should work together.'],
  ['What does “proactive” mean here?', 'Noticing what someone is likely to need — a document before a meeting, a reminder before a deadline — and preparing it. In our research, anything consequential requires the person’s permission first.'],
  ['How do you report progress?', 'As research. We describe ongoing work as exploration or development, share results only when we can stand behind them, and label illustrative visuals as illustrative.'],
  ['Why “Eris”?', 'Eris is one of the most distant known dwarf planets in our solar system — far out and quiet, with a single small moon, Dysnomia, that keeps it company. That felt right. 🔭'],
];
