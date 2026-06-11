import { useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { HoverLink } from "./HoverLink";
import { useGlobalContext } from "../context/GlobalContext";

/* Warm glow used on the closing pitch + email — a soft light bloom so the dark
   text reads as if lit from within against the bright meadow. */
const TEXT_GLOW =
  "0 0 18px rgba(255,247,230,0.55), 0 0 42px rgba(255,214,150,0.35), 0 1px 1px rgba(0,0,0,0.25)";

/* ── Closing scene ───────────────────────────────────────────────────────────
   The site's payoff. Picks up directly from "Borrowed light" above (tools are
   fireflies; the glow fades, the eye stays) and shows that same instinct off
   the clock — photographs and films, mixed into one collage wall on black.

   Then a black curtain lifts on scroll to reveal a full-bleed landscape, with
   the pitch + email CTA on the open sky and the footer overlaid on the meadow. */

const LANDSCAPE_SRC = "/footer-bg.png"; // 16:9 landscape

/* Collage wall, modelled on the moodboard reference: not a uniform grid but
   loose CLUSTERS of edge-to-edge tiles, separated by big negative-space gaps,
   with each row offset left/right so the whole thing reads tossed-on-a-table
   yet intentional. The empty gaps are real negative space.

   Implementation: a fixed 12-col / fixed-row-height CSS grid. Each item names
   its column start+span and row start+span, so clusters touch where they share
   an edge and float where they don't. `kind: "film"` tiles autoplay with sound
   on hover. */
type Item =
  | { kind: "photo"; src: string; gc: string; gr: string; alt: string }
  | { kind: "film"; videoId: string; poster: string; gc: string; gr: string; title: string };

/* gc = grid-column (start / span), gr = grid-row (start / span).
   Tiles are ~landscape (1 row tall) like the reference; clusters share rows. */
const items: Item[] = [
  // ── Band 1 — left film + photo, right cluster ─────────────────────────
  { kind: "film",  videoId: "XlFoZaffzJA", poster: "https://i.ytimg.com/vi/XlFoZaffzJA/hqdefault.jpg", gc: "1 / span 2", gr: "1 / span 1", title: "Looking for Love" },
  { kind: "photo", src: "/off-the-clock/web/DSC03565.jpg", gc: "3 / span 2", gr: "1 / span 1", alt: "Frame" },
  { kind: "photo", src: "/off-the-clock/web/IMG_8685.jpg", gc: "7 / span 2", gr: "1 / span 1", alt: "Frame" },
  { kind: "photo", src: "/off-the-clock/web/DSC02680.jpg", gc: "9 / span 2", gr: "1 / span 1", alt: "Frame" },
  { kind: "film",  videoId: "RbMKpRigf_Q", poster: "https://i.ytimg.com/vi/RbMKpRigf_Q/hqdefault.jpg", gc: "11 / span 2", gr: "1 / span 1", title: "Kuari Pass" },

  // ── Band 2 — far-left photo, centre photo, far-right film + photo ─────
  { kind: "photo", src: "/off-the-clock/web/ig-01.jpg", gc: "1 / span 2", gr: "2 / span 1", alt: "Frame" },
  { kind: "photo", src: "/off-the-clock/web/DSC01720.jpg", gc: "4 / span 2", gr: "2 / span 1", alt: "Frame" },
  { kind: "film",  videoId: "9jRRYzVPJlI", poster: "https://i.ytimg.com/vi/9jRRYzVPJlI/hqdefault.jpg", gc: "9 / span 2", gr: "2 / span 1", title: "AmbitionBox Offsite" },
  { kind: "photo", src: "/off-the-clock/web/IMG_4860.jpg", gc: "11 / span 2", gr: "2 / span 1", alt: "Frame" },

  // ── Band 3 — left pair, right film reaching the edge ──────────────────
  { kind: "photo", src: "/off-the-clock/web/DSC02747.jpg", gc: "1 / span 2", gr: "3 / span 1", alt: "Frame" },
  { kind: "photo", src: "/off-the-clock/web/DSC03573.jpg", gc: "3 / span 2", gr: "3 / span 1", alt: "Frame" },
  { kind: "photo", src: "/off-the-clock/web/Snapseed.jpg", gc: "8 / span 2", gr: "3 / span 1", alt: "Frame" },
  { kind: "film",  videoId: "DewKKNubwWE", poster: "https://i.ytimg.com/vi/DewKKNubwWE/hqdefault.jpg", gc: "11 / span 2", gr: "3 / span 1", title: "Andar Ka Bacha" },

  // ── Band 4 — left photo, centre film, right pair ──────────────────────
  { kind: "photo", src: "/off-the-clock/web/ig-02.jpg", gc: "1 / span 2", gr: "4 / span 1", alt: "Frame" },
  { kind: "film",  videoId: "5YkDM79sjQM", poster: "https://i.ytimg.com/vi/5YkDM79sjQM/hqdefault.jpg", gc: "5 / span 2", gr: "4 / span 1", title: "We think too much and feel too little" },
  { kind: "photo", src: "/off-the-clock/web/DSC02778.jpg", gc: "7 / span 2", gr: "4 / span 1", alt: "Frame" },
  { kind: "photo", src: "/off-the-clock/web/DSC01805.jpg", gc: "11 / span 2", gr: "4 / span 1", alt: "Frame" },

  // ── Band 5 — left film cluster, far-right single ──────────────────────
  { kind: "film",  videoId: "aB5HRpTt9Qw", poster: "https://i.ytimg.com/vi/aB5HRpTt9Qw/hqdefault.jpg", gc: "1 / span 2", gr: "5 / span 1", title: "D.I.F.Y." },
  { kind: "photo", src: "/off-the-clock/web/DSC03471.jpg", gc: "3 / span 2", gr: "5 / span 1", alt: "Frame" },
  { kind: "photo", src: "/off-the-clock/web/ig-03b.jpg", gc: "6 / span 2", gr: "5 / span 1", alt: "Frame" },
  { kind: "photo", src: "/off-the-clock/web/IMG_3174.jpg", gc: "8 / span 2", gr: "5 / span 1", alt: "Frame" },
  { kind: "photo", src: "/off-the-clock/web/IMG_0505_SnapseedCopy.jpg", gc: "11 / span 2", gr: "5 / span 1", alt: "Frame" },
];

/* Mobile fallback list — every tile, simply stacked. */
const mobileItems = items;

const footerLinks: [string, string][] = [
  ["Resume", "https://drive.google.com/file/d/1b4gRk6FrWEbgmexVSOJjAjAtYRGk7AVJ/view?usp=sharing"],
  ["Instagram", "https://www.instagram.com/anmol.maggon/"],
  ["YouTube", "https://www.youtube.com/@anmol.maggon"],
  ["LinkedIn", "#"], // TODO: add real LinkedIn URL
];

function FilmTile({ videoId, poster, title }: { videoId: string; poster: string; title: string }) {
  const { openMediaViewer } = useGlobalContext();

  return (
    <div
      className="group relative h-full w-full overflow-hidden bg-black cursor-pointer"
      onClick={() => openMediaViewer({ type: "video", videoId, title })}
    >
      <ImageWithFallback
        src={poster}
        alt={title}
        className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
      />

      {/* play affordance + title */}
      <div
        className="pointer-events-none absolute inset-0 flex items-end p-3 transition-opacity duration-300 opacity-100"
        style={{ background: "linear-gradient(180deg, rgba(0,0,0,0) 45%, rgba(0,0,0,0.55) 100%)" }}
      >
        <span className="flex items-center gap-2 font-sans text-[12px] text-white/90">
          <span className="grid h-5 w-5 place-items-center rounded-full bg-white/15 text-[9px] backdrop-blur-sm">▶</span>
          {title}
        </span>
      </div>
    </div>
  );
}

function PhotoCell({ src, alt }: { src: string; alt: string }) {
  const { openMediaViewer } = useGlobalContext();

  return (
    <div 
      className="group relative h-full w-full overflow-hidden bg-white/5 cursor-pointer"
      onClick={() => openMediaViewer({ type: "photo", url: src, alt })}
    >
      <ImageWithFallback
        src={src}
        alt={alt}
        className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
      />
    </div>
  );
}

export function ClosingScene() {
  const collageRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: collageRef,
    // Start fading when the bottom of the collage touches the bottom of the screen.
    // Finish fading when the bottom of the collage touches the top of the screen.
    // This perfectly matches the 100vh reveal, and avoids document-boundary overscroll bugs.
    offset: ["end end", "end start"],
  });

  return (
    <section id="contact" className="relative grid">
      {/* ── Background (Revealed Footer) ──────────────────────────────── */}
      <div className="col-start-1 row-start-1 h-full w-full z-0">
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          <FooterContent scrollYProgress={scrollYProgress} />
        </div>
      </div>

      {/* ── Foreground (Curtain) ──────────────────────────────────────── */}
      <div className="col-start-1 row-start-1 relative z-10 flex flex-col pointer-events-none">
        <div ref={collageRef} className="bg-[#0c0b0d] pointer-events-auto">
          {/* ── Heading ─────────────────────────────────────────────────────── */}
          <div id="off-the-clock" className="px-6 md:px-10 pt-28 md:pt-40 pb-12 md:pb-16 scroll-mt-24">
            <div className="max-w-4xl">
              <h2
                className="font-[Nyght_Serif]"
                style={{
                  fontSize: "clamp(20px, 2.4vw, 34px)",
                  lineHeight: 1.1,
                  fontWeight: 400,
                  letterSpacing: "-0.015em",
                }}
              >
                The same eye, <span className="italic">elsewhere</span>.
              </h2>
              <p
                className="italic opacity-60 mt-4 max-w-xl"
                style={{ fontSize: "clamp(15px, 1.3vw, 18px)", lineHeight: 1.55 }}
              >
                Design taught me to solve. Cameras taught me to see.
              </p>
            </div>
          </div>

          {/* ── Collage wall ────────────────────────────────────────────────── */}
          <div className="px-6 md:px-10 pb-28 md:pb-40">
            {/* Mobile: simple stacked column */}
            <div className="flex flex-col gap-4 md:hidden">
              {mobileItems.map((t, i) => (
                <div key={i} className="aspect-[16/10]">
                  {t.kind === "film" ? (
                    <FilmTile videoId={t.videoId} poster={t.poster} title={t.title} />
                  ) : (
                    <PhotoCell src={t.src} alt={t.alt} />
                  )}
                </div>
              ))}
            </div>

            {/* Desktop: clustered collage — 12-col grid, gaps are real negative
                space. Fixed short rows keep the whole wall near one viewport. */}
            <div
              className="hidden md:grid gap-x-1.5 gap-y-2.5"
              style={{
                gridTemplateColumns: "repeat(12, minmax(0, 1fr))",
                gridAutoRows: "9.5rem",
              }}
            >
              {items.map((t, i) => (
                <div key={i} style={{ gridColumn: t.gc, gridRow: t.gr }}>
                  {t.kind === "film" ? (
                    <FilmTile videoId={t.videoId} poster={t.poster} title={t.title} />
                  ) : (
                    <PhotoCell src={t.src} alt={t.alt} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Spacer ──────────────────────────────────────────────────────── */}
        {/* This 100vh spacer allows the black collage above it to scroll completely
            off the top of the viewport, fully revealing the sticky footer underneath. */}
        <div className="h-screen w-full pointer-events-none" />
      </div>
    </section>
  );
}

function FooterContent({ scrollYProgress }: { scrollYProgress: any }) {
  const reduce = useReducedMotion();
  // Fade in the text/footer content as the background image is revealed.
  // We clamp the range so that it reaches full opacity at 0.8 and STAYS at 1,
  // preventing any fade-out at the very end of the scroll.
  const opacity = useTransform(scrollYProgress, [0.1, 0.8], [0, 1]);
  const y = useTransform(scrollYProgress, [0.1, 0.8], [50, 0]);

  return (
    <>
      <div className="absolute inset-0">
        <ImageWithFallback
          src={LANDSCAPE_SRC}
          alt=""
          aria-hidden
          className="h-full w-full object-cover"
          style={{ objectPosition: "center top" }}
        />
      </div>

      <motion.div
        className="absolute inset-0 z-20 flex flex-col"
        style={{ opacity: reduce ? 1 : opacity, y: reduce ? 0 : y }}
      >
        {/* Central vignette to ensure the white pitch text is legible against the bright sky */}
        <div 
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(circle at center, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0) 55%)"
          }}
        />

        {/* Pitch — centered, glowing, on the open band */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 md:px-10 text-center relative z-10">
          <div className="max-w-3xl">
            <p
              className="font-[Nyght_Serif] text-white"
              style={{
                fontSize: "clamp(30px, 4vw, 60px)",
                lineHeight: 1.08,
                fontWeight: 400,
                letterSpacing: "-0.02em",
                textShadow: TEXT_GLOW,
              }}
            >
              Got a <em className="italic">world worth building</em>? Let's make it real.
            </p>
            <HoverLink
              href="mailto:anmolmaggon40@gmail.com"
              className="mt-8 inline-block italic font-[Nyght_Serif] text-white"
              style={{ fontSize: "clamp(18px, 1.8vw, 24px)", fontWeight: 400, textShadow: TEXT_GLOW }}
            >
              anmolmaggon40@gmail.com →
            </HoverLink>
          </div>
        </div>

        {/* Footer bar — stronger scrim under it for legibility on the bright flowers */}
        <div className="relative z-10">
          <div
            aria-hidden
            className="absolute inset-x-0 bottom-0 top-[-6rem] pointer-events-none"
            style={{
              background:
                "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.45) 40%, rgba(0,0,0,0.95) 100%)",
            }}
          />
          <div className="relative px-6 md:px-10 pb-8 pt-16 text-white">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <ul className="flex flex-wrap items-center gap-4">
                {footerLinks.map(([label, href], idx) => (
                  <li key={label} className="flex items-center gap-4">
                    <HoverLink
                      href={href}
                      target={href.startsWith("http") ? "_blank" : undefined}
                      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="text-[14px]"
                    >
                      {label} ↗
                    </HoverLink>
                    {idx < footerLinks.length - 1 && (
                      <span className="opacity-40 select-none text-[12px]">·</span>
                    )}
                  </li>
                ))}
              </ul>
              <div className="italic text-[13px] opacity-80">
                <span>© 2026 Anmol Maggon</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}
