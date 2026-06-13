import React, { useEffect, useRef, useState } from 'react';

export function VideoWithFallback({ className, style, ...rest }: React.VideoHTMLAttributes<HTMLVideoElement>) {
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
        className={`absolute inset-0 bg-black/5 animate-pulse transition-opacity duration-500 ${
          isLoading ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      />
      <video
        ref={videoRef}
        className={`w-full h-full object-cover transition-opacity duration-500 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        onLoadedData={handleLoadedData}
        {...rest}
      />
    </div>
  );
}
