import React, { useEffect, useRef, useState } from 'react';

type VideoWithFallbackProps = React.VideoHTMLAttributes<HTMLVideoElement> & {
  /** object-fit of the inner <video>. Defaults to "cover" (fills + crops). Use
      "contain" to show the whole frame (letterboxed) — e.g. tall phone recordings. */
  fit?: "cover" | "contain";
  /** Override the inner <video> classes entirely (e.g. to let it size to its own
      dimensions instead of filling the wrapper). Defaults to `w-full h-full object-{fit}`. */
  mediaClassName?: string;
};

export function VideoWithFallback({ className, style, fit = "cover", mediaClassName, ...rest }: VideoWithFallbackProps) {
  const [isLoading, setIsLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleLoadedData = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    setIsLoading(false);
    if (rest.onLoadedData) {
      rest.onLoadedData(e);
    }
  };

  // Only decode while on screen: autoplaying videos pause when scrolled out of
  // view (IntersectionObserver accounts for clipping by scroll containers).
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !rest.autoPlay) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[entries.length - 1];
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { rootMargin: '100px' },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, [rest.autoPlay]);

  return (
    <div className={`relative overflow-hidden ${className ?? ''}`} style={style}>
      <div
        className={`absolute inset-0 bg-black/[0.07] animate-pulse transition-opacity duration-500 ${
          isLoading ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      />
      <video
        ref={videoRef}
        className={mediaClassName ?? `w-full h-full ${fit === "contain" ? "object-contain" : "object-cover"}`}
        onLoadedData={handleLoadedData}
        {...rest}
      />
    </div>
  );
}
