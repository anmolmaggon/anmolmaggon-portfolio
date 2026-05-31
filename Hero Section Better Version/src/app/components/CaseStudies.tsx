import { useState } from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { CaseStudyModal, type CaseStudyDetail } from "./CaseStudyModal";

type Study = CaseStudyDetail & {
  image: string;
  tilt: number;
};

const studies: Study[] = [
  {
    number: "01",
    title: "Notes",
    client: "AmbitionBox Communities",
    year: "2025",
    role: "End-to-end design",
    meta: ["Anonymous", "End-to-end", "Shipped"],
    image:
      "https://images.unsplash.com/photo-1551650975-87deedd944c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1600",
    cover:
      "https://images.unsplash.com/photo-1551650975-87deedd944c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=2000",
    tilt: -6,
    problem:
      "Employees wanted to share what working somewhere actually feels like — the unwritten stuff — but the existing review form punished honesty with identity exposure.",
    approach:
      "Designed an anonymous-first surface that lowers the cost of being candid: short prompts, drafts that auto-save, and a tone that signals 'this is a notebook, not a performance review.'",
    impact: [
      { value: "4.2×", label: "submissions vs. legacy reviews" },
      { value: "62%", label: "first-time contributors" },
      { value: "11k", label: "Notes in first quarter" },
      { value: "+38%", label: "time on company page" },
    ],
    decisions: [
      { title: "Anonymity by default", detail: "Identity opt-in, not opt-out. Trust is the whole product." },
      { title: "Prompts over blank pages", detail: "Short, specific cues unlock the kind of detail a 5-star slider can't." },
      { title: "One Note, one feeling", detail: "We resisted threading. Compression makes things more honest." },
    ],
    shots: [
      {
        src: "https://images.unsplash.com/photo-1551650975-87deedd944c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1800",
        caption: "Compose surface — prompt-led, anonymous by default",
        wide: true,
      },
      {
        src: "https://images.unsplash.com/photo-1517436026-b1a89eb9b6cf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1400",
        caption: "Feed — Notes grouped by theme, not chronology",
      },
      {
        src: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1400",
        caption: "Empty state · prompts as a soft onboarding",
      },
    ],
  },
  {
    number: "02",
    title: "Salary Pages",
    client: "AmbitionBox · Redesign",
    year: "2024",
    role: "IA & visual system",
    meta: ["Information architecture", "Web"],
    image:
      "https://images.unsplash.com/photo-1560461396-ec0ef7bb29dd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1600",
    cover:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=2000",
    tilt: 5,
    problem:
      "The old page buried the answer. People came to find out 'what should I be paid?' and left with a wall of filters, charts, and ad slots.",
    approach:
      "Reordered the page around the one question users actually ask. Hero answer first, distribution second, comparables third — everything else collapsed.",
    impact: [
      { value: "1.9×", label: "salary search → CTA" },
      { value: "−41%", label: "bounce rate" },
      { value: "+27%", label: "scroll depth" },
      { value: "8s", label: "to first answer (was 23s)" },
    ],
    decisions: [
      { title: "Answer-first hero", detail: "The median number, in words, before any chart loads." },
      { title: "Charts as receipts", detail: "Visualizations support the headline — they're not the headline." },
      { title: "Comparables, not filters", detail: "Show 'people in roles like yours' instead of asking users to build a query." },
    ],
    shots: [
      {
        src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1800",
        caption: "Hero — the median answer, in plain language",
        wide: true,
      },
      {
        src: "https://images.unsplash.com/photo-1543286386-713bdd548da4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1400",
        caption: "Distribution — percentiles as a story, not a histogram",
      },
      {
        src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1400",
        caption: "Comparables — adjacent roles surface automatically",
      },
    ],
  },
  {
    number: "03",
    title: "Quick Vibe Check",
    client: "Reviews AI Summary",
    year: "2025",
    role: "AI product design",
    meta: ["AI", "Sentiment", "30k+ reviews"],
    image:
      "https://images.unsplash.com/photo-1576153192396-180ecef2a715?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1600",
    cover:
      "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=2000",
    tilt: -4,
    problem:
      "A company page can have 30,000 reviews. Nobody reads 30,000 reviews. The signal was there — buried under repetition.",
    approach:
      "Built a one-card summary that compresses thousands of reviews into the four feelings people actually want to know: pace, growth, leadership, balance. Every claim links back to source quotes.",
    impact: [
      { value: "12s", label: "median read time per company" },
      { value: "94%", label: "agreement with manual rating" },
      { value: "30k+", label: "reviews summarized live" },
      { value: "3.6×", label: "page → 'apply' conversion" },
    ],
    decisions: [
      { title: "Four axes, not five stars", detail: "Stars hide trade-offs. Pace/growth/leadership/balance lets you pick what you care about." },
      { title: "Every claim is sourced", detail: "Tap a vibe → see the quotes. No black-box LLM 'trust me'." },
      { title: "Confidence on the surface", detail: "When the model isn't sure, the card says so out loud." },
    ],
    shots: [
      {
        src: "https://images.unsplash.com/photo-1551434678-e076c223a692?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1800",
        caption: "Summary card — four-axis vibe at a glance",
        wide: true,
      },
      {
        src: "https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1400",
        caption: "Drill-in — source quotes behind every claim",
      },
      {
        src: "https://images.unsplash.com/photo-1488998427799-e3362cec87c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1400",
        caption: "Low-confidence state — model honesty by default",
      },
    ],
  },
];

export function CaseStudies() {
  const [active, setActive] = useState<CaseStudyDetail | null>(null);

  return (
    <section id="work" className="px-6 md:px-10 pt-10 md:pt-16 pb-24 md:pb-40">
      <ul>
        {studies.map((s) => (
          <li key={s.number} className="group relative">
            <button
              type="button"
              onClick={() => setActive(s)}
              className="w-full text-left block py-6 md:py-10"
            >
              <div className="relative flex items-center">
                <span
                  aria-hidden
                  className="font-[Nyght_Serif] absolute left-0 top-1/2 -translate-y-1/2 opacity-0 -translate-x-2 transition-all duration-500 ease-out group-hover:opacity-100 group-hover:translate-x-0"
                  style={{ fontSize: "clamp(28px, 3vw, 44px)", fontWeight: 400 }}
                >
                  →
                </span>

                <div className="flex-1 min-w-0 transition-transform duration-500 ease-out group-hover:translate-x-[72px] md:group-hover:translate-x-[96px]">
                  <h3
                    className="font-[Nyght_Serif] transition-colors duration-500 text-black/25 group-hover:text-black"
                    style={{
                      fontSize: "clamp(48px, 8vw, 128px)",
                      lineHeight: 0.95,
                      fontWeight: 400,
                      letterSpacing: "-0.025em",
                    }}
                  >
                    {s.title}
                  </h3>

                  <div className="overflow-hidden transition-all duration-500 ease-out max-h-0 opacity-0 group-hover:max-h-12 group-hover:opacity-100 group-hover:mt-3">
                    <p className="eyebrow opacity-70 flex flex-wrap gap-x-3 gap-y-1">
                      {s.meta.map((m, i) => (
                        <span key={m} className="flex items-center gap-3">
                          <span
                            className="uppercase tracking-[0.18em] not-italic"
                            style={{ fontWeight: 400, fontSize: 11 }}
                          >
                            {m}
                          </span>
                          {i < s.meta.length - 1 && <span aria-hidden>•</span>}
                        </span>
                      ))}
                    </p>
                  </div>
                </div>

                <div
                  className="hidden md:block pointer-events-none absolute right-[6%] top-1/2 w-[380px] aspect-[5/4] opacity-0 scale-90 transition-all duration-500 ease-out group-hover:opacity-100 group-hover:scale-100 overflow-hidden rounded-[16px] shadow-2xl"
                  style={{ transform: `translateY(-50%) rotate(${s.tilt}deg)` }}
                >
                  <ImageWithFallback
                    src={s.image}
                    alt={`${s.title} preview`}
                    className="w-full h-full object-cover"
                  />
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
