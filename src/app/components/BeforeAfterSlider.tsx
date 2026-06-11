import { useState } from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

type Props = {
  before: string;
  after: string;
  caption?: string;
  beforeAlt?: string;
  afterAlt?: string;
};

/**
 * Drag-to-compare before/after slider for redesign case studies.
 * Built on a native range input → keyboard accessible (arrow keys) + touch drag for free.
 * Before and after images MUST be the same crop/aspect or the divider will misalign.
 */
export function BeforeAfterSlider({
  before,
  after,
  caption,
  beforeAlt = "Before the redesign",
  afterAlt = "After the redesign",
}: Props) {
  const [pos, setPos] = useState(50);

  return (
    <figure className="w-full">
      <div className="relative w-full aspect-[16/9] overflow-hidden rounded-none bg-black/5 select-none">
        {/* Base layer: AFTER (fills, shown on the right of the divider) */}
        <ImageWithFallback
          src={after}
          alt={afterAlt}
          className="absolute inset-0 w-full h-full object-cover"
          draggable={false}
        />

        {/* Overlay: BEFORE, clipped to the left portion */}
        <ImageWithFallback
          src={before}
          alt={beforeAlt}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
          draggable={false}
        />

        {/* Corner labels */}
        <span className="pointer-events-none absolute top-4 left-4 px-3 py-1 rounded-full bg-black/60 text-white text-[10px] uppercase tracking-[0.3em]">
          Before
        </span>
        <span className="pointer-events-none absolute top-4 right-4 px-3 py-1 rounded-full bg-white/85 text-black text-[10px] uppercase tracking-[0.3em]">
          After
        </span>

        {/* Divider line + grip (decorative — the range input handles input) */}
        <div
          className="pointer-events-none absolute top-0 bottom-0 w-[2px] bg-white/90 shadow-[0_0_12px_rgba(0,0,0,0.4)]"
          style={{ left: `${pos}%`, transform: "translateX(-1px)" }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center text-black text-[14px]">
            ↔
          </div>
        </div>

        {/* The actual control: full-area, invisible, drives `pos` */}
        <input
          type="range"
          min={0}
          max={100}
          value={pos}
          onChange={(e) => setPos(Number(e.target.value))}
          aria-label="Drag to compare the design before and after the redesign"
          className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize"
        />
      </div>

      {caption && (
        <figcaption className="px-1 pt-3 italic opacity-60 text-[13px]">{caption}</figcaption>
      )}
    </figure>
  );
}
