import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, useMotionValue, useSpring } from "motion/react";

/**
 * "一期一会" hover scene - the pointer becomes a hanging scroll. While the
 * principle is hovered the native cursor is hidden and a scroll follows the
 * mouse, carrying a live timestamp of the visitor's own visit: this precise
 * encounter, happening now, that can never be repeated. No next time.
 */

const W = 230;
const H = 320;
const ROD = "linear-gradient(180deg, #c39a63 0%, #9c7741 45%, #6f5230 100%)";

export function ScrollCursor({ active, touch = false }: { active: boolean; touch?: boolean }) {
  const x = useMotionValue(-600);
  const y = useMotionValue(-600);
  const sx = useSpring(x, { stiffness: 300, damping: 28, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 300, damping: 28, mass: 0.5 });
  const [now, setNow] = useState(() => new Date());

  // Track the cursor continuously (even while hidden) so the scroll is already
  // under the pointer when it fades in - no glide-in from off-screen.
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [x, y]);

  // Tick the live timestamp only while the scroll is visible.
  useEffect(() => {
    if (!active) return;
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, [active]);

  if (typeof document === "undefined") return null;

  const date = now.toLocaleDateString(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const time = now.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  return createPortal(
    <motion.div
      aria-hidden
      className="pointer-events-none fixed z-[9999]"
      style={touch ? { left: "50%", top: "50%" } : { left: 0, top: 0, x: sx, y: sy }}
      initial={false}
      animate={{ opacity: active ? 1 : 0, scale: active ? 1 : 0.9 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div style={{ position: "absolute", left: -W / 2, top: -H / 2, width: W }}>
        {/* top rod */}
        <div
          style={{
            height: 16,
            width: W + 14,
            marginLeft: -7,
            borderRadius: 8,
            background: ROD,
            boxShadow: "0 3px 8px rgba(0,0,0,0.25)",
          }}
        />
        {/* paper */}
        <div
          className="font-[Nyght_Serif]"
          style={{
            position: "relative",
            height: H - 32,
            background:
              "linear-gradient(180deg, #f6eed9 0%, #efe4c8 100%)",
            boxShadow: "inset 0 0 30px rgba(120,90,40,0.12)",
            color: "#3a2c1c",
            padding: "26px 24px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          {/* plum sprig */}
          <svg
            width="78"
            height="58"
            viewBox="0 0 78 58"
            style={{ position: "absolute", top: 8, right: 10, opacity: 0.95 }}
          >
            <path d="M2 2 C 22 14, 40 16, 64 12" stroke="#5b3b2a" strokeWidth="1.4" fill="none" />
            <path d="M30 13 C 36 22, 44 26, 52 30" stroke="#5b3b2a" strokeWidth="1.1" fill="none" />
            {[[64, 11], [54, 9], [44, 13], [33, 12], [52, 31], [48, 24]].map(([cx, cy], i) => (
              <g key={i}>
                <circle cx={cx} cy={cy} r="3.4" fill="#c0445a" />
                <circle cx={cx} cy={cy} r="1.2" fill="#f7d2cf" />
              </g>
            ))}
          </svg>

          <div>
            <div style={{ fontSize: 24, letterSpacing: "0.12em" }}>一期一会</div>
            <div
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: 10,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                opacity: 0.55,
                marginTop: 4,
              }}
            >
              ichigo ichie
            </div>
          </div>

          <p style={{ fontSize: 17, lineHeight: 1.32 }}>
            This is a unique moment in the history of time for us.
          </p>

          <div
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: 13,
              fontVariantNumeric: "tabular-nums",
              letterSpacing: "0.04em",
              opacity: 0.85,
            }}
          >
            {date}
            <br />
            {time}
          </div>
        </div>
        {/* bottom rod */}
        <div
          style={{
            height: 16,
            width: W + 14,
            marginLeft: -7,
            borderRadius: 8,
            background: ROD,
            boxShadow: "0 4px 10px rgba(0,0,0,0.28)",
          }}
        />
      </div>
    </motion.div>,
    document.body
  );
}
