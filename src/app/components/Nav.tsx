import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { HoverLink } from "./HoverLink";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [onDark, setOnDark] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
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

  const lightNav = !onDark && scrolled;

  const links = [
    { label: "Work", href: "#work" },
    { label: "Toolkit", href: "#stack" },
    { label: "Principles", href: "#principles" },
    { label: "Films", href: "#off-the-clock" },
    { label: "Resume ↗", href: "https://drive.google.com/file/d/1b4gRk6FrWEbgmexVSOJjAjAtYRGk7AVJ/view?usp=sharing", external: true },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div
        aria-hidden
        className={`absolute inset-0 -z-10 transition-all duration-500 ease-out ${
          onDark
            ? "bg-[#06110f]/70 backdrop-blur-md border-b border-white/10"
            : scrolled
            ? "bg-[#fafaf7]/95 backdrop-blur-md border-b border-black/5"
            : "bg-gradient-to-b from-black/50 via-black/20 to-transparent"
        }`}
      />
      <div
        className={`flex items-center justify-between px-6 md:px-10 py-5 transition-colors duration-500 ${
          lightNav ? "text-black" : "text-white"
        }`}
      >
        <HoverLink 
          href="#top" 
          className="italic font-[Nyght_Serif] text-xl md:text-2xl tracking-tight" 
          style={{ fontWeight: 500 }}
        >
          Anmol Maggon
        </HoverLink>
        <nav
          className="hidden md:flex items-center gap-10 text-[16px] font-sans tracking-wide font-medium"
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
          
          {/* Primary CTA Button */}
          <a 
            href="mailto:anmolmaggon40@gmail.com"
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full backdrop-blur-sm transition-all duration-300 border font-sans font-medium text-[15px] ${
              onDark
                ? "bg-white text-black border-white hover:bg-white/90 hover:scale-105"
                : scrolled 
                ? "bg-black text-white border-black hover:bg-black/80 hover:scale-105" 
                : "bg-white/10 text-white border-white/20 hover:bg-white/20 hover:border-white/40 hover:scale-105 hover:shadow-[0_0_15px_rgba(255,255,255,0.2)]"
            }`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
            Let's Talk
          </a>
        </nav>
        {/* Mobile hamburger */}
        <button
          type="button"
          aria-label="Open menu"
          aria-expanded={menuOpen ? "true" : "false"}
          onClick={() => setMenuOpen(true)}
          className={`md:hidden -mr-2 flex h-10 w-10 items-center justify-center rounded-full transition-colors ${
            lightNav ? "text-black" : "text-white"
          }`}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <path d="M3 6h18M3 12h18M3 18h18" />
          </svg>
        </button>
      </div>

      {/* Mobile full-screen drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-[60] md:hidden bg-[#06110f] text-white flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center justify-between px-6 py-5">
              <span className="italic font-[Nyght_Serif] text-xl" style={{ fontWeight: 500 }}>
                Anmol Maggon
              </span>
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
                  className="font-[Nyght_Serif] py-3 text-white/90 hover:text-white transition-colors"
                  style={{ fontSize: "clamp(34px, 11vw, 56px)", lineHeight: 1.05, fontWeight: 400, letterSpacing: "-0.02em" }}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 + i * 0.05, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  {l.label}
                </motion.a>
              ))}
            </nav>

            <div className="px-6 pb-10">
              <a
                href="mailto:anmolmaggon40@gmail.com"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full px-5 py-4 rounded-full bg-white text-black font-sans font-medium text-[16px]"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                Let's Talk
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
