import { useState } from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { CaseStudyModal, type CaseStudyDetail } from "./CaseStudyModal";

type Study = CaseStudyDetail & {
  image: string;
  previewVideo?: string;
  tilt: number;
};

const studies: Study[] = [
  {
    number: "01",
    title: "Notes",
    client: "AmbitionBox Communities",
    year: "2026",
    role: "End-to-end product design + PM",
    meta: ["Ephemeral", "Communities", "Pre-launch"],
    image: "/case-studies/notes/preview.svg",
    cover: "/case-studies/notes/cover.svg",
    tilt: -6,
    problem:
      "AmbitionBox Communities had permanent posts, but not every workplace thought deserved to become one. A bad meeting, a quick win, a funny office moment, or a one-line realization felt too small and too risky for a lasting professional post.",
    approach:
      "Notes became a 24-hour, story-like format for workplace expression: temporary by design, visually lightweight, and tied to the identity that fit the moment. The goal was to lower the cost of sharing without turning Communities into another disposable social feed.",
    impactNote: "Pre-launch impact - no live metrics yet",
    impact: [
      { value: "01", label: "Built a launch-ready Phase 1 Notes experience" },
      { value: "02", label: "Created a lower-stakes format next to permanent posts" },
      { value: "03", label: "Introduced a sticky-note visual system for workplace content" },
      { value: "04", label: "Added story-like consumption without comments or archives" },
    ],
    decisions: [
      { title: "Temporary by contract", detail: "A note lives for 24 hours with no archive safety net, because the low-stakes promise only works if permanence is truly removed." },
      { title: "Identity fits the moment", detail: "Users choose company or designation per note, so a workplace moment does not have to use one fixed persona." },
      { title: "Glanceable, not scrollable", detail: "Text, media, stickers, and music fit inside one story-like canvas so consumption stays fast and passive." },
    ],
    shots: [
      {
        src: "/case-studies/notes/screen-hero.svg",
        caption: "Composer with contextual identity picker",
        wide: true,
      },
      {
        src: "/case-studies/notes/screen-detail-1.svg",
        caption: "Dense text and media still fit inside the immersive shell",
      },
      {
        src: "/case-studies/notes/screen-detail-2.svg",
        caption: "Author reaction stats show one clear audience signal",
      },
    ],
  },
  {
    number: "02",
    title: "The Number That Matters",
    client: "AmbitionBox · Salaries",
    year: "2024",
    role: "Product design & IA",
    meta: ["Information Architecture", "Data Viz", "Shipped"],
    image: "/case-studies/salary-pages/93c0467c-99f4-4090-ae81-d80f876e3c30.png",
    previewVideo: "/case-studies/salary-pages/preview.mp4",
    cover: "/case-studies/salary-pages/cover.webp",
    tilt: 5,
    problem:
      "People arrived at salary pages at the highest-stakes moments of their working life — a live offer, an appraisal, a career move — needing ammunition for a negotiation. Instead they got a single flat average for a broad role like 'Engineer.' It couldn't tell them their real monthly take-home, how much of their pay was tied to variable bonuses, or whether they were being lowballed for their exact experience. They left no better armed than they arrived.",
    approach:
      "We shifted the product from a salary database to a negotiation engine. Flat company-wide averages were decoupled into the levers people actually negotiate with — post-tax monthly take-home, fixed-vs-variable structure, and color-coded benchmarks for a specific role and tenure. And we aggressively hid any data too statistically noisy to be trusted, because a number you can't defend is worse than no number at all.",
    // ⚠️ PLACEHOLDER metrics — replace with verified figures before going live
    impact: [
      { value: "+31%", label: "registrations via blur gating" },
      { value: "1.8×", label: "engagement on specific roles" },
      { value: "+52%", label: "Top Insights carousel use" },
      { value: "−29%", label: "reported data inaccuracies" },
    ],
    decisions: [
      { title: "Data integrity over feature density", detail: "If the salary curve isn't statistically sound — juniors out-earning seniors on thin data — the widget hides itself. A number you can't defend is worse than none." },
      { title: "Liquidity over vanity metrics", detail: "Anchored the page on real monthly take-home and fixed-vs-variable split, not gross CTC. People budget and negotiate in cash, not abstract annual numbers." },
      { title: "Progressive gating, not paywalls", detail: "Anonymous users see the full layout with only the numbers blurred — showing exactly what insight sits behind the blur, which drives far stronger sign-up intent than a wall." },
    ],
    beforeAfter: {
      before: "/case-studies/salary-pages/before.webp",
      after: "/case-studies/salary-pages/after.webp",
      caption: "Drag to compare — the old flat-average page vs. the negotiation-engine redesign.",
    },
    shots: [
      {
        src: "/case-studies/salary-pages/screen-hero.webp",
        caption: "Top Insights — take-home, pay structure, and benchmarks in one swipe",
        wide: true,
      },
      {
        src: "/case-studies/salary-pages/screen-detail-1.webp",
        caption: "Generic roles suppress deep insights; picking a department unlocks the full suite",
      },
      {
        src: "/case-studies/salary-pages/screen-detail-2.webp",
        caption: "Progressive gating — the full layout renders, only the numbers blur",
      },
    ],
  },
  {
    number: "03",
    title: "Quick Vibe Check",
    client: "AmbitionBox · Reviews",
    year: "2025",
    role: "Product design & IA",
    meta: ["AI", "Information Architecture", "Shipped"],
    image: "/case-studies/quick-vibe-check/preview.webp",
    previewVideo: "/case-studies/quick-vibe-check/preview.mp4",
    cover: "/case-studies/quick-vibe-check/cover.webp",
    tilt: -4,
    problem:
      "Job seekers came to company review pages with high-intent questions about culture, leadership, and balance — and were met with an endless wall of chronological text. To get an answer they had to read dozens of reviews and mentally average them. The cognitive load was exhausting, and many dropped off before they could decide with confidence.",
    approach:
      "We shifted the product paradigm from a chronological feed to an insights engine. Aggregate AI insights moved above the fold, a Quick Vibe Check extracted and categorized sentiment into positives, negatives, and mixed — and the review cards themselves were rebuilt to prioritize scannability over social features.",
    // ⚠️ PLACEHOLDER metrics — replace with verified figures before going live
    impact: [
      { value: "−34%", label: "lower bounce on reviews route" },
      { value: "2.1×", label: "time shifted to AI summaries" },
      { value: "+27%", label: "more registrations via login gates" },
      { value: "+41%", label: "more Helpful upvotes" },
    ],
    decisions: [
      { title: "Trust through transparency", detail: "Every AI insight is clickable, surfacing the exact raw reviews that generated it. No black box." },
      { title: "Insights first, details later", detail: "Inverted the page so the AI summary leads; raw reviews and secondary widgets move down or to a sidebar." },
      { title: "Contextual intent gating", detail: "No hard paywall — a deferred login fires at peak intent and auto-resumes the user's action after sign-in." },
    ],
    beforeAfter: {
      before: "/case-studies/quick-vibe-check/before.webp",
      after: "/case-studies/quick-vibe-check/after.webp",
      caption: "Drag to compare — the old chronological feed vs. the insights-first redesign.",
    },
    shots: [
      {
        src: "/case-studies/quick-vibe-check/screen-hero.webp",
        caption: "Vibe Check above the feed — insights-first hierarchy",
        wide: true,
      },
      {
        src: "/case-studies/quick-vibe-check/screen-detail-1.webp",
        caption: "The receipts — source reviews behind every AI claim",
      },
      {
        src: "/case-studies/quick-vibe-check/screen-detail-2.webp",
        caption: "Two-column desktop collapses to single-column mobile",
      },
    ],
  },
];

export function CaseStudies() {
  const [active, setActive] = useState<CaseStudyDetail | null>(null);

  return (
    <section id="work" className="relative z-10 px-6 md:px-10 pt-10 md:pt-16 pb-12 md:pb-16">
      <div className="mb-12 md:mb-16 max-w-4xl">
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
          <li key={s.number} className="group relative">
            <button
              type="button"
              onClick={() => setActive(s)}
              onMouseEnter={(event) => {
                event.currentTarget.querySelector("video")?.play().catch(() => {});
              }}
              className="w-full text-left block py-6 md:py-10 cursor-pointer"
            >
              <div className="relative flex items-center">
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
                    <p className="font-sans text-black/60 flex flex-wrap gap-x-2 gap-y-1">
                      {s.meta.map((m, i) => (
                        <span key={m} className="flex items-center gap-2">
                          <span style={{ fontSize: 14 }}>
                            {m}
                          </span>
                          {i < s.meta.length - 1 && <span aria-hidden className="opacity-40">•</span>}
                        </span>
                      ))}
                    </p>
                  </div>
                </div>

                <div
                  className="hidden md:block pointer-events-none absolute right-[6%] top-1/2 w-[320px] aspect-[4/5] opacity-0 scale-90 transition-all duration-500 ease-out group-hover:opacity-100 group-hover:scale-100 rounded-none shadow-2xl"
                  style={{ transform: `translateY(-50%) rotate(${s.tilt}deg)` }}
                >
                  {s.previewVideo ? (
                    <video
                      className="w-full h-full object-cover"
                      poster={s.image}
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="metadata"
                      aria-hidden="true"
                    >
                      <source src={s.previewVideo} type="video/mp4" />
                    </video>
                  ) : (
                    <ImageWithFallback
                      src={s.image}
                      alt={`${s.title} preview`}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              </div>
            </button>
          </li>
        ))}
      </ul>

      <CaseStudyModal study={active} onClose={() => setActive(null)} />
    </section>
  );
}
