import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { GoldfishLayer } from "./principles/GoldfishLayer";
import { ButlerNote } from "./principles/ButlerNote";
import { SunCursor } from "./principles/SunCursor";
import { SakuraPetals } from "./principles/SakuraPetals";
import { ScrollCursor } from "./principles/ScrollCursor";

type Principle = {
  id: string;
  title: string;
  detail: string;
  cjk?: boolean;
};

// Order is a small story: open on the ethos → read the room → push for change →
// cherish this once-only moment → and stay light enough to take the next shot.
const principles: Principle[] = [
  {
    id: "hospitality",
    title: "Unreasonable Hospitality",
    detail:
      "Inspired by Will Guidara's belief that ordinary moments can be made unforgettable with unreasonable care.\nI try to bring that same energy to products: notice what others miss, then make it feel personal.",
  },
  {
    id: "energy",
    title: "Everything is energy",
    detail: "Sparked by the series Our Universe. We are made of stardust and carry the exact same energy as the sun.",
  },
  {
    id: "change",
    // glue "nothing changes" so, when it wraps, the break lands after "if"
    title: "Nothing changes if nothing\u00a0changes",
    detail:
      "If something feels stuck, I don't wait for the perfect brief, perfect mood, or perfect permission.\nI make the first move, then improve from there.",
  },
  {
    id: "ichigo",
    title: "一期一会",
    detail:
      "One time. One meeting.\nA Japanese idea that reminds me every moment is unrepeatable. Even a small interaction deserves presence, because it will never happen in exactly the same way again.",
    cjk: true,
  },
  {
    id: "goldfish",
    title: "Be a Goldfish",
    detail:
      "A lesson from Ted Lasso: recover quickly.\nLearn what you need, leave the bruise behind, and don't let one bad moment poison the next one.",
  },
];

const CJK_SERIF =
  "'Hiragino Mincho ProN', 'Yu Mincho', 'Songti SC', 'Noto Serif JP', serif";

export function OperatingPrinciples() {
  const [hovered, setHovered] = useState<number | null>(null);
  // On touch devices there's no hover, so the cursor-driven scenes (sun sticker,
  // hanging scroll) and `cursor: none` would just strand the user. Detect a
  // hover-capable pointer and gate all the cursor magic behind it.
  const [canHover, setCanHover] = useState(true);
  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const sync = () => setCanHover(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const hoveredId = hovered === null ? null : principles[hovered].id;
  const inverted = hoveredId === "change";

  // When "change" is hovered the section inverts; flip the nav too via a data
  // attribute + CSS.
  useEffect(() => {
    const el = document.documentElement;
    if (inverted) el.dataset.invert = "1";
    else delete el.dataset.invert;
    return () => {
      delete el.dataset.invert;
    };
  }, [inverted]);

  const cursorHidden =
    canHover &&
    (hoveredId === "energy" || hoveredId === "hospitality" || hoveredId === "ichigo");

  return (
    <section
      id="principles"
      className="relative"
      style={{ cursor: cursorHidden ? "none" : undefined }}
    >
      {/* Cursor-attached scenes — desktop pointer only */}
      {canHover && (
        <>
          {/* 02 — pointer becomes the "Trust your energy" sticker */}
          <SunCursor active={hoveredId === "energy"} />
          {/* 04 — pointer becomes a hanging scroll carrying this exact moment */}
          <ScrollCursor active={hoveredId === "ichigo"} />
        </>
      )}

      {/* the whole section inverts when "change" is hovered */}
      <motion.div
        className="px-6 md:px-10 py-24 md:py-40"
        style={{ background: "#fafaf7" }}
        initial={false}
        animate={{ filter: inverted ? "invert(1)" : "invert(0)" }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="mb-12 md:mb-20 max-w-4xl">
          <p
            className="font-[Nyght_Serif] text-black/70"
            style={{
              fontSize: "clamp(20px, 2.4vw, 34px)",
              lineHeight: 1.1,
              fontWeight: 400,
              letterSpacing: "-0.015em",
            }}
          >
            What I keep close
            <em className="italic">.</em>
          </p>
        </div>

        <ol className="space-y-0">
          {principles.map((p, i) => {
            const isHovered = hovered === i;
            const isShaking = p.id === "change" && isHovered;
            return (
              <li
                key={p.id}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered((cur) => (cur === i ? null : cur))}
                className="group relative isolate grid grid-cols-12 items-start gap-4 md:gap-8 py-10 md:py-14 border-t border-black/15 last:border-b last:border-black/15 transition-colors duration-500"
              >
                {/* bespoke hover scenes (wired by id, so order can change freely) */}
                {p.id === "hospitality" && <ButlerNote active={isHovered} />}
                {p.id === "goldfish" && <GoldfishLayer active={isHovered} />}
                {p.id === "ichigo" && <SakuraPetals active={isHovered} />}

                <span className={`col-span-2 md:col-span-1 italic numeral text-[14px] md:text-[15px] leading-none mt-[2px] md:mt-[16px] transition-opacity duration-500 group-hover:opacity-100 ${canHover ? "opacity-40" : "opacity-100"}`}>
                  {String(i + 1).padStart(2, "0")}
                </span>

                <motion.h3
                  className={`col-span-10 md:col-span-6 font-[Nyght_Serif] transition-colors duration-500 group-hover:text-black ${canHover ? "text-black/35" : "text-black"}`}
                  style={{
                    fontSize: "clamp(30px, 4.6vw, 68px)",
                    lineHeight: 1.02,
                    fontWeight: 400,
                    letterSpacing: "-0.025em",
                    fontFamily: p.cjk ? CJK_SERIF : undefined,
                  }}
                  animate={{
                    x: isShaking ? [0, -11, 9, -7, 5, -3, 0] : 0,
                    rotate: isShaking ? [0, -1, 0.8, -0.6, 0.3, 0] : 0,
                  }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                >
                  {p.title}
                </motion.h3>

                <p
                  className={`col-span-12 md:col-span-5 max-w-md mt-3 md:mt-[10px] transition-all duration-500 group-hover:opacity-80 ${canHover ? "opacity-50" : "opacity-80"}`}
                  style={{ fontSize: "clamp(15px, 1.2vw, 19px)", lineHeight: 1.5, whiteSpace: "pre-line" }}
                >
                  {p.detail}
                </p>
              </li>
            );
          })}
        </ol>
      </motion.div>
    </section>
  );
}
