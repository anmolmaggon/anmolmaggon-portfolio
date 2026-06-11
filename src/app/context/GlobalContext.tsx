import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type MediaViewerData =
  | { type: "photo"; url: string; alt?: string }
  | { type: "video"; videoId: string; title?: string }
  | null;

interface GlobalContextValue {
  // Audio state
  isMuted: boolean;
  toggleMute: () => void;
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

  useEffect(() => {
    localStorage.setItem("gussa_is_muted", isMuted.toString());
  }, [isMuted]);

  const toggleMute = () => setIsMuted((prev) => !prev);
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
