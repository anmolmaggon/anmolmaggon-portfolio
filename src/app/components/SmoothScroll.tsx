import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * The live Lenis instance, exposed so full-screen takeovers (e.g. the cosmic
 * hero's chaptered auto-play) can `stop()`/`start()` smooth scroll while they
 * own wheel/touch input. `null` when Lenis isn't running (reduced motion).
 */
export let lenisInstance: Lenis | null = null;

// Per-anchor landing offsets (px added to the section top). Positive = scroll a bit deeper;
// 0 = land at the section top. Tuned so each section's heading clears the fixed nav without
// over/under-shooting. (#work has a small pt now, so 0 is right; #off-the-clock has a large
// pt-40, so it needs a deeper landing.) Tunable dials.
const NAV_OFFSETS: Record<string, number> = {
  "#work": 30,
  "#off-the-clock": 100,
};
const offsetFor = (id: string) => NAV_OFFSETS[id] ?? 0;

/**
 * Site-wide buttery smooth scroll (Lenis) wired into GSAP's ticker so
 * ScrollTrigger stays perfectly in sync. Disabled for reduced-motion users.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    // #work scrolls to the Work section's actual position. (It used to need a hard
    // 100svh offset for a curtain layout; the cosmic hero is a fixed overlay now, so
    // the Work section is the page's first flow section — its real position is correct.)

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // No Lenis for reduced-motion users, but the #work anchor still needs the
      // viewport-offset correction (a native jump would land at the top).
      const onClick = (e: MouseEvent) => {
        const a = (e.target as HTMLElement)?.closest?.(
          'a[href^="#"]',
        ) as HTMLAnchorElement | null;
        if (!a) return;
        const id = a.getAttribute("href");
        if (!id || id === "#") return;
        const target = document.querySelector(id) as HTMLElement | null;
        if (!target) return;
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY + offsetFor(id);
        window.scrollTo({ top, behavior: "smooth" });
      };
      document.addEventListener("click", onClick);
      return () => document.removeEventListener("click", onClick);
    }

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenisInstance = lenis;

    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // smooth anchor jumps (e.g. the hero "Scroll" hint, nav links)
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement)?.closest?.(
        'a[href^="#"]',
      ) as HTMLAnchorElement | null;
      if (!a) return;
      const id = a.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        lenis.scrollTo(target as HTMLElement, { offset: offsetFor(id) });
      }
    };
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisInstance = null;
    };
  }, []);

  return <>{children}</>;
}
