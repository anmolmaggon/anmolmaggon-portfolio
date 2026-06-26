import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { HoverLink } from "./HoverLink";
import { ButtonCTA } from "./ui/ButtonCTA";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [onDark, setOnDark] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // The compact sticky bar appears only once the hero sequence is scrolled past.
  useEffect(() => {
    const onScroll = () => {
      const hero = document.getElementById("top");
      if (hero) setScrolled(hero.getBoundingClientRect().bottom <= 80);
      else setScrolled(window.scrollY > window.innerHeight * 0.6);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // The hero owns its own hamburger (it scrolls away with the hero); it opens this drawer via an event.
  useEffect(() => {
    const open = () => setMenuOpen(true);
    window.addEventListener("hero:open-menu", open);
    return () => window.removeEventListener("hero:open-menu", open);
  }, []);

  // Lock body scroll while the mobile menu is open, and close on Escape.
  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  // Sample the section under the nav to flip text/bg between light and dark.
  useEffect(() => {
    const syncTheme = () => {
      const sampleY = 72;
      const darkSection = Array.from(document.querySelectorAll<HTMLElement>("[data-nav-theme='dark']")).some((section) => {
        const rect = section.getBoundingClientRect();
        return rect.top <= sampleY && rect.bottom > sampleY;
      });
      setOnDark(darkSection);
    };
    syncTheme();
    window.addEventListener("scroll", syncTheme, { passive: true });
    window.addEventListener("resize", syncTheme);
    return () => {
      window.removeEventListener("scroll", syncTheme);
      window.removeEventListener("resize", syncTheme);
    };
  }, []);

  const textColor = onDark ? "text-white" : "text-brand-dark";

  const links = [
    { label: "Work", href: "#work" },
    { label: "Toolkit", href: "#stack" },
    { label: "Principles", href: "#principles" },
    { label: "Films", href: "#off-the-clock" },
    { label: "Resume ↗", href: "https://drive.google.com/file/d/1b4gRk6FrWEbgmexVSOJjAjAtYRGk7AVJ/view?usp=sharing", external: true },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 ${scrolled ? "" : "pointer-events-none"}`}
        style={{
          // iOS Safari hardening: keep the bar on its own GPU layer so it doesn't lag/drift
          // during momentum scroll or the URL-bar show/hide (classic fixed-element repaint jitter).
          transform: "translateZ(0)",
          WebkitTransform: "translateZ(0)",
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
          willChange: "transform",
        }}
      >
      {/* background plate — only once the sticky bar is showing */}
      <div
        aria-hidden
        className={`absolute inset-0 -z-10 transition-all duration-500 ease-out ${
          scrolled
            ? onDark
              ? "bg-black/80 backdrop-blur-md border-b border-white/10"
              : "bg-brand-light/95 backdrop-blur-md border-b border-black/5"
            : "bg-transparent"
        }`}
      />

      <div className={`flex items-center justify-between px-6 md:px-10 py-5 transition-colors duration-500 ${textColor}`}>
        {/* logo — hidden in the hero (name lives bottom-left of the sequence), fades in on scroll */}
        <HoverLink
          href="#top"
          className={`italic font-[Nyght_Serif] text-xl md:text-2xl tracking-tight font-medium transition-opacity duration-500 ${
            scrolled ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          Anmol Maggon
        </HoverLink>

        {/* desktop compact bar — links + CTA, only once scrolled past the hero */}
        <nav
          className={`hidden md:flex items-center gap-10 text-[16px] font-sans tracking-wide font-medium transition-opacity duration-500 ${
            scrolled ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          {links.map((l) => (
            <HoverLink
              key={l.label}
              href={l.href}
              {...(l.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            >
              {l.label}
            </HoverLink>
          ))}
          <ButtonCTA
            href="mailto:anmolmaggon40@gmail.com?subject=Let's%20chat%20about%20your%20portfolio%20%26%20work&body=Hi%20Anmol%2C%0A%0AI%20was%20just%20looking%20through%20your%20portfolio%20and%20really%20loved%20your%20work.%20I'd%20love%20to%20connect%20and%20chat%20more%20about%20what%20you're%20up%20to!%0A%0ABest%2C%0A%5BYour%20Name%5D"
            variant={onDark ? "dark" : "light"}
            className="px-5 py-2.5"
          >
            Let's Talk
          </ButtonCTA>
        </nav>

        {/* Mobile hamburger — part of the sticky bar only; in the hero the hamburger lives in the
            hero itself (so it scrolls away with it). Fades in once scrolled past the hero. */}
        <button
          type="button"
          aria-label="Open menu"
          aria-expanded={menuOpen ? "true" : "false"}
          onClick={() => setMenuOpen(true)}
          className={`md:hidden -mr-2 flex h-10 w-10 items-center justify-center rounded-full transition-all duration-500 ${textColor} ${
            scrolled ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <path d="M3 6h18M3 12h18M3 18h18" />
          </svg>
        </button>
      </div>
      </header>

      {/* Mobile full-screen drawer — sibling of <header> so the header's compositing
          layer (translateZ) doesn't trap this full-screen overlay inside it */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-[60] md:hidden pointer-events-auto bg-black text-white flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center justify-between px-6 py-5">
              <span className="italic font-[Nyght_Serif] text-xl font-medium">Anmol Maggon</span>
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setMenuOpen(false)}
                className="-mr-2 flex h-10 w-10 items-center justify-center rounded-full text-white"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>

            <nav className="flex-1 flex flex-col justify-center gap-2 px-6">
              {links.map((l, i) => (
                <motion.a
                  key={l.label}
                  href={l.href}
                  onClick={() => setMenuOpen(false)}
                  {...(l.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="font-[Nyght_Serif] py-3 text-white/90 hover:text-white transition-colors text-fluid-h2 font-normal tracking-[-0.02em] leading-[1.05]"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 + i * 0.05, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  {l.label}
                </motion.a>
              ))}
            </nav>

            <div className="px-6 pb-10">
              <ButtonCTA
                href="mailto:anmolmaggon40@gmail.com?subject=Let's%20chat%20about%20your%20portfolio%20%26%20work&body=Hi%20Anmol%2C%0A%0AI%20was%20just%20looking%20through%20your%20portfolio%20and%20really%20loved%20your%20work.%20I'd%20love%20to%20connect%20and%20chat%20more%20about%20what%20you're%20up%20to!%0A%0ABest%2C%0A%5BYour%20Name%5D"
                onClick={() => setMenuOpen(false)}
                variant="dark"
                className="justify-center w-full px-5 py-4 text-[16px]"
              >
                Let's Talk
              </ButtonCTA>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
