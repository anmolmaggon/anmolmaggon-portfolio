import { useState, useEffect } from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { VideoWithFallback } from "./VideoWithFallback";
import { Pill } from "./Pill";
import { KnowMoreCursor } from "./KnowMoreCursor";
import { CaseStudyModal, type CaseStudyDetail } from "./CaseStudyModal";

type Study = CaseStudyDetail & {
  slug: string;
  image: string;
  previewVideo?: string;
  /** Mobile-only preview override. When set, the mobile card shows this image
      instead of the previewVideo/image. Desktop hover preview is unaffected. */
  mobileImage?: string;
  tilt: number;
  oneLiner?: string;
};

// Flip this to false to restore the previous, fuller Notes case-study structure.
const USE_TIGHT_NOTES_CASE_STUDY = false;

const notesStudyFull: Study = {
    slug: "notes",
    number: "03",
    title: "Notes",
    subtitle: "A low-stakes place for the workplace thoughts that were never worth a permanent post, gone in 24 hours.",
    client: "AmbitionBox Communities",
    year: "2026",
    role: "Product Manager + Product Designer",
    meta: ["Product Manager + Product Designer", "2026", "Pre-launch"],
    oneLiner: "The intrusive work thoughts that used to die in your head now have a home.",
    image: "/case-studies/notes/preview.svg",
    previewVideo: "/case-studies/notes/preview.mp4",
    mobileImage: "/case-studies/quick-vibe-check/Notes_Mobile.webp",
    cover: "/case-studies/notes/cover.svg",
    coverVideo: "/case-studies/notes/cover.mp4",
    tilt: -6,
    context: "AmbitionBox is one of India's largest company-review and salary-insights platforms. Communities is its pseudonymous space, where professionals discuss work candidly, without real names.",
    problem: "How might we capture the intrusive work thoughts that users currently swallow because they fear being judged?",
    approach: "Notes makes sharing feel as light as the thought itself. Every note disappears in 24 hours and is posted under whichever work identity you choose, never your real name.",
    noFigma: "I built the spec as a coded prototype instead of static mocks, partly to test whether AI-assisted prototyping could shorten thought-to-live time, and partly to see motion and library behavior in context instead of imagining it. It didn't save calendar days, but it kept every design decision documented as I went, made prototyping tangible in ways Figma couldn't, and showed me where the gaps in this workflow still live.",
    impact: [],
    decisions: [
      {
        title: "A sticky note, not a post",
        detail: "The sticky note is the most universal workplace artifact, on monitors, meeting-room walls, and desk edges everywhere. Notes borrows that shape because it needs no explaining.",
        videos: [
          { src: "/case-studies/notes/Express.mov", caption: "A space to let out your everyday work thoughts" }
        ]
      },
      {
        title: "Fun is the invitation",
        detail: "To keep the writer's effort low while giving readers something worth opening, expression had to feel playful yet stay cheap to build. We reused an existing GIF API and kept the logic simple, adding enough range for notes to feel alive without bloating the MVP.",
        videos: [
          { src: "/case-studies/notes/Note Color.mov", caption: "Dress up your thoughts with vibrant backgrounds" },
          { src: "/case-studies/notes/Sticker.mov", caption: "Add playful visual cues to your message" },
          { src: "/case-studies/notes/GIF Selection.mov", caption: "Bring your reactions to life with motion" },
          { src: "/case-studies/notes/Music Selection.mov", caption: "Set the perfect soundtrack for your mood" }
        ]
      },
      {
        title: "Identity fits the moment",
        detail: "Each note is posted as a designation or as \"works at Company X\", never a real name. Pseudonymity is the platform's core primitive, and Notes lets users wear it more flexibly.",
        videos: [
          { src: "/case-studies/notes/Identity Selection.mov", caption: "Choose the identity you're most comfortable with" }
        ]
      },
      {
        title: "Temporary by contract",
        detail: "A note disappears after 24 hours. No archive, no history. When it's gone, it's gone."
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
        { label: "Moderating without names?", question: "How does moderation work when no one has a real name?" },
        { label: "Cold-start content?", question: "How do you kickstart content when the product is brand new?" },
        { label: "Sorting notes?", question: "How do you sort notes?" },
        { label: "Personalization?", question: "How do you personalize content for users?" },
        { label: "Can employers trace you?", question: "Can your employer trace you on a pseudonymous platform?" }
      ],
      ctaLead: "Want the full walkthrough?"
    },
    whatICut: {
      chips: ["Templates", "Daily prompts", "Direct Message", "Comments", "Archive"],
      caption: "Templates and Archive are power-user features, useless if the core doesn't work. Daily prompts and Comments are Phase II bets on habit and conversation. Every cut protected one question that deserves a clean answer first: will people share more when the format feels genuinely low-stakes?"
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
      "Templates, prompts, DMs, comments, and archive all made the product heavier. Every cut protected one question that deserves a clean answer first: will people share more when the format feels genuinely low-stakes?",
  },
};

const studies: Study[] = [
  {
    slug: "quick-vibe-check",
    number: "01",
    title: "Vibe Check",
    client: "AmbitionBox · Reviews",
    year: "2026",
    role: "Product Designer",
    meta: ["Product Designer", "2026", "Live"],
    oneLiner: "Know what a company is really like before you say yes.",
    image: "/case-studies/quick-vibe-check/preview.svg",
    previewVideo: "/case-studies/quick-vibe-check/preview.mp4",
    mobileImage: "/case-studies/quick-vibe-check/VibeCheck_Mobile.webp",
    cover: "/case-studies/quick-vibe-check/image.png",
    subtitle: "An AI read on a company's culture, backed by real reviews you can check yourself.",
    tilt: -4,
    context:
      "AmbitionBox users are job seekers at the highest-stakes moments of their careers: preparing for an interview or deciding whether to accept an offer. They are looking for honest, unfiltered signals about what working there is actually like.",
    problem:
      "How might we give job seekers an instant, synthesized read on a company's culture without losing the raw honesty of individual reviews?",
    approach:
      "I designed an AI summary, owning the information architecture, the trust model, and the clear visual boundary between AI and user content, and placed it above the fold so people open with a structured, honest read instead of a guess.",
    impact: [
      { value: "10k+", label: "companies live with summaries" },
      { value: "78%", label: "positive in-product feedback" },
      { value: "2.2×", label: "first-fold interaction rate" },
      { value: "+17%", label: "avg. time spent per user" },
    ],
    decisions: [
      {
        title: "Doubling down on the gender gap",
        detail: "When we split the ratings by gender, users kept telling us how useful that gap was, how differently women and men rate the same company. That signal resonated, so we doubled down and made it prominent above the fold.",
        videos: [{ src: "/case-studies/quick-vibe-check/Gender.mov", caption: "Overall ratings split by gender directly under the summary" }]
      },
      {
        title: "Designing for proof & trust",
        detail: "AI summaries invite skepticism by default. I set strict visual boundaries so the AI summary reads as clearly distinct from real reviews, then made its reasoning visible: every claim is clickable and opens the exact reviews that produced it.",
        videos: [{ src: "/case-studies/quick-vibe-check/Trust.mov", caption: "Clicking an insight reveals the raw reviews" }]
      },
      {
        title: "Insights first, details later",
        detail: "The old page led with a raw chronological feed and surfaced plenty users didn't need. I made the new AI read the starting point, with the reviews below it as proof and the clutter cleared away. People want the verdict first and the evidence a scroll away.",
        videos: [{ src: "/case-studies/quick-vibe-check/Inversion.mov", caption: "The Quick Vibe Check UI sitting above the fold" }]
      },
      {
        title: "Balancing candor with the business",
        detail: "The hardest part wasn't the AI summary, it was making an honest read coexist with a two-sided business that serves both job seekers and the employers they're evaluating. Keeping the summary candid for users without ignoring that tension was the real design challenge, and how I solved it is a conversation I would rather have in person."
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
    heroLayout: "beforeAfter",
    beforeAfter: {
      before: "/case-studies/quick-vibe-check/Company Reviews Page.png",
      after: "/case-studies/quick-vibe-check/Thick Data copy.png",
    },
    shots: [],
  },
  {
    slug: "the-number-that-matters",
    number: "02",
    title: "Negotiate With Data",
    client: "AmbitionBox · Salaries",
    year: "2025",
    role: "Product Designer",
    meta: ["Product Designer", "2025", "Shipped"],
    oneLiner: "The salary data you need to negotiate your next offer.",
    subtitle: "Turning a cluttered salary page into a clear read on what a role really pays, so people can compare and walk into a negotiation informed.",
    image: "/case-studies/salary-pages/93c0467c-99f4-4090-ae81-d80f876e3c30.png",
    previewVideo: "/case-studies/salary-pages/preview.mp4",
    mobileImage: "/case-studies/quick-vibe-check/Salary_Mobile.webp",
    cover: "/case-studies/salary-pages/cover.webp",
    tilt: 5,
    problem:
      "How might we fix a chaotic, cluttered salary page where dangerously broad ranges and generic designations leave users more confused than when they arrived?",
    approach:
      "I approached it as negotiation prep, not a data dump. I rebuilt the information architecture around the handful of numbers people actually negotiate with, and hid anything too noisy to trust.",
    impact: [
      { value: "+27%", label: "perceived salary accuracy" },
      { value: "+10%", label: "avg. time spent per user (ATP)" },
      { value: "Stable", label: "bounce rate" },
      { value: "Zero", label: "drop in signups" },
    ],
    decisions: [
      {
        title: "Separating real roles from generic titles",
        detail: "The old page priced a generic 'Manager' the same as a hyper-specific role, producing ranges so broad they were useless. Averaging an IT Manager with an HR Manager tells neither of them what they are worth. We split them apart, so users only saw narrow, apples-to-apples comparisons that actually held up in a negotiation.",
        videos: [{ src: "/case-studies/salary-pages/Generic Designation.mov", caption: "Generic roles hide the detail; choosing a department unlocks the full breakdown" }]
      },
      {
        title: "Restructuring the page hierarchy",
        detail: "Years of patchwork additions had buried the most important insights under layers of clutter. I restructured what goes where, surfacing take-home pay, pay-structure breakdowns, and benchmarks at the top, and pushing secondary data below the fold.",
        videos: [{ src: "/case-studies/salary-pages/Information Hierarchy.mov", caption: "The restructured page hierarchy, key numbers first and evidence second" }]
      },
      {
        title: "Making it breathe",
        detail: "The old titles were SEO word-salad, like 'Swiggy Experience wise salary for Fleet Manager in Procurement and Supply Chain.' I kept the keywords in the markup for crawlers but surfaced a clean title, pushed the rest into a breadcrumb, and let the page breathe until it felt like something people wanted to consume.",
        videos: [{ src: "/case-studies/salary-pages/SEO title.mov", caption: "Clean section titles with SEO context tucked into breadcrumbs" }]
      },
      {
        title: "Killing the winning design",
        detail: "We tested several layout approaches and had a clear winner, but I had to kill it. Our backend data couldn't support that layout honestly, and a polished UI on top of thin data only misleads people. So I reshaped the layout to match what the data could actually stand behind.",
        images: [{ src: "/case-studies/salary-pages/Killed Layout.png", caption: "The wireframe we killed, loved in testing but the data couldn't back it" }]
      },
    ],
    beyondDesign: {
      questions: [
        { label: "Identifying generic roles?", question: "How did you define the taxonomy for generic vs. specific designations?" },
        { label: "Handling top-earner data?", question: "How do you handle outliers and top-earner data so it doesn't skew the averages?" },
        { label: "Did blurring hurt SEO?", question: "Did the blur gating strategy negatively impact SEO or search rankings?" },
        { label: "Why kill the winning UI?", question: "Why exactly did you kill the layout that won in user testing?" }
      ],
      ctaLead: "Want the full walkthrough?"
    },
    heroLayout: "beforeAfter",
    beforeAfter: {
      before: "/case-studies/salary-pages/Salary Before.png",
      after: "/case-studies/salary-pages/Salary After.png",
    },
    shots: [],
  },
  USE_TIGHT_NOTES_CASE_STUDY ? notesStudyTight : notesStudyFull,
];

export function CaseStudies() {
  const [active, setActive] = useState<CaseStudyDetail | null>(null);

  // Desktop delight: a "Know more" button that rides the cursor while a row is
  // hovered. Gated behind a hover-capable, fine pointer so touch devices keep
  // the tappable pill and never get a stranded cursor or `cursor: none`.
  const [canHover, setCanHover] = useState(false);
  const [hoveringCard, setHoveringCard] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const sync = () => setCanHover(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

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
    <section id="work" className="relative z-10 px-gutter md:px-gutter-lg pt-16 md:pt-24 pb-12 md:pb-16 scroll-mt-24">
      <div className="mb-4 md:mb-8 max-w-4xl">
        <p
          className="font-[Nyght_Serif] text-ink-body"
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
              onClick={() => {
                setHoveringCard(false);
                handleNavigate(s);
              }}
              onMouseEnter={(event) => {
                event.currentTarget.querySelector("video")?.play().catch(() => {});
                if (canHover) setHoveringCard(true);
              }}
              onMouseLeave={(event) => {
                event.currentTarget.querySelector("video")?.pause();
                setHoveringCard(false);
              }}
              className="w-full text-left block py-8 md:py-10 cursor-pointer"
              style={canHover ? { cursor: "none" } : undefined}
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
                    className="font-[Nyght_Serif] transition-colors duration-500 text-ink-ghost group-hover:text-ink"
                    style={{
                      fontSize: "clamp(36px, 6vw, 96px)",
                      lineHeight: 0.95,
                      fontWeight: 400,
                      letterSpacing: "-0.025em",
                    }}
                  >
                    {s.title}
                  </h3>

                  <div className="overflow-hidden transition-[max-height,margin] duration-500 ease-out max-h-0 group-hover:max-h-16 group-hover:mt-6">
                    <p
                      className="font-sans text-ink-muted opacity-0 translate-y-1 transition-all duration-500 ease-out group-hover:opacity-100 group-hover:translate-y-0"
                      style={{ fontSize: "clamp(16px, 1.3vw, 18px)", lineHeight: 1.35 }}
                    >
                      {s.oneLiner || s.meta.join(" • ")}
                    </p>
                  </div>
                </div>

                <div
                  className="hidden md:block pointer-events-none absolute right-[6%] top-1/2 w-[320px] aspect-card opacity-0 scale-90 transition-all duration-500 ease-out group-hover:opacity-100 group-hover:scale-100 rounded-none shadow-2xl bg-white"
                  style={{ transform: `translateY(-50%) rotate(${s.tilt}deg)` }}
                >
                  {s.previewVideo ? (
                    <VideoWithFallback
                      className="w-full h-full object-contain"
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

              {/* Mobile: a ruled editorial card (no hover). The image runs
                  edge-to-edge at the top, then a ruled text compartment: title,
                  one-liner, impact bullets (only when impact data exists), and a
                  "Know more" pill. The whole card is the tap target; the pill is
                  a visual affordance (a span), not a nested button, but carries
                  the site's hover/pressed states. */}
              <div className="md:hidden border border-hairline bg-white/40">
                <div className="w-full aspect-card overflow-hidden bg-black/[0.03]">
                  {s.mobileImage ? (
                    <ImageWithFallback
                      src={s.mobileImage}
                      alt={`${s.title} preview`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                  ) : s.previewVideo ? (
                    <VideoWithFallback
                      className="w-full h-full object-cover"
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
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>

                <div className="px-4 py-5 border-t border-hairline">
                  <h3
                    className="font-[Nyght_Serif] text-ink"
                    style={{ fontSize: "clamp(28px, 7vw, 44px)", lineHeight: 1.0, fontWeight: 400, letterSpacing: "-0.025em" }}
                  >
                    {s.title}
                  </h3>

                  <p className="mt-3 font-sans text-ink-muted" style={{ fontSize: 13.5, lineHeight: 1.4 }}>
                    {s.oneLiner || s.subtitle || s.meta.join(" • ")}
                  </p>

                  {s.impact.length > 0 && (
                    <div className="mt-4 space-y-2.5">
                      {s.impact.slice(0, 3).map((m) => (
                        <div key={m.label} className="flex items-center gap-3">
                          <span aria-hidden className="shrink-0 w-[9px] h-[9px] bg-scrim-strong" />
                          <p className="font-sans text-ink-body" style={{ fontSize: 13 }}>
                            <span className="font-medium text-ink">{m.value} </span>
                            {m.label}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  <Pill as="span" variant="solid" size="md" className="mt-6">
                    Know more
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14" />
                      <path d="m12 5 7 7-7 7" />
                    </svg>
                  </Pill>
                </div>
              </div>
            </button>
          </li>
        ))}
      </ul>

      <KnowMoreCursor active={canHover && hoveringCard && active === null} />

      <CaseStudyModal
        study={active}
        prevStudy={prevStudy}
        nextStudy={nextStudy}
        onNavigate={(study) => handleNavigate(study)}
        onClose={() => handleNavigate(null)}
      />
    </section>
  );
}
