import { Suspense, lazy, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import jarImage from "../../imports/ab0a2d4e-fbaa-400d-9653-656a49eaf18a 1.png";

// The firefly jar pulls in three.js + @react-three/fiber/drei (the bulk of the
// JS bundle). Lazy-load it as its own chunk and only mount it once the section
// scrolls near the viewport, so it never weighs down first paint.
const FireflyJarCanvas = lazy(() => import("./FireflyJarCanvas"));

export function TechStackJar() {
  const portalRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = Boolean(useReducedMotion());
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [pinnedId, setPinnedId] = useState<string | null>(null);
  const activeId = hoveredId ?? pinnedId;

  // Defer loading the 3D chunk until the jar is about to enter the viewport.
  const [showCanvas, setShowCanvas] = useState(false);
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setShowCanvas(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShowCanvas(true);
          io.disconnect();
        }
      },
      { rootMargin: "300px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // On touch there's no hover; tapping a firefly fires pointerover→pointerout
  // and would flicker the hover state. Gate the hover setters behind a real
  // hover-capable pointer so tap (pin) drives selection cleanly on mobile.
  const [canHover, setCanHover] = useState(true);
  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const sync = () => setCanHover(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="stack"
      className="relative isolate overflow-hidden bg-[#fafaf7] px-6 pb-28 pt-20 text-[#171613] md:px-10 md:pb-20 md:pt-28"
      onClick={(e) => {
        // Tap-outside-to-deselect: clear unless the tap landed on the 3D canvas
        // (firefly taps keep their pin; empty-canvas taps are cleared by the
        // Canvas's onPointerMissed). R3F's stopPropagation doesn't stop the DOM
        // click, so guard on the canvas element here.
        if (!(e.target as HTMLElement).closest("canvas")) {
          setHoveredId(null);
          setPinnedId(null);
        }
      }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 h-full w-[64vw] opacity-70"
        style={{
          background:
            "radial-gradient(circle at 38% 48%, rgba(223, 186, 97, 0.22), rgba(243, 213, 134, 0.1) 36%, rgba(250,250,247,0) 70%)",
        }}
      />

      <div className="relative z-10 mx-auto grid min-h-[560px] max-w-[1680px] items-center gap-12 lg:grid-cols-[minmax(500px,0.9fr)_minmax(480px,600px)] lg:gap-[clamp(56px,6vw,124px)]">
        <div className="relative mx-auto aspect-[1122/1402] w-full max-w-[540px] overflow-visible md:max-w-[550px] scale-[1.18] md:scale-100 origin-center">
          
          <img
            src={jarImage}
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-10 h-full w-full object-contain drop-shadow-[0_30px_80px_rgba(35,26,12,0.18)]"
          />

          {/* Mobile: the swarm reads slightly low-and-right, so nudge the
              firefly layers up and left to sit inside the jar. */}
          <div ref={portalRef} className="absolute inset-[15%_15%_10%] z-50 pointer-events-none -translate-x-[6%] md:translate-x-0" />

          <div className="absolute inset-[15%_15%_10%] z-20 -translate-x-[6%] md:translate-x-0">
            {showCanvas && (
              <Suspense fallback={null}>
                <FireflyJarCanvas
                  portalRef={portalRef}
                  activeId={activeId}
                  pinnedId={pinnedId}
                  reduceMotion={reduceMotion}
                  onHover={(id) => { if (canHover) setHoveredId(id); }}
                  onLeave={(id) => { if (canHover) setHoveredId((current) => (current === id ? null : current)); }}
                  onPin={(id) => setPinnedId((current) => (current === id ? null : id))}
                  onClear={() => {
                    setHoveredId(null);
                    setPinnedId(null);
                  }}
                />
              </Suspense>
            )}
          </div>
          
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-[22%_20%_15%] z-[25] opacity-50 mix-blend-screen -translate-x-[6%] md:translate-x-0"
            style={{
              background:
                "radial-gradient(ellipse 50% 45% at 50% 45%, rgba(255, 217, 105, 0.25) 0%, rgba(255, 198, 88, 0.08) 45%, transparent 80%)",
            }}
          />
          <img
            src={jarImage}
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-30 h-full w-full object-contain opacity-[0.38] mix-blend-screen"
          />
        </div>

        <div className="relative z-20 max-w-[600px] pb-4 lg:pb-0">
          <h2
            className="font-[Nyght_Serif] text-[#171613] text-fluid-h2 leading-[1] font-normal tracking-[0]"
          >
            Borrowed light.
          </h2>

          <div className="mt-7 space-y-5 font-sans text-[16px] leading-[1.7] text-[#4d4a43] md:text-[18px]">
            <p>
              Tools are fireflies. They glow for a while, pull everyone closer, and make the dark feel easier to read.
            </p>
            <p>
              I catch what helps, study it closely, and use it to see further. But I try not to mistake the glow for the craft.
            </p>
            <p className="text-[#5b4512]">
              The tools move on. The taste, judgment, and care have to stay.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
