import { useRef, useState } from "react";

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
 *
 * Interaction:
 *  - Desktop: hovering across the image wipes the comparison (no click needed).
 *  - Touch/pen: press-and-drag horizontally to compare. The surface is
 *    `touch-action: pan-y`, so vertical swipes stay with the page (the modal
 *    scrolls) and only horizontal drags scrub — it never traps the scroll.
 *  - Keyboard: the range input (visually hidden, `pointer-events-none`) keeps
 *    arrow-key access for a11y.
 *
 * Height: the source shots are very tall portrait screenshots. On desktop the
 * frame is capped (`md:h-[75vh]`) with its own scroll so the comparison stays
 * contained (wheel-scroll chains to the modal at the ends). On mobile there is
 * NO inner scroll box — the shots flow in the modal so vertical swipes scroll
 * the page instead of getting trapped.
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
  const areaRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);
  const startXRef = useRef<number | null>(null);

  const scrubToClientX = (clientX: number) => {
    const el = areaRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const next = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.max(0, Math.min(100, next)));
  };

  // Desktop nicety: hover-to-wipe. Touch devices never fire mousemove.
  const handleHover = (e: React.MouseEvent) => scrubToClientX(e.clientX);

  // Touch/pen drag. Mouse keeps the hover behaviour above, so ignore it here.
  // With `touch-action: pan-y` the browser routes vertical gestures to the page
  // scroll (firing pointercancel), so we only ever scrub on horizontal drags.
  // A small horizontal threshold means a tap never scrubs — it only moves once
  // the finger has actually dragged (tap jitter is ignored).
  const DRAG_THRESHOLD = 6;
  const startDrag = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse") return;
    startXRef.current = e.clientX;
    draggingRef.current = false;
  };
  const onDragMove = (e: React.PointerEvent) => {
    if (startXRef.current === null) return;
    if (!draggingRef.current) {
      if (Math.abs(e.clientX - startXRef.current) < DRAG_THRESHOLD) return;
      draggingRef.current = true; // crossed the threshold → it's a drag
    }
    scrubToClientX(e.clientX);
  };
  const endDrag = () => {
    draggingRef.current = false;
    startXRef.current = null;
  };

  return (
    <figure className="w-full flex flex-col items-center">
      <div className={`relative w-full flex flex-col items-center ${isMobileLayout ? "max-w-[400px]" : ""}`}>

        {/* Header Labels (aligned to container edges) */}
        <div className={`flex justify-between w-full mb-4 px-1 ${isMobileLayout ? "max-w-[400px]" : ""} pointer-events-none`}>
          <span className="italic opacity-60 text-label">Before</span>
          <span className="italic opacity-60 text-label">After</span>
        </div>

        {/* Frame: fixed-height scroll viewport on desktop (contains the tall
            portrait shots); flows in the modal on mobile (vertical swipes scroll
            the page — no nested-scroll trap). */}
        <div className={`w-full bg-brand-light md:h-[75vh] md:overflow-y-auto ${isMobileLayout ? "border border-hairline" : ""}`}>
          {/* Comparison surface — full image height; drives `pos`. */}
          <div
            ref={areaRef}
            onMouseMove={handleHover}
            onPointerDown={startDrag}
            onPointerMove={onDragMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            // NOTE: no `overflow-hidden` here — that would make this the sticky
            // scroll-context and pin the grip to the (non-scrolling) surface. We
            // want the grip to stick to the real scroll container (the modal on
            // mobile, the 75vh frame on desktop). The BEFORE image is clipped by
            // clipPath, so we don't need overflow to clip it anyway.
            className="relative w-full select-none touch-pan-y cursor-ew-resize"
          >
            {/* Base layer: AFTER. h-auto so it grows to its natural height. */}
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

            {/* Divider line + grip. The line spans the full image height so any
                vertical position is draggable. The grip is `sticky` so it stays
                pinned near the top and reachable while you scroll the tall
                comparison — relative to the modal on mobile, the 75vh frame on
                desktop. */}
            <div
              className="pointer-events-none absolute top-0 bottom-0 w-[2px] bg-white/90 shadow-[0_0_12px_rgba(0,0,0,0.4)]"
              style={{ left: `${pos}%`, transform: "translateX(-1px)" }}
            >
              {/* Offset = reveal-on-scroll modal header height (h-16 / md:h-20)
                  + 12px, so the grip clears the header once it slides in. */}
              <div className="sticky top-[calc(4rem+12px)] md:top-[calc(5rem+12px)] -translate-x-1/2 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center text-ink text-meta">
                ↔
              </div>
            </div>

            {/* Keyboard-accessible control (a11y only). `pointer-events-none` so
                the surface above owns pointer/touch; focus + arrow keys work. */}
            <input
              type="range"
              min={0}
              max={100}
              value={pos}
              onChange={(e) => setPos(Number(e.target.value))}
              aria-label="Drag to compare the design before and after the redesign"
              className="pointer-events-none absolute inset-0 w-full h-full opacity-0"
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
