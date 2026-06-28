import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { GoldfishLayer } from "./principles/GoldfishLayer";
import { ButlerNote } from "./principles/ButlerNote";
import { SunCursor } from "./principles/SunCursor";
import { SakuraPetals } from "./principles/SakuraPetals";
import { ScrollCursor } from "./principles/ScrollCursor";
import { SectionHeader } from "./ui/SectionHeader";

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
  // Once the user has tapped a principle on mobile, retire the tap nudges.
  const [hasInteracted, setHasInteracted] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const sync = () => setCanHover(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // Mobile: a centered scene stranded over the page if you scroll away feels
  // broken. While one is open on touch, dismiss it on any scroll gesture.
  useEffect(() => {
    if (canHover || hovered === null) return;
    const close = () => setHovered(null);
    window.addEventListener("scroll", close, { passive: true });
    window.addEventListener("touchmove", close, { passive: true });
    return () => {
      window.removeEventListener("scroll", close);
      window.removeEventListener("touchmove", close);
    };
  }, [canHover, hovered]);

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
      {/* the whole section inverts when "change" is hovered */}
      <motion.div
        className="px-gutter md:px-gutter-lg py-section md:py-section-lg bg-brand-light"
        initial={false}
        animate={{ filter: inverted ? "invert(1)" : "invert(0)" }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      >
        <SectionHeader
          title="What I keep close"
          subtitle={canHover ? "Hover a principle to unlock its scene." : undefined}
        />

        <ol className="space-y-0">
          {principles.map((p, i) => {
            const isHovered = hovered === i;
            const isShaking = p.id === "change" && isHovered;
            return (
              <li
                key={p.id}
                onMouseEnter={() => canHover && setHovered(i)}
                onMouseLeave={() => canHover && setHovered((cur) => (cur === i ? null : cur))}
                onClick={() => {
                  // Touch: tap toggles the principle's scene (tap again / tap
                  // another to switch). Desktop is driven by hover above.
                  if (!canHover) {
                    setHasInteracted(true);
                    setHovered((cur) => (cur === i ? null : i));
                  }
                }}
                className="group relative isolate grid grid-cols-12 items-start gap-4 md:gap-8 py-10 md:py-14 border-t border-hairline last:border-b last:border-hairline transition-colors duration-500 cursor-pointer md:cursor-default"
              >
                {/* Mobile nudge: one tooltip under the first principle, pointing
                    up at it with a gentle bounce. Retires after the first tap. */}
                {!canHover && !hasInteracted && i === 0 && (
                  <motion.div
                    aria-hidden
                    className="md:hidden pointer-events-none absolute left-12 top-full z-20 -mt-2"
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: [0, 6, 0] }}
                    transition={{
                      opacity: { duration: 0.4 },
                      y: { duration: 1.4, repeat: Infinity, ease: "easeInOut" },
                    }}
                  >
                    {/* upward caret pointing at the principle */}
                    <span className="absolute -top-[6px] left-6 h-3 w-3 rotate-45 rounded-xs bg-ink" />
                    <span className="relative inline-flex items-center rounded-full bg-ink px-3 py-1.5 text-micro font-medium uppercase tracking-[0.14em] text-brand-light">
                      Tap to see magic
                    </span>
                  </motion.div>
                )}
                {/* Bespoke scenes (wired by id). The contained ones play on both
                    hover (desktop) and tap (mobile) via `active`. The cursor-attached
                    note/sun/scroll are handled separately but now support touch via centering. */}
                {p.id === "hospitality" && <ButlerNote active={isHovered} touch={!canHover} />}
                {p.id === "goldfish" && <GoldfishLayer active={isHovered} />}
                {p.id === "ichigo" && <SakuraPetals active={isHovered} />}
                {p.id === "ichigo" && <ScrollCursor active={isHovered} touch={!canHover} />}
                {p.id === "energy" && <SunCursor active={isHovered} touch={!canHover} />}

                {/* Energy's sun cursor works on touch now. No ambient radial glow needed. */}

                <span className={`col-span-2 md:col-span-1 italic numeral text-meta md:text-meta leading-none mt-0.5 md:mt-4 transition-opacity duration-500 group-hover:opacity-100 ${canHover ? "opacity-40" : "opacity-100"}`}>
                  {String(i + 1).padStart(2, "0")}
                </span>

                <motion.h3
                  className={`col-span-10 md:col-span-6 font-[Nyght_Serif] transition-colors duration-500 group-hover:text-ink text-fluid-h2 leading-[1.02] tracking-display-tight font-normal ${canHover ? "text-ink-faint" : "text-ink"}`}
                  style={{
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
                  className={`col-span-12 md:col-span-5 max-w-md mt-3 md:mt-2.5 transition-all duration-500 group-hover:opacity-80 text-fluid-body leading-[1.5] whitespace-pre-line ${canHover ? "opacity-50" : "opacity-80"}`}
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
