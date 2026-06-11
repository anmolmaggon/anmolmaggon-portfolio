import { useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";

/**
 * "Everything is energy" hover scene — the pointer becomes the "Trust your
 * energy" sticker. While the principle is hovered the native cursor is hidden
 * and the sticker follows the mouse (spring-smoothed), gently bobbing, with a
 * warm soft-light halo that illuminates whatever it passes over. Portaled to
 * <body> so it's truly viewport-fixed and above everything.
 */

const SIZE = 280;
const STICKER = "/trust-your-energy-green.png"; // served from /public

export function SunCursor({ active }: { active: boolean }) {
  const reduce = useReducedMotion();
  const x = useMotionValue(-600);
  const y = useMotionValue(-600);
  const sx = useSpring(x, { stiffness: 350, damping: 30, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 350, damping: 30, mass: 0.4 });

  // Track the cursor continuously (even while hidden) so the sticker is already
  // under the pointer when it fades in — no glide-in from off-screen.
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
      style={{ x: sx, y: sy }}
      initial={false}
      animate={{ opacity: active ? 1 : 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {/* the sticker — centred on the cursor (square asset, so left/top offsets center it) */}
      <motion.div
        style={{ position: "absolute", left: -SIZE / 2, top: -SIZE / 2, width: SIZE, height: SIZE }}
        animate={reduce ? undefined : { rotate: [-4, 4, -4] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <img
          src={STICKER}
          alt=""
          draggable={false}
          style={{
            display: "block",
            width: "100%",
            height: "100%",
            objectFit: "contain",
            filter: "drop-shadow(0 8px 18px rgba(0,0,0,0.18))",
          }}
        />
      </motion.div>
    </motion.div>,
    document.body
  );
}
