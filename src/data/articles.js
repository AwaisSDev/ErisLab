// Long-form content for the question, project and focus-area pages.
// Same rule as content.js: no numbers, dates, specs or results that can't be verified.
// Everything is described as research, exploration or development.

// Art kinds that read well as covers (soft "mesh" blobs and the text-based "tokens" are left out).
export const coverKinds = ['orbit', 'contour', 'flow', 'halftone', 'attention', 'planet', 'orb'];
export const safeArt = (k) => (k === 'mesh' ? 'flow' : k === 'tokens' ? 'contour' : k);

export const areaSlugs = {
  privacy: 'privacy-first-ai',
  context: 'personal-context',
  memory: 'memory-systems',
  agents: 'intelligent-agents',
  efficient: 'efficient-ai',
};

// Per-area intro used on /areas/[slug]
export const areaDocs = {
  privacy: {
    lede: 'Personal AI is only useful if it can see enough of a person’s life to help. It is only trustworthy if it sees no more than it needs, and the person stays in charge of what that is.',
    why: 'The more context an assistant has, the more helpful it can be, and the more damage a leak, a misuse or a careless default can do. We think privacy has to be designed into how context is gathered, routed and used, rather than bolted on as a settings page.',
    art: ['orbit', 21],
  },
  context: {
    lede: 'Most AI starts every conversation from a blank prompt. We’re researching how a system can understand the bigger picture: the people, plans and information that make up a person’s life.',
    why: 'Useful help depends on context that is rarely written down in the request itself: who someone is meeting, what they promised last week, which document matters. Capturing that without drowning in noise is an open research problem.',
    art: ['attention', 3],
  },
  memory: {
    lede: 'An assistant that remembers everything is a database. One that remembers nothing is a stranger. We’re researching memory that keeps what matters, lets go of what doesn’t, and answers to the person it belongs to.',
    why: 'Memory makes help personal, but it also makes mistakes persistent. Stale facts, contradictions and things a person would rather forget all need handling, and the person should be able to see and change what is kept.',
    art: ['contour', 7],
  },
  agents: {
    lede: 'We’re researching agents that understand what is already in motion, prepare what will be needed, and ask before doing anything consequential.',
    why: 'Proactive help is valuable precisely because it arrives before someone asks. That same quality makes it easy to overstep. The research question is how to be early and useful without being presumptuous.',
    art: ['flow', 2],
  },
  efficient: {
    lede: 'Personal intelligence should be able to live close to the person. We’re researching small models that are efficient enough to run nearby, and how they should work alongside frontier models.',
    why: 'Running locally helps with privacy, latency and cost, but small models have limits. Knowing what fits locally, and when to hand off, is central to making privacy‑first AI practical.',
    art: ['halftone', 31],
  },
};

// Open questions, keyed by the exact title used in content.js
export const questionDocs = {
  'Which personal context should never leave the device, and how should a system decide?': {
    slug: 'what-stays-on-device',
    summary: 'Some personal information is too sensitive to send anywhere. We’re studying how a system can recognise it, keep it local, and still be helpful.',
    sections: [
      ['Why it matters', ['A personal assistant may touch messages, health notes, finances and location. Sending all of that to a remote model by default is convenient, but it turns every request into a potential exposure. Deciding what stays local has to happen before the data moves, not after.']],
      ['What we’re exploring', ['Ways to classify personal context by sensitivity at the moment it is used, rather than with fixed folder-level rules.', 'Local processing that extracts only what a remote model actually needs, instead of forwarding raw content.', 'Defaults that err on the side of keeping information on the device when the system is unsure.', 'Making the decision visible, so a person can see what stayed local and what did not.']],
      ['Open sub-questions', ['How should sensitivity depend on context? The same address can be harmless in one request and sensitive in another.', 'What should happen when a request genuinely needs sensitive information that a local model cannot handle well?', 'How do we evaluate this honestly, without relying on real people’s private data?']],
      ['What we’re not claiming', ['We have not built a system that solves this. Local‑first processing is a principle and a research direction; today some of our work relies on external models.']],
    ],
  },
  'Memory a person can inspect, correct and delete.': {
    slug: 'inspectable-memory',
    summary: 'If an assistant remembers things about you, you should be able to see them, fix them and remove them. We’re researching what that takes.',
    sections: [
      ['Why it matters', ['Memory is what makes an assistant feel personal. It is also where errors become durable: a wrong assumption, once stored, can quietly shape every later answer. People need a way to look inside and change what is kept about them.']],
      ['What we’re exploring', ['Representations of memory that can be shown to a person in plain language, not just as opaque vectors.', 'Corrections that actually propagate, so fixing one fact changes the behaviour that depended on it.', 'Deletion that is real, including derived information, not just hiding an entry from view.', 'Explanations of why something was remembered in the first place.']],
      ['Open sub-questions', ['What is the right unit of memory to show a person: a fact, an event, a preference, a summary?', 'How can a system confirm that deleted information no longer influences its behaviour?', 'How much should an assistant ask before remembering something new?']],
      ['What we’re not claiming', ['These are research goals. We will describe specific guarantees only once we have built and verified them.']],
    ],
  },
  'Routing information by sensitivity, not convenience': {
    slug: 'routing-by-sensitivity',
    summary: 'When a request could go to more than one model, the choice should depend on what information is involved, not just on which model is easiest or most capable.',
    sections: [
      ['Why it matters', ['Systems that combine local and remote models need a router. If that router only optimises for quality or cost, sensitive information ends up wherever the strongest model happens to be.']],
      ['What we’re exploring', ['Routing decisions that take the sensitivity of the involved context into account alongside capability.', 'Splitting a request so that sensitive parts are handled locally and only the necessary remainder is sent onward.', 'Logging routing decisions in a form a person can review.']],
      ['Open sub-questions', ['How should a router weigh a small privacy cost against a large quality gain, and who gets to set that trade-off?', 'Can sensitivity be judged reliably by a small local model?']],
      ['What we’re not claiming', ['This is active research, closely related to our Comet project. We don’t yet have results we can stand behind publicly.']],
    ],
  },
  'Representing a person’s context across conversations, documents and time': {
    slug: 'representing-personal-context',
    summary: 'A person’s life is spread across messages, files, calendars and conversations. We’re researching representations that connect those pieces without flattening them.',
    sections: [
      ['Why it matters', ['Help often depends on links between things: the meeting tomorrow, the document it is about, the person who asked for it. Those links rarely live in one place, and they change over time.']],
      ['What we’re exploring', ['Representations that connect people, events, plans and information across sources.', 'Tracking how context evolves, so older information is understood as older.', 'Keeping representations compact enough to be processed close to the person.']],
      ['Open sub-questions', ['What structure is general enough for very different lives, yet specific enough to be useful?', 'How should a representation handle uncertainty about whether two things are actually related?']],
      ['What we’re not claiming', ['We are exploring approaches, not reporting a finished system.']],
    ],
  },
  'Knowing what matters, and what should be ignored': {
    slug: 'relevance-and-ignoring',
    summary: 'More context is not always better. We’re studying how a system can tell what is relevant right now, and what it should leave alone.',
    sections: [
      ['Why it matters', ['An assistant that pulls in everything it knows produces cluttered, sometimes intrusive answers. Choosing what to ignore is as important for usefulness and privacy as choosing what to use.']],
      ['What we’re exploring', ['Relevance signals that combine the request, the time and the person’s ongoing activities.', 'Treating some information as off-limits by default unless it is clearly needed.', 'Ways for a person to tell the system that something should not be brought up.']],
      ['Open sub-questions', ['How can relevance be evaluated without real personal data?', 'When should a system surface something the person did not ask about?']],
      ['What we’re not claiming', ['This is an open question for us, not a solved one.']],
    ],
  },
  'Separating temporary information from long-term context': {
    slug: 'temporary-vs-long-term',
    summary: 'A parking spot matters for an afternoon; a food allergy matters for years. We’re researching how memory can tell the difference.',
    sections: [
      ['Why it matters', ['If everything is kept forever, memory fills with stale details. If too little is kept, the assistant keeps asking the same questions. Lifespan is a property of information that most systems ignore.']],
      ['What we’re exploring', ['Estimating how long a piece of information is likely to stay useful.', 'Memory that fades unless it is reinforced, with important facts protected from fading.', 'Letting a person mark things as temporary or permanent.']],
      ['Open sub-questions', ['How should a system recover when it forgets something that turns out to matter?', 'What signals separate a passing detail from a lasting preference?']],
      ['What we’re not claiming', ['We are researching this; we haven’t published results on it.']],
    ],
  },
  'Detecting and resolving contradictions in what an assistant remembers': {
    slug: 'memory-contradictions',
    summary: 'People change jobs, move house and change their minds. We’re studying how memory can notice conflicting information and resolve it sensibly.',
    sections: [
      ['Why it matters', ['Long-lived memory will inevitably hold facts that no longer agree. An assistant that silently picks one, or mixes both, gives confusing or wrong help.']],
      ['What we’re exploring', ['Detecting when new information conflicts with something already remembered.', 'Preferring newer information while keeping a record of what changed.', 'Asking the person when the system cannot tell which version is right.']],
      ['Open sub-questions', ['When is a contradiction a change, and when is it an error?', 'How often is it acceptable to ask the person to resolve a conflict?']],
      ['What we’re not claiming', ['This is open research; we have no finished method to report.']],
    ],
  },
  'Preparing tasks before they’re asked for, and acting only with permission': {
    slug: 'proactive-with-permission',
    summary: 'Proactive help means noticing what someone will need and preparing it. We’re researching how to do that while never acting on anything consequential without permission.',
    sections: [
      ['Why it matters', ['The most useful help often arrives before a request: the document before the meeting, the reminder before the deadline. But an assistant that acts on its own guesses can cause real harm.']],
      ['What we’re exploring', ['Understanding ongoing activities well enough to anticipate the next step.', 'Preparing drafts and options rather than taking final actions.', 'Clear permission boundaries for anything that sends, buys, deletes or commits on a person’s behalf.']],
      ['Open sub-questions', ['Where exactly is the line between preparing and acting?', 'How can an agent ask for permission without becoming an interruption?']],
      ['What we’re not claiming', ['In our research, consequential actions require the person’s permission first. We are not describing a deployed agent.']],
    ],
  },
  'How much personal intelligence fits in a small model?': {
    slug: 'small-model-capacity',
    summary: 'Small models can run close to the person, which helps privacy. We’re studying which parts of personal assistance they can handle well, and which they can’t.',
    sections: [
      ['Why it matters', ['If useful personal intelligence fits in a small model, much more can stay on the device. If it doesn’t, privacy-first AI depends on careful handoffs to larger models.']],
      ['What we’re exploring', ['Which personal tasks small models handle well: extraction, classification, short-horizon planning.', 'Adapting small models to personal context without exposing that context.', 'Evaluations that reflect personal assistance rather than general benchmarks.']],
      ['Open sub-questions', ['Which capabilities degrade first as models get smaller?', 'How should we measure “good enough” for personal tasks?']],
      ['What we’re not claiming', ['We are not publishing model sizes, speeds or benchmark numbers until we can verify them.']],
    ],
  },
  'When local intelligence should hand off to frontier models': {
    slug: 'local-to-frontier-handoff',
    summary: 'Some requests need more capability than a local model has. We’re researching when to hand off, what to send, and what to keep back.',
    sections: [
      ['Why it matters', ['A handoff is where privacy and capability meet. Doing it too often defeats the point of local processing; doing it too rarely leaves people with worse help.']],
      ['What we’re exploring', ['Signals that a local model is out of its depth on a particular request.', 'Sending the minimum necessary information to a frontier model.', 'Combining the frontier model’s answer with local context afterwards, on the device.']],
      ['Open sub-questions', ['Can a model reliably know when it doesn’t know?', 'How should a person be told that a handoff happened?']],
      ['What we’re not claiming', ['Today, some of our work relies on external models. This is a research direction, not a finished architecture.']],
    ],
  },
};

// Projects, keyed by name in content.js
export const projectDocs = {
  Photon: {
    slug: 'photon',
    areas: ['context', 'memory'],
    sections: [
      ['What it is', ['Photon is research into a context-aware model: one that understands the situation around a request, not just the words of the request itself.']],
      ['Research focus', ['Using personal context to resolve ambiguous requests.', 'Deciding which context is relevant and which should be left out.', 'Keeping context handling inspectable by the person it belongs to.']],
      ['Status', ['Photon is research and development work. It is not a launched product.']],
    ],
  },
  Comet: {
    slug: 'comet',
    areas: ['privacy', 'efficient'],
    sections: [
      ['What it is', ['Comet is research into routing: deciding which model should handle a request, and what information that model actually needs.']],
      ['Research focus', ['Routing that weighs sensitivity alongside capability and cost.', 'Sending the minimum necessary information to remote models.', 'Making routing decisions reviewable.']],
      ['Status', ['Comet is research and development work. It is not a launched product.']],
    ],
  },
  Nebula: {
    slug: 'nebula',
    areas: ['efficient', 'agents'],
    sections: [
      ['What it is', ['Nebula is a local agentic model, with a focus on mathematical, coding and medical reasoning.']],
      ['Research focus', ['Agentic behaviour that runs close to the person.', 'Careful reasoning in domains where mistakes matter.', 'Permission-based execution of consequential steps.']],
      ['Status', ['Nebula is in research and development. We will share results only when we can stand behind them.']],
    ],
  },
  Horizon: {
    slug: 'horizon',
    areas: ['efficient'],
    sections: [
      ['What it is', ['Horizon is a longer-term frontier initiative focused on mathematical intelligence.']],
      ['Research focus', ['Mathematical reasoning as a foundation for reliable intelligence.', 'How frontier capability and local, personal intelligence should fit together.']],
      ['Status', ['Horizon is early, long-term research. There is nothing to announce yet, and we won’t pretend otherwise.']],
    ],
  },
};
