import { HeroCanvas } from "./hero/HeroCanvas";
import { HeroAudio } from "./hero/HeroAudio";
import { motion } from "motion/react";

export function Hero() {
  return (
    <section id="top" className="relative w-full">
      <div className="relative w-full h-[100svh] min-h-[640px] bg-black overflow-hidden">
        <div className="absolute inset-0">
          <HeroCanvas />
        </div>

        {/* No gradient overlay — pure black background */}

        <div className="absolute left-0 right-0 bottom-0 px-6 md:px-10 pb-20 md:pb-24 pointer-events-none">
          <h1
            className="font-[Nyght_Serif] text-white max-w-5xl"
            style={{
              fontSize: "clamp(28px, 4.5vw, 72px)",
              lineHeight: 1.0,
              fontWeight: 400,
              letterSpacing: "-0.03em",
              textShadow:
                "0 0 18px rgba(255,255,255,0.55), 0 0 48px rgba(255,180,116,0.35), 0 0 90px rgba(255,120,80,0.2)",
            }}
          >
            I make things that
            <br />
            blow people's mind.
          </h1>
        </div>

        {/* Sleek Company Bottom Bar */}
        <div className="absolute bottom-8 left-6 md:left-10 text-white font-sans text-[12px] md:text-[14px] uppercase tracking-widest font-medium pointer-events-none hidden md:flex items-center gap-6">
          <span className="opacity-40 text-[10px]">Places I've shaped:</span>
          <div className="flex items-center gap-6 opacity-90">
             {/* Partner logos with grayscale -> color hover effect */}
             <span className="opacity-100 hover:opacity-70 transition-opacity cursor-pointer pointer-events-auto">AmbitionBox</span>
             <span className="opacity-100 hover:opacity-70 transition-opacity cursor-pointer pointer-events-auto">Draup</span>
             <span className="opacity-100 hover:opacity-70 transition-opacity cursor-pointer pointer-events-auto">Avathi</span>
             <span className="opacity-100 hover:opacity-70 transition-opacity cursor-pointer pointer-events-auto">Roamhome</span>
          </div>
        </div>

        {/* Sleek Scroll Nudge */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-8 flex flex-col items-center gap-4 pointer-events-none opacity-50">
          <span className="text-white font-sans text-[10px] uppercase tracking-[0.4em] font-light">Scroll</span>
          <div className="w-[1px] h-12 bg-white/20 relative overflow-hidden">
            <motion.div
              className="absolute top-0 left-0 w-full h-1/2 bg-white"
              animate={{ y: ["-100%", "200%"] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            />
          </div>
        </div>

        <HeroAudio />
      </div>
    </section>
  );
}
