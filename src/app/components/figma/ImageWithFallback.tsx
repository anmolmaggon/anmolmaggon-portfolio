import React, { useState } from 'react'

const ERROR_IMG_SRC =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg=='

export function ImageWithFallback(
  props: React.ImgHTMLAttributes<HTMLImageElement> & { fit?: "cover" | "contain"; mediaClassName?: string },
) {
  const [didError, setDidError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleError = () => {
    setDidError(true);
    setIsLoading(false);
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  const { src, alt, style, className, fit = "cover", mediaClassName, ...rest } = props

  return didError ? (
    <div
      className={`inline-block bg-gray-100 text-center align-middle ${className ?? ''}`}
      style={style}
    >
      <div className="flex items-center justify-center w-full h-full">
        <img src={ERROR_IMG_SRC} alt="Error loading image" {...rest} data-original-url={src} />
      </div>
    </div>
  ) : (
    <div className={`relative overflow-hidden ${className ?? ''}`} style={style}>
      <div 
        className={`absolute inset-0 bg-black/[0.07] animate-pulse transition-opacity duration-500 ${
          isLoading ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`} 
      />
      <img 
        src={src} 
        alt={alt} 
        className={`${mediaClassName ?? `w-full h-full ${fit === 'contain' ? 'object-contain' : 'object-cover'}`} transition-opacity duration-500 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        onLoad={handleLoad}
        onError={handleError}
        {...rest} 
      />
    </div>
  )
}
