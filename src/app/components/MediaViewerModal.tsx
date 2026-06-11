import { useEffect } from "react";
import { useGlobalContext } from "../context/GlobalContext";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function MediaViewerModal() {
  const { mediaViewerData, closeMediaViewer } = useGlobalContext();

  // Handle Escape key to close
  useEffect(() => {
    if (!mediaViewerData) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeMediaViewer();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    // Prevent scrolling behind the modal
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [mediaViewerData, closeMediaViewer]);

  if (!mediaViewerData) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 md:p-10"
      onClick={closeMediaViewer}
    >
      {/* Close button */}
      <button
        onClick={closeMediaViewer}
        aria-label="Close"
        className="fixed top-6 right-6 md:top-8 md:right-8 z-[110] flex items-center justify-center w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>

      {/* Content container */}
      <div 
        className="relative w-full h-full max-w-[1400px] flex items-center justify-center"
        onClick={(e) => e.stopPropagation()} // Prevent clicking media from closing modal
      >
        {mediaViewerData.type === "photo" && (
          <img
            src={mediaViewerData.url}
            alt={mediaViewerData.alt || "Photo"}
            className="max-w-full max-h-full object-contain"
          />
        )}

        {mediaViewerData.type === "video" && (
          <div className="w-full aspect-video max-h-full">
            <iframe
              src={`https://www.youtube.com/embed/${mediaViewerData.videoId}?autoplay=1&rel=0&modestbranding=1`}
              title={mediaViewerData.title || "Video"}
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
              className="w-full h-full border-0 rounded-lg shadow-2xl"
            />
          </div>
        )}
      </div>
    </div>
  );
}
