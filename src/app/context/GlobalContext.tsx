import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from "react";

export type MediaViewerData =
  | { type: "photo"; url: string; alt?: string }
  | { type: "video"; videoId: string; title?: string }
  | null;

interface GlobalContextValue {
  // Audio state
  isMuted: boolean;
  toggleMute: () => void;
  setMuted: (v: boolean) => void;
  // Whether the hero track is ACTUALLY audible right now (playing + not muted).
  // Drives the mute button's icon so a blocked/silent autoplay shows as muted.
  musicPlaying: boolean;
  setMusicPlaying: (v: boolean) => void;
  // True while the hero track is buffering/loading after an unmute request — drives a
  // spinner on the mute button so a tap doesn't read as "on" before sound actually starts.
  audioLoading: boolean;
  setAudioLoading: (v: boolean) => void;
  // Lets the mute button ask the hero to start playback DIRECTLY inside the click
  // handler (reliable on mobile). The hero registers its play fn; the button calls it.
  requestMusicPlay: () => void;
  registerMusicPlay: (fn: (() => void) | null) => void;
  isBackgroundAudioPaused: boolean;
  pauseBackgroundAudio: () => void;
  resumeBackgroundAudio: () => void;

  // Media viewer state
  mediaViewerData: MediaViewerData;
  openMediaViewer: (data: MediaViewerData) => void;
  closeMediaViewer: () => void;
}

const GlobalContext = createContext<GlobalContextValue | undefined>(undefined);

export function GlobalProvider({ children }: { children: ReactNode }) {
  // Initialize from localStorage if available
  const [isMuted, setIsMuted] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("gussa_is_muted") === "true";
    }
    return false;
  });

  const [isBackgroundAudioPaused, setIsBackgroundAudioPaused] = useState(false);
  const [mediaViewerData, setMediaViewerData] = useState<MediaViewerData>(null);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [audioLoading, setAudioLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem("gussa_is_muted", isMuted.toString());
  }, [isMuted]);

  const toggleMute = () => setIsMuted((prev) => !prev);
  const setMuted = (v: boolean) => setIsMuted(v);

  // The hero owns the YT player; it registers a direct play fn here so the mute
  // button can start playback synchronously inside its click (mobile-safe).
  const musicPlayRef = useRef<(() => void) | null>(null);
  const registerMusicPlay = (fn: (() => void) | null) => {
    musicPlayRef.current = fn;
  };
  const requestMusicPlay = () => musicPlayRef.current?.();
  const pauseBackgroundAudio = () => setIsBackgroundAudioPaused(true);
  const resumeBackgroundAudio = () => setIsBackgroundAudioPaused(false);

  const openMediaViewer = (data: MediaViewerData) => {
    setMediaViewerData(data);
    pauseBackgroundAudio();
  };

  const closeMediaViewer = () => {
    setMediaViewerData(null);
    resumeBackgroundAudio();
  };

  return (
    <GlobalContext.Provider
      value={{
        isMuted,
        toggleMute,
        setMuted,
        musicPlaying,
        setMusicPlaying,
        audioLoading,
        setAudioLoading,
        requestMusicPlay,
        registerMusicPlay,
        isBackgroundAudioPaused,
        pauseBackgroundAudio,
        resumeBackgroundAudio,
        mediaViewerData,
        openMediaViewer,
        closeMediaViewer,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}

export function useGlobalContext() {
  const context = useContext(GlobalContext);
  if (context === undefined) {
    throw new Error("useGlobalContext must be used within a GlobalProvider");
  }
  return context;
}
