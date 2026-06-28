import { useState } from "react";

type Props = {
  before: string;
  after: string;
  caption?: string;
  beforeAlt?: string;
  afterAlt?: string;
  isMobileLayout?: boolean;
};

/**
 * Drag-to-compare before/after slider for redesign case studies.
 * Built on a native range input → keyboard accessible (arrow keys) + touch drag for free.
 * Supports hover-to-drag on desktop via onMouseMove.
 */
export function BeforeAfterSlider({
  before,
  after,
  caption,
  beforeAlt = "Before the redesign",
  afterAlt = "After the redesign",
  isMobileLayout = false,
}: Props) {
  const [pos, setPos] = useState(50);

  return (
    <figure className="w-full flex flex-col items-center">
      <div className={`relative w-full flex flex-col items-center ${isMobileLayout ? "max-w-[400px]" : ""}`}>
        
        {/* 1. Header Labels (Caption Style, aligned to container edges) */}
        <div className={`flex justify-between w-full mb-4 px-1 ${isMobileLayout ? "max-w-[400px]" : ""} pointer-events-none`}>
          <span className="italic opacity-60 text-label">Before</span>
          <span className="italic opacity-60 text-label">After</span>
        </div>

        {/* 2. Scrollable Container for the actual slider */}
        <div className={`w-full ${isMobileLayout ? "h-[75vh] overflow-y-auto rounded-card border border-hairline shadow-lg" : ""} bg-brand-light`}>
          <div className={`relative inline-block w-full ${!isMobileLayout ? "max-w-full overflow-hidden" : ""} select-none`}>
            {/* Base layer: AFTER. No max-h restriction so it grows fully to its natural height */}
            <img
              src={after}
              alt={afterAlt}
              className="relative w-full h-auto block object-cover"
              draggable={false}
            />

            {/* Overlay: BEFORE, clipped to the left portion */}
            <img
              src={before}
              alt={beforeAlt}
              className="absolute inset-0 w-full h-full object-cover"
              style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
              draggable={false}
            />

            {/* Divider line + grip */}
            <div
              className="pointer-events-none absolute top-0 bottom-0 w-[2px] bg-white/90 shadow-[0_0_12px_rgba(0,0,0,0.4)]"
              style={{ left: `${pos}%`, transform: "translateX(-1px)" }}
            >
              {/* The grip stays pinned near the top. On the mobile layout the
                  slider lives in its own vertical scroll container, so it's
                  `sticky` there to stay visible (and draggable) at any scroll
                  position; on desktop it's simply anchored near the top. */}
              <div
                className={`${
                  isMobileLayout ? "sticky top-6" : "absolute top-6 left-1/2"
                } -translate-x-1/2 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center text-ink text-meta`}
              >
                ↔
              </div>
            </div>

            {/* The actual control: full-area, invisible, drives `pos`. */}
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
        </div>
      </div>

      {caption && (
        <figcaption className={`pt-4 italic opacity-60 text-label text-center ${isMobileLayout ? "max-w-[400px]" : ""}`}>
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
