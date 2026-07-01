import { useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";

/**
 * "Know more" cursor — while a Recent-work case study is hovered on desktop the
 * native cursor is hidden and this solid-ink button rides the pointer
 * (spring-smoothed), so the whole row reads as one big click target. It mirrors
 * the mobile "Know more" pill. Portaled to <body> so it's truly viewport-fixed
 * and above everything. Tracks the pointer continuously (even while hidden) so
 * it's already under the cursor when it fades in — no glide-in from off-screen.
 *
 * Gated by the caller: `active` is only ever true on a hover-capable, fine
 * pointer, so touch devices never see it (they keep the tappable pill).
 */
export function KnowMoreCursor({ active }: { active: boolean }) {
  const reduce = useReducedMotion();
  const x = useMotionValue(-600);
  const y = useMotionValue(-600);
  const sx = useSpring(x, { stiffness: 450, damping: 32, mass: 0.35 });
  const sy = useSpring(y, { stiffness: 450, damping: 32, mass: 0.35 });
  // Reduced motion: track the pointer exactly, with no springy lag.
  const fx = reduce ? x : sx;
  const fy = reduce ? y : sy;

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [x, y]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[9999]"
      style={{ x: fx, y: fy }}
      initial={false}
      animate={{ opacity: active ? 1 : 0, scale: active ? 1 : reduce ? 1 : 0.6 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Centred on the pointer so the pill *is* the cursor. */}
      <span
        className="absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2 inline-flex items-center gap-1.5 whitespace-nowrap rounded-control bg-ink text-white font-sans font-medium shadow-float px-4 py-2.5"
        style={{ fontSize: 13 }}
      >
        Know more
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14" />
          <path d="m12 5 7 7-7 7" />
        </svg>
      </span>
    </motion.div>,
    document.body
  );
}
