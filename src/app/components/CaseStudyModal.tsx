import { useEffect } from "react";
import { createPortal } from "react-dom";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { BeforeAfterSlider } from "./BeforeAfterSlider";
import { Label } from "./Label";
import { HoverLink } from "./HoverLink";
import { useGlobalContext } from "../context/GlobalContext";
import { Linkedin, Instagram } from "lucide-react";

export type CaseStudyDetail = {
  number: string;
  title: string;
  client: string;
  year: string;
  role: string;
  meta: string[];
  problem: string;
  approach: string;
  impactNote?: string;
  impact: { value: string; label: string }[];
  decisions: { title: string; detail: string }[];
  cover: string;
  shots: { src: string; caption: string; wide?: boolean }[];
  beforeAfter?: { before: string; after: string; caption?: string };
};

type Props = {
  study: CaseStudyDetail | null;
  onClose: () => void;
};

export function CaseStudyModal({ study, onClose }: Props) {
  const { pauseBackgroundAudio, resumeBackgroundAudio } = useGlobalContext();

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

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[9999] bg-black/40 backdrop-blur-sm flex items-stretch justify-center p-0"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        data-lenis-prevent="true"
        className="relative w-full h-full bg-[#fafaf7] rounded-none overflow-y-auto overflow-x-hidden shadow-2xl"
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="fixed top-6 right-6 md:top-8 md:right-8 z-[10000] flex items-center justify-center w-12 h-12 rounded-full bg-black/5 hover:bg-black/10 text-black transition-colors cursor-pointer"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div className="px-5 sm:px-8 md:px-16 lg:px-24 py-14 md:py-20 max-w-[1400px] mx-auto">

          {/* 2. Title */}
          <h1
            className="font-[Nyght_Serif] mb-12"
            style={{
              fontSize: "clamp(48px, 8vw, 128px)",
              lineHeight: 0.95,
              fontWeight: 400,
              letterSpacing: "-0.03em",
            }}
          >
            {study.title}
            <em className="italic">.</em>
          </h1>

          {/* 3. Cover Image (Hero product shot, no rounded corners, no shadow) */}
          <div className="overflow-hidden mb-16 aspect-[16/9]">
            <ImageWithFallback src={study.cover} alt={`${study.title} cover`} className="w-full h-full object-cover" />
          </div>

          {/* 4. The Problem */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-10 mb-12 md:mb-20">
            <div className="md:col-span-3">
              <p className="font-sans font-medium text-[13px] text-black/50 uppercase tracking-wider">The problem</p>
            </div>
            <p
              className="md:col-span-9 font-sans max-w-3xl text-black/80"
              style={{ fontSize: "clamp(20px, 2.2vw, 32px)", lineHeight: 1.4, fontWeight: 400, letterSpacing: "-0.01em" }}
            >
              {study.problem}
            </p>
          </div>

          {/* 5. Approach */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-10 mb-16 md:mb-24">
            <div className="md:col-span-3">
              <p className="font-sans font-medium text-[13px] text-black/50 uppercase tracking-wider">Approach</p>
            </div>
            <p
              className="md:col-span-9 max-w-2xl text-black/70 font-sans"
              style={{ fontSize: "clamp(16px, 1.4vw, 20px)", lineHeight: 1.6, fontWeight: 400 }}
            >
              {study.approach}
            </p>
          </div>

          {/* 6. Impact Stats (Moved from top) */}
          <div className="mb-20 md:mb-24">
            {study.impactNote && (
              <p className="font-sans font-medium text-[13px] text-black/50 uppercase tracking-wider mb-6">{study.impactNote}</p>
            )}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {study.impact.map((m) => (
                <div key={m.label} className="py-5 border-t border-black/15 text-black">
                  <p
                    className="font-[Nyght_Serif]"
                    style={{ fontSize: "clamp(32px, 3.5vw, 48px)", lineHeight: 1, fontWeight: 400, letterSpacing: "-0.02em" }}
                  >
                    {m.value}
                  </p>
                  <p className="mt-3 font-sans opacity-70 text-[14px]">{m.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 7. Design Decisions */}
          <div className="mb-24">
            <p className="font-sans font-medium text-[13px] text-black/50 uppercase tracking-wider mb-8">Design decisions</p>
            <ol className="space-y-0">
              {study.decisions.map((d, i) => (
                <li
                  key={d.title}
                  className="grid grid-cols-12 items-baseline gap-4 md:gap-8 py-6 md:py-8 border-t border-black/15 last:border-b"
                >
                  <span className="col-span-2 md:col-span-1 italic numeral text-[13px] opacity-50">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3
                    className="col-span-10 md:col-span-5 font-[Nyght_Serif]"
                    style={{ fontSize: "clamp(22px, 2vw, 30px)", fontWeight: 400, letterSpacing: "-0.01em" }}
                  >
                    {d.title}
                  </h3>
                  <p
                    className="col-span-12 md:col-span-6 text-black/70 font-sans"
                    style={{ fontSize: "clamp(15px, 1.1vw, 17px)", lineHeight: 1.6 }}
                  >
                    {d.detail}
                  </p>
                </li>
              ))}
            </ol>
          </div>

          {/* 8. Before/After Slider */}
          {study.beforeAfter && (
            <div className="mb-24">
              <p className="font-sans font-medium text-[13px] text-black/50 uppercase tracking-wider mb-8">The redesign</p>
              <BeforeAfterSlider
                before={study.beforeAfter.before}
                after={study.beforeAfter.after}
                caption={study.beforeAfter.caption}
              />
            </div>
          )}

          {/* 9. Selected Screens (No rounded corners, no shadow) */}
          <div className="mb-24">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {study.shots.map((s, i) => (
                <figure
                  key={i}
                  className={`${s.wide ? "md:col-span-2" : ""} overflow-hidden`}
                >
                  <div className={`${s.wide ? "aspect-[16/8]" : "aspect-[4/3]"} bg-black/5`}>
                    <ImageWithFallback src={s.src} alt={s.caption} className="w-full h-full object-cover" />
                  </div>
                  <figcaption className="pt-4 pb-2 italic opacity-60 text-[13px]">{s.caption}</figcaption>
                </figure>
              ))}
            </div>
          </div>

          <div className="pt-16 border-t border-black/15 flex items-center justify-between gap-6 flex-wrap">
            <p className="italic opacity-60 text-[14px]">Want the full walkthrough?</p>
            <div className="flex items-center gap-6 md:gap-8 flex-wrap">
              <HoverLink
                href="mailto:anmolmaggon40@gmail.com"
                className="font-[Nyght_Serif] italic mr-2 md:mr-4"
                style={{ fontSize: "clamp(20px, 2vw, 28px)", fontWeight: 400 }}
              >
                anmolmaggon40@gmail.com →
              </HoverLink>
              <div className="flex items-center gap-5">
                <HoverLink
                  href="https://www.linkedin.com/in/anmolmaggon"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-black/50 hover:text-black transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-5 h-5 md:w-[22px] md:h-[22px]" strokeWidth={1.5} />
                </HoverLink>
                <HoverLink
                  href="https://www.instagram.com/anmolmaggon"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-black/50 hover:text-black transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5 md:w-[22px] md:h-[22px]" strokeWidth={1.5} />
                </HoverLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
