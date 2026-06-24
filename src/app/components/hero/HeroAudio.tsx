import { useGlobalContext } from "../../context/GlobalContext";

/* ─── HeroAudio ──────────────────────────────────────────────────────────
   Manages the global mute toggle button.
   The actual audio playback is now handled by GlobalAudio.tsx.
   ────────────────────────────────────────────────────────────────────── */

export function HeroAudio({
  // Positioning is overridable so the cosmic hero can scope the button to its
  // own stage (`absolute`, scrolls away with the hero) while the legacy hero
  // keeps the sitewide `fixed` placement.
  positionClassName = "fixed bottom-10 right-6 md:right-10 md:bottom-12",
}: {
  positionClassName?: string;
}) {
  const { isMuted, setMuted, musicPlaying, requestMusicPlay } = useGlobalContext();
  // The icon reflects whether sound is ACTUALLY coming out — so a blocked/silent
  // autoplay reads as muted, not as "on but silent".
  const audible = !isMuted && musicPlaying;

  const handleClick = () => {
    if (audible) {
      setMuted(true); // turn sound off
    } else {
      // turn sound on: set intent unmuted AND start playback DIRECTLY in this click
      // (mobile-safe — valid user gesture; works even if autoplay was blocked).
      setMuted(false);
      requestMusicPlay();
    }
  };

  return (
    <button
      onClick={handleClick}
      aria-label={audible ? "Mute background music" : "Unmute background music"}
      className={`${positionClassName} z-[90] w-11 h-11 rounded-full
                 bg-black/30 backdrop-blur-md border border-white/20
                 flex items-center justify-center text-white
                 hover:bg-black/50 hover:scale-105 transition-all duration-300
                 cursor-pointer shadow-lg`}
      style={{ pointerEvents: "auto" }}
    >
      {audible ? (
        /* Unmuted icon — sound is actually playing */
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
        </svg>
      ) : (
        /* Muted icon — user muted OR music isn't actually playing (e.g. autoplay blocked) */
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <line x1="23" y1="9" x2="17" y2="15" />
          <line x1="17" y1="9" x2="23" y2="15" />
        </svg>
      )}
    </button>
  );
}
