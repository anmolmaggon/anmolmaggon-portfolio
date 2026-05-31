import { useEffect, useState } from "react";
import { HoverLink } from "./HoverLink";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { label: "Work", href: "#work" },
    { label: "Films", href: "#films" },
    { label: "About", href: "#about" },
    { label: "Resume ↗", href: "/resume.pdf", italic: false, external: true },
    { label: "Contact →", href: "#contact", italic: true },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div
        aria-hidden
        className={`absolute inset-0 -z-10 transition-all duration-500 ease-out ${
          scrolled
            ? "bg-[#fafaf7]/95 backdrop-blur-md"
            : "bg-gradient-to-b from-black/55 via-black/20 to-transparent"
        }`}
      />
      <div
        className={`flex items-center justify-between px-6 md:px-10 py-5 transition-colors duration-500 ${
          scrolled ? "text-black" : "text-white"
        }`}
      >
        <HoverLink href="#top" className="italic font-[Nyght_Serif]" style={{ fontWeight: 500 }}>
          Anmol Maggon
        </HoverLink>
        <nav
          className="hidden md:flex items-center gap-10 text-[15px] font-[Nyght_Serif]"
          style={{ fontWeight: 400 }}
        >
          {links.map((l) => (
            <HoverLink
              key={l.label}
              href={l.href}
              className={l.italic ? "italic" : ""}
              {...(l.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            >
              {l.label}
            </HoverLink>
          ))}
        </nav>
        <a href="#contact" className="md:hidden italic font-[Nyght_Serif]">
          Menu
        </a>
      </div>
    </header>
  );
}
