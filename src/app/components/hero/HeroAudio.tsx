import { useEffect } from "react";
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
  const { isMuted, setMuted, musicPlaying, audioLoading, setAudioLoading, requestMusicPlay } =
    useGlobalContext();
  // The icon reflects whether sound is ACTUALLY coming out — so a blocked/silent
  // autoplay reads as muted, not as "on but silent".
  const audible = !isMuted && musicPlaying;
  // While the track is buffering after an unmute tap, show a spinner instead of the
  // "on" icon so the button doesn't promise sound that hasn't started yet.
  const loading = audioLoading && !audible;

  // Belt-and-suspenders: once sound is genuinely playing, drop the loading state
  // (the YT PLAYING event also clears it, but this guards any missed event).
  useEffect(() => {
    if (musicPlaying) setAudioLoading(false);
  }, [musicPlaying, setAudioLoading]);

  const handleClick = () => {
    if (audible || loading) {
      // turn sound off (also cancels an in-flight load)
      setMuted(true);
      setAudioLoading(false);
    } else {
      // turn sound on: set intent unmuted AND start playback DIRECTLY in this click
      // (mobile-safe — valid user gesture; works even if autoplay was blocked).
      // Optimistically show the spinner from the instant of the tap.
      setMuted(false);
      setAudioLoading(true);
      requestMusicPlay();
    }
  };

  return (
    <button
      onClick={handleClick}
      aria-busy={loading ? "true" : "false"}
      aria-label={
        loading
          ? "Loading background music"
          : audible
          ? "Mute background music"
          : "Unmute background music"
      }
      className={`${positionClassName} z-40 w-11 h-11 rounded-full
                 bg-black/30 backdrop-blur-glass border border-white/20
                 flex items-center justify-center text-white
                 hover:bg-black/50 hover:scale-105 transition-all duration-300
                 cursor-pointer shadow-lg`}
      style={{ pointerEvents: "auto" }}
    >
      {loading ? (
        /* Loading spinner — sound was requested but is still buffering */
        <svg className="animate-spin motion-reduce:animate-none" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="12" cy="12" r="9" strokeOpacity={0.3} />
          <path d="M21 12a9 9 0 0 0-9-9" />
        </svg>
      ) : audible ? (
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
