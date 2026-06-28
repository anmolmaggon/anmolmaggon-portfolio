import type { CSSProperties } from "react";

type Tone = "onLight" | "onDark";

const TONE: Record<Tone, string> = {
  onLight: "bg-ink-wash hover:bg-black/10 text-ink", // on cream (case-study modal)
  onDark: "bg-white/10 hover:bg-white/20 text-white", // on dark scrim (media viewer)
};

/**
 * CloseButton — the circular ✕ used to dismiss overlays.
 * `tone` picks the surface treatment; position / size / z-index come via `className`
 * (they differ per overlay). `iconSize` sets the glyph (20 in the modal, 24 in the viewer).
 */
export function CloseButton({
  onClick,
  tone = "onLight",
  iconSize = 20,
  className = "",
  style,
}: {
  onClick: () => void;
  tone?: Tone;
  iconSize?: number;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Close"
      style={style}
      className={`flex items-center justify-center rounded-full transition-colors cursor-pointer ${TONE[tone]} ${className}`.trim()}
    >
      <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    </button>
  );
}
