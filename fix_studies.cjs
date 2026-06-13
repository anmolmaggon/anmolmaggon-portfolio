const fs = require('fs');

let code = fs.readFileSync('src/app/components/CaseStudies.tsx', 'utf8');

// 1. Update the Study interface
code = code.replace(
  /watching\?: \{ metrics: \{ value: string; label: string \}/,
  `watching?: { metrics: { value: string; label: string }[]; caption?: string };
  beyondDesign?: { questions: { label: string; question: string }[]; ctaLead: string };
  noFigma?: string;
  whatICut?: { chips: string[]; caption: string };
  earlySignal?: string;
  approachShot?: { src: string; caption: string };
  // watching?: { metrics: { value: string; label: string }`
);

// We will do a simple string replace for the missing data in each study.
// Study 1: Notes
const notesData = `
    oneLiner: "A story-like, 24-hour format for AmbitionBox Communities.",
    problem: "Posting on Communities felt heavy: everything you wrote lived on your profile forever. So people held back – and the everyday thoughts that make up most of work talk never made it onto the platform.",
    approach: "Notes makes sharing feel as light as the thought itself. Every note disappears in 24 hours, never touches your profile, and is posted under whichever identity fits the moment.",
    noFigma: "There was no design file. The spec was a working prototype – built in code with AI, iterating faster than mocks could ever be drawn. Engineering received code, not pictures.",
    whatICut: {
      chips: ["Templates", "Daily prompts", "Comments", "Video", "Archive"],
      caption: "Everything cut to answer one question first: will people share at all?"
    },
    earlySignal: "Early testers loved dressing up their intrusive thoughts with GIFs and music – pseudonymity let them post without feeling judged.",
    watching: {
      metrics: [
        { value: "1 in 10", label: "sessions should create a note" },
        { value: "60%+", label: "of opened note rails read to the end" },
        { value: "25%+", label: "of views should leave a reaction" }
      ],
      caption: "Pre-agreed targets – what the first 90 days after launch must answer."
    },
    beyondDesign: {
      questions: [
        { label: "How do you rank the feed?", question: "How do you rank a feed with no permanent history?" },
        { label: "How to prevent abuse?", question: "How do you prevent abuse when identity is fluid?" }
      ],
      ctaLead: "Want the full walkthrough?"
    },`;
code = code.replace(/slug: "notes",/, 'slug: "notes",' + notesData);

// Study 2: Salary
const salaryData = `
    oneLiner: "Years of cluttered IA, finally rebuilt structurally.",
    whatICut: {
      chips: ["Chronological sorting", "Endless scroll", "Granular tags"],
      caption: "Instead of trying to build a better feed, we killed the feed entirely. Every feature was scoped down to answer one question: how fast can a user get a definitive answer?"
    },
    beyondDesign: {
      questions: [
        { label: "Test highest traffic page?", question: "How do you test a radical change on your highest traffic page?" },
        { label: "Convince stakeholders?", question: "How do you convince stakeholders to remove legacy features?" }
      ],
      ctaLead: "Want the full walkthrough?"
    },`;
code = code.replace(/slug: "the-number-that-matters",/, 'slug: "the-number-that-matters",' + salaryData);

// Study 3: Vibe Check
const vibeData = `
    oneLiner: "Distilling 30k+ reviews into signal without flattening them.",
    whatICut: {
      chips: ["Department filters", "Endless scroll", "Granular tags"],
      caption: "I initially wanted department-level AI summaries. But data showed users just glance at the overall level. So I killed my own feature to get the core concept shipped."
    },
    noFigma: "Skipped Figma entirely. I built the spec as a working coded prototype using AI, allowing us to validate interactions instantly and hand off a living asset to engineering.",
    beyondDesign: {
      questions: [
        { label: "Prevent hallucinations?", question: "How do you ensure the AI doesn't hallucinate company culture?" },
        { label: "Measure sentiment?", question: "How do you measure sentiment accuracy at scale?" }
      ],
      ctaLead: "Want the full walkthrough?"
    },`;
code = code.replace(/slug: "quick-vibe-check",/, 'slug: "quick-vibe-check",' + vibeData);

fs.writeFileSync('src/app/components/CaseStudies.tsx', code);
