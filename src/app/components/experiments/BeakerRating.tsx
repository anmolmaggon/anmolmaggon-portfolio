/**
 * Beaker fun-rating component.
 * Renders 5 beaker SVG icons, filled up to the given rating.
 */

function BeakerIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      className={`beaker ${filled ? 'beaker--filled' : ''}`}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Beaker outline */}
      <path
        d="M9 3V8.4C9 8.73 8.86 9.05 8.62 9.29L5.04 12.87C3.59 14.32 3.59 16.68 5.04 18.13L6.87 19.96C8.32 21.41 10.68 21.41 12.13 19.96L18.96 13.13C20.41 11.68 20.41 9.32 18.96 7.87L15.38 4.29C15.14 4.05 15 3.73 15 3.4V3"
        stroke={filled ? '#8a6a10' : '#8a7e6e'}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={filled ? 'rgba(180,140,40,0.15)' : 'none'}
      />
      {/* Liquid level */}
      {filled && (
        <path
          d="M6.5 16.5C7 15.5 8.5 14 10 14C11.5 14 13 15.5 13.5 16.5"
          stroke="#8a6a10"
          strokeWidth="1"
          strokeLinecap="round"
          opacity="0.5"
        />
      )}
      {/* Top rim */}
      <path
        d="M7.5 3H16.5"
        stroke={filled ? '#8a6a10' : '#8a7e6e'}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function BeakerRating({ rating }: { rating: number }) {
  return (
    <div className="beaker-rating">
      {[1, 2, 3, 4, 5].map((i) => (
        <BeakerIcon key={i} filled={i <= rating} />
      ))}
    </div>
  );
}
