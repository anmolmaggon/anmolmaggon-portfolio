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

// How far past the #work section top the "Work" nav link lands (px) — a bit deeper so
// the "Recent work." heading clears the fixed nav. Tunable dial.
const WORK_NAV_OFFSET = 120;

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
          'a[href="#work"]',
        ) as HTMLAnchorElement | null;
        if (!a) return;
        e.preventDefault();
        const work = document.querySelector("#work") as HTMLElement | null;
        // land a bit deeper past the section top (heading clears the nav)
        const top = work ? work.getBoundingClientRect().top + window.scrollY + WORK_NAV_OFFSET : 0;
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
      // #work: scroll to the Work section's real position.
      if (id === "#work") {
        e.preventDefault();
        const work = document.querySelector("#work");
        if (work) lenis.scrollTo(work as HTMLElement, { offset: WORK_NAV_OFFSET });
        return;
      }
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        lenis.scrollTo(target as HTMLElement, { offset: 0 });
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
