import { lazy, Suspense, useState, useEffect } from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { VideoWithFallback } from "./VideoWithFallback";
import { type CaseStudyDetail } from "./CaseStudyModal";

// The modal (and its before/after slider, media, etc.) only matters once a
// study is opened — lazy-load it so it stays out of the initial bundle.
const CaseStudyModal = lazy(() =>
  import("./CaseStudyModal").then((m) => ({ default: m.CaseStudyModal })),
);

type Study = CaseStudyDetail & {
  slug: string;
  image: string;
  previewVideo?: string;
  tilt: number;
  oneLiner?: string;
};

// Flip this to false to restore the previous, fuller Notes case-study structure.
const USE_TIGHT_NOTES_CASE_STUDY = false;

const notesStudyFull: Study = {
    slug: "notes",
    number: "01",
    title: "Notes",
    subtitle: "A 24-hour format for the work thoughts that never come out.",
    client: "AmbitionBox Communities",
    year: "2026",
    role: "PM + Designer",
    meta: ["PM + Designer", "2026", "Pre-launch"],
    oneLiner: "Every work thought that dies in your head.",
    image: "/case-studies/notes/preview.svg",
    previewVideo: "/case-studies/notes/preview.mp4",
    cover: "/case-studies/notes/cover.svg",
    coverVideo: "/case-studies/notes/cover.mp4",
    tilt: -6,
    context: "AmbitionBox is one of India's largest company-review and salary-insights platforms. Communities is its pseudonymous space, where professionals discuss work candidly – without real names.",
    problem: "How might we capture the intrusive work thoughts that users currently swallow because they fear being judged?",
    approach: "Notes makes sharing feel as light as the thought itself. Every note disappears in 24 hours, never touches your profile, and is posted under whichever identity fits the moment.",
    noFigma: "I built the spec as a coded prototype instead of static mocks — partly to test if AI-assisted prototyping could cut 'thought-to-live' time, partly to see motion and library behavior in context instead of imagining it. It didn't save calendar days. But it kept every design decision documented as I went, made prototyping tangible in ways Figma couldn't, and taught me where the foundational gaps in this workflow still live.",
    impact: [],
    decisions: [
      {
        title: "A sticky note, not a post",
        detail: "The sticky note is the most universal workplace artifact – on monitors, meeting room walls, desk edges everywhere. Notes borrows that shape because the format doesn't need teaching. One canvas, type resizes to fit, no scrolling – brevity is built into the container.",
        videos: [
          { src: "/case-studies/notes/Express.mov", caption: "A space to let out your everyday work thoughts" }
        ]
      },
      {
        title: "Fun is the on-ramp",
        detail: "To balance low cognitive load for the writer with high engagement for the reader, expression needed to feel playful but remain cheap to build. We reused an existing GIF API and kept logic basic, ensuring we didn't bloat the MVP while still solving for reader boredom.",
        videos: [
          { src: "/case-studies/notes/Note Color.mov", caption: "Dress up your thoughts with vibrant backgrounds" },
          { src: "/case-studies/notes/Sticker.mov", caption: "Add playful visual cues to your message" },
          { src: "/case-studies/notes/GIF Selection.mov", caption: "Bring your reactions to life with motion" },
          { src: "/case-studies/notes/Music Selection.mov", caption: "Set the perfect soundtrack for your mood" }
        ]
      },
      {
        title: "Identity fits the moment",
        detail: "Each note is posted as a designation or \"works at Company X\" – never a real name. Pseudonymity is the platform's core primitive; Notes just lets users wear it more flexibly.",
        videos: [
          { src: "/case-studies/notes/Identity Selection.mov", caption: "Choose the identity you're most comfortable with" }
        ]
      },
      {
        title: "Temporary by contract",
        detail: "A note disappears after 24 hours. No archive, no history – when it's gone, it's gone."
      }
    ],
    watching: {
      metrics: [
        "Unique users posting",
        "Contributions per user",
        "Time spent on Communities",
        "Stickiness (DAU/MAU)"
      ]
    },
    coverCaption: "Consume what other professionals are sharing candidly and react.",
    beyondDesign: {
      questions: [
        { label: "How do you moderate without real names?", question: "How does moderation work when no one has a real name?" },
        { label: "How do you get content on day one?", question: "How do you kickstart content when the product is brand new?" },
        { label: "How do you sort notes?", question: "How do you sort notes?" },
        { label: "How does personalization work?", question: "How do you personalize content for users?" },
        { label: "Can your employer trace you?", question: "Can your employer trace you on a pseudonymous platform?" }
      ],
      ctaLead: "Want the full walkthrough?"
    },
    whatICut: {
      chips: ["Templates", "Daily prompts", "Direct Message", "Comments", "Archive"],
      caption: "Templates and Archive are power-user features — useless if the core doesn't work. Daily prompts and Comments are Phase II bets on habit and conversation. Each cut was a bet that the core question — will people share when the format feels genuinely low-stakes? — deserves a clean answer first."
    },
    shots: [],
};

const notesStudyTight: Study = {
  ...notesStudyFull,
  subtitle: "A 24-hour format for the work thoughts that never come out.",
  context:
    "AmbitionBox is one of India's largest company-review and salary-insights platforms. Communities is its pseudonymous space, where professionals talk about work through professional context instead of public real-name profiles.",
  problem:
    "How might we capture the intrusive work thoughts that users currently swallow because they fear being judged?",
  approach:
    "Notes is a lighter contract: write a thought, dress it up, choose the professional context it appears under, and let it disappear after 24 hours.",
  noFigma:
    "I built the spec as a coded prototype instead of static mocks. It didn't save calendar days, but it made prototyping tangible in ways Figma couldn't, kept decisions documented on the go, and let us test interaction details in motion instantly.",
  decisions: [
    {
      title: "A sticky note, not a post",
      detail:
        "Notes uses the sticky-note shape because it is already a workplace language. Reusing an existing GIF API and basic music logic allowed us to solve for reader boredom without bloating the MVP. The container keeps it brief: one canvas, no scrolling.",
      videos: [
        { src: "/case-studies/notes/Express.mov", caption: "A space to let out your everyday work thoughts" },
        { src: "/case-studies/notes/Note Color.mov", caption: "Dress up a thought without making it feel like a post" },
      ],
    },
    {
      title: "Identity fits the moment",
      detail:
        "Notes are not public real-name posts. A user appears through professional context, such as designation or \"works at Company X\", while the product still keeps the accountability needed for moderation.",
      videos: [
        { src: "/case-studies/notes/Identity Selection.mov", caption: "Choose the professional context that fits the note" },
      ],
    },
    {
      title: "Temporary by contract",
      detail:
        "A note lasts 24 hours and does not become profile history. No archive, no memory surface, no \"actually permanent\" loophole; the low-stakes promise only works if the product keeps it.",
    },
  ],
  watching: {
    metrics: [
      "Posting rate",
      "Contributions per user",
      "Return visits to Communities",
      "Reaction rate",
    ],
  },
  beyondDesign: undefined,
  whatICut: {
    ...notesStudyFull.whatICut!,
    caption:
      "Templates, prompts, DMs, comments, and archive all made the product heavier. Each cut was a bet that the core question — will people share when the format feels genuinely low-stakes? — deserves a clean answer first.",
  },
};

const studies: Study[] = [
  USE_TIGHT_NOTES_CASE_STUDY ? notesStudyTight : notesStudyFull,
  {
    slug: "the-number-that-matters",
    number: "02",
    title: "Negotiate With Data",
    client: "AmbitionBox · Salaries",
    year: "2025",
    role: "Product Designer",
    meta: ["Product Designer", "2025", "Shipped"],
    oneLiner: "Data to negotiate your next offer.",
    subtitle: "Fixing a broken Information Architecture",
    image: "/case-studies/salary-pages/93c0467c-99f4-4090-ae81-d80f876e3c30.png",
    previewVideo: "/case-studies/salary-pages/preview.mp4",
    cover: "/case-studies/salary-pages/cover.webp",
    tilt: 5,
    problem:
      "How might we fix a chaotic, cluttered salary page where dangerously broad ranges and generic designations leave users more confused than when they arrived?",
    approach:
      "I rebuilt the entire information architecture. Instead of showing broad, generic averages that didn't mean anything, we narrowed the salary ranges based on specific roles and locations—turning a confusing page into a clear tool you could actually use in a negotiation.",
    impact: [
      { value: "+27%", label: "perceived salary accuracy" },
      { value: "+10%", label: "avg. time spent per user (ATP)" },
      { value: "Stable", label: "bounce rate" },
      { value: "Zero", label: "drop in signups" },
    ],
    decisions: [
      { 
        title: "Narrowing the ranges (Generic vs. Non-Generic)", 
        detail: "The old page treated a generic 'Engineer' the same as a hyper-specific role, leading to massively broad, unhelpful salary ranges. We separated them, ensuring users only saw narrow, apple-to-apple comparisons that actually made sense.",
        videos: [{ src: "/case-studies/salary-pages/Generic Designation.mov", caption: "Generic roles suppress deep insights; picking a department unlocks the full suite" }]
      },
      { 
        title: "Restructuring the Information Architecture", 
        detail: "Years of patchwork additions had buried the most important insights under layers of clutter. I restructured what goes where — surfacing take-home pay, pay structure breakdowns, and benchmarks to the top, and pushing secondary data below the fold. The hierarchy now mirrors how people actually negotiate: lead with the number, then show the evidence.",
        videos: [{ src: "/case-studies/salary-pages/Information Hierarchy.mov", caption: "The restructured page hierarchy — key numbers first, evidence second" }]
      },
      { 
        title: "Making It Breathe", 
        detail: "The old page was a wall of text with SEO-stuffed section titles like 'Swiggy Experience wise salary for Fleet Manager in Procurement and Supply Chain department.' I kept the full keyword string in the HTML for crawlers but split it visually — a clean title up top, context pushed into a subtle breadcrumb below. Combined with generous whitespace, illustrations, and a scannable layout, the page finally felt like something you'd actually want to use.",
        videos: [{ src: "/case-studies/salary-pages/SEO title.mov", caption: "Clean section titles with SEO context tucked into breadcrumbs" }]
      },
      { 
        title: "Killing the winning design due to data limits", 
        detail: "We tried different layout approaches and user-tested them. We had a clear winner, but I had to kill it. Our backend data couldn't support the layout honestly. Designing a beautiful UI for thin data is just lying with pixels, so I pivoted the layout to match the true limitations of our database.",
        images: [{ src: "/case-studies/salary-pages/Killed Layout.png", caption: "The wireframe we killed — users loved it, but the data couldn't back it" }]
      },
    ],
    beyondDesign: {
      questions: [
        { label: "Identifying generic roles?", question: "How did you figure out the taxonomy for generic vs. non-generic designations in the Salary project?" },
        { label: "Handling top-earner data?", question: "How do you handle outliers and top-earner data so it doesn't skew the averages?" },
        { label: "Did blurring hurt SEO?", question: "Did the blur gating strategy negatively impact SEO or search rankings?" },
        { label: "Why kill the winning UI?", question: "Why exactly did you kill the layout that won in user testing?" }
      ],
      ctaLead: "Want the full walkthrough?"
    },
    beforeAfter: {
      before: "/case-studies/salary-pages/Salary Before.png",
      after: "/case-studies/salary-pages/Salary After.png",
    },
    shots: [],
  },
  {
    slug: "quick-vibe-check",
    number: "03",
    title: "Vibe Check",
    client: "AmbitionBox · Reviews",
    year: "2026",
    role: "Product Designer",
    meta: ["Product Designer", "2026", "Live"],
    oneLiner: "AI summaries for company reviews.",
    image: "/case-studies/quick-vibe-check/preview.svg",
    previewVideo: "/case-studies/quick-vibe-check/preview.mp4",
    cover: "/case-studies/quick-vibe-check/image.png",
    subtitle: "An AI insights engine that gives job seekers an instant, honest read on company culture.",
    tilt: -4,
    context:
      "AmbitionBox users are job seekers at the highest-stakes moments of their careers: preparing for an interview or deciding whether to accept an offer. They are looking for honest, unfiltered signals about what working there is actually like.",
    problem:
      "How might we give job seekers an instant, synthesized read on a company's culture without losing the raw honesty of individual reviews?",
    approach:
      "I designed an AI summary — the information architecture, the trust model, and the clear visual boundary between AI and user content — placed directly above the fold to replace guessing with a structured, honest read.",
    impact: [
      { value: "10k+", label: "companies live with summaries" },
      { value: "78%", label: "positive in-product feedback" },
      { value: "2.2×", label: "first-fold interaction rate" },
      { value: "+17%", label: "avg. time spent per user" },
    ],
    decisions: [
      { 
        title: "Designing for Proof & Trust", 
        detail: "AI summaries inherently trigger skepticism. I established strict visual boundaries for AI-generated content to clearly distinguish it from user-generated reviews. More importantly, I eliminated the \"black box\"—every single AI claim is clickable, instantly anchoring the user to the exact raw reviews that generated it.",
        videos: [{ src: "/case-studies/quick-vibe-check/Trust.mov", caption: "Clicking an insight reveals the raw reviews" }]
      },
      { 
        title: "Inverting the Information Architecture", 
        detail: "Instead of forcing users to pan for gold in chronological feeds, I inverted the page hierarchy. The AI summary becomes the hero above the fold, while the raw reviews act as a supporting ledger of evidence below.",
        videos: [{ src: "/case-studies/quick-vibe-check/Inversion.mov", caption: "The Quick Vibe Check UI sitting above the fold" }]
      },
      { 
        title: "Elevating Marginalized Signals", 
        detail: "Qualitative feedback revealed that female candidates struggled to find reliable safety and culture signals. I pushed for a gender split across both overall and category ratings, specifically highlighting areas where women rate the company significantly lower than men. Senior stakeholders — all male — pushed back. I had to build the case that this signal was precisely the kind of insight our female users couldn't find anywhere else.",
        videos: [{ src: "/case-studies/quick-vibe-check/Gender.mov", caption: "Overall ratings split by gender directly under the summary" }]
      },
      {
        title: "Navigating the B2B/B2C Marketplace Tension",
        detail: "The hardest challenge wasn't the AI; it was the business model. We had to show job seekers ruthlessly honest summaries without making our Sales team look bad in front of potential paying employers. We balanced the visual design to maintain objectivity without hostility, while simultaneously mapping new ad slots to ensure the above-the-fold summary didn't cannibalize our ad impressions."
      },
    ],
    beyondDesign: {
      questions: [
        { label: "Handling thin data?", question: "How does the UI react when data is thin?" },
        { label: "Guardrails for trust?", question: "What are the specific guardrails for trust in summaries?" },
        { label: "Ensuring quality output?", question: "What thresholds are in place to ensure AI quality output?" },
        { label: "What's next?", question: "What's next for AI summaries on the platform?" }
      ],
      ctaLead: "Want the full walkthrough?"
    },
    whatICut: {
      chips: ["Department filters", "Endless scroll", "Granular tags"],
      caption: "I initially wanted department-level AI summaries. But data showed users just glance at the overall level. So I killed my own feature to get the core concept shipped."
    },
    beforeAfter: {
      before: "/case-studies/quick-vibe-check/Company Reviews Page.png",
      after: "/case-studies/quick-vibe-check/Thick Data copy.png",
    },
    shots: [],
  },
];

export function CaseStudies() {
  const [active, setActive] = useState<CaseStudyDetail | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const studySlug = params.get("study");
    if (studySlug) {
      const match = studies.find(s => s.slug === studySlug);
      if (match) setActive(match);
    }
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const studySlug = params.get("study");
      if (studySlug) {
        const match = studies.find(s => s.slug === studySlug);
        setActive(match || null);
      } else {
        setActive(null);
      }
    };
    
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const handleNavigate = (study: CaseStudyDetail | null) => {
    setActive(study);
    
    const params = new URLSearchParams(window.location.search);
    const currentSlug = params.get("study");
    
    if (study) {
      const newSlug = (study as Study).slug;
      if (currentSlug !== newSlug) {
        window.history.pushState({}, '', `?study=${newSlug}`);
      }
    } else {
      if (currentSlug) {
        const url = new URL(window.location.href);
        url.searchParams.delete('study');
        window.history.pushState({}, '', url.pathname + url.search);
      }
    }
  };

  const activeIndex = active ? studies.findIndex((s) => s.number === active.number) : -1;
  const prevStudy = activeIndex !== -1 ? studies[(activeIndex - 1 + studies.length) % studies.length] : null;
  const nextStudy = activeIndex !== -1 ? studies[(activeIndex + 1) % studies.length] : null;

  return (
    <section id="work" className="relative z-10 px-6 md:px-10 pt-16 md:pt-16 pb-12 md:pb-16">
      <div className="mb-6 md:mb-16 max-w-4xl">
        <p
          className="font-[Nyght_Serif] text-black/70"
          style={{
            fontSize: "clamp(20px, 2.4vw, 34px)",
            lineHeight: 1.1,
            fontWeight: 400,
            letterSpacing: "-0.015em",
          }}
        >
          Recent work
          <em className="italic">.</em>
        </p>
      </div>

      <ul>
        {studies.map((s) => (
          <li key={s.number} className="group relative z-0 hover:z-50">
            <button
              type="button"
              onClick={() => handleNavigate(s)}
              onMouseEnter={(event) => {
                event.currentTarget.querySelector("video")?.play().catch(() => {});
              }}
              onMouseLeave={(event) => {
                event.currentTarget.querySelector("video")?.pause();
              }}
              className="w-full text-left block py-8 md:py-10 cursor-pointer"
            >
              {/* Desktop: faded titles that reveal subtext + a floating preview
                  on hover. Hidden on mobile where there's no hover. */}
              <div className="relative hidden md:flex items-center">
                <span
                  aria-hidden
                  className="font-[Nyght_Serif] absolute left-0 top-1/2 -translate-y-1/2 opacity-0 -translate-x-2 transition-all duration-500 ease-out group-hover:opacity-100 group-hover:translate-x-0"
                  style={{ fontSize: "clamp(24px, 2.5vw, 36px)", fontWeight: 400 }}
                >
                  →
                </span>

                <div className="flex-1 min-w-0 transition-transform duration-500 ease-out group-hover:translate-x-[72px] md:group-hover:translate-x-[96px]">
                  <h3
                    className="font-[Nyght_Serif] transition-colors duration-500 text-black/25 group-hover:text-black"
                    style={{
                      fontSize: "clamp(36px, 6vw, 96px)",
                      lineHeight: 0.95,
                      fontWeight: 400,
                      letterSpacing: "-0.025em",
                    }}
                  >
                    {s.title}
                  </h3>

                  <div className="overflow-hidden transition-all duration-500 ease-out max-h-0 opacity-0 group-hover:max-h-12 group-hover:opacity-100 group-hover:mt-3">
                    <p className="font-sans text-black/60" style={{ fontSize: 14 }}>
                      {s.oneLiner || s.meta.join(" • ")}
                    </p>
                  </div>
                </div>

                <div
                  className="hidden md:block pointer-events-none absolute right-[6%] top-1/2 w-[320px] aspect-[4/5] opacity-0 scale-90 transition-all duration-500 ease-out group-hover:opacity-100 group-hover:scale-100 rounded-none shadow-2xl bg-white"
                  style={{ transform: `translateY(-50%) rotate(${s.tilt}deg)` }}
                >
                  {s.previewVideo ? (
                    <VideoWithFallback
                      className="w-full h-full object-contain"
                      poster={s.image}
                      muted
                      loop
                      playsInline
                      preload="metadata"
                      aria-hidden="true"
                    >
                      <source src={s.previewVideo} type="video/mp4" />
                    </VideoWithFallback>
                  ) : (
                    <ImageWithFallback
                      src={s.image}
                      alt={`${s.title} preview`}
                      className="w-full h-full object-contain"
                    />
                  )}
                </div>
              </div>

              {/* Mobile: everything upfront (no hover). Title with the arrow on
                  the left, then subtext, then a centered preview. */}
              <div className="md:hidden">
                <div className="flex items-baseline gap-3">
                  <span
                    aria-hidden
                    className="font-[Nyght_Serif] shrink-0 text-black"
                    style={{ fontSize: "clamp(26px, 7vw, 40px)", fontWeight: 400 }}
                  >
                    →
                  </span>
                  <h3
                    className="font-[Nyght_Serif] text-black flex-1 min-w-0"
                    style={{ fontSize: "clamp(30px, 8vw, 52px)", lineHeight: 0.98, fontWeight: 400, letterSpacing: "-0.025em" }}
                  >
                    {s.title}
                  </h3>
                </div>

                <p className="font-sans text-black/60 mt-3" style={{ fontSize: 14 }}>
                  {s.oneLiner || s.meta.join(" • ")}
                </p>

                <div className="mt-5 mx-auto w-[80%] max-w-[320px] aspect-[4/5] shadow-2xl bg-white overflow-hidden">
                  {s.previewVideo ? (
                    <VideoWithFallback
                      className="w-full h-full object-contain"
                      poster={s.image}
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="metadata"
                      aria-hidden="true"
                    >
                      <source src={s.previewVideo} type="video/mp4" />
                    </VideoWithFallback>
                  ) : (
                    <ImageWithFallback
                      src={s.image}
                      alt={`${s.title} preview`}
                      className="w-full h-full object-contain"
                    />
                  )}
                </div>
              </div>
            </button>
          </li>
        ))}
      </ul>

      {active && (
        <Suspense fallback={null}>
          <CaseStudyModal
            study={active}
            prevStudy={prevStudy}
            nextStudy={nextStudy}
            onNavigate={(study) => handleNavigate(study)}
            onClose={() => handleNavigate(null)}
          />
        </Suspense>
      )}
    </section>
  );
}
