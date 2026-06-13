import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Site-wide buttery smooth scroll (Lenis) wired into GSAP's ticker so
 * ScrollTrigger stays perfectly in sync. Disabled for reduced-motion users.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    // The Work section (#work) is pulled to the top of the document by its
    // `-mt-[100svh]` curtain margin, so a normal anchor jump lands at the top
    // and reveals nothing. It reads correctly one viewport down, so #work must
    // scroll to a measured `100svh` instead of the element's position.
    const measureSvh = () => {
      const probe = document.createElement("div");
      probe.style.cssText =
        "position:fixed;top:0;left:0;width:0;height:100svh;visibility:hidden;pointer-events:none";
      document.body.appendChild(probe);
      const h = probe.getBoundingClientRect().height;
      probe.remove();
      return h > 0 ? h : window.innerHeight;
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // No Lenis for reduced-motion users, but the #work anchor still needs the
      // viewport-offset correction (a native jump would land at the top).
      const onClick = (e: MouseEvent) => {
        const a = (e.target as HTMLElement)?.closest?.(
          'a[href="#work"]',
        ) as HTMLAnchorElement | null;
        if (!a) return;
        e.preventDefault();
        window.scrollTo({ top: measureSvh(), behavior: "smooth" });
      };
      document.addEventListener("click", onClick);
      return () => document.removeEventListener("click", onClick);
    }

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

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
      // #work: scroll one viewport down so the curtain reveals the Work view.
      if (id === "#work") {
        e.preventDefault();
        lenis.scrollTo(measureSvh(), { offset: 0 });
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
    };
  }, []);

  return <>{children}</>;
}
