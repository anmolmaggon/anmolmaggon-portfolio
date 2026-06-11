import { useId } from "react";
import { motion, useReducedMotion } from "motion/react";

/**
 * "Be a Goldfish" hover scene — a slice of water that lives under the row at
 * all times. The fish swim continuously from page load; hovering simply fades
 * the whole layer in, so you catch the shoal already mid-swim (no "entrance").
 * Color returns here only as story (warm orange), never as chrome. The layer is
 * masked to transparent on the left/right so the water dissolves into the cream
 * page background. Pointer-events off, no layout shift, behind the text.
 */

type FishSpec = {
  lane: string; // vertical position within the row
  dir: 1 | -1; // 1 = swims right, -1 = swims left
  scale: number;
  opacity: number; // depth
  blur: number; // depth
  duration: number; // swim speed
  bob: number; // vertical sway in px
};

const FISH: FishSpec[] = [
  { lane: "20%", dir: 1, scale: 0.9, opacity: 0.85, blur: 0, duration: 11, bob: 10 },
  { lane: "50%", dir: 1, scale: 1.15, opacity: 0.9, blur: 0, duration: 14, bob: 14 },
  { lane: "72%", dir: -1, scale: 0.75, opacity: 0.7, blur: 1.2, duration: 16, bob: 8 },
  { lane: "34%", dir: -1, scale: 1.0, opacity: 0.8, blur: 0.4, duration: 12.5, bob: 12 },
  { lane: "62%", dir: 1, scale: 0.6, opacity: 0.5, blur: 2, duration: 18, bob: 6 },
  { lane: "16%", dir: -1, scale: 0.7, opacity: 0.6, blur: 1.6, duration: 15, bob: 9 },
];

// Dissolve the water into the cream page background on the left & right edges.
// Wide, gradual fade so there is no visible boundary against the page.
const EDGE_MASK =
  "linear-gradient(to right, transparent 0%, #000 20%, #000 80%, transparent 100%)";

function Goldfish({ dir, scale }: { dir: 1 | -1; scale: number }) {
  const id = useId();
  return (
    <svg
      width={66 * scale}
      height={42 * scale}
      viewBox="0 0 66 42"
      fill="none"
      style={{
        transform: dir === 1 ? "scaleX(-1)" : undefined,
        overflow: "visible",
        display: "block",
      }}
    >
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f9c06a" />
          <stop offset="55%" stopColor="#ef8a4a" />
          <stop offset="100%" stopColor="#e0613a" />
        </linearGradient>
      </defs>
      {/* tail */}
      <path d="M40 21 C 54 9, 60 8, 65 4 C 60 15, 60 27, 65 38 C 60 34, 54 33, 40 21 Z" fill={`url(#${id})`} opacity="0.9" />
      {/* dorsal fin */}
      <path d="M18 11 C 24 3, 33 3, 38 10 C 30 9, 24 9, 18 11 Z" fill={`url(#${id})`} opacity="0.92" />
      {/* pelvic fin */}
      <path d="M22 30 C 26 37, 32 37, 35 31 C 30 31, 26 31, 22 30 Z" fill={`url(#${id})`} opacity="0.85" />
      {/* body */}
      <ellipse cx="23" cy="21" rx="20" ry="11" fill={`url(#${id})`} />
      {/* belly highlight */}
      <ellipse cx="20" cy="24" rx="13" ry="5" fill="#ffffff" opacity="0.18" />
      {/* eye */}
      <circle cx="9" cy="19" r="2.1" fill="#33240f" />
    </svg>
  );
}

export function GoldfishLayer({ active }: { active: boolean }) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute inset-x-[-12px] inset-y-0 -z-[5] overflow-hidden"
      style={{ maskImage: EDGE_MASK, WebkitMaskImage: EDGE_MASK }}
      initial={false}
      animate={{ opacity: active ? 1 : 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* water wash — denser teal through the centre, dissolving outward */}
      <motion.div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(90% 120% at 50% 50%, rgba(60,134,156,0.32), rgba(86,153,168,0.12) 58%, rgba(86,153,168,0) 80%)",
        }}
        animate={reduce ? undefined : { opacity: [0.8, 1, 0.8] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* caustic shimmer */}
      <motion.div
        className="absolute inset-0 mix-blend-soft-light"
        style={{
          backgroundImage:
            "repeating-linear-gradient(115deg, rgba(255,255,255,0.10) 0px, rgba(255,255,255,0) 14px, rgba(255,255,255,0) 40px)",
        }}
        animate={reduce ? undefined : { backgroundPositionX: ["0px", "80px"] }}
        transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
      />

      {/* goldfish — always swimming, regardless of hover */}
      {FISH.map((f, i) =>
        reduce ? (
          <div
            key={i}
            className="absolute"
            style={{
              top: f.lane,
              left: `${12 + i * 13}%`,
              opacity: f.opacity,
              filter: f.blur ? `blur(${f.blur}px)` : undefined,
            }}
          >
            <Goldfish dir={f.dir} scale={f.scale} />
          </div>
        ) : (
          <motion.div
            key={i}
            className="absolute"
            style={{
              top: f.lane,
              opacity: f.opacity,
              filter: f.blur ? `blur(${f.blur}px)` : undefined,
              willChange: "left, transform",
            }}
            animate={{
              left: f.dir === 1 ? ["-14%", "114%"] : ["114%", "-14%"],
              y: [0, f.bob, 0, -f.bob, 0],
              rotate: f.dir === 1 ? [0, 3, 0, -3, 0] : [0, -3, 0, 3, 0],
            }}
            transition={{
              left: { duration: f.duration, ease: "linear", repeat: Infinity },
              y: { duration: f.duration / 3, ease: "easeInOut", repeat: Infinity },
              rotate: { duration: f.duration / 3, ease: "easeInOut", repeat: Infinity },
            }}
          >
            <Goldfish dir={f.dir} scale={f.scale} />
          </motion.div>
        )
      )}
    </motion.div>
  );
}
