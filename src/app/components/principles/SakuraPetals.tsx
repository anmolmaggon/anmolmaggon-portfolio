import { useId } from "react";
import { motion, useReducedMotion } from "motion/react";

/**
 * "一期一会" hover scene — cherry-blossom petals always drifting down the row;
 * hovering simply fades them in (so they're already mid-fall). Transience, the
 * fleeting moment. Behind the text, pointer-events off, color only as story.
 */

type PetalSpec = {
  x: string;
  delay: number;
  duration: number;
  scale: number;
  drift: number; // sideways sway (px)
  rot: number; // total rotation
};

const PETALS: PetalSpec[] = [
  { x: "10%", delay: 0, duration: 7, scale: 1.3, drift: 34, rot: 160 },
  { x: "24%", delay: 1.4, duration: 8.5, scale: 1.0, drift: -46, rot: -130 },
  { x: "39%", delay: 3.2, duration: 7.8, scale: 1.45, drift: 54, rot: 210 },
  { x: "53%", delay: 0.7, duration: 9, scale: 1.15, drift: -32, rot: -170 },
  { x: "67%", delay: 2.3, duration: 8, scale: 1.35, drift: 44, rot: 180 },
  { x: "80%", delay: 4.1, duration: 9.5, scale: 0.95, drift: -54, rot: -150 },
  { x: "91%", delay: 1.0, duration: 8.2, scale: 1.1, drift: 38, rot: 150 },
];

function Petal({ scale }: { scale: number }) {
  const id = useId();
  return (
    <svg
      width={24 * scale}
      height={22 * scale}
      viewBox="0 0 22 20"
      fill="none"
      style={{ display: "block" }}
    >
      <defs>
        <radialGradient id={id} cx="0.4" cy="0.3" r="0.85">
          <stop offset="0%" stopColor="#fcd6e6" />
          <stop offset="100%" stopColor="#ec99b8" />
        </radialGradient>
      </defs>
      <path
        d="M11 0 C 17 4, 22 9, 17 17 C 14.5 20, 11.5 19, 11 18.2 C 10.5 19, 7.5 20, 5 17 C 0 9, 5 4, 11 0 Z"
        fill={`url(#${id})`}
      />
    </svg>
  );
}

export function SakuraPetals({ active }: { active: boolean }) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-[1] overflow-hidden"
      initial={false}
      animate={{ opacity: active ? 1 : 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {!reduce &&
        PETALS.map((p, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{ left: p.x, willChange: "top, transform" }}
            animate={{
              top: ["-12%", "118%"],
              x: [0, p.drift, p.drift * 0.4, p.drift, 0],
              rotate: [0, p.rot],
            }}
            transition={{
              top: { duration: p.duration, repeat: Infinity, delay: p.delay, ease: "linear" },
              x: { duration: p.duration, repeat: Infinity, delay: p.delay, ease: "easeInOut" },
              rotate: { duration: p.duration, repeat: Infinity, delay: p.delay, ease: "linear" },
            }}
          >
            <Petal scale={p.scale} />
          </motion.div>
        ))}
    </motion.div>
  );
}
