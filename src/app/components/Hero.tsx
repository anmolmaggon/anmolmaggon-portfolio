import { HeroAudio } from "./hero/HeroAudio";
import { motion } from "motion/react";

/* Full-bleed dawn meadow. Same world as the closing scene's noon meadow
   (footer-bg.png) but at first light and with no figure - the empty world
   before you arrive. The closing scene is the same place at full day with
   the figure lying back in it, so scrolling top-to-bottom reads as sunrise
   into full day. The golden swirling light-ring is the shared motif. */

export function Hero() {
  return (
    <section id="top" className="relative w-full h-[100svh] [@media(min-height:640px)]:min-h-[640px] bg-ink overflow-hidden z-20">
      <div className="absolute inset-0">
          <picture>
            <source media="(max-width: 768px)" srcSet="/hero-mobile-fallback.webp" />
            <img
              src="/Hero Image Portal.webp"
              alt="Portal Landscape"
              className="w-full h-full object-cover"
              fetchPriority="high"
            />
          </picture>
        </div>
        {/* Scrim darkens at the TOP now (headline moved up) with a gentle wash at
            bottom for the pill nav area. Desktop keeps a soft vignette; mobile
            darkens earlier at top for the larger headline. */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none hidden md:block"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 25%, rgba(0,0,0,0) 50%, rgba(0,0,0,0) 75%, rgba(0,0,0,0.3) 100%)",
          }}
        />
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none md:hidden"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.35) 30%, rgba(0,0,0,0) 50%, rgba(0,0,0,0) 70%, rgba(0,0,0,0.4) 100%)",
          }}
        />

        {/* ── Name badge — top-right (AirSide-style logo placement) ────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          className="absolute top-8 right-6 md:right-10 pointer-events-none"
        >
          <span
            className="italic font-[Nyght_Serif] text-white text-lg md:text-xl font-medium tracking-tight"
            style={{
              textShadow:
                "0 0 12px rgba(255,255,255,0.4), 0 0 36px rgba(255,180,116,0.25)",
            }}
          >
            Anmol Maggon
          </span>
        </motion.div>

        {/* ── Headline — top-left (AirSide-style) ──────────────────────────── */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="absolute left-0 right-0 top-0 px-gutter md:px-gutter-lg pt-20 md:pt-24 pointer-events-none"
        >
          <h1
            className="font-[Nyght_Serif] text-white max-w-5xl text-fluid-hero leading-display font-normal tracking-[-0.03em]"
            style={{
              textShadow:
                "0 0 18px rgba(255,255,255,0.55), 0 0 48px rgba(255,180,116,0.35), 0 0 90px rgba(255,120,80,0.2)",
            }}
          >
            I make things that
            <br />
            blow people's minds.
          </h1>

          {/* Company line — directly below headline, all viewports */}
          <div className="mt-5 md:mt-6 text-white font-sans uppercase tracking-widest text-micro md:text-meta font-medium opacity-90 drop-shadow-md">
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

        <HeroAudio />
    </section>
  );
}
