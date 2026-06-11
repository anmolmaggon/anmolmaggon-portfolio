import { useGlobalContext } from "../../context/GlobalContext";

/* ─── HeroAudio ──────────────────────────────────────────────────────────
   Manages the global mute toggle button.
   The actual audio playback is now handled by GlobalAudio.tsx.
   ────────────────────────────────────────────────────────────────────── */

export function HeroAudio() {
  const { isMuted, toggleMute } = useGlobalContext();

  return (
    <button
      onClick={toggleMute}
      aria-label={isMuted ? "Unmute background music" : "Mute background music"}
      className="fixed bottom-10 right-6 md:right-10 md:bottom-12 z-[90] w-11 h-11 rounded-full
                 bg-black/30 backdrop-blur-md border border-white/20
                 flex items-center justify-center text-white
                 hover:bg-black/50 hover:scale-105 transition-all duration-300
                 cursor-pointer shadow-lg"
      style={{ pointerEvents: "auto" }}
    >
      {isMuted ? (
        /* Muted icon */
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <line x1="23" y1="9" x2="17" y2="15" />
          <line x1="17" y1="9" x2="23" y2="15" />
        </svg>
      ) : (
        /* Unmuted icon */
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
        </svg>
      )}
    </button>
  );
}
