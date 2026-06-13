const fs = require('fs');

let code = fs.readFileSync('src/app/components/CaseStudies.tsx', 'utf8');

// Study 1: Notes
const notesData = `
    title: "Notes",
    oneLiner: "A story-like, 24-hour format for AmbitionBox Communities.",
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
      ctaLead: "Want the full walkthrough?",
      ctaLabel: "Let's chat about Notes"
    },`;

// Study 2: Salary Pages
const salaryData = `
    title: "Salary Pages",
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
      ctaLead: "Want the full walkthrough?",
      ctaLabel: "Let's chat about Salaries"
    },`;

// Study 3: Quick Vibe Check
const vibeData = `
    title: "Quick Vibe Check",
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
      ctaLead: "Want the full walkthrough?",
      ctaLabel: "Let's chat about AI"
    },`;

code = code.replace(/title:\s*"Notes",/, notesData);
code = code.replace(/title:\s*"Salary Pages",/, salaryData);
code = code.replace(/title:\s*"Quick Vibe Check",/, vibeData);

fs.writeFileSync('src/app/components/CaseStudies.tsx', code);
