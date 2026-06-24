import { useEffect, useState } from "react";

/**
 * Minimal branded loader — shows on every full page load (mounted once in App,
 * so in-app route changes don't re-trigger it). Holds the cosmic hero behind a
 * clean wordmark + subtle progress bar until the hero's first chapter (segA + rests)
 * has loaded — the hero dispatches "hero:ready" — then fades away. The ending (segB)
 * streams in afterward. Gated on a min (avoid flash) / grace (no-hero routes) / max
 * (never trap) window.
 */

const MIN_MS = 600; // don't flash if assets are already cached
const MAX_MS = 8000; // safety cap — never trap the user, even on a slow connection
const GRACE_MS = 400; // if no cosmic hero on this route, reveal after this instead of waiting
const FADE_MS = 1400; // graceful, extended dissolve into the hero

export function Loader() {
  const [fading, setFading] = useState(false);
  const [gone, setGone] = useState(false);
  // Render the wordmark only once Nyght Serif is actually loaded — otherwise it
  // first paints in the serif fallback and visibly reflows when the webfont swaps in.
  const [fontReady, setFontReady] = useState(false);
  const reduce =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    let alive = true;
    const ready = () => alive && setFontReady(true);
    const fonts = (document as Document & { fonts?: FontFaceSet }).fonts;
    if (fonts?.load) {
      fonts.load('400 40px "Nyght Serif"').then(ready, ready);
    } else {
      ready(); // very old browser — just show it
    }
    // never hide the wordmark forever if the font load stalls
    const t = window.setTimeout(ready, 1200);
    return () => {
      alive = false;
      window.clearTimeout(t);
    };
  }, []);

  useEffect(() => {
    const start = performance.now();
    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      const wait = Math.max(0, MIN_MS - (performance.now() - start));
      window.setTimeout(() => {
        // Tell the hero the loader is gone so it can safely arm its scroll/gesture
        // capture — until now the loader covered the hero and any input behind it
        // would advance chapters invisibly (jumping straight to Recent Work).
        window.__loaderDone = true;
        window.dispatchEvent(new Event("loader:done"));
        setFading(true);
      }, wait);
    };

    // Wait for the hero's first chapter (segA + rests) to finish loading — the hero
    // dispatches "hero:ready" when it's safe to reveal. (The ending streams afterward.)
    if (window.__heroReady) {
      finish();
    } else {
      window.addEventListener("hero:ready", finish, { once: true });
    }
    // If this route has no cosmic hero, don't wait on it — reveal after a short grace.
    const grace = window.setTimeout(() => {
      if (!window.__heroMounted) finish();
    }, GRACE_MS);
    const maxT = window.setTimeout(finish, MAX_MS);
    return () => {
      window.removeEventListener("hero:ready", finish);
      window.clearTimeout(grace);
      window.clearTimeout(maxT);
    };
  }, []);

  // unmount after the fade completes so it never intercepts input
  useEffect(() => {
    if (!fading) return;
    const t = window.setTimeout(() => setGone(true), FADE_MS);
    return () => window.clearTimeout(t);
  }, [fading]);

  if (gone) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        background: "#000", // pure black to match the hero canvas → seamless fade
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 22,
        opacity: fading ? 0 : 1,
        transition: `opacity ${FADE_MS}ms ease`,
        pointerEvents: fading ? "none" : "auto",
      }}
    >
      {/* Only the black background fades; the wordmark + bar disappear instantly
          the moment the reveal starts (they unmount when `fading` flips true). */}
      {!fading && (
        <>
          <div
            style={{
              fontFamily: "'Nyght Serif', serif",
              color: "#f5f3ee",
              fontSize: "clamp(24px, 5vw, 40px)",
              letterSpacing: "-0.02em",
              fontWeight: 400,
              // hold until the webfont is ready so it never reflows from the fallback
              opacity: fontReady ? 1 : 0,
              transition: "opacity 0.2s ease",
            }}
          >
            Anmol Maggon
          </div>
          <div
            style={{
              width: 120,
              height: 2,
              background: "rgba(245,243,238,0.14)",
              overflow: "hidden",
              borderRadius: 2,
            }}
          >
            <div
              style={{
                width: reduce ? "100%" : "40%",
                height: "100%",
                background: "rgba(245,243,238,0.7)",
                animation: reduce ? undefined : "loaderSlide 1.1s ease-in-out infinite",
              }}
            />
          </div>
          <style>{`@keyframes loaderSlide { 0%{transform:translateX(-120%)} 100%{transform:translateX(320%)} }`}</style>
        </>
      )}
    </div>
  );
}
