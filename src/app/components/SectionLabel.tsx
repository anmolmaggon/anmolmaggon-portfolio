import type { HTMLAttributes, ReactNode } from "react";

/**
 * SectionLabel — the editorial eyebrow above a section's content.
 * This is the ONLY all-caps treatment in the system (DESIGN.md Golden Rule G4):
 * write the children in sentence case; `uppercase` does the casing.
 * Pass layout classes (mb-*, text-center) via `className`.
 */
export function SectionLabel({
  children,
  className = "",
  ...rest
}: HTMLAttributes<HTMLParagraphElement> & { children: ReactNode }) {
  return (
    <p
      className={`font-sans font-medium text-label uppercase tracking-wider text-ink-label ${className}`.trim()}
      {...rest}
    >
      {children}
    </p>
  );
}
