import { useEffect, useRef, useState } from "react";
import type { UIEvent } from "react";

/**
 * Reveal-on-scroll for a long, internally-scrolling surface (e.g. the case-study
 * modal). A compact header appears once scrolled past `threshold` px; a footer
 * shows while scrolled but not yet at the end. Resets to the top whenever
 * `resetKey` changes (e.g. switching to a different case study).
 *
 * Wire it up:
 *   const { scrollRef, isScrolled, atEnd, onScroll } = useRevealOnScroll(study);
 *   <div ref={scrollRef} onScroll={onScroll}> … </div>
 *   header: isScrolled ? shown : hidden
 *   footer: isScrolled && !atEnd ? shown : hidden
 */
export function useRevealOnScroll(resetKey: unknown, threshold = 100) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [atEnd, setAtEnd] = useState(false);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
    setIsScrolled(false);
    setAtEnd(false);
  }, [resetKey]);

  const onScroll = (e: UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    setIsScrolled(el.scrollTop > threshold);
    setAtEnd(el.scrollTop + el.clientHeight >= el.scrollHeight - threshold);
  };

  return { scrollRef, isScrolled, atEnd, onScroll };
}
