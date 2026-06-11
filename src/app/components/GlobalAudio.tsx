import { useEffect, useRef, useState } from "react";
import { useGlobalContext } from "../context/GlobalContext";

declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
    YT: any;
  }
}

export function GlobalAudio() {
  const { isMuted, isBackgroundAudioPaused } = useGlobalContext();
  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isApiReady, setIsApiReady] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    // 1. Load the YouTube IFrame API script
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = () => {
        setIsApiReady(true);
      };
    } else {
      setIsApiReady(true);
    }
  }, []);

  useEffect(() => {
    // 2. Initialize the player once API is ready
    if (isApiReady && !playerRef.current && containerRef.current) {
      playerRef.current = new window.YT.Player(containerRef.current, {
        videoId: "Wy1ryWrX9ac", // End Titles - Lisa Gerrard
        playerVars: {
          autoplay: 1,
          loop: 1,
          playlist: "Wy1ryWrX9ac", // Required for looping single video
          controls: 0,
          showinfo: 0,
          rel: 0,
          enablejsapi: 1,
        },
        events: {
          onReady: (event: any) => {
            // Attempt to play immediately (often fails due to browser policy)
            event.target.playVideo();
            if (isMuted) {
              event.target.mute();
            } else {
              event.target.unMute();
            }
          },
          onStateChange: (event: any) => {
            // Handle loop re-trigger or other states if necessary
          },
        },
      });
    }
  }, [isApiReady]);

  // Handle User Interaction for Autoplay bypass
  useEffect(() => {
    const handleInteraction = () => {
      if (!hasInteracted && playerRef.current && typeof playerRef.current.playVideo === "function") {
        setHasInteracted(true);
        if (!isBackgroundAudioPaused) {
          playerRef.current.playVideo();
        }
      }
    };

    window.addEventListener("click", handleInteraction, { once: true });
    window.addEventListener("scroll", handleInteraction, { once: true });
    window.addEventListener("touchstart", handleInteraction, { once: true });

    return () => {
      window.removeEventListener("click", handleInteraction);
      window.removeEventListener("scroll", handleInteraction);
      window.removeEventListener("touchstart", handleInteraction);
    };
  }, [hasInteracted, isBackgroundAudioPaused]);

  // Handle Mute State
  useEffect(() => {
    if (playerRef.current && typeof playerRef.current.mute === "function") {
      if (isMuted) {
        playerRef.current.mute();
      } else {
        playerRef.current.unMute();
      }
    }
  }, [isMuted]);

  // Handle Pause State with Fade
  const fadeIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (playerRef.current && typeof playerRef.current.getPlayerState === "function") {
      const player = playerRef.current;

      if (fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current);
        fadeIntervalRef.current = null;
      }

      if (isBackgroundAudioPaused) {
        // Fade out
        let vol = player.getVolume();
        fadeIntervalRef.current = window.setInterval(() => {
          vol -= 5;
          if (vol <= 0) {
            player.setVolume(0);
            player.pauseVideo();
            if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
          } else {
            player.setVolume(vol);
          }
        }, 50);
      } else {
        if (hasInteracted) {
          if (player.getPlayerState() !== 1 || player.getVolume() < 100) {
            // Fade in
            player.playVideo();
            let vol = player.getVolume() || 0;
            fadeIntervalRef.current = window.setInterval(() => {
              vol += 5;
              if (vol >= 100) {
                player.setVolume(100);
                if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
              } else {
                player.setVolume(vol);
              }
            }, 50);
          }
        }
      }
    }
  }, [isBackgroundAudioPaused, hasInteracted]);

  return (
    <div
      ref={containerRef}
      style={{
        position: "absolute",
        top: "-9999px",
        left: "-9999px",
        width: "1px",
        height: "1px",
        opacity: 0,
        pointerEvents: "none",
      }}
      aria-hidden="true"
    />
  );
}
