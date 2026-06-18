export type ExperimentStatus = 'success' | 'failed' | 'inconclusive' | 'in-progress';

export interface ExperimentSection {
  title: string;
  content: string; // plain text, rendered with whitespace preserved
}

export interface Experiment {
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  date: string;
  timeSpent: string;
  status: ExperimentStatus;
  funRating: number; // 1–5
  tools: string[];
  tldr: string;
  verdict: string;
  sections: ExperimentSection[];
}

/* ────────────────────────────────────────────────────────────────────────────
   Experiment registry — add new experiments here.
   The listing page renders them in array order (newest first).
   ──────────────────────────────────────────────────────────────────────────── */

export const experiments: Experiment[] = [
  {
    slug: 'linkedin-bot',
    title: 'Can AI Watch LinkedIn and Text Me the Perfect Job?',
    subtitle: '— Spoiler: The AI Was Easy. LinkedIn Was the Wall.',
    category: 'AI Experiments · Personal Project',
    date: 'June 2026',
    timeSpent: '~1 afternoon',
    status: 'failed',
    funRating: 4,
    tools: [
      'Chrome Extensions API',
      'Google AI (Gemini)',
      'Twilio',
      'Node.js',
      'Claude Code',
      'Antigravity',
    ],
    tldr:
      'I set out to build a personal tool that would watch LinkedIn for "we\'re hiring" posts, use AI to judge whether each one actually fit me (Product Designer, looking for roles in Europe/UAE with visa sponsorship), and ping my WhatsApp the moment a strong match appeared. The AI-matching and alerting half worked beautifully. The "read posts from LinkedIn" half ran headfirst into a company that has spent serious engineering effort making exactly this impossible. I stopped before sinking days into a fragile workaround — and that decision is the most useful part of the story.',
    verdict:
      'A "failed" experiment that succeeded at everything that mattered — I validated the AI concept, learned where the real difficulty lives, and practiced calling it when a path stops being worth walking.',
    sections: [
      {
        title: 'The Itch',
        content:
          'Job hunting is mostly noise. The good opportunities — especially the informal "DM me, we\'re hiring, visa sponsorship available" posts — fly past in the feed and disappear. LinkedIn\'s native job alerts don\'t understand nuance like "must sponsor a visa." I wanted something that did three things:\n\n• Watch my LinkedIn feed for hiring posts.\n• Judge each post with AI against my actual preferences — role, target countries, sponsorship.\n• Alert me on WhatsApp instantly, with a link, so I could reach out first.\n\nI built it as an experiment in AI-assisted development — pairing with an AI coding agent to go from idea to working code in an afternoon.',
      },
      {
        title: 'The Architecture',
        content:
          'The safe, sensible design: don\'t run a shady headless bot on a server (that gets your account banned). Instead, a Chrome extension that reads your own logged-in session as you browse, sends candidate posts to a tiny local server, which asks an AI model "is this a real match?" and fires a WhatsApp message if yes.\n\nLinkedIn (your own tab) → Chrome extension → local server\n                                              ├─ AI: does this match me?\n                                              └─ yes → WhatsApp alert 🎯\n\nCost: basically zero. AI on Google\'s free tier, server running on my laptop.',
      },
      {
        title: 'What Worked (Genuinely Well)',
        content:
          'The intelligence layer came together fast and worked on the first real test. I fed it a sample post — "Hiring a Senior Product Designer in Berlin, visa sponsorship and relocation provided" — and the AI returned:\n\nmatch: true · score: 95 · "Product Designer role in a target country (Germany) with explicit visa sponsorship."\n\nA "just finished my 5k run 🙌" post correctly scored 0. The WhatsApp message composed itself perfectly. The whole "understand a post and decide if I\'d care" problem — the part I assumed would be hard — was essentially solved.',
      },
      {
        title: 'Then I Hit the Wall',
        content:
          'To judge posts, you first have to read them. And this is where LinkedIn fought back, harder at every layer I tried:\n\nReading the page\'s HTML? Every class name is a randomized hash (_759d3eea) that changes on every deploy. No stable labels, no post IDs, no links. Deliberately unreadable.\n\nReading the data behind the page? Modern LinkedIn renders with React Server Components — the post data never lands in the page in any clean, parseable form.\n\nTapping the API the app uses? The old JSON API still exists, but LinkedIn\'s current site no longer calls it from the browser. The only way to reach it is to impersonate the app and call it directly — which stops being "reading my own screen" and becomes active scraping, against their terms, with real ban risk.\n\nI confirmed each dead end empirically — patching the browser\'s network layer, inspecting React internals, diffing what actually loaded. (Plot twist: the API calls I did briefly see were coming from a different scraper extension I already had installed, not from LinkedIn itself.)',
      },
      {
        title: 'The Decision',
        content:
          'The only remaining path was to build a "real" scraper — directly hitting LinkedIn\'s private API with reverse-engineered queries, ideally from a throwaway account, with ongoing maintenance every time they change something. Technically possible. Genuinely not worth it for a personal job search — and not something I wanted to point at the account I\'m job-hunting with.\n\nSo I stopped. Not because I couldn\'t, but because the cost/benefit had clearly inverted. Notably, I\'d also found a polished product (Protocol) that already does this at company-scale — which is the rational answer when the goal is finding a job, not maintaining a scraper.',
      },
      {
        title: 'What I Took Away',
        content:
          'The "hard" part wasn\'t the AI — it was the data. Modern LLMs make judgment cheap and good. Getting clean, reliable input is where real products live or die. That reframed how I think about AI features generally: the model is rarely the bottleneck.\n\nPlatforms are adversaries by design. LinkedIn\'s obfuscation isn\'t sloppy engineering — it\'s intentional, layered, and well-funded. Building on top of someone who\'s actively building against you is a treadmill.\n\nKnowing when to stop is a skill. I could have spent days on a brittle workaround. Recognizing the inverted cost/benefit early — and being honest about it — is the same judgment I use deciding which design problems are worth solving.\n\nThe reusable half is the valuable half. The AI matcher + WhatsApp pipeline isn\'t wasted — it\'ll happily plug into any data source I can get cleanly. The experiment de-risked the interesting part and taught me exactly why the rest is hard.',
      },
    ],
  },
];
