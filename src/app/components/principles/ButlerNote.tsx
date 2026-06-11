import { useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, useMotionValue, useSpring } from "motion/react";

/**
 * "Unreasonable Hospitality" hover scene. On hover the row floods with the
 * book's cover yellow (#ffe30b), and an aura-gradient note (centred on the
 * cursor, sharp-edged, set in the display serif) follows along — a disarmingly
 * personal touch left just for the visitor.
 */

const SIZE = 236;

export function ButlerNote({ active }: { active: boolean }) {
  const x = useMotionValue(-600);
  const y = useMotionValue(-600);
  const sx = useSpring(x, { stiffness: 300, damping: 28, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 300, damping: 28, mass: 0.5 });

  // Track the cursor continuously (even while hidden) so the note is already
  // under the pointer when it fades in — no glide-in from off-screen.
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [x, y]);

  return (
    <>
      {/* soft yellow wash (book-cover hue), dissolving at the edges like the water */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 inset-x-[-24px] md:inset-x-[-40px] -z-[1] transition-opacity duration-300 ease-out"
        style={{
          background:
            "radial-gradient(72% 130% at 50% 50%, rgba(255,222,60,0.50), rgba(255,232,120,0.16) 55%, rgba(255,240,170,0) 80%)",
          maskImage:
            "linear-gradient(to right, transparent 0%, #000 20%, #000 80%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0%, #000 20%, #000 80%, transparent 100%)",
          opacity: active ? 1 : 0,
        }}
      />

      {/* cursor-attached aura note (centred on the pointer) */}
      {typeof document !== "undefined" &&
        createPortal(
          <motion.div
            aria-hidden
            className="pointer-events-none fixed left-0 top-0 z-[9999]"
            style={{ x: sx, y: sy }}
            initial={false}
            animate={{ opacity: active ? 1 : 0, scale: active ? 1 : 0.88 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <div
              className="font-[Nyght_Serif]"
              style={{
                position: "absolute",
                left: -SIZE / 2,
                top: -SIZE / 2,
                width: SIZE,
                height: SIZE,
                transform: "rotate(-3deg)",
                background: "#fdfcf6",
                boxShadow:
                  "0 34px 70px -24px rgba(0,0,0,0.40), 0 2px 10px rgba(0,0,0,0.08)",
                overflow: "hidden",
                color: "#27231e",
              }}
            >
              {/* soft warm aura */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "radial-gradient(58% 54% at 50% 50%, rgba(255,201,52,0.92) 0%, rgba(255,221,110,0.45) 36%, rgba(255,240,200,0) 72%)",
                }}
              />
              {/* message */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  padding: "26px 26px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <p style={{ fontSize: 21, lineHeight: 1.28, letterSpacing: "-0.01em" }}>
                  So glad you came by. Stay as long as you like.
                </p>
                <p style={{ fontSize: 18, textAlign: "right", opacity: 0.7 }}>
                  - Anmol
                </p>
              </div>
            </div>
          </motion.div>,
          document.body
        )}
    </>
  );
}
