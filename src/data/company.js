// Founder and careers content.
// Founder details come from Awais's own public site (awaissdev.vercel.app); statuses are as stated there.

export const founder = {
  name: 'Awais Siddique',
  role: 'Founder',
  location: 'Multan, Pakistan',
  lead: 'Awais Siddique is the founder of Eris. He’s a self‑taught developer from Multan, Pakistan, who started writing code at 10 and builds AI products and machine‑learning research while studying FSc pre‑medical.',
  about: [
    'He learned from documentation, broken builds and shipping things, with no classes and no bootcamp. He has built an autonomous coding agent, a compliance layer for AI agents and a gamified study app, each live on its own domain.',
    'Studying biology while building AI agents is why his research goes after problems close to home: floods that displaced millions in 2022, and hospitals running without the monitoring they need.',
    'He cares about the parts of software that make it real (auth, payments, CI/CD, legal pages, onboarding), because those are what turn a demo into a product.',
  ],
  whyEris: 'His products already circle the questions Eris studies. Tracyn records what AI agents do and makes risky actions wait for a person. Codeply won’t call a task done until it has checked its own work. Eris takes those ideas (permission, accountability and trust) to AI that understands a person’s life.',
  research: [
    { name: 'PULSE', line: 'Sepsis early warning for low‑resource hospitals', status: 'Stage 1: data collection and model training', href: 'https://awaissdev.vercel.app/#pulse' },
    { name: 'Flood GNN', line: 'A graph neural network for flood response in Pakistan, trained on the 2022 floods', status: 'In review for publication', href: 'https://awaissdev.vercel.app/#flood' },
  ],
  products: [
    { name: 'Codeply', line: 'An autonomous coding agent that verifies its own work before it says it’s done', status: 'Live on Windows', href: 'https://codeply.app/' },
    { name: 'Tracyn', line: 'Audit trail and human approvals for AI agents', status: 'Live, free beta', href: 'https://tracyn.online/' },
    { name: 'Quillow', line: 'Studying, gamified: streaks, leagues and squads', status: 'Live', href: 'https://quillow.fun/' },
  ],
  skills: ['Python', 'TypeScript', 'React', 'Next.js', 'Electron', 'Node.js', 'C++', 'PyTorch', 'Supabase', 'Redis'],
  links: [
    ['Personal site', 'awaissdev.vercel.app', 'https://awaissdev.vercel.app/'],
    ['LinkedIn', 'in/awaissdev', 'https://www.linkedin.com/in/awaissdev/'],
    ['GitHub', 'github.com/AwaisSDev', 'https://github.com/AwaisSDev'],
    ['Book 15 minutes', 'cal.com/awais-siddique', 'https://cal.com/awais-siddique/15min'],
  ],
};

export const careers = {
  intro: 'Eris is early. We’re looking for a few people who want to work on privacy‑first, personal AI from the very beginning.',
  terms: [
    ['Equity‑based', 'There’s no salary yet. Roles are compensated with equity, agreed individually and in writing.'],
    ['Remote', 'Work from anywhere. We collaborate asynchronously and meet when it helps.'],
    ['Part‑time or full‑time', 'Tell us how much time you can give. We’d rather have focused part‑time work than none.'],
  ],
  roles: [
    {
      slug: 'research-engineer-privacy',
      title: 'Founding Research Engineer, Privacy & On‑device AI',
      team: 'Privacy‑first AI',
      summary: 'Help work out which personal context should stay on the device, and build the local processing that makes that practical.',
      work: ['Prototype local context extraction and sensitivity‑aware routing', 'Design evaluations that don’t depend on real people’s private data', 'Turn research questions into small, testable systems'],
      fit: ['You’ve shipped ML or systems work and care how data moves', 'You think about privacy as an engineering constraint', 'You’re comfortable with open‑ended research'],
    },
    {
      slug: 'ml-researcher-memory',
      title: 'Founding ML Researcher, Memory & Personal Context',
      team: 'Memory systems',
      summary: 'Research memory that keeps what matters, lets go of what doesn’t, and can be inspected and corrected by the person it belongs to.',
      work: ['Explore representations of personal context across conversations, documents and time', 'Study forgetting, contradiction handling and correction', 'Write up what works and what doesn’t, honestly'],
      fit: ['You have a research background in ML, IR or NLP, or equivalent experience', 'You like questions without obvious answers', 'You write clearly'],
    },
    {
      slug: 'agent-engineer',
      title: 'Founding Agent Engineer',
      team: 'Intelligent agents',
      summary: 'Build agents that prepare what someone will need and ask before doing anything consequential.',
      work: ['Prototype proactive assistance on top of personal context', 'Design permission boundaries and approval flows', 'Make agent behaviour inspectable and reviewable'],
      fit: ['You’ve built with LLM agents or tool‑use systems', 'You care about failure modes as much as demos', 'You can move from idea to prototype quickly'],
    },
    {
      slug: 'efficient-models-engineer',
      title: 'Small Models & Efficient Inference Engineer',
      team: 'Efficient AI',
      summary: 'Find out how much personal intelligence fits in a small model, and when to hand off to a frontier model.',
      work: ['Fine‑tune, quantize and evaluate small models for personal tasks', 'Explore local‑to‑frontier handoff strategies', 'Profile inference on consumer hardware'],
      fit: ['You’ve trained or optimized models', 'You enjoy measuring things carefully', 'You like working close to the hardware'],
    },
    {
      slug: 'founding-designer',
      title: 'Founding Designer',
      team: 'Design',
      summary: 'Shape how Eris looks and explains itself, from research write‑ups to the first interfaces for personal AI.',
      work: ['Design the visual language for research and product', 'Make privacy and memory controls understandable', 'Prototype interfaces for proactive, permission‑based help'],
      fit: ['You have a portfolio of product or brand work', 'You can make complex ideas feel simple', 'You care about type, motion and detail'],
    },
    {
      slug: 'research-collaborator',
      title: 'Research Collaborator',
      team: 'Open',
      summary: 'Researchers, students and engineers who want to collaborate on a specific question without joining full‑time.',
      work: ['Work with us on one of our open questions', 'Co‑author write‑ups where it makes sense', 'Bring a question of your own that fits our areas'],
      fit: ['You’re working on privacy, memory, context, agents or efficient AI', 'You want to explore an idea with a small, focused team'],
    },
  ],
};
