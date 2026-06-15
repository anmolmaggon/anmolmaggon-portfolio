import { HeroAudio } from "./hero/HeroAudio";
import { motion } from "motion/react";

/* Full-bleed dawn meadow. Same world as the closing scene's noon meadow
   (footer-bg.png) but at first light and with no figure - the empty world
   before you arrive. The closing scene is the same place at full day with
   the figure lying back in it, so scrolling top-to-bottom reads as sunrise
   into full day. The golden swirling light-ring is the shared motif. */

export function Hero() {
  return (
    <section id="top" className="relative w-full h-[100svh] [@media(min-height:640px)]:min-h-[640px] bg-black overflow-hidden z-20">
      <div className="absolute inset-0">
          {/* Desktop: the original landscape-ish portal. */}
          <img
            src="/Hero Image Portal.webp"
            alt="Portal Landscape"
            className="hidden md:block w-full h-full object-cover"
          />
          {/* Mobile: a dedicated portrait crop so the tall phone frame isn't
              side-cropped. Falls back to the desktop image until the portrait
              asset (1080x2340+ / ideally 1440x3120) is supplied. */}
          <img
            src="/e8836cc6-c4cc-4e74-a775-c50bb2058f6c.png"
            alt="Portal Landscape"
            className="block md:hidden w-full h-full object-cover"
            onError={(e) => {
              const img = e.currentTarget;
              if (!img.dataset.fellBack) {
                img.dataset.fellBack = "1";
                img.src = "/Hero Image Portal.webp";
              }
            }}
          />
        </div>
        {/* Soft scrim anchored bottom-left so the headline + company list stay
            legible against the bright dawn sky. Desktop keeps the gentle wash;
            mobile darkens earlier and harder at the bottom so the larger
            headline + company line never get lost behind the tall portrait. */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none hidden md:block"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 20%, rgba(0,0,0,0) 65%, rgba(0,0,0,0.8) 100%)",
          }}
        />
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none md:hidden"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 18%, rgba(0,0,0,0) 38%, rgba(0,0,0,0.92) 100%)",
          }}
        />

        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="absolute left-0 right-0 bottom-0 px-6 md:px-10 pb-20 md:pb-24 pointer-events-none"
        >
          <h1
            className="font-[Nyght_Serif] text-white max-w-5xl text-fluid-hero leading-[1.0] font-normal tracking-[-0.03em]"
            style={{
              textShadow:
                "0 0 18px rgba(255,255,255,0.55), 0 0 48px rgba(255,180,116,0.35), 0 0 90px rgba(255,120,80,0.2)",
            }}
          >
            I make things that
            <br />
            blow people's minds.
          </h1>

          {/* Mobile-only company line: the desktop line (below) is hidden on
              mobile, so surface a compact version directly under the headline. */}
          <div className="md:hidden mt-5 text-white font-sans uppercase tracking-widest text-[11px] font-medium opacity-90 drop-shadow-md">
            Product Designer @{" "}
            <a
              href="https://www.ambitionbox.com"
              target="_blank"
              rel="noopener noreferrer"
              className="pointer-events-auto underline-offset-4 hover:underline"
            >
              AmbitionBox (InfoEdge)
            </a>
          </div>
        </motion.div>

        {/* Sleek Company Bottom Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
          className="absolute bottom-8 left-6 md:left-10 text-white font-sans text-[12px] md:text-[14px] uppercase tracking-widest font-medium pointer-events-none hidden md:flex items-center drop-shadow-md opacity-90"
        >
          <span>Product Designer @&nbsp;</span>
          <a
            href="https://www.ambitionbox.com"
            target="_blank"
            rel="noopener noreferrer"
            className="pointer-events-auto cursor-pointer underline-offset-4 hover:underline"
          >
            AmbitionBox (InfoEdge)
          </a>
        </motion.div>

        {/* Sleek Scroll Nudge */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.9 }}
          transition={{ duration: 1.2, ease: "linear", delay: 0.8 }}
          className="absolute left-1/2 -translate-x-1/2 bottom-8 hidden md:flex flex-col items-center gap-4 pointer-events-none drop-shadow-lg"
        >
          <span className="text-white font-sans text-[11px] uppercase tracking-[0.4em] font-medium">Scroll</span>
          <div className="w-[1px] h-12 bg-white/40 relative overflow-hidden">
            <motion.div
              className="absolute top-0 left-0 w-full h-1/2 bg-white"
              animate={{ y: ["-100%", "200%"] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            />
          </div>
        </motion.div>

        <HeroAudio />
    </section>
  );
}
