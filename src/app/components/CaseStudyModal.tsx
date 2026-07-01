import { useEffect } from "react";
import { SectionLabel } from "./SectionLabel";
import { Pill } from "./Pill";
import { CloseButton } from "./CloseButton";
import { useRevealOnScroll } from "../hooks/useRevealOnScroll";
import { createPortal } from "react-dom";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { VideoWithFallback } from "./VideoWithFallback";
import { BeforeAfterSlider } from "./BeforeAfterSlider";
import { BeforeAfterScroll } from "./BeforeAfterScroll";
import { Label } from "./Label";
import { HoverLink } from "./HoverLink";
import { useGlobalContext } from "../context/GlobalContext";
import linkedInLogo from "../../imports/InBug-Black.png";
import instagramLogo from "../../imports/Instagram_Glyph_Black.svg";
import { LETS_TALK_MAILTO } from "../data/contact";
import { Mail } from "lucide-react";

export type CaseStudyDetail = {
  // ── Core — every study fills these ──────────────────────────────────────────
  slug: string;
  number: string;
  title: string;
  client: string;
  year: string;
  role: string;
  meta: string[];
  problem: string;
  approach: string;
  decisions: { title: string; detail: string; image?: string; images?: {src: string; caption?: string}[]; videos?: {src: string; caption?: string}[] }[];
  cover: string;
  shots: { src: string; caption: string; wide?: boolean; heading?: string; label?: string }[];

  // ── Layout — data-driven, so the component never branches on slug ───────────
  // "beforeAfter": the redesign slider IS the hero (renders up top, replaces the
  // cover). "cover" (default when omitted): the cover image/video is the hero.
  heroLayout?: "beforeAfter" | "cover";

  // ── Optional bespoke slots — include only when the study needs them ──────────
  subtitle?: string;
  context?: string;
  impact?: { value: string; label: string }[];
  impactNote?: string;
  whatICut?: { chips: string[]; caption: string };
  watching?: { metrics: string[]; caption?: string };
  noFigma?: string;
  earlySignal?: string;
  beyondDesign?: { questions: { label: string; question: string }[]; ctaLead: string };
  beforeAfter?: { before: string; after: string; caption?: string };
  coverVideo?: string;
  coverCaption?: string;
};

type Props = {
  study: CaseStudyDetail | null;
  prevStudy?: CaseStudyDetail | null;
  nextStudy?: CaseStudyDetail | null;
  onNavigate?: (study: CaseStudyDetail) => void;
  onClose: () => void;
};

/* ComposerGrid has been removed as features are merged into Design Decisions */

export function CaseStudyModal({ study, prevStudy, nextStudy, onNavigate, onClose }: Props) {
  const { pauseBackgroundAudio, resumeBackgroundAudio } = useGlobalContext();
  const { scrollRef, isScrolled, atEnd, onScroll } = useRevealOnScroll(study);

  useEffect(() => {
    if (!study) return;
    
    // Pause background music while modal is open
    pauseBackgroundAudio();

    const previousOverflow = document.body.style.overflow;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
      resumeBackgroundAudio(); // Resume when modal closes
    };
  }, [study, onClose, pauseBackgroundAudio, resumeBackgroundAudio]);

  if (!study || typeof document === "undefined") return null;

  // Shared "you're probably wondering" chip. `big` = desktop sizing; both use
  // the readable sans face. `text` lets mobile show the short label and desktop
  // the full question.
  const renderChip = (
    q: { label: string; question: string },
    text: string,
    big: boolean,
  ) => (
    <Pill
      key={q.label}
      href={`mailto:anmolmaggon40@gmail.com?subject=${encodeURIComponent(`${study.title} - ${q.question}`)}&body=${encodeURIComponent(`Hi Anmol - I went through your ${study.title} case study, and I'd love to learn more about how you're thinking about this: ${q.question}`)}`}
      variant="outline"
      size={big ? "lg" : "sm"}
      className="shrink-0"
    >
      {text}
    </Pill>
  );

  // Prose lives in a centered reading column (48rem) at ≥md; lines stay LEFT-aligned.
  // Media + the numbered ledger stay full content-width (they fill the max-w-page cap).
  const READING = "max-w-reading md:mx-auto";
  const heroIsBeforeAfter = study.heroLayout === "beforeAfter" && !!study.beforeAfter;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[9999] bg-scrim flex items-stretch justify-center p-0"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        data-lenis-prevent="true"
        className="relative w-full h-[100dvh] bg-brand-light rounded-none flex flex-col overflow-hidden shadow-2xl"
      >
        {/* Floating Close Button - Always visible */}
        <CloseButton
          onClick={onClose}
          tone="onLight"
          iconSize={20}
          className="absolute top-3 right-3 md:top-4 md:right-4 z-[10000] w-10 h-10 md:w-12 md:h-12"
        />

        {/* Reveal-on-Scroll Header */}
        <header 
          className={`absolute top-0 left-0 right-0 flex items-center h-16 md:h-20 px-6 border-b border-hairline bg-brand-light/90 backdrop-blur-glass z-[9999] transition-all duration-500 ease-in-out pr-20 ${
            isScrolled ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none"
          }`}
        >
          <h2 className="font-[Nyght_Serif] text-xl md:text-2xl text-ink-strong">{study.title}</h2>
        </header>

        {/* Scrollable Content */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto overflow-x-hidden overscroll-none"
          onScroll={onScroll}
        >
          <div className="mx-auto max-w-page px-gutter md:px-gutter-lg py-10 md:py-16 pb-28 md:pb-32">
          {/* Flow sections share one vertical rhythm; the trailing bands sit outside it */}
          <div className="space-y-16 md:space-y-24">

          {/* 2. Meta eyebrow, title & subtitle — centered reading column */}
          <div className={READING}>
            <p className="font-sans font-medium text-label uppercase tracking-wider text-ink-label flex flex-wrap items-center gap-x-3 gap-y-2 mb-6 pr-12 md:pr-0">
              {study.meta.map((m, i, arr) => (
                <span key={m} className="flex items-center gap-3">
                  {m}
                  {i < arr.length - 1 && <span aria-hidden className="text-ink-ghost">·</span>}
                </span>
              ))}
            </p>
            <h2
              className="font-[Nyght_Serif] text-fluid-massive leading-display tracking-display-tight font-normal"
            >
              {study.title}
              <em className="italic">.</em>
            </h2>
            {study.subtitle && (
              <p className="font-sans text-ink-body max-w-2xl text-fluid-h4-sm leading-prose mt-5 md:mt-6">
                {study.subtitle}
              </p>
            )}
          </div>

          {/* Hero — before/after slider (heroLayout: "beforeAfter") or the cover image/video */}
          {heroIsBeforeAfter ? (
            <div className="flex flex-col items-center">
              <BeforeAfterSlider
                before={study.beforeAfter!.before}
                after={study.beforeAfter!.after}
                caption={study.beforeAfter!.caption}
                isMobileLayout={true}
              />
            </div>
          ) : (
            <figure>
              <div className="overflow-hidden aspect-[16/9] relative">
                {study.coverVideo ? (
                  <VideoWithFallback
                    className="w-full h-full object-cover"
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    aria-hidden="true"
                  >
                    <source src={study.coverVideo} type="video/mp4" />
                  </VideoWithFallback>
                ) : (
                  <ImageWithFallback src={study.cover} alt={`${study.title} cover`} className="w-full h-full object-cover" />
                )}
              </div>
              {study.coverCaption && (
                <figcaption className="pt-4 italic opacity-60 text-label">{study.coverCaption}</figcaption>
              )}
            </figure>
          )}

          {/* Context — boxed aside, centered in the reading column */}
          {study.context && (
            <div className={`${READING} border border-hairline p-6 md:p-8`}>
              <SectionLabel className="mb-4">For context</SectionLabel>
              <p className="text-ink-body font-sans text-fluid-body-sm leading-body font-normal">
                {study.context}
              </p>
            </div>
          )}

          {/* The problem — centered reading column, label above */}
          <div className={READING}>
            <SectionLabel className="mb-4">The problem</SectionLabel>
            <p className="font-sans text-ink-strong text-fluid-h4 leading-prose tracking-snug font-normal">
              {study.problem}
            </p>
          </div>

          {/* Approach — centered reading column, label above */}
          <div className={READING}>
            <SectionLabel className="mb-4">Approach</SectionLabel>
            <p className="font-sans text-ink-strong text-fluid-h4 leading-prose tracking-snug font-normal">
              {study.approach}
            </p>
          </div>

          {/* Impact stats — centered in the reading column */}
          {study.impact && study.impact.length > 0 && (
          <div className={READING}>
            <SectionLabel className="mb-8">The impact</SectionLabel>
            {study.impactNote && (
              <SectionLabel className="mb-6">{study.impactNote}</SectionLabel>
            )}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {study.impact.map((m) => (
                <div key={m.label} className="p-6 md:p-8 border border-hairline bg-white/50 text-ink flex flex-col justify-start items-center text-center transition-transform hover:-translate-y-1">
                  <p className="font-[Nyght_Serif] text-fluid-stat leading-display tracking-display font-normal">
                    {m.value}
                  </p>
                  <p className="mt-4 font-sans font-medium opacity-60 uppercase tracking-wider text-micro md:text-caption">{m.label}</p>
                </div>
              ))}
            </div>
          </div>
          )}

          {/* Design decisions — numbered ledger, centered in the reading column */}
          <div className={READING}>
            <SectionLabel className="mb-8">Design decisions</SectionLabel>
            <ol className="space-y-0">
              {study.decisions.map((d, i) => (
                <li
                  key={d.title}
                  className="py-8 md:py-12 border-t border-hairline last:border-b flex flex-col gap-8 md:gap-12"
                >
                  <div className="grid grid-cols-12 items-baseline gap-4 md:gap-8">
                    <span className="col-span-2 md:col-span-1 italic numeral text-label opacity-50">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="col-span-10 md:col-span-5 font-[Nyght_Serif] text-fluid-h4-sm leading-tight font-normal">
                      {d.title}
                    </h3>
                    <div className="col-span-12 md:col-span-6 flex flex-col gap-4">
                      <p className="text-ink-body font-sans text-fluid-body-sm leading-body">
                        {d.detail}
                      </p>
                      {d.image && (
                        <div className="w-full max-w-[320px] bg-ink-wash mt-4 overflow-hidden">
                          <ImageWithFallback src={d.image} alt={d.title} className="w-full h-auto object-cover" />
                        </div>
                      )}
                    </div>
                  </div>

                  {d.videos && d.videos.length > 0 && (
                    <div className="w-full">
                      <div className={`grid gap-4 md:gap-6 ${d.videos.length === 4 ? "grid-cols-2 md:grid-cols-4" : d.videos.length > 1 ? "grid-cols-2" : "grid-cols-1 max-w-sm mx-auto"}`}>
                        {d.videos.map((vid, vIdx) => (
                          <div key={vIdx} className="flex flex-col gap-3 items-center">
                            <VideoWithFallback
                              src={vid.src}
                              className="max-w-full"
                              mediaClassName="block w-auto h-auto max-h-[60vh] max-w-full object-contain"
                              autoPlay
                              muted
                              loop
                              playsInline
                              preload="metadata"
                            />
                            {vid.caption && (
                              <p className="text-center font-sans text-label text-ink-label px-2 leading-snug">
                                {vid.caption}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {d.images && d.images.length > 0 && (
                    <div className="w-full">
                      <div className={`grid gap-4 md:gap-6 ${d.images.length > 1 ? "grid-cols-2" : "grid-cols-1 max-w-sm mx-auto"}`}>
                        {d.images.map((img, imgIdx) => (
                          <div key={imgIdx} className="flex flex-col gap-3 items-center">
                            <ImageWithFallback
                              src={img.src}
                              alt={img.caption || d.title}
                              className="max-w-full"
                              mediaClassName="block w-auto h-auto max-h-[60vh] max-w-full object-contain"
                            />
                            {img.caption && (
                              <p className="text-center font-sans text-label text-ink-label px-2 leading-snug">
                                {img.caption}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </li>
              ))}
              {study.whatICut && (
                <li className="grid grid-cols-12 items-baseline gap-4 md:gap-8 py-6 md:py-8 border-t border-hairline last:border-b">
                  <span className="col-span-2 md:col-span-1 italic numeral text-label opacity-50">
                    {String(study.decisions.length + 1).padStart(2, "0")}
                  </span>
                  <h3 className="col-span-10 md:col-span-5 font-[Nyght_Serif] text-fluid-h4-sm leading-tight font-normal">
                    {study.whatICut.chips.map((chip, i) => (
                      <span key={chip}>
                        <span className="text-ink-faint line-through decoration-1 decoration-black/40 transition-colors duration-300 hover:text-ink-muted">
                          {chip}
                        </span>
                        {i < study.whatICut!.chips.length - 1 && <span className="text-ink-ghost">, </span>}
                      </span>
                    ))}
                    <span className="text-ink-ghost">.</span>
                  </h3>
                  <p className="col-span-12 md:col-span-6 text-ink-body font-sans text-fluid-body-sm leading-body">
                    {study.whatICut.caption}
                  </p>
                </li>
              )}
            </ol>
          </div>

          {/* Designed in code — editor snippet, centered in the reading column */}
          {study.noFigma && (
            <div className={READING}>
              <SectionLabel className="mb-8">Designed in code</SectionLabel>
              <div className="bg-ink text-brand-light">
                <div className="flex items-center gap-2 px-5 md:px-8 py-3.5 border-b border-paper-hairline">
                  <span aria-hidden className="w-2.5 h-2.5 rounded-full bg-glass" />
                  <span aria-hidden className="w-2.5 h-2.5 rounded-full bg-glass" />
                  <span aria-hidden className="w-2.5 h-2.5 rounded-full bg-glass" />
                  <span className="ml-3 font-mono text-caption text-paper-faint">
                    {study.title.toLowerCase().replace(/\s+/g, "-")}.tsx
                  </span>
                </div>
                <div className="px-5 md:px-8 py-8 md:py-10 font-mono text-meta md:text-meta leading-loose">
                  {study.noFigma.split(/(?<=[.!?])\s+/).map((line, i) => (
                    <p key={i} className="text-paper-muted" style={{ paddingLeft: "3ch", textIndent: "-3ch" }}>
                      {"// "}
                      {line}
                    </p>
                  ))}
                  <p className="mt-6 text-paper-strong">
                    <span className="text-paper-muted">const</span> spec <span className="text-paper-muted">=</span> {"<"}WorkingPrototype{" "}
                    {"/>"};
                    <span aria-hidden className="text-paper-faint animate-pulse"> ▍</span>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* The redesign — before/after shown here when it isn't the hero */}
          {study.beforeAfter && !heroIsBeforeAfter && (
            <div>
              <SectionLabel className="mb-8">The redesign</SectionLabel>
              <BeforeAfterSlider
                before={study.beforeAfter.before}
                after={study.beforeAfter.after}
                caption={study.beforeAfter.caption}
                isMobileLayout={false}
              />
            </div>
          )}

          {/* Selected screens — full-width, no rounded corners */}
          {study.shots.length > 0 && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {study.shots.map((s, i) => (
                <figure
                  key={i}
                  className={`${s.wide ? "md:col-span-2" : ""} overflow-hidden`}
                >
                  <div className={`${s.wide ? "aspect-[16/8]" : "aspect-[4/3]"} bg-ink-wash`}>
                    {s.src.match(/\.(mp4|webm|mov)$/i) ? (
                      <VideoWithFallback
                        className="w-full h-full object-cover"
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="metadata"
                      >
                        <source src={s.src} />
                      </VideoWithFallback>
                    ) : (
                      <ImageWithFallback src={s.src} alt={s.caption} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <figcaption className="pt-4 pb-2 italic opacity-60 text-label">{s.caption}</figcaption>
                </figure>
              ))}
            </div>
          </div>
          )}

          {/* Early Signal — centered reading column with a left accent rule */}
          {study.earlySignal && (
            <div className={`${READING} border-l-2 border-ink-ghost pl-6 md:pl-10`}>
              <SectionLabel className="mb-6">Early Signal</SectionLabel>
              <p className="font-[Nyght_Serif] italic text-ink-strong text-fluid-h3 leading-tight tracking-snug">
                "{study.earlySignal}"
              </p>
            </div>
          )}

          {/* What we're watching — centered reading column, quiet ledger rows */}
          {study.watching && (
            <div className={READING}>
              <SectionLabel className="mb-8">What we're watching</SectionLabel>
              <ul>
                {study.watching.metrics.map((m) => (
                  <li key={m} className="py-4 md:py-5 border-t border-hairline last:border-b">
                    <p className="font-[Nyght_Serif] text-ink-strong text-fluid-h5 leading-tight tracking-snug font-normal">
                      <span aria-hidden className="text-ink-faint mr-3 text-[0.8em]">↑</span>
                      {m}
                    </p>
                  </li>
                ))}
              </ul>
              {study.watching.caption && (
                <p className="font-sans italic text-meta text-ink-label mt-6">{study.watching.caption}</p>
              )}
            </div>
          )}

          </div>{/* end flow-section rhythm */}

          {/* Beyond the design — open product questions, footer-feel closing band */}
          {study.beyondDesign && (
            <div className="mt-16 md:mt-24 relative -mx-6 md:-mx-10 px-gutter md:px-gutter-lg py-16 md:py-24 overflow-hidden">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "radial-gradient(80% 130% at 50% 100%, rgba(171,143,255,0.12), rgba(127,200,232,0.05) 55%, rgba(127,200,232,0) 80%)",
                  maskImage: "linear-gradient(to right, transparent 0%, #000 15%, #000 85%, transparent 100%)",
                  WebkitMaskImage: "linear-gradient(to right, transparent 0%, #000 15%, #000 85%, transparent 100%)",
                }}
              />
              <div className="relative">
                <p className="font-sans italic text-meta text-ink-muted text-center mb-5">You're probably wondering</p>
                {/* Mobile: two rows that hug their content, centered when they
                    fit and horizontally scrollable (left edge stays reachable)
                    when they don't. */}
                <div className="md:hidden -mx-6 overflow-x-auto px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden mb-10">
                  <div className="mx-auto flex w-max flex-col gap-2.5">
                    {(() => {
                      const qs = study.beyondDesign.questions;
                      const half = Math.ceil(qs.length / 2);
                      return [qs.slice(0, half), qs.slice(half)].map((rowQs, ri) => (
                        <div key={ri} className="flex gap-2.5">
                          {rowQs.map((q) => renderChip(q, q.label, false))}
                        </div>
                      ));
                    })()}
                  </div>
                </div>

                {/* Desktop: wrap + centered, full questions, readable sans. */}
                <div className="hidden md:flex md:flex-wrap md:justify-center gap-4 mb-12">
                  {study.beyondDesign.questions.map((q) => renderChip(q, q.question, true))}
                </div>
                <div className="text-center">
                  <p className="font-sans italic text-meta text-ink-muted mb-5">{study.beyondDesign.ctaLead}</p>
                  <HoverLink
                    href={LETS_TALK_MAILTO}
                    className="font-[Nyght_Serif] italic text-fluid-h5 md:text-fluid-h3 font-normal whitespace-nowrap"
                  >
                    anmolmaggon40@gmail.com →
                  </HoverLink>
                  <div className="flex items-center justify-center gap-5 mt-8">
                    <HoverLink
                      href="https://www.linkedin.com/in/anmolmaggon40/"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="LinkedIn"
                    >
                      <img src={linkedInLogo} alt="LinkedIn" className="w-[20px] h-[20px] md:w-[22px] md:h-[22px] object-contain" />
                    </HoverLink>
                    <HoverLink
                      href="https://www.instagram.com/anmol.maggon/"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Instagram"
                    >
                      <img src={instagramLogo} alt="Instagram" className="w-[20px] h-[20px] md:w-[22px] md:h-[22px] object-contain" />
                    </HoverLink>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Previous / Next - slim bar the sticky footer hands off to.
              Flush under the beyondDesign band (its border-t divides); otherwise a rhythm gap. */}
          {(prevStudy || nextStudy) && onNavigate && (
            <div className={`${study.beyondDesign ? "" : "mt-16 md:mt-24"} -mx-6 md:-mx-10 -mb-28 md:-mb-32 border-t border-hairline`}>
              <div className="px-gutter md:px-gutter-lg flex items-center justify-between gap-4 py-5 md:py-6">
                {prevStudy ? (
                  <button
                    type="button"
                    onClick={() => onNavigate(prevStudy)}
                    aria-label={`Previous case study: ${prevStudy.title}`}
                    className="group inline-flex items-center gap-2 md:gap-3 min-w-0 max-w-[50%] text-left cursor-pointer"
                  >
                    <span
                      aria-hidden
                      className="inline-block font-[Nyght_Serif] font-normal text-sm md:text-lg opacity-40 transition-transform duration-500 ease-out group-hover:-translate-x-1 shrink-0"
                    >
                      ←
                    </span>
                    <span className="font-[Nyght_Serif] font-normal text-sm md:text-lg text-ink-body group-hover:text-ink transition-colors duration-300 truncate relative after:content-[''] after:absolute after:left-0 after:right-0 after:bottom-0 after:h-px after:bg-current after:scale-x-0 after:origin-left after:transition-transform after:duration-300 group-hover:after:scale-x-100">
                      {prevStudy.title}
                    </span>
                  </button>
                ) : <div className="flex-1" />}
                
                {nextStudy ? (
                  <button
                    type="button"
                    onClick={() => onNavigate(nextStudy)}
                    aria-label={`Next case study: ${nextStudy.title}`}
                    className="group inline-flex items-center justify-end gap-2 md:gap-3 min-w-0 max-w-[50%] text-right cursor-pointer ml-auto"
                  >
                    <span className="font-[Nyght_Serif] font-normal text-sm md:text-lg text-ink-body group-hover:text-ink transition-colors duration-300 truncate relative after:content-[''] after:absolute after:left-0 after:right-0 after:bottom-0 after:h-px after:bg-current after:scale-x-0 after:origin-right after:transition-transform after:duration-300 group-hover:after:scale-x-100">
                      {nextStudy.title}
                    </span>
                    <span
                      aria-hidden
                      className="inline-block font-[Nyght_Serif] font-normal text-sm md:text-lg opacity-40 transition-transform duration-500 ease-out group-hover:translate-x-1 shrink-0"
                    >
                      →
                    </span>
                  </button>
                ) : <div className="flex-1" />}
              </div>
            </div>
          )}

          </div>
        </div>

        {/* Reveal-on-Scroll Footer - hands off to the prev/next bar at page end */}
        <footer
          className={`absolute bottom-0 left-0 right-0 py-3 md:py-5 border-t border-hairline bg-brand-light/90 backdrop-blur-glass z-[9999] transition-all duration-500 ease-in-out ${
            isScrolled && !atEnd ? "translate-y-0 opacity-100" : "translate-y-full opacity-0 pointer-events-none"
          }`}
        >
          {/* Desktop: prompt + email + socials */}
          <div className="hidden md:flex px-gutter md:px-gutter-lg items-center justify-between gap-6 flex-wrap">
            <div className="flex items-baseline gap-4 md:gap-6 flex-wrap">
              <p className="font-sans italic text-meta text-ink-muted">Want the full walkthrough?</p>
              <HoverLink
                href={LETS_TALK_MAILTO}
                className="font-[Nyght_Serif] italic text-fluid-h5 font-normal"
              >
                anmolmaggon40@gmail.com →
              </HoverLink>
            </div>
            <div className="flex items-center gap-4">
              <HoverLink
                href="https://www.linkedin.com/in/anmolmaggon40/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <img src={linkedInLogo} alt="LinkedIn" className="w-[22px] h-[22px] object-contain" />
              </HoverLink>
              <HoverLink
                href="https://www.instagram.com/anmol.maggon/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <img src={instagramLogo} alt="Instagram" className="w-[22px] h-[22px] object-contain" />
              </HoverLink>
            </div>
          </div>

          {/* Mobile: prompt left, icons right — short bar, more study visible */}
          <div className="md:hidden px-gutter flex items-center justify-between gap-4">
            <p className="font-sans italic text-meta text-ink-muted">Want the full walkthrough?</p>
            <div className="flex items-center gap-5 shrink-0">
              <HoverLink href={LETS_TALK_MAILTO} aria-label="Email">
                <Mail className="w-5 h-5 text-ink" strokeWidth={1.75} aria-hidden />
              </HoverLink>
              <HoverLink
                href="https://www.linkedin.com/in/anmolmaggon40/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <img src={linkedInLogo} alt="LinkedIn" className="w-5 h-5 object-contain" />
              </HoverLink>
              <HoverLink
                href="https://www.instagram.com/anmol.maggon/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <img src={instagramLogo} alt="Instagram" className="w-5 h-5 object-contain" />
              </HoverLink>
            </div>
          </div>
        </footer>
      </div>
    </div>,
    document.body,
  );
}
