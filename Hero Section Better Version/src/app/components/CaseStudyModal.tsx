import { useEffect } from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Label } from "./Label";

export type CaseStudyDetail = {
  number: string;
  title: string;
  client: string;
  year: string;
  role: string;
  meta: string[];
  problem: string;
  approach: string;
  impact: { value: string; label: string }[];
  decisions: { title: string; detail: string }[];
  cover: string;
  shots: { src: string; caption: string; wide?: boolean }[];
};

type Props = {
  study: CaseStudyDetail | null;
  onClose: () => void;
};

export function CaseStudyModal({ study, onClose }: Props) {
  useEffect(() => {
    if (!study) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [study, onClose]);

  if (!study) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-stretch justify-center"
      style={{ padding: "40px" }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full h-full bg-[#fafaf7] rounded-[20px] overflow-y-auto overflow-x-hidden shadow-2xl"
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="sticky top-6 ml-auto mr-6 z-20 flex items-center gap-2 px-4 py-2 rounded-full bg-black text-white text-[12px] hover:bg-black/80 transition-colors"
          style={{ fontFamily: "system-ui, sans-serif", fontWeight: 500, float: "right" }}
        >
          Close ✕
        </button>

        <div className="px-8 md:px-16 lg:px-24 py-16 md:py-20 max-w-[1400px] mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <span className="italic numeral text-[14px] opacity-50">{study.number}</span>
            <Label variant="outline" size="sm">{study.client}</Label>
            <Label variant="outline" size="sm">{study.year}</Label>
            <Label variant="outline" size="sm">{study.role}</Label>
          </div>

          <h1
            className="font-[Nyght_Serif] mb-10"
            style={{
              fontSize: "clamp(48px, 8vw, 128px)",
              lineHeight: 0.95,
              fontWeight: 400,
              letterSpacing: "-0.03em",
            }}
          >
            {study.title}
            <em className="italic" style={{ color: "#fe4638" }}>.</em>
          </h1>

          <div className="rounded-[16px] overflow-hidden mb-20 aspect-[16/9] shadow-xl">
            <ImageWithFallback src={study.cover} alt={`${study.title} cover`} className="w-full h-full object-cover" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-24">
            <div className="md:col-span-3">
              <p className="eyebrow opacity-60">The problem</p>
            </div>
            <p
              className="md:col-span-9 font-[Nyght_Serif] max-w-3xl"
              style={{ fontSize: "clamp(22px, 2.4vw, 36px)", lineHeight: 1.25, fontWeight: 400, letterSpacing: "-0.01em" }}
            >
              {study.problem}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-24">
            <div className="md:col-span-3">
              <p className="eyebrow opacity-60">Approach</p>
            </div>
            <p
              className="md:col-span-9 max-w-2xl opacity-80 italic"
              style={{ fontSize: "clamp(17px, 1.4vw, 20px)", lineHeight: 1.55, fontWeight: 400 }}
            >
              {study.approach}
            </p>
          </div>

          <div className="mb-24">
            <p className="eyebrow opacity-60 mb-8">Selected screens</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {study.shots.map((s, i) => (
                <figure
                  key={i}
                  className={`${s.wide ? "md:col-span-2" : ""} rounded-[14px] overflow-hidden bg-black/5`}
                >
                  <div className={s.wide ? "aspect-[16/8]" : "aspect-[4/3]"}>
                    <ImageWithFallback src={s.src} alt={s.caption} className="w-full h-full object-cover" />
                  </div>
                  <figcaption className="px-4 py-3 italic opacity-60 text-[13px]">{s.caption}</figcaption>
                </figure>
              ))}
            </div>
          </div>

          <div className="mb-24">
            <p className="eyebrow opacity-60 mb-8">Design decisions</p>
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
                    className="col-span-12 md:col-span-6 italic opacity-70"
                    style={{ fontSize: "clamp(15px, 1.1vw, 17px)", lineHeight: 1.55 }}
                  >
                    {d.detail}
                  </p>
                </li>
              ))}
            </ol>
          </div>

          <div className="mb-12">
            <p className="eyebrow opacity-60 mb-8">Impact</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {study.impact.map((m) => (
                <div key={m.label} className="p-6 rounded-[14px] bg-black text-white">
                  <p
                    className="font-[Nyght_Serif]"
                    style={{ fontSize: "clamp(36px, 4vw, 64px)", lineHeight: 1, fontWeight: 400, letterSpacing: "-0.02em" }}
                  >
                    {m.value}
                  </p>
                  <p className="mt-2 italic opacity-70 text-[13px]">{m.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-16 border-t border-black/15 flex items-center justify-between gap-6 flex-wrap">
            <p className="italic opacity-60 text-[14px]">Want the full walkthrough?</p>
            <a
              href="mailto:anmolmaggon40@gmail.com"
              className="font-[Nyght_Serif] italic"
              style={{ fontSize: "clamp(20px, 2vw, 28px)", fontWeight: 400 }}
            >
              anmolmaggon40@gmail.com →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
